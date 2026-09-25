const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const offers = await prisma.marketingOffer.findMany({ where: { client: { name: 'Henley on Thames' } }});
  console.log(offers.map(o => ({ platform: o.platform, store: o.store, notes: o.notes })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
