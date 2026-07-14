import assert from 'node:assert/strict';
import test from 'node:test';

import { parseAgentBenchStageArgs } from '../evals/agentbench_official/stage-options.mjs';

const tasks = ['dbbench-dev', 'dbbench-std'];

test('stage options require exactly one task', () => {
    assert.throws(() => parseAgentBenchStageArgs([], tasks), /requires exactly one --task/);
    assert.throws(
        () => parseAgentBenchStageArgs([
            '--task', 'dbbench-dev', '--task', 'dbbench-std'
        ], tasks),
        /requires exactly one --task/
    );
    assert.throws(() => parseAgentBenchStageArgs(['--wat'], tasks), /Unknown AgentBench option/);
});

test('smoke and pilot enforce small fixed limits', () => {
    assert.equal(
        parseAgentBenchStageArgs(['--stage', 'smoke', '--task', 'dbbench-dev'], tasks).limit,
        3
    );
    assert.equal(
        parseAgentBenchStageArgs(['--stage', 'pilot', '--task', 'dbbench-dev'], tasks).limit,
        10
    );
});

test('large stages require approval and matching split', () => {
    assert.throws(
        () => parseAgentBenchStageArgs(['--stage', 'dev', '--task', 'dbbench-dev'], tasks),
        /requires --approve-large-stage/
    );
    assert.throws(
        () => parseAgentBenchStageArgs([
            '--stage', 'test', '--task', 'dbbench-dev', '--approve-large-stage'
        ], tasks),
        /requires a -std task/
    );
    assert.equal(parseAgentBenchStageArgs([
        '--stage', 'test', '--task', 'dbbench-std', '--approve-large-stage'
    ], tasks).limit, 0);
});
