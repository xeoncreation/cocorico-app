param(
    [string]$Url = "http://127.0.0.1:3000/access"
)

Write-Host "Checking security headers for $Url`n"
try {
    $res = Invoke-WebRequest -UseBasicParsing -Uri $Url -MaximumRedirection 0 -ErrorAction Stop
} catch {
    # Follow redirects up to one hop
    try {
        $loc = $_.Exception.Response.Headers.Location
        if ($loc) {
            Write-Host "Redirected to: $loc"
            $res = Invoke-WebRequest -UseBasicParsing -Uri $loc -ErrorAction Stop
        } else {
            throw
        }
    } catch {
        Write-Host "Request failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

$headers = $res.Headers

$checks = @(
    @{ Name = "X-Frame-Options";                 Expected = $null },
    @{ Name = "X-Content-Type-Options";          Expected = "nosniff" },
    @{ Name = "Referrer-Policy";                 Expected = $null },
    @{ Name = "Permissions-Policy";              Expected = $null },
    @{ Name = "Strict-Transport-Security";       Expected = $null }
)

$allPass = $true
foreach ($c in $checks) {
    $val = $headers[$c.Name]
    if ([string]::IsNullOrWhiteSpace($val)) {
        Write-Host ("[FAIL] {0} missing" -f $c.Name) -ForegroundColor Red
        $allPass = $false
    } elseif ($c.Expected -ne $null -and ($val -ne $c.Expected)) {
        Write-Host ("[WARN] {0}='{1}' expected '{2}'" -f $c.Name, $val, $c.Expected) -ForegroundColor Yellow
    } else {
        Write-Host ("[PASS] {0}='{1}'" -f $c.Name, $val) -ForegroundColor Green
    }
}

if ($allPass) {
    Write-Host "\nSecurity headers look good." -ForegroundColor Green
    exit 0
} else {
    Write-Host "\nOne or more headers are missing. Check middleware.ts withSecurityHeaders()." -ForegroundColor Yellow
    exit 2
}
