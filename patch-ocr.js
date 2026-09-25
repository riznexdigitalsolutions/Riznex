const fs = require('fs');
const file = 'app/api/invoices/[id]/ocr/route.ts';
let content = fs.readFileSync(file, 'utf8');

const targetLine = 'if (lines[i].includes("US Bank Europe Dac") || lines[i].includes("EMS") || lines[i].includes("Card Transaction")) {';
const replacement = 'if (lines[i].includes("US Bank Europe Dac")) {';

if (content.includes(targetLine)) {
  content = content.replace(targetLine, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log('SUCCESS: Patched OCR route to only fetch US Bank Europe Dac.');
} else {
  console.log('ERROR: Target line not found.');
}