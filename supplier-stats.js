const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getStats() {
  const mayToJulyStart = new Date('2026-05-01T00:00:00Z');
  const mayToJulyEnd = new Date('2026-07-31T23:59:59.999Z');
  const mayToJuneEnd = new Date('2026-06-30T23:59:59.999Z');

  const invoices = await prisma.invoice.findMany({
    where: { 
      type: 'supplier', 
      invoiceDate: { gte: mayToJulyStart, lte: mayToJulyEnd } 
    },
    include: { supplier: true }
  });

  const supplierStats = {};

  invoices.forEach(inv => {
    const name = inv.supplier?.name || 'Unknown Supplier';
    const amount = Number(inv.amount) || 0;
    const date = new Date(inv.invoiceDate);
    
    if (!supplierStats[name]) {
      supplierStats[name] = { totalMayToJuly: 0, totalMayToJune: 0 };
    }
    
    // Add to May-July total
    supplierStats[name].totalMayToJuly += amount;
    
    // Add to May-June total if date is on or before June 30
    if (date <= mayToJuneEnd) {
      supplierStats[name].totalMayToJune += amount;
    }
  });

  // Calculate averages (May + June = 61 days = 8.714 weeks)
  const weeksInMayJune = 61 / 7;

  const results = Object.keys(supplierStats).map(name => {
    return {
      name,
      totalMayToJuly: supplierStats[name].totalMayToJuly,
      avgWeeklyMayJune: supplierStats[name].totalMayToJune / weeksInMayJune
    };
  });

  // Sort by highest total
  results.sort((a, b) => b.totalMayToJuly - a.totalMayToJuly);

  console.log("--- Supplier Stats ---");
  results.forEach(r => {
    console.log(`${r.name}|${r.totalMayToJuly.toFixed(2)}|${r.avgWeeklyMayJune.toFixed(2)}`);
  });
}

getStats().catch(console.error).finally(() => prisma.$disconnect());