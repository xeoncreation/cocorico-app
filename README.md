# 🐓 Cocorico — Asistente de Cocina Inteligente con IA

**Cocorico** es una aplicación educativa y anti-desperdicio que sugiere recetas personalizadas, guarda tus favoritas, genera variaciones con IA y aprende de tus hábitos culinarios.

---
## 🚀 Stack Tecnológico

- **Next.js 14** (App Router)
- **Supabase** (DB + Auth + Storage)
- **OpenAI API** (chat y generación de recetas)
- **TailwindCSS** (estilos)
- **TypeScript** (type safety)
- **next-intl** (i18n ES/EN)
- **shadcn/ui** (componentes UI)

---
## ⚙️ Instalación

```bash
git clone <tu-repositorio>
cd cocorico
npm install
cp .env.example .env.local
# Edita .env.local con tus credenciales
npm run dev
```

Abre http://localhost:3000 en tu navegador.

---
## 🔧 Variables de Entorno (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key # opcional
OPENAI_API_KEY=tu-openai-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_xxx
```

---
## 🧩 Características Principales

- Autenticación completa (login, registro, recuperación)
- Chat con IA para sugerencias culinarias
- Recetas públicas compartibles `/r/[user]/[slug]`
- Sistema de favoritos 💛
- Variaciones IA 🤖 de recetas
- Panel de estadísticas 📊
- Internacionalización ES/EN
- Importación desde URL o foto (escáner)
- Diseño responsive + shadcn/ui
- Analytics con Umami
- Onboarding interactivo
- CSP y headers de seguridad

---
## 📂 Estructura

```text
cocorico/
├── src/app/[locale]/        # Rutas localizadas
├── src/app/api/             # API Routes
├── src/app/r/[user]/[slug]/ # Recetas públicas
├── src/components/          # Componentes reutilizables
├── src/lib/                 # Utilidades (supabase, etc.)
├── src/messages/            # Traducciones
├── src/types/               # Tipos TS
├── supabase/migrations/     # Migraciones SQL
└── i18n.ts                  # Configuración next-intl
```

---
## 📈 Scripts

```bash
npm run dev        # Desarrollo
npm run dev:3001   # Desarrollo en 3001
npm run build      # Build producción
npm run start      # Servir build
npm run clean      # Limpiar caché Next.js
npm run lint       # Linter
npm test           # Unit tests (Jest)
npm run test:e2e   # E2E (Playwright)
```

---
## 🗄️ Base de Datos (Supabase)

Tablas: `recipes`, `favorites`, `recipe_versions`, `stats`, `messages`.
Ejecuta migraciones en `supabase/migrations/` y luego scripts extra:
`supabase/sql/ai_and_limits.sql`, `supabase/sql/stripe.sql` (RLS + RPC de cuota).

---
## 🌐 Internacionalización

Mensajes:
- `src/messages/es.json`
- `src/messages/en.json`

Selector buscable por nombre de idioma.

---
## 📊 Analytics & Onboarding

Umami: script en `layout.tsx`, ID configurable vía `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.
Modal de onboarding (`OnboardingModal.tsx`) con 4 pasos y flag en `localStorage`.

CSP en `middleware.ts` (estricto producción, relajado dev).

---
## 💳 Stripe (Plan Premium)

1. Configura claves en `.env.local`.
2. Crea webhook y guarda `STRIPE_WEBHOOK_SECRET`.
3. Pruebas locales: túnel (`ngrok`) o `stripe listen`.

Endpoints: `/api/stripe/checkout`, `/api/stripe/portal`, `/api/stripe/webhook`.
Estado en `user_subscriptions`.

---
## 🚢 Despliegue

Vercel recomendado:

```bash
vercel deploy
```

Configura variables en el dashboard.

---
## 🩺 Salud (Windows)

Healthcheck: `http://localhost:3000/health`
Si puerto ocupado:
```powershell
npm run dev:127
npm run dev:3001
```
Limpiar caché:
```powershell
npm run clean; npm run dev
```

---
## 📝 Licencia

MIT

---
## 🤝 Contribuir

Pull requests bienvenidos. Para cambios mayores abre un issue primero.

---
## 📧 Contacto

Equipo Cocorico 🐓

