const fs = require('node:fs');
const path = require('node:path');
const { DesktopASRManager } = require('../electron/local-asr-manager.cjs');
const { VoiceRuntimeBootstrap } = require('../electron/voice-runtime-bootstrap.cjs');

// Explicit WAV fixtures only: never access the microphone or download a model.
async function main() {
    const [runtimeRoot, ...wavPaths] = process.argv.slice(2);
    if (!runtimeRoot || !wavPaths.length) {
        throw new Error('Usage: node scripts/verify-desktop-asr.cjs <voice-runtime-root> <wav> [wav...]');
    }
    const projectRoot = path.resolve(__dirname, '..');
    const app = { isPackaged: false, getPath: () => path.resolve(runtimeRoot) };
    const runtime = new VoiceRuntimeBootstrap({
        projectRoot, runtimeRoot: path.resolve(runtimeRoot),
        userDataPath: path.resolve(runtimeRoot), appDataPath: path.resolve(runtimeRoot),
        platform: process.platform
    });
    const manager = new DesktopASRManager({ app, getRuntimePaths: () => runtime.getPaths() });
    const started = Date.now();
    try {
        const warmup = await manager.warmup();
        console.log(JSON.stringify({ phase: 'warmup', seconds: (Date.now() - started) / 1000, result: warmup }));
        for (const file of wavPaths) {
            const result = await manager.transcribeAudioBytes({ audioBytes: fs.readFileSync(file), preset: 'fast' });
            console.log(JSON.stringify({ phase: 'transcribe', file: path.resolve(file), ...result }));
            if (!result.text) throw new Error(`No speech recognized in fixture: ${file}`);
        }
    } finally {
        manager.close();
    }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
