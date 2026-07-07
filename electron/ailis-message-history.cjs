function normalizeHistoryText(value = '') {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function getHistoryEntryRole(entry = {}) {
    return entry?.role === 'assistant' ? 'assistant' : 'user';
}

function getHistoryEntryText(entry = {}) {
    return normalizeHistoryText(entry?.content || entry?.text || entry?.message || '');
}

function dropTrailingDuplicateUserMessage(messageHistory = [], message = '') {
    const history = Array.isArray(messageHistory) ? messageHistory : [];
    const currentMessage = normalizeHistoryText(message);
    if (!history.length || !currentMessage) {
        return history;
    }
    const latestEntry = history[history.length - 1] || {};
    if (getHistoryEntryRole(latestEntry) === 'user' && getHistoryEntryText(latestEntry) === currentMessage) {
        return history.slice(0, -1);
    }
    return history;
}

function buildMessageHistorySearchText(message = '', messageHistory = [], { maxHistoryItems = 6 } = {}) {
    const history = dropTrailingDuplicateUserMessage(messageHistory, message);
    const itemLimit = Math.max(0, Math.min(Number(maxHistoryItems) || 0, 32));
    return [
        normalizeHistoryText(message),
        ...history.slice(-itemLimit).map(getHistoryEntryText)
    ].filter(Boolean).join('\n');
}

module.exports = {
    buildMessageHistorySearchText,
    dropTrailingDuplicateUserMessage,
    getHistoryEntryText,
    normalizeHistoryText
};
