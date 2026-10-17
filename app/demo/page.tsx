'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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

// ── SAMPLE SALES INVOICES DATA (EXPANDED FOR DYNAMIC FILTERING) ─────────────
const SAMPLE_SALES_INVOICES = [
  // October 2026 (Current Month)
  { id: 'INV-POS-107', date: '11 Oct 2026', week: '05 Oct 2026 - 11 Oct 2026', month: 'Oct 2026', details: 'Smash Burger POS', fileTag: 'Smash_POS_10_Oct_11.jpg', amount: 524.30, type: 'pos', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-POS-108', date: '11 Oct 2026', week: '05 Oct 2026 - 11 Oct 2026', month: 'Oct 2026', details: 'Prime Pizza POS', fileTag: 'Pizza_POS_10_Oct_11.jpg', amount: 2315.60, type: 'pos', store: 'Prime Pizza', status: 'Pending' },
  { id: 'INV-PLT-208', date: '11 Oct 2026', week: '05 Oct 2026 - 11 Oct 2026', month: 'Oct 2026', details: 'Prime Pizza Uber Eats', fileTag: 'Pizza_Uber_10_Oct_11.pdf', amount: 910.45, type: 'platform', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-PLT-209', date: '11 Oct 2026', week: '05 Oct 2026 - 11 Oct 2026', month: 'Oct 2026', details: 'Smash Burger Uber Eats', fileTag: 'Smash_Uber_10_Oct_11.pdf', amount: 625.30, type: 'platform', store: 'Smash Burger', status: 'Pending' },
  { id: 'INV-PLT-210', date: '04 Oct 2026', week: '28 Sep 2026 - 04 Oct 2026', month: 'Oct 2026', details: 'Prime Pizza Deliveroo', fileTag: 'Pizza_Deliv_10_Oct_04.pdf', amount: 412.30, type: 'platform', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-PLT-211', date: '04 Oct 2026', week: '28 Sep 2026 - 04 Oct 2026', month: 'Oct 2026', details: 'Smash Burger Just Eat', fileTag: 'Smash_JE_10_Oct_04.pdf', amount: 285.50, type: 'platform', store: 'Smash Burger', status: 'Extracted' },

  // September 2026 (Last Month)
  { id: 'INV-POS-101', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Smash Burger POS', fileTag: 'Smash_POS_09_Sept_20.jpg', amount: 474.80, type: 'pos', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-POS-102', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Prime Pizza POS', fileTag: 'Pizza_POS_09_Sept_20.jpg', amount: 2052.15, type: 'pos', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-POS-103', date: '13 Sept 2026', week: '07 Sept 2026 - 13 Sept 2026', month: 'Sept 2026', details: 'Smash Burger POS', fileTag: 'Smash_POS_09_Sept_13.jpg', amount: 585.58, type: 'pos', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-POS-104', date: '13 Sept 2026', week: '07 Sept 2026 - 13 Sept 2026', month: 'Sept 2026', details: 'Prime Pizza POS', fileTag: 'Pizza_POS_09_Sept_13.jpg', amount: 2480.87, type: 'pos', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-POS-105', date: '06 Sept 2026', week: '31 Aug 2026 - 06 Sept 2026', month: 'Sept 2026', details: 'Smash Burger POS', fileTag: 'Smash_POS_09_Sept_06.jpg', amount: 482.57, type: 'pos', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-POS-106', date: '06 Sept 2026', week: '31 Aug 2026 - 06 Sept 2026', month: 'Sept 2026', details: 'Prime Pizza POS', fileTag: 'Pizza_POS_09_Sept_06.jpg', amount: 2297.57, type: 'pos', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-PLT-201', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Smash Burger Uber Eats', fileTag: 'Smash_Uber_09_Sept_20.pdf', amount: 837.77, type: 'platform', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-PLT-202', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Smash Burger Just Eat', fileTag: 'Smash_JE_09_Sept_20.pdf', amount: 251.64, type: 'platform', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-PLT-203', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Smash Burger Deliveroo', fileTag: 'Smash_Deliv_09_Sept_20.pdf', amount: 470.71, type: 'platform', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-PLT-204', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Prime Pizza Deliveroo', fileTag: 'Pizza_Deliv_09_Sept_20.pdf', amount: 257.30, type: 'platform', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-PLT-205', date: '20 Sept 2026', week: '14 Sept 2026 - 20 Sept 2026', month: 'Sept 2026', details: 'Prime Pizza Just Eat', fileTag: 'Pizza_JE_09_Sept_20.pdf', amount: 310.17, type: 'platform', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-PLT-206', date: '13 Sept 2026', week: '07 Sept 2026 - 13 Sept 2026', month: 'Sept 2026', details: 'Smash Burger Uber Eats', fileTag: 'Smash_Uber_09_Sept_13.pdf', amount: 805.53, type: 'platform', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-PLT-207', date: '13 Sept 2026', week: '07 Sept 2026 - 13 Sept 2026', month: 'Sept 2026', details: 'Prime Pizza Uber Eats', fileTag: 'Pizza_Uber_09_Sept_13.pdf', amount: 742.10, type: 'platform', store: 'Prime Pizza', status: 'Extracted' },

  // August 2026
  { id: 'INV-POS-109', date: '24 Aug 2026', week: '17 Aug 2026 - 24 Aug 2026', month: 'Aug 2026', details: 'Prime Pizza POS', fileTag: 'Pizza_POS_08_Aug_24.jpg', amount: 2180.50, type: 'pos', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-PLT-212', date: '24 Aug 2026', week: '17 Aug 2026 - 24 Aug 2026', month: 'Aug 2026', details: 'Smash Burger Uber Eats', fileTag: 'Smash_Uber_08_Aug_24.pdf', amount: 790.30, type: 'platform', store: 'Smash Burger', status: 'Extracted' },
  { id: 'INV-PLT-213', date: '17 Aug 2026', week: '10 Aug 2026 - 17 Aug 2026', month: 'Aug 2026', details: 'Prime Pizza Deliveroo', fileTag: 'Pizza_Deliv_08_Aug_17.pdf', amount: 345.80, type: 'platform', store: 'Prime Pizza', status: 'Extracted' },

  // Historical 2025 Invoices
  { id: 'INV-POS-2025-01', date: '15 Dec 2025', week: '08 Dec 2025 - 15 Dec 2025', month: 'Dec 2025', details: 'Prime Pizza POS', fileTag: 'Pizza_POS_12_Dec_15_2025.jpg', amount: 1980.40, type: 'pos', store: 'Prime Pizza', status: 'Extracted' },
  { id: 'INV-PLT-2025-02', date: '15 Dec 2025', week: '08 Dec 2025 - 15 Dec 2025', month: 'Dec 2025', details: 'Smash Burger Uber Eats', fileTag: 'Smash_Uber_12_Dec_15_2025.pdf', amount: 710.20, type: 'platform', store: 'Smash Burger', status: 'Extracted' },
]

// ── SAMPLE MARKETING CAMPAIGNS ROI ─────────────────────────────────────────
const DEMO_MARKETING_OFFERS = [
  { date: '14 Sept 2026', platform: 'Deliveroo (Prime Pizza)', store: 'Prime Pizza', platformType: 'Deliveroo', promo: '20% Off Menu (Min Spend £25)', spend: '£150.00', orders: 62, gross: 1680.00, ded: 336.00, dedPct: '20.0%', net: 1344.00, roi: '+420%' },
  { date: '14 Sept 2026', platform: 'Uber Eats (Smash Burger)', store: 'Smash Burger', platformType: 'Uber Eats', promo: 'Buy 1 Get 1 Free Drink & Fries', spend: '£120.00', orders: 85, gross: 2150.00, ded: 688.00, dedPct: '32.0%', net: 1462.00, roi: '+380%' },
  { date: '07 Sept 2026', platform: 'Just Eat (Prime Pizza)', store: 'Prime Pizza', platformType: 'Just Eat', promo: 'Free Garlic Pizza Bread over £20', spend: '£90.00', orders: 48, gross: 1240.00, ded: 409.20, dedPct: '33.0%', net: 830.80, roi: '+290%' },
  { date: '07 Sept 2026', platform: 'Deliveroo (Smash Burger)', store: 'Smash Burger', platformType: 'Deliveroo', promo: 'Top Rank Sponsored £15/day', spend: '£105.00', orders: 92, gross: 2420.00, ded: 484.00, dedPct: '20.0%', net: 1936.00, roi: '+540%' },
  { date: '31 Aug 2026', platform: 'Uber Eats (Prime Pizza)', store: 'Prime Pizza', platformType: 'Uber Eats', promo: '£5 Off Orders Over £30', spend: '£140.00', orders: 74, gross: 2350.00, ded: 752.00, dedPct: '32.0%', net: 1598.00, roi: '+340%' },
  { date: '25 Aug 2026', platform: 'Prime Pizza Web & App', store: 'Prime Pizza', platformType: 'Web & App', promo: 'Direct App 10% First Order Discount', spend: '£60.00', orders: 55, gross: 1450.00, ded: 72.50, dedPct: '5.0%', net: 1377.50, roi: '+680%' },
  { date: '18 Aug 2026', platform: 'Smash Burger POS', store: 'Smash Burger', platformType: 'POS', promo: 'Lunch In-Store Combo £7.99', spend: '£40.00', orders: 95, gross: 1850.00, ded: 0.00, dedPct: '0.0%', net: 1850.00, roi: '+850%' },
  { date: '11 Aug 2026', platform: 'Just Eat (Smash Burger)', store: 'Smash Burger', platformType: 'Just Eat', promo: 'Free Loaded Fries over £25', spend: '£85.00', orders: 44, gross: 1120.00, ded: 369.60, dedPct: '33.0%', net: 750.40, roi: '+260%' },
]

// ── DYNAMIC METRIC ENGINE FOR FILTERS ────────────────────────────────────────
function calculateFilteredDemoData(
  store: 'Combined' | 'Prime Pizza' | 'Smash Burger',
  selectedPlatform: string,
  selectedPeriod: string
) {
  const base = DEMO_STORE_DATA[store]

  // 1. Period Factor
  let periodFactor = 1.0
  if (selectedPeriod === 'This Month (Oct 2026)' || selectedPeriod === 'This Month') {
    periodFactor = 0.38
  } else if (selectedPeriod === 'Last Month (Sep 2026)' || selectedPeriod === 'Last Month') {
    periodFactor = 0.65
  } else if (selectedPeriod === 'Last 4 Weeks') {
    periodFactor = 0.72
  }

  // 2. Filter matching platforms
  const matchingPlatforms = base.platforms.filter((p) => {
    if (selectedPlatform === 'All Platforms') return true
    if (selectedPlatform === 'POS') return p.name.includes('POS')
    if (selectedPlatform === 'Web & App') return p.name.includes('Web & App')
    return p.name.toLowerCase().includes(selectedPlatform.toLowerCase())
  })

  // 3. If a specific platform is picked (e.g. Uber Eats, Deliveroo, POS)
  if (selectedPlatform !== 'All Platforms') {
    const platOrders = Math.round(matchingPlatforms.reduce((sum, p) => sum + p.orders, 0) * periodFactor)
    const platGross = matchingPlatforms.reduce((sum, p) => sum + p.sales, 0) * periodFactor
    const platDeductions = matchingPlatforms.reduce((sum, p) => sum + p.deductions, 0) * periodFactor
    const platNet = platGross - platDeductions

    const matchName = (n: string) => {
      if (selectedPlatform === 'POS') return n.includes('POS') || n.includes('EPOS') || n.includes('Till')
      if (selectedPlatform === 'Web & App') return n.includes('Web') || n.includes('App')
      return n.toLowerCase().includes(selectedPlatform.toLowerCase())
    }

    const comms = base.commBreakdown
      .filter((c) => matchName(c.name))
      .map((c) => ({ ...c, amount: c.amount * periodFactor }))
    const commTotal = comms.reduce((sum, c) => sum + c.amount, 0) || platDeductions * 0.65

    const deds = base.dedBreakdown
      .filter((d) => matchName(d.name))
      .map((d) => ({ ...d, amount: d.amount * periodFactor }))
    const dedTotal = deds.reduce((sum, d) => sum + d.amount, 0) || platDeductions * 0.25

    const ads = base.adBreakdown
      .filter((a) => matchName(a.name))
      .map((a) => ({ ...a, amount: a.amount * periodFactor }))
    const adTotal = ads.reduce((sum, a) => sum + a.amount, 0) || platDeductions * 0.10

    // Platform share of store operations
    const platformShare = base.grossSales > 0 ? platGross / (base.grossSales * periodFactor) : 0.2
    const scaledFranchise = base.franchiseFees * periodFactor * platformShare
    const scaledMarketing = base.marketing * periodFactor * platformShare
    const scaledUtilities = base.utilities * periodFactor * platformShare
    const scaledWages = base.wages * periodFactor * platformShare
    const scaledSuppliers = base.supplierPurchases * periodFactor * platformShare
    const scaledOthers = base.others * periodFactor * platformShare

    const totalExpenses = platDeductions + scaledFranchise + scaledMarketing + scaledUtilities + scaledWages + scaledSuppliers + scaledOthers
    const netProfit = platNet - (scaledFranchise + scaledMarketing + scaledUtilities + scaledWages + scaledSuppliers + scaledOthers)

    return {
      orders: platOrders,
      grossSales: platGross,
      netSales: platNet,
      totalExpenses,
      netProfit,
      commissions: commTotal,
      otherDeductions: dedTotal,
      adSpends: adTotal,
      franchiseFees: scaledFranchise,
      marketing: scaledMarketing,
      utilities: scaledUtilities,
      wages: scaledWages,
      supplierPurchases: scaledSuppliers,
      others: scaledOthers,
      platforms: matchingPlatforms.map((p) => ({
        ...p,
        orders: Math.round(p.orders * periodFactor),
        sales: p.sales * periodFactor,
        deductions: p.deductions * periodFactor,
        net: p.net * periodFactor,
      })),
      commBreakdown: comms.length > 0 ? comms : [{ name: `${selectedPlatform} Commission`, amount: commTotal }],
      dedBreakdown: deds.length > 0 ? deds : [{ name: `${selectedPlatform} Tech & Adjustments`, amount: dedTotal }],
      adBreakdown: ads.length > 0 ? ads : [{ name: `${selectedPlatform} In-App Promotions`, amount: adTotal }],
      franchiseBreakdown: base.franchiseBreakdown.map((f) => ({ ...f, amount: f.amount * periodFactor * platformShare })),
      marketingBreakdown: base.marketingBreakdown.map((m) => ({ ...m, amount: m.amount * periodFactor * platformShare })),
      otherExpensesBreakdown: base.otherExpensesBreakdown.map((o) => ({ ...o, amount: o.amount * periodFactor * platformShare })),
      wagesBreakdown: base.wagesBreakdown.map((w) => ({ ...w, amount: w.amount * periodFactor * platformShare })),
      utilitiesBreakdown: base.utilitiesBreakdown.map((u) => ({ ...u, amount: u.amount * periodFactor * platformShare })),
      suppliers: base.suppliers.map((s) => ({ ...s, amount: s.amount * periodFactor * platformShare })),
    }
  }

  // 4. Consolidated 'All Platforms'
  return {
    orders: Math.round(base.orders * periodFactor),
    grossSales: base.grossSales * periodFactor,
    netSales: base.netSales * periodFactor,
    totalExpenses: base.totalExpenses * periodFactor,
    netProfit: base.netProfit * periodFactor,
    commissions: base.commissions * periodFactor,
    otherDeductions: base.otherDeductions * periodFactor,
    adSpends: base.adSpends * periodFactor,
    franchiseFees: base.franchiseFees * periodFactor,
    marketing: base.marketing * periodFactor,
    utilities: base.utilities * periodFactor,
    wages: base.wages * periodFactor,
    supplierPurchases: base.supplierPurchases * periodFactor,
    others: base.others * periodFactor,
    platforms: base.platforms.map((p) => ({
      ...p,
      orders: Math.round(p.orders * periodFactor),
      sales: p.sales * periodFactor,
      deductions: p.deductions * periodFactor,
      net: p.net * periodFactor,
    })),
    commBreakdown: base.commBreakdown.map((c) => ({ ...c, amount: c.amount * periodFactor })),
    dedBreakdown: base.dedBreakdown.map((d) => ({ ...d, amount: d.amount * periodFactor })),
    adBreakdown: base.adBreakdown.map((a) => ({ ...a, amount: a.amount * periodFactor })),
    franchiseBreakdown: base.franchiseBreakdown.map((f) => ({ ...f, amount: f.amount * periodFactor })),
    marketingBreakdown: base.marketingBreakdown.map((m) => ({ ...m, amount: m.amount * periodFactor })),
    otherExpensesBreakdown: base.otherExpensesBreakdown.map((o) => ({ ...o, amount: o.amount * periodFactor })),
    wagesBreakdown: base.wagesBreakdown.map((w) => ({ ...w, amount: w.amount * periodFactor })),
    utilitiesBreakdown: base.utilitiesBreakdown.map((u) => ({ ...u, amount: u.amount * periodFactor })),
    suppliers: base.suppliers.map((s) => ({ ...s, amount: s.amount * periodFactor })),
  }
}

export default function AuthenticDemoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
      <DemoContent />
    </Suspense>
  )
}

function DemoContent() {
  const { theme, setTheme } = useTheme()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as any

  const [activeTab, setActiveTab] = useState<
    'main_overview' | 'weekly_comparison' | 'monthly_comparison' | 'current_offers' |
    'invoices_combined' | 'invoices_platform' | 'invoices_pos'
  >(['main_overview', 'weekly_comparison', 'monthly_comparison', 'current_offers', 'invoices_combined', 'invoices_platform', 'invoices_pos'].includes(initialTab) ? initialTab : 'main_overview')

  // Top Filter Toolbar State
  const [store, setStore] = useState<'Combined' | 'Prime Pizza' | 'Smash Burger'>('Combined')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All Platforms')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('All Time')

  // Invoices Sub-Filter Toolbar State
  const [invoiceStatus, setInvoiceStatus] = useState<string>('All Statuses')
  const [invoicePeriod, setInvoicePeriod] = useState<string>('All Time')
  const [invoiceYear, setInvoiceYear] = useState<string>('All Years')
  const [invoiceMonth, setInvoiceMonth] = useState<string>('All Months')
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([])

  // Layout & Modal State
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandProfitSummary, setExpandProfitSummary] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150)
    return () => clearTimeout(timer)
  }, [])

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // ── DYNAMIC METRICS COMPUTATION (REACTIVE TO ALL FILTERS) ─────────────────
  const currentData = useMemo(() => {
    return calculateFilteredDemoData(store, selectedPlatform, selectedPeriod)
  }, [store, selectedPlatform, selectedPeriod])

  // Weekly Comparison dynamic data
  const weeklyComparisonData = useMemo(() => {
    const storeRatio = store === 'Prime Pizza' ? 0.66 : store === 'Smash Burger' ? 0.34 : 1.0
    let platformRatio = 1.0
    if (selectedPlatform === 'Deliveroo') platformRatio = 0.174
    else if (selectedPlatform === 'Just Eat') platformRatio = 0.131
    else if (selectedPlatform === 'Uber Eats') platformRatio = 0.150
    else if (selectedPlatform === 'POS') platformRatio = 0.337
    else if (selectedPlatform === 'Web & App') platformRatio = 0.208

    const mult = storeRatio * platformRatio

    if (selectedPeriod === 'This Month (Oct 2026)' || selectedPeriod === 'This Month') {
      return [
        { week: 'Wk 40', date: '28 Sep - 04 Oct', sales: Math.round(6900 * mult), orders: Math.round(315 * mult) },
        { week: 'Wk 41', date: '05 Oct - 11 Oct', sales: Math.round(7350 * mult), orders: Math.round(330 * mult) },
        { week: 'Wk 42', date: '12 Oct - 18 Oct (MTD)', sales: Math.round(3800 * mult), orders: Math.round(170 * mult) },
      ]
    }

    if (selectedPeriod === 'Last Month (Sep 2026)' || selectedPeriod === 'Last Month') {
      return [
        { week: 'Wk 36', date: '31 Aug - 06 Sept', sales: Math.round(7100 * mult), orders: Math.round(325 * mult) },
        { week: 'Wk 37', date: '07 Sept - 13 Sept', sales: Math.round(6650 * mult), orders: Math.round(300 * mult) },
        { week: 'Wk 38', date: '14 Sept - 20 Sept', sales: Math.round(6150 * mult), orders: Math.round(275 * mult) },
        { week: 'Wk 39', date: '21 Sept - 27 Sept', sales: Math.round(6800 * mult), orders: Math.round(305 * mult) },
      ]
    }

    return [
      { week: 'Wk 33', date: '10 Aug - 16 Aug', sales: Math.round(6200 * mult), orders: Math.round(280 * mult) },
      { week: 'Wk 34', date: '17 Aug - 23 Aug', sales: Math.round(6850 * mult), orders: Math.round(310 * mult) },
      { week: 'Wk 35', date: '24 Aug - 30 Aug', sales: Math.round(6400 * mult), orders: Math.round(290 * mult) },
      { week: 'Wk 36', date: '31 Aug - 06 Sept', sales: Math.round(7100 * mult), orders: Math.round(325 * mult) },
      { week: 'Wk 37', date: '07 Sept - 13 Sept', sales: Math.round(6650 * mult), orders: Math.round(300 * mult) },
      { week: 'Wk 38', date: '14 Sept - 20 Sept', sales: Math.round(6150 * mult), orders: Math.round(275 * mult) },
    ]
  }, [store, selectedPlatform, selectedPeriod])

  const maxWeeklySales = useMemo(() => {
    return Math.max(...weeklyComparisonData.map((d) => d.sales), 1000) * 1.15
  }, [weeklyComparisonData])

  const maxWeeklyOrders = useMemo(() => {
    return Math.max(...weeklyComparisonData.map((d) => d.orders), 50) * 1.15
  }, [weeklyComparisonData])

  // Monthly Comparison dynamic data
  const monthlyComparisonData = useMemo(() => {
    const storeRatio = store === 'Prime Pizza' ? 0.66 : store === 'Smash Burger' ? 0.34 : 1.0
    let platformRatio = 1.0
    if (selectedPlatform === 'Deliveroo') platformRatio = 0.174
    else if (selectedPlatform === 'Just Eat') platformRatio = 0.131
    else if (selectedPlatform === 'Uber Eats') platformRatio = 0.150
    else if (selectedPlatform === 'POS') platformRatio = 0.337
    else if (selectedPlatform === 'Web & App') platformRatio = 0.208

    const mult = storeRatio * platformRatio

    return [
      { month: 'Jun 2026', sales: Math.round(34500 * mult), orders: Math.round(1540 * mult) },
      { month: 'Jul 2026', sales: Math.round(38200 * mult), orders: Math.round(1720 * mult) },
      { month: 'Aug 2026', sales: Math.round(36800 * mult), orders: Math.round(1650 * mult) },
      { month: 'Sept 2026', sales: Math.round(33150 * mult), orders: Math.round(1510 * mult) },
      ...(selectedPeriod.includes('This Month')
        ? [{ month: 'Oct 2026 (MTD)', sales: Math.round(18050 * mult), orders: Math.round(815 * mult) }]
        : []),
    ]
  }, [store, selectedPlatform, selectedPeriod])

  const maxMonthlySales = useMemo(() => {
    return Math.max(...monthlyComparisonData.map((d) => d.sales), 2000) * 1.15
  }, [monthlyComparisonData])

  const maxMonthlyOrders = useMemo(() => {
    return Math.max(...monthlyComparisonData.map((d) => d.orders), 100) * 1.15
  }, [monthlyComparisonData])

  // Filtered Marketing Campaigns
  const filteredOffers = useMemo(() => {
    return DEMO_MARKETING_OFFERS.filter((item) => {
      if (store !== 'Combined' && item.store !== store) return false
      if (selectedPlatform !== 'All Platforms') {
        if (selectedPlatform === 'POS' && !item.platformType.includes('POS')) return false
        if (selectedPlatform === 'Web & App' && !item.platformType.includes('Web & App')) return false
        if (!['POS', 'Web & App'].includes(selectedPlatform) && !item.platformType.toLowerCase().includes(selectedPlatform.toLowerCase())) return false
      }
      return true
    })
  }, [store, selectedPlatform])

  // Filtered Invoices (Controlled by tab, store, and all 4 dropdown filters)
  const filteredInvoices = useMemo(() => {
    let list = SAMPLE_SALES_INVOICES

    // Subtab filter
    if (activeTab === 'invoices_platform') {
      list = list.filter((i) => i.type === 'platform')
    } else if (activeTab === 'invoices_pos') {
      list = list.filter((i) => i.type === 'pos')
    }

    // Store filter
    if (store !== 'Combined') {
      list = list.filter((i) => i.store === store)
    }

    // Platform filter
    if (selectedPlatform !== 'All Platforms') {
      if (selectedPlatform === 'POS') {
        list = list.filter((i) => i.type === 'pos' || i.details.includes('POS'))
      } else if (selectedPlatform === 'Web & App') {
        list = list.filter((i) => i.details.includes('Web') || i.details.includes('App'))
      } else {
        list = list.filter((i) => i.details.toLowerCase().includes(selectedPlatform.toLowerCase()))
      }
    }

    // Status filter
    if (invoiceStatus !== 'All Statuses') {
      list = list.filter((i) => i.status === invoiceStatus)
    }

    // Year filter
    if (invoiceYear !== 'All Years') {
      list = list.filter((i) => i.date.includes(invoiceYear) || i.month.includes(invoiceYear))
    }

    // Month filter
    if (invoiceMonth !== 'All Months') {
      list = list.filter((i) => i.month.toLowerCase().includes(invoiceMonth.toLowerCase()) || i.date.toLowerCase().includes(invoiceMonth.toLowerCase()))
    }

    // Period filter
    if (invoicePeriod === 'This Month (Oct 2026)' || invoicePeriod === 'This Month') {
      list = list.filter((i) => i.month.includes('Oct 2026'))
    } else if (invoicePeriod === 'Last Month (Sep 2026)' || invoicePeriod === 'Last Month') {
      list = list.filter((i) => i.month.includes('Sept 2026'))
    } else if (invoicePeriod === 'Last 4 Weeks') {
      list = list.filter((i) => i.month.includes('Sept 2026') || i.month.includes('Oct 2026'))
    }

    return list
  }, [activeTab, store, selectedPlatform, invoiceStatus, invoicePeriod, invoiceYear, invoiceMonth])

  // Reset top filters
  const resetAllFilters = () => {
    setStore('Combined')
    setSelectedPlatform('All Platforms')
    setSelectedPeriod('All Time')
    triggerToast('Filters reset to consolidated default view.')
  }

  // Reset invoice filters
  const resetInvoiceFilters = () => {
    setStore('Combined')
    setInvoiceStatus('All Statuses')
    setInvoicePeriod('All Time')
    setInvoiceYear('All Years')
    setInvoiceMonth('All Months')
    setSelectedInvoiceIds([])
    triggerToast('Invoice filters reset to default.')
  }

  // Checkbox toggle helpers
  const toggleSelectAllInvoices = () => {
    if (filteredInvoices.length > 0 && filteredInvoices.every((i) => selectedInvoiceIds.includes(i.id))) {
      setSelectedInvoiceIds([])
    } else {
      setSelectedInvoiceIds(filteredInvoices.map((i) => i.id))
    }
  }

  const toggleSelectInvoice = (id: string) => {
    if (selectedInvoiceIds.includes(id)) {
      setSelectedInvoiceIds(selectedInvoiceIds.filter((item) => item !== id))
    } else {
      setSelectedInvoiceIds([...selectedInvoiceIds, id])
    }
  }

  const hasActiveTopFilters = store !== 'Combined' || selectedPlatform !== 'All Platforms' || selectedPeriod !== 'All Time'

  return (
    <div className="min-h-screen bg-transparent text-slate-700 dark:text-slate-200 flex flex-col font-sans selection:bg-[#E5B869] selection:text-black">
      
      {/* ── TOP DEMO CALLOUT BANNER ────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#D9A336] via-[#F5CB6C] to-[#C89B3C] text-black px-3.5 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black">
          <span className="bg-white dark:bg-black text-[#E5B869] text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider shadow">
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
            className="px-3.5 py-1 text-xs font-black bg-white dark:bg-black text-[#E5B869] hover:bg-white/85 dark:hover:bg-black/85 rounded-lg transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
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

        {/* ── SIDEBAR NAVIGATION ────────────────────────────────────────────── */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border-r border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 pt-10' : '-translate-x-full'}`}>
          {/* Sidebar Header */}
          <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-200 dark:border-[#1f2947]">
            <img 
              src="/images/new-logo.jpg" 
              alt="Riznex Logo" 
              className="w-11 h-11 rounded-xl object-contain bg-black dark:bg-white p-1 flex-shrink-0 shadow"
            />
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white text-sm tracking-wide">RIZNEX</div>
              <div className="text-[11px] text-[#E5B869] font-medium leading-tight">The Royal Grill & Lounge</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">Sample Client Demo</div>
            </div>
          </div>

          {/* Sidebar Nav Links */}
          <nav className="flex-1 px-3 py-5 space-y-4 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">
              MENU
            </div>

            {/* 1. Overview Group */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between rounded-xl bg-blue-500/10 border border-blue-500/20">
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
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span>• Main Overview</span>
                </button>
                <button
                  onClick={() => { setActiveTab('weekly_comparison'); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'weekly_comparison' 
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span>• Weekly Comparison</span>
                </button>
                <button
                  onClick={() => { setActiveTab('monthly_comparison'); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'monthly_comparison' 
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span>• Monthly Comparison</span>
                </button>
                <button
                  onClick={() => { setActiveTab('current_offers'); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'current_offers' 
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span>• Current Offers</span>
                </button>
              </div>
            </div>

            {/* 2. Sales Invoices Group */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-slate-200/[0.08] dark:border-white/[0.08]">
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
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span>• All Invoices</span>
                </button>
                <button
                  onClick={() => { setActiveTab('invoices_platform'); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'invoices_platform' 
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span>• Platform Invoices</span>
                </button>
                <button
                  onClick={() => { setActiveTab('invoices_pos'); setSidebarOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'invoices_pos' 
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span>• POS Invoices</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Sidebar Footer with Order CTA */}
          <div className="p-4 border-t border-slate-200 dark:border-[#1f2947] bg-white dark:bg-[#0d1019] space-y-2">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Logged in as <span className="font-bold text-slate-900 dark:text-white">Sample Director</span>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
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
        <main className="flex-1 bg-slate-50 dark:bg-[#0e121b] p-3.5 sm:p-6 lg:p-8 overflow-y-auto pb-48 sm:pb-56">
          
          {/* Top Bar: Mobile Hamburger & Live Date */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/50 dark:border-[#1f2947]/50 lg:border-none">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none text-slate-900 dark:text-white flex items-center gap-2 text-xs font-bold cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              <span>Menu</span>
            </button>
            <div className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
              Wednesday, 14 October 2026
            </div>
          </div>

          {/* Tier 1: Client Header with Brand Badges & Export Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 rounded-xl bg-orange-600/20 border border-orange-500/40 p-1 flex items-center justify-center text-lg font-black text-slate-900 dark:text-white shadow-md">
                  🍕
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-600/20 border border-amber-500/40 p-1 flex items-center justify-center text-lg font-black text-amber-400 shadow-md">
                  🍔
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                  The Royal Grill & Lounge
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Live Demo Sync
                  </span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-0.5 flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-200">{store}</span>
                  <span>•</span>
                  <span>{selectedPeriod}</span>
                  <span>•</span>
                  <span className="text-[#E5B869] font-semibold">{selectedPlatform}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => triggerToast(`Generating consolidated PDF report for ${store} (${selectedPeriod})...`)}
                className="bg-white dark:bg-[#111520] border border-[#E5B869]/40 shadow-sm rounded-xl px-3.5 py-2 text-slate-900 dark:text-white hover:text-[#E5B869] text-xs font-bold transition flex items-center gap-2 cursor-pointer"
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
          <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 mb-6 shadow-md">
            {/* Store Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0b0e17] border border-slate-200 dark:border-[#1f2947] p-1 rounded-xl">
                <button
                  onClick={() => setStore('Combined')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    store === 'Combined' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  Combined
                </button>
                <button
                  onClick={() => setStore('Prime Pizza')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    store === 'Prime Pizza' 
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  Prime Pizza
                </button>
                <button
                  onClick={() => setStore('Smash Burger')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    store === 'Smash Burger' 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  Smash Burger
                </button>
              </div>

              <div className="w-[1px] h-5 bg-slate-200 dark:bg-[#1f2947] hidden sm:block"></div>

              {/* Platform Selector */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-slate-100 dark:bg-[#0b0e17] border border-slate-200 dark:border-[#1f2947] text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-[#E5B869]"
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
                className="bg-slate-100 dark:bg-[#0b0e17] border border-slate-200 dark:border-[#1f2947] text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-[#E5B869]"
              >
                <option value="All Time">All Time</option>
                <option value="This Month (Oct 2026)">This Month (Oct 2026)</option>
                <option value="Last Month (Sep 2026)">Last Month (Sep 2026)</option>
                <option value="Last 4 Weeks">Last 4 Weeks</option>
              </select>

              <button 
                onClick={resetAllFilters}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f2947]/50 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Reset
              </button>
            </div>
          </div>

          {/* Active Filter Chips Strip */}
          {hasActiveTopFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6 text-xs animate-in fade-in duration-200">
              <span className="text-slate-500 font-semibold text-[11px]">Active Filters:</span>
              {store !== 'Combined' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">
                  Store: {store}
                  <button onClick={() => setStore('Combined')} className="hover:text-red-500 cursor-pointer">✕</button>
                </span>
              )}
              {selectedPlatform !== 'All Platforms' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                  Platform: {selectedPlatform}
                  <button onClick={() => setSelectedPlatform('All Platforms')} className="hover:text-red-500 cursor-pointer">✕</button>
                </span>
              )}
              {selectedPeriod !== 'All Time' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  Period: {selectedPeriod}
                  <button onClick={() => setSelectedPeriod('All Time')} className="hover:text-red-500 cursor-pointer">✕</button>
                </span>
              )}
              <button 
                onClick={resetAllFilters}
                className="text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white underline cursor-pointer ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: MAIN OVERVIEW                                                */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'main_overview' && (
            <div className="space-y-6">

              {/* Primary 5 KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-2xl p-4 sm:p-5 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Orders</div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{currentData.orders.toLocaleString()}</div>
                </div>
                <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-2xl p-4 sm:p-5 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Gross Sales</div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{gbp(currentData.grossSales)}</div>
                </div>
                <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-2xl p-4 sm:p-5 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Net Sales</div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{gbp(currentData.netSales)}</div>
                </div>
                <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-2xl p-4 sm:p-5 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Expenses</div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{gbp(currentData.totalExpenses)}</div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-white dark:bg-[#111520] border border-slate-200 dark:border-[#E5B869]/30 rounded-2xl p-4 sm:p-5 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-[#E5B869] uppercase tracking-widest mb-1">Net Profit</div>
                  <div className={`text-2xl sm:text-3xl font-black ${currentData.netProfit >= 0 ? 'text-[#B8860B] dark:text-[#E5B869]' : 'text-rose-600 dark:text-rose-400'}`}>{gbp(currentData.netProfit)}</div>
                </div>
              </div>

              {/* Expense Breakdown Strip — 7 Tiles (Crisp Light/Dark Theme Fix) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2.5">
                <div className="bg-white dark:bg-[#111520] border border-slate-200/80 dark:border-[#1f2947] rounded-xl px-3.5 py-2.5 flex flex-col gap-1 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Franchise & POS</div>
                  <div className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400">{gbp(currentData.franchiseFees)}</div>
                </div>
                <div className="bg-white dark:bg-[#111520] border border-slate-200/80 dark:border-[#1f2947] rounded-xl px-3.5 py-2.5 flex flex-col gap-1 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Utilities</div>
                  <div className="text-sm sm:text-base font-black text-sky-600 dark:text-sky-400">{gbp(currentData.utilities)}</div>
                </div>
                <div className="bg-white dark:bg-[#111520] border border-slate-200/80 dark:border-[#1f2947] rounded-xl px-3.5 py-2.5 flex flex-col gap-1 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Wages</div>
                  <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{gbp(currentData.wages)}</div>
                </div>
                <div className="bg-white dark:bg-[#111520] border border-slate-200/80 dark:border-[#1f2947] rounded-xl px-3.5 py-2.5 flex flex-col gap-1 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Supplier Purchases</div>
                  <div className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400">{gbp(currentData.supplierPurchases)}</div>
                </div>
                <div className="bg-white dark:bg-[#111520] border border-slate-200/80 dark:border-[#1f2947] rounded-xl px-3.5 py-2.5 flex flex-col gap-1 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Marketing</div>
                  <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{gbp(currentData.marketing)}</div>
                </div>
                <div className="bg-white dark:bg-[#111520] border border-slate-200/80 dark:border-[#1f2947] rounded-xl px-3.5 py-2.5 flex flex-col gap-1 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Commissions & Deductions</div>
                  <div className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400">{gbp(currentData.commissions + currentData.otherDeductions)}</div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-white dark:bg-[#111520] border border-slate-200/80 dark:border-[#E5B869]/30 rounded-xl px-3.5 py-2.5 flex flex-col gap-1 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">Total Expenses</div>
                  <div className="text-sm sm:text-base font-black text-purple-600 dark:text-purple-300">{gbp(currentData.totalExpenses)}</div>
                </div>
              </div>

              {/* Two Column Section: Profit Summary (Left) & Platform + Supplier Tables (Right) with Independent Sliders */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Left Column: Profit Summary Waterfall with Independent Slider */}
                <div className="lg:h-[720px] lg:overflow-y-auto custom-scrollbar pr-1 overscroll-contain">
                  <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-3xl p-5 sm:p-7 shadow-md flex flex-col justify-between min-h-full relative overflow-hidden">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 text-sm">
                            💰
                          </span>
                          <h2 className="text-lg font-black text-slate-900 dark:text-white">Profit Summary</h2>
                        </div>
                        <button 
                          onClick={() => setExpandProfitSummary(!expandProfitSummary)} 
                          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                          title={expandProfitSummary ? "Collapse All" : "Expand All"}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={expandProfitSummary ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"}/></svg>
                        </button>
                      </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-700 dark:text-slate-300 font-bold text-base">Gross Sales</span>
                    <span className="text-[#B8860B] dark:text-[#E5B869] font-black text-base">{gbp(currentData.grossSales)}</span>
                  </div>

                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-200 dark:border-[#1f2947] pb-1.5">
                    LESS:
                  </div>

                  <div className="space-y-3.5 flex-1 text-xs">
                    
                    {/* Commissions */}
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Commissions (3rd Parties)</span>
                        <span className="text-red-500 dark:text-red-400 font-bold">-{gbp(currentData.commissions)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 pb-2 mt-1">
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
                        <span className="text-slate-600 dark:text-slate-400">Other Deductions</span>
                        <span className="text-red-500 dark:text-red-400 font-bold">-{gbp(currentData.otherDeductions)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 pb-2 mt-1">
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
                        <span className="text-slate-600 dark:text-slate-400">3rd Party Ad Spends</span>
                        <span className="text-red-500 dark:text-red-400 font-bold">-{gbp(currentData.adSpends)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 pb-2 mt-1">
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
                        <span className="text-slate-600 dark:text-slate-400">Franchise & POS Fees</span>
                        <span className="text-red-500 dark:text-red-400 font-bold">-{gbp(currentData.franchiseFees)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 pb-2 mt-1">
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
                        <span className="text-slate-600 dark:text-slate-400">Marketing</span>
                        <span className="text-red-500 dark:text-red-400 font-bold">-{gbp(currentData.marketing)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 pb-2 mt-1">
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
                        <span className="text-slate-600 dark:text-slate-400">Other Expenses</span>
                        <span className="text-red-500 dark:text-red-400 font-bold">-{gbp(currentData.others)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 pb-2 mt-1">
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
                        <span className="text-slate-600 dark:text-slate-400">Staff Wages</span>
                        <span className="text-red-500 dark:text-red-400 font-bold">-{gbp(currentData.wages)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 pb-2 mt-1">
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
                        <span className="text-slate-600 dark:text-slate-400">Supplier Purchases</span>
                        <span className="text-red-500 dark:text-red-400 font-bold">-{gbp(currentData.supplierPurchases)}</span>
                      </div>
                      {expandProfitSummary && (
                        <div className="pl-3 pt-1 space-y-1 border-b border-slate-200/50 dark:border-[#1f2947]/50 pb-2 mt-1">
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
                        <span className="text-slate-600 dark:text-slate-400">Utilities</span>
                        <span className="text-red-500 dark:text-red-400 font-bold">-{gbp(currentData.utilities)}</span>
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
                </div>

                {/* Net Profit Result */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#E5B869]/20 flex justify-between items-center">
                  <span className="text-[#B8860B] dark:text-[#E5B869] font-black text-lg">= Net Profit</span>
                  <span className="text-[#B8860B] dark:text-[#E5B869] font-black text-xl">{gbp(currentData.netProfit)}</span>
                </div>
              </div>
            </div>

                {/* Right Column: Platform Performance & Supplier Purchases with Independent Slider */}
                <div className="lg:col-span-2 lg:h-[720px] lg:overflow-y-auto space-y-6 custom-scrollbar pr-2 overscroll-contain">

                  {/* Platform Performance Table */}
                  <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-3xl p-5 sm:p-7 shadow-md overflow-hidden">
                    <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                      <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 text-sm">
                          📊
                        </span>
                        Platform Performance
                      </h2>
                      {selectedPlatform !== 'All Platforms' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold">
                            Showing: {selectedPlatform}
                          </span>
                          <button
                            onClick={() => setSelectedPlatform('All Platforms')}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            View All Platforms
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead>
                          <tr className="text-slate-500 dark:text-slate-400 border-b-2 border-slate-200 dark:border-[#1f2947]">
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">Platform</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right">Orders</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right">Sales</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right">Deductions</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right">Ded. %</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right text-slate-900 dark:text-white">Net Received</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#1f2947]">
                          {currentData.platforms.map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                              <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${p.name.includes('Uber') ? 'bg-emerald-400' : p.name.includes('Just Eat') ? 'bg-orange-500' : p.name.includes('Deliveroo') ? 'bg-teal-400' : 'bg-blue-400'}`}></span>
                                {p.name}
                              </td>
                              <td className="py-3 text-slate-600 dark:text-slate-300 text-right">{p.orders.toLocaleString()}</td>
                              <td className="py-3 text-slate-900 dark:text-white text-right font-semibold">{gbp(p.sales)}</td>
                              <td className="py-3 text-red-500 dark:text-red-400 text-right font-medium">-{gbp(p.deductions)}</td>
                              <td className="py-3 text-amber-600 dark:text-amber-400 text-right font-medium">{p.dedPct}</td>
                              <td className="py-3 text-slate-900 dark:text-white text-right font-black">{gbp(p.net)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Supplier Purchases Table */}
                  <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-3xl p-5 sm:p-7 shadow-md overflow-hidden">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-500/20 text-sm">
                        🛒
                      </span>
                      Supplier Purchases
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead>
                          <tr className="text-slate-500 dark:text-slate-400 border-b-2 border-slate-200 dark:border-[#1f2947]">
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">Supplier</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">Category</th>
                            <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right">Total Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#1f2947]">
                          {currentData.suppliers.map((s, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                              <td className="py-3 font-semibold text-slate-900 dark:text-white">{s.name}</td>
                              <td className="py-3 text-slate-500 dark:text-slate-400">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-[10px]">
                                  {s.category}
                                </span>
                              </td>
                              <td className="py-3 text-amber-600 dark:text-amber-400 text-right font-black">{gbp(s.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Sales & Expense Distribution Bars */}
                  <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-3xl p-5 sm:p-7 shadow-md flex flex-col gap-6">
                    
                    {/* Sales Distribution */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                        <span className="flex items-center gap-2">
                          <span>📈</span> Sales Distribution
                        </span>
                        <span className="text-slate-900 dark:text-white font-bold text-xs">{gbp(currentData.grossSales)}</span>
                      </div>

                      <div className="space-y-2.5">
                        {currentData.platforms.map((p, idx) => {
                          const maxSales = Math.max(...currentData.platforms.map((x) => x.sales))
                          const pct = Math.min(100, Math.max(4, (p.sales / (maxSales || 1)) * 100))
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 dark:text-slate-300 font-medium">{p.name}</span>
                                <span className="text-slate-900 dark:text-white font-bold text-xs">{gbp(p.sales)}</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 dark:bg-[#0e121b] rounded-full overflow-hidden border border-slate-200 dark:border-[#1f2947]">
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

                    <div className="border-t border-slate-200 dark:border-[#1f2947]"></div>

                    {/* Expense Distribution */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                        <span className="flex items-center gap-2">
                          <span className="text-amber-500">💸</span> Expense Distribution
                        </span>
                        <span className="text-slate-900 dark:text-white font-bold text-xs">{gbp(currentData.totalExpenses)}</span>
                      </div>

                      <div className="space-y-2.5">
                        {[
                          { name: 'Staff Wages', amount: currentData.wages, color: 'bg-pink-500' },
                          { name: 'Supplier Purchases', amount: currentData.supplierPurchases, color: 'bg-amber-500' },
                          { name: 'Commissions & Deductions', amount: currentData.commissions + currentData.otherDeductions, color: 'bg-purple-500' },
                          { name: 'Franchise & POS', amount: currentData.franchiseFees, color: 'bg-indigo-500' },
                          { name: 'Utilities', amount: currentData.utilities, color: 'bg-sky-400' },
                          { name: 'Marketing & Ads', amount: currentData.marketing + currentData.adSpends, color: 'bg-orange-500' },
                          { name: 'Other Expenses', amount: currentData.others, color: 'bg-slate-400' },
                        ].map((exp, idx) => {
                          const pct = currentData.totalExpenses > 0 ? ((exp.amount / currentData.totalExpenses) * 100).toFixed(1) : '0.0'
                          const widthPct = Math.min(100, Math.max(4, Number(pct)))
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 dark:text-slate-300 font-medium">{exp.name}</span>
                                <span className="text-slate-700 dark:text-slate-200 font-bold text-xs">
                                  {pct}% <span className="text-slate-400 font-normal">({gbp(exp.amount)})</span>
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 dark:bg-[#0e121b] rounded-full overflow-hidden border border-slate-200 dark:border-[#1f2947]">
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
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1f2947] flex-wrap gap-2">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Weekly Comparison</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Audited multi-channel performance by calendar week.</p>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                  {store} • {selectedPlatform} • {selectedPeriod}
                </span>
              </div>

              {/* Dual Bar Chart */}
              <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-3xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    WEEKLY SALES & ORDERS TREND
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Sales (£)
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Orders
                    </span>
                  </div>
                </div>

                <div className="relative h-72 w-full pt-10 pb-8 flex mb-4">
                  {/* Y-axis Labels (Left - Sales) */}
                  <div className="absolute left-0 top-10 bottom-8 flex flex-col justify-between text-[10px] sm:text-xs text-slate-500 font-mono pr-2">
                    <span>{gbp(maxWeeklySales)}</span>
                    <span>{gbp(maxWeeklySales * 0.66)}</span>
                    <span>{gbp(maxWeeklySales * 0.33)}</span>
                    <span>£0</span>
                  </div>
                  
                  {/* Horizontal Grid Lines */}
                  <div className="absolute inset-0 left-12 right-10 top-10 bottom-8 flex flex-col justify-between pointer-events-none">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-full border-t border-slate-200/50 dark:border-white/[0.04]"></div>
                    ))}
                  </div>

                  {/* Y-axis Labels (Right - Orders) */}
                  <div className="absolute right-0 top-10 bottom-8 flex flex-col justify-between text-[10px] sm:text-xs text-slate-500 font-mono pl-2 text-right">
                    <span>{Math.round(maxWeeklyOrders)}</span>
                    <span>{Math.round(maxWeeklyOrders * 0.66)}</span>
                    <span>{Math.round(maxWeeklyOrders * 0.33)}</span>
                    <span>0</span>
                  </div>

                  {/* Bars Container */}
                  <div className="flex-1 ml-12 mr-10 flex items-end justify-around h-full z-10 relative border-b border-slate-200 dark:border-[#1f2947]">
                    {weeklyComparisonData.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                        
                        {/* Bars Area */}
                        <div className="flex items-end justify-center gap-1.5 w-full h-full relative">
                          {/* Sales Bar */}
                          <div className="relative w-4 sm:w-8 flex flex-col items-center justify-end h-full">
                            <div className="absolute -top-6 text-[9px] sm:text-[10px] font-bold text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-700 whitespace-nowrap">
                              {gbp(d.sales)}
                            </div>
                            <div 
                              style={{ 
                                height: mounted ? `${Math.min(100, Math.max(6, (d.sales / maxWeeklySales) * 100))}%` : '0%',
                                transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 80}ms`
                              }}
                              className="w-full bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-md shadow-lg"
                            />
                          </div>

                          {/* Orders Bar */}
                          <div className="relative w-4 sm:w-8 flex flex-col items-center justify-end h-full">
                            <div className="absolute -top-6 text-[9px] sm:text-[10px] font-bold text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-700">
                              {d.orders}
                            </div>
                            <div 
                              style={{ 
                                height: mounted ? `${Math.min(100, Math.max(6, (d.orders / maxWeeklyOrders) * 100))}%` : '0%',
                                transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${(i * 80) + 40}ms`
                              }}
                              className="w-full bg-gradient-to-t from-orange-700 to-orange-400 rounded-t-md shadow-lg"
                            />
                          </div>
                        </div>

                        {/* X-axis Labels */}
                        <div className="absolute -bottom-10 text-center w-full">
                          <div className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-200">{d.week}</div>
                          <div className="text-[8px] sm:text-[9px] text-slate-500 hidden sm:block whitespace-nowrap">{d.date}</div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Donut Visuals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-3xl p-6 shadow-md">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Sales Mix</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full border-[14px] border-slate-100 dark:border-[#1f2947] border-t-blue-500 border-r-emerald-500 border-b-orange-500 border-l-purple-500"></div>
                      <div className="absolute text-center">
                        <div className="text-sm font-black text-slate-900 dark:text-white">{gbp(currentData.grossSales)}</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider">TOTAL SALES</div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs flex-1 w-full">
                      {currentData.platforms.map((p, idx) => {
                        const pct = currentData.grossSales > 0 ? ((p.sales / currentData.grossSales) * 100).toFixed(1) : '0.0'
                        const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-purple-500', 'bg-yellow-500', 'bg-teal-500']
                        return (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`}></span> {p.name}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">{pct}% ({gbp(p.sales)})</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-3xl p-6 shadow-md">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Expense Breakdown</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full border-[14px] border-slate-100 dark:border-[#1f2947] border-t-pink-500 border-r-amber-500 border-b-indigo-500 border-l-sky-500"></div>
                      <div className="absolute text-center">
                        <div className="text-sm font-black text-slate-900 dark:text-white">{gbp(currentData.totalExpenses)}</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider">TOTAL EXPENSES</div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs flex-1 w-full">
                      {[
                        { label: 'Staff Wages', amount: currentData.wages, color: 'bg-pink-500' },
                        { label: 'Supplier Purchases', amount: currentData.supplierPurchases, color: 'bg-amber-500' },
                        { label: 'Franchise & POS', amount: currentData.franchiseFees, color: 'bg-indigo-500' },
                        { label: 'Utilities', amount: currentData.utilities, color: 'bg-sky-400' },
                        { label: 'Marketing & Ads', amount: currentData.marketing + currentData.adSpends, color: 'bg-orange-500' },
                        { label: 'Commissions', amount: currentData.commissions, color: 'bg-purple-500' },
                        { label: 'Others', amount: currentData.others, color: 'bg-slate-400' },
                      ].map((exp, idx) => {
                        const pct = currentData.totalExpenses > 0 ? ((exp.amount / currentData.totalExpenses) * 100).toFixed(1) : '0.0'
                        return (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${exp.color}`}></span> {exp.label}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">{pct}% ({gbp(exp.amount)})</span>
                          </div>
                        )
                      })}
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
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1f2947] flex-wrap gap-2">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Monthly Comparison</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Historical monthly trajectory and consolidated trends.</p>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                  {store} • {selectedPlatform}
                </span>
              </div>

              <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-3xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    MONTHLY SALES & ORDERS TREND
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Sales (£)
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Orders
                    </span>
                  </div>
                </div>

                <div className="relative h-72 w-full pt-10 pb-8 flex mb-4">
                  {/* Y-axis Labels (Left - Sales) */}
                  <div className="absolute left-0 top-10 bottom-8 flex flex-col justify-between text-[10px] sm:text-xs text-slate-500 font-mono pr-2">
                    <span>{gbp(maxMonthlySales)}</span>
                    <span>{gbp(maxMonthlySales * 0.75)}</span>
                    <span>{gbp(maxMonthlySales * 0.50)}</span>
                    <span>{gbp(maxMonthlySales * 0.25)}</span>
                    <span>£0</span>
                  </div>
                  
                  {/* Horizontal Grid Lines */}
                  <div className="absolute inset-0 left-12 right-12 top-10 bottom-8 flex flex-col justify-between pointer-events-none">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-full border-t border-slate-200/50 dark:border-white/[0.04]"></div>
                    ))}
                  </div>

                  {/* Y-axis Labels (Right - Orders) */}
                  <div className="absolute right-0 top-10 bottom-8 flex flex-col justify-between text-[10px] sm:text-xs text-slate-500 font-mono pl-2 text-right">
                    <span>{Math.round(maxMonthlyOrders)}</span>
                    <span>{Math.round(maxMonthlyOrders * 0.75)}</span>
                    <span>{Math.round(maxMonthlyOrders * 0.50)}</span>
                    <span>{Math.round(maxMonthlyOrders * 0.25)}</span>
                    <span>0</span>
                  </div>

                  {/* Bars Container */}
                  <div className="flex-1 ml-12 mr-12 flex items-end justify-around h-full z-10 relative border-b border-slate-200 dark:border-[#1f2947]">
                    {monthlyComparisonData.map((m, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                        
                        {/* Bars Area */}
                        <div className="flex items-end justify-center gap-2.5 w-full h-full relative">
                          {/* Sales Bar */}
                          <div className="relative w-6 sm:w-12 flex flex-col items-center justify-end h-full">
                            <div className="absolute -top-6 text-[9px] sm:text-[11px] font-bold text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-700 whitespace-nowrap">
                              {gbp(m.sales)}
                            </div>
                            <div 
                              style={{ 
                                height: mounted ? `${Math.min(100, Math.max(6, (m.sales / maxMonthlySales) * 100))}%` : '0%',
                                transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 120}ms`
                              }}
                              className="w-full bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-md shadow-lg"
                            />
                          </div>

                          {/* Orders Bar */}
                          <div className="relative w-6 sm:w-12 flex flex-col items-center justify-end h-full">
                            <div className="absolute -top-6 text-[9px] sm:text-[11px] font-bold text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-700">
                              {m.orders}
                            </div>
                            <div 
                              style={{ 
                                height: mounted ? `${Math.min(100, Math.max(6, (m.orders / maxMonthlyOrders) * 100))}%` : '0%',
                                transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${(i * 120) + 60}ms`
                              }}
                              className="w-full bg-gradient-to-t from-orange-700 to-orange-400 rounded-t-md shadow-lg"
                            />
                          </div>
                        </div>

                        {/* X-axis Labels */}
                        <div className="absolute -bottom-10 text-center w-full">
                          <div className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-200">{m.month}</div>
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
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1f2947] flex-wrap gap-2">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Marketing & Offers ROI</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Live tracking of active promotions, cost of sale, and return on ad spend.</p>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                  Showing {filteredOffers.length} campaigns
                </span>
              </div>

              <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-3xl p-5 sm:p-7 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="text-slate-500 dark:text-slate-400 border-b-2 border-slate-200 dark:border-[#1f2947]">
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px]">Start Date</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px]">Platform & Promotion</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Spend</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Orders</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Gross Sales</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Deductions</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Ded %</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right text-slate-900 dark:text-white">Net Sales</th>
                        <th className="pb-3.5 font-bold uppercase tracking-wider text-[11px] text-right">ROI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#1f2947]">
                      {filteredOffers.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-slate-500 dark:text-slate-400">
                            <div className="text-3xl mb-2">🔍</div>
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">No campaigns match "{store} • {selectedPlatform}"</div>
                            <p className="text-xs text-slate-500 mt-1">Try selecting another platform or resetting the filter toolbar.</p>
                            <button
                              onClick={() => { setStore('Combined'); setSelectedPlatform('All Platforms'); }}
                              className="mt-4 px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition cursor-pointer"
                            >
                              Reset Filters
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filteredOffers.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <td className="py-3 text-slate-500 dark:text-slate-400 font-mono">{row.date}</td>
                            <td className="py-3 font-semibold text-slate-900 dark:text-white">
                              <div>{row.platform}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">{row.promo}</div>
                            </td>
                            <td className="py-3 text-slate-500 dark:text-slate-400 text-right">{row.spend}</td>
                            <td className="py-3 text-slate-600 dark:text-slate-300 text-right font-medium">{row.orders}</td>
                            <td className="py-3 text-slate-900 dark:text-white text-right font-semibold">{gbp(row.gross)}</td>
                            <td className="py-3 text-red-500 dark:text-red-400 text-right font-medium">-{gbp(row.ded)}</td>
                            <td className="py-3 text-amber-600 dark:text-amber-400 text-right font-medium">{row.dedPct}</td>
                            <td className="py-3 text-slate-900 dark:text-white text-right font-black">{gbp(row.net)}</td>
                            <td className="py-3 text-emerald-600 dark:text-emerald-400 text-right font-black">{row.roi}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 5, 6, 7: SALES INVOICES (FULL WORKING DYNAMIC SUB-FILTERS)       */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {(activeTab === 'invoices_combined' || activeTab === 'invoices_platform' || activeTab === 'invoices_pos') && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="text-center sm:text-left pb-2 border-b border-slate-200 dark:border-[#1f2947]">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {activeTab === 'invoices_combined' && 'All Sales Invoices'}
                  {activeTab === 'invoices_platform' && 'Platform Invoices'}
                  {activeTab === 'invoices_pos' && 'Prime Pizza & Smash Burger POS Invoices'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {activeTab === 'invoices_combined' && 'Overview of all your POS and delivery platform statements.'}
                  {activeTab === 'invoices_platform' && 'Manage your Uber Eats, Just Eat, and Deliveroo statements.'}
                  {activeTab === 'invoices_pos' && 'Manage invoices from your internal store POS systems.'}
                </p>
              </div>

              {/* Sub-Filter Toolbar (Fully Controlled & Interactive) */}
              <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0b0e17] border border-slate-200 dark:border-[#1f2947] p-1 rounded-xl">
                    <button
                      onClick={() => setStore('Combined')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${store === 'Combined' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Combined
                    </button>
                    <button
                      onClick={() => setStore('Prime Pizza')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${store === 'Prime Pizza' ? 'bg-orange-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Prime Pizza
                    </button>
                    <button
                      onClick={() => setStore('Smash Burger')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${store === 'Smash Burger' ? 'bg-amber-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Smash Burger
                    </button>
                  </div>

                  {/* Status Dropdown */}
                  <select 
                    value={invoiceStatus}
                    onChange={(e) => setInvoiceStatus(e.target.value)}
                    className="bg-slate-100 dark:bg-[#0b0e17] border border-slate-200 dark:border-[#1f2947] text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-[#E5B869]"
                  >
                    <option value="All Statuses">All Statuses</option>
                    <option value="Extracted">Extracted</option>
                    <option value="Pending">Pending</option>
                  </select>

                  {/* Time Range Dropdown */}
                  <select 
                    value={invoicePeriod}
                    onChange={(e) => setInvoicePeriod(e.target.value)}
                    className="bg-slate-100 dark:bg-[#0b0e17] border border-slate-200 dark:border-[#1f2947] text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-[#E5B869]"
                  >
                    <option value="All Time">All Time</option>
                    <option value="This Month (Oct 2026)">This Month (Oct 2026)</option>
                    <option value="Last Month (Sep 2026)">Last Month (Sep 2026)</option>
                    <option value="Last 4 Weeks">Last 4 Weeks</option>
                  </select>

                  {/* Year Dropdown */}
                  <select 
                    value={invoiceYear}
                    onChange={(e) => setInvoiceYear(e.target.value)}
                    className="bg-slate-100 dark:bg-[#0b0e17] border border-slate-200 dark:border-[#1f2947] text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-[#E5B869]"
                  >
                    <option value="All Years">All Years</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                  </select>

                  {/* Month Dropdown */}
                  <select 
                    value={invoiceMonth}
                    onChange={(e) => setInvoiceMonth(e.target.value)}
                    className="bg-slate-100 dark:bg-[#0b0e17] border border-slate-200 dark:border-[#1f2947] text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-[#E5B869]"
                  >
                    <option value="All Months">All Months</option>
                    <option value="Oct 2026">Oct 2026</option>
                    <option value="Sept 2026">Sept 2026</option>
                    <option value="Aug 2026">Aug 2026</option>
                    <option value="Dec 2025">Dec 2025</option>
                  </select>
                </div>

                <button 
                  onClick={resetInvoiceFilters}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f2947]/50 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Reset
                </button>
              </div>

              {/* Batch Selection Banner */}
              {selectedInvoiceIds.length > 0 && (
                <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-2 text-xs">
                  <span className="font-semibold text-blue-600 dark:text-blue-300">
                    {selectedInvoiceIds.length} invoice(s) selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerToast(`Downloading ${selectedInvoiceIds.length} statement files as ZIP...`)}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition cursor-pointer"
                    >
                      Batch Download
                    </button>
                    <button
                      onClick={() => setSelectedInvoiceIds([])}
                      className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}

              {/* Invoices Table */}
              <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/30 rounded-3xl p-5 sm:p-7 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="text-slate-500 dark:text-slate-400 border-b-2 border-slate-200 dark:border-[#1f2947]">
                        <th className="pb-3.5 pr-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={filteredInvoices.length > 0 && filteredInvoices.every((i) => selectedInvoiceIds.includes(i.id))}
                            onChange={toggleSelectAllInvoices}
                            className="rounded bg-white dark:bg-black border-slate-400 dark:border-slate-700 cursor-pointer" 
                          />
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
                    <tbody className="divide-y divide-slate-100 dark:divide-[#1f2947]">
                      {filteredInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                            <div className="text-3xl mb-2">📄</div>
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">No invoices match the selected criteria</div>
                            <p className="text-xs text-slate-500 mt-1">Try broadening your store, status, or date range filters.</p>
                            <button
                              onClick={resetInvoiceFilters}
                              className="mt-4 px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition cursor-pointer"
                            >
                              Reset Invoice Filters
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filteredInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <td className="py-4 pr-3 text-center">
                              <input 
                                type="checkbox" 
                                checked={selectedInvoiceIds.includes(inv.id)}
                                onChange={() => toggleSelectInvoice(inv.id)}
                                className="rounded bg-white dark:bg-black border-slate-400 dark:border-slate-700 cursor-pointer" 
                              />
                            </td>
                            <td className="py-4 font-bold text-slate-900 dark:text-white font-mono">{inv.date}</td>
                            <td className="py-4 text-slate-500 dark:text-slate-400">{inv.week}</td>
                            <td className="py-4 text-slate-500 dark:text-slate-400">{inv.month}</td>
                            <td className="py-4">
                              <div className="font-semibold text-slate-900 dark:text-white">{inv.details}</div>
                              <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                                <span>📎</span> {inv.fileTag}
                              </div>
                            </td>
                            <td className="py-4 text-slate-900 dark:text-white text-right font-black">{gbp(inv.amount)}</td>
                            <td className="py-4 text-center">
                              {inv.status === 'Extracted' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <span>Extracted</span>
                                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[9px] font-black">✓</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                  <span>Pending OCR</span>
                                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-black flex items-center justify-center text-[9px] font-black">⏳</span>
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => setSelectedInvoice(inv)}
                                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                              >
                                View File
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ── IN-DASHBOARD FOOTER ────────────────────────────────────────── */}
          <div className="pt-10 pb-4 border-t border-slate-200/80 dark:border-[#1f2947]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 mt-12">
            <div className="flex items-center gap-2">
              <img src="/images/new-logo.jpg" alt="Riznex Logo" className="w-5 h-5 rounded object-contain" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Riznex Restaurant Intelligence</span>
              <span>• Multi-Brand Client Preview</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Automated Weekly P&L Reconciliation</span>
              <span>•</span>
              <span>POS & Delivery Integrations</span>
            </div>
          </div>

          {/* Bottom margin spacer for sticky banner */}
          <div className="h-28 sm:h-32"></div>
        </main>
      </div>

      {/* ── STICKY BOTTOM HIGH-CONVERSION BANNER (100% CONTRAST FIX) ──────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0B0D14]/95 border-t border-[#E5B869]/40 backdrop-blur-xl px-4 py-3 sm:py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-[#E5B869]/20 border border-[#E5B869]/50 flex items-center justify-center text-[#E5B869] text-base shrink-0 hidden sm:flex shadow-sm">
              ⚡
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Want this exact setup and weekly live reporting for your restaurant?
              </div>
              <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                1st Month complete setup is only <span className="text-[#E5B869] font-bold">£300</span> (Standard £500). Ongoing rolling management is <span className="text-[#E5B869] font-bold">£250/mo</span>.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs text-black bg-gradient-to-r from-[#E5B869] via-[#F3C663] to-[#C89B3C] shadow-lg shadow-[#E5B869]/30 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              Get Started For £300 ➔
            </button>
            <a
              href="/#contact"
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/25 transition-all whitespace-nowrap cursor-pointer text-center"
            >
              Book Walkthrough
            </a>
          </div>
        </div>
      </div>

      {/* ── INVOICE FILE MODAL INSPECTOR ────────────────────────────────────── */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/40 shadow-2xl rounded-3xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center justify-center text-lg">
                🧾
              </span>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">{selectedInvoice.details}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedInvoice.fileTag} • {selectedInvoice.date}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b0e17] border border-slate-200 dark:border-[#1f2947] space-y-2 mb-4 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Assigned Brand:</span> <span className="text-slate-900 dark:text-white font-semibold">{selectedInvoice.store}</span></div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Billing Week:</span> <span className="text-slate-900 dark:text-white font-semibold">{selectedInvoice.week}</span></div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Extraction Status:</span> 
                <span className={`font-bold ${selectedInvoice.status === 'Extracted' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                  {selectedInvoice.status === 'Extracted' ? 'Verified 100% Extracted' : 'Under OCR Extraction Review'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/10">
                <span>Reconciled Payout:</span> 
                <span className="text-amber-600 dark:text-amber-400 font-black text-sm">{gbp(selectedInvoice.amount)}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-6 bg-slate-100/60 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/[0.05]">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">OCR Verification Summary:</div>
              <div>• Gross sales matched with delivery platform portal payout.</div>
              <div>• Deductions itemized into commissions and marketing fees.</div>
              <div>• Ready for weekly executive P&L statement export.</div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => { triggerToast(`Statement ${selectedInvoice.fileTag} downloaded.`); setSelectedInvoice(null); }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111520] border border-[#E5B869]/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowOrderModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#E5B869]/20 border border-[#E5B869]/40 flex items-center justify-center text-[#E5B869] text-xl mb-4">
              ⚡
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white">Start With Phase 1 (£300)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
              Get your custom dashboard setup, delivery menus optimized, and first automated weekly P&L within 7 days.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Restaurant Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Royal Spice Grill London" 
                  className="w-full bg-slate-50 dark:bg-[#0b0e17] border border-slate-200 dark:border-[#1f2947] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E5B869]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Your Name & Phone / WhatsApp</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe (+44 7123 456789)" 
                  className="w-full bg-slate-50 dark:bg-[#0b0e17] border border-slate-200 dark:border-[#1f2947] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E5B869]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/447392683935?text=Hello%20Riznex,%20I%20tested%20your%20live%20demo%20dashboard%20and%20want%20to%20order%20the%20%C2%A3300%20setup%20package."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-black text-xs text-black bg-gradient-to-r from-[#E5B869] to-[#C89B3C] shadow-lg shadow-[#E5B869]/20 hover:scale-[1.02] active:scale-[0.98] transition text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Instant Setup via WhatsApp (£300)</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <Link
                href="/#contact"
                onClick={() => setShowOrderModal(false)}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-center transition"
              >
                Or Submit Contact Form
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST MESSAGE ──────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-slate-900 dark:bg-[#111520] text-white border border-[#E5B869]/60 text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-[#E5B869] font-bold">✔</span>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  )
}
