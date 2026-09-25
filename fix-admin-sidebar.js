const fs = require('fs');
const path = 'app/dashboard/layout.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the Admin Overview item
const regexAdmin = /\{\s*href:\s*'\/dashboard',\s*icon:\s*'[^']+',\s*label:\s*'Overview'\s*\}/g;

content = content.replace(regexAdmin, `{ 
    href: '/dashboard', 
    icon: '📊', 
    label: 'Overview',
    subItems: [
      { href: '/dashboard?tab=overview', label: 'Main Overview' },
      { href: '/dashboard?tab=weekly', label: 'Weekly Comparison' },
      { href: '/dashboard?tab=monthly', label: 'Monthly Comparison' },
      { href: '/dashboard?tab=offers', label: 'Current Offers' }
    ]
  }`);

fs.writeFileSync(path, content, 'utf8');
console.log('Admin Sidebar Fixed.');