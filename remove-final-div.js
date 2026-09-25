const fs = require('fs');
let lines = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8').split('\n');

for(let i=lines.length-1; i>=0; i--) {
  if (lines[i].includes('  )')) {
    lines.splice(i-1, 1); // Remove the div immediately before it
    break;
  }
}

fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', lines.join('\n'), 'utf8');
console.log('Removed final div');