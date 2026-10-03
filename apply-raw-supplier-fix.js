const fs = require('fs');
const file = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `      return {
        dateStr,
        name: \`Week \${isoWeek}\`,
        dateRange: \`\${formatD(d)} - \${formatD(endD)}\`,
        sales: wSales,
        orders: wOrders,
        aov: wOrders > 0 ? wSales / wOrders : 0,
        profit: wProfit
      };`;

const replacement = `      return {
        dateStr,
        name: \`Week \${isoWeek}\`,
        dateRange: \`\${formatD(d)} - \${formatD(endD)}\`,
        sales: wSales,
        orders: wOrders,
        aov: wOrders > 0 ? wSales / wOrders : 0,
        profit: wProfit,
        suppliers: wSuppliers
      };`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Replaced successfully.');
} else {
    // try to match with regex just in case formatting is different
    const regex = /return \{\s*dateStr,\s*name: `Week \$\{isoWeek\}`,\s*dateRange: `\$\{formatD\(d\)\} - \$\{formatD\(endD\)\}`,\s*sales: wSales,\s*orders: wOrders,\s*aov: wOrders > 0 \? wSales \/ wOrders : 0,\s*profit: wProfit\s*\};/;
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(file, content);
        console.log('Replaced successfully with regex.');
    } else {
        console.log('Target string not found.');
    }
}
