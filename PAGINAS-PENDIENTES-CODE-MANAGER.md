# 📋 PÁGINAS QUE NECESITAN IMPLEMENTACIÓN - Code Manager

**Fecha:** 17 de Noviembre, 2025  
**Proyecto:** Cocorico App  
**Estado:** En desarrollo activo

---

## 🎯 PRIORIDAD ALTA - Páginas Básicas sin Contenido Real

### 1. **Search/Búsqueda de Recetas** (`/recipes/search`)
**Estado actual:** Formulario básico de búsqueda  
**Necesita:**
- [ ] Filtros avanzados (tiempo, dificultad, ingredientes, dieta)
- [ ] Resultados con paginación
- [ ] Ordenamiento (relevancia, fecha, popularidad)
- [ ] Vista previa de recetas en tarjetas
- [ ] Búsqueda por voz/imagen
- [ ] Sugerencias autocompletadas

**Archivo:** `src/app/recipes/search/page.tsx`  
**Componentes relacionados:** `src/components/search/SearchFilters.tsx`

---

### 2. **Learn/Aprender** (`/[locale]/learn`)
**Estado actual:** Página vacía o stub  
**Necesita:**
- [ ] Tutoriales en video embebidos
- [ ] Guías paso a paso (cocción, técnicas)
- [ ] Tips y trucos de cocina
- [ ] Glosario de términos culinarios
- [ ] Certificaciones/badges por completar lecciones
- [ ] Sección de recursos descargables

**Archivo:** `src/app/[locale]/learn/page.tsx`  
**Sugerencia:** Integrar con YouTube API o videos de Supabase Storage

---

### 3. **Stats/Estadísticas** (`/dashboard/stats`)
**Estado actual:** Página básica sin gráficos  
**Necesita:**
- [ ] Gráficos interactivos (Recharts ya instalado)
- [ ] Métricas de usuario:
  - Recetas creadas por mes
  - Recetas favoritas por categoría
  - Tiempo total de cocina
  - Logros desbloqueados
- [ ] Comparativas (tú vs comunidad)
- [ ] Exportar estadísticas a PDF/CSV

**Archivo:** `src/app/dashboard/stats/page.tsx`  
**Dependencias:** `recharts` (ya instalado)

---

### 4. **Badges/Logros** (`/[locale]/dashboard/badges`)
**Estado actual:** Lista básica de badges  
**Necesita:**
- [ ] Sistema de gamificación completo
- [ ] Badges desbloqueables:
  - Crear X recetas
  - Cocinar Y horas
  - Compartir recetas
  - Feedback de comunidad
- [ ] Progreso visual por badge
- [ ] Recompensas por logros (descuentos, features premium)
- [ ] Tabla de clasificación

**Archivo:** `src/app/[locale]/dashboard/badges/page.tsx`  
**Utils:** `src/utils/badges.ts`

---

### 5. **Feedback** (`/[locale]/dashboard/feedback`)
**Estado actual:** Formulario básico  
**Necesita:**
- [ ] Sistema de tickets/issues
- [ ] Historial de feedback enviado
- [ ] Estado de respuestas (pendiente, en progreso, resuelto)
- [ ] Votación de sugerencias
- [ ] Categorías (bug, feature, mejora)
- [ ] Adjuntar capturas de pantalla

**Archivo:** `src/app/[locale]/dashboard/feedback/page.tsx`

---

## 🔷 PRIORIDAD MEDIA - Páginas Funcionales que Requieren Expansión

### 6. **Plans/Pricing** (`/[locale]/plans`, `/upgrade`)
**Estado actual:** Página stub de planes  
**Necesita:**
- [ ] Tabla comparativa Free vs Premium
- [ ] Integración real con Stripe Checkout
- [ ] Testimonios de usuarios premium
- [ ] FAQ de suscripción
- [ ] Calculadora de ahorro
- [ ] Cupones/descuentos

**Archivos:**
- `src/app/[locale]/plans/page.tsx`
- `src/app/upgrade/page.tsx`

**API:** `src/app/api/billing/*` (ya configurado)

---

### 7. **Profile Settings** (`/[locale]/dashboard/profile`)
**Estado actual:** Formulario básico de perfil  
**Necesita:**
- [ ] Subida de avatar (Supabase Storage)
- [ ] Edición de bio y preferencias
- [ ] Configuración de privacidad
- [ ] Vincular redes sociales
- [ ] Historial de actividad
- [ ] Exportar datos (GDPR)

**Archivo:** `src/app/[locale]/dashboard/profile/page.tsx`

---

### 8. **Community Features** (`/[locale]/community/*`)
**Estado actual:** Posts básicos con likes/comments  
**Necesita:**
- [ ] Sistema de seguimiento de usuarios
- [ ] Notificaciones en tiempo real
- [ ] Feed personalizado (algoritmo)
- [ ] Hashtags y búsqueda social
- [ ] Moderación de contenido
- [ ] Reportar abuso

**Archivos:**
- `src/app/[locale]/community/page.tsx`
- `src/app/[locale]/community/[id]/page.tsx`
- `src/app/[locale]/community/new/page.tsx`

---

### 9. **Legal Pages** (`/[locale]/legal/*`)
**Estado actual:** Stubs con lorem ipsum  
**Necesita:**
- [ ] Términos y Condiciones completos
- [ ] Política de Privacidad (GDPR)
- [ ] Política de Cookies
- [ ] Aviso Legal
- [ ] Política de Reembolsos (Stripe)

**Archivos:**
- `src/app/[locale]/legal/terms/page.tsx`
- `src/app/[locale]/legal/privacy/page.tsx`
- `src/app/[locale]/legal/cookies/page.tsx`

**Nota:** Consultar con legal o usar generadores de políticas

---

## ✅ COMPLETADAS - No Requieren Trabajo (Referencia)

- ✅ **Home** (`/[locale]`) - Hero animado, CTAs, onboarding
- ✅ **Login/Signup** (`/login`, `/signup`) - Auth con magic link y password
- ✅ **Dashboard** (`/dashboard`) - Lista de recetas del usuario
- ✅ **Recipes** (`/recipes`) - Lista con auto-seed de demos
- ✅ **Recipe Detail** (`/recipes/[id]`) - Vista completa con favoritos
- ✅ **Recipe Edit** (`/recipes/[id]/edit`) - Editor completo
- ✅ **Admin Panel** (`/admin`) - Métricas, usuarios, recetas
- ✅ **Lab** (`/dashboard/lab`) - Scanner, SmartCamera, Avatar
- ✅ **Favorites** (`/dashboard/favorites`) - Lista de favoritos
- ✅ **Import** (`/dashboard/import`) - Importar desde URL/foto
- ✅ **Premium Pages** (`/premium`, `/free`, `/dev/premium-preview`) - Themed con glass effect
- ✅ **Settings** (`/settings`) - Configuración básica

---

## 🛠️ HERRAMIENTAS DE DESARROLLO

### Dev Dashboard (`/dev/dashboard`) - ✅ NUEVA
**Funciones:**
- Vista completa sin restricciones de plan
- Forzar temas (free/premium) vía cookie
- Acceso directo a todas las páginas
- Estado de health check
- Links a documentación

**Acceso:** http://localhost:3000/dev/dashboard (sin contraseña)

---

## 📊 RESUMEN EJECUTIVO

**Total de páginas:** 76+ archivos page.tsx  
**Completamente funcionales:** ~30 (40%)  
**Requieren expansión:** ~9 (12%)  
**Stubs/redirects:** ~37 (48%)

### Estimación de Esfuerzo

| Página | Prioridad | Esfuerzo | Complejidad |
|--------|-----------|----------|-------------|
| Search | Alta | 8h | Media |
| Learn | Alta | 16h | Alta |
| Stats | Alta | 12h | Media |
| Badges | Alta | 10h | Media |
| Feedback | Alta | 6h | Baja |
| Plans | Media | 8h | Media |
| Profile | Media | 6h | Baja |
| Community | Media | 20h | Alta |
| Legal | Media | 4h | Baja |

**Total estimado:** ~90 horas de desarrollo

---

## 🎯 RECOMENDACIONES

### Fase 1 (Sprint 1-2 semanas):
1. Search avanzada - Crítica para UX
2. Stats con gráficos - Engagement
3. Feedback completo - Quality loop

### Fase 2 (Sprint 2-3 semanas):
1. Badges/gamificación - Retención
2. Plans/Stripe - Monetización
3. Profile expandido - Personalización

### Fase 3 (Sprint 3-4 semanas):
1. Learn completo - Valor educativo
2. Community features - Social
3. Legal pages - Compliance

---

## 📝 NOTAS TÉCNICAS

### Stack Actual
- Next.js 14 (App Router)
- Supabase (Auth + DB + Storage)
- Tailwind CSS + shadcn/ui
- OpenAI + Replicate APIs
- Stripe (test mode)
- PWA enabled

### APIs Disponibles
- `/api/recipes/*` - CRUD recetas
- `/api/chat` - Chat IA
- `/api/ai/*` - Vision, Voice, generación
- `/api/billing/*` - Stripe checkout/webhooks
- `/api/admin/*` - Panel admin

### Librerías Útiles Ya Instaladas
- `recharts` - Gráficos
- `react-hook-form` + `zod` - Formularios
- `framer-motion` - Animaciones
- `lucide-react` - Iconos

---

**Última actualización:** 2025-11-17  
**Responsable:** Developer Team  
**Contacto:** [Tu email o Slack]
