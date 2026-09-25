const fs = require('fs');
const path = 'app/dashboard/layout.tsx';
let content = fs.readFileSync(path, 'utf8');

const clientMenuTarget = `if (role === 'client') {
    return [{ href: '/dashboard', icon: '📊', label: 'Overview' }]
  }`;

const clientMenuReplace = `if (role === 'client') {
    return [{ 
      href: '/dashboard', 
      icon: '📊', 
      label: 'Overview',
      subItems: [
        { href: '/dashboard?tab=overview', label: 'Main Overview' },
        { href: '/dashboard?tab=weekly', label: 'Weekly Comparison' },
        { href: '/dashboard?tab=monthly', label: 'Monthly Comparison' },
        { href: '/dashboard?tab=offers', label: 'Current Offers' }
      ]
    }]
  }`;

const adminMenuTarget = `return [
    { href: '/dashboard', icon: '📊', label: 'Overview' },
    { 
      href: '/dashboard/sales', `;

const adminMenuReplace = `return [
    { 
      href: '/dashboard', 
      icon: '📊', 
      label: 'Overview',
      subItems: clientName === 'Hungry Birds' ? undefined : [
        { href: '/dashboard?tab=overview', label: 'Main Overview' },
        { href: '/dashboard?tab=weekly', label: 'Weekly Comparison' },
        { href: '/dashboard?tab=monthly', label: 'Monthly Comparison' },
        { href: '/dashboard?tab=offers', label: 'Current Offers' }
      ]
    },
    { 
      href: '/dashboard/sales', `;

content = content.replace(clientMenuTarget, clientMenuReplace);
content = content.replace(adminMenuTarget, adminMenuReplace);

fs.writeFileSync(path, content, 'utf8');
console.log('Sidebar Menu Updated.');