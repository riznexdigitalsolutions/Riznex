'use client'
import { useEffect, useState } from 'react'
import { exportToPDF } from '@/lib/pdfExport'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, LabelList, PieChart, Pie, Cell } from 'recharts'
import { gbp } from '@/lib/utils'
import { ExcelStyleReport } from '@/components/ExcelStyleReport'

import DateFilter, { defaultDateFilter } from '@/components/DateFilter'
import MultiPlatformFilter from '@/components/MultiPlatformFilter'
import ActiveFilters from '@/components/ActiveFilters'
import OffersCampaignView from '@/components/OffersCampaignView'

const PLATFORM_LABELS: Record<string, string> = {
  just_eat: 'Just Eat', uber_eats: 'Uber Eats', deliveroo: 'Deliveroo', walk_in: 'Walk-in', cash: 'Cash', mobile_app: 'Mobile App'
}

const HENLEY_COMBINED_PLATFORMS = [
  { value: 'Deliveroo', label: 'Deliveroo', color: '#4f8ef7' },
  { value: 'Just Eat', label: 'Just Eat', color: '#f97316' },
  { value: 'Uber Eats', label: 'Uber Eats', color: '#22d3a5' },
  { value: 'Herbies POS', label: 'Herbies POS', color: '#ef4444' },
  { value: 'Herbies Web & App', label: 'Herbies Web & App', color: '#ec4899' },
  { value: 'Tasty Bun POS', label: 'Tasty Bun POS', color: '#f59e0b' },
  { value: 'Tasty Bun Web & App', label: 'Tasty Bun Web & App', color: '#e11d48' },
]

const HERBIES_PLATFORMS = [
  { value: 'Deliveroo', label: 'Deliveroo', color: '#4f8ef7' },
  { value: 'Just Eat', label: 'Just Eat', color: '#f97316' },
  { value: 'Herbies POS', label: 'Herbies POS', color: '#ef4444' },
  { value: 'Herbies Web & App', label: 'Herbies Web & App', color: '#ec4899' },
]

const TASTY_BUN_PLATFORMS = [
  { value: 'Deliveroo', label: 'Deliveroo', color: '#4f8ef7' },
  { value: 'Just Eat', label: 'Just Eat', color: '#f97316' },
  { value: 'Uber Eats', label: 'Uber Eats', color: '#22d3a5' },
  { value: 'Tasty Bun POS', label: 'Tasty Bun POS', color: '#f59e0b' },
  { value: 'Tasty Bun Web & App', label: 'Tasty Bun Web & App', color: '#e11d48' },
  { value: 'Tasty Bun Website', label: 'Tasty Bun Website', color: '#e11d48' },
  { value: 'Tasty Bun Mobile App', label: 'Tasty Bun Mobile App', color: '#a855f7' },
]

export function HenleyDashboard({ is2025 = false }: { is2025?: boolean }) {
  const { data: session } = useSession()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(defaultDateFilter())
  const [store, setStore] = useState(is2025 ? 'Herbies Pizza' : '') // '' = Combined, 'Herbies Pizza', 'Tasty Bun'
  const [platform, setPlatform] = useState<string>('') // '' = All Platforms
  const [expandAll, setExpandAll] = useState(true)
  
  // Offers State
  const [offers, setOffers] = useState<any[]>([])
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [offerForm, setOfferForm] = useState({ platform: 'just_eat', store: 'Herbies Pizza', amount: '', startDate: '', type: 'weekly', notes: '' })
  const [savingOffer, setSavingOffer] = useState(false)
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const activeTab = searchParams?.get('tab') || 'overview'

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const loadReport = () => {
      const clientId = session?.user?.role === 'admin' ? 'cmpv4dvik0000vdj089wl6zmf' : session?.user?.clientId
      if (!session) return
      const params = new URLSearchParams()
      if (clientId) params.set('clientId', clientId)
      if (filter.from) params.set('from', filter.from)
      if (filter.to) params.set('to', filter.to)
      if (filter.weekRanges) params.set('ranges', filter.weekRanges)
      if (!filter.from && !filter.to && filter.preset === 'all_time') {
        params.set('period', 'all_time')
      }
      if (store) params.set('store', store)
      if (platform) params.set('platform', platform)
      if (is2025) params.set('is2025', 'true')

      fetch(`/api/reports?${params}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
        .then(r => r.json())
        .then(data => { setReport(data); setLoading(false) })
        .catch(() => setLoading(false))

      // Load offers
      fetch(`/api/offers?clientId=${clientId}&is2025=${is2025 ? 'true' : 'false'}`, { cache: 'no-store' })
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setOffers(data) })
        .catch(console.error)
    }

    loadReport()
    window.addEventListener('focus', loadReport)
    return () => window.removeEventListener('focus', loadReport)
  }, [session, filter, store, platform, is2025])

  if (loading && !report) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-2 border-slate-200 dark:border-[#1f2947] border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
  if (!report) return (
    <div className="flex items-center justify-center h-64 text-slate-500 font-medium">
      Failed to load dashboard data. Please try again.
    </div>
  )

  const r = report
    // --- REAL DATA AGGREGATION ---
  const rawSales = r?.sales?.weekly || [];
  const rawSuppliers = r?.suppliers?.items || [];

  // 1. Group by Week
  const weeklyMap: any = {};
  rawSales.forEach((s: any) => {
    // Safely parse date
    let d = new Date();
    if (s.weekStart) {
      d = new Date(s.weekStart);
    }
    if (isNaN(d.getTime())) d = new Date();
    
    const dateStr = d.toISOString().split('T')[0];
    if (!weeklyMap[dateStr]) weeklyMap[dateStr] = { name: dateStr, sales: 0, orders: 0, suppliers: 0, date: d };
    weeklyMap[dateStr].sales += (Number(s.grossSales) || 0);
    weeklyMap[dateStr].orders += (Number(s.totalOrders) || 0);
  });
  rawSuppliers.forEach((s: any) => {
    let d = new Date();
    if (s.invoiceDate) d = new Date(s.invoiceDate);
    if (isNaN(d.getTime())) d = new Date();
    
    // Align to Monday using UTC to avoid timezone shifts
      const day = d.getUTCDay();
      const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
      const mon = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
      const dateStr = mon.toISOString().split('T')[0];
    if (!weeklyMap[dateStr]) weeklyMap[dateStr] = { name: dateStr, sales: 0, orders: 0, suppliers: 0, date: mon };
    weeklyMap[dateStr].suppliers += (Number(s.amount) || 0);
  });

  const realWeeklyData = Object.values(weeklyMap).sort((a: any, b: any) => a.date.getTime() - b.date.getTime()).map((w: any, i: number) => {
    // Format like "Week 1" and sub label
    const endD = new Date(w.date);
    endD.setDate(endD.getDate() + 6);
    const formatD = (date: any) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return {
      name: `Week ${i + 1}`,
      label: `${formatD(w.date)} - ${formatD(endD)}`,
      sales: Math.round(w.sales) || 0,
      orders: Math.round(w.orders) || 0,
      suppliers: Math.round(w.suppliers) || 0
    };
  });
  
  let displayWeeklyData = realWeeklyData.slice(-4);
  // Fallback if empty to prevent Recharts from crashing
  if (displayWeeklyData.length === 0) {
    displayWeeklyData = [
      { name: 'Week 1', label: 'No Data', sales: 0, orders: 0, suppliers: 0 },
      { name: 'Week 2', label: 'No Data', sales: 0, orders: 0, suppliers: 0 },
      { name: 'Week 3', label: 'No Data', sales: 0, orders: 0, suppliers: 0 },
      { name: 'Week 4', label: 'No Data', sales: 0, orders: 0, suppliers: 0 }
    ];
  } else while (displayWeeklyData.length < 4) {
    displayWeeklyData.unshift({ name: '-', label: '-', sales: 0, orders: 0, suppliers: 0 });
  }

  // 2. Group by Month
  const monthlyMap: any = {};
  rawSales.forEach((s: any) => {
    let d = new Date();
    if (s.weekStart) d = new Date(s.weekStart);
    if (isNaN(d.getTime())) d = new Date();
    const mStr = d.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
    if (!monthlyMap[mStr]) monthlyMap[mStr] = { name: mStr, sales: 0, orders: 0, suppliers: 0, date: d };
    monthlyMap[mStr].sales += (Number(s.grossSales) || 0);
    monthlyMap[mStr].orders += (Number(s.totalOrders) || 0);
  });
  rawSuppliers.forEach((s: any) => {
    let d = new Date();
    if (s.invoiceDate) d = new Date(s.invoiceDate);
    if (isNaN(d.getTime())) d = new Date();
    const mStr = d.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
    if (!monthlyMap[mStr]) monthlyMap[mStr] = { name: mStr, sales: 0, orders: 0, suppliers: 0, date: d };
    monthlyMap[mStr].suppliers += (Number(s.amount) || 0);
  });

  const realMonthlyData = Object.values(monthlyMap).sort((a: any, b: any) => a.date.getTime() - b.date.getTime()).map((m: any) => ({
    name: m.name,
    sales: Math.round(m.sales) || 0,
    orders: Math.round(m.orders) || 0,
    suppliers: Math.round(m.suppliers) || 0
  }));
  
  let displayMonthlyData = realMonthlyData.slice(-4);
  if (displayMonthlyData.length === 0) {
    displayMonthlyData = [
      { name: 'Month 1', sales: 0, orders: 0, suppliers: 0 },
      { name: 'Month 2', sales: 0, orders: 0, suppliers: 0 },
      { name: 'Month 3', sales: 0, orders: 0, suppliers: 0 },
      { name: 'Month 4', sales: 0, orders: 0, suppliers: 0 }
    ];
  } else while (displayMonthlyData.length < 4) {
    displayMonthlyData.unshift({ name: '-', sales: 0, orders: 0, suppliers: 0 });
  }


  // --- SMART INSIGHTS ---
  const currentWeek = displayWeeklyData[displayWeeklyData.length - 1] || { sales: 0 };
  const prevWeek = displayWeeklyData[displayWeeklyData.length - 2] || { sales: 0 };
  let insightMsg = "Not enough data for insights.";
  let isPositive = true;
  if (currentWeek.sales >= 0 && prevWeek.sales > 0) {
    const diff = currentWeek.sales - prevWeek.sales;
    const percent = Math.round((Math.abs(diff) / prevWeek.sales) * 100);
    isPositive = diff >= 0;
    insightMsg = isPositive 
      ? `📈 Great job! Sales are up ${percent}% (£${Math.abs(diff).toLocaleString()}) compared to the previous week.`
      : `📉 Heads up: Sales are down ${percent}% (£${Math.abs(diff).toLocaleString()}) compared to the previous week.`;
  } else if (currentWeek.sales > 0 && prevWeek.sales === 0) {
    insightMsg = `📈 Great job! You made £${currentWeek.sales.toLocaleString()} this week, up from £0 last week.`;
  }

  // --- EXPENSE PIE CHART ---
  const expenseMap: any = {};
  rawSuppliers.forEach((s: any) => {
    const cat = s.supplier?.category || 'Other';
    if (!expenseMap[cat]) expenseMap[cat] = 0;
    expenseMap[cat] += (Number(s.amount) || 0);
  });
  const expensePieData = Object.keys(expenseMap).map(k => ({ name: k, value: Math.round(expenseMap[k]) })).filter(e => e.value > 0);
  if (expensePieData.length === 0) expensePieData.push({ name: 'No Expenses', value: 1 });
  const pieColors = ['#3b82f6', '#f97316', '#10b981', '#a855f7', '#f43f5e', '#eab308'];

  // --- MONTHLY GOAL TRACKER ---
  const monthlyTarget = 30000;
  const currentMonthObj = displayMonthlyData[displayMonthlyData.length - 1] || { sales: 0 };
  const currentMonthSales = currentMonthObj.sales;
  const targetPercent = Math.min(100, Math.round((currentMonthSales / monthlyTarget) * 100));

  const selectedPlatforms = platform ? platform.split(',').map(p => p.trim()) : [];
  const realOffersData = offers
    .filter(o => {
      const storeMatch = !store || store === 'Combined' || o.store === store || o.store === 'Combined';
      if (!storeMatch) return false;
      if (selectedPlatforms.length === 0) return true;
      const oPlatformLabel = PLATFORM_LABELS[o.platform?.toLowerCase()] || o.platform;
      return selectedPlatforms.includes(oPlatformLabel);
    })
    .map(offer => {
    const matchingSales = rawSales.filter((s: any) => {
      let pMatch = false
      const sPlatform = (s.platform || '').toLowerCase().replace(/_/g, ' ')
      const oPlatform = (offer.platform || '').toLowerCase().replace(/_/g, ' ')
      if (sPlatform.includes(oPlatform) || oPlatform.includes(sPlatform) || oPlatform === sPlatform) pMatch = true

      let sMatch = false
      if (offer.store === 'Combined') sMatch = true
      else if (offer.store === 'Herbies Pizza' && s.store?.includes('Herbies')) sMatch = true
      else if (offer.store === 'Tasty Bun' && s.store?.includes('Tasty')) sMatch = true
      else if (offer.store === s.store) sMatch = true

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

      return pMatch && sMatch && dMatch
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
      platform: (PLATFORM_LABELS[offer.platform] || offer.platform) + (offer.store !== 'Combined' ? ` (${offer.store})` : ''),
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


  
  const totalSales = r?.sales?.totalGrossSales ?? 0
  const costRatio = (val: number) => totalSales > 0 ? ((val / totalSales) * 100).toFixed(1) + '% of sales' : '0.0% of sales'
  const orders = r?.sales?.totalOrders ?? 0
  const adSpends = r?.sales?.totalAdSpends ?? 0
  const totalCommission = r?.sales?.totalCommission ?? 0
  const totalOtherDeductions = r?.sales?.totalOtherFees ?? 0
  const totalExpenses = r?.expenses?.total ?? 0
  const totalSuppliers = r?.suppliers?.total ?? 0
  const totalStock = r?.stocks?.total ?? 0
  const netProfit = r?.profit?.net ?? 0

  const staffWages = r?.expenses?.byCategory?.['wages'] ?? 0
  const franchiseFees = r?.expenses?.byCategory?.['fees'] ?? 0
  const utilities = (r?.expenses?.byCategory?.['electricity'] ?? 0) + (r?.expenses?.byCategory?.['gas'] ?? 0) + (r?.expenses?.byCategory?.['water'] ?? 0) + (r?.expenses?.byCategory?.['internet'] ?? 0) + (r?.expenses?.byCategory?.['bin'] ?? 0) + (r?.expenses?.byCategory?.['utilities'] ?? 0)
  const marketing = (r?.expenses?.byCategory?.['social_media'] ?? 0) + (r?.expenses?.byCategory?.['facebook_ads'] ?? 0) + (r?.expenses?.byCategory?.['google_ads'] ?? 0) + (r?.expenses?.byCategory?.['newspaper_ads'] ?? 0) + (r?.expenses?.byCategory?.['print_material'] ?? 0) + (r?.expenses?.byCategory?.['marketing_misc'] ?? 0) + (r?.expenses?.byCategory?.['herbies_head_office'] ?? 0)
  const otherExpenses = totalExpenses - staffWages - utilities - franchiseFees - (is2025 ? 0 : marketing)
  const vat = r?.sales?.totalVat ?? 0
  const platformFees = totalCommission

  const platformData = r ? Object.entries(r.sales?.byPlatform ?? {}).map(([k, v]: any) => {
    let name = PLATFORM_LABELS[k] ?? k
    const isTasty = name.includes('Tasty') || (store && store.includes('Tasty'))
    
    if (isTasty) {
      if (name === 'Website') name = 'Tasty Bun Website'
      if (name === 'Mobile App') name = 'Tasty Bun Mobile App'
      if (name === 'POS' || name === 'In-Store POS') name = 'Tasty Bun POS'
    } else {
      if (name === 'Website' || name === 'Mobile App' || name === 'Web & App') name = 'Herbies Web & App'
      if (name === 'POS' || name === 'In-Store POS') name = 'Herbies POS'
    }

    const isDirect = name.includes('Web & App') || name.includes('Website') || name.includes('Mobile App') || name.includes('POS')
    
    let deductions = v.grossSales - v.netPaid
    if (isDirect) {
      if (v.commission > 0) {
        deductions = v.commission
      } else if (isTasty) {
        deductions = v.grossSales * 0.04
      } else if (name.includes('Web & App') || name.includes('Website') || name.includes('Mobile App')) {
        deductions = v.grossSales * 0.085
      } else {
        deductions = 0
      }
    }
    
    const net = v.netPaid

    return {
      name, 
      sales: v.grossSales, 
      orders: v.orders,
      deductions, 
      net,
    }
  }) : []

  const CHANNEL_ORDER = [
    'Deliveroo',
    'Just Eat',
    'Uber Eats',
    'Herbies POS',
    'Herbies Web & App',
    'Tasty Bun POS',
    'Tasty Bun Web & App',
    'Tasty Bun Website',
    'Tasty Bun Mobile App',
  ]

  platformData.sort((a: any, b: any) => {
    const idxA = CHANNEL_ORDER.indexOf(a.name)
    const idxB = CHANNEL_ORDER.indexOf(b.name)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.name.localeCompare(b.name)
  })

  const supplierData = Object.values((r?.suppliers?.items || []).reduce((acc: any, inv: any) => {
    const name = inv.supplier?.name || 'Unknown Supplier'
    if (!acc[name]) acc[name] = { name, category: inv.supplier?.category || 'General', amount: 0 }
    acc[name].amount += inv.amount || 0
    return acc
  }, {})).sort((a: any, b: any) => a.name.localeCompare(b.name))

  // --- Weekly Comparison Data Logic ---
  const uniqueWeeksSet = new Set<string>();
  rawSales.forEach((s: any) => { if (s.weekStart) uniqueWeeksSet.add(s.weekStart); });
  const uniqueWeeks = Array.from(uniqueWeeksSet).sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime());

  // We want the last 6 weeks (from the latest available date)
  const latest6WeeksDates = uniqueWeeks.slice(0, 6).reverse(); // oldest to newest
  const previous6WeeksDates = uniqueWeeks.slice(6, 12).reverse();

  const getWeeklyStats = (weekDates: string[]) => {
    const weeklyData = weekDates.map(dateStr => {
      const weekSales = rawSales.filter((s: any) => s.weekStart === dateStr);
      const wSales = weekSales.reduce((sum: number, s: any) => sum + (s.grossSales || 0), 0);
      const wOrders = weekSales.reduce((sum: number, s: any) => sum + (s.totalOrders || 0), 0);
      const wNetPaid = weekSales.reduce((sum: number, s: any) => sum + (s.netPaid || 0), 0);
      const wAdSpends = weekSales.reduce((sum: number, s: any) => sum + (s.adSpends || 0), 0);
      const wOtherFees = weekSales.reduce((sum: number, s: any) => sum + (s.otherFees || 0), 0);
      
      const wProfit = wNetPaid - wAdSpends - wOtherFees;
      const mapKey = dateStr.split('T')[0];
        const wSuppliers = weeklyMap[mapKey]?.suppliers || 0;
        
        const d = new Date(dateStr);
        const endD = new Date(d);
        endD.setDate(d.getDate() + 6);
      const formatD = (date: Date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      
      const w1 = new Date(d.getFullYear(), 0, 4);
      const isoWeek = 1 + Math.round(((d.getTime() - w1.getTime()) / 86400000 - 3 + (w1.getDay() + 6) % 7) / 7);

            return {
        dateStr,
        name: `Week ${isoWeek}`,
        dateRange: `${formatD(d)} - ${formatD(endD)}`,
        sales: wSales,
        orders: wOrders,
        aov: wOrders > 0 ? wSales / wOrders : 0,
        profit: wProfit,
        suppliers: wSuppliers
      };
    });

    const totalSales = weeklyData.reduce((sum, w) => sum + w.sales, 0);
    const totalOrders = weeklyData.reduce((sum, w) => sum + w.orders, 0);
    const totalProfit = weeklyData.reduce((sum, w) => sum + w.profit, 0);
    const totalAov = totalOrders > 0 ? totalSales / totalOrders : 0;

    return { weeklyData, totalSales, totalOrders, totalProfit, aov: totalAov };
  };

  const curr6Stats = getWeeklyStats(latest6WeeksDates);
  const prev6Stats = getWeeklyStats(previous6WeeksDates);

  const calcTrend = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  const trendSales = calcTrend(curr6Stats.totalSales, prev6Stats.totalSales);
  const trendOrders = calcTrend(curr6Stats.totalOrders, prev6Stats.totalOrders);
  const trendAov = calcTrend(curr6Stats.aov, prev6Stats.aov);
  const trendProfit = calcTrend(curr6Stats.totalProfit, prev6Stats.totalProfit);

  const getDynamicSubtitle = () => {
    let parts = []
    
    // 1. Store
    if (is2025) {
      parts.push('Tasty Bun')
    } else {
      parts.push(store || 'Combined')
    }

    // 2. Month and Year, 3. Week
    if (filter.preset === 'specific_period' && filter.year !== 'all') {
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      if (filter.month !== 'all') {
        const m = parseInt(filter.month || '0')
        parts.push(`${monthNames[m]} ${filter.year}`)
        
        if (filter.week !== 'all') {
          // Calculate the week string
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
    return parts.join(' | ')
  }

  const customExpensePieData = [
    { name: 'Wages', value: staffWages },
    { name: 'Supplier Purchases', value: totalSuppliers },
    { name: 'Franchise & POS', value: franchiseFees + totalCommission },
    { name: 'Others', value: otherExpenses },
    { name: 'Utilities', value: utilities },
    { name: 'Marketing', value: marketing + adSpends }
  ].filter(e => e.value > 0);
  const customExpensePieTotal = customExpensePieData.reduce((sum, e) => sum + e.value, 0);

  const maxSales = Math.max(...platformData.map((p: any) => p.sales), 1);
  const combinedTotalCost = totalExpenses;
  const expenseDistributionList = customExpensePieData.map((e, i) => ({
    name: e.name,
    amount: e.value,
    color: ['bg-amber-500', 'bg-pink-500', 'bg-cyan-500', 'bg-rose-500', 'bg-violet-500', 'bg-teal-500'][i % 6]
  }));


  const customSalesPieData = platformData.map((p: any) => ({
    name: p.name,
    value: p.sales
  })).filter((e: any) => e.value > 0);
  const customSalesPieTotal = customSalesPieData.reduce((sum, e) => sum + e.value, 0);

  const chartColors = ['#3b82f6', '#10b981', '#f97316', '#ec4899', '#a855f7', '#eab308', '#06b6d4'];

  const getExportFilename = () => {
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const storeLabel = store ? store.replace(/\s+/g, '_') : 'Combined'
    
    let datePart = 'All_Time'
    if (filter.preset === 'specific_period' && filter.year !== 'all') {
      if (filter.month !== 'all') {
        const m = parseInt(filter.month || '0')
        datePart = `${monthNames[m]}_${filter.year}`
        if (filter.week !== 'all') {
          datePart += `_Week_${filter.week}_Ending_${filter.to}`
        }
      } else {
        datePart = `Year_${filter.year}`
      }
    } else if (filter.preset === 'this_month') {
      datePart = 'This_Month'
    } else if (filter.preset === 'last_month') {
      datePart = 'Last_Month'
    } else if (filter.preset === 'last_week') {
      datePart = 'Last_Week'
    } else if (filter.preset === 'last_4_weeks') {
      datePart = 'Last_4_Weeks'
    }

    return `Henley_${storeLabel}_${datePart}`
  }

  return (
    <div className="space-y-8 pb-10 print-bw-report">
      {/* --- VISUAL DASHBOARD --- */}
      <div id="dashboard-export-area" className="bg-transparent min-h-screen text-slate-700 dark:text-slate-200 p-1 sm:p-2 lg:p-4 font-sans flex flex-col gap-6 sm:gap-8 pb-32 max-w-full min-w-0">
        {/* Header & Filter Controls Section */}
        <div className="flex flex-col gap-6 relative z-10">
        
        {/* Tier 1: Dynamic Title with Brand Logos on Left & Export Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 relative gap-4">
          <div className={`flex items-center flex-wrap ${activeTab === 'weekly' ? 'justify-center w-full' : 'gap-4'}`}>
            {/* Dynamic Logos on Left Side */}
            <div className={`flex items-center gap-2 ${activeTab === 'weekly' ? 'hidden' : ''}`}>
              {(store === '' || store === 'Herbies Pizza') && (
                <img
                  src="/logos/herbies-pizza.jpg"
                  alt="Herbies Pizza"
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-[#1f2947] shadow-md"
                />
              )}
              {(store === '' || store === 'Tasty Bun') && (
                <img
                  src="/logos/tasty-bun.jpg"
                  alt="Tasty Bun"
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-[#1f2947] shadow-md"
                />
              )}
            </div>

            <div className={activeTab === 'weekly' ? 'text-center' : ''}>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-words">
                {activeTab === 'weekly' ? 'Weekly Comparison' : (session?.user?.clientName ?? 'Henley on Thames')}
              </h1>
              <p className={`text-slate-500 dark:text-slate-400 mt-1 font-medium ${activeTab === 'weekly' ? 'hidden' : ''}`}>{getDynamicSubtitle()}</p>
            </div>
          </div>

          <div className="print:hidden self-start sm:self-auto" data-html2canvas-ignore="true">
            <button onClick={() => exportToPDF('dashboard-export-area', getExportFilename())} className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-xl px-4 py-2.5 text-slate-900 dark:text-white hover:text-blue-300 hover:bg-slate-200 dark:hover:bg-[#1a2235] text-sm font-bold transition flex items-center gap-2 shadow-lg cursor-pointer whitespace-nowrap">
              <span>📄</span> Export PDF Report
            </button>
          </div>
        </div>

        {/* Tier 2: Unified Executive Filter Toolbar */}
        {activeTab !== 'offers' && (
          <>
            <div className="w-full max-w-full bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-2xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-3 sm:gap-4 print:hidden shadow-xl backdrop-blur-md">
              {/* Left Side: Store Pills & Platform Filter */}
              <div className="flex flex-wrap items-center gap-3">
                {!is2025 && (
                  <div className="flex items-center gap-1 bg-transparent border border-slate-200 dark:border-[#1f2947] p-1 rounded-xl max-w-full overflow-x-auto">
                    <button
                      onClick={() => { setStore(''); setPlatform(''); }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        store === '' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      Combined
                    </button>
                    <button
                      onClick={() => { setStore('Herbies Pizza'); setPlatform(''); }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        store === 'Herbies Pizza' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      Herbies Pizza
                    </button>
                    <button
                      onClick={() => { setStore('Tasty Bun'); setPlatform(''); }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        store === 'Tasty Bun' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      Tasty Bun
                    </button>
                  </div>
                )}

                {!is2025 && <div className="w-[1px] h-5 bg-slate-300 dark:bg-[#1f2947] hidden sm:block"></div>}

                {/* Multi-Select Platform Checkboxes */}
                <MultiPlatformFilter 
                  selectedPlatforms={platform} 
                  onChange={setPlatform} 
                  options={store === 'Herbies Pizza' ? HERBIES_PLATFORMS : (store === 'Tasty Bun' ? TASTY_BUN_PLATFORMS : HENLEY_COMBINED_PLATFORMS)}
                />
              </div>

              {/* Right Side: Date Filter & Reset */}
              <div className="flex flex-wrap items-center gap-3">
                <DateFilter filter={filter} setFilter={setFilter} />

                <div className="w-[1px] h-5 bg-slate-300 dark:bg-[#1f2947] hidden sm:block"></div>

                <button 
                  onClick={() => { setFilter(defaultDateFilter()); if(!is2025) setStore(''); setPlatform(''); }} 
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-[#1f2947]/50 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Reset
                </button>
              </div>
            </div>

            {/* Active Filters Bar */}
            <ActiveFilters
              store={is2025 ? (store === 'Herbies Pizza' ? '' : store) : store}
              onClearStore={() => { setStore(''); setPlatform(''); }}
              platform={platform}
              onClearPlatform={() => setPlatform('')}
              filter={filter}
              onClearFilter={() => setFilter(defaultDateFilter())}
              onClearAll={() => { setFilter(defaultDateFilter()); if (!is2025) setStore(''); setPlatform(''); }}
              className="px-1"
            />
          </>
        )}
      </div>

      <div className={activeTab === 'overview' ? 'flex flex-col gap-8' : 'hidden'}>
        {/* Primary KPIs - 5 cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
        <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-2xl p-3.5 sm:p-4 lg:p-3.5 xl:p-5 shadow-lg min-w-0 overflow-hidden flex flex-col justify-between">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">Total Orders</div>
          <div className="text-base sm:text-lg md:text-xl lg:text-[1.15rem] xl:text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums truncate">{orders}</div>
        </div>
        <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-2xl p-3.5 sm:p-4 lg:p-3.5 xl:p-5 shadow-lg min-w-0 overflow-hidden flex flex-col justify-between">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">Gross Sales</div>
          <div className="text-base sm:text-lg md:text-xl lg:text-[1.15rem] xl:text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums truncate">{gbp(totalSales)}</div>
        </div>
        <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-2xl p-3.5 sm:p-4 lg:p-3.5 xl:p-5 shadow-lg min-w-0 overflow-hidden flex flex-col justify-between">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">Net Sales</div>
          <div className="text-base sm:text-lg md:text-xl lg:text-[1.15rem] xl:text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums truncate">{gbp(r?.sales?.totalNetPaid ?? 0)}</div>
        </div>
        <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-2xl p-3.5 sm:p-4 lg:p-3.5 xl:p-5 shadow-lg min-w-0 overflow-hidden flex flex-col justify-between">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">Total Expenses</div>
          <div className="text-base sm:text-lg md:text-xl lg:text-[1.15rem] xl:text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums truncate">{gbp(totalExpenses + totalSuppliers)}</div>
        </div>
        <div className="col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1 bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-2xl p-3.5 sm:p-4 lg:p-3.5 xl:p-5 shadow-lg min-w-0 overflow-hidden flex flex-col justify-between">
          <div className={`text-[10px] sm:text-[11px] font-bold ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} uppercase tracking-wider mb-1 truncate`}>Net Profit</div>
          <div className={`text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-3xl font-black ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} tracking-tight tabular-nums truncate`}>{gbp(netProfit)}</div>
        </div>
      </div>

      {/* Expense Breakdown Strip — 7 tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-3">
        <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-sm rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 truncate flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
            <span className="truncate">Franchise & Fees</span>
          </div>
          <div className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight tabular-nums truncate">{gbp(franchiseFees)}</div>
          <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{costRatio(franchiseFees)}</div>
        </div>
        <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-sm rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 truncate flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
            <span className="truncate">Utilities</span>
          </div>
          <div className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight tabular-nums truncate">{gbp(utilities)}</div>
          <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{costRatio(utilities)}</div>
        </div>
        <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-sm rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 truncate flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
            <span className="truncate">Wages</span>
          </div>
          <div className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight tabular-nums truncate">{gbp(staffWages)}</div>
          <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{costRatio(staffWages)}</div>
        </div>
        <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-sm rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 truncate flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
            <span className="truncate">Suppliers</span>
          </div>
          <div className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight tabular-nums truncate">{gbp(totalSuppliers)}</div>
          <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{costRatio(totalSuppliers)}</div>
        </div>
        {!is2025 && (
          <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-sm rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between min-w-0 overflow-hidden">
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0"></span>
              <span className="truncate">Marketing</span>
            </div>
            <div className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight tabular-nums truncate">{gbp(marketing)}</div>
            <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{costRatio(marketing)}</div>
          </div>
        )}
        <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-sm rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 truncate flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
            <span className="truncate">Others</span>
          </div>
          <div className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight tabular-nums truncate">{gbp(otherExpenses)}</div>
          <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{costRatio(otherExpenses)}</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 shadow-sm rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-1 truncate flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0"></span>
            <span className="truncate">Total Expenses</span>
          </div>
          <div className="text-sm sm:text-base md:text-lg font-black text-purple-800 dark:text-purple-200 tracking-tight tabular-nums truncate">{gbp(totalExpenses + totalSuppliers)}</div>
          <div className="text-[10px] font-semibold text-purple-600/80 dark:text-purple-300/80 mt-0.5">{costRatio(totalExpenses + totalSuppliers)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profit Summary Section */}
        <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-3xl p-8 shadow-2xl lg:col-span-1 flex flex-col relative overflow-hidden z-0">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/10 blur-[80px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-slate-900 dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#E5B869]/20 shadow-inner">
                💰
              </span>
              Profit Summary
            </div>
            <button 
              onClick={() => setExpandAll(!expandAll)} 
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title={expandAll ? "Collapse All" : "Expand All"}
            >
              {expandAll ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              )}
            </button>
          </h2>
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-600 dark:text-slate-300 font-semibold text-lg">Gross Sales</span>
            <span className="text-slate-900 dark:text-white font-bold text-lg">{gbp(totalSales)}</span>
          </div>

          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-[#1f2947] pb-2">Less:</div>
          
          <div className="space-y-4 flex-1">
            {/* 1. Commissions */}
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Commissions (3rd Parties)</span>
                <span className="text-red-400 font-medium">-{gbp(totalCommission)}</span>
              </div>
              {expandAll && totalCommission > 0 && r?.sales?.byPlatform && (
                <div className="pl-3 pt-1 space-y-1 mt-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 mb-2">
                  {Object.entries(r.sales.byPlatform)
                    .sort(([aKey], [bKey]) => (PLATFORM_LABELS[aKey] || aKey).localeCompare(PLATFORM_LABELS[bKey] || bKey))
                    .map(([platKey, pData]: [string, any]) => {
                      const deduction = pData.commission ?? 0
                      if (deduction > 0) {
                        return (
                          <div key={platKey} className="flex justify-between items-center text-xs text-slate-500">
                            <span>• {PLATFORM_LABELS[platKey] || platKey}</span>
                            <span>-{gbp(deduction)}</span>
                          </div>
                        )
                      }
                      return null
                  })}
                </div>
              )}
            </div>

            {/* 1.2 Other Deductions */}
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Other Deductions</span>
                <span className="text-red-400 font-medium">-{gbp(totalOtherDeductions)}</span>
              </div>
              {expandAll && totalOtherDeductions > 0 && r?.sales?.byPlatform && (
                <div className="pl-3 pt-1 space-y-1 mt-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 mb-2">
                  {Object.entries(r.sales.byPlatform)
                    .sort(([aKey], [bKey]) => (PLATFORM_LABELS[aKey] || aKey).localeCompare(PLATFORM_LABELS[bKey] || bKey))
                    .map(([platKey, pData]: [string, any]) => {
                      const deduction = pData.otherFees ?? 0
                      if (deduction > 0) {
                        return (
                          <div key={platKey} className="flex justify-between items-center text-xs text-slate-500">
                            <span>• {PLATFORM_LABELS[platKey] || platKey}</span>
                            <span>-{gbp(deduction)}</span>
                          </div>
                        )
                      }
                      return null
                  })}
                </div>
              )}
            </div>



            {/* 1.6 Ad Spends */}
            {!is2025 && (
              <div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">3rd Party Ad Spends</span>
                  <span className="text-red-400 font-medium">-{gbp(adSpends)}</span>
                </div>
                {expandAll && adSpends > 0 && r?.sales?.byPlatform && (
                  <div className="pl-3 pt-1 space-y-1 mt-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 mb-2">
                    {Object.entries(r.sales.byPlatform)
                      .sort(([aKey], [bKey]) => (PLATFORM_LABELS[aKey] || aKey).localeCompare(PLATFORM_LABELS[bKey] || bKey))
                      .map(([platKey, pData]: [string, any]) => {
                        const deduction = pData.adSpends ?? 0
                        if (deduction > 0) {
                          return (
                            <div key={platKey} className="flex justify-between items-center text-xs text-slate-500">
                              <span>• {PLATFORM_LABELS[platKey] || platKey}</span>
                              <span>-{gbp(deduction)}</span>
                            </div>
                          )
                        }
                        return null
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. Franchise & POS Fees */}
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Franchise & POS Fees</span>
                <span className="text-red-400 font-medium">-{gbp(franchiseFees)}</span>
              </div>
              {expandAll && franchiseFees > 0 && (
                <div className="pl-3 pt-1 space-y-1 mt-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 mb-2">
                  {Object.entries(
                    (r?.expenses?.items || [])
                      .filter((e: any) => e.category === 'fees')
                      .reduce((acc: any, e: any) => {
                        const name = e.subcategory || 'Fee'
                        acc[name] = (acc[name] || 0) + e.amount
                        return acc
                      }, {})
                  )
                    .sort((a: any, b: any) => a[0].localeCompare(b[0]))
                    .map(([name, amount]: any) => (
                      <div key={name} className="flex justify-between items-center text-xs text-slate-500">
                        <span>• {name}</span>
                        <span>-{gbp(amount)}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* 3. Marketing */}
            {!is2025 && (
              <div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Marketing</span>
                  <span className="text-red-400 font-medium">-{gbp(marketing)}</span>
                </div>
                {expandAll && marketing > 0 && (
                  <div className="pl-3 pt-1 space-y-1 mt-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 mb-2">
                    {['facebook_ads', 'google_ads', 'marketing_misc', 'newspaper_ads', 'print_material', 'social_media', 'herbies_head_office'].map(cat => {
                      const amt = r?.expenses?.byCategory?.[cat] ?? 0
                      if (amt > 0) {
                        const labels: any = { social_media: 'Social Media Handling Fee', facebook_ads: 'Facebook Ads', google_ads: 'Google Ads', newspaper_ads: 'Newspaper Ads', print_material: 'Print Material', marketing_misc: 'Other Marketing', herbies_head_office: 'Herbies Pizza Head Office Marketing' }
                        return (
                          <div key={cat} className="flex justify-between items-center text-xs text-slate-500">
                            <span>• {labels[cat]}</span>
                            <span>-{gbp(amt)}</span>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. Other Expenses */}
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Other Expenses</span>
                <span className="text-red-400 font-medium">-{gbp(otherExpenses)}</span>
              </div>
              {expandAll && otherExpenses > 0 && (
                <div className="pl-3 pt-1 space-y-1 mt-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 mb-2">
                  {Object.entries(
                    (r?.expenses?.items || [])
                      .filter((e: any) => {
                        const excluded = ['fees', 'wages', 'electricity', 'gas', 'water', 'internet', 'bin', 'utilities']
                        if (!is2025) excluded.push('social_media', 'facebook_ads', 'google_ads', 'newspaper_ads', 'print_material', 'marketing_misc', 'herbies_head_office')
                        return !excluded.includes(e.category)
                      })
                      .reduce((acc: any, e: any) => {
                        const name = e.subcategory || e.category || 'Other'
                        acc[name] = (acc[name] || 0) + e.amount
                        return acc
                      }, {})
                  )
                    .sort((a: any, b: any) => a[0].localeCompare(b[0]))
                    .map(([name, amount]: any) => (
                      <div key={name} className="flex justify-between items-center text-xs text-slate-500">
                        <span>• {name.charAt(0).toUpperCase() + name.slice(1)}</span>
                        <span>-{gbp(amount)}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* 5. Staff Wages */}
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Staff Wages</span>
                <span className="text-red-400 font-medium">-{gbp(staffWages)}</span>
              </div>
              {expandAll && Object.keys(r?.expenses?.wagesByStaff || {}).length > 0 && (
                <div className="pl-3 pt-1 space-y-1 mt-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 mb-2">
                  {Object.entries(r.expenses.wagesByStaff)
                    .sort(([aName], [bName]: any) => aName.localeCompare(bName))
                    .map(([name, amt]: any) => {
                    if (amt > 0) {
                      return (
                        <div key={name} className="flex justify-between items-center text-xs text-slate-500">
                          <span>• {name}</span>
                          <span>-{gbp(amt)}</span>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              )}
            </div>

            {/* 6. Supplier Purchases */}
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Supplier Purchases</span>
                <span className="text-red-400 font-medium">-{gbp(totalSuppliers)}</span>
              </div>
              {expandAll && supplierData.length > 0 && (
                <div className="pl-3 pt-1 space-y-1 mt-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 mb-2">
                  {supplierData.map((s: any) => (
                    <div key={s.name} className="flex justify-between items-center text-xs text-slate-500">
                      <span>• {s.name}</span>
                      <span>-{gbp(s.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 7. Utilities */}
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Utilities</span>
                <span className="text-red-400 font-medium">-{gbp(utilities)}</span>
              </div>
              {expandAll && utilities > 0 && (
                <div className="pl-3 pt-1 space-y-1 mt-1">
                  {Object.entries(
                    (r?.expenses?.items || [])
                      .filter((e: any) => ['electricity', 'gas', 'water', 'internet', 'bin', 'utilities'].includes(e.category))
                      .reduce((acc: any, e: any) => {
                        const name = e.subcategory || e.category
                        acc[name] = (acc[name] || 0) + e.amount
                        return acc
                      }, {})
                  )
                    .sort((a: any, b: any) => a[0].localeCompare(b[0]))
                    .map(([name, amount]: any) => (
                      <div key={name} className="flex justify-between items-center text-xs text-slate-500">
                        <span>• {name.charAt(0).toUpperCase() + name.slice(1)}</span>
                        <span>-{gbp(amount)}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-[#E5B869]/20 flex justify-between items-center">
            <span className={`font-black text-xl ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>= Net Profit</span>
            <span className={`font-black text-2xl ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{gbp(netProfit)}</span>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8 flex flex-col">

          {/* Platform Table */}
          <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-3xl p-8 shadow-2xl flex flex-col relative overflow-hidden z-0">
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-500/10 blur-[100px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-slate-900 dark:text-white flex items-center justify-center border border-blue-500/20 shadow-inner">
                📊
              </span>
              Platform Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-slate-500 dark:text-slate-400 border-b-2 border-slate-200 dark:border-[#1f2947]">
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs">Platform</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs text-right">Orders</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs text-right">Sales</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs text-right">Deductions</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs text-right">Ded. %</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs text-right text-slate-900 dark:text-white">Net Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2947]">
                  {platformData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">No platform data available</td>
                    </tr>
                  ) : (
                    platformData.map((p: any, i: number) => (
                      <tr key={i} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                        <td className="py-4 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                        <td className="py-4 text-slate-600 dark:text-slate-300 text-right">{p.orders}</td>
                        <td className="py-4 text-slate-900 dark:text-white text-right font-medium">{gbp(p.sales)}</td>
                        <td className="py-4 text-red-400 text-right font-medium">{gbp(p.deductions)}</td>
                        <td className="py-4 text-amber-400 text-right font-medium">
                          {(() => {
                            if (p.sales <= 0) return '0.0%'
                            if (p.name.includes('Herbies') && (p.name.includes('Web & App') || p.name.includes('Website') || p.name.includes('Mobile App'))) return '8.5%'
                            if (p.name.includes('Tasty') && (p.name.includes('Web & App') || p.name.includes('Website') || p.name.includes('Mobile App') || p.name.includes('POS'))) return '4.0%'
                            if (p.name.includes('Herbies POS')) return '0.0%'
                            return ((p.deductions / p.sales) * 100).toFixed(1) + '%'
                          })()}
                        </td>
                        <td className="py-4 text-slate-900 dark:text-white text-right font-bold">{gbp(p.net)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>

              

            </div>

          {/* Supplier Purchases Table */}
          <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-3xl p-8 shadow-2xl flex flex-col relative overflow-hidden z-0 mt-8">
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-orange-500/10 blur-[100px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-orange-500/10 text-slate-900 dark:text-white flex items-center justify-center border border-orange-500/20 shadow-inner">
                🛒
              </span>
              Supplier Purchases
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-slate-500 dark:text-slate-400 border-b-2 border-slate-200 dark:border-[#1f2947]">
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs">Supplier</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs">Category</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2947]">
                  {supplierData.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-500">No supplier purchases found</td>
                    </tr>
                  ) : (
                    supplierData.map((s: any, i: number) => (
                      <tr key={i} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                        <td className="py-4 font-semibold text-slate-900 dark:text-white">{s.name}</td>
                        <td className="py-4 text-slate-500 dark:text-slate-400 capitalize">{s.category}</td>
                        <td className="py-4 text-slate-900 dark:text-white text-right font-bold">{gbp(s.amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
              {/* Visual Distribution Charts Stacked Vertically under Platform Performance */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-[#1f2947] flex flex-col gap-5">
                
                {/* Sales Distribution */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-700 dark:text-slate-200">
                    <span className="flex items-center gap-2"><span className="text-slate-900 dark:text-white">📊</span> Sales Distribution</span>
                    <span className="text-slate-900 dark:text-white font-bold text-xs">{gbp(totalSales)}</span>
                  </div>
                  <div className="space-y-1.5">
                    {platformData.map((p: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">{p.name}</span>
                          <span className="text-slate-900 dark:text-white font-bold text-xs">{gbp(p.sales)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-50 dark:bg-[#0e121b] rounded-full overflow-hidden border border-slate-200 dark:border-[#1f2947]">
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
                  <div className="flex justify-between items-center text-sm font-bold text-slate-700 dark:text-slate-200">
                    <span className="flex items-center gap-2"><span className="text-slate-900 dark:text-white">📉</span> Expense Distribution</span>
                    <span className="text-slate-900 dark:text-white font-bold text-xs">{gbp(combinedTotalCost)}</span>
                  </div>
                  <div className="space-y-1.5">
                    {expenseDistributionList.map((item: any, idx: number) => {
                      const pct = combinedTotalCost > 0 ? ((item.amount / combinedTotalCost) * 100).toFixed(1) : '0.0'
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">{item.name}</span>
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-xs">{pct}% <span className="text-slate-500 font-normal">({gbp(item.amount)})</span></span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-50 dark:bg-[#0e121b] rounded-full overflow-hidden border border-slate-200 dark:border-[#1f2947]">
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

        
        {/* --- WEEKLY TAB --- */}
          <div className={activeTab === 'weekly' ? 'block' : 'hidden'}>
            {curr6Stats.weeklyData.length > 0 ? (
            <div className="w-full mt-2">

              {/* Main Chart (Dark Theme) */}
              <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-xl p-4 sm:p-6 shadow-xl h-[450px] sm:h-[500px] flex flex-col w-full mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                  <h2 className="text-slate-900 dark:text-white font-bold uppercase tracking-wide text-xs sm:text-sm">
                    <span className="text-slate-900 dark:text-white mr-2">1.</span>WEEKLY SALES & ORDERS
                  </h2>
                  <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-[13px] font-bold">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span> 
                      <span className="text-slate-600 dark:text-slate-300">Sales (£)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#f97316]"></span> 
                      <span className="text-slate-600 dark:text-slate-300">Orders</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={curr6Stats.weeklyData} margin={{ top: 20, right: isMobile ? -10 : 0, left: isMobile ? -20 : 0, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        tick={(props: any) => {
                          const { x, y, payload } = props;
                          const data = curr6Stats.weeklyData.find((d: any) => d.name === payload.value);
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <text x={0} y={0} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={isMobile ? 10 : 12} fontWeight="bold">{payload.value}</text>
                              {data?.dateRange && (
                                <text x={0} y={0} dy={30} textAnchor="middle" fill="#64748b" fontSize={isMobile ? 9 : 11}>
                                  {isMobile ? data.dateRange.replace(/ Sept/g, ' Sep').replace(/ Oct/g, ' Oct').replace(/ Aug/g, ' Aug').replace(/ July/g, ' Jul') : data.dateRange}
                                </text>
                              )}
                            </g>
                          );
                        }}
                        tickMargin={12} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <YAxis 
                        yAxisId="left" 
                        stroke="#64748b" 
                        tick={{ fill: '#94a3b8', fontSize: isMobile ? 10 : 12 }} 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(v: any) => '£' + (v >= 1000 ? (v/1000).toFixed(0) + 'k' : v)} 
                        dx={-5}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#64748b" 
                        tick={{ fill: '#94a3b8', fontSize: isMobile ? 10 : 12 }} 
                        axisLine={false} 
                        tickLine={false} 
                        dx={5}
                      />
                      <Tooltip cursor={{ fill: '#1e293b' }} itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any, name: string) => name === 'sales' ? gbp(v as number) : v} />
                      
                      <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60}>
                        {!isMobile && (
                          <LabelList dataKey="sales" position="top" fill="#3b82f6" fontSize={12} fontWeight="bold" formatter={(v: any) => gbp(v as number)} offset={8} />
                        )}
                      </Bar>
                      <Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={60}>
                        {!isMobile && (
                          <LabelList dataKey="orders" position="top" fill="#f97316" fontSize={12} fontWeight="bold" offset={8} />
                        )}
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

                {/* 3 Bottom Widgets */}
                <div className="flex flex-col gap-6 w-full mb-8">
                  {/* Top Row: 2 Pies */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                  {/* Sales Mix */}
                  <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-xl p-4 sm:p-6 shadow-xl flex flex-col items-center">
                    <h2 className="text-slate-900 dark:text-white font-bold mb-4 sm:mb-6 self-start text-base sm:text-lg">Sales Mix</h2>
                    <div className="flex flex-col sm:flex-row w-full items-center gap-6">
                      <div className="w-[220px] h-[220px] relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={customSalesPieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} stroke="none" dataKey="value">
                              {customSalesPieData.map((e, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                            </Pie>
                            <Tooltip cursor={{ fill: '#1e293b' }} itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => gbp(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-[#a17a36] dark:text-[#E5B869] font-black text-xl tracking-tighter truncate w-full text-center px-1">{gbp(customSalesPieTotal)}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Total Sales</span>
                        </div>
                      </div>
                      <div className="w-full sm:flex-1 sm:pl-6 flex flex-col gap-2.5">
                        {customSalesPieData.map((d, i) => (
                          <div key={i} className="flex justify-between items-center text-xs sm:text-[13px]">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0" style={{ backgroundColor: chartColors[i % chartColors.length] }}></span>
                              <span className="text-slate-600 dark:text-slate-300 font-medium truncate">{d.name}</span>
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0 ml-2">{((d.value / (customSalesPieTotal || 1)) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-xl p-4 sm:p-6 shadow-xl flex flex-col items-center">
                    <h2 className="text-slate-900 dark:text-white font-bold mb-4 sm:mb-6 self-start text-base sm:text-lg">Expense Breakdown</h2>
                    <div className="flex flex-col sm:flex-row w-full items-center gap-6">
                      <div className="w-[220px] h-[220px] relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={customExpensePieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} stroke="none" dataKey="value">
                              {customExpensePieData.map((e, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                            </Pie>
                            <Tooltip cursor={{ fill: '#1e293b' }} itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => gbp(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-[#a17a36] dark:text-[#E5B869] font-black text-xl tracking-tighter truncate w-full text-center px-1">{gbp(customExpensePieTotal)}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase text-center leading-tight mt-1">Total<br/>Expenses</span>
                        </div>
                      </div>
                      <div className="w-full sm:flex-1 sm:pl-6 flex flex-col gap-2.5">
                        {customExpensePieData.map((d, i) => (
                          <div key={i} className="flex justify-between items-center text-xs sm:text-[13px]">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0" style={{ backgroundColor: chartColors[i % chartColors.length] }}></span>
                              <span className="text-slate-600 dark:text-slate-300 font-medium truncate" title={d.name}>{d.name}</span>
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0 ml-2">{((d.value / (customExpensePieTotal || 1)) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  </div>

                  {/* Bottom Row: Supplier Purchases */}
                  <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-xl p-6 shadow-xl flex flex-col w-full h-[350px]">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-slate-900 dark:text-white font-bold text-lg">Supplier Purchases</h2>
                      <span className="text-xs bg-slate-300 dark:bg-[#1f2947] text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-md border border-[#2a3454] uppercase font-bold tracking-wider">Last 6 Weeks</span>
                    </div>
                    <div className="flex-1 min-h-0 w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={curr6Stats.weeklyData} margin={{ top: 15, right: 0, left: -25, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#64748b" 
                            tick={(props: any) => {
                              const { x, y, payload } = props;
                              const data = curr6Stats.weeklyData.find((d: any) => d.name === payload.value);
                              return (
                                <g transform={`translate(${x},${y})`}>
                                  <text x={0} y={0} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={isMobile ? 10 : 12} fontWeight="bold">{payload.value}</text>
                                  {data?.dateRange && (
                                    <text x={0} y={0} dy={30} textAnchor="middle" fill="#64748b" fontSize={isMobile ? 9 : 11}>
                                      {isMobile ? data.dateRange.replace(/ Sept/g, ' Sep').replace(/ Oct/g, ' Oct').replace(/ Aug/g, ' Aug').replace(/ July/g, ' Jul') : data.dateRange}
                                    </text>
                                  )}
                                </g>
                              );
                            }}
                            tickMargin={12} 
                            axisLine={false} 
                            tickLine={false} 
                          />
                          <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: isMobile ? 10 : 12 }} axisLine={false} tickLine={false} tickFormatter={(v: any) => '£' + (v >= 1000 ? (v/1000).toFixed(1) + 'k' : v)} />
                          <Tooltip cursor={{ fill: '#1e293b' }} itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => gbp(v)} />
                          <Bar dataKey="suppliers" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60}>
                            {!isMobile && (
                              <LabelList dataKey="suppliers" position="top" fill="#10b981" fontSize={13} fontWeight="bold" formatter={(v: any) => gbp(v)} offset={8} />
                            )}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                          </div>
            ) : (
              <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center text-center mt-6 w-full">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">No Data Available</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">There are no sales records available for the selected period.</p>
              </div>
            )}
          </div>

        {/* --- MONTHLY TAB --- */}
          <div className={activeTab === 'monthly' ? 'block' : 'hidden'}>
            {displayMonthlyData.length > 0 ? (
            <div className="w-full mt-2">

              {/* Main Chart (Dark Theme) */}
              <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-xl p-4 sm:p-6 shadow-xl h-[450px] sm:h-[500px] flex flex-col w-full mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                  <h2 className="text-slate-900 dark:text-white font-bold uppercase tracking-wide text-xs sm:text-sm">
                    <span className="text-slate-900 dark:text-white mr-2">1.</span>MONTHLY SALES & ORDERS
                  </h2>
                  <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-[13px] font-bold">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span> 
                      <span className="text-slate-600 dark:text-slate-300">Sales (£)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#f97316]"></span> 
                      <span className="text-slate-600 dark:text-slate-300">Orders</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={displayMonthlyData} margin={{ top: 20, right: isMobile ? -10 : 0, left: isMobile ? -20 : 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        tick={{ fill: '#94a3b8', fontSize: isMobile ? 10 : 12, fontWeight: 'bold' }} 
                        tickMargin={12} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <YAxis 
                        yAxisId="left" 
                        stroke="#64748b" 
                        tick={{ fill: '#94a3b8', fontSize: isMobile ? 10 : 12 }} 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(v: any) => '£' + (v >= 1000 ? (v/1000).toFixed(0) + 'k' : v)} 
                        dx={-5}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#64748b" 
                        tick={{ fill: '#94a3b8', fontSize: isMobile ? 10 : 12 }} 
                        axisLine={false} 
                        tickLine={false} 
                        dx={5}
                      />
                      <Tooltip cursor={{ fill: '#1e293b' }} itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any, name: string) => name === 'sales' ? gbp(v as number) : v} />
                      
                      <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60}>
                        {!isMobile && (
                          <LabelList dataKey="sales" position="top" fill="#3b82f6" fontSize={12} fontWeight="bold" formatter={(v: any) => gbp(v as number)} offset={8} />
                        )}
                      </Bar>
                      <Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={60}>
                        {!isMobile && (
                          <LabelList dataKey="orders" position="top" fill="#f97316" fontSize={12} fontWeight="bold" offset={8} />
                        )}
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 3 Bottom Widgets */}
              <div className="flex flex-col gap-6 w-full mb-8">
                {/* Top Row: 2 Pies */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                  {/* Sales Mix */}
                  <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-xl p-4 sm:p-6 shadow-xl flex flex-col items-center">
                    <h2 className="text-slate-900 dark:text-white font-bold mb-4 sm:mb-6 self-start text-base sm:text-lg">Sales Mix</h2>
                    <div className="flex flex-col sm:flex-row w-full items-center gap-6">
                      <div className="w-[220px] h-[220px] relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={customSalesPieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} stroke="none" dataKey="value">
                              {customSalesPieData.map((e, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                            </Pie>
                            <Tooltip cursor={{ fill: '#1e293b' }} itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => gbp(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2">
                          <span className="text-[#a17a36] dark:text-[#E5B869] font-black text-xl tracking-tighter truncate w-full text-center">{gbp(customSalesPieTotal)}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1">Total Sales</span>
                        </div>
                      </div>
                      <div className="w-full sm:flex-1 sm:pl-6 flex flex-col gap-2.5">
                        {customSalesPieData.map((d, i) => (
                          <div key={i} className="flex justify-between items-center text-xs sm:text-[13px]">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0" style={{ backgroundColor: chartColors[i % chartColors.length] }}></span>
                              <span className="text-slate-600 dark:text-slate-300 font-medium truncate">{d.name}</span>
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0 ml-2">{((d.value / (customSalesPieTotal || 1)) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-xl p-4 sm:p-6 shadow-xl flex flex-col items-center">
                    <h2 className="text-slate-900 dark:text-white font-bold mb-4 sm:mb-6 self-start text-base sm:text-lg">Expense Breakdown</h2>
                    <div className="flex flex-col sm:flex-row w-full items-center gap-6">
                      <div className="w-[220px] h-[220px] relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={customExpensePieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} stroke="none" dataKey="value">
                              {customExpensePieData.map((e, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                            </Pie>
                            <Tooltip cursor={{ fill: '#1e293b' }} itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => gbp(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2">
                          <span className="text-[#a17a36] dark:text-[#E5B869] font-black text-xl tracking-tighter truncate w-full text-center">{gbp(customExpensePieTotal)}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase text-center leading-tight mt-1">Total<br/>Expenses</span>
                        </div>
                      </div>
                      <div className="w-full sm:flex-1 sm:pl-6 flex flex-col gap-2.5">
                        {customExpensePieData.map((d, i) => (
                          <div key={i} className="flex justify-between items-center text-xs sm:text-[13px]">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0" style={{ backgroundColor: chartColors[i % chartColors.length] }}></span>
                              <span className="text-slate-600 dark:text-slate-300 font-medium truncate" title={d.name}>{d.name}</span>
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0 ml-2">{((d.value / (customExpensePieTotal || 1)) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Supplier Purchases */}
                <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-xl p-4 sm:p-6 shadow-xl flex flex-col w-full h-[350px]">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-slate-900 dark:text-white font-bold text-base sm:text-lg">Supplier Purchases</h2>
                    <span className="text-[10px] sm:text-xs bg-slate-300 dark:bg-[#1f2947] text-slate-600 dark:text-slate-300 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md border border-[#2a3454] uppercase font-bold tracking-wider">Last 6 Months</span>
                  </div>
                  <div className="flex-1 min-h-0 w-full mt-2 overflow-x-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={displayMonthlyData} margin={{ top: 15, right: isMobile ? -10 : 0, left: isMobile ? -25 : -25, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#64748b" 
                          tick={{ fill: '#94a3b8', fontSize: isMobile ? 10 : 12, fontWeight: 'bold' }}
                          tickMargin={12} 
                          axisLine={false} 
                          tickLine={false} 
                        />
                        <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: isMobile ? 10 : 12 }} axisLine={false} tickLine={false} tickFormatter={(v: any) => '£' + (v >= 1000 ? (v/1000).toFixed(1) + 'k' : v)} />
                        <Tooltip cursor={{ fill: '#1e293b' }} itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => gbp(v)} />
                        <Bar dataKey="suppliers" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60}>
                          {!isMobile && (
                            <LabelList dataKey="suppliers" position="top" fill="#10b981" fontSize={13} fontWeight="bold" formatter={(v: any) => gbp(v)} offset={8} />
                          )}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            ) : (
            <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center text-center mt-6 w-full">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">No Data Available</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">There are no sales records available for the selected period.</p>
            </div>
          )}
          </div>
  {/* --- OFFERS TAB --- */}
        <div className={activeTab === 'offers' ? 'block' : 'hidden'}>
          <OffersCampaignView
            offers={offers}
            currWeeklyData={curr6Stats.weeklyData}
            prevWeeklyData={prev6Stats.weeklyData}
            rawSales={rawSales}
            platformData={platformData}
            isAdmin={session?.user?.role === 'admin'}
            clientId={session?.user?.role === 'admin' ? 'cmpv4dvik0000vdj089wl6zmf' : (session?.user?.clientId || undefined)}
            currentStore={store || 'Combined'}
            onStoreChange={(s) => setStore(s === 'Combined' ? '' : s)}
            availableStores={is2025 ? ['Tasty Bun'] : ['Combined', 'Herbies Pizza', 'Tasty Bun']}
            is2025={is2025}
            onOffersChange={(updated) => setOffers(updated)}
          />
        </div>

      {/* --- END VISUAL DASHBOARD --- */}


      {/* --- PRINT ONLY REPORT --- */}
      <div className="hidden print:block">
        <ExcelStyleReport 
          title={session?.user?.clientName ?? 'Overview'}
          dateRange={is2025 ? '2025 Data Sandbox' : filter.from ? `${filter.from} to ${filter.to || 'Present'}` : 'Year-to-Date 2026'}
          totals={{
            orders,
            grossSales: totalSales,
            netSales: r?.sales?.totalNetPaid ?? 0,
            totalExpenses: totalExpenses + totalSuppliers,
            netProfit
          }}
          platformData={platformData}
          supplierData={supplierData}
          profitSummary={{
            totalCommission,
            adSpends,
            franchiseFees,
            marketing,
            utilities,
            staffWages,
            totalSuppliers,
            otherExpenses
          }}
        />
      </div>
    </div>
    </div>
  )
}
















