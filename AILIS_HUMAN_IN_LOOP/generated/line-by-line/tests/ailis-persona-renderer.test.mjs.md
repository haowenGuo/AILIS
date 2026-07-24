# tests/ailis-persona-renderer.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。
- 文件类型：`source-code`
- 原始行数：170
- SHA-256：`04efb342f7d654d9b2bc94c61827f39b9704514d3f980b4d61ff3ed71a43bde8`
- 可运行副本：[打开源文件](../../../source/tests/ailis-persona-renderer.test.mjs)
- 依赖：`node:assert/strict`、`node:module`、`node:test`、`../electron/ailis-persona-renderer.cjs`
- 主要符号：`require`、`surface`、`result`、`email`、`computer`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 2 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 3 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 6 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 7 | <code>    attachPersonaSurface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 8 | <code>    getToolExperience,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 9 | <code>    renderApprovalSurface,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 10 | <code>    renderMaxStepsSurface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 11 | <code>    renderPersonaSurfaceGateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 12 | <code>    renderToolFailureSurface,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 13 | <code>    renderStatusSurface</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 14 | <code>} = require('../electron/ailis-persona-renderer.cjs');</code> | 导入依赖 `../electron/ailis-persona-renderer.cjs`，使本文件可以复用外部模块能力。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>test('AILIS persona renderer turns tool approval into embodied user-facing surface', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 17 | <code>    const surface = renderApprovalSurface({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 18 | <code>        toolId: 'vision.capture_context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 19 | <code>        title: '看一下屏幕',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 20 | <code>        reason: '需要确认当前报错内容',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 21 | <code>        visionTargetLabel: '屏幕'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 22 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>    assert.equal(surface.renderer, 'ailis-persona-renderer');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 25 | <code>    assert.equal(surface.experience.embodiedAction, 'look');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 26 | <code>    assert.match(surface.text, /先得到你的确认/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 27 | <code>    assert.match(surface.text, /看一眼屏幕/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 28 | <code>    assert.doesNotMatch(surface.text, /approvalId&#124;tool_call&#124;raw observation/);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 29 | <code>    assert.equal(surface.expression, 'relaxed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 30 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>test('AILIS persona renderer attaches structured surface while preserving agent status', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 33 | <code>    const surface = renderStatusSurface({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 34 | <code>        text: '我先停在这里，避免越跑越乱。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 35 | <code>        status: 'max_steps_reached',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 36 | <code>        expression: 'relaxed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 37 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>    const result = attachPersonaSurface({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 39 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 40 | <code>        status: 'max_steps_reached',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 41 | <code>        displayText: 'raw'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 42 | <code>    }, surface);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>    assert.equal(result.status, 'max_steps_reached');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 45 | <code>    assert.equal(result.surface.lipSync.mode, 'audio_envelope');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 46 | <code>    assert.equal(result.displayText, '我先停在这里，避免越跑越乱。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 47 | <code>    assert.doesNotMatch(result.displayText, /\[(?:expression&#124;action):/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 48 | <code>    assert.equal(result.expression, 'relaxed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 49 | <code>    assert.equal(result.action, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 50 | <code>    assert.match(result.speechText, /先停在这里&#124;避免越跑越乱/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 51 | <code>    assert.equal(result.bubbleText, '我先停在这里，避免越跑越乱。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 52 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>test('AILIS persona renderer owns failure text instead of leaking upstream tool logs', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 55 | <code>    const surface = renderPersonaSurfaceGateway({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 56 | <code>        task_state: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 57 | <code>        evidence_state: 'missing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 58 | <code>        error_code: 'tool_failed',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 59 | <code>        text: 'Agentic Executor tool_call failed: exec git_status raw observation SECRET=abc',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 60 | <code>        speech_text: 'Agentic Executor tool_call failed',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 61 | <code>        bubble_text: 'raw observation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 62 | <code>        next_action: '重新检查仓库状态',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 63 | <code>        tool_id: 'code'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 64 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>    assert.match(surface.text, /这一步我先停住/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 67 | <code>    assert.match(surface.text, /不会把这一步说成已经完成/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 68 | <code>    assert.doesNotMatch(surface.text, /Agentic Executor&#124;tool_call&#124;raw observation&#124;SECRET&#124;git_status/);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 69 | <code>    assert.doesNotMatch(surface.speechText, /Agentic Executor&#124;tool_call&#124;raw observation&#124;SECRET&#124;git_status/);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 70 | <code>    assert.equal(surface.expression, 'relaxed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 71 | <code>    assert.equal(surface.action, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 72 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>test('AILIS persona renderer preserves persona-safe TaskAgent handoff text on failure', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 75 | <code>    const surface = renderPersonaSurfaceGateway({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 76 | <code>        task_state: 'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 77 | <code>        evidence_state: 'present',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 78 | <code>        error_code: 'max_steps_reached',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 79 | <code>        text_is_persona_safe: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 80 | <code>        text: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 81 | <code>            'TaskAgent 已经跑满 30 轮，我先让它停住并整理现场，避免继续空转。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 82 | <code>            '执行情况：已执行 30 个工具步骤，其中 28 个成功、2 个失败。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 83 | <code>            '当前卡点：web_fetch 返回 HTTP 403。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 84 | <code>        ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 85 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>    assert.match(surface.text, /TaskAgent 已经跑满 30 轮/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 88 | <code>    assert.match(surface.text, /28 个成功、2 个失败/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 89 | <code>    assert.doesNotMatch(surface.text, /这一步我先停住&#124;不拿不稳&#124;继续处理/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 90 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>test('AILIS persona renderer hides internal invalid-json failure details', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 93 | <code>    const surface = renderPersonaSurfaceGateway({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 94 | <code>        task_state: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 95 | <code>        evidence_state: 'missing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 96 | <code>        error_code: 'invalid_json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 97 | <code>        reason: 'Agentic Executor 没有返回合法 JSON。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 98 | <code>        next_action: '换一种方式重新整理论文摘要'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 99 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>    assert.match(surface.text, /可靠结论/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 102 | <code>    assert.match(surface.text, /不会把这一步说成已经完成/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 103 | <code>    assert.doesNotMatch(surface.text, /JSON&#124;结构化结果&#124;任务执行流程&#124;合法&#124;格式&#124;内部结果/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 104 | <code>    assert.doesNotMatch(surface.speechText, /JSON&#124;结构化结果&#124;任务执行流程&#124;合法&#124;格式&#124;内部结果/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 105 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>test('AILIS persona renderer maps angry emotion to available avatar channels', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 108 | <code>    const surface = renderPersonaSurfaceGateway({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 109 | <code>        task_state: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 110 | <code>        evidence_state: 'none',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 111 | <code>        emotion_hint: 'angry',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 112 | <code>        relationship_stage: 'familiarizing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 113 | <code>        text: '被领导催进度真的会很烦，我先陪你把这口气接住。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 114 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>    assert.equal(surface.expression, 'angry');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 117 | <code>    assert.equal(surface.action, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 118 | <code>    assert.match(surface.text, /被领导催进度/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 119 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>test('AILIS persona renderer reads tool experience metadata from contracts', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 122 | <code>    const email = getToolExperience('email');</code> | 声明局部标识符 `email`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 123 | <code>    const computer = getToolExperience('computer');</code> | 声明局部标识符 `computer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>    assert.equal(email.userFacingVerb, '看看邮箱');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 126 | <code>    assert.equal(email.userSafePreview, 'redacted_summary');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 127 | <code>    assert.equal(computer.embodiedAction, 'check_local_state');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 128 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>test('AILIS persona renderer compresses max-step fallback into human wording', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 131 | <code>    const surface = renderMaxStepsSurface({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 132 | <code>        maxSteps: 50,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 133 | <code>        stepCount: 7,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 134 | <code>        latestSummary: '确认本地配置是否已保存',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 135 | <code>        mode: 'task'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 136 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>    assert.equal(surface.source, 'agent_max_steps');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 139 | <code>    assert.equal(surface.experience.maxSteps, 50);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 140 | <code>    assert.match(surface.text, /已经做了 7 轮处理/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 141 | <code>    assert.match(surface.text, /目前主要卡在：确认本地配置是否已保存/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 142 | <code>    assert.doesNotMatch(surface.text, /我已经做过这些步骤&#124;tool_call&#124;raw observation/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 143 | <code>    assert.equal(surface.bubbleText, '我先停住，避免越跑越乱。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 144 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>test('AILIS persona renderer hides raw email config errors from user-facing failure text', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 147 | <code>    const surface = renderToolFailureSurface({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 148 | <code>        step: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 149 | <code>            tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 150 | <code>            title: '检查未读邮件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 151 | <code>            args: { action: 'list', filter: 'unread' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 152 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 154 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 155 | <code>            status: 'needs_config',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 156 | <code>            error: 'email 工具需要 account/email 参数，或设置 AILIS_EMAIL_&lt;PROVIDER&gt;_ACCOUNT。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 157 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>        userMessage: '帮我看看有没有 GitHub 的新邮件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 159 | <code>        intent: 'email_management',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 160 | <code>        fallbackText: '需要设置 AILIS_EMAIL_QQ_SECRET'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 161 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>    assert.equal(surface.source, 'tool_failure');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 164 | <code>    assert.equal(surface.toolId, 'email');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 165 | <code>    assert.match(surface.text, /邮箱账号/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 166 | <code>    assert.match(surface.text, /不会假装已经看过邮件/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 167 | <code>    assert.match(surface.bubbleText, /邮箱还没连上/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 168 | <code>    assert.doesNotMatch(surface.text, /AILIS_EMAIL&#124;&lt;PROVIDER&gt;&#124;tool_call&#124;raw observation&#124;SECRET/);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 169 | <code>    assert.doesNotMatch(surface.bubbleText, /AILIS_EMAIL&#124;&lt;PROVIDER&gt;&#124;tool_call&#124;raw observation&#124;SECRET/);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 170 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
