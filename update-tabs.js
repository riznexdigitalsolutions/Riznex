const fs = require('fs');
const path = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Import useSearchParams
content = content.replace(
  `import { useSession } from 'next-auth/react'`,
  `import { useSession } from 'next-auth/react'\nimport { useSearchParams } from 'next/navigation'`
);

// 2. Add activeTab logic inside the component
content = content.replace(
  `const [expandAll, setExpandAll] = useState(true)`,
  `const [expandAll, setExpandAll] = useState(true)\n  const searchParams = useSearchParams()\n  const activeTab = searchParams?.get('tab') || 'overview'`
);

// 3. Conditional rendering:
const targetStart = `{/* Primary KPIs - 5 cards */}`;
const replaceStart = `<div className={activeTab === 'overview' ? 'block' : 'hidden'}>
        {/* Primary KPIs - 5 cards */}`;

content = content.replace(targetStart, replaceStart);

const targetEnd = `{/* --- END VISUAL DASHBOARD --- */}`;
const replaceEnd = `</div>
        
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

content = content.replace(targetEnd, replaceEnd);

fs.writeFileSync(path, content, 'utf8');
console.log('Tabs handled via SearchParams perfectly.');