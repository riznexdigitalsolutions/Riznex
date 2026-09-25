const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCash() {
  const sales = await prisma.sale.findMany({
    where: {
      clientId: 'client-1',
      platform: 'Walk In Cash'
    },
    select: { id: true, platform: true, weekStart: true, weekEnd: true, grossSales: true }
  });
  console.table(sales);
}

checkCash().catch(console.error).finally(() => prisma.$disconnect());