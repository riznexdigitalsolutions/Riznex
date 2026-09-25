const fs = require('fs');

const fixRoute = (file) => {
  let content = fs.readFileSync(file, 'utf8');

  // We need to fix the rangesStr parsing logic
  // Look for:
  // const [start, end] = r.split('_')
  // return { gte: new Date(start), lte: new Date(end) }
  
  if (content.includes("lte: new Date(end)")) {
    content = content.replace(
      "return { gte: new Date(start), lte: new Date(end) }",
      "const endDate = new Date(end);\n        endDate.setUTCHours(23, 59, 59, 999);\n        return { gte: new Date(start), lte: endDate }"
    );
  }

  // Also fix the platform OR override issue in salesWhere
  if (content.includes("salesWhere.OR = platformConditions[0].OR")) {
    content = content.replace(
      "salesWhere.OR = platformConditions[0].OR",
      "if (salesWhere.OR) {\n          salesWhere.AND = [{ OR: salesWhere.OR }, { OR: platformConditions[0].OR }];\n          delete salesWhere.OR;\n        } else {\n          salesWhere.OR = platformConditions[0].OR;\n        }"
    );
  }

  // Handle the case where platformConditions > 1
  if (content.includes("salesWhere.OR = platformConditions")) {
    content = content.replace(
      "salesWhere.OR = platformConditions",
      "if (salesWhere.OR) {\n        salesWhere.AND = [{ OR: salesWhere.OR }, { OR: platformConditions }];\n        delete salesWhere.OR;\n      } else {\n        salesWhere.OR = platformConditions;\n      }"
    );
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Fixed ${file}`);
}

fixRoute('app/api/reports/route.ts');
fixRoute('app/api/reports-hb/route.ts');