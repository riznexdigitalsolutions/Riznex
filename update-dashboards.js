const fs = require('fs');

const updateDashboard = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes("if (filter.to) params.set('to', filter.to)") && !content.includes("filter.weekRanges")) {
    content = content.replace(
      "if (filter.to) params.set('to', filter.to)",
      "if (filter.to) params.set('to', filter.to)\n        if (filter.weekRanges) params.set('ranges', filter.weekRanges)"
    );
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`No match found in ${file}`);
  }
}

updateDashboard('app/dashboard/HenleyDashboard.tsx');
updateDashboard('app/dashboard/HungryBirdsDashboard.tsx');