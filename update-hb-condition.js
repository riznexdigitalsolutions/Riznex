const fs = require('fs');
let content = fs.readFileSync('app/api/invoices/[id]/ocr/route.ts', 'utf8');

content = content.replace(
  /if \(invoice\.platform\?\.includes\("Hungry Birds"\)\) \{/g,
  'if (invoice.platform?.includes("Hungry Birds") || invoice.platform?.includes("Online Web")) {'
);

fs.writeFileSync('app/api/invoices/[id]/ocr/route.ts', content, 'utf8');