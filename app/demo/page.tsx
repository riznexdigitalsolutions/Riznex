'use client'

import React, { useState } from 'react'
import Link from 'next/link'

// Formatting helper
const gbp = (val: number) => {
  return '£' + Number(val || 0).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// ── PURE REALISTIC DEMO DATA (SIMULATED UK RESTAURANT) ─────────────────────
const DEMO_STORE_DATA = {
  Combined: {
    orders: 6420,
    grossSales: 142650.00,
    netSales: 119820.00,
    totalExpenses: 96480.00,
    netProfit: 23340.00,
    franchiseFees: 7200.00,
    utilities: 3850.00,
    wages: 42500.00,
    supplierPurchases: 36250.00,
    marketing: 2480.00,
    others: 4200.00,
    commissions: 14630.00,
    otherDeductions: 5400.00,
    adSpends: 2800.00,
    platforms: [
      { name: 'Deliveroo', orders: 1020, sales: 24800.00, deductions: 4960.00, dedPct: '20.0%', net: 19840.00 },
      { name: 'Just Eat', orders: 780, sales: 18650.00, deductions: 6154.50, dedPct: '33.0%', net: 12495.50 },
      { name: 'Uber Eats', orders: 840, sales: 21400.00, deductions: 6848.00, dedPct: '32.0%', net: 14552.00 },
      { name: 'Prime Pizza POS', orders: 1840, sales: 32600.00, deductions: 0.00, dedPct: '0.0%', net: 32600.00 },
      { name: 'Prime Pizza Web & App', orders: 920, sales: 19800.00, deductions: 990.00, dedPct: '5.0%', net: 18810.00 },
      { name: 'Smash Burger POS', orders: 580, sales: 15600.00, deductions: 0.00, dedPct: '0.0%', net: 15600.00 },
      { name: 'Smash Burger Web & App', orders: 440, sales: 9800.00, deductions: 490.00, dedPct: '5.0%', net: 9310.00 },
    ],
    commBreakdown: [
      { name: 'Deliveroo', amount: 4960.00 },
      { name: 'Just Eat', amount: 4850.00 },
      { name: 'Uber Eats', amount: 3340.00 },
      { name: 'Prime Pizza Web & App', amount: 990.00 },
      { name: 'Smash Burger Web & App', amount: 490.00 },
    ],
    dedBreakdown: [
      { name: 'Deliveroo Order Processing', amount: 1650.00 },
      { name: 'Just Eat Technology Fee', amount: 1980.00 },
      { name: 'Uber Eats Service Adjustments', amount: 1770.00 },
    ],
    adBreakdown: [
      { name: 'Deliveroo Sponsored Placements', amount: 950.00 },
      { name: 'Just Eat Top Rank Ads', amount: 1100.00 },
      { name: 'Uber Eats In-App Promotions', amount: 750.00 },
    ],
    franchiseBreakdown: [
      { name: 'Prime Pizza License Fee', amount: 4800.00 },
      { name: 'Till & EPOS Cloud Hosting', amount: 1200.00 },
      { name: 'Smash Burger Kitchen Royalty', amount: 1200.00 },
    ],
    marketingBreakdown: [
      { name: 'Meta & Instagram Ads', amount: 850.00 },
      { name: 'Google Local Map Ads', amount: 650.00 },
      { name: 'Local Flyer Print Campaign', amount: 480.00 },
      { name: 'Influencer Tasting Event', amount: 500.00 },
    ],
    otherExpensesBreakdown: [
      { name: 'Accountant & VAT Filing', amount: 600.00 },
      { name: 'Card Terminal Merchant Fees', amount: 180.00 },
      { name: 'Kitchen Maintenance & Repairs', amount: 520.00 },
      { name: 'Commercial Building Insurance', amount: 400.00 },
      { name: 'Staff Uniforms & Printing', amount: 250.00 },
      { name: 'Shop Premises Rent', amount: 2250.00 },
    ],
    wagesBreakdown: [
      { name: 'Head Chef Marco Rossi', amount: 9600.00 },
      { name: 'Sous Chef David Miller', amount: 7800.00 },
      { name: 'Kitchen Lead Sam Taylor', amount: 6500.00 },
      { name: 'Shift Supervisor Sarah Jenkins', amount: 6200.00 },
      { name: 'Cashier & Front Desk Alex', amount: 5100.00 },
      { name: 'Delivery Drivers Team Pool', amount: 7300.00 },
    ],
    utilitiesBreakdown: [
      { name: 'Commercial Electricity - Kitchen', amount: 1650.00 },
      { name: 'Gas Supply - Pizza Ovens', amount: 1250.00 },
      { name: 'Water & Trade Effluent', amount: 480.00 },
      { name: 'Commercial Waste & Bin Collection', amount: 320.00 },
      { name: 'Business High-Speed Internet', amount: 150.00 },
    ],
    suppliers: [
      { name: 'Brakes UK Foodservice', category: 'Food & Dairy', amount: 8450.00 },
      { name: 'Direct Meats Wholesale', category: 'Meat & Poultry', amount: 7920.00 },
      { name: 'Medina Dairy & Cheese', category: 'Cheese & Dairy', amount: 6150.00 },
      { name: 'Packaging Direct Ltd', category: 'Takeaway Packaging', amount: 3800.00 },
      { name: 'Central Fresh Produce', category: 'Fresh Vegetables', amount: 4650.00 },
      { name: 'CleanMaster Hygiene UK', category: 'Kitchen Cleaning', amount: 1280.00 },
      { name: 'Others & Sundries', category: 'Misc Supplies', amount: 4000.00 },
    ]
  },
  'Prime Pizza': {
    orders: 4120,
    grossSales: 94650.00,
    netSales: 81220.00,
    totalExpenses: 64180.00,
    netProfit: 17040.00,
    franchiseFees: 5200.00,
    utilities: 2450.00,
    wages: 28400.00,
    supplierPurchases: 23800.00,
    marketing: 1650.00,
    others: 2680.00,
    commissions: 9850.00,
    otherDeductions: 3580.00,
    adSpends: 1850.00,
    platforms: [
      { name: 'Deliveroo', orders: 680, sales: 16800.00, deductions: 3360.00, dedPct: '20.0%', net: 13440.00 },
      { name: 'Just Eat', orders: 480, sales: 12450.00, deductions: 4108.50, dedPct: '33.0%', net: 8341.50 },
      { name: 'Uber Eats', orders: 500, sales: 13000.00, deductions: 4160.00, dedPct: '32.0%', net: 8840.00 },
      { name: 'Prime Pizza POS', orders: 1840, sales: 32600.00, deductions: 0.00, dedPct: '0.0%', net: 32600.00 },
      { name: 'Prime Pizza Web & App', orders: 620, sales: 19800.00, deductions: 990.00, dedPct: '5.0%', net: 18810.00 },
    ],
    commBreakdown: [
      { name: 'Deliveroo', amount: 3360.00 },
      { name: 'Just Eat', amount: 3250.00 },
      { name: 'Uber Eats', amount: 2250.00 },
      { name: 'Prime Pizza Web & App', amount: 990.00 },
    ],
    dedBreakdown: [
      { name: 'Deliveroo Order Processing', amount: 1100.00 },
      { name: 'Just Eat Technology Fee', amount: 1320.00 },
      { name: 'Uber Eats Service Adjustments', amount: 1160.00 },
    ],
    adBreakdown: [
      { name: 'Deliveroo Ads', amount: 650.00 },
      { name: 'Just Eat Top Rank', amount: 750.00 },
      { name: 'Uber Eats Promotions', amount: 450.00 },
    ],
    franchiseBreakdown: [
      { name: 'Prime Pizza License Fee', amount: 4400.00 },
      { name: 'Till & EPOS Cloud Hosting', amount: 800.00 },
    ],
    marketingBreakdown: [
      { name: 'Meta & Instagram Ads', amount: 600.00 },
      { name: 'Google Local Map Ads', amount: 450.00 },
      { name: 'Local Flyer Print Campaign', amount: 300.00 },
      { name: 'Influencer Tasting Event', amount: 300.00 },
    ],
    otherExpensesBreakdown: [
      { name: 'Accountant & VAT Filing', amount: 400.00 },
      { name: 'Card Terminal Merchant Fees', amount: 120.00 },
      { name: 'Kitchen Maintenance & Repairs', amount: 350.00 },
      { name: 'Shop Premises Rent', amount: 1500.00 },
      { name: 'Others', amount: 310.00 },
    ],
    wagesBreakdown: [
      { name: 'Head Chef Marco Rossi', amount: 9600.00 },
      { name: 'Kitchen Lead Sam Taylor', amount: 6500.00 },
      { name: 'Cashier & Front Desk Alex', amount: 5100.00 },
      { name: 'Delivery Drivers Team Pool', amount: 7200.00 },
    ],
    utilitiesBreakdown: [
      { name: 'Commercial Electricity - Kitchen', amount: 1100.00 },
      { name: 'Gas Supply - Pizza Ovens', amount: 950.00 },
      { name: 'Water & Waste', amount: 300.00 },
      { name: 'High-Speed Internet', amount: 100.00 },
    ],
    suppliers: [
      { name: 'Brakes UK Foodservice', category: 'Food & Dairy', amount: 6200.00 },
      { name: 'Medina Dairy & Cheese', category: 'Cheese & Dairy', amount: 5400.00 },
      { name: 'Packaging Direct Ltd', category: 'Takeaway Packaging', amount: 2600.00 },
      { name: 'Central Fresh Produce', category: 'Fresh Vegetables', amount: 3100.00 },
      { name: 'CleanMaster Hygiene UK', category: 'Kitchen Cleaning', amount: 850.00 },
      { name: 'Direct Meats Wholesale', category: 'Meat & Poultry', amount: 4200.00 },
      { name: 'Others', category: 'Misc Supplies', amount: 1450.00 },
    ]
  },
  'Smash Burger': {
    orders: 2300,
    grossSales: 48000.00,
    netSales: 38600.00,
    totalExpenses: 32300.00,
    netProfit: 6300.00,
    franchiseFees: 2000.00,
    utilities: 1400.00,
    wages: 14100.00,
    supplierPurchases: 12450.00,
    marketing: 830.00,
    others: 1520.00,
    commissions: 4780.00,
    otherDeductions: 1820.00,
    adSpends: 950.00,
    platforms: [
      { name: 'Deliveroo', orders: 340, sales: 8000.00, deductions: 1600.00, dedPct: '20.0%', net: 6400.00 },
      { name: 'Just Eat', orders: 300, sales: 6200.00, deductions: 2046.00, dedPct: '33.0%', net: 4154.00 },
      { name: 'Uber Eats', orders: 340, sales: 8400.00, deductions: 2688.00, dedPct: '32.0%', net: 5712.00 },
      { name: 'Smash Burger POS', orders: 880, sales: 15600.00, deductions: 0.00, dedPct: '0.0%', net: 15600.00 },
      { name: 'Smash Burger Web & App', orders: 440, sales: 9800.00, deductions: 490.00, dedPct: '5.0%', net: 9310.00 },
    ],
    commBreakdown: [
      { name: 'Deliveroo', amount: 1600.00 },
      { name: 'Just Eat', amount: 1600.00 },
      { name: 'Uber Eats', amount: 1090.00 },
      { name: 'Smash Burger Web & App', amount: 490.00 },
    ],
    dedBreakdown: [
      { name: 'Deliveroo Order Processing', amount: 550.00 },
      { name: 'Just Eat Technology Fee', amount: 660.00 },
      { name: 'Uber Eats Service Adjustments', amount: 610.00 },
    ],
    adBreakdown: [
      { name: 'Deliveroo Ads', amount: 300.00 },
      { name: 'Just Eat Ads', amount: 350.00 },
      { name: 'Uber Eats Ads', amount: 300.00 },
    ],
    franchiseBreakdown: [
      { name: 'Smash Burger Brand Royalty', amount: 1200.00 },
      { name: 'EPOS Till Cloud License', amount: 800.00 },
    ],
    marketingBreakdown: [
      { name: 'Instagram & TikTok Ads', amount: 450.00 },
      { name: 'Local Deliveroo Banner', amount: 200.00 },
      { name: 'Promotional Flyers', amount: 180.00 },
    ],
    otherExpensesBreakdown: [
      { name: 'Premises Contribution Rent', amount: 750.00 },
      { name: 'Accountant Share', amount: 200.00 },
      { name: 'Repairs & Grill Filter', amount: 250.00 },
      { name: 'Misc Expenses', amount: 320.00 },
    ],
    wagesBreakdown: [
      { name: 'Sous Chef David Miller', amount: 7800.00 },
      { name: 'Shift Supervisor Sarah Jenkins', amount: 6200.00 },
      { name: 'Support Delivery Driver Pool', amount: 100.00 },
    ],
    utilitiesBreakdown: [
      { name: 'Commercial Electricity - Grills', amount: 550.00 },
      { name: 'Gas Supply', amount: 300.00 },
      { name: 'Water & Cleaning Drain', amount: 180.00 },
      { name: 'High-Speed Broadband', amount: 50.00 },
      { name: 'Waste Disposal', amount: 320.00 },
    ],
    suppliers: [
      { name: 'Direct Meats Wholesale (Patties)', category: 'Meat & Poultry', amount: 3720.00 },
      { name: 'Brakes UK Foodservice (Buns)', category: 'Food & Bakery', amount: 2250.00 },
      { name: 'Packaging Direct (Burger Boxes)', category: 'Takeaway Packaging', amount: 1200.00 },
      { name: 'Central Fresh Produce (Toppings)', category: 'Fresh Vegetables', amount: 1550.00 },
      { name: 'CleanMaster Hygiene UK', category: 'Kitchen Cleaning', amount: 430.00 },
      { name: 'Sauces & Marinades Co', category: 'Condiments', amount: 1800.00 },
      { name: 'Others', category: 'Misc Supplies', amount: 1500.00 },
    ]
  }
}

// ── SAMPLE SALES INVOICES DATA (3 SECTIONS MATCHING SCREENSHOTS 1, 2, 3) ───
const SAMPLE_SALES_INVOICES = [
  // POS Invoices
  { id: 'INV-POS-101', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Smash Burger POS', fileTag: 'Smash_POS_09_Sept_20.jpg', amount: 474.80, type: 'pos', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-POS-102', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Prime Pizza POS', fileTag: 'Pizza_POS_09_Sept_20.jpg', amount: 2052.15, type: 'pos', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-POS-103', date: '13 Sept 2026', week: '07 Sept 2026 - 13 Sept 2026', month: 'Sept 2026', details: 'Smash Burger POS', fileTag: 'Smash_POS_09_Sept_13.jpg', amount: 585.58, type: 'pos', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-POS-104', date: '13 Sept 2026', week: '07 Sept 2026 - 13 Sept 2026', month: 'Sept 2026', details: 'Prime Pizza POS', fileTag: 'Pizza_POS_09_Sept_13.jpg', amount: 2480.87, type: 'pos', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-POS-105', date: '06 Sept 2026', week: '31 Aug 2026 - 06 Sept 2026', month: 'Sept 2026', details: 'Smash Burger POS', fileTag: 'Smash_POS_09_Sept_06.jpg', amount: 482.57, type: 'pos', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-POS-106', date: '06 Sept 2026', week: '31 Aug 2026 - 06 Sept 2026', month: 'Sept 2026', details: 'Prime Pizza POS', fileTag: 'Pizza_POS_09_Sept_06.jpg', amount: 2297.57, type: 'pos', store: 'Prime Pizza', status: 'Extracted' },
  // Platform Invoices
  { id: 'INV-PLT-201', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Smash Burger Uber Eats', fileTag: 'Smash_Uber_09_Sept_20.pdf', amount: 837.77, type: 'platform', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-PLT-202', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Smash Burger Just Eat', fileTag: 'Smash_JE_09_Sept_20.pdf', amount: 251.64, type: 'platform', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-PLT-203', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Smash Burger Deliveroo', fileTag: 'Smash_Deliv_09_Sept_20.pdf', amount: 470.71, type: 'platform', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-PLT-204', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Prime Pizza Deliveroo', fileTag: 'Pizza_Deliv_09_Sept_20.pdf', amount: 257.30, type: 'platform', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-PLT-205', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Prime Pizza Just Eat', fileTag: 'Pizza_JE_09_Sept_20.pdf', amount: 310.17, type: 'platform', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-PLT-206', date: '13 Sept 2026', week: '07 Sept 2026 - 13 Sept 2026', month: 'Sept 2026', details: 'Smash Burger Uber Eats', fileTag: 'Smash_Uber_09_Sept_13.pdf', amount: 805.53, type: 'platform', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-PLT-207', date: '13 Sept 2026', week: '07 Sept 2026 - 13 Sept 2026', month: 'Sept 2026', details: 'Prime Pizza Uber Eats', fileTag: 'Pizza_Uber_09_Sept_13.pdf', amount: 742.10, type: 'platform', store: 'Prime Pizza', status: 'Extracted' },
]

// ── SAMPLE MARKETING CAMPAIGNS ROI ─────────────────────────────────────────
const DEMO_MARKETING_OFFERS = [
  { date: '14 Sept 2026', platform: 'Deliveroo (Prime Pizza)', promo: '20% Off Menu (Min Spend £25)', spend: '£150.00', orders: 62, gross: 1680.00, ded: 336.00, dedPct: '20.0%', net: 1344.00, roi: '+420%' },
  { date: '14 Sept 2026', platform: 'Uber Eats (Smash Burger)', promo: 'Buy 1 Get 1 Free Drink & Fries', spend: '£120.00', orders: 85, gross: 2150.00, ded: 688.00, dedPct: '32.0%', net: 1462.00, roi: '+380%' },
  { date: '07 Sept 2026', platform: 'Just Eat (Prime Pizza)', promo: 'Free Garlic Pizza Bread over £20', spend: '£90.00', orders: 48, gross: 1240.00, ded: 409.20, dedPct: '33.0%', net: 830.80, roi: '+290%' },
  { date: '07 Sept 2026', platform: 'Deliveroo (Smash Burger)', promo: 'Top Rank Sponsored £15/day', spend: '£105.00', orders: 92, gross: 2420.00, ded: 484.00, dedPct: '20.0%', net: 1936.00, roi: '+540%' },
  { date: '31 Aug 2026', platform: 'Uber Eats (Prime Pizza)', promo: '£5 Off Orders Over £30', spend: '£140.00', orders: 74, gross: 2350.00, ded: 752.00, dedPct: '32.0%', net: 1598.00, roi: '+340%' },
]

import { useSearchParams } from 'next/navigation'

export default function AuthenticDemoPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0a0c14]" />}>
      <DemoContent />
    </React.Suspense>
  )
}

function DemoContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as any
  const [activeTab, setActiveTab] = useState<
    'main_overview' | 'weekly_comparison' | 'monthly_comparison' | 'current_offers' |
    'invoices_combined' | 'invoices_platform' | 'invoices_pos'
  >(['main_overview', 'weekly_comparison', 'monthly_comparison', 'current_offers', 'invoices_combined', 'invoices_platform', 'invoices_pos'].includes(initialTab) ? initialTab : 'main_overview')
  const [store, setStore] = useState<'Combined' | 'Prime Pizza' | 'Smash Burger'>('Combined')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All Platforms')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('All Time')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandProfitSummary, setExpandProfitSummary] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150)
    return () => clearTimeout(timer)
  }, [])

  const currentData = DEMO_STORE_DATA[store]

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filter invoices based on active subtab & active store
  const getFilteredInvoices = () => {
    let list = SAMPLE_SALES_INVOICES
    if (activeTab === 'invoices_platform') {
      list = list.filter(i => i.type === 'platform')
    } else if (activeTab === 'invoices_pos') {
      list = list.filter(i => i.type === 'pos')
    }
    if (store !== 'Combined') {
      list = list.filter(i => i.store === store)
    }
    return list
  }

  return (
    <div className="min-h-screen bg-[#0a0c14] text-slate-200 flex flex-col font-sans selection:bg-[#E5B869] selection:text-black">
      
      {/* ── TOP DEMO CALLOUT BANNER ────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#D9A336] via-[#F5CB6C] to-[#C89B3C] text-black px-3.5 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black">
          <span className="bg-black text-[#E5B869] text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider shadow">
            Simulated Demo
          </span>
          <span className="hidden sm:inline font-bold">
            Interactive Restaurant Intelligence Preview with realistic sample UK multi-brand data.
          </span>
          <span className="sm:hidden font-bold">Sample Client Demo</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button 
            onClick={() => setShowOrderModal(true)}
            className="px-3.5 py-1 text-xs font-black bg-black text-[#E5B869] hover:bg-black/85 rounded-lg transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Get Your Setup (£300)</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <Link 
            href="/"
            className="text-xs font-bold text-black/80 hover:text-black underline px-2 py-1"
          >
            Back to Home
          </Link>
        </div>
      </div>

      <div className="flex flex-1 relative">

        {/* ── SIDEBAR NAVIGATION (Matching Authentic Client Layout) ──────────── */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111520] border-r border-[#1f2947] flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 pt-10' : '-translate-x-full'}`}>
          {/* Sidebar Header */}
          <div className="flex items-center gap-3 px-5 py-6 border-b border-[#1f2947]">
            <img 
              src="/images/new-logo.jpg" 
              alt="Riznex Logo" 
              className="w-11 h-11 rounded-xl object-contain bg-white p-1 flex-shrink-0 shadow"
            />
            <div>
              <div className="font-extrabold text-white text-sm tracking-wide">RIZNEX</div>
              <div className="text-[11px] text-[#E5B869] font-medium leading-tight">The Royal Grill & Lounge</div>
              <div className="text-[9px] text-slate-400 font-mono">Sample Client Demo</div>
            </div>
          </div>

          {/* Sidebar Nav Links */}
          <nav className="flex-1 px-3 py-5 space-y-4 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">
              MENU
            </div>

            {/* 1. Overview Group */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-bold text-blue-400 flex items-center justify-between rounded-xl bg-blue-500/10 border border-blue-500/20">
                <span className="flex items-center gap-2">
                  <span>📊</span> Overview
                </span>
                <span className="text-[10px] text-blue-300">▼</span>
              </div>
              <div className="pl-4 pr-1 py-1 space-y-1">
                <button
                  onClick={() => { setActiveTab('main_overview'); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'main_overview' 
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>• Main Overview</span>
                </button>
                <button
                  onClick={() => { setActiveTab('weekly_comparison'); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'weekly_comparison' 
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>• Weekly Comparison</span>
                </button>
                <button
                  onClick={() => { setActiveTab('monthly_comparison'); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'monthly_comparison' 
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>• Monthly Comparison</span>
                </button>
                <button
                  onClick={() => { setActiveTab('current_offers'); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'current_offers' 
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>• Current Offers</span>
                </button>
              </div>
            </div>

            {/* 2. Sales Invoices Group (Exact 3 Sub-Sections Requested By User!) */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-bold text-slate-300 flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <span className="flex items-center gap-2">
                  <span>🧾</span> Sales Invoices
                </span>
                <span className="text-[10px] text-slate-400">▼</span>
              </div>
              <div className="pl-4 pr-1 py-1 space-y-1">
                <button
                  onClick={() => { setActiveTab('invoices_combined'); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'invoices_combined'
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">• Combined Invoices Data</span>
                </button>
                <button
                  onClick={() => { setActiveTab('invoices_platform'); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'invoices_platform'
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate leading-tight">• Uber Eats, Just Eat, Deliveroo Invoices</span>
                </button>
                <button
                  onClick={() => { setActiveTab('invoices_pos'); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'invoices_pos'
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate leading-tight">• Prime Pizza & Smash Burger POS Invoices</span>
                </button>
              </div>
            </div>

          </nav>

          {/* User Profile in Sidebar */}
          <div className="p-4 border-t border-[#1f2947] bg-[#0d1019] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 font-black flex items-center justify-center text-sm">
                R
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">Royal Grill Admin</div>
                <div className="text-[10px] text-slate-400 truncate">Demo Client Portal</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <Link href="/" className="hover:text-white flex items-center gap-1">
                <span>🚪</span> Sign Out
              </Link>
              <button 
                onClick={() => setShowOrderModal(true)}
                className="text-[#E5B869] font-bold hover:underline cursor-pointer"
              >
                Order Setup £300
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN DASHBOARD VIEWPORT ────────────────────────────────────────── */}
        <main className="flex-1 bg-[#0e121b] p-3.5 sm:p-6 lg:p-8 overflow-y-auto pb-64 sm:pb-72">
          
          {/* Top Bar: Mobile Hamburger & Live Date */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1f2947]/50 lg:border-none">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#111520] border border-[#1f2947] text-white flex items-center gap-2 text-xs font-bold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              <span>Menu</span>
            </button>
            <div className="ml-auto text-xs font-medium text-slate-400 font-mono">
              Saturday, 3 October 2026
            </div>
          </div>

          {/* Tier 1: Client Header with Brand Badges & Export Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 rounded-xl bg-orange-600/20 border border-orange-500/40 p-1 flex items-center justify-center text-lg font-black text-orange-400 shadow-md">
                  🍕
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-600/20 border border-amber-500/40 p-1 flex items-center justify-center text-lg font-black text-amber-400 shadow-md">
                  🍔
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                  The Royal Grill & Lounge
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Live Demo Sync
                  </span>
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
                  {store} | {selectedPeriod} | {selectedPlatform}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => triggerToast('Generating sample PDF report for Royal Grill & Lounge...')}
                className="bg-[#111520] border border-[#1f2947] rounded-xl px-3.5 py-2 text-blue-400 hover:text-blue-300 hover:bg-[#1a2235] text-xs font-bold transition flex items-center gap-2 shadow cursor-pointer"
              >
                <span>📄</span> Export PDF Report
              </button>
              <button 
                onClick={() => setShowOrderModal(true)}
                className="bg-gradient-to-r from-[#E5B869] to-[#C89B3C] text-black font-black text-xs px-4 py-2 rounded-xl shadow-lg shadow-[#E5B869]/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                Order For £300
              </button>
            </div>
          </div>

          {/* Tier 2: Filter Toolbar (Store Pills, Platform Filter, Date Filter) */}
          <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 mb-6 shadow-xl">
            {/* Store Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1 bg-[#0a0c14] border border-[#1f2947] p-1 rounded-xl">
                <button
                  onClick={() => setStore('Combined')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    store === 'Combined' 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Combined
                </button>
                <button
                  onClick={() => setStore('Prime Pizza')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    store === 'Prime Pizza' 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Prime Pizza
                </button>
                <button
                  onClick={() => setStore('Smash Burger')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    store === 'Smash Burger' 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Smash Burger
                </button>
              </div>

              <div className="w-[1px] h-5 bg-[#1f2947] hidden sm:block"></div>

              {/* Platform Selector */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-[#0a0c14] border border-[#1f2947] text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-blue-500"
              >
                <option value="All Platforms">All Platforms (Consolidated)</option>
                <option value="Deliveroo">Deliveroo</option>
                <option value="Just Eat">Just Eat</option>
                <option value="Uber Eats">Uber Eats</option>
                <option value="POS">In-Store POS</option>
                <option value="Web & App">Web & App</option>
              </select>
            </div>

            {/* Right Side: Date Presets & Reset */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-[#0a0c14] border border-[#1f2947] text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-blue-500"
              >
                <option value="All Time">All Time</option>
                <option value="This Month">This Month (Oct 2026)</option>
                <option value="Last Month">Last Month (Sep 2026)</option>
                <option value="Last 4 Weeks">Last 4 Weeks</option>
              </select>

              <button 
                onClick={() => { setStore('Combined'); setSelectedPlatform('All Platforms'); setSelectedPeriod('All Time'); }}
                className="text-slate-400 hover:text-white hover:bg-[#1f2947]/50 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Reset
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: MAIN OVERVIEW                                                */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'main_overview' && (
            <div className="space-y-6">

              {/* Primary 5 KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-4 sm:p-5 shadow-lg">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Orders</div>
                  <div className="text-2xl sm:text-3xl font-black text-orange-400">{currentData.orders.toLocaleString()}</div>
                </div>
                <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-4 sm:p-5 shadow-lg">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Gross Sales</div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-400">{gbp(currentData.grossSales)}</div>
                </div>
                <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-4 sm:p-5 shadow-lg">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Net Sales</div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400">{gbp(currentData.netSales)}</div>
                </div>
                <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-4 sm:p-5 shadow-lg">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Expenses</div>
                  <div className="text-2xl sm:text-3xl font-black text-purple-400">{gbp(currentData.totalExpenses)}</div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-emerald-500/10 shadow-xl">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Net Profit</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">{gbp(currentData.netProfit)}</div>
                </div>
              </div>

              {/* Expense Breakdown Strip — 7 Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2.5">
                <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-3.5 py-2.5 flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Franchise & POS</div>
                  <div className="text-sm sm:text-base font-black text-indigo-400">{gbp(currentData.franchiseFees)}</div>
                </div>
                <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-3.5 py-2.5 flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Utilities</div>
                  <div className="text-sm sm:text-base font-black text-sky-400">{gbp(currentData.utilities)}</div>
                </div>
                <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-3.5 py-2.5 flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Wages</div>
                  <div className="text-sm sm:text-base font-black text-pink-400">{gbp(currentData.wages)}</div>
                </div>
                <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-3.5 py-2.5 flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Supplier Purchases</div>
                  <div className="text-sm sm:text-base font-black text-amber-400">{gbp(currentData.supplierPurchases)}</div>
                </div>
                <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-3.5 py-2.5 flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Marketing</div>
                  <div className="text-sm sm:text-base font-black text-pink-400">{gbp(currentData.marketing)}</div>
                </div>
                <div className="bg-[#0e1420] border border-[#1f2947] rounded-xl px-3.5 py-2.5 flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Others</div>
                  <div className="text-sm sm:text-base font-black text-slate-400">{gbp(currentData.others)}</div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-purple-500/20 to-purple-900/30 border border-purple-500/40 rounded-xl px-3.5 py-2.5 flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider truncate">Total Expenses</div>
                  <div className="text-sm sm:text-base font-black text-purple-300">{gbp(currentData.totalExpenses)}</div>
                </div>
              </div>

              {/* Two Column Section: Profit Summary (Left) & Platform + Supplier Tables (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Profit Summary Waterfall */}
                <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 text-sm">
                        💰
                      </span>
                      <h2 className="text-lg font-black text-white">Profit Summary</h2>
                    </div>
                    <button 
                      onClick={() => setExpandProfitSummary(!expandProfitSummary)} 
                      className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition"
                      title={expandProfitSummary ? "Collapse All" : "Expand All"}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={expandProfitSummary ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"}/></svg>
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-300 font-bold text-base">Gross Sales</span>
                    <span className="text-blue-400 font-black text-base">{gbp(currentData.grossSales)}</span>
                  </div>

                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-[#1f2947] pb-1.5">
                    LESS:
                  </div>

                  <div className="space-y-3.5 flex-1 text-xs">
                    
                    {/* Commissions */}
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Commissions (3rd Parties)</span>
                        <span className="text-red-400 font-bold">-{gbp(currentData.commissions)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-[#1f2947]/50 pb-2 mt-1">
                          {currentData.commBreakdown.map((item, i) => (
                            <div key={i} className="flex justify-between text-[11px] text-slate-500">
                              <span>• {item.name}</span>
                              <span>-{gbp(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Other Deductions */}
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Other Deductions</span>
                        <span className="text-red-400 font-bold">-{gbp(currentData.otherDeductions)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-[#1f2947]/50 pb-2 mt-1">
                          {currentData.dedBreakdown.map((item, i) => (
                            <div key={i} className="flex justify-between text-[11px] text-slate-500">
                              <span>• {item.name}</span>
                              <span>-{gbp(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Ad Spends */}
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">3rd Party Ad Spends</span>
                        <span className="text-red-400 font-bold">-{gbp(currentData.adSpends)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-[#1f2947]/50 pb-2 mt-1">
                          {currentData.adBreakdown.map((item, i) => (
                            <div key={i} className="flex justify-between text-[11px] text-slate-500">
                              <span>• {item.name}</span>
                              <span>-{gbp(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Franchise & POS Fees */}
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Franchise & POS Fees</span>
                        <span className="text-red-400 font-bold">-{gbp(currentData.franchiseFees)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-[#1f2947]/50 pb-2 mt-1">
                          {currentData.franchiseBreakdown.map((item, i) => (
                            <div key={i} className="flex justify-between text-[11px] text-slate-500">
                              <span>• {item.name}</span>
                              <span>-{gbp(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Marketing */}
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Marketing</span>
                        <span className="text-red-400 font-bold">-{gbp(currentData.marketing)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-[#1f2947]/50 pb-2 mt-1">
                          {currentData.marketingBreakdown.map((item, i) => (
                            <div key={i} className="flex justify-between text-[11px] text-slate-500">
                              <span>• {item.name}</span>
                              <span>-{gbp(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Other Expenses */}
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Other Expenses</span>
                        <span className="text-red-400 font-bold">-{gbp(currentData.others)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-[#1f2947]/50 pb-2 mt-1">
                          {currentData.otherExpensesBreakdown.map((item, i) => (
                            <div key={i} className="flex justify-between text-[11px] text-slate-500">
                              <span>• {item.name}</span>
                              <span>-{gbp(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Staff Wages */}
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Staff Wages</span>
                        <span className="text-red-400 font-bold">-{gbp(currentData.wages)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-[#1f2947]/50 pb-2 mt-1">
                          {currentData.wagesBreakdown.map((item, i) => (
                            <div key={i} className="flex justify-between text-[11px] text-slate-500">
                              <span>• {item.name}</span>
                              <span>-{gbp(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Supplier Purchases */}
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Supplier Purchases</span>
                        <span className="text-red-400 font-bold">-{gbp(currentData.supplierPurchases)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-[#1f2947]/50 pb-2 mt-1">
                          {currentData.suppliers.map((item, i) => (
                            <div key={i} className="flex justify-between text-[11px] text-slate-500">
                              <span>• {item.name}</span>
                              <span>-{gbp(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Utilities */}
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Utilities</span>
                        <span className="text-red-400 font-bold">-{gbp(currentData.utilities)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 mt-1">
                          {currentData.utilitiesBreakdown.map((item, i) => (
                            <div key={i} className="flex justify-between text-[11px] text-slate-500">
                              <span>• {item.name}</span>
                              <span>-{gbp(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Net Profit Result */}
                  <div className="mt-6 pt-4 border-t border-emerald-500/20 flex justify-between items-center">
                    <span className="text-emerald-500 font-black text-lg">= Net Profit</span>
                    <span className="text-emerald-400 font-black text-xl">{gbp(currentData.netProfit)}</span>
                  </div>
                </div>

                {/* Right Column: Platform Performance & Supplier Purchases */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Platform Performance Table */}
                  <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden">
                    <h2 className="text-lg font-black text-white mb-5 flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 text-sm">
                        📊
                      </span>
                      Platform Performance
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead>
                          <tr className="text-slate-400 border-b-2 border-[#1f2947]">
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">Platform</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right">Orders</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right">Sales</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right">Deductions</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right">Ded. %</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right text-emerald-400">Net Received</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f2947]">
                          {currentData.platforms.map((p, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 font-bold text-white flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${p.name.includes('Uber') ? 'bg-emerald-400' : p.name.includes('Just Eat') ? 'bg-orange-500' : p.name.includes('Deliveroo') ? 'bg-teal-400' : 'bg-blue-400'}`}></span>
                                {p.name}
                              </td>
                              <td className="py-3 text-slate-300 text-right">{p.orders.toLocaleString()}</td>
                              <td className="py-3 text-blue-400 text-right font-semibold">{gbp(p.sales)}</td>
                              <td className="py-3 text-red-400 text-right font-medium">-{gbp(p.deductions)}</td>
                              <td className="py-3 text-amber-400 text-right font-medium">{p.dedPct}</td>
                              <td className="py-3 text-emerald-400 text-right font-black">{gbp(p.net)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Supplier Purchases Table */}
                  <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden">
                    <h2 className="text-lg font-black text-white mb-5 flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20 text-sm">
                        🛒
                      </span>
                      Supplier Purchases
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead>
                          <tr className="text-slate-400 border-b-2 border-[#1f2947]">
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">Supplier</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">Category</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right">Total Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f2947]">
                          {currentData.suppliers.map((s, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 font-semibold text-white">{s.name}</td>
                              <td className="py-3 text-slate-400">
                                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px]">
                                  {s.category}
                                </span>
                              </td>
                              <td className="py-3 text-amber-400 text-right font-black">{gbp(s.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ── SALES & EXPENSE DISTRIBUTION (FILLS EMPTY SPACE UNDER SUPPLIER PURCHASES) ── */}
                  <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-6">
                    
                    {/* Sales Distribution */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-bold text-white">
                        <span className="flex items-center gap-2">
                          <span className="text-rose-400">📈</span> Sales Distribution
                        </span>
                        <span className="text-blue-400 font-bold text-xs">{gbp(currentData.grossSales)}</span>
                      </div>

                      <div className="space-y-2.5">
                        {currentData.platforms.map((p, idx) => {
                          const maxSales = Math.max(...currentData.platforms.map(x => x.sales))
                          const pct = Math.min(100, Math.max(4, (p.sales / (maxSales || 1)) * 100))
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-300 font-medium">{p.name}</span>
                                <span className="text-blue-400 font-bold text-xs">{gbp(p.sales)}</span>
                              </div>
                              <div className="w-full h-1.5 bg-[#0e121b] rounded-full overflow-hidden border border-[#1f2947]">
                                <div 
                                  style={{ width: `${pct}%` }} 
                                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                                ></div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="border-t border-[#1f2947]"></div>

                    {/* Expense Distribution */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-bold text-white">
                        <span className="flex items-center gap-2">
                          <span className="text-amber-400">💸</span> Expense Distribution
                        </span>
                        <span className="text-purple-400 font-bold text-xs">{gbp(currentData.totalExpenses)}</span>
                      </div>

                      <div className="space-y-2.5">
                        {[
                          { name: 'Supplier Purchases', amount: currentData.supplierPurchases, color: 'bg-amber-500' },
                          { name: 'Staff Wages', amount: currentData.wages, color: 'bg-pink-500' },
                          { name: 'Other Expenses', amount: currentData.others, color: 'bg-indigo-500' },
                          { name: 'Utilities', amount: currentData.utilities, color: 'bg-sky-400' },
                          { name: 'Ad Spend', amount: currentData.adSpends, color: 'bg-orange-500' },
                        ].map((exp, idx) => {
                          const pct = currentData.totalExpenses > 0 ? ((exp.amount / currentData.totalExpenses) * 100).toFixed(1) : '0.0'
                          const widthPct = Math.min(100, Math.max(4, Number(pct)))
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-300 font-medium">{exp.name}</span>
                                <span className="text-slate-200 font-bold text-xs">
                                  {pct}% <span className="text-slate-500 font-normal">({gbp(exp.amount)})</span>
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-[#0e121b] rounded-full overflow-hidden border border-[#1f2947]">
                                <div 
                                  style={{ width: `${widthPct}%` }} 
                                  className={`h-full ${exp.color} rounded-full`}
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
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: WEEKLY COMPARISON                                            */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'weekly_comparison' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#1f2947]">
                <h2 className="text-2xl font-black text-white">Weekly Comparison</h2>
                <span className="text-xs text-slate-400 font-mono">Weeks 33 - 38 Audited</span>
              </div>

              {/* Dual Bar Chart */}
              <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    1. WEEKLY SALES & ORDERS
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Sales (£)
                    </span>
                    <span className="flex items-center gap-1.5 text-orange-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Orders
                    </span>
                  </div>
                </div>

                <div className="relative h-72 w-full pt-10 pb-8 flex mb-4">
                  {/* Y-axis Labels (Left - Sales) */}
                  <div className="absolute left-0 top-10 bottom-8 flex flex-col justify-between text-[10px] sm:text-xs text-slate-500 font-mono pr-2">
                    <span>£7.5k</span>
                    <span>£5k</span>
                    <span>£2.5k</span>
                    <span>£0</span>
                  </div>
                  
                  {/* Horizontal Grid Lines */}
                  <div className="absolute inset-0 left-10 right-8 top-10 bottom-8 flex flex-col justify-between pointer-events-none">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-full border-t border-white/[0.03]"></div>
                    ))}
                  </div>

                  {/* Y-axis Labels (Right - Orders) */}
                  <div className="absolute right-0 top-10 bottom-8 flex flex-col justify-between text-[10px] sm:text-xs text-slate-500 font-mono pl-2 text-right">
                    <span>350</span>
                    <span>230</span>
                    <span>115</span>
                    <span>0</span>
                  </div>

                  {/* Bars Container */}
                  <div className="flex-1 ml-10 mr-8 flex items-end justify-around h-full z-10 relative border-b border-[#1f2947]">
                    {[
                      { week: 'Wk 33', date: '10 Aug - 16 Aug', sales: 6200, orders: 280 },
                      { week: 'Wk 34', date: '17 Aug - 23 Aug', sales: 6850, orders: 310 },
                      { week: 'Wk 35', date: '24 Aug - 30 Aug', sales: 6400, orders: 290 },
                      { week: 'Wk 36', date: '31 Aug - 6 Sept', sales: 7100, orders: 325 },
                      { week: 'Wk 37', date: '7 Sept - 13 Sept', sales: 6650, orders: 300 },
                      { week: 'Wk 38', date: '14 Sept - 20 Sept', sales: 6150, orders: 275 },
                    ].map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                        
                        {/* Bars Area */}
                        <div className="flex items-end justify-center gap-1.5 w-full h-full relative">
                          {/* Sales Bar */}
                          <div className="relative w-4 sm:w-8 flex flex-col items-center justify-end h-full">
                            <div className="absolute -top-6 text-[9px] sm:text-[10px] font-bold text-blue-400 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-700 whitespace-nowrap">
                              {gbp(d.sales)}
                            </div>
                            <div 
                              style={{ 
                                height: mounted ? `${(d.sales / 7500) * 100}%` : '0%',
                                transition: `height 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 100}ms`
                              }}
                              className="w-full bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-md shadow-lg"
                            />
                          </div>

                          {/* Orders Bar */}
                          <div className="relative w-4 sm:w-8 flex flex-col items-center justify-end h-full">
                            <div className="absolute -top-6 text-[9px] sm:text-[10px] font-bold text-orange-400 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-700">
                              {d.orders}
                            </div>
                            <div 
                              style={{ 
                                height: mounted ? `${(d.orders / 350) * 100}%` : '0%',
                                transition: `height 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${(i * 100) + 50}ms`
                              }}
                              className="w-full bg-gradient-to-t from-orange-700 to-orange-400 rounded-t-md shadow-lg"
                            />
                          </div>
                        </div>

                        {/* X-axis Labels */}
                        <div className="absolute -bottom-10 text-center w-full">
                          <div className="text-[10px] sm:text-xs font-bold text-slate-300">{d.week}</div>
                          <div className="text-[8px] sm:text-[9px] text-slate-500 hidden sm:block whitespace-nowrap">{d.date}</div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Donut Visuals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-base font-bold text-white mb-4">Sales Mix</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full border-[14px] border-[#1f2947] border-t-blue-500 border-r-emerald-500 border-b-orange-500 border-l-purple-500 animate-spin-slow"></div>
                      <div className="absolute text-center">
                        <div className="text-sm font-black text-white">{gbp(currentData.grossSales)}</div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider">TOTAL SALES</div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs flex-1">
                      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Deliveroo</span><span className="font-bold text-white">17.4%</span></div>
                      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Just Eat</span><span className="font-bold text-white">13.1%</span></div>
                      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Uber Eats</span><span className="font-bold text-white">15.0%</span></div>
                      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Prime Pizza POS</span><span className="font-bold text-white">22.8%</span></div>
                      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Web & Mobile</span><span className="font-bold text-white">20.8%</span></div>
                      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Smash Burger POS</span><span className="font-bold text-white">10.9%</span></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-base font-bold text-white mb-4">Expense Breakdown</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full border-[14px] border-[#1f2947] border-t-pink-500 border-r-amber-500 border-b-indigo-500 border-l-sky-500 animate-spin-slow"></div>
                      <div className="absolute text-center">
                        <div className="text-sm font-black text-white">{gbp(currentData.totalExpenses)}</div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider">TOTAL EXPENSES</div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs flex-1">
                      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Wages</span><span className="font-bold text-white">44.0%</span></div>
                      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Supplier Purchases</span><span className="font-bold text-white">37.6%</span></div>
                      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Franchise & POS</span><span className="font-bold text-white">7.5%</span></div>
                      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Utilities</span><span className="font-bold text-white">4.0%</span></div>
                      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Marketing</span><span className="font-bold text-white">2.6%</span></div>
                      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Others</span><span className="font-bold text-white">4.3%</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 3: MONTHLY COMPARISON                                           */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'monthly_comparison' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#1f2947]">
                <h2 className="text-2xl font-black text-white">Monthly Comparison</h2>
                <span className="text-xs text-slate-400 font-mono">Jun 2026 - Sept 2026</span>
              </div>

              <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    1. MONTHLY SALES & ORDERS
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Sales (£)
                    </span>
                    <span className="flex items-center gap-1.5 text-orange-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Orders
                    </span>
                  </div>
                </div>

                <div className="relative h-72 w-full pt-10 pb-8 flex mb-4">
                  {/* Y-axis Labels (Left - Sales) */}
                  <div className="absolute left-0 top-10 bottom-8 flex flex-col justify-between text-[10px] sm:text-xs text-slate-500 font-mono pr-2">
                    <span>£40k</span>
                    <span>£30k</span>
                    <span>£20k</span>
                    <span>£10k</span>
                    <span>£0</span>
                  </div>
                  
                  {/* Horizontal Grid Lines */}
                  <div className="absolute inset-0 left-10 right-10 top-10 bottom-8 flex flex-col justify-between pointer-events-none">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-full border-t border-white/[0.03]"></div>
                    ))}
                  </div>

                  {/* Y-axis Labels (Right - Orders) */}
                  <div className="absolute right-0 top-10 bottom-8 flex flex-col justify-between text-[10px] sm:text-xs text-slate-500 font-mono pl-2 text-right">
                    <span>1800</span>
                    <span>1350</span>
                    <span>900</span>
                    <span>450</span>
                    <span>0</span>
                  </div>

                  {/* Bars Container */}
                  <div className="flex-1 ml-10 mr-10 flex items-end justify-around h-full z-10 relative border-b border-[#1f2947]">
                    {[
                      { month: 'Jun 2026', sales: 34500, orders: 1540 },
                      { month: 'Jul 2026', sales: 38200, orders: 1720 },
                      { month: 'Aug 2026', sales: 36800, orders: 1650 },
                      { month: 'Sept 2026', sales: 33150, orders: 1510 },
                    ].map((m, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                        
                        {/* Bars Area */}
                        <div className="flex items-end justify-center gap-2.5 w-full h-full relative">
                          {/* Sales Bar */}
                          <div className="relative w-6 sm:w-12 flex flex-col items-center justify-end h-full">
                            <div className="absolute -top-6 text-[9px] sm:text-[11px] font-bold text-blue-400 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-700 whitespace-nowrap">
                              {gbp(m.sales)}
                            </div>
                            <div 
                              style={{ 
                                height: mounted ? `${(m.sales / 40000) * 100}%` : '0%',
                                transition: `height 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 150}ms`
                              }}
                              className="w-full bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-md shadow-lg"
                            />
                          </div>

                          {/* Orders Bar */}
                          <div className="relative w-6 sm:w-12 flex flex-col items-center justify-end h-full">
                            <div className="absolute -top-6 text-[9px] sm:text-[11px] font-bold text-orange-400 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-700">
                              {m.orders}
                            </div>
                            <div 
                              style={{ 
                                height: mounted ? `${(m.orders / 1800) * 100}%` : '0%',
                                transition: `height 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${(i * 150) + 75}ms`
                              }}
                              className="w-full bg-gradient-to-t from-orange-700 to-orange-400 rounded-t-md shadow-lg"
                            />
                          </div>
                        </div>

                        {/* X-axis Labels */}
                        <div className="absolute -bottom-10 text-center w-full">
                          <div className="text-[10px] sm:text-xs font-bold text-slate-300">{m.month}</div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 4: CURRENT OFFERS & MARKETING ROI                               */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'current_offers' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#1f2947]">
                <h2 className="text-2xl font-black text-white">Marketing & Offers ROI</h2>
                <span className="text-xs text-slate-400 font-mono">Simulated Campaign Performance</span>
              </div>

              <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="text-slate-400 border-b-2 border-[#1f2947]">
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px]">Start Date</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px]">Platform & Promotion</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Spend</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Orders</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Gross Sales</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Deductions</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Ded %</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right text-emerald-400">Net Sales</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">ROI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f2947]">
                      {DEMO_MARKETING_OFFERS.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 text-slate-400 font-mono">{row.date}</td>
                          <td className="py-3 font-semibold text-white">
                            <div>{row.platform}</div>
                            <div className="text-[10px] text-slate-400">{row.promo}</div>
                          </td>
                          <td className="py-3 text-slate-400 text-right">{row.spend}</td>
                          <td className="py-3 text-slate-300 text-right font-medium">{row.orders}</td>
                          <td className="py-3 text-blue-400 text-right font-semibold">{gbp(row.gross)}</td>
                          <td className="py-3 text-red-400 text-right font-medium">-{gbp(row.ded)}</td>
                          <td className="py-3 text-amber-400 text-right font-medium">{row.dedPct}</td>
                          <td className="py-3 text-emerald-400 text-right font-black">{gbp(row.net)}</td>
                          <td className="py-3 text-emerald-400 text-right font-bold">{row.roi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 5, 6, 7: SALES INVOICES (3 SUB-SECTIONS EXACTLY AS SCREENSHOTS) */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {(activeTab === 'invoices_combined' || activeTab === 'invoices_platform' || activeTab === 'invoices_pos') && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="text-center sm:text-left pb-2 border-b border-[#1f2947]">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {activeTab === 'invoices_combined' && 'All Sales Invoices'}
                  {activeTab === 'invoices_platform' && 'Platform Invoices'}
                  {activeTab === 'invoices_pos' && 'Prime Pizza & Smash Burger POS Invoices'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {activeTab === 'invoices_combined' && 'Overview of all your POS and platform statements.'}
                  {activeTab === 'invoices_platform' && 'Manage your Uber Eats, Just Eat, and Deliveroo statements.'}
                  {activeTab === 'invoices_pos' && 'Manage invoices from your internal POS systems.'}
                </p>
              </div>

              {/* Sub-Filter Toolbar (Status, Time, Year, Month, Reset) */}
              <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#0a0c14] border border-[#1f2947] p-1 rounded-xl">
                    <button
                      onClick={() => setStore('Combined')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${store === 'Combined' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      Combined
                    </button>
                    <button
                      onClick={() => setStore('Prime Pizza')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${store === 'Prime Pizza' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      Prime Pizza
                    </button>
                    <button
                      onClick={() => setStore('Smash Burger')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${store === 'Smash Burger' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      Smash Burger
                    </button>
                  </div>

                  <select className="bg-[#0a0c14] border border-[#1f2947] text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer">
                    <option>All Statuses</option>
                    <option>Extracted</option>
                    <option>Pending</option>
                  </select>

                  <select className="bg-[#0a0c14] border border-[#1f2947] text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer">
                    <option>All Time</option>
                    <option>This Month</option>
                  </select>

                  <select className="bg-[#0a0c14] border border-[#1f2947] text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer">
                    <option>All Years</option>
                    <option>2026</option>
                  </select>

                  <select className="bg-[#0a0c14] border border-[#1f2947] text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer">
                    <option>All Months</option>
                    <option>Sept 2026</option>
                  </select>
                </div>

                <button 
                  onClick={() => { setStore('Combined'); triggerToast('Filters reset to default.'); }}
                  className="text-slate-400 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Reset
                </button>
              </div>

              {/* Exact Invoices Table Matching User Screenshots 1, 2, 3 */}
              <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="text-slate-400 border-b-2 border-[#1f2947]">
                        <th className="pb-3.5 pr-3 text-center">
                          <input type="checkbox" className="rounded bg-black border-slate-700 cursor-pointer" />
                        </th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px]">DATE</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px]">WEEK</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px]">MONTH</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px]">DETAILS</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">AMOUNT</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-center">STATUS</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">FILE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f2947]">
                      {getFilteredInvoices().map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 pr-3 text-center">
                            <input type="checkbox" className="rounded bg-black border-slate-700 cursor-pointer" />
                          </td>
                          <td className="py-4 font-bold text-white font-mono">{inv.date}</td>
                          <td className="py-4 text-slate-400">{inv.week}</td>
                          <td className="py-4 text-slate-400">{inv.month}</td>
                          <td className="py-4">
                            <div className="font-semibold text-white">{inv.details}</div>
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                              <span>📎</span> {inv.fileTag}
                            </div>
                          </td>
                          <td className="py-4 text-white text-right font-black">{gbp(inv.amount)}</td>
                          <td className="py-4 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                              <span>Extracted</span>
                              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[9px] font-black">✓</span>
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                            >
                              View File
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Bottom margin spacer for fixed banner */}
          <div className="h-32 sm:h-40"></div>
        </main>
      </div>

      {/* ── STICKY BOTTOM HIGH-CONVERSION BANNER ───────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0B0D14]/98 border-t border-[#E5B869]/30 backdrop-blur-xl px-4 py-3 sm:py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-[#E5B869]/20 border border-[#E5B869]/40 flex items-center justify-center text-[#E5B869] text-base shrink-0 hidden sm:flex">
              ⚡
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">
                Want this exact setup and weekly live reporting for your restaurant?
              </div>
              <div className="text-[11px] text-slate-400">
                1st Month complete setup is only £300 (Standard £500). Ongoing rolling management is £250/mo.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs text-black bg-gradient-to-r from-[#E5B869] via-[#F3C663] to-[#C89B3C] shadow-lg shadow-[#E5B869]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              Get Started For £300 ➔
            </button>
            <a
              href="/#contact"
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-300 bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] transition-all whitespace-nowrap cursor-pointer"
            >
              Book Walkthrough
            </a>
          </div>
        </div>
      </div>

      {/* ── INVOICE FILE MODAL INSPECTOR ────────────────────────────────────── */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111520] border border-[#1f2947] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center text-lg">
                🧾
              </span>
              <div>
                <h3 className="text-base font-black text-white">{selectedInvoice.details}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedInvoice.fileTag} • {selectedInvoice.date}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0a0c14] border border-[#1f2947] space-y-2 mb-4 text-xs">
              <div className="flex justify-between text-slate-400"><span>Assigned Brand:</span> <span className="text-white font-semibold">{selectedInvoice.store}</span></div>
              <div className="flex justify-between text-slate-400"><span>Billing Week:</span> <span className="text-white font-semibold">{selectedInvoice.week}</span></div>
              <div className="flex justify-between text-slate-400"><span>AI Extraction Status:</span> <span className="text-emerald-400 font-bold">Verified 100% Extracted</span></div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-white/10"><span>Reconciled Payout:</span> <span className="text-amber-400 font-black text-sm">{gbp(selectedInvoice.amount)}</span></div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400 mb-6 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
              <div className="font-bold text-slate-300 mb-1">OCR Verification Summary:</div>
              <div>• Gross sales matched with delivery platform portal payout.</div>
              <div>• Deductions itemized into commissions and marketing fees.</div>
              <div>• Ready for weekly executive P&L statement export.</div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => { triggerToast('Sample invoice PDF file opened.'); setSelectedInvoice(null); }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition cursor-pointer"
              >
                Download Statement
              </button>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PURCHASE / WALKTHROUGH BOOKING MODAL ────────────────────────────── */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111520] border border-[#E5B869]/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowOrderModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#E5B869]/20 border border-[#E5B869]/40 flex items-center justify-center text-[#E5B869] text-xl mb-4">
              ⚡
            </div>

            <h3 className="text-xl font-black text-white">Start With Phase 1 (£300)</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Get your custom dashboard setup, delivery menus optimized, and first automated weekly P&L within 7 days.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Restaurant Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Royal Spice Grill London" 
                  className="w-full bg-[#0a0c14] border border-[#1f2947] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5B869]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Your Name & Phone / WhatsApp</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe (+44 7123 456789)" 
                  className="w-full bg-[#0a0c14] border border-[#1f2947] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5B869]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/447392683935?text=Hello%20Riznex,%20I%20tested%20your%20live%20demo%20dashboard%20and%20want%20to%20order%20the%20%C2%A3300%20setup%20package."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-black text-xs text-black bg-gradient-to-r from-[#E5B869] to-[#C89B3C] shadow-lg shadow-[#E5B869]/20 hover:scale-[1.02] active:scale-[0.98] transition text-center flex items-center justify-center gap-2"
              >
                <span>Instant Setup via WhatsApp (£300)</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <Link
                href="/#contact"
                onClick={() => setShowOrderModal(false)}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-300 bg-white/5 hover:bg-white/10 text-center transition"
              >
                Or Submit Contact Form
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST MESSAGE ──────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#111520] border border-[#E5B869]/50 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-[#E5B869]">✔</span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  )
}
