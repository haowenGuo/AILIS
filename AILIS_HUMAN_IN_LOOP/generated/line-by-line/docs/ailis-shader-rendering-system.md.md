# docs/ailis-shader-rendering-system.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：158
- SHA-256：`740a0eb24a7cbf7ba6411a9c1df29403a63cfde7742956e474b1b653ec8dc402`
- 可运行副本：[打开源文件](../../../source/docs/ailis-shader-rendering-system.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Shader Rendering System Research</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>## Current State</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>AILIS is rendered by `src/vrm-model-system.js` with a transparent `THREE.WebGLRenderer`, one ambient light, one directional light, and the VRM model's loaded materials. There is no dedicated render runtime for material tuning, outline tuning, rim light, matcap, color grading, or post-processing.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>The current VRM file is not a dead end. `Resources/AILIS.vrm` is a VRM 1.0/glTF 2.0 asset with:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>- 16 materials</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>- 26 textures/images</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>- `VRMC_materials_mtoon` on every material</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>- `KHR_materials_unlit` on every material</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>- existing outline data on skin/body/clothes/hair, but many face/eye/hair-back parts have outline disabled</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>This means the next improvement should not start from a custom raw GLSL shader. The safer path is to build a render runtime around MToon first, because the model already carries MToon authoring data.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>## Practical Ceiling</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>VRM is not the ceiling by itself. The ceiling comes from four layers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>1. Model asset quality: mesh topology, texture resolution, facial blendshapes, hair cards, clothing geometry.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>2. Motion quality: animation data, retargeting, root motion, clipping.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>3. Runtime behavior: gaze, expression mixing, idle motion, camera, timing.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>4. Rendering style: MToon settings, outline, rim light, color management, post-processing.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>The project has already spent most effort on layer 2 and 3. The most promising remaining visual gains are now in layer 4.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>## Rendering Architecture</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>Add a dedicated rendering layer instead of continuing to grow `vrm-model-system.js`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 33 | <code>src/character-render/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>  render-profile.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>  mtoon-material-controller.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>  lighting-controller.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>  postprocess-pipeline.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>  render-debug-panel.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>The runtime should sit beside Character Runtime:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 44 | <code>Persona Surface State</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 46 | <code>Character Runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>        &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 48 | <code>VRM Driver -------------- Character Render Runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>        &#124;                         &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 50 | <code>Animation / Expression        MToon / Light / Post FX</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>        &#124;                         &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 52 | <code>                 VRMModelSystem</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>## MToon First</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>The first implementation should collect all MToon materials after `loadModel()` and classify them by material name:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>- `SKIN`: face/body skin</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>- `EYE`: iris, white, highlight</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>- `FACE`: brow, eyelash, eyeline, mouth</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>- `HAIR`: hair and hair back</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>- `CLOTH`: tops, bottoms, shoes</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>Then apply profile deltas instead of overwriting source values blindly.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>Recommended first profile: `ailis_soft_anime_v1`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>Targets:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>- Skin: softer shade color, slightly smoother toon boundary.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>- Eyes: preserve alpha/blend ordering, avoid bloom overkill.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- Hair: add gentle rim, avoid heavy outline on hair cards.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>- Clothes: keep outline visible but not dirty.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>- Face lines: avoid global outline duplication around brows/lashes.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>Important MToon properties exposed by the local `@pixiv/three-vrm-materials-mtoon` package:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>- `shadeColorFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 80 | <code>- `shadingShiftFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 81 | <code>- `shadingToonyFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 82 | <code>- `giEqualizationFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 83 | <code>- `matcapFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 84 | <code>- `matcapTexture`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 85 | <code>- `parametricRimColorFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 86 | <code>- `rimLightingMixFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 87 | <code>- `parametricRimFresnelPowerFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 88 | <code>- `parametricRimLiftFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 89 | <code>- `outlineWidthMode`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 90 | <code>- `outlineWidthFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 91 | <code>- `outlineColorFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>- `outlineLightingMixFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>- `debugMode`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>## Post-Processing</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>Post-processing should be optional and conservative for the desktop pet window. The first useful chain is:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 100 | <code>RenderPass -&gt; small custom color pass -&gt; optional UnrealBloomPass -&gt; OutputPass</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>Use `OutlinePass` only for debug or selected-object experiments. MToon already has model-aware outline data; a screen-space outline can look noisy around transparent hair, eyelashes, and face lines.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>Good first post effects:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>- Tiny brightness/contrast/saturation pass.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>- Very soft bloom only on eye highlight or emissive-like regions if material masking is available.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 109 | <code>- Optional vignette is not recommended for the transparent pet window.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>## Implementation Plan</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>### v1: Render Runtime Baseline</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>- Create `src/character-render/mtoon-material-controller.js`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 116 | <code>- Collect and snapshot original material parameters.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 117 | <code>- Apply a named render profile.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 118 | <code>- Expose `applyRenderProfile(profileId)` and `resetRenderProfile()`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 119 | <code>- Add tests that verify materials are classified and changed without losing original texture references.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>### v2: Live Tuning Panel</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>- Add a compact control-panel section for render profile, outline strength, rim strength, shade softness, and light warmth.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 124 | <code>- Save preferences through the existing desktop state store.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 125 | <code>- Add a reset button to return to source VRM values.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>### v3: Lighting Upgrade</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>- Replace the single plain directional light with a small rig:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 130 | <code>  - soft key</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>  - weak fill</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 132 | <code>  - subtle hair/rim light</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 133 | <code>- Let scene mood control light profile, not raw intensities everywhere.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>### v4: Optional Post FX</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>- Add an optional postprocess pipeline behind a preference toggle.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 138 | <code>- Default off until visually accepted.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 139 | <code>- Use screenshots to compare `off`, `mtoon`, and `mtoon+postfx`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>## Acceptance</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>The render system is acceptable only if:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>- The original VRM can be restored at runtime.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 146 | <code>- No texture references are lost.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 147 | <code>- Transparent hair, eyelashes, and eye highlights do not flicker.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 148 | <code>- The desktop pet remains transparent.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 149 | <code>- The render profile does not make task/dance animations look clipped or dirty.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 150 | <code>- `pnpm build` passes.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 151 | <code>- A screenshot comparison exists for idle, speaking, thinking, happy, sad, and dance.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>## References</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>- @pixiv/three-vrm MToon module: https://pixiv.github.io/three-vrm/docs/modules/three-vrm-materials-mtoon</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 156 | <code>- @pixiv/three-vrm MToonMaterial API: https://pixiv.github.io/three-vrm/docs/classes/three-vrm-materials-mtoon.MToonMaterial.html</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 157 | <code>- VRMC_materials_mtoon 1.0 specification: https://github.com/vrm-c/vrm-specification/tree/master/specification/VRMC_materials_mtoon-1.0</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 158 | <code>- Three.js post-processing modules: https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
