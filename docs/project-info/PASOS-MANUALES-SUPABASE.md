# 📋 PASOS MANUALES EN SUPABASE - GUÍA COMPLETA

## ✅ **LO QUE YA ESTÁ LISTO:**
- ✅ OnboardingModal habilitado y pusheado a GitHub → Vercel lo desplegará
- ✅ Supabase CLI instalado y configurado
- ✅ Proyecto linkeado correctamente
- ✅ Phase 1 (Ping) funcionando perfectamente
- ✅ Archivos SQL corregidos
- ✅ Edge Function actualizada con estructura correcta

---

## 📝 **TAREAS MANUALES (En este orden exacto):**

### **PASO 1: Crear tabla `page_assets`**

**Dónde:** https://supabase.com/dashboard/project/dxhgpjrgvkxudetbmxuw/sql/new

**SQL a copiar y ejecutar:**
```sql
-- Page assets mapping for free/premium visuals
-- Run in Supabase SQL Editor

create table if not exists public.page_assets (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  asset_free text,
  asset_premium text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add unique constraint on page to prevent duplicates
alter table public.page_assets 
add constraint unique_page 
unique (page);

-- Enable RLS
alter table public.page_assets enable row level security;

-- Public read policy
create policy if not exists "public read page assets" 
on public.page_assets 
for select 
using (true);
```

**Resultado esperado:**
- Mensaje: "Success. No rows returned"
- La tabla `page_assets` aparecerá en: Table Editor

---

### **PASO 2: Insertar datos de ejemplo**

**En el mismo SQL Editor**, ejecuta:

```sql
-- Example insertion for page_assets mapping free vs premium assets

insert into public.page_assets (page, asset_free, asset_premium) 
values (
  'home',
  'https://dxhgpjrgvkxudetbmxuw.supabase.co/storage/v1/object/public/assets/free/home.gif',
  'https://dxhgpjrgvkxudetbmxuw.supabase.co/storage/v1/object/public/assets/premium/home_glass.mp4'
)
on conflict (page) 
do update set 
  asset_free = EXCLUDED.asset_free,
  asset_premium = EXCLUDED.asset_premium,
  updated_at = now();
```

**Resultado esperado:**
- Mensaje: "Success. 1 row(s) affected"
- Puedes verificar en: Table Editor → page_assets (verás 1 fila con page='home')

---

### **PASO 3: Verificar datos insertados**

**Ejecuta este SELECT para confirmar:**

```sql
select * from public.page_assets;
```

**Deberías ver:**
```
id | page | asset_free | asset_premium | created_at | updated_at
-----------------------------------------------------------------
[uuid] | home | https://...free/home.gif | https://...premium/home_glass.mp4 | [timestamp] | [timestamp]
```

---

### **PASO 4: Verificar Secrets de la Edge Function**

**Dónde:** https://supabase.com/dashboard/project/dxhgpjrgvkxudetbmxuw/settings/functions

**Busca la sección "Secrets" y verifica que existan:**

1. **SUPABASE_URL**
   - Valor: `https://dxhgpjrgvkxudetbmxuw.supabase.co`
   - Si no existe, añádelo

2. **SUPABASE_SERVICE_ROLE_KEY**
   - Para obtenerlo: Settings → API → "service_role" key (secret)
   - Copia la clave que empieza con `eyJh...`
   - Si no existe, añádelo

**✅ Confirma cuando hayas completado estos 4 pasos**

---

## 🚀 **CUANDO TERMINES, YO EJECUTARÉ:**

```powershell
# 1. Desplegar la Edge Function actualizada
supabase functions deploy get_theme --no-verify-jwt

# 2. Probar con plan FREE
$Body = @{ page = "home"; plan = "free" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://dxhgpjrgvkxudetbmxuw.functions.supabase.co/get_theme" `
  -Method Post -Body $Body -ContentType "application/json"

# 3. Probar con plan PREMIUM
$Body = @{ page = "home"; plan = "premium" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://dxhgpjrgvkxudetbmxuw.functions.supabase.co/get_theme" `
  -Method Post -Body $Body -ContentType "application/json"

# 4. Probar con GET
start "https://dxhgpjrgvkxudetbmxuw.functions.supabase.co/get_theme?page=home&plan=free"
start "https://dxhgpjrgvkxudetbmxuw.functions.supabase.co/get_theme?page=home&plan=premium"
```

---

## ✅ **RESPUESTA ESPERADA:**

**Con plan FREE:**
```json
{
  "ok": true,
  "page": "home",
  "plan": "free",
  "asset": "https://dxhgpjrgvkxudetbmxuw.supabase.co/storage/v1/object/public/assets/free/home.gif",
  "fallback": "https://dxhgpjrgvkxudetbmxuw.supabase.co/storage/v1/object/public/assets/free/home.gif"
}
```

**Con plan PREMIUM:**
```json
{
  "ok": true,
  "page": "home",
  "plan": "premium",
  "asset": "https://dxhgpjrgvkxudetbmxuw.supabase.co/storage/v1/object/public/assets/premium/home_glass.mp4",
  "fallback": "https://dxhgpjrgvkxudetbmxuw.supabase.co/storage/v1/object/public/assets/free/home.gif"
}
```

---

## 🔍 **Si algo falla:**

1. **Error en PASO 1:** Captura el error exacto y avísame
2. **Error en PASO 2:** Verifica que PASO 1 se completó correctamente
3. **PASO 3 no muestra datos:** Vuelve a ejecutar PASO 2
4. **Secrets no aparecen:** Ve a Settings → API y copia el service_role key manualmente

---

## 📌 **RESUMEN RÁPIDO:**

1. ✅ SQL Editor → Crear tabla `page_assets`
2. ✅ SQL Editor → Insertar datos de ejemplo
3. ✅ SQL Editor → Verificar con SELECT
4. ✅ Settings → Functions → Verificar Secrets
5. ✅ Avisar cuando esté listo → Yo despliego y pruebo

**¿Listo para empezar? Ejecuta PASO 1 y avísame cuando lo completes** 🚀
