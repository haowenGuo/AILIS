param(
    [string]$CampaignRoot = 'F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-desktop-real\p1-vs-codex-validation165-20260728',
    [ValidateRange(1, 10)]
    [int]$WorkersPerAgent = 10,
    [switch]$ReuseCompletedCodex
)

$ErrorActionPreference = 'Stop'
$node = 'F:\Nodejs\node.exe'
$p1Path = 'F:\AILIS_self_evolution_runtime-gaia-p1-gate-7ba2cf7'
$p1Commit = '7ba2cf77628f793ad70abb5bd9577d5d41c1ba0b'
$fixedCodexHome = 'F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-desktop-real\candidate-p10-viewport-link-refs-c0d24be-focused-20260727\fixed-codex-home'
$miniRoot = 'F:\AILIS_self_evolution_runtime\eval-results\engineering\gaia-desktop-real\p0-p10-mini20-score-20260728'
$preflightScript = Join-Path $miniRoot 'preflight-candidate.mjs'
$p1Runner = Join-Path $p1Path 'scripts\run-ailis-desktop-real-gaia-eval.mjs'
$codexRunner = 'F:\AILIS_self_evolution_runtime\scripts\run-codex-native-gaia-mini20.mjs'
$aggregateScript = 'F:\AILIS_self_evolution_runtime\scripts\aggregate-gaia-validation165.mjs'
$manifestPath = Join-Path $CampaignRoot 'gaia-validation165.manifest.json'
$sourcePath = Join-Path $CampaignRoot 'gaia-validation165.source.jsonl'
$statePath = Join-Path $CampaignRoot 'controller.state.json'
$eventsPath = Join-Path $CampaignRoot 'controller.events.jsonl'
$controllerStdout = Join-Path $CampaignRoot 'controller.stdout.log'
$controllerStderr = Join-Path $CampaignRoot 'controller.stderr.log'
$codexWorkerCount = if ($ReuseCompletedCodex) { 0 } else { $WorkersPerAgent }
$featureFlags = @(
    'AILIS_SHADOW_CONTEXT',
    'AILIS_CANONICAL_FINALIZATION_MODE',
    'AILIS_CODEX_LONG_HORIZON',
    'AILIS_STABLE_TOOL_SURFACE'
)

function Write-JsonFile {
    param([string]$Path, [object]$Value)
    $json = $Value | ConvertTo-Json -Depth 30
    [IO.File]::WriteAllText($Path, "$json`n", [Text.UTF8Encoding]::new($false))
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

function Result-Count {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) {
        return 0
    }
    return @(
        Get-Content -LiteralPath $Path |
            Where-Object { $_.Trim() }
    ).Count
}

function Process-State {
    param([object]$Process, [string]$Name, [string]$CompletedPath)
    $Process.Refresh()
    return [ordered]@{
        name = $Name
        pid = $Process.Id
        hasExited = $Process.HasExited
        exitCode = if ($Process.HasExited) { $Process.ExitCode } else { $null }
        completedTasks = Result-Count -Path $CompletedPath
    }
}

function Set-State {
    param([string]$Status, [array]$Workers, [string]$Message = '')
    Write-JsonFile -Path $statePath -Value ([ordered]@{
        status = $Status
        updatedAt = (Get-Date).ToUniversalTime().ToString('o')
        controllerPid = $PID
        campaign = 'p1-vs-codex-validation165-20260728'
        primaryAilisCandidate = [ordered]@{
            name = 'P1'
            commit = $p1Commit
            worktree = $p1Path
            selectionBasis = 'User-selected new primary after mini20 score 14/20.'
            historicalCaveat = 'P1 historical L1 two-run mean was 90.57%, below P0 91.51%.'
        }
        protocol = [ordered]@{
            tasks = 165
            levels = [ordered]@{ L1 = 53; L2 = 86; L3 = 26 }
            model = 'gpt-5.5'
            reasoningEffort = 'medium'
            hardTimeoutMs = 600000
            llmTimeoutMsP1 = 360000
            maxAgentStepsP1 = 20
            p1Workers = $WorkersPerAgent
            codexWorkers = $codexWorkerCount
            reuseCompletedCodex = [bool]$ReuseCompletedCodex
            noResume = $true
        }
        workers = $Workers
        message = $Message
    })
}

function Assert-Inputs {
    foreach ($required in @(
        $node,
        $p1Path,
        $fixedCodexHome,
        (Join-Path $fixedCodexHome 'auth.json'),
        $preflightScript,
        $p1Runner,
        $codexRunner,
        $aggregateScript,
        $manifestPath,
        $sourcePath
    )) {
        if (-not (Test-Path -LiteralPath $required)) {
            throw "Required input is missing: $required"
        }
    }
    $head = (& git -C $p1Path rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0 -or $head -ne $p1Commit) {
        throw "P1 commit mismatch: expected $p1Commit, got $head"
    }
    $dirty = @(& git -C $p1Path status --porcelain)
    if ($LASTEXITCODE -ne 0 -or $dirty.Count -gt 0) {
        throw "P1 worktree is not clean: $p1Path"
    }
    $manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
    if ([int]$manifest.questionCount -ne 165 -or @($manifest.tasks).Count -ne 165) {
        throw 'The immutable manifest does not contain exactly 165 tasks.'
    }
    $ids = @($manifest.tasks | ForEach-Object { $_.task_id })
    if (@($ids | Sort-Object -Unique).Count -ne 165) {
        throw 'The immutable manifest does not contain 165 unique task IDs.'
    }
    if ($ReuseCompletedCodex) {
        $codexResults = Join-Path $CampaignRoot 'codex\results.jsonl'
        $codexSummary = Join-Path $CampaignRoot 'codex\summary.json'
        $codexStderr = Join-Path $CampaignRoot 'codex\runner.stderr.log'
        foreach ($required in @($codexResults, $codexSummary, $codexStderr)) {
            if (-not (Test-Path -LiteralPath $required)) {
                throw "Completed Codex artifact is missing: $required"
            }
        }
        $codexRows = @(
            Get-Content -LiteralPath $codexResults |
                Where-Object { $_.Trim() } |
                ForEach-Object { $_ | ConvertFrom-Json }
        )
        if (
            $codexRows.Count -ne 165 -or
            @($codexRows.task_id | Sort-Object -Unique).Count -ne 165 -or
            (Get-Item -LiteralPath $codexStderr).Length -ne 0
        ) {
            throw 'Existing Codex result failed the 165-row completeness or stderr gate.'
        }
    }
}

function Set-EvaluationEnvironment {
    foreach ($flag in $featureFlags) {
        Remove-Item "Env:\$flag" -ErrorAction SilentlyContinue
    }
    $env:NODE_PATH = 'F:\AILIS_self_evolution_runtime\node_modules'
    $env:CODEX_HOME = $fixedCodexHome
    $env:AILIS_CODEX_HOME = $fixedCodexHome
    $env:NO_COLOR = '1'
}

function Invoke-P1Preflight {
    $preflightDir = Join-Path $CampaignRoot 'preflight'
    New-Item -ItemType Directory -Path $preflightDir -Force | Out-Null
    $stdout = Join-Path $preflightDir 'p1.stdout.json'
    $stderr = Join-Path $preflightDir 'p1.stderr.log'
    $process = Start-Process -FilePath $node `
        -ArgumentList @($preflightScript, $p1Path) `
        -WorkingDirectory $p1Path `
        -RedirectStandardOutput $stdout `
        -RedirectStandardError $stderr `
        -WindowStyle Hidden `
        -PassThru
    $process.WaitForExit()
    $exitCode = $null
    try {
        $process.Refresh()
        $exitCode = $process.ExitCode
    } catch {}
    $stderrText = if (Test-Path -LiteralPath $stderr) { [IO.File]::ReadAllText($stderr).Trim() } else { '' }
    if (($null -ne $exitCode -and $exitCode -ne 0) -or $stderrText) {
        throw "P1 fixed-auth preflight failed: exit=$exitCode, stderr=$stderrText"
    }
    $report = Get-Content -Raw -LiteralPath $stdout | ConvertFrom-Json
    if ($report.ok -ne $true -or [int64]$report.totalTokens -le 0) {
        throw 'P1 fixed-auth preflight returned zero tokens or an invalid result.'
    }
    return $report
}

function Start-P1Shard {
    param([int]$Shard)
    $outputDir = Join-Path $CampaignRoot "p1\shard-$Shard"
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    if (@(Get-ChildItem -LiteralPath $outputDir -Force).Count -gt 0) {
        throw "P1 shard output is not empty: $outputDir"
    }
    $runId = "gaia-validation165-p1-shard-$Shard-20260728"
    $stdout = Join-Path $outputDir 'runner.stdout.log'
    $stderr = Join-Path $outputDir 'runner.stderr.log'
    $arguments = @(
        $p1Runner,
        '--source-jsonl', (Join-Path $CampaignRoot "gaia-validation165.shard-$Shard.source.jsonl"),
        '--source-summary', (Join-Path $CampaignRoot "gaia-validation165.shard-$Shard.source-summary.json"),
        '--output-dir', $outputDir,
        '--run-id', $runId,
        '--isolated-workspace',
        '--direct-tool-executor',
        '--agent-role', 'persona_orchestrator',
        '--codex-model-bridge',
        '--codex-model', 'gpt-5.5',
        '--codex-reasoning-effort', 'medium',
        '--max-agent-steps', '20',
        '--request-timeout-ms', '600000',
        '--llm-timeout-ms', '360000',
        '--no-resume'
    )
    return Start-Process -FilePath $node `
        -ArgumentList $arguments `
        -WorkingDirectory $p1Path `
        -RedirectStandardOutput $stdout `
        -RedirectStandardError $stderr `
        -WindowStyle Hidden `
        -PassThru
}

function Start-Codex {
    $outputDir = Join-Path $CampaignRoot 'codex'
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    if (@(Get-ChildItem -LiteralPath $outputDir -Force).Count -gt 0) {
        throw "Codex output is not empty: $outputDir"
    }
    return Start-Process -FilePath $node `
        -ArgumentList @(
            $codexRunner,
            '--source-jsonl', $sourcePath,
            '--manifest', $manifestPath,
            '--benchmark', 'gaia-validation165',
            '--expected-tasks', '165',
            '--output-dir', $outputDir,
            '--model', 'gpt-5.5',
            '--reasoning-effort', 'medium',
            '--concurrency', ([string]$WorkersPerAgent),
            '--timeout-ms', '600000',
            '--scorer-module', $p1Runner
        ) `
        -WorkingDirectory $p1Path `
        -RedirectStandardOutput (Join-Path $outputDir 'runner.stdout.log') `
        -RedirectStandardError (Join-Path $outputDir 'runner.stderr.log') `
        -WindowStyle Hidden `
        -PassThru
}

New-Item -ItemType Directory -Path $CampaignRoot -Force | Out-Null
if (Test-Path -LiteralPath $statePath) {
    throw "Controller state already exists; refusing a duplicate run: $statePath"
}

try {
    Assert-Inputs
    Set-EvaluationEnvironment
    Set-State -Status 'preflight' -Workers @()
    Write-Event -Type 'campaign.preflight_started' -Data @{
        controllerPid = $PID
        p1Commit = $p1Commit
        taskCount = 165
    }
    $preflight = Invoke-P1Preflight
    Write-Event -Type 'campaign.preflight_passed' -Data @{
        durationMs = $preflight.durationMs
        totalTokens = $preflight.totalTokens
    }

    $p1Processes = @()
    for ($shard = 1; $shard -le $WorkersPerAgent; $shard += 1) {
        $p1Processes += Start-P1Shard -Shard $shard
    }
    $codexProcess = if ($ReuseCompletedCodex) { $null } else { Start-Codex }
    $allProcesses = @($p1Processes)
    if ($null -ne $codexProcess) {
        $allProcesses += $codexProcess
    }
    $workerStates = @()
    for ($index = 0; $index -lt $p1Processes.Count; $index += 1) {
        $shard = $index + 1
        $workerStates += Process-State `
            -Process $p1Processes[$index] `
            -Name "p1-shard-$shard" `
            -CompletedPath (Join-Path $CampaignRoot "p1\shard-$shard\gaia-validation165-p1-shard-$shard-20260728.jsonl")
    }
    if ($null -ne $codexProcess) {
        $workerStates += Process-State `
            -Process $codexProcess `
            -Name "codex-$WorkersPerAgent-workers" `
            -CompletedPath (Join-Path $CampaignRoot 'codex\progress.jsonl')
    } else {
        $workerStates += [ordered]@{
            name = 'codex-complete-reused'
            pid = 0
            hasExited = $true
            exitCode = 0
            completedTasks = 165
        }
    }
    Set-State -Status 'running' -Workers $workerStates
    Write-Event -Type 'campaign.started' -Data @{
        p1ChildPids = @($p1Processes | ForEach-Object { $_.Id })
        codexChildPid = if ($null -ne $codexProcess) { $codexProcess.Id } else { 0 }
        p1Workers = $WorkersPerAgent
        codexWorkers = $codexWorkerCount
        reusedCompletedCodex = [bool]$ReuseCompletedCodex
    }

    while (@($allProcesses | Where-Object { -not $_.HasExited }).Count -gt 0) {
        Start-Sleep -Seconds 15
        $workerStates = @()
        for ($index = 0; $index -lt $p1Processes.Count; $index += 1) {
            $shard = $index + 1
            $workerStates += Process-State `
                -Process $p1Processes[$index] `
                -Name "p1-shard-$shard" `
                -CompletedPath (Join-Path $CampaignRoot "p1\shard-$shard\gaia-validation165-p1-shard-$shard-20260728.jsonl")
        }
        if ($null -ne $codexProcess) {
            $workerStates += Process-State `
                -Process $codexProcess `
                -Name "codex-$WorkersPerAgent-workers" `
                -CompletedPath (Join-Path $CampaignRoot 'codex\progress.jsonl')
        } else {
            $workerStates += [ordered]@{
                name = 'codex-complete-reused'
                pid = 0
                hasExited = $true
                exitCode = 0
                completedTasks = 165
            }
        }
        Set-State -Status 'running' -Workers $workerStates
    }

    $exitFailures = @($allProcesses | Where-Object {
        $workerExitCode = $null
        try {
            $_.Refresh()
            $workerExitCode = $_.ExitCode
        } catch {}
        $null -ne $workerExitCode -and $workerExitCode -ne 0
    })
    if ($exitFailures.Count -gt 0) {
        throw "One or more workers exited nonzero: $(@($exitFailures | ForEach-Object { ""$($_.Id):$($_.ExitCode)"" }) -join ', ')"
    }
    $aggregateStdout = Join-Path $CampaignRoot 'aggregate.stdout.log'
    $aggregateStderr = Join-Path $CampaignRoot 'aggregate.stderr.log'
    $aggregate = Start-Process -FilePath $node `
        -ArgumentList @($aggregateScript, $CampaignRoot) `
        -WorkingDirectory $p1Path `
        -RedirectStandardOutput $aggregateStdout `
        -RedirectStandardError $aggregateStderr `
        -WindowStyle Hidden `
        -PassThru
    $aggregate.WaitForExit()
    $aggregateExitCode = $null
    try {
        $aggregate.Refresh()
        $aggregateExitCode = $aggregate.ExitCode
    } catch {}
    if ($null -ne $aggregateExitCode -and $aggregateExitCode -ne 0) {
        $errorText = if (Test-Path -LiteralPath $aggregateStderr) {
            [IO.File]::ReadAllText($aggregateStderr).Trim()
        } else {
            ''
        }
        throw "Aggregation failed: exit=$aggregateExitCode, stderr=$errorText"
    }
    Set-State -Status 'completed' -Workers $workerStates -Message '165/165 complete for P1 and native Codex.'
    Write-Event -Type 'campaign.completed' -Data @{
        comparisonJson = (Join-Path $CampaignRoot 'comparison.json')
        comparisonMarkdown = (Join-Path $CampaignRoot 'comparison.md')
    }
    exit 0
} catch {
    Set-State -Status 'infrastructure_failed' -Workers @() -Message $_.Exception.Message
    Write-Event -Type 'campaign.infrastructure_failed' -Data @{
        error = $_.Exception.Message
    }
    [IO.File]::AppendAllText(
        $controllerStderr,
        "$($_.Exception.ToString())`n",
        [Text.UTF8Encoding]::new($false)
    )
    exit 1
}
