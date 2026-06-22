import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_RUNTIME_DIR = path.join(PROJECT_ROOT, '.ailis-runtime');
const SOURCE_CRAWL4AI_VENV = path.join(SOURCE_RUNTIME_DIR, 'crawl4ai-venv');
const SOURCE_PRIVATE_PYTHON_DIR = path.join(SOURCE_RUNTIME_DIR, 'python');
const SOURCE_UV_DIR = path.join(SOURCE_RUNTIME_DIR, 'uv');
const SOURCE_DOWNLOADS_DIR = path.join(SOURCE_RUNTIME_DIR, 'downloads');
const SOURCE_UV_CACHE_DIR = path.join(SOURCE_RUNTIME_DIR, 'uv-cache');
const SOURCE_PLAYWRIGHT_BROWSERS_DIR = path.join(SOURCE_RUNTIME_DIR, 'ms-playwright');
const OUTPUT_RUNTIME_DIR = path.join(PROJECT_ROOT, 'build-cache', 'ailis-web-runtime');
const OUTPUT_CRAWL4AI_VENV = path.join(OUTPUT_RUNTIME_DIR, 'crawl4ai-venv');
const OUTPUT_PLAYWRIGHT_BROWSERS_DIR = path.join(OUTPUT_RUNTIME_DIR, 'ms-playwright');
const DEFAULT_PYTHON_VERSION = '3.12';
const INSTALL_TIMEOUT_MS = 30 * 60 * 1000;

function executableName(name) {
    return process.platform === 'win32' ? `${name}.exe` : name;
}

function venvPythonPath(venvDir) {
    return process.platform === 'win32'
        ? path.join(venvDir, 'Scripts', 'python.exe')
        : path.join(venvDir, 'bin', 'python');
}

function hasPythonExecutableInDir(root) {
    if (!root || !fsSync.existsSync(root)) {
        return false;
    }
    const directCandidates = [
        path.join(root, executableName('python')),
        path.join(root, 'python.exe'),
        path.join(root, 'bin', 'python')
    ];
    if (directCandidates.some((candidate) => fsSync.existsSync(candidate))) {
        return true;
    }
    try {
        return fsSync.readdirSync(root, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .some((entry) => {
                const child = path.join(root, entry.name);
                return [
                    path.join(child, executableName('python')),
                    path.join(child, 'python.exe'),
                    path.join(child, 'bin', 'python'),
                    path.join(child, 'install', 'bin', 'python')
                ].some((candidate) => fsSync.existsSync(candidate));
            });
    } catch {
        return false;
    }
}

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        skipInstall: false,
        skipBrowserInstall: false,
        forceRebuild: false,
        pythonVersion: DEFAULT_PYTHON_VERSION
    };
    for (const token of argv) {
        if (token === '--skip-install') args.skipInstall = true;
        if (token === '--skip-browser-install') args.skipBrowserInstall = true;
        if (token === '--force-rebuild') args.forceRebuild = true;
        if (token.startsWith('--python-version=')) {
            args.pythonVersion = token.slice('--python-version='.length).trim() || DEFAULT_PYTHON_VERSION;
        }
    }
    return args;
}

function runProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        let settled = false;
        const child = spawn(command, args, {
            cwd: options.cwd || PROJECT_ROOT,
            stdio: 'inherit',
            windowsHide: true,
            env: {
                ...process.env,
                ...(options.env || {})
            }
        });
        const timeout = options.timeoutMs
            ? setTimeout(() => {
                if (settled) {
                    return;
                }
                settled = true;
                try {
                    child.kill();
                } catch {
                    // Ignore cleanup failures.
                }
                reject(new Error(`${command} ${args.join(' ')} timed out after ${options.timeoutMs}ms`));
            }, options.timeoutMs)
            : null;
        child.on('error', (error) => {
            if (settled) {
                return;
            }
            settled = true;
            if (timeout) clearTimeout(timeout);
            reject(error);
        });
        child.on('close', (code) => {
            if (settled) {
                return;
            }
            settled = true;
            if (timeout) clearTimeout(timeout);
            if (code === 0) {
                resolve();
                return;
            }
            reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
        });
    });
}

function runProcessCapture(command, args = [], options = {}) {
    const result = spawnSync(command, args, {
        cwd: options.cwd || PROJECT_ROOT,
        windowsHide: true,
        timeout: options.timeoutMs || 12000,
        encoding: 'utf8',
        env: {
            ...process.env,
            ...(options.env || {})
        }
    });
    return {
        ok: !result.error && result.status === 0,
        stdout: String(result.stdout || '').trim(),
        stderr: String(result.stderr || '').trim(),
        error: result.error?.message || '',
        status: result.status
    };
}

function normalizePathForCompare(value = '') {
    return path.resolve(String(value || '')).toLowerCase().replace(/\\/g, '/');
}

function getUvAsset() {
    const arch = process.arch === 'arm64' ? 'aarch64' : 'x86_64';
    if (process.platform === 'win32') {
        return {
            url: `https://github.com/astral-sh/uv/releases/latest/download/uv-${arch}-pc-windows-msvc.zip`,
            archiveName: 'uv.zip',
            binaryName: 'uv.exe',
            archiveType: 'zip'
        };
    }
    if (process.platform === 'darwin') {
        return {
            url: `https://github.com/astral-sh/uv/releases/latest/download/uv-${arch}-apple-darwin.tar.gz`,
            archiveName: 'uv.tar.gz',
            binaryName: 'uv',
            archiveType: 'tar.gz'
        };
    }
    if (process.platform === 'linux') {
        return {
            url: `https://github.com/astral-sh/uv/releases/latest/download/uv-${arch}-unknown-linux-gnu.tar.gz`,
            archiveName: 'uv.tar.gz',
            binaryName: 'uv',
            archiveType: 'tar.gz'
        };
    }
    return null;
}

async function downloadFile(url, targetPath) {
    const maxRedirects = 5;
    const requestOnce = (currentUrl, redirectsRemaining) => new Promise((resolve, reject) => {
        const parsed = new URL(currentUrl);
        const client = parsed.protocol === 'http:' ? http : https;
        const request = client.get(parsed, {
            headers: { 'User-Agent': 'AILIS-web-runtime-prepare/1.0' },
            timeout: INSTALL_TIMEOUT_MS
        }, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location && redirectsRemaining > 0) {
                response.resume();
                resolve(requestOnce(new URL(response.headers.location, parsed).toString(), redirectsRemaining - 1));
                return;
            }
            if (response.statusCode < 200 || response.statusCode >= 300) {
                response.resume();
                reject(new Error(`download_failed_http_${response.statusCode}`));
                return;
            }
            const output = fsSync.createWriteStream(targetPath);
            response.pipe(output);
            output.on('finish', () => output.close(resolve));
            output.on('error', reject);
        });
        request.on('timeout', () => request.destroy(new Error(`download_timeout_${INSTALL_TIMEOUT_MS}ms`)));
        request.on('error', reject);
    });
    await requestOnce(url, maxRedirects);
}

async function extractArchive(archivePath, targetDir, archiveType) {
    await fs.rm(targetDir, { recursive: true, force: true });
    await fs.mkdir(targetDir, { recursive: true });
    if (archiveType === 'zip' && process.platform === 'win32') {
        await runProcess('powershell.exe', [
            '-NoProfile',
            '-ExecutionPolicy',
            'Bypass',
            '-Command',
            'Expand-Archive -LiteralPath $args[0] -DestinationPath $args[1] -Force',
            archivePath,
            targetDir
        ], { timeoutMs: INSTALL_TIMEOUT_MS });
        return;
    }
    if (archiveType === 'zip') {
        await runProcess('unzip', ['-q', archivePath, '-d', targetDir], { timeoutMs: INSTALL_TIMEOUT_MS });
        return;
    }
    await runProcess('tar', ['-xzf', archivePath, '-C', targetDir], { timeoutMs: INSTALL_TIMEOUT_MS });
}

async function findFileRecursive(rootDir, predicate) {
    const stack = [rootDir];
    while (stack.length) {
        const current = stack.pop();
        let entries = [];
        try {
            entries = await fs.readdir(current, { withFileTypes: true });
        } catch {
            continue;
        }
        for (const entry of entries) {
            const entryPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(entryPath);
                continue;
            }
            if (entry.isFile() && predicate(entryPath, entry)) {
                return entryPath;
            }
        }
    }
    return '';
}

async function ensureUv(args) {
    const uvBin = path.join(SOURCE_UV_DIR, executableName('uv'));
    if (fsSync.existsSync(uvBin)) {
        return uvBin;
    }
    await fs.mkdir(SOURCE_UV_DIR, { recursive: true });

    const systemUv = runProcessCapture('uv', ['--version'], { timeoutMs: 8000 });
    if (systemUv.ok) {
        const locator = process.platform === 'win32'
            ? runProcessCapture('where.exe', ['uv'], { timeoutMs: 8000 })
            : runProcessCapture('which', ['uv'], { timeoutMs: 8000 });
        const sourceUv = locator.stdout.split(/\r?\n/).map((item) => item.trim()).find(Boolean);
        if (sourceUv && fsSync.existsSync(sourceUv)) {
            await fs.copyFile(sourceUv, uvBin);
            if (process.platform !== 'win32') {
                await fs.chmod(uvBin, 0o755).catch(() => {});
            }
            return uvBin;
        }
        return 'uv';
    }

    if (args.skipInstall) {
        throw new Error('uv is missing and --skip-install was provided.');
    }
    const asset = getUvAsset();
    if (!asset) {
        throw new Error(`Unsupported platform for automatic uv bootstrap: ${process.platform}/${process.arch}`);
    }
    await fs.mkdir(SOURCE_DOWNLOADS_DIR, { recursive: true });
    const archivePath = path.join(SOURCE_DOWNLOADS_DIR, asset.archiveName);
    console.log(`[AILIS Web Runtime] Downloading uv: ${asset.url}`);
    await downloadFile(asset.url, archivePath);
    const extractDir = path.join(SOURCE_DOWNLOADS_DIR, `uv-extract-${Date.now()}`);
    await extractArchive(archivePath, extractDir, asset.archiveType);
    const extractedUv = await findFileRecursive(extractDir, (filePath) =>
        path.basename(filePath).toLowerCase() === asset.binaryName.toLowerCase()
    );
    if (!extractedUv) {
        throw new Error('uv archive extracted, but uv executable was not found.');
    }
    await fs.copyFile(extractedUv, uvBin);
    if (process.platform !== 'win32') {
        await fs.chmod(uvBin, 0o755).catch(() => {});
    }
    await fs.rm(extractDir, { recursive: true, force: true });
    return uvBin;
}

async function isSourceVenvTiedToPrivatePython() {
    const cfgPath = path.join(SOURCE_CRAWL4AI_VENV, 'pyvenv.cfg');
    if (!fsSync.existsSync(cfgPath)) {
        return false;
    }
    const cfg = await fs.readFile(cfgPath, 'utf8').catch(() => '');
    const privatePythonRoot = normalizePathForCompare(SOURCE_PRIVATE_PYTHON_DIR);
    const basePathLines = cfg.split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => /^(home|executable)\s*=/i.test(line))
        .map((line) => line.replace(/^[^=]+=/, '').trim())
        .filter(Boolean)
        .map((value) => normalizePathForCompare(value));
    return basePathLines.some((value) => value.startsWith(privatePythonRoot));
}

function hasPlaywrightChromiumCache(dir) {
    if (!dir || !fsSync.existsSync(dir)) {
        return false;
    }
    try {
        return fsSync.readdirSync(dir, { withFileTypes: true })
            .some((entry) => entry.isDirectory() && /^chromium/i.test(entry.name));
    } catch {
        return false;
    }
}

async function copyExistingPlaywrightBrowsers() {
    const candidates = [
        process.env.AILIS_PLAYWRIGHT_BROWSERS_PATH,
        process.env.PLAYWRIGHT_BROWSERS_PATH,
        process.platform === 'win32' && process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'ms-playwright') : '',
        process.platform === 'darwin' ? path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright') : '',
        process.platform === 'linux' ? path.join(os.homedir(), '.cache', 'ms-playwright') : ''
    ].filter(Boolean);
    const target = normalizePathForCompare(SOURCE_PLAYWRIGHT_BROWSERS_DIR);
    for (const candidate of candidates) {
        if (!hasPlaywrightChromiumCache(candidate) || normalizePathForCompare(candidate) === target) {
            continue;
        }
        console.log(`[AILIS Web Runtime] Reusing existing Playwright browser cache: ${candidate}`);
        await fs.rm(SOURCE_PLAYWRIGHT_BROWSERS_DIR, { recursive: true, force: true });
        await fs.cp(candidate, SOURCE_PLAYWRIGHT_BROWSERS_DIR, {
            recursive: true,
            force: true,
            dereference: true
        });
        return true;
    }
    return false;
}

async function rebuildSourceRuntimeWithUv(args, uv) {
    const env = {
        UV_CACHE_DIR: SOURCE_UV_CACHE_DIR,
        UV_PYTHON_INSTALL_DIR: SOURCE_PRIVATE_PYTHON_DIR,
        UV_LINK_MODE: 'copy',
        PLAYWRIGHT_BROWSERS_PATH: SOURCE_PLAYWRIGHT_BROWSERS_DIR
    };
    await fs.mkdir(SOURCE_RUNTIME_DIR, { recursive: true });
    await fs.mkdir(SOURCE_PRIVATE_PYTHON_DIR, { recursive: true });
    console.log(`[AILIS Web Runtime] Installing private Python ${args.pythonVersion} via uv`);
    await runProcess(uv, [
        'python',
        'install',
        '--install-dir',
        SOURCE_PRIVATE_PYTHON_DIR,
        args.pythonVersion
    ], { env, timeoutMs: INSTALL_TIMEOUT_MS });

    console.log('[AILIS Web Runtime] Rebuilding Crawl4AI venv with uv-managed Python');
    await fs.rm(SOURCE_CRAWL4AI_VENV, { recursive: true, force: true });
    await runProcess(uv, [
        'venv',
        SOURCE_CRAWL4AI_VENV,
        '--python',
        args.pythonVersion,
        '--managed-python',
        '--seed'
    ], { env, timeoutMs: INSTALL_TIMEOUT_MS });

    const sourcePython = venvPythonPath(SOURCE_CRAWL4AI_VENV);
    if (!fsSync.existsSync(sourcePython)) {
        throw new Error(`Crawl4AI venv Python not found after rebuild: ${sourcePython}`);
    }
    await runProcess(sourcePython, ['-m', 'pip', 'install', '--upgrade', 'pip', 'setuptools', 'wheel'], {
        timeoutMs: INSTALL_TIMEOUT_MS
    });
    await runProcess(sourcePython, ['-m', 'pip', 'install', '--upgrade', 'crawl4ai'], {
        timeoutMs: INSTALL_TIMEOUT_MS
    });
    if (!args.skipBrowserInstall) {
        try {
            await runProcess(sourcePython, ['-m', 'playwright', 'install', 'chromium'], {
                env,
                timeoutMs: INSTALL_TIMEOUT_MS
            });
        } catch (error) {
            const copied = await copyExistingPlaywrightBrowsers();
            if (!copied) {
                throw error;
            }
        }
    }
    await runProcess(sourcePython, ['-c', 'import crawl4ai; print("crawl4ai import ok")'], {
        timeoutMs: 30000
    });
}

async function ensureSourceRuntime(args) {
    const sourcePython = venvPythonPath(SOURCE_CRAWL4AI_VENV);
    const sourcePythonExists = fsSync.existsSync(sourcePython);
    if (args.skipInstall) {
        if (!sourcePythonExists) {
            throw new Error(`Crawl4AI source runtime is missing: ${sourcePython}`);
        }
        return;
    }
    const uv = await ensureUv(args);
    const tiedToPrivatePython = sourcePythonExists && await isSourceVenvTiedToPrivatePython();
    if (!sourcePythonExists || !tiedToPrivatePython || args.forceRebuild) {
        if (sourcePythonExists && !tiedToPrivatePython) {
            console.log('[AILIS Web Runtime] Existing Crawl4AI venv is tied to a system Python; rebuilding it for packaged runtime portability.');
        }
        await rebuildSourceRuntimeWithUv(args, uv);
    } else if (!args.skipBrowserInstall && !hasPlaywrightChromiumCache(SOURCE_PLAYWRIGHT_BROWSERS_DIR)) {
        try {
            await runProcess(sourcePython, ['-m', 'playwright', 'install', 'chromium'], {
                env: { PLAYWRIGHT_BROWSERS_PATH: SOURCE_PLAYWRIGHT_BROWSERS_DIR },
                timeoutMs: INSTALL_TIMEOUT_MS
            });
        } catch (error) {
            const copied = await copyExistingPlaywrightBrowsers();
            if (!copied) {
                throw error;
            }
        }
    }
}

async function copyRuntime() {
    await fs.rm(OUTPUT_RUNTIME_DIR, { recursive: true, force: true });
    await fs.mkdir(OUTPUT_RUNTIME_DIR, { recursive: true });
    await fs.cp(SOURCE_CRAWL4AI_VENV, OUTPUT_CRAWL4AI_VENV, {
        recursive: true,
        force: true,
        dereference: true
    });

    const pythonCandidates = [
        path.join(SOURCE_RUNTIME_DIR, 'python'),
        path.join(PROJECT_ROOT, 'build-cache', 'ailis-web-runtime-source', 'python')
    ];
    const pythonSource = pythonCandidates.find((candidate) => hasPythonExecutableInDir(candidate));
    if (pythonSource) {
        await fs.cp(pythonSource, path.join(OUTPUT_RUNTIME_DIR, 'python'), {
            recursive: true,
            force: true,
            dereference: true
        });
    }

    if (hasPlaywrightChromiumCache(SOURCE_PLAYWRIGHT_BROWSERS_DIR)) {
        await fs.cp(SOURCE_PLAYWRIGHT_BROWSERS_DIR, OUTPUT_PLAYWRIGHT_BROWSERS_DIR, {
            recursive: true,
            force: true,
            dereference: true
        });
    }

    const uvCandidates = [
        path.join(SOURCE_RUNTIME_DIR, 'uv', executableName('uv')),
        path.join(PROJECT_ROOT, 'build-cache', 'ailis-web-runtime-source', 'uv', executableName('uv'))
    ];
    const uvSource = uvCandidates.find((candidate) => fsSync.existsSync(candidate));
    if (uvSource) {
        const uvOutputDir = path.join(OUTPUT_RUNTIME_DIR, 'uv');
        await fs.mkdir(uvOutputDir, { recursive: true });
        await fs.copyFile(uvSource, path.join(uvOutputDir, executableName('uv')));
    }

    const manifest = {
        name: 'ailis-web-runtime',
        version: 1,
        preparedAt: new Date().toISOString(),
        crawl4aiVenv: 'crawl4ai-venv',
        crawl4aiPython: path.relative(OUTPUT_RUNTIME_DIR, venvPythonPath(OUTPUT_CRAWL4AI_VENV)).replace(/\\/g, '/'),
        python: pythonSource ? 'python' : '',
        playwrightBrowsers: hasPlaywrightChromiumCache(OUTPUT_PLAYWRIGHT_BROWSERS_DIR) ? 'ms-playwright' : '',
        uv: uvSource ? `uv/${executableName('uv')}` : '',
        notes: [
            'Packaged as an application-private runtime for Crawl4AI rendered web extraction.',
            'Runtime lookup prefers process.resourcesPath/ailis-web-runtime before falling back to local developer caches.',
            'Do not require users to install Python, uv, pip, Playwright, or Crawl4AI manually.'
        ]
    };
    await fs.writeFile(path.join(OUTPUT_RUNTIME_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function main() {
    const args = parseArgs();
    await fs.rm(OUTPUT_RUNTIME_DIR, { recursive: true, force: true });
    await ensureSourceRuntime(args);
    await copyRuntime();
    console.log(`[AILIS Web Runtime] Prepared ${OUTPUT_RUNTIME_DIR}`);
    console.log(`[AILIS Web Runtime] Crawl4AI Python: ${venvPythonPath(OUTPUT_CRAWL4AI_VENV)}`);
}

main().catch((error) => {
    console.error('[AILIS Web Runtime] failed');
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
});
