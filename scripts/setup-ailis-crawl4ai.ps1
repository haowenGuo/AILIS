param(
    [string]$VenvDir = ".ailis-runtime\crawl4ai-venv",
    [string]$Python = "python",
    [switch]$SkipBrowserInstall,
    [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"

function Resolve-RepoPath([string]$PathValue) {
    if ([System.IO.Path]::IsPathRooted($PathValue)) {
        return $PathValue
    }
    return Join-Path (Get-Location) $PathValue
}

$venvPath = Resolve-RepoPath $VenvDir
$venvPython = if ($IsWindows -or $env:OS -eq "Windows_NT") {
    Join-Path $venvPath "Scripts\python.exe"
} else {
    Join-Path $venvPath "bin/python"
}

if ($CheckOnly) {
    if (!(Test-Path -LiteralPath $venvPython)) {
        throw "Crawl4AI venv python not found: $venvPython"
    }
    & $venvPython -c "import crawl4ai; print('crawl4ai import ok')"
    exit $LASTEXITCODE
}

if (!(Test-Path -LiteralPath $venvPython)) {
    Write-Host "[AILIS Crawl4AI] Creating local venv: $venvPath"
    & $Python -m venv $venvPath
}

Write-Host "[AILIS Crawl4AI] Upgrading pip tooling"
& $venvPython -m pip install --upgrade pip setuptools wheel

Write-Host "[AILIS Crawl4AI] Installing Crawl4AI Python package"
& $venvPython -m pip install --upgrade crawl4ai

if (!$SkipBrowserInstall) {
    Write-Host "[AILIS Crawl4AI] Installing Playwright Chromium browser"
    & $venvPython -m playwright install chromium
}

Write-Host "[AILIS Crawl4AI] Verifying import"
& $venvPython -c "import crawl4ai; print('crawl4ai import ok')"

Write-Host ""
Write-Host "Set these environment variables when you want AILIS to use this venv explicitly:"
Write-Host "  `$env:AILIS_CRAWL4AI_PYTHON = '$venvPython'"
Write-Host "  `$env:AILIS_CRAWL4AI_ENABLED = '1'"
