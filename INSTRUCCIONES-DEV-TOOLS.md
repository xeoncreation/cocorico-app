# 🚀 INSTRUCCIONES PARA PROBAR DEV TOOLS

## ✅ Todo Implementado Automáticamente

He implementado todas las funcionalidades que pediste. Aquí está lo que puedes probar **ahora mismo**:

---

## 🎨 1. Forzar Tema Globalmente

### API Route Creada: `/api/dev/set-theme`

**Forzar Premium:**
```
http://localhost:3000/api/dev/set-theme?theme=premium
```

**Forzar Free:**
```
http://localhost:3000/api/dev/set-theme?theme=free
```

Después de visitar cualquiera de estas URLs, todas las páginas del sitio se verán con el tema forzado (cookie `force_theme`).

---

## 👀 2. Vista Preview Premium (sin gating)

### Página Creada: `/dev/premium-preview`

Visita:
```
http://localhost:3000/dev/premium-preview
```

Esta página:
- ✅ **NO requiere autenticación** (sin gating)
- ✅ Muestra la estética **Glass & Motion** completa
- ✅ Incluye ejemplos de glassmorphism con `backdrop-blur-xl`
- ✅ Incluye efecto "Liquid Glass" simulado con CSS
- ✅ Tiene links directos para forzar tema Premium/Free

---

## 🔄 3. PlanThemeProvider (nuevo componente)

He creado un componente separado que maneja el tema de plan (free/premium) con **prioridad de fuentes**:

1. **Query param** `?theme=premium` (máxima prioridad)
2. **Cookie** `force_theme` (set por `/api/dev/set-theme`)
3. **Prop** `theme="premium"` (fallback)

### Componentes actualizados:
- ✅ `/free` usa `PlanThemeProvider theme="free"`
- ✅ `/premium` usa `PlanThemeProvider theme="premium"`
- ✅ `/dev/premium-preview` usa `PlanThemeProvider theme="premium"`

---

## 📚 4. Documentación Creada

### `BETA-CHECKLIST.md`
Lista ejecutable con todos los frentes para Beta pública:
- ✅ Funcional (Auth, CRUD, IA)
- ✅ Visual & UX (Free/Premium, Onboarding)
- ✅ Infra (RLS, Storage, Admin)
- ✅ Entrega (Vercel, PWA, Términos)

**Estado actual:** 6/20 tareas completadas (30%)

### `ASSETS-SETUP.md`
Guía completa para configurar Supabase Storage:
- SQL para crear bucket `assets`
- Políticas de acceso (read public, write authenticated)
- Estructura de carpetas (`free/`, `premium/`)
- SQL para actualizar `page_assets` con URLs reales
- Troubleshooting común

---

## 🧪 Cómo Probar Todo

### Test 1: Forzar Tema Premium
```bash
# 1. Forzar premium
http://localhost:3000/api/dev/set-theme?theme=premium

# 2. Ir a cualquier página
http://localhost:3000/free

# Resultado: Debería verse con colores premium (#2EC4B6, #FFD166)
```

### Test 2: Vista Preview
```bash
# 1. Abrir preview (sin autenticarse)
http://localhost:3000/dev/premium-preview

# Resultado: 
# - Hero image/video carga (placeholder actualmente)
# - 3 cards con glassmorphism (backdrop-blur-xl)
# - Bloque "Liquid Glass" con mask-image radial
# - Links para forzar tema en header
```

### Test 3: Query Param Override
```bash
# 1. Ir a free con query param
http://localhost:3000/free?theme=premium

# Resultado: Página /free se ve con estética premium
```

### Test 4: Desactivar Forzado
```bash
# 1. Volver a free
http://localhost:3000/api/dev/set-theme?theme=free

# 2. Abrir cualquier página
http://localhost:3000/premium

# Resultado: Vuelve al comportamiento normal (redirige a /upgrade si no eres premium)
```

---

## 📋 Tareas Manuales (las que tú debes hacer)

### 1. Configurar Supabase Storage

Ve a **Supabase Dashboard → Storage** y ejecuta:

```sql
-- Crear bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acceso
CREATE POLICY "Public read access on assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assets');
```

### 2. Subir Assets Reales

Crear en el bucket `assets`:
```
assets/
  ├── free/
  │   └── home-hero.jpg (1200x600, colores #FF6B35, #31C48D)
  └── premium/
      └── home-hero.mp4 (1200x600, < 2MB, H.264)
```

### 3. Actualizar Database

```sql
UPDATE page_assets 
SET 
  asset_free = 'https://[PROJECT_ID].supabase.co/storage/v1/object/public/assets/free/home-hero.jpg',
  asset_premium = 'https://[PROJECT_ID].supabase.co/storage/v1/object/public/assets/premium/home-hero.mp4'
WHERE page_name = 'home';
```

### 4. Testing en Producción

Una vez que Vercel termine el deployment (~2 min), prueba:

```
https://cocorico-app.vercel.app/api/dev/set-theme?theme=premium
https://cocorico-app.vercel.app/dev/premium-preview
```

---

## 🎯 Siguiente Paso

Después de probar estas funcionalidades en local:

1. **Configurar Storage** (manual, 5 minutos)
2. **Subir 1-2 assets de ejemplo** (manual, 10 minutos)
3. **Actualizar `page_assets`** (SQL, 2 minutos)
4. **Probar en dev:** `/dev/premium-preview` debería cargar assets reales

Una vez que veas los assets reales cargando en `/dev/premium-preview`, podemos:
- ✅ Marcar el bloque "Premium Preview" como completado en BETA-CHECKLIST
- 🚀 Pasar al siguiente frente: **Sugerencias IA** o **Búsqueda/Filtros**

---

## 📞 Si Algo No Funciona

**Error 1:** "Use ?theme=free|premium" al visitar `/api/dev/set-theme`
- **Solución:** Añade el query param: `?theme=premium`

**Error 2:** Preview no muestra glassmorphism
- **Verifica:** CSS variables en `globals.css` con `data-theme="premium"`
- **Verifica:** Clases Tailwind `backdrop-blur-xl` compiladas

**Error 3:** Assets no cargan (404)
- **Solución:** Sigue los pasos en `ASSETS-SETUP.md` (crear bucket + políticas)

---

**Última actualización:** 2025-11-15  
**Commit:** 39fb5bf
