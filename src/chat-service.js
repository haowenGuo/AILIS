import { AILISDesktopChatService } from './ailis-chat-service.js';
import { createAilisCompanionChatService } from './ailis-companion-chat-service.js';
import { AILISHostedGatewayClient } from './ailis-hosted-gateway-client.js';
import { CONFIG } from './config.js';

export function createChatService() {
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
    const useDesktopAgent = desktopAgentAvailable;
    const useHostedAgent = !useDesktopAgent && hostedAgentAvailable;
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
