'use strict';

// Wire-format capabilities, not model guesses. Unknown providers retain roles.
function chatRolePolicy(settings = {}) {
    let host = '';
    try { host = new URL(settings.baseUrl).hostname.toLowerCase(); } catch {}
    return settings.provider === 'deepseek' || host === 'api.deepseek.com'
        ? 'system-user' : 'preserve';
}

function projectChatRole(message, settings) {
    if (message.role !== 'developer' || chatRolePolicy(settings) === 'preserve') return message.role;
    const text = typeof message.content === 'string' ? message.content
        : (Array.isArray(message.content) ? message.content : []).map(part => part.text || '').join('\n');
    // Recognize runtime envelopes, never classify historical claims by keywords.
    // Background snapshots must not become high-priority instructions on legacy APIs.
    if (/^\s*<(?:memory_context(?:\s|>)|ailis_semantic_task_memory(?:\s|>))/.test(text)) return 'user';
    return 'system';
}

module.exports = { chatRolePolicy, projectChatRole };
