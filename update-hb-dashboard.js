const fs = require('fs');
let content = fs.readFileSync('app/dashboard/HungryBirdsDashboard.tsx', 'utf8');

const target = '<option value="POS Sales" className="bg-[#0e121b]">POS Sales</option>';
const replacement = '<option value="POS Sales" className="bg-[#0e121b]">POS Sales</option>\n                <option value="Online Web" className="bg-[#0e121b]">Online Web</option>';

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('app/dashboard/HungryBirdsDashboard.tsx', content, 'utf8');
  console.log('SUCCESS: Added Online Web to HungryBirdsDashboard.tsx');
} else {
  console.log('ERROR: Target not found in HungryBirdsDashboard.tsx');
}