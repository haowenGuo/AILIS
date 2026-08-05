Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "       AILIS 系统清理助手 · 快速扫描报告" -ForegroundColor Cyan
Write-Host "扫描时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "=============================================="
Write-Host ""

# 1. 临时文件
Write-Host "=== 1. 临时文件目录 ===" -ForegroundColor Yellow
$paths = @(
    @{Name="系统Temp"; Path="C:\Windows\Temp"},
    @{Name="用户Temp"; Path="$env:TEMP"}
)
foreach ($p in $paths) {
    $size = 0; $count = 0
    Get-ChildItem $p.Path -File -ErrorAction SilentlyContinue | ForEach-Object { $count++; $size += $_.Length }
    $sizeMB = [math]::Round($size / 1MB, 2)
    Write-Host ("  " + $p.Name + ": " + $count + " 文件 | " + $sizeMB + "MB")
    if ($count -gt 0) {
        $oldCount = (Get-ChildItem $p.Path -File -ErrorAction SilentlyContinue | Where-Object { $_.LastAccessTime -lt (Get-Date).AddDays(-30) }).Count
        Write-Host ("    其中超过30天未访问: " + $oldCount + " 个")
    }
    Write-Host ""
}

# 2. 浏览器缓存 (只查根目录大小，不递归太深)
Write-Host "=== 2. 浏览器缓存 ===" -ForegroundColor Yellow
$browsers = @(
    @{Name="Edge缓存"; Path="$env:USERPROFILE\AppData\Local\Microsoft\Edge\User Data\Default\Cache"},
    @{Name="Chrome缓存"; Path="$env:USERPROFILE\AppData\Local\Google\Chrome\User Data\Default\Cache"}
)
foreach ($b in $browsers) {
    if (Test-Path $b.Path) {
        $size = 0; $count = 0
        Get-ChildItem $b.Path -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object { $count++; $size += $_.Length }
        $sizeMB = [math]::Round($size / 1MB, 2)
        Write-Host ("  " + $b.Name + ": " + $count + " 文件 | " + $sizeMB + "MB")
    } else {
        Write-Host ("  " + $b.Name + ": [不存在]")
    }
}
Write-Host ""

# 3. 系统缓存
Write-Host "=== 3. 系统缓存 ===" -ForegroundColor Yellow
$sysPaths = @(
    @{Name="Prefetch"; Path="C:\Windows\Prefetch"},
    @{Name="最近文档"; Path="$env:USERPROFILE\AppData\Roaming\Microsoft\Windows\Recent"},
    @{Name="缩略图缓存"; Path="$env:USERPROFILE\AppData\Local\Microsoft\Windows\Explorer"}
)
foreach ($p in $sysPaths) {
    if (Test-Path $p.Path) {
        $size = 0; $count = 0
        Get-ChildItem $p.Path -File -ErrorAction SilentlyContinue | ForEach-Object { $count++; $size += $_.Length }
        $sizeMB = [math]::Round($size / 1MB, 2)
        Write-Host ("  " + $p.Name + ": " + $count + " 文件 | " + $sizeMB + "MB")
    }
}
Write-Host ""

# 4. AILIS 工作区
Write-Host "=== 4. AILIS工作区占用 ===" -ForegroundColor Yellow
$root = "F:\AILIS_self_evolution_runtime"
$targets = @("node_modules", ".git", "dist", "logs", "tmp", ".runtime-logs", ".local", "ailis-web")
foreach ($t in $targets) {
    $path = $root + "\" + $t
    if (Test-Path $path) {
        $size = 0; $count = 0
        Get-ChildItem $path -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object { $count++; $size += $_.Length }
        $sizeMB = [math]::Round($size / 1MB, 2)
        Write-Host ("  " + $t + ": " + $count + " 文件 | " + $sizeMB + "MB")
    }
}
Write-Host ""

# 5. 工作区大文件 >50MB
Write-Host "=== 5. 工作区大文件(>50MB) ===" -ForegroundColor Yellow
$bigFiles = Get-ChildItem $root -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 50MB }
$totalBig = 0
foreach ($f in $bigFiles) {
    $sizeMB = [math]::Round($f.Length / 1MB, 1)
    $age = [math]::Round(((Get-Date) - $f.LastWriteTime).TotalDays, 0)
    $totalBig += $f.Length
    Write-Host ("  " + $sizeMB + "MB | " + $age + "天未改 | " + $f.Name + " [" + $f.Directory.Name + "]")
}
$totalBigMB = [math]::Round($totalBig / 1MB, 1)
Write-Host ("  大文件总计: " + $totalBigMB + "MB")

# 6. 磁盘空间
Write-Host ""
Write-Host "=== 6. 磁盘空间总览 ===" -ForegroundColor Yellow
$drives = Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Used -gt 0 }
foreach ($d in $drives) {
    $freeGB = [math]::Round($d.Free / 1GB, 2)
    $usedGB = [math]::Round($d.Used / 1GB, 2)
    $totalGB = [math]::Round(($d.Free + $d.Used) / 1GB, 2)
    $pct = [math]::Round($d.Used / ($d.Used + $d.Free) * 100, 1)
    Write-Host ("  " + $d.Name + " 盘: " + $usedGB + "GB / " + $totalGB + "GB (已用" + $pct + "%) - 剩余" + $freeGB + "GB")
}

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "✅ 扫描完成！查看上方分类报告。" -ForegroundColor Green
Write-Host "💡 告诉我你想清理哪些项目，我来执行。" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
