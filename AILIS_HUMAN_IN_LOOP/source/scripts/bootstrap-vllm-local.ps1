[CmdletBinding()]
param(
    [ValidateSet('hf', 'huggingface', 'modelscope', 'ms', 'local')]
    [string]$Source = 'hf',

    [string]$Model = 'Qwen/Qwen2.5-7B-Instruct',
    [string]$ServedModelName = '',
    [string]$HostName = '127.0.0.1',
    [int]$Port = 8000,
    [string]$Distro = '',
    [string]$VenvDir = '~/.cache/ailis/vllm-venv',
    [string]$DownloadDir = '',
    [string]$DType = 'auto',
    [string]$VllmPackage = 'auto',
    [string]$PipIndexUrl = '',
    [string]$PipExtraIndexUrl = '',
    [int]$TensorParallelSize = 1,
    [double]$GpuMemoryUtilization = 0.9,
    [int]$MaxModelLen = 0,
    [double]$CpuOffloadGb = 0,
    [int]$SwapSpace = 0,
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

function Invoke-WslBash {
    param(
        [string]$Distro,
        [string]$Command,
        [string]$User = ''
    )
    $wslArgs = @()
    $wslArgs += Get-WslDistroArgs -Distro $Distro
    if ($User.Trim()) {
        $wslArgs += @('-u', $User.Trim())
    }
    $wslArgs += @('--', 'bash', '-lc', $Command)
    & wsl.exe @wslArgs
    $script:LastWslExitCode = $LASTEXITCODE
}

function Test-WslPythonRuntime {
    param([string]$Distro)
    $probe = "command -v python3 >/dev/null 2>&1 && python3 -c 'import sys; raise SystemExit(0 if sys.version_info >= (3,10) else 1)' && python3 -m venv --help >/dev/null 2>&1"
    Invoke-WslBash -Distro $Distro -Command $probe | Out-Null
    return $script:LastWslExitCode -eq 0
}

function Ensure-WslPythonRuntime {
    param([string]$Distro)
    if (Test-WslPythonRuntime -Distro $Distro) {
        Write-Host '[AILIS vLLM] WSL Python runtime is ready.'
        return
    }

    Write-Host '[AILIS vLLM] Preparing Python 3.10+ / venv / pip inside WSL as root...'
    $installScript = 'set -e; export DEBIAN_FRONTEND=noninteractive; if command -v apt-get >/dev/null 2>&1; then apt-get update; apt-get install -y python3 python3-venv python3-pip ca-certificates curl; elif command -v dnf >/dev/null 2>&1; then dnf install -y python3 python3-pip ca-certificates curl; elif command -v yum >/dev/null 2>&1; then yum install -y python3 python3-pip ca-certificates curl; else echo no_supported_linux_package_manager >&2; exit 11; fi'
    Invoke-WslBash -Distro $Distro -User 'root' -Command $installScript
    $exitCode = $script:LastWslExitCode
    if ($exitCode -ne 0) {
        throw "Unable to install Python runtime inside WSL automatically (exitCode=$exitCode)."
    }
    if (-not (Test-WslPythonRuntime -Distro $Distro)) {
        throw 'Python runtime was installed, but python3/venv is still not usable inside WSL.'
    }
    Write-Host '[AILIS vLLM] WSL Python runtime bootstrap complete.'
}

function Convert-ToWslPath {
    param(
        [string]$Path,
        [string]$Distro
    )
    $normalizedPath = $Path -replace '\\', '/'
    if ($normalizedPath -match '^([A-Za-z]):/(.*)$') {
        $drive = $Matches[1].ToLowerInvariant()
        $rest = $Matches[2]
        return "/mnt/$drive/$rest"
    }
    $distroArgs = Get-WslDistroArgs -Distro $Distro
    $converted = & wsl.exe @distroArgs -- wslpath -a "$normalizedPath"
    if ($LASTEXITCODE -ne 0 -or -not $converted) {
        throw "Unable to convert path to WSL: $Path"
    }
    return ($converted | Select-Object -First 1).Trim()
}

function Test-LooksLikeLocalModelPath {
    param([string]$Value)
    $trimmed = $Value.Trim()
    if (-not $trimmed) {
        return $false
    }
    if ($trimmed -match '^[A-Za-z]:[\\/]' -or $trimmed -match '^\\\\') {
        return $true
    }
    if ($trimmed -match '^/' -or $trimmed -match '^~[/\\]') {
        return $true
    }
    return Test-Path -LiteralPath $trimmed
}

function Build-BashArgs {
    param(
        [string]$SourceValue = $Source,
        [string]$ModelValue = $Model,
        [string]$DownloadDirValue = $DownloadDir
    )
    $argsList = [System.Collections.Generic.List[string]]::new()
    Add-BashArg -ArgList $argsList -Name '--source' -Value $SourceValue
    Add-BashArg -ArgList $argsList -Name '--model' -Value $ModelValue
    Add-BashArg -ArgList $argsList -Name '--served-model-name' -Value $ServedModelName
    Add-BashArg -ArgList $argsList -Name '--host' -Value $HostName
    Add-BashArg -ArgList $argsList -Name '--port' -Value ([string]$Port)
    Add-BashArg -ArgList $argsList -Name '--venv-dir' -Value $VenvDir
    Add-BashArg -ArgList $argsList -Name '--download-dir' -Value $DownloadDirValue
    Add-BashArg -ArgList $argsList -Name '--dtype' -Value $DType
    Add-BashArg -ArgList $argsList -Name '--vllm-package' -Value $VllmPackage
    Add-BashArg -ArgList $argsList -Name '--pip-index-url' -Value $PipIndexUrl
    Add-BashArg -ArgList $argsList -Name '--pip-extra-index-url' -Value $PipExtraIndexUrl
    Add-BashArg -ArgList $argsList -Name '--tensor-parallel-size' -Value ([string]$TensorParallelSize)
    Add-BashArg -ArgList $argsList -Name '--gpu-memory-utilization' -Value ([string]$GpuMemoryUtilization)
    if ($MaxModelLen -gt 0) {
        Add-BashArg -ArgList $argsList -Name '--max-model-len' -Value ([string]$MaxModelLen)
    }
    if ($CpuOffloadGb -gt 0) {
        Add-BashArg -ArgList $argsList -Name '--cpu-offload-gb' -Value ([string]$CpuOffloadGb)
    }
    if ($SwapSpace -gt 0) {
        Add-BashArg -ArgList $argsList -Name '--swap-space' -Value ([string]$SwapSpace)
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

function Convert-LocalPathArgumentForWsl {
    param(
        [string]$Value,
        [string]$Distro
    )
    $trimmed = $Value.Trim()
    if (-not $trimmed) {
        return $Value
    }
    if ($trimmed -match '^/' -or $trimmed -match '^~') {
        return $trimmed
    }
    if (-not (Test-Path -LiteralPath $trimmed)) {
        return $trimmed
    }
    $resolved = (Resolve-Path -LiteralPath $trimmed).Path
    return Convert-ToWslPath -Path $resolved -Distro $Distro
}

$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path

if ($Source -ne 'local' -and (Test-LooksLikeLocalModelPath -Value $Model)) {
    Write-Host '[AILIS vLLM] Local model path detected. Switching source to local to avoid remote download.'
    $Source = 'local'
}

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
    if (-not $NoExecute -and -not $DryRun) {
        Ensure-WslPythonRuntime -Distro $selectedDistro
    } else {
        Write-Host '[AILIS vLLM] DryRun/NoExecute enabled. WSL Python bootstrap was not run.'
    }
    $linuxRepoRoot = if ($NoExecute) {
        '/mnt/f/AILIS_self_evolution_runtime'
    } else {
        Convert-ToWslPath -Path $repoRoot -Distro $selectedDistro
    }
    $modelForBash = if ($Source -eq 'local') {
        Convert-LocalPathArgumentForWsl -Value $Model -Distro $selectedDistro
    } else {
        $Model
    }
    $downloadDirForBash = Convert-LocalPathArgumentForWsl -Value $DownloadDir -Distro $selectedDistro
    $bashArgs = Build-BashArgs -ModelValue $modelForBash -DownloadDirValue $downloadDirForBash
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

$bashArgs = Build-BashArgs
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
