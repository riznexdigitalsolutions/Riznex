const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProfit() {
  const endDateStr = "2024-08-30"; 
  // Wait, let's find the exact week by querying sales around august 30th
  const sales = await prisma.sale.findMany({
    where: { clientId: 'client-1' }
  });
  
  // Filter for Aug 30
  const aug30Sales = sales.filter(s => new Date(s.weekEnd).toISOString().includes('-08-30'));
  
  if (aug30Sales.length === 0) {
    console.log("No sales found ending exactly on Aug 30. Let's list the nearest weekEnd dates in Aug/Sep:");
    const dates = [...new Set(sales.map(s => s.weekEnd.toISOString().split('T')[0]))];
    console.log(dates.filter(d => d.includes('-08-') || d.includes('-09-')));
    return;
  }
  
  const targetDate = aug30Sales[0].weekEnd;
  console.log("Target WeekEnd:", targetDate);
  
  const targetSales = sales.filter(s => s.weekEnd.getTime() === targetDate.getTime());
  let totalNet = 0;
  console.log("--- SALES ---");
  targetSales.forEach(s => {
    console.log(`${s.platform}: £${s.netPaid}`);
    totalNet += s.netPaid;
  });
  console.log(`TOTAL NET SALES: £${totalNet.toFixed(2)}`);
  
  const expenses = await prisma.expense.findMany({
    where: { clientId: 'client-1' }
  });
  
  // Try to match expenses that fall in this week. The dashboard usually groups expenses by 'period="weekly"' and 'date' or aggregates them by week.
  // We need to see how the dashboard groups it. Let's just list expenses around that date.
  const targetExpenses = expenses.filter(e => {
    // Exact match or within that week
    const ed = new Date(e.date);
    return ed.toISOString().includes('-08-30') || 
           (ed <= targetDate && ed >= new Date(targetDate.getTime() - 7 * 86400000));
  });
  
  console.log("--- EXPENSES ---");
  let totalExp = 0;
  targetExpenses.forEach(e => {
    console.log(`${e.category} (${e.subcategory}): £${e.amount} [${e.date.toISOString().split('T')[0]}]`);
    totalExp += e.amount;
  });
  console.log(`TOTAL EXPENSES: £${totalExp.toFixed(2)}`);
  
  console.log(`CALCULATED PROFIT: £${(totalNet - totalExp).toFixed(2)}`);
}

checkProfit().catch(console.error).finally(() => prisma.$disconnect());