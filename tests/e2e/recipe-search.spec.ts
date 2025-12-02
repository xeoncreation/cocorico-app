import { test, expect, Page } from '@playwright/test';

/**
 * Tests para la funcionalidad de búsqueda de recetas
 * Verifica renderizado, filtros, búsqueda por texto y resultados
 */

const FALLBACK_TITLE = 'Pasta con verduras';
const NO_RESULT_QUERY = 'xyzabc123nonexistent';

const safeGoto = async (page: Page, url: string) => {
    // Try a small set of alternate paths (localized or namespaced) to reduce
    // flakiness when the app redirects to locale-prefixed routes.
    const candidates = [url, `/es${url}`, `/recipes${url}`].filter(Boolean);
    for (const candidate of candidates) {
      for (let i = 0; i < 3; i++) {
        try {
          await page.goto(candidate, { waitUntil: 'load', timeout: 60000 });
          return;
        } catch (err) {
          if (i === 2) break; // try next candidate after 3 retries
          await page.waitForTimeout(300);
        }
      }
    }
    // As fallback, attempt a direct goto of the original url (let exception bubble)
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  };

const waitForResultsLabel = async (page: Page) => {
  const label = page.locator('p', { hasText: /resultados/i }).first();
  await expect(label).toBeVisible({ timeout: 15000 });
  return label;
};

const loadSearchPage = async (page: Page) => {
  await safeGoto(page, '/search');
  await page.waitForSelector('text=Cargando…', { state: 'detached', timeout: 15000 }).catch(() => {});
};

const openFiltersPanel = async (page: Page) => {
  const filterButton = page.getByRole('button', { name: /filtros/i });
  await filterButton.click();
  await expect(page.locator('input[aria-label="Tiempo máximo (minutos)"]').first()).toBeVisible();
};

      test.describe('Búsqueda de Recetas', () => {
  
  test('debe renderizar la página de búsqueda correctamente', async ({ page }) => {
    await loadSearchPage(page);
    await expect(page.getByRole('heading', { name: /buscar recetas/i })).toBeVisible({ timeout: 10000 });
    const searchInput = page.getByPlaceholder(/Buscar por nombre o descripción/i);
    await expect(searchInput).toBeVisible();
    await waitForResultsLabel(page);
  });

  test('debe mostrar filtros cuando se hace clic en el botón', async ({ page }) => {
    await loadSearchPage(page);
    await openFiltersPanel(page);
  });

  test('debe realizar búsqueda por texto', async ({ page }) => {
    await loadSearchPage(page);
    const searchInput = page.getByPlaceholder(/Buscar por nombre o descripción/i);
    await searchInput.fill('pasta');
    await searchInput.press('Enter');
    const resultsText = await waitForResultsLabel(page);
    await expect(resultsText).toHaveText(/2 resultados/i);
    await expect(page.getByRole('heading', { level: 3, name: FALLBACK_TITLE })).toBeVisible();
  });

  test('debe mostrar mensaje cuando no hay resultados', async ({ page }) => {
    await loadSearchPage(page);

    const searchInput = page.getByPlaceholder(/Buscar por nombre o descripción/i);
    await searchInput.fill(NO_RESULT_QUERY);
    await searchInput.press('Enter');
    const noResults = await waitForResultsLabel(page);
    await expect(noResults).toHaveText(/0 resultados/i);
  });

  test('debe navegar a página de receta al hacer clic', async ({ page }) => {
    await loadSearchPage(page);
    const recipeLink = page.getByRole('link', { name: /ver receta/i }).first();
    const href = await recipeLink.getAttribute('href');
    expect(href).toMatch(/^\/r\/public\//);
    await Promise.all([
      page.waitForURL(new RegExp(href!)),
      recipeLink.click(),
    ]);
  });

  test('debe aplicar filtro de dificultad', async ({ page }) => {
    await loadSearchPage(page);
    await openFiltersPanel(page);

    const difficultySection = page.locator('section').filter({ hasText: /Dificultad/i }).first();
    const easyFilter = difficultySection.getByText('Fácil', { exact: true });
    await easyFilter.click();
    const resultsLabel = await waitForResultsLabel(page);
    await expect(resultsLabel).toHaveText(/2 resultados/i);
  });
});

test.describe('Componente SearchFilters', () => {
  
  test('debe renderizar opciones de tiempo máximo', async ({ page }) => {
    await loadSearchPage(page);
    await openFiltersPanel(page);
    const timeInput = page.locator('input[aria-label="Tiempo máximo (minutos)"]').first();
    await expect(timeInput).toBeVisible();
  });

  test('debe permitir agregar ingredientes', async ({ page }) => {
    await loadSearchPage(page);
    await openFiltersPanel(page);
    const ingredientSection = page.locator('section').filter({ hasText: /Ingredientes/i }).first();
    const ingredientInput = ingredientSection.getByPlaceholder(/ingrediente/i);
    await ingredientInput.fill('tomate');
    await ingredientInput.press('Enter');
    const badge = ingredientSection.getByText('tomate');
    await expect(badge).toBeVisible();
  });
});

test.describe('Búsqueda Alternativa (/recipes/search)', () => {
  
  test('debe renderizar página alternativa de búsqueda', async ({ page }) => {
    await safeGoto(page, '/recipes/search');
    await page.waitForSelector('text=Cargando…', { state: 'detached', timeout: 15000 }).catch(() => {});

    // Verificar que carga correctamente
    await expect(page.getByRole('heading', { name: /buscar recetas/i })).toBeVisible({ timeout: 10000 });
    
    // Verificar que tiene campo de búsqueda
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('debe mostrar ordenamiento de resultados', async ({ page }) => {
    await page.goto('/recipes/search');
    
    await page.waitForTimeout(1000);
    const sortButtons = page.locator('button', { hasText: /relevancia|recientes|populares/i });
    await expect(sortButtons).toHaveCount(3);
  });
});
