param([string[]]$Only = @())
$ErrorActionPreference = 'Stop'
$repoDirectory = Split-Path -Parent $PSScriptRoot
$workDirectory = Join-Path $repoDirectory 'tmp/ltspice-library'
$simulatorFile = Join-Path $env:LOCALAPPDATA 'Programs/ADI/LTspice/LTspice.exe'
if (-not (Test-Path -LiteralPath $simulatorFile)) { throw 'LTspice executable not found.' }
$specifications = Get-Content (Join-Path $PSScriptRoot 'ltspice-library-spec.json') -Raw | ConvertFrom-Json
foreach ($specification in $specifications) {
    if ($Only.Count -gt 0 -and $specification.slug -notin $Only) { continue }
    foreach ($suffix in @('.asc', '-refined.cir')) {
        $circuitFile = Join-Path $workDirectory ($specification.slug + $suffix)
        $hashFile = $circuitFile + '.verified-input-hash'
        $inputHash = (Get-FileHash -LiteralPath $circuitFile -Algorithm SHA256).Hash
        if ((Test-Path -LiteralPath $hashFile) -and (Get-Content -LiteralPath $hashFile -Raw).Trim() -eq $inputHash) { continue }
        $runSwitch = if ($suffix -eq '.asc') { '-Run ' } else { '' }
        $simulatorArguments = '-b -ascii ' + $runSwitch + '"' + $circuitFile + '"'
        $simulatorProcess = Start-Process -FilePath $simulatorFile -ArgumentList $simulatorArguments -WindowStyle Hidden -PassThru
        if (-not $simulatorProcess.WaitForExit(90000)) {
            $simulatorProcess.Kill()
            Write-Output ($specification.slug + $suffix + ': exceeded 90 seconds; needs investigation')
            continue
        }
        if ($simulatorProcess.ExitCode -ne 0) { throw ('LTspice failed: ' + $circuitFile) }
        [IO.File]::WriteAllText($hashFile, $inputHash)
        Write-Output ($specification.slug + $suffix + ': simulated')
    }
}
