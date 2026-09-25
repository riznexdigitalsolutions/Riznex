const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const offers = await prisma.marketingOffer.findMany({ where: { client: { name: 'Henley on Thames' } }});
  const sales = await prisma.sale.findMany({ where: { client: { name: 'Henley on Thames' } }});
  
  for (const offer of offers) {
    const matchingSales = sales.filter((s) => {
      let pMatch = false
      const sPlatform = (s.platform || '').toLowerCase().replace(/_/g, ' ')
      const oPlatform = (offer.platform || '').toLowerCase().replace(/_/g, ' ')
      if (sPlatform.includes(oPlatform) || oPlatform.includes(sPlatform) || oPlatform === sPlatform) pMatch = true

      let sMatch = false
      if (offer.store === 'Combined') sMatch = true
      else if (offer.store === 'Herbies Pizza' && (s.store || '').includes('Herbies')) sMatch = true
      else if (offer.store === 'Tasty Bun' && (s.store || '').includes('Tasty')) sMatch = true
      else if (offer.store === s.store) sMatch = true

      const offerDate = new Date(offer.startDate).getTime()
      const saleDate = new Date(s.weekStart || s.weekEnd).getTime()
      
      let dMatch = false
      if (offer.type === 'weekly') {
        const diff = Math.abs(saleDate - offerDate)
        if (diff <= 7 * 24 * 60 * 60 * 1000) dMatch = true
      } else {
        const oD = new Date(offer.startDate)
        const sD = new Date(s.weekStart || s.weekEnd)
        if (oD.getMonth() === sD.getMonth() && oD.getFullYear() === sD.getFullYear()) dMatch = true
      }

      return pMatch && sMatch && dMatch
    });
    console.log('Offer:', offer.platform, offer.store, new Date(offer.startDate).toISOString().split('T')[0], 'Matched:', matchingSales.length);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
