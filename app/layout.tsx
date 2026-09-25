import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Riznex Digital Solutions | Restaurant Digital Management & Reporting',
  description: 'Riznex Digital Solutions helps restaurants improve their menus, online presence, digital platforms, business management and reporting with professional services and our own restaurant reporting software.',
  openGraph: {
    title: 'Riznex Digital Solutions | Restaurant Management & Reporting',
    description: 'We help restaurants improve their menus, online presence, digital platforms, and understand their business through clear reporting.',
    type: 'website',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
