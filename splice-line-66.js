const fs = require('fs');
let lines = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8').split('\n');
lines.splice(65, 1);
fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', lines.join('\n'), 'utf8');
console.log('Removed line 66');