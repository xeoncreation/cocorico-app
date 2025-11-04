<#
Test de protección por contraseña del sitio
#>

Write-Host "=== Test de protección por contraseña ===" -ForegroundColor Cyan

$baseUrl = "http://127.0.0.1:3000"

Write-Host "`n--- Test 1: Acceso sin cookie debe redirigir ---" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing -MaximumRedirection 0 -ErrorAction Stop
    Write-Host "❌ FALLO: No hubo redirección (StatusCode: $($response.StatusCode))" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 307 -or $_.Exception.Response.StatusCode.value__ -eq 302) {
        $location = $_.Exception.Response.Headers.Location
        Write-Host "✅ ÉXITO: Redirige a $location" -ForegroundColor Green
    } else {
        Write-Host "❌ FALLO: Error inesperado: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n--- Test 2: Página /access debe ser accesible ---" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/access" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ ÉXITO: Página de acceso responde 200" -ForegroundColor Green
    } else {
        Write-Host "❌ FALLO: StatusCode inesperado: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ FALLO: Error al acceder: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n--- Test 3: API de verificación con contraseña incorrecta ---" -ForegroundColor Yellow
try {
    $body = @{ password = "wrongpassword" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/api/verify-password" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing `
        -ErrorAction Stop
    Write-Host "❌ FALLO: Aceptó contraseña incorrecta" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "✅ ÉXITO: Rechazó contraseña incorrecta (401)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ ADVERTENCIA: Error inesperado: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    }
}

Write-Host "`n--- Test 4: API de verificación con contraseña correcta ---" -ForegroundColor Yellow
try {
    $body = @{ password = "cocorico2025" } | ConvertTo-Json
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $response = Invoke-WebRequest -Uri "$baseUrl/api/verify-password" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing `
        -WebSession $session `
        -ErrorAction Stop
    
    if ($response.StatusCode -eq 200) {
        $hasCookie = $session.Cookies.GetCookies($baseUrl) | Where-Object { $_.Name -eq "site-access" }
        if ($hasCookie) {
            Write-Host "✅ ÉXITO: Contraseña aceptada y cookie establecida" -ForegroundColor Green
            
            # Test 5: Acceso con cookie válida
            Write-Host "`n--- Test 5: Acceso a home con cookie válida ---" -ForegroundColor Yellow
            try {
                $homeResponse = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing -WebSession $session
                if ($homeResponse.StatusCode -eq 200) {
                    Write-Host "✅ ÉXITO: Acceso permitido con cookie válida" -ForegroundColor Green
                } else {
                    Write-Host "❌ FALLO: StatusCode inesperado: $($homeResponse.StatusCode)" -ForegroundColor Red
                }
            } catch {
                Write-Host "❌ FALLO: Error al acceder con cookie: $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ FALLO: No se estableció la cookie site-access" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ FALLO: StatusCode inesperado: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ FALLO: Error en verificación: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test completo ===" -ForegroundColor Cyan
