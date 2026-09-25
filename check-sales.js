const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const sales = await prisma.sale.findMany({
    where: { client: { name: 'Henley on Thames' } },
    select: { store: true, platform: true, weekStart: true, totalOrders: true }
  });
  console.log('Total sales records:', sales.length);
  console.log('Sample sales:', sales.slice(0, 10));
}
main().then(() => process.exit(0));
