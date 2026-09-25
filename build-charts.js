const fs = require('fs');
const path = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// Import recharts if not present
if (!content.includes('from \'recharts\'')) {
  content = content.replace(
    `import { useSearchParams } from 'next/navigation'`,
    `import { useSearchParams } from 'next/navigation'\nimport { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'`
  );
}

const mockWeeklyData = `
  const weeklyData = [
    { name: 'Week 1', sales: 12400, orders: 420, suppliers: 3100 },
    { name: 'Week 2', sales: 14200, orders: 480, suppliers: 3400 },
    { name: 'Week 3', sales: 11800, orders: 390, suppliers: 2900 },
    { name: 'Week 4', sales: 15600, orders: 520, suppliers: 3800 }
  ];
`;

if (!content.includes('const weeklyData')) {
  content = content.replace(`const activeTab = searchParams?.get('tab') || 'overview'`, `const activeTab = searchParams?.get('tab') || 'overview'\n${mockWeeklyData}`);
}

const weeklyCharts = `        <div className={activeTab === 'weekly' ? 'block flex-1' : 'hidden'}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            
            {/* Chart 1: Orders */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-8 shadow-2xl">
              <h2 className="text-xl font-black text-white mb-6">Weekly Orders (4-Week Trend)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '12px'}} />
                    <Bar dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} name="Total Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Sales */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-8 shadow-2xl">
              <h2 className="text-xl font-black text-white mb-6">Weekly Sales (4-Week Trend)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '12px'}} />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Gross Sales (£)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Combined Sales & Orders */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-8 shadow-2xl lg:col-span-2">
              <h2 className="text-xl font-black text-white mb-6">Sales vs Orders (Grouped Comparison)</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis yAxisId="left" stroke="#3b82f6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#f97316" />
                    <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '12px'}} />
                    <Legend wrapperStyle={{paddingTop: '20px'}} />
                    <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Gross Sales (£)" />
                    <Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} name="Total Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Supplier Purchases */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-8 shadow-2xl lg:col-span-2 mt-4">
              <h2 className="text-xl font-black text-white mb-6">Supplier Purchases (4-Week Trend)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '12px'}} />
                    <Bar dataKey="suppliers" fill="#eab308" radius={[6, 6, 0, 0]} name="Supplier Expenses (£)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>`;

const searchPlaceholder = `        <div className={activeTab === 'weekly' ? 'block' : 'hidden'}>
          <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center text-center mt-6">
            <h2 className="text-3xl font-black text-white mb-3">Weekly Comparison</h2>
            <p className="text-slate-400 max-w-md">The 4-week comparison charts for Orders, Sales, and Supplier Buying are being built here!</p>
          </div>
        </div>`;

content = content.replace(searchPlaceholder, weeklyCharts);

fs.writeFileSync(path, content, 'utf8');
console.log('Bar Charts Built.');