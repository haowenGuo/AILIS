import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { ROOT, audit, assertValid, desktopFiles, assertDesktopBuild, extract, readManifest } = require('../scripts/production-closure.cjs');
const report = audit();

test('desktop closure has explicit evidence for subprocesses and runtime resources', () => {
    assertValid(report);
    for (const file of ['electron/main.cjs', 'electron/preload.cjs', 'electron/ailis-code-mode-worker.cjs',
        'scripts/mcp-ailis-research-server.cjs', 'scripts/ailis-stockfish-engine.cjs',
        'scripts/ailis-crawl4ai-worker.py', 'scripts/ailis-python-search-worker.py', 'scripts/ailis-ragflow-lite-worker.py',
        'vendor/ragflow-lite/upstream/rag__app__table.py', 'electron/cosyvoice3_tts_worker.py',
        'electron/desktop_asr_worker.py', 'electron/safety/ember-sensitive-lexicon.json',
        'electron/skills/code/SKILL.md', 'electron/prompts/codex-gpt-5.6.instructions.md']) {
        const row = report.inventory.find(row => row.file === file);
        assert.equal(row?.category, 'product-closure', file);
        assert.match(row.sha256, /^[a-f0-9]{64}$/);
        assert.ok(row.reason);
    }
    assert.ok(report.dynamicLoads.length > 0);
    assert.ok(report.dynamicLoads.every(row => row.reviewed && row.reason));
});

test('each retained file has an acyclic explanation ending at a product entry', () => {
    const rows = new Map(report.inventory.filter(row => row.category === 'product-closure').map(row => [row.file, row]));
    for (const file of rows.keys()) {
        const seen = new Set();
        let current = rows.get(file);
        while (current.via) {
            assert.ok(!seen.has(current.file)); seen.add(current.file);
            current = rows.get(current.via);
            assert.ok(current, file);
        }
        assert.ok(report.roots.includes(current.file));
    }
});

test('desktop excludes hosted, CLI evaluation, test and legacy demo; other profiles retain their own entry', () => {
    const shipped = desktopFiles();
    for (const file of ['electron/ailis-hosted-runtime.cjs', 'electron/ailis-humanlike-eval.cjs',
        'electron/kokoro_tts_worker.py', 'src/browser-speech-recognition.js', 'Test/app.js', 'index.html'])
        assert.ok(!shipped.includes(file), file);
    assert.ok(!shipped.some(file => /^(tests|Test|evals|docs)\//.test(file)));
    const hosted = assertValid(audit({ profile: 'hosted' }));
    assert.ok(hosted.files.includes('electron/ailis-hosted-runtime.cjs'));
    const demo = assertValid(audit({ profile: 'demo' }));
    assert.ok(demo.files.includes('src/browser-speech-recognition.js'));
    assert.ok(report.files.includes('agent-lab.html'), 'Agent Lab is an existing product feature');
});

test('missing runtime worker and changed dynamic import both fail closed', () => {
    const files = report.inventory.map(row => row.file).filter(file => file !== 'electron/ailis-code-mode-worker.cjs');
    assert.throws(() => assertValid(audit({ files })), /missing declared\/local file/);
    const manifest = readManifest(); manifest.externalLoads = [];
    assert.throws(() => assertValid(audit({ manifest })), /unreviewed dynamic module load/);
});

test('Python importlib target list cannot silently outgrow the manifest', () => {
    const text = fs.readFileSync(path.join(ROOT, 'scripts/ailis-ragflow-lite-worker.py'), 'utf8');
    for (const match of text.matchAll(/load_module\("[^"]+", "([^"]+)"\)/g))
        assert.ok(report.files.includes(`vendor/ragflow-lite/upstream/${match[1]}`), match[1]);
});

test('both package variants consume the same generated allowlist', () => {
    const config = require('../electron-builder.runtime.cjs');
    for (const name of ['electron-builder.yml', 'electron-builder.voice.yml']) {
        const text = fs.readFileSync(path.join(ROOT, name), 'utf8');
        assert.match(text, /extends: \.\/electron-builder\.runtime\.cjs/);
        assert.doesNotMatch(text, /^files:/m);
        assert.match(text, /vendor\/ragflow-lite\/\*\*\/\*/);
    }
    assert.ok(config.files.includes('scripts/ailis-stockfish-engine.cjs'));
    assert.ok(!config.files.includes('electron/**/*'));
});

test('extraction is create-new, preserves hashes, strips developer scripts and never links old source', t => {
    const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-production-test-'));
    t.after(() => fs.rmSync(parent, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }));
    const target = path.join(parent, 'product');
    extract(target, { report, includeDist: false });
    const pkg = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'));
    assert.equal(pkg.scripts, undefined); assert.equal(pkg.devDependencies, undefined);
    assert.ok(!fs.existsSync(path.join(target, 'tests')));
    for (const file of report.files) {
        assert.ok(!fs.lstatSync(path.join(target, file)).isSymbolicLink());
        assert.deepEqual(fs.readFileSync(path.join(target, file)), fs.readFileSync(path.join(ROOT, file)));
    }
    assert.throws(() => extract(target, { report, includeDist: false }), /Refusing to overwrite/);
});

test('packaging rejects missing pages and stale website/demo output', t => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-build-profile-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    fs.mkdirSync(path.join(root, 'runtime'));
    fs.writeFileSync(path.join(root, 'runtime/production-entrypoints.json'), JSON.stringify(readManifest()));
    assert.throws(() => assertDesktopBuild(root), /missing dist/);
    fs.mkdirSync(path.join(root, 'dist'));
    for (const page of Object.values(readManifest().profiles.desktop.pages)) fs.writeFileSync(path.join(root, 'dist', page), '<html></html>');
    assert.doesNotThrow(() => assertDesktopBuild(root));
    fs.writeFileSync(path.join(root, 'dist/index.html'), '<html></html>');
    assert.throws(() => assertDesktopBuild(root), /Non-desktop output/);
});
