const fs = require('fs');
const path = 'app/dashboard/HenleyDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// The problematic block:
const searchBlock = `
        </div>
      </div>
      </div>
        </>
        )}
`;

const replaceBlock = `
        </div>
        </>
        )}
      </div>
      </div>
`;

// Let's make it more robust with regex:
const fixRegex = /\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/>\s*\)\}/;
const fixReplacement = `
        </div>
        </>
        )}
      </div>
      </div>
`;

content = content.replace(fixRegex, fixReplacement);
fs.writeFileSync(path, content, 'utf8');
console.log('Syntax Fix Applied.');