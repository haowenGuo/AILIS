import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(__filename), '..');

function run(command, args = [], options = {}) {
    const result = spawnSync(command, args, {
        cwd: projectRoot,
        encoding: 'utf8',
        windowsHide: true,
        timeout: options.timeout ?? 15000,
        input: options.input
    });
    return {
        ok: result.status === 0,
        status: result.status,
        stdout: (result.stdout || '').trim(),
        stderr: (result.stderr || '').trim(),
        error: result.error?.message || ''
    };
}

async function exists(targetPath) {
    try {
        await fs.access(targetPath);
        return true;
    } catch {
        return false;
    }
}

async function findFiles(rootDirs = [], extensions = new Set(), limit = 20000) {
    const results = [];
    const queue = [];
    for (const root of rootDirs) {
        const absolute = path.resolve(projectRoot, root);
        if (await exists(absolute)) {
            queue.push(absolute);
        }
    }
    let seen = 0;
    while (queue.length && seen < limit) {
        const current = queue.shift();
        let entries = [];
        try {
            entries = await fs.readdir(current, { withFileTypes: true });
        } catch {
            continue;
        }
        for (const entry of entries) {
            seen += 1;
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                queue.push(fullPath);
            } else if (extensions.has(path.extname(entry.name).toLowerCase())) {
                const stat = await fs.stat(fullPath).catch(() => null);
                results.push({
                    path: fullPath,
                    size: stat?.size || 0
                });
            }
            if (seen >= limit) {
                break;
            }
        }
    }
    return results;
}

function findExecutable(name, envKeys = []) {
    for (const key of envKeys) {
        const value = process.env[key];
        if (value) {
            return { path: value, source: key };
        }
    }
    const lookup = process.platform === 'win32'
        ? run('where.exe', [name], { timeout: 5000 })
        : run('which', [name], { timeout: 5000 });
    if (lookup.ok && lookup.stdout) {
        return { path: lookup.stdout.split(/\r?\n/)[0], source: 'PATH' };
    }
    const sdkRoots = [
        process.env.ANDROID_HOME,
        process.env.ANDROID_SDK_ROOT,
        path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk'),
        'C:\\Android\\Sdk',
        'F:\\Android\\Sdk'
    ].filter(Boolean);
    for (const root of sdkRoots) {
        const candidate = path.join(root, 'platform-tools', process.platform === 'win32' ? `${name}.exe` : name);
        try {
            fsSync.accessSync(candidate);
            return { path: candidate, source: 'sdk-common-path' };
        } catch {}
    }
    return null;
}

function parseDevices(text = '') {
    return text
        .split(/\r?\n/)
        .slice(1)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [serial, state = '', ...rest] = line.split(/\s+/);
            return { serial, state, detail: rest.join(' ') };
        });
}

async function main() {
    const packageText = await fs.readFile(path.join(projectRoot, 'package.json'), 'utf8');
    const packageJson = JSON.parse(packageText);
    const androidProjectFiles = [
        'android',
        'capacitor.config.ts',
        'capacitor.config.js',
        'capacitor.config.json',
        'cordova',
        'gradlew',
        'build.gradle',
        'settings.gradle'
    ];
    const androidProjectHits = [];
    for (const entry of androidProjectFiles) {
        if (await exists(path.join(projectRoot, entry))) {
            androidProjectHits.push(entry);
        }
    }
    const installableArtifacts = await findFiles(['dist', 'release', 'build-cache'], new Set(['.apk', '.aab']));
    const adb = findExecutable('adb', ['HUMANCLAW_ANDROID_ADB', 'ANDROID_ADB', 'ADB']);
    const checks = {
        projectRoot,
        package: {
            name: packageJson.name,
            version: packageJson.version,
            hasAndroidBuildScript: Object.entries(packageJson.scripts || {}).some(([key, value]) => {
                const scriptText = `${key} ${value}`;
                return /(android:(build|package|assemble|install)|\b(apk|aab|gradle|capacitor)\b)/i.test(scriptText) &&
                    !/(doctor|test|readiness|smoke)/i.test(key);
            })
        },
        androidProject: {
            available: androidProjectHits.length > 0,
            hits: androidProjectHits
        },
        installableArtifacts: {
            available: installableArtifacts.length > 0,
            files: installableArtifacts
        },
        adb: {
            available: Boolean(adb),
            path: adb?.path || '',
            source: adb?.source || ''
        },
        device: {
            available: false,
            devices: []
        },
        basicRuntime: {
            shell: 'not-run',
            screenshot: 'not-run',
            input: 'skipped-by-default'
        }
    };

    if (adb) {
        checks.adb.version = run(adb.path, ['version'], { timeout: 10000 }).stdout;
        const devicesResult = run(adb.path, ['devices', '-l'], { timeout: 10000 });
        checks.device.devices = parseDevices(devicesResult.stdout);
        const online = checks.device.devices.find((device) => device.state === 'device');
        checks.device.available = Boolean(online);
        if (online) {
            const model = run(adb.path, ['shell', 'getprop', 'ro.product.model'], { timeout: 10000 }).stdout;
            const androidVersion = run(adb.path, ['shell', 'getprop', 'ro.build.version.release'], { timeout: 10000 }).stdout;
            const size = run(adb.path, ['shell', 'wm', 'size'], { timeout: 10000 }).stdout;
            const shell = run(adb.path, ['shell', 'echo', 'AIGL_ANDROID_OK'], { timeout: 10000 });
            checks.device.active = {
                serial: online.serial,
                model,
                androidVersion,
                size
            };
            checks.basicRuntime.shell = shell.ok && shell.stdout.includes('AIGL_ANDROID_OK') ? 'ok' : 'failed';

            const remotePath = `/sdcard/aigl-android-doctor-${Date.now()}.png`;
            const localPath = path.join(os.tmpdir(), `aigl-android-doctor-${Date.now()}.png`);
            const capture = run(adb.path, ['shell', 'screencap', '-p', remotePath], { timeout: 15000 });
            const pull = capture.ok ? run(adb.path, ['pull', remotePath, localPath], { timeout: 15000 }) : { ok: false };
            run(adb.path, ['shell', 'rm', '-f', remotePath], { timeout: 5000 });
            const stat = pull.ok ? await fs.stat(localPath).catch(() => null) : null;
            checks.basicRuntime.screenshot = stat?.size > 0 ? 'ok' : 'failed';
            checks.basicRuntime.screenshotPath = stat?.size > 0 ? localPath : '';
            checks.basicRuntime.screenshotBytes = stat?.size || 0;

            if (process.argv.includes('--input')) {
                const input = run(adb.path, ['shell', 'input', 'keyevent', '3'], { timeout: 10000 });
                checks.basicRuntime.input = input.ok ? 'ok-home-keyevent' : 'failed';
            }
        }
    }

    const canInstallAiglNativeApp = checks.installableArtifacts.available && checks.device.available;
    const canControlAndroidViaAdb = checks.adb.available && checks.device.available && checks.basicRuntime.shell === 'ok';
    console.log(JSON.stringify({
        ok: canInstallAiglNativeApp || canControlAndroidViaAdb,
        canInstallAiglNativeApp,
        canControlAndroidViaAdb,
        checks
    }, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
