const fs = require('fs');

let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

// The original corrupted file ends like this:
//           </div>
//         </div>
//         </div>
//           </>
//           )}
//       {/* --- END VISUAL DASHBOARD --- */}

// We need to just fix this by replacing the corrupted fragment entirely!
content = content.replace(/\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/>\s*\)\}/g, "\n        </div>\n        </div>\n        </div>");

fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content, 'utf8');
console.log('Fixed AST Parsing Error.');