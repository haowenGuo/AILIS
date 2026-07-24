# Resources/MotionIntake/README.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：角色资源：VRM、VRMA、表情贴图、参考音频或资源说明。
- 文件类型：`documentation`
- 原始行数：45
- SHA-256：`f3dba4e7b012c2ba5058b00e17ccc7600368550c1c14eefe0be6679ee39f4426`
- 可运行副本：[打开源文件](../../../../source/Resources/MotionIntake/README.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Motion Intake</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“角色资源：VRM、VRMA、表情贴图、参考音频或资源说明。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>这个目录用于管理 AILIS 的动作资产候选池。原则是：所有新动作先进入候选池并标注来源、许可、风格、女性化评分、穿模风险和是否通过审核；只有肉眼验收通过的动作才允许进入稳定 Runtime。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## 目录约定</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“角色资源：VRM、VRMA、表情贴图、参考音频或资源说明。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>- `candidates/`: 用户下载或购买后的原始动作包解压目录。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>- `download-attempts.json`: 记录来源页面、下载链接、许可声明和当前下载状态。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>- `src/character/motion-intake-catalog.js`: Runtime 使用的动作资产账本。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>## 状态流转</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“角色资源：VRM、VRMA、表情贴图、参考音频或资源说明。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>1. 下载或购买动作包，保存到 `Resources/MotionIntake/candidates/&lt;source-id&gt;/raw/`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>2. 解压后只把准备测试的 `.vrma` 放到 `Resources/MotionIntake/candidates/&lt;source-id&gt;/vrma/`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>3. 在 `src/character/motion-intake-catalog.js` 新增动作条目，必须填写：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>   - `source`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>   - `license`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>   - `style`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>   - `feminineScore`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>   - `clippingRisk`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 21 | <code>   - `approved`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>4. 运行 `pnpm motion:intake:verify`，确保账本、文件和 Runtime 注册一致。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>5. 在桌面端打开“角色验收”面板，逐个观看候选动作。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>6. 只有满足以下条件才把 `approved` 改为 `true`：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>   - AILIS 身体、衣服、头发、手臂没有明显穿模。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>   - 动作风格符合 AILIS：柔和、女性化、二次元助手感。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>   - 镜头内构图稳定，不会大幅出框。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>   - 不会显著打断对话节奏。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>   - 许可允许当前使用场景。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>## 当前免费来源</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“角色资源：VRM、VRMA、表情贴图、参考音频或资源说明。”这一文件职责。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>- `[CC0] Sachi VRMA 1`: BOOTH 商品页可访问，但匿名访问 `downloadables/5713997` 会跳转登录。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>- `fumi2kick VRMA motion pack`: BOOTH 商品页可访问，但匿名访问 `downloadables/4234181` 会跳转登录。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>- `VRoid official 7 VRMA`: 本地 `Resources/VRMA_MotionPack` 已包含对应 readme 和 `VRMA_01` 到 `VRMA_07` 文件；许可不是 CC0，需遵守 VRoid Project 条款。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>## 2026-06-03 本地导入</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“角色资源：VRM、VRMA、表情贴图、参考音频或资源说明。”这一文件职责。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>- `F:/新建文件夹/SachiVRMA1.zip` 已复制到 `candidates/sachi-vrma-1/raw/`。该 zip 的中央目录损坏，`Expand-Archive` 无法完整打开；`tar` 成功抽出 `capture_vrma` 下 42 个 `.vrma`，但在后续 Blender 源文件处失败。因此这些 VRMA 可以进入候选验收，但在重新下载健康压缩包前，不应视为完整归档。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- `F:/新建文件夹/fm_vrma_motion_pack_01.zip` 已完整解压到 `candidates/fumi2kick-vrma-motion-pack/extracted/`，包含 8 个 `.vrma`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- 两个包的动作均已登记到 `src/character/motion-intake-external-candidates.js`，默认 `approved: false`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>## 付费动作包导入原则</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“角色资源：VRM、VRMA、表情贴图、参考音频或资源说明。”这一文件职责。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>付费包也走同一流程，不允许直接改稳定动作映射。先进入候选池，标注购买来源和许可摘要，再由验收面板肉眼通过后进入稳定 Runtime。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
