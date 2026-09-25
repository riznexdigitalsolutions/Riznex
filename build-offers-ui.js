const fs = require('fs');
const path = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

const mockOffersData = `
  const offersData = [
    { platform: 'Facebook Marketing', spend: 350, revenue: 1200, ROI: '242%' },
    { platform: 'Instagram Marketing', spend: 200, revenue: 850, ROI: '325%' },
    { platform: 'Google Ads', spend: 450, revenue: 2100, ROI: '366%' },
    { platform: 'Uber Eats (BOGO)', spend: 180, revenue: 940, ROI: '422%' },
    { platform: 'Deliveroo (20% Off)', spend: 220, revenue: 1150, ROI: '422%' }
  ];
`;

if (!content.includes('const offersData')) {
  content = content.replace(`const activeTab = searchParams?.get('tab') || 'overview'`, `const activeTab = searchParams?.get('tab') || 'overview'\n${mockOffersData}`);
}

const offersTable = `        <div className={activeTab === 'offers' ? 'block flex-1' : 'hidden'}>
          <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-8 shadow-2xl flex-1 flex flex-col relative overflow-hidden z-0 mt-6">
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/10 blur-[100px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                🚀
              </span>
              Current Offers & Marketing ROI
            </h2>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-slate-400 border-b-2 border-[#1f2947]">
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs">Campaign / Platform</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs text-right text-red-400">Total Spend (£)</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs text-right text-blue-400">Revenue Generated (£)</th>
                    <th className="pb-4 font-bold uppercase tracking-wider text-xs text-right text-emerald-400">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2947]">
                  {offersData.map((o, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 font-semibold text-white">{o.platform}</td>
                      <td className="py-4 text-red-400 text-right font-medium">{o.spend}</td>
                      <td className="py-4 text-blue-400 text-right font-bold">{o.revenue}</td>
                      <td className="py-4 text-emerald-400 text-right font-black">{o.ROI}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>`;

const searchPlaceholder = `        <div className={activeTab === 'offers' ? 'block' : 'hidden'}>
          <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center text-center mt-6">
            <h2 className="text-3xl font-black text-white mb-3">Current Offers & Marketing</h2>
            <p className="text-slate-400 max-w-md">The ROI tracking for marketing is being built here!</p>
          </div>
        </div>`;

content = content.replace(searchPlaceholder, offersTable);

fs.writeFileSync(path, content, 'utf8');
console.log('Offers UI Built.');