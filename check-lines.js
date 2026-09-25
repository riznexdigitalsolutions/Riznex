const fs = require('fs');
let lines = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8').split('\n');
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('animate-spin')) {
    console.log(`${i+1}: ${lines[i]}`);
    console.log(`${i+2}: ${lines[i+1]}`);
    console.log(`${i+3}: ${lines[i+2]}`);
    console.log(`${i+4}: ${lines[i+3]}`);
  }
}