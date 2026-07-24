# tests/ailis-computer-advanced-tool.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：139
- SHA-256：`935cfd72002034e97f2fb9d55247d2885b8388ded67cf39278df72118487c4de`
- 可运行副本：[打开源文件](../../../source/tests/ailis-computer-advanced-tool.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-computer-tool.cjs`、`../electron/ailis-output-store.cjs`、`node:fs`
- 主要符号：`require`、`workspaceRoot`、`tool`、`runtime`、`schema`、`binaryBlocked`、`binaryWrite`、`binaryRead`、`changed`、`rollbackId`、`rollbackList`、`restored`、`restoredText`、`watch`、`watchId`、`polled`、`watchStopBlocked`、`watchStop`、`acl`、`ptyStatus`、`ptyDryRun`、`outputStore`、`workbenchRoot`、`scriptsDir`、`outputsDir`、`inputsDir`、`inputPath`、`scriptPath`、`answerPath`、`input`、`i`、`answer`、`executed`、`searched`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 9 | <code>const { AILISComputerTool } = require('../electron/ailis-computer-tool.cjs');</code> | 导入依赖 `../electron/ailis-computer-tool.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 10 | <code>const { AILISOutputStore } = require('../electron/ailis-output-store.cjs');</code> | 导入依赖 `../electron/ailis-output-store.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>test('AILIS computer advanced layer covers binary, rollback, watch, ACL, and optional PTY', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-computer-advanced-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    const tool = new AILISComputerTool({ workspaceRoot });</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    const runtime = { workspaceRoot, workspaceDir: workspaceRoot };</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 18 | <code>        const schema = await tool.execute({ action: 'schema' }, {}, runtime);</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 19 | <code>        assert.equal(schema.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 20 | <code>        assert.ok(schema.details.schema.actions.includes('read_binary'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 21 | <code>        assert.ok(schema.details.schema.actions.includes('watch_start'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 22 | <code>        assert.ok(schema.details.schema.actions.includes('rollback_restore'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>        const binaryBlocked = await tool.execute({</code> | 声明局部标识符 `binaryBlocked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 25 | <code>            action: 'write_binary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 26 | <code>            path: 'bin.dat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 27 | <code>            dataBase64: Buffer.from('hello-binary').toString('base64')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 28 | <code>        }, {}, runtime);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 29 | <code>        assert.equal(binaryBlocked.details.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>        const binaryWrite = await tool.execute({</code> | 声明局部标识符 `binaryWrite`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 32 | <code>            action: 'write_binary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 33 | <code>            path: 'bin.dat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 34 | <code>            dataBase64: Buffer.from('hello-binary').toString('base64')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 35 | <code>        }, { approved: true }, runtime);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 36 | <code>        assert.equal(binaryWrite.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>        const binaryRead = await tool.execute({ action: 'read_binary', path: 'bin.dat', length: 5 }, {}, runtime);</code> | 声明局部标识符 `binaryRead`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 39 | <code>        assert.equal(binaryRead.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 40 | <code>        assert.equal(Buffer.from(binaryRead.details.dataBase64, 'base64').toString('utf8'), 'hello');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>        await tool.execute({ action: 'write', path: 'note.txt', content: 'before' }, { approved: true }, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 43 | <code>        const changed = await tool.execute({ action: 'write', path: 'note.txt', content: 'after' }, { approved: true }, runtime);</code> | 声明局部标识符 `changed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 44 | <code>        const rollbackId = changed.details.rollback.id;</code> | 声明局部标识符 `rollbackId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 45 | <code>        assert.ok(rollbackId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>        const rollbackList = await tool.execute({ action: 'rollback_list' }, {}, runtime);</code> | 声明局部标识符 `rollbackList`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 48 | <code>        assert.ok(rollbackList.details.entries.some((entry) =&gt; entry.id === rollbackId));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>        const restored = await tool.execute({ action: 'rollback_restore', id: rollbackId }, { approved: true }, runtime);</code> | 声明局部标识符 `restored`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 51 | <code>        assert.equal(restored.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        const restoredText = await fs.readFile(path.join(workspaceRoot, 'note.txt'), 'utf8');</code> | 声明局部标识符 `restoredText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 53 | <code>        assert.equal(restoredText, 'before');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>        const watch = await tool.execute({ action: 'watch_start', path: '.', maxEvents: 50 }, {}, runtime);</code> | 声明局部标识符 `watch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 56 | <code>        assert.equal(watch.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 57 | <code>        const watchId = watch.details.watcher.id;</code> | 声明局部标识符 `watchId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 58 | <code>        await fs.writeFile(path.join(workspaceRoot, 'watched.txt'), 'watch-me', 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 59 | <code>        await new Promise((resolve) =&gt; setTimeout(resolve, 700));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 60 | <code>        const polled = await tool.execute({ action: 'watch_poll', id: watchId }, {}, runtime);</code> | 声明局部标识符 `polled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 61 | <code>        assert.equal(polled.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 62 | <code>        assert.ok(polled.details.events.some((event) =&gt; String(event.filename &#124;&#124; event.path).includes('watched.txt')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 63 | <code>        const watchStopBlocked = await tool.execute({ action: 'watch_stop', id: watchId }, {}, runtime);</code> | 声明局部标识符 `watchStopBlocked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 64 | <code>        assert.equal(watchStopBlocked.details.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 65 | <code>        const watchStop = await tool.execute({ action: 'watch_stop', id: watchId }, { approved: true }, runtime);</code> | 声明局部标识符 `watchStop`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 66 | <code>        assert.equal(watchStop.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>        const acl = await tool.execute({ action: 'acl_get', path: 'note.txt' }, {}, runtime);</code> | 声明局部标识符 `acl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 69 | <code>        assert.equal(acl.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 70 | <code>        assert.ok(acl.details.stdout);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>        const ptyStatus = await tool.execute({ action: 'pty_status' }, {}, runtime);</code> | 声明局部标识符 `ptyStatus`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        assert.equal(ptyStatus.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        assert.equal(typeof ptyStatus.details.available, 'boolean');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 75 | <code>        const ptyDryRun = await tool.execute({ action: 'pty_start', command: 'node -v', dryRun: true }, { approved: true }, runtime);</code> | 声明局部标识符 `ptyDryRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 76 | <code>        assert.ok(['completed', 'not_available'].includes(ptyDryRun.details.status));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 77 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 78 | <code>        await tool.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 79 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>test('AILIS computer exec stores workbench script output in output store', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 83 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-computer-output-store-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 84 | <code>    const tool = new AILISComputerTool({ workspaceRoot });</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 85 | <code>    const outputStore = new AILISOutputStore({</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 86 | <code>        rootDir: path.join(workspaceRoot, '.ailis-state', 'output-store')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 87 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>    const workbenchRoot = path.join(workspaceRoot, '.ailis-state', 'workbench', 'run-output-store');</code> | 声明局部标识符 `workbenchRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 89 | <code>    const scriptsDir = path.join(workbenchRoot, 'scripts');</code> | 声明局部标识符 `scriptsDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 90 | <code>    const outputsDir = path.join(workbenchRoot, 'outputs');</code> | 声明局部标识符 `outputsDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 91 | <code>    const inputsDir = path.join(workbenchRoot, 'inputs');</code> | 声明局部标识符 `inputsDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 92 | <code>    const runtime = { workspaceRoot, workspaceDir: workspaceRoot, outputStore };</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 95 | <code>        await fs.mkdir(scriptsDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 96 | <code>        await fs.mkdir(outputsDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 97 | <code>        await fs.mkdir(inputsDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 98 | <code>        const inputPath = path.join(inputsDir, 'matrixRows.json');</code> | 声明局部标识符 `inputPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 99 | <code>        const scriptPath = path.join(scriptsDir, 'workbench-script.mjs');</code> | 声明局部标识符 `scriptPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 100 | <code>        const answerPath = path.join(outputsDir, 'answer.json');</code> | 声明局部标识符 `answerPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 101 | <code>        await fs.writeFile(inputPath, JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 102 | <code>            schema: 'ailis.workbench.materialized_input.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 103 | <code>            matrixRows: [{ rowNumber: 1, values: ['START'], fills: ['F478A7'] }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 104 | <code>        }, null, 2), 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        await fs.writeFile(scriptPath, `</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 106 | <code>import fs from 'node:fs';</code> | 导入依赖 `node:fs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 107 | <code>const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 108 | <code>for (let i = 0; i &lt; 180; i += 1) console.log('WORKBENCH_TRACE_' + i + ':' + 'x'.repeat(48));</code> | 声明局部标识符 `i`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 109 | <code>const answer = input.matrixRows[0].fills[0];</code> | 声明局部标识符 `answer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 110 | <code>fs.writeFileSync(process.argv[3], JSON.stringify({ answer }, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 111 | <code>console.log('WORKBENCH_FINAL=' + answer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 112 | <code>`, 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 114 | <code>        const executed = await tool.execute({</code> | 声明局部标识符 `executed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 115 | <code>            action: 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 116 | <code>            command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 117 | <code>            args: [scriptPath, inputPath, answerPath],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 118 | <code>            workdir: workbenchRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 119 | <code>            timeout: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 120 | <code>            maxPreviewChars: 900</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 121 | <code>        }, { approved: true }, runtime);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>        assert.equal(executed.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 124 | <code>        assert.ok(executed.details.outputStore?.outputId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 125 | <code>        assert.equal(executed.details.outputStore.previewTruncated, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 126 | <code>        const searched = await outputStore.search({</code> | 声明局部标识符 `searched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 127 | <code>            outputId: executed.details.outputStore.outputId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 128 | <code>            query: 'WORKBENCH_FINAL=F478A7',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 129 | <code>            contextLines: 0</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 130 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>        assert.equal(searched.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 132 | <code>        assert.equal(searched.matchCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 133 | <code>        const answer = JSON.parse(await fs.readFile(answerPath, 'utf8'));</code> | 声明局部标识符 `answer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 134 | <code>        assert.equal(answer.answer, 'F478A7');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 135 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 136 | <code>        await tool.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 137 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-computer-advanced-tool 的契约与回归行为。”这一文件职责。 |
| 138 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
