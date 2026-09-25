const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const dateFrom = new Date('2026-05-01');
  const dateTo = new Date('2026-05-31T23:59:59.999Z');
  const rawSales = await prisma.sale.findMany({
      where: { clientId: 'cmpv4dvik0000vdj089wl6zmf', weekEnd: { gte: dateFrom, lte: dateTo } },
      orderBy: { weekStart: 'asc' },
  });
  const rawSuppliers = [];

  const weeklyMap = {};
  rawSales.forEach(s => {
    // Group by week start date (YYYY-MM-DD)
    const dateStr = s.weekStart ? new Date(s.weekStart).toISOString().split('T')[0] : 'Unknown';
    if (!weeklyMap[dateStr]) weeklyMap[dateStr] = { name: dateStr, sales: 0, orders: 0, suppliers: 0, date: new Date(s.weekStart) };
    weeklyMap[dateStr].sales += (s.grossSales || 0);
    weeklyMap[dateStr].orders += (s.totalOrders || 0);
  });
  
  const realWeeklyData = Object.values(weeklyMap).sort((a, b) => a.date - b.date).map(w => ({
    name: w.name,
    sales: Math.round(w.sales),
    orders: Math.round(w.orders),
    suppliers: Math.round(w.suppliers)
  }));
  const displayWeeklyData = realWeeklyData.slice(-8);
  console.log(displayWeeklyData);
}
check().catch(console.error).finally(() => prisma.$disconnect());