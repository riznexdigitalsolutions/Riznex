const fs = require('fs');
const file = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace ResponsiveContainer 99% with hardcoded 100% and height 300
content = content.replace(/<ResponsiveContainer width="99%" height="99%">/g, '<ResponsiveContainer width="100%" height={300}>');

fs.writeFileSync(file, content, 'utf8');
console.log('Forced absolute height on Recharts');