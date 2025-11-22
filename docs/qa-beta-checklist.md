# 🧪 Checklist de QA - Beta de Cocorico App

> **Última actualización:** 20 de noviembre de 2025  
> **Objetivo:** Validar las funcionalidades principales antes del lanzamiento de la beta pública.

---

## 📋 ÍNDICE

1. [Autenticación y Gestión de Usuarios](#1-autenticación-y-gestión-de-usuarios)
2. [Gestión de Recetas](#2-gestión-de-recetas)
3. [Búsqueda y Filtros](#3-búsqueda-y-filtros)
4. [Visibilidad Pública/Privada](#4-visibilidad-públicaprivada)
5. [Sugerencias con IA](#5-sugerencias-con-ia)
6. [Navegación y UI](#6-navegación-y-ui)
7. [Rendimiento y Compatibilidad](#7-rendimiento-y-compatibilidad)

---

## 1. Autenticación y Gestión de Usuarios

### 1.1 Registro de Usuario
- [ ] **Paso 1:** Ir a la página de registro (`/signup`)
- [ ] **Paso 2:** Completar el formulario con:
  - Email válido
  - Contraseña (mínimo 6 caracteres)
  - Confirmación de contraseña
- [ ] **Paso 3:** Hacer clic en "Registrarse"
- [ ] **Resultado esperado:** 
  - Usuario creado exitosamente
  - Redirección al dashboard o página de bienvenida
  - Sesión iniciada automáticamente

**Casos de prueba adicionales:**
- [ ] Intentar registrarse con un email ya existente
- [ ] Intentar registrarse con contraseñas que no coinciden
- [ ] Intentar registrarse con email inválido (sin @, etc.)

---

### 1.2 Inicio de Sesión (Login)
- [ ] **Paso 1:** Ir a la página de login (`/login`)
- [ ] **Paso 2:** Ingresar credenciales válidas (email y contraseña)
- [ ] **Paso 3:** Hacer clic en "Iniciar sesión"
- [ ] **Resultado esperado:**
  - Sesión iniciada correctamente
  - Redirección al dashboard o página principal
  - Botón de perfil visible en navbar

**Casos de prueba adicionales:**
- [ ] Intentar login con credenciales incorrectas
- [ ] Intentar login con email no registrado
- [ ] Probar "Magic Link" (enlace de acceso por email sin contraseña)
- [ ] Verificar que la sesión persista después de recargar la página

---

### 1.3 Recuperación de Contraseña
- [ ] **Paso 1:** Desde `/login`, hacer clic en "¿Olvidaste tu contraseña?"
- [ ] **Paso 2:** Ingresar el email registrado
- [ ] **Paso 3:** Hacer clic en "Enviar enlace de recuperación"
- [ ] **Resultado esperado:**
  - Email de recuperación enviado correctamente
  - Enlace en el email redirige a página de cambio de contraseña
  - Usuario puede establecer nueva contraseña
  - Nueva contraseña funciona para login

**Casos de prueba adicionales:**
- [ ] Intentar recuperación con email no registrado
- [ ] Verificar que el enlace expire después de cierto tiempo

---

### 1.4 Cierre de Sesión (Logout)
- [ ] **Paso 1:** Con sesión iniciada, ir al menú de usuario
- [ ] **Paso 2:** Hacer clic en "Cerrar sesión"
- [ ] **Resultado esperado:**
  - Sesión cerrada correctamente
  - Redirección a página de inicio o login
  - Intentar acceder a rutas protegidas redirige a login

---

### 1.5 Perfil de Usuario
- [ ] **Paso 1:** Ir a `/dashboard/profile`
- [ ] **Paso 2:** Editar información del perfil:
  - Nombre de usuario
  - Foto de perfil
  - Configuración de privacidad
- [ ] **Paso 3:** Guardar cambios
- [ ] **Resultado esperado:**
  - Cambios guardados correctamente
  - Información actualizada visible en el perfil
  - Foto de perfil actualizada en navbar

---

## 2. Gestión de Recetas

### 2.1 Crear Nueva Receta
- [ ] **Paso 1:** Con sesión iniciada, ir a "Crear receta" (`/dashboard/new`)
- [ ] **Paso 2:** Completar el formulario:
  - Título de la receta
  - Descripción
  - Ingredientes (lista)
  - Pasos de preparación
  - Tiempo de preparación (minutos)
  - Dificultad (fácil, media, difícil)
  - URL de imagen (opcional)
  - Visibilidad (pública/privada)
- [ ] **Paso 3:** Hacer clic en "Guardar receta"
- [ ] **Resultado esperado:**
  - Receta creada exitosamente
  - Visible en lista de "Mis recetas"
  - Slug generado automáticamente

**Casos de prueba adicionales:**
- [ ] Crear receta con campos mínimos obligatorios
- [ ] Crear receta con todos los campos opcionales
- [ ] Verificar validación de campos requeridos

---

### 2.2 Limpiar Receta con IA
- [ ] **Paso 1:** Al crear o editar una receta, escribir contenido desestructurado
- [ ] **Paso 2:** Hacer clic en "Limpiar con IA" o similar
- [ ] **Resultado esperado:**
  - IA organiza el contenido en formato estructurado
  - Ingredientes separados correctamente
  - Pasos numerados y claros
  - Información de tiempo y dificultad sugerida

**Casos de prueba adicionales:**
- [ ] Probar con receta muy corta (1-2 líneas)
- [ ] Probar con receta muy larga (párrafos extensos)
- [ ] Probar con receta en diferentes idiomas (español/inglés)

---

### 2.3 Editar Receta Existente
- [ ] **Paso 1:** Ir a lista de recetas (`/recipes` o `/dashboard`)
- [ ] **Paso 2:** Seleccionar una receta propia y hacer clic en "Editar"
- [ ] **Paso 3:** Modificar campos (título, ingredientes, etc.)
- [ ] **Paso 4:** Guardar cambios
- [ ] **Resultado esperado:**
  - Cambios guardados correctamente
  - Receta actualizada visible en detalle
  - Fecha de actualización reflejada

**Casos de prueba adicionales:**
- [ ] Intentar editar receta de otro usuario (debe denegar acceso)
- [ ] Editar y cancelar sin guardar (cambios no deben aplicarse)

---

### 2.4 Eliminar Receta
- [ ] **Paso 1:** Ir a lista de recetas propias
- [ ] **Paso 2:** Seleccionar una receta y hacer clic en "Eliminar"
- [ ] **Paso 3:** Confirmar eliminación en diálogo de confirmación
- [ ] **Resultado esperado:**
  - Receta eliminada de la lista
  - Ya no accesible por URL directa
  - Confirmación visual de eliminación

**Casos de prueba adicionales:**
- [ ] Cancelar eliminación (receta debe permanecer)
- [ ] Intentar acceder a receta eliminada por URL (404)

---

### 2.5 Ver Detalle de Receta
- [ ] **Paso 1:** Hacer clic en una receta desde el feed o lista
- [ ] **Paso 2:** Visualizar página de detalle (`/recipes/[id]`)
- [ ] **Resultado esperado:**
  - Título, descripción, imagen visible
  - Lista de ingredientes formateada
  - Pasos de preparación numerados
  - Información de tiempo y dificultad
  - Botones de acción (favorito, compartir, editar si es propia)

---

## 3. Búsqueda y Filtros

### 3.1 Búsqueda de Recetas por Texto
- [ ] **Paso 1:** Ir a página de búsqueda (`/search` o `/recipes/search`)
- [ ] **Paso 2:** Ingresar término de búsqueda (ej: "pasta")
- [ ] **Paso 3:** Presionar Enter o hacer clic en "Buscar"
- [ ] **Resultado esperado:**
  - Resultados filtrados por título/descripción
  - Número de resultados encontrados visible
  - Tarjetas de recetas con vista previa

**Casos de prueba adicionales:**
- [ ] Buscar término sin resultados (mostrar mensaje apropiado)
- [ ] Buscar con caracteres especiales
- [ ] Buscar en español e inglés

---

### 3.2 Filtros Avanzados
- [ ] **Paso 1:** En página de búsqueda, abrir panel de filtros
- [ ] **Paso 2:** Aplicar filtros:
  - **Tiempo máximo:** 30 min, 60 min, etc.
  - **Dificultad:** Fácil, media, difícil
  - **Dieta:** Vegetariana, vegana, sin gluten, etc.
  - **Ingredientes específicos:** "pollo", "arroz", etc.
- [ ] **Paso 3:** Aplicar filtros
- [ ] **Resultado esperado:**
  - Resultados actualizados según filtros
  - Filtros activos visibles (badges o indicadores)
  - Opción de limpiar filtros

**Casos de prueba adicionales:**
- [ ] Aplicar múltiples filtros simultáneamente
- [ ] Verificar que filtros persistan en URL (para compartir)
- [ ] Limpiar un filtro individual

---

### 3.3 Ordenamiento de Resultados
- [ ] **Paso 1:** En resultados de búsqueda, seleccionar orden:
  - Relevancia
  - Más recientes
  - Más populares (favoritos)
- [ ] **Resultado esperado:**
  - Resultados reordenados correctamente
  - Indicador visual del orden activo

---

### 3.4 Paginación
- [ ] **Paso 1:** Realizar búsqueda con muchos resultados
- [ ] **Paso 2:** Navegar a página 2, 3, etc.
- [ ] **Resultado esperado:**
  - Resultados cambian por página
  - Número de página actual visible
  - Botones de navegación funcionales

---

## 4. Visibilidad Pública/Privada

### 4.1 Cambiar Visibilidad de Receta
- [ ] **Paso 1:** Editar una receta propia
- [ ] **Paso 2:** Cambiar visibilidad de "Privada" a "Pública" (o viceversa)
- [ ] **Paso 3:** Guardar cambios
- [ ] **Resultado esperado:**
  - Visibilidad actualizada correctamente
  - Badge de visibilidad actualizado en lista

---

### 4.2 Ver Receta Pública sin Login
- [ ] **Paso 1:** Cerrar sesión (logout)
- [ ] **Paso 2:** Navegar a URL de receta pública (ej: `/r/public/[slug]`)
- [ ] **Resultado esperado:**
  - Receta visible sin necesidad de login
  - Información completa accesible
  - Botones de acción limitados (no editar, solo ver)

**Casos de prueba adicionales:**
- [ ] Intentar acceder a receta privada sin login (debe denegar acceso)
- [ ] Intentar acceder a receta privada de otro usuario (debe denegar acceso)

---

### 4.3 Feed Público de Recetas
- [ ] **Paso 1:** Ir a feed público (`/recipes` o similar)
- [ ] **Resultado esperado:**
  - Solo recetas públicas visibles
  - Recetas privadas no aparecen
  - Filtros y búsqueda funcionan solo en públicas

---

## 5. Sugerencias con IA

### 5.1 Sugerencias de Recetas por Ingredientes
- [ ] **Paso 1:** Ir a sección de sugerencias IA
- [ ] **Paso 2:** Ingresar ingredientes disponibles (ej: "pollo, arroz, cebolla")
- [ ] **Paso 3:** Solicitar sugerencias
- [ ] **Resultado esperado:**
  - IA sugiere 2-3 recetas posibles
  - Recetas coherentes con ingredientes ingresados
  - Opción de guardar sugerencia como receta

**Casos de prueba adicionales:**
- [ ] Probar con 1 solo ingrediente
- [ ] Probar con 10+ ingredientes
- [ ] Probar con ingredientes poco comunes

---

### 5.2 Chat con Asistente IA
- [ ] **Paso 1:** Ir a página de chat (`/chat`)
- [ ] **Paso 2:** Hacer preguntas culinarias al asistente:
  - "¿Cómo cocino arroz perfecto?"
  - "Sustitutos para huevo en repostería"
  - "Tiempo de cocción de pasta"
- [ ] **Resultado esperado:**
  - Respuestas coherentes y útiles
  - Formato legible (markdown, listas)
  - Histórico de conversación visible

---

### 5.3 Análisis de Imagen de Ingredientes
- [ ] **Paso 1:** Subir foto de ingredientes o nevera
- [ ] **Paso 2:** IA analiza la imagen
- [ ] **Resultado esperado:**
  - IA identifica ingredientes en la foto
  - Sugiere recetas basadas en ingredientes detectados

---

## 6. Navegación y UI

### 6.1 Navegación Principal
- [ ] Verificar que todos los enlaces del navbar funcionen:
  - [ ] Inicio
  - [ ] Buscar recetas
  - [ ] Mis recetas
  - [ ] Comunidad
  - [ ] Centro de aprendizaje
  - [ ] Perfil
- [ ] Verificar navegación en móvil (menú hamburguesa)

---

### 6.2 Responsive Design
- [ ] Probar en diferentes tamaños de pantalla:
  - [ ] Desktop (1920x1080)
  - [ ] Tablet (768x1024)
  - [ ] Móvil (375x667)
- [ ] Verificar que elementos se adapten correctamente
- [ ] Verificar que no haya overflow horizontal

---

### 6.3 Tema Claro/Oscuro
- [ ] Cambiar entre tema claro y oscuro
- [ ] Verificar que todos los componentes se vean correctamente
- [ ] Verificar que la preferencia se guarde (cookie)

---

### 6.4 Onboarding (Primera Visita)
- [ ] Limpiar cookies y visitar como usuario nuevo
- [ ] Verificar que el flujo de onboarding se muestre
- [ ] Completar pasos de onboarding
- [ ] Verificar que no se muestre en visitas posteriores

---

## 7. Rendimiento y Compatibilidad

### 7.1 Tiempo de Carga
- [ ] Medir tiempo de carga de página principal (< 3s)
- [ ] Medir tiempo de carga de búsqueda con filtros (< 2s)
- [ ] Verificar lazy loading de imágenes

---

### 7.2 Compatibilidad de Navegadores
- [ ] Probar en Chrome/Edge
- [ ] Probar en Firefox
- [ ] Probar en Safari (si disponible)
- [ ] Probar en navegador móvil

---

### 7.3 PWA (Progressive Web App)
- [ ] Verificar que se pueda "Agregar a pantalla de inicio"
- [ ] Probar offline (modo avión)
- [ ] Verificar que manifest.json esté correctamente configurado

---

### 7.4 SEO y Metadatos
- [ ] Verificar que páginas públicas tengan:
  - [ ] Título descriptivo
  - [ ] Meta description
  - [ ] Open Graph tags (preview en redes sociales)
  - [ ] Sitemap.xml generado

---

## 8. Seguridad

### 8.1 Protección de Rutas
- [ ] Intentar acceder a rutas protegidas sin login
- [ ] Verificar redirección a login
- [ ] Verificar que tras login se redirija a ruta original

---

### 8.2 Validación de Formularios
- [ ] Intentar enviar formularios vacíos
- [ ] Intentar enviar datos malformados
- [ ] Verificar mensajes de error apropiados

---

### 8.3 Rate Limiting / Protección contra Spam
- [ ] Intentar hacer múltiples requests rápidos a API
- [ ] Verificar que haya límite de requests por minuto

---

## 9. Integración de Pagos (si aplica)

### 9.1 Flujo de Suscripción Premium
- [ ] Ir a página de precios (`/pricing`)
- [ ] Seleccionar plan premium
- [ ] Completar checkout con Stripe
- [ ] Verificar que plan se active correctamente
- [ ] Verificar que funciones premium se desbloqueen

---

### 9.2 Gestión de Suscripción
- [ ] Ir a `/dashboard/billing`
- [ ] Verificar información de suscripción actual
- [ ] Probar cancelar suscripción
- [ ] Probar actualizar método de pago

---

## 10. Notificaciones y Feedback

### 10.1 Toasts y Mensajes
- [ ] Verificar que acciones muestren feedback visual:
  - [ ] Receta guardada
  - [ ] Error al guardar
  - [ ] Login exitoso
  - [ ] Logout exitoso

---

### 10.2 Badges y Logros
- [ ] Crear 5 recetas y verificar que se desbloquee badge
- [ ] Compartir receta pública y verificar logro
- [ ] Ir a `/dashboard/badges` y ver todos los logros

---

## 🎯 CRITERIOS DE ACEPTACIÓN PARA BETA

Para considerar la beta lista para lanzamiento, **todos** los siguientes items deben estar completos:

- [x] **Autenticación:** Registro, login, logout funcionan correctamente
- [ ] **Gestión de recetas:** Crear, editar, eliminar recetas funciona sin errores
- [ ] **Búsqueda:** Búsqueda por texto y filtros devuelven resultados correctos
- [ ] **Visibilidad:** Recetas públicas accesibles sin login, privadas protegidas
- [ ] **IA básica:** Al menos una función de IA (sugerencias o limpieza) funciona
- [ ] **UI responsive:** App funciona en móvil, tablet y desktop
- [ ] **Navegación:** Todos los enlaces principales funcionan
- [ ] **Rendimiento:** Páginas cargan en < 3 segundos
- [ ] **Seguridad:** Rutas protegidas, validación de formularios

---

## 📝 NOTAS Y OBSERVACIONES

_(Espacio para anotar bugs encontrados, mejoras sugeridas, etc.)_

**Bugs encontrados:**
- 

**Mejoras sugeridas:**
- 

**Pendientes para post-beta:**
- 

---

## ✅ CHECKLIST RÁPIDO FINAL

Antes de lanzar beta, verificar:

- [ ] No hay errores 500 en producción
- [ ] No hay console.errors críticos en navegador
- [ ] Variables de entorno están configuradas en Vercel
- [ ] Base de datos Supabase está en modo producción
- [ ] Stripe está en modo live (no test)
- [ ] Analytics configurado (Umami/Plausible)
- [ ] Sitemap y robots.txt generados
- [ ] Políticas de privacidad y términos publicados
- [ ] Email de soporte configurado
- [ ] Backups de base de datos configurados

---

**✨ ¡Listo para beta cuando todos los checks estén completos!**
