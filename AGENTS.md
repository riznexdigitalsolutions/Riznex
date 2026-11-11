# SYSTEM RULES & CLIENT GUIDELINES

**INSTRUCTIONS FOR ALL AI AGENTS:**

1. **ALL CLIENTS ACTIVE & EDITABLE:** All client systems, including **Hungry Birds** (`client-1`) and **Henley on Thames** (`cmpv4dvik0000vdj089wl6zmf`), are unlocked and open for editing, maintenance, refactoring, and enhancements across the entire codebase as requested by the user.
2. **MAINTAIN DATA INTEGRITY & CLIENT CONTEXT:**
   - Always ensure system logic, database records, and component states remain clean and accurate for each client.
   - Respect each client's specific stores, platforms, commission structures, and data sources.
3. **PRODUCTION-READY QUALITY:** Always verify builds (`npm run build`), test database interactions, and ensure clean commits before pushing changes to `main`.
4. **SUPPLIER INVOICE EXTRACTION RULE:**
   - When uploading / extracting any supplier invoice on the website, ONLY extract and save:
     1. **Total Invoice Amount (inclusive of VAT)**
     2. **Invoice Date**
   - Do NOT read, parse, or store anything else (no line items, no customer/staff info, no extra fields). Keep it strictly to total amount and invoice date.
5. **UK DATE PARSING & SAFEGUARD RULE:**
   - All restaurant receipts, supplier invoices, POS reports, and statements operate strictly under UK Date Format: `DD/MM/YYYY` (Day/Month/Year).
   - NEVER parse UK dates in US format (e.g., `04/11/2026` is strictly 4th November 2026, NEVER 11th April 2026). The first number is always DAY and the second is MONTH.
   - All OCR prompts, parsing logic, and automated scripts must explicitly enforce UK date ordering and cross-verify against filename month indicators.
6. **WEEK-ENDING SNAPPING & MONTHLY ALIGNMENT:**
   - Operating weeks snap to Sunday week-ending (`weekEnd`).
   - Overview metrics and Monthly Comparison sheets must always group by `weekEnd` so that monthly order counts and sales amounts match to the exact penny across all screens.
