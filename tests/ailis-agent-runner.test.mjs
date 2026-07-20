import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const {
    recordToolOutputToContextManager
} = require('../electron/ailis-model-input-builder.cjs');
const {
    normalizeToolOutput,
    toolOutputToResponseItems
} = require('../electron/ailis-agent-object-model.cjs');
const {
    AILISAgentRunner,
        assessAgentCompletionEvidence,
        buildAgentDirectToolSpecs,
        buildDirectModelImageAttachments,
        buildInvalidDecisionProgressRecord,
        buildLlmAgentDirectToolPrompt,
    buildResearchProgressState,
        buildStagedAttachmentFilename,
        buildTaskRunHandoffPackage,
        build_forked_context_checkpoint,
        buildToolObservationDigest,
        detectInvalidDecisionNoProgress,
    isAgentLlmSettingsMissing,
    looksLikeLeakedAgentProtocol,
    resolveAgentDirectToolChoice,
    resolveMemoryPolicy,
    stageFileAttachmentsForWorkspace,
    splitNativeProgressNoteArgs,
    stripControlTags,
    validateNativeDirectToolCall
} = require('../electron/ailis-agent-runner.cjs');

test('direct model image attachments are scoped to Codex bridge image inputs', () => {
    const imagePath = path.join('C:', 'tmp', 'board.png');
    const audioPath = path.join('C:', 'tmp', 'speech.mp3');

    assert.deepEqual(buildDirectModelImageAttachments([
        { path: imagePath, name: 'board.png' }
    ], {
        provider: 'codex-model-bridge'
    }), [{
        image_url: imagePath,
        detail: 'original'
    }]);

    assert.deepEqual(buildDirectModelImageAttachments([
        { path: audioPath, name: 'speech.mp3' }
    ], {
        provider: 'codex-model-bridge'
    }), []);

    assert.deepEqual(buildDirectModelImageAttachments([
        { path: imagePath, name: 'board.png' }
    ], {
        provider: 'openai'
    }), []);
});

test('TaskAgent treats perceived optimal-action claims as requiring a domain verifier', () => {
    const prompt = buildLlmAgentDirectToolPrompt({
        message: 'Choose the guaranteed winning move from the attached image.',
        contextMode: 'task_agent',
        modelImageAttachments: [{
            image_url: path.join('C:', 'tmp', 'board.png'),
            detail: 'original'
        }],
        tools: []
    });

    assert.match(prompt.instructions, /perception alone is not verification/i);
    assert.match(prompt.instructions, /domain rules engine, solver, simulator, or validator/i);
    assert.ok(prompt.messages.some((message) =>
        Array.isArray(message.content) &&
        message.content.some((part) => part.type === 'image_url')
    ));
});

test('TaskAgent preserves multiplicity and order for extracted lists', () => {
    const prompt = buildLlmAgentDirectToolPrompt({
        message: 'Extract every value from the image in source order.',
        contextMode: 'task_agent',
        tools: []
    });

    assert.match(prompt.instructions, /preserve every source occurrence/i);
    assert.match(prompt.instructions, /repeated items are evidence, not duplicates to remove/i);
});

test('TaskAgent verifies aggregate-selector winners against entity-level historical labels', () => {
    const prompt = buildLlmAgentDirectToolPrompt({
        message: 'Which two historical birthplace cities are farthest apart?',
        contextMode: 'task_agent',
        tools: []
    });

    assert.match(prompt.instructions, /establish the complete candidate set/i);
    assert.match(prompt.instructions, /complete table of entity labels without the selector metric does not establish the winner/i);
    assert.match(prompt.instructions, /obtain comparable coordinates for the boundary contenders/i);
    assert.match(prompt.instructions, /verify each selected terminal record against an entity-level source/i);
    assert.match(prompt.instructions, /preserve the entity-level source-period label/i);
});

test('TaskAgent keeps tool-returned image artifacts enabled on the next model turn', () => {
    const imagePath = path.join(os.tmpdir(), `ailis-rendered-page-${Date.now()}.png`);
    return fs.writeFile(
        imagePath,
        Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=', 'base64')
    ).then(() => {
        const initial = buildLlmAgentDirectToolPrompt({
            message: 'Inspect the rendered page layout.',
            contextMode: 'task_agent',
            tools: []
        });
        recordToolOutputToContextManager(initial.contextManager, {
            id: 'web-screenshot-context-1',
            tool: 'web_run',
            args: { screenshot: [{ ref_id: 'turn0view0' }] },
            response: {
                ok: true,
                status: 'completed',
                result: {
                    content: [{ type: 'text', text: `Captured screenshot at ${imagePath}` }],
                    structuredContent: {
                        modelImage: {
                            image_url: imagePath,
                            detail: 'original'
                        }
                    }
                }
            }
        });

        const next = buildLlmAgentDirectToolPrompt({
            message: 'Inspect the rendered page layout.',
            contextMode: 'task_agent',
            contextManager: initial.contextManager,
            tools: []
        });
        const screenshotOutput = next.input.find((item) =>
            item?.type === 'function_call_output' &&
            item?.output?.body?.kind === 'content_items'
        );
        assert.ok(screenshotOutput);
        assert.ok(screenshotOutput.output.body.value.some((part) => part.type === 'input_image'));
        assert.ok(next.messages.some((message) =>
            message.role === 'user' &&
            Array.isArray(message.content) &&
            message.content.some((part) =>
                part.type === 'image_url' &&
                /^data:image\/png;base64,/.test(part.image_url?.url || '')
            )
        ));
    }).finally(() => fs.rm(imagePath, { force: true }));
});

test('explicit task execution forces Persona handoff without changing ordinary conversation', () => {
    const handoffSpec = {
        name: 'handoff_task',
        description: 'System TaskAgent handoff.',
        parameters: {
            type: 'object',
            required: [],
            properties: {},
            additionalProperties: false
        }
    };
    const requiredChoice = resolveAgentDirectToolChoice({
        agentRuntimeRole: 'persona_orchestrator',
        requestContext: { requireTaskExecution: true },
        directToolSpecs: [handoffSpec]
    });
    const ordinaryChoice = resolveAgentDirectToolChoice({
        agentRuntimeRole: 'persona_orchestrator',
        requestContext: {},
        directToolSpecs: [handoffSpec]
    });
    const finalChoice = resolveAgentDirectToolChoice({
        agentRuntimeRole: 'persona_orchestrator',
        requestContext: { requireTaskExecution: true },
        directToolSpecs: [handoffSpec],
        safetyFinalizationReason: 'time_budget'
    });

    assert.deepEqual(requiredChoice, { name: 'handoff_task', required: true });
    assert.equal(ordinaryChoice, 'auto');
    assert.equal(finalChoice, 'none');

    const prompt = buildLlmAgentDirectToolPrompt({
        message: 'How many days until the holiday?',
        requireTaskExecution: true,
        tools: [handoffSpec]
    });
    assert.match(prompt.instructions, /explicit task-execution contract/i);
    assert.match(prompt.instructions, /do not answer the task directly/i);
});

test('TaskAgent schema recovery guidance and invalid-decision fuse reject identical retries', () => {
    const invalidDecision = {
        ok: false,
        status: 'invalid_native_tool_args',
        error: 'year is required',
        nativeToolCall: {
            name: 'datetime_info_to_timestamp',
            arguments: {}
        },
        raw: {
            errors: ['year is required', 'month is required'],
            schema: {
                type: 'object',
                required: ['year', 'month'],
                properties: {
                    year: { type: 'integer' },
                    month: { type: 'integer' }
                }
            }
        }
    };
    const first = buildInvalidDecisionProgressRecord(invalidDecision, 0);
    const second = buildInvalidDecisionProgressRecord(invalidDecision, 1);
    const corrected = buildInvalidDecisionProgressRecord({
        ...invalidDecision,
        nativeToolCall: {
            name: 'datetime_info_to_timestamp',
            arguments: { year: 2026, month: 7 }
        }
    }, 2);

    assert.equal(
        detectInvalidDecisionNoProgress([first, second]),
        'repeated_invalid_native_tool_call'
    );
    assert.equal(detectInvalidDecisionNoProgress([second, corrected]), '');
    assert.equal(detectInvalidDecisionNoProgress([
        buildInvalidDecisionProgressRecord({
            status: 'model_input_custom_json_decision',
            raw: { content: '{"plan_update":[]}' }
        }, 0),
        buildInvalidDecisionProgressRecord({
            status: 'model_input_custom_json_decision',
            raw: { content: '{"plan_update":[]}' }
        }, 1)
    ]), '');

    const prompt = buildLlmAgentDirectToolPrompt({
        message: 'Convert tomorrow at 5 PM, then create the reminder.',
        contextMode: 'task_agent',
        requireExecutionEvidence: true,
        tools: [
            {
                name: 'datetime_info_to_timestamp',
                parameters: invalidDecision.raw.schema
            },
            {
                name: 'utilities_2',
                description: 'Get current POSIX timestamp',
                parameters: {
                    type: 'object',
                    properties: {},
                    additionalProperties: false
                }
            }
        ]
    });
    assert.match(prompt.instructions, /Never repeat the same rejected tool name and arguments/i);
    assert.match(prompt.instructions, /Build tool arguments only from explicit evidence/i);
    assert.match(prompt.instructions, /leave optional fields omitted/i);
    assert.match(prompt.instructions, /runtime clock, plausible default, or inferred context is not evidence/i);
    assert.match(prompt.instructions, /preserve the exact literal text on the first lookup/i);
    assert.match(prompt.instructions, /explicit execution-evidence contract/i);
    assert.match(prompt.instructions, /ground it with runtime_environment and the exposed temporal tools/i);
    assert.match(prompt.instructions, /identify it from its name or description even when names are opaque/i);
    assert.match(prompt.instructions, /call it first/i);
});

test('TaskAgent preserves missing current-time prerequisites for stateful temporal tools', () => {
    const prompt = buildLlmAgentDirectToolPrompt({
        message: 'Push my upcoming reminder to tomorrow at 5 PM.',
        contextMode: 'task_agent',
        tools: [
            {
                name: 'shift_timestamp',
                description: 'Shift a POSIX timestamp by a requested delta.',
                parameters: {
                    type: 'object',
                    properties: {
                        timestamp: { type: 'number' }
                    },
                    required: ['timestamp']
                }
            },
            {
                name: 'search_reminder',
                description: 'Search reminders by optional timestamp bounds.',
                parameters: {
                    type: 'object',
                    properties: {
                        reminder_timestamp_lowerbound: { type: 'number' }
                    }
                }
            }
        ]
    });

    assert.match(prompt.instructions, /no current-time observation capability is available/i);
    assert.match(prompt.instructions, /do not derive absolute values from runtime_environment/i);
    assert.match(prompt.instructions, /Ask for an absolute time anchor or return the missing prerequisite/i);
});

test('native tool validation preserves type-scrambled scalar leaves', () => {
    const tools = [{
        name: 'search_contacts',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    description: 'Name of contact person'
                }
            },
            required: ['name']
        }
    }];

    assert.equal(validateNativeDirectToolCall({
        name: 'search_contacts',
        arguments: { name: 'Homer S' }
    }, tools).ok, true);
    assert.match(
        validateNativeDirectToolCall({
            name: 'search_contacts',
            arguments: {}
        }, tools).errors.join(' '),
        /name is required/i
    );
});

test('native tool validation enforces literal entity and relative-time evidence provenance', () => {
    const holidayTools = [{
        name: 'search_holiday',
        parameters: {
            type: 'object',
            properties: {
                holiday_name: { type: 'string' },
                year: { type: ['integer', 'null'] }
            },
            required: ['holiday_name']
        }
    }];
    const provenance = {
        enforceEvidenceProvenance: true,
        userText: 'What is the timestamp for Thanksgiving?'
    };

    assert.equal(validateNativeDirectToolCall({
        name: 'search_holiday',
        arguments: { holiday_name: 'Thanksgiving' }
    }, holidayTools, provenance).ok, true);
    assert.match(validateNativeDirectToolCall({
        name: 'search_holiday',
        arguments: { holiday_name: 'Thanksgiving Day' }
    }, holidayTools, provenance).errors.join(' '), /preserve the user's exact literal value/i);
    assert.equal(validateNativeDirectToolCall({
        name: 'search_holiday',
        arguments: { holiday_name: 'Thanksgiving Day' }
    }, holidayTools, {
        ...provenance,
        userText: 'What is the timestamp for Thanksgiving Day?'
    }).ok, true);

    const reminderTools = [{
        name: 'utilities_2',
        description: 'Get current POSIX timestamp.',
        parameters: {
            type: 'object',
            properties: {}
        }
    }, {
        name: 'search_reminder',
        description: 'Search reminders by optional timestamp bounds.',
        parameters: {
            type: 'object',
            properties: {
                creation_timestamp_lowerbound: { type: 'number' },
                creation_timestamp_upperbound: { type: 'number' }
            }
        }
    }];
    const reminderCall = {
        name: 'search_reminder',
        arguments: {
            creation_timestamp_lowerbound: 1784131200,
            creation_timestamp_upperbound: 1784217600
        }
    };
    const relativeContext = {
        enforceEvidenceProvenance: true,
        originalUserGoal: 'What reminder did I create yesterday?',
        userText: 'Use the device date to figure it out.'
    };

    assert.match(
        validateNativeDirectToolCall(reminderCall, reminderTools, relativeContext).errors.join(' '),
        /requires a successful current-time observation first/i
    );
    assert.equal(validateNativeDirectToolCall(reminderCall, reminderTools, {
        ...relativeContext,
        stepResults: [{
            tool: 'utilities_2',
            response: { ok: true, result: { content: '1784245587' } }
        }]
    }).ok, true);
    assert.equal(validateNativeDirectToolCall(reminderCall, reminderTools.slice(1), {
        ...relativeContext,
        userText: 'Use 2026-07-16 as yesterday.'
    }).ok, true);
    assert.match(
        validateNativeDirectToolCall(reminderCall, reminderTools.slice(1), relativeContext).errors.join(' '),
        /no current-time observation capability or explicit absolute time anchor/i
    );
});

test('execution-evidence completion gate prevents false completed results', () => {
    assert.deepEqual(
        assessAgentCompletionEvidence({
            agentRuntimeRole: 'task_agent',
            requireExecutionEvidence: true,
            stepResults: []
        }),
        {
            ok: false,
            status: 'incomplete',
            reason: 'execution_evidence_missing',
            unresolvedFields: ['No successful task-execution tool call was recorded.']
        }
    );

    const discoveryOnly = assessAgentCompletionEvidence({
        agentRuntimeRole: 'task_agent',
        requireExecutionEvidence: true,
        stepResults: [{
            tool: 'tool_search',
            response: { ok: true, status: 'completed' }
        }]
    });
    assert.equal(discoveryOnly.status, 'incomplete');

    const executed = assessAgentCompletionEvidence({
        agentRuntimeRole: 'task_agent',
        requireExecutionEvidence: true,
        stepResults: [{
            tool: 'search_messages',
            response: { ok: true, status: 'completed' }
        }]
    });
    assert.equal(executed.status, 'completed');
    assert.equal(executed.ok, true);

    const latestFailed = assessAgentCompletionEvidence({
        agentRuntimeRole: 'task_agent',
        requireExecutionEvidence: true,
        stepResults: [{
            tool: 'datetime_info_to_timestamp',
            response: { ok: true, status: 'completed' }
        }, {
            tool: 'add_reminder',
            response: { ok: false, status: 'invalid_args', error: 'content is required' }
        }]
    });
    assert.equal(latestFailed.status, 'incomplete');
    assert.deepEqual(latestFailed.unresolvedFields, ['content is required']);
});

test('TaskAgent research progress preserves mechanical web state without deciding the answer', () => {
    const progress = buildResearchProgressState([{
        id: 'web-1',
        tool: 'web_run',
        args: {
            search_query: [{ q: 'original author 2019 topic' }]
        },
        response: {
            ok: true,
            status: 'partial',
            result: {
                details: {
                    observationContract: {
                        status: 'partial',
                        transport_ok: true,
                        content_ok: true,
                        capability_ready: true,
                        semantic_level: 'metadata',
                        complete: false,
                        truncated: false,
                        next_actions: [{ tool: 'web_run', args: { open: [{ ref_id: 'turn0search0' }] } }]
                    }
                }
            }
        }
    }, {
        id: 'web-2',
        tool: 'mcp__ailis_research__web_fetch',
        args: { url: 'https://blocked.example.test/paper' },
        response: {
            ok: false,
            status: 'blocked',
            result: {
                details: {
                    observationContract: {
                        status: 'blocked',
                        transport_ok: true,
                        content_ok: false,
                        capability_ready: true,
                        semantic_level: 'text',
                        complete: false,
                        truncated: false,
                        error_code: 'access_denied'
                    }
                }
            }
        }
    }]);

    assert.equal(progress.schema, 'ailis.research_progress.v1');
    assert.equal(progress.attempts.length, 2);
    assert.deepEqual(progress.attempts[0].queries, ['original author 2019 topic']);
    assert.deepEqual(progress.blockedHosts, ['blocked.example.test']);
    assert.equal(progress.attempts[1].errorCode, 'access_denied');
    assert.doesNotMatch(JSON.stringify(progress), /finalAnswer|candidateAnswer|author\s*:/i);
});

test('TaskAgent research progress exposes archive affordance after repeated historical searches', () => {
    const searchStep = (id, query) => ({
        id,
        tool: 'web_run',
        args: {
            search_query: [{ q: query }]
        },
        response: {
            ok: true,
            status: 'completed',
            result: {
                details: {
                    observationContract: {
                        status: 'completed',
                        transport_ok: true,
                        content_ok: true,
                        capability_ready: true,
                        semantic_level: 'metadata',
                        complete: true
                    }
                }
            }
        }
    });
    const requestContext = {
        currentUserMessage: 'As of 2020, which country appeared in the public library database result page?'
    };
    const progress = buildResearchProgressState([
        searchStep('search-1', 'library database country 2020'),
        searchStep('search-2', 'public catalog result country')
    ], requestContext);

    assert.equal(progress.attempts[0].operation, 'search');
    assert.equal(
        progress.strategyAlerts[0].code,
        'historical_archive_not_tried_after_repeated_search'
    );
    assert.match(progress.instruction, /web_run\.archive/i);
    assert.match(progress.instruction, /not a hard route/i);

    const withArchive = buildResearchProgressState([
        searchStep('search-1', 'library database country 2020'),
        searchStep('search-2', 'public catalog result country'),
        {
            id: 'archive-1',
            tool: 'web_run',
            args: {
                archive: [{
                    url: 'https://example.test/catalog?',
                    mode: 'search',
                    contains: '2020 country'
                }]
            },
            response: {
                ok: true,
                status: 'completed'
            }
        }
    ], requestContext);
    assert.equal(withArchive.attempts[2].operation, 'archive');
    assert.deepEqual(withArchive.strategyAlerts, []);
});

test('AILIS stages external attachments inside the active workspace', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-attachment-workspace-'));
    const sourceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-attachment-source-'));
    const sourcePath = path.join(sourceRoot, 'inventory.xlsx');
    await fs.writeFile(sourcePath, 'spreadsheet-bytes');

    const staged = await stageFileAttachmentsForWorkspace([{
        type: 'file',
        name: 'inventory.xlsx',
        path: sourcePath
    }], workspaceRoot, 'session:with:unsafe/chars');

    assert.equal(staged.length, 1);
    assert.equal(staged[0].staged, true);
    assert.equal(staged[0].stageStatus, 'copied_to_workspace');
    assert.equal(path.relative(workspaceRoot, staged[0].path).startsWith('..'), false);
    assert.match(
        path.relative(workspaceRoot, staged[0].path),
        /^\.ailis-runtime[\\/]attachments[\\/]session_with_unsafe_chars[\\/]/
    );
    assert.equal(await fs.readFile(staged[0].path, 'utf8'), 'spreadsheet-bytes');
    assert.equal(staged[0].originalPath, sourcePath);
});

test('AILIS preserves file extensions when staging long attachment names', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-long-attachment-workspace-'));
    const sourceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-long-attachment-source-'));
    const longName = `${'gaia-attachment-'.repeat(12)}dataset.xlsx`;
    const sourcePath = path.join(sourceRoot, longName);
    await fs.writeFile(sourcePath, 'spreadsheet-bytes');

    const [staged] = await stageFileAttachmentsForWorkspace([{
        type: 'file',
        name: longName,
        path: sourcePath
    }], workspaceRoot, 'gaia-long-name');

    assert.equal(staged.staged, true);
    assert.equal(path.extname(staged.path), '.xlsx');
    assert.ok(path.basename(staged.path).length <= 99);
    assert.equal(await fs.readFile(staged.path, 'utf8'), 'spreadsheet-bytes');
});

test('AILIS keeps staged attachment paths below the Windows subprocess safety limit', async () => {
    const workspaceBase = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-stage-path-'));
    const workspaceRoot = path.join(
        workspaceBase,
        'isolated-benchmark-workspace-with-a-deliberately-long-run-identifier',
        'nested-workspace'
    );
    const sourceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-stage-source-'));
    const sourcePath = path.join(sourceRoot, 'recording.mp3');
    await fs.mkdir(workspaceRoot, { recursive: true });
    await fs.writeFile(sourcePath, 'audio-bytes');

    const [staged] = await stageFileAttachmentsForWorkspace([{
        id: 'gaia-file-long-path',
        type: 'file',
        name: `${'gaia-recording-'.repeat(10)}recording.mp3`,
        path: sourcePath
    }], workspaceRoot, `${'desktop-real-gaia-long-session-'.repeat(6)}`);

    assert.equal(staged.staged, true);
    assert.equal(path.relative(workspaceRoot, staged.path).startsWith('..'), false);
    if (process.platform === 'win32') {
        assert.match(path.relative(workspaceRoot, staged.path), /^\.ailis-runtime[\\/]a[\\/][a-f0-9]{12}[\\/]/);
        assert.ok(staged.path.length < 240, `staged path length was ${staged.path.length}`);
    } else {
        assert.match(path.relative(workspaceRoot, staged.path), /^\.ailis-runtime[\\/]attachments[\\/]/);
    }
    assert.equal(await fs.readFile(staged.path, 'utf8'), 'audio-bytes');
});

test('AILIS staging uses a stable attachment identity instead of recursively growing filenames', async () => {
    const first = buildStagedAttachmentFilename({
        id: 'gaia-file-99c9cc74',
        name: `${'99c9cc74-'.repeat(18)}recipe.mp3`,
        path: 'F:\\source\\recipe.mp3'
    }, 0);
    const second = buildStagedAttachmentFilename({
        id: 'gaia-file-99c9cc74',
        name: first,
        path: `F:\\workspace\\${first}`
    }, 0);

    assert.equal(first, second);
    assert.equal(path.extname(first), '.mp3');
    assert.ok(first.length <= 68);
});

test('TaskAgent handoff preserves structured web source refs when prose omits URLs', () => {
    const sourceUrl = 'https://docs.example.test/guide';
    const handoff = buildTaskRunHandoffPackage({
        status: 'completed',
        runId: 'task-run-source-refs',
        sessionId: 'task-session-source-refs',
        message: 'research the current guide with sources',
        finalAnswer: 'The guide is complete and uses the official documentation.',
        stepResults: [{
            id: 'fetch-1',
            iteration: 1,
            tool: 'mcp__ailis_research__web_fetch',
            title: 'Open official guide',
            args: { url: sourceUrl, lineno: 17 },
            response: {
                ok: true,
                status: 'completed',
                result: {
                    structuredContent: {
                        result: {
                    structuredContent: {
                        webSearchOutput: {
                            fetch: {
                                sources: [{
                                    ref_id: 'source_1',
                                    title: 'Official guide',
                                    url: sourceUrl,
                                    lineno: 17
                                }]
                            }
                        }
                            }
                        }
                    }
                }
            }
        }]
    });

    assert.deepEqual(handoff.sourceRefs, [{
        ref_id: 'source_1',
        title: 'Official guide',
        url: sourceUrl,
        lineno: 17
    }]);
    assert.equal(handoff.userVisibleSummary, 'The guide is complete and uses the official documentation.');
    assert.match(handoff.collectedData[0].sourceRefs[0].url, /docs\.example\.test/);
});

test('TaskAgent handoff keeps raw web_search candidates separate from opened source refs', () => {
    const handoff = buildTaskRunHandoffPackage({
        status: 'completed',
        finalAnswer: 'No supported answer was found.',
        stepResults: [{
            id: 'search-1',
            tool: 'web_search',
            args: { query: 'specific article' },
            response: {
                ok: true,
                status: 'completed',
                result: {
                    structuredContent: {
                        search: {
                            results: [{
                                title: 'Unrelated candidate',
                                url: 'https://example.test/unrelated'
                            }]
                        }
                    }
                }
            }
        }]
    });

    assert.deepEqual(handoff.sourceRefs, []);
    assert.doesNotMatch(handoff.userVisibleSummary, /example\.test\/unrelated/);
});

test('TaskAgent context keeps the original user goal separate from delegated work', () => {
    const prompt = buildLlmAgentDirectToolPrompt({
        message: 'Read every spreadsheet row and report the raw table.',
        originalUserGoal: 'Calculate total food sales excluding drinks and return USD with two decimals.',
        contextMode: 'task_agent',
        taskAgentInheritanceMode: 'checkpoint',
        taskState: { schema: 'ailis.agent_task_state.v1' },
        tools: []
    });
    const serialized = JSON.stringify(prompt.contextPackage);
    assert.match(serialized, /Calculate total food sales excluding drinks/);
    assert.match(serialized, /Read every spreadsheet row and report the raw table/);
    assert.match(serialized, /original_user_goal/);
    assert.match(serialized, /delegated_task/);
});

test('TaskAgent loads structured MCP follow-up action specs on the next turn', () => {
    const result = {};
    Object.defineProperty(result, '__ailisSuggestedMcpTools', {
        value: [{
            id: 'mcp__ailis_research__open_page',
            callable: true,
            spec: {
                name: 'mcp__ailis_research__open_page',
                description: 'Open a selected source.',
                parameters: {
                    type: 'object',
                    required: ['url'],
                    properties: { url: { type: 'string' } },
                    additionalProperties: false
                }
            }
        }]
    });
    const specs = buildAgentDirectToolSpecs({
        gatewayToolRuntimeRegistry: {
            modelVisibleSpecs: () => [],
            definition: () => null
        }
    }, {
        stepResults: [{
            tool: 'mcp__ailis_research__web_research',
            response: { ok: true, result }
        }],
        requestContext: { agentRole: 'task_agent' }
    });
    assert.ok(specs.some((spec) => spec.name === 'mcp__ailis_research__open_page'));
});

async function jsonFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'content-type': 'application/json',
            ...(options.headers || {})
        }
    });
    const body = await response.json();
    return { response, body };
}

async function runAgent(baseUrl, payload) {
    return await jsonFetch(`${baseUrl}/agent/run`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

test('AILIS Agent Runner strips persona_output blocks from visible text', () => {
    const visibleText = stripControlTags(`我喜欢和你一起研究新东西。

<persona_output>
{"emotion":"joyful","gestureIntent":"open_hands","taskState":"listening"}
</persona_output>`);

    assert.equal(visibleText, '我喜欢和你一起研究新东西。');
    assert.doesNotMatch(visibleText, /persona_output|gestureIntent|taskState/);

    const embeddedJsonText = stripControlTags(`{好的啦～被你夸得有点小害羞呢。

{
"persona_output": {
"emotion": "happy",
"gestureIntent": "tilt_head_smile",
"taskState": "idle_listening"
}
}}`);

    assert.equal(embeddedJsonText, '好的啦～被你夸得有点小害羞呢。');
    assert.doesNotMatch(embeddedJsonText, /persona_output|gestureIntent|taskState/);
    assert.doesNotMatch(embeddedJsonText, /^\{|\}$/);

    const fullWidthTags = stripControlTags(
        '[expression:happy]【expression:surprised】【emotion:flustered】我没有把内部表情标签说出来。'
    );
    assert.equal(fullWidthTags, '我没有把内部表情标签说出来。');
});

test('AILIS parent Persona prompt stays conversational while TaskAgent keeps execution guidance', () => {
    const personaPrompt = buildLlmAgentDirectToolPrompt({
        message: '老婆，你的说话语气怎么有点冷漠',
        toolSummary: 'Persona tool surface: handoff_task.'
    });
    assert.match(personaPrompt.instructions, /当前有效交互偏好/);
    assert.match(personaPrompt.instructions, /Keep ordinary conversation natural/);
    assert.match(personaPrompt.instructions, /authoritative host clock/);
    assert.match(personaPrompt.instructions, /call handoff_task exactly once/);
    assert.match(personaPrompt.instructions, /Harness transfers the immutable current user request/);
    assert.match(personaPrompt.instructions, /TaskResult packet is the factual boundary/);
    assert.match(personaPrompt.instructions, /You do not create, wait for, resume, list, or close agents/);
    assert.doesNotMatch(personaPrompt.instructions, /arithmetic, multi-step logic, optimization/);
    assert.doesNotMatch(personaPrompt.instructions, /spawn_agent creates|subagent_notification|task_name/);
    assert.doesNotMatch(personaPrompt.instructions, /mcp__ailis_research__web_research|For local file and data tasks|When exec output is truncated/);

    const taskPrompt = buildLlmAgentDirectToolPrompt({
        message: '查找最新资料并验证结果',
        contextMode: 'task_agent',
        toolSummary: 'Direct tools are exposed.'
    });
    assert.doesNotMatch(taskPrompt.instructions, /mcp__ailis_research__web_research/);
    assert.match(taskPrompt.instructions, /public web facts/);
    assert.match(taskPrompt.instructions, /For local file and data tasks/);
    assert.match(taskPrompt.instructions, /join across records, global ordering or de-duplication/);
    assert.match(taskPrompt.instructions, /tool_search for a dedicated metadata, document, API, or data capability/);
    assert.match(taskPrompt.instructions, /do not spend the remaining work budget paging through a site/);
    assert.doesNotMatch(taskPrompt.instructions, /open_page actions|most authoritative returned source URL/);
    assert.match(taskPrompt.instructions, /mechanical transport metadata, not a decision/);
    assert.match(taskPrompt.instructions, /candidate-set boundary/);
    assert.match(taskPrompt.instructions, /remaining relevant lines or sections/);
    assert.doesNotMatch(taskPrompt.instructions, /complete=true|reasoning_ready=true/);
    assert.match(taskPrompt.instructions, /bounded numerical optimization, minimax, game-strategy/);
    assert.match(taskPrompt.instructions, /exhaustively enumerate the finite integer state space/);
    assert.match(taskPrompt.instructions, /literal reading makes an explicitly stated restriction redundant or vacuous/);
    assert.match(taskPrompt.instructions, /prefer the smallest non-vacuous quantifier repair/);
    assert.match(taskPrompt.instructions, /verify every predicate on the same record row/);
    assert.match(taskPrompt.instructions, /direct authoritative page, document, or API response/);
    assert.match(taskPrompt.instructions, /preserve the name, place, organization, category/);
    assert.match(taskPrompt.instructions, /compact operand ledger/);
    assert.match(taskPrompt.instructions, /do not invent a terminal probability/);
    assert.match(taskPrompt.instructions, /layout-sensitive or source-form questions/);
    assert.match(taskPrompt.instructions, /do not convert a stacked fraction into a slash expression/);
    assert.match(taskPrompt.instructions, /exact whole token or phrase/);
    assert.match(taskPrompt.instructions, /Do not merge singular\/plural forms/);
    assert.match(taskPrompt.instructions, /do not put an unverified intermediate entity/);
    assert.match(taskPrompt.instructions, /retrieve the parent candidate index/);
    assert.doesNotMatch(taskPrompt.instructions, /Keep ordinary conversation natural/);

    const exactPersonaPrompt = buildLlmAgentDirectToolPrompt({
        message: 'What is the minimum guaranteed value?',
        exactAnswerMode: true,
        toolSummary: 'Persona tool surface: handoff_task.'
    });
    assert.match(exactPersonaPrompt.instructions, /arithmetic, multi-step logic, optimization/);
    assert.match(exactPersonaPrompt.instructions, /call handoff_task instead of answering them from intuition/);
});

test('AILIS Persona heartbeat reuses ordinary history and ends with an ephemeral developer item', () => {
    const prompt = buildLlmAgentDirectToolPrompt({
        message: '我们继续聊刚才的话题。',
        messageHistory: [
            { role: 'user', content: '我们继续聊刚才的话题。' },
            { role: 'assistant', content: '好，我在这里陪你。' }
        ],
        suppressCurrentUserMessage: true,
        ephemeralDeveloperMessage: 'Companion mode heartbeat. This is not a user message.',
        contextMode: 'persona',
        tools: []
    });
    const messages = prompt.input.filter((item) => item.type === 'message');

    assert.deepEqual(messages.map((item) => item.role), ['user', 'assistant', 'developer']);
    assert.equal(
        messages.filter((item) => item.role === 'user').length,
        1
    );
    assert.match(messages.at(-1).content[0].text, /not a user message/);
});

test('AILIS refreshes ephemeral developer guidance on every reused context turn', () => {
    const first = buildLlmAgentDirectToolPrompt({
        message: 'Continue the task.',
        ephemeralDeveloperMessage: 'First-turn temporary guidance.',
        contextMode: 'task_agent',
        tools: []
    });
    const second = buildLlmAgentDirectToolPrompt({
        message: 'Continue the task.',
        contextManager: first.contextManager,
        ephemeralDeveloperMessage: 'Second-turn recovery guidance.',
        contextMode: 'task_agent',
        tools: []
    });
    const developerTexts = second.input
        .filter((item) => item.type === 'message' && item.role === 'developer')
        .flatMap((item) => item.content || [])
        .map((part) => part.text || '');

    assert.ok(developerTexts.some((text) => /Second-turn recovery guidance/.test(text)));
    assert.ok(!developerTexts.some((text) => /First-turn temporary guidance/.test(text)));
    assert.ok(!(second.contextManager.rawItems?.() || []).some((item) =>
        JSON.stringify(item).includes('Second-turn recovery guidance')
    ));
});

test('AILIS Persona receives active preferences and active task state while TaskAgent stays isolated', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-context-'));
    const gateway = new AILISGateway({
        projectRoot: rootDir,
        workspaceRoot: rootDir,
        auditDir: path.join(rootDir, 'audit'),
        profileCurationEnabled: false
    });
    gateway.preferenceState.append({
        slot: 'tone.response',
        operation: 'set',
        value: '自然简洁',
        scope: 'persistent',
        confidence: 0.98,
        observedAt: '2026-07-09T10:00:00.000Z',
        evidence: { messageId: 'pref-1', quote: '以后说得自然简洁' }
    }, { userMessage: '以后说得自然简洁' });
    gateway.taskResultCapsules.save({
        taskId: 'old-roxy-guide',
        sessionId: 'main',
        request: '做一套洛茜攻略',
        generatedAt: '2026-07-09T11:00:00.000Z',
        taskRunHandoff: {
            status: 'completed',
            finalAnswer: '洛茜的核心队伍结论已经整理完成。'
        }
    });
    const lookup = await gateway.executeGatewayLocalTool('task_results', {
        action: 'search',
        query: '洛茜配队',
        limit: 2
    }, { sessionId: 'main' });
    assert.equal(lookup.isError, false);
    assert.equal(lookup.structuredContent.results[0].taskId, 'old-roxy-guide');
    gateway.taskResultCapsules.recordExecution({
        sessionId: 'main',
        parentRunId: 'parent-roxy-guide',
        task: '继续完成洛茜攻略并核对配队',
        status: 'max_loop',
        ok: false,
        subagent: {
            id: 'roxy-worker',
            childRunId: 'roxy-child'
        },
        taskRunHandoff: {
            status: 'max_loop',
            partialAnswer: '已整理技能，配队仍待核验。',
            failureAnalysis: { bottleneck: '配队证据不足' },
            resume: { checkpointAvailable: true, contextManagerCheckpoint: { history_version: 1, items: [] } }
        }
    });
    const runner = gateway.ensureAgentRunner();
    const personaContext = runner.compileMemoryContext({
        sessionId: 'main',
        message: '洛茜配队怎么调整',
        request: {},
        contextMode: 'persona'
    });
    const taskContext = runner.compileMemoryContext({
        sessionId: 'main',
        message: '洛茜配队怎么调整',
        request: {},
        contextMode: 'task_agent'
    });

    const personaContextText = personaContext.asDeveloperInstruction();
    const taskContextText = taskContext.asDeveloperInstruction();
    assert.match(personaContextText, /tone\.response: 自然简洁/);
    assert.match(personaContextText, /当前活动任务状态/);
    assert.match(personaContextText, /继续完成洛茜攻略并核对配队/);
    assert.doesNotMatch(personaContextText, /洛茜的核心队伍结论/);
    assert.doesNotMatch(taskContextText, /当前活动任务状态|tone\.response: 自然简洁/);
    assert.doesNotMatch(taskContextText, /## Persona|## Relationship/);
});

test('AILIS memory policy can isolate evaluation turns from persistent memory', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-policy-'));
    let compileCalls = 0;
    let recordCalls = 0;
    const runner = new AILISAgentRunner({
        gateway: {
            workspaceRoot: rootDir,
            auditDir: path.join(rootDir, 'audit'),
            emitGatewayEvent() {}
        },
        memoryRuntime: {
            recordTurn() {
                recordCalls += 1;
                return { ok: true };
            }
        },
        contextCompiler: {
            compile() {
                compileCalls += 1;
                return 'compiled-memory';
            }
        }
    });

    assert.equal(resolveMemoryPolicy({ memoryPolicy: 'read-only' }), 'read_only');
    assert.equal(resolveMemoryPolicy({ context: { memory_policy: 'disabled' } }), 'disabled');
    assert.equal(resolveMemoryPolicy({ memoryPolicy: 'unknown' }), 'read_write');
    assert.equal(runner.compileMemoryContext({
        sessionId: 'eval-task',
        message: 'independent benchmark task',
        request: { memoryPolicy: 'disabled' }
    }), '');
    assert.equal(compileCalls, 0);

    runner.recordMemoryTurn({
        request: { memoryPolicy: 'disabled' },
        result: { finalAnswer: 'answer' },
        message: 'question',
        sessionId: 'eval-task'
    });
    runner.recordMemoryTurn({
        request: { memoryPolicy: 'read_only' },
        result: { finalAnswer: 'answer' },
        message: 'question',
        sessionId: 'eval-task'
    });
    assert.equal(recordCalls, 0);
});

test('AILIS direct tool specs allow model-authored progress notes without passing them to tools', () => {
    const specs = buildAgentDirectToolSpecs({
        gatewayToolRuntimeRegistry: {
            modelVisibleSpecs: () => [{
                name: 'read',
                description: 'Read a file.',
                parameters: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['path'],
                    properties: {
                        path: { type: 'string' }
                    }
                }
            }]
        }
    }, {
        requestContext: {
            directToolLimit: 4
        }
    });
    const readSpec = specs.find((spec) => spec.name === 'read');

    assert.ok(readSpec);
    assert.equal(readSpec.parameters.properties.progress_note.type, 'string');

    const split = splitNativeProgressNoteArgs({
        path: 'note.txt',
        progress_note: '我先确认这份文件里有没有可以直接引用的证据。'
    });

    assert.deepEqual(split.args, { path: 'note.txt' });
    assert.match(split.progressNote, /确认这份文件/);
});

test('AILIS direct tool specs honor an explicit one-tool allowlist', () => {
    const specs = buildAgentDirectToolSpecs({
        gatewayToolRuntimeRegistry: {
            modelVisibleSpecs: () => ['first', 'second', 'third'].map((name) => ({
                name,
                description: `${name} tool`,
                parameters: {
                    type: 'object',
                    properties: {},
                    additionalProperties: false
                }
            }))
        }
    }, {
        requestContext: {
            agentRole: 'task_agent',
            directToolLimit: 1
        }
    });

    assert.deepEqual(specs.map((spec) => spec.name), ['first']);
});

test('AILIS Agent Runner rejects visible tool protocols', () => {
    const leaked = `<｜｜DSML｜｜tool_calls>
<｜｜DSML｜｜invoke name="mcp__ailis_research__web_research">
<｜｜DSML｜｜parameter name="query" string="true">Rossi guide</｜｜DSML｜｜parameter>
</｜｜DSML｜｜invoke>
</｜｜DSML｜｜tool_calls>`;
    assert.equal(looksLikeLeakedAgentProtocol(leaked), true);
    assert.equal(looksLikeLeakedAgentProtocol(JSON.stringify({
        tool_calls: [{ function: { name: 'web_search', arguments: '{}' } }]
    })), true);
    assert.equal(looksLikeLeakedAgentProtocol('已经整理好洛茜的技能、配队和培养建议。'), false);

});

test('web source viewport prompt digest uses only canonical Codex/OAI names', () => {
    const [digest] = buildToolObservationDigest([{
        id: 'fetch-1',
        tool: 'mcp__ailis_research__web_fetch',
        title: 'web_fetch',
        args: { url: 'https://example.test/page', lineno: 10 },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: 'Source viewport:\nL10: answer bearing line'
                }],
                structuredContent: {
                    sourceWindow: {
                        type: 'source_viewport',
                        action: {
                            type: 'web_fetch',
                            url: 'https://example.test/page',
                            lineno: 10
                        },
                        url: 'https://example.test/page',
                        contentType: 'text/html',
                        totalLines: 20,
                        lineStart: 10,
                        lineEnd: 11,
                        hasMoreBefore: true,
                        hasMoreAfter: false,
                        lines: [
                            { lineNumber: 10, line_number: 10, lineno: 10, text: 'answer bearing line' }
                        ]
                    },
                    sourceViewport: { type: 'source_viewport' },
                    modelVisibleMode: 'source_viewport',
                    sourceRetrievalComplete: true
                }
            }
        }
    }]);

    assert.match(digest.text, /Opened page source viewport/);
    assert.match(digest.text, /lineno=10/);
    assert.match(digest.text, /L10: answer bearing line/);
    assert.doesNotMatch(digest.text, /sourceWindow|sourceViewport|modelVisibleMode|sourceRetrievalComplete/);
    assert.equal(digest.structuredContent, null);
});

test('bounded web source viewport keeps answer-bearing middle lines in the finalization digest', () => {
    const lines = Array.from({ length: 17 }, (_, index) => ({
        lineno: 55 + index,
        text: `${'table-cell '.repeat(24)}${index === 7 ? 'MIDDLE_ANSWER_EVIDENCE' : `row-${index + 1}`}`
    }));
    const [digest] = buildToolObservationDigest([{
        id: 'bounded-source-viewport-1',
        tool: 'web_run',
        args: { open: [{ ref_id: 'turn0view0', lineno: 55 }] },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'Source viewport model preview' }],
                structuredContent: {
                    sourceWindow: {
                        type: 'source_viewport',
                        action: { type: 'open_page', url: 'https://example.test/table', lineno: 55 },
                        url: 'https://example.test/table',
                        contentType: 'text/markdown',
                        totalLines: 110,
                        lineStart: 55,
                        lineEnd: 71,
                        hasMoreBefore: true,
                        hasMoreAfter: true,
                        lines
                    }
                }
            }
        }
    }]);

    assert.ok(digest.text.length > 3600);
    assert.ok(digest.text.length < 8000);
    assert.match(digest.text, /MIDDLE_ANSWER_EVIDENCE/);
    assert.match(digest.text, /L55:/);
    assert.match(digest.text, /L71:/);
    assert.equal(digest.lossless, true);
    assert.equal(digest.compression, null);
});

test('TaskAgent finalization digest unwraps nested MCP source viewport evidence', () => {
    const [digest] = buildToolObservationDigest([{
        id: 'nested-open-page-digest-1',
        tool: 'mcp__ailis_research__open_page',
        args: { url: 'https://example.test/article', lineno: 8 },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'TOOL_OUTPUT_MODEL_PREVIEW:\n... [truncated for model budget] ...' }],
                structuredContent: {
                    status: 'completed',
                    server: 'ailis_research',
                    tool: 'open_page',
                    result: {
                        structuredContent: {
                            sourceWindow: {
                                type: 'source_viewport',
                                action: { type: 'open_page', url: 'https://example.test/article', lineno: 8 },
                                url: 'https://example.test/article',
                                totalLines: 94,
                                lineStart: 8,
                                lineEnd: 21,
                                lines: [
                                    { lineno: 17, text: '## Fluffy Dragons' },
                                    { lineno: 18, text: 'Two authors comment with distaste on the increasingly cuddly, "fluffy" nature of dragons.' }
                                ]
                            }
                        }
                    }
                }
            }
        }
    }]);

    assert.match(digest.text, /L18: Two authors comment with distaste/);
    assert.match(digest.text, /"fluffy"/);
    assert.doesNotMatch(digest.text, /TOOL_OUTPUT_MODEL_PREVIEW/);
    assert.equal(digest.details, null);
    assert.equal(digest.structuredContent, null);
});

test('web observations keep source content but remove Harness evidence verdicts from model input', () => {
    const toolOutput = normalizeToolOutput({
        id: 'fetch-verdict-1',
        tool: 'mcp__ailis_research__web_fetch',
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: [
                        'Source viewport:',
                        'L138: 洛茜是六星输出干员。',
                        'Evidence gap: only metadata was found',
                        'reasoning_ready=false',
                        'suggested_next_calls: fetch another page'
                    ].join('\n')
                }],
                structuredContent: {
                    sourceWindow: {
                        type: 'source_viewport',
                        action: { type: 'open_page', url: 'https://example.test/guide', lineno: 138 },
                        url: 'https://example.test/guide',
                        lineStart: 138,
                        lineEnd: 138,
                        totalLines: 200,
                        hasMoreAfter: true,
                        lines: [{ lineno: 138, text: '洛茜是六星输出干员。' }]
                    },
                    complete: false,
                    reasoningReady: false,
                    evidenceGap: 'only metadata was found',
                    suggestedNextCalls: [{ tool: 'web_fetch' }],
                    outputTruncatedForModel: true
                }
            }
        }
    });
    const serializedItems = JSON.stringify(toolOutputToResponseItems(toolOutput));

    assert.match(serializedItems, /洛茜是六星输出干员/);
    assert.match(serializedItems, /Has more after: true/);
    assert.doesNotMatch(serializedItems, /Evidence gap|reasoning_ready|suggested_next_calls|outputTruncatedForModel|only metadata/);

    const [digest] = buildToolObservationDigest([{
        id: 'fetch-verdict-1',
        tool: 'mcp__ailis_research__web_fetch',
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'L138: 洛茜是六星输出干员。\nEvidence gap: only metadata was found\nreasoning_ready=false' }],
                structuredContent: {
                    complete: false,
                    evidenceGap: 'only metadata was found',
                    reasoningReady: false
                }
            }
        }
    }]);
    assert.match(digest.text, /洛茜是六星输出干员/);
    assert.doesNotMatch(`${digest.text}\n${digest.structuredContent}`, /Evidence gap|reasoning_ready|only metadata|"complete"/);
});

test('AILIS Agent Runner passes parent LLM settings only to collaboration tool calls', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-tool-context-'));
    const calls = [];
    const gateway = {
        workspaceRoot,
        auditDir: path.join(workspaceRoot, '.audit'),
        runtime: {},
        emitGatewayEvent() {},
        async callTool(request) {
            calls.push(request);
            return {
                ok: true,
                status: 'completed',
                content: [],
                details: { status: 'completed' }
            };
        }
    };
    const runner = new AILISAgentRunner({
        gateway,
        workspaceRoot,
        pendingStorePath: path.join(workspaceRoot, 'pending-agent-state.json')
    });
    const llmSettings = {
        provider: 'deepseek',
        baseUrl: 'https://api.deepseek.com',
        model: 'deepseek-chat',
        apiKey: 'test-key'
    };

    await runner.executeAgentToolStep({
        runId: 'run-parent',
        step: {
            id: 'step-agent',
            title: 'Spawn task agent',
            tool: 'spawn_agent',
            args: { task_name: 'solve_task', message: 'solve task', fork_turns: 'none' }
        },
        toolContext: { workspace: workspaceRoot, sessionKey: 'main' },
        request: { llmSettings },
        iteration: 0
    });

    assert.deepEqual(calls[0].context.llmSettings, llmSettings);

    calls.length = 0;
    await runner.executeAgentToolStep({
        runId: 'run-parent',
        step: {
            id: 'step-exec',
            title: 'Run command',
            tool: 'exec',
            args: { command: 'echo ok' }
        },
        toolContext: { workspace: workspaceRoot, sessionKey: 'main' },
        request: { llmSettings },
        iteration: 1
    });

    assert.equal(calls[0].context.llmSettings, undefined);
});

test('AILIS persona exposes only system handoff while TaskAgent keeps execution tools', () => {
    const handoffSpec = {
        name: 'handoff_task',
        description: 'Hand the current request to the system TaskAgent.',
        parameters: {
            type: 'object',
            additionalProperties: false,
            required: [],
            properties: {}
        }
    };
    const collaborationSpecs = Object.fromEntries([
        'spawn_agent',
        'followup_task',
        'wait_agent',
        'list_agents',
        'close_agent'
    ].map((name) => [name, {
        name,
        description: `${name} contract`,
        parameters: { type: 'object', additionalProperties: false, properties: {} }
    }]));
    collaborationSpecs.spawn_agent.parameters = {
        type: 'object',
        required: ['task_name', 'message'],
        additionalProperties: false,
        properties: {
            task_name: { type: 'string' },
            message: { type: 'string' },
            fork_turns: { type: 'string' }
        }
    };
    const gateway = {
        gatewayToolRuntimeRegistry: {
            modelVisibleSpecs: () => [
                handoffSpec,
                collaborationSpecs.spawn_agent,
                {
                    name: 'read',
                    description: 'Read a file.',
                    parameters: { type: 'object', properties: { path: { type: 'string' } } }
                },
                {
                    name: 'exec',
                    description: 'Run a command.',
                    parameters: { type: 'object', properties: { command: { type: 'string' } } }
                }
            ],
            definition: (toolId) => {
                if (toolId === 'handoff_task') return { spec: handoffSpec };
                if (collaborationSpecs[toolId]) return { spec: collaborationSpecs[toolId] };
                return null;
            }
        }
    };

    const personaSpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: {
            agentRole: 'persona_orchestrator'
        }
    });
    assert.deepEqual(personaSpecs.map((spec) => spec.name), ['handoff_task']);
    assert.deepEqual(personaSpecs[0].parameters.required, []);
    assert.equal(personaSpecs[0].parameters.additionalProperties, false);
    assert.equal(personaSpecs.some((spec) => spec.name === 'subagents'), false);

    const taskSpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: {
            agentRole: 'task_agent'
        }
    });
    assert.ok(taskSpecs.some((spec) => spec.name === 'read'));
    assert.ok(taskSpecs.some((spec) => spec.name === 'exec'));
    assert.equal(taskSpecs.some((spec) => spec.name === 'handoff_task'), false);
    assert.equal(taskSpecs.some((spec) => spec.name === 'spawn_agent'), false);
    assert.equal(taskSpecs.some((spec) => spec.name === 'subagents'), false);

});

test('AILIS sanitized agent fork follows Codex rollout filtering rules', () => {
    const items = [
        { type: 'message', role: 'system', content: [{ type: 'input_text', text: 'system' }] },
        { type: 'message', role: 'developer', content: [{ type: 'input_text', text: 'developer' }] },
        { type: 'message', role: 'user', content: [{ type: 'input_text', text: JSON.stringify({
            type: 'context',
            memory_context: 'relationship memory must not enter TaskAgent',
            runtime_environment: { current_date: '2026-07-11' }
        }) }] },
        { type: 'message', role: 'user', content: [{ type: 'input_text', text: 'old goal' }] },
        { type: 'message', role: 'assistant', phase: 'commentary', content: [{ type: 'output_text', text: 'progress' }] },
        { type: 'message', role: 'assistant', phase: 'final_answer', content: [{ type: 'output_text', text: 'old final' }] },
        { type: 'function_call', name: 'web_search', call_id: 'call-1', arguments: '{}' },
        { type: 'function_call_output', call_id: 'call-1', output: 'large tool output' },
        { type: 'message', role: 'user', content: [{ type: 'input_text', text: 'current correction' }] }
    ];
    const contextManager = {
        rawItems: () => items,
        historyVersion: () => 7,
        referenceContextItem: () => ({ type: 'turn_context', id: 'ref-1' })
    };

    const checkpoint = build_forked_context_checkpoint(contextManager, 'all');
    assert.equal(checkpoint.history_version, 7);
    assert.deepEqual(checkpoint.items.map((item) => `${item.role || item.type}:${item.phase || ''}`), [
        'system:',
        'developer:',
        'user:',
        'user:',
        'assistant:final_answer',
        'user:'
    ]);
    assert.equal(checkpoint.items.some((item) => item.type === 'function_call_output'), false);
    assert.doesNotMatch(JSON.stringify(checkpoint.items), /relationship memory/);
    assert.match(JSON.stringify(checkpoint.items), /2026-07-11/);

    const recentCheckpoint = build_forked_context_checkpoint(contextManager, '1');
    assert.deepEqual(recentCheckpoint.items.map((item) => item.role), ['user']);
    assert.equal(recentCheckpoint.reference_context_item, null);
});

test('AILIS Agent Runner accepts local vLLM and Ollama settings without API keys', () => {
    assert.equal(isAgentLlmSettingsMissing({
        provider: 'vllm',
        baseUrl: 'http://127.0.0.1:8000/v1',
        model: 'Qwen/Qwen2-0.5B-Instruct',
        apiKey: ''
    }), false);

    assert.equal(isAgentLlmSettingsMissing({
        provider: 'ollama',
        baseUrl: 'http://127.0.0.1:11434',
        model: 'llama3.2',
        apiKey: ''
    }), false);

    assert.equal(isAgentLlmSettingsMissing({
        provider: 'openai-compatible',
        baseUrl: 'https://api.example.test/v1',
        model: 'demo-model',
        apiKey: ''
    }), true);
});

test('AILIS Agent Runner plans chat and executes file tasks through the Gateway', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-test-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;

        const chat = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '你好'
        });
        assert.equal(chat.response.status, 200);
        assert.equal(chat.body.ok, true);
        assert.equal(chat.body.mode, 'conversation');
        assert.equal(chat.body.intent, 'emotional_chat');
        assert.equal(chat.body.executionRequired, false);
        assert.equal(chat.body.steps.length, 0);
        assert.match(chat.body.displayText, /统一的 AILIS Agent 链路/);

        const classifyConversation = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '我今天有点累',
            classifyOnly: true
        });
        assert.equal(classifyConversation.body.ok, true);
        assert.equal(classifyConversation.body.status, 'classified');
        assert.equal(classifyConversation.body.mode, 'conversation');
        assert.equal(classifyConversation.body.executionRequired, false);

        const classifyTask = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '/read note.txt',
            classifyOnly: true
        });
        assert.equal(classifyTask.body.ok, true);
        assert.equal(classifyTask.body.status, 'classified');
        assert.equal(classifyTask.body.mode, 'task');
        assert.equal(classifyTask.body.executionRequired, true);
        assert.equal(classifyTask.body.plan[0].tool, 'read');

        const emotional = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '我今天有点累'
        });
        assert.equal(emotional.body.ok, true);
        assert.equal(emotional.body.mode, 'conversation');
        assert.equal(emotional.body.intent, 'emotional_chat');
        assert.equal(emotional.body.steps.length, 0);
        assert.match(emotional.body.displayText, /慢一点/);

        const taskClarification = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '帮我开发一个网站'
        });
        assert.equal(taskClarification.body.ok, true);
        assert.equal(taskClarification.body.mode, 'task');
        assert.equal(taskClarification.body.intent, 'task_clarification');
        assert.equal(taskClarification.body.executionRequired, false);
        assert.equal(taskClarification.body.steps.length, 0);
        assert.match(taskClarification.body.displayText, /识别成任务请求/);

        const write = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '/write note.txt hello runner'
        });
        assert.equal(write.body.ok, true, write.body.displayText);
        assert.equal(write.body.status, 'completed');
        assert.equal(write.body.mode, 'task');
        assert.equal(write.body.executionRequired, true);
        assert.equal(write.body.intent, 'write_file');
        assert.equal(write.body.steps[0].tool, 'write');

        const read = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '请读取 note.txt'
        });
        assert.equal(read.body.ok, true, read.body.displayText);
        assert.equal(read.body.intent, 'read_file');
        assert.equal(read.body.steps[0].tool, 'read');
        assert.match(read.body.displayText, /hello runner/);

        const approval = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '/exec node -e "console.log(1)"'
        });
        assert.equal(approval.body.ok, false);
        assert.equal(approval.body.status, 'needs_approval');
        assert.match(approval.body.displayText, /需要.*确认/);

        const rpc = await jsonFetch(`${baseUrl}/rpc`, {
            method: 'POST',
            body: JSON.stringify({
                method: 'agent.run',
                params: {
                    sessionId: 'agent-test',
                    message: '/read note.txt'
                }
            })
        });
        assert.equal(rpc.body.ok, true, rpc.body.displayText);
        assert.match(rpc.body.displayText, /hello runner/);

        const audit = await jsonFetch(`${baseUrl}/audit?limit=20`);
        assert.equal(audit.body.ok, true);
        assert.ok(audit.body.entries.some((entry) => entry.type === 'agent.run'));
    } finally {
        await gateway.stop();
    }
});

test('AILIS Agent Runner restores durable pending plans after Gateway restart', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-pending-plan-test-'));
    const auditDir = path.join(workspaceRoot, '.audit');
    let gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir
    });

    try {
        await gateway.start();
        const runner = gateway.ensureAgentRunner();
        runner.storePendingPlan({
            planId: 'plan-restore',
            sessionId: 'durable-plan-session',
            message: '需要确认的计划',
            createdAt: Date.now(),
            expiresAt: Date.now() + 60000,
            planner: 'llm-computer-planner',
            intent: 'durable_plan_test',
            summary: '持久化计划',
            riskLevel: 'medium',
            model: 'mock',
            steps: [],
            verificationSteps: [],
            raw: {}
        });
        assert.equal(runner.getStatus().pendingPlanCount, 1);

        await gateway.stop();

        gateway = new AILISGateway({
            port: 0,
            workspaceRoot,
            projectRoot: path.resolve('.'),
            auditDir
        });
        await gateway.start();
        const restoredRunner = gateway.ensureAgentRunner();
        assert.equal(restoredRunner.getStatus().restoredPendingPlanCount, 1);
        const restored = restoredRunner.findPendingPlanForSession('durable-plan-session');
        assert.equal(restored.planId, 'plan-restore');
    } finally {
        await gateway.stop().catch(() => {});
    }
});
