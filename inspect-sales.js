const fs = require('fs');
const content = fs.readFileSync('app/api/reports/route.ts', 'utf8');
const salesIdx = content.indexOf('const sales = await prisma.sale.findMany(');
console.log(content.substring(salesIdx, salesIdx + 1000));