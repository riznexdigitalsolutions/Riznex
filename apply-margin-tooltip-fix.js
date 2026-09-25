const fs = require('fs');

let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

// 1. Fix the bottom margin of the ComposedChart so dates are not cut off
const oldComposedChart = `<ComposedChart data={curr6Stats.weeklyData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>`;
const newComposedChart = `<ComposedChart data={curr6Stats.weeklyData} margin={{ top: 20, right: 0, left: 0, bottom: 40 }}>`;
content = content.replace(oldComposedChart, newComposedChart);

// 2. Fix the Tooltip formatter so it formats sales as currency and doesn't show ugly decimals
const oldTooltip = `<Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} />`;
const newTooltip = `<Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0a0c14', borderColor: '#1f2947', borderRadius: '8px', color: '#fff' }} formatter={(v: any, name: string) => name === 'sales' ? gbp(v as number) : v} />`;
content = content.replace(oldTooltip, newTooltip);

fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content);
console.log('Fixed chart overflow and tooltip formatter');
