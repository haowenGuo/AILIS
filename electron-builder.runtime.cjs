// Shared build-time allowlist, consumed by both desktop release variants.
const { desktopFiles, assertDesktopBuild } = require('./scripts/production-closure.cjs');
const { assertBundledAsr } = require('./scripts/bundled-asr-contract.cjs');
module.exports = {
    beforePack: async context => {
        assertDesktopBuild(context.packager.projectDir);
        if (context.packager.config.extraMetadata?.ailisBundledAsr) {
            await assertBundledAsr(context.packager.projectDir, context.electronPlatformName, context.arch);
        }
    },
    files: [
        'dist/**/*', ...desktopFiles(), 'package.json',
        '!**/*.map',
        '!node_modules/stockfish/bin/stockfish-*-asm.js',
        ...['stockfish-18', 'stockfish-18-single', 'stockfish-18-lite']
            .flatMap(name => [`!node_modules/stockfish/bin/${name}.js`, `!node_modules/stockfish/bin/${name}.wasm`]),
        // These declarations are compiler runtime data, not development-only
        // typings. The default node_modules filter removes all *.d.ts files.
        { from: 'node_modules/typescript/lib', to: 'node_modules/typescript/lib', filter: ['lib*.d.ts'] }
    ]
};
