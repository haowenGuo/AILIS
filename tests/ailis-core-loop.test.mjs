import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    CONTINUE_AGENT_LOOP,
    runCoreAgentLoop
} = require('../electron/agent-loop/core-loop.cjs');

test('core loop repeats only when a round explicitly returns the continuation signal', async () => {
    const visitedIterations = [];

    const result = await runCoreAgentLoop({
        runIteration: async (iteration) => {
            visitedIterations.push(iteration);
            if (iteration < 2) {
                return CONTINUE_AGENT_LOOP;
            }
            return { status: 'completed', answer: 'done' };
        }
    });

    assert.deepEqual(visitedIterations, [0, 1, 2]);
    assert.deepEqual(result, { status: 'completed', answer: 'done' });
});

test('core loop can resume from a persisted iteration checkpoint', async () => {
    const visitedIterations = [];

    const result = await runCoreAgentLoop({
        startIteration: '7',
        runIteration: async (iteration) => {
            visitedIterations.push(iteration);
            return { status: 'needs_approval', iteration };
        }
    });

    assert.deepEqual(visitedIterations, [7]);
    assert.deepEqual(result, { status: 'needs_approval', iteration: 7 });
});

test('core loop rejects a missing round implementation instead of silently spinning', async () => {
    await assert.rejects(
        () => runCoreAgentLoop(),
        /requires a runIteration\(iteration\) function/
    );
});
