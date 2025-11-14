# 🔐 Variables de Entorno para Vercel — Cocorico Beta

## 📋 Instrucciones Rápidas

1. Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**
2. Copia y pega SOLO las variables de las secciones **OBLIGATORIAS** y **BETA** (no Stripe)
3. Marca como **Sensitive** las que tienen `_KEY`, `_SECRET` o `_TOKEN`
4. Aplica a: **Production** y **Preview**

---

## ✅ OBLIGATORIAS (Copiar TODAS)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dxhgpjrgvkxudetbmxuw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4aGdwanJndmt4dWRldGJteHV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjE0MjAsImV4cCI6MjA3NzIzNzQyMH0.vcATRIpwJuuDjk5CeyUiw22yHFm0E5m6SsAFflO3o_g

# Admin y Seguridad
ADMIN_SECRET=cocorico-admin-secret-2024-change-this-to-random-string
ADMIN_EMAIL=PEGA_AQUI_TU_EMAIL

# App URL (IMPORTANTE: Cambia después del primer deploy)
NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
```

> ⚠️ **Después del primer deploy**: Vuelve aquí y actualiza `NEXT_PUBLIC_APP_URL` con tu URL real de Vercel

---

## 🧪 BETA (Acceso restringido durante pruebas)

```bash
# Password Gate (elimina cuando lances públicamente)
SITE_PASSWORD=cocorico2025
```

Esta variable protege toda la app con contraseña. Los usuarios verán un prompt al entrar.

**Para desactivarla**: Simplemente elimina esta variable en Vercel cuando quieras abrir la beta.

---

## 🤖 IA FEATURES (Recomendadas)

```bash
# OpenAI (para análisis de recetas, sugerencias inteligentes)
# Copia el valor desde tu .env.local
OPENAI_API_KEY=<copia_desde_.env.local>

# Replicate (para visión IA: análisis de imágenes de recetas)
# Copia el valor desde tu .env.local
REPLICATE_API_TOKEN=<copia_desde_.env.local>
```

> 💡 Estas son opcionales pero muy recomendadas para las features de IA de la app.
> 🔒 **Importante**: Copia los valores reales desde tu archivo `.env.local` local (no están aquí por seguridad)

---

## 📊 ANALYTICS (Opcional pero útil)

```bash
# Umami (analytics GDPR-friendly, sin cookies)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=0ff906b7-1420-4f27-ae6f-324727d42846
```

Ya tienes Umami configurado. Mantenlo para monitorear uso durante la beta.

---

## ❌ NO AÑADIR (Stripe - Fase 2)

**NO pegues estas variables por ahora** (hasta que actives pagos):

```bash
# STRIPE (comentadas para fase 2)
# STRIPE_SECRET_KEY=sk_test_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# STRIPE_PRICE_MONTHLY=prod_...
```

---

## 🚀 Checklist de Configuración

- [ ] Copiar variables **OBLIGATORIAS** a Vercel
- [ ] Copiar variable **SITE_PASSWORD** (para beta cerrada)
- [ ] Copiar **OpenAI** y **Replicate** (features IA)
- [ ] Copiar **Umami** (analytics)
- [ ] Marcar como **Sensitive**: ADMIN_SECRET, OPENAI_API_KEY, REPLICATE_API_TOKEN
- [ ] Aplicar a: **Production** + **Preview**
- [ ] Hacer primer deploy
- [ ] **Actualizar `NEXT_PUBLIC_APP_URL`** con URL real de Vercel
- [ ] Redeploy para aplicar cambio de URL

---

## 📱 Después del Deploy

1. **Verifica que la app carga**: `https://tu-proyecto.vercel.app`
2. **Prueba el password gate**: Deberías ver el prompt de contraseña (`cocorico2025`)
3. **Login/Signup**: Crea una cuenta de prueba
4. **iOS/Safari**: Sigue el checklist de `DEPLOYMENT_CHECKLIST.md`

---

## 🔧 Cambios Post-Deploy

### Actualizar NEXT_PUBLIC_APP_URL

Después del primer deploy:

1. Ve a Vercel → **Settings** → **Environment Variables**
2. Busca `NEXT_PUBLIC_APP_URL`
3. Edita y cambia `https://tu-proyecto.vercel.app` por tu URL real
4. Guarda y redeploy (Vercel te ofrecerá redeploy automáticamente)

### Quitar password gate (abrir beta)

Cuando quieras abrir la beta al público:

1. Ve a Vercel → **Settings** → **Environment Variables**
2. Busca `SITE_PASSWORD`
3. Click en "..." → **Delete**
4. Redeploy

---

**Última actualización**: 14 de noviembre de 2025  
**Para**: Beta cerrada sin Stripe  
**Fase**: Pre-producción
