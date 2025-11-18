# SISTEMA DE FONDOS ORGANIZADOS - IMPLEMENTACIÓN COMPLETA

## 🎯 ESTADO: ✅ COMPLETADO

**Fecha**: 18 de Noviembre de 2025  
**Commit**: be07e4e  
**Sistema**: Wallpapers organizados por sección con auto-routing

---

## 📂 BLOQUE 1: Estructura de Wallpapers

### Archivos Creados en `/public/wallpapers/`

✅ **10 archivos placeholder** (listos para reemplazar con imágenes Midjourney):

1. `home-free.webp` - Home para usuarios free
2. `home-premium.webp` - Home para usuarios premium  
3. `recipes-free.webp` - Recetas (alternativa)
4. `recipes-neutral.webp` - Listado de recetas (fondo neutro para listas largas)
5. `learn.webp` - Centro de aprendizaje
6. `stats.webp` - Dashboard de estadísticas
7. `community.webp` - Feed de comunidad
8. `feedback.webp` - Sistema de feedback/tickets
9. `profile.webp` - Perfil de usuario
10. `onboarding.webp` - Flujo de onboarding inicial

**Nota**: Actualmente son archivos de texto placeholder. Cuando recibas las imágenes finales de Midjourney, simplemente **renómbralas con estos nombres exactos** y reemplázalas en la carpeta.

---

## 🎨 BLOQUE 2: Tokens Globales CSS

### Añadido en `globals.css`

#### Variables CSS de Rutas (`:root`)
```css
--bg-home-free: url("/wallpapers/home-free.webp");
--bg-home-premium: url("/wallpapers/home-premium.webp");
--bg-recipes-free: url("/wallpapers/recipes-free.webp");
--bg-recipes-neutral: url("/wallpapers/recipes-neutral.webp");
--bg-learn: url("/wallpapers/learn.webp");
--bg-stats: url("/wallpapers/stats.webp");
--bg-community: url("/wallpapers/community.webp");
--bg-feedback: url("/wallpapers/feedback.webp");
--bg-profile: url("/wallpapers/profile.webp");
--bg-onboarding: url("/wallpapers/onboarding.webp");
```

#### Contenedor de Fondos (`.coco-page-background`)
- **Posición**: Fixed, z-index -10, no pointer-events
- **Pseudo-elemento `::before`**: 
  - Inset: -10% (extra coverage)
  - Background-size: cover, position: center
  - **Blur**: 36px (blur intenso para efecto wallpaper)
  - **Transform**: scale(1.08) (cubre bordes durante scroll)
  - **Opacity**: 0.9 (permite ver gradiente base debajo)

#### Clases por Sección (`.coco-bg-*`)
- `.coco-bg-home-free::before` → `--bg-home-free`
- `.coco-bg-home-premium::before` → `--bg-home-premium`
- `.coco-bg-recipes-free::before` → `--bg-recipes-free`
- `.coco-bg-recipes-neutral::before` → `--bg-recipes-neutral`
- `.coco-bg-learn::before` → `--bg-learn`
- `.coco-bg-stats::before` → `--bg-stats`
- `.coco-bg-community::before` → `--bg-community`
- `.coco-bg-feedback::before` → `--bg-feedback`
- `.coco-bg-profile::before` → `--bg-profile`
- `.coco-bg-onboarding::before` → `--bg-onboarding`

#### Botones CTA Liquid Glass

**`.coco-btn-primary`**:
- Font-size: 0.9rem, weight: 600
- Border-radius: 999px (pill shape)
- Padding: 0.65rem 1.25rem
- Backdrop-filter: blur(var(--glass-blur))
- Box-shadow: Multi-layer (inset border + strong + soft glow)
- **Hover**: translateY(-2px), intensified shadows

**Variantes por tema**:
- **Free**: Gradient orange→peach (rgba(255,107,53) → rgba(255,176,96))
- **Premium**: Gradient teal→sky (rgba(46,196,182) → rgba(56,189,248))

**`.coco-btn-secondary`**:
- Font-size: 0.85rem, weight: 500
- Background: Dark glass (rgba(15,23,42) con opacity)
- Menos énfasis visual que primary
- Hover: Slight lift + background brightening

#### Tipografía

**`.coco-heading`**:
- Font-weight: 600
- Letter-spacing: -0.02em (tight tracking)

---

## 🧩 BLOQUE 3: Componente AppBackground

### Ubicación
`src/components/layout/AppBackground.tsx`

### Lógica de Auto-Routing

**Función `resolveBackgroundVariant(pathname, isPremium)`**:

Normaliza pathname (remueve `/es/`, `/en/` etc.) y aplica estas reglas:

| Ruta | Fondo | Notas |
|------|-------|-------|
| `/` o `/dashboard` | `home-free` / `home-premium` | Según `isPremium` |
| `/recipes/search` o `/recipes` | `recipes-neutral` | Mejor para listas largas |
| `/learn` | `learn` | Centro de aprendizaje |
| `/dashboard/stats` | `stats` | Estadísticas |
| `/community` | `community` | Feed social |
| `/dashboard/feedback` | `feedback` | Tickets |
| `/dashboard/profile` o `/settings` | `profile` | Perfil usuario |
| `/onboarding` | `onboarding` | Wizard inicial |
| **Fallback** | `home-free` / `home-premium` | Cualquier otra ruta |

### Props

```tsx
type AppBackgroundProps = {
  children: React.ReactNode;
  variantOverride?: BackgroundVariant; // Forzar fondo específico
  isPremium?: boolean; // Para elegir home-free vs home-premium
  className?: string; // Opcional
};
```

### Uso

**Auto-detección** (usa ruta actual):
```tsx
<AppBackground>
  {/* Tu contenido */}
</AppBackground>
```

**Override manual**:
```tsx
<AppBackground variantOverride="stats">
  {/* Fuerza fondo de stats */}
</AppBackground>
```

**Con plan premium**:
```tsx
<AppBackground isPremium={user?.plan === 'premium'}>
  {/* Usa home-premium si es raíz */}
</AppBackground>
```

---

## 📄 BLOQUE 4: Páginas Integradas

### ✅ Páginas con AppBackground

1. **Home** (`src/app/[locale]/page.tsx`)
   - Variant: `home-free` (override explícito)
   - CTAs actualizados a `coco-btn-primary` + `coco-btn-secondary`
   - Feature cards usan `coco-glass-card` con variantes de color

2. **Dashboard** (`src/app/dashboard/page.tsx`)
   - Auto-routing (detecta `/dashboard` → home-free/premium)

3. **Learn** (`src/app/[locale]/learn/page.tsx`)
   - Variant: `learn`

4. **Stats** (`src/app/dashboard/stats/page.tsx`)
   - Variant: `stats`
   - Heading actualizado a `glass-text-strong coco-heading`

5. **Community** (`src/app/[locale]/community/page.tsx`)
   - Variant: `community`

6. **Profile** (`src/app/[locale]/dashboard/profile/page.tsx`)
   - Variant: `profile`

7. **Feedback** (`src/app/[locale]/dashboard/feedback/page.tsx`)
   - Variant: `feedback`

8. **Onboarding** (`src/app/[locale]/onboarding/page.tsx`)
   - Variant: `onboarding`

9. **Recipes** (`src/app/recipes/page.tsx`)
   - Variant: `recipes-neutral`

---

## 🎨 BLOQUE 5: Botones + Fuentes

### Tipografía en Tailwind Config

```javascript
fontFamily: { 
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Poppins', 'system-ui', 'sans-serif']
}
```

**Uso**:
- Texto normal → hereda `font-sans` (Inter)
- Headings importantes → `font-display` (Poppins)
- Clase helper → `.coco-heading` (font-display + weight 600 + tight spacing)

### Actualización de CTAs

**Home Page**:
- CTA principal (Chat): `coco-btn-primary coco-ripple`
- CTA secundario (Recetas): `coco-btn-secondary coco-ripple`

**Feature Cards**:
- Usan `coco-glass-card` con variantes: `glass-card-orange`, `glass-card-blue`, `glass-card-purple`
- Texto: `glass-text-strong` (contraste mejorado)

---

## ✅ CHECKLIST INTERNA (Completada)

### Fondos
- [x] `/public/wallpapers/` existe con 10 archivos .webp
- [x] `globals.css` tiene variables `--bg-*` y clases `.coco-bg-*`
- [x] `AppBackground` importado y usado en 9 páginas principales
- [x] `<body>` tiene `className="app-root-bg"` (desde implementación anterior)

### Liquid Glass
- [x] Clases glass (card/pill/icon/text-strong) existen y se usan
- [x] Cards principales del dashboard usan glass
- [x] Módulos de Learn usan glass
- [x] Paneles de Profile y Feedback usan glass

### Botones
- [x] `coco-btn-primary` y `coco-btn-secondary` existen en CSS
- [x] CTAs principales actualizados (Home page)
- [x] Todos los CTAs importantes tienen `coco-ripple`

### Texto
- [x] Textos importantes usan `text-text` o `glass-text-strong`
- [x] No hay textos con colores duros (text-black, text-slate-900) sobre glass
- [x] Home page actualizado con `glass-text-strong`

### Tipografía
- [x] Tailwind config tiene `font-sans` (Inter) y `font-display` (Poppins)
- [x] `.coco-heading` clase helper definida

---

## 🚀 PRÓXIMOS PASOS

### 1. Reemplazar Wallpapers con Imágenes Reales

Cuando recibas las imágenes finales de Midjourney:

1. Renombra cada imagen **exactamente** con estos nombres:
   - `home-free.webp`
   - `home-premium.webp`
   - `recipes-free.webp`
   - `recipes-neutral.webp`
   - `learn.webp`
   - `stats.webp`
   - `community.webp`
   - `feedback.webp`
   - `profile.webp`
   - `onboarding.webp`

2. Copia los archivos a `public/wallpapers/` (sobrescribe los placeholders)

3. **No hace falta tocar código** - el sistema ya está configurado

### Specs Recomendadas para Imágenes

- **Formato**: WebP (optimizado, ~50-100KB por imagen)
- **Dimensiones**: 1920x1080 mínimo (responsive scales automático)
- **Blur Pre-aplicado**: Heavy blur en Photoshop/Figma antes de export (el CSS aplica blur adicional de 36px)
- **Opacity**: Imágenes a full opacity (CSS aplica 0.9)
- **Estilo**: iOS-style, colores suaves, abstract patterns, food-related imagery

### 2. Testing Responsive

#### Mobile (320px - 375px)
- [ ] No horizontal scroll
- [ ] Glass cards legibles
- [ ] Botones táctiles (≥44px)
- [ ] Blur no causa lag (reduce en listas largas si necesario)

#### Tablet (768px)
- [ ] Layout escalado correcto
- [ ] Fondos cubren toda pantalla
- [ ] No overuse de glass effects

#### Desktop (≥1024px)
- [ ] Wallpapers centrados y cubiertos
- [ ] Gradiente base visible debajo
- [ ] Texto legible en todos los fondos

### 3. Performance Testing

**Si las páginas van lentas con fondos**:

1. Reduce blur de 36px a 24px:
```css
.coco-page-background::before {
  filter: blur(24px); /* Era 36px */
}
```

2. Baja opacity de 0.9 a 0.7:
```css
.coco-page-background::before {
  opacity: 0.7; /* Era 0.9 */
}
```

3. En listas largas (Recipes, Search), quita glass de items individuales:
```tsx
// Mantén glass solo en headers/cards principales
<Card className="border bg-card"> {/* Sin coco-glass-card */}
```

---

## 📊 RESUMEN DE CAMBIOS

### Archivos Creados
- 10 wallpaper placeholders en `public/wallpapers/`

### Archivos Modificados
- `src/app/globals.css`: +160 líneas (tokens, clases fondos, botones CTA)
- `src/components/layout/AppBackground.tsx`: Reescrito con auto-routing
- `tailwind.config.cjs`: +1 fuente display (Poppins)
- 9 páginas con `AppBackground` wrapper

### Clases CSS Nuevas
- 10 clases `.coco-bg-*` (una por sección)
- `.coco-page-background` (contenedor de fondos)
- `.coco-btn-primary` (CTA principal)
- `.coco-btn-secondary` (CTA secundario)
- `.coco-heading` (helper tipografía)

### Líneas de Código
- **Añadidas**: ~321 líneas
- **Modificadas**: ~60 líneas
- **Neto**: +261 líneas

---

## 🎯 CHECKLIST FINAL PARA TI

Antes de deploy a producción:

- [ ] Reemplazar 10 wallpapers placeholder con imágenes Midjourney reales
- [ ] Probar cada sección (Home, Dashboard, Learn, Stats, Community, Profile, Feedback, Onboarding, Recipes)
- [ ] Verificar que fondos cargan sin parpadeo (FOUC)
- [ ] Confirmar que gradiente base es visible como fallback
- [ ] Testing responsive (320px, 375px, 768px, 1024px+)
- [ ] Performance: No lag en scroll, FPS ≥50 en mobile
- [ ] Accesibilidad: Texto legible en todos los fondos
- [ ] Lighthouse audit: Performance ≥85, Accessibility ≥95

---

## ✨ RESULTADO ESPERADO

**Cada sección de la app tendrá su propio wallpaper único**:
- Home muestra fondo cálido/acogedor (diferente para free vs premium)
- Learn tiene fondo educativo (libros, ingredientes)
- Stats muestra visualización abstracta de datos
- Community tiene ambiente social/compartido
- Profile es personal/customizable
- Feedback tiene tono neutral/profesional
- Onboarding guía con colores progresivos
- Recipes usa fondo neutro para no distraer en listas

**Todo con transición suave entre páginas** gracias a:
- Fixed positioning (no scroll parallax)
- Blur pesado (36px) para efecto dreamlike
- Opacity 0.9 para ver gradiente base
- CSS variables para fácil mantenimiento

---

**Status**: ✅ Sistema completo e integrado  
**Bloqueador**: Reemplazo de wallpapers placeholder con imágenes reales  
**ETA Production**: Inmediato después de recibir wallpapers finales 🚀
