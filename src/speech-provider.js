import { CONFIG } from './config.js';
import { createChunkedTtsSession } from './realtime-voice/chunked-tts-session.js';
import { deriveTtsSpeechText } from './tts-speech-text.js';

function isDesktopRuntime() {
    return typeof window !== 'undefined' && window.ailisDesktop?.platform === 'electron';
}

const ZH_FEMALE_VOICE_HINTS = [
    'xiaoxiao',
    'xiaoyi',
    'xiaomo',
    'xiaoxuan',
    'xiaorui',
    'xiaoshuang',
    'xiaoyan',
    'xiaoyou',
    'xiaoqiu',
    'xiaorou',
    'huihui',
    'yaoyao',
    '晓晓',
    '晓伊',
    '晓墨',
    '晓颜',
    '晓悠',
    '晓秋',
    '晓柔',
    '女'
];

const ZH_MALE_VOICE_HINTS = [
    'yunxi',
    'yunyang',
    'yunjian',
    '云希',
    '云扬',
    '云健',
    '男'
];

const EN_FEMALE_VOICE_HINTS = [
    'aria',
    'jenny',
    'sara',
    'emma',
    'female',
    'woman',
    'girl'
];

const EN_MALE_VOICE_HINTS = [
    'guy',
    'davis',
    'tony',
    'male',
    'man',
    'boy'
];

function normalizeVoiceName(value) {
    return String(value || '').trim().toLowerCase();
}

function hasAnyHint(text, hints) {
    return hints.some((hint) => text.includes(hint));
}

async function loadNativeVoices(timeoutMs = 1200) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        return [];
    }

    const synth = window.speechSynthesis;
    const existingVoices = synth.getVoices?.() || [];
    if (existingVoices.length) {
        return existingVoices;
    }

    return new Promise((resolve) => {
        let resolved = false;
        const finish = () => {
            if (resolved) {
                return;
            }
            resolved = true;
            window.clearTimeout(timeoutId);
            synth.removeEventListener?.('voiceschanged', handleVoicesChanged);
            resolve(synth.getVoices?.() || []);
        };
        const handleVoicesChanged = () => finish();
        const timeoutId = window.setTimeout(finish, timeoutMs);

        synth.addEventListener?.('voiceschanged', handleVoicesChanged, { once: true });
    });
}

function scoreNativeVoice(voice, text) {
    const normalizedLang = normalizeVoiceName(voice?.lang);
    const normalizedName = normalizeVoiceName(voice?.name);
    const hasChinese = /[\u3400-\u9fff]/.test(text);

    if (hasChinese) {
        if (!/^zh\b/i.test(normalizedLang)) {
            return Number.NEGATIVE_INFINITY;
        }

        let score = 40;
        if (normalizedLang.includes('cn') || normalizedLang.includes('hans')) {
            score += 12;
        }
        if (hasAnyHint(normalizedName, ZH_FEMALE_VOICE_HINTS)) {
            score += 70;
        }
        if (hasAnyHint(normalizedName, ZH_MALE_VOICE_HINTS)) {
            score -= 40;
        }
        if (normalizedName.includes('natural')) {
            score += 18;
        }
        if (voice?.localService === false) {
            score += 10;
        }
        return score;
    }

    let score = /^en\b/i.test(normalizedLang) ? 30 : 0;
    if (hasAnyHint(normalizedName, EN_FEMALE_VOICE_HINTS)) {
        score += 40;
    }
    if (hasAnyHint(normalizedName, EN_MALE_VOICE_HINTS)) {
        score -= 20;
    }
    if (normalizedName.includes('natural')) {
        score += 12;
    }
    return score;
}

function getNativeVoiceId(voice) {
    return String(voice?.voiceURI || voice?.name || '').trim();
}

async function pickNativeVoice(text, preferredVoiceId = '') {
    const voices = await loadNativeVoices();
    const normalizedPreferredVoiceId = String(preferredVoiceId || '').trim();
    if (normalizedPreferredVoiceId) {
        const exactMatch = voices.find((voice) => getNativeVoiceId(voice) === normalizedPreferredVoiceId);
        if (exactMatch) {
            return exactMatch;
        }
    }
    const rankedVoices = voices
        .map((voice) => ({ voice, score: scoreNativeVoice(voice, text) }))
        .filter(({ score }) => Number.isFinite(score))
        .sort((left, right) => right.score - left.score);

    return rankedVoices[0]?.voice || null;
}

function getNativeSpeechSettings(text) {
    const hasChinese = /[\u3400-\u9fff]/.test(text);
    return {
        rate: hasChinese ? CONFIG.DESKTOP_NATIVE_TTS_RATE : 1,
        pitch: hasChinese ? CONFIG.DESKTOP_NATIVE_TTS_PITCH : 1,
        volume: CONFIG.DESKTOP_NATIVE_TTS_VOLUME
    };
}

function normalizeSpeechMode(mode) {
    const requestedMode = String(mode || '').trim().toLowerCase();

    if (['off', 'server', 'cosyvoice3', 'native'].includes(requestedMode)) {
        return requestedMode;
    }
    if (['elevenlabs', 'eleven-labs', 'eleven_labs', 'server_tts', 'cloud'].includes(requestedMode)) {
        return 'server';
    }
    if (['cosyvoice', 'cosy-voice', 'cosy_voice'].includes(requestedMode)) {
        return 'cosyvoice3';
    }
    if (['browser', 'browser-native', 'chrome', 'web-speech'].includes(requestedMode)) {
        return 'native';
    }

    return 'off';
}

function resolveSpeechMode(modeOverride = null) {
    const requestedMode = normalizeSpeechMode(modeOverride || CONFIG.SPEECH_MODE);

    const desktopRuntime = isDesktopRuntime();

    if (requestedMode === 'cosyvoice3') {
        return desktopRuntime ? 'cosyvoice3' : 'off';
    }

    if (requestedMode === 'server') {
        return 'server';
    }

    if (requestedMode === 'native') {
        return desktopRuntime ? 'off' : 'native';
    }

    if (requestedMode === 'off') {
        return 'off';
    }

    return 'off';
}

function normalizeSpeechText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function getSynthesisErrorText(payload) {
    if (!payload || typeof payload !== 'object') {
        return '';
    }
    const detail = payload.detail;
    if (detail && typeof detail === 'object') {
        return detail.message || JSON.stringify(detail);
    }
    return detail || payload.message || payload.error?.message || payload.error || '';
}

async function readSynthesisError(response) {
    const text = await response.text().catch(() => '');
    if (!text) {
        return '';
    }
    try {
        return getSynthesisErrorText(JSON.parse(text)) || text;
    } catch {
        return text;
    }
}

async function synthesizeBackendSpeech(text) {
    const cleanText = normalizeSpeechText(text);
    if (!cleanText) {
        throw new Error('TTS 输入文本不能为空');
    }

    const timeoutMs = Math.max(0, Number(CONFIG.WEB_SERVER_TTS_TIMEOUT_MS) || 0);
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller && timeoutMs > 0
        ? setTimeout(() => controller.abort(), timeoutMs)
        : null;

    try {
        const response = await fetch(CONFIG.BACKEND_TTS_SYNTHESIZE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: cleanText
            }),
            signal: controller?.signal
        });

        if (!response.ok) {
            const errorText = await readSynthesisError(response);
            throw new Error(errorText || `TTS 合成请求失败，状态码：${response.status}`);
        }

        return response.json();
    } catch (error) {
        if (controller?.signal.aborted) {
            throw new Error(`服务端 TTS 请求超时（${timeoutMs}ms）`);
        }
        throw error;
    } finally {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
    }
}

function normalizeSynthesisResult(result, { defaultMimeType = 'audio/wav' } = {}) {
    if (!result || typeof result !== 'object') {
        throw new Error('TTS 合成结果为空');
    }
    if (result.ok === false) {
        throw new Error(getSynthesisErrorText(result) || 'TTS 合成失败');
    }
    if (typeof result.play === 'function') {
        return {
            play: result.play,
            mimeType: result.mimeType || result.mime_type || defaultMimeType,
            alignment: result.normalizedAlignment || result.normalized_alignment || result.alignment || null
        };
    }

    const audioBase64 = result.audioBase64 || result.audio_base64 || '';
    const audioBlob = result.audioBlob || null;
    const hasAudioBlob = typeof Blob !== 'undefined' && audioBlob instanceof Blob;
    if (!audioBase64 && !hasAudioBlob) {
        throw new Error('TTS 合成结果没有可播放音频');
    }

    return {
        audioBase64,
        audioBlob,
        mimeType: result.mimeType || result.mime_type || defaultMimeType,
        alignment: result.normalizedAlignment || result.normalized_alignment || result.alignment || null
    };
}

function candidateSupportsTTS(candidate) {
    try {
        return Boolean(candidate?.supportsTTS);
    } catch {
        return false;
    }
}

function canCandidateSynthesize(candidate) {
    return candidateSupportsTTS(candidate) && typeof candidate.synthesizeSpeech === 'function';
}

class ServerTTSCandidate {
    constructor() {
        this.id = 'server-tts';
        this.replyMode = 'server_tts';
    }

    get supportsTTS() {
        return true;
    }

    async synthesizeSpeech(text) {
        const cleanText = normalizeSpeechText(text);
        if (!cleanText) {
            throw new Error('TTS 输入文本不能为空');
        }

        if (isDesktopRuntime() && typeof window.ailisDesktop?.tts?.synthesize === 'function') {
            return normalizeSynthesisResult(
                await window.ailisDesktop.tts.synthesize({
                    text: cleanText
                }),
                { defaultMimeType: 'audio/mpeg' }
            );
        }

        return normalizeSynthesisResult(
            await synthesizeBackendSpeech(cleanText),
            { defaultMimeType: 'audio/mpeg' }
        );
    }

    async speak({
        payload,
        displayText,
        alignment,
        audioPlayer,
        updateMessageContent,
        scrollToBottom,
        onAvatarPlaybackStart
    }) {
        let audioBase64 = payload?.audio_base64 || '';
        let audioBlob = payload?.audioBlob || null;
        let mimeType = payload?.mime_type || payload?.mimeType || 'audio/mpeg';
        let speechAlignment = alignment;

        if (!audioBase64 && !audioBlob) {
            const speechText = deriveTtsSpeechText(payload, displayText);
            if (!speechText) {
                return false;
            }
            const result = await this.synthesizeSpeech(speechText);
            if (typeof result.play === 'function') {
                await result.play({
                    displayText,
                    onPlaybackStart: onAvatarPlaybackStart
                });
                return true;
            }
            audioBase64 = result.audioBase64 || '';
            audioBlob = result.audioBlob || null;
            mimeType = result.mimeType || mimeType;
            speechAlignment = result.alignment || speechAlignment;
        }

        await audioPlayer.playSpeech({
            audioBase64,
            audioBlob,
            mimeType,
            displayText,
            alignment: speechAlignment,
            onTextProgress: (text) => {
                updateMessageContent(text || '');
                scrollToBottom();
            },
            onPlaybackStart: () => {
                onAvatarPlaybackStart?.();
                if (alignment?.characters?.length) {
                    updateMessageContent('');
                } else {
                    updateMessageContent(displayText);
                }
                scrollToBottom();
            },
            onPlaybackEnd: () => {
                updateMessageContent(displayText);
                scrollToBottom();
            }
        });

        return true;
    }
}

class CosyVoice3TTSCandidate {
    constructor() {
        this.id = 'cosyvoice3-anime-shy-soft';
        this.replyMode = 'stream_text';
    }

    get supportsTTS() {
        return isDesktopRuntime() && typeof window.ailisDesktop?.tts?.synthesize === 'function';
    }

    async synthesizeSpeech(text) {
        const result = await window.ailisDesktop.tts.synthesize({
            provider: 'cosyvoice3',
            preset: 'anime_shy_soft',
            text,
            speed: 0.92
        });

        return normalizeSynthesisResult(result);
    }


    async speak({
        payload,
        displayText,
        audioPlayer,
        updateMessageContent,
        scrollToBottom,
        onAvatarPlaybackStart
    }) {
        if (!this.supportsTTS || !displayText) {
            return false;
        }

        updateMessageContent(displayText);
        scrollToBottom();

        const speechText = deriveTtsSpeechText(payload, displayText);
        if (!speechText) {
            return false;
        }
        const result = await this.synthesizeSpeech(speechText);

        await audioPlayer.playSpeech({
            audioBase64: result.audioBase64,
            mimeType: result.mimeType,
            displayText,
            alignment: null,
            onPlaybackStart: () => {
                onAvatarPlaybackStart?.();
                updateMessageContent(displayText);
                scrollToBottom();
            },
            onPlaybackEnd: () => {
                updateMessageContent(displayText);
                scrollToBottom();
            }
        });

        return true;
    }
}

class NativeSpeechSynthesisCandidate {
    constructor({ preferredVoiceId = '' } = {}) {
        this.id = 'browser-speech-synthesis';
        this.replyMode = 'stream_text';
        this.preferredVoiceId = String(preferredVoiceId || '').trim();
    }

    get supportsTTS() {
        return (
            typeof window !== 'undefined' &&
            !isDesktopRuntime() &&
            CONFIG.WEB_NATIVE_TTS_FALLBACK_ENABLED &&
            Boolean(window.speechSynthesis) &&
            typeof window.SpeechSynthesisUtterance === 'function'
        );
    }

    async speak({
        payload,
        displayText,
        vrmSystem,
        updateMessageContent,
        scrollToBottom,
        onAvatarPlaybackStart
    }) {
        const speechText = deriveTtsSpeechText(payload, displayText);
        if (!this.supportsTTS || !speechText) {
            return false;
        }

        const synth = window.speechSynthesis;
        const utterance = new window.SpeechSynthesisUtterance(speechText);
        const preferredVoice = await pickNativeVoice(speechText, this.preferredVoiceId);
        const speechSettings = getNativeSpeechSettings(speechText);

        if (preferredVoice) {
            utterance.voice = preferredVoice;
            utterance.lang = preferredVoice.lang;
        } else if (/[\u3400-\u9fff]/.test(speechText)) {
            utterance.lang = 'zh-CN';
        }
        utterance.rate = speechSettings.rate;
        utterance.pitch = speechSettings.pitch;
        utterance.volume = speechSettings.volume;

        synth.cancel();

        await new Promise((resolve, reject) => {
            let settled = false;
            let started = false;
            let startTimeoutId = null;

            const finish = (callback) => {
                if (settled) {
                    return;
                }
                settled = true;
                if (startTimeoutId !== null) {
                    window.clearTimeout(startTimeoutId);
                }
                callback();
            };

            utterance.onstart = () => {
                if (settled) {
                    return;
                }
                started = true;
                if (startTimeoutId !== null) {
                    window.clearTimeout(startTimeoutId);
                }
                vrmSystem?.startFallbackSpeech?.();
                onAvatarPlaybackStart?.();
                updateMessageContent?.(displayText);
                scrollToBottom?.();
            };

            utterance.onboundary = (event) => {
                if (!started || typeof event.charIndex !== 'number' || event.charIndex < 0) {
                    return;
                }
                const spokenEnd = event.charIndex + Math.max(1, Number(event.charLength) || 1);
                const progress = Math.min(1, spokenEnd / Math.max(1, speechText.length));
                const visibleLength = Math.max(1, Math.ceil(displayText.length * progress));
                updateMessageContent?.(displayText.slice(0, visibleLength));
                scrollToBottom?.();
            };

            utterance.onend = () => {
                vrmSystem?.stopSpeaking?.();
                updateMessageContent?.(displayText);
                scrollToBottom?.();
                finish(resolve);
            };

            utterance.onerror = (event) => {
                vrmSystem?.stopSpeaking?.();
                finish(() => reject(new Error(event?.error || '浏览器原生语音播放失败')));
            };

            try {
                startTimeoutId = window.setTimeout(() => {
                    if (started) {
                        return;
                    }
                    synth.cancel();
                    vrmSystem?.stopSpeaking?.();
                    finish(() => reject(new Error('浏览器原生语音没有成功启动')));
                }, 2500);
                synth.speak(utterance);
            } catch (error) {
                finish(() => reject(error));
            }
        });

        return true;
    }

    dispose() {
        if (typeof window !== 'undefined') {
            window.speechSynthesis?.cancel?.();
        }
    }
}

export class SpeechProvider {
    constructor({ ttsCandidates = [], mode = 'server' } = {}) {
        this.ttsCandidates = ttsCandidates.filter(Boolean);
        this.mode = mode;
        this.lastTTSErrors = [];
    }

    get supportsTTS() {
        return this.ttsCandidates.some((candidate) => candidateSupportsTTS(candidate));
    }

    get supportsChunkedTTS() {
        return this.ttsCandidates.some((candidate) => canCandidateSynthesize(candidate));
    }

    get isSpeechDisabled() {
        return this.mode === 'off';
    }

    get replyModeFallbackChain() {
        if (this.isSpeechDisabled) {
            return ['stream_text'];
        }

        const firstCandidate = this.ttsCandidates.find((candidate) => candidateSupportsTTS(candidate));
        if (!firstCandidate) {
            return ['stream_text'];
        }

        if (this.supportsChunkedTTS) {
            return firstCandidate.replyMode === 'server_tts'
                ? ['stream_text', 'server_tts']
                : ['stream_text'];
        }

        if (firstCandidate.replyMode === 'server_tts') {
            return ['server_tts', 'stream_text'];
        }

        return ['stream_text'];
    }

    getPrimaryModeLabel() {
        if (this.isSpeechDisabled) {
            return 'off';
        }
        const firstCandidate = this.ttsCandidates.find((candidate) => candidateSupportsTTS(candidate));
        return firstCandidate?.id || 'text-only';
    }

    getLastTTSFailureMessage() {
        return this.lastTTSErrors[0]?.message || '';
    }

    createChunkedSession(options = {}) {
        if (this.isSpeechDisabled) {
            return null;
        }

        const candidates = this.ttsCandidates.filter((candidate) => canCandidateSynthesize(candidate));
        if (!candidates.length) {
            return null;
        }

        return createChunkedTtsSession({
            ...options,
            providerId: candidates.map((candidate) => candidate.id).join(' -> '),
            synthesize: async (text, context) => {
                const chunkErrors = [];
                for (const candidate of candidates) {
                    try {
                        return await candidate.synthesizeSpeech(text, {
                            ...context,
                            vrmSystem: options.vrmSystem
                        });
                    } catch (error) {
                        const entry = {
                            provider: candidate.id,
                            message: error?.message || String(error),
                            context
                        };
                        chunkErrors.push(entry);
                        this.lastTTSErrors.unshift(entry);
                    }
                }

                throw new Error(chunkErrors.map((entry) => `${entry.provider}: ${entry.message}`).join('；') ||
                    '所有 TTS candidate 都无法合成当前语音片段');
            },
            onError: (error, context) => {
                this.lastTTSErrors.unshift({
                    provider: 'chunked-tts',
                    message: error?.message || String(error),
                    context
                });
                options.onError?.(error, context);
            }
        });
    }

    async playSpeech(options) {
        this.lastTTSErrors = [];

        for (const candidate of this.ttsCandidates) {
            if (!candidateSupportsTTS(candidate)) {
                continue;
            }

            try {
                const played = await candidate.speak(options);
                if (played) {
                    return {
                        played: true,
                        provider: candidate.id
                    };
                }
            } catch (error) {
                this.lastTTSErrors.push({
                    provider: candidate.id,
                    message: error.message || String(error)
                });
            }
        }

        return {
            played: false,
            provider: null
        };
    }

    dispose() {
        for (const candidate of this.ttsCandidates) {
            candidate?.dispose?.();
        }
    }
}

export function createSpeechProvider({
    enableTTS = true,
    speechMode = null,
    nativeVoiceId = ''
} = {}) {
    const resolvedMode = resolveSpeechMode(speechMode);

    const ttsCandidates = [];
    if (enableTTS && resolvedMode === 'cosyvoice3') {
        ttsCandidates.push(new CosyVoice3TTSCandidate());
    }

    if (enableTTS && resolvedMode === 'server') {
        ttsCandidates.push(new ServerTTSCandidate());
        if (CONFIG.WEB_NATIVE_TTS_FALLBACK_ENABLED && !isDesktopRuntime()) {
            ttsCandidates.push(new NativeSpeechSynthesisCandidate({
                preferredVoiceId: nativeVoiceId
            }));
        }
    }

    if (enableTTS && resolvedMode === 'native') {
        ttsCandidates.push(new NativeSpeechSynthesisCandidate({
            preferredVoiceId: nativeVoiceId
        }));
    }

    return new SpeechProvider({
        ttsCandidates,
        mode: enableTTS ? resolvedMode : 'off'
    });
}
