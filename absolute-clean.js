const fs = require('fs');

let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

// The original corrupted file ends like this:
//           </div>
//         </div>
//         </div>
//           </>
//           )}
//       {/* --- END VISUAL DASHBOARD --- */}
content = content.replace(/\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/>\s*\)\}/g, "\n        </div>\n        </div>\n        </div>");

// Also replace the old tab UI that I originally injected
// In `backup_session_end.zip`, did I already inject the horizontal tabs? 
// The zip was made right after the user complained about horizontal tabs, so they are probably in there.
// If they are, I should remove them.
const tabsNavRegex = /\{\/\* Tab Navigation \*\/\}(.|\n)*?<\/div>\s*<div className=\{activeTab === 'overview' \? '' : 'hidden'\}>/;
if (content.match(tabsNavRegex)) {
  content = content.replace(tabsNavRegex, `<div className={activeTab === 'overview' ? 'flex flex-col gap-8 w-full' : 'hidden'}>`);
} else {
  content = content.replace(`{/* Primary KPIs - 5 cards */}`, `<div className={activeTab === 'overview' ? 'flex flex-col gap-8' : 'hidden'}>\n        {/* Primary KPIs - 5 cards */}`);
}

if (!content.includes('from \'recharts\'')) {
  content = content.replace(
    `import { useSession } from 'next-auth/react'`,
    `import { useSession } from 'next-auth/react'\nimport { useSearchParams } from 'next/navigation'\nimport { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'`
  );
}

if (!content.includes('const searchParams')) {
  content = content.replace(
    `const [expandAll, setExpandAll] = useState(true)`,
    `const [expandAll, setExpandAll] = useState(true)\n  const searchParams = useSearchParams()\n  const activeTab = searchParams?.get('tab') || 'overview'`
  );
}

const dataAndCharts = `
  const weeklyData = [
    { name: 'Week 1', sales: 12400, orders: 420, suppliers: 3100 },
    { name: 'Week 2', sales: 14200, orders: 480, suppliers: 3400 },
    { name: 'Week 3', sales: 11800, orders: 390, suppliers: 2900 },
    { name: 'Week 4', sales: 15600, orders: 520, suppliers: 3800 }
  ];

  const monthlyData = [
    { name: 'Month 1', sales: 52400, orders: 1720, suppliers: 14100 },
    { name: 'Month 2', sales: 58200, orders: 1880, suppliers: 16400 },
    { name: 'Month 3', sales: 49800, orders: 1590, suppliers: 12900 },
    { name: 'Month 4', sales: 61600, orders: 2120, suppliers: 17800 }
  ];

  const offersData = [
    { platform: 'Facebook Marketing', spend: 350, revenue: 1200, ROI: '242%' },
    { platform: 'Instagram Marketing', spend: 200, revenue: 850, ROI: '325%' },
    { platform: 'Google Ads', spend: 450, revenue: 2100, ROI: '366%' },
    { platform: 'Uber Eats (BOGO)', spend: 180, revenue: 940, ROI: '422%' },
    { platform: 'Deliveroo (20% Off)', spend: 220, revenue: 1150, ROI: '422%' }
  ];

`;
if(!content.includes('const weeklyData')) {
  content = content.replace(`const activeTab = searchParams?.get('tab') || 'overview'`, `const activeTab = searchParams?.get('tab') || 'overview'\n${dataAndCharts}`);
}

const visualEnd = `          </div>\n        </div>\n        </div>\n      {/* --- END VISUAL DASHBOARD --- */}`;
const replaceVisualEnd = `          </div>\n        </div>\n        </div>\n        </div>\n\n        {/* --- WEEKLY TAB --- */}
        <div className={activeTab === 'weekly' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-2 gap-8 w-full mt-2">
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Weekly Orders</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar dataKey="orders" fill="#f97316" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Weekly Sales (£)</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Sales vs Orders</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis yAxisId="left" stroke="#3b82f6"/><YAxis yAxisId="right" orientation="right" stroke="#f97316"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]}/><Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Supplier Purchases (£)</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar dataKey="suppliers" fill="#eab308" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
          </div>
        </div>

        {/* --- MONTHLY TAB --- */}
        <div className={activeTab === 'monthly' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-2 gap-8 w-full mt-2">
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Monthly Orders</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar dataKey="orders" fill="#f97316" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Monthly Sales (£)</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Sales vs Orders</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis yAxisId="left" stroke="#3b82f6"/><YAxis yAxisId="right" orientation="right" stroke="#f97316"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]}/><Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>
            <div className="bg-[#111520] border border-[#1f2947] rounded-2xl p-6 shadow-xl h-[350px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-4">Supplier Purchases (£)</h2>
              <div className="flex-1 min-h-0 w-full"><ResponsiveContainer width="99%" height="99%"><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false}/><XAxis dataKey="name" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947'}}/><Bar dataKey="suppliers" fill="#eab308" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
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
                  {offersData.map((o, i) => (
                    <tr key={i}><td className="py-4 text-white font-medium">{o.platform}</td><td className="py-4 text-red-400 text-right">£{o.spend}</td><td className="py-4 text-blue-400 text-right">£{o.revenue}</td><td className="py-4 text-emerald-400 font-bold text-right">{o.ROI}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* --- END VISUAL DASHBOARD --- */}`;

content = content.replace(visualEnd, replaceVisualEnd);

fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content, 'utf8');
console.log('Final successful injection.');