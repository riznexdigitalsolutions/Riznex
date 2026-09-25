
'use client'
import { useState, useRef, useEffect } from 'react'
import { fmtDateInput, getWeekStart, getWeekEnd, getMonthStart, getMonthEnd } from '@/lib/utils'

export const defaultDateFilter = () => {
  return {
    preset: 'all_time',
    from: '',
    to: '',
    year: 'all',
    month: 'all',
    week: 'all',
    weekRanges: undefined
  }
}

export default function DateFilter({ filter, setFilter }: { filter: any, setFilter: any }) {
  const [showWeekDropdown, setShowWeekDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWeekDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleMultiWeekChange(selectedWeeks: string[]) {
    const yStr = (filter.year && filter.year !== 'all') ? filter.year : new Date().getFullYear().toString()
    const yearNum = parseInt(yStr)
    const monthNum = parseInt(filter.month || '0')
    const allWeeks = getSundaysInMonth(yearNum, monthNum)
    
    const activeWeeks = allWeeks.filter(w => selectedWeeks.includes(w.value))
    if (activeWeeks.length === 0) {
      handleMonthChange(filter.month || 'all')
      return
    }

    const from = activeWeeks[0].start
    const to = activeWeeks[activeWeeks.length - 1].end
    const weekRanges = activeWeeks.map(w => `${w.start}_${w.end}`).join('|')

    setFilter((f: any) => ({ ...f, year: yStr, month: filter.month, week: selectedWeeks, preset: 'specific_period', from, to, weekRanges }))
  }

  function handlePresetChange(preset: string) {
    if (preset === 'all_time') {
      setFilter((f: any) => ({ ...f, preset, from: '', to: '', year: 'all', month: 'all', week: 'all', weekRanges: undefined }))
      return
    }
    
    const now = new Date()
    let from = ''
    let to = ''

    if (preset === 'last_week') {
      const d = new Date()
      d.setDate(d.getDate() - 7)
      from = fmtDateInput(getWeekStart(d))
      to = fmtDateInput(getWeekEnd(d))
    } else if (preset === 'last_4_weeks') {
      const d = new Date()
      d.setDate(d.getDate() - 28)
      from = fmtDateInput(getWeekStart(d))
      to = fmtDateInput(now)
    } else if (preset === 'this_month') {
      from = fmtDateInput(getMonthStart(now))
      to = fmtDateInput(getMonthEnd(now))
    } else if (preset === 'last_month') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      from = fmtDateInput(getMonthStart(lastMonth))
      to = fmtDateInput(getMonthEnd(lastMonth))
    } else if (preset === 'custom') {
      from = filter.from
      to = filter.to
    }

    setFilter((f: any) => ({ ...f, preset, from, to, year: 'all', month: 'all', week: 'all', weekRanges: undefined }))
  }

  function handleYearChange(y: string) {
    if (y === 'all') {
      setFilter((f: any) => ({ ...f, year: 'all', month: 'all', week: 'all', preset: 'all_time', from: '', to: '', weekRanges: undefined }))
      return
    }

    const yearNum = parseInt(y)
    const mStr = filter.month || 'all'
    let newFrom = ''
    let newTo = ''

    if (mStr !== 'all') {
      const monthNum = parseInt(mStr)
      const startDate = new Date(Date.UTC(yearNum, monthNum, 1))
      newFrom = fmtDateInput(startDate)
      newTo = fmtDateInput(getMonthEnd(startDate))
    } else {
      const startDate = new Date(Date.UTC(yearNum, 0, 1))
      const endDate = new Date(Date.UTC(yearNum, 11, 31))
      newFrom = fmtDateInput(startDate)
      newTo = fmtDateInput(endDate)
    }

    setFilter((f: any) => ({ ...f, year: y, week: 'all', preset: 'specific_period', from: newFrom, to: newTo, weekRanges: undefined }))
  }

  function handleMonthChange(mStr: string) {
    if (mStr === 'all') {
      handleYearChange(filter.year || 'all')
      return
    }

    const yStr = (filter.year && filter.year !== 'all') ? filter.year : new Date().getFullYear().toString()
    const yearNum = parseInt(yStr)
    const monthNum = parseInt(mStr)
    
    const startDate = new Date(Date.UTC(yearNum, monthNum, 1))
    const newFrom = fmtDateInput(startDate)
    const newTo = fmtDateInput(getMonthEnd(startDate))

    setFilter((f: any) => ({ ...f, year: yStr, month: mStr, week: 'all', preset: 'specific_period', from: newFrom, to: newTo, weekRanges: undefined }))
  }

  function getSundaysInMonth(yearNum: number, monthNum: number) {
    const sundays = []
    const date = new Date(Date.UTC(yearNum, monthNum, 1))
    
    while (date.getUTCDay() !== 0) {
      date.setUTCDate(date.getUTCDate() + 1)
    }

    let weekNumber = 1
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    
    while (date.getUTCMonth() === monthNum) {
      const monday = new Date(date)
      monday.setUTCDate(monday.getUTCDate() - 6)
      
      sundays.push({
        value: weekNumber.toString(),
        label: `Week ${weekNumber} (ending Sun, ${date.getUTCDate()} ${monthNames[monthNum]})`,
        start: fmtDateInput(monday),
        end: fmtDateInput(date)
      })
      
      date.setUTCDate(date.getUTCDate() + 7)
      weekNumber++
    }
    return sundays
  }

  function handleWeekChange(wStr: string) {
    if (wStr === 'all') {
      handleMonthChange(filter.month || 'all')
      return
    }
    const yStr = (filter.year && filter.year !== 'all') ? filter.year : new Date().getFullYear().toString()
    const yearNum = parseInt(yStr)
    const monthNum = parseInt(filter.month || '0')
    const weeks = getSundaysInMonth(yearNum, monthNum)
    const selectedWeek = weeks.find(w => w.value === wStr)
    
    if (selectedWeek) {
      setFilter((f: any) => ({ ...f, year: yStr, month: filter.month, week: wStr, preset: 'specific_period', from: selectedWeek.start, to: selectedWeek.end, weekRanges: undefined }))
    }
  }

  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = 2026; y <= Math.max(2026, currentYear); y++) {
    years.push(y)
  }

  const months = [
    { value: '0', label: 'Jan' }, { value: '1', label: 'Feb' }, { value: '2', label: 'Mar' },
    { value: '3', label: 'Apr' }, { value: '4', label: 'May' }, { value: '5', label: 'Jun' },
    { value: '6', label: 'Jul' }, { value: '7', label: 'Aug' }, { value: '8', label: 'Sep' },
    { value: '9', label: 'Oct' }, { value: '10', label: 'Nov' }, { value: '11', label: 'Dec' },
  ]
  const displayedMonths = (filter.year === '2026' || filter.year === 'all' || !filter.year) 
    ? months.slice(3) 
    : months

  return (
    <>
      <select
        value={filter.preset}
        onChange={e => handlePresetChange(e.target.value)}
        className="bg-transparent text-white px-2 py-1 text-sm focus:outline-none"
      >
        <option value="last_week" className="bg-[#111520] text-white">Last Week</option>
        <option value="last_4_weeks" className="bg-[#111520] text-white">Last 4 Weeks</option>
        <option value="this_month" className="bg-[#111520] text-white">This Month</option>
        <option value="last_month" className="bg-[#111520] text-white">Last Month</option>
        <option value="all_time" className="bg-[#111520] text-white">All Time</option>
        <option value="custom" className="bg-[#111520] text-white">Custom Range</option>
        <option value="specific_period" className="hidden">Specific Period</option>
      </select>

      <div className="w-[1px] h-4 bg-[#1f2947] mx-1"></div>

      <select
        value={filter.year || 'all'}
        onChange={e => handleYearChange(e.target.value)}
        className="bg-transparent text-slate-300 hover:text-white px-2 py-1 text-sm focus:outline-none font-medium cursor-pointer transition-colors"
      >
        <option value="all" className="bg-[#111520] text-white">All Years</option>
        {years.map(y => (
          <option key={y} value={y} className="bg-[#111520] text-white">{y}</option>
        ))}
      </select>

      <div className="w-[1px] h-4 bg-[#1f2947] mx-1"></div>

      <select
        value={filter.month || 'all'}
        onChange={e => handleMonthChange(e.target.value)}
        className="bg-transparent text-slate-300 hover:text-white px-2 py-1 text-sm focus:outline-none font-medium cursor-pointer transition-colors"
      >
        <option value="all" className="bg-[#111520] text-white">All Months</option>
        {displayedMonths.map(m => (
          <option key={m.value} value={m.value} className="bg-[#111520] text-white">{m.label}</option>
        ))}
      </select>

      {filter.month && filter.month !== 'all' && (
        <>
          <div className="w-[1px] h-4 bg-[#1f2947] mx-1"></div>
          
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowWeekDropdown(!showWeekDropdown)}
              className="bg-transparent text-slate-300 hover:text-white px-2 py-1 text-sm focus:outline-none font-medium cursor-pointer transition-colors flex items-center gap-1"
            >
              {Array.isArray(filter.week) && filter.week.length > 0
                ? `${filter.week.length} Weeks`
                : filter.week === 'all' || !filter.week
                ? 'All Weeks'
                : `Week ${filter.week}`}
              <span className="text-[10px]">▼</span>
            </button>
            
            {showWeekDropdown && (
              <div className="absolute top-full mt-1 left-0 bg-[#111520] border border-[#1f2947] rounded-lg shadow-2xl p-2 z-50 min-w-[260px] flex flex-col gap-1">
                <label className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer text-sm text-slate-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={filter.week === 'all' || !filter.week || filter.week.length === 0}
                    onChange={() => {
                      handleWeekChange('all')
                      setFilter((f: any) => ({ ...f, weekRanges: undefined }))
                      setShowWeekDropdown(false)
                    }}
                    className="w-4 h-4 rounded border-[#1f2947] bg-[#0a0c14] text-blue-500 focus:ring-blue-500/20 focus:ring-offset-0"
                  />
                  <span className="font-semibold">All Weeks</span>
                </label>
                <div className="h-[1px] bg-[#1f2947] my-1 mx-2"></div>
                {getSundaysInMonth(
                  parseInt((filter.year && filter.year !== 'all') ? filter.year : new Date().getFullYear().toString()),
                  parseInt(filter.month)
                ).map((w: any) => {
                  const isChecked = Array.isArray(filter.week) ? filter.week.includes(w.value) : filter.week === w.value
                  return (
                    <label key={w.value} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer text-sm text-slate-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const current = Array.isArray(filter.week) ? [...filter.week] : (filter.week !== 'all' && filter.week ? [filter.week] : [])
                          let next = []
                          if (e.target.checked) {
                            next = [...current.filter(x => x !== 'all'), w.value].sort((a,b) => parseInt(a) - parseInt(b))
                          } else {
                            next = current.filter(x => x !== w.value)
                          }
                          
                          if (next.length === 0) {
                            handleWeekChange('all')
                            setFilter((f: any) => ({ ...f, weekRanges: undefined }))
                          } else if (next.length === 1) {
                            handleWeekChange(next[0])
                            setFilter((f: any) => ({ ...f, weekRanges: undefined }))
                          } else {
                            handleMultiWeekChange(next)
                          }
                        }}
                        className="w-4 h-4 rounded border-[#1f2947] bg-[#0a0c14] text-blue-500 focus:ring-blue-500/20 focus:ring-offset-0"
                      />
                      {w.label}
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {filter.preset === 'custom' && (!filter.year || filter.year === 'all') && (
        <>
          <div className="w-[1px] h-4 bg-[#1f2947] mx-1"></div>
          <input type="date" value={filter.from} onChange={e => setFilter((f: any) => ({ ...f, from: e.target.value, preset: 'custom' }))}
            className="bg-transparent text-slate-300 text-sm focus:outline-none [color-scheme:dark] cursor-pointer" />
          <span className="text-slate-500 text-xs font-semibold px-1">to</span>
          <input type="date" value={filter.to} onChange={e => setFilter((f: any) => ({ ...f, to: e.target.value, preset: 'custom' }))}
            className="bg-transparent text-slate-300 text-sm focus:outline-none [color-scheme:dark] cursor-pointer" />
        </>
      )}
    </>
  )
}
