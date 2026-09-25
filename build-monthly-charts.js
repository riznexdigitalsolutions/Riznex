const fs = require('fs');
const path = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

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

const monthlyCharts = `        <div className={activeTab === 'monthly' ? 'block flex-1' : 'hidden'}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            
            {/* Chart 1: Orders */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-8 shadow-2xl">
              <h2 className="text-xl font-black text-white mb-6">Monthly Orders (4-Month Trend)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
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
              <h2 className="text-xl font-black text-white mb-6">Monthly Sales (4-Month Trend)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
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
                  <BarChart data={monthlyData}>
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
              <h2 className="text-xl font-black text-white mb-6">Supplier Purchases (4-Month Trend)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
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

const searchPlaceholder = `        <div className={activeTab === 'monthly' ? 'block' : 'hidden'}>
          <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center text-center mt-6">
            <h2 className="text-3xl font-black text-white mb-3">Monthly Comparison</h2>
            <p className="text-slate-400 max-w-md">The month-over-month charts are being built here!</p>
          </div>
        </div>`;

content = content.replace(searchPlaceholder, monthlyCharts);

fs.writeFileSync(path, content, 'utf8');
console.log('Monthly Bar Charts Built.');