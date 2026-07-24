# electron/store.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`source-code`
- 原始行数：1652
- SHA-256：`0dbd35034b1f5166b7e3c295f5bdcd6c52687042a98df5c8e011a05901142d3a`
- 可运行副本：[打开源文件](../../../source/electron/store.cjs)
- 依赖：`fs`、`crypto`、`path`、`electron`
- 主要符号：`fs`、`crypto`、`path`、`STATE_FILE_NAME`、`STATE_VERSION`、`PET_BASE_WIDTH`、`PET_BASE_HEIGHT`、`PET_SCALE_OPTIONS`、`DEFAULT_PET_SCALE`、`SPEECH_MODE_OPTIONS`、`RECOGNITION_MODE_OPTIONS`、`CONVERSATION_MODE_OPTIONS`、`DEFAULT_CONVERSATION_MODE`、`UI_LANGUAGE_OPTIONS`、`DEFAULT_UI_LANGUAGE`、`BACKEND_MODE_OPTIONS`、`DEFAULT_BACKEND_BASE_URL`、`DEFAULT_BACKEND_MODE`、`DEFAULT_AGENT_RUNTIME_GATEWAY_URL`、`DEFAULT_OPENCLAW_GATEWAY_URL`、`DEFAULT_AILIS_STATE_DIR`、`OPENAI_COMPATIBLE_PROVIDER`、`OPENAI_COMPATIBLE_PRESET_PROVIDER_IDS`、`LLM_PROVIDER_OPTIONS`、`DEFAULT_LLM_PROVIDER`、`DEFAULT_LLM_BASE_URL`、`DEFAULT_LLM_MODEL`、`LLM_PROVIDER_DEFAULT_BASE_URLS`、`LLM_PROVIDER_DEFAULT_MODELS`、`DEFAULT_LLM_API_KEY`、`DEFAULT_LLM_TEMPERATURE`、`DEFAULT_LLM_REQUEST_TIMEOUT_MS`、`DEFAULT_ELEVENLABS_API_BASE`、`DEFAULT_ELEVENLABS_API_KEY`、`DEFAULT_ELEVENLABS_VOICE_ID`、`DEFAULT_ELEVENLABS_MODEL_ID`、`DEFAULT_ELEVENLABS_LANGUAGE_CODE`、`DEFAULT_ELEVENLABS_OUTPUT_FORMAT`、`DEFAULT_ELEVENLABS_TIMEOUT_MS`、`DEFAULT_ELEVENLABS_OPTIMIZE_STREAMING_LATENCY`、`DEFAULT_ELEVENLABS_STABILITY`、`DEFAULT_ELEVENLABS_SIMILARITY_BOOST`、`DEFAULT_ELEVENLABS_STYLE`、`DEFAULT_ELEVENLABS_SPEED`、`DEFAULT_ELEVENLABS_USE_SPEAKER_BOOST`、`ELEVENLABS_LANGUAGE_CODES`、`DEFAULT_ELEVENLABS_VOICE_PROFILES`、`DEFAULT_COMPUTER_CONTROL_ENABLED`、`EMBER_HARNESS_MODE_OPTIONS`、`DEFAULT_EMBER_HARNESS_MODE`、`DEFAULT_CAMERA_DISTANCE`、`DEFAULT_CAMERA_HEIGHT`、`DEFAULT_CAMERA_TARGET_Y`、`RENDER_PROFILE_OPTIONS`、`DEFAULT_RENDER_PROFILE_ID`、`DEFAULT_RENDER_LIGHT_YAW_DEG`、`DEFAULT_RENDER_KEY_LIGHT_SCALE`、`DEFAULT_RENDER_AMBIENT_FILL_SCALE`、`DEFAULT_RENDER_OUTLINE_SCALE`、`DEFAULT_RENDER_SHADOW_ENABLED`、`DEFAULT_RENDER_RESOLUTION_SCALE`、`DEFAULT_RENDER_FPS_LIMIT`、`DEFAULT_RENDER_SHADOW_QUALITY`、`DEFAULT_RENDER_OUTLINE_ENABLED`、`DEFAULT_RENDER_ANTIALIAS_ENABLED`、`RENDER_FPS_LIMIT_OPTIONS`、`LEGACY_RENDER_PROFILE_ID_ALIASES`、`DEFAULT_DESKTOP_NATIVE_TTS_RATE`、`DEFAULT_DESKTOP_NATIVE_TTS_PITCH`、`DEFAULT_DESKTOP_NATIVE_TTS_VOLUME`、`DEFAULT_CHUNKED_TTS_ENABLED`、`DEFAULT_AUTO_CHAT_ENABLED`、`DEFAULT_AUTO_CHAT_MODE`、`DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC`、`DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC`、`DEFAULT_AVATAR_DIALOGUE_BUBBLE_LEFT`、`DEFAULT_AVATAR_DIALOGUE_BUBBLE_TOP`、`DEFAULT_AVATAR_DIALOGUE_BUBBLE_SCALE`、`DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH`、`DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP`、`DEFAULT_PET_MOUSE_HIT_TEST_ENABLED`、`DEFAULT_PET_MOUSE_HIT_TEST_SHAPE`、`DEFAULT_PET_MOUSE_HIT_TEST_WIDTH_RATIO`、`DEFAULT_PET_MOUSE_HIT_TEST_HEIGHT_RATIO`、`DEFAULT_PET_MOUSE_HIT_TEST_OFFSET_X_RATIO`、`DEFAULT_PET_MOUSE_HIT_TEST_OFFSET_Y_RATIO`、`DEFAULT_PET_MOUSE_HIT_TEST_DEBUG`、`EMAIL_PROVIDER_OPTIONS`、`DEFAULT_EMAIL_PROFILES`、`clampNumber`、`numericValue`、`clampedValue`、`normalizeBoolean`、`normalizedValue`、`normalizePreferredMicDeviceId`、`normalizeBackendBaseUrl`、`normalizeBackendMode`、`normalizeConversationMode`、`normalizeUiLanguage`、`normalizedAlias`、`normalizeAgentRuntimeGatewayUrl`、`normalizeOpenClawGatewayUrl`、`normalizeAILISStateDir`、`normalizeVoiceRuntimeRoot`、`normalizeLlmProvider`、`normalizedProvider`、`normalizeLlmBaseUrlForProviderMatch`、`inferOpenAiCompatiblePresetProvider`、`normalizedBaseUrl`、`matchedProvider`、`normalizeLlmBaseUrl`、`normalizeLlmModel`、`normalizeOllamaModelHistory`、`items`、`seen`、`result`、`model`、`key`、`normalizeOllamaTargetSource`、`normalized`、`ollamaSourceToLegacyMode`、`normalizeOllamaTarget`、`target`、`source`、`modelId`、`localPath`、`remoteModelId`、`normalizeLlmApiKey`、`createLlmApiKeyId`、`normalizeLlmApiKeyLabel`、`normalizeLlmApiKeyProfile`、`rawProfile`、`rawKeys`、`keys`、`seenIds`、`seenValues`、`rawEntry`、`value`、`id`、`valueFingerprint`、`requestedActiveId`、`activeKeyId`、`normalizeLlmApiKeyProfiles`、`providerIds`、`profiles`、`fallbackProvider`、`fallbackKey`、`profile`、`keyId`、`normalizeElevenLabsApiBase`、`normalizeElevenLabsApiKey`、`normalizeElevenLabsVoiceId`、`normalizeElevenLabsModelId`、`normalizeElevenLabsLanguageCode`、`normalizeElevenLabsOutputFormat`、`normalizeElevenLabsTimeoutMs`、`normalizeElevenLabsOptimizeStreamingLatency`、`normalizeElevenLabsStability`、`normalizeElevenLabsSimilarityBoost`、`normalizeElevenLabsStyle`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 2 | <code>const crypto = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 3 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 4 | <code>const { screen } = require('electron');</code> | 导入依赖 `electron`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>const STATE_FILE_NAME = 'desktop-state.json';</code> | 声明局部标识符 `STATE_FILE_NAME`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 7 | <code>const STATE_VERSION = 30;</code> | 声明局部标识符 `STATE_VERSION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 8 | <code>// Transparent Electron frame size. Avatar visual size is compensated in the pet renderer.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 9 | <code>const PET_BASE_WIDTH = 720;</code> | 声明局部标识符 `PET_BASE_WIDTH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 10 | <code>const PET_BASE_HEIGHT = 960;</code> | 声明局部标识符 `PET_BASE_HEIGHT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 11 | <code>const PET_SCALE_OPTIONS = [0.3, 0.4, 0.5, 0.6, 0.7, 0.85, 1, 1.15, 1.3];</code> | 声明局部标识符 `PET_SCALE_OPTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 12 | <code>const DEFAULT_PET_SCALE = 0.85;</code> | 声明局部标识符 `DEFAULT_PET_SCALE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 13 | <code>const SPEECH_MODE_OPTIONS = ['off', 'server', 'cosyvoice3'];</code> | 声明局部标识符 `SPEECH_MODE_OPTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 14 | <code>const RECOGNITION_MODE_OPTIONS = ['fast-vad', 'auto-vad', 'continuous', 'manual'];</code> | 声明局部标识符 `RECOGNITION_MODE_OPTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 15 | <code>const CONVERSATION_MODE_OPTIONS = ['assistant', 'daily'];</code> | 声明局部标识符 `CONVERSATION_MODE_OPTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 16 | <code>const DEFAULT_CONVERSATION_MODE = 'assistant';</code> | 声明局部标识符 `DEFAULT_CONVERSATION_MODE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 17 | <code>const UI_LANGUAGE_OPTIONS = ['zh-CN', 'en', 'ja', 'ko'];</code> | 声明局部标识符 `UI_LANGUAGE_OPTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 18 | <code>const DEFAULT_UI_LANGUAGE = 'zh-CN';</code> | 声明局部标识符 `DEFAULT_UI_LANGUAGE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 19 | <code>const BACKEND_MODE_OPTIONS = ['ailis'];</code> | 声明局部标识符 `BACKEND_MODE_OPTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 20 | <code>const DEFAULT_BACKEND_BASE_URL = '';</code> | 声明局部标识符 `DEFAULT_BACKEND_BASE_URL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 21 | <code>const DEFAULT_BACKEND_MODE = 'ailis';</code> | 声明局部标识符 `DEFAULT_BACKEND_MODE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 22 | <code>const DEFAULT_AGENT_RUNTIME_GATEWAY_URL = 'ws://127.0.0.1:19011';</code> | 声明局部标识符 `DEFAULT_AGENT_RUNTIME_GATEWAY_URL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 23 | <code>const DEFAULT_OPENCLAW_GATEWAY_URL = DEFAULT_AGENT_RUNTIME_GATEWAY_URL;</code> | 声明局部标识符 `DEFAULT_OPENCLAW_GATEWAY_URL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 24 | <code>const DEFAULT_AILIS_STATE_DIR = '';</code> | 声明局部标识符 `DEFAULT_AILIS_STATE_DIR`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 25 | <code>const OPENAI_COMPATIBLE_PROVIDER = 'openai-compatible';</code> | 声明局部标识符 `OPENAI_COMPATIBLE_PROVIDER`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 26 | <code>const OPENAI_COMPATIBLE_PRESET_PROVIDER_IDS = ['doubao', 'deepseek', 'qwen', 'kimi', 'zhipu', 'openrouter'];</code> | 声明局部标识符 `OPENAI_COMPATIBLE_PRESET_PROVIDER_IDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 27 | <code>const LLM_PROVIDER_OPTIONS = [</code> | 声明局部标识符 `LLM_PROVIDER_OPTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 28 | <code>    OPENAI_COMPATIBLE_PROVIDER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 29 | <code>    ...OPENAI_COMPATIBLE_PRESET_PROVIDER_IDS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 30 | <code>    'openai-responses',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 31 | <code>    'anthropic',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 32 | <code>    'gemini',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 33 | <code>    'ollama'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 34 | <code>];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>const DEFAULT_LLM_PROVIDER = 'openai-compatible';</code> | 声明局部标识符 `DEFAULT_LLM_PROVIDER`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 36 | <code>const DEFAULT_LLM_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';</code> | 声明局部标识符 `DEFAULT_LLM_BASE_URL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 37 | <code>const DEFAULT_LLM_MODEL = 'doubao-seed-2-0-mini-260215';</code> | 声明局部标识符 `DEFAULT_LLM_MODEL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 38 | <code>const LLM_PROVIDER_DEFAULT_BASE_URLS = Object.freeze({</code> | 声明局部标识符 `LLM_PROVIDER_DEFAULT_BASE_URLS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 39 | <code>    [OPENAI_COMPATIBLE_PROVIDER]: DEFAULT_LLM_BASE_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 40 | <code>    doubao: DEFAULT_LLM_BASE_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 41 | <code>    deepseek: 'https://api.deepseek.com',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 42 | <code>    qwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 43 | <code>    kimi: 'https://api.moonshot.cn/v1',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 44 | <code>    zhipu: 'https://open.bigmodel.cn/api/paas/v4',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 45 | <code>    openrouter: 'https://openrouter.ai/api/v1',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 46 | <code>    'openai-responses': 'https://api.openai.com/v1',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 47 | <code>    anthropic: 'https://api.anthropic.com',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 48 | <code>    gemini: 'https://generativelanguage.googleapis.com/v1beta',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 49 | <code>    vllm: 'http://127.0.0.1:8000/v1',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 50 | <code>    ollama: 'http://127.0.0.1:11434'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 51 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>const LLM_PROVIDER_DEFAULT_MODELS = Object.freeze({</code> | 声明局部标识符 `LLM_PROVIDER_DEFAULT_MODELS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 53 | <code>    [OPENAI_COMPATIBLE_PROVIDER]: DEFAULT_LLM_MODEL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 54 | <code>    doubao: DEFAULT_LLM_MODEL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 55 | <code>    deepseek: 'deepseek-v4-flash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 56 | <code>    qwen: 'qwen-turbo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 57 | <code>    kimi: 'moonshot-v1-8k',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 58 | <code>    zhipu: 'glm-4-flash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 59 | <code>    openrouter: 'openai/gpt-4.1-mini',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 60 | <code>    'openai-responses': 'gpt-4.1-mini',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 61 | <code>    anthropic: 'claude-3-5-haiku-latest',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 62 | <code>    gemini: 'gemini-2.0-flash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 63 | <code>    vllm: 'Qwen/Qwen2.5-7B-Instruct',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 64 | <code>    ollama: 'qwen2.5:1.5b'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 65 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>const DEFAULT_LLM_API_KEY = '';</code> | 声明局部标识符 `DEFAULT_LLM_API_KEY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 67 | <code>const DEFAULT_LLM_TEMPERATURE = 0.8;</code> | 声明局部标识符 `DEFAULT_LLM_TEMPERATURE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 68 | <code>const DEFAULT_LLM_REQUEST_TIMEOUT_MS = 25000;</code> | 声明局部标识符 `DEFAULT_LLM_REQUEST_TIMEOUT_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 69 | <code>const DEFAULT_ELEVENLABS_API_BASE = 'https://api.elevenlabs.io';</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_API_BASE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 70 | <code>const DEFAULT_ELEVENLABS_API_KEY = '';</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_API_KEY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 71 | <code>const DEFAULT_ELEVENLABS_VOICE_ID = '';</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_VOICE_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 72 | <code>const DEFAULT_ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_MODEL_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 73 | <code>const DEFAULT_ELEVENLABS_LANGUAGE_CODE = 'zh';</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_LANGUAGE_CODE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 74 | <code>const DEFAULT_ELEVENLABS_OUTPUT_FORMAT = 'mp3_44100_128';</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_OUTPUT_FORMAT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 75 | <code>const DEFAULT_ELEVENLABS_TIMEOUT_MS = 60000;</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_TIMEOUT_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 76 | <code>const DEFAULT_ELEVENLABS_OPTIMIZE_STREAMING_LATENCY = 0;</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_OPTIMIZE_STREAMING_LATENCY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 77 | <code>const DEFAULT_ELEVENLABS_STABILITY = 0.58;</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_STABILITY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 78 | <code>const DEFAULT_ELEVENLABS_SIMILARITY_BOOST = 0.78;</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_SIMILARITY_BOOST`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 79 | <code>const DEFAULT_ELEVENLABS_STYLE = 0.05;</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_STYLE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 80 | <code>const DEFAULT_ELEVENLABS_SPEED = 0.9;</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_SPEED`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 81 | <code>const DEFAULT_ELEVENLABS_USE_SPEAKER_BOOST = true;</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_USE_SPEAKER_BOOST`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 82 | <code>const ELEVENLABS_LANGUAGE_CODES = ['zh', 'en', 'ja', 'ko'];</code> | 声明局部标识符 `ELEVENLABS_LANGUAGE_CODES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 83 | <code>const DEFAULT_ELEVENLABS_VOICE_PROFILES = Object.freeze({</code> | 声明局部标识符 `DEFAULT_ELEVENLABS_VOICE_PROFILES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 84 | <code>    zh: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 85 | <code>        voiceId: DEFAULT_ELEVENLABS_VOICE_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 86 | <code>        modelId: DEFAULT_ELEVENLABS_MODEL_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 87 | <code>        languageCode: 'zh',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 88 | <code>        outputFormat: DEFAULT_ELEVENLABS_OUTPUT_FORMAT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 89 | <code>        optimizeStreamingLatency: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 90 | <code>        stability: 0.58,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 91 | <code>        similarityBoost: 0.78,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 92 | <code>        style: 0.05,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 93 | <code>        speed: 0.9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 94 | <code>        useSpeakerBoost: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 95 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>    en: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 97 | <code>        voiceId: DEFAULT_ELEVENLABS_VOICE_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 98 | <code>        modelId: DEFAULT_ELEVENLABS_MODEL_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 99 | <code>        languageCode: 'en',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 100 | <code>        outputFormat: DEFAULT_ELEVENLABS_OUTPUT_FORMAT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 101 | <code>        optimizeStreamingLatency: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 102 | <code>        stability: 0.55,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 103 | <code>        similarityBoost: 0.8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 104 | <code>        style: 0.08,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 105 | <code>        speed: 0.92,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 106 | <code>        useSpeakerBoost: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 107 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>    ja: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 109 | <code>        voiceId: DEFAULT_ELEVENLABS_VOICE_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 110 | <code>        modelId: DEFAULT_ELEVENLABS_MODEL_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 111 | <code>        languageCode: 'ja',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 112 | <code>        outputFormat: DEFAULT_ELEVENLABS_OUTPUT_FORMAT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 113 | <code>        optimizeStreamingLatency: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 114 | <code>        stability: 0.52,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 115 | <code>        similarityBoost: 0.78,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 116 | <code>        style: 0.08,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 117 | <code>        speed: 0.88,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 118 | <code>        useSpeakerBoost: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 119 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>    ko: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 121 | <code>        voiceId: DEFAULT_ELEVENLABS_VOICE_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 122 | <code>        modelId: DEFAULT_ELEVENLABS_MODEL_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 123 | <code>        languageCode: 'ko',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 124 | <code>        outputFormat: DEFAULT_ELEVENLABS_OUTPUT_FORMAT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 125 | <code>        optimizeStreamingLatency: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 126 | <code>        stability: 0.54,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 127 | <code>        similarityBoost: 0.78,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 128 | <code>        style: 0.08,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 129 | <code>        speed: 0.9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 130 | <code>        useSpeakerBoost: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 131 | <code>    })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>const DEFAULT_COMPUTER_CONTROL_ENABLED = true;</code> | 声明局部标识符 `DEFAULT_COMPUTER_CONTROL_ENABLED`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 134 | <code>const EMBER_HARNESS_MODE_OPTIONS = ['off', 'observe', 'enforce'];</code> | 声明局部标识符 `EMBER_HARNESS_MODE_OPTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 135 | <code>const DEFAULT_EMBER_HARNESS_MODE = 'off';</code> | 声明局部标识符 `DEFAULT_EMBER_HARNESS_MODE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 136 | <code>const DEFAULT_CAMERA_DISTANCE = 1.1;</code> | 声明局部标识符 `DEFAULT_CAMERA_DISTANCE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 137 | <code>const DEFAULT_CAMERA_HEIGHT = 1.3;</code> | 声明局部标识符 `DEFAULT_CAMERA_HEIGHT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 138 | <code>const DEFAULT_CAMERA_TARGET_Y = 1;</code> | 声明局部标识符 `DEFAULT_CAMERA_TARGET_Y`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 139 | <code>const RENDER_PROFILE_OPTIONS = [</code> | 声明局部标识符 `RENDER_PROFILE_OPTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 140 | <code>    'ailis_soft_anime_mtoon',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 141 | <code>    'ailis_bright_companion_mtoon',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 142 | <code>    'ailis_cinematic_rim_toon',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 143 | <code>    'ailis_material_hybrid_npr',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 144 | <code>    'ailis_hard_cel_mtoon'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 145 | <code>];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>const DEFAULT_RENDER_PROFILE_ID = 'ailis_soft_anime_mtoon';</code> | 声明局部标识符 `DEFAULT_RENDER_PROFILE_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 147 | <code>const DEFAULT_RENDER_LIGHT_YAW_DEG = 0;</code> | 声明局部标识符 `DEFAULT_RENDER_LIGHT_YAW_DEG`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 148 | <code>const DEFAULT_RENDER_KEY_LIGHT_SCALE = 1;</code> | 声明局部标识符 `DEFAULT_RENDER_KEY_LIGHT_SCALE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 149 | <code>const DEFAULT_RENDER_AMBIENT_FILL_SCALE = 1;</code> | 声明局部标识符 `DEFAULT_RENDER_AMBIENT_FILL_SCALE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 150 | <code>const DEFAULT_RENDER_OUTLINE_SCALE = 0.72;</code> | 声明局部标识符 `DEFAULT_RENDER_OUTLINE_SCALE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 151 | <code>const DEFAULT_RENDER_SHADOW_ENABLED = true;</code> | 声明局部标识符 `DEFAULT_RENDER_SHADOW_ENABLED`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 152 | <code>const DEFAULT_RENDER_RESOLUTION_SCALE = 2;</code> | 声明局部标识符 `DEFAULT_RENDER_RESOLUTION_SCALE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 153 | <code>const DEFAULT_RENDER_FPS_LIMIT = 60;</code> | 声明局部标识符 `DEFAULT_RENDER_FPS_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 154 | <code>const DEFAULT_RENDER_SHADOW_QUALITY = 3;</code> | 声明局部标识符 `DEFAULT_RENDER_SHADOW_QUALITY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 155 | <code>const DEFAULT_RENDER_OUTLINE_ENABLED = true;</code> | 声明局部标识符 `DEFAULT_RENDER_OUTLINE_ENABLED`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 156 | <code>const DEFAULT_RENDER_ANTIALIAS_ENABLED = true;</code> | 声明局部标识符 `DEFAULT_RENDER_ANTIALIAS_ENABLED`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 157 | <code>const RENDER_FPS_LIMIT_OPTIONS = [24, 30, 45, 60];</code> | 声明局部标识符 `RENDER_FPS_LIMIT_OPTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 158 | <code>const LEGACY_RENDER_PROFILE_ID_ALIASES = Object.freeze({</code> | 声明局部标识符 `LEGACY_RENDER_PROFILE_ID_ALIASES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 159 | <code>    ailis_soft_genshin_base: 'ailis_soft_anime_mtoon',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 160 | <code>    ailis_bright_companion: 'ailis_bright_companion_mtoon',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 161 | <code>    ailis_wuwa_cinematic: 'ailis_cinematic_rim_toon',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 162 | <code>    ailis_endfield_hybrid: 'ailis_material_hybrid_npr',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 163 | <code>    ailis_cel_anime_hard: 'ailis_hard_cel_mtoon'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 164 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>const DEFAULT_DESKTOP_NATIVE_TTS_RATE = 0.96;</code> | 声明局部标识符 `DEFAULT_DESKTOP_NATIVE_TTS_RATE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 166 | <code>const DEFAULT_DESKTOP_NATIVE_TTS_PITCH = 1.12;</code> | 声明局部标识符 `DEFAULT_DESKTOP_NATIVE_TTS_PITCH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 167 | <code>const DEFAULT_DESKTOP_NATIVE_TTS_VOLUME = 1;</code> | 声明局部标识符 `DEFAULT_DESKTOP_NATIVE_TTS_VOLUME`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 168 | <code>const DEFAULT_CHUNKED_TTS_ENABLED = true;</code> | 声明局部标识符 `DEFAULT_CHUNKED_TTS_ENABLED`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 169 | <code>const DEFAULT_AUTO_CHAT_ENABLED = false;</code> | 声明局部标识符 `DEFAULT_AUTO_CHAT_ENABLED`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 170 | <code>const DEFAULT_AUTO_CHAT_MODE = 'off';</code> | 声明局部标识符 `DEFAULT_AUTO_CHAT_MODE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 171 | <code>const DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC = 15 * 60;</code> | 声明局部标识符 `DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 172 | <code>const DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC = 45 * 60;</code> | 声明局部标识符 `DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 173 | <code>const DEFAULT_AVATAR_DIALOGUE_BUBBLE_LEFT = 8;</code> | 声明局部标识符 `DEFAULT_AVATAR_DIALOGUE_BUBBLE_LEFT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 174 | <code>const DEFAULT_AVATAR_DIALOGUE_BUBBLE_TOP = 8;</code> | 声明局部标识符 `DEFAULT_AVATAR_DIALOGUE_BUBBLE_TOP`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 175 | <code>const DEFAULT_AVATAR_DIALOGUE_BUBBLE_SCALE = 1;</code> | 声明局部标识符 `DEFAULT_AVATAR_DIALOGUE_BUBBLE_SCALE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 176 | <code>const DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH = 220;</code> | 声明局部标识符 `DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 177 | <code>const DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP = 190;</code> | 声明局部标识符 `DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 178 | <code>const DEFAULT_PET_MOUSE_HIT_TEST_ENABLED = true;</code> | 声明局部标识符 `DEFAULT_PET_MOUSE_HIT_TEST_ENABLED`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 179 | <code>const DEFAULT_PET_MOUSE_HIT_TEST_SHAPE = 'ellipse';</code> | 声明局部标识符 `DEFAULT_PET_MOUSE_HIT_TEST_SHAPE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 180 | <code>const DEFAULT_PET_MOUSE_HIT_TEST_WIDTH_RATIO = 0.58;</code> | 声明局部标识符 `DEFAULT_PET_MOUSE_HIT_TEST_WIDTH_RATIO`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 181 | <code>const DEFAULT_PET_MOUSE_HIT_TEST_HEIGHT_RATIO = 0.78;</code> | 声明局部标识符 `DEFAULT_PET_MOUSE_HIT_TEST_HEIGHT_RATIO`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 182 | <code>const DEFAULT_PET_MOUSE_HIT_TEST_OFFSET_X_RATIO = 0;</code> | 声明局部标识符 `DEFAULT_PET_MOUSE_HIT_TEST_OFFSET_X_RATIO`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 183 | <code>const DEFAULT_PET_MOUSE_HIT_TEST_OFFSET_Y_RATIO = 0.08;</code> | 声明局部标识符 `DEFAULT_PET_MOUSE_HIT_TEST_OFFSET_Y_RATIO`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 184 | <code>const DEFAULT_PET_MOUSE_HIT_TEST_DEBUG = false;</code> | 声明局部标识符 `DEFAULT_PET_MOUSE_HIT_TEST_DEBUG`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 185 | <code>const EMAIL_PROVIDER_OPTIONS = ['qq', 'gmail', 'outlook'];</code> | 声明局部标识符 `EMAIL_PROVIDER_OPTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 186 | <code>const DEFAULT_EMAIL_PROFILES = Object.freeze({</code> | 声明局部标识符 `DEFAULT_EMAIL_PROFILES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 187 | <code>    qq: Object.freeze({ account: '', secret: '', authType: 'password' }),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 188 | <code>    gmail: Object.freeze({ account: '', secret: '', authType: 'password' }),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 189 | <code>    outlook: Object.freeze({ account: '', secret: '', authType: 'password' })</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 190 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>function clampNumber(value, minimum, maximum, fallbackValue, digits = 2) {</code> | 定义函数 `clampNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 193 | <code>    const numericValue = Number(value);</code> | 声明局部标识符 `numericValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 194 | <code>    if (!Number.isFinite(numericValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 195 | <code>        return fallbackValue;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 196 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>    const clampedValue = Math.min(Math.max(numericValue, minimum), maximum);</code> | 声明局部标识符 `clampedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 199 | <code>    return Number(clampedValue.toFixed(digits));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 200 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>function normalizeBoolean(value, fallbackValue = false) {</code> | 定义函数 `normalizeBoolean`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 203 | <code>    if (typeof value === 'boolean') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 204 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 205 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>    if (typeof value === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 208 | <code>        const normalizedValue = value.trim().toLowerCase();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 209 | <code>        if (['true', '1', 'yes', 'on'].includes(normalizedValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 210 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 211 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>        if (['false', '0', 'no', 'off'].includes(normalizedValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 213 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 214 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>    return fallbackValue;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 218 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>function normalizePreferredMicDeviceId(deviceId) {</code> | 定义函数 `normalizePreferredMicDeviceId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 221 | <code>    return String(deviceId &#124;&#124; '').trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 222 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 223 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 224 | <code>function normalizeBackendBaseUrl(value) {</code> | 定义函数 `normalizeBackendBaseUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 225 | <code>    const normalizedValue = String(value &#124;&#124; '').trim().replace(/\/+$/, '');</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 226 | <code>    return normalizedValue &#124;&#124; DEFAULT_BACKEND_BASE_URL;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 227 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 229 | <code>function normalizeBackendMode(mode) {</code> | 定义函数 `normalizeBackendMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 230 | <code>    return DEFAULT_BACKEND_MODE;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 231 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>function normalizeConversationMode(mode) {</code> | 定义函数 `normalizeConversationMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 234 | <code>    const normalizedValue = String(mode &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 235 | <code>    return CONVERSATION_MODE_OPTIONS.includes(normalizedValue)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 236 | <code>        ? normalizedValue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 237 | <code>        : DEFAULT_CONVERSATION_MODE;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 238 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 240 | <code>function normalizeUiLanguage(value) {</code> | 定义函数 `normalizeUiLanguage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 241 | <code>    const normalizedValue = String(value &#124;&#124; '').trim();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 242 | <code>    if (UI_LANGUAGE_OPTIONS.includes(normalizedValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 243 | <code>        return normalizedValue;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 244 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>    const normalizedAlias = normalizedValue.toLowerCase().replace(/_/g, '-');</code> | 声明局部标识符 `normalizedAlias`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 247 | <code>    if (['zh', 'zh-cn', 'zh-hans', 'cn', 'chinese'].includes(normalizedAlias)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 248 | <code>        return 'zh-CN';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 249 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>    if (['en', 'en-us', 'en-gb', 'english'].includes(normalizedAlias)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 251 | <code>        return 'en';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 252 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>    if (['ja', 'ja-jp', 'jp', 'japanese'].includes(normalizedAlias)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 254 | <code>        return 'ja';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 255 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>    if (['ko', 'ko-kr', 'kr', 'korean'].includes(normalizedAlias)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 257 | <code>        return 'ko';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 258 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 260 | <code>    return DEFAULT_UI_LANGUAGE;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 261 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>function normalizeAgentRuntimeGatewayUrl(value) {</code> | 定义函数 `normalizeAgentRuntimeGatewayUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 264 | <code>    const normalizedValue = String(value &#124;&#124; '').trim();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 265 | <code>    if (!normalizedValue) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 266 | <code>        return DEFAULT_AGENT_RUNTIME_GATEWAY_URL;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 267 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>    if (/^wss?:\/\//i.test(normalizedValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 269 | <code>        return normalizedValue;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 270 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>    if (/^https?:\/\//i.test(normalizedValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 272 | <code>        return normalizedValue.replace(/^http/i, 'ws');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 273 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 274 | <code>    return `ws://${normalizedValue}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 275 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>function normalizeOpenClawGatewayUrl(value) {</code> | 定义函数 `normalizeOpenClawGatewayUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 278 | <code>    return normalizeAgentRuntimeGatewayUrl(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 279 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>function normalizeAILISStateDir(value) {</code> | 定义函数 `normalizeAILISStateDir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 282 | <code>    return String(value &#124;&#124; '').trim().replace(/^["']&#124;["']$/g, '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 283 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>function normalizeVoiceRuntimeRoot(value) {</code> | 定义函数 `normalizeVoiceRuntimeRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 286 | <code>    return String(value &#124;&#124; '').trim().replace(/^["']&#124;["']$/g, '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 287 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>function normalizeLlmProvider(provider) {</code> | 定义函数 `normalizeLlmProvider`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 290 | <code>    const normalizedProvider = String(provider &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalizedProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 291 | <code>    return LLM_PROVIDER_OPTIONS.includes(normalizedProvider)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 292 | <code>        ? normalizedProvider</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 293 | <code>        : DEFAULT_LLM_PROVIDER;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 294 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 296 | <code>function normalizeLlmBaseUrlForProviderMatch(value) {</code> | 定义函数 `normalizeLlmBaseUrlForProviderMatch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 297 | <code>    return String(value &#124;&#124; '').trim().replace(/\/+$/, '').toLowerCase();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 298 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 300 | <code>function inferOpenAiCompatiblePresetProvider(provider, baseUrl) {</code> | 定义函数 `inferOpenAiCompatiblePresetProvider`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 301 | <code>    const normalizedProvider = normalizeLlmProvider(provider);</code> | 声明局部标识符 `normalizedProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 302 | <code>    if (normalizedProvider !== OPENAI_COMPATIBLE_PROVIDER) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 303 | <code>        return normalizedProvider;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 304 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 305 | <code>    const normalizedBaseUrl = normalizeLlmBaseUrlForProviderMatch(baseUrl);</code> | 声明局部标识符 `normalizedBaseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 306 | <code>    if (!normalizedBaseUrl) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 307 | <code>        return normalizedProvider;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 308 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 309 | <code>    const matchedProvider = OPENAI_COMPATIBLE_PRESET_PROVIDER_IDS.find((providerId) =&gt;</code> | 声明局部标识符 `matchedProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 310 | <code>        normalizeLlmBaseUrlForProviderMatch(LLM_PROVIDER_DEFAULT_BASE_URLS[providerId]) === normalizedBaseUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 311 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 312 | <code>    return matchedProvider &#124;&#124; normalizedProvider;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 313 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 315 | <code>function normalizeLlmBaseUrl(value) {</code> | 定义函数 `normalizeLlmBaseUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 316 | <code>    const normalizedValue = String(value &#124;&#124; '').trim().replace(/\/+$/, '');</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 317 | <code>    return normalizedValue &#124;&#124; DEFAULT_LLM_BASE_URL;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 318 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>function normalizeLlmModel(value) {</code> | 定义函数 `normalizeLlmModel`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 321 | <code>    const normalizedValue = String(value &#124;&#124; '').trim();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 322 | <code>    return normalizedValue &#124;&#124; DEFAULT_LLM_MODEL;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 323 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 324 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 325 | <code>function normalizeOllamaModelHistory(value) {</code> | 定义函数 `normalizeOllamaModelHistory`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 326 | <code>    const items = Array.isArray(value) ? value : [];</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 327 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 328 | <code>    const result = [];</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 329 | <code>    for (const item of items) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 330 | <code>        const model = String(item &#124;&#124; '').trim();</code> | 声明局部标识符 `model`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 331 | <code>        const key = model.toLowerCase();</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 332 | <code>        if (!model &#124;&#124; seen.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 333 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 334 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 335 | <code>        seen.add(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 336 | <code>        result.push(model.slice(0, 200));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 337 | <code>        if (result.length &gt;= 80) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 338 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 339 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 341 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 342 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 344 | <code>function normalizeOllamaTargetSource(value = '') {</code> | 定义函数 `normalizeOllamaTargetSource`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 345 | <code>    const normalized = String(value &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 346 | <code>    if (['installed', 'existing', 'manual'].includes(normalized)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 347 | <code>        return 'installed';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 348 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 349 | <code>    if (['local', 'local_import', 'local-import', 'file'].includes(normalized)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 350 | <code>        return 'local_import';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 351 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 352 | <code>    if (['online', 'online_pull', 'online-pull', 'remote', 'pull'].includes(normalized)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 353 | <code>        return 'online_pull';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 354 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 355 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 356 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 358 | <code>function ollamaSourceToLegacyMode(source = '') {</code> | 定义函数 `ollamaSourceToLegacyMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 359 | <code>    const normalized = normalizeOllamaTargetSource(source);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 360 | <code>    if (normalized === 'local_import') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 361 | <code>        return 'local';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 362 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 363 | <code>    if (normalized === 'online_pull') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 364 | <code>        return 'online';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 365 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 366 | <code>    return 'installed';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 367 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 369 | <code>function normalizeOllamaTarget(value = {}, fallback = {}) {</code> | 定义函数 `normalizeOllamaTarget`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 370 | <code>    const target = value &amp;&amp; typeof value === 'object' ? value : {};</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 371 | <code>    const source = normalizeOllamaTargetSource(</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 372 | <code>        target.source &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 373 | <code>        target.deploymentMode &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 374 | <code>        target.ollamaDeploymentMode &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 375 | <code>        fallback.source &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 376 | <code>        fallback.ollamaDeploymentMode &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 377 | <code>        fallback.deploymentMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 378 | <code>    ) &#124;&#124; (target.localPath &#124;&#124; target.localModelPath &#124;&#124; fallback.localModelPath ? 'local_import' : 'installed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 379 | <code>    const modelId = normalizeLlmModel(</code> | 声明局部标识符 `modelId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 380 | <code>        target.modelId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 381 | <code>        target.model &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 382 | <code>        fallback.modelId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 383 | <code>        fallback.model &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 384 | <code>        fallback.llmModel &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 385 | <code>        LLM_PROVIDER_DEFAULT_MODELS.ollama</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 386 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 387 | <code>    const localPath = String(</code> | 声明局部标识符 `localPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 388 | <code>        target.localPath &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 389 | <code>        target.localModelPath &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 390 | <code>        fallback.localModelPath &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 391 | <code>        ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 392 | <code>    ).trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 393 | <code>    const remoteModelId = normalizeLlmModel(</code> | 声明局部标识符 `remoteModelId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 394 | <code>        target.remoteModelId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 395 | <code>        target.remoteModel &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 396 | <code>        fallback.remoteModelId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 397 | <code>        (source === 'online_pull' ? modelId : '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 398 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 399 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 400 | <code>        source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 401 | <code>        modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 402 | <code>        localPath: source === 'local_import' ? localPath : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 403 | <code>        remoteModelId: source === 'online_pull' ? remoteModelId : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 404 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 405 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 406 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 407 | <code>function normalizeLlmApiKey(value) {</code> | 定义函数 `normalizeLlmApiKey`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 408 | <code>    return String(value &#124;&#124; '').trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 409 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 410 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 411 | <code>function createLlmApiKeyId(provider = DEFAULT_LLM_PROVIDER, value = '') {</code> | 定义函数 `createLlmApiKeyId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 412 | <code>    const source = `${normalizeLlmProvider(provider)}\u0000${normalizeLlmApiKey(value)}`;</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 413 | <code>    return `key_${crypto.createHash('sha256').update(source).digest('hex').slice(0, 16)}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 414 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 416 | <code>function normalizeLlmApiKeyLabel(value = '', fallback = '默认 Key') {</code> | 定义函数 `normalizeLlmApiKeyLabel`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 417 | <code>    return String(value &#124;&#124; fallback).trim().slice(0, 80) &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 418 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 419 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 420 | <code>function normalizeLlmApiKeyProfile(provider, profile = {}) {</code> | 定义函数 `normalizeLlmApiKeyProfile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 421 | <code>    const normalizedProvider = normalizeLlmProvider(provider);</code> | 声明局部标识符 `normalizedProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 422 | <code>    const rawProfile = profile &amp;&amp; typeof profile === 'object' ? profile : {};</code> | 声明局部标识符 `rawProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 423 | <code>    const rawKeys = Array.isArray(rawProfile.keys)</code> | 声明局部标识符 `rawKeys`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 424 | <code>        ? rawProfile.keys</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 425 | <code>        : Array.isArray(rawProfile)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 426 | <code>            ? rawProfile</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 427 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 428 | <code>    const keys = [];</code> | 声明局部标识符 `keys`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 429 | <code>    const seenIds = new Set();</code> | 声明局部标识符 `seenIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 430 | <code>    const seenValues = new Set();</code> | 声明局部标识符 `seenValues`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 431 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 432 | <code>    rawKeys.forEach((entry, index) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 433 | <code>        const rawEntry = entry &amp;&amp; typeof entry === 'object'</code> | 声明局部标识符 `rawEntry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 434 | <code>            ? entry</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 435 | <code>            : { value: entry };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 436 | <code>        const value = normalizeLlmApiKey(</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 437 | <code>            rawEntry.value &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 438 | <code>            rawEntry.apiKey &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 439 | <code>            rawEntry.key &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 440 | <code>            rawEntry.secret &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 441 | <code>            ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 442 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 443 | <code>        if (!value) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 444 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 445 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 446 | <code>        const id = String(rawEntry.id &#124;&#124; createLlmApiKeyId(normalizedProvider, value)).trim();</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 447 | <code>        const valueFingerprint = createLlmApiKeyId(normalizedProvider, value);</code> | 声明局部标识符 `valueFingerprint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 448 | <code>        if (!id &#124;&#124; seenIds.has(id) &#124;&#124; seenValues.has(valueFingerprint)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 449 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 450 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 451 | <code>        seenIds.add(id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 452 | <code>        seenValues.add(valueFingerprint);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 453 | <code>        keys.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 454 | <code>            id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 455 | <code>            label: normalizeLlmApiKeyLabel(rawEntry.label &#124;&#124; rawEntry.name, `Key ${index + 1}`),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 456 | <code>            value,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 457 | <code>            createdAt: String(rawEntry.createdAt &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 458 | <code>            updatedAt: String(rawEntry.updatedAt &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 459 | <code>            lastUsedAt: String(rawEntry.lastUsedAt &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 460 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 461 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 463 | <code>    const requestedActiveId = String(rawProfile.activeKeyId &#124;&#124; rawProfile.selectedKeyId &#124;&#124; '').trim();</code> | 声明局部标识符 `requestedActiveId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 464 | <code>    const activeKeyId = keys.some((entry) =&gt; entry.id === requestedActiveId)</code> | 声明局部标识符 `activeKeyId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 465 | <code>        ? requestedActiveId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 466 | <code>        : keys[0]?.id &#124;&#124; '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 467 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 468 | <code>        activeKeyId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 469 | <code>        keys</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 470 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 471 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 472 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 473 | <code>function normalizeLlmApiKeyProfiles(value = {}, fallback = {}) {</code> | 定义函数 `normalizeLlmApiKeyProfiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 474 | <code>    const source = value &amp;&amp; typeof value === 'object' ? value : {};</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 475 | <code>    const providerIds = new Set([</code> | 声明局部标识符 `providerIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 476 | <code>        ...LLM_PROVIDER_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 477 | <code>        ...Object.keys(source &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 478 | <code>        normalizeLlmProvider(fallback.provider &#124;&#124; fallback.llmProvider &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 479 | <code>    ].filter(Boolean));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 480 | <code>    const profiles = {};</code> | 声明局部标识符 `profiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 481 | <code>    for (const providerId of providerIds) {</code> | 声明局部标识符 `providerId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 482 | <code>        profiles[providerId] = normalizeLlmApiKeyProfile(providerId, source[providerId]);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 483 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 484 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 485 | <code>    const fallbackProvider = normalizeLlmProvider(fallback.provider &#124;&#124; fallback.llmProvider &#124;&#124; DEFAULT_LLM_PROVIDER);</code> | 声明局部标识符 `fallbackProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 486 | <code>    const fallbackKey = normalizeLlmApiKey(fallback.apiKey &#124;&#124; fallback.llmApiKey &#124;&#124; '');</code> | 声明局部标识符 `fallbackKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 487 | <code>    if (fallbackKey) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 488 | <code>        const profile = profiles[fallbackProvider] &#124;&#124; { activeKeyId: '', keys: [] };</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 489 | <code>        const keyId = createLlmApiKeyId(fallbackProvider, fallbackKey);</code> | 声明局部标识符 `keyId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 490 | <code>        if (!profile.keys.some((entry) =&gt; entry.id === keyId &#124;&#124; entry.value === fallbackKey)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 491 | <code>            profile.keys.unshift({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 492 | <code>                id: keyId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 493 | <code>                label: normalizeLlmApiKeyLabel(fallback.label, '默认 Key'),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 494 | <code>                value: fallbackKey,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 495 | <code>                createdAt: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 496 | <code>                updatedAt: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 497 | <code>                lastUsedAt: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 498 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 500 | <code>        profile.activeKeyId = profile.activeKeyId &#124;&#124; keyId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 501 | <code>        profiles[fallbackProvider] = normalizeLlmApiKeyProfile(fallbackProvider, profile);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 502 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 504 | <code>    return profiles;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 505 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 506 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 507 | <code>function normalizeElevenLabsApiBase(value) {</code> | 定义函数 `normalizeElevenLabsApiBase`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 508 | <code>    const normalizedValue = String(value &#124;&#124; '').trim().replace(/\/+$/, '');</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 509 | <code>    return normalizedValue &#124;&#124; DEFAULT_ELEVENLABS_API_BASE;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 510 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 511 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 512 | <code>function normalizeElevenLabsApiKey(value) {</code> | 定义函数 `normalizeElevenLabsApiKey`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 513 | <code>    return String(value &#124;&#124; '').trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 514 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 516 | <code>function normalizeElevenLabsVoiceId(value) {</code> | 定义函数 `normalizeElevenLabsVoiceId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 517 | <code>    return String(value &#124;&#124; '').trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 518 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 519 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 520 | <code>function normalizeElevenLabsModelId(value) {</code> | 定义函数 `normalizeElevenLabsModelId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 521 | <code>    const normalizedValue = String(value &#124;&#124; '').trim();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 522 | <code>    return normalizedValue &#124;&#124; DEFAULT_ELEVENLABS_MODEL_ID;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 523 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 525 | <code>function normalizeElevenLabsLanguageCode(value) {</code> | 定义函数 `normalizeElevenLabsLanguageCode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 526 | <code>    const normalizedValue = String(value &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 527 | <code>    if (['zh', 'en', 'ja'].includes(normalizedValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 528 | <code>        return normalizedValue;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 529 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 530 | <code>    return DEFAULT_ELEVENLABS_LANGUAGE_CODE;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 531 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 532 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 533 | <code>function normalizeElevenLabsOutputFormat(value) {</code> | 定义函数 `normalizeElevenLabsOutputFormat`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 534 | <code>    const normalizedValue = String(value &#124;&#124; '').trim();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 535 | <code>    return normalizedValue &#124;&#124; DEFAULT_ELEVENLABS_OUTPUT_FORMAT;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 536 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 537 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 538 | <code>function normalizeElevenLabsTimeoutMs(value) {</code> | 定义函数 `normalizeElevenLabsTimeoutMs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 539 | <code>    return Math.round(clampNumber(value, 5000, 120000, DEFAULT_ELEVENLABS_TIMEOUT_MS, 0));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 540 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 541 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 542 | <code>function normalizeElevenLabsOptimizeStreamingLatency(value) {</code> | 定义函数 `normalizeElevenLabsOptimizeStreamingLatency`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 543 | <code>    return Math.round(clampNumber(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 544 | <code>        value,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 545 | <code>        0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 546 | <code>        4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 547 | <code>        DEFAULT_ELEVENLABS_OPTIMIZE_STREAMING_LATENCY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 548 | <code>        0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 549 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 550 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 551 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 552 | <code>function normalizeElevenLabsStability(value) {</code> | 定义函数 `normalizeElevenLabsStability`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 553 | <code>    return clampNumber(value, 0, 1, DEFAULT_ELEVENLABS_STABILITY, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 554 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 555 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 556 | <code>function normalizeElevenLabsSimilarityBoost(value) {</code> | 定义函数 `normalizeElevenLabsSimilarityBoost`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 557 | <code>    return clampNumber(value, 0, 1, DEFAULT_ELEVENLABS_SIMILARITY_BOOST, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 558 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 559 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 560 | <code>function normalizeElevenLabsStyle(value) {</code> | 定义函数 `normalizeElevenLabsStyle`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 561 | <code>    return clampNumber(value, 0, 1, DEFAULT_ELEVENLABS_STYLE, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 562 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 563 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 564 | <code>function normalizeElevenLabsSpeed(value) {</code> | 定义函数 `normalizeElevenLabsSpeed`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 565 | <code>    return clampNumber(value, 0.7, 1.2, DEFAULT_ELEVENLABS_SPEED, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 566 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 568 | <code>function normalizeElevenLabsUseSpeakerBoost(value) {</code> | 定义函数 `normalizeElevenLabsUseSpeakerBoost`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 569 | <code>    return normalizeBoolean(value, DEFAULT_ELEVENLABS_USE_SPEAKER_BOOST);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 570 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 571 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 572 | <code>function normalizeElevenLabsVoiceProfile(value = {}, languageCode = DEFAULT_ELEVENLABS_LANGUAGE_CODE, fallback = {}) {</code> | 定义函数 `normalizeElevenLabsVoiceProfile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 573 | <code>    const normalizedLanguageCode = normalizeElevenLabsLanguageCode(languageCode);</code> | 声明局部标识符 `normalizedLanguageCode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 574 | <code>    const defaults = DEFAULT_ELEVENLABS_VOICE_PROFILES[normalizedLanguageCode] &#124;&#124;</code> | 声明局部标识符 `defaults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 575 | <code>        DEFAULT_ELEVENLABS_VOICE_PROFILES.zh;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 576 | <code>    const source = value &amp;&amp; typeof value === 'object' ? value : {};</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 577 | <code>    const fallbackSource = fallback &amp;&amp; typeof fallback === 'object' ? fallback : {};</code> | 声明局部标识符 `fallbackSource`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 578 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 579 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 580 | <code>        voiceId: normalizeElevenLabsVoiceId(source.voiceId &#124;&#124; fallbackSource.voiceId &#124;&#124; defaults.voiceId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 581 | <code>        modelId: normalizeElevenLabsModelId(source.modelId &#124;&#124; fallbackSource.modelId &#124;&#124; defaults.modelId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 582 | <code>        languageCode: normalizedLanguageCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 583 | <code>        outputFormat: normalizeElevenLabsOutputFormat(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 584 | <code>            source.outputFormat &#124;&#124; fallbackSource.outputFormat &#124;&#124; defaults.outputFormat</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 585 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 586 | <code>        optimizeStreamingLatency: normalizeElevenLabsOptimizeStreamingLatency(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 587 | <code>            source.optimizeStreamingLatency ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 588 | <code>                fallbackSource.optimizeStreamingLatency ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 589 | <code>                defaults.optimizeStreamingLatency</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 590 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 591 | <code>        stability: normalizeElevenLabsStability(source.stability ?? fallbackSource.stability ?? defaults.stability),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 592 | <code>        similarityBoost: normalizeElevenLabsSimilarityBoost(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 593 | <code>            source.similarityBoost ?? fallbackSource.similarityBoost ?? defaults.similarityBoost</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 594 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 595 | <code>        style: normalizeElevenLabsStyle(source.style ?? fallbackSource.style ?? defaults.style),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 596 | <code>        speed: normalizeElevenLabsSpeed(source.speed ?? fallbackSource.speed ?? defaults.speed),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 597 | <code>        useSpeakerBoost: normalizeElevenLabsUseSpeakerBoost(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 598 | <code>            source.useSpeakerBoost ?? fallbackSource.useSpeakerBoost ?? defaults.useSpeakerBoost</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 599 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 600 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 601 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 603 | <code>function createLegacyElevenLabsVoiceProfile(preferences = {}) {</code> | 定义函数 `createLegacyElevenLabsVoiceProfile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 604 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 605 | <code>        voiceId: preferences.elevenLabsVoiceId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 606 | <code>        modelId: preferences.elevenLabsModelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 607 | <code>        languageCode: preferences.elevenLabsLanguageCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 608 | <code>        outputFormat: preferences.elevenLabsOutputFormat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 609 | <code>        optimizeStreamingLatency: preferences.elevenLabsOptimizeStreamingLatency,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 610 | <code>        stability: preferences.elevenLabsStability,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 611 | <code>        similarityBoost: preferences.elevenLabsSimilarityBoost,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 612 | <code>        style: preferences.elevenLabsStyle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 613 | <code>        speed: preferences.elevenLabsSpeed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 614 | <code>        useSpeakerBoost: preferences.elevenLabsUseSpeakerBoost</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 615 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 616 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 617 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 618 | <code>function normalizeElevenLabsVoiceProfiles(value = {}, preferences = {}) {</code> | 定义函数 `normalizeElevenLabsVoiceProfiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 619 | <code>    const source = value &amp;&amp; typeof value === 'object' ? value : {};</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 620 | <code>    const legacyProfile = createLegacyElevenLabsVoiceProfile(preferences);</code> | 声明局部标识符 `legacyProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 621 | <code>    const legacyLanguage = normalizeElevenLabsLanguageCode(</code> | 声明局部标识符 `legacyLanguage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 622 | <code>        preferences.elevenLabsLanguageCode &#124;&#124; DEFAULT_ELEVENLABS_LANGUAGE_CODE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 623 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 624 | <code>    const legacyVoiceFallback = {</code> | 声明局部标识符 `legacyVoiceFallback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 625 | <code>        voiceId: preferences.elevenLabsVoiceId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 626 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 627 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 628 | <code>    return Object.fromEntries(ELEVENLABS_LANGUAGE_CODES.map((languageCode) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 629 | <code>        const profileSource = source[languageCode] &amp;&amp; typeof source[languageCode] === 'object'</code> | 声明局部标识符 `profileSource`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 630 | <code>            ? source[languageCode]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 631 | <code>            : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 632 | <code>        const fallback = Object.keys(profileSource).length</code> | 声明局部标识符 `fallback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 633 | <code>            ? legacyVoiceFallback</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 634 | <code>            : {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 635 | <code>                ...legacyVoiceFallback,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 636 | <code>                ...(languageCode === legacyLanguage ? legacyProfile : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 637 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 638 | <code>        return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 639 | <code>            languageCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 640 | <code>            normalizeElevenLabsVoiceProfile(profileSource, languageCode, fallback)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 641 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 642 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 643 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 644 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 645 | <code>function normalizeLlmTemperature(value) {</code> | 定义函数 `normalizeLlmTemperature`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 646 | <code>    return clampNumber(value, 0, 2, DEFAULT_LLM_TEMPERATURE);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 647 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 648 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 649 | <code>function normalizeLlmRequestTimeoutMs(value) {</code> | 定义函数 `normalizeLlmRequestTimeoutMs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 650 | <code>    return Math.round(clampNumber(value, 5000, 300000, DEFAULT_LLM_REQUEST_TIMEOUT_MS, 0));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 651 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 652 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 653 | <code>function normalizeComputerControlEnabled(value) {</code> | 定义函数 `normalizeComputerControlEnabled`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 654 | <code>    return normalizeBoolean(value, DEFAULT_COMPUTER_CONTROL_ENABLED);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 655 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 656 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 657 | <code>function normalizeEmberHarnessMode(value) {</code> | 定义函数 `normalizeEmberHarnessMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 658 | <code>    const normalizedValue = String(value &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 659 | <code>    return EMBER_HARNESS_MODE_OPTIONS.includes(normalizedValue)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 660 | <code>        ? normalizedValue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 661 | <code>        : DEFAULT_EMBER_HARNESS_MODE;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 662 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 663 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 664 | <code>function normalizeChunkedTtsEnabled(value) {</code> | 定义函数 `normalizeChunkedTtsEnabled`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 665 | <code>    return normalizeBoolean(value, DEFAULT_CHUNKED_TTS_ENABLED);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 666 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 667 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 668 | <code>function normalizeEmailAuthType(value) {</code> | 定义函数 `normalizeEmailAuthType`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 669 | <code>    const normalizedValue = String(value &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 670 | <code>    return ['password', 'oauth2'].includes(normalizedValue) ? normalizedValue : 'password';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 671 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 672 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 673 | <code>function normalizeEmailProfiles(value = {}) {</code> | 定义函数 `normalizeEmailProfiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 674 | <code>    const source = value &amp;&amp; typeof value === 'object' ? value : {};</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 675 | <code>    return Object.fromEntries(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 676 | <code>        EMAIL_PROVIDER_OPTIONS.map((providerId) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 677 | <code>            const profile = source[providerId] &amp;&amp; typeof source[providerId] === 'object'</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 678 | <code>                ? source[providerId]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 679 | <code>                : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 680 | <code>            return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 681 | <code>                providerId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 682 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 683 | <code>                    account: String(profile.account &#124;&#124; profile.email &#124;&#124; '').trim(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 684 | <code>                    secret: String(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 685 | <code>                        profile.secret &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 686 | <code>                            profile.password &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 687 | <code>                            profile.appPassword &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 688 | <code>                            profile.authCode &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 689 | <code>                            profile.accessToken &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 690 | <code>                            ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 691 | <code>                    ).trim(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 692 | <code>                    authType: normalizeEmailAuthType(profile.authType &#124;&#124; profile.auth?.type)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 693 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 694 | <code>            ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 695 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 696 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 697 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 698 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 699 | <code>function normalizeSpeechMode(mode) {</code> | 定义函数 `normalizeSpeechMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 700 | <code>    const normalizedMode = String(mode &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalizedMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 701 | <code>    if (SPEECH_MODE_OPTIONS.includes(normalizedMode)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 702 | <code>        return normalizedMode;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 703 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 704 | <code>    if (['elevenlabs', 'eleven-labs', 'eleven_labs', 'server_tts', 'cloud'].includes(normalizedMode)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 705 | <code>        return 'server';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 706 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 707 | <code>    if (['cosyvoice', 'cosy-voice', 'cosy_voice'].includes(normalizedMode)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 708 | <code>        return 'cosyvoice3';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 709 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 710 | <code>    return 'off';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 711 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 712 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 713 | <code>function normalizeRecognitionMode(mode) {</code> | 定义函数 `normalizeRecognitionMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 714 | <code>    const normalizedMode = String(mode &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalizedMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 715 | <code>    return RECOGNITION_MODE_OPTIONS.includes(normalizedMode) ? normalizedMode : 'auto-vad';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 716 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 717 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 718 | <code>function normalizePetScale(scale) {</code> | 定义函数 `normalizePetScale`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 719 | <code>    const numericScale = Number(scale);</code> | 声明局部标识符 `numericScale`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 720 | <code>    if (!Number.isFinite(numericScale)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 721 | <code>        return DEFAULT_PET_SCALE;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 722 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 723 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 724 | <code>    return PET_SCALE_OPTIONS.reduce((closestScale, option) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 725 | <code>        const nextDistance = Math.abs(option - numericScale);</code> | 声明局部标识符 `nextDistance`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 726 | <code>        const closestDistance = Math.abs(closestScale - numericScale);</code> | 声明局部标识符 `closestDistance`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 727 | <code>        return nextDistance &lt; closestDistance ? option : closestScale;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 728 | <code>    }, PET_SCALE_OPTIONS[0]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 729 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 730 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 731 | <code>function normalizeCameraDistance(value) {</code> | 定义函数 `normalizeCameraDistance`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 732 | <code>    return clampNumber(value, 0.75, 1.8, DEFAULT_CAMERA_DISTANCE);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 733 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>function normalizeCameraHeight(value) {</code> | 定义函数 `normalizeCameraHeight`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 736 | <code>    return clampNumber(value, 0.7, 1.8, DEFAULT_CAMERA_HEIGHT);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 737 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 738 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 739 | <code>function normalizeCameraTargetY(value) {</code> | 定义函数 `normalizeCameraTargetY`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 740 | <code>    return clampNumber(value, 0.5, 1.5, DEFAULT_CAMERA_TARGET_Y);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 741 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 742 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 743 | <code>function normalizeRenderProfileId(value) {</code> | 定义函数 `normalizeRenderProfileId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 744 | <code>    const normalizedValue = String(value &#124;&#124; '').trim();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 745 | <code>    const aliasedValue = LEGACY_RENDER_PROFILE_ID_ALIASES[normalizedValue] &#124;&#124; normalizedValue;</code> | 声明局部标识符 `aliasedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 746 | <code>    return RENDER_PROFILE_OPTIONS.includes(aliasedValue)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 747 | <code>        ? aliasedValue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 748 | <code>        : DEFAULT_RENDER_PROFILE_ID;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 749 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 750 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 751 | <code>function normalizeRenderLightYawDeg(value) {</code> | 定义函数 `normalizeRenderLightYawDeg`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 752 | <code>    return clampNumber(value, -75, 75, DEFAULT_RENDER_LIGHT_YAW_DEG, 0);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 753 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 754 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 755 | <code>function normalizeRenderKeyLightScale(value) {</code> | 定义函数 `normalizeRenderKeyLightScale`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 756 | <code>    return clampNumber(value, 0.65, 1.45, DEFAULT_RENDER_KEY_LIGHT_SCALE, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 757 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 758 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 759 | <code>function normalizeRenderAmbientFillScale(value) {</code> | 定义函数 `normalizeRenderAmbientFillScale`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 760 | <code>    return clampNumber(value, 0.55, 1.35, DEFAULT_RENDER_AMBIENT_FILL_SCALE, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 761 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 762 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 763 | <code>function normalizeRenderOutlineScale(value) {</code> | 定义函数 `normalizeRenderOutlineScale`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 764 | <code>    return clampNumber(value, 0.25, 1.2, DEFAULT_RENDER_OUTLINE_SCALE, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 765 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 766 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 767 | <code>function normalizeRenderShadowEnabled(value) {</code> | 定义函数 `normalizeRenderShadowEnabled`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 768 | <code>    return normalizeBoolean(value, DEFAULT_RENDER_SHADOW_ENABLED);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 769 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 770 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 771 | <code>function normalizeRenderQualityLevel(value, fallbackValue = 3) {</code> | 定义函数 `normalizeRenderQualityLevel`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 772 | <code>    return clampNumber(value, 1, 3, fallbackValue, 0);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 773 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 774 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 775 | <code>function normalizeRenderResolutionScale(value) {</code> | 定义函数 `normalizeRenderResolutionScale`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 776 | <code>    return clampNumber(value, 0.5, 3, DEFAULT_RENDER_RESOLUTION_SCALE, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 777 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 778 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 779 | <code>function normalizeRenderFpsLimit(value) {</code> | 定义函数 `normalizeRenderFpsLimit`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 780 | <code>    const numericValue = Number(value);</code> | 声明局部标识符 `numericValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 781 | <code>    if (!Number.isFinite(numericValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 782 | <code>        return DEFAULT_RENDER_FPS_LIMIT;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 783 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 784 | <code>    return RENDER_FPS_LIMIT_OPTIONS.reduce((closestValue, optionValue) =&gt; (</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 785 | <code>        Math.abs(optionValue - numericValue) &lt; Math.abs(closestValue - numericValue)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 786 | <code>            ? optionValue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 787 | <code>            : closestValue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 788 | <code>    ), DEFAULT_RENDER_FPS_LIMIT);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 789 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 790 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 791 | <code>function normalizeRenderShadowQuality(value) {</code> | 定义函数 `normalizeRenderShadowQuality`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 792 | <code>    return normalizeRenderQualityLevel(value, DEFAULT_RENDER_SHADOW_QUALITY);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 793 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 794 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 795 | <code>function normalizeRenderOutlineEnabled(value) {</code> | 定义函数 `normalizeRenderOutlineEnabled`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 796 | <code>    return normalizeBoolean(value, DEFAULT_RENDER_OUTLINE_ENABLED);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 797 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 798 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 799 | <code>function normalizeRenderAntialiasEnabled(value) {</code> | 定义函数 `normalizeRenderAntialiasEnabled`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 800 | <code>    return normalizeBoolean(value, DEFAULT_RENDER_ANTIALIAS_ENABLED);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 801 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 802 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 803 | <code>function normalizeDesktopNativeTTSRate(value) {</code> | 定义函数 `normalizeDesktopNativeTTSRate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 804 | <code>    return clampNumber(value, 0.6, 1.4, DEFAULT_DESKTOP_NATIVE_TTS_RATE);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 805 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 806 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 807 | <code>function normalizeDesktopNativeTTSPitch(value) {</code> | 定义函数 `normalizeDesktopNativeTTSPitch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 808 | <code>    return clampNumber(value, 0.6, 1.6, DEFAULT_DESKTOP_NATIVE_TTS_PITCH);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 809 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 810 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 811 | <code>function normalizeDesktopNativeTTSVolume(value) {</code> | 定义函数 `normalizeDesktopNativeTTSVolume`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 812 | <code>    return clampNumber(value, 0, 1, DEFAULT_DESKTOP_NATIVE_TTS_VOLUME);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 813 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 814 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 815 | <code>function normalizeAutoChatEnabled(value) {</code> | 定义函数 `normalizeAutoChatEnabled`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 816 | <code>    return normalizeBoolean(value, DEFAULT_AUTO_CHAT_ENABLED);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 817 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 818 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 819 | <code>function normalizeAutoChatMode(value, enabled = DEFAULT_AUTO_CHAT_ENABLED) {</code> | 定义函数 `normalizeAutoChatMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 820 | <code>    const mode = String(value &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `mode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 821 | <code>    if (['off', 'companion', 'cowork'].includes(mode)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 822 | <code>        return mode;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 823 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 824 | <code>    if (mode === 'autonomous') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 825 | <code>        return 'off';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 826 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 827 | <code>    return normalizeAutoChatEnabled(enabled) ? 'companion' : DEFAULT_AUTO_CHAT_MODE;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 828 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 829 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 830 | <code>function isAutoChatModeEnabled(mode) {</code> | 定义函数 `isAutoChatModeEnabled`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 831 | <code>    return ['companion', 'cowork'].includes(normalizeAutoChatMode(mode));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 832 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 833 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 834 | <code>function normalizeAutoChatMinIntervalSec(value) {</code> | 定义函数 `normalizeAutoChatMinIntervalSec`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 835 | <code>    return Math.round(clampNumber(value, 10, 1800, DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC, 0));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 836 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 837 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 838 | <code>function normalizeAutoChatMaxIntervalSec(value, minimum = DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC) {</code> | 定义函数 `normalizeAutoChatMaxIntervalSec`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 839 | <code>    const normalizedValue = Math.round(</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 840 | <code>        clampNumber(value, minimum, 3600, DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC, 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 841 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 842 | <code>    return Math.max(minimum, normalizedValue);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 843 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 844 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 845 | <code>function normalizeAvatarDialogueBubbleLeft(value) {</code> | 定义函数 `normalizeAvatarDialogueBubbleLeft`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 846 | <code>    return Math.round(clampNumber(value, 0, 640, DEFAULT_AVATAR_DIALOGUE_BUBBLE_LEFT, 0));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 847 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 848 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 849 | <code>function normalizeAvatarDialogueBubbleTop(value) {</code> | 定义函数 `normalizeAvatarDialogueBubbleTop`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 850 | <code>    return Math.round(clampNumber(value, 0, 480, DEFAULT_AVATAR_DIALOGUE_BUBBLE_TOP, 0));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 851 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 852 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 853 | <code>function normalizeAvatarDialogueBubbleScale(value) {</code> | 定义函数 `normalizeAvatarDialogueBubbleScale`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 854 | <code>    return clampNumber(value, 0.75, 1.35, DEFAULT_AVATAR_DIALOGUE_BUBBLE_SCALE, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 855 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 856 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 857 | <code>function normalizeAvatarDialogueBubbleExtraWidth(value) {</code> | 定义函数 `normalizeAvatarDialogueBubbleExtraWidth`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 858 | <code>    return Math.round(clampNumber(value, 0, 520, DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH, 0));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 859 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 860 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 861 | <code>function normalizeAvatarDialogueBubbleExtraTop(value) {</code> | 定义函数 `normalizeAvatarDialogueBubbleExtraTop`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 862 | <code>    return Math.round(clampNumber(value, 0, 360, DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP, 0));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 863 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 864 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 865 | <code>function normalizePetMouseHitTestEnabled(value) {</code> | 定义函数 `normalizePetMouseHitTestEnabled`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 866 | <code>    return normalizeBoolean(value, DEFAULT_PET_MOUSE_HIT_TEST_ENABLED);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 867 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 868 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 869 | <code>function normalizePetMouseHitTestShape(value) {</code> | 定义函数 `normalizePetMouseHitTestShape`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 870 | <code>    const normalizedValue = String(value &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 871 | <code>    return ['ellipse', 'rectangle'].includes(normalizedValue)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 872 | <code>        ? normalizedValue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 873 | <code>        : DEFAULT_PET_MOUSE_HIT_TEST_SHAPE;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 874 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 875 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 876 | <code>function normalizePetMouseHitTestWidthRatio(value) {</code> | 定义函数 `normalizePetMouseHitTestWidthRatio`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 877 | <code>    return clampNumber(value, 0.2, 1, DEFAULT_PET_MOUSE_HIT_TEST_WIDTH_RATIO, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 878 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 879 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 880 | <code>function normalizePetMouseHitTestHeightRatio(value) {</code> | 定义函数 `normalizePetMouseHitTestHeightRatio`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 881 | <code>    return clampNumber(value, 0.25, 1, DEFAULT_PET_MOUSE_HIT_TEST_HEIGHT_RATIO, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 882 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 883 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 884 | <code>function normalizePetMouseHitTestOffsetXRatio(value) {</code> | 定义函数 `normalizePetMouseHitTestOffsetXRatio`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 885 | <code>    return clampNumber(value, -0.5, 0.5, DEFAULT_PET_MOUSE_HIT_TEST_OFFSET_X_RATIO, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 886 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 887 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 888 | <code>function normalizePetMouseHitTestOffsetYRatio(value) {</code> | 定义函数 `normalizePetMouseHitTestOffsetYRatio`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 889 | <code>    return clampNumber(value, -0.5, 0.5, DEFAULT_PET_MOUSE_HIT_TEST_OFFSET_Y_RATIO, 2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 890 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 891 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 892 | <code>function normalizePetMouseHitTestDebug(value) {</code> | 定义函数 `normalizePetMouseHitTestDebug`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 893 | <code>    return normalizeBoolean(value, DEFAULT_PET_MOUSE_HIT_TEST_DEBUG);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 894 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 895 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 896 | <code>function getScaledPetSize(scale = DEFAULT_PET_SCALE) {</code> | 定义函数 `getScaledPetSize`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 897 | <code>    const normalizedScale = normalizePetScale(scale);</code> | 声明局部标识符 `normalizedScale`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 898 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 899 | <code>        width: Math.round(PET_BASE_WIDTH * normalizedScale),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 900 | <code>        height: Math.round(PET_BASE_HEIGHT * normalizedScale)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 901 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 902 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 903 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 904 | <code>function resizePetBounds(bounds, scale = DEFAULT_PET_SCALE) {</code> | 定义函数 `resizePetBounds`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 905 | <code>    const nextSize = getScaledPetSize(scale);</code> | 声明局部标识符 `nextSize`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 906 | <code>    const centerX = bounds.x + bounds.width / 2;</code> | 声明局部标识符 `centerX`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 907 | <code>    const bottomY = bounds.y + bounds.height;</code> | 声明局部标识符 `bottomY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 908 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 909 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 910 | <code>        x: Math.round(centerX - nextSize.width / 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 911 | <code>        y: Math.round(bottomY - nextSize.height),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 912 | <code>        width: nextSize.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 913 | <code>        height: nextSize.height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 914 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 915 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 916 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 917 | <code>function getDefaultState() {</code> | 定义函数 `getDefaultState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 918 | <code>    const workArea = screen?.getPrimaryDisplay?.().workArea &#124;&#124; {</code> | 声明局部标识符 `workArea`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 919 | <code>        x: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 920 | <code>        y: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 921 | <code>        width: 1280,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 922 | <code>        height: 720</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 923 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 924 | <code>    const petScale = DEFAULT_PET_SCALE;</code> | 声明局部标识符 `petScale`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 925 | <code>    const petSize = getScaledPetSize(petScale);</code> | 声明局部标识符 `petSize`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 926 | <code>    const chatWidth = 420;</code> | 声明局部标识符 `chatWidth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 927 | <code>    const chatHeight = 620;</code> | 声明局部标识符 `chatHeight`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 928 | <code>    const controlWidth = Math.min(980, workArea.width - 48);</code> | 声明局部标识符 `controlWidth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 929 | <code>    const controlHeight = Math.min(760, workArea.height - 48);</code> | 声明局部标识符 `controlHeight`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 930 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 931 | <code>    const petX = workArea.x + workArea.width - petSize.width - 32;</code> | 声明局部标识符 `petX`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 932 | <code>    const petY = workArea.y + workArea.height - petSize.height - 24;</code> | 声明局部标识符 `petY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 933 | <code>    const chatX = Math.max(workArea.x + 24, petX - chatWidth - 24);</code> | 声明局部标识符 `chatX`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 934 | <code>    const chatY = Math.max(workArea.y + 24, petY + 32);</code> | 声明局部标识符 `chatY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 935 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 936 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 937 | <code>        version: STATE_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 938 | <code>        petWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 939 | <code>            bounds: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 940 | <code>                x: petX,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 941 | <code>                y: petY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 942 | <code>                width: petSize.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 943 | <code>                height: petSize.height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 944 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 945 | <code>            visible: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 946 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 947 | <code>        chatWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 948 | <code>            bounds: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 949 | <code>                x: chatX,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 950 | <code>                y: chatY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 951 | <code>                width: chatWidth,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 952 | <code>                height: chatHeight</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 953 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 954 | <code>            visible: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 955 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 956 | <code>        controlWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 957 | <code>            bounds: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 958 | <code>                x: Math.round(workArea.x + (workArea.width - controlWidth) / 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 959 | <code>                y: Math.round(workArea.y + (workArea.height - controlHeight) / 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 960 | <code>                width: controlWidth,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 961 | <code>                height: controlHeight</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 962 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 963 | <code>            visible: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 964 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 965 | <code>        preferences: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 966 | <code>            petSkipTaskbar: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 967 | <code>            petScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 968 | <code>            speechMode: 'off',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 969 | <code>            recognitionMode: 'auto-vad',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 970 | <code>            conversationMode: DEFAULT_CONVERSATION_MODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 971 | <code>            uiLanguage: DEFAULT_UI_LANGUAGE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 972 | <code>            preferredMicDeviceId: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 973 | <code>            backendBaseUrl: DEFAULT_BACKEND_BASE_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 974 | <code>            backendMode: DEFAULT_BACKEND_MODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 975 | <code>            agentRuntimeGatewayUrl: DEFAULT_AGENT_RUNTIME_GATEWAY_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 976 | <code>            openclawGatewayUrl: DEFAULT_OPENCLAW_GATEWAY_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 977 | <code>            ailisStateDir: DEFAULT_AILIS_STATE_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 978 | <code>            voiceRuntimeRoot: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 979 | <code>            llmProvider: DEFAULT_LLM_PROVIDER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 980 | <code>            llmBaseUrl: DEFAULT_LLM_BASE_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 981 | <code>            llmModel: DEFAULT_LLM_MODEL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 982 | <code>            ollamaTarget: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 983 | <code>                source: 'installed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 984 | <code>                modelId: LLM_PROVIDER_DEFAULT_MODELS.ollama,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 985 | <code>                localPath: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 986 | <code>                remoteModelId: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 987 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 988 | <code>            ollamaDeploymentMode: 'installed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 989 | <code>            ollamaLocalModelPath: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 990 | <code>            ollamaInstalledModels: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 991 | <code>            ollamaUsedModels: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 992 | <code>            llmApiKey: DEFAULT_LLM_API_KEY,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 993 | <code>            llmApiKeyProfiles: normalizeLlmApiKeyProfiles(),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 994 | <code>            llmTemperature: DEFAULT_LLM_TEMPERATURE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 995 | <code>            llmRequestTimeoutMs: DEFAULT_LLM_REQUEST_TIMEOUT_MS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 996 | <code>            elevenLabsApiBase: DEFAULT_ELEVENLABS_API_BASE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 997 | <code>            elevenLabsApiKey: DEFAULT_ELEVENLABS_API_KEY,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 998 | <code>            elevenLabsVoiceId: DEFAULT_ELEVENLABS_VOICE_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 999 | <code>            elevenLabsModelId: DEFAULT_ELEVENLABS_MODEL_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1000 | <code>            elevenLabsLanguageCode: DEFAULT_ELEVENLABS_LANGUAGE_CODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1001 | <code>            elevenLabsOutputFormat: DEFAULT_ELEVENLABS_OUTPUT_FORMAT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1002 | <code>            elevenLabsTimeoutMs: DEFAULT_ELEVENLABS_TIMEOUT_MS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1003 | <code>            elevenLabsOptimizeStreamingLatency: DEFAULT_ELEVENLABS_OPTIMIZE_STREAMING_LATENCY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1004 | <code>            elevenLabsStability: DEFAULT_ELEVENLABS_STABILITY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1005 | <code>            elevenLabsSimilarityBoost: DEFAULT_ELEVENLABS_SIMILARITY_BOOST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1006 | <code>            elevenLabsStyle: DEFAULT_ELEVENLABS_STYLE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1007 | <code>            elevenLabsSpeed: DEFAULT_ELEVENLABS_SPEED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1008 | <code>            elevenLabsUseSpeakerBoost: DEFAULT_ELEVENLABS_USE_SPEAKER_BOOST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1009 | <code>            elevenLabsVoiceProfiles: normalizeElevenLabsVoiceProfiles(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1010 | <code>            computerControlEnabled: DEFAULT_COMPUTER_CONTROL_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1011 | <code>            emberHarnessMode: DEFAULT_EMBER_HARNESS_MODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1012 | <code>            cameraDistance: DEFAULT_CAMERA_DISTANCE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1013 | <code>            cameraHeight: DEFAULT_CAMERA_HEIGHT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1014 | <code>            cameraTargetY: DEFAULT_CAMERA_TARGET_Y,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1015 | <code>            renderProfileId: DEFAULT_RENDER_PROFILE_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1016 | <code>            renderLightYawDeg: DEFAULT_RENDER_LIGHT_YAW_DEG,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1017 | <code>            renderKeyLightScale: DEFAULT_RENDER_KEY_LIGHT_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1018 | <code>            renderAmbientFillScale: DEFAULT_RENDER_AMBIENT_FILL_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1019 | <code>            renderOutlineScale: DEFAULT_RENDER_OUTLINE_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1020 | <code>            renderShadowEnabled: DEFAULT_RENDER_SHADOW_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1021 | <code>            renderResolutionScale: DEFAULT_RENDER_RESOLUTION_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1022 | <code>            renderFpsLimit: DEFAULT_RENDER_FPS_LIMIT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1023 | <code>            renderShadowQuality: DEFAULT_RENDER_SHADOW_QUALITY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1024 | <code>            renderOutlineEnabled: DEFAULT_RENDER_OUTLINE_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1025 | <code>            renderAntialiasEnabled: DEFAULT_RENDER_ANTIALIAS_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1026 | <code>            desktopNativeTtsRate: DEFAULT_DESKTOP_NATIVE_TTS_RATE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1027 | <code>            desktopNativeTtsPitch: DEFAULT_DESKTOP_NATIVE_TTS_PITCH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1028 | <code>            desktopNativeTtsVolume: DEFAULT_DESKTOP_NATIVE_TTS_VOLUME,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1029 | <code>            chunkedTtsEnabled: DEFAULT_CHUNKED_TTS_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1030 | <code>            autoChatMode: DEFAULT_AUTO_CHAT_MODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1031 | <code>            autoChatEnabled: DEFAULT_AUTO_CHAT_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1032 | <code>            autoChatMinIntervalSec: DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1033 | <code>            autoChatMaxIntervalSec: DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1034 | <code>            avatarDialogueBubbleLeft: DEFAULT_AVATAR_DIALOGUE_BUBBLE_LEFT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1035 | <code>            avatarDialogueBubbleTop: DEFAULT_AVATAR_DIALOGUE_BUBBLE_TOP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1036 | <code>            avatarDialogueBubbleScale: DEFAULT_AVATAR_DIALOGUE_BUBBLE_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1037 | <code>            avatarDialogueBubbleExtraWidth: DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1038 | <code>            avatarDialogueBubbleExtraTop: DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1039 | <code>            petMouseHitTestEnabled: DEFAULT_PET_MOUSE_HIT_TEST_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1040 | <code>            petMouseHitTestShape: DEFAULT_PET_MOUSE_HIT_TEST_SHAPE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1041 | <code>            petMouseHitTestWidthRatio: DEFAULT_PET_MOUSE_HIT_TEST_WIDTH_RATIO,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1042 | <code>            petMouseHitTestHeightRatio: DEFAULT_PET_MOUSE_HIT_TEST_HEIGHT_RATIO,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1043 | <code>            petMouseHitTestOffsetXRatio: DEFAULT_PET_MOUSE_HIT_TEST_OFFSET_X_RATIO,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1044 | <code>            petMouseHitTestOffsetYRatio: DEFAULT_PET_MOUSE_HIT_TEST_OFFSET_Y_RATIO,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1045 | <code>            petMouseHitTestDebug: DEFAULT_PET_MOUSE_HIT_TEST_DEBUG,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1046 | <code>            emailProfiles: normalizeEmailProfiles(DEFAULT_EMAIL_PROFILES)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1047 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1048 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1049 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1050 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1051 | <code>function getStateFilePath(app) {</code> | 定义函数 `getStateFilePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1052 | <code>    return path.join(app.getPath('userData'), STATE_FILE_NAME);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1053 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1054 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1055 | <code>function normalizeState(inputState) {</code> | 定义函数 `normalizeState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1056 | <code>    const defaults = getDefaultState();</code> | 声明局部标识符 `defaults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1057 | <code>    const nextState = inputState &amp;&amp; typeof inputState === 'object' ? inputState : {};</code> | 声明局部标识符 `nextState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1058 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1059 | <code>    const normalizedState = {</code> | 声明局部标识符 `normalizedState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1060 | <code>        ...defaults,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1061 | <code>        ...nextState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1062 | <code>        petWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1063 | <code>            ...defaults.petWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1064 | <code>            ...(nextState.petWindow &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1065 | <code>            bounds: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1066 | <code>                ...defaults.petWindow.bounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1067 | <code>                ...(nextState.petWindow?.bounds &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1068 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1069 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1070 | <code>        chatWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1071 | <code>            ...defaults.chatWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1072 | <code>            ...(nextState.chatWindow &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1073 | <code>            bounds: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1074 | <code>                ...defaults.chatWindow.bounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1075 | <code>                ...(nextState.chatWindow?.bounds &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1076 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1077 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1078 | <code>        controlWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1079 | <code>            ...defaults.controlWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1080 | <code>            ...(nextState.controlWindow &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1081 | <code>            bounds: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1082 | <code>                ...defaults.controlWindow.bounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1083 | <code>                ...(nextState.controlWindow?.bounds &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1084 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1085 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1086 | <code>        preferences: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1087 | <code>            ...defaults.preferences,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1088 | <code>            ...(nextState.preferences &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1089 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1090 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1091 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1092 | <code>    if ((nextState.version &#124;&#124; 0) &lt; 15 &amp;&amp; normalizedState.preferences.recognitionMode === 'manual') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1093 | <code>        normalizedState.preferences.recognitionMode = 'auto-vad';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1094 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1095 | <code>    if ((nextState.version &#124;&#124; 0) &lt; 23) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1096 | <code>        const legacyPreferences = nextState.preferences &#124;&#124; {};</code> | 声明局部标识符 `legacyPreferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1097 | <code>        const hasLegacyResolutionScale = Object.prototype.hasOwnProperty.call(</code> | 声明局部标识符 `hasLegacyResolutionScale`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1098 | <code>            legacyPreferences,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1099 | <code>            'renderResolutionScale'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1100 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1101 | <code>        const hasLegacyFpsLimit = Object.prototype.hasOwnProperty.call(</code> | 声明局部标识符 `hasLegacyFpsLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1102 | <code>            legacyPreferences,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1103 | <code>            'renderFpsLimit'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1104 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1105 | <code>        const legacyResolutionLevel = Math.round(Number(legacyPreferences.renderResolutionScale));</code> | 声明局部标识符 `legacyResolutionLevel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1106 | <code>        const legacyFpsLevel = Math.round(Number(legacyPreferences.renderFpsLimit));</code> | 声明局部标识符 `legacyFpsLevel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1107 | <code>        const legacyResolutionMap = { 1: 1, 2: 1.5, 3: 2 };</code> | 声明局部标识符 `legacyResolutionMap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1108 | <code>        const legacyFpsMap = { 1: 30, 2: 45, 3: 60 };</code> | 声明局部标识符 `legacyFpsMap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1109 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1110 | <code>            hasLegacyResolutionScale &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1111 | <code>            Object.prototype.hasOwnProperty.call(legacyResolutionMap, legacyResolutionLevel)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1112 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1113 | <code>            normalizedState.preferences.renderResolutionScale = legacyResolutionMap[legacyResolutionLevel];</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1114 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1115 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1116 | <code>            hasLegacyFpsLimit &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1117 | <code>            Object.prototype.hasOwnProperty.call(legacyFpsMap, legacyFpsLevel)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1118 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1119 | <code>            normalizedState.preferences.renderFpsLimit = legacyFpsMap[legacyFpsLevel];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1120 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1121 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1123 | <code>    normalizedState.preferences.petScale = normalizePetScale(normalizedState.preferences.petScale);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1124 | <code>    normalizedState.preferences.speechMode = normalizeSpeechMode(normalizedState.preferences.speechMode);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1125 | <code>    normalizedState.preferences.recognitionMode = normalizeRecognitionMode(normalizedState.preferences.recognitionMode);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1126 | <code>    normalizedState.preferences.conversationMode = normalizeConversationMode(</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1127 | <code>        normalizedState.preferences.conversationMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1128 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1129 | <code>    normalizedState.preferences.uiLanguage = normalizeUiLanguage(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1130 | <code>        normalizedState.preferences.uiLanguage</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1131 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1132 | <code>    normalizedState.preferences.preferredMicDeviceId = normalizePreferredMicDeviceId(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1133 | <code>        normalizedState.preferences.preferredMicDeviceId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1134 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1135 | <code>    normalizedState.preferences.backendBaseUrl = normalizeBackendBaseUrl(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1136 | <code>        normalizedState.preferences.backendBaseUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1137 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1138 | <code>    normalizedState.preferences.backendMode = normalizeBackendMode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1139 | <code>        normalizedState.preferences.backendMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1140 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1141 | <code>    normalizedState.preferences.agentRuntimeGatewayUrl = normalizeAgentRuntimeGatewayUrl(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1142 | <code>        normalizedState.preferences.agentRuntimeGatewayUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1143 | <code>        normalizedState.preferences.openclawGatewayUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1144 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1145 | <code>    normalizedState.preferences.openclawGatewayUrl = normalizeOpenClawGatewayUrl(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1146 | <code>        normalizedState.preferences.openclawGatewayUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1147 | <code>        normalizedState.preferences.agentRuntimeGatewayUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1148 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1149 | <code>    normalizedState.preferences.ailisStateDir = normalizeAILISStateDir(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1150 | <code>        normalizedState.preferences.ailisStateDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1151 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1152 | <code>    normalizedState.preferences.voiceRuntimeRoot = normalizeVoiceRuntimeRoot(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1153 | <code>        normalizedState.preferences.voiceRuntimeRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1154 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1155 | <code>    const legacyLlmProvider = String(normalizedState.preferences.llmProvider &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `legacyLlmProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1156 | <code>    normalizedState.preferences.llmProvider = legacyLlmProvider === 'vllm'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1157 | <code>        ? 'ollama'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1158 | <code>        : normalizeLlmProvider(normalizedState.preferences.llmProvider);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1159 | <code>    normalizedState.preferences.llmBaseUrl = normalizeLlmBaseUrl(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1160 | <code>        legacyLlmProvider === 'vllm'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1161 | <code>            ? LLM_PROVIDER_DEFAULT_BASE_URLS.ollama</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1162 | <code>            : normalizedState.preferences.llmBaseUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1163 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1164 | <code>    normalizedState.preferences.llmProvider = inferOpenAiCompatiblePresetProvider(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1165 | <code>        normalizedState.preferences.llmProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1166 | <code>        normalizedState.preferences.llmBaseUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1167 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1168 | <code>    normalizedState.preferences.llmModel = normalizeLlmModel(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1169 | <code>        legacyLlmProvider === 'vllm'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1170 | <code>            ? LLM_PROVIDER_DEFAULT_MODELS.ollama</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1171 | <code>            : normalizedState.preferences.llmModel</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1172 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1173 | <code>    normalizedState.preferences.ollamaLocalModelPath = String(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1174 | <code>        normalizedState.preferences.ollamaLocalModelPath &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1175 | <code>    ).trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1176 | <code>    normalizedState.preferences.ollamaTarget = normalizeOllamaTarget(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1177 | <code>        normalizedState.preferences.ollamaTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1178 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1179 | <code>            ollamaDeploymentMode: normalizedState.preferences.ollamaDeploymentMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1180 | <code>            llmModel: normalizedState.preferences.llmModel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1181 | <code>            localModelPath: normalizedState.preferences.ollamaLocalModelPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1182 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1183 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1184 | <code>    normalizedState.preferences.ollamaDeploymentMode = ollamaSourceToLegacyMode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1185 | <code>        normalizedState.preferences.ollamaTarget.source</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1186 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1187 | <code>    normalizedState.preferences.ollamaInstalledModels = normalizeOllamaModelHistory(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1188 | <code>        normalizedState.preferences.ollamaInstalledModels</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1189 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1190 | <code>    normalizedState.preferences.ollamaUsedModels = normalizeOllamaModelHistory(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1191 | <code>        normalizedState.preferences.ollamaUsedModels</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1192 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1193 | <code>    normalizedState.preferences.llmApiKey = normalizeLlmApiKey(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1194 | <code>        normalizedState.preferences.llmApiKey</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1195 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1196 | <code>    normalizedState.preferences.llmApiKeyProfiles = normalizeLlmApiKeyProfiles(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1197 | <code>        normalizedState.preferences.llmApiKeyProfiles,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1198 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1199 | <code>            provider: normalizedState.preferences.llmProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1200 | <code>            apiKey: normalizedState.preferences.llmApiKey,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1201 | <code>            label: '默认 Key'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1202 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1203 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1204 | <code>    if (OPENAI_COMPATIBLE_PRESET_PROVIDER_IDS.includes(normalizedState.preferences.llmProvider)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1205 | <code>        const provider = normalizedState.preferences.llmProvider;</code> | 声明局部标识符 `provider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1206 | <code>        const targetProfile = normalizedState.preferences.llmApiKeyProfiles[provider] &#124;&#124; { activeKeyId: '', keys: [] };</code> | 声明局部标识符 `targetProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1207 | <code>        const legacyProfile = normalizedState.preferences.llmApiKeyProfiles[OPENAI_COMPATIBLE_PROVIDER] &#124;&#124; { activeKeyId: '', keys: [] };</code> | 声明局部标识符 `legacyProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1208 | <code>        const legacyEntry = legacyProfile.keys.find((entry) =&gt; entry.id === legacyProfile.activeKeyId) &#124;&#124;</code> | 声明局部标识符 `legacyEntry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1209 | <code>            legacyProfile.keys[0] &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1210 | <code>            null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1211 | <code>        if (!targetProfile.keys.length &amp;&amp; legacyEntry?.value) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1212 | <code>            normalizedState.preferences.llmApiKeyProfiles = normalizeLlmApiKeyProfiles(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1213 | <code>                normalizedState.preferences.llmApiKeyProfiles,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1214 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1215 | <code>                    provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1216 | <code>                    apiKey: legacyEntry.value,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1217 | <code>                    label: legacyEntry.label &#124;&#124; '默认 Key'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1218 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1219 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1220 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1221 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1222 | <code>    normalizedState.preferences.llmTemperature = normalizeLlmTemperature(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1223 | <code>        normalizedState.preferences.llmTemperature</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1224 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1225 | <code>    normalizedState.preferences.llmRequestTimeoutMs = normalizeLlmRequestTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1226 | <code>        normalizedState.preferences.llmRequestTimeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1227 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1228 | <code>    normalizedState.preferences.emberHarnessMode = normalizeEmberHarnessMode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1229 | <code>        normalizedState.preferences.emberHarnessMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1230 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1231 | <code>    normalizedState.preferences.elevenLabsApiBase = normalizeElevenLabsApiBase(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1232 | <code>        normalizedState.preferences.elevenLabsApiBase</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1233 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1234 | <code>    normalizedState.preferences.elevenLabsApiKey = normalizeElevenLabsApiKey(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1235 | <code>        normalizedState.preferences.elevenLabsApiKey</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1236 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1237 | <code>    normalizedState.preferences.elevenLabsVoiceId = normalizeElevenLabsVoiceId(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1238 | <code>        normalizedState.preferences.elevenLabsVoiceId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1239 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1240 | <code>    normalizedState.preferences.elevenLabsModelId = normalizeElevenLabsModelId(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1241 | <code>        normalizedState.preferences.elevenLabsModelId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1242 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1243 | <code>    normalizedState.preferences.elevenLabsLanguageCode = normalizeElevenLabsLanguageCode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1244 | <code>        normalizedState.preferences.elevenLabsLanguageCode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1245 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1246 | <code>    normalizedState.preferences.elevenLabsOutputFormat = normalizeElevenLabsOutputFormat(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1247 | <code>        normalizedState.preferences.elevenLabsOutputFormat</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1248 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1249 | <code>    normalizedState.preferences.elevenLabsTimeoutMs = normalizeElevenLabsTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1250 | <code>        normalizedState.preferences.elevenLabsTimeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1251 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1252 | <code>    normalizedState.preferences.elevenLabsOptimizeStreamingLatency = normalizeElevenLabsOptimizeStreamingLatency(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1253 | <code>        normalizedState.preferences.elevenLabsOptimizeStreamingLatency</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1254 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1255 | <code>    normalizedState.preferences.elevenLabsStability = normalizeElevenLabsStability(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1256 | <code>        normalizedState.preferences.elevenLabsStability</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1257 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1258 | <code>    normalizedState.preferences.elevenLabsSimilarityBoost = normalizeElevenLabsSimilarityBoost(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1259 | <code>        normalizedState.preferences.elevenLabsSimilarityBoost</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1260 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1261 | <code>    normalizedState.preferences.elevenLabsStyle = normalizeElevenLabsStyle(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1262 | <code>        normalizedState.preferences.elevenLabsStyle</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1263 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1264 | <code>    normalizedState.preferences.elevenLabsSpeed = normalizeElevenLabsSpeed(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1265 | <code>        normalizedState.preferences.elevenLabsSpeed</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1266 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1267 | <code>    normalizedState.preferences.elevenLabsUseSpeakerBoost = normalizeElevenLabsUseSpeakerBoost(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1268 | <code>        normalizedState.preferences.elevenLabsUseSpeakerBoost</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1269 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1270 | <code>    normalizedState.preferences.elevenLabsVoiceProfiles = normalizeElevenLabsVoiceProfiles(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1271 | <code>        nextState.preferences?.elevenLabsVoiceProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1272 | <code>        normalizedState.preferences</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1273 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1274 | <code>    normalizedState.preferences.computerControlEnabled = normalizeComputerControlEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1275 | <code>        normalizedState.preferences.computerControlEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1276 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1277 | <code>    normalizedState.preferences.emailProfiles = normalizeEmailProfiles(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1278 | <code>        normalizedState.preferences.emailProfiles</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1279 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1280 | <code>    normalizedState.preferences.cameraDistance = normalizeCameraDistance(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1281 | <code>        normalizedState.preferences.cameraDistance</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1282 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1283 | <code>    normalizedState.preferences.cameraHeight = normalizeCameraHeight(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1284 | <code>        normalizedState.preferences.cameraHeight</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1285 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1286 | <code>    normalizedState.preferences.cameraTargetY = normalizeCameraTargetY(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1287 | <code>        normalizedState.preferences.cameraTargetY</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1288 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1289 | <code>    normalizedState.preferences.renderProfileId = normalizeRenderProfileId(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1290 | <code>        normalizedState.preferences.renderProfileId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1291 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1292 | <code>    normalizedState.preferences.renderLightYawDeg = normalizeRenderLightYawDeg(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1293 | <code>        normalizedState.preferences.renderLightYawDeg</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1294 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1295 | <code>    normalizedState.preferences.renderKeyLightScale = normalizeRenderKeyLightScale(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1296 | <code>        normalizedState.preferences.renderKeyLightScale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1297 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1298 | <code>    normalizedState.preferences.renderAmbientFillScale = normalizeRenderAmbientFillScale(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1299 | <code>        normalizedState.preferences.renderAmbientFillScale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1300 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1301 | <code>    normalizedState.preferences.renderOutlineScale = normalizeRenderOutlineScale(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1302 | <code>        normalizedState.preferences.renderOutlineScale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1303 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1304 | <code>    normalizedState.preferences.renderShadowEnabled = normalizeRenderShadowEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1305 | <code>        normalizedState.preferences.renderShadowEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1306 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1307 | <code>    normalizedState.preferences.renderResolutionScale = normalizeRenderResolutionScale(</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1308 | <code>        normalizedState.preferences.renderResolutionScale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1309 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1310 | <code>    normalizedState.preferences.renderFpsLimit = normalizeRenderFpsLimit(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1311 | <code>        normalizedState.preferences.renderFpsLimit</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1312 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1313 | <code>    normalizedState.preferences.renderShadowQuality = normalizeRenderShadowQuality(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1314 | <code>        normalizedState.preferences.renderShadowQuality</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1315 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1316 | <code>    normalizedState.preferences.renderOutlineEnabled = normalizeRenderOutlineEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1317 | <code>        normalizedState.preferences.renderOutlineEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1318 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1319 | <code>    normalizedState.preferences.renderAntialiasEnabled = normalizeRenderAntialiasEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1320 | <code>        normalizedState.preferences.renderAntialiasEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1321 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1322 | <code>    delete normalizedState.preferences.renderShadowStrength;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1323 | <code>    delete normalizedState.preferences.renderShadowRange;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1324 | <code>    normalizedState.preferences.desktopNativeTtsRate = normalizeDesktopNativeTTSRate(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1325 | <code>        normalizedState.preferences.desktopNativeTtsRate</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1326 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1327 | <code>    normalizedState.preferences.desktopNativeTtsPitch = normalizeDesktopNativeTTSPitch(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1328 | <code>        normalizedState.preferences.desktopNativeTtsPitch</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1329 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1330 | <code>    normalizedState.preferences.desktopNativeTtsVolume = normalizeDesktopNativeTTSVolume(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1331 | <code>        normalizedState.preferences.desktopNativeTtsVolume</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1332 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1333 | <code>    normalizedState.preferences.chunkedTtsEnabled = normalizeChunkedTtsEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1334 | <code>        normalizedState.preferences.chunkedTtsEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1335 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1336 | <code>    normalizedState.preferences.autoChatMode = normalizeAutoChatMode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1337 | <code>        normalizedState.preferences.autoChatMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1338 | <code>        normalizedState.preferences.autoChatEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1339 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1340 | <code>    normalizedState.preferences.autoChatEnabled = isAutoChatModeEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1341 | <code>        normalizedState.preferences.autoChatMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1342 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1343 | <code>    normalizedState.preferences.autoChatMinIntervalSec = normalizeAutoChatMinIntervalSec(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1344 | <code>        normalizedState.preferences.autoChatMinIntervalSec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1345 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1346 | <code>    normalizedState.preferences.autoChatMaxIntervalSec = normalizeAutoChatMaxIntervalSec(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1347 | <code>        normalizedState.preferences.autoChatMaxIntervalSec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1348 | <code>        normalizedState.preferences.autoChatMinIntervalSec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1349 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1350 | <code>    normalizedState.preferences.avatarDialogueBubbleLeft = normalizeAvatarDialogueBubbleLeft(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1351 | <code>        normalizedState.preferences.avatarDialogueBubbleLeft</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1352 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1353 | <code>    normalizedState.preferences.avatarDialogueBubbleTop = normalizeAvatarDialogueBubbleTop(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1354 | <code>        normalizedState.preferences.avatarDialogueBubbleTop</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1355 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1356 | <code>    normalizedState.preferences.avatarDialogueBubbleScale = normalizeAvatarDialogueBubbleScale(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1357 | <code>        normalizedState.preferences.avatarDialogueBubbleScale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1358 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1359 | <code>    normalizedState.preferences.avatarDialogueBubbleExtraWidth = normalizeAvatarDialogueBubbleExtraWidth(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1360 | <code>        normalizedState.preferences.avatarDialogueBubbleExtraWidth</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1361 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1362 | <code>    normalizedState.preferences.avatarDialogueBubbleExtraTop = normalizeAvatarDialogueBubbleExtraTop(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1363 | <code>        normalizedState.preferences.avatarDialogueBubbleExtraTop</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1364 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1365 | <code>    normalizedState.preferences.petMouseHitTestEnabled = normalizePetMouseHitTestEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1366 | <code>        normalizedState.preferences.petMouseHitTestEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1367 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1368 | <code>    normalizedState.preferences.petMouseHitTestShape = normalizePetMouseHitTestShape(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1369 | <code>        normalizedState.preferences.petMouseHitTestShape</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1370 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1371 | <code>    normalizedState.preferences.petMouseHitTestWidthRatio = normalizePetMouseHitTestWidthRatio(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1372 | <code>        normalizedState.preferences.petMouseHitTestWidthRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1373 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1374 | <code>    normalizedState.preferences.petMouseHitTestHeightRatio = normalizePetMouseHitTestHeightRatio(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1375 | <code>        normalizedState.preferences.petMouseHitTestHeightRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1376 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1377 | <code>    normalizedState.preferences.petMouseHitTestOffsetXRatio = normalizePetMouseHitTestOffsetXRatio(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1378 | <code>        normalizedState.preferences.petMouseHitTestOffsetXRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1379 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1380 | <code>    normalizedState.preferences.petMouseHitTestOffsetYRatio = normalizePetMouseHitTestOffsetYRatio(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1381 | <code>        normalizedState.preferences.petMouseHitTestOffsetYRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1382 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1383 | <code>    normalizedState.preferences.petMouseHitTestDebug = normalizePetMouseHitTestDebug(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1384 | <code>        normalizedState.preferences.petMouseHitTestDebug</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1385 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1387 | <code>    if ((nextState.version &#124;&#124; 0) &lt; STATE_VERSION) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1388 | <code>        normalizedState.petWindow.bounds = resizePetBounds(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1389 | <code>            normalizedState.petWindow.bounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1390 | <code>            normalizedState.preferences.petScale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1391 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1392 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1394 | <code>    normalizedState.version = STATE_VERSION;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1395 | <code>    return normalizedState;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1396 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1398 | <code>function loadDesktopState(app) {</code> | 定义函数 `loadDesktopState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1399 | <code>    const filePath = getStateFilePath(app);</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1400 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1401 | <code>        if (!fs.existsSync(filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1402 | <code>            return getDefaultState();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1403 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1404 | <code>        const rawState = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');</code> | 声明局部标识符 `rawState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1405 | <code>        return normalizeState(JSON.parse(rawState));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1406 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1407 | <code>        console.warn('⚠️ 读取桌宠状态失败，回退默认值：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1408 | <code>        return getDefaultState();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1409 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1410 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1412 | <code>function preserveExistingValue(nextPreferences, existingPreferences, key, allowBlankCredentials) {</code> | 定义函数 `preserveExistingValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1413 | <code>    if (allowBlankCredentials.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1414 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1415 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1416 | <code>    if (!nextPreferences[key] &amp;&amp; existingPreferences[key]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1417 | <code>        nextPreferences[key] = existingPreferences[key];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1418 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1419 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1421 | <code>function hasStoredLlmApiKeyProfiles(preferences = {}) {</code> | 定义函数 `hasStoredLlmApiKeyProfiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1422 | <code>    const profiles = preferences.llmApiKeyProfiles &#124;&#124; {};</code> | 声明局部标识符 `profiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1423 | <code>    return Object.values(profiles).some((profile) =&gt; Array.isArray(profile?.keys) &amp;&amp; profile.keys.length &gt; 0);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1424 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1425 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1426 | <code>function preserveExistingEmailSecrets(nextPreferences, existingPreferences, allowBlankCredentials) {</code> | 定义函数 `preserveExistingEmailSecrets`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1427 | <code>    if (!nextPreferences.emailProfiles &#124;&#124; !existingPreferences.emailProfiles) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1428 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1429 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1430 | <code>    for (const providerId of EMAIL_PROVIDER_OPTIONS) {</code> | 声明局部标识符 `providerId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1431 | <code>        const key = `emailProfiles.${providerId}.secret`;</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1432 | <code>        if (allowBlankCredentials.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1433 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1434 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1435 | <code>        const nextProfile = nextPreferences.emailProfiles[providerId];</code> | 声明局部标识符 `nextProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1436 | <code>        const existingProfile = existingPreferences.emailProfiles[providerId];</code> | 声明局部标识符 `existingProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1437 | <code>        if (nextProfile &amp;&amp; existingProfile?.secret &amp;&amp; !nextProfile.secret) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1438 | <code>            nextProfile.secret = existingProfile.secret;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1439 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1440 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1441 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1442 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1443 | <code>function preserveExistingElevenLabsProfileVoiceIds(nextPreferences, existingPreferences, allowBlankCredentials) {</code> | 定义函数 `preserveExistingElevenLabsProfileVoiceIds`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1444 | <code>    for (const languageCode of ELEVENLABS_LANGUAGE_CODES) {</code> | 声明局部标识符 `languageCode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1445 | <code>        const key = `elevenLabsVoiceProfiles.${languageCode}.voiceId`;</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1446 | <code>        if (allowBlankCredentials.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1447 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1448 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1449 | <code>        const nextProfile = nextPreferences.elevenLabsVoiceProfiles?.[languageCode];</code> | 声明局部标识符 `nextProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1450 | <code>        const existingProfile = existingPreferences.elevenLabsVoiceProfiles?.[languageCode];</code> | 声明局部标识符 `existingProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1451 | <code>        if (nextProfile &amp;&amp; existingProfile?.voiceId &amp;&amp; !nextProfile.voiceId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1452 | <code>            nextProfile.voiceId = existingProfile.voiceId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1453 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1454 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1455 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1456 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1457 | <code>function preserveExistingCredentials(filePath, normalized, options = {}) {</code> | 定义函数 `preserveExistingCredentials`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1458 | <code>    if (options.preserveExistingCredentials === false &#124;&#124; !fs.existsSync(filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1459 | <code>        return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1460 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1461 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1462 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1463 | <code>        const rawState = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');</code> | 声明局部标识符 `rawState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1464 | <code>        const existing = normalizeState(JSON.parse(rawState));</code> | 声明局部标识符 `existing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1465 | <code>        const nextPreferences = normalized.preferences &#124;&#124; {};</code> | 声明局部标识符 `nextPreferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1466 | <code>        const existingPreferences = existing.preferences &#124;&#124; {};</code> | 声明局部标识符 `existingPreferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1467 | <code>        const allowBlankCredentials = new Set(options.allowBlankCredentials &#124;&#124; []);</code> | 声明局部标识符 `allowBlankCredentials`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1469 | <code>        if (!hasStoredLlmApiKeyProfiles(nextPreferences)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1470 | <code>            preserveExistingValue(nextPreferences, existingPreferences, 'llmApiKey', allowBlankCredentials);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1471 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1472 | <code>        if (!allowBlankCredentials.has('llmApiKeyProfiles') &amp;&amp;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1473 | <code>            !hasStoredLlmApiKeyProfiles(nextPreferences) &amp;&amp;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1474 | <code>            hasStoredLlmApiKeyProfiles(existingPreferences)) {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1475 | <code>            nextPreferences.llmApiKeyProfiles = existingPreferences.llmApiKeyProfiles;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1476 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1477 | <code>        preserveExistingValue(nextPreferences, existingPreferences, 'elevenLabsApiKey', allowBlankCredentials);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1478 | <code>        preserveExistingValue(nextPreferences, existingPreferences, 'elevenLabsVoiceId', allowBlankCredentials);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1479 | <code>        preserveExistingElevenLabsProfileVoiceIds(nextPreferences, existingPreferences, allowBlankCredentials);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1480 | <code>        preserveExistingEmailSecrets(nextPreferences, existingPreferences, allowBlankCredentials);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1481 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1482 | <code>        console.warn('⚠️ 合并已保存凭据失败，继续保存当前状态：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1483 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1484 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1485 | <code>    return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1486 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1488 | <code>function saveDesktopState(app, nextState, options = {}) {</code> | 定义函数 `saveDesktopState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1489 | <code>    const filePath = getStateFilePath(app);</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1490 | <code>    const normalized = preserveExistingCredentials(filePath, normalizeState(nextState), options);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1491 | <code>    fs.mkdirSync(path.dirname(filePath), { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1492 | <code>    fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2), 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1493 | <code>    return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1494 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1495 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1496 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1497 | <code>    BACKEND_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1498 | <code>    DEFAULT_AUTO_CHAT_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1499 | <code>    DEFAULT_AUTO_CHAT_MODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1500 | <code>    DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1501 | <code>    DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1502 | <code>    DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1503 | <code>    DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1504 | <code>    DEFAULT_AVATAR_DIALOGUE_BUBBLE_LEFT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1505 | <code>    DEFAULT_AVATAR_DIALOGUE_BUBBLE_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1506 | <code>    DEFAULT_AVATAR_DIALOGUE_BUBBLE_TOP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1507 | <code>    DEFAULT_BACKEND_BASE_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1508 | <code>    DEFAULT_BACKEND_MODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1509 | <code>    DEFAULT_CONVERSATION_MODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1510 | <code>    DEFAULT_UI_LANGUAGE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1511 | <code>    DEFAULT_CAMERA_DISTANCE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1512 | <code>    DEFAULT_CAMERA_HEIGHT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1513 | <code>    DEFAULT_CAMERA_TARGET_Y,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1514 | <code>    DEFAULT_RENDER_PROFILE_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1515 | <code>    DEFAULT_RENDER_LIGHT_YAW_DEG,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1516 | <code>    DEFAULT_RENDER_KEY_LIGHT_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1517 | <code>    DEFAULT_RENDER_AMBIENT_FILL_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1518 | <code>    DEFAULT_RENDER_OUTLINE_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1519 | <code>    DEFAULT_RENDER_SHADOW_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1520 | <code>    DEFAULT_RENDER_RESOLUTION_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1521 | <code>    DEFAULT_RENDER_FPS_LIMIT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1522 | <code>    DEFAULT_RENDER_SHADOW_QUALITY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1523 | <code>    DEFAULT_RENDER_OUTLINE_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1524 | <code>    DEFAULT_RENDER_ANTIALIAS_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1525 | <code>    DEFAULT_DESKTOP_NATIVE_TTS_PITCH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1526 | <code>    DEFAULT_DESKTOP_NATIVE_TTS_RATE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1527 | <code>    DEFAULT_DESKTOP_NATIVE_TTS_VOLUME,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1528 | <code>    DEFAULT_CHUNKED_TTS_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1529 | <code>    DEFAULT_LLM_API_KEY,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1530 | <code>    DEFAULT_LLM_BASE_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1531 | <code>    DEFAULT_LLM_MODEL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1532 | <code>    DEFAULT_LLM_PROVIDER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1533 | <code>    DEFAULT_LLM_REQUEST_TIMEOUT_MS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1534 | <code>    DEFAULT_LLM_TEMPERATURE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1535 | <code>    LLM_PROVIDER_DEFAULT_BASE_URLS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1536 | <code>    LLM_PROVIDER_DEFAULT_MODELS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1537 | <code>    DEFAULT_ELEVENLABS_API_BASE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1538 | <code>    DEFAULT_ELEVENLABS_API_KEY,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1539 | <code>    DEFAULT_ELEVENLABS_LANGUAGE_CODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1540 | <code>    DEFAULT_ELEVENLABS_MODEL_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1541 | <code>    DEFAULT_ELEVENLABS_OPTIMIZE_STREAMING_LATENCY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1542 | <code>    DEFAULT_ELEVENLABS_OUTPUT_FORMAT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1543 | <code>    DEFAULT_ELEVENLABS_SIMILARITY_BOOST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1544 | <code>    DEFAULT_ELEVENLABS_SPEED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1545 | <code>    DEFAULT_ELEVENLABS_STABILITY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1546 | <code>    DEFAULT_ELEVENLABS_STYLE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1547 | <code>    DEFAULT_ELEVENLABS_TIMEOUT_MS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1548 | <code>    DEFAULT_ELEVENLABS_USE_SPEAKER_BOOST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1549 | <code>    DEFAULT_ELEVENLABS_VOICE_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1550 | <code>    DEFAULT_ELEVENLABS_VOICE_PROFILES,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1551 | <code>    DEFAULT_AILIS_STATE_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1552 | <code>    DEFAULT_AGENT_RUNTIME_GATEWAY_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1553 | <code>    DEFAULT_COMPUTER_CONTROL_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1554 | <code>    DEFAULT_EMBER_HARNESS_MODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1555 | <code>    DEFAULT_OPENCLAW_GATEWAY_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1556 | <code>    DEFAULT_PET_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1557 | <code>    DEFAULT_PET_MOUSE_HIT_TEST_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1558 | <code>    DEFAULT_PET_MOUSE_HIT_TEST_SHAPE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1559 | <code>    DEFAULT_PET_MOUSE_HIT_TEST_WIDTH_RATIO,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1560 | <code>    DEFAULT_PET_MOUSE_HIT_TEST_HEIGHT_RATIO,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1561 | <code>    DEFAULT_PET_MOUSE_HIT_TEST_OFFSET_X_RATIO,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1562 | <code>    DEFAULT_PET_MOUSE_HIT_TEST_OFFSET_Y_RATIO,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1563 | <code>    DEFAULT_PET_MOUSE_HIT_TEST_DEBUG,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1564 | <code>    EMAIL_PROVIDER_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1565 | <code>    EMBER_HARNESS_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1566 | <code>    ELEVENLABS_LANGUAGE_CODES,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1567 | <code>    LLM_PROVIDER_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1568 | <code>    PET_SCALE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1569 | <code>    CONVERSATION_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1570 | <code>    UI_LANGUAGE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1571 | <code>    RECOGNITION_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1572 | <code>    RENDER_PROFILE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1573 | <code>    SPEECH_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1574 | <code>    getDefaultState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1575 | <code>    getScaledPetSize,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1576 | <code>    loadDesktopState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1577 | <code>    createLlmApiKeyId,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1578 | <code>    normalizeAutoChatEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1579 | <code>    normalizeAutoChatMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1580 | <code>    normalizeAutoChatMaxIntervalSec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1581 | <code>    normalizeAutoChatMinIntervalSec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1582 | <code>    normalizeAvatarDialogueBubbleExtraTop,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1583 | <code>    normalizeAvatarDialogueBubbleExtraWidth,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1584 | <code>    normalizeAvatarDialogueBubbleLeft,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1585 | <code>    normalizeAvatarDialogueBubbleScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1586 | <code>    normalizeAvatarDialogueBubbleTop,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1587 | <code>    normalizeBackendBaseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1588 | <code>    normalizeBackendMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1589 | <code>    normalizeConversationMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1590 | <code>    normalizeUiLanguage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1591 | <code>    normalizeCameraDistance,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1592 | <code>    normalizeCameraHeight,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1593 | <code>    normalizeCameraTargetY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1594 | <code>    normalizeRenderProfileId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1595 | <code>    normalizeRenderLightYawDeg,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1596 | <code>    normalizeRenderKeyLightScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1597 | <code>    normalizeRenderAmbientFillScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1598 | <code>    normalizeRenderOutlineScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1599 | <code>    normalizeRenderShadowEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1600 | <code>    normalizeRenderResolutionScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1601 | <code>    normalizeRenderFpsLimit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1602 | <code>    normalizeRenderShadowQuality,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1603 | <code>    normalizeRenderOutlineEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1604 | <code>    normalizeRenderAntialiasEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1605 | <code>    normalizeComputerControlEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1606 | <code>    normalizeEmberHarnessMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1607 | <code>    normalizeDesktopNativeTTSPitch,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1608 | <code>    normalizeDesktopNativeTTSRate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1609 | <code>    normalizeDesktopNativeTTSVolume,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1610 | <code>    normalizeChunkedTtsEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1611 | <code>    normalizeElevenLabsApiBase,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1612 | <code>    normalizeElevenLabsApiKey,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1613 | <code>    normalizeElevenLabsLanguageCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1614 | <code>    normalizeElevenLabsModelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1615 | <code>    normalizeElevenLabsOptimizeStreamingLatency,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1616 | <code>    normalizeElevenLabsOutputFormat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1617 | <code>    normalizeElevenLabsSimilarityBoost,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1618 | <code>    normalizeElevenLabsSpeed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1619 | <code>    normalizeElevenLabsStability,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1620 | <code>    normalizeElevenLabsStyle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1621 | <code>    normalizeElevenLabsTimeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1622 | <code>    normalizeElevenLabsUseSpeakerBoost,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1623 | <code>    normalizeElevenLabsVoiceProfile,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1624 | <code>    normalizeElevenLabsVoiceProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1625 | <code>    normalizeElevenLabsVoiceId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1626 | <code>    normalizeLlmApiKey,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1627 | <code>    normalizeLlmApiKeyProfiles,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1628 | <code>    normalizeLlmBaseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1629 | <code>    normalizeLlmModel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1630 | <code>    normalizeLlmProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1631 | <code>    normalizeLlmRequestTimeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1632 | <code>    normalizeLlmTemperature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1633 | <code>    normalizeEmailProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1634 | <code>    normalizeAgentRuntimeGatewayUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1635 | <code>    normalizeOpenClawGatewayUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1636 | <code>    normalizeAILISStateDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1637 | <code>    normalizeVoiceRuntimeRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1638 | <code>    normalizePetMouseHitTestDebug,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1639 | <code>    normalizePetMouseHitTestEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1640 | <code>    normalizePetMouseHitTestHeightRatio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1641 | <code>    normalizePetMouseHitTestOffsetXRatio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1642 | <code>    normalizePetMouseHitTestOffsetYRatio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1643 | <code>    normalizePetMouseHitTestShape,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1644 | <code>    normalizePetMouseHitTestWidthRatio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1645 | <code>    normalizePetScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1646 | <code>    normalizePreferredMicDeviceId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1647 | <code>    normalizeRecognitionMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1648 | <code>    normalizeSpeechMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1649 | <code>    normalizeState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1650 | <code>    resizePetBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1651 | <code>    saveDesktopState</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1652 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
