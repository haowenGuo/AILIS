# AILIS Release Packaging

AILIS must not ship the full local voice stack in the default desktop installer.
The CosyVoice3 model, Torch/CUDA runtime, and ASR runtime are optional local AI
components and are too large for first-run distribution.

## Release Tiers

- `desktop:package:win` / `desktop:package:win:lite`: default user download.
  It bundles the desktop app only. It does not bundle CosyVoice3, ASR, OpenClaw,
  web runtime, or legacy speech models.
- `desktop:package:win:offline-voice`: optional offline voice build for users who
  explicitly want bundled local CosyVoice3 TTS. This build is expected to be
  very large and should not include ASR or Web/Search runtime.
- `ailis:runtime-packs:manifest`: generate a runtime component manifest without
  compressing large files.
- `ailis:runtime-packs:build`: build separate runtime component zip packs:
  `python-runtime`, `cosyvoice3-runtime`, `asr-runtime`, and `web-runtime`.
- Runtime installation from the control panel remains supported for users who
  prefer to choose their own model/cache path.
- OpenClaw references in docs/tests are historical alignment material. The
  default product runtime is the native AILIS Agent runtime.
- Web/search runtime should be treated as a separate optional runtime pack, not
  as part of the first-download desktop installer.

## Installer Strategy

The default Windows NSIS installer has an optional runtime component page. It
does not embed the large runtime files. Instead, it records the user's selected
components in:

`resources/ailis-runtime-components.selected.json`

AILIS can then install or import those components after the app is installed,
using the shared component manifest:

`installer/ailis-runtime-components.json`

The desktop control panel reads both files through `runtimeComponents` state, so
the first run can show what the installer selected before any heavy runtime
download or import begins.

If a `runtime-packs` folder is placed next to the Windows installer, the NSIS
installer copies it to `resources/runtime-packs`. AILIS then lets the user click
`安装已选组件` from the control panel to import the selected packs. If a voice
pack is not present, selected Python/CosyVoice3/ASR components can fall back to
the recoverable Voice Runtime Installer. Web/Search is imported from its runtime
pack because rebuilding that stack during first run is too fragile.

This keeps the first download small while still giving users a clear install
decision point. A single offline installer that embeds all runtime files is only
useful for advanced offline distribution because the download would still be
roughly the sum of all selected component payloads.

## Size Notes

The private Python interpreter itself is small, around 50 MB in the current
Windows runtime. The large parts are:

- Torch/CUDA voice environment: about 5.4 GB unpacked.
- CosyVoice3 model files: about 6.3 GB unpacked.
- ASR runtime and model cache: about 4.8 GB unpacked.

Default releases should therefore exclude these components and treat them as
downloadable/importable runtime packs.
