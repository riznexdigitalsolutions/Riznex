const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkWages() {
  const from = new Date('2026-08-24T00:00:00.000Z');
  const to = new Date('2026-08-30T23:59:59.999Z');
  
  const wages = await prisma.staffWage.findMany({
    where: { clientId: 'client-1', weekEnd: { gte: from, lte: to } }
  });
  
  let totalWages = wages.reduce((a, b) => a + b.amount, 0);
  console.log("Total Wages:", totalWages);
}

checkWages().catch(console.error).finally(() => prisma.$disconnect());