# 🏛️ MASTER AGENT HANDOVER & ARCHITECTURE MANUAL
**Project:** Riznex Digital Solutions (`restaurant-dashboard`)  
**Last Updated:** October 2026  
**Target Audience:** Incoming AI Agents (Google DeepMind / Antigravity / Cursor / Claude) & Developers  

---

## 📌 1. EXECUTIVE SUMMARY & BUSINESS CONTEXT

**Riznex Digital Solutions** is a B2B restaurant management and financial analytics platform operating in the UK.  
It provides end-to-end digital operations for independent & multi-location restaurants, synchronizing delivery aggregators (Uber Eats, Just Eat, Deliveroo), managing social media marketing, digitizing OCR supplier invoices, calculating staff payroll, and generating automated weekly consolidated P&L (Profit & Loss) statements.

### Key Technology Stack:
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5, React 19
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`) with native CSS `@theme` and `@keyframes` in `app/globals.css`
- **State & Theme:** `next-themes` (Light / Dark mode toggle), React hooks
- **Database & ORM:** MySQL via Prisma ORM (`@prisma/client`)
- **Authentication:** NextAuth.js (`next-auth`) with bcryptjs credential hashing
- **Reporting & Exporting:** `jspdf`, `html2canvas`, `html-to-image`, `xlsx`
- **OCR / Document Processing:** `tesseract.js`, `pdf-parse`, `pdf-lib`

---

## 🚨 2. STRICT SYSTEM RULES: LOCKED PRODUCTION CODE

> [!CAUTION]
> **READ CAREFULLY BEFORE TOUCHING ANY CODE:**
> This repository contains live, client-facing production systems. Violating these rules will corrupt client data and break production contracts.

1. **HUNGRY BIRDS IS 100% LOCKED (`client-1`):**  
   - Files: `app/dashboard/HungryBirdsDashboard.tsx`, `app/dashboard/expenses/HungryBirds*.tsx`, `app/dashboard/sales/HungryBirdsSales.tsx`, etc.
   - Status: Fully audited, verified, and in production use.
   - **RULE:** **DO NOT** edit formulas, P&L mathematics, supplier categorization, commission algorithms, or database queries. Only styling updates are permitted **if and only if** explicitly requested by the user.

2. **HENLEY IS 100% LOCKED (`cmpv4dvik0000vdj089wl6zmf`):**  
   - Files: `app/dashboard/HenleyDashboard.tsx`, `app/dashboard/expenses/Henley*.tsx`, `app/dashboard/sales/HenleySales.tsx`, etc.
   - Status: Verified and completed.
   - **RULE:** Off-limits unless the user explicitly names "Henley" and asks for a specific change.

3. **NEVER TOUCH PASSWORDS OR SENSITIVE DB CONFIGS:**  
   - Do **NOT** modify password records, encryption hashes, `.env`, or `.env.production`.
   - Never reset user accounts during development or testing.

4. **PRESERVE ALL MATHEMATICAL FORMULAS:**  
   - Calculations for Net Sales, Platform Commissions, VAT, Staff Wages, Supplier Costs, and Net Profit take-home must **NEVER** be altered.

---

## 🎨 3. DESIGN SYSTEM & THEME TOKENS (THE RIZNEX STANDARD)

The user has explicitly defined the brand aesthetic: **Ultra-Premium, Minimalist Luxury, Glassmorphic Gold, Black, and White.**

### Color Palette:
- **Primary Gold Accent:** `#E5B869` / `#D1A041` / `#B8860B`
- **Light Theme Background:** Soft cream with warm light accents (`/images/light_luxury_bg.jpg`)
- **Dark Theme Background:** Deep obsidian black with glowing gold ribbons (`/images/dark_luxury_bg.jpg`)
- **Text:** High-contrast `text-slate-900` in light mode, `text-white` in dark mode
- **Prohibited:** **NO RAINBOW / NEON COLORS.** Fluorescent pinks, purples, and cyans have been systematically removed. Net profits and primary badges use gold; all other secondary numbers use neutral slate/white.

### Global Dynamic Background:
- Injected once in `app/layout.tsx` at `-z-50 pointer-events-none`.
- Contains two absolute layers with a 700ms crossfade between light and dark modes:
  - Light mode: `/images/light_luxury_bg.jpg`
  - Dark mode: `/images/dark_luxury_bg.jpg`
- Overlaid with a subtle frosted glaze (`bg-white/50 dark:bg-[#07080B]/60 backdrop-blur-[1px]`) to guarantee 100% text legibility.
- Root layouts and section containers use `bg-transparent` so the dynamic background flows seamlessly across the entire page.

### Signature Premium Glassmorphism Class:
Whenever creating or updating cards, boxes, modules, or panels, use this exact Tailwind class string:
```css
bg-gradient-to-r from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none
```
For sidebars:
```css
bg-gradient-to-b from-black/[0.04] dark:from-white/[0.04] via-[#E5B869]/10 to-black/[0.04] dark:to-white/[0.04] border-r border-[#E5B869]/30 shadow-xl shadow-black/40 dark:shadow-none
```

---

## 📄 4. APPLICATION ROUTES & RECENT ARCHITECTURAL WORK

### 1. Landing Page (`app/page.tsx`):
- **Hero Title:** `"You run the restaurant. We manage the growth behind the scenes."`
- **Live Performance Hub:** Interactive preview card demonstrating consolidated weekly metrics.
- **Client Logos Marquee:**
  - Logos: Hungry Birds (`/images/clients/hungry-birds-new.png`), Taste of Tandoori (`/images/clients/taste-of-tandoori-new.png`), Tasty Bun (`/images/clients/tasty-bun-new.png`), The Best Fry (`/images/clients/the-best-fry-new.png`).
  - Animation: Seamless continuous horizontal scrolling (`animate-[marquee_25s_linear_infinite]` defined in `globals.css`).
  - Styling: Borderless floating logos with grayscale `opacity-60`, which pause and pop into full color with a subtle lift on hover (`group-hover:[animation-play-state:paused]`).
- **Pricing Packages Grid (4 Plans):**
  - **Plans 1, 2, 3 (Core Packages):** Styled with the rich diagonal gold gradient:  
    `bg-gradient-to-br from-[#E5B869]/20 via-transparent to-[#E5B869]/10 border-2 border-[#E5B869]/60 shadow-2xl shadow-[#E5B869]/25`
  - **Plan 4 ("Build Your Own Package" / Custom):** Styled with a clean, flat minimalist slate theme to stand out as custom:  
    `bg-slate-100 dark:bg-[#111520] border border-slate-200 dark:border-white/10 shadow-lg`

### 2. Client Dashboards (`app/dashboard/...`):
- `app/dashboard/layout.tsx`: Root dashboard shell with sticky header, sidebar, and client context.
- `app/dashboard/page.tsx`: Dynamically routes to the authenticated client's dashboard (`HungryBirdsDashboard` or `HenleyDashboard`).
- Sub-routes: `/sales`, `/expenses`, `/expenses/suppliers`, `/expenses/wages`, `/expenses/marketing`, `/expenses/utilities`, `/invoices`, `/reports`, `/settings`, `/2025/...`.

### 3. Authentication & Admin:
- **Client Login:** `app/client-login/page.tsx` (Authenticates restaurant clients with full light/dark mode support).
- **Admin Login:** `app/login/page.tsx` & `app/admin/AdminClientPage.tsx` (Reverted back to clean original layout in commit `8ff2a34` with comprehensive light & dark mode support and readable high-contrast text).
- **Admin Dashboard:** `app/admin/page.tsx` & `app/admin/layout.tsx` (Client onboarding, database navigation with golden brand theme applied to 'Back to Databases' button and standalone main menus).
- **Live Demo Page:** `app/demo/page.tsx` (Public walkthrough with realistic UK restaurant delivery metrics; linked as bold CTA in the top navbar per commit `078da6a`).

---

## 🕒 4.1 LATEST COMMITS SUMMARY (REFERENCE)
- `8ff2a34`: Revert login and admin client pages back to original style with comprehensive light/dark mode contrast fixes.
- `078da6a`: Remove 'Explore Live Demo' button from hero copy to streamline header; highlight as bold in top navbar.
- `62a3c97`: Fix unreadable white text on login page in light mode.
- `737c830`: Apply golden brand theme (`#E5B869`) to 'Back to Databases' admin button.
- `524e096`: Apply golden brand theme to all standalone main menus and eliminate layout shift.
- `ef52677`: Injected global luxury dynamic background in `layout.tsx` and applied gold glassmorphism across all core cards.
- `266a223`: Replaced client logos with 4 high-res logos in continuous infinite marquee animation.


## 🛠️ 5. GIT & DEPLOYMENT WORKFLOW

### Remotes:
- **Primary Remote:** `collab`  
  URL: `https://github.com/riznexdigitalsolutions/Riznex.git`
- **Secondary / Upstream:** `origin`  
  URL: `https://github.com/smar-ai/Riznex.git`

### Standard Push Procedure:
> [!IMPORTANT]
> Always verify TypeScript compilation before committing, and always push to **`collab main`**.
```bash
# 1. Check for TypeScript errors
npx tsc --noEmit

# 2. Stage modified files
git add <modified-files>

# 3. Commit with standard conventional commits
git commit -m "style: describe exact changes"

# 4. Push directly to collab
git push collab main
```

*(Note: In local Windows environments, `npm run build` may occasionally time out when fetching Google Inter fonts due to external network restrictions. Use `npx tsc --noEmit` as the definitive type and syntax verification).*

---

## 💡 6. CRITICAL TIPS FOR INCOMING AGENTS

1. **Windows PowerShell Quoting Pitfalls:**  
   PowerShell `-replace` can corrupt JSX strings containing brackets, backticks, or multiline comments. When performing surgical multi-line replacements in TSX files, prefer writing a dedicated Node.js script (using `fs.readFileSync` and `fs.writeFileSync`) rather than complex inline PowerShell commands.
2. **Tailwind CSS v4 Configuration:**  
   This project uses Tailwind CSS v4. There is **no** `tailwind.config.js`. Custom keyframes (such as `@keyframes marquee`) and theme variables are defined directly inside `app/globals.css`.
3. **Respecting User Directives:**  
   The user values clear visual feedback, minimal colors (Gold, White, Black), fast delivery, and strict preservation of existing dashboard functionalities. Always confirm what has been changed and pushed.

---

**End of Handover Manual.**  
*Refer to `AGENTS.md` for strict production locks.*
