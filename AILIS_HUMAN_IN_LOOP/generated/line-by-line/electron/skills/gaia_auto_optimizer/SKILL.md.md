# electron/skills/gaia_auto_optimizer/SKILL.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`documentation`
- 原始行数：65
- SHA-256：`5afcbb7106f3e869610e8d6aa8dac4bb7bc23f56d2edfce4b54018dcbc77b740`
- 可运行副本：[打开源文件](../../../../../source/electron/skills/gaia_auto_optimizer/SKILL.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 2 | <code>id: gaia_auto_optimizer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 3 | <code>label: GAIA Auto Optimizer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>description: Use GAIA/GIAI tasks as the continuous self-evolution benchmark for AILIS; run one task per iteration, extract the execution chain, classify success/failure, and prefer generalized Tools/MCP fixes before Agent/Harness fixes.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 5 | <code>when: 用户要求基于 GAIA/GIAI 自动迭代优化、持续提升 AILIS 任务执行能力、分析任务链路、降低 LOOP 轮次、修复 Tools/MCP/Agent/Harness 瓶颈时。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>tools:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 7 | <code>  - self_evolution</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 8 | <code>  - tool_search</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 9 | <code>  - mcp_bridge</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>triggers:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>  - GAIA</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>  - GIAI</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>  - 自动优化</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>  - 自动迭代</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>  - 执行链路</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>---</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code># GAIA Auto Optimizer</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>This skill defines the default optimization policy for AILIS self-evolution work driven by GAIA/GIAI tasks.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>## Core Policy</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>- Run exactly one GAIA/GIAI task per optimization iteration unless the user explicitly asks for a batch.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>- After every task, extract the execution chain before changing code: prompt, tool discovery, tool calls, MCP calls, observations, loop guards, finalization, answer gate, score/verdict.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 25 | <code>- If the task succeeds, optimize efficiency: reduce loop count, remove redundant tool calls, improve per-turn evidence use, and keep the exact-answer path reliable.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>- If the task fails, mark it as a priority repair item and classify the bottleneck before patching.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- Prefer generalized fixes. Do not hard-code task IDs, answers, URLs, names, or one-off heuristics.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>- Optimize Tools and MCP first. Modify Agent or Harness only when the chain shows a general orchestration, stopping, schema, finalization, or evaluation issue.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 29 | <code>- Every repair must include a regression test or replay artifact that protects the generalized capability.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>## Failure Classification</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>Use these classes before repair:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>- `tools_mcp`: parser, fetcher, document reader, spreadsheet reader, PDF/audio/image/tool schema, MCP registration, or tool result contract issue.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>- `web_retrieval_mcp`: web_search/web_fetch ranking, extraction, JS shell, anti-bot, content quality, or source-followup issue.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- `agent_architecture`: wrong tool choice, failure to stop after ready evidence, repeated loops, tool_search misuse, or ignoring recovery hints.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- `harness_finalization`: answer gate, exact-answer extraction, scorer integration, transcript linkage, or artifact provenance issue.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- `environment`: missing credentials, missing dataset, network, local service unavailable, rate limit, process timeout.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- `model_reasoning`: evidence was sufficient and accessible, but the model reasoned incorrectly.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>## Repair Order</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>1. Reproduce or replay the failing task with durable artifacts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>2. Extract the chain and label the first irreversible wrong turn.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>3. Patch the smallest generalized layer.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>4. Run focused tests for that layer.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>5. Re-run the same GAIA/GIAI task.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>6. If it succeeds, measure loop count and redundant calls; optimize efficiency only if it will not reduce reliability.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>7. Move to the next queued task only after recording the verdict and repair notes.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>## Long-Run Artifacts</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>Use `longrun/jobs/ailis-gaia-auto-optimizer/` as the durable job root unless the user chooses another path. Required files:</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>- `mission.md`: optimization objective.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>- `acceptance.md`: completion criteria.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 58 | <code>- `loop-policy.json`: iteration, retry, source, and stop policy.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 59 | <code>- `event-log.jsonl`: append-only history.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>- `progress.json`: heartbeat/projector status.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>- `iterations/iter-*/chain.json`: extracted execution chain.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>- `iterations/iter-*/verdict.json`: pass/fail, failure class, next action.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>- `iterations/iter-*/repair-ticket.md`: generalized repair request when needed.</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>Never store secrets in these artifacts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
