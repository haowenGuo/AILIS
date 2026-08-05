$root = "F:\AILIS_self_evolution_runtime"

Write-Host "=== AILIS工作区续 ===" -ForegroundColor Yellow
$targets = @{}
$targets["dist"] = $root + "\dist"
$targets["logs"] = $root + "\logs"
$targets["tmp"] = $root + "\tmp"
$targets["runtime-logs"] = $root + "\.runtime-logs"
$targets[".local"] = $root + "\.local"
$targets["ailis-web"] = $root + "\ailis-web"

foreach ($t in $targets.Keys) {
    $path = $targets[$t]
    if (Test-Path $path) {
        $size = 0
        $count = 0
        Get-ChildItem $path -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
            $count++
            $size += $_.Length
        }
        $sizeMB = [math]::Round($size / 1MB, 2)
        Write-Host ("  " + $t + ": " + $count + " 文件 | " + $sizeMB + "MB")
    } else {
        Write-Host ("  " + $t + ": [不存在]")
    }
}

Write-Host ""
Write-Host "=== 工作区大文件(>100MB) ===" -ForegroundColor Yellow
$bigFiles = Get-ChildItem $root -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 100MB }
$totalBig = 0
foreach ($f in $bigFiles) {
    $sizeMB = [math]::Round($f.Length / 1MB, 1)
    $age = [math]::Round(((Get-Date) - $f.LastWriteTime).TotalDays, 0)
    $totalBig += $f.Length
    Write-Host ("  " + $sizeMB + "MB | " + $age + "天未改 | " + $f.Name + " [" + $f.Directory.Name + "]")
}
$totalBigMB = [math]::Round($totalBig / 1MB, 1)
Write-Host ("  大文件总计: " + $totalBigMB + "MB")

Write-Host ""
Write-Host "=== 磁盘空间 ===" -ForegroundColor Yellow
$drives = Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Used -gt 0 }
foreach ($d in $drives) {
    $freeGB = [math]::Round($d.Free / 1GB, 2)
    $usedGB = [math]::Round($d.Used / 1GB, 2)
    $totalGB = [math]::Round(($d.Free + $d.Used) / 1GB, 2)
    $pct = [math]::Round($d.Used / ($d.Used + $d.Free) * 100, 1)
    Write-Host ("  " + $d.Name + " 盘: " + $usedGB + "GB / " + $totalGB + "GB (已用" + $pct + "%) - 剩余" + $freeGB + "GB")
}
