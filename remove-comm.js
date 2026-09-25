const fs = require('fs');
let content = fs.readFileSync('app/api/invoices/[id]/ocr/route.ts', 'utf8');

content = content.replace(
  /await processWeeklyData\(ocrData\.webWeeklySales, 'Online Web', 0\.085\);/g,
  'await processWeeklyData(ocrData.webWeeklySales, \'Online Web\', 0.0);'
);

fs.writeFileSync('app/api/invoices/[id]/ocr/route.ts', content, 'utf8');
console.log('Successfully removed the 8.5% commission rate for Online Web.');