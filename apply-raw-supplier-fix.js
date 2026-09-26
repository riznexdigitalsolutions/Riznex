const fs = require('fs');
const file = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const d = new Date\(dateStr\);\s*const endD = new Date\(d\);\s*endD\.setDate\(d\.getDate\(\) \+ 6\);\s*const startOfThisWeek = [^;]+;\s*const endOfThisWeek = [^;]+;\s*const wSuppliers = rawSuppliers\.reduce\(\(sum: number, s: any\) => \{\s*if \(\!s\.invoiceDate\) return sum;\s*const sd = new Date\(s\.invoiceDate\)\.getTime\(\);\s*if \(sd >= startOfThisWeek && sd <= endOfThisWeek\) \{\s*return sum \+ \(Number\(s\.amount\) \|\| 0\);\s*\}\s*return sum;\s*\}, 0\);/;

const replacement = `const getUTCMidnight = (iso: string | Date) => {
          if (!iso) return 0;
          try {
            const str = typeof iso === 'string' ? iso : new Date(iso).toISOString();
            const parts = str.split('T')[0].split('-');
            return Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          } catch(e) { return 0; }
        };

        const startUTC = getUTCMidnight(dateStr);
        const endUTC = startUTC + (6 * 24 * 60 * 60 * 1000); // 6 days later, inclusive
        
        const wSuppliers = rawSuppliers.reduce((sum: number, s: any) => {
          if (!s.invoiceDate) return sum;
          const invUTC = getUTCMidnight(s.invoiceDate);
          if (invUTC >= startUTC && invUTC <= endUTC) {
            return sum + (Number(s.amount) || 0);
          }
          return sum;
        }, 0);
        
        const d = new Date(dateStr);
        const endD = new Date(d);
        endD.setDate(d.getDate() + 6);`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Successfully replaced with UTC Midnight logic.');
} else {
    console.log('Could not find regex match. Writing to debug.txt');
    fs.writeFileSync('debug.txt', content);
}
