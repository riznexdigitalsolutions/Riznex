const fs = require('fs');
let lines = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8').split('\n');

// Find the last line that has `  )`
for(let i=lines.length-1; i>=0; i--) {
  if (lines[i].includes('  )')) {
    lines.splice(i, 0, '    </div>');
    break;
  }
}

fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', lines.join('\n'), 'utf8');
console.log('Appended final div securely.');