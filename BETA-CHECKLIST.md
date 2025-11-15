# 🚀 BETA CHECKLIST — Cocorico

Este documento rastrea todos los frentes necesarios para lanzar una **Beta pública** atractiva, moderna, intuitiva y 100% funcional.

---

## ✅ Funcional (Core)

- [x] **Auth completa** — signup, login, reset con `profiles` autogenerado
- [x] **CRUD de recetas** — crear/editar/eliminar + visibilidad (privada/pública)
- [ ] **Limpieza IA → receta normalizada JSON** (servidor) — implementado pero pendiente de probar
- [ ] **Sugerencias IA** — variantes, sustituciones, versión rápida
- [ ] **Listado + búsqueda + filtros** — ingredientes, tiempo, dificultad
- [ ] **Página pública de receta** — solo lectura (compartir link)

---

## 🎨 Visual & UX

- [x] **Estética Free estable** — tokens CSS, componentes, layouts
- [x] **Estética Premium estable** — glass, motion, assets
- [ ] **Onboarding claro** — 3–4 pantallas + tutorial "primer guardado"
- [ ] **Modo Cocina** — timer, pasos, modo manos libres básico

---

## 🔒 Infra & Calidad

- [ ] **RLS revisado** — `profiles`, `recipes`, `page_assets`
- [ ] **Storage assets** — políticas de lectura pública y escritura autenticada
- [ ] **Admin dashboard** — `/admin/users` estable (toggle plan/role) + métricas básicas
- [ ] **Variables .env.local auditadas** — audit script sin faltantes
- [ ] **next build sin errores** — 0 warnings críticos

---

## 📦 Entrega

- [x] **Despliegue en Vercel** — staging con preview links
- [ ] **PWA activada** — cuando dev server esté estable
- [ ] **Privacy Policy & Términos** — básicos publicados

---

## 🎯 Premium Preview (Dev)

- [x] **API route /api/dev/set-theme** — forzar free/premium globalmente
- [x] **PlanThemeProvider** — respeta query param > cookie > prop
- [x] **Página /dev/premium-preview** — QA visual sin gating
- [ ] **Assets premium** — rellena `page_assets` con `asset_premium` para 'home'

---

## 📋 Tareas Manuales Pendientes

### 1. Configurar Supabase Storage
```sql
-- Crear bucket 'assets' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT DO NOTHING;

-- Política de lectura pública
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

-- Política de escritura autenticada
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');
```

### 2. Subir Assets Premium
- Crear carpetas: `assets/free/` y `assets/premium/`
- Subir hero images/videos (1200x600 recomendado)
- Actualizar `page_assets`:
```sql
UPDATE page_assets 
SET asset_premium = 'https://[project].supabase.co/storage/v1/object/public/assets/premium/home.mp4'
WHERE page_name = 'home';
```

### 3. Revisar RLS
Ejecutar en Supabase SQL Editor:
```sql
-- Verificar políticas de profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Verificar políticas de recipes
SELECT * FROM pg_policies WHERE tablename = 'recipes';

-- Verificar políticas de page_assets
SELECT * FROM pg_policies WHERE tablename = 'page_assets';
```

### 4. Probar Flujo Completo
1. Signup → verificar creación de profile
2. Crear receta → verificar guardado
3. Editar receta → verificar actualización
4. Eliminar receta → verificar soft delete
5. Buscar recetas → verificar filtros
6. Compartir link → verificar acceso público

---

## 🧪 Testing Dev Server

### Forzar tema Premium
```
Visita: http://localhost:3000/api/dev/set-theme?theme=premium
Luego: http://localhost:3000/free
Resultado: Debería verse con estética premium
```

### Vista Preview Premium
```
Visita: http://localhost:3000/dev/premium-preview
Resultado: Debería verse interfaz Glass & Motion sin redirección
```

### Desactivar tema forzado
```
Visita: http://localhost:3000/api/dev/set-theme?theme=free
```

---

## 📊 Métricas de Éxito

Para considerar Beta lista:

- [ ] 0 errores críticos en `npm run build`
- [ ] Tiempo de carga inicial < 3s
- [ ] Todas las páginas principales (home, login, dashboard, recipes) cargan sin error
- [ ] Auth flow completo funciona (signup → verify → login)
- [ ] CRUD recetas funciona end-to-end
- [ ] Modo premium preview funciona sin assets reales

---

## 🚦 Estado Actual

**Completado:** 6/20 tareas principales (30%)

**Próximos pasos:**
1. Configurar Supabase Storage (manual)
2. Subir assets premium (manual)
3. Probar limpieza IA
4. Implementar búsqueda/filtros
5. Crear onboarding

---

**Última actualización:** 2025-11-15
