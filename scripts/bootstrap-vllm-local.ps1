[CmdletBinding()]
param(
    [ValidateSet('hf', 'huggingface', 'modelscope', 'ms')]
    [string]$Source = 'hf',

    [string]$Model = 'Qwen/Qwen2.5-7B-Instruct',
    [string]$ServedModelName = '',
    [string]$HostName = '127.0.0.1',
    [int]$Port = 8000,
    [string]$Distro = '',
    [string]$VenvDir = '.ailis-runtime/vllm-venv',
    [string]$DownloadDir = '',
    [string]$DType = 'auto',
    [int]$TensorParallelSize = 1,
    [double]$GpuMemoryUtilization = 0.9,
    [int]$MaxModelLen = 0,
    [string]$Quantization = '',
    [switch]$TrustRemoteCode,
    [switch]$Start,
    [switch]$Detached,
    [switch]$WaitReady,
    [int]$ReadyTimeoutSec = 900,
    [switch]$InstallWsl,
    [switch]$DryRun,
    [switch]$NoExecute,
    [string[]]$ExtraArgs = @()
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Quote-BashArg {
    param([string]$Value)
    if ($Value -match '^[A-Za-z0-9_./:=+,-]+$') {
        return $Value
    }
    return "'" + ($Value -replace "'", "'\''") + "'"
}

function Quote-PowerShellArg {
    param([string]$Value)
    if ($Value -match '^[A-Za-z0-9_./:=+,-]+$') {
        return $Value
    }
    return "'" + ($Value -replace "'", "''") + "'"
}

function Add-BashArg {
    param(
        [System.Collections.Generic.List[string]]$ArgList,
        [string]$Name,
        [string]$Value
    )
    if ($Value -ne '') {
        $ArgList.Add($Name)
        $ArgList.Add($Value)
    }
}

function Add-BashSwitch {
    param(
        [System.Collections.Generic.List[string]]$ArgList,
        [string]$Name,
        [bool]$Enabled
    )
    if ($Enabled) {
        $ArgList.Add($Name)
    }
}

function Get-IsWindows {
    if ($PSVersionTable.PSEdition -eq 'Desktop') {
        return $true
    }
    return [System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform(
        [System.Runtime.InteropServices.OSPlatform]::Windows
    )
}

function Get-WslDistroArgs {
    param([string]$Distro)
    if ($Distro.Trim()) {
        return @('-d', $Distro.Trim())
    }
    return @()
}

function Get-WslDistros {
    $output = & wsl.exe -l -q 2>$null
    if ($LASTEXITCODE -ne 0) {
        return @()
    }
    return @($output | ForEach-Object {
        ($_ -replace "`0", '').Trim()
    } | Where-Object { $_ })
}

function Convert-ToWslPath {
    param(
        [string]$Path,
        [string]$Distro
    )
    $distroArgs = Get-WslDistroArgs -Distro $Distro
    $converted = & wsl.exe @distroArgs -- wslpath -a "$Path"
    if ($LASTEXITCODE -ne 0 -or -not $converted) {
        throw "Unable to convert path to WSL: $Path"
    }
    return ($converted | Select-Object -First 1).Trim()
}

function Build-BashArgs {
    $argsList = [System.Collections.Generic.List[string]]::new()
    Add-BashArg -ArgList $argsList -Name '--source' -Value $Source
    Add-BashArg -ArgList $argsList -Name '--model' -Value $Model
    Add-BashArg -ArgList $argsList -Name '--served-model-name' -Value $ServedModelName
    Add-BashArg -ArgList $argsList -Name '--host' -Value $HostName
    Add-BashArg -ArgList $argsList -Name '--port' -Value ([string]$Port)
    Add-BashArg -ArgList $argsList -Name '--venv-dir' -Value $VenvDir
    Add-BashArg -ArgList $argsList -Name '--download-dir' -Value $DownloadDir
    Add-BashArg -ArgList $argsList -Name '--dtype' -Value $DType
    Add-BashArg -ArgList $argsList -Name '--tensor-parallel-size' -Value ([string]$TensorParallelSize)
    Add-BashArg -ArgList $argsList -Name '--gpu-memory-utilization' -Value ([string]$GpuMemoryUtilization)
    if ($MaxModelLen -gt 0) {
        Add-BashArg -ArgList $argsList -Name '--max-model-len' -Value ([string]$MaxModelLen)
    }
    Add-BashArg -ArgList $argsList -Name '--quantization' -Value $Quantization
    Add-BashSwitch -ArgList $argsList -Name '--trust-remote-code' -Enabled ([bool]$TrustRemoteCode)
    Add-BashSwitch -ArgList $argsList -Name '--start' -Enabled ([bool]$Start)
    Add-BashSwitch -ArgList $argsList -Name '--detached' -Enabled ([bool]$Detached)
    Add-BashSwitch -ArgList $argsList -Name '--wait-ready' -Enabled ([bool]$WaitReady)
    Add-BashArg -ArgList $argsList -Name '--ready-timeout-sec' -Value ([string]$ReadyTimeoutSec)
    Add-BashSwitch -ArgList $argsList -Name '--dry-run' -Enabled ([bool]$DryRun)
    $extraArgsList = @($ExtraArgs)
    if ($extraArgsList.Count -gt 0) {
        $argsList.Add('--')
        foreach ($arg in $extraArgsList) {
            $argsList.Add($arg)
        }
    }
    return $argsList.ToArray()
}

$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$bashArgs = Build-BashArgs

if (Get-IsWindows) {
    $wsl = Get-Command 'wsl.exe' -ErrorAction SilentlyContinue
    if (-not $wsl) {
        throw 'WSL was not found. Install WSL2 first: wsl --install -d Ubuntu'
    }

    $distros = @(Get-WslDistros)
    if ($distros.Count -eq 0) {
        if ($InstallWsl) {
            Write-Host '[AILIS vLLM] Installing Ubuntu WSL. You may need to reboot and run this command again.'
            & wsl.exe --install -d Ubuntu
            exit $LASTEXITCODE
        }

        Write-Host '[AILIS vLLM] No WSL distro found.'
        Write-Host '[AILIS vLLM] Run this once, then reboot if Windows asks:'
        Write-Host '  wsl --install -d Ubuntu'
        Write-Host '[AILIS vLLM] After Ubuntu setup finishes, re-run:'
        Write-Host '  pnpm llm:vllm:oneclick'
        exit 3
    }

    $selectedDistro = if ($Distro.Trim()) { $Distro.Trim() } else { $distros[0] }
    $linuxRepoRoot = if ($NoExecute) {
        '/mnt/f/AILIS_self_evolution_runtime'
    } else {
        Convert-ToWslPath -Path $repoRoot -Distro $selectedDistro
    }
    $quotedArgs = @($bashArgs | ForEach-Object { Quote-BashArg $_ })
    $bashCommand = "cd $(Quote-BashArg $linuxRepoRoot) && bash scripts/bootstrap-vllm-local.sh $($quotedArgs -join ' ')"
    $wslArgs = @()
    $wslArgs += Get-WslDistroArgs -Distro $selectedDistro
    $wslArgs += @('--', 'bash', '-lc', $bashCommand)

    Write-Host "[AILIS vLLM] Using WSL distro: $selectedDistro"
    Write-Host "[AILIS vLLM] Command: wsl $($wslArgs | ForEach-Object { Quote-PowerShellArg $_ })"

    if ($NoExecute) {
        Write-Host '[AILIS vLLM] NoExecute enabled. Command was not run.'
        exit 0
    }

    & wsl.exe @wslArgs
    exit $LASTEXITCODE
}

$quotedLocalArgs = @($bashArgs | ForEach-Object { Quote-BashArg $_ })
$localCommand = "bash scripts/bootstrap-vllm-local.sh $($quotedLocalArgs -join ' ')"
Write-Host "[AILIS vLLM] Command: $localCommand"
if ($NoExecute) {
    Write-Host '[AILIS vLLM] NoExecute enabled. Command was not run.'
    exit 0
}

Push-Location $repoRoot
try {
    & bash scripts/bootstrap-vllm-local.sh @bashArgs
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
