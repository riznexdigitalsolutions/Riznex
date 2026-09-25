const fs = require('fs');
let content = fs.readFileSync('app/api/invoices/[id]/ocr/route.ts', 'utf8');

// 1. Ensure Hungry Birds ignores the old Herbies Gemini Prompt
content = content.replace(
  /const isHungryBirdsPosPdf = \(invoice\.type === "pos" && invoice\.fileType === "pdf" && invoice\.platform\?\.includes\("Hungry Birds"\)\) \|\| isBankStatementPdf;/g,
  'const isHungryBirdsPosPdf = (invoice.type === "pos" && (invoice.platform?.includes("Hungry Birds") || invoice.platform?.includes("Online Web"))) || isBankStatementPdf;'
);

// 2. Allow Hungry Birds regex to run on images, not just PDFs
content = content.replace(
  /\/\/ --- POS PARSING FOR PDF ---\r?\n\s*if \(invoice\.type === "pos" && invoice\.fileType === "pdf" && !geminiData\) \{/g,
  '// --- POS PARSING FOR PDF AND IMAGES ---\n      if (invoice.type === "pos" && !geminiData) {'
);

fs.writeFileSync('app/api/invoices/[id]/ocr/route.ts', content, 'utf8');
console.log('Successfully updated OCR to support Hungry Birds images.');