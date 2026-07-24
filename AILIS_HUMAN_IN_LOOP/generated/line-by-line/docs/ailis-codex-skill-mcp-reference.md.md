# docs/ailis-codex-skill-mcp-reference.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。
- 文件类型：`documentation`
- 原始行数：785
- SHA-256：`6484d2be9d0e376ec8deac7be49dd9ab5ca2c9b6a8c2858be5227d4ff3efacc7`
- 可运行副本：[打开源文件](../../../source/docs/ailis-codex-skill-mcp-reference.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`spec`、`validateAgainstSchema`、`validateToolContract`、`before`、`callable`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Codex-Aligned Skill and MCP Reference</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>Last updated: 2026-06-05</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>This document is the working reference for aligning AILIS's Skill and MCP layers with the local Codex implementation. It is intentionally source-backed: every architectural claim below points to local Codex source files under `F:\AILIS\build-cache\codex-runtime`, with short code excerpts and AILIS-side mapping notes.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>The goal is not to copy Codex line-for-line. The goal is to copy the engineering shape:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>- Skills are progressive instruction packages, not always-on prompt piles.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>- MCP servers are Host-managed tool providers, not model-driven magic bridges.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>- Tool schemas are discovered, cached, exposed, searched, validated, and called by Runtime.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>- The model chooses intent and next action, while Runtime owns connection, schema, validation, approval, execution, and recovery observations.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>## 1. Layer Model</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>Codex separates the system into these layers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>&#124; Layer &#124; Codex role &#124; Executes work &#124; AILIS target &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 19 | <code>&#124;---&#124;---&#124;---:&#124;---&#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 20 | <code>&#124; Skill &#124; File-based workflow instructions in `SKILL.md` &#124; No &#124; Persona-aware capability instructions &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 21 | <code>&#124; Plugin &#124; Bundle of skills, MCP configs, apps, hooks &#124; No direct task execution &#124; Installable capability bundle &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 22 | <code>&#124; MCP Server &#124; External tool provider over stdio/HTTP &#124; Yes &#124; Local/remote tool service &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 23 | <code>&#124; MCP Client/Manager &#124; Host-owned connection and session manager &#124; Yes &#124; Stable `McpConnectionManager` equivalent &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 24 | <code>&#124; ToolSpec &#124; Model-visible callable function/schema &#124; No, contract only &#124; Direct tool exposure instead of one giant bridge &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 25 | <code>&#124; Tool Search &#124; Deferred discovery over hidden tool metadata &#124; Yes, discovery only &#124; Avoid first-turn prompt bloat &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 26 | <code>&#124; Runtime Tool Handler &#124; Deterministic validation and dispatch &#124; Yes &#124; Validate before calling MCP/tool &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>Codex's core pattern:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 31 | <code>User task</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code> -&gt; Codex turn builder</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code> -&gt; skill/plugin injection</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code> -&gt; MCP connection manager lists tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code> -&gt; MCP tools become ToolSpec</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code> -&gt; too many tools become deferred search entries</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code> -&gt; model calls visible tool</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code> -&gt; runtime validates and dispatches</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code> -&gt; observation returns to model</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>AILIS should keep the same engineering pattern, then add the embodied/persona surface above the final user-facing output.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>## 2. Skill Design</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>### 2.1 Codex Skill is a `SKILL.md` package</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>Codex treats a skill as local instructions stored in a `SKILL.md` file. The user-facing skill system in this Codex session is generated from the same pattern.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\render.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 53 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\loader.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>Short source excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 58 | <code>const SKILLS_FILENAME: &amp;str = "SKILL.md";</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 62 | <code>pub async fn load_skills_from_roots&lt;I&gt;(roots: I) -&gt; SkillLoadOutcome</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>Actual Codex behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>- A skill is discovered from filesystem roots.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 68 | <code>- The skill list shown to the model contains name, description, and path.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>- The full skill body is not the whole system prompt by default.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>- The model opens the skill body only when it decides the skill applies.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>AILIS current mapping:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>- AILIS already has file-based skills in `F:\AILIS\electron\skills\&lt;skill_id&gt;\SKILL.md`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>- AILIS loader is in `F:\AILIS\electron\ailis-skills.cjs`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>- Current skill IDs include `vision`, `computer`, `email`, `file_manager`, `code`, `mcp_bridge`, `capability_manager`, `self_debugger`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>AILIS adjustment rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>- Keep the folder shape.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 81 | <code>- Do not put all skill bodies into first-turn context.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 82 | <code>- First-turn context should contain skill catalog only: `id`, short description, path, available capability tags.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 83 | <code>- Full `SKILL.md` should be injected only after model mention, task match, or tool-search-like discovery.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>### 2.2 Codex uses progressive disclosure</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>Codex explicitly tells the model to open only what it needs.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\render.rs:31`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\render.rs:33`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\render.rs:34`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>Short source excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 98 | <code>open its `SKILL.md`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 102 | <code>load only the specific files needed</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 103 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 106 | <code>prefer running or patching them</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>Actual Codex behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>- The model sees a small skill catalog.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 112 | <code>- If it needs a skill, it opens `SKILL.md`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 113 | <code>- If `SKILL.md` points to `references/`, it reads only the needed reference.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 114 | <code>- If `scripts/` exist, the model should use scripts rather than reinventing fragile logic.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>AILIS adjustment rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>- AILIS skills should become packages:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 121 | <code>electron/skills/research/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>  SKILL.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>  scripts/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>  references/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>  assets/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>- `SKILL.md` should describe when to use the skill, available tools, evidence boundaries, and failure recovery.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 129 | <code>- Repeated fragile procedures should become scripts or MCP tools.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 130 | <code>- Do not turn skills into route regex or hardcoded task classifiers.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>### 2.3 Codex skill loader supports metadata and fail-open behavior</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>Codex parses optional metadata but does not let optional metadata break `SKILL.md` loading.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\loader.rs:704`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 139 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\loader.rs:705`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 140 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\loader.rs:760`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>Short source excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 145 | <code>return LoadedSkillMetadata::default();</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 148 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 149 | <code>LoadedSkillMetadata {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>Actual Codex behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>- Metadata is useful but optional.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 155 | <code>- Bad optional metadata does not block the skill body.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 156 | <code>- Skill identity includes resolved path and plugin provenance.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>AILIS adjustment rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>- Add optional `agents/openai.yaml` or equivalent metadata later, but keep `SKILL.md` as the durable source.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 161 | <code>- Skill load errors should be warnings unless the core skill itself is unreadable.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 162 | <code>- Skill catalog should carry provenance: builtin, user-installed, plugin-installed, generated-by-capability-installer.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>## 3. MCP Server Model</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>### 3.1 Codex supports stdio and streamable HTTP MCP transports</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 168 | <code>MCP Server is a tool service. It can be a local process or a remote HTTP service.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 170 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\config\src\mcp_types.rs:425`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 173 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\config\src\mcp_types.rs:438`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>Short source excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 178 | <code>Stdio {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 179 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 182 | <code>StreamableHttp {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 183 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>Actual Codex behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>- A stdio MCP server is launched with command/args/env/cwd.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 188 | <code>- An HTTP MCP server is configured with URL and auth/header options.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 189 | <code>- The config parser rejects invalid mixed transport fields.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>AILIS current mapping:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>- AILIS already has stdio and HTTP MCP support through `mcp_bridge`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 194 | <code>- AILIS's local research server is `F:\AILIS\scripts\mcp-ailis-research-server.cjs`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>AILIS adjustment rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>- Treat MCP as a Host-owned connection registry.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 199 | <code>- Store transport config in an AILIS-local config directory under the app root, not scattered ad hoc.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 200 | <code>- Validate transport config deterministically before the model sees the server.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>### 3.2 Codex owns the MCP connection manager</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>Codex does not ask the model to manually run MCP protocol commands. Runtime owns clients and sessions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 208 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:171`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 209 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:372`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 210 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:590`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 212 | <code>Short source excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 214 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 215 | <code>pub async fn new(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 216 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 219 | <code>pub async fn list_all_tools(&amp;self)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 220 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 223 | <code>pub async fn call_tool(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 224 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 226 | <code>Actual Codex behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>- On startup/turn setup, Codex creates or holds MCP clients.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 229 | <code>- It aggregates tools from all clients.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 230 | <code>- It calls a selected MCP tool by server/tool pair.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 231 | <code>- It tracks startup failures and server metadata.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>AILIS current mapping:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>- AILIS has `executeMcpBridge` in `F:\AILIS\electron\ailis-runtime.cjs`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 236 | <code>- It exposes actions like `list_servers`, `list_tools`, `read_resource`, `call_tool`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 237 | <code>- Current issue: the model often sees one indirect `mcp_bridge` tool and must discover server/tool/schema itself.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>AILIS adjustment rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>- Keep `mcp_bridge` for diagnostics/admin.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 242 | <code>- For normal task execution, generate direct model-visible tool specs from MCP tools.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 243 | <code>- Example target: expose `mcp__ailis_research__web_fetch(url)` as the canonical model-facing id, while still accepting legacy `mcp:ailis_research:web_fetch` as a compatibility alias, instead of asking the model to call `mcp_bridge.call_tool(server, tool, args)`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>## 4. MCP Tool Exposure</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 247 | <code>### 4.1 Codex converts MCP tools into model-visible ToolSpecs</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 248 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 249 | <code>Codex wraps each MCP `ToolInfo` in a handler and creates a model-visible tool spec.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 253 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:29`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 254 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:36`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 255 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:191`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>Short source excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 258 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 259 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 260 | <code>pub struct McpHandler {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 261 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 264 | <code>let spec = create_tool_spec(&amp;tool_info)?;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 265 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 268 | <code>fn create_tool_spec(tool_info: &amp;ToolInfo)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 269 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>Actual Codex behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>- MCP tool schema becomes a callable tool schema.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 274 | <code>- The model can call the tool directly.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 275 | <code>- Runtime still knows which MCP server/tool the call maps to.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>AILIS adjustment rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>- Build `McpToolSpecRegistry`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 280 | <code>- Each discovered MCP tool should get:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 282 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 283 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 284 | <code>  "id": "mcp__ailis_research__web_fetch",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 285 | <code>  "legacy_id": "mcp:ailis_research:web_fetch",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 286 | <code>  "name": "mcp__ailis_research__web_fetch",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 287 | <code>  "server": "ailis_research",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 288 | <code>  "tool": "web_fetch",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 289 | <code>  "inputSchema": {},</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 290 | <code>  "description": "",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 291 | <code>  "risk": "low",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 292 | <code>  "provenance": "mcp"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 293 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 294 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 296 | <code>- Model should not need to invent `server`, `tool`, and nested `args` for common MCP calls.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 298 | <code>### 4.2 Codex has direct and deferred MCP tools</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 300 | <code>Codex does not always expose every MCP tool in the first turn.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 302 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs:10`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 305 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs:13`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 306 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs:14`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 307 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs:36`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 309 | <code>Short source excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 311 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 312 | <code>DIRECT_MCP_TOOL_EXPOSURE_THRESHOLD: usize = 100;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 313 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 315 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 316 | <code>direct_tools: Vec&lt;McpToolInfo&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 317 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 319 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 320 | <code>deferred_tools: Option&lt;Vec&lt;McpToolInfo&gt;&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 321 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 323 | <code>Actual Codex behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 324 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 325 | <code>- If MCP tool count is manageable, tools can be directly exposed.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 326 | <code>- If too many tools or feature flag requires it, tools become deferred.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 327 | <code>- Deferred tools are not lost; they are available through tool search.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 329 | <code>AILIS adjustment rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 330 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 331 | <code>- Do not put the entire `tool_contracts` and all MCP schemas into the first prompt.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 332 | <code>- First-turn visible set should be small:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 333 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 334 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 335 | <code>computer/read/write/edit/apply_patch/exec as core</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 336 | <code>tool_search or capability_search</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 337 | <code>maybe current-task obvious tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 338 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 339 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 340 | <code>- Everything else should be discoverable by search.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 341 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 342 | <code>### 4.3 Codex tool search discovers deferred tools</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 344 | <code>Codex uses `tool_search` over deferred metadata. This is a key solution to prompt bloat.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 345 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 346 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 347 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 348 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search_spec.rs:50`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 349 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:23`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 350 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:112`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 351 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:225`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>Short source excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 355 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 356 | <code>pub struct ToolSearchHandler {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 357 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 358 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 359 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 360 | <code>fn search(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 361 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 363 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 364 | <code>fn build_mcp_search_text(info: &amp;ToolInfo)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 365 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 366 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 367 | <code>Actual Codex behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 368 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 369 | <code>- Deferred tool metadata is indexed.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 370 | <code>- The model calls `tool_search` with a query.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 371 | <code>- Matching tools become available in the next model call.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 372 | <code>- MCP search text includes tool name, description, and schema property names.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>AILIS adjustment rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>- Add `capability_search` or reuse `tool_search` concept.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 377 | <code>- Search entries should include:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 378 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 379 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 380 | <code>tool name</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 381 | <code>server/plugin/source</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 382 | <code>description</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 383 | <code>schema property names</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 384 | <code>risk/approval summary</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 385 | <code>related skill id</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 386 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 388 | <code>- A paper task should let the model search `paper pdf arxiv fetch text`, exposing `web_fetch`, `pdf_extract_text`, `web_extract_links`, not a hardcoded arXiv route.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 389 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 390 | <code>## 5. Turn Construction</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 391 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 392 | <code>### 5.1 Codex builds skill/plugin injections before tool router</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 394 | <code>Codex turn setup collects skill/plugin context and MCP tool exposure as part of turn construction.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 396 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 398 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs:170`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 399 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs:457`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 400 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs:1059`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 401 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs:1121`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 402 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 403 | <code>Short source excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 404 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 405 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 406 | <code>build_skills_and_plugins(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 407 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 408 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 409 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 410 | <code>list_all_tools()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 411 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 413 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 414 | <code>build_mcp_tool_exposure(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 415 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 417 | <code>Actual Codex behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 419 | <code>- Skill/plugin injection is separate from MCP tool listing.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 420 | <code>- Tool exposure is decided at turn build time.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 421 | <code>- `direct_tools` and `deferred_tools` are passed into the router.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 423 | <code>AILIS current mapping:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 425 | <code>- AILIS has `AGENT_SKILL_CATALOG` and `AGENT_TOOL_CATALOG` in `ailis-agent-runner.cjs`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 426 | <code>- AILIS can build skill context with `buildAILISSkillContextText`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 427 | <code>- AILIS currently appends tool contracts inside skill context:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>- `F:\AILIS\electron\ailis-skills.cjs:217`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 432 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 433 | <code>Short AILIS excerpt:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 434 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 435 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 436 | <code>sections.push(buildToolContractsPrompt(tools));</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 437 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 439 | <code>AILIS adjustment rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 440 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 441 | <code>- Separate skill body from tool contract injection.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 442 | <code>- Skill says "which tool family is relevant".</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 443 | <code>- Runtime/tool router decides which concrete schemas to expose.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 444 | <code>- Tool schemas should be direct/deferred, not glued into every loaded skill.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 445 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 446 | <code>## 6. Plugin as Bundle</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 447 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 448 | <code>### 6.1 Codex plugin can bundle skills and MCP servers</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 449 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 450 | <code>Codex plugin manifests include paths to skills and MCP server configs.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 451 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 452 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 453 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 454 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-plugins\src\manifest.rs:26`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 455 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-plugins\src\manifest.rs:28`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 456 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-plugins\src\manifest.rs:48`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 457 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-plugins\src\manifest.rs:50`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 459 | <code>Short source excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 462 | <code>skills: Option&lt;String&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 463 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 465 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 466 | <code>mcp_servers: Option&lt;String&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 467 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 469 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 470 | <code>pub mcp_servers: Option&lt;AbsolutePathBuf&gt;,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 471 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 472 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 473 | <code>Actual Codex behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 474 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 475 | <code>- A plugin can contribute skill folders.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 476 | <code>- A plugin can contribute MCP configs.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 477 | <code>- A plugin can contribute app connectors/hooks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 478 | <code>- Plugin provenance is carried into loaded skills and MCP servers.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 479 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 480 | <code>AILIS adjustment rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 482 | <code>- AILIS capability installer should install bundles, not just random tools:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 483 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 484 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 485 | <code>capability/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 486 | <code>  plugin.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 487 | <code>  skills/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 488 | <code>  mcpServers/.mcp.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 489 | <code>  scripts/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 490 | <code>  tests/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 491 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 493 | <code>- Installing GitHub capability should install:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 494 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 495 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 496 | <code>GitHub MCP server config</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 497 | <code>GitHub SKILL.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 498 | <code>health check recipe</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 499 | <code>eval smoke task</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 500 | <code>rollback metadata</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 501 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 502 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 503 | <code>### 6.2 Codex plugin loader normalizes MCP config and skill roots</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 505 | <code>Codex loader resolves plugin skill roots and MCP server config files.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 506 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 507 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 508 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 509 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-plugins\src\loader.rs:47`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 510 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-plugins\src\loader.rs:49`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 511 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-plugins\src\loader.rs:567`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 512 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-plugins\src\loader.rs:580`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 513 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-plugins\src\loader.rs:996`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 514 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 515 | <code>Short source excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 517 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 518 | <code>DEFAULT_SKILLS_DIR_NAME: &amp;str = "skills";</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 519 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 521 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 522 | <code>DEFAULT_MCP_CONFIG_FILE: &amp;str = ".mcp.json";</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 523 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 525 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 526 | <code>load_mcp_servers_from_file(</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 527 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 528 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 529 | <code>Actual Codex behavior:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 530 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 531 | <code>- Default skill folder is `skills`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 532 | <code>- Default MCP config file is `.mcp.json`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 533 | <code>- Plugin loader resolves config paths relative to plugin root.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 534 | <code>- Duplicate MCP server names are detected/warned.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 536 | <code>AILIS adjustment rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 537 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 538 | <code>- Make AILIS capabilities installable in the same structure.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 539 | <code>- Do not require future skills/MCP servers to be manually wired in code.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 540 | <code>- Capability registry should be built from installed bundle metadata plus live health checks.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 541 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 542 | <code>## 7. Schema and Validation</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 543 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 544 | <code>### 7.1 Codex schema is deterministic runtime data, not model judgment</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 545 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 546 | <code>Codex converts MCP input schema into tool specs. Validation is handled by tool calling/runtime, not by asking the model to decide if args are valid.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 547 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 548 | <code>Codex source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 549 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 550 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:229`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 551 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:191`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 552 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 553 | <code>Short source excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 554 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 555 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 556 | <code>.input_schema</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 557 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 558 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 559 | <code>```rust</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 560 | <code>create_tool_spec(tool_info)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 561 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 562 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 563 | <code>AILIS current mapping:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 564 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 565 | <code>- AILIS has deterministic contract validation in `F:\AILIS\electron\ailis-tool-contracts.cjs`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 566 | <code>- Validation function:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 568 | <code>Source:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 569 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 570 | <code>- `F:\AILIS\electron\ailis-tool-contracts.cjs:1036`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 571 | <code>- `F:\AILIS\electron\ailis-tool-contracts.cjs:1206`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 572 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 573 | <code>Short AILIS excerpts:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 575 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 576 | <code>function validateAgainstSchema(value, schema = {}, path = '$') {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 577 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 578 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 579 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 580 | <code>function validateToolContract(toolId, args = {}) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 581 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 582 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 583 | <code>Current AILIS problem:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 584 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 585 | <code>- `mcp_bridge` validates its own wrapper args.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 586 | <code>- It does not make each MCP tool schema first-class before the model calls it.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 587 | <code>- That caused the Pro smoke failure where the model passed `targets` to `web_fetch`, while `web_fetch` required `url`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 588 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 589 | <code>AILIS adjustment rule:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 591 | <code>- Import MCP `inputSchema` into AILIS's tool registry.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 592 | <code>- Validate against the actual MCP tool schema before dispatch.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 593 | <code>- If validation fails, return a concise observation:</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 594 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 595 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 596 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 597 | <code>  "status": "invalid_tool_args",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 598 | <code>  "tool": "ailis_research.web_fetch",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 599 | <code>  "errors": ["$.url is required"],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 600 | <code>  "expected_schema": {"required": ["url"]}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 601 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 602 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 603 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 604 | <code>- Let the model repair the next action. Do not terminate the task purely because one tool call had invalid args.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 605 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 606 | <code>## 8. AILIS Current State vs Codex Reference</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 607 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 608 | <code>&#124; Area &#124; AILIS today &#124; Codex reference &#124; Alignment target &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 609 | <code>&#124;---&#124;---&#124;---&#124;---&#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 610 | <code>&#124; Skill files &#124; `electron/skills/*/SKILL.md` exists &#124; `core-skills` loads `SKILL.md` roots &#124; Keep, add progressive disclosure &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 611 | <code>&#124; Skill context &#124; Skill can append full tool contracts &#124; Skill catalog first, body on demand &#124; Split skill body and schema injection &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 612 | <code>&#124; MCP entry &#124; `mcp_bridge` general-purpose wrapper &#124; MCP tools become ToolSpecs &#124; Generate direct MCP tool specs &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 613 | <code>&#124; MCP discovery &#124; Model often calls `list_servers/list_tools` &#124; Runtime lists all tools &#124; Runtime owns discovery/cache &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 614 | <code>&#124; Tool exposure &#124; Many tool contracts can enter prompt &#124; direct/deferred exposure &#124; Add deferred tool search &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 615 | <code>&#124; Plugin bundle &#124; Capability manager exists but not Codex-shaped &#124; plugin manifest can bundle skills/MCP &#124; Installable capability bundle &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 616 | <code>&#124; Schema validation &#124; Local schema validator exists &#124; schema converted to ToolSpec &#124; Validate actual MCP tool schema &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 617 | <code>&#124; Error recovery &#124; Some failures surface as generic uncertainty &#124; observation lets model repair &#124; Return actionable observation and continue &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 618 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 619 | <code>## 9. Concrete AILIS Refactor Plan</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 620 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 621 | <code>This is the minimal, non-rewrite path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 622 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 623 | <code>### Step 1: Add `McpToolSpecRegistry`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 624 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 625 | <code>Purpose:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 626 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 627 | <code>- Connect existing MCP servers.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 628 | <code>- Call `tools/list`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 629 | <code>- Cache `server/tool/inputSchema/description`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 630 | <code>- Normalize each into AILIS internal tool spec.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 631 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 632 | <code>Codex anchor:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 633 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 634 | <code>- `connection_manager.rs:list_all_tools`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 635 | <code>- `mcp.rs:create_tool_spec`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 636 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 637 | <code>AILIS target files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 638 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 639 | <code>- `F:\AILIS\electron\ailis-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 640 | <code>- new optional file: `F:\AILIS\electron\ailis-mcp-tool-registry.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 641 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 642 | <code>### Step 2: Expose direct MCP tools for normal execution</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 643 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 644 | <code>Purpose:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 645 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 646 | <code>- Model sees `ailis_research.web_fetch(url)` or equivalent.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 647 | <code>- `mcp_bridge` remains for admin/debug.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 648 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 649 | <code>Codex anchor:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 650 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 651 | <code>- `mcp_tool_exposure.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 652 | <code>- `turn.rs:build_mcp_tool_exposure`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 653 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 654 | <code>AILIS target files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 655 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 656 | <code>- `F:\AILIS\electron\ailis-agent-runner.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 657 | <code>- `F:\AILIS\electron\ailis-tool-contracts.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 658 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 659 | <code>### Step 3: Add deferred `tool_search`</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 660 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 661 | <code>Purpose:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 662 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 663 | <code>- Keep first prompt small.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 664 | <code>- Let the model discover relevant tools by semantic query.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 665 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 666 | <code>Codex anchor:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 667 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 668 | <code>- `tool_search.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 669 | <code>- `tool_search_spec.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 670 | <code>- `mcp.rs:build_mcp_search_text`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 672 | <code>AILIS target:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 674 | <code>- `tool_search` runtime tool or `capability_search` extension.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 675 | <code>- Search index over tool names, descriptions, schema keys, skill tags.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 676 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 677 | <code>### Step 4: Split skill context from tool schema context</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 678 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 679 | <code>Purpose:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 680 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 681 | <code>- Skill explains workflow.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 682 | <code>- Tool registry exposes schema.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 683 | <code>- Avoid repeating heavy contracts inside skill text.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 684 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 685 | <code>Codex anchor:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 686 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 687 | <code>- `render.rs` progressive disclosure rules.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 688 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 689 | <code>AILIS target file:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 690 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 691 | <code>- `F:\AILIS\electron\ailis-skills.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 692 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 693 | <code>Specific adjustment:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 694 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 695 | <code>- `buildAILISSkillContextText(skillId)` should return skill body only.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 696 | <code>- A separate `buildRelevantToolSchemaContext(toolIds)` should handle schemas.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 697 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 698 | <code>### Step 5: Convert capabilities into plugin-like bundles</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 700 | <code>Purpose:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 701 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 702 | <code>- Installing a capability installs MCP config, skill docs, health checks, eval cases, and rollback metadata together.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 703 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 704 | <code>Codex anchor:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 705 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 706 | <code>- `core-plugins/src/manifest.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 707 | <code>- `core-plugins/src/loader.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 708 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 709 | <code>AILIS target:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 710 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 711 | <code>- `capability_manager`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 712 | <code>- `Capability Registry`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 713 | <code>- `Capability Installer`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 714 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 715 | <code>## 10. Design Rules for Future AILIS Changes</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 716 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 717 | <code>These rules should gate future Skill/MCP edits.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 718 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 719 | <code>1. Do not add hardcoded task routes when a skill/tool description can teach the model.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 720 | <code>2. Do not put every schema in the first prompt.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 721 | <code>3. Do not ask the model to manually discover MCP servers unless the user is debugging MCP.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 722 | <code>4. Do not make `mcp_bridge` the primary task-execution interface.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 723 | <code>5. Do not let one invalid tool call end a complex task.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 724 | <code>6. Do not treat HTTP success as evidence quality success.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 725 | <code>7. Do expose MCP tools as first-class callable specs when useful.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 726 | <code>8. Do keep skill bodies small and procedural.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 727 | <code>9. Do move fragile repeated operations into scripts or MCP tools.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 728 | <code>10. Do preserve AILIS's persona surface above the engineering runtime.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 729 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 730 | <code>## 11. Paper Task Failure Reinterpreted with This Reference</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 731 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 732 | <code>The arXiv paper task exposed exactly the Codex-alignment gap.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 733 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 734 | <code>Observed AILIS chain:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 735 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 736 | <code>- Model first called `mcp_bridge.call_tool` without `server`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 737 | <code>- Runtime reported multiple servers configured.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 738 | <code>- Model recovered and listed servers.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 739 | <code>- Model then called `ailis_research.web_fetch` with `targets`, but schema required `url`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 740 | <code>- Model recovered and fetched the abstract page.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 741 | <code>- Model fetched PDF URL with `web_fetch`, which returned raw PDF bytes.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 742 | <code>- Model wrote a file anyway.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 743 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 744 | <code>Codex-aligned interpretation:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 745 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 746 | <code>- `web_fetch` should have been directly visible as `web_fetch(url)`, or found through `tool_search`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 747 | <code>- PDF should have had a separate `pdf_extract_text(url&#124;path)` tool spec.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 748 | <code>- `web_fetch` should reject `application/pdf` with a structured error like `unsupported_pdf_use_pdf_extract_text`.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 749 | <code>- Runtime should return repairable observations, not generic "evidence missing" prose.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 750 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 751 | <code>This is mainly a Host/tool-exposure/tool-boundary issue, not a reason to add a hardcoded arXiv route.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 752 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 753 | <code>## 12. Source Index</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 754 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 755 | <code>Codex Skill sources:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 756 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 757 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\render.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 758 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\loader.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 759 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\model.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 760 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\injection.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 761 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-skills\src\manager.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 762 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 763 | <code>Codex MCP sources:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 764 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 765 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 766 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\mcp\mod.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 767 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\config\src\mcp_types.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 768 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 769 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 770 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 771 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search_spec.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 772 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\session\turn.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 773 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 774 | <code>Codex Plugin sources:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 775 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 776 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-plugins\src\manifest.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 777 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core-plugins\src\loader.rs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 778 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 779 | <code>AILIS comparison sources:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 780 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 781 | <code>- `F:\AILIS\electron\ailis-skills.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 782 | <code>- `F:\AILIS\electron\ailis-runtime.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 783 | <code>- `F:\AILIS\electron\ailis-tool-contracts.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 784 | <code>- `F:\AILIS\electron\skills\mcp_bridge\SKILL.md`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 785 | <code>- `F:\AILIS\scripts\mcp-ailis-research-server.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
