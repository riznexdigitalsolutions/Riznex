'use client'
import { useState, useEffect } from 'react'

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Pending'
    const dateObj = new Date(dateString)
    const day = dateObj.getUTCDate().toString().padStart(2, '0')
    const month = dateObj.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' })
    const year = dateObj.getUTCFullYear()
    return `${day} ${month} ${year}`
  }

  const fetchClients = () => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(data => { setClients(data); setLoading(false) })
  }

  useEffect(() => { fetchClients() }, [])

  async function saveClient() {
    if (!editingClient) return
    setSaving(true)
    await fetch(`/api/clients/${editingClient.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingClient)
    })
    setSaving(false)
    setEditingClient(null)
    fetchClients()
  }

  if (loading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-2 border-t-amber-500 border-r-transparent border-b-amber-500 border-l-transparent rounded-full animate-spin"></div></div>

  return (
    <div className="max-w-5xl mx-auto px-2">
      {/* Ultra Premium Header */}
      <div className="flex flex-col items-center justify-center text-center mt-2 mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent blur-3xl -z-10 rounded-full" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-3 shadow-sm">
          Enterprise Client Portal
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] uppercase bg-gradient-to-br from-[#FCEE21] via-[#D4AF37] to-[#8A6d24] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)] mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          RIZNEX
        </h1>
        <h2 className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 tracking-[0.45em] uppercase flex items-center gap-4">
          <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
          Digital Solutions
          <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
        </h2>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1f2947] pb-3 mb-8">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
          <span>Active Systems</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">{clients.length}</span>
        </h3>
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Multi-Client Engine</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {clients.map(c => (
          <div key={c.id} className="relative bg-white/95 dark:bg-[#0c101d]/95 backdrop-blur-xl border border-slate-200/90 dark:border-amber-500/20 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/60 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 group flex flex-col justify-between overflow-hidden">
            {/* Luxury top gold accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E5B869] to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            
            {/* Ambient card corner glow */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-amber-500/15 transition-all" />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-5 border-b border-slate-100 dark:border-[#1a233a]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-[#141b2e] shadow-md border border-slate-200/80 dark:border-amber-500/30 p-1.5 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {c.name === 'Hungry Birds' ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src="/hungry-birds-logo.jpg" alt="Hungry Birds" className="w-full h-full object-contain rounded-xl" />
                    ) : c.name === 'Henley on Thames' ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src="/logos/herbies-pizza.jpg" alt="Henley on Thames" className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center text-xl font-black text-slate-950">
                        {c.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight leading-tight">{c.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Online
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Data Grid - Refined platform chips */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">
                  <span>Platform Synchronization</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">Latest Records</span>
                </div>

                <div className="rounded-xl border border-slate-200/80 dark:border-[#1f2947] overflow-hidden divide-y divide-slate-200/80 dark:divide-[#1f2947] bg-slate-50/50 dark:bg-[#121727]/50">
                  <div className="p-2.5 px-3 flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-[#161d31] transition-colors">
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00CCBC] flex-shrink-0"></span> Deliveroo
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatDate(c.latestDates?.deliveroo)}
                    </div>
                  </div>

                  <div className="p-2.5 px-3 flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-[#161d31] transition-colors">
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF8000] flex-shrink-0"></span> Just Eat
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatDate(c.latestDates?.just_eat)}
                    </div>
                  </div>

                  <div className="p-2.5 px-3 flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-[#161d31] transition-colors">
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#06C167] flex-shrink-0"></span> Uber Eats
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatDate(c.latestDates?.uber_eats)}
                    </div>
                  </div>

                  <div className="p-2.5 px-3 flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-[#161d31] transition-colors">
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></span> POS System
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatDate(c.latestDates?.pos)}
                    </div>
                  </div>

                  <div className="p-2.5 px-3 flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-[#161d31] transition-colors">
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></span> Auto Expenses
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatDate(c.latestDates?.auto_expenses)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={async () => {
              await fetch('/api/admin/set-client', { method: 'POST', body: JSON.stringify({ clientName: c.name }) });
              window.location.href = '/dashboard';
            }} className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F3C663] to-[#C89B3C] hover:opacity-95 active:scale-[0.99] text-slate-950 py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group/btn">
              <span>Access Database</span>
              <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        ))}
      </div>

      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/60 dark:bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111520] border border-slate-200 dark:border-[#1f2947] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Edit Client Setup</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Business Name</label>
                <input value={editingClient.name} onChange={e => setEditingClient({...editingClient, name: e.target.value})} className="w-full bg-slate-50 dark:bg-[#161b2c] border border-slate-200 dark:border-[#1f2947] text-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">JE Comm %</label>
                  <input type="number" value={editingClient.jeCommission || 14} onChange={e => setEditingClient({...editingClient, jeCommission: parseFloat(e.target.value)})} className="w-full bg-slate-50 dark:bg-[#161b2c] border border-slate-200 dark:border-[#1f2947] text-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Uber Comm %</label>
                  <input type="number" value={editingClient.ueCommission || 30} onChange={e => setEditingClient({...editingClient, ueCommission: parseFloat(e.target.value)})} className="w-full bg-slate-50 dark:bg-[#161b2c] border border-slate-200 dark:border-[#1f2947] text-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Del Comm %</label>
                  <input type="number" value={editingClient.delCommission || 14} onChange={e => setEditingClient({...editingClient, delCommission: parseFloat(e.target.value)})} className="w-full bg-slate-50 dark:bg-[#161b2c] border border-slate-200 dark:border-[#1f2947] text-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingClient(null)} className="flex-1 border border-slate-200 dark:border-[#1f2947] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl py-2.5 text-sm font-semibold transition">Cancel</button>
              <button onClick={saveClient} disabled={saving} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl py-2.5 text-sm font-bold hover:opacity-90 disabled:opacity-50 transition">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
