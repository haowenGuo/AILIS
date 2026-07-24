# electron/ailis-task-agent-harness.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。
- 文件类型：`source-code`
- 原始行数：438
- SHA-256：`de1c7efcdf72fe2b7bf7b6e0e6c50675592f1b391a5b414bc7a6a82a3f3f4d1c`
- 可运行副本：[打开源文件](../../../source/electron/ailis-task-agent-harness.cjs)
- 依赖：`fs`、`path`、`crypto`
- 主要符号：`fs`、`path`、`TASK_HARNESS_STATE_VERSION`、`TASK_RESULT_SCHEMA`、`TASK_AGENT_MAX_MODEL_ROUNDS`、`MAX_PARENT_RUN_HANDOFFS`、`FINAL_STATUSES`、`normalizeString`、`text`、`cloneJson`、`readJson`、`atomicWriteJson`、`temporaryPath`、`uniqueStrings`、`result`、`normalizeSourceRefs`、`refs`、`seen`、`url`、`parsed`、`refsFromCollectedData`、`normalizeStoredTask`、`taskId`、`sessionId`、`originalGoal`、`buildTaskResultPacket`、`handoff`、`collectedData`、`exactAnswer`、`finalAnswer`、`displayText`、`partialAnswer`、`status`、`unresolvedFields`、`AILISSystemTaskAgentHarness`、`loaded`、`now`、`message`、`parentRunId`、`parentRunKey`、`existingHandoff`、`running`、`prior`、`task`、`inFlight`、`registerInputHandler`、`pending`、`inheritanceMode`、`runPromise`、`packet`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 2 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 3 | <code>const { randomUUID } = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const TASK_HARNESS_STATE_VERSION = 1;</code> | 声明局部标识符 `TASK_HARNESS_STATE_VERSION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 6 | <code>const TASK_RESULT_SCHEMA = 'ailis.task_result.v1';</code> | 声明局部标识符 `TASK_RESULT_SCHEMA`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 7 | <code>const TASK_AGENT_MAX_MODEL_ROUNDS = 9;</code> | 声明局部标识符 `TASK_AGENT_MAX_MODEL_ROUNDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 8 | <code>const MAX_PARENT_RUN_HANDOFFS = 256;</code> | 声明局部标识符 `MAX_PARENT_RUN_HANDOFFS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 9 | <code>const FINAL_STATUSES = new Set(['completed', 'success', 'succeeded']);</code> | 声明局部标识符 `FINAL_STATUSES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 12 | <code>    const text = typeof value === 'string' ? value.trim() : '';</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 13 | <code>    return text &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 14 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>function cloneJson(value) {</code> | 定义函数 `cloneJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 17 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 18 | <code>        return JSON.parse(JSON.stringify(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 19 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 20 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 21 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 22 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>function readJson(filePath, fallback) {</code> | 定义函数 `readJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 25 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 26 | <code>        return JSON.parse(fs.readFileSync(filePath, 'utf8'));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 27 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 28 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 29 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>function atomicWriteJson(filePath, value) {</code> | 定义函数 `atomicWriteJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 33 | <code>    fs.mkdirSync(path.dirname(filePath), { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 34 | <code>    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;</code> | 声明局部标识符 `temporaryPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 35 | <code>    fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 36 | <code>    fs.renameSync(temporaryPath, filePath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 37 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>function uniqueStrings(values = [], limit = 80) {</code> | 定义函数 `uniqueStrings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 40 | <code>    const result = [];</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 41 | <code>    for (const value of Array.isArray(values) ? values : []) {</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 42 | <code>        const text = normalizeString(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 43 | <code>        if (text &amp;&amp; !result.includes(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 44 | <code>            result.push(text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 45 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>        if (result.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 47 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 48 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 51 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>function normalizeSourceRefs(values = []) {</code> | 定义函数 `normalizeSourceRefs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 54 | <code>    const refs = [];</code> | 声明局部标识符 `refs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 55 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 56 | <code>    for (const value of Array.isArray(values) ? values : []) {</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 57 | <code>        if (!value &#124;&#124; typeof value !== 'object' &#124;&#124; Array.isArray(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 58 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 59 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>        const url = normalizeString(value.url);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 61 | <code>        if (!url &#124;&#124; seen.has(url)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 62 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 63 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 65 | <code>            const parsed = new URL(url);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 66 | <code>            if (!['http:', 'https:'].includes(parsed.protocol)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 67 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 68 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 70 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 71 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 72 | <code>        seen.add(url);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 73 | <code>        refs.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 74 | <code>            ref_id: normalizeString(value.ref_id &#124;&#124; value.refId &#124;&#124; value.id, url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 75 | <code>            title: normalizeString(value.title &#124;&#124; value.name, url).slice(0, 240),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 76 | <code>            url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 77 | <code>            ...(Number.isFinite(Number(value.lineno)) &amp;&amp; Number(value.lineno) &gt; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 78 | <code>                ? { lineno: Number(value.lineno) }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 79 | <code>                : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 80 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>        if (refs.length &gt;= 24) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 82 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 83 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>    return refs;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 86 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>function refsFromCollectedData(collectedData = [], key = 'evidenceRefs') {</code> | 定义函数 `refsFromCollectedData`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 89 | <code>    const refs = [];</code> | 声明局部标识符 `refs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 90 | <code>    for (const item of Array.isArray(collectedData) ? collectedData : []) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 91 | <code>        if (key === 'outputRefs') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 92 | <code>            refs.push(item?.outputId, item?.artifactId);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 93 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 94 | <code>            refs.push(...(Array.isArray(item?.evidenceRefs) ? item.evidenceRefs : []));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 95 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>    return uniqueStrings(refs);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 98 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>function normalizeStoredTask(raw = {}) {</code> | 定义函数 `normalizeStoredTask`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 101 | <code>    if (!raw &#124;&#124; typeof raw !== 'object' &#124;&#124; Array.isArray(raw)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 102 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 103 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>    const taskId = normalizeString(raw.taskId);</code> | 声明局部标识符 `taskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 105 | <code>    const sessionId = normalizeString(raw.sessionId);</code> | 声明局部标识符 `sessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 106 | <code>    const originalGoal = normalizeString(raw.originalGoal);</code> | 声明局部标识符 `originalGoal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 107 | <code>    if (!taskId &#124;&#124; !sessionId &#124;&#124; !originalGoal) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 108 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 109 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 111 | <code>        taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 112 | <code>        sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 113 | <code>        originalGoal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 114 | <code>        latestRequest: normalizeString(raw.latestRequest, originalGoal),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 115 | <code>        status: normalizeString(raw.status, 'incomplete').toLowerCase(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 116 | <code>        childSessionId: normalizeString(raw.childSessionId, `${sessionId}:task-agent:${taskId}`),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 117 | <code>        latestRunId: normalizeString(raw.latestRunId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 118 | <code>        checkpoint: raw.checkpoint &amp;&amp; typeof raw.checkpoint === 'object' ? raw.checkpoint : null,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 119 | <code>        evidenceRefs: uniqueStrings(raw.evidenceRefs),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 120 | <code>        outputRefs: uniqueStrings(raw.outputRefs),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 121 | <code>        sourceRefs: normalizeSourceRefs(raw.sourceRefs),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 122 | <code>        unresolvedFields: uniqueStrings(raw.unresolvedFields, 24),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 123 | <code>        traceRef: normalizeString(raw.traceRef &#124;&#124; raw.latestRunId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 124 | <code>        createdAt: normalizeString(raw.createdAt, new Date().toISOString()),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 125 | <code>        updatedAt: normalizeString(raw.updatedAt, new Date().toISOString())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 126 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>function buildTaskResultPacket(result = {}, task = {}) {</code> | 定义函数 `buildTaskResultPacket`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 130 | <code>    const handoff = result.taskRunHandoff &#124;&#124; result.task_run_handoff &#124;&#124; result.handoff &#124;&#124; {};</code> | 声明局部标识符 `handoff`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 131 | <code>    const collectedData = Array.isArray(handoff.collectedData) ? handoff.collectedData : [];</code> | 声明局部标识符 `collectedData`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 132 | <code>    const exactAnswer = normalizeString(</code> | 声明局部标识符 `exactAnswer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 133 | <code>        handoff.exactAnswer &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 134 | <code>        handoff.exact_answer &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 135 | <code>        result.exactAnswerSubmission?.answer &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 136 | <code>        result.exact_answer_submission?.answer &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 137 | <code>        result.exactAnswer &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 138 | <code>        result.exact_answer</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 139 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>    const finalAnswer = normalizeString(</code> | 声明局部标识符 `finalAnswer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 141 | <code>        handoff.finalAnswer &#124;&#124; result.finalAnswer &#124;&#124; result.answer &#124;&#124; exactAnswer &#124;&#124; result.displayText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 142 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>    const displayText = normalizeString(result.displayText &#124;&#124; result.display_text &#124;&#124; finalAnswer);</code> | 声明局部标识符 `displayText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 144 | <code>    const partialAnswer = normalizeString(handoff.partialAnswer);</code> | 声明局部标识符 `partialAnswer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 145 | <code>    const status = normalizeString(handoff.status &#124;&#124; result.status, result.ok === false ? 'failed' : 'completed').toLowerCase();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 146 | <code>    const unresolvedFields = FINAL_STATUSES.has(status)</code> | 声明局部标识符 `unresolvedFields`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 147 | <code>        ? []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 148 | <code>        : uniqueStrings([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 149 | <code>              ...(Array.isArray(task.unresolvedFields) ? task.unresolvedFields : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 150 | <code>              ...(Array.isArray(handoff.unresolvedFields) ? handoff.unresolvedFields : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 151 | <code>              ...(Array.isArray(handoff.unresolved_fields) ? handoff.unresolved_fields : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 152 | <code>              ...(Array.isArray(result.unresolvedFields) ? result.unresolvedFields : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 153 | <code>              ...(Array.isArray(result.unresolved_fields) ? result.unresolved_fields : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 154 | <code>              handoff.failureAnalysis?.bottleneck,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 155 | <code>              handoff.reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 156 | <code>              handoff.nextStep?.recommendation</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 157 | <code>          ], 24);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 158 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 159 | <code>        schema: TASK_RESULT_SCHEMA,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 160 | <code>        task_id: task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 161 | <code>        status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 162 | <code>        original_goal: task.originalGoal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 163 | <code>        current_request: task.latestRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 164 | <code>        exact_answer: exactAnswer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 165 | <code>        final_answer: finalAnswer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 166 | <code>        display_text: displayText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 167 | <code>        partial_answer: partialAnswer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 168 | <code>        source_refs: normalizeSourceRefs(handoff.sourceRefs),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 169 | <code>        evidence_refs: refsFromCollectedData(collectedData, 'evidenceRefs'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 170 | <code>        output_refs: refsFromCollectedData(collectedData, 'outputRefs'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 171 | <code>        unresolved_fields: unresolvedFields,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 172 | <code>        trace_ref: normalizeString(handoff.traceRef &#124;&#124; result.runId &#124;&#124; task.latestRunId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 173 | <code>        checkpoint_available: Boolean(</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 174 | <code>            handoff.resume?.contextManagerCheckpoint &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 175 | <code>            handoff.resume?.context_manager_checkpoint</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 176 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>class AILISSystemTaskAgentHarness {</code> | 定义类 `AILISSystemTaskAgentHarness`，把相关状态与行为收拢为一个运行时对象。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 181 | <code>    constructor(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 182 | <code>        this.rootDir = path.resolve(options.rootDir &#124;&#124; path.join(process.cwd(), '.ailis-state', 'task-agent-harness'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 183 | <code>        this.statePath = path.resolve(options.statePath &#124;&#124; path.join(this.rootDir, 'state.json'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 184 | <code>        this.executeTaskAgent = typeof options.executeTaskAgent === 'function'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 185 | <code>            ? options.executeTaskAgent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 186 | <code>            : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 187 | <code>        this.emitEvent = typeof options.emitEvent === 'function' ? options.emitEvent : () =&gt; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 188 | <code>        this.taskResultCapsules = options.taskResultCapsules &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 189 | <code>        this.maxAgentSteps = Math.max(2, Math.min(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 190 | <code>            Number(options.maxAgentSteps) &#124;&#124; TASK_AGENT_MAX_MODEL_ROUNDS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 191 | <code>            TASK_AGENT_MAX_MODEL_ROUNDS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 192 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 193 | <code>        const loaded = readJson(this.statePath, {});</code> | 声明局部标识符 `loaded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 194 | <code>        this.state = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 195 | <code>            version: TASK_HARNESS_STATE_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 196 | <code>            updatedAt: normalizeString(loaded.updatedAt),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 197 | <code>            sessions: Object.fromEntries(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 198 | <code>                Object.entries(loaded.sessions &amp;&amp; typeof loaded.sessions === 'object' ? loaded.sessions : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 199 | <code>                    .map(([sessionId, task]) =&gt; [sessionId, normalizeStoredTask(task)])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 200 | <code>                    .filter(([, task]) =&gt; Boolean(task))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 201 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>        this.inFlight = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 204 | <code>        this.parentRunHandoffs = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 205 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>    persist() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 208 | <code>        this.state.version = TASK_HARNESS_STATE_VERSION;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 209 | <code>        this.state.updatedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 210 | <code>        atomicWriteJson(this.statePath, this.state);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 211 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 213 | <code>    getTask(sessionId = '') {</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 214 | <code>        return this.state.sessions[normalizeString(sessionId, 'main')] &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 215 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>    selectPriorTask(sessionId) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 218 | <code>        return this.getTask(sessionId);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 219 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>    createTask({ sessionId, message, prior = null }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 222 | <code>        const taskId = prior?.taskId &#124;&#124; `task_${randomUUID()}`;</code> | 声明局部标识符 `taskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 223 | <code>        const now = new Date().toISOString();</code> | 声明局部标识符 `now`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 224 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 225 | <code>            taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 226 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 227 | <code>            originalGoal: prior?.originalGoal &#124;&#124; message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 228 | <code>            latestRequest: message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 229 | <code>            status: 'running',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 230 | <code>            childSessionId: prior?.childSessionId &#124;&#124; `${sessionId}:task-agent:${taskId}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 231 | <code>            latestRunId: `task_run_${randomUUID()}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 232 | <code>            checkpoint: prior?.checkpoint &#124;&#124; null,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 233 | <code>            evidenceRefs: prior?.evidenceRefs &#124;&#124; [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 234 | <code>            outputRefs: prior?.outputRefs &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 235 | <code>            sourceRefs: prior?.sourceRefs &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 236 | <code>            unresolvedFields: prior?.unresolvedFields &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 237 | <code>            traceRef: prior?.traceRef &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 238 | <code>            createdAt: prior?.createdAt &#124;&#124; now,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 239 | <code>            updatedAt: now</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 240 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 241 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>    async handoff(_args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 244 | <code>        const message = normalizeString(context.currentUserMessage);</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 245 | <code>        if (!message) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 246 | <code>            throw new Error('handoff_task requires the immutable current user message from the Agent Harness');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 247 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 248 | <code>        if (!this.executeTaskAgent) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 249 | <code>            throw new Error('System TaskAgent executor is not available');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 250 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>        const sessionId = normalizeString(context.sessionId &#124;&#124; context.sessionKey, 'main');</code> | 声明局部标识符 `sessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 252 | <code>        const parentRunId = normalizeString(context.runId &#124;&#124; context.parentRunId);</code> | 声明局部标识符 `parentRunId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 253 | <code>        const parentRunKey = parentRunId ? `${sessionId}:${parentRunId}` : '';</code> | 声明局部标识符 `parentRunKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 254 | <code>        const existingHandoff = parentRunKey ? this.parentRunHandoffs.get(parentRunKey) : null;</code> | 声明局部标识符 `existingHandoff`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 255 | <code>        if (existingHandoff?.promise) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 256 | <code>            this.emitEvent('task_agent.handoff.reused', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 257 | <code>                sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 258 | <code>                taskId: existingHandoff.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 259 | <code>                runId: existingHandoff.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 260 | <code>                parentRunId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 261 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>            return await existingHandoff.promise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 263 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 264 | <code>        const running = this.inFlight.get(sessionId);</code> | 声明局部标识符 `running`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 265 | <code>        if (running) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 266 | <code>            running.task.latestRequest = message;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 267 | <code>            running.task.updatedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 268 | <code>            this.state.sessions[sessionId] = running.task;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 269 | <code>            this.persist();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 270 | <code>            if (typeof running.inputHandler === 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 271 | <code>                await running.inputHandler(message);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 272 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 273 | <code>                running.pendingInputs.push(message);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 274 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>            this.emitEvent('task_agent.handoff.queued', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 276 | <code>                sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 277 | <code>                taskId: running.task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 278 | <code>                runId: running.task.latestRunId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 279 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 280 | <code>            return await running.promise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 281 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>        const prior = this.selectPriorTask(sessionId);</code> | 声明局部标识符 `prior`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 284 | <code>        const task = this.createTask({ sessionId, message, prior });</code> | 声明局部标识符 `task`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 285 | <code>        this.state.sessions[sessionId] = task;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 286 | <code>        this.persist();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 287 | <code>        this.emitEvent('task_agent.handoff.started', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 288 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 289 | <code>            taskId: task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 290 | <code>            runId: task.latestRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 291 | <code>            threadState: prior ? 'resumed' : 'created'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 292 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>        const inFlight = {</code> | 声明局部标识符 `inFlight`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 295 | <code>            task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 296 | <code>            inputHandler: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 297 | <code>            pendingInputs: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 298 | <code>            promise: null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 299 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 300 | <code>        const registerInputHandler = (handler) =&gt; {</code> | 声明局部标识符 `registerInputHandler`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 301 | <code>            inFlight.inputHandler = handler;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 302 | <code>            const pending = inFlight.pendingInputs.splice(0);</code> | 声明局部标识符 `pending`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 303 | <code>            for (const input of pending) {</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 304 | <code>                Promise.resolve(handler(input)).catch(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 305 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>            return () =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 307 | <code>                if (inFlight.inputHandler === handler) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 308 | <code>                    inFlight.inputHandler = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 309 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 312 | <code>        const inheritanceMode = prior?.checkpoint ? 'checkpoint' : 'clean';</code> | 声明局部标识符 `inheritanceMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 313 | <code>        const runPromise = (async () =&gt; {</code> | 声明局部标识符 `runPromise`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 314 | <code>            const result = await this.executeTaskAgent({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 315 | <code>                agent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 316 | <code>                    id: task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 317 | <code>                    label: 'TaskAgent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 318 | <code>                    runId: normalizeString(context.runId),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 319 | <code>                    sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 320 | <code>                    childRunId: task.latestRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 321 | <code>                    childSessionId: task.childSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 322 | <code>                    task: message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 323 | <code>                    originalTask: task.originalGoal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 324 | <code>                    agent_path: '/root/task_agent'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 325 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 326 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 327 | <code>                    task: message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 328 | <code>                    inheritanceMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 329 | <code>                    contextManagerCheckpoint: prior?.checkpoint &#124;&#124; null,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 330 | <code>                    maxAgentSteps: this.maxAgentSteps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 331 | <code>                    llmSettings: context.llmSettings &#124;&#124; context.llm &#124;&#124; null</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 332 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>                context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 334 | <code>                    ...context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 335 | <code>                    sessionId: task.childSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 336 | <code>                    sessionKey: task.childSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 337 | <code>                    parentSessionId: sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 338 | <code>                    originalUserGoal: task.originalGoal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 339 | <code>                    original_user_goal: task.originalGoal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 340 | <code>                    currentTaskRequest: task.latestRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 341 | <code>                    current_task_request: task.latestRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 342 | <code>                    priorUnresolvedFields: prior?.unresolvedFields &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 343 | <code>                    prior_unresolved_fields: prior?.unresolvedFields &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 344 | <code>                    taskAgentInheritanceMode: inheritanceMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 345 | <code>                    initialContextManagerCheckpoint: prior?.checkpoint &#124;&#124; null,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 346 | <code>                    maxAgentSteps: this.maxAgentSteps</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 347 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>                signal: context.signal,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 349 | <code>                registerInputHandler,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 350 | <code>                onEvent: async (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 351 | <code>                    this.emitEvent('task_agent.event', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 352 | <code>                        sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 353 | <code>                        taskId: task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 354 | <code>                        runId: task.latestRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 355 | <code>                        event: cloneJson(event) &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 356 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 357 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 358 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>            const packet = buildTaskResultPacket(result, task);</code> | 声明局部标识符 `packet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 360 | <code>            const handoff = result.taskRunHandoff &#124;&#124; result.task_run_handoff &#124;&#124; result.handoff &#124;&#124; {};</code> | 声明局部标识符 `handoff`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 361 | <code>            task.status = packet.status;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 362 | <code>            task.checkpoint = handoff.resume?.contextManagerCheckpoint &#124;&#124; handoff.resume?.context_manager_checkpoint &#124;&#124; null;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 363 | <code>            task.evidenceRefs = packet.evidence_refs;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 364 | <code>            task.outputRefs = packet.output_refs;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 365 | <code>            task.sourceRefs = packet.source_refs;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 366 | <code>            task.unresolvedFields = packet.unresolved_fields;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 367 | <code>            task.traceRef = packet.trace_ref;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 368 | <code>            task.updatedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 369 | <code>            this.state.sessions[sessionId] = task;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 370 | <code>            this.persist();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 371 | <code>            this.taskResultCapsules?.recordExecution?.({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 372 | <code>                sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 373 | <code>                parentRunId: normalizeString(context.runId),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 374 | <code>                action: prior ? 'resume' : 'spawn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 375 | <code>                task: task.originalGoal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 376 | <code>                ok: FINAL_STATUSES.has(packet.status),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 377 | <code>                status: packet.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 378 | <code>                subagent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 379 | <code>                    id: task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 380 | <code>                    childRunId: task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 381 | <code>                    sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 382 | <code>                    originalTask: task.originalGoal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 383 | <code>                    task: task.latestRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 384 | <code>                    status: packet.status</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 385 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>                childResult: result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 387 | <code>                taskRunHandoff: handoff,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 388 | <code>                unresolvedFields: packet.unresolved_fields</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 389 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 390 | <code>            this.emitEvent('task_agent.handoff.finished', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 391 | <code>                sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 392 | <code>                taskId: task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 393 | <code>                runId: task.latestRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 394 | <code>                status: packet.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 395 | <code>                traceRef: packet.trace_ref</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 396 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 397 | <code>            return packet;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 398 | <code>        })();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 399 | <code>        inFlight.promise = runPromise;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 400 | <code>        this.inFlight.set(sessionId, inFlight);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 401 | <code>        if (parentRunKey) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 402 | <code>            this.parentRunHandoffs.set(parentRunKey, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 403 | <code>                promise: runPromise,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 404 | <code>                taskId: task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 405 | <code>                runId: task.latestRunId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 406 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>            while (this.parentRunHandoffs.size &gt; MAX_PARENT_RUN_HANDOFFS) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 408 | <code>                this.parentRunHandoffs.delete(this.parentRunHandoffs.keys().next().value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 409 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 410 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 412 | <code>            return await runPromise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 413 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 414 | <code>            if (this.inFlight.get(sessionId) === inFlight) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 415 | <code>                this.inFlight.delete(sessionId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 416 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 418 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 419 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 420 | <code>    getStatus() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 421 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 422 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 423 | <code>            version: TASK_HARNESS_STATE_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 424 | <code>            statePath: this.statePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 425 | <code>            sessionCount: Object.keys(this.state.sessions).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 426 | <code>            inFlightCount: this.inFlight.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 427 | <code>            parentRunHandoffCount: this.parentRunHandoffs.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 428 | <code>            updatedAt: this.state.updatedAt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 429 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 431 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 432 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 433 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 434 | <code>    AILISSystemTaskAgentHarness,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 435 | <code>    TASK_HARNESS_STATE_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 436 | <code>    TASK_RESULT_SCHEMA,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 437 | <code>    buildTaskResultPacket</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 438 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
