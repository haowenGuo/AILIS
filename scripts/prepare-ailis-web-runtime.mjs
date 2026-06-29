import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_RUNTIME_DIR = path.join(PROJECT_ROOT, '.ailis-runtime');
const SOURCE_CRAWL4AI_VENV = path.join(SOURCE_RUNTIME_DIR, 'crawl4ai-venv');
const SOURCE_SEARXNG_VENV = path.join(SOURCE_RUNTIME_DIR, 'searxng-venv');
const SOURCE_SEARXNG_SRC = path.join(SOURCE_RUNTIME_DIR, 'searxng-src');
const SOURCE_SEARXNG_CONFIG_DIR = path.join(SOURCE_RUNTIME_DIR, 'searxng-config');
const SOURCE_PRIVATE_PYTHON_DIR = path.join(SOURCE_RUNTIME_DIR, 'python');
const SOURCE_UV_DIR = path.join(SOURCE_RUNTIME_DIR, 'uv');
const SOURCE_DOWNLOADS_DIR = path.join(SOURCE_RUNTIME_DIR, 'downloads');
const SOURCE_UV_CACHE_DIR = path.join(SOURCE_RUNTIME_DIR, 'uv-cache');
const SOURCE_PLAYWRIGHT_BROWSERS_DIR = path.join(SOURCE_RUNTIME_DIR, 'ms-playwright');
const OUTPUT_RUNTIME_DIR = path.join(PROJECT_ROOT, 'build-cache', 'ailis-web-runtime');
const OUTPUT_CRAWL4AI_VENV = path.join(OUTPUT_RUNTIME_DIR, 'crawl4ai-venv');
const OUTPUT_SEARXNG_VENV = path.join(OUTPUT_RUNTIME_DIR, 'searxng-venv');
const OUTPUT_SEARXNG_CONFIG_DIR = path.join(OUTPUT_RUNTIME_DIR, 'searxng-config');
const OUTPUT_PLAYWRIGHT_BROWSERS_DIR = path.join(OUTPUT_RUNTIME_DIR, 'ms-playwright');
const DEFAULT_PYTHON_VERSION = '3.12';
const INSTALL_TIMEOUT_MS = 30 * 60 * 1000;
const SEARXNG_ZIP_URL = 'https://codeload.github.com/searxng/searxng/zip/refs/heads/master';
const MANAGED_SEARXNG_PORT = 18888;

function executableName(name) {
    return process.platform === 'win32' ? `${name}.exe` : name;
}

function venvPythonPath(venvDir) {
    return process.platform === 'win32'
        ? path.join(venvDir, 'Scripts', 'python.exe')
        : path.join(venvDir, 'bin', 'python');
}

function venvSitePackagesPath(venvDir) {
    if (process.platform === 'win32') {
        return path.join(venvDir, 'Lib', 'site-packages');
    }
    const libDir = path.join(venvDir, 'lib');
    try {
        const pythonDir = fsSync.readdirSync(libDir, { withFileTypes: true })
            .find((entry) => entry.isDirectory() && /^python\d+\.\d+$/.test(entry.name));
        if (pythonDir) {
            return path.join(libDir, pythonDir.name, 'site-packages');
        }
    } catch {
        // Fall through to the most common layout.
    }
    return path.join(libDir, `python${process.version.match(/^v(\d+\.\d+)/)?.[1] || '3.12'}`, 'site-packages');
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

async function ensurePrivatePython(args, uv) {
    if (hasPythonExecutableInDir(SOURCE_PRIVATE_PYTHON_DIR)) {
        return;
    }
    await fs.mkdir(SOURCE_RUNTIME_DIR, { recursive: true });
    await fs.mkdir(SOURCE_PRIVATE_PYTHON_DIR, { recursive: true });
    console.log(`[AILIS Web Runtime] Installing private Python ${args.pythonVersion} via uv`);
    await runProcess(uv, [
        'python',
        'install',
        '--install-dir',
        SOURCE_PRIVATE_PYTHON_DIR,
        args.pythonVersion
    ], {
        env: {
            UV_CACHE_DIR: SOURCE_UV_CACHE_DIR,
            UV_PYTHON_INSTALL_DIR: SOURCE_PRIVATE_PYTHON_DIR
        },
        timeoutMs: INSTALL_TIMEOUT_MS
    });
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
    await ensurePrivatePython(args, uv);

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

async function isVenvTiedToPrivatePython(venvDir) {
    const cfgPath = path.join(venvDir, 'pyvenv.cfg');
    if (!fsSync.existsSync(cfgPath)) {
        return false;
    }
    const cfg = await fs.readFile(cfgPath, 'utf8').catch(() => '');
    const privatePythonRoot = normalizePathForCompare(SOURCE_PRIVATE_PYTHON_DIR);
    return cfg.split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => /^(home|executable)\s*=/i.test(line))
        .map((line) => line.replace(/^[^=]+=/, '').trim())
        .filter(Boolean)
        .map((value) => normalizePathForCompare(value))
        .some((value) => value.startsWith(privatePythonRoot));
}

async function ensureSearxngSource(args) {
    const setupPy = path.join(SOURCE_SEARXNG_SRC, 'setup.py');
    if (fsSync.existsSync(setupPy) && !args.forceRebuild) {
        return;
    }
    const mirroredSource = path.join(PROJECT_ROOT, '.local', 'ailis-web-stack', 'src', 'searxng');
    if (fsSync.existsSync(path.join(mirroredSource, 'setup.py'))) {
        console.log(`[AILIS Web Runtime] Reusing local SearXNG source mirror: ${mirroredSource}`);
        await fs.rm(SOURCE_SEARXNG_SRC, { recursive: true, force: true });
        await fs.cp(mirroredSource, SOURCE_SEARXNG_SRC, {
            recursive: true,
            force: true,
            dereference: true,
            filter: (source) => !/[\\/]__pycache__([\\/]|$)|\.pyc$|[\\/]\.git([\\/]|$)/i.test(source)
        });
        return;
    }
    if (args.skipInstall) {
        throw new Error(`SearXNG source is missing: ${SOURCE_SEARXNG_SRC}`);
    }
    await fs.mkdir(SOURCE_DOWNLOADS_DIR, { recursive: true });
    const archivePath = path.join(SOURCE_DOWNLOADS_DIR, 'searxng.zip');
    const extractDir = path.join(SOURCE_DOWNLOADS_DIR, `searxng-extract-${Date.now()}`);
    console.log(`[AILIS Web Runtime] Downloading SearXNG source: ${SEARXNG_ZIP_URL}`);
    await downloadFile(SEARXNG_ZIP_URL, archivePath);
    await extractArchive(archivePath, extractDir, 'zip');
    const expanded = (await fs.readdir(extractDir, { withFileTypes: true }))
        .find((entry) => entry.isDirectory());
    if (!expanded) {
        throw new Error('SearXNG source archive extracted, but no source directory was found.');
    }
    await fs.rm(SOURCE_SEARXNG_SRC, { recursive: true, force: true });
    await fs.rename(path.join(extractDir, expanded.name), SOURCE_SEARXNG_SRC);
    await fs.rm(extractDir, { recursive: true, force: true });
}

async function writeManagedSearxngSettings() {
    await fs.mkdir(SOURCE_SEARXNG_CONFIG_DIR, { recursive: true });
    const settingsPath = path.join(SOURCE_SEARXNG_CONFIG_DIR, 'settings.yml');
    let secret = '';
    if (fsSync.existsSync(settingsPath)) {
        const existing = await fs.readFile(settingsPath, 'utf8').catch(() => '');
        const match = existing.match(/secret_key:\s*"([^"]+)"/);
        secret = match?.[1] || '';
    }
    if (!secret || secret === 'ultrasecretkey') {
        secret = randomBytes(24).toString('hex');
    }
    const settings = `# Generated by scripts/prepare-ailis-web-runtime.mjs.
# This SearXNG instance is private to AILIS and bound to localhost.
use_default_settings: true

general:
  instance_name: "AILIS Local Search"
  enable_metrics: false

search:
  safe_search: 0
  autocomplete: ""
  formats:
    - html
    - json

outgoing:
  request_timeout: 8.0
  max_request_timeout: 12.0
  pool_connections: 20
  pool_maxsize: 40

server:
  port: ${MANAGED_SEARXNG_PORT}
  bind_address: "127.0.0.1"
  secret_key: "${secret}"
  limiter: false
  public_instance: false
  image_proxy: false
  method: "GET"

valkey:
  url: false

engines:
  - name: bing
    disabled: false
    timeout: 8.0
  - name: duckduckgo
    disabled: false
    timeout: 8.0
  - name: yahoo
    disabled: false
    timeout: 8.0
  - name: wikipedia
    disabled: false
    timeout: 8.0
  - name: brave
    disabled: true
  - name: google
    disabled: true
  - name: startpage
    disabled: true
  - name: wikidata
    disabled: true
`;
    await fs.writeFile(settingsPath, settings, 'utf8');
}

async function writeWindowsSearxngCompatibilityShims(venvDir) {
    if (process.platform !== 'win32') {
        return;
    }
    const sitePackages = venvSitePackagesPath(venvDir);
    await fs.mkdir(sitePackages, { recursive: true });
    const pwdShim = `# Generated by scripts/prepare-ailis-web-runtime.mjs for local Windows SearXNG runtime.
# SearXNG imports pwd only for Unix-style Valkey error logging. AILIS disables
# Valkey in its localhost-only settings, but Windows still needs the import.
from collections import namedtuple

struct_passwd = namedtuple("struct_passwd", "pw_name pw_passwd pw_uid pw_gid pw_gecos pw_dir pw_shell")

def getpwuid(uid):
    return struct_passwd("ailis", "", int(uid or 0), 0, "AILIS", "", "")
`;
    await fs.writeFile(path.join(sitePackages, 'pwd.py'), pwdShim, 'utf8');
}

function managedSearxngManifest(runtimeDir) {
    return {
        name: 'ailis-managed-searxng',
        version: 1,
        license: 'AGPL-3.0-or-later',
        defaultPort: MANAGED_SEARXNG_PORT,
        bindAddress: '127.0.0.1',
        baseUrl: `http://127.0.0.1:${MANAGED_SEARXNG_PORT}`,
        python: path.relative(runtimeDir, venvPythonPath(path.join(runtimeDir, 'searxng-venv'))).replace(/\\/g, '/'),
        args: ['-m', 'searx.webapp'],
        cwd: '.',
        settingsPath: 'searxng-config/settings.yml',
        healthPath: '/search?q=ailis&format=json',
        env: {
            SEARXNG_SETTINGS_PATH: 'searxng-config/settings.yml',
            SEARXNG_BIND_ADDRESS: '127.0.0.1',
            SEARXNG_PORT: String(MANAGED_SEARXNG_PORT),
            SEARXNG_LIMITER: 'false',
            SEARXNG_PUBLIC_INSTANCE: 'false',
            SEARXNG_DEBUG: '0'
        },
        notes: [
            'AILIS starts this local SearXNG process automatically for web_search when no user-provided SearXNG URL exists.',
            'The service binds to 127.0.0.1 and exposes JSON search only to the local desktop runtime.',
            'SearXNG is an AGPL-3.0-or-later component; keep its license notice with redistributed builds.'
        ]
    };
}

async function ensureSourceSearxngRuntime(args, uv) {
    const sourcePython = venvPythonPath(SOURCE_SEARXNG_VENV);
    const sourcePythonExists = fsSync.existsSync(sourcePython);
    const tiedToPrivatePython = sourcePythonExists && await isVenvTiedToPrivatePython(SOURCE_SEARXNG_VENV);
    const hasSearxngPackage = sourcePythonExists && runProcessCapture(sourcePython, ['-c', 'import searx; print("searx import ok")'], {
        timeoutMs: 12000
    }).ok;
    const settingsPath = path.join(SOURCE_SEARXNG_CONFIG_DIR, 'settings.yml');
    const manifestPath = path.join(SOURCE_RUNTIME_DIR, 'managed-searxng.json');
    if (args.skipInstall) {
        if (!sourcePythonExists) {
            throw new Error(`SearXNG source runtime is missing: ${sourcePython}`);
        }
        if (!hasSearxngPackage) {
            throw new Error(`SearXNG package is missing from source runtime: ${sourcePython}`);
        }
        if (!fsSync.existsSync(settingsPath) || !fsSync.existsSync(manifestPath)) {
            throw new Error('SearXNG managed settings or manifest is missing.');
        }
        return;
    }
    await ensurePrivatePython(args, uv);
    await ensureSearxngSource(args);
    if (!sourcePythonExists || !tiedToPrivatePython || !hasSearxngPackage || args.forceRebuild) {
        if (sourcePythonExists && !tiedToPrivatePython) {
            console.log('[AILIS Web Runtime] Existing SearXNG venv is tied to a system Python; rebuilding it for packaged runtime portability.');
        } else if (sourcePythonExists && !hasSearxngPackage) {
            console.log('[AILIS Web Runtime] Existing SearXNG venv does not contain the searx package; rebuilding it.');
        }
        const env = {
            UV_CACHE_DIR: SOURCE_UV_CACHE_DIR,
            UV_PYTHON_INSTALL_DIR: SOURCE_PRIVATE_PYTHON_DIR,
            UV_LINK_MODE: 'copy'
        };
        console.log('[AILIS Web Runtime] Rebuilding SearXNG venv with uv-managed Python');
        await fs.rm(SOURCE_SEARXNG_VENV, { recursive: true, force: true });
        await runProcess(uv, [
            'venv',
            SOURCE_SEARXNG_VENV,
            '--python',
            args.pythonVersion,
            '--managed-python',
            '--seed'
        ], { env, timeoutMs: INSTALL_TIMEOUT_MS });
        await runProcess(sourcePython, ['-m', 'pip', 'install', '--upgrade', 'pip', 'setuptools', 'wheel'], {
            timeoutMs: INSTALL_TIMEOUT_MS
        });
        await runProcess(sourcePython, ['-m', 'pip', 'install', '--upgrade', '-r', 'requirements.txt'], {
            cwd: SOURCE_SEARXNG_SRC,
            timeoutMs: INSTALL_TIMEOUT_MS
        });
        await runProcess(sourcePython, ['-m', 'pip', 'install', '--no-build-isolation', '--upgrade', '.'], {
            cwd: SOURCE_SEARXNG_SRC,
            timeoutMs: INSTALL_TIMEOUT_MS
        });
    }
    await writeWindowsSearxngCompatibilityShims(SOURCE_SEARXNG_VENV);
    await writeManagedSearxngSettings();
    await fs.writeFile(
        manifestPath,
        `${JSON.stringify(managedSearxngManifest(SOURCE_RUNTIME_DIR), null, 2)}\n`,
        'utf8'
    );
    await runProcess(sourcePython, ['-c', 'import searx.webapp; print("searxng import ok")'], {
        env: {
            SEARXNG_SETTINGS_PATH: settingsPath,
            SEARXNG_PORT: String(MANAGED_SEARXNG_PORT),
            SEARXNG_BIND_ADDRESS: '127.0.0.1'
        },
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
    if (fsSync.existsSync(SOURCE_SEARXNG_VENV)) {
        await fs.cp(SOURCE_SEARXNG_VENV, OUTPUT_SEARXNG_VENV, {
            recursive: true,
            force: true,
            dereference: true
        });
    }
    if (fsSync.existsSync(SOURCE_SEARXNG_CONFIG_DIR)) {
        await fs.cp(SOURCE_SEARXNG_CONFIG_DIR, OUTPUT_SEARXNG_CONFIG_DIR, {
            recursive: true,
            force: true,
            dereference: true
        });
    }
    const searxngLicensePath = path.join(SOURCE_SEARXNG_SRC, 'LICENSE');
    if (fsSync.existsSync(searxngLicensePath)) {
        await fs.copyFile(searxngLicensePath, path.join(OUTPUT_RUNTIME_DIR, 'SEARXNG-LICENSE'));
    }

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
        searxngVenv: fsSync.existsSync(OUTPUT_SEARXNG_VENV) ? 'searxng-venv' : '',
        searxngConfig: fsSync.existsSync(OUTPUT_SEARXNG_CONFIG_DIR) ? 'searxng-config/settings.yml' : '',
        managedSearxng: fsSync.existsSync(OUTPUT_SEARXNG_VENV) ? 'managed-searxng.json' : '',
        python: pythonSource ? 'python' : '',
        playwrightBrowsers: hasPlaywrightChromiumCache(OUTPUT_PLAYWRIGHT_BROWSERS_DIR) ? 'ms-playwright' : '',
        uv: uvSource ? `uv/${executableName('uv')}` : '',
        notes: [
            'Packaged as an application-private runtime for Crawl4AI rendered web extraction and AILIS-managed local SearXNG search.',
            'Runtime lookup prefers process.resourcesPath/ailis-web-runtime before falling back to local developer caches.',
            'Do not require users to install Python, uv, pip, Playwright, Crawl4AI, or SearXNG manually.'
        ]
    };
    await fs.writeFile(path.join(OUTPUT_RUNTIME_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    if (fsSync.existsSync(OUTPUT_SEARXNG_VENV)) {
        await fs.writeFile(
            path.join(OUTPUT_RUNTIME_DIR, 'managed-searxng.json'),
            `${JSON.stringify(managedSearxngManifest(OUTPUT_RUNTIME_DIR), null, 2)}\n`,
            'utf8'
        );
    }
}

async function main() {
    const args = parseArgs();
    await fs.rm(OUTPUT_RUNTIME_DIR, { recursive: true, force: true });
    await ensureSourceRuntime(args);
    const uv = await ensureUv(args);
    await ensureSourceSearxngRuntime(args, uv);
    await copyRuntime();
    console.log(`[AILIS Web Runtime] Prepared ${OUTPUT_RUNTIME_DIR}`);
    console.log(`[AILIS Web Runtime] Crawl4AI Python: ${venvPythonPath(OUTPUT_CRAWL4AI_VENV)}`);
    console.log(`[AILIS Web Runtime] Managed SearXNG Python: ${venvPythonPath(OUTPUT_SEARXNG_VENV)}`);
}

main().catch((error) => {
    console.error('[AILIS Web Runtime] failed');
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
});
