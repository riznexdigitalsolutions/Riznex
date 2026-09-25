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
            <div className="bg-[#f8f9fa] border border-gray-200 rounded-[2rem] p-6 lg:p-10 shadow-sm flex flex-col w-full text-gray-900 font-sans">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-[#0a1128]">Weekly Comparison</h2>
                  <p className="text-lg text-gray-500 font-medium mt-1">Last {curr6Stats.weeklyData.length} Weeks</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm font-bold text-gray-700 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-gray-50 transition">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Last {curr6Stats.weeklyData.length} Weeks
                  <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Sales */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#3b82f6] flex flex-shrink-0 items-center justify-center shadow-lg shadow-blue-500/30">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Sales</div>
                    <div className="text-3xl font-black text-[#0a1128] mb-1">{gbp(curr6Stats.totalSales)}</div>
                    <div className="flex items-center gap-1.5 text-[13px]">
                      <span className={\`font-bold \${trendSales >= 0 ? 'text-[#10b981]' : 'text-red-500'}\`}>
                        {trendSales >= 0 ? '↑' : '↓'} {Math.abs(trendSales).toFixed(1)}%
                      </span>
                      <span className="text-gray-400 font-medium">vs previous {curr6Stats.weeklyData.length} weeks</span>
                    </div>
                  </div>
                </div>
                
                {/* Orders */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#f97316] flex flex-shrink-0 items-center justify-center shadow-lg shadow-orange-500/30">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Orders</div>
                    <div className="text-3xl font-black text-[#0a1128] mb-1">{curr6Stats.totalOrders}</div>
                    <div className="flex items-center gap-1.5 text-[13px]">
                      <span className={\`font-bold \${trendOrders >= 0 ? 'text-[#10b981]' : 'text-red-500'}\`}>
                        {trendOrders >= 0 ? '↑' : '↓'} {Math.abs(trendOrders).toFixed(1)}%
                      </span>
                      <span className="text-gray-400 font-medium">vs previous {curr6Stats.weeklyData.length} weeks</span>
                    </div>
                  </div>
                </div>

                {/* AOV */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#a855f7] flex flex-shrink-0 items-center justify-center shadow-lg shadow-purple-500/30">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Average Order Value</div>
                    <div className="text-3xl font-black text-[#0a1128] mb-1">{gbp(curr6Stats.aov)}</div>
                    <div className="flex items-center gap-1.5 text-[13px]">
                      <span className={\`font-bold \${trendAov >= 0 ? 'text-[#10b981]' : 'text-red-500'}\`}>
                        {trendAov >= 0 ? '↑' : '↓'} {Math.abs(trendAov).toFixed(1)}%
                      </span>
                      <span className="text-gray-400 font-medium">vs previous {curr6Stats.weeklyData.length} weeks</span>
                    </div>
                  </div>
                </div>

                {/* Net Profit */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#10b981] flex flex-shrink-0 items-center justify-center shadow-lg shadow-emerald-500/30">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Net Profit</div>
                    <div className="text-3xl font-black text-[#0a1128] mb-1">{gbp(curr6Stats.totalProfit)}</div>
                    <div className="flex items-center gap-1.5 text-[13px]">
                      <span className={\`font-bold \${trendProfit >= 0 ? 'text-[#10b981]' : 'text-red-500'}\`}>
                        {trendProfit >= 0 ? '↑' : '↓'} {Math.abs(trendProfit).toFixed(1)}%
                      </span>
                      <span className="text-gray-400 font-medium">vs previous {curr6Stats.weeklyData.length} weeks</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Chart */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-[#0a1128]">Weekly Sales & Orders</h3>
                  <div className="flex items-center gap-6 text-[15px] font-bold">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#3b82f6]"></span> 
                      <span className="text-gray-600">Sales (£)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#f97316]"></span> 
                      <span className="text-gray-600">Orders</span>
                    </div>
                  </div>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={curr6Stats.weeklyData} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={true} horizontal={true} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#cbd5e1" 
                        tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 700 }} 
                        tickMargin={16} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <YAxis 
                        yAxisId="left" 
                        stroke="#cbd5e1" 
                        tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(v: any) => '£' + (v >= 1000 ? (v/1000).toFixed(0) + 'k' : v)} 
                        dx={-10}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#cbd5e1" 
                        tick={{ fill: '#f97316', fontSize: 13, fontWeight: 600 }} 
                        axisLine={false} 
                        tickLine={false} 
                        dx={10}
                      />
                      <Tooltip cursor={{ fill: '#f8f9fa' }} contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                      
                      <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={70}>
                        <LabelList dataKey="sales" position="top" fill="#2563eb" fontSize={15} fontWeight="900" formatter={(v: any) => gbp(v as number)} offset={12} />
                      </Bar>
                      <Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} maxBarSize={70}>
                        <LabelList dataKey="orders" position="top" fill="#ea580c" fontSize={15} fontWeight="900" offset={12} />
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {curr6Stats.weeklyData.map((w: any, i: number) => (
                  <div key={i} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col">
                    <div className="mb-5">
                      <div className="text-lg font-black text-[#0a1128] mb-1">{w.name}</div>
                      <div className="text-[13px] font-semibold text-gray-400">{w.dateRange}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <div className="bg-[#eff6ff] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                        <div className="text-xl font-black text-[#2563eb] mb-1">{gbp(w.sales)}</div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Sales</div>
                      </div>
                      <div className="bg-[#fff7ed] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                        <div className="text-xl font-black text-[#ea580c] mb-1">{w.orders}</div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Orders</div>
                      </div>
                    </div>
                  </div>
                ))}
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
console.log('WEEKLY TAB REPLACED WITH EXACT LIGHT THEME.');
