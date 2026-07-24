# 04｜工具、权限、证据与 Human-in-the-Loop

## 1. 工具层解决的不是“能不能调用函数”

一个可靠工具调用必须同时回答：

1. 模型是否选择了存在且适合的能力？
2. 参数是否满足 schema？
3. 当前平台是否实现该能力？
4. 当前 permission profile 是否允许？
5. 是否有副作用、风险或需用户审批？
6. 执行是否超时、取消或部分完成？
7. 返回值怎样成为模型可理解的 observation？
8. 哪些结果是可引用 evidence，哪些只是诊断？
9. 大输出/文件/图片放在哪里？
10. 审计记录能否还原谁在何时做了什么？

AILIS 因此把 contract、router、runtime、adapter、Gateway、artifact、evidence 和
Persona Surface 分开。

## 2. 关键模块地图

| 模块类型 | 典型路径 | 责任 |
| --- | --- | --- |
| 工具契约 | `electron/ailis-tool-contracts.cjs` | id、schema、风险、experience、返回约定 |
| 契约编译 | contract compiler 相关模块 | 将定义编译为模型/运行时可用形态 |
| 路由 | tool router/routing 相关模块 | 选择 direct、MCP、artifact、platform 等通道 |
| Gateway | `electron/ailis-gateway.cjs` | 统一入口、审批、事件、审计、错误与 observation |
| Runtime | `electron/ailis-runtime.cjs` | 经许可的文件、执行、补丁、上下文和 MCP 行为 |
| 平台适配 | `ailis-platform-adapter.cjs` 等 | 桌面/Hosted/OS 差异 |
| MCP 管理 | mcp manager/server 相关模块 | 外部服务器发现、会话、调用、故障恢复 |
| 领域工具 | file/email/computer/code/artifact 等 | 领域参数、执行与结果 |
| 能力管理 | capability/tool acquisition/self-debug | 缺失能力、安装验证、诊断修复 |
| Agent guard | `ailis-agent-runner.cjs` | 模型调用形态、循环、证据和完成门 |

逐文件入口见 [全模块目录](../generated/MODULE_CATALOG.md)。

## 3. Contract 是第一道边界

Tool contract 应声明：

- 稳定 tool id 和用户可理解的能力名称；
- 输入 JSON schema、必填字段、枚举和限制；
- 读/写/执行/网络/凭据等风险属性；
- 可否 dry-run、可否重试、是否幂等；
- 输出结构、错误代码和 evidence/artifact 字段；
- Persona experience：用户可见动词、审批预览、成功/失败表达；
- 平台或配置前置条件。

模型描述不能代替运行时校验。schema 通过也不等于权限通过。

## 4. Permission Profile

运行时会把上下文规范成 permission profile，典型维度包括：

- 允许读取的根路径；
- 允许写入的根路径；
- shell/exec 是否允许；
- 网络或外部服务是否允许；
- 只读、受限或 full-control 模式；
- 用户已批准的具体动作。

路径检查必须先解析绝对路径，再做 containment；不能只用字符串前缀，也不能信任
`..`、符号链接或 shell 展开后的路径。批量写入/删除要解析每个真实目标。

## 5. 风险与审批

### 通常低风险

- 在已授权范围内读取文件；
- 查询状态、列目录、检索公开信息；
- dry-run 和 schema 验证；
- 读取已生成的 artifact。

### 通常需要更强约束或审批

- 写入、覆盖、移动或删除；
- 执行 shell/代码；
- 发邮件、发布、提交表单；
- 电脑鼠标键盘操作；
- 安装工具/技能或改变系统配置；
- 读取凭据或跨出 workspace；
- 产生费用或外部不可逆影响。

风险不是只按 tool id 决定。同一文件工具的 read 与 delete 不同，同一 email 工具的
list 与 send 不同；要结合 action、参数、目标和当前 profile。

## 6. Human-in-the-Loop 的正确位置

Human-in-the-Loop 不是“每一步都弹框”，而是在确定性安全边界需要新授权时停住：

```text
模型给出语义计划
→ 确定性层发现本次具体动作超出已授权边界
→ 生成安全预览（做什么、对谁、影响什么）
→ Persona 用自然语言向用户确认
→ 用户批准/拒绝
→ 批准绑定 action + target + 参数摘要 + 时效
→ 执行或终止
→ 结果与审批证据一起审计
```

不能让模型自己声明 `approved=true`；批准必须来自受信宿主/UI 上下文。

## 7. Observation、Artifact 与 Evidence

### Observation

工具执行的规范化结果，可含 status、text、structured data、error、usage。它是下一轮
模型的输入，但仍可能不完整或不可信。

### Artifact

文件、表格、图片、PDF、长日志、上下文存储对象等可持久引用产物。大内容放 artifact，
模型上下文只放摘要和引用，必要时再 query。

### Evidence

支持最终声明的可追溯材料，至少应有稳定 ref、来源、与问题的相关性。工具成功并不
自动表示 evidence sufficient。例如“搜索返回 10 条”不等于已经打开和核实目标页面。

### 完成门

finalization 应检查：

- 用户要求的每个字段是否解决；
- source/evidence ref 是否存在且可用；
- 结果是否来自真实 observation，而非模型臆测；
- exact answer 是否符合格式/粒度；
- 是否仍有 selection、relation、visual enumeration 等证据缺口；
- 是否把“已尝试”误报为“已完成”。

## 8. 错误标准化

建议保持稳定状态语义：

| 状态 | 含义 | 能否直接重试 |
| --- | --- | --- |
| `not_found` | 目标/工具不存在 | 先修正目标 |
| `needs_config` | 缺少账号、key、runtime | 配置后重试 |
| `needs_approval` | 等待用户明确许可 | 批准后续跑 |
| `blocked` | policy 明确禁止 | 不应偷偷绕过 |
| `timeout` | 超过有界时间 | 可按幂等性判断重试 |
| `cancelled` | 用户或宿主中止 | 不自动继续 |
| `tool_failed` | 真实执行失败 | 让模型基于诊断改道 |
| `partial` | 有部分结果 | 明确剩余工作 |
| `completed` | 契约和证据都满足 | 可交付 |

Persona Renderer 可以把代码转换成自然表达，但底层状态必须保留。

## 9. MCP 与外部能力

MCP 把外部服务器的工具引入统一表面。审查外部工具时还要检查：

- server 启动/连接/健康/重连；
- 工具列表是否可信、是否经过 compact exposure；
- 外部 schema 与 AILIS contract 的映射；
- timeout、取消和进程清理；
- 外部返回中的 prompt injection；
- 凭据和环境变量是否最小暴露；
- server 不可用时的 fallback 和 Persona 解释。

`scripts/mcp-ailis-research-server.cjs` 等大文件属于外部研究/检索能力实现，不能因为
它们是 MCP 就跳过权限和 evidence 门。

## 10. Computer Use

电脑操作工具把观察和动作分开：

1. 获取屏幕/窗口/区域上下文；
2. 模型基于图像和任务决定动作；
3. 对高风险动作审批；
4. adapter 执行点击、键盘等；
5. 再观察确认真实效果；
6. 将 before/after 或结构化结果作为 evidence。

“调用点击函数成功”只表示输入事件已发送，不表示目标应用真的完成了操作。

## 11. File、Code 与 Patch

- Read 应受根路径约束并限制体积。
- Write/Patch 要解析所有目标，区分新建和覆盖。
- Exec 要有 cwd、命令、timeout、输出上限和 exit code。
- 长 stdout/stderr 应存 output store，并给模型摘要/查询接口。
- Patch 成功后应读取/测试验证，不以工具 exit 0 代替功能正确。
- 删除/覆盖必须在用户授权范围内，尽量可恢复。

## 12. Email

邮件工具至少区分 list/read/draft/send。send 是外部副作用，需要明确账户、收件人、
主题、正文和附件预览。凭据缺失应返回 `needs_config`；草稿成功不等于发送成功；
发送结果应有 provider/message id 或明确失败证据。

## 13. 修改或新增工具的闭环

1. 定义 id、schema、action 和风险。
2. 添加 contract 与用户 experience。
3. 在 router/runtime/adapter 中实现，不绕过 Gateway。
4. 加路径、权限、审批和 secret 处理。
5. 标准化 success/error/partial/cancelled。
6. 设计 artifact/evidence refs。
7. 加 contract、runtime、Gateway、Agent flow 测试。
8. 加 needs_config、needs_approval、blocked、timeout、cancel 测试。
9. 验证桌面与 Hosted 平台差异。
10. 验证 Persona Surface 不泄露内部协议。

## 14. 人工审计问题

- 这个调用有没有真实副作用？
- 用户看到的预览是否和执行参数完全一致？
- 批准是否可能被复用于不同目标？
- 模型能否用工具输出中的文字绕过 system policy？
- 成功状态有没有真实 after-state 验证？
- evidence ref 能否在压缩/恢复后继续访问？
- error 是否被吞掉后误报 completed？
- secret 是否出现在 console、ledger、artifact、renderer 或 test fixture？
- 并行工具是否可能写同一状态？
- 中断时外部进程、MCP session 和 in-flight map 是否释放？
