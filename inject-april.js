const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function injectApril() {
  const clientId = 'cmpv4dvik0000vdj089wl6zmf';
  const mayToJuneEnd = new Date('2026-06-30T23:59:59.999Z');
  const mayToJulyStart = new Date('2026-05-01T00:00:00Z');
  
  const invoices = await prisma.invoice.findMany({
    where: { clientId, type: 'supplier', invoiceDate: { gte: mayToJulyStart, lte: mayToJuneEnd } },
    include: { supplier: true }
  });

  const supplierStats = {};
  invoices.forEach(inv => {
    if (!inv.supplierId) return;
    const sid = inv.supplierId;
    if (!supplierStats[sid]) supplierStats[sid] = { total: 0 };
    supplierStats[sid].total += (Number(inv.amount) || 0);
  });

  const weeks = 61 / 7;
  const aprilDates = [
    new Date('2026-04-06T12:00:00Z'),
    new Date('2026-04-13T12:00:00Z'),
    new Date('2026-04-20T12:00:00Z'),
    new Date('2026-04-27T12:00:00Z')
  ];

  let createdCount = 0;

  for (const sid of Object.keys(supplierStats)) {
    const avg = supplierStats[sid].total / weeks;
    if (avg < 1) continue;
    
    for (const date of aprilDates) {
      await prisma.invoice.create({
        data: {
          clientId,
          type: 'supplier',
          supplierId: sid,
          amount: avg,
          invoiceDate: date,
          is2025: false,
          fileName: 'system_backfill.pdf',
          filePath: '/system/backfill',
          fileType: 'pdf',
          ocrStatus: 'done',
          notes: 'System backfill based on May-June weekly average'
        }
      });
      createdCount++;
    }
  }
  console.log(`SUCCESS: Created ${createdCount} invoices for April.`);
}

injectApril().catch(console.error).finally(() => prisma.$disconnect());