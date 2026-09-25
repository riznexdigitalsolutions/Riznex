const fs = require('fs');
let content = fs.readFileSync('app/dashboard/HenleyDashboard.tsx', 'utf8');

// The safest way to fix AST is to just add a </div> before the closing `)` until it parses.
// Next.js tells us we have an unbalanced token. It usually means we need an extra `</div>` at the end.
// We will just add `</div>` at the very end before `)`
content = content.replace('    </div>\n  )', '    </div>\n    </div>\n  )');
fs.writeFileSync('app/dashboard/HenleyDashboard.tsx', content, 'utf8');
console.log('Added 1 div');