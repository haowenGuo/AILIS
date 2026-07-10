import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { AILISTaskResultCapsuleStore } = require('../electron/ailis-task-result-capsules.cjs');
const { validateToolContract } = require('../electron/ailis-tool-contracts.cjs');

test('AILIS task result capsules reuse related public results without exposing control protocols', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-capsules-'));
    const store = new AILISTaskResultCapsuleStore({ rootDir });
    const capsule = store.save({
        taskId: 'task-roxy-guide',
        sessionId: 'main',
        generatedAt: '2026-07-09T12:00:00.000Z',
        request: '做一套终末地洛茜完整攻略',
        taskRunHandoff: {
            status: 'completed',
            finalAnswer: '[expression:happy]洛茜适合物理输出队，核心是先叠增益再爆发。\n<｜｜DSML｜｜tool_calls>',
            collectedData: [
                {
                    title: '角色资料页',
                    summary: '确认了技能与队伍定位。',
                    evidenceRefs: ['source-1'],
                    outputId: 'output-1'
                }
            ]
        }
    });

    assert.equal(capsule.status, 'completed');
    assert.doesNotMatch(capsule.answer, /expression|DSML|tool_calls/);

    const related = store.search('洛茜配队怎么调整', { sessionId: 'main' });
    assert.equal(related[0].id, capsule.id);
    assert.equal(store.search('帮我检查 Python 单元测试', { sessionId: 'main' }).length, 0);

    const context = store.buildPersonaContext('洛茜配队怎么调整', { sessionId: 'main' });
    assert.match(context, /generated_at: 2026-07-09T12:00:00.000Z/);
    assert.match(context, /洛茜适合物理输出队/);
    assert.match(context, /不代表本轮重新执行/);
    assert.doesNotMatch(context, /expression|DSML|tool_calls/);
});

test('task_results uses a strict read-only schema', () => {
    assert.equal(validateToolContract('task_results', {
        action: 'search',
        query: '洛茜攻略',
        limit: 2
    }).ok, true);
    assert.equal(validateToolContract('task_results', {
        action: 'search',
        query: '',
        unexpected: true
    }).ok, false);
    assert.equal(validateToolContract('task_results', {
        action: 'get'
    }).ok, false);
});

test('AILIS task result capsules sanitize legacy records when loading from disk', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-capsules-legacy-'));
    await fs.writeFile(path.join(rootDir, 'capsules.json'), JSON.stringify({
        version: 1,
        capsules: [
            {
                id: 'legacy-result',
                taskId: 'legacy-task',
                generatedAt: '2026-07-01T00:00:00.000Z',
                status: 'completed',
                request: '洛茜攻略',
                answer: '【expression:happy】可复用结论\n<｜｜DSML｜｜tool_calls>',
                summary: '[action:wave]摘要'
            }
        ]
    }), 'utf8');

    const store = new AILISTaskResultCapsuleStore({ rootDir });
    const legacy = store.get('legacy-result');
    assert.equal(legacy.answer, '可复用结论');
    assert.equal(legacy.summary, '摘要');
    assert.doesNotMatch(JSON.stringify(legacy), /expression|action:|DSML|tool_calls/);
});

test('AILIS task result capsules backfill completed historical subagent results once', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-capsules-backfill-'));
    const store = new AILISTaskResultCapsuleStore({ rootDir });
    const events = [
        {
            id: 'old-task-turn',
            ts: '2026-07-05T09:00:00.000Z',
            sessionId: 'main',
            userText: '做一套洛茜攻略',
            assistantText: '[expression:relaxed]洛茜攻略已经整理完成。',
            resultStatus: 'completed',
            resultIntent: 'direct_tool:subagents'
        },
        {
            id: 'old-conversation-turn',
            ts: '2026-07-05T10:00:00.000Z',
            sessionId: 'main',
            userText: '你好',
            assistantText: '你好呀',
            resultStatus: 'completed',
            resultIntent: 'direct_conversation_final'
        }
    ];

    assert.equal(store.backfillFromMemoryEvents(events).imported, 1);
    assert.equal(store.backfillFromMemoryEvents(events).imported, 0);
    const result = store.search('洛茜攻略', { sessionId: 'main' })[0];
    assert.match(result.answer, /攻略已经整理完成/);
    assert.doesNotMatch(result.answer, /expression/);
});
