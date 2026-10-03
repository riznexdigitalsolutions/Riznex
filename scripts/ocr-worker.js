try {
  const tesseract = require('tesseract.js');
  
  async function run() {
    try {
      const filePath = process.argv[2];
      if (!filePath) {
        console.log(JSON.stringify({ success: false, error: 'No file path provided' }));
        return;
      }
      const worker = await tesseract.createWorker('eng');
      const ret = await worker.recognize(filePath);
      await worker.terminate();
      console.log(JSON.stringify({ success: true, text: ret.data.text }));
    } catch (error) {
      console.log(JSON.stringify({ success: false, error: error.message || error.toString() }));
    }
  }
  run();
} catch(initErr) {
  console.log(JSON.stringify({ success: false, error: 'OCR Worker Init Error: ' + initErr.message }));
}
