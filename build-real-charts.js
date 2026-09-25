const fs = require('fs');
const path = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// Ensure recharts is imported
if (!content.includes('from \'recharts\'')) {
  content = content.replace(
    `import { useSearchParams } from 'next/navigation'`,
    `import { useSearchParams } from 'next/navigation'\nimport { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'`
  );
}

// 4-Week Data Array
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

// 4-Month Data Array
const mockMonthlyData = `
  const monthlyData = [
    { name: 'Month 1', sales: 52400, orders: 1720, suppliers: 14100 },
    { name: 'Month 2', sales: 58200, orders: 1880, suppliers: 16400 },
    { name: 'Month 3', sales: 49800, orders: 1590, suppliers: 12900 },
    { name: 'Month 4', sales: 61600, orders: 2120, suppliers: 17800 }
  ];
`;
if (!content.includes('const monthlyData')) {
  content = content.replace(`const activeTab = searchParams?.get('tab') || 'overview'`, `const activeTab = searchParams?.get('tab') || 'overview'\n${mockMonthlyData}`);
}

// Inject Weekly UI replacing the placeholder
const weeklyRegex = /<div className=\{activeTab === 'weekly' \? 'block' : 'hidden'\}>[\s\S]*?(?=<\/div>\s*<div className=\{activeTab === 'monthly')<\/div>/;

const weeklyCharts = `<div className={activeTab === 'weekly' ? 'block flex-1' : 'hidden'}>
          <div className="grid grid-cols-2 gap-6 mt-6">
            
            {/* Chart 1: Orders */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-6 shadow-2xl flex flex-col">
              <h2 className="text-lg font-black text-white mb-4">Weekly Orders (4-Week Trend)</h2>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '12px'}} />
                    <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} name="Total Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Sales */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-6 shadow-2xl flex flex-col">
              <h2 className="text-lg font-black text-white mb-4">Weekly Sales (4-Week Trend)</h2>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '12px'}} />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Gross Sales (£)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Combined */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-6 shadow-2xl flex flex-col">
              <h2 className="text-lg font-black text-white mb-4">Sales vs Orders</h2>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis yAxisId="left" stroke="#3b82f6" tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f97316" tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '12px'}} />
                    <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Gross Sales (£)" />
                    <Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} name="Total Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Suppliers */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-6 shadow-2xl flex flex-col">
              <h2 className="text-lg font-black text-white mb-4">Supplier Purchases</h2>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '12px'}} />
                    <Bar dataKey="suppliers" fill="#eab308" radius={[4, 4, 0, 0]} name="Supplier Expenses (£)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>`;

content = content.replace(weeklyRegex, weeklyCharts);

const monthlyRegex = /<div className=\{activeTab === 'monthly' \? 'block' : 'hidden'\}>[\s\S]*?(?=<\/div>\s*<div className=\{activeTab === 'offers')<\/div>/;

const monthlyCharts = `<div className={activeTab === 'monthly' ? 'block flex-1' : 'hidden'}>
          <div className="grid grid-cols-2 gap-6 mt-6">
            
            {/* Chart 1: Orders */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-6 shadow-2xl flex flex-col">
              <h2 className="text-lg font-black text-white mb-4">Monthly Orders (4-Month Trend)</h2>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '12px'}} />
                    <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} name="Total Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Sales */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-6 shadow-2xl flex flex-col">
              <h2 className="text-lg font-black text-white mb-4">Monthly Sales (4-Month Trend)</h2>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '12px'}} />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Gross Sales (£)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Combined */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-6 shadow-2xl flex flex-col">
              <h2 className="text-lg font-black text-white mb-4">Sales vs Orders</h2>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis yAxisId="left" stroke="#3b82f6" tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f97316" tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '12px'}} />
                    <Bar yAxisId="left" dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Gross Sales (£)" />
                    <Bar yAxisId="right" dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} name="Total Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Suppliers */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-6 shadow-2xl flex flex-col">
              <h2 className="text-lg font-black text-white mb-4">Supplier Purchases</h2>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2947" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '12px'}} />
                    <Bar dataKey="suppliers" fill="#eab308" radius={[4, 4, 0, 0]} name="Supplier Expenses (£)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>`;

content = content.replace(monthlyRegex, monthlyCharts);

fs.writeFileSync(path, content, 'utf8');
console.log('Real Recharts built in 2x2 grid!');