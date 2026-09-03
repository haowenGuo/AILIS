import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const https = require('node:https');
const {
    callCodexModelBridge,
    clearCodexTurnState,
    stableUuidFromSeed
} = require('../electron/codex-model-bridge.cjs');

function parseArgs(argv) {
    const options = {
        audit: '',
        variant: 'control',
        rounds: 3,
        paddingChars: 12000,
        model: 'gpt-5.6-luna',
        reasoningEffort: 'low'
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--audit') options.audit = argv[++index];
        else if (arg === '--variant') options.variant = argv[++index];
        else if (arg === '--rounds') options.rounds = Math.max(2, Number(argv[++index]) || 3);
        else if (arg === '--padding-chars') options.paddingChars = Math.max(0, Number(argv[++index]) || 0);
        else if (arg === '--model') options.model = argv[++index];
        else if (arg === '--reasoning-effort') options.reasoningEffort = argv[++index];
        else throw new Error(`Unknown argument: ${arg}`);
    }
    const variants = [
        'control',
        'stable-request-id',
        'session-ids',
        'session-id-only',
        'thread-id-only',
        'responses-lite',
        'all-turns',
        'responses-lite-all-turns'
    ];
    if (!options.audit) throw new Error('--audit <protocol-audit.jsonl> is required');
    if (!variants.includes(options.variant)) throw new Error(`--variant must be one of: ${variants.join(', ')}`);
    return options;
}

function usageValue(usage, camelKey, snakeKey) {
    return Number(usage?.[camelKey] ?? usage?.[snakeKey] ?? 0) || 0;
}

function cachedValue(usage) {
    return Number(
        usage?.cachedTokens ??
        usage?.prompt_tokens_details?.cached_tokens ??
        usage?.input_tokens_details?.cached_tokens ??
        0
    ) || 0;
}

const options = parseArgs(process.argv.slice(2));
const seed = `ailis-cache-header-ab:${options.variant}:${Date.now()}`;
const sessionId = stableUuidFromSeed(`session:${seed}`);
const promptCacheKey = stableUuidFromSeed(`cache:${seed}`);
const auditPath = path.resolve(options.audit);
const originalRequest = https.request;

https.request = function patchedRequest(requestOptions, callback) {
    let nextOptions = requestOptions;
    if (requestOptions && String(requestOptions.path || '').includes('/backend-api/codex/responses')) {
        const headers = { ...(requestOptions.headers || {}) };
        if (options.variant === 'stable-request-id') {
            headers['x-client-request-id'] = sessionId;
        } else if (options.variant === 'session-ids') {
            headers['session-id'] = sessionId;
            headers['thread-id'] = sessionId;
        } else if (options.variant === 'session-id-only') {
            headers['session-id'] = sessionId;
        } else if (options.variant === 'thread-id-only') {
            headers['thread-id'] = sessionId;
        } else if (options.variant === 'responses-lite' || options.variant === 'responses-lite-all-turns') {
            headers['x-openai-internal-codex-responses-lite'] = 'true';
        }
        nextOptions = { ...requestOptions, headers };
    }
    const request = originalRequest.call(https, nextOptions, callback);
    if (
        requestOptions &&
        String(requestOptions.path || '').includes('/backend-api/codex/responses') &&
        ['all-turns', 'responses-lite-all-turns'].includes(options.variant)
    ) {
        const originalEnd = request.end.bind(request);
        request.end = (chunk, encoding, endCallback) => {
            const body = JSON.parse(Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk));
            body.reasoning = {
                effort: body.reasoning?.effort || options.reasoningEffort,
                context: 'all_turns'
            };
            const rewritten = JSON.stringify(body);
            request.setHeader('Content-Length', Buffer.byteLength(rewritten));
            return originalEnd(rewritten, encoding, endCallback);
        };
    }
    return request;
};

const paddingSeed = ' Stable cache header isolation content.';
const padding = paddingSeed.repeat(Math.ceil(options.paddingChars / paddingSeed.length)).slice(0, options.paddingChars);
const instructions = `Return exactly the word OK and nothing else. Probe nonce: ${sessionId}.${padding}`;
const input = [{
    type: 'message',
    role: 'user',
    content: [{ type: 'input_text', text: 'Return OK.' }]
}];
const settings = {
    model: options.model,
    reasoningEffort: options.reasoningEffort,
    timeoutMs: 120000,
    codexBridgeMaxAttempts: 1,
    codexProtocolAuditPath: auditPath,
    codexProtocolAuditMode: 'full'
};
const results = [];
const keepAlive = setInterval(() => {}, 1000);

try {
    clearCodexTurnState(promptCacheKey);
    for (let round = 1; round <= options.rounds; round += 1) {
        const result = await callCodexModelBridge(settings, {
            instructions,
            input,
            tools: [],
            toolChoice: 'none',
            parallel_tool_calls: false,
            prompt_cache_key: promptCacheKey
        });
        const promptTokens = usageValue(result.usage, 'promptTokens', 'prompt_tokens');
        const cachedTokens = cachedValue(result.usage);
        results.push({
            round,
            ok: result.ok === true,
            code: result.code || '',
            promptTokens,
            cachedTokens,
            cacheRatePercent: promptTokens ? Number((cachedTokens / promptTokens * 100).toFixed(2)) : 0,
            turnStateReused: result.providerMessage?.turnStateReused === true,
            turnStateReceived: result.providerMessage?.turnStateReceived === true,
            responseId: result.providerMessage?.responseId || ''
        });
        if (!result.ok) break;
    }
    const totalInput = results.reduce((sum, row) => sum + row.promptTokens, 0);
    const totalCached = results.reduce((sum, row) => sum + row.cachedTokens, 0);
    process.stdout.write(`${JSON.stringify({
        variant: options.variant,
        promptCacheKey,
        sessionId,
        auditPath,
        totalInput,
        totalCached,
        cacheRatePercent: totalInput ? Number((totalCached / totalInput * 100).toFixed(2)) : 0,
        results
    }, null, 2)}\n`);
} finally {
    https.request = originalRequest;
    clearCodexTurnState(promptCacheKey);
    clearInterval(keepAlive);
}
