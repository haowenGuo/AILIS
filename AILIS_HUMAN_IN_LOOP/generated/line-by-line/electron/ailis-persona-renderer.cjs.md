# electron/ailis-persona-renderer.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。
- 文件类型：`source-code`
- 原始行数：943
- SHA-256：`120c87e71b5c297d2cb7f4474c6c06fcea30daa8d920a7d95ed699f985aa84d0`
- 可运行副本：[打开源文件](../../../source/electron/ailis-persona-renderer.cjs)
- 依赖：`./ailis-tool-contracts.cjs`
- 主要符号：`RENDERER_VERSION`、`DEFAULT_EXPRESSION`、`DEFAULT_LIP_SYNC`、`ALLOWED_ACTIONS`、`ALLOWED_EXPRESSIONS`、`ALLOWED_RELATIONSHIP_STAGES`、`ALLOWED_EMOTIONS`、`ALLOWED_TASK_STATES`、`ALLOWED_SURFACE_TASK_STATES`、`ALLOWED_GESTURE_INTENTS`、`ALLOWED_SOCIAL_TONES`、`ALLOWED_GAZE_TARGETS`、`ALLOWED_DURATION_HINTS`、`ALLOWED_APPROVAL_STATES`、`ALLOWED_EVIDENCE_STATES`、`USER_FACING_CONTROL_TAG_PATTERN`、`EXPRESSION_TO_EMOTION`、`INTERNAL_TEXT_REPLACEMENTS`、`normalizeText`、`trimmed`、`normalizeAction`、`action`、`normalizeExpression`、`expression`、`normalizeRelationshipStage`、`stage`、`normalizeEmotionHint`、`emotion`、`normalizeSurfaceTaskState`、`state`、`normalizeGestureIntent`、`intent`、`normalizeSocialTone`、`tone`、`normalizeGazeTarget`、`target`、`normalizeDurationHint`、`duration`、`normalizeUnitNumber`、`numericValue`、`normalizeTaskState`、`isSurfaceTaskState`、`isSurfaceOnlyTaskState`、`normalizeApprovalState`、`normalizeEvidenceState`、`sanitizeUserFacingText`、`text`、`compactSpeechText`、`summarizeBubbleText`、`singleLine`、`withControlTags`、`tags`、`safeAction`、`safeExpression`、`getToolExperience`、`inferExpressionFromEmotion`、`inferActionFromEmotion`、`inferSurfaceTaskState`、`inferGestureIntent`、`actionIntent`、`buildEmotionLead`、`mapErrorCodeToReason`、`code`、`tool`、`isInternalFailureDetail`、`buildNextActionText`、`raw`、`fallbackTitle`、`fallbackAction`、`experience`、`verb`、`createPersonaSurface`、`safeText`、`safeSpeechText`、`safeBubbleText`、`safeEmotion`、`safeIntensity`、`renderPersonaSurfaceGateway`、`requestedTaskState`、`taskState`、`approvalState`、`evidenceState`、`errorCode`、`relationshipStage`、`emotionHint`、`toolId`、`source`、`dryRun`、`surfaceEmotion`、`surfaceTaskState`、`surfaceGestureIntent`、`nextAction`、`emotionLead`、`requestedText`、`requestedBubble`、`requestedSpeech`、`requestedTtsStyle`、`reasonText`、`approvalRequired`、`failedState`、`uncertainState`、`personaAuthoredText`、`surfaceIntensity`、`surfaceGazeTarget`、`surfaceDurationHint`、`actionText`、`failureReason`、`emailConfigMissing`、`canUseRequestedFailureText`、`evidenceLine`、`extraReason`、`nextActionLine`、`canUseRequestedText`、`successText`、`successAction`、`attachPersonaSurface`、`personaSurface`、`displayText`、`renderApprovalSurface`、`renderStatusSurface`、`surface`、`preserveText`、`renderToolFailureSurface`、`status`、`userFacingVerb`、`lowerIntent`、`relationHint`、`emailNeedsConfigText`、`renderMaxStepsSurface`、`summary`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const { getToolContract } = require('./ailis-tool-contracts.cjs');</code> | 导入依赖 `./ailis-tool-contracts.cjs`，使本文件可以复用外部模块能力。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>const RENDERER_VERSION = 3;</code> | 声明局部标识符 `RENDERER_VERSION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 4 | <code>const DEFAULT_EXPRESSION = 'relaxed';</code> | 声明局部标识符 `DEFAULT_EXPRESSION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 5 | <code>const DEFAULT_LIP_SYNC = Object.freeze({ mode: 'audio_envelope' });</code> | 声明局部标识符 `DEFAULT_LIP_SYNC`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 6 | <code>const ALLOWED_ACTIONS = new Set([</code> | 声明局部标识符 `ALLOWED_ACTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 7 | <code>    'wave',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 8 | <code>    'angry',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 9 | <code>    'surprised',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 10 | <code>    'dance',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 11 | <code>    'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 12 | <code>    'lookaround',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 13 | <code>    'blush',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 14 | <code>    'relax',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 15 | <code>    'sad',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 16 | <code>    'sleepy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 17 | <code>    'goodbye',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 18 | <code>    'clapping',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 19 | <code>    'jump'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 20 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>const ALLOWED_EXPRESSIONS = new Set(['happy', 'angry', 'sad', 'surprised', 'relaxed', 'blinkRight']);</code> | 声明局部标识符 `ALLOWED_EXPRESSIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 22 | <code>const ALLOWED_RELATIONSHIP_STAGES = new Set(['cautious', 'familiarizing', 'trusted', 'close']);</code> | 声明局部标识符 `ALLOWED_RELATIONSHIP_STAGES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 23 | <code>const ALLOWED_EMOTIONS = new Set(['neutral', 'relaxed', 'happy', 'shy', 'sad', 'anxious', 'angry', 'tired', 'surprised', 'thinking', 'focused', 'comforting']);</code> | 声明局部标识符 `ALLOWED_EMOTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 24 | <code>const ALLOWED_TASK_STATES = new Set([</code> | 声明局部标识符 `ALLOWED_TASK_STATES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 25 | <code>    'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 26 | <code>    'planned',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 27 | <code>    'needs_approval',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 28 | <code>    'uncertain',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 29 | <code>    'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 30 | <code>    'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 31 | <code>    'expired'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 32 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>const ALLOWED_SURFACE_TASK_STATES = new Set([</code> | 声明局部标识符 `ALLOWED_SURFACE_TASK_STATES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 34 | <code>    'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 35 | <code>    'listening',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 36 | <code>    'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 37 | <code>    'speaking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 38 | <code>    'working',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 39 | <code>    'waiting_approval',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 40 | <code>    'happy_success',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 41 | <code>    'apologizing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 42 | <code>    'comforting',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 43 | <code>    'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 44 | <code>    'failed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 45 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>const ALLOWED_GESTURE_INTENTS = new Set([</code> | 声明局部标识符 `ALLOWED_GESTURE_INTENTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 47 | <code>    'none',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 48 | <code>    'greeting',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 49 | <code>    'farewell',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 50 | <code>    'listening',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 51 | <code>    'thinking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 52 | <code>    'working',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 53 | <code>    'approval',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 54 | <code>    'success',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 55 | <code>    'celebrate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 56 | <code>    'shy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 57 | <code>    'comfort',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 58 | <code>    'apologize',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 59 | <code>    'surprised',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 60 | <code>    'angry',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 61 | <code>    'dance'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 62 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>const ALLOWED_SOCIAL_TONES = new Set(['soft', 'bright', 'calm', 'serious', 'playful', 'quiet']);</code> | 声明局部标识符 `ALLOWED_SOCIAL_TONES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 64 | <code>const ALLOWED_GAZE_TARGETS = new Set(['user', 'side', 'down', 'screen', 'away', 'none']);</code> | 声明局部标识符 `ALLOWED_GAZE_TARGETS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 65 | <code>const ALLOWED_DURATION_HINTS = new Set(['short', 'medium', 'long', 'hold']);</code> | 声明局部标识符 `ALLOWED_DURATION_HINTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 66 | <code>const ALLOWED_APPROVAL_STATES = new Set(['none', 'required', 'optional']);</code> | 声明局部标识符 `ALLOWED_APPROVAL_STATES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 67 | <code>const ALLOWED_EVIDENCE_STATES = new Set(['unknown', 'present', 'missing', 'none']);</code> | 声明局部标识符 `ALLOWED_EVIDENCE_STATES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 68 | <code>const USER_FACING_CONTROL_TAG_PATTERN = /(?:\[\s*&#124;【\s*)(?:action&#124;expression&#124;emotion&#124;gestureIntent&#124;socialTone&#124;taskState&#124;speechEnergy&#124;gazeTarget&#124;durationHint)\s*[:=：＝][^\]】\r\n]*(?:\]&#124;】)/gi;</code> | 声明局部标识符 `USER_FACING_CONTROL_TAG_PATTERN`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 69 | <code>const EXPRESSION_TO_EMOTION = Object.freeze({</code> | 声明局部标识符 `EXPRESSION_TO_EMOTION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 70 | <code>    happy: 'happy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 71 | <code>    angry: 'angry',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 72 | <code>    sad: 'sad',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 73 | <code>    surprised: 'surprised',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 74 | <code>    relaxed: 'relaxed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 75 | <code>    blinkRight: 'shy'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 76 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>const INTERNAL_TEXT_REPLACEMENTS = Object.freeze([</code> | 声明局部标识符 `INTERNAL_TEXT_REPLACEMENTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 79 | <code>    [/Agentic Executor(?: Loop)?/gi, '任务执行流程'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 80 | <code>    [/\bllm-agentic-executor\b/gi, '任务执行流程'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 81 | <code>    [/\btool_call\b/gi, '工具步骤'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 82 | <code>    [/\bload_context\b/gi, '补充上下文'],</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 83 | <code>    [/\bartifact_verifier\b/gi, '产物复核'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 84 | <code>    [/\bweb_fetch\b/gi, '网页读取'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 85 | <code>    [/\bapprovalId\b/gi, '确认信息'],</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 86 | <code>    [/\braw observation\b/gi, '观察记录'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 87 | <code>    [/\bgit_status\b/gi, '仓库状态检查'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 88 | <code>    [/\bexec\b/gi, '执行步骤'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 89 | <code>    [/\bmkdir\b/gi, '创建目录'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 90 | <code>    [/\bjson\b/gi, '结构化结果'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 91 | <code>    [/\bvision\.capture_context\b/gi, '截图查看'],</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 92 | <code>    [/\bmcp_bridge\b/gi, '外部工具连接'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 93 | <code>    [/\bsubagents?\b/gi, '并行助手'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 94 | <code>    [/context\.approved\s*=\s*true/gi, '已确认'],</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 95 | <code>    [/AILIS_[A-Z0-9_&lt;&gt;]+/g, '本地配置项']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 96 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>function normalizeText(value, fallback = '') {</code> | 定义函数 `normalizeText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 99 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 100 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 101 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 103 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 104 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>function normalizeAction(value) {</code> | 定义函数 `normalizeAction`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 107 | <code>    const action = normalizeText(value);</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 108 | <code>    return ALLOWED_ACTIONS.has(action) ? action : '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 109 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>function normalizeExpression(value, fallback = DEFAULT_EXPRESSION) {</code> | 定义函数 `normalizeExpression`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 112 | <code>    const expression = normalizeText(value);</code> | 声明局部标识符 `expression`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 113 | <code>    if (ALLOWED_EXPRESSIONS.has(expression)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 114 | <code>        return expression;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 115 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 116 | <code>    return ALLOWED_EXPRESSIONS.has(fallback) ? fallback : DEFAULT_EXPRESSION;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 117 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>function normalizeRelationshipStage(value) {</code> | 定义函数 `normalizeRelationshipStage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 120 | <code>    const stage = normalizeText(value, 'trusted').toLowerCase();</code> | 声明局部标识符 `stage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 121 | <code>    return ALLOWED_RELATIONSHIP_STAGES.has(stage) ? stage : 'trusted';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 122 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>function normalizeEmotionHint(value) {</code> | 定义函数 `normalizeEmotionHint`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 125 | <code>    const emotion = normalizeText(value, 'neutral').toLowerCase();</code> | 声明局部标识符 `emotion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 126 | <code>    return ALLOWED_EMOTIONS.has(emotion) ? emotion : 'neutral';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 127 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>function normalizeSurfaceTaskState(value, fallback = 'speaking') {</code> | 定义函数 `normalizeSurfaceTaskState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 130 | <code>    const state = normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 131 | <code>    if (ALLOWED_SURFACE_TASK_STATES.has(state)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 132 | <code>        return state;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 133 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>    if (state === 'completed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 135 | <code>        return 'happy_success';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 136 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>    if (state === 'planned' &#124;&#124; state === 'uncertain') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 138 | <code>        return 'thinking';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 139 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>    if (state === 'needs_approval') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 141 | <code>        return 'waiting_approval';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 142 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>    if (state === 'blocked') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 144 | <code>        return 'blocked';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 145 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>    if (state === 'failed' &#124;&#124; state === 'expired' &#124;&#124; state === 'error') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 147 | <code>        return 'failed';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 148 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>    return ALLOWED_SURFACE_TASK_STATES.has(fallback) ? fallback : 'speaking';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 150 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>function normalizeGestureIntent(value, fallback = 'none') {</code> | 定义函数 `normalizeGestureIntent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 153 | <code>    const intent = normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');</code> | 声明局部标识符 `intent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 154 | <code>    if (ALLOWED_GESTURE_INTENTS.has(intent)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 155 | <code>        return intent;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 156 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>    if (intent === 'wave' &#124;&#124; intent === 'hello') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 158 | <code>        return 'greeting';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 159 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>    if (intent === 'goodbye' &#124;&#124; intent === 'bye') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 161 | <code>        return 'farewell';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 162 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>    if (intent === 'lookaround' &#124;&#124; intent === 'look_around') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 164 | <code>        return 'thinking';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 165 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>    if (intent === 'blush') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 167 | <code>        return 'shy';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 168 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>    if (intent === 'clapping' &#124;&#124; intent === 'done') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 170 | <code>        return 'success';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 171 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 172 | <code>    return ALLOWED_GESTURE_INTENTS.has(fallback) ? fallback : 'none';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 173 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>function normalizeSocialTone(value, fallback = 'soft') {</code> | 定义函数 `normalizeSocialTone`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 176 | <code>    const tone = normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');</code> | 声明局部标识符 `tone`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 177 | <code>    return ALLOWED_SOCIAL_TONES.has(tone) ? tone : fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 178 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>function normalizeGazeTarget(value, fallback = 'user') {</code> | 定义函数 `normalizeGazeTarget`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 181 | <code>    const target = normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 182 | <code>    return ALLOWED_GAZE_TARGETS.has(target) ? target : fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 183 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 185 | <code>function normalizeDurationHint(value, fallback = 'short') {</code> | 定义函数 `normalizeDurationHint`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 186 | <code>    const duration = normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');</code> | 声明局部标识符 `duration`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 187 | <code>    return ALLOWED_DURATION_HINTS.has(duration) ? duration : fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 188 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>function normalizeUnitNumber(value, fallback = 0.5) {</code> | 定义函数 `normalizeUnitNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 191 | <code>    const numericValue = Number(value);</code> | 声明局部标识符 `numericValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 192 | <code>    if (!Number.isFinite(numericValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 193 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 194 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>    return Math.min(Math.max(numericValue, 0), 1);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 196 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>function normalizeTaskState(value) {</code> | 定义函数 `normalizeTaskState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 199 | <code>    const state = normalizeText(value, 'completed').toLowerCase();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 200 | <code>    if (ALLOWED_TASK_STATES.has(state)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 201 | <code>        return state;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 202 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>    if (state === 'max_steps_reached') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 204 | <code>        return 'blocked';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 205 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>    if (state === 'error' &#124;&#124; state === 'invalid_agent_tool_call' &#124;&#124; state === 'tool_failed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 207 | <code>        return 'failed';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 208 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>    if (state === 'needs_approval') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 210 | <code>        return 'needs_approval';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 211 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>    return 'failed';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 213 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 215 | <code>function isSurfaceTaskState(value) {</code> | 定义函数 `isSurfaceTaskState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 216 | <code>    const state = normalizeText(value).toLowerCase().replace(/[-\s]+/g, '_');</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 217 | <code>    return ALLOWED_SURFACE_TASK_STATES.has(state);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 218 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>function isSurfaceOnlyTaskState(value) {</code> | 定义函数 `isSurfaceOnlyTaskState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 221 | <code>    const state = normalizeText(value).toLowerCase().replace(/[-\s]+/g, '_');</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 222 | <code>    return ALLOWED_SURFACE_TASK_STATES.has(state) &amp;&amp; !ALLOWED_TASK_STATES.has(state);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 223 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 225 | <code>function normalizeApprovalState(value) {</code> | 定义函数 `normalizeApprovalState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 226 | <code>    const state = normalizeText(value, 'none').toLowerCase();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 227 | <code>    return ALLOWED_APPROVAL_STATES.has(state) ? state : 'none';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 228 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 230 | <code>function normalizeEvidenceState(value) {</code> | 定义函数 `normalizeEvidenceState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 231 | <code>    const state = normalizeText(value, 'unknown').toLowerCase();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 232 | <code>    return ALLOWED_EVIDENCE_STATES.has(state) ? state : 'unknown';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 233 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>function sanitizeUserFacingText(value) {</code> | 定义函数 `sanitizeUserFacingText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 236 | <code>    let text = normalizeText(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 237 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 238 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 239 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>    for (const [pattern, replacement] of INTERNAL_TEXT_REPLACEMENTS) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 241 | <code>        text = text.replace(pattern, replacement);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 242 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 243 | <code>    text = text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 244 | <code>        .replace(USER_FACING_CONTROL_TAG_PATTERN, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 245 | <code>        .replace(/确认编号[:：][^\n]+/gi, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 246 | <code>        .replace(/如果确认，请回复[“"][^”"]+[”"]；?如果不执行，请回复[“"][^”"]+[”"]。?/g, '你点头我就继续，不想继续也可以先停。')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 247 | <code>        .replace(/\n{3,}/g, '\n\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 248 | <code>        .replace(/[ \t]+\n/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 249 | <code>        .replace(/\n[ \t]+/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 250 | <code>        .trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 251 | <code>    return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 252 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>function compactSpeechText(value) {</code> | 定义函数 `compactSpeechText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 255 | <code>    return sanitizeUserFacingText(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 256 | <code>        .replace(/```[\s\S]*?```/g, '我把较长的细节放在文字里。')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 257 | <code>        .replace(/[#&gt;*_`~\-\[\]\(\)]/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 258 | <code>        .replace(/\s+/g, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 259 | <code>        .trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 260 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>function summarizeBubbleText(value, fallback = '') {</code> | 定义函数 `summarizeBubbleText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 263 | <code>    const text = sanitizeUserFacingText(value) &#124;&#124; sanitizeUserFacingText(fallback);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 264 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 265 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 266 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>    const singleLine = text.replace(/\s*\n+\s*/g, ' ').trim();</code> | 声明局部标识符 `singleLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 268 | <code>    if (singleLine.length &lt;= 34) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 269 | <code>        return singleLine;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 270 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>    return `${singleLine.slice(0, 33)}...`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 272 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>function withControlTags(text, { action, expression } = {}) {</code> | 定义函数 `withControlTags`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 275 | <code>    const tags = [];</code> | 声明局部标识符 `tags`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 276 | <code>    const safeAction = normalizeAction(action);</code> | 声明局部标识符 `safeAction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 277 | <code>    const safeExpression = normalizeExpression(expression, '');</code> | 声明局部标识符 `safeExpression`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 278 | <code>    if (safeAction) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 279 | <code>        tags.push(`[action:${safeAction}]`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 280 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>    if (safeExpression) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 282 | <code>        tags.push(`[expression:${safeExpression}]`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 283 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>    return `${tags.join('')}${normalizeText(text, '我处理好了。')}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 285 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 286 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 287 | <code>function getToolExperience(toolId) {</code> | 定义函数 `getToolExperience`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 288 | <code>    return getToolContract(toolId)?.experience &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 289 | <code>        embodiedAction: 'handle_task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 290 | <code>        permissionStyle: 'policy',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 291 | <code>        progressStyle: 'quiet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 292 | <code>        successStyle: 'summarize_result',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 293 | <code>        failureStyle: 'plain_explain',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 294 | <code>        userFacingVerb: '处理',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 295 | <code>        userSafePreview: 'summary_only'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 296 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>function inferExpressionFromEmotion(emotionHint, fallback = DEFAULT_EXPRESSION) {</code> | 定义函数 `inferExpressionFromEmotion`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 300 | <code>    const emotion = normalizeEmotionHint(emotionHint);</code> | 声明局部标识符 `emotion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 301 | <code>    if (emotion === 'happy') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 302 | <code>        return 'happy';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 303 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 304 | <code>    if (emotion === 'sad' &#124;&#124; emotion === 'tired') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 305 | <code>        return 'sad';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 306 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>    if (emotion === 'anxious') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 308 | <code>        return 'surprised';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 309 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>    if (emotion === 'angry') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 311 | <code>        return 'angry';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 312 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>    if (emotion === 'surprised') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 314 | <code>        return 'surprised';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 315 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 316 | <code>    if (emotion === 'shy') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 317 | <code>        return 'blinkRight';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 318 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>    return normalizeExpression(fallback);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 320 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>function inferActionFromEmotion(emotionHint, taskState = 'completed') {</code> | 定义函数 `inferActionFromEmotion`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 323 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 324 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>function inferSurfaceTaskState(taskState, approvalState = 'none') {</code> | 定义函数 `inferSurfaceTaskState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 327 | <code>    if (approvalState === 'required' &#124;&#124; taskState === 'needs_approval') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 328 | <code>        return 'waiting_approval';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 329 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 330 | <code>    if (taskState === 'completed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 331 | <code>        return 'happy_success';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 332 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>    if (taskState === 'failed' &#124;&#124; taskState === 'expired') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 334 | <code>        return 'failed';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 335 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 336 | <code>    return normalizeSurfaceTaskState(taskState);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 337 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>function inferGestureIntent({ action = '', emotionHint = 'neutral', taskState = 'completed', approvalState = 'none' } = {}) {</code> | 定义函数 `inferGestureIntent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 340 | <code>    const actionIntent = normalizeGestureIntent(action, '');</code> | 声明局部标识符 `actionIntent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 341 | <code>    if (actionIntent) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 342 | <code>        return actionIntent;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 343 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 344 | <code>    if (approvalState === 'required' &#124;&#124; taskState === 'needs_approval') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 345 | <code>        return 'approval';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 346 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>    if (taskState === 'planned' &#124;&#124; taskState === 'uncertain') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 348 | <code>        return 'thinking';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 349 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 350 | <code>    if (taskState === 'failed' &#124;&#124; taskState === 'blocked' &#124;&#124; taskState === 'expired') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 351 | <code>        return 'apologize';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 352 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 353 | <code>    if (taskState === 'completed' &amp;&amp; emotionHint === 'happy') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 354 | <code>        return 'success';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 355 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>    if (emotionHint === 'anxious' &#124;&#124; emotionHint === 'thinking' &#124;&#124; emotionHint === 'focused') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 357 | <code>        return 'thinking';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 358 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>    if (emotionHint === 'shy') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 360 | <code>        return 'shy';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 361 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>    if (emotionHint === 'surprised') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 363 | <code>        return 'surprised';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 364 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 365 | <code>    if (emotionHint === 'angry') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 366 | <code>        return 'angry';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 367 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>    if (emotionHint === 'sad' &#124;&#124; emotionHint === 'tired') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 369 | <code>        return 'comfort';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 370 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 371 | <code>    return 'none';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 372 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>function buildEmotionLead(emotionHint, relationshipStage = 'trusted') {</code> | 定义函数 `buildEmotionLead`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 375 | <code>    const emotion = normalizeEmotionHint(emotionHint);</code> | 声明局部标识符 `emotion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 376 | <code>    const stage = normalizeRelationshipStage(relationshipStage);</code> | 声明局部标识符 `stage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 377 | <code>    if (emotion === 'angry') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 378 | <code>        return stage === 'close' &#124;&#124; stage === 'trusted'</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 379 | <code>            ? '我知道你现在有点火大，'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 380 | <code>            : '我理解你现在有点火大，';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 381 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 382 | <code>    if (emotion === 'anxious') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 383 | <code>        return stage === 'close' &#124;&#124; stage === 'trusted'</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 384 | <code>            ? '我知道你现在有点着急，'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 385 | <code>            : '我理解你现在有点着急，';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 386 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 387 | <code>    if (emotion === 'sad' &#124;&#124; emotion === 'tired') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 388 | <code>        return stage === 'close' &#124;&#124; stage === 'trusted'</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 389 | <code>            ? '我知道你现在有点累，'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 390 | <code>            : '我理解你现在有点累，';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 391 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>    if (emotion === 'happy') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 393 | <code>        return '好呀，';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 394 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 395 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 396 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 398 | <code>function mapErrorCodeToReason(errorCode = '', { toolId = '' } = {}) {</code> | 定义函数 `mapErrorCodeToReason`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 399 | <code>    const code = normalizeText(errorCode).toLowerCase();</code> | 声明局部标识符 `code`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 400 | <code>    const tool = normalizeText(toolId).toLowerCase();</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 401 | <code>    if (!code) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 402 | <code>        return '这一步没有完整成功';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 403 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 404 | <code>    if (tool === 'email' &amp;&amp; code.includes('needs_config')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 405 | <code>        return '邮箱账号或授权信息还没配置完整';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 406 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>    if (tool === 'code' &amp;&amp; code.includes('needs_config')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 408 | <code>        return '本地 GitHub 或代码工具环境还没准备完整';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 409 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 410 | <code>    if (code.includes('needs_llm_config')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 411 | <code>        return '我这边还没拿到可用的大模型配置';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 412 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 413 | <code>    if (code.includes('timeout')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 414 | <code>        return '这一步等待时间超出了预期';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 415 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 416 | <code>    if (code.includes('invalid_json') &#124;&#124; code.includes('json')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 417 | <code>        return '我这一步还没形成可以直接交给你的可靠结论';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 418 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 419 | <code>    if (code.includes('blocked') &#124;&#124; code.includes('policy')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 420 | <code>        return '这一步受本地安全边界限制';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 421 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 422 | <code>    if (code.includes('expired')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 423 | <code>        return '这个待处理项已经过期';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 424 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 425 | <code>    if (code.includes('needs_approval')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 426 | <code>        return '这一步仍然需要你的确认';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 427 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 428 | <code>    if (code.includes('not_found')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 429 | <code>        return '我没有拿到足够明确的定位信息';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 430 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 431 | <code>    if (code.includes('tool_failed') &#124;&#124; code.includes('error')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 432 | <code>        return '这一步执行没有完整成功';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 433 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 434 | <code>    return '这一步没有完整成功';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 435 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 436 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 437 | <code>function isInternalFailureDetail(value) {</code> | 定义函数 `isInternalFailureDetail`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 438 | <code>    const text = sanitizeUserFacingText(value).toLowerCase();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 439 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 440 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 441 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 442 | <code>    return (</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 443 | <code>        text.includes('结构化结果') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 444 | <code>        text.includes('任务执行流程') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 445 | <code>        text.includes('内部结果') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 446 | <code>        text.includes('合法') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 447 | <code>        text.includes('格式') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 448 | <code>        text.includes('工具步骤') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 449 | <code>        text.includes('执行步骤')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 450 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 451 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 453 | <code>function buildNextActionText(nextAction, { toolId = '', title = '', action = '' } = {}) {</code> | 定义函数 `buildNextActionText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 454 | <code>    const raw = sanitizeUserFacingText(nextAction);</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 455 | <code>    if (raw) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 456 | <code>        return raw.replace(/\n+/g, ' ').trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 457 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 458 | <code>    const fallbackTitle = sanitizeUserFacingText(title);</code> | 声明局部标识符 `fallbackTitle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 459 | <code>    if (fallbackTitle) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 460 | <code>        return fallbackTitle;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 461 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>    const fallbackAction = sanitizeUserFacingText(action);</code> | 声明局部标识符 `fallbackAction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 463 | <code>    if (fallbackAction) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 464 | <code>        return fallbackAction;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 465 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 466 | <code>    const experience = toolId ? getToolExperience(toolId) : null;</code> | 声明局部标识符 `experience`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 467 | <code>    const verb = sanitizeUserFacingText(experience?.userFacingVerb &#124;&#124; '继续处理');</code> | 声明局部标识符 `verb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 468 | <code>    return verb &#124;&#124; '继续处理';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 469 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 470 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 471 | <code>function createPersonaSurface({</code> | 定义函数 `createPersonaSurface`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 472 | <code>    text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 473 | <code>    speechText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 474 | <code>    bubbleText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 475 | <code>    expression = DEFAULT_EXPRESSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 476 | <code>    action = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 477 | <code>    emotion = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 478 | <code>    intensity = 0.5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 479 | <code>    socialTone = 'soft',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 480 | <code>    gestureIntent = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 481 | <code>    taskState = 'speaking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 482 | <code>    speechEnergy = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 483 | <code>    gazeTarget = 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 484 | <code>    durationHint = 'short',</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 485 | <code>    ttsStyle = '自然、清楚、低工具感',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 486 | <code>    lipSync = DEFAULT_LIP_SYNC,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 487 | <code>    source = 'agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 488 | <code>    toolId = '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 489 | <code>    experience = null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 490 | <code>} = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 491 | <code>    const safeText = sanitizeUserFacingText(text) &#124;&#124; '我处理好了。';</code> | 声明局部标识符 `safeText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 492 | <code>    const safeSpeechText = compactSpeechText(speechText &#124;&#124; safeText) &#124;&#124; compactSpeechText(safeText);</code> | 声明局部标识符 `safeSpeechText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 493 | <code>    const safeBubbleText = summarizeBubbleText(bubbleText, safeText) &#124;&#124; safeText;</code> | 声明局部标识符 `safeBubbleText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 494 | <code>    const safeExpression = normalizeExpression(expression);</code> | 声明局部标识符 `safeExpression`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 495 | <code>    const safeAction = normalizeAction(action);</code> | 声明局部标识符 `safeAction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 496 | <code>    const safeEmotion = normalizeEmotionHint(emotion &#124;&#124; EXPRESSION_TO_EMOTION[safeExpression] &#124;&#124; 'relaxed');</code> | 声明局部标识符 `safeEmotion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 497 | <code>    const safeIntensity = normalizeUnitNumber(intensity, safeEmotion === 'relaxed' ? 0.38 : 0.55);</code> | 声明局部标识符 `safeIntensity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 498 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 499 | <code>        version: RENDERER_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 500 | <code>        renderer: 'ailis-persona-renderer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 501 | <code>        source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 502 | <code>        text: safeText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 503 | <code>        speechText: safeSpeechText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 504 | <code>        bubbleText: safeBubbleText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 505 | <code>        expression: safeExpression,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 506 | <code>        action: safeAction &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 507 | <code>        emotion: safeEmotion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 508 | <code>        intensity: safeIntensity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 509 | <code>        socialTone: normalizeSocialTone(socialTone),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 510 | <code>        gestureIntent: normalizeGestureIntent(gestureIntent &#124;&#124; safeAction),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 511 | <code>        taskState: normalizeSurfaceTaskState(taskState),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 512 | <code>        speechEnergy: normalizeUnitNumber(speechEnergy, Math.max(0.25, safeIntensity * 0.85)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 513 | <code>        gazeTarget: normalizeGazeTarget(gazeTarget),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 514 | <code>        durationHint: normalizeDurationHint(durationHint),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 515 | <code>        ttsStyle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 516 | <code>        lipSync: lipSync &amp;&amp; typeof lipSync === 'object' ? lipSync : DEFAULT_LIP_SYNC,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 517 | <code>        toolId: normalizeText(toolId),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 518 | <code>        experience: experience &#124;&#124; (toolId ? getToolExperience(toolId) : null)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 519 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 520 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 521 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 522 | <code>function renderPersonaSurfaceGateway(input = {}) {</code> | 定义函数 `renderPersonaSurfaceGateway`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 523 | <code>    const requestedTaskState = normalizeText(input.task_state &#124;&#124; input.taskState);</code> | 声明局部标识符 `requestedTaskState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 524 | <code>    const taskState = normalizeTaskState(</code> | 声明局部标识符 `taskState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 525 | <code>        requestedTaskState &amp;&amp; !isSurfaceOnlyTaskState(requestedTaskState)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 526 | <code>            ? requestedTaskState</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 527 | <code>            : input.status &#124;&#124; (input.ok === false ? 'failed' : 'completed')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 528 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 529 | <code>    const approvalState = normalizeApprovalState(</code> | 声明局部标识符 `approvalState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 530 | <code>        input.approval_state &#124;&#124;</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 531 | <code>        input.approvalState &#124;&#124;</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 532 | <code>        (taskState === 'needs_approval' &#124;&#124; input.confirmationRequired ? 'required' : 'none')</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 533 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 534 | <code>    const evidenceState = normalizeEvidenceState(input.evidence_state &#124;&#124; input.evidenceState &#124;&#124; 'unknown');</code> | 声明局部标识符 `evidenceState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 535 | <code>    const errorCode = normalizeText(input.error_code &#124;&#124; input.errorCode &#124;&#124; input.status &#124;&#124; '');</code> | 声明局部标识符 `errorCode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 536 | <code>    const relationshipStage = normalizeRelationshipStage(input.relationship_stage &#124;&#124; input.relationshipStage &#124;&#124; 'trusted');</code> | 声明局部标识符 `relationshipStage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 537 | <code>    const emotionHint = normalizeEmotionHint(input.emotion_hint &#124;&#124; input.emotionHint &#124;&#124; 'neutral');</code> | 声明局部标识符 `emotionHint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 538 | <code>    const toolId = normalizeText(input.tool_id &#124;&#124; input.toolId &#124;&#124; '');</code> | 声明局部标识符 `toolId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 539 | <code>    const action = normalizeAction(input.action &#124;&#124; '');</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 540 | <code>    const source = normalizeText(input.source &#124;&#124; 'persona_surface_gateway');</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 541 | <code>    const dryRun = input.dry_run === true &#124;&#124; input.dryRun === true;</code> | 声明局部标识符 `dryRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 542 | <code>    const surfaceEmotion = normalizeEmotionHint(input.emotion &#124;&#124; input.emotionHint &#124;&#124; input.emotion_hint &#124;&#124; emotionHint);</code> | 声明局部标识符 `surfaceEmotion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 543 | <code>    const surfaceTaskState = normalizeSurfaceTaskState(</code> | 声明局部标识符 `surfaceTaskState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 544 | <code>        input.surface_task_state &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 545 | <code>            input.surfaceTaskState &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 546 | <code>            input.persona_task_state &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 547 | <code>            input.personaTaskState &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 548 | <code>            (isSurfaceOnlyTaskState(requestedTaskState) ? requestedTaskState : ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 549 | <code>        inferSurfaceTaskState(taskState, approvalState)</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 550 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 551 | <code>    const surfaceGestureIntent = normalizeGestureIntent(</code> | 声明局部标识符 `surfaceGestureIntent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 552 | <code>        input.gesture_intent &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 553 | <code>            input.gestureIntent &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 554 | <code>            inferGestureIntent({ action, emotionHint: surfaceEmotion, taskState, approvalState })</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 555 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 556 | <code>    const nextAction = buildNextActionText(input.next_action &#124;&#124; input.nextAction &#124;&#124; '', {</code> | 声明局部标识符 `nextAction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 557 | <code>        toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 558 | <code>        title: input.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 559 | <code>        action: input.action_label &#124;&#124; input.action</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 560 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 561 | <code>    const emotionLead = buildEmotionLead(emotionHint, relationshipStage);</code> | 声明局部标识符 `emotionLead`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 562 | <code>    const requestedText = sanitizeUserFacingText(input.text &#124;&#124; input.displayText &#124;&#124; input.fallback_text &#124;&#124; input.fallbackText &#124;&#124; '');</code> | 声明局部标识符 `requestedText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 563 | <code>    const requestedBubble = sanitizeUserFacingText(input.bubble_text &#124;&#124; input.bubbleText &#124;&#124; '');</code> | 声明局部标识符 `requestedBubble`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 564 | <code>    const requestedSpeech = sanitizeUserFacingText(input.speech_text &#124;&#124; input.speechText &#124;&#124; '');</code> | 声明局部标识符 `requestedSpeech`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 565 | <code>    const requestedTtsStyle = sanitizeUserFacingText(input.tts_style &#124;&#124; input.ttsStyle &#124;&#124; '');</code> | 声明局部标识符 `requestedTtsStyle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 566 | <code>    const reasonText = sanitizeUserFacingText(input.reason &#124;&#124; '');</code> | 声明局部标识符 `reasonText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 568 | <code>    const approvalRequired = approvalState === 'required' &#124;&#124; taskState === 'needs_approval';</code> | 声明局部标识符 `approvalRequired`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 569 | <code>    const failedState = taskState === 'failed' &#124;&#124; taskState === 'blocked' &#124;&#124; taskState === 'expired';</code> | 声明局部标识符 `failedState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 570 | <code>    const uncertainState = taskState === 'uncertain' &#124;&#124; taskState === 'planned';</code> | 声明局部标识符 `uncertainState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 571 | <code>    const personaAuthoredText = input.text_is_persona_safe === true &#124;&#124; input.personaText === true;</code> | 声明局部标识符 `personaAuthoredText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 572 | <code>    const surfaceIntensity = normalizeUnitNumber(input.intensity, failedState ? 0.4 : uncertainState ? 0.38 : 0.52);</code> | 声明局部标识符 `surfaceIntensity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 573 | <code>    const surfaceGazeTarget = normalizeGazeTarget(input.gaze_target &#124;&#124; input.gazeTarget, approvalRequired ? 'user' : failedState ? 'down' : uncertainState ? 'side' : 'user');</code> | 声明局部标识符 `surfaceGazeTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 574 | <code>    const surfaceDurationHint = normalizeDurationHint(input.duration_hint &#124;&#124; input.durationHint, approvalRequired &#124;&#124; uncertainState ? 'medium' : 'short');</code> | 声明局部标识符 `surfaceDurationHint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>    if (approvalRequired) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 577 | <code>        const target = sanitizeUserFacingText(input.vision_target_label &#124;&#124; input.visionTargetLabel &#124;&#124; '');</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 578 | <code>        const actionText = toolId === 'vision.capture_context'</code> | 声明局部标识符 `actionText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 579 | <code>            ? `看一眼${target &#124;&#124; '当前画面'}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 580 | <code>            : nextAction;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 581 | <code>        const text = dryRun</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 582 | <code>            ? `${emotionLead}我已经想好下一步了，等你点头我再开始。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 583 | <code>            : [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 584 | <code>                `${emotionLead}这一步我需要先得到你的确认。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 585 | <code>                `我会先${actionText}，然后把结果用一句人话告诉你。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 586 | <code>                toolId === 'vision.capture_context'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 587 | <code>                    ? '你同意的话告诉我“可以看”，我就继续。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 588 | <code>                    : '你点头我就继续，不想继续也可以先停。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 589 | <code>                reasonText ? `这样做是为了：${reasonText}` : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 590 | <code>            ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 591 | <code>        return createPersonaSurface({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 592 | <code>            text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 593 | <code>            speechText: requestedSpeech &#124;&#124; text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 594 | <code>            bubbleText: requestedBubble &#124;&#124; (dryRun ? '下一步我已经准备好了。' : '这一步需要你点头。'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 595 | <code>            expression: inferExpressionFromEmotion(surfaceEmotion, 'relaxed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 596 | <code>            action: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 597 | <code>            emotion: surfaceEmotion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 598 | <code>            intensity: surfaceIntensity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 599 | <code>            socialTone: input.social_tone &#124;&#124; input.socialTone &#124;&#124; 'soft',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 600 | <code>            gestureIntent: surfaceGestureIntent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 601 | <code>            taskState: surfaceTaskState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 602 | <code>            speechEnergy: input.speech_energy ?? input.speechEnergy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 603 | <code>            gazeTarget: surfaceGazeTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 604 | <code>            durationHint: surfaceDurationHint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 605 | <code>            ttsStyle: requestedTtsStyle &#124;&#124; '先确认再继续，语气自然',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 606 | <code>            source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 607 | <code>            toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 608 | <code>            experience: input.experience &#124;&#124; getToolExperience(toolId)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 609 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 610 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 611 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 612 | <code>    if (failedState) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 613 | <code>        const failureReason = mapErrorCodeToReason(errorCode, { toolId });</code> | 声明局部标识符 `failureReason`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 614 | <code>        const emailConfigMissing = toolId === 'email' &amp;&amp; errorCode.toLowerCase().includes('needs_config');</code> | 声明局部标识符 `emailConfigMissing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 615 | <code>        const canUseRequestedFailureText =</code> | 声明局部标识符 `canUseRequestedFailureText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 616 | <code>            !emailConfigMissing &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 617 | <code>            requestedText &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 618 | <code>            (personaAuthoredText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 619 | <code>                (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 620 | <code>                    !isInternalFailureDetail(requestedText) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 621 | <code>                    !/AILIS_&#124;&lt;PROVIDER&gt;&#124;tool_call&#124;raw observation/i.test(requestedText)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 622 | <code>                ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 623 | <code>        if (canUseRequestedFailureText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 624 | <code>            return createPersonaSurface({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 625 | <code>                text: requestedText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 626 | <code>                speechText: requestedSpeech &#124;&#124; requestedText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 627 | <code>                bubbleText: requestedBubble &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 628 | <code>                expression: inferExpressionFromEmotion(surfaceEmotion, 'relaxed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 629 | <code>                action: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 630 | <code>                emotion: surfaceEmotion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 631 | <code>                intensity: surfaceIntensity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 632 | <code>                socialTone: input.social_tone &#124;&#124; input.socialTone &#124;&#124; 'soft',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 633 | <code>                gestureIntent: surfaceGestureIntent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 634 | <code>                taskState: surfaceTaskState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 635 | <code>                speechEnergy: input.speech_energy ?? input.speechEnergy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 636 | <code>                gazeTarget: surfaceGazeTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 637 | <code>                durationHint: surfaceDurationHint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 638 | <code>                ttsStyle: requestedTtsStyle &#124;&#124; '简洁说明卡点和补救',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 639 | <code>                source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 640 | <code>                toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 641 | <code>                experience: input.experience &#124;&#124; getToolExperience(toolId)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 642 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 643 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 644 | <code>        const evidenceLine = emailConfigMissing</code> | 声明局部标识符 `evidenceLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 645 | <code>            ? '我还没连上邮箱，不会假装已经看过邮件。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 646 | <code>            : evidenceState === 'missing'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 647 | <code>                ? '我还没拿到足够证据，不会把这一步说成已经完成。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 648 | <code>                : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 649 | <code>        const extraReason = reasonText &amp;&amp; reasonText !== failureReason &amp;&amp; !isInternalFailureDetail(reasonText)</code> | 声明局部标识符 `extraReason`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 650 | <code>            ? `补充信息：${reasonText}。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 651 | <code>            : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 652 | <code>        const nextActionLine = nextAction</code> | 声明局部标识符 `nextActionLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 653 | <code>            ? `这轮没有继续执行新的动作；如果要继续，下一步建议是：${nextAction}。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 654 | <code>            : '这轮没有继续执行新的动作。';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 655 | <code>        const text = [</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 656 | <code>            `${emotionLead}这一步我先停住，不拿不稳的结果冒进。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 657 | <code>            `目前卡点：${failureReason}。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 658 | <code>            evidenceLine,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 659 | <code>            extraReason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 660 | <code>            nextActionLine</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 661 | <code>        ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 662 | <code>        return createPersonaSurface({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 663 | <code>            text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 664 | <code>            speechText: text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 665 | <code>            bubbleText: emailConfigMissing ? '邮箱还没连上，我先不假装看过。' : '这一步我先稳住。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 666 | <code>            expression: inferExpressionFromEmotion(surfaceEmotion, 'relaxed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 667 | <code>            action: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 668 | <code>            emotion: surfaceEmotion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 669 | <code>            intensity: surfaceIntensity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 670 | <code>            socialTone: input.social_tone &#124;&#124; input.socialTone &#124;&#124; 'soft',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 671 | <code>            gestureIntent: surfaceGestureIntent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 672 | <code>            taskState: surfaceTaskState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 673 | <code>            speechEnergy: input.speech_energy ?? input.speechEnergy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 674 | <code>            gazeTarget: surfaceGazeTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 675 | <code>            durationHint: surfaceDurationHint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 676 | <code>            ttsStyle: requestedTtsStyle &#124;&#124; '简洁说明卡点和补救',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 677 | <code>            source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 678 | <code>            toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 679 | <code>            experience: input.experience &#124;&#124; getToolExperience(toolId)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 680 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 681 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 682 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 683 | <code>    if (uncertainState) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 684 | <code>        const canUseRequestedText =</code> | 声明局部标识符 `canUseRequestedText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 685 | <code>            requestedText &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 686 | <code>            !isInternalFailureDetail(requestedText) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 687 | <code>            !/AILIS_&#124;&lt;PROVIDER&gt;&#124;tool_call&#124;raw observation/i.test(requestedText);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 688 | <code>        const evidenceLine = evidenceState === 'missing' &#124;&#124; evidenceState === 'none'</code> | 声明局部标识符 `evidenceLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 689 | <code>            ? '这轮还没拿到足够的实际证据。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 690 | <code>            : '这轮已经停下，还没有继续执行新的动作。';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 691 | <code>        const extraReason = reasonText &amp;&amp; !isInternalFailureDetail(reasonText)</code> | 声明局部标识符 `extraReason`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 692 | <code>            ? `当前卡点：${reasonText}。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 693 | <code>            : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 694 | <code>        const nextActionLine = nextAction</code> | 声明局部标识符 `nextActionLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 695 | <code>            ? `如果要继续，下一步建议是：${nextAction}。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 696 | <code>            : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 697 | <code>        const text = [</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 698 | <code>            `${emotionLead}${evidenceLine}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 699 | <code>            extraReason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 700 | <code>            nextActionLine</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 701 | <code>        ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 702 | <code>        return createPersonaSurface({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 703 | <code>            text: canUseRequestedText ? requestedText : text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 704 | <code>            speechText: canUseRequestedText ? (requestedSpeech &#124;&#124; requestedText) : text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 705 | <code>            bubbleText: requestedBubble &#124;&#124; (canUseRequestedText ? requestedText : '这轮先停在这里。'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 706 | <code>            expression: inferExpressionFromEmotion(surfaceEmotion, 'relaxed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 707 | <code>            action: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 708 | <code>            emotion: surfaceEmotion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 709 | <code>            intensity: surfaceIntensity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 710 | <code>            socialTone: input.social_tone &#124;&#124; input.socialTone &#124;&#124; 'soft',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 711 | <code>            gestureIntent: surfaceGestureIntent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 712 | <code>            taskState: surfaceTaskState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 713 | <code>            speechEnergy: input.speech_energy ?? input.speechEnergy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 714 | <code>            gazeTarget: surfaceGazeTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 715 | <code>            durationHint: surfaceDurationHint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 716 | <code>            ttsStyle: requestedTtsStyle &#124;&#124; '自然说明不确定性',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 717 | <code>            source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 718 | <code>            toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 719 | <code>            experience: input.experience &#124;&#124; getToolExperience(toolId)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 720 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 721 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 722 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 723 | <code>    const successText = requestedText &#124;&#124; `${emotionLead}我处理好了。`;</code> | 声明局部标识符 `successText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 724 | <code>    const successAction = action &#124;&#124; inferActionFromEmotion(emotionHint, taskState);</code> | 声明局部标识符 `successAction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 725 | <code>    return createPersonaSurface({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 726 | <code>        text: successText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 727 | <code>        speechText: requestedSpeech &#124;&#124; successText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 728 | <code>        bubbleText: requestedBubble &#124;&#124; successText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 729 | <code>        expression: inferExpressionFromEmotion(surfaceEmotion, input.ok === false ? 'relaxed' : 'relaxed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 730 | <code>        action: successAction,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 731 | <code>        emotion: surfaceEmotion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 732 | <code>        intensity: surfaceIntensity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 733 | <code>        socialTone: input.social_tone &#124;&#124; input.socialTone &#124;&#124; 'soft',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 734 | <code>        gestureIntent: surfaceGestureIntent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 735 | <code>        taskState: surfaceTaskState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 736 | <code>        speechEnergy: input.speech_energy ?? input.speechEnergy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 737 | <code>        gazeTarget: surfaceGazeTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 738 | <code>        durationHint: surfaceDurationHint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 739 | <code>        ttsStyle: requestedTtsStyle &#124;&#124; '自然、清楚、低工具感',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 740 | <code>        source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 741 | <code>        toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 742 | <code>        experience: input.experience &#124;&#124; (toolId ? getToolExperience(toolId) : null)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 743 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 744 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 745 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 746 | <code>function attachPersonaSurface(result = {}, surface = null) {</code> | 定义函数 `attachPersonaSurface`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 747 | <code>    const personaSurface = surface &#124;&#124; renderPersonaSurfaceGateway({</code> | 声明局部标识符 `personaSurface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 748 | <code>        task_state: result.ok ? 'completed' : (result.status &#124;&#124; 'failed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 749 | <code>        approval_state: result.confirmationRequired ? 'required' : 'none',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 750 | <code>        evidence_state: Array.isArray(result.steps) &amp;&amp; result.steps.length ? 'present' : 'unknown',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 751 | <code>        error_code: result.error &#124;&#124; result.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 752 | <code>        text: result.displayText &#124;&#124; result.error &#124;&#124; '我处理好了。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 753 | <code>        source: result.planner &#124;&#124; 'agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 754 | <code>        ok: result.ok</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 755 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 756 | <code>    // Visible chat text stays pure; character state travels in structured fields.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 757 | <code>    const displayText = personaSurface.text;</code> | 声明局部标识符 `displayText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 758 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 759 | <code>        ...result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 760 | <code>        displayText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 761 | <code>        speechText: personaSurface.speechText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 762 | <code>        bubbleText: personaSurface.bubbleText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 763 | <code>        expression: personaSurface.expression,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 764 | <code>        action: personaSurface.action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 765 | <code>        emotion: personaSurface.emotion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 766 | <code>        intensity: personaSurface.intensity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 767 | <code>        socialTone: personaSurface.socialTone,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 768 | <code>        gestureIntent: personaSurface.gestureIntent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 769 | <code>        taskState: personaSurface.taskState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 770 | <code>        speechEnergy: personaSurface.speechEnergy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 771 | <code>        gazeTarget: personaSurface.gazeTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 772 | <code>        durationHint: personaSurface.durationHint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 773 | <code>        ttsStyle: personaSurface.ttsStyle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 774 | <code>        lipSync: personaSurface.lipSync,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 775 | <code>        surface: personaSurface</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 776 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 777 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 778 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 779 | <code>function renderApprovalSurface({</code> | 定义函数 `renderApprovalSurface`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 780 | <code>    toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 781 | <code>    title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 782 | <code>    action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 783 | <code>    reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 784 | <code>    dryRun = false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 785 | <code>    visionTargetLabel = ''</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 786 | <code>} = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 787 | <code>    const nextAction = toolId === 'vision.capture_context'</code> | 声明局部标识符 `nextAction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 788 | <code>        ? `看一眼${normalizeText(visionTargetLabel, '屏幕')}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 789 | <code>        : normalizeText(title &#124;&#124; action &#124;&#124; getToolExperience(toolId).userFacingVerb &#124;&#124; '继续处理');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 790 | <code>    return renderPersonaSurfaceGateway({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 791 | <code>        task_state: dryRun ? 'planned' : 'needs_approval',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 792 | <code>        approval_state: dryRun ? 'none' : 'required',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 793 | <code>        evidence_state: dryRun ? 'none' : 'missing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 794 | <code>        relationship_stage: 'trusted',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 795 | <code>        emotion_hint: 'neutral',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 796 | <code>        next_action: nextAction,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 797 | <code>        reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 798 | <code>        title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 799 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 800 | <code>        dry_run: dryRun,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 801 | <code>        vision_target_label: visionTargetLabel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 802 | <code>        source: 'approval',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 803 | <code>        tool_id: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 804 | <code>        experience: getToolExperience(toolId)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 805 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 806 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 807 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 808 | <code>function renderStatusSurface({</code> | 定义函数 `renderStatusSurface`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 809 | <code>    text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 810 | <code>    status = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 811 | <code>    ok = false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 812 | <code>    toolId = '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 813 | <code>    expression = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 814 | <code>    action = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 815 | <code>    source = 'agent_status'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 816 | <code>} = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 817 | <code>    const taskState = normalizeTaskState(status &#124;&#124; (ok ? 'completed' : 'failed'));</code> | 声明局部标识符 `taskState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 818 | <code>    const surface = renderPersonaSurfaceGateway({</code> | 声明局部标识符 `surface`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 819 | <code>        task_state: taskState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 820 | <code>        approval_state: status === 'needs_approval' ? 'required' : 'none',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 821 | <code>        evidence_state: 'unknown',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 822 | <code>        error_code: status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 823 | <code>        relationship_stage: 'trusted',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 824 | <code>        emotion_hint: ok ? 'neutral' : 'anxious',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 825 | <code>        next_action: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 826 | <code>        text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 827 | <code>        source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 828 | <code>        tool_id: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 829 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 830 | <code>        ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 831 | <code>        expression: normalizeExpression(expression &#124;&#124; (ok ? 'happy' : 'surprised'))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 832 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 833 | <code>    const preserveText = ok &amp;&amp; taskState === 'completed';</code> | 声明局部标识符 `preserveText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 834 | <code>    return createPersonaSurface({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 835 | <code>        ...surface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 836 | <code>        text: preserveText ? normalizeText(text, surface.text) : surface.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 837 | <code>        speechText: preserveText ? normalizeText(text, surface.speechText) : surface.speechText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 838 | <code>        bubbleText: preserveText ? normalizeText(text, surface.bubbleText) : surface.bubbleText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 839 | <code>        expression: normalizeExpression(expression &#124;&#124; surface.expression),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 840 | <code>        action: normalizeAction(action &#124;&#124; surface.action &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 841 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 842 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 843 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 844 | <code>function renderToolFailureSurface({</code> | 定义函数 `renderToolFailureSurface`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 845 | <code>    step = {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 846 | <code>    response = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 847 | <code>    userMessage = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 848 | <code>    intent = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 849 | <code>    fallbackText = ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 850 | <code>} = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 851 | <code>    const toolId = normalizeText(step.tool);</code> | 声明局部标识符 `toolId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 852 | <code>    const status = normalizeText(response?.status &#124;&#124; response?.error?.status &#124;&#124; response?.code &#124;&#124; 'error');</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 853 | <code>    const action = normalizeText(step.args?.action &#124;&#124; step.args?.operation &#124;&#124; step.args?.intent);</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 854 | <code>    const userFacingVerb = getToolExperience(toolId).userFacingVerb &#124;&#124; '继续处理';</code> | 声明局部标识符 `userFacingVerb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 855 | <code>    const nextAction = toolId === 'vision.capture_context'</code> | 声明局部标识符 `nextAction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 856 | <code>        ? `看一眼${normalizeText(step.args?.target, '当前画面')}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 857 | <code>        : userFacingVerb;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 858 | <code>    const lowerIntent = normalizeText(intent &#124;&#124; userMessage).toLowerCase();</code> | 声明局部标识符 `lowerIntent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 859 | <code>    const emotionHint = /火大&#124;生气&#124;烦&#124;焦虑&#124;担心&#124;紧张&#124;着急/.test(lowerIntent) ? 'anxious' : 'neutral';</code> | 声明局部标识符 `emotionHint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 860 | <code>    const relationHint = /宝&#124;亲&#124;抱抱/.test(lowerIntent) ? 'close' : 'trusted';</code> | 声明局部标识符 `relationHint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 861 | <code>    const emailNeedsConfigText =</code> | 声明局部标识符 `emailNeedsConfigText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 862 | <code>        toolId === 'email' &amp;&amp; status === 'needs_config'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 863 | <code>            ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 864 | <code>                '我现在还没连上你的邮箱账号，所以不能直接替你查看新邮件。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 865 | <code>                '等邮箱账号和授权信息在控制面板里补好后，我就可以继续帮你查。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 866 | <code>                '我先停在这里，不会假装已经看过邮件。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 867 | <code>            ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 868 | <code>            : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 869 | <code>    return renderPersonaSurfaceGateway({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 870 | <code>        task_state: status === 'needs_approval' ? 'needs_approval' : 'failed',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 871 | <code>        approval_state: status === 'needs_approval' ? 'required' : 'none',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 872 | <code>        evidence_state: response?.ok ? 'present' : 'missing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 873 | <code>        error_code: status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 874 | <code>        relationship_stage: relationHint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 875 | <code>        emotion_hint: emotionHint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 876 | <code>        next_action: emailNeedsConfigText ? '补全邮箱账号和授权信息' : nextAction,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 877 | <code>        reason: emailNeedsConfigText ? '' : fallbackText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 878 | <code>        text: emailNeedsConfigText &#124;&#124; fallbackText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 879 | <code>        bubble_text: emailNeedsConfigText ? '邮箱还没连上，我先不假装看过。' : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 880 | <code>        source: 'tool_failure',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 881 | <code>        tool_id: toolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 882 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 883 | <code>        experience: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 884 | <code>            ...getToolExperience(toolId),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 885 | <code>            status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 886 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 887 | <code>            failureStyle: 'persona_safe_explain'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 888 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 889 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 890 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 891 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 892 | <code>function renderMaxStepsSurface({</code> | 定义函数 `renderMaxStepsSurface`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 893 | <code>    maxSteps = 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 894 | <code>    stepCount = 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 895 | <code>    latestSummary = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 896 | <code>    mode = 'task'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 897 | <code>} = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 898 | <code>    const summary = sanitizeUserFacingText(latestSummary);</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 899 | <code>    const text = [</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 900 | <code>        stepCount &gt; 0 ? `我已经做了 ${stepCount} 轮处理，` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 901 | <code>        '但这一轮还没形成足够稳的结论，我先停住，避免越查越乱。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 902 | <code>        summary ? `目前主要卡在：${summary}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 903 | <code>        mode === 'conversation'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 904 | <code>            ? '如果继续，我会把下一步压成一句人话再往下走。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 905 | <code>            : '如果继续，我会从这个卡点接着查。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 906 | <code>    ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 907 | <code>    return renderPersonaSurfaceGateway({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 908 | <code>        task_state: 'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 909 | <code>        approval_state: 'none',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 910 | <code>        evidence_state: stepCount &gt; 0 ? 'present' : 'missing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 911 | <code>        error_code: 'max_steps_reached',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 912 | <code>        relationship_stage: 'trusted',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 913 | <code>        emotion_hint: 'neutral',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 914 | <code>        next_action: summary &#124;&#124; '继续从当前卡点往下查',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 915 | <code>        text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 916 | <code>        bubble_text: '我先停住，避免越跑越乱。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 917 | <code>        text_is_persona_safe: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 918 | <code>        source: 'agent_max_steps',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 919 | <code>        experience: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 920 | <code>            embodiedAction: 'pause_and_explain',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 921 | <code>            permissionStyle: 'none',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 922 | <code>            progressStyle: 'quiet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 923 | <code>            successStyle: 'not_completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 924 | <code>            failureStyle: 'plain_explain',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 925 | <code>            userFacingVerb: '先停住',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 926 | <code>            userSafePreview: 'summary_only',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 927 | <code>            maxSteps: Number(maxSteps) &#124;&#124; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 928 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 929 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 930 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 931 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 932 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 933 | <code>    RENDERER_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 934 | <code>    attachPersonaSurface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 935 | <code>    createPersonaSurface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 936 | <code>    getToolExperience,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 937 | <code>    renderApprovalSurface,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 938 | <code>    renderMaxStepsSurface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 939 | <code>    renderPersonaSurfaceGateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 940 | <code>    renderToolFailureSurface,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 941 | <code>    renderStatusSurface,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 942 | <code>    withControlTags</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。”这一文件职责。 |
| 943 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
