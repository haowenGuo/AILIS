# AIGL Contract Intake Pipeline

日期：2026-06-08

## 目标

不要手搓每个工具 schema。AIGL 先从成熟来源采集 raw tool spec，再统一编译成 AIGL canonical contract，经过 lint 和 smoke gate 后才允许暴露给 Agent。

```text
MCP Registry / Composio / OpenAPI / LangChain/Pydantic / Codex/OpenHands
        -> contract compiler
        -> contract linter
        -> contract intake state
        -> smoke test
        -> verified tool exposure
        -> GAIA / code task regression
```

## 成熟来源

通过 `capability_manager.list_contract_sources` 查看当前支持的来源：

- `mcp_registry`：MCP tools/list item。
- `composio`：SaaS app action/tool catalog。
- `openapi`：官方 OpenAPI operation。
- `langchain_pydantic`： typed local tools。
- `codex_openhands`：文件、命令、patch、session、代码执行类核心工具模式。

## Canonical Contract

编译后每个工具都统一成：

```js
{
  id,
  source: { type, name, url, rawToolName },
  purpose,
  whenToUse,
  whenNotToUse,
  preconditions,
  inputSchema,
  outputSchema,
  examples,
  badExamples,
  alternatives,
  errors,
  permissions,
  risk,
  mutates,
  approval,
  smokeProfile
}
```

## Lint Gate

默认最低分是 `75`。以下问题会扣分或拒绝：

- 缺 `id`、`purpose`、object `inputSchema`。
- 有参数但没有 `required`。
- `additionalProperties` 不是 `false`。
- 参数没有 description。
- 缺 `whenToUse` / `whenNotToUse`。
- 缺 `preconditions`。
- 缺 valid examples / bad examples。
- 缺 structured `errors` / recovery。
- 缺 `alternatives`。
- 缺 `smokeProfile`。
- 缺 permission/scope 声明。

## Capability Manager Actions

```js
{ action: "list_contract_sources" }
{ action: "compile_contract", rawContract, sourceType, minScore }
{ action: "lint_contract", contract, minScore }
{ action: "intake_contracts", contracts, sourceType, minScore }
{ action: "list_contract_intake", status, query, limit }
{ action: "bulk_expose_external_tools", composioTools, openapiOperations, mcpTools, includeMcpRegistry, includeInstalledMcp }
{ action: "list_exposed_external_tools", query, callable, limit }
{ action: "configure_external_auth_profile", authProfileId, provider, authType, envVar, baseUrl }
{ action: "list_external_auth_profiles", query, limit }
{ action: "execute_exposed_external_tool", toolId | exposureId | id | name, args }
{ action: "smoke_exposed_external_tool", toolId | exposureId | id | name, live? }
```

## Direct External Exposure

`bulk_expose_external_tools` 会把外部工具直接放进 Agent 可见的 external exposure set，但不会把不可执行工具伪装成 callable。

- Installed/live MCP direct specs：`callable=true`，通过 `execute_exposed_external_tool` 走 `mcpManager.callTool` 执行。
- MCP Registry candidates：`callable=false`，用于规划安装和 smoke test。
- OpenAPI / Composio / raw MCP specs：默认 `callable=false`，除非已经实现 adapter/auth/executor；否则只作为 contract tool 暴露给 Agent。
- OpenAPI adapter：`bulk_expose_external_tools` 传 `trustCallable=true`、`enableOpenApiAdapter=true`、`authProfileId` 后，exposure 会带 `adapter.id=openapi_http`。`GET/HEAD/OPTIONS` 可直接执行；`POST/PUT/PATCH/DELETE` 必须先返回或获得审批，批准后才会发送请求体。
- Composio adapter：`bulk_expose_external_tools` 传 `trustCallable=true`、`enableComposioAdapter=true`、`authProfileId` 后，exposure 会带 `adapter.id=composio_rest_v3`。执行时通过 `POST {baseUrl}/tools/execute/{toolSlug}`，默认需要审批，并使用 `x-api-key` env profile。

## Auth Profile

授权 profile 只保存环境变量引用和账号作用域，不保存真实 key。

```js
{
  action: "configure_external_auth_profile",
  authProfileId: "github-api",
  provider: "openapi",
  authType: "bearer_env",
  envVar: "GITHUB_TOKEN"
}

{
  action: "configure_external_auth_profile",
  authProfileId: "composio-main",
  provider: "composio",
  authType: "composio_api_key_env",
  envVar: "COMPOSIO_API_KEY",
  baseUrl: "https://backend.composio.dev/api/v3",
  userId: "local-user"
}
```

支持的 auth type：

- `none` / `no_auth`
- `bearer_env`
- `api_key_env`
- `basic_env`
- `composio_api_key_env`

## Approval

`execute_exposed_external_tool` 的审批规则：

- installed MCP direct tool：沿用 MCP/tool contract 策略。
- OpenAPI 安全方法：默认可执行，但仍会检查 auth profile。
- OpenAPI 非安全方法：需要审批，批准后才允许 `POST/PUT/PATCH/DELETE`。
- Composio：默认需要审批，因为很多 action 会修改外部系统或发送消息。
- 缺少环境变量时返回 `auth_required`，不会降级成裸请求。

返回字段里必须看：

```js
{
  callable,
  verified,
  verification,
  callableReason,
  modelFacing,
  contract,
  lint
}
```

这满足“批量暴露给 Agent”，同时避免模型调用一个 runtime 还不存在的函数。

## 示例：修复 run_python_file 这类弱 schema

输入 MCP raw schema：

```js
{
  name: "run_python_file",
  description: "Run a local Python file and return stdout/stderr.",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string" },
      timeoutMs: { type: "number" }
    }
  }
}
```

Compiler 会自动增强为：

- `required: ["path"]`
- `additionalProperties: false`
- precondition：`path` 必须是已存在的本地 `.py` 文件
- bad example：不要传 `{ code: "print(1)" }`
- alternatives：先 `computer.write` 创建脚本，或用 `computer.exec python -c`
- structured error recovery：`missing_existing_path`

## 验收

最小验证：

```bash
pnpm test:humanclaw-contract-compiler
pnpm test:humanclaw-tool-acquisition
pnpm test:humanclaw-capability-manager
pnpm test:humanclaw-tool-contracts
```

通过 contract lint 只是第一关。外部 MCP 仍必须通过 smoke test；任务能力仍要跑 GAIA / code task regression。
