# Generate placeholder PWA icons for iOS compatibility
# This creates simple colored squares as temporary icons

$iconsDir = "public\icons"
$sizes = @(192, 512)

# Create icons directory if it doesn't exist
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
}

Write-Host "Generating placeholder PWA icons..." -ForegroundColor Cyan

# Try using ImageMagick if available
$hasImageMagick = Get-Command magick -ErrorAction SilentlyContinue

if ($hasImageMagick) {
    Write-Host "Using ImageMagick to generate icons..." -ForegroundColor Green
    
    foreach ($size in $sizes) {
        $output = "$iconsDir\icon-$size.png"
        magick -size "$($size)x$($size)" xc:"#E53935" -gravity center -pointsize $([math]::floor($size / 3)) -fill white -annotate +0+0 "C" $output
        Write-Host "Created: $output" -ForegroundColor Green
    }
    
    # Create maskable icon
    $maskableOutput = "$iconsDir\maskable-512.png"
    magick -size "512x512" xc:"#E53935" -gravity center -pointsize 170 -fill white -annotate +0+0 "C" $maskableOutput
    Write-Host "Created: $maskableOutput" -ForegroundColor Green
} else {
    Write-Host "ImageMagick not found. Creating basic placeholder files..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To generate proper icons, install ImageMagick:" -ForegroundColor Yellow
    Write-Host "  winget install ImageMagick.ImageMagick" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use online tools:" -ForegroundColor Yellow
    Write-Host "  - https://www.pwabuilder.com/imageGenerator" -ForegroundColor Cyan
    Write-Host "  - https://realfavicongenerator.net/" -ForegroundColor Cyan
    Write-Host ""
    
    # Create empty placeholder files so iOS doesn't fail
    foreach ($size in $sizes) {
        $output = Join-Path $iconsDir "icon-$size.png"
        # Create minimal PNG file (1x1 red pixel)
        $bytes = @(137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,2,0,0,0,144,119,83,222,0,0,0,12,73,68,65,84,8,215,99,248,207,192,0,0,0,3,0,1,0,0,0,0,0,0,0,0,73,69,78,68,174,66,96,130)
        [System.IO.File]::WriteAllBytes($output, $bytes)
        Write-Host "Created placeholder: $output" -ForegroundColor Yellow
    }
    
    # Create maskable placeholder
    $maskableOutput = Join-Path $iconsDir "maskable-512.png"
    $bytes = @(137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,2,0,0,0,144,119,83,222,0,0,0,12,73,68,65,84,8,215,99,248,207,192,0,0,0,3,0,1,0,0,0,0,0,0,0,0,73,69,78,68,174,66,96,130)
    [System.IO.File]::WriteAllBytes($maskableOutput, $bytes)
    Write-Host "Created placeholder: $maskableOutput" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Placeholder icons created!" -ForegroundColor Green
Write-Host "iOS should now be able to load the app without failing on missing icons." -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Remember to replace these with proper icons later!" -ForegroundColor Yellow
Write-Host "   See ICONOS-PWA.md for detailed instructions." -ForegroundColor Yellow
