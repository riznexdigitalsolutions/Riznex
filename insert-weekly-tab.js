const fs = require('fs');
let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

const startIndex = content.indexOf('{/* --- WEEKLY TAB --- */}');
const endIndex = content.indexOf('{/* --- MONTHLY TAB --- */}');

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find WEEKLY or MONTHLY tab markers.');
    process.exit(1);
}

const uiBlock = `{/* --- WEEKLY TAB --- */}
          <div className={activeTab === 'weekly' ? 'block' : 'hidden'}>
            {curr6Stats.weeklyData.length > 0 ? (
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-8 shadow-2xl flex flex-col relative overflow-hidden z-0 w-full">
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/10 blur-[100px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
              
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">Weekly Comparison</h2>
                  <p className="text-slate-400 mt-1">Last {curr6Stats.weeklyData.length} Weeks</p>
                </div>
              </div>

              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Sales */}
                <div className="bg-[#0e121b] border border-[#1f2947] rounded-2xl p-5 shadow-lg flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Sales</div>
                      <div className="text-2xl font-black text-white">{gbp(curr6Stats.totalSales)}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className={\`text-sm font-bold \${trendSales >= 0 ? 'text-emerald-400' : 'text-red-400'}\`}>
                      {trendSales >= 0 ? '↑' : '↓'} {Math.abs(trendSales).toFixed(1)}% <span className="text-slate-500 font-normal text-xs ml-1">vs prev {curr6Stats.weeklyData.length}w</span>
                    </div>
                    <div className="h-10 w-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={curr6Stats.weeklyData}>
                          <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Orders */}
                <div className="bg-[#0e121b] border border-[#1f2947] rounded-2xl p-5 shadow-lg flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Orders</div>
                      <div className="text-2xl font-black text-white">{curr6Stats.totalOrders}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className={\`text-sm font-bold \${trendOrders >= 0 ? 'text-emerald-400' : 'text-red-400'}\`}>
                      {trendOrders >= 0 ? '↑' : '↓'} {Math.abs(trendOrders).toFixed(1)}% <span className="text-slate-500 font-normal text-xs ml-1">vs prev {curr6Stats.weeklyData.length}w</span>
                    </div>
                    <div className="h-10 w-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={curr6Stats.weeklyData}>
                          <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={2} dot={false} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* AOV */}
                <div className="bg-[#0e121b] border border-[#1f2947] rounded-2xl p-5 shadow-lg flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Order Value</div>
                      <div className="text-2xl font-black text-white">{gbp(curr6Stats.aov)}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className={\`text-sm font-bold \${trendAov >= 0 ? 'text-emerald-400' : 'text-red-400'}\`}>
                      {trendAov >= 0 ? '↑' : '↓'} {Math.abs(trendAov).toFixed(1)}% <span className="text-slate-500 font-normal text-xs ml-1">vs prev {curr6Stats.weeklyData.length}w</span>
                    </div>
                    <div className="h-10 w-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={curr6Stats.weeklyData}>
                          <Line type="monotone" dataKey="aov" stroke="#a855f7" strokeWidth={2} dot={false} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Net Profit */}
                <div className="bg-[#0e121b] border border-[#1f2947] rounded-2xl p-5 shadow-lg flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Net Revenue</div>
                      <div className="text-2xl font-black text-white">{gbp(curr6Stats.totalProfit)}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className={\`text-sm font-bold \${trendProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}\`}>
                      {trendProfit >= 0 ? '↑' : '↓'} {Math.abs(trendProfit).toFixed(1)}% <span className="text-slate-500 font-normal text-xs ml-1">vs prev {curr6Stats.weeklyData.length}w</span>
                    </div>
                    <div className="h-10 w-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={curr6Stats.weeklyData}>
                          <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={false} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Chart */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4">Weekly Sales & Orders</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={curr6Stats.weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickMargin={15} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#64748b" tick={{ fill: '#3b82f6', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => '£' + (v >= 1000 ? (v/1000).toFixed(0) + 'K' : v)} />
                      <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fill: '#f97316', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} labelStyle={{ color: '#94a3b8', marginBottom: '8px' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '10px' }} />
                      <Bar yAxisId="left" name="Sales (£)" dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60}>
                        <LabelList dataKey="sales" position="top" fill="#3b82f6" fontSize={11} fontWeight="bold" formatter={(v) => gbp(v)} />
                      </Bar>
                      <Bar yAxisId="right" name="Orders" dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={60}>
                        <LabelList dataKey="orders" position="top" fill="#f97316" fontSize={11} fontWeight="bold" />
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-[#1f2947] rounded-xl">
                <table className="w-full text-sm text-center">
                  <thead className="bg-[#0e121b]">
                    <tr>
                      <th className="p-4 text-left font-bold text-slate-300 border-b border-[#1f2947]">Week</th>
                      {curr6Stats.weeklyData.map((w, i) => (
                        <th key={i} className="p-4 font-bold text-slate-300 border-b border-l border-[#1f2947]">
                          <div className="text-white">{w.name}</div>
                          <div className="text-xs text-slate-500 font-normal">{w.dateRange}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2947]">
                    <tr>
                      <td className="p-4 text-left font-semibold text-slate-300 flex items-center gap-2 whitespace-nowrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Sales (£)
                      </td>
                      {curr6Stats.weeklyData.map((w, i) => (
                        <td key={i} className="p-4 font-bold text-blue-400 border-l border-[#1f2947] whitespace-nowrap">{gbp(w.sales)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-left font-semibold text-slate-300 flex items-center gap-2 whitespace-nowrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Orders
                      </td>
                      {curr6Stats.weeklyData.map((w, i) => (
                        <td key={i} className="p-4 font-bold text-orange-400 border-l border-[#1f2947] whitespace-nowrap">{w.orders}</td>
                      ))}
                    </tr>
                    <tr className="bg-[#0e121b]/50">
                      <td className="p-4 text-left font-semibold text-slate-300 flex items-center gap-2 whitespace-nowrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Avg. Order Value
                      </td>
                      {curr6Stats.weeklyData.map((w, i) => (
                        <td key={i} className="p-4 font-medium text-slate-400 border-l border-[#1f2947] whitespace-nowrap">{gbp(w.aov)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            ) : (
              <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center text-center mt-6 w-full">
                <h2 className="text-3xl font-black text-white mb-3">No Data Available</h2>
                <p className="text-slate-400 max-w-md">There are no sales records available for the selected period.</p>
              </div>
            )}
          </div>

        `;

const newContent = content.slice(0, startIndex) + uiBlock + content.slice(endIndex);
fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', newContent);
console.log('WEEKLY TAB REPLACED.');
