# tests/ailis-tool-doctor.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-tool-doctor 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：144
- SHA-256：`6db9a122260cf3819a342218dbbb5684780827e2c64767bc4d2287fee452b201`
- 可运行副本：[打开源文件](../../../source/tests/ailis-tool-doctor.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-runtime.cjs`、`../electron/ailis-tool-doctor.cjs`
- 主要符号：`require`、`makeWorkspace`、`workspaceRoot`、`packageDir`、`doctor`、`result`、`ok`、`timeout`、`scorecard`、`repair`、`marked`、`runtime`、`health`、`classification`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 9 | <code>const { AILISRuntime } = require('../electron/ailis-runtime.cjs');</code> | 导入依赖 `../electron/ailis-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 10 | <code>const { AILISToolDoctor } = require('../electron/ailis-tool-doctor.cjs');</code> | 导入依赖 `../electron/ailis-tool-doctor.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>async function makeWorkspace(prefix) {</code> | 定义函数 `makeWorkspace`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    return await fs.mkdtemp(path.join(os.tmpdir(), prefix));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 14 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>test('Tool Doctor discovers MCP candidates from configs and local packages', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    const workspaceRoot = await makeWorkspace('ailis-tool-doctor-discovery-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    const packageDir = path.join(workspaceRoot, 'sample-mcp');</code> | 声明局部标识符 `packageDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    await fs.mkdir(packageDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    await fs.writeFile(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 21 | <code>        path.join(workspaceRoot, '.mcp.json'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 22 | <code>        JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 23 | <code>            mcpServers: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 24 | <code>                fixture_http: {</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 25 | <code>                    transport: 'http',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 26 | <code>                    url: 'http://127.0.0.1:9999/mcp',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 27 | <code>                    headers: { authorization: 'Bearer secret-token' }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 28 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>        'utf8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 32 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>    await fs.writeFile(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 34 | <code>        path.join(packageDir, 'package.json'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 35 | <code>        JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 36 | <code>            name: '@local/sample-mcp-server',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 37 | <code>            description: 'Sample MCP server for tests',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 38 | <code>            bin: { 'sample-mcp': 'bin/server.cjs' },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 39 | <code>            dependencies: { '@modelcontextprotocol/sdk': '^1.0.0' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 40 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>        'utf8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 42 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>    const doctor = new AILISToolDoctor({</code> | 声明局部标识符 `doctor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 45 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 46 | <code>        projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 47 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 48 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>    const result = await doctor.execute({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 50 | <code>        action: 'discover_mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 51 | <code>        paths: [workspaceRoot],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        githubRepos: ['https://github.com/example/example-mcp.git'],</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 53 | <code>        includeConfigured: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 54 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>    assert.equal(result.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 57 | <code>    assert.ok(result.details.candidates.some((candidate) =&gt; candidate.name === 'fixture_http'));</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 58 | <code>    assert.ok(result.details.candidates.some((candidate) =&gt; candidate.name === '@local/sample-mcp-server'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    assert.ok(result.details.candidates.some((candidate) =&gt; candidate.status === 'needs_local_checkout'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 60 | <code>    assert.ok(JSON.stringify(result.details.candidates).includes('__REDACTED__'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 61 | <code>    assert.ok(!JSON.stringify(result.details.candidates).includes('secret-token'));</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 62 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>test('Tool Doctor records scorecards and gates repair proposals without applying patches', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 65 | <code>    const workspaceRoot = await makeWorkspace('ailis-tool-doctor-scorecard-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 66 | <code>    const doctor = new AILISToolDoctor({</code> | 声明局部标识符 `doctor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 67 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 68 | <code>        projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 69 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 70 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>    const ok = await doctor.execute({</code> | 声明局部标识符 `ok`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        action: 'record_observation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        tool: 'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 75 | <code>        status: 'success',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 76 | <code>        latencyMs: 120</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 77 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>    assert.equal(ok.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>    const timeout = await doctor.execute({</code> | 声明局部标识符 `timeout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 81 | <code>        action: 'record_observation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 82 | <code>        tool: 'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 83 | <code>        status: 'timeout',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 84 | <code>        latencyMs: 25000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 85 | <code>        errorCode: 'timeout'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 86 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>    assert.equal(timeout.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>    const scorecard = await doctor.execute({ action: 'scorecard', tool: 'mcp_bridge' });</code> | 声明局部标识符 `scorecard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 90 | <code>    assert.equal(scorecard.details.tools[0].total, 2);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 91 | <code>    assert.equal(scorecard.details.tools[0].timeout, 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 92 | <code>    assert.equal(scorecard.details.tools[0].commonErrors[0].code, 'timeout');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>    const repair = await doctor.execute({</code> | 声明局部标识符 `repair`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 95 | <code>        action: 'propose_repair',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 96 | <code>        tool: 'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 97 | <code>        title: 'Add timeout recovery for MCP calls',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 98 | <code>        reason: 'Scorecard shows repeated timeouts.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 99 | <code>        candidateDiff: 'diff --git a/file b/file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 100 | <code>        validationCommands: ['pnpm ailis:mcp-soak']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 101 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>    assert.equal(repair.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    assert.equal(repair.details.repair.applied, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 104 | <code>    assert.equal(repair.details.repair.gate.status, 'proposal_only');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>    const marked = await doctor.execute({</code> | 声明局部标识符 `marked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 107 | <code>        action: 'mark_repair',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 108 | <code>        id: repair.details.repair.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        status: 'verified',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 110 | <code>        validationReport: 'mcp soak passed'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 111 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>    assert.equal(marked.details.repair.status, 'verified');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 113 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>test('AILIS runtime exposes Tool Doctor as a runtime tool', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 116 | <code>    const workspaceRoot = await makeWorkspace('ailis-tool-doctor-runtime-');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 117 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 118 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 119 | <code>        projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 120 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 121 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 124 | <code>        assert.equal(runtime.canExecuteTool('tool_doctor'), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 125 | <code>        assert.ok(runtime.getStatus().capabilities.includes('tool_doctor_health_checks'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>        const health = await runtime.executeTool('tool_doctor', { action: 'health_check', includeMcp: false }, {</code> | 声明局部标识符 `health`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 128 | <code>            runId: 'doctor-run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 129 | <code>            sessionId: 'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 130 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>        assert.equal(health.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 132 | <code>        assert.ok(health.details.contractCount &gt;= 10);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>        const classification = runtime.classifyToolCall({</code> | 声明局部标识符 `classification`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 135 | <code>            toolId: 'tool_doctor',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 136 | <code>            args: { action: 'propose_repair' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 137 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>        assert.equal(classification.class, 'tool_health');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 139 | <code>        assert.equal(classification.mutates, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 140 | <code>        assert.equal(classification.requiresApprovalCapable, false);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 141 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 142 | <code>        await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-tool-doctor 的契约与回归行为。”这一文件职责。 |
| 143 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
