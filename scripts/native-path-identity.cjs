const fs = require('node:fs');

// Resolve aliases before comparing; do not fold case on case-sensitive systems.
function sameExecutable(actual, expected) {
    const canonical = value => {
        const resolved = fs.realpathSync.native(value);
        return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
    };
    return canonical(actual) === canonical(expected);
}
module.exports = { sameExecutable };
