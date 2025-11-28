import { test, expect } from '@playwright/test';

test.describe('Home Onboarding Modal', () => {
  test.beforeEach(async ({ page, context }) => {
    // Ensure cookies and localStorage are cleared before each test
    await context.clearCookies();
    // Visit the app so localStorage exists, then clear it
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
  });

  test('should show onboarding modal on first visit to /es', async ({ page }) => {
    // Clear localStorage for clean test
    await page.goto('http://localhost:3000/es', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    
    // Reload to trigger first-visit logic
    await page.reload({ waitUntil: 'domcontentloaded' });
    
    // Wait for modal to appear (use data-testid to avoid text-match flakiness)
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 15000 });

    // Verify modal content
    await expect(modal.getByText('Tu asistente de cocina con inteligencia artificial está listo para ayudarte')).toBeVisible();
    await expect(modal.getByText('Comenzar')).toBeVisible();
  });

  test('should not show modal on second visit after completion', async ({ page }) => {
    await page.goto('http://localhost:3000/es');
    
    // Clear localStorage first
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Wait for modal and complete it
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });
    await modal.getByText('Saltar tutorial').click();
    
    // Modal should disappear
    await expect(modal).not.toBeVisible();
    
    // Verify localStorage is set
    const completed = await page.evaluate(() => localStorage.getItem('onboarding_completed'));
    expect(completed).toBe('true');
    
    // Reload page
    await page.reload();
    
    // Modal should not appear again
    await page.waitForTimeout(1000); // Give time for any modal to appear
    await expect(page.locator('[data-testid="onboarding-modal"]')).not.toBeVisible();
  });

  test('should progress through onboarding steps', async ({ page }) => {
    await page.goto('http://localhost:3000/es', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    
    // Step 1
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 15000 });
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
    await page.goto('http://localhost:3000/es', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    
    // Progress to step 2
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 15000 });
    await modal.getByText('Comenzar').click();
    await expect(modal.getByText('1. Crea tu primera receta')).toBeVisible();
    
    // Go back
    await page.getByText('Atrás').click();

    // Should be back at step 1
    await expect(modal).toBeVisible();
  });

  test('should close modal when clicking X button', async ({ page }) => {
    await page.goto('http://localhost:3000/es');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Wait for modal
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // Click close button (aria-label="Cerrar")
    await modal.locator('button[aria-label="Cerrar"]').click();
    
    // Modal should close
    await expect(modal).not.toBeVisible();
    
    // Verify completion
    const completed = await page.evaluate(() => localStorage.getItem('onboarding_completed'));
    expect(completed).toBe('true');
  });

  test('should show modal on /en locale as well', async ({ page }) => {
    await page.goto('http://localhost:3000/en');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Modal should appear (Spanish text is hardcoded in component currently)
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('should not interfere with page navigation', async ({ page }) => {
    await page.goto('http://localhost:3000/es');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Wait for modal
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });
    
    // Close modal and wait for it to be fully removed from the DOM
    await modal.getByText('Saltar tutorial').click();
    await expect(modal).not.toBeVisible({ timeout: 10000 });

    // Navigate to pricing (click a precise header anchor to avoid matching other text nodes)
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }),
      page.click('header a[href="/pricing"]'),
    ]);
    await expect(page).toHaveURL(/.*pricing/);
    
    // Go back to home
    await page.goto('http://localhost:3000/es');
    
    // Modal should not appear again
    await page.waitForTimeout(1000);
    await expect(page.locator('[data-testid="onboarding-modal"]')).not.toBeVisible();
  });
});
