import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

import {
    SUPPORTED_ACTIONS,
    translateComputerAction
} from '../scripts/osworld/osworld-computer-bridge.mjs';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const PROJECT_ROOT = path.resolve('.');

test('OSWorld bridge maps only generic computer actions to computer_13', () => {
    assert.deepEqual(
        translateComputerAction({ action: 'mouse_click', x: 120, y: 240 }).actions,
        [{ action_type: 'CLICK', parameters: { button: 'left', x: 120, y: 240 } }]
    );
    assert.deepEqual(
        translateComputerAction({ action: 'mouse_drag', x: 10, y: 20, endX: 40, endY: 60 }).actions,
        [
            { action_type: 'MOVE_TO', parameters: { x: 10, y: 20 } },
            { action_type: 'DRAG_TO', parameters: { x: 40, y: 60 } }
        ]
    );
    assert.deepEqual(
        translateComputerAction({ action: 'keyboard_hotkey', keys: 'ctrl+shift+s' }).actions,
        [{ action_type: 'HOTKEY', parameters: { keys: ['ctrl', 'shift', 's'] } }]
    );
    assert.deepEqual(
        translateComputerAction({ action: 'keyboard_press', key: 'ALT+C' }).actions,
        [{ action_type: 'HOTKEY', parameters: { keys: ['alt', 'c'] } }]
    );
    assert.deepEqual(
        translateComputerAction({ action: 'keyboard_hotkey', keys: ['META', 'D'] }).actions,
        [{ action_type: 'HOTKEY', parameters: { keys: ['win', 'd'] } }]
    );
    assert.equal(translateComputerAction({ action: 'screen_screenshot' }).observeOnly, true);
    assert.throws(
        () => translateComputerAction({ action: 'exec_command', command: 'whoami' }),
        /does not support action/
    );
    assert.equal(SUPPORTED_ACTIONS.includes('exec_command'), false);
});

test('Gateway can inject the OSWorld computer transport and isolate its tool registry', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-osworld-gateway-'));
    const calls = [];
    const computerTool = {
        async execute(args) {
            calls.push(args);
            return {
                content: [{ type: 'text', text: 'isolated OSWorld observation' }],
                details: { status: 'completed', action: args.action },
                structuredContent: { status: 'completed', action: args.action }
            };
        },
        async shutdown() {}
    };
    const gateway = new AILISGateway({
        port: 0,
        projectRoot: PROJECT_ROOT,
        workspaceRoot,
        auditDir: path.join(workspaceRoot, '.audit'),
        computerTool,
        directLocalToolIds: ['computer'],
        toolAllowlist: ['computer', 'tool_search', 'update_plan'],
        disableBuiltinAilisResearchMcp: true,
        emberHarnessEnabled: false,
        profileCurationEnabled: false,
        mcpServers: {}
    });

    const ids = gateway.gatewayToolRuntimeRegistry.toolIds().sort();
    assert.deepEqual(ids, ['computer', 'tool_search', 'update_plan']);
    const directNames = gateway.gatewayToolRuntimeRegistry.modelVisibleSpecs()
        .map((spec) => spec.name || spec.function?.name)
        .sort();
    assert.deepEqual(directNames, ['computer', 'tool_search', 'update_plan']);

    const result = await gateway.callTool({
        tool: 'computer',
        args: { action: 'screen_screenshot' },
        context: { approvalPolicy: 'never', approved: true }
    });
    assert.equal(result.ok, true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].action, 'screen_screenshot');
    await gateway.stop();
});

test('Clean OSWorld entrypoint does not import the legacy specialized agent', async () => {
    const [pythonRunner, nodeRunner, shellRunner, gateRunner, packageJson] = await Promise.all([
        fs.readFile(path.join(PROJECT_ROOT, 'scripts', 'osworld', 'run_clean_ailis_osworld.py'), 'utf8'),
        fs.readFile(path.join(PROJECT_ROOT, 'scripts', 'run-osworld-task-agent.mjs'), 'utf8'),
        fs.readFile(path.join(PROJECT_ROOT, 'scripts', 'run-osworld-ailis-wsl.sh'), 'utf8'),
        fs.readFile(path.join(PROJECT_ROOT, 'scripts', 'run-osworld-ailis-development-gate-wsl.sh'), 'utf8'),
        fs.readFile(path.join(PROJECT_ROOT, 'package.json'), 'utf8')
    ]);
    const cleanSources = `${pythonRunner}\n${nodeRunner}\n${shellRunner}`;
    assert.doesNotMatch(cleanSources, /from ailis_osworld_agent import|OS_SKILL_CATALOG/);
    assert.match(pythonRunner, /task_agent_infrastructure_failure/);
    assert.match(pythonRunner, /raise OSWorldExecutionInfrastructureError/);
    assert.match(shellRunner, /run_clean_ailis_osworld\.py/);
    assert.match(gateRunner, /prefetch-osworld-assets\.ps1/);
    assert.match(gateRunner, /run_clean_ailis_osworld\.py/);
    assert.match(packageJson, /bench:osworld:ailis:verified:smoke:wsl/);
});

test('Pinned OSWorld suite counts match the downloaded official source', async () => {
    const lock = JSON.parse(await fs.readFile(
        path.join(PROJECT_ROOT, 'evals', 'engineering', 'osworld-source-lock.json'),
        'utf8'
    ));
    for (const [fileName, expected] of Object.entries(lock.suites)) {
        const meta = JSON.parse(await fs.readFile(
            path.join(PROJECT_ROOT, 'build-cache', 'OSWorld', 'evaluation_examples', fileName),
            'utf8'
        ));
        const actual = Object.values(meta).reduce(
            (total, ids) => total + (Array.isArray(ids) ? ids.length : 0),
            0
        );
        assert.equal(actual, expected, fileName);
    }
});

test('OSWorld development gate freezes one mechanically selected task per domain', async () => {
    const [gate, small, verifiedCompatible] = await Promise.all([
        fs.readFile(path.join(PROJECT_ROOT, 'evals', 'engineering', 'osworld-development-gate.json'), 'utf8').then(JSON.parse),
        fs.readFile(path.join(PROJECT_ROOT, 'build-cache', 'OSWorld', 'evaluation_examples', 'test_small.json'), 'utf8').then(JSON.parse),
        fs.readFile(path.join(PROJECT_ROOT, 'build-cache', 'OSWorld', 'evaluation_examples', 'test_nogdrive.json'), 'utf8').then(JSON.parse)
    ]);
    assert.deepEqual(Object.keys(gate), Object.keys(small));
    for (const [domain, ids] of Object.entries(gate)) {
        assert.equal(ids.length, 1, domain);
        const mechanicallySelectedId = [...small[domain]].sort()[0];
        assert.equal(ids[0], mechanicallySelectedId, domain);
        assert.equal(verifiedCompatible[domain].includes(ids[0]), true, domain);
    }
});

test('Tracked clean smoke evidence stays within its one-task claim boundary', async () => {
    const [lock, smoke, small, verifiedCompatible] = await Promise.all([
        fs.readFile(path.join(PROJECT_ROOT, 'evals', 'engineering', 'osworld-source-lock.json'), 'utf8').then(JSON.parse),
        fs.readFile(path.join(PROJECT_ROOT, 'evals', 'engineering', 'osworld-clean-task-agent-smoke.json'), 'utf8').then(JSON.parse),
        fs.readFile(path.join(PROJECT_ROOT, 'build-cache', 'OSWorld', 'evaluation_examples', 'test_small.json'), 'utf8').then(JSON.parse),
        fs.readFile(path.join(PROJECT_ROOT, 'build-cache', 'OSWorld', 'evaluation_examples', 'test_nogdrive.json'), 'utf8').then(JSON.parse)
    ]);
    assert.equal(smoke.sourceCommit, lock.commit);
    assert.equal(smoke.result.officialEvaluatorScore, 1);
    assert.equal(smoke.result.guiActionCount, 8);
    assert.equal(smoke.claimBoundary.includes('not a full OSWorld score'), true);
    assert.equal(small[smoke.task.domain].includes(smoke.task.exampleId), true);
    assert.equal(verifiedCompatible[smoke.task.domain].includes(smoke.task.exampleId), true);
});
