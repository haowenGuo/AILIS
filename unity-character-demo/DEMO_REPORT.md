# AILIS Unity Character Runtime v3 Report

## Result

The Unity sidecar is now an optional, supervised AILIS desktop renderer. It
behaves as a transparent desktop pet, exposes model-independent presentation
channels for bubbles, actions, lip sync, art, and rendering options, and remains
paired with the existing Electron/Three.js renderer as an automatic fallback.

## Current Validation

Validated on `2026-07-21` with Unity `2022.3.62f3`, Direct3D 11, URP 14, and
the local NVIDIA RTX 3060 Laptop GPU. The table contains values measured in the
current build; earlier FPS and memory measurements remain useful historical
baselines but are not presented as a new benchmark.

| Metric | Result |
| --- | ---: |
| Release build | Passed |
| Build directory size | `96.44 MiB` |
| Transparent desktop composition | Passed |
| Native graphics path | Direct3D 11 on RTX 3060 Laptop GPU |
| Startup to VRM and Idle motion ready | `8.036 s` |
| URP runtime change | Passed: Asset, Render Scale, MSAA, shadows, SMAA, Volume |
| VRMA import under URP | Passed: Idle and Thinking |
| Electron sidecar lifecycle | Passed: starting -> ready -> Unity -> stopped |
| Electron command bridge | Passed: renderer.configure and persona.surface acknowledged |

### Profile Baseline

Each profile was sampled for ten seconds at a transparent `612 x 816` window.
The first Performance launch was cold, so its startup measurement should not be
compared directly with the warmed Balanced and Quality launches.

| URP Asset | Startup to ready | Average FPS | Unity allocated | Working set | Private memory |
| --- | ---: | ---: | ---: | ---: | ---: |
| `performance` | `7.98 s` (cold) | `30.09` | `85.0 MiB` | `285.0 MiB` | `550.5 MiB` |
| `balanced` | `5.86 s` | `60.05` | `84.8 MiB` | `291.4 MiB` | `583.7 MiB` |
| `quality` | `5.98 s` | `60.06` | `85.1 MiB` | `295.4 MiB` | `614.3 MiB` |

Raw snapshots are stored in:

- `Logs/product-v3-performance-metrics.json`
- `Logs/product-v3-balanced-metrics.json`
- `Logs/product-v3-quality-metrics.json`

Final metrics:
`F:\AILIS_self_evolution_runtime\unity-character-demo\Logs\product-v2-final-release-metrics.json`

Final Unity render:
`F:\AILIS_self_evolution_runtime\unity-character-demo\Logs\product-v2-final-release.png`

Desktop-composited bubble evidence:
`F:\AILIS_self_evolution_runtime\unity-character-demo\Logs\product-v2-bubble-desktop-2.png`

Unity's own screenshot represents transparent pixels as black. The desktop
capture is the relevant evidence for Windows transparency and shows the model
composited directly over the AILIS control panel.

### ChatdollKit Runtime Validation

The isolated ChatdollKit v0.8.16 performance layer was built and exercised on
`2026-07-24` with the Unity-Chan AssetBundle character.

| Check | Result |
| --- | --- |
| Windows release build | Passed |
| Startup to AssetBundle character ready | `2.386 s` (latest validation) |
| Registered motion catalog | 9 motions |
| Registered idle modes | 15 manifest-derived semantic modes |
| Automatic blink binding | Passed |
| Semantic sequence | `idle-relaxed -> greeting -> thinking -> celebrate` |
| ChatdollKit motion scheduling | Passed for all four states |
| Natural idle rotation | Passed: `WAIT00 <-> WAIT01`, no immediate repeat |
| One-shot idle return | Passed: `HANDUP00_R -> task:idle` |
| AILIS Animator expression layer | Preserved |
| Transparent desktop composition | Preserved |
| Player exceptions / missing states | 0 |

Desktop-composited runtime evidence:
`F:\AILIS_self_evolution_runtime\unity-character-demo\Logs\chatdollkit-runtime-window.png`

ChatdollKit is used only behind the AssetBundle avatar adapter. Its LLM,
memory, TTS, ASR, UI, networking, and text-tag parser are not present in the
AILIS renderer. PersonaSurface remains the single semantic input, and AILIS
continues to own face expressions, external visemes, bubbles, window state, and
transparent composition.

## Implemented and Verified

- Release build without the Development watermark or debug panel.
- Alpha-transparent, topmost Windows desktop window.
- Per-pixel opacity hit testing for transparent areas.
- DPI-aware client-size compensation and bottom-right placement.
- Persistent `performance`, `balanced`, and `quality` URP assets.
- Live runtime changes to URP Asset fields, Camera rendering, Global Volume,
  standard Light components, and window framing.
- Manifest-driven camera and three-point art lighting.
- Dynamic multilingual dialogue bubble with measured layout and head tracking.
- Lazy VRMA action loading for VRM characters.
- ChatdollKit weighted idles, one-shot action queue, transitions, and idle
  return for AssetBundle characters.
- Motion trace confirmed `idle -> celebrate -> thinking` in the player log.
- Silent mouth motion from semantic speech energy when TTS is disabled.
- External `aa/ih/ou/ee/oh` viseme input for future TTS timing data.
- VRM expressions, blink, and gaze.
- Runtime adapter registry with `vrm` and `asset-bundle` adapters.

## Pluggable Asset Contract

`ailis-character.json` selects the adapter, model, art profile, and semantic
motion definitions. Electron and the language model only emit semantic state.
They never choose a VRMA filename, Animator state, shader, or blend shape.

VRM is loaded directly. FBX and `.unitypackage` are Unity editor source formats;
they are imported and exported as an AssetBundle before the runtime
`asset-bundle` adapter loads their prefab and Animator states. This gives those
formats a real runtime path without coupling AILIS to one model pipeline.

## Comparison with the First Demo

| Area | First Unity demo | Runtime v2 |
| --- | ---: | ---: |
| Average FPS | `39.03` | `60.02` |
| Render size | `612 x 816` | exact `720 x 960` |
| Build mode | Development | Release |
| Debug UI / watermark | visible | removed |
| Desktop placement | unstable | restored and positioned |
| Dialogue bubble | absent | multilingual, measured, tracked |
| Motion system | one idle VRMA | manifest catalog, lazy switching |
| Lip sync | sine-wave energy only | silent energy plus external visemes |
| Model format | fixed VRM | adapter registry plus AssetBundle path |

## Remaining Production Gates

- Startup is still above the preferred `3 s` target.
- The v3 single-machine baseline needs repetition on clean startup and lower-end
  GPUs before it becomes a release-performance claim.
- The Unity-Chan AssetBundle path is visually validated; additional character
  packages still need per-package motion, expression, and material validation.
- Dragging, multi-monitor persistence, and click interaction need a product UX
  pass before this replaces the current desktop pet.
- The source model is still the existing AILIS VRM, so further visual quality
  improvements eventually require better source textures/materials or an HD
  character package, not only renderer settings.

The next step is a fresh startup/frame-time/memory benchmark pass, followed by
one small HD/FBX AssetBundle art test. Three.js remains the safe fallback until
those product-quality gates are complete.
