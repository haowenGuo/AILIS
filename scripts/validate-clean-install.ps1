param(
    [Parameter(Mandatory = $true)]
    [string]$ArtifactRoot,

    [string]$ExpectedVersion = "1.4.0",

    [string]$ReportRoot = ""
)

$ErrorActionPreference = "Stop"
$ArtifactRoot = (Resolve-Path -LiteralPath $ArtifactRoot).Path
if (-not $ReportRoot) {
    $ReportRoot = Join-Path $env:RUNNER_TEMP "ailis-clean-install-report"
}
New-Item -ItemType Directory -Force -Path $ReportRoot | Out-Null

$report = [ordered]@{
    schemaVersion = 1
    version = $ExpectedVersion
    startedAt = (Get-Date).ToUniversalTime().ToString("o")
    runner = [ordered]@{
        os = [System.Environment]::OSVersion.VersionString
        machine = $env:COMPUTERNAME
        user = $env:USERNAME
        powershell = $PSVersionTable.PSVersion.ToString()
    }
    checks = @()
    artifacts = @()
    success = $false
}

function Add-Check {
    param(
        [string]$Name,
        [bool]$Ok,
        [string]$Detail
    )
    $script:report.checks += [ordered]@{
        name = $Name
        ok = $Ok
        detail = $Detail
        at = (Get-Date).ToUniversalTime().ToString("o")
    }
    if (-not $Ok) {
        throw "$Name failed: $Detail"
    }
}

function Stop-AilisProcesses {
    Get-Process -Name "AILIS" -ErrorAction SilentlyContinue |
        Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

function Assert-AppStaysRunning {
    param(
        [string]$Executable,
        [string]$Label,
        [int]$WaitSeconds = 35
    )

    $stdoutPath = Join-Path $ReportRoot "$Label.stdout.log"
    $stderrPath = Join-Path $ReportRoot "$Label.stderr.log"
    $env:ELECTRON_ENABLE_LOGGING = "1"
    $process = Start-Process -FilePath $Executable `
        -ArgumentList @("--disable-gpu", "--enable-logging") `
        -PassThru `
        -RedirectStandardOutput $stdoutPath `
        -RedirectStandardError $stderrPath

    Start-Sleep -Seconds $WaitSeconds
    $running = Get-Process -Name "AILIS" -ErrorAction SilentlyContinue
    $detail = if ($running) {
        "AILIS remained active for ${WaitSeconds}s; pids=$($running.Id -join ',')"
    } elseif ($process.HasExited) {
        "AILIS exited early with code $($process.ExitCode)"
    } else {
        "AILIS process was not discoverable after ${WaitSeconds}s"
    }
    Add-Check -Name "$Label-first-launch" -Ok ([bool]$running) -Detail $detail
    Stop-AilisProcesses
}

try {
    $checksumPath = Join-Path $ArtifactRoot "SHA256SUMS.txt"
    Add-Check -Name "checksum-manifest-present" -Ok (Test-Path -LiteralPath $checksumPath) -Detail $checksumPath

    foreach ($line in Get-Content -LiteralPath $checksumPath) {
        if ($line -notmatch "^([A-Fa-f0-9]{64})\s{2}(.+)$") {
            throw "Invalid checksum line: $line"
        }
        $expectedHash = $Matches[1].ToUpperInvariant()
        $relativePath = $Matches[2]
        $artifactPath = Join-Path $ArtifactRoot $relativePath
        $exists = Test-Path -LiteralPath $artifactPath
        Add-Check -Name "artifact-present:$relativePath" -Ok $exists -Detail $artifactPath
        $actualHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $artifactPath).Hash.ToUpperInvariant()
        Add-Check -Name "artifact-sha256:$relativePath" -Ok ($actualHash -eq $expectedHash) -Detail $actualHash
        $item = Get-Item -LiteralPath $artifactPath
        $report.artifacts += [ordered]@{
            file = $relativePath
            bytes = $item.Length
            sha256 = $actualHash
        }
    }

    $setup = Get-ChildItem -LiteralPath $ArtifactRoot -Filter "AILIS-Setup-$ExpectedVersion-win-x64.exe" | Select-Object -First 1
    $portable = Get-ChildItem -LiteralPath $ArtifactRoot -Filter "AILIS-Portable-$ExpectedVersion-win-x64.exe" | Select-Object -First 1
    Add-Check -Name "setup-package-found" -Ok ([bool]$setup) -Detail ($setup.FullName ?? "missing")
    Add-Check -Name "portable-package-found" -Ok ([bool]$portable) -Detail ($portable.FullName ?? "missing")

    $installRoot = Join-Path $env:RUNNER_TEMP "ailis-clean-install"
    if (Test-Path -LiteralPath $installRoot) {
        Remove-Item -LiteralPath $installRoot -Recurse -Force
    }
    Stop-AilisProcesses

    $install = Start-Process -FilePath $setup.FullName `
        -ArgumentList @("/S", "/D=$installRoot") `
        -Wait `
        -PassThru
    Add-Check -Name "silent-install-exit" -Ok ($install.ExitCode -eq 0) -Detail "exitCode=$($install.ExitCode)"

    $installedExe = Join-Path $installRoot "AILIS.exe"
    Add-Check -Name "installed-executable-present" -Ok (Test-Path -LiteralPath $installedExe) -Detail $installedExe
    $installedVersion = (Get-Item -LiteralPath $installedExe).VersionInfo.ProductVersion
    Add-Check -Name "installed-version" -Ok ($installedVersion -like "$ExpectedVersion*") -Detail $installedVersion

    Assert-AppStaysRunning -Executable $installedExe -Label "installed" -WaitSeconds 35

    $stateCandidates = @(
        (Join-Path $env:APPDATA "ailis\desktop-state.json"),
        (Join-Path $env:APPDATA "AILIS\desktop-state.json")
    )
    $statePath = $stateCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
    Add-Check -Name "first-run-state-created" -Ok ([bool]$statePath) -Detail ($statePath ?? ($stateCandidates -join ";"))
    if ($statePath) {
        $state = Get-Content -Raw -LiteralPath $statePath | ConvertFrom-Json
        Add-Check -Name "first-run-cloud-provider" -Ok ($state.preferences.llmProvider -eq "ailis-cloud") -Detail ([string]$state.preferences.llmProvider)
        Add-Check -Name "first-run-cloud-model" -Ok ($state.preferences.llmModel -eq "ailis-cloud") -Detail ([string]$state.preferences.llmModel)
    }

    Assert-AppStaysRunning -Executable $portable.FullName -Label "portable" -WaitSeconds 45

    $uninstaller = Join-Path $installRoot "Uninstall AILIS.exe"
    Add-Check -Name "uninstaller-present" -Ok (Test-Path -LiteralPath $uninstaller) -Detail $uninstaller
    $uninstall = Start-Process -FilePath $uninstaller -ArgumentList @("/S") -Wait -PassThru
    Add-Check -Name "silent-uninstall-exit" -Ok ($uninstall.ExitCode -eq 0) -Detail "exitCode=$($uninstall.ExitCode)"
    Start-Sleep -Seconds 3
    Add-Check -Name "uninstall-removed-executable" -Ok (-not (Test-Path -LiteralPath $installedExe)) -Detail $installedExe

    $report.success = $true
} catch {
    $report.error = $_.Exception.ToString()
    throw
} finally {
    Stop-AilisProcesses
    $report.finishedAt = (Get-Date).ToUniversalTime().ToString("o")
    $reportPath = Join-Path $ReportRoot "clean-install-report.json"
    $report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $reportPath -Encoding utf8
    Write-Host "Clean-install report: $reportPath"
}
