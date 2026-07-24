# tests/ailis-contract-compiler.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-contract-compiler 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：852
- SHA-256：`ff05f50d6239f1c39c33260f71ab1c768e908383502c893f698da045abf65429`
- 可运行副本：[打开源文件](../../../source/tests/ailis-contract-compiler.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:http`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-contract-compiler.cjs`、`../electron/ailis-tool-acquisition-gateway.cjs`、`../electron/ailis-capability-manager.cjs`
- 主要符号：`require`、`makeWorkspace`、`withHttpServer`、`server`、`address`、`baseUrl`、`ids`、`result`、`workspaceRoot`、`gateway`、`intake`、`listed`、`calls`、`exposed`、`mcpResult`、`nonCallable`、`url`、`searched`、`direct`、`candidate`、`topicSearch`、`searchStudies`、`previousToken`、`body`、`profile`、`needsApproval`、`requests`、`smoke`、`manager`、`sources`、`compiled`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import http from 'node:http';</code> | 导入依赖 `node:http`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 7 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 10 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 11 | <code>    CONTRACT_SOURCE_PROFILES,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    compileAndLintAilisContract,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    lintAilisContract</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 14 | <code>} = require('../electron/ailis-contract-compiler.cjs');</code> | 导入依赖 `../electron/ailis-contract-compiler.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 15 | <code>const { AILISToolAcquisitionGateway } = require('../electron/ailis-tool-acquisition-gateway.cjs');</code> | 导入依赖 `../electron/ailis-tool-acquisition-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 16 | <code>const { AILISCapabilityManager } = require('../electron/ailis-capability-manager.cjs');</code> | 导入依赖 `../electron/ailis-capability-manager.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>async function makeWorkspace(prefix) {</code> | 定义函数 `makeWorkspace`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    return await fs.mkdtemp(path.join(os.tmpdir(), prefix));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 20 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>async function withHttpServer(handler) {</code> | 定义函数 `withHttpServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    const server = http.createServer(handler);</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 25 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 26 | <code>    const baseUrl = `http://127.0.0.1:${address.port}`;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 27 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 28 | <code>        baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 29 | <code>        close: () =&gt; new Promise((resolve, reject) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 30 | <code>            server.close((error) =&gt; error ? reject(error) : resolve());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 31 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 32 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>test('AILIS contract compiler lists mature source profiles', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 36 | <code>    const ids = CONTRACT_SOURCE_PROFILES.map((entry) =&gt; entry.id);</code> | 声明局部标识符 `ids`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 37 | <code>    assert.ok(ids.includes('mcp_registry'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 38 | <code>    assert.ok(ids.includes('composio'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 39 | <code>    assert.ok(ids.includes('openapi'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 40 | <code>    assert.ok(ids.includes('langchain_pydantic'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 41 | <code>    assert.ok(ids.includes('codex_openhands'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 42 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>test('AILIS contract linter rejects thin tool menu schemas', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 45 | <code>    const result = compileAndLintAilisContract({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 46 | <code>        name: 'thin_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 47 | <code>        description: 'Do thing.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 48 | <code>        inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 49 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 50 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 51 | <code>                path: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 52 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 55 | <code>        sourceType: 'mcp_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 56 | <code>        minScore: 85</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 57 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 58 | <code>    assert.equal(result.lint.approved, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    assert.ok(result.lint.issues.some((issue) =&gt; issue.code === 'missing_required'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 60 | <code>    assert.ok(result.lint.issues.some((issue) =&gt; issue.code === 'missing_error_recovery'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 61 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>test('AILIS contract compiler applies known recovery contract for run_python_file', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 64 | <code>    const result = compileAndLintAilisContract({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 65 | <code>        name: 'run_python_file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 66 | <code>        description: 'Run a local Python file and return stdout/stderr.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 67 | <code>        inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 68 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 69 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 70 | <code>                path: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 71 | <code>                file: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 72 | <code>                filePath: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 73 | <code>                file_path: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 74 | <code>                timeoutMs: { type: 'number' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 75 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 78 | <code>        sourceType: 'mcp_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 79 | <code>        server: 'ailis_research'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 80 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>    assert.equal(result.lint.approved, true, JSON.stringify(result.lint.issues));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 82 | <code>    assert.deepEqual(result.contract.inputSchema.required, ['path']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 83 | <code>    assert.equal(result.contract.inputSchema.additionalProperties, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 84 | <code>    assert.match(JSON.stringify(result.contract.errors), /existing local \.py file/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 85 | <code>    assert.match(result.promptCard, /computer\.write/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 86 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>test('OpenAPI operation compiles into a canonical AILIS contract', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 89 | <code>    const result = compileAndLintAilisContract({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 90 | <code>        operationId: 'gmailListMessages',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 91 | <code>        method: 'get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 92 | <code>        path: '/gmail/v1/users/{userId}/messages',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 93 | <code>        summary: 'List Gmail messages for a mailbox.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 94 | <code>        parameters: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 95 | <code>            { name: 'userId', required: true, schema: { type: 'string' }, description: 'Mailbox user id or me.' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 96 | <code>            { name: 'q', required: false, schema: { type: 'string' }, description: 'Gmail search query.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 97 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>        whenToUse: ['Use for Gmail message listing after OAuth is configured.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 99 | <code>        whenNotToUse: ['Do not use before OAuth token refresh succeeds.'],</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 100 | <code>        preconditions: ['Gmail OAuth access token is valid.'],</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 101 | <code>        examples: [{ userId: 'me', q: 'newer_than:1d' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 102 | <code>        badExamples: [{ q: 'newer_than:1d' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 103 | <code>        alternatives: ['Use IMAP inbox list when Gmail API is unavailable.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 104 | <code>        errors: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 105 | <code>            auth_expired: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 106 | <code>                recoverable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 107 | <code>                nextActions: ['refresh OAuth token']</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 108 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>        permissions: ['gmail.readonly']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 111 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 112 | <code>        sourceType: 'openapi_operation'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 113 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>    assert.equal(result.lint.approved, true, JSON.stringify(result.lint.issues));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 115 | <code>    assert.deepEqual(result.contract.inputSchema.required, ['userId']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 116 | <code>    assert.equal(result.contract.source.type, 'openapi_operation');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 117 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>test('Tool Acquisition Gateway stores accepted and rejected compiled contracts', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 120 | <code>    const workspaceRoot = await makeWorkspace('ailis-contract-intake-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 121 | <code>    const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 122 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 123 | <code>        projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 124 | <code>        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 125 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 126 | <code>    const intake = await gateway.intakeContracts({</code> | 声明局部标识符 `intake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 127 | <code>        sourceType: 'mcp_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 128 | <code>        server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 129 | <code>        contracts: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 130 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 131 | <code>                name: 'run_python_file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 132 | <code>                description: 'Run a local Python file and return stdout/stderr.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 133 | <code>                inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 134 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 135 | <code>                    properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 136 | <code>                        path: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 137 | <code>                        timeoutMs: { type: 'number' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 138 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 142 | <code>                name: 'thin_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 143 | <code>                description: 'Do thing.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 144 | <code>                inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 145 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 146 | <code>                    properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 147 | <code>                        value: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 148 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 152 | <code>        minScore: 85</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 153 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>    assert.equal(intake.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 155 | <code>    assert.equal(intake.accepted, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 156 | <code>    assert.equal(intake.rejected, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>    const listed = await gateway.listContractIntake({ limit: 10 });</code> | 声明局部标识符 `listed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 159 | <code>    assert.equal(listed.contractCount, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 160 | <code>    assert.ok(listed.contracts.some((entry) =&gt; entry.status === 'approved'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 161 | <code>    assert.ok(listed.contracts.some((entry) =&gt; entry.status === 'rejected'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 162 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>test('Tool Acquisition Gateway bulk exposes external Composio OpenAPI and live MCP specs', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 165 | <code>    const workspaceRoot = await makeWorkspace('ailis-external-exposure-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 166 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 167 | <code>    const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 168 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 169 | <code>        projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 170 | <code>        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 171 | <code>        mcpManager: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 172 | <code>            async listToolSpecs() {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 173 | <code>                return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 174 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 175 | <code>                        id: 'mcp__docs__search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 176 | <code>                        name: 'mcp__docs__search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 177 | <code>                        server: 'docs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 178 | <code>                        tool: 'search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 179 | <code>                        description: 'Search verified documentation pages.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 180 | <code>                        input_schema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 181 | <code>                            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 182 | <code>                            required: ['query'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 183 | <code>                            additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 184 | <code>                            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 185 | <code>                                query: { type: 'string', description: 'Specific documentation query.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 186 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>                ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>            async callTool(request) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 192 | <code>                calls.push(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 193 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 194 | <code>                    content: [{ type: 'text', text: `searched:${request.args.query}` }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 195 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 196 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 198 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>    const exposed = await gateway.bulkExposeExternalTools({</code> | 声明局部标识符 `exposed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 200 | <code>        includeMcpRegistry: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 201 | <code>        includeInstalledMcp: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 202 | <code>        composioTools: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 203 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 204 | <code>                name: 'gmail_send_email',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 205 | <code>                description: 'Send an email using Gmail through Composio.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 206 | <code>                inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 207 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 208 | <code>                    required: ['to', 'subject', 'body'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 209 | <code>                    additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 210 | <code>                    properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 211 | <code>                        to: { type: 'string', description: 'Recipient email address.' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 212 | <code>                        subject: { type: 'string', description: 'Email subject.' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 213 | <code>                        body: { type: 'string', description: 'Email body.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 214 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>                whenToUse: ['Use when Gmail OAuth is configured and the user asks to send an email.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 217 | <code>                whenNotToUse: ['Do not send without user approval.'],</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 218 | <code>                preconditions: ['Gmail OAuth account is configured.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 219 | <code>                examples: [{ to: 'user@example.com', subject: 'Hello', body: 'Hi' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 220 | <code>                badExamples: [{ subject: 'Missing recipient' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 221 | <code>                alternatives: ['Use email.draft for approval-first workflow.'],</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 222 | <code>                errors: { oauth_missing: { recoverable: true, nextActions: ['connect Gmail account'] } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 223 | <code>                permissions: ['gmail.send']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 224 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 226 | <code>        openapiOperations: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 227 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 228 | <code>                operationId: 'githubGetRepo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 229 | <code>                method: 'get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 230 | <code>                path: '/repos/{owner}/{repo}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 231 | <code>                summary: 'Get GitHub repository metadata.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 232 | <code>                parameters: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 233 | <code>                    { name: 'owner', required: true, schema: { type: 'string' }, description: 'Repository owner.' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 234 | <code>                    { name: 'repo', required: true, schema: { type: 'string' }, description: 'Repository name.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 235 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>                whenToUse: ['Use for official GitHub repository metadata.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 237 | <code>                whenNotToUse: ['Do not use for local git status.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 238 | <code>                preconditions: ['GitHub API is reachable.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 239 | <code>                examples: [{ owner: 'openai', repo: 'codex' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 240 | <code>                badExamples: [{ owner: 'openai' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 241 | <code>                alternatives: ['Use code.git_status for local repositories.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 242 | <code>                errors: { not_found: { recoverable: false } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 243 | <code>                permissions: ['github.read']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 244 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 246 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 247 | <code>    assert.equal(exposed.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 248 | <code>    assert.equal(exposed.added, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 249 | <code>    assert.equal(exposed.callable, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 250 | <code>    assert.ok(exposed.exposures.some((entry) =&gt; entry.callable &amp;&amp; entry.toolId === 'mcp__docs__search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 251 | <code>    assert.ok(exposed.exposures.some((entry) =&gt; entry.source.type === 'composio_tool' &amp;&amp; !entry.callable));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 252 | <code>    assert.ok(exposed.exposures.some((entry) =&gt; entry.source.type === 'openapi_operation' &amp;&amp; !entry.callable));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>    const listed = await gateway.listExposedExternalTools({ limit: 10 });</code> | 声明局部标识符 `listed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 255 | <code>    assert.equal(listed.total, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 256 | <code>    assert.equal(listed.callable, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 258 | <code>    const mcpResult = await gateway.executeExposedExternalTool({</code> | 声明局部标识符 `mcpResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 259 | <code>        toolId: 'mcp__docs__search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 260 | <code>        args: { query: 'contract compiler' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 261 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>    assert.equal(mcpResult.status, 'completed');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 263 | <code>    assert.equal(calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 264 | <code>    assert.deepEqual(calls[0], {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 265 | <code>        server: 'docs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 266 | <code>        tool: 'search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 267 | <code>        args: { query: 'contract compiler' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 268 | <code>        meta: undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 269 | <code>        timeoutMs: undefined</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 270 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 272 | <code>    const nonCallable = await gateway.executeExposedExternalTool({</code> | 声明局部标识符 `nonCallable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 273 | <code>        toolId: 'githubGetRepo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 274 | <code>        args: { owner: 'openai', repo: 'codex' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 275 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>    assert.equal(nonCallable.status, 'adapter_required');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 277 | <code>    assert.equal(nonCallable.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 278 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>test('Tool Acquisition Gateway executes trusted read-only OpenAPI exposure', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 281 | <code>    const workspaceRoot = await makeWorkspace('ailis-openapi-executor-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 282 | <code>    const server = await withHttpServer((req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 283 | <code>        const url = new URL(req.url, 'http://127.0.0.1');</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 284 | <code>        res.setHeader('content-type', 'application/json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 285 | <code>        res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 286 | <code>            method: req.method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 287 | <code>            pathname: url.pathname,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 288 | <code>            q: url.searchParams.get('q')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 289 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 291 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 292 | <code>        const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 293 | <code>            workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 294 | <code>            projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 295 | <code>            stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 296 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>        const exposed = await gateway.bulkExposeExternalTools({</code> | 声明局部标识符 `exposed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 298 | <code>            includeMcpRegistry: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 299 | <code>            includeInstalledMcp: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 300 | <code>            trustCallable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 301 | <code>            openapiOperations: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 302 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 303 | <code>                    operationId: 'lookupThing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 304 | <code>                    method: 'get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 305 | <code>                    path: '/things/{id}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 306 | <code>                    baseUrl: server.baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 307 | <code>                    callable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 308 | <code>                    summary: 'Lookup a thing by id.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 309 | <code>                    parameters: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 310 | <code>                        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Thing id.' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 311 | <code>                        { name: 'q', in: 'query', required: false, schema: { type: 'string' }, description: 'Search hint.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 312 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>                    whenToUse: ['Use for read-only thing lookup.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 314 | <code>                    whenNotToUse: ['Do not use for mutation.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 315 | <code>                    preconditions: ['Local test API is running.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 316 | <code>                    examples: [{ id: 'abc', q: 'hello' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 317 | <code>                    badExamples: [{ q: 'missing id' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 318 | <code>                    alternatives: ['Use local fixture if API is down.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 319 | <code>                    errors: { not_found: { recoverable: false } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 320 | <code>                    permissions: ['things.read']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 321 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 322 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 324 | <code>        assert.equal(exposed.callable, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 325 | <code>        const result = await gateway.executeExposedExternalTool({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 326 | <code>            toolId: 'lookupThing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 327 | <code>            args: { id: 'abc', q: 'hello' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 328 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>        assert.equal(result.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 330 | <code>        assert.equal(result.http.status, 200);</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 331 | <code>        assert.equal(result.body.pathname, '/things/abc');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 332 | <code>        assert.equal(result.body.q, 'hello');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 333 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 334 | <code>        await server.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 335 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 336 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 337 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 338 | <code>test('Tool Acquisition Gateway classifies OpenAPI HTTP rate limits with recovery hints', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 339 | <code>    const workspaceRoot = await makeWorkspace('ailis-openapi-rate-limit-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 340 | <code>    const server = await withHttpServer((_req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 341 | <code>        res.statusCode = 429;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 342 | <code>        res.statusMessage = 'Too Many Requests';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 343 | <code>        res.setHeader('content-type', 'application/json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 344 | <code>        res.setHeader('retry-after', '60');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 345 | <code>        res.end(JSON.stringify({ error: 'rate limited' }));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 346 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 348 | <code>        const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 349 | <code>            workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 350 | <code>            projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 351 | <code>            stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 352 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 353 | <code>        await gateway.bulkExposeExternalTools({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 354 | <code>            includeMcpRegistry: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 355 | <code>            includeInstalledMcp: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 356 | <code>            trustCallable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 357 | <code>            openapiOperations: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 358 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 359 | <code>                    operationId: 'rateLimitedSearch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 360 | <code>                    method: 'get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 361 | <code>                    path: '/search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 362 | <code>                    baseUrl: server.baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 363 | <code>                    callable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 364 | <code>                    summary: 'Search a rate limited external index.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 365 | <code>                    parameters: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 366 | <code>                        { name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Search query.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 367 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>                    whenToUse: ['Use for external metadata lookup.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 369 | <code>                    whenNotToUse: ['Do not keep retrying after HTTP 429.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 370 | <code>                    preconditions: ['Query is known.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 371 | <code>                    examples: [{ q: 'toolformer' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 372 | <code>                    badExamples: [{}],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 373 | <code>                    alternatives: ['Use another structured source when rate limited.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 374 | <code>                    errors: { rate_limited: { recoverable: true } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 375 | <code>                    permissions: ['metadata.read']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 376 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 377 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 378 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 379 | <code>        const result = await gateway.executeExposedExternalTool({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 380 | <code>            toolId: 'rateLimitedSearch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 381 | <code>            args: { q: 'toolformer' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 382 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 383 | <code>        assert.equal(result.status, 'http_error');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 384 | <code>        assert.equal(result.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 385 | <code>        assert.equal(result.http.status, 429);</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 386 | <code>        assert.equal(result.failureReason, 'rate_limited');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 387 | <code>        assert.equal(result.failure.retryAfter, '60');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 388 | <code>        assert.ok(result.nextActions.some((entry) =&gt; /alternate structured source/i.test(entry)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 389 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 390 | <code>        await server.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 391 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 394 | <code>test('Tool Acquisition Gateway classifies OpenAPI forbidden responses with recovery hints', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 395 | <code>    const workspaceRoot = await makeWorkspace('ailis-openapi-forbidden-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 396 | <code>    const server = await withHttpServer((_req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 397 | <code>        res.statusCode = 403;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 398 | <code>        res.statusMessage = 'Forbidden';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 399 | <code>        res.setHeader('content-type', 'text/plain');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 400 | <code>        res.end('forbidden');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 401 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 402 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 403 | <code>        const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 404 | <code>            workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 405 | <code>            projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 406 | <code>            stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 407 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 408 | <code>        await gateway.bulkExposeExternalTools({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 409 | <code>            includeMcpRegistry: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 410 | <code>            includeInstalledMcp: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 411 | <code>            trustCallable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 412 | <code>            openapiOperations: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 413 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 414 | <code>                    operationId: 'blockedArticlePage',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 415 | <code>                    method: 'get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 416 | <code>                    path: '/doi/10.1145/example',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 417 | <code>                    baseUrl: server.baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 418 | <code>                    callable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 419 | <code>                    summary: 'Fetch a publisher article page that may block automated requests.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 420 | <code>                    parameters: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 421 | <code>                    whenToUse: ['Use only when publisher page access is required.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 422 | <code>                    whenNotToUse: ['Do not keep retrying after HTTP 403.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 423 | <code>                    preconditions: ['Article URL is known.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 424 | <code>                    examples: [{}],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 425 | <code>                    badExamples: [{ q: 'broad search' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 426 | <code>                    alternatives: ['Use Crossref, OpenAlex, DOI metadata, or a library copy.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 427 | <code>                    errors: { forbidden_or_blocked: { recoverable: true } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 428 | <code>                    permissions: ['publisher.read']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 429 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 431 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 432 | <code>        const result = await gateway.executeExposedExternalTool({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 433 | <code>            toolId: 'blockedArticlePage',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 434 | <code>            args: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 435 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 436 | <code>        assert.equal(result.status, 'http_error');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 437 | <code>        assert.equal(result.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 438 | <code>        assert.equal(result.http.status, 403);</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 439 | <code>        assert.equal(result.failureReason, 'forbidden_or_blocked');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 440 | <code>        assert.match(result.message, /not a query wording problem/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 441 | <code>        assert.ok(result.nextActions.some((entry) =&gt; /official API&#124;mirrored structured source/i.test(entry)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 442 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 443 | <code>        await server.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 444 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 445 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 446 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 447 | <code>test('Tool Acquisition Gateway exposes callable OpenAPI adapters as virtual direct tools', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 448 | <code>    const workspaceRoot = await makeWorkspace('ailis-openapi-virtual-direct-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 449 | <code>    const server = await withHttpServer((req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 450 | <code>        const url = new URL(req.url, 'http://127.0.0.1');</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 451 | <code>        res.setHeader('content-type', 'application/json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 452 | <code>        res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 453 | <code>            pathname: url.pathname,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 454 | <code>            protocolSection: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 455 | <code>                designModule: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 456 | <code>                    enrollmentInfo: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 457 | <code>                        count: 90</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 458 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 459 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 460 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 461 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 463 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 464 | <code>        const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 465 | <code>            workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 466 | <code>            projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 467 | <code>            stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 468 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 469 | <code>        await gateway.bulkExposeExternalTools({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 470 | <code>            includeMcpRegistry: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 471 | <code>            includeInstalledMcp: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 472 | <code>            trustCallable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 473 | <code>            enableOpenApiAdapter: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 474 | <code>            sourceName: 'clinicaltrials',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 475 | <code>            openapiOperations: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 476 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 477 | <code>                    operationId: 'clinicalTrialsGetStudy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 478 | <code>                    method: 'get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 479 | <code>                    path: '/api/v2/studies/{nctId}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 480 | <code>                    baseUrl: server.baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 481 | <code>                    summary: 'Get a ClinicalTrials.gov study record by NCT id, including actual enrollment count.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 482 | <code>                    parameters: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 483 | <code>                        { name: 'nctId', in: 'path', required: true, schema: { type: 'string' }, description: 'NCT id.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 484 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 485 | <code>                    whenToUse: ['Use for ClinicalTrials.gov structured enrollment fields.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 486 | <code>                    whenNotToUse: ['Do not use for broad web search.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 487 | <code>                    preconditions: ['NCT id is known.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 488 | <code>                    examples: [{ nctId: 'NCT03411733' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 489 | <code>                    badExamples: [{}],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 490 | <code>                    alternatives: ['Use web_fetch only if the API is unavailable.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 491 | <code>                    errors: { not_found: { recoverable: false } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 492 | <code>                    permissions: ['clinicaltrials.read']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 493 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 494 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 495 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 496 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 497 | <code>        const searched = await gateway.searchExternalToolEntries({</code> | 声明局部标识符 `searched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 498 | <code>            query: 'ClinicalTrials API NCT enrollment',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 499 | <code>            limit: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 500 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 501 | <code>        const direct = searched.tools.find((entry) =&gt; entry.id === 'external__clinicaltrials__get_study');</code> | 声明局部标识符 `direct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 502 | <code>        assert.ok(direct, JSON.stringify(searched.tools, null, 2));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 503 | <code>        assert.equal(direct.callable, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 504 | <code>        assert.equal(direct.call_pattern.tool, 'external__clinicaltrials__get_study');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 506 | <code>        const result = await gateway.executeVirtualExternalTool('external__clinicaltrials__get_study', {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 507 | <code>            nctId: 'NCT03411733'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 508 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 509 | <code>        assert.equal(result.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 510 | <code>        assert.equal(result.body.protocolSection.designModule.enrollmentInfo.count, 90);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 511 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 512 | <code>        await server.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 513 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 514 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 516 | <code>test('Tool Acquisition Gateway includes accepted contract intake in external search', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 517 | <code>    const workspaceRoot = await makeWorkspace('ailis-contract-intake-search-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 518 | <code>    const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 519 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 520 | <code>        projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 521 | <code>        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 522 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>    await gateway.intakeContracts({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 524 | <code>        sourceType: 'openapi_operation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 525 | <code>        rawContracts: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 526 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 527 | <code>                operationId: 'leicesterPaperLookup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 528 | <code>                summary: 'Lookup University of Leicester paper facts and calculated volume values.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 529 | <code>                inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 530 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 531 | <code>                    required: ['title'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 532 | <code>                    additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 533 | <code>                    properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 534 | <code>                        title: { type: 'string', description: 'Paper title.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 535 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 536 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 537 | <code>                whenToUse: ['Use when a task needs the Leicester paper calculated volume.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 538 | <code>                whenNotToUse: ['Do not use for unrelated university pages.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 539 | <code>                preconditions: ['Paper title is known.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 540 | <code>                examples: [{ title: 'Can Hiccup Supply Enough Fish?' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 541 | <code>                badExamples: [{}],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 542 | <code>                alternatives: ['Use PDF extract text if no structured tool is available.'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 543 | <code>                errors: { not_found: { recoverable: true, nextActions: ['try PDF parser'] } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 544 | <code>                permissions: ['web.read']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 545 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 546 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 547 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 548 | <code>    const searched = await gateway.searchExternalToolEntries({</code> | 声明局部标识符 `searched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 549 | <code>        query: 'Leicester fish bag volume paper',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 550 | <code>        limit: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 551 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 552 | <code>    const candidate = searched.tools.find((entry) =&gt; entry.type === 'external_contract_intake');</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 553 | <code>    assert.ok(candidate, JSON.stringify(searched.tools, null, 2));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 554 | <code>    assert.equal(candidate.callable, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 555 | <code>    assert.match(JSON.stringify(candidate), /leicesterPaperLookup&#124;Leicester paper/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 556 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 557 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 558 | <code>test('Tool Acquisition Gateway includes built-in public OpenAPI tools in external search without prior exposure', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 559 | <code>    const workspaceRoot = await makeWorkspace('ailis-builtin-openapi-search-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 560 | <code>    const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 561 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 562 | <code>        projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 563 | <code>        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 564 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 565 | <code>    const searched = await gateway.searchExternalToolEntries({</code> | 声明局部标识符 `searched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 566 | <code>        query: 'ClinicalTrials NCT actual enrollment API',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 567 | <code>        limit: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 568 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 569 | <code>    const direct = searched.tools.find((entry) =&gt; entry.id === 'external__clinicaltrials__get_study');</code> | 声明局部标识符 `direct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 570 | <code>    assert.ok(direct, JSON.stringify(searched.tools, null, 2));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 571 | <code>    assert.equal(direct.callable, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 572 | <code>    assert.equal(direct.verification, 'builtin_public_readonly');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 573 | <code>    assert.equal(direct.call_pattern.tool, 'external__clinicaltrials__get_study');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 575 | <code>    const topicSearch = await gateway.searchExternalToolEntries({</code> | 声明局部标识符 `topicSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 576 | <code>        query: 'NIH clinical trial H. pylori acne vulgaris actual enrollment',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 577 | <code>        limit: 5</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 578 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>    const searchStudies = topicSearch.tools.find((entry) =&gt; (</code> | 声明局部标识符 `searchStudies`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 580 | <code>        entry.id === 'external__clinicaltrials__search_studies'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 581 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 582 | <code>    assert.ok(searchStudies, JSON.stringify(topicSearch.tools, null, 2));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 583 | <code>    assert.equal(searchStudies.callable, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 584 | <code>    assert.equal(searchStudies.call_pattern.tool, 'external__clinicaltrials__search_studies');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 585 | <code>    assert.deepEqual(Object.keys(searchStudies.spec.parameters.properties), ['query']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 586 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 587 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 588 | <code>test('Tool Acquisition Gateway executes approved OpenAPI adapter with env auth profile', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 589 | <code>    const workspaceRoot = await makeWorkspace('ailis-openapi-adapter-auth-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 590 | <code>    const previousToken = process.env.AILIS_TEST_OPENAPI_TOKEN;</code> | 声明局部标识符 `previousToken`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 591 | <code>    process.env.AILIS_TEST_OPENAPI_TOKEN = 'openapi-secret';</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 592 | <code>    const server = await withHttpServer((req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 593 | <code>        let body = '';</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 594 | <code>        req.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 595 | <code>            body += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 596 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 597 | <code>        req.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 598 | <code>            const url = new URL(req.url, 'http://127.0.0.1');</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 599 | <code>            res.setHeader('content-type', 'application/json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 600 | <code>            res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 601 | <code>                method: req.method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 602 | <code>                pathname: url.pathname,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 603 | <code>                auth: req.headers.authorization,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 604 | <code>                body: body ? JSON.parse(body) : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 605 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 606 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 607 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 608 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 609 | <code>        const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 610 | <code>            workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 611 | <code>            projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 612 | <code>            stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 613 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 614 | <code>        const profile = await gateway.configureExternalAuthProfile({</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 615 | <code>            authProfileId: 'local-openapi',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 616 | <code>            provider: 'openapi',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 617 | <code>            authType: 'bearer_env',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 618 | <code>            envVar: 'AILIS_TEST_OPENAPI_TOKEN'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 619 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 620 | <code>        assert.equal(profile.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 621 | <code>        assert.equal(profile.profile.envPresent, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 622 | <code>        assert.equal(JSON.stringify(profile).includes('openapi-secret'), false);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 623 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 624 | <code>        await gateway.bulkExposeExternalTools({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 625 | <code>            includeMcpRegistry: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 626 | <code>            includeInstalledMcp: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 627 | <code>            trustCallable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 628 | <code>            enableOpenApiAdapter: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 629 | <code>            authProfileId: 'local-openapi',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 630 | <code>            openapiOperations: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 631 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 632 | <code>                    operationId: 'createThing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 633 | <code>                    method: 'post',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 634 | <code>                    path: '/things',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 635 | <code>                    baseUrl: server.baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 636 | <code>                    summary: 'Create a thing.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 637 | <code>                    parameters: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 638 | <code>                    requestBody: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 639 | <code>                        required: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 640 | <code>                        content: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 641 | <code>                            'application/json': {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 642 | <code>                                schema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 643 | <code>                                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 644 | <code>                                    required: ['name'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 645 | <code>                                    properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 646 | <code>                                        name: { type: 'string', description: 'Thing name.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 647 | <code>                                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 648 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 649 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 650 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 651 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 652 | <code>                    whenToUse: ['Use for approved test creation.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 653 | <code>                    whenNotToUse: ['Do not use without user approval.'],</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 654 | <code>                    preconditions: ['Auth profile configured.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 655 | <code>                    examples: [{ body: { name: 'alpha' } }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 656 | <code>                    badExamples: [{}],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 657 | <code>                    alternatives: ['Use read-only lookup.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 658 | <code>                    errors: { auth_required: { recoverable: true } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 659 | <code>                    permissions: ['things.write']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 660 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 661 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 662 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 663 | <code>        const needsApproval = await gateway.executeExposedExternalTool({</code> | 声明局部标识符 `needsApproval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 664 | <code>            toolId: 'createThing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 665 | <code>            args: { body: { name: 'alpha' } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 666 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 667 | <code>        assert.equal(needsApproval.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 668 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 669 | <code>        const result = await gateway.executeExposedExternalTool({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 670 | <code>            toolId: 'createThing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 671 | <code>            args: { body: { name: 'alpha' } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 672 | <code>            approved: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 673 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 674 | <code>        assert.equal(result.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 675 | <code>        assert.equal(result.body.method, 'POST');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 676 | <code>        assert.equal(result.body.auth, 'Bearer openapi-secret');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 677 | <code>        assert.deepEqual(result.body.body, { name: 'alpha' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 678 | <code>        assert.equal(result.request.headers.Authorization, '__REDACTED__');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 679 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 680 | <code>        if (previousToken === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 681 | <code>            delete process.env.AILIS_TEST_OPENAPI_TOKEN;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 682 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 683 | <code>            process.env.AILIS_TEST_OPENAPI_TOKEN = previousToken;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 684 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 685 | <code>        await server.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 686 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 687 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 688 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 689 | <code>test('Tool Acquisition Gateway executes approved Composio adapter with scoped env auth', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 690 | <code>    const workspaceRoot = await makeWorkspace('ailis-composio-adapter-auth-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 691 | <code>    const previousToken = process.env.AILIS_TEST_COMPOSIO_KEY;</code> | 声明局部标识符 `previousToken`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 692 | <code>    process.env.AILIS_TEST_COMPOSIO_KEY = 'composio-secret';</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 693 | <code>    const requests = [];</code> | 声明局部标识符 `requests`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 694 | <code>    const server = await withHttpServer((req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 695 | <code>        let body = '';</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 696 | <code>        req.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 697 | <code>            body += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 698 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 699 | <code>        req.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 700 | <code>            requests.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 701 | <code>                method: req.method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 702 | <code>                url: req.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 703 | <code>                headers: req.headers,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 704 | <code>                body: body ? JSON.parse(body) : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 705 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 706 | <code>            res.setHeader('content-type', 'application/json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 707 | <code>            res.end(JSON.stringify({ ok: true, data: { id: 'email-1' } }));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 708 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 709 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 710 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 711 | <code>        const gateway = new AILISToolAcquisitionGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 712 | <code>            workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 713 | <code>            projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 714 | <code>            stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 715 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 716 | <code>        await gateway.configureExternalAuthProfile({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 717 | <code>            authProfileId: 'local-composio',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 718 | <code>            provider: 'composio',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 719 | <code>            authType: 'composio_api_key_env',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 720 | <code>            envVar: 'AILIS_TEST_COMPOSIO_KEY',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 721 | <code>            baseUrl: `${server.baseUrl}/api/v3`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 722 | <code>            userId: 'user-1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 723 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 724 | <code>        await gateway.bulkExposeExternalTools({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 725 | <code>            includeMcpRegistry: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 726 | <code>            includeInstalledMcp: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 727 | <code>            trustCallable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 728 | <code>            enableComposioAdapter: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 729 | <code>            authProfileId: 'local-composio',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 730 | <code>            composioTools: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 731 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 732 | <code>                    name: 'gmail_send_email',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 733 | <code>                    toolSlug: 'gmail_send_email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 734 | <code>                    description: 'Send an email using Gmail through Composio.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 735 | <code>                    inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 736 | <code>                        type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 737 | <code>                        required: ['to', 'subject', 'body'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 738 | <code>                        additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 739 | <code>                        properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 740 | <code>                            to: { type: 'string', description: 'Recipient email address.' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 741 | <code>                            subject: { type: 'string', description: 'Email subject.' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 742 | <code>                            body: { type: 'string', description: 'Email body.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 743 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 744 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 745 | <code>                    whenToUse: ['Use when Gmail OAuth is configured and the user approves sending.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 746 | <code>                    whenNotToUse: ['Do not send without user approval.'],</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 747 | <code>                    preconditions: ['Composio auth profile is configured.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 748 | <code>                    examples: [{ to: 'user@example.com', subject: 'Hello', body: 'Hi' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 749 | <code>                    badExamples: [{ subject: 'Missing recipient' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 750 | <code>                    alternatives: ['Use email.draft for approval-first workflow.'],</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 751 | <code>                    errors: { oauth_missing: { recoverable: true, nextActions: ['connect Gmail account'] } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 752 | <code>                    permissions: ['gmail.send']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 753 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 754 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 755 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 756 | <code>        const smoke = await gateway.smokeExposedExternalTool({ toolId: 'gmail_send_email' });</code> | 声明局部标识符 `smoke`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 757 | <code>        assert.equal(smoke.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 758 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 759 | <code>        const needsApproval = await gateway.executeExposedExternalTool({</code> | 声明局部标识符 `needsApproval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 760 | <code>            toolId: 'gmail_send_email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 761 | <code>            args: { to: 'user@example.com', subject: 'Hello', body: 'Hi' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 762 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 763 | <code>        assert.equal(needsApproval.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 764 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 765 | <code>        const result = await gateway.executeExposedExternalTool({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 766 | <code>            toolId: 'gmail_send_email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 767 | <code>            args: { to: 'user@example.com', subject: 'Hello', body: 'Hi' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 768 | <code>            approved: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 769 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 770 | <code>        assert.equal(result.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 771 | <code>        assert.equal(requests.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 772 | <code>        assert.equal(requests[0].method, 'POST');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 773 | <code>        assert.equal(requests[0].url, '/api/v3/tools/execute/gmail_send_email');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 774 | <code>        assert.equal(requests[0].headers['x-api-key'], 'composio-secret');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 775 | <code>        assert.deepEqual(requests[0].body, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 776 | <code>            arguments: { to: 'user@example.com', subject: 'Hello', body: 'Hi' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 777 | <code>            user_id: 'user-1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 778 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 779 | <code>        assert.equal(result.request.headers['x-api-key'], '__REDACTED__');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 780 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 781 | <code>        if (previousToken === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 782 | <code>            delete process.env.AILIS_TEST_COMPOSIO_KEY;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 783 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 784 | <code>            process.env.AILIS_TEST_COMPOSIO_KEY = previousToken;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 785 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 786 | <code>        await server.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 787 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 788 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 789 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 790 | <code>test('Capability Manager exposes contract compiler actions', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 791 | <code>    const workspaceRoot = await makeWorkspace('ailis-contract-capability-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 792 | <code>    const manager = new AILISCapabilityManager({</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 793 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 794 | <code>        projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 795 | <code>        auditDir: path.join(workspaceRoot, '.state'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 796 | <code>        skillRoot: path.join(workspaceRoot, 'skills')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 797 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 798 | <code>    const sources = await manager.execute({ action: 'list_contract_sources' });</code> | 声明局部标识符 `sources`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 799 | <code>    assert.equal(sources.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 800 | <code>    assert.ok(sources.details.sources.some((entry) =&gt; entry.id === 'openapi'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 801 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 802 | <code>    const compiled = await manager.execute({</code> | 声明局部标识符 `compiled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 803 | <code>        action: 'compile_contract',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 804 | <code>        sourceType: 'mcp_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 805 | <code>        server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 806 | <code>        rawContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 807 | <code>            name: 'run_python_file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 808 | <code>            description: 'Run a local Python file and return stdout/stderr.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 809 | <code>            inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 810 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 811 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 812 | <code>                    path: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 813 | <code>                    timeoutMs: { type: 'number' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 814 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 815 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 816 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 817 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 818 | <code>    assert.equal(compiled.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 819 | <code>    assert.equal(compiled.details.lint.approved, true, JSON.stringify(compiled.details.lint.issues));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 820 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 821 | <code>    const exposed = await manager.execute({</code> | 声明局部标识符 `exposed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 822 | <code>        action: 'bulk_expose_external_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 823 | <code>        includeInstalledMcp: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 824 | <code>        includeMcpRegistry: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 825 | <code>        openapiOperations: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 826 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 827 | <code>                operationId: 'githubGetRepo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 828 | <code>                method: 'get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 829 | <code>                path: '/repos/{owner}/{repo}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 830 | <code>                summary: 'Get GitHub repository metadata.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 831 | <code>                parameters: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 832 | <code>                    { name: 'owner', required: true, schema: { type: 'string' }, description: 'Repository owner.' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 833 | <code>                    { name: 'repo', required: true, schema: { type: 'string' }, description: 'Repository name.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 834 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 835 | <code>                whenToUse: ['Use for official GitHub repository metadata.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 836 | <code>                whenNotToUse: ['Do not use for local git status.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 837 | <code>                preconditions: ['GitHub API is reachable.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 838 | <code>                examples: [{ owner: 'openai', repo: 'codex' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 839 | <code>                badExamples: [{ owner: 'openai' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 840 | <code>                alternatives: ['Use code.git_status for local repositories.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 841 | <code>                errors: { not_found: { recoverable: false } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 842 | <code>                permissions: ['github.read']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 843 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 844 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 845 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 846 | <code>    assert.equal(exposed.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 847 | <code>    assert.equal(exposed.details.added, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 848 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 849 | <code>    const listed = await manager.execute({ action: 'list_exposed_external_tools' });</code> | 声明局部标识符 `listed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 850 | <code>    assert.equal(listed.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 851 | <code>    assert.equal(listed.details.total, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-contract-compiler 的契约与回归行为。”这一文件职责。 |
| 852 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
