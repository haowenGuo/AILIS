import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    getDefaultState,
    normalizeEmberHarnessMode,
    normalizeState
} = require('../electron/store.cjs');

test('EMBER Harness desktop preference is disabled by default and persists valid modes', () => {
    assert.equal(getDefaultState().preferences.emberHarnessMode, 'off');
    assert.equal(normalizeEmberHarnessMode('observe'), 'observe');
    assert.equal(normalizeEmberHarnessMode('enforce'), 'enforce');
    assert.equal(normalizeEmberHarnessMode('unknown'), 'off');

    const normalized = normalizeState({
        preferences: {
            emberHarnessMode: 'observe'
        }
    });
    assert.equal(normalized.preferences.emberHarnessMode, 'observe');
});
