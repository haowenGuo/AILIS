param(
    [string]$SiteUrl = "https://101.133.239.56",
    [string]$SshHost = "root@101.133.239.56",
    [string]$IdentityFile = "$HOME/.ssh/id_ed25519_yunxin_independent_site_deploy",
    [string]$ReleaseName = "",
    [switch]$SkipBuild,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$SiteUri = [Uri]$SiteUrl
if ($SiteUri.Scheme -ne "https" -or -not $SiteUri.Host -or $SiteUri.AbsolutePath -ne "/") {
    throw "SiteUrl must be an HTTPS origin without a path, for example https://ailis.example.com"
}

$CanonicalOrigin = $SiteUrl.TrimEnd("/")
$Revision = (git -C $ProjectRoot rev-parse --short HEAD).Trim()
if (-not $ReleaseName) {
    $ReleaseName = "$(Get-Date -Format 'yyyyMMdd-HHmmss')-$Revision-web"
}
if ($ReleaseName -notmatch '^[A-Za-z0-9._-]+$') {
    throw "ReleaseName contains unsupported characters: $ReleaseName"
}
if (-not (Test-Path $IdentityFile)) {
    throw "SSH identity file not found: $IdentityFile"
}

if (-not $SkipBuild) {
    & pnpm --dir $ProjectRoot build
    if ($LASTEXITCODE -ne 0) {
        throw "pnpm build failed with exit code $LASTEXITCODE"
    }
}

$DistRoot = Join-Path $ProjectRoot "dist"
if (-not (Test-Path (Join-Path $DistRoot "Test/index.html"))) {
    throw "Built Web experience not found under $DistRoot"
}

$StageRoot = Join-Path ([IO.Path]::GetTempPath()) "ailis-web-$ReleaseName"
$ArchivePath = "$StageRoot.tar.gz"
Remove-Item -LiteralPath $StageRoot -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $ArchivePath -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $StageRoot | Out-Null
Copy-Item -Path (Join-Path $DistRoot "*") -Destination $StageRoot -Recurse -Force

Get-ChildItem -LiteralPath $StageRoot -Recurse -File -Filter "*.html" | ForEach-Object {
    $Html = Get-Content -LiteralPath $_.FullName -Raw
    $Html = $Html.Replace("https://101.133.239.56", $CanonicalOrigin)
    Set-Content -LiteralPath $_.FullName -Value $Html -Encoding utf8 -NoNewline
}

$Today = Get-Date -Format "yyyy-MM-dd"
$Robots = @"
User-agent: *
Allow: /

Sitemap: $CanonicalOrigin/sitemap.xml
"@
Set-Content -LiteralPath (Join-Path $StageRoot "robots.txt") -Value $Robots -Encoding ascii

$Sitemap = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>$CanonicalOrigin/</loc><lastmod>$Today</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>$CanonicalOrigin/Test/</loc><lastmod>$Today</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
</urlset>
"@
Set-Content -LiteralPath (Join-Path $StageRoot "sitemap.xml") -Value $Sitemap -Encoding utf8
Set-Content -LiteralPath (Join-Path $StageRoot "AILIS_RELEASE.txt") -Value "$ReleaseName`n$CanonicalOrigin`n" -Encoding ascii

& tar -czf $ArchivePath -C $StageRoot .
if ($LASTEXITCODE -ne 0) {
    throw "Could not create Web release archive"
}

Write-Host "[AILIS Web] release=$ReleaseName"
Write-Host "[AILIS Web] canonical=$CanonicalOrigin"
Write-Host "[AILIS Web] archive=$ArchivePath"
if ($DryRun) {
    Write-Host "[AILIS Web] dry run complete; no remote files changed"
    exit 0
}

$RemoteArchive = "/tmp/ailis-$ReleaseName.tar.gz"
& scp -i $IdentityFile -o BatchMode=yes $ArchivePath "${SshHost}:$RemoteArchive"
if ($LASTEXITCODE -ne 0) {
    throw "Web archive upload failed"
}

$RemoteCommand = @"
set -eu
release='/var/www/ailis/releases/$ReleaseName'
mkdir -p "`$release"
tar -xzf '$RemoteArchive' -C "`$release"
test -s "`$release/Test/index.html"
test -s "`$release/robots.txt"
test -s "`$release/sitemap.xml"
ln -sfn "`$release" /var/www/ailis/current.next
mv -Tf /var/www/ailis/current.next /var/www/ailis/current
nginx -t
systemctl reload nginx
rm -f '$RemoteArchive'
"@
& ssh -i $IdentityFile -o BatchMode=yes $SshHost $RemoteCommand
if ($LASTEXITCODE -ne 0) {
    throw "Remote Web activation failed"
}

$SmokeUrl = "$CanonicalOrigin/Test/"
& curl.exe -k -fsS --max-time 20 $SmokeUrl | Select-String -SimpleMatch "AILIS" | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw "Post-deploy smoke check failed: $SmokeUrl"
}
Write-Host "[AILIS Web] deployed and verified: $SmokeUrl"
