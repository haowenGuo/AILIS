# AIGL Shader Rendering System Research

## Current State

AIGL is rendered by `src/vrm-model-system.js` with a transparent `THREE.WebGLRenderer`, one ambient light, one directional light, and the VRM model's loaded materials. There is no dedicated render runtime for material tuning, outline tuning, rim light, matcap, color grading, or post-processing.

The current VRM file is not a dead end. `Resources/AiGril.vrm` is a VRM 1.0/glTF 2.0 asset with:

- 16 materials
- 26 textures/images
- `VRMC_materials_mtoon` on every material
- `KHR_materials_unlit` on every material
- existing outline data on skin/body/clothes/hair, but many face/eye/hair-back parts have outline disabled

This means the next improvement should not start from a custom raw GLSL shader. The safer path is to build a render runtime around MToon first, because the model already carries MToon authoring data.

## Practical Ceiling

VRM is not the ceiling by itself. The ceiling comes from four layers:

1. Model asset quality: mesh topology, texture resolution, facial blendshapes, hair cards, clothing geometry.
2. Motion quality: animation data, retargeting, root motion, clipping.
3. Runtime behavior: gaze, expression mixing, idle motion, camera, timing.
4. Rendering style: MToon settings, outline, rim light, color management, post-processing.

The project has already spent most effort on layer 2 and 3. The most promising remaining visual gains are now in layer 4.

## Rendering Architecture

Add a dedicated rendering layer instead of continuing to grow `vrm-model-system.js`.

```text
src/character-render/
  render-profile.js
  mtoon-material-controller.js
  lighting-controller.js
  postprocess-pipeline.js
  render-debug-panel.js
```

The runtime should sit beside Character Runtime:

```text
Persona Surface State
        |
Character Runtime
        |
VRM Driver -------------- Character Render Runtime
        |                         |
Animation / Expression        MToon / Light / Post FX
        |                         |
                 VRMModelSystem
```

## MToon First

The first implementation should collect all MToon materials after `loadModel()` and classify them by material name:

- `SKIN`: face/body skin
- `EYE`: iris, white, highlight
- `FACE`: brow, eyelash, eyeline, mouth
- `HAIR`: hair and hair back
- `CLOTH`: tops, bottoms, shoes

Then apply profile deltas instead of overwriting source values blindly.

Recommended first profile: `aigl_soft_anime_v1`.

Targets:

- Skin: softer shade color, slightly smoother toon boundary.
- Eyes: preserve alpha/blend ordering, avoid bloom overkill.
- Hair: add gentle rim, avoid heavy outline on hair cards.
- Clothes: keep outline visible but not dirty.
- Face lines: avoid global outline duplication around brows/lashes.

Important MToon properties exposed by the local `@pixiv/three-vrm-materials-mtoon` package:

- `shadeColorFactor`
- `shadingShiftFactor`
- `shadingToonyFactor`
- `giEqualizationFactor`
- `matcapFactor`
- `matcapTexture`
- `parametricRimColorFactor`
- `rimLightingMixFactor`
- `parametricRimFresnelPowerFactor`
- `parametricRimLiftFactor`
- `outlineWidthMode`
- `outlineWidthFactor`
- `outlineColorFactor`
- `outlineLightingMixFactor`
- `debugMode`

## Post-Processing

Post-processing should be optional and conservative for the desktop pet window. The first useful chain is:

```text
RenderPass -> small custom color pass -> optional UnrealBloomPass -> OutputPass
```

Use `OutlinePass` only for debug or selected-object experiments. MToon already has model-aware outline data; a screen-space outline can look noisy around transparent hair, eyelashes, and face lines.

Good first post effects:

- Tiny brightness/contrast/saturation pass.
- Very soft bloom only on eye highlight or emissive-like regions if material masking is available.
- Optional vignette is not recommended for the transparent pet window.

## Implementation Plan

### v1: Render Runtime Baseline

- Create `src/character-render/mtoon-material-controller.js`.
- Collect and snapshot original material parameters.
- Apply a named render profile.
- Expose `applyRenderProfile(profileId)` and `resetRenderProfile()`.
- Add tests that verify materials are classified and changed without losing original texture references.

### v2: Live Tuning Panel

- Add a compact control-panel section for render profile, outline strength, rim strength, shade softness, and light warmth.
- Save preferences through the existing desktop state store.
- Add a reset button to return to source VRM values.

### v3: Lighting Upgrade

- Replace the single plain directional light with a small rig:
  - soft key
  - weak fill
  - subtle hair/rim light
- Let scene mood control light profile, not raw intensities everywhere.

### v4: Optional Post FX

- Add an optional postprocess pipeline behind a preference toggle.
- Default off until visually accepted.
- Use screenshots to compare `off`, `mtoon`, and `mtoon+postfx`.

## Acceptance

The render system is acceptable only if:

- The original VRM can be restored at runtime.
- No texture references are lost.
- Transparent hair, eyelashes, and eye highlights do not flicker.
- The desktop pet remains transparent.
- The render profile does not make task/dance animations look clipped or dirty.
- `pnpm build` passes.
- A screenshot comparison exists for idle, speaking, thinking, happy, sad, and dance.

## References

- @pixiv/three-vrm MToon module: https://pixiv.github.io/three-vrm/docs/modules/three-vrm-materials-mtoon
- @pixiv/three-vrm MToonMaterial API: https://pixiv.github.io/three-vrm/docs/classes/three-vrm-materials-mtoon.MToonMaterial.html
- VRMC_materials_mtoon 1.0 specification: https://github.com/vrm-c/vrm-specification/tree/master/specification/VRMC_materials_mtoon-1.0
- Three.js post-processing modules: https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing
