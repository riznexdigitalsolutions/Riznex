const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const is2025 = false;
  let salesWhere = {
    client: { name: 'Henley on Thames' }
  };
  const salesRaw = await prisma.sale.findMany({
    where: salesWhere,
    orderBy: { weekStart: 'asc' },
  });
  const deliv = salesRaw.filter(s => s.platform === 'Deliveroo' && s.store === 'Herbies Pizza' && s.weekStart && s.weekStart.toISOString().includes('2026-09-07'));
  console.log('Deliveroo Herbies 09-07 in API raw:', deliv.length > 0 ? deliv[0].totalOrders : 0);
}
main().catch(console.error).finally(() => prisma.$disconnect());
