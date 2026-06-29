# Test Decodo proxy + compare-bazaar.com connectivity (Windows PowerShell)
# Usage:
#   $env:DECODO_USER = "your_username"
#   $env:DECODO_PASS = "your_password"
#   .\scripts\proxy\test-decodo-proxy.ps1

$ErrorActionPreference = "Stop"

$DecodoHost = if ($env:DECODO_HOST) { $env:DECODO_HOST } else { "gate.decodo.com" }
$DecodoPort = if ($env:DECODO_PORT) { $env:DECODO_PORT } else { "7000" }
$TestUrl = "https://www.compare-bazaar.com"
$User = $env:DECODO_USER
$Pass = $env:DECODO_PASS

Write-Host "`n=== compare-bazaar.com + Decodo proxy test ===" -ForegroundColor Cyan

Write-Host "`n[1/3] Direct connection (no proxy)..." -ForegroundColor Yellow
try {
  $direct = Invoke-WebRequest -Uri $TestUrl -UseBasicParsing -TimeoutSec 20
  Write-Host "OK - Status $($direct.StatusCode) - site works without proxy" -ForegroundColor Green
} catch {
  Write-Host "FAIL - Site not reachable even without proxy: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "Fix internet/DNS first before using Proxifier." -ForegroundColor Red
  exit 1
}

if (-not $User -or -not $Pass) {
  Write-Host "`n[2/3] Skipped proxy test - set credentials:" -ForegroundColor Yellow
  Write-Host '  $env:DECODO_USER = "your_decodo_username"' -ForegroundColor Gray
  Write-Host '  $env:DECODO_PASS = "your_decodo_password"' -ForegroundColor Gray
  Write-Host "  Then run this script again." -ForegroundColor Gray
} else {
  Write-Host "`n[2/3] Decodo proxy via curl..." -ForegroundColor Yellow
  $proxyUrl = "http://${User}:${Pass}@${DecodoHost}:${DecodoPort}"
  $curl = Get-Command curl.exe -ErrorAction SilentlyContinue
  if (-not $curl) {
    Write-Host "curl.exe not found. Install or use Proxifier profile import instead." -ForegroundColor Red
  } else {
    & curl.exe -sS -o NUL -w "HTTP %{http_code}\n" -x $proxyUrl --connect-timeout 25 $TestUrl
    if ($LASTEXITCODE -eq 0) {
      Write-Host "OK - compare-bazaar.com opens through Decodo" -ForegroundColor Green
    } else {
      Write-Host "FAIL - Decodo proxy cannot reach site (exit $LASTEXITCODE)" -ForegroundColor Red
      Write-Host "Try: residential proxy, US endpoint, or check Decodo dashboard credits." -ForegroundColor Red
    }
  }
}

Write-Host "`n[3/3] Proxifier fix (do this on your PC):" -ForegroundColor Yellow
Write-Host "  1. Close all VPN / browser proxy extensions" -ForegroundColor White
Write-Host "  2. Proxifier → File → Import Profile" -ForegroundColor White
Write-Host "     → scripts\proxy\compare-bazaar.proxifier.ppx" -ForegroundColor White
Write-Host "  3. Profile → Proxy Servers → Decodo → add username/password → Check" -ForegroundColor White
Write-Host "  4. Profile → Name Resolution → Resolve through proxy = ON" -ForegroundColor White
Write-Host "  5. Restart browser → open https://www.compare-bazaar.com" -ForegroundColor White
Write-Host "  6. View → Log if still fails (407=wrong password, timeout=change IP)`n" -ForegroundColor White
