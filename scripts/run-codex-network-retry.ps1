param(
    [string]$CampaignRoot = 'F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-desktop-real\p1-vs-codex-validation165-20260728',
    [ValidateRange(1, 4)]
    [int]$Concurrency = 4,
    [string]$RetryDirName = 'codex-network-retry-round1',
    [ValidateRange(1, 165)]
    [int]$ExpectedTasks = 103
)

$ErrorActionPreference = 'Stop'
$node = 'F:\Nodejs\node.exe'
$p1Path = 'F:\AILIS_self_evolution_runtime-gaia-p1-gate-7ba2cf7'
$p1Commit = '7ba2cf77628f793ad70abb5bd9577d5d41c1ba0b'
$fixedCodexHome = 'F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-desktop-real\candidate-p10-viewport-link-refs-c0d24be-focused-20260727\fixed-codex-home'
$preflightScript = 'F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-desktop-real\p0-p10-mini20-score-20260728\preflight-candidate.mjs'
$nativeRunner = 'F:\AILIS_self_evolution_runtime\scripts\run-codex-native-gaia-mini20.mjs'
$scorerModule = Join-Path $p1Path 'scripts\run-ailis-desktop-real-gaia-eval.mjs'
$retryDir = Join-Path $CampaignRoot $RetryDirName
$sourcePath = Join-Path $retryDir 'source.jsonl'
$manifestPath = Join-Path $retryDir 'manifest.json'
$statePath = Join-Path $retryDir 'controller.state.json'
$eventsPath = Join-Path $retryDir 'controller.events.jsonl'

function Write-Json {
    param([string]$Path, [object]$Value)
    [IO.File]::WriteAllText(
        $Path,
        "$($Value | ConvertTo-Json -Depth 30)`n",
        [Text.UTF8Encoding]::new($false)
    )
}

function Write-Event {
    param([string]$Type, [hashtable]$Data)
    $event = [ordered]@{
        ts = (Get-Date).ToUniversalTime().ToString('o')
        type = $Type
    }
    foreach ($key in $Data.Keys) {
        $event[$key] = $Data[$key]
    }
    [IO.File]::AppendAllText(
        $eventsPath,
        "$($event | ConvertTo-Json -Compress -Depth 30)`n",
        [Text.UTF8Encoding]::new($false)
    )
}

function Completed-Count {
    $progress = Join-Path $retryDir 'progress.jsonl'
    if (-not (Test-Path -LiteralPath $progress)) {
        return 0
    }
    return @(Get-Content -LiteralPath $progress | Where-Object { $_.Trim() }).Count
}

function Set-State {
    param([string]$Status, [int]$ChildPid = 0, [string]$Message = '', [object]$Metrics = $null)
    Write-Json -Path $statePath -Value ([ordered]@{
        status = $Status
        updatedAt = (Get-Date).ToUniversalTime().ToString('o')
        controllerPid = $PID
        childPid = $ChildPid
        concurrency = $Concurrency
        expectedTasks = $ExpectedTasks
        completedTasks = Completed-Count
        p1Commit = $p1Commit
        sourceSha256 = '0acd28eb614a756dfd6160c23c627641d8abae06bfe60ccd192c67adf8878538'
        metrics = $Metrics
        message = $Message
    })
}

foreach ($required in @(
    $node,
    $p1Path,
    $fixedCodexHome,
    (Join-Path $fixedCodexHome 'auth.json'),
    $preflightScript,
    $nativeRunner,
    $scorerModule,
    $sourcePath,
    $manifestPath
)) {
    if (-not (Test-Path -LiteralPath $required)) {
        throw "Required input is missing: $required"
    }
}
if (Test-Path -LiteralPath $statePath) {
    throw "Retry controller already exists: $statePath"
}
$head = (& git -C $p1Path rev-parse HEAD).Trim()
if ($head -ne $p1Commit) {
    throw "P1 scorer commit mismatch: expected $p1Commit, got $head"
}
$sourceRows = @(Get-Content -LiteralPath $sourcePath | Where-Object { $_.Trim() })
if ($sourceRows.Count -ne $ExpectedTasks) {
    throw "Expected $ExpectedTasks retry tasks, got $($sourceRows.Count)"
}

$env:NODE_PATH = 'F:\AILIS_self_evolution_runtime\node_modules'
$env:CODEX_HOME = $fixedCodexHome
$env:AILIS_CODEX_HOME = $fixedCodexHome
$env:NO_COLOR = '1'
try {
    Set-State -Status 'preflight'
    Write-Event -Type 'retry.preflight_started' -Data @{
        controllerPid = $PID
        affectedTasks = $ExpectedTasks
        concurrency = $Concurrency
    }
    $preflightDir = Join-Path $retryDir 'preflight'
    New-Item -ItemType Directory -Path $preflightDir -Force | Out-Null
    $preflightStdout = Join-Path $preflightDir 'stdout.json'
    $preflightStderr = Join-Path $preflightDir 'stderr.log'
    $preflight = Start-Process -FilePath $node `
        -ArgumentList @($preflightScript, $p1Path) `
        -WorkingDirectory $p1Path `
        -RedirectStandardOutput $preflightStdout `
        -RedirectStandardError $preflightStderr `
        -WindowStyle Hidden `
        -PassThru
    $preflight.WaitForExit()
    $preflightError = if (Test-Path -LiteralPath $preflightStderr) {
        [IO.File]::ReadAllText($preflightStderr).Trim()
    } else {
        ''
    }
    $preflightReport = Get-Content -Raw -LiteralPath $preflightStdout | ConvertFrom-Json
    if ($preflightError -or $preflightReport.ok -ne $true -or [int64]$preflightReport.totalTokens -le 0) {
        throw "Fixed-auth preflight failed: $preflightError"
    }
    Write-Event -Type 'retry.preflight_passed' -Data @{
        durationMs = $preflightReport.durationMs
        totalTokens = $preflightReport.totalTokens
    }

    $stdout = Join-Path $retryDir 'runner.stdout.log'
    $stderr = Join-Path $retryDir 'runner.stderr.log'
    $child = Start-Process -FilePath $node `
        -ArgumentList @(
            $nativeRunner,
            '--source-jsonl', $sourcePath,
            '--manifest', $manifestPath,
            '--benchmark', 'gaia-validation165-codex-network-retry',
            '--expected-tasks', ([string]$ExpectedTasks),
            '--output-dir', $retryDir,
            '--model', 'gpt-5.5',
            '--reasoning-effort', 'medium',
            '--concurrency', ([string]$Concurrency),
            '--timeout-ms', '600000',
            '--scorer-module', $scorerModule
        ) `
        -WorkingDirectory $p1Path `
        -RedirectStandardOutput $stdout `
        -RedirectStandardError $stderr `
        -WindowStyle Hidden `
        -PassThru
    Set-State -Status 'running' -ChildPid $child.Id
    Write-Event -Type 'retry.started' -Data @{
        childPid = $child.Id
        concurrency = $Concurrency
    }
    while (-not $child.HasExited) {
        Start-Sleep -Seconds 15
        Set-State -Status 'running' -ChildPid $child.Id
        $child.Refresh()
    }

    $resultsPath = Join-Path $retryDir 'results.jsonl'
    if (-not (Test-Path -LiteralPath $resultsPath)) {
        throw 'Retry runner exited without results.jsonl.'
    }
    $rows = @(
        Get-Content -LiteralPath $resultsPath |
            Where-Object { $_.Trim() } |
            ForEach-Object { $_ | ConvertFrom-Json }
    )
    if ($rows.Count -ne $ExpectedTasks -or @($rows.task_id | Sort-Object -Unique).Count -ne $ExpectedTasks) {
        throw "Retry result is incomplete: rows=$($rows.Count), unique=$(@($rows.task_id | Sort-Object -Unique).Count)"
    }
    $metrics = [ordered]@{
        rows = $rows.Count
        responseOk = @($rows | Where-Object { $_.responseOk }).Count
        visibleCorrect = @($rows | Where-Object { $_.visible_score.ok }).Count
        remainingTimeouts = @($rows | Where-Object { $_.timedOut }).Count
        remainingProcessIncomplete = @($rows | Where-Object { $_.status -eq 'codex_process_incomplete' }).Count
    }
    Set-State -Status 'completed' -ChildPid 0 -Metrics $metrics
    Write-Event -Type 'retry.completed' -Data @{
        rows = $metrics.rows
        responseOk = $metrics.responseOk
        visibleCorrect = $metrics.visibleCorrect
        remainingTimeouts = $metrics.remainingTimeouts
        remainingProcessIncomplete = $metrics.remainingProcessIncomplete
    }
    exit 0
} catch {
    Set-State -Status 'infrastructure_failed' -Message $_.Exception.Message
    Write-Event -Type 'retry.infrastructure_failed' -Data @{
        error = $_.Exception.Message
    }
    [IO.File]::AppendAllText(
        (Join-Path $retryDir 'controller.stderr.log'),
        "$($_.Exception.ToString())`n",
        [Text.UTF8Encoding]::new($false)
    )
    exit 1
}
