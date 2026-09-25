const fs = require('fs');
let content = fs.readFileSync('app/api/invoices/[id]/ocr/route.ts', 'utf8');

// Find the line that says: "- Return ONLY the JSON, no markdown, no explanation.`;" that is immediately followed by "} else {"
const oldLines = content.split('\n');
for (let i = 0; i < oldLines.length; i++) {
  if (oldLines[i].includes('- Return ONLY the JSON, no markdown, no explanation.`;') && oldLines[i+1] && oldLines[i+1].includes('} else {')) {
    // Add the missing closing bracket
    oldLines[i] = oldLines[i] + '\n            }';
    break;
  }
}

fs.writeFileSync('app/api/invoices/[id]/ocr/route.ts', oldLines.join('\n'), 'utf8');
console.log('Successfully fixed the syntax error.');