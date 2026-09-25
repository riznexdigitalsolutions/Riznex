const fs = require('fs');
const path = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// Inject state
content = content.replace(
  `const [expandAll, setExpandAll] = useState(true)`,
  `const [expandAll, setExpandAll] = useState(true)\n  const [activeTab, setActiveTab] = useState<'overview' | 'weekly' | 'monthly' | 'offers'>('overview')`
);

// Inject tabs
const tabUI = `

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 bg-[#111520] p-1.5 rounded-2xl border border-[#1f2947] relative z-10 w-fit mb-4">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'weekly', label: 'Weekly Comparison' },
            { id: 'monthly', label: 'Monthly Comparison' },
            { id: 'offers', label: 'Current Offers' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={"px-4 py-2 rounded-xl text-sm font-bold transition-all " + (activeTab === tab.id ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : "text-slate-400 hover:text-white hover:bg-white/5")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={activeTab === 'overview' ? 'block' : 'hidden'}>
`;

content = content.replace('{/* Primary KPIs - 5 cards */}', tabUI + '        {/* Primary KPIs - 5 cards */}');

// Close the CSS hidden div at the very end of the visual dashboard
const endUI = `
        </div>
        
        <div className={activeTab === 'weekly' ? 'block' : 'hidden'}>
          <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center text-center mt-6">
            <h2 className="text-3xl font-black text-white mb-3">Weekly Comparison</h2>
            <p className="text-slate-400 max-w-md">The 4-week comparison charts for Orders, Sales, and Supplier Buying are being built here!</p>
          </div>
        </div>
        
        <div className={activeTab === 'monthly' ? 'block' : 'hidden'}>
          <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center text-center mt-6">
            <h2 className="text-3xl font-black text-white mb-3">Monthly Comparison</h2>
            <p className="text-slate-400 max-w-md">The month-over-month charts are being built here!</p>
          </div>
        </div>
        
        <div className={activeTab === 'offers' ? 'block' : 'hidden'}>
          <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center text-center mt-6">
            <h2 className="text-3xl font-black text-white mb-3">Current Offers & Marketing</h2>
            <p className="text-slate-400 max-w-md">The ROI tracking for marketing is being built here!</p>
          </div>
        </div>

      {/* --- END VISUAL DASHBOARD --- */}`;

content = content.replace('{/* --- END VISUAL DASHBOARD --- */}', endUI);

fs.writeFileSync(path, content, 'utf8');
console.log('Safe Tab Injection Complete.');