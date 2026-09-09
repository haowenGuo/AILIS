'use strict';
function shellArgsForExecutable(executable, command, { login = true } = {}) {
    if (!String(command || '').trim()) return [];
    const name = String(executable).split(/[\\/]/).pop().toLowerCase();
    if (name === 'cmd' || name === 'cmd.exe') return ['/d', '/s', '/c', command];
    if (['powershell', 'powershell.exe', 'pwsh', 'pwsh.exe'].includes(name)) {
        return ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', command];
    }
    return [login === false ? '-c' : '-lc', command];
}
module.exports = { shellArgsForExecutable };
