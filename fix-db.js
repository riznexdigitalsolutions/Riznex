const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixCommissions() {
  const sales = await prisma.sale.findMany({
    where: { platform: 'Online Web' }
  });
  
  let fixedCount = 0;
  for (const sale of sales) {
    if (sale.commission > 0) {
      await prisma.sale.update({
        where: { id: sale.id },
        data: {
          commission: 0,
          netPaid: sale.grossSales // Net equals gross when commission is 0
        }
      });
      fixedCount++;
    }
  }
  console.log(`Fixed ${fixedCount} 'Online Web' sales records.`);
}

fixCommissions().catch(console.error).finally(() => prisma.$disconnect());