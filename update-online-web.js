const fs = require('fs');

// 1. Update HungryBirdsSales.tsx dropdowns
let hbSales = fs.readFileSync('app/dashboard/sales/HungryBirdsSales.tsx', 'utf8');
if (hbSales.includes('<option value="pos_sales" className="bg-[#111520] text-white">POS Sales</option>')) {
  hbSales = hbSales.replace(
    '<option value="pos_sales" className="bg-[#111520] text-white">POS Sales</option>',
    '<option value="pos_sales" className="bg-[#111520] text-white">POS Sales</option>\n            <option value="online_web" className="bg-[#111520] text-white">Online Web</option>'
  );
}
// For the filter dropdown:
if (hbSales.includes('{ value: \'pos_sales\', label: \'POS Sales\' }')) {
  hbSales = hbSales.replace(
    '{ value: \'pos_sales\', label: \'POS Sales\' }',
    '{ value: \'pos_sales\', label: \'POS Sales\' },\n  { value: \'online_web\', label: \'Online Web\' }'
  );
} else if (hbSales.includes('<option value="pos_sales">POS Sales</option>')) { // old filter style? wait
}
fs.writeFileSync('app/dashboard/sales/HungryBirdsSales.tsx', hbSales, 'utf8');


// 2. Update utils.ts for labels and colors
let utils = fs.readFileSync('lib/utils.ts', 'utf8');
if (utils.includes('cash: \'Cash\',')) {
  utils = utils.replace('cash: \'Cash\',', 'cash: \'Cash\',\n    online_web: \'Online Web\',');
}
if (utils.includes('cash: \'#fbbf24\',')) {
  utils = utils.replace('cash: \'#fbbf24\',', 'cash: \'#fbbf24\',\n    \'Online Web\': \'#0ea5e9\',');
}
fs.writeFileSync('lib/utils.ts', utils, 'utf8');

// 3. Update API route map
let apiRoute = fs.readFileSync('app/api/sales/route.ts', 'utf8');
if (apiRoute.includes('pos_sales: \'POS\',')) {
  apiRoute = apiRoute.replace('pos_sales: \'POS\',', 'pos_sales: \'POS\',\n    online_web: \'Online Web\',');
}
fs.writeFileSync('app/api/sales/route.ts', apiRoute, 'utf8');

// 4. Update OCR route to use 'Online Web' instead of 'Hungry Birds Website'
let ocrRoute = fs.readFileSync('app/api/invoices/[id]/ocr/route.ts', 'utf8');
if (ocrRoute.includes('\'Hungry Birds Website\'')) {
  ocrRoute = ocrRoute.replace('\'Hungry Birds Website\'', '\'Online Web\'');
}
fs.writeFileSync('app/api/invoices/[id]/ocr/route.ts', ocrRoute, 'utf8');

console.log('UI files, utility files, API routes, and OCR parser successfully updated to support Online Web.');