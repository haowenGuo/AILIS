# tests/codex-model-bridge.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 codex-model-bridge 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：406
- SHA-256：`f26b8a27c3d58609a8c0fbd50759bc039c3d0b1e12e92d630f9ee83707d5eda9`
- 可运行副本：[打开源文件](../../../source/tests/codex-model-bridge.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:module`、`node:test`、`../electron/codex-model-bridge.cjs`、`../electron/desktop-llm-provider.cjs`
- 主要符号：`require`、`visibleTools`、`schema`、`branches`、`webSearch`、`handoff`、`argumentsSchema`、`prompt`、`workspace`、`dataUrl`、`messages`、`input`、`audit`、`calls`、`ephemeralWorkspace`、`capabilities`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import { describe, it } from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 9 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 10 | <code>    buildCodexBridgeDecisionSchema,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 11 | <code>    buildCodexBridgePrompt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    buildCodexBridgeTurnInput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    buildProcessTreeTerminationPlan,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    normalizeBridgeToolCalls,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    normalizeCodexUsage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    parseCodexAppServerNotifications,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    parseCodexJsonlEvents,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    resolveCodexBridgeMaxAttempts,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    resolveCodexEntrypoint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    shouldRetryCodexBridgeFailure</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 21 | <code>} = require('../electron/codex-model-bridge.cjs');</code> | 导入依赖 `../electron/codex-model-bridge.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 22 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    getDefaultProviderBaseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    getDefaultProviderModel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 25 | <code>    getProviderCapabilities</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 26 | <code>} = require('../electron/desktop-llm-provider.cjs');</code> | 导入依赖 `../electron/desktop-llm-provider.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>const visibleTools = [</code> | 声明局部标识符 `visibleTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 29 | <code>    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 30 | <code>        name: 'read_document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 31 | <code>        description: 'Read a document through the AILIS harness.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 32 | <code>        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 33 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 34 | <code>            additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 35 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 36 | <code>                path: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 37 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>            required: ['path']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 39 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 42 | <code>        name: 'web_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 43 | <code>        description: 'Search through the AILIS web backend.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 44 | <code>        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 45 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 46 | <code>            additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 47 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 48 | <code>                query: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 49 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>            required: ['query']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 51 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>describe('Codex model bridge process lifecycle', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 56 | <code>    it('terminates the full Windows process tree for ephemeral app-server inference', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 57 | <code>        assert.deepEqual(buildProcessTreeTerminationPlan(4242, 'win32'), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 58 | <code>            command: 'taskkill.exe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 59 | <code>            args: ['/pid', '4242', '/t', '/f']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 60 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>    it('uses a detached process-group signal on POSIX and rejects invalid pids', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 64 | <code>        assert.deepEqual(buildProcessTreeTerminationPlan(4242, 'linux'), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 65 | <code>            signalPid: -4242,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 66 | <code>            signal: 'SIGTERM'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 67 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>        assert.equal(buildProcessTreeTerminationPlan(0, 'win32'), null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 69 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>    it('retries only transient model-only transport failures and caps attempts', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 72 | <code>        assert.equal(shouldRetryCodexBridgeFailure({ code: 'timeout' }), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        assert.equal(shouldRetryCodexBridgeFailure({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 74 | <code>            code: 'codex_process_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 75 | <code>            error: 'Codex exited with code 1.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 76 | <code>        }), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 77 | <code>        assert.equal(shouldRetryCodexBridgeFailure({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 78 | <code>            code: 'codex_usage_limited',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 79 | <code>            error: 'Usage limit reached.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 80 | <code>        }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 81 | <code>        assert.equal(shouldRetryCodexBridgeFailure({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 82 | <code>            code: 'codex_process_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 83 | <code>            error: 'Authentication required.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 84 | <code>        }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 85 | <code>        assert.equal(shouldRetryCodexBridgeFailure({ code: 'cancelled' }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 86 | <code>        assert.equal(shouldRetryCodexBridgeFailure({ code: 'invalid_codex_bridge_output' }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 87 | <code>        assert.equal(resolveCodexBridgeMaxAttempts({}), 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 88 | <code>        assert.equal(resolveCodexBridgeMaxAttempts({ codexBridgeMaxAttempts: 9 }), 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 89 | <code>        assert.equal(resolveCodexBridgeMaxAttempts({ codexBridgeMaxAttempts: 1 }), 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 90 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>describe('Codex model bridge', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 94 | <code>    it('constrains required decisions to the AILIS-visible tool schema', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 95 | <code>        const schema = buildCodexBridgeDecisionSchema(visibleTools, {</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 96 | <code>            toolChoice: { name: 'read_document' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 97 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>        assert.equal(schema.properties.tool_calls.minItems, 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 100 | <code>        assert.deepEqual(schema.properties.tool_calls.items.properties.name.enum, ['read_document']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 101 | <code>        assert.equal(schema.properties.tool_calls.items.properties.arguments.type, 'object');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 102 | <code>        assert.deepEqual(schema.properties.tool_calls.items.properties.arguments.required, ['path']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 103 | <code>        assert.match(schema.properties.tool_calls.items.properties.arguments.description, /do not emit an empty object/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 104 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 105 | <code>            schema.properties.tool_calls.items.required,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 106 | <code>            ['id', 'name', 'arguments']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 107 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>    it('uses per-tool argument branches and preserves tools that legitimately accept empty input', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 111 | <code>        const schema = buildCodexBridgeDecisionSchema([</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 112 | <code>            ...visibleTools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 113 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 114 | <code>                name: 'handoff_task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 115 | <code>                description: 'Handoff with no model-authored fields.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 116 | <code>                parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 117 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 118 | <code>                    properties: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 119 | <code>                    additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 120 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>        const branches = schema.properties.tool_calls.items.anyOf;</code> | 声明局部标识符 `branches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 124 | <code>        const webSearch = branches.find((branch) =&gt; branch.properties.name.enum[0] === 'web_search');</code> | 声明局部标识符 `webSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 125 | <code>        const handoff = branches.find((branch) =&gt; branch.properties.name.enum[0] === 'handoff_task');</code> | 声明局部标识符 `handoff`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>        assert.deepEqual(webSearch.properties.arguments.required, ['query']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 128 | <code>        assert.deepEqual(handoff.properties.arguments.properties, {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 129 | <code>        assert.match(handoff.properties.arguments.description, /empty object is allowed/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 130 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>    it('compiles optional and minProperties fields into the Codex structured-output subset', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 133 | <code>        const schema = buildCodexBridgeDecisionSchema([{</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 134 | <code>            name: 'web_run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 135 | <code>            parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 136 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 137 | <code>                minProperties: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 138 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 139 | <code>                    search_query: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 140 | <code>                        type: 'array',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 141 | <code>                        minItems: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 142 | <code>                        items: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 143 | <code>                            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 144 | <code>                            required: ['q'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 145 | <code>                            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 146 | <code>                                q: { type: 'string', minLength: 1 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 147 | <code>                                recency: { type: 'integer', minimum: 0 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 148 | <code>                            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>                            additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 150 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 152 | <code>                    open: { type: 'array', items: { type: 'string' } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 153 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>                additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 155 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>        }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>        const argumentsSchema = schema.properties.tool_calls.items.properties.arguments;</code> | 声明局部标识符 `argumentsSchema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>        assert.equal(argumentsSchema.minProperties, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 160 | <code>        assert.equal(argumentsSchema.anyOf.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 161 | <code>        assert.deepEqual(argumentsSchema.anyOf[0].required, ['search_query', 'open']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 162 | <code>        assert.equal(argumentsSchema.anyOf[0].properties.search_query.type, 'array');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 163 | <code>        assert.equal(argumentsSchema.anyOf[0].properties.open.anyOf[1].type, 'null');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 164 | <code>        assert.match(argumentsSchema.anyOf[0].properties.open.anyOf[1].description, /Prefer null unless/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 165 | <code>        assert.deepEqual(argumentsSchema.anyOf[0].properties.search_query.items.required, ['q', 'recency']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 166 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 167 | <code>            argumentsSchema.anyOf[0].properties.search_query.items.properties.recency.anyOf[1].type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 168 | <code>            'null'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 169 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>    it('repairs incomplete array items and object anyOf requirements for dynamic tools', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 173 | <code>        const schema = buildCodexBridgeDecisionSchema([{</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 174 | <code>            name: 'paper_lookup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 175 | <code>            parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 176 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 177 | <code>                anyOf: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 178 | <code>                    { required: ['title'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 179 | <code>                    { required: ['author'] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 180 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 181 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 182 | <code>                    title: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 183 | <code>                    author: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 184 | <code>                    queries: { type: 'array' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 185 | <code>                    mode: { enum: ['exact', 'fuzzy'] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 186 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>                additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 188 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>        }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>        const argumentsSchema = schema.properties.tool_calls.items.properties.arguments;</code> | 声明局部标识符 `argumentsSchema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>        assert.equal(argumentsSchema.type, 'object');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 193 | <code>        assert.equal(argumentsSchema.anyOf, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 194 | <code>        assert.deepEqual(argumentsSchema.required, ['title', 'author', 'queries', 'mode']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 195 | <code>        assert.equal(argumentsSchema.properties.title.anyOf[0].type, 'string');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 196 | <code>        assert.equal(argumentsSchema.properties.author.anyOf[1].type, 'null');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 197 | <code>        assert.equal(argumentsSchema.properties.queries.anyOf[0].items.type, 'string');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 198 | <code>        assert.equal(argumentsSchema.properties.mode.anyOf[0].type, 'string');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 199 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 201 | <code>    it('preserves type-scrambled fields as model-selected JSON scalars', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 202 | <code>        const schema = buildCodexBridgeDecisionSchema([{</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 203 | <code>            name: 'search_holiday',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 204 | <code>            parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 205 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 206 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 207 | <code>                    holiday_name: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 208 | <code>                        description: 'Name of the holiday'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 209 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>                    year: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 211 | <code>                        description: 'Optional year to search'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 212 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 213 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>                required: ['holiday_name']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 215 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>        }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>        const argumentsSchema = schema.properties.tool_calls.items.properties.arguments;</code> | 声明局部标识符 `argumentsSchema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 219 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 220 | <code>            argumentsSchema.properties.holiday_name.anyOf.map((branch) =&gt; branch.type),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 221 | <code>            ['string', 'number', 'boolean']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 222 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 223 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 224 | <code>            argumentsSchema.properties.year.anyOf.map((branch) =&gt; branch.type),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 225 | <code>            ['string', 'number', 'boolean', 'null']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 226 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>        assert.match(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 228 | <code>            argumentsSchema.properties.year.anyOf.at(-1).description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 229 | <code>            /runtime context and plausible defaults are not evidence/i</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 230 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>    it('serializes AILIS-owned messages, tool history, and tool contracts into one inference', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 234 | <code>        const prompt = buildCodexBridgePrompt([</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 235 | <code>            { role: 'system', content: 'AILIS system prompt' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 236 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 237 | <code>                role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 238 | <code>                content: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 239 | <code>                toolCalls: [{ id: 'call_1', name: 'web_search', arguments: { query: 'test' } }]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 240 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 241 | <code>            { role: 'tool', toolCallId: 'call_1', content: '{"results":["evidence"]}' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 242 | <code>        ], visibleTools, {});</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>        assert.match(prompt, /AILIS, not Codex, owns context, memory, tool execution/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 245 | <code>        assert.match(prompt, /Do not call or simulate any Codex tool/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 246 | <code>        assert.match(prompt, /AILIS system prompt/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 247 | <code>        assert.match(prompt, /call_1/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 248 | <code>        assert.match(prompt, /evidence/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 249 | <code>        assert.match(prompt, /read_document/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 250 | <code>        assert.match(prompt, /Never emit an empty object/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 251 | <code>        assert.match(prompt, /Do not fill optional fields from runtime dates/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 252 | <code>        assert.match(prompt, /copy the exact literal text into the first lookup/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 253 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>    it('sends image bytes through native app-server image input instead of embedding base64 in the prompt', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 256 | <code>        const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-codex-vision-'));</code> | 声明局部标识符 `workspace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 257 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 258 | <code>            const dataUrl = `data:image/png;base64,${Buffer.from('not-a-real-png-but-valid-bytes').toString('base64')}`;</code> | 声明局部标识符 `dataUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 259 | <code>            const messages = [{</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 260 | <code>                role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 261 | <code>                content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 262 | <code>                    { type: 'text', text: 'Describe this image.' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 263 | <code>                    { type: 'image_url', image_url: { url: dataUrl }, detail: 'high' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 264 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 265 | <code>            }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>            const prompt = buildCodexBridgePrompt(messages, [], {});</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 267 | <code>            const input = await buildCodexBridgeTurnInput({ prompt, messages, workspace });</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>            assert.doesNotMatch(prompt, /bm90LWEtcmVhbC1wbmc/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 270 | <code>            assert.match(prompt, /image_attachment/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 271 | <code>            assert.equal(input[0].type, 'text');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 272 | <code>            assert.equal(input[1].type, 'localImage');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 273 | <code>            assert.equal(input[1].detail, 'high');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 274 | <code>            assert.equal(path.dirname(input[1].path), workspace);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 275 | <code>            assert.equal((await fs.stat(input[1].path)).isFile(), true);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 276 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 277 | <code>            await fs.rm(workspace, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 278 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 279 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>    it('rejects Codex harness activity while accepting reasoning and the final model message', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 282 | <code>        const audit = parseCodexJsonlEvents([</code> | 声明局部标识符 `audit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 283 | <code>            JSON.stringify({ type: 'item.completed', item: { id: 'r1', type: 'reasoning' } }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 284 | <code>            JSON.stringify({ type: 'item.completed', item: { id: 'm1', type: 'agent_message' } }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 285 | <code>            JSON.stringify({ type: 'turn.completed', usage: { input_tokens: 10, output_tokens: 4 } }),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 286 | <code>            JSON.stringify({ type: 'item.started', item: { id: 'c1', type: 'command_execution' } })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 287 | <code>        ].join('\n'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>        assert.deepEqual(audit.usage, { input_tokens: 10, output_tokens: 4 });</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 290 | <code>        assert.deepEqual(audit.contamination, [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 291 | <code>            eventType: 'item.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 292 | <code>            itemType: 'command_execution',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 293 | <code>            itemId: 'c1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 294 | <code>        }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 295 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>    it('audits app-server turns as model-only and records server-side callbacks as contamination', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 298 | <code>        const audit = parseCodexAppServerNotifications([</code> | 声明局部标识符 `audit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 299 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 300 | <code>                method: 'item/completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 301 | <code>                params: { item: { id: 'u1', type: 'userMessage', content: [] } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 302 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 304 | <code>                method: 'item/completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 305 | <code>                params: { item: { id: 'r1', type: 'reasoning', summary: [], content: [] } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 306 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 308 | <code>                method: 'item/completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 309 | <code>                params: { item: { id: 'm1', type: 'agentMessage', text: '{"content":"OK"}' } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 310 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 312 | <code>                method: 'thread/tokenUsage/updated',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 313 | <code>                params: { tokenUsage: { last: { inputTokens: 42, outputTokens: 7 } } }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 314 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 315 | <code>        ], [{ id: 9, method: 'item/tool/call' }]);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 317 | <code>        assert.equal(audit.agentText, '{"content":"OK"}');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 318 | <code>        assert.deepEqual(audit.usage, { inputTokens: 42, outputTokens: 7 });</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 319 | <code>        assert.deepEqual(audit.contamination, [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 320 | <code>            method: 'item/tool/call',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 321 | <code>            requestId: 9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 322 | <code>            itemType: 'server_request'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 323 | <code>        }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 324 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>    it('normalizes bridge decisions to the existing AILIS provider contract', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 327 | <code>        const calls = normalizeBridgeToolCalls([</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 328 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 329 | <code>                id: 'bridge_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 330 | <code>                name: 'web_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 331 | <code>                arguments: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 332 | <code>                    query: 'GAIA',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 333 | <code>                    recency: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 334 | <code>                    domains: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 335 | <code>                    nested: { optional: null },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 336 | <code>                    artifactHandle: {}</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 337 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 339 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 341 | <code>        assert.equal(calls[0].id, 'bridge_1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 342 | <code>        assert.equal(calls[0].name, 'web_search');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 343 | <code>        assert.deepEqual(calls[0].arguments, { query: 'GAIA' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 344 | <code>        assert.equal(calls[0].rawArguments, '{"query":"GAIA"}');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 345 | <code>        assert.equal(calls[0].provider, 'codex-model-bridge');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 346 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 348 | <code>    it('removes the ephemeral Codex backend cwd from AILIS tool arguments', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 349 | <code>        const ephemeralWorkspace = path.join(os.tmpdir(), 'ailis-codex-model-bridge-test', 'workspace');</code> | 声明局部标识符 `ephemeralWorkspace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 350 | <code>        const calls = normalizeBridgeToolCalls([</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 351 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 352 | <code>                id: 'bridge_exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 353 | <code>                name: 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 354 | <code>                arguments: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 355 | <code>                    command: 'python',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 356 | <code>                    args: ['script.py'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 357 | <code>                    workdir: ephemeralWorkspace</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 358 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 361 | <code>                id: 'bridge_read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 362 | <code>                name: 'read_document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 363 | <code>                arguments: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 364 | <code>                    path: 'F:\\workspace\\report.docx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 365 | <code>                    cwd: 'F:\\workspace'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 366 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 367 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>        ], { ephemeralWorkspace });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 370 | <code>        assert.deepEqual(calls[0].arguments, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 371 | <code>            command: 'python',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 372 | <code>            args: ['script.py']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 373 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 374 | <code>        assert.equal(calls[1].arguments.cwd, 'F:\\workspace');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 375 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 377 | <code>    it('maps app-server token usage into the existing provider usage contract', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 378 | <code>        assert.deepEqual(normalizeCodexUsage({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 379 | <code>            totalTokens: 100,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 380 | <code>            inputTokens: 70,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 381 | <code>            cachedInputTokens: 20,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 382 | <code>            outputTokens: 30,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 383 | <code>            reasoningOutputTokens: 12</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 384 | <code>        }), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 385 | <code>            prompt_tokens: 70,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 386 | <code>            completion_tokens: 30,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 387 | <code>            total_tokens: 100,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 388 | <code>            prompt_tokens_details: { cached_tokens: 20 },</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 389 | <code>            completion_tokens_details: { reasoning_tokens: 12 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 390 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 391 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 393 | <code>    it('registers ChatGPT OAuth defaults without exposing Codex as an AILIS tool executor', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 394 | <code>        const capabilities = getProviderCapabilities({</code> | 声明局部标识符 `capabilities`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 395 | <code>            provider: 'codex-model-bridge',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 396 | <code>            model: 'gpt-5.5'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 397 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 398 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 399 | <code>        assert.equal(getDefaultProviderBaseUrl('codex-model-bridge'), 'codex://chatgpt-oauth');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 400 | <code>        assert.equal(getDefaultProviderModel('codex-model-bridge'), 'gpt-5.5');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 401 | <code>        assert.equal(capabilities.transport, 'codex-app-server-ephemeral');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 402 | <code>        assert.equal(capabilities.nativeToolCalling, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 403 | <code>        assert.equal(capabilities.vision, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 404 | <code>        assert.equal(resolveCodexEntrypoint().ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 codex-model-bridge 的契约与回归行为。”这一文件职责。 |
| 405 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 406 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
