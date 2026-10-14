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

interface OffersCampaignViewProps {
  offers: OfferRecord[]
  currWeeklyData: WeeklyStatItem[]
  prevWeeklyData: WeeklyStatItem[]
  isAdmin: boolean
  clientId?: string | null
  currentStore?: string // e.g. 'Combined', 'Herbies Pizza', 'Tasty Bun'
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
  isAdmin,
  clientId,
  currentStore = 'Combined',
  availableStores = ['Combined'],
  is2025 = false,
  onOffersChange
}: OffersCampaignViewProps) {
  const [showModal, setShowModal] = useState(false)
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [showRoiTable, setShowRoiTable] = useState(false)

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
        topRank: 'Direct Storefront',
        discount: 'Direct Loyalty / App Deals',
        allOffers: ['0% Commission Direct Orders', 'Exclusive Web & Mobile Offers']
      }
    }

    return {
      matching,
      topRank: topRankItems.length > 0 ? topRankItems.join(' • ') : 'Standard Visibility',
      discount: discountItems.length > 0 ? discountItems.join(' • ') : 'No active discount',
      allOffers: otherOffers.length > 0 ? otherOffers : ['Standard Menu Pricing']
    }
  }

  // Handle open modal for Create or Edit
  const handleOpenAdd = (status: 'current' | 'previous') => {
    setEditingOfferId(null)
    setForm({
      status,
      platform: 'deliveroo',
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

  // Render a 4-Card Platform Grid
  const renderPlatformGrid = (offersGroup: OfferRecord[], isCurrent: boolean) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {PLATFORMS_CONFIG.map(p => {
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

              {/* Card Body - 3 Core Fields matching Excel */}
              <div className="space-y-3.5 flex-1">
                {/* 1. All offers under */}
                <div className="bg-slate-50 dark:bg-[#13192b]/70 border border-slate-200/70 dark:border-[#1f2947] rounded-xl p-3">
                  <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <span>🏷️</span> All Offers Under
                  </div>
                  <div className="space-y-1">
                    {details.allOffers.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <span className="text-[#E5B869] text-xs leading-none">•</span>
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Top rank */}
                <div className="bg-slate-50 dark:bg-[#13192b]/70 border border-slate-200/70 dark:border-[#1f2947] rounded-xl p-3">
                  <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <span>⭐</span> Top Rank
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                    <span>{details.topRank}</span>
                  </div>
                </div>

                {/* 3. % off */}
                <div className="bg-slate-50 dark:bg-[#13192b]/70 border border-slate-200/70 dark:border-[#1f2947] rounded-xl p-3">
                  <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <span>🔥</span> % Off
                  </div>
                  <div className="text-xs font-black text-rose-600 dark:text-rose-400 tracking-tight">
                    {details.discount}
                  </div>
                </div>
              </div>

              {/* Card Footer / Edit Actions for Admin */}
              {isAdmin && details.matching.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1f2947] flex justify-end gap-2">
                  {details.matching.map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleOpenEdit(m)}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline px-1.5 py-0.5 rounded transition"
                      title="Edit offer details"
                    >
                      ✎ Edit ({m.store || 'Store'})
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Render Week-Wise Performance Chart
  const renderWeeklyChart = (data: WeeklyStatItem[], title: string, subtitle: string) => {
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
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} opacity={0.5} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={(props: any) => {
                    const { x, y, payload } = props
                    const item = data.find((d: any) => d.name === payload.value)
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
                <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={55} />
                <Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={55} />
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
    <div className="space-y-10 w-full mt-2">
      {/* Top Controls / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span>🎯</span> Marketing & Promotional Offers
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Live and historical promotional campaigns across Deliveroo, Uber Eats, Just Eat, and Direct Web.
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenAdd('current')}
              className="bg-gradient-to-r from-[#E5B869] to-[#C89B3C] hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>+</span> Add Current Offer
            </button>
            <button
              onClick={() => handleOpenAdd('previous')}
              className="bg-slate-200 dark:bg-[#1a2235] hover:bg-slate-300 dark:hover:bg-[#25324d] text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition border border-slate-300 dark:border-[#2a3454] cursor-pointer"
            >
              + Add Previous Offer
            </button>
          </div>
        )}
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
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-3 py-1 rounded-xl w-fit">
            <span>📅 Set on Date:</span>
            <span className="font-black text-slate-900 dark:text-white">{currentSetOnDate}</span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        {renderPlatformGrid(currentOffersList, true)}

        {/* Performance Chart under Current Offers */}
        {renderWeeklyChart(
          currWeeklyData,
          'Sales and Orders Generated by Offers (Week-Wise)',
          'Performance during active current offer weeks across delivery platforms'
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
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold bg-slate-100 dark:bg-[#1a2235] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2a3454] px-3 py-1 rounded-xl w-fit">
            <span>📅 Set on Date:</span>
            <span className="font-black text-slate-900 dark:text-white">{previousDateRange}</span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        {renderPlatformGrid(previousOffersList, false)}

        {/* Performance Chart under Previous Offers */}
        {renderWeeklyChart(
          prevWeeklyData,
          'Sales and Orders Generated by Previous Offers (Week-Wise)',
          'Historical performance generated during preceding campaign period'
        )}
      </div>

      {/* ========================================================================= */}
      {/* EXPANDABLE DETAIL TABLE (LEGACY TABLE VIEW) */}
      {/* ========================================================================= */}
      <div className="pt-2">
        <button
          onClick={() => setShowRoiTable(!showRoiTable)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-2 cursor-pointer transition py-2"
        >
          <span>{showRoiTable ? '▼' : '▶'}</span>
          <span>View All Registered Campaign Records & Individual Platform Spends ({offers.length} records)</span>
        </button>

        {showRoiTable && (
          <div className="mt-4 bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-[#1f2947] rounded-2xl p-5 shadow-lg overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-slate-400 border-b border-slate-200 dark:border-[#1f2947] uppercase font-bold tracking-wider">
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Start Date</th>
                  <th className="pb-3">End Date</th>
                  <th className="pb-3">Platform</th>
                  <th className="pb-3">Store</th>
                  <th className="pb-3">Top Rank</th>
                  <th className="pb-3">% Off</th>
                  <th className="pb-3">All Offers Under</th>
                  <th className="pb-3 text-right">Spend (£)</th>
                  {isAdmin && <th className="pb-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2947]/60">
                {offers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-6 text-center text-slate-400">
                      No marketing offer records found.
                    </td>
                  </tr>
                ) : (
                  offers.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                      <td className="py-3 font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${
                            o.status === 'previous'
                              ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {o.status || 'current'}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{formatDate(o.startDate)}</td>
                      <td className="py-3 text-slate-400">{formatDate(o.endDate) || '-'}</td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white capitalize">{o.platform.replace(/_/g, ' ')}</td>
                      <td className="py-3 text-slate-500">{o.store || 'Combined'}</td>
                      <td className="py-3 text-slate-700 dark:text-slate-300 font-semibold">{o.topRank || '-'}</td>
                      <td className="py-3 text-rose-600 dark:text-rose-400 font-bold">{o.discountPercent || '-'}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{o.offerItems || o.notes || '-'}</td>
                      <td className="py-3 text-right font-black text-slate-900 dark:text-white">
                        {o.amount && o.amount > 0 ? gbp(o.amount) : '£0.00'}
                      </td>
                      {isAdmin && (
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleOpenEdit(o)}
                            className="text-blue-500 hover:text-blue-400 font-bold mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(o.id)}
                            className="text-red-500 hover:text-red-400 font-bold"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
