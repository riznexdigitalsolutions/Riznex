import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'Riznex Digital Solutions | Restaurant Digital Management & Reporting',
  description: 'Professional restaurant analytics and digital management platform for UK restaurants.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden w-full max-w-full bg-transparent text-slate-800 dark:text-slate-100`}>
        
        {/* GLOBAL LUXURY BACKGROUND INJECTED VIA LAYOUT */}
        <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none">
          <div className="absolute inset-0 w-full h-full dark:opacity-0 opacity-100 transition-opacity duration-700 bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/images/light_luxury_bg.jpg')" }}></div>
          <div className="absolute inset-0 w-full h-full dark:opacity-100 opacity-0 transition-opacity duration-700 bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/images/dark_luxury_bg.jpg')" }}></div>
          <div className="absolute inset-0 w-full h-full bg-white/50 dark:bg-[#07080B]/60 backdrop-blur-[1px]"></div>
        </div>
        <Providers>{children}</Providers>

      </body>
    </html>
  )
}
