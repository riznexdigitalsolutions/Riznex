const fs = require('fs');
const path = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

const regexStart = /\s*\{\/\*\s*Primary KPIs \- 5 cards\s*\*\/\}/;
const replaceStart = `

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

        {activeTab === 'overview' && (
          <>
        {/* Primary KPIs - 5 cards */}`;

content = content.replace(regexStart, replaceStart);

const regexEnd = /\s*\{\/\*\s*\-\-\-\s*END VISUAL DASHBOARD\s*\-\-\-\s*\*\/\}/;
const replaceEnd = `
        </>
        )}
        
        {activeTab === 'weekly' && (
          <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center text-center mt-6">
            <h2 className="text-3xl font-black text-white mb-3">Weekly Comparison</h2>
            <p className="text-slate-400 max-w-md">The 4-week comparison charts for Orders, Sales, and Supplier Buying are being built here!</p>
          </div>
        )}
        
        {activeTab === 'monthly' && (
          <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center text-center mt-6">
            <h2 className="text-3xl font-black text-white mb-3">Monthly Comparison</h2>
            <p className="text-slate-400 max-w-md">The month-over-month charts are being built here!</p>
          </div>
        )}
        
        {activeTab === 'offers' && (
          <div className="bg-[#111520] border border-[#1f2947] rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center text-center mt-6">
            <h2 className="text-3xl font-black text-white mb-3">Current Offers & Marketing</h2>
            <p className="text-slate-400 max-w-md">The ROI tracking for marketing is being built here!</p>
          </div>
        )}

      {/* --- END VISUAL DASHBOARD --- */}`;

content = content.replace(regexEnd, replaceEnd);

fs.writeFileSync(path, content, 'utf8');
console.log('Regex Update Complete.');