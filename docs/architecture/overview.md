# 🏗️ Arquitectura General - Cocorico

## 📊 Stack Tecnológico

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript 5.2
- **Estilos:** TailwindCSS 3.3 + Custom Glass Effects
- **UI Components:** shadcn/ui + Radix UI
- **Animaciones:** Framer Motion
- **Internacionalización:** next-intl 4.4

### Backend & Servicios
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Storage:** Supabase Storage
- **IA Chat:** OpenAI GPT-4
- **Pagos:** Stripe
- **Analytics:** Umami (privacy-first)

### Infraestructura
- **Hosting:** Vercel (edge functions)
- **CDN:** Vercel Edge Network
- **PWA:** next-pwa con service worker
- **Seguridad:** CSP headers, HSTS, X-Frame-Options

---

## 🗂️ Estructura del Proyecto

```
cocorico/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/            # Rutas con internacionalización
│   │   │   ├── chat/
│   │   │   ├── recipes/
│   │   │   ├── community/
│   │   │   ├── dashboard/
│   │   │   ├── pricing/
│   │   │   └── layout.tsx       # Layout localizado
│   │   ├── api/                 # API Routes
│   │   │   ├── chat/
│   │   │   ├── recipes/
│   │   │   ├── billing/
│   │   │   └── feedback/
│   │   ├── globals.css          # Estilos globales
│   │   └── layout.tsx           # Root layout
│   │
│   ├── components/              # Componentes React
│   │   ├── navigation/
│   │   │   └── UnifiedNavbar.tsx  # Navbar unificado
│   │   ├── ui/                  # Componentes shadcn/ui
│   │   ├── recipes/
│   │   ├── community/
│   │   └── billing/
│   │
│   ├── lib/                     # Utilidades y clientes
│   │   ├── supabase.ts          # Cliente Supabase (server)
│   │   ├── supabase-client.ts   # Cliente Supabase (browser)
│   │   ├── stripe.ts            # Cliente Stripe
│   │   └── utils.ts             # Helpers generales
│   │
│   ├── services/                # Lógica de negocio
│   │   ├── recipes.ts
│   │   ├── auth.ts
│   │   └── feedback.ts
│   │
│   ├── hooks/                   # React hooks personalizados
│   ├── types/                   # TypeScript types
│   ├── schemas/                 # Zod schemas para validación
│   └── messages/                # Traducciones i18n
│       ├── en.json
│       └── es.json
│
├── public/                      # Assets estáticos
│   ├── icons/                   # Iconos PWA
│   ├── wallpapers/              # Fondos de pantalla
│   └── branding/                # Logos y assets de marca
│
├── supabase/                    # Configuración Supabase
│   ├── migrations/              # SQL migrations
│   └── functions/               # Edge functions
│
├── docs/                        # Documentación
├── tests/                       # Tests (Jest + Playwright)
└── scripts/                     # Scripts de utilidad
```

---

## 🔄 Flujo de Datos

### 1. Autenticación
```
Usuario → Supabase Auth → Session Cookie → Middleware → Protected Routes
```

### 2. Chat IA
```
Input Usuario → API Route /api/chat → OpenAI API → Streaming Response → UI
```

### 3. Recetas
```
Crear → Validación Zod → Supabase Insert → Revalidate Cache → UI Update
```

### 4. Billing
```
Checkout → Stripe Session → Webhook → Supabase Update → Premium Access
```

---

## 🎨 Sistema de Diseño

### Glass Effects (Liquid Glass)
Sistema custom de efectos vidrio con:
- `.glass-card` - Tarjetas principales
- `.glass-pill` - Botones y badges
- `.glass-icon-circle` - Iconos circulares
- Variantes de color: `glass-card-mango`, `glass-card-datil`, etc.

### Variables CSS
```css
:root[data-theme="free"] {
  --glass-blur: 22px;
  --glass-tint: rgba(255, 255, 255, 0.18);
  --glass-border: rgba(255, 255, 255, 0.55);
  /* ... */
}
```

### Tipografía
- **Display:** Poppins (600, 700) - Títulos
- **Body:** Poppins (400) - Texto general
- **Accent:** Pacifico (400) - Logo

Cargadas con `next/font/google` para máxima performance.

---

## 🔒 Seguridad

### Headers HTTP
- **X-Frame-Options:** DENY
- **Content-Security-Policy:** Estricto (solo dominios permitidos)
- **HSTS:** max-age=31536000
- **X-Content-Type-Options:** nosniff

### Autenticación
- Magic links (email)
- Session-based auth con cookies HTTP-only
- Row Level Security (RLS) en Supabase

### Validación
- Schemas Zod en API routes
- Input sanitization
- Rate limiting en endpoints sensibles

---

## 📈 Performance

### Optimizaciones
- ✅ Image optimization con Next.js Image
- ✅ Font optimization con next/font
- ✅ Code splitting automático
- ✅ PWA caching estratégico
- ✅ Static Generation donde es posible
- ✅ Streaming SSR para UI progresiva

### Métricas objetivo
- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1
- **TTI:** < 3.5s

---

## 🌍 Internacionalización

### Locales soportados
- `es` (Español) - default
- `en` (English)

### Estructura
```
src/messages/
  ├── en.json
  └── es.json
```

### Routing
```
/[locale]/dashboard
/[locale]/recipes
/[locale]/community
```

Middleware detecta locale del navegador y redirige automáticamente.

---

## 🔄 Estado y Caché

### Client State
- React Context para theme
- useState/useEffect para auth state
- SWR para data fetching con revalidación

### Server State
- Next.js cache (fetch)
- Supabase realtime subscriptions
- Revalidation on-demand

### Service Worker Cache (PWA)
- **NetworkFirst:** Supabase API (5 min)
- **CacheFirst:** Imágenes (30 días)
- **CacheFirst:** Fuentes (1 año)

---

## 📦 Deployment

### Vercel (Producción)
```bash
npm run build
vercel --prod
```

### Variables requeridas
Ver [environment.md](../setup/environment.md)

### Edge Functions
- Middleware para i18n routing
- API routes para chat IA
- Webhooks de Stripe

---

## 🔗 Referencias

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
