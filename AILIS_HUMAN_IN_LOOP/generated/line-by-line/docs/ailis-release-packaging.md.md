# docs/ailis-release-packaging.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：65
- SHA-256：`41460b9ff4fa18b44a7cc40935c8186c68d66a59d27c820ba73ac1ebb6efb00f`
- 可运行副本：[打开源文件](../../../source/docs/ailis-release-packaging.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Release Packaging</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>AILIS must not ship the full local voice stack in the default desktop installer.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>The CosyVoice3 model, Torch/CUDA runtime, and ASR runtime are optional local AI</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>components and are too large for first-run distribution.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>## Release Tiers</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>- `desktop:package:win` / `desktop:package:win:lite`: default user download.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>  It bundles the desktop app only. It does not bundle CosyVoice3, ASR, OpenClaw,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>  web runtime, or legacy speech models.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>- `desktop:package:win:offline-voice`: optional offline voice build for users who</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>  explicitly want bundled local CosyVoice3 TTS. This build is expected to be</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>  very large and should not include ASR or Web/Search runtime.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>- `ailis:runtime-packs:manifest`: generate a runtime component manifest without</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>  compressing large files.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>- `ailis:runtime-packs:build`: build separate runtime component zip packs:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>  `python-runtime`, `cosyvoice3-runtime`, `asr-runtime`, and `web-runtime`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>- Runtime installation from the control panel remains supported for users who</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>  prefer to choose their own model/cache path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>- OpenClaw references in docs/tests are historical alignment material. The</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>  default product runtime is the native AILIS Agent runtime.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>- Web/search runtime should be treated as a separate optional runtime pack, not</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>  as part of the first-download desktop installer.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>## Installer Strategy</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>The default Windows NSIS installer has an optional runtime component page. It</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>does not embed the large runtime files. Instead, it records the user's selected</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>components in:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>`resources/ailis-runtime-components.selected.json`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>AILIS can then install or import those components after the app is installed,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>using the shared component manifest:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>`installer/ailis-runtime-components.json`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>The desktop control panel reads both files through `runtimeComponents` state, so</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>the first run can show what the installer selected before any heavy runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>download or import begins.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>If a `runtime-packs` folder is placed next to the Windows installer, the NSIS</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>installer copies it to `resources/runtime-packs`. AILIS then lets the user click</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>`安装已选组件` from the control panel to import the selected packs. If a voice</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>pack is not present, selected Python/CosyVoice3/ASR components can fall back to</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>the recoverable Voice Runtime Installer. Web/Search is imported from its runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>pack because rebuilding that stack during first run is too fragile.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>This keeps the first download small while still giving users a clear install</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>decision point. A single offline installer that embeds all runtime files is only</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>useful for advanced offline distribution because the download would still be</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>roughly the sum of all selected component payloads.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>## Size Notes</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>The private Python interpreter itself is small, around 50 MB in the current</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>Windows runtime. The large parts are:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>- Torch/CUDA voice environment: about 5.4 GB unpacked.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>- CosyVoice3 model files: about 6.3 GB unpacked.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>- ASR runtime and model cache: about 4.8 GB unpacked.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>Default releases should therefore exclude these components and treat them as</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>downloadable/importable runtime packs.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
