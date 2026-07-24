# tests/ailis-context-compiler.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。
- 文件类型：`source-code`
- 原始行数：158
- SHA-256：`59607eb49af00b1eec0855d216cfa3f762a30a7b3deadde51dda7d27b933b878`
- 可运行副本：[打开源文件](../../../source/tests/ailis-context-compiler.test.mjs)
- 依赖：`node:assert/strict`、`node:module`、`node:test`、`../electron/ailis-context-compiler.cjs`、`../electron/ailis-model-input-builder.cjs`
- 主要符号：`require`、`createMemoryRuntime`、`longUserText`、`compiler`、`context`、`user`、`ids`、`longText`、`memoryContext`、`input`、`contextItem`、`allText`、`messages`、`contextManager`、`compacted`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 2 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 3 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 6 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 7 | <code>    AILISContextCompiler,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 8 | <code>    MemoryContext</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 9 | <code>} = require('../electron/ailis-context-compiler.cjs');</code> | 导入依赖 `../electron/ailis-context-compiler.cjs`，使本文件可以复用外部模块能力。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 10 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 11 | <code>    buildModelInput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 12 | <code>    buildModelInputContextManager,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 13 | <code>    responseItemsToChatMessages</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 14 | <code>} = require('../electron/ailis-model-input-builder.cjs');</code> | 导入依赖 `../electron/ailis-model-input-builder.cjs`，使本文件可以复用外部模块能力。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>function createMemoryRuntime(overrides = {}) {</code> | 定义函数 `createMemoryRuntime`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 17 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 18 | <code>        getContextSources() {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 19 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 20 | <code>                personaText: '- persona identity',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 21 | <code>                userText: '- stable user preference',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 22 | <code>                relationshipText: '- relationship boundary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 23 | <code>                affinityText: '- relationship stage: trusted',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 24 | <code>                projectText: '- active project architecture',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 25 | <code>                relevantMemoriesText: '- relevant evidence-backed memory',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 26 | <code>                secretIndexText: '- configured secret name only',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 27 | <code>                relevantMemoryRefs: ['memory-event-1'],</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 28 | <code>                relevantMemoryCount: 1,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 29 | <code>                retrievalQueryChars: 42,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 30 | <code>                ...overrides</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 31 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 32 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>test('ContextCompiler builds separately budgeted Persona, User, Relationship, Project, and Relevant Memories sections', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 37 | <code>    const longUserText = Array.from({ length: 40 }, (_, index) =&gt; `- user-line-${String(index).padStart(2, '0')} complete fact`).join('\n');</code> | 声明局部标识符 `longUserText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 38 | <code>    const compiler = new AILISContextCompiler({</code> | 声明局部标识符 `compiler`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 39 | <code>        memoryRuntime: createMemoryRuntime({ userText: longUserText })</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 40 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>    const context = compiler.compile({</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 42 | <code>        sessionId: 'persona-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 43 | <code>        currentUserMessage: 'current instruction',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 44 | <code>        agentMode: 'persona',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 45 | <code>        sectionBudgets: { user: 50 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 46 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>    assert.ok(context instanceof MemoryContext);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 49 | <code>    assert.equal(context.schema, 'ailis.memory_context.v1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 50 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 51 | <code>        context.sections.slice(0, 5).map((section) =&gt; section.id),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 52 | <code>        ['persona', 'user', 'relationship', 'project', 'relevant_memories']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 53 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>    const user = context.sections.find((section) =&gt; section.id === 'user');</code> | 声明局部标识符 `user`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 55 | <code>    assert.equal(user.budgetTokens, 50);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 56 | <code>    assert.equal(user.truncated, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 57 | <code>    assert.match(user.text, /user-line-00 complete fact/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 58 | <code>    assert.match(user.text, /section truncated by ContextCompiler budget/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 59 | <code>    assert.doesNotMatch(user.text, /user-line-39/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 60 | <code>    assert.ok(user.text.length &lt;= 200);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 61 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>test('ContextCompiler keeps Persona-only memory out of TaskAgent context', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 64 | <code>    const compiler = new AILISContextCompiler({ memoryRuntime: createMemoryRuntime() });</code> | 声明局部标识符 `compiler`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 65 | <code>    const context = compiler.compile({</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 66 | <code>        currentUserMessage: 'execute the task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 67 | <code>        sessionRecentTurns: [{ role: 'user', content: 'prior visible turn' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 68 | <code>        activeTaskState: 'persona active task state',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 69 | <code>        interactionPreferences: 'temporary relationship nickname',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 70 | <code>        agentMode: 'task_agent'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 71 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 72 | <code>    const ids = context.sections.map((section) =&gt; section.id);</code> | 声明局部标识符 `ids`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 73 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 74 | <code>    assert.equal(ids.includes('persona'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 75 | <code>    assert.equal(ids.includes('relationship'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 76 | <code>    assert.equal(ids.includes('current_task'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 77 | <code>    assert.equal(ids.includes('user'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 78 | <code>    assert.equal(ids.includes('project'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 79 | <code>    assert.equal(ids.includes('relevant_memories'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 80 | <code>    assert.doesNotMatch(context.asDeveloperInstruction(), /temporary relationship nickname/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 81 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>test('ContextCompiler scales all section budgets to a bounded model-visible envelope', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 84 | <code>    const longText = Array.from({ length: 300 }, (_, index) =&gt; `- complete-line-${index} ${'x'.repeat(40)}`).join('\n');</code> | 声明局部标识符 `longText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 85 | <code>    const compiler = new AILISContextCompiler({</code> | 声明局部标识符 `compiler`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 86 | <code>        memoryRuntime: createMemoryRuntime({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 87 | <code>            personaText: longText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 88 | <code>            userText: longText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 89 | <code>            relationshipText: longText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 90 | <code>            affinityText: longText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 91 | <code>            projectText: longText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 92 | <code>            relevantMemoriesText: longText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 93 | <code>            secretIndexText: longText</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 94 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>    const context = compiler.compile({</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 97 | <code>        currentUserMessage: 'bounded context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 98 | <code>        activeTaskState: longText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 99 | <code>        agentMode: 'persona',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 100 | <code>        maxChars: 4000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 101 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>    assert.equal(context.diagnostics.scaledForMaxChars, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 104 | <code>    assert.ok(context.asDeveloperInstruction().length &lt;= 4000);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 105 | <code>    assert.ok(context.sections.every((section) =&gt; section.approxTokens &lt;= section.budgetTokens));</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 106 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>test('model input exposes compiled memory as a developer ResponseItem and keeps the current user message once', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 109 | <code>    const compiler = new AILISContextCompiler({ memoryRuntime: createMemoryRuntime() });</code> | 声明局部标识符 `compiler`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 110 | <code>    const memoryContext = compiler.compile({</code> | 声明局部标识符 `memoryContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 111 | <code>        currentUserMessage: 'CURRENT_USER_TASK',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 112 | <code>        agentMode: 'persona'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 113 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>    const input = buildModelInput({</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 115 | <code>        message: 'CURRENT_USER_TASK',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 116 | <code>        messageHistory: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 117 | <code>            { role: 'user', content: 'earlier question' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 118 | <code>            { role: 'assistant', content: 'earlier answer' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 119 | <code>            { role: 'user', content: 'CURRENT_USER_TASK' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 120 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>        memoryContext,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 122 | <code>        runtimeEnvironment: { current_date: '2026-07-17' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 123 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>    assert.equal(input[0].type, 'message');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 126 | <code>    assert.equal(input[0].role, 'developer');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 127 | <code>    assert.match(input[0].content[0].text, /&lt;memory_context&gt;/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 128 | <code>    const contextItem = input.find((item) =&gt; item.role === 'user' &amp;&amp; /"type":"context"/.test(item.content?.[0]?.text &#124;&#124; ''));</code> | 声明局部标识符 `contextItem`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 129 | <code>    assert.ok(contextItem);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 130 | <code>    assert.doesNotMatch(contextItem.content[0].text, /memory_context/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 131 | <code>    const allText = input</code> | 声明局部标识符 `allText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 132 | <code>        .filter((item) =&gt; item.type === 'message')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 133 | <code>        .flatMap((item) =&gt; item.content &#124;&#124; [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 134 | <code>        .map((part) =&gt; part.text &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 135 | <code>        .join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 136 | <code>    assert.equal(allText.split('CURRENT_USER_TASK').length - 1, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>    const messages = responseItemsToChatMessages({ instructions: 'base', input });</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 139 | <code>    assert.equal(messages[1].role, 'developer');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 140 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>test('semantic compaction preserves both developer memory and runtime attachment context', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 143 | <code>    const contextManager = buildModelInputContextManager({</code> | 声明局部标识符 `contextManager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 144 | <code>        message: 'continue',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 145 | <code>        memoryContext: new MemoryContext({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 146 | <code>            sections: [{ id: 'user', label: 'User', text: '- durable preference' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 147 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>        fileAttachments: [{ path: 'F:\\workspace\\fixture.xlsx' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 149 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>    const compacted = contextManager.buildSemanticCompactedItem({</code> | 声明局部标识符 `compacted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 151 | <code>        contextMode: 'persona',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 152 | <code>        goal: 'continue'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 153 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>    const messages = compacted.replacement_history.filter((item) =&gt; item.type === 'message');</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 156 | <code>    assert.ok(messages.some((item) =&gt; item.role === 'developer' &amp;&amp; /durable preference/.test(item.content[0].text)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 157 | <code>    assert.ok(messages.some((item) =&gt; item.role === 'user' &amp;&amp; /attached_files/.test(item.content[0].text)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。”这一文件职责。 |
| 158 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
