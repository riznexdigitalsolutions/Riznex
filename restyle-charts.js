const fs = require('fs');
let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

if (!content.includes('ComposedChart')) {
  content = content.replace(
    /import \{ BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer \} from 'recharts'/,
    "import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, LabelList } from 'recharts'"
  );
}

// Function to generate the beautifully styled charts based exactly on the image
const generateTabs = () => `
        {/* --- WEEKLY TAB --- */}
        <div className={activeTab === 'weekly' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-2 gap-6 w-full mt-2">
            
            <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[400px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-6 uppercase tracking-wide text-sm"><span className="text-blue-400 mr-2">1.</span>SALES <span className="text-slate-400 normal-case font-normal">(Last 4 Weeks)</span></h2>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="99%" height="99%">
                  <BarChart data={displayWeeklyData} margin={{top: 30, right: 10, left: 10, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/>
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(v) => '£' + (v/1000) + 'K'}/>
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff'}} formatter={(v) => gbp(v)}/>
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={60}>
                      <LabelList dataKey="sales" position="top" fill="#3b82f6" fontSize={12} fontWeight="bold" formatter={(v) => gbp(v)}/>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[400px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-6 uppercase tracking-wide text-sm"><span className="text-orange-500 mr-2">2.</span>ORDERS <span className="text-slate-400 normal-case font-normal">(Last 4 Weeks)</span></h2>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="99%" height="99%">
                  <BarChart data={displayWeeklyData} margin={{top: 30, right: 10, left: 10, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/>
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false}/>
                    <YAxis stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false}/>
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff'}}/>
                    <Bar dataKey="orders" fill="#f97316" radius={[4,4,0,0]} maxBarSize={60}>
                      <LabelList dataKey="orders" position="top" fill="#f97316" fontSize={12} fontWeight="bold"/>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[400px] flex flex-col w-full">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-white font-bold uppercase tracking-wide text-sm"><span className="text-purple-400 mr-2">3.</span>COMBINED – SALES & ORDERS <span className="text-slate-400 normal-case font-normal">(Last 4 Weeks)</span></h2>
              </div>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="99%" height="99%">
                  <ComposedChart data={displayWeeklyData} margin={{top: 30, right: 10, left: 10, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/>
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false}/>
                    <YAxis yAxisId="left" stroke="#64748b" tick={{fill: '#3b82f6', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(v) => '£' + (v/1000) + 'K'}/>
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{fill: '#f97316', fontSize: 12}} axisLine={false} tickLine={false}/>
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff'}}/>
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '10px' }} />
                    <Bar yAxisId="left" name="Sales (£)" dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={60}>
                      <LabelList dataKey="sales" position="top" fill="#3b82f6" fontSize={12} fontWeight="bold" formatter={(v) => gbp(v)}/>
                    </Bar>
                    <Line yAxisId="right" name="Orders" type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} dot={{r: 5, fill: '#0a0c14', stroke: '#f97316', strokeWidth: 2}}>
                      <LabelList dataKey="orders" position="bottom" fill="#f97316" fontSize={12} fontWeight="bold" offset={10}/>
                    </Line>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[400px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-6 uppercase tracking-wide text-sm"><span className="text-emerald-400 mr-2">4.</span>SUPPLIER PURCHASES <span className="text-slate-400 normal-case font-normal">(Last 4 Weeks)</span></h2>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="99%" height="99%">
                  <BarChart data={displayWeeklyData} margin={{top: 30, right: 10, left: 10, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/>
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false}/>
                    <YAxis stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(v) => '£' + (v/1000) + 'K'}/>
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff'}} formatter={(v) => gbp(v)}/>
                    <Bar dataKey="suppliers" fill="#10b981" radius={[4,4,0,0]} maxBarSize={60}>
                      <LabelList dataKey="suppliers" position="top" fill="#10b981" fontSize={12} fontWeight="bold" formatter={(v) => gbp(v)}/>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* --- MONTHLY TAB --- */}
        <div className={activeTab === 'monthly' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-2 gap-6 w-full mt-2">
            
            <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[400px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-6 uppercase tracking-wide text-sm"><span className="text-blue-400 mr-2">1.</span>SALES <span className="text-slate-400 normal-case font-normal">(Monthly)</span></h2>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="99%" height="99%">
                  <BarChart data={displayMonthlyData} margin={{top: 30, right: 10, left: 10, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/>
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(v) => '£' + (v/1000) + 'K'}/>
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff'}} formatter={(v) => gbp(v)}/>
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={60}>
                      <LabelList dataKey="sales" position="top" fill="#3b82f6" fontSize={12} fontWeight="bold" formatter={(v) => gbp(v)}/>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[400px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-6 uppercase tracking-wide text-sm"><span className="text-orange-500 mr-2">2.</span>ORDERS <span className="text-slate-400 normal-case font-normal">(Monthly)</span></h2>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="99%" height="99%">
                  <BarChart data={displayMonthlyData} margin={{top: 30, right: 10, left: 10, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/>
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false}/>
                    <YAxis stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false}/>
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff'}}/>
                    <Bar dataKey="orders" fill="#f97316" radius={[4,4,0,0]} maxBarSize={60}>
                      <LabelList dataKey="orders" position="top" fill="#f97316" fontSize={12} fontWeight="bold"/>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[400px] flex flex-col w-full">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-white font-bold uppercase tracking-wide text-sm"><span className="text-purple-400 mr-2">3.</span>COMBINED – SALES & ORDERS <span className="text-slate-400 normal-case font-normal">(Monthly)</span></h2>
              </div>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="99%" height="99%">
                  <ComposedChart data={displayMonthlyData} margin={{top: 30, right: 10, left: 10, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/>
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false}/>
                    <YAxis yAxisId="left" stroke="#64748b" tick={{fill: '#3b82f6', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(v) => '£' + (v/1000) + 'K'}/>
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{fill: '#f97316', fontSize: 12}} axisLine={false} tickLine={false}/>
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff'}}/>
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '10px' }} />
                    <Bar yAxisId="left" name="Sales (£)" dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={60}>
                      <LabelList dataKey="sales" position="top" fill="#3b82f6" fontSize={12} fontWeight="bold" formatter={(v) => gbp(v)}/>
                    </Bar>
                    <Line yAxisId="right" name="Orders" type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} dot={{r: 5, fill: '#0a0c14', stroke: '#f97316', strokeWidth: 2}}>
                      <LabelList dataKey="orders" position="bottom" fill="#f97316" fontSize={12} fontWeight="bold" offset={10}/>
                    </Line>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[400px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-6 uppercase tracking-wide text-sm"><span className="text-emerald-400 mr-2">4.</span>SUPPLIER PURCHASES <span className="text-slate-400 normal-case font-normal">(Monthly)</span></h2>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="99%" height="99%">
                  <BarChart data={displayMonthlyData} margin={{top: 30, right: 10, left: 10, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/>
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false}/>
                    <YAxis stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(v) => '£' + (v/1000) + 'K'}/>
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff'}} formatter={(v) => gbp(v)}/>
                    <Bar dataKey="suppliers" fill="#10b981" radius={[4,4,0,0]} maxBarSize={60}>
                      <LabelList dataKey="suppliers" position="top" fill="#10b981" fontSize={12} fontWeight="bold" formatter={(v) => gbp(v)}/>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
`

// Regex to replace everything from `{/* --- WEEKLY TAB --- */}` to `{/* --- OFFERS TAB --- */}`
const startMarker = '{/* --- WEEKLY TAB --- */}';
const endMarker = '{/* --- OFFERS TAB --- */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + generateTabs() + content.substring(endIndex);
  fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content, 'utf8');
  console.log("Successfully restyled tabs to match user image!");
} else {
  console.log("Could not find markers!");
}