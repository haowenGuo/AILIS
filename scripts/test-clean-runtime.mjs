import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

// Cold-profile execution, not an OS/installer emulator. The executable is the
// application-supplied runtime; no global development tools are inherited.
const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-cold-profile-'));
const suppliedArgs = process.argv.slice(2);
const outputArg = suppliedArgs.indexOf('--output');
const output = outputArg >= 0 ? path.resolve(suppliedArgs.splice(outputArg, 2)[1]) : null;
const runtimeArg = suppliedArgs.indexOf('--module-root');
const runtimeRoot = runtimeArg >= 0 ? path.resolve(suppliedArgs.splice(runtimeArg, 2)[1]) : null;
const tests = suppliedArgs.length ? suppliedArgs : ['tests/ailis-clean-environment.test.mjs', 'tests/ailis-code-mode-runtime.test.mjs', 'tests/ailis-code-mode-packaging.test.mjs', 'tests/ailis-platform-adapter.test.mjs', 'tests/ailis-runtime.test.mjs', 'tests/ailis-computer-tool.test.mjs', 'tests/ailis-computer-advanced-tool.test.mjs'];
const env = { HOME: root, USERPROFILE: root, APPDATA: path.join(root, 'AppData/Roaming'),
    LOCALAPPDATA: path.join(root, 'AppData/Local'), TMP: root, TEMP: root, TMPDIR: root,
    LANG: 'C.UTF-8', NO_COLOR: '1', ELECTRON_RUN_AS_NODE: '1' };
if (process.platform === 'win32') {
    const systemRoot = process.env.SystemRoot || 'C:\\Windows';
    Object.assign(env, { SystemRoot: systemRoot, WINDIR: systemRoot, ComSpec: path.join(systemRoot, 'System32/cmd.exe'),
        PATHEXT: '.COM;.EXE;.BAT;.CMD',
        PATH: [path.join(systemRoot, 'System32'), systemRoot, path.join(systemRoot, 'System32/WindowsPowerShell/v1.0')].join(';') });
} else env.PATH = '/usr/bin:/bin:/usr/sbin:/sbin';
if (runtimeRoot) env.AILIS_TEST_RUNTIME_ROOT = runtimeRoot;
await Promise.all([env.APPDATA, env.LOCALAPPDATA].map(p => fs.mkdir(p, { recursive: true })));
const started = Date.now();
const child = spawn(process.execPath, ['--test', '--test-reporter=tap', '--test-concurrency=1', '--test-timeout=120000', ...tests], { cwd: source, env, windowsHide: true, stdio: ['ignore','pipe','pipe'] });
let stdout = '', stderr = '';
child.stdout.on('data', b => { stdout += b; }); child.stderr.on('data', b => { stderr += b; });
const exit = await new Promise(resolve => { child.on('error', e => resolve({ error: e.message })); child.on('close', (code, signal) => resolve({ code, signal })); });
const counters = Object.fromEntries(['tests','pass','fail','skipped','cancelled'].map(k => [k, Number(stdout.match(new RegExp(`# ${k} (\\d+)`))?.[1] ?? -1)]));
const report = { platform: process.platform, arch: process.arch, executable: process.execPath, versions: process.versions,
    isolation: { freshProfile: true, systemOnlyPath: env.PATH, realOS: process.platform, installerVM: false, realProviderCalls: 0 },
    testFiles: tests, runtimeRoot, ...counters, ...exit, durationMs: Date.now()-started, stdout, stderr };
if (output) { await fs.mkdir(path.dirname(output), { recursive: true }); await fs.writeFile(output, JSON.stringify(report, null, 2)); }
console.log(JSON.stringify({ ...report, versions: undefined, stdout: undefined, stderr: undefined, report: output }, null, 2));
if (exit.code !== 0) console.error(stdout.split(/(?=# Subtest:)/).filter(section => section.includes('not ok')).join('\n').slice(-18000), stderr.slice(-4000));
await fs.rm(root, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
process.exitCode = exit.code === 0 && counters.fail === 0 ? 0 : 1;
