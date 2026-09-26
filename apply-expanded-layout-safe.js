const fs = require('fs');

let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

// Replacements
content = content.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mb-8">',
  '<div className="flex flex-col gap-6 w-full mb-8">\n                  {/* Top Row: 2 Pies */}\n                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">'
);

// Increase circle sizes (2 occurrences)
content = content.replace(/<div className="w-\[160px\] h-\[160px\] relative">/g, '<div className="w-[220px] h-[220px] relative">');

// Update Pie inner/outer radii
content = content.replace(
  '<Pie data={customSalesPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} stroke="none" dataKey="value">',
  '<Pie data={customSalesPieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} stroke="none" dataKey="value">'
);
content = content.replace(
  '<Pie data={customExpensePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} stroke="none" dataKey="value">',
  '<Pie data={customExpensePieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} stroke="none" dataKey="value">'
);

// Update center text to fit large numbers
content = content.replace(
  '<span className="text-white font-black text-lg">{gbp(customSalesPieTotal)}</span>',
  '<span className="text-white font-black text-xl tracking-tighter truncate w-full text-center px-1">{gbp(customSalesPieTotal)}</span>'
);
content = content.replace(
  '<span className="text-white font-black text-lg">{gbp(customExpensePieTotal)}</span>',
  '<span className="text-white font-black text-xl tracking-tighter truncate w-full text-center px-1">{gbp(customExpensePieTotal)}</span>'
);

// Add closing div for top row
content = content.replace(
  '{/* Supplier Purchases */}',
  '</div>\n\n                  {/* Bottom Row: Supplier Purchases */}'
);

// Make Supplier Purchases taller
content = content.replace(
  '<div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl flex flex-col w-full h-full min-h-[250px]">',
  '<div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl flex flex-col w-full h-[350px]">'
);

// Adjust headers and spacing
content = content.replace(
  '<h2 className="text-white font-bold mb-4 self-start">Sales Mix</h2>',
  '<h2 className="text-white font-bold mb-6 self-start text-lg">Sales Mix</h2>'
);
content = content.replace(
  '<h2 className="text-white font-bold mb-4 self-start">Expense Breakdown</h2>',
  '<h2 className="text-white font-bold mb-6 self-start text-lg">Expense Breakdown</h2>'
);

// Increase gap for legends
content = content.replace(/<div className="flex-1 pl-6 flex flex-col gap-2">/g, '<div className="flex-1 pl-8 flex flex-col gap-3">');

// Make legends slightly bigger font
content = content.replace(/<div key=\{i\} className="flex justify-between items-center text-xs">/g, '<div key={i} className="flex justify-between items-center text-[13px]">');
content = content.replace(/<span className="w-2.5 h-2.5 rounded-full"/g, '<span className="w-3 h-3 rounded-full"');

fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content);
console.log('Layout customized with string replacements.');
