const RECOGNITION_MODES = new Set(['fast-vad', 'auto-vad', 'continuous', 'manual']);

export function normalizeAsrRecognitionMode(mode) {
    const normalizedMode = String(mode || '').trim().toLowerCase();
    return RECOGNITION_MODES.has(normalizedMode) ? normalizedMode : 'auto-vad';
}

export function isVadRecognitionMode(mode) {
    const normalizedMode = normalizeAsrRecognitionMode(mode);
    return normalizedMode === 'fast-vad' ||
        normalizedMode === 'auto-vad' ||
        normalizedMode === 'continuous';
}

export function isFastAsrMode(mode) {
    return normalizeAsrRecognitionMode(mode) === 'fast-vad';
}

function numberOrFallback(value, fallbackValue) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallbackValue;
}

export function getAsrLatencyPreset(mode, config = {}) {
    const normalizedMode = normalizeAsrRecognitionMode(mode);
    const minimumInputLevel = numberOrFallback(config.ASR_MIN_INPUT_LEVEL, 0.01);
    const continuousSpeechLevel = numberOrFallback(config.ASR_CONTINUOUS_SPEECH_LEVEL, 0.02);
    const basePreset = {
        mode: normalizedMode,
        autoVad: normalizedMode !== 'manual',
        asrPreset: 'balanced',
        recorderTimesliceMs: 200,
        levelPollingMs: 120,
        maxRecordMs: numberOrFallback(config.ASR_MAX_RECORD_MS, 12000),
        speechLevel: Math.max(continuousSpeechLevel, minimumInputLevel * 1.6),
        silenceLevel: minimumInputLevel,
        silenceMs: numberOrFallback(config.ASR_CONTINUOUS_SILENCE_MS, 1100),
        idleMs: numberOrFallback(config.ASR_CONTINUOUS_IDLE_MS, 6500),
        restartMs: numberOrFallback(config.ASR_CONTINUOUS_RESTART_MS, 450),
        minSpeechMs: numberOrFallback(config.ASR_CONTINUOUS_MIN_SPEECH_MS, 380),
        voiceScore: numberOrFallback(config.ASR_CONTINUOUS_VOICE_SCORE, 0.52),
        voiceFrames: numberOrFallback(config.ASR_CONTINUOUS_VOICE_FRAMES, 3),
        pauseHintMs: 420
    };

    if (normalizedMode !== 'fast-vad') {
        return basePreset;
    }

    return {
        ...basePreset,
        asrPreset: 'fast',
        recorderTimesliceMs: 100,
        levelPollingMs: 70,
        maxRecordMs: Math.min(basePreset.maxRecordMs, 8500),
        speechLevel: Math.max(minimumInputLevel * 1.35, continuousSpeechLevel * 0.82),
        silenceMs: Math.min(basePreset.silenceMs, 650),
        idleMs: Math.min(basePreset.idleMs, 3600),
        restartMs: Math.min(basePreset.restartMs, 250),
        minSpeechMs: Math.min(basePreset.minSpeechMs, 240),
        voiceScore: Math.min(basePreset.voiceScore, 0.46),
        voiceFrames: Math.min(basePreset.voiceFrames, 2),
        pauseHintMs: 300
    };
}
