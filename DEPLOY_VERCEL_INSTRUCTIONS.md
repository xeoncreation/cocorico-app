# 🚀 Guía de Despliegue en Vercel - Cocorico App

## 📋 Pre-requisitos

1. Cuenta de Vercel (https://vercel.com)
2. Git repository conectado (GitHub: xeoncreation/cocorico-app)
3. Variables de entorno configuradas

---

## 🔧 Paso 1: Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel → Settings → Environment Variables y añade:

### 🔐 Supabase (REQUERIDO)
```
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY_AQUI
SUPABASE_SERVICE_ROLE_KEY=TU_SUPABASE_SERVICE_ROLE_KEY_AQUI
```

### 🤖 OpenAI (REQUERIDO para chat)
```
OPENAI_API_KEY=sk-proj-TU_OPENAI_KEY_AQUI
```

### 💳 Stripe (REQUERIDO para pagos)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TU_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_test_TU_STRIPE_SECRET_KEY
STRIPE_PRICE_MONTHLY=price_TU_STRIPE_PRICE_ID
STRIPE_WEBHOOK_SECRET=whsec_TU_STRIPE_WEBHOOK_SECRET
```

### 🌐 App Config (REQUERIDO)
```
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
NODE_ENV=production
```

### 🔒 Seguridad (OPCIONAL - remover para producción)
```
SITE_PASSWORD=cocorico2025
```
**⚠️ IMPORTANTE**: Elimina esta variable cuando quieras que la app sea pública.

### 👨‍💼 Admin (OPCIONAL)
```
ADMIN_EMAIL=admin@cocorico.app
ADMIN_SECRET=cocorico-admin-secret-2024-change-this
```

### 📊 Analytics (OPCIONAL)
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_UMAMI_WEBSITE_ID=0ff906b7-1420-4f27-ae6f-324727d42846
```

### 🔔 Firebase Push Notifications (OPCIONAL)
```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=tu_vapid_key
FIREBASE_SERVER_KEY=tu_server_key
```

### 🎨 Replicate AI Vision (OPCIONAL)
```
REPLICATE_API_TOKEN=r8_TU_REPLICATE_TOKEN_AQUI
```

---

## 🚀 Paso 2: Desplegar desde Vercel Dashboard

### Opción A: Despliegue Automático (Recomendado)
1. Ve a https://vercel.com/new
2. Conecta tu repositorio GitHub: `xeoncreation/cocorico-app`
3. Configura el proyecto:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
4. Añade las variables de entorno (del Paso 1)
5. Click en **Deploy**

### Opción B: Despliegue desde CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar (primera vez)
vercel

# Desplegar a producción
vercel --prod
```

---

## 📱 Paso 3: Enlaces para Dispositivos Móviles

Una vez desplegado, tu app estará en: `https://tu-proyecto.vercel.app`

### 📲 Para iOS (Safari)
Comparte este enlace:
```
https://tu-proyecto.vercel.app/es
```

**Instrucciones para instalar como PWA en iOS:**
1. Abrir en Safari
2. Tap en el icono de compartir (cuadrado con flecha arriba)
3. Scroll y seleccionar "Añadir a pantalla de inicio"
4. La app se instalará con el icono de Cocorico

### 🤖 Para Android (Chrome)
Comparte este enlace:
```
https://tu-proyecto.vercel.app/es
```

**Instrucciones para instalar como PWA en Android:**
1. Abrir en Chrome
2. Tap en los 3 puntos (menú)
3. Seleccionar "Instalar aplicación" o "Añadir a pantalla de inicio"
4. La app se instalará automáticamente

---

## 🔗 Paso 4: Configurar Dominio Personalizado (Opcional)

### En Vercel Dashboard:
1. Ve a tu proyecto → Settings → Domains
2. Añade tu dominio (ej: cocorico.app)
3. Configura los DNS según las instrucciones de Vercel
4. Actualiza `NEXT_PUBLIC_APP_URL` en las variables de entorno

### Dominios Sugeridos:
- `cocorico.app`
- `cocorico.es`
- `app.cocorico.com`

---

## ✅ Paso 5: Verificación Post-Despliegue

### Checklist:
- [ ] La app carga en `https://tu-proyecto.vercel.app`
- [ ] Chat IA funciona (requiere OpenAI API Key)
- [ ] Login/Signup funciona (requiere Supabase)
- [ ] Páginas se ven con Liquid Glass en modo premium (`?premium=1`)
- [ ] PWA se instala correctamente en iOS y Android
- [ ] Imágenes de Cocorico se cargan correctamente
- [ ] Recetas demo aparecen (20 recetas)
- [ ] Comunidad muestra 5 posts demo
- [ ] Retos muestra 10 desafíos demo

### URLs de Prueba:
```
Home:      https://tu-proyecto.vercel.app/es
Chat:      https://tu-proyecto.vercel.app/es/chat
Recetas:   https://tu-proyecto.vercel.app/es/recipes
Escáner:   https://tu-proyecto.vercel.app/es/scanner
Aprender:  https://tu-proyecto.vercel.app/es/learn
Comunidad: https://tu-proyecto.vercel.app/es/community
Retos:     https://tu-proyecto.vercel.app/dashboard/challenges
Premium:   https://tu-proyecto.vercel.app/es?premium=1
```

---

## 🐛 Solución de Problemas

### Error: "Failed to compile"
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Vercel Dashboard

### Error: "API routes not working"
- Asegúrate de que las variables `OPENAI_API_KEY` y `SUPABASE_SERVICE_ROLE_KEY` estén configuradas
- Verifica que no tengas `SITE_PASSWORD` si quieres acceso público

### PWA no se instala en iOS
- Verifica que `/manifest.webmanifest` sea accesible
- Asegúrate de que las imágenes en `/public/icons/` existan
- iOS requiere HTTPS (Vercel lo proporciona automáticamente)

### Imágenes de Cocorico no cargan
- Verifica que `/public/branding/cocorico/` contenga todas las imágenes
- Commit y push las imágenes si faltan

---

## 🎉 ¡Listo!

Tu app Cocorico con Liquid Glass iOS-style está desplegada en Vercel.

**Enlaces finales:**
- 🌐 Web: `https://tu-proyecto.vercel.app`
- 📱 iOS: Compartir enlace e instalar desde Safari
- 🤖 Android: Compartir enlace e instalar desde Chrome

**Soporte:**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas `git push origin main`, Vercel desplegará automáticamente los cambios.

Para desactivar auto-deploy:
1. Ve a Settings → Git
2. Desactiva "Production Branch"
