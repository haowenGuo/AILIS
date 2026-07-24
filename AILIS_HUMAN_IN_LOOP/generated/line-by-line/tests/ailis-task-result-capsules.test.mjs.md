# tests/ailis-task-result-capsules.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：200
- SHA-256：`aae3fef701bae9541bf869cecfecbf7d61b174ab7dd59e38a4b861a9d5beef68`
- 可运行副本：[打开源文件](../../../source/tests/ailis-task-result-capsules.test.mjs)
- 依赖：`node:assert/strict`、`node:module`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`../electron/ailis-task-result-capsules.cjs`、`../electron/ailis-tool-contracts.cjs`
- 主要符号：`require`、`rootDir`、`store`、`capsule`、`related`、`context`、`legacy`、`events`、`result`、`recorded`、`completed`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 9 | <code>const { AILISTaskResultCapsuleStore } = require('../electron/ailis-task-result-capsules.cjs');</code> | 导入依赖 `../electron/ailis-task-result-capsules.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 10 | <code>const { validateToolContract } = require('../electron/ailis-tool-contracts.cjs');</code> | 导入依赖 `../electron/ailis-tool-contracts.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>test('AILIS task result capsules reuse related public results without exposing control protocols', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-capsules-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    const store = new AILISTaskResultCapsuleStore({ rootDir });</code> | 声明局部标识符 `store`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    const capsule = store.save({</code> | 声明局部标识符 `capsule`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 16 | <code>        taskId: 'task-roxy-guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 17 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 18 | <code>        generatedAt: '2026-07-09T12:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 19 | <code>        request: '做一套终末地洛茜完整攻略',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 20 | <code>        taskRunHandoff: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 21 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 22 | <code>            finalAnswer: '[expression:happy]洛茜适合物理输出队，核心是先叠增益再爆发。\n&lt;｜｜DSML｜｜tool_calls&gt;',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 23 | <code>            sourceRefs: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 24 | <code>                ref_id: 'source-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 25 | <code>                title: '官方角色资料',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 26 | <code>                url: 'https://example.test/roxy',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 27 | <code>                lineno: 12</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 28 | <code>            }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>            collectedData: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 30 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 31 | <code>                    title: '角色资料页',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 32 | <code>                    summary: '确认了技能与队伍定位。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 33 | <code>                    evidenceRefs: ['source-1'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 34 | <code>                    outputId: 'output-1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 35 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 36 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>    assert.equal(capsule.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 41 | <code>    assert.deepEqual(capsule.sourceRefs, [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 42 | <code>        ref_id: 'source-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 43 | <code>        title: '官方角色资料',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 44 | <code>        url: 'https://example.test/roxy',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 45 | <code>        lineno: 12</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 46 | <code>    }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>    assert.doesNotMatch(capsule.answer, /expression&#124;DSML&#124;tool_calls/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>    const related = store.search('洛茜配队怎么调整', { sessionId: 'main' });</code> | 声明局部标识符 `related`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 50 | <code>    assert.equal(related[0].id, capsule.id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 51 | <code>    assert.equal(store.search('帮我检查 Python 单元测试', { sessionId: 'main' }).length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>    const context = store.buildPersonaContext('洛茜配队怎么调整', { sessionId: 'main' });</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 54 | <code>    assert.match(context, /generated_at: 2026-07-09T12:00:00.000Z/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 55 | <code>    assert.match(context, /洛茜适合物理输出队/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 56 | <code>    assert.match(context, /不代表本轮重新执行/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 57 | <code>    assert.match(context, /source_refs: https:\/\/example\.test\/roxy/);</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 58 | <code>    assert.doesNotMatch(context, /expression&#124;DSML&#124;tool_calls/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 59 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>test('task_results uses a strict read-only schema', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 62 | <code>    assert.equal(validateToolContract('task_results', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 63 | <code>        action: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 64 | <code>        query: '洛茜攻略',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 65 | <code>        limit: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 66 | <code>    }).ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 67 | <code>    assert.equal(validateToolContract('task_results', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 68 | <code>        action: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 69 | <code>        query: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 70 | <code>        unexpected: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 71 | <code>    }).ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 72 | <code>    assert.equal(validateToolContract('task_results', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        action: 'get'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 74 | <code>    }).ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 75 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>test('AILIS task result capsules sanitize legacy records when loading from disk', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 78 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-capsules-legacy-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 79 | <code>    await fs.writeFile(path.join(rootDir, 'capsules.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 80 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 81 | <code>        capsules: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 82 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 83 | <code>                id: 'legacy-result',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 84 | <code>                taskId: 'legacy-task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 85 | <code>                generatedAt: '2026-07-01T00:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 86 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 87 | <code>                request: '洛茜攻略',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 88 | <code>                answer: '【expression:happy】可复用结论\n&lt;｜｜DSML｜｜tool_calls&gt;',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 89 | <code>                summary: '[action:wave]摘要'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 90 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>    }), 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>    const store = new AILISTaskResultCapsuleStore({ rootDir });</code> | 声明局部标识符 `store`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 95 | <code>    const legacy = store.get('legacy-result');</code> | 声明局部标识符 `legacy`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 96 | <code>    assert.equal(legacy.answer, '可复用结论');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 97 | <code>    assert.equal(legacy.summary, '摘要');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 98 | <code>    assert.doesNotMatch(JSON.stringify(legacy), /expression&#124;action:&#124;DSML&#124;tool_calls/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 99 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>test('AILIS task result capsules backfill completed historical subagent results once', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 102 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-capsules-backfill-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    const store = new AILISTaskResultCapsuleStore({ rootDir });</code> | 声明局部标识符 `store`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 104 | <code>    const events = [</code> | 声明局部标识符 `events`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 106 | <code>            id: 'old-task-turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 107 | <code>            ts: '2026-07-05T09:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 108 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 109 | <code>            userText: '做一套洛茜攻略',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 110 | <code>            assistantText: '[expression:relaxed]洛茜攻略已经整理完成。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 111 | <code>            resultStatus: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 112 | <code>            resultIntent: 'direct_tool:subagents'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 113 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 115 | <code>            id: 'old-conversation-turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 116 | <code>            ts: '2026-07-05T10:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 117 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 118 | <code>            userText: '你好',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 119 | <code>            assistantText: '你好呀',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 120 | <code>            resultStatus: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 121 | <code>            resultIntent: 'direct_conversation_final'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 122 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>    assert.equal(store.backfillFromMemoryEvents(events).imported, 1);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 126 | <code>    assert.equal(store.backfillFromMemoryEvents(events).imported, 0);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 127 | <code>    const result = store.search('洛茜攻略', { sessionId: 'main' })[0];</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 128 | <code>    assert.match(result.answer, /攻略已经整理完成/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 129 | <code>    assert.doesNotMatch(result.answer, /expression/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 130 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>test('incomplete TaskAgent runs stay in active task state and never enter reusable results', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 133 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-active-task-state-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 134 | <code>    const store = new AILISTaskResultCapsuleStore({ rootDir });</code> | 声明局部标识符 `store`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 135 | <code>    const recorded = store.recordExecution({</code> | 声明局部标识符 `recorded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 136 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 137 | <code>        parentRunId: 'parent-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 138 | <code>        task: '核验原神木偶当前版本并完成攻略',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 139 | <code>        status: 'max_loop',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 140 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 141 | <code>        subagent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 142 | <code>            id: 'worker-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 143 | <code>            childRunId: 'child-1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 144 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>        taskRunHandoff: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 146 | <code>            status: 'max_loop',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 147 | <code>            partialAnswer: '已找到部分资料。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 148 | <code>            failureAnalysis: { bottleneck: '仍缺官方版本证据' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 149 | <code>            resume: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 150 | <code>                contextManagerCheckpoint: { history_version: 2, items: [] }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 151 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 152 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>    assert.equal(recorded.active, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 156 | <code>    assert.equal(store.search('原神木偶攻略', { sessionId: 'main' }).length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 157 | <code>    assert.equal(store.getStatus().activeTaskCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 158 | <code>    assert.match(store.buildActiveTaskContext('main'), /核验原神木偶当前版本/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 159 | <code>    assert.match(store.buildActiveTaskContext('main'), /checkpoint_available: true/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>    const completed = store.recordExecution({</code> | 声明局部标识符 `completed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 162 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 163 | <code>        parentRunId: 'parent-2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 164 | <code>        action: 'resume',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 165 | <code>        task: '补齐官方版本证据',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 166 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 167 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 168 | <code>        subagent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 169 | <code>            id: 'worker-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 170 | <code>            childRunId: 'child-2'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 171 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 172 | <code>        taskRunHandoff: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 173 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 174 | <code>            finalAnswer: '已完成攻略并核验当前版本。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 175 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 178 | <code>    assert.equal(completed.active, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 179 | <code>    assert.equal(store.getStatus().activeTaskCount, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 180 | <code>    assert.match(store.search('原神木偶攻略', { sessionId: 'main' })[0].answer, /已完成攻略/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 181 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 183 | <code>test('legacy failed capsules are quarantined from task_results search and get', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 184 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-failed-capsule-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 185 | <code>    await fs.writeFile(path.join(rootDir, 'capsules.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 186 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 187 | <code>        capsules: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 188 | <code>            id: 'failed-result',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 189 | <code>            taskId: 'failed-task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 190 | <code>            status: 'max_loop',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 191 | <code>            request: '木偶攻略',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 192 | <code>            answer: '只搜索了本地目录。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 193 | <code>            summary: '执行失败。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 194 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>    }), 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 197 | <code>    const store = new AILISTaskResultCapsuleStore({ rootDir });</code> | 声明局部标识符 `store`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 198 | <code>    assert.equal(store.search('木偶攻略').length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 199 | <code>    assert.equal(store.get('failed-result'), null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-task-result-capsules 的契约与回归行为。”这一文件职责。 |
| 200 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
