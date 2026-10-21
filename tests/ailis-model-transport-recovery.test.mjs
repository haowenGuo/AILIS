import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { retryModelTransport, isRetryableModelTransportFailure } =
    require('../electron/agent-loop/runner.cjs');

test('model recovery retries two failures and reports success', async () => {
    const events = [];
    const responses = [
        { ok: false, code: 'transient_network_error' },
        { ok: false, status: 502, code: 'provider_error' },
        { ok: true, content: 'done' }
    ];
    const result = await retryModelTransport(() => Promise.resolve(responses.shift()), {
        maxRetries: 2, onEvent: event => events.push(event), wait: async () => {}
    });
    assert.deepEqual(result, { ok: true, content: 'done' });
    assert.deepEqual(events.filter(event => event.event === 'retry_scheduled').map(event => event.attempt), [1, 2]);
    assert.equal(events[0].event, 'recovery_started');
    assert.equal(events.at(-1).event, 'recovery_succeeded');
});

test('authentication, schema, quota and aborted failures are not retried', async () => {
    for (const status of [400, 401, 403, 422, 429]) {
        const response = { ok: false, status, code: 'codex_network_error' };
        let calls = 0;
        assert.equal(isRetryableModelTransportFailure(response), false);
        const result = await retryModelTransport(async () => { calls++; return response; }, {
            recoveryDeadlineMs: Date.now() + 9000000
        });
        assert.equal(result, response);
        assert.equal(calls, 1);
    }
    assert.equal(isRetryableModelTransportFailure({ ok: false, status: 502, aborted: true }), false);
    assert.equal(isRetryableModelTransportFailure({ ok: false, code: 'provider_stream_error' }), true);
});

test('episode recovery outlives three minutes without a retry cap or request mutation', async () => {
    let clock = 1000, calls = 0;
    const deadline = clock + 9000000;
    const events = [], delays = [], seen = [];
    const request = Object.freeze({ input: Object.freeze([
        { type: 'message', role: 'user', content: 'Continue the task' },
        { type: 'function_call', call_id: 'done-1', name: 'exec_command', arguments: '{"cmd":"fixture"}' },
        { type: 'function_call_output', call_id: 'done-1', output: 'existing artifact' }
    ]) });
    const before = JSON.stringify(request);
    const result = await retryModelTransport(async remainingMs => {
        assert.equal(remainingMs, deadline - clock);
        seen.push(request);
        return ++calls <= 20 ? { ok: false, code: 'codex_network_error' } : { ok: true, content: 'resumed' };
    }, { recoveryDeadlineMs: deadline, recoveryBudgetMs: 180000, maxRetries: 2,
        now: () => clock, wait: async ms => { delays.push(ms); clock += ms; },
        onEvent: event => events.push(event) });
    assert.equal(result.ok, true);
    assert.equal(calls, 21);
    assert.ok(clock - 1000 > 180000);
    assert.ok(delays.every(ms => ms <= 30000));
    assert.ok(seen.every(value => value === request));
    assert.equal(JSON.stringify(request), before);
    assert.equal(events.at(-1).event, 'recovery_succeeded');
});

test('reconnects never reset or extend the original episode deadline', async () => {
    let clock = 1000, calls = 0;
    const deadline = 31000, events = [];
    const result = await retryModelTransport(async remainingMs => {
        calls++;
        assert.ok(remainingMs > 5000 && remainingMs <= 30000);
        clock += 1000;
        return { ok: false, code: 'codex_network_error' };
    }, { recoveryDeadlineMs: deadline, now: () => clock,
        wait: async ms => { clock += ms; }, onEvent: event => events.push(event) });
    assert.ok(calls > 2);
    assert.equal(result.recoveryExhausted, true);
    assert.equal(result.recoveryDeadlineMs, deadline);
    assert.ok(clock <= deadline);
    assert.equal(events.at(-1).event, 'recovery_exhausted');
    let expiredCalls = 0;
    const expired = await retryModelTransport(() => { expiredCalls++; }, {
        recoveryDeadlineMs: deadline, now: () => deadline + 1
    });
    assert.equal(expiredCalls, 0);
    assert.equal(expired.recoveryExhausted, true);
});

test('backoff is cancellable without issuing another request', async () => {
    const controller = new AbortController();
    let calls = 0;
    const result = await retryModelTransport(async () => {
        calls++;
        return { ok: false, code: 'codex_network_error' };
    }, { recoveryDeadlineMs: Date.now() + 9000000, signal: controller.signal,
        onEvent: event => { if (event.event === 'retry_scheduled') setTimeout(() => controller.abort(), 10); } });
    assert.equal(calls, 1);
    assert.equal(result.code, 'aborted');
});

test('thrown socket failures recover but programming errors do not loop', async () => {
    let calls = 0;
    const result = await retryModelTransport(async () => {
        if (++calls === 1) throw Object.assign(new Error('fixture connection refused'), { code: 'ECONNREFUSED' });
        return { ok: true };
    }, { recoveryDeadlineMs: Date.now() + 9000000, wait: async () => {} });
    assert.equal(result.ok, true);
    assert.equal(calls, 2);
    await assert.rejects(retryModelTransport(async () => { throw new TypeError('programming error'); }, {
        recoveryDeadlineMs: Date.now() + 9000000
    }), /programming error/);
});

test('explicit recovery budget has no fixed retry-count cap', async () => {
    let calls = 0;
    const result = await retryModelTransport(async () => ++calls < 4
        ? { ok: false, code: 'transient_network_error' }
        : { ok: true, content: 'recovered' }, { recoveryBudgetMs: 10000, wait: async () => {} });
    assert.deepEqual(result, { ok: true, content: 'recovered' });
    assert.equal(calls, 4);
});
