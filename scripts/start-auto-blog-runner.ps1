param(
    [switch]$RunImmediately,
    [int]$IntervalSeconds = 300,
    [string]$Until = "2026-04-22T23:50:00+08:00"
)

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$Runner = Join-Path $RepoRoot "scripts\auto_blog_runner.py"
$RunDir = Join-Path $RepoRoot "backend\blog_content\auto_blog_runs\2026-04-22-16h-blog-autowriter"
$Stdout = Join-Path $RunDir "local_runner_stdout.log"
$Stderr = Join-Path $RunDir "local_runner_stderr.log"
$StopFile = Join-Path $RunDir "stop.flag"

Remove-Item -Path $StopFile -Force -ErrorAction SilentlyContinue

$argsList = @(
    $Runner,
    "--interval-seconds", $IntervalSeconds,
    "--until", $Until
)

if ($RunImmediately) {
    $argsList += "--run-immediately"
}

$process = Start-Process `
    -FilePath "python" `
    -ArgumentList $argsList `
    -WorkingDirectory $RepoRoot `
    -RedirectStandardOutput $Stdout `
    -RedirectStandardError $Stderr `
    -PassThru `
    -WindowStyle Minimized

Write-Output "Started AIGril auto blog runner."
Write-Output "PID: $($process.Id)"
Write-Output "Status: $RunDir\RUNNER_STATUS.json"
Write-Output "Log: $RunDir\RUNNER_LOG.md"
