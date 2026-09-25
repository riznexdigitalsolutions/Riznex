const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteDuplicate() {
  await prisma.sale.delete({
    where: { id: 'cmtbzxx430049wkbc5cs7msmm' }
  });
  console.log('Successfully deleted the duplicate Walk In Cash record.');
}

deleteDuplicate().catch(console.error).finally(() => prisma.$disconnect());