# 🧪 Testing - Cocorico App

Este directorio contiene todos los tests automatizados del proyecto.

## 📁 Estructura

```
tests/
├── e2e/                      # Tests End-to-End con Playwright
│   ├── health.spec.ts        # Smoke test de salud del servidor
│   ├── navigation.spec.ts    # Tests de navegación
│   ├── recipe-search.spec.ts # Tests de búsqueda de recetas
│   └── public-recipe.spec.ts # Tests de visualización pública
├── unit/                     # Tests unitarios con Jest
│   ├── RecipeForm.test.tsx   # Test del formulario de recetas
│   └── SearchFilters.test.tsx # Test de filtros de búsqueda
├── jest.setup.ts             # Configuración de Jest
└── __mocks__/                # Mocks compartidos
```

---

## 🚀 Ejecutar Tests

### Tests Unitarios (Jest)

```bash
# Ejecutar todos los tests unitarios
npm test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar solo tests unitarios
npm run test:unit

# Ejecutar test específico
npm run test:recipe-form
npm run test:search-filters
```

### Tests E2E (Playwright)

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar tests E2E con UI interactiva
npm run test:e2e:ui

# Ejecutar test específico
npm run test:e2e:search      # Solo tests de búsqueda
npm run test:e2e:public      # Solo tests de recetas públicas

# Ejecutar tests en producción
npm run test:e2e:prod
```

### Ejecutar Todos los Tests

```bash
# Unitarios + E2E
npm run test:all
```

---

## ✅ Tests Implementados

### E2E Tests (Playwright)

#### `recipe-search.spec.ts`
- ✅ Renderizado de página de búsqueda
- ✅ Mostrar/ocultar filtros
- ✅ Búsqueda por texto
- ✅ Mensaje cuando no hay resultados
- ✅ Navegación a detalle de receta
- ✅ Aplicar filtro de dificultad
- ✅ Agregar ingredientes a filtros
- ✅ Ordenamiento de resultados

#### `public-recipe.spec.ts`
- ✅ Acceso a receta pública sin login
- ✅ Renderizado de contenido de receta
- ✅ Mostrar información de dificultad y tiempo
- ✅ Mostrar lista de ingredientes
- ✅ Mostrar pasos de preparación
- ✅ No mostrar botón editar sin autenticación
- ✅ Feed público de recetas
- ✅ Diferentes formatos de URL

### Unit Tests (Jest + React Testing Library)

#### `RecipeForm.test.tsx`
- ✅ Renderizado del formulario
- ✅ Valores por defecto
- ✅ Validación de campos requeridos
- ✅ Llamada a onSubmit con datos correctos
- ✅ Estado de carga
- ✅ Cambio de visibilidad (pública/privada)
- ✅ Selección de dificultad
- ✅ Validación de tiempo de preparación

#### `SearchFilters.test.tsx`
- ✅ Renderizado del componente
- ✅ Expandir/colapsar filtros
- ✅ Cambiar tiempo máximo
- ✅ Seleccionar dificultad
- ✅ Agregar ingredientes
- ✅ Eliminar ingredientes
- ✅ Seleccionar dietas
- ✅ Deseleccionar filtros
- ✅ Estilos premium
- ✅ Prevenir duplicados de ingredientes

---

## 📋 Checklist Manual (QA)

Para pruebas manuales completas, consulta:
- **[docs/qa-beta-checklist.md](../docs/qa-beta-checklist.md)**

Incluye:
- Autenticación (registro, login, logout, recuperación)
- Gestión de recetas (crear, editar, eliminar)
- Búsqueda y filtros avanzados
- Visibilidad pública/privada
- Sugerencias con IA
- Navegación y UI
- Rendimiento y compatibilidad
- Seguridad

---

## 🛠️ Configuración

### Jest

Configuración en `jest.config.js`:
- Entorno: `jsdom` para tests de React
- Setup: `tests/jest.setup.ts`
- Mapeo de módulos: `@/` → `src/`
- Transform: `ts-jest` para TypeScript

### Playwright

Configuración en `playwright.config.ts`:
- Base URL: `http://localhost:3000`
- Browser: Chromium (Desktop Chrome)
- Retries: 2 en CI, 0 en local
- Web Server: Auto-start con `npm run dev`

---

## 📝 Escribir Nuevos Tests

### Test Unitario (Jest)

```typescript
/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MiComponente from '@/components/MiComponente';

describe('MiComponente', () => {
  it('debe renderizar correctamente', () => {
    render(<MiComponente />);
    expect(screen.getByText(/contenido/i)).toBeInTheDocument();
  });
});
```

### Test E2E (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('debe hacer algo', async ({ page }) => {
  await page.goto('/ruta');
  await expect(page.getByRole('heading')).toBeVisible();
});
```

---

## 🐛 Debugging

### Jest
```bash
# Ver output detallado
npm test -- --verbose

# Ejecutar solo un test
npm test -- -t "nombre del test"
```

### Playwright
```bash
# Modo debug
npx playwright test --debug

# Ver trace de tests fallidos
npx playwright show-report
```

---

## 🎯 Cobertura de Tests

Para ver reporte de cobertura:

```bash
npm run test:coverage
```

Abre `coverage/lcov-report/index.html` en el navegador.

**Objetivo mínimo de cobertura:**
- Statements: > 70%
- Branches: > 60%
- Functions: > 70%
- Lines: > 70%

---

## 🚦 CI/CD

Los tests se ejecutan automáticamente en:
- **GitHub Actions** (si configurado)
- **Vercel** (pre-deploy checks)

Para simular CI localmente:
```bash
CI=true npm run test:all
```

---

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## ✨ Próximos Tests a Implementar

- [ ] Tests de autenticación (login, registro, logout)
- [ ] Tests de creación/edición de recetas
- [ ] Tests de integración con API
- [ ] Tests de componentes de IA (chat, sugerencias)
- [ ] Tests de performance (Lighthouse CI)
- [ ] Tests de accesibilidad (a11y)
- [ ] Tests de integración con Stripe
- [ ] Tests de notificaciones y toasts

---

**💡 Tip:** Ejecuta tests antes de cada commit para asegurar que no rompes nada existente.
