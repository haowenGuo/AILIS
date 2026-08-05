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
    const desktopAgentAvailable = Boolean(
        window.ailisDesktop?.platform === 'electron' &&
        window.ailisDesktop?.gateway?.isSupported &&
        typeof window.ailisDesktop?.gateway?.runAgent === 'function'
    );
    const useDesktopAgent = mode === 'assistant' && desktopAgentAvailable;
    const service = useDesktopAgent
        ? new AILISDesktopChatService()
        : createAilisCompanionChatService();
    service.conversationMode = useDesktopAgent ? 'assistant' : 'daily';
    return service;
}
