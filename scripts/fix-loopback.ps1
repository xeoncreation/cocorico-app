<#
Attempt safe fixes for localhost connectivity on Windows.
Run PowerShell as Administrator. You may be prompted by UAC.
Reboot after running.
#>

Write-Host "=== Apply safe loopback fixes (ADMIN) ===" -ForegroundColor Cyan

if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltinRole] "Administrator")) {
  Write-Error "This script must be run as Administrator. Right-click PowerShell and 'Run as administrator'."
  exit 1
}

$ErrorActionPreference = 'Continue'

function Section($title) {
  Write-Host "`n--- $title ---" -ForegroundColor Yellow
}

Section "Ensure hosts entries for localhost"
$hostsPath = "C:\\Windows\\System32\\drivers\\etc\\hosts"
$hostsContent = Get-Content $hostsPath -Raw
if ($hostsContent -notmatch "(?m)^\s*127\.0\.0\.1\s+localhost\s*$") {
  Add-Content -Path $hostsPath -Value "127.0.0.1 localhost"
  Write-Host "Added 127.0.0.1 localhost"
}
if ($hostsContent -notmatch "(?m)^\s*::1\s+localhost\s*$") {
  Add-Content -Path $hostsPath -Value "::1 localhost"
  Write-Host "Added ::1 localhost"
}

Section "Flush DNS cache"
ipconfig /flushdns | Out-Null

Section "Disable WinINET proxy for current user (non-destructive)"
try {
  netsh winhttp reset proxy | Out-Null
  Write-Host "WinHTTP proxy reset."
} catch {}

Section "Add firewall rules for ports 3000 and 3001 (if missing)"
$ports = @(3000, 3001)
foreach ($p in $ports) {
  try {
    $existing = Get-NetFirewallRule -DisplayName "Dev-$p" -ErrorAction SilentlyContinue
    if (-not $existing) {
      New-NetFirewallRule -DisplayName "Dev-$p" -Direction Inbound -Protocol TCP -LocalPort $p -Action Allow -Profile Private | Out-Null
      Write-Host "Added firewall rule Dev-$p"
    } else {
      Write-Host "Firewall rule Dev-$p exists"
    }
  } catch { Write-Warning $_ }
}

Section "Reset Winsock and TCP/IP (requires reboot)"
netsh winsock reset | Out-Null
netsh int ip reset | Out-Null
Write-Host "Winsock and TCP/IP have been reset. Please REBOOT your system to apply changes." -ForegroundColor Green

Write-Host "`n=== Fix script complete ===" -ForegroundColor Cyan
