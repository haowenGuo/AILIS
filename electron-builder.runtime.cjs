// Shared build-time allowlist, consumed by both desktop release variants.
const { desktopFiles, assertDesktopBuild } = require('./scripts/production-closure.cjs');
module.exports = {
    beforePack: async context => assertDesktopBuild(context.packager.projectDir),
    files: [
        'dist/**/*', ...desktopFiles(), 'package.json',
        '!**/*.map',
        '!node_modules/stockfish/bin/stockfish-*-asm.js',
        ...['stockfish-18', 'stockfish-18-single', 'stockfish-18-lite']
            .flatMap(name => [`!node_modules/stockfish/bin/${name}.js`, `!node_modules/stockfish/bin/${name}.wasm`])
    ]
};
