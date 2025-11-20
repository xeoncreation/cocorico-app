# 🐓 Cocorico — Asistente de Cocina Inteligente con IA

**Cocorico** es una aplicación educativa y anti-desperdicio que sugiere recetas personalizadas, guarda tus favoritas, genera variaciones con IA y aprende de tus hábitos culinarios.

## 🚀 Stack Tecnológico

- **Next.js 14** con App Router
- **Supabase** (Base de datos + Autenticación + Storage)
- **OpenAI API** para chat inteligente y generación de recetas
- **TailwindCSS** para estilos
- **TypeScript** para type safety
- **next-intl** para internacionalización (ES/EN)
- **shadcn/ui** para componentes UI

---

## ⚙️ Instalación

```bash
git clone <tu-repositorio>
cd cocorico
npm install
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase y OpenAI
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔧 Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz con las siguientes variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
# Opcional para scripts/servicios (no se requiere en cliente)
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# OpenAI (para chat IA)
OPENAI_API_KEY=tu-openai-api-key

# URL pública de la app (se usa en Stripe callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (suscripciones)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_xxx
```

---

## 🧩 Características Principales

✅ **Autenticación completa** con Supabase (login, registro, recuperación de contraseña)  
✅ **Chat con IA** (OpenAI) para sugerencias culinarias personalizadas  
✅ **Recetas públicas** con URLs compartibles: `/r/[user]/[slug]`  
✅ **Sistema de favoritos** 💛 para guardar tus recetas preferidas  
✅ **Versiones IA** 🤖 - genera variaciones automáticas de recetas  
✅ **Panel de estadísticas** 📊 para tracking de actividad  
✅ **Multilingual** (Español/Inglés) con selector de idioma buscable  
✅ **Importación** de recetas desde URL o foto  
✅ **Diseño responsive** con Tailwind y componentes shadcn/ui  
✅ **Analytics** con Umami integrado para seguimiento de uso  
✅ **Onboarding interactivo** para nuevos usuarios en home localizada  
✅ **Seguridad reforzada** con CSP y headers de seguridad en middleware  

---

## 📂 Estructura del Proyecto

```text
cocorico/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── [locale]/          # Rutas con locale (ES/EN)
│   │   ├── api/               # API Routes
│   │   ├── dashboard/         # Panel de usuario
│   │   └── r/[user]/[slug]/   # Recetas públicas
│   ├── components/            # Componentes reutilizables
│   ├── lib/                   # Utilidades y clientes
│   ├── messages/              # Traducciones (en.json, es.json)
│   └── types/                 # TypeScript types
├── supabase/
│   └── migrations/            # Migraciones SQL
├── public/                    # Assets estáticos
└── i18n.ts                    # Configuración de next-intl
```

---

## 📈 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run dev:3001   # Servidor de desarrollo en puerto 3001
npm run build      # Build de producción
npm run start      # Ejecutar build de producción
npm run start:3001 # Ejecutar en puerto 3001
npm run clean      # Limpiar caché de Next.js
npm run lint       # Linter
npm test           # Tests unitarios (Jest)
npm run test:e2e   # Tests E2E (Playwright)
```

---

## 🗄️ Base de Datos (Supabase)

El proyecto usa las siguientes tablas principales:

- **recipes** - Recetas con título, contenido, visibilidad, etc.
- **favorites** - Favoritos de usuarios
- **recipe_versions** - Variaciones generadas por IA
- **stats** - Estadísticas de uso
- **messages** - Historial de chat

Ejecuta las migraciones en `supabase/migrations/` para crear las tablas base.

Además, añade las tablas y políticas para IA y Stripe incluidas en:

- `supabase/sql/ai_and_limits.sql`
- `supabase/sql/stripe.sql`

Puedes ejecutar estos scripts en el SQL editor de Supabase. Incluyen RLS y una RPC `increment_ai_usage` para el control de cuota gratuita.

---

## 🌐 Internacionalización

La app soporta **Español** y **English**. Los mensajes están en:

- `src/messages/es.json`
- `src/messages/en.json`

El selector de idioma permite buscar por nombre (ej: "español", "english").

---

## 📊 Analytics & Onboarding

### Umami Analytics

Cocorico integra **Umami** para seguimiento de uso respetuoso con la privacidad:

- Script cargado en el `<head>` del layout global (`src/app/layout.tsx`)
- ID del sitio: `0ff906b7-1420-4f27-ae6f-324727d42846`
- Configuración: variables de entorno `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (opcional si quieres cambiarlo)
- Eventos personalizados en `src/components/UmamiAnalytics.tsx`

### Onboarding Modal

Nuevo modal interactivo de bienvenida aparece en primera visita a `/es` o `/en`:

- Componente: `src/components/OnboardingModal.tsx`
- Se carga dinámicamente (client-side) para evitar conflictos de SSR
- Almacena flag `onboarding_completed` en localStorage
- 4 pasos: bienvenida, crear receta, escáner, retos diarios
- Tests: `tests/unit/OnboardingModal.test.tsx` y `tests/e2e/home-onboarding.spec.ts`

### Content Security Policy (CSP)

El middleware (`middleware.ts`) incluye CSP estricto para producción y relajado en dev:

- Permite scripts de `https://cloud.umami.is`
- Conexiones a Supabase (`*.supabase.co`), OpenAI, Replicate, Stripe
- WebSockets para hot-reload en desarrollo
- `frame-ancestors 'none'` para prevenir clickjacking
- CSP deshabilitado temporalmente en dev para debugging; se activa en producción

---

## 💳 Pagos con Stripe (Plan Premium)

1) Configura las variables de entorno de Stripe en `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

1. Crea el endpoint de webhook en Stripe (Dashboard) y copia su `Signing secret` en `STRIPE_WEBHOOK_SECRET`.

1. En local, si quieres probar el webhook, expón tu servidor con un túnel y actualiza la URL del endpoint en Stripe:

- ngrok: `ngrok http http://localhost:3000`
- Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

Los endpoints disponibles son:

- `POST /api/stripe/checkout` (crea Checkout Session de suscripción)
- `POST /api/stripe/portal` (abre el portal de facturación)
- `POST /api/stripe/webhook` (recibe eventos de Stripe)

El estado del plan se guarda en `user_subscriptions`.

---

## 🚢 Despliegue

### Vercel (Recomendado)

```bash
vercel deploy
```

Configura las variables de entorno en el dashboard de Vercel.

### Otros proveedores

El proyecto es compatible con cualquier plataforma que soporte Next.js 14+.

---

## 🩺 Salud y resolución de problemas en Windows

- Healthcheck: abre `http://localhost:3000/health`.
- Si el puerto 3000 está ocupado o hay problemas con `localhost`/IPv6, prueba:

```powershell
npm run dev:127     # 127.0.0.1:3000
npm run dev:3001    # 127.0.0.1:3001
npm run start:3001  # producción en 3001
```

- Asegúrate de mantener abierta la terminal donde corre el servidor.
- Si un firewall bloquea Node, permite el proceso en el puerto correspondiente.
- Para limpiar caché si algo se queda colgado:

```powershell
npm run clean; npm run dev
```

---

## 📝 Licencia

MIT

---

## 🤝 Contribuir

Pull requests son bienvenidos. Para cambios mayores, abre primero un issue para discutir lo que te gustaría cambiar.

---

## 📧 Contacto

Creado por el equipo de Cocorico 🐓

