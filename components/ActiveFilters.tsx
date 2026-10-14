'use client'
import React from 'react'
import { defaultDateFilter } from '@/components/DateFilter'

interface ActiveFiltersProps {
  store?: string;
  onClearStore?: () => void;
  platform?: string;
  onClearPlatform?: (platformToClear?: string) => void;
  filter?: any;
  onClearFilter?: () => void;
  onClearAll?: () => void;
  className?: string;
}

export function getPeriodLabel(filter: any): string {
  if (!filter) return ''
  if (filter.preset === 'all_time' && !filter.from && !filter.to) return ''

  if (filter.preset === 'last_4_weeks') return 'Last 4 Weeks'
  if (filter.preset === 'last_week') return 'Last Week'
  if (filter.preset === 'this_month') return 'This Month'
  if (filter.preset === 'last_month') return 'Last Month'

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  if (filter.preset === 'specific_period' && filter.year && filter.year !== 'all') {
    if (filter.month && filter.month !== 'all') {
      const mIdx = parseInt(filter.month)
      const mName = monthNames[mIdx] || filter.month
      if (filter.week && filter.week !== 'all') {
        const weekDisplay = Array.isArray(filter.week) ? filter.week.join(', ') : filter.week
        return `Week ${weekDisplay} (${mName} ${filter.year})`
      }
      return `${mName} ${filter.year}`
    }
    return `Year ${filter.year}`
  }

  if (filter.from && filter.to) {
    return `${filter.from} to ${filter.to}`
  }

  if (filter.from) return `From ${filter.from}`
  if (filter.to) return `Until ${filter.to}`

  return ''
}

export default function ActiveFilters({
  store,
  onClearStore,
  platform,
  onClearPlatform,
  filter,
  onClearFilter,
  onClearAll,
  className = ''
}: ActiveFiltersProps) {
  // Check if store is active (not empty and not 'Combined' or 'All')
  const hasStore = Boolean(store && store !== '' && store !== 'Combined' && store !== 'all')

  // Check platforms
  const platformList: string[] = platform
    ? platform
        .split(',')
        .map(p => p.trim())
        .filter(p => p && p !== 'All Platforms' && p !== 'all')
    : []
  const hasPlatform = platformList.length > 0

  // Check period
  const periodLabel = getPeriodLabel(filter)
  const hasPeriod = Boolean(periodLabel)

  // If nothing is active, return null
  if (!hasStore && !hasPlatform && !hasPeriod) {
    return null
  }

  const handleClearSinglePlatform = (p: string) => {
    if (onClearPlatform) {
      if (platformList.length <= 1) {
        onClearPlatform('')
      } else {
        const remaining = platformList.filter(item => item !== p).join(', ')
        onClearPlatform(remaining)
      }
    }
  }

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll()
    } else {
      if (onClearStore) onClearStore()
      if (onClearPlatform) onClearPlatform('')
      if (onClearFilter) onClearFilter()
    }
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 pt-2.5 pb-1 text-xs print:hidden animate-fadeIn ${className}`}>
      <span className="text-slate-500 dark:text-slate-400 font-semibold text-xs mr-0.5">
        Active Filters:
      </span>

      {/* Store Pill */}
      {hasStore && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 shadow-sm transition hover:border-blue-300">
          <span>Store: {store}</span>
          {onClearStore && (
            <button
              type="button"
              onClick={onClearStore}
              title="Remove store filter"
              className="hover:bg-blue-200/50 dark:hover:bg-blue-800/50 rounded p-0.5 text-blue-600 dark:text-blue-400 transition cursor-pointer"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </span>
      )}

      {/* Platform Pills */}
      {platformList.map((plat) => (
        <span
          key={plat}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 shadow-sm transition hover:border-amber-300"
        >
          <span>Platform: {plat}</span>
          {onClearPlatform && (
            <button
              type="button"
              onClick={() => handleClearSinglePlatform(plat)}
              title={`Remove ${plat} filter`}
              className="hover:bg-amber-200/50 dark:hover:bg-amber-800/50 rounded p-0.5 text-amber-700 dark:text-amber-400 transition cursor-pointer"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </span>
      ))}

      {/* Period Pill */}
      {hasPeriod && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-sm transition hover:border-emerald-300">
          <span>Period: {periodLabel}</span>
          {onClearFilter && (
            <button
              type="button"
              onClick={onClearFilter}
              title="Reset period filter"
              className="hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50 rounded p-0.5 text-emerald-700 dark:text-emerald-400 transition cursor-pointer"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </span>
      )}

      {/* Clear all link */}
      <button
        type="button"
        onClick={handleClearAll}
        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium underline cursor-pointer ml-1.5 transition"
      >
        Clear all
      </button>
    </div>
  )
}
