const fs = require('fs');
let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

const uiBlock = `
                {/* 3 Bottom Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mb-8">
                  {/* Sales Mix */}
                  <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl flex flex-col items-center">
                    <h2 className="text-white font-bold mb-4 self-start">Sales Mix</h2>
                    <div className="flex w-full items-center">
                      <div className="w-[160px] h-[160px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={customSalesPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} stroke="none" dataKey="value">
                              {customSalesPieData.map((e, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                            </Pie>
                            <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => gbp(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-white font-black text-lg">{gbp(customSalesPieTotal)}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Total Sales</span>
                        </div>
                      </div>
                      <div className="flex-1 pl-6 flex flex-col gap-2">
                        {customSalesPieData.map((d, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartColors[i % chartColors.length] }}></span>
                              <span className="text-slate-300 font-medium">{d.name}</span>
                            </div>
                            <span className="text-slate-400">{((d.value / (customSalesPieTotal || 1)) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl flex flex-col items-center">
                    <h2 className="text-white font-bold mb-4 self-start">Expense Breakdown</h2>
                    <div className="flex w-full items-center">
                      <div className="w-[160px] h-[160px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={customExpensePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} stroke="none" dataKey="value">
                              {customExpensePieData.map((e, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                            </Pie>
                            <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => gbp(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-white font-black text-lg">{gbp(customExpensePieTotal)}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase text-center leading-tight mt-1">Total<br/>Expenses</span>
                        </div>
                      </div>
                      <div className="flex-1 pl-6 flex flex-col gap-2">
                        {customExpensePieData.map((d, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartColors[i % chartColors.length] }}></span>
                              <span className="text-slate-300 font-medium truncate max-w-[90px]" title={d.name}>{d.name}</span>
                            </div>
                            <span className="text-slate-400 shrink-0">{((d.value / (customExpensePieTotal || 1)) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Supplier Purchases */}
                  <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl flex flex-col w-full h-full min-h-[250px]">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-white font-bold">Supplier Purchases</h2>
                      <span className="text-[10px] bg-[#1f2947] text-slate-300 px-2 py-1 rounded border border-[#2a3454] uppercase font-bold tracking-wider">Last 4 Weeks</span>
                    </div>
                    <div className="flex-1 min-h-0 w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={displayWeeklyData} margin={{ top: 15, right: 0, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} tickMargin={8} axisLine={false} tickLine={false} />
                          <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: any) => '£' + (v >= 1000 ? (v/1000).toFixed(1) + 'k' : v)} />
                          <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => gbp(v)} />
                          <Bar dataKey="suppliers" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={40}>
                            <LabelList dataKey="suppliers" position="top" fill="#10b981" fontSize={11} fontWeight="bold" formatter={(v: any) => '£' + v.toLocaleString()} offset={6} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>`;

const regex = /(<Bar yAxisId="right" dataKey="orders"[\s\S]*?<\/ComposedChart>\s*<\/ResponsiveContainer>\s*<\/div>\s*<\/div>)/;

if (regex.test(content)) {
    content = content.replace(regex, "$1\n" + uiBlock);
    fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content);
    console.log('UI block injected successfully.');
} else {
    console.error("Could not find regex pattern.");
    process.exit(1);
}
