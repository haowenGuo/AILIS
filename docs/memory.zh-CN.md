# AILIS 记忆系统

[文档中心](README.zh-CN.md) · [English](memory.md) · [系统架构](architecture.zh-CN.md) · [检索基线](ailis-memory-bm25-mmr-baseline.md)

AILIS 的记忆是一套本机 Persona Memory Runtime，不是简单堆积聊天记录，也不是通用向量数据库。它保存稳定身份与关系上下文，记录有价值事件，检索当前任务相关历史，并为每次模型请求投影一份有界记忆视图。

## 持久记忆

| 分区 | 用途 |
| --- | --- |
| Persona block | AILIS 的稳定身份与互动风格 |
| User block | 用户偏好与长期个人上下文 |
| Relationship block | 共同经历与关系状态 |
| Project block | 活动项目事实、约定与持久工作上下文 |
| Memory events | 来自对话和已完成工作的带时间事件 |
| Curated capsules | 用户画像、关系画像、项目条目与 affinity 状态 |
| Secret index | 已配置 Secret 的名称与元数据；原始值不会进入普通 Prompt 记忆 |

记忆状态保存在桌面 Runtime 的状态目录。TaskAgent 执行事件与 Persona 记忆可以区分，任务轨迹不会自动变成关系记忆。

## 检索流程

当前生产检索器是内存中的词法 BM25 + MMR 流水线。每次请求会：

1. 根据当前请求和相关上下文构造查询；
2. 用词法相关性对记忆事件排序；
3. 应用 Session 重复惩罚与 MMR 多样化；
4. 选择有界的相关事件和近期事件；
5. 将事件与稳定记忆 blocks 一起编译进模型上下文。

默认 Prompt 投影最多选择 8 条相关事件和当前 Session 的 6 条近期事件。具体参数与评测证据见 [记忆检索基线](ailis-memory-bm25-mmr-baseline.md)。

## 上下文投影

`AILISContextCompiler` 为不同记忆分区设置独立字符预算。模型看到的是带来源引用的紧凑分区，而不是完整记忆数据库。Secret-like token、人物控制标签和工具协议片段会从普通 Prompt 记忆中清理。

Persona 请求可以看到身份、用户、关系、项目、affinity 和相关事件。TaskAgent 使用更窄的任务投影，不会自动接收关系语气或 affinity 文本。

## 持久化与隐私

- 记忆数据库与 curated capsules 默认留在用户电脑上。
- 加入当前模型请求的记忆内容可能发送到当前模型服务。
- 原始 Secret 值不会进入普通记忆 Prompt。
- 当前旧式 Secret Store 标记为 `local-file-base64`，不能把它宣传成操作系统级凭证保险库。
- 用户可以通过 Runtime 操作检查、更新、重置或清理记忆。

## 当前边界

BM25/MMR 对直接词法证据速度快、效果稳定；当答案依赖分散在多段历史中的多跳合并时，答案构造仍是主要短板。完整 LoCoMo 与 LongMemEval 数据见 [评测成绩](evaluation.zh-CN.md)。后续优化目标是通用证据组合，而不是增加领域硬路由。

## 主要源码

| 文件 | 职责 |
| --- | --- |
| `electron/ailis-memory-store.cjs` | 持久化、blocks、events、affinity、Secret 元数据与 Prompt 视图 |
| `electron/ailis-memory-lexical-retriever.cjs` | BM25/MMR 排序与选择 |
| `electron/ailis-context-compiler.cjs` | 有界模型可见记忆投影 |
| `electron/ailis-user-profile-curator.cjs` | 画像与关系状态整理流程 |

仓库中的 V1/V2 设计研究继续作为历史保留；本页才是当前实现契约。
