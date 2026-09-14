param([string]$AsrRuntimeRoot = '')
$ErrorActionPreference = 'Stop'
$taskRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$taskElectron = Join-Path $taskRoot 'node_modules\electron\dist\electron.exe'
$taskChat = Join-Path $taskRoot 'dist\chat.html'
if (!(Test-Path -LiteralPath $taskElectron) -or !(Test-Path -LiteralPath $taskChat)) {
    throw '缺少开发运行环境或构建产物，请先在此工作树运行 pnpm build:desktop。'
}
$taskLogDir = Join-Path $taskRoot 'tmp\task-interaction-preview-logs'
New-Item -ItemType Directory -Path $taskLogDir -Force | Out-Null
$taskStamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
$taskRuntimeConfig = Join-Path $taskRoot 'tmp\task-interaction-runtime.json'
if (!$AsrRuntimeRoot -and (Test-Path -LiteralPath $taskRuntimeConfig)) {
    $AsrRuntimeRoot = (Get-Content -LiteralPath $taskRuntimeConfig -Raw | ConvertFrom-Json).asrRuntimeRoot
}
if ($AsrRuntimeRoot) {
    $AsrRuntimeRoot = (Resolve-Path -LiteralPath $AsrRuntimeRoot).Path
    $taskManifest = Get-Content -LiteralPath (Join-Path $AsrRuntimeRoot 'manifest.json') -Raw | ConvertFrom-Json
    if ($taskManifest.platform -ne 'win32' -or $taskManifest.arch -ne 'x64' -or $taskManifest.selfContained -ne $true) {
        throw '测试版 ASR 需要已验证的 Windows x64 自包含运行库。'
    }
}
$taskNames = @('AILIS_TASK_INTERACTION_PREVIEW', 'AILIS_WORLD_SERVICE_ONLY', 'AILIS_SHARED_USER_DATA_DIR', 'AILIS_DESKTOP_DEV_URL', 'ELECTRON_RUN_AS_NODE', 'AILIS_ASR_RUNTIME_DIR', 'AILIS_ASR_LOCAL_ONLY')
$taskSaved = @{}
foreach ($taskName in $taskNames) { $taskSaved[$taskName] = [Environment]::GetEnvironmentVariable($taskName, 'Process') }
try {
    foreach ($taskName in $taskNames) { if (Test-Path "Env:$taskName") { Remove-Item "Env:$taskName" } }
    $env:AILIS_TASK_INTERACTION_PREVIEW = '1'
    if ($AsrRuntimeRoot) { $env:AILIS_ASR_RUNTIME_DIR = $AsrRuntimeRoot; $env:AILIS_ASR_LOCAL_ONLY = '1' }
    $taskProcess = Start-Process -FilePath $taskElectron -ArgumentList '.' -WorkingDirectory $taskRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $taskLogDir "$taskStamp-out.log") -RedirectStandardError (Join-Path $taskLogDir "$taskStamp-error.log")
    Write-Output "任务交互测试版 PID: $($taskProcess.Id)"
    Write-Output "独立配置与测试目录: $(Join-Path $taskRoot 'tmp\task-interaction-profile')"
    Write-Output '不会覆盖正式配置。新窗口使用独立配置；如需 API 直连，请在测试版设置中自行配置。'
    if ($AsrRuntimeRoot) { Write-Output "复用本地 ASR 运行库（不安装/升级）: $AsrRuntimeRoot" }
} finally {
    foreach ($taskName in $taskNames) {
        if ($null -eq $taskSaved[$taskName]) { if (Test-Path "Env:$taskName") { Remove-Item "Env:$taskName" } }
        else { [Environment]::SetEnvironmentVariable($taskName, $taskSaved[$taskName], 'Process') }
    }
}
