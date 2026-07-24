# docs/ailis-system-taskagent-architecture.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：166
- SHA-256：`f81b55f0b4e11a7f33ea3f5cd438522e2062cc23f03cc20fad846087634d21fd`
- 可运行副本：[打开源文件](../../../source/docs/ailis-system-taskagent-architecture.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`handoffTask`、`request`、`session`、`prior`、`task`、`fullResult`、`packet`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS System TaskAgent Architecture</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>## Goal</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>AILIS is the only user-facing persona. TaskAgent is the only task-execution agent. The Harness owns their transport, lifecycle, context budgets, and durable state.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>This removes the current topology in which Persona creates, names, waits for, resumes, and closes child agents. Persona makes one semantic choice: answer naturally or hand the exact user request to the system TaskAgent. No regex, keyword router, or task-type branch substitutes for that model decision.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>## Runtime Boundaries</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>&#124; Lane &#124; Owner &#124; Model visibility &#124; Durable form &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 12 | <code>&#124; --- &#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 13 | <code>&#124; Persona identity, relationship, preferences &#124; AILIS &#124; Persona only &#124; Memory/profile store &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 14 | <code>&#124; Visible conversation &#124; Desktop chat &#124; Persona; compact excerpts only when needed elsewhere &#124; Chat history &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 15 | <code>&#124; Current user task request &#124; Harness &#124; Persona and TaskAgent &#124; Task record &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 16 | <code>&#124; Task working context &#124; TaskAgent &#124; TaskAgent only &#124; Context-manager checkpoint &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 17 | <code>&#124; Tool observations &#124; TaskAgent &#124; TaskAgent budgeted view &#124; Transcript/output store &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 18 | <code>&#124; Evidence and sources &#124; TaskAgent &#124; TaskAgent; compact result packet to Persona &#124; Evidence Manifest/source refs &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 19 | <code>&#124; Generated artifacts &#124; TaskAgent &#124; References to Persona &#124; Output refs/artifact store &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 20 | <code>&#124; Final presentation &#124; AILIS &#124; User-visible &#124; Persona surface/chat record &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>## Call Flow</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 25 | <code>user message</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>    -&gt; AILIS Persona turn</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>        -&gt; ordinary conversation: assistant message -&gt; Persona surface -&gt; user</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>        -&gt; task execution: handoff_task({ message: exact user text, continuation })</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>            -&gt; SystemTaskAgentHarness</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>                -&gt; resolve lifecycle from durable task state</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>                -&gt; run or resume the single system TaskAgent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>                -&gt; compact full execution into TaskResultPacket</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>            -&gt; handoff_task result observation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>        -&gt; AILIS renders TaskResultPacket -&gt; Persona surface -&gt; user</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>The handoff call blocks until the current TaskAgent turn reaches a result boundary. Persona does not call `wait_agent`, read a mailbox, create another agent, or decide how to resume a checkpoint.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>## Contracts</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>### PersonaToTaskAgentHandoff</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 44 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>  message: string,                  // exact current user request; required</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>  continuation?: 'auto' &#124; 'continue' &#124; 'new'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>`continuation` is a semantic hint from the model, not a regex-derived decision. `auto` continues only an unfinished task; `continue` may resume the most recent checkpoint; `new` starts clean. The Harness validates this enum but never rewrites `message`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>### TaskRecord</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 55 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 56 | <code>  taskId: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 57 | <code>  sessionId: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>  originalGoal: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 59 | <code>  latestRequest: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 60 | <code>  status: 'running' &#124; 'completed' &#124; 'incomplete' &#124; 'failed' &#124; 'interrupted',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>  childSessionId: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 62 | <code>  latestRunId: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>  checkpoint: object &#124; null,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 64 | <code>  evidenceRefs: string[],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>  outputRefs: string[],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 66 | <code>  sourceRefs: SourceRef[],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 67 | <code>  unresolvedFields: string[],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 68 | <code>  createdAt: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 69 | <code>  updatedAt: string</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 70 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>### TaskResultPacket</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 76 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>  schema: 'ailis.task_result.v1',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>  task_id: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>  status: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>  original_goal: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>  current_request: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>  final_answer: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>  partial_answer: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>  source_refs: SourceRef[],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>  evidence_refs: string[],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>  output_refs: string[],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>  unresolved_fields: string[],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 88 | <code>  trace_ref: string,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 89 | <code>  checkpoint_available: boolean</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 91 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>Only this compact packet returns to Persona. `steps`, raw tool outputs, hidden reasoning, full checkpoints, and internal mailbox state remain outside Persona context.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>## Harness Pseudocode</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 98 | <code>async function handoffTask(input, turnContext) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 99 | <code>  assertStrictSchema(input)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>  const request = input.message // preserve verbatim</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 101 | <code>  const session = loadSessionTaskState(turnContext.sessionId)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>  if (session.inFlight) {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>    enqueueIntoTaskAgentInput(session.taskId, request)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>    return await session.inFlight</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 106 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>  const prior = selectPriorTaskByLifecycleHint(session, input.continuation)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>  const task = prior ? resumeTaskRecord(prior, request) : createTaskRecord(request)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>  persist(task)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>  const fullResult = await executeTaskAgent({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>    stableTaskId: task.taskId,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>    originalUserGoal: task.originalGoal,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>    message: request,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>    inheritanceMode: prior?.checkpoint ? 'checkpoint' : 'clean',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>    checkpoint: prior?.checkpoint,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>    maxAgentSteps: 4</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>  })</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>  const packet = buildTaskResultPacket(fullResult, task)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>  persistTaskCheckpointAndRefs(task, fullResult)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 123 | <code>  savePublicResultCapsule(packet)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 124 | <code>  return packet</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 125 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 126 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>`selectPriorTaskByLifecycleHint` is lifecycle logic only. It does not inspect task text. Semantic continuity comes from the model-provided enum; `auto` uses deterministic status (`unfinished` versus `completed`) rather than keyword matching.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>## Persona Prompt Invariants</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>1. Keep ordinary conversation direct and natural.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>2. For concrete task execution, call `handoff_task` once with the user's actual request.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>3. Do not invent a broader task, stricter evidence requirement, task name, or subtask plan in the handoff.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 135 | <code>4. Treat `TaskResultPacket` as the factual boundary. Rephrase tone, but never add unsupported names, numbers, quotes, links, or conclusions.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 136 | <code>5. Never expose TaskAgent, Harness, tool protocol, checkpoint, trace, or internal status markup to the user.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>6. Dynamic facts without fresh evidence go through TaskAgent instead of being guessed from pretrained memory.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>## TaskAgent Prompt Invariants</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>1. `original_user_goal` remains authoritative across resumed turns.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>2. `delegated_task` is the exact current user request and may refine but not erase the original goal.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>3. Use tools and evidence naturally; the model decides whether evidence is sufficient.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 144 | <code>4. Stop with the best supported result when the evidence is reasonable; safety budgets are fuses, not semantic completion rules.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>5. Return a result boundary with answer, unresolved fields, Evidence Manifest, Output Refs, source refs, and checkpoint.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>## Migration Steps</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>1. Add `SystemTaskAgentHarness` and a strict `handoff_task` tool.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>2. Change Persona's direct tool surface to only `handoff_task`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>3. Hide legacy `spawn_agent`, `followup_task`, `wait_agent`, `list_agents`, and `close_agent` from all model-visible surfaces.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 152 | <code>4. Keep legacy classes temporarily loadable for transcript compatibility, but remove them from the active execution path.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>5. Cap Persona's loop as a safety fuse; keep TaskAgent's four-round budget unchanged.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 154 | <code>6. Replace old spawn/mailbox tests with handoff, continuation, result-boundary, and context-isolation tests.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 156 | <code>## Acceptance Tests</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>- Ordinary chat produces no TaskAgent run.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 159 | <code>- One task request produces exactly one Harness handoff and one TaskAgent run.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 160 | <code>- Persona cannot call legacy collaboration tools because they are absent from its tool array.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 161 | <code>- TaskAgent cannot call Persona handoff or legacy collaboration tools.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 162 | <code>- The exact current user request and original goal arrive unchanged in TaskAgent context.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 163 | <code>- A completed result returns to Persona without raw steps, tool logs, or checkpoint payload.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 164 | <code>- An unfinished follow-up resumes the saved checkpoint; `new` starts clean.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 165 | <code>- Concurrent follow-up input is queued into the existing TaskAgent turn instead of spawning another TaskAgent.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 166 | <code>- Persona output contains no DSML, tool-call markup, internal JSON, or unsupported factual additions.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
