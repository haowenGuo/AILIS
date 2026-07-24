# docs/ailis-contract-intake-pipeline.md 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。
- 文件类型：`documentation`
- 原始行数：193
- SHA-256：`e280370bdc57364868ecec3356de65ce07dc519858f428dd143cade66ab156f1`
- 可运行副本：[打开源文件](../../../source/docs/ailis-contract-intake-pipeline.md)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code># AILIS Contract Intake Pipeline</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>日期：2026-06-08</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>## 目标</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>不要手搓每个工具 schema。AILIS 先从成熟来源采集 raw tool spec，再统一编译成 AILIS canonical contract，经过 lint 和 smoke gate 后才允许暴露给 Agent。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>```text</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 10 | <code>MCP Registry / Composio / OpenAPI / LangChain/Pydantic / Codex/OpenHands</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 11 | <code>        -&gt; contract compiler</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 12 | <code>        -&gt; contract linter</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 13 | <code>        -&gt; contract intake state</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 14 | <code>        -&gt; smoke test</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 15 | <code>        -&gt; verified tool exposure</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 16 | <code>        -&gt; GAIA / code task regression</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 17 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>## 成熟来源</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>通过 `capability_manager.list_contract_sources` 查看当前支持的来源：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>- `mcp_registry`：MCP tools/list item。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 24 | <code>- `composio`：SaaS app action/tool catalog。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 25 | <code>- `openapi`：官方 OpenAPI operation。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 26 | <code>- `langchain_pydantic`： typed local tools。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 27 | <code>- `codex_openhands`：文件、命令、patch、session、代码执行类核心工具模式。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>## Canonical Contract</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>编译后每个工具都统一成：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 34 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 35 | <code>  id,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 36 | <code>  source: { type, name, url, rawToolName },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 37 | <code>  purpose,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 38 | <code>  whenToUse,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 39 | <code>  whenNotToUse,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 40 | <code>  preconditions,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 41 | <code>  inputSchema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 42 | <code>  outputSchema,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 43 | <code>  examples,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 44 | <code>  badExamples,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 45 | <code>  alternatives,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 46 | <code>  errors,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 47 | <code>  permissions,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 48 | <code>  risk,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 49 | <code>  mutates,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 50 | <code>  approval,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 51 | <code>  smokeProfile</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 52 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 53 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>## Lint Gate</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>默认最低分是 `75`。以下问题会扣分或拒绝：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>- 缺 `id`、`purpose`、object `inputSchema`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 60 | <code>- 有参数但没有 `required`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 61 | <code>- `additionalProperties` 不是 `false`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 62 | <code>- 参数没有 description。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 63 | <code>- 缺 `whenToUse` / `whenNotToUse`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 64 | <code>- 缺 `preconditions`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 65 | <code>- 缺 valid examples / bad examples。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 66 | <code>- 缺 structured `errors` / recovery。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 67 | <code>- 缺 `alternatives`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 68 | <code>- 缺 `smokeProfile`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 69 | <code>- 缺 permission/scope 声明。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>## Capability Manager Actions</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 74 | <code>{ action: "list_contract_sources" }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 75 | <code>{ action: "compile_contract", rawContract, sourceType, minScore }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 76 | <code>{ action: "lint_contract", contract, minScore }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 77 | <code>{ action: "intake_contracts", contracts, sourceType, minScore }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 78 | <code>{ action: "list_contract_intake", status, query, limit }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 79 | <code>{ action: "bulk_expose_external_tools", composioTools, openapiOperations, mcpTools, includeMcpRegistry, includeInstalledMcp }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 80 | <code>{ action: "list_exposed_external_tools", query, callable, limit }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 81 | <code>{ action: "configure_external_auth_profile", authProfileId, provider, authType, envVar, baseUrl }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 82 | <code>{ action: "list_external_auth_profiles", query, limit }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 83 | <code>{ action: "execute_exposed_external_tool", toolId &#124; exposureId &#124; id &#124; name, args }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 84 | <code>{ action: "smoke_exposed_external_tool", toolId &#124; exposureId &#124; id &#124; name, live? }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 85 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>## Direct External Exposure</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>`bulk_expose_external_tools` 会把外部工具直接放进 Agent 可见的 external exposure set，但不会把不可执行工具伪装成 callable。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>- Installed/live MCP direct specs：`callable=true`，通过 `execute_exposed_external_tool` 走 `mcpManager.callTool` 执行。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 92 | <code>- MCP Registry candidates：`callable=false`，用于规划安装和 smoke test。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 93 | <code>- OpenAPI / Composio / raw MCP specs：默认 `callable=false`，除非已经实现 adapter/auth/executor；否则只作为 contract tool 暴露给 Agent。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 94 | <code>- OpenAPI adapter：`bulk_expose_external_tools` 传 `trustCallable=true`、`enableOpenApiAdapter=true`、`authProfileId` 后，exposure 会带 `adapter.id=openapi_http`。`GET/HEAD/OPTIONS` 可直接执行；`POST/PUT/PATCH/DELETE` 必须先返回或获得审批，批准后才会发送请求体。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 95 | <code>- Composio adapter：`bulk_expose_external_tools` 传 `trustCallable=true`、`enableComposioAdapter=true`、`authProfileId` 后，exposure 会带 `adapter.id=composio_rest_v3`。执行时通过 `POST {baseUrl}/tools/execute/{toolSlug}`，默认需要审批，并使用 `x-api-key` env profile。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>## Auth Profile</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>授权 profile 只保存环境变量引用和账号作用域，不保存真实 key。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 102 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 103 | <code>  action: "configure_external_auth_profile",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 104 | <code>  authProfileId: "github-api",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 105 | <code>  provider: "openapi",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 106 | <code>  authType: "bearer_env",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 107 | <code>  envVar: "GITHUB_TOKEN"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 108 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 111 | <code>  action: "configure_external_auth_profile",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 112 | <code>  authProfileId: "composio-main",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 113 | <code>  provider: "composio",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 114 | <code>  authType: "composio_api_key_env",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 115 | <code>  envVar: "COMPOSIO_API_KEY",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 116 | <code>  baseUrl: "https://backend.composio.dev/api/v3",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 117 | <code>  userId: "local-user"</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 118 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 119 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>支持的 auth type：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>- `none` / `no_auth`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 124 | <code>- `bearer_env`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 125 | <code>- `api_key_env`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 126 | <code>- `basic_env`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 127 | <code>- `composio_api_key_env`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>## Approval</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>`execute_exposed_external_tool` 的审批规则：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>- installed MCP direct tool：沿用 MCP/tool contract 策略。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 134 | <code>- OpenAPI 安全方法：默认可执行，但仍会检查 auth profile。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 135 | <code>- OpenAPI 非安全方法：需要审批，批准后才允许 `POST/PUT/PATCH/DELETE`。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 136 | <code>- Composio：默认需要审批，因为很多 action 会修改外部系统或发送消息。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 137 | <code>- 缺少环境变量时返回 `auth_required`，不会降级成裸请求。</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>返回字段里必须看：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 142 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 143 | <code>  callable,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 144 | <code>  verified,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 145 | <code>  verification,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 146 | <code>  callableReason,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 147 | <code>  modelFacing,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 148 | <code>  contract,</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 149 | <code>  lint</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 150 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 151 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>这满足“批量暴露给 Agent”，同时避免模型调用一个 runtime 还不存在的函数。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>## 示例：修复 run_python_file 这类弱 schema</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>输入 MCP raw schema：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>```js</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 160 | <code>{</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 161 | <code>  name: "run_python_file",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 162 | <code>  description: "Run a local Python file and return stdout/stderr.",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 163 | <code>  inputSchema: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 164 | <code>    type: "object",</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 165 | <code>    properties: {</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 166 | <code>      path: { type: "string" },</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 167 | <code>      timeoutMs: { type: "number" }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 168 | <code>    }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 169 | <code>  }</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 170 | <code>}</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 171 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 173 | <code>Compiler 会自动增强为：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>- `required: ["path"]`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 176 | <code>- `additionalProperties: false`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 177 | <code>- precondition：`path` 必须是已存在的本地 `.py` 文件</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 178 | <code>- bad example：不要传 `{ code: "print(1)" }`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 179 | <code>- alternatives：先 `computer.write` 创建脚本，或用 `computer.exec python -c`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 180 | <code>- structured error recovery：`missing_existing_path`</code> | Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。 |
| 181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 182 | <code>## 验收</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。”这一文件职责。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>最小验证：</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 185 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 186 | <code>```bash</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 187 | <code>pnpm test:ailis-contract-compiler</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 188 | <code>pnpm test:ailis-tool-acquisition</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 189 | <code>pnpm test:ailis-capability-manager</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 190 | <code>pnpm test:ailis-tool-contracts</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
| 191 | <code>```</code> | Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>通过 contract lint 只是第一关。外部 MCP 仍必须通过 smoke test；任务能力仍要跑 GAIA / code task regression。</code> | 文档正文：解释设计意图、操作方法、证据边界或维护约定。 |
