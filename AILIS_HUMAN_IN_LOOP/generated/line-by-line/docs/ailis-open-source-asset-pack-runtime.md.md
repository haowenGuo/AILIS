# docs/ailis-open-source-asset-pack-runtime.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：45
- SHA-256：`2b8b5d531ab19d43e9e5172e8e941d878ceeabae036514710a618e8811c071c2`
- 可运行副本：[打开源文件](../../../source/docs/ailis-open-source-asset-pack-runtime.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Open Source Asset Pack Runtime</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>AILIS now treats character and skin packs as a local, community-friendly extension system for the MIT open-source runtime.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>- The asset-pack runtime is local-first and does not require an account, payment flow, store, order system, or cloud quota service.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>- Users can install local character packs and skin packs from folders that contain a `manifest.json`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>- Community contributors can share packs separately, subject to the license of their own VRM, texture, motion, voice, and metadata assets.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>- The core AILIS source code is MIT licensed, but bundled or third-party assets may have their own licenses and should be documented per pack.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>## Pack Types</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>- `character_pack`: may include a VRM model and optional persona/style metadata.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>- `skin_pack`: may override render profile, persona style, voice metadata, or expressions without replacing the base character model.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>## Minimal Manifest</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 20 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>  "schemaVersion": 1,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>  "id": "ailis.skin.example.v1",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>  "type": "skin_pack",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>  "displayName": "Example Skin",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>  "version": "1.0.0",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>  "publisher": "Community",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>  "description": "A local open-source skin pack.",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>  "renderProfileId": "ailis_cinematic_rim_toon",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>  "assets": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>    "renderProfile": "assets/render-profile.json",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>    "personaStyle": "assets/persona-style.json",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>    "voiceProfile": "assets/voice-profile.json"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>  },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>  "compatibility": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>    "minAilisVersion": "1.0.6",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>    "runtime": ["desktop"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>## Notes</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>- Do not put API keys, account tokens, or private model credentials into asset packs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>- Do not redistribute VRM, motion, voice, texture, or model files unless their upstream license allows it.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 45 | <code>- If a pack uses third-party assets, include license notes in the pack README.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
