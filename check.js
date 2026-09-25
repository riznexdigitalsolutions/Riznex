const fs = require('fs');
const content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');
const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('END VISUAL DASHBOARD'));
for(let i=startIdx-10; i<=startIdx+5; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}