import { test, expect } from '@playwright/test';

test.describe('Home Onboarding Modal', () => {
  test.beforeEach(async ({ context }) => {
    // Clear localStorage before each test
    await context.clearCookies();
  });

  test('should show onboarding modal on first visit to /es', async ({ page }) => {
    // Clear localStorage for clean test
    await page.goto('http://localhost:3000/es');
    await page.evaluate(() => localStorage.clear());
    
    // Reload to trigger first-visit logic
    await page.reload();
    
    // Wait for modal to appear
    await expect(page.locator('text=¡Bienvenido a Cocorico!')).toBeVisible({ timeout: 5000 });
    
    // Verify modal content
    await expect(page.locator('text=Tu asistente de cocina con inteligencia artificial está listo para ayudarte')).toBeVisible();
    await expect(page.getByText('Comenzar')).toBeVisible();
  });

  test('should not show modal on second visit after completion', async ({ page }) => {
    await page.goto('http://localhost:3000/es');
    
    // Clear localStorage first
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Wait for modal and complete it
    await expect(page.locator('text=¡Bienvenido a Cocorico!')).toBeVisible({ timeout: 5000 });
    await page.getByText('Saltar tutorial').click();
    
    // Modal should disappear
    await expect(page.locator('text=¡Bienvenido a Cocorico!')).not.toBeVisible();
    
    // Verify localStorage is set
    const completed = await page.evaluate(() => localStorage.getItem('onboarding_completed'));
    expect(completed).toBe('true');
    
    // Reload page
    await page.reload();
    
    // Modal should not appear again
    await page.waitForTimeout(1000); // Give time for any modal to appear
    await expect(page.locator('text=¡Bienvenido a Cocorico!')).not.toBeVisible();
  });

  test('should progress through onboarding steps', async ({ page }) => {
    await page.goto('http://localhost:3000/es');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Step 1
    await expect(page.locator('text=¡Bienvenido a Cocorico!')).toBeVisible({ timeout: 5000 });
    await page.getByText('Comenzar').click();
    
    // Step 2
    await expect(page.locator('text=1. Crea tu primera receta')).toBeVisible();
    await page.getByText('Ir a crear receta').click();
    
    // Step 3
    await expect(page.locator('text=2. Prueba el escáner de ingredientes')).toBeVisible();
    await page.getByText('Probar escáner').click();
    
    // Step 4
    await expect(page.locator('text=3. Completa un reto diario')).toBeVisible();
    await page.getByText('¡Empezar!').click();
    
    // Modal should close
    await expect(page.locator('text=3. Completa un reto diario')).not.toBeVisible();
    
    // Verify completion
    const completed = await page.evaluate(() => localStorage.getItem('onboarding_completed'));
    expect(completed).toBe('true');
  });

  test('should allow going back through steps', async ({ page }) => {
    await page.goto('http://localhost:3000/es');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Progress to step 2
    await expect(page.locator('text=¡Bienvenido a Cocorico!')).toBeVisible({ timeout: 5000 });
    await page.getByText('Comenzar').click();
    await expect(page.locator('text=1. Crea tu primera receta')).toBeVisible();
    
    // Go back
    await page.getByText('Atrás').click();
    
    // Should be back at step 1
    await expect(page.locator('text=¡Bienvenido a Cocorico!')).toBeVisible();
  });

  test('should close modal when clicking X button', async ({ page }) => {
    await page.goto('http://localhost:3000/es');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Wait for modal
    await expect(page.locator('text=¡Bienvenido a Cocorico!')).toBeVisible({ timeout: 5000 });
    
    // Click close button (aria-label="Cerrar")
    await page.locator('button[aria-label="Cerrar"]').click();
    
    // Modal should close
    await expect(page.locator('text=¡Bienvenido a Cocorico!')).not.toBeVisible();
    
    // Verify completion
    const completed = await page.evaluate(() => localStorage.getItem('onboarding_completed'));
    expect(completed).toBe('true');
  });

  test('should show modal on /en locale as well', async ({ page }) => {
    await page.goto('http://localhost:3000/en');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Modal should appear (Spanish text is hardcoded in component currently)
    await expect(page.locator('text=¡Bienvenido a Cocorico!')).toBeVisible({ timeout: 5000 });
  });

  test('should not interfere with page navigation', async ({ page }) => {
    await page.goto('http://localhost:3000/es');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Wait for modal
    await expect(page.locator('text=¡Bienvenido a Cocorico!')).toBeVisible({ timeout: 5000 });
    
    // Close modal
    await page.getByText('Saltar tutorial').click();
    
    // Navigate to pricing
    await page.click('text=Premium');
    await expect(page).toHaveURL(/.*pricing/);
    
    // Go back to home
    await page.goto('http://localhost:3000/es');
    
    // Modal should not appear again
    await page.waitForTimeout(1000);
    await expect(page.locator('text=¡Bienvenido a Cocorico!')).not.toBeVisible();
  });
});
