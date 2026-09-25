const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDuplicates() {
  const sales = await prisma.sale.findMany({
    where: {
      clientId: 'client-1',
      store: 'Hungry Birds',
      weekEnd: new Date('2026-08-23T12:00:00Z')
    },
    select: { id: true, platform: true, grossSales: true, notes: true, createdAt: true }
  });
  console.log('--- Sales for Week Ending Aug 23 ---');
  console.table(sales);
}

checkDuplicates().catch(console.error).finally(() => prisma.$disconnect());