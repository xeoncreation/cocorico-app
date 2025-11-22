# BLOQUES DE LAYOUT - STATUS DE IMPLEMENTACIÓN

**Fecha:** 2025-11-20  
**Objetivo:** Normalizar layouts, responsive, a11y y PWA en toda la aplicación

---

## ✅ BLOQUE 1: Layout Global Audit & Normalization

**STATUS:** COMPLETADO (parcial - necesita migración de páginas legacy)

### Cambios Implementados:

1. **`src/app/community/layout.tsx`**
   - ❌ Eliminado: Navbar duplicado
   - ✅ Ahora usa layout padre [locale] que ya incluye UnifiedNavbar

2. **`src/app/[locale]/legal/layout.tsx`**
   - ✅ Documentado: Hereda automáticamente nav+footer del layout padre
   - ✅ Mantiene solo estilos de contenedor específicos

3. **`src/components/layout/LegacyPageWrapper.tsx`**
   - ✅ Creado: Wrapper para páginas raíz que no están bajo [locale]/
   - ✅ Incluye Navbar + Footer + padding-top
   - ✅ Props: `addTopPadding`, `includeFooter`

4. **`src/app/login/page.tsx`**
   - ✅ Actualizado: Envuelto con `<LegacyPageWrapper>`
   - ✅ Ahora tiene navegación consistente

### Arquitectura Descubierta:

```
src/app/
├── layout.tsx (root)          → Providers globales, NO nav/footer
├── [locale]/
│   ├── layout.tsx             → UnifiedNavbar + Footer inline ✅
│   ├── legal/layout.tsx       → Solo estilos, hereda nav+footer ✅
│   └── ...páginas localizadas → Todas tienen nav+footer ✅
├── community/layout.tsx       → Eliminado nav duplicado ✅
├── login/page.tsx            → Usa LegacyPageWrapper ✅
├── signup/page.tsx           → ❌ PENDIENTE: Envolver con LegacyPageWrapper
├── chat/page.tsx             → ❌ PENDIENTE: Migrar a [locale]/ o wrapper
├── recipes/page.tsx          → ❌ PENDIENTE: Migrar a [locale]/ o wrapper
├── dashboard/page.tsx        → ❌ PENDIENTE: Migrar a [locale]/ o wrapper
└── ...16 páginas más         → ❌ PENDIENTE: Ver lista completa abajo
```

### Páginas Legacy Sin Navegación (PENDIENTE):

```
src/app/upgrade/page.tsx
src/app/signup/page.tsx ← ALTA PRIORIDAD (auth)
src/app/settings/page.tsx
src/app/search/page.tsx
src/app/pricing/page.tsx
src/app/recipes/page.tsx
src/app/premium/page.tsx
src/app/learn/page.tsx
src/app/free/page.tsx
src/app/dev-test/page.tsx
src/app/community/page.tsx
src/app/dashboard/page.tsx
src/app/chat/page.tsx ← ALTA PRIORIDAD (core feature)
src/app/access/page.tsx
src/app/admin/page.tsx
```

### Acciones Recomendadas:

1. **Inmediato:** Envolver `/signup` con `LegacyPageWrapper`
2. **Corto plazo:** Envolver `/chat`, `/recipes`, `/dashboard` (core features)
3. **Largo plazo:** Migrar TODAS las páginas raíz a `[locale]/` para i18n completo

---

## ✅ BLOQUE 2: Fix Header/Content Overlap

**STATUS:** COMPLETADO

### Cambios Implementados:

1. **`src/app/[locale]/layout.tsx`**
   ```tsx
   // ANTES:
   <main className="flex-1">
   
   // DESPUÉS:
   <main className="flex-1 pt-16 mt-1">
   ```
   - ✅ `pt-16` (64px) compensa altura del navbar sticky
   - ✅ `mt-1` añade separación visual adicional

2. **`src/components/layout/LegacyPageWrapper.tsx`**
   ```tsx
   <main className={`flex-1 ${addTopPadding ? "pt-[60px]" : ""}`}>
   ```
   - ✅ 60px para páginas legacy (Navbar ligeramente más compacto)

3. **`src/components/navigation/UnifiedNavbar.tsx`**
   - ✅ Ya tiene `sticky top-0 z-50`
   - ✅ Altura estimada: ~60-70px (varía según contenido)

### Verificación Visual Pendiente:

- [ ] Probar en /es/recipes (localized)
- [ ] Probar en /chat (legacy)
- [ ] Probar en /es/legal/privacy
- [ ] Verificar en móvil que no haya overlap

---

## ✅ BLOQUE 3: Legal Footer Implementation

**STATUS:** COMPLETADO

### Footer en Layouts Localizados:

**`src/app/[locale]/layout.tsx`** - Footer inline con:
- ✅ Logo "🐓 Cocorico — hecho con ❤️ y un toque de IA"
- ✅ Enlaces legales: Privacidad, Términos, Cookies (con locale en URL)
- ✅ Copyright dinámico: `© {new Date().getFullYear()}`
- ✅ Build tag: `Cocorico v0.1.0` + Voice/Vision/Food-IQ status
- ✅ Responsive: `flex-col md:flex-row`

### Footer para Páginas Legacy:

**`src/components/Footer.tsx`** - Componente reutilizable:
- ✅ 4 columnas en desktop, 1 en móvil
- ✅ Enlaces rápidos: Chat, Lab IA, Recetas, Comunidad
- ✅ Cuenta: Dashboard, Logros, Retos, Premium
- ✅ Legal: /legal/privacy, /legal/terms, /legal/cookies
- ✅ Build tag con feature status (detecta env vars)

### Patrón min-h-screen:

```tsx
// Todos los layouts usan este patrón:
<div className="min-h-screen flex flex-col">
  <Navbar />
  <main className="flex-1">...</main>
  <Footer className="mt-auto" />
</div>
```

---

## 🔄 BLOQUE 4: Navigation Always Available

**STATUS:** EN PROGRESO (30%)

### Completado:

- ✅ `/login` - LegacyPageWrapper con Navbar + Footer
- ✅ Páginas bajo `[locale]/` - UnifiedNavbar automático

### Pendiente:

- [ ] `/signup` - Aplicar LegacyPageWrapper
- [ ] Páginas de error (error.tsx, not-found.tsx)
- [ ] Full-screen views: `/scanner`, `/chat` (evaluar si necesitan nav)
- [ ] Audit: Verificar que TODAS las rutas tengan back button o nav

### Casos Especiales:

1. **Auth pages** - LegacyPageWrapper con `hideFooter={true}` opcional
2. **Scanner/Camera** - Considerar nav flotante o botón back
3. **Error pages** - Minimal nav con solo logo + "Volver a inicio"

---

## ✅ BLOQUE 5: i18n Coming Soon States

**STATUS:** COMPLETADO

### Cambios Implementados:

1. **`src/components/LanguageSelector.tsx`**
   ```tsx
   // ANTES:
   { code: "en", name: "English", flag: "🇬🇧", available: true, ...}
   
   // DESPUÉS:
   { code: "en", name: "English", flag: "🇬🇧", available: false, ...}
   ```
   - ✅ English marcado como `available: false`
   - ✅ Badge "Próx." visible en selector
   - ✅ Pulse animation cuando usuario intenta cambiar a idioma no disponible

2. **`middleware.ts`**
   ```tsx
   // Redirigir /en a /es hasta que English esté completo
   if (pathname.startsWith('/en')) {
     const newPath = pathname.replace(/^\/en/, '/es');
     return NextResponse.redirect(redirectUrl);
   }
   ```
   - ✅ Bloquea acceso a rutas `/en/*`
   - ✅ Preserva query params en redirect

### Estado Actual de Idiomas:

| Idioma   | Code | Archivo JSON | Available | Estado                    |
|----------|------|--------------|-----------|---------------------------|
| Español  | es   | ✅           | true      | Completo                  |
| English  | en   | ✅ (parcial) | false     | 🚧 Traducciones pendientes |
| Français | fr   | ❌           | false     | 📋 Planificado            |
| Deutsch  | de   | ❌           | false     | 📋 Planificado            |
| ...otros | ...  | ❌           | false     | 📋 Planificado            |

### Para Activar English:

1. Completar traducciones en `src/messages/en.json`
2. Cambiar `available: false` → `available: true`
3. Eliminar redirect en middleware

---

## 📋 BLOQUE 6: Final Design Verification

**STATUS:** NO INICIADO

### Checklist de Páginas:

#### Home & Auth
- [ ] `/es` (home) - Verificar hero, CTA, layout
- [ ] `/es/login` - No existe (usa /login legacy)
- [ ] `/login` - ✅ Tiene LegacyPageWrapper
- [ ] `/signup` - ❌ Necesita LegacyPageWrapper

#### Core Features
- [ ] `/es/chat` - Verificar layout
- [ ] `/es/recipes` - Verificar grid, filtros
- [ ] `/es/recipes/[id]` - Verificar detalle
- [ ] `/es/scanner` - Verificar cámara UI

#### Dashboard
- [ ] `/es/dashboard` - Panel principal
- [ ] `/es/dashboard/achievements` - Logros
- [ ] `/es/dashboard/challenges` - Retos
- [ ] `/es/dashboard/favorites` - Favoritos

#### Community
- [ ] `/es/community` - Feed principal
- [ ] `/es/community/[id]` - Post individual
- [ ] `/es/community/new` - Crear post

#### Legal & Settings
- [ ] `/es/legal/privacy` - ✅ Layout OK
- [ ] `/es/legal/terms` - ✅ Layout OK
- [ ] `/es/legal/cookies` - ✅ Layout OK
- [ ] `/es/settings` - Verificar formularios

---

## 📱 BLOQUE 7: Responsive Mobile Audit

**STATUS:** NO INICIADO

### Viewport Meta Tags:

✅ **Configurado en `src/app/layout.tsx`:**
```tsx
export const viewport: Viewport = {
  themeColor: "#FBC531",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};
```

### Mobile Menu:

✅ **UnifiedNavbar usa Sheet component:**
- Desktop: Links horizontales
- Mobile (<lg): Hamburger menu → Sheet lateral
- ✅ Implementado con shadcn/ui Sheet

### Pendiente:

- [ ] Audit breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- [ ] Fix overflow-x en todas las páginas
- [ ] Verificar touch targets ≥44x44px (botones, links)
- [ ] Test en iOS Safari, Chrome Mobile, Firefox Mobile
- [ ] Verificar gestos: swipe, pinch-zoom, scroll
- [ ] Landscape mode: Tablet horizontal, phone horizontal

### Touch Target Audit:

```tsx
// Estándar mínimo:
button/link: min-h-11 min-w-11 (44x44px)
icon-only: p-3 (48x48px recomendado)
```

---

## ♿ BLOQUE 8: Accessibility (a11y)

**STATUS:** NO INICIADO

### ARIA Labels Pendientes:

- [ ] UnifiedNavbar: `aria-label="Main navigation"`
- [ ] Mobile menu button: `aria-label="Open menu"`
- [ ] LanguageSelector: `aria-label="Select language"`
- [ ] ThemeToggle: `aria-label="Toggle dark mode"`
- [ ] User menu: `aria-haspopup="true" aria-expanded={open}`

### Semantic HTML Audit:

- [ ] Usar `<nav>` para navegación
- [ ] Usar `<main>` para contenido principal (✅ Ya implementado)
- [ ] Usar `<footer>` para footer (✅ Ya implementado)
- [ ] Headers: `<h1>`, `<h2>`, etc. en orden jerárquico
- [ ] Listas: `<ul>/<ol>` para nav links
- [ ] Botones: `<button>` vs `<div onClick>`

### Keyboard Navigation:

- [ ] Tab order lógico
- [ ] Focus visible: `focus:outline` y `focus:ring`
- [ ] Escape cierra modales/dropdowns
- [ ] Enter/Space activa botones
- [ ] Arrow keys en menús desplegables

### Form Labels:

- [ ] Todos los inputs tienen `<label>` o `aria-label`
- [ ] Error messages con `aria-describedby`
- [ ] Required fields con `aria-required="true"`
- [ ] Autocomplete hints donde aplique

### Alt Texts:

- [ ] Todas las imágenes decorativas: `alt=""`
- [ ] Imágenes informativas: `alt="descripción significativa"`
- [ ] Logo: `alt="Cocorico logo"`
- [ ] Avatar placeholders: `alt="User avatar"`

### Color Contrast:

- [ ] WCAG AA: Ratio mínimo 4.5:1 para texto normal
- [ ] WCAG AA: Ratio mínimo 3:1 para texto grande (18px bold / 24px)
- [ ] Verificar cocorico-red (#E74C3C?) sobre blanco
- [ ] Dark mode: Verificar colores también

### Herramientas Recomendadas:

- axe DevTools (Chrome extension)
- Lighthouse (Chrome DevTools)
- WAVE (Web Accessibility Evaluation Tool)
- React Testing Library con jest-axe

---

## 📲 BLOQUE 9: PWA & Mobile Architecture

**STATUS:** PARCIAL (30%)

### ✅ Completado:

1. **iOS Meta Tags** - `src/app/layout.tsx`:
   ```tsx
   <meta name="apple-mobile-web-app-capable" content="yes" />
   <meta name="apple-mobile-web-app-status-bar-style" content="default" />
   <meta name="apple-mobile-web-app-title" content="Cocorico" />
   <meta name="format-detection" content="telephone=no" />
   ```

2. **Manifest** - `public/manifest.webmanifest`:
   - ✅ Archivo existe
   - ❓ Pendiente verificar contenido completo

3. **Service Worker** - `public/sw.js`:
   - ✅ Archivo existe
   - ❓ Pendiente verificar estrategia de cache
   - ✅ `public/firebase-messaging-sw.js` para notificaciones

### Pendiente:

#### Manifest Verification:

```json
{
  "name": "Cocorico",
  "short_name": "Cocorico",
  "description": "Tu asistente de cocina con IA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#FBC531",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "screenshots": [...]
}
```

- [ ] Verificar `icons/` existen en todos los tamaños
- [ ] Agregar `screenshots` para app stores
- [ ] Verificar `start_url` redirige correctamente

#### Service Worker Strategy:

- [ ] Cache-first para assets estáticos
- [ ] Network-first para API calls
- [ ] Offline fallback page (`public/offline.html`)
- [ ] Background sync para forms
- [ ] Push notifications setup

#### iOS Specifics:

- [ ] Splash screens para diferentes tamaños
- [ ] Touch icons (180x180px)
- [ ] Status bar color
- [ ] Safe area handling

#### Android Specifics:

- [ ] TWA (Trusted Web Activity) setup
- [ ] App shortcuts
- [ ] Badging API
- [ ] Share target API

#### Mobile QA Document:

Crear `docs/mobile-qa-checklist.md` con:
- [ ] Instalación en home screen (iOS, Android)
- [ ] Offline mode
- [ ] Push notifications
- [ ] Geolocation (si aplica)
- [ ] Camera/media (para scanner)
- [ ] Storage limits
- [ ] Performance en 3G

#### Native Wrappers (Futuro):

**Opciones evaluadas:**

1. **Capacitor** (recomendado)
   - Mantiene web app actual
   - Acceso a APIs nativas
   - Plugins oficiales
   - Deploy a App Store / Play Store

2. **React Native** (solo si necesario)
   - Reescritura completa
   - Performance nativa
   - Mayor complejidad

3. **Expo** (alternativa rápida)
   - Basado en React Native
   - Managed workflow
   - Más limitado

**Decisión:** Continuar con PWA optimizado. Evaluar Capacitor solo si:
- Necesitamos APIs nativas específicas no disponibles en web
- Requisito de presencia en app stores
- Performance crítica que PWA no logra

---

## 📊 Resumen General

| Bloque | Status       | Progreso | Prioridad |
|--------|--------------|----------|-----------|
| 1      | ✅ Completado | 70%      | 🔴 Alta    |
| 2      | ✅ Completado | 100%     | 🔴 Alta    |
| 3      | ✅ Completado | 100%     | 🟡 Media   |
| 4      | 🔄 En progreso| 30%      | 🔴 Alta    |
| 5      | ✅ Completado | 100%     | 🟡 Media   |
| 6      | 📋 Pendiente  | 0%       | 🟢 Baja    |
| 7      | 📋 Pendiente  | 20%      | 🔴 Alta    |
| 8      | 📋 Pendiente  | 0%       | 🔴 Alta    |
| 9      | 🔄 Parcial    | 30%      | 🟡 Media   |

### Próximos Pasos (Prioridad):

1. **INMEDIATO:**
   - [ ] Aplicar LegacyPageWrapper a `/signup`
   - [ ] Verificar overlap visual en 3 páginas clave

2. **CORTO PLAZO (esta semana):**
   - [ ] Completar BLOQUE 4: Navigation always available
   - [ ] Iniciar BLOQUE 7: Responsive mobile audit
   - [ ] Iniciar BLOQUE 8: Accessibility audit

3. **MEDIANO PLAZO (próximas 2 semanas):**
   - [ ] Migrar páginas legacy a [locale]/
   - [ ] Completar BLOQUE 6: Verification
   - [ ] Completar BLOQUE 9: PWA setup

4. **LARGO PLAZO:**
   - [ ] Evaluar Capacitor para native wrappers
   - [ ] Activar English (completar traducciones)
   - [ ] Agregar más idiomas

---

**Última actualización:** 2025-11-20  
**Autor:** GitHub Copilot (Claude Sonnet 4.5)
