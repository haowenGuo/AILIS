# tests/ailis-tool-layer.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-tool-layer 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：1280
- SHA-256：`08b4b3ab606eb9bccad6b2225a057ebab614c8d230659195d353a2360f392a75`
- 可运行副本：[打开源文件](../../../source/tests/ailis-tool-layer.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:http`、`node:module`、`node:os`、`node:path`、`node:test`、`../electron/ailis-gateway.cjs`、`../electron/ailis-agent-runner.cjs`、`../electron/ailis-tool-specs.cjs`、`../electron/ailis-tool-result.cjs`、`../electron/ailis-mcp-adapter.cjs`、`../electron/ailis-runtime-budget.cjs`、`../electron/ailis-tool-routing.cjs`、`../electron/ailis-mcp-session.cjs`、`../electron/ailis-tool-runtime.cjs`、`../scripts/mcp-ailis-research-server.cjs`
- 主要符号：`require`、`startLocalHttpServer`、`server`、`address`、`toolSearch`、`artifactCompute`、`spec`、`mcpBridge`、`mcpBridgeSpec`、`success`、`error`、`normalized`、`editSpec`、`webSearchSpec`、`webFetchSpec`、`describeImageSpec`、`localReaderSpec`、`pdfExtractSpec`、`weakSpec`、`imageArgs`、`normalizedImageCall`、`spreadsheetAliasCall`、`bridgeCall`、`registry`、`mcpTool`、`candidates`、`kaggleRanked`、`latestRanked`、`outputTools`、`ranked`、`unrelated`、`manager`、`documentSpecs`、`videoSpecs`、`knownUrlSpecs`、`visualVideoSpecs`、`publicWebSpecs`、`workspaceRoot`、`gateway`、`directSpecs`、`directNames`、`deferredRead`、`initialSpecs`、`compressedArtifactSearchResult`、`nextSpecs`、`artifactSpec`、`valid`、`rawTools`、`compactedSearchResult`、`externalSpec`、`gatewaySearch`、`singlePlanSpecs`、`repeatedPlanSteps`、`specs`、`overrideSpecs`、`previousFetch`、`guard`、`nextLine`、`nextQuery`、`nextHash`、`previousSearches`、`searchResult`、`webSearch`、`webFetch`、`describeImage`、`rawWebSearch`、`compactedWebSearch`、`exactResearchSearch`、`exactResearchNames`、`invalidWebSearch`、`invalidWebFetch`、`invalidDescribeImage`、`nextSpecsAfterVisionFailure`、`previous`、`result`、`schema`、`compacted`、`truncated`、`text`、`lines`、`entries`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import http from 'node:http';</code> | 导入依赖 `node:http`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 7 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 10 | <code>const { AILISGateway } = require('../electron/ailis-gateway.cjs');</code> | 导入依赖 `../electron/ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 11 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    buildAgentDirectToolSpecs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    validateAgentToolLoopGuard,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    validateNativeDirectToolCall</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 15 | <code>} = require('../electron/ailis-agent-runner.cjs');</code> | 导入依赖 `../electron/ailis-agent-runner.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 16 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    AILIS_RUNTIME_TOOL_DEFINITIONS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    AILIS_TOOL_EXPOSURE,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    createAilisFunctionToolSpec</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 20 | <code>} = require('../electron/ailis-tool-specs.cjs');</code> | 导入依赖 `../electron/ailis-tool-specs.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 21 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 22 | <code>    makeAilisToolError,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    makeAilisToolResult,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    normalizeAilisToolOutput</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 25 | <code>} = require('../electron/ailis-tool-result.cjs');</code> | 导入依赖 `../electron/ailis-tool-result.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 26 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 27 | <code>    createAilisDirectMcpToolSpec,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 28 | <code>    normalizeAilisMcpCallArgs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 29 | <code>    normalizeAilisMcpToolArgs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 30 | <code>    parseAilisDirectMcpToolId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 31 | <code>} = require('../electron/ailis-mcp-adapter.cjs');</code> | 导入依赖 `../electron/ailis-mcp-adapter.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 32 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 33 | <code>    approxTokenCount,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 34 | <code>    compactToolResultForModel,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 35 | <code>    compactToolSchema,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 36 | <code>    truncateMiddleText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 37 | <code>} = require('../electron/ailis-runtime-budget.cjs');</code> | 导入依赖 `../electron/ailis-runtime-budget.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 38 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 39 | <code>    buildToolRoutingAdvice,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 40 | <code>    rankToolSearchResults</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 41 | <code>} = require('../electron/ailis-tool-routing.cjs');</code> | 导入依赖 `../electron/ailis-tool-routing.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 42 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 43 | <code>    AILISMcpManager</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 44 | <code>} = require('../electron/ailis-mcp-session.cjs');</code> | 导入依赖 `../electron/ailis-mcp-session.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 45 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 46 | <code>    AILISToolRuntimeRegistry</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 47 | <code>} = require('../electron/ailis-tool-runtime.cjs');</code> | 导入依赖 `../electron/ailis-tool-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 48 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 49 | <code>    webFetch</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 50 | <code>} = require('../scripts/mcp-ailis-research-server.cjs');</code> | 导入依赖 `../scripts/mcp-ailis-research-server.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>async function startLocalHttpServer(handler) {</code> | 定义函数 `startLocalHttpServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 53 | <code>    const server = http.createServer(handler);</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 54 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 55 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 56 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 57 | <code>        server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 58 | <code>        url: `http://127.0.0.1:${address.port}`</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 59 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>test('AILIS tool specs keep Responses-compatible shape without leaking old layer names', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 63 | <code>    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) =&gt; tool.id === 'tool_search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 64 | <code>    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) =&gt; tool.id === 'artifact_compute'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 65 | <code>    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) =&gt; tool.id === 'output_read'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 66 | <code>    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) =&gt; tool.id === 'output_tail'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 67 | <code>    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) =&gt; tool.id === 'output_search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 68 | <code>    assert.equal(AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) =&gt; tool.id === 'artifact_query').exposure, AILIS_TOOL_EXPOSURE.DEFERRED);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 69 | <code>    assert.equal(AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) =&gt; tool.id === 'artifact_tools').exposure, AILIS_TOOL_EXPOSURE.DEFERRED);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 70 | <code>    assert.equal(AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) =&gt; tool.id === 'output_read').exposure, AILIS_TOOL_EXPOSURE.DEFERRED);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 71 | <code>    assert.equal(AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) =&gt; tool.id === 'output_tail').exposure, AILIS_TOOL_EXPOSURE.DEFERRED);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 72 | <code>    assert.equal(AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) =&gt; tool.id === 'output_search').exposure, AILIS_TOOL_EXPOSURE.DEFERRED);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>    const toolSearch = AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) =&gt; tool.id === 'tool_search');</code> | 声明局部标识符 `toolSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 75 | <code>    assert.equal(toolSearch.route, 'ailis-runtime');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 76 | <code>    assert.equal(toolSearch.exposure, AILIS_TOOL_EXPOSURE.DIRECT);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 77 | <code>    assert.match(toolSearch.description, /deferred .*tool metadata/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 78 | <code>    assert.match(toolSearch.description, /cross-record ordering/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>    const artifactCompute = AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) =&gt; tool.id === 'artifact_compute');</code> | 声明局部标识符 `artifactCompute`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 81 | <code>    assert.equal(artifactCompute.route, 'ailis-runtime');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 82 | <code>    assert.equal(artifactCompute.exposure, AILIS_TOOL_EXPOSURE.HIDDEN);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>    const spec = createAilisFunctionToolSpec(toolSearch);</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 85 | <code>    assert.equal(spec.type, 'function');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 86 | <code>    assert.equal(spec.name, 'tool_search');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 87 | <code>    assert.match(spec.description, /Tool discovery/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 88 | <code>    assert.equal(spec.strict, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 89 | <code>    assert.equal(spec.parameters.type, 'object');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 90 | <code>    assert.deepEqual(spec.parameters.required, ['query']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 91 | <code>    assert.equal(spec.parameters.additionalProperties, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 92 | <code>    assert.deepEqual(Object.keys(spec.parameters.properties), ['query', 'limit']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 93 | <code>    assert.ok(spec.output_schema.properties.content);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 94 | <code>    assert.equal(Object.prototype.hasOwnProperty.call(spec, 'metadata'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>    const mcpBridge = AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) =&gt; tool.id === 'mcp_bridge');</code> | 声明局部标识符 `mcpBridge`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 97 | <code>    const mcpBridgeSpec = createAilisFunctionToolSpec(mcpBridge);</code> | 声明局部标识符 `mcpBridgeSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 98 | <code>    assert.equal(mcpBridge.exposure, AILIS_TOOL_EXPOSURE.DEFERRED);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 99 | <code>    assert.equal(mcpBridgeSpec.defer_loading, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 100 | <code>    assert.ok(mcpBridgeSpec.parameters.properties.action.enum.includes('health_check'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 101 | <code>    assert.ok(mcpBridgeSpec.parameters.properties.action.enum.includes('search_tools'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 102 | <code>    assert.equal(mcpBridgeSpec.parameters.properties.action.enum.includes('call_tool'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    assert.equal(mcpBridgeSpec.parameters.properties.action.enum.includes('tool_call'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 104 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>test('AILIS tool result normalizes success and error payloads', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 107 | <code>    const success = makeAilisToolResult({</code> | 声明局部标识符 `success`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 108 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        text: 'done',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 110 | <code>        details: { value: 1 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 111 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>    assert.equal(success.isError, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 113 | <code>    assert.equal(success.content[0].text, 'done');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 114 | <code>    assert.equal(success.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>    const error = makeAilisToolError({</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 117 | <code>        status: 'timeout',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 118 | <code>        errorCode: 'search_backend_timeout',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 119 | <code>        message: 'search timed out',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 120 | <code>        retryable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 121 | <code>        details: { backend: 'duckduckgo_lite' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 122 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>    assert.equal(error.isError, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 124 | <code>    assert.equal(error.details.errorCode, 'search_backend_timeout');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 125 | <code>    assert.equal(error.details.retryable, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>    const normalized = normalizeAilisToolOutput('plain text', { toolId: 'demo' });</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 128 | <code>    assert.equal(normalized.content[0].text, 'plain text');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 129 | <code>    assert.equal(normalized.details.toolRuntime.tool, 'demo');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 130 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>test('AILIS MCP adapter parses direct MCP ids and creates stable specs', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 133 | <code>    assert.deepEqual(parseAilisDirectMcpToolId('mcp__ailis_research__web_search'), {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 134 | <code>        id: 'mcp__ailis_research__web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 135 | <code>        legacyId: 'mcp:ailis_research:web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 136 | <code>        namespace: 'mcp__ailis_research__',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 137 | <code>        callableName: 'web_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 138 | <code>        server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 139 | <code>        tool: 'web_search'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 140 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>    assert.deepEqual(parseAilisDirectMcpToolId('mcp:ailis_research:web_search'), {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 142 | <code>        id: 'mcp__ailis_research__web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 143 | <code>        legacyId: 'mcp:ailis_research:web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 144 | <code>        namespace: 'mcp__ailis_research__',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 145 | <code>        callableName: 'web_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 146 | <code>        server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 147 | <code>        tool: 'web_search'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 148 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>    assert.deepEqual(parseAilisDirectMcpToolId('mcp.ailis_research.web_fetch'), {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 150 | <code>        id: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 151 | <code>        legacyId: 'mcp:ailis_research:web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 152 | <code>        namespace: 'mcp__ailis_research__',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 153 | <code>        callableName: 'web_fetch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 154 | <code>        server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 155 | <code>        tool: 'web_fetch'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 156 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>    const spec = createAilisDirectMcpToolSpec({</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 159 | <code>        server: 'fixture',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 160 | <code>        tool: 'echo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 161 | <code>        description: 'Echo input',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 162 | <code>        inputSchema: { type: 'object', required: ['text'], properties: { text: { type: 'string' } } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 163 | <code>        schemaProperties: ['text']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 164 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>    assert.equal(spec.id, 'mcp__fixture__echo');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 166 | <code>    assert.equal(spec.legacy_id, 'mcp:fixture:echo');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 167 | <code>    assert.equal(spec.namespace, 'mcp__fixture__');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 168 | <code>    assert.equal(spec.callable_name, 'echo');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 169 | <code>    assert.equal(spec.call_pattern.tool, 'mcp__fixture__echo');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 170 | <code>    assert.deepEqual(spec.call_pattern.args, { text: '&lt;text&gt;' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>    const editSpec = createAilisDirectMcpToolSpec({</code> | 声明局部标识符 `editSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 173 | <code>        server: 'filesystem_ailis',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 174 | <code>        tool: 'edit_file',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 175 | <code>        description: 'Edit a file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 176 | <code>        inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 177 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 178 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 179 | <code>                path: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 180 | <code>                edits: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 181 | <code>                    type: 'array',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 182 | <code>                    items: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 183 | <code>                        type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 184 | <code>                        properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 185 | <code>                            oldText: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 186 | <code>                            newText: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 187 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>        schemaProperties: ['path', 'edits']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 193 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>    assert.match(editSpec.description, /whole-file output/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 195 | <code>    assert.deepEqual(editSpec.call_pattern.args.edits[0], {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 196 | <code>        oldText: '&lt;exact existing text&gt;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 197 | <code>        newText: '&lt;replacement text&gt;'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 198 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>    const webSearchSpec = createAilisDirectMcpToolSpec({</code> | 声明局部标识符 `webSearchSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 201 | <code>        server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 202 | <code>        tool: 'web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 203 | <code>        description: 'Fallback broad public web search.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 204 | <code>        inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 205 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 206 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 207 | <code>                query: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 208 | <code>                maxResults: { type: 'number' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 209 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 211 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>    assert.deepEqual(webSearchSpec.input_schema.required, ['query']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 213 | <code>    assert.equal(webSearchSpec.input_schema.properties.query.minLength, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 214 | <code>    assert.equal(webSearchSpec.input_schema.additionalProperties, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 215 | <code>    assert.deepEqual(webSearchSpec.call_pattern.args, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 216 | <code>        query: '&lt;query&gt;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 217 | <code>        maxResults: '&lt;maxResults&gt;'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 218 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>    assert.equal(webSearchSpec.spec.name, 'mcp__ailis_research__web_search');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 220 | <code>    assert.deepEqual(webSearchSpec.spec.parameters.required, ['query']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>    const webFetchSpec = createAilisDirectMcpToolSpec({</code> | 声明局部标识符 `webFetchSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 223 | <code>        server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 224 | <code>        tool: 'web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 225 | <code>        inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 226 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 227 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 228 | <code>                url: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 229 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>    assert.deepEqual(webFetchSpec.input_schema.required, ['url']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 233 | <code>    assert.equal(webFetchSpec.input_schema.properties.url.minLength, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>    const describeImageSpec = createAilisDirectMcpToolSpec({</code> | 声明局部标识符 `describeImageSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 236 | <code>        server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 237 | <code>        tool: 'describe_image',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 238 | <code>        inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 239 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 240 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 241 | <code>                path: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 242 | <code>                question: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 243 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 246 | <code>    assert.deepEqual(describeImageSpec.input_schema.required, ['path']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 247 | <code>    assert.equal(describeImageSpec.input_schema.properties.path.minLength, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 248 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 249 | <code>    for (const tool of ['read_document', 'read_presentation', 'read_spreadsheet', 'transcribe_audio']) {</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 250 | <code>        const localReaderSpec = createAilisDirectMcpToolSpec({</code> | 声明局部标识符 `localReaderSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 251 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 252 | <code>            tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 253 | <code>            inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 254 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 255 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 256 | <code>                    path: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 257 | <code>                    file: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 258 | <code>                    timeoutMs: { type: 'number' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 259 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>        assert.equal(localReaderSpec.callable, true, `${tool} should be callable`);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 263 | <code>        assert.deepEqual(localReaderSpec.input_schema.required, ['path']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 264 | <code>        assert.equal(localReaderSpec.input_schema.additionalProperties, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 265 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>    const pdfExtractSpec = createAilisDirectMcpToolSpec({</code> | 声明局部标识符 `pdfExtractSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 268 | <code>        server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 269 | <code>        tool: 'pdf_extract_text',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 270 | <code>        inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 271 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 272 | <code>            anyOf: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 273 | <code>                { required: ['url'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 274 | <code>                { required: ['path'] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 275 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 277 | <code>                url: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 278 | <code>                path: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 279 | <code>                maxPages: { type: 'number' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 280 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>            additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 282 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 283 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>    assert.equal(pdfExtractSpec.callable, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 285 | <code>    assert.equal(pdfExtractSpec.modelFacing, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 286 | <code>    assert.deepEqual(pdfExtractSpec.input_schema.anyOf, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 287 | <code>        { required: ['url'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 288 | <code>        { required: ['path'] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 289 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 291 | <code>    const weakSpec = createAilisDirectMcpToolSpec({</code> | 声明局部标识符 `weakSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 292 | <code>        server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 293 | <code>        tool: 'optional_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 294 | <code>        inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 295 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 296 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 297 | <code>                query: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 298 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 300 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 301 | <code>    assert.equal(weakSpec.callable, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 302 | <code>    assert.equal(weakSpec.modelFacing, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 303 | <code>    assert.equal(weakSpec.schema_status, 'weak_schema');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>    const { toolArgs, meta } = normalizeAilisMcpCallArgs({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 306 | <code>        text: 'hello',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 307 | <code>        _meta: { reason: 'test' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 308 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 309 | <code>    assert.deepEqual(toolArgs, { text: 'hello' });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 310 | <code>    assert.deepEqual(meta, { reason: 'test' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 312 | <code>    const imageArgs = normalizeAilisMcpToolArgs({</code> | 声明局部标识符 `imageArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 313 | <code>        tool: 'describe_image',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 314 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 315 | <code>            image_path: 'C:\\tmp\\screen.png',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 316 | <code>            question: 'What is shown?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 317 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 318 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>    assert.equal(imageArgs.path, 'C:\\tmp\\screen.png');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 320 | <code>    assert.equal(imageArgs.image_path, 'C:\\tmp\\screen.png');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>    const normalizedImageCall = normalizeAilisMcpCallArgs({</code> | 声明局部标识符 `normalizedImageCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 323 | <code>        imagePath: 'C:\\tmp\\screen-2.png',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 324 | <code>        _meta: { reason: 'vision retry' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 325 | <code>    }, { tool: 'describe_image' });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 326 | <code>    assert.equal(normalizedImageCall.toolArgs.path, 'C:\\tmp\\screen-2.png');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 327 | <code>    assert.deepEqual(normalizedImageCall.meta, { reason: 'vision retry' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 329 | <code>    const spreadsheetAliasCall = normalizeAilisMcpCallArgs({</code> | 声明局部标识符 `spreadsheetAliasCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 330 | <code>        filePath: 'C:\\tmp\\sales.xlsx'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 331 | <code>    }, { tool: 'read_spreadsheet' });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 332 | <code>    assert.equal(spreadsheetAliasCall.toolArgs.path, 'C:\\tmp\\sales.xlsx');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 333 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 335 | <code>test('direct MCP tool request timeouts do not shorten the MCP transport deadline', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 336 | <code>    let bridgeCall = null;</code> | 声明局部标识符 `bridgeCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 337 | <code>    const registry = new AILISToolRuntimeRegistry({</code> | 声明局部标识符 `registry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 338 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 339 | <code>            executeMcpBridge: async (args, context) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 340 | <code>                bridgeCall = { args, context };</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 341 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 342 | <code>                    content: [{ type: 'text', text: 'completed' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 343 | <code>                    details: { status: 'completed' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 344 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 345 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 346 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 349 | <code>    await registry.dispatch('mcp__ailis_research__web_archive_lookup', {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 350 | <code>        url: 'https://example.test/search?',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 351 | <code>        mode: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 352 | <code>        timeoutMs: 30000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 353 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 354 | <code>        timeoutMs: 900000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 355 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>    assert.equal(bridgeCall.args.timeoutMs, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 358 | <code>    assert.equal(bridgeCall.args.args.timeoutMs, 30000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 359 | <code>    assert.equal(bridgeCall.context.timeoutMs, 900000);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 360 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 361 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 362 | <code>function mcpTool(name, description = '') {</code> | 定义函数 `mcpTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 363 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 364 | <code>        id: `mcp__ailis_research__${name}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 365 | <code>        type: 'mcp_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 366 | <code>        server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 367 | <code>        tool: name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 368 | <code>        name: `mcp__ailis_research__${name}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 369 | <code>        description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 370 | <code>        schema_properties: ['path', 'url', 'query', 'title']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 371 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 372 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>test('AILIS tool routing prefers artifact-specific MCP tools over broad web_search', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 375 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 376 | <code>        mcpTool('web_search', 'Fallback broad public web search.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 377 | <code>        mcpTool('web_fetch', 'Fetch a known HTML page URL.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 378 | <code>        mcpTool('pdf_find_and_extract', 'Find and extract a paper or report PDF.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 379 | <code>        mcpTool('read_document', 'Read Word DOCX documents with paragraphs and tables.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 380 | <code>        mcpTool('read_presentation', 'Read PowerPoint PPTX slides.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 381 | <code>        mcpTool('youtube_video_search', 'Search YouTube videos by title or channel with yt-dlp.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 382 | <code>        mcpTool('youtube_transcript', 'Read YouTube video transcripts.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 383 | <code>        mcpTool('video_extract_frames', 'Sample timestamped video frames and analyze visual co-occurrence.')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 384 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 385 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 386 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 387 | <code>        rankToolSearchResults(candidates, 'attached docx Word document table evidence web search', 2)[0].tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 388 | <code>        'read_document'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 389 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 390 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 391 | <code>        rankToolSearchResults(candidates, 'PowerPoint pptx slides that mention a category', 2)[0].tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 392 | <code>        'read_presentation'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 393 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 394 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 395 | <code>        rankToolSearchResults(candidates, 'exact paper title report PDF find answer field', 2)[0].tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 396 | <code>        'pdf_find_and_extract'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 397 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 398 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 399 | <code>        rankToolSearchResults(candidates, 'YouTube video transcript question with known title but no URL', 2)[0].tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 400 | <code>        'youtube_video_search'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 401 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 402 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 403 | <code>        rankToolSearchResults(candidates, 'https://www.youtube.com/watch?v=L1vXCYZAYYM transcript evidence', 2)[0].tool,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 404 | <code>        'youtube_transcript'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 405 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 406 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 407 | <code>        rankToolSearchResults(candidates, 'https://www.youtube.com/watch?v=L1vXCYZAYYM maximum species visible on screen at once frame evidence', 2)[0].tool,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 408 | <code>        'video_extract_frames'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 409 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 410 | <code>    assert.match(buildToolRoutingAdvice('attached docx Word document table', candidates), /Codex-style/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 411 | <code>    assert.match(buildToolRoutingAdvice('attached docx Word document table', candidates), /strict direct MCP/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 412 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 413 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 414 | <code>test('AILIS tool routing prefers web_research for public current-information evidence tasks', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 415 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 416 | <code>        mcpTool('web_research', 'End-to-end public web research with search, fetch, evidence scoring, and clarification.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 417 | <code>        mcpTool('web_search', 'Fallback broad public web search.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 418 | <code>        mcpTool('web_fetch', 'Fetch a known HTML page URL.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 419 | <code>        mcpTool('describe_image', 'Describe a local screenshot image.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 420 | <code>        mcpTool('github_repo_read', 'Read a known GitHub repository.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 421 | <code>        mcpTool('pdf_find_and_extract', 'Find and extract a paper or report PDF.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 422 | <code>        mcpTool('read_document', 'Read Word DOCX documents.')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 423 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 425 | <code>    const kaggleRanked = rankToolSearchResults(</code> | 声明局部标识符 `kaggleRanked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 426 | <code>        candidates,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 427 | <code>        'Kaggle AI攻防比赛 2026 最新 competition 攻略',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 428 | <code>        3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 429 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>    assert.equal(kaggleRanked[0].tool, 'web_research');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 431 | <code>    assert.ok(kaggleRanked.some((tool) =&gt; tool.tool === 'web_research'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 432 | <code>    assert.ok(kaggleRanked.some((tool) =&gt; tool.tool === 'web_search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 434 | <code>    const latestRanked = rankToolSearchResults(</code> | 声明局部标识符 `latestRanked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 435 | <code>        candidates,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 436 | <code>        'latest adversarial machine learning challenge strategy guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 437 | <code>        3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 438 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 439 | <code>    assert.equal(latestRanked[0].tool, 'web_research');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 440 | <code>    assert.match(buildToolRoutingAdvice('latest adversarial machine learning challenge strategy guide', latestRanked), /web_research/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 441 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 442 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 443 | <code>test('AILIS tool routing can rank output store tools when an experimental surface provides them', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 444 | <code>    const outputTools = AILIS_RUNTIME_TOOL_DEFINITIONS</code> | 声明局部标识符 `outputTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 445 | <code>        .filter((tool) =&gt; ['output_read', 'output_tail', 'output_search'].includes(tool.id))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 446 | <code>        .map((tool) =&gt; ({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 447 | <code>            id: tool.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 448 | <code>            type: 'runtime_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 449 | <code>            exposure: tool.exposure,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 450 | <code>            spec: createAilisFunctionToolSpec(tool)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 451 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 453 | <code>    const ranked = rankToolSearchResults(outputTools, 'exec outputId previewTruncated full stdout output', 3);</code> | 声明局部标识符 `ranked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 454 | <code>    assert.equal(ranked[0].id, 'output_read');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 455 | <code>    assert.ok(ranked.some((tool) =&gt; tool.id === 'output_tail'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 456 | <code>    assert.ok(ranked.some((tool) =&gt; tool.id === 'output_search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 457 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 458 | <code>    const unrelated = rankToolSearchResults(</code> | 声明局部标识符 `unrelated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 459 | <code>        outputTools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 460 | <code>        'public research API metadata search by language and year',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 461 | <code>        3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 462 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 463 | <code>    assert.equal(unrelated.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 464 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 465 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 466 | <code>test('AILIS MCP manager search uses tool routing before returning specs', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 467 | <code>    const manager = new AILISMcpManager({});</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 468 | <code>    manager.listToolSpecs = async () =&gt; [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 469 | <code>        mcpTool('web_search', 'Fallback broad public web search.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 470 | <code>        mcpTool('web_fetch', 'Fetch a known HTML page URL.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 471 | <code>        mcpTool('read_document', 'Read Word DOCX documents with paragraphs and tables.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 472 | <code>        mcpTool('youtube_video_search', 'Search YouTube videos by title or channel with yt-dlp.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 473 | <code>        mcpTool('youtube_transcript', 'Read YouTube video transcripts.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 474 | <code>        mcpTool('video_extract_frames', 'Sample timestamped video frames and analyze visual co-occurrence.')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 475 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 476 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 477 | <code>    const documentSpecs = await manager.searchToolSpecs({</code> | 声明局部标识符 `documentSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 478 | <code>        query: 'attached docx document table evidence search web',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 479 | <code>        limit: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 480 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 481 | <code>    assert.equal(documentSpecs[0].tool, 'read_document');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 482 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 483 | <code>    const videoSpecs = await manager.searchToolSpecs({</code> | 声明局部标识符 `videoSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 484 | <code>        query: 'youtube video title BBC Earth no URL',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 485 | <code>        limit: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 486 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 487 | <code>    assert.equal(videoSpecs[0].tool, 'youtube_video_search');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 489 | <code>    const knownUrlSpecs = await manager.searchToolSpecs({</code> | 声明局部标识符 `knownUrlSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 490 | <code>        query: 'https://www.youtube.com/watch?v=L1vXCYZAYYM transcript evidence',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 491 | <code>        limit: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 492 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 493 | <code>    assert.equal(knownUrlSpecs[0].tool, 'youtube_transcript');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 494 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 495 | <code>    const visualVideoSpecs = await manager.searchToolSpecs({</code> | 声明局部标识符 `visualVideoSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 496 | <code>        query: 'https://www.youtube.com/watch?v=L1vXCYZAYYM maximum species visible on screen at once frame evidence',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 497 | <code>        limit: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 498 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>    assert.equal(visualVideoSpecs[0].tool, 'video_extract_frames');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 500 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 501 | <code>    const publicWebSpecs = await manager.searchToolSpecs({</code> | 声明局部标识符 `publicWebSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 502 | <code>        query: 'Kaggle AI攻防比赛 2026 最新 competition 攻略',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 503 | <code>        limit: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 504 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 505 | <code>    assert.equal(publicWebSpecs[0].tool, 'web_search');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 506 | <code>    assert.ok(publicWebSpecs.some((tool) =&gt; tool.tool === 'web_fetch'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 507 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 508 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 509 | <code>test('AILIS Gateway exposes a small Responses-compatible core surface by default', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 510 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-tool-surface-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 511 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 512 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 513 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 514 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 515 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 516 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 518 | <code>    const directSpecs = gateway.gatewayToolRuntimeRegistry.modelVisibleSpecs();</code> | 声明局部标识符 `directSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 519 | <code>    const directNames = directSpecs.map((tool) =&gt; tool.name);</code> | 声明局部标识符 `directNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 520 | <code>    assert.deepEqual(directNames.sort(), [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 521 | <code>        'apply_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 522 | <code>        'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 523 | <code>        'handoff_task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 524 | <code>        'request_permissions',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 525 | <code>        'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 526 | <code>        'update_plan',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 527 | <code>        'web_run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 528 | <code>        'write'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 529 | <code>    ].sort());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 530 | <code>    for (const expected of ['web_run', 'tool_search', 'update_plan', 'write', 'exec', 'apply_patch', 'request_permissions', 'handoff_task']) {</code> | 声明局部标识符 `expected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 531 | <code>        assert.ok(directNames.includes(expected), `${expected} should be a core direct tool`);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 532 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 533 | <code>    for (const deferred of ['read', 'artifact_tools', 'artifact_query', 'github_pages', 'mcp_bridge', 'computer']) {</code> | 声明局部标识符 `deferred`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 534 | <code>        assert.equal(directNames.includes(deferred), false, `${deferred} should be loaded through tool_search`);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 535 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 536 | <code>    assert.ok(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 537 | <code>        directSpecs.filter((tool) =&gt; tool.name !== 'web_run').every((tool) =&gt; tool.strict === true),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 538 | <code>        'local core direct tools should use strict schemas'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 539 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 540 | <code>    assert.notEqual(directSpecs.find((tool) =&gt; tool.name === 'web_run').strict, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 541 | <code>    assert.deepEqual(directSpecs.find((tool) =&gt; tool.name === 'tool_search').parameters.required, ['query']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 542 | <code>    assert.deepEqual(directSpecs.find((tool) =&gt; tool.name === 'exec').parameters.required, ['command']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 543 | <code>    const deferredRead = gateway.gatewayToolRuntimeRegistry.definition('read');</code> | 声明局部标识符 `deferredRead`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 544 | <code>    assert.equal(deferredRead.exposure, 'deferred');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 545 | <code>    assert.match(deferredRead.description, /local filesystem/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 546 | <code>    assert.match(deferredRead.spec.parameters.properties.path.description, /not accepted&#124;HTTP/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 547 | <code>    assert.equal(directNames.includes('artifact_compute'), false, 'artifact_compute should stay hidden from model-facing tool surfaces');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 549 | <code>    const initialSpecs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `initialSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 550 | <code>        requestContext: { nativeDirectTools: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 551 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 552 | <code>    assert.equal(initialSpecs.some((tool) =&gt; tool.name === 'tool_search'), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 553 | <code>    assert.equal(initialSpecs.some((tool) =&gt; tool.name === 'subagents'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 554 | <code>    assert.equal(initialSpecs.some((tool) =&gt; tool.name === 'read_xlsx_workbook'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 555 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 556 | <code>    assert.equal(gateway.gatewayToolRuntimeRegistry.has('subagents'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 557 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 558 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 559 | <code>test('AILIS rebuilds local runtime direct tool specs from registry after compressed tool_search observations', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 560 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-compressed-tool-schema-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 561 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 562 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 563 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 564 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 565 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 566 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 567 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 568 | <code>        const compressedArtifactSearchResult = {</code> | 声明局部标识符 `compressedArtifactSearchResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 569 | <code>            content: [{ type: 'text', text: 'compressed tool_search observation' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 570 | <code>            details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 571 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 572 | <code>                query: 'xlsx cell fill color',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 573 | <code>                tools: []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 574 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 575 | <code>            structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 576 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 577 | <code>                query: 'xlsx cell fill color',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 578 | <code>                tools: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 579 | <code>                    id: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 580 | <code>                    type: 'gateway_or_runtime_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 581 | <code>                    exposure: 'deferred',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 582 | <code>                    spec: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 583 | <code>                        type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 584 | <code>                        name: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 585 | <code>                        description: 'Compressed model-visible copy of the tool schema.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 586 | <code>                        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 587 | <code>                            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 588 | <code>                            additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 589 | <code>                            required: ['action'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 590 | <code>                            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 591 | <code>                                action: { type: 'string', enum: ['open_session', 'inspect'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 592 | <code>                                path: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 593 | <code>                                sheet: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 594 | <code>                                fill: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 595 | <code>                                __omitted_keys: 77</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 596 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 597 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 598 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 599 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 600 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 601 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 603 | <code>        const nextSpecs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `nextSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 604 | <code>            requestContext: { nativeDirectTools: true },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 605 | <code>            stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 606 | <code>                tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 607 | <code>                response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 608 | <code>                    ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 609 | <code>                    result: compressedArtifactSearchResult</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 610 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 611 | <code>            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 612 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 613 | <code>        const artifactSpec = nextSpecs.find((tool) =&gt; tool.name === 'artifact_tools');</code> | 声明局部标识符 `artifactSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 614 | <code>        assert.ok(artifactSpec, 'artifact_tools should be exposed after tool_search');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 615 | <code>        assert.ok(artifactSpec.parameters.properties.include, 'registry schema should restore include');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 616 | <code>        assert.ok(artifactSpec.parameters.properties.sessionId, 'registry schema should restore sessionId');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 617 | <code>        assert.ok(artifactSpec.parameters.properties.range, 'registry schema should restore range');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 618 | <code>        assert.equal(artifactSpec.parameters.properties.__omitted_keys, undefined);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 619 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 620 | <code>        const valid = validateNativeDirectToolCall({</code> | 声明局部标识符 `valid`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 621 | <code>            name: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 622 | <code>            arguments: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 623 | <code>                action: 'inspect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 624 | <code>                sessionId: 'arts_test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 625 | <code>                range: 'A1:B2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 626 | <code>                include: ['style', 'formula']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 627 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 628 | <code>        }, nextSpecs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 629 | <code>        assert.equal(valid.ok, true, valid.errors.join('; '));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 630 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 631 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 632 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 633 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 634 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 635 | <code>test('AILIS keeps raw tool_search specs hidden from model JSON but available for dynamic direct tools', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 636 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-raw-tool-schema-cache-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 637 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 638 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 639 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 640 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 641 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 642 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 643 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 644 | <code>        const rawTools = [{</code> | 声明局部标识符 `rawTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 645 | <code>            id: 'external__mock__lookup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 646 | <code>            type: 'external_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 647 | <code>            callable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 648 | <code>            spec: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 649 | <code>                type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 650 | <code>                name: 'external__mock__lookup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 651 | <code>                description: 'Lookup with a larger schema than the compact observation copy.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 652 | <code>                parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 653 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 654 | <code>                    additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 655 | <code>                    required: ['query', 'include'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 656 | <code>                    properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 657 | <code>                        query: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 658 | <code>                        include: { type: 'array', items: { type: 'string' } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 659 | <code>                        region: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 660 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 661 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 662 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 663 | <code>        }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 664 | <code>        const compactedSearchResult = {</code> | 声明局部标识符 `compactedSearchResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 665 | <code>            content: [{ type: 'text', text: 'compressed external tool_search observation' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 666 | <code>            structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 667 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 668 | <code>                query: 'external lookup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 669 | <code>                tools: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 670 | <code>                    id: 'external__mock__lookup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 671 | <code>                    type: 'external_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 672 | <code>                    callable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 673 | <code>                    spec: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 674 | <code>                        type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 675 | <code>                        name: 'external__mock__lookup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 676 | <code>                        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 677 | <code>                            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 678 | <code>                            additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 679 | <code>                            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 680 | <code>                                query: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 681 | <code>                                __omitted_keys: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 682 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 683 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 684 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 685 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 686 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 687 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 688 | <code>        Object.defineProperty(compactedSearchResult, '__ailisRawToolSearchTools', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 689 | <code>            value: rawTools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 690 | <code>            enumerable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 691 | <code>            configurable: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 692 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 694 | <code>        assert.equal(JSON.stringify(compactedSearchResult).includes('__ailisRawToolSearchTools'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 695 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 696 | <code>        const nextSpecs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `nextSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 697 | <code>            requestContext: { nativeDirectTools: true },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 698 | <code>            stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 699 | <code>                tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 700 | <code>                response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 701 | <code>                    ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 702 | <code>                    result: compactedSearchResult</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 703 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 704 | <code>            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 705 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 706 | <code>        const externalSpec = nextSpecs.find((tool) =&gt; tool.name === 'external__mock__lookup');</code> | 声明局部标识符 `externalSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 707 | <code>        assert.ok(externalSpec, 'external tool should be exposed from hidden raw tool_search specs');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 708 | <code>        assert.ok(externalSpec.parameters.properties.include, 'hidden raw schema should restore include');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 709 | <code>        assert.equal(externalSpec.parameters.properties.__omitted_keys, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 710 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 711 | <code>        const valid = validateNativeDirectToolCall({</code> | 声明局部标识符 `valid`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 712 | <code>            name: 'external__mock__lookup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 713 | <code>            arguments: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 714 | <code>                query: 'alpha',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 715 | <code>                include: ['metadata']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 716 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 717 | <code>        }, nextSpecs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 718 | <code>        assert.equal(valid.ok, true, valid.errors.join('; '));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 719 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 720 | <code>        const gatewaySearch = await gateway.callTool({</code> | 声明局部标识符 `gatewaySearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 721 | <code>            tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 722 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 723 | <code>                query: 'subagent task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 724 | <code>                limit: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 725 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 726 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 727 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 728 | <code>                approved: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 729 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 730 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 731 | <code>        assert.ok(Array.isArray(gatewaySearch.result.__ailisRawToolSearchTools));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 732 | <code>        assert.equal(Object.keys(gatewaySearch.result).includes('__ailisRawToolSearchTools'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 733 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 734 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 735 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 736 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 737 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 738 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 739 | <code>test('AILIS suppresses repeated update_plan direct-tool loops without hiding other core tools', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 740 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-tool-plan-loop-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 741 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 742 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 743 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 744 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 745 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 746 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 747 | <code>    const singlePlanSpecs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `singlePlanSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 748 | <code>        requestContext: { nativeDirectTools: true },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 749 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 750 | <code>            tool: 'update_plan',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 751 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 752 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 753 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 754 | <code>                result: { content: [{ type: 'text', text: 'plan 1' }] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 755 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 756 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 757 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 758 | <code>    assert.equal(singlePlanSpecs.some((tool) =&gt; tool.name === 'update_plan'), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 759 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 760 | <code>    const repeatedPlanSteps = Array.from({ length: 2 }, (_, index) =&gt; ({</code> | 声明局部标识符 `repeatedPlanSteps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 761 | <code>        tool: 'update_plan',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 762 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 763 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 764 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 765 | <code>            result: { content: [{ type: 'text', text: `plan ${index + 1}` }] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 766 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 767 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 768 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 769 | <code>    const specs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 770 | <code>        requestContext: { nativeDirectTools: true },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 771 | <code>        stepResults: repeatedPlanSteps</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 772 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 773 | <code>    assert.equal(specs.some((tool) =&gt; tool.name === 'update_plan'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 774 | <code>    assert.equal(specs.some((tool) =&gt; tool.name === 'tool_search'), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 775 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 776 | <code>    const overrideSpecs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `overrideSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 777 | <code>        requestContext: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 778 | <code>            nativeDirectTools: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 779 | <code>            allowRepeatedUpdatePlanDirectTool: true</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 780 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 781 | <code>        stepResults: repeatedPlanSteps</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 782 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 783 | <code>    assert.equal(overrideSpecs.some((tool) =&gt; tool.name === 'update_plan'), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 784 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 785 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 786 | <code>test('AILIS loop guard blocks repeated web_fetch after reasoning-ready evidence', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 787 | <code>    const previousFetch = {</code> | 声明局部标识符 `previousFetch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 788 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 789 | <code>        args: { url: 'https://wiki.biligame.com/zzz/%E8%8E%B1%E7%89%B9' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 790 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 791 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 792 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 793 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 794 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 795 | <code>                    evidenceQuality: 'sufficient_evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 796 | <code>                    isEvidence: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 797 | <code>                    complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 798 | <code>                    truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 799 | <code>                    reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 800 | <code>                    observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 801 | <code>                        evidence_quality: 'sufficient_evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 802 | <code>                        reasoning_ready: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 803 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 804 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 805 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 806 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 807 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 808 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 809 | <code>    const guard = validateAgentToolLoopGuard({</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 810 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 811 | <code>        args: { url: 'https://wiki.biligame.com/zzz/%E8%8E%B1%E7%89%B9/' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 812 | <code>    }, [previousFetch]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 813 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 814 | <code>    assert.equal(guard.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 815 | <code>    assert.equal(guard.status, 'tool_loop_guard');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 816 | <code>    assert.equal(guard.details.reason, 'repeated_ready_evidence');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 817 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 818 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 819 | <code>test('AILIS loop guard allows web_fetch source viewport navigation on the same URL', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 820 | <code>    const previousFetch = {</code> | 声明局部标识符 `previousFetch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 821 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 822 | <code>        args: { url: 'https://en.wikipedia.org/wiki/Mercedes_Sosa', lineno: 120, maxLines: 80 },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 823 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 824 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 825 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 826 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 827 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 828 | <code>                    evidenceQuality: 'sufficient_evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 829 | <code>                    isEvidence: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 830 | <code>                    complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 831 | <code>                    truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 832 | <code>                    reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 833 | <code>                    observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 834 | <code>                        evidence_quality: 'sufficient_evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 835 | <code>                        reasoning_ready: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 836 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 837 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 838 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 839 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 840 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 841 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 842 | <code>    const nextLine = validateAgentToolLoopGuard({</code> | 声明局部标识符 `nextLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 843 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 844 | <code>        args: { url: 'https://en.wikipedia.org/wiki/Mercedes_Sosa', lineno: 200, maxLines: 80 }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 845 | <code>    }, [previousFetch]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 846 | <code>    const nextQuery = validateAgentToolLoopGuard({</code> | 声明局部标识符 `nextQuery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 847 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 848 | <code>        args: { url: 'https://en.wikipedia.org/wiki/Mercedes_Sosa', query: '2000 studio album' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 849 | <code>    }, [previousFetch]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 850 | <code>    const nextHash = validateAgentToolLoopGuard({</code> | 声明局部标识符 `nextHash`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 851 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 852 | <code>        args: { url: 'https://en.wikipedia.org/wiki/Mercedes_Sosa#Discography' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 853 | <code>    }, [previousFetch]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 854 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 855 | <code>    assert.equal(nextLine.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 856 | <code>    assert.equal(nextQuery.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 857 | <code>    assert.equal(nextHash.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 858 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 859 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 860 | <code>test('AILIS loop guard blocks a third identical web_search query', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 861 | <code>    const previousSearches = Array.from({ length: 2 }, () =&gt; ({</code> | 声明局部标识符 `previousSearches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 862 | <code>        tool: 'mcp__ailis_research__web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 863 | <code>        args: { query: '绝区零 莱特 养成攻略 技能加点 配队 驱动盘' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 864 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 865 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 866 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 867 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 868 | <code>                content: [{ type: 'text', text: 'Evidence gap: Search results look off-target.' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 869 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 870 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 871 | <code>                    evidenceGap: 'Search results look off-target.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 872 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 873 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 874 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 875 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 876 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 877 | <code>    const guard = validateAgentToolLoopGuard({</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 878 | <code>        tool: 'mcp__ailis_research__web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 879 | <code>        args: { query: '  绝区零 莱特 养成攻略 技能加点 配队 驱动盘  ' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 880 | <code>    }, previousSearches);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 881 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 882 | <code>    assert.equal(guard.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 883 | <code>    assert.equal(guard.status, 'tool_loop_guard');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 884 | <code>    assert.equal(guard.details.reason, 'repeated_web_tool_call');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 885 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 886 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 887 | <code>test('AILIS tool_search returns strict direct MCP specs and native preflight blocks empty args', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 888 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-mcp-search-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 889 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 890 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 891 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 892 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 893 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 894 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 895 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 896 | <code>    gateway.runtime.mcpManager.searchToolSpecs = async () =&gt; [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 897 | <code>        createAilisDirectMcpToolSpec({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 898 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 899 | <code>            tool: 'web_research',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 900 | <code>            description: 'End-to-end public web research using search and fetch together.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 901 | <code>            inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 902 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 903 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 904 | <code>                    query: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 905 | <code>                    maxPages: { type: 'number' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 906 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 907 | <code>                required: ['query'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 908 | <code>                additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 909 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 910 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 911 | <code>        createAilisDirectMcpToolSpec({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 912 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 913 | <code>            tool: 'web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 914 | <code>            description: 'Fallback broad public web search.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 915 | <code>            inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 916 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 917 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 918 | <code>                    query: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 919 | <code>                    maxResults: { type: 'number' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 920 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 921 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 922 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 923 | <code>        createAilisDirectMcpToolSpec({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 924 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 925 | <code>            tool: 'web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 926 | <code>            description: 'Fetch known web URL.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 927 | <code>            inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 928 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 929 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 930 | <code>                    url: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 931 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 932 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 933 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 934 | <code>        createAilisDirectMcpToolSpec({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 935 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 936 | <code>            tool: 'describe_image',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 937 | <code>            description: 'Describe a local image.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 938 | <code>            inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 939 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 940 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 941 | <code>                    path: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 942 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 943 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 944 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 945 | <code>        createAilisDirectMcpToolSpec({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 946 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 947 | <code>            tool: 'weak_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 948 | <code>            description: 'Weak schema tool should not be surfaced.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 949 | <code>            inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 950 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 951 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 952 | <code>                    query: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 953 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 954 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 955 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 956 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 957 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 958 | <code>    const searchResult = await gateway.executeGatewayToolSearch({</code> | 声明局部标识符 `searchResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 959 | <code>        query: 'web search fetch describe image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 960 | <code>        includeExternal: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 961 | <code>        limit: 10</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 962 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 963 | <code>    const webSearch = searchResult.structuredContent.tools.find((tool) =&gt; tool.id === 'mcp__ailis_research__web_search');</code> | 声明局部标识符 `webSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 964 | <code>    const webFetch = searchResult.structuredContent.tools.find((tool) =&gt; tool.id === 'mcp__ailis_research__web_fetch');</code> | 声明局部标识符 `webFetch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 965 | <code>    const describeImage = searchResult.structuredContent.tools.find((tool) =&gt; tool.id === 'mcp__ailis_research__describe_image');</code> | 声明局部标识符 `describeImage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 966 | <code>    assert.equal(searchResult.structuredContent.tools.some((tool) =&gt; tool.id === 'mcp__ailis_research__weak_lookup'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 967 | <code>    assert.deepEqual(webSearch.input_schema.required, ['query']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 968 | <code>    assert.equal(webSearch.input_schema.additionalProperties, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 969 | <code>    assert.deepEqual(webFetch.input_schema.required, ['url']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 970 | <code>    assert.deepEqual(describeImage.input_schema.required, ['path']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 971 | <code>    assert.doesNotMatch(JSON.stringify(searchResult), /"spec"\s*:/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 972 | <code>    const rawWebSearch = searchResult.__ailisRawToolSearchTools</code> | 声明局部标识符 `rawWebSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 973 | <code>        .find((tool) =&gt; tool.id === 'mcp__ailis_research__web_search');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 974 | <code>    assert.deepEqual(rawWebSearch.spec.parameters.required, ['query']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 975 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 976 | <code>    const compactedSearchResult = normalizeAilisToolOutput(searchResult, { toolId: 'tool_search' });</code> | 声明局部标识符 `compactedSearchResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 977 | <code>    const compactedWebSearch = compactedSearchResult.structuredContent.tools.find((tool) =&gt; tool.id === 'mcp__ailis_research__web_search');</code> | 声明局部标识符 `compactedWebSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 978 | <code>    assert.deepEqual(compactedWebSearch.input_schema.required, ['query']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 979 | <code>    assert.equal(typeof compactedWebSearch.input_schema.properties, 'object');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 980 | <code>    assert.equal(Array.isArray(compactedWebSearch.input_schema.properties), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 981 | <code>    assert.equal(typeof compactedWebSearch.input_schema.properties.query, 'object');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 982 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 983 | <code>    const exactResearchSearch = await gateway.executeGatewayToolSearch({</code> | 声明局部标识符 `exactResearchSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 984 | <code>        query: 'mcp__ailis_research__web_research',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 985 | <code>        includeExternal: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 986 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 987 | <code>    const exactResearchNames = exactResearchSearch.structuredContent.tools.map((tool) =&gt; tool.id);</code> | 声明局部标识符 `exactResearchNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 988 | <code>    assert.ok(exactResearchNames.includes('mcp__ailis_research__web_research'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 989 | <code>    assert.ok(exactResearchNames.includes('mcp__ailis_research__web_search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 990 | <code>    assert.ok(exactResearchNames.includes('mcp__ailis_research__web_fetch'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 991 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 992 | <code>    const nextSpecs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `nextSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 993 | <code>        requestContext: { nativeDirectTools: true, directToolLimit: 24 },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 994 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 995 | <code>            tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 996 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 997 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 998 | <code>                result: searchResult</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 999 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1000 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1001 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1002 | <code>    assert.ok(nextSpecs.some((tool) =&gt; tool.name === 'mcp__ailis_research__web_search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1003 | <code>    assert.ok(nextSpecs.some((tool) =&gt; tool.name === 'mcp__ailis_research__web_fetch'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1004 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1005 | <code>    const invalidWebSearch = validateNativeDirectToolCall({</code> | 声明局部标识符 `invalidWebSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1006 | <code>        name: 'mcp__ailis_research__web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1007 | <code>        arguments: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1008 | <code>    }, nextSpecs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1009 | <code>    assert.equal(invalidWebSearch.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1010 | <code>    assert.match(invalidWebSearch.errors.join('\n'), /query is required&#124;empty arguments/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1011 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1012 | <code>    const invalidWebFetch = validateNativeDirectToolCall({</code> | 声明局部标识符 `invalidWebFetch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1013 | <code>        name: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1014 | <code>        arguments: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1015 | <code>    }, nextSpecs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1016 | <code>    assert.equal(invalidWebFetch.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1017 | <code>    assert.match(invalidWebFetch.errors.join('\n'), /url is required&#124;empty arguments/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1018 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1019 | <code>    const invalidDescribeImage = validateNativeDirectToolCall({</code> | 声明局部标识符 `invalidDescribeImage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1020 | <code>        name: 'mcp__ailis_research__describe_image',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1021 | <code>        arguments: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1022 | <code>    }, nextSpecs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1023 | <code>    assert.equal(invalidDescribeImage.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1024 | <code>    assert.match(invalidDescribeImage.errors.join('\n'), /path is required&#124;empty arguments/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1025 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1026 | <code>    const nextSpecsAfterVisionFailure = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `nextSpecsAfterVisionFailure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1027 | <code>        requestContext: { nativeDirectTools: true, directToolLimit: 24 },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1028 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1029 | <code>            tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1030 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1031 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1032 | <code>                result: searchResult</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1033 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1034 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1035 | <code>            tool: 'mcp__ailis_research__describe_image',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1036 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1037 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1038 | <code>                status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1039 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1040 | <code>                    content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1041 | <code>                        type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1042 | <code>                        text: 'describe_image failed\nfailure_reason=configured_llm_provider_does_not_accept_image_url_parts'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1043 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1044 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1045 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1046 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1047 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1048 | <code>    assert.equal(nextSpecsAfterVisionFailure.some((tool) =&gt; tool.name === 'mcp__ailis_research__describe_image'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1049 | <code>    assert.ok(nextSpecsAfterVisionFailure.some((tool) =&gt; tool.name === 'mcp__ailis_research__web_fetch'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1050 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1051 | <code>    const valid = validateNativeDirectToolCall({</code> | 声明局部标识符 `valid`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1052 | <code>        name: 'mcp__ailis_research__web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1053 | <code>        arguments: { query: 'Kaggle AI defense competition strategy', maxResults: 5 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1054 | <code>    }, nextSpecs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1055 | <code>    assert.equal(valid.ok, true, valid.errors.join('; '));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1056 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1057 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1058 | <code>test('AILIS web_fetch falls back to an available local backend when python requests transport fails', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1059 | <code>    const { server, url } = await startLocalHttpServer((request, response) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1060 | <code>        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1061 | <code>        response.end(`&lt;!doctype html&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1062 | <code>&lt;html&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1063 | <code>&lt;head&gt;&lt;title&gt;Kaggle competitions&lt;/title&gt;&lt;/head&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1064 | <code>&lt;body&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1065 | <code>&lt;main&gt;Kaggle AI security competition strategy page with leaderboard, rules, and practical defense notes.&lt;/main&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1066 | <code>&lt;a href="/rules"&gt;Competition rules&lt;/a&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1067 | <code>&lt;/body&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1068 | <code>&lt;/html&gt;`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1069 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1070 | <code>    const previous = process.env.AILIS_RESEARCH_TEST_FORCE_PYTHON_FETCH_FAIL;</code> | 声明局部标识符 `previous`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1071 | <code>    process.env.AILIS_RESEARCH_TEST_FORCE_PYTHON_FETCH_FAIL = '1';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1072 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1073 | <code>        const result = await webFetch({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1074 | <code>            url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1075 | <code>            query: 'Kaggle AI security competition strategy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1076 | <code>            maxChars: 2000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1077 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1078 | <code>        assert.equal(result.structuredContent.ok, true, result.content?.[0]?.text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1079 | <code>        assert.ok(['crawl4ai_local', 'node_fetch'].includes(result.details.fetchBackend));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1080 | <code>        if (result.details.fetchBackend === 'node_fetch') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1081 | <code>            assert.equal(result.details.fallbackFrom, 'python_requests');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1082 | <code>            assert.equal(result.details.primaryErrorCode, 'fetch_process_failed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1083 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1084 | <code>        assert.match(result.content[0].text, /Kaggle AI security competition strategy page/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1085 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1086 | <code>        if (previous === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1087 | <code>            delete process.env.AILIS_RESEARCH_TEST_FORCE_PYTHON_FETCH_FAIL;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1088 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1089 | <code>            process.env.AILIS_RESEARCH_TEST_FORCE_PYTHON_FETCH_FAIL = previous;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1090 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1091 | <code>        await new Promise((resolve) =&gt; server.close(resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1092 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1093 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1094 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1095 | <code>test('AILIS runtime budget compacts large schemas and tool text for model context', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1096 | <code>    const schema = {</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1097 | <code>        type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1098 | <code>        description: 'large schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1099 | <code>        properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1100 | <code>            query: { type: 'string', description: 'search query' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1101 | <code>            nested: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1102 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1103 | <code>                description: 'nested details',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1104 | <code>                properties: Object.fromEntries(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1105 | <code>                    Array.from({ length: 80 }, (_, index) =&gt; [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1106 | <code>                        `field_${index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1107 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1108 | <code>                            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1109 | <code>                            description: 'deep field description',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1110 | <code>                            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1111 | <code>                                value: { type: 'string', description: 'value description' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1112 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1113 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1114 | <code>                    ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1115 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1116 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1117 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1118 | <code>        $defs: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1119 | <code>            unused: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1120 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1121 | <code>                description: 'unused'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1122 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1123 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1124 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1125 | <code>    const compacted = compactToolSchema(schema, { maxBytes: 900, maxDepth: 2 });</code> | 声明局部标识符 `compacted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1126 | <code>    assert.equal(compacted.type, 'object');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1127 | <code>    assert.equal('$defs' in compacted, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1128 | <code>    assert.ok(Buffer.byteLength(JSON.stringify(compacted), 'utf8') &lt; Buffer.byteLength(JSON.stringify(schema), 'utf8'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1130 | <code>    const truncated = truncateMiddleText(`${'a'.repeat(2000)}TAIL`, 200);</code> | 声明局部标识符 `truncated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1131 | <code>    assert.match(truncated, /truncated for model budget/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1132 | <code>    assert.match(truncated, /TAIL$/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1133 | <code>    assert.ok(approxTokenCount(truncated) &lt; approxTokenCount(`${'a'.repeat(2000)}TAIL`));</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1134 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1136 | <code>test('AILIS runtime budget preserves primary tool text beyond structured string budget', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1137 | <code>    const text = `${'x'.repeat(3000)}TAIL`;</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1138 | <code>    const compacted = compactToolResultForModel({</code> | 声明局部标识符 `compacted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1139 | <code>        content: [{ type: 'text', text }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1140 | <code>        details: { stdout: text }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1141 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1142 | <code>        maxTextChars: 6000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1143 | <code>        maxStructuredStringChars: 1200</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1144 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1146 | <code>    assert.equal(compacted.content[0].text, text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1147 | <code>    assert.equal(compacted.content[0].originalTextChars, text.length);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1148 | <code>    assert.equal(compacted.content[0].truncated, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1149 | <code>    assert.equal(compacted.details.stdout.length &lt; text.length, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1150 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1152 | <code>test('AILIS runtime budget preserves every line in a bounded source viewport', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1153 | <code>    const lines = Array.from({ length: 60 }, (_, index) =&gt; ({</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1154 | <code>        lineno: 330 + index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1155 | <code>        text: index === 22</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1156 | <code>            ? 'Cuba (1)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1157 | <code>            : index === 47</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1158 | <code>                ? 'Panama (1)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1159 | <code>                : `country row ${index + 1}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1160 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1161 | <code>    const compacted = compactToolResultForModel({</code> | 声明局部标识符 `compacted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1162 | <code>        content: [{ type: 'text', text: 'Find results' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1163 | <code>        structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1164 | <code>            sourceWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1165 | <code>                type: 'source_viewport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1166 | <code>                lineStart: 330,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1167 | <code>                lineEnd: 389,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1168 | <code>                lines</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1169 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1170 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1171 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1172 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1173 | <code>    assert.equal(compacted.structuredContent.sourceWindow.lines.length, 60);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1174 | <code>    assert.equal(compacted.structuredContent.sourceWindow.lines[22].text, 'Cuba (1)');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1175 | <code>    assert.equal(compacted.structuredContent.sourceWindow.lines[47].text, 'Panama (1)');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1176 | <code>    assert.equal(compacted.structuredContent.sourceWindow.lines.some((line) =&gt; 'omitted_items' in line), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1177 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1179 | <code>test('AILIS tool routing prefers strict MCP readers on the Codex-style default surface', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1180 | <code>    const entries = [</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1181 | <code>        ...[</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1182 | <code>            ['mcp__ailis_research__read_spreadsheet', 'Value-only pandas preview for simple CSV/XLSX tables. Does not preserve Excel fills/colors, styles, formulas, comments, or render layout.'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1183 | <code>            ['mcp__ailis_research__read_document', 'Read local Word DOCX documents and tables.'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1184 | <code>            ['mcp__ailis_research__read_presentation', 'Read local PowerPoint PPTX slide decks.'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1185 | <code>            ['mcp__ailis_research__pdf_extract_text', 'Extract text from local PDF files.'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1186 | <code>            ['mcp__ailis_research__describe_image', 'Describe a local image photo screenshot.']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1187 | <code>        ].map(([id, description]) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1188 | <code>            id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1189 | <code>            type: id.startsWith('mcp__') ? 'mcp_tool' : 'gateway_or_runtime_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1190 | <code>            exposure: 'deferred',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1191 | <code>            spec: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1192 | <code>                type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1193 | <code>                name: id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1194 | <code>                description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1195 | <code>                parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1196 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1197 | <code>                    required: ['path'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1198 | <code>                    additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1199 | <code>                    properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1200 | <code>                        path: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1201 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1202 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1203 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1204 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1205 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1207 | <code>    for (const [query, expected] of [</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 1208 | <code>        ['read xlsx excel cell color fill', 'mcp__ailis_research__read_spreadsheet'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1209 | <code>        ['local docx document attachment table', 'mcp__ailis_research__read_document'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1210 | <code>        ['pptx presentation slide deck file', 'mcp__ailis_research__read_presentation'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1211 | <code>        ['local pdf file extract page render', 'mcp__ailis_research__pdf_extract_text'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1212 | <code>        ['attached png image semantic visual description', 'mcp__ailis_research__describe_image']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1213 | <code>    ]) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1214 | <code>        const ranked = rankToolSearchResults(entries, query, 5);</code> | 声明局部标识符 `ranked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1215 | <code>        assert.equal(ranked[0].id, expected, `${query} should route through ${expected}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1216 | <code>        assert.doesNotMatch(buildToolRoutingAdvice(query, ranked), /artifact_tools/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1217 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1218 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1220 | <code>test('AILIS tool routing still allows explicit spreadsheet reader by name', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1221 | <code>    const entries = [</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1222 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1223 | <code>            id: 'mcp__ailis_research__read_spreadsheet',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1224 | <code>            type: 'mcp_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1225 | <code>            tool: 'read_spreadsheet',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1226 | <code>            exposure: 'deferred',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1227 | <code>            spec: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1228 | <code>                type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1229 | <code>                name: 'mcp__ailis_research__read_spreadsheet',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1230 | <code>                description: 'Value-only pandas preview for simple CSV/XLSX tables.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1231 | <code>                parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1232 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1233 | <code>                    required: ['path'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1234 | <code>                    additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1235 | <code>                    properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1236 | <code>                        path: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1237 | <code>                        maxRows: { type: 'number' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1238 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1239 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1240 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1241 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1242 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1244 | <code>    const ranked = rankToolSearchResults(entries, 'explicitly use read_spreadsheet for csv numeric_sums', 5);</code> | 声明局部标识符 `ranked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1245 | <code>    assert.ok(ranked.some((tool) =&gt; tool.id === 'mcp__ailis_research__read_spreadsheet'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1246 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1248 | <code>test('AILIS direct MCP specs expose compact model-facing schema', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1249 | <code>    const spec = createAilisDirectMcpToolSpec({</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1250 | <code>        server: 'research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1251 | <code>        tool: 'deep_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1252 | <code>        description: 'x'.repeat(3000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1253 | <code>        inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1254 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1255 | <code>            description: 'large input',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1256 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1257 | <code>                root: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1258 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1259 | <code>                    description: 'root',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1260 | <code>                    properties: Object.fromEntries(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1261 | <code>                        Array.from({ length: 120 }, (_, index) =&gt; [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1262 | <code>                            `param_${index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1263 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1264 | <code>                                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1265 | <code>                                description: 'verbose param',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1266 | <code>                                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1267 | <code>                                    text: { type: 'string', description: 'verbose text' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1268 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1269 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1270 | <code>                        ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1271 | <code>                    )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1272 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1273 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1274 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1275 | <code>        schemaProperties: ['root']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1276 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1277 | <code>    assert.equal(spec.description.length &lt;= 1200, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1278 | <code>    assert.equal(spec.input_schema.type, 'object');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1279 | <code>    assert.ok(Buffer.byteLength(JSON.stringify(spec.input_schema), 'utf8') &lt; 4500);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-layer 的契约与回归行为。”这一文件职责。 |
| 1280 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
