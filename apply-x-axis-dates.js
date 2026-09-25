const fs = require('fs');

let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

// 1. Replace the XAxis to include the custom tick renderer
const oldXAxisRegex = /<XAxis\s+dataKey="name"\s+stroke="#64748b"\s+tick={{ fill: '#94a3b8', fontSize: 12 }}\s+tickMargin={12}\s+axisLine={false}\s+tickLine={false}\s+\/>/g;

const newXAxis = `<XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        tick={(props: any) => {
                          const { x, y, payload } = props;
                          const data = curr6Stats.weeklyData.find((d: any) => d.name === payload.value);
                          return (
                            <g transform={\`translate(\${x},\${y})\`}>
                              <text x={0} y={0} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={12} fontWeight="bold">{payload.value}</text>
                              {data?.dateRange && <text x={0} y={0} dy={32} textAnchor="middle" fill="#64748b" fontSize={11}>{data.dateRange}</text>}
                            </g>
                          );
                        }}
                        tickMargin={12} 
                        axisLine={false} 
                        tickLine={false} 
                      />`;

content = content.replace(oldXAxisRegex, newXAxis);


// 2. Remove the entire "Bottom Cards Row (Dark Theme)" section
const bottomCardsStartIndex = content.indexOf('{/* Bottom Cards Row (Dark Theme) */}');
if (bottomCardsStartIndex !== -1) {
  // Find the closing tag of this section. It's a div containing the cards.
  // The structure is:
  // {/* Bottom Cards Row (Dark Theme) */}
  // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  // ...
  // </div>
  
  // We can just slice it out safely if we find the end of that specific grid div.
  // We know right after it is:
  // </div>
  // ) : (
  // <div className="bg-[#111520] border border-[#1f2947]...

  const endMarker = '            </div>\n            ) : (';
  const bottomCardsEndIndex = content.indexOf(endMarker, bottomCardsStartIndex);
  
  if (bottomCardsEndIndex !== -1) {
    content = content.slice(0, bottomCardsStartIndex) + content.slice(bottomCardsEndIndex);
  } else {
    console.log("Could not find the end of bottom cards row");
  }
} else {
  console.log("Could not find bottom cards row");
}

fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content);
console.log('Script completed successfully.');
