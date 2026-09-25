const fs = require('fs');
const path = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the generic block with the flex layout to restore the spacing
content = content.replace(
  `<div className={activeTab === 'overview' ? 'block' : 'hidden'}>`,
  `<div className={activeTab === 'overview' || !activeTab ? 'flex flex-col gap-8' : 'hidden'}>`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Flex layout restored on wrapper div.');