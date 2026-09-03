import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const https = require('node:https');
const {
    callCodexModelBridge,
    codexResponsesInputItems,
    clearCodexTurnState,
    stableUuidFromSeed
} = require('../electron/codex-model-bridge.cjs');

function parseArgs(argv) {
    const options = {
        audit: '',
        variant: 'current',
        rounds: 5,
        paddingChars: 12000,
        model: 'gpt-5.6-luna',
        reasoningEffort: 'low'
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--audit') options.audit = argv[++index];
        else if (arg === '--variant') options.variant = argv[++index];
        else if (arg === '--rounds') options.rounds = Math.max(2, Number(argv[++index]) || 5);
        else if (arg === '--padding-chars') options.paddingChars = Math.max(0, Number(argv[++index]) || 0);
        else if (arg === '--model') options.model = argv[++index];
        else if (arg === '--reasoning-effort') options.reasoningEffort = argv[++index];
        else throw new Error(`Unknown argument: ${arg}`);
    }
    if (!options.audit) throw new Error('--audit <protocol-audit.jsonl> is required');
    if (!['current', 'stable-request-id'].includes(options.variant)) {
        throw new Error('--variant must be current or stable-request-id');
    }
    return options;
}

function compact(result = {}) {
    return {
        ok: result.ok === true,
        code: result.code || '',
        responseId: result.providerMessage?.responseId || '',
        turnStateReused: result.providerMessage?.turnStateReused === true,
        turnStateReceived: result.providerMessage?.turnStateReceived === true,
        usage: result.usage || null,
        toolCalls: Array.isArray(result.toolCalls) ? result.toolCalls.length : 0
    };
}

const options = parseArgs(process.argv.slice(2));
const runSeed = `ailis-cache-transport-${options.variant}-${Date.now()}`;
const stableRequestId = stableUuidFromSeed(runSeed);
const promptCacheKey = stableUuidFromSeed(`cache-key:${runSeed}`);
const auditPath = path.resolve(options.audit);

const originalRequest = https.request;
https.request = function patchedRequest(requestOptions, callback) {
    let nextOptions = requestOptions;
    if (
        options.variant === 'stable-request-id' &&
        requestOptions &&
        String(requestOptions.path || '').includes('/backend-api/codex/responses')
    ) {
        nextOptions = {
            ...requestOptions,
            headers: {
                ...(requestOptions.headers || {}),
                'x-client-request-id': stableRequestId
            }
        };
    }
    return originalRequest.call(https, nextOptions, callback);
};

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
const paddingSeed = ' Stable diagnostic cache-prefix padding.';
const padding = paddingSeed.repeat(Math.ceil(options.paddingChars / paddingSeed.length)).slice(0, options.paddingChars);
const instructions = `Always call probe_echo exactly once with the next integer value. Do not answer in text.${padding}`;
const settings = {
    model: options.model,
    reasoningEffort: options.reasoningEffort,
    timeoutMs: 180000,
    codexBridgeMaxAttempts: 1,
    codexProtocolAuditPath: auditPath,
    codexProtocolAuditMode: 'full'
};
let input = [{
    type: 'message',
    role: 'user',
    content: [{ type: 'input_text', text: 'Start the deterministic cache transport probe.' }]
}];
const results = [];
const keepAlive = setInterval(() => {}, 1000);

try {
    clearCodexTurnState(promptCacheKey);
    for (let round = 1; round <= options.rounds; round += 1) {
        const result = await callCodexModelBridge(settings, {
            instructions,
            input,
            tools: [tool],
            toolChoice: { name: 'probe_echo' },
            parallel_tool_calls: false,
            prompt_cache_key: promptCacheKey
        });
        results.push({ round, ...compact(result) });
        if (!result.ok || !result.toolCalls?.[0]) break;
        input = [
            ...input,
            ...codexResponsesInputItems(result.providerMessage?.responseItems || [], [tool]),
            {
                type: 'function_call_output',
                call_id: result.toolCalls[0].id,
                output: String(round)
            }
        ];
    }
    const inputTokens = results.reduce((sum, row) => sum + Number(row.usage?.promptTokens || 0), 0);
    const cachedTokens = results.reduce((sum, row) => sum + Number(row.usage?.cachedTokens || 0), 0);
    process.stdout.write(`${JSON.stringify({
        variant: options.variant,
        auditPath,
        promptCacheKey,
        stableRequestId: options.variant === 'stable-request-id' ? stableRequestId : '',
        inputTokens,
        cachedTokens,
        cacheRatePercent: inputTokens ? Number((cachedTokens / inputTokens * 100).toFixed(2)) : 0,
        results
    }, null, 2)}\n`);
} finally {
    https.request = originalRequest;
    clearCodexTurnState(promptCacheKey);
    clearInterval(keepAlive);
}
