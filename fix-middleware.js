const fs = require('fs');
const file = 'middleware.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads).*)'],",
  "matcher: ['/((?!_next/static|_next/image|images|favicon.ico|uploads).*)'],"
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed middleware matcher to exclude images');