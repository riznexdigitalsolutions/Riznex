const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMath() {
  const from = new Date('2026-08-24T00:00:00.000Z');
  const to = new Date('2026-08-30T23:59:59.999Z');
  
  const sales = await prisma.sale.findMany({
    where: { clientId: 'client-1', weekEnd: { gte: from, lte: to } }
  });
  
  let gross = 0;
  let net = 0;
  let comm = 0;
  let ad = 0;
  let other = 0;
  
  sales.forEach(s => {
    gross += s.grossSales;
    net += s.netPaid;
    comm += s.commission;
    ad += s.adSpends;
    other += s.otherFees;
    console.log(`${s.platform}: Gross=${s.grossSales}, Net=${s.netPaid}, Comm=${s.commission}, Ad=${s.adSpends}, Other=${s.otherFees}`);
  });
  
  console.log(`TOTAL GROSS: ${gross}`);
  console.log(`TOTAL NET: ${net}`);
  console.log(`TOTAL COMM: ${comm}`);
  console.log(`TOTAL AD: ${ad}`);
  console.log(`TOTAL OTHER: ${other}`);
  
  console.log(`Gross - Comm - Ad - Other = ${gross - comm - ad - other}`);
}

checkMath().catch(console.error).finally(() => prisma.$disconnect());