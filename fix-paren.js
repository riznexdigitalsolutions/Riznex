const fs = require('fs');

let lines = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8').split('\n');

// Find the line with the Marketing div and add the closing parenthesis if missing
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('{!is2025 && (')) {
    // the div closes at i+3 (which is line 388)
    if (!lines[i+3].includes(')}')) {
      lines.splice(i+3, 0, '          )}');
    }
    break;
  }
}

fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', lines.join('\n'), 'utf8');
console.log('Fixed missing parenthesis.');