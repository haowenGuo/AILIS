# tests/ailis-platform-adapter.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。
- 文件类型：`source-code`
- 原始行数：244
- SHA-256：`283e4b205be249d3c8aba05346df7c3aa4ebdd5027cd7fe4bb645f213a85fa1c`
- 可运行副本：[打开源文件](../../../source/tests/ailis-platform-adapter.test.mjs)
- 依赖：`node:assert/strict`、`node:child_process`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-platform-adapter.cjs`、`../electron/ailis-gateway.cjs`
- 主要符号：`require`、`runSpawnSpec`、`child`、`stdout`、`stderr`、`windows`、`multilinePowerShell`、`windowsSpawn`、`linux`、`linuxSpawn`、`script`、`result`、`macos`、`linuxScreenshot`、`android`、`spawnSpec`、`screenshot`、`click`、`type`、`back`、`simulator`、`realIos`、`workspaceRoot`、`platformAdapter`、`gateway`、`status`、`schema`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 2 | <code>import { spawn } from 'node:child_process';</code> | 导入依赖 `node:child_process`，使本文件可以复用外部模块能力。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 3 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 4 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 5 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 6 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 7 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 10 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 11 | <code>    AILISPlatformAdapter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 12 | <code>    createAILISPlatformAdapter</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 13 | <code>} = require('../electron/ailis-platform-adapter.cjs');</code> | 导入依赖 `../electron/ailis-platform-adapter.cjs`，使本文件可以复用外部模块能力。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 14 | <code>const { AILISGateway } = require('../electron/ailis-gateway.cjs');</code> | 导入依赖 `../electron/ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>function runSpawnSpec(spec) {</code> | 定义函数 `runSpawnSpec`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 17 | <code>    return new Promise((resolve, reject) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 18 | <code>        const child = spawn(spec.command, spec.args, spec.options);</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 19 | <code>        const stdout = [];</code> | 声明局部标识符 `stdout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 20 | <code>        const stderr = [];</code> | 声明局部标识符 `stderr`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 21 | <code>        child.stdout.on('data', (chunk) =&gt; stdout.push(chunk));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 22 | <code>        child.stderr.on('data', (chunk) =&gt; stderr.push(chunk));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 23 | <code>        child.on('error', reject);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 24 | <code>        child.on('close', (code) =&gt; resolve({</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 25 | <code>            code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 26 | <code>            stdout: Buffer.concat(stdout).toString('utf8'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 27 | <code>            stderr: Buffer.concat(stderr).toString('utf8')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 28 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>test('AILIS platform adapter normalizes OS-specific path and shell behavior', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 33 | <code>    const windows = new AILISPlatformAdapter({</code> | 声明局部标识符 `windows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 34 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 35 | <code>        env: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 36 | <code>            SystemDrive: 'C:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 37 | <code>            WINDIR: 'C:\\Windows',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 38 | <code>            ComSpec: 'C:\\Windows\\System32\\cmd.exe'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 39 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>    assert.equal(windows.id, 'windows');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 42 | <code>    assert.equal(windows.isPathInside('C:\\Work', 'C:\\WORK\\note.txt'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 43 | <code>    assert.equal(windows.pathKey('C:\\Work\\Note.txt'), path.resolve('C:\\Work\\Note.txt').toLowerCase());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 44 | <code>    assert.deepEqual(windows.shellArgs('echo hi'), ['/d', '/s', '/c', 'echo hi']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 45 | <code>    const multilinePowerShell = [</code> | 声明局部标识符 `multilinePowerShell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 46 | <code>        "$value = @'",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 47 | <code>        '你好',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 48 | <code>        "'@",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 49 | <code>        '$value'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 50 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 51 | <code>    const windowsSpawn = windows.commandSpawnSpec(multilinePowerShell, { cwd: 'C:\\Work' });</code> | 声明局部标识符 `windowsSpawn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 52 | <code>    assert.equal(windowsSpawn.command, 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 53 | <code>    assert.equal(windowsSpawn.options.shell, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 54 | <code>    assert.equal(windowsSpawn.backend, 'powershell-argv');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 55 | <code>    assert.equal(windowsSpawn.args.at(-1).includes(multilinePowerShell), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 56 | <code>    assert.match(windowsSpawn.args.at(-1), /OutputEncoding/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 57 | <code>    assert.match(windows.getStatus().defaults.commandShell, /powershell\.exe$/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 58 | <code>    assert.equal(windows.powershellCommand('Write-Output ok').command, windowsSpawn.command);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 59 | <code>    assert.equal(windows.aclSetCommand('C:\\Work\\note.txt', ['/grant', 'User:(R)']).supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 60 | <code>    assert.equal(windows.getStatus().capabilities.aclSet, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 61 | <code>    assert.equal(windows.protectedRoots().some((root) =&gt; windows.isPathInside(root, 'C:\\Users\\Lenovo\\Documents')), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 62 | <code>    assert.equal(windows.protectedRoots().some((root) =&gt; windows.isPathInside(root, 'C:\\Windows\\System32')), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>    const linux = createAILISPlatformAdapter('linux');</code> | 声明局部标识符 `linux`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 65 | <code>    assert.equal(linux.id, 'linux');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 66 | <code>    assert.equal(linux.isPathInside('/tmp/work', '/tmp/work/note.txt'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 67 | <code>    assert.equal(linux.isPathInside('/tmp/work', '/tmp/work-other/note.txt'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 68 | <code>    assert.deepEqual(linux.shellArgs('echo hi'), ['-lc', 'echo hi']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 69 | <code>    const linuxSpawn = linux.commandSpawnSpec('printf "one\\ntwo\\n"');</code> | 声明局部标识符 `linuxSpawn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 70 | <code>    assert.equal(linuxSpawn.command, 'bash');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 71 | <code>    assert.deepEqual(linuxSpawn.args, ['-lc', 'printf "one\\ntwo\\n"']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 72 | <code>    assert.equal(linuxSpawn.options.shell, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 73 | <code>    assert.equal(linux.aclSetCommand('/tmp/work/note.txt', []).supported, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 74 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>test('AILIS Windows shell executes multiline Unicode as one PowerShell argv', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 77 | <code>    skip: process.platform !== 'win32'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 78 | <code>}, async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 79 | <code>    const windows = new AILISPlatformAdapter({</code> | 声明局部标识符 `windows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 80 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 81 | <code>        env: process.env</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 82 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>    const script = [</code> | 声明局部标识符 `script`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 84 | <code>        "$value = @'",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 85 | <code>        '第一行',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 86 | <code>        '第二行',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 87 | <code>        "'@",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 88 | <code>        '[Console]::Write($value)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 89 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 90 | <code>    const result = await runSpawnSpec(windows.commandSpawnSpec(script));</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>    assert.equal(result.code, 0, result.stderr);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 93 | <code>    assert.match(result.stdout, /第一行/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 94 | <code>    assert.match(result.stdout, /第二行/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 95 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>test('AILIS platform adapter exposes macOS and Linux desktop skeleton capabilities', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 98 | <code>    const macos = new AILISPlatformAdapter({</code> | 声明局部标识符 `macos`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 99 | <code>        platform: 'darwin',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 100 | <code>        env: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 101 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>    assert.equal(macos.id, 'macos');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 103 | <code>    assert.equal(macos.defaultShellExecutable(), 'zsh');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 104 | <code>    assert.equal(macos.desktopScreenshotCommand({ outputPath: '/tmp/ailis-screen.png' }).supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 105 | <code>    assert.match(macos.desktopScreenshotCommand({ outputPath: '/tmp/ailis-screen.png' }).args.join('\n'), /screencapture/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 106 | <code>    assert.deepEqual(macos.clipboardReadCommand(), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 107 | <code>        supported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 108 | <code>        command: 'pbpaste',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 109 | <code>        args: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 110 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>    assert.equal(macos.clipboardWriteCommand({ text: 'hello' }).supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 112 | <code>    assert.match(macos.clipboardWriteCommand({ text: 'hello' }).args.join('\n'), /pbcopy/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 113 | <code>    assert.equal(macos.guiInputCommand({ action: 'click' }).supported, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 114 | <code>    assert.equal(macos.getStatus().capabilityMatrix.screenCapture.backend, 'screencapture');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 115 | <code>    assert.equal(macos.getStatus().capabilityMatrix.guiInput.status, 'skeleton');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>    const linux = new AILISPlatformAdapter({</code> | 声明局部标识符 `linux`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 118 | <code>        platform: 'linux',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 119 | <code>        env: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 120 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>    assert.equal(linux.id, 'linux');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 122 | <code>    assert.equal(linux.defaultShellExecutable(), 'bash');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 123 | <code>    const linuxScreenshot = linux.desktopScreenshotCommand({ outputPath: '/tmp/ailis-screen.png' });</code> | 声明局部标识符 `linuxScreenshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 124 | <code>    assert.equal(linuxScreenshot.supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 125 | <code>    assert.match(linuxScreenshot.args.join('\n'), /gnome-screenshot&#124;grim&#124;spectacle&#124;scrot/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 126 | <code>    assert.equal(linux.clipboardReadCommand().supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 127 | <code>    assert.match(linux.clipboardReadCommand().args.join('\n'), /wl-paste&#124;xclip&#124;xsel/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 128 | <code>    assert.equal(linux.clipboardWriteCommand({ text: 'hello' }).supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 129 | <code>    assert.match(linux.clipboardWriteCommand({ text: 'hello' }).args.join('\n'), /wl-copy&#124;xclip&#124;xsel/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 130 | <code>    assert.equal(linux.guiInputCommand({ action: 'click' }).supported, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 131 | <code>    assert.equal(linux.getStatus().capabilityMatrix.screenCapture.status, 'available-if-installed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 132 | <code>    assert.equal(linux.getStatus().capabilityMatrix.clipboard.status, 'available-if-installed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 133 | <code>    assert.equal(linux.getStatus().capabilityMatrix.guiInput.status, 'skeleton');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 134 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>test('AILIS platform adapter exposes Android ADB mobile capabilities', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 137 | <code>    const android = new AILISPlatformAdapter({</code> | 声明局部标识符 `android`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 138 | <code>        platform: 'android',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 139 | <code>        hostPlatform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 140 | <code>        env: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 141 | <code>            ADB: 'adb-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 142 | <code>            SystemDrive: 'C:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 143 | <code>            WINDIR: 'C:\\Windows'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 144 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>    assert.equal(android.id, 'android');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 147 | <code>    assert.equal(android.getStatus().capabilities.mobileDevice, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 148 | <code>    assert.equal(android.defaultShellExecutable(), 'adb-test');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 149 | <code>    assert.deepEqual(android.shellArgs('ls /sdcard'), ['shell', 'ls /sdcard']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>    const spawnSpec = android.commandSpawnSpec('echo hello', { cwd: 'C:\\Work' });</code> | 声明局部标识符 `spawnSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 152 | <code>    assert.equal(spawnSpec.supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 153 | <code>    assert.equal(spawnSpec.command, 'adb-test');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 154 | <code>    assert.deepEqual(spawnSpec.args, ['shell', 'echo hello']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 155 | <code>    assert.equal(spawnSpec.options.shell, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>    const screenshot = android.desktopScreenshotCommand({ outputPath: 'C:\\Temp\\screen.png' });</code> | 声明局部标识符 `screenshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 158 | <code>    assert.equal(screenshot.supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 159 | <code>    assert.equal(screenshot.steps.length, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 160 | <code>    assert.deepEqual(screenshot.steps[0].args.slice(0, 3), ['shell', 'screencap', '-p']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 161 | <code>    assert.deepEqual(screenshot.steps[1].args.slice(0, 1), ['pull']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>    const click = android.guiInputCommand({ action: 'click', x: 10, y: 20 });</code> | 声明局部标识符 `click`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 164 | <code>    assert.equal(click.supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 165 | <code>    assert.deepEqual(click.args, ['shell', 'input', 'tap', '10', '20']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>    const type = android.guiInputCommand({ action: 'type_text', text: 'hi there' });</code> | 声明局部标识符 `type`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 168 | <code>    assert.equal(type.supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 169 | <code>    assert.deepEqual(type.args, ['shell', 'input', 'text', 'hi%sthere']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>    const back = android.guiInputCommand({ action: 'keyboard_press', key: 'back' });</code> | 声明局部标识符 `back`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 172 | <code>    assert.equal(back.supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 173 | <code>    assert.deepEqual(back.args, ['shell', 'input', 'keyevent', '4']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>    assert.equal(android.clipboardReadCommand().supported, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 176 | <code>    assert.equal(android.getStatus().capabilityMatrix.guiInput.status, 'available-basic');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 177 | <code>    assert.equal(android.getStatus().capabilityMatrix.screenCapture.status, 'available-if-adb');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 178 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>test('AILIS platform adapter exposes iOS simulator skeleton and real-device limits', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 181 | <code>    const simulator = new AILISPlatformAdapter({</code> | 声明局部标识符 `simulator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 182 | <code>        platform: 'ios-simulator',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 183 | <code>        hostPlatform: 'darwin',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 184 | <code>        env: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 185 | <code>            XCRUN: 'xcrun-test'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 186 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>    assert.equal(simulator.id, 'ios-simulator');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 189 | <code>    assert.equal(simulator.getStatus().capabilities.mobileDevice, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 190 | <code>    assert.equal(simulator.commandSpawnSpec('ls').supported, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 191 | <code>    const screenshot = simulator.desktopScreenshotCommand({ outputPath: '/tmp/ailis-ios.png' });</code> | 声明局部标识符 `screenshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 192 | <code>    assert.equal(screenshot.supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 193 | <code>    assert.equal(screenshot.command, 'xcrun-test');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 194 | <code>    assert.deepEqual(screenshot.args, ['simctl', 'io', 'booted', 'screenshot', '/tmp/ailis-ios.png']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 195 | <code>    assert.deepEqual(simulator.clipboardReadCommand(), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 196 | <code>        supported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 197 | <code>        command: 'xcrun-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 198 | <code>        args: ['simctl', 'pbpaste', 'booted']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 199 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>    assert.equal(simulator.clipboardWriteCommand({ text: 'hello' }).supported, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 201 | <code>    assert.match(simulator.clipboardWriteCommand({ text: 'hello' }).args.join('\n'), /simctl pbcopy booted/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 202 | <code>    assert.equal(simulator.guiInputCommand({ action: 'click', x: 10, y: 20 }).supported, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 203 | <code>    assert.equal(simulator.getStatus().capabilityMatrix.screenCapture.status, 'available-if-simulator');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>    const realIos = new AILISPlatformAdapter({</code> | 声明局部标识符 `realIos`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 206 | <code>        platform: 'ios',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 207 | <code>        hostPlatform: 'darwin'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 208 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>    assert.equal(realIos.id, 'ios');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 210 | <code>    assert.equal(realIos.commandSpawnSpec('ls').supported, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 211 | <code>    assert.equal(realIos.desktopScreenshotCommand({ outputPath: '/tmp/ailis-ios.png' }).supported, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 212 | <code>    assert.equal(realIos.getStatus().capabilityMatrix.guiInput.status, 'skeleton');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 213 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 215 | <code>test('AILIS Gateway exposes the active platform adapter to tools and status', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 216 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-platform-gateway-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 217 | <code>    const platformAdapter = new AILISPlatformAdapter({ platform: 'win32' });</code> | 声明局部标识符 `platformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 218 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 219 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 220 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 221 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 222 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 223 | <code>        platformAdapter</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 224 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 226 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 227 | <code>        await gateway.start();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 228 | <code>        const status = gateway.getStatus();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 229 | <code>        assert.equal(status.platform.id, 'windows');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 230 | <code>        assert.equal(status.runtime.platform.id, 'windows');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 232 | <code>        const schema = await gateway.callTool({</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 233 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 234 | <code>            args: { action: 'schema' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 235 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 236 | <code>                workspace: workspaceRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 237 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 238 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 239 | <code>        assert.equal(schema.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 240 | <code>        assert.equal(schema.result.details.schema.safety.platform.id, 'windows');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 241 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 242 | <code>        await gateway.stop().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。”这一文件职责。 |
| 243 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
