const http = require('http');

// First login to get a cookie
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/reports?clientId=cmpv4dvik0000vdj089wl6zmf&from=2026-05-01&to=2026-05-31',
  method: 'GET',
};

// I'm not in a browser, I don't have a session cookie easily.
// I can just query Prisma using the exact where clause instead!
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const dateFrom = new Date('2026-05-01');
  const dateTo = new Date('2026-05-31T23:59:59.999Z');
  const salesRaw = await prisma.sale.findMany({
      where: { clientId: 'cmpv4dvik0000vdj089wl6zmf', weekEnd: { gte: dateFrom, lte: dateTo } },
      orderBy: { weekStart: 'asc' },
  });
  console.log('salesRaw length for May:', salesRaw.length);
}
check().catch(console.error).finally(() => prisma.$disconnect());