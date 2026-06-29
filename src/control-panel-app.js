import {
    UI_LANGUAGE_NATIVE_LABELS,
    applyI18n,
    normalizeUiLanguage,
    setUiLanguage,
    t
} from './i18n.js';

const elements = {
    appVersion: document.getElementById('app-version'),
    avatarBubbleAvatarPreview: document.getElementById('avatar-bubble-avatar-preview'),
    avatarBubbleEditor: document.getElementById('avatar-bubble-editor'),
    avatarBubbleExtraWidth: document.getElementById('avatar-bubble-extra-width'),
    avatarBubbleExtraWidthValue: document.getElementById('avatar-bubble-extra-width-value'),
    avatarBubbleExtraTop: document.getElementById('avatar-bubble-extra-top'),
    avatarBubbleExtraTopValue: document.getElementById('avatar-bubble-extra-top-value'),
    avatarBubbleLeft: document.getElementById('avatar-bubble-left'),
    avatarBubbleLeftValue: document.getElementById('avatar-bubble-left-value'),
    avatarBubblePreview: document.getElementById('avatar-bubble-preview'),
    avatarBubbleScale: document.getElementById('avatar-bubble-scale'),
    avatarBubbleScaleValue: document.getElementById('avatar-bubble-scale-value'),
    avatarBubbleTop: document.getElementById('avatar-bubble-top'),
    avatarBubbleTopValue: document.getElementById('avatar-bubble-top-value'),
    avatarBubbleWindowPreview: document.getElementById('avatar-bubble-window-preview'),
    avatarBubbleWindowResize: document.getElementById('avatar-bubble-window-resize'),
    cameraDistance: document.getElementById('camera-distance'),
    cameraDistanceValue: document.getElementById('camera-distance-value'),
    cameraHeight: document.getElementById('camera-height'),
    cameraHeightValue: document.getElementById('camera-height-value'),
    cameraTargetY: document.getElementById('camera-target-y'),
    cameraTargetYValue: document.getElementById('camera-target-y-value'),
    chunkedTtsEnabled: document.getElementById('chunked-tts-enabled'),
    closeBtn: document.getElementById('close-btn'),
    computerControlEnabled: document.getElementById('computer-control-enabled'),
    conversationMode: document.getElementById('conversation-mode'),
    characterActiveSummary: document.getElementById('character-active-summary'),
    characterActiveType: document.getElementById('character-active-type'),
    characterInstallFolderBtn: document.getElementById('character-install-folder-btn'),
    characterInstallSampleBtn: document.getElementById('character-install-sample-btn'),
    characterPackList: document.getElementById('character-pack-list'),
    characterPackRoot: document.getElementById('character-pack-root'),
    characterResetActiveBtn: document.getElementById('character-reset-active-btn'),
    clearElevenLabsKeyBtn: document.getElementById('clear-elevenlabs-key-btn'),
    clearLlmKeyBtn: document.getElementById('clear-llm-key-btn'),
    clearEmailQqSecretBtn: document.getElementById('clear-email-qq-secret-btn'),
    clearEmailGmailSecretBtn: document.getElementById('clear-email-gmail-secret-btn'),
    clearEmailOutlookSecretBtn: document.getElementById('clear-email-outlook-secret-btn'),
    emailQqAccount: document.getElementById('email-qq-account'),
    emailQqSecret: document.getElementById('email-qq-secret'),
    emailQqState: document.getElementById('email-qq-state'),
    emailGmailAccount: document.getElementById('email-gmail-account'),
    emailGmailSecret: document.getElementById('email-gmail-secret'),
    emailGmailState: document.getElementById('email-gmail-state'),
    emailOutlookAccount: document.getElementById('email-outlook-account'),
    emailOutlookSecret: document.getElementById('email-outlook-secret'),
    emailOutlookState: document.getElementById('email-outlook-state'),
    elevenLabsApiBase: document.getElementById('elevenlabs-api-base'),
    elevenLabsApiKey: document.getElementById('elevenlabs-api-key'),
    elevenLabsKeyState: document.getElementById('elevenlabs-key-state'),
    elevenLabsLanguageCode: document.getElementById('elevenlabs-language-code'),
    elevenLabsModelId: document.getElementById('elevenlabs-model-id'),
    elevenLabsOptimizeLatency: document.getElementById('elevenlabs-optimize-latency'),
    elevenLabsOptimizeLatencyValue: document.getElementById('elevenlabs-optimize-latency-value'),
    elevenLabsOutputFormat: document.getElementById('elevenlabs-output-format'),
    elevenLabsSimilarity: document.getElementById('elevenlabs-similarity'),
    elevenLabsSimilarityValue: document.getElementById('elevenlabs-similarity-value'),
    elevenLabsSpeakerBoost: document.getElementById('elevenlabs-speaker-boost'),
    elevenLabsSpeed: document.getElementById('elevenlabs-speed'),
    elevenLabsSpeedValue: document.getElementById('elevenlabs-speed-value'),
    elevenLabsStability: document.getElementById('elevenlabs-stability'),
    elevenLabsStabilityValue: document.getElementById('elevenlabs-stability-value'),
    elevenLabsStyle: document.getElementById('elevenlabs-style'),
    elevenLabsStyleValue: document.getElementById('elevenlabs-style-value'),
    elevenLabsTimeout: document.getElementById('elevenlabs-timeout'),
    elevenLabsVoiceId: document.getElementById('elevenlabs-voice-id'),
    llmApiKey: document.getElementById('llm-api-key'),
    llmApiKeyLabel: document.getElementById('llm-api-key-label'),
    llmApiKeySelect: document.getElementById('llm-api-key-select'),
    llmBaseUrl: document.getElementById('llm-base-url'),
    llmCapabilityState: document.getElementById('llm-capability-state'),
    llmHealthCheckBtn: document.getElementById('llm-health-check-btn'),
    llmHealthState: document.getElementById('llm-health-state'),
    llmKeyState: document.getElementById('llm-key-state'),
    llmModelCard: document.getElementById('llm-model-card'),
    llmModelHelp: document.getElementById('llm-model-help'),
    llmModelLabel: document.getElementById('llm-model-label'),
    modelActiveBase: document.getElementById('model-active-base'),
    modelActiveKey: document.getElementById('model-active-key'),
    modelActiveModel: document.getElementById('model-active-model'),
    modelActiveNextStep: document.getElementById('model-active-next-step'),
    modelActiveProvider: document.getElementById('model-active-provider'),
    modelActiveRuntime: document.getElementById('model-active-runtime'),
    modelActiveSubtitle: document.getElementById('model-active-subtitle'),
    modelActiveSummary: document.getElementById('model-active-summary'),
    llmModel: document.getElementById('llm-model'),
    llmModelPreset: document.getElementById('llm-model-preset'),
    llmPreset: document.getElementById('llm-preset'),
    llmPresetHelp: document.getElementById('llm-preset-help'),
    llmProvider: document.getElementById('llm-provider'),
    llmSetupHelp: document.getElementById('llm-setup-help'),
    llmTemperature: document.getElementById('llm-temperature'),
    llmTemperatureValue: document.getElementById('llm-temperature-value'),
    llmTimeout: document.getElementById('llm-timeout'),
    localLlmRuntimeCopy: document.getElementById('local-llm-runtime-copy'),
    localLlmRuntimePanel: document.getElementById('local-llm-runtime-panel'),
    localLlmRuntimeTitle: document.getElementById('local-llm-runtime-title'),
    ollamaRuntimeCheckBtn: document.getElementById('ollama-runtime-check-btn'),
    ollamaRuntimeCancelBtn: document.getElementById('ollama-runtime-cancel-btn'),
    ollamaRuntimeDeployBtn: document.getElementById('ollama-runtime-deploy-btn'),
    ollamaLocalModelBrowseBtn: document.getElementById('ollama-local-model-browse-btn'),
    ollamaLocalModelClearBtn: document.getElementById('ollama-local-model-clear-btn'),
    ollamaLocalModelPath: document.getElementById('ollama-local-model-path'),
    ollamaLocalModelStatus: document.getElementById('ollama-local-model-status'),
    ollamaLocalModelUseBtn: document.getElementById('ollama-local-model-use-btn'),
    ollamaInstalledModelId: document.getElementById('ollama-installed-model-id'),
    ollamaInstalledModelList: document.getElementById('ollama-installed-model-list'),
    ollamaInstalledModelRefreshBtn: document.getElementById('ollama-installed-model-refresh-btn'),
    ollamaInstalledModelStatus: document.getElementById('ollama-installed-model-status'),
    ollamaInstalledModelUseBtn: document.getElementById('ollama-installed-model-use-btn'),
    ollamaInstalledModelSection: document.getElementById('ollama-installed-model-section'),
    ollamaLocalModelSection: document.getElementById('ollama-local-model-section'),
    ollamaOnlineModelSection: document.getElementById('ollama-online-model-section'),
    ollamaModelCatalog: document.getElementById('ollama-model-catalog'),
    ollamaModelCatalogStatus: document.getElementById('ollama-model-catalog-status'),
    ollamaModelQuery: document.getElementById('ollama-model-query'),
    ollamaModelSearchBtn: document.getElementById('ollama-model-search-btn'),
    ollamaModelUseBtn: document.getElementById('ollama-model-use-btn'),
    ollamaRuntimeLog: document.getElementById('ollama-runtime-log'),
    ollamaRuntimePanel: document.getElementById('ollama-runtime-panel'),
    ollamaRuntimeStatus: document.getElementById('ollama-runtime-status'),
    ollamaTargetCopy: document.getElementById('ollama-target-copy'),
    ollamaTargetModel: document.getElementById('ollama-target-model'),
    ollamaUsedModelList: document.getElementById('ollama-used-model-list'),
    ollamaUsedModelStatus: document.getElementById('ollama-used-model-status'),
    ollamaUsedModelUseBtn: document.getElementById('ollama-used-model-use-btn'),
    vllmModelApplyBtn: document.getElementById('vllm-model-apply-btn'),
    vllmModelCatalog: document.getElementById('vllm-model-catalog'),
    vllmModelCatalogPanel: document.getElementById('vllm-model-catalog-panel'),
    vllmModelCatalogStatus: document.getElementById('vllm-model-catalog-status'),
    vllmModelQuery: document.getElementById('vllm-model-query'),
    vllmModelRefreshBtn: document.getElementById('vllm-model-refresh-btn'),
    vllmModelSource: document.getElementById('vllm-model-source'),
    vllmDownloadDir: document.getElementById('vllm-download-dir'),
    vllmDownloadDirBrowseBtn: document.getElementById('vllm-download-dir-browse-btn'),
    vllmDownloadDirStatus: document.getElementById('vllm-download-dir-status'),
    vllmLocalModelBrowseBtn: document.getElementById('vllm-local-model-browse-btn'),
    vllmLocalModelPath: document.getElementById('vllm-local-model-path'),
    vllmLocalModelStatus: document.getElementById('vllm-local-model-status'),
    vllmLocalModelUseBtn: document.getElementById('vllm-local-model-use-btn'),
    vllmLocalServedName: document.getElementById('vllm-local-served-name'),
    vllmOnlineModelDeployBtn: document.getElementById('vllm-online-model-deploy-btn'),
    vllmRuntimeCancelBtn: document.getElementById('vllm-runtime-cancel-btn'),
    vllmRuntimeDeployBtn: document.getElementById('vllm-runtime-deploy-btn'),
    vllmRuntimeDiagnoseBtn: document.getElementById('vllm-runtime-diagnose-btn'),
    vllmRuntimeLog: document.getElementById('vllm-runtime-log'),
    vllmRuntimeStatus: document.getElementById('vllm-runtime-status'),
    micHelp: document.getElementById('mic-help'),
    memoryBlockList: document.getElementById('memory-block-list'),
    memoryPathText: document.getElementById('memory-path-text'),
    memoryStatusText: document.getElementById('memory-status-text'),
    ailisStateDir: document.getElementById('ailis-state-dir'),
    ailisStateDirHelp: document.getElementById('ailis-state-dir-help'),
    chooseAILISStateDirBtn: document.getElementById('choose-ailis-state-dir-btn'),
    resetAILISStateDirBtn: document.getElementById('reset-ailis-state-dir-btn'),
    agentRuntimeDetailText: document.getElementById('agent-runtime-detail-text'),
    agentRuntimeStatusText: document.getElementById('agent-runtime-status-text'),
    openAgentLabBtn: document.getElementById('open-agent-lab-btn'),
    packageStateText: document.getElementById('package-state-text'),
    petMouseHitTestEnabled: document.getElementById('pet-mouse-hit-test-enabled'),
    petMouseHitTestShape: document.getElementById('pet-mouse-hit-test-shape'),
    petMouseHitTestWidth: document.getElementById('pet-mouse-hit-test-width'),
    petMouseHitTestWidthValue: document.getElementById('pet-mouse-hit-test-width-value'),
    petMouseHitTestHeight: document.getElementById('pet-mouse-hit-test-height'),
    petMouseHitTestHeightValue: document.getElementById('pet-mouse-hit-test-height-value'),
    petMouseHitTestOffsetX: document.getElementById('pet-mouse-hit-test-offset-x'),
    petMouseHitTestOffsetXValue: document.getElementById('pet-mouse-hit-test-offset-x-value'),
    petMouseHitTestOffsetY: document.getElementById('pet-mouse-hit-test-offset-y'),
    petMouseHitTestOffsetYValue: document.getElementById('pet-mouse-hit-test-offset-y-value'),
    petMouseHitTestDebug: document.getElementById('pet-mouse-hit-test-debug'),
    petScale: document.getElementById('pet-scale'),
    preferredMic: document.getElementById('preferred-mic'),
    petShowTaskbar: document.getElementById('pet-show-taskbar'),
    recognitionMode: document.getElementById('recognition-mode'),
    recognitionModeText: document.getElementById('recognition-mode-text'),
    refreshMemoryBtn: document.getElementById('refresh-memory-btn'),
    refreshMicsBtn: document.getElementById('refresh-mics-btn'),
    clearMemoryBtn: document.getElementById('clear-memory-btn'),
    resetAffinityBtn: document.getElementById('reset-affinity-btn'),
    resetBtn: document.getElementById('reset-btn'),
    renderAmbientFill: document.getElementById('render-ambient-fill'),
    renderAmbientFillValue: document.getElementById('render-ambient-fill-value'),
    renderAntialiasEnabled: document.getElementById('render-antialias-enabled'),
    renderFpsLimit: document.getElementById('render-fps-limit'),
    renderFpsLimitValue: document.getElementById('render-fps-limit-value'),
    renderKeyLight: document.getElementById('render-key-light'),
    renderKeyLightValue: document.getElementById('render-key-light-value'),
    renderLightYaw: document.getElementById('render-light-yaw'),
    renderLightYawValue: document.getElementById('render-light-yaw-value'),
    renderOutlineEnabled: document.getElementById('render-outline-enabled'),
    renderOutlineScale: document.getElementById('render-outline-scale'),
    renderOutlineScaleValue: document.getElementById('render-outline-scale-value'),
    renderProfile: document.getElementById('render-profile'),
    renderResolutionScale: document.getElementById('render-resolution-scale'),
    renderResolutionScaleValue: document.getElementById('render-resolution-scale-value'),
    renderShadowEnabled: document.getElementById('render-shadow-enabled'),
    renderShadowQuality: document.getElementById('render-shadow-quality'),
    renderShadowQualityValue: document.getElementById('render-shadow-quality-value'),
    saveBtn: document.getElementById('save-btn'),
    speechMode: document.getElementById('speech-mode'),
    statusText: document.getElementById('status-text'),
    ttsPitch: document.getElementById('tts-pitch'),
    ttsPitchValue: document.getElementById('tts-pitch-value'),
    ttsRate: document.getElementById('tts-rate'),
    ttsRateValue: document.getElementById('tts-rate-value'),
    ttsVolume: document.getElementById('tts-volume'),
    ttsVolumeValue: document.getElementById('tts-volume-value'),
    uiLanguage: document.getElementById('ui-language'),
    userDataPath: document.getElementById('user-data-path'),
    voiceRuntimeBootstrapBtn: document.getElementById('voice-runtime-bootstrap-btn'),
    voiceRuntimeBrowseBtn: document.getElementById('voice-runtime-browse-btn'),
    voiceRuntimeDiagnoseBtn: document.getElementById('voice-runtime-diagnose-btn'),
    voiceRuntimeLog: document.getElementById('voice-runtime-log'),
    voiceRuntimePathHelp: document.getElementById('voice-runtime-path-help'),
    voiceRuntimePlan: document.getElementById('voice-runtime-plan'),
    voiceRuntimeRoot: document.getElementById('voice-runtime-root'),
    voiceRuntimeStatus: document.getElementById('voice-runtime-status'),
    runtimeComponentsInstallBtn: document.getElementById('runtime-components-install-btn'),
    runtimeComponentsLog: document.getElementById('runtime-components-log'),
    runtimeComponentsPlan: document.getElementById('runtime-components-plan'),
    runtimeComponentsRefreshBtn: document.getElementById('runtime-components-refresh-btn'),
    runtimeComponentsStatus: document.getElementById('runtime-components-status')
};

const CONTROL_PAGE_ORDER = Object.freeze(['overview', 'appearance', 'agent', 'model', 'voice', 'advanced']);
const CONTROL_PAGE_DEFAULT = CONTROL_PAGE_ORDER[0];

function normalizeControlPageId(value) {
    const pageId = String(value || '').replace(/^#/, '').replace(/^page-/, '').trim();
    return CONTROL_PAGE_ORDER.includes(pageId) ? pageId : CONTROL_PAGE_DEFAULT;
}

function getInitialControlPageId() {
    return normalizeControlPageId(window.location.hash || CONTROL_PAGE_DEFAULT);
}

function setActiveControlPage(pageId, { updateHash = true, resetScroll = true } = {}) {
    const nextPageId = normalizeControlPageId(pageId);
    document.querySelectorAll('.control-page').forEach((page) => {
        const active = page.dataset.controlPage === nextPageId;
        page.classList.toggle('is-active', active);
        page.hidden = !active;
    });

    document.querySelectorAll('[data-control-page-target]').forEach((control) => {
        const active = control.dataset.controlPageTarget === nextPageId;
        control.classList.toggle('is-active', active);
        if (control.getAttribute('role') === 'tab') {
            control.setAttribute('aria-selected', active ? 'true' : 'false');
            control.tabIndex = active ? 0 : -1;
        }
    });

    if (resetScroll) {
        document.getElementById('content')?.scrollTo({ top: 0, behavior: 'auto' });
    }

    if (updateHash) {
        const nextUrl = `${window.location.pathname}${window.location.search}#${nextPageId}`;
        window.history.replaceState(null, '', nextUrl);
    }

    requestAnimationFrame(() => {
        syncDialoguePreview();
    });
}

function initializeControlPageNavigation() {
    document.querySelectorAll('[data-control-page-target]').forEach((control) => {
        control.addEventListener('click', () => {
            setActiveControlPage(control.dataset.controlPageTarget);
        });
    });

    document.querySelectorAll('#control-nav [role="tab"]').forEach((tab, index, tabs) => {
        tab.addEventListener('keydown', (event) => {
            const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
            if (!direction) {
                return;
            }
            event.preventDefault();
            const nextTab = tabs[(index + direction + tabs.length) % tabs.length];
            nextTab.focus();
            setActiveControlPage(nextTab.dataset.controlPageTarget);
        });
    });

    window.addEventListener('hashchange', () => {
        setActiveControlPage(getInitialControlPageId(), { updateHash: false });
    });

    setActiveControlPage(getInitialControlPageId(), { updateHash: false, resetScroll: false });
}

const speechModeLabels = {
    off: '关闭语音',
    server: 'ElevenLabs 云端语音',
    cosyvoice3: 'CosyVoice3 本地高质量',
};

const recognitionModeLabels = {
    'fast-vad': '快速 ASR：低延迟按钮',
    'auto-vad': '按钮开启 ASR',
    continuous: '自动 ASR 常驻检测',
    manual: '手动开始/停止'
};

const conversationModeLabels = {
    assistant: '助手模式：任务执行',
    daily: '日常对话：低延迟'
};

const elevenLabsLanguagePresets = {
    zh: {
        label: '中文温柔二次元',
        modelId: 'eleven_multilingual_v2',
        outputFormat: 'mp3_44100_128',
        optimizeStreamingLatency: 0,
        stability: 0.58,
        similarityBoost: 0.78,
        style: 0.05,
        speed: 0.9,
        useSpeakerBoost: true
    },
    en: {
        label: 'English gentle anime',
        modelId: 'eleven_multilingual_v2',
        outputFormat: 'mp3_44100_128',
        optimizeStreamingLatency: 0,
        stability: 0.55,
        similarityBoost: 0.8,
        style: 0.08,
        speed: 0.92,
        useSpeakerBoost: true
    },
    ja: {
        label: '日本語やさしいアニメ',
        modelId: 'eleven_multilingual_v2',
        outputFormat: 'mp3_44100_128',
        optimizeStreamingLatency: 0,
        stability: 0.52,
        similarityBoost: 0.78,
        style: 0.08,
        speed: 0.88,
        useSpeakerBoost: true
    },
    ko: {
        label: '한국어 gentle anime',
        modelId: 'eleven_multilingual_v2',
        outputFormat: 'mp3_44100_128',
        optimizeStreamingLatency: 0,
        stability: 0.54,
        similarityBoost: 0.78,
        style: 0.08,
        speed: 0.9,
        useSpeakerBoost: true
    }
};
const ELEVENLABS_LANGUAGE_CODES = Object.freeze(Object.keys(elevenLabsLanguagePresets));

const llmProviderLabels = {
    'openai-compatible': 'OpenAI-compatible',
    'openai-responses': 'OpenAI Responses',
    anthropic: 'Anthropic Claude',
    gemini: 'Google Gemini',
    ollama: 'Ollama 本地'
};

const fallbackLlmProviderDefaultBaseUrls = {
    'openai-compatible': 'https://ark.cn-beijing.volces.com/api/v3',
    'openai-responses': 'https://api.openai.com/v1',
    anthropic: 'https://api.anthropic.com',
    gemini: 'https://generativelanguage.googleapis.com/v1beta',
    ollama: 'http://127.0.0.1:11434'
};

const fallbackLlmProviderDefaultModels = {
    'openai-compatible': 'doubao-seed-2-0-mini-260215',
    'openai-responses': 'gpt-4.1-mini',
    anthropic: 'claude-3-5-haiku-latest',
    gemini: 'gemini-2.0-flash',
    ollama: 'qwen2.5:1.5b'
};

const LLM_PRESET_CUSTOM_ID = 'custom';
const llmPresetCatalog = [
    {
        id: 'doubao',
        label: '豆包 / 火山方舟',
        help: '国内低延迟优先；日常对话建议 mini，复杂任务建议 pro。',
        provider: 'openai-compatible',
        baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
        models: [
            { id: 'doubao-seed-2-0-mini-260215', label: 'Doubao Seed 2.0 Mini（低延迟）' },
            { id: 'doubao-seed-2-0-pro-260215', label: 'Doubao Seed 2.0 Pro（复杂任务）' }
        ]
    },
    {
        id: 'openai',
        label: 'OpenAI',
        help: '使用 OpenAI Responses API；适合高质量通用任务。',
        provider: 'openai-responses',
        baseUrl: 'https://api.openai.com/v1',
        models: [
            { id: 'gpt-4.1-mini', label: 'GPT-4.1 mini（较快）' },
            { id: 'gpt-4.1', label: 'GPT-4.1（更强）' }
        ]
    },
    {
        id: 'anthropic',
        label: 'Anthropic Claude',
        help: '适合长文、代码和稳健推理；需要 Anthropic API Key。',
        provider: 'anthropic',
        baseUrl: 'https://api.anthropic.com',
        models: [
            { id: 'claude-3-5-haiku-latest', label: 'Claude Haiku（低延迟）' },
            { id: 'claude-3-5-sonnet-latest', label: 'Claude Sonnet（更强）' }
        ]
    },
    {
        id: 'gemini',
        label: 'Google Gemini',
        help: '适合低延迟和多模态场景；需要 Google Gemini API Key。',
        provider: 'gemini',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        models: [
            { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash（低延迟）' },
            { id: 'gemini-2.0-pro', label: 'Gemini 2.0 Pro（更强）' }
        ]
    },
    {
        id: 'deepseek',
        label: 'DeepSeek',
        help: 'OpenAI-compatible；复杂任务建议 V4 Pro，低延迟任务建议 V4 Flash。',
        provider: 'openai-compatible',
        baseUrl: 'https://api.deepseek.com',
        models: [
            { id: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro（复杂任务）' },
            { id: 'deepseek-v4-flash', label: 'DeepSeek V4 Flash（低延迟）' }
        ]
    },
    {
        id: 'qwen',
        label: '通义千问 / DashScope',
        help: 'OpenAI-compatible 兼容模式；适合中文和通用任务。',
        provider: 'openai-compatible',
        baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        models: [
            { id: 'qwen-turbo', label: 'Qwen Turbo（低延迟）' },
            { id: 'qwen-plus', label: 'Qwen Plus（均衡）' },
            { id: 'qwen-max', label: 'Qwen Max（更强）' }
        ]
    },
    {
        id: 'kimi',
        label: 'Kimi / Moonshot',
        help: 'OpenAI-compatible；适合中文长上下文和资料阅读。',
        provider: 'openai-compatible',
        baseUrl: 'https://api.moonshot.cn/v1',
        models: [
            { id: 'moonshot-v1-8k', label: 'Moonshot 8K（低延迟）' },
            { id: 'moonshot-v1-32k', label: 'Moonshot 32K' },
            { id: 'moonshot-v1-128k', label: 'Moonshot 128K（长上下文）' }
        ]
    },
    {
        id: 'zhipu',
        label: '智谱 GLM',
        help: 'OpenAI-compatible；适合中文通用任务。',
        provider: 'openai-compatible',
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
        models: [
            { id: 'glm-4-flash', label: 'GLM-4 Flash（低延迟）' },
            { id: 'glm-4-plus', label: 'GLM-4 Plus（更强）' }
        ]
    },
    {
        id: 'openrouter',
        label: 'OpenRouter',
        help: '一个 Key 接多家模型；模型 ID 可以在高级模型 ID 中自行替换。',
        provider: 'openai-compatible',
        baseUrl: 'https://openrouter.ai/api/v1',
        models: [
            { id: 'openai/gpt-4.1-mini', label: 'OpenAI GPT-4.1 mini' },
            { id: 'anthropic/claude-3.5-haiku', label: 'Claude Haiku' },
            { id: 'google/gemini-2.0-flash-001', label: 'Gemini Flash' },
            { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat' }
        ]
    },
    {
        id: 'ollama',
        label: 'Ollama 本地',
        help: '本机离线模型；Base 填服务根地址，不要加 /api/chat。模型名必须和 ollama list 里的名字一致，API Key 通常留空。',
        provider: 'ollama',
        baseUrl: 'http://127.0.0.1:11434',
        models: [
            { id: 'qwen2.5:1.5b', label: 'Qwen2.5 1.5B（推荐轻量中文）' },
            { id: 'qwen2.5:0.5b', label: 'Qwen2.5 0.5B（最快烟测）' },
            { id: 'llama3.2:1b', label: 'Llama 3.2 1B（轻量英文）' },
            { id: 'qwen2.5:7b', label: 'Qwen2.5 7B（中文/通用）' },
            { id: 'qwen2.5:14b', label: 'Qwen2.5 14B（更强）' },
            { id: 'llama3.1:8b', label: 'Llama 3.1 8B' },
            { id: 'gemma3:4b', label: 'Gemma 3 4B（轻量）' }
        ]
    },
    {
        id: LLM_PRESET_CUSTOM_ID,
        label: '自定义 / 其他 OpenAI-compatible',
        help: '高级模式：手动填写 Provider、API Base 和模型 ID。',
        provider: 'openai-compatible',
        baseUrl: '',
        models: []
    }
];

const renderProfileLabels = {
    ailis_soft_anime_mtoon: '柔和动漫 MToon',
    ailis_bright_companion_mtoon: '明亮陪伴 MToon',
    ailis_cinematic_rim_toon: '电影感边缘光 Toon',
    ailis_material_hybrid_npr: '材质混合 NPR',
    ailis_hard_cel_mtoon: '硬边赛璐璐 MToon'
};

const PET_BASE_WIDTH = 720;
const PET_BASE_HEIGHT = 960;
const FPS_LIMIT_OPTIONS = [24, 30, 45, 60];
const BUBBLE_PREVIEW_BASE_WIDTH = 158;
const BUBBLE_PREVIEW_BASE_HEIGHT = 58;

let currentPreferences = null;
let panelState = null;
let microphoneDevices = [];
let saveInFlight = false;
let assistantStatusCache = null;
let dialoguePreviewScale = 1;
let dialoguePreviewDrag = null;
let pendingClearLlmKey = false;
let pendingClearElevenLabsKey = false;
let draftElevenLabsVoiceProfiles = {};
let draftElevenLabsActiveLanguageCode = 'zh';
let llmProviderDefaultBaseUrls = { ...fallbackLlmProviderDefaultBaseUrls };
let llmProviderDefaultModels = { ...fallbackLlmProviderDefaultModels };
let lastLlmProviderValue = 'openai-compatible';
let vllmModelCatalogResults = [];
let vllmModelCatalogLastResult = null;
let vllmModelCatalogRequestId = 0;
let vllmModelCatalogInFlight = false;
let vllmLocalModelDescriptor = null;
let vllmDownloadDirDescriptor = null;
let vllmRuntimePollTimer = null;
let ollamaRuntimePollTimer = null;
let voiceRuntimePollTimer = null;
let runtimeComponentsPollTimer = null;
let ollamaLocalModelDescriptor = null;
let ollamaModelCatalogResults = [];
let ollamaModelCatalogLastResult = null;
let ollamaModelCatalogRequestId = 0;
let ollamaModelCatalogInFlight = false;
let ollamaDeploymentMode = 'installed';
let ollamaDeploymentModeTouched = false;
let currentOllamaTarget = {
    source: 'installed',
    modelId: '',
    localPath: '',
    remoteModelId: ''
};
let startupDeferredWorkScheduled = false;
let agentRuntimeStatusRefreshTimer = null;
let memoryStatusRefreshTimer = null;
const pendingClearEmailSecrets = {
    qq: false,
    gmail: false,
    outlook: false
};

function scheduleAfterFirstPaint(callback, delayMs = 0) {
    window.setTimeout(() => {
        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(() => callback(), { timeout: 1800 });
            return;
        }
        callback();
    }, delayMs);
}

function scheduleAgentRuntimeStatusRefresh(delayMs = 300) {
    if (agentRuntimeStatusRefreshTimer) {
        window.clearTimeout(agentRuntimeStatusRefreshTimer);
    }
    agentRuntimeStatusRefreshTimer = window.setTimeout(() => {
        agentRuntimeStatusRefreshTimer = null;
        void refreshAgentRuntimeStatus();
    }, delayMs);
}

function scheduleMemoryStatusRefresh(delayMs = 600) {
    if (memoryStatusRefreshTimer) {
        window.clearTimeout(memoryStatusRefreshTimer);
    }
    memoryStatusRefreshTimer = window.setTimeout(() => {
        memoryStatusRefreshTimer = null;
        void refreshMemoryStatus();
    }, delayMs);
}

function scheduleStartupDeferredWork() {
    if (startupDeferredWorkScheduled) {
        return;
    }
    startupDeferredWorkScheduled = true;
    scheduleAfterFirstPaint(() => {
        void refreshMicrophones();
    }, 120);
    scheduleAfterFirstPaint(() => {
        scheduleAgentRuntimeStatusRefresh(0);
    }, 260);
    scheduleAfterFirstPaint(() => {
        scheduleMemoryStatusRefresh(0);
    }, 420);
}

function isLocalLlmProvider(provider = elements.llmProvider?.value) {
    return provider === 'ollama';
}

const emailElements = {
    qq: {
        account: elements.emailQqAccount,
        secret: elements.emailQqSecret,
        state: elements.emailQqState,
        clear: elements.clearEmailQqSecretBtn
    },
    gmail: {
        account: elements.emailGmailAccount,
        secret: elements.emailGmailSecret,
        state: elements.emailGmailState,
        clear: elements.clearEmailGmailSecretBtn
    },
    outlook: {
        account: elements.emailOutlookAccount,
        secret: elements.emailOutlookSecret,
        state: elements.emailOutlookState,
        clear: elements.clearEmailOutlookSecretBtn
    }
};

function setStatus(text) {
    elements.statusText.textContent = text;
}

function formatRuntimeComponentSelection(runtimeComponents = {}) {
    const selection = runtimeComponents.selection || {};
    if (!runtimeComponents.hasInstallerSelection) {
        return '';
    }

    const labelById = {
        'python-runtime': 'Python 运行时',
        'cosyvoice3-runtime': 'CosyVoice3',
        'asr-runtime': 'ASR',
        'web-runtime': 'Web/Search'
    };
    const selectedLabels = (selection.selectedIds || [])
        .map((id) => labelById[id] || id)
        .filter(Boolean);

    if (selectedLabels.length === 0) {
        return '安装器未选择可选运行时';
    }
    return `安装器选择：${selectedLabels.join('、')}`;
}

function getRuntimeComponentTone(component = {}) {
    if (component.status === 'ready' || component.ready) {
        return 'ready';
    }
    if (component.status === 'partial') {
        return 'running';
    }
    if (component.selected || component.selectedByDependency) {
        return component.pack?.available ? 'running' : 'blocked';
    }
    return 'idle';
}

function getRuntimeComponentBadge(component = {}) {
    if (component.ready || component.status === 'ready') {
        return '已就绪';
    }
    if (component.status === 'partial') {
        return '部分存在';
    }
    if (component.selectedByDependency) {
        return '依赖项';
    }
    if (component.selected) {
        return component.pack?.available ? '待导入' : '待安装';
    }
    return '未选择';
}

function getRuntimeComponentsLogLines(runtimeComponents = {}) {
    const run = runtimeComponents.installRun || {};
    const lines = [];
    if (run.status) {
        lines.push(`[AILIS Runtime Components] 状态：${run.status}`);
    }
    for (const step of run.steps || []) {
        lines.push(`[${step.status || 'unknown'}] ${step.title || step.id}`);
        for (const line of step.logs || []) {
            String(line || '')
                .split(/\r?\n/)
                .map((entry) => entry.trim())
                .filter(Boolean)
                .forEach((entry) => lines.push(entry));
        }
        if (step.error) {
            lines.push(`[error] ${step.error}`);
        }
    }
    for (const line of run.logs || []) {
        const text = String(line || '').trim();
        if (text) {
            lines.push(text);
        }
    }
    if (run.error) {
        lines.push(`[error] ${run.error}`);
    }
    return lines.slice(-100);
}

function renderRuntimeComponentsStatus(runtimeComponents = {}) {
    if (!elements.runtimeComponentsStatus || !elements.runtimeComponentsPlan) {
        return;
    }
    const components = runtimeComponents.components || [];
    const selected = components.filter((component) => component.selected || component.selectedByDependency);
    const run = runtimeComponents.installRun || {};
    const isRunning = run.status === 'running';

    elements.runtimeComponentsStatus.innerHTML = '';
    elements.runtimeComponentsStatus.className = 'runtime-diagnostics';

    const outcomeTone = isRunning
        ? 'running'
        : selected.length
            ? selected.every((component) => component.ready) ? 'ready' : 'idle'
            : 'idle';
    const outcomeNode = createRuntimeElement('div', `runtime-outcome is-${outcomeTone}`);
    outcomeNode.appendChild(createRuntimeElement('div', 'runtime-outcome-title', isRunning
        ? '正在安装可选运行时组件'
        : runtimeComponents.hasInstallerSelection
            ? selected.length ? '已读取安装器组件选择' : '安装器未选择可选运行时'
            : '未检测到安装器组件选择'));
    outcomeNode.appendChild(createRuntimeElement('div', 'runtime-outcome-copy', isRunning
        ? 'AILIS 正在导入 runtime pack 或运行组件安装器；日志会保留在下方。'
        : selected.length
            ? '用户选择的组件会在这里安装或导入；未选择的组件不会偷偷下载。'
            : '可以跳过本地运行时，使用文本、云端语音或之后再安装。'));
    elements.runtimeComponentsStatus.appendChild(outcomeNode);

    const grid = createRuntimeElement('div', 'runtime-component-grid');
    components.forEach((component) => {
        const card = createRuntimeElement('div', `runtime-component is-${getRuntimeComponentTone(component)}`);
        const head = createRuntimeElement('div', 'runtime-component-head');
        head.appendChild(createRuntimeElement('span', 'runtime-component-title', component.title || component.id));
        head.appendChild(createRuntimeElement('span', 'runtime-component-badge', getRuntimeComponentBadge(component)));
        card.appendChild(head);
        const packText = component.pack?.available
            ? `离线包可用：${compactPath(component.pack.path)}`
            : component.pack?.packName
                ? `离线包未找到：${component.pack.packName}`
                : '';
        card.appendChild(createRuntimeElement('div', 'runtime-component-copy', [
            component.detail,
            component.estimatedUnpackedSize ? `预计体积：${component.estimatedUnpackedSize}` : '',
            packText
        ].filter(Boolean).join('；')));
        grid.appendChild(card);
    });
    elements.runtimeComponentsStatus.appendChild(grid);

    const pendingSelected = selected.filter((component) => !component.ready);
    elements.runtimeComponentsPlan.textContent = isRunning
        ? '正在处理，请保持 AILIS 打开。'
        : pendingSelected.length
            ? `待处理 ${pendingSelected.length} 个已选组件：${pendingSelected.map((component) => component.title).join('、')}`
            : selected.length
                ? '安装器选择的组件都已就绪。'
                : '默认核心应用可直接使用；需要本地语音、ASR 或 Web/Search 时再安装。';

    if (elements.runtimeComponentsInstallBtn) {
        elements.runtimeComponentsInstallBtn.disabled = isRunning || !selected.length;
        elements.runtimeComponentsInstallBtn.textContent = isRunning ? '安装中...' : '安装已选组件';
    }
    if (elements.runtimeComponentsLog) {
        const lines = getRuntimeComponentsLogLines(runtimeComponents);
        elements.runtimeComponentsLog.hidden = !lines.length;
        elements.runtimeComponentsLog.textContent = lines.join('\n');
    }
}

async function refreshRuntimeComponentsStatus({ silent = false } = {}) {
    if (!window.ailisDesktop?.runtimeComponents?.getStatus) {
        return;
    }
    if (!silent) {
        setStatus('正在检查安装包可选运行时...');
    }
    try {
        const runtimeComponents = await window.ailisDesktop.runtimeComponents.getStatus();
        panelState = {
            ...(panelState || {}),
            runtimeComponents
        };
        renderRuntimeComponentsStatus(runtimeComponents);
        if (!silent) {
            setStatus('安装包可选运行时状态已更新。');
        }
    } catch (error) {
        if (elements.runtimeComponentsStatus) {
            elements.runtimeComponentsStatus.textContent = `读取可选运行时失败：${error.message || error}`;
        }
        if (!silent) {
            setStatus(`读取可选运行时失败：${error.message || error}`);
        }
    }
}

function startRuntimeComponentsPolling() {
    if (runtimeComponentsPollTimer) {
        window.clearInterval(runtimeComponentsPollTimer);
    }
    runtimeComponentsPollTimer = window.setInterval(() => {
        void refreshRuntimeComponentsStatus({ silent: true });
    }, 1800);
}

function stopRuntimeComponentsPolling() {
    if (!runtimeComponentsPollTimer) {
        return;
    }
    window.clearInterval(runtimeComponentsPollTimer);
    runtimeComponentsPollTimer = null;
}

async function installSelectedRuntimeComponents() {
    if (!window.ailisDesktop?.runtimeComponents?.installSelected) {
        setStatus('当前环境不支持安装可选运行时组件。');
        return;
    }
    const runtimeComponents = panelState?.runtimeComponents || {};
    const selected = (runtimeComponents.components || []).filter((component) =>
        component.selected || component.selectedByDependency
    );
    if (!selected.length) {
        setStatus('安装器没有选择可选运行时组件。');
        return;
    }
    const pending = selected.filter((component) => !component.ready);
    const confirmItems = (pending.length ? pending : selected)
        .map((component) => `- ${component.title}${component.estimatedUnpackedSize ? `（${component.estimatedUnpackedSize}）` : ''}`)
        .join('\n');
    const confirmed = window.confirm(
        `将安装或导入以下可选运行时：\n\n${confirmItems}\n\n缺少离线包时，语音组件可能需要联网下载；Web/Search 需要 runtime pack。继续吗？`
    );
    if (!confirmed) {
        return;
    }
    if (elements.runtimeComponentsInstallBtn) {
        elements.runtimeComponentsInstallBtn.disabled = true;
        elements.runtimeComponentsInstallBtn.textContent = '安装中...';
    }
    setStatus('正在安装安装器选择的可选运行时组件...');
    startRuntimeComponentsPolling();
    try {
        const result = await window.ailisDesktop.runtimeComponents.installSelected({
            componentIds: runtimeComponents.selectedIds || []
        });
        panelState = {
            ...(panelState || {}),
            runtimeComponents: {
                ...(panelState?.runtimeComponents || {}),
                installRun: result
            }
        };
        renderRuntimeComponentsStatus(panelState.runtimeComponents);
        await refreshRuntimeComponentsStatus({ silent: true });
        await refreshVoiceRuntimeStatus({ diagnose: false, silent: true });
        setStatus(result.ok
            ? '可选运行时组件已安装完成。'
            : `可选运行时组件安装未完全完成：${result.error || result.status}`);
    } catch (error) {
        setStatus(`可选运行时组件安装失败：${error.message || error}`);
    } finally {
        stopRuntimeComponentsPolling();
        await refreshRuntimeComponentsStatus({ silent: true });
    }
}

function formatCosyVoiceWarmupStatus(voiceWarmup, fallbackText) {
    if (!voiceWarmup) {
        return fallbackText;
    }
    if (voiceWarmup.ok && voiceWarmup.alreadyWarm) {
        return 'CosyVoice3 已启用，语音模型已经是热启动状态。';
    }
    if (voiceWarmup.ok) {
        const elapsed = voiceWarmup.elapsedSeconds ? `，预热耗时 ${voiceWarmup.elapsedSeconds}s` : '';
        return `CosyVoice3 已启用并完成预热${elapsed}。`;
    }
    return `CosyVoice3 已启用，但后台预热失败：${voiceWarmup.error || voiceWarmup.reason || '未知原因'}。第一次播放可能仍会较慢。`;
}

function formatValue(value) {
    return Number(value).toFixed(2);
}

function formatPixelValue(value) {
    return `${Math.round(Number(value) || 0)}px`;
}

function formatHitTestScale(value, neutral, strength) {
    const scale = 1 + (Number(value) - neutral) * strength;
    return `${Math.round(scale * 100)}%`;
}

function formatNeutralOffset(value, neutral = 0) {
    const offset = Number(value) - neutral;
    const sign = offset > 0 ? '+' : '';
    return `${sign}${Math.round(offset * 100)}%`;
}

function formatPercentScale(value) {
    return `${Math.round(Number(value || 1) * 100)}%`;
}

function formatLightYaw(value) {
    const numericValue = Math.round(Number(value || 0));
    if (numericValue === 0) {
        return '正面';
    }
    return `${numericValue > 0 ? '右' : '左'} ${Math.abs(numericValue)}°`;
}

function normalizeQualityLevel(value, fallbackValue = 3) {
    const numericValue = Math.round(Number(value));
    if (![1, 2, 3].includes(numericValue)) {
        return fallbackValue;
    }
    return numericValue;
}

function formatQualityLevel(value) {
    return ['低', '中', '高'][normalizeQualityLevel(value) - 1];
}

function normalizeRenderResolutionScale(value, fallbackValue = 2) {
    return clampNumber(value, 0.5, 3, fallbackValue, 2);
}

function normalizeRenderFpsLimit(value, fallbackValue = 60) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }
    return FPS_LIMIT_OPTIONS.reduce((closestValue, optionValue) => (
        Math.abs(optionValue - numericValue) < Math.abs(closestValue - numericValue)
            ? optionValue
            : closestValue
    ), fallbackValue);
}

function getFpsSliderIndex(value) {
    const fpsLimit = normalizeRenderFpsLimit(value);
    const optionIndex = FPS_LIMIT_OPTIONS.indexOf(fpsLimit);
    return optionIndex >= 0 ? optionIndex + 1 : FPS_LIMIT_OPTIONS.length;
}

function getFpsFromSliderIndex(value) {
    const optionIndex = Math.round(Number(value)) - 1;
    return FPS_LIMIT_OPTIONS[Math.min(Math.max(optionIndex, 0), FPS_LIMIT_OPTIONS.length - 1)];
}

function formatResolutionScale(value) {
    const normalizedValue = normalizeRenderResolutionScale(value);
    return `${normalizedValue.toFixed(2).replace(/\.?0+$/, '')}x`;
}

function formatFpsLimit(value) {
    return `${normalizeRenderFpsLimit(value)} FPS`;
}

function normalizeElevenLabsOptimizeLatency(value, fallbackValue = 1) {
    return Math.round(clampNumber(value, 0, 4, fallbackValue, 0));
}

function normalizeElevenLabsLanguageCode(value, fallbackValue = 'zh') {
    const normalizedValue = String(value || '').trim().toLowerCase();
    if (Object.prototype.hasOwnProperty.call(elevenLabsLanguagePresets, normalizedValue)) {
        return normalizedValue;
    }
    return fallbackValue;
}

function normalizeElevenLabsSetting(value, fallbackValue) {
    return clampNumber(value, 0, 1, fallbackValue, 2);
}

function normalizeElevenLabsSpeed(value, fallbackValue = 0.9) {
    return clampNumber(value, 0.7, 1.2, fallbackValue, 2);
}

function formatElevenLabsOptimizeLatency(value) {
    const normalizedValue = normalizeElevenLabsOptimizeLatency(value);
    if (normalizedValue === 0) {
        return '0 音质优先';
    }
    if (normalizedValue <= 2) {
        return `${normalizedValue} 平衡`;
    }
    return `${normalizedValue} 速度优先`;
}

function getDefaultElevenLabsVoiceProfile(languageCode) {
    const normalizedLanguage = normalizeElevenLabsLanguageCode(languageCode);
    const preset = elevenLabsLanguagePresets[normalizedLanguage] || elevenLabsLanguagePresets.zh;
    return {
        voiceId: '',
        modelId: preset.modelId,
        languageCode: normalizedLanguage,
        outputFormat: preset.outputFormat,
        optimizeStreamingLatency: preset.optimizeStreamingLatency,
        stability: preset.stability,
        similarityBoost: preset.similarityBoost,
        style: preset.style,
        speed: preset.speed,
        useSpeakerBoost: preset.useSpeakerBoost
    };
}

function normalizeElevenLabsVoiceProfile(profile = {}, languageCode = 'zh', fallback = {}) {
    const normalizedLanguage = normalizeElevenLabsLanguageCode(languageCode);
    const defaults = getDefaultElevenLabsVoiceProfile(normalizedLanguage);
    const source = profile && typeof profile === 'object' ? profile : {};
    const fallbackSource = fallback && typeof fallback === 'object' ? fallback : {};
    return {
        voiceId: String(source.voiceId || fallbackSource.voiceId || defaults.voiceId),
        modelId: String(source.modelId || fallbackSource.modelId || defaults.modelId),
        languageCode: normalizedLanguage,
        outputFormat: String(source.outputFormat || fallbackSource.outputFormat || defaults.outputFormat),
        optimizeStreamingLatency: normalizeElevenLabsOptimizeLatency(
            source.optimizeStreamingLatency ??
                fallbackSource.optimizeStreamingLatency ??
                defaults.optimizeStreamingLatency,
            defaults.optimizeStreamingLatency
        ),
        stability: normalizeElevenLabsSetting(
            source.stability ?? fallbackSource.stability ?? defaults.stability,
            defaults.stability
        ),
        similarityBoost: normalizeElevenLabsSetting(
            source.similarityBoost ?? fallbackSource.similarityBoost ?? defaults.similarityBoost,
            defaults.similarityBoost
        ),
        style: normalizeElevenLabsSetting(source.style ?? fallbackSource.style ?? defaults.style, defaults.style),
        speed: normalizeElevenLabsSpeed(source.speed ?? fallbackSource.speed ?? defaults.speed, defaults.speed),
        useSpeakerBoost: (source.useSpeakerBoost ?? fallbackSource.useSpeakerBoost ?? defaults.useSpeakerBoost) !== false
    };
}

function normalizeElevenLabsVoiceProfiles(profiles = {}, preferences = {}) {
    const source = profiles && typeof profiles === 'object' ? profiles : {};
    const legacyLanguage = normalizeElevenLabsLanguageCode(preferences.elevenLabsLanguageCode, 'zh');
    const legacyProfile = {
        voiceId: preferences.elevenLabsVoiceId,
        modelId: preferences.elevenLabsModelId,
        outputFormat: preferences.elevenLabsOutputFormat,
        optimizeStreamingLatency: preferences.elevenLabsOptimizeStreamingLatency,
        stability: preferences.elevenLabsStability,
        similarityBoost: preferences.elevenLabsSimilarityBoost,
        style: preferences.elevenLabsStyle,
        speed: preferences.elevenLabsSpeed,
        useSpeakerBoost: preferences.elevenLabsUseSpeakerBoost
    };
    const voiceFallback = { voiceId: preferences.elevenLabsVoiceId };
    return Object.fromEntries(ELEVENLABS_LANGUAGE_CODES.map((languageCode) => {
        const profile = source[languageCode] && typeof source[languageCode] === 'object'
            ? source[languageCode]
            : {};
        const fallback = Object.keys(profile).length
            ? voiceFallback
            : {
                ...voiceFallback,
                ...(languageCode === legacyLanguage ? legacyProfile : {})
            };
        return [
            languageCode,
            normalizeElevenLabsVoiceProfile(profile, languageCode, fallback)
        ];
    }));
}

function readElevenLabsProfileFromFields(languageCode = elements.elevenLabsLanguageCode.value) {
    const normalizedLanguage = normalizeElevenLabsLanguageCode(languageCode);
    return normalizeElevenLabsVoiceProfile({
        voiceId: elements.elevenLabsVoiceId.value,
        modelId: elements.elevenLabsModelId.value,
        outputFormat: elements.elevenLabsOutputFormat.value,
        optimizeStreamingLatency: Number(elements.elevenLabsOptimizeLatency.value),
        stability: Number(elements.elevenLabsStability.value),
        similarityBoost: Number(elements.elevenLabsSimilarity.value),
        style: Number(elements.elevenLabsStyle.value),
        speed: Number(elements.elevenLabsSpeed.value),
        useSpeakerBoost: elements.elevenLabsSpeakerBoost.checked
    }, normalizedLanguage);
}

function writeElevenLabsProfileToFields(profile, languageCode) {
    const normalizedLanguage = normalizeElevenLabsLanguageCode(languageCode);
    const normalizedProfile = normalizeElevenLabsVoiceProfile(profile, normalizedLanguage);
    elements.elevenLabsLanguageCode.value = normalizedLanguage;
    elements.elevenLabsVoiceId.value = normalizedProfile.voiceId;
    elements.elevenLabsModelId.value = normalizedProfile.modelId;
    elements.elevenLabsOutputFormat.value = normalizedProfile.outputFormat;
    elements.elevenLabsOptimizeLatency.value = String(normalizedProfile.optimizeStreamingLatency);
    elements.elevenLabsStability.value = String(normalizedProfile.stability);
    elements.elevenLabsSimilarity.value = String(normalizedProfile.similarityBoost);
    elements.elevenLabsStyle.value = String(normalizedProfile.style);
    elements.elevenLabsSpeed.value = String(normalizedProfile.speed);
    elements.elevenLabsSpeakerBoost.checked = normalizedProfile.useSpeakerBoost !== false;
    updateRangeLabels();
}

function captureCurrentElevenLabsProfile() {
    const languageCode = normalizeElevenLabsLanguageCode(draftElevenLabsActiveLanguageCode);
    draftElevenLabsVoiceProfiles = normalizeElevenLabsVoiceProfiles(draftElevenLabsVoiceProfiles, currentPreferences || {});
    draftElevenLabsVoiceProfiles[languageCode] = readElevenLabsProfileFromFields(languageCode);
}

function switchElevenLabsVoiceProfile(languageCode) {
    captureCurrentElevenLabsProfile();
    const nextLanguage = normalizeElevenLabsLanguageCode(languageCode);
    draftElevenLabsActiveLanguageCode = nextLanguage;
    draftElevenLabsVoiceProfiles = normalizeElevenLabsVoiceProfiles(draftElevenLabsVoiceProfiles, currentPreferences || {});
    writeElevenLabsProfileToFields(draftElevenLabsVoiceProfiles[nextLanguage], nextLanguage);
    const label = elevenLabsLanguagePresets[nextLanguage]?.label || nextLanguage;
    setStatus(`已切换到 ${label} 语音配置。`);
}

function applyElevenLabsLanguagePreset(languageCode) {
    const normalizedLanguage = normalizeElevenLabsLanguageCode(languageCode);
    const preset = elevenLabsLanguagePresets[normalizedLanguage];
    if (!preset) {
        return;
    }

    elements.elevenLabsLanguageCode.value = normalizedLanguage;
    elements.elevenLabsModelId.value = preset.modelId;
    elements.elevenLabsOutputFormat.value = preset.outputFormat;
    elements.elevenLabsOptimizeLatency.value = String(preset.optimizeStreamingLatency);
    elements.elevenLabsStability.value = String(preset.stability);
    elements.elevenLabsSimilarity.value = String(preset.similarityBoost);
    elements.elevenLabsStyle.value = String(preset.style);
    elements.elevenLabsSpeed.value = String(preset.speed);
    elements.elevenLabsSpeakerBoost.checked = preset.useSpeakerBoost;
    draftElevenLabsActiveLanguageCode = normalizedLanguage;
    draftElevenLabsVoiceProfiles = normalizeElevenLabsVoiceProfiles(draftElevenLabsVoiceProfiles, currentPreferences || {});
    draftElevenLabsVoiceProfiles[normalizedLanguage] = readElevenLabsProfileFromFields(normalizedLanguage);
    updateRangeLabels();
    setStatus(`已套用 ${preset.label} ElevenLabs 语音参数。`);
}

function clampNumber(value, minimum, maximum, fallbackValue, digits = 2) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }
    const clampedValue = Math.min(Math.max(numericValue, minimum), maximum);
    return Number(clampedValue.toFixed(digits));
}

function getDialogueLayoutValues() {
    const petScale = Number(elements.petScale?.value || currentPreferences?.petScale || 0.85);
    const baseWidth = Math.round(PET_BASE_WIDTH * petScale);
    const baseHeight = Math.round(PET_BASE_HEIGHT * petScale);

    return {
        baseWidth,
        baseHeight,
        left: Math.round(Number(elements.avatarBubbleLeft.value) || 0),
        top: Math.round(Number(elements.avatarBubbleTop.value) || 0),
        scale: Number(elements.avatarBubbleScale.value) || 1,
        extraWidth: Math.round(Number(elements.avatarBubbleExtraWidth.value) || 0),
        extraTop: Math.round(Number(elements.avatarBubbleExtraTop.value) || 0)
    };
}

function syncDialoguePreview() {
    if (
        !elements.avatarBubbleEditor ||
        !elements.avatarBubbleWindowPreview ||
        !elements.avatarBubblePreview ||
        !elements.avatarBubbleAvatarPreview
    ) {
        return;
    }

    const layout = getDialogueLayoutValues();
    const stageRect = elements.avatarBubbleEditor.getBoundingClientRect();
    const stageWidth = stageRect.width || 420;
    const stageHeight = stageRect.height || 280;
    const windowWidth = Math.max(layout.baseWidth, layout.baseWidth + layout.extraWidth);
    const windowHeight = Math.max(layout.baseHeight, layout.baseHeight + layout.extraTop);
    dialoguePreviewScale = Math.min(
        Math.max(stageWidth - 32, 120) / windowWidth,
        Math.max(stageHeight - 32, 120) / windowHeight,
        1
    );

    elements.avatarBubbleWindowPreview.style.width = `${windowWidth}px`;
    elements.avatarBubbleWindowPreview.style.height = `${windowHeight}px`;
    elements.avatarBubbleWindowPreview.style.transform =
        `translate(-50%, -50%) scale(${dialoguePreviewScale})`;
    elements.avatarBubbleAvatarPreview.style.width = `${layout.baseWidth}px`;
    elements.avatarBubbleAvatarPreview.style.height = `${layout.baseHeight}px`;
    const maxBubbleLeft = Math.max(0, windowWidth - BUBBLE_PREVIEW_BASE_WIDTH * layout.scale - 8);
    const maxBubbleTop = Math.max(0, windowHeight - BUBBLE_PREVIEW_BASE_HEIGHT * layout.scale - 8);
    elements.avatarBubblePreview.style.left = `${Math.round(Math.min(layout.left, maxBubbleLeft))}px`;
    elements.avatarBubblePreview.style.top = `${Math.round(Math.min(layout.top, maxBubbleTop))}px`;
    elements.avatarBubblePreview.style.transform = `scale(${layout.scale})`;
}

function updateRangeLabels() {
    elements.avatarBubbleLeftValue.textContent = formatPixelValue(elements.avatarBubbleLeft.value);
    elements.avatarBubbleTopValue.textContent = formatPixelValue(elements.avatarBubbleTop.value);
    elements.avatarBubbleScaleValue.textContent = `${Math.round(Number(elements.avatarBubbleScale.value || 1) * 100)}%`;
    const dialogueLayout = getDialogueLayoutValues();
    elements.avatarBubbleExtraWidthValue.textContent = `${dialogueLayout.baseWidth + dialogueLayout.extraWidth}px`;
    elements.avatarBubbleExtraTopValue.textContent = `${dialogueLayout.baseHeight + dialogueLayout.extraTop}px`;
    elements.cameraDistanceValue.textContent = formatValue(elements.cameraDistance.value);
    elements.cameraHeightValue.textContent = formatValue(elements.cameraHeight.value);
    elements.cameraTargetYValue.textContent = formatValue(elements.cameraTargetY.value);
    elements.renderLightYawValue.textContent = formatLightYaw(elements.renderLightYaw.value);
    elements.renderKeyLightValue.textContent = formatPercentScale(elements.renderKeyLight.value);
    elements.renderAmbientFillValue.textContent = formatPercentScale(elements.renderAmbientFill.value);
    elements.renderOutlineScaleValue.textContent = formatPercentScale(elements.renderOutlineScale.value);
    elements.renderResolutionScaleValue.textContent = formatResolutionScale(elements.renderResolutionScale.value);
    elements.renderFpsLimitValue.textContent = formatFpsLimit(getFpsFromSliderIndex(elements.renderFpsLimit.value));
    elements.renderShadowQualityValue.textContent = formatQualityLevel(elements.renderShadowQuality.value);
    elements.elevenLabsOptimizeLatencyValue.textContent = formatElevenLabsOptimizeLatency(
        elements.elevenLabsOptimizeLatency.value
    );
    elements.elevenLabsSpeedValue.textContent = formatValue(elements.elevenLabsSpeed.value);
    elements.elevenLabsStabilityValue.textContent = formatValue(elements.elevenLabsStability.value);
    elements.elevenLabsSimilarityValue.textContent = formatValue(elements.elevenLabsSimilarity.value);
    elements.elevenLabsStyleValue.textContent = formatValue(elements.elevenLabsStyle.value);
    elements.petMouseHitTestWidthValue.textContent = formatHitTestScale(
        elements.petMouseHitTestWidth.value || 0.58,
        0.58,
        0.85
    );
    elements.petMouseHitTestHeightValue.textContent = formatHitTestScale(
        elements.petMouseHitTestHeight.value || 0.78,
        0.78,
        0.72
    );
    elements.petMouseHitTestOffsetXValue.textContent = formatNeutralOffset(
        elements.petMouseHitTestOffsetX.value || 0
    );
    elements.petMouseHitTestOffsetYValue.textContent = formatNeutralOffset(
        elements.petMouseHitTestOffsetY.value || 0.08,
        0.08
    );
    elements.ttsRateValue.textContent = formatValue(elements.ttsRate.value);
    elements.ttsPitchValue.textContent = formatValue(elements.ttsPitch.value);
    elements.ttsVolumeValue.textContent = formatValue(elements.ttsVolume.value);
    elements.llmTemperatureValue.textContent = formatValue(elements.llmTemperature.value);
    syncDialoguePreview();
}

function normalizePreferences(preferences = {}) {
    const llmTemperature = Math.min(
        2,
        Math.max(0, Number(preferences.llmTemperature ?? 0.8))
    );
    const llmTimeout = Math.min(
        120000,
        Math.max(5000, Number(preferences.llmRequestTimeoutMs ?? 25000))
    );

    const emailProfiles = normalizeEmailProfiles(preferences.emailProfiles || {});
    const elevenLabsVoiceProfiles = normalizeElevenLabsVoiceProfiles(
        preferences.elevenLabsVoiceProfiles,
        preferences
    );

    const rawLlmProvider = String(preferences.llmProvider || 'openai-compatible');
    const normalizedLlmProvider = rawLlmProvider === 'vllm' ? 'ollama' : rawLlmProvider;
    const normalizedLlmBaseUrl = rawLlmProvider === 'vllm'
        ? fallbackLlmProviderDefaultBaseUrls.ollama
        : String(preferences.llmBaseUrl || 'https://ark.cn-beijing.volces.com/api/v3');
    const normalizedLlmModel = rawLlmProvider === 'vllm'
        ? fallbackLlmProviderDefaultModels.ollama
        : String(preferences.llmModel || 'doubao-seed-2-0-mini-260215');
    const normalizedOllamaTarget = normalizeOllamaTarget(preferences.ollamaTarget || {}, {
        ollamaDeploymentMode: preferences.ollamaDeploymentMode,
        modelId: normalizedLlmModel,
        localModelPath: preferences.ollamaLocalModelPath
    });

    return {
        petScale: String(preferences.petScale ?? '0.85'),
        petSkipTaskbar: Boolean(preferences.petSkipTaskbar),
        speechMode: String(preferences.speechMode || 'off'),
        chunkedTtsEnabled: preferences.chunkedTtsEnabled !== false,
        recognitionMode: String(preferences.recognitionMode || 'auto-vad'),
        conversationMode: ['assistant', 'daily'].includes(String(preferences.conversationMode || '').trim())
            ? String(preferences.conversationMode).trim()
            : 'assistant',
        uiLanguage: normalizeUiLanguage(preferences.uiLanguage || 'zh-CN'),
        preferredMicDeviceId: String(preferences.preferredMicDeviceId || ''),
        ailisStateDir: String(preferences.ailisStateDir || ''),
        ailisResolvedStateDir: String(preferences.ailisResolvedStateDir || ''),
        ailisDefaultStateDir: String(preferences.ailisDefaultStateDir || ''),
        voiceRuntimeRoot: String(preferences.voiceRuntimeRoot || '').trim(),
        voiceRuntimeResolvedRoot: String(preferences.voiceRuntimeResolvedRoot || ''),
        voiceRuntimeDefaultRoot: String(preferences.voiceRuntimeDefaultRoot || ''),
        llmProvider: normalizedLlmProvider,
        llmBaseUrl: normalizedLlmBaseUrl,
        llmModel: normalizedLlmModel,
        ollamaTarget: normalizedOllamaTarget,
        ollamaDeploymentMode: ollamaSourceToLegacyMode(normalizedOllamaTarget.source),
        ollamaLocalModelPath: String(preferences.ollamaLocalModelPath || '').trim(),
        ollamaInstalledModels: normalizeOllamaModelHistory(preferences.ollamaInstalledModels),
        ollamaUsedModels: normalizeOllamaModelHistory(preferences.ollamaUsedModels),
        llmApiKeyProfiles: normalizeRendererLlmApiKeyProfiles(preferences.llmApiKeyProfiles),
        llmActiveApiKeyId: String(preferences.llmActiveApiKeyId || '').trim(),
        llmApiKeySelectedId: String(preferences.llmApiKeySelectedId || preferences.llmActiveApiKeyId || '').trim(),
        llmApiKeyLabel: String(preferences.llmApiKeyLabel || '').trim(),
        llmApiKeyConfigured: Boolean(preferences.llmApiKeyConfigured),
        llmApiKeySource: String(preferences.llmApiKeySource || 'none'),
        llmTemperature: Number(llmTemperature.toFixed(2)),
        llmRequestTimeoutMs: Math.round(llmTimeout),
        llmCapabilities: preferences.llmCapabilities && typeof preferences.llmCapabilities === 'object'
            ? preferences.llmCapabilities
            : {},
        elevenLabsApiBase: String(preferences.elevenLabsApiBase || 'https://api.elevenlabs.io'),
        elevenLabsVoiceId: String(preferences.elevenLabsVoiceId || ''),
        elevenLabsModelId: String(preferences.elevenLabsModelId || 'eleven_multilingual_v2'),
        elevenLabsLanguageCode: normalizeElevenLabsLanguageCode(preferences.elevenLabsLanguageCode, 'zh'),
        elevenLabsOutputFormat: String(preferences.elevenLabsOutputFormat || 'mp3_44100_128'),
        elevenLabsTimeoutMs: Math.round(
            Math.min(120000, Math.max(5000, Number(preferences.elevenLabsTimeoutMs ?? 60000)))
        ),
        elevenLabsOptimizeStreamingLatency: normalizeElevenLabsOptimizeLatency(
            preferences.elevenLabsOptimizeStreamingLatency,
            0
        ),
        elevenLabsStability: normalizeElevenLabsSetting(preferences.elevenLabsStability, 0.58),
        elevenLabsSimilarityBoost: normalizeElevenLabsSetting(preferences.elevenLabsSimilarityBoost, 0.78),
        elevenLabsStyle: normalizeElevenLabsSetting(preferences.elevenLabsStyle, 0.05),
        elevenLabsSpeed: normalizeElevenLabsSpeed(preferences.elevenLabsSpeed, 0.9),
        elevenLabsUseSpeakerBoost: preferences.elevenLabsUseSpeakerBoost !== false,
        elevenLabsVoiceProfiles,
        elevenLabsApiKeyConfigured: Boolean(preferences.elevenLabsApiKeyConfigured),
        elevenLabsApiKeySource: String(preferences.elevenLabsApiKeySource || 'none'),
        computerControlEnabled: preferences.computerControlEnabled !== false,
        emailProfiles,
        cameraDistance: Number(preferences.cameraDistance ?? 1.1),
        cameraHeight: Number(preferences.cameraHeight ?? 1.3),
        cameraTargetY: Number(preferences.cameraTargetY ?? 1),
        renderProfileId: Object.prototype.hasOwnProperty.call(
            renderProfileLabels,
            String(preferences.renderProfileId || '')
        )
            ? String(preferences.renderProfileId)
            : 'ailis_soft_anime_mtoon',
        renderLightYawDeg: clampNumber(preferences.renderLightYawDeg, -75, 75, 0, 0),
        renderKeyLightScale: clampNumber(preferences.renderKeyLightScale, 0.65, 1.45, 1, 2),
        renderAmbientFillScale: clampNumber(preferences.renderAmbientFillScale, 0.55, 1.35, 1, 2),
        renderOutlineScale: clampNumber(preferences.renderOutlineScale, 0.25, 1.2, 0.72, 2),
        renderShadowEnabled: preferences.renderShadowEnabled !== false,
        renderResolutionScale: normalizeRenderResolutionScale(preferences.renderResolutionScale, 2),
        renderFpsLimit: normalizeRenderFpsLimit(preferences.renderFpsLimit, 60),
        renderShadowQuality: normalizeQualityLevel(preferences.renderShadowQuality, 3),
        renderOutlineEnabled: preferences.renderOutlineEnabled !== false,
        renderAntialiasEnabled: preferences.renderAntialiasEnabled !== false,
        desktopNativeTtsRate: Number(preferences.desktopNativeTtsRate ?? 0.96),
        desktopNativeTtsPitch: Number(preferences.desktopNativeTtsPitch ?? 1.12),
        desktopNativeTtsVolume: Number(preferences.desktopNativeTtsVolume ?? 1),
        avatarDialogueBubbleLeft: Math.round(
            clampNumber(preferences.avatarDialogueBubbleLeft, 0, 640, 8, 0)
        ),
        avatarDialogueBubbleTop: Math.round(
            clampNumber(preferences.avatarDialogueBubbleTop, 0, 480, 8, 0)
        ),
        avatarDialogueBubbleScale: clampNumber(
            preferences.avatarDialogueBubbleScale,
            0.75,
            1.35,
            1,
            2
        ),
        avatarDialogueBubbleExtraWidth: Math.round(
            clampNumber(preferences.avatarDialogueBubbleExtraWidth, 0, 520, 220, 0)
        ),
        avatarDialogueBubbleExtraTop: Math.round(
            clampNumber(preferences.avatarDialogueBubbleExtraTop, 0, 360, 190, 0)
        ),
        petMouseHitTestEnabled: preferences.petMouseHitTestEnabled !== false,
        petMouseHitTestShape: ['ellipse', 'rectangle'].includes(String(preferences.petMouseHitTestShape || '').trim().toLowerCase())
            ? String(preferences.petMouseHitTestShape).trim().toLowerCase()
            : 'ellipse',
        petMouseHitTestWidthRatio: clampNumber(
            preferences.petMouseHitTestWidthRatio,
            0.2,
            1,
            0.58,
            2
        ),
        petMouseHitTestHeightRatio: clampNumber(
            preferences.petMouseHitTestHeightRatio,
            0.25,
            1,
            0.78,
            2
        ),
        petMouseHitTestOffsetXRatio: clampNumber(
            preferences.petMouseHitTestOffsetXRatio,
            -0.5,
            0.5,
            0,
            2
        ),
        petMouseHitTestOffsetYRatio: clampNumber(
            preferences.petMouseHitTestOffsetYRatio,
            -0.5,
            0.5,
            0.08,
            2
        ),
        petMouseHitTestDebug: Boolean(preferences.petMouseHitTestDebug)
    };
}

function normalizeEmailProfiles(profiles = {}) {
    const providerIds = ['qq', 'gmail', 'outlook'];
    return Object.fromEntries(providerIds.map((providerId) => {
        const profile = profiles[providerId] && typeof profiles[providerId] === 'object'
            ? profiles[providerId]
            : {};
        return [
            providerId,
            {
                account: String(profile.account || profile.email || ''),
                authType: String(profile.authType || 'password'),
                secretConfigured: Boolean(profile.secretConfigured || profile.secret),
                secretSource: String(profile.secretSource || (profile.secretConfigured || profile.secret ? 'saved' : 'none'))
            }
        ];
    }));
}

function normalizeOllamaModelHistory(models = []) {
    const source = Array.isArray(models) ? models : [];
    const seen = new Set();
    const result = [];
    for (const item of source) {
        const model = String(item || '').trim();
        const key = model.toLowerCase();
        if (!model || seen.has(key)) {
            continue;
        }
        seen.add(key);
        result.push(model.slice(0, 200));
        if (result.length >= 80) {
            break;
        }
    }
    return result;
}

function mergeOllamaModelHistory(existing = [], additions = []) {
    return normalizeOllamaModelHistory([
        ...normalizeOllamaModelHistory(additions),
        ...normalizeOllamaModelHistory(existing)
    ]);
}

function normalizeRendererLlmApiKeyProfiles(profiles = {}) {
    const source = profiles && typeof profiles === 'object' ? profiles : {};
    const providerIds = new Set([
        ...Object.keys(fallbackLlmProviderDefaultModels),
        ...Object.keys(source)
    ]);
    const result = {};
    for (const providerId of providerIds) {
        const profile = source[providerId] && typeof source[providerId] === 'object'
            ? source[providerId]
            : {};
        const keys = Array.isArray(profile.keys)
            ? profile.keys
                .map((entry) => ({
                    id: String(entry?.id || '').trim(),
                    label: String(entry?.label || '默认 Key').trim() || '默认 Key',
                    masked: String(entry?.masked || '').trim(),
                    createdAt: String(entry?.createdAt || ''),
                    updatedAt: String(entry?.updatedAt || ''),
                    lastUsedAt: String(entry?.lastUsedAt || '')
                }))
                .filter((entry) => entry.id)
            : [];
        result[providerId] = {
            activeKeyId: keys.some((entry) => entry.id === String(profile.activeKeyId || '').trim())
                ? String(profile.activeKeyId).trim()
                : keys[0]?.id || '',
            keys
        };
    }
    return result;
}

function getCurrentLlmApiKeyProfile(provider = elements.llmProvider?.value || currentPreferences?.llmProvider || '') {
    const profiles = normalizeRendererLlmApiKeyProfiles(currentPreferences?.llmApiKeyProfiles);
    return profiles[provider] || { activeKeyId: '', keys: [] };
}

function getSelectedLlmApiKeyMeta(provider = elements.llmProvider?.value || currentPreferences?.llmProvider || '') {
    const profile = getCurrentLlmApiKeyProfile(provider);
    const selectedId = elements.llmApiKeySelect?.value || profile.activeKeyId || '';
    return profile.keys.find((entry) => entry.id === selectedId) || null;
}

function renderLlmApiKeySelect() {
    if (!elements.llmApiKeySelect) {
        return;
    }
    const provider = elements.llmProvider?.value || currentPreferences?.llmProvider || 'openai-compatible';
    const profile = getCurrentLlmApiKeyProfile(provider);
    const previousValue = elements.llmApiKeySelect.value;
    elements.llmApiKeySelect.innerHTML = '';
    if (!profile.keys.length) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '尚未保存这个服务商的 Key';
        elements.llmApiKeySelect.appendChild(option);
        elements.llmApiKeySelect.disabled = true;
    } else {
        profile.keys.forEach((entry) => {
            const option = document.createElement('option');
            option.value = entry.id;
            option.textContent = `${entry.label}${entry.masked ? ` · ${entry.masked}` : ''}`;
            elements.llmApiKeySelect.appendChild(option);
        });
        elements.llmApiKeySelect.disabled = false;
        const nextValue = profile.keys.some((entry) => entry.id === previousValue)
            ? previousValue
            : profile.activeKeyId || profile.keys[0]?.id || '';
        elements.llmApiKeySelect.value = nextValue;
    }
    if (elements.llmApiKeyLabel && !elements.llmApiKeyLabel.value.trim()) {
        elements.llmApiKeyLabel.placeholder = `${llmProviderLabels[provider] || provider} Key 名称，可选`;
    }
    if (elements.llmApiKey) {
        const selected = getSelectedLlmApiKeyMeta(provider);
        elements.llmApiKey.placeholder = selected
            ? `当前使用：${selected.label}${selected.masked ? `（${selected.masked}）` : ''}；粘贴新 Key 可新增/替换`
            : '粘贴新 Key 后保存；留空表示这个服务商暂不使用保存 Key';
    }
}

function normalizeOllamaTargetSource(source = '') {
    const normalized = String(source || '').trim().toLowerCase();
    if (['installed', 'existing', 'manual'].includes(normalized)) {
        return 'installed';
    }
    if (['local', 'local_import', 'local-import', 'file'].includes(normalized)) {
        return 'local_import';
    }
    if (['online', 'online_pull', 'online-pull', 'remote', 'pull'].includes(normalized)) {
        return 'online_pull';
    }
    return '';
}

function ollamaSourceToLegacyMode(source = '') {
    const normalized = normalizeOllamaTargetSource(source);
    if (normalized === 'local_import') {
        return 'local';
    }
    if (normalized === 'online_pull') {
        return 'online';
    }
    return 'installed';
}

function normalizeOllamaTarget(target = {}, fallback = {}) {
    const source = normalizeOllamaTargetSource(
        target.source ||
        target.deploymentMode ||
        target.ollamaDeploymentMode ||
        fallback.source ||
        fallback.deploymentMode ||
        fallback.ollamaDeploymentMode
    ) || (target.localPath || target.localModelPath || fallback.localPath || fallback.localModelPath
        ? 'local_import'
        : 'installed');
    const localPath = String(
        target.localPath ||
        target.localModelPath ||
        fallback.localPath ||
        fallback.localModelPath ||
        ''
    ).trim();
    const modelId = String(
        target.modelId ||
        target.model ||
        fallback.modelId ||
        fallback.model ||
        fallback.llmModel ||
        getProviderDefaultModel('ollama')
    ).trim() || getProviderDefaultModel('ollama');
    const remoteModelId = String(
        target.remoteModelId ||
        target.remoteModel ||
        fallback.remoteModelId ||
        fallback.remoteModel ||
        (source === 'online_pull' ? modelId : '')
    ).trim();

    return {
        source,
        modelId,
        localPath: source === 'local_import' ? localPath : '',
        remoteModelId: source === 'online_pull' ? (remoteModelId || modelId) : ''
    };
}

function getCurrentOllamaTarget(overrides = {}) {
    const source = normalizeOllamaTargetSource(
        overrides.source ||
        currentOllamaTarget.source ||
        ollamaDeploymentMode
    ) || 'installed';
    const modelFromForm = elements.llmModel?.value?.trim() ||
        elements.ollamaInstalledModelId?.value?.trim() ||
        currentPreferences?.llmModel ||
        getProviderDefaultModel('ollama');
    const localPath = getOllamaLocalModelPath() ||
        currentOllamaTarget.localPath ||
        currentPreferences?.ollamaLocalModelPath ||
        '';
    return normalizeOllamaTarget({
        ...currentOllamaTarget,
        ...overrides,
        source,
        modelId: overrides.modelId || modelFromForm,
        localPath: overrides.localPath || localPath
    });
}

function setCurrentOllamaTarget(nextTarget = {}) {
    currentOllamaTarget = normalizeOllamaTarget(nextTarget, {
        ...currentOllamaTarget,
        llmModel: elements.llmModel?.value || currentPreferences?.llmModel || getProviderDefaultModel('ollama'),
        localModelPath: getOllamaLocalModelPath() || currentPreferences?.ollamaLocalModelPath || ''
    });
    ollamaDeploymentMode = ollamaSourceToLegacyMode(currentOllamaTarget.source);
    return currentOllamaTarget;
}

function readFormPreferences({ includeSecret = false } = {}) {
    captureCurrentElevenLabsProfile();
    const nextOllamaTarget = getCurrentOllamaTarget();
    const pendingLlmApiKeyInput = elements.llmApiKey?.value?.trim() || '';
    const nextPreferences = normalizePreferences({
        petScale: Number(elements.petScale.value),
        petSkipTaskbar: !elements.petShowTaskbar.checked,
        speechMode: elements.speechMode.value,
        chunkedTtsEnabled: elements.chunkedTtsEnabled.checked,
        recognitionMode: elements.recognitionMode.value,
        conversationMode: elements.conversationMode?.value || currentPreferences?.conversationMode || 'assistant',
        uiLanguage: elements.uiLanguage?.value || currentPreferences?.uiLanguage || 'zh-CN',
        preferredMicDeviceId: elements.preferredMic.value,
        ailisStateDir: elements.ailisStateDir
            ? elements.ailisStateDir.value.trim()
            : currentPreferences?.ailisStateDir || '',
        ailisResolvedStateDir: currentPreferences?.ailisResolvedStateDir || '',
        ailisDefaultStateDir: currentPreferences?.ailisDefaultStateDir || '',
        voiceRuntimeRoot: elements.voiceRuntimeRoot
            ? elements.voiceRuntimeRoot.value.trim()
            : currentPreferences?.voiceRuntimeRoot || '',
        voiceRuntimeResolvedRoot: currentPreferences?.voiceRuntimeResolvedRoot || '',
        voiceRuntimeDefaultRoot: currentPreferences?.voiceRuntimeDefaultRoot || '',
        llmProvider: elements.llmProvider.value,
        llmBaseUrl: elements.llmBaseUrl.value,
        llmModel: elements.llmModel.value,
        ollamaTarget: nextOllamaTarget,
        ollamaDeploymentMode: ollamaSourceToLegacyMode(nextOllamaTarget.source),
        ollamaLocalModelPath: getOllamaLocalModelPath() || currentOllamaTarget.localPath || '',
        ollamaInstalledModels: normalizeOllamaModelHistory(currentPreferences?.ollamaInstalledModels),
        ollamaUsedModels: elements.llmProvider.value === 'ollama'
            ? mergeOllamaModelHistory(currentPreferences?.ollamaUsedModels, [elements.llmModel.value])
            : normalizeOllamaModelHistory(currentPreferences?.ollamaUsedModels),
        llmApiKeyProfiles: normalizeRendererLlmApiKeyProfiles(currentPreferences?.llmApiKeyProfiles),
        llmApiKeySelectedId: elements.llmApiKeySelect?.value || '',
        llmApiKeyLabel: pendingLlmApiKeyInput ? elements.llmApiKeyLabel?.value?.trim() || '' : '',
        llmApiKeyConfigured: pendingClearLlmKey
            ? false
            : Boolean(currentPreferences?.llmApiKeyConfigured),
        llmApiKeySource: pendingClearLlmKey
            ? 'none'
            : String(currentPreferences?.llmApiKeySource || 'none'),
        llmTemperature: Number(elements.llmTemperature.value),
        llmRequestTimeoutMs: Number(elements.llmTimeout.value),
        elevenLabsApiBase: elements.elevenLabsApiBase.value,
        elevenLabsVoiceId: elements.elevenLabsVoiceId.value,
        elevenLabsModelId: elements.elevenLabsModelId.value,
        elevenLabsLanguageCode: elements.elevenLabsLanguageCode.value,
        elevenLabsOutputFormat: elements.elevenLabsOutputFormat.value,
        elevenLabsTimeoutMs: Number(elements.elevenLabsTimeout.value),
        elevenLabsOptimizeStreamingLatency: Number(elements.elevenLabsOptimizeLatency.value),
        elevenLabsStability: Number(elements.elevenLabsStability.value),
        elevenLabsSimilarityBoost: Number(elements.elevenLabsSimilarity.value),
        elevenLabsStyle: Number(elements.elevenLabsStyle.value),
        elevenLabsSpeed: Number(elements.elevenLabsSpeed.value),
        elevenLabsUseSpeakerBoost: elements.elevenLabsSpeakerBoost.checked,
        elevenLabsVoiceProfiles: draftElevenLabsVoiceProfiles,
        elevenLabsApiKeyConfigured: pendingClearElevenLabsKey
            ? false
            : Boolean(currentPreferences?.elevenLabsApiKeyConfigured),
        elevenLabsApiKeySource: pendingClearElevenLabsKey
            ? 'none'
            : String(currentPreferences?.elevenLabsApiKeySource || 'none'),
        computerControlEnabled: elements.computerControlEnabled.checked,
        emailProfiles: readEmailFormProfiles({ includeSecret }),
        cameraDistance: Number(elements.cameraDistance.value),
        cameraHeight: Number(elements.cameraHeight.value),
        cameraTargetY: Number(elements.cameraTargetY.value),
        renderProfileId: elements.renderProfile.value,
        renderLightYawDeg: Number(elements.renderLightYaw.value),
        renderKeyLightScale: Number(elements.renderKeyLight.value),
        renderAmbientFillScale: Number(elements.renderAmbientFill.value),
        renderOutlineScale: Number(elements.renderOutlineScale.value),
        renderShadowEnabled: elements.renderShadowEnabled.checked,
        renderResolutionScale: normalizeRenderResolutionScale(elements.renderResolutionScale.value, 2),
        renderFpsLimit: getFpsFromSliderIndex(elements.renderFpsLimit.value),
        renderShadowQuality: Number(elements.renderShadowQuality.value),
        renderOutlineEnabled: elements.renderOutlineEnabled.checked,
        renderAntialiasEnabled: elements.renderAntialiasEnabled.checked,
        desktopNativeTtsRate: Number(elements.ttsRate.value),
        desktopNativeTtsPitch: Number(elements.ttsPitch.value),
        desktopNativeTtsVolume: Number(elements.ttsVolume.value),
        avatarDialogueBubbleLeft: Number(elements.avatarBubbleLeft.value),
        avatarDialogueBubbleTop: Number(elements.avatarBubbleTop.value),
        avatarDialogueBubbleScale: Number(elements.avatarBubbleScale.value),
        avatarDialogueBubbleExtraWidth: Number(elements.avatarBubbleExtraWidth.value),
        avatarDialogueBubbleExtraTop: Number(elements.avatarBubbleExtraTop.value),
        petMouseHitTestEnabled: elements.petMouseHitTestEnabled.checked,
        petMouseHitTestShape: elements.petMouseHitTestShape.value,
        petMouseHitTestWidthRatio: Number(elements.petMouseHitTestWidth.value),
        petMouseHitTestHeightRatio: Number(elements.petMouseHitTestHeight.value),
        petMouseHitTestOffsetXRatio: Number(elements.petMouseHitTestOffsetX.value),
        petMouseHitTestOffsetYRatio: Number(elements.petMouseHitTestOffsetY.value),
        petMouseHitTestDebug: elements.petMouseHitTestDebug.checked
    });

    if (includeSecret) {
        const nextApiKey = pendingLlmApiKeyInput;
        if (nextApiKey) {
            nextPreferences.llmApiKey = nextApiKey;
            nextPreferences.llmApiKeyLabel = elements.llmApiKeyLabel?.value?.trim() || '';
        }
        if (pendingClearLlmKey) {
            nextPreferences.llmApiKeyAction = 'clear';
        }
        const nextElevenLabsApiKey = elements.elevenLabsApiKey.value.trim();
        if (nextElevenLabsApiKey) {
            nextPreferences.elevenLabsApiKey = nextElevenLabsApiKey;
        }
        if (pendingClearElevenLabsKey) {
            nextPreferences.elevenLabsApiKeyAction = 'clear';
        }
        nextPreferences.emailProfiles = readEmailFormProfiles({ includeSecret: true });
    }

    return nextPreferences;
}

function readEmailFormProfiles({ includeSecret = false } = {}) {
    const profiles = {};
    for (const [providerId, entry] of Object.entries(emailElements)) {
        profiles[providerId] = {
            account: entry.account?.value?.trim() || '',
            authType: currentPreferences?.emailProfiles?.[providerId]?.authType || 'password',
            secretConfigured: pendingClearEmailSecrets[providerId]
                ? false
                : Boolean(currentPreferences?.emailProfiles?.[providerId]?.secretConfigured),
            secretSource: pendingClearEmailSecrets[providerId]
                ? 'none'
                : String(currentPreferences?.emailProfiles?.[providerId]?.secretSource || 'none')
        };
        if (includeSecret) {
            const secret = entry.secret?.value?.trim() || '';
            if (secret) {
                profiles[providerId].secret = secret;
            }
            if (pendingClearEmailSecrets[providerId]) {
                profiles[providerId].secretAction = 'clear';
            }
        }
    }
    return profiles;
}

function hasDirtyChanges() {
    if (!currentPreferences) {
        return false;
    }

    const hasEmailSecretInput = Object.values(emailElements).some((entry) => entry.secret?.value?.trim());
    const hasPendingEmailClear = Object.values(pendingClearEmailSecrets).some(Boolean);

    return Boolean(elements.llmApiKey.value.trim()) ||
        Boolean(elements.elevenLabsApiKey.value.trim()) ||
        hasEmailSecretInput ||
        hasPendingEmailClear ||
        pendingClearLlmKey ||
        pendingClearElevenLabsKey ||
        JSON.stringify(readFormPreferences()) !== JSON.stringify(currentPreferences);
}

function syncSaveButton() {
    elements.saveBtn.disabled = saveInFlight || !hasDirtyChanges();
    renderModelActivationState();
}

function fillScaleOptions(scaleOptions = []) {
    elements.petScale.innerHTML = '';
    scaleOptions.forEach((scale) => {
        const option = document.createElement('option');
        option.value = String(scale);
        option.textContent = `${Math.round(scale * 100)}%`;
        elements.petScale.appendChild(option);
    });
}

function fillUiLanguageOptions(languageOptions = []) {
    if (!elements.uiLanguage) {
        return;
    }
    const options = languageOptions.length ? languageOptions : ['zh-CN', 'en', 'ja', 'ko'];
    elements.uiLanguage.innerHTML = '';
    options.forEach((language) => {
        const normalizedLanguage = normalizeUiLanguage(language);
        const option = document.createElement('option');
        option.value = normalizedLanguage;
        option.textContent = UI_LANGUAGE_NATIVE_LABELS[normalizedLanguage] || normalizedLanguage;
        elements.uiLanguage.appendChild(option);
    });
}

function fillSpeechModeOptions(modeOptions = []) {
    elements.speechMode.innerHTML = '';
    modeOptions.forEach((mode) => {
        const option = document.createElement('option');
        option.value = mode;
        option.textContent = t(speechModeLabels[mode] || mode);
        elements.speechMode.appendChild(option);
    });
}

function fillRecognitionModeOptions(modeOptions = []) {
    elements.recognitionMode.innerHTML = '';
    modeOptions.forEach((mode) => {
        const option = document.createElement('option');
        option.value = mode;
        option.textContent = t(recognitionModeLabels[mode] || mode);
        elements.recognitionMode.appendChild(option);
    });
}

function fillConversationModeOptions(modeOptions = []) {
    if (!elements.conversationMode) {
        return;
    }
    elements.conversationMode.innerHTML = '';
    modeOptions.forEach((mode) => {
        const option = document.createElement('option');
        option.value = mode;
        option.textContent = t(conversationModeLabels[mode] || mode);
        elements.conversationMode.appendChild(option);
    });
}

function fillLlmProviderOptions(providerOptions = []) {
    elements.llmProvider.innerHTML = '';
    const visibleProviders = Array.from(new Set([...providerOptions, 'ollama']))
        .filter((provider) => provider !== 'vllm')
        .filter(Boolean);
    visibleProviders.forEach((provider) => {
        const option = document.createElement('option');
        option.value = provider;
        option.textContent = t(llmProviderLabels[provider] || provider);
        elements.llmProvider.appendChild(option);
    });
}

function fillRenderProfileOptions(profileOptions = []) {
    elements.renderProfile.innerHTML = '';
    profileOptions.forEach((profileId) => {
        const option = document.createElement('option');
        option.value = profileId;
        option.textContent = t(renderProfileLabels[profileId] || profileId);
        elements.renderProfile.appendChild(option);
    });
}

function getCharacterPackTypeLabel(type = '') {
    if (type === 'character_pack') {
        return '人物包';
    }
    if (type === 'skin_pack') {
        return '皮肤包';
    }
    if (type === 'character_skin_composite') {
        return '人物 + 皮肤';
    }
    if (type === 'builtin') {
        return '默认人物';
    }
    return type || '未知';
}

function renderCharacterAssets(characterAssets = {}) {
    const snapshot = characterAssets || {};
    const active = snapshot.active || {};
    const effective = snapshot.effective || {};
    const packs = Array.isArray(snapshot.packs) ? snapshot.packs : [];
    if (elements.characterActiveType) {
        elements.characterActiveType.textContent = getCharacterPackTypeLabel(effective.type);
    }
    if (elements.characterActiveSummary) {
        const summaryParts = [
            effective.displayName || 'AILIS 默认人物',
            effective.renderProfileId ? `渲染：${renderProfileLabels[effective.renderProfileId] || effective.renderProfileId}` : '',
            effective.modelUrl ? '包含独立 VRM，启用后会重载桌宠窗口' : '使用默认 VRM',
            effective.source === 'asset_pack' ? '来源：本地人物资产包' : '来源：内置默认资产'
        ].filter(Boolean);
        elements.characterActiveSummary.textContent = summaryParts.join(' | ');
    }
    if (elements.characterPackRoot) {
        elements.characterPackRoot.textContent = snapshot.installedDir
            ? `本地安装目录：${snapshot.installedDir}`
            : '本地安装目录尚未初始化。';
    }
    if (!elements.characterPackList) {
        return;
    }
    clearElement(elements.characterPackList);
    if (!packs.length) {
        const empty = document.createElement('div');
        empty.className = 'field-help';
        empty.textContent = '还没有安装本地人物包。可以先点“安装测试包”验证切换流程。';
        elements.characterPackList.appendChild(empty);
        return;
    }
    packs.forEach((pack) => {
        const isActive = pack.id === active.characterPackId || pack.id === active.skinPackId;
        const card = document.createElement('div');
        card.className = `asset-pack-card${isActive ? ' is-active' : ''}`;

        const title = document.createElement('div');
        title.className = 'asset-pack-title';
        const name = document.createElement('span');
        name.textContent = pack.displayName || pack.id;
        const badge = document.createElement('span');
        badge.className = 'field-value';
        badge.textContent = isActive ? '启用中' : getCharacterPackTypeLabel(pack.type);
        title.append(name, badge);

        const meta = document.createElement('div');
        meta.className = 'asset-pack-meta';
        const metaParts = [
            `${getCharacterPackTypeLabel(pack.type)} · ${pack.version || '0.0.0'} · ${pack.publisher || 'Local'}`,
            pack.description || '',
            pack.assets?.vrm ? '包含 VRM 模型，启用会重载桌宠窗口。' : '不替换 VRM，仅覆盖人物外观/风格元数据。',
            pack.renderProfileId ? `渲染风格：${renderProfileLabels[pack.renderProfileId] || pack.renderProfileId}` : ''
        ].filter(Boolean);
        meta.textContent = metaParts.join(' ');

        const actions = document.createElement('div');
        actions.className = 'asset-pack-actions';
        const activateButton = document.createElement('button');
        activateButton.className = 'ghost-btn';
        activateButton.type = 'button';
        activateButton.textContent = isActive ? '重新应用' : '启用';
        activateButton.addEventListener('click', () => {
            void activateCharacterPack(pack.id);
        });
        actions.appendChild(activateButton);

        const uninstallButton = document.createElement('button');
        uninstallButton.className = 'danger-btn';
        uninstallButton.type = 'button';
        uninstallButton.textContent = '卸载';
        uninstallButton.addEventListener('click', () => {
            void uninstallCharacterPack(pack.id, pack.displayName || pack.id);
        });
        actions.appendChild(uninstallButton);

        if (pack.error) {
            const error = document.createElement('div');
            error.className = 'field-help';
            error.textContent = `读取失败：${pack.error}`;
            card.append(title, meta, error, actions);
        } else {
            card.append(title, meta, actions);
        }
        elements.characterPackList.appendChild(card);
    });
}

async function refreshCharacterAssets({ silent = false } = {}) {
    if (!window.ailisDesktop?.assetPacks?.list) {
        return null;
    }
    try {
        const snapshot = await window.ailisDesktop.assetPacks.list();
        panelState = {
            ...(panelState || {}),
            preferences: {
                ...((panelState && panelState.preferences) || {}),
                characterAssets: snapshot
            }
        };
        renderCharacterAssets(snapshot);
        return snapshot;
    } catch (error) {
        if (elements.characterActiveSummary) {
            elements.characterActiveSummary.textContent = `读取人物资产失败：${error.message || error}`;
        }
        if (!silent) {
            setStatus(`读取人物资产失败：${error.message || error}`);
        }
        return null;
    }
}

async function installCharacterPackFromFolder() {
    if (!window.ailisDesktop?.assetPacks?.installFromFolder) {
        setStatus('当前桌面宿主不支持人物包安装。');
        return;
    }
    setStatus('请选择包含 manifest.json 的人物包目录。');
    const result = await window.ailisDesktop.assetPacks.installFromFolder();
    if (result?.canceled) {
        setStatus('已取消安装人物包。');
        return;
    }
    renderCharacterAssets(result?.snapshot);
    setStatus(`已安装人物资产：${result?.installed?.displayName || result?.installed?.id || '本地包'}`);
}

async function installSampleCharacterPack() {
    if (!window.ailisDesktop?.assetPacks?.installSample) {
        setStatus('当前桌面宿主不支持测试人物包。');
        return;
    }
    setStatus('正在安装本地测试皮肤包...');
    const result = await window.ailisDesktop.assetPacks.installSample();
    renderCharacterAssets(result?.snapshot);
    setStatus(`测试皮肤包已安装：${result?.installed?.displayName || result?.installed?.id || 'AILIS Test Skin'}`);
}

async function activateCharacterPack(packId) {
    if (!packId || !window.ailisDesktop?.assetPacks?.activate) {
        return;
    }
    setStatus('正在启用人物资产...');
    const result = await window.ailisDesktop.assetPacks.activate({ id: packId });
    renderCharacterAssets(result?.snapshot);
    const requiresReload = Boolean(result?.snapshot?.effective?.requiresReloadForModel);
    setStatus(requiresReload
        ? '人物资产已启用。包含独立 VRM，桌宠窗口会自动重载。'
        : '人物资产已启用，渲染风格会同步到桌宠窗口。');
}

async function resetActiveCharacterPack() {
    if (!window.ailisDesktop?.assetPacks?.resetActive) {
        return;
    }
    setStatus('正在恢复默认人物...');
    const result = await window.ailisDesktop.assetPacks.resetActive({});
    renderCharacterAssets(result?.snapshot);
    setStatus('已恢复默认 AILIS 人物。');
}

async function uninstallCharacterPack(packId, displayName = '') {
    if (!packId || !window.ailisDesktop?.assetPacks?.uninstall) {
        return;
    }
    const confirmed = window.confirm(`卸载人物资产“${displayName || packId}”？已安装文件会从本机移除。`);
    if (!confirmed) {
        return;
    }
    const result = await window.ailisDesktop.assetPacks.uninstall({ id: packId });
    renderCharacterAssets(result?.snapshot);
    setStatus(`已卸载人物资产：${displayName || packId}`);
}

function syncLlmKeyState() {
    renderLlmApiKeySelect();
    const provider = elements.llmProvider?.value || currentPreferences?.llmProvider || 'openai-compatible';
    const selected = getSelectedLlmApiKeyMeta(provider);
    const profile = getCurrentLlmApiKeyProfile(provider);
    if (pendingClearLlmKey) {
        elements.llmKeyState.textContent = selected
            ? `保存后会移除当前服务商的 Key：${selected.label}${selected.masked ? `（${selected.masked}）` : ''}。`
            : '保存后会清除当前服务商已保存 Key。';
        return;
    }

    if (isLocalLlmProvider()) {
        elements.llmKeyState.textContent = elements.llmApiKey.value.trim()
            ? '保存后会把这个本地服务鉴权 Key 记录到当前本地服务商。'
            : selected
                ? `当前本地服务会使用已保存 Key：${selected.label}${selected.masked ? `（${selected.masked}）` : ''}。`
                : '本地 Ollama 通常无需 Key；如果你给 Ollama 代理服务加了鉴权，可以在这里保存。';
        return;
    }

    if (selected || currentPreferences?.llmApiKeyConfigured) {
        if (currentPreferences.llmApiKeySource === 'environment') {
            elements.llmKeyState.textContent = elements.llmApiKey.value.trim()
                ? '保存后会把新 Key 保存到当前服务商，本地保存优先于环境变量。'
                : 'Key 状态：已从环境变量读取。';
            return;
        }

        elements.llmKeyState.textContent = elements.llmApiKey.value.trim()
            ? `保存后会把新 Key 加入 ${llmProviderLabels[provider] || provider}，并设为默认。`
            : selected
                ? `当前使用：${selected.label}${selected.masked ? `（${selected.masked}）` : ''}。这个服务商共保存 ${profile.keys.length} 个 Key。`
                : 'Key 状态：已保存。留空会继续沿用当前 Key。';
        return;
    }

    elements.llmKeyState.textContent = elements.llmApiKey.value.trim()
        ? '保存后会写入新的 Key。'
        : 'Key 状态：未配置。';
}

function formatCapabilityFlag(value) {
    if (value === true) {
        return '支持';
    }
    if (value === false) {
        return '未确认';
    }
    return String(value || '未知');
}

function estimateLlmCapabilities(provider, model) {
    const providerCaps = panelState?.options?.llmProviderCapabilities?.[provider] || {};
    const lowerModel = String(model || '').toLowerCase();
    const vision = provider === 'openai-compatible'
        ? /(vision|vl|omni|gpt-4o|gpt-4\.1|gpt-5|qwen.*vl|glm-4v|doubao.*vision|seed.*vision|kimi.*vision)/i.test(lowerModel)
        : Boolean(providerCaps.vision);
    const lowLatency = /(mini|flash|haiku|turbo|lite|fast|speed|doubao|deepseek-chat)/i.test(lowerModel);
    const longContext = provider === 'openai-compatible'
        ? /(128k|200k|1m|long|qwen|doubao|deepseek)/i.test(lowerModel)
        : Boolean(providerCaps.longContext);
    return {
        ...providerCaps,
        provider,
        model,
        vision,
        longContext,
        lowLatency
    };
}

function renderLlmCapabilityState(capabilities = null) {
    if (!elements.llmCapabilityState) {
        return;
    }
    const provider = elements.llmProvider?.value || currentPreferences?.llmProvider || 'openai-compatible';
    const model = elements.llmModel?.value || currentPreferences?.llmModel || '';
    const caps = capabilities || estimateLlmCapabilities(provider, model);
    elements.llmCapabilityState.textContent = [
        `传输：${caps.transport || '未知'}`,
        `视觉：${formatCapabilityFlag(caps.vision)}`,
        `工具调用：${formatCapabilityFlag(caps.nativeToolCalling)}`,
        `JSON：${formatCapabilityFlag(caps.jsonMode || caps.jsonSchema)}`,
        `长上下文：${formatCapabilityFlag(caps.longContext)}`,
        `低延迟：${formatCapabilityFlag(caps.lowLatency)}`
    ].join(' | ');
}

function renderLlmHealthState(result = null) {
    if (!elements.llmHealthState) {
        return;
    }
    if (!result) {
        elements.llmHealthState.textContent = '尚未测试当前模型。';
        renderModelActivationState();
        return;
    }
    if (result.ok) {
        elements.llmHealthState.textContent = '连接正常。';
    } else {
        const failedCheck = Object.entries(result.checks || {})
            .find(([, check]) => check && !check.skipped && !check.ok)?.[0];
        const reason = result.summary || (failedCheck ? `${failedCheck} 检测失败` : '请检查 Key、服务商和模型。');
        elements.llmHealthState.textContent = `连接异常：${reason}`;
    }
    renderLlmCapabilityState(result.capabilities);
    renderModelActivationState();
}

function getProviderDefaultBaseUrl(provider) {
    return llmProviderDefaultBaseUrls[provider] || fallbackLlmProviderDefaultBaseUrls[provider] || '';
}

function getProviderDefaultModel(provider) {
    return llmProviderDefaultModels[provider] || fallbackLlmProviderDefaultModels[provider] || '';
}

function getSelectedPresetLabel() {
    const preset = getLlmPreset(elements.llmPreset?.value);
    return preset?.label || llmProviderLabels[elements.llmProvider?.value] || elements.llmProvider?.value || '未选择';
}

function hasUnsavedModelChanges() {
    if (!currentPreferences) {
        return false;
    }
    const selectedKeyId = elements.llmApiKeySelect?.value || '';
    const savedKeyId = currentPreferences.llmActiveApiKeyId || getCurrentLlmApiKeyProfile(currentPreferences.llmProvider).activeKeyId || '';
    const pendingKeyInput = elements.llmApiKey?.value?.trim() || '';
    return Boolean(elements.llmApiKey?.value?.trim()) ||
        Boolean(pendingKeyInput && elements.llmApiKeyLabel?.value?.trim()) ||
        pendingClearLlmKey ||
        selectedKeyId !== savedKeyId ||
        elements.llmProvider?.value !== currentPreferences.llmProvider ||
        elements.llmBaseUrl?.value !== currentPreferences.llmBaseUrl ||
        elements.llmModel?.value !== currentPreferences.llmModel;
}

function getLocalRuntimeStatusText(provider) {
    const runtime = provider === 'ollama' ? panelState?.ollamaRuntime : null;
    const diagnosis = runtime?.diagnosis || null;
    const service = diagnosis?.service || null;
    const status = runtime?.status || '';
    if (status === 'running') {
        return '正在部署，完成后会自动启用';
    }
    if (status === 'failed') {
        return `部署失败：${runtime.failure?.message || runtime.failure?.code || '需要查看日志'}`;
    }
    if (status === 'cancelled') {
        return '部署已取消，数据已保留';
    }
    if (provider === 'ollama' && service?.ok) {
        return service.modelPresent ? `Ollama 已就绪：${service.model}` : `Ollama 服务已响应，但缺少模型 ${service.model}`;
    }
    if (diagnosis) {
        return diagnosis.ok ? '本地运行时可用，建议测试连接' : '本地运行时还需要配置';
    }
    return '尚未诊断本地运行时';
}

function getModelNextStep({ provider, model, hasUnsaved, keyReady }) {
    if (!model) {
        return '先选择一个模型。云端模型选预设；本地模型选 Ollama 后按下面的部署向导走。';
    }
    if (provider === 'ollama') {
        const runtime = panelState?.ollamaRuntime;
        if (runtime?.status === 'running') {
            return '正在配置 Ollama，完成后会自动启用。';
        }
        if (runtime?.status === 'ready' || runtime?.diagnosis?.service?.ok) {
            return hasUnsaved ? 'Ollama 已就绪。点击右下角“保存设置”，再测试连接。' : 'Ollama 看起来已启用。建议点击“测试连接”确认真实可用。';
        }
        return '确认模型名后点击“自动部署并启用”，或者先点“诊断环境”。';
    }
    if (!keyReady) {
        return '填写 API Key，点击“测试连接”，成功后保存设置。';
    }
    return hasUnsaved ? '模型配置有改动。点击右下角“保存设置”后才会正式生效。' : '当前配置已保存。可以点击“测试连接”确认质量和能力。';
}

function renderModelActivationState() {
    if (!elements.modelActiveSummary) {
        return;
    }
    const provider = elements.llmProvider?.value || currentPreferences?.llmProvider || 'openai-compatible';
    const presetLabel = getSelectedPresetLabel();
    const model = elements.llmModel?.value?.trim() || currentPreferences?.llmModel || '';
    const baseUrl = elements.llmBaseUrl?.value?.trim() || currentPreferences?.llmBaseUrl || '';
    const localProvider = isLocalLlmProvider(provider);
    const hasUnsaved = hasUnsavedModelChanges();
    const selectedSavedKey = getSelectedLlmApiKeyMeta(provider);
    const keyReady = localProvider ||
        Boolean(elements.llmApiKey?.value?.trim()) ||
        Boolean(selectedSavedKey && !pendingClearLlmKey) ||
        Boolean(currentPreferences?.llmApiKeyConfigured && !pendingClearLlmKey);
    const runtimeText = localProvider ? getLocalRuntimeStatusText(provider) : '云端 API，需通过连接测试确认';
    const keyText = localProvider
        ? '本地服务通常无需 Key'
        : selectedSavedKey && !elements.llmApiKey?.value?.trim()
            ? `Key：${selectedSavedKey.label}${selectedSavedKey.masked ? `（${selectedSavedKey.masked}）` : ''}`
            : keyReady ? 'Key 已配置或本次已输入' : 'Key 未配置';

    elements.modelActiveSummary.textContent = hasUnsaved
        ? '有未保存的模型改动'
        : model ? '当前模型配置已保存' : '尚未选择可用模型';
    elements.modelActiveSubtitle.textContent = localProvider
        ? '本地模型需要先让运行时服务真正启动；部署成功后会自动写回模型配置。'
        : '云端模型需要 Key、Base URL 和模型 ID 都正确；保存后聊天和 Agent 才会使用。';
    elements.modelActiveProvider.textContent = presetLabel;
    elements.modelActiveModel.textContent = model || '未选择';
    elements.modelActiveBase.textContent = baseUrl || '未设置';
    elements.modelActiveKey.textContent = keyText;
    elements.modelActiveRuntime.textContent = runtimeText;
    elements.modelActiveNextStep.textContent = getModelNextStep({ provider, model, hasUnsaved, keyReady });
}

function formatCompactCount(value) {
    const numeric = Number(value) || 0;
    if (numeric >= 1_000_000) {
        return `${(numeric / 1_000_000).toFixed(numeric >= 10_000_000 ? 0 : 1)}M`;
    }
    if (numeric >= 1_000) {
        return `${(numeric / 1_000).toFixed(numeric >= 10_000 ? 0 : 1)}K`;
    }
    return String(Math.round(numeric));
}

function formatBytesCompact(value) {
    const bytes = Number(value) || 0;
    if (!bytes) {
        return '';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }
    return `${size.toFixed(unitIndex >= 3 ? 1 : 0)}${units[unitIndex]}`;
}

function formatVllmCatalogModelLabel(model = {}) {
    const source = model.source === 'hf' ? 'HF' : model.sourceLabel || 'Model';
    const downloads = model.downloads ? `${formatCompactCount(model.downloads)} downloads` : '';
    const likes = model.likes ? `${formatCompactCount(model.likes)} likes` : '';
    const size = formatBytesCompact(model.sizeBytes);
    const meta = [downloads, likes, size, model.fit?.label].filter(Boolean).join(' · ');
    return `[${source}] ${model.id}${meta ? ` · ${meta}` : ''}`;
}

function getDynamicVllmModelOptions() {
    const seen = new Set();
    const options = [];
    for (const model of vllmModelCatalogResults) {
        const id = String(model?.id || '').trim();
        if (!id || seen.has(id.toLowerCase())) {
            continue;
        }
        seen.add(id.toLowerCase());
        options.push({
            id,
            label: formatVllmCatalogModelLabel(model),
            dynamic: true
        });
    }
    return options;
}

function getLlmPresetModelOptions(preset) {
    const staticModels = Array.isArray(preset?.models) ? preset.models : [];
    if (preset?.id !== 'vllm') {
        return staticModels;
    }
    const seen = new Set(staticModels.map((model) => String(model.id || '').toLowerCase()));
    const dynamicModels = getDynamicVllmModelOptions()
        .filter((model) => !seen.has(String(model.id || '').toLowerCase()));
    return [...staticModels, ...dynamicModels];
}

function normalizeBaseUrlForPreset(value = '') {
    return String(value || '').trim().replace(/\/+$/, '').toLowerCase();
}

function getLlmPreset(presetId) {
    return llmPresetCatalog.find((preset) => preset.id === presetId) ||
        llmPresetCatalog.find((preset) => preset.id === LLM_PRESET_CUSTOM_ID);
}

function getPresetDefaultModel(preset) {
    return preset?.models?.[0]?.id || '';
}

function findMatchingLlmPreset({ provider = '', baseUrl = '', model = '' } = {}) {
    const normalizedProvider = String(provider || '').trim();
    const normalizedBaseUrl = normalizeBaseUrlForPreset(baseUrl);
    const normalizedModel = String(model || '').trim();
    const exactPreset = llmPresetCatalog.find((preset) =>
        preset.id !== LLM_PRESET_CUSTOM_ID &&
        preset.provider === normalizedProvider &&
        normalizeBaseUrlForPreset(preset.baseUrl) === normalizedBaseUrl &&
        getLlmPresetModelOptions(preset).some((entry) => entry.id === normalizedModel)
    );
    if (exactPreset) {
        return {
            preset: exactPreset,
            model: normalizedModel
        };
    }

    const basePreset = llmPresetCatalog.find((preset) =>
        preset.id !== LLM_PRESET_CUSTOM_ID &&
        preset.provider === normalizedProvider &&
        normalizeBaseUrlForPreset(preset.baseUrl) === normalizedBaseUrl
    );
    if (basePreset) {
        return {
            preset: basePreset,
            model: getLlmPresetModelOptions(basePreset).some((entry) => entry.id === normalizedModel)
                ? normalizedModel
                : LLM_PRESET_CUSTOM_ID
        };
    }

    return {
        preset: getLlmPreset(LLM_PRESET_CUSTOM_ID),
        model: LLM_PRESET_CUSTOM_ID
    };
}

function fillLlmPresetOptions() {
    if (!elements.llmPreset) {
        return;
    }
    elements.llmPreset.innerHTML = '';
    llmPresetCatalog.forEach((preset) => {
        const option = document.createElement('option');
        option.value = preset.id;
        option.textContent = preset.label;
        elements.llmPreset.appendChild(option);
    });
}

function fillLlmModelPresetOptions(presetId, selectedModel = '') {
    if (!elements.llmModelPreset) {
        return;
    }
    const preset = getLlmPreset(presetId);
    const modelOptions = getLlmPresetModelOptions(preset);
    elements.llmModelPreset.innerHTML = '';

    if (!modelOptions.length) {
        const option = document.createElement('option');
        option.value = LLM_PRESET_CUSTOM_ID;
        option.textContent = '手动填写高级模型 ID';
        elements.llmModelPreset.appendChild(option);
        elements.llmModelPreset.value = LLM_PRESET_CUSTOM_ID;
        return;
    }

    modelOptions.forEach((model) => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = model.label || model.id;
        elements.llmModelPreset.appendChild(option);
    });

    const customOption = document.createElement('option');
    customOption.value = LLM_PRESET_CUSTOM_ID;
    customOption.textContent = '自定义模型 ID';
    elements.llmModelPreset.appendChild(customOption);

    elements.llmModelPreset.value = modelOptions.some((entry) => entry.id === selectedModel)
        ? selectedModel
        : LLM_PRESET_CUSTOM_ID;
}

function syncLlmPresetHelp(presetId = elements.llmPreset?.value) {
    if (!elements.llmPresetHelp) {
        return;
    }
    const preset = getLlmPreset(presetId);
    elements.llmPresetHelp.textContent = preset?.help || '选择服务商后填写对应配置；本地 Ollama 通常不需要 API Key。';
}

function getLocalLlmSetupHelp(provider = elements.llmProvider?.value) {
    if (provider === 'ollama') {
        return [
            'Ollama 使用步骤：先选择“已安装模型 / 导入本地文件 / 在线下载模型”三种来源之一，',
            '再点击下方主按钮。API Base 保持 http://127.0.0.1:11434，API Key 通常留空。'
        ].join('');
    }
    return '云端模型通常只需要填写平台 API Key；本地部署入口只会在选择 Ollama 时显示。';
}

function syncLlmSetupHelp() {
    if (!elements.llmSetupHelp) {
        return;
    }
    elements.llmSetupHelp.textContent = getLocalLlmSetupHelp(elements.llmProvider?.value);
}

function getSelectedLocalLlmProvider() {
    const provider = elements.llmProvider?.value || '';
    if (isLocalLlmProvider(provider)) {
        return provider;
    }
    const presetProvider = getLlmPreset(elements.llmPreset?.value)?.provider || '';
    return isLocalLlmProvider(presetProvider) ? presetProvider : '';
}

function isVllmModelCatalogVisible() {
    return false;
}

function renderVllmModelCatalogSelect() {
    if (!elements.vllmModelCatalog) {
        return;
    }
    elements.vllmModelCatalog.innerHTML = '';
    if (!vllmModelCatalogResults.length) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '尚未加载实时模型目录';
        elements.vllmModelCatalog.appendChild(option);
        elements.vllmModelCatalog.disabled = true;
        if (elements.vllmModelApplyBtn) {
            elements.vllmModelApplyBtn.disabled = true;
        }
        return;
    }
    vllmModelCatalogResults.forEach((model, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = formatVllmCatalogModelLabel(model);
        option.title = [model.url, model.fit?.detail].filter(Boolean).join('\n');
        elements.vllmModelCatalog.appendChild(option);
    });
    elements.vllmModelCatalog.disabled = false;
    if (elements.vllmModelApplyBtn) {
        elements.vllmModelApplyBtn.disabled = false;
    }
}

function renderVllmModelCatalogStatus(result = null) {
    if (!elements.vllmModelCatalogStatus) {
        return;
    }
    const currentResult = result || vllmModelCatalogLastResult;
    if (vllmModelCatalogInFlight) {
        elements.vllmModelCatalogStatus.textContent = '正在从 Hugging Face / ModelScope 实时查找 vLLM 可用模型...';
        return;
    }
    if (!currentResult && !vllmModelCatalogResults.length) {
        elements.vllmModelCatalogStatus.textContent =
            '本机没有模型时，在这里搜索并下载。已有模型请用左侧本地模型。';
        return;
    }
    const sourceSummary = (currentResult?.sources || [])
        .map((source) => `${source.sourceLabel || source.source}: ${source.returned}/${source.total}`)
        .join('；');
    const errorSummary = (currentResult?.errors || [])
        .map((error) => error.message)
        .filter(Boolean)
        .join('；');
    const parts = [
        `已加载 ${vllmModelCatalogResults.length} 个候选`,
        sourceSummary ? `来源：${sourceSummary}` : '',
        errorSummary ? `部分来源失败：${errorSummary}` : '',
        '选中后可直接下载、部署并启用。'
    ].filter(Boolean);
    elements.vllmModelCatalogStatus.textContent = parts.join(' ');
}

function syncLocalLlmRuntimePanel({ maybeRefresh = false } = {}) {
    const provider = getSelectedLocalLlmProvider();
    const visible = Boolean(provider);
    if (elements.localLlmRuntimePanel) {
        elements.localLlmRuntimePanel.hidden = !visible;
    }
    if (elements.ollamaRuntimePanel) {
        elements.ollamaRuntimePanel.hidden = provider !== 'ollama';
    }
    if (elements.llmModelCard) {
        elements.llmModelCard.hidden = provider === 'ollama';
    }
    if (elements.vllmModelCatalogPanel) {
        elements.vllmModelCatalogPanel.hidden = true;
    }
    if (!visible) {
        if (elements.llmModelCard) {
            elements.llmModelCard.hidden = false;
        }
        renderModelActivationState();
        return;
    }

    if (elements.localLlmRuntimeTitle) {
        elements.localLlmRuntimeTitle.textContent = 'Ollama 本地模型运行时';
    }
    if (elements.localLlmRuntimeCopy) {
        elements.localLlmRuntimeCopy.textContent =
            '当前选择的是 Ollama。选择模型来源后，AILIS 会按该来源检查、部署并启用。';
    }

    if (provider === 'ollama') {
        renderOllamaLocalModelStatus(ollamaLocalModelDescriptor);
        renderOllamaModelMemoryLists();
        renderOllamaModelCatalogSelect();
        renderOllamaModelCatalogStatus();
        syncOllamaInstalledModelFromMainModel();
        renderOllamaDeploymentMode();
        renderOllamaRuntimeStatus(panelState?.ollamaRuntime || {});
        renderModelActivationState();
        return;
    }

    renderModelActivationState();
}

function syncVllmModelCatalogPanel(options = {}) {
    syncLocalLlmRuntimePanel(options);
}

async function refreshVllmModelCatalog() {
    if (!window.ailisDesktop?.llm?.searchVllmModels) {
        if (elements.vllmModelCatalogStatus) {
            elements.vllmModelCatalogStatus.textContent = '当前桌面宿主不支持实时模型目录。';
        }
        return;
    }
    const requestId = ++vllmModelCatalogRequestId;
    vllmModelCatalogInFlight = true;
    if (elements.vllmModelRefreshBtn) {
        elements.vllmModelRefreshBtn.disabled = true;
        elements.vllmModelRefreshBtn.textContent = '搜索中...';
    }
    renderVllmModelCatalogStatus();
    try {
        const result = await window.ailisDesktop.llm.searchVllmModels({
            source: elements.vllmModelSource?.value || 'both',
            query: elements.vllmModelQuery?.value || '',
            limit: 40
        });
        if (requestId !== vllmModelCatalogRequestId) {
            return;
        }
        vllmModelCatalogLastResult = result || null;
        vllmModelCatalogResults = Array.isArray(result?.models) ? result.models : [];
        renderVllmModelCatalogSelect();
        if (elements.llmPreset?.value === 'vllm') {
            fillLlmModelPresetOptions('vllm', elements.llmModel?.value || '');
        }
        renderVllmModelCatalogStatus(result);
    } catch (error) {
        vllmModelCatalogLastResult = {
            sources: [],
            errors: [{ message: error.message || String(error) }]
        };
        if (elements.vllmModelCatalogStatus) {
            elements.vllmModelCatalogStatus.textContent = `实时模型目录加载失败：${error.message || error}`;
        }
    } finally {
        if (requestId === vllmModelCatalogRequestId) {
            vllmModelCatalogInFlight = false;
            if (elements.vllmModelRefreshBtn) {
                elements.vllmModelRefreshBtn.disabled = false;
                elements.vllmModelRefreshBtn.textContent = '搜索模型';
            }
            renderVllmModelCatalogStatus();
        }
    }
}

function getSelectedVllmCatalogModel({ allowCurrentModelFallback = false } = {}) {
    if (elements.vllmModelCatalog && vllmModelCatalogResults.length) {
        return vllmModelCatalogResults[Number(elements.vllmModelCatalog.value)] || null;
    }
    if (!allowCurrentModelFallback) {
        return null;
    }
    const id = elements.llmModel?.value?.trim() || '';
    return id
        ? { id, source: elements.vllmModelSource?.value || 'modelscope', sourceLabel: '当前模型' }
        : null;
}

function inferVllmServedNameFromPath(modelPath = '') {
    const cleanPath = String(modelPath || '').trim().replace(/[\\/]+$/, '');
    const lastSegment = cleanPath.split(/[\\/]/).filter(Boolean).pop() || 'local-model';
    const safeName = lastSegment
        .replace(/[_\s]+/g, '-')
        .replace(/[^A-Za-z0-9./-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return safeName ? `local-${safeName}`.slice(0, 120) : 'local-model';
}

function getLocalVllmModelPath() {
    return elements.vllmLocalModelPath?.value?.trim() || '';
}

function getLocalVllmServedName(modelPath = getLocalVllmModelPath()) {
    return (elements.vllmLocalServedName?.value?.trim() || inferVllmServedNameFromPath(modelPath)).slice(0, 160);
}

function formatBytesGiB(bytes = 0) {
    const value = Number(bytes) || 0;
    return `${(value / 1024 / 1024 / 1024).toFixed(1)}GB`;
}

function getVllmDownloadDir() {
    return elements.vllmDownloadDir?.value?.trim() || '';
}

function getSelectedVllmModelSizeBytes(model = getSelectedVllmCatalogModel()) {
    return Number(model?.sizeBytes || model?.modelSizeBytes || 0) || 0;
}

function getVllmOnlineSource(model = null) {
    const source = String(model?.source || elements.vllmModelSource?.value || 'modelscope').trim().toLowerCase();
    if (source === 'huggingface' || source === 'hugging-face') {
        return 'hf';
    }
    if (source === 'ms' || source === 'model-scope' || source === 'model_scope') {
        return 'modelscope';
    }
    if (source === 'both') {
        return 'modelscope';
    }
    return source || 'modelscope';
}

function isWindowsHost() {
    const platform = String(navigator.userAgentData?.platform || navigator.platform || '').toLowerCase();
    return platform.includes('win');
}

function getVllmDeploymentRuntimeMode() {
    return isWindowsHost() ? 'managed' : 'native';
}

function buildVllmRuntimePayload(model = null) {
    const selectedModel = model || getSelectedVllmDeploymentModel();
    const isLocal = selectedModel?.source === 'local';
    const modelId = selectedModel?.id || elements.llmModel?.value?.trim() || getProviderDefaultModel('vllm');
    const servedModelName = selectedModel?.servedModelName || modelId;
    const payload = {
        host: '127.0.0.1',
        port: 8000,
        modelId,
        servedModelName,
        source: isLocal ? 'local' : getVllmOnlineSource(selectedModel),
        runtimeMode: getVllmDeploymentRuntimeMode(),
        installWsl: true
    };
    if (!isLocal) {
        payload.downloadDir = getVllmDownloadDir();
        payload.modelSizeBytes = getSelectedVllmModelSizeBytes(selectedModel);
    }
    return payload;
}

function renderVllmDownloadDirStatus(descriptor = vllmDownloadDirDescriptor) {
    if (!elements.vllmDownloadDirStatus) {
        return;
    }
    const downloadDir = getVllmDownloadDir();
    if (!downloadDir) {
        elements.vllmDownloadDirStatus.textContent = '自动安装模型前先选择路径；AILIS 会检查目录和剩余空间。';
        return;
    }
    if (!descriptor) {
        elements.vllmDownloadDirStatus.textContent = `安装路径：${downloadDir}。选择在线模型后会检查预计空间。`;
        return;
    }
    const parts = [`安装路径：${descriptor.path || downloadDir}`];
    if (descriptor.freeBytes) {
        parts.push(`可用空间：${formatBytesGiB(descriptor.freeBytes)}`);
    }
    if (descriptor.requiredBytes) {
        parts.push(`预计需要：${formatBytesGiB(descriptor.requiredBytes)}`);
    }
    if (descriptor.blockers?.length) {
        parts.push(`阻断：${descriptor.blockers.join('；')}`);
    } else if (descriptor.warnings?.length) {
        parts.push(`提示：${descriptor.warnings.join('；')}`);
    } else {
        parts.push('路径可用。');
    }
    elements.vllmDownloadDirStatus.textContent = parts.join(' | ');
}

function renderLocalVllmModelStatus(descriptor = vllmLocalModelDescriptor) {
    if (!elements.vllmLocalModelStatus) {
        return;
    }
    const modelPath = getLocalVllmModelPath();
    if (!modelPath) {
        elements.vllmLocalModelStatus.textContent = '如果模型已经下载在本机，优先选择这里，不需要再从 HF/魔塔下载。';
        return;
    }
    const parts = [`本地模型：${modelPath}`];
    if (descriptor?.format) {
        parts.push(`格式：${descriptor.format}`);
    }
    if (descriptor?.weightFiles?.length) {
        parts.push(`权重：${descriptor.weightFiles.slice(0, 3).join(', ')}${descriptor.weightFiles.length > 3 ? '...' : ''}`);
    }
    if (descriptor?.warnings?.length) {
        parts.push(`提示：${descriptor.warnings.join('；')}`);
    }
    if (descriptor?.blockers?.length) {
        parts.push(`阻断：${descriptor.blockers.join('；')}`);
    } else {
        parts.push('模型目录检查通过后，点击“部署并启用”，AILIS 会自动准备运行环境、启动本地服务并写回当前模型配置。');
    }
    elements.vllmLocalModelStatus.textContent = parts.join(' | ');
}

function applyLocalVllmModelSelection(descriptor = vllmLocalModelDescriptor) {
    const modelPath = descriptor?.path || getLocalVllmModelPath();
    if (!modelPath) {
        setStatus('请先选择一个本地模型文件夹。');
        return null;
    }
    const servedName = elements.vllmLocalServedName?.value?.trim() || descriptor?.suggestedModelName || inferVllmServedNameFromPath(modelPath);
    if (elements.vllmLocalModelPath) {
        elements.vllmLocalModelPath.value = modelPath;
    }
    if (elements.vllmLocalServedName) {
        elements.vllmLocalServedName.value = servedName;
    }
    if (elements.llmPreset) {
        elements.llmPreset.value = 'vllm';
    }
    if (elements.llmProvider) {
        elements.llmProvider.value = 'vllm';
        lastLlmProviderValue = 'vllm';
    }
    if (elements.llmBaseUrl) {
        elements.llmBaseUrl.value = getProviderDefaultBaseUrl('vllm');
    }
    if (elements.llmModel) {
        elements.llmModel.value = servedName;
    }
    fillLlmModelPresetOptions('vllm', servedName);
    syncLlmPresetHelp('vllm');
    syncLlmSetupHelp();
    syncLlmKeyState();
    renderLlmCapabilityState();
    renderLlmHealthState(null);
    renderLocalVllmModelStatus(descriptor);
    syncSaveButton();
    return {
        id: modelPath,
        source: 'local',
        sourceLabel: '本地模型',
        servedModelName: servedName,
        localPath: modelPath,
        descriptor
    };
}

async function chooseLocalVllmModelFolder() {
    if (!window.ailisDesktop?.vllmRuntime?.chooseLocalModelFolder) {
        setStatus('当前桌面宿主不支持选择本地 vLLM 模型目录。');
        return;
    }
    try {
        const result = await window.ailisDesktop.vllmRuntime.chooseLocalModelFolder();
        if (!result?.ok || result.canceled) {
            return;
        }
        vllmLocalModelDescriptor = result;
        applyLocalVllmModelSelection(result);
        setStatus(`已选择本地模型目录：${result.suggestedModelName || result.path}`);
    } catch (error) {
        setStatus(`选择本地模型目录失败：${error.message || error}`);
    }
}

async function describeLocalVllmModelPath(modelPath = getLocalVllmModelPath(), { silent = false } = {}) {
    const cleanPath = String(modelPath || '').trim();
    if (!cleanPath) {
        return null;
    }
    if (vllmLocalModelDescriptor?.path === cleanPath) {
        return vllmLocalModelDescriptor;
    }
    if (!window.ailisDesktop?.vllmRuntime?.describeLocalModelPath) {
        return vllmLocalModelDescriptor;
    }
    try {
        const descriptor = await window.ailisDesktop.vllmRuntime.describeLocalModelPath({ path: cleanPath });
        vllmLocalModelDescriptor = descriptor;
        renderLocalVllmModelStatus(descriptor);
        if (!silent) {
            setStatus(descriptor?.blockers?.length
                ? `本地模型目录不可用：${descriptor.blockers.join('；')}`
                : `本地模型目录检查通过：${descriptor.suggestedModelName || descriptor.path}`);
        }
        return descriptor;
    } catch (error) {
        if (!silent) {
            setStatus(`检查本地模型目录失败：${error.message || error}`);
        }
        return null;
    }
}

async function chooseVllmDownloadFolder() {
    if (!window.ailisDesktop?.vllmRuntime?.chooseDownloadFolder) {
        setStatus('当前桌面宿主不支持选择 vLLM 模型安装目录。');
        return;
    }
    const model = getSelectedVllmCatalogModel();
    try {
        const result = await window.ailisDesktop.vllmRuntime.chooseDownloadFolder({
            modelId: model?.id || elements.llmModel?.value?.trim() || '',
            modelSizeBytes: getSelectedVllmModelSizeBytes(model),
            defaultPath: getVllmDownloadDir() || 'F:\\models'
        });
        if (!result?.ok || result.canceled) {
            return;
        }
        vllmDownloadDirDescriptor = result;
        if (elements.vllmDownloadDir) {
            elements.vllmDownloadDir.value = result.path || '';
        }
        renderVllmDownloadDirStatus(result);
        syncSaveButton();
        setStatus(result.blockers?.length
            ? `安装路径不可用：${result.blockers.join('；')}`
            : `已选择模型安装路径：${result.path}`);
    } catch (error) {
        setStatus(`选择模型安装路径失败：${error.message || error}`);
    }
}

function getSelectedVllmDeploymentModel({ mode = 'auto' } = {}) {
    const localPath = getLocalVllmModelPath();
    if (mode === 'local' || (mode === 'auto' && localPath)) {
        if (!localPath) {
            return null;
        }
        return applyLocalVllmModelSelection(vllmLocalModelDescriptor || {
            path: localPath,
            suggestedModelName: getLocalVllmServedName(localPath),
            format: '',
            warnings: []
        });
    }
    if (mode === 'online') {
        return getSelectedVllmCatalogModel();
    }
    return getSelectedVllmCatalogModel();
}

function applySelectedVllmCatalogModel() {
    const model = getSelectedVllmCatalogModel();
    if (!model?.id) {
        setStatus('请先搜索并选择一个在线模型。已有本地模型请使用左侧“方式一”。');
        return null;
    }
    vllmLocalModelDescriptor = null;
    if (elements.vllmLocalModelPath) {
        elements.vllmLocalModelPath.value = '';
    }
    if (elements.vllmLocalServedName) {
        elements.vllmLocalServedName.value = '';
    }
    renderLocalVllmModelStatus(null);
    if (elements.llmPreset) {
        elements.llmPreset.value = 'vllm';
    }
    if (elements.llmProvider) {
        elements.llmProvider.value = 'vllm';
        lastLlmProviderValue = 'vllm';
    }
    if (elements.llmBaseUrl) {
        elements.llmBaseUrl.value = getProviderDefaultBaseUrl('vllm');
    }
    if (elements.llmModel) {
        elements.llmModel.value = model.id;
    }
    fillLlmModelPresetOptions('vllm', model.id);
    syncLlmPresetHelp('vllm');
    syncLlmSetupHelp();
    syncLlmKeyState();
    renderLlmCapabilityState();
    renderLlmHealthState(null);
    renderVllmModelCatalogStatus({
        sources: [],
        errors: []
    });
    vllmDownloadDirDescriptor = null;
    renderVllmDownloadDirStatus(null);
    if (elements.vllmModelCatalogStatus) {
        elements.vllmModelCatalogStatus.textContent =
            `已选择 ${model.id}。如果要自动安装，请先选择安装路径；AILIS 会负责检查环境、下载模型并启动本地服务。`;
    }
    syncSaveButton();
    return model;
}

function normalizeOllamaDeploymentMode(mode = '') {
    const normalized = String(mode || '').trim().toLowerCase();
    return ['installed', 'local', 'online'].includes(normalized) ? normalized : 'installed';
}

function getStoredOllamaDeploymentMode() {
    return normalizeOllamaDeploymentMode(
        currentPreferences?.ollamaDeploymentMode ||
            panelState?.preferences?.ollamaDeploymentMode ||
            ''
    );
}

function getStoredOllamaLocalModelPath() {
    return String(
        currentPreferences?.ollamaLocalModelPath ||
            panelState?.preferences?.ollamaLocalModelPath ||
            ''
    ).trim();
}

function getOllamaTargetModelId() {
    return elements.llmModel?.value?.trim() ||
        elements.ollamaInstalledModelId?.value?.trim() ||
        getProviderDefaultModel('ollama');
}

function getResolvedOllamaLocalModelPath() {
    return getOllamaLocalModelPath() || getStoredOllamaLocalModelPath();
}

function getEffectiveOllamaDeploymentMode() {
    const source = normalizeOllamaTargetSource(currentOllamaTarget.source) ||
        normalizeOllamaTargetSource(ollamaDeploymentMode) ||
        normalizeOllamaTargetSource(getStoredOllamaDeploymentMode()) ||
        'installed';
    return ollamaSourceToLegacyMode(source);
}

function getActiveOllamaLocalModelPath() {
    return getEffectiveOllamaDeploymentMode() === 'local' ? getResolvedOllamaLocalModelPath() : '';
}

function getOllamaDeploymentModeCopy(mode = ollamaDeploymentMode) {
    const effectiveMode = normalizeOllamaDeploymentMode(mode);
    const modelId = getOllamaTargetModelId();
    if (effectiveMode === 'local') {
        const localPath = getResolvedOllamaLocalModelPath();
        return localPath
            ? `将从本地文件导入：${localPath}`
            : '请选择本地 GGUF 文件或 Safetensors 模型目录。';
    }
    if (effectiveMode === 'online') {
        return modelId
            ? `将从 Ollama 官方库安装 ${modelId}。`
            : '请先搜索并选择一个 Ollama 在线模型。';
    }
    return modelId
        ? `将检查并启用本机已安装模型 ${modelId}；缺失时不会自动下载。`
        : '请输入 ollama list 里已经存在的模型名，或点击“检查本机模型”。';
}

function getOllamaDeployButtonText(mode = getEffectiveOllamaDeploymentMode()) {
    if (mode === 'local') {
        return '导入并启用本地模型';
    }
    if (mode === 'online') {
        return '下载并启用在线模型';
    }
    return '检查并启用已有模型';
}

function renderOllamaDeploymentMode() {
    const mode = getEffectiveOllamaDeploymentMode();
    ollamaDeploymentMode = mode;
    if (mode === 'local' && elements.ollamaLocalModelPath && !elements.ollamaLocalModelPath.value.trim()) {
        elements.ollamaLocalModelPath.value = getStoredOllamaLocalModelPath();
    }
    document.querySelectorAll('[data-ollama-mode]').forEach((button) => {
        const active = button.dataset.ollamaMode === mode;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (elements.ollamaInstalledModelSection) {
        elements.ollamaInstalledModelSection.hidden = mode !== 'installed';
    }
    if (elements.ollamaLocalModelSection) {
        elements.ollamaLocalModelSection.hidden = mode !== 'local';
    }
    if (elements.ollamaOnlineModelSection) {
        elements.ollamaOnlineModelSection.hidden = mode !== 'online';
    }
    const targetModel = getOllamaTargetModelId();
    if (elements.ollamaTargetModel) {
        elements.ollamaTargetModel.textContent = targetModel || '尚未选择模型';
    }
    if (elements.ollamaTargetCopy) {
        elements.ollamaTargetCopy.textContent = getOllamaDeploymentModeCopy(mode);
    }
    if (elements.ollamaRuntimeDeployBtn) {
        elements.ollamaRuntimeDeployBtn.textContent = getOllamaDeployButtonText(mode);
    }
    if (elements.ollamaInstalledModelId && !elements.ollamaInstalledModelId.value.trim()) {
        elements.ollamaInstalledModelId.value = targetModel || getProviderDefaultModel('ollama');
    }
}

function resetOllamaRuntimeViewForSelection() {
    const runtime = panelState?.ollamaRuntime || {};
    if (runtime.status === 'running') {
        return;
    }
    panelState = {
        ...(panelState || {}),
        ollamaRuntime: {
            ok: true,
            status: 'idle',
            running: false,
            modelId: getOllamaTargetModelId(),
            baseUrl: elements.llmBaseUrl?.value?.trim() || getProviderDefaultBaseUrl('ollama'),
            diagnosis: null,
            installPlan: null,
            failure: null,
            logLines: []
        }
    };
}

function setOllamaDeploymentMode(mode = 'installed', { userInitiated = false } = {}) {
    if (userInitiated) {
        ollamaDeploymentModeTouched = true;
    }
    const nextMode = normalizeOllamaDeploymentMode(mode);
    const changed = nextMode !== ollamaDeploymentMode;
    setCurrentOllamaTarget({
        ...currentOllamaTarget,
        source: normalizeOllamaTargetSource(nextMode) || 'installed'
    });
    if (changed) {
        resetOllamaRuntimeViewForSelection();
    }
    renderOllamaDeploymentMode();
    renderOllamaRuntimeStatus(panelState?.ollamaRuntime || {});
}

function syncOllamaInstalledModelFromMainModel() {
    if (!elements.ollamaInstalledModelId) {
        return;
    }
    const modelId = elements.llmModel?.value?.trim() || getProviderDefaultModel('ollama');
    if (!elements.ollamaInstalledModelId.value.trim() || ollamaDeploymentMode === 'installed') {
        elements.ollamaInstalledModelId.value = modelId;
    }
    renderOllamaDeploymentMode();
}

function renderOllamaModelSelect(select, models = [], placeholder = '尚未记录模型') {
    if (!select) {
        return;
    }
    const normalized = normalizeOllamaModelHistory(models);
    select.innerHTML = '';
    if (!normalized.length) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = placeholder;
        select.appendChild(option);
        select.disabled = true;
        return;
    }
    normalized.forEach((model) => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        select.appendChild(option);
    });
    select.disabled = false;
}

function renderOllamaModelMemoryLists() {
    const installedModels = normalizeOllamaModelHistory(currentPreferences?.ollamaInstalledModels);
    const usedModels = normalizeOllamaModelHistory(currentPreferences?.ollamaUsedModels);
    renderOllamaModelSelect(elements.ollamaInstalledModelList, installedModels, '尚未检查本机模型');
    renderOllamaModelSelect(elements.ollamaUsedModelList, usedModels, '尚未使用过 Ollama 模型');
    if (elements.ollamaInstalledModelStatus) {
        elements.ollamaInstalledModelStatus.textContent = installedModels.length
            ? `已记录 ${installedModels.length} 个本机模型。点击“检查本机模型”会重新读取 ollama list / /api/tags。`
            : '还没有本机模型记录。点击“检查本机模型”后，AILIS 会自动连接 Ollama 并读取已安装模型。';
    }
    if (elements.ollamaUsedModelStatus) {
        elements.ollamaUsedModelStatus.textContent = usedModels.length
            ? `已记录 ${usedModels.length} 个使用过的 Ollama 模型，最近使用的排在最前。`
            : 'AILIS 会记住成功启用或保存过的 Ollama 模型，重启后也能快速切回。';
    }
}

function applyOllamaModelName(modelId = '', { markUsed = false, statusText = '' } = {}) {
    const cleanModel = String(modelId || '').trim();
    if (!cleanModel) {
        return false;
    }
    if (elements.llmPreset) {
        elements.llmPreset.value = 'ollama';
    }
    if (elements.llmProvider) {
        elements.llmProvider.value = 'ollama';
        lastLlmProviderValue = 'ollama';
    }
    if (elements.llmBaseUrl) {
        elements.llmBaseUrl.value = getProviderDefaultBaseUrl('ollama');
    }
    if (elements.llmModel) {
        elements.llmModel.value = cleanModel;
    }
    if (elements.ollamaInstalledModelId) {
        elements.ollamaInstalledModelId.value = cleanModel;
    }
    fillLlmModelPresetOptions('ollama', cleanModel);
    setOllamaDeploymentMode('installed', { userInitiated: true });
    syncLlmPresetHelp('ollama');
    syncLlmSetupHelp();
    syncLlmKeyState();
    renderLlmCapabilityState();
    renderLlmHealthState(null);
    if (markUsed) {
        currentPreferences = normalizePreferences({
            ...(currentPreferences || {}),
            ollamaUsedModels: mergeOllamaModelHistory(currentPreferences?.ollamaUsedModels, [cleanModel])
        });
        renderOllamaModelMemoryLists();
    }
    syncSaveButton();
    if (statusText) {
        setStatus(statusText);
    }
    return true;
}

function applyOllamaInstalledModelId() {
    const modelId = elements.ollamaInstalledModelId?.value?.trim();
    if (!modelId) {
        setStatus('请先填写 Ollama 模型名，例如 qwen3.5:4b。');
        return null;
    }
    clearOllamaLocalModelPath({ preserveMode: true });
    applyOllamaModelName(modelId, {
        markUsed: false,
        statusText: `已选择本机 Ollama 模型名：${modelId}。这个模式只检查并启用已安装模型，不会自动下载。`
    });
    return modelId;
}

function formatOllamaCatalogModelLabel(model = {}) {
    const meta = [
        model.sizeText || '',
        model.contextWindow || '',
        model.fit?.label || '',
        model.capabilities?.length ? model.capabilities.slice(0, 3).join('/') : ''
    ].filter(Boolean);
    return `${model.id || model.displayName || 'Ollama 模型'}${meta.length ? ` · ${meta.join(' · ')}` : ''}`;
}

function renderOllamaModelCatalogSelect() {
    if (!elements.ollamaModelCatalog) {
        return;
    }
    elements.ollamaModelCatalog.innerHTML = '';
    if (!ollamaModelCatalogResults.length) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '尚未加载 Ollama 在线模型目录';
        elements.ollamaModelCatalog.appendChild(option);
        elements.ollamaModelCatalog.disabled = true;
        if (elements.ollamaModelUseBtn) {
            elements.ollamaModelUseBtn.disabled = true;
        }
        return;
    }
    ollamaModelCatalogResults.forEach((model, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = formatOllamaCatalogModelLabel(model);
        option.title = [model.description, model.fit?.detail, model.url].filter(Boolean).join('\n');
        elements.ollamaModelCatalog.appendChild(option);
    });
    elements.ollamaModelCatalog.disabled = false;
    if (elements.ollamaModelUseBtn) {
        elements.ollamaModelUseBtn.disabled = false;
    }
}

function renderOllamaModelCatalogStatus(result = null) {
    if (!elements.ollamaModelCatalogStatus) {
        return;
    }
    const currentResult = result || ollamaModelCatalogLastResult;
    if (ollamaModelCatalogInFlight) {
        elements.ollamaModelCatalogStatus.textContent = '正在从 Ollama 官方库实时搜索可安装模型...';
        return;
    }
    if (!currentResult && !ollamaModelCatalogResults.length) {
        elements.ollamaModelCatalogStatus.textContent =
            '本机没有模型时，在这里从 Ollama 官方库实时搜索；选中后点击“自动部署并启用”会安装 Ollama、启动服务并 pull 该模型。';
        return;
    }
    const sourceSummary = (currentResult?.sources || [])
        .map((source) => `${source.sourceLabel || source.source}: ${source.returned}/${source.total}`)
        .join('；');
    const errorSummary = (currentResult?.errors || [])
        .map((error) => error.message)
        .filter(Boolean)
        .join('；');
    const parts = [
        `已加载 ${ollamaModelCatalogResults.length} 个 Ollama 候选`,
        sourceSummary ? `来源：${sourceSummary}` : '',
        errorSummary ? `部分 tag 读取失败：${errorSummary}` : '',
        '选中后会写入模型名，部署时执行 ollama pull。'
    ].filter(Boolean);
    elements.ollamaModelCatalogStatus.textContent = parts.join(' ');
}

async function refreshOllamaModelCatalog() {
    if (!window.ailisDesktop?.llm?.searchOllamaModels) {
        if (elements.ollamaModelCatalogStatus) {
            elements.ollamaModelCatalogStatus.textContent = '当前桌面宿主不支持 Ollama 在线模型目录。';
        }
        return;
    }
    const requestId = ++ollamaModelCatalogRequestId;
    setOllamaDeploymentMode('online');
    ollamaModelCatalogInFlight = true;
    if (elements.ollamaModelSearchBtn) {
        elements.ollamaModelSearchBtn.disabled = true;
        elements.ollamaModelSearchBtn.textContent = '搜索中...';
    }
    renderOllamaModelCatalogStatus();
    try {
        const result = await window.ailisDesktop.llm.searchOllamaModels({
            query: elements.ollamaModelQuery?.value || '',
            limit: 40
        });
        if (requestId !== ollamaModelCatalogRequestId) {
            return;
        }
        ollamaModelCatalogLastResult = result || null;
        ollamaModelCatalogResults = Array.isArray(result?.models) ? result.models : [];
        renderOllamaModelCatalogSelect();
        renderOllamaModelCatalogStatus(result);
    } catch (error) {
        ollamaModelCatalogLastResult = {
            sources: [],
            errors: [{ message: error.message || String(error) }]
        };
        if (elements.ollamaModelCatalogStatus) {
            elements.ollamaModelCatalogStatus.textContent = `Ollama 在线模型目录加载失败：${error.message || error}`;
        }
    } finally {
        if (requestId === ollamaModelCatalogRequestId) {
            ollamaModelCatalogInFlight = false;
            if (elements.ollamaModelSearchBtn) {
                elements.ollamaModelSearchBtn.disabled = false;
                elements.ollamaModelSearchBtn.textContent = '搜索模型';
            }
            renderOllamaModelCatalogStatus();
        }
    }
}

function getSelectedOllamaCatalogModel() {
    if (elements.ollamaModelCatalog && ollamaModelCatalogResults.length) {
        return ollamaModelCatalogResults[Number(elements.ollamaModelCatalog.value)] || null;
    }
    return null;
}

function getActiveOllamaRemoteModelSizeBytes() {
    if (getEffectiveOllamaDeploymentMode() !== 'online') {
        return 0;
    }
    return Number(getSelectedOllamaCatalogModel()?.sizeBytes || 0) || 0;
}

function applySelectedOllamaCatalogModel() {
    const model = getSelectedOllamaCatalogModel();
    if (!model?.id) {
        setStatus('请先搜索并选择一个 Ollama 在线模型。');
        return null;
    }
    clearOllamaLocalModelPath({ preserveMode: true });
    if (elements.llmPreset) {
        elements.llmPreset.value = 'ollama';
    }
    if (elements.llmProvider) {
        elements.llmProvider.value = 'ollama';
        lastLlmProviderValue = 'ollama';
    }
    if (elements.llmBaseUrl) {
        elements.llmBaseUrl.value = getProviderDefaultBaseUrl('ollama');
    }
    if (elements.llmModel) {
        elements.llmModel.value = model.id;
    }
    fillLlmModelPresetOptions('ollama', model.id);
    setOllamaDeploymentMode('online');
    syncLlmPresetHelp('ollama');
    syncLlmSetupHelp();
    syncLlmKeyState();
    renderLlmCapabilityState();
    renderLlmHealthState(null);
    renderOllamaRuntimeStatus(panelState?.ollamaRuntime || {});
    syncSaveButton();
    setStatus(`已选择 Ollama 在线模型：${model.id}。点击“自动部署并启用”会执行 ollama pull。`);
    return model;
}

function getOllamaLocalModelPath() {
    return elements.ollamaLocalModelPath?.value?.trim() || '';
}

function renderOllamaLocalModelStatus(descriptor = ollamaLocalModelDescriptor) {
    if (!elements.ollamaLocalModelStatus) {
        return;
    }
    const pathValue = getOllamaLocalModelPath();
    if (!pathValue && !descriptor) {
        elements.ollamaLocalModelStatus.textContent =
            '已有 Ollama 模型可不选本地文件；选择 .gguf 文件或 HF Safetensors 目录后，AILIS 会先检查格式、空间和 Ollama 版本。';
        return;
    }
    if (!descriptor) {
        elements.ollamaLocalModelStatus.textContent = '已填写本地路径，点击“使用此模型”后会检查格式并生成模型名。';
        return;
    }
    if (descriptor.canceled) {
        elements.ollamaLocalModelStatus.textContent = '已取消选择本地模型。';
        return;
    }
    const parts = [
        descriptor.ok ? '本地模型可尝试导入' : '本地模型还不能导入',
        descriptor.path ? `路径：${descriptor.path}` : '',
        descriptor.format ? `格式：${descriptor.format}` : '',
        descriptor.modelType ? `架构：${descriptor.modelType}` : '',
        descriptor.sizeGiB ? `权重：${descriptor.sizeGiB}GB` : '',
        descriptor.suggestedModelName ? `模型名：${descriptor.suggestedModelName}` : '',
        descriptor.ollamaModelsDir ? `Ollama 仓库：${descriptor.ollamaModelsDir}` : '',
        descriptor.ollamaModelsFreeGiB ? `仓库可用：${descriptor.ollamaModelsFreeGiB}GB` : '',
        descriptor.blockers?.length ? `阻断：${descriptor.blockers.join('；')}` : '',
        descriptor.warnings?.length ? `提示：${descriptor.warnings.join('；')}` : ''
    ].filter(Boolean);
    elements.ollamaLocalModelStatus.textContent = parts.join(' | ');
}

function applyOllamaLocalModelDescriptor(descriptor = ollamaLocalModelDescriptor) {
    if (!descriptor?.ok) {
        renderOllamaLocalModelStatus(descriptor);
        return descriptor;
    }
    if (elements.ollamaLocalModelPath) {
        elements.ollamaLocalModelPath.value = descriptor.path || '';
    }
    if (elements.llmPreset) {
        elements.llmPreset.value = 'ollama';
    }
    if (elements.llmProvider) {
        elements.llmProvider.value = 'ollama';
        lastLlmProviderValue = 'ollama';
    }
    if (elements.llmBaseUrl) {
        elements.llmBaseUrl.value = getProviderDefaultBaseUrl('ollama');
    }
    if (elements.llmModel) {
        elements.llmModel.value = descriptor.suggestedModelName || elements.llmModel.value || getProviderDefaultModel('ollama');
    }
    fillLlmModelPresetOptions('ollama', elements.llmModel?.value || '');
    setCurrentOllamaTarget({
        source: 'local_import',
        modelId: elements.llmModel?.value || descriptor.suggestedModelName || getProviderDefaultModel('ollama'),
        localPath: descriptor.path || ''
    });
    setOllamaDeploymentMode('local');
    syncLlmPresetHelp('ollama');
    syncLlmSetupHelp();
    syncLlmKeyState();
    renderOllamaLocalModelStatus(descriptor);
    renderLlmCapabilityState();
    renderLlmHealthState(null);
    syncSaveButton();
    return descriptor;
}

async function describeOllamaLocalModelPath(pathValue = getOllamaLocalModelPath()) {
    const cleanPath = String(pathValue || '').trim();
    if (!cleanPath) {
        ollamaLocalModelDescriptor = null;
        renderOllamaLocalModelStatus(null);
        return null;
    }
    if (ollamaLocalModelDescriptor?.path === cleanPath) {
        return ollamaLocalModelDescriptor;
    }
    if (!window.ailisDesktop?.ollamaRuntime?.describeLocalModelPath) {
        setStatus('当前桌面宿主不支持检查 Ollama 本地模型路径。');
        return null;
    }
    const descriptor = await window.ailisDesktop.ollamaRuntime.describeLocalModelPath({ path: cleanPath });
    ollamaLocalModelDescriptor = descriptor;
    renderOllamaLocalModelStatus(descriptor);
    return descriptor;
}

async function chooseOllamaLocalModelPath() {
    if (!window.ailisDesktop?.ollamaRuntime?.chooseLocalModelPath) {
        setStatus('当前桌面宿主不支持选择 Ollama 本地模型。');
        return null;
    }
    try {
        const descriptor = await window.ailisDesktop.ollamaRuntime.chooseLocalModelPath();
        if (descriptor?.canceled) {
            renderOllamaLocalModelStatus(descriptor);
            return descriptor;
        }
        ollamaLocalModelDescriptor = descriptor;
        if (elements.ollamaLocalModelPath) {
            elements.ollamaLocalModelPath.value = descriptor?.path || '';
        }
        applyOllamaLocalModelDescriptor(descriptor);
        setStatus(descriptor?.ok
            ? `已选择 Ollama 本地模型：${descriptor.suggestedModelName || descriptor.path}`
            : `本地模型检查未通过：${descriptor?.blockers?.join('；') || '未知原因'}`);
        return descriptor;
    } catch (error) {
        setStatus(`选择 Ollama 本地模型失败：${error.message || error}`);
        return null;
    }
}

function clearOllamaLocalModelPath({ preserveMode = false } = {}) {
    ollamaLocalModelDescriptor = null;
    if (elements.ollamaLocalModelPath) {
        elements.ollamaLocalModelPath.value = '';
    }
    currentOllamaTarget = {
        ...currentOllamaTarget,
        localPath: ''
    };
    if (!preserveMode && getEffectiveOllamaDeploymentMode() === 'local') {
        setCurrentOllamaTarget({
            ...currentOllamaTarget,
            source: 'installed',
            localPath: ''
        });
    }
    renderOllamaLocalModelStatus(null);
    renderOllamaDeploymentMode();
    renderLlmHealthState(null);
    syncSaveButton();
}

function getOllamaOutcome(runtime = {}, diagnosis = null, plan = null) {
    const status = runtime?.status || 'idle';
    const service = diagnosis?.service || null;
    const cli = diagnosis?.cli || null;
    const steps = plan?.steps || [];
    const stepIds = new Set(steps.map((step) => step.id));
    const localModel = diagnosis?.localModel || null;
    const hasLocalPath = Boolean(localModel?.ok || getActiveOllamaLocalModelPath());
    const targetSource = normalizeOllamaTargetSource(diagnosis?.target?.source || currentOllamaTarget.source || ollamaDeploymentMode);
    const phaseLabels = {
        diagnosing: '诊断环境',
        preparing: '准备运行时',
        starting_service: '启动本地服务',
        pulling: '下载或续传模型',
        importing: '导入本地模型',
        verifying: '验证推理能力',
        switching_backend: '切换 GPU 后端'
    };
    const phaseLabel = phaseLabels[runtime?.phase] || '自动配置';
    if (status === 'running') {
        const runningCopy = targetSource === 'local_import'
            ? 'AILIS 会启动服务、导入本地模型，并在完成后写回模型配置。部署中会暂时挡住普通聊天，避免打断安装流程。'
            : targetSource === 'online_pull'
                ? 'AILIS 会自动安装/升级运行时、启动服务、下载模型，并在完成后写回模型配置。部署中会暂时挡住普通聊天，避免打断安装流程。'
                : 'AILIS 会启动或连接本机 Ollama 服务，确认模型已安装并可推理，然后写回模型配置。';
        return {
            tone: 'running',
            title: `Ollama 正在${phaseLabel}`,
            copy: runningCopy
        };
    }
    if (status === 'ready' || (diagnosis?.ok && service?.modelPresent)) {
        return {
            tone: 'ready',
            title: 'Ollama 已就绪',
            copy: `本地服务已经响应，模型 ${service?.model || runtime?.modelId || '当前模型'} 可以使用。`
        };
    }
    if (status === 'failed') {
        return {
            tone: 'failed',
            title: 'Ollama 自动配置失败',
            copy: runtime.failure?.message || runtime.failure?.code || '请查看下方日志里的真实失败原因。'
        };
    }
    if (status === 'cancelled') {
        return {
            tone: 'failed',
            title: 'Ollama 配置已取消',
            copy: '部署数据和日志已保留，可以换模型或重新点击“自动部署并启用”。'
        };
    }
    if (service?.ok && !service.modelPresent) {
        return {
            tone: 'running',
            title: 'Ollama 服务已启动，还缺模型',
            copy: targetSource === 'installed'
                ? `服务已经可访问，但本机还没有 ${service.model || '当前模型'}。请点击“检查本机模型”选择已安装模型，或切换到“在线搜索下载”。`
                : hasLocalPath
                ? `服务已经可访问，但还没有导入 ${service.model || '当前模型'}。点击部署后会从本地路径导入。`
                : `服务已经可访问，但本机还没有 ${service.model || '当前模型'}。点击部署后会自动下载。`
        };
    }
    if (diagnosis) {
        if (stepIds.has('installed_model_missing')) {
            const blocker = steps.find((step) => step.id === 'installed_model_missing');
            return {
                tone: 'failed',
                title: '本机没有这个 Ollama 模型',
                copy: blocker?.description || '当前选择的是已有模型模式，AILIS 不会在这个模式下自动下载。'
            };
        }
        if (stepIds.has('local_model_not_importable')) {
            const blocker = steps.find((step) => step.id === 'local_model_not_importable');
            return {
                tone: 'failed',
                title: '本地模型暂不能导入',
                copy: blocker?.description || '当前本地模型路径不能被 Ollama 直接导入。'
            };
        }
        return {
            tone: steps.length ? 'running' : 'ready',
            title: steps.length ? 'Ollama 需要配置' : 'Ollama 环境可用',
            copy: steps.length
                ? 'AILIS 已列出需要自动处理的步骤，确认后可以直接开始。'
                : `已检测到 ${cli?.command || 'Ollama'}，可以测试连接或保存设置。`
        };
    }
    return {
        tone: 'idle',
        title: '尚未诊断 Ollama',
        copy: `将检测 ${elements.llmBaseUrl?.value || getProviderDefaultBaseUrl('ollama')} 上的服务，以及模型 ${elements.llmModel?.value || getProviderDefaultModel('ollama')}。`
    };
}

function getOllamaActionItems(runtime = {}, diagnosis = null, steps = []) {
    const stepIds = new Set(steps.map((step) => step.id));
    const service = diagnosis?.service || null;
    const hasLocalPath = Boolean(diagnosis?.localModel?.ok || getActiveOllamaLocalModelPath());
    const targetSource = normalizeOllamaTargetSource(diagnosis?.target?.source || currentOllamaTarget.source || ollamaDeploymentMode);
    const actions = [];
    if (runtime?.status === 'running') {
        const phaseLabels = {
            diagnosing: '正在诊断环境',
            preparing: '正在准备运行时',
            starting_service: '正在启动 Ollama 服务',
            pulling: '正在下载或续传模型',
            importing: '正在导入本地模型',
            verifying: '正在验证推理是否可用',
            switching_backend: '正在切换 GPU 后端'
        };
        return [`${phaseLabels[runtime?.phase] || '正在自动配置'}；如果日志长时间没有变化，再点击“取消”。`];
    }
    if (runtime?.status === 'ready' || service?.modelPresent) {
        return [
            '点击“测试连接”，确认 AILIS 真的能用这个本地模型回复。',
            '如果刚刚改过模型名或地址，确认测试通过后再保存设置。'
        ];
    }
    if (stepIds.has('install_ollama')) {
        actions.push('本机还没有可用 Ollama。点击“自动部署并启用”后，AILIS 会尝试通过系统安装器安装。');
    }
    if (stepIds.has('upgrade_ollama')) {
        actions.push(diagnosis?.localModel?.ok
            ? '当前 Ollama 版本偏旧。AILIS 会先尝试升级 Ollama，再导入本地模型。'
            : '当前 Ollama 版本偏旧。AILIS 会先尝试升级 Ollama，再下载选中的在线模型。');
    }
    if (stepIds.has('start_service')) {
        actions.push('Ollama 服务还没启动。AILIS 会自动执行本地服务启动，并等待接口可访问。');
    }
    if (stepIds.has('restart_ollama_service')) {
        actions.push('升级完成后需要重启本机 Ollama 服务，这样后续导入才会使用新版运行时。');
    }
    if (stepIds.has('import_local_model')) {
        actions.push('这是本地模型路径部署：AILIS 会用 ollama create 导入，不会从网上下载模型权重。');
    }
    if (stepIds.has('local_model_warning')) {
        actions.push('本地模型存在兼容性或空间提示；如果导入失败，优先换 GGUF/量化版会更稳。');
    }
    if (stepIds.has('local_model_not_importable')) {
        const blocker = steps.find((step) => step.id === 'local_model_not_importable');
        actions.push(blocker?.description || '当前本地模型路径不能被 Ollama 直接导入。');
    }
    if (stepIds.has('installed_model_missing')) {
        const blocker = steps.find((step) => step.id === 'installed_model_missing');
        actions.push(blocker?.description || '当前模式只使用本机已安装模型。请点击“检查本机模型”选择已有模型，或切换到“在线搜索下载”。');
    }
    if (stepIds.has('pull_model')) {
        actions.push(hasLocalPath
            ? `本机还没有 ${diagnosis?.model || elements.llmModel?.value || '当前模型'}。AILIS 会从当前本地路径导入，不会联网下载模型权重。`
            : `本机还没有 ${diagnosis?.model || elements.llmModel?.value || '当前模型'}。AILIS 会自动下载，首次需要一些时间和磁盘空间。`);
    }
    if (stepIds.has('ollama_model_store_auto_select')) {
        actions.push('AILIS 会自动把 Ollama 模型仓库切到空间更大的磁盘，避免继续占满 C 盘。');
    }
    if (stepIds.has('ollama_model_store_low_space')) {
        actions.push('当前可用磁盘空间可能不够，建议先清理空间，或稍后提供一个更大的 Ollama 模型仓库目录。');
    }
    if (diagnosis?.acceleration?.cpuOnly && diagnosis?.acceleration?.gpu?.available) {
        actions.push('当前 Ollama 已把模型跑在 CPU 上。点击“自动部署并启用”后，AILIS 会先重启到 Vulkan GPU 兼容模式并验证速度，不会先要求你更新驱动。');
    }
    if (stepIds.has('ollama_gpu_driver_warning')) {
        actions.push('检测到 Ollama CUDA 后端可能不稳；优先让 AILIS 自动切换 Vulkan GPU 兼容模式。只有 CUDA/Vulkan 都失败时，才建议考虑更新驱动或换模型后端。');
    }
    if (!actions.length && service?.ok && !service.modelPresent) {
        actions.push(targetSource === 'installed'
            ? `本机缺少 ${service.model || '当前模型'}。请点击“检查本机模型”选择已有模型，或切换到“在线搜索下载”。`
            : `点击“自动部署并启用”，只处理缺失模型 ${service.model || '当前模型'}，不会重复安装 Ollama。`);
    }
    if (!actions.length) {
        actions.push('点击“诊断环境”，先检查本机是否已经安装 Ollama、服务是否启动、模型是否存在。');
        actions.push('想让 AILIS 直接处理，就点击“自动部署并启用”。');
    }
    return actions;
}

function renderOllamaRuntimeStatus(runtime = {}) {
    if (!elements.ollamaRuntimeStatus) {
        return;
    }
    const status = runtime?.status || 'idle';
    const diagnosis = runtime?.diagnosis || null;
    const service = diagnosis?.service;
    const cli = diagnosis?.cli;
    const plan = runtime?.installPlan || diagnosis?.installPlan || null;
    const steps = plan?.steps || [];
    const localModel = diagnosis?.localModel || null;
    const targetSource = normalizeOllamaTargetSource(diagnosis?.target?.source || currentOllamaTarget.source || ollamaDeploymentMode);
    const remoteModelStore = diagnosis?.remoteModelStore || null;
    const acceleration = diagnosis?.acceleration || null;
    const activeModel = acceleration?.loadedModel?.activeModel || null;
    const smokeMetrics = acceleration?.smokeMetrics || null;
    const promptTps = typeof smokeMetrics?.promptTokensPerSecond === 'number'
        ? `${smokeMetrics.promptTokensPerSecond.toFixed(1)} tok/s`
        : '';
    const genTps = typeof smokeMetrics?.evalTokensPerSecond === 'number'
        ? `${smokeMetrics.evalTokensPerSecond.toFixed(1)} tok/s`
        : '';
    const outcome = getOllamaOutcome(runtime, diagnosis, plan);
    const issueItems = steps.map((step) => `${step.title}：${step.description || 'AILIS 会自动处理'}`);
    const modelPendingLabel = targetSource === 'installed'
        ? '未安装'
        : localModel?.ok ? '待导入' : '待下载';
    const detailItems = [
        {
            label: '服务',
            value: service?.ok
                ? `已响应 ${service.baseUrl}`
                : service?.baseUrl ? `未就绪 ${service.baseUrl}${service.error ? `：${service.error}` : ''}` : ''
        },
        {
            label: '模型',
            value: service?.model
                ? (service.modelPresent ? `已安装 ${service.model}` : `${modelPendingLabel} ${service.model}`)
                : runtime?.modelId || ''
        },
        {
            label: '已安装模型',
            value: service?.models?.length
                ? `${service.models.slice(0, 6).join(', ')}${service.models.length > 6 ? '...' : ''}`
                : ''
        },
        {
            label: 'Ollama CLI',
            value: cli?.ok
                ? `${cli.command}${cli.version ? ` (${cli.version})` : ''}`
                : diagnosis ? '未找到，自动部署会尝试安装' : ''
        },
        {
            label: '自动计划',
            value: steps.length ? steps.map((step) => step.title).join('；') : ''
        },
        {
            label: '本地模型',
            value: localModel?.path
                ? `${localModel.format || localModel.sourceType} | ${localModel.path}`
                : ''
        },
        {
            label: '本地模型提示',
            value: localModel?.warnings?.length ? localModel.warnings.join('；') : ''
        },
        {
            label: '模型仓库',
            value: remoteModelStore?.path
                ? `${remoteModelStore.path}${remoteModelStore.autoSelected ? '（自动选择）' : ''}`
                : ''
        },
        {
            label: '预计下载大小',
            value: diagnosis?.remoteModelSizeBytes
                ? formatBytesCompact(diagnosis.remoteModelSizeBytes)
                : ''
        },
        {
            label: '推理模式',
            value: acceleration?.processor
                ? `${acceleration.processor}${acceleration.cpuOnly ? '（当前会很慢）' : ''}`
                : diagnosis?.gpuFallback === 'vulkan'
                ? 'Vulkan GPU 兼容模式（CUDA 后端失败后自动切换）'
                : diagnosis?.cpuFallback
                ? 'CPU 兼容模式（检测到 GPU/CUDA 推理失败后自动切换）'
                : ''
        },
        {
            label: '上下文窗口',
            value: activeModel?.context || acceleration?.context || ''
        },
        {
            label: 'GPU',
            value: acceleration?.gpu?.available
                ? `${acceleration.gpu.name || 'NVIDIA GPU'} | Driver ${acceleration.gpu.driverVersion || '未知'}${acceleration.gpu.driverTooOld ? '（CUDA 兼容提醒）' : ''}`
                : acceleration?.gpu?.error || ''
        },
        {
            label: '性能验证',
            value: promptTps || genTps
                ? [`prompt ${promptTps || '未知'}`, `生成 ${genTps || '未知'}`].join(' | ')
                : ''
        }
    ];

    elements.ollamaRuntimeStatus.innerHTML = '';
    elements.ollamaRuntimeStatus.className = 'runtime-diagnostics';
    const outcomeNode = createRuntimeElement('div', `runtime-outcome is-${outcome.tone}`);
    outcomeNode.appendChild(createRuntimeElement('div', 'runtime-outcome-title', outcome.title));
    outcomeNode.appendChild(createRuntimeElement('div', 'runtime-outcome-copy', outcome.copy));
    elements.ollamaRuntimeStatus.appendChild(outcomeNode);
    appendRuntimeSection(elements.ollamaRuntimeStatus, '下一步建议', getOllamaActionItems(runtime, diagnosis, steps), 'is-action');
    appendRuntimeSection(elements.ollamaRuntimeStatus, '待处理项', issueItems);
    appendRuntimeDetails(elements.ollamaRuntimeStatus, detailItems);

    if (elements.ollamaRuntimeLog) {
        elements.ollamaRuntimeLog.textContent = (runtime?.logLines || []).slice(-28).join('\n');
    }
    if (elements.ollamaRuntimeDeployBtn) {
        elements.ollamaRuntimeDeployBtn.disabled = status === 'running';
        elements.ollamaRuntimeDeployBtn.textContent = status === 'running'
            ? '配置中...'
            : getOllamaDeployButtonText();
    }
    if (elements.ollamaRuntimeCancelBtn) {
        elements.ollamaRuntimeCancelBtn.disabled = status !== 'running';
    }
    renderModelActivationState();
}

async function refreshOllamaRuntimeStatus({ diagnose = false, silent = false } = {}) {
    if (!window.ailisDesktop?.ollamaRuntime) {
        if (elements.ollamaRuntimeStatus) {
            elements.ollamaRuntimeStatus.textContent = '当前桌面宿主不支持 Ollama 自动配置。';
        }
        return null;
    }
    const target = getCurrentOllamaTarget();
    const effectiveMode = ollamaSourceToLegacyMode(target.source);
    ollamaDeploymentMode = effectiveMode;
    const modelId = target.modelId || elements.llmModel?.value?.trim() || getProviderDefaultModel('ollama');
    const baseUrl = elements.llmBaseUrl?.value?.trim() || getProviderDefaultBaseUrl('ollama');
    const localModelPath = target.source === 'local_import' ? target.localPath : '';
    const remoteModelSizeBytes = getActiveOllamaRemoteModelSizeBytes();
    if (!silent) {
        setStatus(diagnose ? '正在诊断 Ollama 本地运行时...' : '正在读取 Ollama 部署状态...');
    }
    try {
        const result = diagnose
            ? await window.ailisDesktop.ollamaRuntime.diagnose({
                baseUrl,
                modelId,
                target,
                localModelPath,
                remoteModelSizeBytes
            })
            : await window.ailisDesktop.ollamaRuntime.getStatus();
        const runtime = diagnose
            ? {
                ...(panelState?.ollamaRuntime || {}),
                diagnosis: result,
                installPlan: result.installPlan,
                modelId,
                baseUrl,
                status: result.ok ? 'ready' : (panelState?.ollamaRuntime?.status || 'idle')
            }
            : result;
        panelState = {
            ...(panelState || {}),
            ollamaRuntime: runtime
        };
        renderOllamaRuntimeStatus(runtime);
        if (!silent) {
            setStatus(diagnose ? 'Ollama 本地运行时诊断完成。' : 'Ollama 部署状态已更新。');
        }
        return runtime;
    } catch (error) {
        if (elements.ollamaRuntimeStatus) {
            elements.ollamaRuntimeStatus.textContent = `Ollama 诊断失败：${error.message || error}`;
        }
        if (!silent) {
            setStatus(`Ollama 诊断失败：${error.message || error}`);
        }
        return null;
    }
}

async function refreshOllamaInstalledModels({ silent = false } = {}) {
    if (!window.ailisDesktop?.ollamaRuntime?.inspectInstalledModels) {
        if (elements.ollamaInstalledModelStatus) {
            elements.ollamaInstalledModelStatus.textContent = '当前桌面宿主不支持检查本机 Ollama 模型。';
        }
        return null;
    }
    const modelId = getOllamaTargetModelId();
    const baseUrl = elements.llmBaseUrl?.value?.trim() || getProviderDefaultBaseUrl('ollama');
    const target = getCurrentOllamaTarget({ source: 'installed', modelId });
    if (elements.ollamaInstalledModelRefreshBtn) {
        elements.ollamaInstalledModelRefreshBtn.disabled = true;
        elements.ollamaInstalledModelRefreshBtn.textContent = '检查中...';
    }
    if (elements.ollamaInstalledModelStatus) {
        elements.ollamaInstalledModelStatus.textContent = '正在连接本机 Ollama，并读取已安装模型...';
    }
    try {
        const result = await window.ailisDesktop.ollamaRuntime.inspectInstalledModels({
            baseUrl,
            modelId,
            startService: true,
            readyTimeoutSec: 90
        });
        const installedModels = mergeOllamaModelHistory(
            currentPreferences?.ollamaInstalledModels,
            result?.models || []
        );
        const partial = {
            ollamaTarget: target,
            ollamaDeploymentMode: 'installed',
            ollamaInstalledModels: installedModels,
            ollamaUsedModels: normalizeOllamaModelHistory(currentPreferences?.ollamaUsedModels)
        };
        const saved = window.ailisDesktop?.savePreferences
            ? await window.ailisDesktop.savePreferences(partial)
            : null;
        currentPreferences = normalizePreferences({
            ...(currentPreferences || {}),
            ...(saved || {}),
            ...partial
        });
        currentOllamaTarget = normalizeOllamaTarget(partial.ollamaTarget);
        panelState = {
            ...(panelState || {}),
            preferences: {
                ...((panelState && panelState.preferences) || {}),
                ...partial
            },
            ollamaRuntime: {
                ...((panelState && panelState.ollamaRuntime) || {}),
                diagnosis: {
                    ...(((panelState && panelState.ollamaRuntime) || {}).diagnosis || {}),
                    service: {
                        ok: Boolean(result?.ok),
                        baseUrl,
                        model: modelId,
                        modelPresent: Boolean(result?.modelPresent),
                        models: result?.models || [],
                        error: result?.error || ''
                    },
                    cli: result?.cli || (((panelState && panelState.ollamaRuntime) || {}).diagnosis || {}).cli
                }
            }
        };
        renderOllamaModelMemoryLists();
        renderOllamaRuntimeStatus(panelState.ollamaRuntime || {});
        if (result?.models?.length && elements.ollamaInstalledModelList) {
            elements.ollamaInstalledModelList.value = result.models[0];
        }
        if (!silent) {
            setStatus(result?.ok
                ? `已检查到 ${result.models.length} 个本机 Ollama 模型。`
                : `检查本机 Ollama 模型失败：${result?.error || '服务未响应'}`);
        }
        return result;
    } catch (error) {
        if (elements.ollamaInstalledModelStatus) {
            elements.ollamaInstalledModelStatus.textContent = `检查失败：${error.message || error}`;
        }
        if (!silent) {
            setStatus(`检查本机 Ollama 模型失败：${error.message || error}`);
        }
        return null;
    } finally {
        if (elements.ollamaInstalledModelRefreshBtn) {
            elements.ollamaInstalledModelRefreshBtn.disabled = false;
            elements.ollamaInstalledModelRefreshBtn.textContent = '检查本机模型';
        }
    }
}

function scheduleOllamaRuntimePolling() {
    if (ollamaRuntimePollTimer) {
        clearTimeout(ollamaRuntimePollTimer);
    }
    ollamaRuntimePollTimer = setTimeout(async () => {
        ollamaRuntimePollTimer = null;
        const runtime = await refreshOllamaRuntimeStatus({ silent: true });
        if (runtime?.status === 'running') {
            scheduleOllamaRuntimePolling();
        } else if (runtime?.status === 'ready') {
            await persistReadyOllamaSettings(runtime);
        }
    }, 2500);
}

async function persistReadyOllamaSettings(runtime = {}) {
    const modelId = runtime.modelId || runtime.diagnosis?.model || elements.llmModel?.value?.trim() || '';
    const baseUrl = runtime.baseUrl || runtime.diagnosis?.baseUrl || getProviderDefaultBaseUrl('ollama');
    const runtimeTarget = normalizeOllamaTarget(runtime.diagnosis?.target || currentOllamaTarget, {
        modelId,
        ollamaDeploymentMode: getEffectiveOllamaDeploymentMode(),
        localModelPath: getResolvedOllamaLocalModelPath()
    });
    const effectiveMode = ollamaSourceToLegacyMode(runtimeTarget.source);
    const localModelPath = runtimeTarget.source === 'local_import' ? runtimeTarget.localPath : '';
    if (!modelId || !window.ailisDesktop?.savePreferences) {
        return;
    }
    elements.llmPreset.value = 'ollama';
    elements.llmProvider.value = 'ollama';
    elements.llmBaseUrl.value = baseUrl;
    elements.llmModel.value = modelId;
    fillLlmModelPresetOptions('ollama', modelId);
    try {
        const partial = {
            llmProvider: 'ollama',
            llmBaseUrl: baseUrl,
            llmModel: modelId,
            ollamaTarget: {
                ...runtimeTarget,
                modelId
            },
            ollamaDeploymentMode: effectiveMode,
            ollamaLocalModelPath: localModelPath,
            ollamaInstalledModels: mergeOllamaModelHistory(currentPreferences?.ollamaInstalledModels, [modelId]),
            ollamaUsedModels: mergeOllamaModelHistory(currentPreferences?.ollamaUsedModels, [modelId])
        };
        const saved = await window.ailisDesktop.savePreferences(partial);
        currentOllamaTarget = normalizeOllamaTarget(partial.ollamaTarget);
        currentPreferences = normalizePreferences({
            ...(currentPreferences || saved || {}),
            ...partial
        });
        syncSaveButton();
        setStatus(`Ollama 已部署并切换为当前模型：${modelId}`);
    } catch (error) {
        setStatus(`Ollama 已就绪，但写入模型配置失败：${error.message || error}`);
    }
}

async function deploySelectedOllamaModel() {
    if (!window.ailisDesktop?.ollamaRuntime?.deploy) {
        setStatus('当前环境不支持 Ollama 自动配置。');
        return;
    }
    let target = getCurrentOllamaTarget();
    let effectiveMode = ollamaSourceToLegacyMode(target.source);
    ollamaDeploymentMode = effectiveMode;
    if (effectiveMode === 'local' && elements.ollamaLocalModelPath && !elements.ollamaLocalModelPath.value.trim()) {
        elements.ollamaLocalModelPath.value = getStoredOllamaLocalModelPath();
        target = getCurrentOllamaTarget({ source: 'local_import' });
    }
    if (effectiveMode === 'installed') {
        if (!applyOllamaInstalledModelId()) {
            return;
        }
        target = getCurrentOllamaTarget({ source: 'installed' });
        effectiveMode = 'installed';
    }
    const modelId = target.modelId || elements.llmModel?.value?.trim() || getProviderDefaultModel('ollama');
    const baseUrl = elements.llmBaseUrl?.value?.trim() || getProviderDefaultBaseUrl('ollama');
    const localModelPath = target.source === 'local_import' ? target.localPath : '';
    const remoteModelSizeBytes = getActiveOllamaRemoteModelSizeBytes();
    if (effectiveMode === 'local' && !localModelPath) {
        setStatus('请先在“本地文件导入”里选择 .gguf 文件或 Safetensors 模型目录。');
        return;
    }
    if (effectiveMode === 'online' && !modelId) {
        setStatus('请先在“在线搜索下载”里搜索并使用一个 Ollama 模型。');
        return;
    }
    if (localModelPath) {
        const descriptor = await describeOllamaLocalModelPath(localModelPath);
        if (descriptor && !descriptor.ok) {
            setStatus(`本地模型检查未通过：${descriptor.blockers?.join('；') || '未知原因'}`);
            return;
        }
    }
    const diagnosisRuntime = await refreshOllamaRuntimeStatus({ diagnose: true, silent: true });
    const steps = diagnosisRuntime?.installPlan?.steps || diagnosisRuntime?.diagnosis?.installPlan?.steps || [];
    const blockingSteps = diagnosisRuntime?.installPlan?.blockingSteps ||
        diagnosisRuntime?.diagnosis?.installPlan?.blockingSteps ||
        steps.filter((step) => step.severity === 'blocking');
    if (blockingSteps.length) {
        setStatus(`Ollama 不能继续：${blockingSteps.map((step) => step.description || step.title).join('；')}`);
        return;
    }
    if (steps.length) {
        const confirmed = window.confirm(
            `AILIS 将自动配置 Ollama 并准备模型 ${modelId}。\n\n` +
            `可能包含：${steps.map((step) => step.title).join('；')}。\n\n` +
            (localModelPath
                ? '本地模型导入会写入 Ollama 模型仓库，可能占用较多磁盘空间。继续吗？'
                : effectiveMode === 'online'
                    ? '这会从 Ollama 官方库下载选中的模型。继续吗？'
                    : '这只会检查并启用本机已有模型；如果模型缺失，请切换到“在线搜索下载”。继续吗？')
        );
        if (!confirmed) {
            return;
        }
    }
    setStatus(`正在自动配置 Ollama：${modelId}`);
    try {
        const runtime = await window.ailisDesktop.ollamaRuntime.deploy({
            modelId,
            baseUrl,
            target,
            localModelPath,
            remoteModelSizeBytes,
            readyTimeoutSec: 1800
        });
        panelState = {
            ...(panelState || {}),
            ollamaRuntime: runtime
        };
        renderOllamaRuntimeStatus(runtime);
        if (runtime.status === 'running') {
            scheduleOllamaRuntimePolling();
        } else if (runtime.status === 'ready') {
            await persistReadyOllamaSettings(runtime);
        } else if (!runtime.ok) {
            setStatus(`Ollama 自动配置未完成：${runtime.failure?.message || runtime.error || runtime.status}`);
        }
    } catch (error) {
        setStatus(`Ollama 自动配置失败：${error.message || error}`);
    }
}

async function cancelOllamaDeployment() {
    if (!window.ailisDesktop?.ollamaRuntime?.cancel) {
        return;
    }
    const runtime = await window.ailisDesktop.ollamaRuntime.cancel();
    panelState = {
        ...(panelState || {}),
        ollamaRuntime: runtime
    };
    renderOllamaRuntimeStatus(runtime);
    setStatus('已请求取消 Ollama 自动配置。');
}

function createRuntimeElement(tag, className = '', text = '') {
    const node = document.createElement(tag);
    if (className) {
        node.className = className;
    }
    if (text) {
        node.textContent = text;
    }
    return node;
}

function appendRuntimeSection(parent, title, items = [], className = '') {
    const values = items
        .map((item) => String(item || '').trim())
        .filter(Boolean);
    if (!values.length) {
        return;
    }
    const section = createRuntimeElement('div', 'runtime-section');
    section.appendChild(createRuntimeElement('div', 'runtime-section-title', title));
    const list = createRuntimeElement('ul', `runtime-list ${className}`.trim());
    values.forEach((item) => {
        list.appendChild(createRuntimeElement('li', '', item));
    });
    section.appendChild(list);
    parent.appendChild(section);
}

function appendRuntimeDetails(parent, details = []) {
    const values = details.filter((item) => item && String(item.value || '').trim());
    if (!values.length) {
        return;
    }
    const section = createRuntimeElement('div', 'runtime-section');
    section.appendChild(createRuntimeElement('div', 'runtime-section-title', '环境细节'));
    const grid = createRuntimeElement('div', 'runtime-detail-grid');
    values.forEach(({ label, value }) => {
        const cell = createRuntimeElement('div', 'runtime-detail');
        cell.appendChild(createRuntimeElement('div', 'runtime-detail-label', label));
        cell.appendChild(createRuntimeElement('div', 'runtime-detail-value', value));
        grid.appendChild(cell);
    });
    section.appendChild(grid);
    parent.appendChild(section);
}

function getVllmOutcome(runtime = {}, diagnosis = null, plan = null) {
    const status = runtime?.status || 'idle';
    const firstBlocker = (plan?.blockingSteps || [])[0];
    const stepIds = new Set((plan?.steps || []).map((step) => step.id));
    if (status === 'running') {
        return {
            tone: 'running',
            title: 'vLLM 正在自动部署',
            copy: 'AILIS 正在配置环境、下载或启动服务。完成后会自动写回模型配置。'
        };
    }
    if (status === 'ready') {
        return {
            tone: 'ready',
            title: 'vLLM 已就绪',
            copy: '本地服务已经响应，可以测试连接并开始使用。'
        };
    }
    if (status === 'failed' && runtime.failure?.code === 'preflight_blocked') {
        if (stepIds.has('windows_native_vllm_service_required')) {
            return {
                tone: 'blocked',
                title: '高级连接模式未就绪',
                copy: firstBlocker?.description || '当前选择的是连接已有服务模式，但本机服务尚未响应。普通用户建议改用 AILIS 自动部署。'
            };
        }
        return {
            tone: 'blocked',
            title: '当前模型不能安全自动部署',
            copy: firstBlocker?.description || runtime.failure?.message || '部署前检查发现阻断项，AILIS 已停止安装，避免把环境装坏。'
        };
    }
    if (status === 'failed') {
        return {
            tone: 'failed',
            title: 'vLLM 部署失败',
            copy: runtime.failure?.message || runtime.failure?.code || '请查看下方日志中的真实失败原因。'
        };
    }
    if (status === 'cancelled') {
        return {
            tone: 'failed',
            title: 'vLLM 部署已取消',
            copy: '部署数据和日志已保留，可以从当前状态继续排查。'
        };
    }
    if (diagnosis && plan?.ok === false) {
        if (stepIds.has('windows_native_vllm_service_required')) {
            return {
                tone: 'blocked',
                title: '高级连接模式未就绪',
                copy: firstBlocker?.description || '当前选择的是连接已有服务模式，但本机服务尚未响应。普通用户建议改用 AILIS 自动部署。'
            };
        }
        return {
            tone: 'blocked',
            title: '部署前检查未通过',
            copy: firstBlocker?.description || '存在需要先处理的系统或硬件条件。'
        };
    }
    if (diagnosis) {
        return {
            tone: diagnosis.ok ? 'ready' : 'running',
            title: diagnosis.ok ? 'vLLM 环境基本可用' : 'vLLM 还需要配置',
            copy: diagnosis.ok ? '可以继续测试连接或启动服务。' : 'AILIS 已列出需要处理的步骤。'
        };
    }
    return {
        tone: 'idle',
        title: '尚未诊断 vLLM',
        copy: '点击“诊断环境”，AILIS 会先检查系统、驱动、Python、runtime、模型和显存，再决定是否可以部署。'
    };
}

function getVllmActionItems(runtime = {}, diagnosis = null, steps = []) {
    const stepIds = new Set(steps.map((step) => step.id));
    const actions = [];
    if (runtime?.status === 'running') {
        return ['等待部署完成；如果长时间没有新日志，再点击“取消部署”。'];
    }
    if (runtime?.status === 'ready' || diagnosis?.service?.ok) {
        return [
            '点击“测试连接”，确认 AILIS 真的能用这个本地模型回复。',
            '如果测试通过，保存设置后聊天和 Agent 会使用当前 vLLM 模型。'
        ];
    }
    if (stepIds.has('repair_wsl_shell')) {
        actions.push('AILIS 检测到托管运行环境已经安装，但系统层无法启动它。先重启电脑后再点“诊断环境/部署并启用”。');
        actions.push('如果重启后仍失败，AILIS 会保留日志；这属于系统兼容环境损坏，不是模型文件或 Python/vLLM 配置问题。');
    }
    if (stepIds.has('windows_native_vllm_service_required')) {
        actions.push('当前是高级“连接已有服务”模式，但服务未响应。普通用户应点击“部署并启用”，让 AILIS 自动准备环境和启动服务。');
        actions.push('如果你已经有外部 vLLM 服务，再把 API Base 和模型名改成服务实际返回值，然后点“测试连接”。');
    }
    if (stepIds.has('windows_native_vllm_model_mismatch')) {
        actions.push('当前端口已有 vLLM 服务，但模型名不匹配。请把 AILIS 模型名改成 /v1/models 返回的模型，或用选中的本地模型重启服务。');
    }
    if (stepIds.has('install_wsl') || stepIds.has('install_wsl_distro')) {
        actions.push('点击“部署并启用”后，AILIS 会自动准备 Windows 上承载 vLLM 的托管运行环境；首次启用系统组件可能需要重启。');
    }
    if (stepIds.has('select_download_dir')) {
        actions.push('在线安装模型前，先在“方式二”选择安装路径；AILIS 会检查目录是否存在、上级目录是否有效、剩余空间是否够。');
    }
    if (stepIds.has('download_dir_not_ready')) {
        actions.push('当前模型安装路径不可用。请换一个有效目录，或选择更小模型/更大磁盘后再部署。');
    }
    if (stepIds.has('download_dir_warning')) {
        actions.push('安装路径基本可用，但有提示需要确认；如果目录不存在，部署时会尝试自动创建。');
    }
    if (stepIds.has('install_python')) {
        actions.push('部署机会先检查 Python 3.10+、venv 和 pip；缺失时会在当前系统运行时内自动配置。');
    }
    if (stepIds.has('install_vllm')) {
        actions.push('vLLM runtime 不完整时，AILIS 会创建隔离环境并安装/升级依赖，不会把依赖散装到项目目录外。');
    }
    if (stepIds.has('download_model')) {
        actions.push('这是在线安装路径：部署时会把所选模型下载到你选择的安装目录，然后再启动 vLLM 服务。');
    }
    if (stepIds.has('gpu_driver_update')) {
        actions.push('想继续用这个 Qwen3-4B：先更新 NVIDIA 驱动，然后回到这里点“诊断环境”。');
        actions.push('不想动驱动：优先换 GGUF/量化模型走 Ollama，6GB 显存会更稳。');
        actions.push('继续用 vLLM：选择 1.5B/3B 或明确量化的小模型，再点“部署并启用”。');
    }
    if (stepIds.has('runtime_upgrade_caution')) {
        actions.push('可以点击“部署并启用”，AILIS 会在隔离 runtime 中自动升级 vLLM/Transformers，并先验证能否读取这个本地模型。');
        actions.push('如果升级后的 CUDA/PyTorch 与驱动不兼容，AILIS 会保留旧 runtime 并返回真实失败原因。');
    }
    if (stepIds.has('gpu_memory_fit')) {
        actions.push('这个模型权重大于显存，AILIS 会尝试降低上下文并启用 CPU offload，但速度会变慢。');
    }
    if (stepIds.has('disk_space_low')) {
        actions.push('先释放一些磁盘空间，或后续把模型缓存目录放到更大的盘。');
    }
    if (stepIds.has('start_vllm')) {
        actions.push('环境和模型检查通过后，AILIS 会启动 OpenAI-compatible vLLM 服务，并等待 /v1/models 就绪。');
    }
    if (!actions.length && steps.length) {
        actions.push('确认下面的待处理步骤后，再点击“部署并启用”。');
    }
    if (!actions.length) {
        actions.push('点击“诊断环境”，让 AILIS 先做完整部署前检查。');
    }
    return actions;
}

function isSameVllmDeploymentTarget(runtime = {}, model = null) {
    if (!model) {
        return false;
    }
    const runtimeModel = String(runtime.modelId || '').trim();
    const runtimeServed = String(runtime.servedModelId || runtime.diagnosis?.targetModel || '').trim();
    const modelId = String(model.id || '').trim();
    const servedModelName = String(model.servedModelName || model.id || '').trim();
    return Boolean(
        (runtimeModel && (runtimeModel === modelId || runtimeModel === servedModelName)) ||
        (runtimeServed && (runtimeServed === servedModelName || runtimeServed === modelId))
    );
}

function renderVllmRuntimeStatus(runtime = {}) {
    if (!elements.vllmRuntimeStatus) {
        return;
    }
    const status = runtime?.status || 'idle';
    const diagnosis = runtime?.diagnosis || null;
    const plan = runtime?.installPlan || diagnosis?.installPlan || null;
    const steps = plan?.steps || [];
    const service = diagnosis?.service;
    const runtimeInfo = diagnosis?.runtime;
    const wsl = diagnosis?.wsl;
    const downloadTarget = diagnosis?.downloadTarget;
    const runtimeMode = diagnosis?.runtimeMode || runtime?.runtimeMode || 'native';
    const windowsNativeMode = runtimeMode === 'native';
    const managedWindowsMode = runtimeMode === 'wsl' && isWindowsHost();
    const outcome = getVllmOutcome(runtime, diagnosis, plan);
    const blockerItems = (plan?.blockingSteps || [])
        .map((step) => `${step.title}：${step.description || '需要先处理'}`);
    const issueItems = steps
        .filter((step) => step.severity === 'warning' || step.severity === 'required')
        .map((step) => `${step.title}：${step.description || 'AILIS 会自动处理'}`);
    const detailItems = [
        {
            label: '运行模式',
            value: runtimeMode === 'wsl'
                ? (managedWindowsMode ? 'AILIS 托管部署环境' : 'Linux/WSL 兼容模式')
                : runtimeMode === 'native' ? '当前系统原生模式' : ''
        },
        {
            label: '服务',
            value: service?.ok
                ? `已响应 ${service.baseUrl}${service.modelIds?.length ? ` (${service.modelIds.join(', ')})` : ''}`
                : service?.baseUrl ? `未就绪 ${service.baseUrl}` : ''
        },
        {
            label: managedWindowsMode ? '托管环境' : 'WSL',
            value: wsl?.required ? (wsl.available ? (wsl.distros?.join(', ') || '已安装') : '待自动准备') : '未使用'
        },
        {
            label: 'Python',
            value: windowsNativeMode ? '' : runtimeInfo?.available ? (runtimeInfo.pythonOk ? (runtimeInfo.pythonVersion || 'OK') : '未就绪') : ''
        },
        {
            label: 'vLLM Runtime',
            value: windowsNativeMode
                ? '外部服务模式，AILIS 不安装本地 vLLM runtime'
                : runtimeInfo?.available
                ? `${runtimeInfo.vllmInstalled || runtimeInfo.reusableVenvDir ? '可复用' : '未安装'}${runtimeInfo.reusableVenvDir ? ` (${runtimeInfo.reusableVenvDir})` : ''}`
                : runtimeInfo?.shellFailure?.message || runtimeInfo?.error || ''
        },
        {
            label: '模型兼容性',
            value: runtimeInfo?.modelCompatibility?.ok === false
                ? runtimeInfo.modelCompatibility.reason
                : runtimeInfo?.modelCompatibility ? '兼容' : ''
        },
        {
            label: '安装路径',
            value: downloadTarget?.path
                ? `${downloadTarget.path}${downloadTarget.freeGiB ? `，可用 ${downloadTarget.freeGiB}GB` : ''}${downloadTarget.requiredGiB ? `，预计需要 ${downloadTarget.requiredGiB}GB` : ''}`
                : ''
        },
        {
            label: '显存评估',
            value: windowsNativeMode ? '' : diagnosis?.modelHardwareFit?.severity ? diagnosis.modelHardwareFit.reason : ''
        },
        {
            label: '自动策略',
            value: windowsNativeMode ? '' : diagnosis?.launchProfile?.adjusted ? diagnosis.launchProfile.notes?.join('，') : ''
        },
        {
            label: 'GPU',
            value: runtimeInfo?.gpuInfo || ''
        }
    ];

    elements.vllmRuntimeStatus.innerHTML = '';
    elements.vllmRuntimeStatus.className = 'runtime-diagnostics';
    const outcomeNode = createRuntimeElement('div', `runtime-outcome is-${outcome.tone}`);
    outcomeNode.appendChild(createRuntimeElement('div', 'runtime-outcome-title', outcome.title));
    outcomeNode.appendChild(createRuntimeElement('div', 'runtime-outcome-copy', outcome.copy));
    elements.vllmRuntimeStatus.appendChild(outcomeNode);
    appendRuntimeSection(elements.vllmRuntimeStatus, '下一步建议', getVllmActionItems(runtime, diagnosis, steps), 'is-action');
    appendRuntimeSection(elements.vllmRuntimeStatus, '阻断项', blockerItems);
    appendRuntimeSection(elements.vllmRuntimeStatus, '待处理项', issueItems);
    appendRuntimeDetails(elements.vllmRuntimeStatus, detailItems);

    if (elements.vllmRuntimeLog) {
        elements.vllmRuntimeLog.textContent = (runtime?.logLines || []).slice(-28).join('\n');
    }
    const selectedModel = getSelectedVllmDeploymentModel();
    const selectedDeploymentId = selectedModel?.servedModelName || selectedModel?.id || elements.llmModel?.value?.trim() || '';
    const diagnosedModelId = diagnosis?.targetModel || runtime?.servedModelId || runtime?.modelId || '';
    const sameDiagnosedModel = !selectedDeploymentId ||
        !diagnosedModelId ||
        selectedDeploymentId === diagnosedModelId ||
        selectedModel?.id === diagnosis?.modelId;
    const blocked = sameDiagnosedModel && (plan?.ok === false || runtime.failure?.code === 'preflight_blocked');
    const stepIds = new Set(steps.map((step) => step.id));
    const waitingForWindowsService = stepIds.has('windows_native_vllm_service_required');
    const windowsModelMismatch = stepIds.has('windows_native_vllm_model_mismatch');
    if (elements.vllmRuntimeDeployBtn) {
        elements.vllmRuntimeDeployBtn.disabled = status === 'running' || blocked;
        elements.vllmRuntimeDeployBtn.textContent = status === 'running'
            ? '部署中...'
            : waitingForWindowsService ? '连接已有服务'
                : windowsModelMismatch ? '模型名不匹配'
                    : windowsNativeMode ? '连接并启用'
                        : blocked ? '先处理阻断项' : '部署并启用';
    }
    if (elements.vllmOnlineModelDeployBtn) {
        elements.vllmOnlineModelDeployBtn.disabled = status === 'running' || blocked;
        elements.vllmOnlineModelDeployBtn.textContent = status === 'running'
            ? '部署中...'
            : waitingForWindowsService ? '连接已有服务'
                : blocked ? '先处理阻断项' : '下载、部署并启用';
    }
    if (elements.vllmRuntimeCancelBtn) {
        elements.vllmRuntimeCancelBtn.disabled = status !== 'running';
    }
    renderModelActivationState();
}

async function refreshVllmRuntimeStatus({ diagnose = false, silent = false, targetModel = null, mode = 'auto' } = {}) {
    if (!window.ailisDesktop?.vllmRuntime) {
        return null;
    }
    if (!silent) {
        setStatus(diagnose ? '正在诊断 vLLM 本地运行时...' : '正在读取 vLLM 部署状态...');
    }
    try {
        const model = targetModel || getSelectedVllmDeploymentModel({ mode });
        const runtimePayload = buildVllmRuntimePayload(model);
        const result = diagnose
            ? await window.ailisDesktop.vllmRuntime.diagnose(runtimePayload)
            : await window.ailisDesktop.vllmRuntime.getStatus();
        const previousRuntime = panelState?.vllmRuntime || {};
        const sameTarget = isSameVllmDeploymentTarget(previousRuntime, model);
        const shouldKeepRunning = sameTarget && previousRuntime.status === 'running';
        const runtime = diagnose
            ? {
                ...(sameTarget ? previousRuntime : {}),
                diagnosis: result,
                installPlan: result.installPlan,
                baseUrl: result.service?.baseUrl || getProviderDefaultBaseUrl('vllm'),
                runtimeMode: result.runtimeMode || 'native',
                source: result.source || model?.source || '',
                modelId: model?.id || result.modelId || '',
                servedModelId: model?.servedModelName || result.targetModel || '',
                failure: shouldKeepRunning ? previousRuntime.failure : null,
                logLines: sameTarget ? (previousRuntime.logLines || []) : [],
                status: result.service?.ok ? 'ready' : shouldKeepRunning ? 'running' : 'idle'
            }
            : result;
        panelState = {
            ...(panelState || {}),
            vllmRuntime: runtime
        };
        renderVllmRuntimeStatus(runtime);
        if (!silent) {
            setStatus(diagnose ? 'vLLM 本地运行时诊断完成。' : 'vLLM 部署状态已更新。');
        }
        return runtime;
    } catch (error) {
        if (elements.vllmRuntimeStatus) {
            elements.vllmRuntimeStatus.textContent = `vLLM 诊断失败：${error.message || error}`;
        }
        if (!silent) {
            setStatus(`vLLM 诊断失败：${error.message || error}`);
        }
        return null;
    }
}

function scheduleVllmRuntimePolling() {
    if (vllmRuntimePollTimer) {
        clearTimeout(vllmRuntimePollTimer);
    }
    vllmRuntimePollTimer = setTimeout(async () => {
        vllmRuntimePollTimer = null;
        const runtime = await refreshVllmRuntimeStatus({ silent: true });
        if (runtime?.status === 'running') {
            scheduleVllmRuntimePolling();
        } else if (runtime?.status === 'ready') {
            await persistReadyVllmSettings(runtime);
        }
    }, 2500);
}

async function persistReadyVllmSettings(runtime = {}) {
    const modelId = runtime.servedModelId || runtime.modelId || elements.llmModel?.value?.trim() || '';
    const baseUrl = runtime.baseUrl || getProviderDefaultBaseUrl('vllm');
    if (!modelId || !window.ailisDesktop?.savePreferences) {
        return;
    }
    elements.llmPreset.value = 'vllm';
    elements.llmProvider.value = 'vllm';
    elements.llmBaseUrl.value = baseUrl;
    elements.llmModel.value = modelId;
    fillLlmModelPresetOptions('vllm', modelId);
    try {
        const partial = {
            llmProvider: 'vllm',
            llmBaseUrl: baseUrl,
            llmModel: modelId
        };
        const saved = await window.ailisDesktop.savePreferences(partial);
        currentPreferences = normalizePreferences({
            ...(currentPreferences || saved || {}),
            ...partial
        });
        syncSaveButton();
        setStatus(`vLLM 已部署并切换为当前模型：${modelId}`);
    } catch (error) {
        setStatus(`vLLM 已就绪，但写入模型配置失败：${error.message || error}`);
    }
}

async function deploySelectedVllmModel({ mode = 'auto' } = {}) {
    if (!window.ailisDesktop?.vllmRuntime?.deploy) {
        setStatus('当前环境不支持 vLLM 自动部署。');
        return;
    }
    let model = getSelectedVllmDeploymentModel({ mode });
    const modelId = model?.id || elements.llmModel?.value?.trim();
    if (!modelId) {
        setStatus(mode === 'online'
            ? '请先搜索并选择一个在线模型；已有本地模型请用左侧“部署并启用”。'
            : '请先选择一个本地模型文件夹。');
        return;
    }
    if (model?.source === 'local') {
        const descriptor = await describeLocalVllmModelPath(model.localPath || model.id, { silent: true });
        if (descriptor?.blockers?.length) {
            setStatus(`本地模型目录检查未通过：${descriptor.blockers.join('；')}`);
            renderLocalVllmModelStatus(descriptor);
            return;
        }
        if (descriptor?.path) {
            model = applyLocalVllmModelSelection(descriptor) || model;
        }
    } else if (!getVllmDownloadDir()) {
        renderVllmDownloadDirStatus(null);
        setStatus('请先在“方式二”选择模型安装路径；AILIS 需要先检查目录和剩余空间。');
        return;
    }
    const servedModelName = model?.servedModelName || modelId;
    const runtimePayload = buildVllmRuntimePayload(model);
    const diagnosisRuntime = await refreshVllmRuntimeStatus({
        diagnose: true,
        silent: true,
        targetModel: model,
        mode
    });
    const steps = diagnosisRuntime?.installPlan?.steps || diagnosisRuntime?.diagnosis?.installPlan?.steps || [];
    const stepIds = new Set(steps.map((step) => step.id));
    const downloadTarget = diagnosisRuntime?.diagnosis?.downloadTarget || null;
    if (downloadTarget) {
        vllmDownloadDirDescriptor = downloadTarget;
        renderVllmDownloadDirStatus(downloadTarget);
    }
    if (stepIds.has('select_download_dir')) {
        setStatus('请先选择模型安装路径。');
        return;
    }
    if (stepIds.has('download_dir_not_ready')) {
        const blocker = steps.find((step) => step.id === 'download_dir_not_ready');
        setStatus(`模型安装路径不可用：${blocker?.description || '请换一个有效目录。'}`);
        return;
    }
    if (stepIds.has('windows_native_vllm_service_required')) {
        setStatus('当前是高级连接已有服务模式，但服务未响应。普通用户请使用 AILIS 自动部署并启用。');
        return;
    }
    if (stepIds.has('windows_native_vllm_model_mismatch')) {
        setStatus('当前 vLLM 服务模型名不匹配。请把 AILIS 模型名改成 /v1/models 返回的 id，或用所选模型重启服务。');
        return;
    }
    if (steps.length) {
        const confirmed = window.confirm(
            `AILIS 将自动配置 vLLM 环境并部署 ${servedModelName}。\n\n` +
            `可能包含：${steps.map((step) => step.title).join('；')}。\n\n` +
            `${steps.map((step) => `- ${step.title}：${step.description || '自动处理'}`).join('\n')}\n\n` +
            '这可能需要较长时间、较大下载量和 GPU 环境。继续吗？'
        );
        if (!confirmed) {
            return;
        }
    }
    setStatus(`正在自动配置并部署 vLLM：${servedModelName}`);
    try {
        const runtime = await window.ailisDesktop.vllmRuntime.deploy({
            ...runtimePayload,
            pipIndexUrl: 'https://pypi.tuna.tsinghua.edu.cn/simple',
            installWsl: true,
            readyTimeoutSec: 1200
        });
        panelState = {
            ...(panelState || {}),
            vllmRuntime: runtime
        };
        renderVllmRuntimeStatus(runtime);
        if (runtime.status === 'running') {
            scheduleVllmRuntimePolling();
        } else if (runtime.status === 'ready') {
            await persistReadyVllmSettings(runtime);
        } else if (!runtime.ok) {
            setStatus(`vLLM 自动部署未完成：${runtime.failure?.message || runtime.error || runtime.status}`);
        }
    } catch (error) {
        setStatus(`vLLM 自动部署失败：${error.message || error}`);
    }
}

async function cancelVllmDeployment() {
    if (!window.ailisDesktop?.vllmRuntime?.cancel) {
        return;
    }
    const runtime = await window.ailisDesktop.vllmRuntime.cancel();
    panelState = {
        ...(panelState || {}),
        vllmRuntime: runtime
    };
    renderVllmRuntimeStatus(runtime);
    setStatus('已请求取消 vLLM 自动部署。');
}

function syncLlmPresetSelectionFromFields({ maybeRefreshCatalog = false } = {}) {
    if (!elements.llmPreset || !elements.llmModelPreset) {
        return;
    }
    const match = findMatchingLlmPreset({
        provider: elements.llmProvider.value,
        baseUrl: elements.llmBaseUrl.value,
        model: elements.llmModel.value
    });
    elements.llmPreset.value = match.preset.id;
    fillLlmModelPresetOptions(match.preset.id, match.model);
    syncLlmPresetHelp(match.preset.id);
    syncLlmSetupHelp();
    syncVllmModelCatalogPanel({ maybeRefresh: maybeRefreshCatalog });
}

function applyLlmPreset(presetId, { preserveModel = false } = {}) {
    const preset = getLlmPreset(presetId);
    if (!preset || preset.id === LLM_PRESET_CUSTOM_ID) {
        fillLlmModelPresetOptions(LLM_PRESET_CUSTOM_ID, LLM_PRESET_CUSTOM_ID);
        syncLlmPresetHelp(LLM_PRESET_CUSTOM_ID);
        return;
    }

    elements.llmProvider.value = preset.provider;
    elements.llmBaseUrl.value = preset.baseUrl;
    if (!preserveModel || !elements.llmModel.value.trim()) {
        elements.llmModel.value = getPresetDefaultModel(preset);
    }
    lastLlmProviderValue = preset.provider;
    fillLlmModelPresetOptions(preset.id, elements.llmModel.value);
    syncLlmPresetHelp(preset.id);
    syncLlmSetupHelp();
    syncVllmModelCatalogPanel();
    syncLlmKeyState();
    renderLlmCapabilityState();
    renderLlmHealthState(null);
}

function applyLlmProviderDefaultsIfNeeded(previousProvider, nextProvider) {
    if (!previousProvider || previousProvider === nextProvider) {
        return;
    }
    const previousBaseUrl = getProviderDefaultBaseUrl(previousProvider);
    const previousModel = getProviderDefaultModel(previousProvider);
    if (!elements.llmBaseUrl.value.trim() || elements.llmBaseUrl.value.trim() === previousBaseUrl) {
        elements.llmBaseUrl.value = getProviderDefaultBaseUrl(nextProvider);
    }
    if (!elements.llmModel.value.trim() || elements.llmModel.value.trim() === previousModel) {
        elements.llmModel.value = getProviderDefaultModel(nextProvider);
    }
}

async function runLlmHealthCheck() {
    if (!window.ailisDesktop?.llm?.healthCheck) {
        const result = {
            ok: false,
            checks: {},
            summary: '当前桌面宿主不支持模型检测。'
        };
        renderLlmHealthState(result);
        return result;
    }
    elements.llmHealthCheckBtn.disabled = true;
    elements.llmHealthState.textContent = isLocalLlmProvider()
        ? '正在测试本地模型连接和 JSON 输出能力...'
        : '正在测试模型连接、JSON、Tool 和 Vision 能力...';
    try {
        const settings = {
            provider: elements.llmProvider.value,
            baseUrl: elements.llmBaseUrl.value,
            model: elements.llmModel.value,
            apiKey: elements.llmApiKey.value.trim(),
            apiKeySelectedId: elements.llmApiKeySelect?.value || '',
            temperature: Number(elements.llmTemperature.value),
            timeoutMs: Number(elements.llmTimeout.value)
        };
        const result = await window.ailisDesktop.llm.healthCheck({
            settings,
            includeToolCall: true,
            includeVision: true,
            timeoutMs: Math.min(Number(elements.llmTimeout.value) || 25000, 30000)
        });
        renderLlmHealthState(result);
        return result;
    } catch (error) {
        const result = {
            ok: false,
            checks: {},
            summary: `模型检测失败：${error.message || error}`
        };
        renderLlmHealthState(result);
        return result;
    } finally {
        elements.llmHealthCheckBtn.disabled = false;
    }
}

async function runOllamaRuntimeCheck() {
    if (elements.ollamaRuntimeCheckBtn) {
        elements.ollamaRuntimeCheckBtn.disabled = true;
        elements.ollamaRuntimeCheckBtn.textContent = '检测中...';
    }
    try {
        await refreshOllamaRuntimeStatus({ diagnose: true });
    } finally {
        if (elements.ollamaRuntimeCheckBtn) {
            elements.ollamaRuntimeCheckBtn.disabled = false;
            elements.ollamaRuntimeCheckBtn.textContent = '诊断环境';
        }
    }
}

function syncElevenLabsKeyState() {
    if (pendingClearElevenLabsKey) {
        elements.elevenLabsKeyState.textContent = '保存后会清除已保存 Key。';
        return;
    }

    if (currentPreferences?.elevenLabsApiKeyConfigured) {
        elements.elevenLabsKeyState.textContent = elements.elevenLabsApiKey.value.trim()
            ? '保存后会用新 Key 覆盖已保存 Key。'
            : 'Key 状态：已保存。留空会继续沿用当前 Key。';
        return;
    }

    elements.elevenLabsKeyState.textContent = elements.elevenLabsApiKey.value.trim()
        ? '保存后会写入新的 Key。'
        : 'Key 状态：未配置。';
}

function syncEmailSecretStates() {
    for (const [providerId, entry] of Object.entries(emailElements)) {
        const profile = currentPreferences?.emailProfiles?.[providerId] || {};
        if (!entry.state) {
            continue;
        }
        if (pendingClearEmailSecrets[providerId]) {
            entry.state.textContent = '保存后会清除已保存密钥。';
        } else if (entry.secret?.value?.trim()) {
            entry.state.textContent = profile.secretConfigured
                ? '保存后会覆盖已保存密钥。'
                : '保存后会写入新的密钥。';
        } else if (profile.secretConfigured) {
            entry.state.textContent = '密钥状态：已保存。留空会继续沿用当前密钥。';
        } else {
            entry.state.textContent = '密钥状态：未配置。';
        }
    }
}

function fillForm(preferences) {
    const normalized = normalizePreferences(preferences);
    currentPreferences = normalized;
    setUiLanguage(normalized.uiLanguage);
    pendingClearLlmKey = false;
    pendingClearElevenLabsKey = false;
    Object.keys(pendingClearEmailSecrets).forEach((providerId) => {
        pendingClearEmailSecrets[providerId] = false;
    });

    elements.petScale.value = normalized.petScale;
    elements.petShowTaskbar.checked = !normalized.petSkipTaskbar;
    elements.speechMode.value = normalized.speechMode;
    elements.chunkedTtsEnabled.checked = normalized.chunkedTtsEnabled;
    elements.recognitionMode.value = normalized.recognitionMode;
    if (elements.uiLanguage) {
        elements.uiLanguage.value = normalized.uiLanguage;
    }
    if (elements.conversationMode) {
        elements.conversationMode.value = normalized.conversationMode;
    }
    if (elements.recognitionModeText) {
        elements.recognitionModeText.textContent = recognitionModeLabels[normalized.recognitionMode] ||
            normalized.recognitionMode;
    }
    if (elements.ailisStateDir) {
        elements.ailisStateDir.value = normalized.ailisStateDir;
    }
    if (elements.ailisStateDirHelp) {
        elements.ailisStateDirHelp.textContent = normalized.ailisStateDir
            ? `当前解析目录：${normalized.ailisResolvedStateDir || normalized.ailisStateDir}`
            : `默认目录：${normalized.ailisDefaultStateDir || '软件根目录下的 .ailis-state'}`;
    }
    if (elements.voiceRuntimeRoot) {
        elements.voiceRuntimeRoot.value = normalized.voiceRuntimeRoot;
        elements.voiceRuntimeRoot.placeholder = normalized.voiceRuntimeDefaultRoot ||
            '默认使用 AILIS 根目录 models/voice-runtime';
    }
    if (elements.voiceRuntimePathHelp) {
        elements.voiceRuntimePathHelp.textContent = normalized.voiceRuntimeRoot
            ? `将安装并复用：${normalized.voiceRuntimeResolvedRoot || normalized.voiceRuntimeRoot}`
            : `默认位置：${normalized.voiceRuntimeDefaultRoot || 'AILIS 根目录/models/voice-runtime'}。可改到空间更大的磁盘。`;
    }
    elements.llmProvider.value = normalized.llmProvider;
    lastLlmProviderValue = normalized.llmProvider;
    elements.llmBaseUrl.value = normalized.llmBaseUrl;
    elements.llmModel.value = normalized.llmModel;
    currentOllamaTarget = normalizeOllamaTarget(normalized.ollamaTarget || {}, {
        ollamaDeploymentMode: normalized.ollamaDeploymentMode,
        modelId: normalized.llmModel,
        localModelPath: normalized.ollamaLocalModelPath
    });
    ollamaDeploymentMode = ollamaSourceToLegacyMode(currentOllamaTarget.source);
    ollamaDeploymentModeTouched = false;
    ollamaLocalModelDescriptor = null;
    if (elements.ollamaLocalModelPath) {
        elements.ollamaLocalModelPath.value = currentOllamaTarget.localPath || normalized.ollamaLocalModelPath || '';
    }
    if (elements.ollamaInstalledModelId && normalized.llmProvider === 'ollama') {
        elements.ollamaInstalledModelId.value = normalized.llmModel;
    }
    elements.llmApiKey.value = '';
    if (elements.llmApiKeyLabel) {
        elements.llmApiKeyLabel.value = '';
    }
    renderLlmApiKeySelect();
    elements.llmTemperature.value = String(normalized.llmTemperature);
    elements.llmTimeout.value = String(normalized.llmRequestTimeoutMs);
    syncLlmPresetSelectionFromFields();
    renderLlmCapabilityState(normalized.llmCapabilities);
    renderLlmHealthState(null);
    elements.elevenLabsApiBase.value = normalized.elevenLabsApiBase;
    elements.elevenLabsApiKey.value = '';
    elements.elevenLabsTimeout.value = String(normalized.elevenLabsTimeoutMs);
    draftElevenLabsVoiceProfiles = normalizeElevenLabsVoiceProfiles(
        normalized.elevenLabsVoiceProfiles,
        normalized
    );
    draftElevenLabsActiveLanguageCode = normalizeElevenLabsLanguageCode(normalized.elevenLabsLanguageCode, 'zh');
    writeElevenLabsProfileToFields(
        draftElevenLabsVoiceProfiles[draftElevenLabsActiveLanguageCode],
        draftElevenLabsActiveLanguageCode
    );
    elements.computerControlEnabled.checked = normalized.computerControlEnabled;
    for (const [providerId, entry] of Object.entries(emailElements)) {
        const profile = normalized.emailProfiles?.[providerId] || {};
        if (entry.account) {
            entry.account.value = profile.account || '';
        }
        if (entry.secret) {
            entry.secret.value = '';
        }
    }
    elements.cameraDistance.value = String(normalized.cameraDistance);
    elements.cameraHeight.value = String(normalized.cameraHeight);
    elements.cameraTargetY.value = String(normalized.cameraTargetY);
    elements.renderProfile.value = normalized.renderProfileId;
    elements.renderLightYaw.value = String(normalized.renderLightYawDeg);
    elements.renderKeyLight.value = String(normalized.renderKeyLightScale);
    elements.renderAmbientFill.value = String(normalized.renderAmbientFillScale);
    elements.renderOutlineScale.value = String(normalized.renderOutlineScale);
    elements.renderShadowEnabled.checked = normalized.renderShadowEnabled;
    elements.renderResolutionScale.value = String(normalized.renderResolutionScale);
    elements.renderFpsLimit.value = String(getFpsSliderIndex(normalized.renderFpsLimit));
    elements.renderShadowQuality.value = String(normalized.renderShadowQuality);
    elements.renderOutlineEnabled.checked = normalized.renderOutlineEnabled;
    elements.renderAntialiasEnabled.checked = normalized.renderAntialiasEnabled;
    elements.ttsRate.value = String(normalized.desktopNativeTtsRate);
    elements.ttsPitch.value = String(normalized.desktopNativeTtsPitch);
    elements.ttsVolume.value = String(normalized.desktopNativeTtsVolume);
    elements.avatarBubbleLeft.value = String(normalized.avatarDialogueBubbleLeft);
    elements.avatarBubbleTop.value = String(normalized.avatarDialogueBubbleTop);
    elements.avatarBubbleScale.value = String(normalized.avatarDialogueBubbleScale);
    elements.avatarBubbleExtraWidth.value = String(normalized.avatarDialogueBubbleExtraWidth);
    elements.avatarBubbleExtraTop.value = String(normalized.avatarDialogueBubbleExtraTop);
    elements.petMouseHitTestEnabled.checked = normalized.petMouseHitTestEnabled;
    elements.petMouseHitTestShape.value = normalized.petMouseHitTestShape;
    elements.petMouseHitTestWidth.value = String(normalized.petMouseHitTestWidthRatio);
    elements.petMouseHitTestHeight.value = String(normalized.petMouseHitTestHeightRatio);
    elements.petMouseHitTestOffsetX.value = String(normalized.petMouseHitTestOffsetXRatio);
    elements.petMouseHitTestOffsetY.value = String(normalized.petMouseHitTestOffsetYRatio);
    elements.petMouseHitTestDebug.checked = normalized.petMouseHitTestDebug;

    updateRangeLabels();
    syncLlmKeyState();
    syncElevenLabsKeyState();
    syncEmailSecretStates();
    syncMicrophoneSelection();
    syncSaveButton();
    renderOllamaLocalModelStatus(normalized.ollamaLocalModelPath
        ? { path: normalized.ollamaLocalModelPath }
        : null);
    renderOllamaModelMemoryLists();
    renderOllamaDeploymentMode();
    applyI18n(document);
}

function renderAgentRuntimeStatus(status = {}) {
    if (!elements.agentRuntimeStatusText || !elements.agentRuntimeDetailText) {
        return;
    }

    assistantStatusCache = {
        ...(assistantStatusCache || {}),
        ...(status || {}),
        managedRuntime: {
            ...((assistantStatusCache && assistantStatusCache.managedRuntime) || {}),
            ...((status && status.managedRuntime) || {})
        }
    };

    const resolvedStatus = assistantStatusCache || {};
    const humanGateway = resolvedStatus.humanGateway || resolvedStatus;
    const agentRunner = humanGateway.agentRunner || {};
    const memoryStatus = humanGateway.memory || agentRunner.memory || {};
    const toolValidation = resolvedStatus.toolSurfaceValidation || {};
    const agentToolValidation =
        humanGateway.agentToolSurfaceValidation ||
        humanGateway.openClawToolSurfaceValidation ||
        {};

    if (humanGateway.running) {
        elements.agentRuntimeStatusText.textContent = `AILIS Gateway 已运行（${humanGateway.url || `:${humanGateway.port || ''}`}）`;
    } else if (resolvedStatus.lastError) {
        elements.agentRuntimeStatusText.textContent = resolvedStatus.lastError;
    } else {
        elements.agentRuntimeStatusText.textContent = 'AILIS Gateway 尚未启动。';
    }

    const statusBits = [
        agentRunner.enabled ? `Agent Runner: ${agentRunner.version || 'v0'}` : '',
        humanGateway.defaultContext?.computerControlEnabled === true
            ? 'computer: 完全控制'
            : humanGateway.defaultContext?.computerControlEnabled === false
            ? 'computer: 确认模式'
            : '',
        typeof agentRunner.completedRunCount === 'number' ? `runs: ${agentRunner.completedRunCount}` : '',
        memoryStatus.enabled ? `memory: ${memoryStatus.affinityScore ?? 50}/100` : '',
        humanGateway.workspaceRoot ? `workspace: ${humanGateway.workspaceRoot}` : '',
        agentRunner.pendingStorePath ? `state: ${agentRunner.pendingStorePath}` : '',
        typeof agentToolValidation.ok === 'boolean'
            ? agentToolValidation.ok
                ? `tools: 工具面正常 (${agentToolValidation.coreToolCount || 0} core)`
                : `tools: 校验失败 (${agentToolValidation.issueCount || 0} 项)`
            : typeof toolValidation.ok === 'boolean'
            ? toolValidation.ok
                ? `tools: 工具面正常 (${toolValidation.coreToolCount || 0} core)`
                : `tools: 校验失败 (${toolValidation.issueCount || 0} 项)`
            : ''
    ].filter(Boolean);

    elements.agentRuntimeDetailText.textContent = statusBits.join(' | ');
}

async function refreshAgentRuntimeStatus() {
    if (!elements.agentRuntimeStatusText || !elements.agentRuntimeDetailText) {
        return;
    }

    if (!window.ailisDesktop?.gateway?.getStatus) {
        elements.agentRuntimeStatusText.textContent = '当前环境不支持 AILIS Gateway。';
        elements.agentRuntimeDetailText.textContent = '';
        return;
    }

    try {
        renderAgentRuntimeStatus(await window.ailisDesktop.gateway.getStatus());
    } catch (error) {
        elements.agentRuntimeStatusText.textContent = `读取 AILIS 状态失败：${error.message || error}`;
        elements.agentRuntimeDetailText.textContent = '';
    }
}

function truncatePanelText(value, maxChars = 180) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (text.length <= maxChars) {
        return text;
    }
    return `${text.slice(0, maxChars - 1)}…`;
}

function renderMemorySnapshot(snapshot = {}) {
    const status = snapshot.status || {};
    if (elements.memoryStatusText) {
        const affinity = typeof status.affinityScore === 'number'
            ? `好感度 ${status.affinityScore}/100`
            : '好感度未初始化';
        const blocks = typeof status.blockCount === 'number' ? `${status.blockCount} 个记忆块` : '';
        const events = typeof status.eventCount === 'number' ? `${status.eventCount} 条近期事件` : '';
        elements.memoryStatusText.textContent = [
            status.loaded === false ? '记忆未加载' : '记忆已启用',
            affinity,
            blocks,
            events,
            status.secretCount ? `隐私条目 ${status.secretCount}` : ''
        ].filter(Boolean).join(' | ');
    }
    if (elements.memoryPathText) {
        elements.memoryPathText.textContent = status.rootDir ? `目录：${status.rootDir}` : '';
    }
    if (!elements.memoryBlockList) {
        return;
    }

    elements.memoryBlockList.innerHTML = '';
    const blocks = Array.isArray(snapshot.blocks) ? snapshot.blocks : [];
    const preferredKeys = ['user', 'relationship', 'project', 'affinity', 'persona', 'secrets_index'];
    const orderedBlocks = [
        ...preferredKeys
            .map((key) => blocks.find((block) => block.key === key))
            .filter(Boolean),
        ...blocks.filter((block) => !preferredKeys.includes(block.key))
    ].slice(0, 6);

    if (!orderedBlocks.length) {
        const empty = document.createElement('div');
        empty.className = 'field-help';
        empty.textContent = '还没有可显示的记忆块。';
        elements.memoryBlockList.appendChild(empty);
        return;
    }

    orderedBlocks.forEach((block) => {
        const item = document.createElement('div');
        item.className = 'memory-block';

        const title = document.createElement('div');
        title.className = 'memory-block-title';
        title.textContent = block.label || block.key || '记忆块';

        const text = document.createElement('div');
        text.className = 'memory-block-text';
        text.textContent = truncatePanelText(block.value, 240);

        item.appendChild(title);
        item.appendChild(text);
        elements.memoryBlockList.appendChild(item);
    });
}

async function refreshMemoryStatus() {
    if (!window.ailisDesktop?.memory?.getSnapshot) {
        if (elements.memoryStatusText) {
            elements.memoryStatusText.textContent = '当前环境不支持人格记忆。';
        }
        return;
    }
    try {
        renderMemorySnapshot(await window.ailisDesktop.memory.getSnapshot({ includeEvents: false }));
    } catch (error) {
        if (elements.memoryStatusText) {
            elements.memoryStatusText.textContent = `读取人格记忆失败：${error.message || error}`;
        }
    }
}

function compactPath(value = '') {
    const text = String(value || '').trim();
    if (!text || text.length <= 72) {
        return text;
    }
    return `...${text.slice(-69)}`;
}

function getVoiceRuntimeSteps(runtime = {}) {
    return runtime.installPlan?.steps ||
        runtime.initialSnapshot?.installPlan?.steps ||
        runtime.bootstrap?.initialSnapshot?.installPlan?.steps ||
        [];
}

function getVoiceRuntimeComponents(runtime = {}) {
    return runtime.components ||
        runtime.initialSnapshot?.components ||
        runtime.bootstrap?.initialSnapshot?.components ||
        {};
}

function getVoiceRequiredSteps(runtime = {}) {
    return getVoiceRuntimeSteps(runtime).filter((step) => !step.optional);
}

function getVoiceOptionalSteps(runtime = {}) {
    return getVoiceRuntimeSteps(runtime).filter((step) => step.optional);
}

function getVoiceRuntimeOutcome(runtime = {}) {
    const bootstrap = runtime.bootstrap || {};
    const steps = getVoiceRuntimeSteps(runtime);
    const requiredSteps = steps.filter((step) => !step.optional);
    const optionalSteps = steps.filter((step) => step.optional);
    const runningStep = (bootstrap.steps || []).find((step) => step.status === 'running');
    if (!runtime || runtime.status === 'not_diagnosed') {
        return {
            tone: 'idle',
            title: '尚未诊断本地语音',
            copy: '点击“诊断环境”，AILIS 会检查 CosyVoice3、ASR、Python 和 GPU 加速状态。'
        };
    }
    if (bootstrap.status === 'running') {
        return {
            tone: 'running',
            title: runningStep?.title ? `正在${runningStep.title}` : '正在自动安装本地语音运行时',
            copy: '安装会写入 AILIS 私有运行时目录，不修改系统 Python。日志会实时保留在下方。'
        };
    }
    if (bootstrap.status === 'failed') {
        const failedStep = (bootstrap.steps || []).find((step) => step.status === 'failed');
        return {
            tone: 'failed',
            title: '本地语音自动安装失败',
            copy: failedStep?.error || bootstrap.error || '请查看下方日志里的真实失败原因。'
        };
    }
    if (runtime.ok) {
        return {
            tone: 'ready',
            title: 'CosyVoice3 本地语音已就绪',
            copy: runtime.capabilities?.asr?.ok
                ? '本地语音播放和 ASR 都已经通过验证。'
                : '本地语音播放已通过验证；ASR 是可选能力，未完成也不会阻塞播放。'
        };
    }
    if (requiredSteps.length) {
        return {
            tone: 'running',
            title: 'CosyVoice3 需要自动安装',
            copy: 'AILIS 已识别缺失的运行时组件，点击“自动安装并启用”即可完成源码、模型和私有 Python 配置。'
        };
    }
    return {
        tone: optionalSteps.length ? 'ready' : 'failed',
        title: optionalSteps.length ? '语音基础能力可用，仍有可选优化' : '本地语音运行时未就绪',
        copy: optionalSteps.length
            ? '可选优化失败不会阻塞 CosyVoice3 播放；需要更高性能时再安装。'
            : '诊断没有给出明确安装步骤，请重新诊断或查看日志。'
    };
}

function getVoiceRuntimeActionItems(runtime = {}) {
    const steps = getVoiceRuntimeSteps(runtime);
    const stepIds = new Set(steps.map((step) => step.id));
    const bootstrap = runtime.bootstrap || {};
    const actions = [];
    if (bootstrap.status === 'running') {
        actions.push('保持控制面板打开即可查看进度；下载模型时可能长时间停在同一阶段。');
        actions.push('如果失败，AILIS 会保留失败步骤和最后日志，不会假装安装成功。');
        return actions;
    }
    if (runtime.ok) {
        actions.push('点击“启用 CosyVoice3”会切换到本地语音播放；如果已经启用，可以直接聊天测试。');
        if (getVoiceOptionalSteps(runtime).length) {
            actions.push('ASR 和 GPU 加速是可选项，不影响基础语音播放；需要语音输入或更快首包时再补。');
        }
        return actions;
    }
    if (stepIds.has('install_portable_python')) {
        actions.push('AILIS 会创建自己的私有 Python runtime，不要求用户手动安装或改系统 PATH。');
    }
    if (stepIds.has('install_voice_python_packages')) {
        actions.push('会把 torch、torchaudio、transformers、huggingface_hub 等语音依赖安装到 AILIS 私有 venv。');
    }
    if (stepIds.has('install_cosyvoice_source')) {
        actions.push('会自动拉取 CosyVoice 源码和 Matcha-TTS 子模块，作为 CosyVoice3 worker 的运行代码。');
    }
    if (stepIds.has('install_cosyvoice3_model')) {
        actions.push('会下载 Fun-CosyVoice3-0.5B 本地模型，体积较大；下载完成后可离线合成语音。');
    }
    if (stepIds.has('install_asr_model')) {
        actions.push('会补齐本地 ASR 模型缓存，用于语音输入识别。');
    }
    if (stepIds.has('install_onnxruntime_gpu')) {
        actions.push('ONNX Runtime GPU 是可选性能项；失败时会回退 CPU provider，不再阻塞基础 TTS。');
    }
    if (!actions.length) {
        actions.push('点击“诊断环境”刷新状态；如果仍然未就绪，再点击“自动安装并启用”。');
    }
    return actions;
}

function getVoiceComponentTone(component = {}) {
    if (component.ok || component.status === 'verified' || component.status === 'ready') {
        return 'ready';
    }
    if (component.status === 'installing' || component.status === 'verifying') {
        return 'running';
    }
    if (component.status === 'failed' || component.status === 'incomplete') {
        return 'failed';
    }
    return component.optional ? 'idle' : 'blocked';
}

function getVoiceComponentStatusText(component = {}) {
    if (component.status === 'verified') {
        return '已验证';
    }
    if (component.status === 'ready') {
        return '已就绪';
    }
    if (component.status === 'installing') {
        return '安装中';
    }
    if (component.status === 'verifying') {
        return '验证中';
    }
    if (component.status === 'failed') {
        return '失败';
    }
    if (component.status === 'incomplete') {
        return '不完整';
    }
    if (component.status === 'missing') {
        return component.optional ? '可选缺失' : '缺失';
    }
    return component.optional ? '可选' : '待处理';
}

function appendVoiceComponentGroup(parent, title, components = []) {
    const visibleComponents = components.filter(Boolean);
    if (!visibleComponents.length) {
        return;
    }
    const section = createRuntimeElement('div', 'runtime-section');
    section.appendChild(createRuntimeElement('div', 'runtime-section-title', title));
    const grid = createRuntimeElement('div', 'runtime-component-grid');
    visibleComponents.forEach((component) => {
        const card = createRuntimeElement('div', `runtime-component is-${getVoiceComponentTone(component)}`);
        const head = createRuntimeElement('div', 'runtime-component-head');
        head.appendChild(createRuntimeElement('span', 'runtime-component-title', component.title || component.id));
        head.appendChild(createRuntimeElement('span', 'runtime-component-badge', getVoiceComponentStatusText(component)));
        card.appendChild(head);
        if (component.detail) {
            card.appendChild(createRuntimeElement('div', 'runtime-component-copy', component.detail));
        }
        grid.appendChild(card);
    });
    section.appendChild(grid);
    parent.appendChild(section);
}

function getVoiceBootstrapLogLines(runtime = {}) {
    const bootstrap = runtime.bootstrap || {};
    const lines = [];
    if (bootstrap.status && bootstrap.status !== 'not_started') {
        lines.push(`[AILIS Voice] 状态：${bootstrap.status}`);
    }
    for (const step of bootstrap.steps || []) {
        lines.push(`[${step.status || 'unknown'}] ${step.title || step.id}`);
        for (const entry of step.logs || []) {
            String(entry.text || '')
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean)
                .forEach((line) => lines.push(line));
        }
        if (step.error) {
            lines.push(`[error] ${step.error}`);
        }
    }
    for (const warning of bootstrap.warnings || []) {
        lines.push(`[warning] ${warning}`);
    }
    if (bootstrap.error) {
        lines.push(`[error] ${bootstrap.error}`);
    }
    return lines.slice(-90);
}

function getVoiceRuntimeResolvedRoot(runtime = {}) {
    return runtime.paths?.localRuntimeRoot ||
        currentPreferences?.voiceRuntimeResolvedRoot ||
        currentPreferences?.voiceRuntimeDefaultRoot ||
        '';
}

function renderVoiceRuntimePathHelp(runtime = {}) {
    if (!elements.voiceRuntimePathHelp) {
        return;
    }
    const resolvedRoot = getVoiceRuntimeResolvedRoot(runtime);
    const configuredRoot = elements.voiceRuntimeRoot?.value?.trim() ||
        currentPreferences?.voiceRuntimeRoot ||
        '';
    elements.voiceRuntimePathHelp.textContent = configuredRoot
        ? `将安装并复用：${resolvedRoot || configuredRoot}`
        : `默认位置：${resolvedRoot || 'AILIS 根目录/models/voice-runtime'}。建议改到空间充足的磁盘。`;
}

async function saveVoiceRuntimeRootPreference({ silent = false } = {}) {
    if (!window.ailisDesktop?.savePreferences || !elements.voiceRuntimeRoot) {
        return currentPreferences;
    }
    const nextRoot = elements.voiceRuntimeRoot.value.trim();
    if (nextRoot === String(currentPreferences?.voiceRuntimeRoot || '').trim()) {
        return currentPreferences;
    }
    const saved = await window.ailisDesktop.savePreferences({
        voiceRuntimeRoot: nextRoot
    });
    currentPreferences = normalizePreferences({
        ...(currentPreferences || {}),
        ...(saved || {}),
        voiceRuntimeRoot: nextRoot
    });
    panelState = {
        ...(panelState || {}),
        preferences: {
            ...(panelState?.preferences || {}),
            ...currentPreferences
        }
    };
    renderVoiceRuntimePathHelp(panelState.voiceRuntime || {});
    syncSaveButton();
    if (!silent) {
        setStatus(nextRoot ? '已保存本地语音安装位置。' : '已恢复本地语音默认安装位置。');
    }
    return currentPreferences;
}

function renderVoiceRuntimeStatus(runtime = {}) {
    if (!elements.voiceRuntimeStatus || !elements.voiceRuntimePlan) {
        return;
    }
    renderVoiceRuntimePathHelp(runtime);

    if (!runtime || runtime.status === 'not_diagnosed') {
        elements.voiceRuntimeStatus.innerHTML = '';
        elements.voiceRuntimeStatus.className = 'runtime-diagnostics';
        const outcome = getVoiceRuntimeOutcome(runtime);
        const outcomeNode = createRuntimeElement('div', `runtime-outcome is-${outcome.tone}`);
        outcomeNode.appendChild(createRuntimeElement('div', 'runtime-outcome-title', outcome.title));
        outcomeNode.appendChild(createRuntimeElement('div', 'runtime-outcome-copy', outcome.copy));
        elements.voiceRuntimeStatus.appendChild(outcomeNode);
        elements.voiceRuntimePlan.textContent = '点击“检查”只做本地诊断；点击“安装并启用”才会下载缺失组件。';
        if (elements.voiceRuntimeLog) {
            elements.voiceRuntimeLog.hidden = true;
            elements.voiceRuntimeLog.textContent = '';
        }
        if (elements.voiceRuntimeBootstrapBtn) {
            elements.voiceRuntimeBootstrapBtn.disabled = false;
            elements.voiceRuntimeBootstrapBtn.textContent = '安装并启用';
        }
        return;
    }

    const steps = getVoiceRuntimeSteps(runtime);
    const requiredSteps = getVoiceRequiredSteps(runtime);
    const optionalSteps = getVoiceOptionalSteps(runtime);
    const components = getVoiceRuntimeComponents(runtime);
    const outcome = getVoiceRuntimeOutcome(runtime);
    const issueItems = steps.map((step) =>
        `${step.optional ? '可选优化：' : ''}${step.title}：${step.reason || 'AILIS 会自动处理'}${step.estimatedSize ? `（${step.estimatedSize}）` : ''}`
    );

    elements.voiceRuntimeStatus.innerHTML = '';
    elements.voiceRuntimeStatus.className = 'runtime-diagnostics';
    const outcomeNode = createRuntimeElement('div', `runtime-outcome is-${outcome.tone}`);
    outcomeNode.appendChild(createRuntimeElement('div', 'runtime-outcome-title', outcome.title));
    outcomeNode.appendChild(createRuntimeElement('div', 'runtime-outcome-copy', outcome.copy));
    elements.voiceRuntimeStatus.appendChild(outcomeNode);
    appendVoiceComponentGroup(elements.voiceRuntimeStatus, 'TTS 必需链路', [
        components.python,
        components.voice_packages,
        components.cosyvoice_source,
        components.cosyvoice3_model,
        components.cosyvoice3_smoke
    ]);
    appendVoiceComponentGroup(elements.voiceRuntimeStatus, 'ASR 可选链路', [
        components.asr_model,
        components.asr_smoke
    ]);
    if (!runtime.ok && issueItems.length) {
        appendRuntimeSection(elements.voiceRuntimeStatus, '下一步会处理', issueItems.filter((item, index) =>
            !optionalSteps.length || index < 5
        ).slice(0, 5));
    }

    elements.voiceRuntimePlan.textContent = requiredSteps.length
        ? `需要处理 ${requiredSteps.length} 个 TTS 必需步骤，位置：${compactPath(getVoiceRuntimeResolvedRoot(runtime))}`
        : optionalSteps.length
            ? 'TTS 基础语音已可用；ASR/性能项为可选，不会阻塞播放。'
            : runtime.ok ? '本地语音已就绪，重启后会继续复用当前安装位置。' : '没有可自动处理的安装项，请重新检查。';

    if (elements.voiceRuntimeLog) {
        const logLines = getVoiceBootstrapLogLines(runtime);
        const shouldShowLog = logLines.length && (
            runtime.bootstrap?.status === 'running' ||
            runtime.bootstrap?.status === 'failed' ||
            runtime.bootstrap?.error ||
            runtime.bootstrap?.warnings?.length
        );
        elements.voiceRuntimeLog.hidden = !shouldShowLog;
        elements.voiceRuntimeLog.textContent = logLines.join('\n');
    }

    const bootstrapStatus = runtime.bootstrap?.status || runtime.status || '';
    if (elements.voiceRuntimeBootstrapBtn) {
        elements.voiceRuntimeBootstrapBtn.disabled = bootstrapStatus === 'running';
        elements.voiceRuntimeBootstrapBtn.textContent = bootstrapStatus === 'running'
            ? '安装中...'
            : runtime.ok ? '启用 CosyVoice3' : '安装并启用';
    }
}

async function refreshVoiceRuntimeStatus({ diagnose = false, silent = false } = {}) {
    if (!window.ailisDesktop?.voiceRuntime) {
        return;
    }
    if (!silent) {
        setStatus(diagnose ? '正在诊断本地语音运行时...' : '正在读取本地语音运行时状态...');
    }
    try {
        if (!diagnose) {
            const status = await window.ailisDesktop.voiceRuntime.getStatus?.();
            const initialSnapshot = status?.initialSnapshot || null;
            const summary = {
                ...(panelState?.voiceRuntime || {}),
                ...(initialSnapshot
                    ? {
                        ok: initialSnapshot.ok,
                        status: initialSnapshot.ok ? 'ready' : 'needs_setup',
                        platform: initialSnapshot.platform,
                        paths: initialSnapshot.paths,
                        installerVersion: initialSnapshot.installerVersion,
                        components: initialSnapshot.components,
                        capabilities: initialSnapshot.capabilities,
                        cosyVoice3: initialSnapshot.cosyVoice3,
                        asr: initialSnapshot.asr,
                        preferredPython: initialSnapshot.selectedPython?.command || '',
                        preferredAsrPython: initialSnapshot.selectedAsrPython?.command || '',
                        installStepCount: initialSnapshot.installPlan?.steps?.length || 0,
                        installPlan: initialSnapshot.installPlan
                    }
                    : {}),
                bootstrap: status || panelState?.voiceRuntime?.bootstrap
            };
            panelState = {
                ...(panelState || {}),
                voiceRuntime: summary
            };
            renderVoiceRuntimeStatus(summary);
            return;
        }

        const result = await window.ailisDesktop.voiceRuntime.diagnose();
        const bootstrap = await window.ailisDesktop.voiceRuntime.getStatus?.();
        const summary = {
            ok: result.ok,
            status: result.ok ? 'ready' : 'needs_setup',
            platform: result.platform,
            paths: result.paths,
            installerVersion: result.installerVersion,
            components: result.components,
            capabilities: result.capabilities,
            cosyVoice3: result.cosyVoice3,
            asr: result.asr,
            preferredPython: result.selectedPython?.command || '',
            preferredAsrPython: result.selectedAsrPython?.command || '',
            installStepCount: result.installPlan?.steps?.length || 0,
            installPlan: result.installPlan,
            bootstrap
        };
        panelState = {
            ...(panelState || {}),
            voiceRuntime: summary
        };
        renderVoiceRuntimeStatus(summary);
        if (!silent) {
            setStatus('本地语音运行时状态已更新。');
        }
    } catch (error) {
        elements.voiceRuntimeStatus.textContent = `诊断失败：${error.message || error}`;
        if (!silent) {
            setStatus(`诊断本地语音运行时失败：${error.message || error}`);
        }
    }
}

function startVoiceRuntimePolling() {
    if (voiceRuntimePollTimer) {
        window.clearInterval(voiceRuntimePollTimer);
    }
    voiceRuntimePollTimer = window.setInterval(() => {
        void refreshVoiceRuntimeStatus({ diagnose: false, silent: true });
    }, 1500);
}

function stopVoiceRuntimePolling() {
    if (!voiceRuntimePollTimer) {
        return;
    }
    window.clearInterval(voiceRuntimePollTimer);
    voiceRuntimePollTimer = null;
}

async function bootstrapVoiceRuntime() {
    if (!window.ailisDesktop?.voiceRuntime?.bootstrap) {
        setStatus('当前环境不支持本地语音运行时自动修复。');
        return;
    }
    await saveVoiceRuntimeRootPreference({ silent: true });
    let runtime = panelState?.voiceRuntime || {};
    if (!runtime.installPlan && runtime.status !== 'ready') {
        await refreshVoiceRuntimeStatus({ diagnose: true, silent: true });
        runtime = panelState?.voiceRuntime || {};
    }
    const steps = runtime.installPlan?.steps || [];
    const requiredSteps = steps.filter((step) => !step.optional);
    const optionalSteps = steps.filter((step) => step.optional);
    const installSteps = requiredSteps.length ? requiredSteps : [];
    const needsNetwork = installSteps.some((step) => step.requiresNetwork);
    if (needsNetwork) {
        const confirmed = window.confirm(
            `本地语音播放需要联网下载 TTS 必需组件，体积可能较大。\n\n${installSteps.map((step) => `- ${step.title}${step.estimatedSize ? `：${step.estimatedSize}` : ''}`).join('\n')}\n\nASR 是可选能力，本次不会默认安装。\n\n继续安装并在完成后启用 CosyVoice3 吗？`
        );
        if (!confirmed) {
            return;
        }
    }

    elements.voiceRuntimeBootstrapBtn.disabled = true;
    elements.voiceRuntimeBootstrapBtn.textContent = installSteps.length ? '安装中...' : '正在启用...';
    setStatus(installSteps.length
        ? '正在自动安装本地语音播放组件，这可能需要一些时间...'
        : '正在启用 CosyVoice3 本地语音...');

    try {
        startVoiceRuntimePolling();
        const result = installSteps.length
            ? await window.ailisDesktop.voiceRuntime.bootstrap({
                allowNetwork: true,
                includeOptional: false
            })
            : { ok: true, status: 'completed', steps: [] };
        panelState = {
            ...(panelState || {}),
            voiceRuntime: {
                ...(panelState?.voiceRuntime || {}),
                bootstrap: result
            }
        };
        renderVoiceRuntimeStatus(panelState.voiceRuntime);
        if (!result.ok) {
            const failedStep = (result.steps || []).find((step) => step.status === 'failed');
            setStatus(`本地语音运行时安装未完成：${failedStep?.error || result.error || result.status}`);
        } else {
            if (elements.speechMode) {
                elements.speechMode.value = 'cosyvoice3';
            }
            setStatus('CosyVoice3 已启用，正在预热本地语音模型...');
            const savedPreferences = await window.ailisDesktop.setSpeechMode?.('cosyvoice3');
            const fallbackText = optionalSteps.length
                ? '本地语音播放已就绪并启用 CosyVoice3；ASR 是可选项，可稍后单独安装。'
                : '本地语音运行时已就绪，并已启用 CosyVoice3。';
            setStatus(formatCosyVoiceWarmupStatus(savedPreferences?.voiceWarmup, fallbackText));
        }
        await refreshVoiceRuntimeStatus({ diagnose: true, silent: true });
    } catch (error) {
        setStatus(`本地语音运行时安装失败：${error.message || error}`);
    } finally {
        stopVoiceRuntimePolling();
        await refreshVoiceRuntimeStatus({ diagnose: false, silent: true });
    }
}

async function chooseVoiceRuntimeRoot() {
    if (!window.ailisDesktop?.voiceRuntime?.chooseInstallDir) {
        setStatus('当前环境不支持选择本地语音安装目录。');
        return;
    }
    try {
        const result = await window.ailisDesktop.voiceRuntime.chooseInstallDir();
        if (!result?.ok || !result.path) {
            return;
        }
        if (elements.voiceRuntimeRoot) {
            elements.voiceRuntimeRoot.value = result.path;
        }
        await saveVoiceRuntimeRootPreference();
        await refreshVoiceRuntimeStatus({ diagnose: true, silent: true });
    } catch (error) {
        setStatus(`选择本地语音安装目录失败：${error.message || error}`);
    }
}

function clearElement(element) {
    if (element) {
        element.innerHTML = '';
    }
}

function setAgentLabStatus(text) {
    if (elements.agentLabStatus) {
        elements.agentLabStatus.textContent = text;
    }
}

function formatDurationMs(value) {
    const duration = Number(value);
    if (!Number.isFinite(duration) || duration < 0) {
        return '-';
    }
    if (duration < 1000) {
        return `${Math.round(duration)}ms`;
    }
    if (duration < 60000) {
        const digits = duration < 10000 ? 1 : 0;
        return `${(duration / 1000).toFixed(digits)}s`;
    }
    return `${(duration / 60000).toFixed(1)}m`;
}

function formatTokenCount(value) {
    const tokens = Number(value);
    if (!Number.isFinite(tokens) || tokens < 0) {
        return '-';
    }
    if (tokens >= 1000000) {
        return `${(tokens / 1000000).toFixed(1)}M`;
    }
    if (tokens >= 1000) {
        return `${(tokens / 1000).toFixed(1)}K`;
    }
    return String(Math.round(tokens));
}

function formatAgentLabTime(value) {
    const date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) {
        return '';
    }
    return date.toLocaleString();
}

function safeJsonStringify(value) {
    const seen = new WeakSet();
    return JSON.stringify(value, (key, entry) => {
        if (/token|password|secret|api[_-]?key|authorization|credential|pass|auth[_-]?code/i.test(key)) {
            return '__REDACTED__';
        }
        if (entry && typeof entry === 'object') {
            if (seen.has(entry)) {
                return '[Circular]';
            }
            seen.add(entry);
        }
        return entry;
    }, 2);
}

function createAgentLabEmpty(text) {
    const empty = document.createElement('div');
    empty.className = 'agent-lab-empty';
    empty.textContent = text;
    return empty;
}

function renderAgentLabRuns(runs = []) {
    if (!elements.agentLabRuns) {
        return;
    }
    clearElement(elements.agentLabRuns);
    if (!runs.length) {
        elements.agentLabRuns.appendChild(createAgentLabEmpty('还没有可分析的 Agent 运行记录。'));
        return;
    }

    runs.slice(0, 12).forEach((run) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = `agent-lab-run-item${run.runId === agentLabSelectedRunId ? ' active' : ''}`;

        const title = document.createElement('div');
        title.className = 'agent-lab-item-title';
        title.textContent = truncatePanelText(run.message || run.intent || run.runId, 80);

        const meta = document.createElement('div');
        meta.className = 'agent-lab-item-meta';
        meta.textContent = [
            run.status || 'unknown',
            run.sessionId || 'main',
            formatDurationMs(run.durationMs),
            formatAgentLabTime(run.iso)
        ].filter(Boolean).join(' | ');

        item.appendChild(title);
        item.appendChild(meta);
        item.addEventListener('click', () => {
            void loadAgentLabAnalysis(run.runId);
        });
        elements.agentLabRuns.appendChild(item);
    });
}

function appendAgentLabMetric(label, value) {
    const item = document.createElement('div');
    item.className = 'agent-lab-metric';

    const valueNode = document.createElement('div');
    valueNode.className = 'agent-lab-metric-value';
    valueNode.textContent = value;

    const labelNode = document.createElement('div');
    labelNode.className = 'agent-lab-metric-label';
    labelNode.textContent = label;

    item.appendChild(valueNode);
    item.appendChild(labelNode);
    elements.agentLabMetrics?.appendChild(item);
}

function renderAgentLabMetrics(analysis) {
    if (!elements.agentLabMetrics) {
        return;
    }
    clearElement(elements.agentLabMetrics);
    const summary = analysis?.summary || {};
    appendAgentLabMetric('状态', summary.status || analysis?.status || '-');
    appendAgentLabMetric('总耗时', formatDurationMs(summary.durationMs));
    appendAgentLabMetric('Agent 轮次', String(summary.rounds ?? 0));
    appendAgentLabMetric('上下文 Token', formatTokenCount(summary.totalContextTokens));
    appendAgentLabMetric('LLM 调用', String(summary.llmCalls ?? 0));
    appendAgentLabMetric('LLM Token', formatTokenCount(summary.usage?.totalTokens));
    appendAgentLabMetric('工具调用', String(summary.toolCalls ?? 0));
    appendAgentLabMetric('失败工具', String(summary.failedTools ?? 0));
}

function renderAgentLabBottleneck(analysis) {
    if (!elements.agentLabBottleneck) {
        return;
    }
    clearElement(elements.agentLabBottleneck);
    if (!analysis) {
        elements.agentLabBottleneck.appendChild(createAgentLabEmpty('选择一次运行后，系统会根据耗时、失败工具和上下文规模推断核心瓶颈。'));
        return;
    }

    const primary = document.createElement('div');
    primary.className = 'agent-lab-bottleneck-item';
    const title = document.createElement('div');
    title.className = 'agent-lab-item-title';
    title.textContent = analysis.summary?.primaryBottleneck || analysis.bottlenecks?.primary || '未发现明显单点瓶颈';
    const meta = document.createElement('div');
    meta.className = 'agent-lab-item-meta';
    meta.textContent = `runId: ${analysis.runId || '-'} | transcript: ${analysis.transcript?.itemCount ?? 0} items`;
    primary.appendChild(title);
    primary.appendChild(meta);
    elements.agentLabBottleneck.appendChild(primary);

    const items = Array.isArray(analysis.bottlenecks?.items) ? analysis.bottlenecks.items : [];
    if (!items.length) {
        return;
    }
    items.slice(0, 6).forEach((entry) => {
        const item = document.createElement('div');
        item.className = 'agent-lab-bottleneck-item';
        const itemTitle = document.createElement('div');
        itemTitle.className = 'agent-lab-item-title';
        itemTitle.textContent = entry.label || entry.kind || 'bottleneck';
        const itemMeta = document.createElement('div');
        itemMeta.className = 'agent-lab-item-meta';
        itemMeta.textContent = [
            entry.kind || '',
            entry.severity ? `severity=${entry.severity}` : '',
            entry.durationMs ? `duration=${formatDurationMs(entry.durationMs)}` : '',
            entry.tokens ? `tokens=${formatTokenCount(entry.tokens)}` : '',
            truncatePanelText(entry.detail || '', 110)
        ].filter(Boolean).join(' | ');
        item.appendChild(itemTitle);
        item.appendChild(itemMeta);
        elements.agentLabBottleneck.appendChild(item);
    });
}

function renderAgentLabTimeline(analysis) {
    if (!elements.agentLabTimeline) {
        return;
    }
    clearElement(elements.agentLabTimeline);
    const timeline = Array.isArray(analysis?.timeline) ? analysis.timeline : [];
    if (!timeline.length) {
        elements.agentLabTimeline.appendChild(createAgentLabEmpty('暂无时间线。运行一次任务后会显示 transcript、event 和 audit 的合并轨迹。'));
        return;
    }

    timeline.slice(-60).forEach((entry) => {
        const item = document.createElement('div');
        item.className = 'agent-lab-timeline-item';

        const title = document.createElement('div');
        title.className = 'agent-lab-item-title';
        title.textContent = `${entry.kind || 'runtime'} · ${entry.title || entry.type || 'event'}`;

        const meta = document.createElement('div');
        meta.className = 'agent-lab-item-meta';
        meta.textContent = [
            entry.source || '',
            entry.status || '',
            entry.durationMs ? formatDurationMs(entry.durationMs) : '',
            formatAgentLabTime(entry.iso),
            truncatePanelText(entry.preview || '', 130)
        ].filter(Boolean).join(' | ');

        item.appendChild(title);
        item.appendChild(meta);
        elements.agentLabTimeline.appendChild(item);
    });
}

function getSelectedAgentLabRound() {
    const rounds = Array.isArray(agentLabAnalysis?.rounds) ? agentLabAnalysis.rounds : [];
    const value = Number(elements.agentLabContextSelect?.value ?? 0);
    return rounds.find((round) => Number(round.iteration) === value) || rounds[0] || null;
}

function renderAgentLabContext(round = null) {
    if (!elements.agentLabContextJson) {
        return;
    }
    if (!agentLabAnalysis || !round) {
        elements.agentLabContextJson.textContent = '选择一次运行后，这里会展示该轮发送给模型的完整 messages、prompt budget、LLM 调用和工具结果。';
        return;
    }
    elements.agentLabContextJson.textContent = safeJsonStringify({
        runId: agentLabAnalysis.runId,
        sessionId: agentLabAnalysis.sessionId,
        transcript: agentLabAnalysis.transcript,
        iteration: round.iteration,
        label: round.label,
        approxInputTokens: round.approxInputTokens,
        promptBudget: round.promptBudget,
        messages: round.messages,
        decision: round.decision,
        llmCalls: round.llmCalls,
        tools: round.tools,
        notes: round.notes
    });
}

function renderAgentLabContextOptions(analysis) {
    if (!elements.agentLabContextSelect) {
        return;
    }
    clearElement(elements.agentLabContextSelect);
    const rounds = Array.isArray(analysis?.rounds) ? analysis.rounds : [];
    elements.agentLabContextSelect.disabled = !rounds.length;
    if (!rounds.length) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '暂无可用轮次上下文';
        elements.agentLabContextSelect.appendChild(option);
        renderAgentLabContext(null);
        return;
    }
    rounds.forEach((round) => {
        const option = document.createElement('option');
        option.value = String(round.iteration);
        option.textContent = [
            round.label || `第 ${Number(round.iteration || 0) + 1} 轮`,
            `${formatTokenCount(round.approxInputTokens)} ctx tokens`,
            `${round.llmCalls?.length || 0} LLM`,
            `${round.tools?.length || 0} tools`
        ].join(' | ');
        elements.agentLabContextSelect.appendChild(option);
    });
    renderAgentLabContext(getSelectedAgentLabRound());
}

function renderAgentLabAnalysis(analysis) {
    agentLabAnalysis = analysis || null;
    if (analysis?.runId) {
        agentLabSelectedRunId = analysis.runId;
    }
    renderAgentLabMetrics(agentLabAnalysis);
    renderAgentLabBottleneck(agentLabAnalysis);
    renderAgentLabTimeline(agentLabAnalysis);
    renderAgentLabContextOptions(agentLabAnalysis);
    renderAgentLabRuns(agentLabRuns);
    if (!agentLabAnalysis) {
        setAgentLabStatus('暂无运行');
        return;
    }
    setAgentLabStatus([
        agentLabAnalysis.status || 'unknown',
        `${agentLabAnalysis.summary?.rounds ?? 0} 轮`,
        `${agentLabAnalysis.summary?.toolCalls ?? 0} 工具`
    ].join(' | '));
}

async function loadAgentLabAnalysis(runId, { silent = false } = {}) {
    const id = String(runId || '').trim();
    if (!id || !window.ailisDesktop?.agentLab?.getRunAnalysis) {
        if (!silent) {
            setAgentLabStatus('当前环境不支持 Agent Lab。');
        }
        return;
    }
    agentLabSelectedRunId = id;
    renderAgentLabRuns(agentLabRuns);
    if (!silent) {
        setAgentLabStatus('正在读取分析...');
    }
    try {
        const analysis = await window.ailisDesktop.agentLab.getRunAnalysis({
            runId: id,
            transcriptLimit: 2500
        });
        if (!analysis?.ok) {
            renderAgentLabAnalysis(null);
            setAgentLabStatus(`读取失败：${analysis?.error || analysis?.status || 'unknown'}`);
            return;
        }
        renderAgentLabAnalysis(analysis);
    } catch (error) {
        if (!silent) {
            setAgentLabStatus(`分析失败：${error.message || error}`);
        }
    }
}

async function refreshAgentLabRuns({ selectLatest = false, silent = false } = {}) {
    if (!window.ailisDesktop?.agentLab?.listRuns) {
        setAgentLabStatus('当前环境不支持 Agent Lab。');
        renderAgentLabAnalysis(null);
        return;
    }
    if (!silent) {
        setAgentLabStatus('正在刷新...');
    }
    try {
        const result = await window.ailisDesktop.agentLab.listRuns({ limit: 40 });
        agentLabRuns = Array.isArray(result?.runs) ? result.runs : [];
        const nextRunId = selectLatest
            ? agentLabRuns[0]?.runId
            : agentLabSelectedRunId || agentLabRuns[0]?.runId || '';
        renderAgentLabRuns(agentLabRuns);
        if (nextRunId) {
            await loadAgentLabAnalysis(nextRunId, { silent: true });
        } else {
            renderAgentLabAnalysis(null);
        }
    } catch (error) {
        if (!silent) {
            setAgentLabStatus(`刷新失败：${error.message || error}`);
        }
    }
}

function syncAgentLabRunButton() {
    if (!elements.agentLabRunBtn) {
        return;
    }
    elements.agentLabRunBtn.disabled = agentLabRunInFlight;
    elements.agentLabRunBtn.textContent = agentLabRunInFlight ? '运行中...' : '运行并分析';
}

async function runAgentLabTask() {
    if (!window.ailisDesktop?.agentLab?.runTask) {
        setAgentLabStatus('当前环境不支持 Agent Lab。');
        return;
    }
    const message = elements.agentLabTask?.value.trim() || '';
    if (!message) {
        setAgentLabStatus('请先输入一个测试任务。');
        elements.agentLabTask?.focus();
        return;
    }
    const sessionId = elements.agentLabSession?.value.trim() || 'agent-lab';
    const maxAgentSteps = Math.max(1, Math.min(Number(elements.agentLabMaxSteps?.value || 12), 12));
    const dryRun = elements.agentLabDryRun?.checked === true;
    const classifyOnly = elements.agentLabClassifyOnly?.checked === true;
    const approved = elements.agentLabApproved?.checked === true;

    agentLabRunInFlight = true;
    syncAgentLabRunButton();
    setAgentLabStatus('正在运行 Agent Loop...');

    try {
        const result = await window.ailisDesktop.agentLab.runTask({
            message,
            sessionId,
            agentLoop: 'llm',
            planner: 'llm',
            maxAgentSteps,
            dryRun,
            classifyOnly,
            autoConfirm: approved,
            analysis: {
                transcriptLimit: 2500
            },
            context: {
                sessionId,
                sessionKey: sessionId,
                agentLoop: 'llm',
                planner: 'llm',
                maxAgentSteps,
                dryRun,
                approved,
                autoConfirm: approved,
                confirmationPolicy: approved ? 'auto' : 'manual',
                analysisMode: true,
                source: 'control-panel-agent-lab'
            }
        });
        if (result?.analysis?.ok) {
            renderAgentLabAnalysis(result.analysis);
        }
        if (result?.runId) {
            agentLabSelectedRunId = result.runId;
            await refreshAgentLabRuns({ selectLatest: true, silent: true });
            await loadAgentLabAnalysis(result.runId, { silent: true });
        } else if (!result?.ok) {
            setAgentLabStatus(`运行失败：${result?.status || 'unknown'}`);
        }
    } catch (error) {
        setAgentLabStatus(`运行失败：${error.message || error}`);
    } finally {
        agentLabRunInFlight = false;
        syncAgentLabRunButton();
    }
}

function scheduleAgentLabAnalysisRefresh(runId) {
    const id = String(runId || agentLabSelectedRunId || '').trim();
    if (!id || id !== agentLabSelectedRunId) {
        return;
    }
    if (agentLabRefreshTimer) {
        clearTimeout(agentLabRefreshTimer);
    }
    agentLabRefreshTimer = setTimeout(() => {
        agentLabRefreshTimer = null;
        void loadAgentLabAnalysis(id, { silent: true });
    }, 650);
}

async function resetAffinityScore() {
    if (!window.ailisDesktop?.memory?.resetAffinity) {
        return;
    }
    try {
        await window.ailisDesktop.memory.resetAffinity({ score: 50 });
        await refreshMemoryStatus();
        setStatus('好感度已重置为 50。');
    } catch (error) {
        setStatus(`重置好感度失败：${error.message || error}`);
    }
}

async function clearMemoryStore() {
    if (!window.ailisDesktop?.memory?.clear) {
        setStatus('当前环境不支持清空人格记忆。');
        return;
    }
    const confirmed = window.confirm(
        '确认清空 AILIS 长期记忆吗？\n\n将重置记忆块、近期事件、daily notes、反思记录和好感度；已保存的密钥条目会保留。'
    );
    if (!confirmed) {
        return;
    }
    try {
        const result = await window.ailisDesktop.memory.clear({ preserveSecrets: true });
        if (!result?.ok) {
            setStatus(`清空记忆失败：${result?.status || 'unknown_error'}`);
            return;
        }
        await refreshMemoryStatus();
        setStatus('长期记忆已清空，密钥条目已保留。');
    } catch (error) {
        setStatus(`清空记忆失败：${error.message || error}`);
    }
}

function syncMicrophoneSelection() {
    const currentValue = currentPreferences?.preferredMicDeviceId || '';
    const previousValue = elements.preferredMic.value;
    const selectedValue = previousValue || currentValue;

    elements.preferredMic.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '系统默认麦克风';
    elements.preferredMic.appendChild(defaultOption);

    if (!microphoneDevices.length) {
        const option = document.createElement('option');
        option.value = currentValue;
        option.textContent = currentValue ? '已保存设备（当前未发现）' : '未发现可用麦克风';
        if (currentValue) {
            elements.preferredMic.appendChild(option);
        }
        elements.preferredMic.value = currentValue;
        return;
    }

    microphoneDevices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.textContent = device.label || `麦克风 ${index + 1}`;
        elements.preferredMic.appendChild(option);
    });

    const hasSelected = microphoneDevices.some((device) => device.deviceId === selectedValue);
    if (!hasSelected && selectedValue) {
        const preservedOption = document.createElement('option');
        preservedOption.value = selectedValue;
        preservedOption.textContent = '已保存设备（当前未连接）';
        elements.preferredMic.appendChild(preservedOption);
    }

    elements.preferredMic.value = hasSelected || selectedValue ? selectedValue : '';
}

async function refreshMicrophones({ requestPermission = false } = {}) {
    if (!navigator.mediaDevices?.enumerateDevices) {
        microphoneDevices = [];
        elements.micHelp.textContent = '当前桌面环境不支持枚举音频输入设备。';
        syncMicrophoneSelection();
        return;
    }

    try {
        if (requestPermission && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((track) => track.stop());
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        microphoneDevices = devices.filter((device) => device.kind === 'audioinput');
        elements.micHelp.textContent = microphoneDevices.length
            ? `共发现 ${microphoneDevices.length} 个音频输入设备。`
            : '还没有识别到可用麦克风，插拔设备后可重新刷新。';
        syncMicrophoneSelection();
    } catch (error) {
        microphoneDevices = [];
        elements.micHelp.textContent = `读取麦克风失败：${error.message || error}`;
        syncMicrophoneSelection();
    }
}

async function savePreferences() {
    if (!window.ailisDesktop?.savePreferences) {
        setStatus(t('当前环境不支持保存桌面配置。'));
        return;
    }

    saveInFlight = true;
    syncSaveButton();
    setStatus(t('正在保存设置...'));

    try {
        const nextPreferences = readFormPreferences({ includeSecret: true });
        const savedPreferences = await window.ailisDesktop.savePreferences(
            nextPreferences
        );
        pendingClearLlmKey = false;
        pendingClearElevenLabsKey = false;
        fillForm(savedPreferences);
        await refreshAgentRuntimeStatus();
        setStatus(formatCosyVoiceWarmupStatus(
            savedPreferences?.voiceWarmup,
            t('设置已保存，桌宠与聊天窗已同步刷新。')
        ));
    } catch (error) {
        setStatus(t('保存失败：{reason}', { reason: error.message || error }));
    } finally {
        saveInFlight = false;
        syncSaveButton();
    }
}

async function restoreDefaults() {
    if (!window.ailisDesktop?.restoreDefaultPreferences) {
        setStatus(t('当前环境不支持恢复默认配置。'));
        return;
    }

    const confirmed = window.confirm(t('恢复默认后会覆盖当前面板中的设置，继续吗？'));
    if (!confirmed) {
        return;
    }

    saveInFlight = true;
    syncSaveButton();
    setStatus(t('正在恢复默认设置...'));

    try {
        const restoredPreferences = await window.ailisDesktop.restoreDefaultPreferences();
        pendingClearLlmKey = false;
        pendingClearElevenLabsKey = false;
        fillForm(restoredPreferences);
        await refreshAgentRuntimeStatus();
        setStatus(t('默认设置已恢复。'));
    } catch (error) {
        setStatus(t('恢复默认失败：{reason}', { reason: error.message || error }));
    } finally {
        saveInFlight = false;
        syncSaveButton();
    }
}

async function initialize() {
    if (!window.ailisDesktop?.getControlPanelState) {
        setStatus(t('当前页面只能在 AILIS 桌面版里使用。'));
        return;
    }

    setStatus(t('正在读取当前配置...'));

    try {
        panelState = await window.ailisDesktop.getControlPanelState();
        llmProviderDefaultBaseUrls = {
            ...fallbackLlmProviderDefaultBaseUrls,
            ...(panelState.options?.llmProviderDefaultBaseUrls || {})
        };
        llmProviderDefaultModels = {
            ...fallbackLlmProviderDefaultModels,
            ...(panelState.options?.llmProviderDefaultModels || {})
        };
        setUiLanguage(panelState.preferences?.uiLanguage || 'zh-CN');
        fillUiLanguageOptions(panelState.options?.uiLanguageOptions || []);
        fillScaleOptions(panelState.options?.petScaleOptions || []);
        fillSpeechModeOptions(panelState.options?.speechModeOptions || []);
        fillRecognitionModeOptions(panelState.options?.recognitionModeOptions || ['fast-vad', 'auto-vad', 'continuous', 'manual']);
        fillConversationModeOptions(panelState.options?.conversationModeOptions || ['assistant', 'daily']);
        fillLlmProviderOptions(panelState.options?.llmProviderOptions || ['openai-compatible']);
        fillLlmPresetOptions();
        fillRenderProfileOptions(panelState.options?.renderProfileOptions || Object.keys(renderProfileLabels));
        fillForm(panelState.preferences || {});
        if ((panelState.preferences?.ollamaDeploymentMode || '') === 'local' &&
            panelState.preferences?.ollamaLocalModelPath) {
            scheduleAfterFirstPaint(() => {
                void describeOllamaLocalModelPath(panelState.preferences.ollamaLocalModelPath);
            }, 180);
        }
        renderCharacterAssets(panelState.preferences?.characterAssets || {});
        renderAgentRuntimeStatus(panelState.assistant?.humanGateway || panelState.assistant || {});
        renderVoiceRuntimeStatus(panelState.voiceRuntime || {});
        renderRuntimeComponentsStatus(panelState.runtimeComponents || {});
        renderOllamaRuntimeStatus(panelState.ollamaRuntime || {});

        elements.appVersion.textContent = `v${panelState.environment?.version || '1.0.0'}`;
        if (elements.userDataPath) {
            elements.userDataPath.textContent = panelState.environment?.userDataPath || '未知';
        }
        if (elements.recognitionModeText) {
            elements.recognitionModeText.textContent = recognitionModeLabels[panelState.preferences?.recognitionMode] ||
                panelState.preferences?.recognitionMode ||
                'auto-vad';
        }
        if (elements.packageStateText) {
            const launchModeLabel = panelState.environment?.isPackaged
                ? '已从安装包或便携版启动'
                : '开发模式运行中';
            const packageStateParts = [
                launchModeLabel,
                formatRuntimeComponentSelection(panelState.runtimeComponents || {})
            ].filter(Boolean);
            elements.packageStateText.textContent = packageStateParts.join(' | ');
        }

        setStatus(t('配置已就绪。修改后点击右下角保存。'));
        scheduleStartupDeferredWork();
    } catch (error) {
        setStatus(t('读取配置失败：{reason}', { reason: error.message || error }));
    }
}

function setRangeValue(element, value) {
    if (!element) {
        return;
    }

    const minimum = Number(element.min || 0);
    const maximum = Number(element.max || 100);
    element.value = String(Math.round(clampNumber(value, minimum, maximum, minimum, 0)));
}

function beginDialogueBubbleDrag(event) {
    if (event.button !== 0 || !elements.avatarBubbleWindowPreview || !elements.avatarBubblePreview) {
        return;
    }

    event.preventDefault();
    const windowRect = elements.avatarBubbleWindowPreview.getBoundingClientRect();
    const bubbleRect = elements.avatarBubblePreview.getBoundingClientRect();
    dialoguePreviewDrag = {
        type: 'bubble',
        pointerId: event.pointerId,
        windowLeft: windowRect.left,
        windowTop: windowRect.top,
        offsetX: event.clientX - bubbleRect.left,
        offsetY: event.clientY - bubbleRect.top
    };
    elements.avatarBubblePreview.setPointerCapture?.(event.pointerId);
}

function beginDialogueWindowResize(event) {
    if (event.button !== 0) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    dialoguePreviewDrag = {
        type: 'window',
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startExtraWidth: Number(elements.avatarBubbleExtraWidth.value) || 0,
        startExtraTop: Number(elements.avatarBubbleExtraTop.value) || 0
    };
    elements.avatarBubbleWindowResize.setPointerCapture?.(event.pointerId);
}

function moveDialoguePreviewDrag(event) {
    if (!dialoguePreviewDrag || event.pointerId !== dialoguePreviewDrag.pointerId) {
        return;
    }

    event.preventDefault();

    if (dialoguePreviewDrag.type === 'bubble') {
        const nextLeft = (event.clientX - dialoguePreviewDrag.windowLeft - dialoguePreviewDrag.offsetX) /
            dialoguePreviewScale;
        const nextTop = (event.clientY - dialoguePreviewDrag.windowTop - dialoguePreviewDrag.offsetY) /
            dialoguePreviewScale;
        setRangeValue(elements.avatarBubbleLeft, nextLeft);
        setRangeValue(elements.avatarBubbleTop, nextTop);
    } else if (dialoguePreviewDrag.type === 'window') {
        const nextExtraWidth = dialoguePreviewDrag.startExtraWidth +
            (event.clientX - dialoguePreviewDrag.startX) / dialoguePreviewScale;
        const nextExtraTop = dialoguePreviewDrag.startExtraTop +
            (event.clientY - dialoguePreviewDrag.startY) / dialoguePreviewScale;
        setRangeValue(elements.avatarBubbleExtraWidth, nextExtraWidth);
        setRangeValue(elements.avatarBubbleExtraTop, nextExtraTop);
    }

    updateRangeLabels();
    syncSaveButton();
}

function endDialoguePreviewDrag(event) {
    if (!dialoguePreviewDrag || event.pointerId !== dialoguePreviewDrag.pointerId) {
        return;
    }

    event.preventDefault();
    dialoguePreviewDrag = null;
    syncSaveButton();
}

[
    elements.avatarBubbleExtraWidth,
    elements.avatarBubbleExtraTop,
    elements.avatarBubbleLeft,
    elements.avatarBubbleScale,
    elements.avatarBubbleTop,
    elements.cameraDistance,
    elements.cameraHeight,
    elements.cameraTargetY,
    elements.llmBaseUrl,
    elements.llmModel,
    elements.llmProvider,
    elements.llmTemperature,
    elements.llmTimeout,
    elements.ailisStateDir,
    elements.elevenLabsApiBase,
    elements.elevenLabsVoiceId,
    elements.elevenLabsLanguageCode,
    elements.elevenLabsModelId,
    elements.elevenLabsOutputFormat,
    elements.elevenLabsTimeout,
    elements.elevenLabsOptimizeLatency,
    elements.elevenLabsSpeakerBoost,
    elements.elevenLabsSpeed,
    elements.elevenLabsStability,
    elements.elevenLabsSimilarity,
    elements.elevenLabsStyle,
    elements.chunkedTtsEnabled,
    elements.computerControlEnabled,
    elements.conversationMode,
    elements.emailQqAccount,
    elements.emailGmailAccount,
    elements.emailOutlookAccount,
    elements.petMouseHitTestDebug,
    elements.petMouseHitTestEnabled,
    elements.petMouseHitTestHeight,
    elements.petMouseHitTestOffsetX,
    elements.petMouseHitTestOffsetY,
    elements.petMouseHitTestShape,
    elements.petMouseHitTestWidth,
    elements.petScale,
    elements.preferredMic,
    elements.recognitionMode,
    elements.renderAmbientFill,
    elements.renderAntialiasEnabled,
    elements.renderFpsLimit,
    elements.renderKeyLight,
    elements.renderLightYaw,
    elements.renderOutlineEnabled,
    elements.renderOutlineScale,
    elements.renderProfile,
    elements.renderResolutionScale,
    elements.renderShadowEnabled,
    elements.renderShadowQuality,
    elements.petShowTaskbar,
    elements.speechMode,
    elements.ttsPitch,
    elements.ttsRate,
    elements.ttsVolume,
    elements.uiLanguage
].forEach((element) => {
    element?.addEventListener('input', () => {
        updateRangeLabels();
        syncSaveButton();
    });
    element?.addEventListener('change', () => {
        updateRangeLabels();
        syncSaveButton();
    });
});

elements.avatarBubblePreview?.addEventListener('pointerdown', beginDialogueBubbleDrag);
elements.avatarBubblePreview?.addEventListener('pointermove', moveDialoguePreviewDrag);
elements.avatarBubblePreview?.addEventListener('pointerup', endDialoguePreviewDrag);
elements.avatarBubblePreview?.addEventListener('pointercancel', endDialoguePreviewDrag);
elements.avatarBubbleWindowResize?.addEventListener('pointerdown', beginDialogueWindowResize);
elements.avatarBubbleWindowResize?.addEventListener('pointermove', moveDialoguePreviewDrag);
elements.avatarBubbleWindowResize?.addEventListener('pointerup', endDialoguePreviewDrag);
elements.avatarBubbleWindowResize?.addEventListener('pointercancel', endDialoguePreviewDrag);
window.addEventListener('resize', syncDialoguePreview);

elements.llmApiKey.addEventListener('input', () => {
    if (elements.llmApiKey.value.trim()) {
        pendingClearLlmKey = false;
    }
    syncLlmKeyState();
    syncSaveButton();
});

elements.llmApiKeySelect?.addEventListener('change', () => {
    pendingClearLlmKey = false;
    syncLlmKeyState();
    renderLlmHealthState(null);
    syncSaveButton();
});

elements.llmApiKeyLabel?.addEventListener('input', () => {
    syncLlmKeyState();
    syncSaveButton();
});

elements.llmPreset?.addEventListener('change', () => {
    applyLlmPreset(elements.llmPreset.value);
    syncVllmModelCatalogPanel();
    updateRangeLabels();
    syncSaveButton();
});

elements.llmModelPreset?.addEventListener('change', () => {
    if (elements.llmModelPreset.value !== LLM_PRESET_CUSTOM_ID) {
        elements.llmModel.value = elements.llmModelPreset.value;
        renderLlmCapabilityState();
        renderLlmHealthState(null);
    }
    syncVllmModelCatalogPanel();
    syncSaveButton();
});

elements.vllmModelRefreshBtn?.addEventListener('click', () => {
    void refreshVllmModelCatalog();
});

elements.vllmModelApplyBtn?.addEventListener('click', () => {
    applySelectedVllmCatalogModel();
});

elements.vllmModelCatalog?.addEventListener('change', () => {
    vllmDownloadDirDescriptor = null;
    renderVllmDownloadDirStatus(null);
});

elements.vllmLocalModelBrowseBtn?.addEventListener('click', () => {
    void chooseLocalVllmModelFolder();
});

elements.vllmLocalModelUseBtn?.addEventListener('click', () => {
    const applied = applyLocalVllmModelSelection();
    if (applied?.localPath) {
        void describeLocalVllmModelPath(applied.localPath);
    }
});

elements.vllmLocalModelPath?.addEventListener('input', () => {
    vllmLocalModelDescriptor = null;
    if (elements.vllmLocalServedName && !elements.vllmLocalServedName.value.trim()) {
        elements.vllmLocalServedName.value = inferVllmServedNameFromPath(elements.vllmLocalModelPath.value);
    }
    renderLocalVllmModelStatus(null);
    syncSaveButton();
});

elements.vllmLocalServedName?.addEventListener('input', () => {
    if (getLocalVllmModelPath()) {
        applyLocalVllmModelSelection(vllmLocalModelDescriptor || null);
    }
});

elements.vllmDownloadDirBrowseBtn?.addEventListener('click', () => {
    void chooseVllmDownloadFolder();
});

elements.vllmDownloadDir?.addEventListener('input', () => {
    vllmDownloadDirDescriptor = null;
    renderVllmDownloadDirStatus(null);
    syncSaveButton();
});

elements.ollamaRuntimeCheckBtn?.addEventListener('click', () => {
    void runOllamaRuntimeCheck();
});

elements.ollamaLocalModelBrowseBtn?.addEventListener('click', () => {
    setOllamaDeploymentMode('local', { userInitiated: true });
    void chooseOllamaLocalModelPath();
});

elements.ollamaLocalModelUseBtn?.addEventListener('click', () => {
    setOllamaDeploymentMode('local', { userInitiated: true });
    void (async () => {
        const descriptor = await describeOllamaLocalModelPath();
        if (descriptor) {
            applyOllamaLocalModelDescriptor(descriptor);
        }
    })();
});

elements.ollamaLocalModelClearBtn?.addEventListener('click', () => {
    ollamaDeploymentModeTouched = true;
    clearOllamaLocalModelPath();
});

elements.ollamaLocalModelPath?.addEventListener('input', () => {
    setOllamaDeploymentMode('local', { userInitiated: true });
    ollamaLocalModelDescriptor = null;
    renderOllamaLocalModelStatus(null);
    syncSaveButton();
});

document.querySelectorAll('[data-ollama-mode]').forEach((button) => {
    button.addEventListener('click', () => {
        setOllamaDeploymentMode(button.dataset.ollamaMode, { userInitiated: true });
    });
});

elements.ollamaInstalledModelId?.addEventListener('input', () => {
    setOllamaDeploymentMode('installed', { userInitiated: true });
    if (elements.llmModel) {
        elements.llmModel.value = elements.ollamaInstalledModelId.value.trim();
    }
    fillLlmModelPresetOptions('ollama', elements.llmModel?.value || '');
    renderLlmHealthState(null);
    syncSaveButton();
});

elements.ollamaInstalledModelList?.addEventListener('change', () => {
    applyOllamaModelName(elements.ollamaInstalledModelList.value, {
        statusText: `已选择本机 Ollama 模型：${elements.ollamaInstalledModelList.value}`
    });
});

elements.ollamaInstalledModelRefreshBtn?.addEventListener('click', () => {
    setOllamaDeploymentMode('installed', { userInitiated: true });
    void refreshOllamaInstalledModels();
});

elements.ollamaInstalledModelUseBtn?.addEventListener('click', () => {
    applyOllamaInstalledModelId();
});

elements.ollamaUsedModelList?.addEventListener('change', () => {
    const modelId = elements.ollamaUsedModelList.value;
    if (modelId && elements.ollamaInstalledModelId) {
        elements.ollamaInstalledModelId.value = modelId;
    }
});

elements.ollamaUsedModelUseBtn?.addEventListener('click', () => {
    const modelId = elements.ollamaUsedModelList?.value || '';
    if (!applyOllamaModelName(modelId, {
        markUsed: true,
        statusText: `已切换到最近使用的 Ollama 模型：${modelId}`
    })) {
        setStatus('还没有可用的最近使用模型。');
    }
});

elements.ollamaModelSearchBtn?.addEventListener('click', () => {
    setOllamaDeploymentMode('online', { userInitiated: true });
    void refreshOllamaModelCatalog();
});

elements.ollamaModelQuery?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        setOllamaDeploymentMode('online', { userInitiated: true });
        void refreshOllamaModelCatalog();
    }
});

elements.ollamaModelUseBtn?.addEventListener('click', () => {
    setOllamaDeploymentMode('online', { userInitiated: true });
    applySelectedOllamaCatalogModel();
});

elements.ollamaRuntimeDeployBtn?.addEventListener('click', () => {
    void deploySelectedOllamaModel();
});

elements.ollamaRuntimeCancelBtn?.addEventListener('click', () => {
    void cancelOllamaDeployment();
});

elements.vllmRuntimeDiagnoseBtn?.addEventListener('click', () => {
    void refreshVllmRuntimeStatus({ diagnose: true });
});

elements.vllmRuntimeDeployBtn?.addEventListener('click', () => {
    if (!getLocalVllmModelPath()) {
        setStatus('请先在“方式一”选择本地模型文件夹。');
        return;
    }
    void deploySelectedVllmModel({ mode: 'local' });
});

elements.vllmOnlineModelDeployBtn?.addEventListener('click', () => {
    const model = applySelectedVllmCatalogModel();
    if (!model?.id) {
        return;
    }
    void deploySelectedVllmModel({ mode: 'online' });
});

elements.vllmRuntimeCancelBtn?.addEventListener('click', () => {
    void cancelVllmDeployment();
});

elements.vllmModelSource?.addEventListener('change', () => {
    if (isVllmModelCatalogVisible()) {
        void refreshVllmModelCatalog();
    }
});

elements.vllmModelQuery?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        void refreshVllmModelCatalog();
    }
});

elements.llmProvider?.addEventListener('change', () => {
    const nextProvider = elements.llmProvider.value;
    applyLlmProviderDefaultsIfNeeded(lastLlmProviderValue, nextProvider);
    lastLlmProviderValue = nextProvider;
    if (elements.llmApiKey) {
        elements.llmApiKey.value = '';
    }
    if (elements.llmApiKeyLabel) {
        elements.llmApiKeyLabel.value = '';
    }
    pendingClearLlmKey = false;
    syncLlmPresetSelectionFromFields();
    syncLlmKeyState();
    renderLlmCapabilityState();
    renderLlmHealthState(null);
    syncVllmModelCatalogPanel();
    updateRangeLabels();
    syncSaveButton();
});

elements.llmBaseUrl?.addEventListener('input', () => {
    syncLlmPresetSelectionFromFields();
    renderLlmCapabilityState();
    renderLlmHealthState(null);
});

elements.llmModel?.addEventListener('input', () => {
    syncLlmPresetSelectionFromFields();
    renderLlmCapabilityState();
    renderLlmHealthState(null);
});

elements.llmHealthCheckBtn?.addEventListener('click', () => {
    void runLlmHealthCheck();
});

elements.elevenLabsApiKey.addEventListener('input', () => {
    if (elements.elevenLabsApiKey.value.trim()) {
        pendingClearElevenLabsKey = false;
    }
    syncElevenLabsKeyState();
    syncSaveButton();
});

elements.elevenLabsLanguageCode?.addEventListener('change', () => {
    switchElevenLabsVoiceProfile(elements.elevenLabsLanguageCode.value);
    syncSaveButton();
});

elements.uiLanguage?.addEventListener('change', () => {
    setUiLanguage(elements.uiLanguage.value);
    applyI18n(document);
    setStatus(t('切换后会翻译聊天窗、控制菜单和控制面板。保存后其他窗口会同步。'));
    syncSaveButton();
});

for (const [providerId, entry] of Object.entries(emailElements)) {
    entry.secret?.addEventListener('input', () => {
        if (entry.secret.value.trim()) {
            pendingClearEmailSecrets[providerId] = false;
        }
        syncEmailSecretStates();
        syncSaveButton();
    });
    entry.clear?.addEventListener('click', () => {
        if (entry.secret) {
            entry.secret.value = '';
        }
        pendingClearEmailSecrets[providerId] = Boolean(currentPreferences?.emailProfiles?.[providerId]?.secretConfigured);
        syncEmailSecretStates();
        syncSaveButton();
    });
}

elements.clearLlmKeyBtn.addEventListener('click', () => {
    elements.llmApiKey.value = '';
    pendingClearLlmKey = Boolean(
        getSelectedLlmApiKeyMeta() ||
        currentPreferences?.llmApiKeyConfigured
    );
    syncLlmKeyState();
    syncSaveButton();
});

elements.clearElevenLabsKeyBtn.addEventListener('click', () => {
    elements.elevenLabsApiKey.value = '';
    pendingClearElevenLabsKey = Boolean(currentPreferences?.elevenLabsApiKeyConfigured);
    syncElevenLabsKeyState();
    syncSaveButton();
});

elements.chooseAILISStateDirBtn?.addEventListener('click', async () => {
    if (!window.ailisDesktop?.chooseAILISStateDir) {
        setStatus('当前环境不支持选择目录。');
        return;
    }
    try {
        const result = await window.ailisDesktop.chooseAILISStateDir();
        if (!result?.ok || !result.path) {
            return;
        }
        elements.ailisStateDir.value = result.path;
        if (elements.ailisStateDirHelp) {
            elements.ailisStateDirHelp.textContent = `保存后使用：${result.path}`;
        }
        syncSaveButton();
    } catch (error) {
        setStatus(`选择目录失败：${error.message || error}`);
    }
});

elements.resetAILISStateDirBtn?.addEventListener('click', () => {
    elements.ailisStateDir.value = '';
    if (elements.ailisStateDirHelp) {
        elements.ailisStateDirHelp.textContent =
            `保存后使用默认目录：${currentPreferences?.ailisDefaultStateDir || '软件根目录下的 .ailis-state'}`;
    }
    syncSaveButton();
});

elements.characterInstallFolderBtn?.addEventListener('click', () => {
    void installCharacterPackFromFolder();
});

elements.characterInstallSampleBtn?.addEventListener('click', () => {
    void installSampleCharacterPack();
});

elements.characterResetActiveBtn?.addEventListener('click', () => {
    void resetActiveCharacterPack();
});

elements.saveBtn.addEventListener('click', () => {
    void savePreferences();
});

elements.resetBtn.addEventListener('click', () => {
    void restoreDefaults();
});

elements.refreshMicsBtn.addEventListener('click', () => {
    void refreshMicrophones({ requestPermission: true });
});

elements.voiceRuntimeDiagnoseBtn?.addEventListener('click', () => {
    void (async () => {
        await saveVoiceRuntimeRootPreference({ silent: true });
        await refreshVoiceRuntimeStatus({ diagnose: true });
    })();
});

elements.voiceRuntimeBootstrapBtn?.addEventListener('click', () => {
    void bootstrapVoiceRuntime();
});

elements.voiceRuntimeBrowseBtn?.addEventListener('click', () => {
    void chooseVoiceRuntimeRoot();
});

elements.voiceRuntimeRoot?.addEventListener('input', () => {
    renderVoiceRuntimePathHelp(panelState?.voiceRuntime || {});
    syncSaveButton();
});

elements.runtimeComponentsRefreshBtn?.addEventListener('click', () => {
    void refreshRuntimeComponentsStatus();
});

elements.runtimeComponentsInstallBtn?.addEventListener('click', () => {
    void installSelectedRuntimeComponents();
});

elements.refreshMemoryBtn?.addEventListener('click', () => {
    void refreshMemoryStatus();
});

elements.resetAffinityBtn?.addEventListener('click', () => {
    void resetAffinityScore();
});

elements.clearMemoryBtn?.addEventListener('click', () => {
    void clearMemoryStore();
});

elements.openAgentLabBtn?.addEventListener('click', () => {
    void window.ailisDesktop?.showAgentLab?.();
});

elements.closeBtn.addEventListener('click', () => {
    void window.ailisDesktop?.closeCurrentWindow?.();
});

window.ailisDesktop?.onPreferencesUpdated?.(({ preferences = {} } = {}) => {
    if (saveInFlight) {
        return;
    }

    if (hasDirtyChanges()) {
        setStatus('检测到外部配置更新。当前面板中的改动还没保存。');
        return;
    }

    fillForm(preferences);
    renderCharacterAssets(preferences.characterAssets || {});
    scheduleAgentRuntimeStatusRefresh();
    scheduleMemoryStatusRefresh();
    setStatus('已同步外部配置更新。');
});

window.ailisDesktop?.gateway?.onEvent?.((event = {}) => {
    if (/^(gateway|agent|tool)\./.test(event.type || '')) {
        scheduleAgentRuntimeStatusRefresh();
    }
    if (/^agent\.memory\./.test(event.type || '')) {
        scheduleMemoryStatusRefresh();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    initializeControlPageNavigation();
    updateRangeLabels();
    void initialize();
});

navigator.mediaDevices?.addEventListener?.('devicechange', () => {
    scheduleAfterFirstPaint(() => {
        void refreshMicrophones();
    }, 300);
});
