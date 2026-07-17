import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { AILISRawMemoryLedger } = require('../electron/ailis-raw-memory-ledger.cjs');
const { AILISUserProfileCurator } = require('../electron/ailis-user-profile-curator.cjs');
const { AILISPreferenceState } = require('../electron/ailis-preference-state.cjs');

function parseCuratorInput(request) {
    const content = request?.messages?.[1]?.content || '';
    const marker = '\nInput:\n';
    const markerIndex = content.indexOf(marker);
    assert.notEqual(markerIndex, -1);
    return JSON.parse(content.slice(markerIndex + marker.length));
}

function emptyExtraction(daySummary = 'batch processed') {
    return {
        daySummary,
        profileUpdates: [],
        relationshipUpdates: [],
        affinityUpdate: null,
        rejectedSignals: []
    };
}

test('AILIS user profile curator extracts daily profile, relationship, and affinity updates from new raw memory', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-curator-'));
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    ledger.appendEntry({
        id: 'raw-direct-style',
        iso: '2026-06-29T10:00:00.000Z',
        type: 'chat.llm_turn',
        source: 'test',
        sessionId: 'main',
        category: 'conversation',
        payload: {
            requestPayload: {
                memoryUserMessage: '以后回答要直接、基于证据，不要空泛建议。'
            },
            result: {
                content: '我会先基于证据说明，再给具体方案。'
            }
        }
    });
    ledger.appendEntry({
        id: 'raw-repair-signal',
        iso: '2026-06-29T11:00:00.000Z',
        type: 'chat.llm_turn',
        source: 'test',
        sessionId: 'main',
        category: 'conversation',
        payload: {
            requestPayload: {
                memoryUserMessage: '我现在不放心你乱改代码，先解释清楚再动。'
            },
            result: {
                content: '我会先说明边界和证据，不直接大改。'
            }
        }
    });

    const curator = new AILISUserProfileCurator({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        llmClient: async () => ({
            content: JSON.stringify({
                daySummary: '用户强调直接、证据化和先解释边界。',
                profileUpdates: [
                    {
                        category: 'communication_style',
                        claim: '用户希望回答直接、具体，并基于证据，不要空泛建议。',
                        operation: 'add_or_merge',
                        confidence: 0.94,
                        stability: 'stable',
                        evidenceIds: ['raw-direct-style'],
                        reason: '用户明确使用“以后”表达稳定偏好。'
                    }
                ],
                relationshipUpdates: [
                    {
                        claim: '当用户担心代码质量时，AILIS 应先解释边界和证据，再动代码。',
                        operation: 'add_or_merge',
                        confidence: 0.88,
                        stability: 'stable',
                        evidenceIds: ['raw-repair-signal'],
                        reason: '用户明确表达不放心乱改。'
                    }
                ],
                affinityUpdate: {
                    trustDelta: 0.02,
                    familiarityDelta: 0.03,
                    warmthDelta: 0.01,
                    frictionDelta: 0.02,
                    repairState: 'recovering',
                    reason: '用户仍在继续协作，但对实现质量有摩擦。',
                    evidenceIds: ['raw-repair-signal']
                },
                rejectedSignals: []
            })
        })
    });

    const result = await curator.runDailyCuration({
        nowIso: '2026-06-30T02:00:00.000Z'
    });

    assert.equal(result.ok, true);
    assert.equal(result.status, 'completed');
    assert.equal(result.run.processedEntryCount, 2);
    assert.equal(result.run.profileUpdateCount, 1);
    assert.equal(result.run.relationshipUpdateCount, 1);
    assert.equal(result.userProfile.items.length, 1);
    assert.match(result.userProfile.items[0].claim, /直接、具体/);
    assert.deepEqual(result.userProfile.items[0].evidenceIds, ['raw-direct-style']);
    assert.equal(result.relationshipProfile.items.length, 1);
    assert.equal(result.affinityState.repairState, 'recovering');
    assert.equal(result.affinityState.trust, 0.52);
    assert.equal(result.affinityState.familiarity, 0.53);
    assert.equal(result.affinityState.friction, 0.22);

    const skipped = await curator.runDailyCuration({
        nowIso: '2026-06-30T12:00:00.000Z'
    });
    assert.equal(skipped.status, 'already_curated_today');

    const persisted = JSON.parse(await fs.readFile(path.join(rootDir, 'memory', 'user-profile.json'), 'utf8'));
    assert.equal(persisted.items.length, 1);
});

test('AILIS user profile curator rejects unsupported LLM updates without raw evidence ids', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-curator-invalid-'));
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    ledger.appendEntry({
        id: 'raw-real-evidence',
        iso: '2026-06-29T10:00:00.000Z',
        type: 'chat.llm_turn',
        source: 'test',
        sessionId: 'main',
        payload: {
            requestPayload: {
                memoryUserMessage: '今天测试一下。'
            }
        }
    });

    const curator = new AILISUserProfileCurator({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        llmClient: async () => ({
            content: JSON.stringify({
                profileUpdates: [
                    {
                        category: 'communication_style',
                        claim: '用户永远喜欢非常长的回答。',
                        confidence: 0.99,
                        stability: 'stable',
                        evidenceIds: ['missing-evidence'],
                        reason: 'bad evidence'
                    }
                ],
                relationshipUpdates: [],
                affinityUpdate: {
                    trustDelta: 0.05,
                    familiarityDelta: 0.05,
                    warmthDelta: 0.05,
                    frictionDelta: -0.05,
                    repairState: 'warm',
                    evidenceIds: ['missing-evidence'],
                    reason: 'bad evidence'
                },
                rejectedSignals: []
            })
        })
    });

    const result = await curator.runDailyCuration({
        nowIso: '2026-06-30T02:00:00.000Z'
    });

    assert.equal(result.ok, true);
    assert.equal(result.status, 'completed');
    assert.equal(result.run.profileUpdateCount, 0);
    assert.equal(result.run.affinityChanged, false);
    assert.equal(result.userProfile.items.length, 0);
    assert.equal(result.affinityState.trust, 0.5);
});

test('AILIS user profile curator records evidence-bound temporal preference events', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-preference-'));
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    ledger.appendEntry({
        id: 'raw-address-preference',
        iso: '2026-07-02T10:00:00.000Z',
        type: 'chat.llm_turn',
        source: 'test',
        sessionId: 'main',
        runId: 'turn-address',
        payload: {
            requestPayload: {
                memoryUserMessage: '今天你叫我队长，明天恢复以前的叫法。'
            },
            result: { content: '好。' }
        }
    });
    const preferenceState = new AILISPreferenceState({ rootDir: path.join(rootDir, 'memory') });
    const curator = new AILISUserProfileCurator({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        preferenceState,
        llmClient: async () => ({
            content: JSON.stringify({
                ...emptyExtraction(),
                preferenceEvents: [
                    {
                        slot: 'address.ailis_to_user',
                        operation: 'set',
                        value: '队长',
                        scope: 'day',
                        explicitness: 'explicit',
                        confidence: 0.98,
                        evidenceId: 'raw-address-preference',
                        evidenceQuote: '今天你叫我队长',
                        reason: '用户明确限定为今天。'
                    },
                    {
                        slot: 'address.user_to_ailis',
                        operation: 'set',
                        value: '队长',
                        scope: 'day',
                        explicitness: 'implicit',
                        confidence: 0.99,
                        evidenceId: 'raw-address-preference',
                        evidenceQuote: '模型编造的证据',
                        reason: '应被证据校验拒绝。'
                    }
                ]
            })
        })
    });

    const result = await curator.runDailyCuration({
        nowIso: '2026-07-02T11:00:00.000Z'
    });
    assert.equal(result.run.preferenceEventCount, 1);
    const snapshot = preferenceState.resolve({ sessionId: 'main', now: '2026-07-02T12:00:00.000Z' });
    assert.equal(snapshot.active['address.ailis_to_user'].value, '队长');
    assert.equal(snapshot.active['address.user_to_ailis'], undefined);
});

test('AILIS preference curation advances past TaskAgent traces without sending them to the memory model', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-trace-isolation-'));
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    ledger.appendEntry({
        id: 'raw-task-trace',
        iso: '2026-07-03T09:00:00.000Z',
        type: 'agent.transcript.item',
        source: 'task-agent',
        sessionId: 'main',
        payload: { payload: { toolOutput: 'large private execution trace that must not become persona memory' } }
    });
    ledger.appendEntry({
        id: 'raw-task-final-turn',
        iso: '2026-07-03T09:00:30.000Z',
        type: 'chat.llm_turn',
        source: 'task-agent',
        sessionId: 'main:task-agent:task-1',
        payload: {
            agentRole: 'task_agent',
            requestPayload: { memoryUserMessage: 'internal delegated task text' },
            result: { content: 'internal task result' }
        }
    });
    ledger.appendEntry({
        id: 'legacy-child-agent-turn',
        iso: '2026-07-03T09:00:45.000Z',
        type: 'chat.llm_turn',
        source: 'agent_runtime',
        sessionId: 'main:agent:legacy-child',
        payload: {
            requestPayload: { memoryUserMessage: 'Legacy child-agent delegated prompt must not become user memory.' }
        }
    });
    ledger.appendEntry({
        id: 'raw-user-visible',
        iso: '2026-07-03T09:01:00.000Z',
        type: 'chat.llm_turn',
        source: 'chat',
        sessionId: 'main',
        payload: {
            requestPayload: { memoryUserMessage: '回答时不要把内部执行日志说出来。' },
            result: { content: '我会保持出口自然。' }
        }
    });
    let curatorInput = null;
    const curator = new AILISUserProfileCurator({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        llmClient: async (request) => {
            curatorInput = parseCuratorInput(request);
            return { content: JSON.stringify(emptyExtraction()) };
        }
    });

    const result = await curator.runDailyCuration({ nowIso: '2026-07-03T10:00:00.000Z' });
    assert.equal(result.run.processedEntryCount, 4);
    assert.deepEqual(curatorInput.evidence.map((entry) => entry.id), ['raw-user-visible']);
    assert.equal(curatorInput.evidence[0].text, '回答时不要把内部执行日志说出来。');
    assert.doesNotMatch(JSON.stringify(curatorInput), /large private execution trace/);
    assert.doesNotMatch(JSON.stringify(curatorInput), /internal delegated task text/);
    assert.doesNotMatch(JSON.stringify(curatorInput), /Legacy child-agent delegated prompt/);
});

test('AILIS curator rebuilds the Raw Ledger in staging and atomically promotes user and relationship capsules', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-rebuild-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    for (const index of [1, 2, 3]) {
        ledger.appendEntry({
            id: `raw-rebuild-${index}`,
            iso: `2026-07-04T09:00:0${index}.000Z`,
            type: 'chat.llm_turn',
            source: 'chat',
            sessionId: 'main',
            payload: {
                requestPayload: { memoryUserMessage: `长期偏好证据 ${index}` },
                result: { content: '收到。' }
            }
        });
    }
    await fs.mkdir(memoryRoot, { recursive: true });
    await fs.writeFile(path.join(memoryRoot, 'user-profile.json'), JSON.stringify({
        version: 1,
        items: [{ id: 'old-profile', claim: 'old production profile' }]
    }));

    const curator = new AILISUserProfileCurator({
        rootDir: memoryRoot,
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        llmClient: async (request) => {
            const evidenceId = parseCuratorInput(request).evidence[0].id;
            return {
                content: JSON.stringify({
                    ...emptyExtraction('rebuild batch'),
                    profileUpdates: [{
                        category: 'work_style',
                        claim: '用户重视可恢复的长期系统。',
                        confidence: 0.92,
                        stability: 'stable',
                        evidenceIds: [evidenceId]
                    }],
                    relationshipUpdates: [{
                        claim: '发生复杂改动时要清楚说明恢复边界。',
                        confidence: 0.9,
                        stability: 'stable',
                        evidenceIds: [evidenceId]
                    }]
                })
            };
        }
    });

    const rebuilt = await curator.rebuildFromRawMemory({
        maxPasses: 5,
        maxBatches: 1,
        rawLimit: 1,
        evidenceLimit: 1
    });
    assert.equal(rebuilt.ok, true);
    assert.equal(rebuilt.status, 'rebuild_completed');
    assert.equal(rebuilt.rebuild.processedEntryCount, 3);
    assert.equal(rebuilt.userProfile.items.length, 1);
    assert.equal(rebuilt.relationshipProfile.items.length, 1);

    const promoted = JSON.parse(await fs.readFile(path.join(memoryRoot, 'user-profile.json'), 'utf8'));
    assert.match(promoted.items[0].claim, /可恢复/);
    const backup = JSON.parse(await fs.readFile(
        path.join(rebuilt.rebuild.backupRoot, 'user-profile.json'),
        'utf8'
    ));
    assert.equal(backup.items[0].id, 'old-profile');
    const state = await curator.getState();
    assert.equal(state.rebuild.status, 'completed');

    const restarted = await curator.rebuildFromRawMemory({
        restart: true,
        maxPasses: 5,
        maxBatches: 1,
        rawLimit: 1,
        evidenceLimit: 1
    });
    assert.equal(restarted.status, 'rebuild_completed');
    assert.equal(restarted.rebuild.processedEntryCount, 3);
    assert.equal(restarted.rebuild.passCount, 3);
});

test('AILIS curator recomputes completed rebuild counters from staged run records', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-rebuild-stats-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    for (const index of [1, 2, 3]) {
        ledger.appendEntry({
            id: `raw-stats-${index}`,
            iso: `2026-07-04T10:00:0${index}.000Z`,
            type: 'chat.llm_turn',
            source: 'chat',
            sessionId: 'main',
            payload: { requestPayload: { memoryUserMessage: `统计证据 ${index}` } }
        });
    }
    const llmClient = async (request) => {
        const evidenceId = parseCuratorInput(request).evidence[0].id;
        return {
            content: JSON.stringify({
                ...emptyExtraction('stats batch'),
                profileUpdates: [{
                    category: 'work_style',
                    claim: '用户希望重建统计可审计。',
                    confidence: 0.9,
                    stability: 'stable',
                    evidenceIds: [evidenceId]
                }],
                relationshipUpdates: [{
                    claim: '状态恢复必须报告真实进度。',
                    confidence: 0.9,
                    stability: 'stable',
                    evidenceIds: [evidenceId]
                }]
            })
        };
    };
    const curator = new AILISUserProfileCurator({
        rootDir: memoryRoot,
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        llmClient
    });
    const rebuilt = await curator.rebuildFromRawMemory({
        maxPasses: 5,
        maxBatches: 1,
        rawLimit: 1,
        evidenceLimit: 1
    });
    const staleManifest = {
        ...rebuilt.rebuild,
        status: 'promoting',
        passCount: 99,
        processedEntryCount: 999,
        evidenceCount: 999,
        profileUpdateCount: 999,
        relationshipUpdateCount: 999
    };
    const stagingCurator = new AILISUserProfileCurator({
        rootDir: rebuilt.rebuild.stagingRoot,
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        llmClient
    });

    const repaired = await curator.promoteStagedRebuild(staleManifest, stagingCurator);

    assert.equal(repaired.rebuild.passCount, 3);
    assert.equal(repaired.rebuild.processedEntryCount, 3);
    assert.equal(repaired.rebuild.evidenceCount, 3);
    assert.equal(repaired.rebuild.profileUpdateCount, 3);
    assert.equal(repaired.rebuild.relationshipUpdateCount, 3);
});

test('AILIS curator keeps production capsules untouched when rebuild pauses and resumes the same staging run', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-rebuild-resume-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    ledger.appendEntry({
        id: 'raw-resumable',
        iso: '2026-07-05T09:00:00.000Z',
        type: 'chat.llm_turn',
        source: 'chat',
        sessionId: 'main',
        payload: { requestPayload: { memoryUserMessage: '请长期记住：失败时保留旧状态。' } }
    });
    await fs.mkdir(memoryRoot, { recursive: true });
    await fs.writeFile(path.join(memoryRoot, 'user-profile.json'), JSON.stringify({
        version: 1,
        items: [{ id: 'production-profile', claim: 'must survive failed rebuild' }]
    }));

    const curator = new AILISUserProfileCurator({
        rootDir: memoryRoot,
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        llmClient: async () => ({ ok: false, error: 'temporary extractor outage' })
    });
    const paused = await curator.rebuildFromRawMemory({ maxPasses: 1 });
    assert.equal(paused.ok, false);
    assert.equal(paused.status, 'rebuild_paused');
    const stillProduction = JSON.parse(await fs.readFile(path.join(memoryRoot, 'user-profile.json'), 'utf8'));
    assert.equal(stillProduction.items[0].id, 'production-profile');

    curator.llmClient = async () => ({
        content: JSON.stringify({
            ...emptyExtraction('recovered'),
            profileUpdates: [{
                category: 'engineering_principles',
                claim: '失败时保留旧状态，恢复后再替换。',
                confidence: 0.95,
                stability: 'stable',
                evidenceIds: ['raw-resumable']
            }],
            relationshipUpdates: [{
                claim: '恢复动作必须可解释、可回退。',
                confidence: 0.9,
                stability: 'stable',
                evidenceIds: ['raw-resumable']
            }]
        })
    });
    const resumed = await curator.rebuildFromRawMemory({ maxPasses: 2 });
    assert.equal(resumed.ok, true);
    assert.equal(resumed.status, 'rebuild_completed');
    assert.equal(resumed.rebuild.id, paused.rebuild.id);
    const replaced = JSON.parse(await fs.readFile(path.join(memoryRoot, 'user-profile.json'), 'utf8'));
    assert.match(replaced.items[0].claim, /保留旧状态/);
});

test('AILIS user profile curator processes raw memory in resumable chronological batches', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-curator-batches-'));
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    for (const index of [1, 2, 3, 4, 5]) {
        ledger.appendEntry({
            id: `raw-${index}`,
            iso: `2026-06-29T10:00:0${index}.000Z`,
            type: 'chat.llm_turn',
            source: 'test',
            sessionId: 'main',
            category: 'conversation',
            payload: {
                requestPayload: {
                    memoryUserMessage: `用户原始经历 ${index}`
                },
                result: {
                    content: `AILIS 回复 ${index}`
                }
            }
        });
    }

    const calls = [];
    const curator = new AILISUserProfileCurator({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        llmClient: async (request) => {
            const input = parseCuratorInput(request);
            calls.push({
                batch: input.batch,
                evidenceIds: input.evidence.map((entry) => entry.id)
            });
            return {
                content: JSON.stringify(emptyExtraction(`batch ${calls.length}`))
            };
        }
    });

    const options = {
        nowIso: '2026-06-30T02:00:00.000Z',
        evidenceLimit: 2,
        maxBatches: 1,
        rawLimit: 2
    };

    const first = await curator.runDailyCuration(options);
    assert.equal(first.status, 'partial_completed');
    assert.equal(first.run.processedEntryCount, 2);
    assert.equal(first.run.remainingEntryCount, 3);
    assert.deepEqual(calls[0].evidenceIds, ['raw-1', 'raw-2']);
    assert.equal(first.run.cursor.lastProcessedEntryId, 'raw-2');
    let state = JSON.parse(await fs.readFile(path.join(rootDir, 'memory', 'profile-curation-state.json'), 'utf8'));
    assert.equal(state.lastRunDate, '');

    const second = await curator.runDailyCuration({
        ...options,
        nowIso: '2026-06-30T03:00:00.000Z'
    });
    assert.equal(second.status, 'partial_completed');
    assert.equal(second.run.processedEntryCount, 2);
    assert.equal(second.run.remainingEntryCount, 1);
    assert.deepEqual(calls[1].evidenceIds, ['raw-3', 'raw-4']);
    assert.equal(second.run.cursor.lastProcessedEntryId, 'raw-4');
    state = JSON.parse(await fs.readFile(path.join(rootDir, 'memory', 'profile-curation-state.json'), 'utf8'));
    assert.equal(state.lastRunDate, '');

    const third = await curator.runDailyCuration({
        ...options,
        nowIso: '2026-06-30T04:00:00.000Z'
    });
    assert.equal(third.status, 'completed');
    assert.equal(third.run.processedEntryCount, 1);
    assert.equal(third.run.remainingEntryCount, 0);
    assert.deepEqual(calls[2].evidenceIds, ['raw-5']);
    assert.equal(third.run.cursor.lastProcessedEntryId, 'raw-5');
    state = JSON.parse(await fs.readFile(path.join(rootDir, 'memory', 'profile-curation-state.json'), 'utf8'));
    assert.equal(state.lastRunDate, '2026-06-30');

    const skipped = await curator.runDailyCuration({
        ...options,
        nowIso: '2026-06-30T05:00:00.000Z'
    });
    assert.equal(skipped.status, 'already_curated_today');
    assert.equal(calls.length, 3);
});

test('AILIS curator composite cursor does not skip Raw Ledger entries that share one timestamp', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-curator-same-iso-'));
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    for (const id of ['same-iso-a', 'same-iso-b']) {
        ledger.appendEntry({
            id,
            iso: '2026-07-06T10:00:00.000Z',
            type: 'chat.llm_turn',
            source: 'chat',
            sessionId: 'main',
            payload: { requestPayload: { memoryUserMessage: `evidence ${id}` } }
        });
    }
    const seen = [];
    const curator = new AILISUserProfileCurator({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        llmClient: async (request) => {
            seen.push(parseCuratorInput(request).evidence[0].id);
            return { content: JSON.stringify(emptyExtraction()) };
        }
    });

    const first = await curator.runDailyCuration({ rawLimit: 1, evidenceLimit: 1, maxBatches: 1, force: true });
    const second = await curator.runDailyCuration({ rawLimit: 1, evidenceLimit: 1, maxBatches: 1, force: true });
    assert.equal(first.status, 'partial_completed');
    assert.equal(second.status, 'completed');
    assert.deepEqual(seen, ['same-iso-a', 'same-iso-b']);
});

test('AILIS user profile curator does not advance cursor when the first LLM batch fails', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-profile-curator-fail-'));
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    for (const index of [1, 2]) {
        ledger.appendEntry({
            id: `raw-fail-${index}`,
            iso: `2026-06-29T11:00:0${index}.000Z`,
            type: 'chat.llm_turn',
            source: 'test',
            sessionId: 'main',
            payload: {
                requestPayload: {
                    memoryUserMessage: `待抽取经历 ${index}`
                }
            }
        });
    }

    const curator = new AILISUserProfileCurator({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        llmClient: async () => ({
            ok: false,
            error: 'extractor unavailable'
        })
    });

    const result = await curator.runDailyCuration({
        nowIso: '2026-06-30T02:00:00.000Z',
        evidenceLimit: 1,
        maxBatches: 1
    });
    assert.equal(result.ok, false);
    assert.equal(result.status, 'llm_failed');

    const loaded = await curator.loadState();
    assert.equal(loaded.state.cursor.lastProcessedIso, '');
    assert.equal(loaded.state.cursor.lastProcessedEntryId, '');
    assert.equal(loaded.state.runCount, 0);
    assert.equal(loaded.state.lastRunDate, '');
});

test('AILIS user profile curator accepts structured provider output and the last balanced JSON object', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-curator-provider-json-'));
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    ledger.appendEntry({
        id: 'provider-json-evidence',
        iso: '2026-07-17T00:00:00.000Z',
        type: 'chat.llm_turn',
        source: 'desktop_chat',
        sessionId: 'persona-session',
        payload: {
            requestPayload: {
                memoryUserMessage: '请记住，我更喜欢简洁而有依据的回答。'
            }
        }
    });
    let callCount = 0;
    const curator = new AILISUserProfileCurator({
        rootDir: path.join(rootDir, 'memory'),
        rawMemoryLedger: ledger,
        llmClient: async () => {
            callCount += 1;
            if (callCount === 1) {
                return { ok: false, code: 'empty_response', error: 'empty response' };
            }
            return {
                ok: true,
                output: [
                    { type: 'output_text', text: 'Example only: {"ignored":true}.\nFinal: {"daySummary":"明确表达回答偏好","profileUpdates":[{"category":"communication_style","claim":"偏好简洁而有依据的回答","operation":"add_or_merge","confidence":0.95,"stability":"candidate","evidenceIds":["provider-json-evidence"],"reason":"用户明确要求记住"}],"relationshipUpdates":[],"preferenceEvents":[],"affinityUpdate":{"trustDelta":0,"familiarityDelta":0,"warmthDelta":0,"frictionDelta":0,"repairState":"stable","reason":"无关系变化","evidenceIds":[]},"rejectedSignals":[]}' }
                ]
            };
        }
    });

    const result = await curator.runDailyCuration({ force: true, maxBatches: 1 });
    assert.equal(result.ok, true);
    assert.equal(callCount, 2);
    assert.equal(result.userProfile.items.length, 1);
    assert.match(result.userProfile.items[0].claim, /简洁而有依据/);
});

test('AILIS curator uses one production lock across rebuild and scheduled curation instances', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-curator-single-writer-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    ledger.appendEntry({
        id: 'single-writer-evidence',
        iso: '2026-07-17T01:00:00.000Z',
        type: 'chat.llm_turn',
        source: 'desktop_chat',
        sessionId: 'persona-session',
        payload: {
            requestPayload: {
                memoryUserMessage: '请记住：长期任务必须保留可恢复状态。'
            }
        }
    });

    let releaseLlm;
    let markLlmStarted;
    const llmStarted = new Promise((resolve) => {
        markLlmStarted = resolve;
    });
    const blockingLlmClient = async (request) => {
        const input = parseCuratorInput(request);
        markLlmStarted();
        await new Promise((resolve) => {
            releaseLlm = resolve;
        });
        return {
            content: JSON.stringify({
                ...emptyExtraction('single writer rebuild'),
                profileUpdates: [{
                    category: 'engineering_principles',
                    claim: '长期任务必须保留可恢复状态。',
                    operation: 'add_or_merge',
                    confidence: 0.95,
                    stability: 'stable',
                    evidenceIds: [input.evidence[0].id],
                    reason: '用户明确要求记住。'
                }]
            })
        };
    };

    const manualCurator = new AILISUserProfileCurator({
        rootDir: memoryRoot,
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        llmClient: blockingLlmClient
    });
    const scheduledCurator = new AILISUserProfileCurator({
        rootDir: memoryRoot,
        workspaceRoot: rootDir,
        rawMemoryLedger: ledger,
        llmClient: async () => ({ content: JSON.stringify(emptyExtraction()) })
    });

    const rebuildPromise = manualCurator.rebuildFromRawMemory({ restart: true, maxPasses: 1 });
    await llmStarted;

    const scheduledResult = await scheduledCurator.runDailyCuration({ force: true });
    assert.equal(scheduledResult.ok, false);
    assert.equal(scheduledResult.status, 'profile_curation_already_running');
    assert.equal(scheduledResult.activeOperation.operation, 'profile_rebuild');

    releaseLlm();
    const rebuildResult = await rebuildPromise;
    assert.equal(rebuildResult.ok, true);
    assert.equal(rebuildResult.status, 'rebuild_completed');
    await assert.rejects(fs.access(path.join(memoryRoot, 'profile-curation.lock.json')));
});

test('AILIS curator restores capsule JSON files with a UTF-8 BOM', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-curator-bom-'));
    const memoryRoot = path.join(rootDir, 'memory');
    await fs.mkdir(memoryRoot, { recursive: true });
    const writeBomJson = (name, value) => fs.writeFile(
        path.join(memoryRoot, name),
        `\uFEFF${JSON.stringify(value)}`,
        'utf8'
    );
    await Promise.all([
        writeBomJson('user-profile.json', {
            version: 1,
            items: [{ id: 'profile-bom', claim: 'BOM profile survives restart.' }]
        }),
        writeBomJson('relationship-profile.json', {
            version: 1,
            items: [{ id: 'relationship-bom', claim: 'BOM relationship survives restart.' }]
        }),
        writeBomJson('affinity-state.json', { version: 1, trust: 0.7 }),
        writeBomJson('profile-curation-state.json', { version: 1, runCount: 2 })
    ]);

    const curator = new AILISUserProfileCurator({ rootDir: memoryRoot });
    const loaded = await curator.loadState();
    assert.equal(loaded.userProfile.items[0].claim, 'BOM profile survives restart.');
    assert.equal(loaded.relationshipProfile.items[0].claim, 'BOM relationship survives restart.');
    assert.equal(loaded.affinityState.trust, 0.7);
    assert.equal(loaded.state.runCount, 2);
});
