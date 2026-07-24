# electron/ailis-prompt-model.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。
- 文件类型：`source-code`
- 原始行数：138
- SHA-256：`a0df97baf7841d1ceeac56464b377ed3a30422ea857a8e048a8076635417db04`
- 可运行副本：[打开源文件](../../../source/electron/ailis-prompt-model.cjs)
- 依赖：`crypto`、`./ailis-response-model.cjs`
- 主要符号：`BaseInstructions`、`Prompt`、`normalizedBaseInstructions`、`normalized`、`payload`、`CompactedItem`、`message`、`RolloutItem`、`TurnContextItem`、`ContextCompactionItem`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>'use strict';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>const { randomUUID } = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 6 | <code>    ResponseItem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 7 | <code>    cloneJson</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 8 | <code>} = require('./ailis-response-model.cjs');</code> | 导入依赖 `./ailis-response-model.cjs`，使本文件可以复用外部模块能力。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>const BaseInstructions = Object.freeze({</code> | 声明局部标识符 `BaseInstructions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 11 | <code>    create(text = '') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 12 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 13 | <code>            text: String(text &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 14 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 15 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 16 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>const Prompt = Object.freeze({</code> | 声明局部标识符 `Prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 19 | <code>    create({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 20 | <code>        input = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 21 | <code>        tools = [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 22 | <code>        parallel_tool_calls: parallelToolCalls = false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 23 | <code>        base_instructions: baseInstructions = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 24 | <code>        instructions = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 25 | <code>        personality = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 26 | <code>        output_schema: outputSchema = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 27 | <code>        output_schema_strict: outputSchemaStrict = true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 28 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 29 | <code>        const normalizedBaseInstructions = baseInstructions &amp;&amp; typeof baseInstructions === 'object'</code> | 声明局部标识符 `normalizedBaseInstructions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 30 | <code>            ? { text: String(baseInstructions.text &#124;&#124; '') }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 31 | <code>            : BaseInstructions.create(instructions);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 32 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 33 | <code>            input: Array.isArray(input) ? input.filter(Boolean).map(cloneJson) : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 34 | <code>            tools: Array.isArray(tools) ? tools.filter(Boolean).map(cloneJson) : [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 35 | <code>            parallel_tool_calls: parallelToolCalls === true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 36 | <code>            base_instructions: normalizedBaseInstructions,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 37 | <code>            ...(personality ? { personality: cloneJson(personality) } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 38 | <code>            ...(outputSchema ? { output_schema: cloneJson(outputSchema) } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 39 | <code>            output_schema_strict: outputSchemaStrict !== false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 40 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>    getFormattedInput(prompt = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 44 | <code>        return Array.isArray(prompt.input) ? prompt.input.map(cloneJson) : [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 45 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>    toRequestPayload(prompt = {}, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 48 | <code>        tool_choice: toolChoice = 'auto',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 49 | <code>        includePromptObject = false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 50 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 51 | <code>        const normalized = this.create(prompt);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 52 | <code>        const payload = {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 53 | <code>            instructions: String(normalized.base_instructions.text &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 54 | <code>            input: this.getFormattedInput(normalized),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 55 | <code>            tools: normalized.tools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 56 | <code>            tool_choice: toolChoice,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 57 | <code>            parallel_tool_calls: normalized.parallel_tool_calls</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 58 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 59 | <code>        if (normalized.output_schema) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 60 | <code>            payload.output_schema = cloneJson(normalized.output_schema);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 61 | <code>            payload.output_schema_strict = normalized.output_schema_strict;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 62 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>        if (normalized.personality) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 64 | <code>            payload.personality = cloneJson(normalized.personality);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 65 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>        if (includePromptObject) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 67 | <code>            payload.prompt = normalized;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 68 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>        return payload;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 70 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 71 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>const CompactedItem = Object.freeze({</code> | 声明局部标识符 `CompactedItem`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 74 | <code>    create({ message = '', replacement_history: replacementHistory = null } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 75 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 76 | <code>            message: String(message &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 77 | <code>            ...(Array.isArray(replacementHistory)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 78 | <code>                ? { replacement_history: replacementHistory.filter(Boolean).map(cloneJson) }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 79 | <code>                : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 80 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>    toResponseItem(compactedItem = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 84 | <code>        const message = String(compactedItem.message &#124;&#124; '');</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 85 | <code>        return ResponseItem.message({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 86 | <code>            role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 87 | <code>            content: [{ type: 'output_text', text: message }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 88 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>const RolloutItem = Object.freeze({</code> | 声明局部标识符 `RolloutItem`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 93 | <code>    compacted(compactedItem = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 94 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 95 | <code>            type: 'compacted',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 96 | <code>            payload: CompactedItem.create(compactedItem)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 97 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>    turnContext(turnContextItem = null) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 101 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 102 | <code>            type: 'turn_context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 103 | <code>            payload: turnContextItem ? cloneJson(turnContextItem) : null</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 104 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>    responseItem(responseItem = null) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 108 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 109 | <code>            type: 'response_item',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 110 | <code>            payload: responseItem ? cloneJson(responseItem) : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 111 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>const TurnContextItem = Object.freeze({</code> | 声明局部标识符 `TurnContextItem`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 116 | <code>    create(value = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 117 | <code>        return value &amp;&amp; typeof value === 'object' &amp;&amp; !Array.isArray(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 118 | <code>            ? cloneJson(value)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 119 | <code>            : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 120 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>const ContextCompactionItem = Object.freeze({</code> | 声明局部标识符 `ContextCompactionItem`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 124 | <code>    create({ id = null } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 125 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 126 | <code>            id: id ? String(id) : randomUUID()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 127 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 132 | <code>    BaseInstructions,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 133 | <code>    CompactedItem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 134 | <code>    ContextCompactionItem,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 135 | <code>    Prompt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 136 | <code>    RolloutItem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 137 | <code>    TurnContextItem</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。”这一文件职责。 |
| 138 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
