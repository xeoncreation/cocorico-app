# ✅ Bloques 35-36 — Perfil de usuario e insignias

## 📦 Integración completada

### 🟩 BLOQUE 35 — Perfil de usuario completo y avatars

**Archivos SQL creados:**
- `supabase/sql/user_profiles.sql`
  - Tabla `user_profiles` con username, avatar, bio, idioma, país, XP y nivel
  - Trigger automático: crea perfil al registrarse un usuario
  - RPC `add_xp(user_uuid, amount)`: suma experiencia y recalcula nivel
  - RLS: cada usuario solo ve/edita su perfil

**Utilidades:**
- `src/utils/profile.ts`: getProfile, updateProfile, addExperience
- `src/utils/uploadAvatar.ts`: uploadAvatar, deleteAvatar (bucket `avatars` en Supabase Storage)

**Páginas:**
- `/[locale]/dashboard/profile`
  - Formulario editable con avatar, username, bio, idioma, país
  - Subida de avatar con preview
  - Tarjeta de estadísticas: nivel, XP, barra de progreso

**Sistema de experiencia:**
- Crear receta → +10 XP
- Usar chat IA → +1 XP
- Publicar versión → +5 XP
- Nivel = 1 + floor(experience / 100)

---

### 🟨 BLOQUE 36 — Sistema de insignias y gamificación

**Archivos SQL creados:**
- `supabase/sql/badges.sql`
  - Tabla `user_badges` con badge_code, badge_name, description, icon_url
  - Índice único para evitar duplicados (user_id + badge_code)
  - RPC `assign_badge(user_uuid, code)`: asigna insignia si no existe
  - RLS: usuarios solo ven sus badges

**Insignias predefinidas:**
- `first_recipe` — Primera receta publicada
- `chef_10` — Alcanzar nivel 10
- `ai_explorer` — Usar el chat IA 50 veces
- `social_star` — 100 vistas en tus recetas
- `premium` — Usuario Premium activo

**Utilidades:**
- `src/utils/badges.ts`: getBadges, assignBadge, hasBadge

**Páginas:**
- `/[locale]/dashboard/badges`
  - Grid de insignias desbloqueadas con icono, nombre, descripción y fecha
  - Sección "Próximos logros" mostrando badges bloqueados
  - Efectos hover y diseño tipo Duolingo/Strava

---

## ✅ Verificación completada

- **Build:** ✅ PASS (rutas `/[locale]/dashboard/profile` y `/[locale]/dashboard/badges` generadas)
- **Tests:** ✅ PASS (17/17 tests unitarios)
- **Servidor:** ✅ Ready en http://localhost:3000
- **Páginas verificadas:**
  - http://localhost:3000/es/dashboard/profile
  - http://localhost:3000/es/dashboard/badges

---

## 📋 Próximos pasos para activar estas funcionalidades

### 1. Ejecutar SQL en Supabase

Abre el SQL Editor de tu proyecto en Supabase y ejecuta en orden:

1. `supabase/sql/user_profiles.sql`
2. `supabase/sql/badges.sql`

### 2. Crear bucket de Storage (opcional para avatars)

Si prefieres separar los avatars del bucket `recipes`:

1. En Supabase > Storage, crea el bucket `avatars`
2. Marca como público ✅
3. Configura políticas de acceso si es necesario

Si no creas el bucket, modifica `uploadAvatar.ts` para usar el bucket `recipes`.

### 3. Probar el flujo completo

```sql
-- Ver tu perfil:
SELECT * FROM user_profiles WHERE user_id = auth.uid();

-- Añadir 10 XP manualmente:
SELECT add_xp(auth.uid(), 10);

-- Desbloquear insignia de primera receta:
SELECT assign_badge(auth.uid(), 'first_recipe');

-- Ver tus insignias:
SELECT * FROM user_badges WHERE user_id = auth.uid();
```

### 4. Integrar asignación automática de insignias

Puedes llamar `assignBadge` desde tus API routes cuando:

- Usuario publica su primera receta → `assignBadge('first_recipe')`
- Usuario alcanza nivel 10 → `assignBadge('chef_10')`
- Usuario usa el chat 50 veces → `assignBadge('ai_explorer')`
- Usuario activa Premium → `assignBadge('premium')`

Ejemplo en `/api/recipes/route.ts` (al crear receta):

```typescript
import { assignBadge } from "@/utils/badges";
import { addExperience } from "@/utils/profile";

// Después de crear la receta:
await addExperience(10); // +10 XP
const recipes = await countUserRecipes(userId);
if (recipes === 1) {
  await assignBadge('first_recipe');
}
```

---

## 🎨 Características destacadas

- **Perfiles editables** con avatar, bio, idioma y país
- **Sistema de niveles** basado en experiencia acumulada
- **Insignias coleccionables** con iconos y descripciones
- **Gamificación tipo Duolingo**: progreso visual, logros desbloqueables
- **Internacionalización** completa (ES/EN)
- **RLS estricto**: cada usuario solo ve sus datos
- **Trigger automático**: perfil creado al registrarse
- **Prevención de duplicados**: badges únicos por usuario

---

## 📚 Documentación actualizada

- `README.md`: menciona las nuevas páginas de perfil y badges
- `supabase/sql/README.md`: incluye scripts de user_profiles y badges con ejemplos de uso
- `.env.example`: ya contiene todas las variables necesarias

---

## 🔗 Rutas añadidas

- `/es/dashboard/profile` — Página de perfil de usuario
- `/en/dashboard/profile` — User profile page
- `/es/dashboard/badges` — Página de logros
- `/en/dashboard/badges` — Achievements page

Recuerda añadir enlaces a estas páginas en el menú del dashboard o la barra de navegación.
