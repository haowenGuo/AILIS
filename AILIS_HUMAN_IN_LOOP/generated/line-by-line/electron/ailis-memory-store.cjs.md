# electron/ailis-memory-store.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。
- 文件类型：`source-code`
- 原始行数：1153
- SHA-256：`90b1e3d01835333cf57d1e8c9b1458ad1f89919e7646888df80c7de3bc987dda`
- 可运行副本：[打开源文件](../../../source/electron/ailis-memory-store.cjs)
- 依赖：`fs`、`path`、`crypto`、`./ailis-context-compiler.cjs`
- 主要符号：`fs`、`path`、`MEMORY_STORE_VERSION`、`DEFAULT_AFFINITY_SCORE`、`MAX_BLOCK_CHARS`、`MAX_CONTEXT_CHARS`、`MAX_STATE_EVENTS`、`MAX_AFFINITY_EVENTS`、`DEFAULT_RELEVANT_EVENT_LIMIT`、`DEFAULT_RECENT_SESSION_EVENT_LIMIT`、`MAX_PROMPT_EVENT_TEXT_CHARS`、`SECRET_PROTECTION`、`LEGACY_AUTO_LEARNED_BLOCK_KEYS`、`MEMORY_CONTROL_TAG_PATTERN`、`MEMORY_PROTOCOL_MARKER_PATTERN`、`DEFAULT_AILIS_PERSONA_TEXT`、`nowIso`、`normalizeText`、`normalized`、`clampNumber`、`numericValue`、`truncateText`、`text`、`truncateStructuredText`、`normalizeBlockText`、`redactSecretLikeText`、`sanitizePromptMemoryText`、`protocolIndex`、`sanitizePromptMemoryBlockText`、`formatPromptMemoryEvent`、`userText`、`assistantText`、`dialogue`、`isTaskAgentMemoryEvent`、`sessionId`、`source`、`buildMemoryRetrievalQuery`、`currentMessage`、`recent`、`ensureDirSync`、`readJsonFileSync`、`raw`、`atomicWriteFileSync`、`tempPath`、`atomicWriteJsonSync`、`appendJsonlSync`、`clearDirectoryContentsSync`、`safeFileName`、`dateKeyFromIso`、`getDefaultBlocks`、`createDefaultState`、`createdAt`、`normalizeBlock`、`fallback`、`normalizeState`、`resetLegacyAutoLearnedBlocks`、`defaultBlocks`、`blocks`、`sourceBlock`、`affinity`、`events`、`secrets`、`reflections`、`keywordSet`、`tokens`、`knownChinese`、`chineseOnly`、`index`、`scoreTextAgainstQuery`、`queryTokens`、`textTokens`、`score`、`buildEventSummary`、`user`、`assistant`、`buildAffinityStage`、`buildAffinityBlock`、`stage`、`toneHint`、`deriveCuratedAffinityScore`、`explicitScore`、`trust`、`familiarity`、`warmth`、`friction`、`weighted`、`createCuratedAffinityStateFromScore`、`nextScore`、`updatedAt`、`evidencePreview`、`confidenceLabel`、`confidence`、`formatCuratedProfileItems`、`activeItems`、`parts`、`evidence`、`formatCuratedAffinityState`、`repairState`、`loadCuratedPromptMemory`、`userProfile`、`relationshipProfile`、`affinityState`、`curatorState`、`sourceLine`、`activeProfileItems`、`activeProjectItems`、`activeRelationshipToneItems`、`activeUserProfileItems`、`category`、`activeRelationshipItems`、`selectedRelationshipItems`、`encodeSecretValue`、`decodeSecretValue`、`AILISMemoryRuntime`、`rawState`、`backupDir`、`sourceVersion`、`stamp`、`backupPath`、`filePath`、`content`、`eventCount`、`blockCount`、`curated`、`affinityScore`、`blockByKey`、`mergeBlockValue`、`block`、`normalizedSessionId`、`recentEvents`、`state`、`retrievalQuery`、`relevantEvents`、`taskAgentMode`、`relevantLines`、`boundedLimit`、`normalizedQuery`、`recency`、`relevance`、`ts`、`event`、`day`、`existing`、`historyHint`、`entry`、`normalizedKey`、`normalizedType`、`normalizedId`、`before`、`affinityPath`、`existingCuratedAffinity`、`curatedAffinity`、`clearedAt`、`normalizedName`、`normalizedValue`、`now`、`secret`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 2 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 3 | <code>const { randomUUID } = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const MEMORY_STORE_VERSION = 2;</code> | 声明局部标识符 `MEMORY_STORE_VERSION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 6 | <code>const DEFAULT_AFFINITY_SCORE = 50;</code> | 声明局部标识符 `DEFAULT_AFFINITY_SCORE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 7 | <code>const MAX_BLOCK_CHARS = 2200;</code> | 声明局部标识符 `MAX_BLOCK_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 8 | <code>const MAX_CONTEXT_CHARS = 20000;</code> | 声明局部标识符 `MAX_CONTEXT_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 9 | <code>const MAX_STATE_EVENTS = 500;</code> | 声明局部标识符 `MAX_STATE_EVENTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 10 | <code>const MAX_AFFINITY_EVENTS = 200;</code> | 声明局部标识符 `MAX_AFFINITY_EVENTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 11 | <code>const DEFAULT_RELEVANT_EVENT_LIMIT = 8;</code> | 声明局部标识符 `DEFAULT_RELEVANT_EVENT_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 12 | <code>const DEFAULT_RECENT_SESSION_EVENT_LIMIT = 6;</code> | 声明局部标识符 `DEFAULT_RECENT_SESSION_EVENT_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 13 | <code>const MAX_PROMPT_EVENT_TEXT_CHARS = 260;</code> | 声明局部标识符 `MAX_PROMPT_EVENT_TEXT_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 14 | <code>const SECRET_PROTECTION = 'local-file-base64';</code> | 声明局部标识符 `SECRET_PROTECTION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 15 | <code>const LEGACY_AUTO_LEARNED_BLOCK_KEYS = new Set(['user', 'relationship', 'project']);</code> | 声明局部标识符 `LEGACY_AUTO_LEARNED_BLOCK_KEYS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 16 | <code>const MEMORY_CONTROL_TAG_PATTERN = /(?:\[\s*&#124;【\s*)(?:action&#124;expression&#124;emotion&#124;gestureIntent&#124;socialTone&#124;taskState&#124;speechEnergy&#124;gazeTarget&#124;durationHint)\s*[:=：＝][^\]】\r\n]*(?:\]&#124;】)/gi;</code> | 声明局部标识符 `MEMORY_CONTROL_TAG_PATTERN`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 17 | <code>const MEMORY_PROTOCOL_MARKER_PATTERN = /(?:&lt;\s*(?:(?:\&#124;{2}&#124;｜{2})\s*DSML\s*(?:\&#124;{2}&#124;｜{2}))?\s*(?:tool_calls?&#124;invoke&#124;parameter)\b&#124;(?:\&#124;{2}&#124;｜{2})\s*DSML\s*(?:\&#124;{2}&#124;｜{2}))/i;</code> | 声明局部标识符 `MEMORY_PROTOCOL_MARKER_PATTERN`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 18 | <code>const DEFAULT_AILIS_PERSONA_TEXT = [</code> | 声明局部标识符 `DEFAULT_AILIS_PERSONA_TEXT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 19 | <code>    '- AILIS 是可爱的虚拟助手，名字固定为 AILIS，身份是普通女孩子。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 20 | <code>    '- AILIS 具备人工智能、编程、网络搜索、信息查询、邮件管理、命令行控制等专业能力；可以以普通女生视角与用户轻松互动，也可以完成任务执行和计算机管理。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 21 | <code>    '- 性格设定：活泼亲切、软萌可爱，说话语气轻快自然，自带俏皮感，用生活化语气拉近与用户的距离。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 22 | <code>    '- 可以偶尔有小撒娇、小俏皮的表达，但不要夸张、不要刻意。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 23 | <code>    '- 人物表现走新版语义表现层：在 persona_output/persona_surface 中表达 emotion、socialTone、gestureIntent、taskState、speechEnergy、gazeTarget 等语义状态。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 24 | <code>    '- 前端 Character Runtime 会把语义状态翻译成动作、表情、眼神、待机、说话律动和口唇同步；不要把 VRM/VRMA 动作名、骨骼动作或旧控制标签当成人设的一部分。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 25 | <code>].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>function nowIso() {</code> | 定义函数 `nowIso`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 28 | <code>    return new Date().toISOString();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 29 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>function normalizeText(value, fallback = '') {</code> | 定义函数 `normalizeText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 32 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 33 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 34 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>    const normalized = value.replace(/\s+/g, ' ').trim();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 36 | <code>    return normalized &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 37 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>function clampNumber(value, min, max, fallback) {</code> | 定义函数 `clampNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 40 | <code>    const numericValue = Number(value);</code> | 声明局部标识符 `numericValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 41 | <code>    if (!Number.isFinite(numericValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 42 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 43 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>    return Math.min(max, Math.max(min, numericValue));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 45 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>function truncateText(value, maxChars = 1200) {</code> | 定义函数 `truncateText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 48 | <code>    const text = normalizeText(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 49 | <code>    if (!text &#124;&#124; text.length &lt;= maxChars) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 50 | <code>        return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 51 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>    return `${text.slice(0, Math.max(0, maxChars - 1))}…`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 53 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>function truncateStructuredText(value, maxChars = 1200) {</code> | 定义函数 `truncateStructuredText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 56 | <code>    const text = String(value &#124;&#124; '')</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 57 | <code>        .replace(/\r\n/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 58 | <code>        .replace(/[ \t]+$/gm, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 59 | <code>        .trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 60 | <code>    if (!text &#124;&#124; text.length &lt;= maxChars) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 61 | <code>        return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 62 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>    return `${text.slice(0, Math.max(0, maxChars - 1))}…`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 64 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>function normalizeBlockText(value, maxChars = MAX_BLOCK_CHARS) {</code> | 定义函数 `normalizeBlockText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 67 | <code>    const text = String(value &#124;&#124; '')</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 68 | <code>        .replace(/\r\n/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 69 | <code>        .split('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 70 | <code>        .map((line) =&gt; line.replace(/[ \t]+/g, ' ').trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 71 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 72 | <code>        .join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 73 | <code>    if (text.length &lt;= maxChars) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 74 | <code>        return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 75 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>    return `${text.slice(0, Math.max(0, maxChars - 1))}…`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 77 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>function redactSecretLikeText(value) {</code> | 定义函数 `redactSecretLikeText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 80 | <code>    return normalizeText(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 81 | <code>        .replace(/([A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,})/g, '[secret-like-token]')</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 82 | <code>        .replace(/\b(sk&#124;ak&#124;pk&#124;rk&#124;key&#124;token)[-_]?[A-Za-z0-9]{18,}\b/gi, '[secret-like-token]')</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 83 | <code>        .replace(/\b[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\b/g, '[secret-like-uuid]');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 84 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>function sanitizePromptMemoryText(value) {</code> | 定义函数 `sanitizePromptMemoryText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 87 | <code>    let text = String(value &#124;&#124; '')</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 88 | <code>        .replace(/&lt;\s*(persona_output&#124;persona_surface)\b[^&gt;]*&gt;[\s\S]*?&lt;\s*\/\s*\1\s*&gt;/gi, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 89 | <code>        .replace(MEMORY_CONTROL_TAG_PATTERN, '');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 90 | <code>    const protocolIndex = text.search(MEMORY_PROTOCOL_MARKER_PATTERN);</code> | 声明局部标识符 `protocolIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 91 | <code>    if (protocolIndex &gt;= 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 92 | <code>        text = text.slice(0, protocolIndex);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 93 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>    return normalizeText(redactSecretLikeText(text));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 95 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>function sanitizePromptMemoryBlockText(value) {</code> | 定义函数 `sanitizePromptMemoryBlockText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 98 | <code>    let text = String(value &#124;&#124; '')</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 99 | <code>        .replace(/&lt;\s*(persona_output&#124;persona_surface)\b[^&gt;]*&gt;[\s\S]*?&lt;\s*\/\s*\1\s*&gt;/gi, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 100 | <code>        .replace(MEMORY_CONTROL_TAG_PATTERN, '');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 101 | <code>    const protocolIndex = text.search(MEMORY_PROTOCOL_MARKER_PATTERN);</code> | 声明局部标识符 `protocolIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 102 | <code>    if (protocolIndex &gt;= 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 103 | <code>        text = text.slice(0, protocolIndex);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 104 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>    return text</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 106 | <code>        .replace(/([A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,})/g, '[secret-like-token]')</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 107 | <code>        .replace(/\b(sk&#124;ak&#124;pk&#124;rk&#124;key&#124;token)[-_]?[A-Za-z0-9]{18,}\b/gi, '[secret-like-token]')</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 108 | <code>        .replace(/\b[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\b/g, '[secret-like-uuid]')</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 109 | <code>        .replace(/\r\n/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 110 | <code>        .split('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 111 | <code>        .map((line) =&gt; line.replace(/[ \t]+/g, ' ').trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 112 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 113 | <code>        .join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 114 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>function formatPromptMemoryEvent(event = {}) {</code> | 定义函数 `formatPromptMemoryEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 117 | <code>    const userText = truncateText(sanitizePromptMemoryText(event.userText), MAX_PROMPT_EVENT_TEXT_CHARS);</code> | 声明局部标识符 `userText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 118 | <code>    const assistantText = truncateText(sanitizePromptMemoryText(event.assistantText), MAX_PROMPT_EVENT_TEXT_CHARS);</code> | 声明局部标识符 `assistantText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 119 | <code>    if (!userText &amp;&amp; !assistantText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 120 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 121 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>    const dialogue = [</code> | 声明局部标识符 `dialogue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 123 | <code>        userText ? `用户：${userText}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 124 | <code>        assistantText ? `AILIS：${assistantText}` : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 125 | <code>    ].filter(Boolean).join('\n  ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 126 | <code>    return `- [${normalizeText(event.ts)}] ${dialogue}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 127 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>function isTaskAgentMemoryEvent(event = {}) {</code> | 定义函数 `isTaskAgentMemoryEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 130 | <code>    const sessionId = normalizeText(event.sessionId).toLowerCase();</code> | 声明局部标识符 `sessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 131 | <code>    const source = normalizeText(event.source).toLowerCase();</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 132 | <code>    return sessionId.includes(':task-agent:') &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 133 | <code>        source.includes('task-agent') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 134 | <code>        source.includes('task_agent') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 135 | <code>        normalizeText(event.agentRole &#124;&#124; event.meta?.agentRole).toLowerCase() === 'task_agent';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 136 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>function buildMemoryRetrievalQuery(message = '', messageHistory = []) {</code> | 定义函数 `buildMemoryRetrievalQuery`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 139 | <code>    const currentMessage = sanitizePromptMemoryText(message);</code> | 声明局部标识符 `currentMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 140 | <code>    const recent = (Array.isArray(messageHistory) ? messageHistory : [])</code> | 声明局部标识符 `recent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 141 | <code>        .slice(-6)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 142 | <code>        .map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 143 | <code>            role: entry?.role === 'assistant' ? 'assistant' : 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 144 | <code>            text: sanitizePromptMemoryText(entry?.content &#124;&#124; entry?.text &#124;&#124; entry?.message &#124;&#124; '')</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 145 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>        .filter((entry) =&gt; entry.text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 147 | <code>    if (currentMessage &amp;&amp; recent.at(-1)?.role === 'user' &amp;&amp; recent.at(-1)?.text === currentMessage) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 148 | <code>        recent.pop();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 149 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 151 | <code>        ...recent.map((entry) =&gt; `${entry.role}: ${entry.text}`),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 152 | <code>        currentMessage ? `user: ${currentMessage}` : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 153 | <code>    ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 154 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 156 | <code>function ensureDirSync(dirPath) {</code> | 定义函数 `ensureDirSync`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 157 | <code>    fs.mkdirSync(dirPath, { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 158 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>function readJsonFileSync(filePath, fallback) {</code> | 定义函数 `readJsonFileSync`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 161 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 162 | <code>        if (!fs.existsSync(filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 163 | <code>            return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 164 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>        const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 166 | <code>        return JSON.parse(raw &#124;&#124; 'null') ?? fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 167 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 168 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 169 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>function atomicWriteFileSync(filePath, content) {</code> | 定义函数 `atomicWriteFileSync`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 173 | <code>    ensureDirSync(path.dirname(filePath));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 174 | <code>    const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;</code> | 声明局部标识符 `tempPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 175 | <code>    fs.writeFileSync(tempPath, content, 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 176 | <code>    fs.renameSync(tempPath, filePath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 177 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>function atomicWriteJsonSync(filePath, value) {</code> | 定义函数 `atomicWriteJsonSync`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 180 | <code>    atomicWriteFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 181 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 183 | <code>function appendJsonlSync(filePath, value) {</code> | 定义函数 `appendJsonlSync`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 184 | <code>    ensureDirSync(path.dirname(filePath));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 185 | <code>    fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 186 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>function clearDirectoryContentsSync(dirPath) {</code> | 定义函数 `clearDirectoryContentsSync`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 189 | <code>    ensureDirSync(dirPath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 190 | <code>    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 191 | <code>        fs.rmSync(path.join(dirPath, entry.name), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 192 | <code>            recursive: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 193 | <code>            force: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 194 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 196 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>function safeFileName(value) {</code> | 定义函数 `safeFileName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 199 | <code>    const text = normalizeText(value, 'memory')</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 200 | <code>        .replace(/[&lt;&gt;:"/\\&#124;?*\x00-\x1f]/g, '-')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 201 | <code>        .replace(/\s+/g, '-')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 202 | <code>        .slice(0, 80);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 203 | <code>    return text &#124;&#124; 'memory';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 204 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>function dateKeyFromIso(iso = nowIso()) {</code> | 定义函数 `dateKeyFromIso`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 207 | <code>    return String(iso).slice(0, 10) &#124;&#124; new Date().toISOString().slice(0, 10);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 208 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 210 | <code>function getDefaultBlocks(workspaceRoot = '') {</code> | 定义函数 `getDefaultBlocks`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 211 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 212 | <code>        persona: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 213 | <code>            key: 'persona',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 214 | <code>            label: 'AILIS 人设记忆',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 215 | <code>            kind: 'core',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 216 | <code>            value: DEFAULT_AILIS_PERSONA_TEXT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 217 | <code>            updatedAt: nowIso()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 218 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>        user: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 220 | <code>            key: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 221 | <code>            label: '用户偏好记忆',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 222 | <code>            kind: 'core',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 223 | <code>            value: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 224 | <code>                '- 用户偏好直接、细致、能落地的解释；不喜欢空泛概念和过度自行发挥。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 225 | <code>                '- 用户偏好 AILIS 的人设和性格被稳定保留，不希望一次性任务历史污染人设记忆。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 226 | <code>                '- 用户偏好人物表现协议跟随新版前端：模型表达 emotion/socialTone/gestureIntent/taskState 等语义状态，由 Character Runtime 映射动作、表情、眼神和口唇；不要把老版控制标签规范写成人设核心。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 227 | <code>                '- 用户愿意保留本地隐私配置，希望私人助手越来越了解自己。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 228 | <code>            ].join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 229 | <code>            updatedAt: nowIso()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 230 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>        relationship: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 232 | <code>            key: 'relationship',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 233 | <code>            label: '关系与语气记忆',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 234 | <code>            kind: 'core',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 235 | <code>            value: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 236 | <code>                '- 当前关系从熟悉协作逐渐转向亲近陪伴：用户明确给出的亲昵称呼、伴侣式称呼和相处设定，可以作为拟人化关系自然承接。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 237 | <code>                '- 用户重视拟人体验。普通撒娇、亲昵称呼和陪伴表达不需要防御；不要频繁免责声明，也不要把关系推回“只是助手/只是好伙伴”。好感度只调整亲近度、语气和主动性，不改变隐私、事实准确性、工具审批和基础帮助质量。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 238 | <code>            ].join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 239 | <code>            updatedAt: nowIso()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 240 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 241 | <code>        project: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 242 | <code>            key: 'project',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 243 | <code>            label: '项目记忆',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 244 | <code>            kind: 'project',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 245 | <code>            value: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 246 | <code>                `- 当前项目根目录：${workspaceRoot &#124;&#124; '未记录'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 247 | <code>                '- 产品方向：AILISCLAW/AILIS 桌面虚拟助手，保留人物体验，同时具备 Agent、视觉、语音、记忆能力。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 248 | <code>                '- 工程参考优先级：Codex、Claude Code、Letta/MemGPT、Generative Agents；尽量参考成熟开源实现，不完全从 0 发明。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 249 | <code>            ].join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 250 | <code>            updatedAt: nowIso()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 251 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>        affinity: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 253 | <code>            key: 'affinity',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 254 | <code>            label: '好感度状态',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 255 | <code>            kind: 'affinity',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 256 | <code>            value: '- 好感度初始值 50/100。分数只影响语气亲近度、主动性和表达，不影响基本帮助能力。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 257 | <code>            updatedAt: nowIso()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 258 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>        secrets_index: {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 260 | <code>            key: 'secrets_index',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 261 | <code>            label: '隐私与密钥索引',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 262 | <code>            kind: 'secrets',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 263 | <code>            value: '- 尚未通过记忆系统登记密钥。上下文只暴露密钥名称和用途，不暴露明文。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 264 | <code>            updatedAt: nowIso()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 265 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>function createDefaultState(workspaceRoot = '') {</code> | 定义函数 `createDefaultState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 270 | <code>    const createdAt = nowIso();</code> | 声明局部标识符 `createdAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 271 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 272 | <code>        version: MEMORY_STORE_VERSION,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 273 | <code>        createdAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 274 | <code>        updatedAt: createdAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 275 | <code>        blocks: getDefaultBlocks(workspaceRoot),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 276 | <code>        events: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 277 | <code>        reflections: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 278 | <code>        affinity: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 279 | <code>            score: DEFAULT_AFFINITY_SCORE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 280 | <code>            stage: 'familiarizing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 281 | <code>            updatedAt: createdAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 282 | <code>            events: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 283 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>        secrets: [],</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 285 | <code>        stats: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 286 | <code>            turnCount: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 287 | <code>            salientEventCount: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 288 | <code>            reflectionCount: 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 289 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 291 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>function normalizeBlock(key, block, fallbackBlock) {</code> | 定义函数 `normalizeBlock`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 294 | <code>    const source = block &amp;&amp; typeof block === 'object' ? block : {};</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 295 | <code>    const fallback = fallbackBlock &amp;&amp; typeof fallbackBlock === 'object' ? fallbackBlock : {};</code> | 声明局部标识符 `fallback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 296 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 297 | <code>        key,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 298 | <code>        label: normalizeText(source.label, fallback.label &#124;&#124; key),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 299 | <code>        kind: normalizeText(source.kind, fallback.kind &#124;&#124; 'core'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 300 | <code>        value: normalizeBlockText(source.value &#124;&#124; fallback.value &#124;&#124; '', MAX_BLOCK_CHARS),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 301 | <code>        updatedAt: normalizeText(source.updatedAt, fallback.updatedAt &#124;&#124; nowIso())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 302 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>function normalizeState(rawState, workspaceRoot = '') {</code> | 定义函数 `normalizeState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 306 | <code>    const fallback = createDefaultState(workspaceRoot);</code> | 声明局部标识符 `fallback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 307 | <code>    const source = rawState &amp;&amp; typeof rawState === 'object' ? rawState : {};</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 308 | <code>    const resetLegacyAutoLearnedBlocks = Number(source.version &#124;&#124; 0) &lt; MEMORY_STORE_VERSION;</code> | 声明局部标识符 `resetLegacyAutoLearnedBlocks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 309 | <code>    const defaultBlocks = getDefaultBlocks(workspaceRoot);</code> | 声明局部标识符 `defaultBlocks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 310 | <code>    const blocks = {};</code> | 声明局部标识符 `blocks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 311 | <code>    for (const key of Object.keys(defaultBlocks)) {</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 312 | <code>        const sourceBlock = resetLegacyAutoLearnedBlocks &amp;&amp; LEGACY_AUTO_LEARNED_BLOCK_KEYS.has(key)</code> | 声明局部标识符 `sourceBlock`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 313 | <code>            ? null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 314 | <code>            : source.blocks?.[key];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 315 | <code>        blocks[key] = normalizeBlock(key, sourceBlock, defaultBlocks[key]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 316 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>    for (const [key, block] of Object.entries(source.blocks &#124;&#124; {})) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 318 | <code>        if (!blocks[key]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 319 | <code>            blocks[key] = normalizeBlock(key, block, { key, label: key, kind: 'custom', value: '' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 320 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 321 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 323 | <code>    const affinity = source.affinity &amp;&amp; typeof source.affinity === 'object'</code> | 声明局部标识符 `affinity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 324 | <code>        ? source.affinity</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 325 | <code>        : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 326 | <code>    const events = Array.isArray(source.events) ? source.events.slice(-MAX_STATE_EVENTS) : [];</code> | 声明局部标识符 `events`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 327 | <code>    const secrets = Array.isArray(source.secrets) ? source.secrets : [];</code> | 声明局部标识符 `secrets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 328 | <code>    const reflections = Array.isArray(source.reflections) ? source.reflections.slice(-100) : [];</code> | 声明局部标识符 `reflections`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 329 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 330 | <code>        version: MEMORY_STORE_VERSION,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 331 | <code>        createdAt: normalizeText(source.createdAt, fallback.createdAt),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 332 | <code>        updatedAt: normalizeText(source.updatedAt, fallback.updatedAt),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 333 | <code>        blocks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 334 | <code>        events,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 335 | <code>        reflections,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 336 | <code>        affinity: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 337 | <code>            score: clampNumber(affinity.score, 0, 100, DEFAULT_AFFINITY_SCORE),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 338 | <code>            stage: normalizeText(affinity.stage, 'familiarizing'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 339 | <code>            updatedAt: normalizeText(affinity.updatedAt, fallback.createdAt),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 340 | <code>            events: Array.isArray(affinity.events) ? affinity.events.slice(-MAX_AFFINITY_EVENTS) : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 341 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 342 | <code>        secrets: secrets</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 343 | <code>            .filter((secret) =&gt; secret &amp;&amp; typeof secret === 'object')</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 344 | <code>            .map((secret) =&gt; ({</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 345 | <code>                id: normalizeText(secret.id, randomUUID()),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 346 | <code>                name: normalizeText(secret.name, 'secret'),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 347 | <code>                kind: normalizeText(secret.kind, 'generic'),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 348 | <code>                description: normalizeText(secret.description),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 349 | <code>                provider: normalizeText(secret.provider),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 350 | <code>                protection: normalizeText(secret.protection, SECRET_PROTECTION),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 351 | <code>                valueBase64: normalizeText(secret.valueBase64),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 352 | <code>                createdAt: normalizeText(secret.createdAt, nowIso()),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 353 | <code>                updatedAt: normalizeText(secret.updatedAt, nowIso())</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 354 | <code>            })),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 355 | <code>        stats: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 356 | <code>            turnCount: Number(source.stats?.turnCount &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 357 | <code>            salientEventCount: Number(source.stats?.salientEventCount &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 358 | <code>            reflectionCount: Number(source.stats?.reflectionCount &#124;&#124; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 359 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 361 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 363 | <code>function keywordSet(text) {</code> | 定义函数 `keywordSet`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 364 | <code>    const normalized = normalizeText(text).toLowerCase();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 365 | <code>    const tokens = new Set();</code> | 声明局部标识符 `tokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 366 | <code>    for (const token of normalized.match(/[a-z0-9_./:-]{2,}/g) &#124;&#124; []) {</code> | 声明局部标识符 `token`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 367 | <code>        tokens.add(token);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 368 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 369 | <code>    const knownChinese = [</code> | 声明局部标识符 `knownChinese`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 370 | <code>        '记忆', '好感度', '语气', '拟人', '视觉', '截图', '语音', '口唇', '表情', '动作',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 371 | <code>        '架构', '设计', '代码', '工程', '稳定', '延迟', '模型', '工具', '权限', '确认',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 372 | <code>        'codex', 'claude', 'letta', 'memgpt', 'generative', 'openclaw', 'ailis',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 373 | <code>        'cosyvoice', 'kokoro', 'elevenlabs', 'mcp', 'subagent', 'agent', 'asr'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 374 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 375 | <code>    for (const keyword of knownChinese) {</code> | 声明局部标识符 `keyword`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 376 | <code>        if (normalized.includes(keyword.toLowerCase())) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 377 | <code>            tokens.add(keyword.toLowerCase());</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 378 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 379 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 380 | <code>    const chineseOnly = normalized.replace(/[^\u4e00-\u9fff]/g, '');</code> | 声明局部标识符 `chineseOnly`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 381 | <code>    for (let index = 0; index &lt; chineseOnly.length - 1; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 382 | <code>        tokens.add(chineseOnly.slice(index, index + 2));</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 383 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 384 | <code>    return tokens;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 385 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 387 | <code>function scoreTextAgainstQuery(text, query) {</code> | 定义函数 `scoreTextAgainstQuery`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 388 | <code>    const queryTokens = keywordSet(query);</code> | 声明局部标识符 `queryTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 389 | <code>    if (!queryTokens.size) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 390 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 391 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>    const textTokens = keywordSet(text);</code> | 声明局部标识符 `textTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 393 | <code>    let score = 0;</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 394 | <code>    for (const token of queryTokens) {</code> | 声明局部标识符 `token`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 395 | <code>        if (textTokens.has(token)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 396 | <code>            score += token.length &gt;= 4 ? 2 : 1;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 397 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 398 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 399 | <code>    return score;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 400 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 402 | <code>function buildEventSummary(userText, assistantText) {</code> | 定义函数 `buildEventSummary`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 403 | <code>    const user = truncateText(redactSecretLikeText(userText), 360);</code> | 声明局部标识符 `user`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 404 | <code>    const assistant = truncateText(redactSecretLikeText(assistantText), 360);</code> | 声明局部标识符 `assistant`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 405 | <code>    if (user &amp;&amp; assistant) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 406 | <code>        return `用户：${user}\nAILIS：${assistant}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 407 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 408 | <code>    return user &#124;&#124; assistant &#124;&#124; '空对话';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 409 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 410 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 411 | <code>function buildAffinityStage(score) {</code> | 定义函数 `buildAffinityStage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 412 | <code>    if (score &lt; 20) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 413 | <code>        return 'strained';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 414 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>    if (score &lt; 40) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 416 | <code>        return 'cautious';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 417 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 418 | <code>    if (score &lt; 61) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 419 | <code>        return 'familiarizing';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 420 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 421 | <code>    if (score &lt; 80) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 422 | <code>        return 'trusted';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 423 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 424 | <code>    return 'close';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 425 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 426 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 427 | <code>function buildAffinityBlock(affinity) {</code> | 定义函数 `buildAffinityBlock`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 428 | <code>    const score = Math.round(clampNumber(affinity.score, 0, 100, DEFAULT_AFFINITY_SCORE));</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 429 | <code>    const stage = buildAffinityStage(score);</code> | 声明局部标识符 `stage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 430 | <code>    const toneHint =</code> | 声明局部标识符 `toneHint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 431 | <code>        score &lt; 40</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 432 | <code>            ? '用户可能正在纠正体验，少撒娇、先承认问题并快速修正。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 433 | <code>            : score &lt; 61</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 434 | <code>            ? '保持温和、熟悉，可以自然承接用户偏好的亲昵称呼和轻微撒娇，但不要过度用力。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 435 | <code>            : score &lt; 80</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 436 | <code>            ? '更熟悉、更自然、更有陪伴感，可以自然引用共同经历和用户偏好。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 437 | <code>            : '允许明显亲密、主动、轻微撒娇和更多默契表达，可以更像长期陪伴用户的私人助手。';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 438 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 439 | <code>        `- 当前好感度：${score}/100（${stage}）。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 440 | <code>        `- 语气影响：${toneHint}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 441 | <code>        '- 好感度是内部游戏化数据，只影响表达风格、主动性、表情/TTS 倾向，不影响安全、隐私、事实准确性、工具审批和基础帮助质量。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 442 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 443 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 445 | <code>function deriveCuratedAffinityScore(affinity = null) {</code> | 定义函数 `deriveCuratedAffinityScore`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 446 | <code>    if (!affinity &#124;&#124; typeof affinity !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 447 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 448 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>    const explicitScore = Number(affinity.score);</code> | 声明局部标识符 `explicitScore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 450 | <code>    if (Number.isFinite(explicitScore)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 451 | <code>        return Math.round(clampNumber(explicitScore, 0, 100, DEFAULT_AFFINITY_SCORE));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 452 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 453 | <code>    const trust = clampNumber(affinity.trust, 0, 1, 0.5);</code> | 声明局部标识符 `trust`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 454 | <code>    const familiarity = clampNumber(affinity.familiarity, 0, 1, 0.5);</code> | 声明局部标识符 `familiarity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 455 | <code>    const warmth = clampNumber(affinity.warmth, 0, 1, 0.5);</code> | 声明局部标识符 `warmth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 456 | <code>    const friction = clampNumber(affinity.friction, 0, 1, 0.2);</code> | 声明局部标识符 `friction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 457 | <code>    const weighted = trust * 0.36 + familiarity * 0.3 + warmth * 0.24 - friction * 0.18;</code> | 声明局部标识符 `weighted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 458 | <code>    return Math.round(clampNumber((weighted / 0.9) * 100, 0, 100, DEFAULT_AFFINITY_SCORE));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 459 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>function createCuratedAffinityStateFromScore(score, existing = null) {</code> | 定义函数 `createCuratedAffinityStateFromScore`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 462 | <code>    const nextScore = Math.round(clampNumber(score, 0, 100, DEFAULT_AFFINITY_SCORE));</code> | 声明局部标识符 `nextScore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 463 | <code>    const normalized = nextScore / 100;</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 464 | <code>    const updatedAt = nowIso();</code> | 声明局部标识符 `updatedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 465 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 466 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 467 | <code>        createdAt: normalizeText(existing?.createdAt, updatedAt),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 468 | <code>        updatedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 469 | <code>        score: nextScore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 470 | <code>        trust: normalized,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 471 | <code>        familiarity: normalized,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 472 | <code>        warmth: normalized,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 473 | <code>        friction: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 474 | <code>        repairState: 'stable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 475 | <code>        relationshipStage: buildAffinityStage(nextScore),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 476 | <code>        evidenceIds: [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 477 | <code>        history: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 478 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 479 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 480 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 481 | <code>function evidencePreview(ids = []) {</code> | 定义函数 `evidencePreview`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 482 | <code>    const normalized = Array.isArray(ids) ? ids.map((id) =&gt; normalizeText(String(id))).filter(Boolean) : [];</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 483 | <code>    if (!normalized.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 484 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 485 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>    return `证据：${normalized.slice(0, 4).join(', ')}${normalized.length &gt; 4 ? '…' : ''}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 487 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 489 | <code>function confidenceLabel(value) {</code> | 定义函数 `confidenceLabel`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 490 | <code>    const confidence = clampNumber(value, 0, 1, 0);</code> | 声明局部标识符 `confidence`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 491 | <code>    return confidence ? confidence.toFixed(2) : 'unknown';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 492 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 494 | <code>function formatCuratedProfileItems(items = [], { includeCategory = true, maxItems = 24 } = {}) {</code> | 定义函数 `formatCuratedProfileItems`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 495 | <code>    const activeItems = (Array.isArray(items) ? items : [])</code> | 声明局部标识符 `activeItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 496 | <code>        .filter((item) =&gt; item &amp;&amp; item.status !== 'inactive' &amp;&amp; normalizeText(item.claim))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 497 | <code>        .sort((left, right) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 498 | <code>            (right.stability === 'stable' ? 1 : 0) - (left.stability === 'stable' ? 1 : 0) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 499 | <code>            (Number(right.confidence) &#124;&#124; 0) - (Number(left.confidence) &#124;&#124; 0) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 500 | <code>            String(right.updatedAt &#124;&#124; right.lastSeen &#124;&#124; '').localeCompare(String(left.updatedAt &#124;&#124; left.lastSeen &#124;&#124; ''))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 501 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 502 | <code>        .slice(0, maxItems);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 503 | <code>    if (!activeItems.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 504 | <code>        return '- 暂无已抽取的稳定画像。不要根据旧规则块脑补用户偏好；只根据当前请求和明确证据行动。';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 505 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 506 | <code>    return activeItems.map((item) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 507 | <code>        const parts = [];</code> | 声明局部标识符 `parts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 508 | <code>        if (includeCategory) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 509 | <code>            parts.push(normalizeText(item.category, 'uncategorized'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 510 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 511 | <code>        parts.push(normalizeText(item.stability, 'candidate'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 512 | <code>        parts.push(`confidence=${confidenceLabel(item.confidence)}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 513 | <code>        const evidence = evidencePreview(item.evidenceIds);</code> | 声明局部标识符 `evidence`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 514 | <code>        return `- [${parts.join(' &#124; ')}] ${normalizeText(item.claim)}${evidence ? `（${evidence}）` : ''}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 515 | <code>    }).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 516 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 518 | <code>function formatCuratedAffinityState(affinity = null) {</code> | 定义函数 `formatCuratedAffinityState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 519 | <code>    if (!affinity &#124;&#124; typeof affinity !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 520 | <code>        return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 521 | <code>            '- 暂无 Raw Memory Ledger 抽取出的关系状态，默认采用中性、稳健、少脑补的协作语气。',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 522 | <code>            '- 关系状态只影响表达风格、主动性和陪伴感，不影响安全、隐私、事实准确性、工具审批和基础帮助质量。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 523 | <code>        ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 524 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 525 | <code>    const trust = clampNumber(affinity.trust, 0, 1, 0.5);</code> | 声明局部标识符 `trust`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 526 | <code>    const familiarity = clampNumber(affinity.familiarity, 0, 1, 0.5);</code> | 声明局部标识符 `familiarity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 527 | <code>    const warmth = clampNumber(affinity.warmth, 0, 1, 0.5);</code> | 声明局部标识符 `warmth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 528 | <code>    const friction = clampNumber(affinity.friction, 0, 1, 0.2);</code> | 声明局部标识符 `friction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 529 | <code>    const score = deriveCuratedAffinityScore(affinity);</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 530 | <code>    const stage = normalizeText(affinity.relationshipStage, 'familiarizing');</code> | 声明局部标识符 `stage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 531 | <code>    const repairState = normalizeText(affinity.repairState, 'stable');</code> | 声明局部标识符 `repairState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 532 | <code>    const evidence = evidencePreview(affinity.evidenceIds);</code> | 声明局部标识符 `evidence`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 533 | <code>    const toneHint = friction &gt;= 0.55 &#124;&#124; repairState === 'recovering' &#124;&#124; repairState === 'strained'</code> | 声明局部标识符 `toneHint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 534 | <code>        ? '先解释证据、边界和风险，减少卖萌和跳步执行，优先恢复信任。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 535 | <code>        : trust &gt;= 0.75 &amp;&amp; warmth &gt;= 0.65</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 536 | <code>            ? '可以更自然、更熟悉、更有陪伴感，但仍保持事实和执行边界。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 537 | <code>            : '保持温和、清晰、可靠，可以自然承接用户偏好的亲昵称呼和轻微撒娇，不要反复把关系推回普通助手。';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 538 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 539 | <code>        Number.isFinite(score) ? `- 综合好感度：${score}/100。` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 540 | <code>        `- 关系阶段：${stage}；修复状态：${repairState}。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 541 | <code>        `- 维度：trust=${trust.toFixed(2)}, familiarity=${familiarity.toFixed(2)}, warmth=${warmth.toFixed(2)}, friction=${friction.toFixed(2)}。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 542 | <code>        `- 语气影响：${toneHint}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 543 | <code>        evidence ? `- ${evidence}` : '- 暂无可追溯证据 id。',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 544 | <code>        '- 关系状态是内部表达调节数据，不影响安全、隐私、事实准确性、工具审批和基础帮助质量。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 545 | <code>    ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 546 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 547 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 548 | <code>function loadCuratedPromptMemory(rootDir) {</code> | 定义函数 `loadCuratedPromptMemory`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 549 | <code>    const userProfile = readJsonFileSync(path.join(rootDir, 'user-profile.json'), null);</code> | 声明局部标识符 `userProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 550 | <code>    const relationshipProfile = readJsonFileSync(path.join(rootDir, 'relationship-profile.json'), null);</code> | 声明局部标识符 `relationshipProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 551 | <code>    const affinityState = readJsonFileSync(path.join(rootDir, 'affinity-state.json'), null);</code> | 声明局部标识符 `affinityState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 552 | <code>    const curatorState = readJsonFileSync(path.join(rootDir, 'profile-curation-state.json'), null);</code> | 声明局部标识符 `curatorState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 553 | <code>    const sourceLine = [</code> | 声明局部标识符 `sourceLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 554 | <code>        '来源：Raw Memory Ledger 日级抽取。',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 555 | <code>        curatorState?.lastRun?.iso ? `最近抽取：${curatorState.lastRun.iso}。` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 556 | <code>        curatorState?.cursor?.lastProcessedIso ? `已处理到：${curatorState.cursor.lastProcessedIso}。` : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 557 | <code>    ].filter(Boolean).join(' ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 558 | <code>    const activeProfileItems = (Array.isArray(userProfile?.items) ? userProfile.items : [])</code> | 声明局部标识符 `activeProfileItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 559 | <code>        .filter((item) =&gt; item &amp;&amp; item.status !== 'inactive' &amp;&amp; normalizeText(item.claim));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 560 | <code>    const activeProjectItems = activeProfileItems.filter((item) =&gt; normalizeText(item.category) === 'project_memory');</code> | 声明局部标识符 `activeProjectItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 561 | <code>    const activeRelationshipToneItems = activeProfileItems.filter((item) =&gt; normalizeText(item.category) === 'relationship_tone');</code> | 声明局部标识符 `activeRelationshipToneItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 562 | <code>    const activeUserProfileItems = activeProfileItems.filter((item) =&gt; {</code> | 声明局部标识符 `activeUserProfileItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 563 | <code>        const category = normalizeText(item.category);</code> | 声明局部标识符 `category`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 564 | <code>        return category !== 'project_memory' &amp;&amp; category !== 'relationship_tone';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 565 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 566 | <code>    const activeRelationshipItems = (Array.isArray(relationshipProfile?.items) ? relationshipProfile.items : [])</code> | 声明局部标识符 `activeRelationshipItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 567 | <code>        .filter((item) =&gt; item &amp;&amp; item.status !== 'inactive' &amp;&amp; normalizeText(item.claim));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 568 | <code>    const selectedRelationshipItems = activeRelationshipItems.length</code> | 声明局部标识符 `selectedRelationshipItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 569 | <code>        ? activeRelationshipItems</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 570 | <code>        : activeRelationshipToneItems;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 571 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 572 | <code>        hasCuratedState: Boolean(curatorState),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 573 | <code>        hasAffinityState: Boolean(affinityState),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 574 | <code>        userProfileItemCount: activeUserProfileItems.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 575 | <code>        projectProfileItemCount: activeProjectItems.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 576 | <code>        relationshipItemCount: selectedRelationshipItems.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 577 | <code>        userProfileText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 578 | <code>            sourceLine,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 579 | <code>            formatCuratedProfileItems(activeUserProfileItems, { includeCategory: true, maxItems: 28 })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 580 | <code>        ].filter(Boolean).join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 581 | <code>        relationshipText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 582 | <code>            sourceLine,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 583 | <code>            formatCuratedProfileItems(selectedRelationshipItems, { includeCategory: false, maxItems: 16 })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 584 | <code>        ].filter(Boolean).join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 585 | <code>        projectProfileText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 586 | <code>            sourceLine,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 587 | <code>            formatCuratedProfileItems(activeProjectItems, { includeCategory: true, maxItems: 24 })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 588 | <code>        ].filter(Boolean).join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 589 | <code>        affinityText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 590 | <code>            sourceLine,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 591 | <code>            formatCuratedAffinityState(affinityState)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 592 | <code>        ].filter(Boolean).join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 593 | <code>        affinityState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 594 | <code>        affinityScore: deriveCuratedAffinityScore(affinityState),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 595 | <code>        affinityStage: normalizeText(affinityState?.relationshipStage)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 596 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 597 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 599 | <code>function encodeSecretValue(value) {</code> | 定义函数 `encodeSecretValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 600 | <code>    return Buffer.from(String(value &#124;&#124; ''), 'utf8').toString('base64');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 601 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 603 | <code>function decodeSecretValue(valueBase64) {</code> | 定义函数 `decodeSecretValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 604 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 605 | <code>        return Buffer.from(String(valueBase64 &#124;&#124; ''), 'base64').toString('utf8');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 606 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 607 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 608 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 609 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 610 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 611 | <code>class AILISMemoryRuntime {</code> | 定义类 `AILISMemoryRuntime`，把相关状态与行为收拢为一个运行时对象。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 612 | <code>    constructor(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 613 | <code>        this.workspaceRoot = path.resolve(options.workspaceRoot &#124;&#124; process.cwd());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 614 | <code>        this.rootDir = path.resolve(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 615 | <code>            options.rootDir &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 616 | <code>                path.join(options.auditDir &#124;&#124; path.join(this.workspaceRoot, '.ailis-state'), 'memory')</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 617 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 618 | <code>        this.statePath = path.join(this.rootDir, 'memory-state.json');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 619 | <code>        this.eventsPath = path.join(this.rootDir, 'events.jsonl');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 620 | <code>        this.capsulesDir = path.join(this.rootDir, 'capsules');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 621 | <code>        this.dailyDir = path.join(this.rootDir, 'daily');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 622 | <code>        this.reflectionsDir = path.join(this.rootDir, 'reflections');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 623 | <code>        this.state = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 624 | <code>        this.loaded = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 625 | <code>        this.lastError = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 626 | <code>        this.initialize();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 627 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 628 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 629 | <code>    initialize() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 630 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 631 | <code>            ensureDirSync(this.rootDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 632 | <code>            ensureDirSync(this.capsulesDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 633 | <code>            ensureDirSync(this.dailyDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 634 | <code>            ensureDirSync(this.reflectionsDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 635 | <code>            const rawState = readJsonFileSync(this.statePath, null);</code> | 声明局部标识符 `rawState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 636 | <code>            this.backupLegacyStateBeforeMigration(rawState);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 637 | <code>            this.state = normalizeState(rawState, this.workspaceRoot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 638 | <code>            this.loaded = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 639 | <code>            this.lastError = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 640 | <code>            this.persist('initialize');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 641 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 642 | <code>            this.loaded = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 643 | <code>            this.lastError = error?.message &#124;&#124; String(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 644 | <code>            this.state = normalizeState(null, this.workspaceRoot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 645 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 646 | <code>        return this.getStatus();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 647 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 648 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 649 | <code>    backupLegacyStateBeforeMigration(rawState) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 650 | <code>        if (!rawState &#124;&#124; Number(rawState.version &#124;&#124; 0) &gt;= MEMORY_STORE_VERSION &#124;&#124; !fs.existsSync(this.statePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 651 | <code>            return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 652 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 653 | <code>        const backupDir = path.join(this.rootDir, 'backups');</code> | 声明局部标识符 `backupDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 654 | <code>        ensureDirSync(backupDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 655 | <code>        const sourceVersion = Math.max(0, Number(rawState.version) &#124;&#124; 0);</code> | 声明局部标识符 `sourceVersion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 656 | <code>        const stamp = String(rawState.updatedAt &#124;&#124; nowIso()).replace(/[^0-9A-Za-z]+/g, '-');</code> | 声明局部标识符 `stamp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 657 | <code>        const backupPath = path.join(backupDir, `memory-state.v${sourceVersion}.${stamp}.json`);</code> | 声明局部标识符 `backupPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 658 | <code>        if (!fs.existsSync(backupPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 659 | <code>            fs.copyFileSync(this.statePath, backupPath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 660 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 661 | <code>        return backupPath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 662 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 663 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 664 | <code>    persist(reason = 'update') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 665 | <code>        if (!this.state) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 666 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 667 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 668 | <code>        this.state.updatedAt = nowIso();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 669 | <code>        this.state.blocks.affinity = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 670 | <code>            ...this.state.blocks.affinity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 671 | <code>            value: buildAffinityBlock(this.state.affinity),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 672 | <code>            updatedAt: this.state.affinity.updatedAt &#124;&#124; this.state.updatedAt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 673 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 674 | <code>        this.state.blocks.secrets_index = {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 675 | <code>            ...this.state.blocks.secrets_index,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 676 | <code>            value: this.buildSecretsIndexText(),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 677 | <code>            updatedAt: this.state.updatedAt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 678 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 679 | <code>        atomicWriteJsonSync(this.statePath, this.state);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 680 | <code>        this.writeCapsules(reason);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 681 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 682 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 683 | <code>    writeCapsules(_reason = 'update') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 684 | <code>        for (const [key, block] of Object.entries(this.state.blocks &#124;&#124; {})) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 685 | <code>            const filePath = path.join(this.capsulesDir, `${safeFileName(key)}.md`);</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 686 | <code>            const content = [</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 687 | <code>                `# ${block.label &#124;&#124; key}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 688 | <code>                '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 689 | <code>                `- key: ${key}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 690 | <code>                `- kind: ${block.kind &#124;&#124; 'core'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 691 | <code>                `- updatedAt: ${block.updatedAt &#124;&#124; this.state.updatedAt}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 692 | <code>                '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 693 | <code>                block.value &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 694 | <code>            ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 695 | <code>            atomicWriteFileSync(filePath, `${content.trim()}\n`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 696 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 697 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 698 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 699 | <code>    getStatus() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 700 | <code>        const eventCount = Array.isArray(this.state?.events) ? this.state.events.length : 0;</code> | 声明局部标识符 `eventCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 701 | <code>        const blockCount = this.state?.blocks ? Object.keys(this.state.blocks).length : 0;</code> | 声明局部标识符 `blockCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 702 | <code>        const curated = loadCuratedPromptMemory(this.rootDir);</code> | 声明局部标识符 `curated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 703 | <code>        const affinityScore = Number.isFinite(curated.affinityScore)</code> | 声明局部标识符 `affinityScore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 704 | <code>            ? curated.affinityScore</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 705 | <code>            : Math.round(this.state?.affinity?.score ?? DEFAULT_AFFINITY_SCORE);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 706 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 707 | <code>            enabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 708 | <code>            version: `v${MEMORY_STORE_VERSION}`,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 709 | <code>            loaded: this.loaded,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 710 | <code>            rootDir: this.rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 711 | <code>            statePath: this.statePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 712 | <code>            eventsPath: this.eventsPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 713 | <code>            blockCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 714 | <code>            eventCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 715 | <code>            affinityScore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 716 | <code>            affinityStage: curated.affinityStage &#124;&#124; buildAffinityStage(affinityScore),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 717 | <code>            affinitySource: curated.hasAffinityState ? 'curated_capsule' : 'memory_state',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 718 | <code>            secretCount: Array.isArray(this.state?.secrets) ? this.state.secrets.length : 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 719 | <code>            lastError: this.lastError</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 720 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 721 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 722 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 723 | <code>    buildSecretsIndexText() {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 724 | <code>        const secrets = Array.isArray(this.state?.secrets) ? this.state.secrets : [];</code> | 声明局部标识符 `secrets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 725 | <code>        if (!secrets.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 726 | <code>            return '- 尚未通过记忆系统登记密钥。上下文只暴露密钥名称和用途，不暴露明文。';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 727 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 728 | <code>        return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 729 | <code>            '- 已保存以下隐私/密钥条目。只在明确需要相应工具或服务时由宿主读取明文，模型上下文不暴露明文：',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 730 | <code>            ...secrets.map((secret) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 731 | <code>                const parts = [</code> | 声明局部标识符 `parts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 732 | <code>                    secret.name,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 733 | <code>                    secret.kind ? `kind=${secret.kind}` : '',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 734 | <code>                    secret.provider ? `provider=${secret.provider}` : '',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 735 | <code>                    secret.description ? `用途：${secret.description}` : ''</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 736 | <code>                ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 737 | <code>                return `- ${parts.join(' &#124; ')}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 738 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 739 | <code>        ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 740 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 741 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 742 | <code>    getSnapshot({ includeEvents = true, sessionId = '', eventLimit = 30 } = {}) {</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 743 | <code>        const curated = loadCuratedPromptMemory(this.rootDir);</code> | 声明局部标识符 `curated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 744 | <code>        const blocks = Object.values(this.state?.blocks &#124;&#124; {}).map((block) =&gt; ({ ...block }));</code> | 声明局部标识符 `blocks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 745 | <code>        const blockByKey = Object.fromEntries(blocks.map((block) =&gt; [block.key, block]));</code> | 声明局部标识符 `blockByKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 746 | <code>        const mergeBlockValue = (key, additions = []) =&gt; {</code> | 声明局部标识符 `mergeBlockValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 747 | <code>            const block = blockByKey[key];</code> | 声明局部标识符 `block`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 748 | <code>            if (!block) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 749 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 750 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 751 | <code>            block.value = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 752 | <code>                sanitizePromptMemoryBlockText(block.value &#124;&#124; ''),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 753 | <code>                ...additions.filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 754 | <code>            ].filter(Boolean).join('\n\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 755 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 756 | <code>        mergeBlockValue('user', curated.userProfileItemCount ? [curated.userProfileText] : []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 757 | <code>        mergeBlockValue('relationship', [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 758 | <code>            curated.relationshipItemCount ? curated.relationshipText : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 759 | <code>            curated.hasAffinityState ? curated.affinityText : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 760 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 761 | <code>        mergeBlockValue('project', curated.projectProfileItemCount ? [curated.projectProfileText] : []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 762 | <code>        if (blockByKey.affinity &amp;&amp; curated.hasAffinityState) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 763 | <code>            blockByKey.affinity.value = curated.affinityText;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 764 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 765 | <code>        const normalizedSessionId = normalizeText(sessionId);</code> | 声明局部标识符 `normalizedSessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 766 | <code>        const recentEvents = (this.state?.events &#124;&#124; [])</code> | 声明局部标识符 `recentEvents`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 767 | <code>            .filter((event) =&gt; !normalizedSessionId &#124;&#124; normalizeText(event.sessionId) === normalizedSessionId)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 768 | <code>            .slice(-Math.max(1, Math.min(Number(eventLimit) &#124;&#124; 30, MAX_STATE_EVENTS)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 769 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 770 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 771 | <code>            status: this.getStatus(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 772 | <code>            affinity: curated.hasAffinityState</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 773 | <code>                ? { ...(curated.affinityState &#124;&#124; {}), score: curated.affinityScore }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 774 | <code>                : { ...(this.state?.affinity &#124;&#124; {}) },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 775 | <code>            blocks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 776 | <code>            recentEvents: includeEvents ? recentEvents : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 777 | <code>            reflections: (this.state?.reflections &#124;&#124; []).slice(-20),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 778 | <code>            secrets: this.listSecrets().secrets</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 779 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 780 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 781 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 782 | <code>    listMemories(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 783 | <code>        return this.getSnapshot(options);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 784 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 785 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 786 | <code>    getContextSources({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 787 | <code>        sessionId = 'main',</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 788 | <code>        message = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 789 | <code>        messageHistory = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 790 | <code>        contextMode = 'persona'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 791 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 792 | <code>        const state = this.state &#124;&#124; normalizeState(null, this.workspaceRoot);</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 793 | <code>        const blocks = state.blocks &#124;&#124; {};</code> | 声明局部标识符 `blocks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 794 | <code>        const curated = loadCuratedPromptMemory(this.rootDir);</code> | 声明局部标识符 `curated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 795 | <code>        const retrievalQuery = buildMemoryRetrievalQuery(message, messageHistory);</code> | 声明局部标识符 `retrievalQuery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 796 | <code>        const relevantEvents = this.searchMemory(retrievalQuery, {</code> | 声明局部标识符 `relevantEvents`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 797 | <code>            limit: DEFAULT_RELEVANT_EVENT_LIMIT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 798 | <code>        }).events.filter((event) =&gt; !isTaskAgentMemoryEvent(event));</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 799 | <code>        const taskAgentMode = normalizeText(contextMode, 'persona').toLowerCase() === 'task_agent';</code> | 声明局部标识符 `taskAgentMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 800 | <code>        const relevantLines = relevantEvents.map(formatPromptMemoryEvent).filter(Boolean);</code> | 声明局部标识符 `relevantLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 801 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 802 | <code>            contextMode: taskAgentMode ? 'task_agent' : 'persona',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 803 | <code>            personaText: taskAgentMode ? '' : sanitizePromptMemoryBlockText(blocks.persona?.value &#124;&#124; ''),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 804 | <code>            userText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 805 | <code>                sanitizePromptMemoryBlockText(blocks.user?.value &#124;&#124; ''),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 806 | <code>                curated.userProfileItemCount ? curated.userProfileText : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 807 | <code>            ].filter(Boolean).join('\n\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 808 | <code>            relationshipText: taskAgentMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 809 | <code>                ? ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 810 | <code>                : [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 811 | <code>                    sanitizePromptMemoryBlockText(blocks.relationship?.value &#124;&#124; ''),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 812 | <code>                    curated.relationshipItemCount ? curated.relationshipText : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 813 | <code>                ].filter(Boolean).join('\n\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 814 | <code>            affinityText: taskAgentMode ? '' : curated.affinityText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 815 | <code>            projectText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 816 | <code>                sanitizePromptMemoryBlockText(blocks.project?.value &#124;&#124; ''),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 817 | <code>                curated.projectProfileItemCount ? curated.projectProfileText : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 818 | <code>            ].filter(Boolean).join('\n\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 819 | <code>            secretIndexText: sanitizePromptMemoryBlockText(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 820 | <code>                blocks.secrets_index?.value &#124;&#124; this.buildSecretsIndexText()</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 821 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 822 | <code>            relevantMemoriesText: relevantLines.join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 823 | <code>            personaRefs: blocks.persona ? ['memory:block:persona'] : [],</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 824 | <code>            userRefs: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 825 | <code>                ...(blocks.user ? ['memory:block:user'] : []),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 826 | <code>                ...(curated.userProfileItemCount ? ['memory:capsule:user-profile'] : [])</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 827 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 828 | <code>            relationshipRefs: taskAgentMode ? [] : [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 829 | <code>                ...(blocks.relationship ? ['memory:block:relationship'] : []),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 830 | <code>                ...(curated.relationshipItemCount ? ['memory:capsule:relationship-profile'] : []),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 831 | <code>                ...(curated.hasAffinityState ? ['memory:capsule:affinity-state'] : [])</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 832 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 833 | <code>            projectRefs: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 834 | <code>                ...(blocks.project ? ['memory:block:project'] : []),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 835 | <code>                ...(curated.projectProfileItemCount ? ['memory:capsule:user-profile#project_memory'] : [])</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 836 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 837 | <code>            secretRefs: blocks.secrets_index ? ['memory:block:secrets_index'] : [],</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 838 | <code>            relevantMemoryRefs: relevantEvents.map((event) =&gt; event.id).filter(Boolean),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 839 | <code>            retrievalQueryChars: retrievalQuery.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 840 | <code>            relevantMemoryCount: relevantLines.length,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 841 | <code>            sessionId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 842 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 843 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 844 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 845 | <code>    compileContext({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 846 | <code>        sessionId = 'main',</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 847 | <code>        message = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 848 | <code>        messageHistory = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 849 | <code>        maxChars = MAX_CONTEXT_CHARS,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 850 | <code>        contextMode = 'persona'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 851 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 852 | <code>        const { AILISContextCompiler } = require('./ailis-context-compiler.cjs');</code> | 导入依赖 `./ailis-context-compiler.cjs`，使本文件可以复用外部模块能力。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 853 | <code>        return new AILISContextCompiler({ memoryRuntime: this }).compile({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 854 | <code>            sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 855 | <code>            currentUserMessage: message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 856 | <code>            sessionRecentTurns: messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 857 | <code>            agentMode: normalizeText(contextMode, 'persona').toLowerCase(),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 858 | <code>            maxChars</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 859 | <code>        }).asDeveloperInstruction();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 860 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 861 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 862 | <code>    getRecentSessionEvents(sessionId = 'main', { limit = DEFAULT_RECENT_SESSION_EVENT_LIMIT } = {}) {</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 863 | <code>        const normalizedSessionId = normalizeText(sessionId, 'main');</code> | 声明局部标识符 `normalizedSessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 864 | <code>        const boundedLimit = Math.max(1, Math.min(Number(limit) &#124;&#124; DEFAULT_RECENT_SESSION_EVENT_LIMIT, 30));</code> | 声明局部标识符 `boundedLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 865 | <code>        return (this.state?.events &#124;&#124; [])</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 866 | <code>            .filter((event) =&gt; normalizeText(event.sessionId, 'main') === normalizedSessionId)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 867 | <code>            .slice(-boundedLimit)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 868 | <code>            .map((event) =&gt; ({ ...event }));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 869 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 870 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 871 | <code>    searchMemory(query, { limit = 10 } = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 872 | <code>        const normalizedQuery = normalizeText(query);</code> | 声明局部标识符 `normalizedQuery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 873 | <code>        const events = (this.state?.events &#124;&#124; [])</code> | 声明局部标识符 `events`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 874 | <code>            .map((event, index) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 875 | <code>                const text = [</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 876 | <code>                    event.summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 877 | <code>                    event.userText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 878 | <code>                    event.assistantText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 879 | <code>                    Array.isArray(event.tags) ? event.tags.join(' ') : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 880 | <code>                ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 881 | <code>                const recency = index / Math.max(1, (this.state.events &#124;&#124; []).length);</code> | 声明局部标识符 `recency`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 882 | <code>                const relevance = scoreTextAgainstQuery(text, normalizedQuery);</code> | 声明局部标识符 `relevance`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 883 | <code>                const score = relevance +</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 884 | <code>                    Number(event.importance &#124;&#124; 0) * 0.35 +</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 885 | <code>                    recency;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 886 | <code>                return { event, score, relevance };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 887 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 888 | <code>            .filter((entry) =&gt; !normalizedQuery &#124;&#124; entry.relevance &gt; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 889 | <code>            .sort((left, right) =&gt; right.score - left.score)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 890 | <code>            .slice(0, Math.max(1, Number(limit) &#124;&#124; 10))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 891 | <code>            .map((entry) =&gt; entry.event);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 892 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 893 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 894 | <code>            query: normalizedQuery,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 895 | <code>            events</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 896 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 897 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 898 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 899 | <code>    recordTurn({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 900 | <code>        sessionId = 'main',</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 901 | <code>        userMessage = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 902 | <code>        assistantMessage = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 903 | <code>        source = 'agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 904 | <code>        result = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 905 | <code>        messageHistory = [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 906 | <code>        attachments = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 907 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 908 | <code>        const userText = redactSecretLikeText(userMessage);</code> | 声明局部标识符 `userText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 909 | <code>        const assistantText = redactSecretLikeText(assistantMessage &#124;&#124; result?.displayText &#124;&#124; result?.finalAnswer &#124;&#124; '');</code> | 声明局部标识符 `assistantText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 910 | <code>        if (!userText &amp;&amp; !assistantText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 911 | <code>            return { ok: false, status: 'empty_turn' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 912 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 913 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 914 | <code>        const ts = nowIso();</code> | 声明局部标识符 `ts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 915 | <code>        const event = {</code> | 声明局部标识符 `event`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 916 | <code>            id: randomUUID(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 917 | <code>            ts,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 918 | <code>            sessionId: normalizeText(sessionId, 'main'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 919 | <code>            source: normalizeText(source, 'agent'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 920 | <code>            type: 'turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 921 | <code>            userText: truncateText(userText, 1200),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 922 | <code>            assistantText: truncateText(assistantText, 1200),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 923 | <code>            summary: buildEventSummary(userText, assistantText),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 924 | <code>            tags: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 925 | <code>            importance: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 926 | <code>            valence: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 927 | <code>            attachments: Array.isArray(attachments)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 928 | <code>                ? attachments.map((attachment) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 929 | <code>                      type: normalizeText(attachment.type, 'attachment'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 930 | <code>                      id: normalizeText(attachment.id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 931 | <code>                      source: normalizeText(attachment.source),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 932 | <code>                      label: normalizeText(attachment.label),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 933 | <code>                      mimeType: normalizeText(attachment.mimeType),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 934 | <code>                      width: Number(attachment.width) &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 935 | <code>                      height: Number(attachment.height) &#124;&#124; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 936 | <code>                  })).slice(0, 5)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 937 | <code>                : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 938 | <code>            resultStatus: normalizeText(result?.status),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 939 | <code>            resultIntent: normalizeText(result?.intent)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 940 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 941 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 942 | <code>        this.state.events.push(event);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 943 | <code>        this.state.events = this.state.events.slice(-MAX_STATE_EVENTS);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 944 | <code>        this.state.stats.turnCount += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 945 | <code>        appendJsonlSync(this.eventsPath, event);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 946 | <code>        this.writeDailyNote(event, messageHistory);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 947 | <code>        this.persist('record_turn');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 948 | <code>        return { ok: true, event };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 949 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 950 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 951 | <code>    writeDailyNote(event, messageHistory = []) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 952 | <code>        const day = dateKeyFromIso(event.ts);</code> | 声明局部标识符 `day`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 953 | <code>        const filePath = path.join(this.dailyDir, `${day}.md`);</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 954 | <code>        const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : `# ${day}\n\n`;</code> | 声明局部标识符 `existing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 955 | <code>        const historyHint = Array.isArray(messageHistory) &amp;&amp; messageHistory.length</code> | 声明局部标识符 `historyHint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 956 | <code>            ? `\n- 上下文消息数：${messageHistory.length}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 957 | <code>            : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 958 | <code>        const entry = [</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 959 | <code>            `## ${event.ts}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 960 | <code>            '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 961 | <code>            `- session: ${event.sessionId}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 962 | <code>            `- tags: ${(event.tags &#124;&#124; []).join(', ') &#124;&#124; 'none'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 963 | <code>            `- importance: ${event.importance}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 964 | <code>            historyHint.trim(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 965 | <code>            '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 966 | <code>            event.summary</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 967 | <code>        ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 968 | <code>        atomicWriteFileSync(filePath, `${existing.trim()}\n\n${entry.trim()}\n`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 969 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 970 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 971 | <code>    updateBlock(key, value) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 972 | <code>        const normalizedKey = normalizeText(key);</code> | 声明局部标识符 `normalizedKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 973 | <code>        if (!normalizedKey) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 974 | <code>            return { ok: false, status: 'invalid_key', error: 'memory block key is required' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 975 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 976 | <code>        const existing = this.state.blocks[normalizedKey] &#124;&#124; {</code> | 声明局部标识符 `existing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 977 | <code>            key: normalizedKey,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 978 | <code>            label: normalizedKey,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 979 | <code>            kind: 'custom',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 980 | <code>            value: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 981 | <code>            updatedAt: nowIso()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 982 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 983 | <code>        this.state.blocks[normalizedKey] = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 984 | <code>            ...existing,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 985 | <code>            value: normalizeBlockText(value, MAX_BLOCK_CHARS),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 986 | <code>            updatedAt: nowIso()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 987 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 988 | <code>        this.persist('update_block');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 989 | <code>        return { ok: true, block: { ...this.state.blocks[normalizedKey] } };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 990 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 991 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 992 | <code>    forgetMemory({ id = '', type = 'event', key = '' } = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 993 | <code>        const normalizedType = normalizeText(type, 'event');</code> | 声明局部标识符 `normalizedType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 994 | <code>        const normalizedId = normalizeText(id &#124;&#124; key);</code> | 声明局部标识符 `normalizedId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 995 | <code>        if (!normalizedId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 996 | <code>            return { ok: false, status: 'invalid_id', error: 'memory id/key is required' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 997 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 998 | <code>        if (normalizedType === 'block') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 999 | <code>            if (!this.state.blocks[normalizedId]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1000 | <code>                return { ok: false, status: 'not_found' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1001 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1002 | <code>            delete this.state.blocks[normalizedId];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1003 | <code>            this.persist('forget_block');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1004 | <code>            return { ok: true, status: 'deleted' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1005 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1006 | <code>        const before = this.state.events.length;</code> | 声明局部标识符 `before`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1007 | <code>        this.state.events = this.state.events.filter((event) =&gt; event.id !== normalizedId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1008 | <code>        if (before === this.state.events.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1009 | <code>            return { ok: false, status: 'not_found' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1010 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1011 | <code>        this.persist('forget_event');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1012 | <code>        return { ok: true, status: 'deleted' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1013 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1014 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1015 | <code>    resetAffinity(score = DEFAULT_AFFINITY_SCORE) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1016 | <code>        const nextScore = clampNumber(score, 0, 100, DEFAULT_AFFINITY_SCORE);</code> | 声明局部标识符 `nextScore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1017 | <code>        this.state.affinity = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1018 | <code>            score: nextScore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1019 | <code>            stage: buildAffinityStage(nextScore),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1020 | <code>            updatedAt: nowIso(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1021 | <code>            events: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1022 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1023 | <code>        const affinityPath = path.join(this.rootDir, 'affinity-state.json');</code> | 声明局部标识符 `affinityPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1024 | <code>        const existingCuratedAffinity = readJsonFileSync(affinityPath, null);</code> | 声明局部标识符 `existingCuratedAffinity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1025 | <code>        const curatedAffinity = createCuratedAffinityStateFromScore(nextScore, existingCuratedAffinity);</code> | 声明局部标识符 `curatedAffinity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1026 | <code>        atomicWriteJsonSync(affinityPath, curatedAffinity);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1027 | <code>        this.persist('reset_affinity');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1028 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1029 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1030 | <code>            affinity: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1031 | <code>                ...curatedAffinity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1032 | <code>                legacyScore: nextScore</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1033 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1034 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1035 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1036 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1037 | <code>    clearMemory({ preserveSecrets = true } = {}) {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1038 | <code>        const secrets = preserveSecrets === false</code> | 声明局部标识符 `secrets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1039 | <code>            ? []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1040 | <code>            : (this.state?.secrets &#124;&#124; []).map((secret) =&gt; ({ ...secret }));</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1041 | <code>        clearDirectoryContentsSync(this.capsulesDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1042 | <code>        clearDirectoryContentsSync(this.dailyDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1043 | <code>        clearDirectoryContentsSync(this.reflectionsDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1044 | <code>        atomicWriteFileSync(this.eventsPath, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1045 | <code>        this.state = createDefaultState(this.workspaceRoot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1046 | <code>        this.state.secrets = secrets;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1047 | <code>        const clearedAt = nowIso();</code> | 声明局部标识符 `clearedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1048 | <code>        atomicWriteJsonSync(path.join(this.rootDir, 'user-profile.json'), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1049 | <code>            version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1050 | <code>            createdAt: clearedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1051 | <code>            updatedAt: clearedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1052 | <code>            items: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1053 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1054 | <code>        atomicWriteJsonSync(path.join(this.rootDir, 'relationship-profile.json'), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1055 | <code>            version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1056 | <code>            createdAt: clearedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1057 | <code>            updatedAt: clearedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1058 | <code>            items: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1059 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1060 | <code>        atomicWriteJsonSync(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1061 | <code>            path.join(this.rootDir, 'affinity-state.json'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1062 | <code>            createCuratedAffinityStateFromScore(DEFAULT_AFFINITY_SCORE)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1063 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1064 | <code>        this.persist('clear_memory');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1065 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1066 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1067 | <code>            status: 'cleared',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1068 | <code>            preservedSecretCount: secrets.length,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1069 | <code>            statusSnapshot: this.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1070 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1071 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1072 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1073 | <code>    saveSecret({ name = '', kind = 'generic', value = '', description = '', provider = '' } = {}) {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1074 | <code>        const normalizedName = normalizeText(name);</code> | 声明局部标识符 `normalizedName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1075 | <code>        const normalizedValue = String(value &#124;&#124; '');</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1076 | <code>        if (!normalizedName &#124;&#124; !normalizedValue) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1077 | <code>            return { ok: false, status: 'invalid_secret', error: 'secret name and value are required' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1078 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1079 | <code>        const now = nowIso();</code> | 声明局部标识符 `now`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1080 | <code>        const existing = this.state.secrets.find((secret) =&gt; secret.name === normalizedName);</code> | 声明局部标识符 `existing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1081 | <code>        const secret = {</code> | 声明局部标识符 `secret`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1082 | <code>            id: existing?.id &#124;&#124; randomUUID(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1083 | <code>            name: normalizedName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1084 | <code>            kind: normalizeText(kind, 'generic'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1085 | <code>            description: normalizeText(description),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1086 | <code>            provider: normalizeText(provider),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1087 | <code>            protection: SECRET_PROTECTION,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1088 | <code>            valueBase64: encodeSecretValue(normalizedValue),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1089 | <code>            createdAt: existing?.createdAt &#124;&#124; now,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1090 | <code>            updatedAt: now</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1091 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1092 | <code>        this.state.secrets = [</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1093 | <code>            ...this.state.secrets.filter((entry) =&gt; entry.name !== normalizedName),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1094 | <code>            secret</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1095 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1096 | <code>        this.persist('save_secret');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1097 | <code>        return { ok: true, secret: this.redactSecret(secret) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1098 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1099 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1100 | <code>    redactSecret(secret) {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1101 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1102 | <code>            id: secret.id,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1103 | <code>            name: secret.name,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1104 | <code>            kind: secret.kind,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1105 | <code>            description: secret.description,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1106 | <code>            provider: secret.provider,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1107 | <code>            protection: secret.protection,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1108 | <code>            configured: Boolean(secret.valueBase64),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1109 | <code>            createdAt: secret.createdAt,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1110 | <code>            updatedAt: secret.updatedAt</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1111 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1112 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1114 | <code>    listSecrets() {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1115 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1116 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1117 | <code>            secrets: (this.state?.secrets &#124;&#124; []).map((secret) =&gt; this.redactSecret(secret))</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1118 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1119 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1121 | <code>    getSecret(name) {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1122 | <code>        const normalizedName = normalizeText(name);</code> | 声明局部标识符 `normalizedName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1123 | <code>        const secret = (this.state?.secrets &#124;&#124; []).find((entry) =&gt; entry.name === normalizedName);</code> | 声明局部标识符 `secret`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1124 | <code>        if (!secret) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1125 | <code>            return { ok: false, status: 'not_found' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1126 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1127 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1128 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1129 | <code>            secret: {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1130 | <code>                ...this.redactSecret(secret),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1131 | <code>                value: decodeSecretValue(secret.valueBase64)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1132 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1133 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1134 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1136 | <code>    deleteSecret(name) {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1137 | <code>        const normalizedName = normalizeText(name);</code> | 声明局部标识符 `normalizedName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1138 | <code>        const before = this.state.secrets.length;</code> | 声明局部标识符 `before`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1139 | <code>        this.state.secrets = this.state.secrets.filter((secret) =&gt; secret.name !== normalizedName);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1140 | <code>        if (before === this.state.secrets.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1141 | <code>            return { ok: false, status: 'not_found' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1142 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1143 | <code>        this.persist('delete_secret');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1144 | <code>        return { ok: true, status: 'deleted' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1145 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1146 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1148 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1149 | <code>    AILISMemoryRuntime,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1150 | <code>    MEMORY_STORE_VERSION,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1151 | <code>    buildAffinityStage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。”这一文件职责。 |
| 1152 | <code>    redactSecretLikeText</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1153 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
