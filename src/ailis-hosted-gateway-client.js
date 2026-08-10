import { CONFIG } from './config.js';

const SESSION_STORAGE_KEY = 'ailis_hosted_web_session.v1';
const EVENT_POLL_INTERVAL_MS = 650;
const STATUS_CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_HOSTED_ATTACHMENT_BYTES = 25 * 1024 * 1024;

function normalizeBaseUrl(value = '') {
    return String(value || '').trim().replace(/\/+$/, '');
}

async function parseErrorResponse(response) {
    const payload = await response.json().catch(() => null);
    return payload?.detail || payload?.error || `HTTP ${response.status}`;
}

async function readAgentRunEventStream(response, options = {}) {
    if (!response.body) {
        throw new Error('Hosted Runtime 没有返回可读取的回答流。');
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let eventName = 'message';
    let dataLines = [];
    let finalResult = null;
    let streamError = null;

    const dispatchEvent = async () => {
        if (!dataLines.length) {
            eventName = 'message';
            return;
        }
        const rawData = dataLines.join('\n');
        const currentEvent = eventName;
        eventName = 'message';
        dataLines = [];
        const payload = JSON.parse(rawData);
        if (currentEvent === 'response.output_text.delta') {
            const delta = typeof payload.delta === 'string' ? payload.delta : '';
            if (delta && typeof options.onTextDelta === 'function') {
                await options.onTextDelta(delta, payload);
            }
            return;
        }
        if ([
            'response.output_text.started',
            'response.output_text.committed',
            'response.output_text.discarded'
        ].includes(currentEvent)) {
            if (typeof options.onTextStreamEvent === 'function') {
                await options.onTextStreamEvent(currentEvent, payload);
            }
            return;
        }
        if (currentEvent === 'response.completed') {
            finalResult = payload.result || null;
            return;
        }
        if (currentEvent === 'response.error') {
            streamError = new Error(payload.error || 'Hosted Runtime 回答流失败。');
        }
    };

    const consumeLine = async (line) => {
        if (!line) {
            await dispatchEvent();
            return;
        }
        if (line.startsWith('event:')) {
            eventName = line.slice(6).trim() || 'message';
            return;
        }
        if (line.startsWith('data:')) {
            dataLines.push(line.slice(5).replace(/^ /, ''));
        }
    };

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';
        for (const line of lines) {
            await consumeLine(line);
        }
    }
    buffer += decoder.decode();
    if (buffer) {
        await consumeLine(buffer);
    }
    await dispatchEvent();
    if (streamError) {
        throw streamError;
    }
    if (!finalResult) {
        throw new Error('Hosted Runtime 回答流在返回最终结果前中断。');
    }
    return finalResult;
}

export class AILISHostedGatewayClient {
    constructor(options = {}) {
        this.baseUrl = normalizeBaseUrl(options.baseUrl || CONFIG.BACKEND_BASE_URL);
        this.isSupported = Boolean(this.baseUrl);
        this.sessionToken = '';
        this.sessionId = '';
        this.sessionPromise = null;
        this.supportsAnswerStreaming = true;
        this.statusCacheTtlMs = Number.isFinite(Number(options.statusCacheTtlMs))
            ? Math.max(1000, Number(options.statusCacheTtlMs))
            : STATUS_CACHE_TTL_MS;
        this.statusCache = null;
        this.statusPromise = null;
        this.listeners = new Set();
        this.eventCursor = 0;
        this.pollTimer = null;
        this.polling = false;
        this.pollFailureCount = 0;
        try {
            this.sessionToken = window.localStorage?.getItem(SESSION_STORAGE_KEY) || '';
        } catch {}
    }

    async ensureSession({ forceNew = false } = {}) {
        if (forceNew) {
            this.sessionToken = '';
            this.sessionId = '';
            this.invalidateStatusCache();
            try {
                window.localStorage?.removeItem(SESSION_STORAGE_KEY);
            } catch {}
        }
        if (this.sessionToken && this.sessionId) {
            return { token: this.sessionToken, sessionId: this.sessionId };
        }
        if (this.sessionPromise) {
            return await this.sessionPromise;
        }
        this.sessionPromise = (async () => {
            const response = await fetch(`${this.baseUrl}/api/agent/session`, {
                method: 'GET',
                cache: 'no-store',
                headers: this.sessionToken
                    ? { 'x-ailis-web-session': this.sessionToken }
                    : {}
            });
            if (!response.ok) {
                throw new Error(await parseErrorResponse(response));
            }
            const payload = await response.json();
            const previousSessionId = this.sessionId;
            this.sessionToken = String(payload.token || '');
            this.sessionId = String(payload.sessionId || '');
            if (!this.sessionToken || !this.sessionId) {
                throw new Error('Hosted Runtime 没有返回有效网页会话。');
            }
            try {
                window.localStorage?.setItem(SESSION_STORAGE_KEY, this.sessionToken);
            } catch {}
            if (previousSessionId && previousSessionId !== this.sessionId) {
                this.invalidateStatusCache();
            }
            return { token: this.sessionToken, sessionId: this.sessionId };
        })();
        try {
            return await this.sessionPromise;
        } finally {
            this.sessionPromise = null;
        }
    }

    invalidateStatusCache() {
        this.statusCache = null;
        this.statusPromise = null;
    }

    async requestResponse(path, options = {}, retrySession = true) {
        await this.ensureSession();
        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            cache: 'no-store',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'x-ailis-web-session': this.sessionToken,
                ...(options.headers || {})
            }
        });
        if (response.status === 401 && retrySession) {
            await this.ensureSession({ forceNew: true });
            return await this.requestResponse(path, options, false);
        }
        if (!response.ok) {
            throw new Error(await parseErrorResponse(response));
        }
        return response;
    }

    async request(path, options = {}, retrySession = true) {
        const response = await this.requestResponse(path, options, retrySession);
        return await response.json();
    }

    async getStatus({ force = false } = {}) {
        const now = Date.now();
        if (
            !force &&
            this.statusCache?.sessionId === this.sessionId &&
            this.statusCache.expiresAt > now
        ) {
            return this.statusCache.value;
        }
        if (!force && this.statusPromise) {
            return await this.statusPromise;
        }
        this.statusPromise = (async () => {
            const status = await this.request('/api/agent/status', {
                method: 'GET',
                headers: { 'content-type': 'application/json' }
            });
            const value = {
                ...status,
                running: status.running !== false,
                runtime: 'ailis-hosted'
            };
            this.statusCache = {
                sessionId: this.sessionId,
                expiresAt: Date.now() + this.statusCacheTtlMs,
                value
            };
            return value;
        })();
        try {
            return await this.statusPromise;
        } catch (error) {
            this.invalidateStatusCache();
            throw error;
        } finally {
            this.statusPromise = null;
        }
    }

    async uploadAttachment(file, options = {}, retrySession = true) {
        if (!file || typeof file.arrayBuffer !== 'function') {
            throw new Error('没有可上传的文件。');
        }
        const size = Math.max(0, Number(file.size) || 0);
        if (!size) {
            throw new Error('附件内容为空。');
        }
        if (size > MAX_HOSTED_ATTACHMENT_BYTES) {
            throw new Error('单个附件不能超过 25 MB。');
        }

        await this.ensureSession();
        const params = new URLSearchParams({
            filename: String(file.name || 'attachment.bin').slice(0, 200),
            sessionId: String(options.sessionId || 'main').slice(0, 160),
            mimeType: String(file.type || 'application/octet-stream').slice(0, 160)
        });
        const response = await fetch(`${this.baseUrl}/api/agent/attachments?${params}`, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                accept: 'application/json',
                'content-type': file.type || 'application/octet-stream',
                'x-ailis-web-session': this.sessionToken
            },
            body: file
        });
        if (response.status === 401 && retrySession) {
            await this.ensureSession({ forceNew: true });
            return await this.uploadAttachment(file, options, false);
        }
        if (!response.ok) {
            throw new Error(await parseErrorResponse(response));
        }
        const payload = await response.json();
        if (!payload?.attachment?.path) {
            throw new Error('服务器没有返回可读取的附件。');
        }
        return payload.attachment;
    }

    async runAgent(payload = {}, options = {}) {
        this.startPolling();
        try {
            const response = await this.requestResponse('/api/agent/run', {
                method: 'POST',
                headers: { accept: 'text/event-stream' },
                body: JSON.stringify(payload || {})
            });
            if (/text\/event-stream/i.test(response.headers.get('content-type') || '')) {
                return await readAgentRunEventStream(response, options);
            }
            return await response.json();
        } catch (error) {
            this.invalidateStatusCache();
            throw error;
        }
    }

    async interruptAgentRun(payload = {}) {
        return await this.request('/api/agent/interrupt', {
            method: 'POST',
            body: JSON.stringify(payload || {})
        });
    }

    onEvent(listener) {
        if (typeof listener !== 'function') {
            return () => {};
        }
        this.listeners.add(listener);
        this.startPolling();
        return () => {
            this.listeners.delete(listener);
            if (!this.listeners.size) {
                this.stopPolling();
            }
        };
    }

    startPolling() {
        if (this.pollTimer || this.polling || !this.listeners.size) {
            return;
        }
        const poll = async () => {
            if (!this.listeners.size) {
                this.stopPolling();
                return;
            }
            this.polling = true;
            try {
                const payload = await this.request(
                    `/api/agent/events?cursor=${this.eventCursor}&limit=160`,
                    { method: 'GET', headers: { 'content-type': 'application/json' } }
                );
                for (const event of Array.isArray(payload.events) ? payload.events : []) {
                    for (const listener of [...this.listeners]) {
                        try {
                            listener(event);
                        } catch {}
                    }
                }
                this.eventCursor = Math.max(
                    this.eventCursor,
                    Number(payload.latestSeq) || 0
                );
                this.pollFailureCount = 0;
            } catch {
                this.pollFailureCount += 1;
            } finally {
                this.polling = false;
                if (this.listeners.size) {
                    const delay = Math.min(
                        5000,
                        EVENT_POLL_INTERVAL_MS * Math.max(1, this.pollFailureCount)
                    );
                    this.pollTimer = window.setTimeout(() => {
                        this.pollTimer = null;
                        void poll();
                    }, delay);
                }
            }
        };
        void poll();
    }

    stopPolling() {
        if (this.pollTimer) {
            window.clearTimeout(this.pollTimer);
            this.pollTimer = null;
        }
    }
}

export {
    SESSION_STORAGE_KEY,
    MAX_HOSTED_ATTACHMENT_BYTES,
    STATUS_CACHE_TTL_MS,
    readAgentRunEventStream
};
