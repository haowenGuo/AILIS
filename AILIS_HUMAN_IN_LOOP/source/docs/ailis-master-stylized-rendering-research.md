# AILIS Master Stylized Rendering Research

This document extends `ailis-cartoon-rendering-options.md` with higher-end references from game and technical-art production. The goal is not to copy one shader blindly, but to identify what makes AILIS still feel visually weak and what can realistically be ported into the current Three.js + VRM/MToon desktop assistant.

## Reliability Notes

Not every referenced game has public official shader source. Treat sources in tiers:

- Official/high confidence: engine interviews, GDC talks, Unity/VRM docs.
- Medium confidence: technical artist breakdowns and shader recreations.
- Lower confidence: forum/reddit deductions, useful only as hints.

For Genshin Impact, many technical details available publicly are reverse-engineered or artist recreations rather than official source. Use them as design guidance, not as proof of the exact production shader.

## Mature Reference Families

### 1. Genshin / HoYoverse-Like Soft Anime

Visual target:

- Soft readable anime character.
- Very controlled face appearance.
- Colored ramp shadows rather than physically accurate darkness.
- Hand-painted texture support carries much of the look.
- Moderate rim, controlled specular, no harsh black outline.

Useful technical ideas:

- Character rendering is effectively art-directed separately from the environment.
- Base color and shadow color are not just light results; they are partly authored.
- Ramp texture or ramp-like controls define lit/shade transitions.
- Face shadows need special handling, usually through face masks/SDF/UV-dependent logic.
- Hair needs dedicated highlight logic: matcap, angel-ring, anisotropic or painted highlight.
- Self-shadowing is often restricted or stylized to avoid ugly face/hair artifacts.
- Fake SSS at the shadow edge is a strong softness cue.

Portable to AILIS:

- MToon profile with warmer skin shade and cool violet cloth/hair shade.
- Per-material-group tuning: skin, face line, eye, hair, cloth.
- Optional artificial SSS/rim at shadow boundary.
- Add a future `face-shadow-mask` texture system.
- Add `hair-matcap` or use MToon `matcapTexture` if we can author a small matcap.

What AILIS lacks today:

- No face-specific SDF shadow.
- No outline-width map to suppress dirty lines near eyes/face.
- No hair-specific matcap/angel-ring control.
- No artist-authored shadow ramp.

### 2. Wuthering Waves / Kuro-Like Cinematic Anime Open World

Visual target:

- Anime character plus richer post-apocalyptic/scifi environment.
- More cinematic lighting than Genshin.
- Stronger dynamic light/shadow integration.
- Less purely cute; more high-contrast, cooler, dramatic.

Official/industry signals:

- Kuro described the use of custom lighting components and precise control over light/shadow dynamics for character PV rendering.
- They chose a stylized day/night lighting system rather than UE4 physical atmosphere to better match art direction.
- They moved away from purely volumetric-cloud style, using a streamlined 2D-to-3D skybox approach for controlled sky color/depth.
- Their interview emphasizes gradients in character base colors and mask textures, not only normal lighting.
- They describe an independent character lighting pipeline with presets/automated tools for environment adjustment.
- For expression production, they moved from a purely skeletal approach toward categorized blendshape libraries.
- They also mention specialized facial shadow textures for performance-specific lighting.

Portable to AILIS:

- Character-only light rig with profile states:
  - idle soft studio
  - thinking cool side light
  - task/working sharper key light
  - success warmer highlight
- More dramatic rim/fill changes based on Persona Surface State.
- Background-independent lighting so desktop environment never makes AILIS look flat.

What AILIS lacks today:

- Scene mood changes light intensity, but not enough as a full cinematic light rig.
- No separate key/fill/rim light controller.
- No color-grading profile per state.

### 3. Arknights: Endfield / Hypergryph PBR+NPR Hybrid

Visual target:

- More realistic二次元: industrial/scifi, PBR material feel plus NPR character readability.
- Clothing and equipment have material richness.
- Characters can be higher-poly and closer to realistic silhouette detail.
- Dynamic shadows and large-scene rendering matter.

Industry signals:

- Reports and interviews say Endfield heavily modified Unity, including the graphics rendering system.
- Character models are reportedly around 80k-100k polygons on PC/console and 40k-50k on mobile.
- Hypergryph developed custom shading technology across platforms and dynamic shadows across near/mid/far backgrounds.
- Chinese interview coverage describes Endfield as pursuing a PBR+NPR hybrid where it is more realistic than many similar二游.
- Developer interview translations repeatedly frame the visual target as preserving 2D illustration personality while balancing PBR and NPR.
- The practical value is not "more realistic shader" alone; it is material differentiation under an anime-readable surface.

Portable to AILIS:

- Do not make everything flat anime. Keep some material identity:
  - hair: anisotropic/matcap highlight
  - clothing: mild PBR-like specular
  - skin: softer NPR
  - eyes: clean high-value highlight
- Add material group policies instead of one global toon shader.
- Use more geometry/model quality only after runtime rendering is solid.

What AILIS lacks today:

- Current VRM asset has limited material richness.
- No layered material policy.
- No custom shadow system.
- No high-poly replacement model yet.

### 4. Arc System Works / Guilty Gear Hard 2D

Visual target:

- 3D models deliberately made to read like 2D animation.
- Hard camera-specific posing and lighting.
- Strong shader and modeling art direction.

Key lessons:

- Shader alone is not enough.
- Character shaders may ignore environment lighting to avoid exposing polygonal 3D form.
- Art-directed normals, camera cuts, hand-tuned poses, reduced animation frames, and swappable/deformed parts matter.

Portable to AILIS:

- Use only as an optional dramatic mode.
- Do not make it the default AILIS look.
- Useful for special action, dance, angry/surprised expressions, or screenshots.

### 5. Hi-Fi RUSH / Whole-World Toon Renderer

Visual target:

- The entire world and characters are stylized together.
- Deferred toon renderer, comic shader, toon lights, custom passes, face shadows.

Portable to AILIS:

- Not a first-phase desktop pet goal.
- Good long-term reference for:
  - face shadow pass
  - comic line pass
  - state-specific postprocess
  - stylized shadow maps

### 6. Granblue / Illustration-Preservation Rendering

Visual target:

- Preserve the feel of an illustration when it moves in 3D.
- Rim and nose/face lighting can be art-directed by camera/facing direction rather than physical light.

Portable to AILIS:

- AILIS should not only shade by light. It should shade by "screen impression".
- For a virtual assistant, face readability should win over physically correct light.
- Use camera-facing rules for face and rim.

## Master Lessons For AILIS

These references converge on one important point: the expensive look is rarely a single magic shader. It is a stack of authored control, runtime lighting, material grouping, and camera-aware exceptions.

### Lesson 1: Face First

For a desktop assistant, the face is the product. Face readability should override physically plausible light.

Copy:

- Face-safe shade policy.
- Soft skin shadow color.
- Suppress dirty outline/shadow around eyes and mouth.
- Future face SDF or face-shadow-mask.

Do not copy yet:

- Full environment-driven dynamic facial lighting. It can make AILIS unstable on a transparent desktop window.

### Lesson 2: Material Groups, Not One Global Toon

Genshin-like softness, Endfield-like material richness, and Granblue-like illustration preservation all require separate rules for skin, hair, eyes, cloth, metal, accessories, and outline.

Copy:

- `skin`: soft shade, high fill, very gentle rim.
- `faceLine`: keep clean, avoid shadow contamination.
- `eyes`: high value, clean highlights, little to no shadow.
- `hair`: matcap/angel-ring style highlight.
- `cloth`: stronger shade contrast than skin.
- `metal/accessory`: controlled PBR-like highlight.

### Lesson 3: Character Light Rig Beats Scene Light

Wuthering Waves is the clearest reference here: an independent character lighting pipeline and stylized TOD are more relevant to AILIS than physically correct environment light.

Copy:

- Key/fill/rim lights controlled by character state.
- Different profiles for idle, thinking, speaking, working, success, apology.
- Lightweight LUT/color profile if the Electron/Three.js pipeline can afford it.

### Lesson 4: High-End 2D Illusion Needs Assets

ArcSys-level 2D illusion needs hand-authored normals, camera-specific poses, hard animation choices, and mesh/texture tricks. Shader-only copying will not reach that level.

Copy:

- Art direction principle: artist intent beats physical correctness.
- Use it for special dramatic modes only.

Do not copy as default:

- Reduced animation interpolation.
- Camera-locked fighter-game posing.
- Hard black cel bands everywhere.

### Lesson 5: AILIS Needs A Renderer Acceptance Board

The current visual weakness is hard to improve by eyeballing one state. Build a fixed screenshot test board:

- idle front
- speaking happy
- speaking shy
- thinking side gaze
- task working
- apology/sad
- dance/action
- night/dark desktop background
- bright desktop background

Every render profile should be judged on the same board. This prevents "one angle looks good, daily use looks weak".

## Recommended AILIS Direction

The strongest practical direction is not pure Genshin, pure Wuthering, or pure Endfield. AILIS should use:

```text
Genshin-like soft face/skin
+ Wuthering-like cinematic character light rig
+ Endfield-like material group richness
+ Granblue-like illustration-preserving face/rim rules
```

This becomes:

```text
AILIS Soft Character Renderer v1
  MToon material profiles
  material group classification
  key/fill/rim light rig
  face-safe outline policy
  hair highlight/matcap placeholder
  screenshot comparison workflow
```

Then:

```text
AILIS Character Renderer v2
  face SDF/shadow-mask
  outline width map
  hair matcap/angel-ring
  optional HaoRender Phong-toon shader port
```

## Concrete Profiles to Build

Naming rule: the runtime profile names below are technical presets, not claims that AILIS implements the proprietary Genshin, Wuthering Waves, Endfield, Granblue, or ArcSys render pipelines. Those titles are research references only. The current implementation is a Three.js + VRM/MToon material tuning and character light-rig layer.

### Profile 1: `ailis_soft_anime_mtoon`

Purpose: default soft anime assistant based on VRM/MToon tuning.

- Soft skin shade.
- Cool violet-blue shade tint.
- Cream highlight.
- Gentle rim.
- Thin outline.
- Eye/face lines preserved.

### Profile 2: `ailis_bright_companion_mtoon`

Purpose: desktop readability and cute companion presence.

- Higher fill.
- Lower contrast.
- Slight material lift.
- Very restrained outline.
- No heavy postprocess.

### Profile 3: `ailis_cinematic_rim_toon`

Purpose: more dramatic/cinematic task state and screenshots.

- Cooler key/fill contrast.
- Stronger rim.
- Slightly harder shadow threshold.
- Stronger eye highlight.
- More pronounced light direction.

### Profile 4: `ailis_material_hybrid_npr`

Purpose: more expensive/high-quality material feeling.

- Skin remains soft.
- Cloth and accessories get more specular identity.
- Hair uses a separate highlight rule.
- Outline stays subtle.
- Better for future high-quality VRM.

### Profile 5: `ailis_hard_cel_mtoon`

Purpose: harder cel-anime approximation inside the current MToon path.

- Harder shadow threshold.
- Cooler, darker shade color.
- Stronger outline.
- Stronger rim.
- Useful for comparison, screenshots, and future custom ramp/cel shader validation.

Important limitation: this is not a full ramp-texture cel shader yet. True cel rendering still needs a custom shader path with ramp textures, face masks, outline-width maps, and camera-aware face lighting.

## Highest-Impact Missing Assets

If we want the render to jump a tier, shader code alone is not enough. The missing assets are:

1. Face shadow/SDF mask.
2. Outline width map, especially around face, eyes, hair tips, clothing edges.
3. Hair matcap or angel-ring texture.
4. Material ID classification map or reliable material-name classification.
5. Shadow ramp texture for soft anime profile.
6. A better VRM model with cleaner face topology and richer material separation.

## AILIS Implementation Order

1. Implement `CharacterRenderRuntime` around MToon, not a full shader replacement.
2. Add render profiles 1 and 2 first.
3. Add a screenshot comparison harness: idle, speaking, thinking, happy, sad, dance.
4. Add profile 3 after light rig is stable.
5. Add profile 4 after material classification is stable.
6. Only then consider HaoRender Phong-toon shader port.

## References

- Unity Toon Shader docs: https://docs.unity3d.com/ja/Packages/com.unity.toonshader%400.9/manual/GettingStarted.html
- VRM/MToon docs: https://vrm.dev/en/univrm/shaders/shader_mtoon/
- GDC Vault, Hi-Fi RUSH toon renderer: https://gdcvault.com/play/1034330/3D-Toon-Rendering-in-Hi
- Unreal Engine interview, Wuthering Waves: https://www.unrealengine.com/developer-interviews/exploring-the-post-apocalyptic-charm-of-asg-open-worlds-in-wuthering-waves
- AUTOMATON/GamerBraves coverage, Endfield Unity modifications: https://automaton-media.com/en/news/arknights-endfield-devs-heavily-modified-unity-to-accommodate-the-games-100000-polygon-characters-models-and-massive-factory-systems/
- Games Press/GCORES Endfield interview translation: https://www.gamespress.com/Arknights-Endfield-Reimagined-An-In-depth-Interview-with-Light-Zhong-a
- 虎嗅/游戏葡萄 Endfield interview: https://www.huxiu.com/article/4828700.html
- Granblue Fantasy Relink graphics interview: https://www.gematsu.com/2020/12/granblue-fantasy-relink-staff-discuss-graphics-in-two-part-interview
- Genshin shader recreation by Ben Ayers: https://bjayers.com/blog/9oOD/blender-npr-recreating-the-genshin-impact-shader
- 80.lv Genshin EEVEE shader coverage: https://80.lv/articles/genshin-impact-character-shader-for-eevee
- Arc System Works/GDC, Guilty Gear Xrd art style: https://www.arcsystemworks.com/guilty-gear-xrds-art-style-the-x-factor-between-2d-and-3d-talk-from-gdc-2015-is-now-available-online/
