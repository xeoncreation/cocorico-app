# 🚀 Guía de Deploy a Vercel - Cocorico

## Quick Start

```bash
# 1. Instalar Vercel CLI (opcional, también desde dashboard web)
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Deploy a producción
vercel --prod
```

## Paso a Paso Detallado

### 1️⃣ Preparar Git Repository

```powershell
# Inicializar git si no existe
git init
git add .
git commit -m "feat: Cocorico PWA ready for deployment"

# Opcional: Subir a GitHub/GitLab/Bitbucket
git remote add origin https://github.com/tu-usuario/cocorico.git
git push -u origin main
```

### 2️⃣ Crear Proyecto en Vercel

**Opción A: Dashboard Web**
1. Ir a https://vercel.com/new
2. Click "Import Git Repository"
3. Seleccionar el repo de Cocorico
4. Vercel auto-detecta Next.js settings ✅

**Opción B: CLI**
```bash
vercel
# Seguir prompts interactivos
```

### 3️⃣ Configurar Variables de Entorno

#### En Vercel Dashboard
1. Ir a tu proyecto → Settings → Environment Variables
2. Añadir TODAS las variables de `.env.local`:

```env
# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (REQUERIDO para AI features)
OPENAI_API_KEY=sk-...

# Stripe (REQUERIDO para pagos)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Next.js (AUTO)
NEXT_PUBLIC_BASE_URL=https://tu-app.vercel.app
NODE_ENV=production
```

#### Desde CLI
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Pegar valor cuando pida
# Repetir para cada variable
```

### 4️⃣ Configurar Webhooks (Stripe)

1. **Stripe Dashboard** → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://tu-app.vercel.app/api/webhooks/stripe`
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copiar **Signing secret** → Añadir como `STRIPE_WEBHOOK_SECRET` en Vercel

### 5️⃣ Deploy

```bash
# Preview deploy (automático en cada push)
git push origin main

# Production deploy (manual)
vercel --prod
```

### 6️⃣ Configurar Dominio Custom (Opcional)

1. Vercel Dashboard → Project → Settings → Domains
2. Añadir: `cocorico.app`, `www.cocorico.app`
3. Configurar DNS (Vercel te da instrucciones):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### 7️⃣ Habilitar PWA (Post-Deploy)

#### Opción A: @ducanh2912/next-pwa (Recomendado)

```bash
npm install @ducanh2912/next-pwa
```

Actualizar `next.config.mjs`:
```javascript
import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from '@ducanh2912/next-pwa';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  // ... tu config existente
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: 'service-worker.js',
})(withNextIntl(nextConfig));
```

```bash
git add .
git commit -m "feat: enable PWA"
git push
```

#### Opción B: Vercel PWA Features (Nativo)

Vercel auto-genera service worker básico. Solo necesitas:
1. ✅ manifest.webmanifest (ya existe)
2. ✅ Iconos PWA en `public/icons/`

### 8️⃣ Verificar Deploy

#### Checklist Post-Deploy
```bash
# 1. Health check
curl https://tu-app.vercel.app/api/health
# Debe responder 200 OK

# 2. Lighthouse PWA audit
# Chrome DevTools → Lighthouse → PWA
# Score esperado: > 90

# 3. Test instalación PWA
# Chrome → Visitar app → Icono "Install" en barra URL
```

#### Troubleshooting Common Issues

**Error: Missing environment variables**
```bash
# Verificar vars en Vercel Dashboard
vercel env pull .env.vercel
cat .env.vercel
```

**Error: Build failed**
```bash
# Ver logs completos
vercel logs tu-app-url --follow

# Rebuild forzado
vercel --force
```

**PWA no instala**
```bash
# Verificar manifest
curl https://tu-app.vercel.app/manifest.webmanifest

# Verificar service worker
curl https://tu-app.vercel.app/service-worker.js

# Chrome DevTools → Application:
# - Manifest: debe estar verde
# - Service Workers: debe estar registrado
```

## 🔧 Configuración Avanzada

### Performance Optimization

```javascript
// next.config.mjs
const nextConfig = {
  // Comprimir imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // Habilitar SWC minification
  swcMinify: true,
  
  // Optimizar fonts
  optimizeFonts: true,
  
  // Comprimir respuestas
  compress: true,
};
```

### Analytics

```bash
# Vercel Analytics (gratis)
npm install @vercel/analytics

# En layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Monitoring

```bash
# Vercel Speed Insights
npm install @vercel/speed-insights

# En layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## 📊 Métricas Esperadas

### Lighthouse Scores (Target)
- **Performance**: > 85
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 90
- **PWA**: > 90

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🆘 Soporte

### Logs y Debugging
```bash
# Ver logs en tiempo real
vercel logs --follow

# Descargar logs
vercel logs > logs.txt

# Ver deployment details
vercel inspect <deployment-url>
```

### Redeploy
```bash
# Redeploy última versión
vercel --prod

# Rollback a deployment anterior
vercel rollback <deployment-id>
```

## ✅ Checklist Final

Antes de marcar como completado, verificar:

- [ ] ✅ Build pasa en Vercel (debería ser SUCCESS, el issue es solo Windows local)
- [ ] ✅ Todas las env vars configuradas
- [ ] ✅ Stripe webhooks configurados
- [ ] ✅ PWA manifest accesible
- [ ] ✅ Service worker registrado
- [ ] ✅ Iconos PWA (192, 512, maskable) en public/icons/
- [ ] ✅ App instalable desde Chrome/Edge
- [ ] ✅ Lighthouse PWA score > 90
- [ ] ✅ Health check API funciona
- [ ] ✅ Autenticación Supabase funciona
- [ ] ✅ Pagos Stripe funcionan
- [ ] ✅ AI features funcionan
- [ ] ✅ i18n (ES/EN) funciona
- [ ] ✅ Responsive design en mobile
- [ ] ✅ Animaciones smooth

## 🎉 ¡Listo!

Tu app estará disponible en:
- **Production**: https://tu-app.vercel.app
- **Preview**: https://tu-app-git-branch.vercel.app (cada rama)
- **Custom domain**: https://cocorico.app (si configuraste)

---

**Tiempo estimado de deploy**: 5-10 minutos
**Documentación oficial**: https://vercel.com/docs
