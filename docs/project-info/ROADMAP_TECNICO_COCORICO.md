# Roadmap Técnico Cocorico — Versión Beta

Objetivo: tener una beta visualmente potente, estable y lista para onboarding de usuarios reales.

## SPRINT 1 (1–2 semanas) — Núcleo UX y Visual

### 1.1. Visual System

- [ ] Revisar `globals.css` y asegurar:
  - `.glass-card`, `.glass-card-*` y `.glass-frosted-border` están definidos.
  - `RippleButton` está funcionando correctamente.
- [ ] Crear `/dev/ui-preview` (hecho por IA, solo integrar).
- [ ] Probar Free vs Premium desde `/dev/ui-preview`:
  - Cambiar `data-theme` a `free` y `premium`.
  - Confirmar que los colores y glass responden bien.

### 1.2. Onboarding básico

- [ ] Crear página `/[locale]/onboarding` con:
  - Paso 1: objetivo (aprender, ahorrar tiempo, reducir desperdicio).
  - Paso 2: preferencias de alimentación.
  - Paso 3: mini resumen de secciones.
- [ ] Guardar datos en `user_profiles` (nuevas columnas `goal` y `diet`).
- [ ] Redirigir primer login a `/onboarding`.

### 1.3. Learn v1

- [ ] Integrar `LearnClient` (ya generado).
- [ ] Crear tabla `learn_modules` y `module_progress` en Supabase.
- [ ] Vincular botón “Ver lección” a ruta `/[locale]/learn/[id]` (stub).
- [ ] Mostrar progreso básico en Learn usando `module_progress`.

---

## SPRINT 2 — Stats, Badges y Feedback sólido

### 2.1. Stats

- [ ] Crear API `/api/dashboard/stats` (ya generado).
- [ ] Ajustar `StatsClient` para consumir stats reales.
- [ ] Añadir gráfico con Recharts:
  - Recetas por mes.
  - Tiempo de cocina acumulado.

### 2.2. Badges

- [ ] Crear tablas:
  - `badges`
  - `user_badges`
- [ ] Lógica inicial:
  - Badge “Primeras 3 recetas”.
  - Badge “Cocinar 2h acumuladas”.
- [ ] Mostrar Badges en `/[locale]/dashboard/badges` con progreso visual.

### 2.3. Feedback

- [ ] Crear tabla `feedback_tickets` (ya generado SQL).
- [ ] Conectar `FeedbackForm` → `/api/feedback/new`.
- [ ] Conectar `FeedbackList` → `/api/feedback/list`.
- [ ] Revisar Storage `assets/feedback/` y políticas RLS.

---

## SPRINT 3 — Comunidad, Learn avanzado y Monetización

### 3.1. Community enfocada

- [ ] Confirmar tablas `community_posts` y `community_follows`.
- [ ] Ajustar Community Feed para:
  - Filtro “Trucos · Recetas · Organización”.
  - Enfatizar texto / valor, no solo foto.
- [ ] Añadir moderación mínima (report flag en tabla).

### 3.2. Learn avanzado

- [ ] Añadir vídeos reales desde Supabase Storage (o YouTube).
- [ ] Ligar completion de módulos a `user_badges`.
- [ ] Mostrar “Ruta recomendada” según `goal` y `diet`.

### 3.3. Monetización

- [ ] Revisar `/plans` y `/upgrade`.
- [ ] Probar Stripe en modo test (checkout + webhooks).
- [ ] Forzar plan `premium` para tu usuario desde `/admin/users` y validar:
  - Glass completo.
  - Contenido Premium desbloqueado.

---

## SPRINT 4 — Pulido, Legal y Beta cerrada

- [ ] Rellenar Términos, Privacidad y Cookies con texto legal real.
- [ ] Revisar accesibilidad básica (contraste, tamaños de fuente).
- [ ] Test de flows:
  - Registro → Onboarding → Primera receta.
  - Learn → completar módulos → ver badges.
  - Upgrade → Stripe → Glass Premium.
- [ ] Preparar lista de 20 testers para la beta.
