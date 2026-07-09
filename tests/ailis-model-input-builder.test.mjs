import assert from 'node:assert/strict';
import test from 'node:test';
import {
    buildModelInput,
    responseItemsToChatMessages,
    restoreModelInputContextManagerFromCheckpoint,
    toolOutputToModelInputItems
} from '../electron/ailis-model-input-builder.cjs';
import responseModel from '../electron/ailis-response-model.cjs';
import contextManagerModule from '../electron/ailis-context-manager.cjs';
import toolRouterModule from '../electron/ailis-tool-router.cjs';
import promptModel from '../electron/ailis-prompt-model.cjs';

const {
    ContentItem,
    FunctionCallOutputPayload,
    ResponseItem,
    responseItemsToWireItems
} = responseModel;
const { ContextManager } = contextManagerModule;
const { ToolRouter, buildToolRouterFromModelVisibleSpecs } = toolRouterModule;
const { CompactedItem, ContextCompactionItem, Prompt, RolloutItem, TurnContextItem } = promptModel;

test('toolOutputToModelInputItems emits Responses function call and output pair', () => {
    const items = toolOutputToModelInputItems({
        id: 'inspect-1',
        tool: 'artifact_tools',
        args: { action: 'inspect', sessionId: 'arts_1' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                text: '{"usedRange":"A1:I20","fillHistogram":{"F478A7":13}}'
            }
        }
    });

    assert.equal(items.length, 2);
    assert.equal(items[0].type, 'function_call');
    assert.equal(items[0].name, 'artifact_tools');
    assert.equal(items[0].call_id, 'inspect-1');
    assert.equal(items[1].type, 'function_call_output');
    assert.equal(items[1].call_id, 'inspect-1');
    assert.match(FunctionCallOutputPayload.toText(items[1].output), /F478A7/);
    assert.equal(items[1].output.body.kind, 'text');
});

test('toolOutputToModelInputItems exposes exec output store handles to the model', () => {
    const items = toolOutputToModelInputItems({
        id: 'exec-long-1',
        tool: 'exec',
        args: { command: 'python dump.py' },
        response: {
            ok: true,
            status: 'completed',
            details: {
                outputId: 'exec-long-1',
                outputBytes: 4096,
                outputLineCount: 120,
                outputPreviewTruncated: true,
                outputStore: {
                    outputId: 'exec-long-1',
                    bytes: 4096,
                    lineCount: 120,
                    previewTruncated: true
                }
            },
            result: {
                text: 'MODEL_VISIBLE_CONTENT_TRUNCATED:\n<truncated omitted_approx_tokens="512" />\n--- preview ---\nlarge output preview'
            }
        }
    });

    const text = FunctionCallOutputPayload.toText(items[1].output);

    assert.match(text, /OutputArtifact: outputId=exec-long-1 bytes=4096 lines=120 previewTruncated=true/);
    assert.match(text, /OutputArtifactTools: output_read \{"outputId":"exec-long-1"\}/);
    assert.match(text, /output_search \{"outputId":"exec-long-1","query":"<text>"\}/);
    assert.match(text, /Do not rerun|instead of rerunning/i);
});

test('tool_search step uses tool_search_call and tool_search_output item names', () => {
    const items = toolOutputToModelInputItems({
        id: 'search-1',
        tool: 'tool_search',
        args: { query: 'artifact_tools xlsx' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                structuredContent: {
                    tools: [{ name: 'artifact_tools' }]
                }
            }
        }
    });

    assert.equal(items.length, 2);
    assert.equal(items[0].type, 'tool_search_call');
    assert.equal(items[1].type, 'tool_search_output');
    assert.deepEqual(items[1].tools, [{
        id: 'artifact_tools',
        name: 'artifact_tools',
        server: '',
        tool: 'artifact_tools',
        description: 'artifact_tools',
        required: [],
        properties: [],
        spec_ref: 'tool_registry:artifact_tools'
    }]);
});

test('tool_search output keeps only compact tool index fields in model history', () => {
    const items = toolOutputToModelInputItems({
        id: 'search-compact-1',
        tool: 'tool_search',
        args: { query: 'youtube video analysis' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                structuredContent: {
                    tools: [{
                        id: 'mcp__ailis_research__web_research',
                        name: 'mcp__ailis_research__web_research',
                        server: 'ailis_research',
                        tool: 'web_research',
                        description: 'Search the web and return structured evidence. '.repeat(20),
                        input_schema: {
                            type: 'object',
                            required: ['query'],
                            properties: {
                                query: { type: 'string', description: 'Search query. '.repeat(30) },
                                maxResults: { type: 'number', description: 'Maximum results.' },
                                timeoutMs: { type: 'number', description: 'Timeout.' }
                            }
                        },
                        schema_properties: ['query', 'maxResults', 'timeoutMs'],
                        spec: {
                            type: 'function',
                            name: 'mcp__ailis_research__web_research',
                            description: 'Duplicated model-facing function spec.',
                            parameters: {
                                type: 'object',
                                required: ['query'],
                                properties: {
                                    query: { type: 'string', description: 'Duplicated query schema.' }
                                }
                            }
                        },
                        call_pattern: {
                            tool: 'mcp__ailis_research__web_research',
                            args: { query: '<query>', maxResults: '<maxResults>', timeoutMs: '<timeoutMs>' }
                        }
                    }]
                }
            }
        }
    });

    const [tool] = items[1].tools;
    assert.deepEqual(Object.keys(tool), [
        'id',
        'name',
        'server',
        'tool',
        'description',
        'required',
        'properties',
        'spec_ref'
    ]);
    assert.deepEqual(tool.required, ['query']);
    assert.deepEqual(tool.properties, ['query', 'maxResults', 'timeoutMs']);
    assert.equal(tool.spec_ref, 'tool_registry:mcp__ailis_research__web_research');
    assert.equal(Object.hasOwn(tool, 'input_schema'), false);
    assert.equal(Object.hasOwn(tool, 'spec'), false);
    assert.equal(Object.hasOwn(tool, 'call_pattern'), false);
    assert.ok(JSON.stringify(items[1]).length < 900);
});

test('tool_search output never exposes object-coerced schema property names', () => {
    const items = toolOutputToModelInputItems({
        id: 'search-schema-object-1',
        tool: 'tool_search',
        args: { query: 'web search' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                structuredContent: {
                    tools: [{
                        id: 'mcp__ailis_research__web_search',
                        name: 'mcp__ailis_research__web_search',
                        description: 'Search the web.',
                        input_schema: {
                            type: 'object',
                            required: ['query'],
                            properties: {
                                query: { type: 'string' }
                            }
                        },
                        schema_properties: [
                            { name: 'query' },
                            { key: 'maxResults' },
                            { unexpected: 'ignored' },
                            'timeoutMs'
                        ]
                    }]
                }
            }
        }
    });

    assert.deepEqual(items[1].tools[0].properties, ['query', 'maxResults', 'timeoutMs']);
    assert.equal(items[1].tools[0].properties.includes('[object Object]'), false);
});

test('web research tool output is projected as web_search_call plus content_items, not a faux Codex text label', () => {
    const items = toolOutputToModelInputItems({
        id: 'web-research-1',
        tool: 'mcp__ailis_research__web_research',
        args: { query: '终末地 洛茜 攻略' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: 'AILIS web research evidence bundle:\nCodex object: web_search_call action=search\nlarge legacy text'
                }],
                structuredContent: {
                    webSearchOutput: {
                        type: 'function_call_output',
                        webSearchCall: {
                            type: 'web_search_call',
                            status: 'completed',
                            action: {
                                type: 'search',
                                query: '终末地 洛茜 攻略',
                                search_context_size: 'medium'
                            }
                        },
                        search: {
                            candidates: [{
                                title: '终末地洛茜攻略',
                                url: 'https://example.test/loxi',
                                snippet: '技能、配队、装备与实战手法。'
                            }]
                        },
                        fetch: {
                            sources: [{
                                title: '终末地洛茜攻略',
                                url: 'https://example.test/loxi',
                                host: 'example.test',
                                status: 'completed',
                                pageType: 'html',
                                evidenceSnippets: ['洛茜定位为辅助，攻略包含技能与队伍。']
                            }]
                        },
                        execution: {
                            mode: 'bounded_parallel',
                            durationMs: 1234,
                            pipeline: [{ stage: 'search', status: 'completed', note: 'results=1' }]
                        },
                        retrievalDiagnostics: {
                            fetchedPageCount: 1,
                            blockedPageCount: 0
                        }
                    }
                }
            }
        }
    });

    assert.equal(items.length, 3);
    assert.equal(items[0].type, 'function_call');
    assert.equal(items[1].type, 'web_search_call');
    assert.equal(items[1].action.type, 'search');
    assert.equal(items[1].action.query, '终末地 洛茜 攻略');
    assert.equal(items[2].type, 'function_call_output');
    assert.equal(items[2].output.body.kind, 'content_items');
    const text = FunctionCallOutputPayload.toText(items[2].output);
    assert.match(text, /Search results:/);
    assert.match(text, /Sources:/);
    assert.match(text, /source:1/);
    assert.doesNotMatch(text, /Codex object: web_search_call/);
});

test('tool_search preserves provider reasoning metadata for chat provider round-trip', () => {
    const items = toolOutputToModelInputItems({
        id: 'search-1',
        tool: 'tool_search',
        args: { query: 'Moon minimum perigee' },
        nativeToolCall: {
            id: 'search-1',
            name: 'tool_search',
            arguments: { query: 'Moon minimum perigee' },
            providerMetadata: { reasoning_content: 'think-before-tool-search' }
        },
        response: {
            ok: true,
            status: 'completed',
            result: {
                structuredContent: {
                    tools: [{ name: 'mcp__ailis_research__web_fetch' }]
                }
            }
        }
    });

    assert.equal(items[0].type, 'tool_search_call');
    assert.deepEqual(items[0].provider_metadata, { reasoning_content: 'think-before-tool-search' });

    const messages = responseItemsToChatMessages({
        instructions: 'base instructions',
        input: items
    });

    assert.equal(messages[1].role, 'assistant');
    assert.deepEqual(messages[1].providerMetadata, { reasoning_content: 'think-before-tool-search' });
    assert.equal(messages[1].tool_calls[0].function.name, 'tool_search');
});

test('buildModelInput keeps user message and prior tool observations in one ordered input list', () => {
    const input = buildModelInput({
        message: 'What color is the 11th landing cell?',
        toolOutputs: [{
            id: 'query-1',
            tool: 'artifact_tools',
            args: { action: 'query', range: 'A1:I20' },
            response: {
                ok: true,
                status: 'completed',
                result: { text: '{"matrixRows":[["START"],["END"]]}' }
            }
        }]
    });

    assert.equal(input[0].type, 'message');
    assert.equal(input[0].role, 'user');
    assert.equal(input[1].type, 'function_call');
    assert.equal(input[2].type, 'function_call_output');
});

test('buildModelInput drops trailing duplicate current user message from history', () => {
    const input = buildModelInput({
        message: 'Solve this GAIA task with a Python verifier.',
        messageHistory: [
            { role: 'user', content: '你好呀' },
            { role: 'assistant', content: '你好，我在。' },
            { role: 'user', content: 'Solve this GAIA task with a Python verifier.' }
        ],
        memoryContext: 'Project memory should sit before the current user task.'
    });
    const texts = input
        .filter((item) => item.type === 'message')
        .map((item) => item.content?.[0]?.text || '');

    assert.equal(
        texts.filter((text) => text === 'Solve this GAIA task with a Python verifier.').length,
        1
    );
    assert.match(texts.at(-2), /Project memory/);
    assert.equal(texts.at(-1), 'Solve this GAIA task with a Python verifier.');
});

test('responseItemsToChatMessages preserves native tool call/output pairing for chat providers', () => {
    const messages = responseItemsToChatMessages({
        instructions: 'base instructions',
        input: [
            { type: 'message', role: 'user', content: [{ type: 'input_text', text: 'hello' }] },
            {
                type: 'function_call',
                name: 'artifact_tools',
                arguments: '{"action":"inspect"}',
                call_id: 'call_1',
                provider_metadata: { reasoning_content: 'hidden-provider-reasoning' }
            },
            {
                type: 'function_call_output',
                call_id: 'call_1',
                output: 'Status: completed\nOutput:\n{}'
            }
        ]
    });

    assert.equal(messages[0].role, 'system');
    assert.equal(messages[1].role, 'user');
    assert.equal(messages[2].role, 'assistant');
    assert.deepEqual(messages[2].providerMetadata, { reasoning_content: 'hidden-provider-reasoning' });
    assert.equal(messages[2].tool_calls[0].function.name, 'artifact_tools');
    assert.equal(messages[3].role, 'tool');
    assert.equal(messages[3].tool_call_id, 'call_1');
});

test('FunctionCallOutputPayload serializes to Responses wire output without losing internal success', () => {
    const item = ResponseItem.functionCallOutput({
        call_id: 'call_payload',
        output: FunctionCallOutputPayload.fromText('payload-ok', { success: true })
    });

    assert.equal(item.output.success, true);
    assert.equal(FunctionCallOutputPayload.toText(item.output), 'payload-ok');

    const [wire] = responseItemsToWireItems([item]);
    assert.equal(wire.type, 'function_call_output');
    assert.equal(wire.output, 'payload-ok');
    assert.equal(Object.prototype.hasOwnProperty.call(wire, 'success'), false);
});

test('ResponseItem strips provider metadata from Responses wire output', () => {
    const item = ResponseItem.functionCall({
        name: 'artifact_tools',
        arguments: { action: 'inspect' },
        call_id: 'call_provider_meta',
        provider_metadata: { reasoning_content: 'provider-only' }
    });

    assert.equal(item.provider_metadata.reasoning_content, 'provider-only');

    const [wire] = responseItemsToWireItems([item]);
    assert.equal(wire.type, 'function_call');
    assert.equal(Object.prototype.hasOwnProperty.call(wire, 'provider_metadata'), false);
});

test('ResponseItem strips provider metadata from tool_search_call wire output', () => {
    const item = ResponseItem.toolSearchCall({
        call_id: 'call_search_meta',
        arguments: { query: 'Moon perigee' },
        provider_metadata: { reasoning_content: 'provider-only' }
    });

    assert.equal(item.provider_metadata.reasoning_content, 'provider-only');

    const [wire] = responseItemsToWireItems([item]);
    assert.equal(wire.type, 'tool_search_call');
    assert.equal(Object.prototype.hasOwnProperty.call(wire, 'provider_metadata'), false);
});

test('ContextManager records ResponseItems and normalizes orphan outputs before prompt', () => {
    const history = new ContextManager();
    history.recordItems([
        ResponseItem.functionCall({
            name: 'artifact_tools',
            arguments: { action: 'inspect' },
            call_id: 'call_1'
        }),
        ResponseItem.functionCallOutput({
            call_id: 'orphan',
            output: 'should disappear'
        })
    ]);

    const promptItems = history.forPrompt();
    assert.equal(promptItems.length, 2);
    assert.equal(promptItems[0].type, 'function_call');
    assert.equal(promptItems[1].type, 'function_call_output');
    assert.equal(promptItems[1].call_id, 'call_1');
    assert.match(FunctionCallOutputPayload.toText(promptItems[1].output), /did not produce an output/);
});

test('ContextManager checkpoint round-trips Codex ContextManager history', () => {
    const history = new ContextManager();
    history.recordItems(toolOutputToModelInputItems({
        id: 'query-1',
        tool: 'artifact_tools',
        args: { action: 'query', sessionId: 'arts_1', range: 'Sheet1!A1:I20' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                text: '{"compactRows":[{"ref":"A1","value":"START"}],"truncated":false}'
            }
        }
    }));

    const checkpoint = history.toCheckpoint();
    const restored = restoreModelInputContextManagerFromCheckpoint(checkpoint);
    const promptItems = restored.forPrompt();

    assert.deepEqual(Object.keys(checkpoint).sort(), [
        'history_version',
        'items',
        'reference_context_item',
        'token_info'
    ]);
    assert.equal(promptItems.length, 2);
    assert.deepEqual(promptItems.map((item) => item.type), ['function_call', 'function_call_output']);
    assert.equal(promptItems[0].name, 'artifact_tools');
    assert.match(FunctionCallOutputPayload.toText(promptItems[1].output), /START/);
});

test('ContextManager compacts stale tool observations but keeps recent and complete evidence', () => {
    const history = new ContextManager();
    history.recordItems([ResponseItem.message({ role: 'user', text: 'solve the data task' })]);
    for (let index = 0; index < 8; index += 1) {
        const callId = `call_${index}`;
        const completeEvidence = index === 2
            ? '\nreasoning_ready=true\nPINNED_COMPLETE_EVIDENCE'
            : '';
        history.recordItems([
            ResponseItem.functionCall({
                name: 'exec',
                arguments: { command: `python step_${index}.py` },
                call_id: callId
            }),
            ResponseItem.functionCallOutput({
                call_id: callId,
                output: `Status: completed\nOutput:\n${'old-observation '.repeat(140)}${completeEvidence}`
            })
        ]);
    }

    const outputs = history.forPrompt()
        .filter((item) => item.type === 'function_call_output')
        .map((item) => FunctionCallOutputPayload.toText(item.output));

    assert.match(outputs[0], /OLDER_TOOL_OBSERVATION_COMPACTED/);
    assert.match(outputs[0], /originalTextChars=/);
    assert.doesNotMatch(outputs[2], /OLDER_TOOL_OBSERVATION_COMPACTED/);
    assert.match(outputs[2], /PINNED_COMPLETE_EVIDENCE/);
    assert.doesNotMatch(outputs[7], /OLDER_TOOL_OBSERVATION_COMPACTED/);
});

test('ToolRouter keeps final_answer last while applying model visible limit', () => {
    const router = buildToolRouterFromModelVisibleSpecs(
        [
            { type: 'function', name: 'artifact_tools', parameters: { type: 'object' } },
            { type: 'function', name: 'tool_search', parameters: { type: 'object' } },
            { type: 'function', name: 'exec', parameters: { type: 'object' } }
        ],
        {
            limit: 3,
            finalToolName: 'final_answer',
            finalToolSpec: { type: 'function', name: 'final_answer', parameters: { type: 'object' } }
        }
    );

    assert.deepEqual(
        router.modelVisibleSpecs().map((tool) => tool.name),
        ['artifact_tools', 'tool_search', 'final_answer']
    );
});

test('ToolRouter marks read-only search/fetch tools as parallel-safe but keeps mutating tools serial', () => {
    const router = buildToolRouterFromModelVisibleSpecs([
        { type: 'function', name: 'tool_search', parameters: { type: 'object' } },
        { type: 'function', name: 'mcp__ailis_research__web_fetch', parameters: { type: 'object' } },
        { type: 'function', name: 'exec', parameters: { type: 'object' } },
        {
            type: 'function',
            name: 'custom_readonly',
            annotations: { readOnlyHint: true },
            parameters: { type: 'object' }
        }
    ]);

    assert.equal(router.toolSupportsParallel({ tool: 'tool_search' }), true);
    assert.equal(router.toolSupportsParallel({ tool: 'mcp__ailis_research__web_fetch' }), true);
    assert.equal(router.toolSupportsParallel({ tool: 'custom_readonly' }), true);
    assert.equal(router.toolSupportsParallel({ tool: 'exec' }), false);
});

test('ContextManager inserts missing outputs directly after function and local shell calls', () => {
    const history = new ContextManager();
    history.recordItems([
        ResponseItem.functionCall({
            name: 'artifact_tools',
            arguments: { action: 'inspect' },
            call_id: 'call_function'
        }),
        ResponseItem.message({ role: 'assistant', text: 'between calls' }),
        ResponseItem.localShellCall({
            call_id: 'call_shell',
            action: { command: 'echo ok' }
        })
    ]);

    const promptItems = history.forPrompt();

    assert.deepEqual(promptItems.map((item) => item.type), [
        'function_call',
        'function_call_output',
        'message',
        'local_shell_call',
        'function_call_output'
    ]);
    assert.equal(promptItems[1].call_id, 'call_function');
    assert.equal(promptItems[4].call_id, 'call_shell');
    assert.equal(FunctionCallOutputPayload.success(promptItems[4].output), false);
    assert.equal(FunctionCallOutputPayload.toText(promptItems[4].output), 'aborted');
});

test('ContextManager preserves server tool_search_output even when it has no local call', () => {
    const history = new ContextManager();
    history.recordItems([
        ResponseItem.toolSearchOutput({
            execution: 'server',
            status: 'completed',
            tools: [{ name: 'artifact_tools' }]
        }),
        ResponseItem.functionCallOutput({
            call_id: 'orphan',
            output: 'drop me'
        })
    ]);

    const promptItems = history.forPrompt();

    assert.equal(promptItems.length, 1);
    assert.equal(promptItems[0].type, 'tool_search_output');
    assert.equal(promptItems[0].execution, 'server');
    assert.deepEqual(promptItems[0].tools, [{ name: 'artifact_tools' }]);
});

test('ResponseItem.message preserves Codex developer role', () => {
    const item = ResponseItem.message({
        role: 'developer',
        text: 'developer instruction'
    });

    assert.equal(item.role, 'developer');
    assert.equal(item.content[0].type, 'input_text');
    assert.equal(item.content[0].text, 'developer instruction');
});

test('ContextManager replaces unsupported images with placeholders and clears generated image payloads', () => {
    const history = new ContextManager();
    history.recordItems([
        ResponseItem.message({
            role: 'user',
            content: [
                ContentItem.inputText('look at this'),
                ContentItem.inputImage({ image_url: 'data:image/png;base64,abc', detail: 'high' })
            ]
        }),
        ResponseItem.functionCall({
            name: 'artifact_tools',
            arguments: { action: 'render' },
            call_id: 'render_1'
        }),
        ResponseItem.functionCallOutput({
            call_id: 'render_1',
            output: FunctionCallOutputPayload.fromContentItems([
                ContentItem.inputImage({ image_url: 'file:///tmp/render.png' }),
                ContentItem.inputText('render metadata')
            ])
        }),
        ResponseItem.imageGenerationCall({
            id: 'img_1',
            status: 'completed',
            result: 'base64-image-data'
        })
    ]);

    const promptItems = history.forPrompt({ inputModalities: ['text'] });
    const message = promptItems.find((item) => item.type === 'message');
    const output = promptItems.find((item) => item.type === 'function_call_output');
    const imageGeneration = promptItems.find((item) => item.type === 'image_generation_call');

    assert.deepEqual(message.content.map((part) => part.type), ['input_text', 'input_text']);
    assert.match(message.content.map((part) => part.text).join('\n'), /image content omitted/);
    assert.match(FunctionCallOutputPayload.toText(output.output), /image content omitted/);
    assert.match(FunctionCallOutputPayload.toText(output.output), /render metadata/);
    assert.equal(imageGeneration.result, '');
});

test('ToolRouter.buildToolCall converts ResponseItems into executable tool calls', () => {
    const functionToolCall = ToolRouter.buildToolCall(ResponseItem.functionCall({
        namespace: 'mcp',
        name: 'artifact_tools',
        arguments: { action: 'inspect', range: 'A1:B2' },
        call_id: 'call_artifact'
    }));
    const customToolCall = ToolRouter.buildToolCall(ResponseItem.customToolCall({
        name: 'freeform_tool',
        input: 'raw payload',
        call_id: 'call_custom'
    }));
    const localShellToolCall = ToolRouter.buildToolCall(ResponseItem.localShellCall({
        action: { command: 'echo ok' },
        call_id: 'call_shell'
    }));
    const serverToolSearch = ToolRouter.buildToolCall(ResponseItem.toolSearchCall({
        call_id: 'search_server',
        execution: 'server',
        arguments: { query: 'artifact_tools' }
    }));

    assert.equal(functionToolCall.toolName, 'mcp__artifact_tools');
    assert.equal(functionToolCall.callId, 'call_artifact');
    assert.deepEqual(functionToolCall.args, { action: 'inspect', range: 'A1:B2' });
    assert.equal(customToolCall.toolName, 'freeform_tool');
    assert.deepEqual(customToolCall.args, { input: 'raw payload' });
    assert.equal(localShellToolCall, null);
    assert.equal(serverToolSearch, null);
});

test('Prompt model preserves Codex-shaped request fields', () => {
    const prompt = Prompt.create({
        input: [ResponseItem.message({ role: 'user', text: 'hello' })],
        tools: [{ type: 'function', name: 'artifact_tools', parameters: { type: 'object' } }],
        parallel_tool_calls: false,
        base_instructions: { text: 'base instructions\n' },
        personality: { tone: 'direct' },
        output_schema: { type: 'object', properties: { answer: { type: 'string' } } }
    });
    const payload = Prompt.toRequestPayload(prompt, { includePromptObject: true });

    assert.deepEqual(Object.keys(prompt).sort(), [
        'base_instructions',
        'input',
        'output_schema',
        'output_schema_strict',
        'parallel_tool_calls',
        'personality',
        'tools'
    ]);
    assert.equal(payload.instructions, 'base instructions\n');
    assert.equal(payload.parallel_tool_calls, false);
    assert.equal(payload.tool_choice, 'auto');
    assert.equal(payload.input[0].type, 'message');
    assert.equal(payload.tools[0].name, 'artifact_tools');
    assert.deepEqual(payload.prompt, prompt);
});

test('ContextManager installs CompactedItem replacement_history as canonical history', () => {
    const history = new ContextManager();
    history.recordItems([
        ResponseItem.message({ role: 'user', text: 'old task' }),
        ResponseItem.functionCall({
            name: 'artifact_tools',
            arguments: { action: 'query' },
            call_id: 'old_call'
        }),
        ResponseItem.functionCallOutput({
            call_id: 'old_call',
            output: 'large old output'
        })
    ]);
    const replacement = [
        ResponseItem.message({
            role: 'user',
            text: 'current task summary'
        }),
        ResponseItem.message({
            role: 'assistant',
            text: 'Known facts: START=A1, END=I20.'
        })
    ];
    const compactedItem = CompactedItem.create({
        message: 'Compacted summary fallback',
        replacement_history: replacement
    });

    const checkpoint = history.replaceCompactedHistory(compactedItem, {
        cwd: 'F:/AILIS_self_evolution_runtime',
        model: 'doubao'
    });
    const promptItems = history.forPrompt();

    assert.equal(history.historyVersion(), 1);
    assert.equal(checkpoint.reference_context_item.cwd, 'F:/AILIS_self_evolution_runtime');
    assert.equal(promptItems.length, 2);
    assert.match(promptItems[1].content[0].text, /START=A1/);
    assert.deepEqual(RolloutItem.compacted(compactedItem).payload.replacement_history, replacement);
    assert.deepEqual(TurnContextItem.create({ cwd: 'F:/AILIS_self_evolution_runtime' }), {
        cwd: 'F:/AILIS_self_evolution_runtime'
    });
    assert.deepEqual(ContextCompactionItem.create({ id: 'item_1' }), {
        id: 'item_1'
    });
});
