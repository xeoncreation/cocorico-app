# Guía de Deployment: Edge Function get_theme

## ✅ Pasos Ya Completados

1. ✅ Supabase CLI instalado vía Scoop
2. ✅ Login a Supabase CLI
3. ✅ Proyecto linkeado (`dxhgpjrgvkxudetbmxuw`)
4. ✅ Phase 1 (Ping) desplegada y funcionando
5. ✅ Phase 2 (DB) código preparado
6. ✅ SQL actualizado con estructura correcta

## 📋 Pasos Manuales Pendientes

### 1. Crear tabla `page_assets` en Supabase

**Dónde:** https://supabase.com/dashboard/project/dxhgpjrgvkxudetbmxuw/sql/new

**SQL a ejecutar:** (Archivo: `supabase/sql/page-assets.sql`)
```sql
-- Page assets mapping for theme variants
-- Run in Supabase SQL Editor

create table if not exists public.page_assets (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  element text not null default 'hero',
  variant text not null default 'default',
  url text not null,
  is_premium boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add unique constraint to prevent duplicates
alter table public.page_assets 
add constraint unique_page_element_variant 
unique (page, element, variant);

-- Enable RLS
alter table public.page_assets enable row level security;

-- Public read policy
create policy if not exists "public read page assets" 
on public.page_assets 
for select 
using (true);
```

### 2. Insertar datos de ejemplo

**SQL a ejecutar:** (Archivo: `supabase/sql/page-assets-example.sql`)
```sql
-- Example insertions for page_assets with proper structure

insert into public.page_assets (page, element, variant, url, is_premium) values
-- Home page free variant
('home', 'hero', 'default', 'https://dxhgpjrgvkxudetbmxuw.supabase.co/storage/v1/object/public/assets/free/home.gif', false),
-- Home page premium variant
('home', 'hero', 'default', 'https://dxhgpjrgvkxudetbmxuw.supabase.co/storage/v1/object/public/assets/premium/home_glass.mp4', true)
on conflict (page, element, variant) 
do update set 
  url = EXCLUDED.url,
  is_premium = EXCLUDED.is_premium,
  updated_at = now();
```

### 3. Verificar Secrets de Edge Function

**Dónde:** Dashboard → Project Settings → Edge Functions → Secrets

**Verificar que existan:**
- `SUPABASE_URL` = `https://dxhgpjrgvkxudetbmxuw.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (obtener de Settings → API → service_role key)

Si no existen, añádelos manualmente.

## 🚀 Deployment Final (Ejecutar desde PowerShell)

Una vez completados los pasos manuales:

```powershell
# 1. Desplegar Phase 2 (con DB)
supabase functions deploy get_theme --no-verify-jwt

# 2. Probar con POST
$Url = "https://dxhgpjrgvkxudetbmxuw.functions.supabase.co/get_theme"
$Body = @{ page = "home"; variant = "default" } | ConvertTo-Json
Invoke-RestMethod -Uri $Url -Method Post -Body $Body -ContentType "application/json"

# 3. Probar con GET en navegador
start "https://dxhgpjrgvkxudetbmxuw.functions.supabase.co/get_theme?page=home&variant=default"
```

## ✅ Resultado Esperado

**POST/GET Response:**
```json
{
  "ok": true,
  "assets": [
    {
      "page": "home",
      "element": "hero",
      "variant": "default",
      "url": "https://dxhgpjrgvkxudetbmxuw.supabase.co/storage/v1/object/public/assets/free/home.gif",
      "is_premium": false
    },
    {
      "page": "home",
      "element": "hero",
      "variant": "default",
      "url": "https://dxhgpjrgvkxudetbmxuw.supabase.co/storage/v1/object/public/assets/premium/home_glass.mp4",
      "is_premium": true
    }
  ]
}
```

## 🔍 Troubleshooting

### Si la función devuelve error 500
1. Ve a Dashboard → Functions → get_theme → Logs
2. Revisa el error específico
3. Verifica que la tabla `page_assets` exista
4. Verifica que los secrets estén configurados

### Si la función devuelve 401
Redeploy con: `supabase functions deploy get_theme --no-verify-jwt`

### Si devuelve assets vacíos
Verifica que los datos de ejemplo se insertaron correctamente:
```sql
select * from public.page_assets;
```

## 📝 Notas

- Los URLs de los assets apuntan a storage que aún no existe
- Crear bucket 'assets' (público) será el siguiente paso
- La función ya está lista para usar cuando subas los assets reales
