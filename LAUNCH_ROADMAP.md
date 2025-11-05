# 🚀 Roadmap de Lanzamiento — Cocorico

## 📋 Visión General

Cocorico se lanzará en **3 fases progresivas** para validar producto, recoger feedback y escalar de forma controlada.

### Timeline estimado
- **Fase 1 (Beta Privada)**: 2-4 semanas
- **Fase 2 (Beta Abierta)**: 4-8 semanas
- **Fase 3 (Lanzamiento Público)**: A partir de semana 12

---

## 🔐 FASE 1: Beta Privada (20-50 testers)

### Objetivo
Validar funcionalidad core, detectar bugs críticos, pulir UX con usuarios reales.

### Configuración
- ✅ **SITE_PASSWORD** activo (bloquea acceso público)
- ✅ **INVITE_PASSWORD** para testers seleccionados (`?key=tester2025`)
- ✅ **Stripe en modo test** (no cobrar dinero real todavía)
- ✅ **Umami Analytics** activado para métricas

### Criterios de entrada
- [x] Todas las features de Bloques 52-56 implementadas
- [x] Páginas legales (`/legal/privacy`, `/legal/terms`, `/legal/cookies`)
- [x] RLS activo en todas las tablas
- [x] Checklist de seguridad completado (mínimo 80%)
- [x] 0 errores TypeScript en build

### Actividades
1. **Reclutamiento**:
   - 10-15 familiares/amigos (feedback honesto)
   - 5-10 chefs/cocineros aficionados (poder de uso)
   - 5 usuarios técnicos (probar límites de la app)

2. **Onboarding**:
   - Email de bienvenida con enlace + SITE_PASSWORD
   - O enlace directo con `?key=INVITE_PASSWORD`
   - Tutorial in-app (modal de 3 pasos)

3. **Recopilación de feedback**:
   - Formulario en `/dashboard/feedback`
   - Email directo a `feedback@cocorico.app`
   - Sesiones 1-on-1 (15 min con 5-10 usuarios)

4. **Métricas clave** (Umami):
   - % usuarios que completan onboarding
   - Tiempo promedio en la app
   - Features más usadas (chat, recetas, escáner)
   - % usuarios que vuelven al día siguiente (retention D1)

### Criterios de salida (pasar a Fase 2)
- [ ] 0 bugs críticos (crash, pérdida de datos)
- [ ] Máximo 3 bugs high priority sin resolver
- [ ] 70% de testers completan onboarding
- [ ] 40% retention D1 (vuelven al día siguiente)
- [ ] Feedback mayormente positivo (8/10 o superior)
- [ ] Stripe webhooks probados y funcionando

### Duración
**2-4 semanas**

---

## 🌐 FASE 2: Beta Abierta (100-500 usuarios)

### Objetivo
Escalar usuarios, validar capacidad de servidores, probar monetización con Premium, refinar SEO.

### Configuración
- 🔓 **SITE_PASSWORD desactivado** (quitar de .env en Vercel)
- ✅ **INVITE_PASSWORD** opcional (solo para features beta avanzadas)
- ✅ **Stripe en modo LIVE** (cobrar suscripciones reales)
- ✅ **Email verification** habilitado en Supabase (evitar bots)
- ✅ **Uptime monitoring** (UptimeRobot ping cada 5 min)

### Criterios de entrada
- [ ] Todos los criterios de salida de Fase 1 cumplidos
- [ ] Stripe configurado con claves LIVE
- [ ] Producto Premium creado en Stripe con precio 4,99 €/mes
- [ ] Webhook en Stripe apuntando a `https://cocorico-app.vercel.app/api/stripe/webhook`
- [ ] Landing page mejorada (`/` con hero, features, pricing, testimonios)
- [ ] SEO básico: `robots.txt`, `sitemap.xml`, meta tags

### Actividades
1. **Marketing inicial**:
   - Post en redes sociales (Twitter, LinkedIn, Instagram)
   - Compartir en comunidades de cocina (Reddit r/Cooking, grupos FB)
   - Email a lista de espera (si existe)
   - Outreach a micro-influencers culinarios

2. **Onboarding optimizado**:
   - Tutorial interactivo pulido
   - Email de bienvenida automático (Resend)
   - Serie de emails D3, D7, D14 (tips, retos, features)

3. **Monetización**:
   - Activar página `/pricing` con plan Free vs Premium
   - Mostrar límites en `/dashboard` (10 chats restantes, etc.)
   - CTA para upgrade en momentos clave

4. **Soporte**:
   - FAQ en `/help` o `/faq`
   - Email de soporte: `soporte@cocorico.app`
   - Responder en 24-48h

5. **Métricas clave**:
   - Usuarios activos diarios (DAU)
   - Tasa de conversión Free → Premium (target: 5-10%)
   - Churn rate (cancelaciones/mes)
   - LTV (Lifetime Value): ingresos por usuario
   - Costes: OpenAI + Replicate + ElevenLabs
   - Margen: Ingresos - Costes (target: > 50%)

### Criterios de salida (pasar a Fase 3)
- [ ] 200+ usuarios activos
- [ ] 10+ suscriptores Premium
- [ ] Tasa de conversión Free→Premium > 3%
- [ ] Churn < 10%/mes
- [ ] Costes sostenibles (margen > 40%)
- [ ] 0 incidentes de seguridad
- [ ] Uptime > 99.5%
- [ ] Feedback positivo constante

### Duración
**4-8 semanas**

---

## 🎯 FASE 3: Lanzamiento Público (1000+ usuarios)

### Objetivo
Crecer de forma escalable, optimizar SEO, lanzar features avanzadas, colaboraciones.

### Configuración
- 🌍 **Acceso público total**
- 🚀 **Plan Pro de Vercel** (si se supera hobby limits)
- 🗄️ **Plan Pro de Supabase** (si se supera free tier)
- 📧 **Email marketing activo** (Resend/SendGrid)
- 📊 **Sentry** para error tracking en producción

### Actividades
1. **SEO & Content**:
   - Blog de recetas (`/blog` o `/recetas`)
   - Artículos SEO: "Recetas con IA", "Cómo identificar ingredientes", etc.
   - Schema.org markup para recetas (Google Rich Snippets)
   - Backlinks desde blogs de cocina

2. **Marketing Avanzado**:
   - Ads en Google/Facebook (presupuesto inicial: 100-300 €/mes)
   - Colaboraciones con chefs, nutricionistas
   - Micro-influencers (intercambio: Premium gratis por review)
   - Product Hunt launch

3. **Features Avanzadas**:
   - Planes semanales de comida
   - Lista de la compra generada automáticamente
   - Integraciones: Notion, Google Calendar
   - API pública para partners

4. **Comunidad**:
   - Retos semanales con premios
   - Leaderboard global
   - Concursos de recetas
   - Newsletter quincenal

5. **Optimización**:
   - A/B testing en landing (hero, pricing, CTAs)
   - Reducir tiempo de carga < 2s
   - Optimizar costes de IA (caché de respuestas frecuentes)
   - Negociar descuentos con OpenAI/Replicate

### Métricas clave
- **Growth rate**: +20% usuarios/mes
- **MRR** (Monthly Recurring Revenue): > 500 €
- **CAC** (Customer Acquisition Cost): < 10 €
- **LTV/CAC ratio**: > 3x
- **NPS** (Net Promoter Score): > 50
- **Uptime**: > 99.9%

### Criterios de éxito (6-12 meses)
- [ ] 5000+ usuarios registrados
- [ ] 200+ suscriptores Premium
- [ ] 1000 €/mes de ingresos recurrentes
- [ ] Featured en Product Hunt, TechCrunch, o similar
- [ ] Asociación con al menos 1 chef/influencer conocido
- [ ] Rentable (ingresos > costes + salario parcial)

---

## 🔄 Iteración Continua

Después de Fase 3, Cocorico entra en modo **"Always Beta"**:
- Releases semanales con mejoras
- Feedback loop constante con comunidad
- Experimentación con nuevas features (A/B tests)
- Expansión a otros idiomas (FR, IT, PT, DE)
- Mobile apps nativas (Expo build completo)

---

## 📊 Dashboard de Métricas (Recomendado)

### Herramientas
- **Umami**: Tráfico, eventos custom
- **Stripe Dashboard**: MRR, churn, conversiones
- **Supabase Logs**: Queries lentas, errores
- **Vercel Analytics**: Performance, edge hits
- **Sentry**: Errores en producción

### KPIs a trackear
| Métrica | Beta Privada | Beta Abierta | Público |
|---------|--------------|--------------|---------|
| Usuarios activos | 20-50 | 100-500 | 1000+ |
| Retention D1 | 40% | 50% | 60% |
| Retention D7 | 20% | 30% | 40% |
| Free→Premium | n/a | 3-5% | 5-10% |
| Churn/mes | n/a | < 10% | < 5% |
| MRR | 0 € | 50-200 € | 500+ € |
| Uptime | 99% | 99.5% | 99.9% |

---

## 🚨 Plan de Contingencia

### Si algo sale mal

**Escenario 1: Bug crítico en producción**
1. Revertir deploy anterior en Vercel (1-click rollback)
2. Notificar usuarios vía email/banner in-app
3. Hotfix en branch `hotfix/critical-bug`
4. Deploy y verificar
5. Post-mortem: ¿cómo prevenir?

**Escenario 2: Costes de IA explotan**
1. Activar rate limits más agresivos temporalmente
2. Caché de respuestas frecuentes
3. Reducir quality de visión (usar GPT-4o-mini en vez de GPT-4)
4. Comunicar a usuarios Premium que habrá cambios temporales

**Escenario 3: Baja conversión Free→Premium**
1. Encuesta a usuarios: ¿por qué no pagas?
2. A/B test de precios (3,99 € vs 4,99 €)
3. Trial de 7 días gratis
4. Mejorar value proposition en `/pricing`

**Escenario 4: Feedback negativo masivo**
1. Escuchar activamente (no defender)
2. Priorizar fix de top 3 quejas
3. Comunicar roadmap de mejoras
4. Ofrecer compensación (mes gratis) si es grave

---

## ✅ Checklist de Lanzamiento (Pre-Fase 1)

- [x] Bloques 52-56 implementados
- [x] Páginas legales completas
- [x] Analytics (Umami) configurado
- [x] Feedback form funcional
- [x] Onboarding modal listo
- [x] Security checklist > 80%
- [ ] Migración `beta_feedback` aplicada en Supabase
- [ ] SITE_PASSWORD configurado en Vercel
- [ ] Email de bienvenida escrito (o template)
- [ ] 10 testers confirmados para Fase 1
- [ ] Build de producción sin errores (`npm run build`)
- [ ] Deploy en Vercel exitoso
- [ ] Probar flow completo end-to-end

---

**Fecha de inicio planificada**: Por definir  
**Responsable**: Equipo Cocorico  
**Contacto**: dev@cocorico.app

---

🍳 **¡A cocinar un gran lanzamiento!**
