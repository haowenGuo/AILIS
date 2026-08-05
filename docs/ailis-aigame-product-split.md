# AILIS / AIGAME Product Split

## Product Boundary

AILIS and AIGAME share the agent runtime, memory, persona, voice, dialogue, and renderer-neutral character semantics. They differ at the product capability and packaging layers.

| Product | Primary purpose | Character renderer | Unity player in package | Application ID |
| --- | --- | --- | --- | --- |
| AILIS | Lightweight desktop companion and task agent | Electron / Three.js | No | `com.ailis.desktop` |
| AIGAME | High-fidelity interactive character and game-oriented development | Unity, with Electron fallback | Yes | `com.ailis.aigame` |

The shared persona surface continues to emit renderer-neutral expressions, gesture intents, speech energy, gaze, and task state. AILIS maps them to Three.js/VRM; AIGAME can map the same protocol to Unity Animator, Playables, expressions, and lip sync.

## Runtime Contract

`electron/ailis-product-variant.cjs` is the single product capability source.

- AILIS exposes only the `electron` character-renderer backend.
- AIGAME exposes `unity` and `electron`, with Unity as the fresh-install default.
- An old AILIS preference containing `characterRendererBackend=unity` is normalized back to Electron.
- The Unity runtime refuses discovery and launch when the active product does not enable it.

This keeps the product decision out of model prompts and avoids scattered UI-only feature flags.

## Packaging

AILIS uses `electron-builder.yml`. Its file list contains no Unity build or Unity runtime pack.

AIGAME uses `electron-builder.aigame.yml`. Before packaging it builds the Unity project and copies only the Windows player output into:

```text
resources/character-renderers/unity/
```

The current local Unity player is approximately 321 MB unpacked, so keeping it exclusive to AIGAME materially reduces AILIS download and installation size.

## Build Commands

```powershell
# Lightweight AILIS
pnpm release:plan
pnpm release:core

# Unity-based AIGAME
pnpm release:aigame:plan
pnpm release:aigame
```

For a local AIGAME development launch:

```powershell
pnpm aigame:desktop:start
```

## Source Layout

The repository remains shared for now so the agent and persona code do not fork. Product-specific boundaries are explicit:

- Shared: `electron/ailis-*`, persona protocol, memory, voice, chat, Three renderer, character semantic catalog.
- AILIS product config: `electron-builder.yml`, `ailis` product variant.
- AIGAME product config: `electron-builder.aigame.yml`, `aigame` product variant.
- AIGAME renderer source/assets: `unity-character-demo/`.

If AIGAME later becomes a separate repository, the product variant and builder boundary provide a clean extraction point without duplicating the shared agent runtime first.
