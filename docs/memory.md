# 记忆、上下文和压缩

[手册索引与源码基线](README.md) · [Agent 与 Session](agent-session.md) · [评估](evaluation.md)

## 一套主上下文，不是一份万能记忆文件

统一 Agent 保存自己的 Session 执行账本；长期记忆在需要时作为有预算的背景装配进去。UI 聊天、Session、长期画像和工具工件各自持久化，不能互相代替。

| 内容 | 代码依据 | 典型位置／结构 |
| --- | --- | --- |
| 模型执行账本 | [session-context-store](../electron/ailis-session-context-store.cjs) | `<auditDir>/session-context/sessions/`，按 sessionId 哈希保存 checkpoint |
| 长期状态和记忆事件 | [memory-store](../electron/ailis-memory-store.cjs) | `<auditDir>/memory/memory-state.json`、`events.jsonl`、`capsules/`、`daily/`、`reflections/` |
| 画像整理 | [user-profile-curator](../electron/ailis-user-profile-curator.cjs) | `user-profile.json`、`relationship-profile.json`、`affinity-state.json` 和整理／重建记录 |
| 原始记录与回放 | [raw-memory-ledger](../electron/ailis-raw-memory-ledger.cjs) | 独立索引和记录，包含按字段脱敏逻辑 |
| 模型背景视图 | [ContextCompiler](../electron/ailis-context-compiler.cjs) | 按 section 编译的 `MemoryContext`，不是新的用户消息 |

实际根路径可由构造参数和桌面设置覆盖，不能固定假设每次都在同一个 `.ailis-state`。见 [配置](configuration.md)。

## 长期内容怎样进入模型

`AILISContextCompiler.compile` 从 `memoryRuntime.getContextSources` 取来源，按 section 限额装配 persona、user、relationship、project、relevant memories、secret index 等。当前 `unified` 模式保留人格与关系背景；这些 section 名字不表示再调用一个 Persona 模型。

编译器使用字符／token 近似换算和完整行截断，记录原始长度、截断情况、引用和预算诊断。近似 token 不是 provider 计费 token。显式背景记忆也不能覆盖本轮用户的目标和纠正。

相关记忆检索的当前策略 ID 是 `bm25_phrase_v2`，代码见 [lexical-retriever](../electron/ailis-memory-lexical-retriever.cjs)：词项 BM25、短语／数字和时近等加权。不能把它继续写成“默认向量库检索”或假定它保证找回所有语义相关记忆。画像 curator 是另一条整理过程，也不等于每次对话必定重建画像。

## 执行上下文

[ContextManager](../electron/ailis-context-manager.cjs)管理消息和调用／输出关系，生成 checkpoint、上下文包、预算报告和模型投影。工具输出预算、图片能力筛选、消息配对和引用保留与长期画像预算是不同环节。

原始证据、受限模型视图和语义摘要应分开理解：摘要有损；保留引用便于回查，但引用对应内容仍需存在且工具可读。不要宣称“压缩后所有细节仍在模型记忆中”。

## 当前压缩限制必须明确

[Runner](../electron/agent-loop/runner.cjs)有 provider 压缩路径，支持 portable 语义摘要与 native 模式，也有失败后的本地规则回退。然而当前 `pendingCompactionLevel` 为 hard／stop 时的 provider 压缩条件只列出 `task_agent` 和 `persona`，**没有列入 `unified`**。

因此，不能仅凭存在 `compactDesktopLlmProvider` 就声称统一主会话已经获得完全相同的自动 provider 压缩。统一模式依然经过上下文投影和预算逻辑，但其超长会话行为需要专项验证／后续修复；这次文档重写未改变该条件。

## 为什么统一了 Agent，缓存率仍可能低

当前统一路径的 prompt cache key 使用稳定 Session 标识，不再单纯跟随每次 runId。但 cache key 只是请求字段，不是缓存命中证明。Runner 同时记录指令哈希、工具哈希、输入序列及前缀兼容性，用于定位上下文变化。

每轮变动的系统背景、工具 schema、历史重排、附件或压缩替换可能破坏可复用前缀；换模型、provider 策略与缓存有效期也会影响命中。不能把“统一 Agent”“输出裁剪”或“调用次数减少”直接换算成某个缓存率。

正确验证是比较同一 provider／model／Session 的实际模型输入和 provider usage。缓存 token 的分母和费用计算见 [评估](evaluation.md)。

## 安全与删除边界

- `memory-store` 的 secret value 采用 Base64 编码；**不是加密**。脱敏索引和日志字段过滤也不等于完整存储加密。
- 记忆、对话、附件、输出和审计中可能含用户隐私；本地存储不意味着这些内容永不发送给模型或外部工具。
- `clearMemory({ preserveSecrets = true })` 默认保留 secrets，并清理自身管理的部分长期记忆数据；它不是“全应用彻底遗忘”的 API。
- 清理或迁移前先确认实际状态目录、活动写者和备份。若要求彻底删除，需要分别核验聊天、Session、原始账本、画像、工件、备份和服务端副本，不能只删一个文件夹。
- 画像错误或称呼反向时，先找到来源与生效 section，再做明确纠正。只换文档或角色图片不会修复已保存的偏好。

## 验证

```powershell
node --test tests/ailis-context-compiler.test.mjs tests/ailis-memory-store.test.mjs tests/ailis-raw-memory-ledger.test.mjs
```

在隔离状态中补测：相反称呼的纠正、跨轮续接、并发请求、重启恢复、超长工具输出、附件引用、压缩后引用回读以及各类数据分别清除。不要用正式个人历史作为默认测试夹具。
