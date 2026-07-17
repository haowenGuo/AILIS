const fs = require('fs');
const path = require('path');

const CHAT_HISTORY_VERSION = 1;
const DEFAULT_MAX_SESSIONS = 80;
const DEFAULT_MAX_MESSAGES = 240;
const MAX_MESSAGE_CHARS = 24000;
const MAX_ATTACHMENTS = 12;

function normalizeString(value, fallback = '') {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallback;
}

function cloneJson(value, fallback = null) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return fallback;
    }
}

function atomicWriteJson(filePath, value) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    fs.renameSync(temporaryPath, filePath);
}

function readJson(filePath, fallback) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
    } catch {
        return fallback;
    }
}

function normalizeAttachment(value = {}) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return null;
    }
    const attachment = {
        kind: normalizeString(value.kind || value.type, 'file'),
        name: normalizeString(value.name),
        label: normalizeString(value.label),
        path: normalizeString(value.path),
        source: normalizeString(value.source),
        mimeType: normalizeString(value.mimeType || value.mime_type)
    };
    if (!attachment.name && !attachment.label && !attachment.path && !attachment.source) {
        return null;
    }
    return attachment;
}

function normalizeMessage(value = {}) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return null;
    }
    const role = value.role === 'assistant' ? 'assistant' : value.role === 'user' ? 'user' : '';
    const content = normalizeString(value.content || value.text || value.message).slice(0, MAX_MESSAGE_CHARS);
    if (!role || !content) {
        return null;
    }
    return {
        id: normalizeString(value.id),
        role,
        content,
        attachments: (Array.isArray(value.attachments) ? value.attachments : [])
            .map(normalizeAttachment)
            .filter(Boolean)
            .slice(0, MAX_ATTACHMENTS),
        source: normalizeString(value.source),
        createdAt: normalizeString(value.createdAt, new Date().toISOString())
    };
}

function createDefaultState() {
    return {
        version: CHAT_HISTORY_VERSION,
        updatedAt: '',
        sessions: {}
    };
}

class AILISChatHistoryStore {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || path.join(process.cwd(), '.ailis-state', 'chat-history'));
        this.statePath = path.resolve(options.statePath || path.join(this.rootDir, 'sessions.json'));
        this.maxSessions = Math.max(1, Math.min(Number(options.maxSessions) || DEFAULT_MAX_SESSIONS, 500));
        this.maxMessages = Math.max(2, Math.min(Number(options.maxMessages) || DEFAULT_MAX_MESSAGES, 1000));
        this.state = this.load();
    }

    load() {
        const loaded = readJson(this.statePath, createDefaultState());
        const sessions = {};
        for (const [sessionId, raw] of Object.entries(loaded?.sessions || {})) {
            const normalizedSessionId = normalizeString(sessionId);
            if (!normalizedSessionId) {
                continue;
            }
            sessions[normalizedSessionId] = {
                sessionId: normalizedSessionId,
                updatedAt: normalizeString(raw?.updatedAt),
                messages: (Array.isArray(raw?.messages) ? raw.messages : [])
                    .map(normalizeMessage)
                    .filter(Boolean)
                    .slice(-this.maxMessages)
            };
        }
        return {
            version: CHAT_HISTORY_VERSION,
            updatedAt: normalizeString(loaded?.updatedAt),
            sessions
        };
    }

    persist() {
        this.state.version = CHAT_HISTORY_VERSION;
        this.state.updatedAt = new Date().toISOString();
        const ordered = Object.values(this.state.sessions)
            .sort((left, right) => String(left.updatedAt).localeCompare(String(right.updatedAt)))
            .slice(-this.maxSessions);
        this.state.sessions = Object.fromEntries(ordered.map((entry) => [entry.sessionId, entry]));
        atomicWriteJson(this.statePath, this.state);
    }

    getSession(sessionId = 'main') {
        const normalizedSessionId = normalizeString(sessionId, 'main');
        const session = this.state.sessions[normalizedSessionId];
        return {
            ok: true,
            status: session ? 'loaded' : 'empty',
            sessionId: normalizedSessionId,
            messages: cloneJson(session?.messages || [], []),
            updatedAt: session?.updatedAt || ''
        };
    }

    saveSession(sessionId = 'main', messages = []) {
        const normalizedSessionId = normalizeString(sessionId, 'main');
        const normalizedMessages = (Array.isArray(messages) ? messages : [])
            .map(normalizeMessage)
            .filter(Boolean)
            .slice(-this.maxMessages);
        const updatedAt = new Date().toISOString();
        this.state.sessions[normalizedSessionId] = {
            sessionId: normalizedSessionId,
            updatedAt,
            messages: normalizedMessages
        };
        this.persist();
        return {
            ok: true,
            status: 'saved',
            sessionId: normalizedSessionId,
            messageCount: normalizedMessages.length,
            updatedAt
        };
    }

    clearSession(sessionId = 'main') {
        const normalizedSessionId = normalizeString(sessionId, 'main');
        const existed = Boolean(this.state.sessions[normalizedSessionId]);
        delete this.state.sessions[normalizedSessionId];
        this.persist();
        return {
            ok: true,
            status: existed ? 'cleared' : 'already_empty',
            sessionId: normalizedSessionId
        };
    }

    getStatus() {
        return {
            ok: true,
            version: CHAT_HISTORY_VERSION,
            rootDir: this.rootDir,
            statePath: this.statePath,
            sessionCount: Object.keys(this.state.sessions).length,
            updatedAt: this.state.updatedAt
        };
    }
}

module.exports = {
    AILISChatHistoryStore,
    CHAT_HISTORY_VERSION,
    normalizeChatHistoryMessage: normalizeMessage
};
