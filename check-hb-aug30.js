const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAug30() {
  // We need data for the week ending Aug 30.
  // The dashboard might send 'from' and 'to' dates, or 'preset' = 'custom'.
  // If they selected "Week ending 30th Aug" in the filter... wait, how does the UI filter work?
  
  // Let's get the exact numbers for weekEnd <= 2026-08-30 and weekEnd > 2026-08-23
  // Or just 2026-08-24 to 2026-08-30
  
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
  
  let totalNetPaid = sales.reduce((a, b) => a + b.netPaid, 0);
  let totalGross = sales.reduce((a, b) => a + b.grossSales, 0);
  let totalExp = expenses.reduce((a, b) => a + b.amount, 0);
  let totalSup = suppliers.reduce((a, b) => a + (b.amount || 0), 0);
  
  console.log("From:", from.toISOString(), "To:", to.toISOString());
  console.log("Sales Net:", totalNetPaid);
  console.log("Expenses:", totalExp);
  console.log("Suppliers:", totalSup);
  console.log("Net Profit:", totalNetPaid - totalExp - totalSup);
  
  console.log("Sales breakdown:");
  sales.forEach(s => console.log(`  - ${s.platform}: £${s.netPaid} (Gross: £${s.grossSales})`));
  
  console.log("Expenses breakdown:");
  expenses.forEach(e => console.log(`  - ${e.category} (${e.subcategory}): £${e.amount}`));
  
  console.log("Suppliers breakdown:");
  suppliers.forEach(s => console.log(`  - ${s.platform}: £${s.amount}`));
}

checkAug30().catch(console.error).finally(() => prisma.$disconnect());