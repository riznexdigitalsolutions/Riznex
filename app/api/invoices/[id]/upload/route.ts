import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const invoice = await prisma.invoice.findUnique({ where: { id } })
  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  if (session.user.role !== 'admin' && invoice.clientId !== session.user.clientId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const clientId = invoice.clientId
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', clientId)
  await mkdir(uploadsDir, { recursive: true })

  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const savedName = `${Date.now()}-${safeFileName}`
  const diskPath = path.join(uploadsDir, savedName)
  await writeFile(diskPath, buffer)

  const publicPath = `/uploads/${clientId}/${savedName}`
  const fileType = file.type.includes('pdf') ? 'pdf' : (file.type.includes('png') ? 'png' : 'jpeg')

  const updated = await prisma.invoice.update({
    where: { id },
    data: {
      filePath: publicPath,
      fileName: file.name,
      fileType,
      ocrStatus: 'done',
    }
  })

  return NextResponse.json({ success: true, invoice: updated })
}
