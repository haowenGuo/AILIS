# Offline installation acceptance speech

Two synthetic Mandarin WAV files generated with Windows System.Speech and the
Microsoft Huihui Desktop voice for this project's installation tests. They contain
no microphone recordings, user conversation, credentials, or personal data.

The expected text and generator details are in `fixtures.json`. Tests assert that
the packaged Whisper Small runtime can recognize real audio with network access
denied by a Python audit hook. Character errors and missing keywords are reported
separately; successful runtime startup is not a claim of perfect ASR accuracy.
