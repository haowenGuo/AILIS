const fs = require('fs');
const path = require('path');
const { screen } = require('electron');

const STATE_FILE_NAME = 'desktop-state.json';
const STATE_VERSION = 16;
const PET_BASE_WIDTH = 360;
const PET_BASE_HEIGHT = 560;
const PET_SCALE_OPTIONS = [0.3, 0.4, 0.5, 0.6, 0.7, 0.85, 1, 1.15];
const DEFAULT_PET_SCALE = 0.85;
const SPEECH_MODE_OPTIONS = ['cosyvoice3', 'kokoro', 'local', 'server', 'vits', 'off'];
const RECOGNITION_MODE_OPTIONS = ['auto-vad', 'continuous', 'manual'];
const BACKEND_MODE_OPTIONS = ['humanclaw'];
const DEFAULT_BACKEND_BASE_URL = '';
const DEFAULT_BACKEND_MODE = 'humanclaw';
const DEFAULT_OPENCLAW_GATEWAY_URL = 'ws://127.0.0.1:19011';
const DEFAULT_HUMANCLAW_STATE_DIR = '';
const LLM_PROVIDER_OPTIONS = ['openai-compatible'];
const DEFAULT_LLM_PROVIDER = 'openai-compatible';
const DEFAULT_LLM_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';
const DEFAULT_LLM_MODEL = 'doubao-seed-2-0-mini-260215';
const DEFAULT_LLM_API_KEY = '';
const DEFAULT_LLM_TEMPERATURE = 0.8;
const DEFAULT_LLM_REQUEST_TIMEOUT_MS = 25000;
const DEFAULT_ELEVENLABS_API_BASE = 'https://api.elevenlabs.io';
const DEFAULT_ELEVENLABS_API_KEY = '';
const DEFAULT_ELEVENLABS_VOICE_ID = '';
const DEFAULT_ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';
const DEFAULT_ELEVENLABS_OUTPUT_FORMAT = 'mp3_44100_128';
const DEFAULT_ELEVENLABS_TIMEOUT_MS = 60000;
const DEFAULT_COMPUTER_CONTROL_ENABLED = true;
const DEFAULT_CAMERA_DISTANCE = 1.1;
const DEFAULT_CAMERA_HEIGHT = 1.3;
const DEFAULT_CAMERA_TARGET_Y = 1;
const DEFAULT_DESKTOP_NATIVE_TTS_RATE = 0.96;
const DEFAULT_DESKTOP_NATIVE_TTS_PITCH = 1.12;
const DEFAULT_DESKTOP_NATIVE_TTS_VOLUME = 1;
const DEFAULT_AUTO_CHAT_ENABLED = false;
const DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC = 60;
const DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC = 120;
const DEFAULT_AVATAR_DIALOGUE_BUBBLE_LEFT = 8;
const DEFAULT_AVATAR_DIALOGUE_BUBBLE_TOP = 8;
const DEFAULT_AVATAR_DIALOGUE_BUBBLE_SCALE = 1;
const DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH = 220;
const DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP = 190;
const EMAIL_PROVIDER_OPTIONS = ['qq', 'gmail', 'outlook'];
const DEFAULT_EMAIL_PROFILES = Object.freeze({
    qq: Object.freeze({ account: '', secret: '', authType: 'password' }),
    gmail: Object.freeze({ account: '', secret: '', authType: 'password' }),
    outlook: Object.freeze({ account: '', secret: '', authType: 'password' })
});

function clampNumber(value, minimum, maximum, fallbackValue, digits = 2) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }

    const clampedValue = Math.min(Math.max(numericValue, minimum), maximum);
    return Number(clampedValue.toFixed(digits));
}

function normalizeBoolean(value, fallbackValue = false) {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase();
        if (['true', '1', 'yes', 'on'].includes(normalizedValue)) {
            return true;
        }
        if (['false', '0', 'no', 'off'].includes(normalizedValue)) {
            return false;
        }
    }

    return fallbackValue;
}

function normalizePreferredMicDeviceId(deviceId) {
    return String(deviceId || '').trim();
}

function normalizeBackendBaseUrl(value) {
    const normalizedValue = String(value || '').trim().replace(/\/+$/, '');
    return normalizedValue || DEFAULT_BACKEND_BASE_URL;
}

function normalizeBackendMode(mode) {
    return DEFAULT_BACKEND_MODE;
}

function normalizeOpenClawGatewayUrl(value) {
    const normalizedValue = String(value || '').trim();
    if (!normalizedValue) {
        return DEFAULT_OPENCLAW_GATEWAY_URL;
    }
    if (/^wss?:\/\//i.test(normalizedValue)) {
        return normalizedValue;
    }
    if (/^https?:\/\//i.test(normalizedValue)) {
        return normalizedValue.replace(/^http/i, 'ws');
    }
    return `ws://${normalizedValue}`;
}

function normalizeHumanClawStateDir(value) {
    return String(value || '').trim().replace(/^["']|["']$/g, '');
}

function normalizeLlmProvider(provider) {
    const normalizedProvider = String(provider || '').trim().toLowerCase();
    return LLM_PROVIDER_OPTIONS.includes(normalizedProvider)
        ? normalizedProvider
        : DEFAULT_LLM_PROVIDER;
}

function normalizeLlmBaseUrl(value) {
    const normalizedValue = String(value || '').trim().replace(/\/+$/, '');
    return normalizedValue || DEFAULT_LLM_BASE_URL;
}

function normalizeLlmModel(value) {
    const normalizedValue = String(value || '').trim();
    return normalizedValue || DEFAULT_LLM_MODEL;
}

function normalizeLlmApiKey(value) {
    return String(value || '').trim();
}

function normalizeElevenLabsApiBase(value) {
    const normalizedValue = String(value || '').trim().replace(/\/+$/, '');
    return normalizedValue || DEFAULT_ELEVENLABS_API_BASE;
}

function normalizeElevenLabsApiKey(value) {
    return String(value || '').trim();
}

function normalizeElevenLabsVoiceId(value) {
    return String(value || '').trim();
}

function normalizeElevenLabsModelId(value) {
    const normalizedValue = String(value || '').trim();
    return normalizedValue || DEFAULT_ELEVENLABS_MODEL_ID;
}

function normalizeElevenLabsOutputFormat(value) {
    const normalizedValue = String(value || '').trim();
    return normalizedValue || DEFAULT_ELEVENLABS_OUTPUT_FORMAT;
}

function normalizeElevenLabsTimeoutMs(value) {
    return Math.round(clampNumber(value, 5000, 120000, DEFAULT_ELEVENLABS_TIMEOUT_MS, 0));
}

function normalizeLlmTemperature(value) {
    return clampNumber(value, 0, 2, DEFAULT_LLM_TEMPERATURE);
}

function normalizeLlmRequestTimeoutMs(value) {
    return Math.round(clampNumber(value, 5000, 120000, DEFAULT_LLM_REQUEST_TIMEOUT_MS, 0));
}

function normalizeComputerControlEnabled(value) {
    return normalizeBoolean(value, DEFAULT_COMPUTER_CONTROL_ENABLED);
}

function normalizeEmailAuthType(value) {
    const normalizedValue = String(value || '').trim().toLowerCase();
    return ['password', 'oauth2'].includes(normalizedValue) ? normalizedValue : 'password';
}

function normalizeEmailProfiles(value = {}) {
    const source = value && typeof value === 'object' ? value : {};
    return Object.fromEntries(
        EMAIL_PROVIDER_OPTIONS.map((providerId) => {
            const profile = source[providerId] && typeof source[providerId] === 'object'
                ? source[providerId]
                : {};
            return [
                providerId,
                {
                    account: String(profile.account || profile.email || '').trim(),
                    secret: String(
                        profile.secret ||
                            profile.password ||
                            profile.appPassword ||
                            profile.authCode ||
                            profile.accessToken ||
                            ''
                    ).trim(),
                    authType: normalizeEmailAuthType(profile.authType || profile.auth?.type)
                }
            ];
        })
    );
}

function normalizeSpeechMode(mode) {
    const normalizedMode = String(mode || '').trim().toLowerCase();
    return SPEECH_MODE_OPTIONS.includes(normalizedMode) ? normalizedMode : 'cosyvoice3';
}

function normalizeRecognitionMode(mode) {
    const normalizedMode = String(mode || '').trim().toLowerCase();
    return RECOGNITION_MODE_OPTIONS.includes(normalizedMode) ? normalizedMode : 'auto-vad';
}

function normalizePetScale(scale) {
    const numericScale = Number(scale);
    if (!Number.isFinite(numericScale)) {
        return DEFAULT_PET_SCALE;
    }

    return PET_SCALE_OPTIONS.reduce((closestScale, option) => {
        const nextDistance = Math.abs(option - numericScale);
        const closestDistance = Math.abs(closestScale - numericScale);
        return nextDistance < closestDistance ? option : closestScale;
    }, PET_SCALE_OPTIONS[0]);
}

function normalizeCameraDistance(value) {
    return clampNumber(value, 0.75, 1.8, DEFAULT_CAMERA_DISTANCE);
}

function normalizeCameraHeight(value) {
    return clampNumber(value, 0.7, 1.8, DEFAULT_CAMERA_HEIGHT);
}

function normalizeCameraTargetY(value) {
    return clampNumber(value, 0.5, 1.5, DEFAULT_CAMERA_TARGET_Y);
}

function normalizeDesktopNativeTTSRate(value) {
    return clampNumber(value, 0.6, 1.4, DEFAULT_DESKTOP_NATIVE_TTS_RATE);
}

function normalizeDesktopNativeTTSPitch(value) {
    return clampNumber(value, 0.6, 1.6, DEFAULT_DESKTOP_NATIVE_TTS_PITCH);
}

function normalizeDesktopNativeTTSVolume(value) {
    return clampNumber(value, 0, 1, DEFAULT_DESKTOP_NATIVE_TTS_VOLUME);
}

function normalizeAutoChatEnabled(value) {
    return false;
}

function normalizeAutoChatMinIntervalSec(value) {
    return Math.round(clampNumber(value, 15, 1800, DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC, 0));
}

function normalizeAutoChatMaxIntervalSec(value, minimum = DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC) {
    const normalizedValue = Math.round(
        clampNumber(value, minimum, 3600, DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC, 0)
    );
    return Math.max(minimum, normalizedValue);
}

function normalizeAvatarDialogueBubbleLeft(value) {
    return Math.round(clampNumber(value, 0, 640, DEFAULT_AVATAR_DIALOGUE_BUBBLE_LEFT, 0));
}

function normalizeAvatarDialogueBubbleTop(value) {
    return Math.round(clampNumber(value, 0, 480, DEFAULT_AVATAR_DIALOGUE_BUBBLE_TOP, 0));
}

function normalizeAvatarDialogueBubbleScale(value) {
    return clampNumber(value, 0.75, 1.35, DEFAULT_AVATAR_DIALOGUE_BUBBLE_SCALE, 2);
}

function normalizeAvatarDialogueBubbleExtraWidth(value) {
    return Math.round(clampNumber(value, 0, 520, DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH, 0));
}

function normalizeAvatarDialogueBubbleExtraTop(value) {
    return Math.round(clampNumber(value, 0, 360, DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP, 0));
}

function getScaledPetSize(scale = DEFAULT_PET_SCALE) {
    const normalizedScale = normalizePetScale(scale);
    return {
        width: Math.round(PET_BASE_WIDTH * normalizedScale),
        height: Math.round(PET_BASE_HEIGHT * normalizedScale)
    };
}

function resizePetBounds(bounds, scale = DEFAULT_PET_SCALE) {
    const nextSize = getScaledPetSize(scale);
    const centerX = bounds.x + bounds.width / 2;
    const bottomY = bounds.y + bounds.height;

    return {
        x: Math.round(centerX - nextSize.width / 2),
        y: Math.round(bottomY - nextSize.height),
        width: nextSize.width,
        height: nextSize.height
    };
}

function getDefaultState() {
    const workArea = screen.getPrimaryDisplay().workArea;
    const petScale = DEFAULT_PET_SCALE;
    const petSize = getScaledPetSize(petScale);
    const chatWidth = 420;
    const chatHeight = 620;
    const controlWidth = Math.min(980, workArea.width - 48);
    const controlHeight = Math.min(760, workArea.height - 48);

    const petX = workArea.x + workArea.width - petSize.width - 32;
    const petY = workArea.y + workArea.height - petSize.height - 24;
    const chatX = Math.max(workArea.x + 24, petX - chatWidth - 24);
    const chatY = Math.max(workArea.y + 24, petY + 32);

    return {
        version: STATE_VERSION,
        petWindow: {
            bounds: {
                x: petX,
                y: petY,
                width: petSize.width,
                height: petSize.height
            },
            visible: true
        },
        chatWindow: {
            bounds: {
                x: chatX,
                y: chatY,
                width: chatWidth,
                height: chatHeight
            },
            visible: false
        },
        controlWindow: {
            bounds: {
                x: Math.round(workArea.x + (workArea.width - controlWidth) / 2),
                y: Math.round(workArea.y + (workArea.height - controlHeight) / 2),
                width: controlWidth,
                height: controlHeight
            },
            visible: false
        },
        preferences: {
            petSkipTaskbar: true,
            petScale,
            speechMode: 'cosyvoice3',
            recognitionMode: 'auto-vad',
            preferredMicDeviceId: '',
            backendBaseUrl: DEFAULT_BACKEND_BASE_URL,
            backendMode: DEFAULT_BACKEND_MODE,
            openclawGatewayUrl: DEFAULT_OPENCLAW_GATEWAY_URL,
            humanClawStateDir: DEFAULT_HUMANCLAW_STATE_DIR,
            llmProvider: DEFAULT_LLM_PROVIDER,
            llmBaseUrl: DEFAULT_LLM_BASE_URL,
            llmModel: DEFAULT_LLM_MODEL,
            llmApiKey: DEFAULT_LLM_API_KEY,
            llmTemperature: DEFAULT_LLM_TEMPERATURE,
            llmRequestTimeoutMs: DEFAULT_LLM_REQUEST_TIMEOUT_MS,
            elevenLabsApiBase: DEFAULT_ELEVENLABS_API_BASE,
            elevenLabsApiKey: DEFAULT_ELEVENLABS_API_KEY,
            elevenLabsVoiceId: DEFAULT_ELEVENLABS_VOICE_ID,
            elevenLabsModelId: DEFAULT_ELEVENLABS_MODEL_ID,
            elevenLabsOutputFormat: DEFAULT_ELEVENLABS_OUTPUT_FORMAT,
            elevenLabsTimeoutMs: DEFAULT_ELEVENLABS_TIMEOUT_MS,
            computerControlEnabled: DEFAULT_COMPUTER_CONTROL_ENABLED,
            cameraDistance: DEFAULT_CAMERA_DISTANCE,
            cameraHeight: DEFAULT_CAMERA_HEIGHT,
            cameraTargetY: DEFAULT_CAMERA_TARGET_Y,
            desktopNativeTtsRate: DEFAULT_DESKTOP_NATIVE_TTS_RATE,
            desktopNativeTtsPitch: DEFAULT_DESKTOP_NATIVE_TTS_PITCH,
            desktopNativeTtsVolume: DEFAULT_DESKTOP_NATIVE_TTS_VOLUME,
            autoChatEnabled: DEFAULT_AUTO_CHAT_ENABLED,
            autoChatMinIntervalSec: DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC,
            autoChatMaxIntervalSec: DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC,
            avatarDialogueBubbleLeft: DEFAULT_AVATAR_DIALOGUE_BUBBLE_LEFT,
            avatarDialogueBubbleTop: DEFAULT_AVATAR_DIALOGUE_BUBBLE_TOP,
            avatarDialogueBubbleScale: DEFAULT_AVATAR_DIALOGUE_BUBBLE_SCALE,
            avatarDialogueBubbleExtraWidth: DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH,
            avatarDialogueBubbleExtraTop: DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP,
            emailProfiles: normalizeEmailProfiles(DEFAULT_EMAIL_PROFILES)
        }
    };
}

function getStateFilePath(app) {
    return path.join(app.getPath('userData'), STATE_FILE_NAME);
}

function normalizeState(inputState) {
    const defaults = getDefaultState();
    const nextState = inputState && typeof inputState === 'object' ? inputState : {};

    const normalizedState = {
        ...defaults,
        ...nextState,
        petWindow: {
            ...defaults.petWindow,
            ...(nextState.petWindow || {}),
            bounds: {
                ...defaults.petWindow.bounds,
                ...(nextState.petWindow?.bounds || {})
            }
        },
        chatWindow: {
            ...defaults.chatWindow,
            ...(nextState.chatWindow || {}),
            bounds: {
                ...defaults.chatWindow.bounds,
                ...(nextState.chatWindow?.bounds || {})
            }
        },
        controlWindow: {
            ...defaults.controlWindow,
            ...(nextState.controlWindow || {}),
            bounds: {
                ...defaults.controlWindow.bounds,
                ...(nextState.controlWindow?.bounds || {})
            }
        },
        preferences: {
            ...defaults.preferences,
            ...(nextState.preferences || {})
        }
    };

    if ((nextState.version || 0) < 8 && normalizedState.preferences.speechMode === 'local') {
        normalizedState.preferences.speechMode = 'server';
    }
    if ((nextState.version || 0) < 10 && normalizedState.preferences.speechMode === 'server') {
        normalizedState.preferences.speechMode = 'vits';
    }
    if ((nextState.version || 0) < 11 && normalizedState.preferences.speechMode === 'vits') {
        normalizedState.preferences.speechMode = 'server';
    }
    if ((nextState.version || 0) < 12 && normalizedState.preferences.speechMode === 'server') {
        normalizedState.preferences.speechMode = 'local';
    }
    if ((nextState.version || 0) < 13 && normalizedState.preferences.speechMode === 'local') {
        normalizedState.preferences.speechMode = 'cosyvoice3';
    }
    if ((nextState.version || 0) < 15 && normalizedState.preferences.recognitionMode === 'manual') {
        normalizedState.preferences.recognitionMode = 'auto-vad';
    }

    normalizedState.preferences.petScale = normalizePetScale(normalizedState.preferences.petScale);
    normalizedState.preferences.speechMode = normalizeSpeechMode(normalizedState.preferences.speechMode);
    normalizedState.preferences.recognitionMode = normalizeRecognitionMode(normalizedState.preferences.recognitionMode);
    normalizedState.preferences.preferredMicDeviceId = normalizePreferredMicDeviceId(
        normalizedState.preferences.preferredMicDeviceId
    );
    normalizedState.preferences.backendBaseUrl = normalizeBackendBaseUrl(
        normalizedState.preferences.backendBaseUrl
    );
    normalizedState.preferences.backendMode = normalizeBackendMode(
        normalizedState.preferences.backendMode
    );
    normalizedState.preferences.openclawGatewayUrl = normalizeOpenClawGatewayUrl(
        normalizedState.preferences.openclawGatewayUrl
    );
    normalizedState.preferences.humanClawStateDir = normalizeHumanClawStateDir(
        normalizedState.preferences.humanClawStateDir
    );
    normalizedState.preferences.llmProvider = normalizeLlmProvider(
        normalizedState.preferences.llmProvider
    );
    normalizedState.preferences.llmBaseUrl = normalizeLlmBaseUrl(
        normalizedState.preferences.llmBaseUrl
    );
    normalizedState.preferences.llmModel = normalizeLlmModel(
        normalizedState.preferences.llmModel
    );
    normalizedState.preferences.llmApiKey = normalizeLlmApiKey(
        normalizedState.preferences.llmApiKey
    );
    normalizedState.preferences.llmTemperature = normalizeLlmTemperature(
        normalizedState.preferences.llmTemperature
    );
    normalizedState.preferences.llmRequestTimeoutMs = normalizeLlmRequestTimeoutMs(
        normalizedState.preferences.llmRequestTimeoutMs
    );
    normalizedState.preferences.elevenLabsApiBase = normalizeElevenLabsApiBase(
        normalizedState.preferences.elevenLabsApiBase
    );
    normalizedState.preferences.elevenLabsApiKey = normalizeElevenLabsApiKey(
        normalizedState.preferences.elevenLabsApiKey
    );
    normalizedState.preferences.elevenLabsVoiceId = normalizeElevenLabsVoiceId(
        normalizedState.preferences.elevenLabsVoiceId
    );
    normalizedState.preferences.elevenLabsModelId = normalizeElevenLabsModelId(
        normalizedState.preferences.elevenLabsModelId
    );
    normalizedState.preferences.elevenLabsOutputFormat = normalizeElevenLabsOutputFormat(
        normalizedState.preferences.elevenLabsOutputFormat
    );
    normalizedState.preferences.elevenLabsTimeoutMs = normalizeElevenLabsTimeoutMs(
        normalizedState.preferences.elevenLabsTimeoutMs
    );
    normalizedState.preferences.computerControlEnabled = normalizeComputerControlEnabled(
        normalizedState.preferences.computerControlEnabled
    );
    normalizedState.preferences.emailProfiles = normalizeEmailProfiles(
        normalizedState.preferences.emailProfiles
    );
    normalizedState.preferences.cameraDistance = normalizeCameraDistance(
        normalizedState.preferences.cameraDistance
    );
    normalizedState.preferences.cameraHeight = normalizeCameraHeight(
        normalizedState.preferences.cameraHeight
    );
    normalizedState.preferences.cameraTargetY = normalizeCameraTargetY(
        normalizedState.preferences.cameraTargetY
    );
    normalizedState.preferences.desktopNativeTtsRate = normalizeDesktopNativeTTSRate(
        normalizedState.preferences.desktopNativeTtsRate
    );
    normalizedState.preferences.desktopNativeTtsPitch = normalizeDesktopNativeTTSPitch(
        normalizedState.preferences.desktopNativeTtsPitch
    );
    normalizedState.preferences.desktopNativeTtsVolume = normalizeDesktopNativeTTSVolume(
        normalizedState.preferences.desktopNativeTtsVolume
    );
    normalizedState.preferences.autoChatEnabled = normalizeAutoChatEnabled(
        normalizedState.preferences.autoChatEnabled
    );
    normalizedState.preferences.autoChatMinIntervalSec = normalizeAutoChatMinIntervalSec(
        normalizedState.preferences.autoChatMinIntervalSec
    );
    normalizedState.preferences.autoChatMaxIntervalSec = normalizeAutoChatMaxIntervalSec(
        normalizedState.preferences.autoChatMaxIntervalSec,
        normalizedState.preferences.autoChatMinIntervalSec
    );
    normalizedState.preferences.avatarDialogueBubbleLeft = normalizeAvatarDialogueBubbleLeft(
        normalizedState.preferences.avatarDialogueBubbleLeft
    );
    normalizedState.preferences.avatarDialogueBubbleTop = normalizeAvatarDialogueBubbleTop(
        normalizedState.preferences.avatarDialogueBubbleTop
    );
    normalizedState.preferences.avatarDialogueBubbleScale = normalizeAvatarDialogueBubbleScale(
        normalizedState.preferences.avatarDialogueBubbleScale
    );
    normalizedState.preferences.avatarDialogueBubbleExtraWidth = normalizeAvatarDialogueBubbleExtraWidth(
        normalizedState.preferences.avatarDialogueBubbleExtraWidth
    );
    normalizedState.preferences.avatarDialogueBubbleExtraTop = normalizeAvatarDialogueBubbleExtraTop(
        normalizedState.preferences.avatarDialogueBubbleExtraTop
    );

    if ((nextState.version || 0) < STATE_VERSION) {
        normalizedState.petWindow.bounds = resizePetBounds(
            normalizedState.petWindow.bounds,
            normalizedState.preferences.petScale
        );
    }

    normalizedState.version = STATE_VERSION;
    return normalizedState;
}

function loadDesktopState(app) {
    const filePath = getStateFilePath(app);
    try {
        if (!fs.existsSync(filePath)) {
            return getDefaultState();
        }
        const rawState = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
        return normalizeState(JSON.parse(rawState));
    } catch (error) {
        console.warn('⚠️ 读取桌宠状态失败，回退默认值：', error);
        return getDefaultState();
    }
}

function saveDesktopState(app, nextState) {
    const normalized = normalizeState(nextState);
    const filePath = getStateFilePath(app);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2), 'utf8');
    return normalized;
}

module.exports = {
    BACKEND_MODE_OPTIONS,
    DEFAULT_AUTO_CHAT_ENABLED,
    DEFAULT_AUTO_CHAT_MAX_INTERVAL_SEC,
    DEFAULT_AUTO_CHAT_MIN_INTERVAL_SEC,
    DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_TOP,
    DEFAULT_AVATAR_DIALOGUE_BUBBLE_EXTRA_WIDTH,
    DEFAULT_AVATAR_DIALOGUE_BUBBLE_LEFT,
    DEFAULT_AVATAR_DIALOGUE_BUBBLE_SCALE,
    DEFAULT_AVATAR_DIALOGUE_BUBBLE_TOP,
    DEFAULT_BACKEND_BASE_URL,
    DEFAULT_BACKEND_MODE,
    DEFAULT_CAMERA_DISTANCE,
    DEFAULT_CAMERA_HEIGHT,
    DEFAULT_CAMERA_TARGET_Y,
    DEFAULT_DESKTOP_NATIVE_TTS_PITCH,
    DEFAULT_DESKTOP_NATIVE_TTS_RATE,
    DEFAULT_DESKTOP_NATIVE_TTS_VOLUME,
    DEFAULT_LLM_API_KEY,
    DEFAULT_LLM_BASE_URL,
    DEFAULT_LLM_MODEL,
    DEFAULT_LLM_PROVIDER,
    DEFAULT_LLM_REQUEST_TIMEOUT_MS,
    DEFAULT_LLM_TEMPERATURE,
    DEFAULT_ELEVENLABS_API_BASE,
    DEFAULT_ELEVENLABS_API_KEY,
    DEFAULT_ELEVENLABS_MODEL_ID,
    DEFAULT_ELEVENLABS_OUTPUT_FORMAT,
    DEFAULT_ELEVENLABS_TIMEOUT_MS,
    DEFAULT_ELEVENLABS_VOICE_ID,
    DEFAULT_HUMANCLAW_STATE_DIR,
    DEFAULT_COMPUTER_CONTROL_ENABLED,
    DEFAULT_OPENCLAW_GATEWAY_URL,
    DEFAULT_PET_SCALE,
    EMAIL_PROVIDER_OPTIONS,
    LLM_PROVIDER_OPTIONS,
    PET_SCALE_OPTIONS,
    RECOGNITION_MODE_OPTIONS,
    SPEECH_MODE_OPTIONS,
    getDefaultState,
    getScaledPetSize,
    loadDesktopState,
    normalizeAutoChatEnabled,
    normalizeAutoChatMaxIntervalSec,
    normalizeAutoChatMinIntervalSec,
    normalizeAvatarDialogueBubbleExtraTop,
    normalizeAvatarDialogueBubbleExtraWidth,
    normalizeAvatarDialogueBubbleLeft,
    normalizeAvatarDialogueBubbleScale,
    normalizeAvatarDialogueBubbleTop,
    normalizeBackendBaseUrl,
    normalizeBackendMode,
    normalizeCameraDistance,
    normalizeCameraHeight,
    normalizeCameraTargetY,
    normalizeComputerControlEnabled,
    normalizeDesktopNativeTTSPitch,
    normalizeDesktopNativeTTSRate,
    normalizeDesktopNativeTTSVolume,
    normalizeElevenLabsApiBase,
    normalizeElevenLabsApiKey,
    normalizeElevenLabsModelId,
    normalizeElevenLabsOutputFormat,
    normalizeElevenLabsTimeoutMs,
    normalizeElevenLabsVoiceId,
    normalizeLlmApiKey,
    normalizeLlmBaseUrl,
    normalizeLlmModel,
    normalizeLlmProvider,
    normalizeLlmRequestTimeoutMs,
    normalizeLlmTemperature,
    normalizeEmailProfiles,
    normalizeOpenClawGatewayUrl,
    normalizeHumanClawStateDir,
    normalizePetScale,
    normalizePreferredMicDeviceId,
    normalizeRecognitionMode,
    normalizeSpeechMode,
    normalizeState,
    resizePetBounds,
    saveDesktopState
};
