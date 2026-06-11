import { HumanClawDesktopChatService } from './humanclaw-chat-service.js';
import { createAigrilCompanionChatService } from './aigril-companion-chat-service.js';

function normalizeConversationMode(preferences = {}) {
    const mode = String(preferences?.conversationMode || window.aigrilDesktop?.preferences?.conversationMode || 'assistant')
        .trim()
        .toLowerCase();
    return mode === 'daily' ? 'daily' : 'assistant';
}

export function createChatService(preferences = window.aigrilDesktop?.preferences || {}) {
    const mode = normalizeConversationMode(preferences);
    const service = mode === 'daily'
        ? createAigrilCompanionChatService()
        : new HumanClawDesktopChatService();
    service.conversationMode = mode;
    return service;
}
