const fs = require('fs');
['app/dashboard/HenleyDashboard.tsx', 'app/dashboard/HungryBirdsDashboard.tsx'].forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/let pMatch = false[\s\S]*?else if \(oPlatform === sPlatform\) pMatch = true/m,
      'let pMatch = false\n' +
      '      const sPlatform = (s.platform || \'\').toLowerCase().replace(/_/g, \' \')\n' +
      '      const oPlatform = (offer.platform || \'\').toLowerCase().replace(/_/g, \' \')\n' +
      '      if (sPlatform.includes(oPlatform) || oPlatform.includes(sPlatform) || oPlatform === sPlatform) pMatch = true'
  );
  fs.writeFileSync(file, c);
});
