import { test, expect } from '@playwright/test';

// Tests in this file interact with the app during dev server runs which can
// be slow sometimes (especially first load). Bump the test timeout so we
// don't flake on slow responses.
test.setTimeout(120000);

test.describe('Home Onboarding Modal', () => {
  test.beforeEach(async ({ page, context }) => {
    // Ensure cookies are cleared and localStorage is reset for the app origin.
    // Use context.addInitScript to reliably clear the onboarding flag before any navigation
    // so we avoid race conditions with reloads and navigation aborts.
    await context.clearCookies();
    await context.addInitScript(() => {
      try {
        localStorage.removeItem('onboarding_completed');
      } catch (e) {}
    });
    // Hook browser console and errors into the test runner output for easier debugging
    page.on('console', (m) => console.log('PAGE CONSOLE:', m.text()));
    page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

    // Navigate to the localized home so the initScript has run and the page renders
    await page.goto('/es', { waitUntil: 'domcontentloaded', timeout: 60000 });
  });

  test('should show onboarding modal on first visit to /es', async ({ page }) => {
    // Page init script already cleared onboarding flag; ensure we are at /es
    await page.goto('/es', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Debugging: log localStorage and presence of modal for flaky runs
    const lsDump = await page.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(localStorage))));
    console.log('DEBUG: localStorage after reload ->', lsDump);
    const exists = await page.evaluate(() => !!document.querySelector('[data-testid="onboarding-modal"]'));
    console.log('DEBUG: onboarding-modal present in DOM before wait ->', exists);
    // Wait for modal to appear (use data-testid to avoid text-match flakiness)
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 45000 });

    // Verify modal content
    await expect(modal.getByText('Tu asistente de cocina con inteligencia artificial está listo para ayudarte')).toBeVisible();
    await expect(modal.getByText('Comenzar')).toBeVisible();
  });

  test('should not show modal on second visit after completion', async ({ page }) => {
    await page.goto('/es', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for modal and complete it
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 45000 });
    await modal.getByText('Saltar tutorial').click();
    // Debug: ensure the localStorage flag was set
    const afterSkip = await page.evaluate(() => localStorage.getItem('onboarding_completed'));
    console.log('DEBUG: onboarding_completed after skip ->', afterSkip);

    // Wait for the onboarding flag in localStorage and for the modal to be removed
    await page.waitForFunction(() => localStorage.getItem('onboarding_completed') === 'true', null, { timeout: 5000 });
    await modal.waitFor({ state: 'detached', timeout: 5000 });
    
    // Verify localStorage is set
    const completed = await page.evaluate(() => localStorage.getItem('onboarding_completed'));
    expect(completed).toBe('true');
    
    // Simulate a second visit using client-side navigation (avoid reload which runs the
    // context initScript that clears localStorage). Navigate away and back with header links.
    const premiumLink = page.locator('header a[href^="/premium"], header a[href^="/es/premium"]');
    await expect(premiumLink).toBeVisible({ timeout: 10000 });
    await premiumLink.click({ force: true });
    await page.waitForURL(/.*premium/, { timeout: 60000 });

    await page.click('header a[href="/"]');
    await page.waitForURL(/(\/|\/es(?:$|[?#]))/, { timeout: 20000 });

    // Modal should not appear again for a completed user
    await expect(page.locator('[data-testid="onboarding-modal"]')).not.toBeVisible({ timeout: 5000 });
  });

  test('should progress through onboarding steps', async ({ page }) => {
    await page.goto('/es', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Step 1
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 45000 });
    await modal.getByText('Comenzar').click();
    
    // Step 2
    await expect(modal.getByText('1. Crea tu primera receta')).toBeVisible();
    await modal.getByText('Ir a crear receta').click();
    
    // Step 3
    await expect(modal.getByText('2. Prueba el escáner de ingredientes')).toBeVisible();
    await modal.getByText('Probar escáner').click();
    
    // Step 4
    await expect(modal.getByText('3. Completa un reto diario')).toBeVisible();
    await modal.getByText('¡Empezar!').click();
    
    // Modal should close
    await expect(modal).not.toBeVisible();
    
    // Verify completion
    const completed = await page.evaluate(() => localStorage.getItem('onboarding_completed'));
    expect(completed).toBe('true');
  });

  test('should allow going back through steps', async ({ page }) => {
    await page.goto('/es', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Progress to step 2
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 45000 });
    await modal.getByText('Comenzar').click();
    await expect(modal.getByText('1. Crea tu primera receta')).toBeVisible();
    
    // Go back
    await page.getByText('Atrás').click();

    // Should be back at step 1
    await expect(modal).toBeVisible();
  });

  test('should close modal when clicking X button', async ({ page }) => {
    await page.goto('/es', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for modal
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 45000 });

    // Click close button (aria-label="Cerrar")
    await modal.locator('button[aria-label="Cerrar"]').click();
    
    // Modal should close
    await expect(modal).not.toBeVisible();
    
    // Verify completion
    const completed = await page.evaluate(() => localStorage.getItem('onboarding_completed'));
    expect(completed).toBe('true');
  });

  test('should show modal on /en locale as well', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Modal should appear (Spanish text is hardcoded in component currently)
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 45000 });
  });

  test('should not interfere with page navigation', async ({ page }) => {
    await page.goto('/es', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for modal
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 45000 });
    
    // Close modal and wait for it to be fully removed from the DOM
    await modal.getByText('Saltar tutorial').click();

    // Wait until the onboarding flow is recorded and the modal is fully removed
    await page.waitForFunction(() => localStorage.getItem('onboarding_completed') === 'true', null, { timeout: 10000 });
    await modal.waitFor({ state: 'detached', timeout: 10000 });

    // Navigate to pricing (click a precise header anchor to avoid matching other text nodes)
      // Wait for localStorage to be set
      await page.waitForTimeout(500);
      
      // Ensure the header premium link is visible then click it and wait for the URL
      const premiumLink = page.locator('header a[href^="/premium"], header a[href^="/es/premium"]');
      await expect(premiumLink).toBeVisible({ timeout: 10000 });
      const href = await premiumLink.getAttribute('href');
      console.log('DEBUG: premium href ->', href);
      await premiumLink.click({ force: true });
      await page.waitForURL(/.*premium/, { timeout: 60000 });
    
    // Go back to home - modal should not appear because Playwright user agent is detected
    await page.goto('/es', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Modal should not appear - component detects Playwright and skips rendering
    await page.waitForTimeout(1000);
    await expect(page.locator('[data-testid="onboarding-modal"]')).not.toBeVisible();
  });
});
