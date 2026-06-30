const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function normalizeString(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function findFirstExisting(paths) {
    return paths.find((candidate) => candidate && fs.existsSync(candidate)) || '';
}

function findRcedit(projectRoot) {
    const explicit = normalizeString(process.env.AILIS_RCEDIT_PATH);
    if (explicit && fs.existsSync(explicit)) {
        return explicit;
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

    if (!exePath) {
        throw new Error('[AILIS icon] Windows exe not found after packaging.');
    }
    if (!fs.existsSync(iconPath)) {
        throw new Error(`[AILIS icon] Icon file not found: ${iconPath}`);
    }
    if (!rceditPath) {
        throw new Error('[AILIS icon] rcedit.exe not found. Install dependencies or set AILIS_RCEDIT_PATH.');
    }

    const result = spawnSync(rceditPath, [
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
        'InternalName',
        'AILIS',
        '--set-version-string',
        'OriginalFilename',
        'AILIS.exe'
    ], {
        cwd: projectRoot,
        encoding: 'utf8'
    });

    if (result.status !== 0) {
        throw new Error([
            '[AILIS icon] Failed to write Windows exe icon.',
            `rcedit=${rceditPath}`,
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
