import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const {
    buildOptimizationShadowTelemetry,
    resolveOptimizationShadowFlags
} = require('../electron/ailis-optimization-shadow.cjs');

async function createFinalResponseServer() {
    const calls = [];
    const server = http.createServer((request, response) => {
        let raw = '';
        request.on('data', (chunk) => {
            raw += chunk;
        });
        request.on('end', () => {
            calls.push(raw ? JSON.parse(raw) : {});
            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify({
                choices: [{
                    message: {
                        role: 'assistant',
                        content: 'shadow integration ok'
                    }
                }],
                usage: {
                    prompt_tokens: 10,
                    completion_tokens: 3,
                    total_tokens: 13
                }
            }));
        });
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    return {
        calls,
        url: `http://127.0.0.1:${address.port}/v1`,
        close: () => new Promise((resolve) => server.close(resolve))
    };
}

async function runGatewayAgent(baseUrl, payload) {
    const response = await fetch(`${baseUrl}/agent/run`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return {
        response,
        body: await response.json()
    };
}

test('optimization shadow flags are independent and default off', () => {
    assert.deepEqual(resolveOptimizationShadowFlags({}, {}, {}), {
        enabled: false,
        master: false,
        contextDelta: false,
        artifactDedup: false,
        toolArgLint: false,
        evidenceMatrix: false,
        noProgress: false
    });

    const oneFlag = resolveOptimizationShadowFlags(
        {},
        {},
        { AILIS_TOOL_ARG_LINT_SHADOW: '1' }
    );
    assert.equal(oneFlag.enabled, true);
    assert.equal(oneFlag.toolArgLint, true);
    assert.equal(oneFlag.contextDelta, false);

    const master = resolveOptimizationShadowFlags(
        {},
        {},
        { AILIS_OPTIMIZATION_SHADOW: 'true' }
    );
    assert.equal(master.enabled, true);
    assert.equal(master.master, true);
    assert.equal(master.contextDelta, true);
    assert.equal(master.artifactDedup, true);
    assert.equal(master.toolArgLint, true);
    assert.equal(master.evidenceMatrix, true);
    assert.equal(master.noProgress, true);
});

test('optimization shadow telemetry observes without mutating model input or tool args', () => {
    const repeatedQuery = [
        'unknown language article country flag',
        'unknown language article country flag',
        'unknown language article country flag',
        'BASE DDC 633'
    ].join(' ');
    const stepResults = [{
        tool: 'mcp__ailis_research__continue_page',
        args: {
            query: repeatedQuery.repeat(5),
            timeoutMs: 3000
        },
        response: {
            ok: true,
            result: {
                structuredContent: {
                    url: 'https://example.test/results',
                    recordFieldProjections: [{
                        title: 'Candidate',
                        fields: [
                            { label: 'Document Type', value: 'Article' },
                            { label: 'Country', value: 'gt' }
                        ]
                    }]
                }
            }
        }
    }, {
        tool: 'mcp__ailis_research__continue_page',
        args: {
            query: repeatedQuery
        },
        response: {
            ok: true,
            result: {
                structuredContent: {
                    url: 'https://example.test/results',
                    recordFieldProjections: [{
                        title: 'Candidate',
                        fields: [
                            { label: 'Document Type', value: 'Article' },
                            { label: 'Country', value: 'gt' }
                        ]
                    }]
                }
            }
        }
    }];
    const input = [{
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text: 'question' }]
    }, {
        type: 'function_call_output',
        call_id: 'call-1',
        output: 'same output'
    }, {
        type: 'function_call_output',
        call_id: 'call-1',
        output: 'same output'
    }];
    const beforeSteps = structuredClone(stepResults);
    const beforeInput = structuredClone(input);
    const telemetry = buildOptimizationShadowTelemetry({
        flags: resolveOptimizationShadowFlags(
            {},
            {},
            { AILIS_OPTIMIZATION_SHADOW: '1' }
        ),
        iteration: 3,
        message: 'From what country was the unknown language article?',
        promptBudget: { total_chars: 5000 },
        modelInputRequest: {
            instructions: 'system instructions',
            input,
            tools: [{ name: 'web_run' }]
        },
        stepResults,
        taskState: {
            research: {
                attempts: [{
                    operation: 'search',
                    queries: ['same query'],
                    targets: [],
                    status: 'completed'
                }, {
                    operation: 'search',
                    queries: ['same query'],
                    targets: [],
                    status: 'completed'
                }],
                strategyAlerts: [{ code: 'historical_archive_not_tried_after_repeated_search' }]
            }
        }
    });

    assert.equal(telemetry.mode, 'shadow_only');
    assert.deepEqual(telemetry.invariants, {
        modelInputMutation: false,
        toolArgMutation: false,
        toolChoiceMutation: false,
        answerGateMutation: false
    });
    assert.ok(telemetry.contextDelta.exactInputDuplicates.duplicateItems >= 1);
    assert.ok(telemetry.artifactDedup.repeatedSourceIdentities.duplicateItems >= 1);
    assert.ok(telemetry.toolArgLint.findings.some((finding) =>
        finding.code === 'query_too_long'
    ));
    assert.ok(telemetry.toolArgLint.findings.some((finding) =>
        finding.code === 'network_timeout_below_shadow_floor'
    ));
    assert.deepEqual(
        telemetry.evidenceMatrix.missingRequestedFields,
        ['language']
    );
    assert.equal(telemetry.noProgress.repeatedAttemptSignatures.duplicateItems, 1);
    assert.deepEqual(stepResults, beforeSteps);
    assert.deepEqual(input, beforeInput);
});

test('optimization shadow telemetry does no work when disabled', () => {
    assert.equal(buildOptimizationShadowTelemetry({
        flags: resolveOptimizationShadowFlags({}, {}, {}),
        modelInputRequest: {
            get input() {
                throw new Error('disabled shadow must not inspect model input');
            }
        }
    }), null);
});

test('optimization shadow stays transcript-only in the real Gateway model path', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-shadow-integration-'));
    const llmServer = await createFinalResponseServer();
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
    });
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-shadow',
        temperature: 0,
        timeoutMs: 10000
    };

    try {
        const status = await gateway.start();
        const disabled = await runGatewayAgent(status.url, {
            sessionId: 'shadow-disabled',
            message: 'Reply with the test result.',
            agentLoop: 'llm',
            directToolExecutor: false,
            memoryPolicy: 'disabled',
            llmSettings,
            context: {
                workspace: workspaceRoot,
                agentRole: 'task_agent',
                contextMode: 'task_agent',
                directToolExecutor: false,
                nativeDirectTools: false
            }
        });
        assert.equal(disabled.response.status, 200);
        assert.equal(disabled.body.ok, true, JSON.stringify(disabled.body));
        const disabledTranscript = await gateway.runtime.readTranscript(
            disabled.body.runId,
            200
        );
        assert.equal(
            disabledTranscript.items.some((item) =>
                item.type === 'agent.optimization_shadow'
            ),
            false
        );

        const enabled = await runGatewayAgent(status.url, {
            sessionId: 'shadow-enabled',
            message: 'Reply with the test result.',
            agentLoop: 'llm',
            directToolExecutor: false,
            memoryPolicy: 'disabled',
            optimizationShadow: true,
            llmSettings,
            context: {
                workspace: workspaceRoot,
                agentRole: 'task_agent',
                contextMode: 'task_agent',
                directToolExecutor: false,
                nativeDirectTools: false
            }
        });
        assert.equal(enabled.response.status, 200);
        assert.equal(enabled.body.ok, true, JSON.stringify(enabled.body));
        const enabledTranscript = await gateway.runtime.readTranscript(
            enabled.body.runId,
            200
        );
        const shadowItems = enabledTranscript.items.filter((item) =>
            item.type === 'agent.optimization_shadow'
        );
        assert.equal(shadowItems.length, 1);
        assert.equal(shadowItems[0].status, 'observed');
        assert.equal(shadowItems[0].payload.mode, 'shadow_only');
        assert.deepEqual(shadowItems[0].payload.invariants, {
            modelInputMutation: false,
            toolArgMutation: false,
            toolChoiceMutation: false,
            answerGateMutation: false
        });

        assert.equal(llmServer.calls.length, 2);
        assert.doesNotMatch(
            JSON.stringify(llmServer.calls),
            /optimization_shadow|optimizationShadow|shadow_only/
        );
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});
