const fs = require('fs');
const file = 'app/api/invoices/[id]/ocr/route.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace the duplicate may:4
const badLine = 'const monthsMap: Record<string, number> = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11, january:0, february:1, march:2, april:3, may:4, june:5, july:6, august:7, september:8, october:9, november:10, december:11 };';
const goodLine = 'const monthsMap: Record<string, number> = { jan:0, feb:1, mar:2, apr:3, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11, january:0, february:1, march:2, april:3, may:4, june:5, july:6, august:7, september:8, october:9, november:10, december:11 };';

content = content.replace(badLine, goodLine);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed duplicate may property');