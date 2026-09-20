function Invoke-InstalledProbe {
    param([string]$Executable, [string[]]$ProbeArguments, [string]$LogPrefix)
    # GUI-subsystem Electron does not reliably populate PowerShell LASTEXITCODE.
    # Await this exact process and preserve both output streams for diagnostics.
    $startInfo = [System.Diagnostics.ProcessStartInfo]::new()
    $startInfo.FileName = $Executable
    $startInfo.UseShellExecute = $false
    $startInfo.CreateNoWindow = $true
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    foreach ($argument in $ProbeArguments) { $startInfo.ArgumentList.Add($argument) }
    $probeProcess = [System.Diagnostics.Process]::new()
    $probeProcess.StartInfo = $startInfo
    try {
        if (-not $probeProcess.Start()) { throw 'Probe did not start' }
        $stdoutTask = $probeProcess.StandardOutput.ReadToEndAsync()
        $stderrTask = $probeProcess.StandardError.ReadToEndAsync()
        if (-not $probeProcess.WaitForExit(600000)) {
            $probeProcess.Kill($true)
            $probeProcess.WaitForExit()
            throw 'Installed probe exceeded 600 seconds'
        }
        $stdout = $stdoutTask.GetAwaiter().GetResult()
        $stderr = $stderrTask.GetAwaiter().GetResult()
        [IO.File]::WriteAllText($LogPrefix + '.stdout.log', $stdout)
        [IO.File]::WriteAllText($LogPrefix + '.stderr.log', $stderr)
        if ($stdout) { Write-Host $stdout }
        if ($stderr) { Write-Host $stderr }
        return $probeProcess.ExitCode
    } finally { $probeProcess.Dispose() }
}
