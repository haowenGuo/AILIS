# docs/ailis-codex-tool-acquisition-gateway.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。
- 文件类型：`documentation`
- 原始行数：321
- SHA-256：`23a7f21f37e83b3b74fefd200cd949e7278c224426cc07dc7f667d5fe44bd216`
- 可运行副本：[打开源文件](../../../source/docs/ailis-codex-tool-acquisition-gateway.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS 对齐 Codex 的工具/MCP 获取与验收网关设计</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>日期：2026-06-07</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## 结论</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>Codex 的核心思路不是把全世界的工具一次性塞给模型，而是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>1. 内置少量稳定核心工具。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 10 | <code>2. 把外部 MCP 接成受控连接。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>3. 按工具数量和任务需求决定直接曝光还是延迟搜索。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>4. 每次调用都有事件、审批、权限和结果包装。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>5. 新工具进入 runtime 前必须能初始化、能列出 schema、能被转成模型可调用的 tool spec。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>AILIS 本次补齐的是 Codex 风格的“工具获取前置层”：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>```mermaid</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 18 | <code>flowchart LR</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 19 | <code>    U["用户任务"] --&gt; A["AILIS Agent Loop"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 20 | <code>    A --&gt; R["recommend_tools 学习推荐"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 21 | <code>    A --&gt; S["search_tool_candidates 候选搜索"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>    S --&gt; C["核心工具目录"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 23 | <code>    S --&gt; M["MCP Registry"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 24 | <code>    M --&gt; P["plan_mcp_candidate 安装计划"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 25 | <code>    P --&gt; I["install_capability 审批安装"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 26 | <code>    I --&gt; T["MCP smoke test"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 27 | <code>    T --&gt;&#124;通过&#124; E["暴露 direct mcp__server__tool"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 28 | <code>    T --&gt;&#124;失败&#124; B["不暴露给 Agent"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 29 | <code>    A --&gt; O["record_tool_outcome 记录任务-工具效果"]</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 30 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>## Codex 源码级对照</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>### 1. MCP 配置与权限</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>Codex 源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\config\src\mcp_types.rs:21`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 39 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\config\src\mcp_types.rs:130`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 40 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\config\src\mcp_types.rs:167`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 41 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\config\src\mcp_types.rs:171`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 42 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\config\src\mcp_types.rs:424`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>Codex 的 MCP server config 里有 transport、默认审批模式、enabled_tools、disabled_tools、per-tool config、stdio/streamable-http transport。也就是说，MCP 不是裸连，而是先进入配置层，再进入权限/曝光层。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>AILIS 对齐：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>- `F:\AILIS\electron\ailis-mcp-session.cjs` 已有 stdio/http MCP session、config store、tool schema cache。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 49 | <code>- `F:\AILIS\electron\ailis-tool-acquisition-gateway.cjs:258` 把 Registry server 归一化成 AILIS 可安装的 mcpConfig。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 50 | <code>- `F:\AILIS\electron\ailis-runtime.cjs:937` 把 `plan_mcp_candidate`、`record_tool_outcome` 等动作纳入权限分类。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>### 2. MCP 连接管理</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>Codex 源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:71`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 57 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:171`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 58 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:334`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 59 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:403`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\codex-mcp\src\connection_manager.rs:590`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>Codex 的 `McpConnectionManager` 负责 server startup、status event、list tools、call tool、shutdown。模型并不直接管理进程，而是调用 runtime 暴露的工具。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>AILIS 对齐：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>- `F:\AILIS\electron\ailis-mcp-session.cjs:722` 是 AILIS 的 MCP Manager。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 67 | <code>- `F:\AILIS\electron\ailis-capability-manager.cjs:549` 使用 Tool Acquisition Gateway 生成 plan，再交给已有安装器。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 68 | <code>- `F:\AILIS\electron\ailis-capability-manager.cjs:568` 暴露临时 smoke test，但要求 approval。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>### 3. MCP tool spec 转换</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>Codex 源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:29`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 75 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:77`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 76 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:191`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 77 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\mcp.rs:225`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>Codex 的 `McpHandler` 做三件事：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>1. 把 MCP tool 转成模型可见的 namespace tool。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>2. 调用时把参数交给 MCP connection manager。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>3. 为 tool_search 构造搜索文本。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>AILIS 对齐：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>- `F:\AILIS\electron\ailis-mcp-session.cjs:129` 已有 `makeMcpToolSpec`，输出 `mcp__server__tool` direct spec。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 88 | <code>- `F:\AILIS\electron\ailis-mcp-session.cjs:936` 已有 `listToolSpecs`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 89 | <code>- `F:\AILIS\electron\ailis-mcp-session.cjs:941` 已有 `searchToolSpecs`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>### 4. 直接曝光 vs 延迟搜索</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>Codex 源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs:10`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 96 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs:17`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 97 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\mcp_tool_exposure.rs:32`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>Codex 有 `DIRECT_MCP_TOOL_EXPOSURE_THRESHOLD = 100`。工具少时直接暴露；工具多时走 tool_search 延迟加载，避免 prompt 被 schema 淹没。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>AILIS 对齐：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>- `F:\AILIS\electron\ailis-tool-specs.cjs` 已定义 direct/deferred tool exposure。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 104 | <code>- `F:\AILIS\electron\ailis-agent-runner.cjs:1853` 已要求普通任务优先用 `mcp__server__tool` direct tool，`mcp_bridge` 只做管理。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 105 | <code>- 本次新增 `F:\AILIS\electron\ailis-tool-acquisition-gateway.cjs:413`，把“还没安装的 MCP 候选”也放到延迟搜索层，而不是直接暴露。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>### 5. Tool Search</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>Codex 源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:23`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 112 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:46`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 113 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:112`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 114 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\handlers\tool_search.rs:130`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>Codex 使用 BM25 搜索 deferred tools，然后 coalesce 成可加载 tool spec。AILIS 当前先用轻量关键词评分，后续可以替换成 BM25/向量索引，但接口已经留好。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>AILIS 对齐：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>- `F:\AILIS\electron\ailis-tool-acquisition-gateway.cjs:413`：搜索核心工具和 MCP Registry。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 121 | <code>- `F:\AILIS\electron\ailis-tool-acquisition-gateway.cjs:496`：搜索官方 Registry。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 122 | <code>- `F:\AILIS\electron\ailis-capability-manager.cjs:545`：通过 `capability_manager.search_tool_candidates` 暴露给 Agent。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>### 6. 工具失败后的恢复搜索</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>Codex 不是在 runtime 里硬编码“某个工具失败后必须调用 tool_search”。它的主链是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>1. 工具调用失败时，handler/registry 返回 `FunctionCallError::RespondToModel(...)`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 129 | <code>2. 失败被写成模型可见的 tool output。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 130 | <code>3. 下一轮模型仍然看到 `tool_search` 这个正式工具，可以自主搜索 deferred tools。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 131 | <code>4. transcript repair 会保证 `ToolSearchCall` 和 `ToolSearchOutput` 成对存在，避免历史坏掉。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>对应源码：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:378`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 136 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\registry.rs:427`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 137 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\tools\router.rs:106`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 138 | <code>- `F:\AILIS\build-cache\codex-runtime\codex-rs\core\src\context_manager\normalize.rs:41`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>AILIS 按 Codex 边界对齐，不在 runtime 里自动调用 `recommend_tools` 或 `search_tool_candidates`：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>- Tool Runtime：执行工具，返回 success/failure。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 143 | <code>- Agent Runner：把失败包装成 `tool_result` observation，附带错误类型、预览和 recovery hint。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 144 | <code>- Turn Items：把失败 observation 放进 `recent_turn_items.latest_failed_observation` 和时间线。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 145 | <code>- 下一轮 Agent Decision：模型自己根据 observation 决定是否调用 `tool_search`、`capability_manager.recommend_tools`、`capability_manager.search_tool_candidates`、`request_permissions` 或其他工具。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>对应 AILIS 文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>- `F:\AILIS\electron\ailis-agent-runner.cjs`：`buildToolResultEvent` 负责构造模型可见失败 observation。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 150 | <code>- `F:\AILIS\electron\ailis-turn-items.cjs`：`buildTurnItemsPromptObject` 保留 `latest_failed_observation`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 151 | <code>- `F:\AILIS\electron\ailis-agent-runner.cjs`：Agent Prompt 明确说明工具失败不是最终阻塞，下一轮可以换工具、换策略、请求上下文或 final。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 152 | <code>- `F:\AILIS\electron\ailis-agent-runner.cjs`：`sanitizeLlmStep` 允许模型直接调用 `tool_search`、`capability_manager`、`request_permissions`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>这意味着外部 MCP Registry 搜索、工具推荐、安装计划和 smoke test 都必须由模型显式选择，不由 runtime 在失败后偷偷触发。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 156 | <code>## 本次新增的 AILIS 能力</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>### 1. 内置少量核心工具目录</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>实现：`F:\AILIS\electron\ailis-tool-acquisition-gateway.cjs:10`</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>核心能力包：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>- `core:file_system`：文件读取、写入、搜索、整理、hash、回滚前检查。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 165 | <code>- `core:command_line`：命令行、PTY、stdin、长会话。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 166 | <code>- `core:browser`：网页搜索、抓取、截图、网页 MCP。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 167 | <code>- `core:git`：status、diff、commit、PR/CI 工作流。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 168 | <code>- `core:python`：Python 脚本、数据处理、验证。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 169 | <code>- `core:document_parse`：PDF、Markdown、JSON、CSV、表格文档解析。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 170 | <code>- `core:media`：音频、视频、图片、转写、转换。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 171 | <code>- `core:ocr`：截图读屏、OCR、视觉信息提取。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>这些会进入 Capability Registry：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>- `F:\AILIS\electron\ailis-capability-manager.cjs:706`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>### 2. MCP Registry 接入</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>官方 Registry endpoint：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>- [MCP Registry](https://registry.modelcontextprotocol.io/)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 182 | <code>- [官方 remote servers 说明](https://modelcontextprotocol.io/registry/remote-servers)</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 183 | <code>- 实际 API：`https://registry.modelcontextprotocol.io/v0/servers?limit=2`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>实现：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>- `F:\AILIS\electron\ailis-tool-acquisition-gateway.cjs:7`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 188 | <code>- `F:\AILIS\electron\ailis-tool-acquisition-gateway.cjs:496`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 189 | <code>- `F:\AILIS\electron\ailis-tool-acquisition-gateway.cjs:527`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>Registry entry 会被归一化成：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 194 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 195 | <code>  type: "mcp_candidate",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 196 | <code>  source: "official_mcp_registry",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 197 | <code>  install: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 198 | <code>    sourceKind: "mcp_config",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 199 | <code>    mcpConfig: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 200 | <code>      transport: "http",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 201 | <code>      url: "...",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 202 | <code>      protocolVersion: "2025-06-18"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 203 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 204 | <code>  },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 205 | <code>  smokeProfile: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 206 | <code>    exposePolicy: "only_expose_after_all_required_checks_pass"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 207 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 208 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 209 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 211 | <code>如果 remote MCP 要求 Authorization header，AILIS 会生成约定环境变量名，例如：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 213 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 214 | <code>AILIS_MCP_IO_EXAMPLE_SECURE_MAIL_TOKEN</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 215 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>### 3. MCP 验收机制</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 219 | <code>实现：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>- `F:\AILIS\electron\ailis-tool-acquisition-gateway.cjs:330`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 222 | <code>- `F:\AILIS\electron\ailis-tool-acquisition-gateway.cjs:686`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 223 | <code>- `F:\AILIS\electron\ailis-capability-manager.cjs:568`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 225 | <code>验收规则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 227 | <code>1. MCP config 静态形状正确。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 228 | <code>2. MCP initialize 成功。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 229 | <code>3. `tools/list` 返回至少一个 tool schema。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 230 | <code>4. AILIS 能把 tools 转成 `mcp__server__tool` direct spec。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 231 | <code>5. 不通过则不进入 registry，不暴露给 Agent。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>已有安装链路已经做了健康检查和回滚：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>- `F:\AILIS\electron\ailis-capability-manager.cjs:850` 附近注册 MCP。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 236 | <code>- `F:\AILIS\electron\ailis-capability-manager.cjs:861` 附近 health check。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 237 | <code>- `F:\AILIS\electron\ailis-capability-manager.cjs:873` 附近 list tools。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>### 4. 任务到工具学习表</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>实现：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>- `F:\AILIS\electron\ailis-tool-acquisition-gateway.cjs:755`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 244 | <code>- `F:\AILIS\electron\ailis-tool-acquisition-gateway.cjs:832`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>状态文件：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 248 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 249 | <code>F:\AILIS\.ailis-state\tool-acquisition\tool-learning.json</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 250 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>记录格式是：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 255 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 256 | <code>  signature: "任务签名",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 257 | <code>  taskText: "用户任务文本",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 258 | <code>  toolStats: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 259 | <code>    "mcp__ocr_docs__extract_text": {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 260 | <code>      uses: 3,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 261 | <code>      successes: 2,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 262 | <code>      failures: 1,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 263 | <code>      scoreSum: 2</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 264 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 265 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 266 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 267 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>Agent 使用方式：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>1. 先 `recommend_tools` 查相似任务验证过的工具。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 272 | <code>2. 如果没有足够工具，再 `search_tool_candidates`。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 273 | <code>3. 安装/执行/复核完成后，`record_tool_outcome` 记录结果。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 275 | <code>## Agent 可调用的新动作</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>通过 `capability_manager` 暴露：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>- `list_core_tools`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 280 | <code>- `search_tool_candidates`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 281 | <code>- `plan_mcp_candidate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 282 | <code>- `build_smoke_profile`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 283 | <code>- `smoke_mcp_candidate`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 284 | <code>- `record_tool_outcome`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 285 | <code>- `recommend_tools`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 286 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 287 | <code>契约位置：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>- `F:\AILIS\electron\ailis-tool-contracts.cjs`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 290 | <code>- `F:\AILIS\electron\skills\capability_manager\SKILL.md`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 291 | <code>- `F:\AILIS\electron\ailis-agent-runner.cjs:1865`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>## 已跑验收</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>新增/相关测试：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>- `pnpm test:ailis-tool-acquisition`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 298 | <code>- `pnpm test:ailis-tool-contracts`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 299 | <code>- `pnpm test:ailis-capability-manager`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 300 | <code>- `pnpm test:ailis-skills`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 302 | <code>测试覆盖：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>- `F:\AILIS\tests\ailis-tool-acquisition-gateway.test.mjs:82`：核心工具 + Registry 候选搜索。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 305 | <code>- `F:\AILIS\tests\ailis-tool-acquisition-gateway.test.mjs:116`：任务-工具学习与推荐。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 306 | <code>- `F:\AILIS\tests\ailis-tool-acquisition-gateway.test.mjs:144`：Capability Manager 通过 Registry 候选生成 MCP 安装计划。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>## 与 Codex 仍有差距</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 310 | <code>1. 搜索排序：Codex 用 BM25，AILIS 目前是轻量关键词评分。接口已隔离，后续可以替换。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 311 | <code>2. OAuth：AILIS 目前支持 bearerTokenEnvVar，复杂 OAuth/browser login 还没做。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 312 | <code>3. Registry 安装面：remote streamable-http 已可计划安装；npm/GitHub 包仍走现有 plan_install 分支，尚未对所有 Registry package schema 做深度适配。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 313 | <code>4. Tool result guard：AILIS 有 contract/evidence 体系，但对 MCP 返回的 schema/内容截断/多模态结果保护还不如 Codex 完整。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 314 | <code>5. 官方插件生态：Codex 还有 connector/plugin install relay；AILIS 当前先以 MCP Registry + 本地 Skill 为主。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 316 | <code>## 推荐下一步</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>1. 在任务完成路径自动调用 `record_tool_outcome`，不要靠模型自觉记录。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 319 | <code>2. 给常见 GAIA 失败类型建立种子学习表：网页/PDF/OCR/音频/表格/邮件。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 320 | <code>3. 把 Registry 搜索从关键词评分升级为 BM25。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 321 | <code>4. 补 OAuth remote MCP 的登录 UI 和 token refresh。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
