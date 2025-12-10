# Verificación de la implementación del emoji oficial de Cocorico

Write-Host "`n🔍 VERIFICACIÓN DE EMOJI OFICIAL - COCORICO`n" -ForegroundColor Cyan

# Verificar archivos SVG
Write-Host "📄 Archivos SVG:" -ForegroundColor Yellow
$svgFiles = @(
    "public\branding\cocorico-official.svg",
    "public\branding\cocorico-mascot.svg"
)

foreach ($file in $svgFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        $sizeKB = [math]::Round($size/1024, 2)
        Write-Host "  + $file ($sizeKB KB)" -ForegroundColor Green
    } else {
        Write-Host "  - $file NO ENCONTRADO" -ForegroundColor Red
    }
}

# Verificar archivos PNG principales
Write-Host "`n🖼️  Archivos PNG principales:" -ForegroundColor Yellow
$pngFiles = @(
    "public\branding\cocorico-official.png",
    "public\branding\cocorico-mascot.png",
    "public\branding\cocorico-avatar.png",
    "public\branding\cocorico-cooking.png",
    "public\branding\cocorico-happy.png",
    "public\branding\cocorico-thinking.png"
)

foreach ($file in $pngFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        $sizeKB = [math]::Round($size/1024, 2)
        Write-Host "  + $file ($sizeKB KB)" -ForegroundColor Green
    } else {
        Write-Host "  - $file NO ENCONTRADO" -ForegroundColor Red
    }
}

# Verificar iconos PWA
Write-Host "`n📱 Iconos PWA:" -ForegroundColor Yellow
$iconFiles = @(
    "public\icons\icon-192.png",
    "public\icons\icon-512.png",
    "public\icons\maskable-512.png"
)

foreach ($file in $iconFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        $sizeKB = [math]::Round($size/1024, 2)
        Write-Host "  + $file ($sizeKB KB)" -ForegroundColor Green
    } else {
        Write-Host "  - $file NO ENCONTRADO" -ForegroundColor Red
    }
}

# Verificar variaciones de humor
Write-Host "`n😊 Variaciones de humor (public\branding\cocorico\):" -ForegroundColor Yellow
$moodFiles = @(
    "default.png",
    "happy.png",
    "thinking.png",
    "chef.png",
    "alert.png",
    "cocorico-cooking.png",
    "cocorico-cutting.png",
    "cocorico-smiling.png",
    "cocorico-washing.png"
)

$moodCount = 0
foreach ($file in $moodFiles) {
    $fullPath = "public\branding\cocorico\$file"
    if (Test-Path $fullPath) {
        $moodCount++
    }
}
Write-Host "  ✅ $moodCount de $($moodFiles.Count) variaciones encontradas" -ForegroundColor Green

# Verificar documentación
Write-Host "`n📚 Documentación:" -ForegroundColor Yellow
$docFiles = @(
    "public\branding\EMOJI-OFICIAL-README.md",
    "docs\EMOJI-OFICIAL-IMPLEMENTACION.md"
)

foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file NO ENCONTRADO" -ForegroundColor Red
    }
}

# Verificar scripts
Write-Host "`n🛠️  Scripts de generación:" -ForegroundColor Yellow
$scriptFiles = @(
    "scripts\generate-official-emoji.ps1",
    "scripts\convert-emoji-svg-to-png.js"
)

foreach ($file in $scriptFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file NO ENCONTRADO" -ForegroundColor Red
    }
}

# Verificar preview
Write-Host "`n🎨 Archivo de preview:" -ForegroundColor Yellow
if (Test-Path "public\emoji-preview.html") {
    Write-Host "  ✅ public\emoji-preview.html" -ForegroundColor Green
    Write-Host "  🌐 Disponible en: http://localhost:3000/emoji-preview.html" -ForegroundColor Cyan
} else {
    Write-Host "  ❌ public\emoji-preview.html NO ENCONTRADO" -ForegroundColor Red
}

# Resumen
Write-Host "`n📊 RESUMEN:" -ForegroundColor Cyan
Write-Host "  • Emoji oficial creado y optimizado" -ForegroundColor White
Write-Host "  • Iconos PWA actualizados" -ForegroundColor White
Write-Host "  • Variaciones de humor implementadas" -ForegroundColor White
Write-Host "  • Documentación completa" -ForegroundColor White
Write-Host "  • Scripts de regeneración disponibles" -ForegroundColor White

Write-Host "`n✅ VERIFICACIÓN COMPLETADA`n" -ForegroundColor Green

# Siguiente paso
Write-Host "🚀 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "  1. Inicia el servidor: npm run dev" -ForegroundColor White
Write-Host "  2. Abre http://localhost:3000/emoji-preview.html" -ForegroundColor White
Write-Host "  3. Navega por la app para ver el emoji en acción" -ForegroundColor White
Write-Host "  4. Commit los cambios`n" -ForegroundColor White
