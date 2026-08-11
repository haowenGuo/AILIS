param(
    [Parameter(Mandatory = $true)]
    [string]$SuiteManifest,

    [Parameter(Mandatory = $true)]
    [string]$OSWorldRoot,

    [int]$TimeoutSeconds = 300,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

function ConvertTo-NetworkGuidBytes {
    param([guid]$Guid)

    $bytes = $Guid.ToByteArray()
    return [byte[]]@(
        $bytes[3], $bytes[2], $bytes[1], $bytes[0],
        $bytes[5], $bytes[4],
        $bytes[7], $bytes[6],
        $bytes[8], $bytes[9], $bytes[10], $bytes[11],
        $bytes[12], $bytes[13], $bytes[14], $bytes[15]
    )
}

function New-UuidV5 {
    param(
        [guid]$Namespace,
        [string]$Name
    )

    $namespaceBytes = ConvertTo-NetworkGuidBytes -Guid $Namespace
    $nameBytes = [System.Text.Encoding]::UTF8.GetBytes($Name)
    $payload = New-Object byte[] ($namespaceBytes.Length + $nameBytes.Length)
    [Array]::Copy($namespaceBytes, 0, $payload, 0, $namespaceBytes.Length)
    [Array]::Copy($nameBytes, 0, $payload, $namespaceBytes.Length, $nameBytes.Length)
    $sha1 = [System.Security.Cryptography.SHA1]::Create()
    try {
        $hash = $sha1.ComputeHash($payload)
    } finally {
        $sha1.Dispose()
    }
    $hash[6] = [byte](($hash[6] -band 0x0f) -bor 0x50)
    $hash[8] = [byte](($hash[8] -band 0x3f) -bor 0x80)
    $hex = -join ($hash[0..15] | ForEach-Object { $_.ToString('x2') })
    return ('{0}-{1}-{2}-{3}-{4}' -f
        $hex.Substring(0, 8),
        $hex.Substring(8, 4),
        $hex.Substring(12, 4),
        $hex.Substring(16, 4),
        $hex.Substring(20, 12))
}

function Resolve-SystemProxy {
    $settings = Get-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings'
    if (-not $settings.ProxyEnable -or -not $settings.ProxyServer) {
        return $null
    }
    $server = [string]$settings.ProxyServer
    if ($server.Contains('=')) {
        $entries = @{}
        foreach ($entry in $server.Split(';')) {
            $parts = $entry.Split('=', 2)
            if ($parts.Length -eq 2) {
                $entries[$parts[0].Trim().ToLowerInvariant()] = $parts[1].Trim()
            }
        }
        $server = $entries['https']
        if (-not $server) { $server = $entries['http'] }
    }
    if (-not $server) { return $null }
    if ($server -notmatch '^https?://') {
        $server = "http://$server"
    }
    return $server
}

function Add-Asset {
    param(
        [System.Collections.Generic.List[object]]$Assets,
        [string]$TaskId,
        [string]$Url,
        [string]$RelativeName,
        [string]$Kind
    )
    if (-not $Url -or -not $RelativeName) { return }
    # DrvFS exposes Linux-reserved Windows characters through its private-use
    # encoding. Encode the Windows-side cache leaf the same way so OSWorld,
    # running in WSL, can still open the original Linux cache path verbatim.
    $drvFsRelativeName = $RelativeName.Replace(':', [string][char]0xF03A)
    $Assets.Add([pscustomobject]@{
        taskId = $TaskId
        url = $Url
        relativeName = $drvFsRelativeName
        kind = $Kind
    })
}

$suitePath = (Resolve-Path -LiteralPath $SuiteManifest).Path
$osworldPath = (Resolve-Path -LiteralPath $OSWorldRoot).Path
$suite = Get-Content -Raw -LiteralPath $suitePath | ConvertFrom-Json
$assets = [System.Collections.Generic.List[object]]::new()
$namespaceUrl = [guid]'6ba7b811-9dad-11d1-80b4-00c04fd430c8'

foreach ($domainProperty in $suite.PSObject.Properties) {
    $domain = $domainProperty.Name
    foreach ($taskId in @($domainProperty.Value)) {
        $taskPath = Join-Path $osworldPath "evaluation_examples\examples\$domain\$taskId.json"
        $task = Get-Content -Raw -LiteralPath $taskPath | ConvertFrom-Json
        foreach ($config in @($task.config)) {
            if ($config.type -ne 'download') { continue }
            foreach ($file in @($config.parameters.files)) {
                $leaf = Split-Path -Leaf ([string]$file.path -replace '/', '\')
                $uuid = New-UuidV5 -Namespace $namespaceUrl -Name ([string]$file.url)
                Add-Asset -Assets $assets -TaskId $taskId -Url ([string]$file.url) -RelativeName "${uuid}_${leaf}" -Kind 'setup'
            }
        }

        foreach ($expected in @($task.evaluator.expected)) {
            if ($null -eq $expected -or $expected.type -ne 'cloud_file') { continue }
            if ($expected.multi) {
                $paths = @($expected.path)
                $destinations = @($expected.dest)
                for ($index = 0; $index -lt $paths.Count; $index += 1) {
                    Add-Asset -Assets $assets -TaskId $taskId -Url ([string]$paths[$index]) -RelativeName ([string]$destinations[$index]) -Kind 'evaluator'
                }
            } else {
                Add-Asset -Assets $assets -TaskId $taskId -Url ([string]$expected.path) -RelativeName ([string]$expected.dest) -Kind 'evaluator'
            }
        }
    }
}

$proxy = Resolve-SystemProxy
$downloaded = 0
$cached = 0
foreach ($asset in $assets) {
    $taskCache = Join-Path $osworldPath "cache\$($asset.taskId)"
    New-Item -ItemType Directory -Force -Path $taskCache | Out-Null
    $target = Join-Path $taskCache $asset.relativeName
    if (-not $Force -and (Test-Path -LiteralPath $target) -and (Get-Item -LiteralPath $target).Length -gt 0) {
        $cached += 1
        continue
    }
    $temporary = "$target.download"
    $request = @{
        Uri = $asset.url
        OutFile = $temporary
        UseBasicParsing = $true
        TimeoutSec = $TimeoutSeconds
    }
    if ($proxy) { $request.Proxy = $proxy }
    Write-Host "[$($asset.kind)] $($asset.taskId)/$($asset.relativeName)"
    try {
        Invoke-WebRequest @request
        Move-Item -Force -LiteralPath $temporary -Destination $target
        $downloaded += 1
    } finally {
        if (Test-Path -LiteralPath $temporary) {
            Remove-Item -Force -LiteralPath $temporary
        }
    }
}

[pscustomobject]@{
    ok = $true
    manifest = $suitePath
    taskCount = @($suite.PSObject.Properties.Value | ForEach-Object { @($_).Count } | Measure-Object -Sum).Sum
    assetCount = $assets.Count
    downloaded = $downloaded
    cached = $cached
    proxy = if ($proxy) { 'windows-system-proxy' } else { 'direct' }
} | ConvertTo-Json
