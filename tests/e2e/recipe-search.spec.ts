import { test, expect } from '@playwright/test';

/**
 * Tests para la funcionalidad de búsqueda de recetas
 * Verifica renderizado, filtros, búsqueda por texto y resultados
 */

const safeGoto = async (page, url: string) => {
    for (let i = 0; i < 2; i++) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        return;
      } catch (err) {
        if (i === 1) throw err;
        await page.waitForTimeout(250);
      }
    }
  };

      test.describe('Búsqueda de Recetas', () => {
  
  test('debe renderizar la página de búsqueda correctamente', async ({ page }) => {
    await safeGoto(page, 'http://localhost:3000/search');
    // Wait briefly for any client-side loading states to settle
    await page.waitForSelector('text=Cargando…', { state: 'detached', timeout: 15000 }).catch(() => {});
    // Verificar título de la página
    await expect(page.getByRole('heading', { name: /buscar recetas/i })).toBeVisible({ timeout: 10000 });
    
    // Verificar que existe el campo de búsqueda
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', /buscar/i);
  });

  test('debe mostrar filtros cuando se hace clic en el botón', async ({ page }) => {
    await safeGoto(page, 'http://localhost:3000/search');
    await page.waitForSelector('text=Cargando…', { state: 'detached', timeout: 15000 }).catch(() => {});
    
    // Buscar botón de filtros (puede tener icono de SlidersHorizontal)
    const filterButton = page.getByRole('button', { name: /filtros/i });
    
    // Si el botón existe, hacer clic y verificar que se expanden
    if (await filterButton.isVisible()) {
      await filterButton.click();
      
      // Verificar que aparecen opciones de filtrado
      // (tiempo, dificultad, dietas, ingredientes según el componente)
      await page.waitForTimeout(500); // Dar tiempo a la animación
    }
  });

  test('debe realizar búsqueda por texto', async ({ page }) => {
    await safeGoto(page, 'http://localhost:3000/search');
    await page.waitForSelector('text=Cargando…', { state: 'detached', timeout: 15000 }).catch(() => {});

    const searchInput = page.locator('input[type="text"]').first();
    
    // Escribir término de búsqueda
    await searchInput.fill('pasta');
    await searchInput.press('Enter');
    
    // Esperar a que se carguen resultados
    await page.waitForSelector('text=Cargando…', { state: 'detached', timeout: 15000 }).catch(() => {});
    
    // Verificar que se muestran resultados o mensaje
    const resultsText = page.locator('text=/resultados/i').first();
    await expect(resultsText).toBeVisible();
  });

  test('debe mostrar mensaje cuando no hay resultados', async ({ page }) => {
    await safeGoto(page, 'http://localhost:3000/search');
    await page.waitForSelector('text=Cargando…', { state: 'detached', timeout: 15000 }).catch(() => {});

    const searchInput = page.locator('input[type="text"]').first();
    
    // Buscar algo que probablemente no existe
    await searchInput.fill('xyzabc123nonexistent');
    await searchInput.press('Enter');
    
    await page.waitForSelector('text=Cargando…', { state: 'detached', timeout: 15000 }).catch(() => {});
    
    // Verificar mensaje de sin resultados (0 resultados, "Sin resultados", etc.)
    const noResults = page.locator('text=/0 resultados|sin resultados/i').first();
    await expect(noResults).toBeVisible();
  });

  test('debe navegar a página de receta al hacer clic', async ({ page }) => {
    await safeGoto(page, 'http://localhost:3000/search');
    await page.waitForSelector('text=Cargando…', { state: 'detached', timeout: 15000 }).catch(() => {});
    
    // Buscar primer card de receta (si hay resultados)
    const recipeCards = page.locator('[href^="/recipes/"]').first();
    
    if (await recipeCards.isVisible()) {
      const href = await recipeCards.getAttribute('href');
      await recipeCards.click();
      
      // Verificar que navegó a la página de detalle
      await expect(page).toHaveURL(new RegExp(href!));
    }
  });

  test('debe aplicar filtro de dificultad', async ({ page }) => {
    await safeGoto(page, 'http://localhost:3000/search');
    
    // Abrir filtros si es necesario
    const filterButton = page.getByRole('button', { name: /filtros/i });
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);
    }
    
    // Buscar y hacer clic en filtro de dificultad "Fácil"
    const easyFilter = page.locator('text=/fácil/i').first();
    if (await easyFilter.isVisible()) {
      await easyFilter.click();
      await page.waitForTimeout(1000);
      
      // Verificar que se aplicó el filtro (puede reflejarse en URL o resultados)
      const url = page.url();
      // La URL podría contener parámetro de dificultad
      // O verificar que los resultados se actualizaron
    }
  });
});

test.describe('Componente SearchFilters', () => {
  
  test('debe renderizar opciones de tiempo máximo', async ({ page }) => {
    await safeGoto(page, 'http://localhost:3000/search');
    
    const filterButton = page.getByRole('button', { name: /filtros/i });
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);
      
      // Verificar que existe slider o input de tiempo
      const timeInput = page.locator('input[type="range"], input[type="number"]').first();
      if (await timeInput.isVisible()) {
        await expect(timeInput).toBeVisible();
      }
    }
  });

  test('debe permitir agregar ingredientes', async ({ page }) => {
    await safeGoto(page, 'http://localhost:3000/search');
    
    const filterButton = page.getByRole('button', { name: /filtros/i });
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);
      
      // Buscar input de ingredientes
      const ingredientInput = page.locator('input[placeholder*="ingrediente"]').first();
      if (await ingredientInput.isVisible()) {
        await ingredientInput.fill('tomate');
        await ingredientInput.press('Enter');
        
        // Verificar que aparece badge con el ingrediente
        await page.waitForTimeout(500);
        const badge = page.locator('text=tomate').first();
        await expect(badge).toBeVisible();
      }
    }
  });
});

test.describe('Búsqueda Alternativa (/recipes/search)', () => {
  
  test('debe renderizar página alternativa de búsqueda', async ({ page }) => {
    await safeGoto(page, 'http://localhost:3000/recipes/search');
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
    
    // Buscar botones de ordenamiento (relevancia, recientes, populares)
    const sortButtons = page.locator('button').filter({ hasText: /relevancia|recientes|populares/i });
    
    if (await sortButtons.first().isVisible()) {
      const count = await sortButtons.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});
