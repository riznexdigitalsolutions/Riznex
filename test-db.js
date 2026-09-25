const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.marketingOffer.findMany().then(console.log).finally(() => prisma.\$disconnect());
