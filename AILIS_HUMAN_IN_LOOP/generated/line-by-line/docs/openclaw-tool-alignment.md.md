# docs/openclaw-tool-alignment.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：524
- SHA-256：`e96a43d7ab8ebaddb66b4f74eb5688bd06fc1cca5579e948b69ce63d2004efa5`
- 可运行副本：[打开源文件](../../../source/docs/openclaw-tool-alignment.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># OpenClaw 工具对齐清单</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>日期：2026-05-22</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>目标：把我们当前整理的工具基座，和 OpenClaw 真实使用的工具面做一次对齐。如果目标是做一个自己的 Claw，而不是做一套全新命名体系，那么最稳的路线就是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>- 先抄 OpenClaw 的工具命名、分组、策略层次。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>- 再按我们自己的 Gateway、前端、运行时，替换底层实现。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>## 结论先说</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>建议不要自己重新发明一套 `fs.read_text / browser.open / gmail.list_threads` 这种点式命名作为第一版主接口。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>第一版更稳的是直接采用 OpenClaw 这套风格：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>- `read`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>- `write`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>- `edit`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>- `apply_patch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>- `exec`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 21 | <code>- `process`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 22 | <code>- `web_search`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 23 | <code>- `web_fetch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>- `sessions_list`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 25 | <code>- `sessions_history`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>- `sessions_send`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- `sessions_spawn`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>- `sessions_yield`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>- `subagents`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>- `session_status`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 31 | <code>- `message`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 32 | <code>- `cron`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 33 | <code>- `gateway`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 34 | <code>- `nodes`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 35 | <code>- `agents_list`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>- `update_plan`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- `image`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- `image_generate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- `music_generate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- `video_generate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- `tts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>- `heartbeat_respond`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>这不是“照搬得很懒”，而是工程上更聪明：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>- 更容易复用 OpenClaw 的 prompt、policy、tool profile 思路。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 47 | <code>- 更容易兼容 OpenClaw 的 MCP / CLI / embedded runtime 经验。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 48 | <code>- 以后你想抄它的 agent prompt、tool policy、subagent 逻辑时，不会卡在接口命名不一致。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>## OpenClaw 真实工具面</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>最关键的来源是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>- [tool-catalog.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tool-catalog.ts#L1)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 55 | <code>- [pi-tools.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/pi-tools.ts#L620)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 56 | <code>- [openclaw-tools.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/openclaw-tools.ts#L1)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>- [tool-policy-pipeline.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tool-policy-pipeline.ts#L1)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>OpenClaw 不是一个“工具注册表 + 一堆散工具”这么简单，它是分层装配的：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 62 | <code>base coding tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>  + shell tools</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>  + channel tools</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 65 | <code>  + openclaw core tools</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 66 | <code>  + plugin tools</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 67 | <code>  + tool-search controls</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 68 | <code>  -&gt; tool policy pipeline</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>  -&gt; before_tool_call hook</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>也就是说，真正值得抄的不是单个工具实现，而是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>1. 工具名</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 75 | <code>2. 工具分组</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>3. 工具 profile</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>4. 工具 policy pipeline</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>5. 工具装配顺序</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>## OpenClaw 核心工具清单</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>### 1. 文件与运行时</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>来自 [tool-catalog.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tool-catalog.ts#L55)：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>- `read`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 87 | <code>- `write`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 88 | <code>- `edit`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 89 | <code>- `apply_patch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 90 | <code>- `exec`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 91 | <code>- `process`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>- `code_execution`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>这里有个很重要的设计判断：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>- OpenClaw 没把文件工具切成很多小名字。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 97 | <code>- 它偏向少数几个强工具，再用 schema 参数和 policy 控制行为。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>这意味着我们之前文档里写的：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>- `fs.read_text`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 102 | <code>- `fs.read_json`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>- `fs.list_dir`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 104 | <code>- `fs.glob`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 105 | <code>- `fs.stat`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>- `fs.write_file`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>更像内部 driver，而不应该是第一版对模型暴露的 tool surface。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>更稳的做法是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>- 对模型暴露 `read / write / edit / apply_patch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 113 | <code>- 在 Gateway 内部再拆成更细的文件系统驱动函数</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>### 2. Web 与搜索</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>来自 [tool-catalog.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tool-catalog.ts#L104) 和 [web-search.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/web-search.ts#L1)：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>- `web_search`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 120 | <code>- `web_fetch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 121 | <code>- `x_search`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>建议：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>- 第一版至少抄 `web_search` 和 `web_fetch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 126 | <code>- `x_search` 先作为可选插件工具</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>不要一开始做成：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>- `browser.search`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 131 | <code>- `http.fetch_page`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>OpenClaw 的命名更适合作为 agent 的通用工具语义。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>### 3. 会话与子 Agent</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>来自 [openclaw-tools.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/openclaw-tools.ts#L320) 和这些具体文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>- [sessions-list-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/sessions-list-tool.ts#L73)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 140 | <code>- [sessions-history-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/sessions-history-tool.ts#L188)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 141 | <code>- [sessions-send-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/sessions-send-tool.ts#L193)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 142 | <code>- [sessions-spawn-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/sessions-spawn-tool.ts#L269)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 143 | <code>- [sessions-yield-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/sessions-yield-tool.ts#L15)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 144 | <code>- [subagents-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/subagents-tool.ts#L36)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 145 | <code>- [session-status-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/session-status-tool.ts#L336)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>核心工具：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>- `sessions_list`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 150 | <code>- `sessions_history`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 151 | <code>- `sessions_send`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 152 | <code>- `sessions_spawn`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 153 | <code>- `sessions_yield`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 154 | <code>- `subagents`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 155 | <code>- `session_status`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>这是我们前一版基座文档里最缺的部分之一。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>对你自己的 Claw 来说，这一组应该是第一批一等公民，不是后补功能。因为你的产品方向本来就很像：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>- 桌宠前端</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 162 | <code>- Agent 编排</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 163 | <code>- 多会话 / 多子任务</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 164 | <code>- Gateway 中转</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>所以这组接口建议直接抄名字。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 168 | <code>### 4. 消息、自动化、控制</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 170 | <code>对应来源：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>- [message-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/message-tool.ts#L945)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 173 | <code>- [cron-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/cron-tool.ts#L493)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 174 | <code>- [gateway-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/gateway-tool.ts#L371)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 175 | <code>- [heartbeat-response-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/heartbeat-response-tool.ts#L41)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 176 | <code>- [update-plan-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/update-plan-tool.ts#L79)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 177 | <code>- [agents-list-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/agents-list-tool.ts#L36)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>核心工具：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>- `message`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 182 | <code>- `cron`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 183 | <code>- `gateway`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 184 | <code>- `heartbeat_respond`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 185 | <code>- `update_plan`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 186 | <code>- `agents_list`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>这里的关键不是单个工具有多复杂，而是 OpenClaw 把这些“编排动作”也看作工具，而不是私有 runtime API。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>这件事非常值得照抄。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>为什么：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>- 这样模型能显式表达“我要发消息”“我要更新计划”“我要创建定时任务”</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 195 | <code>- 这样审批、审计、回放、重试都能统一走 tool transcript</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 197 | <code>### 5. 设备 / 节点</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 199 | <code>来源：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 201 | <code>- [nodes-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/nodes-tool.ts#L137)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>工具名：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>- `nodes`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>OpenClaw 这里不是拆成十几个 `camera.snap / location.get / notifications.list` 工具，而是用一个多动作的 `nodes` 工具承载：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 209 | <code>- `status`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 210 | <code>- `describe`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 211 | <code>- `pending`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 212 | <code>- `approve`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 213 | <code>- `reject`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 214 | <code>- `notify`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 215 | <code>- `camera_snap`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 216 | <code>- `camera_list`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 217 | <code>- `camera_clip`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 218 | <code>- `photos_latest`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 219 | <code>- `screen_record`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 220 | <code>- `location_get`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 221 | <code>- `notifications_list`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 222 | <code>- `notifications_action`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 223 | <code>- `device_status`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 224 | <code>- `device_info`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 225 | <code>- `device_permissions`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 226 | <code>- `device_health`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 227 | <code>- `invoke`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 229 | <code>这也说明一个方向：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 230 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 231 | <code>- 对模型暴露的工具面，不一定要无限拆小</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 232 | <code>- 很多“同一域里的动作”，可以收进一个 umbrella tool</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 234 | <code>对你自己的 Claw，这很适合：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>- 桌宠 / 电脑 / 节点 / 手机 / 外设能力</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 237 | <code>- 都可以先挂进一个 `nodes` 统一入口</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>### 6. 媒体</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>来源：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>- [image-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/image-tool.ts#L508)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 244 | <code>- [image-generate-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/image-generate-tool.ts#L792)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 245 | <code>- [music-generate-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/music-generate-tool.ts#L599)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 246 | <code>- [video-generate-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/video-generate-tool.ts#L943)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 247 | <code>- [pdf-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/pdf-tool.ts#L323)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 248 | <code>- [tts-tool.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tools/tts-tool.ts#L62)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 250 | <code>核心工具：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>- `image`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 253 | <code>- `image_generate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 254 | <code>- `music_generate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 255 | <code>- `video_generate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 256 | <code>- `pdf`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 257 | <code>- `tts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 258 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 259 | <code>这组名字建议直接抄，尤其是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 261 | <code>- `image`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 262 | <code>- `image_generate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 263 | <code>- `tts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 265 | <code>因为它们很容易成为你视觉前端和桌宠形象系统的一部分。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>## OpenClaw 的工具 profile 和 group</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>这是最值得直接抄的一层。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>来源：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>- [tool-catalog.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tool-catalog.ts#L321)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 275 | <code>它内建这些 profile：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>- `minimal`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 278 | <code>- `coding`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 279 | <code>- `messaging`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 280 | <code>- `full`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 282 | <code>还内建这些 group：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 283 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 284 | <code>- `group:openclaw`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 285 | <code>- `group:fs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 286 | <code>- `group:runtime`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 287 | <code>- `group:web`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 288 | <code>- `group:memory`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 289 | <code>- `group:sessions`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 290 | <code>- `group:ui`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 291 | <code>- `group:messaging`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 292 | <code>- `group:automation`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 293 | <code>- `group:nodes`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 294 | <code>- `group:agents`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 295 | <code>- `group:media`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>这个设计很值钱，因为它直接解决了“怎么按场景裁工具”的问题。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>对你自己的 Claw，我建议直接抄：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 302 | <code>type ToolProfileId = "minimal" &#124; "coding" &#124; "messaging" &#124; "full";</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 303 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>然后也做一份 `CORE_TOOL_GROUPS`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 307 | <code>这样你以后就可以直接做：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 309 | <code>- 桌宠闲聊人格：`minimal`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 310 | <code>- 编程人格：`coding`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 311 | <code>- 聊天渠道人格：`messaging`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 312 | <code>- 管理员模式：`full`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 313 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 314 | <code>## OpenClaw 的运行时装配方式</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 316 | <code>来源：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>- [pi-tools.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/pi-tools.ts#L634)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>OpenClaw 并不是永远把所有工具都做出来，而是先算 construction plan：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>- `includeBaseCodingTools`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 323 | <code>- `includeShellTools`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 324 | <code>- `includeChannelTools`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 325 | <code>- `includeOpenClawTools`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 326 | <code>- `includePluginTools`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>然后再装配：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>1. `base coding tools`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 331 | <code>2. `apply_patch`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 332 | <code>3. `exec`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 333 | <code>4. `process`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 334 | <code>5. `channel tools`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 335 | <code>6. `openclaw core tools`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 336 | <code>7. `plugin tools`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 337 | <code>8. `tool search tools`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>这意味着我们自己的实现也最好有：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 341 | <code>```ts</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 342 | <code>type ToolConstructionPlan = {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 343 | <code>  includeBaseCodingTools: boolean;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 344 | <code>  includeShellTools: boolean;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 345 | <code>  includeChannelTools: boolean;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 346 | <code>  includeOpenClawTools: boolean;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 347 | <code>  includePluginTools: boolean;</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 348 | <code>};</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 349 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>不要一开始就写成一个固定的大数组。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>## OpenClaw 的策略层次</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 355 | <code>来源：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>- [tool-policy-pipeline.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/tool-policy-pipeline.ts#L1)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 358 | <code>- [pi-tools.policy.ts](https://github.com/openclaw/openclaw/blob/main/src/agents/pi-tools.policy.ts#L1)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 360 | <code>它的 policy 不是单层 allowlist，而是多层叠加：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 361 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 362 | <code>1. `profilePolicy`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 363 | <code>2. `providerProfilePolicy`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 364 | <code>3. `globalPolicy`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 365 | <code>4. `globalProviderPolicy`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 366 | <code>5. `agentPolicy`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 367 | <code>6. `agentProviderPolicy`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 368 | <code>7. `groupPolicy`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 369 | <code>8. `senderPolicy`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 370 | <code>9. `sandboxToolPolicy`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 371 | <code>10. `subagentPolicy`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 372 | <code>11. `inheritedToolPolicy`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>这点也值得直接抄。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>尤其是这几个概念：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 378 | <code>- `groupPolicy`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 379 | <code>- `senderPolicy`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 380 | <code>- `subagentPolicy`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 381 | <code>- `inheritedToolPolicy`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 382 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 383 | <code>它们对你这种“桌宠 + 多渠道 + 多子 Agent + Gateway”的系统特别有用。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 384 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 385 | <code>## 我们当前基座和 OpenClaw 的差异</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 387 | <code>### 1. 我们现在太“REST 风”</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>我们之前的文档更像：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 391 | <code>- `fs.read_text`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 392 | <code>- `fs.write_file`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 393 | <code>- `browser.open`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 394 | <code>- `gmail.list_threads`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 396 | <code>而 OpenClaw 更像：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 398 | <code>- `read`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 399 | <code>- `write`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 400 | <code>- `message`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 401 | <code>- `nodes`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 402 | <code>- `sessions_spawn`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 403 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 404 | <code>建议：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 406 | <code>- 对模型暴露层先对齐 OpenClaw 的扁平工具名</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 407 | <code>- 内部再保留你喜欢的模块化 driver</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 408 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 409 | <code>### 2. 我们把浏览器想得太细了</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 410 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 411 | <code>我们之前建议了：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 413 | <code>- `browser.open`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 414 | <code>- `browser.click`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 415 | <code>- `browser.type`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 416 | <code>- `browser.snapshot`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 418 | <code>OpenClaw 实际更偏：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 419 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 420 | <code>- `browser` 作为总工具</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 421 | <code>- 或直接作为 plugin / MCP 能力</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 423 | <code>建议：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 425 | <code>- 第一版不要急着把浏览器工具面定死</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 426 | <code>- 先把 `browser` 保留成 OpenClaw 兼容占位</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 427 | <code>- 底层可以继续用 Playwright MCP 或 Playwright CLI</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>### 3. 我们低估了会话工具的重要性</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>OpenClaw 把 `sessions_*` 和 `subagents` 放得很中心。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 432 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 433 | <code>这说明对你自己的 Claw：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 434 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 435 | <code>- 会话系统不是底层细节</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 436 | <code>- 它就是模型可见能力</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 437 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 438 | <code>### 4. 我们没把 `nodes` 当成一等公民</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 439 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 440 | <code>OpenClaw 的 `nodes` 很适合电脑、手机、设备、外设、通知、摄像头这些能力。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 441 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 442 | <code>你的 Claw 如果要做成一个真“桌宠操作系统”，`nodes` 很值得直接照抄。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 443 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 444 | <code>## 直接照抄的建议</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 445 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 446 | <code>### 第一批：建议原样抄名字</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 447 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 448 | <code>- `read`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 449 | <code>- `write`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 450 | <code>- `edit`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 451 | <code>- `apply_patch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 452 | <code>- `exec`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 453 | <code>- `process`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 454 | <code>- `web_search`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 455 | <code>- `web_fetch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 456 | <code>- `sessions_list`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 457 | <code>- `sessions_history`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 458 | <code>- `sessions_send`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 459 | <code>- `sessions_spawn`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 460 | <code>- `sessions_yield`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 461 | <code>- `subagents`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 462 | <code>- `session_status`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 463 | <code>- `message`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 464 | <code>- `cron`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 465 | <code>- `gateway`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 466 | <code>- `nodes`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 467 | <code>- `agents_list`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 468 | <code>- `update_plan`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 469 | <code>- `image`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 470 | <code>- `image_generate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 471 | <code>- `music_generate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 472 | <code>- `video_generate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 473 | <code>- `tts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 474 | <code>- `heartbeat_respond`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 475 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 476 | <code>### 第二批：建议保留兼容占位</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 477 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 478 | <code>- `browser`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 479 | <code>- `canvas`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 480 | <code>- `code_execution`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 481 | <code>- `x_search`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 482 | <code>- `memory_search`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 483 | <code>- `memory_get`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 484 | <code>- `pdf`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 485 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 486 | <code>这些可以先不做满，但工具名建议提前预留。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 488 | <code>### 第三批：OpenClaw MCP Bridge 也很值得抄</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 489 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 490 | <code>来源：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 491 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 492 | <code>- [channel-tools.ts](https://github.com/openclaw/openclaw/blob/main/src/mcp/channel-tools.ts#L14)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 494 | <code>它暴露了这批 MCP 工具：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 495 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 496 | <code>- `conversations_list`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 497 | <code>- `conversation_get`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 498 | <code>- `messages_read`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 499 | <code>- `attachments_fetch`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 500 | <code>- `events_poll`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 501 | <code>- `events_wait`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 502 | <code>- `messages_send`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 503 | <code>- `permissions_list_open`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 504 | <code>- `permissions_respond`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 506 | <code>如果你以后要把自己的 Gateway 也暴露成 MCP server，这一组可以直接拿来当第一版 MCP surface。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 508 | <code>## 最终建议</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 509 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 510 | <code>如果目标是“做一个自己的 OpenClaw 风格 Claw”，我的建议非常明确：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 511 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 512 | <code>1. 抄 OpenClaw 的工具名。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 513 | <code>2. 抄 OpenClaw 的 tool group 和 tool profile。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 514 | <code>3. 抄 OpenClaw 的 tool policy pipeline。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 515 | <code>4. 底层实现用你自己整理的这批 GitHub SDK 和 MCP server。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 516 | <code>5. 前端表现和视觉系统做成你自己的。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 518 | <code>也就是说：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 519 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 520 | <code>- `接口层` 尽量向 OpenClaw 对齐</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 521 | <code>- `实现层` 用我们调研过的标准件重做</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 522 | <code>- `UI/体验层` 完全做你自己的东西</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 523 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 524 | <code>这条路线比“另起一套工具命名体系”稳很多。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
