# tests/ailis-turn-items.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-turn-items 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：436
- SHA-256：`da37567d709b79cb0e9f69b3af32b9f331679e13717047b8173aecb41083b6a2`
- 可运行副本：[打开源文件](../../../source/tests/ailis-turn-items.test.mjs)
- 依赖：`node:assert/strict`、`node:test`、`../electron/ailis-turn-items.cjs`
- 主要符号：`promptObject`、`script`、`item`、`events`、`items`、`tableRows`、`documentText`、`rows`、`artifactPreview`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 4 | <code>    buildAilisThreadItems,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 5 | <code>    buildObservationLedgerPromptObject</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 6 | <code>} from '../electron/ailis-turn-items.cjs';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>test('Observation ledger maps tool calls and results into chronological AILIS thread items', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    const promptObject = buildObservationLedgerPromptObject({</code> | 声明局部标识符 `promptObject`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 10 | <code>        events: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 11 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 12 | <code>                type: 'tool_call',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 13 | <code>                id: 'step-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 14 | <code>                title: 'Read paper notes',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 15 | <code>                tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 16 | <code>                args: { action: 'read', path: 'paper.md' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 17 | <code>                iteration: 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 18 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 19 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 20 | <code>                type: 'tool_result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 21 | <code>                id: 'step-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 22 | <code>                title: 'Read paper notes',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 23 | <code>                tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 24 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 25 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 26 | <code>                preview: 'memory stream, reflection, planning',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 27 | <code>                iteration: 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 28 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>    assert.equal(promptObject.model, 'ailis_observation_ledger');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 33 | <code>    assert.equal(promptObject.schema, 'ailis.observation_ledger.v1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 34 | <code>    assert.match(promptObject.note, /canonical AILIS tool outputs/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 35 | <code>    assert.equal(promptObject.items[0].type, 'tool_call');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 36 | <code>    assert.equal(promptObject.items[0].status, 'started');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 37 | <code>    assert.equal(promptObject.items[1].type, 'tool_result');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 38 | <code>    assert.equal(promptObject.items[1].status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 39 | <code>    assert.match(promptObject.items[1].preview, /reflection/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 40 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>test('Observation ledger summarizes large tool call args before they enter the prompt', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 43 | <code>    const script = [</code> | 声明局部标识符 `script`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 44 | <code>        'from openpyxl import load_workbook',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 45 | <code>        'wb = load_workbook("task.xlsx")',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 46 | <code>        'print("answer", "F478A7")'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 47 | <code>    ].join('\n') + '\n' + 'print("padding")\n'.repeat(900);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>    const promptObject = buildObservationLedgerPromptObject({</code> | 声明局部标识符 `promptObject`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 50 | <code>        events: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 51 | <code>            type: 'tool_call',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 52 | <code>            id: 'step-write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 53 | <code>            title: 'Write solver script',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 54 | <code>            tool: 'write',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 55 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 56 | <code>                path: 'solve_puzzle.py',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 57 | <code>                content: script,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 58 | <code>                api_token: 'secret-value'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 59 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>            iteration: 4</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 61 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>    const item = promptObject.items[0];</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 65 | <code>    assert.equal(item.type, 'tool_call');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 66 | <code>    assert.equal(item.args.path, 'solve_puzzle.py');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 67 | <code>    assert.equal(item.args.api_token, '__REDACTED__');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 68 | <code>    assert.equal(item.args.content.omitted, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 69 | <code>    assert.equal(item.args.content.kind, 'large_text_arg');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 70 | <code>    assert.equal(item.args.content.chars, script.length);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 71 | <code>    assert.match(item.args.content.sha1, /^[a-f0-9]{12}$/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 72 | <code>    assert.ok(JSON.stringify(promptObject).length &lt; 2000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 73 | <code>    assert.doesNotMatch(JSON.stringify(promptObject), /padding"\)\nprint\("padding"\)\nprint\("padding/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 74 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>test('Observation ledger compacts older observations while keeping recent observations detailed', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 77 | <code>    const events = Array.from({ length: 18 }, (_, index) =&gt; ({</code> | 声明局部标识符 `events`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 78 | <code>        type: 'tool_result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 79 | <code>        id: `step-${index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 80 | <code>        title: `Tool ${index}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 81 | <code>        tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 82 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 83 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 84 | <code>        preview: `observation-${index} ${'x'.repeat(500)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 85 | <code>        iteration: index</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 86 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>    const promptObject = buildObservationLedgerPromptObject({</code> | 声明局部标识符 `promptObject`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 88 | <code>        events,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 89 | <code>        maxItems: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 90 | <code>        recentFullItems: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 91 | <code>        olderPreviewChars: 80</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 92 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>    assert.equal(promptObject.items.length, 8);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 95 | <code>    assert.equal(promptObject.retention.omitted_items, 10);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 96 | <code>    assert.equal(promptObject.retention.strategy, 'ailis_recent_observation_window');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 97 | <code>    assert.equal(promptObject.items[0].compacted, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 98 | <code>    assert.ok(promptObject.items[0].preview.length &lt; 160);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 99 | <code>    assert.equal(promptObject.items[7].compacted, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 100 | <code>    assert.match(promptObject.items[7].preview, /observation-17/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 101 | <code>    assert.match(promptObject.latest_observation.preview, /observation-17/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 102 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>test('AILIS thread items keep failed tool observations available for the next model decision', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 105 | <code>    const items = buildAilisThreadItems({</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 106 | <code>        stepResults: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 107 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 108 | <code>                id: 'step-failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 109 | <code>                title: 'Parse HTML',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 110 | <code>                tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 111 | <code>                args: { action: 'exec', command: 'pup ".title text{}"' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 112 | <code>                iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 113 | <code>                response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 114 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 115 | <code>                    status: 'tool_failed',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 116 | <code>                    error: "'pup' is not recognized as an internal or external command"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 117 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 118 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>    assert.equal(items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 123 | <code>    assert.equal(items[0].type, 'tool_result');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 124 | <code>    assert.equal(items[0].status, 'failed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 125 | <code>    assert.equal(items[0].result_status, 'tool_failed');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 126 | <code>    assert.match(items[0].preview, /pup/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 127 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>test('AILIS thread items classify Windows command-not-found failures without recovery hints', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 130 | <code>    const items = buildAilisThreadItems({</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 131 | <code>        stepResults: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 132 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 133 | <code>                id: 'step-python3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 134 | <code>                title: 'Parse arXiv page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 135 | <code>                tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 136 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 137 | <code>                    action: 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 138 | <code>                    command: 'python3 -c "print(1)" &gt; paper_metadata.txt'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 139 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>                iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 141 | <code>                response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 142 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 143 | <code>                    status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 144 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 145 | <code>                        content: [{ type: 'text', text: 'exitCode=9009' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 146 | <code>                        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 147 | <code>                            action: 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 148 | <code>                            command: 'python3 -c "print(1)" &gt; paper_metadata.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 149 | <code>                            exitCode: 9009,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 150 | <code>                            stdout: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 151 | <code>                            stderr: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 152 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 155 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>    assert.equal(items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 160 | <code>    assert.equal(items[0].status, 'failed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 161 | <code>    assert.equal(items[0].error_type, 'missing_dependency');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 162 | <code>    assert.match(items[0].preview, /python3/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 163 | <code>    assert.equal(items[0].recovery_hint, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 164 | <code>    assert.equal(items[0].alternatives, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 165 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>test('AILIS thread items keep web_search snippets neutral instead of adding evidence-gap follow-up hints', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 168 | <code>    const items = buildAilisThreadItems({</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 169 | <code>        stepResults: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 170 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 171 | <code>                id: 'step-search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 172 | <code>                title: 'Search Kaggle strategy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 173 | <code>                tool: 'mcp__ailis_research__web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 174 | <code>                args: { query: 'Kaggle AI攻防 competition latest 攻略' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 175 | <code>                iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 176 | <code>                response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 177 | <code>                    ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 178 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 179 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 180 | <code>                        content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 181 | <code>                            type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 182 | <code>                            text: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 183 | <code>                                'Candidate snippets from search results:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 184 | <code>                                '1. Kaggle AI strategy guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 185 | <code>                                'URL: https://www.kaggle.com/'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 186 | <code>                            ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 187 | <code>                        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>    assert.equal(items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 195 | <code>    assert.equal(items[0].status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 196 | <code>    assert.equal(items[0].evidence_gap, null);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 197 | <code>    assert.equal(items[0].recovery_hint, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 198 | <code>    assert.equal(items[0].alternatives, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 199 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 201 | <code>test('AILIS thread items preserve complete structured document table previews for reasoning', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 202 | <code>    const tableRows = Array.from({ length: 90 }, (_, index) =&gt; `Person ${index + 1} &#124; Recipient ${index + 1} &#124; ${'profile clue '.repeat(3)}`).join('\n');</code> | 声明局部标识符 `tableRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 203 | <code>    const documentText = [</code> | 声明局部标识符 `documentText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 204 | <code>        '# DOCUMENT_READ_COMPLETE',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 205 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 206 | <code>        'paragraph_count: 8',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 207 | <code>        'table_count: 1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 208 | <code>        'truncated: false',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 209 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 210 | <code>        '## Paragraphs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 211 | <code>        '[0] Employees',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 212 | <code>        '[1] Gift Assignments',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 213 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 214 | <code>        '## Tables',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 215 | <code>        'Table 1 rows=29',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 216 | <code>        'Giver &#124; Recipient',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 217 | <code>        tableRows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 218 | <code>        'Final Sender &#124; Final Recipient'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 219 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>    const items = buildAilisThreadItems({</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 222 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 223 | <code>            id: 'step-doc',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 224 | <code>            title: 'Read DOCX',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 225 | <code>            tool: 'mcp__ailis_research__read_document',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 226 | <code>            args: { path: 'task.docx' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 227 | <code>            iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 228 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 229 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 230 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 231 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 232 | <code>                    content: [{ type: 'text', text: documentText }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 233 | <code>                    details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 234 | <code>                        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 235 | <code>                        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 236 | <code>                        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 237 | <code>                        reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 238 | <code>                        paragraphCount: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 239 | <code>                        tableCount: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 240 | <code>                        observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 241 | <code>                            complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 242 | <code>                            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 243 | <code>                            reasoning_ready: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 244 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 246 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 247 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 248 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 249 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>    assert.equal(items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 252 | <code>    assert.match(items[0].preview, /Final Sender \&#124; Final Recipient/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 253 | <code>    assert.doesNotMatch(items[0].preview, /truncated for model budget/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 254 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>test('Observation ledger preserves artifact_tools preview-only query observations for reasoning', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 257 | <code>    const rows = Array.from({ length: 20 }, (_, index) =&gt; ({</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 258 | <code>        rowNumber: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 259 | <code>        cells: index === 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 260 | <code>            ? 'START &#124; #0099FF &#124; #0099FF &#124; #0099FF'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 261 | <code>            : (index === 19</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 262 | <code>                ? '#0099FF &#124; #92D050 &#124; #F478A7 &#124; END'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 263 | <code>                : `#F478A7 &#124; #0099FF &#124; #92D050 &#124; row-${index + 1}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 264 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 265 | <code>    const artifactPreview = JSON.stringify({</code> | 声明局部标识符 `artifactPreview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 266 | <code>        schema: 'ailis.artifact_tools.tool_api_result.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 267 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 268 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 269 | <code>        action: 'query',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 270 | <code>        adapterId: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 271 | <code>        observation: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 272 | <code>            schema: 'ailis.artifact_tools.compact_observation.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 273 | <code>            format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 274 | <code>            action: 'query',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 275 | <code>            sheetName: 'Sheet1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 276 | <code>            range: 'Sheet1!A1:D20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 277 | <code>            rowCount: 20,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 278 | <code>            columnCount: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 279 | <code>            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 280 | <code>            columns: ['A', 'B', 'C', 'D'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 281 | <code>            compactRows: rows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 282 | <code>            candidateCount: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 283 | <code>            diagnostics: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 284 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>    }, null, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 286 | <code>    assert.ok(artifactPreview.length &gt; 1000);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 287 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 288 | <code>    const promptObject = buildObservationLedgerPromptObject({</code> | 声明局部标识符 `promptObject`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 289 | <code>        events: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 290 | <code>            type: 'tool_result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 291 | <code>            id: 'step-artifact-query',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 292 | <code>            title: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 293 | <code>            tool: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 294 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 295 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 296 | <code>            preview: artifactPreview,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 297 | <code>            iteration: 4</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 298 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>    assert.equal(promptObject.items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 302 | <code>    assert.match(promptObject.items[0].preview, /START/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 303 | <code>    assert.match(promptObject.items[0].preview, /rowNumber": 11/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 304 | <code>    assert.match(promptObject.items[0].preview, /END/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 305 | <code>    assert.doesNotMatch(promptObject.items[0].preview, /truncated for model budget/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 306 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>test('AILIS thread items classify nested low-confidence web_search as requiring user clarification', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 309 | <code>    const items = buildAilisThreadItems({</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 310 | <code>        stepResults: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 311 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 312 | <code>                id: 'step-ambiguous-search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 313 | <code>                title: 'Search short game nickname',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 314 | <code>                tool: 'mcp__ailis_research__web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 315 | <code>                args: { query: '做一个小光的攻略' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 316 | <code>                iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 317 | <code>                response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 318 | <code>                    ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 319 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 320 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 321 | <code>                        content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 322 | <code>                            type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 323 | <code>                            text: 'Evidence gap: Search confidence is low; the query appears ambiguous and should be clarified before following any result.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 324 | <code>                        }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>                        structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 326 | <code>                            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 327 | <code>                                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 328 | <code>                                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 329 | <code>                                    query: '做一个小光的攻略',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 330 | <code>                                    clarificationRequired: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 331 | <code>                                    searchConfidence: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 332 | <code>                                        level: 'low',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 333 | <code>                                        shouldAskUser: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 334 | <code>                                        clarificationRequired: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 335 | <code>                                        clarificationQuestion: '你说的“小光”具体指哪一个？请补充游戏名或角色全名。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 336 | <code>                                        candidateChoices: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 337 | <code>                                            { label: '绝区零 / 叶瞬光', url: 'https://www.bilibili.com/video/BV1rXBoBoEv1/' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 338 | <code>                                            { label: '光遇 / 小光', url: 'https://example.com/sky/xiaoguang-guide' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 339 | <code>                                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>                                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 341 | <code>                                    suggestedNextCalls: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 342 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 343 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 344 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 345 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 346 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 349 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>    assert.equal(items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 352 | <code>    assert.equal(items[0].status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 353 | <code>    assert.equal(items[0].evidence_gap, 'ambiguous_search_requires_clarification');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 354 | <code>    assert.match(items[0].preview, /具体指哪一个&#124;补充游戏名/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 355 | <code>    assert.equal(items[0].recovery_hint, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 356 | <code>    assert.equal(items[0].alternatives, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 357 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 358 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 359 | <code>test('AILIS thread items classify web_fetch JavaScript shells as unusable evidence', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 360 | <code>    const items = buildAilisThreadItems({</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 361 | <code>        stepResults: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 362 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 363 | <code>                id: 'step-js-shell',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 364 | <code>                title: 'Fetch Miyoushe guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 365 | <code>                tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 366 | <code>                args: { url: 'https://www.miyoushe.com/zzz/article/59714036' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 367 | <code>                iteration: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 368 | <code>                response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 369 | <code>                    ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 370 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 371 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 372 | <code>                        content: [{ type: 'text', text: 'Evidence gap: The fetched page is only a JavaScript loading shell.\n\nContent excerpt:\n米游社 Loading...' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 373 | <code>                        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 374 | <code>                            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 375 | <code>                            evidenceQuality: 'js_shell',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 376 | <code>                            isEvidence: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 377 | <code>                            observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 378 | <code>                                complete: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 379 | <code>                                truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 380 | <code>                                reasoning_ready: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 381 | <code>                                is_evidence: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 382 | <code>                                evidence_quality: 'js_shell'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 383 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 384 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 385 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 387 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 388 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 389 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 391 | <code>    assert.equal(items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 392 | <code>    assert.equal(items[0].evidence_gap, 'js_shell_no_content');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 393 | <code>    assert.match(items[0].preview, /JavaScript loading shell/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 394 | <code>    assert.equal(items[0].recovery_hint, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 395 | <code>    assert.equal(items[0].alternatives, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 396 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 398 | <code>test('AILIS thread items do not add an evidence gap for sufficient web_fetch evidence', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 399 | <code>    const items = buildAilisThreadItems({</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 400 | <code>        stepResults: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 401 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 402 | <code>                id: 'step-ready-page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 403 | <code>                title: 'Fetch BWiki guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 404 | <code>                tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 405 | <code>                args: { url: 'https://wiki.biligame.com/zzz/%E8%8E%B1%E7%89%B9' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 406 | <code>                iteration: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 407 | <code>                response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 408 | <code>                    ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 409 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 410 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 411 | <code>                        content: [{ type: 'text', text: 'Content excerpt:\n莱特 - 绝区零WIKI_BWIKI 技能加点 配队 驱动盘' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 412 | <code>                        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 413 | <code>                            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 414 | <code>                            evidenceQuality: 'sufficient_evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 415 | <code>                            isEvidence: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 416 | <code>                            complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 417 | <code>                            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 418 | <code>                            reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 419 | <code>                            observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 420 | <code>                                complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 421 | <code>                                truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 422 | <code>                                reasoning_ready: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 423 | <code>                                is_evidence: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 424 | <code>                                evidence_quality: 'sufficient_evidence'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 425 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 426 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 427 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 428 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 429 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 431 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 432 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 433 | <code>    assert.equal(items.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 434 | <code>    assert.equal(items[0].evidence_gap, null);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 435 | <code>    assert.equal(items[0].recovery_hint, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-turn-items 的契约与回归行为。”这一文件职责。 |
| 436 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
