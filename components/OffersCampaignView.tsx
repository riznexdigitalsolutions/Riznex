'use client'

import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList
} from 'recharts'
import { gbp } from '@/lib/utils'

export interface OfferRecord {
  id: string
  clientId: string
  platform: string
  store?: string
  type?: string
  startDate: string | Date
  endDate?: string | Date | null
  status?: string // 'current' | 'previous'
  amount?: number
  topRank?: string | null
  discountPercent?: string | null
  offerItems?: string | null
  notes?: string | null
  is2025?: boolean
}

export interface WeeklyStatItem {
  dateStr?: string
  name: string
  dateRange?: string
  sales: number
  orders: number
  aov?: number
  profit?: number
  suppliers?: number
}

export interface PlatformStatItem {
  name: string
  sales: number
  orders: number
  deductions: number
  net: number
}

interface OffersCampaignViewProps {
  offers: OfferRecord[]
  currWeeklyData: WeeklyStatItem[]
  prevWeeklyData: WeeklyStatItem[]
  rawSales?: any[]
  platformData?: PlatformStatItem[]
  isAdmin: boolean
  clientId?: string | null
  currentStore?: string // e.g. 'Combined', 'Herbies Pizza', 'Tasty Bun'
  onStoreChange?: (store: string) => void
  availableStores?: string[] // e.g. ['Combined', 'Herbies Pizza', 'Tasty Bun']
  is2025?: boolean
  onOffersChange?: (updatedOffers: OfferRecord[]) => void
}

const PLATFORMS_CONFIG = [
  {
    id: 'deliveroo',
    name: 'Deliveroo',
    aliases: ['deliveroo'],
    icon: '🛵',
    color: '#00cdbc',
    badgeClass: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30',
    borderClass: 'border-teal-500/30'
  },
  {
    id: 'uber_eats',
    name: 'Uber Eats',
    aliases: ['uber_eats', 'uber eats', 'uber'],
    icon: '🍔',
    color: '#06c167',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    borderClass: 'border-emerald-500/30'
  },
  {
    id: 'just_eat',
    name: 'Just Eat',
    aliases: ['just_eat', 'just eat', 'justeat'],
    icon: '🍕',
    color: '#f97316',
    badgeClass: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30',
    borderClass: 'border-orange-500/30'
  },
  {
    id: 'website',
    name: 'Website',
    aliases: ['website', 'online_web', 'online web', 'web & app', 'web'],
    icon: '🌐',
    color: '#3b82f6',
    badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30',
    borderClass: 'border-blue-500/30'
  }
]

export default function OffersCampaignView({
  offers,
  currWeeklyData = [],
  prevWeeklyData = [],
  rawSales = [],
  platformData = [],
  isAdmin,
  clientId,
  currentStore = 'Combined',
  onStoreChange,
  availableStores = ['Combined'],
  is2025 = false,
  onOffersChange
}: OffersCampaignViewProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('deliveroo')
  const [showModal, setShowModal] = useState(false)
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [form, setForm] = useState({
    status: 'current',
    platform: 'deliveroo',
    store: currentStore || 'Combined',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    topRank: '',
    discountPercent: '',
    offerItems: '',
    amount: '',
    notes: ''
  })

  // Format date helper
  const formatDate = (val?: string | Date | null) => {
    if (!val) return ''
    try {
      const d = new Date(val)
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return String(val)
    }
  }

  // Filter offers by store
  const filteredOffers = useMemo(() => {
    return offers.filter(o => {
      if (!currentStore || currentStore === 'Combined') return true
      return o.store === currentStore || o.store === 'Combined'
    })
  }, [offers, currentStore])

  // Split into Current vs Previous offers
  const currentOffersList = useMemo(() => {
    return filteredOffers.filter(o => o.status === 'current' || !o.status)
  }, [filteredOffers])

  const previousOffersList = useMemo(() => {
    return filteredOffers.filter(o => o.status === 'previous')
  }, [filteredOffers])

  // Compute "Set on Date" for Current Offers
  const currentSetOnDate = useMemo(() => {
    if (currentOffersList.length === 0) return 'Active'
    const dates = currentOffersList
      .map(o => (o.startDate ? new Date(o.startDate).getTime() : 0))
      .filter(d => d > 0)
    if (dates.length === 0) return 'Active'
    const minDate = new Date(Math.min(...dates))
    return formatDate(minDate)
  }, [currentOffersList])

  // Compute "Set on Date from to" for Previous Offers
  const previousDateRange = useMemo(() => {
    if (previousOffersList.length === 0) return 'Historical Campaigns'
    const startDates = previousOffersList
      .map(o => (o.startDate ? new Date(o.startDate).getTime() : 0))
      .filter(d => d > 0)
    const endDates = previousOffersList
      .map(o => (o.endDate ? new Date(o.endDate).getTime() : 0))
      .filter(d => d > 0)
    
    const startStr = startDates.length > 0 ? formatDate(new Date(Math.min(...startDates))) : ''
    const endStr = endDates.length > 0 ? formatDate(new Date(Math.max(...endDates))) : 'Previous'
    return startStr ? `${startStr} — ${endStr}` : 'Previous Campaign Period'
  }, [previousOffersList])

  // Helper to extract platform sales, orders, deductions & net bank payout
  const getPlatformStats = (platformConfig: typeof PLATFORMS_CONFIG[0]) => {
    if (!platformData || platformData.length === 0) return null
    const matched = platformData.filter(p => {
      const pName = (p.name || '').toLowerCase()
      if (currentStore && currentStore !== 'Combined') {
        const storeLower = currentStore.toLowerCase()
        if (pName.includes('herbies') && !storeLower.includes('herbies')) return false
        if (pName.includes('tasty') && !storeLower.includes('tasty')) return false
      }
      return platformConfig.aliases.some(a => pName.includes(a))
    })

    if (matched.length === 0) return null
    const sales = matched.reduce((sum, m) => sum + (m.sales || 0), 0)
    const orders = matched.reduce((sum, m) => sum + (m.orders || 0), 0)
    const deductions = matched.reduce((sum, m) => sum + (m.deductions || 0), 0)
    const net = matched.reduce((sum, m) => sum + (m.net || 0), 0)
    const aov = orders > 0 ? sales / orders : 0
    const takeHomePct = sales > 0 ? Math.round((net / sales) * 100) : 0

    return { sales, orders, deductions, net, aov, takeHomePct }
  }


  // Helpers to match raw sales by platform and store
  const isPlatformMatch = (sPlatformRaw: string, platformId: string) => {
    if (!sPlatformRaw) return false
    const sPlatform = sPlatformRaw.toLowerCase().replace(/[\s-]/g, '_')
    const config = PLATFORMS_CONFIG.find(p => p.id === platformId)
    if (!config) return false
    return config.aliases.some(a => {
      const aNorm = a.toLowerCase().replace(/[\s-]/g, '_')
      return sPlatform.includes(aNorm) || aNorm.includes(sPlatform)
    })
  }

  const isStoreMatch = (sStoreRaw?: string) => {
    if (!currentStore || currentStore === 'Combined') return true
    if (!sStoreRaw) return true
    const s = sStoreRaw.toLowerCase()
    const c = currentStore.toLowerCase()
    if (c.includes('herbies') && s.includes('herbies')) return true
    if (c.includes('tasty') && s.includes('tasty')) return true
    return s === c
  }

  // Filter week-wise sales specifically for the selected platform (or all platforms combined)
  const filteredCurrWeeklyData = useMemo(() => {
    if (selectedPlatform === 'all' || !rawSales || rawSales.length === 0) return currWeeklyData
    return currWeeklyData.map(w => {
      const wDate = w.dateStr ? String(w.dateStr).split('T')[0] : ''
      const matching = rawSales.filter((s: any) => {
        const sDate = s.weekStart ? String(s.weekStart).split('T')[0] : ''
        return sDate === wDate && isPlatformMatch(s.platform, selectedPlatform) && isStoreMatch(s.store)
      })
      const sales = matching.reduce((sum: number, s: any) => sum + (Number(s.grossSales) || 0), 0)
      const orders = matching.reduce((sum: number, s: any) => sum + (Number(s.totalOrders) || 0), 0)
      return {
        ...w,
        sales,
        orders,
        aov: orders > 0 ? sales / orders : 0
      }
    })
  }, [currWeeklyData, rawSales, selectedPlatform, currentStore])

  const filteredPrevWeeklyData = useMemo(() => {
    if (selectedPlatform === 'all' || !rawSales || rawSales.length === 0) return prevWeeklyData
    return prevWeeklyData.map(w => {
      const wDate = w.dateStr ? String(w.dateStr).split('T')[0] : ''
      const matching = rawSales.filter((s: any) => {
        const sDate = s.weekStart ? String(s.weekStart).split('T')[0] : ''
        return sDate === wDate && isPlatformMatch(s.platform, selectedPlatform) && isStoreMatch(s.store)
      })
      const sales = matching.reduce((sum: number, s: any) => sum + (Number(s.grossSales) || 0), 0)
      const orders = matching.reduce((sum: number, s: any) => sum + (Number(s.totalOrders) || 0), 0)
      return {
        ...w,
        sales,
        orders,
        aov: orders > 0 ? sales / orders : 0
      }
    })
  }, [prevWeeklyData, rawSales, selectedPlatform, currentStore])

  const activePlatformConfig = PLATFORMS_CONFIG.find(p => p.id === selectedPlatform)
  const platformDisplayName = activePlatformConfig ? activePlatformConfig.name : 'All Platforms'

  const currentChartTitle = selectedPlatform === 'all'
    ? 'Sales and Orders Generated by Offers (Week-Wise)'
    : `${platformDisplayName} Sales and Orders Generated by Offers (Week-Wise)`

  const currentChartSubtitle = selectedPlatform === 'all'
    ? 'Performance during active current offer weeks across delivery platforms (Most recent 6 weeks)'
    : `Performance during active current offer weeks specifically for ${platformDisplayName} (Most recent 6 weeks)`

  const previousChartTitle = selectedPlatform === 'all'
    ? 'Sales and Orders Generated by Previous Offers (Week-Wise)'
    : `${platformDisplayName} Sales and Orders Generated by Previous Offers (Week-Wise)`

  const previousChartSubtitle = selectedPlatform === 'all'
    ? 'Historical performance generated during preceding campaign period across delivery platforms'
    : `Historical performance generated during preceding campaign period specifically for ${platformDisplayName}`

  // Parse structured card details for each platform
  const getPlatformDetails = (platformConfig: typeof PLATFORMS_CONFIG[0], offersGroup: OfferRecord[]) => {
    const matching = offersGroup.filter(o => {
      const p = (o.platform || '').toLowerCase().replace(/[\s-]/g, '_')
      return platformConfig.aliases.some(a => p.includes(a) || a.includes(p))
    })

    const topRankItems: string[] = []
    const discountItems: string[] = []
    const otherOffers: string[] = []

    matching.forEach(o => {
      if (o.topRank) topRankItems.push(o.topRank)
      if (o.discountPercent) discountItems.push(o.discountPercent)
      if (o.offerItems) {
        o.offerItems.split('\n').map(s => s.trim()).filter(Boolean).forEach(item => otherOffers.push(item))
      }

      // Legacy fallback parsing from notes if specific fields are empty
      if (o.notes) {
        const text = o.notes.trim()
        if (!o.topRank && /top rank/i.test(text)) {
          topRankItems.push(text)
        } else if (!o.discountPercent && /% off|% of/i.test(text)) {
          discountItems.push(text)
        } else if (!o.offerItems) {
          otherOffers.push(text)
        }
      }
    })

    // If website has no entries yet, supply informative defaults
    if (matching.length === 0 && platformConfig.id === 'website') {
      return {
        matching,
        topRankList: ['Direct Storefront'],
        discountList: ['Direct Loyalty / App Deals'],
        allOffers: ['0% Commission Direct Orders', 'Exclusive Web & Mobile Offers'],
        topRank: 'Direct Storefront',
        discount: 'Direct Loyalty / App Deals'
      }
    }

    const uniqueDiscounts = Array.from(new Set(discountItems.map(d => d.trim()).filter(Boolean)))
    const uniqueTopRanks = Array.from(new Set(topRankItems.map(t => t.trim()).filter(Boolean)))
    const uniqueOtherOffers = Array.from(new Set(otherOffers.map(o => o.trim()).filter(Boolean)))

    return {
      matching,
      topRankList: uniqueTopRanks,
      discountList: uniqueDiscounts,
      allOffers: uniqueOtherOffers,
      topRank: uniqueTopRanks.length > 0 ? uniqueTopRanks.join(' • ') : '',
      discount: uniqueDiscounts.length > 0 ? uniqueDiscounts.join(' • ') : ''
    }
  }

  const currentEarliestDate = useMemo(() => {
    if (selectedPlatform === 'all') return null
    const pConfig = PLATFORMS_CONFIG.find(p => p.id === selectedPlatform)
    if (!pConfig) return null
    const details = getPlatformDetails(pConfig, currentOffersList)
    const startDates = details.matching
      .map(o => (o.startDate ? new Date(o.startDate).getTime() : 0))
      .filter(d => d > 0)
    return startDates.length > 0 ? new Date(Math.min(...startDates)) : null
  }, [selectedPlatform, currentOffersList])

  const previousEarliestDate = useMemo(() => {
    if (selectedPlatform === 'all') return null
    const pConfig = PLATFORMS_CONFIG.find(p => p.id === selectedPlatform)
    if (!pConfig) return null
    const details = getPlatformDetails(pConfig, previousOffersList)
    const startDates = details.matching
      .map(o => (o.startDate ? new Date(o.startDate).getTime() : 0))
      .filter(d => d > 0)
    return startDates.length > 0 ? new Date(Math.min(...startDates)) : null
  }, [selectedPlatform, previousOffersList])

  // Handle open modal for Create or Edit
  const handleOpenAdd = (status: 'current' | 'previous') => {
    setEditingOfferId(null)
    setForm({
      status,
      platform: selectedPlatform !== 'all' ? selectedPlatform : 'deliveroo',
      store: currentStore && currentStore !== 'Combined' ? currentStore : availableStores[0] || 'Combined',
      startDate: new Date().toISOString().split('T')[0],
      endDate: status === 'previous' ? new Date().toISOString().split('T')[0] : '',
      topRank: '',
      discountPercent: '',
      offerItems: '',
      amount: '',
      notes: ''
    })
    setShowModal(true)
  }

  const handleOpenEdit = (offer: OfferRecord) => {
    setEditingOfferId(offer.id)
    setForm({
      status: offer.status || 'current',
      platform: offer.platform || 'deliveroo',
      store: offer.store || 'Combined',
      startDate: offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : '',
      endDate: offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : '',
      topRank: offer.topRank || '',
      discountPercent: offer.discountPercent || '',
      offerItems: offer.offerItems || '',
      amount: offer.amount !== undefined ? String(offer.amount) : '',
      notes: offer.notes || ''
    })
    setShowModal(true)
  }

  // Handle Save
  const handleSave = async () => {
    if (!form.startDate || !form.platform) return
    setSaving(true)

    const payload = {
      id: editingOfferId || undefined,
      clientId,
      is2025,
      status: form.status,
      platform: form.platform,
      store: form.store,
      startDate: form.startDate,
      endDate: form.endDate || null,
      topRank: form.topRank || null,
      discountPercent: form.discountPercent || null,
      offerItems: form.offerItems || null,
      amount: form.amount ? parseFloat(form.amount) : 0,
      notes: form.notes || null
    }

    try {
      const res = await fetch('/api/offers', {
        method: editingOfferId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const saved = await res.json()
      if (!saved.error) {
        let updated: OfferRecord[]
        if (editingOfferId) {
          updated = offers.map(o => (o.id === saved.id ? saved : o))
        } else {
          updated = [saved, ...offers]
        }
        if (onOffersChange) onOffersChange(updated)
        setShowModal(false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer record?')) return
    try {
      await fetch('/api/offers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const updated = offers.filter(o => o.id !== id)
      if (onOffersChange) onOffersChange(updated)
    } catch (e) {
      console.error(e)
    }
  }

  // Render Platform Grid (Single focused card or 4-card grid)
  const renderPlatformGrid = (offersGroup: OfferRecord[], isCurrent: boolean) => {
    const platformsToRender = selectedPlatform === 'all'
      ? PLATFORMS_CONFIG
      : PLATFORMS_CONFIG.filter(p => p.id === selectedPlatform)

    const isSingle = platformsToRender.length === 1

    if (isSingle) {
      const p = platformsToRender[0]
      const details = getPlatformDetails(p, offersGroup)

      // Active date for this platform's offers
      const startDates = details.matching
        .map(o => (o.startDate ? new Date(o.startDate).getTime() : 0))
        .filter(d => d > 0)
      const earliestStartDate = startDates.length > 0 ? new Date(Math.min(...startDates)) : null
      const activeDateStr = earliestStartDate ? formatDate(earliestStartDate) : (isCurrent ? currentSetOnDate : previousDateRange)

      // Sales generated from active date to present
      const salesSinceActiveDate = (rawSales || []).filter((s: any) => {
        if (!isPlatformMatch(s.platform, p.id)) return false
        if (!isStoreMatch(s.store)) return false
        if (earliestStartDate) {
          const saleTime = new Date(s.weekEnd || s.weekStart).getTime()
          const offerTime = earliestStartDate.getTime() - (24 * 60 * 60 * 1000)
          if (saleTime < offerTime) return false
        }
        return true
      })

      const rawTotalSales = salesSinceActiveDate.reduce((sum: number, s: any) => sum + (Number(s.grossSales) || 0), 0)
      const rawTotalOrders = salesSinceActiveDate.reduce((sum: number, s: any) => sum + (Number(s.totalOrders) || 0), 0)

      let totalSalesGenerated = rawTotalSales
      let totalOrdersGenerated = rawTotalOrders
      if (totalSalesGenerated === 0 && filteredCurrWeeklyData.length > 0) {
        totalSalesGenerated = filteredCurrWeeklyData.reduce((sum, w) => sum + (w.sales || 0), 0)
        totalOrdersGenerated = filteredCurrWeeklyData.reduce((sum, w) => sum + (w.orders || 0), 0)
      }

      // Collect all active bullet items (no separate 3 columns)
      const combinedOffersList: string[] = []
      details.discountList.forEach(d => {
        if (d && !d.toLowerCase().includes('standard menu') && !combinedOffersList.includes(d)) {
          combinedOffersList.push(d)
        }
      })
      details.allOffers.forEach(o => {
        if (o && !o.toLowerCase().includes('standard menu') && !combinedOffersList.includes(o)) {
          combinedOffersList.push(o)
        }
      })
      details.topRankList.forEach(t => {
        if (t && !t.toLowerCase().includes('standard menu') && !combinedOffersList.includes(t)) {
          combinedOffersList.push(t)
        }
      })

      if (combinedOffersList.length === 0) {
        combinedOffersList.push('No active offers')
      }

      return (
        <div className="w-full">
          <div className={`bg-white dark:bg-[#0c101d] border ${p.borderClass} rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden`}>
            {/* Ambient Glow */}
            <div 
              className="absolute top-0 right-0 w-48 h-48 opacity-15 rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: p.color }}
            />

            {/* Header: Platform title & Active Deals count */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-[#1f2947] mb-5">
              <div className="flex items-center gap-3.5">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 border"
                  style={{ backgroundColor: `${p.color}15`, borderColor: `${p.color}40` }}
                >
                  {p.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {isCurrent ? 'Current Active Campaign' : 'Historical Campaign'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${p.badgeClass} shadow-sm flex items-center gap-1.5`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {details.matching.length > 0 ? `${details.matching.length} Active Deals` : 'Standard Visibility'}
                </span>
                {isAdmin && details.matching.length > 0 && (
                  <button
                    onClick={() => handleOpenEdit(details.matching[0])}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-black text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 bg-blue-500/10 border border-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>✎</span>
                    <span>Edit Offer</span>
                  </button>
                )}
              </div>
            </div>

            {/* Clean 2-Side Layout: Left Side Active Offers with Bullets | Right Side Active Date & Total Sales Generated */}
            <div className="py-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Side: Active Offers with Bullets */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                    Active Offers
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    {combinedOffersList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-[#E5B869] font-black text-sm shrink-0 leading-tight">•</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Side: Offer Active Date & Total Sales Generated */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-4 bg-slate-50/80 dark:bg-[#101524] border border-slate-200 dark:border-[#1f2947] rounded-xl p-4 sm:p-5">
                  {/* Offer Active Date */}
                  <div className="pb-3 border-b border-slate-200 dark:border-[#1f2947]">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Offer Active Date
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">📅</span>
                      <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {activeDateStr}
                      </span>
                    </div>
                  </div>

                  {/* Total Sales Generated by Offer */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Total Sales Generated by Offer
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                      {gbp(totalSalesGenerated)}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span>{totalOrdersGenerated} Orders Generated</span>
                      <span>•</span>
                      <span>From active date to present</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {platformsToRender.map(p => {
          const details = getPlatformDetails(p, offersGroup)
          return (
            <div
              key={p.id}
              className={`bg-white dark:bg-[#0c101d] border ${p.borderClass} rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-200 hover:shadow-xl relative overflow-hidden`}
            >
              {/* Top ambient glow */}
              <div 
                className="absolute top-0 right-0 w-28 h-28 opacity-10 rounded-full blur-2xl pointer-events-none"
                style={{ backgroundColor: p.color }}
              />

              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1f2947] mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{p.name}</h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{isCurrent ? 'Current Live' : 'Previous'}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${p.badgeClass}`}>
                  {details.matching.length > 0 ? `${details.matching.length} Active` : 'Standard'}
                </span>
              </div>

              {/* Card Body: Simple Clean Bulleted List */}
              <div className="py-2.5 flex-1">
                {(() => {
                  const cardOffers: string[] = []
                  details.discountList.forEach(d => {
                    if (d && !d.toLowerCase().includes('standard menu') && !cardOffers.includes(d)) {
                      cardOffers.push(d)
                    }
                  })
                  details.allOffers.forEach(o => {
                    if (o && !o.toLowerCase().includes('standard menu') && !cardOffers.includes(o)) {
                      cardOffers.push(o)
                    }
                  })
                  details.topRankList.forEach(t => {
                    if (t && !t.toLowerCase().includes('standard menu') && !cardOffers.includes(t)) {
                      cardOffers.push(t)
                    }
                  })

                  if (cardOffers.length === 0) {
                    return (
                      <div className="text-xs text-slate-400 dark:text-slate-500 font-medium italic py-1">
                        No active offers
                      </div>
                    )
                  }

                  return (
                    <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300">
                      {cardOffers.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#E5B869] font-bold text-sm shrink-0 leading-tight">•</span>
                          <span className="text-slate-900 dark:text-white font-semibold">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )
                })()}
              </div>

            </div>
          )
        })}
      </div>
    )
  }

  // Render Week-Wise Performance Chart (Up to Most Recent 6 Weeks)
  const renderWeeklyChart = (data: WeeklyStatItem[], title: string, subtitle: string, earliestDate?: Date | null) => {
    // If earliestDate is provided and single platform selected, filter weeks on or after offer start
    let activeData = data
    if (earliestDate && selectedPlatform !== 'all') {
      const startTime = earliestDate.getTime() - (24 * 60 * 60 * 1000)
      const filtered = data.filter(w => {
        if (!w.dateStr) return true
        return new Date(w.dateStr).getTime() >= startTime
      })
      if (filtered.length > 0) {
        activeData = filtered
      }
    }

    // Show up to the most recent 6 weeks (capped to 6 weeks if active for 6 or more)
    const chartData = activeData.slice(-6)

    return (
      <div className="bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none rounded-2xl p-4 sm:p-6 flex flex-col w-full">
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div>
            <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-wide text-xs sm:text-sm flex items-center gap-2">
              <span>📊</span> {title}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{subtitle}</p>
          </div>
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

        {/* Recharts ComposedChart */}
        <div className="h-[340px] sm:h-[380px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 25, right: 10, left: -10, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} opacity={0.5} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={(props: any) => {
                    const { x, y, payload } = props
                    const item = chartData.find((d: any) => d.name === payload.value)
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text x={0} y={0} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight="bold">
                          {payload.value}
                        </text>
                        {item?.dateRange && (
                          <text x={0} y={0} dy={30} textAnchor="middle" fill="#64748b" fontSize={10}>
                            {item.dateRange}
                          </text>
                        )}
                      </g>
                    )
                  }}
                  tickMargin={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: any) => '£' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)}
                  dx={-5}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  dx={5}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  itemStyle={{ color: '#fff' }}
                  contentStyle={{
                    backgroundColor: '#0a0c14',
                    borderColor: '#1f2947',
                    borderRadius: '10px',
                    color: '#fff',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                  }}
                  formatter={(v: any, name: string) => (name === 'sales' ? gbp(v as number) : v)}
                />
                <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  <LabelList dataKey="sales" position="top" fill="#3b82f6" fontSize={11} fontWeight="bold" formatter={(v: any) => gbp(v as number)} offset={8} />
                </Bar>
                <Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  <LabelList dataKey="orders" position="top" fill="#f97316" fontSize={11} fontWeight="bold" offset={8} />
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              No sales records available for this period.
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 w-full mt-2">
      {/* ========================================================================= */}
      {/* TIER 2: OFFERS EXECUTIVE TOOLBAR (STORES + PLATFORMS - NO DATE FILTERS) */}
      {/* ========================================================================= */}
      <div className="w-full max-w-full bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 rounded-2xl p-2.5 sm:p-3 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Store Pills (if multi-store) & Direct Platform Tabs */}
          <div className="flex flex-wrap items-center gap-3 max-w-full">
            {availableStores.length > 1 && (
              <div className="flex items-center gap-1 bg-transparent border border-slate-200 dark:border-[#1f2947] p-1 rounded-xl max-w-full overflow-x-auto">
                {availableStores.map(s => {
                  const isSelected = (currentStore === s) || (!currentStore && s === 'Combined')
                  const isHerbies = s.includes('Herbies')
                  const isTasty = s.includes('Tasty')
                  let activeColor = 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md font-black'
                  if (isHerbies) activeColor = 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md font-black'
                  if (isTasty) activeColor = 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md font-black'

                  return (
                    <button
                      key={s}
                      onClick={() => onStoreChange && onStoreChange(s)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? activeColor
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            )}

            {availableStores.length > 1 && <div className="w-[1px] h-5 bg-slate-300 dark:bg-[#1f2947] hidden sm:block"></div>}

            {/* Platform Direct Tabs: all | delvireo | u | just eat | web */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0e121b] border border-slate-200 dark:border-[#1f2947] p-1 rounded-xl max-w-full overflow-x-auto">
              <button
                onClick={() => setSelectedPlatform('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedPlatform === 'all'
                    ? 'bg-gradient-to-r from-[#E5B869] to-[#C89B3C] text-slate-950 shadow-md font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>

              {PLATFORMS_CONFIG.map(p => {
                const isSelected = selectedPlatform === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlatform(p.id)}
                    style={isSelected ? { backgroundColor: p.color, color: p.id === 'deliveroo' || p.id === 'uber_eats' ? '#020617' : '#ffffff' } : {}}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'shadow-md font-black scale-105 ring-2 ring-white/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Admin Actions */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenAdd('current')}
                className="bg-gradient-to-r from-[#E5B869] to-[#C89B3C] hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition shadow-md flex items-center gap-1 cursor-pointer"
              >
                <span>+</span> Add Current Offer
              </button>
              <button
                onClick={() => handleOpenAdd('previous')}
                className="bg-slate-200 dark:bg-[#1a2235] hover:bg-slate-300 dark:hover:bg-[#25324d] text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-xl transition border border-slate-300 dark:border-[#2a3454] cursor-pointer"
              >
                + Add Previous Offer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: CURRENT OFFERS */}
      {/* ========================================================================= */}
      <div className="space-y-5">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-slate-200 dark:border-[#1f2947] pb-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-wide uppercase">
              Current Offers
              {selectedPlatform !== 'all' && (
                <span className="text-xs font-bold text-slate-400 normal-case ml-2">
                  — {platformDisplayName} Only
                </span>
              )}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-3 py-1 rounded-xl w-fit">
              <span>📅 Set on Date:</span>
              <span className="font-black text-slate-900 dark:text-white">{currentSetOnDate}</span>
            </div>
          </div>
        </div>

        {/* Selected Platform Card or 4 Cards Grid */}
        {renderPlatformGrid(currentOffersList, true)}

        {/* Performance Chart under Current Offers */}
        {renderWeeklyChart(
          filteredCurrWeeklyData,
          currentChartTitle,
          currentChartSubtitle,
          currentEarliestDate
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: PREVIOUS OFFERS */}
      {/* ========================================================================= */}
      <div className="space-y-5 pt-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-slate-200 dark:border-[#1f2947] pb-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-wide uppercase">
              Previous Offers
              {selectedPlatform !== 'all' && (
                <span className="text-xs font-bold text-slate-400 normal-case ml-2">
                  — {platformDisplayName} Only
                </span>
              )}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold bg-slate-100 dark:bg-[#1a2235] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2a3454] px-3 py-1 rounded-xl w-fit">
            <span>📅 Set on Date:</span>
            <span className="font-black text-slate-900 dark:text-white">{previousDateRange}</span>
          </div>
        </div>

        {/* Selected Platform Card or 4 Cards Grid */}
        {renderPlatformGrid(previousOffersList, false)}

        {/* Performance Chart under Previous Offers */}
        {renderWeeklyChart(
          filteredPrevWeeklyData,
          previousChartTitle,
          previousChartSubtitle,
          previousEarliestDate
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT OFFER MODAL */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-[#E5B869]/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg p-1"
            >
              ✕
            </button>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <span>{editingOfferId ? '✎' : '+'}</span>
              <span>{editingOfferId ? 'Edit Marketing Offer' : 'Add Campaign Offer'}</span>
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              {/* Campaign Category (Current vs Previous) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Campaign Section
                  </label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#13192b] border border-slate-200 dark:border-[#1f2947] rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="current">Current Offers (Active)</option>
                    <option value="previous">Previous Offers (Past)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Platform
                  </label>
                  <select
                    value={form.platform}
                    onChange={e => setForm({ ...form, platform: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#13192b] border border-slate-200 dark:border-[#1f2947] rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="deliveroo">Deliveroo</option>
                    <option value="uber_eats">Uber Eats</option>
                    <option value="just_eat">Just Eat</option>
                    <option value="website">Website / Direct</option>
                  </select>
                </div>
              </div>

              {/* Store (if multiple) */}
              {availableStores.length > 1 && (
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Store / Brand
                  </label>
                  <select
                    value={form.store}
                    onChange={e => setForm({ ...form, store: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#13192b] border border-slate-200 dark:border-[#1f2947] rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:border-amber-500 font-bold"
                  >
                    {availableStores.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    {form.status === 'previous' ? 'From Date' : 'Set on Date (Start)'}
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#13192b] border border-slate-200 dark:border-[#1f2947] rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:border-amber-500 [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    {form.status === 'previous' ? 'To Date' : 'End Date (Optional)'}
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#13192b] border border-slate-200 dark:border-[#1f2947] rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:border-amber-500 [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* % Off */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  % Off / Discount Rate
                </label>
                <input
                  type="text"
                  placeholder="e.g. 30% off on burgers or 25% off over £20"
                  value={form.discountPercent}
                  onChange={e => setForm({ ...form, discountPercent: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#13192b] border border-slate-200 dark:border-[#1f2947] rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:border-amber-500 font-bold"
                />
              </div>

              {/* Top Rank */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Top Rank / Promoted Position
                </label>
                <input
                  type="text"
                  placeholder="e.g. £30 per day or Top Rank £100/week"
                  value={form.topRank}
                  onChange={e => setForm({ ...form, topRank: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#13192b] border border-slate-200 dark:border-[#1f2947] rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:border-amber-500 font-bold"
                />
              </div>

              {/* All Offers Under */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  All Offers Under (1 per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g.&#10;Free Item (Drink) on £30 Spent&#10;Buy 1 Get 1 Burger half Price"
                  value={form.offerItems}
                  onChange={e => setForm({ ...form, offerItems: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#13192b] border border-slate-200 dark:border-[#1f2947] rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* Ad Spend & Notes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Ad Spend (£) <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 150.00"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#13192b] border border-slate-200 dark:border-[#1f2947] rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Notes <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Internal reference"
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#13192b] border border-slate-200 dark:border-[#1f2947] rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#1f2947]">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1f2947] text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || !form.startDate}
                onClick={handleSave}
                className="bg-gradient-to-r from-[#E5B869] to-[#C89B3C] hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition shadow-md disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Saving...' : editingOfferId ? 'Update Offer' : 'Save Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
