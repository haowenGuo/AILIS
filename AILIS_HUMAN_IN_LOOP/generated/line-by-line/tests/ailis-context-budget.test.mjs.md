# tests/ailis-context-budget.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-context-budget 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：239
- SHA-256：`f2a609c7648421ff7a24e8f18b667a32f58a71f3a7ab2a429bb36bcc459a742d`
- 可运行副本：[打开源文件](../../../source/tests/ailis-context-budget.test.mjs)
- 依赖：`node:test`、`node:assert/strict`、`../electron/ailis-runtime-budget.cjs`、`../electron/ailis-tool-result.cjs`、`../electron/ailis-context-manager.cjs`
- 主要符号：`source`、`preview`、`report`、`result`、`deprecatedPreviewFields`、`items`、`index`、`callId`、`manager`、`pkg`、`originalTask`、`compacted`、`serialized`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>import budgetRuntime from '../electron/ailis-runtime-budget.cjs';</code> | 导入依赖 `../electron/ailis-runtime-budget.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import toolResultRuntime from '../electron/ailis-tool-result.cjs';</code> | 导入依赖 `../electron/ailis-tool-result.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import contextRuntime from '../electron/ailis-context-manager.cjs';</code> | 导入依赖 `../electron/ailis-context-manager.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    buildContextBudgetReport,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 10 | <code>    makeHeadTailPreview</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 11 | <code>} = budgetRuntime;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 12 | <code>const { normalizeAilisToolOutput } = toolResultRuntime;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 13 | <code>const { ContextManager } = contextRuntime;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>test('makeHeadTailPreview keeps head and tail while marking omitted middle text', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    const source = `HEAD-${'a'.repeat(1000)}-TAIL`;</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    const preview = makeHeadTailPreview(source, 220);</code> | 声明局部标识符 `preview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>    assert.equal(preview.truncated, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    assert.equal(preview.strategy, 'head_tail');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 21 | <code>    assert.equal(preview.originalTextChars, source.length);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 22 | <code>    assert.ok(preview.text.startsWith('HEAD-'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    assert.ok(preview.text.endsWith('-TAIL'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    assert.match(preview.text, /middle omitted for model budget/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 25 | <code>    assert.ok(preview.text.length &lt;= 220);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 26 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>test('buildContextBudgetReport classifies hard budget pressure deterministically', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 29 | <code>    const report = buildContextBudgetReport({</code> | 声明局部标识符 `report`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 30 | <code>        staticPrefix: 'system',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 31 | <code>        recentResponseItems: 'x'.repeat(3000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 32 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 33 | <code>        effectiveInputLimitTokens: 1000,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 34 | <code>        reservedOutputTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 35 | <code>        systemReserveTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 36 | <code>        softRatio: 0.5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 37 | <code>        hardRatio: 0.7,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 38 | <code>        stopRatio: 0.9</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 39 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>    assert.equal(report.schema, 'ailis.context_budget_report.v1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 42 | <code>    assert.equal(report.level, 'hard');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 43 | <code>    assert.equal(report.shouldCompact, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 44 | <code>    assert.equal(report.mustStopAndCheckpoint, false);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 45 | <code>    assert.ok(report.largestParts[0].approxTokens &gt;= report.largestParts.at(-1).approxTokens);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 46 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>test('buildContextBudgetReport treats provider input usage as authoritative', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 49 | <code>    const report = buildContextBudgetReport({</code> | 声明局部标识符 `report`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 50 | <code>        staticPrefix: 'small',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 51 | <code>        tokenInfo: { promptTokens: 760 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 52 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 53 | <code>        effectiveInputLimitTokens: 1000,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 54 | <code>        reservedOutputTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 55 | <code>        systemReserveTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 56 | <code>        softRatio: 0.5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 57 | <code>        hardRatio: 0.7,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 58 | <code>        stopRatio: 0.9</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>    assert.equal(report.level, 'hard');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 62 | <code>    assert.equal(report.providerInputTokens, 760);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 63 | <code>    assert.equal(report.effectivePromptTokens, 760);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 64 | <code>    assert.ok(report.estimatedPromptTokens &lt; report.providerInputTokens);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 65 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>test('normalizeAilisToolOutput turns large text into a model-visible preview with output ref metadata', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 68 | <code>    const result = normalizeAilisToolOutput({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 69 | <code>        content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 70 | <code>            type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 71 | <code>            text: `outputId=fetch-123\nHEAD\n${'body\n'.repeat(2200)}TAIL`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 72 | <code>        }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 73 | <code>        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 74 | <code>            status: 'completed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 75 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 77 | <code>        toolId: 'web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 78 | <code>        maxTextChars: 1800</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 79 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>    assert.equal(result.modelBudget.truncated, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 82 | <code>    assert.ok(result.modelBudget.omittedApproxTokens &gt; 0);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 83 | <code>    assert.equal(result.details.outputRef.outputId, 'fetch-123');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 84 | <code>    assert.ok(result.content[0].text.length &lt;= 1800);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 85 | <code>    assert.match(result.content[0].text, /&lt;truncated omitted_approx_tokens="\d+" \/&gt;/);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 86 | <code>    const deprecatedPreviewFields = new RegExp([</code> | 声明局部标识符 `deprecatedPreviewFields`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 87 | <code>        ['output', 'Complete'].join(''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 88 | <code>        ['output', 'TruncatedForModel'].join('')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 89 | <code>    ].join('&#124;'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 90 | <code>    assert.doesNotMatch(result.content[0].text, deprecatedPreviewFields);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 91 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>test('ContextManager can build an auditable context package and compact stale tool outputs', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 94 | <code>    const items = [];</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 95 | <code>    for (let index = 0; index &lt; 8; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 96 | <code>        const callId = `call-${index}`;</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 97 | <code>        items.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 98 | <code>            type: 'function_call',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 99 | <code>            call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 100 | <code>            name: 'web_fetch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 101 | <code>            arguments: JSON.stringify({ url: `https://example.test/${index}` })</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 102 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>        items.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 104 | <code>            type: 'function_call_output',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 105 | <code>            call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 106 | <code>            output: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 107 | <code>                'Status: completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 108 | <code>                `outputId=ref-${index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 109 | <code>                `Output:\n${'large observation\n'.repeat(400)}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 110 | <code>            ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 111 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 114 | <code>    const manager = new ContextManager({</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 115 | <code>        items,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 116 | <code>        toolOutputChars: 50000</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 117 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 118 | <code>    const pkg = manager.forPromptPackage({</code> | 声明局部标识符 `pkg`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 119 | <code>        goal: 'answer with cited evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 120 | <code>        budgetConfig: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 121 | <code>            effectiveInputLimitTokens: 1500,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 122 | <code>            reservedOutputTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 123 | <code>            systemReserveTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 124 | <code>            softRatio: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 125 | <code>            hardRatio: 0.2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 126 | <code>            stopRatio: 0.95</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 127 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>    assert.equal(pkg.schema, 'ailis.context_package.v1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 131 | <code>    assert.equal(pkg.budgetReport.schema, 'ailis.context_budget_report.v1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 132 | <code>    assert.ok(pkg.budgetReport.shouldCompact);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 133 | <code>    assert.ok(pkg.droppedItemsManifest.compactedToolObservations &gt; 0);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 134 | <code>    assert.ok(pkg.availableOutputRefs.some((ref) =&gt; ref.outputId === 'ref-0'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 135 | <code>    assert.equal(pkg.recentResponseItems.filter((item) =&gt; item.type === 'function_call_output').length, 8);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 136 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>test('ContextManager semantic compaction replaces active history while preserving task state and refs', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 139 | <code>    const originalTask = 'Research the release and answer with exact dates. Do not omit the source.';</code> | 声明局部标识符 `originalTask`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 140 | <code>    const items = [</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 141 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 142 | <code>            type: 'message',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 143 | <code>            role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 144 | <code>            content: [{ type: 'input_text', text: JSON.stringify({ type: 'context', attached_files: [{ path: 'fixture.pdf' }] }) }]</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 145 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 147 | <code>            type: 'message',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 148 | <code>            role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 149 | <code>            content: [{ type: 'input_text', text: originalTask }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 150 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 152 | <code>    for (let index = 0; index &lt; 10; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 153 | <code>        items.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 154 | <code>            type: 'function_call',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 155 | <code>            call_id: `semantic-call-${index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 156 | <code>            name: 'web_fetch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 157 | <code>            arguments: JSON.stringify({ url: `https://example.test/${index}` })</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 158 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>        items.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 160 | <code>            type: 'function_call_output',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 161 | <code>            call_id: `semantic-call-${index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 162 | <code>            output: `Status: completed\noutputId=semantic-ref-${index}\n${'evidence '.repeat(800)}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 163 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>    const manager = new ContextManager({ items, toolOutputChars: 50000 });</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 166 | <code>    const compacted = manager.semanticCompact({</code> | 声明局部标识符 `compacted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 167 | <code>        force: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 168 | <code>        goal: originalTask,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 169 | <code>        constraints: ['Do not omit the source.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 170 | <code>        currentPlan: { items: [{ step: 'verify dates', status: 'in_progress' }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 171 | <code>        unresolvedFields: ['official publication date'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 172 | <code>        taskState: { progress: { toolCalls: 10 } },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 173 | <code>        pinnedEvidenceManifest: [{ id: 'artifact-date', summary: 'Official date evidence' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 174 | <code>        budgetConfig: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 175 | <code>            effectiveInputLimitTokens: 2000,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 176 | <code>            reservedOutputTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 177 | <code>            systemReserveTokens: 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 178 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>    assert.equal(compacted.compacted, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 182 | <code>    assert.equal(manager.historyVersion(), 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 183 | <code>    assert.ok(manager.rawItems().length &lt; items.length);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 184 | <code>    const serialized = JSON.stringify(manager.rawItems());</code> | 声明局部标识符 `serialized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 185 | <code>    assert.match(serialized, /Research the release and answer with exact dates/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 186 | <code>    assert.match(serialized, /fixture\.pdf/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 187 | <code>    assert.match(serialized, /official publication date/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 188 | <code>    assert.match(serialized, /artifact-date/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 189 | <code>    assert.match(serialized, /semantic-ref-9/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 190 | <code>    assert.equal(compacted.checkpoint.originalGoalPreservedVerbatim, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 191 | <code>    assert.equal(compacted.checkpoint.originalGoal, originalTask);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 192 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>test('Persona semantic compaction keeps recent visible user and assistant turns plus active task context', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 195 | <code>    const items = [{</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 196 | <code>        type: 'message',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 197 | <code>        role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 198 | <code>        content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 199 | <code>            type: 'input_text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 200 | <code>            text: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 201 | <code>                type: 'context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 202 | <code>                memory_context: '【当前活动任务状态】\ntask: 完成木偶攻略\nstatus: max_loop'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 203 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 204 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>    for (let index = 0; index &lt; 20; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 207 | <code>        items.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 208 | <code>            type: 'message',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 209 | <code>            role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 210 | <code>            content: [{ type: 'input_text', text: `用户消息 ${index} ${'x'.repeat(500)}` }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 211 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>        items.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 213 | <code>            type: 'message',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 214 | <code>            role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 215 | <code>            content: [{ type: 'output_text', text: `AILIS 回复 ${index} ${'y'.repeat(500)}` }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 216 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>    const manager = new ContextManager({ items, toolOutputChars: 50000 });</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 219 | <code>    const compacted = manager.semanticCompact({</code> | 声明局部标识符 `compacted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 220 | <code>        force: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 221 | <code>        contextMode: 'persona',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 222 | <code>        goal: '跑完',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 223 | <code>        taskState: { task: '完成木偶攻略', status: 'max_loop' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 224 | <code>        personaVisibleHistoryChars: 5000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 225 | <code>        budgetConfig: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 226 | <code>            effectiveInputLimitTokens: 2000,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 227 | <code>            reservedOutputTokens: 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 228 | <code>            systemReserveTokens: 0</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 229 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 232 | <code>    const serialized = JSON.stringify(manager.rawItems());</code> | 声明局部标识符 `serialized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 233 | <code>    assert.equal(compacted.compacted, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 234 | <code>    assert.match(serialized, /当前活动任务状态/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 235 | <code>    assert.match(serialized, /用户消息 19/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 236 | <code>    assert.match(serialized, /AILIS 回复 19/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 237 | <code>    assert.doesNotMatch(serialized, /用户消息 0/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 238 | <code>    assert.equal(compacted.checkpoint.contextMode, 'persona');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-budget 的契约与回归行为。”这一文件职责。 |
| 239 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
