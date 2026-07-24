# docs/ailis-release-build-system.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：82
- SHA-256：`d056c15c9fb6749e46d0ea80af9ae8c69f72f972da86f95b6b46a6b64d501ed6`
- 可运行副本：[打开源文件](../../../source/docs/ailis-release-build-system.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Release Build System</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>AILIS uses a lightweight core installer plus optional runtime packs. The default release should not bundle large local models, Python environments, CosyVoice3, ASR, or Web/Search runtimes into the core installer.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Build Profiles</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>Profiles live in `installer/ailis-release-profiles.json`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>&#124; Profile &#124; Purpose &#124; Output &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 10 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 11 | <code>&#124; `core` &#124; Default public release. Builds the lightweight NSIS installer and portable package. &#124; `F:/AILIS/Build/AILIS/core` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 12 | <code>&#124; `runtime-packs` &#124; Builds optional runtime packs only. &#124; `F:/AILIS/Build/AILIS/runtime-packs` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 13 | <code>&#124; `with-packs` &#124; Builds the lightweight installer and stages selected runtime packs next to it. &#124; `F:/AILIS/Build/AILIS/with-packs` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 14 | <code>&#124; `voice-debug` &#124; Legacy heavy offline voice directory build for internal debugging. &#124; `F:/AILIS/Build/AILIS/voice-debug` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>## Commands</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 19 | <code>pnpm release:plan</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>pnpm release:core</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>pnpm release:runtime-packs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>pnpm release:with-packs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>pnpm release:voice-debug</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>Build one runtime pack family:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 29 | <code>pnpm ailis:runtime-packs:build:python</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>pnpm ailis:runtime-packs:build:voice</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>pnpm ailis:runtime-packs:build:asr</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>pnpm ailis:runtime-packs:build:web</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>Advanced direct usage:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>```powershell</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 38 | <code>node scripts/build-ailis-release.mjs --profile with-packs --components python-runtime,web-runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>node scripts/build-ailis-release.mjs --profile core --output-root F:/AILIS/Build/AILIS-test</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>node scripts/build-ailis-release.mjs --profile with-packs --dry-run --json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>## Runtime Pack Installation Model</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>The installer page in `installer/ailis-runtime-components.nsh` records which optional components the user selected. It does not force the default installer to carry giant assets.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>When runtime packs are available beside the installer:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 50 | <code>AILIS-Setup-1.0.7-win-x64.exe</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>runtime-packs/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>  AILIS-Runtime-python-runtime-1.0.7.zip</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>  AILIS-Runtime-cosyvoice3-runtime-1.0.7.zip</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>  AILIS-Runtime-asr-runtime-1.0.7.zip</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>  AILIS-Runtime-web-runtime-1.0.7.zip</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>the NSIS installer copies them into `resources/runtime-packs`. AILIS can then import/install only the components selected by the user from the control panel or deferred installer state.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>## Release Manifests</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>Every non-dry-run release profile writes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 65 | <code>AILIS-Release-&lt;profile&gt;-&lt;version&gt;.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>The manifest records:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>- AILIS version</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>- profile name</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>- output directory</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- runtime components included in the build plan</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>- commands executed</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>- generated artifacts with size and SHA-256</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>## Rules</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>- `core` must stay lightweight.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 80 | <code>- Large runtime assets should be built as sidecar packs, not copied into source-controlled project folders.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 81 | <code>- Use `runtime-packs` or `with-packs` only when preparing an offline-friendly release.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 82 | <code>- `voice-debug` is for internal diagnosis, not the normal public installer.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
