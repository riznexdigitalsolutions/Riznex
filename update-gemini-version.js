const fs = require('fs');
let content = fs.readFileSync('app/api/invoices/[id]/ocr/route.ts', 'utf8');

content = content.replace(/gemini-2\.5-flash/g, 'gemini-3.6-flash');

fs.writeFileSync('app/api/invoices/[id]/ocr/route.ts', content, 'utf8');
console.log('Successfully updated the Gemini model version.');