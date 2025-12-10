# 🐓 Emoji Oficial de Cocorico

## Descripción

Este es el emoji oficial de Cocorico, diseñado para ser la mascota reconocible de la aplicación. El diseño sigue un estilo kawaii-minimal que es adorable, profesional y optimizado para uso en interfaces móviles.

## Especificaciones de Diseño

### Estilo Visual
- **Tipo**: Kawaii-minimal con contornos definidos
- **Contorno**: Negro (#1A1A1A) de 2px
- **Sombreado**: Suave y sutil
- **Formato**: SVG vectorial limpio

### Personaje
- **Especie**: Pollito redondo estilizado
- **Forma del cuerpo**: Ovalado y muy redondo
- **Colores principales**:
  - Cuerpo superior: `#E36A4A` (naranja-rojizo)
  - Cuerpo medio: `#F0CC73` (amarillo dorado)
  - Cuerpo inferior: `#7FB28F` (verde suave)
  - Pico: `#F2A75D` (naranja claro)
  - Patas: `#D97941` (naranja oscuro)

### Características Especiales
- **Ojos**: Grandes y circulares en negro profundo con destello blanco para darle vida
- **Pico**: Mini triangulito que transmite ternura
- **Gorro de chef**: Simplificado estilo emoji, ligeramente ladeado hacia la derecha (#F4F0E6)
- **Plumas**: Patrón escalonado con 3 tonos degradados
- **Expresión**: Tierna curiosidad sin cejas para mantener el estilo adorable

## Archivos Generados

### SVG Original
- `public/branding/cocorico-official.svg` - Versión vectorial maestra

### PNG Generados
Todas las imágenes PNG tienen fondo transparente:

- `public/branding/cocorico-official.png` (512x512) - Versión principal
- `public/branding/cocorico-mascot.png` (512x512) - Alias para compatibilidad
- `public/branding/cocorico-avatar.png` (220x220) - Para avatares

### Iconos PWA
- `public/icons/icon-512.png` (512x512)
- `public/icons/icon-192.png` (192x192)
- `public/icons/maskable-512.png` (512x512)

### Variaciones de Estado de Ánimo
Todas ubicadas en `public/branding/cocorico/`:
- `default.png` - Expresión neutral por defecto
- `happy.png` - Cocorico feliz/emocionado
- `thinking.png` - Cocorico pensativo
- `chef.png` - Cocorico como chef
- `alert.png` - Cocorico alertando
- `cocorico-cooking.png` - Cocinando
- `cocorico-cutting.png` - Cortando ingredientes
- `cocorico-smiling.png` - Sonriendo
- `cocorico-washing.png` - Lavando

## Uso en la Aplicación

### En Componentes React
```tsx
import Image from "next/image";

<Image
  src="/branding/cocorico-official.png"
  alt="Cocorico"
  width={512}
  height={512}
/>
```

### Como Favicon
El emoji se utiliza automáticamente como:
- Favicon del navegador
- Icono de PWA (Progressive Web App)
- Icono de instalación en dispositivos móviles

### En Componentes Específicos
- **CocoricoMascot**: Usa variaciones de humor
- **CocoricoAvatar**: Avatar para chat de voz
- **Páginas**: Login, Dashboard, Community, Learn, etc.

## Optimización

### Formatos
- **SVG**: Ideal para escalado infinito sin pérdida de calidad
- **PNG**: Optimizado para renderizado rápido en diferentes tamaños

### Tamaños
- **512x512**: Tamaño estándar para iconos de alta resolución
- **220x220**: Tamaño optimizado para avatares en chat
- **192x192**: Tamaño mínimo requerido para PWA

### Compatibilidad
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Desktop Browsers (Chrome, Firefox, Safari, Edge)
- ✅ PWA Installation
- ✅ Chat Reactions
- ✅ Mobile UI

## Scripts de Generación

### Generar desde SVG a PNG
```bash
# Con ImageMagick instalado
.\scripts\generate-official-emoji.ps1

# Con Node.js y Sharp
node scripts\convert-emoji-svg-to-png.js
```

### Regenerar si se modifica el SVG
1. Edita `public/branding/cocorico-official.svg`
2. Ejecuta `node scripts\convert-emoji-svg-to-png.js`
3. Los PNG se actualizarán automáticamente

## Guía de Marca

### Cuándo Usar el Emoji Oficial
✅ **Usar en**:
- Iconos de aplicación
- Avatar del asistente de IA
- Páginas de bienvenida
- Elementos de UI principales
- Material de marketing
- Stickers y reacciones

❌ **No usar en**:
- Contenido generado por usuarios (usar avatares de usuario)
- Logos de terceros
- Contenido no relacionado con Cocorico

### Personalidad del Emoji
El emoji de Cocorico representa:
- **Amigabilidad**: Siempre acogedor y servicial
- **Expertise culinario**: Con su gorro de chef
- **Diversidad**: Los colores representan variedad de ingredientes
- **Optimismo**: Expresión curiosa y positiva

## Variaciones Futuras

Para crear nuevas expresiones o poses:
1. Duplica `cocorico-official.svg`
2. Modifica solo la expresión (ojos, pico, postura)
3. Mantén los colores y estilo base
4. Genera PNG con el script de conversión
5. Coloca en `public/branding/cocorico/[nombre].png`

## Créditos

- **Diseño**: Especificaciones de estilo kawaii-minimal
- **Generación**: SVG creado con especificaciones detalladas
- **Optimización**: Sharp y ImageMagick para conversión PNG

---

**Versión**: 1.0.0  
**Fecha de creación**: Diciembre 2024  
**Última actualización**: ${new Date().toLocaleDateString('es-ES')}
