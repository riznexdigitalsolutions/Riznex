import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
function getClientId(session: any, req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const clientId = searchParams.get('clientId')
  if (session.user.role === 'admin') return clientId
  return session.user.clientId
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clientId = getClientId(session, req)
  if (!clientId) return NextResponse.json({ error: 'Client ID required' }, { status: 400 })

  const { searchParams } = req.nextUrl
  const platform = searchParams.get('platform')
  const store = searchParams.get('store')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const is2025 = searchParams.get('is2025') === 'true'

  const rangesStr = searchParams.get('ranges')

  // Platform filter: map codes to label substrings
  const platformMap: Record<string, string> = {
    uber_eats: 'Uber Eats',
    just_eat: 'Just Eat',
    deliveroo: 'Deliveroo',
    walk_in_cash: 'Cash',
    walk_in_card: 'Card',
    pos_sales: 'POS',
    online_web: 'Online Web',
    pos: 'POS',
    'Just Eat': 'Just Eat',
    'Uber Eats': 'Uber Eats',
    'Deliveroo': 'Deliveroo',
    'Walk In Cash': 'Cash',
    'Walk In Card': 'Card',
    'POS Sales': 'POS',
    'In-Store POS': 'POS',
    'Herbies POS': 'Herbies POS',
    'Tasty Bun POS': 'Tasty Bun POS',
    'Tasty Bun Website': 'Tasty Bun Web & App',
    'Tasty Bun Mobile App': 'Tasty Bun Web & App',
    'Tasty Bun Web & App': 'Tasty Bun Web & App',
    'Herbies Website': 'Herbies Web & App',
    'Herbies Mobile App': 'Herbies Web & App',
    'Herbies Web & App': 'Herbies Web & App',
  }

  const andClauses: any[] = [
    { clientId },
    { is2025 }
  ]

  // Filter by explicit store name
  if (store && store !== 'Combined' && !store.startsWith('Monthly ')) {
    andClauses.push({ store })
  }
  
  // Always exclude monthly records in weekly views
  const monthlyStores = ['Monthly Combined', 'Monthly Herbies Pizza', 'Monthly Tasty Bun']
  if (!store?.startsWith('Monthly')) {
    andClauses.push({ store: { notIn: monthlyStores } })
  } else {
    andClauses.push({ store })
  }

  // Date condition
  let dateWhereList: any[] = []
  if (rangesStr) {
    const parts = rangesStr.split('|').map(r => {
      const [start, end] = r.split('_')
      const endDate = new Date(end)
      endDate.setUTCHours(23, 59, 59, 999)
      return { gte: new Date(start), lte: endDate }
    })
    if (parts.length > 0) {
      dateWhereList = parts
    }
  } else if (from || to) {
    const dateObj: any = {}
    if (from) dateObj.gte = new Date(from)
    if (to) {
      const t = new Date(to)
      t.setUTCHours(23, 59, 59, 999)
      dateObj.lte = t
    }
    dateWhereList = [dateObj]
  } else {
    const defaultFrom = is2025 ? new Date(2000, 0, 1) : new Date(Date.UTC(2026, 3, 1))
    dateWhereList = [{ gte: defaultFrom }]
  }

  if (dateWhereList.length === 1) {
    andClauses.push({ weekEnd: dateWhereList[0] })
  } else if (dateWhereList.length > 1) {
    andClauses.push({ OR: dateWhereList.map(r => ({ weekEnd: r })) })
  }

  if (platform) {
    const platforms = platform.split(',').map(p => p.trim()).filter(Boolean)
    const platformORs: any[] = []
    platforms.forEach(p => {
      const mapped = platformMap[p] || p
      if (mapped === 'Tasty Bun Website' || mapped === 'Tasty Bun Mobile App' || mapped === 'Tasty Bun Web & App') {
        platformORs.push(
          { platform: 'Tasty Bun Web & App' },
          { platform: { contains: 'Tasty Bun Web' } },
          { platform: { contains: 'Tasty Bun Mobile' } },
          { platform: { contains: 'Tasty Bun Website' } }
        )
      } else if (mapped === 'Herbies Web & App' || mapped === 'Herbies Website' || mapped === 'Herbies Mobile App') {
        platformORs.push(
          { platform: 'Herbies Web & App' },
          { platform: { contains: 'Herbies Web' } }
        )
      } else if (mapped === 'Herbies POS') {
        platformORs.push(
          { platform: 'Herbies POS' },
          { platform: { contains: 'Herbies POS' } }
        )
      } else if (mapped === 'Tasty Bun POS') {
        platformORs.push(
          { platform: 'Tasty Bun POS' },
          { platform: { contains: 'Tasty Bun POS' } }
        )
      } else if (mapped === 'POS' || mapped === 'In-Store POS') {
        platformORs.push(
          { platform: { contains: 'POS' } },
          { platform: 'POS' }
        )
      } else {
        platformORs.push({ platform: { contains: mapped } })
      }
    })
    if (platformORs.length > 0) {
      andClauses.push({ OR: platformORs })
    }
  }

  const where: any = { AND: andClauses }

  const sales = await prisma.sale.findMany({
    where,
    orderBy: { weekStart: 'desc' },
    include: { invoice: { select: { id: true, fileName: true, filePath: true } } },
  })
  return NextResponse.json(sales)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const clientId = session.user.role === 'admin' ? body.clientId : session.user.clientId

  if (!clientId) return NextResponse.json({ error: 'Client ID required' }, { status: 400 })

  const sale = await prisma.sale.create({
    data: {
      clientId,
      platform: body.platform,
      store: body.store || 'Combined',
      weekStart: new Date(body.weekStart),
      weekEnd: new Date(body.weekEnd),
      totalOrders: body.totalOrders ?? 0,
      grossSales: body.grossSales ?? 0,
      commission: body.commission ?? 0,
      vat: body.vat ?? 0,
      otherFees: body.otherFees ?? 0,
      adminFee: body.adminFee ?? 0,
      refunds: body.refunds ?? 0,
      cashOrders: body.cashOrders ?? 0,
      netPaid: body.netPaid ?? 0,
      adSpends: body.adSpends ?? 0,
      topRankFee: body.topRankFee ?? 0,
      offersOnItems: body.offersOnItems ?? 0,
      notes: body.notes ?? null,
      invoiceId: body.invoiceId ?? null,
    },
  })
  return NextResponse.json(sale, { status: 201 })
}
