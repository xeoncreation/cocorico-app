# 🚨 ACCIONES CRÍTICAS INMEDIATAS
**Completar HOY - No posponer**

---

## ⚠️ PELIGRO: Claves API Expuestas

### 1. ROTAR TODAS LAS CLAVES API (30 minutos)

#### OpenAI API Key
```bash
# 1. Ir a: https://platform.openai.com/api-keys
# 2. Revocar clave actual: sk-proj-pUz_z_HhtwW...
# 3. Crear nueva clave
# 4. Actualizar en Vercel:
vercel env rm OPENAI_API_KEY production
vercel env add OPENAI_API_KEY production
# (Pegar nueva clave cuando lo pida)

# 5. Actualizar .env.local
# OPENAI_API_KEY=sk-proj-NUEVA_CLAVE_AQUI
```

#### Stripe Secret Key
```bash
# 1. Ir a: https://dashboard.stripe.com/apikeys
# 2. Hacer clic en "Reveal test key" o "Reveal live key"
# 3. Hacer clic en "Roll key" para generar nueva
# 4. Actualizar en Vercel:
vercel env rm STRIPE_SECRET_KEY production
vercel env add STRIPE_SECRET_KEY production

# 5. Actualizar webhook secret:
vercel env rm STRIPE_WEBHOOK_SECRET production
vercel env add STRIPE_WEBHOOK_SECRET production
```

#### Replicate API Token
```bash
# 1. Ir a: https://replicate.com/account/api-tokens
# 2. Eliminar token actual
# 3. Crear nuevo token
# 4. Actualizar en Vercel:
vercel env rm REPLICATE_API_TOKEN production
vercel env add REPLICATE_API_TOKEN production
```

#### ElevenLabs API Key (si está en uso)
```bash
# 1. Ir a: https://elevenlabs.io/app/settings/api-keys
# 2. Regenerar key
# 3. Actualizar en Vercel:
vercel env rm ELEVENLABS_API_KEY production
vercel env add ELEVENLABS_API_KEY production
```

#### Actualizar ADMIN_SECRET
```bash
# Generar secret fuerte:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copiar resultado y actualizar:
vercel env rm ADMIN_SECRET production
vercel env add ADMIN_SECRET production
# (Pegar el hash generado)

# Actualizar .env.local con el mismo valor
```

### 2. ELIMINAR ARCHIVO VULNERABLE (5 minutos)

```bash
# Opción A: Eliminar completamente
cd c:\Users\yo-90\cocorico
git rm setup-vercel-env.ps1
git commit -m "security: remove file with exposed secrets"
git push

# Opción B: Mover a .gitignore y limpiar
echo "setup-vercel-env.ps1" >> .gitignore
# Editar setup-vercel-env.ps1 y reemplazar todas las claves con placeholders
git add .gitignore setup-vercel-env.ps1
git commit -m "security: protect sensitive config file"
git push
```

### 3. REVISAR HISTORIAL DE GIT (10 minutos)

```bash
# Verificar si setup-vercel-env.ps1 está en commits antiguos
git log --all --full-history -- setup-vercel-env.ps1

# Si está en historial, considerar:
# - Usar BFG Repo-Cleaner para limpiar historial
# - O forzar rotación inmediata de todas las claves
```

---

## 🛡️ PROTECCIÓN INMEDIATA DE APIs

### 4. APLICAR RATE LIMITING (1 hora)

```bash
# 1. Instalar dependencias (opcional para Upstash)
# npm install @upstash/ratelimit @upstash/redis

# 2. El archivo ya está creado: src/lib/rate-limiter.ts

# 3. Aplicar a endpoints críticos:
# Editar cada archivo en src/app/api/ según ejemplos en rate-limiter.example.ts
```

#### Archivos a modificar (en orden de prioridad):

**CRÍTICO (hacer primero):**
1. ✅ `src/app/api/ai/voice/route.ts`
2. ✅ `src/app/api/voice-conversation/route.ts`
3. ✅ `src/app/api/ai/recipes/route.ts`

**ALTO:**
4. ✅ `src/app/api/ai/detect-food/route.ts`
5. ✅ `src/app/api/suggest/route.ts`
6. ✅ `src/app/api/stt/route.ts`
7. ✅ `src/app/api/tts/route.ts`

**MEDIO:**
8. ✅ `src/app/api/feedback/route.ts`
9. ✅ `src/app/api/community/posts/route.ts`

**Patrón a seguir en cada archivo:**

```typescript
import { createClient } from '@/lib/supabase/server';
import { applyRateLimit, getRateLimitIdentifier, getClientIP } from '@/lib/rate-limiter';

export async function POST(req: NextRequest) {
  // 1. Auth check
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 2. Rate limit
  const ip = getClientIP(req.headers);
  const identifier = getRateLimitIdentifier(user.id, ip);
  const rateLimitResponse = await applyRateLimit(identifier, 'ai'); // o 'aiVoice'
  if (rateLimitResponse) return rateLimitResponse;
  
  // 3. Resto del código original...
}
```

---

## 🗄️ APLICAR RLS EN TABLAS COMUNITARIAS

### 5. EJECUTAR MIGRACIÓN DE SEGURIDAD (15 minutos)

```bash
# Opción A: Desde Supabase Dashboard
# 1. Ir a: https://supabase.com/dashboard
# 2. Seleccionar proyecto "cocorico"
# 3. SQL Editor → New Query
# 4. Copiar contenido de: supabase/migrations/20260309_critical_community_rls.sql
# 5. Ejecutar
# 6. Verificar que no hay errores

# Opción B: Desde CLI (si tienes Supabase CLI instalado)
supabase db push --file supabase/migrations/20260309_critical_community_rls.sql

# Opción C: Conectar directamente con psql
# psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
# \i supabase/migrations/20260309_critical_community_rls.sql
```

### 6. VERIFICAR RLS APLICADO (5 minutos)

```sql
-- Ejecutar en Supabase SQL Editor:

-- Verificar que RLS está habilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('community_posts', 'post_likes', 'post_comments', 'user_follows')
ORDER BY tablename;

-- Verificar políticas creadas
SELECT 
  schemaname, 
  tablename, 
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('community_posts', 'post_likes', 'post_comments', 'user_follows')
ORDER BY tablename, policyname;
```

**Resultado esperado:**
- 4 tablas con `rls_enabled = true`
- Múltiples policies por tabla (read, insert, update, delete)

---

## 📦 VERIFICAR STORAGE POLICIES

### 7. APLICAR POLÍTICAS DE STORAGE (20 minutos)

```bash
# 1. Ir a Supabase Dashboard:
# https://supabase.com/dashboard/project/[PROJECT-ID]/storage/buckets

# 2. Para cada bucket (avatars, assets, recipes):

# Bucket: avatars
# Policies:
# - Public read: ✅
# - Insert: authenticated users, own folder only
# - Update: authenticated users, own folder only  
# - Delete: authenticated users, own folder only

# SQL para crear policies:
```

```sql
-- En Supabase Dashboard → Storage → avatars → Policies

-- Read policy (ya debería existir)
CREATE POLICY "avatars_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Insert policy
CREATE POLICY "avatars_insert_own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Update policy
CREATE POLICY "avatars_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Delete policy
CREATE POLICY "avatars_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

**Repetir para buckets `assets` y `recipes` con políticas similares.**

---

## ✅ VERIFICACIÓN FINAL

### 8. CHECKLIST DE COMPLETADO

Marca cada ítem cuando lo completes:

**Rotación de Claves:**
- [ ] OpenAI API Key rotada
- [ ] Stripe Secret Key rotada
- [ ] Stripe Webhook Secret rotado
- [ ] Replicate API Token rotado
- [ ] ElevenLabs API Key rotado (si aplica)
- [ ] ADMIN_SECRET actualizado con hash fuerte
- [ ] Archivo setup-vercel-env.ps1 eliminado o protegido
- [ ] Variables actualizadas en Vercel
- [ ] Variables actualizadas en .env.local
- [ ] Hacer redeploy: `vercel --prod`

**Rate Limiting:**
- [ ] src/lib/rate-limiter.ts creado
- [ ] /api/ai/voice protegido
- [ ] /api/voice-conversation protegido
- [ ] /api/ai/recipes protegido
- [ ] /api/ai/detect-food protegido
- [ ] /api/suggest protegido
- [ ] /api/stt protegido
- [ ] /api/tts protegido
- [ ] Testeado con 11+ requests (debe dar 429)

**RLS y Base de Datos:**
- [ ] Migración 20260309_critical_community_rls.sql ejecutada
- [ ] RLS verificado en community_posts
- [ ] RLS verificado en post_likes
- [ ] RLS verificado en post_comments
- [ ] RLS verificado en user_follows
- [ ] Políticas listadas y correctas

**Storage:**
- [ ] Políticas aplicadas en bucket avatars
- [ ] Políticas aplicadas en bucket assets
- [ ] Políticas aplicadas en bucket recipes
- [ ] Testeado: no se puede eliminar avatar de otro usuario

**Testing:**
- [ ] API protegida retorna 401 sin auth
- [ ] API protegida retorna 429 con exceso de requests
- [ ] Usuario A no puede ver posts privados de Usuario B
- [ ] Usuario A no puede eliminar posts de Usuario B
- [ ] Deploy exitoso en Vercel
- [ ] Sitio en producción funciona correctamente

---

## 🔴 SI NO PUEDES COMPLETAR TODO HOY

**Mínimo CRÍTICO (no posponer):**
1. ✅ Rotar OpenAI API Key
2. ✅ Rotar Stripe Secret Key
3. ✅ Proteger /api/ai/voice con rate limit
4. ✅ Proteger /api/voice-conversation con rate limit
5. ✅ Ejecutar migración RLS comunitaria

**Completar mañana:**
- Resto de rate limiting en APIs
- Storage policies
- Testing exhaustivo

---

## 📞 SOPORTE

Si encuentras problemas:
1. Revisar logs: `vercel logs --prod`
2. Consultar docs: `docs/AUDITORIA_SEGURIDAD_2026.md`
3. Verificar errores en Supabase Dashboard

**Tiempo total estimado: 2-3 horas**
**Impacto: Prevenir $10,000+ en pérdidas potenciales**
