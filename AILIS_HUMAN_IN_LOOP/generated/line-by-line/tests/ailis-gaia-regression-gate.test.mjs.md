# tests/ailis-gaia-regression-gate.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：132
- SHA-256：`422a852fb4a5bcf6e9a34737f851ad7af3c277adb2d42b834926661bacbbf1d4`
- 可运行副本：[打开源文件](../../../source/tests/ailis-gaia-regression-gate.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`../scripts/compare-ailis-gaia-runs.mjs`
- 主要符号：`writeRun`、`resultPath`、`root`、`baselineRows`、`candidateRows`、`baselineRuns`、`candidateRuns`、`comparison`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 8 | <code>    compareGaiaRunCohorts,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    readGaiaRun,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 10 | <code>    renderGaiaRegressionReport</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 11 | <code>} from '../scripts/compare-ailis-gaia-runs.mjs';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>async function writeRun(root, name, rows) {</code> | 定义函数 `writeRun`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    const resultPath = path.join(root, `${name}.jsonl`);</code> | 声明局部标识符 `resultPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    await fs.writeFile(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 16 | <code>        resultPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 17 | <code>        `${rows.map((row) =&gt; JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 18 | <code>            record_type: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 19 | <code>            status: row.ok ? 'visible_correct' : row.status &#124;&#124; 'answer_candidate_mismatch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 20 | <code>            durationMs: row.durationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 21 | <code>            usage: { totalTokens: row.totalTokens },</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 22 | <code>            ...row</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 23 | <code>        })).join('\n')}\n`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 24 | <code>        'utf8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 25 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 26 | <code>    return await readGaiaRun(resultPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 27 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>test('GAIA regression gate accepts a complete non-regressing paired cohort', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 30 | <code>    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-gaia-gate-pass-'));</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 31 | <code>    const baselineRows = [</code> | 声明局部标识符 `baselineRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 32 | <code>        { task_id: 'a', ok: true, durationMs: 100, totalTokens: 1000 },</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 33 | <code>        { task_id: 'b', ok: true, durationMs: 200, totalTokens: 2000 },</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 34 | <code>        { task_id: 'c', ok: false, durationMs: 300, totalTokens: 3000 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 35 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 36 | <code>    const candidateRows = [</code> | 声明局部标识符 `candidateRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 37 | <code>        { task_id: 'a', ok: true, durationMs: 105, totalTokens: 1050 },</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 38 | <code>        { task_id: 'b', ok: true, durationMs: 205, totalTokens: 2050 },</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 39 | <code>        { task_id: 'c', ok: false, durationMs: 295, totalTokens: 2950 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 40 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 42 | <code>        const baselineRuns = await Promise.all([</code> | 声明局部标识符 `baselineRuns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 43 | <code>            writeRun(root, 'baseline-1', baselineRows),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 44 | <code>            writeRun(root, 'baseline-2', baselineRows)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 45 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>        const candidateRuns = await Promise.all([</code> | 声明局部标识符 `candidateRuns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 47 | <code>            writeRun(root, 'candidate-1', candidateRows),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 48 | <code>            writeRun(root, 'candidate-2', candidateRows)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 49 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>        const comparison = compareGaiaRunCohorts({</code> | 声明局部标识符 `comparison`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 51 | <code>            baselineRuns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 52 | <code>            candidateRuns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 53 | <code>            thresholds: { expectedTasks: 3 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 54 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>        assert.equal(comparison.pass, true, comparison.gateFailures.join('\n'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 57 | <code>        assert.equal(comparison.counts.severeRegressions, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 58 | <code>        assert.match(renderGaiaRegressionReport(comparison), /Gate \&#124; PASS/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 60 | <code>        await fs.rm(root, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 61 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>test('GAIA regression gate rejects stable correctness loss and extra timeouts', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 65 | <code>    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-gaia-gate-fail-'));</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 66 | <code>    const baselineRows = [</code> | 声明局部标识符 `baselineRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 67 | <code>        { task_id: 'a', ok: true, durationMs: 100, totalTokens: 1000 },</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 68 | <code>        { task_id: 'b', ok: true, durationMs: 200, totalTokens: 2000 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 69 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>    const candidateRows = [</code> | 声明局部标识符 `candidateRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 71 | <code>        { task_id: 'a', ok: false, status: 'timeout', durationMs: 500, totalTokens: 1500 },</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 72 | <code>        { task_id: 'b', ok: true, durationMs: 200, totalTokens: 2000 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 73 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 75 | <code>        const baselineRuns = await Promise.all([</code> | 声明局部标识符 `baselineRuns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 76 | <code>            writeRun(root, 'baseline-1', baselineRows),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 77 | <code>            writeRun(root, 'baseline-2', baselineRows)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 78 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>        const candidateRuns = await Promise.all([</code> | 声明局部标识符 `candidateRuns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 80 | <code>            writeRun(root, 'candidate-1', candidateRows),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 81 | <code>            writeRun(root, 'candidate-2', candidateRows)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 82 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>        const comparison = compareGaiaRunCohorts({</code> | 声明局部标识符 `comparison`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 84 | <code>            baselineRuns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 85 | <code>            candidateRuns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 86 | <code>            thresholds: { expectedTasks: 2 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 87 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>        assert.equal(comparison.pass, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 90 | <code>        assert.equal(comparison.counts.severeRegressions, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 91 | <code>        assert.ok(comparison.gateFailures.some((failure) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 92 | <code>            failure.includes('severe stable regressions')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 93 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>        assert.ok(comparison.gateFailures.some((failure) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 95 | <code>            failure.includes('timeout rate delta')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 96 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 98 | <code>        await fs.rm(root, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 99 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>test('GAIA regression gate rejects incomplete or non-identical task sets', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-gaia-gate-shape-'));</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 104 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 105 | <code>        const baselineRuns = [</code> | 声明局部标识符 `baselineRuns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 106 | <code>            await writeRun(root, 'baseline', [</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 107 | <code>                { task_id: 'a', ok: true, durationMs: 100, totalTokens: 1000 },</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 108 | <code>                { task_id: 'b', ok: true, durationMs: 100, totalTokens: 1000 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 109 | <code>            ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>        const candidateRuns = [</code> | 声明局部标识符 `candidateRuns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 112 | <code>            await writeRun(root, 'candidate', [</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 113 | <code>                { task_id: 'a', ok: true, durationMs: 100, totalTokens: 1000 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 114 | <code>            ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 116 | <code>        const comparison = compareGaiaRunCohorts({</code> | 声明局部标识符 `comparison`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 117 | <code>            baselineRuns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 118 | <code>            candidateRuns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 119 | <code>            thresholds: { expectedTasks: 2 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 120 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>        assert.equal(comparison.pass, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 123 | <code>        assert.ok(comparison.gateFailures.some((failure) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 124 | <code>            failure.includes('at least 2 runs')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 125 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 126 | <code>        assert.ok(comparison.gateFailures.some((failure) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 127 | <code>            failure.includes('task set mismatch')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 128 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 130 | <code>        await fs.rm(root, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-gaia-regression-gate 的契约与回归行为。”这一文件职责。 |
| 131 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
