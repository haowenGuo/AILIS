const DEFAULT_HOSTED_TTS_BASE_URL = 'https://101.133.239.56';

function normalizeHostedTtsBaseUrl(value) {
    try {
        const url = new URL(String(value || DEFAULT_HOSTED_TTS_BASE_URL).trim());
        if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) return '';
        return url.href.replace(/\/+$/, '');
    } catch {
        return '';
    }
}

async function synthesizeHostedSpeech(settings = {}, payload = {}, { fetchImpl = globalThis.fetch } = {}) {
    const baseUrl = normalizeHostedTtsBaseUrl(settings.baseUrl);
    const text = String(payload.text || '').replace(/\s+/g, ' ').trim();
    if (!baseUrl || !text) return { ok: false, provider: 'hosted', code: 'invalid_tts_request',
        error: !baseUrl ? '语音服务地址无效，请填写 HTTP/HTTPS 地址。' : 'TTS 输入文本不能为空' };
    const timeoutMs = Math.max(1, Number(settings.timeoutMs) || 12000);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        // Only the current speech segment is sent. Never forward model keys,
        // conversation history, or the user's local memory to the voice service.
        const response = await fetchImpl(`${baseUrl}/api/tts/synthesize`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }), signal: controller.signal
        });
        const body = await response.text();
        let result;
        try { result = JSON.parse(body); } catch { result = null; }
        if (!response.ok || result?.ok === false) {
            const detail = result?.detail?.message || result?.detail || result?.error || result?.message;
            return { ok: false, provider: 'hosted', code: 'hosted_tts_failed',
                error: typeof detail === 'string' ? detail.slice(0, 600) : `语音服务返回 HTTP ${response.status}` };
        }
        if (!result?.audio_base64) return { ok: false, provider: 'hosted', code: 'empty_tts_audio', error: '语音服务没有返回音频。' };
        return {
            ok: true, provider: result.provider || 'hosted', voice: result.voice || '',
            audioBase64: result.audio_base64, mimeType: result.mime_type || 'audio/mpeg',
            alignment: result.normalized_alignment || result.alignment || null,
            cacheHit: Boolean(result.cache_hit)
        };
    } catch (error) {
        return { ok: false, provider: 'hosted', code: controller.signal.aborted ? 'tts_timeout' : 'tts_connection_failed',
            error: controller.signal.aborted ? `普通语音请求超时（${timeoutMs}ms）` :
                `无法连接语音服务：${error.cause?.message || error.message || String(error)}` };
    } finally {
        clearTimeout(timer);
    }
}

module.exports = { DEFAULT_HOSTED_TTS_BASE_URL, normalizeHostedTtsBaseUrl, synthesizeHostedSpeech };
