import { test, expect } from '@playwright/test';

test.describe('Navbar links', () => {
  test('Links visible and target routes reachable', async ({ page }) => {
    await page.goto('/');

    // Links visible in navbar
    // Links visible in navbar (scoped to header)
    await expect(page.locator('header a[href="/chat"]')).toBeVisible();
    await expect(page.locator('header a[href="/dashboard/favorites"]')).toBeVisible();
    await expect(page.locator('header a[href="/dashboard/stats"]')).toBeVisible();
    await expect(page.locator('header a[href="/login"]')).toBeVisible();

    // Routes reachable
    await page.goto('/chat');
    await expect(page).toHaveURL(/\/chat$/);

    await page.goto('/dashboard/favorites');
    const favUrl = page.url();
    if (!/\/dashboard\/favorites/.test(favUrl)) {
      await expect(page).toHaveURL(/\/$/);
      await expect(page.locator('a[href="/login"]')).toBeVisible();
    }

    await page.goto('/dashboard/stats');
    await expect(page).toHaveURL(/\/dashboard\/stats$/);

    await page.goto('/login');
    await expect(page.locator('a[href="/signup"]')).toBeVisible();

  await page.goto('/signup', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page.locator('header a[href="/login"]')).toBeVisible();
  });
});
