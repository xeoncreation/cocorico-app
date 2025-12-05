import { test, expect, Page } from '@playwright/test';

/**
 * Tests para visualización de recetas públicas
 * Verifica que recetas públicas sean accesibles sin autenticación
 * 
 * NOTA: Estos tests requieren datos reales en Supabase.
 * Se saltan en CI si NEXT_PUBLIC_SUPABASE_URL contiene 'placeholder'.
 */

const PUBLIC_USER = 'public';
const FALLBACK_USER = 'testuser';
const PRIMARY_SLUG = 'pasta-con-verduras';
const ALT_SLUG = 'test-recipe';

const gotoPublicRecipe = async (page: Page, slug = PRIMARY_SLUG, user = PUBLIC_USER) => {
  await page.goto(`/r/${user}/${slug}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
};

// Skip tests if using placeholder Supabase (no real data)
const shouldSkip = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') ?? true;

test.describe('Recetas Públicas - Acceso sin Login', () => {
  test.skip(shouldSkip, 'Requires real Supabase database with seeded data');
  test.setTimeout(120000);
  
  test('debe acceder a receta pública sin autenticación', async ({ page }) => {
    // Ir directamente a una ruta de receta pública
    // Nota: esto asume que existe al menos una receta pública con slug conocido
    // En producción, deberías crear una receta de prueba primero o usar una existente
    
    await gotoPublicRecipe(page);
    
    // Si la receta no existe, puede redirigir a 404
    // Verificar que no redirige a login
    await page.waitForTimeout(1000);
    
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
    expect(currentUrl).not.toContain('/auth');
  });

  test('debe renderizar página de receta pública con contenido', async ({ page }) => {
    // Primero ir al feed público para obtener una receta
    await gotoPublicRecipe(page);

    await expect(page.getByRole('heading', { level: 1, name: /pasta con verduras/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /ingredientes/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /pasos/i })).toBeVisible();
    await expect(page.locator('main ul li').first()).toContainText(/pasta/i);
    await expect(page.getByText(/25\s*min/i).first()).toBeVisible();
    await expect(page.getByText(/fácil/i).first()).toBeVisible();
  });

  test('debe mostrar información de dificultad y tiempo', async ({ page }) => {
    await gotoPublicRecipe(page);

    const statsRow = page.locator('main div').filter({ hasText: /25\s*min/i }).first();
    await expect(statsRow).toContainText(/25\s*min/i);
    await expect(statsRow).toContainText(/fácil/i);
  });

  test('debe mostrar lista de ingredientes', async ({ page }) => {
    await gotoPublicRecipe(page);

    const ingredients = page.locator('article ul li');
    await expect(ingredients.first()).toContainText(/pasta/i);
  });

  test('debe mostrar pasos de preparación', async ({ page }) => {
    await gotoPublicRecipe(page);
    const steps = page.locator('article ol li');
    await expect(steps.first()).toContainText(/hervir/i);
    await expect(steps.nth(1)).toContainText(/saltear/i);
  });

  test('no debe mostrar botón de editar en receta pública sin login', async ({ page }) => {
    await gotoPublicRecipe(page);
    const editButton = page.locator('button:has-text("Editar"), a:has-text("Editar")');
    await expect(editButton).toHaveCount(0);
  });
});

test.describe('Feed Público de Recetas', () => {
  test.skip(shouldSkip, 'Requires real Supabase database with seeded data');
  
  test('debe renderizar feed de recetas públicas', async ({ page }) => {
    await page.goto('/recipes');

    await expect(page.getByRole('heading', { name: /mis recetas/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /pasta con verduras/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /test recipe/i })).toBeVisible();
  });

  test('debe mostrar tarjetas de recetas', async ({ page }) => {
    await page.goto('/recipes');

    const firstAction = page.getByRole('button', { name: /^Ver$/ }).first();
    await expect(firstAction).toBeVisible();
    const secondAction = page.getByRole('button', { name: /^Editar$/ }).first();
    await expect(secondAction).toBeVisible();
  });

  test('debe permitir hacer clic en tarjeta de receta', async ({ page }) => {
    await page.goto('/recipes');

    const demoToggle = page.getByRole('button', { name: /ver recetas demo/i });
    const toggleAvailable = await demoToggle.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
    if (toggleAvailable) {
      await demoToggle.click();
      await expect(page.getByRole('button', { name: /ver mis recetas/i })).toBeVisible();
    }

    const demoCardHeading = page.getByRole('heading', { level: 3, name: /paella valenciana/i });
    await expect(demoCardHeading).toBeVisible();
    await demoCardHeading.click();
    await expect(page).toHaveURL(/\/recipes\/create$/);
  });
});

test.describe('Receta Pública - Formato Específico', () => {
  test.skip(shouldSkip, 'Requires real Supabase database with seeded data');
  
  test('debe renderizar receta en ruta /r/public/[slug]', async ({ page }) => {
    const response = await page.goto(`/r/public/${ALT_SLUG}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    expect(response?.status()).toBeLessThan(500);
    await expect(page.getByRole('heading', { level: 1, name: /test recipe/i })).toBeVisible();
  });

  test('debe renderizar receta en ruta /r/[user]/[slug]', async ({ page }) => {
    const res = await page.goto(`/r/${FALLBACK_USER}/pasta-recipe`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    expect(res?.status()).toBeLessThan(500);
    // Reveal component detects Playwright and should show content immediately
    // Wait a bit for useEffect to detect Playwright user agent
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { level: 1, name: /pasta con verduras/i })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=/Publicado por/i')).toContainText(FALLBACK_USER);
  });
});

test.describe('Visibilidad de Recetas Privadas', () => {
  
  test('debe bloquear acceso a receta privada sin autenticación', async ({ page }) => {
    // Este test asume que existe una receta privada
    // En realidad necesitarías el ID de una receta privada específica
    
    // Intentar acceder directamente a una receta que sabemos es privada
    // Por ahora, este test es conceptual - necesitarías setup previo
    
    // await page.goto('/recipes/[id-privada]');
    // await page.waitForTimeout(1000);
    
    // Debería redirigir a login o mostrar mensaje de acceso denegado
    // const currentUrl = page.url();
    // expect(currentUrl).toContain('/login');
    
    // O verificar mensaje de error
    // const accessDenied = page.locator('text=/acceso denegado|no autorizado/i');
    // await expect(accessDenied).toBeVisible();
  });
});

test.describe('Compartir Receta Pública', () => {
  
  test('debe mostrar CTA para abrir receta pública', async ({ page }) => {
    await page.goto('/search');
    await page.waitForSelector('text=Cargando…', { state: 'detached', timeout: 15000 }).catch(() => {});
    const shareCta = page.locator('a:has-text("Ver receta")');
    await expect(shareCta.first()).toBeVisible();
  });
});
