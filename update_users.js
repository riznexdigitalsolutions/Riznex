const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateUsers() {
  const hungryPassword = await bcrypt.hash('Hungry@123', 10);
  const henleyPassword = await bcrypt.hash('Henly@123', 10);

  // Update Hungry Birds
  const hbUser = await prisma.user.updateMany({
    where: { email: 'hungrybirdsmcr@gmail.com' },
    data: { 
      email: 'Hungry.birds',
      password: hungryPassword
    }
  });

  // Update Henley
  const henleyUser = await prisma.user.updateMany({
    where: { email: 'henley@example.com' },
    data: { 
      email: 'Henley.Thames',
      password: henleyPassword
    }
  });

  console.log('Updated users:', { hbUser, henleyUser });
}

updateUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());