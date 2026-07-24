# tests/ailis-file-manager-tool.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：文件管理工具：受路径保护地读取、写入、移动或检查本地文件。
- 文件类型：`source-code`
- 原始行数：143
- SHA-256：`49108653bcae24348c731c747071b98bdee439af74cfdd0754d00c839a1cfe70`
- 可运行副本：[打开源文件](../../../source/tests/ailis-file-manager-tool.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-gateway.cjs`、`../electron/ailis-file-manager-tool.cjs`
- 主要符号：`require`、`jsonFetch`、`response`、`body`、`callTool`、`runAgent`、`targets`、`workspaceRoot`、`gateway`、`junkFile`、`photoFile`、`status`、`baseUrl`、`tools`、`schema`、`scan`、`cleanPlan`、`cleanNeedsApproval`、`clean`、`organizePlan`、`classifyCleanup`、`audit`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 5 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 9 | <code>const { AILISGateway } = require('../electron/ailis-gateway.cjs');</code> | 导入依赖 `../electron/ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 10 | <code>const { getProfileTargets } = require('../electron/ailis-file-manager-tool.cjs');</code> | 导入依赖 `../electron/ailis-file-manager-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>async function jsonFetch(url, options = {}) {</code> | 定义函数 `jsonFetch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 13 | <code>    const response = await fetch(url, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 14 | <code>        ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 15 | <code>        headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 16 | <code>            'content-type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 17 | <code>            ...(options.headers &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 18 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 19 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 20 | <code>    const body = await response.json();</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 21 | <code>    return { response, body };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 22 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>async function callTool(baseUrl, payload) {</code> | 定义函数 `callTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 25 | <code>    return await jsonFetch(`${baseUrl}/tools/call`, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 26 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 27 | <code>        body: JSON.stringify(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 28 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>async function runAgent(baseUrl, payload) {</code> | 定义函数 `runAgent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 32 | <code>    return await jsonFetch(`${baseUrl}/agent/run`, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 33 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 34 | <code>        body: JSON.stringify(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 35 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 36 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>test('AILIS file manager profiles expose safe C drive cleanup targets', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 39 | <code>    const targets = getProfileTargets('c_drive_safe', {</code> | 声明局部标识符 `targets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 40 | <code>        workspaceRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 41 | <code>        workspaceDir: path.resolve('.')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 42 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>    assert.ok(targets.length &gt;= 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 44 | <code>    assert.ok(!targets.some((target) =&gt; /^[A-Za-z]:\\?$/i.test(target)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 45 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>test('AILIS Gateway scans, plans, quarantines, and organizes files safely', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 48 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-file-manager-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 49 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 50 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 51 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 52 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 53 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 54 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>    const junkFile = path.join(workspaceRoot, 'old.tmp');</code> | 声明局部标识符 `junkFile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 57 | <code>    const photoFile = path.join(workspaceRoot, 'photo.jpg');</code> | 声明局部标识符 `photoFile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 58 | <code>    await fs.writeFile(junkFile, 'junk');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 59 | <code>    await fs.writeFile(photoFile, 'image');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 62 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 63 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>        const tools = await jsonFetch(`${baseUrl}/tools`);</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 66 | <code>        assert.equal(tools.body.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 67 | <code>        assert.ok(tools.body.localTools.some((tool) =&gt; tool.id === 'file_manager'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>        const schema = await callTool(baseUrl, {</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 70 | <code>            tool: 'file_manager',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 71 | <code>            args: { action: 'schema' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 72 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 73 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>        assert.equal(schema.body.ok, true, schema.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 75 | <code>        assert.match(JSON.stringify(schema.body.result.details), /schema/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>        const scan = await callTool(baseUrl, {</code> | 声明局部标识符 `scan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 78 | <code>            tool: 'file_manager',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 79 | <code>            args: { action: 'scan', target: workspaceRoot, minAgeDays: 0 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 80 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 81 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 82 | <code>        assert.equal(scan.body.ok, true, scan.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 83 | <code>        assert.ok(scan.body.result.details.candidates.some((candidate) =&gt; candidate.path.endsWith('old.tmp')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>        const cleanPlan = await callTool(baseUrl, {</code> | 声明局部标识符 `cleanPlan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 86 | <code>            tool: 'file_manager',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 87 | <code>            args: { action: 'clean', target: workspaceRoot, minAgeDays: 0, dryRun: true },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 88 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 89 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>        assert.equal(cleanPlan.body.ok, true, cleanPlan.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 91 | <code>        assert.equal(cleanPlan.body.result.details.dryRun, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>        const cleanNeedsApproval = await callTool(baseUrl, {</code> | 声明局部标识符 `cleanNeedsApproval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 94 | <code>            tool: 'file_manager',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 95 | <code>            args: { action: 'clean', target: workspaceRoot, minAgeDays: 0, dryRun: false },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 96 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 97 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>        assert.equal(cleanNeedsApproval.body.ok, false);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 99 | <code>        assert.equal(cleanNeedsApproval.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>        const clean = await callTool(baseUrl, {</code> | 声明局部标识符 `clean`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 102 | <code>            tool: 'file_manager',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 103 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 104 | <code>                action: 'clean',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 105 | <code>                target: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 106 | <code>                minAgeDays: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 107 | <code>                dryRun: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 108 | <code>                quarantineDir: path.join(workspaceRoot, '.quarantine')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 109 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>            context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 111 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>        assert.equal(clean.body.ok, true, clean.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 113 | <code>        assert.equal(clean.body.result.details.mode, 'quarantine');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 114 | <code>        await assert.rejects(() =&gt; fs.access(junkFile));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 115 | <code>        assert.equal(clean.body.result.details.moved.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>        const organizePlan = await callTool(baseUrl, {</code> | 声明局部标识符 `organizePlan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 118 | <code>            tool: 'file_manager',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 119 | <code>            args: { action: 'organize', source: workspaceRoot, destination: path.join(workspaceRoot, 'Organized'), dryRun: true },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 120 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 121 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>        assert.equal(organizePlan.body.ok, true, organizePlan.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 123 | <code>        assert.equal(organizePlan.body.result.details.dryRun, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 124 | <code>        assert.ok(organizePlan.body.result.details.plan.some((item) =&gt; item.bucket === 'Images'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>        const classifyCleanup = await runAgent(baseUrl, {</code> | 声明局部标识符 `classifyCleanup`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 127 | <code>            sessionId: 'file-manager-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 128 | <code>            message: '清理 C盘垃圾文件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 129 | <code>            classifyOnly: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 130 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>        assert.equal(classifyCleanup.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 132 | <code>        assert.equal(classifyCleanup.body.intent, 'file_management');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 133 | <code>        assert.equal(classifyCleanup.body.plan[0].tool, 'file_manager');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 134 | <code>        assert.equal(classifyCleanup.body.plan[0].args.profile, 'c_drive_safe');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 135 | <code>        assert.equal(classifyCleanup.body.plan[0].args.dryRun, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>        const audit = await jsonFetch(`${baseUrl}/audit?limit=30`);</code> | 声明局部标识符 `audit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 138 | <code>        assert.equal(audit.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 139 | <code>        assert.ok(audit.body.entries.some((entry) =&gt; entry.tool === 'file_manager'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 140 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 141 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 142 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
