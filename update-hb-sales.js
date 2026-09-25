const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateSales() {
  const updates = [
    {
      weekStart: new Date('2026-08-17T12:00:00Z'),
      weekEnd: new Date('2026-08-23T12:00:00Z'),
      grossSales: 1419.78,
      orders: 71
    },
    {
      weekStart: new Date('2026-08-24T12:00:00Z'),
      weekEnd: new Date('2026-08-30T12:00:00Z'),
      grossSales: 1432.12,
      orders: 72
    }
  ];

  for (const update of updates) {
    const existing = await prisma.sale.findFirst({
      where: {
        clientId: 'client-1',
        platform: 'Walk In Card',
        store: 'Hungry Birds',
        weekEnd: update.weekEnd
      }
    });

    if (existing) {
      await prisma.sale.update({
        where: { id: existing.id },
        data: {
          grossSales: update.grossSales,
          netPaid: update.grossSales,
          totalOrders: update.orders,
          commission: 0,
          vat: 0,
          notes: 'Manually updated from August Tide statement (US Bank Europe Dac only)'
        }
      });
      console.log(`Updated week ending ${update.weekEnd.toISOString()}`);
    } else {
      await prisma.sale.create({
        data: {
          clientId: 'client-1',
          platform: 'Walk In Card',
          store: 'Hungry Birds',
          weekStart: update.weekStart,
          weekEnd: update.weekEnd,
          grossSales: update.grossSales,
          netPaid: update.grossSales,
          totalOrders: update.orders,
          commission: 0,
          vat: 0,
          notes: 'Manually created from August Tide statement (US Bank Europe Dac only)',
          is2025: false
        }
      });
      console.log(`Created week ending ${update.weekEnd.toISOString()}`);
    }
  }
}

updateSales()
  .then(() => console.log('SUCCESS'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());