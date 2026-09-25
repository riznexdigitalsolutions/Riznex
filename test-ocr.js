const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { execSync } = require('child_process');
const path = require('path');

async function testOCR() {
  const invoice = await prisma.invoice.findFirst({
    where: { platform: 'Online Web' },
    orderBy: { createdAt: 'desc' }
  });
  
  if (!invoice) {
    console.log('No Online Web invoice found.');
    return;
  }
  
  console.log('Testing file:', invoice.filePath);
  const filePath = path.join(process.cwd(), 'public', invoice.filePath);
  
  try {
    const stdout = execSync(`node scripts/ocr-worker.js "${filePath}"`).toString();
    const res = JSON.parse(stdout.trim());
    console.log('--- TESSERACT OUTPUT ---');
    console.log(res.text);
    console.log('------------------------');
    
    const regex = /Total.*?([\d,.]+)(?:[\s\S]{0,50}?)Place[d]?\s*on\s*(\d{1,2}\s*[A-Za-z]{3,9}\s*\d{4})(?:[\s\S]{0,30}?(Yesweb))?/gi;
    let match;
    let count = 0;
    while ((match = regex.exec(res.text)) !== null) {
      console.log('MATCH FOUND:', match[1], match[2]);
      count++;
    }
    console.log('TOTAL MATCHES:', count);
  } catch (err) {
    console.error('Error running OCR:', err.message);
  }
}

testOCR().finally(() => prisma.$disconnect());