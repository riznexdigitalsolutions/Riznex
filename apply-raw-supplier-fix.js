const fs = require('fs');
const file = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// I am replacing the entire `const wSuppliers = ...` block with a direct weeklyMap lookup.
const targetRegex = /const getUTCMidnight = \(iso: string \| Date\) => \{[\s\S]*?\}, 0\);/;

const replacement = `const mapKey = dateStr.split('T')[0];
        const wSuppliers = weeklyMap[mapKey]?.suppliers || 0;`;

if (targetRegex.test(content)) {
    content = content.replace(targetRegex, replacement);
    fs.writeFileSync(file, content);
    console.log('Replaced wSuppliers calculation successfully.');
} else {
    console.log('Target block not found!');
}
