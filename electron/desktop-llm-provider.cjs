const DEFAULT_PROVIDER = 'openai-compatible';

function normalizeString(value) {
    return String(value || '').trim();
}

function normalizeBaseUrl(value) {
    return normalizeString(value).replace(/\/+$/, '');
}

function normalizeTimeoutMs(value, fallbackValue = 25000) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }
    return Math.round(Math.min(Math.max(numericValue, 5000), 120000));
}

function normalizeTemperature(value, fallbackValue = 0.8) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }
    return Number(Math.min(Math.max(numericValue, 0), 2).toFixed(2));
}

function buildChatCompletionsUrl(baseUrl) {
    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    if (!normalizedBaseUrl) {
        return '';
    }
    if (/\/chat\/completions$/i.test(normalizedBaseUrl)) {
        return normalizedBaseUrl;
    }
    return `${normalizedBaseUrl}/chat/completions`;
}

function normalizeMessages(messages) {
    if (!Array.isArray(messages)) {
        return [];
    }

    return messages
        .map((message) => {
            const role = ['system', 'user', 'assistant', 'tool'].includes(message?.role)
                ? message.role
                : 'user';
            const content = normalizeMessageContent(message?.content);
            return {
                role,
                content
            };
        })
        .filter((message) => hasMessageContent(message.content));
}

function normalizeMessageContent(content) {
    if (Array.isArray(content)) {
        return content
            .map(normalizeContentPart)
            .filter(Boolean);
    }

    return normalizeString(content);
}

function normalizeContentPart(part) {
    if (!part || typeof part !== 'object') {
        const text = normalizeString(part);
        return text ? { type: 'text', text } : null;
    }

    const type = normalizeString(part.type).toLowerCase();
    if (type === 'text' || type === 'input_text') {
        const text = normalizeString(part.text || part.content);
        return text ? { type: 'text', text } : null;
    }

    if (type === 'image_url') {
        const url = normalizeString(part.image_url?.url || part.url);
        return url ? { type: 'image_url', image_url: { url } } : null;
    }

    if (type === 'input_image') {
        const url = normalizeString(part.image_url || part.url || part.source?.data || part.data);
        return url ? { type: 'image_url', image_url: { url } } : null;
    }

    return null;
}

function hasMessageContent(content) {
    if (typeof content === 'string') {
        return Boolean(content);
    }
    if (Array.isArray(content)) {
        return content.length > 0;
    }
    return false;
}

function getErrorTextFromPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return '';
    }

    return payload.error?.message ||
        payload.error ||
        payload.message ||
        payload.detail ||
        '';
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

async function callDesktopLlmProvider(settings = {}, payload = {}) {
    const provider = normalizeString(settings.provider) || DEFAULT_PROVIDER;
    const baseUrl = normalizeBaseUrl(settings.baseUrl);
    const apiKey = normalizeString(settings.apiKey);
    const model = normalizeString(settings.model);
    const timeoutMs = normalizeTimeoutMs(payload.timeoutMs ?? settings.timeoutMs);
    const temperature = normalizeTemperature(
        payload.temperature ?? settings.temperature
    );
    const messages = normalizeMessages(payload.messages);

    if (provider !== DEFAULT_PROVIDER) {
        return {
            ok: false,
            code: 'unsupported_provider',
            error: `暂不支持的模型 Provider：${provider}`
        };
    }

    if (!baseUrl || !model || !apiKey) {
        return {
            ok: false,
            code: 'needs_config',
            error: '请先在控制面板配置 API Base、模型和 API Key。'
        };
    }

    if (!messages.length) {
        return {
            ok: false,
            code: 'empty_messages',
            error: '消息内容为空。'
        };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(buildChatCompletionsUrl(baseUrl), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages,
                temperature,
                stream: false
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            const errorText = await readErrorBody(response);
            return {
                ok: false,
                code: 'provider_error',
                status: response.status,
                error: errorText || `模型接口请求失败，状态码：${response.status}`
            };
        }

        const data = await response.json();
        const content = normalizeString(
            data?.choices?.[0]?.message?.content ||
            data?.choices?.[0]?.text ||
            ''
        );

        if (!content) {
            return {
                ok: false,
                code: 'empty_response',
                error: '模型接口返回为空。'
            };
        }

        return {
            ok: true,
            provider,
            model,
            content,
            usage: data?.usage || null
        };
    } catch (error) {
        const aborted = error?.name === 'AbortError';
        return {
            ok: false,
            code: aborted ? 'timeout' : 'network_error',
            error: aborted ? `模型请求超时（${timeoutMs}ms）` : (error?.message || String(error))
        };
    } finally {
        clearTimeout(timeoutId);
    }
}

module.exports = {
    DEFAULT_PROVIDER,
    buildChatCompletionsUrl,
    callDesktopLlmProvider,
    normalizeBaseUrl,
    normalizeMessages,
    normalizeTemperature,
    normalizeTimeoutMs
};
