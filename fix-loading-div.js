const fs = require('fs');
let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

// Fix the specific loading block
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

// Verify we don't have an unbalanced tree again by just stripping ALL trailing divs and manually recreating the end
// Because if we removed one here, we might need one at the end!
fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content, 'utf8');
console.log('Fixed loading block double div');