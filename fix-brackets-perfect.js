const fs = require('fs');
let content = fs.readFileSync('app/api/invoices/[id]/ocr/route.ts', 'utf8');

// There is still a syntax error because of how if/else are nested.
// Let's completely rewrite the entire logic block for prompt assignment to ensure perfectly matching brackets.
const regex = /let prompt = "";[\s\S]*?- Return ONLY the JSON, no markdown, no explanation.\`;\s*\}\s*\}\s*\} else \{\s*prompt = \`You are an invoice data extractor. Analyse this Uber Eats[\s\S]*?- Return ONLY the JSON, no markdown, no explanation.\`;\s*\}/;

const correctCode = `let prompt = "";
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
  } else if (isTastyBun) {
    prompt = \`You are an invoice data extractor. Analyse this Tasty Bun "Aggregators Sales by Channel" report and extract the financial data.

Return ONLY a valid JSON object with these fields (use null or 0 if not found):
{
  "dateRange": "DD/MM/YYYY - DD/MM/YYYY",
  "andromedaPOS": { "sales": 0, "orders": 0 },
  "androweb": { "sales": 0, "orders": 0 },
  "app": { "sales": 0, "orders": 0 }
}

IMPORTANT:
- "dateRange" must be explicitly extracted from the top right corner.
- Extract ONLY the "Sales" and "Orders" rows for "Andromeda POS", "Androweb", and "APP". 
- IGNORE ALL OTHER CHANNELS (like Uber Eats, Just Eat, Total, etc.).
- All monetary values should be positive numbers.
- Return ONLY the JSON, no markdown, no explanation.\`;
  } else {
    prompt = \`You are an invoice data extractor. Analyse this POS report and extract ALL financial data. 

Return ONLY a valid JSON object with these fields (use null or 0 if not found):
{
  "dateTill": "YYYY-MM-DD",
  "s4dRegister": { "gross": 0, "net": 0 },
  "consumerApp": { "gross": 0, "net": 0 },
  "website": { "gross": 0, "net": 0 },
  "salesGross": 0,
  "salesNet": 0,
  "ordersDelivery": 0,
  "ordersInStore": 0,
  "receipts": {
    "cash": 0,
    "pdq": 0,
    "webCard": 0
  },
  "expenses": {
    "oneStop": 0,
    "petrol": 0,
    "wages": 0,
    "other": 0
  },
  "isTastyBunAndromeda": false,
  "andromedaPOS": { "sales": 0, "orders": 0 },
  "androweb": { "sales": 0, "orders": 0 },
  "app": { "sales": 0, "orders": 0 }
}

IMPORTANT: 
- "dateTill" should be the Week Ending date on the report.
- If the report has a "Sales per channel report" table, YOU MUST extract the "Total" Net and "Total" Gross for "S4D Register", "ConsumerApp", and "Website". DO NOT SKIP THIS.
- Extract "ordersDelivery" and "ordersInStore" from the Order Amount row at the top.
- Extract any expenses listed (like One Stop, Petrol Money, Wages, etc.). If an expense isn't listed, put 0.
- If the invoice contains "Aggregators Sales by Channel", it is a Tasty Bun Andromeda report. You MUST set "isTastyBunAndromeda" to true, and extract the Net Sales (Sales £) and Orders for "Andromeda POS", "Androweb", and "APP" into the respective objects.
- All monetary values should be numbers.
- Return ONLY the JSON, no markdown, no explanation.\`;
  }
} else {
  prompt = \`You are an invoice data extractor. Analyse this Uber Eats / food delivery platform invoice screenshot and extract ALL financial data. 

Return ONLY a valid JSON object with these fields (use null if not found):
{
  "weekStart": "YYYY-MM-DD",
  "weekEnd": "YYYY-MM-DD",
  "totalOrders": number,
  "customers": number,
  "grossSales": number,
  "commission": number,
  "vat": number,
  "otherFees": number,
  "adSpends": number,
  "topRankFee": number,
  "offersOnItems": number,
  "offerRedemptionFee": number,
  "refunds": number,
  "netPaid": number
}

IMPORTANT:
- IF IT IS AN UBER EATS INVOICE: Use "Sales" as grossSales. "Marketplace fee" = commission. "VAT on marketplace fee" = vat. MUST extract "Offers on items" (or Promotions) and "Offer redemption fee". Extract "Adjustments" or "Refunds" into refunds. Extract "Miscellaneous payments/deductions" into otherFees. "Total payout" = netPaid.
- IF IT IS A JUST EAT INVOICE: Must extract "totalOrders". grossSales = "Total sales" value (usually found lower down), netPaid = "You will receive from Just Eat" value. DO NOT mix these up. You MUST ONLY extract 3 deductions: "commission", "adSpends" (Top Rank / Promoted placement / Sponsored / Ads), and "otherFees". If you see an "Admin Fee", "Delivery fee", or ANY other random deduction, you MUST bundle it into "otherFees". If there is a "Rebate" or credit, you must SUBTRACT it from "otherFees" (so otherFees = total random deductions - rebates). Top Rank and Promoted fees strictly go into "adSpends".
- IF IT IS A DELIVEROO INVOICE: totalOrders = number of orders (usually under "Total Orders"). grossSales = "Total Order Value", netPaid = "Total payable". For commission, extract the TOTAL "Deliveroo Commission" (Net + VAT). Put any "Marketer", "Ads", "Promoted", or "Sponsored" fees into "adSpends". Put any "Top Rank" fees into "topRankFee". Put all other "Additional Fees" into "otherFees", and "Additional Payments" into "otherPayments".
- CRITICAL MATH RULE: For Just Eat, the system requires that (grossSales - commission - adSpends - vat - cashOrders - otherFees) EXACTLY equals netPaid. You MUST bundle Admin Fee and all other unlisted deductions into "otherFees", and net them against any Rebates (e.g. 50 deduction - 10 rebate = 40 otherFees) to make this equation balance perfectly. For Uber Eats, use the full equation: (grossSales - commission + vatRoundingAdj - adSpends - topRankFee - adminFee - otherFees - offersOnItems - offerRedemptionFee + refunds) = netPaid. For Deliveroo: (grossSales - commission - adSpends - topRankFee - otherFees + otherPayments) EXACTLY equals netPaid. You MUST put the exact remainder of "Additional Fees" into "otherFees" to make this equation perfectly balance.
- Return ONLY the JSON, no markdown, no explanation.\`;
}`;

if (content.includes('let prompt = "";')) {
  content = content.replace(regex, correctCode);
  fs.writeFileSync('app/api/invoices/[id]/ocr/route.ts', content, 'utf8');
  console.log('Successfully applied the perfect structural replacement.');
} else {
  console.log('Failed to find block');
}