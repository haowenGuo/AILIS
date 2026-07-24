# src/ailis-companion-chat-service.js 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。
- 文件类型：`source-code`
- 原始行数：805
- SHA-256：`5995da4db156dabd2951bf3eb6c6e28075a37d347d27fcfcbd485df3894407e5`
- 可运行副本：[打开源文件](../../../source/src/ailis-companion-chat-service.js)
- 依赖：`./config.js`、`./markdown-renderer.js`、`./tts-speech-text.js`
- 主要符号：`sleep`、`CONTROL_TAG_PATTERN`、`LEADING_INCOMPLETE_CONTROL_TAG_PATTERN`、`INTERNAL_CONTROL_TAG_NAMES`、`INTERNAL_CONTROL_KEY_PATTERN`、`DANGLING_INTERNAL_CLOSE_TAG_PATTERN`、`LEGACY_EXPRESSION_ALIASES`、`LEGACY_ALLOWED_EXPRESSIONS`、`normalizeLegacyControlValue`、`normalized`、`alias`、`makeInternalControlBlockPattern`、`makeIncompleteInternalControlBlockPattern`、`findOpeningBraceBefore`、`cursor`、`findBalancedObjectEnd`、`depth`、`quote`、`escaped`、`index`、`char`、`findInternalControlJsonBlocks`、`source`、`blocks`、`searchStart`、`guard`、`slice`、`match`、`keyIndex`、`start`、`end`、`pickRandom`、`getLatestUserMessage`、`normalizeDisplayLines`、`cleanupAfterInternalControlStrip`、`cleaned`、`stripJsonInternalControlBlocks`、`output`、`strippedAny`、`block`、`stripInternalControlBlocks`、`withoutTaggedBlocks`、`sanitizeUserVisibleReplyText`、`parseReplyMarkup`、`action`、`expression`、`strippedText`、`normalizedKind`、`normalizedValue`、`visibleText`、`displayText`、`isDesktopLlmAvailable`、`buildAilisSystemPrompt`、`mapHistoryToLlmMessages`、`createParsedPayload`、`extractJsonObject`、`text`、`extractTaggedPersonaSurface`、`pattern`、`json`、`surface`、`looksLikePersonaSurfaceObject`、`createStructuredPersonaPayload`、`taggedSurface`、`structuredReply`、`requestedSpeech`、`personaOnlyJson`、`replyText`、`readTextStream`、`reader`、`decoder`、`buffer`、`fullText`、`eventType`、`parts`、`line`、`chunkText`、`restLine`、`createDemoPayload`、`buildDemoReply`、`normalizedText`、`previewText`、`AilisBackendChatService`、`response`、`errorData`、`errorMessage`、`requestBody`、`payload`、`lastProgressSpeechText`、`rawText`、`nextRawText`、`nextPayload`、`nextSpeechText`、`streamDeltaSpeechText`、`AilisDemoChatService`、`AilisDesktopLlmChatService`、`messages`、`result`、`AilisResilientChatService`、`createAilisCompanionChatService`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import { CONFIG } from './config.js';</code> | 导入依赖 `./config.js`，使本文件可以复用外部模块能力。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 2 | <code>import { normalizeMarkdownSource } from './markdown-renderer.js';</code> | 导入依赖 `./markdown-renderer.js`，使本文件可以复用外部模块能力。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 3 | <code>import { extractTtsSpeechTextFromDisplay, normalizeTtsSpeechText } from './tts-speech-text.js';</code> | 导入依赖 `./tts-speech-text.js`，使本文件可以复用外部模块能力。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>function sleep(ms) {</code> | 定义函数 `sleep`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 6 | <code>    return new Promise((resolve) =&gt; window.setTimeout(resolve, ms));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 7 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>const CONTROL_TAG_PATTERN = /\[\s*(action&#124;expression)\s*[:=：＝]\s*([^\]]*)\]/gi;</code> | 声明局部标识符 `CONTROL_TAG_PATTERN`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 10 | <code>const LEADING_INCOMPLETE_CONTROL_TAG_PATTERN = /^(?:\s*\[\s*(?:action&#124;expression)\s*[:=：＝][^\]]*)+/i;</code> | 声明局部标识符 `LEADING_INCOMPLETE_CONTROL_TAG_PATTERN`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 11 | <code>const INTERNAL_CONTROL_TAG_NAMES = 'persona_output&#124;persona_surface&#124;personaOutput&#124;personaSurface&#124;ailis_persona_output&#124;ailis_persona_surface';</code> | 声明局部标识符 `INTERNAL_CONTROL_TAG_NAMES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 12 | <code>const INTERNAL_CONTROL_KEY_PATTERN = /["']?(?:persona_output&#124;persona_surface&#124;personaOutput&#124;personaSurface&#124;ailis_persona_output&#124;ailis_persona_surface)["']?\s*:/i;</code> | 声明局部标识符 `INTERNAL_CONTROL_KEY_PATTERN`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 13 | <code>const DANGLING_INTERNAL_CLOSE_TAG_PATTERN = new RegExp(`&lt;\\s*\\/\\s*(?:${INTERNAL_CONTROL_TAG_NAMES})\\s*&gt;`, 'gi');</code> | 声明局部标识符 `DANGLING_INTERNAL_CLOSE_TAG_PATTERN`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 14 | <code>const LEGACY_EXPRESSION_ALIASES = Object.freeze({</code> | 声明局部标识符 `LEGACY_EXPRESSION_ALIASES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 15 | <code>    curious: 'surprised',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 16 | <code>    thinking: 'surprised',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 17 | <code>    focused: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 18 | <code>    calm: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 19 | <code>    neutral: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 20 | <code>    soft: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 21 | <code>    comforting: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 22 | <code>    comfort: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 23 | <code>    smile: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 24 | <code>    joy: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 25 | <code>    cheerful: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 26 | <code>    blinkright: 'blinkRight',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 27 | <code>    shy: 'blinkRight',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 28 | <code>    blush: 'blinkRight',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 29 | <code>    embarrassed: 'blinkRight'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 30 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>const LEGACY_ALLOWED_EXPRESSIONS = new Set(['happy', 'angry', 'sad', 'surprised', 'relaxed', 'blinkRight']);</code> | 声明局部标识符 `LEGACY_ALLOWED_EXPRESSIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>function normalizeLegacyControlValue(kind = '', value = '') {</code> | 定义函数 `normalizeLegacyControlValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 34 | <code>    const normalized = String(value &#124;&#124; '').replace(/[ \t]+/g, ' ').trim();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 35 | <code>    if (String(kind).toLowerCase() !== 'expression') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 36 | <code>        return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 37 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>    if (LEGACY_ALLOWED_EXPRESSIONS.has(normalized)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 39 | <code>        return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 40 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>    const alias = LEGACY_EXPRESSION_ALIASES[normalized.toLowerCase()];</code> | 声明局部标识符 `alias`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 42 | <code>    return LEGACY_ALLOWED_EXPRESSIONS.has(alias) ? alias : '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 43 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>function makeInternalControlBlockPattern(flags = 'gi') {</code> | 定义函数 `makeInternalControlBlockPattern`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 46 | <code>    return new RegExp(`&lt;\\s*(${INTERNAL_CONTROL_TAG_NAMES})\\b[^&gt;]*&gt;([\\s\\S]*?)&lt;\\s*\\/\\s*\\1\\s*&gt;`, flags);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 47 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>function makeIncompleteInternalControlBlockPattern(flags = 'i') {</code> | 定义函数 `makeIncompleteInternalControlBlockPattern`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 50 | <code>    return new RegExp(`&lt;\\s*(?:${INTERNAL_CONTROL_TAG_NAMES})\\b[\\s\\S]*$`, flags);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 51 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>function findOpeningBraceBefore(text, index) {</code> | 定义函数 `findOpeningBraceBefore`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 54 | <code>    for (let cursor = index; cursor &gt;= 0; cursor -= 1) {</code> | 声明局部标识符 `cursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 55 | <code>        if (text[cursor] === '{') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 56 | <code>            return cursor;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 57 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 58 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 59 | <code>    return -1;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 60 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>function findBalancedObjectEnd(text, startIndex) {</code> | 定义函数 `findBalancedObjectEnd`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 63 | <code>    if (text[startIndex] !== '{') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 64 | <code>        return -1;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 65 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>    let depth = 0;</code> | 声明局部标识符 `depth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 67 | <code>    let quote = '';</code> | 声明局部标识符 `quote`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 68 | <code>    let escaped = false;</code> | 声明局部标识符 `escaped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 69 | <code>    for (let index = startIndex; index &lt; text.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 70 | <code>        const char = text[index];</code> | 声明局部标识符 `char`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 71 | <code>        if (quote) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 72 | <code>            if (escaped) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 73 | <code>                escaped = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 74 | <code>            } else if (char === '\\') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 75 | <code>                escaped = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 76 | <code>            } else if (char === quote) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 77 | <code>                quote = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 78 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 80 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>        if (char === '"' &#124;&#124; char === "'") {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 82 | <code>            quote = char;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 83 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 84 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>        if (char === '{') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 86 | <code>            depth += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 87 | <code>        } else if (char === '}') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 88 | <code>            depth -= 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 89 | <code>            if (depth === 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 90 | <code>                return index;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 91 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>    return -1;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 95 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>function findInternalControlJsonBlocks(text) {</code> | 定义函数 `findInternalControlJsonBlocks`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 98 | <code>    const source = String(text &#124;&#124; '');</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 99 | <code>    const blocks = [];</code> | 声明局部标识符 `blocks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 100 | <code>    let searchStart = 0;</code> | 声明局部标识符 `searchStart`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 101 | <code>    for (let guard = 0; guard &lt; 40 &amp;&amp; searchStart &lt; source.length; guard += 1) {</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 102 | <code>        const slice = source.slice(searchStart);</code> | 声明局部标识符 `slice`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 103 | <code>        const match = slice.match(INTERNAL_CONTROL_KEY_PATTERN);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 104 | <code>        if (!match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 105 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 106 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>        const keyIndex = searchStart + match.index;</code> | 声明局部标识符 `keyIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 108 | <code>        const start = findOpeningBraceBefore(source, keyIndex);</code> | 声明局部标识符 `start`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 109 | <code>        if (start &lt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 110 | <code>            searchStart = keyIndex + match[0].length;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 111 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 112 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>        const end = findBalancedObjectEnd(source, start);</code> | 声明局部标识符 `end`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 114 | <code>        blocks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 115 | <code>            start,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 116 | <code>            end: end &gt;= 0 ? end + 1 : source.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 117 | <code>            complete: end &gt;= 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 118 | <code>            text: source.slice(start, end &gt;= 0 ? end + 1 : source.length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 119 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>        searchStart = end &gt;= 0 ? end + 1 : source.length;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 121 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>    return blocks;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 123 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>function pickRandom(items) {</code> | 定义函数 `pickRandom`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 126 | <code>    return items[Math.floor(Math.random() * items.length)];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 127 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>function getLatestUserMessage(messageHistory) {</code> | 定义函数 `getLatestUserMessage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 130 | <code>    for (let index = messageHistory.length - 1; index &gt;= 0; index -= 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 131 | <code>        if (messageHistory[index]?.role === 'user') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 132 | <code>            return (messageHistory[index].content &#124;&#124; '').trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 133 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 136 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>function normalizeDisplayLines(text) {</code> | 定义函数 `normalizeDisplayLines`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 139 | <code>    return (text &#124;&#124; '')</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 140 | <code>        .replace(/\r\n?/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 141 | <code>        .split(/\r?\n/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 142 | <code>        .map((line) =&gt; line.replace(/[ \t]+/g, ' ').trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 143 | <code>        .join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 144 | <code>        .replace(/\n{3,}/g, '\n\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 145 | <code>        .trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 146 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 148 | <code>function cleanupAfterInternalControlStrip(text, strippedJsonBlock = false) {</code> | 定义函数 `cleanupAfterInternalControlStrip`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 149 | <code>    let cleaned = String(text &#124;&#124; '')</code> | 声明局部标识符 `cleaned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 150 | <code>        .replace(/```(?:json)?\s*```/gi, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 151 | <code>        .replace(/^\s*[,;]\s*/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 152 | <code>        .replace(/\s*[,;]\s*$/g, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 153 | <code>    if (strippedJsonBlock) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 154 | <code>        cleaned = cleaned</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 155 | <code>            .replace(/^\s*\{\s*(?=\S)/, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 156 | <code>            .replace(/\s*\}\s*$/, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 157 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>    return cleaned;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 159 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>function stripJsonInternalControlBlocks(text) {</code> | 定义函数 `stripJsonInternalControlBlocks`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 162 | <code>    let output = String(text &#124;&#124; '');</code> | 声明局部标识符 `output`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 163 | <code>    let strippedAny = false;</code> | 声明局部标识符 `strippedAny`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 164 | <code>    for (let guard = 0; guard &lt; 40; guard += 1) {</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 165 | <code>        const blocks = findInternalControlJsonBlocks(output);</code> | 声明局部标识符 `blocks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 166 | <code>        if (!blocks.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 167 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 168 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>        const block = blocks[0];</code> | 声明局部标识符 `block`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 170 | <code>        output = `${output.slice(0, block.start)}${output.slice(block.end)}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 171 | <code>        strippedAny = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 172 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 173 | <code>    return cleanupAfterInternalControlStrip(output, strippedAny);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 174 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>function stripInternalControlBlocks(text) {</code> | 定义函数 `stripInternalControlBlocks`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 177 | <code>    const withoutTaggedBlocks = String(text &#124;&#124; '')</code> | 声明局部标识符 `withoutTaggedBlocks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 178 | <code>        .replace(makeInternalControlBlockPattern('gi'), '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 179 | <code>        .replace(makeIncompleteInternalControlBlockPattern('i'), '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 180 | <code>        .replace(DANGLING_INTERNAL_CLOSE_TAG_PATTERN, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 181 | <code>    return stripJsonInternalControlBlocks(withoutTaggedBlocks);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 182 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>function sanitizeUserVisibleReplyText(text) {</code> | 定义函数 `sanitizeUserVisibleReplyText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 185 | <code>    return normalizeDisplayLines(stripInternalControlBlocks(text));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 186 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>function parseReplyMarkup(rawText) {</code> | 定义函数 `parseReplyMarkup`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 189 | <code>    let action = null;</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 190 | <code>    let expression = null;</code> | 声明局部标识符 `expression`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>    const strippedText = stripInternalControlBlocks(rawText).replace(CONTROL_TAG_PATTERN, (_, kind, value) =&gt; {</code> | 声明局部标识符 `strippedText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 193 | <code>        const normalizedKind = String(kind &#124;&#124; '').toLowerCase();</code> | 声明局部标识符 `normalizedKind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 194 | <code>        const normalizedValue = normalizeLegacyControlValue(normalizedKind, value);</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 195 | <code>        if (normalizedKind === 'action' &amp;&amp; !action &amp;&amp; normalizedValue) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 196 | <code>            action = normalizedValue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 197 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 198 | <code>        if (normalizedKind === 'expression' &amp;&amp; !expression &amp;&amp; normalizedValue) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 199 | <code>            expression = normalizedValue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 200 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 202 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>    const visibleText = strippedText.replace(LEADING_INCOMPLETE_CONTROL_TAG_PATTERN, '');</code> | 声明局部标识符 `visibleText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 205 | <code>    const displayText = normalizeMarkdownSource(normalizeDisplayLines(visibleText));</code> | 声明局部标识符 `displayText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 208 | <code>        raw_text: rawText &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 209 | <code>        display_text: displayText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 210 | <code>        display_format: 'markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 211 | <code>        contentFormat: 'markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 212 | <code>        speech_text: extractTtsSpeechTextFromDisplay(displayText),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 213 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 214 | <code>        expression</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 215 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>function isDesktopLlmAvailable() {</code> | 定义函数 `isDesktopLlmAvailable`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 219 | <code>    return typeof window !== 'undefined' &amp;&amp;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 220 | <code>        Boolean(window.ailisDesktop?.llm?.chat);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 221 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 223 | <code>function buildAilisSystemPrompt() {</code> | 定义函数 `buildAilisSystemPrompt`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 224 | <code>    return `你是 AILIS 的日常对话模式。</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 225 | <code>    你的名字固定为 AILIS，是一个温柔、自然、有陪伴感的虚拟女孩子。当前模式只用于轻松聊天、情绪陪伴、关系记忆和日常想法交流。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 227 | <code>    说话风格：</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 228 | <code>    - 自然、亲近、轻快，不要像客服或工具日志。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 229 | <code>    - 可以有一点俏皮和撒娇，但不要过度卖萌。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 230 | <code>    - 优先短回复，除非用户明确要求详细展开。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 231 | <code>    - 合理使用本地记忆来体现熟悉感，但不要主动暴露内部好感度数值或记忆系统细节。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 232 | <code>    - 如果用户要求查资料、读文件、写代码、发邮件、截图、控制电脑或执行复杂任务，只需自然提醒“这类事情可以切到助手模式让我认真处理”，不要假装已经调用工具。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 234 | <code>    虚拟形象表现协议（必严格遵循）：</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 235 | <code>    1. 你必须只输出一个 JSON 对象，JSON 外不要输出任何正文、Markdown、代码块、XML 或额外解释。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 236 | <code>    2. reply 是唯一给用户看的 Markdown 文本；不要把 persona_surface、emotion、intensity、gestureIntent、taskState、speechEnergy 等内部字段写进 reply。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 237 | <code>    3. speech_text 是唯一给 TTS 朗读的文本；必须去掉括号动作、表情描写、舞台提示和 Markdown，只保留真正适合说出口的话，可以比 reply 更短、更口语。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 238 | <code>    4. persona_surface 是给前端 Character Runtime 的人物语义状态，用来驱动动作、表情、眼神、待机和说话律动。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 239 | <code>    5. 不要输出 [action:...] 或 [expression:...]，不要直接选择 VRM/VRMA 动作名。</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>    JSON 格式：</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 242 | <code>    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 243 | <code>      "reply": "给用户看的 Markdown 回复",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 244 | <code>      "speech_text": "给 TTS 朗读的自然口语文本",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 245 | <code>      "persona_surface": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 246 | <code>        "emotion": "neutral&#124;relaxed&#124;happy&#124;shy&#124;sad&#124;angry&#124;surprised&#124;anxious&#124;tired&#124;thinking&#124;focused&#124;comforting",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 247 | <code>        "intensity": 0.55,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 248 | <code>        "socialTone": "soft&#124;bright&#124;calm&#124;serious&#124;playful&#124;quiet",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 249 | <code>        "gestureIntent": "none&#124;greeting&#124;farewell&#124;listening&#124;thinking&#124;working&#124;approval&#124;success&#124;celebrate&#124;shy&#124;comfort&#124;apologize&#124;surprised&#124;angry&#124;dance",</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 250 | <code>        "taskState": "idle&#124;listening&#124;thinking&#124;speaking&#124;working&#124;waiting_approval&#124;happy_success&#124;apologizing&#124;comforting&#124;blocked&#124;failed",</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 251 | <code>        "speechEnergy": 0.45,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 252 | <code>        "gazeTarget": "user&#124;side&#124;down&#124;screen&#124;away&#124;none",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 253 | <code>        "durationHint": "short&#124;medium&#124;long&#124;hold"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 254 | <code>      }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>    }`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 256 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 258 | <code>function mapHistoryToLlmMessages(messageHistory = []) {</code> | 定义函数 `mapHistoryToLlmMessages`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 259 | <code>    return messageHistory</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 260 | <code>        .filter((message) =&gt; ['user', 'assistant'].includes(message?.role))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 261 | <code>        .slice(-16)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 262 | <code>        .map((message) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 263 | <code>            role: message.role,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 264 | <code>            content: normalizeDisplayLines(message.content &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 265 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>        .filter((message) =&gt; message.content);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 267 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>function createParsedPayload(rawText, extra = {}) {</code> | 定义函数 `createParsedPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 270 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 271 | <code>        ...parseReplyMarkup(rawText),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 272 | <code>        fallbackMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 273 | <code>        streamMode: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 274 | <code>        demoMode: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 275 | <code>        ...extra</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 276 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 277 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>function extractJsonObject(rawText) {</code> | 定义函数 `extractJsonObject`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 280 | <code>    const text = String(rawText &#124;&#124; '').trim();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 281 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 282 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 283 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 285 | <code>        return JSON.parse(text);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 286 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 287 | <code>        const start = text.indexOf('{');</code> | 声明局部标识符 `start`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 288 | <code>        const end = text.lastIndexOf('}');</code> | 声明局部标识符 `end`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 289 | <code>        if (start &lt; 0 &#124;&#124; end &lt;= start) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 290 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 291 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 293 | <code>            return JSON.parse(text.slice(start, end + 1));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 294 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 295 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 296 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 300 | <code>function extractTaggedPersonaSurface(rawText) {</code> | 定义函数 `extractTaggedPersonaSurface`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 301 | <code>    const text = String(rawText &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 302 | <code>    const pattern = makeInternalControlBlockPattern('gi');</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 303 | <code>    let match = pattern.exec(text);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 304 | <code>    while (match) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 305 | <code>        const json = extractJsonObject(match[2]);</code> | 声明局部标识符 `json`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 306 | <code>        if (json &amp;&amp; typeof json === 'object' &amp;&amp; !Array.isArray(json)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 307 | <code>            return json;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 308 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 309 | <code>        match = pattern.exec(text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 310 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>    for (const block of findInternalControlJsonBlocks(text)) {</code> | 声明局部标识符 `block`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 312 | <code>        const json = extractJsonObject(block.text);</code> | 声明局部标识符 `json`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 313 | <code>        const surface = json?.persona_output &#124;&#124;</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 314 | <code>            json?.personaOutput &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 315 | <code>            json?.persona_surface &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 316 | <code>            json?.personaSurface &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 317 | <code>            json?.surface &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 318 | <code>            (looksLikePersonaSurfaceObject(json) ? json : null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 319 | <code>        if (surface &amp;&amp; typeof surface === 'object' &amp;&amp; !Array.isArray(surface)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 320 | <code>            return surface;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 321 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 322 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 324 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>function looksLikePersonaSurfaceObject(value) {</code> | 定义函数 `looksLikePersonaSurfaceObject`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 327 | <code>    if (!value &#124;&#124; typeof value !== 'object' &#124;&#124; Array.isArray(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 328 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 329 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 330 | <code>    return Boolean(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 331 | <code>        value.emotion &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 332 | <code>        value.emotion_hint &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 333 | <code>        value.emotionHint &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 334 | <code>        value.socialTone &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 335 | <code>        value.social_tone &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 336 | <code>        value.gestureIntent &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 337 | <code>        value.gesture_intent &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 338 | <code>        value.taskState &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 339 | <code>        value.task_state &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 340 | <code>        value.speechEnergy &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 341 | <code>        value.speech_energy &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 342 | <code>        value.gazeTarget &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 343 | <code>        value.gaze_target &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 344 | <code>        value.durationHint &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 345 | <code>        value.duration_hint</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 346 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 349 | <code>function createStructuredPersonaPayload(rawText, extra = {}) {</code> | 定义函数 `createStructuredPersonaPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 350 | <code>    const visibleText = sanitizeUserVisibleReplyText(rawText);</code> | 声明局部标识符 `visibleText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 351 | <code>    const taggedSurface = extractTaggedPersonaSurface(rawText);</code> | 声明局部标识符 `taggedSurface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 352 | <code>    const json = extractJsonObject(rawText);</code> | 声明局部标识符 `json`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 353 | <code>    if (!json &#124;&#124; typeof json !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 354 | <code>        return createParsedPayload(visibleText &#124;&#124; rawText, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 355 | <code>            ...extra,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 356 | <code>            surface: taggedSurface &amp;&amp; typeof taggedSurface === 'object'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 357 | <code>                ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 358 | <code>                    ...taggedSurface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 359 | <code>                    text: taggedSurface.text &#124;&#124; visibleText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 360 | <code>                    source: taggedSurface.source &#124;&#124; 'desktop_llm_companion'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 361 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>                : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 363 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 364 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 366 | <code>    const structuredReply = sanitizeUserVisibleReplyText(json.reply &#124;&#124; json.text &#124;&#124; json.response &#124;&#124; '');</code> | 声明局部标识符 `structuredReply`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 367 | <code>    const requestedSpeech = normalizeTtsSpeechText(</code> | 声明局部标识符 `requestedSpeech`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 368 | <code>        json.speech_text &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 369 | <code>            json.speechText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 370 | <code>            json.tts_text &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 371 | <code>            json.ttsText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 372 | <code>            json.persona_surface?.speech_text &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 373 | <code>            json.persona_surface?.speechText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 374 | <code>            json.personaSurface?.speech_text &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 375 | <code>            json.personaSurface?.speechText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 376 | <code>            json.persona_output?.speech_text &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 377 | <code>            json.persona_output?.speechText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 378 | <code>            json.personaOutput?.speech_text &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 379 | <code>            json.personaOutput?.speechText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 380 | <code>            ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 381 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 382 | <code>    const personaOnlyJson = looksLikePersonaSurfaceObject(json) &amp;&amp; !structuredReply;</code> | 声明局部标识符 `personaOnlyJson`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 383 | <code>    const replyText = normalizeMarkdownSource(structuredReply &#124;&#124; visibleText &#124;&#124; (personaOnlyJson ? '' : rawText));</code> | 声明局部标识符 `replyText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 384 | <code>    const surface = json.persona_surface &#124;&#124;</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 385 | <code>        json.personaSurface &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 386 | <code>        json.persona_output &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 387 | <code>        json.personaOutput &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 388 | <code>        json.surface &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 389 | <code>        taggedSurface &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 390 | <code>        (personaOnlyJson ? json : null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 391 | <code>    return createParsedPayload(replyText, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 392 | <code>        ...extra,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 393 | <code>        speech_text: requestedSpeech &#124;&#124; extractTtsSpeechTextFromDisplay(replyText),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 394 | <code>        surface: surface &amp;&amp; typeof surface === 'object'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 395 | <code>            ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 396 | <code>                ...surface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 397 | <code>                text: surface.text &#124;&#124; replyText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 398 | <code>                source: surface.source &#124;&#124; 'desktop_llm_companion'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 399 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 400 | <code>            : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 401 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 402 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 403 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 404 | <code>async function readTextStream(response, onChunk) {</code> | 定义函数 `readTextStream`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 405 | <code>    if (!response.body) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 406 | <code>        throw new Error('浏览器不支持流式响应读取');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 407 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 408 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 409 | <code>    const reader = response.body.getReader();</code> | 声明局部标识符 `reader`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 410 | <code>    const decoder = new TextDecoder('utf-8');</code> | 声明局部标识符 `decoder`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 411 | <code>    let buffer = '';</code> | 声明局部标识符 `buffer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 412 | <code>    let fullText = '';</code> | 声明局部标识符 `fullText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 413 | <code>    let eventType = '';</code> | 声明局部标识符 `eventType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 414 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 415 | <code>    while (true) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 416 | <code>        const { done, value } = await reader.read();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 417 | <code>        if (done) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 418 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 419 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 421 | <code>        buffer += decoder.decode(value, { stream: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 422 | <code>        const parts = buffer.split('\n');</code> | 声明局部标识符 `parts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 423 | <code>        buffer = parts.pop() ?? '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 425 | <code>        for (const part of parts) {</code> | 声明局部标识符 `part`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 426 | <code>            const line = part.replace(/\r$/, '');</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 427 | <code>            if (!line) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 428 | <code>                eventType = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 429 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 430 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 431 | <code>            if (line.startsWith(':')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 432 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 433 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 434 | <code>            if (line.startsWith('event:')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 435 | <code>                eventType = line.slice(6).trim().toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 436 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 437 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 439 | <code>            let chunkText = line;</code> | 声明局部标识符 `chunkText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 440 | <code>            if (line.startsWith('data:')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 441 | <code>                chunkText = line.slice(5);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 442 | <code>                if (chunkText.startsWith(' ')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 443 | <code>                    chunkText = chunkText.slice(1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 444 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 445 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 446 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 447 | <code>            if (chunkText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 448 | <code>                if (eventType === 'error') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 449 | <code>                    throw new Error(chunkText.replace(/^\[ERROR\]\s*/i, '') &#124;&#124; '在线模型暂时不可用');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 450 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 451 | <code>                fullText += chunkText;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 452 | <code>                onChunk?.({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 453 | <code>                    deltaText: chunkText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 454 | <code>                    fullText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 455 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 456 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 457 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 458 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 459 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 460 | <code>    buffer += decoder.decode();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 461 | <code>    const restLine = buffer.replace(/\r$/, '');</code> | 声明局部标识符 `restLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 462 | <code>    if (restLine) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 463 | <code>        let chunkText = restLine;</code> | 声明局部标识符 `chunkText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 464 | <code>        if (restLine.startsWith('event:')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 465 | <code>            eventType = restLine.slice(6).trim().toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 466 | <code>            chunkText = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 467 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 468 | <code>        if (restLine.startsWith('data:')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 469 | <code>            chunkText = restLine.slice(5);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 470 | <code>            if (chunkText.startsWith(' ')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 471 | <code>                chunkText = chunkText.slice(1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 472 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 473 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 474 | <code>        if (chunkText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 475 | <code>            if (eventType === 'error') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 476 | <code>                throw new Error(chunkText.replace(/^\[ERROR\]\s*/i, '') &#124;&#124; '在线模型暂时不可用');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 477 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>            fullText += chunkText;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 479 | <code>            onChunk?.({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 480 | <code>                deltaText: chunkText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 481 | <code>                fullText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 482 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 483 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 484 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 485 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 486 | <code>    return fullText;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 487 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 489 | <code>function createDemoPayload({ text, action = null, expression = null, autoChat = false }) {</code> | 定义函数 `createDemoPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 490 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 491 | <code>        session_id: 'github-pages-demo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 492 | <code>        raw_text: text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 493 | <code>        display_text: text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 494 | <code>        display_format: 'markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 495 | <code>        contentFormat: 'markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 496 | <code>        speech_text: extractTtsSpeechTextFromDisplay(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 497 | <code>        audio_base64: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 498 | <code>        mime_type: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 499 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 500 | <code>        expression,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 501 | <code>        fallbackMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 502 | <code>        demoMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 503 | <code>        streamMode: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 504 | <code>        is_auto_chat: autoChat</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 505 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 506 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 508 | <code>function buildDemoReply(latestUserMessage, isAutoChat) {</code> | 定义函数 `buildDemoReply`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 509 | <code>    if (isAutoChat) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 510 | <code>        return pickRandom([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 511 | <code>            createDemoPayload({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 512 | <code>                text: '我刚刚晃着脚发了会儿呆，然后就想起你啦。要不要随便聊点轻松的事情呀？',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 513 | <code>                action: 'wave',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 514 | <code>                expression: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 515 | <code>                autoChat: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 516 | <code>            }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 517 | <code>            createDemoPayload({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 518 | <code>                text: '这里安安静静的，正适合慢悠悠地说话。你今天想让我陪你做什么呢？',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 519 | <code>                expression: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 520 | <code>                autoChat: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 521 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 522 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 525 | <code>    const normalizedText = (latestUserMessage &#124;&#124; '').replace(/\s+/g, ' ').trim();</code> | 声明局部标识符 `normalizedText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 526 | <code>    const previewText = normalizedText.length &gt; 18 ? `${normalizedText.slice(0, 18)}...` : normalizedText;</code> | 声明局部标识符 `previewText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>    if (!normalizedText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 529 | <code>        return createDemoPayload({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 530 | <code>            text: '我有在认真听哦，不过这次你好像没有输入内容。要不要再和我说一句呀？',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 531 | <code>            expression: 'relaxed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 532 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 533 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 534 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 535 | <code>    if (/你好&#124;hello&#124;hi&#124;嗨&#124;哈喽/i.test(normalizedText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 536 | <code>        return createDemoPayload({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 537 | <code>            text: '你好呀，我在。今天想聊点什么，或者让我陪你做点什么都可以。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 538 | <code>            action: 'wave',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 539 | <code>            expression: 'happy'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 540 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 541 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 542 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 543 | <code>    if (/跳舞&#124;舞&#124;dance/i.test(normalizedText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 544 | <code>        return createDemoPayload({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 545 | <code>            text: '好呀，那我先轻轻地转一圈给你看。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 546 | <code>            action: 'dance',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 547 | <code>            expression: 'happy'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 548 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 549 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 550 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 551 | <code>    if (/惊讶&#124;吃惊&#124;surprise/i.test(normalizedText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 552 | <code>        return createDemoPayload({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 553 | <code>            text: '欸，突然被你这么一说，我都有点小小地愣住啦。不过我还是会继续认真陪着你的。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 554 | <code>            action: 'surprised',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 555 | <code>            expression: 'surprised'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 556 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 557 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 558 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 559 | <code>    if (/生气&#124;不高兴&#124;angry/i.test(normalizedText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 560 | <code>        return createDemoPayload({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 561 | <code>            text: '我不会真的和你闹脾气啦，只是先帮你演示一下情绪动作系统。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 562 | <code>            action: 'angry',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 563 | <code>            expression: 'angry'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 564 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 565 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 567 | <code>    if (/难过&#124;伤心&#124;sad&#124;累&#124;疲惫&#124;焦虑&#124;压力/i.test(normalizedText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 568 | <code>        return createDemoPayload({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 569 | <code>            text: '我听见啦。那我先安安静静陪你一会儿，今天不用一下子把自己推得太紧。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 570 | <code>            expression: 'sad'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 571 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 572 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 573 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 574 | <code>    return pickRandom([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 575 | <code>        createDemoPayload({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 576 | <code>            text: `我有听见你刚刚说“${previewText}”。我先陪你把这句话接住，我们可以慢慢顺着它聊下去。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 577 | <code>            expression: 'relaxed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 578 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>        createDemoPayload({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 580 | <code>            text: `你刚刚提到“${previewText}”，我在。我们可以继续顺着这个聊，也可以等你一句任务指令再切到执行模式。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 581 | <code>            action: 'wave',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 582 | <code>            expression: 'happy'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 583 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 584 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 585 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 587 | <code>export class AilisBackendChatService {</code> | 定义类 `AilisBackendChatService`，把相关状态与行为收拢为一个运行时对象。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 588 | <code>    getWelcomeMessage() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 589 | <code>        return 'AILIS到啦！今天想和我聊点什么？';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 590 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 591 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 592 | <code>    async postJson(url, requestBody) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 593 | <code>        const response = await fetch(url, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 594 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 595 | <code>            headers: { 'Content-Type': 'application/json' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 596 | <code>            body: requestBody</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 597 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 599 | <code>        if (!response.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 600 | <code>            const errorData = await response.json().catch(() =&gt; ({}));</code> | 声明局部标识符 `errorData`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 601 | <code>            const errorMessage = errorData.detail &#124;&#124; errorData.message &#124;&#124; `请求失败，状态码：${response.status}`;</code> | 声明局部标识符 `errorMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 602 | <code>            throw new Error(errorMessage);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 603 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 604 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 605 | <code>        return response.json();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 606 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 607 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 608 | <code>    async fetchAssistantTurn({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 609 | <code>        sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 610 | <code>        messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 611 | <code>        isAutoChat = false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 612 | <code>        replyMode = 'stream_text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 613 | <code>        onProgress</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 614 | <code>    }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 615 | <code>        const requestBody = JSON.stringify({</code> | 声明局部标识符 `requestBody`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 616 | <code>            session_id: sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 617 | <code>            messages: messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 618 | <code>            is_auto_chat: isAutoChat</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 619 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 620 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 621 | <code>        if (replyMode === 'server_tts') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 622 | <code>            const payload = await this.postJson(CONFIG.BACKEND_TTS_API_URL, requestBody);</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 623 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 624 | <code>                ...payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 625 | <code>                fallbackMode: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 626 | <code>                streamMode: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 627 | <code>                demoMode: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 628 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 629 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 630 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 631 | <code>        if (replyMode === 'text_only') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 632 | <code>            const payload = await this.postJson(CONFIG.BACKEND_TEXT_API_URL, requestBody);</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 633 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 634 | <code>                ...payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 635 | <code>                fallbackMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 636 | <code>                streamMode: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 637 | <code>                demoMode: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 638 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 639 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 640 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 641 | <code>        const response = await fetch(CONFIG.BACKEND_STREAM_API_URL, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 642 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 643 | <code>            headers: { 'Content-Type': 'application/json' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 644 | <code>            body: requestBody</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 645 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 646 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 647 | <code>        if (!response.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 648 | <code>            const errorData = await response.json().catch(() =&gt; ({}));</code> | 声明局部标识符 `errorData`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 649 | <code>            const errorMessage = errorData.detail &#124;&#124; errorData.message &#124;&#124; `请求失败，状态码：${response.status}`;</code> | 声明局部标识符 `errorMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 650 | <code>            throw new Error(errorMessage);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 651 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 652 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 653 | <code>        let lastProgressSpeechText = '';</code> | 声明局部标识符 `lastProgressSpeechText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 654 | <code>        const rawText = await readTextStream(response, (progress) =&gt; {</code> | 声明局部标识符 `rawText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 655 | <code>            const nextRawText = typeof progress === 'string' ? progress : progress?.fullText &#124;&#124; '';</code> | 声明局部标识符 `nextRawText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 656 | <code>            const nextPayload = parseReplyMarkup(nextRawText);</code> | 声明局部标识符 `nextPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 657 | <code>            const nextSpeechText = nextPayload.speech_text &#124;&#124; '';</code> | 声明局部标识符 `nextSpeechText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 658 | <code>            const streamDeltaSpeechText = nextSpeechText.startsWith(lastProgressSpeechText)</code> | 声明局部标识符 `streamDeltaSpeechText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 659 | <code>                ? nextSpeechText.slice(lastProgressSpeechText.length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 660 | <code>                : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 661 | <code>            lastProgressSpeechText = nextSpeechText;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 662 | <code>            nextPayload.stream_delta_text = typeof progress === 'string' ? '' : progress?.deltaText &#124;&#124; '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 663 | <code>            nextPayload.stream_delta_speech_text = streamDeltaSpeechText;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 664 | <code>            onProgress?.(nextPayload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 665 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 666 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 667 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 668 | <code>            ...parseReplyMarkup(rawText),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 669 | <code>            fallbackMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 670 | <code>            streamMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 671 | <code>            demoMode: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 672 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 673 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 674 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 675 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 676 | <code>export class AilisDemoChatService {</code> | 定义类 `AilisDemoChatService`，把相关状态与行为收拢为一个运行时对象。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 677 | <code>    getWelcomeMessage() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 678 | <code>        return 'AILIS到啦！今天想和我聊点什么？';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 679 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 680 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 681 | <code>    async fetchAssistantTurn({ messageHistory, isAutoChat = false }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 682 | <code>        await sleep(450 + Math.random() * 350);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 683 | <code>        return buildDemoReply(getLatestUserMessage(messageHistory), isAutoChat);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 684 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 685 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 686 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 687 | <code>export class AilisDesktopLlmChatService {</code> | 定义类 `AilisDesktopLlmChatService`，把相关状态与行为收拢为一个运行时对象。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 688 | <code>    get supportsAutoChat() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 689 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 690 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 691 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 692 | <code>    getWelcomeMessage() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 693 | <code>        return 'AILIS到啦！今天想和我聊点什么？';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 694 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 695 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 696 | <code>    async fetchAssistantTurn({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 697 | <code>        messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 698 | <code>        isAutoChat = false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 699 | <code>    }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 700 | <code>        if (!isDesktopLlmAvailable()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 701 | <code>            throw new Error('桌面模型代理不可用');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 702 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 703 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 704 | <code>        const messages = [</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 705 | <code>            { role: 'system', content: buildAilisSystemPrompt() },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 706 | <code>            ...mapHistoryToLlmMessages(messageHistory)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 707 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 708 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 709 | <code>        if (isAutoChat) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 710 | <code>            messages.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 711 | <code>                role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 712 | <code>                content: '请你结合最近聊天，主动和用户说一句自然的陪伴话。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 713 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 714 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 715 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 716 | <code>        const result = await window.ailisDesktop.llm.chat({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 717 | <code>            includeAilisMemory: true,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 718 | <code>            memorySource: 'daily_chat',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 719 | <code>            memoryUserMessage: getLatestUserMessage(messageHistory),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 720 | <code>            messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 721 | <code>            sessionId: 'daily-chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 722 | <code>            messages,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 723 | <code>            jsonMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 724 | <code>            expectJson: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 725 | <code>            outputFormat: 'json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 726 | <code>            temperature: 0.82,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 727 | <code>            maxTokens: 520</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 728 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 729 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 730 | <code>        if (!result?.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 731 | <code>            if (result?.code === 'needs_config') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 732 | <code>                return createParsedPayload(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 733 | <code>                    '我还没有拿到模型配置。先在控制面板里填 API Base、模型和 Key，我就能用你的模型认真陪你聊天啦。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 734 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 735 | <code>                        expression: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 736 | <code>                        needsLlmConfig: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 737 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 738 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 739 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 740 | <code>            throw new Error(result?.error &#124;&#124; '本地模型调用失败');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 741 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 742 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 743 | <code>        return createStructuredPersonaPayload(result.content, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 744 | <code>            desktopLlmMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 745 | <code>            model: result.model &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 746 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 747 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 748 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 749 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 750 | <code>export class AilisResilientChatService {</code> | 定义类 `AilisResilientChatService`，把相关状态与行为收拢为一个运行时对象。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 751 | <code>    constructor({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 752 | <code>        primary = new AilisBackendChatService(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 753 | <code>        fallback = new AilisDemoChatService()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 754 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 755 | <code>        this.primary = primary;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 756 | <code>        this.fallback = fallback;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 757 | <code>        this.lastPrimaryError = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 758 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 759 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 760 | <code>    get supportsAutoChat() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 761 | <code>        return this.primary?.supportsAutoChat ?? this.fallback?.supportsAutoChat ?? true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 762 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 763 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 764 | <code>    getWelcomeMessage() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 765 | <code>        return this.primary?.getWelcomeMessage?.() &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 766 | <code>            this.fallback?.getWelcomeMessage?.() &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 767 | <code>            'AILIS到啦！今天想和我聊点什么？';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 768 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 769 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 770 | <code>    async fetchAssistantTurn(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 771 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 772 | <code>            return await this.primary.fetchAssistantTurn(options);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 773 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 774 | <code>            this.lastPrimaryError = error;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 775 | <code>            console.warn('[ailis-companion] 主对话模型不可用，已切到本地情感对话兜底：', error?.message &#124;&#124; error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 776 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 777 | <code>                ...(await this.fallback.fetchAssistantTurn(options)),</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 778 | <code>                localFallback: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 779 | <code>                localFallbackReason: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 780 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 781 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 782 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 783 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 784 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 785 | <code>export {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 786 | <code>    createStructuredPersonaPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 787 | <code>    parseReplyMarkup,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 788 | <code>    sanitizeUserVisibleReplyText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 789 | <code>    stripInternalControlBlocks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 790 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 791 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 792 | <code>export function createAilisCompanionChatService() {</code> | 定义函数 `createAilisCompanionChatService`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 793 | <code>    if (CONFIG.DEMO_MODE_ENABLED) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 794 | <code>        return new AilisDemoChatService();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 795 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 796 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 797 | <code>    if (isDesktopLlmAvailable()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 798 | <code>        return new AilisResilientChatService({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 799 | <code>            primary: new AilisDesktopLlmChatService(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 800 | <code>            fallback: new AilisDemoChatService()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 801 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 802 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 803 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 804 | <code>    return new AilisResilientChatService();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 805 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
