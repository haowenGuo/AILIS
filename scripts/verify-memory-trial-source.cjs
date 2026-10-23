'use strict';
// Read-only source audit; the report is build evidence, not application state.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', windowsHide: true }).trim();
const config = require('../electron-builder.memory-trial.cjs');
const base = git('rev-parse', config.extraMetadata.ailisMemoryBaselineCommit);
const sourceCommit = git('rev-parse', 'HEAD');
assert.equal(git('status', '--porcelain'), '', 'Commit the exact source before acceptance');
assert.equal(git('merge-base', config.extraMetadata.ailisMemoryBaseCommit, sourceCommit), config.extraMetadata.ailisMemoryBaseCommit);
const permittedChanges = new Set([
    '.gitignore', 'docs/hierarchical-user-memory-trial.md', 'electron-builder.memory-trial.cjs',
    'electron/agent-loop/runner.cjs', 'electron/ailis-gateway.cjs',
    'electron/ailis-hierarchical-user-memory.cjs', 'electron/ailis-memory-store.cjs',
    'electron/desktop-llm-provider.cjs', 'electron/main.cjs', 'package.json',
    'scripts/verify-memory-trial-package.cjs', 'scripts/verify-memory-trial-source.cjs',
    'src/control-panel-app.js', 'tests/ailis-hierarchical-user-memory.test.mjs',
    'tests/ailis-memory-completion-status.test.mjs', 'tests/ailis-unified-compaction.test.mjs'
]);
const changed = git('diff', '--name-only', base, sourceCommit).split('\n').filter(Boolean);
for (const file of changed) assert.ok(permittedChanges.has(file), `Unrelated change from latest baseline: ${file}`);
const previousPackage = JSON.parse(git('show', `${base}:package.json`));
const currentPackage = require('../package.json');
const withoutTrialIdentity = ({ version, ailisHierarchicalMemoryTrial, ...rest }) => rest;
assert.deepEqual(withoutTrialIdentity(currentPackage), withoutTrialIdentity(previousPackage), 'Dependencies/scripts must remain those of the latest baseline');
assert.equal(currentPackage.version, '1.4.9-memory.1');
const critical = [
    'electron/ailis-context-manager.cjs', 'electron/ailis-runtime-budget.cjs',
    'electron/ailis-code-mode-worker.cjs', 'electron/ailis-image-content.cjs',
    'electron/ailis-tool-contracts.cjs', 'electron/ailis-tool-runtime.cjs',
    'electron/ailis-computer-tool.cjs', 'electron/ailis-agent-object-model.cjs',
    'tests/ailis-tool-head-tail.test.mjs', 'tests/ailis-tool-output-order.test.mjs',
    'tests/ailis-tool-raw-state.test.mjs'
].map(file => {
    assert.equal(git('diff', base, sourceCommit, '--', file), '', `Latest implementation changed: ${file}`);
    const text = fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
    return { file, normalizedTextSha256: crypto.createHash('sha256').update(text).digest('hex') };
});
const report = { ok: true, version: currentPackage.version, sourceCommit,
    officialBase: config.extraMetadata.ailisMemoryBaseCommit, frozenLatestBaseline: base,
    changedFromLatestBaseline: changed, unchangedCriticalFiles: critical,
    scope: 'Latest remote main plus locally verified Oct23 tool feedback; only hierarchical-memory and isolated-trial delta' };
if (process.argv[2]) {
    const destination = path.resolve(process.argv[2]);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify({ ok: true, sourceCommit, base, changedFiles: changed.length, criticalUnchanged: critical.length }));
