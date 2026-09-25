const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function halveApril() {
  const invoices = await prisma.invoice.findMany({
    where: { 
      notes: 'System backfill based on May-June weekly average',
      invoiceDate: {
        gte: new Date('2026-04-01T00:00:00Z'),
        lte: new Date('2026-04-30T23:59:59Z')
      }
    }
  });

  let updatedCount = 0;
  for (const inv of invoices) {
    await prisma.invoice.update({
      where: { id: inv.id },
      data: { amount: inv.amount / 2 }
    });
    updatedCount++;
  }
  
  console.log(`SUCCESS: Halved the amounts for ${updatedCount} backfilled April invoices.`);
}

halveApril().catch(console.error).finally(() => prisma.$disconnect());