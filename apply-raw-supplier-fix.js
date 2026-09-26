const fs = require('fs');
const file = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /let refD = new Date\(dateStr\);[\s\S]*?endD\.setDate\(d\.getDate\(\) \+ 6\);/;

const replacement = `const d = new Date(dateStr);
        const endD = new Date(d);
        endD.setDate(d.getDate() + 6);
        
        const startOfThisWeek = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
        const endOfThisWeek = new Date(endD.getFullYear(), endD.getMonth(), endD.getDate(), 23, 59, 59, 999).getTime();

        const wSuppliers = rawSuppliers.reduce((sum: number, s: any) => {
          if (!s.invoiceDate) return sum;
          const sd = new Date(s.invoiceDate).getTime();
          if (sd >= startOfThisWeek && sd <= endOfThisWeek) {
            return sum + (Number(s.amount) || 0);
          }
          return sum;
        }, 0);`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Successfully replaced date window logic.');
} else {
    console.log('Could not find regex match.');
}
