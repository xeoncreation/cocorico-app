<#
Test AI Vision and Voice APIs
#>

Write-Host "=== Test Bloque 49: AI Multimodal ===" -ForegroundColor Cyan

$baseUrl = "http://127.0.0.1:3000"

Write-Host "`n--- Test 1: POST /api/ai/vision (sin imagen) ---" -ForegroundColor Yellow
try {
    $form = New-Object System.Net.Http.MultipartFormDataContent
    $res = Invoke-WebRequest -Uri "$baseUrl/api/ai/vision" -Method POST -Body $form -UseBasicParsing -TimeoutSec 10
    Write-Host "❌ FALLO: Debió devolver 400" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ ÉXITO: Rechaza request sin imagen (400)" -ForegroundColor Green
    } else {
        Write-Host ("⚠️ StatusCode inesperado: {0}" -f $_.Exception.Response.StatusCode.value__) -ForegroundColor Yellow
    }
}

Write-Host "`n--- Test 2: POST /api/ai/voice (sin texto) ---" -ForegroundColor Yellow
try {
    $body = @{} | ConvertTo-Json
    $res = Invoke-WebRequest -Uri "$baseUrl/api/ai/voice" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -TimeoutSec 10
    Write-Host "❌ FALLO: Debió devolver 400" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ ÉXITO: Rechaza request sin texto (400)" -ForegroundColor Green
    } else {
        Write-Host ("⚠️ StatusCode: {0}" -f $_.Exception.Response.StatusCode.value__) -ForegroundColor Yellow
    }
}

Write-Host "`n--- Test 3: POST /api/ai/voice (con texto) ---" -ForegroundColor Yellow
try {
    $body = @{ text = "Hola Cocorico" } | ConvertTo-Json
    $res = Invoke-WebRequest -Uri "$baseUrl/api/ai/voice" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -TimeoutSec 10
    if ($res.StatusCode -eq 200 -and $res.Headers["Content-Type"] -match "audio") {
        Write-Host "✅ ÉXITO: Devuelve audio/mpeg (200)" -ForegroundColor Green
    } else {
        Write-Host ("⚠️ StatusCode={0} ContentType={1}" -f $res.StatusCode, $res.Headers["Content-Type"]) -ForegroundColor Yellow
    }
} catch {
    Write-Host ("❌ FALLO: {0}" -f $_.Exception.Message) -ForegroundColor Red
}

Write-Host "`n--- Test 4: Verificar que password gate sigue funcionando ---" -ForegroundColor Yellow
try {
    $testRes = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing -MaximumRedirection 0 -TimeoutSec 10
    Write-Host "⚠️ No redirigió (puede que tengas cookie activa)" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 307) {
        Write-Host "✅ ÉXITO: Sigue redirigiendo sin cookie (307)" -ForegroundColor Green
    } else {
        Write-Host ("StatusCode: {0}" -f $_.Exception.Response.StatusCode.value__) -ForegroundColor Yellow
    }
}

Write-Host "`n=== Test Bloque 49 completo ===" -ForegroundColor Cyan
