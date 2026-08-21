# AILIS 工具运行时

[文档中心](README.zh-CN.md) · [English](tools.md) · [系统架构](architecture.zh-CN.md) · [TaskAgent](taskagent.zh-CN.md)

AILIS 向 Persona 与 TaskAgent 提供同一套可审计工具运行时。桌面内置能力、动态发现工具、MCP 工具和工件操作都经过统一的契约、验证、审批、执行、Observation 与事件链路。

## 工具能力

| 能力 | 当前工具与 Runtime |
| --- | --- |
| 文件与终端 | read、write、edit、`exec`、`apply_patch`、长进程 Session |
| 电脑操作 | 屏幕/窗口观察与用户批准的电脑动作 |
| 网页 | `web_run`、搜索、打开、查找、点击与带引用页面 Observation |
| 代码 | 代码执行与面向仓库的任务工作流 |
| 文档与工件 | 导入、检查、查询、编辑、渲染、验证、导出与 round-trip 检查 |
| 通信 | Email Provider 与账号相关操作 |
| 视觉 | 用户允许的屏幕、图片与视觉工件理解 |
| 扩展 | `tool_search`、MCP Bridge、标准工具包与外部契约 |
| 任务控制 | handoff、route、goal、verification 与紧凑结果读取 |

模型始终看到稳定的核心工具面；长尾工具只在需要时发现和暴露，在降低 Schema 开销的同时保留能力入口。

## 执行链

```text
模型函数调用
  -> 规范化名称与参数
  -> 根据工具契约验证
  -> 解析策略与审批要求
  -> 通过 Gateway/Runtime Adapter 执行
  -> 标准化文本、结构数据、图片与工件
  -> 发送进度与审计事件
  -> 将 call-linked 输出写回规范历史
```

每个已接受调用都会保留。一个验证失败或需要串行执行的动作不会让同批后续调用丢失。安全且独立的调用可以并发，有状态写操作按照 Runtime 安全元数据调度。

## 工具契约

`electron/ailis-tool-contracts.cjs` 是模型可见契约的来源。契约定义工具 ID、描述、输入 Schema、验证规则、别名、审批语义和输出预期。`electron/ailis-tool-executor.cjs` 与 Gateway Adapter 负责执行通过验证的契约。

工具输出可以包含：

- 面向用户的文本；
- 结构化内容；
- 图片与媒体；
- 来源引用；
- 工件引用；
- 进程 Session ID；
- 错误与恢复元数据。

模型输入构建器会把这些结果转换成规范 response items，并保持原始 call 配对。

## 网页引用

`web_run` 为搜索结果和打开页面创建稳定引用 ID。后续 open、click、find 操作针对这些引用执行，使导航结果始终与来源连接，而不是返回无法重放的匿名文本。

## 工件

大文件与结构化文档使用 artifact reference，而不是全部拍平成一段 Prompt。Artifact Tools 会保留行、页、Sheet、渲染和验证结果的结构。Prompt 可见摘录保持有界，完整工件仍可被后续工具继续访问。

## 审批与审计

有外部影响的工具在执行前经过策略检查。审批状态绑定到具体 Session、Turn、工具和参数。Gateway 事件会把调用开始、进度、输出、完成、失败与审批状态发送给桌面 UI 和评测 Harness。

## 新增工具

1. 定义或导入契约。
2. 注册 Runtime 实现或平台 Adapter。
3. 声明审批与副作用语义。
4. 把输出规范化为统一工具结果。
5. 增加契约、执行、失败和审批测试。
6. 运行 `pnpm test:ailis-tool-contracts` 与对应工具测试。

新增能力应当保持通用，不能加入 benchmark 题目路由或站点特定答案逻辑。

## 主要源码

| 文件 | 职责 |
| --- | --- |
| `electron/ailis-gateway.cjs` | 注册、策略、执行路由、事件与内置集成 |
| `electron/ailis-tool-contracts.cjs` | Schema、验证、别名与模型可见定义 |
| `electron/ailis-tool-executor.cjs` | 标准化执行与调用结果 |
| `electron/ailis-tool-router.cjs` | Runtime 工具选择与路由 |
| `electron/ailis-standard-tool-packs.cjs` | 标准外部契约与 MCP 工具包 |
| `electron/ailis-artifact-runtime.cjs` | 结构化文档与工件操作 |

完整的模型到工具生命周期见 [TaskAgent Runtime](taskagent.zh-CN.md)。
