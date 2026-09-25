const rawSales = [
  { weekStart: '2026-05-01T00:00:00Z', grossSales: 100, orders: 10 },
  { weekStart: '2026-05-08T00:00:00Z', grossSales: 200, orders: 20 }
];
const rawSuppliers = [
  { invoiceDate: '2026-05-02T00:00:00Z', totalAmount: 50 }
];

const weeklyMap = {};
  rawSales.forEach(s => {
    const dateStr = s.weekStart ? new Date(s.weekStart).toISOString().split('T')[0] : 'Unknown';
    if (!weeklyMap[dateStr]) weeklyMap[dateStr] = { name: dateStr, sales: 0, orders: 0, suppliers: 0, date: new Date(s.weekStart) };
    weeklyMap[dateStr].sales += (s.grossSales || 0);
    weeklyMap[dateStr].orders += (s.orders || 0);
  });
  rawSuppliers.forEach(s => {
    const d = s.invoiceDate ? new Date(s.invoiceDate) : new Date();
    const day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6:1);
    const mon = new Date(d.setDate(diff));
    const dateStr = mon.toISOString().split('T')[0];
    if (!weeklyMap[dateStr]) weeklyMap[dateStr] = { name: dateStr, sales: 0, orders: 0, suppliers: 0, date: mon };
    weeklyMap[dateStr].suppliers += (s.totalAmount || 0);
  });

  const realWeeklyData = Object.values(weeklyMap).sort((a, b) => a.date - b.date).map(w => ({
    name: w.name,
    sales: Math.round(w.sales),
    orders: Math.round(w.orders),
    suppliers: Math.round(w.suppliers)
  }));
console.log(realWeeklyData);