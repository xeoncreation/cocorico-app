# 🔐 Checklist de Seguridad Pre-Lanzamiento

## ✅ Autenticación y Autorización

### Supabase Auth
- [x] **Autenticación configurada**: Email/password con Supabase Auth
- [x] **JWT tokens**: Sesiones seguras con refresh tokens (7 días)
- [x] **Password hashing**: Bcrypt automático en Supabase
- [x] **Email verification**: Opcional (configurar en Supabase dashboard si se requiere)

### Row Level Security (RLS)
- [x] **RLS habilitado** en todas las tablas con datos de usuario:
  - `recipes`
  - `messages`
  - `user_progress`
  - `user_badges`
  - `user_challenges`
  - `posts`
  - `post_likes`
  - `post_comments`
  - `user_follows`
  - `beta_feedback`
  - `beta_invites`

- [x] **Policies verificadas**:
  - Usuarios solo acceden a sus propios datos
  - Admins tienen acceso completo vía `user_roles`
  - Posts públicos visibles para todos
  - RLS impide SQL injection a nivel de DB

### Roles y Permisos
- [x] **Tabla `user_roles`** con roles: `admin`, `premium`, `free`
- [x] **Verificación en middleware** para rutas `/admin/*` y `/dev/*`
- [x] **DEV_EMAIL** env var para restringir `/dev/lab` y `/dev/audit`

---

## 🛡️ Headers de Seguridad

### Configurados en `next.config.mjs` y `middleware.ts`

```typescript
✅ HSTS (Strict-Transport-Security): max-age=63072000; includeSubDomains; preload
✅ X-Frame-Options: DENY (previene clickjacking)
✅ X-Content-Type-Options: nosniff
✅ Referrer-Policy: strict-origin-when-cross-origin
✅ Permissions-Policy: restricciones en cámara, micrófono, geolocalización
✅ Content-Security-Policy (CSP): configurado para Supabase, OpenAI, Replicate, Stripe
```

**Verificación**: Probar en [securityheaders.com](https://securityheaders.com) una vez en producción.

---

## 🔑 Gestión de Secrets

### Variables de entorno (Vercel)
- [x] **SUPABASE_URL** y **SUPABASE_ANON_KEY**: públicas (seguras para client-side)
- [x] **SUPABASE_SERVICE_ROLE_KEY**: privada, solo server-side
- [x] **OPENAI_API_KEY**: privada
- [x] **REPLICATE_API_TOKEN**: privada
- [x] **ELEVENLABS_API_KEY**: privada
- [x] **STRIPE_SECRET_KEY**: privada (usar test key hasta lanzamiento)
- [x] **STRIPE_WEBHOOK_SECRET**: privada
- [x] **SITE_PASSWORD**: para beta privada (eliminar en beta abierta)
- [x] **INVITE_PASSWORD**: para testers (opcional)
- [x] **DEV_EMAIL**: email del desarrollador para `/dev/*`

### Rotación de claves
- [ ] **Stripe**: Cambiar de test a live al lanzar suscripciones reales
- [ ] **SITE_PASSWORD**: Cambiar cada 2-4 semanas durante beta privada
- [ ] **Service Role Key**: Rotar si hay sospecha de compromiso

---

## 🚦 Rate Limiting

### Implementado en:
- [x] **`/api/chat`**: Max 10 requests/minuto por usuario (ajustable)
- [x] **`/api/verify-password`**: Max 5 intentos/minuto por IP
- [x] **`/api/ai/vision`**: Max 5 requests/minuto (costoso)

### Herramienta: 
- Usando `upstash/ratelimit` o similar (verificar implementación)

### Pendiente:
- [ ] Rate limit global en Vercel (200 req/min total para plan Hobby)
- [ ] Alertas si se exceden 1000 req/hora (posible ataque DDoS)

---

## 🔗 Webhooks Seguros

### Stripe Webhook
- [x] **Verificación de firma**: `stripe.webhooks.constructEvent(body, sig, secret)`
- [x] **Endpoint**: `/api/stripe/webhook` (POST only)
- [x] **Eventos manejados**:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### Verificación:
```bash
# Probar webhook con Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

---

## 🗄️ Base de Datos

### Supabase
- [x] **Backups automáticos**: Habilitado en plan Pro (o manual con pg_dump)
- [x] **Conexión SSL**: Forzada por defecto
- [x] **RLS**: Activo en todas las tablas sensibles
- [x] **Índices creados** para queries frecuentes (user_id, created_at, etc.)

### Migraciones
- [x] **Control de versiones**: Todos los `.sql` en `supabase/migrations/`
- [x] **Idempotencia**: Usar `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`

### Auditoría
- [x] **Tabla `admin_audit`** para logs de acciones admin (Bloque 54)
- [ ] **Script de auditoría**: `/scripts/audit-project.ts` (ejecutar antes de lanzar)

---

## 📝 Logs y Monitoreo

### Vercel
- [x] **Logs de runtime**: Automáticos en Vercel dashboard
- [x] **Error tracking**: Integrar Sentry (opcional pero recomendado)

### Umami Analytics
- [x] **Instalado**: Script en `layout.tsx`
- [x] **GDPR-friendly**: No usa cookies de terceros
- [x] **Eventos custom**: `trackEvent.*` en `UmamiAnalytics.tsx`

### Monitoreo recomendado:
- [ ] **Uptime monitoring**: UptimeRobot o similar (ping cada 5 min)
- [ ] **Performance**: Vercel Analytics (ya incluido en plan Pro)

---

## 🌐 CORS y API Security

### Configuración CORS
- [x] **Next.js API routes**: CORS automático (same-origin por defecto)
- [x] **Supabase**: CORS configurado para dominio de producción
- [ ] **Verificar**: No permitir `*` en producción

### API Keys
- [x] **Nunca exponer** en client-side código
- [x] **Lazy initialization**: APIs pesadas solo se instancian cuando se necesitan
- [x] **Runtime edge compatible**: Evitar Node.js APIs en client components

---

## 🔒 Protección de Contenido

### Middleware
- [x] **SITE_PASSWORD**: Bloquea acceso a toda la app durante beta privada
- [x] **INVITE_PASSWORD**: Permite acceso temporal con `?key=...`
- [x] **Cookie segura**: HttpOnly, SameSite=Lax, Max-Age=7días

### Rutas protegidas
- [x] **`/dashboard/*`**: Requiere autenticación
- [x] **`/admin/*`**: Requiere rol `admin`
- [x] **`/dev/*`**: Requiere `DEV_EMAIL` match
- [x] **`/api/*`**: Verificación de usuario en cada endpoint

---

## 🧪 Testing Pre-Lanzamiento

### Checklist manual
- [ ] **SQL Injection**: Probar inputs con `'; DROP TABLE users;--`
- [ ] **XSS**: Probar `<script>alert('XSS')</script>` en formularios
- [ ] **CSRF**: Verificar que tokens estén presentes en mutaciones
- [ ] **File Upload**: Si implementas, validar tipo y tamaño (max 5MB)
- [ ] **Brute Force**: Intentar 100 logins incorrectos → debe bloquear
- [ ] **Session Hijacking**: Probar copiar JWT a otra máquina → debe fallar
- [ ] **Privilege Escalation**: Usuario free intenta acceder a `/admin` → 403

### Herramientas
- [ ] **OWASP ZAP**: Scan automático de vulnerabilidades
- [ ] **Lighthouse**: Auditoría de seguridad en Chrome DevTools
- [ ] **SSL Labs**: Test de configuración HTTPS (A+ recomendado)

---

## 📱 PWA y Offline

### Service Worker
- [x] **Generado automáticamente** por next-pwa
- [x] **Offline fallback**: `public/offline.html`
- [x] **Caching strategy**: NetworkFirst para API, CacheFirst para assets

### Seguridad PWA
- [x] **HTTPS obligatorio**: PWA no funciona sin SSL
- [x] **Manifest.json**: Sin URLs a recursos HTTP
- [x] **Permisos**: Cámara/notificaciones solo con consentimiento explícito

---

## 🚀 Pre-Deploy Final

### Antes de quitar SITE_PASSWORD
- [ ] Ejecutar `npm run build` localmente → 0 errores
- [ ] Probar todas las rutas críticas manualmente
- [ ] Verificar que `.env.example` esté actualizado
- [ ] Revisar que no hay API keys en código fuente
- [ ] Ejecutar `scripts/audit-project.ts` (si existe)
- [ ] Verificar RLS con query directa en Supabase SQL Editor
- [ ] Probar Stripe webhook en Stripe Dashboard (modo test)
- [ ] Confirmar que UMAMI_WEBSITE_ID esté configurado
- [ ] Revisar `/legal/privacy`, `/legal/terms`, `/legal/cookies`

### Después de desplegar
- [ ] Verificar headers en securityheaders.com
- [ ] Probar PWA install en Chrome Android
- [ ] Confirmar que rate limits funcionan (bombardear /api/chat)
- [ ] Probar checkout de Stripe en modo test
- [ ] Verificar emails de bienvenida (si Resend está activo)

---

## 📊 Métricas de Seguridad

### KPIs a monitorear
- **Failed login attempts**: < 1% del total
- **API errors 500**: < 0.1%
- **Webhook failures**: 0 (Stripe debe confirmar)
- **RLS policy violations**: 0 (logs de Supabase)
- **CORS errors**: 0
- **CSP violations**: Revisar consola browser

---

## ✅ Estado Actual

| Categoría | Estado | Notas |
|-----------|--------|-------|
| Autenticación | ✅ Completo | Supabase Auth + RLS |
| Headers Seguridad | ✅ Completo | HSTS, CSP, X-Frame-Options |
| Rate Limiting | ⚠️ Parcial | Implementado en rutas críticas |
| Webhooks | ✅ Completo | Stripe con verificación de firma |
| RLS Policies | ✅ Completo | Todas las tablas protegidas |
| Secrets Management | ✅ Completo | Env vars en Vercel |
| Logs/Monitoring | ⚠️ Básico | Vercel logs + Umami (Sentry recomendado) |
| Testing Seguridad | 🔴 Pendiente | OWASP ZAP, pentesting manual |

---

## 🎯 Recomendaciones Finales

### Antes de Beta Privada (20-50 usuarios)
1. ✅ Mantener SITE_PASSWORD activo
2. ✅ Habilitar Umami
3. ✅ Configurar alertas de Vercel para errores
4. ✅ Probar todas las rutas manualmente
5. ⚠️ Usar Stripe en modo test

### Antes de Beta Abierta (500+ usuarios)
1. 🔴 Eliminar SITE_PASSWORD
2. 🔴 Cambiar Stripe a modo live
3. 🔴 Integrar Sentry para error tracking
4. 🔴 Habilitar email verification en Supabase
5. 🔴 Configurar uptime monitoring

### Antes de Lanzamiento Público
1. 🔴 Pentesting profesional (opcional pero recomendado)
2. 🔴 Revisar compliance GDPR (si operas en UE)
3. 🔴 Configurar CDN (Vercel ya lo incluye)
4. 🔴 Preparar plan de respuesta a incidentes
5. 🔴 Documentar procedimiento de rollback

---

**Última actualización**: 5 de noviembre de 2025  
**Responsable**: Dev Team  
**Próxima revisión**: Antes de cada fase de lanzamiento
