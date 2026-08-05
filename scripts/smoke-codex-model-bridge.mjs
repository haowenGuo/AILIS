import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { callDesktopLlmProvider } = require('../electron/desktop-llm-provider.cjs');

const model = process.env.AILIS_CODEX_MODEL || 'gpt-5.6-luna';
const reasoningEffort = process.env.AILIS_CODEX_REASONING_EFFORT || 'medium';
const settings = {
    provider: 'codex-model-bridge',
    baseUrl: 'codex://chatgpt-oauth',
    model,
    reasoningEffort,
    timeoutMs: 180000
};
const echoTool = {
    name: 'ailis_health_echo',
    description: 'Return the requested health payload through the AILIS harness.',
    parameters: {
        type: 'object',
        additionalProperties: false,
        properties: {
            ok: { type: 'boolean' },
            kind: { type: 'string' },
            owner: { type: 'string' }
        },
        required: ['ok', 'kind', 'owner']
    }
};
const initialMessages = [
    {
        role: 'system',
        content: 'You are the decision model inside AILIS. Use only tools exposed by AILIS.'
    },
    {
        role: 'user',
        content: 'Call the health tool with ok=true, kind="model_bridge", and owner="AILIS".'
    }
];

const toolDecision = await callDesktopLlmProvider(settings, {
    messages: initialMessages,
    tools: [echoTool],
    toolChoice: { name: echoTool.name }
});
if (!toolDecision.ok || toolDecision.toolCalls?.[0]?.name !== echoTool.name) {
    console.error(JSON.stringify({ stage: 'tool_decision', result: toolDecision }, null, 2));
    process.exit(1);
}

const call = toolDecision.toolCalls[0];
const toolResult = {
    ok: true,
    kind: call.arguments.kind,
    owner: call.arguments.owner,
    executedBy: 'AILIS'
};
const finalDecision = await callDesktopLlmProvider(settings, {
    messages: [
        ...initialMessages,
        {
            role: 'assistant',
            content: toolDecision.content,
            toolCalls: [{
                id: call.id,
                type: 'function',
                function: {
                    name: call.name,
                    arguments: call.rawArguments
                }
            }]
        },
        {
            role: 'tool',
            toolCallId: call.id,
            name: call.name,
            content: JSON.stringify(toolResult)
        }
    ],
    tools: [echoTool],
    toolChoice: 'auto'
});
if (!finalDecision.ok || !finalDecision.content || finalDecision.toolCalls?.length) {
    console.error(JSON.stringify({ stage: 'final_decision', result: finalDecision }, null, 2));
    process.exit(1);
}

console.log(JSON.stringify({
    ok: true,
    model,
    reasoningEffort,
    firstInference: {
        toolCall: call,
        providerMessage: toolDecision.providerMessage,
        usage: toolDecision.usage
    },
    ailisToolResult: toolResult,
    secondInference: {
        content: finalDecision.content,
        providerMessage: finalDecision.providerMessage,
        usage: finalDecision.usage
    }
}, null, 2));
