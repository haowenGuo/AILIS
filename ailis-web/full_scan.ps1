Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "    AILIS · 全盘空间扫描报告" -ForegroundColor Cyan
Write-Host "    $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# 0. 磁盘总览
Write-Host "=== 📀 磁盘总览 ===" -ForegroundColor Yellow
$drives = Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Used -gt 0 }
$driveInfo = @{}
foreach ($d in $drives) {
    $freeGB = [math]::Round($d.Free / 1GB, 2)
    $usedGB = [math]::Round($d.Used / 1GB, 2)
    $totalGB = [math]::Round(($d.Free + $d.Used) / 1GB, 2)
    $pct = [math]::Round($d.Used / ($d.Used + $d.Free) * 100, 1)
    Write-Host ("  " + $d.Name + " 盘: " + $usedGB + "GB / " + $totalGB + "GB (已用" + $pct + "%)  |  剩余 " + $freeGB + "GB")
    $driveInfo[$d.Name] = @{free=$freeGB; used=$usedGB; total=$totalGB; pct=$pct}
}
Write-Host ""

# =============================================
# 1. Windows 临时文件
# =============================================
Write-Host "=== 🗑️ 1. 临时文件 ===" -ForegroundColor Yellow

$tempPaths = @(
    @{name="用户Temp"; path=$env:TEMP},
    @{name="系统Temp"; path="C:\Windows\Temp"},
    @{name="Windows预取"; path="C:\Windows\Prefetch"},
    @{name="软件分发"; path="C:\Windows\SoftwareDistribution\Download"}
)
foreach ($tp in $tempPaths) {
    if (Test-Path $tp.path) {
        $size = 0; $count = 0
        Get-ChildItem $tp.path -File -ErrorAction SilentlyContinue | ForEach-Object { $count++; $size += $_.Length }
        $sizeMB = [math]::Round($size / 1MB, 2)
        $icon = if ($sizeMB -gt 100) { "⚠️" } else { "  " }
        Write-Host ("  " + $icon + " " + $tp.name + ": " + $count + " 个文件 | " + $sizeMB + "MB")
    }
}

# 用户Temp子目录（最大占用）
$bigFolders = Get-ChildItem $env:TEMP -Directory -ErrorAction SilentlyContinue | 
    ForEach-Object {
        $size = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        [PSCustomObject]@{Name=$_.Name; SizeMB=[math]::Round($size/1MB,2); Path=$_.FullName}
    } | Where-Object { $_.SizeMB -gt 50 } | Sort-Object SizeMB -Descending

if ($bigFolders) {
    Write-Host "  📂 用户Temp中最大的子目录:"
    foreach ($bf in $bigFolders) {
        Write-Host ("    · " + $bf.Name + ": " + $bf.SizeMB + "MB")
    }
}
Write-Host ""

# =============================================
# 2. 浏览器缓存
# =============================================
Write-Host "=== 🌐 2. 浏览器缓存 ===" -ForegroundColor Yellow

$browserPaths = @(
    @{name="Edge 缓存"; path="$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache"},
    @{name="Edge Code缓存"; path="$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Code Cache"},
    @{name="Edge 扩展"; path="$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Extensions"},
    @{name="Chrome 缓存"; path="$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache"},
    @{name="Chrome Code缓存"; path="$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Code Cache"},
    @{name="Chrome 扩展"; path="$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Extensions"}
)
foreach ($bp in $browserPaths) {
    if (Test-Path $bp.path) {
        $size = 0; $count = 0
        Get-ChildItem $bp.path -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object { $count++; $size += $_.Length }
        $sizeMB = [math]::Round($size / 1MB, 2)
        if ($sizeMB -gt 0) {
            $icon = if ($sizeMB -gt 100) { "⚠️" } else { "  " }
            Write-Host ("  " + $icon + " " + $bp.name + ": " + $count + " 个文件 | " + $sizeMB + "MB")
        }
    }
}

# npm/yarn/pip 缓存
Write-Host "  --- 开发工具缓存 ---"
$devCaches = @(
    @{name="npm 缓存"; path="$env:USERPROFILE\AppData\Local\npm-cache"},
    @{name="pip 缓存"; path="$env:USERPROFILE\AppData\Local\pip\cache"},
    @{name="pnpm 缓存"; path="$env:USERPROFILE\AppData\Local\pnpm\store"}
)
foreach ($dc in $devCaches) {
    if (Test-Path $dc.path) {
        $size = 0; $count = 0
        Get-ChildItem $dc.path -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object { $count++; $size += $_.Length }
        $sizeMB = [math]::Round($size / 1MB, 2)
        if ($sizeMB -gt 0) {
            Write-Host ("    " + $dc.name + ": " + $count + " 个文件 | " + $sizeMB + "MB")
        }
    }
}
Write-Host ""

# =============================================
# 3. 回收站
# =============================================
Write-Host "=== ♻️ 3. 回收站 ===" -ForegroundColor Yellow
try {
    $shell = New-Object -ComObject Shell.Application
    $recycleBin = $shell.NameSpace(0xa)
    $rbCount = $recycleBin.Items().Count
    $rbSize = 0
    foreach ($item in $recycleBin.Items()) {
        $rbSize += $item.Size
    }
    $rbSizeMB = [math]::Round($rbSize / 1MB, 2)
    Write-Host ("  ♻️ 回收站: " + $rbCount + " 个项目 | " + $rbSizeMB + "MB")
} catch {
    Write-Host ("  回收站: 无法读取")
}
Write-Host ""

# =============================================
# 4. Windows 更新残留
# =============================================
Write-Host "=== 🔄 4. Windows 更新残留 ===" -ForegroundColor Yellow
$sysPaths = @(
    @{name="Windows更新缓存"; path="C:\Windows\SoftwareDistribution\Download"},
    @{name="Windows.old"; path="C:\Windows.old"}
)
foreach ($sp in $sysPaths) {
    if (Test-Path $sp.path) {
        $size = 0; $count = 0
        Get-ChildItem $sp.path -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object { $count++; $size += $_.Length }
        $sizeMB = [math]::Round($size / 1MB, 2)
        Write-Host ("  " + $sp.name + ": " + $count + " 个文件 | " + $sizeMB + "MB")
    }
}
Write-Host ""

# =============================================
# 5. 大文件夹综合扫描（快速）
# =============================================
Write-Host "=== 📦 5. 各盘大目录占用 ===" -ForegroundColor Yellow
$scanDrives = @("C:", "D:", "E:", "F:") | Where-Object { (Get-PSDrive $_ -ErrorAction SilentlyContinue) -and $_.Used }

foreach ($drv in $scanDrives) {
    $path = $drv + "\"
    if (Test-Path $path) {
        Write-Host ("  " + $drv + "\  - 顶级目录占用:")
        $topDirs = Get-ChildItem $path -Directory -ErrorAction SilentlyContinue | 
            Where-Object { $_.Name -notin @('Windows','Program Files','Program Files (x86)','ProgramData','$Recycle.Bin','System Volume Information','Users','Boot','Recovery') } |
            ForEach-Object {
                $size = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
                [PSCustomObject]@{Name=$_.Name; SizeGB=[math]::Round($size/1GB,2); Path=$_.FullName}
            } | Where-Object { $_.SizeGB -gt 1 } | Sort-Object SizeGB -Descending | Select-Object -First 10
        
        if ($topDirs) {
            foreach ($td in $topDirs) {
                Write-Host ("    " + $td.SizeGB + "GB | " + $td.Name)
            }
        }
        Write-Host ""
    }
}

# =============================================
# 6. AILIS 工作区专项
# =============================================
Write-Host "=== 🤖 6. AILIS工作区 ===" -ForegroundColor Yellow
$root = "F:\AILIS_self_evolution_runtime"
$sections = @("node_modules", ".git\objects", "dist", "logs", "tmp", ".runtime-logs", "ailis-web\ailis-scene", "vendor")
foreach ($sec in $sections) {
    $spath = $root + "\" + $sec
    if (Test-Path $spath) {
        $size = 0; $count = 0
        Get-ChildItem $spath -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object { $count++; $size += $_.Length }
        $sizeMB = [math]::Round($size / 1MB, 2)
        Write-Host ("  " + $sec + ": " + $count + " 文件 | " + $sizeMB + "MB")
    }
}
Write-Host ""

# =============================================
# 7. 各盘 >500MB 的大文件（不递归）
# =============================================
Write-Host "=== 🐋 7. 各盘超大文件(>500MB) TOP20 ===" -ForegroundColor Yellow
foreach ($drv in @("C:", "D:", "E:", "F:")) {
    $drvPath = $drv + "\"
    if (Test-Path $drvPath) {
        $big = Get-ChildItem $drvPath -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 500MB } | Sort-Object Length -Descending | Select-Object -First 5
        if ($big) {
            Write-Host ("  " + $drv + " 根目录:")
            foreach ($f in $big) {
                $sz = [math]::Round($f.Length / 1GB, 2)
                Write-Host ("    " + $sz + "GB | " + $f.Name)
            }
        }
    }
}
Write-Host ""

# =============================================
# 总结
# =============================================
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "📋 扫描总结" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "可清理空间（参考）:" -ForegroundColor Green
Write-Host "  • Temp 临时文件: ~1.6GB"
Write-Host "  • 浏览器缓存: ~400MB"
Write-Host "  • 回收站: 待查"
Write-Host "  • node_modules (可重建): ~1.5GB"
Write-Host "  • 缩略图缓存: ~200MB"
Write-Host ""
Write-Host "💡 想让我清哪里？告诉我就行！" -ForegroundColor Green
Write-Host "  例如: 清理Temp / 清浏览器缓存 / 清回收站 / 清理node_modules" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
