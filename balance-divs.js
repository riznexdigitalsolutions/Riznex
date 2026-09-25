const fs = require('fs');
let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

const openDivs = (content.match(/<div/g) || []).length;
const closeDivs = (content.match(/<\/div>/g) || []).length;

console.log(`Open: ${openDivs}, Close: ${closeDivs}, Diff: ${openDivs - closeDivs}`);
if (openDivs !== closeDivs) {
  if (openDivs > closeDivs) {
    const diff = openDivs - closeDivs;
    content = content.replace('    </div>\n  )', '    </div>\n' + '    </div>\n'.repeat(diff) + '  )');
    console.log('Added ' + diff + ' missing close divs');
  } else {
    // Too complex to safely auto-remove, but we can try
    console.log('Too many close divs!');
  }
  fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content, 'utf8');
} else {
  console.log('BALANCED!');
}