function normalizeString(value) {
    return String(value || '').trim();
}

function normalizeApiBase(value) {
    return normalizeString(value).replace(/\/+$/, '') || 'https://api.elevenlabs.io';
}

function normalizeOutputFormat(value) {
    return normalizeString(value) || 'mp3_44100_128';
}

function normalizeTimeoutMs(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return 60000;
    }
    return Math.round(Math.min(Math.max(numericValue, 5000), 120000));
}

function guessMimeType(outputFormat) {
    if (outputFormat.startsWith('mp3')) {
        return 'audio/mpeg';
    }
    if (outputFormat.startsWith('wav')) {
        return 'audio/wav';
    }
    if (outputFormat.startsWith('pcm')) {
        return 'audio/pcm';
    }
    if (
        outputFormat.startsWith('ulaw') ||
        outputFormat.startsWith('mulaw') ||
        outputFormat.startsWith('alaw')
    ) {
        return 'audio/basic';
    }
    return 'application/octet-stream';
}

function normalizeNumber(value, fallbackValue, minimum, maximum) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }
    return Math.min(Math.max(numericValue, minimum), maximum);
}

function parseAlignment(payload) {
    if (!payload || typeof payload !== 'object') {
        return null;
    }

    return {
        characters: Array.isArray(payload.characters) ? payload.characters : [],
        character_start_times_seconds: Array.isArray(payload.character_start_times_seconds)
            ? payload.character_start_times_seconds
            : [],
        character_end_times_seconds: Array.isArray(payload.character_end_times_seconds)
            ? payload.character_end_times_seconds
            : []
    };
}

function estimateDurationSeconds(alignment) {
    const endTimes = alignment?.character_end_times_seconds;
    if (!Array.isArray(endTimes) || !endTimes.length) {
        return null;
    }
    return Math.max(...endTimes);
}

function getErrorTextFromPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return '';
    }

    const detail = payload.detail;
    if (detail && typeof detail === 'object') {
        return detail.message || JSON.stringify(detail);
    }

    return detail || payload.message || payload.error?.message || payload.error || '';
}

async function readErrorBody(response) {
    const text = await response.text().catch(() => '');
    if (!text) {
        return '';
    }

    try {
        return getErrorTextFromPayload(JSON.parse(text)) || text;
    } catch {
        return text;
    }
}

function buildElevenLabsUrl(settings) {
    const apiBase = normalizeApiBase(settings.apiBase);
    const voiceId = encodeURIComponent(normalizeString(settings.voiceId));
    const outputFormat = normalizeOutputFormat(settings.outputFormat);
    const query = new URLSearchParams({
        output_format: outputFormat,
        enable_logging: String(settings.enableLogging !== false)
    });

    if (settings.optimizeStreamingLatency !== null && settings.optimizeStreamingLatency !== undefined) {
        query.set('optimize_streaming_latency', String(settings.optimizeStreamingLatency));
    }

    return `${apiBase}/v1/text-to-speech/${voiceId}/with-timestamps?${query.toString()}`;
}

async function synthesizeElevenLabsSpeech(settings = {}, payload = {}) {
    const text = normalizeString(payload.text);
    const apiKey = normalizeString(settings.apiKey);
    const voiceId = normalizeString(settings.voiceId);
    const modelId = normalizeString(settings.modelId) || 'eleven_multilingual_v2';
    const outputFormat = normalizeOutputFormat(settings.outputFormat);
    const timeoutMs = normalizeTimeoutMs(settings.timeoutMs);

    if (!text) {
        return {
            ok: false,
            code: 'empty_text',
            error: 'TTS 输入文本不能为空。'
        };
    }

    if (!apiKey || !voiceId) {
        return {
            ok: false,
            code: 'needs_config',
            error: '请先在控制面板配置 ElevenLabs API Key 和 Voice ID。'
        };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const requestBody = {
            text,
            model_id: modelId,
            voice_settings: {
                stability: normalizeNumber(settings.stability, 0.58, 0, 1),
                similarity_boost: normalizeNumber(settings.similarityBoost, 0.78, 0, 1),
                style: normalizeNumber(settings.style, 0.05, 0, 1),
                speed: normalizeNumber(settings.speed, 0.9, 0.7, 1.2),
                use_speaker_boost: settings.useSpeakerBoost !== false
            }
        };

        if (normalizeString(settings.languageCode)) {
            requestBody.language_code = normalizeString(settings.languageCode);
        }

        const response = await fetch(buildElevenLabsUrl({
            ...settings,
            voiceId,
            outputFormat
        }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        if (!response.ok) {
            const errorText = await readErrorBody(response);
            return {
                ok: false,
                code: 'provider_error',
                status: response.status,
                error: errorText || `ElevenLabs 请求失败，状态码：${response.status}`
            };
        }

        const data = await response.json();
        const audioBase64 = normalizeString(data.audio_base64);
        if (!audioBase64) {
            return {
                ok: false,
                code: 'empty_audio',
                error: 'ElevenLabs 返回的音频为空。'
            };
        }

        const alignment = parseAlignment(data.alignment);
        const normalizedAlignment = parseAlignment(data.normalized_alignment);

        return {
            ok: true,
            audio_base64: audioBase64,
            audio_format: outputFormat,
            mime_type: guessMimeType(outputFormat),
            alignment,
            normalized_alignment: normalizedAlignment,
            duration_hint_seconds: estimateDurationSeconds(normalizedAlignment || alignment)
        };
    } catch (error) {
        const aborted = error?.name === 'AbortError';
        return {
            ok: false,
            code: aborted ? 'timeout' : 'network_error',
            error: aborted ? `ElevenLabs 请求超时（${timeoutMs}ms）` : (error?.message || String(error))
        };
    } finally {
        clearTimeout(timeoutId);
    }
}

module.exports = {
    synthesizeElevenLabsSpeech
};
