$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$RunDir = Join-Path $RepoRoot "backend\blog_content\auto_blog_runs\2026-04-22-16h-blog-autowriter"
$LockFile = Join-Path $RunDir "runner.lock"
$StopFile = Join-Path $RunDir "stop.flag"

Set-Content -Path $StopFile -Value "stop requested at $(Get-Date -Format o)" -Encoding UTF8

if (Test-Path $LockFile) {
    $content = Get-Content $LockFile
    $pidLine = $content | Where-Object { $_ -like "pid=*" } | Select-Object -First 1
    if ($pidLine) {
        $runnerPid = [int]($pidLine -replace "^pid=", "")
        $process = Get-Process -Id $runnerPid -ErrorAction SilentlyContinue
        if ($process) {
            Stop-Process -Id $runnerPid -Force
            Write-Output "Stopped AIGril auto blog runner PID $runnerPid."
        } else {
            Write-Output "Runner PID $runnerPid was not running."
        }
    } else {
        Write-Output "runner.lock exists, but no PID was found: $LockFile"
    }
}

$matches = Get-CimInstance Win32_Process |
    Where-Object {
        $_.CommandLine -like "*auto_blog_runner.py*" -and
        $_.ProcessId -ne $PID
    }

foreach ($match in $matches) {
    Stop-Process -Id $match.ProcessId -Force -ErrorAction SilentlyContinue
    Write-Output "Stopped sleeping AIGril auto blog runner PID $($match.ProcessId)."
}

Remove-Item -Path $LockFile -Force -ErrorAction SilentlyContinue
Write-Output "Wrote stop flag: $StopFile"
