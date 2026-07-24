# tests/ailis-gateway.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。
- 文件类型：`source-code`
- 原始行数：2354
- SHA-256：`dbac27ae18eea36c315475b65aef04005d81304824e40f36852ccdcb76551514`
- 可运行副本：[打开源文件](../../../source/tests/ailis-gateway.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:http`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-gateway.cjs`、`exceljs`
- 主要符号：`require`、`ExcelJS`、`workspaceRoot`、`gateway`、`status`、`result`、`attached`、`bridgeRequests`、`mcpBridgeResult`、`isPdfView`、`isSectionView`、`isPagedView`、`isParentIndexView`、`firstTurnTools`、`webRun`、`webRunDescription`、`emptyResponse`、`mixedResponse`、`archiveResponse`、`anchoredSelectorResponse`、`selectorComparisonResponse`、`selectionAudit`、`partialSelectorResponse`、`partialAudit`、`prematureChildResponse`、`completedParentIndexResponse`、`allowedChildResponse`、`pagedSelectorResponse`、`noResultsResponse`、`bloatedNoResultsResponse`、`broadNoResultsResponse`、`historicalNoResultsResponse`、`failedSearchResponse`、`searchResponse`、`results`、`partialStartedAt`、`partialSearchResponse`、`githubSearchResponse`、`evaluationSearchResponse`、`evaluationSearch`、`openResponse`、`pdfLandingResponse`、`continueResponse`、`clickResponse`、`directPdfResponse`、`bridgeRequestCountBeforeCachedFind`、`cachedPdfFindResponse`、`screenshotResponse`、`sectionOpenResponse`、`sectionClickResponse`、`jsonFetch`、`response`、`body`、`withHttpServer`、`server`、`address`、`baseUrl`、`buildSimplePdfWithText`、`escaped`、`stream`、`objects`、`offsets`、`xrefOffset`、`index`、`buildBlankPdfWithoutSelectableText`、`records`、`events`、`transcript`、`calls`、`llmSettings`、`health`、`tools`、`searchTools`、`write`、`read`、`blocked`、`approval`、`exec`、`execWithArgs`、`recoveredPowerShellWrapper`、`longExec`、`i`、`outputStore`、`logStat`、`outputSearch`、`outputTail`、`outputRead`、`wrongOutputReadSurface`、`audit`、`outsideRoot`、`outsideExec`、`protectedWorkdir`、`protectedExec`、`readBack`、`api`、`url`、`search`、`direct`、`mcpTool`、`latestMcpRetrievalLimit`、`docxResult`、`xlsxResult`、`archiveResult`、`artifactQueryResult`、`artifactImportResult`、`page`、`servers`、`fetched`、`artifactRecord`、`artifactId`、`query`、`compute`、`storedRecord`、`rawRead`、`workbookPath`、`workbook`、`sheet`、`imported`、`largeLog`、`readLog`、`textArtifactId`、`textSearch`、`textTail`、`readPdf`、`documentArtifactId`、`documentSearch`、`documentPage`、`readScannedPdf`、`firstSeq`、`cursor`、`recent`、`allRecent`、`runId`、`sessionId`、`analysis`、`runs`、`viaHttp`、`listViaHttp`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 3 | <code>import http from 'node:http';</code> | 导入依赖 `node:http`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 6 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 7 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 10 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 11 | <code>    AILISGateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 12 | <code>    attachSuggestedMcpToolsForDirectExposure,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 13 | <code>    collectSuggestedMcpToolNames</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 14 | <code>} = require('../electron/ailis-gateway.cjs');</code> | 导入依赖 `../electron/ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 15 | <code>const ExcelJS = require('exceljs');</code> | 导入依赖 `exceljs`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>test('AILIS Gateway uses the low-latency sensitive-word evaluator by default', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 18 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-safety-fast-path-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 19 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 20 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 21 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 22 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 23 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 24 | <code>        emberHarnessEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 25 | <code>        emberHarnessMode: 'enforce'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 26 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>    const status = await gateway.prepareLocalSafetyEvaluator('test');</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 29 | <code>    assert.equal(status.evaluatorRuntime.engine, 'aho_corasick_lexicon');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 30 | <code>    assert.equal(status.evaluatorRuntime.estimatedDownloadBytes, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 31 | <code>    assert.equal(status.evaluatorRuntime.ready, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>    const result = await gateway.emberHarness.check({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 34 | <code>        runId: 'safety-fast-path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 35 | <code>        stage: 'input',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 36 | <code>        boundary: 'before_model_input',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 37 | <code>        text: '我 要 杀 了 你'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 38 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>    assert.equal(result.blocked, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 40 | <code>    assert.equal(result.evaluatorDetails.engine, 'aho_corasick_lexicon');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 41 | <code>    await gateway.localSafetyEvaluator.dispose();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 42 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>test('AILIS Gateway exposes actionable web_run contract errors to the model', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 45 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-web-run-contract-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 46 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 47 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 48 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 49 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 50 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 51 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>    const result = await gateway.callTool({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 54 | <code>        tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 55 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 56 | <code>            search_query: [{ q: 'historical catalog' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 57 | <code>            archive: [{ url: 'https://example.test/search?', mode: 'search' }]</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 58 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 59 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>    assert.equal(result.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 62 | <code>    assert.equal(result.status, 'invalid_tool_args');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 63 | <code>    assert.match(result.error, /received search_query, archive/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 64 | <code>    assert.match(result.error, /separate follow-up calls/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 65 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>test('AILIS materializes structured MCP follow-up actions for the next model turn', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 68 | <code>    const result = {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 69 | <code>        structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 70 | <code>            sources: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 71 | <code>                open_page: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 72 | <code>                    tool: 'open_page',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 73 | <code>                    args: { url: 'https://example.test/source', lineno: 1 }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 74 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>            }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>            suggestedNextCalls: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 77 | <code>                tool: 'find_in_page',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 78 | <code>                args: { url: 'https://example.test/source', pattern: 'needle' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 79 | <code>            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 82 | <code>    assert.deepEqual(collectSuggestedMcpToolNames(result).sort(), ['find_in_page', 'open_page']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>    const attached = await attachSuggestedMcpToolsForDirectExposure(</code> | 声明局部标识符 `attached`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 85 | <code>        result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 86 | <code>        'mcp__ailis_research__web_research',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 87 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 88 | <code>            listToolSpecs: async () =&gt; [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 89 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 90 | <code>                    server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 91 | <code>                    tool: 'open_page',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 92 | <code>                    name: 'open_page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 93 | <code>                    description: 'Open a page.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 94 | <code>                    inputSchema: { type: 'object', required: ['url'], properties: { url: { type: 'string' } }, additionalProperties: false }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 95 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 97 | <code>                    server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 98 | <code>                    tool: 'find_in_page',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 99 | <code>                    name: 'find_in_page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 100 | <code>                    description: 'Find in a page.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 101 | <code>                    inputSchema: { type: 'object', required: ['url', 'pattern'], properties: { url: { type: 'string' }, pattern: { type: 'string' } }, additionalProperties: false }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 102 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>    assert.equal(attached.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 108 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 109 | <code>        result.__ailisSuggestedMcpTools.map((tool) =&gt; tool.id).sort(),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 110 | <code>        ['mcp__ailis_research__find_in_page', 'mcp__ailis_research__open_page']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 111 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>    assert.equal(Object.keys(result).includes('__ailisSuggestedMcpTools'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 113 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>test('AILIS exposes Codex-style web_run and preserves refs across search and open turns', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 116 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-native-web-search-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 117 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 118 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 119 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 120 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 121 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 122 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>    const bridgeRequests = [];</code> | 声明局部标识符 `bridgeRequests`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 124 | <code>    const mcpBridgeResult = (content, structuredContent) =&gt; ({</code> | 声明局部标识符 `mcpBridgeResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 125 | <code>        content: [{ type: 'text', text: content }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 126 | <code>        structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 127 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 128 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 129 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 130 | <code>                content: [{ type: 'text', text: content }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 131 | <code>                structuredContent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 132 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 135 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 136 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 137 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 138 | <code>                content: [{ type: 'text', text: content }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 139 | <code>                structuredContent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 140 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>    gateway.runtime.executeMcpBridge = async (request) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 144 | <code>        bridgeRequests.push(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 145 | <code>        if (request.tool === 'pdf_extract_text') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 146 | <code>            return mcpBridgeResult('The quoted word is "fluffy".', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 147 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 148 | <code>                url: request.args.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 149 | <code>                contentType: 'application/pdf',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 150 | <code>                pages: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 151 | <code>                extractedText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 152 | <code>                    'The quoted word is "fluffy".',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 153 | <code>                    'The fish transport bag has a volume of 0.1777 m3.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 154 | <code>                    'End of extracted source.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 155 | <code>                ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 156 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>        if (request.tool === 'webpage_screenshot') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 159 | <code>            return mcpBridgeResult(`Captured screenshot at ${request.args.path}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 160 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 161 | <code>                url: request.args.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 162 | <code>                path: request.args.path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 163 | <code>                contentType: 'image/png',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 164 | <code>                modelImage: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 165 | <code>                    image_url: request.args.path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 166 | <code>                    detail: request.args.detail</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 167 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>        if (request.tool === 'web_find') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 171 | <code>            return mcpBridgeResult(`Find results for pattern: ${request.args.pattern}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 172 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 173 | <code>                url: request.args.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 174 | <code>                pattern: request.args.pattern,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 175 | <code>                source: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 176 | <code>                    type: 'source_viewport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 177 | <code>                    url: request.args.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 178 | <code>                    ref_id: request.args.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 179 | <code>                    line_start: 40,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 180 | <code>                    line_end: 43,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 181 | <code>                    total_lines: 80,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 182 | <code>                    lines: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 183 | <code>                        { lineno: 40, text: '## Studio albums' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 184 | <code>                        { lineno: 41, text: '2005' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 185 | <code>                        { lineno: 42, text: 'Corazon Libre' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 186 | <code>                        { lineno: 43, text: '2009' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 187 | <code>                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>        if (request.tool === 'web_archive_lookup') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 192 | <code>            return mcpBridgeResult('Archived source viewport: Country: gt', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 193 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 194 | <code>                kind: request.args.mode === 'open' ? 'web_archive_snapshot' : 'web_archive_captures',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 195 | <code>                originalUrl: request.args.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 196 | <code>                captures: request.args.mode === 'open' ? [] : [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 197 | <code>                    provider: 'internet_archive',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 198 | <code>                    timestamp: '20241212025015',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 199 | <code>                    originalUrl: request.args.url</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 200 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>        if (request.tool === 'web_fetch' &#124;&#124; request.tool === 'render_page') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 204 | <code>            if (request.args.url.endsWith('.pdf')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 205 | <code>                return mcpBridgeResult('PDF content requires extraction.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 206 | <code>                    contentType: 'application/pdf',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 207 | <code>                    url: request.args.url</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 208 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>            const isPdfView = request.args.url.endsWith('/pdf-view');</code> | 声明局部标识符 `isPdfView`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 211 | <code>            const isSectionView = request.args.url.endsWith('/section-view');</code> | 声明局部标识符 `isSectionView`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 212 | <code>            const isPagedView = request.args.url.endsWith('/paged-view');</code> | 声明局部标识符 `isPagedView`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 213 | <code>            const isParentIndexView = request.args.url.endsWith('/rules');</code> | 声明局部标识符 `isParentIndexView`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 214 | <code>            return mcpBridgeResult('L1: opened source', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 215 | <code>                    contentType: 'text/html',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 216 | <code>                    fetchBackend: 'crawl4ai_local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 217 | <code>                    observedRelevantLinks: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 218 | <code>                        kind: 'pdf',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 219 | <code>                        text: isPdfView ? 'Download PDF' : 'PDF',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 220 | <code>                        url: isPdfView</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 221 | <code>                            ? 'https://example.test/article.pdf'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 222 | <code>                            : 'https://example.test/pdf-view'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 223 | <code>                    }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>                    ...(isPdfView ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 225 | <code>                        suggestedNextCalls: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 226 | <code>                            tool: 'pdf_extract_text',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 227 | <code>                            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 228 | <code>                                url: 'https://example.test/article.pdf',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 229 | <code>                                maxChars: 12000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 230 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>                        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>                    } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 233 | <code>                    source: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 234 | <code>                        type: 'source_viewport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 235 | <code>                        url: request.args.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 236 | <code>                        ref_id: request.args.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 237 | <code>                        line_start: isPagedView ? 58 : 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 238 | <code>                        line_end: isPagedView ? 105 : isParentIndexView ? 7 : 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 239 | <code>                        total_lines: isPagedView ? 175 : isParentIndexView ? 7 : isSectionView ? 3 : 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 240 | <code>                        has_more_after: isPagedView,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 241 | <code>                        lines: isPagedView ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 242 | <code>                            { lineno: 58, text: '1. ARTICLE I. GENERAL' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 243 | <code>                            { lineno: 105, text: '2. ARTICLE II. OTHER' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 244 | <code>                        ] : isParentIndexView ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 245 | <code>                            { lineno: 1, text: '1. ARTICLE I. GENERAL' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 246 | <code>                            { lineno: 2, text: '2. ARTICLE VI. WITNESSES' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 247 | <code>                            { lineno: 3, text: 'Rule 601. Competency to Testify in General' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 248 | <code>                            { lineno: 4, text: 'Rule 611. Mode and Order of Examining Witnesses' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 249 | <code>                            { lineno: 5, text: '3. ARTICLE VII. OPINIONS AND EXPERT TESTIMONY' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 250 | <code>                            { lineno: 6, text: 'Rule 701. Opinion Testimony by Lay Witnesses' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 251 | <code>                            { lineno: 7, text: 'Rule 702. Testimony by Expert Witnesses' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 252 | <code>                        ] : isSectionView ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 253 | <code>                            { lineno: 1, text: '## Contents' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 254 | <code>                            { lineno: 2, text: '[Studio albums](https://example.test/section-view#Studio_albums)' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 255 | <code>                            { lineno: 3, text: '[Live albums](https://example.test/section-view#Live_albums)' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 256 | <code>                        ] : [{ lineno: 1, text: 'opened source' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 257 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>        if (request.args.query.startsWith('no results fixture')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 261 | <code>            return mcpBridgeResult('No results.', { results: [] });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 262 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>        if (request.args.query === 'bridge validation failure fixture') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 264 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 265 | <code>                content: [{ type: 'text', text: 'MCP tool arguments failed inputSchema validation.' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 266 | <code>                isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 267 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 268 | <code>                    status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 269 | <code>                    error: 'MCP tool arguments failed inputSchema validation.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 270 | <code>                    details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 271 | <code>                        status: 'invalid_mcp_tool_args',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 272 | <code>                        errors: ['unexpected property: domains']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 273 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 274 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 277 | <code>        if (request.args.query === 'hanging search fixture') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 278 | <code>            return await new Promise(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 279 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 280 | <code>        if (request.args.query === 'github file fixture') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 281 | <code>            return mcpBridgeResult('GitHub file result.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 282 | <code>                results: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 283 | <code>                    title: 'Repository changelog',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 284 | <code>                    url: 'https://github.com/example/project/blob/v1.2/docs/changelog.rst',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 285 | <code>                    snippet: 'Official changelog source.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 286 | <code>                }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 287 | <code>                suggestedNextCalls: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 288 | <code>                    tool: 'github_repo_read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 289 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 290 | <code>                        repo: 'example/project',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 291 | <code>                        mode: 'file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 292 | <code>                        path: 'docs/changelog.rst',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 293 | <code>                        ref: 'v1.2'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 294 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 295 | <code>                    reason: 'Read the linked GitHub file through the repository API.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 296 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>        if (request.args.query === 'evaluation leak fixture') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 300 | <code>            return mcpBridgeResult('Evaluation leak fixture results.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 301 | <code>                results: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 302 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 303 | <code>                        title: 'A benchmark paper',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 304 | <code>                        url: 'https://example.test/benchmark.pdf',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 305 | <code>                        snippet: 'Question: What was the actual enrollment count of the clinical trial on H. pylori in acne vulgaris patients from Jan-May 2018 as listed on the NIH website? Ground truth: 90'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 306 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 308 | <code>                        title: 'GAIA Task instruction.md',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 309 | <code>                        url: 'https://github.com/example/harbor-datasets/blob/main/datasets/gaia/task-id/instruction.md',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 310 | <code>                        snippet: 'GAIA Task: What was the actual enrollment count of the clinical trial on H. pylori in acne vulgaris patients from Jan-May 2018 as listed on the NIH website? Output requirements: write only the final answer.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 311 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 312 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 313 | <code>                        title: 'Study Details &#124; NCT03411733',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 314 | <code>                        url: 'https://clinicaltrials.gov/study/NCT03411733',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 315 | <code>                        snippet: 'Official ClinicalTrials.gov study record.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 316 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 318 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>        if (request.args.query === 'nested selector comparison fixture') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 321 | <code>            return mcpBridgeResult('Nested selector comparison results.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 322 | <code>                results: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 323 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 324 | <code>                        title: 'ARTICLE VI',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 325 | <code>                        url: 'https://example.test/article-vi',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 326 | <code>                        snippet: 'Rule 611. &#124; Rule 611. Examining Witnesses Rule 612. A Witness Rule 615. Excluding Witnesses'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 327 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 328 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 329 | <code>                        title: 'ARTICLE VII',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 330 | <code>                        url: 'https://example.test/article-vii',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 331 | <code>                        snippet: 'Rule 701. Lay Witnesses Rule 702. Expert Witnesses Rule 706. Court Expert Witnesses'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 332 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 334 | <code>                        title: 'ARTICLE VI mirror',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 335 | <code>                        url: 'https://mirror.example.test/article-vi',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 336 | <code>                        snippet: 'Rule 601. Competency to Testify'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 337 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 339 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 341 | <code>        if (request.args.query === 'nested selector partial fixture') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 342 | <code>            return mcpBridgeResult('Partial nested selector results.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 343 | <code>                results: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 344 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 345 | <code>                        title: 'ARTICLE VI',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 346 | <code>                        url: 'https://example.test/rules/article-vi',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 347 | <code>                        snippet: 'ARTICLE VI. WITNESSES Rule 601. A Witness'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 348 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 349 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 350 | <code>                        title: 'Rules index',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 351 | <code>                        url: 'https://example.test/rules',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 352 | <code>                        snippet: 'All rule articles and their titles.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 353 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 354 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 355 | <code>                        title: 'Site home',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 356 | <code>                        url: 'https://example.test',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 357 | <code>                        snippet: 'General information.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 358 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 361 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>        return mcpBridgeResult(`Search result for ${request.args.query}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 363 | <code>                results: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 364 | <code>                    title: request.args.query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 365 | <code>                    url: `https://example.test/${encodeURIComponent(request.args.query)}`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 366 | <code>                    snippet: `Evidence for ${request.args.query}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 367 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 369 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 370 | <code>    gateway.runtime.mcpManager.listToolSpecs = async () =&gt; [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 371 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 372 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 373 | <code>            tool: 'pdf_extract_text',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 374 | <code>            name: 'pdf_extract_text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 375 | <code>            description: 'Extract text from a known PDF URL.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 376 | <code>            inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 377 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 378 | <code>                required: ['url'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 379 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 380 | <code>                    url: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 381 | <code>                    maxChars: { type: 'integer' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 382 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 383 | <code>                additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 384 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 385 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 387 | <code>            server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 388 | <code>            tool: 'github_repo_read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 389 | <code>            name: 'github_repo_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 390 | <code>            description: 'Read a public GitHub repository file.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 391 | <code>            inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 392 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 393 | <code>                required: ['repo', 'mode', 'path'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 394 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 395 | <code>                    repo: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 396 | <code>                    mode: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 397 | <code>                    path: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 398 | <code>                    ref: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 399 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 400 | <code>                additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 401 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 402 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 403 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 404 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 405 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 406 | <code>        const firstTurnTools = gateway.gatewayToolRuntimeRegistry.modelVisibleSpecs();</code> | 声明局部标识符 `firstTurnTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 407 | <code>        const webRun = firstTurnTools.find((tool) =&gt; tool.name === 'web_run');</code> | 声明局部标识符 `webRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 408 | <code>        const webRunDescription = (await fs.readFile(</code> | 声明局部标识符 `webRunDescription`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 409 | <code>            path.resolve('electron', 'ailis-web-run-description.md'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 410 | <code>            'utf8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 411 | <code>        )).replace(/\r\n/g, '\n').trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 412 | <code>        assert.ok(webRun);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 413 | <code>        assert.equal(webRun.description, webRunDescription);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 414 | <code>        assert.match(webRun.description, /exactly one supported operation/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 415 | <code>        assert.doesNotMatch(webRun.description, /empty query/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 416 | <code>        assert.doesNotMatch(webRun.description, /image_query&#124;finance&#124;weather&#124;sports/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 417 | <code>        assert.doesNotMatch(webRun.description, /truncated for model budget/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 418 | <code>        assert.ok(webRun.parameters.properties.search_query);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 419 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 420 | <code>            webRun.parameters.properties.search_query.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 421 | <code>            'Query the internet search engine for a given list of queries.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 422 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 423 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 424 | <code>            webRun.parameters.properties.search_query.items.properties.q.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 425 | <code>            'One concise discovery query. Keep only verified discriminative entities and constraints; never concatenate previous queries or inject an unverified intermediate answer/entity inferred from memory.'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 426 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 427 | <code>        assert.equal(webRun.parameters.properties.search_query.maxItems, 4);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 428 | <code>        assert.equal(webRun.parameters.properties.search_query.items.properties.q.minLength, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 429 | <code>        assert.equal(webRun.parameters.properties.search_query.items.properties.q.maxLength, 240);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 430 | <code>        assert.equal(webRun.parameters.properties.search_query.items.properties.recency.minimum, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 431 | <code>        assert.match(webRun.parameters.properties.search_query.items.properties.recency.description, /explicitly asks for recent/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 432 | <code>        assert.ok(webRun.parameters.properties.open);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 433 | <code>        assert.ok(webRun.parameters.properties.find);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 434 | <code>        assert.ok(webRun.parameters.properties.screenshot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 435 | <code>        assert.ok(webRun.parameters.properties.archive);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 436 | <code>        assert.equal(webRun.parameters.properties.archive.items.properties.scanLimit.maximum, 10000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 437 | <code>        assert.equal(webRun.parameters.properties.find.description, 'Find one text pattern in one page.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 438 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 439 | <code>            webRun.parameters.properties.find.items.properties.pattern.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 440 | <code>            'Text pattern to find.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 441 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 442 | <code>        assert.equal(webRun.parameters.properties.open.items.properties.lineno.type, 'integer');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 443 | <code>        assert.equal(webRun.parameters.properties.response_length.description, 'Set the length of the response to be returned.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 444 | <code>        assert.equal(webRun.parameters.properties.progress_note, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 445 | <code>        assert.equal(webRun.parameters.properties.image_query, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 446 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 447 | <code>            webRun.parameters.properties.screenshot.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 448 | <code>            'Capture one browser-rendered screenshot and return it to the main model as visual tool evidence.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 449 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>        assert.equal(firstTurnTools.some((tool) =&gt; tool.name === 'web_search'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 451 | <code>        assert.equal(firstTurnTools.some((tool) =&gt; tool.name === 'mcp__ailis_research__open_page'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 453 | <code>        const emptyResponse = await gateway.callTool({</code> | 声明局部标识符 `emptyResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 454 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 455 | <code>            args: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 456 | <code>            context: { workspace: workspaceRoot, runId: 'run-empty', sessionId: 'session-1', iteration: 0 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 457 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 458 | <code>        assert.equal(emptyResponse.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 459 | <code>        assert.equal(emptyResponse.status, 'invalid_tool_args');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>        const mixedResponse = await gateway.callTool({</code> | 声明局部标识符 `mixedResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 462 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 463 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 464 | <code>                search_query: [{ q: 'one operation only' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 465 | <code>                open: [{ ref_id: 'https://example.test' }]</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 466 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 467 | <code>            context: { workspace: workspaceRoot, runId: 'run-mixed', sessionId: 'session-1', iteration: 0 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 468 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 469 | <code>        assert.equal(mixedResponse.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 470 | <code>        assert.equal(mixedResponse.status, 'invalid_tool_args');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>        const archiveResponse = await gateway.callTool({</code> | 声明局部标识符 `archiveResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 473 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 474 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 475 | <code>                archive: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 476 | <code>                    url: 'https://offline.example/Search/Results?',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 477 | <code>                    mode: 'captures',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 478 | <code>                    matchType: 'prefix',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 479 | <code>                    contains: 'subject 2020'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 480 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 481 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 482 | <code>            context: { workspace: workspaceRoot, runId: 'run-archive', sessionId: 'session-archive', iteration: 0 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 483 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 484 | <code>        assert.equal(archiveResponse.ok, true, JSON.stringify(archiveResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 485 | <code>        assert.equal(bridgeRequests.at(-1).tool, 'web_archive_lookup');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 486 | <code>        assert.equal(bridgeRequests.at(-1).args.matchType, 'prefix');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 487 | <code>        assert.match(archiveResponse.result.content[0].text, /Country: gt/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 489 | <code>        const anchoredSelectorResponse = await gateway.callTool({</code> | 声明局部标识符 `anchoredSelectorResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 490 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 491 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 492 | <code>                search_query: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 493 | <code>                    q: 'Cornell LII Rule 601 last amendment deleted word'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 494 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 495 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 496 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 497 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 498 | <code>                runId: 'run-anchored-selector',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 499 | <code>                sessionId: 'session-anchored-selector',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 500 | <code>                iteration: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 501 | <code>                exactAnswerMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 502 | <code>                currentUserMessage: 'Under the rules index, what was deleted from the first rule in the article with the most exact title matches?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 503 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 504 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 505 | <code>        assert.equal(anchoredSelectorResponse.ok, true, JSON.stringify(anchoredSelectorResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 506 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 507 | <code>            anchoredSelectorResponse.result.structuredContent.search.queryAssumptionAudit.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 508 | <code>            'unverified_intermediate_anchor_advisory'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 509 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 510 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 511 | <code>            anchoredSelectorResponse.result.structuredContent.search.queryAssumptionAudit.queryGuidance.remove_unverified_anchors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 512 | <code>            ['Rule 601']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 513 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 514 | <code>        assert.match(anchoredSelectorResponse.result.content[0].text, /search still ran/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 516 | <code>        const selectorComparisonResponse = await gateway.callTool({</code> | 声明局部标识符 `selectorComparisonResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 517 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 518 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 519 | <code>                search_query: [{ q: 'nested selector comparison fixture' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 520 | <code>                response_length: 'medium'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 521 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 522 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 523 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 524 | <code>                runId: 'run-selector-comparison',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 525 | <code>                sessionId: 'session-selector-comparison',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 526 | <code>                iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 527 | <code>                exactAnswerMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 528 | <code>                currentUserMessage: 'Which article has "witnesses" in the most titles?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 529 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 530 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 531 | <code>        assert.equal(selectorComparisonResponse.ok, true, JSON.stringify(selectorComparisonResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 532 | <code>        const selectionAudit = selectorComparisonResponse.result.structuredContent.search.selectionAudit;</code> | 声明局部标识符 `selectionAudit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 533 | <code>        assert.equal(selectionAudit.status, 'incomplete_candidate_set');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 534 | <code>        assert.equal(selectionAudit.quoted_term, 'witnesses');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 535 | <code>        assert.equal(selectionAudit.result_ranking_is_selection_evidence, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 536 | <code>        assert.equal(selectionAudit.candidate_set_coverage_sufficient, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 537 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 538 | <code>            selectorComparisonResponse.result.structuredContent.search.queryGuidance.strategy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 539 | <code>            'compare_visible_parents_and_expand_candidate_boundary'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 540 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 541 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 542 | <code>            selectionAudit.candidates.map((candidate) =&gt; [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 543 | <code>                candidate.ref_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 544 | <code>                candidate.visible_snippet_occurrences</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 545 | <code>            ]),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 546 | <code>            [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 547 | <code>                ['turn1search1', 3],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 548 | <code>                ['turn1search0', 2]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 549 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 550 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 551 | <code>        assert.match(selectorComparisonResponse.result.content[0].text, /search ranking does not answer/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 552 | <code>        assert.match(selectorComparisonResponse.result.content[0].text, /not final per-group title counts/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 553 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 554 | <code>            selectorComparisonResponse.result.structuredContent.search.suggestedNextCalls[0].args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 555 | <code>            { open: [{ ref_id: 'turn1search1' }] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 556 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 557 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 558 | <code>        const partialSelectorResponse = await gateway.callTool({</code> | 声明局部标识符 `partialSelectorResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 559 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 560 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 561 | <code>                search_query: [{ q: 'nested selector partial fixture' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 562 | <code>                response_length: 'medium'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 563 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 564 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 565 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 566 | <code>                runId: 'run-selector-partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 567 | <code>                sessionId: 'session-selector-partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 568 | <code>                iteration: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 569 | <code>                exactAnswerMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 570 | <code>                currentUserMessage: 'Which article has "witnesses" in the most titles?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 571 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 572 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 573 | <code>        assert.equal(partialSelectorResponse.ok, true, JSON.stringify(partialSelectorResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 574 | <code>        const partialAudit = partialSelectorResponse.result.structuredContent.search.selectionAudit;</code> | 声明局部标识符 `partialAudit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 575 | <code>        assert.equal(partialAudit.status, 'incomplete_candidate_set');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 576 | <code>        assert.equal(partialAudit.candidate_set_coverage_sufficient, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 577 | <code>        assert.deepEqual(partialAudit.parent_index_candidates, ['turn2search1']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 578 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 579 | <code>            partialSelectorResponse.result.structuredContent.search.queryGuidance.strategy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 580 | <code>            'nearest_url_ancestor_first'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 581 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 582 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 583 | <code>            partialSelectorResponse.result.structuredContent.search.suggestedNextCalls[0].args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 584 | <code>            { open: [{ ref_id: 'turn2search1' }] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 585 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 586 | <code>        assert.match(partialSelectorResponse.result.content[0].text, /open the nearest parent index/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 587 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 588 | <code>        const prematureChildResponse = await gateway.callTool({</code> | 声明局部标识符 `prematureChildResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 589 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 590 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 591 | <code>                open: [{ ref_id: 'turn2search0', lineno: 1 }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 592 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 593 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 594 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 595 | <code>                runId: 'run-selector-partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 596 | <code>                sessionId: 'session-selector-partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 597 | <code>                iteration: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 598 | <code>                exactAnswerMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 599 | <code>                currentUserMessage: 'Which article has "witnesses" in the most titles?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 600 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 601 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 602 | <code>        assert.equal(prematureChildResponse.ok, true, JSON.stringify(prematureChildResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 603 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 604 | <code>            prematureChildResponse.result.structuredContent.selectionDependencyAdvisory.required_parent_index_ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 605 | <code>            'turn2search1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 606 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 607 | <code>        assert.match(prematureChildResponse.result.content[0].text, /opened anyway/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 608 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 609 | <code>        const completedParentIndexResponse = await gateway.callTool({</code> | 声明局部标识符 `completedParentIndexResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 610 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 611 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 612 | <code>                open: [{ ref_id: 'turn2search1', lineno: 1 }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 613 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 614 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 615 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 616 | <code>                runId: 'run-selector-partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 617 | <code>                sessionId: 'session-selector-partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 618 | <code>                iteration: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 619 | <code>                exactAnswerMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 620 | <code>                currentUserMessage: 'Which article has "witnesses" in the most titles?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 621 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 622 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 623 | <code>        assert.equal(completedParentIndexResponse.ok, true, JSON.stringify(completedParentIndexResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 624 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 625 | <code>            completedParentIndexResponse.result.structuredContent.selectionProtocol.boundary_complete,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 626 | <code>            true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 627 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 628 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 629 | <code>            completedParentIndexResponse.result.structuredContent.selectionProtocol.exact_title_match_counts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 630 | <code>                .map((group) =&gt; [group.group, group.count]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 631 | <code>            [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 632 | <code>                ['ARTICLE VII', 2],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 633 | <code>                ['ARTICLE VI', 1],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 634 | <code>                ['ARTICLE I', 0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 635 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 636 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 637 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 638 | <code>            completedParentIndexResponse.result.structuredContent.selectionProtocol.winning_group,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 639 | <code>            'ARTICLE VII'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 640 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 641 | <code>        assert.match(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 642 | <code>            completedParentIndexResponse.result.content[0].text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 643 | <code>            /Unique winning group: ARTICLE VII/</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 644 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 645 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 646 | <code>        const allowedChildResponse = await gateway.callTool({</code> | 声明局部标识符 `allowedChildResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 647 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 648 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 649 | <code>                open: [{ ref_id: 'turn2search0', lineno: 1 }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 650 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 651 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 652 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 653 | <code>                runId: 'run-selector-partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 654 | <code>                sessionId: 'session-selector-partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 655 | <code>                iteration: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 656 | <code>                exactAnswerMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 657 | <code>                currentUserMessage: 'Which article has "witnesses" in the most titles?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 658 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 659 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 660 | <code>        assert.equal(allowedChildResponse.ok, true, JSON.stringify(allowedChildResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 661 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 662 | <code>        const pagedSelectorResponse = await gateway.callTool({</code> | 声明局部标识符 `pagedSelectorResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 663 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 664 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 665 | <code>                open: [{ ref_id: 'https://example.test/paged-view', lineno: 58 }]</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 666 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 667 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 668 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 669 | <code>                runId: 'run-selector-paged',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 670 | <code>                sessionId: 'session-selector-paged',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 671 | <code>                iteration: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 672 | <code>                exactAnswerMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 673 | <code>                currentUserMessage: 'Which article has "witnesses" in the most titles?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 674 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 675 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 676 | <code>        assert.equal(pagedSelectorResponse.ok, true, JSON.stringify(pagedSelectorResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 677 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 678 | <code>            pagedSelectorResponse.result.structuredContent.suggestedNextCalls[0],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 679 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 680 | <code>                tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 681 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 682 | <code>                    open: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 683 | <code>                        ref_id: 'turn3view0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 684 | <code>                        lineno: 106</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 685 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 686 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 687 | <code>                reason: 'Continue the same parent index at the next unread line before selecting a child; the current viewport does not establish the candidate-set boundary.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 688 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 689 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 690 | <code>        assert.match(pagedSelectorResponse.result.content[0].text, /Next recommended call/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 691 | <code>        assert.match(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 692 | <code>            pagedSelectorResponse.result.content[0].text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 693 | <code>            /web_run \{"open":\[\{"ref_id":"turn3view0","lineno":106\}\]\}/</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 694 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 695 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 696 | <code>        const noResultsResponse = await gateway.callTool({</code> | 声明局部标识符 `noResultsResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 697 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 698 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 699 | <code>                search_query: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 700 | <code>                    q: 'no results fixture',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 701 | <code>                    recency: 30,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 702 | <code>                    domains: ['example.test']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 703 | <code>                }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 704 | <code>                response_length: 'medium'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 705 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 706 | <code>            context: { workspace: workspaceRoot, runId: 'run-zero', sessionId: 'session-zero', iteration: 0 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 707 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 708 | <code>        assert.equal(noResultsResponse.ok, true, JSON.stringify(noResultsResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 709 | <code>        assert.equal(noResultsResponse.result.structuredContent.search.status, 'empty');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 710 | <code>        assert.match(noResultsResponse.result.content[0].text, /omit optional recency\/domain filters/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 711 | <code>        assert.deepEqual(noResultsResponse.result.structuredContent.search.suggestedNextCalls, [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 712 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 713 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 714 | <code>                search_query: [{ q: 'no results fixture' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 715 | <code>                response_length: 'medium'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 716 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 717 | <code>            reason: 'Retry the same model-authored queries without optional recency or domain transport filters.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 718 | <code>        }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 719 | <code>        const bloatedNoResultsResponse = await gateway.callTool({</code> | 声明局部标识符 `bloatedNoResultsResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 720 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 721 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 722 | <code>                search_query: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 723 | <code>                    q: `no results fixture ${Array.from({ length: 4 }, () =&gt; 'BASE 633 2020 unknown language country flag').join(' ')}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 724 | <code>                    domains: ['base-search.net']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 725 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 726 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 727 | <code>            context: { workspace: workspaceRoot, runId: 'run-zero-bloated', sessionId: 'session-zero-bloated', iteration: 0 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 728 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 729 | <code>        assert.equal(bloatedNoResultsResponse.ok, true, JSON.stringify(bloatedNoResultsResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 730 | <code>        assert.equal(bloatedNoResultsResponse.result.structuredContent.search.suggestedNextCalls, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 731 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 732 | <code>            bloatedNoResultsResponse.result.structuredContent.search.queryGuidance.repeat_previous_query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 733 | <code>            false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 734 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 735 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 736 | <code>            bloatedNoResultsResponse.result.structuredContent.search.queryGuidance.strategy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 737 | <code>            'fresh_concise_query'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 738 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 739 | <code>        assert.match(bloatedNoResultsResponse.result.content[0].text, /do not concatenate or repeat/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 740 | <code>        const broadNoResultsResponse = await gateway.callTool({</code> | 声明局部标识符 `broadNoResultsResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 741 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 742 | <code>            args: { search_query: [{ q: 'no results fixture' }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 743 | <code>            context: { workspace: workspaceRoot, runId: 'run-zero-broad', sessionId: 'session-zero-broad', iteration: 0 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 744 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 745 | <code>        assert.equal(broadNoResultsResponse.result.structuredContent.search.suggestedNextCalls, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 746 | <code>        const historicalNoResultsResponse = await gateway.callTool({</code> | 声明局部标识符 `historicalNoResultsResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 747 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 748 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 749 | <code>                search_query: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 750 | <code>                    q: 'no results fixture site:base-search.net/Search/Results 2020 DDC'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 751 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 752 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 753 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 754 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 755 | <code>                runId: 'run-zero-historical',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 756 | <code>                sessionId: 'session-zero-historical',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 757 | <code>                iteration: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 758 | <code>                currentUserMessage: 'As of 2022, which country was listed in the public BASE database catalog record?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 759 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 760 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 761 | <code>        assert.equal(historicalNoResultsResponse.ok, true, JSON.stringify(historicalNoResultsResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 762 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 763 | <code>            historicalNoResultsResponse.result.structuredContent.search.queryGuidance.strategy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 764 | <code>            'historical_archive'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 765 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 766 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 767 | <code>            historicalNoResultsResponse.result.structuredContent.search.suggestedNextCalls[0].args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 768 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 769 | <code>                archive: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 770 | <code>                    url: 'https://base-search.net/Search/Results',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 771 | <code>                    mode: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 772 | <code>                    matchType: 'prefix',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 773 | <code>                    query: 'As of 2022, which country was listed in the public BASE database catalog record?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 774 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 775 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 776 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 777 | <code>        assert.match(historicalNoResultsResponse.result.content[0].text, /Next recommended call/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 778 | <code>        assert.match(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 779 | <code>            historicalNoResultsResponse.result.content[0].text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 780 | <code>            /web_run \{"archive":\[\{"url":"https:\/\/base-search\.net\/Search\/Results"/</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 781 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 782 | <code>        const failedSearchResponse = await gateway.callTool({</code> | 声明局部标识符 `failedSearchResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 783 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 784 | <code>            args: { search_query: [{ q: 'bridge validation failure fixture', domains: ['example.test'] }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 785 | <code>            context: { workspace: workspaceRoot, runId: 'run-search-failed', sessionId: 'session-search-failed', iteration: 0 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 786 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 787 | <code>        assert.equal(failedSearchResponse.ok, false, JSON.stringify(failedSearchResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 788 | <code>        assert.match(JSON.stringify(failedSearchResponse), /invalid_mcp_tool_args/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 789 | <code>        assert.match(JSON.stringify(failedSearchResponse), /unexpected property: domains/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 790 | <code>        bridgeRequests.length = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 791 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 792 | <code>        const searchResponse = await gateway.callTool({</code> | 声明局部标识符 `searchResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 793 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 794 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 795 | <code>                search_query: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 796 | <code>                    { q: 'Emily Midkiff Fafnir June 2014' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 797 | <code>                    { q: 'site:journal.finfar.org Midkiff dragons fluffy' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 798 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 799 | <code>                response_length: 'medium'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 800 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 801 | <code>            context: { workspace: workspaceRoot, runId: 'run-1', sessionId: 'session-1', iteration: 0 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 802 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 803 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 804 | <code>        assert.equal(searchResponse.ok, true, JSON.stringify(searchResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 805 | <code>        assert.equal(bridgeRequests.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 806 | <code>        assert.deepEqual(bridgeRequests.map((request) =&gt; request.args.query), [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 807 | <code>            'Emily Midkiff Fafnir June 2014',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 808 | <code>            'site:journal.finfar.org Midkiff dragons fluffy'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 809 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 810 | <code>        const results = searchResponse.result.structuredContent.search.results;</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 811 | <code>        assert.deepEqual(results.map((result) =&gt; result.ref_id), ['turn0search0', 'turn0search1']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 812 | <code>        assert.equal(searchResponse.result.structuredContent.search.suggestedNextCalls[0].tool, 'web_run');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 813 | <code>        assert.deepEqual(searchResponse.result.structuredContent.search.suggestedNextCalls[0].args, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 814 | <code>            open: [{ ref_id: 'turn0search0' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 815 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 816 | <code>        const partialStartedAt = Date.now();</code> | 声明局部标识符 `partialStartedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 817 | <code>        const partialSearchResponse = await gateway.executeWebRunSearch({</code> | 声明局部标识符 `partialSearchResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 818 | <code>            search_query: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 819 | <code>                { q: 'fast partial result fixture' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 820 | <code>                { q: 'hanging search fixture' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 821 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 822 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 823 | <code>            workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 824 | <code>            runId: 'run-partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 825 | <code>            sessionId: 'session-partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 826 | <code>            iteration: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 827 | <code>            webRunSearchTimeoutMs: 40</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 828 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 829 | <code>        assert.ok(Date.now() - partialStartedAt &lt; 1000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 830 | <code>        assert.equal(partialSearchResponse.isError, false, JSON.stringify(partialSearchResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 831 | <code>        assert.equal(partialSearchResponse.structuredContent.search.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 832 | <code>        assert.equal(partialSearchResponse.structuredContent.search.results.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 833 | <code>        assert.equal(partialSearchResponse.structuredContent.search.results[0].title, 'fast partial result fixture');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 834 | <code>        assert.equal(partialSearchResponse.structuredContent.search.failures.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 835 | <code>        assert.equal(partialSearchResponse.structuredContent.search.failures[0].status, 'search_timeout');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 836 | <code>        const githubSearchResponse = await gateway.callTool({</code> | 声明局部标识符 `githubSearchResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 837 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 838 | <code>            args: { search_query: [{ q: 'github file fixture' }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 839 | <code>            context: { workspace: workspaceRoot, runId: 'run-github', sessionId: 'session-github', iteration: 0 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 840 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 841 | <code>        assert.equal(githubSearchResponse.ok, true, JSON.stringify(githubSearchResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 842 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 843 | <code>            githubSearchResponse.result.structuredContent.search.suggestedNextCalls[0].tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 844 | <code>            'github_repo_read'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 845 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 846 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 847 | <code>            githubSearchResponse.result.__ailisSuggestedMcpTools[0].id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 848 | <code>            'mcp__ailis_research__github_repo_read'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 849 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 850 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 851 | <code>        const evaluationSearchResponse = await gateway.callTool({</code> | 声明局部标识符 `evaluationSearchResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 852 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 853 | <code>            args: { search_query: [{ q: 'evaluation leak fixture' }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 854 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 855 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 856 | <code>                runId: 'run-evaluation-leak',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 857 | <code>                sessionId: 'session-evaluation-leak',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 858 | <code>                iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 859 | <code>                evaluationName: 'fixture_eval',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 860 | <code>                currentUserMessage: 'What was the actual enrollment count of the clinical trial on H. pylori in acne vulgaris patients from Jan-May 2018 as listed on the NIH website?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 861 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 862 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 863 | <code>        const evaluationSearch = evaluationSearchResponse.result.structuredContent.search;</code> | 声明局部标识符 `evaluationSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 864 | <code>        assert.equal(evaluationSearch.results.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 865 | <code>        assert.equal(evaluationSearch.results[0].url, 'https://clinicaltrials.gov/study/NCT03411733');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 866 | <code>        assert.equal(evaluationSearch.evaluationLeakAudit.excluded_count, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 867 | <code>        assert.equal(evaluationSearch.suggestedNextCalls[0].tool, 'tool_search');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 868 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 869 | <code>            evaluationSearch.suggestedNextCalls[0].args.query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 870 | <code>            'What was the actual enrollment count of the clinical trial on H. pylori in acne vulgaris patients from Jan-May 2018 as listed on the NIH website?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 871 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 872 | <code>        assert.match(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 873 | <code>            evaluationSearchResponse.result.content[0].text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 874 | <code>            /labeled benchmark answers are not source evidence/i</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 875 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 876 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 877 | <code>        const openResponse = await gateway.callTool({</code> | 声明局部标识符 `openResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 878 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 879 | <code>            args: { open: [{ ref_id: 'turn0search0' }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 880 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 881 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 882 | <code>                runId: 'run-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 883 | <code>                sessionId: 'session-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 884 | <code>                iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 885 | <code>                currentUserMessage: 'Which row has the lowest total count?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 886 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 887 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 888 | <code>        assert.equal(openResponse.ok, true, JSON.stringify(openResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 889 | <code>        assert.equal(bridgeRequests.at(-1).tool, 'render_page');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 890 | <code>        assert.equal(bridgeRequests.at(-1).args.url, results[0].url);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 891 | <code>        assert.equal(bridgeRequests.at(-1).args.query, 'Which row has the lowest total count?');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 892 | <code>        assert.equal(openResponse.result.structuredContent.ref_id, 'turn1view0');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 893 | <code>        assert.equal(openResponse.result.structuredContent.source.ref_id, 'turn1view0');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 894 | <code>        assert.deepEqual(openResponse.result.structuredContent.observedRelevantLinks.map((link) =&gt; link.id), [1]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 895 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 896 | <code>        const pdfLandingResponse = await gateway.callTool({</code> | 声明局部标识符 `pdfLandingResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 897 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 898 | <code>            args: { open: [{ ref_id: 'https://example.test/pdf-view' }] },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 899 | <code>            context: { workspace: workspaceRoot, runId: 'run-pdf-landing', sessionId: 'session-pdf-landing', iteration: 1 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 900 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 901 | <code>        assert.ok(Array.isArray(pdfLandingResponse.result.__ailisSuggestedMcpTools));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 902 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 903 | <code>            pdfLandingResponse.result.__ailisSuggestedMcpTools[0].id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 904 | <code>            'mcp__ailis_research__pdf_extract_text'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 905 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 907 | <code>        const continueResponse = await gateway.callTool({</code> | 声明局部标识符 `continueResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 908 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 909 | <code>            args: { open: [{ ref_id: 'turn0search0', lineno: 2 }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 910 | <code>            context: { workspace: workspaceRoot, runId: 'run-1', sessionId: 'session-1', iteration: 2 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 911 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 912 | <code>        assert.equal(continueResponse.ok, true, JSON.stringify(continueResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 913 | <code>        assert.equal(bridgeRequests.at(-1).tool, 'render_page');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 914 | <code>        assert.equal(bridgeRequests.at(-1).args.url, results[0].url);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 915 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 916 | <code>        const clickResponse = await gateway.callTool({</code> | 声明局部标识符 `clickResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 917 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 918 | <code>            args: { click: [{ ref_id: 'turn1view0', id: 1 }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 919 | <code>            context: { workspace: workspaceRoot, runId: 'run-1', sessionId: 'session-1', iteration: 3 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 920 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 921 | <code>        assert.equal(clickResponse.ok, true, JSON.stringify(clickResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 922 | <code>        assert.equal(bridgeRequests.at(-1).tool, 'pdf_extract_text');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 923 | <code>        assert.equal(bridgeRequests.at(-1).args.url, 'https://example.test/article.pdf');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 924 | <code>        assert.equal(clickResponse.result.structuredContent.ref_id, 'turn3view1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 925 | <code>        assert.match(clickResponse.result.structuredContent.sourceWindow.lines[0].text, /fluffy/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 926 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 927 | <code>        const directPdfResponse = await gateway.callTool({</code> | 声明局部标识符 `directPdfResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 928 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 929 | <code>            args: { open: [{ ref_id: 'https://example.test/direct.pdf' }] },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 930 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 931 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 932 | <code>                runId: 'run-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 933 | <code>                sessionId: 'session-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 934 | <code>                iteration: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 935 | <code>                currentUserMessage: 'What is the volume in m3 of the fish transport bag?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 936 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 937 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 938 | <code>        assert.equal(directPdfResponse.ok, true, JSON.stringify(directPdfResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 939 | <code>        assert.deepEqual(bridgeRequests.slice(-2).map((request) =&gt; request.tool), [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 940 | <code>            'render_page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 941 | <code>            'pdf_extract_text'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 942 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 943 | <code>        assert.equal(bridgeRequests.at(-1).args.url, 'https://example.test/direct.pdf');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 944 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 945 | <code>            bridgeRequests.at(-1).args.query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 946 | <code>            'What is the volume in m3 of the fish transport bag?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 947 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 948 | <code>        assert.match(directPdfResponse.result.structuredContent.sourceWindow.lines[0].text, /fluffy/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 949 | <code>        assert.equal(directPdfResponse.result.structuredContent.extractedText, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 950 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 951 | <code>        const bridgeRequestCountBeforeCachedFind = bridgeRequests.length;</code> | 声明局部标识符 `bridgeRequestCountBeforeCachedFind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 952 | <code>        const cachedPdfFindResponse = await gateway.callTool({</code> | 声明局部标识符 `cachedPdfFindResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 953 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 954 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 955 | <code>                find: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 956 | <code>                    ref_id: directPdfResponse.result.structuredContent.ref_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 957 | <code>                    pattern: '0.1777'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 958 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 959 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 960 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 961 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 962 | <code>                runId: 'run-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 963 | <code>                sessionId: 'session-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 964 | <code>                iteration: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 965 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 966 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 967 | <code>        assert.equal(cachedPdfFindResponse.ok, true, JSON.stringify(cachedPdfFindResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 968 | <code>        assert.equal(bridgeRequests.length, bridgeRequestCountBeforeCachedFind);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 969 | <code>        assert.equal(cachedPdfFindResponse.result.structuredContent.cached, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 970 | <code>        assert.match(cachedPdfFindResponse.result.content[0].text, /0\.1777 m3/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 971 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 972 | <code>        const screenshotResponse = await gateway.callTool({</code> | 声明局部标识符 `screenshotResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 973 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 974 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 975 | <code>                screenshot: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 976 | <code>                    ref_id: 'https://example.test/layout',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 977 | <code>                    detail: 'original'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 978 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 979 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 980 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 981 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 982 | <code>                runId: 'run-screenshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 983 | <code>                sessionId: 'session-screenshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 984 | <code>                iteration: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 985 | <code>                currentUserMessage: 'Which stanza contains indented lines?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 986 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 987 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 988 | <code>        assert.equal(screenshotResponse.ok, true, JSON.stringify(screenshotResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 989 | <code>        assert.equal(bridgeRequests.at(-1).tool, 'webpage_screenshot');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 990 | <code>        assert.equal(bridgeRequests.at(-1).args.url, 'https://example.test/layout');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 991 | <code>        assert.match(bridgeRequests.at(-1).args.path, /\.ailis-web-screenshots[\\/].+\.png$/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 992 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 993 | <code>            screenshotResponse.result.structuredContent.modelImage.image_url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 994 | <code>            bridgeRequests.at(-1).args.path</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 995 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 996 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 997 | <code>        const sectionOpenResponse = await gateway.callTool({</code> | 声明局部标识符 `sectionOpenResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 998 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 999 | <code>            args: { open: [{ ref_id: 'https://example.test/section-view' }] },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1000 | <code>            context: { workspace: workspaceRoot, runId: 'run-section', sessionId: 'session-section', iteration: 0 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1001 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1002 | <code>        assert.equal(sectionOpenResponse.ok, true, JSON.stringify(sectionOpenResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1003 | <code>        assert.equal(sectionOpenResponse.result.structuredContent.observedRelevantLinks[0].kind, 'section');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1004 | <code>        assert.equal(sectionOpenResponse.result.structuredContent.observedRelevantLinks[0].text, 'Studio albums');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1005 | <code>        const sectionClickResponse = await gateway.callTool({</code> | 声明局部标识符 `sectionClickResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1006 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1007 | <code>            args: { click: [{ ref_id: sectionOpenResponse.result.structuredContent.ref_id, id: 1 }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1008 | <code>            context: { workspace: workspaceRoot, runId: 'run-section', sessionId: 'session-section', iteration: 1 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1009 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1010 | <code>        assert.equal(sectionClickResponse.ok, true, JSON.stringify(sectionClickResponse));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1011 | <code>        assert.equal(bridgeRequests.at(-1).tool, 'web_find');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1012 | <code>        assert.equal(bridgeRequests.at(-1).args.pattern, 'Studio albums');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1013 | <code>        assert.match(sectionClickResponse.result.content[0].text, /Find results for pattern: Studio albums/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1014 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1015 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1016 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1017 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1018 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1019 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1020 | <code>async function jsonFetch(url, options = {}) {</code> | 定义函数 `jsonFetch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1021 | <code>    const response = await fetch(url, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1022 | <code>        ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1023 | <code>        headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1024 | <code>            'content-type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1025 | <code>            ...(options.headers &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1026 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1027 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1028 | <code>    const body = await response.json();</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1029 | <code>    return { response, body };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1030 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1031 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1032 | <code>async function withHttpServer(handler) {</code> | 定义函数 `withHttpServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1033 | <code>    const server = http.createServer(handler);</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1034 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1035 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1036 | <code>    const baseUrl = `http://127.0.0.1:${address.port}`;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1037 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1038 | <code>        baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1039 | <code>        close: () =&gt; new Promise((resolve, reject) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1040 | <code>            server.close((error) =&gt; error ? reject(error) : resolve());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1041 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1042 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1043 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1044 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1045 | <code>function buildSimplePdfWithText(text) {</code> | 定义函数 `buildSimplePdfWithText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1046 | <code>    const escaped = String(text).replace(/[()\\]/g, '\\$&amp;');</code> | 声明局部标识符 `escaped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1047 | <code>    const stream = `BT /F1 12 Tf 72 720 Td (${escaped}) Tj ET`;</code> | 声明局部标识符 `stream`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1048 | <code>    const objects = [</code> | 声明局部标识符 `objects`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1049 | <code>        '1 0 obj\n&lt;&lt; /Type /Catalog /Pages 2 0 R &gt;&gt;\nendobj\n',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1050 | <code>        '2 0 obj\n&lt;&lt; /Type /Pages /Kids [3 0 R] /Count 1 &gt;&gt;\nendobj\n',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1051 | <code>        '3 0 obj\n&lt;&lt; /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources &lt;&lt; /Font &lt;&lt; /F1 4 0 R &gt;&gt; &gt;&gt; /Contents 5 0 R &gt;&gt;\nendobj\n',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1052 | <code>        '4 0 obj\n&lt;&lt; /Type /Font /Subtype /Type1 /BaseFont /Helvetica &gt;&gt;\nendobj\n',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1053 | <code>        `5 0 obj\n&lt;&lt; /Length ${Buffer.byteLength(stream, 'latin1')} &gt;&gt;\nstream\n${stream}\nendstream\nendobj\n`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1054 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1055 | <code>    let body = '%PDF-1.4\n';</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1056 | <code>    const offsets = [0];</code> | 声明局部标识符 `offsets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1057 | <code>    for (const object of objects) {</code> | 声明局部标识符 `object`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1058 | <code>        offsets.push(Buffer.byteLength(body, 'latin1'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1059 | <code>        body += object;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1060 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1061 | <code>    const xrefOffset = Buffer.byteLength(body, 'latin1');</code> | 声明局部标识符 `xrefOffset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1062 | <code>    body += `xref\n0 ${objects.length + 1}\n`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1063 | <code>    body += '0000000000 65535 f \n';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1064 | <code>    for (let index = 1; index &lt; offsets.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1065 | <code>        body += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1066 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1067 | <code>    body += `trailer\n&lt;&lt; /Size ${objects.length + 1} /Root 1 0 R &gt;&gt;\nstartxref\n${xrefOffset}\n%%EOF\n`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1068 | <code>    return Buffer.from(body, 'latin1');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1069 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1070 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1071 | <code>function buildBlankPdfWithoutSelectableText() {</code> | 定义函数 `buildBlankPdfWithoutSelectableText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1072 | <code>    const objects = [</code> | 声明局部标识符 `objects`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1073 | <code>        '1 0 obj\n&lt;&lt; /Type /Catalog /Pages 2 0 R &gt;&gt;\nendobj\n',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1074 | <code>        '2 0 obj\n&lt;&lt; /Type /Pages /Kids [3 0 R] /Count 1 &gt;&gt;\nendobj\n',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1075 | <code>        '3 0 obj\n&lt;&lt; /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] &gt;&gt;\nendobj\n'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1076 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1077 | <code>    let body = '%PDF-1.4\n';</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1078 | <code>    const offsets = [0];</code> | 声明局部标识符 `offsets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1079 | <code>    for (const object of objects) {</code> | 声明局部标识符 `object`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1080 | <code>        offsets.push(Buffer.byteLength(body, 'latin1'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1081 | <code>        body += object;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1082 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1083 | <code>    const xrefOffset = Buffer.byteLength(body, 'latin1');</code> | 声明局部标识符 `xrefOffset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1084 | <code>    body += `xref\n0 ${objects.length + 1}\n`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1085 | <code>    body += '0000000000 65535 f \n';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1086 | <code>    for (let index = 1; index &lt; offsets.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1087 | <code>        body += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1088 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1089 | <code>    body += `trailer\n&lt;&lt; /Size ${objects.length + 1} /Root 1 0 R &gt;&gt;\nstartxref\n${xrefOffset}\n%%EOF\n`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1090 | <code>    return Buffer.from(body, 'latin1');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1091 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1092 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1093 | <code>test('EMBER-Harness records stage checks around tool execution', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1094 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-ember-harness-observe-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1095 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1096 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1097 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1098 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1099 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1100 | <code>        emberHarnessEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1101 | <code>        emberHarnessMode: 'observe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1102 | <code>        emberHarnessEvaluator: async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1103 | <code>            decision: 'allow',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1104 | <code>            riskLevel: 'none'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1105 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1106 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1107 | <code>    await fs.writeFile(path.join(workspaceRoot, 'note.txt'), 'safe observation\n', 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1109 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1110 | <code>        const response = await gateway.callTool({</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1111 | <code>            tool: 'read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1112 | <code>            args: { path: 'note.txt' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1113 | <code>            context: { workspace: workspaceRoot, runId: 'ember-run-observe', sessionId: 'main' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1114 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1116 | <code>        assert.equal(response.ok, true, response.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1117 | <code>        const records = gateway.emberHarness.listRunRecords('ember-run-observe');</code> | 声明局部标识符 `records`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1118 | <code>        assert.deepEqual(records.map((record) =&gt; record.stage), ['tool_call', 'tool_result']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1119 | <code>        assert.equal(records.every((record) =&gt; record.snapshot?.textHash), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1120 | <code>        assert.equal(records.every((record) =&gt; record.blocked === false), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1122 | <code>        const events = gateway.getEventsAfter(0, 20).filter((event) =&gt; event.type === 'ember.harness.check');</code> | 声明局部标识符 `events`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1123 | <code>        assert.equal(events.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1124 | <code>        assert.deepEqual(events.map((event) =&gt; event.payload.boundary), [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1125 | <code>            'tool_call_before_execution',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1126 | <code>            'tool_result_enter_context'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1127 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1129 | <code>        const transcript = await gateway.runtime.readTranscript('ember-run-observe', 50);</code> | 声明局部标识符 `transcript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1130 | <code>        assert.equal(transcript.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1131 | <code>        assert.equal(transcript.items.filter((item) =&gt; item.type === 'ember.harness.check').length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1132 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1133 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1134 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1135 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1136 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1138 | <code>test('EMBER-Harness can block a tool result before it enters model context', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1139 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-ember-harness-block-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1140 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1141 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1142 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1143 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1144 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1145 | <code>        emberHarnessEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1146 | <code>        emberHarnessMode: 'enforce',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1147 | <code>        emberHarnessEvaluator: async ({ stage }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1148 | <code>            if (stage === 'tool_result') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1149 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1150 | <code>                    decision: 'block',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1151 | <code>                    riskLevel: 'high',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1152 | <code>                    riskTypes: ['bias_payload'],</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1153 | <code>                    summary: 'simulated high-risk payload'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1154 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1155 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1156 | <code>            return { decision: 'allow', riskLevel: 'none' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1157 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1158 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1159 | <code>    await fs.writeFile(path.join(workspaceRoot, 'note.txt'), 'blocked payload should not be echoed\n', 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1161 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1162 | <code>        const response = await gateway.callTool({</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1163 | <code>            tool: 'read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1164 | <code>            args: { path: 'note.txt' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1165 | <code>            context: { workspace: workspaceRoot, runId: 'ember-run-block', sessionId: 'main' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1166 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1168 | <code>        assert.equal(response.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1169 | <code>        assert.equal(response.status, 'blocked');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1170 | <code>        assert.equal(response.details.emberHarness.stage, 'tool_result');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1171 | <code>        assert.equal(response.details.emberHarness.decision, 'block');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1172 | <code>        assert.equal(response.details.emberHarness.snapshot.preview, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1173 | <code>        assert.doesNotMatch(JSON.stringify(response), /blocked payload should not be echoed/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1175 | <code>        const records = gateway.emberHarness.listRunRecords('ember-run-block');</code> | 声明局部标识符 `records`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1176 | <code>        assert.equal(records.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1177 | <code>        assert.equal(records[0].stage, 'tool_call');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1178 | <code>        assert.equal(records[1].stage, 'tool_result');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1179 | <code>        assert.equal(records[1].blocked, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1180 | <code>        assert.equal(records[1].rollbackTo.snapshotId, records[0].snapshot.snapshotId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1181 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1182 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1183 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1184 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1185 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1187 | <code>test('AILIS Gateway TaskAgent thread reuses parent LLM settings', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1188 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-llm-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1189 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1190 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1191 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1192 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1193 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1194 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1195 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1196 | <code>    gateway.ensureAgentRunner = () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1197 | <code>        runMessage: async (request) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1198 | <code>            calls.push(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1199 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1200 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1201 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1202 | <code>                runId: 'child-run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1203 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1204 | <code>                intent: 'direct_tool_final',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1205 | <code>                displayText: 'child done',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1206 | <code>                durationMs: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1207 | <code>                steps: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1208 | <code>                plan: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1209 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1210 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1211 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1212 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1213 | <code>        provider: 'deepseek',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1214 | <code>        baseUrl: 'https://api.deepseek.com',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1215 | <code>        model: 'deepseek-chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1216 | <code>        apiKey: 'test-key'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1217 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1219 | <code>    const result = await gateway.executeTaskAgent({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1220 | <code>        agent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1221 | <code>            id: 'agent-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1222 | <code>            runId: 'parent-run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1223 | <code>            sessionId: 'parent-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1224 | <code>            childRunId: 'child-run-request',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1225 | <code>            childSessionId: 'child-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1226 | <code>            label: 'TaskAgent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1227 | <code>            task: 'solve task'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1228 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1229 | <code>        args: { maxAgentSteps: 7 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1230 | <code>        context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1231 | <code>            workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1232 | <code>            sessionId: 'parent-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1233 | <code>            sessionKey: 'parent-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1234 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1235 | <code>            approved: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1236 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1237 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1239 | <code>    assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1240 | <code>    assert.equal(calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1241 | <code>    assert.equal(calls[0].runId, 'child-run-request');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1242 | <code>    assert.equal(calls[0].agentRole, 'task_agent');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1243 | <code>    assert.deepEqual(calls[0].messageHistory, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1244 | <code>    assert.equal(calls[0].context.cleanContext, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1245 | <code>    assert.equal(calls[0].context.contextMode, 'task_agent');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1246 | <code>    assert.equal(calls[0].maxAgentSteps, 7);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1247 | <code>    assert.equal(calls[0].context.maxAgentSteps, 7);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1248 | <code>    assert.deepEqual(calls[0].llmSettings, llmSettings);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1249 | <code>    assert.deepEqual(calls[0].context.llmSettings, llmSettings);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1250 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1252 | <code>test('AILIS Gateway exposes health, tools, guarded tool calls, and audit', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1253 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-gateway-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1254 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1255 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1256 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1257 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1258 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1259 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1261 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1262 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1263 | <code>        assert.equal(status.running, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1264 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1266 | <code>        const health = await jsonFetch(`${baseUrl}/health`);</code> | 声明局部标识符 `health`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1267 | <code>        assert.equal(health.response.status, 200);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1268 | <code>        assert.equal(health.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1269 | <code>        assert.equal(health.body.status.running, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1271 | <code>        const tools = await jsonFetch(`${baseUrl}/tools`);</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1272 | <code>        assert.equal(tools.body.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1273 | <code>        assert.ok(tools.body.coreTools.some((tool) =&gt; tool.id === 'read'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1274 | <code>        assert.ok(tools.body.coreTools.some((tool) =&gt; tool.id === 'exec' &amp;&amp; tool.needsApproval));</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1275 | <code>        assert.ok(tools.body.runtimeTools.some((tool) =&gt; tool.id === 'tool_search' &amp;&amp; tool.spec));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1276 | <code>        assert.ok(tools.body.runtimeTools.some((tool) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1277 | <code>            tool.id === 'spawn_agent' &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1278 | <code>            tool.spec?.parameters?.required?.includes('task_name') &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1279 | <code>            tool.spec?.parameters?.additionalProperties === false</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1280 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1281 | <code>        assert.ok(tools.body.localTools.some((tool) =&gt; tool.id === 'computer' &amp;&amp; tool.spec));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1282 | <code>        assert.equal(tools.body.localTools.some((tool) =&gt; tool.id === 'read'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1283 | <code>        assert.equal(tools.body.gateway.toolRuntime.model, 'ailis_gateway_tool_registry.v1');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1285 | <code>        const searchTools = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `searchTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1286 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1287 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1288 | <code>                tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1289 | <code>                args: { query: 'subagent task', limit: 5 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1290 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1291 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1292 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1293 | <code>        assert.equal(searchTools.body.ok, true, searchTools.body.error);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1294 | <code>        assert.ok(searchTools.body.result.details.tools.length &gt; 0);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1295 | <code>        assert.doesNotMatch(JSON.stringify(searchTools.body.result), /"id":"subagents"/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1296 | <code>        assert.equal(Object.hasOwn(searchTools.body.result.details, 'discovery'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1297 | <code>        assert.equal(Object.hasOwn(searchTools.body.result.details, 'searched_web'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1298 | <code>        assert.equal(Object.hasOwn(searchTools.body.result.details, 'note'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1300 | <code>        const write = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `write`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1301 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1302 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1303 | <code>                tool: 'write',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1304 | <code>                args: { path: 'note.txt', content: 'hello gateway\n' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1305 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1306 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1307 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1308 | <code>        assert.equal(write.body.ok, true, write.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1309 | <code>        assert.equal(write.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1311 | <code>        const read = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `read`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1312 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1313 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1314 | <code>                tool: 'read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1315 | <code>                args: { path: 'note.txt' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1316 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1317 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1318 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1319 | <code>        assert.equal(read.body.ok, true, read.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1320 | <code>        assert.match(JSON.stringify(read.body.result), /hello gateway/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1322 | <code>        const blocked = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `blocked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1323 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1324 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1325 | <code>                tool: 'read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1326 | <code>                args: { path: '../outside.txt' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1327 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1328 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1329 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1330 | <code>        assert.equal(blocked.body.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1331 | <code>        assert.equal(blocked.body.status, 'blocked');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1333 | <code>        const approval = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1334 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1335 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1336 | <code>                tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1337 | <code>                args: { command: 'node -e "console.log(1)"' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1338 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1339 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1340 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1341 | <code>        assert.equal(approval.body.ok, false);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1342 | <code>        assert.equal(approval.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1344 | <code>        const exec = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `exec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1345 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1346 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1347 | <code>                tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1348 | <code>                args: { command: 'node -e "console.log(\'GATEWAY_EXEC_OK\')"', timeout: 8 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1349 | <code>                context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1350 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1351 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1352 | <code>        assert.equal(exec.body.ok, true, exec.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1353 | <code>        assert.match(JSON.stringify(exec.body.result), /GATEWAY_EXEC_OK/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1355 | <code>        const execWithArgs = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `execWithArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1356 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1357 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1358 | <code>                tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1359 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1360 | <code>                    command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1361 | <code>                    args: ['-e', "console.log('GATEWAY_EXEC_ARGS_OK')"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1362 | <code>                    timeout: 8</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1363 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1364 | <code>                context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1365 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1366 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1367 | <code>        assert.equal(execWithArgs.body.ok, true, execWithArgs.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1368 | <code>        assert.match(execWithArgs.body.result.details.stdout, /GATEWAY_EXEC_ARGS_OK/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1370 | <code>        if (process.platform === 'win32') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1371 | <code>            const recoveredPowerShellWrapper = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `recoveredPowerShellWrapper`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1372 | <code>                method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1373 | <code>                body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1374 | <code>                    tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1375 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1376 | <code>                        command: "Write-Output 'GATEWAY_EXEC_WRAPPER_RECOVERED'",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1377 | <code>                        args: ['powershell', '-NoProfile', '-Command'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1378 | <code>                        timeout: 8</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1379 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1380 | <code>                    context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1381 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1382 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1383 | <code>            assert.equal(recoveredPowerShellWrapper.body.ok, true, recoveredPowerShellWrapper.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1384 | <code>            assert.match(recoveredPowerShellWrapper.body.result.details.stdout, /GATEWAY_EXEC_WRAPPER_RECOVERED/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1385 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1387 | <code>        const longExec = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `longExec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1388 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1389 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1390 | <code>                tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1391 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1392 | <code>                    command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1393 | <code>                    args: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1394 | <code>                        '-e',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1395 | <code>                        [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1396 | <code>                            "console.log('STORE_START')",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1397 | <code>                            "for (let i = 0; i &lt; 220; i += 1) console.log('STORE_LINE_' + i + ':' + 'x'.repeat(48))",</code> | 声明局部标识符 `i`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1398 | <code>                            "console.log('STORE_NEEDLE_FINAL')"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1399 | <code>                        ].join(';')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1400 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1401 | <code>                    timeout: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1402 | <code>                    maxOutputBytes: 1200</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1403 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1404 | <code>                context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1405 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1406 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1407 | <code>        assert.equal(longExec.body.ok, true, longExec.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1408 | <code>        const outputStore = longExec.body.result.details.outputStore;</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1409 | <code>        assert.ok(outputStore?.outputId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1410 | <code>        assert.equal(outputStore.previewTruncated, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1411 | <code>        assert.ok(outputStore.bytes &gt; 1200);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1412 | <code>        const logStat = await fs.stat(outputStore.path);</code> | 声明局部标识符 `logStat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1413 | <code>        assert.equal(logStat.size, outputStore.bytes);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1414 | <code>        assert.match(longExec.body.result.content[0].text, /fullOutput=stored_for_agent_lab/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1415 | <code>        assert.match(longExec.body.result.content[0].text, /tool_search query "exec output outputId search tail read"/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1416 | <code>        assert.match(longExec.body.result.content[0].text, /output_search\/output_tail\/output_read/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1418 | <code>        const outputSearch = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `outputSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1419 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1420 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1421 | <code>                tool: 'output_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1422 | <code>                args: { outputId: outputStore.outputId, query: 'STORE_NEEDLE_FINAL', contextLines: 0 },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1423 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1424 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1425 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1426 | <code>        assert.equal(outputSearch.body.ok, true, outputSearch.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1427 | <code>        assert.equal(outputSearch.body.result.details.matchCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1429 | <code>        const outputTail = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `outputTail`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1430 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1431 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1432 | <code>                tool: 'output_tail',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1433 | <code>                args: { outputId: outputStore.outputId, lines: 3 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1434 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1435 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1436 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1437 | <code>        assert.equal(outputTail.body.ok, true, outputTail.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1438 | <code>        assert.match(outputTail.body.result.content[0].text, /STORE_NEEDLE_FINAL/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1439 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1440 | <code>        const outputRead = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `outputRead`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1441 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1442 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1443 | <code>                tool: 'output_read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1444 | <code>                args: { outputId: outputStore.outputId, offset: 0, limit: 128 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1445 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1446 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1447 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1448 | <code>        assert.equal(outputRead.body.ok, true, outputRead.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1449 | <code>        assert.match(outputRead.body.result.content[0].text, /STORE_START/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1450 | <code>        assert.equal(outputRead.body.result.details.hasMore, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1451 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1452 | <code>        const wrongOutputReadSurface = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `wrongOutputReadSurface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1453 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1454 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1455 | <code>                tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1456 | <code>                args: { action: 'read', outputId: outputStore.outputId },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1457 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1458 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1459 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1460 | <code>        assert.equal(wrongOutputReadSurface.body.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1461 | <code>        assert.equal(wrongOutputReadSurface.body.status, 'wrong_tool_surface');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1462 | <code>        assert.equal(wrongOutputReadSurface.body.result.details.defaultSurface, 'deferred_output_store_tools');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1463 | <code>        assert.match(wrongOutputReadSurface.body.result.details.recovery, /tool_search/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1465 | <code>        const audit = await jsonFetch(`${baseUrl}/audit?limit=10`);</code> | 声明局部标识符 `audit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1466 | <code>        assert.equal(audit.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1467 | <code>        assert.ok(audit.body.entries.length &gt;= 4);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1468 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1469 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1470 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1471 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1472 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1473 | <code>test('AILIS Gateway default context can enable full computer control', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1474 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-full-control-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1475 | <code>    const outsideRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-full-control-outside-'));</code> | 声明局部标识符 `outsideRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1476 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1477 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1478 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1479 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1480 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1481 | <code>        defaultContext: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1482 | <code>            computerControlEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1483 | <code>            permissionProfile: 'danger-full-access',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1484 | <code>            approvalPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1485 | <code>            confirmationPolicy: 'auto',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1486 | <code>            approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1487 | <code>            autoConfirm: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1488 | <code>            allowComputerWideAccess: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1489 | <code>            allowSystemMutation: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1490 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1491 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1493 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1494 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1495 | <code>        assert.equal(status.defaultContext.computerControlEnabled, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1496 | <code>        assert.equal(status.defaultContext.permissionProfile, 'danger-full-access');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1497 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1498 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1499 | <code>        const write = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `write`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1500 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1501 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1502 | <code>                tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1503 | <code>                args: { action: 'write', path: 'full-control.txt', content: 'enabled\n' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1504 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1505 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1506 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1507 | <code>        assert.equal(write.body.ok, true, write.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1508 | <code>        assert.equal(write.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1509 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1510 | <code>        const exec = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `exec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1511 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1512 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1513 | <code>                tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1514 | <code>                args: { command: 'node -e "console.log(\'FULL_CONTROL_EXEC_OK\')"', timeout: 8 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1515 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1516 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1517 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1518 | <code>        assert.equal(exec.body.ok, true, exec.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1519 | <code>        assert.match(JSON.stringify(exec.body.result), /FULL_CONTROL_EXEC_OK/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1521 | <code>        const outsideExec = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `outsideExec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1522 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1523 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1524 | <code>                tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1525 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1526 | <code>                    command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1527 | <code>                    args: ['-e', "console.log('OUTSIDE_WORKDIR:' + process.cwd())"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1528 | <code>                    workdir: outsideRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1529 | <code>                    timeout: 8</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1530 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1531 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1532 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1533 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1534 | <code>        assert.equal(outsideExec.body.ok, true, outsideExec.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1535 | <code>        assert.match(outsideExec.body.result.details.stdout, /OUTSIDE_WORKDIR:/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1536 | <code>        assert.equal(path.resolve(outsideExec.body.result.details.workdir), path.resolve(outsideRoot));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1537 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1538 | <code>        if (process.platform === 'win32') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1539 | <code>            const protectedWorkdir = path.join(process.env.WINDIR &#124;&#124; 'C:\\Windows', 'System32');</code> | 声明局部标识符 `protectedWorkdir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1540 | <code>            const protectedExec = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `protectedExec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1541 | <code>                method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1542 | <code>                body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1543 | <code>                    tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1544 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1545 | <code>                        command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1546 | <code>                        args: ['-e', "console.log('SHOULD_NOT_RUN')"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1547 | <code>                        workdir: protectedWorkdir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1548 | <code>                        timeout: 8</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1549 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1550 | <code>                    context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1551 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1552 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1553 | <code>            assert.equal(protectedExec.body.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1554 | <code>            assert.equal(protectedExec.body.status, 'blocked');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1555 | <code>            assert.match(protectedExec.body.error, /protected C drive system files/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1556 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1557 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1558 | <code>        const readBack = await fs.readFile(path.join(workspaceRoot, 'full-control.txt'), 'utf8');</code> | 声明局部标识符 `readBack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1559 | <code>        assert.match(readBack, /enabled/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1560 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1561 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1562 | <code>        await fs.rm(outsideRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1563 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1564 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1565 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1566 | <code>test('AILIS Gateway tool_search surfaces and executes external virtual direct tools', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1567 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-external-direct-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1568 | <code>    const api = await withHttpServer((req, res) =&gt; {</code> | 声明局部标识符 `api`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1569 | <code>        const url = new URL(req.url, 'http://127.0.0.1');</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1570 | <code>        res.setHeader('content-type', 'application/json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1571 | <code>        res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1572 | <code>            pathname: url.pathname,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1573 | <code>            actualEnrollment: 90</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1574 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1575 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1576 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1577 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1578 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1579 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1580 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1581 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1582 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1583 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1584 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1585 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1586 | <code>        await gateway.runtime.capabilityManager.bulkExposeExternalTools({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1587 | <code>            includeMcpRegistry: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1588 | <code>            includeInstalledMcp: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1589 | <code>            trustCallable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1590 | <code>            enableOpenApiAdapter: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1591 | <code>            sourceName: 'clinicaltrials',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1592 | <code>            openapiOperations: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1593 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1594 | <code>                    operationId: 'clinicalTrialsGetStudy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1595 | <code>                    method: 'get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1596 | <code>                    path: '/api/v2/studies/{nctId}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1597 | <code>                    baseUrl: api.baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1598 | <code>                    summary: 'Get ClinicalTrials.gov enrollment by NCT id.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1599 | <code>                    parameters: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1600 | <code>                        { name: 'nctId', in: 'path', required: true, schema: { type: 'string' }, description: 'NCT id.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1601 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1602 | <code>                    whenToUse: ['Use for structured ClinicalTrials.gov enrollment lookup.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1603 | <code>                    whenNotToUse: ['Do not use for broad web search.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1604 | <code>                    preconditions: ['NCT id is known.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1605 | <code>                    examples: [{ nctId: 'NCT03411733' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1606 | <code>                    badExamples: [{}],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1607 | <code>                    alternatives: ['Use web_fetch if API is unavailable.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1608 | <code>                    errors: { not_found: { recoverable: false } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1609 | <code>                    permissions: ['clinicaltrials.read']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1610 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1611 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1612 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1613 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1614 | <code>        const search = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `search`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1615 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1616 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1617 | <code>                tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1618 | <code>                args: { query: 'ClinicalTrials enrollment NCT API', limit: 5 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1619 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1620 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1621 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1622 | <code>        assert.equal(search.body.ok, true, search.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1623 | <code>        assert.match(JSON.stringify(search.body.result), /external__clinicaltrials__get_study/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1624 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1625 | <code>        const direct = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `direct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1626 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1627 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1628 | <code>                tool: 'external__clinicaltrials__get_study',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1629 | <code>                args: { nctId: 'NCT03411733' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1630 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1631 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1632 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1633 | <code>        assert.equal(direct.body.ok, true, direct.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1634 | <code>        assert.equal(direct.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1635 | <code>        assert.match(JSON.stringify(direct.body.result), /actualEnrollment/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1636 | <code>        assert.match(JSON.stringify(direct.body.result), /90/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1637 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1638 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1639 | <code>        await api.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1640 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1641 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1642 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1643 | <code>test('AILIS Gateway tool_search ranks strict MCP readers before broad web_search', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1644 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-tool-routing-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1645 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1646 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1647 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1648 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1649 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1650 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1651 | <code>    const mcpTool = (name, description = '') =&gt; ({</code> | 声明局部标识符 `mcpTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1652 | <code>        id: `mcp__ailis_research__${name}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1653 | <code>        type: 'mcp_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1654 | <code>        server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1655 | <code>        tool: name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1656 | <code>        name: `mcp__ailis_research__${name}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1657 | <code>        description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1658 | <code>        inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1659 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1660 | <code>            required: ['path'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1661 | <code>            additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1662 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1663 | <code>                path: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1664 | <code>                query: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1665 | <code>                title: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1666 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1667 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1668 | <code>        schemaProperties: ['path', 'query', 'title'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1669 | <code>        callPattern: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1670 | <code>            args: { path: '&lt;path&gt;' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1671 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1672 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1674 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1675 | <code>        let latestMcpRetrievalLimit = 0;</code> | 声明局部标识符 `latestMcpRetrievalLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1676 | <code>        gateway.runtime.mcpManager.searchToolSpecs = async ({ limit = 0 } = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1677 | <code>            latestMcpRetrievalLimit = limit;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1678 | <code>            return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1679 | <code>                mcpTool('web_search', 'Fallback broad public web search.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1680 | <code>                mcpTool('read_presentation', 'Read PowerPoint PPTX slides.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1681 | <code>                mcpTool('read_document', 'Read Word DOCX documents with paragraphs and tables.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1682 | <code>                mcpTool('read_spreadsheet', 'Read XLSX spreadsheets values.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1683 | <code>                mcpTool('youtube_transcript', 'Read YouTube video transcripts.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1684 | <code>                mcpTool('web_archive_lookup', 'Recover historical database, catalog, academic-index, and search-engine result records when a live site, API, or OAI endpoint is unavailable. Use for archived records filtered by classification codes such as DDC, year, language, document type, country, or flags.')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1685 | <code>            ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1686 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1687 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1688 | <code>        const result = await gateway.executeGatewayToolSearch({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1689 | <code>            query: 'attached pptx PowerPoint slides evidence web search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1690 | <code>            includeExternal: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1691 | <code>            limit: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1692 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1694 | <code>        assert.equal(result.details.tools.length, 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1695 | <code>        assert.equal(Object.hasOwn(result.details, 'discovery'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1696 | <code>        assert.equal(Object.hasOwn(result.details, 'searched_content'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1697 | <code>        assert.equal(result.details.tools[0].id, 'mcp__ailis_research__read_presentation');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1698 | <code>        assert.equal(result.details.tools[0].callable, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1699 | <code>        assert.equal(result.details.tools[0].availability, 'available');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1700 | <code>        assert.equal(result.details.recommended_tool.id, result.details.tools[0].id);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1701 | <code>        assert.equal(result.details.recommended_tool.callable, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1702 | <code>        assert.doesNotMatch(result.details.routing_advice, /artifact_tools/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1703 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1704 | <code>        const docxResult = await gateway.executeGatewayToolSearch({</code> | 声明局部标识符 `docxResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1705 | <code>            query: 'DOCX word document extract text content',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1706 | <code>            includeExternal: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1707 | <code>            limit: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1708 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1709 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1710 | <code>        assert.equal(docxResult.details.tools.length, 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1711 | <code>        assert.equal(docxResult.details.tools[0].id, 'mcp__ailis_research__read_document');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1712 | <code>        assert.equal(docxResult.details.recommended_tool.id, docxResult.details.tools[0].id);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1713 | <code>        assert.notEqual(docxResult.details.tools[0].id, 'artifact_verifier');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1714 | <code>        assert.doesNotMatch(docxResult.details.routing_advice, /artifact_tools/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1715 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1716 | <code>        const xlsxResult = await gateway.executeGatewayToolSearch({</code> | 声明局部标识符 `xlsxResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1717 | <code>            query: 'attached xlsx spreadsheet cell colors fill formulas merged map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1718 | <code>            includeExternal: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1719 | <code>            limit: 3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1720 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1722 | <code>        assert.equal(xlsxResult.details.tools[0].id, 'mcp__ailis_research__read_spreadsheet');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1723 | <code>        assert.equal(xlsxResult.details.tools.some((tool) =&gt; tool.id === 'read_xlsx_workbook'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1724 | <code>        assert.doesNotMatch(xlsxResult.details.routing_advice, /artifact_tools/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1725 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1726 | <code>        const archiveResult = await gateway.executeGatewayToolSearch({</code> | 声明局部标识符 `archiveResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1727 | <code>            query: 'Academic Search Engine API OAI search records DDC 633 year 2020 language unknown country flag',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1728 | <code>            includeExternal: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1729 | <code>            limit: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1730 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1731 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1732 | <code>        assert.equal(archiveResult.details.tools[0].id, 'mcp__ailis_research__web_archive_lookup');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1733 | <code>        assert.ok(latestMcpRetrievalLimit &gt; 5);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1735 | <code>        const artifactQueryResult = await gateway.executeGatewayToolSearch({</code> | 声明局部标识符 `artifactQueryResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1736 | <code>            query: 'artifact_query artifactId fullJsonPath payload range grid search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1737 | <code>            includeExternal: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1738 | <code>            includeMcp: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1739 | <code>            limit: 3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1740 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1741 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1742 | <code>        assert.equal(artifactQueryResult.details.tools.some((tool) =&gt; tool.id === 'artifact_query'), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1743 | <code>        assert.equal(artifactQueryResult.details.tools.find((tool) =&gt; tool.id === 'artifact_query').spec, undefined);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1744 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1745 | <code>        const artifactImportResult = await gateway.executeGatewayToolSearch({</code> | 声明局部标识符 `artifactImportResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1746 | <code>            query: 'artifact_import ragflow lite table parser import local file chunks',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1747 | <code>            includeExternal: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1748 | <code>            includeMcp: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1749 | <code>            limit: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1750 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1751 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1752 | <code>        assert.equal(artifactImportResult.details.tools.some((tool) =&gt; tool.id === 'artifact_import'), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1753 | <code>        assert.equal(artifactImportResult.details.tools.find((tool) =&gt; tool.id === 'artifact_import').spec, undefined);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1754 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1755 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1756 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1757 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1758 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1759 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1760 | <code>test('AILIS Gateway registers built-in AILIS research MCP for web search and direct fetch', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1761 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-builtin-research-mcp-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1762 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1763 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1764 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1765 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1766 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1767 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1768 | <code>    const page = await withHttpServer((_request, response) =&gt; {</code> | 声明局部标识符 `page`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1769 | <code>        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1770 | <code>        response.end('&lt;html&gt;&lt;body&gt;&lt;h1&gt;AILIS direct fetch smoke page&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1771 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1772 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1773 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1774 | <code>        const servers = gateway.runtime.mcpManager.listServers();</code> | 声明局部标识符 `servers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1775 | <code>        assert.ok(servers.some((server) =&gt; server.name === 'ailis_research'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1776 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1777 | <code>        const search = await gateway.executeGatewayToolSearch({</code> | 声明局部标识符 `search`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1778 | <code>            query: 'web search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1779 | <code>            includeExternal: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1780 | <code>            limit: 10,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1781 | <code>            timeoutMs: 30000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1782 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1783 | <code>        assert.ok(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1784 | <code>            search.details.tools.some((tool) =&gt; tool.id === 'mcp__ailis_research__web_search'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1785 | <code>            JSON.stringify(search.details)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1786 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1787 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1788 | <code>        const fetched = await gateway.runtime.executeTool(</code> | 声明局部标识符 `fetched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1789 | <code>            'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1790 | <code>            { url: page.baseUrl, maxLines: 80 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1791 | <code>            { runId: 'builtin-research-mcp-run', workspace: workspaceRoot, timeoutMs: 30000 }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1792 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1793 | <code>        assert.equal(fetched.details.status, 'completed', JSON.stringify(fetched));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1794 | <code>        assert.match(fetched.content[0].text, /AILIS direct fetch smoke page/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1795 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1796 | <code>        await page.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1797 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1798 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1799 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1800 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1801 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1802 | <code>test('AILIS Gateway exposes context artifact query and guards raw payload reads', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1803 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-context-artifact-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1804 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1805 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1806 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1807 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1808 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1809 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1810 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1811 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1812 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1813 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1814 | <code>        const artifactRecord = await gateway.runtime.contextArtifactStore.createArtifact({</code> | 声明局部标识符 `artifactRecord`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1815 | <code>            kind: 'spreadsheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1816 | <code>            type: 'test_spreadsheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1817 | <code>            tool: 'test_fixture',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1818 | <code>            runId: 'artifact-run-1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1819 | <code>            sessionId: 'artifact-session-1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1820 | <code>            sourcePath: path.join(workspaceRoot, 'map-fixture.xlsx'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1821 | <code>            summary: 'Test spreadsheet map fixture',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1822 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1823 | <code>                workbook: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1824 | <code>                    sheets: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1825 | <code>                        name: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1826 | <code>                        dimensions: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1827 | <code>                            inspectedRange: 'A1:C2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1828 | <code>                            rowCount: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1829 | <code>                            columnCount: 3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1830 | <code>                        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1831 | <code>                        grids: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1832 | <code>                            display: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1833 | <code>                                ['START', '', ''],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1834 | <code>                                ['', '', 'END']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1835 | <code>                            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1836 | <code>                            fills: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1837 | <code>                                ['', '0099FF', ''],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1838 | <code>                                ['', '', '']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1839 | <code>                            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1840 | <code>                            rowNumbers: [1, 2],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1841 | <code>                            columns: ['A', 'B', 'C']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1842 | <code>                        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1843 | <code>                        cells: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1844 | <code>                            { address: 'A1', value: 'START', text: 'START' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1845 | <code>                            { address: 'B1', value: '', text: '', fill: { fgRgb: '0099FF' } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1846 | <code>                            { address: 'C2', value: 'END', text: 'END' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1847 | <code>                        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1848 | <code>                        nonEmptyCells: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1849 | <code>                            { address: 'A1', value: 'START', fill: '' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1850 | <code>                            { address: 'B1', value: '', fill: '0099FF' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1851 | <code>                            { address: 'C2', value: 'END', fill: '' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1852 | <code>                        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1853 | <code>                        colorLegend: [{ rgb: '0099FF', count: 1 }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1854 | <code>                        formulas: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1855 | <code>                        mergedRanges: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1856 | <code>                        completeness: { allRequestedCellsIncluded: true }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1857 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1858 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1859 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1860 | <code>            queryHints: ['summary', 'grid', 'range', 'search']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1861 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1862 | <code>        const artifactId = artifactRecord.id;</code> | 声明局部标识符 `artifactId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1863 | <code>        assert.ok(artifactId);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1864 | <code>        assert.ok(gateway.eventLog.some((event) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1865 | <code>            event.type === 'context_artifact.created' &amp;&amp;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1866 | <code>            event.payload?.artifactId === artifactId &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1867 | <code>            event.payload?.runId === 'artifact-run-1'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1868 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1869 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1870 | <code>        const query = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1871 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1872 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1873 | <code>                tool: 'artifact_query',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1874 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1875 | <code>                    action: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1876 | <code>                    artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1877 | <code>                    sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1878 | <code>                    range: 'A1:C2'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1879 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1880 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1881 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1882 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1883 | <code>        assert.equal(query.body.ok, true, query.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1884 | <code>        assert.match(query.body.result.content[0].text, /START/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1885 | <code>        assert.match(query.body.result.content[0].text, /0099FF/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1886 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1887 | <code>        const compute = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `compute`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1888 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1889 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1890 | <code>                tool: 'artifact_compute',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1891 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1892 | <code>                    action: 'find_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1893 | <code>                    artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1894 | <code>                    sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1895 | <code>                    startValue: 'START',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1896 | <code>                    endValue: 'END',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1897 | <code>                    blockedFills: ['0099FF']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1898 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1899 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1900 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1901 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1902 | <code>        assert.equal(compute.body.ok, true, compute.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1903 | <code>        assert.match(compute.body.result.content[0].text, /ARTIFACT_COMPUTE_FIND_PATH/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1904 | <code>        assert.equal(compute.body.result.details.result.pathFound, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1905 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1906 | <code>        const storedRecord = await gateway.runtime.contextArtifactStore.getRecord(artifactId);</code> | 声明局部标识符 `storedRecord`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1907 | <code>        assert.ok(storedRecord.payloadPath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1908 | <code>        const rawRead = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `rawRead`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1909 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1910 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1911 | <code>                tool: 'read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1912 | <code>                args: { path: storedRecord.payloadPath },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1913 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1914 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1915 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1916 | <code>        assert.equal(rawRead.body.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1917 | <code>        assert.equal(rawRead.body.status, 'blocked');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1918 | <code>        assert.equal(rawRead.body.result.details.code, 'context_artifact_raw_read_blocked');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1919 | <code>        assert.equal(rawRead.body.result.details.suggestedNext.tool, 'artifact_query');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1920 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1921 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1922 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1923 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1924 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1925 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1926 | <code>test('AILIS Gateway imports RAGFlow-lite worker output into queryable artifacts', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1927 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-artifact-import-gateway-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1928 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1929 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1930 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1931 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1932 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1933 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1934 | <code>    const workbookPath = path.join(workspaceRoot, 'inventory.xlsx');</code> | 声明局部标识符 `workbookPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1935 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1936 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1937 | <code>        const workbook = new ExcelJS.Workbook();</code> | 声明局部标识符 `workbook`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1938 | <code>        const sheet = workbook.addWorksheet('Inventory');</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1939 | <code>        sheet.addRow(['Product', 'Color', 'Stock']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1940 | <code>        sheet.addRow(['Widget', 'Red', 12]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1941 | <code>        sheet.addRow(['Gadget', 'Blue', 5]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1942 | <code>        await workbook.xlsx.writeFile(workbookPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1943 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1944 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1945 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1946 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1947 | <code>        const imported = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `imported`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1948 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1949 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1950 | <code>                tool: 'artifact_import',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1951 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1952 | <code>                    path: workbookPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1953 | <code>                    parserId: 'table',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1954 | <code>                    language: 'English'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1955 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1956 | <code>                context: { workspace: workspaceRoot, runId: 'artifact-import-run-1', sessionId: 'artifact-import-session-1' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1957 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1958 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1959 | <code>        assert.equal(imported.body.ok, true, imported.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1960 | <code>        assert.match(imported.body.result.content[0].text, /ARTIFACT_IMPORT_COMPLETE/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1961 | <code>        assert.ok(imported.body.result.details.artifactId);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1962 | <code>        assert.ok(imported.body.result.details.chunkCount &gt;= 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1964 | <code>        const search = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `search`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1965 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1966 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1967 | <code>                tool: 'artifact_query',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1968 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1969 | <code>                    action: 'chunk_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1970 | <code>                    artifactId: imported.body.result.details.artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1971 | <code>                    query: 'Widget',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1972 | <code>                    limit: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1973 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1974 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1975 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1976 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1977 | <code>        assert.equal(search.body.ok, true, search.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1978 | <code>        assert.match(search.body.result.content[0].text, /ARTIFACT_CHUNK_SEARCH/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1979 | <code>        assert.match(search.body.result.content[0].text, /Widget/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1980 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1981 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1982 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1983 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1984 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1985 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1986 | <code>test('AILIS Gateway turns large text and parsed documents into queryable artifacts', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1987 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-text-artifact-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1988 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1989 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1990 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1991 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1992 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1993 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1994 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1995 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1996 | <code>        const largeLog = Array.from({ length: 420 }, (_, index) =&gt;</code> | 声明局部标识符 `largeLog`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1997 | <code>            `LOG_LINE_${index + 1}: ${index === 317 ? 'NEEDLE_BIG_TEXT_ARTIFACT' : 'ordinary line'} ${'x'.repeat(80)}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1998 | <code>        ).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 1999 | <code>        await fs.writeFile(path.join(workspaceRoot, 'large.log'), largeLog, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2000 | <code>        await fs.writeFile(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2001 | <code>            path.join(workspaceRoot, 'paper.pdf'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2002 | <code>            buildSimplePdfWithText('PDF artifact evidence includes AWARD-42 and document search should find it.')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2003 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2004 | <code>        await fs.writeFile(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2005 | <code>            path.join(workspaceRoot, 'scan.pdf'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2006 | <code>            buildBlankPdfWithoutSelectableText()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2007 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2008 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2009 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2010 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2011 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2012 | <code>        const readLog = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `readLog`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2013 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2014 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2015 | <code>                tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2016 | <code>                args: { action: 'read', path: 'large.log', maxBytes: 1024 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2017 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2018 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2019 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2020 | <code>        assert.equal(readLog.body.ok, true, readLog.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2021 | <code>        assert.match(readLog.body.result.content[0].text, /TEXT_ARTIFACT_CREATED/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2022 | <code>        const textArtifactId = readLog.body.result.details.artifactId;</code> | 声明局部标识符 `textArtifactId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2023 | <code>        assert.ok(textArtifactId);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2024 | <code>        assert.doesNotMatch(readLog.body.result.content[0].text, /LOG_LINE_420/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2025 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2026 | <code>        const textSearch = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `textSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2027 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2028 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2029 | <code>                tool: 'artifact_query',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2030 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2031 | <code>                    artifactId: textArtifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2032 | <code>                    action: 'text_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2033 | <code>                    query: 'NEEDLE_BIG_TEXT_ARTIFACT',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2034 | <code>                    contextLines: 0</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2035 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2036 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2037 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2038 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2039 | <code>        assert.equal(textSearch.body.ok, true, textSearch.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2040 | <code>        assert.equal(textSearch.body.result.details.matchCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2041 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2042 | <code>        const textTail = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `textTail`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2043 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2044 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2045 | <code>                tool: 'artifact_query',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2046 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2047 | <code>                    artifactId: textArtifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2048 | <code>                    action: 'text_tail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2049 | <code>                    lines: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2050 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2051 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2052 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2053 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2054 | <code>        assert.equal(textTail.body.ok, true, textTail.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2055 | <code>        assert.match(textTail.body.result.content[0].text, /LOG_LINE_420/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2056 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2057 | <code>        const readPdf = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `readPdf`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2058 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2059 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2060 | <code>                tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2061 | <code>                args: { action: 'read', path: 'paper.pdf' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2062 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2063 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2064 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2065 | <code>        assert.equal(readPdf.body.ok, true, readPdf.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2066 | <code>        assert.match(readPdf.body.result.content[0].text, /DOCUMENT_ARTIFACT_CREATED/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2067 | <code>        const documentArtifactId = readPdf.body.result.details.artifactId;</code> | 声明局部标识符 `documentArtifactId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2068 | <code>        assert.ok(documentArtifactId);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2069 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2070 | <code>        const documentSearch = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `documentSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2071 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2072 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2073 | <code>                tool: 'artifact_query',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2074 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2075 | <code>                    artifactId: documentArtifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2076 | <code>                    action: 'document_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2077 | <code>                    query: 'AWARD-42',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2078 | <code>                    contextLines: 0</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2079 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2080 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2081 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2082 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2083 | <code>        assert.equal(documentSearch.body.ok, true, documentSearch.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2084 | <code>        assert.equal(documentSearch.body.result.details.matchCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2085 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2086 | <code>        const documentPage = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `documentPage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2087 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2088 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2089 | <code>                tool: 'artifact_query',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2090 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2091 | <code>                    artifactId: documentArtifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2092 | <code>                    action: 'document_page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2093 | <code>                    page: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2094 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2095 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2096 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2097 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2098 | <code>        assert.equal(documentPage.body.ok, true, documentPage.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2099 | <code>        assert.match(documentPage.body.result.content[0].text, /AWARD-42/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2101 | <code>        const readScannedPdf = await jsonFetch(`${baseUrl}/tools/call`, {</code> | 声明局部标识符 `readScannedPdf`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2102 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2103 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2104 | <code>                tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2105 | <code>                args: { action: 'read', path: 'scan.pdf' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2106 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2107 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2108 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2109 | <code>        assert.equal(readScannedPdf.body.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2110 | <code>        assert.equal(readScannedPdf.body.status, 'scanned_pdf_needs_ocr');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2111 | <code>        assert.equal(readScannedPdf.body.result.details.documentParseCode, 'scanned_pdf_needs_ocr');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2112 | <code>        assert.equal(readScannedPdf.body.result.details.observationContract.needs_ocr, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2113 | <code>        assert.equal(readScannedPdf.body.result.details.suggestedNext.tool, 'tool_search');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2114 | <code>        assert.doesNotMatch(readScannedPdf.body.result.content[0].text, /DOCUMENT_ARTIFACT_CREATED/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2115 | <code>        assert.equal(readScannedPdf.body.result.details.artifactId, undefined);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2116 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2117 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2118 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2119 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2120 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2122 | <code>test('AILIS Gateway event stream keeps cursor-addressable replay history', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2123 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-events-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2124 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2125 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2126 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2127 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2128 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2129 | <code>        eventLogLimit: 20</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2130 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2132 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2133 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2134 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2135 | <code>        const firstSeq = gateway.eventSeq;</code> | 声明局部标识符 `firstSeq`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2136 | <code>        gateway.emitGatewayEvent('agent.step.started', { marker: 'one' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2137 | <code>        const cursor = gateway.eventSeq;</code> | 声明局部标识符 `cursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2138 | <code>        gateway.emitGatewayEvent('agent.step.finished', { marker: 'two' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2140 | <code>        const recent = await jsonFetch(`${baseUrl}/events/recent?cursor=${cursor}`);</code> | 声明局部标识符 `recent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2141 | <code>        assert.equal(recent.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2142 | <code>        assert.ok(recent.body.events.every((event) =&gt; event.seq &gt; cursor));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2143 | <code>        assert.ok(recent.body.events.some((event) =&gt; event.type === 'agent.step.finished'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2145 | <code>        const allRecent = await jsonFetch(`${baseUrl}/events/recent?cursor=${firstSeq}`);</code> | 声明局部标识符 `allRecent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2146 | <code>        assert.ok(allRecent.body.events.some((event) =&gt; event.type === 'agent.step.started'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2147 | <code>        assert.ok(allRecent.body.events.some((event) =&gt; event.delivery === 'lossless'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2148 | <code>        assert.equal(gateway.getStatus().events.buffered &gt;= 2, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2149 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2150 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2151 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2152 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2154 | <code>test('AILIS Gateway builds agent analysis snapshots from transcript, audit, and events', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2155 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-analysis-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2156 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2157 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2158 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2159 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2160 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2161 | <code>        eventLogLimit: 50</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2162 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2163 | <code>    const runId = 'analysis-run-1';</code> | 声明局部标识符 `runId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2164 | <code>    const sessionId = 'analysis-session';</code> | 声明局部标识符 `sessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2166 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2167 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2168 | <code>        await gateway.runtime.startRun({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2169 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2170 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2171 | <code>            message: 'debug this agent loop',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2172 | <code>            planner: 'llm-agentic-executor',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2173 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2174 | <code>            intent: 'llm_agent'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2175 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2176 | <code>        await gateway.runtime.appendItem(runId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2177 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2178 | <code>            type: 'agent.context_snapshot',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2179 | <code>            status: 'captured',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2180 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2181 | <code>                iteration: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2182 | <code>                promptBudget: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2183 | <code>                    model: 'ailis_prompt_budget',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2184 | <code>                    total_chars: 321,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2185 | <code>                    approx_input_tokens: 123</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2186 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2187 | <code>                messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2188 | <code>                    { role: 'system', content: 'system context' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2189 | <code>                    { role: 'user', content: 'debug this agent loop' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2190 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2191 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2192 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2193 | <code>        await gateway.runtime.appendItem(runId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2194 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2195 | <code>            type: 'agent.llm_call',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2196 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2197 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2198 | <code>                iteration: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2199 | <code>                callId: `${runId}:agent_decision:0`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2200 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2201 | <code>                model: 'test-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2202 | <code>                durationMs: 44,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2203 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2204 | <code>                status: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2205 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2206 | <code>                usage: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2207 | <code>                    promptTokens: 100,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2208 | <code>                    completionTokens: 20,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2209 | <code>                    totalTokens: 120</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2210 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2211 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2212 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2213 | <code>        await gateway.runtime.appendItem(runId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2214 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2215 | <code>            type: 'agent.decision',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2216 | <code>            status: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2217 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2218 | <code>                iteration: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2219 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2220 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2221 | <code>                intent: 'inspect_file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2222 | <code>                summary: 'Read the target file.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2223 | <code>                publicReasoning: 'Need one observation.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2224 | <code>                toolCall: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2225 | <code>                    id: 'step-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2226 | <code>                    title: 'Read note',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2227 | <code>                    tool: 'read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2228 | <code>                    args: { path: 'note.txt' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2229 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2230 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2231 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2232 | <code>        await gateway.runtime.appendItem(runId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2233 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2234 | <code>            type: 'tool.call',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2235 | <code>            status: 'started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2236 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2237 | <code>                callId: 'call-read-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2238 | <code>                tool: 'read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2239 | <code>                args: { path: 'note.txt' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2240 | <code>                context: { iteration: 0 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2241 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2242 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2243 | <code>        await gateway.runtime.appendItem(runId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2244 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2245 | <code>            type: 'tool.result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2246 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2247 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2248 | <code>                callId: 'call-read-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2249 | <code>                tool: 'read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2250 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2251 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2252 | <code>                durationMs: 17,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2253 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2254 | <code>                    content: [{ type: 'text', text: 'file contents' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2255 | <code>                    details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2256 | <code>                        outputStore: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2257 | <code>                            outputId: 'output-call-read-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2258 | <code>                            path: path.join(workspaceRoot, '.audit', 'output-store', 'output-call-read-1.log'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2259 | <code>                            bytes: 1234,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2260 | <code>                            lineCount: 12,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2261 | <code>                            previewTruncated: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2262 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2263 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2264 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2265 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2266 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2267 | <code>        await gateway.runtime.appendItem(runId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2268 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2269 | <code>            type: 'agent.progress_note',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2270 | <code>            status: 'delta',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2271 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2272 | <code>                iteration: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2273 | <code>                text: '我已经读到目标文件，接下来会基于里面的证据收敛答案。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2274 | <code>                source: 'model_tool_progress_note',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2275 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2276 | <code>                intent: 'inspect_file'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2277 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2278 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2279 | <code>        await gateway.runtime.completeRun(runId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2280 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2281 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2282 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2283 | <code>            planner: 'llm-agentic-executor',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2284 | <code>            intent: 'inspect_file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2285 | <code>            durationMs: 88,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2286 | <code>            displayText: 'done'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2287 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2288 | <code>        await gateway.appendAudit({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2289 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2290 | <code>            type: 'agent.run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2291 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2292 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2293 | <code>            durationMs: 88,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2294 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2295 | <code>            planner: 'llm-agentic-executor',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2296 | <code>            intent: 'inspect_file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2297 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2298 | <code>                message: 'debug this agent loop',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2299 | <code>                sessionId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2300 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2301 | <code>            resultPreview: 'done'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2302 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2303 | <code>        gateway.emitGatewayEvent('agent.llm_call.completed', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2304 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2305 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2306 | <code>            iteration: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2307 | <code>            durationMs: 44,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2308 | <code>            status: 'tool'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2309 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2310 | <code>        await gateway.runtime.appendItem(runId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2311 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2312 | <code>            type: 'agent.debug.paused',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2313 | <code>            status: 'debug_paused',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2314 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2315 | <code>                iteration: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2316 | <code>                nextIteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2317 | <code>                debugSessionId: 'debug-session-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2318 | <code>                reason: 'tool_completed'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2319 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2320 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2322 | <code>        const analysis = await gateway.analyzeAgentRun(runId);</code> | 声明局部标识符 `analysis`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2323 | <code>        assert.equal(analysis.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2324 | <code>        assert.equal(analysis.summary.rounds, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2325 | <code>        assert.equal(analysis.summary.llmCalls, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2326 | <code>        assert.equal(analysis.summary.toolCalls, 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2327 | <code>        assert.equal(analysis.summary.usage.totalTokens, 120);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2328 | <code>        assert.equal(analysis.rounds[0].messages[1].content, 'debug this agent loop');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2329 | <code>        assert.equal(analysis.rounds[0].progressNotes[0].source, 'model_tool_progress_note');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2330 | <code>        assert.match(analysis.rounds[0].progressNotes[0].text, /目标文件/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2331 | <code>        assert.equal(analysis.toolCalls[0].durationMs, 17);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2332 | <code>        assert.equal(analysis.toolCalls[0].outputStore.outputId, 'output-call-read-1');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2333 | <code>        assert.equal(analysis.outputArtifacts[0].outputId, 'output-call-read-1');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2334 | <code>        assert.match(analysis.summary.primaryBottleneck, /LLM&#124;read&#124;上下文/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2335 | <code>        assert.equal(analysis.summary.debugPaused, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2336 | <code>        assert.equal(analysis.summary.debugSessionId, 'debug-session-1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2337 | <code>        assert.equal(analysis.summary.nextIteration, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2339 | <code>        const runs = await gateway.listAgentAnalysisRuns(5);</code> | 声明局部标识符 `runs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2340 | <code>        assert.equal(runs.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2341 | <code>        assert.ok(runs.runs.some((run) =&gt; run.runId === runId));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2342 | <code>        assert.ok(runs.runs.some((run) =&gt; run.runId === runId &amp;&amp; run.debugPaused));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2344 | <code>        const viaHttp = await jsonFetch(`${status.url}/agent/analysis?runId=${runId}`);</code> | 声明局部标识符 `viaHttp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2345 | <code>        assert.equal(viaHttp.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2346 | <code>        assert.equal(viaHttp.body.runId, runId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2347 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2348 | <code>        const listViaHttp = await jsonFetch(`${status.url}/agent/analysis/runs?limit=5`);</code> | 声明局部标识符 `listViaHttp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2349 | <code>        assert.equal(listViaHttp.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2350 | <code>        assert.ok(listViaHttp.body.runs.some((run) =&gt; run.runId === runId));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2351 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2352 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2353 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2354 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
