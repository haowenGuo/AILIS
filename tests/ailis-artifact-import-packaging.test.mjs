import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const file = fileURLToPath(new URL('../electron/ailis-artifact-import-tool.cjs', import.meta.url));
const require = createRequire(file);

for (const packaged of [false, true]) {
    test(`artifact import uses real worker/cwd/vendor paths (${packaged ? 'ASAR' : 'source'})`, async t => {
        const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis artifact paths '));
        t.after(() => fs.rmSync(scratch, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }));
        const virtual = path.join(scratch, packaged ? 'app.asar' : 'source');
        const physical = path.join(scratch, packaged ? 'app.asar.unpacked' : 'source');
        fs.mkdirSync(path.join(physical, 'scripts'), { recursive: true });
        fs.writeFileSync(path.join(physical, 'scripts/ailis-ragflow-lite-worker.py'), '# test fixture');
        const input = path.join(scratch, 'input.csv'); fs.writeFileSync(input, 'x\n1\n');
        let captured;
        const module = { exports: {} };
        vm.runInNewContext(fs.readFileSync(file, 'utf8'), {
            module, exports: module.exports, __dirname: path.dirname(file), process, Buffer, console,
            require: specifier => specifier === 'child_process' ? {
                execFile(command, args, options, callback) {
                    captured = { command, args, options };
                    callback(new Error('intentional fixture stop after launch validation'));
                }
            } : require(specifier)
        }, { filename: file });
        await module.exports.executeArtifactImportTool({ path: input }, {}, {
            projectRoot: virtual, workspaceRoot: scratch, contextArtifactStore: { createArtifact() {} }
        });
        assert.ok(captured, 'worker existence check must use physical path');
        assert.equal(captured.args[0], path.join(physical, 'scripts/ailis-ragflow-lite-worker.py'));
        assert.equal(captured.options.cwd, physical);
        assert.equal(captured.options.env.AILIS_RAGFLOW_PYDEPS, path.join(physical, 'vendor/ragflow-lite/python-deps'));
        assert.equal(captured.options.env.AILIS_RAGFLOW_NLTK_DATA, path.join(physical, 'vendor/ragflow-lite/nltk-data'));
    });
}
