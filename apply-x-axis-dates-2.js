const fs = require('fs');

let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

const oldXAxis = `<XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        tickMargin={12} 
                        axisLine={false} 
                        tickLine={false} 
                      />`;

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

content = content.replace(oldXAxis, newXAxis);

fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content);
console.log('Fixed XAxis');
