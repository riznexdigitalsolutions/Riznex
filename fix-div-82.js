const fs = require('fs');
let lines = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8').split('\n');
lines.splice(81, 1); // Remove line 82 (index 81)
fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', lines.join('\n'), 'utf8');
console.log('Removed bad div at line 82');