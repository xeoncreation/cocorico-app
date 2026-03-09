# 🔐 Guía Completa: Rotación de API Keys - Cocorico

**Fecha:** 9 de marzo, 2026  
**Motivo:** Las claves estaban expuestas en `setup-vercel-env.ps1` antes de sanitizarlo  
**Estado:** ⚠️ ACCIÓN REQUERIDA - Completar antes de lanzamiento público

---

## ⏱️ Tiempo Estimado Total: 30-45 minutos

---

## 1️⃣ OpenAI API Key (PRIORIDAD ALTA) ⏱️ 10 minutos

### Paso 1: Revocar la clave antigua
1. Ve a **https://platform.openai.com/api-keys**
2. Inicia sesión con tu cuenta de OpenAI
3. Busca la clave que comienza con `sk-proj-pUz...`
   - Si no ves el nombre completo, busca por fecha de creación o última vez usada
4. Haz clic en el icono **🗑️ Delete** o **Revoke** al lado de la clave
5. Confirma la revocación

### Paso 2: Crear nueva clave
1. En la misma página, haz clic en **"+ Create new secret key"**
2. Dale un nombre descriptivo: `Cocorico Production - March 2026`
3. **Selecciona permisos** (si te lo pide):
   - ✅ `Completions` (para GPT-4)
   - ✅ `Chat` (para conversaciones)
   - ✅ `Vision` (para detect-food)
   - ✅ `Audio` (si usas Whisper STT)
4. Haz clic en **"Create"**
5. **IMPORTANTE**: Copia la clave inmediatamente (solo se muestra una vez)
   ```
   sk-proj-NUEVA_CLAVE_AQUI
   ```

### Paso 3: Actualizar en tu entorno local
1. Abre el archivo `.env.local` en tu proyecto:
   ```bash
   code .env.local
   ```
2. Busca la línea:
   ```env
   OPENAI_API_KEY=sk-proj-pUz...
   ```
3. Reemplázala con la nueva clave:
   ```env
   OPENAI_API_KEY=sk-proj-NUEVA_CLAVE_AQUI
   ```
4. Guarda el archivo

### Paso 4 (Stripe): Actualizar en Vercel
**Opción A - Dashboard Web (recomendado):**
1. Ve a **https://vercel.com/xeons-projects-f217d040/cocorico/settings/environment-variables**
2. Busca `OPENAI_API_KEY` en la lista
3. Haz clic en los tres puntos **⋯** → **Edit**
4. Pega la nueva clave
5. Asegúrate que esté en **Production**, **Preview** y **Development**
6. Haz clic en **Save**

**Opción B - CLI de Vercel:**
```powershell
# Eliminar la vieja
vercel env rm OPENAI_API_KEY production

# Agregar la nueva
echo "sk-proj-NUEVA_CLAVE_AQUI" | vercel env add OPENAI_API_KEY production --yes
```

### Paso 5: Verificar funcionamiento
1. Redespliega en Vercel:
   ```powershell
   vercel --prod
   ```
2. Prueba un endpoint que use OpenAI:
   ```powershell
   # Necesitas estar autenticado y tener tu JWT token
   curl https://tu-dominio.vercel.app/api/ai/recipes `
     -H "Authorization: Bearer TU_JWT_TOKEN" `
     -H "Content-Type: application/json" `
     -d '{"ingredients":["tomate","cebolla"]}'
   ```
3. Si devuelve una receta, ✅ la clave funciona

---

## 2️⃣ Stripe API Keys (PRIORIDAD ALTA) ⏱️ 10 minutos

### Paso 1: Revocar Secret Key
1. Ve a **https://dashboard.stripe.com/test/apikeys**
2. Inicia sesión en tu cuenta de Stripe
3. En la sección **Secret key**, busca la que termina en `...yZL00`
4. Haz clic en **"Show live key"** o el icono de ojo para confirmar
5. Haz clic en **🗑️ Delete** o **Revoke**
6. Confirma la revocación

### Paso 2: Crear nueva Secret Key
1. En la misma página, haz clic en **"+ Create secret key"**
2. Dale un nombre: `Cocorico Production`
3. **Copia la nueva clave** (formato: `sk_test_...`)
   ```
   sk_test_NUEVA_CLAVE_STRIPE_AQUI
   ```

### Paso 3: Actualizar en .env.local
```env
STRIPE_SECRET_KEY=sk_test_NUEVA_CLAVE_STRIPE_AQUI
```

### Paso 4: Actualizar en Vercel
```powershell
# Dashboard: Settings → Environment Variables → STRIPE_SECRET_KEY → Edit
# O por CLI:
echo "sk_test_NUEVA_CLAVE_STRIPE_AQUI" | vercel env add STRIPE_SECRET_KEY production --yes
```

---

## 3️⃣ Stripe Webhook Secret (PRIORIDAD MEDIA) ⏱️ 5 minutos

### Paso 1: Revisar webhooks existentes
1. Ve a **https://dashboard.stripe.com/test/webhooks**
2. Busca el webhook con tu URL de Vercel
3. Si existe, haz clic en él

### Paso 2: Obtener el nuevo signing secret
1. En la página del webhook, busca **Signing secret**
2. Haz clic en **"Reveal"** o **"Roll secret"** para generar uno nuevo
3. Copia el secret (formato: `whsec_...`)

**Si no tienes webhook configurado:**
1. Haz clic en **"+ Add endpoint"**
2. URL del endpoint: `https://tu-dominio.vercel.app/api/webhooks/stripe`
3. Selecciona eventos a escuchar:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.paid`
   - ✅ `invoice.payment_failed`
4. Haz clic en **"Add endpoint"**
5. Copia el **Signing secret**

### Paso 3 (Replicate): Actualizar variables
```env
# .env.local
STRIPE_WEBHOOK_SECRET=whsec_NUEVO_SECRET_AQUI
```

```powershell
# Vercel
echo "whsec_NUEVO_SECRET_AQUI" | vercel env add STRIPE_WEBHOOK_SECRET production --yes
```

---

## 4️⃣ Replicate API Token (PRIORIDAD MEDIA) ⏱️ 5 minutos

### Paso 1: Revocar token antiguo
1. Ve a **https://replicate.com/account/api-tokens**
2. Inicia sesión
3. Busca el token que comienza con `r8_HMkynLCZc...`
4. Haz clic en **"Delete"** o **"Revoke"**
5. Confirma

### Paso 2: Crear nuevo token
1. Haz clic en **"Create token"**
2. Nombre: `Cocorico Production - March 2026`
3. **Copia el token** (formato: `r8_...`)
   ```
   r8_NUEVO_TOKEN_REPLICATE_AQUI
   ```

### Paso 3: Actualizar variables
```env
# .env.local
REPLICATE_API_TOKEN=r8_NUEVO_TOKEN_REPLICATE_AQUI
```

```powershell
# Vercel
echo "r8_NUEVO_TOKEN_REPLICATE_AQUI" | vercel env add REPLICATE_API_TOKEN production --yes
```

---

## 5️⃣ Admin Secret & Site Password (PRIORIDAD BAJA) ⏱️ 5 minutos

Estos no están expuestos externamente, pero es buena práctica cambiarlos.

### Generar nuevos secretos aleatorios

**PowerShell:**
```powershell
# Generar ADMIN_SECRET (64 caracteres aleatorios)
$adminSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
Write-Host "ADMIN_SECRET=$adminSecret"

# Generar SITE_PASSWORD (20 caracteres aleatorios)
$sitePassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 20 | ForEach-Object {[char]$_})
Write-Host "SITE_PASSWORD=$sitePassword"
```

**O usa generador online:**
- https://passwordsgenerator.net/ (configura 64 caracteres, alfanumérico)

### Actualizar en .env.local
```env
ADMIN_SECRET=tu_nuevo_admin_secret_de_64_caracteres_super_aleatorio
SITE_PASSWORD=tu_nuevo_password_20_char
```

### Actualizar en Vercel
```powershell
echo "tu_nuevo_admin_secret" | vercel env add ADMIN_SECRET production --yes
echo "tu_nuevo_password" | vercel env add SITE_PASSWORD production --yes
```

---

## 6️⃣ ElevenLabs API Key (SI LA USAS) ⏱️ 5 minutos

**Nota:** Solo si usas ElevenLabs para TTS (text-to-speech)

### Paso 1: Revocar clave antigua
1. Ve a **https://elevenlabs.io/app/settings/api-keys**
2. Busca la clave antigua
3. Haz clic en **"Delete"**

### Paso 2 (ElevenLabs): Crear nueva clave
1. Haz clic en **"Generate new API key"**
2. Copia la clave

### Paso 3 (ElevenLabs): Actualizar variables
```env
# .env.local
ELEVENLABS_API_KEY=nueva_clave_elevenlabs
```

```powershell
# Vercel
echo "nueva_clave_elevenlabs" | vercel env add ELEVENLABS_API_KEY production --yes
```

---

## ✅ Checklist de Verificación Final

Después de rotar todas las claves:

- [ ] ✅ `.env.local` actualizado con todas las nuevas claves
- [ ] ✅ Variables actualizadas en Vercel Dashboard
- [ ] ✅ Redespliegue realizado: `vercel --prod`
- [ ] ✅ Endpoints probados manualmente (con JWT token)
- [ ] ✅ Logs de Vercel revisados (sin errores de autenticación)
- [ ] ✅ Stripe webhook funcionando (hacer compra de prueba)
- [ ] ✅ Bot de OpenAI responde correctamente
- [ ] ✅ Replicate detecta ingredientes en imágenes

---

## 🧪 Script de Prueba Completo

```powershell
# Guardar tu JWT token primero
$JWT = "tu_token_jwt_aqui"
$BASE_URL = "https://cocorico-qiy6g5d4b-xeons-projects-f217d040.vercel.app"

# Test 1: OpenAI (recipes)
Write-Host "Test 1: OpenAI API..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "$BASE_URL/api/ai/recipes" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $JWT"
    "Content-Type" = "application/json"
  } `
  -Body '{"ingredients":["tomate"]}'

if ($response.StatusCode -eq 200) {
  Write-Host "✅ OpenAI funciona" -ForegroundColor Green
} else {
  Write-Host "❌ OpenAI falló: $($response.StatusCode)" -ForegroundColor Red
}

# Test 2: Replicate (live-vision) - necesita archivo de imagen
Write-Host "`nTest 2: Replicate API..." -ForegroundColor Cyan
# Requiere FormData con imagen, ver documentación

# Test 3: Stripe (webhook)
Write-Host "`nTest 3: Stripe..." -ForegroundColor Cyan
# Hacer compra de prueba desde la UI

Write-Host "`n✅ Tests completados" -ForegroundColor Green
```

---

## 📋 Notas Importantes

### ⚠️ Seguridad
1. **NUNCA** commitees claves reales al repositorio
2. **NUNCA** compartas las claves por email/chat sin encriptar
3. **USA** gestores de contraseñas (1Password, Bitwarden, LastPass)
4. **MANTÉN** un registro de cuándo rotaste las claves

### 💾 Backup
Antes de cambiar nada, guarda las claves actuales en un lugar seguro temporalmente:
- Por si algo falla, puedas volver atrás
- Una vez verificado todo, elimina el backup

### 🔄 Frecuencia Recomendada
- **OpenAI/Stripe/Replicate**: Rotar cada 90 días
- **Webhook secrets**: Rotar cada 180 días
- **Admin/Site passwords**: Rotar cada 60 días o cuando hay cambio de equipo

---

## 🆘 Problemas Comunes

### "Invalid API key" después de rotar
**Solución:** 
1. Verifica que copiaste la clave completa (sin espacios al inicio/final)
2. Espera 2-3 minutos para que Vercel propague los cambios
3. Redespliega: `vercel --prod`

### "Environment variable not found"
**Solución:**
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Verifica que la variable exista en **Production**
3. Si solo está en Preview, agrégala a Production

### Webhook de Stripe no funciona
**Solución:**
1. Verifica la URL en Stripe Dashboard
2. Prueba el endpoint manualmente con Stripe CLI:
   ```bash
   stripe trigger checkout.session.completed
   ```
3. Revisa logs en Vercel: `vercel logs --prod`

---

## 📞 Soporte

Si tienes problemas:
1. **Logs de Vercel**: https://vercel.com/xeons-projects-f217d040/cocorico/logs
2. **Supabase Logs**: https://supabase.com/dashboard/project/dxhgpjrgvkxudetbmxuw/logs
3. **Status de APIs**:
   - OpenAI: https://status.openai.com/
   - Stripe: https://status.stripe.com/
   - Replicate: https://status.replicate.com/

---

**✅ Última actualización:** 9 de marzo, 2026  
**Autor:** GitHub Copilot - Cocorico Security Team
