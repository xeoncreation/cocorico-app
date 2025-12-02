const { chromium } = require('@playwright/test');

module.exports = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  // Add the site-access cookie so middleware will allow access to app pages
  await context.addCookies([
    {
      name: 'site-access',
      value: 'granted',
      domain: '127.0.0.1',
      path: '/',
      httpOnly: false,
      sameSite: 'Lax',
    },
  ]);

  // Save storage state so all tests reuse this auth cookie
  await context.storageState({ path: 'tests/e2e/storageState.json' });
  await browser.close();
};
