const fs = require('fs');
const lines = fs.readFileSync('app/api/invoices/[id]/ocr/route.ts', 'utf8').split('\n');
for(let i=285; i<=295; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}