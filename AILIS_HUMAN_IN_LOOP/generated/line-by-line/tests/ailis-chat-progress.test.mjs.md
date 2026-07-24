# tests/ailis-chat-progress.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-chat-progress 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：450
- SHA-256：`b9d75f5509fd903cf21a113bba1c88c20728f978f33602301beeca9e3e765632`
- 可运行副本：[打开源文件](../../../source/tests/ailis-chat-progress.test.mjs)
- 依赖：`node:assert/strict`、`node:test`、`../src/ailis-chat-service.js`
- 主要符号：`createFakeGateway`、`listener`、`fake`、`outputs`、`unsubscribe`、`previousWindow`、`gatewayCalled`、`service`、`payload`、`finished`、`firstRunDone`、`secondRunDone`、`oldPromise`、`newPromise`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 5 | <code>    createEmbodiedCommandPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 6 | <code>    AILISDesktopChatService,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 7 | <code>    createGatewayProgressBridge</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 8 | <code>} from '../src/ailis-chat-service.js';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>function createFakeGateway() {</code> | 定义函数 `createFakeGateway`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 11 | <code>    let listener = null;</code> | 声明局部标识符 `listener`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 13 | <code>        gateway: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 14 | <code>            onEvent(callback) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 15 | <code>                listener = callback;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 16 | <code>                return () =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 17 | <code>                    listener = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 18 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 19 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 20 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>        emit(event) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 22 | <code>            listener?.(event);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 23 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 24 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 25 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>test('chat progress bridge stays silent for ordinary run start events', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 28 | <code>    const fake = createFakeGateway();</code> | 声明局部标识符 `fake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 29 | <code>    const outputs = [];</code> | 声明局部标识符 `outputs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 30 | <code>    const unsubscribe = createGatewayProgressBridge({</code> | 声明局部标识符 `unsubscribe`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 31 | <code>        gateway: fake.gateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 32 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 33 | <code>        onProgress: (payload) =&gt; outputs.push(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 34 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 37 | <code>        type: 'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 38 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 39 | <code>            runId: 'run-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 40 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 41 | <code>            mode: 'llm-agentic-executor',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 42 | <code>            intent: 'llm_agent'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 43 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>    assert.equal(outputs.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 47 | <code>    unsubscribe();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 48 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>test('assistant chat routes short dance request to embodied command before gateway', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 51 | <code>    const previousWindow = globalThis.window;</code> | 声明局部标识符 `previousWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 52 | <code>    let gatewayCalled = false;</code> | 声明局部标识符 `gatewayCalled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 53 | <code>    globalThis.window = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 54 | <code>        ailisDesktop: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 55 | <code>            gateway: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 56 | <code>                isSupported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 57 | <code>                async getStatus() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 58 | <code>                    gatewayCalled = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 59 | <code>                    return { running: true };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 60 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>                async runAgent() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 62 | <code>                    gatewayCalled = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 63 | <code>                    return { ok: true };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 64 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 70 | <code>        const service = new AILISDesktopChatService();</code> | 声明局部标识符 `service`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 71 | <code>        const payload = await service.fetchAssistantTurn({</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 72 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 73 | <code>            messageHistory: [{ role: 'user', content: '跳舞' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 74 | <code>            replyMode: 'text_only'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 75 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>        assert.equal(gatewayCalled, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 78 | <code>        assert.equal(payload.action, 'dance');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 79 | <code>        assert.equal(payload.expression, 'happy');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 80 | <code>        assert.equal(payload.surface.gestureIntent, 'dance');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 81 | <code>        assert.equal(payload.surface.taskState, 'happy_success');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 82 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 83 | <code>        if (previousWindow === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 84 | <code>            delete globalThis.window;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 85 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 86 | <code>            globalThis.window = previousWindow;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 87 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>test('assistant embodied command parser does not steal task-like dance requests', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 92 | <code>    assert.equal(createEmbodiedCommandPayload('帮我写一个跳舞脚本'), null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 93 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>test('chat progress bridge stays silent until reasoning arrives for a task run', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 96 | <code>    const fake = createFakeGateway();</code> | 声明局部标识符 `fake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 97 | <code>    const outputs = [];</code> | 声明局部标识符 `outputs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 98 | <code>    createGatewayProgressBridge({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 99 | <code>        gateway: fake.gateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 100 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 101 | <code>        onProgress: (payload) =&gt; outputs.push(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 102 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        type: 'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 106 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 107 | <code>            runId: 'run-task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 108 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 109 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 110 | <code>            executionRequired: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 111 | <code>            stepCount: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 112 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>    assert.equal(outputs.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 116 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>test('chat progress bridge shows public reasoning instead of tool-start templates', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 119 | <code>    const fake = createFakeGateway();</code> | 声明局部标识符 `fake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 120 | <code>    const outputs = [];</code> | 声明局部标识符 `outputs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 121 | <code>    createGatewayProgressBridge({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 122 | <code>        gateway: fake.gateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 123 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 124 | <code>        onProgress: (payload) =&gt; outputs.push(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 125 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 128 | <code>        type: 'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 129 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 130 | <code>            runId: 'run-2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 131 | <code>            sessionId: 'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 132 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 135 | <code>        type: 'agent.step.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 136 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 137 | <code>            runId: 'run-2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 138 | <code>            tool: 'update_plan',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 139 | <code>            title: '内部计划更新'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 140 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>    assert.equal(outputs.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 145 | <code>        type: 'agent.reasoning.delta',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 146 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 147 | <code>            runId: 'run-2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 148 | <code>            text: '我先读取 note.txt，确认里面有没有可以直接引用的内容。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 149 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 152 | <code>        type: 'agent.step.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 153 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 154 | <code>            runId: 'run-2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 155 | <code>            tool: 'read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 156 | <code>            title: '读取 note.txt'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 157 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>    assert.equal(outputs.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 161 | <code>    assert.match(outputs[0].display_text, /读取 note\.txt/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 162 | <code>    assert.equal(outputs[0].surface.renderer, 'ailis-progress-surface');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 163 | <code>    assert.equal(outputs[0].surface.traceVisible, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 164 | <code>    assert.doesNotMatch(outputs[0].display_text, /第 \d+&#124;进度&#124;tool&#124;Evidence&#124;TaskSpec&#124;update_plan/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 165 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>test('chat progress bridge shows model progress notes', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 168 | <code>    const fake = createFakeGateway();</code> | 声明局部标识符 `fake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 169 | <code>    const outputs = [];</code> | 声明局部标识符 `outputs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 170 | <code>    createGatewayProgressBridge({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 171 | <code>        gateway: fake.gateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 172 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 173 | <code>        onProgress: (payload) =&gt; outputs.push(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 174 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 177 | <code>        type: 'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 178 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 179 | <code>            runId: 'run-progress-note',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 180 | <code>            sessionId: 'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 181 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 184 | <code>        type: 'agent.progress.note',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 185 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 186 | <code>            runId: 'run-progress-note',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 187 | <code>            text: '我已经确认问题出在大文件读取链路，接下来会只查关键片段。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 188 | <code>            source: 'model_tool_progress_note'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 189 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>    assert.equal(outputs.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 193 | <code>    assert.match(outputs[0].display_text, /大文件读取链路/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 194 | <code>    assert.equal(outputs[0].surface.source, 'persona_progress_surface');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 195 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 197 | <code>test('chat progress bridge surfaces final run text when the run finishes', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 198 | <code>    const fake = createFakeGateway();</code> | 声明局部标识符 `fake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 199 | <code>    const outputs = [];</code> | 声明局部标识符 `outputs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 200 | <code>    const finished = [];</code> | 声明局部标识符 `finished`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 201 | <code>    createGatewayProgressBridge({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 202 | <code>        gateway: fake.gateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 203 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 204 | <code>        onProgress: (payload) =&gt; outputs.push(payload),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 205 | <code>        onRunFinished: (payload) =&gt; finished.push(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 206 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 208 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 209 | <code>        type: 'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 210 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 211 | <code>            runId: 'run-final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 212 | <code>            sessionId: 'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 213 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 216 | <code>        type: 'agent.run.finished',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 217 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 218 | <code>            runId: 'run-final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 219 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 220 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 221 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 222 | <code>            displayText: '已全部完成，文件保存好了。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 223 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 226 | <code>    assert.equal(outputs.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 227 | <code>    assert.match(outputs[0].display_text, /已全部完成/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 228 | <code>    assert.equal(outputs[0].agentProgressFinal, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 229 | <code>    assert.equal(finished.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 230 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 232 | <code>test('chat progress bridge surfaces final message completion text', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 233 | <code>    const fake = createFakeGateway();</code> | 声明局部标识符 `fake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 234 | <code>    const outputs = [];</code> | 声明局部标识符 `outputs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 235 | <code>    createGatewayProgressBridge({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 236 | <code>        gateway: fake.gateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 237 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 238 | <code>        onProgress: (payload) =&gt; outputs.push(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 239 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 242 | <code>        type: 'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 243 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 244 | <code>            runId: 'run-message-complete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 245 | <code>            sessionId: 'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 246 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 247 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 248 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 249 | <code>        type: 'agent.message.completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 250 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 251 | <code>            runId: 'run-message-complete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 252 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 253 | <code>            text: '任务代理完成了最终整理。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 254 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>    assert.equal(outputs.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 258 | <code>    assert.match(outputs[0].display_text, /最终整理/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 259 | <code>    assert.equal(outputs[0].agentProgressFinal, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 260 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>test('chat progress bridge surfaces runtime final text even when final event has no run id', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 263 | <code>    const fake = createFakeGateway();</code> | 声明局部标识符 `fake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 264 | <code>    const outputs = [];</code> | 声明局部标识符 `outputs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 265 | <code>    const finished = [];</code> | 声明局部标识符 `finished`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 266 | <code>    createGatewayProgressBridge({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 267 | <code>        gateway: fake.gateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 268 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 269 | <code>        onProgress: (payload) =&gt; outputs.push(payload),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 270 | <code>        onRunFinished: (payload) =&gt; finished.push(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 271 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 274 | <code>        type: 'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 275 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 276 | <code>            runId: 'run-runtime-final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 277 | <code>            sessionId: 'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 278 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 279 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 280 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 281 | <code>        type: 'agent.final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 282 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 283 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 284 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 285 | <code>            displayText: '现在我已经收集了足够的资料，以下是完整攻略。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 286 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 287 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>    assert.equal(outputs.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 290 | <code>    assert.match(outputs[0].display_text, /完整攻略/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 291 | <code>    assert.equal(outputs[0].agentProgressFinal, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 292 | <code>    assert.equal(finished.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 293 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>test('chat progress bridge does not invent failure wording without a model note', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 296 | <code>    const fake = createFakeGateway();</code> | 声明局部标识符 `fake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 297 | <code>    const outputs = [];</code> | 声明局部标识符 `outputs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 298 | <code>    createGatewayProgressBridge({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 299 | <code>        gateway: fake.gateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 300 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 301 | <code>        onProgress: (payload) =&gt; outputs.push(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 302 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 305 | <code>        type: 'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 306 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 307 | <code>            runId: 'run-failed-step',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 308 | <code>            sessionId: 'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 309 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 312 | <code>        type: 'agent.step.finished',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 313 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 314 | <code>            runId: 'run-failed-step',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 315 | <code>            tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 316 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 317 | <code>            status: 'failed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 318 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>    assert.equal(outputs.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 322 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 324 | <code>test('chat progress bridge ignores low-information computer starts without reasoning', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 325 | <code>    const fake = createFakeGateway();</code> | 声明局部标识符 `fake`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 326 | <code>    const outputs = [];</code> | 声明局部标识符 `outputs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 327 | <code>    createGatewayProgressBridge({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 328 | <code>        gateway: fake.gateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 329 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 330 | <code>        onProgress: (payload) =&gt; outputs.push(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 331 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 333 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 334 | <code>        type: 'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 335 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 336 | <code>            runId: 'run-computer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 337 | <code>            sessionId: 'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 338 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 339 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 341 | <code>        type: 'agent.step.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 342 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 343 | <code>            runId: 'run-computer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 344 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 345 | <code>            title: '看本机状态'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 346 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>    fake.emit({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 349 | <code>        type: 'agent.step.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 350 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 351 | <code>            runId: 'run-computer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 352 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 353 | <code>            title: '看本机状态'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 354 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 355 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>    assert.equal(outputs.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 358 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 360 | <code>test('desktop chat service keeps newer active run when an older run finishes later', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 361 | <code>    const previousWindow = globalThis.window;</code> | 声明局部标识符 `previousWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 362 | <code>    let listener = null;</code> | 声明局部标识符 `listener`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 363 | <code>    let resolveFirstRun;</code> | 声明局部标识符 `resolveFirstRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 364 | <code>    let resolveSecondRun;</code> | 声明局部标识符 `resolveSecondRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 365 | <code>    const firstRunDone = new Promise((resolve) =&gt; {</code> | 声明局部标识符 `firstRunDone`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 366 | <code>        resolveFirstRun = resolve;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 367 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>    const secondRunDone = new Promise((resolve) =&gt; {</code> | 声明局部标识符 `secondRunDone`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 369 | <code>        resolveSecondRun = resolve;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 370 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 371 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 372 | <code>    globalThis.window = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 373 | <code>        ailisDesktop: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 374 | <code>            gateway: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 375 | <code>                isSupported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 376 | <code>                onEvent(callback) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 377 | <code>                    listener = callback;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 378 | <code>                    return () =&gt; {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 379 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 380 | <code>                async getStatus() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 381 | <code>                    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 382 | <code>                        running: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 383 | <code>                        workspaceRoot: 'F:/AILIS_self_evolution_runtime'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 384 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 385 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>                async runAgent({ message }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 387 | <code>                    if (message === 'old') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 388 | <code>                        listener?.({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 389 | <code>                            type: 'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 390 | <code>                            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 391 | <code>                                runId: 'old-run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 392 | <code>                                sessionId: 'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 393 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 394 | <code>                        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 395 | <code>                        await firstRunDone;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 396 | <code>                        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 397 | <code>                            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 398 | <code>                            displayText: 'old done'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 399 | <code>                        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 400 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 401 | <code>                    listener?.({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 402 | <code>                        type: 'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 403 | <code>                        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 404 | <code>                            runId: 'new-run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 405 | <code>                            sessionId: 'main'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 406 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 408 | <code>                    await secondRunDone;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 409 | <code>                    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 410 | <code>                        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 411 | <code>                        displayText: 'new done'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 412 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 413 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 414 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 416 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 418 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 419 | <code>        const service = new AILISDesktopChatService();</code> | 声明局部标识符 `service`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 420 | <code>        const oldPromise = service.fetchAssistantTurn({</code> | 声明局部标识符 `oldPromise`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 421 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 422 | <code>            messageHistory: [{ role: 'user', content: 'old' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 423 | <code>            onProgress() {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 424 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 425 | <code>        await new Promise((resolve) =&gt; setTimeout(resolve, 0));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 426 | <code>        assert.equal(service.activeRunId, 'old-run');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 427 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 428 | <code>        const newPromise = service.fetchAssistantTurn({</code> | 声明局部标识符 `newPromise`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 429 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 430 | <code>            messageHistory: [{ role: 'user', content: 'new' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 431 | <code>            onProgress() {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 432 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 433 | <code>        await new Promise((resolve) =&gt; setTimeout(resolve, 0));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 434 | <code>        assert.equal(service.activeRunId, 'new-run');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 435 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 436 | <code>        resolveFirstRun();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 437 | <code>        await oldPromise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 438 | <code>        assert.equal(service.activeRunId, 'new-run');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 439 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 440 | <code>        resolveSecondRun();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 441 | <code>        await newPromise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 442 | <code>        assert.equal(service.activeRunId, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 443 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 444 | <code>        if (previousWindow === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 445 | <code>            delete globalThis.window;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 446 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 447 | <code>            globalThis.window = previousWindow;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-chat-progress 的契约与回归行为。”这一文件职责。 |
| 448 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
