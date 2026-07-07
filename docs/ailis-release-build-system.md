# AILIS Release Build System

AILIS uses a lightweight core installer plus optional runtime packs. The default release should not bundle large local models, Python environments, CosyVoice3, ASR, or Web/Search runtimes into the core installer.

## Build Profiles

Profiles live in `installer/ailis-release-profiles.json`.

| Profile | Purpose | Output |
| --- | --- | --- |
| `core` | Default public release. Builds the lightweight NSIS installer and portable package. | `F:/AILIS/Build/AILIS/core` |
| `runtime-packs` | Builds optional runtime packs only. | `F:/AILIS/Build/AILIS/runtime-packs` |
| `with-packs` | Builds the lightweight installer and stages selected runtime packs next to it. | `F:/AILIS/Build/AILIS/with-packs` |
| `voice-debug` | Legacy heavy offline voice directory build for internal debugging. | `F:/AILIS/Build/AILIS/voice-debug` |

## Commands

```powershell
pnpm release:plan
pnpm release:core
pnpm release:runtime-packs
pnpm release:with-packs
pnpm release:voice-debug
```

Build one runtime pack family:

```powershell
pnpm ailis:runtime-packs:build:python
pnpm ailis:runtime-packs:build:voice
pnpm ailis:runtime-packs:build:asr
pnpm ailis:runtime-packs:build:web
```

Advanced direct usage:

```powershell
node scripts/build-ailis-release.mjs --profile with-packs --components python-runtime,web-runtime
node scripts/build-ailis-release.mjs --profile core --output-root F:/AILIS/Build/AILIS-test
node scripts/build-ailis-release.mjs --profile with-packs --dry-run --json
```

## Runtime Pack Installation Model

The installer page in `installer/ailis-runtime-components.nsh` records which optional components the user selected. It does not force the default installer to carry giant assets.

When runtime packs are available beside the installer:

```text
AILIS-Setup-1.0.7-win-x64.exe
runtime-packs/
  AILIS-Runtime-python-runtime-1.0.7.zip
  AILIS-Runtime-cosyvoice3-runtime-1.0.7.zip
  AILIS-Runtime-asr-runtime-1.0.7.zip
  AILIS-Runtime-web-runtime-1.0.7.zip
```

the NSIS installer copies them into `resources/runtime-packs`. AILIS can then import/install only the components selected by the user from the control panel or deferred installer state.

## Release Manifests

Every non-dry-run release profile writes:

```text
AILIS-Release-<profile>-<version>.json
```

The manifest records:

- AILIS version
- profile name
- output directory
- runtime components included in the build plan
- commands executed
- generated artifacts with size and SHA-256

## Rules

- `core` must stay lightweight.
- Large runtime assets should be built as sidecar packs, not copied into source-controlled project folders.
- Use `runtime-packs` or `with-packs` only when preparing an offline-friendly release.
- `voice-debug` is for internal diagnosis, not the normal public installer.
