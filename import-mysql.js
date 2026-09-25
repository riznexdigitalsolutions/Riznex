const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function importData() {
  console.log("Starting import to MySQL...");
  const prisma = new PrismaClient();
  
  // Read exported data
  const data = JSON.parse(fs.readFileSync('db-export.json', 'utf8'));
  console.log(`Loaded JSON data. Users: ${data.users.length}, Clients: ${data.clients.length}`);

  try {
    // We'll use createMany for speed and avoiding individual awaits if possible.
    // However, createMany doesn't always support relations cleanly if we just dump.
    // Since these are exact rows from SQLite, we can just insert them as they are!

    // Clear existing (if any)
    await prisma.stock.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.staffWage.deleteMany();
    await prisma.staff.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.marketingOffer.deleteMany();
    await prisma.client.deleteMany();
    await prisma.user.deleteMany();
    console.log("Cleared existing data");

    // Important: Disable foreign key checks for the bulk import if needed?
    // In Prisma, we just insert them in the right order (parents first).

    // 1. Users & Clients
    if (data.users.length) await prisma.user.createMany({ data: data.users });
    if (data.clients.length) await prisma.client.createMany({ data: data.clients });

    // 2. Parents: Suppliers, Staff
    if (data.suppliers.length) await prisma.supplier.createMany({ data: data.suppliers });
    if (data.staff.length) await prisma.staff.createMany({ data: data.staff });

    // 3. Children: Invoices, StaffWages, Sales, Expenses, MarketingOffers, Stock
    if (data.invoices.length) {
      // Dates in JSON are strings, convert to Date objects
      const invoices = data.invoices.map(i => ({
        ...i,
        invoiceDate: i.invoiceDate ? new Date(i.invoiceDate) : null,
        createdAt: i.createdAt ? new Date(i.createdAt) : null,
        updatedAt: i.updatedAt ? new Date(i.updatedAt) : null,
      }));
      await prisma.invoice.createMany({ data: invoices });
    }

    if (data.staffWages.length) {
      const wages = data.staffWages.map(w => ({
        ...w,
        weekEnd: w.weekEnd ? new Date(w.weekEnd) : null,
        createdAt: w.createdAt ? new Date(w.createdAt) : null,
        updatedAt: w.updatedAt ? new Date(w.updatedAt) : null,
      }));
      await prisma.staffWage.createMany({ data: wages });
    }

    if (data.sales.length) {
      const sales = data.sales.map(s => ({
        ...s,
        weekStart: s.weekStart ? new Date(s.weekStart) : null,
        weekEnd: s.weekEnd ? new Date(s.weekEnd) : null,
        createdAt: s.createdAt ? new Date(s.createdAt) : null,
        updatedAt: s.updatedAt ? new Date(s.updatedAt) : null,
      }));
      await prisma.sale.createMany({ data: sales });
    }

    if (data.expenses.length) {
      const exps = data.expenses.map(e => ({
        ...e,
        date: e.date ? new Date(e.date) : null,
        createdAt: e.createdAt ? new Date(e.createdAt) : null,
        updatedAt: e.updatedAt ? new Date(e.updatedAt) : null,
      }));
      await prisma.expense.createMany({ data: exps });
    }

    if (data.marketingOffers.length) {
      const offers = data.marketingOffers.map(o => ({
        ...o,
        startDate: o.startDate ? new Date(o.startDate) : null,
        endDate: o.endDate ? new Date(o.endDate) : null,
        createdAt: o.createdAt ? new Date(o.createdAt) : null,
        updatedAt: o.updatedAt ? new Date(o.updatedAt) : null,
      }));
      await prisma.marketingOffer.createMany({ data: offers });
    }

    if (data.stock.length) {
      const stocks = data.stock.map(s => ({
        ...s,
        date: s.date ? new Date(s.date) : null,
        createdAt: s.createdAt ? new Date(s.createdAt) : null,
        updatedAt: s.updatedAt ? new Date(s.updatedAt) : null,
      }));
      await prisma.stock.createMany({ data: stocks });
    }

    console.log("Successfully imported ALL data!");
  } catch (error) {
    console.error("Error during import:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
