const http = require('http');

http.get('http://localhost:3000/api/reports?clientId=cmpv4dvik0000vdj089wl6zmf&period=all_time', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Weekly sales array length:', parsed.sales?.weekly?.length);
      if (parsed.sales?.weekly?.length > 0) {
        console.log('First sale:', parsed.sales.weekly[0]);
      }
    } catch(e) { console.log(e); }
  });
});