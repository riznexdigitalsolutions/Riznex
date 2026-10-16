import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

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
    const fullPath = path.join(process.cwd(), 'public', 'uploads', ...safeSegments)

    try {
      const fileStat = await stat(fullPath)
      if (!fileStat.isFile()) {
        return NextResponse.json({ error: 'Not a file' }, { status: 404 })
      }
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileBuffer = await readFile(fullPath)
    const contentType = getContentType(fullPath)
    const fileName = path.basename(fullPath)

    const isDownload = req.nextUrl.searchParams.get('download') === '1'
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
  } catch (err: any) {
    console.error('Error serving upload file:', err)
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}
