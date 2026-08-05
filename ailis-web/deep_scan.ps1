# AILIS 全盘深度清理扫描

$report = @()

# ========== 磁盘总览 ==========
$report += "=" * 60
$report += "AILIS · 全盘深度清理扫描报告"
$report += "扫描时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$report += "=" * 60
$report += ""

# 磁盘状态
$report += "【磁盘状态总览】"
$drives = Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Used -gt 0 }
foreach ($d in $drives) {
    $freeGB = [math]::Round($d.Free / 1GB, 2)
    $usedGB = [math]::Round($d.Used / 1GB, 2)
    $totalGB = [math]::Round(($d.Free + $d.Used) / 1GB, 2)
    $pct = [math]::Round($d.Used / ($d.Used + $d.Free) * 100, 1)
    $alert = if ($freeGB -lt 10) { "⚠️ 严重不足！" } elseif ($freeGB -lt 30) { "⚠️ 空间紧张" } else { "✅ 充足" }
    $report += "  $($d.Name)盘: ${usedGB}GB/$totalGB GB (${pct}%)  剩余 ${freeGB}GB  $alert"
}
$report += ""

# ========== 各盘大目录 TOP10 ==========
$report += "【各盘大目录 TOP 10（超过1GB的目录）】"
$scanDrives = @("C:", "D:", "E:", "F:")

foreach ($drv in $scanDrives) {
    $drvPath = "$drv\"
    if (-not (Test-Path $drvPath)) { continue }
    
    $report += "--- $drv 盘 ---"
    
    # 跳过系统保护目录，只扫普通用户目录
    $skipDirs = @('$Recycle.Bin','System Volume Information','Recovery','Windows','Program Files','Program Files (x86)','ProgramData','Boot','Documents and Settings')
    
    $topDirs = Get-ChildItem $drvPath -Directory -ErrorAction SilentlyContinue | 
        Where-Object { $_.Name -notin $skipDirs } | 
        ForEach-Object {
            $sz = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
            [PSCustomObject]@{Name=$_.Name; SizeGB=[math]::Round($sz/1GB, 2); Path=$_.FullName}
        } | Where-Object { $_.SizeGB -gt 1 } | Sort-Object SizeGB -Descending | Select-Object -First 10
    
    if ($topDirs) {
        foreach ($td in $topDirs) {
            $report += "  ${$td.SizeGB}GB  $($td.Name)"
        }
    } else {
        $report += "  (无超过1GB的用户目录)"
    }
}
$report += ""

# ========== 1. 临时文件汇总 ==========
$report += "【1. 临时文件清理】"
$report += "类目                    | 位置                                          | 大小"

# 用户Temp
$userTempSize = (Get-ChildItem $env:TEMP -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$userTempMB = [math]::Round($userTempSize / 1MB, 1)
$userTempDays = 0  # 清理建议全清
$report += "用户Temp               | $env:TEMP                                      | ${userTempMB}MB"

# 系统Temp
if (Test-Path "C:\Windows\Temp") {
    $sysTempSize = (Get-ChildItem "C:\Windows\Temp" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $sysTempMB = [math]::Round($sysTempSize / 1MB, 1)
    $report += "系统Temp               | C:\Windows\Temp                               | ${sysTempMB}MB"
}

# Prefetch
if (Test-Path "C:\Windows\Prefetch") {
    $pfSize = (Get-ChildItem "C:\Windows\Prefetch" -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $pfMB = [math]::Round($pfSize / 1MB, 1)
    $report += "Windows预取            | C:\Windows\Prefetch                          | ${pfMB}MB"
}

# SoftwareDistribution
if (Test-Path "C:\Windows\SoftwareDistribution\Download") {
    $sdSize = (Get-ChildItem "C:\Windows\SoftwareDistribution\Download" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $sdMB = [math]::Round($sdSize / 1MB, 1)
    $report += "更新缓存               | C:\Windows\SoftwareDistribution\Download     | ${sdMB}MB"
}

# Windows.old
if (Test-Path "C:\Windows.old") {
    $woSize = (Get-ChildItem "C:\Windows.old" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $woGB = [math]::Round($woSize / 1GB, 2)
    $report += "旧系统文件             | C:\Windows.old                               | ${woGB}GB"
}
$report += ""

# ========== 2. 浏览器缓存 ==========
$report += "【2. 浏览器/应用缓存清理】"
$cachePaths = @(
    @{Name="Edge缓存"; Path="$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache"},
    @{Name="Edge Code缓存"; Path="$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Code Cache"},
    @{Name="Edge服务Worker"; Path="$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Service Worker\CacheStorage"},
    @{Name="Chrome缓存"; Path="$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache"},
    @{Name="Chrome Code缓存"; Path="$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Code Cache"},
    @{Name="Chrome服务Worker"; Path="$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Service Worker\CacheStorage"},
    @{Name="npm缓存"; Path="$env:APPDATA\npm-cache"},
    @{Name="pip缓存"; Path="$env:LOCALAPPDATA\pip\cache"}
)

foreach ($cp in $cachePaths) {
    if (Test-Path $cp.Path) {
        $sz = (Get-ChildItem $cp.Path -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $szMB = [math]::Round($sz / 1MB, 1)
        if ($szMB -gt 0) {
            $report += "$($cp.Name)              | $($cp.Path)   | ${szMB}MB"
        }
    }
}
$report += ""

# ========== 3. 缩略图缓存 ==========
$report += "【3. 缩略图缓存清理】"
$thumbPath = "$env:LOCALAPPDATA\Microsoft\Windows\Explorer"
if (Test-Path $thumbPath) {
    $thSz = (Get-ChildItem $thumbPath -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $thMB = [math]::Round($thSz / 1MB, 1)
    $report += "缩略图缓存              | $thumbPath                                    | ${thMB}MB"
}

# 回收站
try {
    $shell = New-Object -ComObject Shell.Application
    $rb = $shell.NameSpace(0xa)
    $rbCount = $rb.Items().Count
    $rbSz = 0
    foreach ($item in $rb.Items()) { $rbSz += $item.Size }
    $rbMB = [math]::Round($rbSz / 1MB, 1)
    $report += "回收站                  | 系统                                            | ${rbMB}MB ($rbCount 个项目)"
} catch { $report += "回收站                  | 无法读取" }
$report += ""

# ========== 4. AILIS工作区 ==========
$report += "【4. AILIS工作区专项清理】"
$root = "F:\AILIS_self_evolution_runtime"
$ailisTargets = @(
    @{Name="node_modules (可重装)"; Path="$root\node_modules"},
    @{Name="dist (构建产物)"; Path="$root\dist"},
    @{Name="logs (日志文件)"; Path="$root\logs"},
    @{Name="tmp (临时)"; Path="$root\tmp"},
    @{Name=".runtime-logs"; Path="$root\.runtime-logs"},
    @{Name="vendor"; Path="$root\vendor"},
    @{Name="ailis-web (网页版)"; Path="$root\ailis-web"}
)
foreach ($at in $ailisTargets) {
    if (Test-Path $at.Path) {
        $sz = (Get-ChildItem $at.Path -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $szMB = [math]::Round($sz / 1MB, 1)
        $report += "$($at.Name)           | $($at.Path)          | ${szMB}MB"
    }
}

# 工作区所有 >100MB 文件
$report += "--- 工作区超大文件 ---"
$bigOnes = Get-ChildItem $root -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 100MB } | Sort-Object Length -Descending
foreach ($bo in $bigOnes) {
    $szGB = [math]::Round($bo.Length / 1GB, 2)
    $szMB = [math]::Round($bo.Length / 1MB, 1)
    $age = [math]::Round(((Get-Date) - $bo.LastWriteTime).TotalDays, 0)
    if ($szGB -ge 1) {
        $report += "  ${szGB}GB | ${age}天未改 | $($bo.Name)  ($($bo.Directory.FullName))"
    } else {
        $report += "  ${szMB}MB | ${age}天未改 | $($bo.Name)  ($($bo.Directory.FullName))"
    }
}
$report += ""

# ========== 5. 汇总 ==========
$report += "=" * 60
$report += "【清理计划汇总】"
$report += "=" * 60
$report += ""

# 计算可清理总计
$cleanable = @()
$cleanable += @{Item="用户Temp临时文件"; Size="$userTempMB MB"; 建议="✅ 可直接清空 — 没有重要数据"; 命令="清空 %TEMP%"}
$cleanable += @{Item="回收站"; Size="$rbMB MB"; 建议="✅ 可安全清空"; 命令="清空回收站"}
$cleanable += @{Item="Edge浏览器缓存"; Size="约300MB"; 建议="✅ 安全，重新浏览会自动生成"; 命令="清除Edge缓存"}
$cleanable += @{Item="Chrome浏览器缓存"; Size="约120MB"; 建议="✅ 安全"; 命令="清除Chrome缓存"}
$cleanable += @{Item="缩略图缓存"; Size="$thMB MB"; 建议="✅ 安全，系统会自动重建"; 命令="磁盘清理"}
$cleanable += @{Item="node_modules"; Size="约1.5GB"; 建议="⚠️ 重装需要联网 npm install"; 命令="删除后 npm install"}
$cleanable += @{Item="logs日志"; Size="约54MB"; 建议="✅ 可直接删除"; 命令="删除logs目录"}
$cleanable += @{Item="工作区tmp"; Size="约14MB"; 建议="✅ 可直接删除"; 命令="删除tmp目录"}

$report += "优先级 | 清理项 | 可释放 | 风险 | 说明"
$report += "-" * 70
$report += "  P0    | 清空回收站      | ${rbMB}MB     | 低    | 永久删除已回收的文件"
$report += "  P0    | 清空 Temp       | ${userTempMB}MB  | 低    | 释放C盘/F盘大量空间"
$report += "  P0    | 清理 Edge/Chrome缓存 | ~400MB  | 低    | 浏览器缓存可重新生成"
if ($userTempMB -gt 1000) {
    $report += "  P1    | 清空用户Temp子目录 | 大文件夹建议选择性清理 | 低-中 | DiagOutputDir(17GB)疑似诊断日志"
}
$report += "  P1    | 删除工作区logs/tmp | ~68MB   | 低    | 运行日志可删除"
$report += "  P2    | node_modules重装 | ~1.5GB  | 中    | 需联网重新安装"
$report += ""

$report += "=" * 60
$report += "【紧急建议】"
$report += "=" * 60
$report += ""
$report += "  C盘仅剩 4.16GB！ 建议立即清理:"
$report += "    1. 清空回收站"
$report += "    2. 清理用户Temp"
$report += "    3. Windows磁盘清理(删除临时文件、缩略图缓存)"
$report += ""
$report += "  E盘仅剩 8.94GB！"
$report += "    建议清理 E:\ 根目录下的不需要的大文件"
$report += ""
$report += "  F盘剩 44.1GB (97.6%已用):"
$report += "    可清理 node_modules (~1.5GB) 和 vendor (~500MB)"

$report | Out-File -FilePath "F:\AILIS_self_evolution_runtime\ailis-web\cleanup_plan.txt" -Encoding UTF8
$report
