const fs = require('fs');
const file = 'app/dashboard/sales/HungryBirdsSales.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = 'setForm(EMPTY_FORM)\n    fetchSales()\n  }';
const replacement = 'setForm(EMPTY_FORM)\n    fetchSales(session?.user?.role === \'admin\' ? \'client-1\' : session?.user?.clientId, filter, activeTab)\n  }';

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log('SUCCESS: Fixed fetchSales crash in handleSave');
} else {
  console.log('ERROR: Target string not found (2nd try)');
}