# electron/ailis-context-manager.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。
- 文件类型：`source-code`
- 原始行数：785
- SHA-256：`9678f174409e2531c083670ee27d469346159fbdac7f74a538d684a190d523c8`
- 可运行副本：[打开源文件](../../../source/electron/ailis-context-manager.cjs)
- 依赖：`./ailis-response-model.cjs`、`./ailis-runtime-budget.cjs`
- 主要符号：`DEFAULT_TOOL_OUTPUT_CHARS`、`DEFAULT_RECENT_TOOL_OUTPUTS`、`DEFAULT_PINNED_COMPLETE_OUTPUTS`、`DEFAULT_STALE_TOOL_OUTPUT_CHARS`、`DEFAULT_COMPACTION_TRIGGER_OUTPUTS`、`DEFAULT_COMPACTION_TRIGGER_CHARS`、`IMAGE_CONTENT_OMITTED_PLACEHOLDER`、`normalizeInputModalities`、`supportsImages`、`modalities`、`truncateFunctionOutputPayload`、`normalized`、`items`、`stripImagesFromContentItems`、`stripImagesFromFunctionOutput`、`isToolOutputItem`、`messageText`、`isRuntimeContextMessage`、`text`、`uniqueMessages`、`seen`、`key`、`collectRecentVisibleMessages`、`messages`、`selected`、`usedChars`、`index`、`item`、`size`、`normalizeManifestList`、`collectRecentCallOutputPairs`、`calls`、`pairs`、`output`、`call`、`isPinnedCompleteObservationText`、`extractObservationHeaderLines`、`extractOutputRefsFromText`、`refs`、`patterns`、`outputId`、`collectAvailableOutputRefs`、`buildDroppedItemsManifest`、`compactedToolObservations`、`imageOmissions`、`normalizeContextPackageValue`、`compactToolOutputPayload`、`headerLines`、`compactedText`、`defaultOutputForCall`、`callId`、`ContextManager`、`replacementHistory`、`fallbackMessage`、`nextHistory`、`maxChars`、`clone`、`report`、`budgetReport`、`packageBefore`、`contextMode`、`personaMode`、`contextMessages`、`userMessages`、`originalTaskText`、`originalTask`、`recentUserMessages`、`checkpoint`、`checkpointMessage`、`recentPairs`、`personaVisibleBudget`、`recentVisibleMessages`、`shouldCompact`、`compactedItem`、`packageAfter`、`outputIndices`、`recent`、`pinned`、`outputIds`、`insertions`、`functionCallIds`、`customCallIds`、`toolSearchCallIds`、`content`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>'use strict';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 4 | <code>    ContentItem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 5 | <code>    FunctionCallOutputPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 6 | <code>    ResponseItem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 7 | <code>    callIdOf,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 8 | <code>    cloneJson,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 9 | <code>    isCallItem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 10 | <code>    isOutputItem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 11 | <code>    responseItemOutputToText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 12 | <code>} = require('./ailis-response-model.cjs');</code> | 导入依赖 `./ailis-response-model.cjs`，使本文件可以复用外部模块能力。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 13 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 14 | <code>    buildContextBudgetReport,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 15 | <code>    summarizeForModel</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 16 | <code>} = require('./ailis-runtime-budget.cjs');</code> | 导入依赖 `./ailis-runtime-budget.cjs`，使本文件可以复用外部模块能力。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>const DEFAULT_TOOL_OUTPUT_CHARS = 24000;</code> | 声明局部标识符 `DEFAULT_TOOL_OUTPUT_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 19 | <code>const DEFAULT_RECENT_TOOL_OUTPUTS = 4;</code> | 声明局部标识符 `DEFAULT_RECENT_TOOL_OUTPUTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 20 | <code>const DEFAULT_PINNED_COMPLETE_OUTPUTS = 2;</code> | 声明局部标识符 `DEFAULT_PINNED_COMPLETE_OUTPUTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 21 | <code>const DEFAULT_STALE_TOOL_OUTPUT_CHARS = 900;</code> | 声明局部标识符 `DEFAULT_STALE_TOOL_OUTPUT_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 22 | <code>const DEFAULT_COMPACTION_TRIGGER_OUTPUTS = 6;</code> | 声明局部标识符 `DEFAULT_COMPACTION_TRIGGER_OUTPUTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 23 | <code>const DEFAULT_COMPACTION_TRIGGER_CHARS = 32000;</code> | 声明局部标识符 `DEFAULT_COMPACTION_TRIGGER_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 24 | <code>const IMAGE_CONTENT_OMITTED_PLACEHOLDER = 'image content omitted because you do not support image input';</code> | 声明局部标识符 `IMAGE_CONTENT_OMITTED_PLACEHOLDER`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>function normalizeInputModalities(inputModalities = []) {</code> | 定义函数 `normalizeInputModalities`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 27 | <code>    return new Set((Array.isArray(inputModalities) ? inputModalities : [])</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 28 | <code>        .map((entry) =&gt; String(entry &#124;&#124; '').toLowerCase()));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 29 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>function supportsImages(inputModalities = []) {</code> | 定义函数 `supportsImages`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 32 | <code>    const modalities = normalizeInputModalities(inputModalities);</code> | 声明局部标识符 `modalities`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 33 | <code>    return modalities.has('image') &#124;&#124; modalities.has('vision') &#124;&#124; modalities.has('input_image');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 34 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>function truncateFunctionOutputPayload(payload = '', maxChars = DEFAULT_TOOL_OUTPUT_CHARS) {</code> | 定义函数 `truncateFunctionOutputPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 37 | <code>    const normalized = FunctionCallOutputPayload.normalize(payload);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 38 | <code>    if (normalized.body?.kind === 'content_items') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 39 | <code>        const items = normalized.body.value.map((item) =&gt; {</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 40 | <code>            if (item?.type !== 'input_text') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 41 | <code>                return cloneJson(item);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 42 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 44 | <code>                ...item,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 45 | <code>                text: summarizeForModel(item.text &#124;&#124; '', maxChars)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 46 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>        return FunctionCallOutputPayload.fromContentItems(items, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 49 | <code>            success: normalized.success</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 50 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>    return FunctionCallOutputPayload.fromText(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 53 | <code>        summarizeForModel(FunctionCallOutputPayload.toText(normalized), maxChars),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 54 | <code>        { success: normalized.success }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 55 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>function stripImagesFromContentItems(content = []) {</code> | 定义函数 `stripImagesFromContentItems`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 59 | <code>    return (Array.isArray(content) ? content : [])</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 60 | <code>        .filter((item) =&gt; item?.type !== 'input_image')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 61 | <code>        .map(cloneJson);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 62 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>function stripImagesFromFunctionOutput(payload = '') {</code> | 定义函数 `stripImagesFromFunctionOutput`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 65 | <code>    const normalized = FunctionCallOutputPayload.normalize(payload);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 66 | <code>    if (normalized.body?.kind !== 'content_items') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 67 | <code>        return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 68 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>    const items = normalized.body.value.map((item) =&gt;</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 70 | <code>        item?.type === 'input_image'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 71 | <code>            ? ContentItem.inputText(IMAGE_CONTENT_OMITTED_PLACEHOLDER)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 72 | <code>            : cloneJson(item)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 73 | <code>    ).filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 74 | <code>    return FunctionCallOutputPayload.fromContentItems(items, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 75 | <code>        success: normalized.success</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 76 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>function isToolOutputItem(item = {}) {</code> | 定义函数 `isToolOutputItem`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 80 | <code>    return item?.type === 'function_call_output' &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 81 | <code>        item?.type === 'custom_tool_call_output' &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 82 | <code>        item?.type === 'tool_search_output';</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 83 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>function messageText(item = {}) {</code> | 定义函数 `messageText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 86 | <code>    if (item?.type !== 'message') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 87 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 88 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>    return (Array.isArray(item.content) ? item.content : [])</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 90 | <code>        .map((part) =&gt; String(part?.text &#124;&#124; part?.content &#124;&#124; ''))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 91 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 92 | <code>        .join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 93 | <code>        .trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 94 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>function isRuntimeContextMessage(item = {}) {</code> | 定义函数 `isRuntimeContextMessage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 97 | <code>    const text = messageText(item);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 98 | <code>    return (item?.role === 'developer' &amp;&amp; /&lt;memory_context&gt;/i.test(text)) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 99 | <code>        (item?.role === 'user' &amp;&amp; /"type"\s*:\s*"context"/.test(text));</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 100 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>function uniqueMessages(items = []) {</code> | 定义函数 `uniqueMessages`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 103 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 104 | <code>    return (Array.isArray(items) ? items : []).filter((item) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 105 | <code>        const key = `${item?.role &#124;&#124; ''}:${messageText(item)}`;</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 106 | <code>        if (!messageText(item) &#124;&#124; seen.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 107 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 108 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>        seen.add(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 110 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 111 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 114 | <code>function collectRecentVisibleMessages(items = [], maxChars = 16000) {</code> | 定义函数 `collectRecentVisibleMessages`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 115 | <code>    const messages = uniqueMessages((Array.isArray(items) ? items : []).filter((item) =&gt;</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 116 | <code>        item?.type === 'message' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 117 | <code>        (item?.role === 'user' &#124;&#124; item?.role === 'assistant') &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 118 | <code>        !isRuntimeContextMessage(item)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 119 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>    const selected = [];</code> | 声明局部标识符 `selected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 121 | <code>    let usedChars = 0;</code> | 声明局部标识符 `usedChars`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 122 | <code>    for (let index = messages.length - 1; index &gt;= 0; index -= 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 123 | <code>        const item = messages[index];</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 124 | <code>        const size = JSON.stringify(item &#124;&#124; {}).length;</code> | 声明局部标识符 `size`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 125 | <code>        if (selected.length &amp;&amp; usedChars + size &gt; maxChars) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 126 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 127 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>        selected.push(cloneJson(item));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 129 | <code>        usedChars += size;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 130 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>    return selected.reverse();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 132 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>function normalizeManifestList(value = [], maxItems = 16) {</code> | 定义函数 `normalizeManifestList`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 135 | <code>    return (Array.isArray(value) ? value : [])</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 136 | <code>        .slice(-maxItems)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 137 | <code>        .map((entry) =&gt; normalizeContextPackageValue(entry, 1200))</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 138 | <code>        .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 139 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>function collectRecentCallOutputPairs(items = [], pairLimit = 4) {</code> | 定义函数 `collectRecentCallOutputPairs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 142 | <code>    const calls = new Map();</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 143 | <code>    for (const item of Array.isArray(items) ? items : []) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 144 | <code>        if (isCallItem(item) &amp;&amp; callIdOf(item)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 145 | <code>            calls.set(callIdOf(item), item);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 146 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>    const pairs = [];</code> | 声明局部标识符 `pairs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 149 | <code>    for (let index = items.length - 1; index &gt;= 0 &amp;&amp; pairs.length &lt; pairLimit; index -= 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 150 | <code>        const output = items[index];</code> | 声明局部标识符 `output`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 151 | <code>        if (!isOutputItem(output) &#124;&#124; !callIdOf(output)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 152 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 153 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>        const call = calls.get(callIdOf(output));</code> | 声明局部标识符 `call`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 155 | <code>        if (call) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 156 | <code>            pairs.push([cloneJson(call), cloneJson(output)]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 157 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>    return pairs.reverse().flat();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 160 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>function isPinnedCompleteObservationText(text = '') {</code> | 定义函数 `isPinnedCompleteObservationText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 163 | <code>    return /reasoning[_-]?ready\s*[:=]\s*true/i.test(text) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 164 | <code>        /\bcomplete\s*[:=]\s*true\b/i.test(text) &amp;&amp; /\btruncated\s*[:=]\s*false\b/i.test(text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 165 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>function extractObservationHeaderLines(text = '') {</code> | 定义函数 `extractObservationHeaderLines`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 168 | <code>    return String(text &#124;&#124; '')</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 169 | <code>        .split(/\r?\n/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 170 | <code>        .map((line) =&gt; line.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 171 | <code>        .filter((line) =&gt; /^(Status&#124;Error&#124;DurationMs&#124;OutputArtifact&#124;OutputArtifactTools&#124;OutputArtifactHint&#124;exitCode&#124;outputId&#124;bytes&#124;modelHint)\b/i.test(line) &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 172 | <code>            /^&lt;truncated\b/i.test(line) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 173 | <code>            /\b(reasoning[_-]?ready&#124;complete&#124;truncated)\s*[:=]/i.test(line))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 174 | <code>        .slice(0, 18);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 175 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>function extractOutputRefsFromText(text = '') {</code> | 定义函数 `extractOutputRefsFromText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 178 | <code>    const refs = [];</code> | 声明局部标识符 `refs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 179 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 180 | <code>    const patterns = [</code> | 声明局部标识符 `patterns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 181 | <code>        /\b(?:outputId&#124;output_id&#124;OutputArtifact&#124;artifactId)\s*[:=]\s*([A-Za-z0-9._:-]+)/gi,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 182 | <code>        /\boutputRef\.?outputId\s*[:=]\s*([A-Za-z0-9._:-]+)/gi</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 183 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>    for (const pattern of patterns) {</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 185 | <code>        for (const match of String(text &#124;&#124; '').matchAll(pattern)) {</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 186 | <code>            const outputId = String(match?.[1] &#124;&#124; '').trim();</code> | 声明局部标识符 `outputId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 187 | <code>            if (!outputId &#124;&#124; seen.has(outputId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 188 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 189 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>            seen.add(outputId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 191 | <code>            refs.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 192 | <code>                outputId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 193 | <code>                readTools: ['output_read', 'output_tail', 'output_search']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 194 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 196 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>    return refs;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 198 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>function collectAvailableOutputRefs(items = []) {</code> | 定义函数 `collectAvailableOutputRefs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 201 | <code>    const refs = [];</code> | 声明局部标识符 `refs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 202 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 203 | <code>    for (const item of Array.isArray(items) ? items : []) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 204 | <code>        if (!isToolOutputItem(item) &amp;&amp; item?.type !== 'tool_search_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 205 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 206 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>        const text = responseItemOutputToText(item);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 208 | <code>        for (const ref of extractOutputRefsFromText(text)) {</code> | 声明局部标识符 `ref`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 209 | <code>            if (seen.has(ref.outputId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 210 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 211 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>            seen.add(ref.outputId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 213 | <code>            refs.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 214 | <code>                ...ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 215 | <code>                callId: callIdOf(item) &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 216 | <code>                sourceType: item.type</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 217 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>    return refs;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 221 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 223 | <code>function buildDroppedItemsManifest(items = []) {</code> | 定义函数 `buildDroppedItemsManifest`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 224 | <code>    let compactedToolObservations = 0;</code> | 声明局部标识符 `compactedToolObservations`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 225 | <code>    let imageOmissions = 0;</code> | 声明局部标识符 `imageOmissions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 226 | <code>    for (const item of Array.isArray(items) ? items : []) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 227 | <code>        const text = item?.type === 'message'</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 228 | <code>            ? JSON.stringify(item.content &#124;&#124; [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 229 | <code>            : responseItemOutputToText(item);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 230 | <code>        if (String(text &#124;&#124; '').includes('OLDER_TOOL_OBSERVATION_COMPACTED')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 231 | <code>            compactedToolObservations += 1;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 232 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 233 | <code>        if (String(text &#124;&#124; '').includes(IMAGE_CONTENT_OMITTED_PLACEHOLDER)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 234 | <code>            imageOmissions += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 235 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 238 | <code>        compactedToolObservations,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 239 | <code>        imageOmissions</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 240 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 241 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>function normalizeContextPackageValue(value, maxChars = 4000) {</code> | 定义函数 `normalizeContextPackageValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 244 | <code>    if (value == null &#124;&#124; value === '') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 245 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 246 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 247 | <code>    if (typeof value === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 248 | <code>        return summarizeForModel(value, maxChars);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 249 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 251 | <code>        const text = JSON.stringify(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 252 | <code>        if (text.length &lt;= maxChars) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 253 | <code>            return cloneJson(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 254 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 256 | <code>        return String(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 257 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>    return summarizeForModel(value, maxChars);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 259 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 261 | <code>function compactToolOutputPayload(payload = '', maxChars = DEFAULT_STALE_TOOL_OUTPUT_CHARS) {</code> | 定义函数 `compactToolOutputPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 262 | <code>    const normalized = FunctionCallOutputPayload.normalize(payload);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 263 | <code>    const text = FunctionCallOutputPayload.toText(normalized);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 264 | <code>    if (!text &#124;&#124; text.includes('OLDER_TOOL_OBSERVATION_COMPACTED') &#124;&#124; text.length &lt;= maxChars) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 265 | <code>        return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 266 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>    const headerLines = extractObservationHeaderLines(text);</code> | 声明局部标识符 `headerLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 268 | <code>    const compactedText = [</code> | 声明局部标识符 `compactedText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 269 | <code>        'OLDER_TOOL_OBSERVATION_COMPACTED:',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 270 | <code>        `originalTextChars=${text.length}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 271 | <code>        'Reason: older exploratory tool output was compacted to keep the active task context focused.',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 272 | <code>        'Use newer complete observations first; if this output exposes outputId, use output_read/output_tail/output_search for a focused slice.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 273 | <code>        headerLines.length ? '--- retained status lines ---' : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 274 | <code>        ...headerLines,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 275 | <code>        '--- compact preview ---',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 276 | <code>        summarizeForModel(text, maxChars)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 277 | <code>    ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 278 | <code>    return FunctionCallOutputPayload.fromText(compactedText, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 279 | <code>        success: FunctionCallOutputPayload.success(normalized)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 280 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 283 | <code>function defaultOutputForCall(call = {}) {</code> | 定义函数 `defaultOutputForCall`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 284 | <code>    const callId = callIdOf(call);</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 285 | <code>    if (!callId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 286 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 287 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>    if (call.type === 'tool_search_call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 289 | <code>        return ResponseItem.toolSearchOutput({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 290 | <code>            call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 291 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 292 | <code>            execution: call.execution &#124;&#124; 'client',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 293 | <code>            tools: []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 294 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 295 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 296 | <code>    if (call.type === 'local_shell_call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 297 | <code>        return ResponseItem.functionCallOutput({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 298 | <code>            call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 299 | <code>            output: 'aborted',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 300 | <code>            success: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 301 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>    if (call.type === 'custom_tool_call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 304 | <code>        return ResponseItem.customToolCallOutput({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 305 | <code>            call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 306 | <code>            name: call.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 307 | <code>            output: 'Status: aborted\nOutput:\nTool call did not produce an output.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 308 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 309 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>    return ResponseItem.functionCallOutput({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 311 | <code>        call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 312 | <code>        output: 'Status: aborted\nOutput:\nTool call did not produce an output.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 313 | <code>        success: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 314 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 315 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 317 | <code>class ContextManager {</code> | 定义类 `ContextManager`，把相关状态与行为收拢为一个运行时对象。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 318 | <code>    constructor({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 319 | <code>        items = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 320 | <code>        history_version: historyVersion = 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 321 | <code>        token_info: tokenInfo = null,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 322 | <code>        reference_context_item: referenceContextItem = null,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 323 | <code>        toolOutputChars = DEFAULT_TOOL_OUTPUT_CHARS</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 324 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 325 | <code>        this.items = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 326 | <code>        this.history_version = Number(historyVersion &#124;&#124; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 327 | <code>        this.token_info = tokenInfo;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 328 | <code>        this.reference_context_item = referenceContextItem;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 329 | <code>        this.toolOutputChars = Number(toolOutputChars &#124;&#124; DEFAULT_TOOL_OUTPUT_CHARS);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 330 | <code>        this.recordItems(items);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 331 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 333 | <code>    setReferenceContextItem(item = null) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 334 | <code>        this.reference_context_item = item ? cloneJson(item) : null;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 335 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>    referenceContextItem() {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 338 | <code>        return this.reference_context_item ? cloneJson(this.reference_context_item) : null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 339 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 341 | <code>    setTokenInfo(info = null) {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 342 | <code>        this.token_info = info ? cloneJson(info) : null;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 343 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 345 | <code>    tokenInfo() {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 346 | <code>        return this.token_info ? cloneJson(this.token_info) : null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 347 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 349 | <code>    historyVersion() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 350 | <code>        return this.history_version;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 351 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>    rawItems() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 354 | <code>        return this.items.map(cloneJson);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 355 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>    replace(items = [], referenceContextItem = this.reference_context_item) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 358 | <code>        this.items = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 359 | <code>        this.recordItems(items);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 360 | <code>        this.setReferenceContextItem(referenceContextItem);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 361 | <code>        this.history_version += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 362 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 364 | <code>    replaceCompactedHistory(compactedItem = {}, referenceContextItem = this.reference_context_item) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 365 | <code>        const replacementHistory = Array.isArray(compactedItem.replacement_history)</code> | 声明局部标识符 `replacementHistory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 366 | <code>            ? compactedItem.replacement_history</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 367 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 368 | <code>        const fallbackMessage = String(compactedItem.message &#124;&#124; '').trim()</code> | 声明局部标识符 `fallbackMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 369 | <code>            ? ResponseItem.message({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 370 | <code>                  role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 371 | <code>                  content: [{ type: 'output_text', text: String(compactedItem.message &#124;&#124; '') }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 372 | <code>              })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 373 | <code>            : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 374 | <code>        const nextHistory = replacementHistory.length</code> | 声明局部标识符 `nextHistory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 375 | <code>            ? replacementHistory</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 376 | <code>            : [fallbackMessage].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 377 | <code>        this.replace(nextHistory, referenceContextItem);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 378 | <code>        return this.toCheckpoint();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 379 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 381 | <code>    recordItems(items = [], policy = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 382 | <code>        const maxChars = Number(policy.toolOutputChars &#124;&#124; this.toolOutputChars &#124;&#124; DEFAULT_TOOL_OUTPUT_CHARS);</code> | 声明局部标识符 `maxChars`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 383 | <code>        for (const item of Array.isArray(items) ? items : []) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 384 | <code>            if (!item &#124;&#124; typeof item !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 385 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 386 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 387 | <code>            this.items.push(this.processItem(item, { toolOutputChars: maxChars }));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 388 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 389 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 391 | <code>    processItem(item = {}, policy = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 392 | <code>        const maxChars = Number(policy.toolOutputChars &#124;&#124; this.toolOutputChars &#124;&#124; DEFAULT_TOOL_OUTPUT_CHARS);</code> | 声明局部标识符 `maxChars`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 393 | <code>        if (item.type === 'function_call_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 394 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 395 | <code>                ...cloneJson(item),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 396 | <code>                output: truncateFunctionOutputPayload(item.output, maxChars)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 397 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 398 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 399 | <code>        if (item.type === 'custom_tool_call_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 400 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 401 | <code>                ...cloneJson(item),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 402 | <code>                output: truncateFunctionOutputPayload(item.output, maxChars)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 403 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 404 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 405 | <code>        return cloneJson(item);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 406 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>    clone() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 409 | <code>        return new ContextManager({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 410 | <code>            items: this.rawItems(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 411 | <code>            history_version: this.history_version,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 412 | <code>            token_info: this.token_info,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 413 | <code>            reference_context_item: this.reference_context_item,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 414 | <code>            toolOutputChars: this.toolOutputChars</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 415 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 416 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 418 | <code>    forPrompt(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 419 | <code>        const { inputModalities = [] } = options &#124;&#124; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 420 | <code>        const clone = this.clone();</code> | 声明局部标识符 `clone`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 421 | <code>        clone.normalizeHistory(inputModalities);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 422 | <code>        clone.compactForBudget(options);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 423 | <code>        return clone.rawItems();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 424 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 425 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 426 | <code>    forPromptPackage(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 427 | <code>        const { inputModalities = [] } = options &#124;&#124; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 428 | <code>        const clone = this.clone();</code> | 声明局部标识符 `clone`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 429 | <code>        clone.normalizeHistory(inputModalities);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 430 | <code>        clone.compactForBudget(options);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 431 | <code>        return clone.buildContextPackage(options);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 432 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 434 | <code>    contextBudgetReport(options = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 435 | <code>        return buildContextBudgetReport({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 436 | <code>            staticPrefix: options.staticPrefix &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 437 | <code>            instructions: options.instructions &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 438 | <code>            goal: options.goal &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 439 | <code>            runtimeEnvironment: options.runtimeEnvironment &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 440 | <code>            taskState: options.taskState &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 441 | <code>            referenceContextItem: this.reference_context_item,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 442 | <code>            tokenInfo: this.token_info,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 443 | <code>            recentResponseItems: this.items,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 444 | <code>            toolSummary: options.toolSummary &#124;&#124; null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 445 | <code>            toolSchemas: options.toolSchemas &#124;&#124; options.tools &#124;&#124; null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 446 | <code>            pinnedEvidenceManifest: options.pinnedEvidenceManifest &#124;&#124; options.evidenceManifest &#124;&#124; null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 447 | <code>            availableOutputRefs: collectAvailableOutputRefs(this.items)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 448 | <code>        }, options.budgetConfig &#124;&#124; options.contextBudget &#124;&#124; {});</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 449 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 451 | <code>    compactForBudget(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 452 | <code>        let report = this.contextBudgetReport(options);</code> | 声明局部标识符 `report`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 453 | <code>        if (report.level === 'soft' &#124;&#124; report.level === 'hard' &#124;&#124; report.level === 'stop') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 454 | <code>            this.compactStaleToolOutputs({ force: true });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 455 | <code>            report = this.contextBudgetReport(options);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 456 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 457 | <code>        if (report.level === 'stop') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 458 | <code>            this.compactStaleToolOutputs({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 459 | <code>                force: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 460 | <code>                maxChars: Math.max(300, Math.floor(DEFAULT_STALE_TOOL_OUTPUT_CHARS / 2))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 461 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>            report = this.contextBudgetReport(options);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 463 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 464 | <code>        this.last_context_budget_report = report;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 465 | <code>        return report;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 466 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 467 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 468 | <code>    buildContextPackage(options = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 469 | <code>        const items = this.rawItems();</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 470 | <code>        const budgetReport = this.last_context_budget_report &#124;&#124; this.contextBudgetReport(options);</code> | 声明局部标识符 `budgetReport`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 471 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 472 | <code>            schema: 'ailis.context_package.v1',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 473 | <code>            historyVersion: this.history_version,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 474 | <code>            goal: normalizeContextPackageValue(options.goal &#124;&#124; '', 2000),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 475 | <code>            runtimeEnvironment: normalizeContextPackageValue(options.runtimeEnvironment &#124;&#124; null, 3000),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 476 | <code>            taskState: normalizeContextPackageValue(options.taskState &#124;&#124; null, 3000),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 477 | <code>            referenceContextItem: this.reference_context_item ? cloneJson(this.reference_context_item) : null,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 478 | <code>            recentResponseItems: items,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 479 | <code>            toolSummary: normalizeContextPackageValue(options.toolSummary &#124;&#124; null, 4000),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 480 | <code>            pinnedEvidenceManifest: Array.isArray(options.pinnedEvidenceManifest &#124;&#124; options.evidenceManifest)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 481 | <code>                ? cloneJson(options.pinnedEvidenceManifest &#124;&#124; options.evidenceManifest)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 482 | <code>                : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 483 | <code>            availableOutputRefs: collectAvailableOutputRefs(items),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 484 | <code>            droppedItemsManifest: buildDroppedItemsManifest(items),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 485 | <code>            budgetReport</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 486 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 487 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 489 | <code>    buildSemanticCompactedItem(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 490 | <code>        const packageBefore = this.buildContextPackage(options);</code> | 声明局部标识符 `packageBefore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 491 | <code>        const contextMode = String(options.contextMode &#124;&#124; 'task_agent').trim().toLowerCase();</code> | 声明局部标识符 `contextMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 492 | <code>        const personaMode = contextMode === 'persona';</code> | 声明局部标识符 `personaMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 493 | <code>        const contextMessages = this.items.filter(isRuntimeContextMessage).slice(-4);</code> | 声明局部标识符 `contextMessages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 494 | <code>        const userMessages = uniqueMessages(this.items.filter((item) =&gt;</code> | 声明局部标识符 `userMessages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 495 | <code>            item?.type === 'message' &amp;&amp; item?.role === 'user' &amp;&amp; !isRuntimeContextMessage(item)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 496 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 497 | <code>        const originalTaskText = String(options.goal &#124;&#124; messageText(userMessages[0]) &#124;&#124; '').trim();</code> | 声明局部标识符 `originalTaskText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 498 | <code>        const originalTask = originalTaskText</code> | 声明局部标识符 `originalTask`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 499 | <code>            ? ResponseItem.message({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 500 | <code>                  role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 501 | <code>                  content: [{ type: 'input_text', text: originalTaskText }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 502 | <code>              })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 503 | <code>            : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 504 | <code>        const recentUserMessages = userMessages</code> | 声明局部标识符 `recentUserMessages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 505 | <code>            .filter((item) =&gt; messageText(item) !== originalTaskText)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 506 | <code>            .slice(-2)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 507 | <code>            .map(cloneJson);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 508 | <code>        const checkpoint = {</code> | 声明局部标识符 `checkpoint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 509 | <code>            schema: 'ailis.semantic_context_checkpoint.v1',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 510 | <code>            contextMode,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 511 | <code>            reason: String(options.compactionReason &#124;&#124; packageBefore.budgetReport.level &#124;&#124; 'context_budget'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 512 | <code>            originalGoalPreservedVerbatim: Boolean(originalTaskText),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 513 | <code>            originalGoal: originalTaskText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 514 | <code>            constraints: normalizeManifestList(options.constraints &#124;&#124; options.taskState?.constraints &#124;&#124; [], 24),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 515 | <code>            currentPlan: normalizeContextPackageValue(</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 516 | <code>                options.currentPlan &#124;&#124; options.taskState?.currentPlan &#124;&#124; options.taskState?.plan &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 517 | <code>                5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 518 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 519 | <code>            unresolvedFields: normalizeManifestList(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 520 | <code>                options.unresolvedFields &#124;&#124; options.taskState?.unresolvedFields &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 521 | <code>                24</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 522 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>            taskState: normalizeContextPackageValue(options.taskState &#124;&#124; null, 5000),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 524 | <code>            evidenceManifest: normalizeManifestList(</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 525 | <code>                options.pinnedEvidenceManifest &#124;&#124; options.evidenceManifest &#124;&#124; [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 526 | <code>                16</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 527 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 528 | <code>            outputRefs: packageBefore.availableOutputRefs.slice(-24),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 529 | <code>            droppedItemsManifest: packageBefore.droppedItemsManifest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 530 | <code>            instruction: personaMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 531 | <code>                ? 'Continue the same visible conversation. Use the active task state and recent user/assistant turns as context; do not invent missing history.'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 532 | <code>                : 'Continue the same task from this checkpoint. Do not repeat completed work. Use the preserved original task and constraints as the authority.'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 533 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 534 | <code>        const checkpointMessage = ResponseItem.message({</code> | 声明局部标识符 `checkpointMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 535 | <code>            role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 536 | <code>            content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 537 | <code>                type: 'input_text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 538 | <code>                text: `&lt;ailis_context_checkpoint&gt;\n${JSON.stringify(checkpoint)}\n&lt;/ailis_context_checkpoint&gt;`</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 539 | <code>            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 540 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 541 | <code>        const recentPairs = collectRecentCallOutputPairs(</code> | 声明局部标识符 `recentPairs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 542 | <code>            packageBefore.recentResponseItems,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 543 | <code>            Number(options.recentToolPairs &#124;&#124; (personaMode ? 2 : 4))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 544 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 545 | <code>        const personaVisibleBudget = Math.max(</code> | 声明局部标识符 `personaVisibleBudget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 546 | <code>            6000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 547 | <code>            Math.min(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 548 | <code>                Number(options.personaVisibleHistoryChars) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 549 | <code>                    Number(options.budgetConfig?.effectiveInputLimitTokens &#124;&#124; 0) * 2,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 550 | <code>                30000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 551 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 552 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 553 | <code>        const recentVisibleMessages = personaMode</code> | 声明局部标识符 `recentVisibleMessages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 554 | <code>            ? collectRecentVisibleMessages(this.items, personaVisibleBudget)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 555 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 556 | <code>        const replacementHistory = personaMode</code> | 声明局部标识符 `replacementHistory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 557 | <code>            ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 558 | <code>                  ...contextMessages.map(cloneJson),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 559 | <code>                  ...recentVisibleMessages,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 560 | <code>                  checkpointMessage,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 561 | <code>                  ...recentPairs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 562 | <code>              ].filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 563 | <code>            : [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 564 | <code>                  ...contextMessages.map(cloneJson),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 565 | <code>                  originalTask,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 566 | <code>                  ...recentUserMessages,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 567 | <code>                  checkpointMessage,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 568 | <code>                  ...recentPairs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 569 | <code>              ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 570 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 571 | <code>            message: `Semantic context checkpoint created for: ${summarizeForModel(originalTaskText, 240)}`,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 572 | <code>            replacement_history: replacementHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 573 | <code>            checkpoint,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 574 | <code>            packageBefore</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 575 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 576 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 577 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 578 | <code>    semanticCompact(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 579 | <code>        this.normalizeHistory(options.inputModalities &#124;&#124; []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 580 | <code>        const packageBefore = this.forPromptPackage(options);</code> | 声明局部标识符 `packageBefore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 581 | <code>        const shouldCompact = options.force === true &#124;&#124;</code> | 声明局部标识符 `shouldCompact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 582 | <code>            packageBefore.budgetReport.level === 'hard' &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 583 | <code>            packageBefore.budgetReport.level === 'stop';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 584 | <code>        if (!shouldCompact) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 585 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 586 | <code>                compacted: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 587 | <code>                packageBefore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 588 | <code>                packageAfter: packageBefore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 589 | <code>                historyVersion: this.history_version</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 590 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 591 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 592 | <code>        const compactedItem = this.buildSemanticCompactedItem({</code> | 声明局部标识符 `compactedItem`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 593 | <code>            ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 594 | <code>            compactionReason: options.compactionReason &#124;&#124; packageBefore.budgetReport.level</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 595 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 596 | <code>        this.replaceCompactedHistory(compactedItem, this.reference_context_item);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 597 | <code>        const packageAfter = this.forPromptPackage(options);</code> | 声明局部标识符 `packageAfter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 598 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 599 | <code>            compacted: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 600 | <code>            reason: compactedItem.checkpoint.reason,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 601 | <code>            checkpoint: compactedItem.checkpoint,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 602 | <code>            packageBefore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 603 | <code>            packageAfter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 604 | <code>            historyVersion: this.history_version</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 605 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 606 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 607 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 608 | <code>    normalizeHistory(inputModalities = []) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 609 | <code>        this.ensureCallOutputsPresent();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 610 | <code>        this.removeOrphanOutputs();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 611 | <code>        this.compactStaleToolOutputs();</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 612 | <code>        if (!supportsImages(inputModalities)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 613 | <code>            this.stripImagesWhenUnsupported();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 614 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 615 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 616 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 617 | <code>    compactStaleToolOutputs({ force = false, maxChars = DEFAULT_STALE_TOOL_OUTPUT_CHARS } = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 618 | <code>        const outputIndices = this.items</code> | 声明局部标识符 `outputIndices`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 619 | <code>            .map((item, index) =&gt; (isToolOutputItem(item) ? index : -1))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 620 | <code>            .filter((index) =&gt; index &gt;= 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 621 | <code>        if (!force &amp;&amp;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 622 | <code>            outputIndices.length &lt;= DEFAULT_COMPACTION_TRIGGER_OUTPUTS &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 623 | <code>            this.totalModelVisibleChars() &lt;= DEFAULT_COMPACTION_TRIGGER_CHARS) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 624 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 625 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 626 | <code>        const recent = new Set(outputIndices.slice(-DEFAULT_RECENT_TOOL_OUTPUTS));</code> | 声明局部标识符 `recent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 627 | <code>        const pinned = new Set();</code> | 声明局部标识符 `pinned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 628 | <code>        for (const index of outputIndices.slice().reverse()) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 629 | <code>            if (pinned.size &gt;= DEFAULT_PINNED_COMPLETE_OUTPUTS) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 630 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 631 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 632 | <code>            if (recent.has(index)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 633 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 634 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 635 | <code>            const text = FunctionCallOutputPayload.toText(this.items[index]?.output &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 636 | <code>            if (isPinnedCompleteObservationText(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 637 | <code>                pinned.add(index);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 638 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 639 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 640 | <code>        this.items = this.items.map((item, index) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 641 | <code>            if (!isToolOutputItem(item) &#124;&#124; recent.has(index) &#124;&#124; pinned.has(index)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 642 | <code>                return cloneJson(item);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 643 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 644 | <code>            if (item.type === 'tool_search_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 645 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 646 | <code>                    ...cloneJson(item),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 647 | <code>                    tools: (Array.isArray(item.tools) ? item.tools : []).slice(0, 5)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 648 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 649 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 650 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 651 | <code>                ...cloneJson(item),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 652 | <code>                output: compactToolOutputPayload(item.output, maxChars)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 653 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 654 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 655 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 656 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 657 | <code>    ensureCallOutputsPresent() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 658 | <code>        const outputIds = new Set(this.items.filter(isOutputItem).map(callIdOf).filter(Boolean));</code> | 声明局部标识符 `outputIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 659 | <code>        const insertions = [];</code> | 声明局部标识符 `insertions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 660 | <code>        for (const [index, item] of this.items.entries()) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 661 | <code>            if (!isCallItem(item)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 662 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 663 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 664 | <code>            const callId = callIdOf(item);</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 665 | <code>            if (!callId &#124;&#124; outputIds.has(callId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 666 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 667 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 668 | <code>            const output = defaultOutputForCall(item);</code> | 声明局部标识符 `output`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 669 | <code>            if (output) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 670 | <code>                insertions.push({ index, output });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 671 | <code>                outputIds.add(callId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 672 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 673 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 674 | <code>        for (const insertion of insertions.reverse()) {</code> | 声明局部标识符 `insertion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 675 | <code>            this.items.splice(insertion.index + 1, 0, insertion.output);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 676 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 677 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 678 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 679 | <code>    removeOrphanOutputs() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 680 | <code>        const functionCallIds = new Set(</code> | 声明局部标识符 `functionCallIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 681 | <code>            this.items</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 682 | <code>                .filter((item) =&gt; item?.type === 'function_call' &#124;&#124; item?.type === 'local_shell_call')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 683 | <code>                .map(callIdOf)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 684 | <code>                .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 685 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 686 | <code>        const customCallIds = new Set(</code> | 声明局部标识符 `customCallIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 687 | <code>            this.items</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 688 | <code>                .filter((item) =&gt; item?.type === 'custom_tool_call')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 689 | <code>                .map(callIdOf)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 690 | <code>                .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 691 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 692 | <code>        const toolSearchCallIds = new Set(</code> | 声明局部标识符 `toolSearchCallIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 693 | <code>            this.items</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 694 | <code>                .filter((item) =&gt; item?.type === 'tool_search_call')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 695 | <code>                .map(callIdOf)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 696 | <code>                .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 697 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 698 | <code>        this.items = this.items.filter((item) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 699 | <code>            if (!isOutputItem(item)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 700 | <code>                return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 701 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 702 | <code>            if (item.type === 'tool_search_output' &amp;&amp; (item.execution === 'server' &#124;&#124; !callIdOf(item))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 703 | <code>                return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 704 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 705 | <code>            const callId = callIdOf(item);</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 706 | <code>            if (item.type === 'function_call_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 707 | <code>                return Boolean(callId &amp;&amp; functionCallIds.has(callId));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 708 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 709 | <code>            if (item.type === 'custom_tool_call_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 710 | <code>                return Boolean(callId &amp;&amp; customCallIds.has(callId));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 711 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 712 | <code>            if (item.type === 'tool_search_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 713 | <code>                return Boolean(callId &amp;&amp; toolSearchCallIds.has(callId));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 714 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 715 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 716 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 717 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 718 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 719 | <code>    stripImagesWhenUnsupported() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 720 | <code>        this.items = this.items.map((item) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 721 | <code>            if (item?.type === 'message') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 722 | <code>                const content = (Array.isArray(item.content) ? item.content : [])</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 723 | <code>                    .map((part) =&gt; part?.type === 'input_image'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 724 | <code>                        ? ContentItem.inputText(IMAGE_CONTENT_OMITTED_PLACEHOLDER)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 725 | <code>                        : cloneJson(part))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 726 | <code>                    .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 727 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 728 | <code>                    ...cloneJson(item),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 729 | <code>                    content: content.length ? content : [ContentItem.inputText(IMAGE_CONTENT_OMITTED_PLACEHOLDER)].filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 730 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 731 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 732 | <code>            if (item?.type === 'function_call_output' &#124;&#124; item?.type === 'custom_tool_call_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 733 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 734 | <code>                    ...cloneJson(item),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 735 | <code>                    output: stripImagesFromFunctionOutput(item.output)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 736 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 737 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 738 | <code>            if (item?.type === 'image_generation_call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 739 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 740 | <code>                    ...cloneJson(item),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 741 | <code>                    result: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 742 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 743 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 744 | <code>            return cloneJson(item);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 745 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 746 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 747 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 748 | <code>    totalModelVisibleChars() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 749 | <code>        return this.items.reduce((sum, item) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 750 | <code>            if (item?.type === 'function_call_output' &#124;&#124; item?.type === 'custom_tool_call_output' &#124;&#124; item?.type === 'tool_search_output') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 751 | <code>                return sum + responseItemOutputToText(item).length;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 752 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 753 | <code>            return sum + JSON.stringify(item &#124;&#124; {}).length;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 754 | <code>        }, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 755 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 756 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 757 | <code>    toCheckpoint() {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 758 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 759 | <code>            history_version: this.history_version,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 760 | <code>            token_info: this.token_info ? cloneJson(this.token_info) : null,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 761 | <code>            reference_context_item: this.reference_context_item ? cloneJson(this.reference_context_item) : null,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 762 | <code>            items: this.rawItems()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 763 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 764 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 765 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 766 | <code>    static fromCheckpoint(checkpoint = null, options = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 767 | <code>        if (!checkpoint &#124;&#124; typeof checkpoint !== 'object' &#124;&#124; Array.isArray(checkpoint)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 768 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 769 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 770 | <code>        const items = Array.isArray(checkpoint.items) ? checkpoint.items : [];</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 771 | <code>        return new ContextManager({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 772 | <code>            items,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 773 | <code>            history_version: checkpoint.history_version,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 774 | <code>            token_info: checkpoint.token_info,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 775 | <code>            reference_context_item: checkpoint.reference_context_item,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 776 | <code>            toolOutputChars: options.toolOutputChars &#124;&#124; checkpoint.tool_output_chars &#124;&#124; checkpoint.toolOutputChars &#124;&#124; DEFAULT_TOOL_OUTPUT_CHARS</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 777 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 778 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 779 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 780 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 781 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 782 | <code>    ContextManager,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 783 | <code>    DEFAULT_TOOL_OUTPUT_CHARS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 784 | <code>    truncateFunctionOutputPayload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。”这一文件职责。 |
| 785 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
