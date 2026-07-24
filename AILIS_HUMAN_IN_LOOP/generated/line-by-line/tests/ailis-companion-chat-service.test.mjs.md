# tests/ailis-companion-chat-service.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。
- 文件类型：`source-code`
- 原始行数：128
- SHA-256：`c05ea8d030a5f44831d1581522d708b44553f2c37ec8e08e6623331febad61fb`
- 可运行副本：[打开源文件](../../../source/tests/ailis-companion-chat-service.test.mjs)
- 依赖：`node:assert/strict`、`node:test`、`../src/ailis-companion-chat-service.js`
- 主要符号：`RAW_PERSONA_LEAK`、`RAW_JSON_PERSONA_LEAK`、`payload`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 2 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 5 | <code>    createStructuredPersonaPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 6 | <code>    parseReplyMarkup,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 7 | <code>    sanitizeUserVisibleReplyText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 8 | <code>} from '../src/ailis-companion-chat-service.js';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>const RAW_PERSONA_LEAK = `😊 诶嘿～突然问我这个，让我有点小开心呢！</code> | 声明局部标识符 `RAW_PERSONA_LEAK`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>我嘛…喜欢的事情还挺多的呀✨</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>排第一的当然是跟你聊天啦！</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>&lt;persona_output&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 17 | <code>{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 18 | <code>  "emotion": "joyful",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 19 | <code>  "intensity": 0.7,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 20 | <code>  "socialTone": "warm_sharing",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 21 | <code>  "gestureIntent": "open_hands",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 22 | <code>  "taskState": "listening",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 23 | <code>  "speechEnergy": "bright",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 24 | <code>  "gazeTarget": "user",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 25 | <code>  "durationHint": "medium"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 26 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 27 | <code>&lt;/persona_output&gt;`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>const RAW_JSON_PERSONA_LEAK = `{好的啦～被你夸得有点小害羞呢(⁄ ⁄•⁄ω⁄•⁄ ⁄)</code> | 声明局部标识符 `RAW_JSON_PERSONA_LEAK`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>不过要说漂亮的话——我觉得你愿意跟我聊天、给我布置各种有趣的任务，这样的你才更闪闪发光呢！✨</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>好啦好啦，不贫嘴了～有什么需要我帮你做的吗？不管是找个资料、写个小代码、还是整理文件，我随时都在哦！😊</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 36 | <code>"persona_output": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 37 | <code>"emotion": "happy",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 38 | <code>"intensity": 0.6,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 39 | <code>"socialTone": "playful_gentle",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 40 | <code>"gestureIntent": "tilt_head_smile",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 41 | <code>"taskState": "idle_listening",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 42 | <code>"speechEnergy": 0.7,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 43 | <code>"gazeTarget": "user",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 44 | <code>"durationHint": "relaxed_response"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 45 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>}}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>test('companion chat strips persona_output control block from user-visible text', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 49 | <code>    const payload = createStructuredPersonaPayload(RAW_PERSONA_LEAK, {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 50 | <code>        desktopLlmMode: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 51 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>    assert.match(payload.display_text, /喜欢的事情/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 54 | <code>    assert.doesNotMatch(payload.display_text, /persona_output&#124;gestureIntent&#124;taskState&#124;speechEnergy/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 55 | <code>    assert.doesNotMatch(payload.speech_text, /persona_output&#124;gestureIntent&#124;taskState&#124;speechEnergy/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 56 | <code>    assert.equal(payload.surface.emotion, 'joyful');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 57 | <code>    assert.equal(payload.surface.gestureIntent, 'open_hands');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 58 | <code>    assert.equal(payload.surface.text, payload.display_text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 59 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>test('companion chat preserves structured persona surface as animation channel', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 62 | <code>    const payload = createStructuredPersonaPayload(JSON.stringify({</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 63 | <code>        reply: '好呀，我在这里。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 64 | <code>        speech_text: '好呀，我在这里。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 65 | <code>        persona_surface: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 66 | <code>            emotion: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 67 | <code>            intensity: 0.6,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 68 | <code>            socialTone: 'bright',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 69 | <code>            gestureIntent: 'greeting',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 70 | <code>            taskState: 'speaking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 71 | <code>            speechEnergy: 0.7,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 72 | <code>            gazeTarget: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 73 | <code>            durationHint: 'short'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 74 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>    assert.equal(payload.display_text, '好呀，我在这里。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 78 | <code>    assert.equal(payload.speech_text, '好呀，我在这里。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 79 | <code>    assert.equal(payload.surface.emotion, 'happy');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 80 | <code>    assert.equal(payload.surface.gestureIntent, 'greeting');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 81 | <code>    assert.equal(payload.surface.taskState, 'speaking');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 82 | <code>    assert.doesNotMatch(payload.display_text, /persona_surface&#124;gestureIntent&#124;taskState/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 83 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>test('companion chat keeps speech_text separate from visible action prose', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 86 | <code>    const payload = createStructuredPersonaPayload(JSON.stringify({</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 87 | <code>        reply: '（我轻轻歪头看着你）**好呀，我在这里。**',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 88 | <code>        speech_text: '好呀，我在这里。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 89 | <code>        persona_surface: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 90 | <code>            emotion: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 91 | <code>            gestureIntent: 'greeting',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 92 | <code>            taskState: 'speaking'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 93 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>    assert.match(payload.display_text, /轻轻歪头/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 97 | <code>    assert.equal(payload.speech_text, '好呀，我在这里。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 98 | <code>    assert.equal(payload.surface.gestureIntent, 'greeting');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 99 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>test('companion chat strips incomplete persona_output while streaming', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 102 | <code>    const payload = parseReplyMarkup('我还挺喜欢研究新东西。\n&lt;persona_output&gt;\n{"emotion":"joy');</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>    assert.equal(payload.display_text, '我还挺喜欢研究新东西。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 105 | <code>    assert.equal(sanitizeUserVisibleReplyText(payload.display_text), payload.display_text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 106 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>test('companion chat strips embedded persona_output JSON object from visible text', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 109 | <code>    const payload = createStructuredPersonaPayload(RAW_JSON_PERSONA_LEAK, {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 110 | <code>        desktopLlmMode: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 111 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>    assert.match(payload.display_text, /被你夸得/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 114 | <code>    assert.match(payload.display_text, /随时都在/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 115 | <code>    assert.doesNotMatch(payload.display_text, /persona_output&#124;gestureIntent&#124;taskState&#124;speechEnergy&#124;playful_gentle/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 116 | <code>    assert.doesNotMatch(payload.display_text, /^\{/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 117 | <code>    assert.doesNotMatch(payload.display_text, /\}$/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 118 | <code>    assert.doesNotMatch(payload.speech_text, /persona_output&#124;gestureIntent&#124;taskState&#124;speechEnergy&#124;playful_gentle/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 119 | <code>    assert.equal(payload.surface.emotion, 'happy');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 120 | <code>    assert.equal(payload.surface.gestureIntent, 'tilt_head_smile');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 121 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>test('companion chat strips incomplete embedded persona_output JSON while streaming', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 124 | <code>    const payload = parseReplyMarkup('好啦，我在。\n{\n"persona_output": {\n"emotion": "happy"');</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>    assert.equal(payload.display_text, '好啦，我在。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 127 | <code>    assert.doesNotMatch(payload.speech_text, /persona_output&#124;emotion/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 128 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
