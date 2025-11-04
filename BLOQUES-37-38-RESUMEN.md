# ✅ Bloques 37-38 — Panel de Administración + Perfil Público

## 📦 Integración completada

### 🧱 BLOQUE 37 — Panel de administración (Admin Dashboard)

**Archivos SQL creados:**
- `supabase/sql/user_roles.sql`
  - Tabla `user_roles` con campo `role` ('user' | 'admin')
  - Trigger automático: asigna rol 'user' por defecto al registrarse
  - RPC `get_user_growth()`: obtiene crecimiento de usuarios por día
  - RLS: usuarios ven su rol; solo admins pueden modificar roles

**Utilidades:**
- `src/utils/authRole.ts`: isAdmin(userId), getUserRole(userId)

**Página de administración:**
- `/admin`
  - Protegida: solo accessible para usuarios con rol 'admin'
  - Métricas: total de usuarios, recetas y mensajes IA
  - Tabla de usuarios recientes (últimos 10)
  - Tabla de recetas recientes (últimas 10)
  - Mensaje de acceso denegado para no-admins

**Dependencias instaladas:**
- `recharts` v2.x — librería de gráficos para React

**Características:**
- Verificación de permisos con isAdmin()
- Redirect automático si no autenticado o no admin
- Diseño responsive con tarjetas métricas
- Enlaces directos a perfiles de usuarios y recetas
- RPC function `get_user_growth()` para futuros gráficos

---

### 🟨 BLOQUE 38 — Perfil público del usuario (/u/[username])

**Página pública:**
- `/u/[username]`
  - Ruta dinámica para perfiles públicos de cualquier usuario
  - SEO optimizado con generateMetadata (Open Graph)
  - Avatar, bio, nivel, experiencia, país
  - Barra de progreso al siguiente nivel
  - Grid de recetas públicas con preview de imagen
  - Grid de logros/insignias desbloqueadas

**Características:**
- 404 personalizado si el username no existe
- Solo muestra recetas con `visibility='public'`
- Diseño visual atractivo con hover effects
- Enlaces a las recetas del usuario
- Compatible con internacionalización

**Integración:**
- Añadido enlace al perfil público en `/dashboard/profile`
- Formato: `cocorico.app/u/{username}`
- Link en nueva pestaña con rel="noopener noreferrer"
- Mensaje explicativo: "Comparte este enlace para mostrar tus recetas y logros"

---

## ✅ Verificación completada

- **Build:** ✅ PASS
  - Ruta `/admin` generada
  - Ruta `/u/[username]` generada
  - Profile page actualizada con enlace público
- **Tests:** ✅ PASS (17/17 tests unitarios)
- **Servidor:** ✅ Ready en http://localhost:3000
- **Rutas verificadas:**
  - http://localhost:3000/admin (protegida, muestra acceso denegado si no admin)
  - Perfil público funcionará una vez haya usuarios con username

---

## 📋 Próximos pasos para activar estas funcionalidades

### 1. Ejecutar SQL en Supabase

Abre el SQL Editor y ejecuta:
```sql
-- Ejecutar supabase/sql/user_roles.sql
```

Este script crea:
- Tabla `user_roles`
- Trigger para asignar rol 'user' automáticamente
- RPC `get_user_growth()`
- Políticas RLS

### 2. Asignarte rol de admin

Una vez ejecutado el SQL:

1. Ve a Supabase > Table Editor > `user_roles`
2. Busca tu usuario (se creará automáticamente con rol 'user')
3. Edita la fila y cambia `role` a `'admin'`
4. Guarda los cambios

Alternativamente, desde SQL Editor:
```sql
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = 'tu-user-id-uuid';
```

### 3. Verificar acceso al panel

1. Visita http://localhost:3000/admin
2. Si NO eres admin → verás "⛔ Acceso denegado"
3. Si eres admin → verás el dashboard con métricas

### 4. Verificar perfil público

Requisitos:
- Usuario debe tener un `username` en `user_profiles`
- Visita `/u/{username}` para ver el perfil

Ejemplo de SQL para verificar tu username:
```sql
SELECT username FROM user_profiles WHERE user_id = auth.uid();
```

---

## 🎨 Características destacadas

### Panel de administración
- **Seguridad:** RLS estricta, solo admins tienen acceso
- **Métricas en tiempo real:** usuarios, recetas, mensajes IA
- **Tablas interactivas:** usuarios recientes con nivel/XP, recetas con estado de visibilidad
- **Extensible:** preparado para añadir gráficos con recharts (función RPC ya creada)
- **UX clara:** mensaje de acceso denegado para usuarios normales

### Perfil público
- **URLs amigables:** `/u/carlitos` en vez de `/user/uuid-largo`
- **SEO completo:** Open Graph tags, meta description personalizada
- **Diseño atractivo:** cards con hover effects, barra de progreso nivel
- **Social proof:** muestra logros públicamente
- **Fomenta comunidad:** fácil de compartir

---

## 🔗 Rutas añadidas

- `/admin` — Panel de administración (solo admins)
- `/u/[username]` — Perfil público compartible

---

## 📊 Próximas mejoras sugeridas (opcionales)

### Para el panel de admin:
1. Añadir gráfico de crecimiento de usuarios con recharts:
```typescript
import { LineChart, Line, XAxis, YAxis } from "recharts";

async function UserGrowthChart() {
  const { data } = await (supabaseServer as any).rpc("get_user_growth");
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

2. Añadir tabla de suscripciones activas (Premium)
3. Añadir botones de moderación (eliminar recetas, suspender usuarios)
4. Logs de actividad del sistema

### Para el perfil público:
1. Botón "Seguir usuario" (tabla `user_follows`)
2. Estadísticas sociales (vistas de recetas, followers)
3. Badge de "Verificado" para ciertos usuarios
4. Filtros de recetas por categoría/dificultad

---

## 📚 Documentación actualizada

- `supabase/sql/README.md`: (pendiente) añadir `user_roles.sql` al orden de ejecución
- `README.md`: menciona nuevas rutas `/admin` y `/u/[username]`
- `.env.example`: no requiere nuevas variables

---

## ⚠️ Notas importantes

- **Primer admin:** Debes asignarlo manualmente en Supabase después de ejecutar el SQL
- **Username único:** La tabla `user_profiles` tiene constraint UNIQUE en `username`
- **Rechart
s instalado:** añadió 35 paquetes; 1 vulnerabilidad crítica reportada (revisar con `npm audit`)
- **RLS activa:** no olvides activarla en Supabase si creas tablas manualmente
- **Performance:** las queries en `/admin` son directas a tablas; para apps grandes, considera vistas materializadas o caché
