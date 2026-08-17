const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function normalizeString(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function findFirstExisting(paths) {
    return paths.find((candidate) => candidate && fs.existsSync(candidate)) || '';
}

function sleepSync(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function runRceditWithRetry(rceditPath, args, options) {
    let lastResult = null;
    for (let attempt = 1; attempt <= 5; attempt += 1) {
        lastResult = spawnSync(rceditPath, args, options);
        if (lastResult.status === 0) {
            return lastResult;
        }
        const output = `${lastResult.stdout || ''}\n${lastResult.stderr || ''}`;
        if (!/Unable to commit changes|being used by another process|access is denied|EPERM|EBUSY/i.test(output)) {
            return lastResult;
        }
        sleepSync(350 * attempt);
    }
    return lastResult;
}

function findRcedit(projectRoot) {
    const explicit = normalizeString(process.env.AILIS_RCEDIT_PATH);
    if (explicit && fs.existsSync(explicit)) {
        return explicit;
    }

    const directDependency = path.join(
        projectRoot,
        'node_modules',
        'rcedit',
        'bin',
        process.arch === 'arm64' ? 'rcedit-arm64.exe' : 'rcedit-x64.exe'
    );
    if (fs.existsSync(directDependency)) {
        return directDependency;
    }

    const bundled = path.join(
        projectRoot,
        'node_modules',
        'electron-winstaller',
        'vendor',
        'rcedit.exe'
    );
    if (fs.existsSync(bundled)) {
        return bundled;
    }

    const pnpmVendorRoot = path.join(projectRoot, 'node_modules', '.pnpm');
    if (fs.existsSync(pnpmVendorRoot)) {
        const stack = [pnpmVendorRoot];
        while (stack.length) {
            const current = stack.pop();
            for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
                const fullPath = path.join(current, entry.name);
                if (entry.isDirectory()) {
                    if (entry.name === 'node_modules' || entry.name.startsWith('electron-winstaller@')) {
                        stack.push(fullPath);
                    }
                    continue;
                }
                if (/^rcedit(?:-x64)?\.exe$/i.test(entry.name) && fullPath.includes('electron-winstaller')) {
                    return fullPath;
                }
            }
        }
    }

    const electronBuilderCache = path.join(
        process.env.LOCALAPPDATA || '',
        'electron-builder',
        'Cache',
        'winCodeSign'
    );
    if (electronBuilderCache && fs.existsSync(electronBuilderCache)) {
        const stack = [electronBuilderCache];
        while (stack.length) {
            const current = stack.pop();
            for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
                const fullPath = path.join(current, entry.name);
                if (entry.isDirectory()) {
                    stack.push(fullPath);
                    continue;
                }
                if (/^rcedit-x64\.exe$/i.test(entry.name)) {
                    return fullPath;
                }
            }
        }
    }

    return '';
}

function findAppBuilder(projectRoot) {
    const explicit = normalizeString(process.env.AILIS_APP_BUILDER_PATH);
    if (explicit && fs.existsSync(explicit)) {
        return explicit;
    }
    const pnpmRoot = path.join(projectRoot, 'node_modules', '.pnpm');
    if (!fs.existsSync(pnpmRoot)) {
        return '';
    }
    for (const entry of fs.readdirSync(pnpmRoot, { withFileTypes: true })) {
        if (!entry.isDirectory() || !entry.name.startsWith('app-builder-bin@')) {
            continue;
        }
        const candidate = path.join(
            pnpmRoot,
            entry.name,
            'node_modules',
            'app-builder-bin',
            'win',
            process.arch === 'arm64' ? 'arm64' : 'x64',
            'app-builder.exe'
        );
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }
    return '';
}

function resolveAppExe(context, projectRoot) {
    const appOutDir = normalizeString(context?.appOutDir);
    const candidates = [
        context?.packager?.appInfo?.productFilename,
        context?.packager?.appInfo?.productName,
        'AILIS'
    ]
        .map((name) => normalizeString(name))
        .filter(Boolean)
        .map((name) => path.join(appOutDir, `${name}.exe`));

    candidates.push(path.resolve('F:/AILIS/Build/AILIS/win-unpacked/AILIS.exe'));
    return findFirstExisting(candidates);
}

function fixWindowsExeIcon(context = {}) {
    const projectRoot = path.resolve(__dirname, '..');
    const platformName = normalizeString(context?.electronPlatformName, process.platform);
    if (platformName !== 'win32' && process.platform !== 'win32') {
        return;
    }

    const exePath = resolveAppExe(context, projectRoot);
    const iconPath = path.join(projectRoot, 'build', 'icon.ico');
    const rceditPath = findRcedit(projectRoot);
    const appBuilderPath = rceditPath ? '' : findAppBuilder(projectRoot);
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
    const appVersion = normalizeString(context?.packager?.appInfo?.version, packageJson.version || '0.0.0');

    if (!exePath) {
        throw new Error('[AILIS icon] Windows exe not found after packaging.');
    }
    if (!fs.existsSync(iconPath)) {
        throw new Error(`[AILIS icon] Icon file not found: ${iconPath}`);
    }
    if (!rceditPath && !appBuilderPath) {
        throw new Error('[AILIS icon] Neither rcedit.exe nor the installed app-builder rcedit wrapper was found.');
    }

    try {
        fs.chmodSync(exePath, 0o666);
    } catch {
        // Best effort only; rcedit will report the real failure if the file remains locked.
    }

    const rceditArgs = [
        exePath,
        '--set-icon',
        iconPath,
        '--set-version-string',
        'FileDescription',
        'AILIS',
        '--set-version-string',
        'ProductName',
        'AILIS',
        '--set-version-string',
        'ProductVersion',
        appVersion,
        '--set-file-version',
        appVersion,
        '--set-product-version',
        appVersion,
        '--set-version-string',
        'InternalName',
        'AILIS',
        '--set-version-string',
        'OriginalFilename',
        'AILIS.exe'
    ];
    const toolPath = rceditPath || appBuilderPath;
    const toolArgs = rceditPath
        ? rceditArgs
        : ['rcedit', '--args', JSON.stringify(rceditArgs)];
    const result = runRceditWithRetry(toolPath, toolArgs, {
        cwd: projectRoot,
        encoding: 'utf8'
    });

    if (result.status !== 0) {
        throw new Error([
            '[AILIS icon] Failed to write Windows exe icon.',
            `tool=${toolPath}`,
            `exe=${exePath}`,
            result.stdout,
            result.stderr
        ].filter(Boolean).join('\n'));
    }

    console.log(`[AILIS icon] Windows exe icon written: ${exePath}`);
}

module.exports = fixWindowsExeIcon;

if (require.main === module) {
    fixWindowsExeIcon({
        electronPlatformName: process.platform,
        appOutDir: process.argv[2] || path.join('F:', 'AILIS', 'Build', 'AILIS', 'win-unpacked')
    });
}
