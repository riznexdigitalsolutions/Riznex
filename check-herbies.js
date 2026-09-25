const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const sales = await prisma.sale.findMany({
    where: { client: { name: 'Henley on Thames' }, store: { contains: 'Herbies' } },
    select: { store: true, platform: true, weekStart: true, totalOrders: true }
  });
  const septSales = sales.filter(s => s.weekStart && s.weekStart.toISOString().includes('2026-09'));
  console.log('Sept 2026 Herbies Sales:', septSales);
}
main().catch(console.error).finally(() => prisma.$disconnect());
