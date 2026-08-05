import readline from 'node:readline';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { callDesktopLlmProvider } = require('../../electron/desktop-llm-provider.cjs');

const PROTOCOL_PREFIX = '@@AILIS_CODEX_PROVIDER@@';
let queue = Promise.resolve();

function send(payload) {
    process.stdout.write(`${PROTOCOL_PREFIX}${JSON.stringify(payload)}\n`);
}

async function infer(command) {
    const model = String(command.model || process.env.AILIS_CODEX_MODEL || 'gpt-5.5').trim();
    const reasoningEffort = String(
        command.reasoningEffort || process.env.AILIS_CODEX_REASONING_EFFORT || 'low'
    ).trim();
    const result = await callDesktopLlmProvider(
        {
            provider: 'codex-model-bridge',
            baseUrl: 'codex://chatgpt-oauth',
            model,
            reasoningEffort,
            timeoutMs: Math.max(5000, Number(command.timeoutMs) || 180000)
        },
        {
            messages: Array.isArray(command.messages) ? command.messages : [],
            tools: Array.isArray(command.tools) ? command.tools : [],
            toolChoice: command.toolChoice || 'auto',
            temperature: 0
        }
    );
    send({
        type: 'inference_result',
        requestId: command.requestId,
        ...result
    });
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on('line', (line) => {
    let command;
    try {
        command = JSON.parse(line);
    } catch (error) {
        send({ type: 'protocol_error', error: error.message });
        return;
    }
    if (command.type === 'shutdown') {
        send({ type: 'shutdown_complete', requestId: command.requestId });
        process.exit(0);
    }
    if (command.type !== 'infer') {
        send({
            type: 'protocol_error',
            requestId: command.requestId,
            error: `Unknown command: ${command.type}`
        });
        return;
    }
    queue = queue
        .then(() => infer(command))
        .catch((error) => send({
            type: 'inference_result',
            requestId: command.requestId,
            ok: false,
            code: 'codex_provider_bridge_error',
            error: error?.stack || error?.message || String(error)
        }));
});

process.on('uncaughtException', (error) => send({
    type: 'fatal_error',
    error: error?.stack || String(error)
}));
process.on('unhandledRejection', (error) => send({
    type: 'fatal_error',
    error: error?.stack || String(error)
}));
