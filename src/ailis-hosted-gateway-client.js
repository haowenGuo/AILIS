import { CONFIG } from './config.js';

const SESSION_STORAGE_KEY = 'ailis_hosted_web_session.v1';
const EVENT_POLL_INTERVAL_MS = 650;

function normalizeBaseUrl(value = '') {
    return String(value || '').trim().replace(/\/+$/, '');
}

async function parseErrorResponse(response) {
    const payload = await response.json().catch(() => null);
    return payload?.detail || payload?.error || `HTTP ${response.status}`;
}

export class AILISHostedGatewayClient {
    constructor(options = {}) {
        this.baseUrl = normalizeBaseUrl(options.baseUrl || CONFIG.BACKEND_BASE_URL);
        this.isSupported = Boolean(this.baseUrl);
        this.sessionToken = '';
        this.sessionId = '';
        this.sessionPromise = null;
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
            this.sessionToken = String(payload.token || '');
            this.sessionId = String(payload.sessionId || '');
            if (!this.sessionToken || !this.sessionId) {
                throw new Error('Hosted Runtime 没有返回有效网页会话。');
            }
            try {
                window.localStorage?.setItem(SESSION_STORAGE_KEY, this.sessionToken);
            } catch {}
            return { token: this.sessionToken, sessionId: this.sessionId };
        })();
        try {
            return await this.sessionPromise;
        } finally {
            this.sessionPromise = null;
        }
    }

    async request(path, options = {}, retrySession = true) {
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
            return await this.request(path, options, false);
        }
        if (!response.ok) {
            throw new Error(await parseErrorResponse(response));
        }
        return await response.json();
    }

    async getStatus() {
        const status = await this.request('/api/agent/status', {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        });
        return {
            ...status,
            running: status.running !== false,
            runtime: 'ailis-hosted'
        };
    }

    async runAgent(payload = {}) {
        this.startPolling();
        return await this.request('/api/agent/run', {
            method: 'POST',
            body: JSON.stringify(payload || {})
        });
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

export { SESSION_STORAGE_KEY };
