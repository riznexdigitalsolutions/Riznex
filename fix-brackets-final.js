const fs = require('fs');
let content = fs.readFileSync('app/api/invoices/[id]/ocr/route.ts', 'utf8');

const targetStr = `
- Return ONLY the JSON, no markdown, no explanation.\`;
          }
        } else {
          prompt = \`You are an invoice data extractor. Analyse this Uber Eats / food delivery platform invoice screenshot and extract ALL financial data. 

Return ONLY a valid JSON object with these fields (use null if not found):`;

const replacementStr = `
- Return ONLY the JSON, no markdown, no explanation.\`;
            }
          }
        } else {
          prompt = \`You are an invoice data extractor. Analyse this Uber Eats / food delivery platform invoice screenshot and extract ALL financial data. 

Return ONLY a valid JSON object with these fields (use null if not found):`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync('app/api/invoices/[id]/ocr/route.ts', content, 'utf8');
  console.log('Fixed exactly the missing bracket structure');
} else {
  console.log('Target string not found - the structure might be slightly different');
}