<#
Diagnose localhost/127.0.0.1 connectivity on Windows.
Run in PowerShell. For best results, open PowerShell as Administrator.
#>

Write-Host "=== Diagnose loopback connectivity (localhost / 127.0.0.1) ===" -ForegroundColor Cyan

$ErrorActionPreference = 'Continue'

function Section($title) {
  Write-Host "`n--- $title ---" -ForegroundColor Yellow
}

Section "Environment"
Write-Host ("PSVersion: {0}" -f $PSVersionTable.PSVersion)
Write-Host ("Username: {0}" -f $env:USERNAME)
Write-Host ("Process: {0}" -f $([System.Diagnostics.Process]::GetCurrentProcess().ProcessName))

Section "Hosts file"
$hosts = "C:\Windows\System32\drivers\etc\hosts"
if (Test-Path $hosts) {
  Select-String -Path $hosts -Pattern "^\s*127\.0\.0\.1\s+localhost|^\s*::1\s+localhost" -SimpleMatch | ForEach-Object { $_.Line } | ForEach-Object { Write-Host $_ }
} else {
  Write-Warning "Hosts file not found: $hosts"
}

Section "Proxy env vars"
$httpProxy  = $env:HTTP_PROXY
$httpsProxy = $env:HTTPS_PROXY
$noProxy    = $env:NO_PROXY
Write-Host ("HTTP_PROXY:  {0}" -f $(if ($httpProxy) { $httpProxy } else { '<not set>' }))
Write-Host ("HTTPS_PROXY: {0}" -f $(if ($httpsProxy) { $httpsProxy } else { '<not set>' }))
Write-Host ("NO_PROXY:    {0}" -f $(if ($noProxy) { $noProxy } else { '<not set>' }))

Section "DNS resolution"
try {
  Write-Host "localhost ->" -NoNewline
  [System.Net.Dns]::GetHostAddresses("localhost") | ForEach-Object { Write-Host " $_" }
} catch { Write-Warning $_ }

Section "Firewall rules for port 3000/3001"
try {
  Get-NetFirewallRule -ErrorAction Stop | Where-Object { $_.Enabled -eq 'True' } | `
    Get-NetFirewallPortFilter | Where-Object { $_.Protocol -eq 'TCP' -and ($_.LocalPort -eq 3000 -or $_.LocalPort -eq 3001) } | `
    ForEach-Object { $_ | Format-List * }
} catch { Write-Warning $_ }

Section "Test-NetConnection"
foreach ($p in 3000,3001) {
  try {
    $r = Test-NetConnection -ComputerName 127.0.0.1 -Port $p -InformationLevel Detailed
    Write-Host "Port $p -> TcpTestSucceeded=$($r.TcpTestSucceeded) RemoteAddress=$($r.RemoteAddress)"
  } catch { Write-Warning $_ }
}

Section "Spawn a tiny HTTP server (port 3001)"
# Try to spawn a tiny server and probe it
$node = (Get-Command node -ErrorAction SilentlyContinue)
if (-not $node) {
  Write-Warning "Node.exe not found in PATH. Skipping tiny server test."
} else {
  $code = "require('http').createServer((req,res)=>res.end('ok')).listen(3001,'127.0.0.1',()=>console.log('tiny server listening on 127.0.0.1:3001'))"
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName  = $node.Path
  $psi.Arguments = "-e `"$code`""
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError  = $true
  $psi.UseShellExecute = $false
  $psi.CreateNoWindow = $true
  $p = [System.Diagnostics.Process]::Start($psi)
  Start-Sleep -Seconds 1
  try {
    $status = (Invoke-WebRequest -Uri 'http://127.0.0.1:3001' -UseBasicParsing -TimeoutSec 3).StatusCode
    Write-Host ("Probe tiny server: HTTP {0}" -f $status)
  } catch { Write-Warning ("Probe tiny server failed: {0}" -f $_.Exception.Message) }
  try { if (-not $p.HasExited) { $p.Kill() | Out-Null } } catch {}
}

Section "Netstat LISTENING on 3000/3001"
try {
  netstat -ano | findstr LISTENING | findstr ":3000\|:3001"
} catch { Write-Warning $_ }

Write-Host "`n=== Diagnose complete ===" -ForegroundColor Cyan
