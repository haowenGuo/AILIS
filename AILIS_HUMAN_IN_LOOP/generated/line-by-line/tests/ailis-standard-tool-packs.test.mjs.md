# tests/ailis-standard-tool-packs.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：287
- SHA-256：`449628340a22a12e125a351ed9b5e458f07cc7976dfd1ff9f53b074eec46ed55`
- 可运行副本：[打开源文件](../../../source/tests/ailis-standard-tool-packs.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-standard-tool-packs.cjs`、`../electron/ailis-contract-compiler.cjs`、`../electron/ailis-tool-acquisition-gateway.cjs`、`../electron/ailis-tool-contracts.cjs`
- 主要符号：`require`、`makeWorkspace`、`ids`、`listed`、`academic`、`compiled`、`openAlex`、`compiledOpenAlex`、`email`、`docs`、`workspaceRoot`、`gateway`、`candidates`、`tools`、`openAlexEntry`、`list`、`expose`、`dryRun`、`exposed`、`searched`、`previous`、`gmail`、`tavily`、`samplePath`、`calls`、`markitdown`、`fallback`、`executed`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 9 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 10 | <code>    STANDARD_TOOL_PACKS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 11 | <code>    listStandardToolPacks,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    searchStandardToolPacks,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    collectStandardToolPackContracts</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 14 | <code>} = require('../electron/ailis-standard-tool-packs.cjs');</code> | 导入依赖 `../electron/ailis-standard-tool-packs.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 15 | <code>const { compileAndLintAilisContract } = require('../electron/ailis-contract-compiler.cjs');</code> | 导入依赖 `../electron/ailis-contract-compiler.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 16 | <code>const { AILISToolAcquisitionGateway } = require('../electron/ailis-tool-acquisition-gateway.cjs');</code> | 导入依赖 `../electron/ailis-tool-acquisition-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 17 | <code>const { validateToolContract } = require('../electron/ailis-tool-contracts.cjs');</code> | 导入依赖 `../electron/ailis-tool-contracts.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>async function makeWorkspace(prefix) {</code> | 定义函数 `makeWorkspace`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    return await fs.mkdtemp(path.join(os.tmpdir(), prefix));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 21 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>test('AILIS standard tool packs expose mature backend families with lintable contracts', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    const ids = STANDARD_TOOL_PACKS.map((pack) =&gt; pack.id);</code> | 声明局部标识符 `ids`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 25 | <code>    assert.ok(ids.includes('email_productivity_pack'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 26 | <code>    assert.ok(ids.includes('document_reader_pack'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 27 | <code>    assert.ok(ids.includes('web_retrieval_pack'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 28 | <code>    assert.ok(ids.includes('academic_metadata_pack'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 29 | <code>    assert.ok(ids.includes('media_transcription_pack'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>    const listed = listStandardToolPacks({ includeTools: false });</code> | 声明局部标识符 `listed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 32 | <code>    assert.equal(listed.length, STANDARD_TOOL_PACKS.length);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 33 | <code>    assert.ok(listed.every((pack) =&gt; pack.toolCount &gt;= 1));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>    const academic = collectStandardToolPackContracts({</code> | 声明局部标识符 `academic`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 36 | <code>        packIds: ['academic_metadata_pack']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 37 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>    assert.equal(academic.counts.packs, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 39 | <code>    assert.ok(academic.groups.openapiOperations.length &gt;= 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 40 | <code>    for (const operation of academic.groups.openapiOperations) {</code> | 声明局部标识符 `operation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 41 | <code>        const compiled = compileAndLintAilisContract(operation, {</code> | 声明局部标识符 `compiled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 42 | <code>            sourceType: 'openapi_operation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 43 | <code>            minScore: 60,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 44 | <code>            id: operation.toolId &#124;&#124; operation.operationId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 45 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>        assert.equal(compiled.lint.approved, true, `${operation.toolId}: ${JSON.stringify(compiled.lint.issues)}`);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 47 | <code>        assert.ok(compiled.contract.whenToUse.length);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 48 | <code>        assert.ok(Object.keys(compiled.contract.errors).length);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 49 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>    const openAlex = academic.groups.openapiOperations.find((operation) =&gt; operation.toolId === 'openalex_search_works');</code> | 声明局部标识符 `openAlex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 51 | <code>    const compiledOpenAlex = compileAndLintAilisContract(openAlex, {</code> | 声明局部标识符 `compiledOpenAlex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        sourceType: 'openapi_operation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 53 | <code>        minScore: 60,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 54 | <code>        id: openAlex.toolId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 55 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>    assert.deepEqual(compiledOpenAlex.contract.inputSchema.anyOf, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 57 | <code>        { required: ['search'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 58 | <code>        { required: ['filter'] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>    assert.deepEqual(compiledOpenAlex.contract.inputSchema.required, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 61 | <code>    assert.ok(compiledOpenAlex.contract.inputSchema.properties.sort);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 62 | <code>    assert.match(compiledOpenAlex.contract.inputSchema.properties.search.description, /not author identity/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 63 | <code>    assert.match(compiledOpenAlex.contract.whenNotToUse.join(' '), /authorHistoryNextCalls/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 64 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>test('AILIS standard tool packs are searchable by task shape', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 67 | <code>    const email = searchStandardToolPacks('latest 10 emails inbox', { limit: 3, includeTools: false });</code> | 声明局部标识符 `email`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 68 | <code>    assert.equal(email[0].id, 'email_productivity_pack');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>    const docs = searchStandardToolPacks('read docx table pdf ocr', { limit: 3, includeTools: false });</code> | 声明局部标识符 `docs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 71 | <code>    assert.equal(docs[0].id, 'document_reader_pack');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>    const academic = searchStandardToolPacks('paper author doi venue year', { limit: 3, includeTools: false });</code> | 声明局部标识符 `academic`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 74 | <code>    assert.equal(academic[0].id, 'academic_metadata_pack');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 75 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>test('Tool Acquisition Gateway surfaces standard pack candidates and public academic tools', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 78 | <code>    const workspaceRoot = await makeWorkspace('ailis-standard-packs-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 79 | <code>    const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 80 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 81 | <code>        projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 82 | <code>        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 83 | <code>        registryFetcher: async () =&gt; ({ servers: [] })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 84 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>    const candidates = await gateway.searchCandidates({</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 87 | <code>        query: 'latest email inbox',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 88 | <code>        includeRegistry: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 89 | <code>        limit: 10</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 90 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>    assert.equal(candidates.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 92 | <code>    assert.ok(candidates.candidates.some((candidate) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 93 | <code>        candidate.type === 'standard_tool_pack' &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 94 | <code>        candidate.id === 'email_productivity_pack'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 95 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>    const tools = await gateway.searchExternalToolEntries({</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 98 | <code>        query: 'paper author doi academic metadata',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 99 | <code>        includeContracts: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 100 | <code>        includeExposed: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 101 | <code>        limit: 20</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 102 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>    assert.equal(tools.status, 'completed');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 104 | <code>    assert.ok(tools.tools.some((entry) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        entry.virtualToolId === 'external__openalex__search_works' &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 106 | <code>        entry.callable === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 107 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>    assert.ok(tools.tools.some((entry) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        entry.virtualToolId === 'external__crossref__search_works' &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 110 | <code>        entry.callable === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 111 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>    const openAlexEntry = tools.tools.find((entry) =&gt; entry.virtualToolId === 'external__openalex__search_works');</code> | 声明局部标识符 `openAlexEntry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 113 | <code>    assert.match(openAlexEntry.spec.description, /authorHistoryNextCalls/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 114 | <code>    assert.match(openAlexEntry.spec.description, /incomplete subset/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 115 | <code>    assert.ok(openAlexEntry.spec.parameters.properties.sort);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 116 | <code>    assert.deepEqual(openAlexEntry.spec.parameters.anyOf, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 117 | <code>        { required: ['search'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 118 | <code>        { required: ['filter'] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 119 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>test('Capability manager contract accepts standard tool pack actions', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 123 | <code>    const list = validateToolContract('capability_manager', {</code> | 声明局部标识符 `list`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 124 | <code>        action: 'list_standard_tool_packs'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 125 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 126 | <code>    assert.equal(list.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>    const expose = validateToolContract('capability_manager', {</code> | 声明局部标识符 `expose`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 129 | <code>        action: 'expose_standard_tool_packs',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 130 | <code>        standardToolPacks: ['academic_metadata_pack'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 131 | <code>        dryRun: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 132 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>    assert.equal(expose.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 134 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>test('AILIS standard tool pack exposure writes verified public tools and contract-only backends', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 137 | <code>    const workspaceRoot = await makeWorkspace('ailis-standard-pack-expose-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 138 | <code>    const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 139 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 140 | <code>        projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 141 | <code>        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 142 | <code>        registryFetcher: async () =&gt; ({ servers: [] })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 143 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>    const dryRun = await gateway.exposeStandardToolPacks({</code> | 声明局部标识符 `dryRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 146 | <code>        standardToolPacks: ['academic_metadata_pack', 'document_reader_pack'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 147 | <code>        dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 148 | <code>        includeRejected: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 149 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>    assert.equal(dryRun.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 151 | <code>    assert.equal(dryRun.dryRun, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 152 | <code>    assert.ok(dryRun.callable &gt;= 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 153 | <code>    assert.ok(dryRun.nonCallable &gt;= 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>    const exposed = await gateway.exposeStandardToolPacks({</code> | 声明局部标识符 `exposed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 156 | <code>        standardToolPacks: ['academic_metadata_pack', 'document_reader_pack'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 157 | <code>        includeRejected: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 158 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>    assert.equal(exposed.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 160 | <code>    assert.ok(exposed.total &gt;= exposed.added);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>    const listed = await gateway.listExposedExternalTools({</code> | 声明局部标识符 `listed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 163 | <code>        query: 'docling document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 164 | <code>        limit: 10</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 165 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>    assert.ok(listed.exposures.some((entry) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 167 | <code>        entry.toolId === 'docling_convert_document' &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 168 | <code>        entry.callable === false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 169 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>    const searched = await gateway.searchExternalToolEntries({</code> | 声明局部标识符 `searched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 172 | <code>        query: 'read docx secret santa table',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 173 | <code>        limit: 10</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 174 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>    assert.ok(searched.tools.some((entry) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 176 | <code>        entry.toolId === 'docling_convert_document' &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 177 | <code>        entry.callable === false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 178 | <code>    ), JSON.stringify(searched.tools, null, 2));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 179 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>test('AILIS standard auth adapters configure env profiles but do not promote missing credentials', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 182 | <code>    const workspaceRoot = await makeWorkspace('ailis-standard-auth-verify-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 183 | <code>    const previous = {</code> | 声明局部标识符 `previous`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 184 | <code>        GMAIL_ACCESS_TOKEN: process.env.GMAIL_ACCESS_TOKEN,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 185 | <code>        MSGRAPH_ACCESS_TOKEN: process.env.MSGRAPH_ACCESS_TOKEN,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 186 | <code>        COMPOSIO_API_KEY: process.env.COMPOSIO_API_KEY,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 187 | <code>        FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 188 | <code>        TAVILY_API_KEY: process.env.TAVILY_API_KEY</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 189 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>    delete process.env.GMAIL_ACCESS_TOKEN;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 191 | <code>    delete process.env.MSGRAPH_ACCESS_TOKEN;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 192 | <code>    delete process.env.COMPOSIO_API_KEY;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 193 | <code>    delete process.env.FIRECRAWL_API_KEY;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 194 | <code>    delete process.env.TAVILY_API_KEY;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 195 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 196 | <code>        const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 197 | <code>            workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 198 | <code>            projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 199 | <code>            stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 200 | <code>            registryFetcher: async () =&gt; ({ servers: [] })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 201 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>        const exposed = await gateway.exposeStandardToolPacks({</code> | 声明局部标识符 `exposed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 203 | <code>            standardToolPacks: ['email_productivity_pack', 'web_retrieval_pack'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 204 | <code>            enableAuthRequiredAdapters: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 205 | <code>            includeLocalContracts: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 206 | <code>            includePublicReadonly: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 207 | <code>            verifyAdapters: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 208 | <code>            includeRejected: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 209 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>        assert.equal(exposed.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 211 | <code>        assert.ok(exposed.configuredAuthProfiles.some((profile) =&gt; profile.id === 'gmail-oauth'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 212 | <code>        assert.ok(exposed.configuredAuthProfiles.some((profile) =&gt; profile.id === 'tavily-api'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 213 | <code>        assert.ok(exposed.smokeResults.some((entry) =&gt; entry.toolId === 'gmail_list_messages' &amp;&amp; entry.ok === false));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 214 | <code>        const gmail = exposed.exposures.find((entry) =&gt; entry.toolId === 'gmail_list_messages');</code> | 声明局部标识符 `gmail`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 215 | <code>        assert.equal(gmail.callable, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 216 | <code>        assert.equal(gmail.verification, 'needs_config');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 217 | <code>        const tavily = exposed.exposures.find((entry) =&gt; entry.toolId === 'tavily_search');</code> | 声明局部标识符 `tavily`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 218 | <code>        assert.equal(tavily.callable, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 219 | <code>        assert.equal(tavily.contract.readOnlyHint, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 220 | <code>        assert.equal(tavily.mutates, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 221 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 222 | <code>        for (const [key, value] of Object.entries(previous)) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 223 | <code>            if (value === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 224 | <code>                delete process.env[key];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 225 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 226 | <code>                process.env[key] = value;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 227 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 228 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 229 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 232 | <code>test('AILIS standard local document adapters promote only after dependency smoke', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 233 | <code>    const workspaceRoot = await makeWorkspace('ailis-standard-local-adapters-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 234 | <code>    const samplePath = path.join(workspaceRoot, 'sample.txt');</code> | 声明局部标识符 `samplePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 235 | <code>    await fs.writeFile(samplePath, 'Secret Santa table: Alice gives to Bob.', 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 236 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 237 | <code>    const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 238 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 239 | <code>        projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 240 | <code>        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 241 | <code>        registryFetcher: async () =&gt; ({ servers: [] }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 242 | <code>        localAdapterRunner: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 243 | <code>            check: async (adapter) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 244 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 245 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 246 | <code>                adapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 247 | <code>                command: 'fake-python',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 248 | <code>                packageName: adapter.packageName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 249 | <code>                importName: adapter.importName</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 250 | <code>            }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>            execute: async (exposure, params) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 252 | <code>                calls.push({ toolId: exposure.toolId, path: params.path });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 253 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 254 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 255 | <code>                    ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 256 | <code>                    exposureId: exposure.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 257 | <code>                    toolId: exposure.toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 258 | <code>                    text: 'Secret Santa table: Alice gives to Bob.',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 259 | <code>                    fullTextPath: samplePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 260 | <code>                    tables: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 261 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 264 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 265 | <code>    const exposed = await gateway.exposeStandardToolPacks({</code> | 声明局部标识符 `exposed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 266 | <code>        standardToolPacks: ['document_reader_pack'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 267 | <code>        enableLocalAdapters: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 268 | <code>        verifyAdapters: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 269 | <code>        includeRejected: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 270 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>    assert.equal(exposed.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 272 | <code>    const markitdown = exposed.exposures.find((entry) =&gt; entry.toolId === 'markitdown_convert_document');</code> | 声明局部标识符 `markitdown`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 273 | <code>    assert.equal(markitdown.callable, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 274 | <code>    assert.equal(markitdown.verification, 'static_smoke_passed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 275 | <code>    assert.equal(markitdown.virtualToolId, 'external__document_reader_pack__markitdown_convert_document');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 276 | <code>    const fallback = exposed.exposures.find((entry) =&gt; entry.toolId === 'python_document_extract');</code> | 声明局部标识符 `fallback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 277 | <code>    assert.equal(fallback.callable, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 278 | <code>    assert.equal(fallback.verification, 'static_smoke_passed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>    const executed = await gateway.executeExposedExternalTool({</code> | 声明局部标识符 `executed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 281 | <code>        toolId: 'markitdown_convert_document',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 282 | <code>        args: { path: samplePath }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 283 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>    assert.equal(executed.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 285 | <code>    assert.equal(calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 286 | <code>    assert.equal(calls[0].path, samplePath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-standard-tool-packs 的契约与回归行为。”这一文件职责。 |
| 287 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
