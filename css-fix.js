const fs = require('fs');
const path = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// Undo the <> stuff.
content = content.replace('{activeTab === \'overview\' && (\n          <>', '<div className={activeTab === \'overview\' ? \'\' : \'hidden\'}>');

const endRegex = /\s*<\/div>\s*<\/>\s*\)\}\s*<\/div>\s*<\/div>/;
content = content.replace(endRegex, `
        </div>
        </div>
        </div>`);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed with CSS hiding!');