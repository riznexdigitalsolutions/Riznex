'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { gbp } from '@/lib/utils'
import { exportToPDF } from '@/lib/pdfExport'

import DateFilter, { defaultDateFilter } from '@/components/DateFilter'

const PLATFORM_LABELS: Record<string, string> = {
  just_eat: 'Just Eat', uber_eats: 'Uber Eats', deliveroo: 'Deliveroo', walk_in: 'Walk-in', cash: 'Cash', mobile_app: 'Mobile App'
}

export function HungryBirdsDashboard() {
  const searchParams = useSearchParams()
  const activeTab = searchParams?.get('tab') || 'overview'
  const { data: session } = useSession()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(defaultDateFilter())
  const [platform, setPlatform] = useState('')

  // Offers State
  const [offers, setOffers] = useState<any[]>([])
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [offerForm, setOfferForm] = useState({ platform: 'just_eat', store: 'Combined', amount: '', startDate: '', type: 'weekly', notes: '' })
  const [savingOffer, setSavingOffer] = useState(false)
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null)

  useEffect(() => {
    const clientId = (session?.user?.role === 'admin' ? 'client-1' : session?.user?.clientId)
    if (!session) return
    setLoading(true)
    const params = new URLSearchParams()
    if (clientId) params.set('clientId', clientId)
    if (platform) params.set('platform', platform)
    if (filter.from) params.set('from', filter.from)
    if (filter.to) params.set('to', filter.to)
    if (filter.weekRanges) params.set('ranges', filter.weekRanges)
    if (!filter.from && !filter.to && filter.preset === 'all_time') {
      params.set('period', 'all_time')
    }
    fetch(`/api/reports-hb?${params}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
      .then(r => r.json())
      .then(data => { setReport(data); setLoading(false) })
      .catch(() => setLoading(false))

    // Load offers
    if (clientId) {
      fetch(`/api/offers?clientId=${clientId}&is2025=false`, { cache: 'no-store' })
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setOffers(data) })
        .catch(console.error)
    }
  }, [session, filter, platform])

  if (loading && !report) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-2 border-[#1f2947] border-t-blue-500 rounded-full animate-spin" />
    </div>
  )

  const r = report
  
  const totalSales = r?.sales?.totalGrossSales ?? 0
  const orders = r?.sales?.totalOrders ?? 0
  const totalCommission = r?.sales?.totalCommission ?? 0
  const totalExpenses = r?.expenses?.total ?? 0
  const totalSuppliers = r?.suppliers?.total ?? 0
  const totalStock = r?.stocks?.total ?? 0
  const netProfit = r?.profit?.net ?? 0

  const staffWages = r?.expenses?.byCategory?.['wages'] ?? 0
  const utilities = (r?.expenses?.byCategory?.['electricity'] ?? 0) + (r?.expenses?.byCategory?.['gas'] ?? 0) + (r?.expenses?.byCategory?.['water'] ?? 0) + (r?.expenses?.byCategory?.['internet'] ?? 0) + (r?.expenses?.byCategory?.['bin'] ?? 0) + (r?.expenses?.byCategory?.['utilities'] ?? 0)
  const otherExpenses = totalExpenses - staffWages - utilities
  const vat = r?.sales?.totalVat ?? 0
  const platformFees = totalCommission - vat
  const adSpends = r?.sales?.totalAdSpends ?? 0

  const platformData = r ? Object.entries(r.sales?.byPlatform ?? {}).map(([k, v]: any) => ({
    name: PLATFORM_LABELS[k] ?? k, 
    sales: v.grossSales, 
    orders: v.orders,
    deductions: v.grossSales - v.netPaid, 
    net: v.netPaid,
  })) : []

  const combinedTotalCost = totalExpenses + totalSuppliers
  const maxSales = Math.max(...platformData.map((p: any) => p.sales), 1)

  const expenseDistributionList = [
    { name: 'Supplier Purchases', amount: totalSuppliers, color: 'bg-amber-500' },
    { name: 'Staff Wages', amount: staffWages, color: 'bg-pink-500' },
    { name: 'Utilities', amount: utilities, color: 'bg-cyan-500' },
    { name: 'Ad Spend', amount: adSpends, color: 'bg-yellow-500' },
    { name: 'Other Expenses', amount: Math.max(0, otherExpenses), color: 'bg-indigo-500' },
  ].filter(item => item.amount > 0).sort((a: any, b: any) => b.amount - a.amount)

  // Compute breakdowns for Profit Summary
  const utilitiesBreakdown = (r?.expenses?.items || [])
    .filter((e: any) => ['electricity', 'gas', 'water', 'internet', 'bin', 'utilities'].includes(e.category))
    .reduce((acc: any, e: any) => {
      const name = e.subcategory || e.category || 'Utility'
      acc[name] = (acc[name] || 0) + e.amount
      return acc
    }, {})

  const otherBreakdown = (r?.expenses?.items || [])
    .filter((e: any) => !['electricity', 'gas', 'water', 'internet', 'bin', 'utilities', 'wages', 'supplier'].includes(e.category))
    .reduce((acc: any, e: any) => {
      const name = e.subcategory || e.category || 'Other'
      acc[name] = (acc[name] || 0) + e.amount
      return acc
    }, {})

  const suppliersBreakdown = (r?.suppliers?.items || [])
    .reduce((acc: any, i: any) => {
      const name = i.supplier?.name || 'Unknown'
      acc[name] = (acc[name] || 0) + (i.amount || 0)
      return acc
    }, {})

  const wagesBreakdown = r?.expenses?.wagesByStaff || {}

  const rawSales = r?.sales?.weekly || [];
  const selectedPlatforms = platform ? platform.split(',').map(p => p.trim()) : [];
  const realOffersData = offers
    .filter(o => {
      if (selectedPlatforms.length === 0) return true;
      const oPlatformLabel = PLATFORM_LABELS[o.platform?.toLowerCase()] || o.platform;
      return selectedPlatforms.includes(oPlatformLabel);
    })
    .map(offer => {
    const matchingSales = rawSales.filter((s: any) => {
      let pMatch = false
      const sPlatform = (s.platform || '').toLowerCase()
      const oPlatform = (offer.platform || '').toLowerCase()
      if (oPlatform === 'just_eat' && sPlatform.includes('just_eat')) pMatch = true
      else if (oPlatform === 'uber_eats' && sPlatform.includes('uber_eats')) pMatch = true
      else if (oPlatform === 'deliveroo' && sPlatform.includes('deliveroo')) pMatch = true
      else if (oPlatform === sPlatform) pMatch = true

      const offerDate = new Date(offer.startDate).getTime()
      const saleDate = new Date(s.weekStart || s.weekEnd).getTime()
      
      let dMatch = false
      if (offer.type === 'weekly') {
        const diff = Math.abs(saleDate - offerDate)
        if (diff <= 7 * 24 * 60 * 60 * 1000) dMatch = true
      } else {
        const oD = new Date(offer.startDate)
        const sD = new Date(s.weekStart || s.weekEnd)
        if (oD.getMonth() === sD.getMonth() && oD.getFullYear() === sD.getFullYear()) dMatch = true
      }

      return pMatch && dMatch
    })

    const totalOrders = matchingSales.reduce((sum: number, s: any) => sum + (Number(s.totalOrders) || 0), 0)
    const totalGrossSales = matchingSales.reduce((sum: number, s: any) => sum + (Number(s.grossSales) || 0), 0)
    const totalRevenue = matchingSales.reduce((sum: number, s: any) => sum + (Number(s.netPaid || s.grossSales) || 0), 0)
    const deductions = totalGrossSales - totalRevenue
    const deductionPercent = totalGrossSales > 0 ? ((deductions / totalGrossSales) * 100).toFixed(1) : '0.0'
    const roi = offer.amount > 0 ? Math.round(((totalRevenue - offer.amount) / offer.amount) * 100) : 0
    
    return {
      id: offer.id,
      startDate: offer.startDate ? new Date(offer.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
      platform: PLATFORM_LABELS[offer.platform] || offer.platform,
      notes: offer.notes,
      spend: offer.amount,
      orders: totalOrders,
      grossSales: totalGrossSales,
      deductions: deductions,
      deductionPercent: deductionPercent,
      revenue: totalRevenue,
      ROI: totalRevenue > 0 ? `${roi}%` : 'Pending'
    }
  })

  if(realOffersData.length === 0) realOffersData.push({ id: 'none', startDate: '-', notes: '', platform: 'No active marketing spend found for this period', spend: 0, orders: 0, grossSales: 0, deductions: 0, deductionPercent: '0.0', revenue: 0, ROI: 'N/A' });

  const getDynamicSubtitle = () => {
    let parts: string[] = []
    if (filter.preset === 'specific_period' && filter.year !== 'all') {
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      if (filter.month !== 'all') {
        const m = parseInt(filter.month || '0')
        parts.push(`${monthNames[m]} ${filter.year}`)
        if (filter.week !== 'all') {
          const date = new Date(Date.UTC(parseInt(filter.year), m, 1))
          while (date.getUTCDay() !== 0) date.setUTCDate(date.getUTCDate() + 1)
          let weekNum = 1
          while (date.getUTCMonth() === m) {
            if (weekNum.toString() === filter.week) {
              parts.push(`Week ${weekNum} (ending Sun, ${date.getUTCDate()} ${monthNames[m]})`)
              break
            }
            date.setUTCDate(date.getUTCDate() + 7)
            weekNum++
          }
        }
      } else {
        parts.push(`Year ${filter.year}`)
      }
    } else if (filter.preset === 'all_time') {
      parts.push('All Time')
    } else if (filter.preset === 'last_week') {
      parts.push('Last Week')
    } else if (filter.preset === 'last_4_weeks') {
      parts.push('Last 4 Weeks')
    } else if (filter.preset === 'this_month') {
      parts.push('This Month')
    } else if (filter.preset === 'last_month') {
      parts.push('Last Month')
    }
    return parts.join(' | ') || 'All Time'
  }

  const getPdfFilename = () => {
    const clientName = session?.user?.clientName ?? 'Hungry Birds'
    let periodText = 'All Time'
    if (filter.preset === 'specific_period' && filter.year !== 'all') {
      const fullMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
      if (filter.month !== 'all') {
        const m = parseInt(filter.month || '0')
        periodText = `${fullMonthNames[m]} ${filter.year}`
        if (filter.week !== 'all') {
          const date = new Date(Date.UTC(parseInt(filter.year), m, 1))
          while (date.getUTCDay() !== 0) date.setUTCDate(date.getUTCDate() + 1)
          let weekNum = 1
          while (date.getUTCMonth() === m) {
            if (weekNum.toString() === filter.week) {
              periodText = `Week ${weekNum} (ending Sun ${date.getUTCDate()} ${fullMonthNames[m]} ${filter.year})`
              break
            }
            date.setUTCDate(date.getUTCDate() + 7)
            weekNum++
          }
        }
      } else {
        periodText = `Year ${filter.year}`
      }
    } else if (filter.preset === 'all_time') {
      periodText = 'All Time'
    } else if (filter.preset === 'this_month') {
      const fullMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
      const now = new Date()
      periodText = `${fullMonthNames[now.getMonth()]} ${now.getFullYear()}`
    } else if (filter.preset === 'last_week') {
      periodText = 'Last Week'
    } else if (filter.preset === 'last_4_weeks') {
      periodText = 'Last 4 Weeks'
    } else if (filter.preset === 'last_month') {
      periodText = 'Last Month'
    }

    if (platform) {
      periodText += ` - ${platform}`
    }

    return `${clientName} - ${periodText}`
  }

  return (
    <div id="hungry-birds-export-area" className="space-y-8 pb-10">
      {/* Header & Filter Controls Section */}
      <div className="flex flex-col gap-6 relative z-10">
        
        {/* Tier 1: Centered Title & PDF Export Button */}
        <div className="flex justify-center items-start relative">
          <div className="w-full text-center flex flex-col items-center justify-center">
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hungry-birds-logo.jpg" alt="Hungry Birds Logo" className="h-12 w-auto rounded-xl shadow-md border border-[#1f2947] inline-block" />
              <span>{session?.user?.clientName ?? 'Hungry Birds'}</span>
            </h1>
            <p className="text-slate-400 mt-1.5 font-medium">{getDynamicSubtitle()}</p>
          </div>
          <div className="print:hidden absolute top-0 right-0" data-html2canvas-ignore="true">
            <button
              onClick={() => exportToPDF('hungry-birds-export-area', getPdfFilename())}
              className="bg-[#111520] border border-[#1f2947] rounded-xl px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-[#1a2235] text-sm font-bold transition flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <span>📄</span> Export PDF Report
            </button>
          </div>
        </div>

        {/* Tier 2: Filter Toolbar (Single Brand - No Store Tabs) */}
        <div className="bg-[#111520]/50 border border-[#1f2947] rounded-2xl p-3 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 print:hidden shadow-lg backdrop-blur-sm">
          {/* Left Side: Platform toggle tabs & selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto overflow-x-auto hide-scrollbar">
            
            <div className="flex items-center gap-1.5 bg-[#0a0c14] border border-[#1f2947] p-1 rounded-xl shrink-0 max-w-full overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setPlatform('')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  platform === '' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Combined
              </button>
              <button
                onClick={() => setPlatform('Uber Eats')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  platform === 'Uber Eats' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Uber Eats
              </button>
              <button
                onClick={() => setPlatform('Just Eat')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  platform === 'Just Eat' ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Just Eat
              </button>
              <button
                onClick={() => setPlatform('Deliveroo')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  platform === 'Deliveroo' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Deliveroo
              </button>
            </div>

            <div className="w-[1px] h-5 bg-[#1f2947] hidden sm:block"></div>

            <div className="bg-[#0e121b] border border-[#1f2947] rounded-xl px-3 py-2 flex gap-2 items-center">
              <div className="text-slate-400 opacity-70 text-sm">📱</div>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer"
              >
                <option value="" className="bg-[#0e121b]">All Platforms</option>
                <option value="Just Eat" className="bg-[#0e121b]">Just Eat</option>
                <option value="Uber Eats" className="bg-[#0e121b]">Uber Eats</option>
                <option value="Deliveroo" className="bg-[#0e121b]">Deliveroo</option>
                <option value="Walk In Cash" className="bg-[#0e121b]">Walk-in Cash</option>
                <option value="Walk In Card" className="bg-[#0e121b]">Walk-in Card</option>
                <option value="POS Sales" className="bg-[#0e121b]">POS Sales</option>
                <option value="Online Web" className="bg-[#0e121b]">Online Web</option>
              </select>
            </div>
          </div>

          {/* Right Side: DateFilter & Reset */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#0e121b] border border-[#1f2947] rounded-xl px-4 py-2 flex gap-2 items-center">
              <div className="text-slate-400 opacity-70 mr-1 text-sm">📅</div>
              <DateFilter filter={filter} setFilter={setFilter} />
            </div>
            
            <button
              onClick={() => { setFilter(defaultDateFilter()); setPlatform(''); }}
              className="bg-[#0e121b] border border-[#1f2947] rounded-xl px-4 py-2 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className={activeTab === 'overview' ? 'flex flex-col gap-8' : 'hidden'}>
        {/* Primary KPIs - 5 cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-5 shadow-lg">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Orders</div>
          <div className="text-2xl font-black text-orange-400">{orders}</div>
        </div>
        <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-5 shadow-lg">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Gross Sales</div>
          <div className="text-2xl font-black text-blue-400">{gbp(totalSales)}</div>
        </div>
        <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-5 shadow-lg">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Net Sales</div>
          <div className="text-2xl font-black text-cyan-400">{gbp(r?.sales?.totalNetPaid ?? 0)}</div>
        </div>
        <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-5 shadow-lg">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Expenses</div>
          <div className="text-2xl font-black text-purple-400">{gbp(totalExpenses + totalSuppliers)}</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 border border-emerald-500/30 rounded-2xl p-5 shadow-emerald-500/10 shadow-xl">
          <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Net Profit</div>
          <div className={`text-3xl font-black ${netProfit >= 0 ? 'text-emerald-400' : 'text-emerald-400'}`}>{gbp(netProfit)}</div>
        </div>
      </div>

      {/* Expense Breakdown Strip — 7 tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-4 py-3 flex flex-col gap-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Commissions</div>
          <div className="text-base font-black text-red-400">{gbp(totalCommission)}</div>
        </div>
        <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-4 py-3 flex flex-col gap-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ad Spend</div>
          <div className="text-base font-black text-yellow-400">{gbp(adSpends)}</div>
        </div>
        <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-4 py-3 flex flex-col gap-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Utilities</div>
          <div className="text-base font-black text-cyan-400">{gbp(utilities)}</div>
        </div>
        <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-4 py-3 flex flex-col gap-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Wages</div>
          <div className="text-base font-black text-pink-400">{gbp(staffWages)}</div>
        </div>
        <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-4 py-3 flex flex-col gap-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Supplier Purchases</div>
          <div className="text-base font-black text-amber-400">{gbp(totalSuppliers)}</div>
        </div>
        <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-4 py-3 flex flex-col gap-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Others</div>
          <div className="text-base font-black text-indigo-400">{gbp(otherExpenses)}</div>
        </div>
        <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-4 py-3 flex flex-col gap-1 bg-purple-500/10 border-purple-500/20">
          <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Total Expenses</div>
          <div className="text-base font-black text-purple-300">{gbp(totalExpenses + totalSuppliers)}</div>
        </div>
      </div>

      {/* Analytics Split: Profit Summary & Platform Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Waterfall Profit Summary */}
        <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden z-0">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 blur-[100px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner text-lg">
                💰
              </span>
              Profit Summary
            </h2>
            
            <div className="mb-6 border-b border-[#1f2947] pb-4 flex justify-between items-end">
              <span className="text-slate-300 font-bold text-lg">Gross Sales</span>
              <span className="text-blue-400 font-bold text-2xl">{gbp(totalSales)}</span>
            </div>

            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">LESS:</div>
            <ul className="space-y-3.5 font-normal">
              <li className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-200 font-semibold flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    Commission
                  </span>
                  <span className="text-red-400 font-bold text-sm">-{gbp(totalCommission)}</span>
                </div>
                {Object.entries(r?.sales?.byPlatform || {}).some(([_, d]: any) => d.commission > 0) && (
                  <ul className="pl-4 space-y-1 border-l border-[#1f2947]/50 ml-1 my-1">
                    {Object.entries(r?.sales?.byPlatform || {}).map(([name, data]: any) => {
                      if (!data.commission) return null
                      return (
                        <li key={name} className="flex justify-between items-center text-xs text-slate-400">
                          <span>{PLATFORM_LABELS[name] ?? name}</span>
                          <span className="font-medium text-slate-300">-{gbp(data.commission)}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>

              <li className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-200 font-semibold flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    Ad Spends & Promoted
                  </span>
                  <span className="text-red-400 font-bold text-sm">-{gbp(adSpends)}</span>
                </div>
                {Object.entries(r?.sales?.byPlatform || {}).some(([_, d]: any) => d.adSpends > 0) && (
                  <ul className="pl-4 space-y-1 border-l border-[#1f2947]/50 ml-1 my-1">
                    {Object.entries(r?.sales?.byPlatform || {}).map(([name, data]: any) => {
                      if (!data.adSpends) return null
                      return (
                        <li key={name} className="flex justify-between items-center text-xs text-slate-400">
                          <span>{PLATFORM_LABELS[name] ?? name}</span>
                          <span className="font-medium text-slate-300">-{gbp(data.adSpends)}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>

              <li className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-200 font-semibold flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                    Other Deductions
                  </span>
                  <span className="text-red-400 font-bold text-sm">-{gbp(vat)}</span>
                </div>
                {Object.entries(r?.sales?.byPlatform || {}).some(([_, d]: any) => (d.grossSales - d.netPaid - d.commission - d.adSpends) > 0) && (
                  <ul className="pl-4 space-y-1 border-l border-[#1f2947]/50 ml-1 my-1">
                    {Object.entries(r?.sales?.byPlatform || {}).map(([name, data]: any) => {
                      const otherDed = data.grossSales - data.netPaid - (data.commission || 0) - (data.adSpends || 0)
                      if (otherDed <= 0) return null
                      return (
                        <li key={name} className="flex justify-between items-center text-xs text-slate-400">
                          <span>{PLATFORM_LABELS[name] ?? name}</span>
                          <span className="font-medium text-slate-300">-{gbp(otherDed)}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>

              <li className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-200 font-semibold flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Utilities
                  </span>
                  <span className="text-red-400 font-bold text-sm">-{gbp(utilities)}</span>
                </div>
                {Object.keys(utilitiesBreakdown).length > 0 && (
                  <ul className="pl-4 space-y-1 border-l border-[#1f2947]/50 ml-1 my-1">
                    {Object.entries(utilitiesBreakdown).map(([name, amount]: any) => (
                      <li key={name} className="flex justify-between items-center text-xs text-slate-400">
                        <span>{name}</span>
                        <span className="font-medium text-slate-300">-{gbp(amount)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-200 font-semibold text-sm">Supplier Purchases</span>
                  <span className="text-red-400 font-bold text-sm">-{gbp(totalSuppliers)}</span>
                </div>
                {Object.keys(suppliersBreakdown).length > 0 && (
                  <ul className="pl-4 space-y-1 border-l border-[#1f2947]/50 ml-1 my-1">
                    {Object.entries(suppliersBreakdown).map(([name, amount]: any) => (
                      <li key={name} className="flex justify-between items-center text-xs text-slate-400">
                        <span>{name}</span>
                        <span className="font-medium text-slate-300">-{gbp(amount)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-200 font-semibold text-sm">Staff Wages</span>
                  <span className="text-red-400 font-bold text-sm">-{gbp(staffWages)}</span>
                </div>
                {Object.keys(wagesBreakdown).length > 0 && (
                  <ul className="pl-4 space-y-1 border-l border-[#1f2947]/50 ml-1 my-1">
                    {Object.entries(wagesBreakdown).map(([name, amount]: any) => (
                      <li key={name} className="flex justify-between items-center text-xs text-slate-400">
                        <span>{name}</span>
                        <span className="font-medium text-slate-300">-{gbp(amount)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-200 font-semibold text-sm">Other Expenses</span>
                  <span className="text-red-400 font-bold text-sm">-{gbp(otherExpenses)}</span>
                </div>
                {Object.keys(otherBreakdown).length > 0 && (
                  <ul className="pl-4 space-y-1 border-l border-[#1f2947]/50 ml-1 my-1">
                    {Object.entries(otherBreakdown).map(([name, amount]: any) => (
                      <li key={name} className="flex justify-between items-center text-xs text-slate-400">
                        <span>{name}</span>
                        <span className="font-medium text-slate-300">-{gbp(amount)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-500/20 flex justify-between items-center">
            <span className="text-emerald-400 font-bold text-xl tracking-tight">= Net Profit</span>
            <span className="text-emerald-400 font-bold text-2xl">{gbp(netProfit)}</span>
          </div>
        </div>

        {/* Right Column (2 cols wide): Platform Performance Table */}
        <div className="lg:col-span-2 bg-[#111520] border border-[#1f2947] rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden z-0">
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-500/10 blur-[100px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
          <div>
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-inner text-lg">
                📊
              </span>
              Platform Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-slate-400 border-b border-[#1f2947]">
                    <th className="pb-3 font-semibold uppercase tracking-wider text-xs">Platform</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider text-xs text-right">Orders</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider text-xs text-right">Sales</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider text-xs text-right">Deductions</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider text-xs text-right">%</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider text-xs text-right text-emerald-400">Net Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2947]/50">
                  {platformData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">No platform data available</td>
                    </tr>
                  ) : (
                    platformData.map((p: any, i: number) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="py-3.5 font-semibold text-slate-200 text-sm">{p.name}</td>
                        <td className="py-3.5 text-slate-300 text-right font-medium text-sm">{p.orders}</td>
                        <td className="py-3.5 text-blue-400 text-right font-bold text-sm">{gbp(p.sales)}</td>
                        <td className="py-3.5 text-red-400 text-right font-bold text-sm">{gbp(p.deductions)}</td>
                        <td className="py-3.5 text-slate-400 text-right font-medium text-xs">
                          {p.sales > 0 ? ((p.deductions / p.sales) * 100).toFixed(1) : '0.0'}%
                        </td>
                        <td className="py-3.5 text-emerald-400 text-right font-bold text-sm">{gbp(p.net)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Visual Distribution Charts Stacked Vertically under Platform Performance */}
            <div className="mt-8 pt-6 border-t border-[#1f2947] flex flex-col gap-5">
              
              {/* Sales Distribution */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-white">
                  <span className="flex items-center gap-2"><span className="text-blue-400">📈</span> Sales Distribution</span>
                  <span className="text-blue-400 font-bold text-xs">{gbp(totalSales)}</span>
                </div>
                <div className="space-y-1.5">
                  {platformData.map((p: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">{p.name}</span>
                        <span className="text-blue-400 font-bold text-xs">{gbp(p.sales)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0e121b] rounded-full overflow-hidden border border-[#1f2947]">
                        <div 
                          style={{ width: `${Math.min(100, Math.max(3, (p.sales / maxSales) * 100))}%` }} 
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Distribution */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-white">
                  <span className="flex items-center gap-2"><span className="text-purple-400">💸</span> Expense Distribution</span>
                  <span className="text-purple-400 font-bold text-xs">{gbp(combinedTotalCost)}</span>
                </div>
                <div className="space-y-1.5">
                  {expenseDistributionList.map((item: any, idx: number) => {
                    const pct = combinedTotalCost > 0 ? ((item.amount / combinedTotalCost) * 100).toFixed(1) : '0.0'
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300 font-medium">{item.name}</span>
                          <span className="text-slate-200 font-bold text-xs">{pct}% <span className="text-slate-500 font-normal">({gbp(item.amount)})</span></span>
                        </div>
                        <div className="w-full h-1.5 bg-[#0e121b] rounded-full overflow-hidden border border-[#1f2947]">
                          <div 
                            style={{ width: `${combinedTotalCost > 0 ? Math.min(100, Math.max(3, (item.amount / combinedTotalCost) * 100)) : 0}%` }} 
                            className={`h-full ${item.color} rounded-full`}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
      </div>

      {/* --- OFFERS TAB --- */}
      <div className={activeTab === 'offers' ? 'block' : 'hidden'}>
        <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-8 shadow-xl mt-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Marketing & Offers ROI</h2>
            {session?.user?.role === 'admin' && (
              <button onClick={() => { setEditingOfferId(null); setOfferForm({ platform: 'just_eat', store: 'Combined', amount: '', startDate: '', type: 'weekly', notes: '' }); setShowOfferModal(true); }} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">+ Add Offer</button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-[#1f2947]">
                  <th className="pb-4">Start Date</th>
                  <th className="pb-4">Platform</th>
                  <th className="pb-4 text-right">Spend</th>
                  <th className="pb-4 text-right">Orders</th>
                  <th className="pb-4 text-right">Gross Sales</th>
                  <th className="pb-4 text-right">Deductions</th>
                  <th className="pb-4 text-right">Ded %</th>
                  <th className="pb-4 text-right">Net Sales</th>
                  <th className="pb-4 text-right">ROI</th>
                  {session?.user?.role === 'admin' && <th className="pb-4"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2947]">
                {realOffersData.map((o, i) => (
                  <tr key={i} className="group">
                    <td className="py-4 text-slate-300 font-medium whitespace-nowrap">{o.startDate}</td>
                    <td className="py-4 text-white font-medium">
                      {o.platform}
                      {o.notes && <div className="text-xs text-slate-400 mt-1">{o.notes}</div>}
                    </td>
                    <td className="py-4 text-red-400 text-right">{o.spend > 0 ? gbp(o.spend) : '-'}</td>
                    <td className="py-4 text-white text-right font-medium">{o.orders}</td>
                    <td className="py-4 text-white text-right font-medium">{o.grossSales > 0 ? gbp(o.grossSales) : '-'}</td>
                    <td className="py-4 text-orange-400 text-right">{o.deductions > 0 ? gbp(o.deductions) : '-'}</td>
                    <td className="py-4 text-slate-400 text-right">{o.grossSales > 0 ? `${o.deductionPercent}%` : '-'}</td>
                    <td className="py-4 text-blue-400 text-right">{o.revenue > 0 ? gbp(o.revenue) : '-'}</td>
                    <td className="py-4 text-emerald-400 font-bold text-right">{o.ROI}</td>
                    {session?.user?.role === 'admin' && (
                      <td className="py-4 text-right">
                        {o.id !== 'none' && (
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => {
                              const originalOffer = offers.find(of => of.id === o.id);
                              if(originalOffer) {
                                setEditingOfferId(originalOffer.id);
                                setOfferForm({
                                  platform: originalOffer.platform,
                                  store: originalOffer.store || 'Combined',
                                  amount: originalOffer.amount ? originalOffer.amount.toString() : '',
                                  startDate: new Date(originalOffer.startDate).toISOString().split('T')[0],
                                  type: originalOffer.type || 'weekly',
                                  notes: originalOffer.notes || ''
                                });
                                setShowOfferModal(true);
                              }
                            }} className="text-slate-500 hover:text-blue-400 text-lg transition-colors" title="Edit Offer">
                              ✎
                            </button>
                            <button onClick={() => {
                              if(confirm('Delete this offer?')) {
                                fetch('/api/offers', { method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ id: o.id }) })
                                setOffers(offers.filter((of: any) => of.id !== o.id))
                              }
                            }} className="text-slate-500 hover:text-red-400 text-lg transition-colors" title="Delete Offer">
                              ✕
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- ADD/EDIT OFFER MODAL --- */}
        {showOfferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#111520] border border-[#1f2947] rounded-xl w-full max-w-md p-6 shadow-2xl relative">
              <button onClick={() => { setShowOfferModal(false); setEditingOfferId(null); setOfferForm({ platform: 'just_eat', store: 'Combined', amount: '', startDate: '', type: 'weekly', notes: '' }); }} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
              <h2 className="text-xl font-bold text-white mb-6">{editingOfferId ? 'Edit Marketing Offer' : 'Add Marketing Offer'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Platform</label>
                  <select value={offerForm.platform} onChange={(e) => setOfferForm({...offerForm, platform: e.target.value})} className="w-full bg-[#0a0c14] border border-[#1f2947] rounded-lg p-2.5 text-white text-sm outline-none focus:border-blue-500">
                    <option value="just_eat">Just Eat</option>
                    <option value="uber_eats">Uber Eats</option>
                    <option value="deliveroo">Deliveroo</option>
                    <option value="facebook">Facebook Marketing</option>
                    <option value="google">Google Ads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Offer Title (e.g. 30% off, BOGO)</label>
                  <input type="text" value={offerForm.notes} onChange={(e) => setOfferForm({...offerForm, notes: e.target.value})} className="w-full bg-[#0a0c14] border border-[#1f2947] rounded-lg p-2.5 text-white text-sm outline-none focus:border-blue-500" placeholder="e.g. 30% off Burgers" />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Start Date</label>
                    <input type="date" value={offerForm.startDate} onChange={(e) => setOfferForm({...offerForm, startDate: e.target.value})} className="w-full bg-[#0a0c14] border border-[#1f2947] rounded-lg p-2.5 text-white text-sm outline-none focus:border-blue-500 [color-scheme:dark]" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Duration</label>
                    <select value={offerForm.type} onChange={(e) => setOfferForm({...offerForm, type: e.target.value})} className="w-full bg-[#0a0c14] border border-[#1f2947] rounded-lg p-2.5 text-white text-sm outline-none focus:border-blue-500">
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Spend Amount (£) <span className="text-slate-500 font-normal">(Optional)</span></label>
                  <input type="number" step="0.01" value={offerForm.amount} onChange={(e) => setOfferForm({...offerForm, amount: e.target.value})} className="w-full bg-[#0a0c14] border border-[#1f2947] rounded-lg p-2.5 text-white text-sm outline-none focus:border-blue-500" placeholder="e.g. 200" />
                </div>
                <div className="pt-4">
                  <button onClick={() => {
                    const activeClientId = session?.user?.role === 'admin' ? 'client-1' : session?.user?.clientId;
                    setSavingOffer(true)
                    const method = editingOfferId ? 'PUT' : 'POST'
                    const bodyObj = editingOfferId 
                      ? { id: editingOfferId, ...offerForm, store: 'Combined', is2025: false }
                      : { ...offerForm, store: 'Combined', clientId: activeClientId, is2025: false }
                    
                    fetch('/api/offers', {
                      method,
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(bodyObj)
                    }).then(res => res.json()).then(savedOffer => {
                      if (!savedOffer.error) {
                        if (editingOfferId) {
                          setOffers(offers.map(o => o.id === savedOffer.id ? savedOffer : o))
                        } else {
                          setOffers([savedOffer, ...offers])
                        }
                      }
                      setShowOfferModal(false)
                      setSavingOffer(false)
                      setEditingOfferId(null)
                      setOfferForm({ platform: 'just_eat', store: 'Combined', amount: '', startDate: '', type: 'weekly', notes: '' })
                    })
                  }} disabled={savingOffer || !offerForm.startDate || (!offerForm.amount && !offerForm.notes)} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors">
                    {savingOffer ? 'Saving...' : (editingOfferId ? 'Update Offer' : 'Save Offer')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}









