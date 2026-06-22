import { CONFIG } from './config.js';
import { createChunkedTtsSession } from './realtime-voice/chunked-tts-session.js';
import { deriveTtsSpeechText } from './tts-speech-text.js';

function isDesktopRuntime() {
    return typeof window !== 'undefined' && window.ailisDesktop?.platform === 'electron';
}

function normalizeSpeechMode(mode) {
    const requestedMode = String(mode || '').trim().toLowerCase();

    if (['off', 'server', 'cosyvoice3'].includes(requestedMode)) {
        return requestedMode;
    }
    if (['elevenlabs', 'eleven-labs', 'eleven_labs', 'server_tts', 'cloud'].includes(requestedMode)) {
        return 'server';
    }
    if (['cosyvoice', 'cosy-voice', 'cosy_voice'].includes(requestedMode)) {
        return 'cosyvoice3';
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

    const response = await fetch(CONFIG.BACKEND_TTS_SYNTHESIZE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: cleanText
        })
    });

    if (!response.ok) {
        const errorText = await readSynthesisError(response);
        throw new Error(errorText || `TTS 合成请求失败，状态码：${response.status}`);
    }

    return response.json();
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

    async synthesizeChunk(text) {
        return this.synthesizeSpeech(text);
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
    speechMode = null
} = {}) {
    const resolvedMode = resolveSpeechMode(speechMode);

    const ttsCandidates = [];
    if (enableTTS && resolvedMode === 'cosyvoice3') {
        ttsCandidates.push(new CosyVoice3TTSCandidate());
    }

    if (enableTTS && resolvedMode === 'server') {
        ttsCandidates.push(new ServerTTSCandidate());
    }

    return new SpeechProvider({
        ttsCandidates,
        mode: enableTTS ? resolvedMode : 'off'
    });
}
