const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLogic() {
  const { startOfWeek, endOfWeek } = require('date-fns');
  
  // Try to match exact week dates using 2026-08-30
  // week ends on Sunday. 2026-08-30 is a Sunday.
  // The UI sends from=2026-08-24&to=2026-08-30 usually if it's week ending 30th aug
  
  const from = new Date('2026-08-24T00:00:00.000Z');
  const to = new Date('2026-08-30T23:59:59.999Z');
  
  const sales = await prisma.sale.findMany({
    where: { clientId: 'client-1', weekEnd: { gte: from, lte: to } }
  });
  
  const expenses = await prisma.expense.findMany({
    where: { clientId: 'client-1', date: { gte: from, lte: to } }
  });
  
  const suppliers = await prisma.invoice.findMany({
    where: { clientId: 'client-1', type: 'supplier', invoiceDate: { gte: from, lte: to } }
  });
  
  const totalNetPaid = sales.reduce((acc, curr) => acc + (curr.netPaid || 0), 0)
  const totalExpenses = expenses.filter(e => (!e.invoiceId)).reduce((acc, curr) => acc + (curr.amount || 0), 0)
  const totalSupplierCost = suppliers.reduce((acc, curr) => acc + (curr.amount || 0), 0)
  
  console.log("Total Net Paid:", totalNetPaid);
  console.log("Total Expenses (excluding ones with invoiceId that match suppliers):", totalExpenses);
  console.log("Total Supplier Cost:", totalSupplierCost);
  
  const netProfit = totalNetPaid - totalExpenses - totalSupplierCost;
  console.log("NET PROFIT:", netProfit);
  
  // Breakdown
  console.log("\nSales:");
  sales.forEach(s => console.log(`  ${s.platform}: Net=${s.netPaid}, Gross=${s.grossSales}`));
}

checkLogic().catch(console.error).finally(() => prisma.$disconnect());