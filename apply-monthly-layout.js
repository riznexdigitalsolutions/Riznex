const fs = require('fs');

const file = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const startIndex = content.indexOf('{/* --- MONTHLY TAB --- */}');
const endIndex = content.indexOf('{/* --- OFFERS TAB --- */}');

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find start or end index");
    process.exit(1);
}

const before = content.slice(0, startIndex);
const after = content.slice(endIndex);

const newBlock = `{/* --- MONTHLY TAB --- */}
          <div className={activeTab === 'monthly' ? 'block' : 'hidden'}>
            {displayMonthlyData.length > 0 ? (
            <div className="w-full mt-2">

              {/* Main Chart (Dark Theme) */}
              <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[500px] flex flex-col w-full mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white font-bold uppercase tracking-wide text-sm">
                    <span className="text-blue-400 mr-2">1.</span>MONTHLY SALES & ORDERS
                  </h2>
                  <div className="flex items-center gap-6 text-[13px] font-bold">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span> 
                      <span className="text-slate-300">Sales (£)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#f97316]"></span> 
                      <span className="text-slate-300">Orders</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={displayMonthlyData} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} 
                        tickMargin={12} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <YAxis 
                        yAxisId="left" 
                        stroke="#64748b" 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(v: any) => '£' + (v >= 1000 ? (v/1000).toFixed(0) + 'k' : v)} 
                        dx={-10}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#64748b" 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        axisLine={false} 
                        tickLine={false} 
                        dx={10}
                      />
                      <Tooltip cursor={{ fill: '#1e293b' }} itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any, name: string) => name === 'sales' ? gbp(v as number) : v} />
                      
                      <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60}>
                        <LabelList dataKey="sales" position="top" fill="#3b82f6" fontSize={12} fontWeight="bold" formatter={(v: any) => gbp(v as number)} offset={8} />
                      </Bar>
                      <Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={60}>
                        <LabelList dataKey="orders" position="top" fill="#f97316" fontSize={12} fontWeight="bold" offset={8} />
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 3 Bottom Widgets */}
              <div className="flex flex-col gap-6 w-full mb-8">
                {/* Top Row: 2 Pies */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                  {/* Sales Mix */}
                  <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl flex flex-col items-center">
                    <h2 className="text-white font-bold mb-6 self-start text-lg">Sales Mix</h2>
                    <div className="flex w-full items-center">
                      <div className="w-[220px] h-[220px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={customSalesPieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} stroke="none" dataKey="value">
                              {customSalesPieData.map((e, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                            </Pie>
                            <Tooltip cursor={{ fill: '#1e293b' }} itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => gbp(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2">
                          <span className="text-white font-black text-xl tracking-tighter truncate w-full text-center">{gbp(customSalesPieTotal)}</span>
                          <span className="text-[11px] text-slate-400 font-bold uppercase mt-1">Total Sales</span>
                        </div>
                      </div>
                      <div className="flex-1 pl-8 flex flex-col gap-3">
                        {customSalesPieData.map((d, i) => (
                          <div key={i} className="flex justify-between items-center text-[13px]">
                            <div className="flex items-center gap-3">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[i % chartColors.length] }}></span>
                              <span className="text-slate-300 font-medium">{d.name}</span>
                            </div>
                            <span className="text-slate-400 font-semibold">{((d.value / (customSalesPieTotal || 1)) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl flex flex-col items-center">
                    <h2 className="text-white font-bold mb-6 self-start text-lg">Expense Breakdown</h2>
                    <div className="flex w-full items-center">
                      <div className="w-[220px] h-[220px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={customExpensePieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} stroke="none" dataKey="value">
                              {customExpensePieData.map((e, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                            </Pie>
                            <Tooltip cursor={{ fill: '#1e293b' }} itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any) => gbp(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2">
                          <span className="text-white font-black text-xl tracking-tighter truncate w-full text-center">{gbp(customExpensePieTotal)}</span>
                          <span className="text-[11px] text-slate-400 font-bold uppercase text-center leading-tight mt-1">Total<br/>Expenses</span>
                        </div>
                      </div>
                      <div className="flex-1 pl-8 flex flex-col gap-3">
                        {customExpensePieData.map((d, i) => (
                          <div key={i} className="flex justify-between items-center text-[13px]">
                            <div className="flex items-center gap-3">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[i % chartColors.length] }}></span>
                              <span className="text-slate-300 font-medium whitespace-nowrap" title={d.name}>{d.name}</span>
                            </div>
                            <span className="text-slate-400 font-semibold shrink-0">{((d.value / (customExpensePieTotal || 1)) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Supplier Purchases */}
                <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl flex flex-col w-full h-[350px]">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white font-bold text-lg">Supplier Purchases</h2>
                    <span className="text-xs bg-[#1f2947] text-slate-300 px-3 py-1.5 rounded-md border border-[#2a3454] uppercase font-bold tracking-wider">Last 6 Months</span>
                  </div>
                  <div className="flex-1 min-h-0 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={displayMonthlyData} margin={{ top: 15, right: 0, left: -25, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#64748b" 
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }}
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
                </div>
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

fs.writeFileSync(file, before + newBlock + after);
console.log("Successfully rebuilt Monthly Tab.");
