COCORICO APP — QA & THEME ORCHESTRATOR

# Este archivo es la FUENTE ÚNICA DE VERDAD para la IA de VSCode.

# SIEMPRE debes venir aquí antes de modificar nada relacionado con:

# - Arquitectura del proyecto

# - Modo claro / modo oscuro

# - Fondos de pantalla (wallpapers)

# - Estética "liquid glass / clear"

# - Navegación y páginas

# - Tests funcionales y visuales

IA DE VSCODE:

1. SIEMPRE que el usuario te pida cambios en Cocorico App,
   ANTES de tocar archivos:

   - Abre este archivo.
   - Léelo entero.
   - Úsalo como checklist.
   - Si añades nuevas pruebas, nuevos requisitos o nuevas páginas,
     ACTUALIZA este archivo.

2. NUNCA asumas que sabes cómo debe ser la UI de Cocorico sin revisar este documento.

====================================================================
A) ARQUITECTURA GENERAL DEL PROYECTO (RUTAS QUE DEBEN EXISTIR)
====================================================================

- `/scanner` → Cocorico Scan (scanner + resumen historial)
- `/scanner/history` → Historial de Scanner
- `/favorites` → Favoritos
- `/community` → Comunidad (hub social)
- `/community/feed` → Feed de recetas compartidas
- `/community/challenges` → Retos / Challenges
- `/community/chat` → Chat de usuarios
- `/premium` → Suscripción Premium

REGLAS:

- Si alguna ruta ya existe con otro nombre pero cumple la misma función,
  ADÁPTALA a esta estructura en lugar de crear duplicados.
- NO dejes `page.tsx` vacíos.
- NO dejes rutas huérfanas sin navegación visible.

====================================================================
B) SISTEMA DE TEMAS (MODO CLARO / MODO OSCURO)
====================================================================

El modo claro y el modo oscuro NO pueden ser iguales salvo por el color de la navbar.
Debes comprobar:

1. Que existe un sistema de tema global:

   - next-themes u otro provider.
   - Que se pueda detectar `theme === "light"` y `theme === "dark"`.

2. Que para CADA página:

   - El fondo (wallpaper) cambia entre imagen clara y oscura.
   - La paleta de colores de la UI cambia entre:
     - Claro: fondos más luminosos, texto oscuro donde toque.
     - Oscuro: fondos más oscuros, texto claro.

3. NO vale solo oscurecer la navbar:
   - El background de la app debe ser claramente diferente entre light y dark.
   - Verifica que los contenedores glass usan clases `dark:` cuando sea necesario.

CHECKLIST PARA CADA PÁGINA:

- ¿Usa `<Wallpaper imageLight="..." imageDark="..." />`?
- ¿El body / main tiene diferencias reales de color con `dark:`?
- ¿Los textos son legibles en ambos modos?
- ¿Botones y tarjetas tienen estilos distintos o adaptados para oscuro/claro?

====================================================================
C) WALLPAPERS (FONDOS) — CLARO/OSCURO + BLUR
====================================================================

TODOS los fondos están en: `/public/branding`.

NOMBRES (ejemplos, adaptar a los reales):

- HOME_MODO_CLARO / HOME_MODO_OSCURO
- MIS_RECETAS_MODO_CLARO / MIS_RECETAS_MODO_OSCURO
- CREAR_RECETA_MODO_CLARO / CREAR_RECETA_MODO_OSCURO
- EDITAR_RECETA_MODO_CLARO / EDITAR_RECETA_MODO_OSCURO
- RECETA_PUBLICA_MODO_CLARO / RECETA_PUBLICA_MODO_OSCURO
- SEARCH_MODO_CLARO / SEARCH_MODO_OSCURO
- LEARN_MODO_CLARO / LEARN_MODO_OSCURO
- PERFIL_MODO_CLARO / PERFIL_MODO_OSCURO
- LOGIN_MODO_CLARO / LOGIN_MODO_OSCURO
- SCAN_MODO_CLARO / SCAN_MODO_OSCURO
- HISTORIAL_MODO_CLARO / HISTORIAL_MODO_OSCURO
- FAVORITOS_MODO_CLARO / FAVORITOS_MODO_OSCURO
- COMUNIDAD_MODO_CLARO / COMUNIDAD_MODO_OSCURO
- FEED_MODO_CLARO / FEED_MODO_OSCURO
- RETOS_MODO_CLARO / RETOS_MODO_OSCURO
- CHAT_MODO_CLARO / CHAT_MODO_OSCURO
- PREMIUM_MODO_CLARO / PREMIUM_MODO_OSCURO

Para CADA página:

1. Debe usarse un componente reutilizable `<Wallpaper>`.
2. `<Wallpaper>` debe:
   - Elegir imagen según el tema (light/dark).
   - Renderizar un `div` que ocupe toda la pantalla:
     - `fixed inset-0 -z-10`
     - `bg-cover bg-center bg-no-repeat`
     - `filter blur-[6px] opacity-90` (difuminado suave SIEMPRE)
3. CADA `page.tsx` debe incluir, por ejemplo:

   ```tsx
   <Wallpaper
     imageLight="/branding/HOME_MODO_CLARO.jpg"
     imageDark="/branding/HOME_MODO_OSCURO.jpg"
   />
   ```

CHECKLIST:

- ¿Todas las páginas importantes usan `<Wallpaper>`?
- ¿Cada una tiene sus imágenes light/dark correctas?
- ¿Hay blur aplicado (no imágenes nítidas de fondo que distraigan)?
- ¿No hay páginas usando fondos estáticos sin tema?

====================================================================
D) ESTILO VISUAL "LIQUID GLASS / CLEAR"
====================================================================

La estética base de Cocorico es de paneles de vidrio translúcido (glassmorphism).

Debes asegurarte de:

1. Existe un componente base de glass (ej. `/components/ui/GlassCard.tsx`).
2. Estilo recomendado:
   - `bg-white/10 dark:bg-slate-900/40`
   - `backdrop-blur-xl`
   - `border border-white/20 dark:border-slate-700/60`
   - `rounded-3xl`
   - `shadow-[0_20px_60px_rgba(0,0,0,0.45)]`
   - `p-4 md:p-6`

Este componente se usa en:

- Home
- Dashboard / Mis Recetas
- Receta pública
- Scanner y Historial
- Comunidad, Feed, Retos, Chat
- Premium
- Formularios de Login / Register

NO dejes tarjetas sueltas con fondo opaco sólido si pueden ser glass.

CHECKLIST:

- ¿Los paneles principales usan GlassCard u otro contenedor glass?
- ¿Hay consistencia entre pantallas?
- ¿No hay pantalla que parezca “otra app distinta” visualmente?

====================================================================
E) NAVBAR, FOOTER Y NAVEGACIÓN
====================================================================

Para TODAS las páginas:

Debe existir:

1. Header / Navbar superior.
2. Footer con información legal.
3. Una forma clara de navegar a otra sección (nunca quedar atrapado).

En la navbar:

- “Scanner” debe tener un submenú con:
  - Scanner → `/scanner`
  - Historial → `/scanner/history`
- “Comunidad” debe tener submenú con:
  - Comunidad → `/community`
  - Feed → `/community/feed`
  - Retos → `/community/challenges`
  - Chat → `/community/chat`
- “Premium” → enlace directo a `/premium`.

CHECKLIST:

- ¿Hay alguna página que no muestre la navbar / footer? (excepto API o casos especiales)
- ¿El submenú Scanner y Comunidad funcionan en desktop y mobile?
- ¿En mobile, el usuario puede alcanzar todas las secciones?

====================================================================
F) TESTS FUNCIONALES BÁSICOS
====================================================================

Cada vez que hagas cambios importantes, debes revisar al menos:

Autenticación:

- Registro, login, logout.
- Acceso a páginas protegidas solo con sesión válida.

Recetas:

- Crear una receta.
- Editarla.
- Verla como pública (si la visibilidad lo permite).
- Buscar recetas en `/recipes/search`.

Scanner:

- Abrir `/scanner`.
- Ver el panel de scanner y un bloque de historial en la misma página.
- Ver `/scanner/history` con historial más completo.
- Asegurarte de que el UI se mantiene en estilo glass y con fondo correcto.

Comunidad:

- `/community` carga con resumen de feed, retos, chat.
- `/community/feed` lista recetas compartidas sin romper el layout.
- `/community/challenges` muestra tarjetas de retos (aunque los datos sean mock).
- `/community/chat` muestra layout de chat preparado (aunque no haya backend real todavía).

Premium:

- `/premium` muestra explicación de beneficios + CTA.

CHECKLIST:

- ¿Alguna ruta rompe en build o en navegación?
- ¿Hay estados de loading/empty que muestren panel glass en lugar de pantallas en blanco?

====================================================================
G) RESPONSIVE + ACCESIBILIDAD BÁSICA
====================================================================

RESPONSIVE:

- En móvil (ar 9:16), los fondos se ven bien.
- Los paneles glass no se salen horizontalmente (evitar overflow-x).
- La navbar es usable (hamburguesa, etc.).

ACCESIBILIDAD:

- Links y botones son `<a>` o `<button>`, no `<div>` clicables.
- El focus es visible (no eliminamos outline sin reemplazo).
- Las imágenes importantes tienen alt descriptivo.
- El contraste en modo oscuro/claro es razonable.

CHECKLIST:

- ¿Hay scroll horizontal inesperado?
- ¿Se puede navegar con teclado de forma básica?
- ¿Txt blanco sobre fondo casi blanco, o texto oscuro sobre fondo muy oscuro? Corregir.

====================================================================
H) PROCESO PARA CAMBIOS FUTUROS
====================================================================

IA DE VSCODE, SIEMPRE QUE:

- El usuario te pida una nueva página,
- Cambios de diseño,
- Nuevos fondos,
- Nuevos test,

DEBES:

1. Volver a este archivo.
2. Actualizar la lista de rutas, fondos o tests si es necesario.
3. Indicar (en comentarios o en una nueva sección) qué has añadido.
4. Usar este documento como checklist de QA ANTES de dar por finalizada cualquier tarea.

NO DES POR BUENO un cambio en modo claro/oscuro o fondos
si al revisar este archivo detectas que:

- no se está usando Wallpaper,
- no hay diferencia visual clara entre light y dark,
- o faltan rutas/páginas definidas aquí.

Este archivo es tu guía obligatoria.
