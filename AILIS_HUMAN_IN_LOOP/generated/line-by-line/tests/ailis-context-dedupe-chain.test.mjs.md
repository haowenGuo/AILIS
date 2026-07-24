# tests/ailis-context-dedupe-chain.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：122
- SHA-256：`4699112abfb71121a5a7a742c4390286b413d2f1d2dc4995ca33f3d7942f9065`
- 可运行副本：[打开源文件](../../../source/tests/ailis-context-dedupe-chain.test.mjs)
- 依赖：`node:assert/strict`、`node:module`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`../electron/ailis-model-input-builder.cjs`、`../electron/ailis-memory-store.cjs`
- 主要符号：`require`、`CURRENT_TASK`、`inputMessageTexts`、`countOccurrences`、`captureMemorySearchQuery`、`rootDir`、`memory`、`observedQuery`、`searchMemory`、`input`、`texts`、`query`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 9 | <code>const { buildModelInput } = require('../electron/ailis-model-input-builder.cjs');</code> | 导入依赖 `../electron/ailis-model-input-builder.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 10 | <code>const { AILISMemoryRuntime } = require('../electron/ailis-memory-store.cjs');</code> | 导入依赖 `../electron/ailis-memory-store.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>const CURRENT_TASK = 'CURRENT_TASK_MARKER solve this GAIA-style task with a verifier.';</code> | 声明局部标识符 `CURRENT_TASK`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>function inputMessageTexts(input = []) {</code> | 定义函数 `inputMessageTexts`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    return input</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 16 | <code>        .filter((item) =&gt; item?.type === 'message')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 17 | <code>        .map((item) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 18 | <code>            if (Array.isArray(item.content)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 19 | <code>                return item.content.map((part) =&gt; part?.text &#124;&#124; part?.content &#124;&#124; '').join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 20 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>            return String(item.content &#124;&#124; '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 22 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 23 | <code>        .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 24 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>function countOccurrences(text = '', needle = CURRENT_TASK) {</code> | 定义函数 `countOccurrences`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 27 | <code>    return String(text).split(needle).length - 1;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 28 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>async function captureMemorySearchQuery({ message = CURRENT_TASK, messageHistory = [] } = {}) {</code> | 定义函数 `captureMemorySearchQuery`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 31 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-context-dedupe-chain-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 32 | <code>    const memory = new AILISMemoryRuntime({</code> | 声明局部标识符 `memory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 33 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 34 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 35 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 36 | <code>    let observedQuery = '';</code> | 声明局部标识符 `observedQuery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 37 | <code>    const searchMemory = memory.searchMemory.bind(memory);</code> | 声明局部标识符 `searchMemory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 38 | <code>    memory.searchMemory = (query, options = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 39 | <code>        observedQuery = query;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 40 | <code>        return searchMemory(query, options);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 41 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>    memory.compileContext({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 43 | <code>        sessionId: 'context-dedupe-chain',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 44 | <code>        message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 45 | <code>        messageHistory</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 46 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>    return observedQuery;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 48 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>test('agent model input keeps the current user task once when history already ends with it', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 51 | <code>    const input = buildModelInput({</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        message: CURRENT_TASK,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 53 | <code>        messageHistory: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 54 | <code>            { role: 'user', content: 'prior user context' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 55 | <code>            { role: 'assistant', content: 'prior assistant context' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 56 | <code>            { role: 'user', content: CURRENT_TASK }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 57 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 58 | <code>        memoryContext: 'memory context without the marker'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>    const texts = inputMessageTexts(input);</code> | 声明局部标识符 `texts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>    assert.equal(countOccurrences(texts.join('\n')), 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 63 | <code>    assert.equal(texts.at(-1), CURRENT_TASK);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 64 | <code>    assert.match(texts.join('\n'), /prior user context/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 65 | <code>    assert.match(texts.join('\n'), /prior assistant context/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 66 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>test('agent model input keeps the current user task once when history does not include it', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 69 | <code>    const input = buildModelInput({</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 70 | <code>        message: CURRENT_TASK,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 71 | <code>        messageHistory: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 72 | <code>            { role: 'user', content: 'previous question' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 73 | <code>            { role: 'assistant', content: 'previous answer' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>        memoryContext: 'memory context without the marker'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 76 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>    assert.equal(countOccurrences(inputMessageTexts(input).join('\n')), 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 79 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>test('TaskAgent clean-context shape starts from a single current user task', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 82 | <code>    const input = buildModelInput({</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 83 | <code>        message: CURRENT_TASK,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 84 | <code>        messageHistory: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 85 | <code>        toolOutputs: [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 86 | <code>        memoryContext: 'task agent minimal memory without the marker'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 87 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>    const texts = inputMessageTexts(input);</code> | 声明局部标识符 `texts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>    assert.equal(countOccurrences(texts.join('\n')), 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 91 | <code>    assert.equal(texts.at(-1), CURRENT_TASK);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 92 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>test('memory search query keeps the current user task once when history already ends with it', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 95 | <code>    const query = await captureMemorySearchQuery({</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 96 | <code>        message: CURRENT_TASK,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 97 | <code>        messageHistory: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 98 | <code>            { role: 'user', content: 'prior user memory context' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 99 | <code>            { role: 'assistant', content: 'prior assistant memory context' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 100 | <code>            { role: 'user', content: CURRENT_TASK }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 101 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>    assert.equal(countOccurrences(query), 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 105 | <code>    assert.match(query, /prior user memory context/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 106 | <code>    assert.match(query, /prior assistant memory context/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 107 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>test('direct LLM memory-injection shape does not duplicate the current user task in memory query', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 110 | <code>    const query = await captureMemorySearchQuery({</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 111 | <code>        message: CURRENT_TASK,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 112 | <code>        messageHistory: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 113 | <code>            { role: 'user', content: 'screenshot context from prior turn' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 114 | <code>            { role: 'assistant', content: 'prior visual answer' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 115 | <code>            { role: 'user', content: CURRENT_TASK }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 116 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 117 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>    assert.equal(countOccurrences(query), 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 120 | <code>    assert.match(query, /screenshot context from prior turn/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 121 | <code>    assert.match(query, /prior visual answer/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-context-dedupe-chain 的契约与回归行为。”这一文件职责。 |
| 122 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
