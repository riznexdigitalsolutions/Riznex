const fs = require('fs');

let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

const startIndex = content.indexOf('{/* --- WEEKLY TAB --- */}');
const endIndex = content.indexOf('{/* --- MONTHLY TAB --- */}');

if (startIndex === -1 || endIndex === -1) {
    console.error('original markers not found');
    process.exit(1);
}

const newWeeklyTab = `{/* --- WEEKLY TAB --- */}
          <div className={activeTab === 'weekly' ? 'block' : 'hidden'}>
            {curr6Stats.weeklyData.length > 0 ? (
            <div className="w-full mt-2">

              {/* Main Chart (Dark Theme) */}
              <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[500px] flex flex-col w-full mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white font-bold uppercase tracking-wide text-sm">
                    <span className="text-blue-400 mr-2">1.</span>WEEKLY SALES & ORDERS
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
                    <ComposedChart data={curr6Stats.weeklyData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
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
                      <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} />
                      
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

              {/* Bottom Cards Row (Dark Theme) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {curr6Stats.weeklyData.map((w: any, i: number) => (
                  <div key={i} className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl flex flex-col">
                    <div className="mb-5">
                      <div className="text-lg font-black text-white mb-1">{w.name}</div>
                      <div className="text-[13px] font-semibold text-slate-400">{w.dateRange}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <div className="bg-[#0a0c14] border border-[#1f2947] rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <div className="text-xl font-black text-blue-400 mb-1">{gbp(w.sales)}</div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Sales</div>
                      </div>
                      <div className="bg-[#0a0c14] border border-[#1f2947] rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <div className="text-xl font-black text-orange-400 mb-1">{w.orders}</div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Orders</div>
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

content = content.slice(0, startIndex) + newWeeklyTab + '\n        ' + content.slice(endIndex);

// Update Header (Center Weekly Comparison and remove Last 6 Weeks completely)
const oldHeaderRegex = /<div className="flex items-center gap-4 flex-wrap">[\s\S]*?<h1 className="text-3xl font-black text-white tracking-tight">[\s\S]*?<\/h1>[\s\S]*?<p className="text-slate-400 mt-1 font-medium">{getDynamicSubtitle\(\)}<\/p>\s*<\/div>\s*<\/div>/;

const newHeader = `<div className={\`flex items-center flex-wrap \${activeTab === 'weekly' ? 'justify-center w-full' : 'gap-4'}\`}>
            {/* Dynamic Logos on Left Side */}
            <div className={\`flex items-center gap-2 \${activeTab === 'weekly' ? 'hidden' : ''}\`}>
              {(store === '' || store === 'Herbies Pizza') && (
                <img
                  src="/logos/herbies-pizza.jpg"
                  alt="Herbies Pizza"
                  className="w-11 h-11 rounded-xl object-cover border border-[#1f2947] shadow-md"
                />
              )}
              {(store === '' || store === 'Tasty Bun') && (
                <img
                  src="/logos/tasty-bun.jpg"
                  alt="Tasty Bun"
                  className="w-11 h-11 rounded-xl object-cover border border-[#1f2947] shadow-md"
                />
              )}
            </div>

            <div className={activeTab === 'weekly' ? 'text-center' : ''}>
              <h1 className="text-3xl font-black text-white tracking-tight">
                {activeTab === 'weekly' ? 'Weekly Comparison' : (session?.user?.clientName ?? 'Henley on Thames')}
              </h1>
              <p className={\`text-slate-400 mt-1 font-medium \${activeTab === 'weekly' ? 'hidden' : ''}\`}>{getDynamicSubtitle()}</p>
            </div>
          </div>`;

content = content.replace(oldHeaderRegex, newHeader);

fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content);
console.log('Fixed completely.');
