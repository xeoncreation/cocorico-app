# Branding de Cocorico 🐓

Esta carpeta contiene las ilustraciones del personaje Cocorico en diferentes poses y estados de ánimo.

## Imágenes disponibles

- **default.png** - Pose neutral por defecto
- **happy.png** - Cocorico feliz/emocionado
- **thinking.png** - Cocorico pensativo/reflexionando
- **chef.png** - Cocorico como chef/cocinando
- **alert.png** - Cocorico alertando/advertencia

## Uso

Estas imágenes se usan principalmente en:

1. **Página educativa** (`/learn`) - Consejos y tips
2. **Componente CocoricoTip** - Bloques visuales reutilizables
3. **Otras secciones** donde el personaje guíe al usuario

## Reemplazar imágenes

Los archivos actuales son SVG placeholders. Para reemplazarlos:

1. Exporta tus ilustraciones en formato PNG (200x200px recomendado)
2. Mantén los mismos nombres de archivo
3. Reemplaza los archivos en esta carpeta
4. La app cargará automáticamente las nuevas imágenes

## Agregar nuevas poses

Para agregar nuevas expresiones:

1. Guarda la imagen en esta carpeta con nombre descriptivo
2. Actualiza el componente `CocoricoTip.tsx` si es necesario
3. Úsala en tus páginas con: `/branding/cocorico/nombre.png`
