const fs = require('fs');

let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

const targetStr = `const mapKey = new Date(dateStr).toISOString().split('T')[0];
      const wSuppliers = weeklyMap[mapKey]?.suppliers || 0;`;
      
const newStr = `const mapKey = dateStr.split('T')[0];
      const wSuppliers = weeklyMap[mapKey]?.suppliers || 0;`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content);
  console.log('Fixed supplier mapping key.');
} else {
  // If line endings are different
  const t2 = `const mapKey = new Date(dateStr).toISOString().split('T')[0];\r\n      const wSuppliers = weeklyMap[mapKey]?.suppliers || 0;`;
  if(content.includes(t2)) {
      content = content.replace(t2, newStr);
      fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content);
      console.log('Fixed supplier mapping key (CRLF).');
  } else {
      console.log('Target string not found.');
  }
}
