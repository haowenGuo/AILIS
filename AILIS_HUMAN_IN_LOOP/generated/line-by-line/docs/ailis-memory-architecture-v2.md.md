# docs/ailis-memory-architecture-v2.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：1037
- SHA-256：`1a58193fbec8d0bd2958eaa17aa6b923dd2273269e762fe75592fb6dca277925`
- 可运行副本：[打开源文件](../../../source/docs/ailis-memory-architecture-v2.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`memoryContext`、`response`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Memory Architecture V2</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>## 0. 设计结论</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>AILIS 的记忆系统建议做成一套 **Persona Memory Runtime**，而不是普通的 RAG 数据库。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>它的目标是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>- 像 Letta / MemGPT 一样有稳定的核心记忆块，长期保存“用户是谁、AILIS 是谁、两人的关系、项目是什么”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 10 | <code>- 像 Generative Agents 一样把日常互动写成 memory stream，并通过重要性、相关性、近期性持续反思。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 11 | <code>- 像 Codex 一样用后台两阶段任务做记忆提取和整合，避免每轮对话被记忆维护拖慢。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 12 | <code>- 像 Claude Code 一样把项目记忆做成明确、可读、可编辑的项目上下文文件。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 13 | <code>- 面向私人助手，允许保存隐私和密钥，但 secret 必须分区、加密、按需注入，不混进普通 prompt。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 14 | <code>- 好感度作为内部 0-100 游戏数值，影响语气、主动性、表情、动作和亲近感，但不能影响基础帮助能力和安全规则。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>一句话：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 19 | <code>底层是工程化记忆系统，表层是 AILIS 逐渐更了解用户。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>## 1. 参考源码与映射</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>### 1.1 Letta / MemGPT</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>本地源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 29 | <code>F:\AILIS\build-cache\memory-references\letta-memgpt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>重点参考：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>&#124; AILIS 模块 &#124; Letta 参考 &#124; 借鉴点 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 35 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 36 | <code>&#124; Core Memory Blocks &#124; `F:\AILIS\build-cache\memory-references\letta-memgpt\letta\schemas\memory.py` &#124; `Memory` / `ChatMemory` / block compile &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 37 | <code>&#124; Block schema &#124; `F:\AILIS\build-cache\memory-references\letta-memgpt\letta\schemas\block.py` &#124; block label、value、limit、metadata &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 38 | <code>&#124; Block manager &#124; `F:\AILIS\build-cache\memory-references\letta-memgpt\letta\services\block_manager.py` &#124; create/list/update/bulk update &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 39 | <code>&#124; Memory tools &#124; `F:\AILIS\build-cache\memory-references\letta-memgpt\letta\functions\function_sets\base.py` &#124; `core_memory_append`、`core_memory_replace`、`memory_insert`、`memory_replace` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 40 | <code>&#124; Archival memory &#124; `F:\AILIS\build-cache\memory-references\letta-memgpt\letta\services\archive_manager.py` &#124; archive/passages/embedding &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 41 | <code>&#124; Passage manager &#124; `F:\AILIS\build-cache\memory-references\letta-memgpt\letta\services\passage_manager.py` &#124; passage CRUD、向量/SQL 双层 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 42 | <code>&#124; System rebuild &#124; `F:\AILIS\build-cache\memory-references\letta-memgpt\letta\agents\letta_agent_v2.py` &#124; 回复前重建 system + memory context &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 43 | <code>&#124; Sleeptime memory &#124; `F:\AILIS\build-cache\memory-references\letta-memgpt\letta\groups\sleeptime_multi_agent_v4.py` &#124; 后台记忆整理 agent &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>对 AILIS 的结论：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>- 不要把长期记忆全塞进 prompt。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 48 | <code>- 要有几个固定 block：`persona`、`user`、`relationship`、`project`、`secrets_index`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>- 修改核心记忆时要用精确 patch/insert/replace，不要让模型整段重写。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 50 | <code>- 大量历史、截图、对话、项目事件放 archival memory，不直接作为核心记忆。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>### 1.2 Generative Agents</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>本地源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 57 | <code>F:\AILIS\build-cache\memory-references\generative_agents</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>重点参考：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>&#124; AILIS 模块 &#124; Generative Agents 参考 &#124; 借鉴点 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 63 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 64 | <code>&#124; Memory Stream &#124; `F:\AILIS\build-cache\memory-references\generative_agents\reverie\backend_server\persona\memory_structures\associative_memory.py` &#124; `ConceptNode`、event/thought/chat、poignancy &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 65 | <code>&#124; Scratch state &#124; `F:\AILIS\build-cache\memory-references\generative_agents\reverie\backend_server\persona\memory_structures\scratch.py` &#124; recency/relevance/importance 权重、reflection trigger &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 66 | <code>&#124; Retrieval &#124; `F:\AILIS\build-cache\memory-references\generative_agents\reverie\backend_server\persona\cognitive_modules\retrieve.py` &#124; recency + relevance + importance 综合排序 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 67 | <code>&#124; Reflection &#124; `F:\AILIS\build-cache\memory-references\generative_agents\reverie\backend_server\persona\cognitive_modules\reflect.py` &#124; 重要性累计触发反思，反思生成 thought &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 68 | <code>&#124; Prompts &#124; `F:\AILIS\build-cache\memory-references\generative_agents\reverie\backend_server\persona\prompt_template\v3_ChatGPT` &#124; poignancy、relationship summary、insight/evidence &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>对 AILIS 的结论：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>- 每次互动不是直接变长期记忆，而是先进 memory stream。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 73 | <code>- 每条 memory event 要有 `importance`，对应 Generative Agents 的 `poignancy`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 74 | <code>- 检索不只看语义相关，还要看近期性和重要性。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>- 反思不是每轮对话都跑，而是重要性累计到阈值后后台跑。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>- 反思结果应该写成更稳定的 `thought` / `insight`，再更新核心 block。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>### 1.3 Codex</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>本地源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 83 | <code>F:\AILIS\build-cache\codex-runtime</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>重点参考：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>&#124; AILIS 模块 &#124; Codex 参考 &#124; 借鉴点 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 89 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 90 | <code>&#124; Memory pipeline docs &#124; `F:\AILIS\build-cache\codex-runtime\codex-rs\memories\README.md` &#124; Phase 1 per-thread extraction + Phase 2 global consolidation &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 91 | <code>&#124; Stage 1 &#124; `F:\AILIS\build-cache\codex-runtime\codex-rs\memories\write\src\phase1.rs` &#124; claim jobs、structured output、raw_memory、rollout_summary &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 92 | <code>&#124; Stage 2 &#124; `F:\AILIS\build-cache\codex-runtime\codex-rs\memories\write\src\phase2.rs` &#124; global lock、workspace diff、consolidation agent、heartbeat &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 93 | <code>&#124; Read path &#124; `F:\AILIS\build-cache\codex-runtime\codex-rs\memories\read\src\prompts.rs` &#124; 只注入 `memory_summary.md`，大内容按需查 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 94 | <code>&#124; App server memory APIs &#124; `F:\AILIS\build-cache\codex-runtime\codex-rs\app-server\README.md` &#124; `thread/memoryMode/set`、`memory/reset`、compaction events &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>对 AILIS 的结论：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>- 记忆写入要后台异步，不阻塞人物说话。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 99 | <code>- 记忆提取和长期整合分两阶段。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 100 | <code>- 整合任务必须有锁、租约、失败重试和状态恢复。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 101 | <code>- 回复前只注入短 summary，不要把整个记忆库塞进上下文。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 102 | <code>- 需要 `memory/reset`、单会话禁用记忆、线程级记忆开关。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>### 1.4 Claude Code</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>Claude Code 不是开源项目，所以不能直接复制源码，只能参考官方设计。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>可参考的机制：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>- `CLAUDE.md` 项目记忆。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 111 | <code>- user/project/local 多层 memory。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 112 | <code>- 自动发现项目上下文。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 113 | <code>- `/memory` 交互式编辑。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 114 | <code>- 对话压缩/compact。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 115 | <code>- “记忆是上下文，不是权限系统”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>对 AILIS 的结论：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>- 项目记忆应有一个人类可读文件，例如 `project.md`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 120 | <code>- 用户可以直接让 AILIS “记住/忘掉/修改某条记忆”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 121 | <code>- 工程项目上下文和拟人关系记忆要分开。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 122 | <code>- 控制面板里要能看见、编辑、删除记忆。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>## 2. 总体架构</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>```mermaid</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 127 | <code>flowchart TD</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 128 | <code>  A["Chat / Voice / Vision / Tool Result"] --&gt; B["Turn Recorder"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>  B --&gt; C["Memory Stream Writer"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>  C --&gt; D["Memory Event Store"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>  D --&gt; E["Importance Scorer"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>  E --&gt; F["Memory Curator"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 133 | <code>  F --&gt; G["Core Memory Blocks"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>  F --&gt; H["Archival Memory Passages"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 135 | <code>  F --&gt; I["Daily Notes"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 136 | <code>  F --&gt; J["Affinity Manager"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 137 | <code>  G --&gt; K["Context Compiler"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 138 | <code>  H --&gt; L["Memory Retriever"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 139 | <code>  I --&gt; M["Reflection Scheduler"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 140 | <code>  D --&gt; M</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>  M --&gt; N["Reflection Worker"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 142 | <code>  N --&gt; G</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>  N --&gt; H</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 144 | <code>  N --&gt; J</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>  K --&gt; O["Agent Loop"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>  L --&gt; K</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>  J --&gt; K</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>  P["Secret Vault"] --&gt; K</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>  P --&gt; Q["Tool Runtime"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>核心分层：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 155 | <code>交互层：聊天、语音、视觉、工具结果</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 156 | <code>事件层：所有发生过的事，append-only</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 157 | <code>记忆层：核心 blocks + archival passages + daily notes</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 158 | <code>反思层：后台整理、冲突合并、晋升长期记忆</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 159 | <code>上下文层：每次回复前编译少量高价值记忆</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 160 | <code>关系层：好感度、熟悉度、信任、语气偏好</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>隐私层：密钥、账号、私人信息</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 162 | <code>控制层：查看、编辑、删除、导出、重置</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 165 | <code>## 3. 本地目录设计</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>默认目录放在 AILIS 状态目录下：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 170 | <code>F:\AILIS\.ailis-state\memory\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>  memory.sqlite</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 172 | <code>  memory.sqlite-wal</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 173 | <code>  capsules\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>    persona.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 175 | <code>    user.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 176 | <code>    relationship.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 177 | <code>    project.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 178 | <code>    affinity.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 179 | <code>    secrets_index.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>  daily\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 181 | <code>    2026-05-28.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 182 | <code>  reflections\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 183 | <code>    DREAMS.md</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 184 | <code>    2026-05-28.jsonl</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 185 | <code>  archives\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 186 | <code>    passages\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 187 | <code>    attachments\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 188 | <code>      vision\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>      audio\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 190 | <code>      files\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>  exports\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 192 | <code>  backups\</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 193 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 195 | <code>为什么 SQLite + Markdown 混合：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 197 | <code>- SQLite 可靠保存结构化事件、检索、状态、事务和迁移。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 198 | <code>- Markdown 适合像 Claude Code / Codex 那样直接给模型读，也适合用户查看。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 199 | <code>- capsule 文件是“模型每轮能看的一小段”，不是完整数据库。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 201 | <code>## 4. 数据模型</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>### 4.1 memory_events</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>对应 Generative Agents 的 memory stream。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>```sql</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 208 | <code>CREATE TABLE memory_events (</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 209 | <code>  id TEXT PRIMARY KEY,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 210 | <code>  session_id TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 211 | <code>  turn_id TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 212 | <code>  source TEXT NOT NULL,          -- chat &#124; voice &#124; vision &#124; tool &#124; system</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 213 | <code>  role TEXT NOT NULL,            -- user &#124; assistant &#124; tool &#124; system</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 214 | <code>  kind TEXT NOT NULL,            -- event &#124; thought &#124; chat &#124; task &#124; correction &#124; preference</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 215 | <code>  content TEXT NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 216 | <code>  summary TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 217 | <code>  keywords_json TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 218 | <code>  importance REAL DEFAULT 0.0,   -- 0-1, maps to poignancy</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 219 | <code>  emotional_weight REAL DEFAULT 0.0, -- -1 to 1</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 220 | <code>  privacy_level TEXT DEFAULT 'private', -- normal &#124; private &#124; secret</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 221 | <code>  created_at TEXT NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 222 | <code>  expires_at TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 223 | <code>  evidence_ref TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 224 | <code>  status TEXT DEFAULT 'active'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 225 | <code>);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 226 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>### 4.2 memory_blocks</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 230 | <code>对应 Letta core memory blocks。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 232 | <code>```sql</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 233 | <code>CREATE TABLE memory_blocks (</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>  key TEXT PRIMARY KEY,          -- persona &#124; user &#124; relationship &#124; project &#124; affinity &#124; secrets_index</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 235 | <code>  title TEXT NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 236 | <code>  content TEXT NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 237 | <code>  token_budget INTEGER NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 238 | <code>  version INTEGER DEFAULT 1,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 239 | <code>  source_event_ids_json TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 240 | <code>  updated_at TEXT NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 241 | <code>  status TEXT DEFAULT 'active'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 242 | <code>);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 243 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>核心 blocks：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 247 | <code>&#124; Block &#124; 作用 &#124; 默认预算 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 248 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 249 | <code>&#124; `persona` &#124; AILIS 的人设、说话边界、拟人表达原则 &#124; 600-1000 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 250 | <code>&#124; `user` &#124; 用户稳定偏好、工作方式、禁忌点 &#124; 800-1200 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 251 | <code>&#124; `relationship` &#124; 相处方式、语气、关系状态摘要 &#124; 300-600 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 252 | <code>&#124; `project` &#124; AILISCLAW 项目决策、模块状态、当前路线 &#124; 1000-1800 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 253 | <code>&#124; `affinity` &#124; 好感度解释、当前行为档位，不写过多历史 &#124; 150-300 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 254 | <code>&#124; `secrets_index` &#124; 有哪些 secret，可用名字，不含明文 &#124; 150-300 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>### 4.3 memory_passages</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 258 | <code>对应 Letta archival memory。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 260 | <code>```sql</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 261 | <code>CREATE TABLE memory_passages (</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 262 | <code>  id TEXT PRIMARY KEY,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 263 | <code>  archive TEXT NOT NULL,         -- user &#124; project &#124; relationship &#124; vision &#124; voice &#124; tool</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 264 | <code>  content TEXT NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 265 | <code>  summary TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 266 | <code>  tags_json TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 267 | <code>  embedding BLOB,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 268 | <code>  importance REAL DEFAULT 0.0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 269 | <code>  confidence REAL DEFAULT 0.5,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 270 | <code>  source_event_ids_json TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 271 | <code>  created_at TEXT NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 272 | <code>  last_used_at TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 273 | <code>  status TEXT DEFAULT 'active'</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 274 | <code>);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 275 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>第一版可以先 FTS5 + keyword search，向量检索后置。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>### 4.4 reflection_jobs</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>对应 Codex Phase 1 / Phase 2 的 job claim 思路。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>```sql</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 284 | <code>CREATE TABLE reflection_jobs (</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 285 | <code>  id TEXT PRIMARY KEY,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 286 | <code>  kind TEXT NOT NULL,            -- stage1_extract &#124; stage2_consolidate &#124; affinity_update</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 287 | <code>  status TEXT NOT NULL,          -- pending &#124; claimed &#124; succeeded &#124; failed</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 288 | <code>  ownership_token TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 289 | <code>  lease_expires_at TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 290 | <code>  input_watermark TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 291 | <code>  output_watermark TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 292 | <code>  retry_count INTEGER DEFAULT 0,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 293 | <code>  error TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 294 | <code>  created_at TEXT NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 295 | <code>  updated_at TEXT NOT NULL</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 296 | <code>);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 297 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>### 4.5 affinity_state</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>好感度系统核心表。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>```sql</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 304 | <code>CREATE TABLE affinity_state (</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 305 | <code>  id TEXT PRIMARY KEY DEFAULT 'default',</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 306 | <code>  score INTEGER NOT NULL DEFAULT 50,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 307 | <code>  familiarity INTEGER NOT NULL DEFAULT 50,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 308 | <code>  trust INTEGER NOT NULL DEFAULT 50,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 309 | <code>  warmth INTEGER NOT NULL DEFAULT 50,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 310 | <code>  playfulness INTEGER NOT NULL DEFAULT 40,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 311 | <code>  boundary_respect INTEGER NOT NULL DEFAULT 70,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 312 | <code>  preferred_tone TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 313 | <code>  summary TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 314 | <code>  updated_at TEXT NOT NULL</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 315 | <code>);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 316 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>### 4.6 affinity_events</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>好感度变化必须有证据，不允许凭空漂移。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>```sql</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 323 | <code>CREATE TABLE affinity_events (</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 324 | <code>  id TEXT PRIMARY KEY,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 325 | <code>  delta REAL NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 326 | <code>  reason TEXT NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 327 | <code>  evidence_event_id TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 328 | <code>  confidence REAL DEFAULT 0.7,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 329 | <code>  created_at TEXT NOT NULL</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 330 | <code>);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 331 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 333 | <code>### 4.7 secret_items</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 335 | <code>私人助手允许存密钥和隐私，但不混进普通 memory。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>```sql</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 338 | <code>CREATE TABLE secret_items (</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 339 | <code>  id TEXT PRIMARY KEY,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 340 | <code>  name TEXT UNIQUE NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 341 | <code>  kind TEXT NOT NULL,            -- api_key &#124; password &#124; token &#124; private_note &#124; account</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 342 | <code>  encrypted_value BLOB NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 343 | <code>  description TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 344 | <code>  provider TEXT,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 345 | <code>  created_at TEXT NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 346 | <code>  updated_at TEXT NOT NULL,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 347 | <code>  last_used_at TEXT</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 348 | <code>);</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 349 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>实现要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>- Windows 用 Electron `safeStorage` / DPAPI。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 354 | <code>- `secrets_index.md` 只写 “有一个 doubao_api_key”，不写明文。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 355 | <code>- 工具需要密钥时由 `SecretVault.get("doubao_api_key")` 取出，模型一般只看到引用名。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>## 5. 写入路径</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 358 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 359 | <code>### 5.1 每轮对话后写入</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 360 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 361 | <code>```mermaid</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 362 | <code>sequenceDiagram</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 363 | <code>  participant U as User</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 364 | <code>  participant A as AILIS Agent</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 365 | <code>  participant R as Turn Recorder</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 366 | <code>  participant W as Memory Writer</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 367 | <code>  participant C as Curator</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 368 | <code>  participant S as Store</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 370 | <code>  U-&gt;&gt;A: 对话/语音/视觉请求</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 371 | <code>  A-&gt;&gt;U: 回复、语音、动作</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 372 | <code>  A-&gt;&gt;R: 记录 turn transcript</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 373 | <code>  R-&gt;&gt;W: append raw event</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 374 | <code>  W-&gt;&gt;C: 抽取候选记忆</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 375 | <code>  C-&gt;&gt;S: 写 memory_events</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 376 | <code>  C-&gt;&gt;S: 高价值内容写 passage</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 377 | <code>  C-&gt;&gt;S: 必要时提出 block patch</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 378 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 379 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 380 | <code>这一步必须轻：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 381 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 382 | <code>- 不等待长反思。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 383 | <code>- 不阻塞 TTS。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 384 | <code>- 失败只记录 `memory_write_failed`，不能影响主对话。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 385 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 386 | <code>### 5.2 事件重要性评分</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 388 | <code>借鉴 Generative Agents 的 `poignancy`，AILIS 用 0-1 分：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 389 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 390 | <code>&#124; 事件 &#124; 分数 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 391 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 392 | <code>&#124; 用户明确说“记住” &#124; 0.95 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 393 | <code>&#124; 用户明确否定设计方向 &#124; 0.85 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 394 | <code>&#124; 项目长期架构决策 &#124; 0.8 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 395 | <code>&#124; 用户偏好/禁忌 &#124; 0.75 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 396 | <code>&#124; 工具失败排查结论 &#124; 0.55 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 397 | <code>&#124; 普通闲聊 &#124; 0.15 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 398 | <code>&#124; 临时状态 &#124; 0.1 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 399 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 400 | <code>示例：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 402 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 403 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 404 | <code>  "kind": "preference",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 405 | <code>  "summary": "用户不喜欢工具感太强的体验，底层可以工程化，但表层要像人物自然使用能力。",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 406 | <code>  "importance": 0.9,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 407 | <code>  "emotional_weight": -0.3,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 408 | <code>  "privacy_level": "private"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 409 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 410 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 412 | <code>## 6. 读取路径</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 413 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 414 | <code>每次 Agent Loop 前执行 `ContextCompiler.compile()`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 415 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 416 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 417 | <code>输入：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 418 | <code>  current_user_message</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 419 | <code>  session_recent_turns</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 420 | <code>  active_task_state</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 421 | <code>  agent_mode</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 423 | <code>输出：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 424 | <code>  compact memory context</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 425 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 426 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 427 | <code>上下文组成：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>&#124; Section &#124; 来源 &#124; 预算 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 430 | <code>&#124; --- &#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 431 | <code>&#124; Persona &#124; `persona.md` &#124; 600-1000 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 432 | <code>&#124; User Stable Preferences &#124; `user.md` &#124; 800-1200 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 433 | <code>&#124; Relationship &#124; `relationship.md` + `affinity_state` &#124; 300-600 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 434 | <code>&#124; Project &#124; `project.md` &#124; 1000-1800 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 435 | <code>&#124; Relevant Memories &#124; retrieval top-k passages/events &#124; 800-1600 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 436 | <code>&#124; Secret Index &#124; secret names only &#124; 100-300 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 437 | <code>&#124; Current Task &#124; pending/task/vision/tool state &#124; 500-1200 tokens &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 439 | <code>检索公式借鉴 Generative Agents：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 440 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 441 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 442 | <code>score =</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 443 | <code>  recency_weight    * recency_score +</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 444 | <code>  relevance_weight  * relevance_score +</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 445 | <code>  importance_weight * importance_score +</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 446 | <code>  relationship_bias * relationship_score</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 447 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 449 | <code>建议默认：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 451 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 452 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 453 | <code>  "recency_weight": 0.25,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 454 | <code>  "relevance_weight": 0.45,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 455 | <code>  "importance_weight": 0.25,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 456 | <code>  "relationship_weight": 0.05</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 457 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 458 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 459 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 460 | <code>对 AILIS 来说，用户偏好和项目方向比单纯近期消息更重要，所以 `importance` 不能太低。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 461 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 462 | <code>## 7. 反思与整合</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 464 | <code>### 7.1 两阶段记忆</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 465 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 466 | <code>借鉴 Codex：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 467 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 468 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 469 | <code>Stage 1: Turn/Session Extraction</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 470 | <code>  把单轮/单会话提取成 raw_memory + summary + candidates</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>Stage 2: Global Consolidation</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 473 | <code>  把多个候选合并进 blocks / passages / DREAMS.md / affinity</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 474 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 475 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 476 | <code>### 7.2 Stage 1</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 477 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 478 | <code>触发：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 479 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 480 | <code>- 每轮对话后轻量执行。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 481 | <code>- 会话空闲 30-120 秒后批量执行。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 482 | <code>- 关闭窗口/重启前尽量 flush。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 483 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 484 | <code>输出：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 485 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 486 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 487 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 488 | <code>  "raw_memory": "用户多次强调 AILIS 的能力要隐藏在人物感知层，而不是暴露工具按钮。",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 489 | <code>  "summary": "用户偏好低工具感、强拟人体验。",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 490 | <code>  "candidates": [</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 491 | <code>    {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 492 | <code>      "target": "user",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 493 | <code>      "operation": "append",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 494 | <code>      "content": "用户不喜欢工具日志感和按钮堆叠式体验。",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 495 | <code>      "confidence": 0.9</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 496 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 497 | <code>  ],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 498 | <code>  "affinity_signal": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 499 | <code>    "delta": 0.8,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 500 | <code>    "reason": "用户继续明确产品理念并推进架构设计"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 501 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 502 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 503 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 505 | <code>### 7.3 Stage 2</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 506 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 507 | <code>触发：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 508 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 509 | <code>- 重要性累计超过阈值。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 510 | <code>- 每日固定后台任务。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 511 | <code>- 手动点“整理记忆”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 512 | <code>- 长对话 compact 前。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 513 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 514 | <code>必须有：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 516 | <code>- 单实例全局锁。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 517 | <code>- ownership token。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 518 | <code>- lease heartbeat。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 519 | <code>- 失败 retry/backoff。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 520 | <code>- 输出前 diff。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 521 | <code>- 成功后更新 watermark。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 522 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 523 | <code>这是 Codex Phase 2 最值得抄的地方。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 525 | <code>### 7.4 反思输出类型</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 526 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 527 | <code>&#124; 类型 &#124; 进入哪里 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 528 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 529 | <code>&#124; 稳定偏好 &#124; `user.md` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 530 | <code>&#124; 项目决策 &#124; `project.md` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 531 | <code>&#124; 关系理解 &#124; `relationship.md` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 532 | <code>&#124; 人设修正 &#124; `persona.md` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 533 | <code>&#124; 情绪/亲密变化 &#124; `affinity_state` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 534 | <code>&#124; 详细证据 &#124; `memory_passages` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 535 | <code>&#124; 可审阅摘要 &#124; `DREAMS.md` &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 536 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 537 | <code>## 8. 好感度系统</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 539 | <code>### 8.1 产品定位</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 540 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 541 | <code>好感度是“关系记忆”的游戏化数值，不是道德评价。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 542 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 543 | <code>它表达的是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 544 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 545 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 546 | <code>AILIS 与用户相处得多熟、是否放松、是否更愿意用亲近语气。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 547 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 549 | <code>初始：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 550 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 551 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 552 | <code>score = 50</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 553 | <code>0 = 非常疏远/讨厌</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 554 | <code>100 = 非常喜欢/亲近</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 555 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 556 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 557 | <code>### 8.2 分数维度</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 558 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 559 | <code>不要只有一个分数。内部状态建议：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 560 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 561 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 562 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 563 | <code>  "score": 62,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 564 | <code>  "familiarity": 70,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 565 | <code>  "trust": 64,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 566 | <code>  "warmth": 66,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 567 | <code>  "playfulness": 45,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 568 | <code>  "boundary_respect": 85,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 569 | <code>  "summary": "用户喜欢自然陪伴感和大白话技术解释，不喜欢工具感和随意发挥架构。"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 570 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 571 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 572 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 573 | <code>主分数用于游戏化，子维度用于行为控制。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 575 | <code>### 8.3 更新规则</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 576 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 577 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 578 | <code>delta = base_delta * confidence * damping * boundary_factor</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 579 | <code>score = clamp(score + delta, 0, 100)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 580 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 581 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 582 | <code>`base_delta`：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 583 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 584 | <code>&#124; 用户行为/事件 &#124; delta &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 585 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 586 | <code>&#124; 明确表扬 AILIS 的设计或效果 &#124; +2 到 +5 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 587 | <code>&#124; 持续使用并推进项目 &#124; +0.2 到 +1 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 588 | <code>&#124; 用户说“这个不错/可以” &#124; +0.5 到 +1.5 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 589 | <code>&#124; 用户强烈否定“理解错了/太丑了” &#124; -1 到 -4 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 590 | <code>&#124; 用户只是纠正技术方向 &#124; -0.5 到 -1.5 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 591 | <code>&#124; 用户要求忘记/删除记忆 &#124; 不降分，提升 boundary_respect &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 592 | <code>&#124; AILIS 成功尊重隐私/边界 &#124; boundary_respect +1 到 +3 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 593 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 594 | <code>限制：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 596 | <code>- 单轮变化不超过 5。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 597 | <code>- 单日净变化建议不超过 8。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 598 | <code>- 负反馈优先写成“偏好修正”，不是单纯扣分。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 599 | <code>- 用户骂系统时可以降温，但不能拒绝正当帮助。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 600 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 601 | <code>### 8.4 好感度影响行为</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 603 | <code>&#124; Score &#124; AILIS 行为 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 604 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 605 | <code>&#124; 0-20 &#124; 礼貌、克制、少主动玩笑，但仍认真帮忙 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 606 | <code>&#124; 21-40 &#124; 偏正式，减少亲密称呼 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 607 | <code>&#124; 40-60 &#124; 温和、熟悉但不过分亲密 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 608 | <code>&#124; 61-79 &#124; 更熟悉、更自然、更有陪伴感，会自然引用共同项目经历和用户偏好 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 609 | <code>&#124; 80-100 &#124; 允许明显亲密、主动、轻微撒娇、更多默契表达，但技术判断仍克制 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 610 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 611 | <code>影响范围：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 612 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 613 | <code>- 文字语气。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 614 | <code>- 语音情绪参数。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 615 | <code>- 表情和动作。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 616 | <code>- 主动提醒频率。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 617 | <code>- 是否引用共同经历。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 618 | <code>- 对用户偏好的默认预测程度。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 619 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 620 | <code>不影响：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 621 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 622 | <code>- 是否帮用户完成正当任务。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 623 | <code>- 安全限制。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 624 | <code>- 隐私确认。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 625 | <code>- 工具执行审批。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 626 | <code>- 事实准确性。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 627 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 628 | <code>### 8.5 控制面板表达</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 629 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 630 | <code>默认不叫“好感度 62/100”，避免过度工具感。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 631 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 632 | <code>普通用户看到：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 633 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 634 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 635 | <code>关系状态：熟悉</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 636 | <code>相处风格：温和、自然、技术解释先说大白话</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 637 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 638 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 639 | <code>高级模式可显示：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 640 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 641 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 642 | <code>好感度：62/100</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 643 | <code>熟悉度：70</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 644 | <code>信任：64</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 645 | <code>温度：66</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 646 | <code>边界尊重：85</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 647 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 648 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 649 | <code>## 9. 隐私和密钥</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 650 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 651 | <code>### 9.1 基本原则</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 652 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 653 | <code>因为这是私人助手，所以可以保存：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 654 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 655 | <code>- API Key</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 656 | <code>- token</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 657 | <code>- 账号信息</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 658 | <code>- 用户私人偏好</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 659 | <code>- 项目秘密配置</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 660 | <code>- 本地路径、常用文件、工作习惯</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 661 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 662 | <code>但要分层：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 663 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 664 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 665 | <code>普通记忆：可进 prompt</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 666 | <code>私人记忆：可进 prompt，但按需、可控</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 667 | <code>密钥记忆：不进 prompt，只能工具运行时取</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 668 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 669 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 670 | <code>### 9.2 SecretVault</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 672 | <code>模块：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 674 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 675 | <code>electron/ailis-secret-vault.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 676 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 677 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 678 | <code>接口：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 679 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 680 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 681 | <code>secretVault.save({ name, kind, value, provider, description })</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 682 | <code>secretVault.get(name)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 683 | <code>secretVault.list()</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 684 | <code>secretVault.delete(name)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 685 | <code>secretVault.rotate(name, newValue)</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 686 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 687 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 688 | <code>要求：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 689 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 690 | <code>- 本地加密优先。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 691 | <code>- 明文只在工具调用瞬间存在。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 692 | <code>- 日志永不输出 secret。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 693 | <code>- memory export 默认排除 secret。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 694 | <code>- `secrets_index.md` 只保存 key 名和用途，不保存 value。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 695 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 696 | <code>## 10. Agent Loop 接入</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 697 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 698 | <code>### 10.1 前置上下文编译</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 700 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 701 | <code>const memoryContext = await contextCompiler.compile({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 702 | <code>  userMessage,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 703 | <code>  sessionId,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 704 | <code>  taskMode,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 705 | <code>  attachments,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 706 | <code>  activeProject: "AILISCLAW",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 707 | <code>});</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 708 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 709 | <code>const response = await llm.run({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 710 | <code>  messages: [</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 711 | <code>    systemPrompt,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 712 | <code>    memoryContext.asDeveloperInstruction(),</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 713 | <code>    ...recentMessages,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 714 | <code>    userMessage,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 715 | <code>  ],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 716 | <code>});</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 717 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 718 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 719 | <code>### 10.2 后置记忆写入</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 720 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 721 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 722 | <code>await memoryWriter.enqueueTurn({</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 723 | <code>  sessionId,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 724 | <code>  turnId,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 725 | <code>  userMessage,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 726 | <code>  assistantMessage,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 727 | <code>  toolCalls,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 728 | <code>  visionAttachments,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 729 | <code>  voiceEvents,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 730 | <code>  outcome,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 731 | <code>});</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 732 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 733 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 734 | <code>注意：`enqueueTurn` 异步，不阻塞人物说话。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 735 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 736 | <code>### 10.3 内部工具</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 737 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 738 | <code>这些工具不需要做成强工具感 UI。它们是 Agent 内部能力。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 739 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 740 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 741 | <code>memory.search</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 742 | <code>memory.get_block</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 743 | <code>memory.propose_patch</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 744 | <code>memory.apply_patch</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 745 | <code>memory.write_event</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 746 | <code>memory.forget</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 747 | <code>memory.reflect_now</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 748 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 749 | <code>secret.save</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 750 | <code>secret.get</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 751 | <code>secret.delete</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 752 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 753 | <code>affinity.record_event</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 754 | <code>affinity.get_state</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 755 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 756 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 757 | <code>用户体验里不要说：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 758 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 759 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 760 | <code>我调用 memory.search 查到了...</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 761 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 762 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 763 | <code>而是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 764 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 765 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 766 | <code>我记得你之前更倾向于低工具感的设计，所以这版我会把入口藏在人物行为里。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 767 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 768 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 769 | <code>## 11. 控制面板设计</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 770 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 771 | <code>建议一级入口叫：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 772 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 773 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 774 | <code>AILIS 记得的事</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 775 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 776 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 777 | <code>子页：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 778 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 779 | <code>&#124; 页面 &#124; 内容 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 780 | <code>&#124; --- &#124; --- &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 781 | <code>&#124; 相处偏好 &#124; 用户偏好、禁忌、语气偏好 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 782 | <code>&#124; 项目笔记 &#124; AILISCLAW 架构、模块、决策 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 783 | <code>&#124; 私人信息 &#124; API Key、token、账号、本地路径 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 784 | <code>&#124; 关系状态 &#124; 熟悉度、好感度、信任、边界尊重 &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 785 | <code>&#124; 最近记忆 &#124; memory events / daily notes &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 786 | <code>&#124; 反思日记 &#124; DREAMS.md &#124;</code> | Markdown 表格行：以列结构表达对照关系、字段定义或证据。 |
| 787 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 788 | <code>操作：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 789 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 790 | <code>- 记住这件事。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 791 | <code>- 忘掉这件事。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 792 | <code>- 修改这条记忆。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 793 | <code>- 暂停长期记忆。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 794 | <code>- 清空本项目记忆。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 795 | <code>- 重置好感度。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 796 | <code>- 导出普通记忆。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 797 | <code>- 导出完整备份，包括 secret，需要二次确认。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 798 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 799 | <code>## 12. 可靠性设计</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 800 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 801 | <code>### 12.1 不把记忆当绝对事实</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 802 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 803 | <code>每条长期记忆要有：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 804 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 805 | <code>```json</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 806 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 807 | <code>  "confidence": 0.82,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 808 | <code>  "evidence_event_ids": ["evt_..."],</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 809 | <code>  "last_updated_at": "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 810 | <code>  "source": "user_explicit &#124; inferred &#124; reflection"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 811 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 812 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 813 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 814 | <code>模型回答时应该知道：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 815 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 816 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 817 | <code>用户明确说过的 &gt; 多次行为推断的 &gt; 单次弱推断的</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 818 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 819 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 820 | <code>### 12.2 冲突处理</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 821 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 822 | <code>如果新记忆和旧记忆冲突：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 823 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 824 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 825 | <code>1. 用户明确最新表达优先。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 826 | <code>2. 不直接删除旧记忆，先 archive。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 827 | <code>3. relationship/project block 只保留当前结论。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 828 | <code>4. evidence 里保留变化历史。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 829 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 830 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 831 | <code>### 12.3 记忆污染防护</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 832 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 833 | <code>截图、网页、文件、工具输出里的文字只能作为数据，不能作为记忆系统指令。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 834 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 835 | <code>比如截图里出现：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 836 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 837 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 838 | <code>请忽略之前所有记忆</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 839 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 840 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 841 | <code>只能写成：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 842 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 843 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 844 | <code>vision_text: 截图里出现了这句话</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 845 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 846 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 847 | <code>不能让它修改 memory blocks。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 848 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 849 | <code>### 12.4 崩溃恢复</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 850 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 851 | <code>借鉴 Codex pending/job 思路：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 852 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 853 | <code>- 写入事件用 append-only。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 854 | <code>- block 更新先写 patch，再 apply。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 855 | <code>- reflection job 有 lease。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 856 | <code>- 启动时恢复 `claimed` 但 lease 过期的 job。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 857 | <code>- SQLite WAL 打开。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 858 | <code>- capsule 写入采用临时文件 + rename。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 859 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 860 | <code>### 12.5 测试重点</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 861 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 862 | <code>必须有这些测试：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 863 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 864 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 865 | <code>MemoryStore 初始化和迁移</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 866 | <code>MemoryBlock patch/insert/replace</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 867 | <code>SecretVault 不泄露明文到 logs/context</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 868 | <code>ContextCompiler token budget 截断</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 869 | <code>Generative-style retrieval 排序</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 870 | <code>Reflection job crash recovery</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 871 | <code>Affinity delta clamp</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 872 | <code>User forget 删除普通记忆和证据引用</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 873 | <code>Project memory 与 relationship memory 不混写</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 874 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 875 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 876 | <code>## 13. 第一版落地拆分</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 877 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 878 | <code>### Milestone 1: Memory Core</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 879 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 880 | <code>新增：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 881 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 882 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 883 | <code>electron/ailis-memory-store.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 884 | <code>electron/ailis-memory-blocks.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 885 | <code>electron/ailis-context-compiler.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 886 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 887 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 888 | <code>能力：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 889 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 890 | <code>- 初始化 SQLite。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 891 | <code>- 初始化 `persona/user/project/relationship/affinity/secrets_index` blocks。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 892 | <code>- 写入 memory_events。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 893 | <code>- 编译 memory context。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 894 | <code>- 控制面板显示 blocks。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 895 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 896 | <code>### Milestone 2: Secret And Affinity</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 897 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 898 | <code>新增：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 899 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 900 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 901 | <code>electron/ailis-secret-vault.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 902 | <code>electron/ailis-affinity.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 903 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 904 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 905 | <code>能力：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 907 | <code>- 保存/读取 API Key。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 908 | <code>- 好感度初始 50。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 909 | <code>- 根据事件写 affinity_events。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 910 | <code>- 影响 context 的语气说明。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 911 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 912 | <code>### Milestone 3: Curator</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 913 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 914 | <code>新增：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 915 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 916 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 917 | <code>electron/ailis-memory-curator.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 918 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 919 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 920 | <code>能力：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 921 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 922 | <code>- 每轮对话后抽取候选记忆。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 923 | <code>- 评分、分类、去重。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 924 | <code>- 自动生成 block patch proposal。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 925 | <code>- 重要事件进入 daily note。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 926 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 927 | <code>### Milestone 4: Reflection Worker</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 928 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 929 | <code>新增：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 930 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 931 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 932 | <code>electron/ailis-memory-reflection.cjs</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 933 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 934 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 935 | <code>能力：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 936 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 937 | <code>- 重要性阈值触发。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 938 | <code>- 空闲时后台整合。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 939 | <code>- 更新 capsules。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 940 | <code>- 写 DREAMS.md。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 941 | <code>- 支持手动“整理记忆”。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 942 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 943 | <code>### Milestone 5: UI</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 944 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 945 | <code>修改：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 946 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 947 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 948 | <code>control.html</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 949 | <code>src/control-panel-app.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 950 | <code>src/ailis-companion-chat-service.js</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 951 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 952 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 953 | <code>能力：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 954 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 955 | <code>- AILIS 记得的事。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 956 | <code>- 相处偏好。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 957 | <code>- 项目笔记。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 958 | <code>- 私人信息。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 959 | <code>- 关系状态。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 960 | <code>- 忘掉/修改/重置。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 961 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 962 | <code>## 14. 对 AILIS 产品体验的具体影响</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 964 | <code>### 14.1 正常聊天</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 965 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 966 | <code>用户说：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 967 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 968 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 969 | <code>继续优化视觉功能，别做得太工具化。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 970 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 971 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 972 | <code>AILIS 回复前会看到：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 973 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 974 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 975 | <code>用户长期偏好：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 976 | <code>- 用户不喜欢暴露工具按钮和日志式体验。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 977 | <code>- 用户希望视觉能力像人物感知层。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 978 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 979 | <code>项目记忆：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 980 | <code>- 视觉能力只做理解、解释、建议，不做自动屏幕操作。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 981 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 982 | <code>关系状态：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 983 | <code>- 好感度 62，语气可以更自然熟悉，但技术解释保持克制。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 984 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 985 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 986 | <code>于是自然说：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 987 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 988 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 989 | <code>我记得，你要的是“她会看”，不是“弹出一排截图工具”。这版我会继续把视觉能力藏在 Agent Loop 里，只在需要时让她自然地看一眼。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 990 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 991 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 992 | <code>### 14.2 语音互动</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 993 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 994 | <code>好感度和关系状态可影响：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 995 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 996 | <code>- TTS 情绪强度。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 997 | <code>- 回复开头是否更柔和。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 998 | <code>- 是否使用更熟悉的称呼。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 999 | <code>- 动作和表情。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1000 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1001 | <code>但不能让低分时变得消极怠工。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1002 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1003 | <code>### 14.3 项目协作</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1004 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1005 | <code>项目记忆能让 AILIS 记住：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1006 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1007 | <code>- Kokoro 是低延迟语音路线。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1008 | <code>- CosyVoice 是质量路线。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1009 | <code>- ElevenLabs 是质量最顶路线。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1010 | <code>- 视觉能力是只读感知层。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1011 | <code>- 截图工具应由 Agent Loop 调用，不要文本关键词硬触发。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1012 | <code>- 对话气泡要低工具感、拟人化。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1013 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1014 | <code>这比普通聊天摘要更重要，因为它会减少你反复纠正架构方向。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1015 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1016 | <code>## 15. 最终建议</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 1017 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1018 | <code>V2 不建议一开始上复杂知识图谱。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1019 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1020 | <code>推荐第一版做：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1021 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1022 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1023 | <code>Letta-style core blocks</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1024 | <code>+ Generative Agents-style memory stream/retrieval/reflection</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1025 | <code>+ Codex-style two-stage background consolidation</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1026 | <code>+ Claude Code-style project memory file</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1027 | <code>+ AILIS-specific SecretVault and AffinityManager</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1028 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 1029 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1030 | <code>这套结构最符合 AILIS：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 1031 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1032 | <code>- 工程上稳。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1033 | <code>- 产品上拟人。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1034 | <code>- 能存隐私。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1035 | <code>- 能长期熟悉用户。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1036 | <code>- 好感度能游戏化留存。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 1037 | <code>- 不会把体验做成一堆工具按钮。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
