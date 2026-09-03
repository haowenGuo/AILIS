import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    callCodexModelBridge,
    codexResponsesInputItems,
    clearCodexTurnState
} = require('../electron/codex-model-bridge.cjs');

function parseArgs(argv) {
    const options = { audit: '', model: 'gpt-5.6-luna', reasoningEffort: 'low', paddingChars: 0 };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--audit') options.audit = argv[++index];
        else if (arg === '--model') options.model = argv[++index];
        else if (arg === '--reasoning-effort') options.reasoningEffort = argv[++index];
        else if (arg === '--padding-chars') options.paddingChars = Math.max(0, Number(argv[++index]) || 0);
        else throw new Error(`Unknown argument: ${arg}`);
    }
    if (!options.audit) throw new Error('--audit <protocol-audit.jsonl> is required');
    return options;
}

function compact(result = {}) {
    return {
        ok: result.ok === true,
        code: result.code || '',
        responseId: Boolean(result.providerMessage?.responseId),
        turnStateReused: result.providerMessage?.turnStateReused === true,
        turnStateReceived: result.providerMessage?.turnStateReceived === true,
        usage: result.usage || null,
        toolCalls: Array.isArray(result.toolCalls) ? result.toolCalls.length : 0
    };
}

const options = parseArgs(process.argv.slice(2));
const promptCacheKey = `ailis-prefix-probe-${Date.now()}`;
const auditPath = path.resolve(options.audit);
const tool = {
    type: 'function',
    name: 'probe_echo',
    description: 'Return the supplied value unchanged.',
    parameters: {
        type: 'object',
        required: ['value'],
        properties: { value: { type: 'string' } },
        additionalProperties: false
    },
    strict: true
};
const settings = {
    model: options.model,
    reasoningEffort: options.reasoningEffort,
    timeoutMs: 120000,
    codexBridgeMaxAttempts: 1,
    codexProtocolAuditPath: auditPath,
    codexProtocolAuditMode: 'full'
};
const paddingSeed = ' Stable diagnostic cache-prefix padding.';
const padding = paddingSeed.repeat(Math.ceil(options.paddingChars / paddingSeed.length)).slice(0, options.paddingChars);
const instructions = `Use the supplied tool exactly once, then report its result in one word.${padding}`;
const initialInput = [{
    type: 'message',
    role: 'user',
    content: [{ type: 'input_text', text: 'Call probe_echo with value alpha.' }]
}];

const keepAlive = setInterval(() => {}, 1000);
try {
    clearCodexTurnState(promptCacheKey);
    const first = await callCodexModelBridge(settings, {
        instructions,
        input: initialInput,
        tools: [tool],
        toolChoice: { name: 'probe_echo' },
        parallel_tool_calls: false,
        prompt_cache_key: promptCacheKey
    });

    let second = { ok: false, code: 'first_failed' };
    if (first.ok && first.toolCalls?.[0]) {
        const priorItems = codexResponsesInputItems(first.providerMessage?.responseItems || [], [tool]);
        second = await callCodexModelBridge(settings, {
            instructions,
            input: [
                ...initialInput,
                ...priorItems,
                {
                    type: 'function_call_output',
                    call_id: first.toolCalls[0].id,
                    output: 'alpha'
                }
            ],
            tools: [tool],
            toolChoice: { name: 'probe_echo' },
            parallel_tool_calls: false,
            prompt_cache_key: promptCacheKey
        });
    }
    process.stdout.write(`${JSON.stringify({ auditPath, first: compact(first), second: compact(second) }, null, 2)}\n`);
} finally {
    clearInterval(keepAlive);
    clearCodexTurnState(promptCacheKey);
}
