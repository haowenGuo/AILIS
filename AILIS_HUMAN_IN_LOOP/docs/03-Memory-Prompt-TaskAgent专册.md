# 03｜Memory、Prompt 与 TaskAgent 专册

## 1. 为什么必须分通道

AILIS 同时拥有“人格连续性”“用户看得见的对话”“当前任务执行”“工具证据”和
“原始审计记录”。把这些全部拼成一段 prompt 会造成：

- 用户偏好被临时任务污染；
- 原始工具输出和内部协议泄漏给 Persona；
- 长会话无限膨胀；
- 旧任务状态误导新任务；
- 敏感值进入模型或日志；
- 压缩后 tool call/output 失配。

因此系统把信息分成多个 lane，再由编译器在明确预算下组合。

## 2. 六个信息通道

| 通道 | 典型内容 | 主要拥有者 | 是否直接给用户 |
| --- | --- | --- | --- |
| Persona Prompt | 身份、关系语气、行为边界 | prompt model/runner | 不直接展示 |
| Curated Memory | 稳定偏好、关系、长期事实、daily note | memory store | 按需人格化表达 |
| Visible Conversation | 用户和 AILIS 看见的近期对话 | ChatTTS/ContextManager | 是 |
| Current Task State | 目标、进度、未决项、输出引用 | Harness/runner | 只展示摘要 |
| Tool Evidence | call/output、artifact、source refs | Gateway/runner/context | 只展示可验证结论 |
| Raw Ledger | 原始事件、run/session/day 索引 | raw memory ledger | 否，审计/重放 |

## 3. Persona Prompt

Persona Prompt 定义“AILIS 是谁、如何面对用户”，不负责逐步执行工具任务。
它与工具协议的区别：

- Persona 约束语气、关系、可见表达和具身行为。
- TaskAgent instruction 约束计划、证据、工具、恢复和完成标准。
- Tool contract 约束具体能力的 schema、权限、风险和返回。
- Developer/context message 提供当前轮可用事实，不应改写身份。

`ailis-prompt-model.cjs` 和 runner 中的 prompt profile/assembly 是理解装配顺序的入口。
修改提示词前必须找对应快照测试或行为测试，避免一句话破坏工具循环或人格边界。

## 4. Memory Store

`AILISMemoryRuntime` 在 `electron/ailis-memory-store.cjs` 中实现整理记忆。核心能力包括：

- `initialize()`：加载并规范化持久化 state，处理版本/迁移。
- `getSnapshot()`：输出受控快照，而不是任意暴露内部文件。
- `listMemories()` / `searchMemory()`：列出与相关性检索。
- `getRecentSessionEvents()`：取近期会话事件。
- `writeDailyNote()`：把事件沉淀为每日笔记。
- `updateBlock()`：更新稳定记忆块。
- `forgetMemory()` / `clearMemory()`：可控遗忘。
- `resetAffinity()`：重置关系分值/阶段。
- secret API：保存、掩码列出、按名读取和删除。

### 默认块与事件

Memory Store 以 block 表达相对稳定的 Persona/用户/工作空间信息，以 event/daily note
表达时间性经历。检索评分结合 query 与文本，affinity 根据累积状态形成关系阶段。

### 脱敏

`redactSecretLikeText()`、prompt memory sanitize 和 secret index 的目标是：

- 可让模型知道“存在某项凭据/配置”；
- 不把明文 token/password/API key 拼进普通 prompt；
- renderer 和诊断只展示掩码；
- 需要真实值时由受控工具/运行时按权限取用。

Base64 编码不是加密；它只是当前存储实现的一部分，不能当作强安全保证。生产部署
仍需依赖受保护目录、操作系统权限和更强 secret store。

## 5. Raw Memory Ledger

`AILISRawMemoryLedger` 负责不可与 curated memory 混淆的追加式记录：

- `appendEntry()` 写入按日文件；
- `recordRuntimeItem()` 把运行 transcript 规范为 ledger entry；
- index 记录 day/session/run 聚合；
- `replay()` 支持按条件重放；
- `getStatus()` / `listSessions()` 提供审计入口；
- `toJsonSafe()` 和 key redaction 避免循环对象、危险字段进入记录。

Raw ledger 的价值是“可追溯”，不代表每条原始数据都应该进入模型。

## 6. Context Compiler

`AILISContextCompiler.compile()`（在逐行页面中追踪具体参数）从 memory sources 建立
`MemoryContext`。每个 section 有名字、内容、source refs 和预算。典型 section 包括：

- identity/persona 相关记忆；
- user profile/preferences；
- relationship/affinity；
- relevant memories；
- recent session/daily context；
- secret index（只含安全索引）；
- active/current task（在适用 mode 下）。

`MemoryContext.asDeveloperInstruction()` 生成开发者上下文；`toJSON()` 保留可诊断结构。
`maxChars` 不足时按预算缩放并记录 diagnostics，而不是无声截断。

## 7. Model Input Builder

`electron/ailis-model-input-builder.cjs` 将不同通道转换为模型协议项：

- `conversationToResponseItems()`：可见历史 → response message items。
- `buildMemoryDeveloperMessage()`：MemoryContext → developer message。
- `buildContextMessage()`：当前 task/context → 用户上下文项。
- `toolOutputToModelInputItems()`：标准化 call/output、图片与工具结果。
- `buildModelInput()`：一次性构建 input。
- `buildModelInputContextManager()`：建立可持续管理的 ContextManager。
- `responseItemsToChatMessages()`：兼容 chat completions 形态。
- `record*ToContextManager()`：在循环中增量记录工具和图片。

装配顺序影响模型遵从性。Memory 是上下文，不应覆盖更高优先级的 system/developer
安全要求；tool output 是不可信观察，不能被当成新的开发者指令。

## 8. ContextManager

`ContextManager` 是模型工作记忆的生命周期管理器：

- `recordItems()` / `processItem()` 增量加入协议项。
- `forPrompt()` / `forPromptPackage()` 输出模型可见版本。
- `contextBudgetReport()` 报告预算。
- `compactForBudget()`、`semanticCompact()` 在超预算时压缩。
- `compactStaleToolOutputs()` 将旧大输出缩成可查询引用。
- `ensureCallOutputsPresent()`、`removeOrphanOutputs()` 保持协议合法。
- `stripImagesWhenUnsupported()` 适配模型 modality。
- `buildContextPackage()`、`buildSemanticCompactedItem()` 保留任务连续性。
- `toCheckpoint()` / `fromCheckpoint()` 支持恢复。

### 压缩时必须保住什么

1. 当前用户目标和约束；
2. 已完成工作和真实结果；
3. 未完成项、失败原因、下一步；
4. tool call/output 的必要配对；
5. artifact/output/source 引用；
6. 审批状态与权限边界；
7. 近期可见对话；
8. 能让下一轮继续而不是重新猜测的 task state。

## 9. System TaskAgent Harness

`AILISSystemTaskAgentHarness` 解决“任务跨多次模型调用仍是同一个任务”的问题。

### 状态模型

每个 session 保留规范化 task，包含目标文本、status、timestamps、run/source/evidence/
output refs 等。`selectPriorTask()` 判断是否可延续；`createTask()` 建新任务；
`handoff()` 负责执行/续接；`inFlight` 防止同 session 重复运行；`persist()` 原子写状态。

### 结果包

`buildTaskResultPacket()` 形成固定 schema，聚合：

- status/ok/final text；
- task/session/run 身份；
- collected data、steps；
- source/evidence/output refs；
- checkpoint/continuation 线索；
- 审批、失败或完成信息。

稳定 schema 让桌面、Hosted 和 Persona Renderer 不必猜 runner 的内部对象形状。

### Harness 不做什么

- 不创建多个争夺人格的 Agent。
- 不用关键词规则替模型做语义计划。
- 不直接执行未经 contract/policy 的 OS 操作。
- 不把内部状态原样展示给用户。
- 不把“runner 返回了”自动解释为“任务已完成”。

## 10. Agent Runner 中的 TaskAgent 循环

逻辑上可以分成九段：

1. **Normalize**：请求、附件、workspace、provider、model、预算。
2. **Restore**：session task、checkpoint、context manager、已有 evidence。
3. **Compile**：system/task/persona/memory/context/tools。
4. **Decide**：调用模型，解析 direct answer/tool search/tool call/progress/final。
5. **Guard**：协议形态、工具契约、权限、并行调用、exact-answer 约束。
6. **Execute**：Gateway/Runtime/MCP/adapter。
7. **Observe**：标准化结果、artifact、evidence、usage、audit。
8. **Recover**：根据错误/缺口由模型改道，在预算内重试或补证据。
9. **Finalize**：证据充分性、未解决字段、任务状态、Persona Surface、checkpoint。

阅读 14,000 行 runner 时以这九段作为索引，不要把大量 helper 当作九个独立 Agent。

## 11. Persona Renderer

TaskAgent 的内部事实最终由 Persona Renderer 转成可见 surface。它负责：

- 把内部 task status 映射为 speaking/waiting/approval/failed/completed 等表面状态；
- 从 emotion 推断 expression/action/gesture；
- 清理 tool protocol、provider 占位符和内部错误；
- 审批时说明具体下一动作；
- 失败时区分配置、权限、工具、证据问题；
- max-steps 时诚实说“停住”，不假称完成；
- 给 TTS 与 VRM 输出一致的 speech/bubble/action/lip-sync 元数据。

Persona Renderer 可以安全表达事实，但不能篡改执行事实。

## 12. 一个包含 Memory 和工具的完整示例

用户说“把我上次确定的报告目录里的最新文件总结一下”：

1. Memory retrieval 从 curated memory 找到“报告目录”的稳定偏好/路径引用。
2. Context Compiler 在 persona/task mode 下加入相关记忆，但不加入无关旧对话。
3. Harness 恢复或创建当前任务。
4. runner 让模型基于目标和工具表决定先列目录。
5. file tool contract 校验路径与只读权限。
6. Runtime 列目录，结果成为 observation + evidence ref。
7. 模型选择最新文件并读取；大文件可转 artifact。
8. ContextManager 保留必要 tool call/output 和引用，压缩冗余内容。
9. 模型基于证据总结；finalizer 检查结论引用。
10. Harness 保存结果 refs；Raw Ledger 记录运行事实。
11. 是否把新信息写成长期 Memory 由记忆策略决定，而不是所有文件内容自动永久化。
12. Persona Renderer 用自然语言交付，ChatTTSSystem 显示并朗读。

## 13. 审查清单

修改 Memory/Prompt/TaskAgent 时逐项问：

- 是否把 transient task 数据写成了长期人格记忆？
- 是否可能把 secret 明文放进 prompt、日志、renderer 或快照？
- 是否破坏 system/developer/user/tool 的优先级？
- 是否让 tool output 中的恶意文本获得指令权？
- 是否在压缩中丢掉 call/output 配对或 output ref？
- 是否把模型语义判断硬编码为关键词分支？
- 是否能从 task result 追溯到 evidence？
- 是否覆盖新建、续跑、中断、审批、失败、max-steps 和恢复测试？
- Hosted 与桌面是否使用相同核心语义？
- Persona 是否只改变表达、没有改写真实完成状态？
