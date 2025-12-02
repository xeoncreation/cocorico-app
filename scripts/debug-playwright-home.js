const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'tests/e2e/storageState.json' });
  const page = await context.newPage();
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

  console.log('navigating to http://127.0.0.1:3000');
  const res = await page.goto('http://127.0.0.1:3000', { waitUntil: 'load', timeout: 60000 });
  console.log('status:', res && res.status());

  const html = await page.content();
  fs.writeFileSync('tests/e2e/debug-home.html', html);
  await page.screenshot({ path: 'tests/e2e/debug-home.png', fullPage: true });

  console.log('wrote tests/e2e/debug-home.html and debug-home.png');
  await browser.close();
})();