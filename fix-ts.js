const fs = require('fs');
const path = 'app/api/admin/set-client/route.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('export async function POST(req)', 'export async function POST(req: Request)');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed TS error in set-client route');