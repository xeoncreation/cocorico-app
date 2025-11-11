param(
  [string]$HostName = "localhost",
  [int]$Port = 3000
)

Write-Host "Checking health at http://${HostName}:${Port}/health" -ForegroundColor Cyan
try {
  $res = curl -UseBasicParsing -TimeoutSec 3 "http://${HostName}:${Port}/health"
  $statusCode = $res.StatusCode
  Write-Host "HTTP Status: $statusCode" -ForegroundColor Green
  if ($res.Content) { Write-Host $res.Content }
} catch {
  Write-Host "Health request failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nActive listeners on port ${Port}:" -ForegroundColor Cyan
netstat -ano | findstr ":$Port"
