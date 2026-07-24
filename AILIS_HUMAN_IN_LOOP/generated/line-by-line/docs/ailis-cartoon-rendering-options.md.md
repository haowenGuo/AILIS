# docs/ailis-cartoon-rendering-options.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：369
- SHA-256：`6e6ddf33aa39fecccb37256f57e9f5755fd9276cee1c82b14112eb9d819de0a9`
- 可运行副本：[打开源文件](../../../source/docs/ailis-cartoon-rendering-options.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Cartoon Rendering Options</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>This note collects cartoon/anime rendering options for AILIS. It uses the current AILIS VRM/MToon stack, local HaoRender-GI LookDev presets, and mature public toon-rendering references.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Local Baseline</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>AILIS currently uses:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>- Three.js `WebGLRenderer`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>- `@pixiv/three-vrm`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>- VRM 1.0 model with `VRMC_materials_mtoon`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>- One ambient light and one directional light</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>- No dedicated cartoon render runtime yet</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>HaoRender-GI already has a mature LookDev control surface under:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>- `F:\haorender-gi\HaoRender-GI\StylePresets`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>- `F:\haorender-gi\HaoRender-GI\docs\lookdev_rendering_skill_library.md`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>- `F:\haorender-gi\HaoRender-GI\src\rendering\opengl_rasterizer.cpp`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>The relevant HaoRender-GI parameters are:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>- Phong/toon: `diffuseSteps`, `diffuseSoftness`, `shadowFloor`, `litFloor`, `rampBias`, `rampContrast`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>- Shadow art direction: `shadowMapStrength`, `shadowThreshold`, `shadowSoftness`, `shadowTint`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 25 | <code>- Highlight: `highlightThreshold`, `highlightSoftness`, `highlightStrength`, `highlightTint`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>- Rim: `rimStrength`, `rimPower`, `rimTint`, `rimThreshold`, `rimSoftness`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- Material remap: `materialTextureStrength`, `materialLift`, `materialSaturation`, `materialContrast`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>- Outline: `widthPixels`, `opacity`, `depthBias`, `color`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>## Option A: MToon Native Soft Anime</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>Best first choice.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>Source idea:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>- Use AILIS's existing VRM MToon material instead of replacing the shader.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- Borrow HaoRender-GI `genshin_like_soft_game_anime_v3_balanced` as the taste target.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- Map HaoRender's colored shadows, gentle rim, modest outline, and restrained material lift into MToon parameters.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>Implementation:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>- Add `src/character-render/mtoon-material-controller.js`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>- Traverse `vrm.scene` after load and collect `material.isMToonMaterial`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>- Classify materials by name: `SKIN`, `FACE`, `EYE`, `HAIR`, `CLOTH`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 45 | <code>- Snapshot original values for reset.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 46 | <code>- Apply deltas to:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 47 | <code>  - `shadeColorFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 48 | <code>  - `shadingShiftFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>  - `shadingToonyFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 50 | <code>  - `giEqualizationFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 51 | <code>  - `parametricRimColorFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 52 | <code>  - `rimLightingMixFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 53 | <code>  - `parametricRimFresnelPowerFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 54 | <code>  - `parametricRimLiftFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 55 | <code>  - `outlineWidthFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>  - `outlineColorFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>  - `outlineLightingMixFactor`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>Candidate profile:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 62 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>  id: 'ailis_mtoon_soft_balanced',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>  label: 'Soft Anime Balanced',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>  source: 'HaoRender-GI genshin_like_soft_game_anime_v3_balanced',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>  renderer: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>    toneMappingExposure: 1.08,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>    ambientIntensity: 2.25,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>    keyIntensity: 1.05,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>    keyColor: '#fff7ee',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>    rimLightIntensity: 0.22,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>    rimLightColor: '#d7eaff'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 73 | <code>  },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 74 | <code>  materialGroups: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 75 | <code>    skin: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>      shadeColorMix: '#e6cad6',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>      shadeColorMixWeight: 0.28,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>      shadingToonyFactor: 0.88,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>      rimColor: '#dcecff',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>      rimStrength: 0.08,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>      outlineScale: 0.90</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>    },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>    hair: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>      shadeColorMix: '#cfe2ec',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>      shadeColorMixWeight: 0.16,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>      shadingToonyFactor: 0.82,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>      rimColor: '#d9ecff',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>      rimStrength: 0.12,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>      outlineScale: 1.05</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>    },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>    cloth: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 92 | <code>      shadeColorMix: '#adb8eb',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 93 | <code>      shadeColorMixWeight: 0.22,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>      shadingToonyFactor: 0.92,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>      rimColor: '#d9e8ff',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>      rimStrength: 0.10,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 97 | <code>      outlineScale: 1.05</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 98 | <code>    },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>    faceLine: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>      outlineScale: 0.0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>      preserveAlpha: true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>    },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 103 | <code>    eye: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>      shadeColorMixWeight: 0.0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>      rimStrength: 0.0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 106 | <code>      emissiveLift: 0.04,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>      preserveAlpha: true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>Pros:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>- Lowest risk.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 116 | <code>- Keeps VRM/MToon compatibility.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 117 | <code>- Does not break transparent hair/eye material ordering.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 118 | <code>- Easy to toggle and reset.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>Cons:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>- Cannot reproduce all HaoRender Phong-toon controls exactly.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 123 | <code>- No custom ramp texture or true material albedo remap in v1.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>## Option B: HaoRender Phong-Toon Port</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>Most faithful to HaoRender-GI.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>Source idea:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>- Port the shader math from `opengl_rasterizer.cpp`:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 132 | <code>  - `toonBandValue`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 133 | <code>  - `toonThreshold`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 134 | <code>  - `applyToonMaterialOverride`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 135 | <code>  - `applyToonRamp`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 136 | <code>  - `accumulatePhongLight`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 137 | <code>  - `buildRimLight`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 138 | <code>- Use HaoRender-GI presets directly as AILIS render profiles.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>Implementation:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>- Add a custom Three.js `ShaderMaterial` or an `onBeforeCompile` pipeline.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 143 | <code>- Preserve original base color, normal, alpha, emissive textures.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 144 | <code>- Add uniforms matching HaoRender's Phong/toon parameter set.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 145 | <code>- Add a second outline pass or use MToon outline as fallback.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>Candidate profile:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 150 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>  id: 'ailis_haorender_phong_toon_balanced',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>  source: 'HaoRender-GI genshin_like_soft_game_anime_v3_balanced',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>  exposure: 1.15,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 154 | <code>  normalStrength: 0.72,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 155 | <code>  phong: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>    diffuseStrength: 1.08,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 157 | <code>    ambientStrength: 0.10,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 158 | <code>    secondaryLightScale: 0.38,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 159 | <code>    specularStrength: 0.28,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>    smoothness: 0.70,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>    shininess: 46.0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 162 | <code>    rimStrength: 0.28,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>    rimPower: 2.10,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 164 | <code>    rimTint: '#d6ebff',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 165 | <code>    toon: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 166 | <code>      diffuseSteps: 3.0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 167 | <code>      diffuseSoftness: 0.12,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 168 | <code>      shadowFloor: 0.08,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 169 | <code>      litFloor: 0.48,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 170 | <code>      rampBias: 0.02,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>      rampContrast: 0.92,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 172 | <code>      shadowMapStrength: 0.40,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 173 | <code>      shadowThreshold: 0.40,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>      shadowSoftness: 0.15,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 175 | <code>      shadowTint: '#adbaf2',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 176 | <code>      highlightThreshold: 0.40,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>      highlightSoftness: 0.095,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 178 | <code>      highlightStrength: 0.50,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 179 | <code>      highlightTint: '#fff5e6',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>      rimThreshold: 0.33,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 181 | <code>      rimSoftness: 0.12,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 182 | <code>      materialOverrideEnabled: true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 183 | <code>      materialTextureStrength: 0.94,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 184 | <code>      materialLift: 0.025,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 185 | <code>      materialSaturation: 1.05,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 186 | <code>      materialContrast: 0.95</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 187 | <code>    },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 188 | <code>    outline: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>      enabled: true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 190 | <code>      widthPixels: 1.10,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>      opacity: 0.48,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 192 | <code>      color: '#0f111a'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 194 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 195 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 196 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>Pros:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>- Reuses the strongest HaoRender-GI system directly.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 201 | <code>- Gives us real toon ramps, material remap, highlight control, and rim shaping.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 202 | <code>- Best if the goal is a controllable LookDev panel like HaoRender.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>Cons:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>- Higher engineering risk.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 207 | <code>- May break some VRM-specific MToon behavior.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 208 | <code>- Transparent hair, lashes, eyes, and face overlays need careful sorting.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 209 | <code>- More work to keep expressions, alpha modes, and outlines stable.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 211 | <code>## Option C: Bright Game-Anime Viewer</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 213 | <code>Best if AILIS currently feels dull, dark, or low-energy.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 215 | <code>Source idea:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>- Borrow HaoRender-GI `genshin_like_soft_game_anime_v2_bright_viewer`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 218 | <code>- Brighter exposure, lower normal intensity, higher fill, softer blue-violet shadows, subtle outline.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>Implementation path:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>- Can be implemented as either Option A's MToon profile or Option B's Phong-toon shader.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 223 | <code>- For AILIS, start with MToon version first.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 225 | <code>Candidate taste:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 227 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 228 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 229 | <code>  id: 'ailis_mtoon_bright_viewer',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 230 | <code>  exposure: 1.14,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>  ambientIntensity: 2.38,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 232 | <code>  keyIntensity: 1.00,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 233 | <code>  fillIntensity: 0.35,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>  materialLift: 0.06,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 235 | <code>  materialContrast: 0.86,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 236 | <code>  shadowTint: '#bac4fa',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 237 | <code>  outlineOpacity: 0.38,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 238 | <code>  rimStrength: 0.08</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 239 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 240 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>Pros:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>- More lively on a desktop pet.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 245 | <code>- Good for small transparent window readability.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 246 | <code>- Safer than hard cel.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 248 | <code>Cons:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 250 | <code>- Easy to wash out black/dark clothing.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 251 | <code>- Needs per-material guardrails so eyes and face lines do not become pale.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 253 | <code>## Option D: ArcSys Hard 2D Cel</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>Use only as an optional dramatic style.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>Source idea:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 258 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 259 | <code>- Arc System Works' Guilty Gear Xrd pursued a 2D fighting-game look in a 3D framework.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 260 | <code>- HaoRender-GI's skill library maps this to sharp bands, hard specular, primary light only, thick outline, low fill.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>Candidate taste:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 265 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 266 | <code>  id: 'ailis_hard_2d_cel',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 267 | <code>  diffuseSteps: 2.0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 268 | <code>  diffuseSoftness: 0.025,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 269 | <code>  shadowThreshold: 0.52,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 270 | <code>  shadowSoftness: 0.025,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 271 | <code>  highlightSoftness: 0.02,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 272 | <code>  outlineWidthPixels: 2.4,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 273 | <code>  outlineOpacity: 0.82,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 274 | <code>  ambientStrength: 0.04,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 275 | <code>  primaryLightOnly: true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 276 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 277 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>Pros:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>- Strong visual difference.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 282 | <code>- Good for special emote/showcase mode.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 283 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 284 | <code>Cons:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 286 | <code>- Not a good default for AILIS.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 287 | <code>- Requires art-directed normals/camera/animation to really work.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 288 | <code>- Can make VRM face and hair look harsh.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 289 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 290 | <code>## Option E: TF2 / Gooch Readability</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>Use if the goal is clear silhouette and readable shape rather than anime.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>Source idea:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 296 | <code>- TF2 emphasizes silhouette, rim highlights, luminance/hue variation, and readability.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 297 | <code>- Gooch shading uses cool-to-warm hue shifts and reserves extremes for edges/highlights.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>Candidate taste:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 302 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 303 | <code>  id: 'ailis_readability_rim',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 304 | <code>  outlineEnabled: false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 305 | <code>  rimStrength: 0.22,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 306 | <code>  rimPower: 1.8,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 307 | <code>  warmLight: '#fff0dc',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 308 | <code>  coolShadow: '#b9c6f2',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 309 | <code>  diffuseSoftness: 0.18,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 310 | <code>  saturation: 1.05</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 311 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 312 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 313 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 314 | <code>Pros:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 316 | <code>- Good desktop readability.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 317 | <code>- Less risk around transparent face/hair outlines.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 319 | <code>Cons:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>- Less "二次元声优/动漫女孩子" than MToon soft anime.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 322 | <code>- More Western illustrative than Japanese anime.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 323 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 324 | <code>## Recommended Choice</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>Start with Option A and include Option C as a toggle.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>Then, after visual approval, port Option B if we still need HaoRender-level control.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>Reason:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 331 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 332 | <code>- AILIS already uses VRM/MToon.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 333 | <code>- The model already stores MToon data.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 334 | <code>- MToon runtime tuning is reversible.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 335 | <code>- HaoRender's full Phong-toon shader is powerful, but replacing VRM materials too early risks alpha sorting, eye highlight, face overlay, and outline regressions.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>## Acceptance Test</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>Before committing a render profile as default, capture these states:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 341 | <code>- idle</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 342 | <code>- speaking</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 343 | <code>- thinking</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 344 | <code>- happy</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 345 | <code>- sad</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 346 | <code>- dance</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 347 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 348 | <code>For each state compare:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 349 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 350 | <code>- source VRM</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 351 | <code>- `ailis_mtoon_soft_balanced`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 352 | <code>- `ailis_mtoon_bright_viewer`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 353 | <code>- optional `ailis_haorender_phong_toon_balanced`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 355 | <code>Reject if:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>- eye highlights bloom or disappear</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 358 | <code>- eyelashes/face lines become dirty</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 359 | <code>- hair alpha flickers</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 360 | <code>- outline crawls during motion</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 361 | <code>- dance looks clipped or noisy</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 362 | <code>- desktop transparent window background is polluted</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 364 | <code>## External References</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 366 | <code>- Unity Toon Shader: https://docs.unity3d.com/ja/Packages/com.unity.toonshader%400.9/manual/GettingStarted.html</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 367 | <code>- VRM MToon: https://vrm.dev/en/univrm/shaders/shader_mtoon/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 368 | <code>- Arc System Works Guilty Gear Xrd GDC talk: https://www.arcsystemworks.com/guilty-gear-xrds-art-style-the-x-factor-between-2d-and-3d-talk-from-gdc-2015-is-now-available-online/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 369 | <code>- Valve Team Fortress 2 illustrative rendering paper: https://steamcdn-a.akamaihd.net/apps/valve/2007/NPAR07_IllustrativeRenderingInTeamFortress2.pdf</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
