const fs = require('fs');

let content = fs.readFileSync('components/DateFilter.tsx', 'utf8');

// Add React hooks import if missing
if (!content.includes('useState')) {
  content = content.replace("import { fmtDateInput, getWeekStart, getWeekEnd, getMonthStart, getMonthEnd } from '@/lib/utils'", 
  "import { useState, useRef, useEffect } from 'react'\nimport { fmtDateInput, getWeekStart, getWeekEnd, getMonthStart, getMonthEnd } from '@/lib/utils'");
} else {
  // It probably already has useState. Let's make sure useRef and useEffect are there.
  if (!content.includes('useRef')) {
    content = content.replace("import { useState", "import { useState, useRef, useEffect");
  }
}

// Inside the component, add state
const componentStart = "export default function DateFilter({ filter, setFilter }: { filter: any, setFilter: any }) {";
const stateVars = `
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

    // Calculate overall min/max
    const from = activeWeeks[0].start
    const to = activeWeeks[activeWeeks.length - 1].end
    
    // Calculate precise ranges
    const weekRanges = activeWeeks.map(w => \`\${w.start}_\${w.end}\`).join('|')

    setFilter((f: any) => ({ 
      ...f, 
      year: yStr, 
      month: filter.month, 
      week: selectedWeeks, 
      preset: 'specific_period', 
      from, 
      to,
      weekRanges 
    }))
  }
`;

content = content.replace(componentStart, componentStart + stateVars);

// Replace the old week select with the new dropdown
const oldWeekSelect = `<select
            value={filter.week || 'all'}
            onChange={e => handleWeekChange(e.target.value)}
            className="bg-transparent text-slate-300 hover:text-white px-2 py-1 text-sm focus:outline-none font-medium cursor-pointer transition-colors"
          >
            <option value="all" className="bg-[#111520] text-white">All Weeks</option>
            {getSundaysInMonth(
              parseInt((filter.year && filter.year !== 'all') ? filter.year : new Date().getFullYear().toString()),
              parseInt(filter.month)
            ).map((w: any) => (
              <option key={w.value} value={w.value} className="bg-[#111520] text-white">{w.label}</option>
            ))}
          </select>`;

const newWeekDropdown = `
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowWeekDropdown(!showWeekDropdown)}
              className="bg-transparent text-slate-300 hover:text-white px-2 py-1 text-sm focus:outline-none font-medium cursor-pointer transition-colors flex items-center gap-1"
            >
              {Array.isArray(filter.week) && filter.week.length > 0
                ? \`\${filter.week.length} Weeks\`
                : filter.week === 'all' || !filter.week
                ? 'All Weeks'
                : \`Week \${filter.week}\`}
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
`;

content = content.replace(oldWeekSelect, newWeekDropdown);

// Make sure `handleWeekChange` clears `weekRanges`
content = content.replace(
  "setFilter((f: any) => ({ ...f, year: yStr, month: filter.month, week: wStr, preset: 'specific_period', from: selectedWeek.start, to: selectedWeek.end }))",
  "setFilter((f: any) => ({ ...f, year: yStr, month: filter.month, week: wStr, preset: 'specific_period', from: selectedWeek.start, to: selectedWeek.end, weekRanges: undefined }))"
);

// We should also ensure clear weekRanges on Year/Month change
content = content.replace(
  "setFilter((f: any) => ({ ...f, year: y, week: 'all', preset: 'specific_period', from: newFrom, to: newTo }))",
  "setFilter((f: any) => ({ ...f, year: y, week: 'all', preset: 'specific_period', from: newFrom, to: newTo, weekRanges: undefined }))"
);

content = content.replace(
  "setFilter((f: any) => ({ ...f, year: yStr, month: mStr, week: 'all', preset: 'specific_period', from: newFrom, to: newTo }))",
  "setFilter((f: any) => ({ ...f, year: yStr, month: mStr, week: 'all', preset: 'specific_period', from: newFrom, to: newTo, weekRanges: undefined }))"
);

fs.writeFileSync('components/DateFilter.tsx', content, 'utf8');
console.log("DateFilter updated successfully");