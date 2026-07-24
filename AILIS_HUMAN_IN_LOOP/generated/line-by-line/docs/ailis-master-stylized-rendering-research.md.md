# docs/ailis-master-stylized-rendering-research.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：366
- SHA-256：`639e604691f54aaf0e0bc088a269167b16cae3ef295542e3da2abf0e1a6fa217`
- 可运行副本：[打开源文件](../../../source/docs/ailis-master-stylized-rendering-research.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Master Stylized Rendering Research</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>This document extends `ailis-cartoon-rendering-options.md` with higher-end references from game and technical-art production. The goal is not to copy one shader blindly, but to identify what makes AILIS still feel visually weak and what can realistically be ported into the current Three.js + VRM/MToon desktop assistant.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Reliability Notes</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>Not every referenced game has public official shader source. Treat sources in tiers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>- Official/high confidence: engine interviews, GDC talks, Unity/VRM docs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>- Medium confidence: technical artist breakdowns and shader recreations.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>- Lower confidence: forum/reddit deductions, useful only as hints.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>For Genshin Impact, many technical details available publicly are reverse-engineered or artist recreations rather than official source. Use them as design guidance, not as proof of the exact production shader.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>## Mature Reference Families</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>### 1. Genshin / HoYoverse-Like Soft Anime</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>Visual target:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>- Soft readable anime character.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>- Very controlled face appearance.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 23 | <code>- Colored ramp shadows rather than physically accurate darkness.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>- Hand-painted texture support carries much of the look.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 25 | <code>- Moderate rim, controlled specular, no harsh black outline.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>Useful technical ideas:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>- Character rendering is effectively art-directed separately from the environment.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>- Base color and shadow color are not just light results; they are partly authored.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 31 | <code>- Ramp texture or ramp-like controls define lit/shade transitions.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- Face shadows need special handling, usually through face masks/SDF/UV-dependent logic.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- Hair needs dedicated highlight logic: matcap, angel-ring, anisotropic or painted highlight.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>- Self-shadowing is often restricted or stylized to avoid ugly face/hair artifacts.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>- Fake SSS at the shadow edge is a strong softness cue.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>Portable to AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>- MToon profile with warmer skin shade and cool violet cloth/hair shade.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- Per-material-group tuning: skin, face line, eye, hair, cloth.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- Optional artificial SSS/rim at shadow boundary.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>- Add a future `face-shadow-mask` texture system.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>- Add `hair-matcap` or use MToon `matcapTexture` if we can author a small matcap.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>What AILIS lacks today:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>- No face-specific SDF shadow.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 48 | <code>- No outline-width map to suppress dirty lines near eyes/face.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>- No hair-specific matcap/angel-ring control.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 50 | <code>- No artist-authored shadow ramp.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>### 2. Wuthering Waves / Kuro-Like Cinematic Anime Open World</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>Visual target:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>- Anime character plus richer post-apocalyptic/scifi environment.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>- More cinematic lighting than Genshin.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 58 | <code>- Stronger dynamic light/shadow integration.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 59 | <code>- Less purely cute; more high-contrast, cooler, dramatic.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>Official/industry signals:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>- Kuro described the use of custom lighting components and precise control over light/shadow dynamics for character PV rendering.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>- They chose a stylized day/night lighting system rather than UE4 physical atmosphere to better match art direction.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 65 | <code>- They moved away from purely volumetric-cloud style, using a streamlined 2D-to-3D skybox approach for controlled sky color/depth.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 66 | <code>- Their interview emphasizes gradients in character base colors and mask textures, not only normal lighting.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 67 | <code>- They describe an independent character lighting pipeline with presets/automated tools for environment adjustment.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 68 | <code>- For expression production, they moved from a purely skeletal approach toward categorized blendshape libraries.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>- They also mention specialized facial shadow textures for performance-specific lighting.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>Portable to AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>- Character-only light rig with profile states:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>  - idle soft studio</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>  - thinking cool side light</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>  - task/working sharper key light</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>  - success warmer highlight</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 78 | <code>- More dramatic rim/fill changes based on Persona Surface State.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 79 | <code>- Background-independent lighting so desktop environment never makes AILIS look flat.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>What AILIS lacks today:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>- Scene mood changes light intensity, but not enough as a full cinematic light rig.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 84 | <code>- No separate key/fill/rim light controller.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 85 | <code>- No color-grading profile per state.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>### 3. Arknights: Endfield / Hypergryph PBR+NPR Hybrid</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>Visual target:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>- More realistic二次元: industrial/scifi, PBR material feel plus NPR character readability.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>- Clothing and equipment have material richness.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>- Characters can be higher-poly and closer to realistic silhouette detail.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>- Dynamic shadows and large-scene rendering matter.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>Industry signals:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>- Reports and interviews say Endfield heavily modified Unity, including the graphics rendering system.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 99 | <code>- Character models are reportedly around 80k-100k polygons on PC/console and 40k-50k on mobile.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 100 | <code>- Hypergryph developed custom shading technology across platforms and dynamic shadows across near/mid/far backgrounds.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 101 | <code>- Chinese interview coverage describes Endfield as pursuing a PBR+NPR hybrid where it is more realistic than many similar二游.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 102 | <code>- Developer interview translations repeatedly frame the visual target as preserving 2D illustration personality while balancing PBR and NPR.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>- The practical value is not "more realistic shader" alone; it is material differentiation under an anime-readable surface.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>Portable to AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>- Do not make everything flat anime. Keep some material identity:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>  - hair: anisotropic/matcap highlight</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 109 | <code>  - clothing: mild PBR-like specular</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 110 | <code>  - skin: softer NPR</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 111 | <code>  - eyes: clean high-value highlight</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 112 | <code>- Add material group policies instead of one global toon shader.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 113 | <code>- Use more geometry/model quality only after runtime rendering is solid.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>What AILIS lacks today:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>- Current VRM asset has limited material richness.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 118 | <code>- No layered material policy.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 119 | <code>- No custom shadow system.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 120 | <code>- No high-poly replacement model yet.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>### 4. Arc System Works / Guilty Gear Hard 2D</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>Visual target:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>- 3D models deliberately made to read like 2D animation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 127 | <code>- Hard camera-specific posing and lighting.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 128 | <code>- Strong shader and modeling art direction.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>Key lessons:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>- Shader alone is not enough.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 133 | <code>- Character shaders may ignore environment lighting to avoid exposing polygonal 3D form.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 134 | <code>- Art-directed normals, camera cuts, hand-tuned poses, reduced animation frames, and swappable/deformed parts matter.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>Portable to AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>- Use only as an optional dramatic mode.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 139 | <code>- Do not make it the default AILIS look.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 140 | <code>- Useful for special action, dance, angry/surprised expressions, or screenshots.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>### 5. Hi-Fi RUSH / Whole-World Toon Renderer</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>Visual target:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>- The entire world and characters are stylized together.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 147 | <code>- Deferred toon renderer, comic shader, toon lights, custom passes, face shadows.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>Portable to AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>- Not a first-phase desktop pet goal.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 152 | <code>- Good long-term reference for:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 153 | <code>  - face shadow pass</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 154 | <code>  - comic line pass</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 155 | <code>  - state-specific postprocess</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 156 | <code>  - stylized shadow maps</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>### 6. Granblue / Illustration-Preservation Rendering</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>Visual target:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>- Preserve the feel of an illustration when it moves in 3D.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 163 | <code>- Rim and nose/face lighting can be art-directed by camera/facing direction rather than physical light.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 165 | <code>Portable to AILIS:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>- AILIS should not only shade by light. It should shade by "screen impression".</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 168 | <code>- For a virtual assistant, face readability should win over physically correct light.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- Use camera-facing rules for face and rim.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>## Master Lessons For AILIS</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>These references converge on one important point: the expensive look is rarely a single magic shader. It is a stack of authored control, runtime lighting, material grouping, and camera-aware exceptions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>### Lesson 1: Face First</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>For a desktop assistant, the face is the product. Face readability should override physically plausible light.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>Copy:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>- Face-safe shade policy.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 182 | <code>- Soft skin shadow color.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 183 | <code>- Suppress dirty outline/shadow around eyes and mouth.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 184 | <code>- Future face SDF or face-shadow-mask.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 185 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 186 | <code>Do not copy yet:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>- Full environment-driven dynamic facial lighting. It can make AILIS unstable on a transparent desktop window.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>### Lesson 2: Material Groups, Not One Global Toon</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>Genshin-like softness, Endfield-like material richness, and Granblue-like illustration preservation all require separate rules for skin, hair, eyes, cloth, metal, accessories, and outline.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>Copy:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>- `skin`: soft shade, high fill, very gentle rim.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 197 | <code>- `faceLine`: keep clean, avoid shadow contamination.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 198 | <code>- `eyes`: high value, clean highlights, little to no shadow.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 199 | <code>- `hair`: matcap/angel-ring style highlight.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 200 | <code>- `cloth`: stronger shade contrast than skin.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 201 | <code>- `metal/accessory`: controlled PBR-like highlight.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>### Lesson 3: Character Light Rig Beats Scene Light</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>Wuthering Waves is the clearest reference here: an independent character lighting pipeline and stylized TOD are more relevant to AILIS than physically correct environment light.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>Copy:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 209 | <code>- Key/fill/rim lights controlled by character state.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 210 | <code>- Different profiles for idle, thinking, speaking, working, success, apology.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 211 | <code>- Lightweight LUT/color profile if the Electron/Three.js pipeline can afford it.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 213 | <code>### Lesson 4: High-End 2D Illusion Needs Assets</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 215 | <code>ArcSys-level 2D illusion needs hand-authored normals, camera-specific poses, hard animation choices, and mesh/texture tricks. Shader-only copying will not reach that level.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>Copy:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 219 | <code>- Art direction principle: artist intent beats physical correctness.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 220 | <code>- Use it for special dramatic modes only.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>Do not copy as default:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 223 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 224 | <code>- Reduced animation interpolation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 225 | <code>- Camera-locked fighter-game posing.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 226 | <code>- Hard black cel bands everywhere.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>### Lesson 5: AILIS Needs A Renderer Acceptance Board</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 230 | <code>The current visual weakness is hard to improve by eyeballing one state. Build a fixed screenshot test board:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 232 | <code>- idle front</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 233 | <code>- speaking happy</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 234 | <code>- speaking shy</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 235 | <code>- thinking side gaze</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 236 | <code>- task working</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 237 | <code>- apology/sad</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 238 | <code>- dance/action</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 239 | <code>- night/dark desktop background</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 240 | <code>- bright desktop background</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>Every render profile should be judged on the same board. This prevents "one angle looks good, daily use looks weak".</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>## Recommended AILIS Direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>The strongest practical direction is not pure Genshin, pure Wuthering, or pure Endfield. AILIS should use:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 248 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 249 | <code>Genshin-like soft face/skin</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 250 | <code>+ Wuthering-like cinematic character light rig</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 251 | <code>+ Endfield-like material group richness</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 252 | <code>+ Granblue-like illustration-preserving face/rim rules</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 253 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>This becomes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 258 | <code>AILIS Soft Character Renderer v1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 259 | <code>  MToon material profiles</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 260 | <code>  material group classification</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 261 | <code>  key/fill/rim light rig</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 262 | <code>  face-safe outline policy</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 263 | <code>  hair highlight/matcap placeholder</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 264 | <code>  screenshot comparison workflow</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 265 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>Then:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 270 | <code>AILIS Character Renderer v2</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 271 | <code>  face SDF/shadow-mask</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 272 | <code>  outline width map</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 273 | <code>  hair matcap/angel-ring</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 274 | <code>  optional HaoRender Phong-toon shader port</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 275 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>## Concrete Profiles to Build</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>Naming rule: the runtime profile names below are technical presets, not claims that AILIS implements the proprietary Genshin, Wuthering Waves, Endfield, Granblue, or ArcSys render pipelines. Those titles are research references only. The current implementation is a Three.js + VRM/MToon material tuning and character light-rig layer.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>### Profile 1: `ailis_soft_anime_mtoon`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>Purpose: default soft anime assistant based on VRM/MToon tuning.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>- Soft skin shade.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 286 | <code>- Cool violet-blue shade tint.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 287 | <code>- Cream highlight.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 288 | <code>- Gentle rim.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 289 | <code>- Thin outline.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 290 | <code>- Eye/face lines preserved.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>### Profile 2: `ailis_bright_companion_mtoon`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>Purpose: desktop readability and cute companion presence.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 296 | <code>- Higher fill.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 297 | <code>- Lower contrast.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 298 | <code>- Slight material lift.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 299 | <code>- Very restrained outline.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 300 | <code>- No heavy postprocess.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 302 | <code>### Profile 3: `ailis_cinematic_rim_toon`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>Purpose: more dramatic/cinematic task state and screenshots.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 305 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 306 | <code>- Cooler key/fill contrast.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 307 | <code>- Stronger rim.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 308 | <code>- Slightly harder shadow threshold.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 309 | <code>- Stronger eye highlight.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 310 | <code>- More pronounced light direction.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 312 | <code>### Profile 4: `ailis_material_hybrid_npr`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 313 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 314 | <code>Purpose: more expensive/high-quality material feeling.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 316 | <code>- Skin remains soft.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 317 | <code>- Cloth and accessories get more specular identity.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 318 | <code>- Hair uses a separate highlight rule.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 319 | <code>- Outline stays subtle.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 320 | <code>- Better for future high-quality VRM.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>### Profile 5: `ailis_hard_cel_mtoon`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 323 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 324 | <code>Purpose: harder cel-anime approximation inside the current MToon path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>- Harder shadow threshold.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 327 | <code>- Cooler, darker shade color.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 328 | <code>- Stronger outline.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 329 | <code>- Stronger rim.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 330 | <code>- Useful for comparison, screenshots, and future custom ramp/cel shader validation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 331 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 332 | <code>Important limitation: this is not a full ramp-texture cel shader yet. True cel rendering still needs a custom shader path with ramp textures, face masks, outline-width maps, and camera-aware face lighting.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 333 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 334 | <code>## Highest-Impact Missing Assets</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>If we want the render to jump a tier, shader code alone is not enough. The missing assets are:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 337 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 338 | <code>1. Face shadow/SDF mask.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 339 | <code>2. Outline width map, especially around face, eyes, hair tips, clothing edges.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 340 | <code>3. Hair matcap or angel-ring texture.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 341 | <code>4. Material ID classification map or reliable material-name classification.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 342 | <code>5. Shadow ramp texture for soft anime profile.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 343 | <code>6. A better VRM model with cleaner face topology and richer material separation.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 345 | <code>## AILIS Implementation Order</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 346 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 347 | <code>1. Implement `CharacterRenderRuntime` around MToon, not a full shader replacement.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 348 | <code>2. Add render profiles 1 and 2 first.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 349 | <code>3. Add a screenshot comparison harness: idle, speaking, thinking, happy, sad, dance.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 350 | <code>4. Add profile 3 after light rig is stable.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 351 | <code>5. Add profile 4 after material classification is stable.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 352 | <code>6. Only then consider HaoRender Phong-toon shader port.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 353 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 354 | <code>## References</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>- Unity Toon Shader docs: https://docs.unity3d.com/ja/Packages/com.unity.toonshader%400.9/manual/GettingStarted.html</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 357 | <code>- VRM/MToon docs: https://vrm.dev/en/univrm/shaders/shader_mtoon/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 358 | <code>- GDC Vault, Hi-Fi RUSH toon renderer: https://gdcvault.com/play/1034330/3D-Toon-Rendering-in-Hi</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 359 | <code>- Unreal Engine interview, Wuthering Waves: https://www.unrealengine.com/developer-interviews/exploring-the-post-apocalyptic-charm-of-asg-open-worlds-in-wuthering-waves</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 360 | <code>- AUTOMATON/GamerBraves coverage, Endfield Unity modifications: https://automaton-media.com/en/news/arknights-endfield-devs-heavily-modified-unity-to-accommodate-the-games-100000-polygon-characters-models-and-massive-factory-systems/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 361 | <code>- Games Press/GCORES Endfield interview translation: https://www.gamespress.com/Arknights-Endfield-Reimagined-An-In-depth-Interview-with-Light-Zhong-a</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 362 | <code>- 虎嗅/游戏葡萄 Endfield interview: https://www.huxiu.com/article/4828700.html</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 363 | <code>- Granblue Fantasy Relink graphics interview: https://www.gematsu.com/2020/12/granblue-fantasy-relink-staff-discuss-graphics-in-two-part-interview</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 364 | <code>- Genshin shader recreation by Ben Ayers: https://bjayers.com/blog/9oOD/blender-npr-recreating-the-genshin-impact-shader</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 365 | <code>- 80.lv Genshin EEVEE shader coverage: https://80.lv/articles/genshin-impact-character-shader-for-eevee</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 366 | <code>- Arc System Works/GDC, Guilty Gear Xrd art style: https://www.arcsystemworks.com/guilty-gear-xrds-art-style-the-x-factor-between-2d-and-3d-talk-from-gdc-2015-is-now-available-online/</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
