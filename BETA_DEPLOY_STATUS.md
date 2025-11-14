# ✅ Checklist Completado - Listo para Deploy Beta

**Fecha**: 14 de noviembre de 2025  
**Fase**: Beta cerrada (sin Stripe)  
**Estado**: 🚀 **LISTO PARA VERCEL**

---

## 📊 Estado de Tareas Manuales

### ✅ COMPLETADAS AUTOMÁTICAMENTE

- [x] **Repositorio conectado a GitHub**
  - Repo: `xeoncreation/cocorico-app`
  - Branch: `main`
  - Último commit: pushed ✓

- [x] **Variables de entorno configuradas localmente**
  - `.env.local` con todas las variables necesarias
  - Supabase URL y keys ✓
  - OpenAI API key ✓
  - Replicate token ✓
  - ADMIN_SECRET y ADMIN_EMAIL ✓
  - SITE_PASSWORD para beta cerrada ✓
  - Umami analytics ✓

- [x] **Archivos de configuración de Vercel creados**
  - `vercel.json`: config de build, headers PWA, regiones
  - `.vercelignore`: excluye docs y tests del deploy
  - `VERCEL_ENV_SETUP.md`: guía paso a paso de variables

- [x] **Script de verificación pre-deploy**
  - `scripts/verify-deploy-ready.js` creado
  - Ejecutado: ⚠️ advertencias pero listo para deploy
  - Advertencias no bloqueantes (PWA en config, Stripe test keys OK)

- [x] **Build local verificado**
  - `npm run build` pasa ✓
  - 26/26 tests pasando ✓
  - 17 migraciones de DB validadas ✓

- [x] **Stripe deshabilitado para beta**
  - Variables de test presentes pero no se copiarán a Vercel
  - `VERCEL_ENV_SETUP.md` marca Stripe como "NO AÑADIR"

---

## 🔜 PENDIENTE - MANUAL (Solo 5 pasos)

### Paso 1: Conectar Vercel (5 minutos)

1. Ve a **https://vercel.com** → Login con GitHub
2. Click en **"Add New..."** → **"Project"**
3. Busca e importa: **`xeoncreation/cocorico-app`**
4. Framework: **Next.js** (autodetectado)
5. **NO hagas deploy todavía** → Solo conecta

### Paso 2: Configurar Variables de Entorno (5 minutos)

Abre `VERCEL_ENV_SETUP.md` y copia SOLO estas secciones a Vercel → Settings → Environment Variables:

✅ **OBLIGATORIAS** (5 variables):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://dxhgpjrgvkxudetbmxuw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
ADMIN_SECRET=cocorico-admin-secret-2024-change-this-to-random-string
ADMIN_EMAIL=admin@cocorico.app
NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app  # Cambiar después
```

✅ **BETA** (1 variable):
```bash
SITE_PASSWORD=cocorico2025
```

✅ **IA FEATURES** (2 variables):
```bash
OPENAI_API_KEY=<copia_desde_tu_.env.local>
REPLICATE_API_TOKEN=<copia_desde_tu_.env.local>
```

✅ **ANALYTICS** (1 variable):
```bash
NEXT_PUBLIC_UMAMI_WEBSITE_ID=0ff906b7-1420-4f27-ae6f-324727d42846
```

**Marca como "Sensitive"**: `ADMIN_SECRET`, `OPENAI_API_KEY`, `REPLICATE_API_TOKEN`

**Aplicar a**: Production + Preview

❌ **NO PEGUES STRIPE** (déjalo para fase 2)

### Paso 3: Deploy (2 minutos)

1. En Vercel → Click **"Deploy"**
2. Espera ~2-5 minutos
3. Anota tu URL: `https://[proyecto].vercel.app`

### Paso 4: Actualizar URL de App (1 minuto)

1. Vercel → Settings → Environment Variables
2. Busca `NEXT_PUBLIC_APP_URL`
3. Edita y cambia por tu URL real de Vercel
4. Guarda y **Redeploy** (Vercel te lo ofrecerá automáticamente)

### Paso 5: Validar iOS/Safari (10 minutos)

Sigue el checklist de `DEPLOYMENT_CHECKLIST.md` sección **"🧪 Validación Post-Despliegue"**:

**Desktop**:
- [ ] Navega a tu URL de Vercel
- [ ] Ingresa password: `cocorico2025`
- [ ] Prueba login/signup
- [ ] Crea una receta de prueba

**iOS (iPhone/iPad)**:
- [ ] Safari → tu URL → "Añadir a pantalla de inicio"
- [ ] Abre app desde icono (standalone, sin barra Safari)
- [ ] Prueba navegación básica
- [ ] Modo avión → verifica offline cache
- [ ] Login y verifica que sesión persiste

---

## 📝 Notas Importantes

### 🔒 Beta Cerrada

La app está protegida con password gate:
- Password: `cocorico2025`
- Todos los visitantes verán prompt de contraseña
- Para desactivar: elimina `SITE_PASSWORD` en Vercel y redeploy

### 💳 Stripe Deshabilitado

- Variables de test existen en `.env.local` (ignoradas)
- NO se copiaron a Vercel (correcto)
- Los endpoints de billing están presentes pero no funcionales sin las variables
- Para activar en fase 2: seguir `STRIPE_LIVE_MIGRATION.md`

### 🤖 Features de IA Activas

Con las variables de OpenAI y Replicate:
- Análisis inteligente de recetas ✓
- Sugerencias automáticas ✓
- Visión por IA (análisis de imágenes) ✓
- Text-to-Speech (si ElevenLabs se añade después) ⏳

### 📊 Analytics Configurado

Umami (GDPR-friendly) está activo:
- Sin cookies invasivas
- Dashboard: https://cloud.umami.is
- Website ID: `0ff906b7-1420-4f27-ae6f-324727d42846`

### 🗄️ Base de Datos

- Supabase producción: `dxhgpjrgvkxudetbmxuw.supabase.co`
- 17 migraciones aplicadas y verificadas
- RLS habilitado en todas las tablas
- user_roles, profiles, recipes, messages listos

---

## 🎯 Resumen Ejecutivo

| Aspecto | Estado | Notas |
|---------|--------|-------|
| **Build** | ✅ Listo | Compila sin errores |
| **Tests** | ✅ 26/26 | Todos pasando |
| **Migraciones DB** | ✅ 17/17 | Aplicadas y validadas |
| **Repo GitHub** | ✅ Pushed | Último commit synced |
| **Vercel Config** | ✅ Creado | vercel.json + .vercelignore |
| **Env Vars** | ⏳ Copiar | Seguir VERCEL_ENV_SETUP.md |
| **Deploy** | ⏳ Manual | 5 pasos restantes |
| **iOS/Safari** | ⏳ Validar | Post-deploy |
| **Stripe** | ❌ Deshabilitado | Correcto para beta |

---

## 📞 Qué Hacer si Algo Falla

### Build falla en Vercel

1. Revisa logs en Vercel Deployment
2. Verifica que todas las variables obligatorias estén copiadas
3. Comprueba que `NEXT_PUBLIC_APP_URL` sea HTTPS (no localhost)

### Password gate no funciona

1. Verifica que `SITE_PASSWORD` esté en Vercel
2. Comprueba que aplicó a "Production"
3. Haz un redeploy manualmente

### PWA no instala en iOS

1. Espera 5 minutos tras el deploy (CDN cache)
2. Verifica en Safari: `https://tu-url.vercel.app/manifest.webmanifest`
3. View Source en Safari → busca meta tags `apple-mobile-web-app`

### Session no persiste en Safari

1. Verifica que NO tienes ad-blockers activos
2. Safari → Settings → Privacy → desactiva "Prevent Cross-Site Tracking" solo para tu dominio
3. Borra caché de Safari y prueba de nuevo

---

## 🚀 Tiempo Estimado Total

- **Conectar Vercel**: 5 minutos
- **Copiar variables**: 5 minutos
- **Deploy inicial**: 2-5 minutos
- **Actualizar URL y redeploy**: 1 minuto + 2 minutos
- **Validación básica**: 5 minutos
- **Validación iOS/Safari**: 10 minutos

**Total: ~30-35 minutos** desde ahora hasta tener la app en producción validada.

---

## 📋 Después del Deploy

Una vez validado:

1. **Compartir con beta testers**: Dales la URL y el password (`cocorico2025`)
2. **Monitorear errores**: Vercel Functions Logs + Supabase Dashboard
3. **Recoger feedback**: Crea issues en GitHub o usa formulario de feedback
4. **Iterar**: Haz cambios → push → Vercel redeploya automáticamente

Cuando quieras abrir la beta públicamente:
1. Elimina `SITE_PASSWORD` en Vercel
2. Redeploy
3. 🎉

---

**🎉 El 95% del trabajo está hecho. Solo faltan 5 pasos manuales para tener la app live.**

Ver guía detallada: **`VERCEL_ENV_SETUP.md`**
