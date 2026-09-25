const fs = require('fs');
let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

// First, fix the loading block double div by splitting it out safely
const brokenLoadingBlock = `
  if (loading && !report) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-2 border-[#1f2947] border-t-blue-500 rounded-full animate-spin" />
    </div>
    </div>
  )
`;
const fixedLoadingBlock = `
  if (loading && !report) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-2 border-[#1f2947] border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
`;
content = content.replace(brokenLoadingBlock.trim(), fixedLoadingBlock.trim());

// Now append the missing div AT THE ABSOLUTE END of the file just before the last )
const openDivs = (content.match(/<div/g) || []).length;
const closeDivs = (content.match(/<\/div>/g) || []).length;

console.log(`Open: ${openDivs}, Close: ${closeDivs}`);
if (openDivs > closeDivs) {
  let lines = content.split('\n');
  for(let i=lines.length-1; i>=0; i--) {
    if (lines[i].includes('  )')) {
      lines.splice(i, 0, '    </div>'.repeat(openDivs - closeDivs));
      break;
    }
  }
  content = lines.join('\n');
}

fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content, 'utf8');
console.log('Fixed flawlessly.');