const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function sha256(filePath) {
    return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function findRcedit(projectRoot) {
    const explicitPath = String(process.env.AILIS_RCEDIT_PATH || '').trim();
    const candidates = [
        explicitPath,
        path.join(
            projectRoot,
            'node_modules',
            'electron-winstaller',
            'vendor',
            'rcedit.exe'
        )
    ].filter(Boolean);

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    const pnpmRoot = path.join(projectRoot, 'node_modules', '.pnpm');
    if (!fs.existsSync(pnpmRoot)) {
        return '';
    }

    for (const entry of fs.readdirSync(pnpmRoot, { withFileTypes: true })) {
        if (!entry.isDirectory() || !entry.name.startsWith('electron-winstaller@')) {
            continue;
        }
        const candidate = path.join(
            pnpmRoot,
            entry.name,
            'node_modules',
            'electron-winstaller',
            'vendor',
            'rcedit.exe'
        );
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    return '';
}

function readStamp(stampPath) {
    try {
        return JSON.parse(fs.readFileSync(stampPath, 'utf8'));
    } catch {
        return null;
    }
}

function prepareWindowsDevElectronIcon() {
    if (process.platform !== 'win32') {
        return;
    }

    const projectRoot = path.resolve(__dirname, '..');
    const electronPath = require('electron');
    const iconPath = path.join(projectRoot, 'build', 'icon.ico');
    const stampPath = path.join(path.dirname(electronPath), '.ailis-dev-icon.json');
    const rceditPath = findRcedit(projectRoot);

    if (!fs.existsSync(electronPath)) {
        throw new Error(`[AILIS dev icon] Electron executable not found: ${electronPath}`);
    }
    if (!fs.existsSync(iconPath)) {
        throw new Error(`[AILIS dev icon] AILIS icon not found: ${iconPath}`);
    }
    if (!rceditPath) {
        throw new Error('[AILIS dev icon] rcedit.exe not found. Reinstall project dependencies.');
    }

    const iconHash = sha256(iconPath);
    const electronStat = fs.statSync(electronPath);
    const stamp = readStamp(stampPath);
    if (
        stamp?.iconHash === iconHash
        && stamp?.electronSize === electronStat.size
        && stamp?.electronMtimeMs === electronStat.mtimeMs
    ) {
        console.log('[AILIS dev icon] Current workspace Electron icon is ready.');
        return;
    }

    const result = spawnSync(
        rceditPath,
        [
            electronPath,
            '--set-icon',
            iconPath,
            '--set-version-string',
            'FileDescription',
            'AILIS Development Runtime',
            '--set-version-string',
            'ProductName',
            'AILIS',
            '--set-version-string',
            'InternalName',
            'AILIS',
            '--set-version-string',
            'OriginalFilename',
            'AILIS.exe'
        ],
        {
            cwd: projectRoot,
            encoding: 'utf8'
        }
    );

    if (result.status !== 0) {
        throw new Error([
            '[AILIS dev icon] Failed to update the workspace Electron icon.',
            'Close any running source-mode AILIS process and try again.',
            result.stdout,
            result.stderr
        ].filter(Boolean).join('\n'));
    }

    const updatedStat = fs.statSync(electronPath);
    fs.writeFileSync(stampPath, JSON.stringify({
        iconHash,
        electronSize: updatedStat.size,
        electronMtimeMs: updatedStat.mtimeMs
    }, null, 2));
    console.log(`[AILIS dev icon] Updated workspace Electron runtime: ${electronPath}`);
}

prepareWindowsDevElectronIcon();
