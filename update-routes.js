const fs = require('fs');

const updateRoute = (file) => {
  let content = fs.readFileSync(file, 'utf8');

  // Insert date list parsing
  const parseLogic = `
    const rangesStr = searchParams.get('ranges')
    let dateWhereList = [{ gte: dateFrom, lte: dateTo }]
    if (rangesStr) {
      const parts = rangesStr.split('|').map(r => {
        const [start, end] = r.split('_')
        return { gte: new Date(start), lte: new Date(end) }
      })
      if (parts.length > 0) {
        dateWhereList = parts
      }
    }

    const buildWhere = (base, dateField) => {
      if (dateWhereList.length === 1) {
        return { ...base, [dateField]: dateWhereList[0] }
      }
      return {
        ...base,
        OR: dateWhereList.map(range => ({ [dateField]: range }))
      }
    }
  `;

  if (!content.includes('rangesStr = searchParams.get')) {
    // Insert before "const salesWhere"
    content = content.replace("const salesWhere: any = { clientId, is2025, weekEnd: { gte: dateFrom, lte: dateTo } }", parseLogic + "\n    const salesWhere: any = buildWhere({ clientId, is2025 }, 'weekEnd')");
    
    // Replace all other where clauses
    // Henley:
    // { clientId, is2025, date: { gte: dateFrom, lte: dateTo }, period: { not: 'template' } }
    content = content.replace(
      "{ clientId, is2025, date: { gte: dateFrom, lte: dateTo }, period: { not: 'template' } }",
      "buildWhere({ clientId, is2025, period: { not: 'template' } }, 'date')"
    );

    // { clientId, is2025, type: 'supplier', invoiceDate: { gte: dateFrom, lte: dateTo } }
    content = content.replace(
      "{ clientId, is2025, type: 'supplier', invoiceDate: { gte: dateFrom, lte: dateTo } }",
      "buildWhere({ clientId, is2025, type: 'supplier' }, 'invoiceDate')"
    );

    // { clientId, is2025, weekEnd: { gte: dateFrom, lte: dateTo } }
    content = content.replace(
      "{ clientId, is2025, weekEnd: { gte: dateFrom, lte: dateTo } }",
      "buildWhere({ clientId, is2025 }, 'weekEnd')"
    );
    // again for staff wages
    content = content.replace(
      "{ clientId, is2025, weekEnd: { gte: dateFrom, lte: dateTo } }",
      "buildWhere({ clientId, is2025 }, 'weekEnd')"
    );

    // Hungry Birds specific queries:
    // { clientId, is2025, date: { gte: dateFrom, lte: dateTo }, period: { not: 'template' }, store: 'Hungry Birds' }
    content = content.replace(
      "{ clientId, is2025, date: { gte: dateFrom, lte: dateTo }, period: { not: 'template' }, store: 'Hungry Birds' }",
      "buildWhere({ clientId, is2025, period: { not: 'template' }, store: 'Hungry Birds' }, 'date')"
    );

    // { clientId, is2025, type: 'supplier', invoiceDate: { gte: dateFrom, lte: dateTo }, supplier: { franchise: 'Hungry Birds' } }
    content = content.replace(
      "{ clientId, is2025, type: 'supplier', invoiceDate: { gte: dateFrom, lte: dateTo }, supplier: { franchise: 'Hungry Birds' } }",
      "buildWhere({ clientId, is2025, type: 'supplier', supplier: { franchise: 'Hungry Birds' } }, 'invoiceDate')"
    );

    // { clientId, is2025, weekEnd: { gte: dateFrom, lte: dateTo }, franchise: 'Hungry Birds' }
    content = content.replace(
      "{ clientId, is2025, weekEnd: { gte: dateFrom, lte: dateTo }, franchise: 'Hungry Birds' }",
      "buildWhere({ clientId, is2025, franchise: 'Hungry Birds' }, 'weekEnd')"
    );

    // { clientId, is2025, weekEnd: { gte: dateFrom, lte: dateTo }, store: 'Hungry Birds' }
    content = content.replace(
      "{ clientId, is2025, weekEnd: { gte: dateFrom, lte: dateTo }, store: 'Hungry Birds' }",
      "buildWhere({ clientId, is2025, store: 'Hungry Birds' }, 'weekEnd')"
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`Already updated ${file}`);
  }
}

updateRoute('app/api/reports/route.ts');
updateRoute('app/api/reports-hb/route.ts');