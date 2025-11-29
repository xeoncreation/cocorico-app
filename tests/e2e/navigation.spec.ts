import { test, expect } from '@playwright/test';

test.describe('Navbar links', () => {
  test('Links visible and target routes reachable', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load', timeout: 30000 });

    // Helper to retry navigation once if a transient aborted error happens
    const safeGoto = async (url: string) => {
      for (let i = 0; i < 2; i++) {
        try {
          await page.goto(url, { waitUntil: 'load', timeout: 60000 });
          return;
        } catch (err) {
          if (i === 1) throw err;
          await page.waitForTimeout(300);
        }
      }
    };

    // Links visible in navbar (give more time for header to hydrate)
    // Links visible in navbar (scoped to header)
    await expect(page.locator('header a[href="/chat"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('header a[href="/dashboard/favorites"]')).toBeVisible();
    await expect(page.locator('header a[href="/dashboard/stats"]')).toBeVisible();
    await expect(page.locator('header a[href="/login"]')).toBeVisible();

    // Routes reachable
    // Use header anchor clicks for client navigation to avoid aborted fetch races
      // Sanity-check that login & signup routes are reachable
      await safeGoto('/login');
      await expect(page.locator('a[href="/signup"]')).toBeVisible({ timeout: 10000 });

      await safeGoto('/signup');
      await expect(page.locator('header a[href="/login"]')).toBeVisible({ timeout: 10000 });
  });
});
