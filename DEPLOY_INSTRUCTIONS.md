# Instrucciones de Despliegue — Cocorico

## 📋 Resumen de Cambios

Esta actualización incluye:
- ✅ Badges system (tablas `badges`, `user_badges`)
- ✅ Learn system (tablas `learn_modules`, `module_progress`)
- ✅ Community comments (tabla `community_comments`)
- ✅ Onboarding page con goal/diet
- ✅ Community filters (tips/recipes/organization)
- ✅ Dev Dashboard mejorado con link cards
- ✅ 28 tests pasando (Jest)

---

## 🗄️ 1. SUPABASE — Ejecutar SQL Migration

### Opción A: Supabase Dashboard (Recomendado)

1. Abre tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **SQL Editor** (menú lateral izquierdo)
3. Crea una nueva query
4. Copia el contenido completo de `supabase/migration-combined.sql`
5. Pega y ejecuta (Run)
6. Verifica que se crearon las tablas:
   - `community_posts`
   - `community_follows`
   - `community_comments`
   - `badges`
   - `user_badges`
   - `learn_modules`
   - `module_progress`

### Opción B: Supabase CLI

```bash
# Si tienes Supabase CLI instalado
npx supabase db push --file ./supabase/migration-combined.sql
```

### Verificación en Supabase

- Ve a **Table Editor**
- Confirma que las tablas nuevas aparecen
- Revisa **Policies** (RLS) para cada tabla
- Verifica que `user_profiles` tenga columnas `goal` y `diet`

---

## 🚀 2. VERCEL — Deploy a Producción

### Variables de Entorno (Ya configuradas)

Verifica en Vercel Dashboard > Settings > Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dxhgpjrgvkxudetbmxuw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
ADMIN_SECRET=<tu-admin-secret>
SITE_PASSWORD=<opcional>
INVITE_PASSWORD=<opcional>
```

### Deploy Automático

```bash
# 1. Commit cambios locales
git add .
git commit -m "feat: add badges, learn, onboarding, community filters"

# 2. Push a main (Vercel despliega automáticamente)
git push origin main
```

### Deploy Manual (Opcional)

```bash
# Si prefieres forzar redeploy
npx vercel --prod
```

---

## ✅ 3. VERIFICACIÓN POST-DEPLOY

### Endpoints API a Probar

1. **Stats API**
   ```
   GET /api/dashboard/stats
   ```

2. **Badges API**
   ```
   GET /api/dashboard/badges
   ```

3. **Learn Modules API**
   ```
   GET /api/learn/modules
   POST /api/learn/progress
   ```

4. **Community Posts** (existente, ahora con comments count)
   ```
   GET /api/community/posts
   POST /api/community/posts
   ```

5. **Community Comments**
   ```
   GET /api/community/posts/[id]/comments
   POST /api/community/posts/[id]/comments
   ```

### Páginas a Verificar

- ✅ `/[locale]/onboarding` — 3 pasos (objetivo, dieta, resumen)
- ✅ `/[locale]/dashboard/badges` — Lista badges con SWR
- ✅ `/[locale]/community` — Feed con filtros (tips/recipes/organization)
- ✅ `/[locale]/learn` — Módulos y tabs
- ✅ `/dev/dashboard` — Link cards a ui-preview, stats, learn, etc.
- ✅ `/dev/ui-preview` — Theme switcher premium/free

### Tests Locales

```bash
# Ejecutar suite completa (28 tests)
npm test

# Verificar build producción
npm run build

# Server local
npm run dev:127
# Abrir http://127.0.0.1:3000
```

---

## 📊 4. POBLAR DATOS DE PRUEBA (Opcional)

### Insertar módulos de Learn

```sql
-- Ejecutar en Supabase SQL Editor
insert into public.learn_modules (slug, title, description, level, duration_minutes, video_url)
values
  ('fundamentos-cocina', 'Fundamentos de cocina', 'Técnicas básicas esenciales', 'basico', 15, null),
  ('organizacion-despensa', 'Organiza tu despensa', 'Reduce desperdicio y ahorra tiempo', 'intermedio', 12, null),
  ('planificacion-semanal', 'Planificación semanal', 'Crea menús balanceados', 'intermedio', 18, null)
on conflict (slug) do nothing;
```

### Asignar badges a tu usuario

```sql
-- Reemplaza <tu-user-id> con tu UUID de auth.users
insert into public.user_badges (user_id, badge_id)
select '<tu-user-id>', id from public.badges where code = 'first_3_recipes'
on conflict do nothing;
```

---

## 🔧 5. TROUBLESHOOTING

### Error: "relation badges does not exist"
- Ejecuta `supabase/migration-combined.sql` en SQL Editor
- Verifica en Table Editor que las tablas se crearon

### Error: "column goal does not exist"
- El script agrega `goal` y `diet` a `user_profiles`
- Si falla, ejecuta manualmente:
  ```sql
  alter table public.user_profiles add column goal text;
  alter table public.user_profiles add column diet text;
  ```

### Build error en Vercel
- Revisa logs: Vercel Dashboard > Deployments > [último deploy] > View Function Logs
- Verifica que todas las variables de entorno estén configuradas
- Comprueba que `npm run build` funciona localmente

### Tests fallan localmente
- Asegura que `.env.local` existe con variables de Supabase
- Ejecuta `npm install` para dependencias actualizadas
- Revisa `tests/setup-response-polyfill.ts` esté cargándose

---

## 📝 CHECKLIST FINAL

- [ ] SQL migration ejecutada en Supabase
- [ ] Tablas verificadas en Table Editor
- [ ] Variables de entorno configuradas en Vercel
- [ ] Push a `main` completado
- [ ] Deploy automático exitoso en Vercel
- [ ] Endpoints API responden correctamente
- [ ] Páginas nuevas cargan sin errores
- [ ] Tests locales pasando (28/28)
- [ ] Datos de prueba insertados (opcional)

---

## 🎯 SIGUIENTE PASO

Una vez desplegado, puedes:
1. Probar onboarding desde primer login
2. Crear posts en Community y filtrar por tipo
3. Completar módulos de Learn y verificar progreso
4. Ver stats dinámicas con datos reales
5. Desbloquear badges al alcanzar hitos

**Documentación adicional:**
- `ROADMAP_TECNICO_COCORICO.md` — Sprints y features pendientes
- `UX_IMPROVEMENTS_COCORICO.md` — Mejoras UX sugeridas
- `DEVELOPER-CONTROL.md` — Control de versiones dev

---

✨ **Listo para producción beta** ✨
