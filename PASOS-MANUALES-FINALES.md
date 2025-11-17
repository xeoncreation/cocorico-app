# 📋 PASOS MANUALES FINALES

## ✅ Ya Implementado (Automático)

- ✅ API route `/api/dev/set-theme` para forzar tema globalmente
- ✅ `PlanThemeProvider` con prioridad: query param > cookie > prop
- ✅ `/dev/premium-preview` - vista QA sin gating
- ✅ `/free`, `/premium`, `/upgrade` - páginas temáticas completas
- ✅ Backgrounds premium con degradado oscuro + glass cards
- ✅ Acentos premium (turquesa #2EC4B6 / amarillo #FFD166) en headers y CTAs
- ✅ Deployment en Vercel funcionando
- ✅ Fix para Windows (transpilePackages para @supabase)

---

## 🔧 Tareas Manuales Pendientes

### 1. Configurar Supabase Storage (5 minutos)

**Paso 1: Crear bucket público**

Ve a **Supabase Dashboard → Storage** y ejecuta en SQL Editor:

```sql
-- Crear bucket assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;
```

O desde la UI:
- Click "New bucket"
- Name: `assets`
- Public: ✅ Yes

**Paso 2: Configurar políticas de acceso**

En **SQL Editor**:

```sql
-- Lectura pública
CREATE POLICY "Public read access on assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assets');

-- Escritura autenticada
CREATE POLICY "Authenticated users can upload assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assets');

-- Actualización autenticada
CREATE POLICY "Authenticated users can update assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'assets');

-- Eliminación solo admin
CREATE POLICY "Only admins can delete assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'assets' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
```

---

### 2. Subir Assets de Ejemplo (10 minutos)

**Estructura de carpetas en el bucket `assets`:**

```
assets/
  ├── free/
  │   ├── home-hero.jpg       (1200x600, < 500KB)
  │   ├── recipes-hero.jpg
  │   └── community-hero.gif
  └── premium/
      ├── home-hero.mp4       (1200x600, < 2MB, H.264)
      ├── recipes-hero.mp4
      └── community-hero.mp4
```

**Recomendaciones:**
- **Tema FREE:** Fotos nítidas, colores vibrantes (#FF6B35 naranja, #31C48D verde)
- **Tema PREMIUM:** Videos cortos (2-5s loop), animaciones fluidas, glassmorphism

**Fuentes gratuitas:**
- Fotos: [Unsplash](https://unsplash.com/s/photos/food)
- Videos: [Pexels Videos](https://www.pexels.com/videos)
- Optimizar: [TinyPNG](https://tinypng.com), [HandBrake](https://handbrake.fr)

---

### 3. Actualizar Database (2 minutos)

Una vez subidos los assets, actualiza las URLs en `page_assets`:

```sql
-- Home hero
UPDATE page_assets 
SET 
  asset_free = 'https://[PROJECT_ID].supabase.co/storage/v1/object/public/assets/free/home-hero.jpg',
  asset_premium = 'https://[PROJECT_ID].supabase.co/storage/v1/object/public/assets/premium/home-hero.mp4'
WHERE page_name = 'home';

-- Recipes hero (si lo subes)
INSERT INTO page_assets (asset_key, page_name, asset_free, asset_premium)
VALUES (
  'recipes_hero',
  'recipes',
  'https://[PROJECT_ID].supabase.co/storage/v1/object/public/assets/free/recipes-hero.jpg',
  'https://[PROJECT_ID].supabase.co/storage/v1/object/public/assets/premium/recipes-hero.mp4'
)
ON CONFLICT (asset_key) DO UPDATE SET
  asset_free = EXCLUDED.asset_free,
  asset_premium = EXCLUDED.asset_premium;
```

**⚠️ Importante:** Reemplaza `[PROJECT_ID]` con tu ID real de Supabase.

---

### 4. Probar en Producción (5 minutos)

**Test 1: Forzar tema premium**
```
https://cocorico-app.vercel.app/api/dev/set-theme?theme=premium
```
Resultado esperado: Página blanca con texto "OK"

**Test 2: Preview premium**
```
https://cocorico-app.vercel.app/dev/premium-preview
```
Resultado esperado:
- Título con degradado turquesa → amarillo
- Fondo oscuro degradado
- 3 cards con efecto glass (bg-white/10 + backdrop-blur-xl)
- Hero image/video si subiste assets

**Test 3: Página free**
```
https://cocorico-app.vercel.app/free
```
Resultado esperado:
- Fondo claro
- Colores vibrantes (naranja #FF6B35)
- Hero image si subiste asset_free

**Test 4: Login con contraseña**
```
https://cocorico-app.vercel.app/login
```
Resultado esperado:
- Campos: Email + Password (opcional)
- Botón: "Entrar / Enlace mágico"

---

### 5. Probar en Local (opcional)

**Servidor ya está activo en:**
```
http://127.0.0.1:3000
```

**Pruebas:**
```
http://127.0.0.1:3000/dev/premium-preview
http://127.0.0.1:3000/free
http://127.0.0.1:3000/api/dev/set-theme?theme=premium
```

**Si encuentras errores:**
1. Limpia cachés:
   ```powershell
   Remove-Item -Recurse -Force .next
   Remove-Item -Recurse -Force node_modules\.cache
   ```
2. Reinicia:
   ```powershell
   npm run dev:127
   ```

---

## 🎨 Cómo Cambiar Colores Premium (Futuro)

Si más adelante quieres ajustar los acentos premium:

**Archivo:** `src/app/dev/premium-preview/page.tsx` y `src/app/premium/page.tsx`

**Buscar:**
```tsx
from-[#2EC4B6] to-[#FFD166]  // Turquesa → Amarillo
text-[#2EC4B6]                // Turquesa
text-[#FFD166]                // Amarillo
```

**Reemplazar con tus colores:**
```tsx
from-[#TU_COLOR_1] to-[#TU_COLOR_2]
text-[#TU_COLOR_1]
```

También puedes ajustar el background gradient:
```tsx
bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-800
```

---

## 📊 Checklist de Verificación

- [ ] Bucket `assets` creado en Supabase Storage
- [ ] Políticas de acceso configuradas (read public, write authenticated)
- [ ] Carpetas `free/` y `premium/` creadas en el bucket
- [ ] Al menos 1 asset FREE subido (home-hero.jpg)
- [ ] Al menos 1 asset PREMIUM subido (home-hero.mp4)
- [ ] Database `page_assets` actualizada con URLs reales
- [ ] Probado en producción: /api/dev/set-theme?theme=premium
- [ ] Probado en producción: /dev/premium-preview (sin errores)
- [ ] Probado en producción: /free (carga asset)
- [ ] Probado en local: http://127.0.0.1:3000/dev/premium-preview

---

## 🚨 Troubleshooting

### Error 403 al cargar asset
- ✅ Verifica que el bucket sea público
- ✅ Verifica política "Public read access"
- ✅ Confirma que la URL es correcta

### Video no reproduce en VisualHero
- ✅ Verifica formato MP4 con codec H.264
- ✅ Confirma que el archivo < 3MB
- ✅ Añade atributos `autoPlay muted loop playsInline` (ya implementado en VisualHero)

### Asset no cambia al forzar tema
- ✅ Limpia cookies: Abre DevTools → Application → Cookies → Elimina `force_theme`
- ✅ Hard refresh: Ctrl+Shift+R
- ✅ Verifica que `page_assets` tiene ambos campos (`asset_free` y `asset_premium`)

### Localhost sigue sin conexión
- ✅ Cierra todos los terminales con node
- ✅ Ejecuta: `Get-Process node | Stop-Process -Force`
- ✅ Limpia: `Remove-Item -Recurse -Force .next`
- ✅ Reinicia: `npm run dev:127`
- ✅ Abre: http://127.0.0.1:3000/es (no localhost:3000)

---

## 🎯 Estado Actual del Proyecto

**Deployment:** ✅ Funcionando en https://cocorico-app.vercel.app

**Features implementadas:**
- ✅ Auth con password + magic link
- ✅ Páginas temáticas (Free/Premium/Upgrade)
- ✅ Dev tools (forzar tema, preview)
- ✅ Premium glass aesthetic con degradados
- ✅ Acentos premium (turquesa/amarillo)

**Pendiente manual:**
- ⏳ Configurar Supabase Storage
- ⏳ Subir assets reales
- ⏳ Actualizar page_assets con URLs

**Siguiente hito:** Beta cerrada (ver `BETA-CHECKLIST.md`)

---

**Última actualización:** 2025-11-17  
**Commits recientes:**
- `32b749a` - feat(ui): add premium accent colors
- `9cb6af3` - feat(ui): add premium gradient backgrounds
- `dada502` - fix(dev): transpile supabase packages (Windows fix)
- `d46c638` - chore(vercel): remove env block
