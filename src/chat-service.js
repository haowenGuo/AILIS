import { AILISDesktopChatService } from './ailis-chat-service.js';
import { createAilisCompanionChatService } from './ailis-companion-chat-service.js';

function normalizeConversationMode(preferences = {}) {
    const mode = String(preferences?.conversationMode || window.ailisDesktop?.preferences?.conversationMode || 'assistant')
        .trim()
        .toLowerCase();
    return mode === 'daily' ? 'daily' : 'assistant';
}

export function createChatService(preferences = window.ailisDesktop?.preferences || {}) {
    const mode = normalizeConversationMode(preferences);
    const service = mode === 'daily'
        ? createAilisCompanionChatService()
        : new AILISDesktopChatService();
    service.conversationMode = mode;
    return service;
}
