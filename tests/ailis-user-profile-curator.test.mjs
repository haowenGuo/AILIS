import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { AILISRawMemoryLedger } = require('../electron/ailis-raw-memory-ledger.cjs');
const { AILISUserProfileCurator } = require('../electron/ailis-user-profile-curator.cjs');

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
