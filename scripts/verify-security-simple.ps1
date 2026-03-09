#!/usr/bin/env pwsh
# Script de verificacion de seguridad - Cocorico
# Ejecutar: .\scripts\verify-security.ps1

param(
    [string]$BaseURL = "https://cocorico-qiy6g5d4b-xeons-projects-f217d040.vercel.app"
)

Write-Host "Verificacion de Seguridad - Cocorico" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Contador de tests
$totalTests = 0
$passedTests = 0

# TEST 1: Verificar archivos de documentacion
Write-Host "[TEST 1] Documentacion de Seguridad" -ForegroundColor Magenta
$totalTests++

$requiredDocs = @(
    "docs/AUDITORIA_SEGURIDAD_2026.md",
    "SEGURIDAD_IMPLEMENTADA.md",
    "ACCIONES_CRITICAS_HOY.md",
    "src/lib/rate-limiter.ts",
    "supabase/migrations/20260309_critical_community_rls.sql"
)

$allDocsExist = $true
foreach ($doc in $requiredDocs) {
    if (Test-Path $doc) {
        Write-Host "  OK $doc" -ForegroundColor Green
    } else {
        Write-Host "  FALTA $doc" -ForegroundColor Red
        $allDocsExist = $false
    }
}

if ($allDocsExist) {
    $passedTests++
    Write-Host "OK - Todos los documentos existen`n" -ForegroundColor Green
} else {
    Write-Host "FALLO - Faltan documentos`n" -ForegroundColor Red
}

# TEST 2: Verificar protecciones en codigo
Write-Host "[TEST 2] Protecciones en Codigo" -ForegroundColor Magenta
$totalTests++

$protectedEndpoints = @(
    "src/app/api/ai/voice/route.ts",
    "src/app/api/ai/recipes/route.ts",
    "src/app/api/suggest/route.ts",
    "src/app/api/ai/detect-food/route.ts",
    "src/app/api/ai/vision/route.ts",
    "src/app/api/ai/live-vision/route.ts",
    "src/app/api/import/route.ts"
)

$allProtected = $true
foreach ($endpoint in $protectedEndpoints) {
    if (Test-Path $endpoint) {
        $code = Get-Content $endpoint -Raw
        
        $hasAuth = ($code.Contains("supabase.auth.getUser") -or $code.Contains("getServerUser"))
        $hasRateLimit = ($code.Contains("applyRateLimit") -or $code.Contains("checkRateLimit"))
        
        if ($hasAuth -and $hasRateLimit) {
            Write-Host "  OK $(Split-Path $endpoint -Leaf) protegido" -ForegroundColor Green
        } else {
            Write-Host "  FALTA $(Split-Path $endpoint -Leaf) (auth: $hasAuth, rate: $hasRateLimit)" -ForegroundColor Yellow
            $allProtected = $false
        }
    } else {
        Write-Host "  NO EXISTE $endpoint" -ForegroundColor Red
        $allProtected = $false
    }
}

if ($allProtected) {
    $passedTests++
    Write-Host "OK - Todos los endpoints estan protegidos`n" -ForegroundColor Green
} else {
    Write-Host "FALLO - Algunos endpoints no estan protegidos`n" -ForegroundColor Red
}

# TEST 3: Verificar variables de entorno
Write-Host "[TEST 3] Variables de Entorno" -ForegroundColor Magenta
$totalTests++

$envFile = ".env.local"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    
    $requiredVars = @(
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "OPENAI_API_KEY",
        "STRIPE_SECRET_KEY",
        "REPLICATE_API_TOKEN"
    )
    
    $allVarsPresent = $true
    foreach ($var in $requiredVars) {
        if ($envContent.Contains($var)) {
            Write-Host "  OK $var configurada" -ForegroundColor Green
        } else {
            Write-Host "  FALTA $var" -ForegroundColor Red
            $allVarsPresent = $false
        }
    }
    
    if ($allVarsPresent) {
        $passedTests++
        Write-Host "OK - Todas las variables estan configuradas`n" -ForegroundColor Green
    } else {
        Write-Host "FALLO - Faltan variables`n" -ForegroundColor Red
    }
} else {
    Write-Host "  FALTA $envFile" -ForegroundColor Red
    Write-Host "FALLO - No existe archivo de entorno`n" -ForegroundColor Red
}

# TEST 4: Verificar secretos sanitizados
Write-Host "[TEST 4] Secretos Sanitizados" -ForegroundColor Magenta
$totalTests++

$setupFile = "setup-vercel-env.ps1"
if (Test-Path $setupFile) {
    $content = Get-Content $setupFile -Raw
    
    $hasRealSecrets = ($content.Contains("sk-proj-") -and -not $content.Contains("YOUR_")) -or
                      ($content.Contains("sk_test_") -and $content.Length -gt 500 -and -not $content.Contains("YOUR_"))
    
    if ($hasRealSecrets) {
        Write-Host "  PELIGRO: setup-vercel-env.ps1 contiene secretos reales" -ForegroundColor Red
        Write-Host "FALLO - Debes sanitizar el archivo`n" -ForegroundColor Red
    } else {
        Write-Host "  OK: setup-vercel-env.ps1 no contiene secretos expuestos" -ForegroundColor Green
        $passedTests++
        Write-Host "OK - Archivo sanitizado`n" -ForegroundColor Green
    }
} else {
    Write-Host "  Archivo no encontrado (OK)" -ForegroundColor Yellow
    $passedTests++
}

# TEST 5: Verificar migracion RLS
Write-Host "[TEST 5] Migracion RLS" -ForegroundColor Magenta
$totalTests++

$migrationFile = "supabase/migrations/20260309_critical_community_rls.sql"
if (Test-Path $migrationFile) {
    Write-Host "  OK: Migracion RLS creada" -ForegroundColor Green
    Write-Host "  ACCION REQUERIDA: Aplicar en Supabase Dashboard" -ForegroundColor Yellow
    $passedTests++
    Write-Host "OK - Migracion lista para aplicar`n" -ForegroundColor Green
} else {
    Write-Host "  FALTA: $migrationFile" -ForegroundColor Red
    Write-Host "FALLO - Migracion no encontrada`n" -ForegroundColor Red
}

# RESUMEN
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE VERIFICACION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$percentage = [math]::Round(($passedTests / $totalTests) * 100, 0)
Write-Host "Tests pasados: $passedTests / $totalTests ($percentage%)" -ForegroundColor $(if ($percentage -ge 80) { "Green" } else { "Yellow" })
Write-Host ""

if ($percentage -eq 100) {
    Write-Host "EXCELENTE - Todas las verificaciones pasaron!" -ForegroundColor Green
} elseif ($percentage -ge 80) {
    Write-Host "BIEN - Mayoria de verificaciones pasadas" -ForegroundColor Yellow
} else {
    Write-Host "ATENCION - Varias verificaciones fallaron" -ForegroundColor Red
}

Write-Host ""
Write-Host "RECORDATORIOS:" -ForegroundColor Cyan
Write-Host "  1. Rotar API keys expuestas (si hubo problema en TEST 4)" -ForegroundColor White
Write-Host "  2. Aplicar migracion RLS en Supabase Dashboard" -ForegroundColor White
Write-Host "  3. Verificar logs en produccion despues de desplegar" -ForegroundColor White
Write-Host ""

exit $(if ($percentage -ge 80) { 0 } else { 1 })
