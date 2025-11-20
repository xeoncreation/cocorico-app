# 📚 Documentación Cocorico

Bienvenido al centro de documentación de **Cocorico** - Tu asistente de cocina con IA.

## 🗂️ Índice General

### 🚀 Configuración Inicial
- [**Instalación**](./setup/installation.md) - Cómo instalar y configurar el proyecto
- [**Variables de Entorno**](./setup/environment.md) - Configuración de `.env.local`
- [**Despliegue**](./setup/deployment.md) - Instrucciones para deployment en Vercel

### 🏗️ Arquitectura
- [**Visión General**](./architecture/overview.md) - Stack tecnológico y decisiones de diseño
- [**Base de Datos**](./architecture/database.md) - Esquema de Supabase y migraciones
- [**Rutas API**](./architecture/api-routes.md) - Endpoints y su funcionamiento

### ✨ Características
- [**Autenticación**](./features/authentication.md) - Sistema de auth con Supabase
- [**Chat IA**](./features/chat-ia.md) - Integración con OpenAI
- [**Recetas**](./features/recipes.md) - Sistema de recetas y favoritos
- [**Premium/Billing**](./features/premium.md) - Suscripciones con Stripe
- [**Internacionalización**](./features/i18n.md) - Sistema multi-idioma con next-intl
- [**PWA**](./features/pwa.md) - Progressive Web App con next-pwa
- [**Sistema de Diseño**](./features/design-system.md) - Glass effects y componentes UI

### 📦 Archivo Histórico
- [**Bloques de Desarrollo**](./archive/) - Documentación de sprints anteriores
- [**Checklists Completados**](./archive/) - Estados de implementación antiguos

---

## 🎯 Enlaces Rápidos

| Recurso | Descripción |
|---------|-------------|
| [README Principal](../README.md) | Introducción al proyecto y guía de inicio rápido |
| [Roadmap Técnico](./ROADMAP_TECNICO.md) | Planificación de features futuras |
| [Guía de Contribución](./CONTRIBUTING.md) | Cómo contribuir al proyecto |
| [Changelog](./CHANGELOG.md) | Historial de cambios y versiones |

---

## 🔍 ¿Qué documento necesitas?

### Para desarrolladores nuevos:
1. Lee el [README principal](../README.md) primero
2. Sigue la [guía de instalación](./setup/installation.md)
3. Configura tus [variables de entorno](./setup/environment.md)
4. Revisa la [arquitectura general](./architecture/overview.md)

### Para implementar features:
- **Auth**: [authentication.md](./features/authentication.md)
- **UI Components**: [design-system.md](./features/design-system.md)
- **API**: [api-routes.md](./architecture/api-routes.md)
- **Database**: [database.md](./architecture/database.md)

### Para deployment:
- **Producción**: [deployment.md](./setup/deployment.md)
- **Variables de entorno**: [environment.md](./setup/environment.md)

---

## 📝 Convenciones de Documentación

- ✅ **Completo y verificado**
- 🚧 **En progreso**
- ⚠️ **Necesita actualización**
- 📦 **Archivado** (histórico)

---

## 🤝 Contribuir a la Documentación

Si encuentras algo incorrecto o desactualizado:
1. Abre un issue describiendo el problema
2. O haz un PR con la corrección directamente
3. Mantén el tono claro y conciso
4. Incluye ejemplos de código cuando sea relevante

---

**Última actualización:** Noviembre 2025  
**Mantenido por:** Equipo Cocorico
