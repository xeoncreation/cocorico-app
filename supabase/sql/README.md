# 📊 Scripts SQL de Supabase — Orden de Ejecución

Esta carpeta contiene los scripts SQL para configurar la base de datos de Cocorico en Supabase.

## 📋 Orden de ejecución

### 1. Migraciones base (si aún no las has aplicado)

Las migraciones en `supabase/migrations/` crean las tablas principales:
- `recipes` (recetas con contenido, visibilidad, slug único)
- `favorites` (favoritos de usuarios)
- `recipe_versions` (variaciones generadas por IA)
- `stats` (estadísticas de uso)
- `messages` (historial de chat)

Aplícalas en orden cronológico (por timestamp en el nombre del archivo).

### 2. Tablas de IA y límites — `ai_and_limits.sql`

Este script añade:

#### Tablas
- **`ai_profiles`**: perfil nutricional del usuario (dieta, objetivo, alergias, preferencias)
- **`ai_threads`**: hilos de conversación con la IA
- **`ai_messages`**: mensajes individuales en cada hilo (rol, contenido, timestamp)
- **`usage_quota`**: control de cuota diaria para usuarios gratuitos

#### Políticas RLS
- Usuarios solo pueden ver/editar sus propios perfiles, hilos y mensajes
- La cuota es de solo lectura para el usuario (se incrementa desde el backend)

#### RPC (Remote Procedure Call)
- **`increment_ai_usage(user_uuid)`**: incrementa el contador diario de uso de IA de forma atómica
  - Resetea automáticamente si es un nuevo día
  - Devuelve el nuevo total de mensajes del día

#### Uso típico
```sql
-- Llamar desde el backend para incrementar cuota:
SELECT increment_ai_usage('user-uuid-here');

-- Ver tu cuota actual:
SELECT * FROM usage_quota WHERE user_id = auth.uid();
```

### 3. Perfiles de usuario — `user_profiles.sql`

Este script añade:

#### Tabla
- **`user_profiles`**: perfil completo de cada usuario
  - `username`: nombre único del usuario
  - `avatar_url`: URL del avatar (subido a Supabase Storage)
  - `bio`: biografía
  - `language`: idioma preferido (`es`/`en`)
  - `country`: país
  - `experience`: puntos de experiencia acumulados
  - `level`: nivel calculado automáticamente (1 + floor(experience/100))

#### Trigger
- **`on_auth_user_created`**: crea automáticamente el perfil cuando un usuario se registra
  - El username inicial se toma del email (parte antes de @)

#### RPC
- **`add_xp(p_user uuid, p_amount int)`**: suma experiencia y recalcula el nivel
  - Ejemplo: crear receta → +10 XP, usar chat → +1 XP

#### Políticas RLS
- Usuarios solo pueden ver/editar su propio perfil

#### Uso típico
```sql
-- Ver tu perfil:
SELECT * FROM user_profiles WHERE user_id = auth.uid();

-- Añadir 10 XP (desde backend):
SELECT add_xp(auth.uid(), 10);
```

### 4. Sistema de insignias — `badges.sql`

Este script añade:

#### Tabla
- **`user_badges`**: insignias/logros desbloqueados por cada usuario
  - `badge_code`: código único de la insignia (ej: `first_recipe`, `chef_10`)
  - `badge_name`: nombre mostrado
  - `description`: descripción del logro
  - `icon_url`: URL del icono
  - `earned_at`: fecha de desbloqueo

#### RPC
- **`assign_badge(p_user uuid, p_code text)`**: asigna una insignia (evita duplicados)
  - Códigos predefinidos: `first_recipe`, `chef_10`, `ai_explorer`, `social_star`, `premium`

#### Políticas RLS
- Usuarios solo ven sus propias insignias

#### Uso típico
```sql
-- Ver tus insignias:
SELECT * FROM user_badges WHERE user_id = auth.uid();

-- Desbloquear insignia "primera receta":
SELECT assign_badge(auth.uid(), 'first_recipe');
```

### 5. Tabla de suscripciones Stripe — `stripe.sql`

Este script añade:

#### Tabla
- **`user_subscriptions`**: estado de la suscripción de cada usuario
  - `stripe_customer_id`: ID del cliente en Stripe
  - `stripe_subscription_id`: ID de la suscripción activa (si existe)
  - `plan`: `'free'` o `'pro'`
  - `status`: estado Stripe (`active`, `canceled`, `past_due`, etc.)
  - `current_period_end`: fecha de fin del periodo actual

#### Políticas RLS
- Usuarios pueden leer su propia suscripción
- Solo el service role puede escribir (el webhook de Stripe usa autenticación de servidor)

#### Uso típico
```sql
-- Ver tu plan actual:
SELECT plan, status, current_period_end 
FROM user_subscriptions 
WHERE user_id = auth.uid();

-- El backend actualiza esto vía webhook de Stripe
```

---

## 🔧 Cómo ejecutar estos scripts

1. Abre el **SQL Editor** en tu proyecto de Supabase
2. Copia y pega el contenido de cada archivo en orden:
   - `ai_and_limits.sql`
   - `user_profiles.sql`
   - `badges.sql`
   - `stripe.sql`
3. Ejecuta cada script
4. Verifica que las tablas aparezcan en la sección **Table Editor**

---

## ✅ Verificación rápida

Después de aplicar los scripts, puedes probar:

```sql
-- Ver todas las nuevas tablas:
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('ai_profiles', 'ai_threads', 'ai_messages', 'usage_quota', 'user_profiles', 'user_badges', 'user_subscriptions');

-- Probar la RPC de cuota (sustituye el UUID por el tuyo):
SELECT increment_ai_usage('tu-user-id-aqui');

-- Probar asignar una insignia:
SELECT assign_badge(auth.uid(), 'first_recipe');
```

---

## 🚨 Notas importantes

- **RLS está habilitado**: los usuarios solo ven sus propios datos
- **La cuota gratuita** está configurada en 10 mensajes/día (configurable en `src/utils/limits.ts`)
- **Stripe webhook** necesita el `STRIPE_WEBHOOK_SECRET` para validar eventos
- Si ya tienes usuarios en producción, estos scripts **no afectan** las tablas existentes

---

## 🔄 Rollback (si algo sale mal)

Para deshacer los cambios:

```sql
-- Eliminar tablas de IA y cuota:
DROP TABLE IF EXISTS ai_messages CASCADE;
DROP TABLE IF EXISTS ai_threads CASCADE;
DROP TABLE IF EXISTS ai_profiles CASCADE;
DROP TABLE IF EXISTS usage_quota CASCADE;
DROP FUNCTION IF EXISTS increment_ai_usage(uuid);

-- Eliminar perfiles y badges:
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP FUNCTION IF EXISTS assign_badge(uuid, text);
DROP FUNCTION IF EXISTS add_xp(uuid, int);
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user_profile();

-- Eliminar tabla de suscripciones:
DROP TABLE IF EXISTS user_subscriptions CASCADE;
```

---

## 📚 Recursos

- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [OpenAI Chat API](https://platform.openai.com/docs/guides/chat)
