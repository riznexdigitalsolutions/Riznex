const fs = require('fs');
const lines = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8').split('\n');
for(let i=350; i<420; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}