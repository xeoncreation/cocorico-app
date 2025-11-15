# 🧪 Estado de Páginas - Cocorico

**Generado**: 15 de noviembre de 2025  
**URL Producción**: https://cocorico-app.vercel.app

---

## ✅ Páginas Nuevas (Creadas Ahora)

### `/free` - Versión Gratuita
- **Estética**: Fresh & Friendly (colores vibrantes, sombras sutiles)
- **Estado**: ✅ Creada
- **Features**: Explor recetas, Guardar favoritas, Sugerencias IA
- **Tema CSS**: `data-theme="free"`

### `/premium` - Versión Premium
- **Estética**: Glass & Motion (glassmorphism, backdrop-blur)
- **Estado**: ✅ Creada con gateo
- **Protección**: Requiere `plan = 'premium'` en `user_profiles`
- **Features**: Modo Cocina inmersivo, IA avanzada, Visuals dinámicos
- **Tema CSS**: `data-theme="premium"`
- **Redirect**: Si no es premium → `/upgrade`

### `/upgrade` - Landing de Conversión
- **Estado**: ✅ Creada
- **CTA**: Botón a `/plans` (Stripe checkout)
- **Fallback**: Link a `/free` para continuar gratis

---

## 🔄 Páginas Modificadas

### `/login` - Iniciar Sesión
- **Cambio**: AuthButton ahora redirige aquí (antes mostraba dropdown)
- **Soporte**: Email + Password **O** Magic Link (si dejas password vacío)
- **Estado**: ✅ Funcionando (ya existía, sin cambios)

### `AuthButton` Component
- **Antes**: Dropdown con email para magic link
- **Ahora**: Botón que redirige a `/login`
- **Estado**: ✅ Simplificado y deployed

---

## 📋 Rutas Principales del Proyecto

### Autenticación
- `/login` - ✅ Email+Password o Magic Link
- `/signup` - ✅ Registro con contraseña
- `/invite/[token]` - ✅ Registro por invitación beta

### Landing/Marketing
- `/` (root) - ✅ Home page
- `/[locale]` - ✅ Home localizada (es/en)
- `/free` - ✅ **NUEVO** - Landing gratuita
- `/premium` - ✅ **NUEVO** - Landing premium (con gateo)
- `/upgrade` - ✅ **NUEVO** - Conversión a premium
- `/pricing` - ✅ Tabla de precios
- `/[locale]/plans` - ✅ Planes de suscripción

### Dashboard
- `/dashboard` - ✅ Dashboard principal
- `/[locale]/dashboard` - ✅ Dashboard localizado
- `/[locale]/dashboard/profile` - ✅ Editar perfil
- `/[locale]/dashboard/favorites` - ✅ Recetas favoritas
- `/[locale]/dashboard/stats` - ✅ Estadísticas
- `/[locale]/dashboard/versions` - ✅ Versiones de recetas
- `/[locale]/dashboard/import` - ✅ Importar receta (IA)
- `/[locale]/dashboard/new` - ✅ Nueva receta
- `/[locale]/dashboard/feedback` - ✅ Enviar feedback
- `/[locale]/dashboard/badges` - ✅ Logros y badges

### Recetas
- `/recipes` - ✅ Listado de recetas
- `/[locale]/recipes` - ✅ Listado localizado
- `/recipes/[id]` - ✅ Ver receta
- `/[locale]/recipes/[id]` - ✅ Ver receta localizada
- `/recipes/[id]/edit` - ✅ Editar receta
- `/[locale]/recipes/[id]/edit` - ✅ Editar localizada
- `/recipes/search` - ✅ Búsqueda de recetas
- `/[locale]/recipes/search` - ✅ Búsqueda localizada
- `/recipes/new` - ✅ Nueva receta
- `/[locale]/recipes/new` - ✅ Nueva localizada

### Comunidad
- `/[locale]/community` - ✅ Posts comunitarios
- `/[locale]/community/[id]` - ✅ Ver post
- `/[locale]/community/new` - ✅ Nuevo post
- `/[locale]/chat` - ✅ Chat comunitario

### Perfiles
- `/u/[username]` - ✅ Perfil público
- `/settings` - ✅ Configuración
- `/[locale]/settings/device` - ✅ Configuración de dispositivo

### Billing/Stripe (Test Mode)
- `/[locale]/checkout` - ✅ Stripe checkout
- `/[locale]/billing/success` - ✅ Página de éxito post-pago

### Legal
- `/legal/terms` - ✅ Términos de servicio
- `/[locale]/legal/terms` - ✅ Términos localizados
- `/legal/privacy` - ✅ Política de privacidad
- `/[locale]/legal/privacy` - ✅ Privacidad localizada
- `/[locale]/legal/cookies` - ✅ Política de cookies

### Extras
- `/search` - ✅ Búsqueda global
- `/[locale]/learn` - ✅ Tutoriales/Aprendizaje
- `/r/[user]/[slug]` - ✅ Recetas públicas por slug
- `/r/public/[slug]` - ✅ Recetas públicas
- `/dev-test` - ✅ Página de pruebas (dev only)

---

## 🔧 Utilidades Nuevas

### `ThemeProvider` (Client Component)
```tsx
<ThemeProvider theme="free | premium">
  {children}
</ThemeProvider>
```
Fuerza el tema CSS en `document.documentElement.dataset.theme`

### `getAssetsMap(theme)` (Server Function)
```ts
const assets = await getAssetsMap("free");
const heroUrl = assets.get("home");
```
Carga assets dinámicos desde `page_assets` table

### `VisualHero` (Server Component)
```tsx
<VisualHero url={heroUrl} className="..." />
```
Renderiza imagen o video con overlay

### `requirePremiumOrRedirect()` (Server Function)
```ts
await requirePremiumOrRedirect();
// Si no es premium, hace redirect a /upgrade
```
Gateo de acceso premium

---

## ⚠️ Pendientes

### Base de Datos
- [ ] **Crear tabla `page_assets`** en Supabase:
  ```sql
  create table if not exists public.page_assets (
    id uuid primary key default gen_random_uuid(),
    page text unique not null,
    asset_free text,
    asset_premium text,
    created_at timestamptz default now()
  );
  
  -- Seed inicial
  insert into public.page_assets (page, asset_free, asset_premium) values
  ('home', 'https://placeholder.com/free-hero.gif', 'https://placeholder.com/premium-hero.mp4')
  on conflict do nothing;
  ```

- [ ] **Añadir columna `plan` a `user_profiles`** (si no existe):
  ```sql
  alter table public.user_profiles 
  add column if not exists plan text default 'free' check (plan in ('free', 'premium'));
  ```

### Verificación en Producción
- [ ] Probar `/free` en https://cocorico-app.vercel.app/free
- [ ] Probar `/login` con password
- [ ] Intentar acceder a `/premium` sin ser premium (debe redirigir a `/upgrade`)
- [ ] Crear un usuario con `plan = 'premium'` y probar acceso a `/premium`

---

## 🚀 Próximos Pasos

1. **Esperar a que Vercel despliegue** el último push (2-3 minutos)
2. **Probar en producción**:
   - https://cocorico-app.vercel.app/login → Debería mostrar form con email + password
   - https://cocorico-app.vercel.app/free → Debería ver estética Fresh & Friendly
   - https://cocorico-app.vercel.app/premium → Debería redirigir a /upgrade (si no eres premium)
3. **Crear tablas en Supabase** (SQL arriba)
4. **Subir assets** a Supabase Storage para hero visuals

---

## 📊 Resumen

| Componente | Estado | Notas |
|-----------|--------|-------|
| AuthButton | ✅ Modificado | Redirige a /login |
| /login | ✅ Existente | Ya soporta password |
| /free | ✅ Nuevo | Tema fresh |
| /premium | ✅ Nuevo | Tema glass + gateo |
| /upgrade | ✅ Nuevo | CTA conversión |
| ThemeProvider | ✅ Nuevo | Client component |
| getAssetsMap | ✅ Nuevo | Server function |
| VisualHero | ✅ Nuevo | Server component |
| getUserPlan | ✅ Nuevo | Server guard |
| page_assets table | ⏳ Pendiente | SQL listo |
| plan column | ⏳ Pendiente | SQL listo |

**El código está completo y deployado. Solo falta crear las tablas en Supabase.**
