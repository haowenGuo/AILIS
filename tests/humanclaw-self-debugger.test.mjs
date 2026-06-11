import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { HumanClawRuntime } = require('../electron/humanclaw-runtime.cjs');
const { HumanClawSelfDebugger } = require('../electron/humanclaw-self-debugger.cjs');

async function makeWorkspace(prefix) {
    return await fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

function makePatch() {
    return [
        'diff --git a/buggy.txt b/buggy.txt',
        '--- a/buggy.txt',
        '+++ b/buggy.txt',
        '@@ -1 +1 @@',
        '-old behavior',
        '+fixed behavior',
        ''
    ].join('\n');
}

test('Self Debugger opens a case, collects evidence, validates a repair, and applies only after approval', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-self-debugger-');
    await fs.writeFile(path.join(workspaceRoot, 'buggy.txt'), 'old behavior\n', 'utf8');
    const auditDir = path.join(workspaceRoot, '.audit');
    const runtime = new HumanClawRuntime({
        workspaceRoot,
        projectRoot: workspaceRoot,
        auditDir
    });

    try {
        await runtime.startRun({
            runId: 'self-debug-run',
            sessionId: 'debug-session',
            message: 'AIGL 读文件时返回旧行为',
            planner: 'test'
        });
        await runtime.appendItem('self-debug-run', {
            type: 'tool.result',
            sessionId: 'debug-session',
            status: 'failed',
            payload: {
                tool: 'read',
                summary: 'returned old behavior'
            }
        });

        const opened = await runtime.executeTool('self_debugger', {
            action: 'open_case',
            bugReport: 'AIGL 读文件时返回旧行为，需要自我排查',
            affectedCapability: 'code',
            recentRunId: 'self-debug-run',
            sourceHints: ['buggy.txt']
        }, {
            runId: 'self-debug-run',
            sessionId: 'debug-session'
        });
        assert.equal(opened.details.status, 'completed');
        const caseId = opened.details.case.id;

        const evidence = await runtime.executeTool('self_debugger', {
            action: 'collect_evidence',
            caseId,
            maxFileChars: 4000
        }, {
            runId: 'self-debug-run',
            sessionId: 'debug-session'
        });
        assert.equal(evidence.details.status, 'completed');
        assert.ok(evidence.details.evidence.some((entry) => entry.type === 'transcript'));
        assert.ok(evidence.details.evidence.some((entry) => entry.type === 'source'));

        const diagnosis = await runtime.executeTool('self_debugger', {
            action: 'diagnose',
            caseId,
            validationCommands: ['echo validated']
        });
        assert.equal(diagnosis.details.status, 'completed');
        assert.ok(diagnosis.details.diagnosis.suspectedFiles.some((filePath) => filePath.endsWith('buggy.txt')));

        const proposed = await runtime.executeTool('self_debugger', {
            action: 'propose_patch',
            caseId,
            candidateDiff: makePatch(),
            validationCommands: ['echo validated']
        });
        assert.equal(proposed.details.status, 'completed');
        assert.equal(proposed.details.nextAction, 'validate_patch');

        const validated = await runtime.executeTool('self_debugger', {
            action: 'validate_patch',
            caseId
        });
        assert.equal(validated.details.status, 'completed', JSON.stringify(validated.details.validation));
        assert.equal(await fs.readFile(path.join(workspaceRoot, 'buggy.txt'), 'utf8'), 'old behavior\n');

        const blocked = await runtime.executeTool('self_debugger', {
            action: 'apply_patch',
            caseId
        });
        assert.equal(blocked.details.status, 'needs_approval');

        const applied = await runtime.executeTool('self_debugger', {
            action: 'apply_patch',
            caseId,
            approved: true
        }, {
            approved: true
        });
        assert.equal(applied.details.status, 'completed', JSON.stringify(applied.details.repairResult));
        assert.equal(await fs.readFile(path.join(workspaceRoot, 'buggy.txt'), 'utf8'), 'fixed behavior\n');
    } finally {
        await runtime.shutdown();
    }
});

test('HumanClaw runtime exposes Self Debugger as a high-risk runtime tool', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-self-debugger-runtime-');
    const runtime = new HumanClawRuntime({
        workspaceRoot,
        projectRoot: workspaceRoot,
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        assert.equal(runtime.canExecuteTool('self_debugger'), true);
        assert.ok(runtime.getStatus().capabilities.includes('self_debug_loop'));
        assert.ok(runtime.getRuntimeToolDefinitions().some((tool) => tool.id === 'self_debugger'));

        const schema = await runtime.executeTool('self_debugger', { action: 'schema' });
        assert.equal(schema.details.status, 'completed');
        assert.match(schema.details.contract, /TOOL CONTRACT self_debugger@v/);

        const classification = runtime.classifyToolCall({
            toolId: 'self_debugger',
            args: { action: 'apply_patch' }
        });
        assert.equal(classification.class, 'self_debug');
        assert.equal(classification.mutates, true);
        assert.equal(classification.requiresApprovalCapable, true);
    } finally {
        await runtime.shutdown();
    }
});

test('Self Debugger rejects paths outside the project root during source evidence collection', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-self-debugger-path-');
    const debuggerTool = new HumanClawSelfDebugger({
        workspaceRoot,
        projectRoot: workspaceRoot,
        auditDir: path.join(workspaceRoot, '.audit')
    });

    const opened = await debuggerTool.execute({
        action: 'open_case',
        bugReport: 'path safety test',
        sourceHints: ['..\\outside.txt']
    });
    const evidence = await debuggerTool.execute({
        action: 'collect_evidence',
        caseId: opened.details.case.id,
        sourceHints: ['..\\outside.txt']
    });

    assert.equal(evidence.details.status, 'completed');
    assert.ok(evidence.details.evidence.some((entry) => entry.type === 'source_error'));
});
