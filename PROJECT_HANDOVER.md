# Project Handover & Master Context Document

> **Notice for Any AI Agent Resuming Work in this Codebase:**
> This document contains the full context, architectural rules, recent fixes, and current active status of the RestaurantIQ dashboard. When beginning a new session or switching accounts, read this file to understand the exact state of the project.

---

## 1. System Rules & Client Scope Guidelines (from AGENTS.md)

1. **ALL CLIENTS ACTIVE & EDITABLE:**
   - All client systems, including **Hungry Birds** (`client-1`) and **Henley on Thames** (`cmpv4dvik0000vdj089wl6zmf`), are open and unlocked for editing, refactoring, bug fixing, and enhancements across the entire codebase as needed.
2. **DATA INTEGRITY & CLIENT CONTEXT:**
   - Always ensure system logic, database records, and component states remain accurate for each client.
   - Respect each client's unique store configuration, platforms, commission models, and data sources.
3. **PRODUCTION QUALITY STANDARDS:**
   - Verify builds (`npm run build`), test database interactions, and ensure clean commits before pushing changes to `main`.

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
- **Henley Dashboard:** `app/dashboard/HenleyDashboard.tsx`
- **Hungry Birds Dashboard:** `app/dashboard/HungryBirdsDashboard.tsx`
- **Platform Filter Component:** `components/MultiPlatformFilter.tsx`
- **Sales:** `app/dashboard/sales/HenleySales.tsx`, `HungryBirdsSales.tsx`
- **Sales API Route:** `app/api/sales/route.ts`
- **Reports API Route:** `app/api/reports/route.ts`
- **Expenses:** `app/dashboard/expenses/HenleyExpenses.tsx`, `HenleyExpensesDashboard.tsx`
- **Suppliers:** `app/dashboard/expenses/suppliers/HenleySuppliers.tsx`, `HungryBirdsSuppliers.tsx`
- **Invoices & OCR:** `app/dashboard/invoices/HenleyInvoices.tsx`, `HungryBirdsInvoices.tsx`
- **OCR API Route:** `app/api/invoices/[id]/ocr/route.ts`
- **Invoices API Route:** `app/api/invoices/route.ts`, `app/api/invoices/[id]/route.ts`
- **Shared Utilities & Platform Color/Labels:** `lib/utils.ts`

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

### C. Hungry Birds POS Sales -> Online Web Migration & Walk-in Card Full Reconciliation
- **POS Sales to Online Web:**
  - Migrated historical records from `POS Sales` to `Online Web`.
  - Merged September POS records into matching `Online Web` records and removed empty POS entries.
  - `POS Sales` records in DB: **0**.
  - Updated UI filters in `HungryBirdsDashboard.tsx`, `HungryBirdsSales.tsx`, and `HungryBirdsInvoices.tsx` to replace `POS Sales` with `Online Web`.
- **Order History Web Reconciliation:**
  - Reconciled all online web orders against customer PayPal order history statements.
  - Reconciled week 21 Sep – 27 Sep to 6 valid orders (£161.88), properly excluding 2 cancelled orders.
  - Added week ending 11 Oct 2026 (£59.41, 2 orders).
- **Walk-in Card Reconciliation (May to September):**
  - Verified 149 daily transactions from US Bank Europe DAC payouts statement.
  - All 22 consecutive weeks of Walk-in Card are a 100% exact penny match.

### D. Tasty Bun Direct Channels Separation & Elimination of Merged `Web & App` (October 15, 2026)
- **User Training & Requirement:**
  - The user explicitly trained the system to keep **Tasty Bun Website** and **Tasty Bun Mobile App** as two distinct channels from Andromeda POS reports (`Androweb` = Website, `APP` = Mobile App, `Andromeda POS` = In-store POS).
  - The synthetic channel `Tasty Bun Web & App` was rejected by the user.
- **Database Schema Fix:**
  - `Invoice.ocrData` was defined as `VARCHAR(191)` in MySQL, which had silently truncated JSON strings.
  - Executed `ALTER TABLE Invoice MODIFY ocrData LONGTEXT;` directly on Hostinger MySQL database.
  - Updated `prisma/schema.prisma` with `ocrData String? @db.Text` in both repositories.
- **Database `Sale` Records Migration:**
  - Deleted all 28 combined `Tasty Bun Web & App` records from the `Sale` table (`0` remaining in database).
  - Inserted 28 distinct records for **`Tasty Bun Website`** (Total: **£9,287.30**, **388 orders**, flat 4.0% commission).
  - Inserted 28 distinct records for **`Tasty Bun Mobile App`** (Total: **£4,238.29**, **155 orders**, flat 4.0% commission).
  - Verified 28 existing records for **`Tasty Bun POS`** (Total: **£9,929.10**, **820 orders**).
  - Updated `Invoice.ocrData` for all 28 weekly Andromeda invoices with the full JSON payload.
- **Code & UI Changes:**
  - [`app/api/invoices/[id]/ocr/route.ts`](file:///e:/Sales%20Software/restaurant-dashboard/app/api/invoices/[id]/ocr/route.ts): Creates separate `${storeName} Website` and `${storeName} Mobile App` records on OCR parse.
  - [`app/api/reports/route.ts`](file:///e:/Sales%20Software/restaurant-dashboard/app/api/reports/route.ts): Filters and aggregates `Tasty Bun Website` and `Tasty Bun Mobile App` independently without combining them into `Web & App`.
  - [`app/api/sales/route.ts`](file:///e:/Sales%20Software/restaurant-dashboard/app/api/sales/route.ts): `platformMap` maps `Tasty Bun Website` -> `Tasty Bun Website` and `Tasty Bun Mobile App` -> `Tasty Bun Mobile App`. Filters each individually.
  - [`components/MultiPlatformFilter.tsx`](file:///e:/Sales%20Software/restaurant-dashboard/components/MultiPlatformFilter.tsx): Platform dropdown strictly lists: `Deliveroo`, `Just Eat`, `Uber Eats`, `Herbies POS`, `Herbies Web & App`, `Tasty Bun POS`, `Tasty Bun Website`, `Tasty Bun Mobile App`. `Tasty Bun Web & App` removed.
  - [`app/dashboard/HenleyDashboard.tsx`](file:///e:/Sales%20Software/restaurant-dashboard/app/dashboard/HenleyDashboard.tsx): Updated `HENLEY_COMBINED_PLATFORMS`, `TASTY_BUN_PLATFORMS`, and `CHANNEL_ORDER` to use `Tasty Bun Website` and `Tasty Bun Mobile App`. Removed `Tasty Bun Web & App`.
  - [`app/dashboard/sales/HenleySales.tsx`](file:///e:/Sales%20Software/restaurant-dashboard/app/dashboard/sales/HenleySales.tsx): Platform options list `Tasty Bun Website` and `Tasty Bun Mobile App`.
  - [`lib/utils.ts`](file:///e:/Sales%20Software/restaurant-dashboard/lib/utils.ts): `platformLabel`, `platformColor`, and `PLATFORMS` list `Tasty Bun Website` and `Tasty Bun Mobile App`. Removed `Tasty Bun Web & App`.
- **Independent Filtering Verification:**
  - Filtering by `Tasty Bun Website` only: Returns 28 weeks, **£9,287.30**, **388 orders**.
  - Filtering by `Tasty Bun Mobile App` only: Returns 28 weeks, **£4,238.29**, **155 orders**.
  - Filtering by `Tasty Bun POS` only: Returns 28 weeks, **£9,929.10**, **820 orders**.
  - Filtering both or any combination works seamlessly across all sales tables, cards, and charts.

### E. Hungry Birds Fixed Expenses Duplicate Warning & Overwrite (October 15, 2026)
- **User Requirement:** When generating auto-fill fixed expenses for Hungry Birds, if records already exist for that week, display a clear warning/alert stating that fixed expenses for this week have already been generated/updated (matching the duplicate detection behavior in Henley).
- **Backend Fix (`app/api/expenses/auto-fill-hungry-birds/route.ts`):**
  - Snaps `targetDate` to `weekStart` (Monday 00:00:00) and `weekEnd` (Sunday 23:59:59.999).
  - Performs authoritative duplicate check across `staffWage`, `invoice` (`fileType: 'auto'`), `expense`, and `sale` (`Walk In Cash`) for `clientId: 'client-1'` within that week.
  - If records exist and `overwrite` is not requested: Returns HTTP 400 with `{ alreadyExists: true, error: 'You have already auto-filled your fixed costs for this week (Week ending Sunday ...)! If you need to regenerate them, please delete the existing ones first.' }`.
  - If `overwrite: true`: Safely cleans up the existing auto-generated records for that week and cleanly recreates them, returning a success message.
- **Frontend Fix (`app/dashboard/expenses/HungryBirdsExpensesDashboard.tsx`):**
  - In `handleAutoFill(forceOverwrite = false)`: If `data.alreadyExists`, displays a confirmation prompt:
    `⚠️ Notice: Fixed expenses already generated!\n\n${data.error}\n\nDo you want to overwrite and re-update fixed expenses for this week?`
    If user confirms OK, calls auto-fill with `overwrite: true`. If cancelled, aborts safely without altering data.
  - In the Auto-Fill Modal:
    - Added live calculation showing `🗓️ Snapping to: Week ending Sunday, DD MMM YYYY (YYYY-MM-DD)`.
    - Added inline warning badge if fixed expenses for the selected week are already loaded in the dashboard view.

### F. Hungry Birds Walk-in Card Sales & Invoices Added for 04-Oct and 11-Oct (October 15, 2026)
- **User Requirement:** Reconcile and add missing Walk-in Card sales from the uploaded Tide bank statement PDFs for Hungry Birds (`client-1`) and link them as sales invoices.
- **Data Extracted Directly from Tide PDF Statements:**
  - **Week Ending 04 Oct 2026 (28 Sep – 04 Oct):** 7 daily US Bank Europe Dac transfers totaling **£1,194.58** (28 Sep £145.41, 29 Sep £79.89, 30 Sep £199.72, 1 Oct £119.35, 2 Oct £155.89, 3 Oct £203.54, 4 Oct £290.78).
  - **Week Ending 11 Oct 2026 (05 Oct – 11 Oct):** 7 daily US Bank Europe Dac transfers totaling **£1,262.07** (5 Oct £193.48, 6 Oct £139.35, 7 Oct £146.65, 8 Oct £198.15, 9 Oct £93.90, 10 Oct £182.36, 11 Oct £308.18).
- **Records Created & Linked:**
  - Created 2 `Invoice` records (`type: 'pos'`, `platform: 'Walk-in Card'`, amounts £1,194.58 and £1,262.07).
  - Stored PDFs in `public/uploads/client-1/` with full daily transfer JSON breakdown in `ocrData`.
  - Created 2 `Sale` records (`platform: 'Walk In Card'`, `store: 'Hungry Birds'`) linked via `invoiceId`.
  - Invoices appear in the Sales Invoices tab ("Hungry Birds Direct (Card, Cash & Online Web)" and "Combined Sales Invoices Data"), and sales reflect on the Sales and Overview Dashboards.

### G. Offers & Campaigns Card Simplification (October 15, 2026)
- **User Requirement:** Too much design and overdone nested boxes in the Offers & Campaigns view. Simplify the card design to display offers with clean bullet points across Hungry Birds, Henley, and Admin.
- **Component Updated (`components/OffersCampaignView.tsx`):**
  - Removed the 3 heavy nested colored gradient boxes (`% Off Offer`, `Others (All Offers Under)`, `Top Rank`) and inner pill wrappers.
  - Replaced with a clean, streamlined bulleted list inside each card for both the 4-card platform grid (`All Platforms`) and the focused single-platform view.
  - Shared across **Hungry Birds**, **Henley**, and **Admin**.

### H. Herbies Pizza Just Eat Live Offers & Removal of Henley Edit Buttons (October 16, 2026)
- **Herbies Pizza Just Eat Offers Updated:**
  - Configured live Just Eat campaign details for Herbies Pizza (Henley, `cmpv4dvik0000vdj089wl6zmf`) from September onwards (`2026-09-07`):
    - **Top Rank:** `Top Rank £30 per day (Postcode-wise)`
    - **StampCard:** `StampCard: Active`
    - **Discounts:** `• 40% off £25 (Just Eat selected customers)` and `• 30% off Herbies Original Pizzas`
    - **Deals:** `• Free Drinks on £30 Spend`
- **Removal of Edit Buttons from Henley Dashboard:**
  - Removed the repetitive and cluttered footer edit buttons (`✎ Edit (Store)`) from the 4-card platform grid in `components/OffersCampaignView.tsx`.
  - Configured `isAdmin={false}` for `OffersCampaignView` inside `app/dashboard/HenleyDashboard.tsx` to keep the Henley offers view purely read-only, clean, and unencumbered.

### I. Single Platform Offer Box & 6-Week Chart Redesign (October 16, 2026)
- **User Requirement:** When selecting a specific platform (e.g. Deliveroo, Uber Eats, Just Eat):
  - Do NOT use separate 3 columns inside the platform box.
  - Left Side: Single, compact bulleted list of active offers (discounts, top rank, items).
  - Right Side: Offer active date (e.g. `7 Sept 2026`) and total sales generated by the offer from that date to present (`£X,XXX`).
  - Bar Chart Underneath: Capped to up to the **most recent 6 weeks** if active for 6 weeks or more.
  - Apply across all clients (**Hungry Birds**, **Henley on Thames**) and **Admin**.
- **Component Updated (`components/OffersCampaignView.tsx`):**
  - Updated `renderPlatformGrid` for `isSingle`: Replaced the 3-column layout with a responsive 2-side layout (left 7 cols: active bullets; right 5 cols: active date + total sales generated + total orders count).
  - Filtered total sales and orders from `earliestStartDate` of active campaign to present with safe fallback.
  - Updated `renderWeeklyChart`: Set chart slicing to `activeData.slice(-6)` and filtered by offer start date when applicable.
  - Subtitles updated to reflect the most recent 6 weeks.
  - **Runtime Fix:** Fixed a `ReferenceError` where `useMemo` hooks (`currentEarliestDate`, `previousEarliestDate`) were called prior to `getPlatformDetails` declaration. Moved hooks to immediately follow `getPlatformDetails`.

---

## 5. Current Task & System Status

- **System Status:** 100% operational, fully verified with Next.js (`npm run build` completed with 0 errors), committed, and pushed to `main` branch.
- **All Clients Active & Open:** Both **Hungry Birds** (`client-1`) and **Henley on Thames** (`cmpv4dvik0000vdj089wl6zmf`) are actively supported, editable, and maintained.
- **Workflow for Future Updates:**
  1. Make edits in `E:\Sales Software\restaurant-dashboard`.
  2. Sync modified files to `C:\Users\syedq\Documents\GitHub\Riznex` using `scratch/copy-files.js`.
  3. Run `npm run build` in `Riznex` to verify type safety and compilation.
  4. Commit and push to GitHub `origin main`. Hostinger production server pulls directly from `main`.
