param(
    [string]$Root = ".local\ailis-web-stack",
    [switch]$Update,
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
New-Item -ItemType Directory -Force -Path $stackRoot, $sourceRoot | Out-Null

$repos = @(
    @{
        Name = "searxng"
        Url = "https://github.com/searxng/searxng.git"
        GitHub = "searxng/searxng"
        Branch = "master"
        License = "AGPL-3.0-or-later"
        Notes = "Reference for meta-search normalization, engine result merging, and result ranking."
        SparsePaths = @("searx", "searxng", "requirements", "README.rst", "LICENSE", "pyproject.toml")
        ZipExcludes = @("*/utils/templates/*")
    },
    @{
        Name = "firecrawl"
        Url = "https://github.com/firecrawl/firecrawl.git"
        GitHub = "firecrawl/firecrawl"
        Branch = "main"
        License = "AGPL-3.0"
        Notes = "Reference for search/fetch result shaping and LLM-friendly extraction contracts."
    },
    @{
        Name = "crawl4ai"
        Url = "https://github.com/unclecode/crawl4ai.git"
        GitHub = "unclecode/crawl4ai"
        Branch = "main"
        License = "Apache-2.0"
        Notes = "Reference for Markdown extraction, link preservation, and page cleaning."
    }
)

if (-not $NoClone) {
    Ensure-Command "git"
    foreach ($repo in $repos) {
        Clone-Or-UpdateRepo $repo $sourceRoot ([bool]$Update)
    }
}

$manifestRepos = @()
foreach ($repo in $repos) {
    $localPath = Join-Path $sourceRoot $repo.Name
    $manifestRepos += [ordered]@{
        name = $repo.Name
        url = $repo.Url
        github = $repo.GitHub
        branch = $repo.Branch
        license = $repo.License
        localPath = $localPath
        exists = Test-Path $localPath
        notes = $repo.Notes
    }
}

$manifest = [ordered]@{
    generatedAt = (Get-Date).ToString("o")
    purpose = "Local source-code mirror for improving AILIS web_search/web_fetch. This script only downloads or updates source code and writes this manifest."
    root = $stackRoot
    sourceRoot = $sourceRoot
    repos = $manifestRepos
}

Write-TextFile (Join-Path $stackRoot "sources.json") (($manifest | ConvertTo-Json -Depth 6) + [Environment]::NewLine)

$sourceRows = $repos | ForEach-Object {
    $localPath = Join-Path $sourceRoot $_.Name
    "- $($_.Name): ``$localPath`` ($($_.License)) - $($_.Notes)"
}
$readme = @"
# AILIS Local Open-Source Web Code

This folder is generated by ``scripts/setup-ailis-local-web-stack.ps1``.

It is intentionally source-only: it downloads or updates the upstream source repositories and writes a provenance manifest. It does not install runtimes, start services, or create deployment files.

## Sources

$($sourceRows -join [Environment]::NewLine)

## How AILIS Uses This

AILIS keeps its own lightweight ``web_search`` and ``web_fetch`` implementation. The local repositories are references for portable search-quality ideas:

- SearXNG-style meta-search normalization, duplicate merging, and ranking.
- Firecrawl-style search/fetch result shaping for LLM-readable observations.
- Crawl4AI-style Markdown extraction and link preservation.

Direct code migration should respect upstream licenses. SearXNG and Firecrawl are AGPL-family projects, so prefer reimplementing their ideas in AILIS unless the project intentionally accepts the license obligations. Crawl4AI is Apache-2.0 and is safer for small attributed code migration.
"@
Write-TextFile (Join-Path $stackRoot "README.md") $readme

Write-Host ""
Write-Host "AILIS local open-source web code is ready at: $stackRoot"
Write-Host "Source repos: $sourceRoot"
Write-Host "Manifest: $(Join-Path $stackRoot 'sources.json')"
