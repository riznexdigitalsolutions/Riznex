const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDoubleDeductions() {
  const from = new Date('2026-08-24T00:00:00.000Z');
  const to = new Date('2026-08-30T23:59:59.999Z');
  
  const expenses = await prisma.expense.findMany({
    where: { clientId: 'client-1', date: { gte: from, lte: to } }
  });
  
  console.log("Expenses:");
  expenses.forEach(e => console.log(`  - ${e.category} (${e.subcategory}): £${e.amount}`));
}

checkDoubleDeductions().catch(console.error).finally(() => prisma.$disconnect());