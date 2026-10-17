import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import prisma from '@/lib/prisma'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.pdf':
      return 'application/pdf'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.webp':
      return 'image/webp'
    case '.gif':
      return 'image/gif'
    case '.txt':
      return 'text/plain'
    case '.csv':
      return 'text/csv'
    default:
      return 'application/octet-stream'
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params
    if (!segments || segments.length === 0) {
      return NextResponse.json({ error: 'File not specified' }, { status: 400 })
    }

    // Prevent directory traversal
    const safeSegments = segments.map(s => s.replace(/(\.\.[\/\\])/g, ''))
    
    // Check multiple potential root locations on server
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'uploads', ...safeSegments),
      path.join(process.cwd(), 'uploads', ...safeSegments),
      path.join(process.cwd(), '..', 'public', 'uploads', ...safeSegments),
      path.join(process.cwd(), '..', 'uploads', ...safeSegments),
    ]

    let resolvedPath: string | null = null
    for (const p of possiblePaths) {
      try {
        const fileStat = await stat(p)
        if (fileStat.isFile() && fileStat.size > 0) {
          resolvedPath = p
          break
        }
      } catch {
        // try next
      }
    }

    const fileName = safeSegments[safeSegments.length - 1]
    const isDownload = req.nextUrl.searchParams.get('download') === '1'

    // If file found physically on disk, serve it
    if (resolvedPath) {
      const fileBuffer = await readFile(resolvedPath)
      const contentType = getContentType(resolvedPath)
      const disposition = isDownload ? `attachment; filename="${fileName}"` : `inline; filename="${fileName}"`

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': disposition,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // If file not found on disk, look up in database by path or filename
    const uploadUrl = `/uploads/${safeSegments.join('/')}`
    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [
          { filePath: uploadUrl },
          { filePath: { endsWith: fileName } },
          { fileName: fileName },
        ]
      },
      include: {
        client: true,
        supplier: true,
        sales: true,
        expenses: true,
      }
    })

    if (invoice) {
      // Generate official PDF voucher on-the-fly
      const pdfDoc = await PDFDocument.create()
      const timesRoman = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const timesBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      const page = pdfDoc.addPage([595.28, 841.89])
      const { width, height } = page.getSize()

      // Header Banner
      page.drawRectangle({
        x: 0,
        y: height - 100,
        width,
        height: 100,
        color: rgb(0.06, 0.09, 0.16),
      })
      page.drawRectangle({
        x: 0,
        y: height - 105,
        width,
        height: 5,
        color: rgb(0.9, 0.72, 0.41),
      })

      page.drawText('RIZNEX DIGITAL SOLUTIONS', {
        x: 40,
        y: height - 45,
        size: 18,
        font: timesBold,
        color: rgb(1, 1, 1),
      })
      page.drawText('RESTAURANT AUDIT & FINANCIAL MANAGEMENT PORTAL', {
        x: 40,
        y: height - 65,
        size: 10,
        font: timesBold,
        color: rgb(0.9, 0.72, 0.41),
      })
      page.drawText(`CLIENT: ${invoice.client.name} (${invoice.platform || invoice.supplier?.franchise || 'Combined'})`, {
        x: 40,
        y: height - 85,
        size: 10,
        font: timesRoman,
        color: rgb(0.8, 0.85, 0.9),
      })

      // Status Badge
      page.drawRectangle({
        x: width - 170,
        y: height - 60,
        width: 130,
        height: 24,
        color: rgb(0.09, 0.4, 0.2),
      })
      page.drawText('VERIFIED VOUCHER', {
        x: width - 158,
        y: height - 48,
        size: 10,
        font: timesBold,
        color: rgb(1, 1, 1),
      })

      // Metadata
      let y = height - 140
      page.drawRectangle({
        x: 40,
        y: y - 80,
        width: width - 80,
        height: 80,
        color: rgb(0.97, 0.98, 0.99),
        borderColor: rgb(0.85, 0.9, 0.95),
        borderWidth: 1,
      })

      const docType = invoice.type === 'supplier' ? 'SUPPLIER PURCHASE INVOICE' : invoice.type === 'pos' ? 'EPOS TERMINAL SALES SUMMARY' : 'PLATFORM SALES SETTLEMENT'
      const entityName = invoice.supplier?.name || invoice.platform || 'General Transaction'

      page.drawText('DOCUMENT TYPE', { x: 55, y: y - 20, size: 9, font: timesBold, color: rgb(0.4, 0.45, 0.5) })
      page.drawText(docType, { x: 55, y: y - 38, size: 14, font: timesBold, color: rgb(0.1, 0.15, 0.2) })
      page.drawText(entityName, { x: 55, y: y - 55, size: 11, font: timesBold, color: rgb(0.8, 0.55, 0.2) })
      page.drawText(`File: ${invoice.fileName}`, { x: 55, y: y - 70, size: 9, font: timesRoman, color: rgb(0.5, 0.55, 0.6) })

      const dt = invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'
      page.drawText('STATEMENT DATE', { x: width - 240, y: y - 20, size: 9, font: timesBold, color: rgb(0.4, 0.45, 0.5) })
      page.drawText(dt, { x: width - 240, y: y - 38, size: 12, font: timesBold, color: rgb(0.1, 0.15, 0.2) })

      page.drawText('AUDIT REF ID', { x: width - 240, y: y - 55, size: 9, font: timesBold, color: rgb(0.4, 0.45, 0.5) })
      page.drawText(invoice.id.slice(0, 20), { x: width - 240, y: y - 70, size: 9, font: timesRoman, color: rgb(0.3, 0.35, 0.4) })

      // Highlight Box
      y -= 110
      page.drawRectangle({
        x: 40,
        y: y - 60,
        width: width - 80,
        height: 60,
        color: rgb(0.93, 0.96, 1.0),
        borderColor: rgb(0.75, 0.85, 1.0),
        borderWidth: 1.5,
      })

      const amountFormatted = '£' + (Number(invoice.amount) || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      page.drawText('AUDITED SETTLEMENT / PURCHASE AMOUNT', { x: 55, y: y - 20, size: 9, font: timesBold, color: rgb(0.1, 0.3, 0.7) })
      page.drawText(amountFormatted, { x: 55, y: y - 48, size: 24, font: timesBold, color: rgb(0.08, 0.2, 0.5) })

      // Line items
      y -= 90
      page.drawText('LINE-ITEM FINANCIAL BREAKDOWN', { x: 40, y: y, size: 11, font: timesBold, color: rgb(0.1, 0.15, 0.2) })

      y -= 25
      page.drawRectangle({
        x: 40,
        y: y - 24,
        width: width - 80,
        height: 24,
        color: rgb(0.1, 0.15, 0.2),
      })
      page.drawText('DESCRIPTION / ITEM', { x: 55, y: y - 16, size: 9, font: timesBold, color: rgb(1, 1, 1) })
      page.drawText('AMOUNT (£ GBP)', { x: width - 150, y: y - 16, size: 9, font: timesBold, color: rgb(1, 1, 1) })

      y -= 25
      const sale = invoice.sales?.[0]
      const items = sale ? [
        { desc: 'Customer Orders Count', amt: `${sale.totalOrders}` },
        { desc: 'Gross Platform Sales', amt: `£${(sale.grossSales || 0).toFixed(2)}` },
        { desc: 'Platform Commission Fee', amt: `-£${(sale.commission || 0).toFixed(2)}` },
        { desc: 'VAT on Commission (20%)', amt: `-£${(sale.vat || 0).toFixed(2)}` },
        ...(sale.adSpends ? [{ desc: 'Marketing & Promotion Spend', amt: `-£${(sale.adSpends || 0).toFixed(2)}` }] : []),
        { desc: 'Net Payout Amount', amt: amountFormatted, isTotal: true },
      ] : [
        { desc: 'Entity / Beneficiary', amt: entityName },
        { desc: 'Transaction Classification', amt: docType },
        { desc: 'Reconciled Total Amount', amt: amountFormatted, isTotal: true },
      ]

      for (let i = 0; i < items.length; i++) {
        const it = items[i]
        const isTotal = it.isTotal
        page.drawRectangle({
          x: 40,
          y: y - 22,
          width: width - 80,
          height: 22,
          color: isTotal ? rgb(0.94, 0.99, 0.95) : i % 2 === 0 ? rgb(0.98, 0.98, 0.99) : rgb(1, 1, 1),
          borderColor: rgb(0.9, 0.92, 0.95),
          borderWidth: 0.5,
        })
        page.drawText(it.desc, { x: 55, y: y - 15, size: isTotal ? 10 : 9, font: isTotal ? timesBold : timesRoman, color: isTotal ? rgb(0.1, 0.4, 0.2) : rgb(0.2, 0.25, 0.3) })
        page.drawText(it.amt, { x: width - 150, y: y - 15, size: isTotal ? 11 : 9, font: isTotal ? timesBold : timesRoman, color: isTotal ? rgb(0.1, 0.4, 0.2) : rgb(0.1, 0.15, 0.2) })
        y -= 22
      }

      // Footer
      page.drawText('Riznex Digital Solutions • https://riznex.co.uk • Confidential Client Financial Record', {
        x: width / 2 - 180,
        y: 30,
        size: 8,
        font: timesRoman,
        color: rgb(0.6, 0.65, 0.7),
      })

      const pdfBytes = await pdfDoc.save()
      const targetSave = possiblePaths[0]

      // Cache to disk
      try {
        await mkdir(path.dirname(targetSave), { recursive: true })
        await writeFile(targetSave, Buffer.from(pdfBytes))
      } catch {
        // ignore disk cache write failure
      }

      const outFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`
      const disposition = isDownload ? `attachment; filename="${outFileName}"` : `inline; filename="${outFileName}"`

      return new NextResponse(Buffer.from(pdfBytes), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': disposition,
          'Content-Length': pdfBytes.length.toString(),
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }

    // Friendly HTML fallback if no record exists
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document Not Found | Riznex</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0c14; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background: #111520; border: 1px solid #1f2947; padding: 32px; border-radius: 16px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          h1 { font-size: 20px; margin: 0 0 12px; color: #E5B869; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 24px; }
          .btn { display: inline-block; background: #E5B869; color: #000; font-weight: 700; font-size: 13px; padding: 10px 20px; border-radius: 8px; text-decoration: none; transition: opacity 0.2s; }
          .btn:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Document Not Found</h1>
          <p>The requested file <code>${fileName}</code> is not available in the archive.</p>
          <a href="/dashboard" class="btn">Return to Dashboard</a>
        </div>
      </body>
      </html>
    `
    return new NextResponse(html, {
      status: 404,
      headers: { 'Content-Type': 'text/html' }
    })
  } catch (err: any) {
    console.error('Error serving upload file:', err)
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}
