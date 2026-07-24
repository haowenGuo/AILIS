import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function toWslPath(windowsPath) {
    const normalized = windowsPath.replace(/\\/g, '/');
    const match = normalized.match(/^([A-Za-z]):\/(.*)$/);
    if (!match) {
        throw new Error(`Cannot convert path to WSL form: ${windowsPath}`);
    }
    return `/mnt/${match[1].toLowerCase()}/${match[2]}`;
}

function shellQuote(value) {
    return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

const scriptArg = process.argv[2];
if (!scriptArg) {
    console.error('Usage: node scripts/run-wsl-repo-script.mjs <script> [args...]');
    process.exit(2);
}

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const windowsRepoRoot = repoRoot;
const wslRepoRoot = toWslPath(windowsRepoRoot);
const wslScript = `${wslRepoRoot}/${scriptArg.replace(/\\/g, '/').replace(/^\.?\//, '')}`;
const extraArgs = process.argv.slice(3).map(shellQuote).join(' ');
const command = `AILIS_ROOT=${shellQuote(wslRepoRoot)} bash ${shellQuote(wslScript)}${extraArgs ? ` ${extraArgs}` : ''}`;

const result = spawnSync('wsl', ['-d', 'Ubuntu-22.04', '--', 'bash', '-lc', command], {
    stdio: 'inherit',
    cwd: windowsRepoRoot
});

process.exit(result.status ?? 1);
