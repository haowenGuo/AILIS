# docs/ailis-agent-runner-v0.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。
- 文件类型：`documentation`
- 原始行数：81
- SHA-256：`9971f47153fe8ab662c59bc2a200e5db2ed8961fe76f67a493483be5d3fb8464`
- 可运行副本：[打开源文件](../../../source/docs/ailis-agent-runner-v0.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Agent Runner v0</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>AILIS Agent Runner v0 是 AILIS 对话系统和 Gateway 工具面的统一中间层。所有用户输入都会先进入 Agent Loop 做识别：如果是情感/日常对话，转回 AILIS 原对话系统；如果是任务执行，才进入 AILIS 任务执行 Agent。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Runtime Path</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 8 | <code>AILIS Chat</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>  -&gt; window.ailisDesktop.gateway.runAgent()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>  -&gt; AILIS Agent Loop classifyOnly</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>  -&gt; conversation: AILIS Companion Chat Service</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>  -&gt; task: AILISGateway.runAgent()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>  -&gt; AILISTaskAgent / Tool planning</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>  -&gt; AILISGateway.callTool()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>  -&gt; OpenClaw-style tools</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>HTTP 入口：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 21 | <code>POST http://127.0.0.1:19777/agent/run</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>RPC 入口：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 27 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>  "method": "agent.run",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>  "params": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>    "sessionId": "main",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>    "message": "读取 package.json"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>## Supported v0 Commands</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 39 | <code>你好</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>我今天有点累</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>读取 package.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>/read package.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>/write tmp/note.txt hello</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>抓取 https://example.com/</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>/tool read {"path":"package.json"}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>/exec pnpm build</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>Runner 返回里会包含：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 52 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>  "mode": "conversation &#124; task",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 54 | <code>  "intent": "emotional_chat &#124; casual_chat &#124; read_file &#124; write_file &#124; ...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>  "executionRequired": true</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>`mode=conversation` 时不会调用工具，前端会把消息交回 AILIS Companion Chat Service，保留原本的人设、记忆、动作、表情和语音链路。`mode=task` 时才进入任务执行 Agent；只有 `plan.steps` 非空时才会进入 Gateway 工具执行。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>`exec` 会走 Gateway 安全策略。没有 `context.approved=true` 时会返回 `needs_approval`，不会直接执行。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>## Acceptance</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 66 | <code>pnpm test:ailis-agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>pnpm ailis:smoke-agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>pnpm ailis:validate-gateway</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>pnpm build</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>当前验收覆盖：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>- 对话消息进入 Agent Runner。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>- Runner 能用 `classifyOnly` 区分 conversation/task。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>- conversation 由 AILIS Companion Chat Service 处理。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>- Runner 能处理 emotional_chat/read/write/exec。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 78 | <code>- read/write 通过 Gateway 调用真实工具完成。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 79 | <code>- exec 未确认时被拦截为 `needs_approval`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 80 | <code>- `/agent/run` 和 RPC `agent.run` 都可用。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 81 | <code>- Agent run 写入 audit log。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
