# Script para configurar secrets en GitHub

Write-Host "================================================"
Write-Host "  CONFIGURACION DE SECRETS EN GITHUB"
Write-Host "================================================"
Write-Host ""

# Leer valores desde .env.local
$envPath = Join-Path $PSScriptRoot "..\\.env.local"
$envContent = Get-Content $envPath -Raw

# Extraer valores
$supabaseUrl = if ($envContent -match 'NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)') { $matches[1] } else { "" }
$supabaseKey = if ($envContent -match 'NEXT_PUBLIC_SUPABASE_ANON_KEY=([^\r\n]+)') { $matches[1] } else { "" }
$importUserId = if ($envContent -match 'IMPORT_USER_ID=([^\r\n]+)') { $matches[1] } else { "" }

Write-Host "Valores detectados en .env.local:"
Write-Host "   SUPABASE_URL: $supabaseUrl"
if ($supabaseKey.Length -gt 20) {
    Write-Host "   SUPABASE_ANON_KEY: $($supabaseKey.Substring(0,20))..."
} else {
    Write-Host "   SUPABASE_ANON_KEY: (no encontrado)"
}
Write-Host "   IMPORT_USER_ID: $importUserId"
Write-Host ""

Write-Host "OPCION 1: Configuracion Manual (Recomendado)"
Write-Host "------------------------------------------------"
Write-Host "1. Ve a: https://github.com/xeoncreation/cocorico-app/settings/secrets/actions"
Write-Host "2. Click en 'New repository secret'"
Write-Host "3. Agrega estos 3 secrets:"
Write-Host ""
Write-Host "   Nombre: NEXT_PUBLIC_SUPABASE_URL"
Write-Host "   Valor: $supabaseUrl"
Write-Host ""
Write-Host "   Nombre: NEXT_PUBLIC_SUPABASE_ANON_KEY"
Write-Host "   Valor: $supabaseKey"
Write-Host ""
Write-Host "   Nombre: IMPORT_USER_ID"
Write-Host "   Valor: $importUserId"
Write-Host ""

Write-Host "OPCION 2: Usando GitHub CLI"
Write-Host "------------------------------------------------"
Write-Host "gh secret set NEXT_PUBLIC_SUPABASE_URL -b `"$supabaseUrl`""
Write-Host "gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY -b `"$supabaseKey`""
Write-Host "gh secret set IMPORT_USER_ID -b `"$importUserId`""
Write-Host ""

Write-Host "Despues de configurar los secrets:"
Write-Host "   - El workflow se ejecutara automaticamente cada dia"
Write-Host "   - Puedes ejecutarlo manualmente en:"
Write-Host "     https://github.com/xeoncreation/cocorico-app/actions"
Write-Host ""

$response = Read-Host "Abrir GitHub en el navegador? (s/n)"
if ($response -eq 's' -or $response -eq 'S') {
    Start-Process "https://github.com/xeoncreation/cocorico-app/settings/secrets/actions"
}
