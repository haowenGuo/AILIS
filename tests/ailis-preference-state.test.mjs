import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { AILISPreferenceState } = require('../electron/ailis-preference-state.cjs');

function event(overrides = {}) {
    return {
        slot: 'address.ailis_to_user',
        operation: 'set',
        value: '队长',
        scope: 'persistent',
        explicitness: 'explicit',
        confidence: 0.95,
        observedAt: '2026-07-01T09:00:00.000Z',
        sessionId: 'session-a',
        turnId: 'turn-a',
        evidence: {
            messageId: 'message-a',
            quote: '以后叫我队长'
        },
        ...overrides
    };
}

test('AILIS preference state resolves temporary overrides without destroying durable preferences', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-preference-state-'));
    const state = new AILISPreferenceState({ rootDir });

    state.append(event(), { userMessage: '以后叫我队长' });
    state.append(event({
        id: 'day-override',
        value: '老师',
        scope: 'day',
        observedAt: '2026-07-02T08:00:00.000Z',
        day: '2026-07-02',
        evidence: { messageId: 'message-b', quote: '今天叫我老师' }
    }), { userMessage: '今天叫我老师' });

    const sameDay = state.resolve({ sessionId: 'session-a', now: '2026-07-02T12:00:00.000Z' });
    assert.equal(sameDay.active['address.ailis_to_user'].value, '老师');
    assert.equal(sameDay.active['address.ailis_to_user'].scope, 'day');

    const nextDay = state.resolve({ sessionId: 'session-a', now: '2026-07-03T12:00:00.000Z' });
    assert.equal(nextDay.active['address.ailis_to_user'].value, '队长');

    state.append(event({
        id: 'session-clear',
        operation: 'clear',
        value: '',
        scope: 'session',
        sessionId: 'session-a',
        observedAt: '2026-07-03T13:00:00.000Z',
        evidence: { messageId: 'message-c', quote: '这次聊天先别叫称呼' }
    }), { userMessage: '这次聊天先别叫称呼' });

    assert.equal(state.resolve({ sessionId: 'session-a', now: '2026-07-03T14:00:00.000Z' }).active['address.ailis_to_user'], undefined);
    assert.equal(state.resolve({ sessionId: 'session-b', now: '2026-07-03T14:00:00.000Z' }).active['address.ailis_to_user'].value, '队长');
});

test('AILIS preference state promotes repeated implicit observations but not a single nickname', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-preference-observe-'));
    const state = new AILISPreferenceState({ rootDir });
    const observations = [
        ['s1', '2026-07-01T09:00:00.000Z'],
        ['s2', '2026-07-02T09:00:00.000Z'],
        ['s3', '2026-07-03T09:00:00.000Z'],
        ['s3', '2026-07-03T10:00:00.000Z']
    ];
    observations.forEach(([sessionId, observedAt], index) => {
        state.append(event({
            id: `observe-${index}`,
            slot: 'tone.response',
            operation: 'observe',
            value: '简洁自然',
            scope: 'session',
            explicitness: 'implicit',
            confidence: 0.65,
            sessionId,
            observedAt,
            evidence: { messageId: `observe-message-${index}`, quote: '简洁点' }
        }), { userMessage: '简洁点' });
    });

    const promoted = state.resolve({ sessionId: 'new-session', now: '2026-07-04T09:00:00.000Z' });
    assert.equal(promoted.active['tone.response'].value, '简洁自然');
    assert.equal(promoted.active['tone.response'].scope, 'implicit');

    state.append(event({
        id: 'avoid-implicit-tone',
        slot: 'tone.response',
        operation: 'avoid',
        value: '简洁自然',
        scope: 'persistent',
        observedAt: '2026-07-04T10:00:00.000Z',
        evidence: { messageId: 'avoid-message', quote: '不要再用这种简洁语气' }
    }), { userMessage: '不要再用这种简洁语气' });
    assert.equal(
        state.resolve({ sessionId: 'new-session', now: '2026-07-04T11:00:00.000Z' }).active['tone.response'],
        undefined
    );

    const invalid = state.append(event({
        id: 'bad-evidence',
        slot: 'style.format',
        value: '表格',
        evidence: { messageId: 'bad', quote: '不存在的原话' }
    }), { userMessage: '请直接回答' });
    assert.equal(invalid.ok, false);
});
