const fs = require('fs');
const file = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add PieChart to imports
content = content.replace(
  /import \{ BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, LabelList \} from 'recharts'/,
  "import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, LabelList, PieChart, Pie, Cell } from 'recharts'"
);

// 2. Add New Data Logic before Offers Data
const newLogic = `
  // --- SMART INSIGHTS ---
  const currentWeek = displayWeeklyData[displayWeeklyData.length - 1] || { sales: 0 };
  const prevWeek = displayWeeklyData[displayWeeklyData.length - 2] || { sales: 0 };
  let insightMsg = "Not enough data for insights.";
  let isPositive = true;
  if (currentWeek.sales >= 0 && prevWeek.sales > 0) {
    const diff = currentWeek.sales - prevWeek.sales;
    const percent = Math.round((Math.abs(diff) / prevWeek.sales) * 100);
    isPositive = diff >= 0;
    insightMsg = isPositive 
      ? \`📈 Great job! Sales are up \${percent}% (£\${Math.abs(diff).toLocaleString()}) compared to the previous week.\`
      : \`📉 Heads up: Sales are down \${percent}% (£\${Math.abs(diff).toLocaleString()}) compared to the previous week.\`;
  } else if (currentWeek.sales > 0 && prevWeek.sales === 0) {
    insightMsg = \`📈 Great job! You made £\${currentWeek.sales.toLocaleString()} this week, up from £0 last week.\`;
  }

  // --- EXPENSE PIE CHART ---
  const expenseMap = {};
  rawSuppliers.forEach(s => {
    const cat = s.category || 'Other';
    if (!expenseMap[cat]) expenseMap[cat] = 0;
    expenseMap[cat] += (Number(s.totalAmount) || 0);
  });
  const expensePieData = Object.keys(expenseMap).map(k => ({ name: k, value: Math.round(expenseMap[k]) })).filter(e => e.value > 0);
  if (expensePieData.length === 0) expensePieData.push({ name: 'No Expenses', value: 1 });
  const pieColors = ['#3b82f6', '#f97316', '#10b981', '#a855f7', '#f43f5e', '#eab308'];

  // --- MONTHLY GOAL TRACKER ---
  const monthlyTarget = 30000;
  const currentMonthObj = displayMonthlyData[displayMonthlyData.length - 1] || { sales: 0 };
  const currentMonthSales = currentMonthObj.sales;
  const targetPercent = Math.min(100, Math.round((currentMonthSales / monthlyTarget) * 100));

  const realOffersData`;

content = content.replace('  const realOffersData', newLogic);

// 3. Add Banner and Cards to WEEKLY TAB
const bannerJSX = `
          {/* SMART INSIGHTS BANNER */}
          <div className={\`border rounded-xl p-4 mb-6 flex items-center shadow-lg \${isPositive ? 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20' : 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20'}\`}>
            <span className="text-white font-medium text-lg">{insightMsg}</span>
          </div>
          <div className="grid grid-cols-2 gap-6 w-full mt-2">`;

content = content.replace(/\{activeTab === 'weekly' && \(\<div className="block w-full"\>\n\s*<div className="grid grid-cols-2 gap-6 w-full mt-2">/, `{activeTab === 'weekly' && (<div className="block w-full">${bannerJSX}`);

const newCardsJSX = `
            {/* MONTHLY GOAL TRACKER */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[400px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-6 uppercase tracking-wide text-sm"><span className="text-pink-500 mr-2">5.</span>MONTHLY SALES GOAL <span className="text-slate-400 normal-case font-normal">(Target: £30,000)</span></h2>
              <div className="flex-1 min-h-0 w-full flex flex-col justify-center items-center">
                <div className="w-full bg-[#1f2947] rounded-full h-10 mb-6 overflow-hidden relative shadow-inner">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-10 rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-4" style={{ width: \`\${targetPercent}%\` }}>
                    <span className="text-white font-bold text-sm drop-shadow-md">{targetPercent}%</span>
                  </div>
                </div>
                <p className="text-slate-300 text-xl font-medium">Currently at <span className="text-white font-bold text-2xl ml-2">£{currentMonthSales.toLocaleString()}</span> <span className="text-slate-500 mx-2">/</span> £30,000</p>
              </div>
            </div>

            {/* EXPENSE BREAKDOWN PIE CHART */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[400px] flex flex-col w-full">
              <h2 className="text-white font-bold mb-2 uppercase tracking-wide text-sm"><span className="text-yellow-500 mr-2">6.</span>EXPENSE BREAKDOWN <span className="text-slate-400 normal-case font-normal">(By Category)</span></h2>
              <div className="flex-1 min-h-0 w-full relative">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={expensePieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                      {expensePieData.map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff'}} formatter={(v) => '£'+Number(v).toLocaleString()} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
`;

// Insert the new cards at the end of the weekly tab
// We need to replace `            </div>\n          </div>\n        </div>` at the end of the weekly tab.
const weeklyEndTarget = `            </div>\n          </div>\n        </div>\n)}`;
content = content.replace(weeklyEndTarget, `            </div>\n${newCardsJSX}\n)}`);


fs.writeFileSync(file, content, 'utf8');
console.log('Successfully injected pro features!');