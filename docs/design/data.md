# 数据与上下文

AILIS 保存两类不同的信息：用于继续执行的有序记录，以及用于补充理解的长期背景。工具产生的大内容有自己的存储和引用。模型每次收到的是根据这些数据构造的输入视图。

## 数据对象

| 对象 | 用途 | 实现 |
| --- | --- | --- |
| 可见聊天 | 页面展示与历史加载 | chat-history-store |
| Session checkpoint | 连续执行与恢复 | session-context-store |
| Context package | 本次模型输入与预算信息 | ContextManager |
| MemoryContext | 按主题组织的背景 | ContextCompiler |
| 长期记忆与画像 | 用户、关系、项目和相关事件 | memory-store、user-profile-curator |
| 原始记忆账本 | 索引、回放和整理输入 | raw-memory-ledger |
| 工具输出 | 完整输出、元数据和按需回读 | output-store |
| 上下文工件 | 结构化内容、范围与引用 | context-artifact-store |

## 执行记录

Session 文件按 sessionId 的 SHA-256 命名，保存在 session-context/sessions 下。Checkpoint 的 items 按顺序保留消息和调用关系。

response-model 定义 message、reasoning、function_call、function_call_output 等对象。工具输出通过 call_id 与调用关联，可以保留文本或内容项以及 success 信息。ContextManager 基于这些对象构造 ailis.context_package.v1 上下文包。

有序记录服务于“接下来怎么继续”，页面聊天记录服务于“用户看见过什么”，它们各有存储接口。

## 背景编译

ContextCompiler 获取记忆来源后，生成 persona、user、relationship、project、relevant_memories、secret_index 等 section。统一模式包含人物和用户背景；主任务执行状态由执行上下文本身承载。

编译过程为 section 分配预算，按字符近似 token 数，并保留 sourceRefs、originalChars、truncated 等诊断字段。当前换算常量为每 4 个字符约 1 token，适合内部预算，不是账单计算。

相关记忆使用词项、短语、数字和时近因素进行检索，策略 ID 为 bm25_phrase_v2。画像整理过程读写用户、关系和亲密度等文件，为后续背景编译提供输入。

## 大内容处理

工具输出保留完整内容及 stdout／stderr 等元数据，模型通常先收到受限视图。outputId 支持 read、tail、search。结构化工件还可以按范围查询和物化。

“范围”是数据契约的一部分：读取某个工作表区域只能证明该区域的内容，摘要只代表它实际覆盖的数据。需要更多信息时，通过引用回读，而不是依赖摘要包含所有细节。

上下文预算、模型投影和语义压缩是不同环节。语义摘要会损失细节，运行时应保留后续所需的目标、约束、未完成状态和证据引用。具体入口的实现差异单列在[实现记录](../reference/implementation-status.md)。

## 当前窗口与压缩点

运行时默认窗口为 512,000 Token，适用于 Luna 内置配置及没有窗口声明的模型。默认预警、常规压缩、紧急点分别为 400,000、460,800、486,400 Token。预警本身不发起语义压缩。计量包括安全余量，因此这些数值不是账单 Token 数的精确触发点。

显式声明的模型窗口继续优先：请求、模型设置及 provider 能力声明优先于环境变量，环境变量优先于内置值和兜底值。能力声明中的 `max_context_window` 限制可配置的最大窗口；明确的 64K、128K 等窗口不会被默认值强行放大。未知模型的 512K 是客户端预算兜底，不代表远端一定支持，接入时应提供真实窗口能力。

只覆盖窗口时，三个压缩点按该窗口的 78.125%、90%、95% 同步计算，并受实际输入预算约束；显式配置的比例或绝对压缩点仍然有效。输出预留和计量安全余量保持独立。配置可使用 `contextWindowTokens`、`contextHardTokenLimit` 等模型设置，或 `AILIS_LLM_CONTEXT_WINDOW_TOKENS`、`AILIS_LLM_AUTO_COMPACT_TOKEN_LIMIT` 等环境变量。

Checkpoint 里的旧 `contextWindowTokens` 只用于诊断，不再覆盖当前模型配置，避免升级后仍停留在旧窗口，或切换模型时沿用上一个模型的窗口。桌面与无头入口共用预算规则；默认值和比例集中在 [runtime-budget](../../electron/ailis-runtime-budget.cjs)，配置解析在 [Runner](../../electron/agent-loop/runner.cjs)。已冻结的评测包不随主目录默认值变更而重写。

Token 窗口不等于 HTTP 字节上限。Gateway 请求体上限和服务器 `AILIS_LLM_RELAY_MAX_BYTES` 默认均为 16 MiB，以容纳长文本和编码后的历史；超限仍返回 413。现有部署若显式设置旧值，需同步更新环境变量与反向代理限制后重启，改代码不会覆盖已有运维配置。

## 保存、清除和保护

Agent 数据根由宿主解析，见[配置](../guide/configuration.md)。长期记忆目录包含 memory-state.json、events.jsonl、capsules、daily、reflections 和画像文件。

删除接口按存储对象划分：聊天清除、长期记忆清除、单项遗忘、secret 删除等分别处理。clearMemory 默认 preserveSecrets=true。需要完整删除某次交互的数据时，还应覆盖 Session、工件、原始账本和相关备份。

凭据、个人偏好和附件可能出现在本地记录或模型请求中。memory-store 的 secret 值以 Base64 保存，不具备加密保护；访问控制应由宿主文件权限和部署策略提供。

实现：[response-model](../../electron/ailis-response-model.cjs)、[ContextManager](../../electron/ailis-context-manager.cjs)、[ContextCompiler](../../electron/ailis-context-compiler.cjs)、[记忆](../../electron/ailis-memory-store.cjs)、[检索](../../electron/ailis-memory-lexical-retriever.cjs)、[输出存储](../../electron/ailis-output-store.cjs)。
