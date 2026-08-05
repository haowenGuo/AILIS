$fn = "F:\AILIS_self_evolution_runtime\ailis-web\cleanup_plan.txt"
if (Test-Path $fn) {
    Get-Content $fn
    exit 0
}
Write-Host "FILE_NOT_FOUND"
