const fs = require('fs');
let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

// The replacement text (using real data now)
const replaceVisualEnd = `
        </div>
        </div>
        </div>

        {/* --- WEEKLY TAB --- */}
        <div className={activeTab === 'weekly' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-2 gap-8 w-full mt-2">
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Weekly Orders</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={displayWeeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar dataKey="orders" fill="#f97316" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Weekly Sales (£)</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={displayWeeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Sales vs Orders</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={displayWeeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis yAxisId="left" stroke="#3b82f6"/><YAxis yAxisId="right" orientation="right" stroke="#f97316"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]}/><Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Supplier Purchases (£)</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={displayWeeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar dataKey="suppliers" fill="#eab308" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
          </div>
        </div>

        {/* --- MONTHLY TAB --- */}
        <div className={activeTab === 'monthly' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-2 gap-8 w-full mt-2">
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Monthly Orders</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={displayMonthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar dataKey="orders" fill="#f97316" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Monthly Sales (£)</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={displayMonthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Sales vs Orders</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={displayMonthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis yAxisId="left" stroke="#3b82f6"/><YAxis yAxisId="right" orientation="right" stroke="#f97316"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]}/><Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Supplier Purchases (£)</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={displayMonthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar dataKey="suppliers" fill="#eab308" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
          </div>
        </div>

        {/* --- OFFERS TAB --- */}
        <div className={activeTab === 'offers' ? 'block' : 'hidden'}>
          <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-8 shadow-xl mt-2 w-full">
            <h2 className="text-xl font-bold text-white mb-6">Marketing & Offers ROI</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="text-slate-400 border-b border-[#1f2947]"><th className="pb-4">Platform</th><th className="pb-4 text-right">Spend</th><th className="pb-4 text-right">Revenue</th><th className="pb-4 text-right">ROI</th></tr></thead>
                <tbody className="divide-y divide-[#1f2947]">
                  {realOffersData.map((o, i) => (
                    <tr key={i}><td className="py-4 text-white font-medium">{o.platform}</td><td className="py-4 text-red-400 text-right">£{o.spend}</td><td className="py-4 text-blue-400 text-right">£{o.revenue}</td><td className="py-4 text-emerald-400 font-bold text-right">{o.ROI}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      {/* --- END VISUAL DASHBOARD --- */}
`;

const parts = content.split('{/* --- END VISUAL DASHBOARD --- */}');
if (parts.length === 2) {
  // Only inject if it hasn't been injected yet
  if (!content.includes('WEEKLY TAB')) {
    // We need to also remove one `</div>` from the end of parts[0] to match the wrapper logic if we are wrapping
    const p0 = parts[0].replace(/\s*<\/div>\s*<\/div>\s*<\/div>\s*$/, '');
    content = p0 + replaceVisualEnd + parts[1];
    fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content, 'utf8');
    console.log('SUCCESS INJECTING CHARTS.');
  } else {
    console.log('ALREADY INJECTED.');
  }
} else {
  console.log('FAILED TO SPLIT ON END VISUAL DASHBOARD. Found', parts.length, 'parts.');
}