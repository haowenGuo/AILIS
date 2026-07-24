# tests/proactive-companion-manager.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 proactive-companion-manager 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：436
- SHA-256：`1a16ec9a49da569ba708299ecc3c3ba213c7973008214673ee1187144948a74c`
- 可运行副本：[打开源文件](../../../source/tests/proactive-companion-manager.test.mjs)
- 依赖：`node:assert/strict`、`node:test`、`../src/proactive-companion-manager.js`、`../src/ailis-chat-service.js`
- 主要符号：`installBrowserState`、`values`、`createManager`、`scheduled`、`logs`、`manager`、`now`、`gate`、`context`、`prompt`、`calls`、`service`、`history`、`opportunity`、`decisionContext`、`turn`、`companionCalls`、`opportunityCalls`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>import { ProactiveCompanionManager } from '../src/proactive-companion-manager.js';</code> | 导入依赖 `../src/proactive-companion-manager.js`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 6 | <code>    AILISDesktopChatService,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 7 | <code>    buildProactiveCompanionHeartbeatDeveloperMessage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 8 | <code>    buildProactiveOpportunitySystemPrompt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 9 | <code>} from '../src/ailis-chat-service.js';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>function installBrowserState({ hidden = false } = {}) {</code> | 定义函数 `installBrowserState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    const values = new Map();</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    globalThis.document = { hidden };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    globalThis.localStorage = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 15 | <code>        getItem: (key) =&gt; values.get(key) &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 16 | <code>        setItem: (key, value) =&gt; values.set(key, String(value))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 18 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>function createManager({</code> | 定义函数 `createManager`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 21 | <code>    mode = 'companion',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 22 | <code>    hidden = false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    chatState = {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    requestCompanionTurn = async () =&gt; ({ shouldSpeak: false, reasonType: 'generation_failed' }),</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 25 | <code>    requestOpportunity = async () =&gt; ({ shouldSpeak: false, reasonType: 'not_enough_reason' }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 26 | <code>    onSpeak = async () =&gt; ({ ok: true })</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 27 | <code>} = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 28 | <code>    installBrowserState({ hidden });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 29 | <code>    const scheduled = [];</code> | 声明局部标识符 `scheduled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 30 | <code>    const logs = [];</code> | 声明局部标识符 `logs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 31 | <code>    const manager = new ProactiveCompanionManager({</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 32 | <code>        getConfig: () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 33 | <code>            AUTO_CHAT_ENABLED: ['companion', 'cowork'].includes(mode),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 34 | <code>            AUTO_CHAT_MODE: mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 35 | <code>            AUTO_CHAT_MIN_INTERVAL: 100_000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 36 | <code>            AUTO_CHAT_MAX_INTERVAL: 100_000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 37 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>        getChatState: () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 39 | <code>            isBusy: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 40 | <code>            userTyping: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 41 | <code>            inputDisabled: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 42 | <code>            voicePlaying: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 43 | <code>            messageHistory: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 44 | <code>            ...chatState</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 45 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>        requestCompanionTurn,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 47 | <code>        requestOpportunity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 48 | <code>        onSpeak,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 49 | <code>        logger: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 50 | <code>            log: (...args) =&gt; logs.push(args),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 51 | <code>            warn: (...args) =&gt; logs.push(args)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>        setTimeoutFn: (callback, delayMs) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 54 | <code>            scheduled.push({ callback, delayMs });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 55 | <code>            return scheduled.length;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 56 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>        clearTimeoutFn: () =&gt; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 58 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 59 | <code>    return { manager, scheduled, logs };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 60 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>test('start without an explicit delay uses the configured interval instead of one second', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 63 | <code>    const { manager, scheduled } = createManager({ mode: 'cowork' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>    manager.start('startup');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>    assert.equal(scheduled.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 68 | <code>    assert.equal(scheduled[0].delayMs, 100_000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 69 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>test('companion mode speaks every twenty seconds regardless of model cooldown', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 72 | <code>    const { manager } = createManager({ mode: 'companion' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>    assert.equal(manager.getNextDelay('idle'), 20_000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 75 | <code>    assert.equal(manager.getNextDelay('assistant_turn'), 20_000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 76 | <code>    assert.equal(manager.getNextDelay('spoke', { cooldownSec: 3600 }), 20_000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 77 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>test('companion mode leaves recency and daily speak limits to the model', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 80 | <code>    const { manager } = createManager({ mode: 'companion' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 81 | <code>    const now = Date.now();</code> | 声明局部标识符 `now`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 82 | <code>    manager.state.lastUserTurnAt = now - 1000;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 83 | <code>    manager.state.lastAssistantTurnAt = now - 1000;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 84 | <code>    manager.state.checksToday = 30;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 85 | <code>    manager.state.speaksToday = 5;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>    const gate = manager.hardGate(manager.buildDecisionContext(now));</code> | 声明局部标识符 `gate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>    assert.equal(gate.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 90 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>test('window visibility is context for the model, not a hard silence gate', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 93 | <code>    const { manager } = createManager({ hidden: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>    const context = manager.buildDecisionContext();</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 96 | <code>    const gate = manager.hardGate(context);</code> | 声明局部标识符 `gate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>    assert.equal(context.interactionState.appVisible, false);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 99 | <code>    assert.equal(gate.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 100 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>test('decision context carries the selected proactive mode and message metadata', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    const { manager } = createManager({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 104 | <code>        mode: 'cowork',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        chatState: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 106 | <code>            messageHistory: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 107 | <code>                role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 108 | <code>                content: '任务刚刚完成。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 109 | <code>                source: 'agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 110 | <code>                createdAt: '2026-07-16T10:00:00.000Z'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 111 | <code>            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>    const context = manager.buildDecisionContext();</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>    assert.equal(context.proactivity.mode, 'cowork');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 118 | <code>    assert.deepEqual(context.recentContext.lastVisibleTurns[0], {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 119 | <code>        role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 120 | <code>        text: '任务刚刚完成。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 121 | <code>        source: 'agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 122 | <code>        createdAt: '2026-07-16T10:00:00.000Z'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 123 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>test('opportunity prompt is limited to work-mode feedback decisions', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 127 | <code>    const prompt = buildProactiveOpportunitySystemPrompt();</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>    assert.match(prompt, /工作模式/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 130 | <code>    assert.doesNotMatch(prompt, /companion：/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 131 | <code>    assert.match(prompt, /appVisible/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 132 | <code>    assert.doesNotMatch(prompt, /"text"/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 133 | <code>    assert.match(prompt, /不要撰写最终用户可见回复/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 134 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>test('companion heartbeat is a minimal ephemeral developer event', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 137 | <code>    const prompt = buildProactiveCompanionHeartbeatDeveloperMessage([</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 138 | <code>        { role: 'user', content: '我们继续聊发布流程。' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 139 | <code>        { role: 'assistant', content: '好，我们先看线上状态。' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 140 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>    assert.match(prompt, /runtime event, not a user message/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 143 | <code>    assert.match(prompt, /same AILIS persona, memory, and conversation context/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 144 | <code>    assert.match(prompt, /has not sent a new message/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 145 | <code>    assert.match(prompt, /Take the initiative/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 146 | <code>    assert.doesNotMatch(prompt, /topic_followup&#124;soft_checkin&#124;userTurnAfterLastProactive&#124;JSON/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 147 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>test('work-mode approved opportunity uses a second context-aware persona call for visible text', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 150 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 151 | <code>    globalThis.window = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 152 | <code>        ailisDesktop: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 153 | <code>            gateway: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 154 | <code>            llm: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 155 | <code>                chat: async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 156 | <code>                    calls.push(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 157 | <code>                    if (calls.length === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 158 | <code>                        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 159 | <code>                            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 160 | <code>                            model: 'decision-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 161 | <code>                            content: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 162 | <code>                                shouldSpeak: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 163 | <code>                                intent: 'topic_followup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 164 | <code>                                emotion: 'curious',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 165 | <code>                                cooldownSec: 600,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 166 | <code>                                reasonType: 'recent_context_followup'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 167 | <code>                            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>                        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>                    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 171 | <code>                        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 172 | <code>                        model: 'reply-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 173 | <code>                        content: '刚才你说想把发布流程再理一遍，我陪你从部署状态接着看。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 174 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>    const service = new AILISDesktopChatService();</code> | 声明局部标识符 `service`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 180 | <code>    const history = [</code> | 声明局部标识符 `history`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 181 | <code>        { role: 'user', content: '发布流程好像还有点乱。', source: '' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 182 | <code>        { role: 'assistant', content: '我们已经把构建通过了，接下来要核对部署状态。', source: '' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 183 | <code>        { role: 'assistant', content: '要继续吗？', source: 'proactive_companion' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 184 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 185 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 186 | <code>    const opportunity = await service.evaluateProactiveOpportunity({</code> | 声明局部标识符 `opportunity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 187 | <code>        sessionId: 'proactive-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 188 | <code>        messageHistory: history,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 189 | <code>        context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 190 | <code>            proactivity: { mode: 'cowork' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 191 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 194 | <code>    assert.equal(calls.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 195 | <code>    assert.equal(calls[0].jsonMode, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 196 | <code>    assert.equal(calls[1].jsonMode, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 197 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 198 | <code>        calls[1].messages.slice(1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 199 | <code>        history.map(({ role, content }) =&gt; ({ role, content }))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 200 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>    assert.equal(opportunity.payload.display_text, '刚才你说想把发布流程再理一遍，我陪你从部署状态接着看。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 202 | <code>    assert.equal(opportunity.payload.proactiveCompanion.decisionModel, 'decision-model');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 203 | <code>    assert.equal(opportunity.payload.proactiveCompanion.replyModel, 'reply-model');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 204 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>test('work-mode rejected opportunity never calls the persona reply generator', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 207 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 208 | <code>    globalThis.window = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 209 | <code>        ailisDesktop: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 210 | <code>            gateway: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 211 | <code>            llm: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 212 | <code>                chat: async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 213 | <code>                    calls.push(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 214 | <code>                    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 215 | <code>                        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 216 | <code>                        content: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 217 | <code>                            shouldSpeak: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 218 | <code>                            intent: 'quiet_presence',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 219 | <code>                            emotion: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 220 | <code>                            cooldownSec: 600,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 221 | <code>                            reasonType: 'not_enough_reason'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 222 | <code>                        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 223 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 226 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 228 | <code>    const service = new AILISDesktopChatService();</code> | 声明局部标识符 `service`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 230 | <code>    const opportunity = await service.evaluateProactiveOpportunity({</code> | 声明局部标识符 `opportunity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 231 | <code>        messageHistory: [{ role: 'user', content: '先这样吧。' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 232 | <code>        context: { proactivity: { mode: 'cowork' } }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 233 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>    assert.equal(calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 236 | <code>    assert.equal(opportunity.shouldSpeak, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 237 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>test('work-mode decision keeps old user context through a long tail of proactive messages', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 240 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 241 | <code>    globalThis.window = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 242 | <code>        ailisDesktop: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 243 | <code>            gateway: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 244 | <code>            llm: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 245 | <code>                chat: async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 246 | <code>                    calls.push(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 247 | <code>                    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 248 | <code>                        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 249 | <code>                        content: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 250 | <code>                            shouldSpeak: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 251 | <code>                            intent: 'quiet_presence',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 252 | <code>                            emotion: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 253 | <code>                            cooldownSec: 600,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 254 | <code>                            reasonType: 'not_enough_reason'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 255 | <code>                        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>    const service = new AILISDesktopChatService();</code> | 声明局部标识符 `service`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 262 | <code>    const history = [</code> | 声明局部标识符 `history`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 263 | <code>        { role: 'user', content: '我们刚才在讨论 Render 部署。' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 264 | <code>        { role: 'assistant', content: '构建已经通过，下一步要核对线上状态。' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 265 | <code>        ...Array.from({ length: 14 }, (_, index) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 266 | <code>            role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 267 | <code>            content: `主动消息 ${index + 1}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 268 | <code>            source: 'proactive_companion'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 269 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 270 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 272 | <code>    await service.evaluateProactiveOpportunity({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 273 | <code>        messageHistory: history,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 274 | <code>        context: { proactivity: { mode: 'cowork' } }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 275 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>    const decisionContext = JSON.parse(calls[0].messages.at(-1).content);</code> | 声明局部标识符 `decisionContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 278 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 279 | <code>        decisionContext.recentContext.lastVisibleTurns.some(</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 280 | <code>            (message) =&gt; message.role === 'user' &amp;&amp; message.text.includes('Render 部署')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 281 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>        true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 283 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 285 | <code>        decisionContext.recentContext.lastVisibleTurns.some(</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 286 | <code>            (message) =&gt; message.role === 'assistant' &amp;&amp; message.text.includes('线上状态')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 287 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>        true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 289 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>test('companion mode directly generates one contextual reply without an opportunity judgment', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 293 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 294 | <code>    globalThis.window = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 295 | <code>        ailisDesktop: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 296 | <code>            gateway: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 297 | <code>                isSupported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 298 | <code>                getStatus: async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 299 | <code>                    running: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 300 | <code>                    workspaceRoot: 'F:\\AILIS_self_evolution_runtime'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 301 | <code>                }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>                runAgent: async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 303 | <code>                    calls.push(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 304 | <code>                    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 305 | <code>                        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 306 | <code>                        model: 'companion-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 307 | <code>                        displayText: '刚才我们在整理发布流程，我继续陪你看线上状态。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 308 | <code>                        speechText: '刚才我们在整理发布流程，我继续陪你看线上状态。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 309 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 312 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 314 | <code>    const service = new AILISDesktopChatService();</code> | 声明局部标识符 `service`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 315 | <code>    const history = [</code> | 声明局部标识符 `history`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 316 | <code>        { role: 'user', content: '发布流程好像还有点乱。' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 317 | <code>        { role: 'assistant', content: '构建已经通过，下一步要核对线上状态。' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 318 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>    const turn = await service.createProactiveCompanionTurn({</code> | 声明局部标识符 `turn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 321 | <code>        sessionId: 'companion-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 322 | <code>        messageHistory: history,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 323 | <code>        context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 324 | <code>            nowIso: '2026-07-17T06:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 325 | <code>            proactivity: { mode: 'companion' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 326 | <code>            interactionState: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 327 | <code>                appVisible: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 328 | <code>                lastUserMessageAgeMs: 4000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 329 | <code>                lastAssistantMessageAgeMs: 2000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 330 | <code>                lastProactiveAgeMs: 20_000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 331 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 335 | <code>    assert.equal(calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 336 | <code>    assert.equal(calls[0].maxAgentSteps, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 337 | <code>    assert.equal(calls[0].suppressCurrentUserMessage, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 338 | <code>    assert.deepEqual(calls[0].messageHistory, history);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 339 | <code>    assert.match(calls[0].ephemeralDeveloperMessage, /runtime event, not a user message/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 340 | <code>    assert.equal(calls[0].context.agentRole, 'persona_orchestrator');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 341 | <code>    assert.equal(calls[0].context.suppressCurrentUserMessage, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 342 | <code>    assert.equal(turn.shouldSpeak, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 343 | <code>    assert.equal(turn.reasonType, 'companion_cycle');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 344 | <code>    assert.equal('intent' in turn, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 345 | <code>    assert.equal('emotion' in turn, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 346 | <code>    assert.equal(turn.payload.display_text, '刚才我们在整理发布流程，我继续陪你看线上状态。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 347 | <code>    assert.equal(turn.payload.expression, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 348 | <code>    assert.equal(turn.payload.surface, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 349 | <code>    assert.equal(turn.payload.proactiveCompanion.replyModel, 'companion-model');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 350 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 352 | <code>test('companion heartbeat preserves the ordinary chat history instead of building a special context', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 353 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 354 | <code>    globalThis.window = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 355 | <code>        ailisDesktop: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 356 | <code>            gateway: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 357 | <code>                isSupported: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 358 | <code>                getStatus: async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 359 | <code>                    running: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 360 | <code>                    workspaceRoot: 'F:\\AILIS_self_evolution_runtime'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 361 | <code>                }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>                runAgent: async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 363 | <code>                    calls.push(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 364 | <code>                    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 365 | <code>                        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 366 | <code>                        displayText: '这一轮会从上一段继续推进，而不是重新开场。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 367 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 369 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 370 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 371 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 372 | <code>    const service = new AILISDesktopChatService();</code> | 声明局部标识符 `service`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 373 | <code>    const history = [</code> | 声明局部标识符 `history`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 374 | <code>        { role: 'user', content: '我们聊聊下周的安排。' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 375 | <code>        { role: 'assistant', content: '可以，我们先从最重要的目标开始。' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 376 | <code>        ...Array.from({ length: 8 }, (_, index) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 377 | <code>            role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 378 | <code>            content: `主动内容 ${index + 1}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 379 | <code>            source: 'proactive_companion'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 380 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 381 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 382 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 383 | <code>    await service.createProactiveCompanionTurn({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 384 | <code>        messageHistory: history,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 385 | <code>        context: { proactivity: { mode: 'companion' } }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 386 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 388 | <code>    assert.deepEqual(calls[0].messageHistory, history);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 389 | <code>    assert.match(calls[0].ephemeralDeveloperMessage, /9 assistant response\(s\)/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 390 | <code>    assert.equal(calls[0].message, '我们聊聊下周的安排。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 391 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 393 | <code>test('companion manager uses the direct generation path instead of the work-mode judge', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 394 | <code>    let companionCalls = 0;</code> | 声明局部标识符 `companionCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 395 | <code>    let opportunityCalls = 0;</code> | 声明局部标识符 `opportunityCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 396 | <code>    const { manager, scheduled } = createManager({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 397 | <code>        requestCompanionTurn: async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 398 | <code>            companionCalls += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 399 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 400 | <code>                shouldSpeak: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 401 | <code>                reasonType: 'companion_cycle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 402 | <code>                payload: { display_text: '我继续陪你聊刚才的话题。' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 403 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 404 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 405 | <code>        requestOpportunity: async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 406 | <code>            opportunityCalls += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 407 | <code>            return { shouldSpeak: false };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 408 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 409 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 410 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 411 | <code>    await manager.tick('timer');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 413 | <code>    assert.equal(companionCalls, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 414 | <code>    assert.equal(opportunityCalls, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 415 | <code>    assert.equal(manager.state.speaksToday, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 416 | <code>    assert.equal(scheduled.at(-1).delayMs, 20_000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 417 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 419 | <code>test('a failed delivery is not counted as a proactive message', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 420 | <code>    const { manager, scheduled } = createManager({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 421 | <code>        requestCompanionTurn: async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 422 | <code>            shouldSpeak: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 423 | <code>            reasonType: 'companion_cycle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 424 | <code>            cooldownSec: 20,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 425 | <code>            payload: { display_text: '还想继续刚才的话题吗？' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 426 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 427 | <code>        onSpeak: async () =&gt; ({ ok: false, reason: 'delivery_failed' })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 428 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 430 | <code>    await manager.tick('timer');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 431 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 432 | <code>    assert.equal(manager.state.speaksToday, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 433 | <code>    assert.equal(manager.state.lastDecision.shouldSpeak, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 434 | <code>    assert.equal(manager.state.lastDecision.reason, 'delivery_failed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 435 | <code>    assert.equal(scheduled.at(-1).delayMs, 100_000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 proactive-companion-manager 的契约与回归行为。”这一文件职责。 |
| 436 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
