'use strict';

// Formal-release source gate. This deliberately checks the clean release branch,
// not the user's unrelated dirty F:/AILIS/main worktree.
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const pkg = require('../package.json');

const git = (...args) => execFileSync('git', args, {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8',
    windowsHide: true
}).trim();

assert.equal(git('status', '--porcelain'), '', 'Release source must be clean');
assert.equal(pkg.name, 'ailis');
assert.equal(pkg.version, '1.5.0');
assert.equal(Object.hasOwn(pkg, 'ailisHierarchicalMemoryTrial'), false);
assert.equal(git('rev-parse', 'HEAD'), git('rev-parse', 'release/v1.5.0-memory-trail'));
assert.match(fs.readFileSync(path.join(__dirname, '..', 'electron', 'main.cjs'), 'utf8'),
    /HIERARCHICAL_MEMORY_ENABLED\s*=\s*true/);

// MEMORY_TRAIL already includes this verified tool/output baseline. The
// release gate must compare against that snapshot, not the older 1.4.9 base.
const base = '65736698d9ccadb77adb9b6252db263bdc61fc52';
assert.equal(git('merge-base', base, 'HEAD'), base);

const critical = [
    'electron/ailis-context-manager.cjs',
    'electron/ailis-runtime-budget.cjs',
    'electron/ailis-tool-contracts.cjs',
    'electron/ailis-tool-runtime.cjs',
    'electron/ailis-computer-tool.cjs',
    'electron/ailis-agent-object-model.cjs'
];
for (const file of critical) {
    assert.equal(git('diff', base, 'HEAD', '--', file), '', `Critical baseline changed: ${file}`);
}

console.log(JSON.stringify({
    ok: true,
    version: pkg.version,
    sourceCommit: git('rev-parse', 'HEAD'),
    verifiedBaseline: base,
    identity: 'com.ailis.desktop',
    criticalFilesUnchanged: critical.length
}));
