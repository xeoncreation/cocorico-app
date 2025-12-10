/**
 * Script para convertir el emoji oficial SVG a PNG
 * Alternativa cuando ImageMagick o Inkscape no están disponibles
 * 
 * Nota: Este script requiere instalar 'sharp' temporalmente
 * npm install --save-dev sharp
 */

const fs = require('fs');
const path = require('path');

console.log('🐓 Conversión de SVG a PNG - Emoji Oficial Cocorico\n');

console.log('⚠️  Para generar las imágenes PNG, necesitas una de estas opciones:\n');

console.log('OPCIÓN 1 - Instalar ImageMagick (Recomendado):');
console.log('  • Descarga: https://imagemagick.org/script/download.php');
console.log('  • Después ejecuta: .\\scripts\\generate-official-emoji.ps1\n');

console.log('OPCIÓN 2 - Usar servicio online:');
console.log('  1. Abre: https://cloudconvert.com/svg-to-png');
console.log('  2. Sube: public\\branding\\cocorico-official.svg');
console.log('  3. Configura: Width=512, Height=512, Background=Transparent');
console.log('  4. Descarga y guarda como:');
console.log('     - public\\branding\\cocorico-official.png');
console.log('     - public\\branding\\cocorico-mascot.png');
console.log('     - public\\branding\\cocorico-avatar.png (220x220)');
console.log('     - public\\icons\\icon-512.png');
console.log('     - public\\icons\\icon-192.png (192x192)');
console.log('     - public\\icons\\maskable-512.png\n');

console.log('OPCIÓN 3 - Instalar sharp (librería Node.js):');
console.log('  • npm install --save-dev sharp');
console.log('  • Luego este script podrá hacer la conversión automáticamente\n');

// Intentar usar sharp si está instalado
try {
  const sharp = require('sharp');
  
  console.log('✅ Sharp encontrado! Generando imágenes...\n');
  
  const svgPath = path.join(__dirname, '..', 'public', 'branding', 'cocorico-official.svg');
  const svgBuffer = fs.readFileSync(svgPath);
  
  const conversions = [
    { output: 'public/branding/cocorico-official.png', size: 512 },
    { output: 'public/branding/cocorico-mascot.png', size: 512 },
    { output: 'public/branding/cocorico-avatar.png', size: 220 },
    { output: 'public/icons/icon-512.png', size: 512 },
    { output: 'public/icons/icon-192.png', size: 192 },
    { output: 'public/icons/maskable-512.png', size: 512 }
  ];
  
  Promise.all(
    conversions.map(async ({ output, size }) => {
      const outputPath = path.join(__dirname, '..', output);
      await sharp(svgBuffer)
        .resize(size, size)
        .png({ quality: 100 })
        .toFile(outputPath);
      console.log(`✓ Generado: ${output} (${size}x${size})`);
    })
  ).then(() => {
    console.log('\n✅ ¡Todas las imágenes generadas con éxito!');
    console.log('📁 Archivos guardados en public/branding/ y public/icons/');
  }).catch(err => {
    console.error('❌ Error al generar imágenes:', err.message);
    process.exit(1);
  });
  
} catch (err) {
  console.log('ℹ️  Sharp no está instalado. Por favor usa una de las opciones anteriores.');
  process.exit(0);
}
