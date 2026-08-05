# AILIS Unity Character Runtime

This project is the second-stage Unity sidecar prototype for the AILIS desktop
character. It renders a transparent topmost desktop character while Electron
continues to own chat, memory, agent execution, voice, and settings UI.

## Runtime Boundaries

The renderer consumes semantic commands. It does not receive model-specific
blend-shape names or animation clip names from the language model.

```text
AILIS persona output
  -> persona.surface / persona.lip
  -> character runtime
  -> character package manifest
  -> avatar adapter (vrm or asset-bundle)
  -> model, motion, expressions, lip sync, and art profile
```

The current adapters are:

- `vrm`: directly loads a `.vrm` model and lazily loads `.vrma` motions.
- `asset-bundle`: loads a Unity prefab from an AssetBundle. FBX models and
  `.unitypackage` content must first be imported in Unity and exported as an
  AssetBundle because they are editor source formats, not runtime formats.

The importer performs that editor-only conversion and keeps the shipped player
independent from a user's Unity installation:

```powershell
pnpm unity:character:import -- `
  --package F:\AILIS-Unity\source-cache\character-packages\character.unitypackage `
  --recipe unity-character-demo\CharacterRecipes\character.json `
  --activate
```

An import recipe names the source prefab, semantic motions, a VRM 1.0
expression profile, canonical visemes, blink shapes, art profile, and the
license directory. The importer creates a script-clean runtime prefab, builds
and reopens a Windows AssetBundle as verification, emits
`ailis-character.json`, and copies the asset license. Raw Asset Store packages
are never treated as MIT source files.

New formats register an `IAilisAvatarAdapter` without changing the persona or
Electron protocol.

## ChatdollKit Performance Layer

The `asset-bundle` adapter uses the model-performance subset of ChatdollKit
v0.8.16 as an internal animation scheduler. ChatdollKit owns semantic weighted
idle pools, no-immediate-repeat idle selection, one-shot action queues,
transitions, idle return, and automatic blink timing. AILIS remains the only
source of semantic state:

```text
PersonaSurface
  -> AILIS semantic motion/expression selection
  -> AilisChatdollKitPerformanceBridge
  -> ChatdollKit ModelController
  -> character Animator
```

This is deliberately not a second assistant runtime. The vendored subset does
not include ChatdollKit LLM, memory, ASR, TTS, UI, networking, or text-tag
parsing. AILIS continues to own expressions, visemes, dialogue bubbles, voice,
window placement, and transparent composition. If the ChatdollKit bridge
cannot configure a character, the adapter falls back to the existing AILIS
motion driver.

Idle pools are generated from each character package's existing
`gestureIntents`, `taskStates`, `emotions`, and `priority` metadata. Motions
also declare `compatibility`, `fallbackMotionId`, and optional
`collisionZones`. Automatic scheduling uses only character-approved motions
and resolves reviewed clips through their package-authored fallback. There are
no Unity-Chan-specific action branches in the scheduler, so another character
package automatically receives the same behavior from its own capability
manifest.

The vendored source, pinned revision, local compatibility changes, and
Apache-2.0 attribution are recorded in
`Assets/ThirdParty/ChatdollKit/NOTICE.md`.

## Character Package

`Assets/StreamingAssets/ailis-character.json` owns the package identity,
adapter, model path, art profile, and semantic motion catalog. Motion selection
uses manifest metadata rather than hard-coded file names. The runtime resolves
`gestureIntent`, `taskState`, and `emotion` against the motions actually
available in the active character package and can choose between equally
appropriate variants without exposing Unity state names to the model.

AILIS uses VRM 1.0 Expression as the renderer-neutral facial protocol. A
profile binds each standard preset or custom expression key to the controls
available on that character. Native VRM avatars send the key directly to
UniVRM; AssetBundle avatars resolve the same key to an Animator state or one
or more BlendShapes:

```json
{
  "vrmExpressionProfile": {
    "schema": "ailis.vrm-expression-profile.v1",
    "standard": "VRM-1.0",
    "bindings": [
      {
        "id": "happy",
        "preset": "happy",
        "driver": "animator-state",
        "stateName": "Smile",
        "layerIndex": 1,
        "isBinary": false,
        "overrideBlink": "blend",
        "overrideLookAt": "none",
        "overrideMouth": "none",
        "weight": 1.0,
        "transitionSeconds": 0.16
      }
    ]
  }
}
```

The standard preset keys are `happy`, `angry`, `sad`, `relaxed`, `surprised`,
`neutral`, the five mouth visemes, blink keys, and look-at keys. Character
specific expressions use `preset: "custom"` plus `customName`. VRM 1.0
`isBinary` and `overrideBlink`/`overrideLookAt`/`overrideMouth` behavior is
preserved by both adapters. Different characters may expose different custom
expressions and motions; unsupported keys are ignored and facial state falls
back to `relaxed`/`neutral`.

The package can be replaced at launch:

```powershell
AILISCharacterDemo.exe --character-package D:\Characters\my-character.json
```

## Render Profiles

Renderer settings live in `ailis-renderer-settings.json` and are copied to a
persistent user settings file after the first runtime configuration command.
On Windows the persistent file is under:

```text
%USERPROFILE%\AppData\LocalLow\AILIS\AILIS Character Renderer\character-renderer-settings.json
```

Available presets:

| URP Asset | Render Scale | MSAA | Shadow distance / cascades | Intended use |
| --- | ---: | ---: | --- | --- |
| `performance` | `0.85` | 2x | `8 m / 1` | lower-power devices |
| `balanced` | `1.00` | 4x | `12 m / 2` | default desktop pet |
| `quality` | `1.00` | 4x | `18 m / 4` | higher shadow quality |

All individual values remain configurable. These are real Unity URP Asset,
Camera, Volume, Light, and window properties; the named asset is a starting
point, not a lock on the other settings.

## Commands

Build and start:

```powershell
pnpm unity:demo:build
pnpm unity:demo:start
```

Change rendering while the sidecar is running:

```powershell
pnpm unity:demo:balanced
pnpm unity:demo:crisp
pnpm unity:demo:ultra
```

Exercise character channels:

```powershell
pnpm unity:demo:action
pnpm unity:demo:thinking
pnpm unity:demo:speaking
```

The lower-level script also exposes `configure`, `action`, `lip`, and
`send` commands. All messages are acknowledged over loopback UDP.

## Implemented Presentation Systems

- Transparent, topmost, opacity-hit-tested desktop window.
- Persistent render options and runtime profile switching.
- Model-relative art profile for camera and three-point lighting.
- Chinese/Japanese/Korean-capable dynamic UI font fallback.
- Measured dialogue bubble that follows the avatar head and stays on-screen.
- ChatdollKit-backed looping, weighted idle, one-shot queue, transitions, and
  idle return for AssetBundle characters.
- PersonaSurface-to-VRM-1.0 expression frames shared by both avatar adapters.
- Data-driven VRM expression bindings for Animator states and weighted morph
  targets. Imported facial clips are sampled at one coherent pose time rather
  than combining unrelated per-curve peaks.
- Smooth expression, face-layer, blink, and lip transitions.
- Silent speech-energy mouth motion when TTS is disabled.
- External viseme input (`aa`, `ih`, `ou`, `ee`, `oh`) for future TTS timing.
- VRM expression, blink, and gaze channels.

## Integration Status

This remains an optional renderer rather than the default AILIS desktop
renderer. Electron now owns its lifecycle, waits for the Unity ready event,
forwards the persona surface and URP configuration, and restores the Electron
renderer when Unity fails. The next production gate is to compare startup,
memory, and frame-time across more machines. ChatdollKit scheduling is
currently enabled for the validated AssetBundle character path; the direct VRM
adapter keeps its existing AILIS motion implementation.
