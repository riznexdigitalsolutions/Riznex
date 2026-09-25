const fs = require('fs');
let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

// A very naive counter just to see
const openDivs = (content.match(/<div/g) || []).length;
const closeDivs = (content.match(/<\/div>/g) || []).length;

console.log(`Open: ${openDivs}, Close: ${closeDivs}, Diff: ${openDivs - closeDivs}`);