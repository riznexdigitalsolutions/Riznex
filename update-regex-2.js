const fs = require('fs');
let content = fs.readFileSync('app/api/invoices/[id]/ocr/route.ts', 'utf8');

// Find the exact line and replace it
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const regex = /Total[.\\s:]*')) {
    lines[i] = '        const regex = /Total[.\\s:A££]*([\\d,.]+)(?:[\\s\\S]{0,50}?)Place[d]?\\s*on\\s*(\\d{1,2}\\s*[A-Za-z]{3,9}\\s*\\d{4})(?:[\\s\\S]{0,30}?(Yesweb))?/gi;';
  }
}

fs.writeFileSync('app/api/invoices/[id]/ocr/route.ts', lines.join('\n'), 'utf8');
console.log('Successfully updated OCR regex with lines.');