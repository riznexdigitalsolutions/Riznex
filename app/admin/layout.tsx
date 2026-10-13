'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/admin', icon: '📊', label: 'All Clients' },
  { href: '/admin/settings', icon: '⚙️', label: 'Admin Settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-transparent flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-gradient-to-b from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border-r border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-200 dark:border-[#1f2947]">
          <img src="/riznex_logo.jpg" alt="Riznex Digital Solutions" className="w-11 h-11 rounded-xl object-contain bg-white flex-shrink-0 p-1 shadow-sm border border-slate-200 dark:border-white/10" />
          <div>
            <div className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wider">Riznex</div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold tracking-widest uppercase">DIGITAL SOLUTIONS</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1.5">
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <div key={item.href} className="border-b border-slate-200/80 dark:border-[#1f2947] pb-1.5 mb-1.5 last:border-b-0 last:pb-0 last:mb-0">
                <Link href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                    active 
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-amber-500/10 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  onClick={() => setOpen(false)}>
                  <span className="text-sm w-5 text-center">{item.icon}</span>{item.label}
                </Link>
              </div>
            )
          })}
        </nav>
        <div className="px-4 py-4 border-t border-slate-200 dark:border-[#1f2947] flex flex-col gap-2">
          <Link href="/admin?addClient=true" className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#E5B869] via-[#F3C663] to-[#C89B3C] hover:opacity-95 px-4 py-2.5 rounded-xl transition font-black shadow-md shadow-amber-500/20 active:scale-[0.99]">
            <span className="text-sm leading-none font-black">+</span> Add Client
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-red-500 dark:text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 px-4 py-2.5 rounded-xl transition font-bold mt-0.5">
            Sign Out
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[#0a0c14]/80 backdrop-blur border-b border-[#1f2947] px-6 py-3 flex items-center h-14 lg:hidden">
          <button className="text-slate-400 hover:text-white p-1" onClick={() => setOpen(true)}>☰</button>
        </header>
        <main className="flex-1 p-6 lg:pt-8">{children}</main>
      </div>
    </div>
  )
}
