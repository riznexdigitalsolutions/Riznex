import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const clientId = session.user.role === 'admin' ? searchParams.get('clientId') : session.user.clientId
  const is2025 = searchParams.get('is2025') === 'true'

  if (!clientId) return NextResponse.json({ error: 'Client ID required' }, { status: 400 })

  const offers = await prisma.marketingOffer.findMany({
    where: { clientId, is2025 },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(offers)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch((e) => {
    console.error('Failed to parse JSON:', e)
    return {}
  })
  
  const clientId = session.user.role === 'admin' 
    ? (body.clientId || session.user.clientId)
    : session.user.clientId

  if (!clientId) {
    console.log('400: Client ID required')
    return NextResponse.json({ error: 'Client ID required' }, { status: 400 })
  }

  const { platform, store, type, startDate, amount, notes, is2025 } = body

  if (!platform || !startDate) {
    console.log('400: Missing required fields', { platform, startDate, body })
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const offer = await prisma.marketingOffer.create({
      data: {
        clientId,
        platform,
        store: store || 'Combined',
        type: type || 'weekly',
        startDate: new Date(startDate),
        amount: parseFloat(amount || '0'),
        notes: notes || null,
        is2025: is2025 === true,
      },
    })
    console.log('Successfully created offer:', offer.id)
    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error('Prisma Create Error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { id, platform, store, type, startDate, amount, notes } = body

  if (!id || !platform || !startDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const offer = await prisma.marketingOffer.update({
      where: { id },
      data: {
        platform,
        store: store || 'Combined',
        type: type || 'weekly',
        startDate: new Date(startDate),
        amount: parseFloat(amount || '0'),
        notes: notes || null,
      },
    })
    return NextResponse.json(offer, { status: 200 })
  } catch (error) {
    console.error('Prisma Update Error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id } = body

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  await prisma.marketingOffer.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
