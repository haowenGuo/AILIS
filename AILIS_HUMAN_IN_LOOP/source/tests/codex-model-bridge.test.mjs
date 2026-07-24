import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { describe, it } from 'node:test';

const require = createRequire(import.meta.url);
const {
    buildCodexBridgeDecisionSchema,
    buildCodexBridgePrompt,
    buildCodexBridgeTurnInput,
    buildProcessTreeTerminationPlan,
    normalizeBridgeToolCalls,
    normalizeCodexUsage,
    parseCodexAppServerNotifications,
    parseCodexJsonlEvents,
    resolveCodexBridgeMaxAttempts,
    resolveCodexEntrypoint,
    shouldRetryCodexBridgeFailure
} = require('../electron/codex-model-bridge.cjs');
const {
    getDefaultProviderBaseUrl,
    getDefaultProviderModel,
    getProviderCapabilities
} = require('../electron/desktop-llm-provider.cjs');

const visibleTools = [
    {
        name: 'read_document',
        description: 'Read a document through the AILIS harness.',
        parameters: {
            type: 'object',
            additionalProperties: false,
            properties: {
                path: { type: 'string' }
            },
            required: ['path']
        }
    },
    {
        name: 'web_search',
        description: 'Search through the AILIS web backend.',
        parameters: {
            type: 'object',
            additionalProperties: false,
            properties: {
                query: { type: 'string' }
            },
            required: ['query']
        }
    }
];

describe('Codex model bridge process lifecycle', () => {
    it('terminates the full Windows process tree for ephemeral app-server inference', () => {
        assert.deepEqual(buildProcessTreeTerminationPlan(4242, 'win32'), {
            command: 'taskkill.exe',
            args: ['/pid', '4242', '/t', '/f']
        });
    });

    it('uses a detached process-group signal on POSIX and rejects invalid pids', () => {
        assert.deepEqual(buildProcessTreeTerminationPlan(4242, 'linux'), {
            signalPid: -4242,
            signal: 'SIGTERM'
        });
        assert.equal(buildProcessTreeTerminationPlan(0, 'win32'), null);
    });

    it('retries only transient model-only transport failures and caps attempts', () => {
        assert.equal(shouldRetryCodexBridgeFailure({ code: 'timeout' }), true);
        assert.equal(shouldRetryCodexBridgeFailure({
            code: 'codex_process_failed',
            error: 'Codex exited with code 1.'
        }), true);
        assert.equal(shouldRetryCodexBridgeFailure({
            code: 'codex_usage_limited',
            error: 'Usage limit reached.'
        }), false);
        assert.equal(shouldRetryCodexBridgeFailure({
            code: 'codex_process_failed',
            error: 'Authentication required.'
        }), false);
        assert.equal(shouldRetryCodexBridgeFailure({ code: 'cancelled' }), false);
        assert.equal(shouldRetryCodexBridgeFailure({ code: 'invalid_codex_bridge_output' }), false);
        assert.equal(resolveCodexBridgeMaxAttempts({}), 2);
        assert.equal(resolveCodexBridgeMaxAttempts({ codexBridgeMaxAttempts: 9 }), 2);
        assert.equal(resolveCodexBridgeMaxAttempts({ codexBridgeMaxAttempts: 1 }), 1);
    });
});

describe('Codex model bridge', () => {
    it('constrains required decisions to the AILIS-visible tool schema', () => {
        const schema = buildCodexBridgeDecisionSchema(visibleTools, {
            toolChoice: { name: 'read_document' }
        });

        assert.equal(schema.properties.tool_calls.minItems, 1);
        assert.deepEqual(schema.properties.tool_calls.items.properties.name.enum, ['read_document']);
        assert.equal(schema.properties.tool_calls.items.properties.arguments.type, 'object');
        assert.deepEqual(schema.properties.tool_calls.items.properties.arguments.required, ['path']);
        assert.match(schema.properties.tool_calls.items.properties.arguments.description, /do not emit an empty object/i);
        assert.deepEqual(
            schema.properties.tool_calls.items.required,
            ['id', 'name', 'arguments']
        );
    });

    it('uses per-tool argument branches and preserves tools that legitimately accept empty input', () => {
        const schema = buildCodexBridgeDecisionSchema([
            ...visibleTools,
            {
                name: 'handoff_task',
                description: 'Handoff with no model-authored fields.',
                parameters: {
                    type: 'object',
                    properties: {},
                    additionalProperties: false
                }
            }
        ]);
        const branches = schema.properties.tool_calls.items.anyOf;
        const webSearch = branches.find((branch) => branch.properties.name.enum[0] === 'web_search');
        const handoff = branches.find((branch) => branch.properties.name.enum[0] === 'handoff_task');

        assert.deepEqual(webSearch.properties.arguments.required, ['query']);
        assert.deepEqual(handoff.properties.arguments.properties, {});
        assert.match(handoff.properties.arguments.description, /empty object is allowed/i);
    });

    it('compiles optional and minProperties fields into the Codex structured-output subset', () => {
        const schema = buildCodexBridgeDecisionSchema([{
            name: 'web_run',
            parameters: {
                type: 'object',
                minProperties: 1,
                properties: {
                    search_query: {
                        type: 'array',
                        minItems: 1,
                        items: {
                            type: 'object',
                            required: ['q'],
                            properties: {
                                q: { type: 'string', minLength: 1 },
                                recency: { type: 'integer', minimum: 0 }
                            },
                            additionalProperties: false
                        }
                    },
                    open: { type: 'array', items: { type: 'string' } }
                },
                additionalProperties: false
            }
        }]);
        const argumentsSchema = schema.properties.tool_calls.items.properties.arguments;

        assert.equal(argumentsSchema.minProperties, undefined);
        assert.equal(argumentsSchema.anyOf.length, 2);
        assert.deepEqual(argumentsSchema.anyOf[0].required, ['search_query', 'open']);
        assert.equal(argumentsSchema.anyOf[0].properties.search_query.type, 'array');
        assert.equal(argumentsSchema.anyOf[0].properties.open.anyOf[1].type, 'null');
        assert.match(argumentsSchema.anyOf[0].properties.open.anyOf[1].description, /Prefer null unless/i);
        assert.deepEqual(argumentsSchema.anyOf[0].properties.search_query.items.required, ['q', 'recency']);
        assert.equal(
            argumentsSchema.anyOf[0].properties.search_query.items.properties.recency.anyOf[1].type,
            'null'
        );
    });

    it('repairs incomplete array items and object anyOf requirements for dynamic tools', () => {
        const schema = buildCodexBridgeDecisionSchema([{
            name: 'paper_lookup',
            parameters: {
                type: 'object',
                anyOf: [
                    { required: ['title'] },
                    { required: ['author'] }
                ],
                properties: {
                    title: { type: 'string' },
                    author: { type: 'string' },
                    queries: { type: 'array' },
                    mode: { enum: ['exact', 'fuzzy'] }
                },
                additionalProperties: false
            }
        }]);
        const argumentsSchema = schema.properties.tool_calls.items.properties.arguments;

        assert.equal(argumentsSchema.type, 'object');
        assert.equal(argumentsSchema.anyOf, undefined);
        assert.deepEqual(argumentsSchema.required, ['title', 'author', 'queries', 'mode']);
        assert.equal(argumentsSchema.properties.title.anyOf[0].type, 'string');
        assert.equal(argumentsSchema.properties.author.anyOf[1].type, 'null');
        assert.equal(argumentsSchema.properties.queries.anyOf[0].items.type, 'string');
        assert.equal(argumentsSchema.properties.mode.anyOf[0].type, 'string');
    });

    it('preserves type-scrambled fields as model-selected JSON scalars', () => {
        const schema = buildCodexBridgeDecisionSchema([{
            name: 'search_holiday',
            parameters: {
                type: 'object',
                properties: {
                    holiday_name: {
                        description: 'Name of the holiday'
                    },
                    year: {
                        description: 'Optional year to search'
                    }
                },
                required: ['holiday_name']
            }
        }]);
        const argumentsSchema = schema.properties.tool_calls.items.properties.arguments;

        assert.deepEqual(
            argumentsSchema.properties.holiday_name.anyOf.map((branch) => branch.type),
            ['string', 'number', 'boolean']
        );
        assert.deepEqual(
            argumentsSchema.properties.year.anyOf.map((branch) => branch.type),
            ['string', 'number', 'boolean', 'null']
        );
        assert.match(
            argumentsSchema.properties.year.anyOf.at(-1).description,
            /runtime context and plausible defaults are not evidence/i
        );
    });

    it('serializes AILIS-owned messages, tool history, and tool contracts into one inference', () => {
        const prompt = buildCodexBridgePrompt([
            { role: 'system', content: 'AILIS system prompt' },
            {
                role: 'assistant',
                content: '',
                toolCalls: [{ id: 'call_1', name: 'web_search', arguments: { query: 'test' } }]
            },
            { role: 'tool', toolCallId: 'call_1', content: '{"results":["evidence"]}' }
        ], visibleTools, {});

        assert.match(prompt, /AILIS, not Codex, owns context, memory, tool execution/);
        assert.match(prompt, /Do not call or simulate any Codex tool/);
        assert.match(prompt, /AILIS system prompt/);
        assert.match(prompt, /call_1/);
        assert.match(prompt, /evidence/);
        assert.match(prompt, /read_document/);
        assert.match(prompt, /Never emit an empty object/);
        assert.match(prompt, /Do not fill optional fields from runtime dates/i);
        assert.match(prompt, /copy the exact literal text into the first lookup/i);
    });

    it('sends image bytes through native app-server image input instead of embedding base64 in the prompt', async () => {
        const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-codex-vision-'));
        try {
            const dataUrl = `data:image/png;base64,${Buffer.from('not-a-real-png-but-valid-bytes').toString('base64')}`;
            const messages = [{
                role: 'user',
                content: [
                    { type: 'text', text: 'Describe this image.' },
                    { type: 'image_url', image_url: { url: dataUrl }, detail: 'high' }
                ]
            }];
            const prompt = buildCodexBridgePrompt(messages, [], {});
            const input = await buildCodexBridgeTurnInput({ prompt, messages, workspace });

            assert.doesNotMatch(prompt, /bm90LWEtcmVhbC1wbmc/);
            assert.match(prompt, /image_attachment/);
            assert.equal(input[0].type, 'text');
            assert.equal(input[1].type, 'localImage');
            assert.equal(input[1].detail, 'high');
            assert.equal(path.dirname(input[1].path), workspace);
            assert.equal((await fs.stat(input[1].path)).isFile(), true);
        } finally {
            await fs.rm(workspace, { recursive: true, force: true });
        }
    });

    it('rejects Codex harness activity while accepting reasoning and the final model message', () => {
        const audit = parseCodexJsonlEvents([
            JSON.stringify({ type: 'item.completed', item: { id: 'r1', type: 'reasoning' } }),
            JSON.stringify({ type: 'item.completed', item: { id: 'm1', type: 'agent_message' } }),
            JSON.stringify({ type: 'turn.completed', usage: { input_tokens: 10, output_tokens: 4 } }),
            JSON.stringify({ type: 'item.started', item: { id: 'c1', type: 'command_execution' } })
        ].join('\n'));

        assert.deepEqual(audit.usage, { input_tokens: 10, output_tokens: 4 });
        assert.deepEqual(audit.contamination, [{
            eventType: 'item.started',
            itemType: 'command_execution',
            itemId: 'c1'
        }]);
    });

    it('audits app-server turns as model-only and records server-side callbacks as contamination', () => {
        const audit = parseCodexAppServerNotifications([
            {
                method: 'item/completed',
                params: { item: { id: 'u1', type: 'userMessage', content: [] } }
            },
            {
                method: 'item/completed',
                params: { item: { id: 'r1', type: 'reasoning', summary: [], content: [] } }
            },
            {
                method: 'item/completed',
                params: { item: { id: 'm1', type: 'agentMessage', text: '{"content":"OK"}' } }
            },
            {
                method: 'thread/tokenUsage/updated',
                params: { tokenUsage: { last: { inputTokens: 42, outputTokens: 7 } } }
            }
        ], [{ id: 9, method: 'item/tool/call' }]);

        assert.equal(audit.agentText, '{"content":"OK"}');
        assert.deepEqual(audit.usage, { inputTokens: 42, outputTokens: 7 });
        assert.deepEqual(audit.contamination, [{
            method: 'item/tool/call',
            requestId: 9,
            itemType: 'server_request'
        }]);
    });

    it('normalizes bridge decisions to the existing AILIS provider contract', () => {
        const calls = normalizeBridgeToolCalls([
            {
                id: 'bridge_1',
                name: 'web_search',
                arguments: {
                    query: 'GAIA',
                    recency: null,
                    domains: [],
                    nested: { optional: null },
                    artifactHandle: {}
                }
            }
        ]);

        assert.equal(calls[0].id, 'bridge_1');
        assert.equal(calls[0].name, 'web_search');
        assert.deepEqual(calls[0].arguments, { query: 'GAIA' });
        assert.equal(calls[0].rawArguments, '{"query":"GAIA"}');
        assert.equal(calls[0].provider, 'codex-model-bridge');
    });

    it('removes the ephemeral Codex backend cwd from AILIS tool arguments', () => {
        const ephemeralWorkspace = path.join(os.tmpdir(), 'ailis-codex-model-bridge-test', 'workspace');
        const calls = normalizeBridgeToolCalls([
            {
                id: 'bridge_exec',
                name: 'exec',
                arguments: {
                    command: 'python',
                    args: ['script.py'],
                    workdir: ephemeralWorkspace
                }
            },
            {
                id: 'bridge_read',
                name: 'read_document',
                arguments: {
                    path: 'F:\\workspace\\report.docx',
                    cwd: 'F:\\workspace'
                }
            }
        ], { ephemeralWorkspace });

        assert.deepEqual(calls[0].arguments, {
            command: 'python',
            args: ['script.py']
        });
        assert.equal(calls[1].arguments.cwd, 'F:\\workspace');
    });

    it('maps app-server token usage into the existing provider usage contract', () => {
        assert.deepEqual(normalizeCodexUsage({
            totalTokens: 100,
            inputTokens: 70,
            cachedInputTokens: 20,
            outputTokens: 30,
            reasoningOutputTokens: 12
        }), {
            prompt_tokens: 70,
            completion_tokens: 30,
            total_tokens: 100,
            prompt_tokens_details: { cached_tokens: 20 },
            completion_tokens_details: { reasoning_tokens: 12 }
        });
    });

    it('registers ChatGPT OAuth defaults without exposing Codex as an AILIS tool executor', () => {
        const capabilities = getProviderCapabilities({
            provider: 'codex-model-bridge',
            model: 'gpt-5.5'
        });

        assert.equal(getDefaultProviderBaseUrl('codex-model-bridge'), 'codex://chatgpt-oauth');
        assert.equal(getDefaultProviderModel('codex-model-bridge'), 'gpt-5.5');
        assert.equal(capabilities.transport, 'codex-app-server-ephemeral');
        assert.equal(capabilities.nativeToolCalling, true);
        assert.equal(capabilities.vision, true);
        assert.equal(resolveCodexEntrypoint().ok, true);
    });
});
