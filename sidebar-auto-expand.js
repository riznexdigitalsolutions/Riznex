const fs = require('fs');
const path = 'app/dashboard/layout.tsx';
let content = fs.readFileSync(path, 'utf8');

// Auto-expand Overview if on /dashboard exactly
content = content.replace(
  `pathname.startsWith('/dashboard/2025') ? '2025 Audit' : null`,
  `pathname === '/dashboard' ? 'Overview' : pathname.startsWith('/dashboard/2025') ? '2025 Audit' : null`
);

content = content.replace(
  `else if (pathname.startsWith('/dashboard/expenses')) setExpandedMenu('Expenses')`,
  `else if (pathname.startsWith('/dashboard/expenses')) setExpandedMenu('Expenses')\n    else if (pathname === '/dashboard') setExpandedMenu('Overview')`
);

// Fix highlighting for overview tab
content = content.replace(
  `|| (!currentTab && (subTab === 'combined' || subTab === 'all'))`,
  `|| (!currentTab && (subTab === 'combined' || subTab === 'all' || subTab === 'overview'))`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Sidebar Auto-Expand Fixed.');