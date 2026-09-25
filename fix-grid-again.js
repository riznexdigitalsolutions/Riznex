const fs = require('fs');
const path = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `<div className={activeTab === 'overview' ? 'block' : 'hidden'}>`,
  `<div className={activeTab === 'overview' || !activeTab ? 'flex flex-col gap-8' : 'hidden'}>`
);

fs.writeFileSync(path, content, 'utf8');
console.log('KPI Layout fixed.');