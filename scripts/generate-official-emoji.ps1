# Script para generar el emoji oficial de Cocorico en diferentes tamaños
# Requiere tener instalado Inkscape o ImageMagick

$svgPath = "public\branding\cocorico-official.svg"
$outputDir = "public\branding\cocorico"

# Crear directorio si no existe
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

Write-Host "🐓 Generando emoji oficial de Cocorico..." -ForegroundColor Yellow

# Intentar usar ImageMagick (magick) primero
if (Get-Command magick -ErrorAction SilentlyContinue) {
    Write-Host "✓ Usando ImageMagick para conversión..." -ForegroundColor Green
    
    # Generar PNG principal (512x512)
    magick $svgPath -background transparent -density 300 -resize 512x512 "$outputDir\cocorico-official.png"
    Write-Host "✓ Generado: cocorico-official.png (512x512)" -ForegroundColor Green
    
    # Generar versión para icons
    magick $svgPath -background transparent -density 300 -resize 512x512 "public\icons\icon-512.png"
    Write-Host "✓ Generado: icon-512.png" -ForegroundColor Green
    
    magick $svgPath -background transparent -density 300 -resize 192x192 "public\icons\icon-192.png"
    Write-Host "✓ Generado: icon-192.png" -ForegroundColor Green
    
    # Generar versión maskable
    magick $svgPath -background transparent -density 300 -resize 512x512 "public\icons\maskable-512.png"
    Write-Host "✓ Generado: maskable-512.png" -ForegroundColor Green
    
    # Generar versiones adicionales
    magick $svgPath -background transparent -density 300 -resize 512x512 "public\branding\cocorico-mascot.png"
    Write-Host "✓ Generado: cocorico-mascot.png" -ForegroundColor Green
    
    magick $svgPath -background transparent -density 300 -resize 220x220 "public\branding\cocorico-avatar.png"
    Write-Host "✓ Generado: cocorico-avatar.png (220x220)" -ForegroundColor Green
    
    Write-Host "`n✅ ¡Conversión completada con éxito!" -ForegroundColor Green
    Write-Host "📁 Archivos generados en: $outputDir y public\icons\" -ForegroundColor Cyan
    
} elseif (Get-Command inkscape -ErrorAction SilentlyContinue) {
    Write-Host "✓ Usando Inkscape para conversión..." -ForegroundColor Green
    
    # Generar PNG principal (512x512)
    inkscape $svgPath --export-type=png --export-filename="$outputDir\cocorico-official.png" -w 512 -h 512
    Write-Host "✓ Generado: cocorico-official.png (512x512)" -ForegroundColor Green
    
    # Generar versión para icons
    inkscape $svgPath --export-type=png --export-filename="public\icons\icon-512.png" -w 512 -h 512
    inkscape $svgPath --export-type=png --export-filename="public\icons\icon-192.png" -w 192 -h 192
    inkscape $svgPath --export-type=png --export-filename="public\icons\maskable-512.png" -w 512 -h 512
    
    Write-Host "`n✅ ¡Conversión completada con éxito!" -ForegroundColor Green
    
} else {
    Write-Host "❌ No se encontró ImageMagick ni Inkscape." -ForegroundColor Red
    Write-Host "`nPor favor instala una de estas herramientas:" -ForegroundColor Yellow
    Write-Host "  • ImageMagick: https://imagemagick.org/script/download.php" -ForegroundColor White
    Write-Host "  • Inkscape: https://inkscape.org/release/" -ForegroundColor White
    Write-Host "`nO usa un servicio online como:" -ForegroundColor Yellow
    Write-Host "  • https://cloudconvert.com/svg-to-png" -ForegroundColor White
    Write-Host "  • https://convertio.co/svg-png/" -ForegroundColor White
    exit 1
}

Write-Host "`n📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Revisa las imágenes generadas" -ForegroundColor White
Write-Host "  2. Las referencias en los componentes se actualizarán automáticamente" -ForegroundColor White
Write-Host "  3. Haz commit de los cambios" -ForegroundColor White
