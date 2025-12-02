import { test, expect } from '@playwright/test';

test.describe('Navbar links', () => {
  test.setTimeout(120000);
  test('Links visible and target routes reachable', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    const header = page.locator('header');
    const localePrefix = await page.evaluate(() => {
      const lang = document.documentElement.lang;
      if (lang === 'es' || lang === 'en') return `/${lang}`;
      return '';
    });
    const selectorFor = (path: string) => {
      const localized = localePrefix
        ? path === '/'
          ? localePrefix || '/'
          : `${localePrefix}${path}`
        : path;
      const uniqueHrefs = Array.from(new Set([localized, path])).filter(Boolean);
      return uniqueHrefs.map((href) => `a[href="${href}"]`).join(', ');
    };

    // Links visible in navbar (give more time for header to hydrate)
    await expect(header.locator(selectorFor('/chat'))).toBeVisible({ timeout: 10000 });
    await expect(header.locator(selectorFor('/dashboard/favorites'))).toBeVisible({ timeout: 10000 });
    await expect(header.locator(selectorFor('/dashboard/stats'))).toBeVisible({ timeout: 10000 });
    const loginLink = header.locator(selectorFor('/login')).first();
    await expect(loginLink).toBeVisible({ timeout: 10000 });

    // Routes reachable
    await loginLink.click({ timeout: 10000 });
    await page.waitForURL('**/login', { timeout: 60000 });
    const signupLink = page.locator(selectorFor('/signup')).first();
    await expect(signupLink).toBeVisible({ timeout: 10000 });

    await signupLink.click({ timeout: 10000 });
    await page.waitForURL('**/signup', { timeout: 60000 });
    await expect(header.locator(selectorFor('/login')).first()).toBeVisible({ timeout: 10000 });
  });
});
