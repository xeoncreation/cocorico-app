# 🎨 Generación de Iconos PWA para Cocorico

## Iconos Requeridos

Para que la PWA funcione correctamente, necesitas estos iconos en `public/icons/`:

```
public/icons/
├── icon-192.png      (192x192px, standard icon)
├── icon-512.png      (512x512px, high-res icon)
└── maskable-512.png  (512x512px, con safe zone para adaptive icons)
```

## Método 1: PWA Asset Generator (Recomendado) 🚀

### Opción A: Web (Sin instalación)

1. **Real Favicon Generator** (https://realfavicongenerator.net/)
   - Upload tu logo Cocorico (idealmente SVG o PNG >1024px)
   - Seleccionar "Android Chrome" options
   - Descargar package
   - Extraer archivos a `public/icons/`

2. **PWA Builder** (https://www.pwabuilder.com/imageGenerator)
   - Upload logo
   - Click "Generate"
   - Descargar ZIP
   - Copiar `icon-192.png`, `icon-512.png`, `maskable-512.png` a `public/icons/`

### Opción B: CLI

```bash
# Instalar globalmente
npm install -g pwa-asset-generator

# Generar iconos (desde raíz del proyecto)
pwa-asset-generator public/logo.svg public/icons --icon-only --type png

# Genera automáticamente:
# - icon-192.png
# - icon-512.png
# - maskable-512.png
```

## Método 2: Manual con ImageMagick 🛠️

### Windows (Scoop/Chocolatey)
```powershell
# Instalar ImageMagick
scoop install imagemagick
# O
choco install imagemagick

# Generar iconos desde logo fuente
magick logo-source.png -resize 192x192 public/icons/icon-192.png
magick logo-source.png -resize 512x512 public/icons/icon-512.png
```

### Maskable Icon (con padding)
```powershell
# Crear maskable con 20% padding (safe zone)
magick logo-source.png -resize 410x410 -gravity center -extent 512x512 -background transparent public/icons/maskable-512.png
```

## Método 3: Figma/Photoshop/GIMP 🎨

### Especificaciones Técnicas

#### icon-192.png
- **Tamaño**: 192x192 pixels
- **Formato**: PNG con transparencia
- **Contenido**: Logo completo, sin padding
- **Uso**: Menú de apps, pequeñas previews

#### icon-512.png
- **Tamaño**: 512x512 pixels
- **Formato**: PNG con transparencia
- **Contenido**: Logo completo, sin padding
- **Uso**: Splash screen, instalación

#### maskable-512.png
- **Tamaño**: 512x512 pixels
- **Formato**: PNG con transparencia
- **Safe Zone**: 80% central (410x410px)
- **Contenido**: Logo centrado con padding
- **Uso**: Adaptive icons en Android 8+

### Template Figma/Sketch

```
Crear 3 artboards:
1. 192x192 → Export as icon-192.png
2. 512x512 → Export as icon-512.png
3. 512x512 con guías:
   - Safe zone: círculo de 410px de diámetro centrado
   - Logo dentro del safe zone
   - Export as maskable-512.png
```

## Verificación de Iconos ✅

### Checklist Visual
- [ ] ✅ Fondo transparente (o color sólido de marca #E53935)
- [ ] ✅ Logo visible y centrado
- [ ] ✅ Colores correctos (paleta Cocorico)
- [ ] ✅ No pixelado (usar source de alta resolución)
- [ ] ✅ Maskable: logo dentro de safe zone

### Test con Maskable.app
1. Ir a https://maskable.app/editor
2. Upload `maskable-512.png`
3. Verificar que el logo se ve bien en todas las formas:
   - Círculo
   - Squircle
   - Cuadrado redondeado
   - Teardrop

### Test en Proyecto
```powershell
# Verificar que existen
ls public/icons/

# Debería mostrar:
# icon-192.png
# icon-512.png
# maskable-512.png

# Test en browser
npm run dev
# Chrome DevTools → Application → Manifest
# Verificar que los iconos se cargan correctamente
```

## Actualizar manifest.webmanifest

Después de generar los iconos, verificar que `public/manifest.webmanifest` los referencia:

```json
{
  "name": "Cocorico",
  "short_name": "Cocorico",
  "description": "Tu asistente inteligente de cocina 🐓",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFF8E1",
  "theme_color": "#E53935",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

## Troubleshooting 🔧

### "Icons not loading in DevTools"
```bash
# Clear cache
npm run clean
npm run dev

# Hard refresh en Chrome: Ctrl+Shift+R
# Verificar ruta: http://localhost:3000/icons/icon-192.png
```

### "Maskable icon looks cropped"
- Aumentar padding: reducir logo a 70% del canvas (358x358px en 512x512)
- Re-test en https://maskable.app/editor

### "Low quality/pixelated icons"
- Usar source de al menos 1024x1024px
- Exportar con calidad 100% (sin compresión)
- Usar formato PNG (no JPG)

## Recursos 📚

### Herramientas Online
- **Real Favicon Generator**: https://realfavicongenerator.net/
- **PWA Builder**: https://www.pwabuilder.com/imageGenerator
- **Maskable Editor**: https://maskable.app/editor
- **Icon Kitchen**: https://icon.kitchen/

### Assets de Marca (si necesitas crear logo)
```
Paleta Cocorico:
- Yellow: #FDD835
- Orange: #FF6F00
- Red: #E53935
- Green: #4CAF50
- Brown: #5D4037
- Cream: #FFF8E1

Fuente:
- Display: Pacifico (logo/títulos)
- Body: Poppins (texto)
```

### Ejemplos de Iconos PWA
- **GitHub**: https://github.com/fluidicon.png
- **Twitter**: https://abs.twimg.com/icons/apple-touch-icon-192x192.png
- **YouTube**: https://www.youtube.com/s/desktop/icons/512.png

## Quick Start (Si tienes logo listo)

```bash
# 1. Copiar tu logo a la raíz
cp ~/Downloads/cocorico-logo.png public/logo.png

# 2. Generar iconos automáticamente
npx pwa-asset-generator public/logo.png public/icons --icon-only --type png --background "#E53935"

# 3. Verificar
ls public/icons/

# 4. Test
npm run dev
# Chrome → Application → Manifest → Icons
```

## ✅ Resultado Esperado

```
public/
├── icons/
│   ├── icon-192.png        (20-50 KB)
│   ├── icon-512.png        (50-150 KB)
│   └── maskable-512.png    (50-150 KB)
└── manifest.webmanifest    (actualizado)
```

Chrome DevTools → Application → Manifest:
- ✅ 3 iconos visibles
- ✅ Sin errores
- ✅ Preview se ve correcto

---

**Tiempo estimado**: 5-15 minutos
**Requerimiento**: Logo source en alta calidad (PNG/SVG > 512px)
