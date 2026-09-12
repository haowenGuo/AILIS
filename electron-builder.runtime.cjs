// Shared build-time allowlist, consumed by both desktop release variants.
const { desktopFiles, assertDesktopBuild } = require('./scripts/production-closure.cjs');
const { assertBundledAsr } = require('./scripts/bundled-asr-contract.cjs');
module.exports = {
    afterPack: async context => {
        await require('./scripts/fix-windows-exe-icon.cjs')(context);
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
        // Ignored signing aliases must be actual symlinks, never unsigned real
        // payloads. Their targets remain under Versions/A and are still signed.
        const physicalFramework = await fs.realpath(framework);
        for (const alias of ['Electron Framework','Helpers','Libraries','Resources','Versions/Current']) {
            const file = path.join(framework,alias);
            let stat;
            try { stat = await fs.lstat(file); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
            if (!stat.isSymbolicLink()) throw new Error(`Expected framework signing alias to be a symlink: ${alias}`);
            const target = await fs.realpath(file);
            if (!target.startsWith(physicalFramework + path.sep)) throw new Error(`Framework alias escapes bundle: ${alias}`);
        }
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
