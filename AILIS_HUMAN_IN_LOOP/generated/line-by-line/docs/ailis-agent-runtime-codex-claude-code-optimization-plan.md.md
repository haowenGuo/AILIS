# docs/ailis-agent-runtime-codex-claude-code-optimization-plan.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：1515
- SHA-256：`f728b03d594ac8428fce16892605750e65d7ded2c397b6b67d2affa3b8fb10ae`
- 可运行副本：[打开源文件](../../../source/docs/ailis-agent-runtime-codex-claude-code-optimization-plan.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`at`、`tracks`、`handler`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Agent Runtime Optimization Plan from Codex and Claude Code</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Last updated: 2026-06-18</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>This document records a code-backed optimization plan for AILIS Agent/Tools/MCP/Context Runtime. It is intentionally strict: every proposed module below points to an inspected Codex or Claude Code implementation anchor.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>The goal is not to copy product behavior blindly. The goal is to copy the engineering shape that makes Codex and Claude Code stable:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>- The model receives accurate environment context instead of guessing the OS or shell.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>- Tool schemas are small, searchable, and loaded progressively.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>- Command/file outputs are bounded, metadata-rich, and recoverable.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>- Large files become queryable artifacts instead of raw prompt payload.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>- Repeated reads are detected by runtime state, not by hoping the model remembers.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>- Context growth is measured and compacted with explicit budgets.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>## Source Inventory</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>### Codex source used</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>Codex npm package installed locally:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>- `C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@openai\codex\package.json`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 23 | <code>- package version: `0.139.0`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>- package points to repository: `https://github.com/openai/codex.git`, directory `codex-cli`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>Inspected source checkout:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 29 | <code>D:\Temp\codex-source-inspect</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>HEAD: 5867b529ae91afad02de74a0bc1a2162e3721688</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>Commit date: 2026-06-17 19:36:16 +0000</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>Commit subject: unified-exec: preserve PathUri through exec-server (#28681)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>Important Codex source anchors:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context\environment_context.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\shell.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\unified_exec.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\unified_exec\exec_command.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\mod.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 44 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process_manager.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 45 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\head_tail_buffer.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 46 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 47 | <code>- `D:\Temp\codex-source-inspect\codex-rs\utils\output-truncation\src\lib.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 48 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search_spec.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 50 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\mcp_tool_exposure.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 51 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 52 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 53 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\injection.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 54 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 55 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\thread_rollout_truncation.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>### Claude Code source used</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>Claude Code installed locally:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>- `C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\package.json`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>- package version: `2.1.101`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>- main bundle: `C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\cli.js`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>Important boundary: the Claude Code npm package is a bundled/minified `cli.js`, not a split source tree. Therefore Claude Code references below use package version, function/string name, and byte offset inside `cli.js`, not stable source line numbers.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>Key Claude Code bundle anchors:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>- `S14` Read prompt function at byte offset `3736163`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>- `RZY` Read input schema at byte offset `9781964`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>- `wz=cq({name:uq...})` Read tool object at byte offset `9784805`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 72 | <code>- `eEK` Read call implementation at byte offset `9776413`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- `E96` text file reader at byte offset `9632031`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>- `DH8` line-number formatter at byte offset `912430`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>- `jL6` read-state reconstruction/dedup support at byte offset `6593787`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>- `MTz` long-file sequential chunk instruction at byte offset `6816469`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>- `GR6` Bash max output length at byte offset `7055797`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 78 | <code>- `L2` Bash task output/spill-to-disk class at byte offset `7055988`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 79 | <code>- `Mg6` capped output accumulator at byte offset `873217`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>## 1. Runtime Environment Context</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>Codex injects runtime environment context as structured context, not as memory and not as a hardcoded Windows assumption.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>Reference:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context\environment_context.rs:20`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 90 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context\environment_context.rs:30`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 91 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context\environment_context.rs:422`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context\environment_context.rs:535`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>- `EnvironmentContextEnvironment` stores `id`, `cwd`, and `shell`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 97 | <code>- `EnvironmentContext::from_turn_context` builds the context from current turn environments.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 98 | <code>- The rendered context includes `&lt;cwd&gt;` and `&lt;shell&gt;`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 99 | <code>- It also includes current date, timezone, network info, filesystem roots, and permissions when available.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>Codex shell execution uses detected shell type to derive the actual process arguments.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>Reference:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\shell.rs:22`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\shell.rs:32`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\shell.rs:42`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>- Bash/zsh/sh use `-c` or `-lc`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 112 | <code>- PowerShell uses `-NoProfile -Command` when not a login shell.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 113 | <code>- Cmd uses `/c`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>AILIS should have a first-class `runtime_environment` turn context module:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 120 | <code>runtime_environment</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 121 | <code>  environmentId</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>  cwd</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>  osFamily</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>  shellName</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>  shellPath</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>  pathConvention</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>  currentDate</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>  timezone</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>  filesystemRoots</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>  permissionProfile</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>  networkPolicy</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>This belongs in turn/runtime context, not in long-term user memory. It changes with environment, session, remote target, and shell.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>Likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 141 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 142 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-gateway.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>Add a model-visible context block similar to:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>```xml</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 147 | <code>&lt;runtime_environment&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>  &lt;cwd&gt;F:\AILIS_self_evolution_runtime&lt;/cwd&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>  &lt;os_family&gt;windows&lt;/os_family&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>  &lt;shell&gt;powershell&lt;/shell&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>  &lt;path_convention&gt;windows&lt;/path_convention&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>  &lt;timezone&gt;Asia/Shanghai&lt;/timezone&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>&lt;/runtime_environment&gt;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 154 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 156 | <code>The exact values must be detected at runtime. Do not write a fixed Windows string into static prompt text.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>- Do not translate Unix commands into PowerShell by regex.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 161 | <code>- Do not assume the user's machine is always Windows.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 162 | <code>- Do not put `runtime_environment` into persistent preference memory.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 163 | <code>- Do not make command correctness depend on hidden app-side command rewriting.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 165 | <code>## 2. Shell and Exec Tool Contract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>Codex has two related command tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>- `exec_command`, the unified exec tool.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 172 | <code>- `shell_command`, older/simple shell command tool.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 173 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 174 | <code>Reference:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:21`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 177 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:52`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 178 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:88`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 179 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:110`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 180 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:188`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 181 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:261`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 182 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\shell_spec.rs:402`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 185 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 186 | <code>- `exec_command` schema includes `cmd`, `workdir`, `tty`, `yield_time_ms`, `max_output_tokens`, optional `shell`, optional `environment_id`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 187 | <code>- `write_stdin` is a separate tool for ongoing sessions.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 188 | <code>- On Windows, the tool description says PowerShell and gives PowerShell examples.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 189 | <code>- Windows safety rules are guidance, not a Unix-to-PowerShell translator.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 190 | <code>- `unified_exec_output_schema` explicitly includes `chunk_id`, `wall_time_seconds`, `exit_code`, `session_id`, `original_token_count`, and `output`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>Claude Code's Bash prompt also uses shell/tool guidance rather than a command rewriting layer.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>Reference:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>- `C:\Users\Lenovo\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\cli.js`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 197 | <code>- Bash tool guidance string near byte offset `7218141`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 199 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 201 | <code>- Bash output limit is stated in the tool prompt.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 202 | <code>- It tells the model to use dedicated tools for file search/content search/read/edit/write instead of using PowerShell equivalents when dedicated tools exist.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 203 | <code>- It tells the model not to prefix commands with `cd` or `Set-Location` because working directory is already set.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>AILIS exec should be one unified command interface with explicit environment semantics:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 209 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 210 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 211 | <code>  "cmd": "Get-ChildItem -Force",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 212 | <code>  "workdir": "F:\\AILIS_self_evolution_runtime",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 213 | <code>  "yieldTimeMs": 10000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 214 | <code>  "maxOutputTokens": 10000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 215 | <code>  "shell": "powershell",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 216 | <code>  "environmentId": "local"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 217 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>The tool should return a structured observation:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 223 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 224 | <code>  "status": "completed",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 225 | <code>  "exitCode": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 226 | <code>  "wallTimeMs": 842,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 227 | <code>  "outputId": "exec_...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 228 | <code>  "stdoutPreview": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 229 | <code>  "stderrPreview": "",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 230 | <code>  "stdoutBytes": 12345,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>  "stderrBytes": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 232 | <code>  "stdoutLines": 240,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 233 | <code>  "stderrLines": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>  "truncated": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 235 | <code>  "nextTools": ["output_read", "output_tail", "output_search"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 236 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 237 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>Likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-computer-tool.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 244 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 245 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 246 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 248 | <code>Required changes:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 250 | <code>- Update tool declaration so the model sees the actual shell/environment.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 251 | <code>- Add `yieldTimeMs` and `maxOutputTokens` semantics if missing.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 252 | <code>- Return structured metadata even for empty output.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 253 | <code>- Preserve full output in an output store.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>- Do not return only `exitCode=0`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 258 | <code>- Do not use a fixed failure phrase like "有一步没有顺利通过".</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 259 | <code>- Do not auto-convert `/dev/null`, `head`, `tail`, or `cd /d` with brittle parsing.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 260 | <code>- Do not hide stderr, timeout, spawn failure, permission failure, or empty-output diagnostics.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>## 3. Exec Output Store</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 266 | <code>Codex unified exec uses a process manager, output buffer, and output metadata.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 267 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 268 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 269 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 270 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\mod.rs:64`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 271 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\mod.rs:70`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 272 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\mod.rs:71`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 273 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\head_tail_buffer.rs:1`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 274 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process.rs:44`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 275 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process_manager.rs:382`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 276 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process_manager.rs:464`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 277 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process_manager.rs:598`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 278 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process_manager.rs:615`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 279 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\unified_exec\process_manager.rs:1139`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 280 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs:308`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 281 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs:409`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>- Codex default `DEFAULT_MAX_OUTPUT_TOKENS` is `10000`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 286 | <code>- Codex unified exec process buffer retains up to `1 MiB`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 287 | <code>- `HeadTailBuffer` preserves a stable prefix and suffix and drops the middle.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 288 | <code>- Initial `exec_command` can return a live process/session id.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 289 | <code>- `write_stdin` can poll or interact with the process.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 290 | <code>- `ExecCommandToolOutput` includes wall time, exit code, process id, original token count, and output.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>Claude Code also has an output store/spill pattern.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 296 | <code>- `GR6` Bash max output length at byte offset `7055797`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 297 | <code>- `L2` Bash task output/spill-to-disk class at byte offset `7055988`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 298 | <code>- `Mg6` capped output accumulator at byte offset `873217`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 300 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 302 | <code>- `BASH_MAX_OUTPUT_LENGTH` is read from env and bounded by defaults.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 303 | <code>- The `L2` task output class tracks task id, output path, stdout/stderr, total lines, total bytes, overflow state, and spill-to-disk behavior.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 304 | <code>- When output overflows, full output is saved to a file and the model receives recent output plus a saved-file notice.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 305 | <code>- `Mg6` caps accumulated content and appends an explicit truncation marker.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 307 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 309 | <code>AILIS should not try to put all exec output in model context. It should implement `Exec Output Store`:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 311 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 312 | <code>exec_command</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 313 | <code>  -&gt; write full stdout/stderr to .ailis-state/output-store/{callId}.log</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 314 | <code>  -&gt; return preview, outputId, byte counts, line counts, truncation status</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 315 | <code>  -&gt; let model call output_read/output_tail/output_search</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 316 | <code>  -&gt; let Agent Lab show full output outside model context</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 317 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 319 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>Likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 323 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-computer-tool.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 324 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 325 | <code>- new optional file: `F:\AILIS_self_evolution_runtime\electron\ailis-exec-output-store.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 326 | <code>- tests under `F:\AILIS_self_evolution_runtime\tests\`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>Required tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>- `output_read(outputId, offsetBytes?, maxBytes?)`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 331 | <code>- `output_tail(outputId, lines?)`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 332 | <code>- `output_search(outputId, query&#124;regex, maxMatches?)`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 333 | <code>- optional `output_summary(outputId)`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 335 | <code>Observation contract:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 338 | <code>Output is not lost.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 339 | <code>Preview may be truncated.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 340 | <code>Full output is available through output_* tools.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 341 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 345 | <code>- Do not raise one global output limit and call it solved.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 346 | <code>- Do not return only a 1200-character preview.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 347 | <code>- Do not make Agent Lab and model context share the same output budget.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 348 | <code>- Do not drop the middle without saying so.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 349 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 350 | <code>## 4. Text File Read Runtime</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 352 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 353 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 354 | <code>Claude Code's Read tool is a real file-runtime layer, not a generic byte dump.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 358 | <code>- `S14` Read prompt function at byte offset `3736163`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 359 | <code>- `RZY` Read input schema at byte offset `9781964`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 360 | <code>- `wz=cq({name:uq...})` Read tool object at byte offset `9784805`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 361 | <code>- `eEK` Read call implementation at byte offset `9776413`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 362 | <code>- `E96` text file reader at byte offset `9632031`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 363 | <code>- `DH8` line-number formatter at byte offset `912430`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 364 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 365 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 366 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 367 | <code>- Read schema has `file_path`, `offset`, `limit`, and `pages`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 368 | <code>- Default read starts from the beginning and reads a bounded number of lines.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 369 | <code>- Text result carries `filePath`, `content`, `numLines`, `startLine`, and `totalLines`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 370 | <code>- Output is formatted with line numbers.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 371 | <code>- Large content raises a specific error telling the model to use `offset` and `limit` or search.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 372 | <code>- Device files that can block or infinite-output are denied.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 373 | <code>- Binary files are rejected unless supported as images/PDF/notebooks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 374 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 375 | <code>Claude Code also has a long-file instruction generator.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 377 | <code>Reference:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 378 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 379 | <code>- `MTz` at byte offset `6816469`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 381 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 382 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 383 | <code>- It instructs the model to read sequential chunks until the whole file is read.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 384 | <code>- If truncation warnings occur, reduce chunk size before proceeding.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 385 | <code>- The model must state what portion was read before analysis.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 387 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>AILIS `read` should become a structured read tool:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 391 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 392 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 393 | <code>  "filePath": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 394 | <code>  "offsetLine": 1,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 395 | <code>  "limitLines": 2000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 396 | <code>  "content": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 397 | <code>  "startLine": 1,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 398 | <code>  "numLines": 2000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 399 | <code>  "totalLines": 12842,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 400 | <code>  "totalBytes": 620000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 401 | <code>  "readBytes": 92000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 402 | <code>  "complete": false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 403 | <code>  "truncated": false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 404 | <code>  "next": "Use read with offsetLine=2001 to continue, or search for specific terms."</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 405 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 406 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 409 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 410 | <code>Likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 412 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-computer-tool.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 413 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 414 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 415 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 416 | <code>Required behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 418 | <code>- Support line ranges for text files.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 419 | <code>- Return line counts and total line counts.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 420 | <code>- Preserve model-facing line numbers.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 421 | <code>- Reject or redirect binary/structured files with actionable next tool hints.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 422 | <code>- Store read state so repeated reads can be detected.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 424 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 425 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 426 | <code>- Do not read arbitrary large files into one model observation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 427 | <code>- Do not return binary garbage.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 428 | <code>- Do not report a truncated preview as if it were complete.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 429 | <code>- Do not make `.xlsx`, `.docx`, `.pdf`, `.pptx` go through generic text read.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>## 5. Read State, Deduplication, and Re-Read Prevention</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 432 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 433 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 434 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 435 | <code>Claude Code tracks read state and can return `file_unchanged` instead of repeating content.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 436 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 437 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 439 | <code>- `jL6` read-state reconstruction/dedup support at byte offset `6593787`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 440 | <code>- `wz=cq({name:uq...})` Read tool object at byte offset `9784805`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 441 | <code>- Read prompt reminder strings around byte offset `3736163`, including file-unchanged messages.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 442 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 443 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 445 | <code>- Claude Code records prior full-file reads when no `offset`/`limit` was used.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 446 | <code>- It maps tool call ids to read file paths and later tool results.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 447 | <code>- It stores content, timestamp, offset, and limit in read state.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 448 | <code>- If the same file is read again and unchanged, it can return `file_unchanged`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 449 | <code>- The model-visible reminder says earlier content is still current.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 451 | <code>Codex also has context/history management that normalizes tool outputs and tracks history.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 453 | <code>Reference:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 454 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 455 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:32`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 456 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:90`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 457 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:249`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 459 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>- Codex records history items through a context manager.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 462 | <code>- It processes items under truncation policy before prompt use.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 463 | <code>- It tracks token usage info over time.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 465 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 467 | <code>AILIS needs `Read State` as runtime memory for files/artifacts read during a run:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 469 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 470 | <code>readState[filePath]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 471 | <code>  mtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 472 | <code>  size</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 473 | <code>  rangesRead</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 474 | <code>  fullReadComplete</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 475 | <code>  evidenceIds</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 476 | <code>  lastToolCallId</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 477 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 478 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 479 | <code>For repeated full reads:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 480 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 481 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 482 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 483 | <code>  "status": "file_unchanged",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 484 | <code>  "filePath": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 485 | <code>  "evidenceId": "read_...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 486 | <code>  "message": "This file has not changed since the previous full read. Use the earlier evidence or request a specific range/search."</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 487 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 488 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 489 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 490 | <code>For repeated artifact ranges:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 491 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 492 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 493 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 494 | <code>  "status": "evidence_already_available",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 495 | <code>  "artifactId": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 496 | <code>  "requestedRange": "A10:I13",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 497 | <code>  "coveredBy": "Sheet1!A1:I20",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 498 | <code>  "evidenceId": "artifact_grid_...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 499 | <code>  "complete": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 500 | <code>  "reasoningReady": true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 501 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 502 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 504 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 506 | <code>Likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 508 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-context-artifact-store.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 509 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-computer-tool.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 510 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 511 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 512 | <code>Required behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 513 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 514 | <code>- Track file/artifact reads by range and timestamp.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 515 | <code>- Treat covered repeated reads as successful but redundant.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 516 | <code>- Return a positive, actionable observation rather than an error.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 517 | <code>- Surface evidence ids to Agent Lab.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 518 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 519 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 521 | <code>- Do not block repeated reads with a generic failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 522 | <code>- Do not rely only on prompt text like "do not read again".</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 523 | <code>- Do not hide the fact that earlier evidence exists.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 524 | <code>- Do not force final answers globally; only suppress redundant evidence acquisition.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 525 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 526 | <code>## 6. Structured Artifact Runtime</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 529 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 530 | <code>Claude Code's Read has special handling for images, PDFs, notebooks, binary files, and page ranges.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 531 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 532 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 533 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 534 | <code>- `RZY` schema includes `pages` at byte offset `9781964`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 535 | <code>- `eEK` handles `ipynb`, image types, PDF page extraction, PDF page count, and text files at byte offset `9776413`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 536 | <code>- Binary MIME/type handling appears near `PTz` at byte offset `6816469`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 537 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 538 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 539 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 540 | <code>- Notebook reads are parsed as cells, not raw JSON text when possible.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 541 | <code>- PDF reads may require page ranges.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 542 | <code>- Large PDFs can be rejected with a specific instruction to use `pages`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 543 | <code>- Images are returned as image content with metadata.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 544 | <code>- Binary files are rejected if no supported reader exists.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 545 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 546 | <code>Codex does not expose an XLSX-specific public code path in the inspected core, but its general pattern is the same: do not dump huge raw outputs into prompt; use structured tool results and truncation policies.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 547 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 548 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 549 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 550 | <code>- `D:\Temp\codex-source-inspect\codex-rs\utils\output-truncation\src\lib.rs:12`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 551 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs:331`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 552 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs:366`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 553 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 554 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 555 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 556 | <code>- Tool output is converted into a model-facing response item.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 557 | <code>- Code mode result is structured JSON.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 558 | <code>- Large text is formatted/truncated with explicit warnings.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 559 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 560 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 561 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 562 | <code>AILIS should generalize current XLSX work into `Context/Artifact Runtime`:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 563 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 564 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 565 | <code>artifact_store</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 566 | <code>  spreadsheet artifact</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 567 | <code>  document artifact</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 568 | <code>  pdf artifact</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 569 | <code>  log artifact</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 570 | <code>  command-output artifact</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 571 | <code>  browser-dom artifact</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 572 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 573 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 574 | <code>Each artifact should have:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 577 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 578 | <code>  "artifactId": "ctx-spreadsheet-...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 579 | <code>  "kind": "spreadsheet",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 580 | <code>  "sourcePath": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 581 | <code>  "summary": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 582 | <code>  "dimensions": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 583 | <code>  "queryTools": ["artifact_query", "artifact_search", "artifact_compute"],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 584 | <code>  "payloadPath": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 585 | <code>  "payloadReadableByModel": false</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 586 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 587 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 588 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 589 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 591 | <code>Existing relevant files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 593 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-context-artifact-store.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 594 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-xlsx-workbook-tool.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 595 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-gateway.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 596 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 597 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 598 | <code>Required next tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 599 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 600 | <code>- `artifact_query`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 601 | <code>- `artifact_search`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 602 | <code>- `artifact_range`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 603 | <code>- `artifact_payload_read` for chunked audited payload access</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 604 | <code>- `artifact_compute` for deterministic data worker/subagent analysis</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 605 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 606 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 607 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 608 | <code>- Do not write one-off XLSX or GitHub hacks as the primary architecture.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 609 | <code>- Do not expose `fullJsonPath` as the recommended model action.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 610 | <code>- Do not let the model raw-read generated artifact payloads as its first option.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 611 | <code>- Do not remove payload access completely; make it chunked, searchable, and auditable.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 612 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 613 | <code>## 7. Evidence Sufficiency and Coverage Gate</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 614 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 615 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 616 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 617 | <code>Claude Code avoids repeated reads with `file_unchanged` and read state.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 618 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 619 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 620 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 621 | <code>- `jL6` at byte offset `6593787`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 622 | <code>- `wz=cq({name:uq...})` at byte offset `9784805`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 623 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 624 | <code>Codex keeps structured history and token info rather than relying on raw conversation text.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 625 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 626 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 627 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 628 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:32`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 629 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:107`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 630 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:130`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 631 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:249`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 632 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 633 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 634 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 635 | <code>- ContextManager can estimate token count.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 636 | <code>- It normalizes history before model prompt.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 637 | <code>- It updates token info from provider usage.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 638 | <code>- It can replace or drop history segments.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 639 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 640 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 641 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 642 | <code>AILIS needs an evidence layer above raw tool results:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 643 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 644 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 645 | <code>evidence_id</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 646 | <code>  source tool call</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 647 | <code>  artifact id</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 648 | <code>  range/query covered</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 649 | <code>  complete flag</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 650 | <code>  truncated flag</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 651 | <code>  reasoning_ready flag</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 652 | <code>  short human-readable claim</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 653 | <code>  payload pointer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 654 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 655 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 656 | <code>For spreadsheet tasks, after `artifact_query grid A1:I20` returns complete, AILIS should pin:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 657 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 658 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 659 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 660 | <code>  "evidenceId": "ev_grid_...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 661 | <code>  "artifactId": "ctx-spreadsheet-...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 662 | <code>  "sheet": "Sheet1",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 663 | <code>  "range": "A1:I20",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 664 | <code>  "complete": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 665 | <code>  "truncated": false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 666 | <code>  "reasoningReady": true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 667 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 668 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 669 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 670 | <code>If the model later asks for `A10:I13`, runtime should detect coverage and return `evidence_already_available` with the pinned evidence id.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 672 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 674 | <code>Likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 675 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 676 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-context-artifact-store.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 677 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 678 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-gateway.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 679 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 680 | <code>Required behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 681 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 682 | <code>- Pin complete non-truncated artifact observations.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 683 | <code>- Record coverage ranges for structured artifacts.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 684 | <code>- Detect redundant queries.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 685 | <code>- Offer `artifact_compute` when reasoning over complete evidence is more appropriate than more reads.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 686 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 687 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 688 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 689 | <code>- Do not classify "GitHub failed" or "XLSX failed" with task-specific if-statements.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 690 | <code>- Do not treat `evidence_already_available` as an error.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 691 | <code>- Do not assume the model will remember a full grid after context compression.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 692 | <code>- Do not let prompt compression erase the only copy of complete evidence metadata.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 694 | <code>## 8. Tool Search and Deferred Tool Exposure</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 695 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 696 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 697 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 698 | <code>Codex implements tool search as a real tool over deferred metadata.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 700 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 701 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 702 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search_spec.rs:7`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 703 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search_spec.rs:49`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 704 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search.rs:24`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 705 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search.rs:66`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 706 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\tool_search.rs:151`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 707 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 708 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 709 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 710 | <code>- Tool search description tells the model some tools are not visible up front.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 711 | <code>- Search engine uses BM25 over tool metadata.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 712 | <code>- Search results are coalesced into loadable tool specs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 713 | <code>- The model uses `tool_search` instead of listing MCP resources for MCP tool discovery.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 714 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 715 | <code>Codex also defers MCP tools when the set is too large.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 716 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 717 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 718 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 719 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\mcp_tool_exposure.rs:14`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 720 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\mcp_tool_exposure.rs:16`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 721 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\mcp_tool_exposure.rs:37`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 722 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\mcp_tool_exposure.rs:50`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 723 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 724 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 725 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 726 | <code>- Direct MCP exposure threshold is `100`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 727 | <code>- Exposure result separates `direct_tools` and `deferred_tools`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 728 | <code>- If search is enabled and tool count or feature flags require it, tools are deferred.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 729 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 730 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 731 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 732 | <code>AILIS should expose a small core tool surface:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 733 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 734 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 735 | <code>exec_command</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 736 | <code>read</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 737 | <code>write/edit/apply_patch if available</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 738 | <code>artifact_query</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 739 | <code>tool_search</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 740 | <code>maybe current-task obvious tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 741 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 742 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 743 | <code>Everything else should be discoverable:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 744 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 745 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 746 | <code>read_xlsx_workbook</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 747 | <code>read_docx_document</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 748 | <code>pdf_extract_text</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 749 | <code>github_repo_inspect</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 750 | <code>github_pages_diagnose</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 751 | <code>browser_dom_query</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 752 | <code>email_search</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 753 | <code>calendar_read</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 754 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 755 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 756 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 757 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 758 | <code>Existing likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 759 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 760 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-routing.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 761 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-specs.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 762 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 763 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 764 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 765 | <code>Required behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 766 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 767 | <code>- Build search entries from name, description, schema keys, source, skill tags, and examples.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 768 | <code>- Search should return actual loadable tool specs, not just prose recommendations.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 769 | <code>- Tool search should cover local tools and MCP-derived tools.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 770 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 771 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 772 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 773 | <code>- Do not dump every tool declaration into the base prompt.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 774 | <code>- Do not hide specialized readers behind only a generic "read" prompt.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 775 | <code>- Do not make the model call `list_mcp_resources` for tool discovery.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 776 | <code>- Do not use a hardcoded legal-tool whitelist that blocks newly loaded tools.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 777 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 778 | <code>## 9. MCP Tool Registry and Direct MCP Tools</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 779 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 780 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 781 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 782 | <code>Codex wraps each MCP tool into a first-class handler/spec.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 783 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 784 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 785 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 786 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:32`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 787 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:38`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 788 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:67`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 789 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:89`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 790 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:121`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 791 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:143`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 792 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 793 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 794 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 795 | <code>- `McpHandler` owns one `ToolInfo` and one generated `ToolSpec`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 796 | <code>- `tool_name()` returns the canonical MCP-derived tool name.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 797 | <code>- `search_info()` creates searchable metadata from MCP tool info.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 798 | <code>- `handle_call()` dispatches to `handle_mcp_tool_call` with server name and tool name known by runtime.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 799 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 800 | <code>Codex MCP resource tools also have structured list/read handlers.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 801 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 802 | <code>Reference:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 803 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 804 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp_resource.rs:36`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 805 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp_resource.rs:54`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 806 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp_resource.rs:173`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 807 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 808 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 809 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 810 | <code>- Resource listing and reading use typed argument structs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 811 | <code>- Resource payloads include server and uri.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 812 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 813 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 814 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 815 | <code>AILIS should keep `mcp_bridge` for diagnostics, but normal task execution should use direct MCP-derived tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 816 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 817 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 818 | <code>mcp__github__create_issue</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 819 | <code>mcp__github__get_pull_request</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 820 | <code>mcp__ailis_research__web_fetch</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 821 | <code>mcp__ailis_research__pdf_extract_text</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 822 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 823 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 824 | <code>Runtime, not the model, should remember:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 825 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 826 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 827 | <code>model tool name -&gt; MCP server -&gt; MCP tool -&gt; input schema -&gt; risk metadata</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 828 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 829 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 830 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 831 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 832 | <code>New or refactored module:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 833 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 834 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-mcp-tool-registry.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 835 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 836 | <code>Affected files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 837 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 838 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 839 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 840 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 841 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-routing.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 842 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 843 | <code>Required behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 844 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 845 | <code>- On server connect, list MCP tools.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 846 | <code>- Convert each MCP tool into an AILIS tool contract.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 847 | <code>- Validate args against the real MCP input schema.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 848 | <code>- Dispatch directly to MCP.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 849 | <code>- Emit tool start/end events with server/tool/duration/status.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 850 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 851 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 852 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 853 | <code>- Do not make the model manually pass `{server, tool, args}` for routine tasks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 854 | <code>- Do not expose only an indirect MCP bridge when direct schema is available.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 855 | <code>- Do not treat MCP schema validation failure as a fatal task failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 856 | <code>- Do not invent MCP tools from memory; only expose live discovered tools.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 857 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 858 | <code>## 10. Skills and Progressive Disclosure</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 859 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 860 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 861 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 862 | <code>Codex skill rendering is explicitly progressive.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 863 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 864 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 865 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 866 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:17`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 867 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:25`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 868 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:30`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 869 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:47`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 870 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:56`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 871 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:143`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 872 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\render.rs:160`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 873 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 874 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 875 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 876 | <code>- Skill metadata has a budget.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 877 | <code>- Codex can truncate skill descriptions to fit a skills context budget.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 878 | <code>- The prompt says skill bodies live in `SKILL.md`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 879 | <code>- The model must read `SKILL.md` before using a skill.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 880 | <code>- It should only load directly relevant referenced files.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 881 | <code>- It should use scripts/assets from skills instead of recreating them.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 882 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 883 | <code>Codex skill injection only injects explicitly mentioned selected skill bodies.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 884 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 885 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 886 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 887 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\injection.rs:58`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 888 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\injection.rs:75`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 889 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\injection.rs:80`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 890 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core-skills\src\injection.rs:90`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 891 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 892 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 893 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 894 | <code>- `build_skill_injections` receives selected skills.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 895 | <code>- It reads `SKILL.md` contents for those skills.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 896 | <code>- It emits warnings if loading fails.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 897 | <code>- It tracks skill invocation analytics.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 898 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 899 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 900 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 901 | <code>AILIS skills should not be a second tool-schema injection system. They should be workflow packages:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 902 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 903 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 904 | <code>electron/skills/spreadsheet-analysis/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 905 | <code>  SKILL.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 906 | <code>  scripts/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 907 | <code>  references/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 908 | <code>  tests/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 909 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 910 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 911 | <code>`SKILL.md` should explain:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 912 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 913 | <code>- when to use the skill,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 914 | <code>- which tool families to search/load,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 915 | <code>- what evidence is sufficient,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 916 | <code>- what failure modes to avoid,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 917 | <code>- when to use data worker or artifact compute.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 918 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 919 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 920 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 921 | <code>Likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 922 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 923 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 924 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 925 | <code>- existing skill folders under `F:\AILIS_self_evolution_runtime\electron\skills\`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 926 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 927 | <code>Required behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 928 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 929 | <code>- Base prompt gets skill catalog only.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 930 | <code>- Skill bodies are loaded only when selected by user, model, routing, or tool search.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 931 | <code>- Skill body should not paste all tool contracts.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 932 | <code>- Tool contracts come from the tool registry.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 933 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 934 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 935 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 936 | <code>- Do not turn skills into regex task routers.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 937 | <code>- Do not duplicate huge tool schemas inside `SKILL.md`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 938 | <code>- Do not let every skill load on every turn.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 939 | <code>- Do not ask subagents to interpret skill instructions that the main agent never read.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 940 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 941 | <code>## 11. Context and History Management</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 942 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 943 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 944 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 945 | <code>Codex has a context manager with token accounting and normalization.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 946 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 947 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 948 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 949 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:32`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 950 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:81`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 951 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:91`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 952 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:111`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 953 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:132`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 954 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs:249`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 955 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 956 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 957 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 958 | <code>- It stores response items and token usage info.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 959 | <code>- It records items under a truncation policy.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 960 | <code>- It prepares normalized prompt history.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 961 | <code>- It can estimate token count.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 962 | <code>- It updates token info from actual usage.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 964 | <code>Codex rollout truncation works by user/fork turn boundaries.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 965 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 966 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 967 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 968 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\thread_rollout_truncation.rs:15`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 969 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\thread_rollout_truncation.rs:35`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 970 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\thread_rollout_truncation.rs:69`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 971 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\thread_rollout_truncation.rs:119`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 972 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\thread_rollout_truncation.rs:143`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 973 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 974 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 975 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 976 | <code>- It detects user-turn boundaries.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 977 | <code>- It handles rollback markers.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 978 | <code>- It can keep last N fork turns.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 979 | <code>- It avoids naive byte/line truncation of history.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 980 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 981 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 982 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 983 | <code>AILIS should treat conversation/history context as a managed runtime object:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 984 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 985 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 986 | <code>context_manager</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 987 | <code>  raw event log</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 988 | <code>  model prompt history</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 989 | <code>  pinned evidence manifest</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 990 | <code>  artifact metadata</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 991 | <code>  token usage per round</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 992 | <code>  compacted summaries</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 993 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 994 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 995 | <code>Do not let raw transcript equal model prompt.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 996 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 997 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 998 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 999 | <code>Likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1000 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1001 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1002 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-gateway.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1003 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-memory-store.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1004 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1005 | <code>Required behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1006 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1007 | <code>- Track per-round input/output/tool tokens.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1008 | <code>- Keep raw event log for Agent Lab.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1009 | <code>- Keep compact prompt history for model.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1010 | <code>- Pin evidence separately from transcript.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1011 | <code>- Before compaction, preserve evidence manifests and artifact ids.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1012 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1013 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1014 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1015 | <code>- Do not compress away the only complete grid/output evidence.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1016 | <code>- Do not keep giant tool outputs in every subsequent model turn.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1017 | <code>- Do not mix persona/progress text into evidence state.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1018 | <code>- Do not treat "context summary" as equivalent to "data retained".</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1019 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1020 | <code>## 12. Tool Output Truncation Contract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1021 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1022 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1023 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1024 | <code>Codex formats truncation warnings with original token count and line count.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1025 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1026 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1027 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1028 | <code>- `D:\Temp\codex-source-inspect\codex-rs\utils\output-truncation\src\lib.rs:12`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1029 | <code>- `D:\Temp\codex-source-inspect\codex-rs\utils\output-truncation\src\lib.rs:17`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1030 | <code>- `D:\Temp\codex-source-inspect\codex-rs\utils\output-truncation\src\lib.rs:20`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1031 | <code>- `D:\Temp\codex-source-inspect\codex-rs\utils\output-truncation\src\lib.rs:83`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1032 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1033 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1034 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1035 | <code>- `formatted_truncate_text` checks policy byte budget.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1036 | <code>- It computes original token count.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1037 | <code>- It computes total output lines.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1038 | <code>- It prefixes truncated output with warning metadata.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1039 | <code>- Function output items can be truncated under policy while preserving non-text items.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1040 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1041 | <code>Claude Code output truncation and Bash output cap are also explicit.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1042 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1043 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1044 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1045 | <code>- `Mg6` capped output accumulator at byte offset `873217`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1046 | <code>- `GR6` Bash max output length at byte offset `7055797`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1047 | <code>- `L2` spill-to-disk output class at byte offset `7055988`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1048 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1049 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1050 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1051 | <code>- Truncated output explicitly says how many KB were removed.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1052 | <code>- Bash output limit is configurable/bounded.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1053 | <code>- Overflowed output can be saved to a path.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1054 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1055 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1056 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1057 | <code>AILIS every tool output should declare:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1058 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1059 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1060 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1061 | <code>  "complete": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1062 | <code>  "truncated": false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1063 | <code>  "reasoningReady": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1064 | <code>  "originalBytes": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1065 | <code>  "originalTokensApprox": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1066 | <code>  "previewBytes": 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1067 | <code>  "outputId": null,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1068 | <code>  "next": null</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1069 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1070 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1071 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1072 | <code>When truncated:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1073 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1074 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1075 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1076 | <code>  "complete": false,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1077 | <code>  "truncated": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1078 | <code>  "truncationReason": "model_output_budget",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1079 | <code>  "originalBytes": 620000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1080 | <code>  "originalTokensApprox": 155000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1081 | <code>  "previewBytes": 12000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1082 | <code>  "outputId": "out_...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1083 | <code>  "next": "Use output_search or output_read for targeted access."</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1084 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1085 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1086 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1087 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1088 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1089 | <code>Likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1090 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1091 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1092 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1093 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-gateway.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1094 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1095 | <code>Required behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1096 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1097 | <code>- Tool output adapter per tool family.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1098 | <code>- Explicit truncation metadata.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1099 | <code>- Complete vs preview distinction.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1100 | <code>- Output id for full retrieval.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1102 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1104 | <code>- Do not let truncation be invisible.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1105 | <code>- Do not use only `exitCode=0` as success.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1106 | <code>- Do not let "preview returned" mean "complete data read".</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1107 | <code>- Do not hide line/byte counts from the model.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1109 | <code>## 13. Agent Lab and Trace Separation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1111 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1113 | <code>Codex records tool lifecycle and context separately from model-visible output.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1115 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1117 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\registry.rs:300`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1118 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\registry.rs:345`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1119 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\mcp.rs:154`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1120 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs:323`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1121 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\context.rs:350`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1123 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1125 | <code>- Tool registry notifies tool start and finish.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1126 | <code>- Tool output has log preview, response item, code mode result, hook payloads.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1127 | <code>- MCP tool output includes wall time and truncation policy.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1129 | <code>Claude Code also separates runtime display from model result:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1131 | <code>- `L2` tracks full output, recent lines, total lines, total bytes, timeout, task id, overflow state.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1132 | <code>- UI rendering around Bash result uses full output and display-specific fields near byte offset `7218141`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1134 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1136 | <code>Agent Lab should show:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1138 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1139 | <code>full trace</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1140 | <code>full stdout/stderr</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1141 | <code>full artifact payload</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1142 | <code>tool timing</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1143 | <code>token usage</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1144 | <code>evidence graph</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1145 | <code>coverage graph</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1146 | <code>failure chain</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1147 | <code>model-visible preview</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1148 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1150 | <code>The model should see:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1152 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1153 | <code>compact observation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1154 | <code>tool status</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1155 | <code>counts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1156 | <code>evidence ids</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1157 | <code>query affordances</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1158 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1160 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1162 | <code>Likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1164 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-gateway.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1165 | <code>- `F:\AILIS_self_evolution_runtime\src\control-panel-app.js`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1166 | <code>- Agent Lab frontend components if split later.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1168 | <code>Required behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1170 | <code>- Keep trace storage rich.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1171 | <code>- Keep model prompt lean.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1172 | <code>- Make Agent Lab able to inspect full output/artifact via ids.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1173 | <code>- Show whether the model saw complete data or only preview.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1175 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1177 | <code>- Do not use the same string for UI trace and model observation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1178 | <code>- Do not compress Agent Lab raw traces just because model context must be compact.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1179 | <code>- Do not hide tool failure details behind friendly generic text.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1180 | <code>- Do not let later successful steps erase unresolved critical evidence failures.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1182 | <code>## 14. Data Worker / Artifact Compute</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1184 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1185 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1186 | <code>Claude Code uses dedicated tools and instructions for targeted reading and chunking. It does not rely on the model holding giant file contents in working memory.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1188 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1190 | <code>- `E96` file reader at byte offset `9632031`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1191 | <code>- `MTz` long-file instruction at byte offset `6816469`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1192 | <code>- `eEK` notebook/PDF/image/text routing at byte offset `9776413`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1194 | <code>Codex supports subagent/multi-agent tools and context-managed history, though the exact data-worker pattern is product-level and not a single source file in the inspected core.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1196 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1198 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\multi_agents.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1199 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\multi_agents_v2.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1200 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\context_manager\history.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1202 | <code>Confirmed boundary:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1204 | <code>- Codex has multi-agent/subagent infrastructure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1205 | <code>- Claude Code has chunked targeted read infrastructure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1206 | <code>- AILIS `artifact_compute` is an inferred architecture combining these observed patterns; it is not claimed as a copied named feature from either product.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1208 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1209 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1210 | <code>AILIS should add `artifact_compute` for deterministic or subagent-assisted analysis:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1212 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1213 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1214 | <code>  "artifactId": "ctx-spreadsheet-...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1215 | <code>  "task": "Find the path from START to END using color transition rules.",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1216 | <code>  "evidencePolicy": "return steps, cells used, and contradictions",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1217 | <code>  "maxOutputTokens": 2000</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1218 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1219 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1221 | <code>For spreadsheet/path/log/document tasks, the data worker can:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1222 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1223 | <code>- load full artifact payload outside main model context,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1224 | <code>- compute candidate answer,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1225 | <code>- return concise evidence,</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1226 | <code>- attach trace and payload references for Agent Lab.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1228 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1230 | <code>Likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1232 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-context-artifact-store.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1233 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1234 | <code>- new optional file: `F:\AILIS_self_evolution_runtime\electron\ailis-artifact-compute.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1236 | <code>Required behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1238 | <code>- Start with deterministic compute for spreadsheet grid/path/table queries.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1239 | <code>- Add subagent later only when deterministic compute is not enough.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1240 | <code>- Always return evidence ids and trace ids.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1242 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1244 | <code>- Do not ask the main model to memorize a 20x9 grid plus rules across many turns.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1245 | <code>- Do not hide data-worker reasoning; store it in Agent Lab trace.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1246 | <code>- Do not make `artifact_compute` one benchmark-specific solver only.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1247 | <code>- Do not prevent raw evidence inspection; provide controlled read/query access.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1248 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1249 | <code>## 15. Failure Observation Contract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1251 | <code>### Source evidence</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1253 | <code>Codex returns detailed errors to the model when exec fails at the runtime boundary.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1255 | <code>References:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1257 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\unified_exec\exec_command.rs:396`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1258 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\unified_exec\exec_command.rs:522`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1259 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\unified_exec\exec_command.rs:526`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1260 | <code>- `D:\Temp\codex-source-inspect\codex-rs\core\src\tools\handlers\unified_exec\exec_command.rs:530`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1262 | <code>Confirmed behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1264 | <code>- Runtime releases process id on open failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1265 | <code>- Sandbox denial output is converted into model-visible exec output.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1266 | <code>- Other failures include command display and error details.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1267 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1268 | <code>Claude Code Read errors are specific:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1269 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1270 | <code>- `FileTooLargeError` in `E96` at byte offset `9632031`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1271 | <code>- `MaxFileReadTokenExceededError` near Read schema at byte offset `9781964`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1272 | <code>- PDF too-many-pages errors in `eEK` at byte offset `9776413`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1274 | <code>### AILIS direction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1276 | <code>Every failure should be returned as reasoned structured observation:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1278 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1279 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1280 | <code>  "status": "failed",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1281 | <code>  "failureKind": "file_too_large",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1282 | <code>  "message": "File content exceeds maximum allowed size.",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1283 | <code>  "cause": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1284 | <code>    "sizeBytes": 620000,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1285 | <code>    "maxBytes": 131072</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1286 | <code>  },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1287 | <code>  "recoverable": true,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1288 | <code>  "recommendedNext": [</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1289 | <code>    {"tool": "read", "args": {"offsetLine": 1, "limitLines": 500}},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1290 | <code>    {"tool": "search", "args": {"pattern": "..."}}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1291 | <code>  ]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1292 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1293 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1295 | <code>### AILIS implementation target</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1297 | <code>Likely files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1299 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1300 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-tool-contracts.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1301 | <code>- `F:\AILIS_self_evolution_runtime\electron\ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1303 | <code>Required behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1305 | <code>- Standardize `failureKind`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1306 | <code>- Preserve raw error details in Agent Lab.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1307 | <code>- Give model repair actions.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1308 | <code>- Do not overwrite unresolved failures with later ordinary successes.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1310 | <code>### Do not do</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1312 | <code>- Do not return a fixed sentence for all tool failures.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1313 | <code>- Do not hide validation errors.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1314 | <code>- Do not make failures sound like success.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1315 | <code>- Do not classify failures with task-specific business rules.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1317 | <code>## 16. Recommended Implementation Order</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1319 | <code>### Phase 1: Stop the current failure loops</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1321 | <code>Source-backed modules:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1323 | <code>- Claude Code Read state/dedup.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1324 | <code>- Codex output metadata/truncation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1325 | <code>- Codex environment context.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1326 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1327 | <code>AILIS tasks:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1329 | <code>1. Add `runtime_environment` turn context.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1330 | <code>2. Ensure exec returns structured metadata and failure reasons.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1331 | <code>3. Add read/artifact state with `file_unchanged` and `evidence_already_available`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1332 | <code>4. Pin complete artifact observations and coverage.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1333 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1334 | <code>Expected effect:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1336 | <code>- Fewer Windows/Linux command mistakes.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1337 | <code>- Less repeated file/artifact reading.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1338 | <code>- More visible failure causes.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1339 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1340 | <code>### Phase 2: Make large data usable</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1341 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1342 | <code>Source-backed modules:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1344 | <code>- Claude Code chunked Read.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1345 | <code>- Claude Code PDF/page handling.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1346 | <code>- Codex truncation contract.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1347 | <code>- Codex unified exec output metadata.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1349 | <code>AILIS tasks:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1351 | <code>1. Complete Exec Output Store.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1352 | <code>2. Add text read ranges and search.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1353 | <code>3. Add artifact payload chunk/search/tail.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1354 | <code>4. Add `artifact_compute` for spreadsheet/log/document evidence.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1356 | <code>Expected effect:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1358 | <code>- Large logs and spreadsheets stop exploding context.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1359 | <code>- Model can retrieve only needed details.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1360 | <code>- Agent Lab can inspect full data.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1361 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1362 | <code>### Phase 3: Fix tool/MCP architecture</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1364 | <code>Source-backed modules:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1366 | <code>- Codex `McpHandler`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1367 | <code>- Codex `mcp_tool_exposure`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1368 | <code>- Codex `tool_search`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1369 | <code>- Codex progressive skills.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1370 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1371 | <code>AILIS tasks:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1372 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1373 | <code>1. Build `McpToolSpecRegistry`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1374 | <code>2. Convert MCP tools into direct model-visible tools.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1375 | <code>3. Keep large/niche tools deferred behind `tool_search`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1376 | <code>4. Split skill workflow docs from tool schema injection.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1378 | <code>Expected effect:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1379 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1380 | <code>- Fewer invalid MCP wrapper calls.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1381 | <code>- Tool discovery becomes natural.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1382 | <code>- Prompt size drops.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1383 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1384 | <code>### Phase 4: Make long tasks stable</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1385 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1386 | <code>Source-backed modules:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1388 | <code>- Codex context manager.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1389 | <code>- Codex rollout truncation.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1390 | <code>- Codex token usage tracking.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1391 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1392 | <code>AILIS tasks:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1394 | <code>1. Separate raw trace from model prompt history.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1395 | <code>2. Track token usage per round.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1396 | <code>3. Keep pinned evidence outside prompt compression.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1397 | <code>4. Add Agent Lab evidence graph and bottleneck view.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1398 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1399 | <code>Expected effect:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1400 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1401 | <code>- Long tasks stop degrading after many turns.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1402 | <code>- Debugging can show exactly what evidence was seen and what was only stored.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1403 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1404 | <code>## 17. Anti-Patterns to Avoid</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1406 | <code>These are explicitly against the inspected Codex/Claude Code design shape.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1408 | <code>&#124; Anti-pattern &#124; Why it is wrong &#124; Source-backed alternative &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1409 | <code>&#124;---&#124;---&#124;---&#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1410 | <code>&#124; Regex-convert Unix commands to PowerShell &#124; Brittle and hides environment from model &#124; Codex injects shell/cwd context and PowerShell tool guidance &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1411 | <code>&#124; Return only `exitCode=0` &#124; No evidence, no timing, no output state &#124; Codex returns wall time, exit code, session id, token count, output &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1412 | <code>&#124; Let generic read open XLSX/DOCX/PDF as text &#124; Binary/structured data becomes garbage/context explosion &#124; Claude Code routes images/PDF/notebooks specially and rejects unsupported binary &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1413 | <code>&#124; Expose all tools every turn &#124; Prompt bloat and worse tool choice &#124; Codex uses deferred MCP tools and BM25 `tool_search` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1414 | <code>&#124; Put tool schemas inside skill docs &#124; Duplicates contracts and bloats prompt &#124; Codex skills are progressive workflow packages &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1415 | <code>&#124; Treat raw transcript as model context &#124; Old huge observations pollute every turn &#124; Codex context manager normalizes and truncates history &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1416 | <code>&#124; Hide truncation &#124; Model reasons from incomplete data as if complete &#124; Codex and CC add explicit truncation warnings &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1417 | <code>&#124; Fatal-stop on one bad tool arg &#124; Model cannot repair recoverable mistakes &#124; Return structured validation error with expected schema &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1418 | <code>&#124; Hardcode GitHub/XLSX special failure classes &#124; Does not generalize and creates conflicts &#124; Generic failure/evidence/output contracts &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1419 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1420 | <code>## 18. Practical Acceptance Tests</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1421 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1422 | <code>These tests should be added before claiming the architecture is fixed.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1424 | <code>### Environment test</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1425 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1426 | <code>Prompt:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1427 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1428 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1429 | <code>Tell me the current shell and run a command that lists the first 3 files in the workspace.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1430 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1431 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1432 | <code>Expected:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1434 | <code>- Model uses correct shell syntax for the runtime environment.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1435 | <code>- Exec observation includes wall time, exit code, output preview, and output id if needed.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1436 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1437 | <code>### Large text test</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1439 | <code>Input:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1440 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1441 | <code>- A 500KB text file with answer in the middle.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1442 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1443 | <code>Expected:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1445 | <code>- Generic read does not dump entire file.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1446 | <code>- Model uses search/range or output tools.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1447 | <code>- Observation marks complete/truncated accurately.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1449 | <code>### XLSX artifact test</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1451 | <code>Input:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1453 | <code>- Previous GAIA-like XLSX map task.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1454 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1455 | <code>Expected:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1456 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1457 | <code>- `read_xlsx_workbook` creates artifact.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1458 | <code>- Model uses `artifact_query`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1459 | <code>- A complete grid pins evidence.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1460 | <code>- Repeated subrange query returns `evidence_already_available`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1461 | <code>- If reasoning remains complex, model uses `artifact_compute`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1462 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1463 | <code>### MCP discovery test</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1465 | <code>Prompt:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1467 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1468 | <code>Find a tool that can read a PDF and extract pages 3-5.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1469 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1470 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1471 | <code>Expected:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1472 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1473 | <code>- Model calls `tool_search`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1474 | <code>- PDF tool is loaded.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1475 | <code>- It does not call raw `mcp_bridge` unless debugging MCP.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1476 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1477 | <code>### Failure repair test</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1478 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1479 | <code>Prompt:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1480 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1481 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1482 | <code>Read a file larger than the single-read limit and answer a marker in the middle.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1483 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1484 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1485 | <code>Expected:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1486 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1487 | <code>- First oversized read returns specific failure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1488 | <code>- Model repairs with range/search.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1489 | <code>- Final answer cites evidence id or range.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1490 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1491 | <code>## 19. Summary Mapping</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1493 | <code>&#124; AILIS module &#124; Codex reference &#124; Claude Code reference &#124; Required AILIS behavior &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1494 | <code>&#124;---&#124;---&#124;---&#124;---&#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1495 | <code>&#124; `runtime_environment` &#124; `environment_context.rs`, `shell.rs` &#124; Bash/Read prompts assume explicit tool context &#124; Inject real cwd/shell/os every turn &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1496 | <code>&#124; `exec_command` &#124; `shell_spec.rs`, `unified_exec/*`, `tools/context.rs` &#124; Bash `GR6`, `L2`, `Mg6` &#124; Structured output + output store &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1497 | <code>&#124; `read` &#124; `context_manager/history.rs`, truncation helpers &#124; `RZY`, `E96`, `DH8`, `eEK` &#124; Range reads, line metadata, binary guards &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1498 | <code>&#124; `artifact_store` &#124; Codex output/truncation contracts &#124; CC special file routing &#124; Large structured data as queryable artifact &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1499 | <code>&#124; `evidence_gate` &#124; Context manager/token history &#124; Read state/dedup `jL6` &#124; Pin complete evidence, stop redundant reads &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1500 | <code>&#124; `tool_search` &#124; `tool_search.rs`, `tool_search_spec.rs` &#124; Not equivalent in CC bundle &#124; Deferred discoverable tools &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1501 | <code>&#124; `mcp_registry` &#124; `mcp.rs`, `mcp_tool_exposure.rs` &#124; MCP in CC not inspected deeply here &#124; Direct MCP-derived tools &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1502 | <code>&#124; `skills` &#124; `core-skills/render.rs`, `injection.rs` &#124; CC tool prompts separate from file readers &#124; Progressive workflow packages &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1503 | <code>&#124; `Agent Lab` &#124; Tool registry/lifecycle/context output separation &#124; Bash display/output state `L2` &#124; Full trace outside model prompt &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 1504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1505 | <code>## 20. Final Engineering Principle</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1506 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1507 | <code>The stable architecture is not "add more prompt rules". It is:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1508 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1509 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1510 | <code>Runtime owns environment, schemas, validation, output storage, evidence coverage, and context budgets.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1511 | <code>Model owns intent, planning, reasoning, and choosing the next action from accurate affordances.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1512 | <code>Agent Lab owns full observability.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1513 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1514 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1515 | <code>AILIS should move in that direction before adding more task-specific skills. Otherwise every new tool increases the chance of conflict, repeated reads, truncation loops, and hidden failures.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
