const fs = require('fs');
const file = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the Pie Chart mapping
content = content.replace(
  "const cat = s.category || 'Other';",
  "const cat = s.supplier?.category || 'Other';"
);
content = content.replace(
  "expenseMap[cat] += (Number(s.totalAmount) || 0);",
  "expenseMap[cat] += (Number(s.amount) || 0);"
);

// 2. Fix the Progress Bar gradient styling
// Original string: <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-10 rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-4" style={{ width: `${targetPercent}%` }}>
const oldBarStr = '<div className="bg-gradient-to-r from-pink-500 to-purple-500 h-10 rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-4" style={{ width: `${targetPercent}%` }}>';
const newBarStr = '<div className="h-10 rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-4 shadow-[0_0_15px_rgba(236,72,153,0.5)]" style={{ width: `${targetPercent}%`, background: \'linear-gradient(to right, #ec4899, #a855f7)\' }}>';

content = content.replace(oldBarStr, newBarStr);
content = content.replace(oldBarStr, newBarStr); // replace twice if it's on monthly tab too (if applicable)

fs.writeFileSync(file, content, 'utf8');
console.log('Patched');