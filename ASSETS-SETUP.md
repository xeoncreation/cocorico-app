# 📸 ASSETS SETUP — Guía de Configuración

## 🎯 Estado Actual

### Database: `page_assets`
```sql
-- Estructura actual
CREATE TABLE page_assets (
  id UUID PRIMARY KEY,
  asset_key TEXT UNIQUE,
  url TEXT,
  created_at TIMESTAMPTZ,
  page_name TEXT,
  asset_free TEXT,    -- URL del asset para tema free
  asset_premium TEXT  -- URL del asset para tema premium
);

-- Datos actuales (placeholders)
INSERT INTO page_assets (asset_key, url, page_name, asset_free, asset_premium)
VALUES 
  ('home_free', 'https://via.placeholder.com/1200x600/FF6B35/FFFFFF?text=Cocorico+Free', 'home', 'https://via.placeholder.com/1200x600/FF6B35/FFFFFF?text=Cocorico+Free', NULL),
  ('home_premium', 'https://via.placeholder.com/1200x600/2EC4B6/FFFFFF?text=Cocorico+Premium', 'home', NULL, 'https://via.placeholder.com/1200x600/2EC4B6/FFFFFF?text=Cocorico+Premium');
```

---

## 🚀 Configuración Supabase Storage

### 1. Crear bucket (si no existe)

Ve a **Supabase Dashboard → Storage** y ejecuta:

```sql
-- En SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;
```

O desde la UI:
- Click "New bucket"
- Name: `assets`
- Public: ✅ Yes

---

### 2. Crear estructura de carpetas

En el bucket `assets`, crea:
```
assets/
  ├── free/
  │   ├── home-hero.jpg       (1200x600, tema Fresh & Friendly)
  │   ├── recipes-hero.jpg
  │   └── community-hero.gif
  └── premium/
      ├── home-hero.mp4       (1200x600, tema Glass & Motion)
      ├── recipes-hero.mp4
      └── community-hero.mp4
```

---

### 3. Configurar políticas de acceso

Ejecuta en **SQL Editor**:

```sql
-- Política de lectura pública
CREATE POLICY "Public read access on assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assets');

-- Política de escritura autenticada
CREATE POLICY "Authenticated users can upload assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assets');

-- Política de actualización autenticada
CREATE POLICY "Authenticated users can update assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'assets');

-- Política de eliminación (solo admin)
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

## 📦 Assets Recomendados

### Tema FREE (Fresh & Friendly)
- **Colores:** #FF6B35, #31C48D, #8A5CF6
- **Estilo:** Vibrante, limpio, fotos nítidas
- **Formato:** JPG/PNG optimizado (< 500KB)
- **Dimensiones:** 1200x600 (hero), 400x300 (thumbnails)

### Tema PREMIUM (Glass & Motion)
- **Colores:** #2EC4B6, #FFD166, gradientes
- **Estilo:** Videos cortos, animaciones fluidas, glassmorphism
- **Formato:** MP4 con H.264 (< 2MB), 30fps
- **Dimensiones:** 1200x600 (hero), autoloop activado

---

## 🔄 Actualizar Database

Una vez subidos los assets reales, actualiza:

```sql
-- Ejemplo: Home hero
UPDATE page_assets 
SET 
  asset_free = 'https://[PROJECT_ID].supabase.co/storage/v1/object/public/assets/free/home-hero.jpg',
  asset_premium = 'https://[PROJECT_ID].supabase.co/storage/v1/object/public/assets/premium/home-hero.mp4'
WHERE page_name = 'home';

-- Ejemplo: Recipes hero
INSERT INTO page_assets (asset_key, page_name, asset_free, asset_premium)
VALUES (
  'recipes_hero',
  'recipes',
  'https://[PROJECT_ID].supabase.co/storage/v1/object/public/assets/free/recipes-hero.jpg',
  'https://[PROJECT_ID].supabase.co/storage/v1/object/public/assets/premium/recipes-hero.mp4'
);
```

**Importante:** Reemplaza `[PROJECT_ID]` con tu ID real de Supabase.

---

## 🧪 Verificar en Dev

### 1. Comprobar que los assets cargan
```bash
# En tu navegador, abre:
https://[PROJECT_ID].supabase.co/storage/v1/object/public/assets/free/home-hero.jpg

# Debería mostrar la imagen sin error 403/404
```

### 2. Probar en la app
```
Visita: http://localhost:3000/dev/premium-preview
Resultado: Debería cargar el video/imagen premium en VisualHero
```

### 3. Forzar tema y verificar cambio de assets
```bash
# Forzar premium
http://localhost:3000/api/dev/set-theme?theme=premium

# Ir a home
http://localhost:3000/

# Debería cargar asset_premium
```

---

## 📊 Checklist de Assets

- [ ] Bucket `assets` creado en Supabase Storage
- [ ] Carpetas `free/` y `premium/` creadas
- [ ] Políticas de acceso configuradas (read public, write authenticated)
- [ ] Assets FREE subidos (home, recipes, community)
- [ ] Assets PREMIUM subidos (home, recipes, community)
- [ ] Database `page_assets` actualizada con URLs reales
- [ ] Verificado en dev: assets cargan correctamente
- [ ] Verificado en preview: /dev/premium-preview muestra assets premium

---

## 🎨 Herramientas Recomendadas

### Para crear/optimizar assets FREE:
- **Fotos:** [Unsplash](https://unsplash.com) (food photography)
- **Optimización:** [TinyPNG](https://tinypng.com)
- **Edición:** Figma, Canva

### Para crear assets PREMIUM:
- **Videos:** [Pexels Videos](https://www.pexels.com/videos) (food in motion)
- **Compresión:** [HandBrake](https://handbrake.fr) (H.264, 2MB max)
- **Animaciones:** After Effects, Lottie

---

## 🚨 Troubleshooting

### Error 403 al cargar asset
- ✅ Verifica que el bucket sea público
- ✅ Verifica política "Public read access"
- ✅ Confirma que la URL es correcta

### Video no reproduce en VisualHero
- ✅ Verifica formato MP4 con codec H.264
- ✅ Confirma que el archivo < 3MB
- ✅ Añade atributos `autoPlay muted loop playsInline`

### Asset no cambia al forzar tema
- ✅ Limpia cookies: `document.cookie = "force_theme=; expires=Thu, 01 Jan 1970"`
- ✅ Hard refresh: Ctrl+Shift+R
- ✅ Verifica que `page_assets` tiene ambos campos (`asset_free` y `asset_premium`)

---

**Última actualización:** 2025-11-15
