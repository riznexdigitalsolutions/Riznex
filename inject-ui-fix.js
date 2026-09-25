const fs = require('fs');
const file = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const bannerJSX = `
          {/* SMART INSIGHTS BANNER */}
          <div className={\`border rounded-xl p-4 mb-6 flex items-center shadow-lg \${isPositive ? 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20' : 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20'}\`}>
            <span className="text-white font-medium text-lg">{insightMsg}</span>
          </div>
`;

const newCardsJSX = `
            {/* MONTHLY GOAL TRACKER */}
            <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[400px] flex flex-col w-full mt-6">
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
            <div className="bg-[#111520] border border-[#1f2947] rounded-xl p-6 shadow-xl h-[400px] flex flex-col w-full mt-6">
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
`;

let lines = content.split('\n');
let injectedBanner = false;
let injectedCards = false;

for(let i=0; i<lines.length; i++) {
    if (!injectedBanner && lines[i].includes('activeTab === \'weekly\' && (<div')) {
        lines.splice(i+1, 0, bannerJSX);
        injectedBanner = true;
    }
    
    if (!injectedCards && lines[i].includes('4.</span>SUPPLIER PURCHASES')) {
        for(let j=i; j<i+50; j++) {
            if (lines[j].includes('</BarChart>')) {
                lines.splice(j+4, 0, newCardsJSX);
                injectedCards = true;
                break;
            }
        }
    }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Successfully injected UI with fixed script');