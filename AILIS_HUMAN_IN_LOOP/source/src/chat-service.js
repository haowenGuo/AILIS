import { AILISDesktopChatService } from './ailis-chat-service.js';
import { createAilisCompanionChatService } from './ailis-companion-chat-service.js';
import { AILISHostedGatewayClient } from './ailis-hosted-gateway-client.js';
import { CONFIG } from './config.js';

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
    const hostedAgentAvailable = Boolean(
        window.ailisDesktop?.platform !== 'electron' &&
        CONFIG.HOSTED_AGENT_ENABLED &&
        CONFIG.BACKEND_BASE_URL
    );
    const useDesktopAgent = mode === 'assistant' && desktopAgentAvailable;
    const useHostedAgent = mode === 'assistant' && !useDesktopAgent && hostedAgentAvailable;
    const service = useDesktopAgent
        ? new AILISDesktopChatService({ runtimeKind: 'desktop' })
        : useHostedAgent
            ? new AILISDesktopChatService({
                  gateway: new AILISHostedGatewayClient(),
                  runtimeKind: 'hosted'
              })
            : createAilisCompanionChatService();
    service.conversationMode = useDesktopAgent || useHostedAgent ? 'assistant' : 'daily';
    return service;
}
