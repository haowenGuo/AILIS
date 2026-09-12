// Shared build-time allowlist, consumed by both desktop release variants.
const { desktopFiles, assertDesktopBuild } = require('./scripts/production-closure.cjs');
const { assertBundledAsr } = require('./scripts/bundled-asr-contract.cjs');
module.exports = {
    afterPack: async context => {
        if (context.electronPlatformName !== 'darwin') return;
        const fs = require('node:fs/promises');
        const path = require('node:path');
        const app = path.join(context.appOutDir, 'AILIS.app');
        const framework = path.join(app, 'Contents/Frameworks/Electron Framework.framework');
        const rows = [];
        async function scan(dir, depth) {
            for (const entry of await fs.readdir(dir, {withFileTypes:true})) {
                const file = path.join(dir, entry.name);
                const stat = await fs.lstat(file);
                rows.push({path:path.relative(app,file),bytes:stat.size,symlink:stat.isSymbolicLink(),
                    target:stat.isSymbolicLink()?await fs.readlink(file):null});
                if (entry.isDirectory() && depth > 0) await scan(file, depth-1);
            }
        }
        await scan(framework, 2);
        const output = path.join(context.packager.projectDir, 'release/evidence', `darwin-${process.arch}`);
        await fs.mkdir(output,{recursive:true});
        await fs.writeFile(path.join(output,'framework-before-sign.json'),JSON.stringify(rows,null,2));
    },
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
