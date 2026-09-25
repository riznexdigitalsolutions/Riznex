const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkInvoice() {
  const invoice = await prisma.invoice.findFirst({
    where: { platform: 'Online Web' },
    orderBy: { createdAt: 'desc' }
  });
  
  if (!invoice) {
    console.log('No Online Web invoice found.');
    return;
  }
  
  console.log('ID:', invoice.id);
  console.log('Amount:', invoice.amount);
  console.log('InvoiceDate:', invoice.invoiceDate);
  console.log('OCR Data:', invoice.ocrData);
}

checkInvoice().catch(console.error).finally(() => prisma.$disconnect());