# tests/runtime-asset-manager.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 runtime-asset-manager 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：167
- SHA-256：`731c3cfe29035c10c1478dbc0e80087b8bfbb275568a435cbda13ed7b4299b3f`
- 可运行副本：[打开源文件](../../../source/tests/runtime-asset-manager.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/runtime-asset-manager.cjs`
- 主要符号：`require`、`makeProject`、`projectRoot`、`manager`、`scan`、`assetDir`、`result`、`targetRoot`、`sourceDir`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import { test } from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 9 | <code>const { RuntimeAssetManager } = require('../electron/runtime-asset-manager.cjs');</code> | 导入依赖 `../electron/runtime-asset-manager.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>async function makeProject() {</code> | 定义函数 `makeProject`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    return await mkdtemp(path.join(os.tmpdir(), 'ailis-runtime-assets-'));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 13 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>test('RuntimeAssetManager scans known assets and reports totals', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    const projectRoot = await makeProject();</code> | 声明局部标识符 `projectRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 18 | <code>        await mkdir(path.join(projectRoot, 'build-cache', 'benchmarks'), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 19 | <code>        await writeFile(path.join(projectRoot, 'build-cache', 'benchmarks', 'sample.txt'), 'hello');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 20 | <code>        const manager = new RuntimeAssetManager({</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 21 | <code>            projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 22 | <code>            definitions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 23 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 24 | <code>                    id: 'bench',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 25 | <code>                    label: 'Bench Cache',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 26 | <code>                    category: 'build_cache',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 27 | <code>                    relativePath: 'build-cache/benchmarks',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 28 | <code>                    risk: 'low',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 29 | <code>                    reinstallable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 30 | <code>                    preferredRoot: 'cache'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 31 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 32 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>        const scan = await manager.scan();</code> | 声明局部标识符 `scan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 36 | <code>        assert.equal(scan.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 37 | <code>        assert.equal(scan.totals.assetCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 38 | <code>        assert.equal(scan.totals.existingCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 39 | <code>        assert.equal(scan.assets[0].exists, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 40 | <code>        assert.equal(scan.assets[0].bytes, 5);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 41 | <code>        assert.equal(scan.assets[0].deletable, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 42 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 43 | <code>        await rm(projectRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 44 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 45 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>test('RuntimeAssetManager deletes only registered runtime assets', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 48 | <code>    const projectRoot = await makeProject();</code> | 声明局部标识符 `projectRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 49 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 50 | <code>        const assetDir = path.join(projectRoot, '.ailis-runtime', 'uv-cache');</code> | 声明局部标识符 `assetDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 51 | <code>        await mkdir(assetDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        await writeFile(path.join(assetDir, 'cache.bin'), 'cache');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 53 | <code>        const manager = new RuntimeAssetManager({</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 54 | <code>            projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 55 | <code>            definitions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 56 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 57 | <code>                    id: 'uv-cache',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 58 | <code>                    label: 'uv Cache',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 59 | <code>                    category: 'dependency_cache',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 60 | <code>                    relativePath: '.ailis-runtime/uv-cache',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 61 | <code>                    risk: 'low',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 62 | <code>                    reinstallable: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 63 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>        const result = await manager.deleteAsset('uv-cache');</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 68 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 69 | <code>        assert.equal(result.deleted, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 70 | <code>        assert.equal(result.bytesFreed, 5);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>        const scan = await manager.scan();</code> | 声明局部标识符 `scan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        assert.equal(scan.assets[0].exists, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        await assert.rejects(() =&gt; manager.deleteAsset('unknown'), /unknown_runtime_asset/);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 75 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 76 | <code>        await rm(projectRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 77 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>test('RuntimeAssetManager migrates a registered asset to an explicit target root', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 81 | <code>    const projectRoot = await makeProject();</code> | 声明局部标识符 `projectRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 82 | <code>    const targetRoot = await makeProject();</code> | 声明局部标识符 `targetRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 83 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 84 | <code>        const sourceDir = path.join(projectRoot, 'models', 'voice-runtime');</code> | 声明局部标识符 `sourceDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 85 | <code>        await mkdir(sourceDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 86 | <code>        await writeFile(path.join(sourceDir, 'manifest.txt'), 'voice');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 87 | <code>        const manager = new RuntimeAssetManager({</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 88 | <code>            projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 89 | <code>            definitions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 90 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 91 | <code>                    id: 'voice-runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 92 | <code>                    label: 'Voice Runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 93 | <code>                    category: 'voice',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 94 | <code>                    relativePath: 'models/voice-runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 95 | <code>                    risk: 'high',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 96 | <code>                    reinstallable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 97 | <code>                    supportsMigration: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 98 | <code>                    preferredRoot: 'models'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 99 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>        const result = await manager.migrateAsset('voice-runtime', targetRoot);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 104 | <code>        assert.equal(result.migrated, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        assert.equal(result.preferencePatch.voiceRuntimeRoot, result.targetPath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 106 | <code>        assert.equal(await readFile(path.join(result.targetPath, 'manifest.txt'), 'utf8'), 'voice');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>        const scan = await manager.scan();</code> | 声明局部标识符 `scan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        assert.equal(scan.assets[0].exists, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 110 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 111 | <code>        await rm(projectRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 112 | <code>        await rm(targetRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 113 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>test('RuntimeAssetManager refuses migration for assets without a path preference', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 117 | <code>    const projectRoot = await makeProject();</code> | 声明局部标识符 `projectRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 118 | <code>    const targetRoot = await makeProject();</code> | 声明局部标识符 `targetRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 119 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 120 | <code>        await mkdir(path.join(projectRoot, '.ailis-runtime', 'vllm-venv'), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 121 | <code>        const manager = new RuntimeAssetManager({</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 122 | <code>            projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 123 | <code>            definitions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 124 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 125 | <code>                    id: 'vllm-venv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 126 | <code>                    label: 'vLLM Runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 127 | <code>                    category: 'local_llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 128 | <code>                    relativePath: '.ailis-runtime/vllm-venv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 129 | <code>                    risk: 'medium',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 130 | <code>                    reinstallable: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 131 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>        const scan = await manager.scan();</code> | 声明局部标识符 `scan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 136 | <code>        assert.equal(scan.assets[0].migratable, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 137 | <code>        await assert.rejects(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 138 | <code>            () =&gt; manager.migrateAsset('vllm-venv', targetRoot),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 139 | <code>            /asset_migration_not_supported/</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 140 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 142 | <code>        await rm(projectRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 143 | <code>        await rm(targetRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 144 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>test('RuntimeAssetManager refuses definitions outside the project root', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 148 | <code>    const projectRoot = await makeProject();</code> | 声明局部标识符 `projectRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 149 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 150 | <code>        const manager = new RuntimeAssetManager({</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 151 | <code>            projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 152 | <code>            definitions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 153 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 154 | <code>                    id: 'outside',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 155 | <code>                    label: 'Outside',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 156 | <code>                    category: 'unsafe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 157 | <code>                    relativePath: '../outside',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 158 | <code>                    risk: 'high',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 159 | <code>                    reinstallable: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 160 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>        await assert.rejects(() =&gt; manager.scan(), /refuse_to_manage_outside_project/);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 164 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 165 | <code>        await rm(projectRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 runtime-asset-manager 的契约与回归行为。”这一文件职责。 |
| 166 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
