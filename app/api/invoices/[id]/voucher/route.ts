import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

function formatGbp(val: any) {
  return '£' + (Number(val) || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dt: any) {
  if (!dt) return 'N/A';
  const d = new Date(dt);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        supplier: true,
        sales: true,
        expenses: true,
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    const pdfDoc = await PDFDocument.create()
    const timesRoman = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const timesBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const page = pdfDoc.addPage([595.28, 841.89]) // A4
    const { width, height } = page.getSize()

    // Header banner
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
      color: rgb(0.9, 0.72, 0.41), // Gold accent
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

    const clientName = invoice.client.name
    const store = invoice.platform || invoice.supplier?.franchise || 'Combined'
    page.drawText(`CLIENT: ${clientName} (${store})`, {
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

    // Invoice Meta Box
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

    page.drawText('STATEMENT DATE', { x: width - 240, y: y - 20, size: 9, font: timesBold, color: rgb(0.4, 0.45, 0.5) })
    page.drawText(formatDate(invoice.invoiceDate || invoice.createdAt), { x: width - 240, y: y - 38, size: 12, font: timesBold, color: rgb(0.1, 0.15, 0.2) })

    page.drawText('AUDIT REF ID', { x: width - 240, y: y - 55, size: 9, font: timesBold, color: rgb(0.4, 0.45, 0.5) })
    page.drawText(invoice.id.slice(0, 20), { x: width - 240, y: y - 70, size: 9, font: timesRoman, color: rgb(0.3, 0.35, 0.4) })

    // Total highlight box
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

    page.drawText('AUDITED SETTLEMENT / PURCHASE AMOUNT', { x: 55, y: y - 20, size: 9, font: timesBold, color: rgb(0.1, 0.3, 0.7) })
    page.drawText(formatGbp(invoice.amount), { x: 55, y: y - 48, size: 24, font: timesBold, color: rgb(0.08, 0.2, 0.5) })

    // Financial lines
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
      { desc: 'Gross Platform Sales', amt: formatGbp(sale.grossSales) },
      { desc: 'Platform Commission Fee', amt: `-${formatGbp(sale.commission)}` },
      { desc: 'VAT on Commission (20%)', amt: `-${formatGbp(sale.vat)}` },
      ...(sale.adSpends ? [{ desc: 'Marketing & Promotion Spend', amt: `-${formatGbp(sale.adSpends)}` }] : []),
      { desc: 'Net Payout Amount', amt: formatGbp(sale.netPaid || invoice.amount), isTotal: true },
    ] : [
      { desc: 'Entity / Beneficiary', amt: entityName },
      { desc: 'Transaction Classification', amt: docType },
      { desc: 'Reconciled Total Amount', amt: formatGbp(invoice.amount), isTotal: true },
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

    // Security & Stamp
    y -= 50
    page.drawRectangle({
      x: 40,
      y: y - 70,
      width: width - 80,
      height: 70,
      color: rgb(0.98, 0.98, 0.99),
      borderColor: rgb(0.9, 0.92, 0.95),
      borderWidth: 1,
    })

    page.drawText('CERTIFICATE OF FINANCIAL RECONCILIATION', { x: 55, y: y - 18, size: 9, font: timesBold, color: rgb(0.3, 0.35, 0.4) })
    page.drawText(`This voucher has been verified, reconciled, and audited by Riznex Digital Solutions for tax and VAT reporting.`, { x: 55, y: y - 35, size: 8, font: timesRoman, color: rgb(0.4, 0.45, 0.5) })
    page.drawText(`DIGITAL ARCHIVE ID: ${invoice.id} • GENERATED: ${new Date().toUTCString()}`, { x: 55, y: y - 55, size: 7.5, font: timesRoman, color: rgb(0.5, 0.55, 0.6) })

    // Footer
    page.drawText('Riznex Digital Solutions • https://riznex.co.uk • Confidential Client Financial Record', {
      x: width / 2 - 180,
      y: 30,
      size: 8,
      font: timesRoman,
      color: rgb(0.6, 0.65, 0.7),
    })

    const pdfBytes = await pdfDoc.save()
    const fileName = `${invoice.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}.pdf`

    const isDownload = req.nextUrl.searchParams.get('download') === '1'
    const disposition = isDownload ? `attachment; filename="${fileName}"` : `inline; filename="${fileName}"`

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': disposition,
        'Content-Length': pdfBytes.length.toString(),
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err: any) {
    console.error('Error serving invoice voucher:', err)
    return NextResponse.json({ error: 'Failed to generate invoice voucher' }, { status: 500 })
  }
}
