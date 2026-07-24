# src/ailis-chat-service.js 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。
- 文件类型：`source-code`
- 原始行数：1163
- SHA-256：`50d4cf4123367f43c628982dcc3c98d66aacdce771f451444c6496b5ca2f3415`
- 可运行副本：[打开源文件](../../../source/src/ailis-chat-service.js)
- 依赖：`./markdown-renderer.js`、`./chat-attachments.js`、`./ailis-progress-surface.js`、`./tts-speech-text.js`
- 主要符号：`CONTROL_TAG_PATTERN`、`LEADING_INCOMPLETE_CONTROL_TAG_PATTERN`、`LEGACY_EXPRESSION_ALIASES`、`LEGACY_ALLOWED_EXPRESSIONS`、`VISION_LLM_TIMEOUT_MS`、`PROACTIVE_LLM_TIMEOUT_MS`、`PROGRESS_MIN_INTERVAL_MS`、`EMBODIED_COMMAND_TASK_WORD_PATTERN`、`normalizeText`、`normalizeLegacyControlValue`、`normalized`、`alias`、`eventBelongsToRun`、`activeRunId`、`eventRunId`、`parentRunId`、`getLatestUserEntry`、`index`、`compactConversationTurns`、`turns`、`selected`、`anchors`、`anchorSet`、`earliestReplaceable`、`extractJsonObjectFromText`、`text`、`candidates`、`start`、`end`、`parsed`、`buildProactiveOpportunitySystemPrompt`、`buildProactiveCompanionHeartbeatDeveloperMessage`、`latestUserIndex`、`latestAssistantIndex`、`assistantTurnsSinceUser`、`userSpokeAfterAssistant`、`buildProactiveWorkReplySystemPrompt`、`normalizeProactiveDecision`、`shouldSpeak`、`intent`、`emotion`、`cooldownSec`、`proactiveEmotionToSurface`、`expression`、`taskState`、`createProgressPayload`、`surface`、`createGatewayProgressBridge`、`state`、`pushFrame`、`nextText`、`now`、`unsubscribe`、`type`、`payload`、`payloadRunId`、`isFinalForActiveRunWithoutRunId`、`finalText`、`frame`、`normalizeVisionAttachments`、`mimeType`、`sanitizeMessageHistoryForGateway`、`buildVisionSystemPrompt`、`buildVisionUserContent`、`labels`、`summarizeVisionAttachments`、`getVisionErrorText`、`getVisionCue`、`normalizeEmbodiedCommandText`、`isLikelyStandaloneEmbodiedCommand`、`createEmbodiedCommandPayload`、`fetchVisionAssistantTurn`、`message`、`attachments`、`result`、`cue`、`replyText`、`attachServerTtsIfRequested`、`ttsPayload`、`toAILISPayload`、`surfaceText`、`fallbackText`、`parseAssistantReply`、`action`、`raw`、`stripped`、`normalizedKind`、`normalizedValue`、`visibleText`、`displayText`、`toAssistantPayload`、`synthesizeElevenLabsSpeech`、`cleanText`、`getAvatarCue`、`AILISDesktopChatService`、`status`、`proactiveMode`、`opportunity`、`latestUserEntry`、`embodiedPayload`、`splitAttachments`、`visionAttachments`、`streamedAnswerText`、`activeAnswerStreamId`、`answerStreamVisible`、`answerStreamCommitted`、`bridgedRunId`、`bridgedSessionId`、`unsubscribeProgress`、`streamId`、`hadVisibleText`、`turn`、`reply`、`recentTurns`、`latestUser`、`decisionContext`、`decision`、`isWorkMode`、`latestUserText`、`conversationMessages`、`targetSessionId`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import { normalizeMarkdownSource } from './markdown-renderer.js';</code> | 导入依赖 `./markdown-renderer.js`，使本文件可以复用外部模块能力。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 2 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 3 | <code>    splitChatAttachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 4 | <code>    summarizeChatAttachmentsForGateway</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 5 | <code>} from './chat-attachments.js';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 6 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 7 | <code>    PROGRESS_MAX_FRAMES,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 8 | <code>    createPersonaProgressFrame,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 9 | <code>    renderPersonaProgressSurface</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 10 | <code>} from './ailis-progress-surface.js';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 11 | <code>import { extractTtsSpeechTextFromDisplay, normalizeTtsSpeechText } from './tts-speech-text.js';</code> | 导入依赖 `./tts-speech-text.js`，使本文件可以复用外部模块能力。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>const CONTROL_TAG_PATTERN = /\[\s*(action&#124;expression)\s*[:=：＝]\s*([^\]]*)\]/gi;</code> | 声明局部标识符 `CONTROL_TAG_PATTERN`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 14 | <code>const LEADING_INCOMPLETE_CONTROL_TAG_PATTERN = /^(?:\s*\[\s*(?:action&#124;expression)\s*[:=：＝][^\]]*)+/i;</code> | 声明局部标识符 `LEADING_INCOMPLETE_CONTROL_TAG_PATTERN`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 15 | <code>const LEGACY_EXPRESSION_ALIASES = Object.freeze({</code> | 声明局部标识符 `LEGACY_EXPRESSION_ALIASES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 16 | <code>    curious: 'surprised',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 17 | <code>    thinking: 'surprised',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 18 | <code>    focused: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 19 | <code>    calm: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 20 | <code>    neutral: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 21 | <code>    soft: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 22 | <code>    comforting: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 23 | <code>    comfort: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 24 | <code>    smile: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 25 | <code>    joy: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 26 | <code>    cheerful: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 27 | <code>    blinkright: 'blinkRight',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 28 | <code>    shy: 'blinkRight',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 29 | <code>    blush: 'blinkRight',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 30 | <code>    embarrassed: 'blinkRight'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 31 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 32 | <code>const LEGACY_ALLOWED_EXPRESSIONS = new Set(['happy', 'angry', 'sad', 'surprised', 'relaxed', 'blinkRight']);</code> | 声明局部标识符 `LEGACY_ALLOWED_EXPRESSIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 33 | <code>const VISION_LLM_TIMEOUT_MS = 90000;</code> | 声明局部标识符 `VISION_LLM_TIMEOUT_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 34 | <code>const PROACTIVE_LLM_TIMEOUT_MS = 30000;</code> | 声明局部标识符 `PROACTIVE_LLM_TIMEOUT_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 35 | <code>const PROGRESS_MIN_INTERVAL_MS = 1200;</code> | 声明局部标识符 `PROGRESS_MIN_INTERVAL_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 36 | <code>const EMBODIED_COMMAND_TASK_WORD_PATTERN = /写&#124;代码&#124;脚本&#124;文件&#124;邮件&#124;查&#124;搜索&#124;整理&#124;生成&#124;测试&#124;运行&#124;打开&#124;读取&#124;分析&#124;修复&#124;优化&#124;提交&#124;commit&#124;debug&#124;report&#124;文档/i;</code> | 声明局部标识符 `EMBODIED_COMMAND_TASK_WORD_PATTERN`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>function normalizeText(value) {</code> | 定义函数 `normalizeText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 39 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 40 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 41 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>    return value.replace(/[ \t]+/g, ' ').trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 43 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>function normalizeLegacyControlValue(kind = '', value = '') {</code> | 定义函数 `normalizeLegacyControlValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 46 | <code>    const normalized = normalizeText(value);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 47 | <code>    if (String(kind).toLowerCase() !== 'expression') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 48 | <code>        return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 49 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>    if (LEGACY_ALLOWED_EXPRESSIONS.has(normalized)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 51 | <code>        return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 52 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>    const alias = LEGACY_EXPRESSION_ALIASES[normalized.toLowerCase()];</code> | 声明局部标识符 `alias`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 54 | <code>    return LEGACY_ALLOWED_EXPRESSIONS.has(alias) ? alias : '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 55 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>function eventBelongsToRun(payload = {}, runId = '') {</code> | 定义函数 `eventBelongsToRun`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 58 | <code>    const activeRunId = normalizeText(runId);</code> | 声明局部标识符 `activeRunId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 59 | <code>    if (!activeRunId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 60 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 61 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>    const eventRunId = normalizeText(payload.runId);</code> | 声明局部标识符 `eventRunId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 63 | <code>    const parentRunId = normalizeText(payload.parentRunId &#124;&#124; payload.parent_run_id);</code> | 声明局部标识符 `parentRunId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 64 | <code>    return eventRunId === activeRunId &#124;&#124; parentRunId === activeRunId;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 65 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>function getLatestUserEntry(messageHistory = []) {</code> | 定义函数 `getLatestUserEntry`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 68 | <code>    for (let index = messageHistory.length - 1; index &gt;= 0; index -= 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 69 | <code>        if (messageHistory[index]?.role === 'user') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 70 | <code>            return messageHistory[index];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 71 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 72 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 73 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 74 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>function compactConversationTurns(messageHistory = [], limit = 10) {</code> | 定义函数 `compactConversationTurns`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 77 | <code>    const turns = messageHistory</code> | 声明局部标识符 `turns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 78 | <code>        .filter((message) =&gt; ['user', 'assistant'].includes(message?.role))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 79 | <code>        .map((message) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 80 | <code>            role: normalizeText(message.role),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 81 | <code>            text: normalizeText(message.content &#124;&#124; message.text).slice(0, 900),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 82 | <code>            source: normalizeText(message.source),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 83 | <code>            createdAt: normalizeText(message.createdAt)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 84 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>        .filter((message) =&gt; message.text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 86 | <code>    if (turns.length &lt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 87 | <code>        return turns;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 88 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>    const selected = new Set();</code> | 声明局部标识符 `selected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 91 | <code>    for (let index = turns.length - 1; index &gt;= 0 &amp;&amp; selected.size &lt; limit; index -= 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 92 | <code>        selected.add(index);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 93 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>    const anchors = [</code> | 声明局部标识符 `anchors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 95 | <code>        turns.findLastIndex((message) =&gt; message.role === 'user'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 96 | <code>        turns.findLastIndex((message) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 97 | <code>            message.role === 'assistant' &amp;&amp; message.source !== 'proactive_companion'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 98 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>    const anchorSet = new Set(anchors.filter((index) =&gt; index &gt;= 0));</code> | 声明局部标识符 `anchorSet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 101 | <code>    for (const anchorIndex of anchors) {</code> | 声明局部标识符 `anchorIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 102 | <code>        if (anchorIndex &lt; 0 &#124;&#124; selected.has(anchorIndex)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 103 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 104 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>        const earliestReplaceable = [...selected]</code> | 声明局部标识符 `earliestReplaceable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 106 | <code>            .sort((left, right) =&gt; left - right)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 107 | <code>            .find((index) =&gt; !anchorSet.has(index));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 108 | <code>        if (earliestReplaceable !== undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 109 | <code>            selected.delete(earliestReplaceable);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 110 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>        selected.add(anchorIndex);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 112 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>    return [...selected]</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 114 | <code>        .sort((left, right) =&gt; left - right)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 115 | <code>        .map((index) =&gt; turns[index]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 116 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>function extractJsonObjectFromText(value) {</code> | 定义函数 `extractJsonObjectFromText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 119 | <code>    if (!value &#124;&#124; typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 120 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 121 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>    const text = value.trim();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 123 | <code>    const candidates = [text];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 124 | <code>    const start = text.indexOf('{');</code> | 声明局部标识符 `start`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 125 | <code>    const end = text.lastIndexOf('}');</code> | 声明局部标识符 `end`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 126 | <code>    if (start &gt;= 0 &amp;&amp; end &gt; start) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 127 | <code>        candidates.push(text.slice(start, end + 1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 128 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>    for (const candidate of candidates) {</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 130 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 131 | <code>            const parsed = JSON.parse(candidate);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 132 | <code>            if (parsed &amp;&amp; typeof parsed === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 133 | <code>                return parsed;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 134 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>        } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 136 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 138 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>export function buildProactiveOpportunitySystemPrompt() {</code> | 定义函数 `buildProactiveOpportunitySystemPrompt`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 141 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 142 | <code>        '你是 AILIS 工作模式的反馈机会判断器，不是任务执行 Agent。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 143 | <code>        '你只判断此刻是否值得让 AILIS 主动汇报、提醒或恢复共同任务；不要撰写最终用户可见回复，回复会由独立的 AILIS Persona 生成。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 144 | <code>        '工作模式按较长周期检查，优先关注刚完成、暂停、遇到阻塞或值得恢复的共同任务；普通闲聊场景保持克制。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 145 | <code>        '优先根据 recentContext 判断：刚刚聊了什么、是否有自然延续、是否有未完成情绪或问题、任务是否刚结束。',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 146 | <code>        'recentContext 中 source=proactive_companion 的内容是 AILIS 之前的主动消息。若用户没有回应，不要仅因时间经过而重复同类搭话。',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 147 | <code>        'interactionState.appVisible 只是当前界面可见性信息，不是必须沉默的规则。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 148 | <code>        '长期记忆和用户画像只用于语气、分寸和称呼，不用于凭空开启新话题。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 149 | <code>        '不要调用工具，不要联网，不要读文件，不要执行任务；如果需要行动，只能温柔询问用户是否要继续。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 150 | <code>        '不要暴露内部记忆、好感度数值、系统状态、JSON、token、runId、工具名或隐藏推理。',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 151 | <code>        '如果没有明确价值，shouldSpeak 必须为 false。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 152 | <code>        '只返回 JSON：{"shouldSpeak":boolean,"intent":"soft_checkin&#124;topic_followup&#124;task_resume_offer&#124;celebrate&#124;comfort&#124;quiet_presence","emotion":"relaxed&#124;happy&#124;soft&#124;comforting&#124;curious","cooldownSec":number,"reasonType":"recent_context_followup&#124;task_state&#124;not_enough_reason&#124;cooldown"}'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 153 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 154 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 156 | <code>export function buildProactiveCompanionHeartbeatDeveloperMessage(messageHistory = []) {</code> | 定义函数 `buildProactiveCompanionHeartbeatDeveloperMessage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 157 | <code>    const turns = messageHistory.filter((message) =&gt; ['user', 'assistant'].includes(message?.role));</code> | 声明局部标识符 `turns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 158 | <code>    const latestUserIndex = turns.findLastIndex((message) =&gt; message.role === 'user');</code> | 声明局部标识符 `latestUserIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 159 | <code>    const latestAssistantIndex = turns.findLastIndex((message) =&gt; message.role === 'assistant');</code> | 声明局部标识符 `latestAssistantIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 160 | <code>    const assistantTurnsSinceUser = latestUserIndex &lt; 0</code> | 声明局部标识符 `assistantTurnsSinceUser`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 161 | <code>        ? turns.filter((message) =&gt; message.role === 'assistant').length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 162 | <code>        : turns.slice(latestUserIndex + 1).filter((message) =&gt; message.role === 'assistant').length;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 163 | <code>    const userSpokeAfterAssistant = latestUserIndex &gt; latestAssistantIndex;</code> | 声明局部标识符 `userSpokeAfterAssistant`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 164 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 165 | <code>        'Companion mode heartbeat. This is a runtime event, not a user message.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 166 | <code>        'Use the same AILIS persona, memory, and conversation context as an ordinary chat turn.',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 167 | <code>        userSpokeAfterAssistant</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 168 | <code>            ? 'The latest visible turn is a real user message.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 169 | <code>            : `The user has not sent a new message since the latest assistant response. There are ${assistantTurnsSinceUser} assistant response(s) since the latest real user message.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 170 | <code>        'Take the initiative and continue the conversation naturally.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 171 | <code>        'Do not pretend the user replied, restart the old request, or merely rephrase the latest assistant response.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 172 | <code>        'Return only the natural user-visible reply.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 173 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 174 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>function buildProactiveWorkReplySystemPrompt(decision = {}) {</code> | 定义函数 `buildProactiveWorkReplySystemPrompt`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 177 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 178 | <code>        '你是 AILIS，正在对共同工作的进展进行一次主动反馈。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 179 | <code>        '最近的 user/assistant 消息是真实对话历史；保持其中已经形成的人格、称呼、语气和关系分寸。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 180 | <code>        '这是工作模式机会判断器批准的反馈，不是用户刚刚发送了新消息。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 181 | <code>        `本次反馈意图：${normalizeText(decision.intent &#124;&#124; 'task_resume_offer')}；触发原因：${normalizeText(decision.reasonType &#124;&#124; 'task_state')}。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 182 | <code>        '围绕当前任务状态、进展、阻塞或下一步自然表达，不要虚构没有发生的工作。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 183 | <code>        '不要提到机会判断器、工作模式、JSON、记忆注入或任何内部机制。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 184 | <code>        '只输出要展示给用户的自然回复，不要输出 JSON、标签、解释或候选答案。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 185 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 186 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>function normalizeProactiveDecision(rawDecision = {}) {</code> | 定义函数 `normalizeProactiveDecision`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 189 | <code>    const shouldSpeak = rawDecision.shouldSpeak === true;</code> | 声明局部标识符 `shouldSpeak`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 190 | <code>    const intent = normalizeText(rawDecision.intent &#124;&#124; 'quiet_presence') &#124;&#124; 'quiet_presence';</code> | 声明局部标识符 `intent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 191 | <code>    const emotion = normalizeText(rawDecision.emotion &#124;&#124; 'relaxed') &#124;&#124; 'relaxed';</code> | 声明局部标识符 `emotion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 192 | <code>    const cooldownSec = Math.round(Math.min(Math.max(Number(rawDecision.cooldownSec) &#124;&#124; 900, 180), 24 * 60 * 60));</code> | 声明局部标识符 `cooldownSec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 193 | <code>    if (!shouldSpeak) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 194 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 195 | <code>            shouldSpeak: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 196 | <code>            intent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 197 | <code>            emotion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 198 | <code>            cooldownSec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 199 | <code>            reasonType: normalizeText(rawDecision.reasonType &#124;&#124; rawDecision.reason &#124;&#124; 'not_enough_reason')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 200 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 203 | <code>        shouldSpeak: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 204 | <code>        intent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 205 | <code>        emotion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 206 | <code>        cooldownSec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 207 | <code>        reasonType: normalizeText(rawDecision.reasonType &#124;&#124; 'recent_context_followup')</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 208 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 211 | <code>function proactiveEmotionToSurface(decision = {}, text = '') {</code> | 定义函数 `proactiveEmotionToSurface`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 212 | <code>    const emotion = normalizeText(decision.emotion &#124;&#124; 'relaxed');</code> | 声明局部标识符 `emotion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 213 | <code>    const expression = /happy&#124;celebrate/.test(emotion) ? 'happy' :</code> | 声明局部标识符 `expression`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 214 | <code>        /comfort&#124;soft/.test(emotion) ? 'relaxed' : 'relaxed';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 215 | <code>    const taskState = /comfort/.test(emotion) ? 'comforting' : 'idle';</code> | 声明局部标识符 `taskState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 216 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 217 | <code>        text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 218 | <code>        speechText: text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 219 | <code>        bubbleText: text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 220 | <code>        action: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 221 | <code>        expression,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 222 | <code>        emotion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 223 | <code>        intensity: 0.34,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 224 | <code>        socialTone: 'soft',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 225 | <code>        gestureIntent: /curious/.test(emotion) ? 'thinking' : 'comfort',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 226 | <code>        taskState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 227 | <code>        speechEnergy: 0.24,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 228 | <code>        gazeTarget: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 229 | <code>        durationHint: 'short',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 230 | <code>        source: 'proactive_companion'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 231 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 234 | <code>function createProgressPayload(frames = []) {</code> | 定义函数 `createProgressPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 235 | <code>    const surface = renderPersonaProgressSurface(frames);</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 236 | <code>    return toAssistantPayload(surface.text, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 237 | <code>        speechText: surface.speechText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 238 | <code>        bubbleText: surface.bubbleText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 239 | <code>        surface</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 240 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 241 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>export function createGatewayProgressBridge({ gateway, sessionId, onProgress, onRunStarted, onRunFinished }) {</code> | 定义函数 `createGatewayProgressBridge`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 244 | <code>    if (typeof onProgress !== 'function' &#124;&#124; typeof gateway?.onEvent !== 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 245 | <code>        return () =&gt; {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 246 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 247 | <code>    const state = {</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 248 | <code>        runId: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 249 | <code>        frames: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 250 | <code>        visibleStepCount: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 251 | <code>        totalSteps: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 252 | <code>        lastText: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 253 | <code>        lastEmitAt: 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 254 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>    const pushFrame = (frame, { force = false } = {}) =&gt; {</code> | 声明局部标识符 `pushFrame`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 256 | <code>        if (!frame?.text &#124;&#124; state.frames.at(-1)?.text === frame.text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 257 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 258 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>        state.frames.push(frame);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 260 | <code>        state.frames = state.frames.slice(-PROGRESS_MAX_FRAMES);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 261 | <code>        const nextText = renderPersonaProgressSurface(state.frames).text;</code> | 声明局部标识符 `nextText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 262 | <code>        const now = Date.now();</code> | 声明局部标识符 `now`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 263 | <code>        if (!force &amp;&amp; nextText === state.lastText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 264 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 265 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>        if (!force &amp;&amp; now - state.lastEmitAt &lt; PROGRESS_MIN_INTERVAL_MS) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 267 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 268 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>        state.lastText = nextText;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 270 | <code>        state.lastEmitAt = now;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 271 | <code>        onProgress(createProgressPayload(state.frames));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 272 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>    const unsubscribe = gateway.onEvent((event = {}) =&gt; {</code> | 声明局部标识符 `unsubscribe`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 275 | <code>        const type = normalizeText(event.type);</code> | 声明局部标识符 `type`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 276 | <code>        const payload = event.payload &amp;&amp; typeof event.payload === 'object' ? event.payload : {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 277 | <code>        if (type === 'agent.run.started') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 278 | <code>            if (normalizeText(payload.sessionId) !== normalizeText(sessionId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 279 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 280 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>            state.runId = normalizeText(payload.runId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 282 | <code>            onRunStarted?.({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 283 | <code>                runId: state.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 284 | <code>                sessionId: normalizeText(payload.sessionId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 285 | <code>                payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 286 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 287 | <code>            state.totalSteps = Number(payload.stepCount &#124;&#124; 0) &#124;&#124; 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 288 | <code>            pushFrame(createPersonaProgressFrame(event), { force: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 289 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 290 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 291 | <code>        const payloadRunId = normalizeText(payload.runId &#124;&#124; payload.parentRunId &#124;&#124; payload.parent_run_id);</code> | 声明局部标识符 `payloadRunId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 292 | <code>        const isFinalForActiveRunWithoutRunId = type === 'agent.final' &amp;&amp; state.runId &amp;&amp; !payloadRunId;</code> | 声明局部标识符 `isFinalForActiveRunWithoutRunId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 293 | <code>        if (!state.runId &#124;&#124; (!eventBelongsToRun(payload, state.runId) &amp;&amp; !isFinalForActiveRunWithoutRunId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 294 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 295 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 296 | <code>        if (type === 'agent.run.finished' &#124;&#124; type === 'agent.run.interrupted' &#124;&#124; type === 'agent.final') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 297 | <code>            const finalText = normalizeMarkdownSource(payload.displayText &#124;&#124; payload.text &#124;&#124; payload.summary &#124;&#124; payload.error &#124;&#124; '');</code> | 声明局部标识符 `finalText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 298 | <code>            if (finalText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 299 | <code>                onProgress(toAssistantPayload(finalText, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 300 | <code>                    speechText: payload.speechText &#124;&#124; payload.speech_text &#124;&#124; finalText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 301 | <code>                    bubbleText: payload.bubbleText &#124;&#124; payload.bubble_text &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 302 | <code>                    surface: payload.surface &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 303 | <code>                    agentProgressFinal: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 304 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 305 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>            onRunFinished?.({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 307 | <code>                runId: state.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 308 | <code>                sessionId: normalizeText(payload.sessionId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 309 | <code>                payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 310 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 312 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>        if (type === 'agent.message.completed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 314 | <code>            const finalText = normalizeMarkdownSource(payload.text &#124;&#124; payload.displayText &#124;&#124; payload.summary &#124;&#124; '');</code> | 声明局部标识符 `finalText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 315 | <code>            if (finalText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 316 | <code>                onProgress(toAssistantPayload(finalText, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 317 | <code>                    speechText: payload.speechText &#124;&#124; payload.speech_text &#124;&#124; finalText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 318 | <code>                    bubbleText: payload.bubbleText &#124;&#124; payload.bubble_text &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 319 | <code>                    surface: payload.surface &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 320 | <code>                    agentProgressFinal: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 321 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 322 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 324 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>        if (type === 'agent.step.started') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 326 | <code>            const frame = createPersonaProgressFrame(event, {</code> | 声明局部标识符 `frame`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 327 | <code>                index: state.visibleStepCount + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 328 | <code>                total: state.totalSteps</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 329 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 330 | <code>            if (frame) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 331 | <code>                state.visibleStepCount += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 332 | <code>                pushFrame(frame);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 333 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 335 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 336 | <code>        if (type === 'agent.reasoning.delta' &#124;&#124; type === 'agent.progress.note' &#124;&#124; type === 'agent.message.delta' &#124;&#124; type === 'subagent.event') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 337 | <code>            pushFrame(createPersonaProgressFrame(event), { force: type === 'agent.reasoning.delta' &#124;&#124; type === 'agent.progress.note' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 338 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 339 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>        if (type === 'agent.step.finished') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 341 | <code>            pushFrame(createPersonaProgressFrame(event));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 342 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 343 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 345 | <code>    return typeof unsubscribe === 'function' ? unsubscribe : () =&gt; {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 346 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 348 | <code>function normalizeVisionAttachments(attachments = []) {</code> | 定义函数 `normalizeVisionAttachments`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 349 | <code>    if (!Array.isArray(attachments)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 350 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 351 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>    return attachments</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 354 | <code>        .filter((attachment) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 355 | <code>            if (!attachment?.dataUrl) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 356 | <code>                return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 357 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 358 | <code>            const mimeType = String(attachment.mimeType &#124;&#124; 'image/png');</code> | 声明局部标识符 `mimeType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 359 | <code>            return mimeType.startsWith('image/');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 360 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 361 | <code>        .map((attachment) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 362 | <code>            type: 'vision',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 363 | <code>            id: String(attachment.id &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 364 | <code>            source: String(attachment.source &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 365 | <code>            label: String(attachment.label &#124;&#124; '截图'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 366 | <code>            dataUrl: String(attachment.dataUrl &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 367 | <code>            thumbnailDataUrl: String(attachment.thumbnailDataUrl &#124;&#124; attachment.dataUrl &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 368 | <code>            mimeType: String(attachment.mimeType &#124;&#124; 'image/png'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 369 | <code>            width: Number(attachment.width) &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 370 | <code>            height: Number(attachment.height) &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 371 | <code>            createdAt: String(attachment.createdAt &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 372 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 373 | <code>        .slice(0, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 374 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>function sanitizeMessageHistoryForGateway(messageHistory = []) {</code> | 定义函数 `sanitizeMessageHistoryForGateway`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 377 | <code>    return messageHistory.map((message) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 378 | <code>        if (!Array.isArray(message?.attachments) &#124;&#124; !message.attachments.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 379 | <code>            return message;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 380 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 381 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 382 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 383 | <code>            ...message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 384 | <code>            attachments: summarizeChatAttachmentsForGateway(message.attachments)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 385 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 387 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>function buildVisionSystemPrompt() {</code> | 定义函数 `buildVisionSystemPrompt`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 390 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 391 | <code>        '你是 AILIS 的视觉理解能力，负责看用户给出的屏幕或窗口截图。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 392 | <code>        '你只能基于截图和用户文字做理解、解释、归纳和建议，不要声称自己已经点击、输入、拖动或操作了屏幕。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 393 | <code>        '回答要像正在陪用户一起看屏幕的角色，语气自然温和，不要写成工具报告。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 394 | <code>        '优先说明你看到了什么、用户可能想解决什么、下一步可以怎么做；看不清或不确定时直接说明。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 395 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 396 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 398 | <code>function buildVisionUserContent(message, attachments) {</code> | 定义函数 `buildVisionUserContent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 399 | <code>    const labels = attachments.map((attachment) =&gt; attachment.label &#124;&#124; '截图').join('、');</code> | 声明局部标识符 `labels`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 400 | <code>    const text = [</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 401 | <code>        `用户的话：${message &#124;&#124; '请你看一下这张截图。'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 402 | <code>        labels ? `截图来源：${labels}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 403 | <code>        '请结合截图回答用户，不要编造截图里没有的信息。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 404 | <code>    ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 406 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 407 | <code>        { type: 'text', text },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 408 | <code>        ...attachments.map((attachment) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 409 | <code>            type: 'image_url',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 410 | <code>            image_url: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 411 | <code>                url: attachment.dataUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 412 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 413 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 414 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 417 | <code>function summarizeVisionAttachments(attachments) {</code> | 定义函数 `summarizeVisionAttachments`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 418 | <code>    return attachments.map((attachment) =&gt; ({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 419 | <code>        type: attachment.type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 420 | <code>        id: attachment.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 421 | <code>        source: attachment.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 422 | <code>        label: attachment.label,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 423 | <code>        mimeType: attachment.mimeType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 424 | <code>        width: attachment.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 425 | <code>        height: attachment.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 426 | <code>        createdAt: attachment.createdAt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 427 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 428 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 430 | <code>function getVisionErrorText(result) {</code> | 定义函数 `getVisionErrorText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 431 | <code>    if (result?.code === 'needs_config') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 432 | <code>        return '我已经拿到截图了，不过还需要先在控制面板配置支持视觉输入的大模型 API，之后我就能直接看图回答。';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 433 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 434 | <code>    if (result?.code === 'timeout') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 435 | <code>        return '我已经拿到截图了，但视觉模型这次看图超时了。可以先用矩形截图框小一点的区域，或者在控制面板把大模型超时时间调高后再试。';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 436 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 437 | <code>    if (result?.code === 'provider_error') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 438 | <code>        return `截图已经准备好了，但当前模型接口没有成功理解这张图：${result.error &#124;&#124; '接口返回错误'}。可以换成支持视觉的模型再试。`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 439 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 440 | <code>    return `截图已经准备好了，但视觉理解暂时失败：${result?.error &#124;&#124; '模型没有返回内容'}。`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 441 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 442 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 443 | <code>function getVisionCue(message) {</code> | 定义函数 `getVisionCue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 444 | <code>    if (/报错&#124;错误&#124;异常&#124;卡住&#124;不对&#124;问题/.test(message)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 445 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 446 | <code>            action: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 447 | <code>            expression: 'surprised'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 448 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 451 | <code>        action: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 452 | <code>        expression: 'relaxed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 453 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 454 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 455 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 456 | <code>function normalizeEmbodiedCommandText(value) {</code> | 定义函数 `normalizeEmbodiedCommandText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 457 | <code>    return normalizeText(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 458 | <code>        .replace(/[，。！？!?,.;；：:\s~～…]+/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 459 | <code>        .toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 460 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 461 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 462 | <code>function isLikelyStandaloneEmbodiedCommand(message) {</code> | 定义函数 `isLikelyStandaloneEmbodiedCommand`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 463 | <code>    const normalized = normalizeEmbodiedCommandText(message);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 464 | <code>    return normalized.length &gt; 0 &amp;&amp;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 465 | <code>        normalized.length &lt;= 28 &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 466 | <code>        !EMBODIED_COMMAND_TASK_WORD_PATTERN.test(message);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 467 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 469 | <code>export function createEmbodiedCommandPayload(message = '') {</code> | 定义函数 `createEmbodiedCommandPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 470 | <code>    if (!isLikelyStandaloneEmbodiedCommand(message)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 471 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 472 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 474 | <code>    const normalized = normalizeEmbodiedCommandText(message);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 475 | <code>    if (!/(跳舞&#124;跳个舞&#124;跳一段&#124;舞蹈&#124;dance&#124;dancing)/i.test(normalized)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 476 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 477 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 479 | <code>    const text = '好呀，我给你跳一段。';</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 480 | <code>    return toAssistantPayload(text, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 481 | <code>        action: 'dance',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 482 | <code>        expression: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 483 | <code>        speechText: text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 484 | <code>        bubbleText: '跳舞模式，启动。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 485 | <code>        surface: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 486 | <code>            text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 487 | <code>            speechText: text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 488 | <code>            bubbleText: '跳舞模式，启动。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 489 | <code>            action: 'dance',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 490 | <code>            expression: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 491 | <code>            emotion: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 492 | <code>            intensity: 0.78,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 493 | <code>            socialTone: 'playful',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 494 | <code>            gestureIntent: 'dance',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 495 | <code>            taskState: 'happy_success',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 496 | <code>            speechEnergy: 0.72,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 497 | <code>            gazeTarget: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 498 | <code>            durationHint: 'long',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 499 | <code>            source: 'assistant_embodied_command'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 500 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 501 | <code>        embodiedCommand: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 502 | <code>            type: 'dance',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 503 | <code>            source: 'assistant_mode_short_command'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 504 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 505 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 506 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 508 | <code>async function fetchVisionAssistantTurn(messageEntry, { sessionId = 'main', messageHistory = [] } = {}) {</code> | 定义函数 `fetchVisionAssistantTurn`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 509 | <code>    if (typeof window.ailisDesktop?.llm?.chat !== 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 510 | <code>        throw new Error('当前桌面宿主不支持视觉大模型调用');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 511 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 512 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 513 | <code>    const message = normalizeText(messageEntry?.content);</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 514 | <code>    const attachments = normalizeVisionAttachments(messageEntry?.attachments);</code> | 声明局部标识符 `attachments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 515 | <code>    const result = await window.ailisDesktop.llm.chat({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 516 | <code>        includeAilisMemory: true,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 517 | <code>        memorySource: 'vision_direct_llm',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 518 | <code>        memoryUserMessage: message,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 519 | <code>        memoryAttachments: summarizeVisionAttachments(attachments),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 520 | <code>        sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 521 | <code>        messageHistory: sanitizeMessageHistoryForGateway(messageHistory),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 522 | <code>        messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 523 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 524 | <code>                role: 'system',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 525 | <code>                content: buildVisionSystemPrompt()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 526 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 527 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 528 | <code>                role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 529 | <code>                content: buildVisionUserContent(message, attachments)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 530 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 531 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 532 | <code>        temperature: 0.45,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 533 | <code>        timeoutMs: VISION_LLM_TIMEOUT_MS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 534 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 535 | <code>    const cue = getVisionCue(message);</code> | 声明局部标识符 `cue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 536 | <code>    const replyText = result?.ok</code> | 声明局部标识符 `replyText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 537 | <code>        ? (result.content &#124;&#124; '我看到了截图，但模型没有给出更多内容。')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 538 | <code>        : getVisionErrorText(result);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 539 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 540 | <code>    return toAssistantPayload(replyText, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 541 | <code>        ...cue,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 542 | <code>        desktopVision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 543 | <code>            ok: Boolean(result?.ok),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 544 | <code>            provider: result?.provider &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 545 | <code>            model: result?.model &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 546 | <code>            code: result?.code &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 547 | <code>            attachments: summarizeVisionAttachments(attachments)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 548 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 549 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 550 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 551 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 552 | <code>async function attachServerTtsIfRequested(payload, replyMode) {</code> | 定义函数 `attachServerTtsIfRequested`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 553 | <code>    if (replyMode !== 'server_tts') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 554 | <code>        return payload;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 555 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 556 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 557 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 558 | <code>        const ttsPayload = await synthesizeElevenLabsSpeech(payload.speech_text);</code> | 声明局部标识符 `ttsPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 559 | <code>        if (!ttsPayload?.audio_base64) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 560 | <code>            return payload;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 561 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 562 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 563 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 564 | <code>            ...payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 565 | <code>            ...ttsPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 566 | <code>            fallbackMode: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 567 | <code>            streamMode: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 568 | <code>            demoMode: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 569 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 570 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 571 | <code>        console.warn('ElevenLabs 桌面语音合成失败，保留 Agent 文本结果：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 572 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 573 | <code>            ...payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 574 | <code>            ttsError: error?.message &#124;&#124; String(error),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 575 | <code>            fallbackMode: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 576 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 577 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 578 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 580 | <code>function toAILISPayload(result) {</code> | 定义函数 `toAILISPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 581 | <code>    const cue = getAvatarCue(result);</code> | 声明局部标识符 `cue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 582 | <code>    const surface = result?.surface &amp;&amp; typeof result.surface === 'object' ? result.surface : null;</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 583 | <code>    const surfaceText = normalizeMarkdownSource(surface?.text &#124;&#124; '');</code> | 声明局部标识符 `surfaceText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 584 | <code>    const fallbackText = normalizeMarkdownSource(result?.displayText &#124;&#124; result?.finalAnswer &#124;&#124; result?.error &#124;&#124; 'AILIS 没有返回可显示内容。');</code> | 声明局部标识符 `fallbackText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 585 | <code>    return toAssistantPayload(surfaceText &#124;&#124; fallbackText, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 586 | <code>        ...cue,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 587 | <code>        action: surface ? surface.action : cue.action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 588 | <code>        expression: surface ? surface.expression : cue.expression,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 589 | <code>        speechText: surface?.speechText &#124;&#124; result?.speechText &#124;&#124; surfaceText &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 590 | <code>        bubbleText: surface?.bubbleText &#124;&#124; result?.bubbleText &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 591 | <code>        surface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 592 | <code>        ailis: result</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 593 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 596 | <code>function parseAssistantReply(rawText) {</code> | 定义函数 `parseAssistantReply`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 597 | <code>    let action = null;</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 598 | <code>    let expression = null;</code> | 声明局部标识符 `expression`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 599 | <code>    const raw = typeof rawText === 'string' ? rawText : '';</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 600 | <code>    const stripped = raw.replace(CONTROL_TAG_PATTERN, (_, kind, value) =&gt; {</code> | 声明局部标识符 `stripped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 601 | <code>        const normalizedKind = String(kind &#124;&#124; '').toLowerCase();</code> | 声明局部标识符 `normalizedKind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 602 | <code>        const normalizedValue = normalizeLegacyControlValue(normalizedKind, value);</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 603 | <code>        if (normalizedKind === 'action' &amp;&amp; !action &amp;&amp; normalizedValue) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 604 | <code>            action = normalizedValue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 605 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 606 | <code>        if (normalizedKind === 'expression' &amp;&amp; !expression &amp;&amp; normalizedValue) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 607 | <code>            expression = normalizedValue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 608 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 609 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 610 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 611 | <code>    const visibleText = stripped.replace(LEADING_INCOMPLETE_CONTROL_TAG_PATTERN, '');</code> | 声明局部标识符 `visibleText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 612 | <code>    const displayText = normalizeMarkdownSource(visibleText, '任务执行完成。');</code> | 声明局部标识符 `displayText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 613 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 614 | <code>        rawText: raw,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 615 | <code>        displayText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 616 | <code>        speechText: extractTtsSpeechTextFromDisplay(displayText),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 617 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 618 | <code>        expression</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 619 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 620 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 621 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 622 | <code>function toAssistantPayload(text, extra = {}) {</code> | 定义函数 `toAssistantPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 623 | <code>    const parsed = parseAssistantReply(normalizeMarkdownSource(text, '任务执行完成。'));</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 624 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 625 | <code>        ...extra,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 626 | <code>        raw_text: parsed.rawText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 627 | <code>        display_text: parsed.displayText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 628 | <code>        display_format: 'markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 629 | <code>        contentFormat: 'markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 630 | <code>        speech_text: normalizeTtsSpeechText(extra.speechText &#124;&#124; extra.speech_text) &#124;&#124; parsed.speechText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 631 | <code>        bubble_text: normalizeText(extra.bubbleText &#124;&#124; extra.bubble_text) &#124;&#124; parsed.displayText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 632 | <code>        action: parsed.action &#124;&#124; extra.action &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 633 | <code>        expression: parsed.expression &#124;&#124; extra.expression &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 634 | <code>        surface: extra.surface &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 635 | <code>        fallbackMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 636 | <code>        streamMode: extra.streamMode === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 637 | <code>        demoMode: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 638 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 639 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 640 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 641 | <code>async function synthesizeElevenLabsSpeech(speechText) {</code> | 定义函数 `synthesizeElevenLabsSpeech`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 642 | <code>    const cleanText = normalizeTtsSpeechText(speechText);</code> | 声明局部标识符 `cleanText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 643 | <code>    if (!cleanText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 644 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 645 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 646 | <code>    if (!window.ailisDesktop?.tts?.synthesize) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 647 | <code>        throw new Error('当前桌面宿主不支持 ElevenLabs 本地语音合成');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 648 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 649 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 650 | <code>    const payload = await window.ailisDesktop.tts.synthesize({</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 651 | <code>        text: cleanText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 652 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 653 | <code>    if (!payload?.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 654 | <code>        throw new Error(payload?.error &#124;&#124; 'ElevenLabs 本地语音合成失败');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 655 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 656 | <code>    return payload;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 657 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 658 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 659 | <code>function getAvatarCue(result = {}) {</code> | 定义函数 `getAvatarCue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 660 | <code>    if (result.mode === 'conversation') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 661 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 662 | <code>            action: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 663 | <code>            expression: result.intent === 'emotional_chat' ? 'relaxed' : 'happy'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 664 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 665 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 666 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 667 | <code>    if (result.status === 'needs_approval') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 668 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 669 | <code>            action: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 670 | <code>            expression: 'surprised'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 671 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 672 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 674 | <code>    if (result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 675 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 676 | <code>            action: 'wave',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 677 | <code>            expression: 'happy'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 678 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 679 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 680 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 681 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 682 | <code>        action: 'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 683 | <code>        expression: 'surprised'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 684 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 685 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 686 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 687 | <code>export class AILISDesktopChatService {</code> | 定义类 `AILISDesktopChatService`，把相关状态与行为收拢为一个运行时对象。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 688 | <code>    constructor({ gateway = window.ailisDesktop?.gateway &#124;&#124; null, runtimeKind = 'desktop' } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 689 | <code>        this.gateway = gateway;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 690 | <code>        this.runtimeKind = runtimeKind === 'hosted' ? 'hosted' : 'desktop';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 691 | <code>        this.supportsAutoChat = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 692 | <code>        this.prefersThinkingState = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 693 | <code>        this.activeRunId = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 694 | <code>        this.activeSessionId = '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 695 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 696 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 697 | <code>    getWelcomeMessage() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 698 | <code>        return 'AILIS到啦！今天想和我聊点什么，或者直接把任务交给我都可以。';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 699 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 700 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 701 | <code>    async ensureReady() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 702 | <code>        if (!this.gateway?.isSupported &#124;&#124; !this.gateway?.runAgent) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 703 | <code>            throw new Error('当前桌面宿主不支持 AILIS Agent Runner');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 704 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 705 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 706 | <code>        const status = await this.gateway.getStatus();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 707 | <code>        if (!status?.running) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 708 | <code>            if (status?.startError) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 709 | <code>                throw new Error(`AILIS Gateway 启动失败：${status.startError}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 710 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 711 | <code>            throw new Error('AILIS Gateway 尚未启动');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 712 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 713 | <code>        return status;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 714 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 715 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 716 | <code>    async fetchAssistantTurn({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 717 | <code>        sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 718 | <code>        messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 719 | <code>        isAutoChat = false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 720 | <code>        replyMode = 'stream_text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 721 | <code>        onProgress,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 722 | <code>        proactiveContext = null</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 723 | <code>    }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 724 | <code>        if (isAutoChat) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 725 | <code>            const proactiveMode = normalizeText(proactiveContext?.proactivity?.mode).toLowerCase();</code> | 声明局部标识符 `proactiveMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 726 | <code>            const opportunity = proactiveMode === 'companion'</code> | 声明局部标识符 `opportunity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 727 | <code>                ? await this.createProactiveCompanionTurn({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 728 | <code>                    sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 729 | <code>                    messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 730 | <code>                    context: proactiveContext &#124;&#124; {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 731 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 732 | <code>                : await this.evaluateProactiveOpportunity({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 733 | <code>                sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 734 | <code>                messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 735 | <code>                context: proactiveContext &#124;&#124; {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 736 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 737 | <code>            if (!opportunity.shouldSpeak &#124;&#124; !opportunity.payload) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 738 | <code>                throw new Error('proactive_companion_no_opportunity');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 739 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 740 | <code>            return attachServerTtsIfRequested(opportunity.payload, replyMode);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 741 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 742 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 743 | <code>        const latestUserEntry = getLatestUserEntry(messageHistory);</code> | 声明局部标识符 `latestUserEntry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 744 | <code>        const message = normalizeText(latestUserEntry?.content);</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 745 | <code>        if (!message) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 746 | <code>            throw new Error('消息不能为空');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 747 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 748 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 749 | <code>        const embodiedPayload = createEmbodiedCommandPayload(message);</code> | 声明局部标识符 `embodiedPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 750 | <code>        if (embodiedPayload) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 751 | <code>            return attachServerTtsIfRequested(embodiedPayload, replyMode);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 752 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 753 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 754 | <code>        const splitAttachments = splitChatAttachments(latestUserEntry?.attachments);</code> | 声明局部标识符 `splitAttachments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 755 | <code>        const visionAttachments = splitAttachments.vision;</code> | 声明局部标识符 `visionAttachments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 756 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 757 | <code>            this.runtimeKind === 'desktop' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 758 | <code>            visionAttachments.length &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 759 | <code>            !splitAttachments.files.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 760 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 761 | <code>            const payload = await fetchVisionAssistantTurn(latestUserEntry, {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 762 | <code>                sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 763 | <code>                messageHistory</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 764 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 765 | <code>            return attachServerTtsIfRequested(payload, replyMode);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 766 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 767 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 768 | <code>        const status = await this.ensureReady();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 769 | <code>        let streamedAnswerText = '';</code> | 声明局部标识符 `streamedAnswerText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 770 | <code>        let activeAnswerStreamId = '';</code> | 声明局部标识符 `activeAnswerStreamId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 771 | <code>        let answerStreamVisible = false;</code> | 声明局部标识符 `answerStreamVisible`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 772 | <code>        let answerStreamCommitted = false;</code> | 声明局部标识符 `answerStreamCommitted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 773 | <code>        let bridgedRunId = '';</code> | 声明局部标识符 `bridgedRunId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 774 | <code>        let bridgedSessionId = '';</code> | 声明局部标识符 `bridgedSessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 775 | <code>        const unsubscribeProgress = createGatewayProgressBridge({</code> | 声明局部标识符 `unsubscribeProgress`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 776 | <code>            gateway: this.gateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 777 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 778 | <code>            onProgress: (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 779 | <code>                if (!answerStreamVisible) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 780 | <code>                    onProgress?.(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 781 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 782 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 783 | <code>            onRunStarted: ({ runId, sessionId: startedSessionId }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 784 | <code>                bridgedRunId = runId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 785 | <code>                bridgedSessionId = startedSessionId &#124;&#124; sessionId;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 786 | <code>                this.activeRunId = runId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 787 | <code>                this.activeSessionId = bridgedSessionId;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 788 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 789 | <code>            onRunFinished: ({ runId }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 790 | <code>                if (this.activeRunId === runId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 791 | <code>                    this.activeRunId = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 792 | <code>                    this.activeSessionId = '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 793 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 794 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 795 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 796 | <code>        let result;</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 797 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 798 | <code>            result = await this.gateway.runAgent(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 799 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 800 | <code>                    sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 801 | <code>                    message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 802 | <code>                    messageHistory: sanitizeMessageHistoryForGateway(messageHistory),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 803 | <code>                    attachments: summarizeChatAttachmentsForGateway(latestUserEntry?.attachments),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 804 | <code>                    agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 805 | <code>                    directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 806 | <code>                    maxAgentSteps: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 807 | <code>                    context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 808 | <code>                        workspace: status.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 809 | <code>                        runtimeKind: this.runtimeKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 810 | <code>                        agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 811 | <code>                        directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 812 | <code>                        maxAgentSteps: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 813 | <code>                        agentRole: 'persona_orchestrator'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 814 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 815 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 816 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 817 | <code>                    onTextDelta: (delta, streamPayload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 818 | <code>                        if (typeof delta !== 'string' &#124;&#124; !delta) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 819 | <code>                            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 820 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 821 | <code>                        const streamId = normalizeText(</code> | 声明局部标识符 `streamId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 822 | <code>                            streamPayload.metadata?.streamId &#124;&#124; streamPayload.streamId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 823 | <code>                        ) &#124;&#124; 'hosted-answer-stream';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 824 | <code>                        if (activeAnswerStreamId !== streamId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 825 | <code>                            activeAnswerStreamId = streamId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 826 | <code>                            streamedAnswerText = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 827 | <code>                            answerStreamCommitted = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 828 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 829 | <code>                        answerStreamVisible = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 830 | <code>                        streamedAnswerText += delta;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 831 | <code>                        onProgress?.(toAssistantPayload(streamedAnswerText, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 832 | <code>                            speechText: streamedAnswerText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 833 | <code>                            bubbleText: streamedAnswerText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 834 | <code>                            streamMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 835 | <code>                            stream_delta_text: delta,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 836 | <code>                            stream_delta_speech_text: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 837 | <code>                            answerStream: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 838 | <code>                        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 839 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 840 | <code>                    onTextStreamEvent: (eventType, streamPayload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 841 | <code>                        const streamId = normalizeText(streamPayload.streamId) &#124;&#124;</code> | 声明局部标识符 `streamId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 842 | <code>                            activeAnswerStreamId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 843 | <code>                            'hosted-answer-stream';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 844 | <code>                        if (eventType === 'response.output_text.started') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 845 | <code>                            if (activeAnswerStreamId !== streamId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 846 | <code>                                activeAnswerStreamId = streamId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 847 | <code>                                streamedAnswerText = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 848 | <code>                                answerStreamVisible = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 849 | <code>                                answerStreamCommitted = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 850 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 851 | <code>                            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 852 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 853 | <code>                        if (streamId !== activeAnswerStreamId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 854 | <code>                            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 855 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 856 | <code>                        if (eventType === 'response.output_text.committed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 857 | <code>                            answerStreamCommitted = Boolean(streamedAnswerText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 858 | <code>                            answerStreamVisible = answerStreamCommitted;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 859 | <code>                            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 860 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 861 | <code>                        if (eventType === 'response.output_text.discarded') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 862 | <code>                            const hadVisibleText = answerStreamVisible &amp;&amp; Boolean(streamedAnswerText);</code> | 声明局部标识符 `hadVisibleText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 863 | <code>                            streamedAnswerText = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 864 | <code>                            answerStreamVisible = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 865 | <code>                            answerStreamCommitted = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 866 | <code>                            if (hadVisibleText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 867 | <code>                                onProgress?.({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 868 | <code>                                    raw_text: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 869 | <code>                                    display_text: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 870 | <code>                                    display_format: 'markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 871 | <code>                                    contentFormat: 'markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 872 | <code>                                    speech_text: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 873 | <code>                                    bubble_text: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 874 | <code>                                    streamMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 875 | <code>                                    streamReset: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 876 | <code>                                    fallbackMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 877 | <code>                                    demoMode: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 878 | <code>                                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 879 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 880 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 881 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 882 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 883 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 884 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 885 | <code>            unsubscribeProgress();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 886 | <code>            if (bridgedRunId &amp;&amp; this.activeRunId === bridgedRunId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 887 | <code>                this.activeRunId = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 888 | <code>                this.activeSessionId = '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 889 | <code>            } else if (!this.activeRunId &amp;&amp; bridgedSessionId &amp;&amp; this.activeSessionId === bridgedSessionId) {</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 890 | <code>                this.activeSessionId = '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 891 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 892 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 893 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 894 | <code>        const payload = {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 895 | <code>            ...toAILISPayload(result),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 896 | <code>            streamMode: answerStreamCommitted</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 897 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 898 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 899 | <code>        return attachServerTtsIfRequested(payload, replyMode);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 900 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 901 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 902 | <code>    async createProactiveCompanionTurn({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 903 | <code>        sessionId = 'main',</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 904 | <code>        messageHistory = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 905 | <code>        context = {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 906 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 907 | <code>        if (!this.gateway?.isSupported &#124;&#124; !this.gateway?.runAgent) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 908 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 909 | <code>                shouldSpeak: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 910 | <code>                reasonType: 'gateway_unavailable'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 911 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 912 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 913 | <code>        const turn = {</code> | 声明局部标识符 `turn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 914 | <code>            shouldSpeak: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 915 | <code>            cooldownSec: 20,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 916 | <code>            reasonType: 'companion_cycle'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 917 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 918 | <code>        const reply = await this.generateProactiveCompanionReply({</code> | 声明局部标识符 `reply`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 919 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 920 | <code>            messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 921 | <code>            context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 922 | <code>            mode: 'companion'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 923 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 924 | <code>        if (!reply.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 925 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 926 | <code>                ...turn,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 927 | <code>                shouldSpeak: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 928 | <code>                reasonType: reply.reasonType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 929 | <code>                error: reply.error &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 930 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 931 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 932 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 933 | <code>            ...turn,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 934 | <code>            context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 935 | <code>            payload: toAssistantPayload(reply.text, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 936 | <code>                speechText: reply.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 937 | <code>                bubbleText: reply.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 938 | <code>                proactiveCompanion: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 939 | <code>                    mode: 'companion',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 940 | <code>                    reasonType: turn.reasonType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 941 | <code>                    replyModel: reply.model &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 942 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 943 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 944 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 945 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 946 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 947 | <code>    async evaluateProactiveOpportunity({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 948 | <code>        sessionId = 'main',</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 949 | <code>        messageHistory = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 950 | <code>        context = {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 951 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 952 | <code>        if (typeof window.ailisDesktop?.llm?.chat !== 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 953 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 954 | <code>                shouldSpeak: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 955 | <code>                reasonType: 'llm_unavailable'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 956 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 957 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 958 | <code>        const recentTurns = compactConversationTurns(messageHistory, 10);</code> | 声明局部标识符 `recentTurns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 959 | <code>        const latestUser = [...recentTurns].reverse().find((message) =&gt; message.role === 'user');</code> | 声明局部标识符 `latestUser`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 960 | <code>        const decisionContext = {</code> | 声明局部标识符 `decisionContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 961 | <code>            ...context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 962 | <code>            recentContext: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 963 | <code>                ...(context.recentContext &#124;&#124; {}),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 964 | <code>                lastVisibleTurns: recentTurns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 965 | <code>                latestUserText: latestUser?.text &#124;&#124; context.recentContext?.latestUserText &#124;&#124; ''</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 966 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 967 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 968 | <code>        const result = await window.ailisDesktop.llm.chat({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 969 | <code>            includeAilisMemory: true,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 970 | <code>            recordMemory: false,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 971 | <code>            memorySource: 'proactive_companion_opportunity',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 972 | <code>            memoryUserMessage: latestUser?.text &#124;&#124; '主动陪伴机会判断',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 973 | <code>            messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 974 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 975 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 976 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 977 | <code>                    role: 'system',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 978 | <code>                    content: buildProactiveOpportunitySystemPrompt()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 979 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 980 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 981 | <code>                    role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 982 | <code>                    content: JSON.stringify(decisionContext, null, 2)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 983 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 984 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 985 | <code>            jsonMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 986 | <code>            expectJson: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 987 | <code>            outputFormat: 'json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 988 | <code>            temperature: 0.45,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 989 | <code>            maxTokens: 520,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 990 | <code>            timeoutMs: PROACTIVE_LLM_TIMEOUT_MS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 991 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 992 | <code>        if (!result?.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 993 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 994 | <code>                shouldSpeak: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 995 | <code>                reasonType: result?.code &#124;&#124; 'llm_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 996 | <code>                error: result?.error &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 997 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 998 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 999 | <code>        const parsed = extractJsonObjectFromText(result.content);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1000 | <code>        const decision = normalizeProactiveDecision(parsed &#124;&#124; {});</code> | 声明局部标识符 `decision`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1001 | <code>        if (!decision.shouldSpeak) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1002 | <code>            return decision;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1003 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1004 | <code>        const reply = await this.generateProactiveCompanionReply({</code> | 声明局部标识符 `reply`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1005 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1006 | <code>            messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1007 | <code>            context: decisionContext,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1008 | <code>            decision,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1009 | <code>            mode: 'cowork'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1010 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1011 | <code>        if (!reply.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1012 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1013 | <code>                ...decision,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1014 | <code>                shouldSpeak: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1015 | <code>                reasonType: reply.reasonType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1016 | <code>                error: reply.error &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1017 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1018 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1019 | <code>        const surface = proactiveEmotionToSurface(decision, reply.text);</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1020 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1021 | <code>            ...decision,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1022 | <code>            context: decisionContext,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1023 | <code>            payload: toAssistantPayload(reply.text, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1024 | <code>                expression: surface.expression,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1025 | <code>                action: surface.action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1026 | <code>                speechText: reply.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1027 | <code>                bubbleText: reply.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1028 | <code>                surface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1029 | <code>                proactiveCompanion: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1030 | <code>                    intent: decision.intent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1031 | <code>                    reasonType: decision.reasonType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1032 | <code>                    decisionModel: result.model &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1033 | <code>                    replyModel: reply.model &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1034 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1035 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1036 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1037 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1038 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1039 | <code>    async generateProactiveCompanionReply({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1040 | <code>        sessionId = 'main',</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1041 | <code>        messageHistory = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1042 | <code>        context = {},</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1043 | <code>        mode = 'companion',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1044 | <code>        decision = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1045 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1046 | <code>        const latestUser = [...messageHistory].reverse().find((message) =&gt; message?.role === 'user');</code> | 声明局部标识符 `latestUser`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1047 | <code>        const isWorkMode = mode === 'cowork';</code> | 声明局部标识符 `isWorkMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1048 | <code>        if (!isWorkMode) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1049 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1050 | <code>                const status = await this.ensureReady();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1051 | <code>                const latestUserText = normalizeText(latestUser?.content &#124;&#124; latestUser?.text) &#124;&#124; '日常陪伴';</code> | 声明局部标识符 `latestUserText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1052 | <code>                const result = await this.gateway.runAgent({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1053 | <code>                    sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1054 | <code>                    message: latestUserText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1055 | <code>                    messageHistory: sanitizeMessageHistoryForGateway(messageHistory),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1056 | <code>                    agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1057 | <code>                    directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1058 | <code>                    maxAgentSteps: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1059 | <code>                    suppressCurrentUserMessage: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1060 | <code>                    ephemeralDeveloperMessage: buildProactiveCompanionHeartbeatDeveloperMessage(messageHistory),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1061 | <code>                    context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1062 | <code>                        workspace: status.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1063 | <code>                        agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1064 | <code>                        directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1065 | <code>                        maxAgentSteps: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1066 | <code>                        agentRole: 'persona_orchestrator',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1067 | <code>                        suppressCurrentUserMessage: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1068 | <code>                        ephemeralDeveloperMessage: buildProactiveCompanionHeartbeatDeveloperMessage(messageHistory)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1069 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1070 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1071 | <code>                const payload = toAILISPayload(result);</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1072 | <code>                const text = normalizeMarkdownSource(payload.display_text &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1073 | <code>                if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1074 | <code>                    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1075 | <code>                        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1076 | <code>                        reasonType: 'empty_reply'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1077 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1078 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1079 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1080 | <code>                    ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1081 | <code>                    text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1082 | <code>                    model: result?.model &#124;&#124; result?.llm?.model &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1083 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1084 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1085 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1086 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1087 | <code>                    reasonType: error?.code &#124;&#124; 'reply_generation_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1088 | <code>                    error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1089 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1090 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1091 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1092 | <code>        const conversationMessages = messageHistory</code> | 声明局部标识符 `conversationMessages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1093 | <code>            .filter((message) =&gt; ['user', 'assistant'].includes(message?.role))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1094 | <code>            .map((message) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1095 | <code>                role: message.role,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1096 | <code>                content: normalizeMarkdownSource(message.content &#124;&#124; message.text &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1097 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1098 | <code>            .filter((message) =&gt; message.content);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1099 | <code>        const result = await window.ailisDesktop.llm.chat({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1100 | <code>            includeAilisMemory: true,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1101 | <code>            recordMemory: false,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1102 | <code>            memorySource: 'proactive_work_reply',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1103 | <code>            memoryUserMessage: normalizeText(latestUser?.content &#124;&#124; latestUser?.text) &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1104 | <code>                '工作模式主动反馈',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1105 | <code>            messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1106 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1107 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1108 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1109 | <code>                    role: 'system',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1110 | <code>                    content: buildProactiveWorkReplySystemPrompt(decision)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1111 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1112 | <code>                ...conversationMessages</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1113 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1114 | <code>            jsonMode: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1115 | <code>            expectJson: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1116 | <code>            outputFormat: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1117 | <code>            temperature: 0.82,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1118 | <code>            maxTokens: 700,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1119 | <code>            timeoutMs: PROACTIVE_LLM_TIMEOUT_MS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1120 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1121 | <code>        if (!result?.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1122 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1123 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1124 | <code>                reasonType: result?.code &#124;&#124; 'reply_generation_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1125 | <code>                error: result?.error &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1126 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1127 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1128 | <code>        const text = normalizeMarkdownSource(result.content &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1129 | <code>        if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1130 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1131 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1132 | <code>                reasonType: 'empty_reply'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1133 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1134 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1135 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1136 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1137 | <code>            text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1138 | <code>            model: result.model &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1139 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1140 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1142 | <code>    async abortCurrentTurn({ sessionId = '', reason = 'chat_user_interrupt' } = {}) {</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1143 | <code>        if (!this.gateway?.interruptAgentRun) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1144 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1145 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1146 | <code>                status: 'unsupported',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1147 | <code>                error: '当前桌面宿主不支持 AILIS 对话中断。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1148 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1149 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1150 | <code>        const targetSessionId = normalizeText(sessionId &#124;&#124; this.activeSessionId);</code> | 声明局部标识符 `targetSessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1151 | <code>        const result = await this.gateway.interruptAgentRun({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1152 | <code>            runId: this.activeRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1153 | <code>            sessionId: targetSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1154 | <code>            reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1155 | <code>            source: 'chat-panel'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1156 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1157 | <code>        if (result?.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1158 | <code>            this.activeRunId = result.runId &#124;&#124; this.activeRunId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。”这一文件职责。 |
| 1159 | <code>            this.activeSessionId = result.sessionId &#124;&#124; targetSessionId;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1160 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1161 | <code>        return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1162 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1163 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
