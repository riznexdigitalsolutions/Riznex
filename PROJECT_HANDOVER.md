# Project Handover & Master Context Document

> **Notice for Any AI Agent Resuming Work in this Codebase:**
> This document contains the full context, architectural rules, recent fixes, and current active status of the RestaurantIQ dashboard. When beginning a new session or switching accounts, read this file to understand the exact state of the project.

---

## 1. Locked Production Systems & Scope Rules (from AGENTS.md)

1. **HUNGRY BIRDS IS 100% COMPLETED & LOCKED:**
   - Client ID: `client-1`
   - Fully audited, verified, and locked in production.
   - **STRICT RULE:** You are strictly forbidden from modifying, altering, deleting, or refactoring ANY files, components, API routes, or database records related to Hungry Birds unless explicitly instructed by the user.
2. **HENLEY SYSTEM (Active):**
   - Client ID: `cmpv4dvik0000vdj089wl6zmf`
   - Multi-store setup: "Herbies Pizza" and "Tasty Bun" (+ "Combined").
3. **STRICT SCOPE BOUNDARIES:**
   - Always keep system logic, database records, and component states strictly isolated between Hungry Birds and Henley.
   - Never make cross-system "preventative" fixes or bulk edits that touch a locked system.

---

## 2. Infrastructure & Repositories

- **Active Workspace Directory:** `E:\Sales Software\restaurant-dashboard`
- **Git Repository:** `C:\Users\syedq\Documents\GitHub\Riznex` (branch `main`)
- **Git Binary Path on this Machine:** `C:\Users\syedq\AppData\Local\GitHubDesktop\app-3.6.6\resources\app\git\cmd\git.exe`
- **Node/NPM on this Machine:** `C:\Program Files\nodejs\node.exe`, `C:\Program Files\nodejs\npm.cmd`
- **Database:** Remote MySQL hosted on Hostinger (`77.37.35.173:3306`), managed with Prisma ORM (`prisma/schema.prisma`).
- **Production Server:** Deployed on Hostinger; updates are pushed to GitHub repository `main` branch.

---

## 3. Key Components & Architecture

- **Dashboard Layout:** `app/dashboard/layout.tsx`
- **Sales:** `app/dashboard/sales/HenleySales.tsx`, `HungryBirdsSales.tsx`
- **Expenses:** `app/dashboard/expenses/HenleyExpenses.tsx`, `HenleyExpensesDashboard.tsx`
- **Suppliers:** `app/dashboard/expenses/suppliers/HenleySuppliers.tsx`, `HungryBirdsSuppliers.tsx`
- **Invoices & OCR:** `app/dashboard/invoices/HenleyInvoices.tsx`, `HungryBirdsInvoices.tsx`
- **OCR API Route:** `app/api/invoices/[id]/ocr/route.ts`
- **Invoices API Route:** `app/api/invoices/route.ts`, `app/api/invoices/[id]/route.ts`

---

## 4. Recent Critical Fixes (October 2026)

### A. Uber Eats PDF OCR Fix & Resilience
- **File:** `app/api/invoices/[id]/ocr/route.ts`
- **Date Range Parsing:**
  - Added support for single-month date ranges (e.g., `Oct 5 – 11, 2026`). Previously, regex failed when only one month was printed.
  - Added support for UK formats (`5 – 11 Oct, 2026`), cross-month formats, and filename date fallbacks (e.g. `Tasty Bun Uber Eat Oct 11.pdf` resolves to week ending Sunday 11 October 2026).
- **Prisma Invalid Date Crash Prevention:**
  - Wrapped Prisma `findFirst` and range queries in strict `isValidDate(d)` guards to prevent Prisma runtime exceptions (`Invalid Date provided`).
- **Gemini Fallback:**
  - If cloud Gemini AI returns `401/403` auth errors, the route gracefully falls back to local PDF text extraction instead of crashing.
- **Gross Sales vs Payout:**
  - Prioritized `Gross Sales` over `Earnings` to ensure net payout is never misassigned as gross sales.
- **1-Click Retry Button:**
  - Added a `Retry 🔄` button next to `Failed ❌` in `HenleyInvoices.tsx` and `HungryBirdsInvoices.tsx`.

### B. Add Invoice & Add Supplier Modal Redesign
- **File:** `app/dashboard/expenses/suppliers/HenleySuppliers.tsx`
- **Problem Fixed:** The modal had hardcoded dark navy backgrounds (`bg-[#161b2c]`) with black text (`text-slate-900`), making inputs and placeholders invisible in light mode.
- **Fix Applied:**
  - Solid card containers: `bg-white dark:bg-[#111625] border-slate-200 dark:border-amber-500/30`.
  - Responsive inputs and dropdowns: `bg-slate-50 dark:bg-[#161b2c] border-slate-300 dark:border-[#1f2947] text-slate-900 dark:text-white`.
  - Dropzone: `bg-slate-50/80 dark:bg-[#161b2c]/50 border-slate-300 dark:border-[#2d3b5e]` with high-contrast text.
  - High-contrast buttons and date input `[color-scheme:light] dark:[color-scheme:dark]`.

---

## 5. Current Task & Next Steps

- **Ready State:** The user is ready to upload the **last 2 weeks of invoice data** (Uber Eats, Just Eat, Deliveroo, Supplier invoices).
- **Workflow:**
  1. Upload invoices via the dashboard (`/dashboard/invoices` or `/dashboard/expenses/suppliers`).
  2. Invoices will automatically run through the enhanced OCR pipeline.
  3. If any invoice previously failed or shows an error, click the **`Retry 🔄`** button.
  4. Ensure all changes to code are synced between `C:\Users\syedq\Documents\GitHub\Riznex` and `E:\Sales Software\restaurant-dashboard`, verified with `npm run build`, and pushed to GitHub `origin main`.
