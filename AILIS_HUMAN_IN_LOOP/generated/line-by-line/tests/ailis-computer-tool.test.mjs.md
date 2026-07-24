# tests/ailis-computer-tool.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：电脑操作工具：在审批和安全边界内执行桌面观察与交互。
- 文件类型：`source-code`
- 原始行数：420
- SHA-256：`f84bde42089b098c3cc784c02631266cb17bb7fe2a1ab1fe4faef7eb626f1692`
- 可运行副本：[打开源文件](../../../source/tests/ailis-computer-tool.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-gateway.cjs`、`../electron/ailis-computer-tool.cjs`、`../electron/ailis-platform-adapter.cjs`、`fs`
- 主要符号：`require`、`jsonFetch`、`response`、`body`、`callTool`、`runAgent`、`workspaceRoot`、`platformAdapter`、`tool`、`schema`、`screenshot`、`clickNeedsApproval`、`click`、`clipboardRead`、`clipboardWrite`、`result`、`gateway`、`status`、`baseUrl`、`tools`、`writeBlocked`、`write`、`read`、`binaryRead`、`list`、`search`、`copyNeedsApproval`、`copy`、`execNeedsApproval`、`exec`、`execWithArgs`、`silentExec`、`session`、`sessionId`、`processRead`、`attempt`、`unifiedNeedsApproval`、`unifiedExec`、`unifiedPoll`、`unifiedKilled`、`processList`、`killNeedsApproval`、`killed`、`classifyList`、`classifyProcess`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 5 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 9 | <code>const { AILISGateway } = require('../electron/ailis-gateway.cjs');</code> | 导入依赖 `../electron/ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 10 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 11 | <code>    AILISComputerTool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 12 | <code>    resolveTargetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 13 | <code>    commonUserRoots</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 14 | <code>} = require('../electron/ailis-computer-tool.cjs');</code> | 导入依赖 `../electron/ailis-computer-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 15 | <code>const { AILISPlatformAdapter } = require('../electron/ailis-platform-adapter.cjs');</code> | 导入依赖 `../electron/ailis-platform-adapter.cjs`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>async function jsonFetch(url, options = {}) {</code> | 定义函数 `jsonFetch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 18 | <code>    const response = await fetch(url, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 19 | <code>        ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 20 | <code>        headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 21 | <code>            'content-type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 22 | <code>            ...(options.headers &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 23 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 24 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 25 | <code>    const body = await response.json();</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 26 | <code>    return { response, body };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 27 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>async function callTool(baseUrl, payload) {</code> | 定义函数 `callTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 30 | <code>    return await jsonFetch(`${baseUrl}/tools/call`, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 31 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 32 | <code>        body: JSON.stringify(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 33 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>async function runAgent(baseUrl, payload) {</code> | 定义函数 `runAgent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 37 | <code>    return await jsonFetch(`${baseUrl}/agent/run`, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 38 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 39 | <code>        body: JSON.stringify(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 40 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>test('AILIS computer path helpers resolve workspace and common roots', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 44 | <code>    const workspaceRoot = path.resolve('.');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 45 | <code>    assert.equal(resolveTargetPath('note.txt', { workspaceDir: workspaceRoot }), path.join(workspaceRoot, 'note.txt'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 46 | <code>    assert.ok(commonUserRoots({ workspaceRoot, workspaceDir: workspaceRoot }).some((entry) =&gt; entry === workspaceRoot));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 47 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>test('AILIS computer tool exposes OSWorld-style GUI actions through the platform adapter', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 50 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-computer-gui-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 51 | <code>    const platformAdapter = new AILISPlatformAdapter({ platform: 'win32' });</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 52 | <code>    platformAdapter.desktopScreenshotCommand = ({ outputPath }) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 53 | <code>        supported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 54 | <code>        command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 55 | <code>        args: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 56 | <code>            '-e',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 57 | <code>            `require('fs').mkdirSync(require('path').dirname(${JSON.stringify(outputPath)}), { recursive: true }); require('fs').writeFileSync(${JSON.stringify(outputPath)}, 'png'); console.log(JSON.stringify({ ok: true, path: ${JSON.stringify(outputPath)}, width: 2, height: 2 }));`</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 58 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 59 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>    platformAdapter.guiInputCommand = ({ action }) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 61 | <code>        supported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 62 | <code>        command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 63 | <code>        args: ['-e', `console.log(JSON.stringify({ ok: true, action: ${JSON.stringify(action)} }))`]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 64 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>    platformAdapter.clipboardReadCommand = () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 66 | <code>        supported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 67 | <code>        command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 68 | <code>        args: ['-e', 'console.log(JSON.stringify({ ok: true, text: "clipboard text" }))']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 69 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>    platformAdapter.clipboardWriteCommand = ({ text }) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 71 | <code>        supported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 72 | <code>        command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 73 | <code>        args: ['-e', `console.log(JSON.stringify({ ok: true, bytes: ${Buffer.byteLength(text, 'utf8')} }))`]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 74 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>    const tool = new AILISComputerTool({</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 77 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 78 | <code>        platformAdapter</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 79 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 82 | <code>        const schema = await tool.execute({ action: 'schema' }, {}, { workspaceRoot, platformAdapter });</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 83 | <code>        assert.ok(schema.details.schema.actions.includes('screen_screenshot'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 84 | <code>        assert.ok(schema.details.schema.actions.includes('mouse_click'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 85 | <code>        assert.equal(schema.details.schema.safety.guiInput, 'windows-powershell-user32');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>        const screenshot = await tool.execute(</code> | 声明局部标识符 `screenshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 88 | <code>            { action: 'screen_screenshot', path: 'screen.png' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 89 | <code>            { workspace: workspaceRoot },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 90 | <code>            { workspaceRoot, workspaceDir: workspaceRoot, platformAdapter }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 91 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>        assert.equal(screenshot.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 93 | <code>        assert.equal(screenshot.details.width, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 94 | <code>        assert.ok(screenshot.content.some((entry) =&gt; entry.type === 'image'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>        const clickNeedsApproval = await tool.execute(</code> | 声明局部标识符 `clickNeedsApproval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 97 | <code>            { action: 'mouse_click', x: 10, y: 12 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 98 | <code>            { workspace: workspaceRoot },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 99 | <code>            { workspaceRoot, platformAdapter }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 100 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>        assert.equal(clickNeedsApproval.details.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>        const click = await tool.execute(</code> | 声明局部标识符 `click`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 104 | <code>            { action: 'click', x: 10, y: 12 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 105 | <code>            { workspace: workspaceRoot, approved: true },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 106 | <code>            { workspaceRoot, platformAdapter }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 107 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>        assert.equal(click.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 109 | <code>        assert.equal(click.details.action, 'mouse_click');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>        const clipboardRead = await tool.execute(</code> | 声明局部标识符 `clipboardRead`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 112 | <code>            { action: 'clipboard_read' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 113 | <code>            { workspace: workspaceRoot },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 114 | <code>            { workspaceRoot, platformAdapter }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 115 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 116 | <code>        assert.equal(clipboardRead.details.text, 'clipboard text');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>        const clipboardWrite = await tool.execute(</code> | 声明局部标识符 `clipboardWrite`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 119 | <code>            { action: 'clipboard_write', text: 'hello' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 120 | <code>            { workspace: workspaceRoot, approved: true },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 121 | <code>            { workspaceRoot, platformAdapter }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 122 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>        assert.equal(clipboardWrite.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 124 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 125 | <code>        await tool.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 126 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>test('AILIS computer exec_command delegates process spawn through the platform adapter', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 130 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-computer-spawn-adapter-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 131 | <code>    const platformAdapter = new AILISPlatformAdapter({</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 132 | <code>        platform: 'android',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 133 | <code>        hostPlatform: process.platform</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 134 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>    platformAdapter.commandSpawnSpec = (command, { cwd, env } = {}) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 136 | <code>        supported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 137 | <code>        command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 138 | <code>        args: ['-e', `console.log('ADAPTER_SPAWN:' + ${JSON.stringify(command)})`],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 139 | <code>        options: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 140 | <code>            cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 141 | <code>            shell: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 142 | <code>            windowsHide: process.platform === 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 143 | <code>            env: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 144 | <code>                ...process.env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 145 | <code>                ...(env &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 146 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>    const tool = new AILISComputerTool({</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 151 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 152 | <code>        platformAdapter</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 153 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 156 | <code>        const result = await tool.execute(</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 157 | <code>            { action: 'exec_command', command: 'echo from-device', yield_time_ms: 3000, max_output_tokens: 1000 },</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 158 | <code>            { workspace: workspaceRoot, approved: true },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 159 | <code>            { workspaceRoot, workspaceDir: workspaceRoot, platformAdapter }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 160 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>        assert.equal(result.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 162 | <code>        assert.match(result.details.output, /ADAPTER_SPAWN:echo from-device/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 163 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 164 | <code>        await tool.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 165 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 168 | <code>test('AILIS computer tool provides filesystem and process control with approval gates', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 169 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-computer-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 170 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 171 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 172 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 173 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 174 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 175 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 178 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 179 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>        const tools = await jsonFetch(`${baseUrl}/tools`);</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 182 | <code>        assert.equal(tools.body.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 183 | <code>        assert.ok(tools.body.localTools.some((tool) =&gt; tool.id === 'computer'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>        const schema = await callTool(baseUrl, {</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 186 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 187 | <code>            args: { action: 'schema' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 188 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 189 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>        assert.equal(schema.body.ok, true, schema.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 191 | <code>        assert.equal(schema.body.result.details.schema.safety.platform.capabilities.pty, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 192 | <code>        assert.equal(schema.body.result.details.schema.safety.platform.capabilities.shell, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>        const writeBlocked = await callTool(baseUrl, {</code> | 声明局部标识符 `writeBlocked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 195 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 196 | <code>            args: { action: 'write', path: 'note.txt', content: 'hello computer\n' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 197 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 198 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>        assert.equal(writeBlocked.body.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 200 | <code>        assert.equal(writeBlocked.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>        const write = await callTool(baseUrl, {</code> | 声明局部标识符 `write`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 203 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 204 | <code>            args: { action: 'write', path: 'note.txt', content: 'hello computer\n' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 205 | <code>            context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 206 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>        assert.equal(write.body.ok, true, write.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 208 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 209 | <code>        const read = await callTool(baseUrl, {</code> | 声明局部标识符 `read`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 210 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 211 | <code>            args: { action: 'read', path: 'note.txt' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 212 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 213 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>        assert.equal(read.body.ok, true, read.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 215 | <code>        assert.match(read.body.result.content[0].text, /hello computer/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>        await fs.writeFile(path.join(workspaceRoot, 'sample.docx'), Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00]));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 218 | <code>        const binaryRead = await callTool(baseUrl, {</code> | 声明局部标识符 `binaryRead`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 219 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 220 | <code>            args: { action: 'read', path: 'sample.docx' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 221 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 222 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 223 | <code>        assert.equal(binaryRead.body.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 224 | <code>        assert.equal(binaryRead.body.status, 'binary_file');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 225 | <code>        assert.match(binaryRead.body.result.details.suggestedNext.query, /Word\/DOCX document/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 227 | <code>        const list = await callTool(baseUrl, {</code> | 声明局部标识符 `list`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 228 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 229 | <code>            args: { action: 'list', path: '.' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 230 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 231 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>        assert.equal(list.body.ok, true, list.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 233 | <code>        assert.ok(list.body.result.details.entries.some((entry) =&gt; entry.name === 'note.txt'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>        const search = await callTool(baseUrl, {</code> | 声明局部标识符 `search`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 236 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 237 | <code>            args: { action: 'search', path: '.', name: '*.txt' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 238 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 239 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>        assert.equal(search.body.ok, true, search.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 241 | <code>        assert.ok(search.body.result.details.results.some((entry) =&gt; entry.path.endsWith('note.txt')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>        const copyNeedsApproval = await callTool(baseUrl, {</code> | 声明局部标识符 `copyNeedsApproval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 244 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 245 | <code>            args: { action: 'copy', source: 'note.txt', target: 'copy.txt' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 246 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 247 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 248 | <code>        assert.equal(copyNeedsApproval.body.ok, false);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 249 | <code>        assert.equal(copyNeedsApproval.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>        const copy = await callTool(baseUrl, {</code> | 声明局部标识符 `copy`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 252 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 253 | <code>            args: { action: 'copy', source: 'note.txt', target: 'copy.txt' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 254 | <code>            context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 255 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>        assert.equal(copy.body.ok, true, copy.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 258 | <code>        const execNeedsApproval = await callTool(baseUrl, {</code> | 声明局部标识符 `execNeedsApproval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 259 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 260 | <code>            args: { action: 'exec', command: 'node -e "console.log(1)"' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 261 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 262 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>        assert.equal(execNeedsApproval.body.ok, false);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 264 | <code>        assert.equal(execNeedsApproval.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 266 | <code>        const exec = await callTool(baseUrl, {</code> | 声明局部标识符 `exec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 267 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 268 | <code>            args: { action: 'exec', command: 'node -e "console.log(\'COMPUTER_EXEC_OK\')"', timeoutMs: 10000 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 269 | <code>            context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 270 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>        assert.equal(exec.body.ok, true, exec.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 272 | <code>        assert.match(exec.body.result.details.stdout, /COMPUTER_EXEC_OK/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>        const execWithArgs = await callTool(baseUrl, {</code> | 声明局部标识符 `execWithArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 275 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 276 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 277 | <code>                action: 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 278 | <code>                command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 279 | <code>                args: ['-e', "console.log('COMPUTER_EXEC_ARGS_OK')"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 280 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 281 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>            context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 283 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>        assert.equal(execWithArgs.body.ok, true, execWithArgs.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 285 | <code>        assert.match(execWithArgs.body.result.details.stdout, /COMPUTER_EXEC_ARGS_OK/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 286 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 287 | <code>        const silentExec = await callTool(baseUrl, {</code> | 声明局部标识符 `silentExec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 288 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 289 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 290 | <code>                action: 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 291 | <code>                command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 292 | <code>                args: ['-e', 'process.exit(0)'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 293 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 294 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 295 | <code>            context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 296 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>        assert.equal(silentExec.body.ok, true, silentExec.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 298 | <code>        assert.equal(silentExec.body.result.details.outputEmpty, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 299 | <code>        assert.match(silentExec.body.result.content[0].text, /stdout=&lt;empty&gt;/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>        const session = await callTool(baseUrl, {</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 302 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 303 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 304 | <code>                action: 'session_start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 305 | <code>                command: 'node -e "console.log(\'SESSION_READY\'); setTimeout(function(){}, 30000)"',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 306 | <code>                timeoutMs: 60000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 307 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 308 | <code>            context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 309 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>        assert.equal(session.body.ok, true, session.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 311 | <code>        const sessionId = session.body.result.details.session.id;</code> | 声明局部标识符 `sessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 312 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 313 | <code>        let processRead = null;</code> | 声明局部标识符 `processRead`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 314 | <code>        for (let attempt = 0; attempt &lt; 10; attempt += 1) {</code> | 声明局部标识符 `attempt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 315 | <code>            await new Promise((resolve) =&gt; setTimeout(resolve, 500));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 316 | <code>            processRead = await callTool(baseUrl, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 317 | <code>                tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 318 | <code>                args: { action: 'process_read', sessionId },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 319 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 320 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 321 | <code>            if (/SESSION_READY/.test(processRead.body.result?.details?.session?.stdout &#124;&#124; '')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 322 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 323 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 324 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>        assert.equal(processRead.body.ok, true, processRead.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 326 | <code>        assert.match(processRead.body.result.details.session.stdout, /SESSION_READY/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>        const unifiedNeedsApproval = await callTool(baseUrl, {</code> | 声明局部标识符 `unifiedNeedsApproval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 329 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 330 | <code>            args: { action: 'exec_command', cmd: 'node -e "console.log(1)"', yield_time_ms: 100 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 331 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 332 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>        assert.equal(unifiedNeedsApproval.body.ok, false);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 334 | <code>        assert.equal(unifiedNeedsApproval.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>        const unifiedExec = await callTool(baseUrl, {</code> | 声明局部标识符 `unifiedExec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 337 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 338 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 339 | <code>                action: 'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 340 | <code>                cmd: 'node -e "console.log(\'UNIFIED_READY\'); setTimeout(function(){}, 30000)"',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 341 | <code>                yield_time_ms: 300,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 342 | <code>                max_output_tokens: 2000</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 343 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 344 | <code>            context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 345 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 346 | <code>        assert.equal(unifiedExec.body.ok, true, unifiedExec.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 347 | <code>        assert.ok(unifiedExec.body.result.details.session_id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 348 | <code>        assert.equal(unifiedExec.body.result.details.exit_code, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 349 | <code>        assert.equal(typeof unifiedExec.body.result.details.original_token_count, 'number');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>        let unifiedPoll = null;</code> | 声明局部标识符 `unifiedPoll`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 352 | <code>        for (let attempt = 0; attempt &lt; 10; attempt += 1) {</code> | 声明局部标识符 `attempt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 353 | <code>            unifiedPoll = await callTool(baseUrl, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 354 | <code>                tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 355 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 356 | <code>                    action: 'write_stdin',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 357 | <code>                    session_id: unifiedExec.body.result.details.session_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 358 | <code>                    chars: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 359 | <code>                    yield_time_ms: 300,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 360 | <code>                    max_output_tokens: 2000</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 361 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>                context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 363 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 364 | <code>            if (/UNIFIED_READY/.test(unifiedPoll.body.result?.details?.output &#124;&#124; '')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 365 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 366 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 367 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>        assert.equal(unifiedPoll.body.ok, true, unifiedPoll.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 369 | <code>        assert.match(unifiedPoll.body.result.details.output, /UNIFIED_READY/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 370 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 371 | <code>        const unifiedKilled = await callTool(baseUrl, {</code> | 声明局部标识符 `unifiedKilled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 372 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 373 | <code>            args: { action: 'process_kill', sessionId: unifiedExec.body.result.details.session_id },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 374 | <code>            context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 375 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 376 | <code>        assert.equal(unifiedKilled.body.ok, true, unifiedKilled.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 378 | <code>        const processList = await callTool(baseUrl, {</code> | 声明局部标识符 `processList`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 379 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 380 | <code>            args: { action: 'process_list' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 381 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 382 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 383 | <code>        assert.equal(processList.body.ok, true, processList.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 384 | <code>        assert.ok(processList.body.result.details.sessions.some((entry) =&gt; entry.id === sessionId));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 385 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 386 | <code>        const killNeedsApproval = await callTool(baseUrl, {</code> | 声明局部标识符 `killNeedsApproval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 387 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 388 | <code>            args: { action: 'process_kill', sessionId },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 389 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 390 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 391 | <code>        assert.equal(killNeedsApproval.body.ok, false);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 392 | <code>        assert.equal(killNeedsApproval.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 394 | <code>        const killed = await callTool(baseUrl, {</code> | 声明局部标识符 `killed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 395 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 396 | <code>            args: { action: 'process_kill', sessionId },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 397 | <code>            context: { workspace: workspaceRoot, approved: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 398 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 399 | <code>        assert.equal(killed.body.ok, true, killed.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 400 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 401 | <code>        const classifyList = await runAgent(baseUrl, {</code> | 声明局部标识符 `classifyList`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 402 | <code>            sessionId: 'computer-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 403 | <code>            message: '列出目录 .',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 404 | <code>            classifyOnly: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 405 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 406 | <code>        assert.equal(classifyList.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 407 | <code>        assert.equal(classifyList.body.intent, 'computer_operation');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 408 | <code>        assert.equal(classifyList.body.plan[0].tool, 'computer');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 409 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 410 | <code>        const classifyProcess = await runAgent(baseUrl, {</code> | 声明局部标识符 `classifyProcess`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 411 | <code>            sessionId: 'computer-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 412 | <code>            message: '后台运行 node -v',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 413 | <code>            classifyOnly: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 414 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>        assert.equal(classifyProcess.body.intent, 'computer_operation');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 416 | <code>        assert.equal(classifyProcess.body.plan[0].args.action, 'session_start');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 417 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 418 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“电脑操作工具：在审批和安全边界内执行桌面观察与交互。”这一文件职责。 |
| 419 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 420 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
