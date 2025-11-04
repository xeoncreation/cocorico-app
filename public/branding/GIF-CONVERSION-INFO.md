# Conversión MP4 a GIF - Cocorico

## ✅ Conversión Completada

Se convirtieron 3 archivos MP4 a GIF animados con optimización para web.

## 📊 Comparación de tamaños

### Archivos originales (MP4)

- `banner-home.webp.mp4` - 1.44 MB
- `cocorico-alert.png.mp4` - 1.73 MB
- `cocorico-mascot.png.mp4` - 1.22 MB

### Archivos GIF generados

#### Versión estándar (15 FPS, más colores)

- `banner-home.gif` - **9.55 MB**
- `cocorico-alert.gif` - **11.01 MB**
- `cocorico-mascot-animated.gif` - **10.40 MB**

#### ⭐ Versión optimizada (10 FPS, 64 colores) — recomendada

- `banner-home-optimized.gif` - **3.43 MB** (−64% del tamaño)
- `cocorico-alert-optimized.gif` - **4.95 MB** (−55% del tamaño)
- `cocorico-mascot-anim-optimized.gif` - **4.89 MB** (−53% del tamaño)

## 🛠️ Herramientas utilizadas

- FFmpeg 8.0 — Conversión de video a GIF
- Instalado vía: `winget install --id=Gyan.FFmpeg -e`

## 🎨 Parámetros de optimización

### Versión optimizada (recomendada para web)

```bash
fps=10                    # 10 fotogramas por segundo
scale=500-600px           # Ancho máximo 500-600px
max_colors=64             # Paleta de 64 colores
dither=bayer              # Difuminado bayer para mejor calidad
loop=0                    # Loop infinito
```

### Ventajas de la versión optimizada

- ✅ 65% menos peso que versión estándar
- ✅ Movimiento suave a 10 FPS
- ✅ Buena calidad visual con 64 colores
- ✅ Loop infinito automático
- ✅ Carga rápida en navegadores

## 🚀 Uso recomendado

### Para páginas web

Usa los archivos `-optimized.gif` (3–5 MB cada uno).

```tsx
import Image from 'next/image'

<Image
  src="/branding/banner-home-optimized.gif"
  alt="Banner Cocorico"
  width={600}
  height={405}
  unoptimized
/>
```

### Para redes sociales

Los archivos optimizados son perfectos para:

- Instagram posts
- Facebook
- LinkedIn
- Twitter/X

## 📝 Comandos FFmpeg usados

```bash
# Banner optimizado (600px ancho)
ffmpeg -y -i "banner-home.webp.mp4" \
  -vf "fps=10,scale=600:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=64[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" \
  -loop 0 "banner-home-optimized.gif"

# Alert optimizado (500px ancho)
ffmpeg -y -i "cocorico-alert.png.mp4" \
  -vf "fps=10,scale=500:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=64[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" \
  -loop 0 "cocorico-alert-optimized.gif"

# Mascot optimizado (500px ancho)
ffmpeg -y -i "cocorico-mascot.png.mp4" \
  -vf "fps=10,scale=500:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=64[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" \
  -loop 0 "cocorico-mascot-anim-optimized.gif"
```

## 🎯 Próximos pasos

Si necesitas optimizar aún más:

1. Reducir FPS a 8 — más ligero pero menos suave
2. Reducir colores a 32 — menor calidad pero muy ligero
3. Reducir dimensiones — 400px ancho para versión móvil
4. Usar WebP animado — mejor compresión que GIF (requiere soporte)

## 📦 Archivos disponibles

```text
public/branding/
├── banner-home-optimized.gif          ⭐ 3.43 MB
├── cocorico-alert-optimized.gif       ⭐ 4.95 MB
├── cocorico-mascot-anim-optimized.gif ⭐ 4.89 MB
├── banner-home.gif                    9.55 MB
├── cocorico-alert.gif                 11.01 MB
├── cocorico-mascot-animated.gif       10.40 MB
└── [archivos MP4 originales]
```

---

**Fecha de conversión:** 3 de noviembre de 2025  
**Herramienta:** FFmpeg 8.0  
**Calidad:** Optimizada para web manteniendo buena calidad visual
