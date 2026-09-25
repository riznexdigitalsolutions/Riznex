const fs = require('fs');
const lines = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8').split('\n');
for (let i = lines.length - 100; i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}