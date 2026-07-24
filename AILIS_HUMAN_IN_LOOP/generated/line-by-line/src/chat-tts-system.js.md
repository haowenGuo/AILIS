# src/chat-tts-system.js 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。
- 文件类型：`source-code`
- 原始行数：1221
- SHA-256：`406cb33507b56e83b5ed63c1aa2f02854b21c363bbdf9a7666d53e3ef3bb6ff7`
- 可运行副本：[打开源文件](../../../source/src/chat-tts-system.js)
- 依赖：`./config.js`、`./chat-attachments.js`、`./markdown-renderer.js`、`./avatar-dialogue-bubble.js`、`./tts-speech-text.js`、`./i18n.js`、`./proactive-companion-manager.js`
- 主要符号：`CHAT_UI_EVENT_NAME`、`CHAT_EXPRESSIVE_GESTURE_INTENTS`、`getPayloadSurface`、`normalizeCueValue`、`shouldAllowChatMotion`、`surface`、`gestureIntent`、`action`、`normalizeVisionAttachments`、`appendAttachmentHint`、`labels`、`ChatTTSSystem`、`sessionId`、`rawValue`、`parsed`、`messages`、`welcomeMessage`、`unlockAudio`、`supportsCompanion`、`supportsWorkFeedback`、`nextAutoChatMode`、`autoChatModeChanged`、`turn`、`desktopHistoryAvailable`、`result`、`element`、`role`、`source`、`text`、`avatarSpeechStarted`、`session`、`deltaText`、`started`、`aiMessageDiv`、`chunkedSpeechSession`、`messageHistorySnapshot`、`payload`、`usedChunkedSpeech`、`hasOverride`、`content`、`attachments`、`messageContent`、`loadingEl`、`latestMessage`、`interruptedTurn`、`replyModes`、`messageHistory`、`shouldContinue`、`lastError`、`index`、`replyMode`、`displayText`、`alignment`、`cueSignature`、`allowChatMotion`、`speechText`、`speechPayload`、`speechResult`、`failureMessage`、`durationMs`、`revealText`、`animateMouth`、`startTime`、`renderFrame`、`elapsedMs`、`progress`、`visibleLength`、`errorMessage`、`div`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import { CONFIG } from './config.js';</code> | 导入依赖 `./config.js`，使本文件可以复用外部模块能力。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 2 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 3 | <code>    buildAttachmentHint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 4 | <code>    getDefaultMessageForAttachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 5 | <code>    normalizeChatAttachments</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 6 | <code>} from './chat-attachments.js';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 7 | <code>import { markdownToPlainText, setMarkdownContent, setPlainTextContent } from './markdown-renderer.js';</code> | 导入依赖 `./markdown-renderer.js`，使本文件可以复用外部模块能力。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 8 | <code>import { AVATAR_SPEECH_EVENT_NAME } from './avatar-dialogue-bubble.js';</code> | 导入依赖 `./avatar-dialogue-bubble.js`，使本文件可以复用外部模块能力。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 9 | <code>import { deriveTtsSpeechText, normalizeTtsSpeechText } from './tts-speech-text.js';</code> | 导入依赖 `./tts-speech-text.js`，使本文件可以复用外部模块能力。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 10 | <code>import { t } from './i18n.js';</code> | 导入依赖 `./i18n.js`，使本文件可以复用外部模块能力。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 11 | <code>import { ProactiveCompanionManager } from './proactive-companion-manager.js';</code> | 导入依赖 `./proactive-companion-manager.js`，使本文件可以复用外部模块能力。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>const CHAT_UI_EVENT_NAME = 'ailis-chat-ui-event';</code> | 声明局部标识符 `CHAT_UI_EVENT_NAME`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 14 | <code>const CHAT_EXPRESSIVE_GESTURE_INTENTS = new Set([</code> | 声明局部标识符 `CHAT_EXPRESSIVE_GESTURE_INTENTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 15 | <code>    'greeting',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 16 | <code>    'farewell',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 17 | <code>    'success',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 18 | <code>    'celebrate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 19 | <code>    'surprised',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 20 | <code>    'dance'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 21 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>function getPayloadSurface(payload = {}) {</code> | 定义函数 `getPayloadSurface`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 24 | <code>    return payload.surface &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 25 | <code>        payload.personaSurface &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 26 | <code>        payload.persona_surface &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 27 | <code>        payload.personaOutput &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 28 | <code>        payload.persona_output &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 29 | <code>        null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 30 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>function normalizeCueValue(value) {</code> | 定义函数 `normalizeCueValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 33 | <code>    return String(value &#124;&#124; '').trim().toLowerCase().replace(/[-\s]+/g, '_');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 34 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>function shouldAllowChatMotion(payload = {}) {</code> | 定义函数 `shouldAllowChatMotion`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 37 | <code>    const surface = getPayloadSurface(payload) &#124;&#124; {};</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 38 | <code>    const gestureIntent = normalizeCueValue(</code> | 声明局部标识符 `gestureIntent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 39 | <code>        surface.gestureIntent &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 40 | <code>            surface.gesture_intent &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 41 | <code>            payload.gestureIntent &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 42 | <code>            payload.gesture_intent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 43 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>    const action = normalizeCueValue(surface.action &#124;&#124; payload.action);</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>    return Boolean(action) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 47 | <code>        CHAT_EXPRESSIVE_GESTURE_INTENTS.has(gestureIntent) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 48 | <code>        payload.desktopLlmMode === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 49 | <code>        payload.demoMode === true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 50 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 52 | <code>function normalizeVisionAttachments(attachments = []) {</code> | 定义函数 `normalizeVisionAttachments`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 53 | <code>    if (!Array.isArray(attachments)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 54 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 55 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>    return attachments</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 58 | <code>        .filter((attachment) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 59 | <code>            if (!attachment?.dataUrl) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 60 | <code>                return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 61 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>            if (attachment.type &amp;&amp; attachment.type !== 'vision') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 63 | <code>                return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 64 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>            return String(attachment.mimeType &#124;&#124; 'image/png').startsWith('image/');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 66 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>        .map((attachment) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 68 | <code>            type: 'vision',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 69 | <code>            id: String(attachment.id &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 70 | <code>            source: String(attachment.source &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 71 | <code>            label: String(attachment.label &#124;&#124; '截图'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 72 | <code>            dataUrl: String(attachment.dataUrl &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 73 | <code>            thumbnailDataUrl: String(attachment.thumbnailDataUrl &#124;&#124; attachment.dataUrl &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 74 | <code>            mimeType: String(attachment.mimeType &#124;&#124; 'image/png'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 75 | <code>            width: Number(attachment.width) &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 76 | <code>            height: Number(attachment.height) &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 77 | <code>            createdAt: String(attachment.createdAt &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 78 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>        .slice(0, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 80 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>function appendAttachmentHint(content, attachments = []) {</code> | 定义函数 `appendAttachmentHint`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 83 | <code>    if (!attachments.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 84 | <code>        return content;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 85 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 86 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 87 | <code>    const labels = attachments.map((attachment) =&gt; attachment.label &#124;&#124; '截图').join('、');</code> | 声明局部标识符 `labels`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 88 | <code>    return `${content}\n\n[附带视觉上下文：${labels}]`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 89 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>export class ChatTTSSystem {</code> | 定义类 `ChatTTSSystem`，把相关状态与行为收拢为一个运行时对象。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 92 | <code>    constructor(vrmSystem, audioPlayer, chatService, { speechProvider = null, chunkedTtsEnabled = true } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 93 | <code>        this.vrmSystem = vrmSystem;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 94 | <code>        this.audioPlayer = audioPlayer;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 95 | <code>        this.chatService = chatService;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 96 | <code>        this.speechProvider = speechProvider;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 97 | <code>        this.chunkedTtsEnabled = chunkedTtsEnabled !== false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>        this.messageListEl = document.getElementById('message-list');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 100 | <code>        this.inputEl = document.getElementById('message-input');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 101 | <code>        this.sendBtnEl = document.getElementById('send-btn');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 102 | <code>        this.sessionId = this.getOrCreateSessionId();</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 103 | <code>        this.messageHistory = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 104 | <code>        this.historyRestored = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>        this.isBusy = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 107 | <code>        this.autoChatTimer = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 108 | <code>        this.hasShownAutoplayHint = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 109 | <code>        this.hasShownTextFallbackHint = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 110 | <code>        this.hasShownSpeechProviderHint = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 111 | <code>        this.messageCounter = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 112 | <code>        this.turnCounter = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 113 | <code>        this.interruptRequested = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 114 | <code>        this.interruptInFlight = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 115 | <code>        this.activeChunkedSpeechSession = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 116 | <code>        this.activeTurn = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 117 | <code>        this.cancelledTurnIds = new Set();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 118 | <code>        this.lastAutoChatMode = String(CONFIG.AUTO_CHAT_MODE &#124;&#124; 'off');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 119 | <code>        this.proactiveCompanion = new ProactiveCompanionManager({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 120 | <code>            getConfig: () =&gt; CONFIG,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 121 | <code>            getChatState: () =&gt; this.getProactiveChatState(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 122 | <code>            requestCompanionTurn: (payload) =&gt; this.chatService?.createProactiveCompanionTurn?.({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 123 | <code>                sessionId: this.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 124 | <code>                messageHistory: this.createMessageHistorySnapshot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 125 | <code>                ...payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 126 | <code>            }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>            requestOpportunity: (payload) =&gt; this.chatService?.evaluateProactiveOpportunity?.({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 128 | <code>                sessionId: this.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 129 | <code>                messageHistory: this.createMessageHistorySnapshot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 130 | <code>                ...payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 131 | <code>            }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>            onSpeak: (decision) =&gt; this.triggerAutoChat(decision)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 133 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>        this.historyReady = this.restorePersistedConversation();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>        this.inputEl.disabled = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 137 | <code>        this.sendBtnEl.disabled = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>        this.bindEvents();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 140 | <code>        this.installAudioUnlockHandlers();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 141 | <code>        this.emitChatUiEvent({ type: 'state', isBusy: this.isBusy });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 142 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>    getOrCreateSessionId() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 145 | <code>        let sessionId = localStorage.getItem('session_id');</code> | 声明局部标识符 `sessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 146 | <code>        if (!sessionId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 147 | <code>            sessionId = `user_${Math.random().toString(36).substring(2, 15)}`;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 148 | <code>            localStorage.setItem('session_id', sessionId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 149 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>        return sessionId;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 151 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 153 | <code>    getBrowserHistoryStorageKey() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 154 | <code>        return `ailis_chat_history:${this.sessionId}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 155 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>    loadBrowserHistory() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 158 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 159 | <code>            const rawValue = window.localStorage?.getItem(this.getBrowserHistoryStorageKey());</code> | 声明局部标识符 `rawValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 160 | <code>            const parsed = rawValue ? JSON.parse(rawValue) : [];</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 161 | <code>            return Array.isArray(parsed) ? parsed : [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 162 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 163 | <code>            console.warn('恢复浏览器对话历史失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 164 | <code>            return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 165 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 168 | <code>    saveBrowserHistory() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 169 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 170 | <code>            const messages = this.createMessageHistorySnapshot()</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 171 | <code>                .filter((message) =&gt; message?.role === 'user' &#124;&#124; message?.role === 'assistant')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 172 | <code>                .slice(-40);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 173 | <code>            window.localStorage?.setItem(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 174 | <code>                this.getBrowserHistoryStorageKey(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 175 | <code>                JSON.stringify(messages)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 176 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>            return { ok: true, messageCount: messages.length };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 178 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 179 | <code>            console.warn('保存浏览器对话历史失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 180 | <code>            return { ok: false, error: error?.message &#124;&#124; String(error) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 181 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>    bindEvents() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 185 | <code>        this.sendBtnEl.addEventListener('click', () =&gt; this.sendMessage());</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 186 | <code>        this.inputEl.addEventListener('keydown', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 187 | <code>            if (event.key === 'Enter' &amp;&amp; !event.shiftKey) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 188 | <code>                event.preventDefault();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 189 | <code>                this.sendMessage();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 190 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>        window.addEventListener('modelLoaded', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 194 | <code>            await this.historyReady;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 195 | <code>            const welcomeMessage = this.chatService?.getWelcomeMessage?.() &#124;&#124;</code> | 声明局部标识符 `welcomeMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 196 | <code>                'AILIS到啦！现在可以聊天啦~';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 197 | <code>            if (!this.messageHistory.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 198 | <code>                this.addSystemMessage(t(welcomeMessage));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 199 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>            this.inputEl.disabled = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 201 | <code>            this.sendBtnEl.disabled = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 202 | <code>            this.startAutoChatTimer('startup');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 203 | <code>            this.emitChatUiEvent({ type: 'state', isBusy: this.isBusy });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 204 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>    installAudioUnlockHandlers() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 208 | <code>        const unlockAudio = async () =&gt; {</code> | 声明局部标识符 `unlockAudio`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 209 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 210 | <code>                await this.audioPlayer.unlock();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 211 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 212 | <code>                console.warn('⚠️ 提前解锁音频失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 213 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 216 | <code>        window.addEventListener('pointerdown', unlockAudio, { once: true });</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 217 | <code>        window.addEventListener('keydown', unlockAudio, { once: true });</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 218 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>    startAutoChatTimer(reason = 'idle', delayMs = undefined) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 221 | <code>        const supportsCompanion = typeof this.chatService?.createProactiveCompanionTurn === 'function';</code> | 声明局部标识符 `supportsCompanion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 222 | <code>        const supportsWorkFeedback = typeof this.chatService?.evaluateProactiveOpportunity === 'function';</code> | 声明局部标识符 `supportsWorkFeedback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 223 | <code>        if (this.chatService?.supportsAutoChat === false &#124;&#124; (!supportsCompanion &amp;&amp; !supportsWorkFeedback)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 224 | <code>            console.log('⏸️ 当前聊天后端不支持主动搭话');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 225 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 226 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>        this.proactiveCompanion.start(reason, delayMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 228 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 230 | <code>    getProactiveChatState() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 231 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 232 | <code>            isBusy: this.isBusy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 233 | <code>            userTyping: Boolean(this.inputEl?.value?.trim()),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 234 | <code>            inputDisabled: Boolean(this.inputEl?.disabled),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 235 | <code>            voicePlaying: Boolean(this.activeChunkedSpeechSession),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 236 | <code>            messageHistory: this.messageHistory</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 237 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 238 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 240 | <code>    applyRuntimePreferences(preferences = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 241 | <code>        const nextAutoChatMode = String(CONFIG.AUTO_CHAT_MODE &#124;&#124; 'off');</code> | 声明局部标识符 `nextAutoChatMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 242 | <code>        const autoChatModeChanged = nextAutoChatMode !== this.lastAutoChatMode;</code> | 声明局部标识符 `autoChatModeChanged`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 243 | <code>        this.lastAutoChatMode = nextAutoChatMode;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>        if ('chunkedTtsEnabled' in preferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 246 | <code>            this.chunkedTtsEnabled = preferences.chunkedTtsEnabled !== false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 247 | <code>            if (!this.chunkedTtsEnabled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 248 | <code>                this.stopLingeringSpeech('chunked-tts-disabled');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 249 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>        if (preferences.speechMode === 'off' &#124;&#124; this.speechProvider?.isSpeechDisabled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 253 | <code>            this.stopLingeringSpeech('speech-disabled');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 254 | <code>            this.vrmSystem.stopSpeaking();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 255 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>        if (this.inputEl.disabled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 258 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 259 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 261 | <code>        if (autoChatModeChanged) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 262 | <code>            this.startAutoChatTimer(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 263 | <code>                'mode_changed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 264 | <code>                CONFIG.AUTO_CHAT_ENABLED ? CONFIG.AUTO_CHAT_MIN_INTERVAL : undefined</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 265 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>        } else if (CONFIG.AUTO_CHAT_ENABLED &amp;&amp; !this.proactiveCompanion.timer) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 267 | <code>            this.startAutoChatTimer('preferences_updated');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 268 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>    createMessageId(role = 'message') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 272 | <code>        this.messageCounter += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 273 | <code>        return `${role}-${Date.now()}-${this.messageCounter}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 274 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>    createTurnState(kind = 'chat') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 277 | <code>        this.turnCounter += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 278 | <code>        const turn = {</code> | 声明局部标识符 `turn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 279 | <code>            id: `${kind}-${Date.now()}-${this.turnCounter}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 280 | <code>            kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 281 | <code>            loadingEl: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 282 | <code>            aiMessageDiv: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 283 | <code>            chunkedSpeechSession: null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 284 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>        this.activeTurn = turn;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 286 | <code>        return turn;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 287 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>    isTurnCancelled(turn) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 290 | <code>        return Boolean(turn?.id &amp;&amp; this.cancelledTurnIds.has(turn.id));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 291 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>    isTurnActive(turn) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 294 | <code>        return Boolean(turn?.id &amp;&amp; this.activeTurn?.id === turn.id &amp;&amp; !this.isTurnCancelled(turn));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 295 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>    createMessageHistorySnapshot() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 298 | <code>        return this.messageHistory.map((message) =&gt; ({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 299 | <code>            ...message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 300 | <code>            attachments: Array.isArray(message.attachments)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 301 | <code>                ? message.attachments.map((attachment) =&gt; ({ ...attachment }))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 302 | <code>                : message.attachments</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 303 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 304 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 305 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 306 | <code>    async restorePersistedConversation() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 307 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 308 | <code>            const desktopHistoryAvailable = typeof window.ailisDesktop?.chatHistory?.load === 'function';</code> | 声明局部标识符 `desktopHistoryAvailable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 309 | <code>            const result = desktopHistoryAvailable</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 310 | <code>                ? await window.ailisDesktop.chatHistory.load({ sessionId: this.sessionId })</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 311 | <code>                : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 312 | <code>            const messages = desktopHistoryAvailable</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 313 | <code>                ? (Array.isArray(result?.messages) ? result.messages : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 314 | <code>                : this.loadBrowserHistory();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 315 | <code>            this.messageHistory = messages</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 316 | <code>                .filter((message) =&gt; message?.role === 'user' &#124;&#124; message?.role === 'assistant')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 317 | <code>                .map((message) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 318 | <code>                    role: message.role,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 319 | <code>                    content: String(message.content &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 320 | <code>                    attachments: normalizeChatAttachments(message.attachments),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 321 | <code>                    source: String(message.source &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 322 | <code>                    createdAt: String(message.createdAt &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 323 | <code>                }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 324 | <code>                .filter((message) =&gt; message.content);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 325 | <code>            for (const message of this.messageHistory) {</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 326 | <code>                if (message.role === 'user') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 327 | <code>                    this.addUserMessage(message.content, message.attachments);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 328 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 329 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 330 | <code>                const element = this.createAIMessage();</code> | 声明局部标识符 `element`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 331 | <code>                this.updateMessageContent(element, message.content);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 332 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>            this.historyRestored = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 334 | <code>            this.emitChatUiEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 335 | <code>                type: 'snapshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 336 | <code>                messages: this.getTranscriptSnapshot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 337 | <code>                isBusy: this.isBusy</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 338 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 339 | <code>            return { ok: true, messageCount: this.messageHistory.length };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 340 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 341 | <code>            this.historyRestored = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 342 | <code>            console.warn('恢复桌面对话历史失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 343 | <code>            return { ok: false, error: error?.message &#124;&#124; String(error) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 344 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 345 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 346 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 347 | <code>    async persistConversation() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 348 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 349 | <code>            if (typeof window.ailisDesktop?.chatHistory?.save === 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 350 | <code>                return await window.ailisDesktop.chatHistory.save({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 351 | <code>                    sessionId: this.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 352 | <code>                    messages: this.createMessageHistorySnapshot()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 353 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 354 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 355 | <code>            return this.saveBrowserHistory();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 356 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 357 | <code>            console.warn('保存桌面对话历史失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 358 | <code>            return { ok: false, error: error?.message &#124;&#124; String(error) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 359 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 361 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 362 | <code>    markTurnCancelled(turn) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 363 | <code>        if (turn?.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 364 | <code>            this.cancelledTurnIds.add(turn.id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 365 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 366 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 367 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 368 | <code>    releaseTurn(turn) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 369 | <code>        if (this.activeTurn?.id === turn?.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 370 | <code>            this.activeTurn = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 371 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 372 | <code>        if (turn?.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 373 | <code>            this.cancelledTurnIds.delete(turn.id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 374 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 375 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 377 | <code>    ensureMessageIdentity(element, role) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 378 | <code>        if (!element.dataset.messageId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 379 | <code>            element.dataset.messageId = this.createMessageId(role);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 380 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 381 | <code>        if (role) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 382 | <code>            element.dataset.messageRole = role;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 383 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 384 | <code>        return element.dataset.messageId;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 385 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 387 | <code>    inferMessageRole(element) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 388 | <code>        if (element.dataset.messageRole) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 389 | <code>            return element.dataset.messageRole;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 390 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 391 | <code>        if (element.classList.contains('message-user')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 392 | <code>            return 'user';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 393 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 394 | <code>        if (element.classList.contains('message-ai')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 395 | <code>            return 'assistant';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 396 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 397 | <code>        if (element.classList.contains('message-system')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 398 | <code>            return 'system';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 399 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 400 | <code>        if (element.classList.contains('message-loading')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 401 | <code>            return 'loading';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 402 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 403 | <code>        return 'system';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 404 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 406 | <code>    serializeMessageElement(element) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 407 | <code>        const role = this.inferMessageRole(element);</code> | 声明局部标识符 `role`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 408 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 409 | <code>            id: this.ensureMessageIdentity(element, role),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 410 | <code>            role,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 411 | <code>            content: element.__ailisMessageContent ?? element.textContent ?? '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 412 | <code>            contentFormat: element.dataset.contentFormat &#124;&#124; 'markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 413 | <code>            attachments: element.__ailisAttachments &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 414 | <code>            pending: role === 'loading'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 415 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 416 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 418 | <code>    emitChatUiEvent(payload) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 419 | <code>        window.dispatchEvent(new CustomEvent(CHAT_UI_EVENT_NAME, { detail: payload }));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 420 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 421 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 422 | <code>    emitAvatarSpeechEvent(payload) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 423 | <code>        window.dispatchEvent(new CustomEvent(AVATAR_SPEECH_EVENT_NAME, { detail: payload }));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 424 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 425 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 426 | <code>    getAvatarSpeechText(payload, displayText) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 427 | <code>        const source = deriveTtsSpeechText(payload, displayText);</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 428 | <code>        return markdownToPlainText(source)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 429 | <code>            .replace(/[ \t]+/g, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 430 | <code>            .replace(/\n{3,}/g, '\n\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 431 | <code>            .trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 432 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 434 | <code>    startAvatarSpeech(payload, displayText, aiMessageDiv) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 435 | <code>        const text = this.getAvatarSpeechText(payload, displayText);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 436 | <code>        if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 437 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 438 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 439 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 440 | <code>        this.emitAvatarSpeechEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 441 | <code>            phase: 'start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 442 | <code>            id: aiMessageDiv?.dataset?.messageId &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 443 | <code>            text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 444 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 445 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 446 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 447 | <code>    endAvatarSpeech(aiMessageDiv) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 448 | <code>        this.emitAvatarSpeechEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 449 | <code>            phase: 'end',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 450 | <code>            id: aiMessageDiv?.dataset?.messageId &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 451 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 452 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 453 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 454 | <code>    createChunkedSpeechSession(aiMessageDiv) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 455 | <code>        if (!this.chunkedTtsEnabled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 456 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 457 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 459 | <code>        if (this.speechProvider?.isSpeechDisabled &#124;&#124; typeof this.speechProvider?.createChunkedSession !== 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 460 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 461 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 463 | <code>        let avatarSpeechStarted = false;</code> | 声明局部标识符 `avatarSpeechStarted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 464 | <code>        const session = this.speechProvider.createChunkedSession({</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 465 | <code>            audioPlayer: this.audioPlayer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 466 | <code>            vrmSystem: this.vrmSystem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 467 | <code>            onPlaybackStart: (item) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 468 | <code>                if (avatarSpeechStarted) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 469 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 470 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 471 | <code>                avatarSpeechStarted = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 472 | <code>                this.emitAvatarSpeechEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 473 | <code>                    phase: 'start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 474 | <code>                    id: aiMessageDiv?.dataset?.messageId &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 475 | <code>                    text: item?.text &#124;&#124; aiMessageDiv?.__ailisMessageContent &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 476 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 477 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>            onPlaybackEnd: () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 479 | <code>                if (avatarSpeechStarted) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 480 | <code>                    this.endAvatarSpeech(aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 481 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 482 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 483 | <code>            onError: (error, context) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 484 | <code>                console.warn('[chunked-tts] 分段语音失败：', context, error);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 485 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 488 | <code>        if (session) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 489 | <code>            this.activeChunkedSpeechSession = session;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 490 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 491 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 492 | <code>        return session;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 493 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 494 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 495 | <code>    appendChunkedSpeechProgress(session, payload) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 496 | <code>        if (!session &#124;&#124; !payload) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 497 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 498 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>        const deltaText = normalizeTtsSpeechText(payload.stream_delta_speech_text &#124;&#124; '');</code> | 声明局部标识符 `deltaText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 500 | <code>        if (deltaText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 501 | <code>            session.appendText(deltaText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 502 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 503 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 505 | <code>    async finishChunkedSpeechSession(session, fallbackText = '') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 506 | <code>        if (!session) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 507 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 508 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 509 | <code>        if (!session.hasActivity() &amp;&amp; fallbackText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 510 | <code>            session.appendText(fallbackText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 511 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 512 | <code>        session.finish();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 513 | <code>        if (!session.hasActivity()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 514 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 515 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 516 | <code>        if (typeof session.waitUntilPlaybackStartedOrDone === 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 517 | <code>            const started = await session.waitUntilPlaybackStartedOrDone();</code> | 声明局部标识符 `started`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 518 | <code>            return Boolean(started &#124;&#124; session.hasPlaybackStarted?.());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 519 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 520 | <code>        await session.waitUntilDone();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 521 | <code>        return typeof session.hasPlaybackStarted === 'function' ? session.hasPlaybackStarted() : true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 522 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 524 | <code>    clearChunkedSpeechSession(session) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 525 | <code>        if (this.activeChunkedSpeechSession === session) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 526 | <code>            this.activeChunkedSpeechSession = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 527 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 528 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 529 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 530 | <code>    releaseChunkedSpeechSessionWhenDone(session) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 531 | <code>        if (!session) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 532 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 533 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 534 | <code>        if (typeof session.waitUntilDone !== 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 535 | <code>            this.clearChunkedSpeechSession(session);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 536 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 537 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 538 | <code>        void session.waitUntilDone()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 539 | <code>            .catch(() =&gt; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 540 | <code>            .finally(() =&gt; this.clearChunkedSpeechSession(session));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 541 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 542 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 543 | <code>    stopLingeringSpeech(reason = 'new-turn') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 544 | <code>        const session = this.activeChunkedSpeechSession;</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 545 | <code>        if (session) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 546 | <code>            Promise.resolve(session.cancel?.(reason)).catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 547 | <code>                console.warn('停止上一段分段语音失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 548 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 549 | <code>            this.clearChunkedSpeechSession(session);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 550 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 551 | <code>        Promise.resolve(this.audioPlayer?.stop?.()).catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 552 | <code>            console.warn('停止上一段音频失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 553 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 554 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 555 | <code>            window.speechSynthesis?.cancel?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 556 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 557 | <code>            console.warn('停止浏览器原生语音失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 558 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 559 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 560 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 561 | <code>    startAvatarPlayback(payload, displayText, aiMessageDiv) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 562 | <code>        this.executeAvatarCue(payload, aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 563 | <code>        if (!this.speechProvider?.isSpeechDisabled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 564 | <code>            this.startAvatarSpeech(payload, displayText, aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 565 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 566 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 568 | <code>    notifyMessageAdded(element, role) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 569 | <code>        this.ensureMessageIdentity(element, role);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 570 | <code>        this.emitChatUiEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 571 | <code>            type: 'message-added',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 572 | <code>            message: this.serializeMessageElement(element)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 573 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 574 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>    notifyMessageUpdated(element) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 577 | <code>        if (!element?.dataset?.messageId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 578 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 579 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 580 | <code>        this.emitChatUiEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 581 | <code>            type: 'message-updated',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 582 | <code>            message: this.serializeMessageElement(element)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 583 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 584 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 585 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 586 | <code>    notifyMessageRemoved(element) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 587 | <code>        if (!element?.dataset?.messageId &#124;&#124; element.dataset.removalNotified === 'true') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 588 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 589 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 590 | <code>        element.dataset.removalNotified = 'true';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 591 | <code>        this.emitChatUiEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 592 | <code>            type: 'message-removed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 593 | <code>            id: element.dataset.messageId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 594 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 595 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 596 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 597 | <code>    setBusy(nextBusy) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 598 | <code>        this.isBusy = nextBusy;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 599 | <code>        this.emitChatUiEvent({ type: 'state', isBusy: nextBusy });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 600 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 601 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 602 | <code>    renderMessageContent(element, content, contentFormat = 'markdown') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 603 | <code>        if (!element) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 604 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 605 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 606 | <code>        if (contentFormat === 'text') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 607 | <code>            setPlainTextContent(element, content);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 608 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 609 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 610 | <code>        setMarkdownContent(element, content);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 611 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 612 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 613 | <code>    updateMessageContent(element, content, contentFormat = 'markdown') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 614 | <code>        if (!element) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 615 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 616 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 617 | <code>        this.renderMessageContent(element, content, contentFormat);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 618 | <code>        this.notifyMessageUpdated(element);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 619 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 620 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 621 | <code>    removeMessageElement(element) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 622 | <code>        if (!element) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 623 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 624 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 625 | <code>        this.notifyMessageRemoved(element);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 626 | <code>        element.remove();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 627 | <code>        this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 628 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 629 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 630 | <code>    getTranscriptSnapshot() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 631 | <code>        return Array.from(this.messageListEl.children)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 632 | <code>            .filter((element) =&gt; element instanceof HTMLElement)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 633 | <code>            .map((element) =&gt; this.serializeMessageElement(element));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 634 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 635 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 636 | <code>    clearConversation() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 637 | <code>        if (this.isBusy) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 638 | <code>            this.addSystemMessage(t('AILIS 正在执行当前请求，完成后再清空会话。'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 639 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 640 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 641 | <code>        this.messageHistory = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 642 | <code>        this.messageListEl.innerHTML = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 643 | <code>        if (typeof window.ailisDesktop?.chatHistory?.clear === 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 644 | <code>            void window.ailisDesktop.chatHistory.clear({ sessionId: this.sessionId });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 645 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 646 | <code>            window.localStorage?.removeItem(this.getBrowserHistoryStorageKey());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 647 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 648 | <code>        this.addSystemMessage('当前会话已清空。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 649 | <code>        this.emitChatUiEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 650 | <code>            type: 'snapshot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 651 | <code>            messages: this.getTranscriptSnapshot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 652 | <code>            isBusy: this.isBusy</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 653 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 654 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 655 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 656 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 657 | <code>    async sendExternalMessage(content, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 658 | <code>        return this.sendMessage(content, options);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 659 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 660 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 661 | <code>    setSpeechProvider(nextProvider) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 662 | <code>        this.speechProvider = nextProvider;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 663 | <code>        this.hasShownSpeechProviderHint = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 664 | <code>        if (nextProvider?.isSpeechDisabled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 665 | <code>            this.stopLingeringSpeech('speech-disabled');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 666 | <code>            this.vrmSystem.stopSpeaking();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 667 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 668 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 669 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 670 | <code>    setChatService(nextChatService) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 671 | <code>        this.chatService = nextChatService;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 672 | <code>        this.startAutoChatTimer('service_changed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 673 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 674 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 675 | <code>    async triggerAutoChat(opportunity = null) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 676 | <code>        await this.historyReady;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 677 | <code>        if (this.chatService?.supportsAutoChat === false) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 678 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 679 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 680 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 681 | <code>        if (this.isBusy) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 682 | <code>            console.log('🤫 当前正忙，跳过本次主动对话');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 683 | <code>            return { ok: false, reason: 'busy' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 684 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 685 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 686 | <code>        console.log('✨ AILIS 尝试主动发起对话...');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 687 | <code>        this.setBusy(true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 688 | <code>        const turn = this.createTurnState('auto');</code> | 声明局部标识符 `turn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 689 | <code>        const aiMessageDiv = this.createAIMessage();</code> | 声明局部标识符 `aiMessageDiv`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 690 | <code>        const chunkedSpeechSession = this.createChunkedSpeechSession(aiMessageDiv);</code> | 声明局部标识符 `chunkedSpeechSession`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 691 | <code>        turn.aiMessageDiv = aiMessageDiv;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 692 | <code>        turn.chunkedSpeechSession = chunkedSpeechSession;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 693 | <code>        const messageHistorySnapshot = this.createMessageHistorySnapshot();</code> | 声明局部标识符 `messageHistorySnapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 694 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 695 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 696 | <code>            const payload = opportunity?.payload &#124;&#124; await this.fetchAssistantTurnWithFallback(true, (partialPayload) =&gt; {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 697 | <code>                    if (!this.isTurnActive(turn)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 698 | <code>                        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 699 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 700 | <code>                    this.renderStreamingAssistantReply(partialPayload, aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 701 | <code>                    this.appendChunkedSpeechProgress(chunkedSpeechSession, partialPayload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 702 | <code>                }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 703 | <code>                    messageHistory: messageHistorySnapshot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 704 | <code>                    shouldContinue: () =&gt; this.isTurnActive(turn),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 705 | <code>                    proactiveContext: opportunity?.context &#124;&#124; null</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 706 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 707 | <code>            if (!this.isTurnActive(turn)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 708 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 709 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 710 | <code>            const usedChunkedSpeech = await this.finishChunkedSpeechSession(</code> | 声明局部标识符 `usedChunkedSpeech`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 711 | <code>                chunkedSpeechSession,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 712 | <code>                deriveTtsSpeechText(payload, payload.display_text &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 713 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 714 | <code>            if (!this.isTurnActive(turn)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 715 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 716 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 717 | <code>            if (usedChunkedSpeech) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 718 | <code>                this.executeAvatarCue(payload, aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 719 | <code>                this.updateMessageContent(aiMessageDiv, payload.display_text &#124;&#124; payload.speech_text &#124;&#124; '...');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 720 | <code>                this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 721 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 722 | <code>                await this.renderAssistantReply(payload, aiMessageDiv);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 723 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 724 | <code>            this.messageHistory.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 725 | <code>                role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 726 | <code>                content: payload.display_text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 727 | <code>                source: 'proactive_companion',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 728 | <code>                createdAt: new Date().toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 729 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 730 | <code>            await this.persistConversation();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 731 | <code>            return { ok: true };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 732 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 733 | <code>            await chunkedSpeechSession?.cancel?.('auto-chat-error');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 734 | <code>            this.removeMessageElement(aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 735 | <code>            if (!this.isTurnCancelled(turn)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 736 | <code>                console.error('主动对话请求失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 737 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 738 | <code>            return { ok: false, reason: 'delivery_failed', error: error?.message &#124;&#124; String(error) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 739 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 740 | <code>            this.releaseChunkedSpeechSessionWhenDone(chunkedSpeechSession);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 741 | <code>            if (this.activeTurn?.id === turn.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 742 | <code>                this.interruptRequested = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 743 | <code>                this.interruptInFlight = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 744 | <code>                this.setBusy(false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 745 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 746 | <code>            this.releaseTurn(turn);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 747 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 748 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 749 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 750 | <code>    async sendMessage(contentOverride = null, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 751 | <code>        await this.historyReady;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 752 | <code>        if (this.isBusy) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 753 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 754 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 755 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 756 | <code>        const hasOverride = typeof contentOverride === 'string';</code> | 声明局部标识符 `hasOverride`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 757 | <code>        const content = String(hasOverride ? contentOverride : this.inputEl.value).trim();</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 758 | <code>        const attachments = normalizeChatAttachments(options.attachments);</code> | 声明局部标识符 `attachments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 759 | <code>        if (!content &amp;&amp; !attachments.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 760 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 761 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 762 | <code>        const messageContent = content &#124;&#124; getDefaultMessageForAttachments(attachments);</code> | 声明局部标识符 `messageContent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 763 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 764 | <code>        this.stopLingeringSpeech('new-chat-turn');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 765 | <code>        this.setBusy(true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 766 | <code>        this.proactiveCompanion.stop();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 767 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 768 | <code>        if (!hasOverride) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 769 | <code>            this.inputEl.value = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 770 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 771 | <code>        this.addUserMessage(messageContent, attachments);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 772 | <code>        this.messageHistory.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 773 | <code>            role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 774 | <code>            content: messageContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 775 | <code>            attachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 776 | <code>            createdAt: new Date().toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 777 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 778 | <code>        await this.persistConversation();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 779 | <code>        this.proactiveCompanion.noteUserTurn();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 780 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 781 | <code>        const loadingEl = this.addLoadingMessage();</code> | 声明局部标识符 `loadingEl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 782 | <code>        const aiMessageDiv = this.createAIMessage();</code> | 声明局部标识符 `aiMessageDiv`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 783 | <code>        const chunkedSpeechSession = this.createChunkedSpeechSession(aiMessageDiv);</code> | 声明局部标识符 `chunkedSpeechSession`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 784 | <code>        const turn = this.createTurnState('chat');</code> | 声明局部标识符 `turn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 785 | <code>        turn.loadingEl = loadingEl;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 786 | <code>        turn.aiMessageDiv = aiMessageDiv;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 787 | <code>        turn.chunkedSpeechSession = chunkedSpeechSession;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 788 | <code>        const messageHistorySnapshot = this.createMessageHistorySnapshot();</code> | 声明局部标识符 `messageHistorySnapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 789 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 790 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 791 | <code>            const payload = await this.fetchAssistantTurnWithFallback(false, (partialPayload) =&gt; {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 792 | <code>                if (!this.isTurnActive(turn)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 793 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 794 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 795 | <code>                this.removeMessageElement(loadingEl);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 796 | <code>                this.renderStreamingAssistantReply(partialPayload, aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 797 | <code>                this.appendChunkedSpeechProgress(chunkedSpeechSession, partialPayload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 798 | <code>            }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 799 | <code>                messageHistory: messageHistorySnapshot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 800 | <code>                shouldContinue: () =&gt; this.isTurnActive(turn)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 801 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 802 | <code>            if (!this.isTurnActive(turn)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 803 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 804 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 805 | <code>            this.removeMessageElement(loadingEl);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 806 | <code>            const usedChunkedSpeech = await this.finishChunkedSpeechSession(</code> | 声明局部标识符 `usedChunkedSpeech`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 807 | <code>                chunkedSpeechSession,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 808 | <code>                deriveTtsSpeechText(payload, payload.display_text &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 809 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 810 | <code>            if (!this.isTurnActive(turn)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 811 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 812 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 813 | <code>            if (usedChunkedSpeech) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 814 | <code>                this.executeAvatarCue(payload, aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 815 | <code>                this.updateMessageContent(aiMessageDiv, payload.display_text &#124;&#124; payload.speech_text &#124;&#124; '...');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 816 | <code>                this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 817 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 818 | <code>                await this.renderAssistantReply(payload, aiMessageDiv);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 819 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 820 | <code>            this.messageHistory.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 821 | <code>                role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 822 | <code>                content: payload.display_text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 823 | <code>                createdAt: new Date().toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 824 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 825 | <code>            await this.persistConversation();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 826 | <code>            this.proactiveCompanion.noteAssistantTurn();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 827 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 828 | <code>            await chunkedSpeechSession?.cancel?.('chat-turn-error');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 829 | <code>            this.removeMessageElement(loadingEl);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 830 | <code>            this.removeMessageElement(aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 831 | <code>            this.vrmSystem.stopSpeaking();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 832 | <code>            if (!this.isTurnCancelled(turn)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 833 | <code>                this.addSystemMessage(`请求失败：${error.message}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 834 | <code>                console.error('后端请求失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 835 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 836 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 837 | <code>            this.releaseChunkedSpeechSessionWhenDone(chunkedSpeechSession);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 838 | <code>            if (this.activeTurn?.id === turn.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 839 | <code>                this.interruptRequested = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 840 | <code>                this.interruptInFlight = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 841 | <code>                this.setBusy(false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 842 | <code>                const latestMessage = this.messageHistory.at(-1);</code> | 声明局部标识符 `latestMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 843 | <code>                this.startAutoChatTimer(latestMessage?.role === 'assistant' ? 'assistant_turn' : 'chat_finished');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 844 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 845 | <code>            this.releaseTurn(turn);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 846 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 847 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 848 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 849 | <code>    async interruptCurrentTurn() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 850 | <code>        if (!this.isBusy) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 851 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 852 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 853 | <code>                status: 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 854 | <code>                error: '当前没有正在执行的对话。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 855 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 856 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 857 | <code>        if (this.interruptInFlight) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 858 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 859 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 860 | <code>                status: 'interrupt_pending'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 861 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 862 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 863 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 864 | <code>        this.interruptInFlight = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 865 | <code>        this.interruptRequested = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 866 | <code>        const interruptedTurn = this.activeTurn;</code> | 声明局部标识符 `interruptedTurn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 867 | <code>        this.markTurnCancelled(interruptedTurn);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 868 | <code>        if (this.activeTurn?.id === interruptedTurn?.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 869 | <code>            this.activeTurn = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 870 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 871 | <code>        this.vrmSystem.stopSpeaking();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 872 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 873 | <code>            Promise.resolve(this.activeChunkedSpeechSession?.cancel?.('chat_user_interrupt')).catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 874 | <code>                console.warn('分段语音中断失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 875 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 876 | <code>            Promise.resolve(this.audioPlayer?.stop?.()).catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 877 | <code>                console.warn('音频中断失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 878 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 879 | <code>        } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 880 | <code>        this.removeMessageElement(interruptedTurn?.loadingEl);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 881 | <code>        this.removeMessageElement(interruptedTurn?.aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 882 | <code>        this.addSystemMessage('已停止当前回复，后台会继续保存上下文和工具记录。你可以继续发送新消息。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 883 | <code>        this.interruptRequested = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 884 | <code>        this.interruptInFlight = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 885 | <code>        this.setBusy(false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 886 | <code>        this.startAutoChatTimer();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 887 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 888 | <code>        Promise.resolve(this.chatService?.abortCurrentTurn?.({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 889 | <code>            sessionId: this.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 890 | <code>            reason: 'chat_user_interrupt'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 891 | <code>        })).then((result) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 892 | <code>            if (!result?.ok &amp;&amp; result?.status !== 'unsupported' &amp;&amp; result?.status !== 'no_active_run') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 893 | <code>                console.warn('后台中断请求未成功：', result);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 894 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 895 | <code>        }).catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 896 | <code>            console.warn('后台中断请求失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 897 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 898 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 899 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 900 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 901 | <code>            status: 'interrupt_backgrounded',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 902 | <code>            sessionId: this.sessionId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 903 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 904 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 905 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 906 | <code>    async fetchAssistantTurn(isAutoChat = false, onProgress, messageHistory = this.messageHistory, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 907 | <code>        return this.chatService.fetchAssistantTurn({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 908 | <code>            sessionId: this.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 909 | <code>            messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 910 | <code>            is_auto_chat: isAutoChat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 911 | <code>            isAutoChat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 912 | <code>            replyMode: 'stream_text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 913 | <code>            onProgress,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 914 | <code>            proactiveContext: options.proactiveContext &#124;&#124; null</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 915 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 916 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 917 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 918 | <code>    async fetchAssistantTurnWithFallback(isAutoChat = false, onProgress, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 919 | <code>        const replyModes = this.speechProvider?.replyModeFallbackChain &#124;&#124; ['stream_text'];</code> | 声明局部标识符 `replyModes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 920 | <code>        const messageHistory = options.messageHistory &#124;&#124; this.messageHistory;</code> | 声明局部标识符 `messageHistory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 921 | <code>        const shouldContinue = typeof options.shouldContinue === 'function'</code> | 声明局部标识符 `shouldContinue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 922 | <code>            ? options.shouldContinue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 923 | <code>            : () =&gt; true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 924 | <code>        let lastError = null;</code> | 声明局部标识符 `lastError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 925 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 926 | <code>        for (let index = 0; index &lt; replyModes.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 927 | <code>            if (!shouldContinue()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 928 | <code>                throw new Error('turn_cancelled');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 929 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 930 | <code>            const replyMode = replyModes[index];</code> | 声明局部标识符 `replyMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 931 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 932 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 933 | <code>                return await this.chatService.fetchAssistantTurn({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 934 | <code>                    sessionId: this.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 935 | <code>                    messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 936 | <code>                    is_auto_chat: isAutoChat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 937 | <code>                    isAutoChat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 938 | <code>                    replyMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 939 | <code>                    onProgress: replyMode === 'stream_text' ? onProgress : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 940 | <code>                    proactiveContext: options.proactiveContext &#124;&#124; null</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 941 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 942 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 943 | <code>                if (!shouldContinue()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 944 | <code>                    throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 945 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 946 | <code>                lastError = error;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 947 | <code>                console.warn(`语音回复模式 ${replyMode} 失败：`, error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 948 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 949 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 950 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 951 | <code>        throw lastError &#124;&#124; new Error('获取回复失败');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 952 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 953 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 954 | <code>    async renderAssistantReply(payload, aiMessageDiv) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 955 | <code>        const displayText = payload.display_text &#124;&#124; payload.speech_text &#124;&#124; '...';</code> | 声明局部标识符 `displayText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 956 | <code>        const alignment = payload.normalized_alignment &#124;&#124; payload.alignment &#124;&#124; null;</code> | 声明局部标识符 `alignment`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 957 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 958 | <code>        if (payload.streamMode) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 959 | <code>            this.updateMessageContent(aiMessageDiv, displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 960 | <code>            this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 961 | <code>            await this.playPreferredSpeech({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 962 | <code>                payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 963 | <code>                displayText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 964 | <code>                alignment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 965 | <code>                aiMessageDiv</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 966 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 967 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 968 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 969 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 970 | <code>        this.executeAvatarCue(payload, aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 971 | <code>        await this.playPreferredSpeech({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 972 | <code>            payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 973 | <code>            displayText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 974 | <code>            alignment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 975 | <code>            aiMessageDiv</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 976 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 977 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 978 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 979 | <code>    renderStreamingAssistantReply(payload, aiMessageDiv) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 980 | <code>        const displayText = payload.display_text &#124;&#124; payload.speech_text &#124;&#124; '';</code> | 声明局部标识符 `displayText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 981 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 982 | <code>        this.executeAvatarCue(payload, aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 983 | <code>        this.updateMessageContent(aiMessageDiv, displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 984 | <code>        this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 985 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 986 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 987 | <code>    executeAvatarCue(payload, aiMessageDiv) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 988 | <code>        const cueSignature = JSON.stringify({</code> | 声明局部标识符 `cueSignature`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 989 | <code>            surface: getPayloadSurface(payload),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 990 | <code>            action: payload.action &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 991 | <code>            expression: payload.expression &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 992 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 993 | <code>        if (aiMessageDiv?.dataset.surfaceCue === cueSignature) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 994 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 995 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 996 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 997 | <code>        const allowChatMotion = shouldAllowChatMotion(payload);</code> | 声明局部标识符 `allowChatMotion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 998 | <code>        this.vrmSystem.applyPersonaSurfacePayload?.(payload, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 999 | <code>            messageId: aiMessageDiv?.dataset?.messageId &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1000 | <code>            source: 'chat_tts',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1001 | <code>            allowExpressiveMotion: allowChatMotion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1002 | <code>            allowExperimentalMotion: allowChatMotion</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1003 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1004 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1005 | <code>        if (aiMessageDiv) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1006 | <code>            aiMessageDiv.dataset.surfaceCue = cueSignature;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1007 | <code>            aiMessageDiv.dataset.actionCue = payload.action &#124;&#124; '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1008 | <code>            aiMessageDiv.dataset.expressionCue = payload.expression &#124;&#124; '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1009 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1010 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1011 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1012 | <code>    async playPreferredSpeech({ payload, displayText, alignment, aiMessageDiv }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1013 | <code>        const speechText = deriveTtsSpeechText(payload, displayText);</code> | 声明局部标识符 `speechText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1014 | <code>        const speechPayload = {</code> | 声明局部标识符 `speechPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1015 | <code>            ...payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1016 | <code>            speech_text: speechText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1017 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1018 | <code>        if (this.speechProvider?.isSpeechDisabled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1019 | <code>            await this.playFallbackSpeech(displayText, aiMessageDiv, speechPayload, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1020 | <code>                revealText: !payload.streamMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1021 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1022 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1023 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1024 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1025 | <code>        const speechResult = await this.speechProvider?.playSpeech?.({</code> | 声明局部标识符 `speechResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1026 | <code>            payload: speechPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1027 | <code>            displayText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1028 | <code>            alignment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1029 | <code>            audioPlayer: this.audioPlayer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1030 | <code>            vrmSystem: this.vrmSystem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1031 | <code>            updateMessageContent: (text) =&gt; this.updateMessageContent(aiMessageDiv, text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1032 | <code>            scrollToBottom: () =&gt; this.scrollToBottom(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1033 | <code>            onAvatarPlaybackStart: () =&gt; this.startAvatarPlayback(speechPayload, displayText, aiMessageDiv)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1034 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1035 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1036 | <code>        if (speechResult?.played) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1037 | <code>            this.endAvatarSpeech(aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1038 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1039 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1040 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1041 | <code>        this.endAvatarSpeech(aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1042 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1043 | <code>        if (this.speechProvider?.supportsTTS &amp;&amp; !speechResult?.played) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1044 | <code>            const failureMessage = this.speechProvider.getLastTTSFailureMessage();</code> | 声明局部标识符 `failureMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1045 | <code>            if (failureMessage &amp;&amp; !this.hasShownSpeechProviderHint) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1046 | <code>                this.addSystemMessage(t('语音播放暂时不可用：{reason}', { reason: failureMessage }));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1047 | <code>                this.hasShownSpeechProviderHint = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1048 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1049 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1050 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1051 | <code>        if (payload.fallbackMode &#124;&#124; !payload.audio_base64 &#124;&#124; !this.speechProvider?.supportsTTS) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1052 | <code>            await this.playFallbackSpeech(displayText, aiMessageDiv, speechPayload, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1053 | <code>                revealText: !payload.streamMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1054 | <code>                animateMouth: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1055 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1056 | <code>            if (!this.hasShownTextFallbackHint) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1057 | <code>                this.addSystemMessage(t('当前语音服务不可用，已自动切换为纯文本回复。'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1058 | <code>                this.hasShownTextFallbackHint = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1059 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1060 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1061 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1062 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1063 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1064 | <code>            await this.audioPlayer.playSpeech({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1065 | <code>                audioBase64: payload.audio_base64,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1066 | <code>                mimeType: payload.mime_type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1067 | <code>                displayText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1068 | <code>                alignment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1069 | <code>                onTextProgress: (text) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1070 | <code>                    this.updateMessageContent(aiMessageDiv, text &#124;&#124; '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1071 | <code>                    this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1072 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1073 | <code>                onPlaybackStart: () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1074 | <code>                    if (alignment?.characters?.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1075 | <code>                        this.updateMessageContent(aiMessageDiv, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1076 | <code>                    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1077 | <code>                        this.updateMessageContent(aiMessageDiv, displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1078 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1079 | <code>                    this.startAvatarPlayback(speechPayload, displayText, aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1080 | <code>                    this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1081 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1082 | <code>                onPlaybackEnd: () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1083 | <code>                    this.endAvatarSpeech(aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1084 | <code>                    this.updateMessageContent(aiMessageDiv, displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1085 | <code>                    this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1086 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1087 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1088 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1089 | <code>            this.updateMessageContent(aiMessageDiv, displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1090 | <code>            this.vrmSystem.stopSpeaking();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1091 | <code>            this.endAvatarSpeech(aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1092 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1093 | <code>            this.showAutoplayHintOnce(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1094 | <code>            console.error('音频播放失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1095 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1096 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1097 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1098 | <code>    async playFallbackSpeech(displayText, aiMessageDiv, payload = {}, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1099 | <code>        const speechText = deriveTtsSpeechText(payload, displayText);</code> | 声明局部标识符 `speechText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1100 | <code>        const durationMs = Math.min(</code> | 声明局部标识符 `durationMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1101 | <code>            CONFIG.TEXT_ONLY_SPEECH_MAX_MS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1102 | <code>            Math.max(CONFIG.TEXT_ONLY_SPEECH_MIN_MS, (speechText &#124;&#124; displayText).length * CONFIG.TEXT_ONLY_SPEECH_CHAR_MS)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1103 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1104 | <code>        const revealText = options.revealText !== false;</code> | 声明局部标识符 `revealText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1105 | <code>        const animateMouth = options.animateMouth !== false;</code> | 声明局部标识符 `animateMouth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1107 | <code>        if (animateMouth) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1108 | <code>            this.vrmSystem.startFallbackSpeech();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1109 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1110 | <code>            this.vrmSystem.stopSpeaking();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1111 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1112 | <code>        this.executeAvatarCue(payload, aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1113 | <code>        if (animateMouth) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1114 | <code>            this.startAvatarSpeech({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1115 | <code>                ...payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1116 | <code>                speech_text: speechText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1117 | <code>            }, displayText, aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1118 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1120 | <code>        if (!revealText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1121 | <code>            this.updateMessageContent(aiMessageDiv, displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1122 | <code>            this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1123 | <code>            await new Promise((resolve) =&gt; window.setTimeout(resolve, durationMs));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1124 | <code>            if (animateMouth) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1125 | <code>                this.vrmSystem.stopSpeaking();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1126 | <code>                this.endAvatarSpeech(aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1127 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1128 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1129 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1131 | <code>        await new Promise((resolve) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1132 | <code>            const startTime = performance.now();</code> | 声明局部标识符 `startTime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1134 | <code>            const renderFrame = (now) =&gt; {</code> | 声明局部标识符 `renderFrame`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1135 | <code>                const elapsedMs = now - startTime;</code> | 声明局部标识符 `elapsedMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1136 | <code>                const progress = Math.min(1, elapsedMs / durationMs);</code> | 声明局部标识符 `progress`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1137 | <code>                const visibleLength = Math.max(1, Math.round(displayText.length * progress));</code> | 声明局部标识符 `visibleLength`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1139 | <code>                this.updateMessageContent(aiMessageDiv, displayText.slice(0, visibleLength));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1140 | <code>                this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1142 | <code>                if (progress &gt;= 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1143 | <code>                    resolve();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1144 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1145 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1147 | <code>                window.requestAnimationFrame(renderFrame);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1148 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1150 | <code>            window.requestAnimationFrame(renderFrame);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1151 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1153 | <code>        if (animateMouth) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1154 | <code>            this.vrmSystem.stopSpeaking();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1155 | <code>            this.endAvatarSpeech(aiMessageDiv);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1156 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1157 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1159 | <code>    showAutoplayHintOnce(error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1160 | <code>        if (this.hasShownAutoplayHint) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1161 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1162 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1164 | <code>        const errorMessage = String(error?.message &#124;&#124; error &#124;&#124; '').toLowerCase();</code> | 声明局部标识符 `errorMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1165 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1166 | <code>            errorMessage.includes('gesture') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1167 | <code>            errorMessage.includes('interact') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1168 | <code>            errorMessage.includes('play')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1169 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1170 | <code>            this.addSystemMessage('浏览器还没解锁音频，请先点击页面任意位置，再试一次语音播放。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1171 | <code>            this.hasShownAutoplayHint = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1172 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1173 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1175 | <code>    createAIMessage() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1176 | <code>        const div = document.createElement('div');</code> | 声明局部标识符 `div`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1177 | <code>        div.className = 'message-item message-ai';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1178 | <code>        div.dataset.surfaceCue = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1179 | <code>        div.dataset.actionCue = '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1180 | <code>        div.dataset.expressionCue = '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1181 | <code>        div.dataset.contentFormat = 'markdown';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1182 | <code>        div.__ailisMessageContent = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1183 | <code>        this.messageListEl.appendChild(div);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1184 | <code>        this.notifyMessageAdded(div, 'assistant');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1185 | <code>        this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1186 | <code>        return div;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1187 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1189 | <code>    addUserMessage(content, attachments = []) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1190 | <code>        const div = document.createElement('div');</code> | 声明局部标识符 `div`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1191 | <code>        div.className = 'message-item message-user';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1192 | <code>        div.__ailisAttachments = normalizeChatAttachments(attachments);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1193 | <code>        this.renderMessageContent(div, buildAttachmentHint(content, div.__ailisAttachments), 'markdown');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1194 | <code>        this.messageListEl.appendChild(div);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1195 | <code>        this.notifyMessageAdded(div, 'user');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1196 | <code>        this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1197 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1199 | <code>    addSystemMessage(content) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1200 | <code>        const div = document.createElement('div');</code> | 声明局部标识符 `div`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1201 | <code>        div.className = 'message-item message-system';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1202 | <code>        this.renderMessageContent(div, content, 'markdown');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1203 | <code>        this.messageListEl.appendChild(div);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1204 | <code>        this.notifyMessageAdded(div, 'system');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1205 | <code>        this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1206 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1208 | <code>    addLoadingMessage() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1209 | <code>        const div = document.createElement('div');</code> | 声明局部标识符 `div`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1210 | <code>        div.className = 'message-loading';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1211 | <code>        this.renderMessageContent(div, t('AILIS正在思考...'), 'text');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1212 | <code>        this.messageListEl.appendChild(div);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1213 | <code>        this.notifyMessageAdded(div, 'loading');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1214 | <code>        this.scrollToBottom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1215 | <code>        return div;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1216 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1218 | <code>    scrollToBottom() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1219 | <code>        this.messageListEl.scrollTop = this.messageListEl.scrollHeight;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。”这一文件职责。 |
| 1220 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1221 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
