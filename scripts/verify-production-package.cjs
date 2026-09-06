'use strict';

// Offline integration probe. Launches packaged Electron in Node mode, never the
// installed desktop or its user profile. Rejects npm/source fallback to the repo.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const Module = require('node:module');
const { spawnSync } = require('node:child_process');

function inside(root, file) {
    const relative = path.relative(root, file);
    return !path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep);
}

async function probe(packageDir, evidenceFile) {
    const root = path.resolve(packageDir);
    const app = path.join(root, 'resources', 'app.asar');
    const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
    const originalResolve = Module._resolveFilename;
    const loaded = new Set();
    Module._resolveFilename = function (specifier, parent, ...rest) {
        const resolved = originalResolve.call(this, specifier, parent, ...rest);
        if (parent?.filename && inside(root, parent.filename) && path.isAbsolute(resolved)) {
            assert.ok(inside(root, resolved), `Packaged module escaped to source/dependency outside package: ${resolved}`);
            loaded.add(resolved);
        }
        return resolved;
    };
    try {
        let verified = 0;
        for (const row of evidence.inventory.filter(row => row.category === 'product-closure' && !row.file.startsWith('src/') && !row.file.endsWith('.html'))) {
            const target = path.join(app, row.file);
            assert.equal(crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex'), row.sha256, row.file);
            verified++;
        }
        for (const file of ['electron/ailis-hosted-runtime.cjs', 'electron/ailis-humanlike-eval.cjs', 'electron/kokoro_tts_worker.py',
            'tests', 'Test', 'src', 'docs', 'dist/Test', 'dist/index.html'])
            assert.ok(!fs.existsSync(path.join(app, file)), `Non-desktop file leaked into package: ${file}`);
        const stockfish = require(path.join(app, 'scripts/ailis-stockfish-engine.cjs'));
        const engine = stockfish.resolveStockfishEngine();
        assert.ok(engine.path && inside(root, engine.path), 'Packaged Stockfish binary missing or resolved outside package');
        const chess = await stockfish.analyzeChessPosition({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            depth: 1, multiPv: 1, analysisTimeMs: 100, timeoutMs: 15000 });
        assert.equal(chess.ok, true, JSON.stringify(chess));
        let pythonImport = 'not requested; set AILIS_RAGFLOW_PYTHON to an installed interpreter';
        if (process.env.AILIS_RAGFLOW_PYTHON) {
            const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-package-table-'));
            try {
                const input = path.join(scratch, 'probe.csv'); fs.writeFileSync(input, 'Product,Stock\nWidget,12\nGadget,5\n');
                const { AILISContextArtifactStore } = require(path.join(app, 'electron/ailis-context-artifact-store.cjs'));
                const { executeArtifactImportTool } = require(path.join(app, 'electron/ailis-artifact-import-tool.cjs'));
                const imported = await executeArtifactImportTool({ path: input, parserId: 'table', language: 'English' }, {},
                    { projectRoot: app, workspaceRoot: scratch, contextArtifactStore: new AILISContextArtifactStore({ rootDir: path.join(scratch, 'artifacts') }) });
                assert.equal(imported.isError, false, JSON.stringify(imported));
                assert.ok(imported.details.chunkCount >= 2);
                pythonImport = 'packaged Python table worker and its four vendor modules passed';
            } finally { fs.rmSync(scratch, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); }
        }
        await require('./smoke-ailis-packaged-tools.cjs').runProbe(root);
        console.log(JSON.stringify({ ok: true, verifiedSourceHashes: verified, resolvedPackagedModules: loaded.size,
            sourceFallback: false, stockfish: engine.path, stockfishExecution: true, pythonImport, realProviderCalls: 0 }));
    } finally { Module._resolveFilename = originalResolve; }
}

module.exports = { probe };
if (require.main === module) {
    const [packageDir, evidenceFile] = process.argv.slice(2);
    if (!packageDir || !evidenceFile) throw new Error('Usage: node scripts/verify-production-package.cjs <win-unpacked> <desktop.json>');
    const exe = path.resolve(packageDir, 'AILIS.exe');
    const code = `require(${JSON.stringify(__filename)}).probe(${JSON.stringify(path.resolve(packageDir))},${JSON.stringify(path.resolve(evidenceFile))}).then(()=>process.exit(0)).catch(e=>{console.error(e.stack);process.exit(1)});`;
    const result = spawnSync(exe, ['-e', code], { env: { ...process.env, ELECTRON_RUN_AS_NODE: '1', PYTHONDONTWRITEBYTECODE: '1' },
        encoding: 'utf8', windowsHide: true, timeout: 90000, maxBuffer: 2 * 1024 * 1024 });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.error) console.error(result.error.message);
    process.exitCode = result.status ?? 1;
}
