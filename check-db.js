const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const sales = await prisma.sale.findMany({
    where: { weekStart: { gte: new Date('2026-05-01') } }
  });
  console.log('Sales in May or later:', sales.length);
  if (sales.length > 0) {
    console.log('Sample weekStart:', sales[0].weekStart);
  }
}
check().catch(console.error).finally(() => prisma.$disconnect());