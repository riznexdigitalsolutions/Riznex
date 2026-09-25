const fs = require('fs');
let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');
console.log("Includes WEEKLY TAB?", content.includes('WEEKLY TAB'));