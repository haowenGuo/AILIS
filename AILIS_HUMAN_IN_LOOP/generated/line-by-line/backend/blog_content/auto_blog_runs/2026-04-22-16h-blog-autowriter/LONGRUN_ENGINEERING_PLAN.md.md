# backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/LONGRUN_ENGINEERING_PLAN.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`documentation`
- 原始行数：42
- SHA-256：`b1da4ad2704406e7a0bb32376f01306fb5de3862c41bacc1085790ef9529b162`
- 可运行副本：[打开源文件](../../../../../../source/backend/blog_content/auto_blog_runs/2026-04-22-16h-blog-autowriter/LONGRUN_ENGINEERING_PLAN.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># LongRun Engineering Plan</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>This run follows the `auto-longrun-task` architecture.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## Layers</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>1. LongRun Controller: `scripts/auto_blog_runner.py`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>2. Codex Execution Adapter: `codex.cmd exec` launched by the controller</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 9 | <code>3. Conversation Projector: heartbeat reads durable files and reports progress</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>## Durable Files</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>- `mission.md`: long-running task goal</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>- `acceptance.md`: completion and verification contract</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>- `loop-policy.json`: duration, cadence, retry, and stop policy</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 16 | <code>- `state.json`: local controller projection, not committed</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 17 | <code>- `progress.json`: heartbeat-first progress projection, not committed</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 18 | <code>- `control-queue.jsonl`: local pause/stop/report commands, not committed</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 19 | <code>- `event-log.jsonl`: append-only local event source, not committed</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>## Replanned Control Flow</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>1. Read control queue and stop flag.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>2. If pending commits exist, retry publishing before writing anything new.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>3. Start exactly one Codex writing iteration.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>4. Validate `posts.json`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>5. Commit only allowed blog artifacts.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>6. Add the commit to `pendingCommits`.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>7. Publish pending commits in order through the main worktree.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>8. Clear `pendingCommits` only after successful push.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 31 | <code>9. Classify failures and record events before retrying.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>## Failure Policy</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>- `environment_failed`: network, GitHub, permission, or missing tool failures</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 36 | <code>- `merge_failed`: cherry-pick, conflict, or dirty publishing worktree failures</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 37 | <code>- `schema_failed`: invalid JSON or malformed structured files</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 38 | <code>- `runtime_failed`: Codex worker timeout, crash, or non-zero exit</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- `orchestration_failed`: lock, queue, resume, or state machine issues</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- `verifier_failed`: acceptance checks fail</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>The controller should retry the smallest failing layer. It should not generate a new article while a previous publish commit is still pending.</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
