# AILIS 与 Codex：沙箱及安全完成度检查

日期：2026-09-07。范围：当前 `F:/AILIS/main` 工作区代码（包含既有未提交改动），不是冻结 GAIA 评测 snapshot，也不代表已经安装的每个桌面/网页部署均使用这份代码。

本轮仅做源码审阅、两项既有局部测试和内存中的策略函数检查。没有启动模型调用、重跑评测、执行越权命令、探测外部服务、修改安全配置或修复实现。本报告不是完整渗透测试或安全认证。

## 结论

GAIA 衡量模型、工具、环境、预算、评分适配共同构成的系统表现，不是纯粹的通用 Agent 能力。专用工具是影响变量；当前比较没有隔离变量，不能证明更高分就是专用工具造成。

AILIS 已有工具网关、权限判断、审批事件、受限的 exec 编排进程、审计及部分恢复机制。但真实终端和 MCP 执行端尚未形成等同于 Codex 受限模式的操作系统级沙箱。默认桌面配置还主动选择全权限和自动批准。应评价为“安全基础设施已部分实现，产品级强隔离尚未闭环”，不能给没有验收标准支持的完成百分比。

## 概念：四件不同的事

1. 提示词规则：告诉模型不应该做什么，属于行为引导。
2. 权限/审批：宿主决定某项操作是否被授权；同意一次不应自动变成所有后续操作都同意。
3. 沙箱：即使模型生成了错误或恶意代码，执行进程及子进程仍无法访问授权外的文件、网络和系统资源。
4. 审计/恢复：知道做了什么，尽可能恢复；记录日志不能预防泄漏，恢复文件不能撤销已经发送的邮件。

Docker/虚拟机、操作系统权限隔离、语言运行时限制属于不同层次。给每题一个目录、给每个 worker 一份登录文件能减少冲突，但不等于权限隔离。容器也必须审查宿主挂载、凭据和网络权限，不能仅凭“使用 Docker”判断安全。

## Codex 官方机制

### 文件、进程和网络

官方说明，沙箱覆盖生成命令及其派生程序，而不仅是内置的文件工具。macOS 使用 Seatbelt；Linux/WSL 使用基于 bubblewrap 的隔离；原生 Windows 首选 elevated 模式，通过专门的低权限用户、文件权限边界、防火墙等执行限制。Windows fallback unelevated 使用受限令牌和 ACL，网络隔离更弱。这里 elevated 指更强隔离所需的设置方式，不表示给模型管理员权限。

来源：[Sandbox](https://learn.chatgpt.com/docs/sandboxing)，[Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox)。

### 审批与网络控制不是同一个开关

`workspace-write` 限定常规工作范围；跨边界动作按审批策略处理。`never` 只表示不弹审批，本身不取消沙箱；`danger-full-access` 才取消沙箱限制。命令网络开放后，可另外启用 network proxy 和目标域规则；只写域规则但不启用该功能，不会自动限制直接出网。

命令沙箱的网络代理不覆盖所有产品连接。网页搜索、MCP、浏览器、连接器等有独立控制面。Codex 的 MCP/应用副作用审批会参考工具标注，也不能理解为“任意插件自动被同一个终端沙箱关住”。

来源：[Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security)。

### 不能用本地旧评测来证明 Codex 的沙箱表现

历史原生 Codex GAIA runner 明确传入 `--dangerously-bypass-approvals-and-sandbox`，还使用 `--ignore-rules`。因此以前比的是任务成绩，不是受限安全模式的能力。

证据：[历史 runner](F:/AILIS_self_evolution_runtime/scripts/run-codex-native-gaia-mini20.mjs:185)。本次 Codex 对话也处于用户环境配置的 full access，并非沙箱开启状态。

## AILIS 当前已实现的部分

| 层 | 证据 | 评价 |
| --- | --- | --- |
| 工具入口 | Gateway 校验工具允许列表、参数、运行时权限，再进入前后置 EMBER 检查 | 有真实执行入口，不只是提示词 |
| exec 编排隔离 | 独立 Node 子进程、Node permission 参数、VM 禁动态字符串/WASM、拒绝导入；通过 IPC 调用允许的工具 | 有实现，局部测试通过；不是底层工具的 OS 沙箱 |
| 权限与审批 | read-only/workspace-write/full 等 profile，approval 事件、turn/session 权限记录 | 有框架，但存在分类和信任边界缺口 |
| 文件操作 | 显式文件路径/工作目录检查；部分文件操作可快照、隔离或恢复 | 应用层保护，不限制任意 shell 程序的系统调用 |
| 审计、输出与生命周期 | 工具调用/结果记录、输出存档、部分超时和进程生命周期控制 | 有基础，不能等同于防越权和防外泄 |

证据：[Gateway](F:/AILIS/main/electron/ailis-gateway.cjs:2744)、[exec 启动](F:/AILIS/main/electron/ailis-code-mode-runtime.cjs:20)、[编排 VM](F:/AILIS/main/electron/ailis-code-mode-worker.cjs:54)、[嵌套分发](F:/AILIS/main/electron/ailis-code-mode-runtime.cjs:336)。

实际边界：

```text
模型生成 exec JavaScript
        ↓
受限编排子进程：只通过 tools.* 请求能力
        ↓ IPC
宿主 Gateway：工具允许列表、权限、可选 EMBER
        ↓
真实 exec_command / MCP 服务：普通宿主子进程
```

编排进程不能直接拿文件和网络，不代表通过 tools.exec_command 启动的 Python、PowerShell 也被它的限制覆盖。

## 主要缺口及代码证据

### P0：真实命令执行没有落地 OS 级最小权限

`exec_command` 检查 workdir 和 approved 后，直接使用 `spawn`；平台适配器设置工作目录、shell 和环境变量，没有在这条调用链上设置低权限用户、受限令牌、受限文件系统或强制网络边界。

因此工作目录位于项目内，不等于命令只能访问项目；shell 里的 Python 仍是普通进程。显式文件工具阻止某个路径，也不等于任意程序访问该路径会被 OS 拒绝。

证据：[exec_command](F:/AILIS/main/electron/ailis-computer-tool.cjs:2958)、[spawn](F:/AILIS/main/electron/ailis-computer-tool.cjs:3025)、[平台启动参数](F:/AILIS/main/electron/ailis-platform-adapter.cjs:418)。本轮没有实际访问禁止路径。

### P0：桌面默认策略过宽

`DEFAULT_COMPUTER_CONTROL_ENABLED=true`、`DEFAULT_EMBER_HARNESS_MODE='off'`。电脑控制开启后，默认上下文使用 `danger-full-access`、`approvalPolicy='auto'`、`approved=true`、允许工作区外访问。它是显式设计选择，不是沙箱开启。

关闭电脑控制后虽切到 workspace-write/on-request，但仍不能把应用层 profile 当作完整 OS 隔离。

证据：[默认偏好](F:/AILIS/main/electron/store.cjs:151)、[桌面默认上下文](F:/AILIS/main/electron/main.cjs:2618)、[EMBER 接线](F:/AILIS/main/electron/main.cjs:3116)。这里说明代码默认值，未读取用户持久配置，不断言当前所有部署都处于同一状态。

### P0：本地 Gateway 的调用身份与权限上下文缺少强边界

默认监听 127.0.0.1；HTTP 处理直接路由 `/tools/call` 等接口；所审阅入口未见请求鉴权/来源校验，CORS 是 `*`。`mergeDefaultContext` 用调用者 context 覆盖宿主默认值，包含 permissionProfile/approved 这类权限字段。

内存验证确认，一个请求上下文可把该合并函数的 read-only/approved=false 覆盖成 full-access/approved=true。本轮未向实际运行服务发送操作请求；不能据此宣称已成功完成远程攻击，但这些代码组合已经构成应优先修复的信任边界风险。绑定本机地址不是调用身份认证，浏览器行为还受浏览器自己的本地网络策略影响。

证据：[HTTP 入口](F:/AILIS/main/electron/ailis-gateway.cjs:2154)、[工具调用路由](F:/AILIS/main/electron/ailis-gateway.cjs:2204)、[CORS](F:/AILIS/main/electron/ailis-gateway.cjs:2367)、[上下文合并](F:/AILIS/main/electron/ailis-gateway.cjs:1609)。

### P0/P1：网络标记没有覆盖终端中的真实出网

运行时 `network='none'` 的拒绝分支只检查 external/mcp 分类；exec_command 是 exec_capable。内存检查确认，shell 已授权且 network=none 时，exec_command 策略仍返回 allowed。后续普通 spawn 又没有对应强制网络隔离，因此“禁网”未在这条链上闭环。

证据：[网络策略](F:/AILIS/main/electron/ailis-runtime.cjs:1440)。测试只判断策略，没有执行网络请求。

### P1：MCP 权限分类过宽，进程继承宿主环境

直接 MCP 工具在通用分类器中统一标记 `mutates=false`、`requiresApprovalCapable=false`，没有基于实际工具的读写/外发能力分级。不能假设所有 MCP 工具都是只读。MCP stdio 服务用普通 spawn，并合并完整 `process.env`，未在该启动点做按服务最小化的环境变量授权。

证据：[MCP 分类](F:/AILIS/main/electron/ailis-runtime.cjs:1223)、[MCP 启动](F:/AILIS/main/electron/ailis-mcp-session.cjs:318)。环境继承是暴露面，不是已经发生泄漏的证据；本轮未读取任何密钥值。

### P1：保留的子代理启动路径会扩权

Gateway 的子代理上下文构建硬编码 unrestricted、danger-full-access、never、approved=true、allowSystemMutation=true。应改成继承并收紧父权限，不能因创建子代理自动升级。此结论针对该可达性仍需结合功能配置判断的启动路径，不把它误称为每轮统一主 Agent 都在走的默认路径。

证据：[子代理上下文](F:/AILIS/main/electron/ailis-gateway.cjs:4257)。

### P1：EMBER 是内容检查，不是沙箱；错误时不阻断

Gateway 默认接入的是敏感词匹配分类器，不是一个能够解释操作系统权限的隔离器。即使开启 enforce，只有 decision=block 才阻断。检查器异常返回 review，blocked=false；本轮内存验证得到同样结果，Gateway 只依据 blocked 决定是否阻止工具。

开启 EMBER 可以增加一道内容检查，但不能替代文件、进程、网络和审批边界。

证据：[默认 evaluator](F:/AILIS/main/electron/ailis-gateway.cjs:1346)、[敏感词检查](F:/AILIS/main/electron/ailis-sensitive-word-classifier.cjs:315)、[异常处理](F:/AILIS/main/electron/ailis-ember-harness.cjs:315)、[阻断条件](F:/AILIS/main/electron/ailis-gateway.cjs:2833)。

### P1/P2：文件和资源边界仍需专项验收

路径成员判断主要基于 path.resolve 后的字符串前缀，未在该检查点解析符号链接/Windows junction 的真实目标或处理检查与使用间的路径变化。computer 的 common roots 还包括用户 home，而不只有工作目录。应核对一致的读/写授权根，不能把这些宽范围称为严格 workspace-only。

exec 有存活 cell 数和生命周期限制；仍不能仅凭输出 token 预算认定 CPU、内存、磁盘、子进程总量均受硬限制。本文未做资源耗尽实验。

证据：[路径判断](F:/AILIS/main/electron/ailis-platform-adapter.cjs:273)、[common roots](F:/AILIS/main/electron/ailis-computer-tool.cjs:205)、[cell 限制](F:/AILIS/main/electron/ailis-code-mode-runtime.cjs:17)。

## 验证结果

执行了既有测试：

```powershell
F:\Nodejs\node.exe --test --test-name-pattern='exec isolate|unexposed tools' tests/ailis-code-mode-runtime.test.mjs
```

两项均通过：VM 中 process/require/fetch 不可直接用、测试覆盖的 constructor 路径被拒；未开放的工具不可调用。这只是有限用例，不证明所有 VM 逃逸都不存在。

其余只调用内存中的策略/合并/检查器函数，没有执行工具：

| 检查 | 结果 |
| --- | --- |
| read-only 下请求 exec_command | denied，基本只读保护有效 |
| 已授权 shell + network=none 下请求 exec_command | allowed，网络约束未覆盖 shell 分类 |
| 直接 MCP 工具分类 | mutates=false，requiresApprovalCapable=false |
| 请求 context 与宿主默认上下文合并 | 请求值可覆盖权限字段 |
| enforce 检查器抛出异常 | review，blocked=false |

## 建议的最小开发顺序（尚未实施）

1. 收紧控制面：默认不自动全权；Gateway 验证调用身份和来源；权限只由可信宿主记录决定，不接受模型/普通请求自行声明 approved；子代理不扩权。
2. 给真实终端增加一个受限执行 backend：授权读写根、最小权限进程、受控网络、最小环境变量；脚本及孙进程继承限制。exec 编排接口和模型上下文无需因此重写。
3. 把 MCP、浏览器、桌面 GUI 等纳入独立能力授权。不能把它们全部塞进“终端沙箱已覆盖”的结论；需要读写/外发/删除等宿主能力声明和审批。
4. 补安全验收：工作区外写入拒绝、禁止读取的凭据不可读、shell 及子进程禁网、MCP 写入需授权、子代理不扩权、伪造批准无效、取消后子进程收尾、资源超限可终止。

目标不是限制模型如何思考，而是在它选择行动以后，保证所有真实执行都不超过用户实际授权。

## 补充检查：日志、验证与回退的实际边界

### Codex 中的验证要区分安全授权与任务正确性

安全授权是在执行前决定是否允许某一动作。官方 app-server 审批请求包括 threadId、turnId、itemId、命令、工作目录等，由客户端返回批准或拒绝，之后产生完成事件。可选 Auto-review 用独立 reviewer 审核需要审批的动作，不是默认把全部动作都交给另一模型检查，也不取代 OS 沙箱。

任务正确性则需要测试、编译、结果检查或人工审阅。进程 exitCode=0 只说明命令正常退出，不证明答案正确。Codex 的 /review 提供代码审阅，不是对任意任务自动判真的通用 verifier。

来源：[app-server 审批协议](https://learn.chatgpt.com/docs/app-server)、[Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review)、[Code review](https://learn.chatgpt.com/docs/code-review)。

### Codex 日志和回退不是同一个存储系统

官方 app-server 用 Thread、Turn、Item 组织记录，命令项含 command/cwd/status/output/exitCode/duration 等；文件修改项可含 path/kind/diff，MCP 项有参数、结果或错误。不能从这些字段推断系统完整记录了子进程内部的每一次文件读写。日志也可能包含敏感材料，不是可任意公开的内容。

官方 review pane 支持按全部 diff、文件、hunk 进行 Git revert。面板反映 Git 工作区状态，可能包含用户自己的改动，不应把所有变更都当成 Agent 产生。

官方 thread/rollback 则是对话上下文回退，写入 rollout 标记；文档已标记该接口 deprecated。它不是磁盘、操作系统或外部服务的事务回滚。不能把日志恢复、对话恢复、Git 恢复和整机快照混为一谈。

本轮未验证某个具体安装版本私有/旧版 checkpoint 的底层实现，不以猜测补充所谓“每轮自动备份整机”。

来源：[app-server](https://learn.chatgpt.com/docs/app-server)、[Git review/revert](https://learn.chatgpt.com/docs/code-review)。

### AILIS 已有实际日志，但不是防篡改审计

运行时 transcript 在 appendItem 中分配 id、seq、时间、runId/sessionId/type/status/payload，并追加 JSONL；Gateway 也写 audit.jsonl，记录调用结果等。存在字段脱敏逻辑，但本轮没有证明所有自由文本、原始输出、附件中的秘密都被覆盖。

这些是普通本地文件。所检查实现没有给它们建立独立于 Agent 执行权限的不可修改存储边界，不应宣称具备防篡改审计保证。

证据：[transcript 写入](F:/AILIS/main/electron/ailis-runtime.cjs:852)、[audit 写入](F:/AILIS/main/electron/ailis-gateway.cjs:6305)。

### AILIS 的文件回退：覆盖不完整，并存在历史版本覆盖问题

computer 的 write/write_binary/mkdir/copy/move/delete 等路径调用 createRollbackSnapshot，把备份写进工作区下的 .ailis-rollback，并在 journal.jsonl 中记录回退 ID。恢复动作要求批准。默认快照大小限制为 100 MiB，允许参数调整，超限会标记 skipped；rollback=false 或 skipRollback=true 可跳过。

但有三项明确限制：

1. exec_command 不会自动快照程序之后可能修改的任意文件。
2. Gateway 的直接 apply_patch 路径直接写入/删除目标，没有调用这套快照。
3. snapshotPath 只由目标绝对路径的哈希及 basename 确定，不含操作 ID/版本。对同一个文件第二次快照会删除旧备份再复制新内容。因此多个 journal ID 可以指向同一个被覆盖的备份。

本轮用源码中的原始快照函数、纯内存的 fsp/copy/stat 替身验证第3项，无真实文件写入：

```text
首次快照：保存 A，产生回退 ID 1
文件变化：A -> B
再次快照：保存 B，产生回退 ID 2

ID 1 != ID 2
两个 ID 的 snapshotPath 相同
ID 1 现在读到 B，而不是当时保存的 A
```

因此应把它称为“部分工具接入的有限备份/恢复”，不能称为可靠的多版本任务回退。该缺陷本轮只诊断，未修复。

证据：[快照地址](F:/AILIS/main/electron/ailis-computer-tool.cjs:811)、[覆盖快照](F:/AILIS/main/electron/ailis-computer-tool.cjs:850)、[按 ID 恢复](F:/AILIS/main/electron/ailis-computer-tool.cjs:1977)、[直接 apply_patch](F:/AILIS/main/electron/ailis-gateway.cjs:5898)。

此外，EMBER 的 snapshot/rollbackTo 保存的是文本哈希、阶段和引用等检查信息，不是计算机磁盘快照。不要仅凭字段叫 rollbackTo 就认为已经执行了文件恢复。

### 沙箱开发的工程分层

以下是根据上述已确认机制提炼的工程实现步骤，不是声称已经复刻 Codex 内部所有源代码：

1. 权限对象：把用户授权表达为读范围、写范围、联网范围及例外有效期；读和写必须分开，workspace-write 不自动等于“只能读取项目”。
2. 可信启动器：把权限转成平台可强制执行的机制，初始化失败时不能静默退成 unrestricted。
3. 受限进程：实际 shell、Python、MCP worker 及派生进程在边界内运行；其他外部工具也要有独立能力控制。
4. 审批通道：动作与批准记录关联，重新核验执行的动作，不能让模型自行填写 approved=true 获得权限。
5. 输出与记录：返回真实退出码、错误和输出，记录授予了什么例外；超时和取消不能被伪装为成功。
6. 独立恢复：Git、操作版本化备份或合适的快照，不依赖对话日志充当文件备份。
7. 对抗验收：不能只测正常 echo；必须测试范围外访问、链接绕过、脚本派生进程、网络旁路、伪造授权、资源耗尽及恢复后的内容一致性。

沙箱限制损害范围，不保证项目内的代码一定正确，也不能撤销已经离开本机的数据、已发送邮件等外部副作用。
