const fs = require('fs');
const file = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace hidden with conditional rendering
content = content.replace(/{?\/\* --- WEEKLY TAB ---\*\/}?\s*<div className={activeTab === 'weekly' \? 'block' : 'hidden'}>/g, '{/* --- WEEKLY TAB --- */}\n        {activeTab === \'weekly\' && (<div className="block w-full">');
content = content.replace(/{?\/\* --- MONTHLY TAB ---\*\/}?\s*<div className={activeTab === 'monthly' \? 'block' : 'hidden'}>/g, ')}\n        {/* --- MONTHLY TAB --- */}\n        {activeTab === \'monthly\' && (<div className="block w-full">');
content = content.replace(/{?\/\* --- OFFERS TAB ---\*\/}?\s*<div className={activeTab === 'offers' \? 'block' : 'hidden'}>/g, ')}\n        {/* --- OFFERS TAB --- */}\n        {activeTab === \'offers\' && (<div className="block w-full">');
content = content.replace(/{?\/\* --- END VISUAL DASHBOARD ---\*\/}?/g, ')}\n      {/* --- END VISUAL DASHBOARD --- */}');

fs.writeFileSync(file, content, 'utf8');
console.log('Switched to conditional rendering');