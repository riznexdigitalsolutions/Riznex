const fs = require('fs');

let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

// 1. Tooltip readability
// We want to add itemStyle={{ color: '#fff' }} to all Tooltips.
content = content.replace(/<Tooltip cursor=\{\{ fill: '#1e293b' \}\} contentStyle=/g, '<Tooltip cursor={{ fill: \'#1e293b\' }} itemStyle={{ color: \'#fff\' }} contentStyle=');
content = content.replace(/<Tooltip cursor=\{\{fill: '#1e293b'\}\} contentStyle=/g, '<Tooltip cursor={{fill: \'#1e293b\'}} itemStyle={{ color: \'#fff\' }} contentStyle=');

// 2. Legend truncation removal
content = content.replace(
  '<span className="text-slate-300 font-medium truncate max-w-[120px]" title={d.name}>{d.name}</span>',
  '<span className="text-slate-300 font-medium whitespace-nowrap" title={d.name}>{d.name}</span>'
);

// 3. getWeeklyStats update for suppliers
content = content.replace(
  'const wProfit = wNetPaid - wAdSpends - wOtherFees;',
  'const wProfit = wNetPaid - wAdSpends - wOtherFees;\n      const wSuppliers = weeklyMap[dateStr]?.suppliers || 0;'
);
content = content.replace(
  'orders: wOrders,\n          aov: wOrders > 0 ? wSales / wOrders : 0,',
  'orders: wOrders,\n          suppliers: wSuppliers,\n          aov: wOrders > 0 ? wSales / wOrders : 0,'
);

// 4. Update Supplier Purchases Bar Chart block
const oldSupplierBlockRegex = /\{\/\* Bottom Row: Supplier Purchases \*\/\}[\s\S]*?<\/BarChart>\s*<\/ResponsiveContainer>\s*<\/div>\s*<\/div>/;

const newSupplierBlock = `{/* Bottom Row: Supplier Purchases */}
                  <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl flex flex-col w-full h-[350px]">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-white font-bold text-lg">Supplier Purchases</h2>
                      <span className="text-xs bg-[#1f2947] text-slate-300 px-3 py-1.5 rounded-md border border-[#2a3454] uppercase font-bold tracking-wider">Last 6 Weeks</span>
                    </div>
                    <div className="flex-1 min-h-0 w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={curr6Stats.weeklyData} margin={{ top: 15, right: 0, left: -25, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#64748b" 
                            tick={(props: any) => {
                              const { x, y, payload } = props;
                              const data = curr6Stats.weeklyData.find((d: any) => d.name === payload.value);
                              return (
                                <g transform={\`translate(\${x},\${y})\`}>
                                  <text x={0} y={0} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={12} fontWeight="bold">{payload.value}</text>
                                  {data?.dateRange && <text x={0} y={0} dy={32} textAnchor="middle" fill="#64748b" fontSize={11}>{data.dateRange}</text>}
                                </g>
                              );
                            }}
                            tickMargin={12} 
                            axisLine={false} 
                            tickLine={false} 
                          />
                          <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: any) => '£' + (v >= 1000 ? (v/1000).toFixed(1) + 'k' : v)} />
                          <Tooltip cursor={{ fill: '#1e293b' }} itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => gbp(v)} />
                          <Bar dataKey="suppliers" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60}>
                            <LabelList dataKey="suppliers" position="top" fill="#10b981" fontSize={13} fontWeight="bold" formatter={(v: any) => gbp(v)} offset={8} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>`;

if (oldSupplierBlockRegex.test(content)) {
    content = content.replace(oldSupplierBlockRegex, newSupplierBlock);
    fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content);
    console.log('Supplier purchases updated perfectly!');
} else {
    console.error("Could not find Supplier Purchases block to replace.");
    process.exit(1);
}
