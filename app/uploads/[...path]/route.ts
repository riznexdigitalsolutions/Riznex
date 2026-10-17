import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat, copyFile, mkdir } from 'fs/promises'
import fs from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'

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

// Recursively find a file by base name in a directory
function findFileByName(dir: string, targetName: string): string | null {
  try {
    if (!fs.existsSync(dir)) return null
    const norm = (s: string) => s.toLowerCase().replace(/[\s\-_.]/g, '')
    const targetNorm = norm(targetName)
    const items = fs.readdirSync(dir)
    for (const item of items) {
      const full = path.join(dir, item)
      try {
        const s = fs.statSync(full)
        if (s.isDirectory()) {
          const found = findFileByName(full, targetName)
          if (found) return found
        } else if (norm(item) === targetNorm || norm(item).includes(targetNorm) || targetNorm.includes(norm(item))) {
          return full
        }
      } catch {}
    }
  } catch {}
  return null
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
    const fileName = safeSegments[safeSegments.length - 1]
    const isDownload = req.nextUrl.searchParams.get('download') === '1'

    // Check standard root locations on server
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

    // If not found directly, check if we can resolve the original file from disk or database reference
    if (!resolvedPath) {
      const uploadUrl = `/uploads/${safeSegments.join('/')}`
      const invoice = await prisma.invoice.findFirst({
        where: {
          OR: [
            { filePath: uploadUrl },
            { filePath: { endsWith: fileName } },
            { fileName: fileName },
          ]
        }
      })

      const targetFileName = invoice?.fileName || fileName.replace(/^\d+-/, '')
      
      // Check secondary local directories if on development / Windows server
      const searchDirs = [
        path.join(process.cwd(), 'public', 'uploads'),
        path.join('E:', 'All Projects', 'Herbies & Tasty Bun', '01 Invoices'),
        path.join('E:', 'All Projects', 'Hungry Birds', 'Invoices'),
      ]

      for (const d of searchDirs) {
        const match = findFileByName(d, targetFileName)
        if (match) {
          resolvedPath = match
          // Cache the found original file to the primary public/uploads location
          try {
            const dest = possiblePaths[0]
            await mkdir(path.dirname(dest), { recursive: true })
            await copyFile(match, dest)
            resolvedPath = dest
          } catch {}
          break
        }
      }
    }

    // Serve the original uploaded file
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

    // Honest Document Not Found fallback (never generate a fake system voucher)
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Original Invoice Not Found | Riznex</title>
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
          <h1>Original Invoice File Not Found</h1>
          <p>The original uploaded file <code>${fileName}</code> could not be located on the server disk.</p>
          <a href="/dashboard/invoices" class="btn">Return to Invoices</a>
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
