param(
    [string]$Root = ".local\ailis-web-stack",
    [switch]$Update,
    [switch]$Start,
    [switch]$NoClone
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Resolve-RepoPath([string]$Path) {
    if ([System.IO.Path]::IsPathRooted($Path)) {
        return [System.IO.Path]::GetFullPath($Path)
    }
    return [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $Path))
}

function Ensure-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Missing required command: $Name"
    }
}

function Invoke-Checked([string[]]$Command, [string]$WorkDir = "") {
    $display = $Command -join " "
    Write-Host ">> $display"
    $commandName = $Command[0]
    $arguments = @($Command | Select-Object -Skip 1)
    if ($WorkDir) {
        Push-Location $WorkDir
        try {
            & $commandName @arguments
        } finally {
            Pop-Location
        }
    } else {
        & $commandName @arguments
    }
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed ($LASTEXITCODE): $display"
    }
}

function Remove-GeneratedTarget([string]$Target, [string]$SourceRoot) {
    $resolvedTarget = [System.IO.Path]::GetFullPath($Target)
    $resolvedSourceRoot = [System.IO.Path]::GetFullPath($SourceRoot)
    if (-not $resolvedTarget.StartsWith($resolvedSourceRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to remove path outside generated source root: $resolvedTarget"
    }
    if (Test-Path $resolvedTarget) {
        Remove-Item -LiteralPath $resolvedTarget -Recurse -Force
    }
}

function Download-RepoZip([hashtable]$Repo, [string]$Target, [string]$SourceRoot) {
    $zipUrl = "https://codeload.github.com/$($Repo.GitHub)/zip/refs/heads/$($Repo.Branch)"
    $tmpRoot = Join-Path $SourceRoot "_zip"
    $zipPath = Join-Path $tmpRoot "$($Repo.Name).zip"
    $extractRoot = Join-Path $tmpRoot "$($Repo.Name)-extract"
    New-Item -ItemType Directory -Force -Path $tmpRoot | Out-Null
    Remove-GeneratedTarget $extractRoot $SourceRoot
    Write-Host ">> download $zipUrl"
    if (Get-Command "curl.exe" -ErrorAction SilentlyContinue) {
        Invoke-Checked @("curl.exe", "-L", "--retry", "5", "--retry-delay", "3", "--connect-timeout", "30", "--output", $zipPath, $zipUrl)
    } else {
        Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing
    }
    New-Item -ItemType Directory -Force -Path $extractRoot | Out-Null
    if (Get-Command "tar.exe" -ErrorAction SilentlyContinue) {
        $tarArgs = @("-xf", $zipPath, "-C", $extractRoot)
        if ($Repo.ContainsKey("ZipExcludes")) {
            foreach ($exclude in $Repo.ZipExcludes) {
                $tarArgs += "--exclude=$exclude"
            }
        }
        Invoke-Checked (@("tar.exe") + $tarArgs)
    } else {
        Expand-Archive -LiteralPath $zipPath -DestinationPath $extractRoot -Force
    }
    $expanded = Get-ChildItem -LiteralPath $extractRoot -Directory | Select-Object -First 1
    if (-not $expanded) {
        throw "Downloaded zip did not contain a source directory: $zipUrl"
    }
    Remove-GeneratedTarget $Target $SourceRoot
    Move-Item -LiteralPath $expanded.FullName -Destination $Target
}

function Clone-Or-UpdateRepo([hashtable]$Repo, [string]$SourceRoot, [bool]$ShouldUpdate) {
    $target = Join-Path $SourceRoot $Repo.Name
    if (Test-Path (Join-Path $target ".git")) {
        Write-Host "Repo exists: $($Repo.Name) -> $target"
        if ($ShouldUpdate) {
            Invoke-Checked @("git", "-C", $target, "pull", "--ff-only")
        }
        return
    }
    if (Test-Path $target) {
        Write-Host "Source exists without .git, keeping downloaded source: $target"
        return
    }
    try {
        if ($Repo.ContainsKey("SparsePaths")) {
            Invoke-Checked @("git", "clone", "--depth", "1", "--filter=blob:none", "--no-checkout", "--single-branch", "--branch", $Repo.Branch, $Repo.Url, $target)
            Invoke-Checked @("git", "-C", $target, "sparse-checkout", "init", "--cone")
            Invoke-Checked (@("git", "-C", $target, "sparse-checkout", "set") + @($Repo.SparsePaths))
            Invoke-Checked @("git", "-C", $target, "checkout", $Repo.Branch)
        } else {
            Invoke-Checked @("git", "clone", "--depth", "1", "--filter=blob:none", "--single-branch", "--branch", $Repo.Branch, $Repo.Url, $target)
        }
    } catch {
        Write-Warning "git clone failed for $($Repo.Name), falling back to GitHub source zip. $($_.Exception.Message)"
        Remove-GeneratedTarget $target $SourceRoot
        Download-RepoZip $Repo $target $SourceRoot
    }
}

function Write-TextFile([string]$Path, [string]$Content) {
    $parent = Split-Path -Parent $Path
    if ($parent) {
        New-Item -ItemType Directory -Force -Path $parent | Out-Null
    }
    [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
}

$stackRoot = Resolve-RepoPath $Root
$sourceRoot = Join-Path $stackRoot "src"
$searxngConfigRoot = Join-Path $stackRoot "searxng"
New-Item -ItemType Directory -Force -Path $stackRoot, $sourceRoot, $searxngConfigRoot | Out-Null

$repos = @(
    @{
        Name = "searxng"
        Url = "https://github.com/searxng/searxng.git"
        GitHub = "searxng/searxng"
        Branch = "master"
        SparsePaths = @("searx", "searxng", "dockerfiles", "requirements", "README.rst", "LICENSE", "pyproject.toml")
        ZipExcludes = @("*/utils/templates/*")
    },
    @{ Name = "firecrawl"; Url = "https://github.com/firecrawl/firecrawl.git"; GitHub = "firecrawl/firecrawl"; Branch = "main" },
    @{ Name = "crawl4ai"; Url = "https://github.com/unclecode/crawl4ai.git"; GitHub = "unclecode/crawl4ai"; Branch = "main" }
)

if (-not $NoClone) {
    Ensure-Command "git"
    foreach ($repo in $repos) {
        Clone-Or-UpdateRepo $repo $sourceRoot ([bool]$Update)
    }
}

$settingsYml = @"
use_default_settings: true

server:
  bind_address: "0.0.0.0"
  port: 8080
  secret_key: "ailis-local-searxng-change-me"

search:
  formats:
    - html
    - json
"@
Write-TextFile (Join-Path $searxngConfigRoot "settings.yml") $settingsYml

$compose = @"
name: ailis-local-web-stack

services:
  searxng:
    image: searxng/searxng:latest
    container_name: ailis-searxng
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:8080"
    volumes:
      - ./searxng:/etc/searxng:rw
    environment:
      - SEARXNG_BASE_URL=http://127.0.0.1:8080/

  crawl4ai:
    image: unclecode/crawl4ai:latest
    container_name: ailis-crawl4ai
    restart: unless-stopped
    shm_size: "3gb"
    ports:
      - "127.0.0.1:11235:11235"
"@
Write-TextFile (Join-Path $stackRoot "docker-compose.ailis-web.yml") $compose

$envPs1 = @"
# Dot-source this file before starting AILIS if the app is not launched by the helper.
`$env:AILIS_WEB_SEARCH_PROVIDER = "auto"
`$env:AILIS_SEARXNG_URL = "http://127.0.0.1:8080"
`$env:AILIS_FIRECRAWL_URL = "http://127.0.0.1:3002"
`$env:AILIS_CRAWL4AI_URL = "http://127.0.0.1:11235"
"@
Write-TextFile (Join-Path $stackRoot "ailis-web-stack.env.ps1") $envPs1

$envFile = @"
AILIS_WEB_SEARCH_PROVIDER=auto
AILIS_SEARXNG_URL=http://127.0.0.1:8080
AILIS_FIRECRAWL_URL=http://127.0.0.1:3002
AILIS_CRAWL4AI_URL=http://127.0.0.1:11235
"@
Write-TextFile (Join-Path $stackRoot ".env.ailis") $envFile

$firecrawlEnv = @"
NUM_WORKERS_PER_QUEUE=8
PORT=3002
HOST=0.0.0.0
REDIS_URL=redis://redis:6379
REDIS_RATE_LIMIT_URL=redis://redis:6379
BULL_AUTH_KEY=@
"@
$firecrawlRoot = Join-Path $sourceRoot "firecrawl"
if (Test-Path $firecrawlRoot) {
    Write-TextFile (Join-Path $firecrawlRoot ".env.ailis-local") $firecrawlEnv
}

$readme = @'
# AILIS Local Open-Source Web Stack

This folder is generated by `scripts/setup-ailis-local-web-stack.ps1`.

## Sources cloned locally

- SearXNG: `src/searxng`
- Firecrawl: `src/firecrawl`
- Crawl4AI: `src/crawl4ai`

## Local endpoints expected by AILIS

- SearXNG JSON search: `http://127.0.0.1:8080/search?q=...&format=json`
- Firecrawl self-hosted API: `http://127.0.0.1:3002`
- Crawl4AI API: `http://127.0.0.1:11235`

## Start SearXNG + Crawl4AI

```powershell
docker compose -f docker-compose.ailis-web.yml up -d
```

## Start Firecrawl from the cloned source

Firecrawl is intentionally not wired to hosted `api.firecrawl.dev` by default. Use the cloned source under `src/firecrawl`.

```powershell
cd src/firecrawl
Copy-Item .env.ailis-local .env -Force
docker compose up -d --build
```

## Export AILIS environment

```powershell
. .\ailis-web-stack.env.ps1
```
'@
Write-TextFile (Join-Path $stackRoot "README.md") $readme

Write-Host ""
Write-Host "AILIS local web stack prepared at: $stackRoot"
Write-Host "Source repos: $sourceRoot"
Write-Host "Env file: $(Join-Path $stackRoot 'ailis-web-stack.env.ps1')"
Write-Host "Compose file: $(Join-Path $stackRoot 'docker-compose.ailis-web.yml')"

if ($Start) {
    Ensure-Command "docker"
    Push-Location $stackRoot
    try {
        Invoke-Checked @("docker", "compose", "-f", "docker-compose.ailis-web.yml", "up", "-d")
    } finally {
        Pop-Location
    }

    $firecrawlCompose = @(
        (Join-Path $firecrawlRoot "docker-compose.yml"),
        (Join-Path $firecrawlRoot "docker-compose.yaml")
    ) | Where-Object { Test-Path $_ } | Select-Object -First 1
    if ($firecrawlCompose) {
        Copy-Item (Join-Path $firecrawlRoot ".env.ailis-local") (Join-Path $firecrawlRoot ".env") -Force
        Push-Location $firecrawlRoot
        try {
            Invoke-Checked @("docker", "compose", "up", "-d", "--build")
        } finally {
            Pop-Location
        }
    } else {
        Write-Warning "Firecrawl docker-compose.yml was not found under $firecrawlRoot. Check the cloned repo's current self-host docs."
    }
}
