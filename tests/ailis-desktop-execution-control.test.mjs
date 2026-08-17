import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

import {
    compactAccessibilityTree,
    createObservationStateTracker
} from '../scripts/osworld/osworld-observation-state.mjs';
import {
    OSWorldComputerBridgeTool
} from '../scripts/osworld/osworld-computer-bridge.mjs';

const require = createRequire(import.meta.url);
const {
    buildExecutionStateLane,
    detectDesktopActionCycle,
    validateDesktopExecutionLoop
} = require('../electron/agent-loop/execution-control.cjs');
const {
    buildAgentTaskState,
    validateAgentToolLoopGuard
} = require('../electron/ailis-agent-runner.cjs');

function desktopStep({ action = 'mouse_click', x = 10, hash = 'screen-a', streak = 0, applications = ['app-a'] } = {}) {
    return {
        tool: 'computer',
        args: { action, x, y: 20 },
        response: {
            ok: true,
            status: 'completed',
            result: {
                details: {
                    executionState: {
                        schema: 'ailis.desktop_execution_state.v1',
                        phase: applications.length > 1 ? 'multi_app_active' : 'single_app_active',
                        activeApplications: applications,
                        visitedApplications: applications,
                        transitionCount: 0,
                        recentTransitions: [],
                        accessibilityChanged: streak === 0,
                        screenChanged: streak === 0,
                        noProgressStreak: streak,
                        observationHash: hash
                    }
                }
            }
        }
    };
}

test('desktop loop fuse blocks a third identical action only when observations also repeat', () => {
    const repeated = [
        desktopStep({ hash: 'same', streak: 1 }),
        desktopStep({ hash: 'same', streak: 2 })
    ];
    const candidate = { tool: 'computer', args: { action: 'mouse_click', x: 10, y: 20 } };
    const cycle = detectDesktopActionCycle(candidate, repeated);
    assert.equal(cycle.period, 1);
    assert.equal(validateDesktopExecutionLoop(candidate, repeated).ok, false);
    assert.equal(validateAgentToolLoopGuard(candidate, repeated).details.cycleLength, 1);

    const changed = [
        desktopStep({ hash: 'first', streak: 0 }),
        desktopStep({ hash: 'second', streak: 0 })
    ];
    assert.equal(validateDesktopExecutionLoop(candidate, changed).ok, true);
});

test('desktop loop fuse ignores descriptive labels but preserves mechanical action differences', () => {
    const history = [
        desktopStep({ hash: 'same', streak: 1 }),
        desktopStep({ hash: 'same', streak: 2 })
    ];
    history[0].args.intent = 'Try the visible control.';
    history[1].args.intent = 'Try that control again.';
    const relabeledCandidate = {
        tool: 'computer',
        args: { action: 'mouse_click', x: 10, y: 20, intent: 'One more attempt.' }
    };
    assert.equal(validateDesktopExecutionLoop(relabeledCandidate, history).ok, false);
    const movedCandidate = {
        tool: 'computer',
        args: { action: 'mouse_click', x: 11, y: 20, intent: 'Try a nearby control.' }
    };
    assert.equal(validateDesktopExecutionLoop(movedCandidate, history).ok, true);
});

test('desktop loop fuse detects a two-action cycle without inventing task semantics', () => {
    const history = [
        desktopStep({ action: 'mouse_click', x: 10, hash: 'state-a' }),
        desktopStep({ action: 'mouse_click', x: 20, hash: 'state-b' }),
        desktopStep({ action: 'mouse_click', x: 10, hash: 'state-a' }),
        desktopStep({ action: 'mouse_click', x: 20, hash: 'state-b' }),
        desktopStep({ action: 'mouse_click', x: 10, hash: 'state-a' })
    ];
    const candidate = { tool: 'computer', args: { action: 'mouse_click', x: 20, y: 20 } };
    const guard = validateDesktopExecutionLoop(candidate, history);
    assert.equal(guard.ok, false);
    assert.equal(guard.details.cycleLength, 2);
    assert.equal(guard.details.reason, 'repeated_desktop_action_cycle_without_observation_progress');
});

test('desktop execution lane exposes application state to the model as mechanical evidence', () => {
    const transitions = [{ step: 2, from: ['app-a'], to: ['app-b'] }];
    const latest = desktopStep({ hash: 'screen-b', applications: ['app-b'] });
    latest.response.result.details.executionState.visitedApplications = ['app-a', 'app-b'];
    latest.response.result.details.executionState.transitionCount = 1;
    latest.response.result.details.executionState.recentTransitions = transitions;
    latest.response.result.details.executionState.phase = 'application_transition';
    const lane = buildExecutionStateLane([desktopStep(), latest]);
    assert.equal(lane.phase, 'application_transition');
    assert.deepEqual(lane.activeApplications, ['app-b']);
    assert.deepEqual(lane.visitedApplications, ['app-a', 'app-b']);
    assert.deepEqual(lane.recentTransitions, transitions);
    const taskState = buildAgentTaskState({ stepResults: [desktopStep(), latest] });
    assert.equal(taskState.execution.schema, 'ailis.desktop_execution_lane.v1');
});

test('OSWorld observation tracker emits full initial state, compact deltas, and application transitions', () => {
    const tracker = createObservationStateTracker({ maxPromptChars: 4000 });
    const terminalTree = '<desktop-frame><application name="terminal"><frame st:showing="true"><button name="Run"/></frame></application></desktop-frame>';
    const browserTree = '<desktop-frame><application name="browser"><frame st:showing="true"><button name="Open"/></frame></application></desktop-frame>';
    const first = tracker.observe({ accessibilityTree: terminalTree, screenshotBuffer: Buffer.from('one'), step: 1 });
    const second = tracker.observe({ accessibilityTree: terminalTree, screenshotBuffer: Buffer.from('one'), step: 2 });
    const third = tracker.observe({ accessibilityTree: browserTree, screenshotBuffer: Buffer.from('two'), step: 3 });
    assert.equal(first.accessibility.mode, 'full_structural_initial');
    assert.deepEqual(first.executionState.activeApplications, ['terminal']);
    assert.ok(first.accessibility.promptChars <= first.accessibility.originalChars);
    assert.equal(second.accessibility.mode, 'unchanged');
    assert.equal(second.executionState.noProgressStreak, 1);
    assert.ok(second.accessibility.promptChars < first.accessibility.promptChars);
    assert.equal(third.executionState.phase, 'application_transition');
    assert.deepEqual(third.executionState.visitedApplications, ['terminal', 'browser']);
    assert.equal(third.executionState.transitionCount, 1);

    const screenshotTracker = createObservationStateTracker();
    screenshotTracker.observe({ accessibilityTree: terminalTree, screenshotBuffer: Buffer.from('one'), step: 1 });
    const visualProgress = screenshotTracker.observe({
        accessibilityTree: terminalTree,
        screenshotBuffer: Buffer.from('different-screen'),
        step: 2
    });
    assert.equal(visualProgress.executionState.accessibilityChanged, false);
    assert.equal(visualProgress.executionState.screenChanged, true);
    assert.equal(visualProgress.executionState.noProgressStreak, 0);
});

test('a11y structural delta preserves duplicate-count and ordering changes', () => {
    const previousTree = '<root><button name="Same"/><button name="Same"/><label name="Tail"/></root>';
    const currentTree = '<root><button name="Same"/><label name="Tail"/></root>';
    const compacted = compactAccessibilityTree(currentTree, previousTree);
    assert.notEqual(compacted.mode, 'unchanged');
    assert.equal(compacted.removedTokens, 1);

    const reordered = compactAccessibilityTree(
        '<root><button name="B"/><button name="A"/></root>',
        '<root><button name="A"/><button name="B"/></root>'
    );
    assert.notEqual(reordered.mode, 'unchanged');
    assert.equal(reordered.orderChanged, true);
});

test('OSWorld bridge preserves full a11y audit artifacts while returning compact observations', async () => {
    const artifactDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-osworld-observation-'));
    const bridge = new OSWorldComputerBridgeTool({
        bridgeUrl: 'http://127.0.0.1:1',
        artifactDir
    });
    const tree = '<desktop-frame><application name="editor"><frame st:visible="true"><button name="Save"/></frame></application></desktop-frame>';
    try {
        const first = await bridge.materializeObservation({
            screenshot_base64: Buffer.from('png-one').toString('base64'),
            accessibility_tree: tree,
            status: 'completed',
            step: 1
        }, 'mouse_click');
        const second = await bridge.materializeObservation({
            screenshot_base64: Buffer.from('png-one').toString('base64'),
            accessibility_tree: tree,
            status: 'completed',
            step: 2
        }, 'mouse_click');
        assert.equal(first.details.executionState.activeApplications[0], 'editor');
        assert.equal(second.details.observationCompression.mode, 'unchanged');
        assert.equal(await fs.readFile(first.details.accessibilityTreePath, 'utf8'), tree);
        assert.match(second.content[0].text, /Desktop execution state/);
        assert.doesNotMatch(second.content[0].text, /<button name="Save"\/>/);
    } finally {
        await fs.rm(artifactDir, { recursive: true, force: true });
    }
});
