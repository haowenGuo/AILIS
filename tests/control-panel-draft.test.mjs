import test from 'node:test';
import assert from 'node:assert/strict';
import { createFormBaseline, hasFormChanges } from '../src/control-panel-draft.js';

test('form hydration is not an unsaved user edit', () => {
    const saved = { profiles: {}, language: 'zh-CN', onlyStored: true };
    const form = { profiles: { direct: { model: 'example' } }, language: 'zh-CN' };
    const baseline = createFormBaseline(form, saved);
    assert.equal(hasFormChanges(form, saved, baseline), false);
    assert.deepEqual(saved.profiles, {}, 'creating a baseline must not rewrite storage');
});

test('user changes and undo compare against the visible initial form', () => {
    const saved = { profile: {}, volume: 1 };
    const form = { profile: { model: 'example' }, volume: 1 };
    const baseline = createFormBaseline(form, saved);
    form.profile.model = 'other';
    assert.equal(hasFormChanges(form, saved, baseline), true);
    form.profile.model = 'example';
    assert.equal(hasFormChanges(form, saved, baseline), false);
    form.volume = 0;
    assert.equal(hasFormChanges(form, saved, baseline), true);
});

test('partial component saves clear only the persisted field, not unrelated edits', () => {
    const saved = { runtimeRoot: 'original', language: 'zh-CN' };
    const baseline = createFormBaseline(saved, saved);
    const form = { runtimeRoot: 'new-location', language: 'en' };
    const nextSaved = { ...saved, runtimeRoot: 'new-location' };
    assert.equal(hasFormChanges(form, nextSaved, baseline), true);
    form.language = 'zh-CN';
    assert.equal(hasFormChanges(form, nextSaved, baseline), false);
    form.runtimeRoot = 'original';
    assert.equal(hasFormChanges(form, nextSaved, baseline), true, 'reverting to the old disk value is a new edit');
});

test('baseline is isolated from in-place nested mutations', () => {
    const saved = { history: ['old'] };
    const form = { history: ['old'] };
    const baseline = createFormBaseline(form, saved);
    saved.history.push('new');
    assert.equal(hasFormChanges(form, saved, baseline), true);
    form.history.push('new');
    assert.equal(hasFormChanges(form, saved, baseline), false);
});

test('a successful reload establishes a new baseline', () => {
    const saved = { enabled: false };
    const old = createFormBaseline(saved, saved);
    const next = { enabled: true };
    assert.equal(hasFormChanges(next, saved, old), true);
    assert.equal(hasFormChanges(next, next, createFormBaseline(next, next)), false);
});

test('no draft is dirty before hydration completes', () => {
    assert.equal(hasFormChanges({}, {}, null), false);
});
