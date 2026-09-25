const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const sales = await prisma.sale.findMany({ where: { client: { name: 'Henley on Thames' } }});
  
  const uberEatsSales = sales.filter(s => s.store?.includes('Tasty') && s.platform?.includes('Uber') && s.weekStart?.toISOString().includes('2026-09-07'));
  console.log('Uber Eats Tasty 2026-09-07:', uberEatsSales.map(s => s.totalOrders).reduce((a,b)=>a+b, 0));

  const delivHerbies = sales.filter(s => s.store?.includes('Herbies') && s.platform?.includes('Deliveroo') && s.weekStart?.toISOString().includes('2026-09-07'));
  console.log('Deliveroo Herbies 2026-09-07:', delivHerbies.map(s => s.totalOrders).reduce((a,b)=>a+b, 0));

  const jeHerbies = sales.filter(s => s.store?.includes('Herbies') && s.platform?.includes('Just Eat') && s.weekStart?.toISOString().includes('2026-09-07'));
  console.log('Just Eat Herbies 2026-09-07:', jeHerbies.map(s => s.totalOrders).reduce((a,b)=>a+b, 0));
}
main().catch(console.error).finally(() => prisma.$disconnect());
