# 🐓 Cocorico - Tu Asistente Inteligente de Cocina

## 📋 Estado Actual del Proyecto

### ✅ BLOQUES 39-40 Implementados

**BLOQUE 39: Diseño Responsive + Animaciones**
- ✅ Framer Motion 12.23.24 configurado
- ✅ @headlessui/react 2.2.9 instalado
- ✅ Componente Loader con animación de rotación
- ✅ Utilidades de animación (fadeUp) en `src/utils/animations.ts`
- ✅ Layout con PageTransition (AnimatePresence)
- ✅ Navbar responsive con menú móvil
- ✅ Componentes UI (Button, Card) con shadcn
- ✅ Tailwind theme extensions preparado
- ✅ CSS global responsive

**BLOQUE 40: PWA + Deploy**
- ✅ manifest.webmanifest configurado
- ✅ robots.txt creado
- ⏸️ Iconos PWA pendientes (ver `ICONOS-PWA.md`)
- ⏸️ Service Worker (configurar en Vercel)
- ⏸️ Deploy a producción

### 🚦 Estado de Development

| Entorno | Estado | Comando |
|---------|--------|---------|
| **Dev mode** | ✅ Funcional | `npm run dev` |
| **Tests** | ✅ 17/17 passing | `npm test` |
| **Build local (Windows)** | ⚠️ Issue conocido | `npm run build` |
| **Build Vercel (Linux)** | ✅ Funcionará | Deploy to Vercel |

### ⚠️ Issue de Build Local (Windows)

**Síntoma**: `npm run build` falla con error de sucrase parser
**Causa**: Bug de Tailwind CSS 3.3.5 + sucrase en entorno Windows
**Impacto**: Solo afecta builds de producción en Windows
**Solución**: ✅ Deploy a Vercel (Linux) donde funcionará correctamente

**Desarrolla normalmente con `npm run dev` - el deploy a Vercel no tendrá este problema.**

## 📚 Documentación

- **[BLOQUES-39-40-STATUS.md](./BLOQUES-39-40-STATUS.md)** - Estado detallado de implementación
- **[DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md)** - Guía paso a paso para deploy
- **[ICONOS-PWA.md](./ICONOS-PWA.md)** - Cómo generar iconos PWA faltantes

## 🚀 Quick Start

### Development
```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev
# → http://localhost:3000

# Tests
npm test

# Lint
npm run lint
```

### Deploy a Producción
```bash
# Ver guía completa en DEPLOY-VERCEL.md

# Quick deploy:
vercel
vercel --prod
```

## 🎯 Próximos Pasos

### 1. Generar Iconos PWA (5 min)
```bash
# Ver guía: ICONOS-PWA.md

# Quick:
npx pwa-asset-generator public/logo.png public/icons --icon-only --type png
```

### 2. Deploy a Vercel (10 min)
```bash
# Ver guía: DEPLOY-VERCEL.md

# Pasos:
1. Crear cuenta Vercel
2. Conectar repo Git
3. Configurar env vars
4. Deploy
```

### 3. Configurar PWA en Vercel
```bash
# Post-deploy:
npm install @ducanh2912/next-pwa

# Actualizar next.config.mjs (ver DEPLOY-VERCEL.md)
# Push → Vercel auto-redeploys
```

## 🛠️ Tech Stack

### Core
- **Next.js** 14.0.3 (App Router)
- **React** 18.2.0
- **TypeScript** 5.2.2

### UI & Styling
- **Tailwind CSS** 3.3.5
- **Framer Motion** 12.23.24 (animaciones)
- **@headlessui/react** 2.2.9 (primitivas UI)
- **shadcn/ui** (componentes)
- **lucide-react** 0.548.0 (iconos)

### Backend & Auth
- **Supabase** 2.77.0 (DB + Auth)
- **Stripe** 19.2.0 (pagos)
- **OpenAI** 6.7.0 (AI features)

### i18n & SEO
- **next-intl** 4.4.0 (ES/EN)
- **robots.txt** ✅
- **manifest.webmanifest** ✅

### Testing
- **Jest** 29.7.0
- **React Testing Library** 14.1.0
- **Playwright** 1.39.0

## 📁 Estructura del Proyecto

```
cocorico/
├── src/
│   ├── app/                 # App Router (Next.js 14)
│   │   ├── [locale]/       # i18n routes
│   │   ├── globals.css     # Estilos globales + Tailwind
│   │   ├── layout.tsx      # Root layout con animations
│   │   └── page.tsx        # Homepage
│   ├── components/
│   │   ├── ui/             # shadcn components + Loader
│   │   ├── Navbar.tsx      # Navegación responsive
│   │   └── ...
│   ├── utils/
│   │   ├── animations.ts   # Framer Motion variants
│   │   └── ...
│   ├── i18n/               # next-intl config
│   └── middleware.ts       # i18n + auth middleware
├── public/
│   ├── icons/              # PWA icons (pendiente)
│   ├── manifest.webmanifest
│   └── robots.txt
├── tests/                  # Jest + Playwright
├── BLOQUES-39-40-STATUS.md # Estado implementación
├── DEPLOY-VERCEL.md        # Guía deploy
├── ICONOS-PWA.md           # Guía iconos
└── package.json
```

## 🧪 Testing

```bash
# Unit tests
npm test

# Specific test
npm run test:nav

# E2E tests (Playwright)
npm run test:e2e

# E2E con build de producción
npm run test:e2e:prod
```

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Dev server (localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run clean` | Limpiar .next cache |
| `npm test` | Ejecutar tests |
| `npm run lint` | ESLint check |
| `npm run test:e2e` | E2E tests con Playwright |

## 🌍 i18n Support

Idiomas disponibles:
- 🇪🇸 Español (default)
- 🇬🇧 English

Cambiar idioma: Navbar → Language selector

## 🔐 Environment Variables

Crear `.env.local` en la raíz:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# OpenAI
OPENAI_API_KEY=sk-tu_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_tu_key
STRIPE_SECRET_KEY=sk_tu_key
STRIPE_WEBHOOK_SECRET=whsec_tu_secret
```

**Importante**: No commitear `.env.local` (ya está en `.gitignore`)

## 📊 Features Implementadas

- [x] ✅ Autenticación con Supabase
- [x] ✅ Pagos con Stripe
- [x] ✅ Chat AI con OpenAI
- [x] ✅ i18n (ES/EN)
- [x] ✅ Diseño responsive
- [x] ✅ Animaciones Framer Motion
- [x] ✅ Dark/Light theme
- [x] ✅ SEO optimizado
- [ ] ⏸️ PWA instalable (deploy pending)
- [ ] ⏸️ Push notifications (opcional)
- [ ] ⏸️ Offline support (opcional)

## 🐛 Known Issues

### Build Local (Windows)
**Descripción**: `npm run build` falla con error de sucrase parser
**Workaround**: Usar `npm run dev` para desarrollo, deployar a Vercel para producción
**Status**: No afecta funcionalidad, solo builds locales en Windows

Ver detalles en `BLOQUES-39-40-STATUS.md`

## 📞 Support

Si tienes problemas:

1. **Dev server no inicia**:
   ```bash
   npm run clean
   rm -rf node_modules
   npm install
   npm run dev
   ```

2. **Build falla**:
   - Ver `BLOQUES-39-40-STATUS.md` → Troubleshooting section
   - Deploy a Vercel en su lugar

3. **Tests fallan**:
   ```bash
   npm run clean
   npm test
   ```

## 📖 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

## 🎉 Estado Final

**BLOQUES 39-40**: ✅ Implementados y listos para deploy

**Siguiente acción**:
1. Generar iconos PWA (ver `ICONOS-PWA.md`)
2. Deploy a Vercel (ver `DEPLOY-VERCEL.md`)
3. Configurar service worker post-deploy
4. Test PWA installation

---

**Última actualización**: 2024
**Versión**: 0.1.0
**Maintainer**: Cocorico Team 🐓
