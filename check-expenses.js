const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const ex = await prisma.expense.findMany();
  console.log("Total expenses in DB:", ex.length);
  if (ex.length > 0) {
     console.log("First expense category:", ex[0].category, "Amount:", ex[0].amount);
  }
}
check().catch(console.error).finally(() => prisma.$disconnect());