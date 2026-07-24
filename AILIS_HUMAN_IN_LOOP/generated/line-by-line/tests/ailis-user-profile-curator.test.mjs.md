# tests/ailis-user-profile-curator.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：871
- SHA-256：`a98feefe48eb0ba764a6bef7a1e4105dc45687f4a789044b4d557b3e811165a2`
- 可运行副本：[打开源文件](../../../source/tests/ailis-user-profile-curator.test.mjs)
- 依赖：`node:assert/strict`、`node:module`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`../electron/ailis-raw-memory-ledger.cjs`、`../electron/ailis-user-profile-curator.cjs`、`../electron/ailis-preference-state.cjs`
- 主要符号：`require`、`parseCuratorInput`、`content`、`marker`、`markerIndex`、`emptyExtraction`、`rootDir`、`ledger`、`curator`、`result`、`skipped`、`persisted`、`preferenceState`、`snapshot`、`curatorInput`、`memoryRoot`、`evidenceId`、`rebuilt`、`promoted`、`backup`、`state`、`restarted`、`llmClient`、`staleManifest`、`stagingCurator`、`repaired`、`paused`、`stillProduction`、`resumed`、`replaced`、`calls`、`input`、`options`、`first`、`second`、`third`、`seen`、`loaded`、`callCount`、`llmStarted`、`blockingLlmClient`、`manualCurator`、`scheduledCurator`、`rebuildPromise`、`scheduledResult`、`rebuildResult`、`writeBomJson`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 9 | <code>const { AILISRawMemoryLedger } = require('../electron/ailis-raw-memory-ledger.cjs');</code> | 导入依赖 `../electron/ailis-raw-memory-ledger.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 10 | <code>const { AILISUserProfileCurator } = require('../electron/ailis-user-profile-curator.cjs');</code> | 导入依赖 `../electron/ailis-user-profile-curator.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 11 | <code>const { AILISPreferenceState } = require('../electron/ailis-preference-state.cjs');</code> | 导入依赖 `../electron/ailis-preference-state.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>function parseCuratorInput(request) {</code> | 定义函数 `parseCuratorInput`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    const content = request?.messages?.[1]?.content &#124;&#124; '';</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    const marker = '\nInput:\n';</code> | 声明局部标识符 `marker`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    const markerIndex = content.indexOf(marker);</code> | 声明局部标识符 `markerIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    assert.notEqual(markerIndex, -1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    return JSON.parse(content.slice(markerIndex + marker.length));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 19 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>function emptyExtraction(daySummary = 'batch processed') {</code> | 定义函数 `emptyExtraction`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 22 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 23 | <code>        daySummary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 24 | <code>        profileUpdates: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 25 | <code>        relationshipUpdates: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 26 | <code>        affinityUpdate: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 27 | <code>        rejectedSignals: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 28 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>test('AILIS user profile curator extracts daily profile, relationship, and affinity updates from new raw memory', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 32 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-curator-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 33 | <code>    const ledger = new AILISRawMemoryLedger({</code> | 声明局部标识符 `ledger`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 34 | <code>        rootDir: path.join(rootDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 35 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 36 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>    ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 38 | <code>        id: 'raw-direct-style',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 39 | <code>        iso: '2026-06-29T10:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 40 | <code>        type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 41 | <code>        source: 'test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 42 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 43 | <code>        category: 'conversation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 44 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 45 | <code>            requestPayload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 46 | <code>                memoryUserMessage: '以后回答要直接、基于证据，不要空泛建议。'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 47 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 49 | <code>                content: '我会先基于证据说明，再给具体方案。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 50 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>    ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 54 | <code>        id: 'raw-repair-signal',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 55 | <code>        iso: '2026-06-29T11:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 56 | <code>        type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 57 | <code>        source: 'test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 58 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 59 | <code>        category: 'conversation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 60 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 61 | <code>            requestPayload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 62 | <code>                memoryUserMessage: '我现在不放心你乱改代码，先解释清楚再动。'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 63 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 65 | <code>                content: '我会先说明边界和证据，不直接大改。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 66 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>    const curator = new AILISUserProfileCurator({</code> | 声明局部标识符 `curator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 71 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 72 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        llmClient: async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 75 | <code>            content: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 76 | <code>                daySummary: '用户强调直接、证据化和先解释边界。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 77 | <code>                profileUpdates: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 78 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 79 | <code>                        category: 'communication_style',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 80 | <code>                        claim: '用户希望回答直接、具体，并基于证据，不要空泛建议。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 81 | <code>                        operation: 'add_or_merge',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 82 | <code>                        confidence: 0.94,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 83 | <code>                        stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 84 | <code>                        evidenceIds: ['raw-direct-style'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 85 | <code>                        reason: '用户明确使用“以后”表达稳定偏好。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 86 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>                relationshipUpdates: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 89 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 90 | <code>                        claim: '当用户担心代码质量时，AILIS 应先解释边界和证据，再动代码。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 91 | <code>                        operation: 'add_or_merge',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 92 | <code>                        confidence: 0.88,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 93 | <code>                        stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 94 | <code>                        evidenceIds: ['raw-repair-signal'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 95 | <code>                        reason: '用户明确表达不放心乱改。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 96 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>                affinityUpdate: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 99 | <code>                    trustDelta: 0.02,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 100 | <code>                    familiarityDelta: 0.03,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 101 | <code>                    warmthDelta: 0.01,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 102 | <code>                    frictionDelta: 0.02,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 103 | <code>                    repairState: 'recovering',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 104 | <code>                    reason: '用户仍在继续协作，但对实现质量有摩擦。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 105 | <code>                    evidenceIds: ['raw-repair-signal']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 106 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>                rejectedSignals: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 108 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>    const result = await curator.runDailyCuration({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 113 | <code>        nowIso: '2026-06-30T02:00:00.000Z'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 114 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>    assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 117 | <code>    assert.equal(result.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 118 | <code>    assert.equal(result.run.processedEntryCount, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 119 | <code>    assert.equal(result.run.profileUpdateCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 120 | <code>    assert.equal(result.run.relationshipUpdateCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 121 | <code>    assert.equal(result.userProfile.items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 122 | <code>    assert.match(result.userProfile.items[0].claim, /直接、具体/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 123 | <code>    assert.deepEqual(result.userProfile.items[0].evidenceIds, ['raw-direct-style']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 124 | <code>    assert.equal(result.relationshipProfile.items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 125 | <code>    assert.equal(result.affinityState.repairState, 'recovering');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 126 | <code>    assert.equal(result.affinityState.trust, 0.52);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 127 | <code>    assert.equal(result.affinityState.familiarity, 0.53);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 128 | <code>    assert.equal(result.affinityState.friction, 0.22);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>    const skipped = await curator.runDailyCuration({</code> | 声明局部标识符 `skipped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 131 | <code>        nowIso: '2026-06-30T12:00:00.000Z'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 132 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>    assert.equal(skipped.status, 'already_curated_today');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>    const persisted = JSON.parse(await fs.readFile(path.join(rootDir, 'memory', 'user-profile.json'), 'utf8'));</code> | 声明局部标识符 `persisted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 136 | <code>    assert.equal(persisted.items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 137 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>test('AILIS user profile curator rejects unsupported LLM updates without raw evidence ids', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 140 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-curator-invalid-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 141 | <code>    const ledger = new AILISRawMemoryLedger({</code> | 声明局部标识符 `ledger`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 142 | <code>        rootDir: path.join(rootDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 143 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 144 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>    ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 146 | <code>        id: 'raw-real-evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 147 | <code>        iso: '2026-06-29T10:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 148 | <code>        type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 149 | <code>        source: 'test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 150 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 151 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 152 | <code>            requestPayload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 153 | <code>                memoryUserMessage: '今天测试一下。'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 154 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 155 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>    const curator = new AILISUserProfileCurator({</code> | 声明局部标识符 `curator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 159 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 160 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 161 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 162 | <code>        llmClient: async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 163 | <code>            content: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 164 | <code>                profileUpdates: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 165 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 166 | <code>                        category: 'communication_style',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 167 | <code>                        claim: '用户永远喜欢非常长的回答。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 168 | <code>                        confidence: 0.99,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 169 | <code>                        stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 170 | <code>                        evidenceIds: ['missing-evidence'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 171 | <code>                        reason: 'bad evidence'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 172 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 173 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>                relationshipUpdates: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 175 | <code>                affinityUpdate: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 176 | <code>                    trustDelta: 0.05,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 177 | <code>                    familiarityDelta: 0.05,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 178 | <code>                    warmthDelta: 0.05,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 179 | <code>                    frictionDelta: -0.05,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 180 | <code>                    repairState: 'warm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 181 | <code>                    evidenceIds: ['missing-evidence'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 182 | <code>                    reason: 'bad evidence'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 183 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>                rejectedSignals: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 185 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 189 | <code>    const result = await curator.runDailyCuration({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 190 | <code>        nowIso: '2026-06-30T02:00:00.000Z'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 191 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>    assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 194 | <code>    assert.equal(result.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 195 | <code>    assert.equal(result.run.profileUpdateCount, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 196 | <code>    assert.equal(result.run.affinityChanged, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 197 | <code>    assert.equal(result.userProfile.items.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 198 | <code>    assert.equal(result.affinityState.trust, 0.5);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 199 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 201 | <code>test('AILIS user profile curator records evidence-bound temporal preference events', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 202 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-preference-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 203 | <code>    const ledger = new AILISRawMemoryLedger({</code> | 声明局部标识符 `ledger`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 204 | <code>        rootDir: path.join(rootDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 205 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 206 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>    ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 208 | <code>        id: 'raw-address-preference',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 209 | <code>        iso: '2026-07-02T10:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 210 | <code>        type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 211 | <code>        source: 'test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 212 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 213 | <code>        runId: 'turn-address',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 214 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 215 | <code>            requestPayload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 216 | <code>                memoryUserMessage: '今天你叫我队长，明天恢复以前的叫法。'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 217 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>            result: { content: '好。' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 219 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 221 | <code>    const preferenceState = new AILISPreferenceState({ rootDir: path.join(rootDir, 'memory') });</code> | 声明局部标识符 `preferenceState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 222 | <code>    const curator = new AILISUserProfileCurator({</code> | 声明局部标识符 `curator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 223 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 224 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 225 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 226 | <code>        preferenceState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 227 | <code>        llmClient: async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 228 | <code>            content: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 229 | <code>                ...emptyExtraction(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 230 | <code>                preferenceEvents: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 231 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 232 | <code>                        slot: 'address.ailis_to_user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 233 | <code>                        operation: 'set',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 234 | <code>                        value: '队长',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 235 | <code>                        scope: 'day',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 236 | <code>                        explicitness: 'explicit',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 237 | <code>                        confidence: 0.98,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 238 | <code>                        evidenceId: 'raw-address-preference',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 239 | <code>                        evidenceQuote: '今天你叫我队长',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 240 | <code>                        reason: '用户明确限定为今天。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 241 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 243 | <code>                        slot: 'address.user_to_ailis',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 244 | <code>                        operation: 'set',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 245 | <code>                        value: '队长',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 246 | <code>                        scope: 'day',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 247 | <code>                        explicitness: 'implicit',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 248 | <code>                        confidence: 0.99,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 249 | <code>                        evidenceId: 'raw-address-preference',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 250 | <code>                        evidenceQuote: '模型编造的证据',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 251 | <code>                        reason: '应被证据校验拒绝。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 252 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 258 | <code>    const result = await curator.runDailyCuration({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 259 | <code>        nowIso: '2026-07-02T11:00:00.000Z'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 260 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>    assert.equal(result.run.preferenceEventCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 262 | <code>    const snapshot = preferenceState.resolve({ sessionId: 'main', now: '2026-07-02T12:00:00.000Z' });</code> | 声明局部标识符 `snapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 263 | <code>    assert.equal(snapshot.active['address.ailis_to_user'].value, '队长');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 264 | <code>    assert.equal(snapshot.active['address.user_to_ailis'], undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 265 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>test('AILIS preference curation advances past TaskAgent traces without sending them to the memory model', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 268 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-trace-isolation-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 269 | <code>    const ledger = new AILISRawMemoryLedger({</code> | 声明局部标识符 `ledger`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 270 | <code>        rootDir: path.join(rootDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 271 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 272 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 273 | <code>    ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 274 | <code>        id: 'raw-task-trace',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 275 | <code>        iso: '2026-07-03T09:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 276 | <code>        type: 'agent.transcript.item',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 277 | <code>        source: 'task-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 278 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 279 | <code>        payload: { payload: { toolOutput: 'large private execution trace that must not become persona memory' } }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 280 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>    ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 282 | <code>        id: 'raw-task-final-turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 283 | <code>        iso: '2026-07-03T09:00:30.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 284 | <code>        type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 285 | <code>        source: 'task-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 286 | <code>        sessionId: 'main:task-agent:task-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 287 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 288 | <code>            agentRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 289 | <code>            requestPayload: { memoryUserMessage: 'internal delegated task text' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 290 | <code>            result: { content: 'internal task result' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 291 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>    ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 294 | <code>        id: 'legacy-child-agent-turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 295 | <code>        iso: '2026-07-03T09:00:45.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 296 | <code>        type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 297 | <code>        source: 'agent_runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 298 | <code>        sessionId: 'main:agent:legacy-child',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 299 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 300 | <code>            requestPayload: { memoryUserMessage: 'Legacy child-agent delegated prompt must not become user memory.' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 301 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>    ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 304 | <code>        id: 'raw-user-visible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 305 | <code>        iso: '2026-07-03T09:01:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 306 | <code>        type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 307 | <code>        source: 'chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 308 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 309 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 310 | <code>            requestPayload: { memoryUserMessage: '回答时不要把内部执行日志说出来。' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 311 | <code>            result: { content: '我会保持出口自然。' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 312 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 314 | <code>    let curatorInput = null;</code> | 声明局部标识符 `curatorInput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 315 | <code>    const curator = new AILISUserProfileCurator({</code> | 声明局部标识符 `curator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 316 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 317 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 318 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 319 | <code>        llmClient: async (request) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 320 | <code>            curatorInput = parseCuratorInput(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 321 | <code>            return { content: JSON.stringify(emptyExtraction()) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 322 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 324 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 325 | <code>    const result = await curator.runDailyCuration({ nowIso: '2026-07-03T10:00:00.000Z' });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 326 | <code>    assert.equal(result.run.processedEntryCount, 4);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 327 | <code>    assert.deepEqual(curatorInput.evidence.map((entry) =&gt; entry.id), ['raw-user-visible']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 328 | <code>    assert.equal(curatorInput.evidence[0].text, '回答时不要把内部执行日志说出来。');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 329 | <code>    assert.doesNotMatch(JSON.stringify(curatorInput), /large private execution trace/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 330 | <code>    assert.doesNotMatch(JSON.stringify(curatorInput), /internal delegated task text/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 331 | <code>    assert.doesNotMatch(JSON.stringify(curatorInput), /Legacy child-agent delegated prompt/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 332 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 334 | <code>test('AILIS curator rebuilds the Raw Ledger in staging and atomically promotes user and relationship capsules', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 335 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-rebuild-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 336 | <code>    const memoryRoot = path.join(rootDir, 'memory');</code> | 声明局部标识符 `memoryRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 337 | <code>    const ledger = new AILISRawMemoryLedger({</code> | 声明局部标识符 `ledger`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 338 | <code>        rootDir: path.join(rootDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 339 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 340 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 341 | <code>    for (const index of [1, 2, 3]) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 342 | <code>        ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 343 | <code>            id: `raw-rebuild-${index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 344 | <code>            iso: `2026-07-04T09:00:0${index}.000Z`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 345 | <code>            type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 346 | <code>            source: 'chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 347 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 348 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 349 | <code>                requestPayload: { memoryUserMessage: `长期偏好证据 ${index}` },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 350 | <code>                result: { content: '收到。' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 351 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 352 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 353 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 354 | <code>    await fs.mkdir(memoryRoot, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 355 | <code>    await fs.writeFile(path.join(memoryRoot, 'user-profile.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 356 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 357 | <code>        items: [{ id: 'old-profile', claim: 'old production profile' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 358 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 360 | <code>    const curator = new AILISUserProfileCurator({</code> | 声明局部标识符 `curator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 361 | <code>        rootDir: memoryRoot,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 362 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 363 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 364 | <code>        llmClient: async (request) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 365 | <code>            const evidenceId = parseCuratorInput(request).evidence[0].id;</code> | 声明局部标识符 `evidenceId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 366 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 367 | <code>                content: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 368 | <code>                    ...emptyExtraction('rebuild batch'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 369 | <code>                    profileUpdates: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 370 | <code>                        category: 'work_style',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 371 | <code>                        claim: '用户重视可恢复的长期系统。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 372 | <code>                        confidence: 0.92,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 373 | <code>                        stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 374 | <code>                        evidenceIds: [evidenceId]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 375 | <code>                    }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 376 | <code>                    relationshipUpdates: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 377 | <code>                        claim: '发生复杂改动时要清楚说明恢复边界。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 378 | <code>                        confidence: 0.9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 379 | <code>                        stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 380 | <code>                        evidenceIds: [evidenceId]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 381 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 382 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 383 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 384 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 385 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 387 | <code>    const rebuilt = await curator.rebuildFromRawMemory({</code> | 声明局部标识符 `rebuilt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 388 | <code>        maxPasses: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 389 | <code>        maxBatches: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 390 | <code>        rawLimit: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 391 | <code>        evidenceLimit: 1</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 392 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 393 | <code>    assert.equal(rebuilt.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 394 | <code>    assert.equal(rebuilt.status, 'rebuild_completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 395 | <code>    assert.equal(rebuilt.rebuild.processedEntryCount, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 396 | <code>    assert.equal(rebuilt.userProfile.items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 397 | <code>    assert.equal(rebuilt.relationshipProfile.items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 398 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 399 | <code>    const promoted = JSON.parse(await fs.readFile(path.join(memoryRoot, 'user-profile.json'), 'utf8'));</code> | 声明局部标识符 `promoted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 400 | <code>    assert.match(promoted.items[0].claim, /可恢复/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 401 | <code>    const backup = JSON.parse(await fs.readFile(</code> | 声明局部标识符 `backup`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 402 | <code>        path.join(rebuilt.rebuild.backupRoot, 'user-profile.json'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 403 | <code>        'utf8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 404 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 405 | <code>    assert.equal(backup.items[0].id, 'old-profile');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 406 | <code>    const state = await curator.getState();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 407 | <code>    assert.equal(state.rebuild.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 408 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 409 | <code>    const restarted = await curator.rebuildFromRawMemory({</code> | 声明局部标识符 `restarted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 410 | <code>        restart: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 411 | <code>        maxPasses: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 412 | <code>        maxBatches: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 413 | <code>        rawLimit: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 414 | <code>        evidenceLimit: 1</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 415 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 416 | <code>    assert.equal(restarted.status, 'rebuild_completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 417 | <code>    assert.equal(restarted.rebuild.processedEntryCount, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 418 | <code>    assert.equal(restarted.rebuild.passCount, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 419 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 421 | <code>test('AILIS curator recomputes completed rebuild counters from staged run records', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 422 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-rebuild-stats-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 423 | <code>    const memoryRoot = path.join(rootDir, 'memory');</code> | 声明局部标识符 `memoryRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 424 | <code>    const ledger = new AILISRawMemoryLedger({</code> | 声明局部标识符 `ledger`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 425 | <code>        rootDir: path.join(rootDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 426 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 427 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 428 | <code>    for (const index of [1, 2, 3]) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 429 | <code>        ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 430 | <code>            id: `raw-stats-${index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 431 | <code>            iso: `2026-07-04T10:00:0${index}.000Z`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 432 | <code>            type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 433 | <code>            source: 'chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 434 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 435 | <code>            payload: { requestPayload: { memoryUserMessage: `统计证据 ${index}` } }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 436 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 437 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 438 | <code>    const llmClient = async (request) =&gt; {</code> | 声明局部标识符 `llmClient`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 439 | <code>        const evidenceId = parseCuratorInput(request).evidence[0].id;</code> | 声明局部标识符 `evidenceId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 440 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 441 | <code>            content: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 442 | <code>                ...emptyExtraction('stats batch'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 443 | <code>                profileUpdates: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 444 | <code>                    category: 'work_style',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 445 | <code>                    claim: '用户希望重建统计可审计。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 446 | <code>                    confidence: 0.9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 447 | <code>                    stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 448 | <code>                    evidenceIds: [evidenceId]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 449 | <code>                }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>                relationshipUpdates: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 451 | <code>                    claim: '状态恢复必须报告真实进度。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 452 | <code>                    confidence: 0.9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 453 | <code>                    stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 454 | <code>                    evidenceIds: [evidenceId]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 455 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 456 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 457 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 458 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 459 | <code>    const curator = new AILISUserProfileCurator({</code> | 声明局部标识符 `curator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 460 | <code>        rootDir: memoryRoot,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 461 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 462 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 463 | <code>        llmClient</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 464 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 465 | <code>    const rebuilt = await curator.rebuildFromRawMemory({</code> | 声明局部标识符 `rebuilt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 466 | <code>        maxPasses: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 467 | <code>        maxBatches: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 468 | <code>        rawLimit: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 469 | <code>        evidenceLimit: 1</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 470 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 471 | <code>    const staleManifest = {</code> | 声明局部标识符 `staleManifest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 472 | <code>        ...rebuilt.rebuild,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 473 | <code>        status: 'promoting',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 474 | <code>        passCount: 99,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 475 | <code>        processedEntryCount: 999,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 476 | <code>        evidenceCount: 999,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 477 | <code>        profileUpdateCount: 999,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 478 | <code>        relationshipUpdateCount: 999</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 479 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 480 | <code>    const stagingCurator = new AILISUserProfileCurator({</code> | 声明局部标识符 `stagingCurator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 481 | <code>        rootDir: rebuilt.rebuild.stagingRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 482 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 483 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 484 | <code>        llmClient</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 485 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 487 | <code>    const repaired = await curator.promoteStagedRebuild(staleManifest, stagingCurator);</code> | 声明局部标识符 `repaired`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 489 | <code>    assert.equal(repaired.rebuild.passCount, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 490 | <code>    assert.equal(repaired.rebuild.processedEntryCount, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 491 | <code>    assert.equal(repaired.rebuild.evidenceCount, 3);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 492 | <code>    assert.equal(repaired.rebuild.profileUpdateCount, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 493 | <code>    assert.equal(repaired.rebuild.relationshipUpdateCount, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 494 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 495 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 496 | <code>test('AILIS curator keeps production capsules untouched when rebuild pauses and resumes the same staging run', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 497 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-rebuild-resume-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 498 | <code>    const memoryRoot = path.join(rootDir, 'memory');</code> | 声明局部标识符 `memoryRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 499 | <code>    const ledger = new AILISRawMemoryLedger({</code> | 声明局部标识符 `ledger`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 500 | <code>        rootDir: path.join(rootDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 501 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 502 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 503 | <code>    ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 504 | <code>        id: 'raw-resumable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 505 | <code>        iso: '2026-07-05T09:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 506 | <code>        type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 507 | <code>        source: 'chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 508 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 509 | <code>        payload: { requestPayload: { memoryUserMessage: '请长期记住：失败时保留旧状态。' } }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 510 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 511 | <code>    await fs.mkdir(memoryRoot, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 512 | <code>    await fs.writeFile(path.join(memoryRoot, 'user-profile.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 513 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 514 | <code>        items: [{ id: 'production-profile', claim: 'must survive failed rebuild' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 515 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 517 | <code>    const curator = new AILISUserProfileCurator({</code> | 声明局部标识符 `curator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 518 | <code>        rootDir: memoryRoot,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 519 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 520 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 521 | <code>        llmClient: async () =&gt; ({ ok: false, error: 'temporary extractor outage' })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 522 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>    const paused = await curator.rebuildFromRawMemory({ maxPasses: 1 });</code> | 声明局部标识符 `paused`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 524 | <code>    assert.equal(paused.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 525 | <code>    assert.equal(paused.status, 'rebuild_paused');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 526 | <code>    const stillProduction = JSON.parse(await fs.readFile(path.join(memoryRoot, 'user-profile.json'), 'utf8'));</code> | 声明局部标识符 `stillProduction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 527 | <code>    assert.equal(stillProduction.items[0].id, 'production-profile');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 528 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 529 | <code>    curator.llmClient = async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 530 | <code>        content: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 531 | <code>            ...emptyExtraction('recovered'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 532 | <code>            profileUpdates: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 533 | <code>                category: 'engineering_principles',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 534 | <code>                claim: '失败时保留旧状态，恢复后再替换。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 535 | <code>                confidence: 0.95,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 536 | <code>                stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 537 | <code>                evidenceIds: ['raw-resumable']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 538 | <code>            }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 539 | <code>            relationshipUpdates: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 540 | <code>                claim: '恢复动作必须可解释、可回退。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 541 | <code>                confidence: 0.9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 542 | <code>                stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 543 | <code>                evidenceIds: ['raw-resumable']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 544 | <code>            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 545 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 546 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 547 | <code>    const resumed = await curator.rebuildFromRawMemory({ maxPasses: 2 });</code> | 声明局部标识符 `resumed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 548 | <code>    assert.equal(resumed.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 549 | <code>    assert.equal(resumed.status, 'rebuild_completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 550 | <code>    assert.equal(resumed.rebuild.id, paused.rebuild.id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 551 | <code>    const replaced = JSON.parse(await fs.readFile(path.join(memoryRoot, 'user-profile.json'), 'utf8'));</code> | 声明局部标识符 `replaced`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 552 | <code>    assert.match(replaced.items[0].claim, /保留旧状态/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 553 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 554 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 555 | <code>test('AILIS user profile curator processes raw memory in resumable chronological batches', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 556 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-curator-batches-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 557 | <code>    const ledger = new AILISRawMemoryLedger({</code> | 声明局部标识符 `ledger`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 558 | <code>        rootDir: path.join(rootDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 559 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 560 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 561 | <code>    for (const index of [1, 2, 3, 4, 5]) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 562 | <code>        ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 563 | <code>            id: `raw-${index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 564 | <code>            iso: `2026-06-29T10:00:0${index}.000Z`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 565 | <code>            type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 566 | <code>            source: 'test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 567 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 568 | <code>            category: 'conversation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 569 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 570 | <code>                requestPayload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 571 | <code>                    memoryUserMessage: `用户原始经历 ${index}`</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 572 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 573 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 574 | <code>                    content: `AILIS 回复 ${index}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 575 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 576 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 577 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 578 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 580 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 581 | <code>    const curator = new AILISUserProfileCurator({</code> | 声明局部标识符 `curator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 582 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 583 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 584 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 585 | <code>        llmClient: async (request) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 586 | <code>            const input = parseCuratorInput(request);</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 587 | <code>            calls.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 588 | <code>                batch: input.batch,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 589 | <code>                evidenceIds: input.evidence.map((entry) =&gt; entry.id)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 590 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 591 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 592 | <code>                content: JSON.stringify(emptyExtraction(`batch ${calls.length}`))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 593 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 595 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 596 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 597 | <code>    const options = {</code> | 声明局部标识符 `options`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 598 | <code>        nowIso: '2026-06-30T02:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 599 | <code>        evidenceLimit: 2,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 600 | <code>        maxBatches: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 601 | <code>        rawLimit: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 602 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 603 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 604 | <code>    const first = await curator.runDailyCuration(options);</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 605 | <code>    assert.equal(first.status, 'partial_completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 606 | <code>    assert.equal(first.run.processedEntryCount, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 607 | <code>    assert.equal(first.run.remainingEntryCount, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 608 | <code>    assert.deepEqual(calls[0].evidenceIds, ['raw-1', 'raw-2']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 609 | <code>    assert.equal(first.run.cursor.lastProcessedEntryId, 'raw-2');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 610 | <code>    let state = JSON.parse(await fs.readFile(path.join(rootDir, 'memory', 'profile-curation-state.json'), 'utf8'));</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 611 | <code>    assert.equal(state.lastRunDate, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 612 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 613 | <code>    const second = await curator.runDailyCuration({</code> | 声明局部标识符 `second`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 614 | <code>        ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 615 | <code>        nowIso: '2026-06-30T03:00:00.000Z'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 616 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 617 | <code>    assert.equal(second.status, 'partial_completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 618 | <code>    assert.equal(second.run.processedEntryCount, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 619 | <code>    assert.equal(second.run.remainingEntryCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 620 | <code>    assert.deepEqual(calls[1].evidenceIds, ['raw-3', 'raw-4']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 621 | <code>    assert.equal(second.run.cursor.lastProcessedEntryId, 'raw-4');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 622 | <code>    state = JSON.parse(await fs.readFile(path.join(rootDir, 'memory', 'profile-curation-state.json'), 'utf8'));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 623 | <code>    assert.equal(state.lastRunDate, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 624 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 625 | <code>    const third = await curator.runDailyCuration({</code> | 声明局部标识符 `third`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 626 | <code>        ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 627 | <code>        nowIso: '2026-06-30T04:00:00.000Z'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 628 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 629 | <code>    assert.equal(third.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 630 | <code>    assert.equal(third.run.processedEntryCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 631 | <code>    assert.equal(third.run.remainingEntryCount, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 632 | <code>    assert.deepEqual(calls[2].evidenceIds, ['raw-5']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 633 | <code>    assert.equal(third.run.cursor.lastProcessedEntryId, 'raw-5');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 634 | <code>    state = JSON.parse(await fs.readFile(path.join(rootDir, 'memory', 'profile-curation-state.json'), 'utf8'));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 635 | <code>    assert.equal(state.lastRunDate, '2026-06-30');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 636 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 637 | <code>    const skipped = await curator.runDailyCuration({</code> | 声明局部标识符 `skipped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 638 | <code>        ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 639 | <code>        nowIso: '2026-06-30T05:00:00.000Z'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 640 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 641 | <code>    assert.equal(skipped.status, 'already_curated_today');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 642 | <code>    assert.equal(calls.length, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 643 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 644 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 645 | <code>test('AILIS curator composite cursor does not skip Raw Ledger entries that share one timestamp', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 646 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-curator-same-iso-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 647 | <code>    const ledger = new AILISRawMemoryLedger({</code> | 声明局部标识符 `ledger`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 648 | <code>        rootDir: path.join(rootDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 649 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 650 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 651 | <code>    for (const id of ['same-iso-a', 'same-iso-b']) {</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 652 | <code>        ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 653 | <code>            id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 654 | <code>            iso: '2026-07-06T10:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 655 | <code>            type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 656 | <code>            source: 'chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 657 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 658 | <code>            payload: { requestPayload: { memoryUserMessage: `evidence ${id}` } }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 659 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 660 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 661 | <code>    const seen = [];</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 662 | <code>    const curator = new AILISUserProfileCurator({</code> | 声明局部标识符 `curator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 663 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 664 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 665 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 666 | <code>        llmClient: async (request) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 667 | <code>            seen.push(parseCuratorInput(request).evidence[0].id);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 668 | <code>            return { content: JSON.stringify(emptyExtraction()) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 669 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 670 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 672 | <code>    const first = await curator.runDailyCuration({ rawLimit: 1, evidenceLimit: 1, maxBatches: 1, force: true });</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 673 | <code>    const second = await curator.runDailyCuration({ rawLimit: 1, evidenceLimit: 1, maxBatches: 1, force: true });</code> | 声明局部标识符 `second`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 674 | <code>    assert.equal(first.status, 'partial_completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 675 | <code>    assert.equal(second.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 676 | <code>    assert.deepEqual(seen, ['same-iso-a', 'same-iso-b']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 677 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 678 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 679 | <code>test('AILIS user profile curator does not advance cursor when the first LLM batch fails', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 680 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-curator-fail-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 681 | <code>    const ledger = new AILISRawMemoryLedger({</code> | 声明局部标识符 `ledger`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 682 | <code>        rootDir: path.join(rootDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 683 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 684 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 685 | <code>    for (const index of [1, 2]) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 686 | <code>        ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 687 | <code>            id: `raw-fail-${index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 688 | <code>            iso: `2026-06-29T11:00:0${index}.000Z`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 689 | <code>            type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 690 | <code>            source: 'test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 691 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 692 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 693 | <code>                requestPayload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 694 | <code>                    memoryUserMessage: `待抽取经历 ${index}`</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 695 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 696 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 697 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 698 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 699 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 700 | <code>    const curator = new AILISUserProfileCurator({</code> | 声明局部标识符 `curator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 701 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 702 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 703 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 704 | <code>        llmClient: async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 705 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 706 | <code>            error: 'extractor unavailable'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 707 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 708 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 709 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 710 | <code>    const result = await curator.runDailyCuration({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 711 | <code>        nowIso: '2026-06-30T02:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 712 | <code>        evidenceLimit: 1,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 713 | <code>        maxBatches: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 714 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 715 | <code>    assert.equal(result.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 716 | <code>    assert.equal(result.status, 'llm_failed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 717 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 718 | <code>    const loaded = await curator.loadState();</code> | 声明局部标识符 `loaded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 719 | <code>    assert.equal(loaded.state.cursor.lastProcessedIso, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 720 | <code>    assert.equal(loaded.state.cursor.lastProcessedEntryId, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 721 | <code>    assert.equal(loaded.state.runCount, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 722 | <code>    assert.equal(loaded.state.lastRunDate, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 723 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 724 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 725 | <code>test('AILIS user profile curator accepts structured provider output and the last balanced JSON object', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 726 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-curator-provider-json-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 727 | <code>    const ledger = new AILISRawMemoryLedger({</code> | 声明局部标识符 `ledger`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 728 | <code>        rootDir: path.join(rootDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 729 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 730 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 731 | <code>    ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 732 | <code>        id: 'provider-json-evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 733 | <code>        iso: '2026-07-17T00:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 734 | <code>        type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 735 | <code>        source: 'desktop_chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 736 | <code>        sessionId: 'persona-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 737 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 738 | <code>            requestPayload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 739 | <code>                memoryUserMessage: '请记住，我更喜欢简洁而有依据的回答。'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 740 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 741 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 742 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 743 | <code>    let callCount = 0;</code> | 声明局部标识符 `callCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 744 | <code>    const curator = new AILISUserProfileCurator({</code> | 声明局部标识符 `curator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 745 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 746 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 747 | <code>        llmClient: async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 748 | <code>            callCount += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 749 | <code>            if (callCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 750 | <code>                return { ok: false, code: 'empty_response', error: 'empty response' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 751 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 752 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 753 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 754 | <code>                output: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 755 | <code>                    { type: 'output_text', text: 'Example only: {"ignored":true}.\nFinal: {"daySummary":"明确表达回答偏好","profileUpdates":[{"category":"communication_style","claim":"偏好简洁而有依据的回答","operation":"add_or_merge","confidence":0.95,"stability":"candidate","evidenceIds":["provider-json-evidence"],"reason":"用户明确要求记住"}],"relationshipUpdates":[],"preferenceEvents":[],"affinityUpdate":{"trustDelta":0,"familiarityDelta":0,"warmthDelta":0,"frictionDelta":0,"repairState":"stable","reason":"无关系变化","evidenceIds":[]},"rejectedSignals":[]}' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 756 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 757 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 758 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 759 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 760 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 761 | <code>    const result = await curator.runDailyCuration({ force: true, maxBatches: 1 });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 762 | <code>    assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 763 | <code>    assert.equal(callCount, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 764 | <code>    assert.equal(result.userProfile.items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 765 | <code>    assert.match(result.userProfile.items[0].claim, /简洁而有依据/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 766 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 767 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 768 | <code>test('AILIS curator uses one production lock across rebuild and scheduled curation instances', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 769 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-curator-single-writer-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 770 | <code>    const memoryRoot = path.join(rootDir, 'memory');</code> | 声明局部标识符 `memoryRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 771 | <code>    const ledger = new AILISRawMemoryLedger({</code> | 声明局部标识符 `ledger`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 772 | <code>        rootDir: path.join(rootDir, 'raw-memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 773 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 774 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 775 | <code>    ledger.appendEntry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 776 | <code>        id: 'single-writer-evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 777 | <code>        iso: '2026-07-17T01:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 778 | <code>        type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 779 | <code>        source: 'desktop_chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 780 | <code>        sessionId: 'persona-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 781 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 782 | <code>            requestPayload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 783 | <code>                memoryUserMessage: '请记住：长期任务必须保留可恢复状态。'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 784 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 785 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 786 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 787 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 788 | <code>    let releaseLlm;</code> | 声明局部标识符 `releaseLlm`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 789 | <code>    let markLlmStarted;</code> | 声明局部标识符 `markLlmStarted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 790 | <code>    const llmStarted = new Promise((resolve) =&gt; {</code> | 声明局部标识符 `llmStarted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 791 | <code>        markLlmStarted = resolve;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 792 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 793 | <code>    const blockingLlmClient = async (request) =&gt; {</code> | 声明局部标识符 `blockingLlmClient`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 794 | <code>        const input = parseCuratorInput(request);</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 795 | <code>        markLlmStarted();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 796 | <code>        await new Promise((resolve) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 797 | <code>            releaseLlm = resolve;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 798 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 799 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 800 | <code>            content: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 801 | <code>                ...emptyExtraction('single writer rebuild'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 802 | <code>                profileUpdates: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 803 | <code>                    category: 'engineering_principles',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 804 | <code>                    claim: '长期任务必须保留可恢复状态。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 805 | <code>                    operation: 'add_or_merge',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 806 | <code>                    confidence: 0.95,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 807 | <code>                    stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 808 | <code>                    evidenceIds: [input.evidence[0].id],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 809 | <code>                    reason: '用户明确要求记住。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 810 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 811 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 812 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 813 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 814 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 815 | <code>    const manualCurator = new AILISUserProfileCurator({</code> | 声明局部标识符 `manualCurator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 816 | <code>        rootDir: memoryRoot,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 817 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 818 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 819 | <code>        llmClient: blockingLlmClient</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 820 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 821 | <code>    const scheduledCurator = new AILISUserProfileCurator({</code> | 声明局部标识符 `scheduledCurator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 822 | <code>        rootDir: memoryRoot,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 823 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 824 | <code>        rawMemoryLedger: ledger,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 825 | <code>        llmClient: async () =&gt; ({ content: JSON.stringify(emptyExtraction()) })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 826 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 827 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 828 | <code>    const rebuildPromise = manualCurator.rebuildFromRawMemory({ restart: true, maxPasses: 1 });</code> | 声明局部标识符 `rebuildPromise`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 829 | <code>    await llmStarted;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 830 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 831 | <code>    const scheduledResult = await scheduledCurator.runDailyCuration({ force: true });</code> | 声明局部标识符 `scheduledResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 832 | <code>    assert.equal(scheduledResult.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 833 | <code>    assert.equal(scheduledResult.status, 'profile_curation_already_running');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 834 | <code>    assert.equal(scheduledResult.activeOperation.operation, 'profile_rebuild');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 835 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 836 | <code>    releaseLlm();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 837 | <code>    const rebuildResult = await rebuildPromise;</code> | 声明局部标识符 `rebuildResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 838 | <code>    assert.equal(rebuildResult.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 839 | <code>    assert.equal(rebuildResult.status, 'rebuild_completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 840 | <code>    await assert.rejects(fs.access(path.join(memoryRoot, 'profile-curation.lock.json')));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 841 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 842 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 843 | <code>test('AILIS curator restores capsule JSON files with a UTF-8 BOM', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 844 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-curator-bom-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 845 | <code>    const memoryRoot = path.join(rootDir, 'memory');</code> | 声明局部标识符 `memoryRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 846 | <code>    await fs.mkdir(memoryRoot, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 847 | <code>    const writeBomJson = (name, value) =&gt; fs.writeFile(</code> | 声明局部标识符 `writeBomJson`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 848 | <code>        path.join(memoryRoot, name),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 849 | <code>        `\uFEFF${JSON.stringify(value)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 850 | <code>        'utf8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 851 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 852 | <code>    await Promise.all([</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 853 | <code>        writeBomJson('user-profile.json', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 854 | <code>            version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 855 | <code>            items: [{ id: 'profile-bom', claim: 'BOM profile survives restart.' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 856 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 857 | <code>        writeBomJson('relationship-profile.json', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 858 | <code>            version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 859 | <code>            items: [{ id: 'relationship-bom', claim: 'BOM relationship survives restart.' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 860 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 861 | <code>        writeBomJson('affinity-state.json', { version: 1, trust: 0.7 }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 862 | <code>        writeBomJson('profile-curation-state.json', { version: 1, runCount: 2 })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 863 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 864 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 865 | <code>    const curator = new AILISUserProfileCurator({ rootDir: memoryRoot });</code> | 声明局部标识符 `curator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 866 | <code>    const loaded = await curator.loadState();</code> | 声明局部标识符 `loaded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 867 | <code>    assert.equal(loaded.userProfile.items[0].claim, 'BOM profile survives restart.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 868 | <code>    assert.equal(loaded.relationshipProfile.items[0].claim, 'BOM relationship survives restart.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 869 | <code>    assert.equal(loaded.affinityState.trust, 0.7);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 870 | <code>    assert.equal(loaded.state.runCount, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-user-profile-curator 的契约与回归行为。”这一文件职责。 |
| 871 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
