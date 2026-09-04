# AILIS 记忆与 Session 历史

[文档中心](README.zh-CN.md) · [English](memory.md)

## 不要把两类状态混为一谈

| 状态 | 所有者与用途 |
| --- | --- |
| Session 规范历史 | [SessionContextStore](../electron/ailis-session-context-store.cjs)：有序消息、工具调用/结果、检查点与恢复 |
| 长期记忆 | [MemoryStore](../electron/ailis-memory-store.cjs)：身份、用户、关系、项目 blocks 与事件 |
| 模型可见投影 | [ContextCompiler](../electron/ailis-context-compiler.cjs)：有预算的记忆分区 |
| 可见聊天记录 | 展示和回看，不是第二套权威执行检查点 |
| 旧 Persona/TaskAgent 存储 | 首次迁移来源及显式兼容 API |

人物风格是主 Agent 上下文内的配置，不是另一个模型及其并行主对话历史。

## 检索与投影

[词法检索器](../electron/ailis-memory-lexical-retriever.cjs)通过 BM25 与 MMR 排序、去重和多样化选择事件；Compiler 按预算投影记忆 blocks 和事件。统一上下文可以同时包含身份、关系、项目和执行历史，不再自动切换成旧版排除关系信息的 TaskAgent 投影。

当前用户消息优先。用户如何称呼 AILIS，不会自动建立反向称呼规则；不能确定时应省略称呼。

## 持久化、迁移与隐私

规范检查点位于 `<auditDir>/session-context/sessions/<sha256(sessionId)>.json`。独占锁防止竞争写入；检查点以替换方式保存，不把已经压缩掉的旧历史合并回来。首次使用仅导入一份旧执行或 Persona 检查点，原存储保留。

长期记忆存于本机，但被投影进模型请求的部分可以发送到配置的模型服务。Secret 原值不是普通记忆；现有 `local-file-base64` 存储也不等于操作系统凭证保险库。

## 边界

检查点恢复测试不证明语义压缩质量、记忆事实正确率、缓存率或多跳回答能力。旧[记忆检索成绩](ailis-memory-bm25-mmr-baseline.md)仍是历史证据，不是本工作树的新测量。本轮精简没有删除或迁移真实用户数据。
