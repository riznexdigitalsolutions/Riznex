const fs = require('fs');
let content = fs.readFileSync('app/dashboard/invoices/HungryBirdsInvoices.tsx', 'utf8');

// 1. Add to the filter dropdowns (there are two dropdowns, one for 'all' and one for 'pos')
content = content.replace(
  /<option value="POS" className="bg\[#111520\] text-blue-400 font-bold">.*? POS Sales<\/option>/g,
  '<option value="POS" className="bg-[#111520] text-blue-400 font-bold">POS Sales</option>\n                  <option value="Online Web" className="bg-[#111520] text-sky-400 font-bold">🌐 Online Web</option>'
);

// 2. Add to the upload modal 'Select Statement Source' dropdown
content = content.replace(
  /<option value="POS Sales">POS Sales<\/option>/,
  '<option value="POS Sales">POS Sales</option>\n                    <option value="Online Web">Online Web</option>'
);

fs.writeFileSync('app/dashboard/invoices/HungryBirdsInvoices.tsx', content, 'utf8');
console.log('Successfully updated HungryBirdsInvoices.tsx');