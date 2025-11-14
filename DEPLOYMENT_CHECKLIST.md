# 🚀 Checklist de Despliegue a Vercel — Cocorico

## ✅ Pre-Despliegue (Completado)

- [x] **Migraciones de Base de Datos**: Todas las migraciones aplicadas correctamente
  - 17 migraciones desde `00001` hasta `20251112`
  - Última verificación: `supabase db diff` → "No schema changes found"
  - Tablas verificadas: `user_roles`, `profiles`, `page_assets`, `ingredient_knowledge`

- [x] **Build de Producción**: Compilación exitosa
  - `npm run build` pasa correctamente
  - Sitemaps generados en `/public`
  - TypeScript check: OK
  - ESLint: warnings no bloqueantes (configurado con `eslint.ignoreDuringBuilds`)

- [x] **PWA iOS/Safari**: Configuración validada
  - `manifest.webmanifest`: correcto con iconos 192x192, 512x512, maskable-512
  - `manifest.json`: limpiado (sin iconos 72x72 faltantes)
  - Meta tags iOS en `src/app/layout.tsx`: ✅
  - Service Worker: registrado via next-pwa
  - Headers seguros: CSP sin COOP/COEP para compatibilidad Safari

- [x] **Tests**: 26/26 tests pasando con Jest
  - Smoke test local: `/health` retorna 200 OK
  - Dev server funcional en 127.0.0.1:3000

## 🔐 Variables de Entorno en Vercel

### Obligatorias (Producción)

Configurar en Vercel → Settings → Environment Variables → Production:

```bash
# Supabase (requerido)
NEXT_PUBLIC_SUPABASE_URL=https://[tu-proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Admin y Seguridad
ADMIN_SECRET=<genera un string aleatorio de 32+ caracteres>
ADMIN_EMAIL=admin@tudominio.com

# App
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app

# OpenAI (si usas features de IA)
OPENAI_API_KEY=sk-...

# Replicate (opcional, para visión en la nube)
REPLICATE_API_TOKEN=r8_...

# ElevenLabs (opcional, TTS)
ELEVENLABS_API_KEY=...
```

### Stripe (si activas pagos)

```bash
# Stripe Keys (Dashboard → API Keys)
STRIPE_SECRET_KEY=sk_live_... # o sk_test_... para pruebas
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... # o pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # desde Dashboard → Webhooks
STRIPE_PRICE_ID_PREMIUM=price_... # ID del producto Premium mensual

# URLs de redirección
STRIPE_SUCCESS_URL=https://tu-dominio.vercel.app/billing/success
STRIPE_CANCEL_URL=https://tu-dominio.vercel.app/plans
```

### Opcionales (Seguridad y Acceso)

```bash
# Password Gate (opcional, para acceso restringido)
SITE_PASSWORD=tu-password-temporal
INVITE_PASSWORD=clave-invitados-temporales

# Dev (opcional, para /dev/lab y /dev/audit)
DEV_EMAIL=desarrollador@tudominio.com

# Analytics (opcional, GDPR-friendly)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=... # desde https://cloud.umami.is

# Firebase (opcional, push notifications)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=...
FIREBASE_SERVER_KEY=...
```

### 🎯 Notas Importantes

1. **Supabase**: Copia las claves desde tu dashboard de Supabase (Settings → API)
2. **ADMIN_SECRET**: Genera un valor único con:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **SITE_PASSWORD**: Mantén activo durante pruebas privadas; elimina al lanzar públicamente
4. **Stripe Webhook**: Configura el endpoint en Stripe Dashboard:
   - URL: `https://tu-dominio.vercel.app/api/billing/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

## 📋 Pasos de Despliegue

### 1. Preparar Repositorio

```bash
# Asegúrate de que todos los cambios estén commiteados
git status
git add -A
git commit -m "chore: prepare for production deployment"
git push origin main
```

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) y haz login
2. Click en "Add New..." → "Project"
3. Importa el repositorio `xeoncreation/cocorico-app`
4. Framework Preset: **Next.js** (autodetectado)
5. Root Directory: `./` (raíz del proyecto)
6. Build Command: `npm run build` (por defecto)
7. Output Directory: `.next` (por defecto)

### 3. Configurar Variables de Entorno

En el paso de configuración de Vercel (o después en Settings):

1. Pega todas las variables del apartado anterior
2. Marca las que son sensibles como "Sensitive" (se ocultarán en logs)
3. Aplica a: **Production, Preview, Development** (según necesites)

### 4. Desplegar

1. Click en "Deploy"
2. Espera a que el build complete (~2-5 minutos)
3. Si falla, revisa los logs de build en Vercel

### 5. Verificar Despliegue

Una vez desplegado:

```bash
# Verifica salud de la aplicación
curl https://tu-dominio.vercel.app/health

# Debería retornar status 200 OK
```

## 🧪 Validación Post-Despliegue

### En Desktop (Safari/Chrome)

- [ ] Navega a `https://tu-dominio.vercel.app`
- [ ] Verifica login/signup funciona
- [ ] Prueba creación de receta
- [ ] Verifica que /dashboard carga correctamente
- [ ] Comprueba rutas protegidas (middleware password gate si está activo)

### En iOS (iPhone/iPad)

- [ ] Abre Safari y navega a tu URL de Vercel
- [ ] Verifica renderizado correcto (sin errores de layout)
- [ ] Toca el botón compartir → "Añadir a pantalla de inicio"
- [ ] Verifica que el icono aparece en home screen
- [ ] Abre la app desde el icono (debe abrir en modo standalone, sin barra de Safari)
- [ ] Prueba navegación básica (home → dashboard → recetas)
- [ ] Activa modo avión y verifica que algunas páginas cargan offline (PWA cache)
- [ ] Desactiva modo avión y prueba login/session
- [ ] Verifica que cookies funcionan (sesión persiste entre recargas)

### En Android

- [ ] Abre Chrome y navega a tu URL
- [ ] Verifica prompt "Añadir a pantalla de inicio" (banner PWA)
- [ ] Instala la PWA
- [ ] Abre y verifica modo standalone
- [ ] Prueba navegación y offline

## 🔍 Troubleshooting Común

### Build falla en Vercel

1. **Error de ESLint**: Ya está configurado `eslint.ignoreDuringBuilds: true` en `next.config.mjs`
2. **Error de TypeScript**: Verifica que `tsconfig.json` no tenga errores de tipos bloqueantes
3. **Falta variable de entorno**: Revisa logs de build y añade las variables faltantes

### PWA no se instala en iOS

1. Verifica que `manifest.webmanifest` está accesible: `https://tu-dominio.vercel.app/manifest.webmanifest`
2. Comprueba que los iconos existen en `/icons/`
3. Verifica meta tags en el HTML renderizado (View Source en Safari)

### Problemas de Session/Cookies en Safari

1. Verifica que `sameSite: 'lax'` está configurado en cookies de Supabase
2. Comprueba que no tienes COOP/COEP headers bloqueantes (ya deshabilitados en `middleware.ts`)
3. Safari bloquea third-party cookies por defecto; Supabase first-party debe funcionar

### Stripe webhook no funciona

1. Verifica que el endpoint está configurado en Stripe Dashboard
2. Comprueba que `STRIPE_WEBHOOK_SECRET` coincide con el del dashboard
3. Revisa logs de Vercel para errores de verificación de firma

## 📊 Monitoreo Post-Lanzamiento

### Métricas a Vigilar

1. **Vercel Analytics**: Habilitado automáticamente (Core Web Vitals, Page Speed)
2. **Supabase Dashboard**: Queries, RLS policies, auth events
3. **Umami Analytics** (si configurado): Visitas, eventos, conversiones
4. **Stripe Dashboard** (si activo): Pagos, suscripciones, webhooks recibidos

### Logs

- **Vercel Functions Logs**: Settings → Functions → View Logs
- **Supabase Logs**: Dashboard → Logs (SQL Editor, Auth, Realtime)
- **Browser Console**: Errores de cliente (especialmente Safari iOS)

## 🎉 Checklist Final

- [ ] Build pasa en Vercel
- [ ] Variables de entorno configuradas
- [ ] Login/Signup funciona
- [ ] Dashboard accesible
- [ ] PWA instalable en iOS/Safari
- [ ] Modo offline básico funciona
- [ ] Cookies persisten sesión
- [ ] (Si aplica) Stripe checkout funciona
- [ ] (Si aplica) Password gate protege contenido
- [ ] Analytics capturando visitas

## 🚨 Rollback

Si algo falla en producción:

1. Ve a Vercel → Deployments
2. Encuentra el deployment anterior estable
3. Click en "..." → "Promote to Production"
4. Vercel revierte automáticamente

## 📞 Soporte

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **PWA**: [web.dev/progressive-web-apps/](https://web.dev/progressive-web-apps/)

---

**Última actualización**: 14 de noviembre de 2025
**Versión**: 1.0
**Estado del Proyecto**: ✅ Listo para Despliegue
