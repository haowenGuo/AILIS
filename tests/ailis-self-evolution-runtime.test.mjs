import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AilisSelfEvolutionRuntime } = require('../electron/ailis-self-evolution-runtime.cjs');

async function makeRuntime(fixtures = {}) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-self-evolution-'));
    const events = [];
    const runtime = new AilisSelfEvolutionRuntime({
        workspaceRoot: root,
        projectRoot: root,
        auditDir: path.join(root, '.audit'),
        emitGatewayEvent: (type, payload) => events.push({ type, payload }),
        ...fixtures
    });
    await runtime.initialize();
    return { root, runtime, events };
}

test('AILIS self evolution creates and applies preference proposals', async () => {
    let updatedBlock = null;
    const memoryRuntime = {
        getSnapshot() {
            return {
                ok: true,
                blocks: [
                    {
                        key: 'user',
                        value: '- 用户偏好直接、细致、能落地。'
                    }
                ],
                recentEvents: [
                    {
                        id: 'evt-preference-1',
                        ts: '2026-06-14T10:00:00.000Z',
                        tags: ['preference', 'relationship'],
                        importance: 8,
                        summary: '用户希望 AILIS 少一点工具日志感，多一点拟人解释和可审计过程。'
                    }
                ]
            };
        },
        updateBlock(key, value) {
            updatedBlock = { key, value };
            return { ok: true, block: updatedBlock };
        }
    };
    const { runtime } = await makeRuntime({ memoryRuntime });

    const analyzed = await runtime.analyze();
    assert.equal(analyzed.ok, true);
    const proposal = analyzed.proposals.find((entry) => entry.type === 'preference_consolidation');
    assert.ok(proposal);
    assert.match(proposal.summary, /拟人解释/);
    assert.equal(proposal.safetyGate.requiresApproval, true);

    const needsApproval = await runtime.applyProposal({ id: proposal.id });
    assert.equal(needsApproval.status, 'needs_approval');

    const applied = await runtime.applyProposal({ id: proposal.id, approved: true });
    assert.equal(applied.status, 'completed');
    assert.equal(updatedBlock.key, 'user');
    assert.match(updatedBlock.value, /拟人解释/);
});

test('AILIS self evolution turns tool bottlenecks into self-debug cases', async () => {
    let openedCaseArgs = null;
    const toolDoctor = {
        async execute(args) {
            assert.equal(args.action, 'scorecard');
            return {
                details: {
                    status: 'completed',
                    tools: [
                        {
                            tool: 'mcp__slow_search__web_fetch',
                            total: 6,
                            successRate: 0.16,
                            failureRate: 0.84,
                            timeoutRate: 0.5,
                            averageLatencyMs: 22000,
                            commonErrors: [{ code: 'timeout', count: 3 }],
                            recent: [{ runId: 'run-1', status: 'timeout' }]
                        }
                    ]
                }
            };
        }
    };
    const selfDebugger = {
        async execute(args, context) {
            openedCaseArgs = { args, context };
            return {
                details: {
                    case: {
                        id: 'case-tool-1',
                        affectedCapability: args.affectedCapability
                    }
                }
            };
        }
    };
    const { runtime } = await makeRuntime({ toolDoctor, selfDebugger });

    const analyzed = await runtime.analyze();
    const proposal = analyzed.proposals.find((entry) => entry.type === 'tool_bottleneck_repair');
    assert.ok(proposal);
    assert.match(proposal.summary, /失败率 84\.0%/);
    assert.equal(proposal.risk, 'high');

    const applied = await runtime.applyProposal({ id: proposal.id, approved: true });
    assert.equal(applied.status, 'completed');
    assert.equal(openedCaseArgs.args.action, 'open_case');
    assert.equal(openedCaseArgs.args.affectedCapability, 'mcp__slow_search__web_fetch');
    assert.equal(openedCaseArgs.context.source, 'self_evolution');
});

test('AILIS self evolution can approve and reject proposals without deleting history', async () => {
    const { runtime } = await makeRuntime({
        memoryRuntime: {
            getSnapshot: () => ({
                blocks: [{ key: 'user', value: '' }],
                recentEvents: [
                    {
                        id: 'evt-preference-2',
                        tags: ['preference'],
                        importance: 7,
                        summary: '用户希望自我修改必须走分支、测试、审批和回滚。'
                    }
                ]
            })
        }
    });

    const analyzed = await runtime.analyze();
    const proposal = analyzed.proposals[0];
    const approved = await runtime.markProposal({ id: proposal.id, status: 'approved', note: 'looks safe' });
    assert.equal(approved.status, 'completed');
    assert.equal(approved.proposal.status, 'approved');

    const rejected = await runtime.markProposal({ id: proposal.id, status: 'rejected', note: 'not now' });
    assert.equal(rejected.status, 'completed');
    assert.equal(rejected.proposal.status, 'rejected');

    const listed = await runtime.listProposals({ limit: 10 });
    assert.equal(listed.proposals.some((entry) => entry.id === proposal.id && entry.status === 'rejected'), true);
});
