import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    AILISWorldCompanionRuntime,
    WORLD_COMPANION_RESULT_SCHEMA,
    WORLD_COMPANION_RESULT_TOOL,
    validateWorldCompanionResult
} = require('../electron/ailis-world-companion.cjs');
const { AIGAME3WorldMemoryProvider } = require('../electron/ailis-external-memory-provider.cjs');
const { AILISGateway } = require('../electron/ailis-gateway.cjs');

function turn() {
    return {
        schema: 'aigame3.ailis_turn.v2',
        turnId: 'turn-1',
        sessionId: 'aigame3:save.main',
        turnType: 'player',
        memoryScope: 'world.save.main',
        userInput: { eventId: 'evt-1', mode: 'text', text: '我们去门边看看？' },
        worldSnapshot: {
            schema: 'aigame3.world_snapshot.v2',
            saveId: 'save.main',
            worldRevision: 9,
            capturedAt: '2026-08-02T12:00:00.000Z',
            region: 'region.home_atelier',
            time: '傍晚',
            weather: '晴',
            player: { entityId: 'character.player', distanceToAilis: 1.5, lookingAt: 'character.ailis' },
            ailis: { entityId: 'character.ailis', activity: 'listening' },
            nearbyEntities: [{
                id: 'entity.home.door',
                displayName: '工房门',
                kind: 'door',
                affordances: ['open']
            }],
            availableActions: ['look_at', 'move_to', 'stop', 'interact'],
            recentEventIds: ['evt-1']
        },
        relevantWorldMemories: [{
            memoryId: 'world-memory:save.main:old-door',
            summary: '你们曾一起修好这扇门。',
            evidenceEventIds: ['evt-old'],
            occurredAt: '2026-07-01T10:00:00.000Z',
            salience: 0.8
        }],
        actionContract: {
            allowedActions: ['look_at', 'move_to', 'stop', 'interact'],
            maxPlanSteps: 3
        }
    };
}

function result(overrides = {}) {
    return {
        schema: 'aigame3.ailis_turn_result.v2',
        turnId: 'turn-1',
        basedOnWorldRevision: 9,
        displayText: '好呀，我们过去看看。',
        speechText: '好呀，我们过去看看。',
        personaSurface: {
            emotion: 'happy',
            emotionIntensity: 0.6,
            gestureIntent: 'invite',
            gazeTarget: 'player',
            taskState: 'speaking',
            speechEnergy: 0.55,
            movementEnergy: 0.4
        },
        plan: [{ actionId: 'turn-1:1', kind: 'move_to', targetId: 'entity.home.door' }],
        worldMemoryCandidates: [{
            candidateId: 'door-visit',
            summary: '玩家邀请 AILIS 一起去门边看看。',
            evidenceEventIds: ['evt-1'],
            salience: 0.7
        }],
        ...overrides
    };
}

function fakeRunner() {
    const controller = new AbortController();
    return {
        activeRuns: new Map(),
        recorded: [],
        setActiveRun(runId, record) {
            const active = { ...record, runId, controller, signal: controller.signal };
            this.activeRuns.set(runId, active);
            return active;
        },
        async compileMemoryContextAsync() {
            return '用户喜欢雨夜，也珍惜与 AILIS 的长期陪伴关系。';
        },
        recordMemoryTurn(payload) {
            this.recorded.push(payload);
        },
        async requestInterruptRun() {
            controller.abort('test');
            return { ok: true, status: 'interrupt_requested' };
        }
    };
}

test('world_companion uses strict JSON Schema with no model-visible tools and preserves personal memory writes', async () => {
    const runner = fakeRunner();
    let providerPayload;
    const runtime = new AILISWorldCompanionRuntime({
        getAgentRunner: () => runner,
        getLlmSettings: () => ({ provider: 'test', model: 'test' }),
        callProvider: async (_settings, payload) => {
            providerPayload = payload;
            return {
                ok: true,
                toolCalls: [{ name: WORLD_COMPANION_RESULT_TOOL, arguments: result() }]
            };
        }
    });

    const output = await runtime.run(turn());
    assert.equal(output.plan[0].kind, 'move_to');
    assert.deepEqual(providerPayload.tools, []);
    assert.equal(providerPayload.jsonSchemaName, WORLD_COMPANION_RESULT_TOOL);
    assert.equal(providerPayload.jsonSchema, WORLD_COMPANION_RESULT_SCHEMA);
    assert.equal(providerPayload.thinking.type, 'disabled');
    assert.match(providerPayload.messages[1].content, /world_companion_result_json_schema/);
    assert.match(providerPayload.messages[1].content, /gestureIntent/);
    assert.match(providerPayload.messages[1].content, /verified_readonly_world_memory_lane/);
    assert.match(providerPayload.messages[1].content, /用户喜欢雨夜/);
    assert.equal(runner.recorded.length, 1);
    assert.equal(runner.recorded[0].source, 'aigame3_world_companion');
});

test('invalid model structure gets one schema-repair turn without rule-based semantic replacement', async () => {
    const runner = fakeRunner();
    let calls = 0;
    const runtime = new AILISWorldCompanionRuntime({
        getAgentRunner: () => runner,
        getLlmSettings: () => ({ provider: 'test', model: 'test' }),
        callProvider: async () => {
            calls += 1;
            return {
                ok: true,
                toolCalls: [{
                    name: WORLD_COMPANION_RESULT_TOOL,
                    arguments: calls === 1
                        ? result({ plan: [{ actionId: 'bad', kind: 'move_to', targetId: 'entity.unexposed' }] })
                        : result()
                }]
            };
        }
    });

    const output = await runtime.run(turn());
    assert.equal(calls, 2);
    assert.equal(output.plan[0].targetId, 'entity.home.door');
});

test('DeepSeek uses supported JSON Object transport and is still schema-validated by AILIS', async () => {
    const runner = fakeRunner();
    let providerPayload;
    const runtime = new AILISWorldCompanionRuntime({
        getAgentRunner: () => runner,
        getLlmSettings: () => ({ provider: 'deepseek', model: 'deepseek-v4-flash' }),
        callProvider: async (_settings, payload) => {
            providerPayload = payload;
            return { ok: true, content: JSON.stringify(result()) };
        }
    });

    const output = await runtime.run(turn());
    assert.equal(output.schema, 'aigame3.ailis_turn_result.v2');
    assert.equal(providerPayload.jsonMode, true);
    assert.equal(providerPayload.jsonSchema, undefined);
    assert.equal(providerPayload.tools.length, 0);
});

test('world result validator rejects fabricated evidence and arbitrary targets', () => {
    const errors = validateWorldCompanionResult(result({
        plan: [{ actionId: 'bad', kind: 'interact', targetId: 'entity.unknown', affordance: 'delete' }],
        worldMemoryCandidates: [{
            candidateId: 'fake',
            summary: '伪造记忆',
            evidenceEventIds: ['evt-never-happened'],
            salience: 1
        }]
    }), turn());
    assert.ok(errors.some((error) => /not exposed/.test(error)));
    assert.ok(errors.some((error) => /unexposed evidence/.test(error)));
});

test('AIGAME3 external memory provider is explicitly read-only', () => {
    const provider = new AIGAME3WorldMemoryProvider();
    const context = JSON.parse(provider.compileContext(turn()));
    assert.equal(context.readOnly, true);
    assert.equal(context.memories.length, 1);
    assert.throws(() => provider.write({}), /read-only/);
});

test('external memory provider keeps its bounded lane valid JSON', () => {
    const provider = new AIGAME3WorldMemoryProvider({ maxChars: 1000, maxItems: 20 });
    const input = turn();
    input.relevantWorldMemories = Array.from({ length: 20 }, (_, index) => ({
        memoryId: `world-memory:${index}`,
        summary: '共同经历'.repeat(200),
        evidenceEventIds: [`evt-${index}`],
        occurredAt: '2026-08-02T12:00:00.000Z',
        salience: 0.8
    }));
    const serialized = provider.compileContext(input);
    assert.ok(serialized.length <= 1000);
    assert.equal(JSON.parse(serialized).readOnly, true);
});

test('world voice services normalize TTS and ASR envelopes for Unity', async () => {
    const gateway = new AILISGateway({
        port: 0,
        projectRoot: process.cwd(),
        workspaceRoot: process.cwd(),
        voiceServices: {
            tts: async ({ text, outputFormat }) => ({
                audio_base64: Buffer.from(text).toString('base64'),
                audio_format: outputFormat,
                mime_type: 'audio/pcm'
            }),
            asr: async (audioBytes) => ({ text: `bytes:${audioBytes.length}` })
        }
    });

    const speech = await gateway.synthesizeWorldSpeech({
        turnId: 'turn-voice',
        text: '你好',
        outputFormat: 'pcm_44100'
    });
    assert.equal(speech.ok, true);
    assert.equal(speech.turnId, 'turn-voice');
    assert.equal(speech.audio_format, 'pcm_44100');

    const transcription = await gateway.transcribeWorldSpeech({
        captureId: 'capture-voice',
        audioBase64: Buffer.from('wav').toString('base64')
    });
    assert.equal(transcription.ok, true);
    assert.equal(transcription.captureId, 'capture-voice');
    assert.equal(transcription.text, 'bytes:3');
});
