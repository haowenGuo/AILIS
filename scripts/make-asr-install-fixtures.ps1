param([Parameter(Mandatory=$true)][string]$OutputDirectory)
$ErrorActionPreference = 'Stop'
# Synthetic local speech only: never open the user's microphone or recordings.
Add-Type -AssemblyName System.Speech
$fixtureRoot = [IO.Path]::GetFullPath($OutputDirectory)
if (Test-Path -LiteralPath $fixtureRoot) { throw "Refusing to overwrite fixtures: $fixtureRoot" }
New-Item -ItemType Directory -Path $fixtureRoot | Out-Null
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
    $voice = $speaker.GetInstalledVoices() | Where-Object { $_.Enabled -and $_.VoiceInfo.Culture.Name -eq 'zh-CN' } | Select-Object -First 1
    if (-not $voice) { throw 'A Chinese Windows voice is required to create these test fixtures on the build host.' }
    $speaker.SelectVoice($voice.VoiceInfo.Name)
    $format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(16000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
    $cases = @(
        @{ file = 'chinese-basic.wav'; text = '你好，请帮我检查电脑的磁盘空间。'; contains = @('检查','磁盘','空间') },
        @{ file = 'chinese-instruction.wav'; text = '请打开工作文件夹，然后创建一个文本文件。'; contains = @('文件夹','创建','文本文件') }
    )
    foreach ($case in $cases) {
        $speaker.SetOutputToWaveFile((Join-Path $fixtureRoot $case.file), $format)
        $speaker.Speak($case.text)
        $speaker.SetOutputToNull()
    }
    @{ voice=$voice.VoiceInfo.Name; sampleRate=16000; cases=$cases } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $fixtureRoot 'fixtures.json') -Encoding UTF8
} finally { $speaker.Dispose() }
