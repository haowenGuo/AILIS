import assert from 'node:assert/strict';
import test from 'node:test';

import { parseAgentBenchFcStageArgs } from '../evals/agentbench_fc/stage-options.mjs';
import { evaluateAgentBenchFcStageGate } from '../evals/agentbench_fc/stage-policy.mjs';
import {
    buildPlainDockerWorkerRunArgs,
    buildWslKeepaliveArgs,
    parseWslRouteSourceAddress,
    parseWslDistributionList
} from '../scripts/run-agentbench-fc-controller.mjs';

const tasks = ['dbbench-std', 'os-std', 'kg-std', 'alfworld-std', 'webshop-std'];

function validSummary(overrides = {}) {
    return {
        schema: 'ailis.agentbench.fc.environment.v1',
        selected: 3,
        error_records: 0,
        valid: true,
        protocol: { style: 'openai_function_calling' },
        quality: { completion_rate: 1, infrastructure_errors: 0 },
        usage: { calls: 6, total_tokens: 20_000 },
        duration_ms: 30_000,
        official_score: { average_reward: 0 },
        ...overrides
    };
}

test('FC stages require one of the five official tasks', () => {
    assert.throws(() => parseAgentBenchFcStageArgs([], tasks), /exactly one --task/);
    assert.throws(() => parseAgentBenchFcStageArgs(['--task', 'ltp-std'], tasks), /Unknown AgentBench FC task/);
    assert.equal(
        parseAgentBenchFcStageArgs(['--stage', 'smoke', '--task', 'dbbench-std'], tasks).limit,
        3
    );
    assert.equal(
        parseAgentBenchFcStageArgs(['--stage', 'pilot', '--task', 'dbbench-std'], tasks).limit,
        10
    );
});

test('FC full stage requires explicit approval', () => {
    assert.throws(
        () => parseAgentBenchFcStageArgs(['--stage', 'full', '--task', 'dbbench-std'], tasks),
        /requires --approve-large-stage/
    );
    assert.equal(parseAgentBenchFcStageArgs([
        '--stage', 'full', '--task', 'dbbench-std', '--approve-large-stage'
    ], tasks).limit, 0);
});

test('FC gate accepts a valid measured zero score', () => {
    assert.deepEqual(evaluateAgentBenchFcStageGate(validSummary(), 'smoke'), { passed: true, reasons: [] });
});

test('FC gate rejects old schemas and infrastructure failures', () => {
    const result = evaluateAgentBenchFcStageGate(validSummary({
        schema: 'ailis.agentbench.official.v0.2',
        valid: false,
        error_records: 1
    }), 'smoke');
    assert.equal(result.passed, false);
    assert.ok(result.reasons.includes('wrong_summary_schema'));
    assert.ok(result.reasons.includes('summary_not_valid'));
    assert.ok(result.reasons.includes('infrastructure_errors_present'));
});

test('FC controller discovers the installed WSL distribution from UTF-16-like output', () => {
    assert.deepEqual(
        parseWslDistributionList(`${[...'Ubuntu-22.04'].join('\0')}\0\r\0\n\0`),
        ['Ubuntu-22.04']
    );
});

test('FC controller keeps the selected WSL distribution alive for the full run', () => {
    assert.deepEqual(buildWslKeepaliveArgs('Ubuntu-22.04'), [
        '-d', 'Ubuntu-22.04', '--', 'sleep', 'infinity'
    ]);
});

test('FC controller resolves the Windows-reachable address from the WSL default route', () => {
    assert.equal(
        parseWslRouteSourceAddress('1.1.1.1 via 172.28.112.1 dev eth0 src 172.28.123.114 uid 0\n'),
        '172.28.123.114'
    );
    assert.equal(parseWslRouteSourceAddress('unreachable 1.1.1.1'), '');
});

test('plain Docker fallback preserves the official DB worker contract', () => {
    const args = buildPlainDockerWorkerRunArgs('dbbench-std', 'worker:test');
    assert.deepEqual(args.slice(0, 7), [
        'docker', 'run', '-d', '--name', 'ailis-agentbench-fc-dbbench-std', '--network', 'agentbench-fc_default'
    ]);
    assert.ok(args.includes('/var/run/docker.sock:/var/run/docker.sock'));
    assert.ok(args.includes('DBBENCH_STD_PARAMETERS_ENV_OPTIONS_NETWORK_NAME=agentbench-fc_default'));
    assert.deepEqual(args.slice(-3), [
        '--controller', 'http://172.17.0.1:5020/api', 'dbbench-std'
    ]);
});
