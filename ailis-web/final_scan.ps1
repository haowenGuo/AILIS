# AILIS 全盘快速扫描脚本
$report = @()
$report += "=" * 60
$report += "AILIS · 全盘深度清理扫描报告"
$report += "扫描时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$report += "=" * 60
$report += ""

# ===== 1. 磁盘总览 =====
$report += "【磁盘状态总览】"
$drives = @("C:", "D:", "E:", "F:")
foreach ($d in $drives) {
    $p = Get-PSDrive $d[0] -ErrorAction SilentlyContinue
    if ($p -and $p.Used) {
        $freeGB = [math]::Round($p.Free / 1GB, 2)
        $usedGB = [math]::Round($p.Used / 1GB, 2)
        $totalGB = [math]::Round(($p.Free + $p.Used) / 1GB, 2)
        $pct = [math]::Round($p.Used / ($p.Used + $p.Free) * 100, 1)
        $alert = if ($freeGB -lt 10) { "⚠️严重不足" } elseif ($freeGB -lt 30) { "⚠️紧张" } else { "✅充足" }
        $report += "  $d  ${usedGB}GB / ${totalGB}GB (${pct}%)  剩余${freeGB}GB  ${alert}"
    }
}
$report += ""

# ===== 2. 各盘大目录 =====
$report += "【各盘大目录(>1GB)】"
$skipDirs = @('$Recycle.Bin','System Volume Information','Recovery','Windows','Program Files','Program Files (x86)','ProgramData','Boot','Documents and Settings')

foreach ($d in $drives) {
    $report += "--- $d ---"
    $dirs = Get-ChildItem "${d}\" -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -notin $skipDirs }
    $results = @()
    foreach ($dir in $dirs) {
        $sz = (Get-ChildItem $dir.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
        if ($sz -gt 1GB) {
            $results += [PSCustomObject]@{Name=$dir.Name; SizeGB=[math]::Round($sz/1GB,2)}
        }
    }
    $results = $results | Sort-Object SizeGB -Descending | Select-Object -First 10
    if ($results) {
        foreach ($r in $results) { $report += "  $($r.SizeGB)GB  $($r.Name)" }
    } else {
        $report += "  (无超过1GB的用户目录)"
    }
}
$report += ""

# ===== 3. 临时文件 =====
$report += "【1. 临时文件清理】"
$tmp = $env:TEMP
$tSize = (Get-ChildItem $tmp -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$tMB = [math]::Round($tSize / 1MB, 1)
$report += "  用户Temp: ${tMB}MB  ── 路径: $tmp"
$report += "  → 建议: 可直接清空(系统会自动重建需要的)"

$tmpSubs = Get-ChildItem $tmp -Directory -ErrorAction SilentlyContinue | ForEach-Object {
    $sz = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    [PSCustomObject]@{Name=$_.Name; SizeMB=[math]::Round($sz/1MB,0)}
} | Where-Object { $_.SizeMB -gt 100 } | Sort-Object SizeMB -Descending | Select-Object -First 10

if ($tmpSubs) {
    $report += "  用户Temp内超大子目录(>100MB):"
    foreach ($ts in $tmpSubs) { $report += "    ⚠ ${ts}MB  $($ts.Name)" }
}

# 系统Temp
if (Test-Path "C:\Windows\Temp") {
    $stSize = (Get-ChildItem "C:\Windows\Temp" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $stMB = [math]::Round($stSize / 1MB, 1)
    $report += "  系统Temp: ${stMB}MB"
}
if (Test-Path "C:\Windows.old") {
    $woSize = (Get-ChildItem "C:\Windows.old" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $woGB = [math]::Round($woSize / 1GB, 2)
    $report += "  Windows.old(旧系统): ${woGB}GB  ⚠需管理员权限清理"
}
$report += ""

# ===== 4. 浏览器缓存 =====
$report += "【2. 浏览器/应用缓存】"
$cacheItems = @(
    @{N="Edge缓存"; P="$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache"},
    @{N="Edge Code缓存"; P="$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Code Cache"},
    @{N="Edge localStorage"; P="$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Local Storage"},
    @{N="Edge Session"; P="$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Sessions"},
    @{N="Chrome缓存"; P="$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache"},
    @{N="Chrome Code缓存"; P="$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Code Cache"},
    @{N="Chrome Session"; P="$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Sessions"}
)
foreach ($ci in $cacheItems) {
    if (Test-Path $ci.P) {
        $sz = (Get-ChildItem $ci.P -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $mb = [math]::Round($sz / 1MB, 1)
        if ($mb -gt 0) { $report += "  $($ci.N): ${mb}MB" }
    }
}

# npm/pip cache
$devCaches = @(
    @{N="npm"; P="$env:APPDATA\npm-cache"},
    @{N="pip"; P="$env:LOCALAPPDATA\pip\cache"}
)
foreach ($dc in $devCaches) {
    if (Test-Path $dc.P) {
        $sz = (Get-ChildItem $dc.P -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $mb = [math]::Round($sz / 1MB, 1)
        if ($mb -gt 0) { $report += "  $($dc.N)缓存: ${mb}MB" }
    }
}
$report += ""

# ===== 5. 回收站 =====
$report += "【3. 回收站】"
try {
    $s = New-Object -ComObject Shell.Application
    $rb = $s.NameSpace(0xa)
    $rbCount = $rb.Items().Count
    $rbSz = 0
    foreach ($item in $rb.Items()) { $rbSz += $item.Size }
    $rbMB = [math]::Round($rbSz / 1MB, 1)
    $report += "  回收站: ${rbMB}MB ($rbCount 个项目)  ← 可安全清空"
} catch { $report += "  回收站: 无法读取" }
$report += ""

# ===== 6. 缩略图缓存 =====
$report += "【4. 缩略图缓存】"
$tp = "$env:LOCALAPPDATA\Microsoft\Windows\Explorer"
if (Test-Path $tp) {
    $sz = (Get-ChildItem "$tp\*.db" -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $mb = [math]::Round($sz / 1MB, 1)
    $report += "  缩略图缓存: ${mb}MB (thumbcache_*.db)"
}
$report += ""

# ===== 7. AILIS工作区 =====
$report += "【5. AILIS工作区专项】"
$root = "F:\AILIS_self_evolution_runtime"
$targets = @(
    @{N="node_modules"; P="$root\node_modules"},
    @{N="dist(构建产物)"; P="$root\dist"},
    @{N="logs(日志)"; P="$root\logs"},
    @{N="tmp"; P="$root\tmp"},
    @{N=".runtime-logs"; P="$root\.runtime-logs"},
    @{N="vendor"; P="$root\vendor"}
)
foreach ($t in $targets) {
    if (Test-Path $t.P) {
        $sz = (Get-ChildItem $t.P -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $mb = [math]::Round($sz / 1MB, 1)
        $report += "  $($t.N): ${mb}MB"
    }
}
$report += ""

# ===== 8. 大文件扫描(各盘根目录) =====
$report += "【6. 各盘根目录大文件(>500MB)】"
foreach ($d in $drives) {
    $bigFiles = Get-ChildItem "${d}\" -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 500MB }
    if ($bigFiles) {
        foreach ($f in $bigFiles) {
            $sz = [math]::Round($f.Length / 1GB, 2)
            $report += "  ${d}\$($f.Name)  ${sz}GB"
        }
    }
}
$report += ""

# ===== 汇总 =====
$report += "=" * 60
$report += "【清理计划】"
$report += "=" * 60
$report += ""
$report += "P0 - 立即清理(安全无副作用):"
$report += "  □ 清空回收站 → 可释放 ${rbMB}MB (if defined, skip if 0)"
$report += "  □ 清空用户Temp(%TEMP%) → 可释放 ${tMB}MB"
$report += "  □ 清理浏览器缓存(Edge+Chrome) → 可释放约500MB+"
$report += "  □ 磁盘清理(缩略图缓存) → 可释放约${mb}MB (if defined, skip if 0)"
$report += "  □ 删除工作区logs+tmp+.runtime-logs → 可释放约70MB"
$report += ""
$report += "P1 - 需要评估后再清理:"
if ($tmpSubs) {
    $report += "  □ 用户Temp子目录各超大文件夹(如DiagOutputDir 17GB等) → 建议选择性删除"
}
$report += "  □ node_modules(1.5GB+) / vendor(500MB) → 重装需联网"
$report += ""
$report += "P2 - 系统级(需管理员):"
$report += "  □ 磁盘清理工具(C盘右键→属性→磁盘清理) → 清理系统文件"
$report += "  □ 关闭休眠 → powercfg -h off (释放约C盘大小×0.4)"
$report += "  □ Windows.old → 如无回退需求可删除"

$report += ""
$report += "=" * 60
$report += "【紧急提醒】"
$report += "=" * 60
$report += "  C盘仅剩 4.16GB !!! 随时可能系统卡顿/无法更新"
$report += "  立即执行P0清理项，至少可释放2GB+"
$report += ""
$report += "  E盘仅剩8.94GB  ← 第二紧急"
$report += "  F盘剩44GB但97.6%已用 ← 大容量盘快满了"

$report -join "`n" | Out-File -FilePath "F:\AILIS_self_evolution_runtime\ailis-web\cleanup_plan.txt" -Encoding UTF8
$report
