import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    getOpenClawToolSurface,
    getOpenClawToolSurfaceSummary,
    validateOpenClawToolSurface
} = require('../electron/openclaw-tool-surface.cjs');

test('OpenClaw tool surface summary stays aligned', () => {
    const summary = getOpenClawToolSurfaceSummary();

    assert.equal(summary.coreToolCount, 33);
    assert.equal(summary.optionalRuntimeToolCount, 1);
    assert.equal(summary.channelMcpToolCount, 9);
    assert.deepEqual(summary.profileIds, ['minimal', 'coding', 'messaging', 'full']);
    assert.ok(summary.coreToolIds.includes('sessions_spawn'));
    assert.ok(summary.coreToolIds.includes('nodes'));
    assert.ok(summary.optionalRuntimeToolIds.includes('pdf'));
});

test('OpenClaw tool surface validation passes', () => {
    const result = validateOpenClawToolSurface();
    assert.equal(
        result.ok,
        true,
        `tool surface validation failed:\n${result.issues.join('\n') || '(no issues listed)'}`
    );
});

test('OpenClaw tool surface snapshot exposes sections, profiles, and groups', () => {
    const surface = getOpenClawToolSurface();

    assert.ok(Array.isArray(surface.sections));
    assert.ok(Array.isArray(surface.coreTools));
    assert.ok(Array.isArray(surface.channelMcpTools));
    assert.ok(surface.groups['group:openclaw'].includes('web_search'));
    assert.ok(surface.groups['group:sessions'].includes('sessions_history'));
    assert.ok(surface.profiles.coding.allow.includes('bundle-mcp'));
});
