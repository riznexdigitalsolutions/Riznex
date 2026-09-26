const fs = require('fs');
const file = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const mapKey = new Date\(dateStr\)\.toISOString\(\)\.split\('T'\)\[0\];[\s\r\n]*const wSuppliers = weeklyMap\[mapKey\]\?\.suppliers \|\| 0;/;

const replacement = `let refD = new Date(dateStr);
        if (isNaN(refD.getTime())) refD = new Date();
        const refDay = refD.getDay();
        const refMon = new Date(refD.setDate(refD.getDate() - refDay + (refDay === 0 ? -6 : 1))).setHours(0,0,0,0);
        
        const wSuppliers = rawSuppliers.reduce((sum: number, s: any) => {
          let sd = new Date();
          if (s.invoiceDate) sd = new Date(s.invoiceDate);
          if (isNaN(sd.getTime())) return sum;
          const sDay = sd.getDay();
          const sMon = new Date(sd.setDate(sd.getDate() - sDay + (sDay === 0 ? -6 : 1))).setHours(0,0,0,0);
          if (sMon === refMon) {
            return sum + (Number(s.amount) || 0);
          }
          return sum;
        }, 0);`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Regex replace successful.');
} else {
    console.log('Regex not found.');
}
