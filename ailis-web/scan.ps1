Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "       AILIS 系统清理助手 · 扫描报告" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "扫描时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host ""

# ========================================
# 第一部分：临时文件
# ========================================
Write-Host "=== 1. 临时文件目录 ===" -ForegroundColor Yellow

$temps = @(
    "$env:TEMP",
    "$env:USERPROFILE\AppData\Local\Temp",
    "C:\Windows\Temp"
)

foreach ($t in $temps) {
    if (Test-Path $t) {
        $items = Get-ChildItem $t -Recurse -File -ErrorAction SilentlyContinue
        $count = ($items | Measure-Object).Count
        $size = [math]::Round(($items | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
        Write-Host "  [$t]"
        Write-Host "    项目数: $count | 大小: ${size}MB"
        
        # 找大文件
        $big = $items | Sort-Object Length -Descending | Select-Object -First 3
        foreach ($b in $big) {
            $sizeB = [math]::Round($b.Length / 1MB, 2)
            $access = $b.LastAccessTime.ToString('yyyy-MM-dd')
            Write-Host "    · ${sizeB}MB | 最后访问: $access | $($b.Name)"
        }
        Write-Host ""
    }
}

# ========================================
# 第二部分：浏览器缓存
# ========================================
Write-Host "=== 2. 浏览器缓存 ===" -ForegroundColor Yellow

$browsers = @(
    @{Name="Edge缓存"; Path="$env:USERPROFILE\AppData\Local\Microsoft\Edge\User Data\Default\Cache"},
    @{Name="Chrome缓存"; Path="$env:USERPROFILE\AppData\Local\Google\Chrome\User Data\Default\Cache"},
    @{Name="EdgeCode Cache"; Path="$env:USERPROFILE\AppData\Local\Microsoft\Edge\User Data\Default\Code Cache"},
    @{Name="ChromeCode Cache"; Path="$env:USERPROFILE\AppData\Local\Google\Chrome\User Data\Default\Code Cache"}
)

foreach ($b in $browsers) {
    $p = $b.Path
    if (Test-Path $p) {
        $items = Get-ChildItem $p -Recurse -File -ErrorAction SilentlyContinue
        $count = ($items | Measure-Object).Count
        $size = [math]::Round(($items | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
        $old = ($items | Where-Object { $_.LastAccessTime -lt (Get-Date).AddDays(-30) } | Measure-Object).Count
        Write-Host "  $($b.Name): $count 文件, ${size}MB (超过30天未访问: $old)"
    }
}
Write-Host ""

# ========================================
# 第三部分：Windows系统缓存
# ========================================
Write-Host "=== 3. 系统缓存 ===" -ForegroundColor Yellow

# Prefetch
$pf = "C:\Windows\Prefetch"
if (Test-Path $pf) {
    $items = Get-ChildItem $pf -File -ErrorAction SilentlyContinue
    $count = ($items | Measure-Object).Count
    $size = [math]::Round(($items | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
    Write-Host "  Prefetch: $count 文件, ${size}MB"
}

# 回收站
$rb = (New-Object -ComObject Shell.Application).NameSpace(0xa)
$rbCount = $rb.Items().Count
Write-Host "  回收站: $rbCount 个项目"

# 最近文档
$recent = "$env:USERPROFILE\AppData\Roaming\Microsoft\Windows\Recent"
if (Test-Path $recent) {
    $items = Get-ChildItem $recent -File -ErrorAction SilentlyContinue
    $count = ($items | Measure-Object).Count
    Write-Host "  最近文档: $count 个快捷方式"
}

Write-Host ""

# ========================================
# 第四部分：AILIS 工作区大文件/旧文件
# ========================================
Write-Host "=== 4. AILIS工作区 ===" -ForegroundColor Yellow

$root = "F:\AILIS_self_evolution_runtime"
$dirs = @(
    @{Name="node_modules"; Path="$root\node_modules"},
    @{Name=".git/objects"; Path="$root\.git\objects"},
    @{Name="dist"; Path="$root\dist"},
    @{Name="logs"; Path="$root\logs"},
    @{Name="tmp"; Path="$root\tmp"},
    @{Name=".runtime-logs"; Path="$root\.runtime-logs"},
    @{Name=".local"; Path="$root\.local"}
)

foreach ($d in $dirs) {
    $p = $d.Path
    if (Test-Path $p) {
        $items = Get-ChildItem $p -Recurse -File -ErrorAction SilentlyContinue
        $count = ($items | Measure-Object).Count
        $size = [math]::Round(($items | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
        Write-Host "  $($d.Name): $count 文件, ${size}MB"
    } else {
        Write-Host "  $($d.Name): [不存在]"
    }
}

# 找工作区 >100MB 且 30天未修改的文件
Write-Host ""
Write-Host "=== 5. 工作区大文件(>50MB) ===" -ForegroundColor Yellow
$bigFiles = Get-ChildItem $root -Recurse -File -ErrorAction SilentlyContinue | 
    Where-Object { $_.Length -gt 50MB } |
    Sort-Object Length -Descending

$totalBig = 0
foreach ($f in $bigFiles) {
    $sizeB = [math]::Round($f.Length / 1MB, 1)
    $modified = $f.LastWriteTime.ToString('yyyy-MM-dd')
    $age = [math]::Round(((Get-Date) - $f.LastWriteTime).TotalDays, 0)
    $totalBig += $f.Length
    Write-Host "  ${sizeB}MB | ${age}天前修改 | ${modified} | $($f.FullName)"
}
$totalBigMB = [math]::Round($totalBig / 1MB, 1)
Write-Host "  大文件总计: ${totalBigMB}MB"

# ========================================
# 第五部分：磁盘空间总览
# ========================================
Write-Host ""
Write-Host "=== 6. 磁盘空间总览 ===" -ForegroundColor Yellow
$drives = Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Used -gt 0 }
foreach ($d in $drives) {
    $freeGB = [math]::Round($d.Free / 1GB, 2)
    $usedGB = [math]::Round($d.Used / 1GB, 2)
    $totalGB = [math]::Round(($d.Free + $d.Used) / 1GB, 2)
    $pct = [math]::Round($d.Used / ($d.Used + $d.Free) * 100, 1)
    Write-Host "  $($d.Name) 盘: ${usedGB}GB / ${totalGB}GB (已用${pct}%) — 剩余${freeGB}GB"
}

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "扫描完成。输入 'clean' 开始清理，或按 Ctrl+C 取消。" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
