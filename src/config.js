import * as THREE from 'three';
import { getLoadableMotionFiles } from './character/motion-intake-catalog.js';
import { DEFAULT_RENDER_PROFILE_ID, normalizeRenderProfileId } from './character/render-profiles.js';

const DEFAULT_BACKEND_BASE_URL = 'https://airi-backend.onrender.com';
const DEFAULT_DESKTOP_BACKEND_BASE_URL = '';
const DEFAULT_BACKEND_MODE = 'ailis';
const DEFAULT_SPEECH_MODE = 'off';
const DEFAULT_DESKTOP_SPEECH_MODE = 'off';
const DEFAULT_CAMERA_DISTANCE = 1.1;
const DEFAULT_CAMERA_HEIGHT = 1.3;
const DEFAULT_CAMERA_TARGET_Y = 1;
const DEFAULT_DESKTOP_NATIVE_TTS_RATE = 0.96;
const DEFAULT_DESKTOP_NATIVE_TTS_PITCH = 1.12;
const DEFAULT_DESKTOP_NATIVE_TTS_VOLUME = 1;
const DEFAULT_AUTO_CHAT_MIN_INTERVAL = 60000;
const DEFAULT_AUTO_CHAT_MAX_INTERVAL = 120000;
const DEFAULT_RENDER_LIGHT_YAW_DEG = 0;
const DEFAULT_RENDER_KEY_LIGHT_SCALE = 1;
const DEFAULT_RENDER_AMBIENT_FILL_SCALE = 1;
const DEFAULT_RENDER_OUTLINE_SCALE = 0.72;
const DEFAULT_RENDER_SHADOW_ENABLED = true;
const DEFAULT_RENDER_SHADOW_STRENGTH = 0.22;
const DEFAULT_RENDER_SHADOW_RANGE = 1.8;
const DEFAULT_RENDER_RESOLUTION_SCALE = 2;
const DEFAULT_RENDER_FPS_LIMIT = 60;
const DEFAULT_RENDER_SHADOW_QUALITY = 3;
const DEFAULT_RENDER_OUTLINE_ENABLED = true;
const DEFAULT_RENDER_ANTIALIAS_ENABLED = true;
const RENDER_FPS_LIMIT_OPTIONS = [24, 30, 45, 60];

function normalizeBackendBaseUrl(value, fallbackValue = DEFAULT_BACKEND_BASE_URL) {
    const normalizedValue = String(value || '').trim().replace(/\/+$/, '');
    return normalizedValue || fallbackValue;
}

function normalizeBackendMode(value) {
    return DEFAULT_BACKEND_MODE;
}

function normalizeSpeechMode(value, fallbackValue = DEFAULT_SPEECH_MODE) {
    const normalizedValue = String(value || '').trim().toLowerCase();
    if (['off', 'server', 'cosyvoice3'].includes(normalizedValue)) {
        return normalizedValue;
    }
    if (['elevenlabs', 'eleven-labs', 'eleven_labs', 'server_tts', 'cloud'].includes(normalizedValue)) {
        return 'server';
    }
    if (['cosyvoice', 'cosy-voice', 'cosy_voice'].includes(normalizedValue)) {
        return 'cosyvoice3';
    }
    return ['off', 'server', 'cosyvoice3'].includes(fallbackValue) ? fallbackValue : 'off';
}

function normalizeNumber(value, minimum, maximum, fallbackValue, digits = 2) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }

    const clampedValue = Math.min(Math.max(numericValue, minimum), maximum);
    return Number(clampedValue.toFixed(digits));
}

function normalizeDesktopBoolean(value, fallbackValue) {
    if (typeof value === 'boolean') {
        return value;
    }
    return fallbackValue;
}

function normalizeQualityLevel(value, fallbackValue = 3) {
    const numericValue = Math.round(Number(value));
    return [1, 2, 3].includes(numericValue) ? numericValue : fallbackValue;
}

function normalizeRenderResolutionScale(value, fallbackValue = DEFAULT_RENDER_RESOLUTION_SCALE) {
    return normalizeNumber(value, 0.5, 3, fallbackValue, 2);
}

function normalizeRenderFpsLimit(value, fallbackValue = DEFAULT_RENDER_FPS_LIMIT) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }
    return RENDER_FPS_LIMIT_OPTIONS.reduce((closestValue, optionValue) => (
        Math.abs(optionValue - numericValue) < Math.abs(closestValue - numericValue)
            ? optionValue
            : closestValue
    ), fallbackValue);
}

function qualityLevelToShadowMapSize(level) {
    return { 1: 512, 2: 1024, 3: 2048 }[normalizeQualityLevel(level)] || 2048;
}

function getDesktopPreferencesSnapshot() {
    if (typeof window === 'undefined') {
        return {};
    }
    return window.ailisDesktop?.preferences || {};
}

function getDesktopResourceUrl(relativePath) {
    if (typeof window === 'undefined') {
        return relativePath;
    }
    const resourceUrl = window.ailisDesktop?.resourceUrl;
    if (typeof resourceUrl !== 'function') {
        return relativePath;
    }
    try {
        return resourceUrl(relativePath);
    } catch {
        return relativePath;
    }
}

function getDesktopLoadableMotionFiles() {
    return getLoadableMotionFiles().map((fileInfo) => ({
        ...fileInfo,
        path: getDesktopResourceUrl(fileInfo.path)
    }));
}

function getRuntimeSettings() {
    if (typeof window === 'undefined') {
        return {
            backendBaseUrl: DEFAULT_BACKEND_BASE_URL,
            backendMode: DEFAULT_BACKEND_MODE,
            demoModeEnabled: false,
            isGitHubPages: false,
            speechMode: DEFAULT_SPEECH_MODE,
            desktopPreferences: {}
        };
    }

    const desktopPreferences = getDesktopPreferencesSnapshot();
    const isDesktopRuntime = window.ailisDesktop?.platform === 'electron';
    const url = new URL(window.location.href);
    const queryBackend = url.searchParams.get('backend')?.trim();
    const forceDemo = url.searchParams.get('demo') === '1';
    const querySpeechMode = url.searchParams.get('speechMode')?.trim().toLowerCase();

    if (queryBackend) {
        window.localStorage.setItem('ailis_backend_base_url', queryBackend);
    }
    if (querySpeechMode) {
        window.localStorage.setItem('ailis_speech_mode', querySpeechMode);
    }

    const storedBackend = (
        window.localStorage.getItem('ailis_backend_base_url') ||
        window.localStorage.getItem('airi_backend_base_url')
    )?.trim();
    const storedSpeechMode = (
        window.localStorage.getItem('ailis_speech_mode') ||
        desktopPreferences.speechMode ||
        DEFAULT_SPEECH_MODE
    ).trim().toLowerCase();
    const isGitHubPages = window.location.hostname.endsWith('github.io');
    const demoModeEnabled = forceDemo || (isGitHubPages && !queryBackend && !storedBackend);

    const fallbackBackendBaseUrl = isDesktopRuntime
        ? DEFAULT_DESKTOP_BACKEND_BASE_URL
        : DEFAULT_BACKEND_BASE_URL;
    const fallbackSpeechMode = isDesktopRuntime
        ? DEFAULT_DESKTOP_SPEECH_MODE
        : DEFAULT_SPEECH_MODE;

    return {
        backendBaseUrl: normalizeBackendBaseUrl(
            desktopPreferences.backendBaseUrl || queryBackend || (isDesktopRuntime ? '' : storedBackend),
            fallbackBackendBaseUrl
        ),
        backendMode: normalizeBackendMode(
            desktopPreferences.backendMode || DEFAULT_BACKEND_MODE
        ),
        demoModeEnabled,
        isGitHubPages,
        speechMode: normalizeSpeechMode(
            querySpeechMode || desktopPreferences.speechMode || storedSpeechMode,
            fallbackSpeechMode
        ),
        desktopPreferences
    };
}

function applyBackendUrls(baseUrl) {
    const fallbackBackendBaseUrl = typeof window !== 'undefined' && window.ailisDesktop?.platform === 'electron'
        ? DEFAULT_DESKTOP_BACKEND_BASE_URL
        : DEFAULT_BACKEND_BASE_URL;
    CONFIG.BACKEND_BASE_URL = normalizeBackendBaseUrl(baseUrl, fallbackBackendBaseUrl);
    CONFIG.BACKEND_STREAM_API_URL = `${CONFIG.BACKEND_BASE_URL}/api/chat`;
    CONFIG.BACKEND_TTS_API_URL = `${CONFIG.BACKEND_BASE_URL}/api/chat/tts`;
    CONFIG.BACKEND_TTS_SYNTHESIZE_API_URL = `${CONFIG.BACKEND_BASE_URL}/api/tts/synthesize`;
    CONFIG.BACKEND_TEXT_API_URL = `${CONFIG.BACKEND_BASE_URL}/api/chat/text`;
}

function applyCameraSettings(preferences = {}) {
    const cameraDistance = normalizeNumber(
        preferences.cameraDistance,
        0.75,
        1.8,
        CONFIG.CAMERA_POSITION.z
    );
    const cameraHeight = normalizeNumber(
        preferences.cameraHeight,
        0.7,
        1.8,
        CONFIG.CAMERA_POSITION.y
    );
    const cameraTargetY = normalizeNumber(
        preferences.cameraTargetY,
        0.5,
        1.5,
        CONFIG.CAMERA_TARGET.y
    );

    CONFIG.CAMERA_POSITION.set(0, cameraHeight, cameraDistance);
    CONFIG.CAMERA_TARGET.set(0, cameraTargetY, 0);
    CONFIG.CAMERA_MIN_DISTANCE = Number(Math.max(0.55, cameraDistance - 0.35).toFixed(2));
    CONFIG.CAMERA_MAX_DISTANCE = Number(Math.min(2.2, cameraDistance + 0.45).toFixed(2));
}

function applyDesktopSpeechSettings(preferences = {}) {
    CONFIG.DESKTOP_NATIVE_TTS_RATE = normalizeNumber(
        preferences.desktopNativeTtsRate,
        0.6,
        1.4,
        CONFIG.DESKTOP_NATIVE_TTS_RATE
    );
    CONFIG.DESKTOP_NATIVE_TTS_PITCH = normalizeNumber(
        preferences.desktopNativeTtsPitch,
        0.6,
        1.6,
        CONFIG.DESKTOP_NATIVE_TTS_PITCH
    );
    CONFIG.DESKTOP_NATIVE_TTS_VOLUME = normalizeNumber(
        preferences.desktopNativeTtsVolume,
        0,
        1,
        CONFIG.DESKTOP_NATIVE_TTS_VOLUME
    );
}

function applyRenderProfileSettings(preferences = {}) {
    CONFIG.RENDER_PROFILE_ID = normalizeRenderProfileId(
        preferences.renderProfileId || CONFIG.RENDER_PROFILE_ID || DEFAULT_RENDER_PROFILE_ID
    );
}

function applyRenderLookSettings(preferences = {}) {
    CONFIG.RENDER_LOOK = {
        lightYawDeg: normalizeNumber(
            preferences.renderLightYawDeg,
            -75,
            75,
            CONFIG.RENDER_LOOK?.lightYawDeg ?? DEFAULT_RENDER_LIGHT_YAW_DEG,
            0
        ),
        keyLightScale: normalizeNumber(
            preferences.renderKeyLightScale,
            0.65,
            1.45,
            CONFIG.RENDER_LOOK?.keyLightScale ?? DEFAULT_RENDER_KEY_LIGHT_SCALE
        ),
        ambientFillScale: normalizeNumber(
            preferences.renderAmbientFillScale,
            0.55,
            1.35,
            CONFIG.RENDER_LOOK?.ambientFillScale ?? DEFAULT_RENDER_AMBIENT_FILL_SCALE
        ),
        outlineScale: normalizeNumber(
            preferences.renderOutlineScale,
            0.25,
            1.2,
            CONFIG.RENDER_LOOK?.outlineScale ?? DEFAULT_RENDER_OUTLINE_SCALE
        ),
        shadowEnabled: normalizeDesktopBoolean(
            preferences.renderShadowEnabled,
            CONFIG.RENDER_LOOK?.shadowEnabled ?? DEFAULT_RENDER_SHADOW_ENABLED
        ),
        shadowStrength: DEFAULT_RENDER_SHADOW_STRENGTH,
        shadowRange: DEFAULT_RENDER_SHADOW_RANGE
    };
}

function applyRenderQualitySettings(preferences = {}) {
    CONFIG.RENDER_RESOLUTION_SCALE = normalizeRenderResolutionScale(
        preferences.renderResolutionScale ?? DEFAULT_RENDER_RESOLUTION_SCALE
    );
    CONFIG.RENDER_FPS_LIMIT = normalizeRenderFpsLimit(
        preferences.renderFpsLimit ?? DEFAULT_RENDER_FPS_LIMIT
    );
    CONFIG.RENDER_SHADOW_MAP_SIZE = qualityLevelToShadowMapSize(
        preferences.renderShadowQuality ?? DEFAULT_RENDER_SHADOW_QUALITY
    );
    CONFIG.RENDER_OUTLINE_ENABLED = normalizeDesktopBoolean(
        preferences.renderOutlineEnabled,
        CONFIG.RENDER_OUTLINE_ENABLED ?? DEFAULT_RENDER_OUTLINE_ENABLED
    );
    CONFIG.RENDER_ANTIALIAS_ENABLED = normalizeDesktopBoolean(
        preferences.renderAntialiasEnabled,
        CONFIG.RENDER_ANTIALIAS_ENABLED ?? DEFAULT_RENDER_ANTIALIAS_ENABLED
    );
}

function applyAutoChatSettings(preferences = {}) {
    const minimumIntervalMs = Math.round(normalizeNumber(
        preferences.autoChatMinIntervalSec,
        15,
        1800,
        CONFIG.AUTO_CHAT_MIN_INTERVAL / 1000,
        0
    ) * 1000);
    const maximumIntervalMs = Math.round(normalizeNumber(
        preferences.autoChatMaxIntervalSec,
        minimumIntervalMs / 1000,
        3600,
        CONFIG.AUTO_CHAT_MAX_INTERVAL / 1000,
        0
    ) * 1000);

    CONFIG.AUTO_CHAT_ENABLED = false;
    CONFIG.AUTO_CHAT_MIN_INTERVAL = minimumIntervalMs;
    CONFIG.AUTO_CHAT_MAX_INTERVAL = Math.max(minimumIntervalMs, maximumIntervalMs);
}

const runtimeSettings = getRuntimeSettings();

export const CONFIG = {
    MODEL_PATH: getDesktopResourceUrl('Resources/AILIS_18.vrm'),
    ANIMATION_FILES: getDesktopLoadableMotionFiles(),
    IDLE_ACTION_LIST: ['idle', 'idle1', 'idle2'],
    DANCE_ACTION_LIST: ['vrma17', 'vrma25'],
    CROSS_FADE_DURATION: 0.4,
    RENDER_PIXEL_RATIO: 2,
    RENDER_RESOLUTION_SCALE: DEFAULT_RENDER_RESOLUTION_SCALE,
    RENDER_FPS_LIMIT: 60,
    RENDER_SHADOW_MAP_SIZE: 2048,
    RENDER_OUTLINE_ENABLED: DEFAULT_RENDER_OUTLINE_ENABLED,
    RENDER_ANTIALIAS_ENABLED: DEFAULT_RENDER_ANTIALIAS_ENABLED,
    CAMERA_POSITION: new THREE.Vector3(0, DEFAULT_CAMERA_HEIGHT, DEFAULT_CAMERA_DISTANCE),
    CAMERA_TARGET: new THREE.Vector3(0, DEFAULT_CAMERA_TARGET_Y, 0),
    CAMERA_MIN_DISTANCE: 0.85,
    CAMERA_MAX_DISTANCE: 1.5,
    BLINK_MIN_INTERVAL: 2800,
    BLINK_MAX_INTERVAL: 6500,
    SPEAK_SPEED: 5.2,
    SPEAK_AMPLITUDE: 0.46,
    MAX_MOUTH_OPEN: 0.95,
    LIP_SYNC_SMOOTHING: 0.32,
    AUDIO_LIP_SYNC_ANALYSER_SMOOTHING: 0.12,
    AUDIO_LIP_SYNC_NOISE_FLOOR: 0.012,
    AUDIO_LIP_SYNC_GAIN: 8.5,
    AUDIO_LIP_SYNC_ATTACK: 0.52,
    AUDIO_LIP_SYNC_RELEASE: 0.16,
    AUDIO_LIP_SYNC_SILENCE_THRESHOLD: 0.04,
    AUDIO_LIP_SYNC_MIN_CADENCE: 4.3,
    AUDIO_LIP_SYNC_MAX_CADENCE: 6.4,
    AUDIO_LIP_SYNC_SUSTAIN: 0.12,
    AUDIO_LIP_SYNC_PULSE_SHAPE: 0.72,
    AUDIO_LIP_SYNC_BOOST: 0.92,
    TEXT_SYNC_LEAD_SECONDS: 0.03,
    TEXT_ONLY_SPEECH_CHAR_MS: 85,
    TEXT_ONLY_SPEECH_MIN_MS: 1200,
    TEXT_ONLY_SPEECH_MAX_MS: 6500,
    EXPRESSION_RESET_DELAY_MS: 350,
    EXPRESSION_HOLD_MS: 2800,
    BLINK_EXPRESSION_HOLD_MS: 220,
    EXPRESSION_PRESETS: {
        happy: 0.4,
        angry: 0.55,
        sad: 0.72,
        relaxed: 0.65,
        surprised: 0.62,
        aa: 0.5,
        ih: 0.5,
        ou: 0.5,
        ee: 0.5,
        oh: 0.5,
        blink: 1.0,
        blinkLeft: 1.0,
        blinkRight: 1.0,
        neutral: 0.0
    },
    BACKEND_BASE_URL: runtimeSettings.backendBaseUrl,
    BACKEND_MODE: runtimeSettings.backendMode,
    DEMO_MODE_ENABLED: runtimeSettings.demoModeEnabled,
    IS_GITHUB_PAGES: runtimeSettings.isGitHubPages,
    BACKEND_STREAM_API_URL: `${runtimeSettings.backendBaseUrl}/api/chat`,
    BACKEND_TTS_API_URL: `${runtimeSettings.backendBaseUrl}/api/chat/tts`,
    BACKEND_TTS_SYNTHESIZE_API_URL: `${runtimeSettings.backendBaseUrl}/api/tts/synthesize`,
    BACKEND_TEXT_API_URL: `${runtimeSettings.backendBaseUrl}/api/chat/text`,
    SPEECH_MODE: runtimeSettings.speechMode,
    RENDER_PROFILE_ID: DEFAULT_RENDER_PROFILE_ID,
    RENDER_LOOK: {
        lightYawDeg: DEFAULT_RENDER_LIGHT_YAW_DEG,
        keyLightScale: DEFAULT_RENDER_KEY_LIGHT_SCALE,
        ambientFillScale: DEFAULT_RENDER_AMBIENT_FILL_SCALE,
        outlineScale: DEFAULT_RENDER_OUTLINE_SCALE,
        shadowEnabled: DEFAULT_RENDER_SHADOW_ENABLED,
        shadowStrength: DEFAULT_RENDER_SHADOW_STRENGTH,
        shadowRange: DEFAULT_RENDER_SHADOW_RANGE
    },
    ASR_SAMPLE_RATE: 16000,
    ASR_MAX_RECORD_MS: 12000,
    ASR_MIN_INPUT_LEVEL: 0.01,
    ASR_CONTINUOUS_SPEECH_LEVEL: 0.02,
    ASR_CONTINUOUS_SILENCE_MS: 1100,
    ASR_CONTINUOUS_IDLE_MS: 6500,
    ASR_CONTINUOUS_RESTART_MS: 450,
    ASR_CONTINUOUS_MIN_SPEECH_MS: 380,
    ASR_CONTINUOUS_VOICE_SCORE: 0.52,
    ASR_CONTINUOUS_VOICE_FRAMES: 3,
    ASR_WAKE_WORD: '老婆',
    ASR_WAKE_WORD_ALIASES: ['老婆', '老 婆', '我老婆'],
    WEB_NATIVE_TTS_FALLBACK_ENABLED: false,
    DESKTOP_NATIVE_TTS_RATE: DEFAULT_DESKTOP_NATIVE_TTS_RATE,
    DESKTOP_NATIVE_TTS_PITCH: DEFAULT_DESKTOP_NATIVE_TTS_PITCH,
    DESKTOP_NATIVE_TTS_VOLUME: DEFAULT_DESKTOP_NATIVE_TTS_VOLUME,
    AUTO_CHAT_ENABLED: false,
    AUTO_CHAT_MIN_INTERVAL: DEFAULT_AUTO_CHAT_MIN_INTERVAL,
    AUTO_CHAT_MAX_INTERVAL: DEFAULT_AUTO_CHAT_MAX_INTERVAL
};

export function applyDesktopPreferencesToConfig(preferences = {}) {
    if (!preferences || typeof preferences !== 'object') {
        return CONFIG;
    }

    if ('backendBaseUrl' in preferences) {
        applyBackendUrls(preferences.backendBaseUrl);
    }
    if ('backendMode' in preferences) {
        CONFIG.BACKEND_MODE = normalizeBackendMode(preferences.backendMode);
    }
    if ('speechMode' in preferences) {
        const fallbackSpeechMode = typeof window !== 'undefined' && window.ailisDesktop?.platform === 'electron'
            ? DEFAULT_DESKTOP_SPEECH_MODE
            : DEFAULT_SPEECH_MODE;
        CONFIG.SPEECH_MODE = normalizeSpeechMode(preferences.speechMode, fallbackSpeechMode);
    }

    applyCameraSettings(preferences);
    applyRenderProfileSettings(preferences);
    applyRenderQualitySettings(preferences);
    applyRenderLookSettings(preferences);
    applyDesktopSpeechSettings(preferences);
    applyAutoChatSettings(preferences);

    return CONFIG;
}

applyDesktopPreferencesToConfig(runtimeSettings.desktopPreferences);
