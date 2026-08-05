# AILIS Character Art And Motion Runtime Roadmap

## Purpose

AILIS already has a functioning VRM/MToon renderer, semantic character state,
expression mixing, lip sync, procedural body motion, VRMA playback, and a local
asset-pack runtime. The visual problem is not the absence of these pieces. It is
that model authoring, render tuning, motion intake, semantic motion selection,
packaging, and visual acceptance are not connected by one production pipeline.

This roadmap keeps the existing VRM runtime and improves it in layers. It does
not treat a heavier shader or a larger texture as a universal fix.

## Measured Baseline

Run:

```powershell
pnpm character:audit
```

The current built-in AILIS model is a VRoid Studio VRM 1.0 asset with roughly:

- 44,872 triangles.
- 16 materials.
- 26 embedded images, with textures up to 2048 x 2048.
- 14 standard/custom expression entries.
- Spring-bone data and 28 colliders.

The current repository also contains substantially more motion data than the
stable runtime exposes:

- 52 VRMA files are present under the motion asset tree.
- 21 motions are currently loadable.
- Only the three idle motions are approved for stable automatic use.
- Eight of fourteen non-empty semantic gesture intents have no one-shot motion
  candidates: listening, thinking, working, approval, shy, comfort, apologize,
  and angry.

The default pet frame is 612 x 816 CSS pixels at 85% scale. The renderer uses a
2x backing resolution by default, so the normal frame is rendered near
1224 x 1632 pixels. This means the main model is not simply being displayed at
an obviously inadequate framebuffer resolution.

### Unity Sidecar v3 Status

The Unity renderer is now an optional production sidecar for the same semantic
character surface. Electron owns the product window, settings, chat, memory,
and agent runtime; it launches Unity only when the user selects the Unity
backend, waits for a `renderer.ready` event, forwards semantic surface commands,
and automatically restores the Electron renderer on failure.

Rendering settings now map to Unity 2022.3 URP 14 objects rather than a custom
toon-control layer: `UniversalRenderPipelineAsset` controls render scale, MSAA,
shadow distance, and cascades; `UniversalAdditionalCameraData` controls camera
anti-aliasing and post-processing; `VolumeProfile` controls color adjustments
and bloom; real `Light` and `RenderSettings` properties control lighting. The
three packaged URP assets are `performance`, `balanced`, and `quality`.

The current Windows build is `96.44 MiB`. Fresh D3D11/RTX 3060 measurements at
`612 x 816` put VRM-ready startup between `5.86 s` and `7.98 s` (the first cold
launch was the slow outlier). Balanced and Quality both held about `60 FPS`;
Performance intentionally held about `30 FPS`. The Player loaded Idle and
Thinking VRMA motions and accepted live URP/Camera/Volume configuration. An
Electron-runtime integration check also completed `starting -> renderer.ready
-> unity` and verified configuration and semantic-command acknowledgements.
Detailed evidence is in `unity-character-demo/DEMO_REPORT.md`.

## Root Causes

### Perceived Detail

The built-in model is not extremely low-poly, but it is still recognizably a
mostly stock VRoid production asset. More polygons alone will not materially
improve the face, hair, eyes, clothing silhouette, or material identity.

The 75 degree perspective camera is also unusually wide for a close character
portrait. It makes the model fit easily, but can reduce the premium portrait
feeling and exaggerate perspective. This should be evaluated with fixed
screenshots before changing the default because camera changes also affect
speech-bubble anchoring and pointer hit testing.

The runtime has MToon material grouping, render profiles, key/fill/rim lights,
outlines, shadows, and resolution controls. Missing or unverified areas include
an explicit color-management baseline, texture anisotropy, a portrait-camera
comparison, and a fixed screenshot acceptance board. Heavy temporal
antialiasing is not recommended for the transparent anime character because it
can blur face lines and hair.

### Motion Variety

The action system has three separate layers:

1. VRMA clips.
2. Procedural body motion.
3. Semantic state to gesture selection.

The procedural layer currently affects the spine, chest, neck, head, and
shoulders. It creates breathing and small sways, but does not create convincing
hand, arm, pelvis, eye-saccade, or weight-shift behavior.

The clip layer has candidates, but most are intentionally blocked because they
have not passed visual clipping/style review or have unresolved redistribution
licenses. Enabling every local file would create a legal and visual regression.

The semantic selection layer is sparse. AILIS can express many states through
face and posture, but most states cannot select a reviewed one-shot gesture.

### Missing Production Loop

`src/character/character-runtime-lab.js` contains useful manual and automatic
checks for expressions, semantic states, motions, and lip sync. It is not wired
into a working application entry point, so it currently behaves as dead
diagnostic code.

The asset-pack manifest can carry a VRM, render profile, persona style, voice
profile, and expression metadata. It cannot carry a motion set, semantic motion
map, camera profile, spring-bone overrides, or per-asset license manifest.
Consequently a high-quality community character cannot bring its own complete
performance direction.

## Target Architecture

```text
Character Pack v2
  model.vrm
  render-profile.json
  expression-map.json
  motion-set.json
  motions/*.vrma
  camera-profile.json
  spring-profile.json
  licenses.json
          |
          v
Character Asset Validator
  format / compatibility / license / file integrity
          |
          v
Character Runtime
  semantic state
  expression lane
  gaze lane
  additive micro-motion lane
  reviewed one-shot motion lane
  spring-bone lane
          |
          v
Character Render Runtime
  material groups
  MToon profile
  portrait camera
  key/fill/rim rig
  quality preset
          |
          v
Character Acceptance Board
  fixed states / fixed camera / screenshots / performance / clipping review
```

## Implementation Phases

### Phase 0: Audit And Acceptance

- Keep `pnpm character:audit` as the reproducible inventory baseline.
- Restore the Character Runtime Lab behind a developer-only entry point.
- Add a fixed capture board for idle, listening, speaking, thinking, working,
  shy, success, sad, and one-shot motion.
- Record frame time, draw calls, triangles, render-buffer size, active motion,
  expression weights, and material profile in each capture.
- Do not approve a motion solely because it loads.

Exit condition: every visual change can be compared against the same states and
camera instead of being judged from one attractive pose.

### Phase 1: Render Clarity

- Explicitly establish renderer output color space and verify current MToon
  colors against the source model.
- Apply capped anisotropy to color textures after model loading.
- Compare 75, 50, 42, and 35 degree portrait cameras while preserving the same
  on-screen character height.
- Keep MSAA for the transparent pet. Test SMAA only as an optional comparison;
  avoid TAA unless line stability proves better in motion.
- Build three product-facing quality presets rather than exposing every raw
  render number: efficient, balanced, and high quality.
- Validate on Windows display scaling at 100%, 125%, 150%, and 200%.

Exit condition: eyes, eyelashes, hair tips, and outlines stay sharp during idle
and speech without increasing average GPU frame time beyond the selected
quality preset.

### Phase 2: Motion Coverage

- Replace the boolean motion approval concept with explicit runtime tiers:
  `stable_auto`, `stable_on_cue`, `manual_only`, and `rejected`.
- Resolve licenses before redistributing local named and official VRoid clips.
- Produce or clean at least these core gestures: greeting, farewell, listening,
  thinking, working, waiting for approval, success, shy, comfort, apology,
  surprise, angry, and two neutral conversation gestures.
- Add non-repeating selection with cooldown and intensity limits.
- Extend procedural motion through data-driven pose profiles for upper arms,
  forearms, hands, pelvis, and eye saccades. Procedural motion remains additive
  and fades out during incompatible full-body clips.
- Clean retargeted clips in Blender or Unity rather than correcting severe
  clipping with runtime bone exceptions.

Exit condition: all core semantic intents have at least one reviewed,
license-safe performance and no two adjacent responses repeat the same
one-shot unless explicitly requested.

### Phase 3: Character Pack v2

Add optional manifest assets:

```json
{
  "schemaVersion": 2,
  "assets": {
    "vrm": "assets/model.vrm",
    "renderProfile": "assets/render-profile.json",
    "expressions": "assets/expression-map.json",
    "motionSet": "assets/motion-set.json",
    "cameraProfile": "assets/camera-profile.json",
    "springProfile": "assets/spring-profile.json",
    "licenses": "assets/licenses.json"
  }
}
```

`motion-set.json` should reference local motion files and map semantic intents
to reviewed tiers. Runtime code must not infer licensing or approval from file
names.

Exit condition: installing one character pack can reproduce its intended
model, materials, expressions, motion language, camera, and secondary motion
without editing core AILIS source.

### Phase 4: HD AILIS Model

Create an optional HD AILIS character pack rather than making the core package
large for every user.

Recommended authoring targets:

- Preserve VRM 1.0 humanoid and expression compatibility.
- Improve face topology, eye geometry, hair silhouette, hands, and clothing
  layers where they affect normal desktop viewing.
- Author material-specific textures and masks instead of globally increasing
  every texture to 4K.
- Add custom expressions such as blush, tears, confident, curious, sleepy, and
  soft smile while keeping standard VRM visemes.
- Tune hair and clothing spring bones against the reviewed motion set.
- Keep a balanced LOD or a separate standard pack for low-end GPUs.

Exit condition: the HD pack visibly improves fixed close-up captures and motion
silhouette while maintaining the same semantic/runtime contract.

## What Not To Do

- Do not enable all 52 VRMA files without style, clipping, and license review.
- Do not increase polygon count without improving face, hair, hand, and clothing
  authoring.
- Do not apply global bloom, sharpening, or temporal antialiasing as a substitute
  for model and texture quality.
- Do not put character-specific bone hacks into the global runtime.
- Do not let asset filenames decide semantic meaning or distribution rights.

## Recommended Work Order

1. Restore the developer acceptance entry and fixed screenshot board.
2. Finish render-clarity comparisons and select a portrait camera.
3. Review or produce the core semantic motion set.
4. Add Character Pack v2 so model and performance direction travel together.
5. Author the optional HD AILIS pack against that stable contract.

This order avoids building an expensive new model against a runtime contract
that cannot yet preserve its intended appearance and behavior.
