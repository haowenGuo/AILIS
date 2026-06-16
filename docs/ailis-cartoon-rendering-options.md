# AILIS Cartoon Rendering Options

This note collects cartoon/anime rendering options for AILIS. It uses the current AILIS VRM/MToon stack, local HaoRender-GI LookDev presets, and mature public toon-rendering references.

## Local Baseline

AILIS currently uses:

- Three.js `WebGLRenderer`
- `@pixiv/three-vrm`
- VRM 1.0 model with `VRMC_materials_mtoon`
- One ambient light and one directional light
- No dedicated cartoon render runtime yet

HaoRender-GI already has a mature LookDev control surface under:

- `F:\haorender-gi\HaoRender-GI\StylePresets`
- `F:\haorender-gi\HaoRender-GI\docs\lookdev_rendering_skill_library.md`
- `F:\haorender-gi\HaoRender-GI\src\rendering\opengl_rasterizer.cpp`

The relevant HaoRender-GI parameters are:

- Phong/toon: `diffuseSteps`, `diffuseSoftness`, `shadowFloor`, `litFloor`, `rampBias`, `rampContrast`
- Shadow art direction: `shadowMapStrength`, `shadowThreshold`, `shadowSoftness`, `shadowTint`
- Highlight: `highlightThreshold`, `highlightSoftness`, `highlightStrength`, `highlightTint`
- Rim: `rimStrength`, `rimPower`, `rimTint`, `rimThreshold`, `rimSoftness`
- Material remap: `materialTextureStrength`, `materialLift`, `materialSaturation`, `materialContrast`
- Outline: `widthPixels`, `opacity`, `depthBias`, `color`

## Option A: MToon Native Soft Anime

Best first choice.

Source idea:

- Use AILIS's existing VRM MToon material instead of replacing the shader.
- Borrow HaoRender-GI `genshin_like_soft_game_anime_v3_balanced` as the taste target.
- Map HaoRender's colored shadows, gentle rim, modest outline, and restrained material lift into MToon parameters.

Implementation:

- Add `src/character-render/mtoon-material-controller.js`.
- Traverse `vrm.scene` after load and collect `material.isMToonMaterial`.
- Classify materials by name: `SKIN`, `FACE`, `EYE`, `HAIR`, `CLOTH`.
- Snapshot original values for reset.
- Apply deltas to:
  - `shadeColorFactor`
  - `shadingShiftFactor`
  - `shadingToonyFactor`
  - `giEqualizationFactor`
  - `parametricRimColorFactor`
  - `rimLightingMixFactor`
  - `parametricRimFresnelPowerFactor`
  - `parametricRimLiftFactor`
  - `outlineWidthFactor`
  - `outlineColorFactor`
  - `outlineLightingMixFactor`

Candidate profile:

```js
{
  id: 'ailis_mtoon_soft_balanced',
  label: 'Soft Anime Balanced',
  source: 'HaoRender-GI genshin_like_soft_game_anime_v3_balanced',
  renderer: {
    toneMappingExposure: 1.08,
    ambientIntensity: 2.25,
    keyIntensity: 1.05,
    keyColor: '#fff7ee',
    rimLightIntensity: 0.22,
    rimLightColor: '#d7eaff'
  },
  materialGroups: {
    skin: {
      shadeColorMix: '#e6cad6',
      shadeColorMixWeight: 0.28,
      shadingToonyFactor: 0.88,
      rimColor: '#dcecff',
      rimStrength: 0.08,
      outlineScale: 0.90
    },
    hair: {
      shadeColorMix: '#cfe2ec',
      shadeColorMixWeight: 0.16,
      shadingToonyFactor: 0.82,
      rimColor: '#d9ecff',
      rimStrength: 0.12,
      outlineScale: 1.05
    },
    cloth: {
      shadeColorMix: '#adb8eb',
      shadeColorMixWeight: 0.22,
      shadingToonyFactor: 0.92,
      rimColor: '#d9e8ff',
      rimStrength: 0.10,
      outlineScale: 1.05
    },
    faceLine: {
      outlineScale: 0.0,
      preserveAlpha: true
    },
    eye: {
      shadeColorMixWeight: 0.0,
      rimStrength: 0.0,
      emissiveLift: 0.04,
      preserveAlpha: true
    }
  }
}
```

Pros:

- Lowest risk.
- Keeps VRM/MToon compatibility.
- Does not break transparent hair/eye material ordering.
- Easy to toggle and reset.

Cons:

- Cannot reproduce all HaoRender Phong-toon controls exactly.
- No custom ramp texture or true material albedo remap in v1.

## Option B: HaoRender Phong-Toon Port

Most faithful to HaoRender-GI.

Source idea:

- Port the shader math from `opengl_rasterizer.cpp`:
  - `toonBandValue`
  - `toonThreshold`
  - `applyToonMaterialOverride`
  - `applyToonRamp`
  - `accumulatePhongLight`
  - `buildRimLight`
- Use HaoRender-GI presets directly as AILIS render profiles.

Implementation:

- Add a custom Three.js `ShaderMaterial` or an `onBeforeCompile` pipeline.
- Preserve original base color, normal, alpha, emissive textures.
- Add uniforms matching HaoRender's Phong/toon parameter set.
- Add a second outline pass or use MToon outline as fallback.

Candidate profile:

```js
{
  id: 'ailis_haorender_phong_toon_balanced',
  source: 'HaoRender-GI genshin_like_soft_game_anime_v3_balanced',
  exposure: 1.15,
  normalStrength: 0.72,
  phong: {
    diffuseStrength: 1.08,
    ambientStrength: 0.10,
    secondaryLightScale: 0.38,
    specularStrength: 0.28,
    smoothness: 0.70,
    shininess: 46.0,
    rimStrength: 0.28,
    rimPower: 2.10,
    rimTint: '#d6ebff',
    toon: {
      diffuseSteps: 3.0,
      diffuseSoftness: 0.12,
      shadowFloor: 0.08,
      litFloor: 0.48,
      rampBias: 0.02,
      rampContrast: 0.92,
      shadowMapStrength: 0.40,
      shadowThreshold: 0.40,
      shadowSoftness: 0.15,
      shadowTint: '#adbaf2',
      highlightThreshold: 0.40,
      highlightSoftness: 0.095,
      highlightStrength: 0.50,
      highlightTint: '#fff5e6',
      rimThreshold: 0.33,
      rimSoftness: 0.12,
      materialOverrideEnabled: true,
      materialTextureStrength: 0.94,
      materialLift: 0.025,
      materialSaturation: 1.05,
      materialContrast: 0.95
    },
    outline: {
      enabled: true,
      widthPixels: 1.10,
      opacity: 0.48,
      color: '#0f111a'
    }
  }
}
```

Pros:

- Reuses the strongest HaoRender-GI system directly.
- Gives us real toon ramps, material remap, highlight control, and rim shaping.
- Best if the goal is a controllable LookDev panel like HaoRender.

Cons:

- Higher engineering risk.
- May break some VRM-specific MToon behavior.
- Transparent hair, lashes, eyes, and face overlays need careful sorting.
- More work to keep expressions, alpha modes, and outlines stable.

## Option C: Bright Game-Anime Viewer

Best if AILIS currently feels dull, dark, or low-energy.

Source idea:

- Borrow HaoRender-GI `genshin_like_soft_game_anime_v2_bright_viewer`.
- Brighter exposure, lower normal intensity, higher fill, softer blue-violet shadows, subtle outline.

Implementation path:

- Can be implemented as either Option A's MToon profile or Option B's Phong-toon shader.
- For AILIS, start with MToon version first.

Candidate taste:

```js
{
  id: 'ailis_mtoon_bright_viewer',
  exposure: 1.14,
  ambientIntensity: 2.38,
  keyIntensity: 1.00,
  fillIntensity: 0.35,
  materialLift: 0.06,
  materialContrast: 0.86,
  shadowTint: '#bac4fa',
  outlineOpacity: 0.38,
  rimStrength: 0.08
}
```

Pros:

- More lively on a desktop pet.
- Good for small transparent window readability.
- Safer than hard cel.

Cons:

- Easy to wash out black/dark clothing.
- Needs per-material guardrails so eyes and face lines do not become pale.

## Option D: ArcSys Hard 2D Cel

Use only as an optional dramatic style.

Source idea:

- Arc System Works' Guilty Gear Xrd pursued a 2D fighting-game look in a 3D framework.
- HaoRender-GI's skill library maps this to sharp bands, hard specular, primary light only, thick outline, low fill.

Candidate taste:

```js
{
  id: 'ailis_hard_2d_cel',
  diffuseSteps: 2.0,
  diffuseSoftness: 0.025,
  shadowThreshold: 0.52,
  shadowSoftness: 0.025,
  highlightSoftness: 0.02,
  outlineWidthPixels: 2.4,
  outlineOpacity: 0.82,
  ambientStrength: 0.04,
  primaryLightOnly: true
}
```

Pros:

- Strong visual difference.
- Good for special emote/showcase mode.

Cons:

- Not a good default for AILIS.
- Requires art-directed normals/camera/animation to really work.
- Can make VRM face and hair look harsh.

## Option E: TF2 / Gooch Readability

Use if the goal is clear silhouette and readable shape rather than anime.

Source idea:

- TF2 emphasizes silhouette, rim highlights, luminance/hue variation, and readability.
- Gooch shading uses cool-to-warm hue shifts and reserves extremes for edges/highlights.

Candidate taste:

```js
{
  id: 'ailis_readability_rim',
  outlineEnabled: false,
  rimStrength: 0.22,
  rimPower: 1.8,
  warmLight: '#fff0dc',
  coolShadow: '#b9c6f2',
  diffuseSoftness: 0.18,
  saturation: 1.05
}
```

Pros:

- Good desktop readability.
- Less risk around transparent face/hair outlines.

Cons:

- Less "二次元声优/动漫女孩子" than MToon soft anime.
- More Western illustrative than Japanese anime.

## Recommended Choice

Start with Option A and include Option C as a toggle.

Then, after visual approval, port Option B if we still need HaoRender-level control.

Reason:

- AILIS already uses VRM/MToon.
- The model already stores MToon data.
- MToon runtime tuning is reversible.
- HaoRender's full Phong-toon shader is powerful, but replacing VRM materials too early risks alpha sorting, eye highlight, face overlay, and outline regressions.

## Acceptance Test

Before committing a render profile as default, capture these states:

- idle
- speaking
- thinking
- happy
- sad
- dance

For each state compare:

- source VRM
- `ailis_mtoon_soft_balanced`
- `ailis_mtoon_bright_viewer`
- optional `ailis_haorender_phong_toon_balanced`

Reject if:

- eye highlights bloom or disappear
- eyelashes/face lines become dirty
- hair alpha flickers
- outline crawls during motion
- dance looks clipped or noisy
- desktop transparent window background is polluted

## External References

- Unity Toon Shader: https://docs.unity3d.com/ja/Packages/com.unity.toonshader%400.9/manual/GettingStarted.html
- VRM MToon: https://vrm.dev/en/univrm/shaders/shader_mtoon/
- Arc System Works Guilty Gear Xrd GDC talk: https://www.arcsystemworks.com/guilty-gear-xrds-art-style-the-x-factor-between-2d-and-3d-talk-from-gdc-2015-is-now-available-online/
- Valve Team Fortress 2 illustrative rendering paper: https://steamcdn-a.akamaihd.net/apps/valve/2007/NPAR07_IllustrativeRenderingInTeamFortress2.pdf
