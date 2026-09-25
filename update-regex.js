const fs = require('fs');
let content = fs.readFileSync('app/api/invoices/[id]/ocr/route.ts', 'utf8');

content = content.replace(
  /\/Total\[\.\\s:\]\*A\(\[\\d,\.\]\+\)\(\?\:\[\\s\\S\]\{0,50\}\?\)/g,
  '/Total[.\\s:A£]*([\\d,.]+)(?:[\\s\\S]{0,50}?)/'
);

fs.writeFileSync('app/api/invoices/[id]/ocr/route.ts', content, 'utf8');
console.log('Successfully updated OCR regex.');