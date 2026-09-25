const fs = require('fs');
let content = fs.readFileSync('app/api/invoices/[id]/ocr/route.ts', 'utf8');

// 1. Re-route Online Web images to Gemini (by NOT setting isHungryBirdsPosPdf to true for Online Web images)
content = content.replace(
  /const isHungryBirdsPosPdf = \(invoice\.type === "pos" && \(invoice\.platform\?\.includes\("Hungry Birds"\) \|\| invoice\.platform\?\.includes\("Online Web"\)\)\) \|\| isBankStatementPdf;/g,
  'const isHungryBirdsPosPdf = (invoice.type === "pos" && invoice.fileType === "pdf" && (invoice.platform?.includes("Hungry Birds") || invoice.platform?.includes("Online Web"))) || isBankStatementPdf;'
);

// 2. Add the Online Web prompt to Gemini
const newPromptLogic = `
          const isTastyBun = invoice.platform?.includes("Tasty Bun") || false;
          const isOnlineWeb = invoice.platform?.includes("Online Web") || false;
  
          let prompt = "";
          if (invoice.type === "supplier") {
            prompt = \`You are an invoice data extractor. Analyse this supplier/wholesale invoice and extract the financial data.
            
  Return ONLY a valid JSON object with exactly these fields. Use null if a value is missing:
  {
    "invoiceDate": "YYYY-MM-DD",
    "totalVat": 0,
    "totalAmount": 0
  }
  
  IMPORTANT:
  - Extract the FINAL TOTAL AMOUNT of the invoice. This is the most critical field. It is usually at the bottom next to "TOTAL" or "Amount Due" or "Total GBP Incl. VAT" or "Invoice Total".
  - Extract the Invoice Date (not the Due Date).
  - Use British format for ambiguous dates (e.g. 15-07-26 means 15th July 2026, NOT July 26th 2015).
  - If the image is cut off or a value isn't found, output 0 for numbers.
  - For missing dates, use null.
  - DO NOT use markdown formatting, ONLY return JSON.\`;
          } else if (invoice.type === "pos") {
            if (isOnlineWeb) {
              prompt = \`You are an invoice data extractor. Analyse this "Online Web" order list image and extract the financial data.
  Find every order row. For each row, extract the date ("Place on [Date]") and the total amount ("Total. £[Amount]").
  Group the orders by week. Assume weeks end on Sunday 11:59PM.
  
  Return ONLY a valid JSON object matching exactly this format:
  {
    "isHungryBirdsMultiWeek": true,
    "webWeeklySales": [
      {
        "weekStart": "YYYY-MM-DDT12:00:00Z",
        "weekEnd": "YYYY-MM-DDT12:00:00Z",
        "totalOrders": 0,
        "grossSales": 0.00
      }
    ],
    "invoiceDate": "YYYY-MM-DDT12:00:00Z",
    "grossSales": 0.00,
    "totalOrders": 0
  }
  
  IMPORTANT:
  - Extract the exact Date from "Place on ..." and the exact Amount from "Total. £...".
  - Group all extracted orders into their correct weekly buckets (Monday to Sunday).
  - "invoiceDate" should be the latest date found.
  - "grossSales" and "totalOrders" at the root should be the sum of all weeks.
  - Return ONLY JSON. No markdown, no markdown blocks, no code blocks.\`;
            } else {
              prompt = isTastyBun 
`;

content = content.replace(
  /const isTastyBun = invoice\.platform\?\.includes\("Tasty Bun"\) \|\| false;\s+let prompt = "";\s+if \(invoice\.type === "supplier"\) \{[\s\S]*?\} else if \(invoice\.type === "pos"\) \{\s+prompt = isTastyBun/m,
  newPromptLogic
);

fs.writeFileSync('app/api/invoices/[id]/ocr/route.ts', content, 'utf8');
console.log('Successfully updated OCR to use Gemini for Online Web images.');