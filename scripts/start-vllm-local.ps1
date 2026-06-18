[CmdletBinding()]
param(
    [ValidateSet('hf', 'huggingface', 'modelscope', 'ms')]
    [string]$Source = 'hf',

    [string]$Model = 'Qwen/Qwen2.5-7B-Instruct',
    [string]$ServedModelName = '',
    [string]$HostName = '127.0.0.1',
    [int]$Port = 8000,
    [string]$DownloadDir = '',
    [string]$DType = 'auto',
    [int]$TensorParallelSize = 1,
    [double]$GpuMemoryUtilization = 0.9,
    [int]$MaxModelLen = 0,
    [string]$Quantization = '',
    [switch]$TrustRemoteCode,
    [switch]$Detached,
    [switch]$WaitReady,
    [int]$ReadyTimeoutSec = 900,
    [string]$HfEndpoint = '',
    [string[]]$ExtraArgs = @(),
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Quote-Arg {
    param([string]$Value)
    if ($Value -match '^[A-Za-z0-9_./:=+-]+$') {
        return $Value
    }
    return '"' + ($Value -replace '"', '\"') + '"'
}

function Format-CommandLine {
    param(
        [string]$Executable,
        [string[]]$Arguments
    )
    $parts = @((Quote-Arg $Executable))
    $parts += $Arguments | ForEach-Object { Quote-Arg $_ }
    return ($parts -join ' ')
}

function Resolve-Executable {
    if ($DryRun) {
        $vllmDryRun = Get-Command 'vllm' -ErrorAction SilentlyContinue
        if ($vllmDryRun) {
            return @{ Executable = $vllmDryRun.Source; Arguments = @('serve', $Model) }
        }
        return @{ Executable = 'vllm'; Arguments = @('serve', $Model) }
    }

    $vllm = Get-Command 'vllm' -ErrorAction SilentlyContinue
    if ($vllm) {
        return @{ Executable = $vllm.Source; Arguments = @('serve', $Model) }
    }

    $python = Get-Command 'python' -ErrorAction SilentlyContinue
    if ($python) {
        return @{
            Executable = $python.Source
            Arguments = @('-m', 'vllm.entrypoints.openai.api_server', '--model', $Model)
        }
    }

    throw 'vLLM was not found. Install it first, for example: pip install vllm'
}

function Get-ReadyUrl {
    param(
        [string]$HostName,
        [int]$Port
    )
    $clientHost = if ($HostName -eq '0.0.0.0' -or $HostName -eq '::') { '127.0.0.1' } else { $HostName }
    return "http://${clientHost}:$Port/v1/models"
}

function Get-ClientBaseUrl {
    param(
        [string]$HostName,
        [int]$Port
    )
    $clientHost = if ($HostName -eq '0.0.0.0' -or $HostName -eq '::') { '127.0.0.1' } else { $HostName }
    return "http://${clientHost}:$Port/v1"
}

$sourceNormalized = switch ($Source.ToLowerInvariant()) {
    'huggingface' { 'hf' }
    'ms' { 'modelscope' }
    default { $Source.ToLowerInvariant() }
}

if ([string]::IsNullOrWhiteSpace($Model)) {
    throw 'Model cannot be empty.'
}

if ($sourceNormalized -eq 'modelscope') {
    $env:VLLM_USE_MODELSCOPE = 'True'
} else {
    Remove-Item Env:VLLM_USE_MODELSCOPE -ErrorAction SilentlyContinue
}

if ($HfEndpoint.Trim()) {
    $env:HF_ENDPOINT = $HfEndpoint.Trim()
}

$resolved = Resolve-Executable
$arguments = @($resolved.Arguments)
$arguments += @('--host', $HostName)
$arguments += @('--port', [string]$Port)

if ($DType.Trim()) {
    $arguments += @('--dtype', $DType.Trim())
}
if ($ServedModelName.Trim()) {
    $arguments += @('--served-model-name', $ServedModelName.Trim())
}
if ($DownloadDir.Trim()) {
    $arguments += @('--download-dir', $DownloadDir.Trim())
}
if ($TensorParallelSize -gt 1) {
    $arguments += @('--tensor-parallel-size', [string]$TensorParallelSize)
}
if ($GpuMemoryUtilization -gt 0 -and $GpuMemoryUtilization -le 1) {
    $arguments += @('--gpu-memory-utilization', [string]$GpuMemoryUtilization)
}
if ($MaxModelLen -gt 0) {
    $arguments += @('--max-model-len', [string]$MaxModelLen)
}
if ($Quantization.Trim()) {
    $arguments += @('--quantization', $Quantization.Trim())
}
if ($TrustRemoteCode) {
    $arguments += '--trust-remote-code'
}
if ($ExtraArgs.Count -gt 0) {
    $arguments += $ExtraArgs
}

$baseUrl = Get-ClientBaseUrl -HostName $HostName -Port $Port
$readyUrl = Get-ReadyUrl -HostName $HostName -Port $Port
$commandLine = Format-CommandLine -Executable $resolved.Executable -Arguments $arguments

Write-Host "[AILIS vLLM] Source: $sourceNormalized"
Write-Host "[AILIS vLLM] Model: $Model"
Write-Host "[AILIS vLLM] AILIS API Base: $baseUrl"
if ($HostName -eq '0.0.0.0' -or $HostName -eq '::') {
    Write-Host '[AILIS vLLM] For another device on the LAN, replace 127.0.0.1 with this machine IP.'
}
Write-Host "[AILIS vLLM] AILIS Model ID: $(if ($ServedModelName.Trim()) { $ServedModelName.Trim() } else { $Model })"
Write-Host "[AILIS vLLM] Command: $commandLine"

if ($sourceNormalized -eq 'modelscope' -and -not $TrustRemoteCode) {
    Write-Warning 'ModelScope models may require -TrustRemoteCode. Only enable it for model repositories you trust.'
}

if ($DryRun) {
    Write-Host '[AILIS vLLM] Dry run only. No process started.'
    exit 0
}

if ($Detached) {
    $logDir = Join-Path (Get-Location) '.ailis-runtime\vllm'
    New-Item -ItemType Directory -Force -Path $logDir | Out-Null
    $stdout = Join-Path $logDir 'vllm.out.log'
    $stderr = Join-Path $logDir 'vllm.err.log'
    $process = Start-Process `
        -FilePath $resolved.Executable `
        -ArgumentList $arguments `
        -WorkingDirectory (Get-Location) `
        -RedirectStandardOutput $stdout `
        -RedirectStandardError $stderr `
        -WindowStyle Hidden `
        -PassThru

    Write-Host "[AILIS vLLM] Started detached process: $($process.Id)"
    Write-Host "[AILIS vLLM] stdout: $stdout"
    Write-Host "[AILIS vLLM] stderr: $stderr"

    if ($WaitReady) {
        $deadline = (Get-Date).AddSeconds($ReadyTimeoutSec)
        do {
            try {
                $models = Invoke-RestMethod -Uri $readyUrl -Method Get -TimeoutSec 5
                Write-Host "[AILIS vLLM] Ready: $readyUrl"
                if ($models) {
                    Write-Host "[AILIS vLLM] /v1/models returned successfully."
                }
                exit 0
            } catch {
                Start-Sleep -Seconds 3
            }
        } while ((Get-Date) -lt $deadline)

        throw "vLLM did not become ready within $ReadyTimeoutSec seconds. Check logs in $logDir"
    }

    exit 0
}

Write-Host '[AILIS vLLM] Starting in foreground. Press Ctrl+C to stop.'
& $resolved.Executable @arguments
