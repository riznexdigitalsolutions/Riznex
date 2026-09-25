const fs = require('fs');
// I can't easily inspect runtime data without console logging it.
// I will check the API route /api/reports/route.ts to see what it returns.
const content = fs.readFileSync('app/api/reports/route.ts', 'utf8');
console.log(content.slice(0, 1000));