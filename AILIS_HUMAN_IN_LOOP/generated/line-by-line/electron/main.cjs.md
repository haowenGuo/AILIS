# electron/main.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。
- 文件类型：`source-code`
- 原始行数：5701
- SHA-256：`021ac25af6fc64dd11889557dec6729e578c166422b73b9b3223b3b77b7fea62`
- 可运行副本：[打开源文件](../../../source/electron/main.cjs)
- 依赖：`fs`、`fs/promises`、`path`、`url`、`child_process`、`electron`、`./local-asr-manager.cjs`、`./desktop-elevenlabs-tts.cjs`、`./desktop-cosyvoice3-tts.cjs`、`./voice-runtime-bootstrap.cjs`、`./openclaw-runtime.cjs`、`./ailis-gateway.cjs`、`./ailis-chat-history-store.cjs`、`./ailis-desktop-platform-adapter.cjs`、`./openclaw-tool-surface.cjs`、`./desktop-llm-provider.cjs`、`./vllm-model-catalog.cjs`、`./ollama-model-catalog.cjs`、`./runtime-asset-manager.cjs`、`./vllm-local-deployer.cjs`、`./ollama-local-runtime.cjs`、`./asset-pack-runtime.cjs`、`./store.cjs`
- 主要符号：`fs`、`fsp`、`path`、`DEFAULT_DEV_SERVER_URL`、`devServerUrl`、`PET_MIN_SIZE`、`CHAT_MIN_WIDTH`、`CHAT_MIN_HEIGHT`、`CONTROL_MIN_WIDTH`、`CONTROL_MIN_HEIGHT`、`AGENT_LAB_MIN_WIDTH`、`AGENT_LAB_MIN_HEIGHT`、`PET_DIALOGUE_DEFAULT_EXTRA_TOP`、`PET_DIALOGUE_DEFAULT_EXTRA_WIDTH`、`PET_DIALOGUE_MAX_EXTRA_TOP`、`PET_DIALOGUE_MAX_EXTRA_WIDTH`、`COSYVOICE3_WARMUP_DELAY_MS`、`LOCAL_RESOURCE_PROTOCOL`、`ASSET_PACK_PROTOCOL`、`SPEECH_MODEL_PROTOCOL`、`SPEECH_MODEL_CACHE_DIRNAME`、`VISION_CACHE_DIRNAME`、`AILIS_STATE_DIRNAME`、`VISION_CACHE_MAX_FILES`、`CHAT_FILE_ATTACHMENT_LIMIT`、`VISION_REGION_MIN_SIZE_DIP`、`VISION_MODEL_MAX_EDGE`、`VISION_MODEL_JPEG_QUALITY`、`UI_LANGUAGE_LABELS`、`MENU_I18N`、`SPEECH_MODEL_REMOTE_HOSTS`、`PET_CURSOR_TRACK_INTERVAL_MS`、`APP_ICON_PATH`、`APP_WINDOWS_ICON_PATH`、`APP_TRAY_ICON_PATH`、`getExistingImagePath`、`getAppIconPath`、`getTrayIconPath`、`petWindow`、`chatWindow`、`controlWindow`、`controlWindowLoadPromise`、`agentLabWindow`、`agentLabWindowLoadPromise`、`tray`、`isQuitting`、`desktopState`、`desktopASRManager`、`voiceRuntimeBootstrap`、`vllmLocalDeployer`、`ollamaLocalRuntime`、`assetPackRuntime`、`runtimeAssetManager`、`assistantGateway`、`agentRuntimeSupervisor`、`ailisGateway`、`ailisGatewayStartPromise`、`ailisChatHistoryStore`、`runtimeComponentsInstallRun`、`lastRuntimeComponentsInstallRun`、`petDialogueCollapsedBounds`、`petDialogueExpanded`、`petDialogueExtraTop`、`petDialogueExtraWidth`、`petDialogueBoundsMutation`、`petDialogueBoundsMutationTimer`、`petMousePassthroughEnabled`、`petDragState`、`petCursorTrackingTimer`、`petCursorTrackingLastSignature`、`visionRegionSelectionRequest`、`windowPersistTimers`、`speechModelDownloadTasks`、`desktopPlatformAdapter`、`isDevMode`、`buildRendererUrl`、`unpackedRendererPath`、`ensureSafePathSegments`、`segments`、`resolveSpeechModelFilePath`、`rootPath`、`targetPath`、`getSpeechModelCacheRoot`、`getVisionCacheRoot`、`getProjectRoot`、`readJsonFromCandidates`、`errors`、`getRuntimeComponentManifest`、`candidates`、`result`、`components`、`getRuntimeComponentSelection`、`selectedIds`、`normalizeRuntimeComponentIds`、`getRuntimeComponentById`、`expandRuntimeComponentDependencies`、`expanded`、`visit`、`component`、`resolveRuntimeComponentPackName`、`getRuntimePackSearchDirs`、`normalizeRuntimePackDir`、`text`、`resolveRuntimeComponentPack`、`packName`、`searchDirs`、`foundPath`、`resolveRuntimeExtractRoot`、`extractTo`、`rest`、`resolveRuntimeComponentInstallRoot`、`installRoot`、`runtimePathExists`、`runRuntimeProcess`、`logs`、`child`、`append`、`extractRuntimePack`、`extractRoot`、`script`、`unzipResult`、`getRuntimeComponentReadiness`、`base`、`ready`、`partial`、`manifestPath`、`getRuntimeComponentsState`、`manifest`、`selection`、`expandedSelectedIds`、`voiceSummary`、`pack`、`getGatewayWorkspaceRoot`、`getDefaultAILISStateDir`、`resolveAILISStateDir`、`normalized`、`relativeBaseDir`、`getPersistedAILISStateDir`、`ensureAILISChatHistoryStore`、`rootDir`、`getDefaultVoiceRuntimeRoot`、`packagedCandidates`、`packagedRuntimeRoot`、`resolveVoiceRuntimeRoot`、`getPersistedVoiceRuntimeRoot`、`getVoiceRuntimeBootstrap`、`configureCosyVoice3Runtime`、`runtime`、`paths`、`getVllmLocalDeployer`、`getOllamaLocalRuntime`、`getOllamaRuntimeBusyResult`、`phaseLabels`、`phase`、`getAssetPackRuntime`、`getRuntimeAssetManager`、`bootstrapVoiceRuntime`、`getVoiceBootstrapStepIdsForRuntimeComponents`、`ids`、`stepIds`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2 | <code>const fsp = require('fs/promises');</code> | 导入依赖 `fs/promises`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4 | <code>const { pathToFileURL } = require('url');</code> | 导入依赖 `url`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5 | <code>const { spawn } = require('child_process');</code> | 导入依赖 `child_process`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 6 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 7 | <code>    app,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 8 | <code>    BrowserWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 9 | <code>    desktopCapturer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 10 | <code>    dialog,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 11 | <code>    ipcMain,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 12 | <code>    Menu,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 13 | <code>    Tray,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 14 | <code>    nativeImage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 15 | <code>    protocol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 16 | <code>    session,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 17 | <code>    screen,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 18 | <code>    shell</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 19 | <code>} = require('electron');</code> | 导入依赖 `electron`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 20 | <code>const { DesktopASRManager } = require('./local-asr-manager.cjs');</code> | 导入依赖 `./local-asr-manager.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 21 | <code>const { synthesizeElevenLabsSpeech } = require('./desktop-elevenlabs-tts.cjs');</code> | 导入依赖 `./desktop-elevenlabs-tts.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 22 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 23 | <code>    closeCosyVoice3TTS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 24 | <code>    configureCosyVoice3TTS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 25 | <code>    synthesizeCosyVoice3Speech,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 26 | <code>    warmupCosyVoice3TTS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 27 | <code>} = require('./desktop-cosyvoice3-tts.cjs');</code> | 导入依赖 `./desktop-cosyvoice3-tts.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 28 | <code>const { VoiceRuntimeBootstrap } = require('./voice-runtime-bootstrap.cjs');</code> | 导入依赖 `./voice-runtime-bootstrap.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 29 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 30 | <code>    AILISGatewayBridgeManager,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 31 | <code>    AILISAgentRuntimeSupervisor</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 32 | <code>} = require('./openclaw-runtime.cjs');</code> | 导入依赖 `./openclaw-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 33 | <code>const { AILISGateway } = require('./ailis-gateway.cjs');</code> | 导入依赖 `./ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 34 | <code>const { AILISChatHistoryStore } = require('./ailis-chat-history-store.cjs');</code> | 导入依赖 `./ailis-chat-history-store.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 35 | <code>const { createAILISDesktopPlatformAdapter } = require('./ailis-desktop-platform-adapter.cjs');</code> | 导入依赖 `./ailis-desktop-platform-adapter.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 36 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 37 | <code>    getOpenClawToolSurface: getAgentToolSurface,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 38 | <code>    getOpenClawToolSurfaceSummary: getAgentToolSurfaceSummary,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 39 | <code>    validateOpenClawToolSurface: validateAgentToolSurface</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 40 | <code>} = require('./openclaw-tool-surface.cjs');</code> | 导入依赖 `./openclaw-tool-surface.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 41 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 42 | <code>    callDesktopLlmProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 43 | <code>    checkDesktopLlmProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 44 | <code>    getDefaultProviderBaseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 45 | <code>    getDefaultProviderModel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 46 | <code>    getProviderCapabilities</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 47 | <code>} = require('./desktop-llm-provider.cjs');</code> | 导入依赖 `./desktop-llm-provider.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 48 | <code>const { searchVllmModelCatalog } = require('./vllm-model-catalog.cjs');</code> | 导入依赖 `./vllm-model-catalog.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 49 | <code>const { searchOllamaModelCatalog } = require('./ollama-model-catalog.cjs');</code> | 导入依赖 `./ollama-model-catalog.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 50 | <code>const { RuntimeAssetManager } = require('./runtime-asset-manager.cjs');</code> | 导入依赖 `./runtime-asset-manager.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 51 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 52 | <code>    VllmLocalDeployer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 53 | <code>    inspectDownloadTarget</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 54 | <code>} = require('./vllm-local-deployer.cjs');</code> | 导入依赖 `./vllm-local-deployer.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 55 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 56 | <code>    OllamaLocalRuntime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 57 | <code>    describeOllamaLocalModelPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 58 | <code>    normalizeOllamaTarget</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 59 | <code>} = require('./ollama-local-runtime.cjs');</code> | 导入依赖 `./ollama-local-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 60 | <code>const { AssetPackRuntime } = require('./asset-pack-runtime.cjs');</code> | 导入依赖 `./asset-pack-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 61 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 62 | <code>    BACKEND_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 63 | <code>    DEFAULT_AUTO_CHAT_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 64 | <code>    DEFAULT_AUTO_CHAT_MODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 65 | <code>    DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 66 | <code>    DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 67 | <code>    DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 68 | <code>    DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 69 | <code>    DEFAULT_BACKEND_BASE_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 70 | <code>    DEFAULT_BACKEND_MODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 71 | <code>    DEFAULT_CONVERSATION_MODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 72 | <code>    DEFAULT_UI_LANGUAGE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 73 | <code>    DEFAULT_CAMERA_DISTANCE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 74 | <code>    DEFAULT_CAMERA_HEIGHT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 75 | <code>    DEFAULT_CAMERA_TARGET_Y,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 76 | <code>    DEFAULT_COMPUTER_CONTROL_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 77 | <code>    DEFAULT_EMBER_HARNESS_MODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 78 | <code>    DEFAULT_RENDER_PROFILE_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 79 | <code>    DEFAULT_RENDER_LIGHT_YAW_DEG,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 80 | <code>    DEFAULT_RENDER_KEY_LIGHT_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 81 | <code>    DEFAULT_RENDER_AMBIENT_FILL_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 82 | <code>    DEFAULT_RENDER_OUTLINE_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 83 | <code>    DEFAULT_RENDER_SHADOW_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 84 | <code>    DEFAULT_RENDER_RESOLUTION_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 85 | <code>    DEFAULT_RENDER_FPS_LIMIT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 86 | <code>    DEFAULT_RENDER_SHADOW_QUALITY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 87 | <code>    DEFAULT_RENDER_OUTLINE_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 88 | <code>    DEFAULT_RENDER_ANTIALIAS_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 89 | <code>    DEFAULT_DESKTOP_NATIVE_TTS_PITCH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 90 | <code>    DEFAULT_DESKTOP_NATIVE_TTS_RATE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 91 | <code>    DEFAULT_DESKTOP_NATIVE_TTS_VOLUME,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 92 | <code>    DEFAULT_CHUNKED_TTS_ENABLED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 93 | <code>    DEFAULT_LLM_BASE_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 94 | <code>    DEFAULT_LLM_MODEL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 95 | <code>    DEFAULT_LLM_PROVIDER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 96 | <code>    DEFAULT_LLM_REQUEST_TIMEOUT_MS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 97 | <code>    DEFAULT_LLM_TEMPERATURE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 98 | <code>    LLM_PROVIDER_DEFAULT_BASE_URLS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 99 | <code>    LLM_PROVIDER_DEFAULT_MODELS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 100 | <code>    DEFAULT_ELEVENLABS_API_BASE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 101 | <code>    DEFAULT_ELEVENLABS_API_KEY,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 102 | <code>    DEFAULT_ELEVENLABS_LANGUAGE_CODE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 103 | <code>    DEFAULT_ELEVENLABS_MODEL_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 104 | <code>    DEFAULT_ELEVENLABS_OPTIMIZE_STREAMING_LATENCY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 105 | <code>    DEFAULT_ELEVENLABS_OUTPUT_FORMAT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 106 | <code>    DEFAULT_ELEVENLABS_SIMILARITY_BOOST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 107 | <code>    DEFAULT_ELEVENLABS_SPEED,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 108 | <code>    DEFAULT_ELEVENLABS_STABILITY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 109 | <code>    DEFAULT_ELEVENLABS_STYLE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 110 | <code>    DEFAULT_ELEVENLABS_TIMEOUT_MS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 111 | <code>    DEFAULT_ELEVENLABS_USE_SPEAKER_BOOST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 112 | <code>    DEFAULT_ELEVENLABS_VOICE_ID,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 113 | <code>    DEFAULT_ELEVENLABS_VOICE_PROFILES,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 114 | <code>    DEFAULT_AILIS_STATE_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 115 | <code>    DEFAULT_AGENT_RUNTIME_GATEWAY_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 116 | <code>    DEFAULT_PET_SCALE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 117 | <code>    EMAIL_PROVIDER_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 118 | <code>    EMBER_HARNESS_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 119 | <code>    ELEVENLABS_LANGUAGE_CODES,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 120 | <code>    LLM_PROVIDER_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 121 | <code>    PET_SCALE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 122 | <code>    CONVERSATION_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 123 | <code>    UI_LANGUAGE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 124 | <code>    RECOGNITION_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 125 | <code>    RENDER_PROFILE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 126 | <code>    SPEECH_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 127 | <code>    getDefaultState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 128 | <code>    getScaledPetSize,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 129 | <code>    loadDesktopState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 130 | <code>    createLlmApiKeyId,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 131 | <code>    normalizeAutoChatEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 132 | <code>    normalizeAutoChatMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 133 | <code>    normalizeAutoChatMaxIntervalSec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 134 | <code>    normalizeAutoChatMinIntervalSec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 135 | <code>    normalizeAvatarDialogueBubbleExtraTop,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 136 | <code>    normalizeAvatarDialogueBubbleExtraWidth,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 137 | <code>    normalizeAvatarDialogueBubbleLeft,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 138 | <code>    normalizeAvatarDialogueBubbleScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 139 | <code>    normalizeAvatarDialogueBubbleTop,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 140 | <code>    normalizeBackendBaseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 141 | <code>    normalizeBackendMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 142 | <code>    normalizeCameraDistance,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 143 | <code>    normalizeCameraHeight,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 144 | <code>    normalizeCameraTargetY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 145 | <code>    normalizeConversationMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 146 | <code>    normalizeUiLanguage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 147 | <code>    normalizeComputerControlEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 148 | <code>    normalizeEmberHarnessMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 149 | <code>    normalizeRenderProfileId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 150 | <code>    normalizeRenderLightYawDeg,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 151 | <code>    normalizeRenderKeyLightScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 152 | <code>    normalizeRenderAmbientFillScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 153 | <code>    normalizeRenderOutlineScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 154 | <code>    normalizeRenderShadowEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 155 | <code>    normalizeRenderResolutionScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 156 | <code>    normalizeRenderFpsLimit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 157 | <code>    normalizeRenderShadowQuality,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 158 | <code>    normalizeRenderOutlineEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 159 | <code>    normalizeRenderAntialiasEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 160 | <code>    normalizeDesktopNativeTTSPitch,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 161 | <code>    normalizeDesktopNativeTTSRate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 162 | <code>    normalizeDesktopNativeTTSVolume,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 163 | <code>    normalizeChunkedTtsEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 164 | <code>    normalizeElevenLabsApiBase,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 165 | <code>    normalizeElevenLabsApiKey,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 166 | <code>    normalizeElevenLabsLanguageCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 167 | <code>    normalizeElevenLabsModelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 168 | <code>    normalizeElevenLabsOptimizeStreamingLatency,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 169 | <code>    normalizeElevenLabsOutputFormat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 170 | <code>    normalizeElevenLabsSimilarityBoost,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 171 | <code>    normalizeElevenLabsSpeed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 172 | <code>    normalizeElevenLabsStability,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 173 | <code>    normalizeElevenLabsStyle,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 174 | <code>    normalizeElevenLabsTimeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 175 | <code>    normalizeElevenLabsUseSpeakerBoost,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 176 | <code>    normalizeElevenLabsVoiceProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 177 | <code>    normalizeElevenLabsVoiceId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 178 | <code>    normalizeEmailProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 179 | <code>    normalizeAILISStateDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 180 | <code>    normalizeVoiceRuntimeRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 181 | <code>    normalizeLlmApiKey,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 182 | <code>    normalizeLlmApiKeyProfiles,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 183 | <code>    normalizeLlmBaseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 184 | <code>    normalizeLlmModel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 185 | <code>    normalizeLlmProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 186 | <code>    normalizeLlmRequestTimeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 187 | <code>    normalizeLlmTemperature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 188 | <code>    normalizeAgentRuntimeGatewayUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 189 | <code>    normalizePetMouseHitTestDebug,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 190 | <code>    normalizePetMouseHitTestEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 191 | <code>    normalizePetMouseHitTestHeightRatio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 192 | <code>    normalizePetMouseHitTestOffsetXRatio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 193 | <code>    normalizePetMouseHitTestOffsetYRatio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 194 | <code>    normalizePetMouseHitTestShape,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 195 | <code>    normalizePetMouseHitTestWidthRatio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 196 | <code>    normalizeRecognitionMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 197 | <code>    normalizeSpeechMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 198 | <code>    normalizePreferredMicDeviceId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 199 | <code>    normalizePetScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 200 | <code>    resizePetBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 201 | <code>    saveDesktopState</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 202 | <code>} = require('./store.cjs');</code> | 导入依赖 `./store.cjs`，使本文件可以复用外部模块能力。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>const DEFAULT_DEV_SERVER_URL = 'http://127.0.0.1:5173';</code> | 声明局部标识符 `DEFAULT_DEV_SERVER_URL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 205 | <code>const devServerUrl = process.env.AILIS_DESKTOP_DEV_URL &#124;&#124; '';</code> | 声明局部标识符 `devServerUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 206 | <code>const PET_MIN_SIZE = getScaledPetSize(PET_SCALE_OPTIONS[0]);</code> | 声明局部标识符 `PET_MIN_SIZE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 207 | <code>const CHAT_MIN_WIDTH = 360;</code> | 声明局部标识符 `CHAT_MIN_WIDTH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 208 | <code>const CHAT_MIN_HEIGHT = 420;</code> | 声明局部标识符 `CHAT_MIN_HEIGHT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 209 | <code>const CONTROL_MIN_WIDTH = 760;</code> | 声明局部标识符 `CONTROL_MIN_WIDTH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 210 | <code>const CONTROL_MIN_HEIGHT = 620;</code> | 声明局部标识符 `CONTROL_MIN_HEIGHT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 211 | <code>const AGENT_LAB_MIN_WIDTH = 1100;</code> | 声明局部标识符 `AGENT_LAB_MIN_WIDTH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 212 | <code>const AGENT_LAB_MIN_HEIGHT = 760;</code> | 声明局部标识符 `AGENT_LAB_MIN_HEIGHT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 213 | <code>const PET_DIALOGUE_DEFAULT_EXTRA_TOP = DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP;</code> | 声明局部标识符 `PET_DIALOGUE_DEFAULT_EXTRA_TOP`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 214 | <code>const PET_DIALOGUE_DEFAULT_EXTRA_WIDTH = DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH;</code> | 声明局部标识符 `PET_DIALOGUE_DEFAULT_EXTRA_WIDTH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 215 | <code>const PET_DIALOGUE_MAX_EXTRA_TOP = 360;</code> | 声明局部标识符 `PET_DIALOGUE_MAX_EXTRA_TOP`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 216 | <code>const PET_DIALOGUE_MAX_EXTRA_WIDTH = 520;</code> | 声明局部标识符 `PET_DIALOGUE_MAX_EXTRA_WIDTH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 217 | <code>const COSYVOICE3_WARMUP_DELAY_MS = 6500;</code> | 声明局部标识符 `COSYVOICE3_WARMUP_DELAY_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 218 | <code>const LOCAL_RESOURCE_PROTOCOL = 'ailis-resource';</code> | 声明局部标识符 `LOCAL_RESOURCE_PROTOCOL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 219 | <code>const ASSET_PACK_PROTOCOL = 'ailis-asset';</code> | 声明局部标识符 `ASSET_PACK_PROTOCOL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 220 | <code>const SPEECH_MODEL_PROTOCOL = 'ailis-model';</code> | 声明局部标识符 `SPEECH_MODEL_PROTOCOL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 221 | <code>const SPEECH_MODEL_CACHE_DIRNAME = 'speech-models';</code> | 声明局部标识符 `SPEECH_MODEL_CACHE_DIRNAME`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 222 | <code>const VISION_CACHE_DIRNAME = 'vision-snapshots';</code> | 声明局部标识符 `VISION_CACHE_DIRNAME`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 223 | <code>const AILIS_STATE_DIRNAME = '.ailis-state';</code> | 声明局部标识符 `AILIS_STATE_DIRNAME`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 224 | <code>const VISION_CACHE_MAX_FILES = 40;</code> | 声明局部标识符 `VISION_CACHE_MAX_FILES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 225 | <code>const CHAT_FILE_ATTACHMENT_LIMIT = 12;</code> | 声明局部标识符 `CHAT_FILE_ATTACHMENT_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 226 | <code>const VISION_REGION_MIN_SIZE_DIP = 12;</code> | 声明局部标识符 `VISION_REGION_MIN_SIZE_DIP`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 227 | <code>const VISION_MODEL_MAX_EDGE = 1800;</code> | 声明局部标识符 `VISION_MODEL_MAX_EDGE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 228 | <code>const VISION_MODEL_JPEG_QUALITY = 88;</code> | 声明局部标识符 `VISION_MODEL_JPEG_QUALITY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 229 | <code>const UI_LANGUAGE_LABELS = Object.freeze({</code> | 声明局部标识符 `UI_LANGUAGE_LABELS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 230 | <code>    'zh-CN': '简体中文',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 231 | <code>    en: 'English',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 232 | <code>    ja: '日本語',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 233 | <code>    ko: '한국어'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 234 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>const MENU_I18N = Object.freeze({</code> | 声明局部标识符 `MENU_I18N`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 236 | <code>    en: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 237 | <code>        showPet: 'Show Avatar',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 238 | <code>        hidePet: 'Hide Avatar',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 239 | <code>        controlPanel: 'Control Panel',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 240 | <code>        chat: 'Chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 241 | <code>        language: 'Language',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 242 | <code>        speechMode: 'Voice Mode',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 243 | <code>        speechOff: 'Voice Off',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 244 | <code>        speechServer: 'ElevenLabs Cloud Voice',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 245 | <code>        speechCosyVoice3: 'CosyVoice3 Local High Quality',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 246 | <code>        scale: 'Scale',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 247 | <code>        showInTaskbar: 'Show avatar in taskbar',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 248 | <code>        quit: 'Quit',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 249 | <code>        undo: 'Undo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 250 | <code>        redo: 'Redo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 251 | <code>        cut: 'Cut',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 252 | <code>        copy: 'Copy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 253 | <code>        paste: 'Paste',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 254 | <code>        selectAll: 'Select All',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 255 | <code>        trayTooltip: 'AILIS Avatar'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 256 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>    ja: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 258 | <code>        showPet: 'アバターを表示',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 259 | <code>        hidePet: 'アバターを隠す',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 260 | <code>        controlPanel: 'コントロールパネル',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 261 | <code>        chat: 'チャット',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 262 | <code>        language: '言語',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 263 | <code>        speechMode: '音声モード',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 264 | <code>        speechOff: '音声オフ',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 265 | <code>        speechServer: 'ElevenLabs クラウド音声',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 266 | <code>        speechCosyVoice3: 'CosyVoice3 ローカル高品質',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 267 | <code>        scale: '倍率',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 268 | <code>        showInTaskbar: 'アバターをタスクバーに表示',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 269 | <code>        quit: '終了',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 270 | <code>        undo: '元に戻す',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 271 | <code>        redo: 'やり直し',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 272 | <code>        cut: '切り取り',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 273 | <code>        copy: 'コピー',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 274 | <code>        paste: '貼り付け',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 275 | <code>        selectAll: 'すべて選択',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 276 | <code>        trayTooltip: 'AILIS アバター'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 277 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 278 | <code>    ko: Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 279 | <code>        showPet: '아바타 표시',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 280 | <code>        hidePet: '아바타 숨기기',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 281 | <code>        controlPanel: '제어판',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 282 | <code>        chat: '채팅',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 283 | <code>        language: '언어',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 284 | <code>        speechMode: '음성 모드',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 285 | <code>        speechOff: '음성 끄기',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 286 | <code>        speechServer: 'ElevenLabs 클라우드 음성',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 287 | <code>        speechCosyVoice3: 'CosyVoice3 로컬 고품질',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 288 | <code>        scale: '크기',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 289 | <code>        showInTaskbar: '작업 표시줄에 아바타 표시',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 290 | <code>        quit: '종료',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 291 | <code>        undo: '실행 취소',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 292 | <code>        redo: '다시 실행',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 293 | <code>        cut: '잘라내기',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 294 | <code>        copy: '복사',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 295 | <code>        paste: '붙여넣기',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 296 | <code>        selectAll: '모두 선택',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 297 | <code>        trayTooltip: 'AILIS 아바타'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 298 | <code>    })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 300 | <code>const SPEECH_MODEL_REMOTE_HOSTS = {</code> | 声明局部标识符 `SPEECH_MODEL_REMOTE_HOSTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 301 | <code>    modelscope: 'https://www.modelscope.cn/models/',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 302 | <code>    huggingface: 'https://huggingface.co/'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 303 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 304 | <code>const PET_CURSOR_TRACK_INTERVAL_MS = 50;</code> | 声明局部标识符 `PET_CURSOR_TRACK_INTERVAL_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 305 | <code>const APP_ICON_PATH = path.join(__dirname, 'assets', 'ailis-icon.png');</code> | 声明局部标识符 `APP_ICON_PATH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 306 | <code>const APP_WINDOWS_ICON_PATH = path.join(__dirname, '..', 'build', 'icon.ico');</code> | 声明局部标识符 `APP_WINDOWS_ICON_PATH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 307 | <code>const APP_TRAY_ICON_PATH = path.join(__dirname, 'assets', 'ailis-tray.png');</code> | 声明局部标识符 `APP_TRAY_ICON_PATH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 309 | <code>function getExistingImagePath(...candidatePaths) {</code> | 定义函数 `getExistingImagePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 310 | <code>    for (const candidatePath of candidatePaths) {</code> | 声明局部标识符 `candidatePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 311 | <code>        if (candidatePath &amp;&amp; fs.existsSync(candidatePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 312 | <code>            return candidatePath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 313 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 314 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 315 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 316 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>function getAppIconPath() {</code> | 定义函数 `getAppIconPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 319 | <code>    if (process.platform === 'win32') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 320 | <code>        // Windows taskbar/window icons are most reliable with .ico, especially in dev Electron runs.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 321 | <code>        return getExistingImagePath(APP_WINDOWS_ICON_PATH, APP_ICON_PATH);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 322 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>    return getExistingImagePath(APP_ICON_PATH, APP_WINDOWS_ICON_PATH);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 324 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>function getTrayIconPath() {</code> | 定义函数 `getTrayIconPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 327 | <code>    return getExistingImagePath(APP_TRAY_ICON_PATH, APP_ICON_PATH);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 328 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>app.setName('AILIS');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 331 | <code>app.setAppUserModelId('com.ailis.desktop');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 333 | <code>let petWindow = null;</code> | 声明局部标识符 `petWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 334 | <code>let chatWindow = null;</code> | 声明局部标识符 `chatWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 335 | <code>let controlWindow = null;</code> | 声明局部标识符 `controlWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 336 | <code>let controlWindowLoadPromise = null;</code> | 声明局部标识符 `controlWindowLoadPromise`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 337 | <code>let agentLabWindow = null;</code> | 声明局部标识符 `agentLabWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 338 | <code>let agentLabWindowLoadPromise = null;</code> | 声明局部标识符 `agentLabWindowLoadPromise`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 339 | <code>let tray = null;</code> | 声明局部标识符 `tray`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 340 | <code>let isQuitting = false;</code> | 声明局部标识符 `isQuitting`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 341 | <code>let desktopState = null;</code> | 声明局部标识符 `desktopState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 342 | <code>let desktopASRManager = null;</code> | 声明局部标识符 `desktopASRManager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 343 | <code>let voiceRuntimeBootstrap = null;</code> | 声明局部标识符 `voiceRuntimeBootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 344 | <code>let vllmLocalDeployer = null;</code> | 声明局部标识符 `vllmLocalDeployer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 345 | <code>let ollamaLocalRuntime = null;</code> | 声明局部标识符 `ollamaLocalRuntime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 346 | <code>let assetPackRuntime = null;</code> | 声明局部标识符 `assetPackRuntime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 347 | <code>let runtimeAssetManager = null;</code> | 声明局部标识符 `runtimeAssetManager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 348 | <code>let assistantGateway = null;</code> | 声明局部标识符 `assistantGateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 349 | <code>let agentRuntimeSupervisor = null;</code> | 声明局部标识符 `agentRuntimeSupervisor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 350 | <code>let ailisGateway = null;</code> | 声明局部标识符 `ailisGateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 351 | <code>let ailisGatewayStartPromise = null;</code> | 声明局部标识符 `ailisGatewayStartPromise`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 352 | <code>let ailisChatHistoryStore = null;</code> | 声明局部标识符 `ailisChatHistoryStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 353 | <code>let runtimeComponentsInstallRun = null;</code> | 声明局部标识符 `runtimeComponentsInstallRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 354 | <code>let lastRuntimeComponentsInstallRun = null;</code> | 声明局部标识符 `lastRuntimeComponentsInstallRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 355 | <code>let petDialogueCollapsedBounds = null;</code> | 声明局部标识符 `petDialogueCollapsedBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 356 | <code>let petDialogueExpanded = false;</code> | 声明局部标识符 `petDialogueExpanded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 357 | <code>let petDialogueExtraTop = 0;</code> | 声明局部标识符 `petDialogueExtraTop`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 358 | <code>let petDialogueExtraWidth = 0;</code> | 声明局部标识符 `petDialogueExtraWidth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 359 | <code>let petDialogueBoundsMutation = false;</code> | 声明局部标识符 `petDialogueBoundsMutation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 360 | <code>let petDialogueBoundsMutationTimer = null;</code> | 声明局部标识符 `petDialogueBoundsMutationTimer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 361 | <code>let petMousePassthroughEnabled = false;</code> | 声明局部标识符 `petMousePassthroughEnabled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 362 | <code>let petDragState = null;</code> | 声明局部标识符 `petDragState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 363 | <code>let petCursorTrackingTimer = null;</code> | 声明局部标识符 `petCursorTrackingTimer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 364 | <code>let petCursorTrackingLastSignature = '';</code> | 声明局部标识符 `petCursorTrackingLastSignature`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 365 | <code>let visionRegionSelectionRequest = null;</code> | 声明局部标识符 `visionRegionSelectionRequest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 366 | <code>const windowPersistTimers = new Map();</code> | 声明局部标识符 `windowPersistTimers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 367 | <code>const speechModelDownloadTasks = new Map();</code> | 声明局部标识符 `speechModelDownloadTasks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 368 | <code>const desktopPlatformAdapter = createAILISDesktopPlatformAdapter({</code> | 声明局部标识符 `desktopPlatformAdapter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 369 | <code>    BrowserWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 370 | <code>    desktopCapturer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 371 | <code>    screen,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 372 | <code>    icon: getAppIconPath(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 373 | <code>    preloadPath: path.join(__dirname, 'preload.cjs'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 374 | <code>    loadWindowContent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 375 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 377 | <code>if (typeof protocol?.registerSchemesAsPrivileged === 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 378 | <code>    protocol.registerSchemesAsPrivileged([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 379 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 380 | <code>            scheme: LOCAL_RESOURCE_PROTOCOL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 381 | <code>            privileges: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 382 | <code>                standard: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 383 | <code>                secure: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 384 | <code>                supportFetchAPI: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 385 | <code>                corsEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 386 | <code>                stream: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 387 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 388 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 389 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 390 | <code>            scheme: ASSET_PACK_PROTOCOL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 391 | <code>            privileges: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 392 | <code>                standard: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 393 | <code>                secure: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 394 | <code>                supportFetchAPI: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 395 | <code>                corsEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 396 | <code>                stream: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 397 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 398 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 399 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 400 | <code>            scheme: SPEECH_MODEL_PROTOCOL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 401 | <code>            privileges: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 402 | <code>                standard: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 403 | <code>                secure: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 404 | <code>                supportFetchAPI: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 405 | <code>                corsEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 406 | <code>                stream: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 407 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 408 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 409 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 410 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 412 | <code>function isDevMode() {</code> | 定义函数 `isDevMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 413 | <code>    return Boolean(devServerUrl);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 414 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 416 | <code>function buildRendererUrl(pageName) {</code> | 定义函数 `buildRendererUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 417 | <code>    if (isDevMode()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 418 | <code>        return `${devServerUrl &#124;&#124; DEFAULT_DEV_SERVER_URL}/${pageName}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 419 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 420 | <code>    const unpackedRendererPath = process.resourcesPath</code> | 声明局部标识符 `unpackedRendererPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 421 | <code>        ? path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', pageName)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 422 | <code>        : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 423 | <code>    if (unpackedRendererPath &amp;&amp; fs.existsSync(unpackedRendererPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 424 | <code>        return unpackedRendererPath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 425 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 426 | <code>    return path.join(__dirname, '..', 'dist', pageName);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 427 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>function ensureSafePathSegments(rawValue, fieldName) {</code> | 定义函数 `ensureSafePathSegments`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 430 | <code>    const segments = String(rawValue &#124;&#124; '')</code> | 声明局部标识符 `segments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 431 | <code>        .split('/')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 432 | <code>        .map((segment) =&gt; segment.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 433 | <code>        .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 434 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 435 | <code>    if (!segments.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 436 | <code>        throw new Error(`缺少 ${fieldName}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 437 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 439 | <code>    for (const segment of segments) {</code> | 声明局部标识符 `segment`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 440 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 441 | <code>            segment === '.' &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 442 | <code>            segment === '..' &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 443 | <code>            segment.includes('\\') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 444 | <code>            segment.includes(':')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 445 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 446 | <code>            throw new Error(`${fieldName} 含有非法路径片段`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 447 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 448 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 450 | <code>    return segments;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 451 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 453 | <code>function resolveSpeechModelFilePath(rootDir, { source, model, revision, filename }) {</code> | 定义函数 `resolveSpeechModelFilePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 454 | <code>    const rootPath = path.resolve(rootDir);</code> | 声明局部标识符 `rootPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 455 | <code>    const targetPath = path.resolve(</code> | 声明局部标识符 `targetPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 456 | <code>        rootPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 457 | <code>        source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 458 | <code>        ...ensureSafePathSegments(model, 'model'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 459 | <code>        revision,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 460 | <code>        ...ensureSafePathSegments(filename, 'filename')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 461 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 463 | <code>    if (!targetPath.startsWith(rootPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 464 | <code>        throw new Error('语音模型路径越界');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 465 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 467 | <code>    return targetPath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 468 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 469 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 470 | <code>function getSpeechModelCacheRoot() {</code> | 定义函数 `getSpeechModelCacheRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 471 | <code>    return path.join(app.getPath('userData'), SPEECH_MODEL_CACHE_DIRNAME);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 472 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 474 | <code>function getVisionCacheRoot() {</code> | 定义函数 `getVisionCacheRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 475 | <code>    return path.join(app.getPath('userData'), VISION_CACHE_DIRNAME);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 476 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 477 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 478 | <code>function getProjectRoot() {</code> | 定义函数 `getProjectRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 479 | <code>    return path.resolve(__dirname, '..');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 480 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 482 | <code>function readJsonFromCandidates(candidates = []) {</code> | 定义函数 `readJsonFromCandidates`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 483 | <code>    const errors = [];</code> | 声明局部标识符 `errors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 484 | <code>    for (const candidate of candidates.filter(Boolean)) {</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 485 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 486 | <code>            if (!fs.existsSync(candidate)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 487 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 488 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 489 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 490 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 491 | <code>                path: candidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 492 | <code>                data: JSON.parse(fs.readFileSync(candidate, 'utf8')),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 493 | <code>                error: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 494 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 495 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 496 | <code>            errors.push(`${candidate}: ${error?.message &#124;&#124; error}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 497 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 498 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 500 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 501 | <code>        path: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 502 | <code>        data: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 503 | <code>        error: errors.join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 504 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 505 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 506 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 507 | <code>function getRuntimeComponentManifest() {</code> | 定义函数 `getRuntimeComponentManifest`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 508 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 509 | <code>        path.join(app.getAppPath(), 'installer', 'ailis-runtime-components.json'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 510 | <code>        path.join(getProjectRoot(), 'installer', 'ailis-runtime-components.json')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 511 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 512 | <code>    const result = readJsonFromCandidates(candidates);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 513 | <code>    const components = Array.isArray(result.data?.components) ? result.data.components : [];</code> | 声明局部标识符 `components`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 514 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 515 | <code>        ok: result.ok &amp;&amp; components.length &gt; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 516 | <code>        path: result.path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 517 | <code>        schemaVersion: result.data?.schemaVersion &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 518 | <code>        product: result.data?.product &#124;&#124; 'AILIS',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 519 | <code>        installMode: result.data?.installMode &#124;&#124; 'deferred-runtime-components',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 520 | <code>        components,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 521 | <code>        error: result.error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 522 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 525 | <code>function getRuntimeComponentSelection() {</code> | 定义函数 `getRuntimeComponentSelection`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 526 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 527 | <code>        process.resourcesPath ? path.join(process.resourcesPath, 'ailis-runtime-components.selected.json') : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 528 | <code>        app.isPackaged ? path.join(path.dirname(process.execPath), 'resources', 'ailis-runtime-components.selected.json') : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 529 | <code>        path.join(getProjectRoot(), 'tmp', 'ailis-runtime-components.selected.json')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 530 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 531 | <code>    const result = readJsonFromCandidates(candidates);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 532 | <code>    const components = result.data?.components &amp;&amp; typeof result.data.components === 'object'</code> | 声明局部标识符 `components`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 533 | <code>        ? result.data.components</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 534 | <code>        : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 535 | <code>    const selectedIds = Object.entries(components)</code> | 声明局部标识符 `selectedIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 536 | <code>        .filter(([, selected]) =&gt; selected === true)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 537 | <code>        .map(([id]) =&gt; id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 539 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 540 | <code>        ok: result.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 541 | <code>        path: result.path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 542 | <code>        source: result.data?.source &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 543 | <code>        installMode: result.data?.installMode &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 544 | <code>        components,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 545 | <code>        selectedIds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 546 | <code>        error: result.error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 547 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 548 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 549 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 550 | <code>function normalizeRuntimeComponentIds(ids = []) {</code> | 定义函数 `normalizeRuntimeComponentIds`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 551 | <code>    return [...new Set((Array.isArray(ids) ? ids : [])</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 552 | <code>        .map((id) =&gt; String(id &#124;&#124; '').trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 553 | <code>        .filter(Boolean))];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 554 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 555 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 556 | <code>function getRuntimeComponentById(id, manifest = getRuntimeComponentManifest()) {</code> | 定义函数 `getRuntimeComponentById`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 557 | <code>    return (manifest.components &#124;&#124; []).find((component) =&gt; component.id === id) &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 558 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 559 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 560 | <code>function expandRuntimeComponentDependencies(ids = [], manifest = getRuntimeComponentManifest()) {</code> | 定义函数 `expandRuntimeComponentDependencies`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 561 | <code>    const expanded = new Set();</code> | 声明局部标识符 `expanded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 562 | <code>    const visit = (id) =&gt; {</code> | 声明局部标识符 `visit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 563 | <code>        if (!id &#124;&#124; expanded.has(id)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 564 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 565 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 566 | <code>        const component = getRuntimeComponentById(id, manifest);</code> | 声明局部标识符 `component`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 567 | <code>        for (const dependencyId of component?.dependsOn &#124;&#124; []) {</code> | 声明局部标识符 `dependencyId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 568 | <code>            visit(dependencyId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 569 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 570 | <code>        expanded.add(id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 571 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 572 | <code>    normalizeRuntimeComponentIds(ids).forEach(visit);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 573 | <code>    return [...expanded];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 574 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>function resolveRuntimeComponentPackName(component = {}) {</code> | 定义函数 `resolveRuntimeComponentPackName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 577 | <code>    return String(component.packName &#124;&#124; '').replace(/\$\{version\}/g, app.getVersion());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 578 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 580 | <code>function getRuntimePackSearchDirs() {</code> | 定义函数 `getRuntimePackSearchDirs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 581 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 582 | <code>        normalizeRuntimePackDir(process.env.AILIS_RUNTIME_PACK_DIR &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 583 | <code>        process.resourcesPath ? path.join(process.resourcesPath, 'runtime-packs') : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 584 | <code>        app.isPackaged ? path.join(path.dirname(process.execPath), 'runtime-packs') : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 585 | <code>        app.isPackaged ? path.join(path.dirname(process.execPath), 'resources', 'runtime-packs') : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 586 | <code>        path.join(getProjectRoot(), 'runtime-packs'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 587 | <code>        path.join(getProjectRoot(), 'build-cache', 'runtime-packs')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 588 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 589 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 591 | <code>function normalizeRuntimePackDir(value = '') {</code> | 定义函数 `normalizeRuntimePackDir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 592 | <code>    const text = String(value &#124;&#124; '').trim();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 593 | <code>    return text ? path.resolve(text) : '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 594 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 596 | <code>function resolveRuntimeComponentPack(component = {}) {</code> | 定义函数 `resolveRuntimeComponentPack`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 597 | <code>    const packName = resolveRuntimeComponentPackName(component);</code> | 声明局部标识符 `packName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 598 | <code>    if (!packName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 599 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 600 | <code>            available: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 601 | <code>            path: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 602 | <code>            packName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 603 | <code>            searchDirs: getRuntimePackSearchDirs()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 604 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 605 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 606 | <code>    const searchDirs = getRuntimePackSearchDirs();</code> | 声明局部标识符 `searchDirs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 607 | <code>    const foundPath = searchDirs</code> | 声明局部标识符 `foundPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 608 | <code>        .map((dir) =&gt; path.join(dir, packName))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 609 | <code>        .find((candidate) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 610 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 611 | <code>                return fs.existsSync(candidate) &amp;&amp; fs.statSync(candidate).isFile();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 612 | <code>            } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 613 | <code>                return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 614 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 615 | <code>        }) &#124;&#124; '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 616 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 617 | <code>        available: Boolean(foundPath),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 618 | <code>        path: foundPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 619 | <code>        packName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 620 | <code>        searchDirs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 621 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 622 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 623 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 624 | <code>function resolveRuntimeExtractRoot(component = {}) {</code> | 定义函数 `resolveRuntimeExtractRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 625 | <code>    const extractTo = String(component.extractTo &#124;&#124; 'resources').replace(/\\/g, '/').replace(/^\/+/, '');</code> | 声明局部标识符 `extractTo`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 626 | <code>    if (path.isAbsolute(extractTo)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 627 | <code>        return extractTo;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 628 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 629 | <code>    if (extractTo === 'resources' &#124;&#124; extractTo.startsWith('resources/')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 630 | <code>        const rest = extractTo === 'resources' ? '' : extractTo.slice('resources/'.length);</code> | 声明局部标识符 `rest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 631 | <code>        return app.isPackaged &amp;&amp; process.resourcesPath</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 632 | <code>            ? path.join(process.resourcesPath, rest)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 633 | <code>            : path.join(getProjectRoot(), rest);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 634 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 635 | <code>    return app.isPackaged &amp;&amp; process.resourcesPath</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 636 | <code>        ? path.join(process.resourcesPath, extractTo)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 637 | <code>        : path.join(getProjectRoot(), extractTo);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 638 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 639 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 640 | <code>function resolveRuntimeComponentInstallRoot(component = {}) {</code> | 定义函数 `resolveRuntimeComponentInstallRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 641 | <code>    const installRoot = String(component.installRoot &#124;&#124; '').replace(/\\/g, '/').replace(/^\/+/, '');</code> | 声明局部标识符 `installRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 642 | <code>    if (!installRoot) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 643 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 644 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 645 | <code>    if (path.isAbsolute(installRoot)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 646 | <code>        return installRoot;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 647 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 648 | <code>    if (installRoot === 'resources' &#124;&#124; installRoot.startsWith('resources/')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 649 | <code>        const rest = installRoot === 'resources' ? '' : installRoot.slice('resources/'.length);</code> | 声明局部标识符 `rest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 650 | <code>        return app.isPackaged &amp;&amp; process.resourcesPath</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 651 | <code>            ? path.join(process.resourcesPath, rest)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 652 | <code>            : path.join(getProjectRoot(), rest);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 653 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 654 | <code>    return app.isPackaged &amp;&amp; process.resourcesPath</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 655 | <code>        ? path.join(process.resourcesPath, installRoot)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 656 | <code>        : path.join(getProjectRoot(), installRoot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 657 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 658 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 659 | <code>function runtimePathExists(targetPath = '') {</code> | 定义函数 `runtimePathExists`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 660 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 661 | <code>        return Boolean(targetPath &amp;&amp; fs.existsSync(targetPath));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 662 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 663 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 664 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 665 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 666 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 667 | <code>function runRuntimeProcess(command, args = [], options = {}) {</code> | 定义函数 `runRuntimeProcess`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 668 | <code>    return new Promise((resolve) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 669 | <code>        const logs = [];</code> | 声明局部标识符 `logs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 670 | <code>        const child = spawn(command, args, {</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 671 | <code>            cwd: options.cwd &#124;&#124; getProjectRoot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 672 | <code>            windowsHide: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 673 | <code>            shell: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 674 | <code>            env: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 675 | <code>                ...process.env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 676 | <code>                ...(options.env &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 677 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 678 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 679 | <code>        const append = (chunk) =&gt; {</code> | 声明局部标识符 `append`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 680 | <code>            const text = String(chunk &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 681 | <code>            if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 682 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 683 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 684 | <code>            text.split(/\r?\n/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 685 | <code>                .map((line) =&gt; line.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 686 | <code>                .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 687 | <code>                .forEach((line) =&gt; logs.push(line));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 688 | <code>            if (logs.length &gt; 160) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 689 | <code>                logs.splice(0, logs.length - 160);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 690 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 691 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 692 | <code>        child.stdout?.on('data', append);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 693 | <code>        child.stderr?.on('data', append);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 694 | <code>        child.on('error', (error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 695 | <code>            resolve({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 696 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 697 | <code>                code: -1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 698 | <code>                error: error?.message &#124;&#124; String(error),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 699 | <code>                logs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 700 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 701 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 702 | <code>        child.on('close', (code) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 703 | <code>            resolve({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 704 | <code>                ok: code === 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 705 | <code>                code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 706 | <code>                error: code === 0 ? '' : `${command} exited with code ${code}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 707 | <code>                logs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 708 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 709 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 710 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 711 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 712 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 713 | <code>async function extractRuntimePack(component, pack) {</code> | 定义函数 `extractRuntimePack`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 714 | <code>    const extractRoot = resolveRuntimeExtractRoot(component);</code> | 声明局部标识符 `extractRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 715 | <code>    await fsp.mkdir(extractRoot, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 716 | <code>    if (process.platform === 'win32') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 717 | <code>        const script = [</code> | 声明局部标识符 `script`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 718 | <code>            '$ErrorActionPreference = "Stop"',</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 719 | <code>            `Expand-Archive -LiteralPath ${JSON.stringify(pack.path)} -DestinationPath ${JSON.stringify(extractRoot)} -Force`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 720 | <code>        ].join('; ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 721 | <code>        return await runRuntimeProcess('powershell.exe', [</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 722 | <code>            '-NoProfile',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 723 | <code>            '-ExecutionPolicy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 724 | <code>            'Bypass',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 725 | <code>            '-Command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 726 | <code>            script</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 727 | <code>        ], {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 728 | <code>            cwd: getProjectRoot()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 729 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 730 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 731 | <code>    const unzipResult = await runRuntimeProcess('unzip', ['-o', pack.path, '-d', extractRoot], {</code> | 声明局部标识符 `unzipResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 732 | <code>        cwd: getProjectRoot()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 733 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 734 | <code>    if (unzipResult.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 735 | <code>        return unzipResult;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 736 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 737 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 738 | <code>        ...unzipResult,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 739 | <code>        error: unzipResult.error &#124;&#124; 'unzip command failed; install unzip or provide an extracted runtime directory.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 740 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 741 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 742 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 743 | <code>function getRuntimeComponentReadiness(component, voiceSummary = getVoiceRuntimeBootstrap().getFastSummary()) {</code> | 定义函数 `getRuntimeComponentReadiness`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 744 | <code>    const installRoot = resolveRuntimeComponentInstallRoot(component);</code> | 声明局部标识符 `installRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 745 | <code>    const base = {</code> | 声明局部标识符 `base`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 746 | <code>        id: component.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 747 | <code>        title: component.title &#124;&#124; component.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 748 | <code>        kind: component.kind &#124;&#124; 'runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 749 | <code>        selected: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 750 | <code>        status: 'missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 751 | <code>        ready: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 752 | <code>        detail: component.description &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 753 | <code>        estimatedUnpackedSize: component.estimatedUnpackedSize &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 754 | <code>        installRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 755 | <code>        installRootExists: runtimePathExists(installRoot)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 756 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 757 | <code>    if (component.id === 'python-runtime') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 758 | <code>        const ready = Boolean(voiceSummary.preferredPython &#124;&#124; base.installRootExists);</code> | 声明局部标识符 `ready`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 759 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 760 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 761 | <code>            ready,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 762 | <code>            status: ready ? 'ready' : 'missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 763 | <code>            detail: ready</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 764 | <code>                ? `Python 运行时可用：${voiceSummary.preferredPython &#124;&#124; installRoot}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 765 | <code>                : '缺少 AILIS 私有 Python runtime。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 766 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 767 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 768 | <code>    if (component.id === 'cosyvoice3-runtime') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 769 | <code>        const ready = Boolean(voiceSummary.cosyVoice3?.ok);</code> | 声明局部标识符 `ready`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 770 | <code>        const partial = Boolean(voiceSummary.cosyVoice3?.sourceExists &#124;&#124; voiceSummary.cosyVoice3?.modelExists &#124;&#124; base.installRootExists);</code> | 声明局部标识符 `partial`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 771 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 772 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 773 | <code>            ready,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 774 | <code>            status: ready ? 'ready' : partial ? 'partial' : 'missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 775 | <code>            detail: ready</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 776 | <code>                ? 'CosyVoice3 已通过本地合成验证。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 777 | <code>                : partial</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 778 | <code>                    ? 'CosyVoice3 文件部分存在，需要继续诊断或验证。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 779 | <code>                    : '缺少 CosyVoice3 源码、依赖或模型。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 780 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 781 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 782 | <code>    if (component.id === 'asr-runtime') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 783 | <code>        const ready = Boolean(voiceSummary.asr?.ok);</code> | 声明局部标识符 `ready`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 784 | <code>        const partial = Boolean(voiceSummary.asr?.modelCached &#124;&#124; base.installRootExists);</code> | 声明局部标识符 `partial`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 785 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 786 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 787 | <code>            ready,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 788 | <code>            status: ready ? 'ready' : partial ? 'partial' : 'missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 789 | <code>            detail: ready</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 790 | <code>                ? '本地 ASR 已通过模型加载验证。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 791 | <code>                : partial</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 792 | <code>                    ? 'ASR 模型或运行时部分存在，需要继续验证。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 793 | <code>                    : '缺少本地 ASR runtime 或模型缓存。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 794 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 795 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 796 | <code>    if (component.id === 'web-runtime') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 797 | <code>        const manifestPath = installRoot ? path.join(installRoot, 'manifest.json') : '';</code> | 声明局部标识符 `manifestPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 798 | <code>        const ready = runtimePathExists(manifestPath) &#124;&#124; base.installRootExists;</code> | 声明局部标识符 `ready`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 799 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 800 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 801 | <code>            ready,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 802 | <code>            status: ready ? 'ready' : 'missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 803 | <code>            detail: ready</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 804 | <code>                ? `Web/Search runtime 已存在：${manifestPath &#124;&#124; installRoot}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 805 | <code>                : '缺少 AILIS Web/Search 本地运行时。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 806 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 807 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 808 | <code>    return base;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 809 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 810 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 811 | <code>function getRuntimeComponentsState() {</code> | 定义函数 `getRuntimeComponentsState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 812 | <code>    const manifest = getRuntimeComponentManifest();</code> | 声明局部标识符 `manifest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 813 | <code>    const selection = getRuntimeComponentSelection();</code> | 声明局部标识符 `selection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 814 | <code>    const selectedIds = selection.selectedIds &#124;&#124; [];</code> | 声明局部标识符 `selectedIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 815 | <code>    const expandedSelectedIds = expandRuntimeComponentDependencies(selectedIds, manifest);</code> | 声明局部标识符 `expandedSelectedIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 816 | <code>    const voiceSummary = getVoiceRuntimeBootstrap().getFastSummary();</code> | 声明局部标识符 `voiceSummary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 817 | <code>    const components = (manifest.components &#124;&#124; []).map((component) =&gt; {</code> | 声明局部标识符 `components`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 818 | <code>        const pack = resolveRuntimeComponentPack(component);</code> | 声明局部标识符 `pack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 819 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 820 | <code>            ...getRuntimeComponentReadiness(component, voiceSummary),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 821 | <code>            selected: selectedIds.includes(component.id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 822 | <code>            selectedByDependency: !selectedIds.includes(component.id) &amp;&amp; expandedSelectedIds.includes(component.id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 823 | <code>            dependsOn: component.dependsOn &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 824 | <code>            pack</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 825 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 826 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 827 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 828 | <code>        manifest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 829 | <code>        selection,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 830 | <code>        components,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 831 | <code>        selectedIds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 832 | <code>        expandedSelectedIds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 833 | <code>        hasInstallerSelection: Boolean(selection.ok),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 834 | <code>        installRun: runtimeComponentsInstallRun &#124;&#124; lastRuntimeComponentsInstallRun &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 835 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 836 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 837 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 838 | <code>function getGatewayWorkspaceRoot() {</code> | 定义函数 `getGatewayWorkspaceRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 839 | <code>    if (app.isPackaged) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 840 | <code>        return path.join(app.getPath('userData'), 'workspace');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 841 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 842 | <code>    return getProjectRoot();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 843 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 844 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 845 | <code>function getDefaultAILISStateDir() {</code> | 定义函数 `getDefaultAILISStateDir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 846 | <code>    if (app.isPackaged) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 847 | <code>        return path.join(app.getPath('userData'), AILIS_STATE_DIRNAME);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 848 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 849 | <code>    return path.join(getProjectRoot(), AILIS_STATE_DIRNAME);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 850 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 851 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 852 | <code>function resolveAILISStateDir(value = '') {</code> | 定义函数 `resolveAILISStateDir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 853 | <code>    const normalized = normalizeAILISStateDir(value &#124;&#124; DEFAULT_AILIS_STATE_DIR);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 854 | <code>    if (!normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 855 | <code>        return getDefaultAILISStateDir();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 856 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 857 | <code>    const relativeBaseDir = app.isPackaged ? app.getPath('userData') : getProjectRoot();</code> | 声明局部标识符 `relativeBaseDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 858 | <code>    return path.isAbsolute(normalized)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 859 | <code>        ? path.resolve(normalized)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 860 | <code>        : path.resolve(relativeBaseDir, normalized);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 861 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 862 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 863 | <code>function getPersistedAILISStateDir() {</code> | 定义函数 `getPersistedAILISStateDir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 864 | <code>    return resolveAILISStateDir(desktopState?.preferences?.ailisStateDir);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 865 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 866 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 867 | <code>function ensureAILISChatHistoryStore() {</code> | 定义函数 `ensureAILISChatHistoryStore`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 868 | <code>    const rootDir = path.join(getPersistedAILISStateDir(), 'chat-history');</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 869 | <code>    if (!ailisChatHistoryStore &#124;&#124; ailisChatHistoryStore.rootDir !== path.resolve(rootDir)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 870 | <code>        ailisChatHistoryStore = new AILISChatHistoryStore({ rootDir });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 871 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 872 | <code>    return ailisChatHistoryStore;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 873 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 874 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 875 | <code>function getDefaultVoiceRuntimeRoot() {</code> | 定义函数 `getDefaultVoiceRuntimeRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 876 | <code>    const packagedCandidates = [</code> | 声明局部标识符 `packagedCandidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 877 | <code>        process.resourcesPath ? path.join(process.resourcesPath, 'models', 'voice-runtime') : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 878 | <code>        app.isPackaged ? path.join(path.dirname(process.execPath), 'resources', 'models', 'voice-runtime') : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 879 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 880 | <code>    const packagedRuntimeRoot = packagedCandidates.find((candidate) =&gt; {</code> | 声明局部标识符 `packagedRuntimeRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 881 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 882 | <code>            return Boolean(candidate &amp;&amp; fs.existsSync(candidate) &amp;&amp; fs.statSync(candidate).isDirectory());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 883 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 884 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 885 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 886 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 887 | <code>    if (packagedRuntimeRoot) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 888 | <code>        return packagedRuntimeRoot;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 889 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 890 | <code>    if (app.isPackaged) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 891 | <code>        return path.join(app.getPath('userData'), 'local-runtimes');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 892 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 893 | <code>    return path.join(getProjectRoot(), 'models', 'voice-runtime');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 894 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 895 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 896 | <code>function resolveVoiceRuntimeRoot(value = '') {</code> | 定义函数 `resolveVoiceRuntimeRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 897 | <code>    const normalized = normalizeVoiceRuntimeRoot(value);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 898 | <code>    if (!normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 899 | <code>        return getDefaultVoiceRuntimeRoot();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 900 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 901 | <code>    const relativeBaseDir = app.isPackaged ? app.getPath('userData') : getProjectRoot();</code> | 声明局部标识符 `relativeBaseDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 902 | <code>    return path.isAbsolute(normalized)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 903 | <code>        ? path.resolve(normalized)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 904 | <code>        : path.resolve(relativeBaseDir, normalized);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 905 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 907 | <code>function getPersistedVoiceRuntimeRoot() {</code> | 定义函数 `getPersistedVoiceRuntimeRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 908 | <code>    return resolveVoiceRuntimeRoot(desktopState?.preferences?.voiceRuntimeRoot);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 909 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 910 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 911 | <code>function getVoiceRuntimeBootstrap() {</code> | 定义函数 `getVoiceRuntimeBootstrap`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 912 | <code>    if (!voiceRuntimeBootstrap) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 913 | <code>        voiceRuntimeBootstrap = new VoiceRuntimeBootstrap({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 914 | <code>            projectRoot: getProjectRoot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 915 | <code>            userDataPath: app.getPath('userData'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 916 | <code>            appDataPath: app.getPath('appData'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 917 | <code>            runtimeRoot: getPersistedVoiceRuntimeRoot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 918 | <code>            platform: process.platform</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 919 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 920 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 921 | <code>    return voiceRuntimeBootstrap;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 922 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 923 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 924 | <code>function configureCosyVoice3Runtime() {</code> | 定义函数 `configureCosyVoice3Runtime`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 925 | <code>    const runtime = getVoiceRuntimeBootstrap();</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 926 | <code>    const paths = runtime.getPaths();</code> | 声明局部标识符 `paths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 927 | <code>    configureCosyVoice3TTS({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 928 | <code>        projectRoot: getProjectRoot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 929 | <code>        userDataPath: app.getPath('userData'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 930 | <code>        voiceRuntimeRoot: paths.localRuntimeRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 931 | <code>        cosyVoiceRoot: paths.cosyVoiceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 932 | <code>        cosyVoice3ModelDir: paths.cosyVoice3ModelDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 933 | <code>        pythonPath: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 934 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 935 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 936 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 937 | <code>function getVllmLocalDeployer() {</code> | 定义函数 `getVllmLocalDeployer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 938 | <code>    if (!vllmLocalDeployer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 939 | <code>        vllmLocalDeployer = new VllmLocalDeployer({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 940 | <code>            projectRoot: getProjectRoot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 941 | <code>            platform: process.platform</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 942 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 943 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 944 | <code>    return vllmLocalDeployer;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 945 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 946 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 947 | <code>function getOllamaLocalRuntime() {</code> | 定义函数 `getOllamaLocalRuntime`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 948 | <code>    if (!ollamaLocalRuntime) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 949 | <code>        ollamaLocalRuntime = new OllamaLocalRuntime({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 950 | <code>            platform: process.platform</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 951 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 952 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 953 | <code>    return ollamaLocalRuntime;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 954 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 955 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 956 | <code>function getOllamaRuntimeBusyResult(settings = {}) {</code> | 定义函数 `getOllamaRuntimeBusyResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 957 | <code>    if (normalizeLlmProvider(settings.provider &#124;&#124; settings.llmProvider) !== 'ollama') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 958 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 959 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 960 | <code>    const runtime = getOllamaLocalRuntime().getStatus();</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 961 | <code>    if (!runtime?.running) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 962 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 963 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 964 | <code>    const phaseLabels = {</code> | 声明局部标识符 `phaseLabels`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 965 | <code>        diagnosing: '诊断环境',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 966 | <code>        preparing: '准备运行时',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 967 | <code>        starting_service: '启动服务',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 968 | <code>        pulling: '下载模型',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 969 | <code>        importing: '导入本地模型',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 970 | <code>        verifying: '验证推理',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 971 | <code>        switching_backend: '切换 GPU 后端'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 972 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 973 | <code>    const phase = phaseLabels[runtime.phase] &#124;&#124; '配置本地模型';</code> | 声明局部标识符 `phase`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 974 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 975 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 976 | <code>        provider: 'ollama',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 977 | <code>        code: 'local_runtime_busy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 978 | <code>        status: 'local_runtime_busy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 979 | <code>        error: `Ollama 本地模型正在${phase}，请等部署完成后再开始对话。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 980 | <code>        runtimeSetup: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 981 | <code>            status: runtime.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 982 | <code>            phase: runtime.phase,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 983 | <code>            modelId: runtime.modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 984 | <code>            baseUrl: runtime.baseUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 985 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 986 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 987 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 988 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 989 | <code>function getAssetPackRuntime() {</code> | 定义函数 `getAssetPackRuntime`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 990 | <code>    if (!assetPackRuntime) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 991 | <code>        assetPackRuntime = new AssetPackRuntime({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 992 | <code>            projectRoot: getProjectRoot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 993 | <code>            userDataPath: app.getPath('userData'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 994 | <code>            appVersion: app.getVersion()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 995 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 996 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 997 | <code>    return assetPackRuntime;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 998 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 999 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1000 | <code>function getRuntimeAssetManager() {</code> | 定义函数 `getRuntimeAssetManager`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1001 | <code>    if (!runtimeAssetManager) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1002 | <code>        runtimeAssetManager = new RuntimeAssetManager({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1003 | <code>            projectRoot: getProjectRoot()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1004 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1005 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1006 | <code>    return runtimeAssetManager;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1007 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1008 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1009 | <code>async function bootstrapVoiceRuntime(payload = {}) {</code> | 定义函数 `bootstrapVoiceRuntime`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1010 | <code>    const result = await getVoiceRuntimeBootstrap().bootstrap(payload &#124;&#124; {});</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1011 | <code>    configureCosyVoice3Runtime();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1012 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1013 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1014 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1015 | <code>function getVoiceBootstrapStepIdsForRuntimeComponents(componentIds = []) {</code> | 定义函数 `getVoiceBootstrapStepIdsForRuntimeComponents`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1016 | <code>    const ids = new Set(normalizeRuntimeComponentIds(componentIds));</code> | 声明局部标识符 `ids`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1017 | <code>    const stepIds = new Set();</code> | 声明局部标识符 `stepIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1018 | <code>    if (ids.has('python-runtime') &#124;&#124; ids.has('cosyvoice3-runtime') &#124;&#124; ids.has('asr-runtime')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1019 | <code>        stepIds.add('install_portable_python');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1020 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1021 | <code>    if (ids.has('cosyvoice3-runtime') &#124;&#124; ids.has('asr-runtime')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1022 | <code>        stepIds.add('install_voice_python_packages');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1023 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1024 | <code>    if (ids.has('cosyvoice3-runtime')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1025 | <code>        stepIds.add('install_cosyvoice_source');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1026 | <code>        stepIds.add('install_cosyvoice3_model');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1027 | <code>        stepIds.add('verify_cosyvoice3_runtime');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1028 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1029 | <code>    if (ids.has('asr-runtime')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1030 | <code>        stepIds.add('install_asr_model');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1031 | <code>        stepIds.add('verify_asr_runtime');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1032 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1033 | <code>    return [...stepIds];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1034 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1035 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1036 | <code>async function bootstrapVoiceRuntimeComponentSteps(componentIds = [], run) {</code> | 定义函数 `bootstrapVoiceRuntimeComponentSteps`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1037 | <code>    const targetStepIds = getVoiceBootstrapStepIdsForRuntimeComponents(componentIds);</code> | 声明局部标识符 `targetStepIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1038 | <code>    const completed = new Set();</code> | 声明局部标识符 `completed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1039 | <code>    const results = [];</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1040 | <code>    for (let pass = 0; pass &lt; 4; pass += 1) {</code> | 声明局部标识符 `pass`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1041 | <code>        const snapshot = getVoiceRuntimeBootstrap().diagnose();</code> | 声明局部标识符 `snapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1042 | <code>        const runnableIds = (snapshot.installPlan?.steps &#124;&#124; [])</code> | 声明局部标识符 `runnableIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1043 | <code>            .filter((step) =&gt; targetStepIds.includes(step.id) &amp;&amp; !completed.has(step.id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1044 | <code>            .map((step) =&gt; step.id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1045 | <code>        if (!runnableIds.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1046 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1047 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1048 | <code>        run.logs.push(`语音运行时安装 pass ${pass + 1}：${runnableIds.join(', ')}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1049 | <code>        const result = await bootstrapVoiceRuntime({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1050 | <code>            allowNetwork: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1051 | <code>            includeOptional: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1052 | <code>            stepIds: runnableIds</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1053 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1054 | <code>        results.push(result);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1055 | <code>        for (const step of result.steps &#124;&#124; []) {</code> | 声明局部标识符 `step`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1056 | <code>            if (step.status === 'completed' &#124;&#124; step.status === 'skipped') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1057 | <code>                completed.add(step.id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1058 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1059 | <code>            for (const entry of step.logs &#124;&#124; []) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1060 | <code>                const text = String(entry.text &#124;&#124; '').trim();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1061 | <code>                if (text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1062 | <code>                    run.logs.push(text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1063 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1064 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1065 | <code>            if (step.error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1066 | <code>                run.logs.push(`${step.title &#124;&#124; step.id}：${step.error}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1067 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1068 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1069 | <code>        if (!result.ok &amp;&amp; result.status !== 'completed_with_warnings') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1070 | <code>            return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1071 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1072 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1073 | <code>    return results[results.length - 1] &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1074 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1075 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1076 | <code>        message: '选中的语音运行时组件已经就绪或没有需要执行的步骤。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1077 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1078 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1079 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1080 | <code>async function installRuntimeComponents(payload = {}) {</code> | 定义函数 `installRuntimeComponents`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1081 | <code>    if (runtimeComponentsInstallRun?.status === 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1082 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1083 | <code>            ...runtimeComponentsInstallRun,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1084 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1085 | <code>            error: 'runtime_components_install_already_running'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1086 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1087 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1088 | <code>    const manifest = getRuntimeComponentManifest();</code> | 声明局部标识符 `manifest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1089 | <code>    const selection = getRuntimeComponentSelection();</code> | 声明局部标识符 `selection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1090 | <code>    const requestedIds = normalizeRuntimeComponentIds(payload.componentIds &#124;&#124; payload.components &#124;&#124; []);</code> | 声明局部标识符 `requestedIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1091 | <code>    const selectedIds = requestedIds.length ? requestedIds : normalizeRuntimeComponentIds(selection.selectedIds &#124;&#124; []);</code> | 声明局部标识符 `selectedIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1092 | <code>    const expandedIds = expandRuntimeComponentDependencies(selectedIds, manifest);</code> | 声明局部标识符 `expandedIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1093 | <code>    const run = {</code> | 声明局部标识符 `run`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1094 | <code>        id: `runtime-components-install-${Date.now()}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1095 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1096 | <code>        status: 'running',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1097 | <code>        startedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1098 | <code>        requestedIds: selectedIds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1099 | <code>        expandedIds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1100 | <code>        steps: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1101 | <code>        logs: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1102 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1103 | <code>    runtimeComponentsInstallRun = run;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1104 | <code>    lastRuntimeComponentsInstallRun = run;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1106 | <code>    const finish = (ok, status = ok ? 'completed' : 'failed', error = '') =&gt; {</code> | 声明局部标识符 `finish`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1107 | <code>        run.ok = ok;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1108 | <code>        run.status = status;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1109 | <code>        run.error = error;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1110 | <code>        run.finishedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1111 | <code>        runtimeComponentsInstallRun = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1112 | <code>        lastRuntimeComponentsInstallRun = run;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1113 | <code>        return run;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1114 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1116 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1117 | <code>        if (!expandedIds.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1118 | <code>            return finish(true, 'completed', '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1119 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1120 | <code>        const voiceIds = [];</code> | 声明局部标识符 `voiceIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1121 | <code>        for (const id of expandedIds) {</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1122 | <code>            const component = getRuntimeComponentById(id, manifest);</code> | 声明局部标识符 `component`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1123 | <code>            if (!component) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1124 | <code>                run.steps.push({ id, status: 'skipped', title: id, detail: 'manifest 中不存在该组件。' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1125 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1126 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1127 | <code>            const pack = resolveRuntimeComponentPack(component);</code> | 声明局部标识符 `pack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1128 | <code>            const readinessBefore = getRuntimeComponentReadiness(component);</code> | 声明局部标识符 `readinessBefore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1129 | <code>            if (readinessBefore.ready) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1130 | <code>                run.steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1131 | <code>                    id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1132 | <code>                    title: component.title &#124;&#124; id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1133 | <code>                    status: 'skipped',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1134 | <code>                    detail: '组件已经就绪。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1135 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1136 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1137 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1138 | <code>            if (pack.available) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1139 | <code>                const step = {</code> | 声明局部标识符 `step`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1140 | <code>                    id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1141 | <code>                    title: `导入 ${component.title &#124;&#124; id}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1142 | <code>                    status: 'running',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1143 | <code>                    packPath: pack.path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1144 | <code>                    installRoot: resolveRuntimeComponentInstallRoot(component),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1145 | <code>                    startedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1146 | <code>                    logs: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1147 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1148 | <code>                run.steps.push(step);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1149 | <code>                run.logs.push(`导入 runtime pack：${pack.path}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1150 | <code>                const result = await extractRuntimePack(component, pack);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1151 | <code>                step.logs = result.logs &#124;&#124; [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1152 | <code>                step.finishedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1153 | <code>                if (!result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1154 | <code>                    step.status = 'failed';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1155 | <code>                    step.error = result.error &#124;&#124; 'runtime pack 解压失败。';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1156 | <code>                    return finish(false, 'failed', step.error);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1157 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1158 | <code>                step.status = 'completed';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1159 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1160 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1161 | <code>            if (['python-runtime', 'cosyvoice3-runtime', 'asr-runtime'].includes(id)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1162 | <code>                voiceIds.push(id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1163 | <code>                run.steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1164 | <code>                    id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1165 | <code>                    title: component.title &#124;&#124; id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1166 | <code>                    status: 'queued',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1167 | <code>                    detail: '未找到离线 runtime pack，将交给 Voice Runtime Installer 自动安装。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1168 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1169 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1170 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1171 | <code>            const packName = resolveRuntimeComponentPackName(component);</code> | 声明局部标识符 `packName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1172 | <code>            const error = `缺少 ${component.title &#124;&#124; id} 的 runtime pack：${packName}。请把 runtime-packs 目录放在安装器旁边，或放到 ${process.resourcesPath &#124;&#124; 'resources'}/runtime-packs。`;</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1173 | <code>            run.steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1174 | <code>                id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1175 | <code>                title: component.title &#124;&#124; id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1176 | <code>                status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1177 | <code>                error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1178 | <code>                searched: pack.searchDirs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1179 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1180 | <code>            return finish(false, 'failed', error);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1181 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1183 | <code>        if (voiceIds.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1184 | <code>            const step = {</code> | 声明局部标识符 `step`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1185 | <code>                id: 'voice-runtime-bootstrap',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1186 | <code>                title: '自动安装选中的语音运行时组件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1187 | <code>                status: 'running',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1188 | <code>                componentIds: voiceIds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1189 | <code>                startedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1190 | <code>                logs: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1191 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1192 | <code>            run.steps.push(step);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1193 | <code>            const result = await bootstrapVoiceRuntimeComponentSteps(voiceIds, run);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1194 | <code>            step.status = result.ok &#124;&#124; result.status === 'completed_with_warnings'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1195 | <code>                ? 'completed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1196 | <code>                : 'failed';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1197 | <code>            step.finishedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1198 | <code>            step.resultStatus = result.status;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1199 | <code>            step.error = result.ok ? '' : result.error &#124;&#124; '语音运行时安装未完全通过。';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1200 | <code>            step.logs = run.logs.slice(-80);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1201 | <code>            if (!result.ok &amp;&amp; result.status !== 'completed_with_warnings') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1202 | <code>                return finish(false, 'failed', step.error);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1203 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1204 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1206 | <code>        configureCosyVoice3Runtime();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1207 | <code>        const finalState = getRuntimeComponentsState();</code> | 声明局部标识符 `finalState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1208 | <code>        const unresolved = finalState.components.filter((component) =&gt;</code> | 声明局部标识符 `unresolved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1209 | <code>            expandedIds.includes(component.id) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1210 | <code>            !component.ready &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1211 | <code>            component.id !== 'python-runtime'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1212 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1213 | <code>        if (unresolved.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1214 | <code>            run.unresolved = unresolved.map((component) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1215 | <code>                id: component.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1216 | <code>                title: component.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1217 | <code>                status: component.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1218 | <code>                detail: component.detail</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1219 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1220 | <code>            return finish(false, 'completed_with_warnings', '部分组件已安装，但仍需要重新检查或完成验证。');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1221 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1222 | <code>        return finish(true);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1223 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1224 | <code>        return finish(false, 'failed', error?.message &#124;&#124; String(error));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1225 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1226 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1228 | <code>function getVisionSnapshotLabel(target) {</code> | 定义函数 `getVisionSnapshotLabel`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1229 | <code>    if (target === 'region') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1230 | <code>        return '矩形截图';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1231 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1232 | <code>    if (target === 'active-window') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1233 | <code>        return '当前窗口截图';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1234 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1235 | <code>    if (target === 'screen') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1236 | <code>        return '屏幕截图';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1237 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1238 | <code>    if (target === 'pet-window') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1239 | <code>        return '桌宠窗口截图';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1240 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1241 | <code>    if (target === 'control-window') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1242 | <code>        return '控制面板截图';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1243 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1244 | <code>    return '聊天窗口截图';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1245 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1247 | <code>function resizeVisionImageForModel(image) {</code> | 定义函数 `resizeVisionImageForModel`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1248 | <code>    const size = image.getSize();</code> | 声明局部标识符 `size`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1249 | <code>    const maxEdge = Math.max(size.width &#124;&#124; 0, size.height &#124;&#124; 0);</code> | 声明局部标识符 `maxEdge`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1250 | <code>    if (!maxEdge &#124;&#124; maxEdge &lt;= VISION_MODEL_MAX_EDGE) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1251 | <code>        return image;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1252 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1254 | <code>    const scale = VISION_MODEL_MAX_EDGE / maxEdge;</code> | 声明局部标识符 `scale`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1255 | <code>    return image.resize({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1256 | <code>        width: Math.max(1, Math.round(size.width * scale)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1257 | <code>        height: Math.max(1, Math.round(size.height * scale)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1258 | <code>        quality: 'best'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1259 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1260 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1262 | <code>function imageToJpegDataUrl(image, quality = VISION_MODEL_JPEG_QUALITY) {</code> | 定义函数 `imageToJpegDataUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1263 | <code>    return `data:image/jpeg;base64,${image.toJPEG(quality).toString('base64')}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1264 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1266 | <code>function normalizeVisionTarget(target) {</code> | 定义函数 `normalizeVisionTarget`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1267 | <code>    const normalizedTarget = String(target &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalizedTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1268 | <code>    if (['screen', 'region', 'active-window', 'chat-window', 'pet-window', 'control-window'].includes(normalizedTarget)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1269 | <code>        return normalizedTarget;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1270 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1271 | <code>    if (['active', 'window', 'current-window'].includes(normalizedTarget)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1272 | <code>        return 'active-window';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1273 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1274 | <code>    return 'chat-window';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1275 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1277 | <code>function normalizeChatFilePath(value = '') {</code> | 定义函数 `normalizeChatFilePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1278 | <code>    const filePath = String(value &#124;&#124; '').trim();</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1279 | <code>    if (!filePath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1280 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1281 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1282 | <code>    return path.resolve(filePath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1283 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1285 | <code>function formatChatFileBytes(bytes) {</code> | 定义函数 `formatChatFileBytes`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1286 | <code>    const numericValue = Number(bytes);</code> | 声明局部标识符 `numericValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1287 | <code>    if (!Number.isFinite(numericValue) &#124;&#124; numericValue &lt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1288 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1289 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1290 | <code>    const units = ['B', 'KB', 'MB', 'GB', 'TB'];</code> | 声明局部标识符 `units`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1291 | <code>    let value = numericValue;</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1292 | <code>    let unitIndex = 0;</code> | 声明局部标识符 `unitIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1293 | <code>    while (value &gt;= 1024 &amp;&amp; unitIndex &lt; units.length - 1) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 1294 | <code>        value /= 1024;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1295 | <code>        unitIndex += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1296 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1297 | <code>    return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1298 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1300 | <code>function inferChatFileMimeType(filePath) {</code> | 定义函数 `inferChatFileMimeType`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1301 | <code>    const extension = path.extname(filePath).toLowerCase();</code> | 声明局部标识符 `extension`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1302 | <code>    const mimeTypes = {</code> | 声明局部标识符 `mimeTypes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1303 | <code>        '.txt': 'text/plain',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1304 | <code>        '.md': 'text/markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1305 | <code>        '.markdown': 'text/markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1306 | <code>        '.json': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1307 | <code>        '.jsonl': 'application/x-ndjson',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1308 | <code>        '.csv': 'text/csv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1309 | <code>        '.tsv': 'text/tab-separated-values',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1310 | <code>        '.yaml': 'application/yaml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1311 | <code>        '.yml': 'application/yaml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1312 | <code>        '.toml': 'application/toml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1313 | <code>        '.xml': 'application/xml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1314 | <code>        '.html': 'text/html',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1315 | <code>        '.htm': 'text/html',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1316 | <code>        '.js': 'text/javascript',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1317 | <code>        '.mjs': 'text/javascript',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1318 | <code>        '.cjs': 'text/javascript',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1319 | <code>        '.ts': 'text/typescript',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1320 | <code>        '.tsx': 'text/typescript',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1321 | <code>        '.jsx': 'text/javascript',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1322 | <code>        '.py': 'text/x-python',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1323 | <code>        '.java': 'text/x-java-source',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1324 | <code>        '.c': 'text/x-c',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1325 | <code>        '.cpp': 'text/x-c++',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1326 | <code>        '.h': 'text/x-c',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1327 | <code>        '.hpp': 'text/x-c++',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1328 | <code>        '.cs': 'text/x-csharp',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1329 | <code>        '.go': 'text/x-go',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1330 | <code>        '.rs': 'text/x-rust',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1331 | <code>        '.php': 'text/x-php',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1332 | <code>        '.rb': 'text/x-ruby',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1333 | <code>        '.sh': 'text/x-shellscript',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1334 | <code>        '.ps1': 'text/x-powershell',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1335 | <code>        '.bat': 'application/x-bat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1336 | <code>        '.css': 'text/css',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1337 | <code>        '.scss': 'text/x-scss',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1338 | <code>        '.less': 'text/x-less',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1339 | <code>        '.pdf': 'application/pdf',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1340 | <code>        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1341 | <code>        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1342 | <code>        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1343 | <code>        '.png': 'image/png',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1344 | <code>        '.jpg': 'image/jpeg',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1345 | <code>        '.jpeg': 'image/jpeg',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1346 | <code>        '.webp': 'image/webp',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1347 | <code>        '.gif': 'image/gif',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1348 | <code>        '.svg': 'image/svg+xml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1349 | <code>        '.mp3': 'audio/mpeg',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1350 | <code>        '.wav': 'audio/wav',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1351 | <code>        '.mp4': 'video/mp4',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1352 | <code>        '.zip': 'application/zip'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1353 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1354 | <code>    return mimeTypes[extension] &#124;&#124; '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1355 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1357 | <code>async function describeChatFilePath(rawPath) {</code> | 定义函数 `describeChatFilePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1358 | <code>    const filePath = normalizeChatFilePath(rawPath);</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1359 | <code>    if (!filePath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1360 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1361 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1362 | <code>            path: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1363 | <code>            error: 'empty_path'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1364 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1365 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1366 | <code>    let stat;</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1367 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1368 | <code>        stat = await fsp.lstat(filePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1369 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1370 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1371 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1372 | <code>            path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1373 | <code>            error: error?.code === 'ENOENT' ? 'not_found' : (error?.message &#124;&#124; String(error))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1374 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1375 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1377 | <code>    const kind = stat.isDirectory()</code> | 声明局部标识符 `kind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1378 | <code>        ? 'directory'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1379 | <code>        : stat.isFile()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1380 | <code>            ? 'file'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1381 | <code>            : stat.isSymbolicLink()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1382 | <code>                ? 'symlink'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1383 | <code>                : 'other';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1384 | <code>    if (!['file', 'directory'].includes(kind)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1385 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1386 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1387 | <code>            path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1388 | <code>            error: `unsupported_${kind}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1389 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1390 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1391 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1392 | <code>    const name = path.basename(filePath) &#124;&#124; filePath;</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1393 | <code>    const extension = stat.isFile() ? path.extname(filePath).toLowerCase() : '';</code> | 声明局部标识符 `extension`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1394 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1395 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1396 | <code>        type: 'file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1397 | <code>        id: `file-${Buffer.from(filePath).toString('base64url').slice(0, 72)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1398 | <code>        source: 'local-file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1399 | <code>        label: name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1400 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1401 | <code>        path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1402 | <code>        kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1403 | <code>        extension,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1404 | <code>        mimeType: stat.isFile() ? inferChatFileMimeType(filePath) : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1405 | <code>        size: stat.isFile() ? stat.size : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1406 | <code>        sizeText: stat.isFile() ? formatChatFileBytes(stat.size) : '文件夹',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1407 | <code>        createdAt: stat.birthtime ? stat.birthtime.toISOString() : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1408 | <code>        modifiedAt: stat.mtime ? stat.mtime.toISOString() : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1409 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1410 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1412 | <code>async function describeChatFilePaths(rawPaths = []) {</code> | 定义函数 `describeChatFilePaths`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1413 | <code>    const paths = Array.isArray(rawPaths) ? rawPaths : [];</code> | 声明局部标识符 `paths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1414 | <code>    const uniquePaths = [];</code> | 声明局部标识符 `uniquePaths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1415 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1416 | <code>    for (const rawPath of paths) {</code> | 声明局部标识符 `rawPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1417 | <code>        const filePath = normalizeChatFilePath(rawPath);</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1418 | <code>        const key = process.platform === 'win32' ? filePath.toLowerCase() : filePath;</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1419 | <code>        if (filePath &amp;&amp; !seen.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1420 | <code>            uniquePaths.push(filePath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1421 | <code>            seen.add(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1422 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1423 | <code>        if (uniquePaths.length &gt;= CHAT_FILE_ATTACHMENT_LIMIT) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1424 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1425 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1426 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1427 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1428 | <code>    const described = await Promise.all(uniquePaths.map(describeChatFilePath));</code> | 声明局部标识符 `described`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1429 | <code>    const files = described.filter((entry) =&gt; entry.ok);</code> | 声明局部标识符 `files`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1430 | <code>    const skipped = described</code> | 声明局部标识符 `skipped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1431 | <code>        .filter((entry) =&gt; !entry.ok)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1432 | <code>        .map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1433 | <code>            path: entry.path &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1434 | <code>            error: entry.error &#124;&#124; 'unknown'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1435 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1436 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1437 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1438 | <code>        files,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1439 | <code>        skipped,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1440 | <code>        limit: CHAT_FILE_ATTACHMENT_LIMIT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1441 | <code>        truncated: paths.length &gt; uniquePaths.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1442 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1443 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1445 | <code>async function cleanupVisionCache(cacheRoot) {</code> | 定义函数 `cleanupVisionCache`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1446 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1447 | <code>        const entries = await fsp.readdir(cacheRoot, { withFileTypes: true });</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1448 | <code>        const files = await Promise.all(</code> | 声明局部标识符 `files`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1449 | <code>            entries</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1450 | <code>                .filter((entry) =&gt; entry.isFile() &amp;&amp; /\.png$/i.test(entry.name))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1451 | <code>                .map(async (entry) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1452 | <code>                    const filePath = path.join(cacheRoot, entry.name);</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1453 | <code>                    const stat = await fsp.stat(filePath);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1454 | <code>                    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1455 | <code>                        filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1456 | <code>                        mtimeMs: stat.mtimeMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1457 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1458 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1459 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1460 | <code>        files</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1461 | <code>            .sort((a, b) =&gt; b.mtimeMs - a.mtimeMs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1462 | <code>            .slice(VISION_CACHE_MAX_FILES)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1463 | <code>            .forEach((file) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1464 | <code>                void fsp.unlink(file.filePath).catch(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1465 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1466 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1467 | <code>        // Cache cleanup is best effort.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1468 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1469 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1470 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1471 | <code>async function persistVisionSnapshot(image, target) {</code> | 定义函数 `persistVisionSnapshot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1472 | <code>    const cacheRoot = getVisionCacheRoot();</code> | 声明局部标识符 `cacheRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1473 | <code>    await fsp.mkdir(cacheRoot, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1474 | <code>    const id = `vision-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1475 | <code>    const filePath = path.join(cacheRoot, `${id}.png`);</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1476 | <code>    const thumbnailPath = path.join(cacheRoot, `${id}.thumb.png`);</code> | 声明局部标识符 `thumbnailPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1477 | <code>    const png = image.toPNG();</code> | 声明局部标识符 `png`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1478 | <code>    await fsp.writeFile(filePath, png);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1479 | <code>    void cleanupVisionCache(cacheRoot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1480 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1481 | <code>    const size = image.getSize();</code> | 声明局部标识符 `size`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1482 | <code>    const modelImage = resizeVisionImageForModel(image);</code> | 声明局部标识符 `modelImage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1483 | <code>    const modelSize = modelImage.getSize();</code> | 声明局部标识符 `modelSize`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1484 | <code>    const thumbnailWidth = Math.min(420, Math.max(1, size.width &#124;&#124; 420));</code> | 声明局部标识符 `thumbnailWidth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1485 | <code>    const thumbnail = image.resize({</code> | 声明局部标识符 `thumbnail`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1486 | <code>        width: thumbnailWidth,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1487 | <code>        quality: 'good'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1488 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1489 | <code>    await fsp.writeFile(thumbnailPath, thumbnail.toPNG());</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1490 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1491 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1492 | <code>        type: 'vision',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1493 | <code>        id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1494 | <code>        source: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1495 | <code>        label: getVisionSnapshotLabel(target),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1496 | <code>        imagePath: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1497 | <code>        thumbnailPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1498 | <code>        dataUrl: imageToJpegDataUrl(modelImage),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1499 | <code>        thumbnailDataUrl: thumbnail.toDataURL(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1500 | <code>        mimeType: 'image/jpeg',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1501 | <code>        width: modelSize.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1502 | <code>        height: modelSize.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1503 | <code>        originalWidth: size.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1504 | <code>        originalHeight: size.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1505 | <code>        createdAt: new Date().toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1506 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1507 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1508 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1509 | <code>async function captureWindowSnapshot(target, sourceWindow) {</code> | 定义函数 `captureWindowSnapshot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1510 | <code>    let targetWindow = sourceWindow;</code> | 声明局部标识符 `targetWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1511 | <code>    if (target === 'active-window') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1512 | <code>        targetWindow = BrowserWindow.getFocusedWindow() &#124;&#124; chatWindow &#124;&#124; sourceWindow;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1513 | <code>    } else if (target === 'pet-window') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1514 | <code>        targetWindow = petWindow;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1515 | <code>    } else if (target === 'control-window') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1516 | <code>        targetWindow = controlWindow;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1517 | <code>    } else if (target === 'chat-window') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1518 | <code>        targetWindow = chatWindow &#124;&#124; sourceWindow;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1519 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1521 | <code>    if (!targetWindow &#124;&#124; targetWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1522 | <code>        throw new Error('要截图的窗口还没有打开。');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1523 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1525 | <code>    return await desktopPlatformAdapter.captureWindowSnapshot({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1526 | <code>        targetWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1527 | <code>        emptyMessage: '窗口截图为空。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1528 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1529 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1530 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1531 | <code>async function captureScreenSnapshot(display = desktopPlatformAdapter.getPrimaryDisplay()) {</code> | 定义函数 `captureScreenSnapshot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1532 | <code>    return await desktopPlatformAdapter.captureScreenSnapshot(display);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1533 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1534 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1535 | <code>function destroyVisionRegionWindow(request) {</code> | 定义函数 `destroyVisionRegionWindow`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1536 | <code>    const targetWindow = request?.window;</code> | 声明局部标识符 `targetWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1537 | <code>    if (targetWindow &amp;&amp; !targetWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1538 | <code>        targetWindow.destroy();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1539 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1540 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1541 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1542 | <code>function completeVisionRegionSelection(event, selection) {</code> | 定义函数 `completeVisionRegionSelection`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1543 | <code>    const request = visionRegionSelectionRequest;</code> | 声明局部标识符 `request`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1544 | <code>    const sourceWindow = BrowserWindow.fromWebContents(event.sender);</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1545 | <code>    if (!request &#124;&#124; request.window !== sourceWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1546 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1547 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1548 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1549 | <code>    visionRegionSelectionRequest = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1550 | <code>    request.resolve(selection &#124;&#124; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1551 | <code>    destroyVisionRegionWindow(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1552 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1553 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1554 | <code>function cancelVisionRegionSelection(event) {</code> | 定义函数 `cancelVisionRegionSelection`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1555 | <code>    const request = visionRegionSelectionRequest;</code> | 声明局部标识符 `request`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1556 | <code>    const sourceWindow = event ? BrowserWindow.fromWebContents(event.sender) : request?.window;</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1557 | <code>    if (!request &#124;&#124; (sourceWindow &amp;&amp; request.window !== sourceWindow)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1558 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1559 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1560 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1561 | <code>    visionRegionSelectionRequest = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1562 | <code>    request.reject(new Error('已取消矩形截图。'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1563 | <code>    destroyVisionRegionWindow(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1564 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1565 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1566 | <code>function requestVisionRegionSelection(display) {</code> | 定义函数 `requestVisionRegionSelection`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1567 | <code>    if (visionRegionSelectionRequest) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1568 | <code>        throw new Error('已有一个矩形截图正在进行。');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1569 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1570 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1571 | <code>    const selectionWindow = desktopPlatformAdapter.createRegionSelectionWindow(display, {</code> | 声明局部标识符 `selectionWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1572 | <code>        title: 'AILIS Region Capture'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1573 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1575 | <code>    const request = {};</code> | 声明局部标识符 `request`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1576 | <code>    const selectionPromise = new Promise((resolve, reject) =&gt; {</code> | 声明局部标识符 `selectionPromise`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1577 | <code>        Object.assign(request, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1578 | <code>            window: selectionWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1579 | <code>            resolve,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1580 | <code>            reject</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1581 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1582 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1583 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1584 | <code>    visionRegionSelectionRequest = request;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1585 | <code>    selectionWindow.once('closed', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1586 | <code>        if (visionRegionSelectionRequest !== request) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1587 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1588 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1589 | <code>        visionRegionSelectionRequest = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1590 | <code>        request.reject(new Error('已取消矩形截图。'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1591 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1593 | <code>    void desktopPlatformAdapter.showRegionSelectionWindow(selectionWindow, 'vision-region.html')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1594 | <code>        .catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1595 | <code>            if (visionRegionSelectionRequest === request) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1596 | <code>                visionRegionSelectionRequest = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1597 | <code>                request.reject(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1598 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1599 | <code>            destroyVisionRegionWindow(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1600 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1601 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1602 | <code>    return selectionPromise;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1603 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1604 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1605 | <code>async function captureRegionSnapshot() {</code> | 定义函数 `captureRegionSnapshot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1606 | <code>    return await desktopPlatformAdapter.captureRegionSnapshot({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1607 | <code>        display: desktopPlatformAdapter.getPrimaryDisplay(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1608 | <code>        requestSelection: requestVisionRegionSelection,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1609 | <code>        minSize: VISION_REGION_MIN_SIZE_DIP</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1610 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1611 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1612 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1613 | <code>async function captureVisionSnapshot(event, payload = {}) {</code> | 定义函数 `captureVisionSnapshot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1614 | <code>    const target = normalizeVisionTarget(payload.target &#124;&#124; payload.source);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1615 | <code>    const sourceWindow = BrowserWindow.fromWebContents(event.sender);</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1616 | <code>    const image = target === 'region'</code> | 声明局部标识符 `image`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1617 | <code>        ? await captureRegionSnapshot()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1618 | <code>        : target === 'screen'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1619 | <code>        ? await captureScreenSnapshot()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1620 | <code>        : await captureWindowSnapshot(target, sourceWindow);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1621 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1622 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1623 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1624 | <code>        snapshot: await persistVisionSnapshot(image, target)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1625 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1626 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1627 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1628 | <code>async function captureVisionSnapshotForTool(payload = {}) {</code> | 定义函数 `captureVisionSnapshotForTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1629 | <code>    const target = normalizeVisionTarget(payload.target &#124;&#124; payload.source);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1630 | <code>    const image = target === 'region'</code> | 声明局部标识符 `image`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1631 | <code>        ? await captureRegionSnapshot()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1632 | <code>        : target === 'screen'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1633 | <code>        ? await captureScreenSnapshot()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1634 | <code>        : await captureWindowSnapshot(target, BrowserWindow.getFocusedWindow() &#124;&#124; chatWindow &#124;&#124; petWindow);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1635 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1636 | <code>    return await persistVisionSnapshot(image, target);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1637 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1638 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1639 | <code>function getBundledSpeechModelRoots() {</code> | 定义函数 `getBundledSpeechModelRoots`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1640 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1641 | <code>        path.join(process.resourcesPath, 'speech-models'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1642 | <code>        path.join(app.getAppPath(), 'Resources', 'speech-models'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1643 | <code>        path.join(app.getAppPath(), 'dist', 'Resources', 'speech-models')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1644 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1645 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1646 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1647 | <code>function guessSpeechModelMimeType(filename) {</code> | 定义函数 `guessSpeechModelMimeType`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1648 | <code>    const ext = path.extname(filename).toLowerCase();</code> | 声明局部标识符 `ext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1649 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1650 | <code>    if (ext === '.json') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1651 | <code>        return 'application/json; charset=utf-8';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1652 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1653 | <code>    if (ext === '.txt') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1654 | <code>        return 'text/plain; charset=utf-8';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1655 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1656 | <code>    if (ext === '.wasm') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1657 | <code>        return 'application/wasm';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1658 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1659 | <code>    if (ext === '.js' &#124;&#124; ext === '.mjs') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1660 | <code>        return 'text/javascript; charset=utf-8';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1661 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1662 | <code>    return 'application/octet-stream';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1663 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1664 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1665 | <code>function getSpeechAssetVariants(asset) {</code> | 定义函数 `getSpeechAssetVariants`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1666 | <code>    const orderedSources = [asset.source, ...Object.keys(SPEECH_MODEL_REMOTE_HOSTS)]</code> | 声明局部标识符 `orderedSources`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1667 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1668 | <code>        .filter((source, index, items) =&gt; items.indexOf(source) === index);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1669 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1670 | <code>    return orderedSources.map((source) =&gt; ({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1671 | <code>        ...asset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1672 | <code>        source</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1673 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1674 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1675 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1676 | <code>async function createFileResponse(filePath) {</code> | 定义函数 `createFileResponse`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1677 | <code>    const fileBuffer = await fsp.readFile(filePath);</code> | 声明局部标识符 `fileBuffer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1678 | <code>    return new Response(fileBuffer, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1679 | <code>        headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1680 | <code>            'content-type': guessSpeechModelMimeType(filePath),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1681 | <code>            'content-length': String(fileBuffer.byteLength)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1682 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1683 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1684 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1685 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1686 | <code>function isPathInsideRoot(candidatePath, rootPath) {</code> | 定义函数 `isPathInsideRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1687 | <code>    const relativePath = path.relative(rootPath, candidatePath);</code> | 声明局部标识符 `relativePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1688 | <code>    return relativePath === '' &#124;&#124; (</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1689 | <code>        Boolean(relativePath) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1690 | <code>        !relativePath.startsWith('..') &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1691 | <code>        !path.isAbsolute(relativePath)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1692 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1693 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1694 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1695 | <code>function getLocalResourceRoots() {</code> | 定义函数 `getLocalResourceRoots`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1696 | <code>    const appRoot = path.resolve(__dirname, '..');</code> | 声明局部标识符 `appRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1697 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1698 | <code>        path.join(appRoot, 'Resources'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1699 | <code>        path.join(appRoot, 'dist', 'Resources'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1700 | <code>        process.resourcesPath ? path.join(process.resourcesPath, 'Resources') : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1701 | <code>    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1702 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1703 | <code>        .map((rootPath) =&gt; path.resolve(rootPath))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1704 | <code>        .filter((rootPath, index, roots) =&gt; roots.indexOf(rootPath) === index);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1705 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1706 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1707 | <code>function parseLocalResourcePathFromUrl(requestUrl) {</code> | 定义函数 `parseLocalResourcePathFromUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1708 | <code>    const targetUrl = new URL(requestUrl);</code> | 声明局部标识符 `targetUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1709 | <code>    const rawPath = decodeURIComponent([</code> | 声明局部标识符 `rawPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1710 | <code>        targetUrl.hostname &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1711 | <code>        targetUrl.pathname &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1712 | <code>    ].join('/'))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1713 | <code>        .replace(/\\/g, '/')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1714 | <code>        .replace(/\/+/g, '/')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1715 | <code>        .replace(/^\/+/, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1716 | <code>        .trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1717 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1718 | <code>    if (!rawPath &#124;&#124; rawPath.includes('\0')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1719 | <code>        throw new Error('缺少本地资源路径');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1720 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1722 | <code>    const relativePath = rawPath</code> | 声明局部标识符 `relativePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1723 | <code>        .replace(/^resources\//i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1724 | <code>        .replace(/^\/+/, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1725 | <code>    const roots = getLocalResourceRoots();</code> | 声明局部标识符 `roots`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1726 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1727 | <code>    for (const rootPath of roots) {</code> | 声明局部标识符 `rootPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1728 | <code>        const candidatePath = path.resolve(rootPath, relativePath);</code> | 声明局部标识符 `candidatePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1729 | <code>        if (!isPathInsideRoot(candidatePath, rootPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1730 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1731 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1732 | <code>        if (fs.existsSync(candidatePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1733 | <code>            return candidatePath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1734 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1735 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1736 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1737 | <code>    throw new Error(`本地资源不存在：${rawPath}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1738 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1739 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1740 | <code>async function handleLocalResourceProtocol(request) {</code> | 定义函数 `handleLocalResourceProtocol`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1741 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1742 | <code>        return createFileResponse(parseLocalResourcePathFromUrl(request.url));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1743 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1744 | <code>        return new Response(String(error.message &#124;&#124; error), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1745 | <code>            status: 404,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1746 | <code>            headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1747 | <code>                'content-type': 'text/plain; charset=utf-8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1748 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1749 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1750 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1751 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1752 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1753 | <code>async function handleAssetPackProtocol(request) {</code> | 定义函数 `handleAssetPackProtocol`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1754 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1755 | <code>        return createFileResponse(getAssetPackRuntime().resolveAssetPathFromUrl(request.url));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1756 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1757 | <code>        return new Response(String(error.message &#124;&#124; error), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1758 | <code>            status: 404,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1759 | <code>            headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1760 | <code>                'content-type': 'text/plain; charset=utf-8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1761 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1762 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1763 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1764 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1765 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1766 | <code>async function findBundledSpeechModelFile(asset) {</code> | 定义函数 `findBundledSpeechModelFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1767 | <code>    for (const rootDir of getBundledSpeechModelRoots()) {</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1768 | <code>        for (const variant of getSpeechAssetVariants(asset)) {</code> | 声明局部标识符 `variant`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1769 | <code>            const candidatePath = resolveSpeechModelFilePath(rootDir, variant);</code> | 声明局部标识符 `candidatePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1770 | <code>            if (fs.existsSync(candidatePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1771 | <code>                return candidatePath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1772 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1773 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1774 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1775 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1776 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1777 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1778 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1779 | <code>function buildSpeechModelRemoteUrl({ source, model, revision, filename }) {</code> | 定义函数 `buildSpeechModelRemoteUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1780 | <code>    const host = SPEECH_MODEL_REMOTE_HOSTS[source];</code> | 声明局部标识符 `host`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1781 | <code>    if (!host) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1782 | <code>        throw new Error(`不支持的语音模型源：${source}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1783 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1784 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1785 | <code>    return new URL(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1786 | <code>        `${model}/resolve/${encodeURIComponent(revision)}/${filename}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1787 | <code>        host</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1788 | <code>    ).toString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1789 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1790 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1791 | <code>async function downloadSpeechModelAsset(asset) {</code> | 定义函数 `downloadSpeechModelAsset`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1792 | <code>    const cachePath = resolveSpeechModelFilePath(getSpeechModelCacheRoot(), asset);</code> | 声明局部标识符 `cachePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1793 | <code>    const existingTask = speechModelDownloadTasks.get(cachePath);</code> | 声明局部标识符 `existingTask`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1794 | <code>    if (existingTask) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1795 | <code>        return existingTask;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1796 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1797 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1798 | <code>    const task = (async () =&gt; {</code> | 声明局部标识符 `task`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1799 | <code>        if (fs.existsSync(cachePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1800 | <code>            return createFileResponse(cachePath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1801 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1802 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1803 | <code>        const remoteUrl = buildSpeechModelRemoteUrl(asset);</code> | 声明局部标识符 `remoteUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1804 | <code>        const response = await fetch(remoteUrl);</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1805 | <code>        if (!response.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1806 | <code>            return response;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1807 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1808 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1809 | <code>        const responseBuffer = Buffer.from(await response.arrayBuffer());</code> | 声明局部标识符 `responseBuffer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1810 | <code>        await fsp.mkdir(path.dirname(cachePath), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1811 | <code>        await fsp.writeFile(cachePath, responseBuffer);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1812 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1813 | <code>        return new Response(responseBuffer, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1814 | <code>            headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1815 | <code>                'content-type': response.headers.get('content-type') &#124;&#124; guessSpeechModelMimeType(cachePath),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1816 | <code>                'content-length': String(responseBuffer.byteLength)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1817 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1818 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1819 | <code>    })();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1820 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1821 | <code>    speechModelDownloadTasks.set(cachePath, task);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1822 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1823 | <code>        return await task;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1824 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1825 | <code>        speechModelDownloadTasks.delete(cachePath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1826 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1827 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1828 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1829 | <code>async function downloadSpeechModelAssetWithFallback(asset) {</code> | 定义函数 `downloadSpeechModelAssetWithFallback`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1830 | <code>    const variants = getSpeechAssetVariants(asset);</code> | 声明局部标识符 `variants`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1831 | <code>    let lastResponse = null;</code> | 声明局部标识符 `lastResponse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1832 | <code>    let lastError = null;</code> | 声明局部标识符 `lastError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1833 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1834 | <code>    for (const variant of variants) {</code> | 声明局部标识符 `variant`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1835 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1836 | <code>            const response = await downloadSpeechModelAsset(variant);</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1837 | <code>            if (response.ok &#124;&#124; variant.source === variants[variants.length - 1]?.source) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1838 | <code>                return response;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1839 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1840 | <code>            lastResponse = response;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1841 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1842 | <code>            lastError = error;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1843 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1844 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1845 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1846 | <code>    if (lastResponse) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1847 | <code>        return lastResponse;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1848 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1849 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1850 | <code>    throw lastError &#124;&#124; new Error('语音模型资源下载失败');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1851 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1852 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1853 | <code>function parseSpeechModelAssetFromUrl(targetUrl) {</code> | 定义函数 `parseSpeechModelAssetFromUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1854 | <code>    const queryAsset = {</code> | 声明局部标识符 `queryAsset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1855 | <code>        source: targetUrl.searchParams.get('source') &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1856 | <code>        model: targetUrl.searchParams.get('model') &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1857 | <code>        revision: targetUrl.searchParams.get('revision') &#124;&#124; 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1858 | <code>        filename: targetUrl.searchParams.get('filename') &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1859 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1860 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1861 | <code>    if (queryAsset.model &amp;&amp; queryAsset.filename) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1862 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1863 | <code>            ...queryAsset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1864 | <code>            source: queryAsset.source &#124;&#124; 'modelscope'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1865 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1866 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1867 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1868 | <code>    const source = targetUrl.hostname &#124;&#124; queryAsset.source &#124;&#124; 'modelscope';</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1869 | <code>    const pathSegments = decodeURIComponent(targetUrl.pathname &#124;&#124; '')</code> | 声明局部标识符 `pathSegments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1870 | <code>        .split('/')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1871 | <code>        .map((segment) =&gt; segment.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1872 | <code>        .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1873 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1874 | <code>    if (pathSegments.length &lt; 3) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1875 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1876 | <code>            ...queryAsset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1877 | <code>            source</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1878 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1879 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1880 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1881 | <code>    const modelSegments = pathSegments.slice(0, 2);</code> | 声明局部标识符 `modelSegments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1882 | <code>    let revision = 'main';</code> | 声明局部标识符 `revision`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1883 | <code>    let filenameSegments = pathSegments.slice(2);</code> | 声明局部标识符 `filenameSegments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1884 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1885 | <code>    if (pathSegments.length &gt;= 4 &amp;&amp; pathSegments[2] === 'main') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1886 | <code>        revision = pathSegments[2];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1887 | <code>        filenameSegments = pathSegments.slice(3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1888 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1889 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1890 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1891 | <code>        source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1892 | <code>        model: modelSegments.join('/'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1893 | <code>        revision,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1894 | <code>        filename: filenameSegments.join('/')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1895 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1896 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1897 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1898 | <code>async function handleSpeechModelProtocol(request) {</code> | 定义函数 `handleSpeechModelProtocol`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1899 | <code>    const targetUrl = new URL(request.url);</code> | 声明局部标识符 `targetUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1900 | <code>    const asset = parseSpeechModelAssetFromUrl(targetUrl);</code> | 声明局部标识符 `asset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1901 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1902 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1903 | <code>        for (const variant of getSpeechAssetVariants(asset)) {</code> | 声明局部标识符 `variant`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1904 | <code>            const cachePath = resolveSpeechModelFilePath(getSpeechModelCacheRoot(), variant);</code> | 声明局部标识符 `cachePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1905 | <code>            if (fs.existsSync(cachePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1906 | <code>                return createFileResponse(cachePath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1907 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1908 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1909 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1910 | <code>        const bundledPath = await findBundledSpeechModelFile(asset);</code> | 声明局部标识符 `bundledPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1911 | <code>        if (bundledPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1912 | <code>            return createFileResponse(bundledPath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1913 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1914 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1915 | <code>        return downloadSpeechModelAssetWithFallback(asset);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1916 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1917 | <code>        return new Response(String(error.message &#124;&#124; error), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1918 | <code>            status: 500,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1919 | <code>            headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1920 | <code>                'content-type': 'text/plain; charset=utf-8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1921 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1922 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1923 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1924 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1925 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1926 | <code>function makeTrayIcon() {</code> | 定义函数 `makeTrayIcon`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1927 | <code>    const trayIconPath = getTrayIconPath();</code> | 声明局部标识符 `trayIconPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1928 | <code>    if (trayIconPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1929 | <code>        const image = nativeImage.createFromPath(trayIconPath);</code> | 声明局部标识符 `image`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1930 | <code>        if (!image.isEmpty()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1931 | <code>            return image.resize({ width: 16, height: 16 });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1932 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1933 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1934 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1935 | <code>    const svg = `</code> | 声明局部标识符 `svg`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1936 | <code>        &lt;svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"&gt;</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1937 | <code>            &lt;defs&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1938 | <code>                &lt;linearGradient id="ailis-bg" x1="0" x2="1" y1="0" y2="1"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1939 | <code>                    &lt;stop offset="0%" stop-color="#e8f6ff"/&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1940 | <code>                    &lt;stop offset="100%" stop-color="#ffefe5"/&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1941 | <code>                &lt;/linearGradient&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1942 | <code>            &lt;/defs&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1943 | <code>            &lt;rect width="64" height="64" rx="16" fill="url(#ailis-bg)"/&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1944 | <code>            &lt;circle cx="22" cy="48" r="18" fill="#73b8e5" opacity="0.55"/&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1945 | <code>            &lt;text x="50%" y="59%" text-anchor="middle" font-size="28" font-family="Segoe UI, Arial" font-weight="700" fill="#49606d"&gt;A&lt;/text&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1946 | <code>        &lt;/svg&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1947 | <code>    `;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1948 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1949 | <code>    return nativeImage</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1950 | <code>        .createFromDataURL(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1951 | <code>        .resize({ width: 16, height: 16 });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1952 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1953 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1954 | <code>function clampBoundsToDisplay(bounds, minimumWidth = 320, minimumHeight = 320) {</code> | 定义函数 `clampBoundsToDisplay`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1955 | <code>    return desktopPlatformAdapter.clampBoundsToDisplay(bounds, minimumWidth, minimumHeight);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1956 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1957 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1958 | <code>function normalizePetDialogueExtraTop(value) {</code> | 定义函数 `normalizePetDialogueExtraTop`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1959 | <code>    const numericValue = Number(value);</code> | 声明局部标识符 `numericValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1960 | <code>    if (!Number.isFinite(numericValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1961 | <code>        return normalizeAvatarDialogueBubbleExtraTop(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1962 | <code>            desktopState?.preferences?.avatarDialogueBubbleExtraTop ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1963 | <code>                PET_DIALOGUE_DEFAULT_EXTRA_TOP</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1964 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1965 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1966 | <code>    return Math.round(Math.min(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1967 | <code>        Math.max(normalizeAvatarDialogueBubbleExtraTop(numericValue), 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1968 | <code>        PET_DIALOGUE_MAX_EXTRA_TOP</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1969 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1970 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1971 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1972 | <code>function normalizePetDialogueExtraWidth(value) {</code> | 定义函数 `normalizePetDialogueExtraWidth`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1973 | <code>    const numericValue = Number(value);</code> | 声明局部标识符 `numericValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1974 | <code>    if (!Number.isFinite(numericValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1975 | <code>        return normalizeAvatarDialogueBubbleExtraWidth(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1976 | <code>            desktopState?.preferences?.avatarDialogueBubbleExtraWidth ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1977 | <code>                PET_DIALOGUE_DEFAULT_EXTRA_WIDTH</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1978 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1979 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1980 | <code>    return Math.round(Math.min(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1981 | <code>        Math.max(normalizeAvatarDialogueBubbleExtraWidth(numericValue), 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1982 | <code>        PET_DIALOGUE_MAX_EXTRA_WIDTH</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1983 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1984 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1985 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1986 | <code>function getPetDialogueExpandedLayout(</code> | 定义函数 `getPetDialogueExpandedLayout`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1987 | <code>    baseBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1988 | <code>    requestedExtraTop = PET_DIALOGUE_DEFAULT_EXTRA_TOP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1989 | <code>    requestedExtraWidth = PET_DIALOGUE_DEFAULT_EXTRA_WIDTH</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1990 | <code>) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1991 | <code>    return desktopPlatformAdapter.getExpandedWindowLayout({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1992 | <code>        baseBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1993 | <code>        requestedExtraTop,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1994 | <code>        requestedExtraWidth,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1995 | <code>        minimumWidth: PET_MIN_SIZE.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1996 | <code>        minimumHeight: PET_MIN_SIZE.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1997 | <code>        normalizeExtraTop: normalizePetDialogueExtraTop,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1998 | <code>        normalizeExtraWidth: normalizePetDialogueExtraWidth</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 1999 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2000 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2001 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2002 | <code>function setPetWindowBoundsTransient(bounds) {</code> | 定义函数 `setPetWindowBoundsTransient`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2003 | <code>    if (!petWindow &#124;&#124; petWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2004 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2005 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2006 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2007 | <code>    petDialogueBoundsMutation = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2008 | <code>    clearTimeout(petDialogueBoundsMutationTimer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2009 | <code>    petWindow.setBounds(bounds);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2010 | <code>    petDialogueBoundsMutationTimer = setTimeout(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2011 | <code>        petDialogueBoundsMutation = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2012 | <code>        petDialogueBoundsMutationTimer = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 2013 | <code>    }, 220);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2014 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2015 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2016 | <code>function getCurrentPetScale() {</code> | 定义函数 `getCurrentPetScale`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2017 | <code>    return normalizePetScale(desktopState?.preferences?.petScale &#124;&#124; DEFAULT_PET_SCALE);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2018 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2019 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2020 | <code>function canonicalizePetBounds(bounds) {</code> | 定义函数 `canonicalizePetBounds`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2021 | <code>    return clampBoundsToDisplay(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2022 | <code>        resizePetBounds(bounds, getCurrentPetScale()),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2023 | <code>        PET_MIN_SIZE.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2024 | <code>        PET_MIN_SIZE.height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2025 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2026 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2027 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2028 | <code>function setPetMousePassthrough(enabled, options = {}) {</code> | 定义函数 `setPetMousePassthrough`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2029 | <code>    if (!petWindow &#124;&#124; petWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2030 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2031 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2032 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2033 | <code>    const nextEnabled = Boolean(enabled);</code> | 声明局部标识符 `nextEnabled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2034 | <code>    if (petMousePassthroughEnabled === nextEnabled &amp;&amp; !options.force) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2035 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2036 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2037 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2038 | <code>    petMousePassthroughEnabled = nextEnabled;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2039 | <code>    return desktopPlatformAdapter.setMousePassthrough(petWindow, nextEnabled, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2040 | <code>        forward: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2041 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2042 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2043 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2044 | <code>function stopPetCursorTracking() {</code> | 定义函数 `stopPetCursorTracking`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2045 | <code>    if (petCursorTrackingTimer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2046 | <code>        clearInterval(petCursorTrackingTimer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2047 | <code>        petCursorTrackingTimer = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2048 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2049 | <code>    petCursorTrackingLastSignature = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2050 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2051 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2052 | <code>function startPetCursorTracking() {</code> | 定义函数 `startPetCursorTracking`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2053 | <code>    stopPetCursorTracking();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2054 | <code>    petCursorTrackingTimer = setInterval(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2055 | <code>        if (!petWindow &#124;&#124; petWindow.isDestroyed() &#124;&#124; !petWindow.isVisible()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2056 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2057 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2058 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2059 | <code>        const bounds = petWindow.getBounds();</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2060 | <code>        const cursor = screen.getCursorScreenPoint();</code> | 声明局部标识符 `cursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2061 | <code>        const inside =</code> | 声明局部标识符 `inside`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2062 | <code>            cursor.x &gt;= bounds.x &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2063 | <code>            cursor.x &lt;= bounds.x + bounds.width &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2064 | <code>            cursor.y &gt;= bounds.y &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2065 | <code>            cursor.y &lt;= bounds.y + bounds.height;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2066 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2067 | <code>        const clientX = inside ? Math.round(cursor.x - bounds.x) : null;</code> | 声明局部标识符 `clientX`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2068 | <code>        const clientY = inside ? Math.round(cursor.y - bounds.y) : null;</code> | 声明局部标识符 `clientY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2069 | <code>        const signature = inside ? `1:${clientX}:${clientY}` : '0';</code> | 声明局部标识符 `signature`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2070 | <code>        if (signature === petCursorTrackingLastSignature) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2071 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2072 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2073 | <code>        petCursorTrackingLastSignature = signature;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2074 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2075 | <code>        petWindow.webContents.send('ailis:pet-cursor-point', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2076 | <code>            inside,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2077 | <code>            clientX,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2078 | <code>            clientY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2079 | <code>            screenX: cursor.x,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2080 | <code>            screenY: cursor.y</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2081 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2082 | <code>    }, PET_CURSOR_TRACK_INTERVAL_MS);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2083 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2084 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2085 | <code>function setPetDialogueWindowExpanded(</code> | 定义函数 `setPetDialogueWindowExpanded`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2086 | <code>    expanded,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2087 | <code>    requestedExtraTop = PET_DIALOGUE_DEFAULT_EXTRA_TOP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2088 | <code>    requestedExtraWidth = PET_DIALOGUE_DEFAULT_EXTRA_WIDTH</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2089 | <code>) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2090 | <code>    if (!petWindow &#124;&#124; petWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2091 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2092 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2093 | <code>            expanded: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2094 | <code>            extraTop: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2095 | <code>            reason: 'pet_window_unavailable'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2096 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2097 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2098 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2099 | <code>    if (expanded) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2100 | <code>        const referenceBounds = canonicalizePetBounds(</code> | 声明局部标识符 `referenceBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2101 | <code>            petDialogueCollapsedBounds &#124;&#124; petWindow.getBounds()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2102 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2103 | <code>        const layout = getPetDialogueExpandedLayout(</code> | 声明局部标识符 `layout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2104 | <code>            referenceBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2105 | <code>            requestedExtraTop,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2106 | <code>            requestedExtraWidth</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2107 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2109 | <code>        petDialogueCollapsedBounds = layout.baseBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2110 | <code>        petDialogueExpanded = layout.extraTop &gt; 0 &#124;&#124; layout.extraWidth &gt; 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2111 | <code>        petDialogueExtraTop = layout.extraTop;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2112 | <code>        petDialogueExtraWidth = layout.extraWidth;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2113 | <code>        desktopState.petWindow.bounds = layout.baseBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2114 | <code>        desktopState.petWindow.visible = petWindow.isVisible();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2115 | <code>        setPetWindowBoundsTransient(layout.expandedBounds);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2117 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2118 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2119 | <code>            expanded: petDialogueExpanded,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2120 | <code>            extraTop: layout.extraTop,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2121 | <code>            extraWidth: layout.extraWidth,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2122 | <code>            reservedLeft: layout.reservedLeft,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2123 | <code>            reservedRight: layout.reservedRight,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2124 | <code>            bounds: layout.expandedBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2125 | <code>            baseBounds: layout.baseBounds</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2126 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2127 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2129 | <code>    const restoreBounds = canonicalizePetBounds(</code> | 声明局部标识符 `restoreBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2130 | <code>        petDialogueCollapsedBounds &#124;&#124; petWindow.getBounds()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2131 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2133 | <code>    petDialogueCollapsedBounds = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2134 | <code>    petDialogueExpanded = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2135 | <code>    petDialogueExtraTop = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2136 | <code>    petDialogueExtraWidth = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2137 | <code>    desktopState.petWindow.bounds = restoreBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2138 | <code>    desktopState.petWindow.visible = petWindow.isVisible();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2139 | <code>    setPetWindowBoundsTransient(restoreBounds);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2140 | <code>    persistDesktopState();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2142 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2143 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2144 | <code>        expanded: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2145 | <code>        extraTop: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2146 | <code>        extraWidth: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2147 | <code>        reservedLeft: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2148 | <code>        reservedRight: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2149 | <code>        bounds: restoreBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2150 | <code>        baseBounds: restoreBounds</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2151 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2152 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2154 | <code>function persistDesktopState(options = {}) {</code> | 定义函数 `persistDesktopState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2155 | <code>    desktopState = saveDesktopState(app, desktopState, options);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2156 | <code>    refreshTrayMenu();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2157 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2159 | <code>function resolveDesktopBackendBaseUrl() {</code> | 定义函数 `resolveDesktopBackendBaseUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2160 | <code>    const envBackendBaseUrl = String(process.env.AILIS_BACKEND_BASE_URL &#124;&#124; '').trim();</code> | 声明局部标识符 `envBackendBaseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2161 | <code>    if (envBackendBaseUrl) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2162 | <code>        return normalizeBackendBaseUrl(envBackendBaseUrl);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2163 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2165 | <code>    return DEFAULT_BACKEND_BASE_URL;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2166 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2168 | <code>function resolveDesktopBackendMode() {</code> | 定义函数 `resolveDesktopBackendMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2169 | <code>    return normalizeBackendMode(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2170 | <code>        desktopState?.preferences?.backendMode &#124;&#124; DEFAULT_BACKEND_MODE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2171 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2172 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2173 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2174 | <code>function resolveAgentRuntimeGatewayUrl() {</code> | 定义函数 `resolveAgentRuntimeGatewayUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2175 | <code>    const envGatewayUrl = String(</code> | 声明局部标识符 `envGatewayUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2176 | <code>        process.env.AILIS_OPENCLAW_GATEWAY_URL &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2177 | <code>        process.env.OPENCLAW_GATEWAY_URL &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2178 | <code>        ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2179 | <code>    ).trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2180 | <code>    if (envGatewayUrl) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2181 | <code>        return normalizeAgentRuntimeGatewayUrl(envGatewayUrl);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2182 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2184 | <code>    return normalizeAgentRuntimeGatewayUrl(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2185 | <code>        desktopState?.preferences?.agentRuntimeGatewayUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2186 | <code>        desktopState?.preferences?.openclawGatewayUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2187 | <code>        DEFAULT_AGENT_RUNTIME_GATEWAY_URL</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2188 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2189 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2191 | <code>function maskLlmApiKey(value = '') {</code> | 定义函数 `maskLlmApiKey`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2192 | <code>    const key = normalizeLlmApiKey(value);</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2193 | <code>    if (!key) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2194 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2195 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2196 | <code>    if (key.length &lt;= 8) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2197 | <code>        return `****${key.slice(-2)}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2198 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2199 | <code>    return `${key.slice(0, 4)}...${key.slice(-4)}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2200 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2202 | <code>function getPersistedLlmApiKeyProfiles(preferences = desktopState?.preferences &#124;&#124; {}) {</code> | 定义函数 `getPersistedLlmApiKeyProfiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2203 | <code>    return normalizeLlmApiKeyProfiles(preferences.llmApiKeyProfiles, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2204 | <code>        provider: preferences.llmProvider &#124;&#124; DEFAULT_LLM_PROVIDER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2205 | <code>        apiKey: preferences.llmApiKey &#124;&#124; '',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2206 | <code>        label: '默认 Key'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2207 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2208 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2209 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2210 | <code>function getLlmApiKeyProfileForProvider(provider = DEFAULT_LLM_PROVIDER, preferences = desktopState?.preferences &#124;&#124; {}) {</code> | 定义函数 `getLlmApiKeyProfileForProvider`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2211 | <code>    const normalizedProvider = normalizeLlmProvider(provider);</code> | 声明局部标识符 `normalizedProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2212 | <code>    const profiles = getPersistedLlmApiKeyProfiles(preferences);</code> | 声明局部标识符 `profiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2213 | <code>    return profiles[normalizedProvider] &#124;&#124; { activeKeyId: '', keys: [] };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2214 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2216 | <code>function getActiveLlmApiKeyEntry(provider = DEFAULT_LLM_PROVIDER, preferences = desktopState?.preferences &#124;&#124; {}) {</code> | 定义函数 `getActiveLlmApiKeyEntry`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2217 | <code>    const profile = getLlmApiKeyProfileForProvider(provider, preferences);</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2218 | <code>    return profile.keys.find((entry) =&gt; entry.id === profile.activeKeyId) &#124;&#124; profile.keys[0] &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2219 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2221 | <code>function getPersistedLlmApiKeyForProvider(provider = DEFAULT_LLM_PROVIDER, preferences = desktopState?.preferences &#124;&#124; {}) {</code> | 定义函数 `getPersistedLlmApiKeyForProvider`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2222 | <code>    return normalizeLlmApiKey(getActiveLlmApiKeyEntry(provider, preferences)?.value &#124;&#124; '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2223 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2225 | <code>function getPersistedLlmApiKeyById(provider = DEFAULT_LLM_PROVIDER, keyId = '', preferences = desktopState?.preferences &#124;&#124; {}) {</code> | 定义函数 `getPersistedLlmApiKeyById`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2226 | <code>    const profile = getLlmApiKeyProfileForProvider(provider, preferences);</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2227 | <code>    const requestedKeyId = String(keyId &#124;&#124; '').trim();</code> | 声明局部标识符 `requestedKeyId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2228 | <code>    return normalizeLlmApiKey(profile.keys.find((entry) =&gt; entry.id === requestedKeyId)?.value &#124;&#124; '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2229 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2230 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2231 | <code>function getActiveLlmApiKeyFromProfiles(profiles = {}, provider = DEFAULT_LLM_PROVIDER) {</code> | 定义函数 `getActiveLlmApiKeyFromProfiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2232 | <code>    const normalizedProvider = normalizeLlmProvider(provider);</code> | 声明局部标识符 `normalizedProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2233 | <code>    const normalizedProfiles = normalizeLlmApiKeyProfiles(profiles);</code> | 声明局部标识符 `normalizedProfiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2234 | <code>    const profile = normalizedProfiles[normalizedProvider] &#124;&#124; { activeKeyId: '', keys: [] };</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2235 | <code>    return normalizeLlmApiKey(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2236 | <code>        (profile.keys.find((entry) =&gt; entry.id === profile.activeKeyId) &#124;&#124; profile.keys[0] &#124;&#124; {}).value &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2237 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2238 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2240 | <code>function getRendererLlmApiKeyProfiles(preferences = desktopState?.preferences &#124;&#124; {}) {</code> | 定义函数 `getRendererLlmApiKeyProfiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2241 | <code>    const profiles = getPersistedLlmApiKeyProfiles(preferences);</code> | 声明局部标识符 `profiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2242 | <code>    return Object.fromEntries(Object.entries(profiles).map(([provider, profile]) =&gt; [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2243 | <code>        provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2244 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2245 | <code>            activeKeyId: profile.activeKeyId &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2246 | <code>            keys: (profile.keys &#124;&#124; []).map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2247 | <code>                id: entry.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2248 | <code>                label: entry.label &#124;&#124; '默认 Key',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2249 | <code>                masked: maskLlmApiKey(entry.value),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2250 | <code>                createdAt: entry.createdAt &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2251 | <code>                updatedAt: entry.updatedAt &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2252 | <code>                lastUsedAt: entry.lastUsedAt &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2253 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2254 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2255 | <code>    ]));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2256 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2258 | <code>function upsertLlmApiKeyProfile(profiles = {}, provider = DEFAULT_LLM_PROVIDER, apiKey = '', label = '') {</code> | 定义函数 `upsertLlmApiKeyProfile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2259 | <code>    const normalizedProvider = normalizeLlmProvider(provider);</code> | 声明局部标识符 `normalizedProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2260 | <code>    const cleanKey = normalizeLlmApiKey(apiKey);</code> | 声明局部标识符 `cleanKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2261 | <code>    if (!cleanKey) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2262 | <code>        return normalizeLlmApiKeyProfiles(profiles);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2263 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2264 | <code>    const nextProfiles = normalizeLlmApiKeyProfiles(profiles);</code> | 声明局部标识符 `nextProfiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2265 | <code>    const profile = nextProfiles[normalizedProvider] &#124;&#124; { activeKeyId: '', keys: [] };</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2266 | <code>    const keyId = createLlmApiKeyId(normalizedProvider, cleanKey);</code> | 声明局部标识符 `keyId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2267 | <code>    const now = new Date().toISOString();</code> | 声明局部标识符 `now`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2268 | <code>    const existing = profile.keys.find((entry) =&gt; entry.id === keyId &#124;&#124; entry.value === cleanKey);</code> | 声明局部标识符 `existing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2269 | <code>    if (existing) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2270 | <code>        existing.label = String(label &#124;&#124; existing.label &#124;&#124; '默认 Key').trim().slice(0, 80) &#124;&#124; '默认 Key';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2271 | <code>        existing.value = cleanKey;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2272 | <code>        existing.updatedAt = now;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2273 | <code>        existing.lastUsedAt = now;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2274 | <code>        profile.activeKeyId = existing.id;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2275 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2276 | <code>        profile.keys.unshift({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2277 | <code>            id: keyId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2278 | <code>            label: String(label &#124;&#124; `${llmProviderLabelsForLog(normalizedProvider)} Key`).trim().slice(0, 80) &#124;&#124; '默认 Key',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2279 | <code>            value: cleanKey,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2280 | <code>            createdAt: now,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2281 | <code>            updatedAt: now,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2282 | <code>            lastUsedAt: now</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2283 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2284 | <code>        profile.activeKeyId = keyId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2285 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2286 | <code>    nextProfiles[normalizedProvider] = normalizeLlmApiKeyProfiles({ [normalizedProvider]: profile })[normalizedProvider];</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2287 | <code>    return nextProfiles;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2288 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2289 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2290 | <code>function selectLlmApiKeyProfile(profiles = {}, provider = DEFAULT_LLM_PROVIDER, keyId = '') {</code> | 定义函数 `selectLlmApiKeyProfile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2291 | <code>    const normalizedProvider = normalizeLlmProvider(provider);</code> | 声明局部标识符 `normalizedProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2292 | <code>    const nextProfiles = normalizeLlmApiKeyProfiles(profiles);</code> | 声明局部标识符 `nextProfiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2293 | <code>    const profile = nextProfiles[normalizedProvider] &#124;&#124; { activeKeyId: '', keys: [] };</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2294 | <code>    const requestedKeyId = String(keyId &#124;&#124; '').trim();</code> | 声明局部标识符 `requestedKeyId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2295 | <code>    if (profile.keys.some((entry) =&gt; entry.id === requestedKeyId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2296 | <code>        profile.activeKeyId = requestedKeyId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2297 | <code>        const selected = profile.keys.find((entry) =&gt; entry.id === requestedKeyId);</code> | 声明局部标识符 `selected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2298 | <code>        if (selected) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2299 | <code>            selected.lastUsedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2300 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2301 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2302 | <code>    nextProfiles[normalizedProvider] = profile;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2303 | <code>    return nextProfiles;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2304 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2305 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2306 | <code>function removeLlmApiKeyProfile(profiles = {}, provider = DEFAULT_LLM_PROVIDER, keyId = '') {</code> | 定义函数 `removeLlmApiKeyProfile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2307 | <code>    const normalizedProvider = normalizeLlmProvider(provider);</code> | 声明局部标识符 `normalizedProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2308 | <code>    const nextProfiles = normalizeLlmApiKeyProfiles(profiles);</code> | 声明局部标识符 `nextProfiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2309 | <code>    const profile = nextProfiles[normalizedProvider] &#124;&#124; { activeKeyId: '', keys: [] };</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2310 | <code>    const removeId = String(keyId &#124;&#124; profile.activeKeyId &#124;&#124; '').trim();</code> | 声明局部标识符 `removeId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2311 | <code>    profile.keys = profile.keys.filter((entry) =&gt; entry.id !== removeId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2312 | <code>    profile.activeKeyId = profile.keys[0]?.id &#124;&#124; '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2313 | <code>    nextProfiles[normalizedProvider] = profile;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2314 | <code>    return nextProfiles;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2315 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2317 | <code>function llmProviderLabelsForLog(provider = DEFAULT_LLM_PROVIDER) {</code> | 定义函数 `llmProviderLabelsForLog`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2318 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2319 | <code>        'openai-compatible': 'OpenAI-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2320 | <code>        doubao: 'Doubao',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2321 | <code>        deepseek: 'DeepSeek',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2322 | <code>        qwen: 'DashScope',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2323 | <code>        kimi: 'Kimi',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2324 | <code>        zhipu: 'Zhipu',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2325 | <code>        openrouter: 'OpenRouter',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2326 | <code>        'openai-responses': 'OpenAI',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2327 | <code>        anthropic: 'Anthropic',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2328 | <code>        gemini: 'Gemini',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2329 | <code>        ollama: 'Ollama'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2330 | <code>    }[normalizeLlmProvider(provider)] &#124;&#124; 'LLM';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2331 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2333 | <code>function getPersistedLlmSettings() {</code> | 定义函数 `getPersistedLlmSettings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2334 | <code>    const preferences = desktopState?.preferences &#124;&#124; {};</code> | 声明局部标识符 `preferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2335 | <code>    const provider = normalizeLlmProvider(preferences.llmProvider &#124;&#124; DEFAULT_LLM_PROVIDER);</code> | 声明局部标识符 `provider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2336 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2337 | <code>        provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2338 | <code>        baseUrl: normalizeLlmBaseUrl(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2339 | <code>            preferences.llmBaseUrl &#124;&#124; getDefaultProviderBaseUrl(provider) &#124;&#124; DEFAULT_LLM_BASE_URL</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2340 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2341 | <code>        model: normalizeLlmModel(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2342 | <code>            preferences.llmModel &#124;&#124; getDefaultProviderModel(provider) &#124;&#124; DEFAULT_LLM_MODEL</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2343 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2344 | <code>        apiKey: getPersistedLlmApiKeyForProvider(provider, preferences) &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2345 | <code>            normalizeLlmApiKey(preferences.llmApiKey &#124;&#124; ''),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2346 | <code>        temperature: normalizeLlmTemperature(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2347 | <code>            preferences.llmTemperature ?? DEFAULT_LLM_TEMPERATURE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2348 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2349 | <code>        timeoutMs: normalizeLlmRequestTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2350 | <code>            preferences.llmRequestTimeoutMs &#124;&#124; DEFAULT_LLM_REQUEST_TIMEOUT_MS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2351 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2352 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2353 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2355 | <code>function getEnvironmentLlmApiKey(provider = DEFAULT_LLM_PROVIDER) {</code> | 定义函数 `getEnvironmentLlmApiKey`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2356 | <code>    const normalizedProvider = normalizeLlmProvider(provider);</code> | 声明局部标识符 `normalizedProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2357 | <code>    if (normalizedProvider === 'ollama') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2358 | <code>        return normalizeLlmApiKey(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2359 | <code>            process.env.OLLAMA_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2360 | <code>                process.env.AILIS_OLLAMA_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2361 | <code>                ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2362 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2363 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2364 | <code>    if (normalizedProvider === 'vllm') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2365 | <code>        return normalizeLlmApiKey(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2366 | <code>            process.env.VLLM_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2367 | <code>                process.env.AILIS_VLLM_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2368 | <code>                ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2369 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2370 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2371 | <code>    if (normalizedProvider === 'openai-responses') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2372 | <code>        return normalizeLlmApiKey(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2373 | <code>            process.env.OPENAI_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2374 | <code>                process.env.AILIS_OPENAI_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2375 | <code>                ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2376 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2377 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2378 | <code>    if (normalizedProvider === 'anthropic') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2379 | <code>        return normalizeLlmApiKey(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2380 | <code>            process.env.ANTHROPIC_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2381 | <code>                process.env.CLAUDE_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2382 | <code>                process.env.AILIS_ANTHROPIC_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2383 | <code>                ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2384 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2385 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2386 | <code>    if (normalizedProvider === 'gemini') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2387 | <code>        return normalizeLlmApiKey(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2388 | <code>            process.env.GEMINI_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2389 | <code>                process.env.GOOGLE_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2390 | <code>                process.env.GOOGLE_GENERATIVE_AI_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2391 | <code>                process.env.AILIS_GEMINI_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2392 | <code>                ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2393 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2394 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2395 | <code>    if (normalizedProvider === 'deepseek') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2396 | <code>        return normalizeLlmApiKey(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2397 | <code>            process.env.DEEPSEEK_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2398 | <code>                process.env.AILIS_DEEPSEEK_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2399 | <code>                ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2400 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2401 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2402 | <code>    if (normalizedProvider === 'qwen') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2403 | <code>        return normalizeLlmApiKey(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2404 | <code>            process.env.DASHSCOPE_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2405 | <code>                process.env.QWEN_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2406 | <code>                process.env.AILIS_DASHSCOPE_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2407 | <code>                process.env.AILIS_QWEN_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2408 | <code>                ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2409 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2410 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2411 | <code>    if (normalizedProvider === 'kimi') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2412 | <code>        return normalizeLlmApiKey(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2413 | <code>            process.env.MOONSHOT_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2414 | <code>                process.env.KIMI_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2415 | <code>                process.env.AILIS_MOONSHOT_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2416 | <code>                process.env.AILIS_KIMI_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2417 | <code>                ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2418 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2419 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2420 | <code>    if (normalizedProvider === 'zhipu') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2421 | <code>        return normalizeLlmApiKey(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2422 | <code>            process.env.ZHIPU_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2423 | <code>                process.env.GLM_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2424 | <code>                process.env.AILIS_ZHIPU_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2425 | <code>                ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2426 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2427 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2428 | <code>    if (normalizedProvider === 'openrouter') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2429 | <code>        return normalizeLlmApiKey(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2430 | <code>            process.env.OPENROUTER_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2431 | <code>                process.env.AILIS_OPENROUTER_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2432 | <code>                ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2433 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2434 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2435 | <code>    return normalizeLlmApiKey(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2436 | <code>        process.env.DOUBAO_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2437 | <code>        process.env.ARK_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2438 | <code>        process.env.VOLCENGINE_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2439 | <code>        process.env.OPENAI_COMPATIBLE_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2440 | <code>        process.env.OPENAI_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2441 | <code>        ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2442 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2443 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2445 | <code>function isLocalLlmProvider(provider = DEFAULT_LLM_PROVIDER) {</code> | 定义函数 `isLocalLlmProvider`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2446 | <code>    const normalizedProvider = normalizeLlmProvider(provider);</code> | 声明局部标识符 `normalizedProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2447 | <code>    return normalizedProvider === 'ollama' &#124;&#124; normalizedProvider === 'vllm';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2448 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2449 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2450 | <code>function getResolvedLlmSettings() {</code> | 定义函数 `getResolvedLlmSettings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2451 | <code>    const persistedSettings = getPersistedLlmSettings();</code> | 声明局部标识符 `persistedSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2452 | <code>    const environmentApiKey = getEnvironmentLlmApiKey(persistedSettings.provider);</code> | 声明局部标识符 `environmentApiKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2453 | <code>    const apiKey = persistedSettings.apiKey &#124;&#124; environmentApiKey;</code> | 声明局部标识符 `apiKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2454 | <code>    const apiKeySource = apiKey &amp;&amp; persistedSettings.apiKey</code> | 声明局部标识符 `apiKeySource`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2455 | <code>        ? 'saved'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2456 | <code>        : apiKey</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2457 | <code>        ? 'environment'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2458 | <code>        : 'none';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2459 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2460 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2461 | <code>        ...persistedSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2462 | <code>        apiKey,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2463 | <code>        apiKeySource</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2464 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2465 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2467 | <code>function buildTemporaryLlmSettings(settings = {}) {</code> | 定义函数 `buildTemporaryLlmSettings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2468 | <code>    const provider = normalizeLlmProvider(settings.provider &#124;&#124; settings.llmProvider &#124;&#124; DEFAULT_LLM_PROVIDER);</code> | 声明局部标识符 `provider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2469 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2470 | <code>        provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2471 | <code>        baseUrl: normalizeLlmBaseUrl(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2472 | <code>            settings.baseUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2473 | <code>                settings.llmBaseUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2474 | <code>                getDefaultProviderBaseUrl(provider) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2475 | <code>                DEFAULT_LLM_BASE_URL</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2476 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2477 | <code>        model: normalizeLlmModel(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2478 | <code>            settings.model &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2479 | <code>                settings.llmModel &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2480 | <code>                getDefaultProviderModel(provider) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2481 | <code>                DEFAULT_LLM_MODEL</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2482 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2483 | <code>        apiKey: normalizeLlmApiKey(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2484 | <code>            settings.apiKey &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2485 | <code>                settings.llmApiKey &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2486 | <code>                getPersistedLlmApiKeyForProvider(provider) &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2487 | <code>                getEnvironmentLlmApiKey(provider) &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2488 | <code>                ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2489 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2490 | <code>        temperature: normalizeLlmTemperature(settings.temperature ?? settings.llmTemperature ?? DEFAULT_LLM_TEMPERATURE),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2491 | <code>        timeoutMs: normalizeLlmRequestTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2492 | <code>            settings.timeoutMs &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2493 | <code>                settings.requestTimeoutMs &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2494 | <code>                settings.llmRequestTimeoutMs &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2495 | <code>                DEFAULT_LLM_REQUEST_TIMEOUT_MS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2496 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2497 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2498 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2499 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2500 | <code>function getPersistedEmailProfiles() {</code> | 定义函数 `getPersistedEmailProfiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2501 | <code>    return normalizeEmailProfiles(desktopState?.preferences?.emailProfiles &#124;&#124; {});</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2502 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2504 | <code>function getPersistedComputerControlEnabled() {</code> | 定义函数 `getPersistedComputerControlEnabled`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2505 | <code>    return normalizeComputerControlEnabled(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2506 | <code>        desktopState?.preferences?.computerControlEnabled ?? DEFAULT_COMPUTER_CONTROL_ENABLED</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2507 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2508 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2509 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2510 | <code>function getAILISDefaultContext() {</code> | 定义函数 `getAILISDefaultContext`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2511 | <code>    if (getPersistedComputerControlEnabled()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2512 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2513 | <code>            computerControlEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2514 | <code>            permissionProfile: 'danger-full-access',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2515 | <code>            approvalPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2516 | <code>            confirmationPolicy: 'auto',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2517 | <code>            visionPermissionPolicy: 'manual',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2518 | <code>            approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2519 | <code>            autoConfirm: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2520 | <code>            executeExternal: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2521 | <code>            allowOutsideWorkspace: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2522 | <code>            allowComputerWideAccess: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2523 | <code>            allowSystemMutation: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2524 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2525 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2526 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2527 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2528 | <code>        computerControlEnabled: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2529 | <code>        permissionProfile: 'workspace-write',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2530 | <code>        approvalPolicy: 'on-request',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2531 | <code>        confirmationPolicy: 'on-request',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2532 | <code>        visionPermissionPolicy: 'manual',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2533 | <code>        requireApprovalForMutations: true</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2534 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2535 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2536 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2537 | <code>function getRendererEmailProfiles() {</code> | 定义函数 `getRendererEmailProfiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2538 | <code>    const profiles = getPersistedEmailProfiles();</code> | 声明局部标识符 `profiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2539 | <code>    return Object.fromEntries(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2540 | <code>        EMAIL_PROVIDER_OPTIONS.map((providerId) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2541 | <code>            const profile = profiles[providerId] &#124;&#124; {};</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2542 | <code>            return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2543 | <code>                providerId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2544 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2545 | <code>                    account: profile.account &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2546 | <code>                    authType: profile.authType &#124;&#124; 'password',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2547 | <code>                    secretConfigured: Boolean(profile.secret),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2548 | <code>                    secretSource: profile.secret ? 'saved' : 'none'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2549 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2550 | <code>            ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2551 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2552 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2553 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2554 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2555 | <code>function getRendererLlmPreferences() {</code> | 定义函数 `getRendererLlmPreferences`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2556 | <code>    const settings = getResolvedLlmSettings();</code> | 声明局部标识符 `settings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2557 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2558 | <code>        llmProvider: settings.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2559 | <code>        llmBaseUrl: settings.baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2560 | <code>        llmModel: settings.model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2561 | <code>        llmApiKeyConfigured: Boolean(settings.apiKey),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2562 | <code>        llmApiKeySource: settings.apiKeySource,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2563 | <code>        llmApiKeyProfiles: getRendererLlmApiKeyProfiles(),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2564 | <code>        llmActiveApiKeyId: getActiveLlmApiKeyEntry(settings.provider)?.id &#124;&#124; '',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2565 | <code>        llmTemperature: settings.temperature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2566 | <code>        llmRequestTimeoutMs: settings.timeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2567 | <code>        llmCapabilities: getProviderCapabilities(settings)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2568 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2569 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2570 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2571 | <code>function ollamaSourceToLegacyMode(source = '') {</code> | 定义函数 `ollamaSourceToLegacyMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2572 | <code>    if (source === 'local_import') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2573 | <code>        return 'local';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2574 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2575 | <code>    if (source === 'online_pull') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2576 | <code>        return 'online';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2577 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2578 | <code>    return 'installed';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2579 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2580 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2581 | <code>function getRendererOllamaTargetPreferences(preferences = desktopState?.preferences &#124;&#124; {}) {</code> | 定义函数 `getRendererOllamaTargetPreferences`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2582 | <code>    const target = normalizeOllamaTarget({</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2583 | <code>        target: preferences.ollamaTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2584 | <code>        ollamaDeploymentMode: preferences.ollamaDeploymentMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2585 | <code>        modelId: preferences.llmModel &#124;&#124; LLM_PROVIDER_DEFAULT_MODELS.ollama,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2586 | <code>        localModelPath: preferences.ollamaLocalModelPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2587 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2588 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2589 | <code>        ollamaTarget: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2590 | <code>        ollamaDeploymentMode: ollamaSourceToLegacyMode(target.source),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2591 | <code>        ollamaLocalModelPath: target.localPath &#124;&#124; String(preferences.ollamaLocalModelPath &#124;&#124; '').trim(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2592 | <code>        ollamaInstalledModels: Array.isArray(preferences.ollamaInstalledModels)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2593 | <code>            ? preferences.ollamaInstalledModels</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2594 | <code>            : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2595 | <code>        ollamaUsedModels: Array.isArray(preferences.ollamaUsedModels)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2596 | <code>            ? preferences.ollamaUsedModels</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2597 | <code>            : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2598 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2599 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2600 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2601 | <code>function detectElevenLabsLanguageFromText(text) {</code> | 定义函数 `detectElevenLabsLanguageFromText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2602 | <code>    const source = String(text &#124;&#124; '');</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2603 | <code>    const kanaCount = (source.match(/[\u3040-\u30ff]/g) &#124;&#124; []).length;</code> | 声明局部标识符 `kanaCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2604 | <code>    if (kanaCount &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2605 | <code>        return 'ja';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2606 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2607 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2608 | <code>    const hangulCount = (source.match(/[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/g) &#124;&#124; []).length;</code> | 声明局部标识符 `hangulCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2609 | <code>    if (hangulCount &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2610 | <code>        return 'ko';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2611 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2612 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2613 | <code>    const cjkCount = (source.match(/[\u3400-\u9fff]/g) &#124;&#124; []).length;</code> | 声明局部标识符 `cjkCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2614 | <code>    if (cjkCount &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2615 | <code>        return 'zh';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2616 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2617 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2618 | <code>    const latinCount = (source.match(/[A-Za-z]/g) &#124;&#124; []).length;</code> | 声明局部标识符 `latinCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2619 | <code>    if (latinCount &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2620 | <code>        return 'en';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2621 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2622 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2623 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2624 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2625 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2626 | <code>function normalizeRequestedElevenLabsLanguage(payload = {}, preferences = {}) {</code> | 定义函数 `normalizeRequestedElevenLabsLanguage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2627 | <code>    const requestedLanguage = String(</code> | 声明局部标识符 `requestedLanguage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2628 | <code>        payload.languageCode &#124;&#124; payload.language_code &#124;&#124; payload.language &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2629 | <code>    ).trim().toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2630 | <code>    if (ELEVENLABS_LANGUAGE_CODES.includes(requestedLanguage)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2631 | <code>        return requestedLanguage;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2632 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2633 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2634 | <code>    const detectedLanguage = detectElevenLabsLanguageFromText(payload.text);</code> | 声明局部标识符 `detectedLanguage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2635 | <code>    if (detectedLanguage) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2636 | <code>        return detectedLanguage;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2637 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2638 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2639 | <code>    return normalizeElevenLabsLanguageCode(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2640 | <code>        preferences.elevenLabsLanguageCode &#124;&#124; DEFAULT_ELEVENLABS_LANGUAGE_CODE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2641 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2642 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2643 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2644 | <code>function getPersistedElevenLabsVoiceProfiles() {</code> | 定义函数 `getPersistedElevenLabsVoiceProfiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2645 | <code>    const preferences = desktopState?.preferences &#124;&#124; {};</code> | 声明局部标识符 `preferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2646 | <code>    return normalizeElevenLabsVoiceProfiles(preferences.elevenLabsVoiceProfiles, preferences);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2647 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2648 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2649 | <code>function getPersistedElevenLabsSettings(payload = {}) {</code> | 定义函数 `getPersistedElevenLabsSettings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2650 | <code>    const preferences = desktopState?.preferences &#124;&#124; {};</code> | 声明局部标识符 `preferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2651 | <code>    const voiceProfiles = getPersistedElevenLabsVoiceProfiles();</code> | 声明局部标识符 `voiceProfiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2652 | <code>    const languageCode = normalizeRequestedElevenLabsLanguage(payload, preferences);</code> | 声明局部标识符 `languageCode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2653 | <code>    const selectedProfile = voiceProfiles[languageCode] &#124;&#124; voiceProfiles.zh &#124;&#124; DEFAULT_ELEVENLABS_VOICE_PROFILES.zh;</code> | 声明局部标识符 `selectedProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2654 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2655 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2656 | <code>        apiBase: normalizeElevenLabsApiBase(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2657 | <code>            preferences.elevenLabsApiBase &#124;&#124; DEFAULT_ELEVENLABS_API_BASE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2658 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2659 | <code>        apiKey: normalizeElevenLabsApiKey(preferences.elevenLabsApiKey &#124;&#124; DEFAULT_ELEVENLABS_API_KEY),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2660 | <code>        voiceId: normalizeElevenLabsVoiceId(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2661 | <code>            selectedProfile.voiceId &#124;&#124; preferences.elevenLabsVoiceId &#124;&#124; DEFAULT_ELEVENLABS_VOICE_ID</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2662 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2663 | <code>        modelId: normalizeElevenLabsModelId(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2664 | <code>            selectedProfile.modelId &#124;&#124; preferences.elevenLabsModelId &#124;&#124; DEFAULT_ELEVENLABS_MODEL_ID</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2665 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2666 | <code>        languageCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2667 | <code>        outputFormat: normalizeElevenLabsOutputFormat(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2668 | <code>            selectedProfile.outputFormat &#124;&#124; preferences.elevenLabsOutputFormat &#124;&#124; DEFAULT_ELEVENLABS_OUTPUT_FORMAT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2669 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2670 | <code>        timeoutMs: normalizeElevenLabsTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2671 | <code>            preferences.elevenLabsTimeoutMs &#124;&#124; DEFAULT_ELEVENLABS_TIMEOUT_MS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2672 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2673 | <code>        enableLogging: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2674 | <code>        optimizeStreamingLatency: normalizeElevenLabsOptimizeStreamingLatency(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2675 | <code>            selectedProfile.optimizeStreamingLatency ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2676 | <code>                preferences.elevenLabsOptimizeStreamingLatency ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2677 | <code>                DEFAULT_ELEVENLABS_OPTIMIZE_STREAMING_LATENCY</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2678 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2679 | <code>        stability: normalizeElevenLabsStability(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2680 | <code>            selectedProfile.stability ?? preferences.elevenLabsStability ?? DEFAULT_ELEVENLABS_STABILITY</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2681 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2682 | <code>        similarityBoost: normalizeElevenLabsSimilarityBoost(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2683 | <code>            selectedProfile.similarityBoost ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2684 | <code>                preferences.elevenLabsSimilarityBoost ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2685 | <code>                DEFAULT_ELEVENLABS_SIMILARITY_BOOST</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2686 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2687 | <code>        style: normalizeElevenLabsStyle(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2688 | <code>            selectedProfile.style ?? preferences.elevenLabsStyle ?? DEFAULT_ELEVENLABS_STYLE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2689 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2690 | <code>        speed: normalizeElevenLabsSpeed(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2691 | <code>            selectedProfile.speed ?? preferences.elevenLabsSpeed ?? DEFAULT_ELEVENLABS_SPEED</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2692 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2693 | <code>        useSpeakerBoost: normalizeElevenLabsUseSpeakerBoost(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2694 | <code>            selectedProfile.useSpeakerBoost ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2695 | <code>                preferences.elevenLabsUseSpeakerBoost ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2696 | <code>                DEFAULT_ELEVENLABS_USE_SPEAKER_BOOST</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2697 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2698 | <code>        voiceProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2699 | <code>        selectedLanguageCode: languageCode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2700 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2701 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2702 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2703 | <code>function getRendererElevenLabsPreferences() {</code> | 定义函数 `getRendererElevenLabsPreferences`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2704 | <code>    const settings = getPersistedElevenLabsSettings();</code> | 声明局部标识符 `settings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2705 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2706 | <code>        elevenLabsApiBase: settings.apiBase,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2707 | <code>        elevenLabsVoiceId: settings.voiceId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2708 | <code>        elevenLabsModelId: settings.modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2709 | <code>        elevenLabsLanguageCode: settings.languageCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2710 | <code>        elevenLabsOutputFormat: settings.outputFormat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2711 | <code>        elevenLabsTimeoutMs: settings.timeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2712 | <code>        elevenLabsOptimizeStreamingLatency: settings.optimizeStreamingLatency,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2713 | <code>        elevenLabsStability: settings.stability,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2714 | <code>        elevenLabsSimilarityBoost: settings.similarityBoost,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2715 | <code>        elevenLabsStyle: settings.style,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2716 | <code>        elevenLabsSpeed: settings.speed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2717 | <code>        elevenLabsUseSpeakerBoost: settings.useSpeakerBoost,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2718 | <code>        elevenLabsVoiceProfiles: settings.voiceProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2719 | <code>        elevenLabsApiKeyConfigured: Boolean(settings.apiKey),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2720 | <code>        elevenLabsApiKeySource: settings.apiKey ? 'saved' : 'none'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2721 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2722 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2723 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2724 | <code>function extractTextFromLlmContent(content) {</code> | 定义函数 `extractTextFromLlmContent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2725 | <code>    if (typeof content === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2726 | <code>        return content;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2727 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2728 | <code>    if (!Array.isArray(content)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2729 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2730 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2731 | <code>    return content</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2732 | <code>        .map((part) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2733 | <code>            if (typeof part === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2734 | <code>                return part;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2735 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2736 | <code>            if (part?.type === 'text' &#124;&#124; part?.type === 'input_text') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2737 | <code>                return part.text &#124;&#124; part.content &#124;&#124; '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2738 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2739 | <code>            return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2740 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2741 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2742 | <code>        .join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2743 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2744 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2745 | <code>function extractLatestUserTextFromLlmPayload(payload = {}) {</code> | 定义函数 `extractLatestUserTextFromLlmPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2746 | <code>    const messages = Array.isArray(payload.messages) ? payload.messages : [];</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2747 | <code>    for (let index = messages.length - 1; index &gt;= 0; index -= 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2748 | <code>        if (messages[index]?.role === 'user') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2749 | <code>            return extractTextFromLlmContent(messages[index].content);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2750 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2751 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2752 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2753 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2754 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2755 | <code>function attachAilisMemoryToLlmPayload(payload = {}) {</code> | 定义函数 `attachAilisMemoryToLlmPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2756 | <code>    if (payload.includeAilisMemory !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2757 | <code>        return payload;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2758 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2759 | <code>    const messages = Array.isArray(payload.messages) ? payload.messages : [];</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2760 | <code>    if (!messages.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2761 | <code>        return payload;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2762 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2763 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2764 | <code>    let memoryContext = '';</code> | 声明局部标识符 `memoryContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2765 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2766 | <code>        memoryContext = ensureAILISGateway().memoryRuntime?.compileContext?.({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2767 | <code>            sessionId: payload.sessionId &#124;&#124; payload.sessionKey &#124;&#124; 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2768 | <code>            message: payload.memoryUserMessage &#124;&#124; extractLatestUserTextFromLlmPayload(payload),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2769 | <code>            messageHistory: payload.messageHistory &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2770 | <code>        }) &#124;&#124; '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2771 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2772 | <code>        console.warn('[ailis-memory] 直连 LLM 注入记忆失败：', error.message &#124;&#124; error);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2773 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2774 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2775 | <code>    if (!memoryContext) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2776 | <code>        return payload;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2777 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2778 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2779 | <code>    const memoryMessage = {</code> | 声明局部标识符 `memoryMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2780 | <code>        role: 'developer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2781 | <code>        content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2782 | <code>            '以下是 AILIS 的本地长期记忆上下文，只作为辅助参考。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2783 | <code>            '若与用户当前明确指令冲突，以当前指令为准；不要主动暴露内部好感度数值。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2784 | <code>            '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2785 | <code>            memoryContext</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2786 | <code>        ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2787 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2788 | <code>    const nextMessages = messages.slice();</code> | 声明局部标识符 `nextMessages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2789 | <code>    const firstNonSystemIndex = nextMessages.findIndex((message) =&gt; message?.role !== 'system');</code> | 声明局部标识符 `firstNonSystemIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2790 | <code>    if (firstNonSystemIndex === -1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2791 | <code>        nextMessages.push(memoryMessage);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2792 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2793 | <code>        nextMessages.splice(firstNonSystemIndex, 0, memoryMessage);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2794 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2795 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2796 | <code>        ...payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2797 | <code>        messages: nextMessages</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2798 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2799 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2800 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2801 | <code>async function callDesktopLlm(payload = {}) {</code> | 定义函数 `callDesktopLlm`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2802 | <code>    const settings = getResolvedLlmSettings();</code> | 声明局部标识符 `settings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2803 | <code>    const busy = getOllamaRuntimeBusyResult(settings);</code> | 声明局部标识符 `busy`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2804 | <code>    if (busy) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2805 | <code>        return busy;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2806 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2807 | <code>    const startedAt = Date.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2808 | <code>    const shouldRecordMemory = payload.recordMemory !== false;</code> | 声明局部标识符 `shouldRecordMemory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2809 | <code>    const enrichedPayload = attachAilisMemoryToLlmPayload(payload);</code> | 声明局部标识符 `enrichedPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2810 | <code>    const result = await callDesktopLlmProvider(settings, enrichedPayload);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2811 | <code>    if (shouldRecordMemory) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2812 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2813 | <code>            ensureAILISGateway().rawMemoryLedger?.recordChatTurn?.({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2814 | <code>                sessionId: payload.sessionId &#124;&#124; payload.sessionKey &#124;&#124; 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2815 | <code>                source: payload.memorySource &#124;&#124; 'direct_llm',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2816 | <code>                requestPayload: payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2817 | <code>                enrichedPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2818 | <code>                result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2819 | <code>                durationMs: Date.now() - startedAt</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2820 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2821 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2822 | <code>            console.warn('[ailis-raw-memory] 写入原始对话账本失败：', error.message &#124;&#124; error);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2823 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2824 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2825 | <code>    if (payload.includeAilisMemory === true &amp;&amp; shouldRecordMemory &amp;&amp; payload.recordLongTermMemory !== false) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2826 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2827 | <code>            ensureAILISGateway().memoryRuntime?.recordTurn?.({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2828 | <code>                sessionId: payload.sessionId &#124;&#124; payload.sessionKey &#124;&#124; 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2829 | <code>                userMessage: payload.memoryUserMessage &#124;&#124; extractLatestUserTextFromLlmPayload(payload),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2830 | <code>                assistantMessage: result?.content &#124;&#124; result?.error &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2831 | <code>                source: payload.memorySource &#124;&#124; 'direct_llm',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2832 | <code>                result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2833 | <code>                messageHistory: payload.messageHistory &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2834 | <code>                attachments: payload.memoryAttachments &#124;&#124; []</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2835 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2836 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2837 | <code>            console.warn('[ailis-memory] 直连 LLM 写入记忆失败：', error.message &#124;&#124; error);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2838 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2839 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2840 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2841 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2842 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2843 | <code>async function callDesktopElevenLabsTts(payload = {}) {</code> | 定义函数 `callDesktopElevenLabsTts`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2844 | <code>    return synthesizeElevenLabsSpeech(getPersistedElevenLabsSettings(payload), payload);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2845 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2846 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2847 | <code>async function callDesktopTts(payload = {}) {</code> | 定义函数 `callDesktopTts`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2848 | <code>    if (payload?.provider === 'cosyvoice3') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2849 | <code>        const runtime = getVoiceRuntimeBootstrap();</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2850 | <code>        const summary = runtime.getFastSummary();</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2851 | <code>        if (!summary.cosyVoice3?.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2852 | <code>            const requiredStepCount = (summary.installPlan?.steps &#124;&#124; []).filter((step) =&gt; !step.optional).length;</code> | 声明局部标识符 `requiredStepCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2853 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2854 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2855 | <code>                provider: 'cosyvoice3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2856 | <code>                code: 'voice_runtime_needs_setup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2857 | <code>                error: `CosyVoice3 本地运行时尚未就绪，需要完成 ${requiredStepCount} 个 TTS 必需步骤。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2858 | <code>                runtimeSetup: summary</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2859 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2860 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2861 | <code>        return synthesizeCosyVoice3Speech({}, payload);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2862 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2863 | <code>    if (payload?.provider &amp;&amp; payload.provider !== 'elevenlabs' &amp;&amp; payload.provider !== 'server') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2864 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2865 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2866 | <code>            provider: payload.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2867 | <code>            code: 'unsupported_tts_provider',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2868 | <code>            error: '当前只支持关闭语音、ElevenLabs 和 CosyVoice3。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2869 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2870 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2871 | <code>    return callDesktopElevenLabsTts(payload);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2872 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2873 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2874 | <code>function warmupDesktopSpeechMode(mode, { delayMs = 0, waitForCompletion = false, reason = '' } = {}) {</code> | 定义函数 `warmupDesktopSpeechMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2875 | <code>    const normalizedMode = normalizeSpeechMode(mode);</code> | 声明局部标识符 `normalizedMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2876 | <code>    const runWarmup = async () =&gt; {</code> | 声明局部标识符 `runWarmup`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2877 | <code>        if (normalizedMode === 'cosyvoice3') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2878 | <code>            const runtime = getVoiceRuntimeBootstrap();</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2879 | <code>            const summary = runtime.getFastSummary();</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2880 | <code>            if (!summary.cosyVoice3?.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2881 | <code>                const requiredStepCount = (summary.installPlan?.steps &#124;&#124; []).filter((step) =&gt; !step.optional).length;</code> | 声明局部标识符 `requiredStepCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2882 | <code>                console.warn(`[cosyvoice3] 本地运行时尚未就绪，需要 ${requiredStepCount} 个 TTS 必需步骤。`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2883 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2884 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2885 | <code>                    provider: 'cosyvoice3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2886 | <code>                    skipped: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2887 | <code>                    reason: 'voice_runtime_needs_setup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2888 | <code>                    requiredStepCount</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2889 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2890 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2891 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2892 | <code>                const result = await warmupCosyVoice3TTS({ timeoutMs: 300000 });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2893 | <code>                if (!result?.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2894 | <code>                    console.warn('[cosyvoice3] 后台预热失败：', result?.error &#124;&#124; result);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2895 | <code>                    return result &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2896 | <code>                        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2897 | <code>                        provider: 'cosyvoice3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2898 | <code>                        error: 'CosyVoice3 预热失败'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2899 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2900 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2901 | <code>                const elapsedText = result.alreadyWarm</code> | 声明局部标识符 `elapsedText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2902 | <code>                    ? '已是热状态'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2903 | <code>                    : `${result.elapsedSeconds}s`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2904 | <code>                console.log(`[cosyvoice3] 后台预热完成：${elapsedText}${reason ? ` (${reason})` : ''}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2905 | <code>                return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2906 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2907 | <code>                console.warn('[cosyvoice3] 后台预热失败：', error.message &#124;&#124; error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2908 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2909 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2910 | <code>                    provider: 'cosyvoice3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2911 | <code>                    error: error.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2912 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2913 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2914 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2915 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2916 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2917 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2918 | <code>            skipped: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2919 | <code>            provider: normalizedMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2920 | <code>            reason: 'speech_mode_not_cosyvoice3'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2921 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2922 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2923 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2924 | <code>    if (delayMs &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2925 | <code>        const delayedWarmup = new Promise((resolve) =&gt; {</code> | 声明局部标识符 `delayedWarmup`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2926 | <code>            setTimeout(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2927 | <code>                resolve(runWarmup());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2928 | <code>            }, delayMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2929 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2930 | <code>        if (waitForCompletion) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2931 | <code>            return delayedWarmup;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2932 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2933 | <code>        void delayedWarmup;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2934 | <code>        return Promise.resolve({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2935 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2936 | <code>            scheduled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2937 | <code>            provider: normalizedMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2938 | <code>            delayMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2939 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2940 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2941 | <code>    const warmupPromise = runWarmup();</code> | 声明局部标识符 `warmupPromise`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2942 | <code>    if (waitForCompletion) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2943 | <code>        return warmupPromise;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2944 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2945 | <code>    void warmupPromise;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2946 | <code>    return Promise.resolve({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2947 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2948 | <code>        scheduled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2949 | <code>        provider: normalizedMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2950 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2951 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2952 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2953 | <code>function getOpenWindows() {</code> | 定义函数 `getOpenWindows`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2954 | <code>    return [petWindow, chatWindow, controlWindow].filter(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2955 | <code>        (window) =&gt; window &amp;&amp; !window.isDestroyed()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2956 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2957 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2958 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2959 | <code>function broadcastAssistantEvent(payload) {</code> | 定义函数 `broadcastAssistantEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2960 | <code>    if (!payload) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2961 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2962 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2964 | <code>    for (const window of getOpenWindows()) {</code> | 声明局部标识符 `window`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2965 | <code>        window.webContents.send('ailis:assistant-event', payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2966 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2967 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2968 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2969 | <code>function broadcastHumanGatewayEvent(payload) {</code> | 定义函数 `broadcastHumanGatewayEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2970 | <code>    if (!payload) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2971 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2972 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2973 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2974 | <code>    for (const window of getOpenWindows()) {</code> | 声明局部标识符 `window`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2975 | <code>        window.webContents.send('ailis:gateway-event', payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2976 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2977 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2978 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2979 | <code>function ensureAILISGateway() {</code> | 定义函数 `ensureAILISGateway`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2980 | <code>    if (ailisGateway) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2981 | <code>        return ailisGateway;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2982 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2983 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2984 | <code>    const emberHarnessMode = normalizeEmberHarnessMode(</code> | 声明局部标识符 `emberHarnessMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2985 | <code>        desktopState?.preferences?.emberHarnessMode &#124;&#124; DEFAULT_EMBER_HARNESS_MODE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2986 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2987 | <code>    ailisGateway = new AILISGateway({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2988 | <code>        app,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2989 | <code>        projectRoot: getProjectRoot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2990 | <code>        workspaceRoot: getGatewayWorkspaceRoot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2991 | <code>        auditDir: getPersistedAILISStateDir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2992 | <code>        emberHarnessEnabled: emberHarnessMode !== 'off',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2993 | <code>        emberHarnessMode: emberHarnessMode === 'enforce' ? 'enforce' : 'observe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2994 | <code>        emberHarnessLexiconPath: path.join(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2995 | <code>            getPersistedAILISStateDir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2996 | <code>            'safety',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2997 | <code>            'sensitive-words.json'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 2998 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2999 | <code>        getDefaultContext: () =&gt; getAILISDefaultContext(),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3000 | <code>        getEmailProfiles: () =&gt; getPersistedEmailProfiles(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3001 | <code>        profileCurationLlm: (payload) =&gt; callDesktopLlmProvider(getResolvedLlmSettings(), payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3002 | <code>        visionServices: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3003 | <code>            permissionPolicy: 'manual',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 3004 | <code>            getLlmSettings: () =&gt; getResolvedLlmSettings(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3005 | <code>            capture: (payload) =&gt; captureVisionSnapshotForTool(payload)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3006 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3007 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3008 | <code>    ailisGateway.on('event', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3009 | <code>        broadcastHumanGatewayEvent(event);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3010 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3011 | <code>    return ailisGateway;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3012 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3013 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3014 | <code>async function ensureAILISGatewayStarted(reason = 'manual') {</code> | 定义函数 `ensureAILISGatewayStarted`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3015 | <code>    const gateway = ensureAILISGateway();</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3016 | <code>    if (gateway.server) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3017 | <code>        return gateway.getStatus({ includeAgentRunner: false });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3018 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3019 | <code>    if (!ailisGatewayStartPromise) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3020 | <code>        ailisGatewayStartPromise = gateway.start()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3021 | <code>            .catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3022 | <code>                console.warn(`[ailis-gateway] ${reason} 启动失败：`, error.message &#124;&#124; error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3023 | <code>                throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 3024 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3025 | <code>            .finally(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3026 | <code>                ailisGatewayStartPromise = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3027 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3028 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3029 | <code>    return ailisGatewayStartPromise;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3030 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3031 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3032 | <code>async function getAILISGatewayStatusEnsuringStarted(reason = 'status') {</code> | 定义函数 `getAILISGatewayStatusEnsuringStarted`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3033 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3034 | <code>        await ensureAILISGatewayStarted(reason);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3035 | <code>        return ensureAILISGateway().getStatus();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3036 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3037 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3038 | <code>            ...ensureAILISGateway().getStatus({ includeAgentRunner: false }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3039 | <code>            startError: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3040 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3041 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3042 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3043 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3044 | <code>function ensureAgentRuntimeSupervisor() {</code> | 定义函数 `ensureAgentRuntimeSupervisor`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3045 | <code>    if (agentRuntimeSupervisor) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3046 | <code>        return agentRuntimeSupervisor;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3047 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3048 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3049 | <code>    agentRuntimeSupervisor = new AILISAgentRuntimeSupervisor({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3050 | <code>        app,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3051 | <code>        gatewayUrl: resolveAgentRuntimeGatewayUrl()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3052 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3053 | <code>    agentRuntimeSupervisor.on('status', (status) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3054 | <code>        broadcastAssistantEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3055 | <code>            type: 'operator.runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3056 | <code>            payload: status</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3057 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3058 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3059 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3060 | <code>    return agentRuntimeSupervisor;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3061 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3062 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3063 | <code>function ensureAssistantGateway() {</code> | 定义函数 `ensureAssistantGateway`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3064 | <code>    if (assistantGateway) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3065 | <code>        return assistantGateway;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3066 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3067 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3068 | <code>    assistantGateway = new AILISGatewayBridgeManager({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3069 | <code>        app,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3070 | <code>        clientVersion: app.getVersion(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3071 | <code>        enabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3072 | <code>        gatewayUrl: resolveAgentRuntimeGatewayUrl()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3073 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3074 | <code>    assistantGateway.on('status', (status) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3075 | <code>        broadcastAssistantEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3076 | <code>            type: 'status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3077 | <code>            payload: status</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3078 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3079 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3080 | <code>    assistantGateway.on('event', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3081 | <code>        broadcastAssistantEvent(event);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3082 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3083 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3084 | <code>    return assistantGateway;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3085 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3086 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3087 | <code>async function resetAssistantBridge() {</code> | 定义函数 `resetAssistantBridge`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3088 | <code>    if (assistantGateway) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3089 | <code>        await assistantGateway.shutdown().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3090 | <code>        assistantGateway = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3091 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3092 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3093 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3094 | <code>function getAssistantStatusSnapshot() {</code> | 定义函数 `getAssistantStatusSnapshot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3095 | <code>    const gateway = ensureAssistantGateway();</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3096 | <code>    const supervisor = ensureAgentRuntimeSupervisor();</code> | 声明局部标识符 `supervisor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3097 | <code>    const status = {</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3098 | <code>        ...gateway.getStatus(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3099 | <code>        selectedBackendMode: resolveDesktopBackendMode()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3100 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3102 | <code>    status.managedRuntime = supervisor.getStatus();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3103 | <code>    status.toolSurface = getAgentToolSurfaceSummary();</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3104 | <code>    status.toolSurfaceValidation = validateAgentToolSurface().summary;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3105 | <code>    status.humanGateway = ensureAILISGateway().getStatus();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3107 | <code>    return status;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3108 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3110 | <code>async function syncAgentRuntimeSelection({ ensureReady = false } = {}) {</code> | 定义函数 `syncAgentRuntimeSelection`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3111 | <code>    const gatewayUrl = resolveAgentRuntimeGatewayUrl();</code> | 声明局部标识符 `gatewayUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3112 | <code>    const backendMode = resolveDesktopBackendMode();</code> | 声明局部标识符 `backendMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3113 | <code>    const supervisor = ensureAgentRuntimeSupervisor();</code> | 声明局部标识符 `supervisor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3115 | <code>    supervisor.configure({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3116 | <code>        gatewayUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3117 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3119 | <code>    const currentGatewayUrl = assistantGateway?.getStatus?.()?.gatewayCandidates?.[0] &#124;&#124; '';</code> | 声明局部标识符 `currentGatewayUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3120 | <code>    if (assistantGateway &amp;&amp; currentGatewayUrl !== gatewayUrl) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3121 | <code>        await resetAssistantBridge();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3122 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3124 | <code>    const gateway = ensureAssistantGateway();</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3126 | <code>    broadcastAssistantEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3127 | <code>        type: 'status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3128 | <code>        payload: gateway.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3129 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3130 | <code>    broadcastAssistantEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3131 | <code>        type: 'operator.runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3132 | <code>        payload: supervisor.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3133 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3135 | <code>    if (backendMode !== 'openclaw') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3136 | <code>        if (assistantGateway) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3137 | <code>            await resetAssistantBridge();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3138 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3139 | <code>        await supervisor.shutdown().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3140 | <code>        broadcastAssistantEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3141 | <code>            type: 'status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3142 | <code>            payload: ensureAssistantGateway().getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3143 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3144 | <code>        broadcastAssistantEvent({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3145 | <code>            type: 'operator.runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3146 | <code>            payload: supervisor.getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3147 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3148 | <code>        return getAssistantStatusSnapshot();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3149 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3151 | <code>    if (ensureReady) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3152 | <code>        await supervisor.ensureReady();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3153 | <code>        await gateway.ensureConnected();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3154 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3156 | <code>    return getAssistantStatusSnapshot();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3157 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3159 | <code>function getRendererPreferences() {</code> | 定义函数 `getRendererPreferences`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3160 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3161 | <code>        petSkipTaskbar: Boolean(desktopState?.preferences?.petSkipTaskbar),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3162 | <code>        petScale: normalizePetScale(desktopState?.preferences?.petScale &#124;&#124; DEFAULT_PET_SCALE),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3163 | <code>        speechMode: normalizeSpeechMode(desktopState?.preferences?.speechMode),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3164 | <code>        recognitionMode: normalizeRecognitionMode(desktopState?.preferences?.recognitionMode),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3165 | <code>        conversationMode: normalizeConversationMode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3166 | <code>            desktopState?.preferences?.conversationMode &#124;&#124; DEFAULT_CONVERSATION_MODE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3167 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3168 | <code>        uiLanguage: getCurrentUiLanguage(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3169 | <code>        preferredMicDeviceId: normalizePreferredMicDeviceId(desktopState?.preferences?.preferredMicDeviceId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3170 | <code>        backendBaseUrl: resolveDesktopBackendBaseUrl(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3171 | <code>        backendMode: resolveDesktopBackendMode(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3172 | <code>        agentRuntimeGatewayUrl: resolveAgentRuntimeGatewayUrl(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3173 | <code>        openclawGatewayUrl: resolveAgentRuntimeGatewayUrl(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3174 | <code>        ailisStateDir: normalizeAILISStateDir(desktopState?.preferences?.ailisStateDir),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3175 | <code>        ailisResolvedStateDir: getPersistedAILISStateDir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3176 | <code>        ailisDefaultStateDir: getDefaultAILISStateDir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3177 | <code>        voiceRuntimeRoot: normalizeVoiceRuntimeRoot(desktopState?.preferences?.voiceRuntimeRoot),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3178 | <code>        voiceRuntimeResolvedRoot: getPersistedVoiceRuntimeRoot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3179 | <code>        voiceRuntimeDefaultRoot: getDefaultVoiceRuntimeRoot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3180 | <code>        characterAssets: getAssetPackRuntime().getSnapshot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3181 | <code>        ...getRendererLlmPreferences(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3182 | <code>        ...getRendererOllamaTargetPreferences(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3183 | <code>        ...getRendererElevenLabsPreferences(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3184 | <code>        computerControlEnabled: getPersistedComputerControlEnabled(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3185 | <code>        emberHarnessMode: normalizeEmberHarnessMode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3186 | <code>            desktopState?.preferences?.emberHarnessMode &#124;&#124; DEFAULT_EMBER_HARNESS_MODE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3187 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3188 | <code>        emailProfiles: getRendererEmailProfiles(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3189 | <code>        cameraDistance: normalizeCameraDistance(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3190 | <code>            desktopState?.preferences?.cameraDistance &#124;&#124; DEFAULT_CAMERA_DISTANCE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3191 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3192 | <code>        cameraHeight: normalizeCameraHeight(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3193 | <code>            desktopState?.preferences?.cameraHeight &#124;&#124; DEFAULT_CAMERA_HEIGHT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3194 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3195 | <code>        cameraTargetY: normalizeCameraTargetY(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3196 | <code>            desktopState?.preferences?.cameraTargetY &#124;&#124; DEFAULT_CAMERA_TARGET_Y</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3197 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3198 | <code>        renderProfileId: normalizeRenderProfileId(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3199 | <code>            desktopState?.preferences?.renderProfileId &#124;&#124; DEFAULT_RENDER_PROFILE_ID</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3200 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3201 | <code>        renderLightYawDeg: normalizeRenderLightYawDeg(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3202 | <code>            desktopState?.preferences?.renderLightYawDeg ?? DEFAULT_RENDER_LIGHT_YAW_DEG</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3203 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3204 | <code>        renderKeyLightScale: normalizeRenderKeyLightScale(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3205 | <code>            desktopState?.preferences?.renderKeyLightScale ?? DEFAULT_RENDER_KEY_LIGHT_SCALE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3206 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3207 | <code>        renderAmbientFillScale: normalizeRenderAmbientFillScale(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3208 | <code>            desktopState?.preferences?.renderAmbientFillScale ?? DEFAULT_RENDER_AMBIENT_FILL_SCALE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3209 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3210 | <code>        renderOutlineScale: normalizeRenderOutlineScale(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3211 | <code>            desktopState?.preferences?.renderOutlineScale ?? DEFAULT_RENDER_OUTLINE_SCALE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3212 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3213 | <code>        renderShadowEnabled: normalizeRenderShadowEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3214 | <code>            desktopState?.preferences?.renderShadowEnabled ?? DEFAULT_RENDER_SHADOW_ENABLED</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3215 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3216 | <code>        renderResolutionScale: normalizeRenderResolutionScale(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3217 | <code>            desktopState?.preferences?.renderResolutionScale ?? DEFAULT_RENDER_RESOLUTION_SCALE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3218 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3219 | <code>        renderFpsLimit: normalizeRenderFpsLimit(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3220 | <code>            desktopState?.preferences?.renderFpsLimit ?? DEFAULT_RENDER_FPS_LIMIT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3221 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3222 | <code>        renderShadowQuality: normalizeRenderShadowQuality(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3223 | <code>            desktopState?.preferences?.renderShadowQuality ?? DEFAULT_RENDER_SHADOW_QUALITY</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3224 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3225 | <code>        renderOutlineEnabled: normalizeRenderOutlineEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3226 | <code>            desktopState?.preferences?.renderOutlineEnabled ?? DEFAULT_RENDER_OUTLINE_ENABLED</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3227 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3228 | <code>        renderAntialiasEnabled: normalizeRenderAntialiasEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3229 | <code>            desktopState?.preferences?.renderAntialiasEnabled ?? DEFAULT_RENDER_ANTIALIAS_ENABLED</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3230 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3231 | <code>        desktopNativeTtsRate: normalizeDesktopNativeTTSRate(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3232 | <code>            desktopState?.preferences?.desktopNativeTtsRate &#124;&#124; DEFAULT_DESKTOP_NATIVE_TTS_RATE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3233 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3234 | <code>        desktopNativeTtsPitch: normalizeDesktopNativeTTSPitch(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3235 | <code>            desktopState?.preferences?.desktopNativeTtsPitch &#124;&#124; DEFAULT_DESKTOP_NATIVE_TTS_PITCH</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3236 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3237 | <code>        desktopNativeTtsVolume: normalizeDesktopNativeTTSVolume(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3238 | <code>            desktopState?.preferences?.desktopNativeTtsVolume &#124;&#124; DEFAULT_DESKTOP_NATIVE_TTS_VOLUME</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3239 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3240 | <code>        chunkedTtsEnabled: normalizeChunkedTtsEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3241 | <code>            desktopState?.preferences?.chunkedTtsEnabled ?? DEFAULT_CHUNKED_TTS_ENABLED</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3242 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3243 | <code>        autoChatMode: normalizeAutoChatMode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3244 | <code>            desktopState?.preferences?.autoChatMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3245 | <code>            desktopState?.preferences?.autoChatEnabled ?? DEFAULT_AUTO_CHAT_ENABLED</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3246 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3247 | <code>        autoChatEnabled: ['companion', 'cowork'].includes(normalizeAutoChatMode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3248 | <code>            desktopState?.preferences?.autoChatMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3249 | <code>            desktopState?.preferences?.autoChatEnabled ?? DEFAULT_AUTO_CHAT_ENABLED</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3250 | <code>        )),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3251 | <code>        autoChatMinIntervalSec: normalizeAutoChatMinIntervalSec(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3252 | <code>            desktopState?.preferences?.autoChatMinIntervalSec &#124;&#124; DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3253 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3254 | <code>        autoChatMaxIntervalSec: normalizeAutoChatMaxIntervalSec(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3255 | <code>            desktopState?.preferences?.autoChatMaxIntervalSec &#124;&#124; DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3256 | <code>            normalizeAutoChatMinIntervalSec(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3257 | <code>                desktopState?.preferences?.autoChatMinIntervalSec &#124;&#124; DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3258 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3259 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3260 | <code>        avatarDialogueBubbleLeft: normalizeAvatarDialogueBubbleLeft(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3261 | <code>            desktopState?.preferences?.avatarDialogueBubbleLeft</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3262 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3263 | <code>        avatarDialogueBubbleTop: normalizeAvatarDialogueBubbleTop(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3264 | <code>            desktopState?.preferences?.avatarDialogueBubbleTop</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3265 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3266 | <code>        avatarDialogueBubbleScale: normalizeAvatarDialogueBubbleScale(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3267 | <code>            desktopState?.preferences?.avatarDialogueBubbleScale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3268 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3269 | <code>        avatarDialogueBubbleExtraWidth: normalizeAvatarDialogueBubbleExtraWidth(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3270 | <code>            desktopState?.preferences?.avatarDialogueBubbleExtraWidth</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3271 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3272 | <code>        avatarDialogueBubbleExtraTop: normalizeAvatarDialogueBubbleExtraTop(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3273 | <code>            desktopState?.preferences?.avatarDialogueBubbleExtraTop</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3274 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3275 | <code>        petMouseHitTestEnabled: normalizePetMouseHitTestEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3276 | <code>            desktopState?.preferences?.petMouseHitTestEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3277 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3278 | <code>        petMouseHitTestShape: normalizePetMouseHitTestShape(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3279 | <code>            desktopState?.preferences?.petMouseHitTestShape</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3280 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3281 | <code>        petMouseHitTestWidthRatio: normalizePetMouseHitTestWidthRatio(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3282 | <code>            desktopState?.preferences?.petMouseHitTestWidthRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3283 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3284 | <code>        petMouseHitTestHeightRatio: normalizePetMouseHitTestHeightRatio(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3285 | <code>            desktopState?.preferences?.petMouseHitTestHeightRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3286 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3287 | <code>        petMouseHitTestOffsetXRatio: normalizePetMouseHitTestOffsetXRatio(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3288 | <code>            desktopState?.preferences?.petMouseHitTestOffsetXRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3289 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3290 | <code>        petMouseHitTestOffsetYRatio: normalizePetMouseHitTestOffsetYRatio(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3291 | <code>            desktopState?.preferences?.petMouseHitTestOffsetYRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3292 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3293 | <code>        petMouseHitTestDebug: normalizePetMouseHitTestDebug(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3294 | <code>            desktopState?.preferences?.petMouseHitTestDebug</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3295 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3296 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3297 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3299 | <code>function getControlPanelState() {</code> | 定义函数 `getControlPanelState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3300 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3301 | <code>        preferences: getRendererPreferences(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3302 | <code>        options: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3303 | <code>            petScaleOptions: PET_SCALE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3304 | <code>            speechModeOptions: SPEECH_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3305 | <code>            recognitionModeOptions: RECOGNITION_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3306 | <code>            conversationModeOptions: CONVERSATION_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3307 | <code>            uiLanguageOptions: UI_LANGUAGE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3308 | <code>            backendModeOptions: BACKEND_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3309 | <code>            llmProviderOptions: LLM_PROVIDER_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3310 | <code>            llmProviderDefaultBaseUrls: LLM_PROVIDER_DEFAULT_BASE_URLS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3311 | <code>            llmProviderDefaultModels: LLM_PROVIDER_DEFAULT_MODELS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3312 | <code>            llmProviderCapabilities: Object.fromEntries(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3313 | <code>                LLM_PROVIDER_OPTIONS.map((provider) =&gt; [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3314 | <code>                    provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3315 | <code>                    getProviderCapabilities({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3316 | <code>                        provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3317 | <code>                        model: getDefaultProviderModel(provider)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3318 | <code>                    })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3319 | <code>                ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3320 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3321 | <code>            renderProfileOptions: RENDER_PROFILE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3322 | <code>            emberHarnessModeOptions: EMBER_HARNESS_MODE_OPTIONS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3323 | <code>            emailProviderOptions: EMAIL_PROVIDER_OPTIONS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3324 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3325 | <code>        environment: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3326 | <code>            version: app.getVersion(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3327 | <code>            isPackaged: app.isPackaged,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3328 | <code>            userDataPath: app.getPath('userData'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3329 | <code>            projectRoot: getProjectRoot()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3330 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3331 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3332 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3333 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3334 | <code>function broadcastPreferencesUpdated() {</code> | 定义函数 `broadcastPreferencesUpdated`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3335 | <code>    const payload = {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3336 | <code>        preferences: getRendererPreferences()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3337 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3339 | <code>    petWindow?.webContents.send('ailis:preferences-updated', payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3340 | <code>    chatWindow?.webContents.send('ailis:preferences-updated', payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3341 | <code>    controlWindow?.webContents.send('ailis:preferences-updated', payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3342 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3344 | <code>function getWindowMinimumSize(key) {</code> | 定义函数 `getWindowMinimumSize`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3345 | <code>    if (key === 'petWindow') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3346 | <code>        return PET_MIN_SIZE;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3347 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3348 | <code>    if (key === 'controlWindow') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3349 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3350 | <code>            width: CONTROL_MIN_WIDTH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3351 | <code>            height: CONTROL_MIN_HEIGHT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3352 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3353 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3355 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3356 | <code>        width: CHAT_MIN_WIDTH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3357 | <code>        height: CHAT_MIN_HEIGHT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3358 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3359 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3360 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3361 | <code>function updateWindowState(key, window, options = {}) {</code> | 定义函数 `updateWindowState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3362 | <code>    if (!window &#124;&#124; !desktopState?.[key]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3363 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3364 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3366 | <code>    const minimumSize = getWindowMinimumSize(key);</code> | 声明局部标识符 `minimumSize`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3367 | <code>    if (key === 'petWindow' &amp;&amp; (petDialogueExpanded &#124;&#124; petDialogueBoundsMutation)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3368 | <code>        if (petDialogueCollapsedBounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3369 | <code>            desktopState[key].bounds = clampBoundsToDisplay(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3370 | <code>                petDialogueCollapsedBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3371 | <code>                minimumSize.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3372 | <code>                minimumSize.height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3373 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3374 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3375 | <code>        desktopState[key].visible = window.isVisible();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3376 | <code>        if (options.immediate) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3377 | <code>            persistDesktopState();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3378 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3379 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3380 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3381 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3382 | <code>    desktopState[key].bounds = clampBoundsToDisplay(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3383 | <code>        window.getBounds(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3384 | <code>        minimumSize.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3385 | <code>        minimumSize.height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3386 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3387 | <code>    desktopState[key].visible = window.isVisible();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3389 | <code>    if (options.immediate) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3390 | <code>        persistDesktopState();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3391 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3392 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3394 | <code>    clearTimeout(windowPersistTimers.get(key));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3395 | <code>    windowPersistTimers.set(key, setTimeout(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3396 | <code>        persistDesktopState();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3397 | <code>        windowPersistTimers.delete(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3398 | <code>    }, 120));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3399 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3400 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3401 | <code>function hookWindowPersistence(key, window) {</code> | 定义函数 `hookWindowPersistence`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3402 | <code>    window.on('move', () =&gt; updateWindowState(key, window));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 3403 | <code>    window.on('resize', () =&gt; updateWindowState(key, window));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 3404 | <code>    window.on('show', () =&gt; updateWindowState(key, window, { immediate: true }));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 3405 | <code>    window.on('hide', () =&gt; updateWindowState(key, window, { immediate: true }));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 3406 | <code>    window.on('closed', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3407 | <code>        clearTimeout(windowPersistTimers.get(key));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3408 | <code>        windowPersistTimers.delete(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3409 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3410 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3412 | <code>function openExternalLinks(window) {</code> | 定义函数 `openExternalLinks`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3413 | <code>    window.webContents.setWindowOpenHandler(({ url }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3414 | <code>        void shell.openExternal(url);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3415 | <code>        return { action: 'deny' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3416 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3417 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3419 | <code>function hookRendererDiagnostics(window, label) {</code> | 定义函数 `hookRendererDiagnostics`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3420 | <code>    const webContents = window?.webContents;</code> | 声明局部标识符 `webContents`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3421 | <code>    if (!webContents &#124;&#124; webContents.__ailisDiagnosticsHooked) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3422 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3423 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3425 | <code>    webContents.__ailisDiagnosticsHooked = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3426 | <code>    webContents.on('console-message', (_event, level, message, line, sourceId) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3427 | <code>        console.log(`[renderer:${label}] console(${level}) ${message} (${sourceId &#124;&#124; 'unknown'}:${line &#124;&#124; 0})`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3428 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3429 | <code>    webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3430 | <code>        console.error(`[renderer:${label}] did-fail-load ${errorCode}: ${errorDescription} ${validatedURL &#124;&#124; ''}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3431 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3432 | <code>    webContents.on('render-process-gone', (_event, details = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3433 | <code>        console.error(`[renderer:${label}] render-process-gone`, details);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3434 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3435 | <code>    webContents.on('unresponsive', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3436 | <code>        console.error(`[renderer:${label}] unresponsive`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3437 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3438 | <code>    webContents.on('dom-ready', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3439 | <code>        console.log(`[renderer:${label}] dom-ready`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3440 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3441 | <code>    webContents.on('did-finish-load', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3442 | <code>        console.log(`[renderer:${label}] did-finish-load ${webContents.getURL()}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3443 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3444 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3445 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3446 | <code>function hookWindowContextMenu(window, label) {</code> | 定义函数 `hookWindowContextMenu`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3447 | <code>    const webContents = window?.webContents;</code> | 声明局部标识符 `webContents`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3448 | <code>    if (!webContents &#124;&#124; webContents.__ailisContextMenuHooked) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3449 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3450 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3451 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3452 | <code>    webContents.__ailisContextMenuHooked = true;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3453 | <code>    webContents.on('context-menu', (event, params = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3454 | <code>        const sourceWindow = BrowserWindow.fromWebContents(webContents) &#124;&#124; window;</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3455 | <code>        const inputFieldType = String(params.inputFieldType &#124;&#124; 'none');</code> | 声明局部标识符 `inputFieldType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3456 | <code>        const isEditable = Boolean(params.isEditable &#124;&#124; inputFieldType !== 'none');</code> | 声明局部标识符 `isEditable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3457 | <code>        const hasSelection = Boolean(String(params.selectionText &#124;&#124; '').trim());</code> | 声明局部标识符 `hasSelection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3459 | <code>        if (isEditable &#124;&#124; hasSelection) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3460 | <code>            event.preventDefault();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3461 | <code>            showTextEditMenu(sourceWindow, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3462 | <code>                isEditable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3463 | <code>                hasSelection,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3464 | <code>                editFlags: params.editFlags &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3465 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3466 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3467 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3469 | <code>        if (label === 'chat') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3470 | <code>            event.preventDefault();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3471 | <code>            showControlMenu(sourceWindow);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3472 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3473 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3474 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3475 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3476 | <code>function loadWindowContent(window, pageName) {</code> | 定义函数 `loadWindowContent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3477 | <code>    if (isDevMode()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3478 | <code>        return window.loadURL(buildRendererUrl(pageName));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3479 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3480 | <code>    return window.loadURL(pathToFileURL(buildRendererUrl(pageName)).toString());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3481 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3482 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3483 | <code>function registerMediaPermissionHandlers() {</code> | 定义函数 `registerMediaPermissionHandlers`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3484 | <code>    const defaultSession = session.defaultSession;</code> | 声明局部标识符 `defaultSession`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3485 | <code>    if (!defaultSession) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3486 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3487 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3489 | <code>    defaultSession.setPermissionCheckHandler((_webContents, permission) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3490 | <code>        return permission === 'media';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3491 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3493 | <code>    defaultSession.setPermissionRequestHandler((_webContents, permission, callback, details) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3494 | <code>        const requestsAudio = Array.isArray(details?.mediaTypes) &amp;&amp; details.mediaTypes.includes('audio');</code> | 声明局部标识符 `requestsAudio`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3495 | <code>        callback(permission === 'media' &amp;&amp; requestsAudio);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 3496 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3497 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3498 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3499 | <code>function showChatWindow() {</code> | 定义函数 `showChatWindow`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3500 | <code>    if (!chatWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3501 | <code>        createChatWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3502 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3504 | <code>    if (!chatWindow.isVisible()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3505 | <code>        chatWindow.show();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3506 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3508 | <code>    chatWindow.focus();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3509 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3510 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3511 | <code>function hideChatWindow() {</code> | 定义函数 `hideChatWindow`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3512 | <code>    if (chatWindow?.isVisible()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3513 | <code>        chatWindow.hide();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3514 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3515 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3517 | <code>function toggleChatWindow() {</code> | 定义函数 `toggleChatWindow`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3518 | <code>    if (!chatWindow &#124;&#124; !chatWindow.isVisible()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3519 | <code>        showChatWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3520 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3521 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3522 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3523 | <code>    hideChatWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3524 | <code>    return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3525 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3526 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3527 | <code>function showControlPanel() {</code> | 定义函数 `showControlPanel`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3528 | <code>    if (!controlWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3529 | <code>        createControlWindow({ showWhenReady: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3530 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3531 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3532 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3533 | <code>    controlWindow.__ailisShowWhenReady = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3534 | <code>    const isControlLoaded = Boolean(controlWindow.__ailisDidFinishLoad);</code> | 声明局部标识符 `isControlLoaded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3535 | <code>    if (!controlWindow.isVisible()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3536 | <code>        controlWindow.show();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3537 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3539 | <code>    controlWindow.focus();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3540 | <code>    if (!isControlLoaded) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3541 | <code>        controlWindowLoadPromise?.then(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3542 | <code>            if (!controlWindow &#124;&#124; controlWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3543 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3544 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3545 | <code>            if (controlWindow.__ailisShowWhenReady &amp;&amp; !controlWindow.isVisible()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3546 | <code>                controlWindow.show();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3547 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3548 | <code>        }).catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3549 | <code>            console.error('[window] 控制面板延迟显示失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3550 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3551 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3552 | <code>    return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3553 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3554 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3555 | <code>function showAgentLabWindow() {</code> | 定义函数 `showAgentLabWindow`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3556 | <code>    if (!agentLabWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3557 | <code>        createAgentLabWindow({ showWhenReady: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3558 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3559 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3560 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3561 | <code>    agentLabWindow.__ailisShowWhenReady = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3562 | <code>    const isLoaded = Boolean(agentLabWindow.__ailisDidFinishLoad);</code> | 声明局部标识符 `isLoaded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3563 | <code>    if (!agentLabWindow.isVisible() &amp;&amp; isLoaded) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3564 | <code>        agentLabWindow.show();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3565 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3567 | <code>    if (isLoaded) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3568 | <code>        agentLabWindow.focus();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3569 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3570 | <code>        agentLabWindowLoadPromise?.then(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3571 | <code>            if (!agentLabWindow &#124;&#124; agentLabWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3572 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3573 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3574 | <code>            if (agentLabWindow.__ailisShowWhenReady &amp;&amp; !agentLabWindow.isVisible()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3575 | <code>                agentLabWindow.show();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3576 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3577 | <code>            agentLabWindow.focus();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3578 | <code>        }).catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3579 | <code>            console.error('[window] Agent 分析台延迟显示失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3580 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3581 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3582 | <code>    return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3583 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3584 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3585 | <code>function quitApplication() {</code> | 定义函数 `quitApplication`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3586 | <code>    isQuitting = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3587 | <code>    app.quit();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3588 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3589 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3590 | <code>function getWindowFromIpcEvent(event) {</code> | 定义函数 `getWindowFromIpcEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3591 | <code>    return BrowserWindow.fromWebContents(event.sender);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3592 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3593 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3594 | <code>function getWindowControlState(window) {</code> | 定义函数 `getWindowControlState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3595 | <code>    if (!window &#124;&#124; window.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3596 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3597 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3598 | <code>            isMaximized: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3599 | <code>            isMinimized: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3600 | <code>            isFullScreen: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3601 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3602 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3603 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3604 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3605 | <code>        isMaximized: window.isMaximized(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3606 | <code>        isMinimized: window.isMinimized(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3607 | <code>        isFullScreen: window.isFullScreen()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3608 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3609 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3610 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3611 | <code>function minimizeWindowFromEvent(event) {</code> | 定义函数 `minimizeWindowFromEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3612 | <code>    const sourceWindow = getWindowFromIpcEvent(event);</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3613 | <code>    if (!sourceWindow &#124;&#124; sourceWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3614 | <code>        return getWindowControlState(sourceWindow);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3615 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3616 | <code>    sourceWindow.minimize();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3617 | <code>    return getWindowControlState(sourceWindow);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3618 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3619 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3620 | <code>function toggleMaximizeWindowFromEvent(event) {</code> | 定义函数 `toggleMaximizeWindowFromEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3621 | <code>    const sourceWindow = getWindowFromIpcEvent(event);</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3622 | <code>    if (!sourceWindow &#124;&#124; sourceWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3623 | <code>        return getWindowControlState(sourceWindow);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3624 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3625 | <code>    if (sourceWindow.isMaximized()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3626 | <code>        sourceWindow.unmaximize();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3627 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3628 | <code>        sourceWindow.maximize();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3629 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3630 | <code>    return getWindowControlState(sourceWindow);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3631 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3632 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3633 | <code>function applyPreferencesPatch(partialPreferences = {}) {</code> | 定义函数 `applyPreferencesPatch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3634 | <code>    if (!desktopState?.preferences &#124;&#124; !partialPreferences &#124;&#124; typeof partialPreferences !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3635 | <code>        return getRendererPreferences();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3636 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3638 | <code>    const rendererPreferences = getRendererPreferences();</code> | 声明局部标识符 `rendererPreferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3639 | <code>    const currentLlmSettings = getPersistedLlmSettings();</code> | 声明局部标识符 `currentLlmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3640 | <code>    const currentElevenLabsSettings = getPersistedElevenLabsSettings();</code> | 声明局部标识符 `currentElevenLabsSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3641 | <code>    const nextPreferences = {</code> | 声明局部标识符 `nextPreferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3642 | <code>        petSkipTaskbar: rendererPreferences.petSkipTaskbar,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3643 | <code>        petScale: rendererPreferences.petScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3644 | <code>        speechMode: rendererPreferences.speechMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3645 | <code>        recognitionMode: rendererPreferences.recognitionMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3646 | <code>        conversationMode: rendererPreferences.conversationMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3647 | <code>        uiLanguage: rendererPreferences.uiLanguage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3648 | <code>        preferredMicDeviceId: rendererPreferences.preferredMicDeviceId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3649 | <code>        backendBaseUrl: resolveDesktopBackendBaseUrl(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3650 | <code>        backendMode: rendererPreferences.backendMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3651 | <code>        agentRuntimeGatewayUrl: rendererPreferences.agentRuntimeGatewayUrl &#124;&#124; rendererPreferences.openclawGatewayUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3652 | <code>        openclawGatewayUrl: rendererPreferences.openclawGatewayUrl &#124;&#124; rendererPreferences.agentRuntimeGatewayUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3653 | <code>        ailisStateDir: rendererPreferences.ailisStateDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3654 | <code>        voiceRuntimeRoot: rendererPreferences.voiceRuntimeRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3655 | <code>        llmProvider: currentLlmSettings.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3656 | <code>        llmBaseUrl: currentLlmSettings.baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3657 | <code>        llmModel: currentLlmSettings.model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3658 | <code>        ...getRendererOllamaTargetPreferences(rendererPreferences),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3659 | <code>        llmApiKey: currentLlmSettings.apiKey,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3660 | <code>        llmApiKeyProfiles: getPersistedLlmApiKeyProfiles(),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3661 | <code>        llmTemperature: currentLlmSettings.temperature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3662 | <code>        llmRequestTimeoutMs: currentLlmSettings.timeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3663 | <code>        elevenLabsApiBase: currentElevenLabsSettings.apiBase,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3664 | <code>        elevenLabsApiKey: currentElevenLabsSettings.apiKey,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3665 | <code>        elevenLabsVoiceId: currentElevenLabsSettings.voiceId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3666 | <code>        elevenLabsModelId: currentElevenLabsSettings.modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3667 | <code>        elevenLabsLanguageCode: currentElevenLabsSettings.languageCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3668 | <code>        elevenLabsOutputFormat: currentElevenLabsSettings.outputFormat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3669 | <code>        elevenLabsTimeoutMs: currentElevenLabsSettings.timeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3670 | <code>        elevenLabsOptimizeStreamingLatency: currentElevenLabsSettings.optimizeStreamingLatency,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3671 | <code>        elevenLabsStability: currentElevenLabsSettings.stability,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3672 | <code>        elevenLabsSimilarityBoost: currentElevenLabsSettings.similarityBoost,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3673 | <code>        elevenLabsStyle: currentElevenLabsSettings.style,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3674 | <code>        elevenLabsSpeed: currentElevenLabsSettings.speed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3675 | <code>        elevenLabsUseSpeakerBoost: currentElevenLabsSettings.useSpeakerBoost,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3676 | <code>        elevenLabsVoiceProfiles: currentElevenLabsSettings.voiceProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3677 | <code>        computerControlEnabled: rendererPreferences.computerControlEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3678 | <code>        emberHarnessMode: rendererPreferences.emberHarnessMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3679 | <code>        emailProfiles: getPersistedEmailProfiles(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3680 | <code>        cameraDistance: rendererPreferences.cameraDistance,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3681 | <code>        cameraHeight: rendererPreferences.cameraHeight,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3682 | <code>        cameraTargetY: rendererPreferences.cameraTargetY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3683 | <code>        renderProfileId: rendererPreferences.renderProfileId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3684 | <code>        desktopNativeTtsRate: rendererPreferences.desktopNativeTtsRate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3685 | <code>        desktopNativeTtsPitch: rendererPreferences.desktopNativeTtsPitch,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3686 | <code>        desktopNativeTtsVolume: rendererPreferences.desktopNativeTtsVolume,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3687 | <code>        chunkedTtsEnabled: rendererPreferences.chunkedTtsEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3688 | <code>        autoChatMode: rendererPreferences.autoChatMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3689 | <code>        autoChatEnabled: rendererPreferences.autoChatEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3690 | <code>        autoChatMinIntervalSec: rendererPreferences.autoChatMinIntervalSec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3691 | <code>        autoChatMaxIntervalSec: rendererPreferences.autoChatMaxIntervalSec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3692 | <code>        avatarDialogueBubbleLeft: rendererPreferences.avatarDialogueBubbleLeft,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3693 | <code>        avatarDialogueBubbleTop: rendererPreferences.avatarDialogueBubbleTop,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3694 | <code>        avatarDialogueBubbleScale: rendererPreferences.avatarDialogueBubbleScale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3695 | <code>        avatarDialogueBubbleExtraWidth: rendererPreferences.avatarDialogueBubbleExtraWidth,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3696 | <code>        avatarDialogueBubbleExtraTop: rendererPreferences.avatarDialogueBubbleExtraTop,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3697 | <code>        petMouseHitTestEnabled: rendererPreferences.petMouseHitTestEnabled,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3698 | <code>        petMouseHitTestShape: rendererPreferences.petMouseHitTestShape,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3699 | <code>        petMouseHitTestWidthRatio: rendererPreferences.petMouseHitTestWidthRatio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3700 | <code>        petMouseHitTestHeightRatio: rendererPreferences.petMouseHitTestHeightRatio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3701 | <code>        petMouseHitTestOffsetXRatio: rendererPreferences.petMouseHitTestOffsetXRatio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3702 | <code>        petMouseHitTestOffsetYRatio: rendererPreferences.petMouseHitTestOffsetYRatio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3703 | <code>        petMouseHitTestDebug: rendererPreferences.petMouseHitTestDebug</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3704 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3705 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3706 | <code>    if ('petSkipTaskbar' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3707 | <code>        nextPreferences.petSkipTaskbar = Boolean(partialPreferences.petSkipTaskbar);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3708 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3709 | <code>    if ('petScale' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3710 | <code>        nextPreferences.petScale = normalizePetScale(partialPreferences.petScale);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3711 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3712 | <code>    if ('speechMode' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3713 | <code>        nextPreferences.speechMode = normalizeSpeechMode(partialPreferences.speechMode);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3714 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3715 | <code>    if ('recognitionMode' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3716 | <code>        nextPreferences.recognitionMode = normalizeRecognitionMode(partialPreferences.recognitionMode);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 3717 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3718 | <code>    if ('conversationMode' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3719 | <code>        nextPreferences.conversationMode = normalizeConversationMode(partialPreferences.conversationMode);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 3720 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3721 | <code>    if ('uiLanguage' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3722 | <code>        nextPreferences.uiLanguage = normalizeUiLanguage(partialPreferences.uiLanguage);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3723 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3724 | <code>    if ('preferredMicDeviceId' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3725 | <code>        nextPreferences.preferredMicDeviceId = normalizePreferredMicDeviceId(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3726 | <code>            partialPreferences.preferredMicDeviceId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3727 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3728 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3729 | <code>    nextPreferences.backendBaseUrl = resolveDesktopBackendBaseUrl();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3730 | <code>    if ('backendMode' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3731 | <code>        nextPreferences.backendMode = normalizeBackendMode(partialPreferences.backendMode);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3732 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3733 | <code>    if ('agentRuntimeGatewayUrl' in partialPreferences &#124;&#124; 'openclawGatewayUrl' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3734 | <code>        const gatewayUrl = normalizeAgentRuntimeGatewayUrl(</code> | 声明局部标识符 `gatewayUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3735 | <code>            partialPreferences.agentRuntimeGatewayUrl &#124;&#124; partialPreferences.openclawGatewayUrl</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3736 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3737 | <code>        nextPreferences.agentRuntimeGatewayUrl = gatewayUrl;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3738 | <code>        nextPreferences.openclawGatewayUrl = gatewayUrl;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3739 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3740 | <code>    if ('ailisStateDir' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3741 | <code>        nextPreferences.ailisStateDir = normalizeAILISStateDir(partialPreferences.ailisStateDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3742 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3743 | <code>    if ('voiceRuntimeRoot' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3744 | <code>        nextPreferences.voiceRuntimeRoot = normalizeVoiceRuntimeRoot(partialPreferences.voiceRuntimeRoot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3745 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3746 | <code>    if ('llmProvider' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3747 | <code>        nextPreferences.llmProvider = normalizeLlmProvider(partialPreferences.llmProvider);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3748 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3749 | <code>    if ('llmBaseUrl' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3750 | <code>        nextPreferences.llmBaseUrl = normalizeLlmBaseUrl(partialPreferences.llmBaseUrl);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3751 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3752 | <code>    if ('llmModel' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3753 | <code>        nextPreferences.llmModel = normalizeLlmModel(partialPreferences.llmModel);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3754 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3755 | <code>    if ('ollamaTarget' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3756 | <code>        const target = normalizeOllamaTarget({</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3757 | <code>            target: partialPreferences.ollamaTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3758 | <code>            modelId: nextPreferences.llmModel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3759 | <code>            localModelPath: nextPreferences.ollamaLocalModelPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3760 | <code>            ollamaDeploymentMode: nextPreferences.ollamaDeploymentMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3761 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3762 | <code>        nextPreferences.ollamaTarget = target;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3763 | <code>        nextPreferences.ollamaDeploymentMode = ollamaSourceToLegacyMode(target.source);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3764 | <code>        nextPreferences.ollamaLocalModelPath = target.localPath &#124;&#124; nextPreferences.ollamaLocalModelPath &#124;&#124; '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3765 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3766 | <code>    if ('ollamaDeploymentMode' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3767 | <code>        const target = normalizeOllamaTarget({</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3768 | <code>            target: nextPreferences.ollamaTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3769 | <code>            ollamaDeploymentMode: partialPreferences.ollamaDeploymentMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3770 | <code>            modelId: nextPreferences.llmModel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3771 | <code>            localModelPath: nextPreferences.ollamaLocalModelPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3772 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3773 | <code>        nextPreferences.ollamaTarget = target;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3774 | <code>        nextPreferences.ollamaDeploymentMode = ollamaSourceToLegacyMode(target.source);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3775 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3776 | <code>    if ('ollamaLocalModelPath' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3777 | <code>        nextPreferences.ollamaLocalModelPath = String(partialPreferences.ollamaLocalModelPath &#124;&#124; '').trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3778 | <code>        nextPreferences.ollamaTarget = normalizeOllamaTarget({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3779 | <code>            target: nextPreferences.ollamaTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3780 | <code>            modelId: nextPreferences.llmModel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3781 | <code>            localModelPath: nextPreferences.ollamaLocalModelPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3782 | <code>            ollamaDeploymentMode: nextPreferences.ollamaDeploymentMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3783 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3784 | <code>        nextPreferences.ollamaDeploymentMode = ollamaSourceToLegacyMode(nextPreferences.ollamaTarget.source);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3785 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3786 | <code>    if ('ollamaInstalledModels' in partialPreferences &amp;&amp; Array.isArray(partialPreferences.ollamaInstalledModels)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3787 | <code>        nextPreferences.ollamaInstalledModels = partialPreferences.ollamaInstalledModels</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3788 | <code>            .map((model) =&gt; String(model &#124;&#124; '').trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3789 | <code>            .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3790 | <code>            .slice(0, 80);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3791 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3792 | <code>    if ('ollamaUsedModels' in partialPreferences &amp;&amp; Array.isArray(partialPreferences.ollamaUsedModels)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3793 | <code>        nextPreferences.ollamaUsedModels = partialPreferences.ollamaUsedModels</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3794 | <code>            .map((model) =&gt; String(model &#124;&#124; '').trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3795 | <code>            .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3796 | <code>            .slice(0, 80);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3797 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3798 | <code>    if ('llmApiKeySelectedId' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3799 | <code>        nextPreferences.llmApiKeyProfiles = selectLlmApiKeyProfile(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3800 | <code>            nextPreferences.llmApiKeyProfiles,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3801 | <code>            nextPreferences.llmProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3802 | <code>            partialPreferences.llmApiKeySelectedId</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3803 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3804 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3805 | <code>    if ('llmApiKey' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3806 | <code>        const nextApiKey = normalizeLlmApiKey(partialPreferences.llmApiKey);</code> | 声明局部标识符 `nextApiKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3807 | <code>        if (nextApiKey) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3808 | <code>            nextPreferences.llmApiKeyProfiles = upsertLlmApiKeyProfile(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3809 | <code>                nextPreferences.llmApiKeyProfiles,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3810 | <code>                nextPreferences.llmProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3811 | <code>                nextApiKey,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3812 | <code>                partialPreferences.llmApiKeyLabel &#124;&#124; ''</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3813 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3814 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3815 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3816 | <code>    if (partialPreferences.llmApiKeyAction === 'clear') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3817 | <code>        nextPreferences.llmApiKey = '';</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3818 | <code>        nextPreferences.llmApiKeyProfiles = removeLlmApiKeyProfile(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3819 | <code>            nextPreferences.llmApiKeyProfiles,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3820 | <code>            nextPreferences.llmProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3821 | <code>            partialPreferences.llmApiKeySelectedId &#124;&#124; ''</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3822 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3823 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3824 | <code>    if ('llmProvider' in partialPreferences &#124;&#124;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3825 | <code>        'llmApiKeySelectedId' in partialPreferences &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3826 | <code>        'llmApiKey' in partialPreferences &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3827 | <code>        partialPreferences.llmApiKeyAction === 'clear') {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3828 | <code>        nextPreferences.llmApiKey = getActiveLlmApiKeyFromProfiles(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3829 | <code>            nextPreferences.llmApiKeyProfiles,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3830 | <code>            nextPreferences.llmProvider</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3831 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3832 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3833 | <code>    if ('llmTemperature' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3834 | <code>        nextPreferences.llmTemperature = normalizeLlmTemperature(partialPreferences.llmTemperature);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3835 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3836 | <code>    if ('llmRequestTimeoutMs' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3837 | <code>        nextPreferences.llmRequestTimeoutMs = normalizeLlmRequestTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3838 | <code>            partialPreferences.llmRequestTimeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3839 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3840 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3841 | <code>    if ('elevenLabsApiBase' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3842 | <code>        nextPreferences.elevenLabsApiBase = normalizeElevenLabsApiBase(partialPreferences.elevenLabsApiBase);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3843 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3844 | <code>    if ('elevenLabsVoiceId' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3845 | <code>        nextPreferences.elevenLabsVoiceId = normalizeElevenLabsVoiceId(partialPreferences.elevenLabsVoiceId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3846 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3847 | <code>    if ('elevenLabsModelId' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3848 | <code>        nextPreferences.elevenLabsModelId = normalizeElevenLabsModelId(partialPreferences.elevenLabsModelId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3849 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3850 | <code>    if ('elevenLabsLanguageCode' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3851 | <code>        nextPreferences.elevenLabsLanguageCode = normalizeElevenLabsLanguageCode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3852 | <code>            partialPreferences.elevenLabsLanguageCode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3853 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3854 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3855 | <code>    if ('elevenLabsOutputFormat' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3856 | <code>        nextPreferences.elevenLabsOutputFormat = normalizeElevenLabsOutputFormat(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3857 | <code>            partialPreferences.elevenLabsOutputFormat</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3858 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3859 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3860 | <code>    if ('elevenLabsTimeoutMs' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3861 | <code>        nextPreferences.elevenLabsTimeoutMs = normalizeElevenLabsTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3862 | <code>            partialPreferences.elevenLabsTimeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3863 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3864 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3865 | <code>    if ('elevenLabsOptimizeStreamingLatency' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3866 | <code>        nextPreferences.elevenLabsOptimizeStreamingLatency = normalizeElevenLabsOptimizeStreamingLatency(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3867 | <code>            partialPreferences.elevenLabsOptimizeStreamingLatency</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3868 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3869 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3870 | <code>    if ('elevenLabsStability' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3871 | <code>        nextPreferences.elevenLabsStability = normalizeElevenLabsStability(partialPreferences.elevenLabsStability);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3872 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3873 | <code>    if ('elevenLabsSimilarityBoost' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3874 | <code>        nextPreferences.elevenLabsSimilarityBoost = normalizeElevenLabsSimilarityBoost(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3875 | <code>            partialPreferences.elevenLabsSimilarityBoost</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3876 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3877 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3878 | <code>    if ('elevenLabsStyle' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3879 | <code>        nextPreferences.elevenLabsStyle = normalizeElevenLabsStyle(partialPreferences.elevenLabsStyle);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3880 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3881 | <code>    if ('elevenLabsSpeed' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3882 | <code>        nextPreferences.elevenLabsSpeed = normalizeElevenLabsSpeed(partialPreferences.elevenLabsSpeed);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3883 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3884 | <code>    if ('elevenLabsUseSpeakerBoost' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3885 | <code>        nextPreferences.elevenLabsUseSpeakerBoost = normalizeElevenLabsUseSpeakerBoost(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3886 | <code>            partialPreferences.elevenLabsUseSpeakerBoost</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3887 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3888 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3889 | <code>    if ('elevenLabsVoiceProfiles' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3890 | <code>        nextPreferences.elevenLabsVoiceProfiles = normalizeElevenLabsVoiceProfiles(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3891 | <code>            partialPreferences.elevenLabsVoiceProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3892 | <code>            nextPreferences</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3893 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3894 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3895 | <code>    if ('elevenLabsApiKey' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3896 | <code>        const nextApiKey = normalizeElevenLabsApiKey(partialPreferences.elevenLabsApiKey);</code> | 声明局部标识符 `nextApiKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3897 | <code>        if (nextApiKey) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3898 | <code>            nextPreferences.elevenLabsApiKey = nextApiKey;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3899 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3900 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3901 | <code>    if (partialPreferences.elevenLabsApiKeyAction === 'clear') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3902 | <code>        nextPreferences.elevenLabsApiKey = '';</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3903 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3904 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3905 | <code>        'elevenLabsVoiceId' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3906 | <code>        'elevenLabsModelId' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3907 | <code>        'elevenLabsLanguageCode' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3908 | <code>        'elevenLabsOutputFormat' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3909 | <code>        'elevenLabsOptimizeStreamingLatency' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3910 | <code>        'elevenLabsStability' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3911 | <code>        'elevenLabsSimilarityBoost' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3912 | <code>        'elevenLabsStyle' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3913 | <code>        'elevenLabsSpeed' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3914 | <code>        'elevenLabsUseSpeakerBoost' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3915 | <code>        'elevenLabsVoiceProfiles' in partialPreferences</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3916 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3917 | <code>        const activeLanguageCode = normalizeElevenLabsLanguageCode(nextPreferences.elevenLabsLanguageCode);</code> | 声明局部标识符 `activeLanguageCode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3918 | <code>        const nextProfiles = normalizeElevenLabsVoiceProfiles(nextPreferences.elevenLabsVoiceProfiles, nextPreferences);</code> | 声明局部标识符 `nextProfiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3919 | <code>        nextProfiles[activeLanguageCode] = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3920 | <code>            ...nextProfiles[activeLanguageCode],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3921 | <code>            voiceId: normalizeElevenLabsVoiceId(nextPreferences.elevenLabsVoiceId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3922 | <code>            modelId: normalizeElevenLabsModelId(nextPreferences.elevenLabsModelId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3923 | <code>            languageCode: activeLanguageCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3924 | <code>            outputFormat: normalizeElevenLabsOutputFormat(nextPreferences.elevenLabsOutputFormat),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3925 | <code>            optimizeStreamingLatency: normalizeElevenLabsOptimizeStreamingLatency(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3926 | <code>                nextPreferences.elevenLabsOptimizeStreamingLatency</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3927 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3928 | <code>            stability: normalizeElevenLabsStability(nextPreferences.elevenLabsStability),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3929 | <code>            similarityBoost: normalizeElevenLabsSimilarityBoost(nextPreferences.elevenLabsSimilarityBoost),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3930 | <code>            style: normalizeElevenLabsStyle(nextPreferences.elevenLabsStyle),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3931 | <code>            speed: normalizeElevenLabsSpeed(nextPreferences.elevenLabsSpeed),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3932 | <code>            useSpeakerBoost: normalizeElevenLabsUseSpeakerBoost(nextPreferences.elevenLabsUseSpeakerBoost)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3933 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3934 | <code>        nextPreferences.elevenLabsVoiceProfiles = normalizeElevenLabsVoiceProfiles(nextProfiles, nextPreferences);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3935 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3936 | <code>    if ('computerControlEnabled' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3937 | <code>        nextPreferences.computerControlEnabled = normalizeComputerControlEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3938 | <code>            partialPreferences.computerControlEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3939 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3940 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3941 | <code>    if ('emberHarnessMode' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3942 | <code>        nextPreferences.emberHarnessMode = normalizeEmberHarnessMode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3943 | <code>            partialPreferences.emberHarnessMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3944 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3945 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3946 | <code>    if (partialPreferences.emailProfiles &amp;&amp; typeof partialPreferences.emailProfiles === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3947 | <code>        const currentProfiles = getPersistedEmailProfiles();</code> | 声明局部标识符 `currentProfiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3948 | <code>        const incomingProfiles = partialPreferences.emailProfiles;</code> | 声明局部标识符 `incomingProfiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3949 | <code>        for (const providerId of EMAIL_PROVIDER_OPTIONS) {</code> | 声明局部标识符 `providerId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3950 | <code>            const incoming = incomingProfiles[providerId];</code> | 声明局部标识符 `incoming`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3951 | <code>            if (!incoming &#124;&#124; typeof incoming !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3952 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3953 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3954 | <code>            const currentProfile = currentProfiles[providerId] &#124;&#124; {};</code> | 声明局部标识符 `currentProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3955 | <code>            const nextProfile = {</code> | 声明局部标识符 `nextProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3956 | <code>                ...currentProfile,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3957 | <code>                account: String(incoming.account &#124;&#124; '').trim(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3958 | <code>                authType: String(incoming.authType &#124;&#124; currentProfile.authType &#124;&#124; 'password').trim().toLowerCase()</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3959 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3960 | <code>            const nextSecret = normalizeLlmApiKey(incoming.secret &#124;&#124; '');</code> | 声明局部标识符 `nextSecret`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3961 | <code>            if (nextSecret) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3962 | <code>                nextProfile.secret = nextSecret;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3963 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3964 | <code>            if (incoming.secretAction === 'clear') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3965 | <code>                nextProfile.secret = '';</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3966 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3967 | <code>            currentProfiles[providerId] = nextProfile;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3968 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3969 | <code>        nextPreferences.emailProfiles = normalizeEmailProfiles(currentProfiles);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3970 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3971 | <code>    if ('cameraDistance' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3972 | <code>        nextPreferences.cameraDistance = normalizeCameraDistance(partialPreferences.cameraDistance);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3973 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3974 | <code>    if ('cameraHeight' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3975 | <code>        nextPreferences.cameraHeight = normalizeCameraHeight(partialPreferences.cameraHeight);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3976 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3977 | <code>    if ('cameraTargetY' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3978 | <code>        nextPreferences.cameraTargetY = normalizeCameraTargetY(partialPreferences.cameraTargetY);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3979 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3980 | <code>    if ('renderProfileId' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3981 | <code>        nextPreferences.renderProfileId = normalizeRenderProfileId(partialPreferences.renderProfileId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3982 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3983 | <code>    if ('renderLightYawDeg' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3984 | <code>        nextPreferences.renderLightYawDeg = normalizeRenderLightYawDeg(partialPreferences.renderLightYawDeg);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3985 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3986 | <code>    if ('renderKeyLightScale' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3987 | <code>        nextPreferences.renderKeyLightScale = normalizeRenderKeyLightScale(partialPreferences.renderKeyLightScale);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3988 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3989 | <code>    if ('renderAmbientFillScale' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3990 | <code>        nextPreferences.renderAmbientFillScale = normalizeRenderAmbientFillScale(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3991 | <code>            partialPreferences.renderAmbientFillScale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3992 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3993 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3994 | <code>    if ('renderOutlineScale' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3995 | <code>        nextPreferences.renderOutlineScale = normalizeRenderOutlineScale(partialPreferences.renderOutlineScale);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3996 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3997 | <code>    if ('renderShadowEnabled' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3998 | <code>        nextPreferences.renderShadowEnabled = normalizeRenderShadowEnabled(partialPreferences.renderShadowEnabled);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 3999 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4000 | <code>    if ('renderResolutionScale' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4001 | <code>        nextPreferences.renderResolutionScale = normalizeRenderResolutionScale(partialPreferences.renderResolutionScale);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 4002 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4003 | <code>    if ('renderFpsLimit' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4004 | <code>        nextPreferences.renderFpsLimit = normalizeRenderFpsLimit(partialPreferences.renderFpsLimit);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4005 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4006 | <code>    if ('renderShadowQuality' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4007 | <code>        nextPreferences.renderShadowQuality = normalizeRenderShadowQuality(partialPreferences.renderShadowQuality);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4008 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4009 | <code>    if ('renderOutlineEnabled' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4010 | <code>        nextPreferences.renderOutlineEnabled = normalizeRenderOutlineEnabled(partialPreferences.renderOutlineEnabled);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4011 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4012 | <code>    if ('renderAntialiasEnabled' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4013 | <code>        nextPreferences.renderAntialiasEnabled = normalizeRenderAntialiasEnabled(partialPreferences.renderAntialiasEnabled);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4014 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4015 | <code>    delete nextPreferences.renderShadowStrength;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4016 | <code>    delete nextPreferences.renderShadowRange;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4017 | <code>    if ('desktopNativeTtsRate' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4018 | <code>        nextPreferences.desktopNativeTtsRate = normalizeDesktopNativeTTSRate(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4019 | <code>            partialPreferences.desktopNativeTtsRate</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4020 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4021 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4022 | <code>    if ('desktopNativeTtsPitch' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4023 | <code>        nextPreferences.desktopNativeTtsPitch = normalizeDesktopNativeTTSPitch(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4024 | <code>            partialPreferences.desktopNativeTtsPitch</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4025 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4026 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4027 | <code>    if ('desktopNativeTtsVolume' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4028 | <code>        nextPreferences.desktopNativeTtsVolume = normalizeDesktopNativeTTSVolume(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4029 | <code>            partialPreferences.desktopNativeTtsVolume</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4030 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4031 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4032 | <code>    if ('chunkedTtsEnabled' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4033 | <code>        nextPreferences.chunkedTtsEnabled = normalizeChunkedTtsEnabled(partialPreferences.chunkedTtsEnabled);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4034 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4035 | <code>    if ('autoChatEnabled' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4036 | <code>        nextPreferences.autoChatEnabled = normalizeAutoChatEnabled(partialPreferences.autoChatEnabled);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4037 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4038 | <code>    if ('autoChatMode' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4039 | <code>        nextPreferences.autoChatMode = normalizeAutoChatMode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4040 | <code>            partialPreferences.autoChatMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4041 | <code>            nextPreferences.autoChatEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4042 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4043 | <code>        nextPreferences.autoChatEnabled = ['companion', 'cowork'].includes(nextPreferences.autoChatMode);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4044 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4045 | <code>    if ('avatarDialogueBubbleLeft' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4046 | <code>        nextPreferences.avatarDialogueBubbleLeft = normalizeAvatarDialogueBubbleLeft(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4047 | <code>            partialPreferences.avatarDialogueBubbleLeft</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4048 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4049 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4050 | <code>    if ('avatarDialogueBubbleTop' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4051 | <code>        nextPreferences.avatarDialogueBubbleTop = normalizeAvatarDialogueBubbleTop(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4052 | <code>            partialPreferences.avatarDialogueBubbleTop</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4053 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4054 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4055 | <code>    if ('avatarDialogueBubbleScale' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4056 | <code>        nextPreferences.avatarDialogueBubbleScale = normalizeAvatarDialogueBubbleScale(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4057 | <code>            partialPreferences.avatarDialogueBubbleScale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4058 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4059 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4060 | <code>    if ('avatarDialogueBubbleExtraWidth' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4061 | <code>        nextPreferences.avatarDialogueBubbleExtraWidth = normalizeAvatarDialogueBubbleExtraWidth(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4062 | <code>            partialPreferences.avatarDialogueBubbleExtraWidth</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4063 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4064 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4065 | <code>    if ('avatarDialogueBubbleExtraTop' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4066 | <code>        nextPreferences.avatarDialogueBubbleExtraTop = normalizeAvatarDialogueBubbleExtraTop(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4067 | <code>            partialPreferences.avatarDialogueBubbleExtraTop</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4068 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4069 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4070 | <code>    if ('petMouseHitTestEnabled' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4071 | <code>        nextPreferences.petMouseHitTestEnabled = normalizePetMouseHitTestEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4072 | <code>            partialPreferences.petMouseHitTestEnabled</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4073 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4074 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4075 | <code>    if ('petMouseHitTestShape' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4076 | <code>        nextPreferences.petMouseHitTestShape = normalizePetMouseHitTestShape(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4077 | <code>            partialPreferences.petMouseHitTestShape</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4078 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4079 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4080 | <code>    if ('petMouseHitTestWidthRatio' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4081 | <code>        nextPreferences.petMouseHitTestWidthRatio = normalizePetMouseHitTestWidthRatio(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4082 | <code>            partialPreferences.petMouseHitTestWidthRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4083 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4084 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4085 | <code>    if ('petMouseHitTestHeightRatio' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4086 | <code>        nextPreferences.petMouseHitTestHeightRatio = normalizePetMouseHitTestHeightRatio(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4087 | <code>            partialPreferences.petMouseHitTestHeightRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4088 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4089 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4090 | <code>    if ('petMouseHitTestOffsetXRatio' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4091 | <code>        nextPreferences.petMouseHitTestOffsetXRatio = normalizePetMouseHitTestOffsetXRatio(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4092 | <code>            partialPreferences.petMouseHitTestOffsetXRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4093 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4094 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4095 | <code>    if ('petMouseHitTestOffsetYRatio' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4096 | <code>        nextPreferences.petMouseHitTestOffsetYRatio = normalizePetMouseHitTestOffsetYRatio(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4097 | <code>            partialPreferences.petMouseHitTestOffsetYRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4098 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4099 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4100 | <code>    if ('petMouseHitTestDebug' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4101 | <code>        nextPreferences.petMouseHitTestDebug = normalizePetMouseHitTestDebug(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4102 | <code>            partialPreferences.petMouseHitTestDebug</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4103 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4104 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4106 | <code>    const nextAutoChatMinIntervalSec = 'autoChatMinIntervalSec' in partialPreferences</code> | 声明局部标识符 `nextAutoChatMinIntervalSec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4107 | <code>        ? normalizeAutoChatMinIntervalSec(partialPreferences.autoChatMinIntervalSec)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4108 | <code>        : rendererPreferences.autoChatMinIntervalSec;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4109 | <code>    const nextAutoChatMaxIntervalSec = 'autoChatMaxIntervalSec' in partialPreferences</code> | 声明局部标识符 `nextAutoChatMaxIntervalSec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4110 | <code>        ? normalizeAutoChatMaxIntervalSec(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4111 | <code>            partialPreferences.autoChatMaxIntervalSec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4112 | <code>            nextAutoChatMinIntervalSec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4113 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4114 | <code>        : normalizeAutoChatMaxIntervalSec(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4115 | <code>            rendererPreferences.autoChatMaxIntervalSec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4116 | <code>            nextAutoChatMinIntervalSec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4117 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4119 | <code>    nextPreferences.autoChatMinIntervalSec = nextAutoChatMinIntervalSec;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4120 | <code>    nextPreferences.autoChatMaxIntervalSec = nextAutoChatMaxIntervalSec;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4122 | <code>    const petScaleChanged = nextPreferences.petScale !== rendererPreferences.petScale;</code> | 声明局部标识符 `petScaleChanged`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4123 | <code>    const ailisStateDirChanged =</code> | 声明局部标识符 `ailisStateDirChanged`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4124 | <code>        resolveAILISStateDir(nextPreferences.ailisStateDir) !== rendererPreferences.ailisResolvedStateDir;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4125 | <code>    const voiceRuntimeRootChanged =</code> | 声明局部标识符 `voiceRuntimeRootChanged`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4126 | <code>        resolveVoiceRuntimeRoot(nextPreferences.voiceRuntimeRoot) !== rendererPreferences.voiceRuntimeResolvedRoot;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4128 | <code>    desktopState.preferences = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4129 | <code>        ...desktopState.preferences,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4130 | <code>        ...nextPreferences</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4131 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4133 | <code>    if (petScaleChanged) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4134 | <code>        const referenceBounds = petDialogueCollapsedBounds &#124;&#124;</code> | 声明局部标识符 `referenceBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4135 | <code>            (petWindow ? petWindow.getBounds() : desktopState.petWindow.bounds);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4136 | <code>        const nextBounds = clampBoundsToDisplay(</code> | 声明局部标识符 `nextBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4137 | <code>            resizePetBounds(referenceBounds, nextPreferences.petScale),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4138 | <code>            PET_MIN_SIZE.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4139 | <code>            PET_MIN_SIZE.height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4140 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4142 | <code>        desktopState.petWindow.bounds = nextBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4143 | <code>        if (petWindow &amp;&amp; petDialogueExpanded) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4144 | <code>            const layout = getPetDialogueExpandedLayout(</code> | 声明局部标识符 `layout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4145 | <code>                nextBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4146 | <code>                petDialogueExtraTop &#124;&#124; PET_DIALOGUE_DEFAULT_EXTRA_TOP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4147 | <code>                petDialogueExtraWidth &#124;&#124; PET_DIALOGUE_DEFAULT_EXTRA_WIDTH</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4148 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4149 | <code>            petDialogueCollapsedBounds = layout.baseBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4150 | <code>            petDialogueExtraTop = layout.extraTop;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4151 | <code>            petDialogueExtraWidth = layout.extraWidth;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4152 | <code>            desktopState.petWindow.bounds = layout.baseBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4153 | <code>            setPetWindowBoundsTransient(layout.expandedBounds);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4154 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4155 | <code>            petWindow?.setBounds(nextBounds);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4156 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4157 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4159 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4160 | <code>        !petScaleChanged &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4161 | <code>        petWindow &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4162 | <code>        petDialogueExpanded &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4163 | <code>        (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4164 | <code>            'avatarDialogueBubbleExtraTop' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4165 | <code>            'avatarDialogueBubbleExtraWidth' in partialPreferences</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4166 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4167 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4168 | <code>        const layout = getPetDialogueExpandedLayout(</code> | 声明局部标识符 `layout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4169 | <code>            petDialogueCollapsedBounds &#124;&#124; desktopState.petWindow.bounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4170 | <code>            nextPreferences.avatarDialogueBubbleExtraTop,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4171 | <code>            nextPreferences.avatarDialogueBubbleExtraWidth</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4172 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4173 | <code>        petDialogueCollapsedBounds = layout.baseBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4174 | <code>        petDialogueExtraTop = layout.extraTop;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4175 | <code>        petDialogueExtraWidth = layout.extraWidth;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4176 | <code>        desktopState.petWindow.bounds = layout.baseBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4177 | <code>        setPetWindowBoundsTransient(layout.expandedBounds);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4178 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4180 | <code>    if (petWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4181 | <code>        petWindow.setSkipTaskbar(nextPreferences.petSkipTaskbar);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4182 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4184 | <code>    const allowBlankCredentials = [];</code> | 声明局部标识符 `allowBlankCredentials`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4185 | <code>    if (partialPreferences.llmApiKeyAction === 'clear') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4186 | <code>        allowBlankCredentials.push('llmApiKey');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 4187 | <code>        allowBlankCredentials.push('llmApiKeyProfiles');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 4188 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4189 | <code>    if (partialPreferences.elevenLabsApiKeyAction === 'clear') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4190 | <code>        allowBlankCredentials.push('elevenLabsApiKey');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 4191 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4192 | <code>    for (const [providerId, profile] of Object.entries(partialPreferences.emailProfiles &#124;&#124; {})) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 4193 | <code>        if (profile?.secretAction === 'clear') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4194 | <code>            allowBlankCredentials.push(`emailProfiles.${providerId}.secret`);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 4195 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4196 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4198 | <code>    persistDesktopState({ allowBlankCredentials });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4199 | <code>    broadcastPreferencesUpdated();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4201 | <code>    if ('emberHarnessMode' in partialPreferences &amp;&amp; ailisGateway &amp;&amp; !ailisStateDirChanged) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4202 | <code>        ailisGateway.configureEmberHarness({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4203 | <code>            enabled: nextPreferences.emberHarnessMode !== 'off',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4204 | <code>            mode: nextPreferences.emberHarnessMode === 'enforce' ? 'enforce' : 'observe'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4205 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4206 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4208 | <code>    if (voiceRuntimeRootChanged) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4209 | <code>        voiceRuntimeBootstrap = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4210 | <code>        closeCosyVoice3TTS();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4211 | <code>        configureCosyVoice3Runtime();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4212 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4214 | <code>    if ('speechMode' in partialPreferences) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4215 | <code>        void warmupDesktopSpeechMode(nextPreferences.speechMode, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4216 | <code>            reason: 'preferences_changed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4217 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4218 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4220 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4221 | <code>        'backendMode' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4222 | <code>        'agentRuntimeGatewayUrl' in partialPreferences &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4223 | <code>        'openclawGatewayUrl' in partialPreferences</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4224 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4225 | <code>        void syncAgentRuntimeSelection({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4226 | <code>            ensureReady: nextPreferences.backendMode === 'openclaw'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4227 | <code>        }).catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4228 | <code>            console.warn('[agent-runtime] 运行链路切换失败：', error.message &#124;&#124; error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4229 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4230 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4232 | <code>    if (ailisStateDirChanged) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4233 | <code>        ailisChatHistoryStore = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4234 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4236 | <code>    if (ailisStateDirChanged &amp;&amp; ailisGateway) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4237 | <code>        const oldGateway = ailisGateway;</code> | 声明局部标识符 `oldGateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4238 | <code>        ailisGateway = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4239 | <code>        ailisGatewayStartPromise = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4240 | <code>        void oldGateway.stop()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4241 | <code>            .catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4242 | <code>                console.warn('[ailis-gateway] 状态目录切换时关闭旧 Gateway 失败：', error.message &#124;&#124; error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4243 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4244 | <code>            .finally(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4245 | <code>                void ensureAILISGatewayStarted('state_dir_changed').catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4246 | <code>                    console.warn('[ailis-gateway] 状态目录切换后启动失败：', error.message &#124;&#124; error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4247 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4248 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4249 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4251 | <code>    return getRendererPreferences();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4252 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4254 | <code>function applyPetScale(scale) {</code> | 定义函数 `applyPetScale`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4255 | <code>    return applyPreferencesPatch({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4256 | <code>        petScale: scale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4257 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4258 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4260 | <code>function buildPetScaleMenu() {</code> | 定义函数 `buildPetScaleMenu`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4261 | <code>    const currentScale = normalizePetScale(desktopState?.preferences?.petScale &#124;&#124; DEFAULT_PET_SCALE);</code> | 声明局部标识符 `currentScale`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4263 | <code>    return PET_SCALE_OPTIONS.map((scale) =&gt; ({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4264 | <code>        label: `${Math.round(scale * 100)}%`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4265 | <code>        type: 'radio',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4266 | <code>        checked: currentScale === scale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4267 | <code>        click: () =&gt; applyPetScale(scale)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4268 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4269 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4271 | <code>function getCurrentUiLanguage() {</code> | 定义函数 `getCurrentUiLanguage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4272 | <code>    return normalizeUiLanguage(desktopState?.preferences?.uiLanguage &#124;&#124; DEFAULT_UI_LANGUAGE);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4273 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4275 | <code>function menuText(key) {</code> | 定义函数 `menuText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4276 | <code>    const language = getCurrentUiLanguage();</code> | 声明局部标识符 `language`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4277 | <code>    return MENU_I18N[language]?.[key] &#124;&#124; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4278 | <code>        showPet: '显示桌宠',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4279 | <code>        hidePet: '隐藏桌宠',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4280 | <code>        controlPanel: '控制面板',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4281 | <code>        chat: '聊天',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4282 | <code>        language: '语言',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4283 | <code>        speechMode: '语音模式',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4284 | <code>        speechOff: '关闭语音',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4285 | <code>        speechServer: 'ElevenLabs 云端语音',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4286 | <code>        speechCosyVoice3: 'CosyVoice3 本地高质量',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4287 | <code>        scale: '缩放',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4288 | <code>        showInTaskbar: '桌宠显示在任务栏',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4289 | <code>        quit: '退出',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4290 | <code>        undo: '撤销',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4291 | <code>        redo: '重做',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4292 | <code>        cut: '剪切',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4293 | <code>        copy: '复制',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4294 | <code>        paste: '粘贴',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4295 | <code>        selectAll: '全选',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4296 | <code>        trayTooltip: 'AILIS 桌宠'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4297 | <code>    }[key] &#124;&#124; key;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4298 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4299 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4300 | <code>function updateUiLanguage(nextLanguage) {</code> | 定义函数 `updateUiLanguage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4301 | <code>    return applyPreferencesPatch({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4302 | <code>        uiLanguage: nextLanguage</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4303 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4304 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4305 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4306 | <code>function buildUiLanguageMenu() {</code> | 定义函数 `buildUiLanguageMenu`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4307 | <code>    const currentLanguage = getCurrentUiLanguage();</code> | 声明局部标识符 `currentLanguage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4308 | <code>    return UI_LANGUAGE_OPTIONS.map((language) =&gt; ({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4309 | <code>        label: UI_LANGUAGE_LABELS[language] &#124;&#124; language,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4310 | <code>        type: 'radio',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4311 | <code>        checked: currentLanguage === language,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4312 | <code>        click: () =&gt; updateUiLanguage(language)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4313 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4314 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4316 | <code>function getSpeechModeLabel(mode) {</code> | 定义函数 `getSpeechModeLabel`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4317 | <code>    if (mode === 'off') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4318 | <code>        return menuText('speechOff');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4319 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4320 | <code>    if (mode === 'server') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4321 | <code>        return menuText('speechServer');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4322 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4323 | <code>    if (mode === 'cosyvoice3') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4324 | <code>        return menuText('speechCosyVoice3');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4325 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4326 | <code>    return menuText('speechOff');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4327 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4329 | <code>function buildControlMenuTemplate({ includeTaskbarToggle = false } = {}) {</code> | 定义函数 `buildControlMenuTemplate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4330 | <code>    const template = [</code> | 声明局部标识符 `template`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4331 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4332 | <code>            label: menuText('controlPanel'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4333 | <code>            click: () =&gt; showControlPanel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4334 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4335 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4336 | <code>            label: menuText('chat'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4337 | <code>            click: () =&gt; showChatWindow()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4338 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4339 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4340 | <code>            label: menuText('language'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4341 | <code>            submenu: buildUiLanguageMenu()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4342 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4343 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4344 | <code>            label: menuText('speechMode'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4345 | <code>            submenu: SPEECH_MODE_OPTIONS.map((mode) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4346 | <code>                label: getSpeechModeLabel(mode),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4347 | <code>                type: 'radio',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4348 | <code>                checked: getRendererPreferences().speechMode === mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4349 | <code>                click: () =&gt; updateSpeechMode(mode)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4350 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4351 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4352 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4353 | <code>            label: menuText('scale'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4354 | <code>            submenu: buildPetScaleMenu()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4355 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4356 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4358 | <code>    if (includeTaskbarToggle) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4359 | <code>        template.push(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4360 | <code>            { type: 'separator' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4361 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4362 | <code>                label: menuText('showInTaskbar'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4363 | <code>                type: 'checkbox',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4364 | <code>                checked: !desktopState.preferences.petSkipTaskbar,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4365 | <code>                click: (menuItem) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4366 | <code>                    applyPreferencesPatch({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4367 | <code>                        petSkipTaskbar: !menuItem.checked</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4368 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4369 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4370 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4371 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4372 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4374 | <code>    template.push(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4375 | <code>        { type: 'separator' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4376 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4377 | <code>            label: menuText('quit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4378 | <code>            click: () =&gt; quitApplication()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4379 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4380 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4381 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4382 | <code>    return template;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4383 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4384 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4385 | <code>function buildPetContextMenu() {</code> | 定义函数 `buildPetContextMenu`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4386 | <code>    return Menu.buildFromTemplate(buildControlMenuTemplate());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4387 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4389 | <code>function showControlMenu(targetWindow = petWindow) {</code> | 定义函数 `showControlMenu`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4390 | <code>    if (!targetWindow &#124;&#124; targetWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4391 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4392 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4394 | <code>    buildPetContextMenu().popup({ window: targetWindow });</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4395 | <code>    return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4396 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4398 | <code>function buildTextEditMenuTemplate({ isEditable = false, hasSelection = false, editFlags = {} } = {}) {</code> | 定义函数 `buildTextEditMenuTemplate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4399 | <code>    const editable = Boolean(isEditable);</code> | 声明局部标识符 `editable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4400 | <code>    const selection = Boolean(hasSelection);</code> | 声明局部标识符 `selection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4401 | <code>    const flags = editFlags &amp;&amp; typeof editFlags === 'object' ? editFlags : {};</code> | 声明局部标识符 `flags`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4402 | <code>    const hasFlag = (key, fallback) =&gt; (</code> | 声明局部标识符 `hasFlag`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4403 | <code>        Object.prototype.hasOwnProperty.call(flags, key)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4404 | <code>            ? Boolean(flags[key])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4405 | <code>            : fallback</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4406 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4407 | <code>    const template = [];</code> | 声明局部标识符 `template`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4408 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4409 | <code>    if (editable) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4410 | <code>        template.push(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4411 | <code>            { label: menuText('undo'), role: 'undo', enabled: hasFlag('canUndo', true) },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4412 | <code>            { label: menuText('redo'), role: 'redo', enabled: hasFlag('canRedo', true) },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4413 | <code>            { type: 'separator' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4414 | <code>            { label: menuText('cut'), role: 'cut', enabled: hasFlag('canCut', selection) },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4415 | <code>            { label: menuText('copy'), role: 'copy', enabled: hasFlag('canCopy', selection) },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4416 | <code>            { label: menuText('paste'), role: 'paste', enabled: hasFlag('canPaste', true) }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4417 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4418 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4419 | <code>        template.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4420 | <code>            label: menuText('copy'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4421 | <code>            role: 'copy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4422 | <code>            enabled: hasFlag('canCopy', selection)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4423 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4424 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4425 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4426 | <code>    template.push(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4427 | <code>        { type: 'separator' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4428 | <code>        { label: menuText('selectAll'), role: 'selectAll', enabled: hasFlag('canSelectAll', true) }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4429 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4431 | <code>    return template;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4432 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4434 | <code>function showTextEditMenu(targetWindow, context = {}) {</code> | 定义函数 `showTextEditMenu`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4435 | <code>    if (!targetWindow &#124;&#124; targetWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4436 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4437 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4439 | <code>    const menu = Menu.buildFromTemplate(buildTextEditMenuTemplate(context));</code> | 声明局部标识符 `menu`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4440 | <code>    menu.popup({ window: targetWindow });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4441 | <code>    return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4442 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4443 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4444 | <code>function createPetWindow() {</code> | 定义函数 `createPetWindow`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4445 | <code>    const petState = desktopState.petWindow;</code> | 声明局部标识符 `petState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4446 | <code>    const petBounds = canonicalizePetBounds(petState.bounds);</code> | 声明局部标识符 `petBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4447 | <code>    desktopState.petWindow.bounds = petBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4448 | <code>    persistDesktopState();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4449 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4450 | <code>    console.log('[window:pet] create', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4451 | <code>        bounds: petBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4452 | <code>        visible: Boolean(petState.visible),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4453 | <code>        skipTaskbar: desktopState.preferences.petSkipTaskbar</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4454 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4455 | <code>    petWindow = desktopPlatformAdapter.createWindow({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4456 | <code>        bounds: petBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4457 | <code>        frame: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4458 | <code>        transparent: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4459 | <code>        backgroundColor: '#00000000',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4460 | <code>        hasShadow: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4461 | <code>        resizable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4462 | <code>        movable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4463 | <code>        alwaysOnTop: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4464 | <code>        skipTaskbar: desktopState.preferences.petSkipTaskbar,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4465 | <code>        show: Boolean(petState.visible),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4466 | <code>        title: 'AILIS Pet'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4467 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4469 | <code>    desktopPlatformAdapter.applyWindowBehavior(petWindow, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4470 | <code>        alwaysOnTop: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4471 | <code>        alwaysOnTopLevel: 'screen-saver',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4472 | <code>        visibleOnAllWorkspaces: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4473 | <code>        visibleOnFullScreen: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4474 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4475 | <code>    openExternalLinks(petWindow);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4476 | <code>    hookRendererDiagnostics(petWindow, 'pet');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4477 | <code>    hookWindowPersistence('petWindow', petWindow);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4478 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4479 | <code>    petWindow.on('close', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4480 | <code>        console.log('[window:pet] close', { isQuitting });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4481 | <code>        if (isQuitting) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4482 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4483 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4484 | <code>        event.preventDefault();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4485 | <code>        petWindow.hide();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4486 | <code>        hideChatWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4487 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4489 | <code>    petWindow.on('closed', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4490 | <code>        console.log('[window:pet] closed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4491 | <code>        petWindow = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4492 | <code>        petDialogueCollapsedBounds = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4493 | <code>        petDialogueExpanded = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4494 | <code>        petDialogueExtraTop = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4495 | <code>        petDialogueExtraWidth = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4496 | <code>        petDialogueBoundsMutation = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4497 | <code>        clearTimeout(petDialogueBoundsMutationTimer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4498 | <code>        petDialogueBoundsMutationTimer = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 4499 | <code>        petMousePassthroughEnabled = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4500 | <code>        petDragState = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4501 | <code>        stopPetCursorTracking();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4502 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4504 | <code>    void loadWindowContent(petWindow, 'pet.html').catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4505 | <code>        console.error('[window] 桌宠窗口加载失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4506 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4507 | <code>    setPetMousePassthrough(true, { force: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4508 | <code>    startPetCursorTracking();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4509 | <code>    if (!desktopState.petWindow.visible) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4510 | <code>        petWindow.hide();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4511 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4512 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4513 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4514 | <code>function createChatWindow() {</code> | 定义函数 `createChatWindow`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4515 | <code>    const chatState = desktopState.chatWindow;</code> | 声明局部标识符 `chatState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4516 | <code>    const chatBounds = clampBoundsToDisplay(chatState.bounds, CHAT_MIN_WIDTH, CHAT_MIN_HEIGHT);</code> | 声明局部标识符 `chatBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4518 | <code>    chatWindow = desktopPlatformAdapter.createWindow({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4519 | <code>        bounds: chatBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4520 | <code>        frame: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4521 | <code>        transparent: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4522 | <code>        backgroundColor: '#f8fbff',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4523 | <code>        hasShadow: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4524 | <code>        resizable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4525 | <code>        show: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4526 | <code>        skipTaskbar: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4527 | <code>        alwaysOnTop: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4528 | <code>        title: 'AILIS Chat'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4529 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4530 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4531 | <code>    openExternalLinks(chatWindow);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4532 | <code>    hookRendererDiagnostics(chatWindow, 'chat');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4533 | <code>    hookWindowContextMenu(chatWindow, 'chat');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4534 | <code>    hookWindowPersistence('chatWindow', chatWindow);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4536 | <code>    chatWindow.on('close', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4537 | <code>        console.log('[window:chat] close', { isQuitting });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4538 | <code>        if (isQuitting) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4539 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4540 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4541 | <code>        event.preventDefault();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4542 | <code>        chatWindow.hide();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4543 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4544 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4545 | <code>    chatWindow.on('closed', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4546 | <code>        console.log('[window:chat] closed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4547 | <code>        chatWindow = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4548 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4549 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4550 | <code>    void loadWindowContent(chatWindow, 'chat.html')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4551 | <code>        .then(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4552 | <code>            if (desktopState.chatWindow.visible) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4553 | <code>                chatWindow.show();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4554 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4555 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4556 | <code>        .catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4557 | <code>            console.error('[window] 聊天窗口加载失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4558 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4559 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4560 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4561 | <code>function createControlWindow(options = {}) {</code> | 定义函数 `createControlWindow`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4562 | <code>    const controlState = desktopState.controlWindow;</code> | 声明局部标识符 `controlState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4563 | <code>    const controlBounds = clampBoundsToDisplay(</code> | 声明局部标识符 `controlBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4564 | <code>        controlState.bounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4565 | <code>        CONTROL_MIN_WIDTH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4566 | <code>        CONTROL_MIN_HEIGHT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4567 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4568 | <code>    const showWhenReady = Boolean(options.showWhenReady &#124;&#124; controlState.visible);</code> | 声明局部标识符 `showWhenReady`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4569 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4570 | <code>    controlWindow = desktopPlatformAdapter.createWindow({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4571 | <code>        bounds: controlBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4572 | <code>        minWidth: CONTROL_MIN_WIDTH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4573 | <code>        minHeight: CONTROL_MIN_HEIGHT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4574 | <code>        frame: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4575 | <code>        transparent: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4576 | <code>        backgroundColor: '#f4f6f8',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4577 | <code>        hasShadow: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4578 | <code>        resizable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4579 | <code>        show: showWhenReady,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4580 | <code>        skipTaskbar: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4581 | <code>        title: 'AILIS Control Panel'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4582 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4583 | <code>    controlWindow.__ailisDidFinishLoad = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4584 | <code>    controlWindow.__ailisShowWhenReady = showWhenReady;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4585 | <code>    console.log('[window:control] create', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4586 | <code>        bounds: controlBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4587 | <code>        showWhenReady</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4588 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4589 | <code>    if (showWhenReady) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4590 | <code>        controlWindow.focus();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4591 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4593 | <code>    openExternalLinks(controlWindow);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4594 | <code>    hookRendererDiagnostics(controlWindow, 'control');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4595 | <code>    hookWindowContextMenu(controlWindow, 'control');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4596 | <code>    hookWindowPersistence('controlWindow', controlWindow);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4597 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4598 | <code>    controlWindow.on('close', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4599 | <code>        console.log('[window:control] close', { isQuitting });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4600 | <code>        if (isQuitting) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4601 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4602 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4603 | <code>        event.preventDefault();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4604 | <code>        controlWindow.hide();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4605 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4606 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4607 | <code>    controlWindow.on('closed', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4608 | <code>        console.log('[window:control] closed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4609 | <code>        controlWindow = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4610 | <code>        controlWindowLoadPromise = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4611 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4612 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4613 | <code>    controlWindowLoadPromise = loadWindowContent(controlWindow, 'control.html')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4614 | <code>        .then(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4615 | <code>            if (!controlWindow &#124;&#124; controlWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4616 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4617 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4618 | <code>            controlWindow.__ailisDidFinishLoad = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4619 | <code>            if (controlWindow.__ailisShowWhenReady) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4620 | <code>                if (!controlWindow.isVisible()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4621 | <code>                    controlWindow.show();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4622 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4623 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4624 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4625 | <code>        .catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4626 | <code>            console.error('[window] 控制面板加载失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4627 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4628 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4629 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4630 | <code>function createAgentLabWindow(options = {}) {</code> | 定义函数 `createAgentLabWindow`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4631 | <code>    const display = screen.getPrimaryDisplay();</code> | 声明局部标识符 `display`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4632 | <code>    const workArea = display.workArea;</code> | 声明局部标识符 `workArea`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4633 | <code>    const width = Math.min(Math.max(1280, AGENT_LAB_MIN_WIDTH), Math.max(AGENT_LAB_MIN_WIDTH, workArea.width - 48));</code> | 声明局部标识符 `width`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4634 | <code>    const height = Math.min(Math.max(840, AGENT_LAB_MIN_HEIGHT), Math.max(AGENT_LAB_MIN_HEIGHT, workArea.height - 48));</code> | 声明局部标识符 `height`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4635 | <code>    const bounds = clampBoundsToDisplay(</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4636 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4637 | <code>            x: Math.round(workArea.x + (workArea.width - width) / 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4638 | <code>            y: Math.round(workArea.y + (workArea.height - height) / 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4639 | <code>            width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4640 | <code>            height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4641 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4642 | <code>        AGENT_LAB_MIN_WIDTH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4643 | <code>        AGENT_LAB_MIN_HEIGHT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4644 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4645 | <code>    const showWhenReady = Boolean(options.showWhenReady);</code> | 声明局部标识符 `showWhenReady`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4646 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4647 | <code>    agentLabWindow = desktopPlatformAdapter.createWindow({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4648 | <code>        bounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4649 | <code>        minWidth: AGENT_LAB_MIN_WIDTH,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4650 | <code>        minHeight: AGENT_LAB_MIN_HEIGHT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4651 | <code>        frame: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4652 | <code>        transparent: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4653 | <code>        backgroundColor: '#0f172a',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4654 | <code>        hasShadow: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4655 | <code>        resizable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4656 | <code>        show: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4657 | <code>        skipTaskbar: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4658 | <code>        title: 'AILIS Agent Analysis Lab'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4659 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4660 | <code>    agentLabWindow.__ailisDidFinishLoad = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4661 | <code>    agentLabWindow.__ailisShowWhenReady = showWhenReady;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4662 | <code>    console.log('[window:agent-lab] create', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4663 | <code>        bounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4664 | <code>        showWhenReady</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4665 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4666 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4667 | <code>    openExternalLinks(agentLabWindow);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4668 | <code>    hookRendererDiagnostics(agentLabWindow, 'agent-lab');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4669 | <code>    hookWindowContextMenu(agentLabWindow, 'agent-lab');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4670 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4671 | <code>    agentLabWindow.on('close', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4672 | <code>        console.log('[window:agent-lab] close', { isQuitting });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4673 | <code>        if (isQuitting) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4674 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4675 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4676 | <code>        event.preventDefault();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4677 | <code>        agentLabWindow.hide();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4678 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4679 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4680 | <code>    agentLabWindow.on('closed', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4681 | <code>        console.log('[window:agent-lab] closed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4682 | <code>        agentLabWindow = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4683 | <code>        agentLabWindowLoadPromise = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4684 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4685 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4686 | <code>    agentLabWindowLoadPromise = loadWindowContent(agentLabWindow, 'agent-lab.html')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4687 | <code>        .then(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4688 | <code>            if (!agentLabWindow &#124;&#124; agentLabWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4689 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4690 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4691 | <code>            agentLabWindow.__ailisDidFinishLoad = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4692 | <code>            if (agentLabWindow.__ailisShowWhenReady) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4693 | <code>                agentLabWindow.show();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4694 | <code>                agentLabWindow.focus();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4695 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4696 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4697 | <code>        .catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4698 | <code>            console.error('[window] Agent 分析台加载失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4699 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4700 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4701 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4702 | <code>function refreshTrayMenu() {</code> | 定义函数 `refreshTrayMenu`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4703 | <code>    if (!tray) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4704 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4705 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4706 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4707 | <code>    const menu = Menu.buildFromTemplate([</code> | 声明局部标识符 `menu`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4708 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4709 | <code>            label: petWindow?.isVisible() ? menuText('hidePet') : menuText('showPet'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4710 | <code>            click: () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4711 | <code>                if (!petWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4712 | <code>                    createPetWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4713 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4714 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4715 | <code>                if (petWindow.isVisible()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4716 | <code>                    petWindow.hide();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4717 | <code>                    hideChatWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4718 | <code>                } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4719 | <code>                    petWindow.show();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4720 | <code>                    petWindow.focus();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4721 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4722 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4723 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4724 | <code>        ...buildControlMenuTemplate({ includeTaskbarToggle: true })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4725 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4726 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4727 | <code>    tray.setContextMenu(menu);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4728 | <code>    tray.setToolTip(menuText('trayTooltip'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4729 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4730 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4731 | <code>function createTray() {</code> | 定义函数 `createTray`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4732 | <code>    tray = new Tray(makeTrayIcon());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4733 | <code>    tray.on('double-click', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4734 | <code>        if (!petWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4735 | <code>            createPetWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4736 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4737 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4738 | <code>        petWindow.show();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4739 | <code>        petWindow.focus();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4740 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4741 | <code>    refreshTrayMenu();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4742 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4743 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4744 | <code>async function updateSpeechMode(nextMode) {</code> | 定义函数 `updateSpeechMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4745 | <code>    const preferences = applyPreferencesPatch({</code> | 声明局部标识符 `preferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4746 | <code>        speechMode: nextMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4747 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4748 | <code>    const normalizedMode = normalizeSpeechMode(nextMode);</code> | 声明局部标识符 `normalizedMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4749 | <code>    if (normalizedMode !== 'cosyvoice3') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4750 | <code>        return preferences;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4751 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4752 | <code>    const voiceWarmup = await warmupDesktopSpeechMode(normalizedMode, {</code> | 声明局部标识符 `voiceWarmup`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4753 | <code>        waitForCompletion: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4754 | <code>        reason: 'speech_mode_enabled'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4755 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4756 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4757 | <code>        ...preferences,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4758 | <code>        voiceWarmup</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4759 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4760 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4761 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4762 | <code>function updatePreferredMicDevice(nextDeviceId) {</code> | 定义函数 `updatePreferredMicDevice`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4763 | <code>    return applyPreferencesPatch({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4764 | <code>        preferredMicDeviceId: nextDeviceId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4765 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4766 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4767 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4768 | <code>function updateRecognitionMode(nextMode) {</code> | 定义函数 `updateRecognitionMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4769 | <code>    return applyPreferencesPatch({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4770 | <code>        recognitionMode: nextMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4771 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4772 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4773 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4774 | <code>function restoreDefaultPreferences() {</code> | 定义函数 `restoreDefaultPreferences`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4775 | <code>    return applyPreferencesPatch({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4776 | <code>        ...getDefaultState().preferences,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4777 | <code>        llmApiKeyAction: 'clear',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 4778 | <code>        elevenLabsApiKeyAction: 'clear'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 4779 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4780 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4781 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4782 | <code>async function chooseAILISStateDir() {</code> | 定义函数 `chooseAILISStateDir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4783 | <code>    const result = await dialog.showOpenDialog(controlWindow &#124;&#124; BrowserWindow.getFocusedWindow() &#124;&#124; petWindow, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4784 | <code>        title: '选择 AILIS 本地状态目录',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4785 | <code>        defaultPath: getPersistedAILISStateDir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4786 | <code>        properties: ['openDirectory', 'createDirectory']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4787 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4788 | <code>    if (result.canceled &#124;&#124; !result.filePaths?.[0]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4789 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4790 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4791 | <code>            canceled: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4792 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4793 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4794 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4795 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4796 | <code>        path: result.filePaths[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4797 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4798 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4799 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4800 | <code>async function chooseVoiceRuntimeRoot() {</code> | 定义函数 `chooseVoiceRuntimeRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4801 | <code>    const result = await dialog.showOpenDialog(controlWindow &#124;&#124; BrowserWindow.getFocusedWindow() &#124;&#124; petWindow, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4802 | <code>        title: '选择 CosyVoice3 本地语音安装目录',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4803 | <code>        defaultPath: getPersistedVoiceRuntimeRoot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4804 | <code>        properties: ['openDirectory', 'createDirectory']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4805 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4806 | <code>    if (result.canceled &#124;&#124; !result.filePaths?.[0]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4807 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4808 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4809 | <code>            canceled: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4810 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4811 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4812 | <code>    const selectedPath = path.resolve(result.filePaths[0]);</code> | 声明局部标识符 `selectedPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4813 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4814 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4815 | <code>        path: selectedPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4816 | <code>        runtimeRoot: selectedPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4817 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4818 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4819 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4820 | <code>async function chooseRuntimeAssetMigrationRoot(payload = {}) {</code> | 定义函数 `chooseRuntimeAssetMigrationRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4821 | <code>    const assetId = String(payload?.assetId &#124;&#124; '').trim();</code> | 声明局部标识符 `assetId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4822 | <code>    const manager = getRuntimeAssetManager();</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4823 | <code>    const definition = manager.getDefinition(assetId);</code> | 声明局部标识符 `definition`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4824 | <code>    const roots = manager.getRoots();</code> | 声明局部标识符 `roots`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4825 | <code>    const sourcePath = definition ? manager.resolveAssetPath(definition) : '';</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4826 | <code>    const recommendedRoot = definition</code> | 声明局部标识符 `recommendedRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4827 | <code>        ? roots.recommended[definition.preferredRoot &#124;&#124; 'runtimes'] &#124;&#124; roots.recommended.runtimes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4828 | <code>        : roots.recommended.runtimes;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4829 | <code>    const defaultPath = sourcePath</code> | 声明局部标识符 `defaultPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4830 | <code>        ? path.dirname(path.join(recommendedRoot, path.basename(sourcePath)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4831 | <code>        : recommendedRoot;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4832 | <code>    const result = await dialog.showOpenDialog(controlWindow &#124;&#124; BrowserWindow.getFocusedWindow() &#124;&#124; petWindow, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4833 | <code>        title: '选择运行时资产迁移目录',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4834 | <code>        defaultPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4835 | <code>        properties: ['openDirectory', 'createDirectory']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4836 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4837 | <code>    if (result.canceled &#124;&#124; !result.filePaths?.[0]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4838 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4839 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4840 | <code>            canceled: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4841 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4842 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4843 | <code>    const targetRoot = path.resolve(result.filePaths[0]);</code> | 声明局部标识符 `targetRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4844 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4845 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4846 | <code>        path: targetRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4847 | <code>        targetRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4848 | <code>        plan: assetId ? await getRuntimeAssetManager().planMigration(assetId, targetRoot) : null</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4849 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4850 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4851 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4852 | <code>async function describeVllmLocalModelPath(modelPath) {</code> | 定义函数 `describeVllmLocalModelPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4853 | <code>    const normalizedPath = String(modelPath &#124;&#124; '').trim();</code> | 声明局部标识符 `normalizedPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4854 | <code>    const result = {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4855 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4856 | <code>        path: normalizedPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4857 | <code>        name: normalizedPath ? path.basename(normalizedPath) : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4858 | <code>        suggestedModelName: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4859 | <code>        format: 'unknown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4860 | <code>        canUseVllm: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4861 | <code>        complete: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4862 | <code>        weightFiles: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4863 | <code>        blockers: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4864 | <code>        warnings: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4865 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4866 | <code>    if (!normalizedPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4867 | <code>        result.blockers.push('没有选择模型目录。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4868 | <code>        return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4869 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4870 | <code>    const stat = await fsp.stat(normalizedPath).catch(() =&gt; null);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4871 | <code>    if (!stat?.isDirectory()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4872 | <code>        result.blockers.push('请选择一个模型文件夹。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4873 | <code>        return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4874 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4875 | <code>    const entries = await fsp.readdir(normalizedPath, { withFileTypes: true }).catch(() =&gt; []);</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4876 | <code>    const fileNames = entries.filter((entry) =&gt; entry.isFile()).map((entry) =&gt; entry.name);</code> | 声明局部标识符 `fileNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4877 | <code>    const lowerNames = new Set(fileNames.map((name) =&gt; name.toLowerCase()));</code> | 声明局部标识符 `lowerNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4878 | <code>    const hasConfig = lowerNames.has('config.json');</code> | 声明局部标识符 `hasConfig`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4879 | <code>    const hasTokenizer = fileNames.some((name) =&gt; /^(tokenizer&#124;vocab&#124;merges&#124;sentencepiece&#124;spiece).*\.?(json&#124;txt&#124;model)?$/i.test(name));</code> | 声明局部标识符 `hasTokenizer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4880 | <code>    const weightFiles = fileNames</code> | 声明局部标识符 `weightFiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4881 | <code>        .filter((name) =&gt; /\.(safetensors&#124;bin&#124;pt&#124;gguf)$/i.test(name))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4882 | <code>        .sort((a, b) =&gt; a.localeCompare(b))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4883 | <code>        .slice(0, 12);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4884 | <code>    const hasGguf = weightFiles.some((name) =&gt; /\.gguf$/i.test(name));</code> | 声明局部标识符 `hasGguf`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4885 | <code>    const hasTransformersWeights = weightFiles.some((name) =&gt; /\.(safetensors&#124;bin&#124;pt)$/i.test(name));</code> | 声明局部标识符 `hasTransformersWeights`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4886 | <code>    if (hasGguf &amp;&amp; !hasTransformersWeights) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4887 | <code>        result.format = 'GGUF（更适合 Ollama）';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4888 | <code>        result.blockers.push('这个目录看起来是 GGUF；vLLM 不适合直接部署，建议改用 Ollama。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4889 | <code>    } else if (hasConfig &amp;&amp; hasTransformersWeights) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4890 | <code>        result.format = hasTokenizer ? 'HF/ModelScope Transformers' : 'HF/ModelScope 权重目录';</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 4891 | <code>        if (!hasTokenizer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4892 | <code>            result.blockers.push('缺少 tokenizer/vocab/merges/sentencepiece 等分词器文件，请确认选择的是完整模型根目录。');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 4893 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4894 | <code>            result.complete = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4895 | <code>            result.canUseVllm = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4896 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4897 | <code>    } else if (hasTransformersWeights) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4898 | <code>        result.format = '权重目录';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4899 | <code>        result.blockers.push('检测到权重文件，但没有看到 config.json；请确认选择的是完整 HF/ModelScope 模型根目录。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4900 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4901 | <code>        result.blockers.push('没有检测到 safetensors/bin/pt/gguf 权重文件，请确认选择的是模型根目录。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4902 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4903 | <code>    const safeBaseName = (result.name &#124;&#124; 'local-model')</code> | 声明局部标识符 `safeBaseName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4904 | <code>        .replace(/[_\s]+/g, '-')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4905 | <code>        .replace(/[^A-Za-z0-9./-]+/g, '-')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4906 | <code>        .replace(/-+/g, '-')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4907 | <code>        .replace(/^-&#124;-$/g, '') &#124;&#124; 'local-model';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4908 | <code>    result.suggestedModelName = `local-${safeBaseName}`.slice(0, 120);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4909 | <code>    result.weightFiles = weightFiles;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4910 | <code>    result.ok = result.blockers.length === 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4911 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4912 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4913 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4914 | <code>async function chooseVllmLocalModelFolder() {</code> | 定义函数 `chooseVllmLocalModelFolder`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4915 | <code>    const result = await dialog.showOpenDialog(controlWindow &#124;&#124; BrowserWindow.getFocusedWindow() &#124;&#124; petWindow, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4916 | <code>        title: '选择本地 vLLM 模型目录',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4917 | <code>        properties: ['openDirectory']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4918 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4919 | <code>    if (result.canceled &#124;&#124; !result.filePaths?.[0]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4920 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4921 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4922 | <code>            canceled: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4923 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4924 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4925 | <code>    return describeVllmLocalModelPath(result.filePaths[0]);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4926 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4927 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4928 | <code>async function chooseVllmDownloadFolder(payload = {}) {</code> | 定义函数 `chooseVllmDownloadFolder`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4929 | <code>    const result = await dialog.showOpenDialog(controlWindow &#124;&#124; BrowserWindow.getFocusedWindow() &#124;&#124; petWindow, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4930 | <code>        title: '选择 vLLM 模型安装目录',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4931 | <code>        defaultPath: payload.defaultPath &#124;&#124; 'F:\\models',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4932 | <code>        properties: ['openDirectory', 'createDirectory']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4933 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4934 | <code>    if (result.canceled &#124;&#124; !result.filePaths?.[0]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4935 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4936 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4937 | <code>            canceled: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4938 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4939 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4940 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4941 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4942 | <code>        ...inspectDownloadTarget({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4943 | <code>            downloadDir: result.filePaths[0],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4944 | <code>            modelId: payload.modelId &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4945 | <code>            modelSizeBytes: payload.modelSizeBytes &#124;&#124; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4946 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4947 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4948 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4949 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4950 | <code>async function chooseOllamaLocalModelPath() {</code> | 定义函数 `chooseOllamaLocalModelPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4951 | <code>    const result = await dialog.showOpenDialog(controlWindow &#124;&#124; BrowserWindow.getFocusedWindow() &#124;&#124; petWindow, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4952 | <code>        title: '选择 Ollama 本地模型文件或目录',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4953 | <code>        properties: ['openFile', 'openDirectory'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4954 | <code>        filters: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4955 | <code>            { name: 'Ollama / HF 模型', extensions: ['gguf', 'safetensors', 'json'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4956 | <code>            { name: '所有文件', extensions: ['*'] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4957 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4958 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4959 | <code>    if (result.canceled &#124;&#124; !result.filePaths?.[0]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4960 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4961 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4962 | <code>            canceled: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4963 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4964 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4965 | <code>    return describeOllamaLocalModelPath(result.filePaths[0]);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4966 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4967 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4968 | <code>async function chooseChatFiles(sourceWindow = null) {</code> | 定义函数 `chooseChatFiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4969 | <code>    const result = await dialog.showOpenDialog(sourceWindow &#124;&#124; chatWindow &#124;&#124; BrowserWindow.getFocusedWindow() &#124;&#124; petWindow, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4970 | <code>        title: '选择要交给 AILIS 的文件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4971 | <code>        properties: ['openFile', 'multiSelections'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4972 | <code>        filters: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4973 | <code>            { name: '所有文件', extensions: ['*'] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4974 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4975 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4976 | <code>    if (result.canceled &#124;&#124; !result.filePaths?.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4977 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4978 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4979 | <code>            canceled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4980 | <code>            files: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4981 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4982 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4983 | <code>    return describeChatFilePaths(result.filePaths);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4984 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4985 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4986 | <code>async function installAssetPackFromFolder(sourceWindow = null) {</code> | 定义函数 `installAssetPackFromFolder`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4987 | <code>    const result = await dialog.showOpenDialog(sourceWindow &#124;&#124; controlWindow &#124;&#124; BrowserWindow.getFocusedWindow() &#124;&#124; petWindow, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4988 | <code>        title: '选择包含 manifest.json 的人物包或皮肤包目录',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4989 | <code>        properties: ['openDirectory']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4990 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4991 | <code>    if (result.canceled &#124;&#124; !result.filePaths?.[0]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4992 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4993 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4994 | <code>            canceled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4995 | <code>            snapshot: getAssetPackRuntime().getSnapshot()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4996 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4997 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4998 | <code>    const installResult = await getAssetPackRuntime().installFromPath(result.filePaths[0]);</code> | 声明局部标识符 `installResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 4999 | <code>    broadcastPreferencesUpdated();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5000 | <code>    return installResult;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5001 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5002 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5003 | <code>async function installBundledSampleAssetPack() {</code> | 定义函数 `installBundledSampleAssetPack`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5004 | <code>    const sampleDir = path.join(getProjectRoot(), 'sample-asset-packs', 'ailis-cinematic-skin');</code> | 声明局部标识符 `sampleDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5005 | <code>    const installResult = await getAssetPackRuntime().installFromPath(sampleDir);</code> | 声明局部标识符 `installResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5006 | <code>    broadcastPreferencesUpdated();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5007 | <code>    return installResult;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5008 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5009 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5010 | <code>async function activateAssetPack(payload = {}) {</code> | 定义函数 `activateAssetPack`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5011 | <code>    const result = await getAssetPackRuntime().activate(payload.id &#124;&#124; payload.packId);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5012 | <code>    broadcastPreferencesUpdated();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5013 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5014 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5015 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5016 | <code>async function resetActiveAssetPack(payload = {}) {</code> | 定义函数 `resetActiveAssetPack`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5017 | <code>    const result = await getAssetPackRuntime().resetActive(payload &#124;&#124; {});</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5018 | <code>    broadcastPreferencesUpdated();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5019 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5020 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5021 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5022 | <code>async function uninstallAssetPack(payload = {}) {</code> | 定义函数 `uninstallAssetPack`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5023 | <code>    const result = await getAssetPackRuntime().uninstall(payload.id &#124;&#124; payload.packId);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5024 | <code>    broadcastPreferencesUpdated();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5025 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5026 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5027 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5028 | <code>function registerIpc() {</code> | 定义函数 `registerIpc`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5029 | <code>    ipcMain.on('ailis:get-preferences-sync', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5030 | <code>        event.returnValue = getRendererPreferences();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5031 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5032 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5033 | <code>    ipcMain.handle('ailis:get-preferences', () =&gt; getRendererPreferences());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5034 | <code>    ipcMain.handle('ailis:get-control-panel-state', () =&gt; getControlPanelState());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5035 | <code>    ipcMain.handle('ailis:save-preferences', async (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5036 | <code>        const preferences = applyPreferencesPatch(payload);</code> | 声明局部标识符 `preferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5037 | <code>        if ('speechMode' in (payload &#124;&#124; {}) &amp;&amp; normalizeSpeechMode(payload.speechMode) === 'cosyvoice3') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5038 | <code>            const voiceWarmup = await warmupDesktopSpeechMode('cosyvoice3', {</code> | 声明局部标识符 `voiceWarmup`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5039 | <code>                waitForCompletion: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5040 | <code>                reason: 'preferences_saved'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5041 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5042 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5043 | <code>                ...preferences,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5044 | <code>                voiceWarmup</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5045 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5046 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5047 | <code>        return preferences;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5048 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5049 | <code>    ipcMain.handle('ailis:restore-default-preferences', () =&gt; restoreDefaultPreferences());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5050 | <code>    ipcMain.handle('ailis:choose-ailis-state-dir', () =&gt; chooseAILISStateDir());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5051 | <code>    ipcMain.handle('ailis:voice-runtime-choose-install-dir', () =&gt; chooseVoiceRuntimeRoot());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5052 | <code>    ipcMain.handle('ailis:chat-files-choose', (event) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5053 | <code>        chooseChatFiles(BrowserWindow.fromWebContents(event.sender))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5054 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5055 | <code>    ipcMain.handle('ailis:chat-files-describe', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5056 | <code>        describeChatFilePaths(payload?.paths &#124;&#124; payload?.filePaths &#124;&#124; [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5057 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5058 | <code>    ipcMain.handle('ailis:asset-packs-list', () =&gt; getAssetPackRuntime().getSnapshot());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5059 | <code>    ipcMain.handle('ailis:asset-packs-install-folder', (event) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5060 | <code>        installAssetPackFromFolder(BrowserWindow.fromWebContents(event.sender))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5061 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5062 | <code>    ipcMain.handle('ailis:asset-packs-install-sample', () =&gt; installBundledSampleAssetPack());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5063 | <code>    ipcMain.handle('ailis:asset-packs-activate', async (_event, payload = {}) =&gt; activateAssetPack(payload));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5064 | <code>    ipcMain.handle('ailis:asset-packs-reset-active', async (_event, payload = {}) =&gt; resetActiveAssetPack(payload));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5065 | <code>    ipcMain.handle('ailis:asset-packs-uninstall', async (_event, payload = {}) =&gt; uninstallAssetPack(payload));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5066 | <code>    ipcMain.handle('ailis:toggle-chat-window', () =&gt; toggleChatWindow());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5067 | <code>    ipcMain.handle('ailis:show-chat-window', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5068 | <code>        showChatWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5069 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5070 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5071 | <code>    ipcMain.handle('ailis:hide-chat-window', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5072 | <code>        hideChatWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5073 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5074 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5075 | <code>    ipcMain.handle('ailis:show-control-panel', () =&gt; showControlPanel());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5076 | <code>    ipcMain.handle('ailis:show-agent-lab', () =&gt; showAgentLabWindow());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5077 | <code>    ipcMain.handle('ailis:show-control-menu', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5078 | <code>        const sourceWindow = BrowserWindow.fromWebContents(event.sender);</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5079 | <code>        return showControlMenu(sourceWindow &#124;&#124; petWindow);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5080 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5081 | <code>    ipcMain.handle('ailis:show-text-edit-menu', (event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5082 | <code>        const sourceWindow = BrowserWindow.fromWebContents(event.sender);</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5083 | <code>        return showTextEditMenu(sourceWindow &#124;&#124; BrowserWindow.getFocusedWindow(), payload &#124;&#124; {});</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5084 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5085 | <code>    ipcMain.handle('ailis:minimize-current-window', (event) =&gt; minimizeWindowFromEvent(event));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5086 | <code>    ipcMain.handle('ailis:toggle-maximize-current-window', (event) =&gt; toggleMaximizeWindowFromEvent(event));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5087 | <code>    ipcMain.handle('ailis:get-current-window-state', (event) =&gt; getWindowControlState(getWindowFromIpcEvent(event)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5088 | <code>    ipcMain.handle('ailis:close-current-window', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5089 | <code>        const sourceWindow = BrowserWindow.fromWebContents(event.sender);</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5090 | <code>        sourceWindow?.hide();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5091 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5092 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5093 | <code>    ipcMain.handle('ailis:set-speech-mode', (_event, mode) =&gt; updateSpeechMode(mode));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5094 | <code>    ipcMain.handle('ailis:set-recognition-mode', (_event, mode) =&gt; updateRecognitionMode(mode));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5095 | <code>    ipcMain.handle('ailis:set-preferred-mic-device', (_event, deviceId) =&gt; updatePreferredMicDevice(deviceId));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5096 | <code>    ipcMain.handle('ailis:voice-runtime-diagnose', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5097 | <code>        getVoiceRuntimeBootstrap().diagnose()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5098 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5099 | <code>    ipcMain.handle('ailis:voice-runtime-status', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5100 | <code>        getVoiceRuntimeBootstrap().getBootstrapStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5101 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5102 | <code>    ipcMain.handle('ailis:voice-runtime-bootstrap', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5103 | <code>        bootstrapVoiceRuntime(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5104 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5105 | <code>    ipcMain.handle('ailis:runtime-components-status', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5106 | <code>        getRuntimeComponentsState()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5107 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5108 | <code>    ipcMain.handle('ailis:runtime-components-install', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5109 | <code>        installRuntimeComponents(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5110 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5111 | <code>    ipcMain.handle('ailis:runtime-assets-scan', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5112 | <code>        getRuntimeAssetManager().scan()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5113 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5114 | <code>    ipcMain.handle('ailis:runtime-assets-delete', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5115 | <code>        getRuntimeAssetManager().deleteAsset(payload?.assetId &#124;&#124; payload?.id &#124;&#124; '', payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5116 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5117 | <code>    ipcMain.handle('ailis:runtime-assets-choose-migration-root', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5118 | <code>        chooseRuntimeAssetMigrationRoot(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5119 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5120 | <code>    ipcMain.handle('ailis:runtime-assets-migrate', async (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5121 | <code>        const result = await getRuntimeAssetManager().migrateAsset(</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5122 | <code>            payload?.assetId &#124;&#124; payload?.id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5123 | <code>            payload?.targetRoot &#124;&#124; payload?.path &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5124 | <code>            payload &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5125 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5126 | <code>        if (result?.preferencePatch &amp;&amp; Object.keys(result.preferencePatch).length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5127 | <code>            applyPreferencesPatch(result.preferencePatch);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5128 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5129 | <code>        return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5130 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5131 | <code>    ipcMain.handle('ailis:set-pet-dialogue-expanded', (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5132 | <code>        setPetDialogueWindowExpanded(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5133 | <code>            Boolean(payload.expanded),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5134 | <code>            payload.extraTop,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5135 | <code>            payload.extraWidth</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5136 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5137 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5138 | <code>    ipcMain.handle('ailis:vision-capture', async (event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5139 | <code>        captureVisionSnapshot(event, payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5140 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5141 | <code>    ipcMain.handle('ailis:llm-health-check', async (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5142 | <code>        const currentSettings = getResolvedLlmSettings();</code> | 声明局部标识符 `currentSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5143 | <code>        const incomingSettings = payload?.settings &#124;&#124; {};</code> | 声明局部标识符 `incomingSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5144 | <code>        const incomingProvider = normalizeLlmProvider(</code> | 声明局部标识符 `incomingProvider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5145 | <code>            incomingSettings.provider &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5146 | <code>                incomingSettings.llmProvider &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5147 | <code>                currentSettings.provider</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5148 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5149 | <code>        const incomingApiKey = normalizeLlmApiKey(</code> | 声明局部标识符 `incomingApiKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5150 | <code>            incomingSettings.apiKey &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5151 | <code>                incomingSettings.llmApiKey &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5152 | <code>                ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5153 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5154 | <code>        const selectedApiKey = getPersistedLlmApiKeyById(</code> | 声明局部标识符 `selectedApiKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5155 | <code>            incomingProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5156 | <code>            incomingSettings.apiKeySelectedId &#124;&#124; incomingSettings.llmApiKeySelectedId &#124;&#124; ''</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5157 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5158 | <code>        const fallbackApiKey = isLocalLlmProvider(incomingProvider)</code> | 声明局部标识符 `fallbackApiKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5159 | <code>            ? selectedApiKey &#124;&#124; getPersistedLlmApiKeyForProvider(incomingProvider) &#124;&#124; getEnvironmentLlmApiKey(incomingProvider)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5160 | <code>            : selectedApiKey &#124;&#124; getPersistedLlmApiKeyForProvider(incomingProvider) &#124;&#124; getEnvironmentLlmApiKey(incomingProvider);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5161 | <code>        const settings = payload?.settings</code> | 声明局部标识符 `settings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5162 | <code>            ? buildTemporaryLlmSettings({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5163 | <code>                ...currentSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5164 | <code>                ...incomingSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5165 | <code>                provider: incomingProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5166 | <code>                apiKey: incomingApiKey &#124;&#124; fallbackApiKey &#124;&#124; ''</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5167 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5168 | <code>            : getResolvedLlmSettings();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5169 | <code>        return checkDesktopLlmProvider(settings, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5170 | <code>            includeToolCall: payload?.includeToolCall !== false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5171 | <code>            includeVision: payload?.includeVision !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5172 | <code>            timeoutMs: payload?.timeoutMs &#124;&#124; settings.timeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5173 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5174 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5175 | <code>    ipcMain.handle('ailis:vllm-model-catalog-search', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5176 | <code>        searchVllmModelCatalog(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5177 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5178 | <code>    ipcMain.handle('ailis:ollama-model-catalog-search', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5179 | <code>        searchOllamaModelCatalog(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5180 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5181 | <code>    ipcMain.handle('ailis:vllm-runtime-diagnose', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5182 | <code>        getVllmLocalDeployer().diagnose(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5183 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5184 | <code>    ipcMain.handle('ailis:vllm-runtime-status', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5185 | <code>        getVllmLocalDeployer().getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5186 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5187 | <code>    ipcMain.handle('ailis:vllm-runtime-deploy', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5188 | <code>        getVllmLocalDeployer().start(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5189 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5190 | <code>    ipcMain.handle('ailis:vllm-runtime-cancel', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5191 | <code>        getVllmLocalDeployer().cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5192 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5193 | <code>    ipcMain.handle('ailis:vllm-local-model-folder-choose', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5194 | <code>        chooseVllmLocalModelFolder()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5195 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5196 | <code>    ipcMain.handle('ailis:vllm-local-model-path-describe', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5197 | <code>        describeVllmLocalModelPath(payload?.path &#124;&#124; payload?.modelPath &#124;&#124; payload &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5198 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5199 | <code>    ipcMain.handle('ailis:vllm-download-folder-choose', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5200 | <code>        chooseVllmDownloadFolder(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5201 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5202 | <code>    ipcMain.handle('ailis:ollama-runtime-diagnose', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5203 | <code>        getOllamaLocalRuntime().diagnose(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5204 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5205 | <code>    ipcMain.handle('ailis:ollama-local-model-path-choose', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5206 | <code>        chooseOllamaLocalModelPath()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5207 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5208 | <code>    ipcMain.handle('ailis:ollama-local-model-path-describe', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5209 | <code>        describeOllamaLocalModelPath(payload?.path &#124;&#124; payload?.modelPath &#124;&#124; payload &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5210 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5211 | <code>    ipcMain.handle('ailis:ollama-runtime-status', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5212 | <code>        getOllamaLocalRuntime().getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5213 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5214 | <code>    ipcMain.handle('ailis:ollama-installed-models-inspect', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5215 | <code>        getOllamaLocalRuntime().inspectInstalledModels(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5216 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5217 | <code>    ipcMain.handle('ailis:ollama-runtime-deploy', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5218 | <code>        getOllamaLocalRuntime().start(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5219 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5220 | <code>    ipcMain.handle('ailis:ollama-runtime-cancel', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5221 | <code>        getOllamaLocalRuntime().cancel()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5222 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5223 | <code>    ipcMain.handle('ailis:memory-snapshot', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5224 | <code>        ensureAILISGateway().getMemorySnapshot(payload &#124;&#124; {})</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5225 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5226 | <code>    ipcMain.handle('ailis:memory-search', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5227 | <code>        ensureAILISGateway().searchMemory(payload.query &#124;&#124; payload.text &#124;&#124; '', payload &#124;&#124; {})</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5228 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5229 | <code>    ipcMain.handle('ailis:memory-update-block', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5230 | <code>        ensureAILISGateway().updateMemoryBlock(payload.key &#124;&#124; '', payload.value &#124;&#124; payload.content &#124;&#124; '')</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5231 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5232 | <code>    ipcMain.handle('ailis:memory-reset-affinity', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5233 | <code>        ensureAILISGateway().resetMemoryAffinity(payload.score)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5234 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5235 | <code>    ipcMain.handle('ailis:memory-clear', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5236 | <code>        ensureAILISGateway().clearMemory(payload &#124;&#124; {})</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5237 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5238 | <code>    ipcMain.handle('ailis:memory-forget', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5239 | <code>        ensureAILISGateway().forgetMemory(payload &#124;&#124; {})</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5240 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5241 | <code>    ipcMain.handle('ailis:memory-save-secret', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5242 | <code>        ensureAILISGateway().saveMemorySecret(payload &#124;&#124; {})</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5243 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5244 | <code>    ipcMain.handle('ailis:memory-delete-secret', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5245 | <code>        ensureAILISGateway().deleteMemorySecret(payload.name &#124;&#124; payload.id &#124;&#124; '')</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5246 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5247 | <code>    ipcMain.handle('ailis:raw-memory-status', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5248 | <code>        ensureAILISGateway().getRawMemoryStatus()</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5249 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5250 | <code>    ipcMain.handle('ailis:raw-memory-replay', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5251 | <code>        ensureAILISGateway().replayRawMemory(payload &#124;&#124; {})</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5252 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5253 | <code>    ipcMain.handle('ailis:raw-memory-sessions', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5254 | <code>        ensureAILISGateway().listRawMemorySessions(Number(payload.limit) &#124;&#124; 100)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5255 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5256 | <code>    ipcMain.handle('ailis:memory-profile-state', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5257 | <code>        ensureAILISGateway().getUserProfileCurationState()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5258 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5259 | <code>    ipcMain.handle('ailis:memory-profile-curate', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5260 | <code>        ensureAILISGateway().curateUserProfile(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5261 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5262 | <code>    ipcMain.handle('ailis:memory-profile-rebuild', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5263 | <code>        ensureAILISGateway().rebuildUserProfile(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5264 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5265 | <code>    ipcMain.handle('ailis:chat-history-load', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5266 | <code>        ensureAILISChatHistoryStore().getSession(payload.sessionId &#124;&#124; payload.sessionKey &#124;&#124; 'main')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5267 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5268 | <code>    ipcMain.handle('ailis:chat-history-save', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5269 | <code>        ensureAILISChatHistoryStore().saveSession(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5270 | <code>            payload.sessionId &#124;&#124; payload.sessionKey &#124;&#124; 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5271 | <code>            payload.messages &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5272 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5273 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5274 | <code>    ipcMain.handle('ailis:chat-history-clear', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5275 | <code>        ensureAILISChatHistoryStore().clearSession(payload.sessionId &#124;&#124; payload.sessionKey &#124;&#124; 'main')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5276 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5277 | <code>    ipcMain.handle('ailis:chat-history-status', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5278 | <code>        ensureAILISChatHistoryStore().getStatus()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5279 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5280 | <code>    ipcMain.on('ailis:vision-region-selected', (event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5281 | <code>        completeVisionRegionSelection(event, payload.selection &#124;&#124; payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5282 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5283 | <code>    ipcMain.on('ailis:vision-region-cancelled', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5284 | <code>        cancelVisionRegionSelection(event);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5285 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5286 | <code>    ipcMain.handle('ailis:llm-chat', async (_event, payload = {}) =&gt; callDesktopLlm(payload));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5287 | <code>    ipcMain.handle('ailis:tts-synthesize', async (_event, payload = {}) =&gt; callDesktopTts(payload));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5288 | <code>    ipcMain.handle('ailis:asr-transcribe', async (_event, audioBytes) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5289 | <code>        if (!desktopASRManager) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5290 | <code>            throw new Error('本地语音识别管理器尚未初始化');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 5291 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5293 | <code>        return desktopASRManager.transcribeAudioBytes(audioBytes);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5294 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5295 | <code>    ipcMain.handle('ailis:assistant-status', async () =&gt; getAssistantStatusSnapshot());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5296 | <code>    ipcMain.handle('ailis:assistant-tool-surface', async () =&gt; getAgentToolSurface());</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5297 | <code>    ipcMain.handle('ailis:assistant-validate-tool-surface', async () =&gt; validateAgentToolSurface());</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5298 | <code>    ipcMain.handle('ailis:assistant-history', async (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5299 | <code>        await syncAgentRuntimeSelection({ ensureReady: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5300 | <code>        return ensureAssistantGateway().getHistory(Number(payload.limit) &#124;&#124; 200);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5301 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5302 | <code>    ipcMain.handle('ailis:assistant-send-message', async (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5303 | <code>        await syncAgentRuntimeSelection({ ensureReady: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5304 | <code>        return ensureAssistantGateway().sendMessage(payload.content &#124;&#124; '', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5305 | <code>            timeoutMs: Number(payload.timeoutMs) &#124;&#124; undefined</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5306 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5307 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5308 | <code>    ipcMain.handle('ailis:assistant-abort-run', async (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5309 | <code>        await syncAgentRuntimeSelection({ ensureReady: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5310 | <code>        return ensureAssistantGateway().abortRun(payload.runId &#124;&#124; '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5311 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5312 | <code>    ipcMain.handle('ailis:assistant-list-sessions', async (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5313 | <code>        await syncAgentRuntimeSelection({ ensureReady: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5314 | <code>        return ensureAssistantGateway().listSessions(Number(payload.limit) &#124;&#124; 20);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5315 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5316 | <code>    ipcMain.handle('ailis:assistant-set-session-key', async (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5317 | <code>        await syncAgentRuntimeSelection({ ensureReady: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5318 | <code>        return ensureAssistantGateway().setSessionKey(payload.sessionKey &#124;&#124; '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5319 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5320 | <code>    ipcMain.handle('ailis:assistant-patch-session', async (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5321 | <code>        await syncAgentRuntimeSelection({ ensureReady: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5322 | <code>        return ensureAssistantGateway().patchSession(payload &#124;&#124; {});</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5323 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5324 | <code>    ipcMain.handle('ailis:gateway-status', async () =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5325 | <code>        getAILISGatewayStatusEnsuringStarted('status_request')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5326 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5327 | <code>    ipcMain.handle('ailis:gateway-tools-list', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5328 | <code>        await ensureAILISGatewayStarted('tools_list');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5329 | <code>        return ensureAILISGateway().listTools();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5330 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5331 | <code>    ipcMain.handle('ailis:gateway-tools-call', async (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5332 | <code>        await ensureAILISGatewayStarted('tool_call');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5333 | <code>        return ensureAILISGateway().callTool(payload &#124;&#124; {});</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5334 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5335 | <code>    ipcMain.handle('ailis:gateway-agent-run', async (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5336 | <code>        await ensureAILISGatewayStarted('agent_run');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5337 | <code>        return ensureAILISGateway().runAgent({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5338 | <code>            ...(payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5339 | <code>            llmSettings: payload?.llmSettings &#124;&#124; getResolvedLlmSettings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5340 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5341 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5342 | <code>    ipcMain.handle('ailis:gateway-agent-interrupt', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5343 | <code>        ensureAILISGateway().interruptAgentRun(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5344 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5345 | <code>    ipcMain.handle('ailis:gateway-audit-list', async (_event, payload = {}) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5346 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5347 | <code>        entries: await ensureAILISGateway().readAuditEntries(Number(payload.limit) &#124;&#124; 100)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5348 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5349 | <code>    ipcMain.handle('ailis:agent-lab-runs', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5350 | <code>        ensureAILISGateway().listAgentAnalysisRuns(Number(payload.limit) &#124;&#124; 40)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5351 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5352 | <code>    ipcMain.handle('ailis:agent-lab-analysis', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5353 | <code>        ensureAILISGateway().analyzeAgentRun(payload.runId &#124;&#124; '', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5354 | <code>            transcriptLimit: Number(payload.transcriptLimit &#124;&#124; payload.limit &#124;&#124; 2000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5355 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5356 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5357 | <code>    ipcMain.handle('ailis:agent-lab-run', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5358 | <code>        ensureAILISGateway().runAgentAnalysis({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5359 | <code>            ...(payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5360 | <code>            llmSettings: payload?.llmSettings &#124;&#124; getResolvedLlmSettings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5361 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5362 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5363 | <code>    ipcMain.handle('ailis:agent-lab-continue', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5364 | <code>        ensureAILISGateway().continueAgentAnalysis({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5365 | <code>            ...(payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5366 | <code>            llmSettings: payload?.llmSettings &#124;&#124; getResolvedLlmSettings()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5367 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5368 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5369 | <code>    ipcMain.handle('ailis:agent-lab-interrupt', async (_event, payload = {}) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5370 | <code>        ensureAILISGateway().interruptAgentRun({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5371 | <code>            ...(payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5372 | <code>            source: payload?.source &#124;&#124; 'agent-analysis-lab'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5373 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5374 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5376 | <code>    ipcMain.on('ailis:begin-drag-pet-window', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5377 | <code>        const sourceWindow = BrowserWindow.fromWebContents(event.sender);</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5378 | <code>        if (!petWindow &#124;&#124; sourceWindow !== petWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5379 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5380 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5381 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5382 | <code>        const cursor = screen.getCursorScreenPoint();</code> | 声明局部标识符 `cursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5383 | <code>        const baseBounds = petDialogueExpanded &amp;&amp; petDialogueCollapsedBounds</code> | 声明局部标识符 `baseBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5384 | <code>            ? { ...petDialogueCollapsedBounds }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5385 | <code>            : petWindow.getBounds();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5386 | <code>        petDragState = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5387 | <code>            cursor,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5388 | <code>            baseBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5389 | <code>            lastAppliedBounds: { ...baseBounds },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5390 | <code>            lastAppliedExpandedBounds: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5391 | <code>            wasExpanded: Boolean(petDialogueExpanded &amp;&amp; petDialogueCollapsedBounds),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5392 | <code>            extraTop: petDialogueExtraTop &#124;&#124; PET_DIALOGUE_DEFAULT_EXTRA_TOP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5393 | <code>            extraWidth: petDialogueExtraWidth &#124;&#124; PET_DIALOGUE_DEFAULT_EXTRA_WIDTH</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5394 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5395 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5396 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5397 | <code>    ipcMain.on('ailis:drag-pet-window', (event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5398 | <code>        if (!petWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5399 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5400 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5401 | <code>        const sourceWindow = BrowserWindow.fromWebContents(event.sender);</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5402 | <code>        if (sourceWindow &amp;&amp; sourceWindow !== petWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5403 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5404 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5405 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5406 | <code>        let deltaX = 0;</code> | 声明局部标识符 `deltaX`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5407 | <code>        let deltaY = 0;</code> | 声明局部标识符 `deltaY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5408 | <code>        if (petDragState?.cursor &amp;&amp; petDragState?.baseBounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5409 | <code>            const cursor = screen.getCursorScreenPoint();</code> | 声明局部标识符 `cursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5410 | <code>            deltaX = cursor.x - petDragState.cursor.x;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5411 | <code>            deltaY = cursor.y - petDragState.cursor.y;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5412 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5413 | <code>            const rawDeltaX = Number(payload.deltaX &#124;&#124; 0);</code> | 声明局部标识符 `rawDeltaX`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5414 | <code>            const rawDeltaY = Number(payload.deltaY &#124;&#124; 0);</code> | 声明局部标识符 `rawDeltaY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5415 | <code>            deltaX = Number.isFinite(rawDeltaX) ? rawDeltaX : 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5416 | <code>            deltaY = Number.isFinite(rawDeltaY) ? rawDeltaY : 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5417 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5419 | <code>        if (petDialogueExpanded &amp;&amp; petDialogueCollapsedBounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5420 | <code>            const baseBounds = petDragState?.baseBounds</code> | 声明局部标识符 `baseBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5421 | <code>                ? { ...petDragState.baseBounds }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5422 | <code>                : { ...petDialogueCollapsedBounds };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5423 | <code>            const movedBaseBounds = clampBoundsToDisplay({</code> | 声明局部标识符 `movedBaseBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5424 | <code>                ...baseBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5425 | <code>                x: Math.round(baseBounds.x + deltaX),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5426 | <code>                y: Math.round(baseBounds.y + deltaY)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5427 | <code>            }, PET_MIN_SIZE.width, PET_MIN_SIZE.height);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5428 | <code>            const layout = getPetDialogueExpandedLayout(</code> | 声明局部标识符 `layout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5429 | <code>                movedBaseBounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5430 | <code>                petDragState?.extraTop &#124;&#124; petDialogueExtraTop &#124;&#124; PET_DIALOGUE_DEFAULT_EXTRA_TOP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5431 | <code>                petDragState?.extraWidth &#124;&#124; petDialogueExtraWidth &#124;&#124; PET_DIALOGUE_DEFAULT_EXTRA_WIDTH</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5432 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5434 | <code>            petDialogueCollapsedBounds = layout.baseBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5435 | <code>            petDialogueExtraTop = layout.extraTop;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5436 | <code>            petDialogueExtraWidth = layout.extraWidth;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5437 | <code>            petDialogueExpanded = layout.extraTop &gt; 0 &#124;&#124; layout.extraWidth &gt; 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5438 | <code>            desktopState.petWindow.bounds = layout.baseBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5439 | <code>            desktopState.petWindow.visible = petWindow.isVisible();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5440 | <code>            if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5441 | <code>                petDragState?.lastAppliedExpandedBounds &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5442 | <code>                petDragState.lastAppliedExpandedBounds.x === layout.expandedBounds.x &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5443 | <code>                petDragState.lastAppliedExpandedBounds.y === layout.expandedBounds.y &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5444 | <code>                petDragState.lastAppliedExpandedBounds.width === layout.expandedBounds.width &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5445 | <code>                petDragState.lastAppliedExpandedBounds.height === layout.expandedBounds.height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5446 | <code>            ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5447 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5448 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5449 | <code>            if (petDragState) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5450 | <code>                petDragState.lastAppliedBounds = { ...layout.baseBounds };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5451 | <code>                petDragState.lastAppliedExpandedBounds = { ...layout.expandedBounds };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5452 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5453 | <code>            setPetWindowBoundsTransient(layout.expandedBounds);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5454 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5455 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5456 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5457 | <code>        const bounds = petDragState?.baseBounds</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5458 | <code>            ? { ...petDragState.baseBounds }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5459 | <code>            : petWindow.getBounds();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5460 | <code>        const nextBounds = clampBoundsToDisplay({</code> | 声明局部标识符 `nextBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5461 | <code>            ...bounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5462 | <code>            x: Math.round(bounds.x + deltaX),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5463 | <code>            y: Math.round(bounds.y + deltaY)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5464 | <code>        }, PET_MIN_SIZE.width, PET_MIN_SIZE.height);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5465 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5466 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5467 | <code>            petDragState?.lastAppliedBounds &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5468 | <code>            petDragState.lastAppliedBounds.x === nextBounds.x &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5469 | <code>            petDragState.lastAppliedBounds.y === nextBounds.y &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5470 | <code>            petDragState.lastAppliedBounds.width === nextBounds.width &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5471 | <code>            petDragState.lastAppliedBounds.height === nextBounds.height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5472 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5473 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5474 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5475 | <code>        if (petDragState) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5476 | <code>            petDragState.lastAppliedBounds = { ...nextBounds };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5477 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5478 | <code>        petWindow.setBounds(nextBounds);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5479 | <code>        desktopState.petWindow.bounds = nextBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5480 | <code>        desktopState.petWindow.visible = petWindow.isVisible();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5481 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5482 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5483 | <code>    ipcMain.on('ailis:end-drag-pet-window', (event) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5484 | <code>        const sourceWindow = BrowserWindow.fromWebContents(event.sender);</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5485 | <code>        if (sourceWindow &amp;&amp; sourceWindow !== petWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5486 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5487 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5488 | <code>        petDragState = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5489 | <code>        if (petWindow &amp;&amp; !petWindow.isDestroyed()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5490 | <code>            updateWindowState('petWindow', petWindow);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5491 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5492 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5494 | <code>    ipcMain.on('ailis:set-pet-mouse-passthrough', (event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5495 | <code>        const sourceWindow = BrowserWindow.fromWebContents(event.sender);</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5496 | <code>        if (!petWindow &#124;&#124; sourceWindow !== petWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5497 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 5498 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5499 | <code>        setPetMousePassthrough(Boolean(payload.enabled));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5500 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5501 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5502 | <code>    ipcMain.on('ailis:chat-send-message', (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5503 | <code>        petWindow?.webContents.send('ailis:chat-send-message', payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5504 | <code>        showChatWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5505 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5506 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5507 | <code>    ipcMain.on('ailis:chat-control', (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5508 | <code>        petWindow?.webContents.send('ailis:chat-control', payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5509 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5510 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5511 | <code>    ipcMain.on('ailis:pet-chat-event', (_event, payload = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5512 | <code>        if (chatWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5513 | <code>            chatWindow.webContents.send('ailis:chat-event', payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5514 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5515 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5517 | <code>    ipcMain.on('ailis:chat-state-sync-request', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5518 | <code>        petWindow?.webContents.send('ailis:chat-state-sync-request', {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5519 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5520 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5521 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5522 | <code>if (!app.requestSingleInstanceLock()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5523 | <code>    app.quit();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5524 | <code>} else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5525 | <code>    app.on('second-instance', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5526 | <code>        if (petWindow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5527 | <code>            petWindow.show();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5528 | <code>            petWindow.focus();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5529 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5530 | <code>        showChatWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5531 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5532 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5533 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5534 | <code>app.whenReady().then(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5535 | <code>    desktopState = loadDesktopState(app);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5536 | <code>    process.env.AILIS_PROJECT_ROOT = getProjectRoot();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5537 | <code>    process.env.AILIS_USER_DATA = app.getPath('userData');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5538 | <code>    configureCosyVoice3Runtime();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5539 | <code>    if (!desktopState.preferences.llmBaseUrl &#124;&#124; desktopState.preferences.llmBaseUrl === 'https://api.openai.com/v1') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5540 | <code>        desktopState.preferences.llmBaseUrl = DEFAULT_LLM_BASE_URL;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5541 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5542 | <code>    if (!desktopState.preferences.llmModel) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5543 | <code>        desktopState.preferences.llmModel = DEFAULT_LLM_MODEL;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5544 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5545 | <code>    desktopState.preferences.backendBaseUrl = resolveDesktopBackendBaseUrl();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5546 | <code>    desktopState.preferences.backendMode = normalizeBackendMode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5547 | <code>        desktopState.preferences.backendMode &#124;&#124; DEFAULT_BACKEND_MODE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5548 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5549 | <code>    desktopState.preferences.conversationMode = normalizeConversationMode(</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 5550 | <code>        desktopState.preferences.conversationMode &#124;&#124; DEFAULT_CONVERSATION_MODE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5551 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5552 | <code>    desktopState.preferences.agentRuntimeGatewayUrl = normalizeAgentRuntimeGatewayUrl(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5553 | <code>        desktopState.preferences.agentRuntimeGatewayUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5554 | <code>        desktopState.preferences.openclawGatewayUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5555 | <code>        DEFAULT_AGENT_RUNTIME_GATEWAY_URL</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5556 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5557 | <code>    desktopState.preferences.openclawGatewayUrl = normalizeAgentRuntimeGatewayUrl(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5558 | <code>        desktopState.preferences.openclawGatewayUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5559 | <code>        desktopState.preferences.agentRuntimeGatewayUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5560 | <code>        DEFAULT_AGENT_RUNTIME_GATEWAY_URL</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5561 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5562 | <code>    desktopState.preferences.llmProvider = normalizeLlmProvider(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5563 | <code>        desktopState.preferences.llmProvider &#124;&#124; DEFAULT_LLM_PROVIDER</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5564 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5565 | <code>    desktopState.preferences.llmBaseUrl = normalizeLlmBaseUrl(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5566 | <code>        desktopState.preferences.llmBaseUrl &#124;&#124; DEFAULT_LLM_BASE_URL</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5567 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5568 | <code>    desktopState.preferences.llmModel = normalizeLlmModel(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5569 | <code>        desktopState.preferences.llmModel &#124;&#124; DEFAULT_LLM_MODEL</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5570 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5571 | <code>    desktopState.preferences.llmApiKey = normalizeLlmApiKey(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5572 | <code>        desktopState.preferences.llmApiKey &#124;&#124; ''</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5573 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5574 | <code>    desktopState.preferences.llmTemperature = normalizeLlmTemperature(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5575 | <code>        desktopState.preferences.llmTemperature ?? DEFAULT_LLM_TEMPERATURE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5576 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5577 | <code>    desktopState.preferences.llmRequestTimeoutMs = normalizeLlmRequestTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5578 | <code>        desktopState.preferences.llmRequestTimeoutMs &#124;&#124; DEFAULT_LLM_REQUEST_TIMEOUT_MS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5579 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5580 | <code>    desktopState.preferences.elevenLabsApiBase = normalizeElevenLabsApiBase(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5581 | <code>        desktopState.preferences.elevenLabsApiBase &#124;&#124; DEFAULT_ELEVENLABS_API_BASE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5582 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5583 | <code>    desktopState.preferences.elevenLabsApiKey = normalizeElevenLabsApiKey(</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5584 | <code>        desktopState.preferences.elevenLabsApiKey &#124;&#124; DEFAULT_ELEVENLABS_API_KEY</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 5585 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5586 | <code>    desktopState.preferences.elevenLabsVoiceId = normalizeElevenLabsVoiceId(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5587 | <code>        desktopState.preferences.elevenLabsVoiceId &#124;&#124; DEFAULT_ELEVENLABS_VOICE_ID</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5588 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5589 | <code>    desktopState.preferences.elevenLabsModelId = normalizeElevenLabsModelId(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5590 | <code>        desktopState.preferences.elevenLabsModelId &#124;&#124; DEFAULT_ELEVENLABS_MODEL_ID</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5591 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5592 | <code>    desktopState.preferences.elevenLabsLanguageCode = normalizeElevenLabsLanguageCode(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5593 | <code>        desktopState.preferences.elevenLabsLanguageCode &#124;&#124; DEFAULT_ELEVENLABS_LANGUAGE_CODE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5594 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5595 | <code>    desktopState.preferences.elevenLabsOutputFormat = normalizeElevenLabsOutputFormat(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5596 | <code>        desktopState.preferences.elevenLabsOutputFormat &#124;&#124; DEFAULT_ELEVENLABS_OUTPUT_FORMAT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5597 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5598 | <code>    desktopState.preferences.elevenLabsTimeoutMs = normalizeElevenLabsTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5599 | <code>        desktopState.preferences.elevenLabsTimeoutMs &#124;&#124; DEFAULT_ELEVENLABS_TIMEOUT_MS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5600 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5601 | <code>    desktopState.preferences.elevenLabsOptimizeStreamingLatency = normalizeElevenLabsOptimizeStreamingLatency(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5602 | <code>        desktopState.preferences.elevenLabsOptimizeStreamingLatency ?? DEFAULT_ELEVENLABS_OPTIMIZE_STREAMING_LATENCY</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5603 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5604 | <code>    desktopState.preferences.elevenLabsStability = normalizeElevenLabsStability(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5605 | <code>        desktopState.preferences.elevenLabsStability ?? DEFAULT_ELEVENLABS_STABILITY</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5606 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5607 | <code>    desktopState.preferences.elevenLabsSimilarityBoost = normalizeElevenLabsSimilarityBoost(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5608 | <code>        desktopState.preferences.elevenLabsSimilarityBoost ?? DEFAULT_ELEVENLABS_SIMILARITY_BOOST</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5609 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5610 | <code>    desktopState.preferences.elevenLabsStyle = normalizeElevenLabsStyle(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5611 | <code>        desktopState.preferences.elevenLabsStyle ?? DEFAULT_ELEVENLABS_STYLE</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5612 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5613 | <code>    desktopState.preferences.elevenLabsSpeed = normalizeElevenLabsSpeed(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5614 | <code>        desktopState.preferences.elevenLabsSpeed ?? DEFAULT_ELEVENLABS_SPEED</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5615 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5616 | <code>    desktopState.preferences.elevenLabsUseSpeakerBoost = normalizeElevenLabsUseSpeakerBoost(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5617 | <code>        desktopState.preferences.elevenLabsUseSpeakerBoost ?? DEFAULT_ELEVENLABS_USE_SPEAKER_BOOST</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5618 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5619 | <code>    desktopState.preferences.elevenLabsVoiceProfiles = normalizeElevenLabsVoiceProfiles(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5620 | <code>        desktopState.preferences.elevenLabsVoiceProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5621 | <code>        desktopState.preferences</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5622 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5623 | <code>    desktopState.preferences.computerControlEnabled = normalizeComputerControlEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5624 | <code>        desktopState.preferences.computerControlEnabled ?? DEFAULT_COMPUTER_CONTROL_ENABLED</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5625 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5626 | <code>    desktopState.preferences.chunkedTtsEnabled = normalizeChunkedTtsEnabled(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5627 | <code>        desktopState.preferences.chunkedTtsEnabled ?? DEFAULT_CHUNKED_TTS_ENABLED</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5628 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5629 | <code>    desktopState = saveDesktopState(app, desktopState);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5630 | <code>    desktopASRManager = new DesktopASRManager({ app });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5631 | <code>    Menu.setApplicationMenu(null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5632 | <code>    registerMediaPermissionHandlers();</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 5633 | <code>    protocol.handle(LOCAL_RESOURCE_PROTOCOL, handleLocalResourceProtocol);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5634 | <code>    protocol.handle(ASSET_PACK_PROTOCOL, handleAssetPackProtocol);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5635 | <code>    protocol.handle(SPEECH_MODEL_PROTOCOL, handleSpeechModelProtocol);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5636 | <code>    registerIpc();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5637 | <code>    void ensureAILISGatewayStarted('app_ready').catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5638 | <code>        console.warn('[ailis-gateway] 启动失败：', error.message &#124;&#124; error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5639 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5640 | <code>    createPetWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5641 | <code>    createChatWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5642 | <code>    if (desktopState.controlWindow?.visible) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5643 | <code>        createControlWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5644 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5645 | <code>    createTray();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5646 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5647 | <code>    setTimeout(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5648 | <code>        desktopASRManager?.warmup?.().catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5649 | <code>            console.warn('[ASR] 后台预热失败：', error.message &#124;&#124; error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5650 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5651 | <code>    }, 4000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5652 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5653 | <code>    const initialSpeechMode = normalizeSpeechMode(desktopState?.preferences?.speechMode);</code> | 声明局部标识符 `initialSpeechMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5654 | <code>    warmupDesktopSpeechMode(initialSpeechMode, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5655 | <code>        delayMs: COSYVOICE3_WARMUP_DELAY_MS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5656 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5657 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5658 | <code>    app.on('activate', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5659 | <code>        if (BrowserWindow.getAllWindows().length === 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5660 | <code>            createPetWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5661 | <code>            createChatWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5662 | <code>            if (desktopState.controlWindow?.visible) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5663 | <code>                createControlWindow();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5664 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5665 | <code>            if (!tray) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5666 | <code>                createTray();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5667 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5668 | <code>        } else if (petWindow) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5669 | <code>            petWindow.show();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5670 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5671 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5672 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5674 | <code>app.on('before-quit', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5675 | <code>    console.log('[app] before-quit');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5676 | <code>    isQuitting = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5677 | <code>    if (visionRegionSelectionRequest) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 5678 | <code>        cancelVisionRegionSelection();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5679 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5680 | <code>    desktopASRManager?.close?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5681 | <code>    const gatewayShutdown = assistantGateway?.shutdown?.();</code> | 声明局部标识符 `gatewayShutdown`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5682 | <code>    gatewayShutdown?.catch?.(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5683 | <code>    const runtimeShutdown = agentRuntimeSupervisor?.shutdown?.();</code> | 声明局部标识符 `runtimeShutdown`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5684 | <code>    runtimeShutdown?.catch?.(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5685 | <code>    const humanGatewayShutdown = ailisGateway?.stop?.();</code> | 声明局部标识符 `humanGatewayShutdown`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5686 | <code>    humanGatewayShutdown?.catch?.(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5687 | <code>    closeCosyVoice3TTS();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5688 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5689 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5690 | <code>app.on('will-quit', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5691 | <code>    console.log('[app] will-quit');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5692 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5694 | <code>app.on('quit', (_event, exitCode) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5695 | <code>    console.log('[app] quit', { exitCode });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5696 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5697 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5698 | <code>app.on('window-all-closed', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5699 | <code>    console.log('[app] window-all-closed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5700 | <code>    // 托盘常驻形态下，窗口全部关闭并不等于退出应用。</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。”这一文件职责。 |
| 5701 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
