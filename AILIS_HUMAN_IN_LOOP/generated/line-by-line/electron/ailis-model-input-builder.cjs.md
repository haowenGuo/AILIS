# electron/ailis-model-input-builder.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。
- 文件类型：`source-code`
- 原始行数：479
- SHA-256：`68d21bc269fdb5c798fd3179a2968e6e867979d2c9e44b3b43635d6434d39056`
- 可运行副本：[打开源文件](../../../source/electron/ailis-model-input-builder.cjs)
- 依赖：`fs`、`path`、`./ailis-context-manager.cjs`、`./ailis-response-model.cjs`、`./ailis-agent-object-model.cjs`、`./ailis-message-history.cjs`
- 主要符号：`fs`、`path`、`textContent`、`normalized`、`outputTextContent`、`modelInputImageUrl`、`source`、`filePath`、`resolved`、`stat`、`extension`、`mimeType`、`responseItemOutputImages`、`output`、`responseMessage`、`functionCall`、`functionCallOutput`、`toolSearchCall`、`toolSearchOutput`、`toolOutputToModelInputItems`、`toolOutput`、`conversationToResponseItems`、`maxItems`、`role`、`memoryContextToText`、`buildMemoryDeveloperMessage`、`text`、`wrapped`、`buildContextMessage`、`context`、`content`、`imageUrl`、`buildModelInput`、`history`、`buildModelInputContextManager`、`priorMessageHistory`、`memoryMessage`、`contextMessage`、`userMessage`、`developerMessage`、`recordToolOutputToContextManager`、`items`、`recordModelImageAttachmentsToContextManager`、`requested`、`existing`、`fresh`、`restoreModelInputContextManagerFromCheckpoint`、`responseItemsToChatMessages`、`messages`、`contentParts`、`hasImage`、`outputImages`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>'use strict';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 4 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 5 | <code>const { ContextManager } = require('./ailis-context-manager.cjs');</code> | 导入依赖 `./ailis-context-manager.cjs`，使本文件可以复用外部模块能力。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 6 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 7 | <code>    FunctionCallOutputPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 8 | <code>    ResponseItem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 9 | <code>    normalizeText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 10 | <code>    responseItemOutputToText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 11 | <code>    safeJsonStringify</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 12 | <code>} = require('./ailis-response-model.cjs');</code> | 导入依赖 `./ailis-response-model.cjs`，使本文件可以复用外部模块能力。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 13 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 14 | <code>    normalizeToolOutput,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 15 | <code>    toolOutputToResponseItems</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 16 | <code>} = require('./ailis-agent-object-model.cjs');</code> | 导入依赖 `./ailis-agent-object-model.cjs`，使本文件可以复用外部模块能力。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 17 | <code>const { dropTrailingDuplicateUserMessage } = require('./ailis-message-history.cjs');</code> | 导入依赖 `./ailis-message-history.cjs`，使本文件可以复用外部模块能力。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>function textContent(text = '') {</code> | 定义函数 `textContent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 20 | <code>    const normalized = normalizeText(text);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 21 | <code>    return normalized ? [{ type: 'input_text', text: normalized }] : [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 22 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>function outputTextContent(text = '') {</code> | 定义函数 `outputTextContent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 25 | <code>    const normalized = normalizeText(text);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 26 | <code>    return normalized ? [{ type: 'output_text', text: normalized }] : [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 27 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>function modelInputImageUrl(value = '') {</code> | 定义函数 `modelInputImageUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 30 | <code>    const source = normalizeText(value);</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 31 | <code>    if (!source &#124;&#124; /^(?:data:&#124;https?:\/\/)/i.test(source)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 32 | <code>        return source;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 33 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>    let filePath = source;</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 35 | <code>    if (source.startsWith('file://')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 36 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 37 | <code>            filePath = decodeURIComponent(new URL(source).pathname.replace(/^\/([A-Za-z]:)/, '$1'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 38 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 39 | <code>            return source;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 40 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>    const resolved = path.resolve(filePath);</code> | 声明局部标识符 `resolved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 43 | <code>    const stat = (() =&gt; {</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 44 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 45 | <code>            return fs.statSync(resolved);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 46 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 47 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 48 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>    })();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 50 | <code>    if (!stat?.isFile() &#124;&#124; stat.size &gt; 20 * 1024 * 1024) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 51 | <code>        return source;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 52 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>    const extension = path.extname(resolved).toLowerCase();</code> | 声明局部标识符 `extension`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 54 | <code>    const mimeType = extension === '.jpg' &#124;&#124; extension === '.jpeg'</code> | 声明局部标识符 `mimeType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 55 | <code>        ? 'image/jpeg'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 56 | <code>        : extension === '.webp'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 57 | <code>        ? 'image/webp'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 58 | <code>        : extension === '.gif'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 59 | <code>        ? 'image/gif'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 60 | <code>        : 'image/png';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 61 | <code>    return `data:${mimeType};base64,${fs.readFileSync(resolved).toString('base64')}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 62 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>function responseItemOutputImages(item = {}) {</code> | 定义函数 `responseItemOutputImages`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 65 | <code>    if (item?.type !== 'function_call_output' &amp;&amp; item?.type !== 'custom_tool_call_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 66 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 67 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>    const output = FunctionCallOutputPayload.normalize(item.output);</code> | 声明局部标识符 `output`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 69 | <code>    if (output.body?.kind !== 'content_items') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 70 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 71 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 72 | <code>    return output.body.value</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 73 | <code>        .filter((part) =&gt; part?.type === 'input_image')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 74 | <code>        .map((part) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 75 | <code>            type: 'image_url',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 76 | <code>            image_url: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 77 | <code>                url: modelInputImageUrl(part.image_url &#124;&#124; part.url)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 78 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>            detail: normalizeText(part.detail) &#124;&#124; 'original'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 80 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>        .filter((part) =&gt; part.image_url.url);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 82 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>function responseMessage(role, text, options = {}) {</code> | 定义函数 `responseMessage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 85 | <code>    return ResponseItem.message({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 86 | <code>        role,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 87 | <code>        content: role === 'assistant' ? outputTextContent(text) : textContent(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 88 | <code>        phase: options.phase</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 89 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>function functionCall({</code> | 定义函数 `functionCall`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 93 | <code>    name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 94 | <code>    arguments: rawArguments = {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 95 | <code>    call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 96 | <code>    namespace = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 97 | <code>    provider_metadata: providerMetadata = null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 98 | <code>} = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 99 | <code>    return ResponseItem.functionCall({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 100 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 101 | <code>        arguments: rawArguments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 102 | <code>        call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 103 | <code>        namespace,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 104 | <code>        provider_metadata: providerMetadata</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 105 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 108 | <code>function functionCallOutput({ call_id: callId, output = '', success = null } = {}) {</code> | 定义函数 `functionCallOutput`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 109 | <code>    return ResponseItem.functionCallOutput({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 110 | <code>        call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 111 | <code>        output: FunctionCallOutputPayload.normalize(output, { success })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 112 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>function toolSearchCall({ call_id: callId, arguments: rawArguments = {} } = {}) {</code> | 定义函数 `toolSearchCall`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 116 | <code>    return ResponseItem.toolSearchCall({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 117 | <code>        call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 118 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 119 | <code>        execution: 'client',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 120 | <code>        arguments: rawArguments</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 121 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>function toolSearchOutput({ call_id: callId, tools = [] } = {}) {</code> | 定义函数 `toolSearchOutput`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 125 | <code>    return ResponseItem.toolSearchOutput({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 126 | <code>        call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 127 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 128 | <code>        execution: 'client',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 129 | <code>        tools</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 130 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>function toolOutputToModelInputItems(toolOutputLike = {}, index = 0, options = {}) {</code> | 定义函数 `toolOutputToModelInputItems`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 134 | <code>    const toolOutput = normalizeToolOutput(toolOutputLike, index, {</code> | 声明局部标识符 `toolOutput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 135 | <code>        previewChars: options.previewChars,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 136 | <code>        keepOriginal: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 137 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>    if (!toolOutput.toolName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 139 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 140 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>    return toolOutputToResponseItems(toolOutput, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 142 | <code>        toolOutputChars: options.toolOutputChars &#124;&#124; 24000</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 143 | <code>    }).filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 144 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>function conversationToResponseItems(messageHistory = [], options = {}) {</code> | 定义函数 `conversationToResponseItems`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 147 | <code>    const maxItems = Number(options.maxItems &#124;&#124; 6);</code> | 声明局部标识符 `maxItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 148 | <code>    return (Array.isArray(messageHistory) ? messageHistory : [])</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 149 | <code>        .slice(-maxItems)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 150 | <code>        .map((entry) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 151 | <code>            const role = entry?.role === 'assistant' ? 'assistant' : 'user';</code> | 声明局部标识符 `role`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 152 | <code>            return responseMessage(role, entry?.content &#124;&#124; entry?.text &#124;&#124; entry?.message &#124;&#124; '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 153 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>        .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 155 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>function memoryContextToText(memoryContext = '') {</code> | 定义函数 `memoryContextToText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 158 | <code>    if (!memoryContext) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 159 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 160 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>    if (typeof memoryContext.asDeveloperInstruction === 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 162 | <code>        return normalizeText(memoryContext.asDeveloperInstruction());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 163 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>    return normalizeText(memoryContext);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 165 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>function buildMemoryDeveloperMessage(memoryContext = '') {</code> | 定义函数 `buildMemoryDeveloperMessage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 168 | <code>    const text = memoryContextToText(memoryContext);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 169 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 170 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 171 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 172 | <code>    const wrapped = /&lt;memory_context&gt;/i.test(text)</code> | 声明局部标识符 `wrapped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 173 | <code>        ? text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 174 | <code>        : [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 175 | <code>              '&lt;memory_context&gt;',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 176 | <code>              'This is local background memory. The current user message is authoritative if there is any conflict.',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 177 | <code>              text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 178 | <code>              '&lt;/memory_context&gt;'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 179 | <code>          ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 180 | <code>    return responseMessage('developer', wrapped);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 181 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 183 | <code>function buildContextMessage({</code> | 定义函数 `buildContextMessage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 184 | <code>    fileAttachments = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 185 | <code>    modelImageAttachments = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 186 | <code>    runtimeEnvironment = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 187 | <code>    capabilityCatalog = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 188 | <code>    externalToolExposure = null</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 189 | <code>} = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 190 | <code>    const context = {};</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 191 | <code>    if (Array.isArray(fileAttachments) &amp;&amp; fileAttachments.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 192 | <code>        context.attached_files = fileAttachments;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 193 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>    if (runtimeEnvironment) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 195 | <code>        context.runtime_environment = runtimeEnvironment;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 196 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>    if (capabilityCatalog) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 198 | <code>        context.capability_catalog = capabilityCatalog;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 199 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>    if (externalToolExposure?.tools?.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 201 | <code>        context.external_tool_exposure = externalToolExposure;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 202 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>    if (!Object.keys(context).length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 204 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 205 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>    const content = textContent(safeJsonStringify({</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 207 | <code>        type: 'context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 208 | <code>        ...context</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 209 | <code>    }, '{}'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 210 | <code>    for (const attachment of Array.isArray(modelImageAttachments) ? modelImageAttachments : []) {</code> | 声明局部标识符 `attachment`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 211 | <code>        const imageUrl = normalizeText(</code> | 声明局部标识符 `imageUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 212 | <code>            attachment?.image_url &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 213 | <code>            attachment?.imageUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 214 | <code>            attachment?.url &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 215 | <code>            attachment?.path</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 216 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>        if (!imageUrl) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 218 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 219 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>        content.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 221 | <code>            type: 'input_image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 222 | <code>            image_url: imageUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 223 | <code>            detail: normalizeText(attachment?.detail) &#124;&#124; 'original'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 224 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 226 | <code>    return ResponseItem.message({ role: 'user', content });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 227 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 229 | <code>function buildModelInput({</code> | 定义函数 `buildModelInput`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 230 | <code>    message = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 231 | <code>    messageHistory = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 232 | <code>    toolOutputs = [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 233 | <code>    memoryContext = '',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 234 | <code>    fileAttachments = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 235 | <code>    modelImageAttachments = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 236 | <code>    inputModalities = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 237 | <code>    runtimeEnvironment = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 238 | <code>    capabilityCatalog = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 239 | <code>    externalToolExposure = null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 240 | <code>    toolOutputChars = 24000,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 241 | <code>    ephemeralDeveloperMessage = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 242 | <code>    suppressCurrentUserMessage = false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 243 | <code>} = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 244 | <code>    const history = buildModelInputContextManager({</code> | 声明局部标识符 `history`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 245 | <code>        message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 246 | <code>        messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 247 | <code>        toolOutputs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 248 | <code>        memoryContext,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 249 | <code>        fileAttachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 250 | <code>        modelImageAttachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 251 | <code>        runtimeEnvironment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 252 | <code>        capabilityCatalog,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 253 | <code>        externalToolExposure,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 254 | <code>        toolOutputChars,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 255 | <code>        ephemeralDeveloperMessage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 256 | <code>        suppressCurrentUserMessage</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 257 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>    return history.forPrompt({ inputModalities });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 259 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 261 | <code>function buildModelInputContextManager({</code> | 定义函数 `buildModelInputContextManager`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 262 | <code>    message = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 263 | <code>    messageHistory = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 264 | <code>    toolOutputs = [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 265 | <code>    memoryContext = '',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 266 | <code>    fileAttachments = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 267 | <code>    modelImageAttachments = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 268 | <code>    runtimeEnvironment = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 269 | <code>    capabilityCatalog = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 270 | <code>    externalToolExposure = null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 271 | <code>    toolOutputChars = 24000,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 272 | <code>    ephemeralDeveloperMessage = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 273 | <code>    suppressCurrentUserMessage = false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 274 | <code>} = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 275 | <code>    const history = new ContextManager({ toolOutputChars });</code> | 声明局部标识符 `history`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 276 | <code>    const priorMessageHistory = dropTrailingDuplicateUserMessage(messageHistory, message);</code> | 声明局部标识符 `priorMessageHistory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 277 | <code>    const memoryMessage = buildMemoryDeveloperMessage(memoryContext);</code> | 声明局部标识符 `memoryMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 278 | <code>    if (memoryMessage) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 279 | <code>        history.recordItems([memoryMessage]);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 280 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>    history.recordItems(conversationToResponseItems(priorMessageHistory));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 282 | <code>    const contextMessage = buildContextMessage({</code> | 声明局部标识符 `contextMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 283 | <code>        fileAttachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 284 | <code>        modelImageAttachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 285 | <code>        runtimeEnvironment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 286 | <code>        capabilityCatalog,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 287 | <code>        externalToolExposure</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 288 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 289 | <code>    if (contextMessage) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 290 | <code>        history.recordItems([contextMessage]);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 291 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>    if (suppressCurrentUserMessage !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 293 | <code>        const userMessage = responseMessage('user', message);</code> | 声明局部标识符 `userMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 294 | <code>        if (userMessage) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 295 | <code>            history.recordItems([userMessage]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 296 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>    const developerMessage = responseMessage('developer', ephemeralDeveloperMessage);</code> | 声明局部标识符 `developerMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 299 | <code>    if (developerMessage) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 300 | <code>        history.recordItems([developerMessage]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 301 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>    for (const [index, toolOutput] of (Array.isArray(toolOutputs) ? toolOutputs : []).entries()) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 303 | <code>        history.recordItems(toolOutputToModelInputItems(toolOutput, index, { toolOutputChars }));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 304 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 305 | <code>    return history;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 306 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>function recordToolOutputToContextManager(contextManager, toolOutput = {}, index = 0, options = {}) {</code> | 定义函数 `recordToolOutputToContextManager`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 309 | <code>    if (!contextManager &#124;&#124; typeof contextManager.recordItems !== 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 310 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 311 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 312 | <code>    const items = toolOutputToModelInputItems(toolOutput, index, options);</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 313 | <code>    contextManager.recordItems(items, options);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 314 | <code>    return items;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 315 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 317 | <code>function recordModelImageAttachmentsToContextManager(contextManager, modelImageAttachments = []) {</code> | 定义函数 `recordModelImageAttachmentsToContextManager`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 318 | <code>    if (!contextManager &#124;&#124; typeof contextManager.recordItems !== 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 319 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 320 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 321 | <code>    const requested = (Array.isArray(modelImageAttachments) ? modelImageAttachments : [])</code> | 声明局部标识符 `requested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 322 | <code>        .map((attachment) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 323 | <code>            image_url: normalizeText(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 324 | <code>                attachment?.image_url &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 325 | <code>                attachment?.imageUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 326 | <code>                attachment?.url &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 327 | <code>                attachment?.path</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 328 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>            detail: normalizeText(attachment?.detail) &#124;&#124; 'original'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 330 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 331 | <code>        .filter((attachment) =&gt; attachment.image_url);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 332 | <code>    if (!requested.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 333 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 334 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 335 | <code>    const existing = new Set(</code> | 声明局部标识符 `existing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 336 | <code>        (contextManager.rawItems?.() &#124;&#124; [])</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 337 | <code>            .flatMap((item) =&gt; Array.isArray(item?.content) ? item.content : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 338 | <code>            .filter((part) =&gt; part?.type === 'input_image')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 339 | <code>            .map((part) =&gt; normalizeText(part.image_url))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 340 | <code>            .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 341 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 342 | <code>    const fresh = requested.filter((attachment) =&gt; !existing.has(attachment.image_url));</code> | 声明局部标识符 `fresh`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 343 | <code>    if (!fresh.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 344 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 345 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 346 | <code>    contextManager.recordItems([ResponseItem.message({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 347 | <code>        role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 348 | <code>        content: fresh.map((attachment) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 349 | <code>            type: 'input_image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 350 | <code>            image_url: attachment.image_url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 351 | <code>            detail: attachment.detail</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 352 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 353 | <code>    })]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 354 | <code>    return fresh.length;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 355 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>function restoreModelInputContextManagerFromCheckpoint(checkpoint = null, options = {}) {</code> | 定义函数 `restoreModelInputContextManagerFromCheckpoint`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 358 | <code>    return ContextManager.fromCheckpoint(checkpoint, options);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 359 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 361 | <code>function responseItemsToChatMessages({ instructions = '', input = [] } = {}) {</code> | 定义函数 `responseItemsToChatMessages`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 362 | <code>    const messages = [];</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 363 | <code>    if (normalizeText(instructions)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 364 | <code>        messages.push({ role: 'system', content: instructions });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 365 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 366 | <code>    for (const item of Array.isArray(input) ? input : []) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 367 | <code>        if (item?.type === 'message') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 368 | <code>            const contentParts = (Array.isArray(item.content) ? item.content : [])</code> | 声明局部标识符 `contentParts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 369 | <code>                .map((part) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 370 | <code>                    if (part?.type === 'input_image') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 371 | <code>                        const imageUrl = normalizeText(part.image_url &#124;&#124; part.url);</code> | 声明局部标识符 `imageUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 372 | <code>                        return imageUrl ? {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 373 | <code>                            type: 'image_url',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 374 | <code>                            image_url: { url: imageUrl },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 375 | <code>                            detail: normalizeText(part.detail) &#124;&#124; 'original'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 376 | <code>                        } : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 377 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 378 | <code>                    const text = normalizeText(part?.text &#124;&#124; part?.content);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 379 | <code>                    return text ? { type: 'text', text } : null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 380 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 381 | <code>                .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 382 | <code>            const hasImage = contentParts.some((part) =&gt; part.type === 'image_url');</code> | 声明局部标识符 `hasImage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 383 | <code>            const content = Array.isArray(item.content)</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 384 | <code>                ? hasImage</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 385 | <code>                    ? contentParts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 386 | <code>                    : contentParts.map((part) =&gt; part.text).filter(Boolean).join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 387 | <code>                : normalizeText(item.content);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 388 | <code>            if (content) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 389 | <code>                const role = ['system', 'developer', 'user', 'assistant'].includes(item.role)</code> | 声明局部标识符 `role`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 390 | <code>                    ? item.role</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 391 | <code>                    : 'user';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 392 | <code>                messages.push({ role, content });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 393 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 394 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 395 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 396 | <code>        if (item?.type === 'function_call' &#124;&#124; item?.type === 'custom_tool_call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 397 | <code>            messages.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 398 | <code>                role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 399 | <code>                content: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 400 | <code>                ...(item.provider_metadata ? { providerMetadata: item.provider_metadata } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 401 | <code>                tool_calls: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 402 | <code>                    id: item.call_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 403 | <code>                    type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 404 | <code>                    function: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 405 | <code>                        name: item.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 406 | <code>                        arguments: typeof item.arguments === 'string' ? item.arguments : safeJsonStringify(item.arguments, '{}')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 407 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 408 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 409 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 410 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 411 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 412 | <code>        if (item?.type === 'tool_search_call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 413 | <code>            messages.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 414 | <code>                role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 415 | <code>                content: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 416 | <code>                ...(item.provider_metadata ? { providerMetadata: item.provider_metadata } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 417 | <code>                tool_calls: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 418 | <code>                    id: item.call_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 419 | <code>                    type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 420 | <code>                    function: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 421 | <code>                        name: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 422 | <code>                        arguments: safeJsonStringify(item.arguments &#124;&#124; {}, '{}')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 423 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 424 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 425 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 426 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 427 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 428 | <code>        if (item?.type === 'function_call_output' &#124;&#124; item?.type === 'custom_tool_call_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 429 | <code>            messages.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 430 | <code>                role: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 431 | <code>                tool_call_id: item.call_id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 432 | <code>                content: responseItemOutputToText(item)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 433 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 434 | <code>            const outputImages = responseItemOutputImages(item);</code> | 声明局部标识符 `outputImages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 435 | <code>            if (outputImages.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 436 | <code>                messages.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 437 | <code>                    role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 438 | <code>                    content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 439 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 440 | <code>                            type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 441 | <code>                            text: 'Visual artifact returned by the immediately preceding tool call. Inspect this image as tool evidence for the current request; it is not a new user request.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 442 | <code>                        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 443 | <code>                        ...outputImages</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 444 | <code>                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 445 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 446 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 447 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 448 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>        if (item?.type === 'tool_search_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 450 | <code>            messages.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 451 | <code>                role: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 452 | <code>                tool_call_id: item.call_id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 453 | <code>                content: safeJsonStringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 454 | <code>                    status: item.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 455 | <code>                    execution: item.execution,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 456 | <code>                    tools: item.tools &#124;&#124; []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 457 | <code>                }, '{}')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 458 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 459 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 460 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 461 | <code>    return messages;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 462 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 464 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 465 | <code>    buildMemoryDeveloperMessage,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 466 | <code>    buildModelInput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 467 | <code>    buildModelInputContextManager,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 468 | <code>    functionCall,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 469 | <code>    functionCallOutput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 470 | <code>    recordModelImageAttachmentsToContextManager,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 471 | <code>    recordToolOutputToContextManager,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 472 | <code>    restoreModelInputContextManagerFromCheckpoint,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 473 | <code>    responseItemOutputImages,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 474 | <code>    responseItemsToChatMessages,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 475 | <code>    responseMessage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 476 | <code>    toolOutputToModelInputItems,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 477 | <code>    toolSearchCall,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 478 | <code>    toolSearchOutput</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。”这一文件职责。 |
| 479 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
