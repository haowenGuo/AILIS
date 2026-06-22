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
    llmBaseUrl: document.getElementById('llm-base-url'),
    llmCapabilityState: document.getElementById('llm-capability-state'),
    llmHealthCheckBtn: document.getElementById('llm-health-check-btn'),
    llmHealthState: document.getElementById('llm-health-state'),
    llmKeyState: document.getElementById('llm-key-state'),
    llmModel: document.getElementById('llm-model'),
    llmModelPreset: document.getElementById('llm-model-preset'),
    llmPreset: document.getElementById('llm-preset'),
    llmPresetHelp: document.getElementById('llm-preset-help'),
    llmProvider: document.getElementById('llm-provider'),
    llmSetupHelp: document.getElementById('llm-setup-help'),
    llmTemperature: document.getElementById('llm-temperature'),
    llmTemperatureValue: document.getElementById('llm-temperature-value'),
    llmTimeout: document.getElementById('llm-timeout'),
    vllmModelApplyBtn: document.getElementById('vllm-model-apply-btn'),
    vllmModelCatalog: document.getElementById('vllm-model-catalog'),
    vllmModelCatalogPanel: document.getElementById('vllm-model-catalog-panel'),
    vllmModelCatalogStatus: document.getElementById('vllm-model-catalog-status'),
    vllmModelQuery: document.getElementById('vllm-model-query'),
    vllmModelRefreshBtn: document.getElementById('vllm-model-refresh-btn'),
    vllmModelSource: document.getElementById('vllm-model-source'),
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
    openclawRuntimeText: document.getElementById('openclaw-runtime-text'),
    openclawStatusText: document.getElementById('openclaw-status-text'),
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
    userDataPath: document.getElementById('user-data-path'),
    voiceRuntimeBootstrapBtn: document.getElementById('voice-runtime-bootstrap-btn'),
    voiceRuntimeDiagnoseBtn: document.getElementById('voice-runtime-diagnose-btn'),
    voiceRuntimePlan: document.getElementById('voice-runtime-plan'),
    voiceRuntimeStatus: document.getElementById('voice-runtime-status')
};

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
    }
};
const ELEVENLABS_LANGUAGE_CODES = Object.freeze(Object.keys(elevenLabsLanguagePresets));

const llmProviderLabels = {
    'openai-compatible': 'OpenAI-compatible',
    'openai-responses': 'OpenAI Responses',
    anthropic: 'Anthropic Claude',
    gemini: 'Google Gemini',
    vllm: 'vLLM 本地',
    ollama: 'Ollama 本地'
};

const fallbackLlmProviderDefaultBaseUrls = {
    'openai-compatible': 'https://ark.cn-beijing.volces.com/api/v3',
    'openai-responses': 'https://api.openai.com/v1',
    anthropic: 'https://api.anthropic.com',
    gemini: 'https://generativelanguage.googleapis.com/v1beta',
    vllm: 'http://127.0.0.1:8000/v1',
    ollama: 'http://127.0.0.1:11434'
};

const fallbackLlmProviderDefaultModels = {
    'openai-compatible': 'doubao-seed-2-0-mini-260215',
    'openai-responses': 'gpt-4.1-mini',
    anthropic: 'claude-3-5-haiku-latest',
    gemini: 'gemini-2.0-flash',
    vllm: 'Qwen/Qwen2.5-7B-Instruct',
    ollama: 'llama3.2'
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
            { id: 'llama3.2', label: 'Llama 3.2（默认本地）' },
            { id: 'qwen2.5:7b', label: 'Qwen2.5 7B（中文/通用）' },
            { id: 'qwen2.5:14b', label: 'Qwen2.5 14B（更强）' },
            { id: 'llama3.1:8b', label: 'Llama 3.1 8B' },
            { id: 'gemma3:4b', label: 'Gemma 3 4B（轻量）' }
        ]
    },
    {
        id: 'vllm',
        label: 'vLLM 本地 / 局域网',
        help: 'OpenAI-compatible 本地服务；Base 必须填到 /v1，模型名必须等于 vLLM /v1/models 返回的 id。API Key 可留空。',
        provider: 'vllm',
        baseUrl: 'http://127.0.0.1:8000/v1',
        models: [
            { id: 'Qwen/Qwen2.5-7B-Instruct', label: 'Qwen2.5 7B Instruct' },
            { id: 'Qwen/Qwen2.5-14B-Instruct', label: 'Qwen2.5 14B Instruct' },
            { id: 'meta-llama/Llama-3.1-8B-Instruct', label: 'Llama 3.1 8B Instruct' },
            { id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B', label: 'DeepSeek R1 Distill Qwen 7B' }
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
let vllmRuntimePollTimer = null;
const pendingClearEmailSecrets = {
    qq: false,
    gmail: false,
    outlook: false
};

function isLocalLlmProvider(provider = elements.llmProvider?.value) {
    return provider === 'ollama' || provider === 'vllm';
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

    return {
        petScale: String(preferences.petScale ?? '0.85'),
        petSkipTaskbar: Boolean(preferences.petSkipTaskbar),
        speechMode: String(preferences.speechMode || 'cosyvoice3'),
        chunkedTtsEnabled: preferences.chunkedTtsEnabled !== false,
        recognitionMode: String(preferences.recognitionMode || 'auto-vad'),
        conversationMode: ['assistant', 'daily'].includes(String(preferences.conversationMode || '').trim())
            ? String(preferences.conversationMode).trim()
            : 'assistant',
        preferredMicDeviceId: String(preferences.preferredMicDeviceId || ''),
        ailisStateDir: String(preferences.ailisStateDir || ''),
        ailisResolvedStateDir: String(preferences.ailisResolvedStateDir || ''),
        ailisDefaultStateDir: String(preferences.ailisDefaultStateDir || ''),
        llmProvider: String(preferences.llmProvider || 'openai-compatible'),
        llmBaseUrl: String(preferences.llmBaseUrl || 'https://ark.cn-beijing.volces.com/api/v3'),
        llmModel: String(preferences.llmModel || 'doubao-seed-2-0-mini-260215'),
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

function readFormPreferences({ includeSecret = false } = {}) {
    captureCurrentElevenLabsProfile();
    const nextPreferences = normalizePreferences({
        petScale: Number(elements.petScale.value),
        petSkipTaskbar: !elements.petShowTaskbar.checked,
        speechMode: elements.speechMode.value,
        chunkedTtsEnabled: elements.chunkedTtsEnabled.checked,
        recognitionMode: elements.recognitionMode.value,
        conversationMode: elements.conversationMode?.value || currentPreferences?.conversationMode || 'assistant',
        preferredMicDeviceId: elements.preferredMic.value,
        ailisStateDir: elements.ailisStateDir
            ? elements.ailisStateDir.value.trim()
            : currentPreferences?.ailisStateDir || '',
        ailisResolvedStateDir: currentPreferences?.ailisResolvedStateDir || '',
        ailisDefaultStateDir: currentPreferences?.ailisDefaultStateDir || '',
        llmProvider: elements.llmProvider.value,
        llmBaseUrl: elements.llmBaseUrl.value,
        llmModel: elements.llmModel.value,
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
        const nextApiKey = elements.llmApiKey.value.trim();
        if (nextApiKey) {
            nextPreferences.llmApiKey = nextApiKey;
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

function fillSpeechModeOptions(modeOptions = []) {
    elements.speechMode.innerHTML = '';
    modeOptions.forEach((mode) => {
        const option = document.createElement('option');
        option.value = mode;
        option.textContent = speechModeLabels[mode] || mode;
        elements.speechMode.appendChild(option);
    });
}

function fillRecognitionModeOptions(modeOptions = []) {
    elements.recognitionMode.innerHTML = '';
    modeOptions.forEach((mode) => {
        const option = document.createElement('option');
        option.value = mode;
        option.textContent = recognitionModeLabels[mode] || mode;
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
        option.textContent = conversationModeLabels[mode] || mode;
        elements.conversationMode.appendChild(option);
    });
}

function fillLlmProviderOptions(providerOptions = []) {
    elements.llmProvider.innerHTML = '';
    providerOptions.forEach((provider) => {
        const option = document.createElement('option');
        option.value = provider;
        option.textContent = llmProviderLabels[provider] || provider;
        elements.llmProvider.appendChild(option);
    });
}

function fillRenderProfileOptions(profileOptions = []) {
    elements.renderProfile.innerHTML = '';
    profileOptions.forEach((profileId) => {
        const option = document.createElement('option');
        option.value = profileId;
        option.textContent = renderProfileLabels[profileId] || profileId;
        elements.renderProfile.appendChild(option);
    });
}

function syncLlmKeyState() {
    if (pendingClearLlmKey) {
        elements.llmKeyState.textContent = '保存后会清除已保存 Key。';
        return;
    }

    if (isLocalLlmProvider()) {
        elements.llmKeyState.textContent = elements.llmApiKey.value.trim()
            ? '本次测试会使用输入的本地服务 Key；保存后常规调用优先使用本地专属环境变量。'
            : '本地 Ollama/vLLM 通常无需 Key；如 vLLM 需要鉴权，请设置 VLLM_API_KEY。';
        return;
    }

    if (currentPreferences?.llmApiKeyConfigured) {
        if (currentPreferences.llmApiKeySource === 'environment') {
            elements.llmKeyState.textContent = elements.llmApiKey.value.trim()
                ? '保存后会用新 Key 覆盖环境变量里的 Key。'
                : 'Key 状态：已从环境变量读取。';
            return;
        }

        elements.llmKeyState.textContent = elements.llmApiKey.value.trim()
            ? '保存后会用新 Key 覆盖已保存 Key。'
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
}

function getProviderDefaultBaseUrl(provider) {
    return llmProviderDefaultBaseUrls[provider] || fallbackLlmProviderDefaultBaseUrls[provider] || '';
}

function getProviderDefaultModel(provider) {
    return llmProviderDefaultModels[provider] || fallbackLlmProviderDefaultModels[provider] || '';
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
    elements.llmPresetHelp.textContent = preset?.help || '选择服务商后填写对应配置；本地 Ollama/vLLM 通常不需要 API Key。';
}

function getLocalLlmSetupHelp(provider = elements.llmProvider?.value) {
    if (provider === 'ollama') {
        return [
            'Ollama 使用步骤：1. 运行 ollama serve；2. 运行 ollama pull llama3.2 或其他模型；',
            '3. AILIS 的 API Base 填 http://127.0.0.1:11434，不要写 /api/chat；',
            '4. 模型 ID 填 ollama list 里看到的名字，例如 llama3.2 或 qwen2.5:7b；5. API Key 留空。'
        ].join('');
    }
    if (provider === 'vllm') {
        return [
            'vLLM 一站式部署：运行 pnpm llm:vllm:oneclick；国内源可运行 pnpm llm:vllm:oneclick:modelscope。脚本会在 WSL/Linux 创建 venv、安装 vLLM、下载模型并启动服务；',
            'AILIS 的 API Base 填 http://127.0.0.1:8000/v1；',
            '模型 ID 填 /v1/models 返回的 id，通常等于启动时的模型名；API Key 默认留空。'
        ].join('');
    }
    return '本地模型：先启动 Ollama 或 vLLM 服务，再选择对应预设；云端模型则填写平台 API Key。';
}

function syncLlmSetupHelp() {
    if (!elements.llmSetupHelp) {
        return;
    }
    elements.llmSetupHelp.textContent = getLocalLlmSetupHelp(elements.llmProvider?.value);
}

function isVllmModelCatalogVisible() {
    return elements.llmPreset?.value === 'vllm' || elements.llmProvider?.value === 'vllm';
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
            '选择 vLLM 后可从 Hugging Face / ModelScope 实时查找最新开源模型。';
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
        '选择后会写入模型 ID；部署仍以 vLLM 实际启动的 /v1/models 为准。'
    ].filter(Boolean);
    elements.vllmModelCatalogStatus.textContent = parts.join(' ');
}

function syncVllmModelCatalogPanel({ maybeRefresh = false } = {}) {
    if (!elements.vllmModelCatalogPanel) {
        return;
    }
    const visible = isVllmModelCatalogVisible();
    elements.vllmModelCatalogPanel.hidden = !visible;
    if (!visible) {
        return;
    }
    renderVllmModelCatalogSelect();
    renderVllmModelCatalogStatus();
    if (maybeRefresh && !vllmModelCatalogResults.length && !vllmModelCatalogInFlight) {
        void refreshVllmModelCatalog();
    }
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
        elements.vllmModelRefreshBtn.textContent = '查找中...';
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
                elements.vllmModelRefreshBtn.textContent = '实时查找';
            }
            renderVllmModelCatalogStatus();
        }
    }
}

function getSelectedVllmCatalogModel() {
    if (elements.vllmModelCatalog && vllmModelCatalogResults.length) {
        return vllmModelCatalogResults[Number(elements.vllmModelCatalog.value)] || null;
    }
    const id = elements.llmModel?.value?.trim() || '';
    return id
        ? { id, source: elements.vllmModelSource?.value || 'modelscope', sourceLabel: '当前模型' }
        : null;
}

function applySelectedVllmCatalogModel() {
    const model = getSelectedVllmCatalogModel();
    if (!model?.id) {
        return;
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
    if (elements.vllmModelCatalogStatus) {
        elements.vllmModelCatalogStatus.textContent =
            `已选择 ${model.id}。可以直接点击“自动配置并部署”，AILIS 会先诊断环境，再自动安装/配置 vLLM 并启动服务。`;
    }
    syncSaveButton();
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
    const summary = [];

    if (status === 'running') {
        summary.push('vLLM 正在自动配置/部署');
    } else if (status === 'ready') {
        summary.push('vLLM 已就绪');
    } else if (status === 'failed') {
        summary.push(`vLLM 部署失败：${runtime.failure?.message || runtime.failure?.code || 'unknown'}`);
    } else if (status === 'cancelled') {
        summary.push('vLLM 部署已取消');
    } else if (diagnosis) {
        summary.push(diagnosis.ok ? 'vLLM 环境已具备基础条件' : 'vLLM 环境需要配置');
    } else {
        summary.push('vLLM 本地运行时尚未诊断');
    }

    if (service?.ok) {
        summary.push(`服务已响应：${service.baseUrl}${service.modelIds?.length ? ` (${service.modelIds.join(', ')})` : ''}`);
    } else if (service?.baseUrl) {
        summary.push(`服务未就绪：${service.baseUrl}`);
    }
    if (wsl?.required) {
        summary.push(wsl.available ? `WSL：${wsl.distros?.join(', ') || '未发现发行版'}` : 'WSL：未就绪');
    }
    if (runtimeInfo?.available) {
        summary.push(runtimeInfo.pythonOk ? `Python：${runtimeInfo.pythonVersion || 'OK'}` : 'Python：未就绪');
        summary.push(runtimeInfo.vllmInstalled ? 'vLLM：已安装' : 'vLLM：未安装');
        summary.push(runtimeInfo.gpuInfo ? `GPU：${runtimeInfo.gpuInfo}` : 'GPU：未检测到 NVIDIA/CUDA');
    }
    if (steps.length) {
        summary.push(`计划：${steps.map((step) => step.title).join('；')}`);
    }
    elements.vllmRuntimeStatus.textContent = summary.join(' | ');

    if (elements.vllmRuntimeLog) {
        elements.vllmRuntimeLog.textContent = (runtime?.logLines || []).slice(-28).join('\n');
    }
    if (elements.vllmRuntimeDeployBtn) {
        elements.vllmRuntimeDeployBtn.disabled = status === 'running';
        elements.vllmRuntimeDeployBtn.textContent = status === 'running' ? '部署中...' : '自动配置并部署';
    }
    if (elements.vllmRuntimeCancelBtn) {
        elements.vllmRuntimeCancelBtn.disabled = status !== 'running';
    }
}

async function refreshVllmRuntimeStatus({ diagnose = false, silent = false } = {}) {
    if (!window.ailisDesktop?.vllmRuntime) {
        return null;
    }
    if (!silent) {
        setStatus(diagnose ? '正在诊断 vLLM 本地运行时...' : '正在读取 vLLM 部署状态...');
    }
    try {
        const result = diagnose
            ? await window.ailisDesktop.vllmRuntime.diagnose({ host: '127.0.0.1', port: 8000 })
            : await window.ailisDesktop.vllmRuntime.getStatus();
        const runtime = diagnose
            ? {
                ...(panelState?.vllmRuntime || {}),
                diagnosis: result,
                installPlan: result.installPlan,
                baseUrl: result.service?.baseUrl || getProviderDefaultBaseUrl('vllm'),
                status: result.service?.ok ? 'ready' : (panelState?.vllmRuntime?.status || 'idle')
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

async function deploySelectedVllmModel() {
    if (!window.ailisDesktop?.vllmRuntime?.deploy) {
        setStatus('当前环境不支持 vLLM 自动部署。');
        return;
    }
    applySelectedVllmCatalogModel();
    const model = getSelectedVllmCatalogModel();
    const modelId = model?.id || elements.llmModel?.value?.trim();
    if (!modelId) {
        setStatus('请先选择或填写一个 vLLM 模型 ID。');
        return;
    }
    const diagnosisRuntime = await refreshVllmRuntimeStatus({ diagnose: true, silent: true });
    const steps = diagnosisRuntime?.installPlan?.steps || diagnosisRuntime?.diagnosis?.installPlan?.steps || [];
    if (steps.length) {
        const confirmed = window.confirm(
            `AILIS 将自动配置 vLLM 环境并部署 ${modelId}。\n\n` +
            `可能包含：${steps.map((step) => step.title).join('；')}。\n\n` +
            '这可能需要较长时间、较大下载量和 GPU/WSL 环境。继续吗？'
        );
        if (!confirmed) {
            return;
        }
    }
    setStatus(`正在自动配置并部署 vLLM：${modelId}`);
    try {
        const runtime = await window.ailisDesktop.vllmRuntime.deploy({
            source: model?.source || elements.vllmModelSource?.value || 'modelscope',
            modelId,
            host: '127.0.0.1',
            port: 8000,
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

function syncLlmPresetSelectionFromFields() {
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
    syncVllmModelCatalogPanel({ maybeRefresh: true });
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
    syncVllmModelCatalogPanel({ maybeRefresh: preset.id === 'vllm' });
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
        renderLlmHealthState({
            ok: false,
            checks: {},
            summary: '当前桌面宿主不支持模型检测。'
        });
        return;
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
    } catch (error) {
        renderLlmHealthState({
            ok: false,
            checks: {},
            summary: `模型检测失败：${error.message || error}`
        });
    } finally {
        elements.llmHealthCheckBtn.disabled = false;
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
    elements.llmProvider.value = normalized.llmProvider;
    lastLlmProviderValue = normalized.llmProvider;
    elements.llmBaseUrl.value = normalized.llmBaseUrl;
    elements.llmModel.value = normalized.llmModel;
    elements.llmApiKey.value = '';
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
}

function renderAILISStatus(status = {}) {
    if (!elements.openclawStatusText || !elements.openclawRuntimeText) {
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

    if (humanGateway.running) {
        elements.openclawStatusText.textContent = `AILIS Gateway 已运行（${humanGateway.url || `:${humanGateway.port || ''}`}）`;
    } else if (resolvedStatus.lastError) {
        elements.openclawStatusText.textContent = resolvedStatus.lastError;
    } else {
        elements.openclawStatusText.textContent = 'AILIS Gateway 尚未启动。';
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
        typeof humanGateway.openClawToolSurfaceValidation?.ok === 'boolean'
            ? humanGateway.openClawToolSurfaceValidation.ok
                ? `tools: 已对齐 (${humanGateway.openClawToolSurfaceValidation.coreToolCount || 0} core)`
                : `tools: 校验失败 (${humanGateway.openClawToolSurfaceValidation.issueCount || 0} 项)`
            : typeof toolValidation.ok === 'boolean'
            ? toolValidation.ok
                ? `tools: 已对齐 (${toolValidation.coreToolCount || 0} core)`
                : `tools: 校验失败 (${toolValidation.issueCount || 0} 项)`
            : ''
    ].filter(Boolean);

    elements.openclawRuntimeText.textContent = statusBits.join(' | ');
}

async function refreshOpenClawStatus() {
    if (!elements.openclawStatusText || !elements.openclawRuntimeText) {
        return;
    }

    if (!window.ailisDesktop?.gateway?.getStatus) {
        elements.openclawStatusText.textContent = '当前环境不支持 AILIS Gateway。';
        elements.openclawRuntimeText.textContent = '';
        return;
    }

    try {
        renderAILISStatus(await window.ailisDesktop.gateway.getStatus());
    } catch (error) {
        elements.openclawStatusText.textContent = `读取 AILIS 状态失败：${error.message || error}`;
        elements.openclawRuntimeText.textContent = '';
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

function renderVoiceRuntimeStatus(runtime = {}) {
    if (!elements.voiceRuntimeStatus || !elements.voiceRuntimePlan) {
        return;
    }

    if (!runtime || runtime.status === 'not_diagnosed') {
        elements.voiceRuntimeStatus.textContent = '本地语音运行时尚未诊断。';
        elements.voiceRuntimePlan.textContent = '';
        if (elements.voiceRuntimeBootstrapBtn) {
            elements.voiceRuntimeBootstrapBtn.disabled = true;
        }
        return;
    }

    const cosyReady = runtime.cosyVoice3?.ok ? 'CosyVoice3 就绪' : 'CosyVoice3 未就绪';
    const asrReady = runtime.asr?.ok ? 'ASR 就绪' : 'ASR 未就绪';
    const backend = runtime.cosyVoice3?.acceleration?.backend || '未知后端';
    const python = runtime.preferredPython
        ? `Python: ${compactPath(runtime.preferredPython)}`
        : 'Python: 未就绪';
    elements.voiceRuntimeStatus.textContent = [
        runtime.ok ? '运行时已就绪' : '运行时需要修复',
        cosyReady,
        asrReady,
        backend,
        python
    ].join(' | ');

    const steps = runtime.installPlan?.steps || [];
    elements.voiceRuntimePlan.textContent = steps.length
        ? `待修复 ${steps.length} 项：${steps.map((step) => step.title).join('；')}`
        : '没有待处理安装项。';

    const bootstrapStatus = runtime.bootstrap?.status || '';
    if (elements.voiceRuntimeBootstrapBtn) {
        elements.voiceRuntimeBootstrapBtn.disabled = !steps.length || bootstrapStatus === 'running';
        elements.voiceRuntimeBootstrapBtn.textContent = bootstrapStatus === 'running'
            ? '修复中...'
            : '一键修复';
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
            const summary = {
                ...(panelState?.voiceRuntime || {}),
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
            cosyVoice3: result.cosyVoice3,
            asr: result.asr,
            preferredPython: result.selectedPython?.command || '',
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

async function bootstrapVoiceRuntime() {
    if (!window.ailisDesktop?.voiceRuntime?.bootstrap) {
        setStatus('当前环境不支持本地语音运行时自动修复。');
        return;
    }
    const runtime = panelState?.voiceRuntime || {};
    const steps = runtime.installPlan?.steps || [];
    const needsNetwork = steps.some((step) => step.requiresNetwork);
    if (needsNetwork) {
        const confirmed = window.confirm(
            '本地语音运行时修复需要联网下载 Python、依赖或模型，体积可能较大。继续吗？'
        );
        if (!confirmed) {
            return;
        }
    }

    elements.voiceRuntimeBootstrapBtn.disabled = true;
    elements.voiceRuntimeBootstrapBtn.textContent = '修复中...';
    setStatus('正在自动修复本地语音运行时，这可能需要一些时间...');

    try {
        const result = await window.ailisDesktop.voiceRuntime.bootstrap({
            allowNetwork: true
        });
        if (!result.ok) {
            const failedStep = (result.steps || []).find((step) => step.status === 'failed');
            setStatus(`本地语音运行时修复未完成：${failedStep?.error || result.error || result.status}`);
        } else {
            setStatus('本地语音运行时修复完成。');
        }
        await refreshVoiceRuntimeStatus({ diagnose: true, silent: true });
    } catch (error) {
        setStatus(`本地语音运行时修复失败：${error.message || error}`);
    } finally {
        elements.voiceRuntimeBootstrapBtn.textContent = '一键修复';
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
    const maxAgentSteps = Math.max(1, Math.min(Number(elements.agentLabMaxSteps?.value || 12), 80));
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
        setStatus('当前环境不支持保存桌面配置。');
        return;
    }

    saveInFlight = true;
    syncSaveButton();
    setStatus('正在保存设置...');

    try {
        const savedPreferences = await window.ailisDesktop.savePreferences(
            readFormPreferences({ includeSecret: true })
        );
        pendingClearLlmKey = false;
        pendingClearElevenLabsKey = false;
        fillForm(savedPreferences);
        await refreshOpenClawStatus();
        setStatus('设置已保存，桌宠与聊天窗已同步刷新。');
    } catch (error) {
        setStatus(`保存失败：${error.message || error}`);
    } finally {
        saveInFlight = false;
        syncSaveButton();
    }
}

async function restoreDefaults() {
    if (!window.ailisDesktop?.restoreDefaultPreferences) {
        setStatus('当前环境不支持恢复默认配置。');
        return;
    }

    const confirmed = window.confirm('恢复默认后会覆盖当前面板中的设置，继续吗？');
    if (!confirmed) {
        return;
    }

    saveInFlight = true;
    syncSaveButton();
    setStatus('正在恢复默认设置...');

    try {
        const restoredPreferences = await window.ailisDesktop.restoreDefaultPreferences();
        pendingClearLlmKey = false;
        pendingClearElevenLabsKey = false;
        fillForm(restoredPreferences);
        await refreshOpenClawStatus();
        setStatus('默认设置已恢复。');
    } catch (error) {
        setStatus(`恢复默认失败：${error.message || error}`);
    } finally {
        saveInFlight = false;
        syncSaveButton();
    }
}

async function initialize() {
    if (!window.ailisDesktop?.getControlPanelState) {
        setStatus('当前页面只能在 AILIS 桌面版里使用。');
        return;
    }

    setStatus('正在读取当前配置...');

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
        fillScaleOptions(panelState.options?.petScaleOptions || []);
        fillSpeechModeOptions(panelState.options?.speechModeOptions || []);
        fillRecognitionModeOptions(panelState.options?.recognitionModeOptions || ['fast-vad', 'auto-vad', 'continuous', 'manual']);
        fillConversationModeOptions(panelState.options?.conversationModeOptions || ['assistant', 'daily']);
        fillLlmProviderOptions(panelState.options?.llmProviderOptions || ['openai-compatible']);
        fillLlmPresetOptions();
        fillRenderProfileOptions(panelState.options?.renderProfileOptions || Object.keys(renderProfileLabels));
        fillForm(panelState.preferences || {});
        renderAILISStatus(panelState.assistant?.humanGateway || panelState.assistant || {});
        renderVoiceRuntimeStatus(panelState.voiceRuntime || {});
        renderVllmRuntimeStatus(panelState.vllmRuntime || {});

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
            elements.packageStateText.textContent = panelState.environment?.isPackaged
                ? '已从安装包或便携版启动'
                : '开发模式运行中';
        }

        await refreshMicrophones();
        await refreshOpenClawStatus();
        await refreshMemoryStatus();
        void refreshVoiceRuntimeStatus({ diagnose: true, silent: true });
        void refreshVllmRuntimeStatus({ diagnose: true, silent: true });
        setStatus('配置已就绪。修改后点击右下角保存。');
    } catch (error) {
        setStatus(`读取配置失败：${error.message || error}`);
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
    elements.ttsVolume
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

elements.llmPreset?.addEventListener('change', () => {
    applyLlmPreset(elements.llmPreset.value);
    syncVllmModelCatalogPanel({ maybeRefresh: elements.llmPreset.value === 'vllm' });
    updateRangeLabels();
    syncSaveButton();
});

elements.llmModelPreset?.addEventListener('change', () => {
    if (elements.llmModelPreset.value !== LLM_PRESET_CUSTOM_ID) {
        elements.llmModel.value = elements.llmModelPreset.value;
        renderLlmCapabilityState();
        renderLlmHealthState(null);
    }
    syncSaveButton();
});

elements.vllmModelRefreshBtn?.addEventListener('click', () => {
    void refreshVllmModelCatalog();
});

elements.vllmModelApplyBtn?.addEventListener('click', () => {
    applySelectedVllmCatalogModel();
});

elements.vllmRuntimeDiagnoseBtn?.addEventListener('click', () => {
    void refreshVllmRuntimeStatus({ diagnose: true });
});

elements.vllmRuntimeDeployBtn?.addEventListener('click', () => {
    void deploySelectedVllmModel();
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
    syncLlmPresetSelectionFromFields();
    syncLlmKeyState();
    renderLlmCapabilityState();
    renderLlmHealthState(null);
    syncVllmModelCatalogPanel({ maybeRefresh: nextProvider === 'vllm' });
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
    pendingClearLlmKey = Boolean(currentPreferences?.llmApiKeyConfigured);
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
    void refreshVoiceRuntimeStatus({ diagnose: true });
});

elements.voiceRuntimeBootstrapBtn?.addEventListener('click', () => {
    void bootstrapVoiceRuntime();
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
    void refreshOpenClawStatus();
    void refreshMemoryStatus();
    setStatus('已同步外部配置更新。');
});

window.ailisDesktop?.gateway?.onEvent?.((event = {}) => {
    if (/^(gateway|agent|tool)\./.test(event.type || '')) {
        void refreshOpenClawStatus();
    }
    if (/^agent\.memory\./.test(event.type || '')) {
        void refreshMemoryStatus();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    updateRangeLabels();
    void initialize();
});

navigator.mediaDevices?.addEventListener?.('devicechange', () => {
    void refreshMicrophones();
});
