# tests/ailis-memory-store.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。
- 文件类型：`source-code`
- 原始行数：466
- SHA-256：`0b7d6ba5e0dc458a07a5a995d0752238e00cb7bc8e89e99d90bac8503c2dc2ae`
- 可运行副本：[打开源文件](../../../source/tests/ailis-memory-store.test.mjs)
- 依赖：`node:assert/strict`、`node:module`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`../electron/ailis-memory-store.cjs`
- 主要符号：`require`、`rootDir`、`workspaceRoot`、`memory`、`secret`、`recorded`、`snapshot`、`context`、`taskContext`、`reloaded`、`memoryRoot`、`blocks`、`backups`、`userBlock`、`filler`、`index`、`searchCalled`、`searchMemory`、`cleared`、`clearedUserProfile`、`clearedRelationshipProfile`、`observedQuery`、`sessionId`、`firstRuntime`、`restartedRuntime`、`sources`、`personaSources`、`taskSources`、`writeBomJson`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 2 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 3 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 4 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 5 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 6 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 9 | <code>const { AILISMemoryRuntime } = require('../electron/ailis-memory-store.cjs');</code> | 导入依赖 `../electron/ailis-memory-store.cjs`，使本文件可以复用外部模块能力。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>test('AILIS memory runtime persists events and redacted secret index without legacy rule extraction', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 12 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 13 | <code>    const workspaceRoot = path.join(rootDir, 'workspace');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 14 | <code>    const memory = new AILISMemoryRuntime({</code> | 声明局部标识符 `memory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 15 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 16 | <code>        workspaceRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 17 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>    assert.equal(memory.getStatus().loaded, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 20 | <code>    assert.equal(memory.getStatus().affinityScore, 50);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>    const secret = memory.saveSecret({</code> | 声明局部标识符 `secret`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 23 | <code>        name: 'doubao-api-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 24 | <code>        kind: 'llm_api_key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 25 | <code>        provider: 'doubao',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 26 | <code>        description: '默认大模型接口',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 27 | <code>        value: 'test-secret-00000000-0000-4000-8000-000000000000'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 28 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>    assert.equal(secret.ok, true);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 30 | <code>    assert.equal(JSON.stringify(secret).includes('test-secret-00000000'), false);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>    const recorded = memory.recordTurn({</code> | 声明局部标识符 `recorded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 33 | <code>        sessionId: 'memory-test',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 34 | <code>        userMessage: '以后记住，我不喜欢过度工具化 UI，AILIS 要拟人一些，记忆架构参考 Letta/MemGPT 和 Generative Agents。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 35 | <code>        assistantMessage: '我记住了，会把拟人体验放在表层，把稳定 Agent 架构放在底层。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 36 | <code>        source: 'test'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 37 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>    assert.equal(recorded.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>    const snapshot = memory.getSnapshot({ includeEvents: true });</code> | 声明局部标识符 `snapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 41 | <code>    assert.equal(snapshot.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 42 | <code>    assert.deepEqual(recorded.event.tags, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 43 | <code>    assert.equal(recorded.event.importance, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 44 | <code>    assert.ok(snapshot.recentEvents.some((event) =&gt; event.id === recorded.event.id));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 45 | <code>    assert.ok(snapshot.blocks.every((block) =&gt; !/过度工具化 UI/.test(block.value)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 46 | <code>    assert.ok(snapshot.secrets.some((entry) =&gt; entry.name === 'doubao-api-key' &amp;&amp; entry.configured));</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 47 | <code>    assert.equal(memory.getStatus().affinityScore, 50);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>    const context = memory.compileContext({</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 50 | <code>        sessionId: 'memory-test',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 51 | <code>        message: '继续做记忆系统'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 52 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>    assert.match(context, /&lt;memory_context&gt;/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 54 | <code>    assert.match(context, /## Persona/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 55 | <code>    assert.match(context, /## User/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 56 | <code>    assert.match(context, /## Relevant Memories/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 57 | <code>    assert.match(context, /不喜欢过度工具化 UI/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 58 | <code>    assert.match(context, /doubao-api-key/);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 59 | <code>    assert.equal(context.includes('test-secret-00000000-0000-4000-8000-000000000000'), false);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>    const taskContext = memory.compileContext({</code> | 声明局部标识符 `taskContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 62 | <code>        sessionId: 'memory-test',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 63 | <code>        message: '继续做记忆系统',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 64 | <code>        contextMode: 'task_agent'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 65 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>    assert.match(taskContext, /doubao-api-key/);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 67 | <code>    assert.doesNotMatch(taskContext, /## Persona/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 68 | <code>    assert.doesNotMatch(taskContext, /## Relationship/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>    const reloaded = new AILISMemoryRuntime({</code> | 声明局部标识符 `reloaded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 71 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 72 | <code>        workspaceRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 73 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>    assert.equal(reloaded.getStatus().eventCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 75 | <code>    assert.ok((await fs.readFile(path.join(rootDir, 'memory', 'events.jsonl'), 'utf8')).includes('memory-test'));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 76 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>test('AILIS memory v2 backs up and resets legacy auto-learned core blocks without deleting events or secrets', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 79 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-v2-migration-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 80 | <code>    const memoryRoot = path.join(rootDir, 'memory');</code> | 声明局部标识符 `memoryRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 81 | <code>    await fs.mkdir(memoryRoot, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 82 | <code>    await fs.writeFile(path.join(memoryRoot, 'memory-state.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 83 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 84 | <code>        createdAt: '2026-07-01T00:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 85 | <code>        updatedAt: '2026-07-08T00:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 86 | <code>        blocks: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 87 | <code>            persona: { key: 'persona', label: 'Persona', kind: 'core', value: '- preserved persona' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 88 | <code>            user: { key: 'user', label: 'User', kind: 'core', value: '- legacy learned chat fragment' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 89 | <code>            relationship: { key: 'relationship', label: 'Relationship', kind: 'core', value: '- legacy relationship transcript' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 90 | <code>            project: { key: 'project', label: 'Project', kind: 'project', value: '- legacy non-project conversation' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 91 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>        events: [{ id: 'legacy-event', ts: '2026-07-08T00:00:00.000Z', sessionId: 'main', userText: 'keep event' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 93 | <code>        reflections: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 94 | <code>        affinity: { score: 65, events: [] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 95 | <code>        secrets: [{</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 96 | <code>            id: 'secret-1',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 97 | <code>            name: 'saved-secret',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 98 | <code>            kind: 'generic',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 99 | <code>            protection: 'local-file-base64',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 100 | <code>            valueBase64: Buffer.from('secret-value').toString('base64')</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 101 | <code>        }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>        stats: { turnCount: 1 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 103 | <code>    }, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>    const memory = new AILISMemoryRuntime({ rootDir: memoryRoot, workspaceRoot: rootDir });</code> | 声明局部标识符 `memory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 106 | <code>    const snapshot = memory.getSnapshot({ includeEvents: true });</code> | 声明局部标识符 `snapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 107 | <code>    const blocks = Object.fromEntries(snapshot.blocks.map((block) =&gt; [block.key, block.value]));</code> | 声明局部标识符 `blocks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>    assert.equal(memory.getStatus().version, 'v2');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 110 | <code>    assert.match(blocks.persona, /preserved persona/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 111 | <code>    assert.doesNotMatch(blocks.user, /legacy learned chat fragment/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 112 | <code>    assert.doesNotMatch(blocks.relationship, /legacy relationship transcript/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 113 | <code>    assert.doesNotMatch(blocks.project, /legacy non-project conversation/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 114 | <code>    assert.equal(snapshot.recentEvents[0].id, 'legacy-event');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 115 | <code>    assert.equal(memory.getSecret('saved-secret').secret.value, 'secret-value');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 116 | <code>    const backups = await fs.readdir(path.join(memoryRoot, 'backups'));</code> | 声明局部标识符 `backups`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 117 | <code>    assert.ok(backups.some((name) =&gt; /^memory-state\.v1\./.test(name)));</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 118 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>test('AILIS affinity reset updates the curated relationship state used by model context', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 121 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-affinity-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 122 | <code>    const memory = new AILISMemoryRuntime({</code> | 声明局部标识符 `memory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 123 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 124 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 125 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>    memory.resetAffinity(80);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 128 | <code>    const context = memory.compileContext({ sessionId: 'affinity-test', message: '陪我聊会儿' });</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 129 | <code>    assert.match(context, /## Relationship/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 130 | <code>    assert.match(context, /综合好感度：80\/100/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 131 | <code>    assert.match(context, /关系阶段：close/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 132 | <code>    assert.match(context, /不影响安全、隐私、事实准确性、工具审批/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 133 | <code>    assert.equal(memory.getStatus().affinityScore, 80);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 134 | <code>    assert.equal(memory.getStatus().affinitySource, 'curated_capsule');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 135 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 136 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 137 | <code>test('AILIS memory does not promote explicit self-evolution text through legacy regex rules', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 138 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-self-evolution-memory-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 139 | <code>    const memory = new AILISMemoryRuntime({</code> | 声明局部标识符 `memory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 140 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 141 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 142 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>    const recorded = memory.recordTurn({</code> | 声明局部标识符 `recorded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 145 | <code>        sessionId: 'self-evolution-memory-test',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 146 | <code>        userMessage: '以后记住，我希望 AILIS 做自我修改时必须开新分支、先跑测试、展示风险和回滚方案，不要偷偷改主分支。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 147 | <code>        assistantMessage: '我会把自我修改放进可审计的分支、测试、审批和回滚流程。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 148 | <code>        source: 'test'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 149 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>    assert.equal(recorded.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 151 | <code>    assert.deepEqual(recorded.event.tags, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 152 | <code>    assert.equal(recorded.event.importance, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>    const snapshot = memory.getSnapshot({ includeEvents: true });</code> | 声明局部标识符 `snapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 155 | <code>    const userBlock = snapshot.blocks.find((block) =&gt; block.key === 'user');</code> | 声明局部标识符 `userBlock`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 156 | <code>    assert.doesNotMatch(userBlock.value, /自我修改/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 157 | <code>    assert.doesNotMatch(userBlock.value, /开新分支/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 158 | <code>    assert.doesNotMatch(userBlock.value, /回滚方案/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 159 | <code>    assert.ok(snapshot.recentEvents.some((event) =&gt; event.id === recorded.event.id));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 160 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>test('AILIS Persona memory retrieves bounded relevant turns and clears memory while preserving secrets', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 163 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-clear-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 164 | <code>    const memory = new AILISMemoryRuntime({</code> | 声明局部标识符 `memory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 165 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 166 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 167 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>    memory.saveSecret({</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 170 | <code>        name: 'local-test-token',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 171 | <code>        kind: 'test_secret',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 172 | <code>        value: 'secret-value-that-should-survive-clear'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 173 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>    const filler = 'detail '.repeat(90);</code> | 声明局部标识符 `filler`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 176 | <code>    for (let index = 0; index &lt; 30; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 177 | <code>        memory.recordTurn({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 178 | <code>            sessionId: 'large-context-test',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 179 | <code>            userMessage: `memoryanchor ${index} ${filler}`,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 180 | <code>            assistantMessage: `ack memoryanchor ${index} ${filler}`,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 181 | <code>            source: 'test'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 182 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>    let searchCalled = false;</code> | 声明局部标识符 `searchCalled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 186 | <code>    const searchMemory = memory.searchMemory.bind(memory);</code> | 声明局部标识符 `searchMemory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 187 | <code>    memory.searchMemory = (query, options = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 188 | <code>        searchCalled = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 189 | <code>        return searchMemory(query, options);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 190 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>    const context = memory.compileContext({</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 193 | <code>        sessionId: 'large-context-test',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 194 | <code>        message: 'memoryanchor'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 195 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 196 | <code>    assert.equal(searchCalled, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 197 | <code>    assert.ok(context.length &lt; 20000);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 198 | <code>    assert.match(context, /memoryanchor&#124;## Relevant Memories/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>    const cleared = memory.clearMemory();</code> | 声明局部标识符 `cleared`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 201 | <code>    assert.equal(cleared.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 202 | <code>    assert.equal(memory.getStatus().eventCount, 0);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 203 | <code>    assert.equal(memory.getStatus().secretCount, 1);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 204 | <code>    assert.equal((await fs.readFile(path.join(rootDir, 'memory', 'events.jsonl'), 'utf8')), '');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 205 | <code>    assert.equal(memory.searchMemory('memoryanchor').events.length, 0);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 206 | <code>    assert.ok(memory.listSecrets().secrets.some((secret) =&gt; secret.name === 'local-test-token'));</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 207 | <code>    const clearedUserProfile = JSON.parse(await fs.readFile(path.join(rootDir, 'memory', 'user-profile.json'), 'utf8'));</code> | 声明局部标识符 `clearedUserProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 208 | <code>    const clearedRelationshipProfile = JSON.parse(await fs.readFile(path.join(rootDir, 'memory', 'relationship-profile.json'), 'utf8'));</code> | 声明局部标识符 `clearedRelationshipProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 209 | <code>    assert.equal(clearedUserProfile.items.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 210 | <code>    assert.equal(clearedRelationshipProfile.items.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 211 | <code>    assert.equal(memory.getStatus().affinityScore, 50);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 212 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 214 | <code>test('AILIS Persona retrieval uses recent visible turns while keeping the current message once', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 215 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-query-dedupe-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 216 | <code>    const memory = new AILISMemoryRuntime({</code> | 声明局部标识符 `memory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 217 | <code>        rootDir: path.join(rootDir, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 218 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 219 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>    let observedQuery = '';</code> | 声明局部标识符 `observedQuery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 221 | <code>    const searchMemory = memory.searchMemory.bind(memory);</code> | 声明局部标识符 `searchMemory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 222 | <code>    memory.searchMemory = (query, options = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 223 | <code>        observedQuery = query;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 224 | <code>        return searchMemory(query, options);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 225 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 227 | <code>    memory.compileContext({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 228 | <code>        sessionId: 'query-dedupe-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 229 | <code>        message: 'Solve this long GAIA task with a verifier.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 230 | <code>        messageHistory: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 231 | <code>            { role: 'user', content: '你好' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 232 | <code>            { role: 'assistant', content: '你好，我在。' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 233 | <code>            { role: 'user', content: 'Solve this long GAIA task with a verifier.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 234 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>    assert.match(observedQuery, /user: 你好/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 238 | <code>    assert.match(observedQuery, /assistant: 你好，我在。/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 239 | <code>    assert.equal(observedQuery.split('Solve this long GAIA task with a verifier.').length - 1, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 240 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>test('AILIS restores recent same-session memory after runtime restart', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 243 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-restart-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 244 | <code>    const memoryRoot = path.join(rootDir, 'memory');</code> | 声明局部标识符 `memoryRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 245 | <code>    const sessionId = 'restart-session';</code> | 声明局部标识符 `sessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 246 | <code>    const firstRuntime = new AILISMemoryRuntime({</code> | 声明局部标识符 `firstRuntime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 247 | <code>        rootDir: memoryRoot,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 248 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 249 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>    firstRuntime.recordTurn({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 252 | <code>        sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 253 | <code>        userMessage: '记住我们刚才决定先把 Persona Memory Runtime 的读取链路补完整。',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 254 | <code>        assistantMessage: '好的，下一轮继续检查 Context Compiler。',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 255 | <code>        source: 'test'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 256 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>    firstRuntime.recordTurn({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 258 | <code>        sessionId: 'another-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 259 | <code>        userMessage: '这是另一个会话的内容，不应该进入当前会话最近记录。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 260 | <code>        assistantMessage: '另一个会话。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 261 | <code>        source: 'test'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 262 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>    const restartedRuntime = new AILISMemoryRuntime({</code> | 声明局部标识符 `restartedRuntime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 265 | <code>        rootDir: memoryRoot,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 266 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 267 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>    const context = restartedRuntime.compileContext({</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 269 | <code>        sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 270 | <code>        message: '继续',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 271 | <code>        maxChars: 12000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 272 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 273 | <code>    const snapshot = restartedRuntime.getSnapshot({</code> | 声明局部标识符 `snapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 274 | <code>        includeEvents: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 275 | <code>        sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 276 | <code>        eventLimit: 10</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 277 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>    assert.match(context, /Persona Memory Runtime 的读取链路/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 280 | <code>    assert.match(context, /下一轮继续检查 Context Compiler/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 281 | <code>    assert.doesNotMatch(context, /这是另一个会话的内容/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 282 | <code>    assert.equal(snapshot.recentEvents.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 283 | <code>    assert.equal(snapshot.recentEvents[0].sessionId, sessionId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 284 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 286 | <code>test('AILIS memory prompt merges editable core blocks with curated raw-ledger capsules', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 287 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-curated-prompt-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 288 | <code>    const memoryRoot = path.join(rootDir, 'memory');</code> | 声明局部标识符 `memoryRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 289 | <code>    const memory = new AILISMemoryRuntime({</code> | 声明局部标识符 `memory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 290 | <code>        rootDir: memoryRoot,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 291 | <code>        workspaceRoot: rootDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 292 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>    memory.updateBlock('user', 'MANUAL USER CORE BLOCK');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 295 | <code>    memory.updateBlock('relationship', 'MANUAL RELATIONSHIP CORE BLOCK');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 296 | <code>    memory.updateBlock('affinity', 'OLD AFFINITY BLOCK SHOULD NOT BE IN PROMPT');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 298 | <code>    await fs.writeFile(path.join(memoryRoot, 'user-profile.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 299 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 300 | <code>        items: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 301 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 302 | <code>                id: 'profile-direct',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 303 | <code>                category: 'communication_style',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 304 | <code>                claim: '用户希望 AILIS 回答直接、具体，并基于证据。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 305 | <code>                confidence: 0.94,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 306 | <code>                stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 307 | <code>                status: 'active',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 308 | <code>                evidenceIds: ['raw-direct-style']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 309 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 311 | <code>                id: 'profile-project-runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 312 | <code>                category: 'project_memory',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 313 | <code>                claim: '当前项目采用结构化 ContextCompiler。',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 314 | <code>                confidence: 0.93,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 315 | <code>                stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 316 | <code>                status: 'active',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 317 | <code>                evidenceIds: ['raw-project-runtime']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 318 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>    }, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 321 | <code>    await fs.writeFile(path.join(memoryRoot, 'relationship-profile.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 322 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 323 | <code>        items: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 324 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 325 | <code>                id: 'relationship-risk-first',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 326 | <code>                claim: '当用户担心乱改代码时，AILIS 应先解释边界和风险。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 327 | <code>                confidence: 0.88,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 328 | <code>                stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 329 | <code>                status: 'active',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 330 | <code>                evidenceIds: ['raw-repair-signal']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 331 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>    }, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 334 | <code>    await fs.writeFile(path.join(memoryRoot, 'affinity-state.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 335 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 336 | <code>        trust: 0.52,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 337 | <code>        familiarity: 0.64,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 338 | <code>        warmth: 0.58,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 339 | <code>        friction: 0.31,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 340 | <code>        repairState: 'recovering',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 341 | <code>        relationshipStage: 'trusted',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 342 | <code>        evidenceIds: ['raw-repair-signal']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 343 | <code>    }, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 344 | <code>    await fs.writeFile(path.join(memoryRoot, 'profile-curation-state.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 345 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 346 | <code>        lastRunDate: '2026-06-30',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 347 | <code>        cursor: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 348 | <code>            lastProcessedIso: '2026-06-29T12:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 349 | <code>            lastProcessedEntryId: 'raw-repair-signal'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 350 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 351 | <code>        lastRun: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 352 | <code>            iso: '2026-06-30T02:00:00.000Z'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 353 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 354 | <code>    }, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>    const context = memory.compileContext({</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 357 | <code>        sessionId: 'curated-prompt-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 358 | <code>        message: '继续'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 359 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>    assert.match(context, /## User/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 361 | <code>    assert.match(context, /MANUAL USER CORE BLOCK/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 362 | <code>    assert.match(context, /用户希望 AILIS 回答直接、具体，并基于证据/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 363 | <code>    assert.match(context, /## Relationship/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 364 | <code>    assert.match(context, /MANUAL RELATIONSHIP CORE BLOCK/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 365 | <code>    assert.match(context, /先解释边界和风险/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 366 | <code>    assert.match(context, /trust=0\.52/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 367 | <code>    assert.match(context, /repairState&#124;修复状态：recovering/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 368 | <code>    assert.equal(context.includes('OLD AFFINITY BLOCK SHOULD NOT BE IN PROMPT'), false);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 369 | <code>    const sources = memory.getContextSources({ message: '继续' });</code> | 声明局部标识符 `sources`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 370 | <code>    assert.match(sources.projectText, /结构化 ContextCompiler/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 371 | <code>    assert.doesNotMatch(sources.userText, /结构化 ContextCompiler/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 372 | <code>    const snapshot = memory.getSnapshot({ includeEvents: false });</code> | 声明局部标识符 `snapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 373 | <code>    assert.match(snapshot.blocks.find((block) =&gt; block.key === 'user').value, /用户希望 AILIS 回答直接/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 374 | <code>    assert.match(snapshot.blocks.find((block) =&gt; block.key === 'relationship').value, /先解释边界和风险/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 375 | <code>    assert.equal(snapshot.status.affinitySource, 'curated_capsule');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 376 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 378 | <code>test('AILIS keeps relationship_tone in Persona relationship context and out of TaskAgent user context', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 379 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-task-isolation-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 380 | <code>    const memoryRoot = path.join(rootDir, 'memory');</code> | 声明局部标识符 `memoryRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 381 | <code>    const memory = new AILISMemoryRuntime({ rootDir: memoryRoot, workspaceRoot: rootDir });</code> | 声明局部标识符 `memory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 382 | <code>    await fs.writeFile(path.join(memoryRoot, 'user-profile.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 383 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 384 | <code>        items: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 385 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 386 | <code>                id: 'profile-work-style',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 387 | <code>                category: 'work_style',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 388 | <code>                claim: '用户希望复杂改动先核对真实执行链路。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 389 | <code>                confidence: 0.95,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 390 | <code>                stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 391 | <code>                status: 'active',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 392 | <code>                evidenceIds: ['raw-work']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 393 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 394 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 395 | <code>                id: 'profile-relationship-tone',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 396 | <code>                category: 'relationship_tone',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 397 | <code>                claim: '用户采用伴侣式称呼。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 398 | <code>                confidence: 0.9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 399 | <code>                stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 400 | <code>                status: 'active',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 401 | <code>                evidenceIds: ['raw-relationship']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 402 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 403 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 404 | <code>    }, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 405 | <code>    await fs.writeFile(path.join(memoryRoot, 'relationship-profile.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 406 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 407 | <code>        items: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 408 | <code>            id: 'relationship-one',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 409 | <code>            claim: '用户采用伴侣式称呼。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 410 | <code>            confidence: 0.9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 411 | <code>            stability: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 412 | <code>            status: 'active',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 413 | <code>            evidenceIds: ['raw-relationship']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 414 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>    }, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 416 | <code>    await fs.writeFile(path.join(memoryRoot, 'profile-curation-state.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 417 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 418 | <code>        cursor: { lastProcessedIso: '2026-07-17T00:00:00.000Z', lastProcessedEntryId: 'raw-relationship' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 419 | <code>    }, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 421 | <code>    const personaSources = memory.getContextSources({ message: '继续', contextMode: 'persona' });</code> | 声明局部标识符 `personaSources`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 422 | <code>    const taskSources = memory.getContextSources({ message: '继续', contextMode: 'task_agent' });</code> | 声明局部标识符 `taskSources`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 424 | <code>    assert.match(personaSources.userText, /真实执行链路/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 425 | <code>    assert.doesNotMatch(personaSources.userText, /伴侣式称呼/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 426 | <code>    assert.match(personaSources.relationshipText, /伴侣式称呼/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 427 | <code>    assert.match(taskSources.userText, /真实执行链路/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 428 | <code>    assert.doesNotMatch(taskSources.userText, /伴侣式称呼/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 429 | <code>    assert.equal(taskSources.relationshipText, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 430 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 431 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 432 | <code>test('AILIS memory context reads curated capsule JSON files with a UTF-8 BOM', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 433 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-curated-bom-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 434 | <code>    const memoryRoot = path.join(rootDir, 'memory');</code> | 声明局部标识符 `memoryRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 435 | <code>    const memory = new AILISMemoryRuntime({ rootDir: memoryRoot, workspaceRoot: rootDir });</code> | 声明局部标识符 `memory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 436 | <code>    const writeBomJson = (name, value) =&gt; fs.writeFile(</code> | 声明局部标识符 `writeBomJson`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 437 | <code>        path.join(memoryRoot, name),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 438 | <code>        `\uFEFF${JSON.stringify(value)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 439 | <code>        'utf8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 440 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 441 | <code>    await Promise.all([</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 442 | <code>        writeBomJson('profile-curation-state.json', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 443 | <code>            version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 444 | <code>            cursor: { lastProcessedIso: '2026-07-17T02:00:00.000Z' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 445 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 446 | <code>        writeBomJson('user-profile.json', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 447 | <code>            version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 448 | <code>            items: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 449 | <code>                id: 'profile-bom',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 450 | <code>                category: 'work_style',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 451 | <code>                claim: 'BOM capsule content must remain model-visible.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 452 | <code>                confidence: 0.9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 453 | <code>                stability: 'stable'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 454 | <code>            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 455 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 456 | <code>        writeBomJson('relationship-profile.json', { version: 1, items: [] }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 457 | <code>        writeBomJson('affinity-state.json', { version: 1, trust: 0.5 })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 458 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 459 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 460 | <code>    const context = memory.compileContext({</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 461 | <code>        sessionId: 'bom-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 462 | <code>        message: 'check restored memory',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 463 | <code>        contextMode: 'persona'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 464 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 465 | <code>    assert.match(context, /BOM capsule content must remain model-visible/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 466 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
