# 🎨 Branding Assets

Esta carpeta contiene los recursos visuales de la marca Cocorico.

## Archivos sugeridos

- `cocorico-mascot.png` — Logo principal del gallo mascota (220x220px recomendado)
- `banner-home.webp` — Banner para la página principal
- `logo-round.png` — Logo circular para avatares / favicon
- `bg-pattern.png` — Patrón de fondo decorativo
- `wordmark-dark.png` — Logotipo horizontal (modo claro/oscuro)

## Uso en código

```tsx
import Image from "next/image";

<Image
  src="/branding/cocorico-mascot.png"
  width={220}
  height={220}
  alt="Cocorico"
/>
```

## Notas

- Prefiere `.webp` cuando sea posible (mejor compresión)
- Usa `.png` para logos con transparencia
- Nombres en minúsculas sin espacios
