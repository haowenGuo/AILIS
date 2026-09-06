import { createRequire } from 'node:module';
const { readManifest } = createRequire(import.meta.url)('./scripts/production-closure.cjs');
const manifest = readManifest();
// No auto-fix: a public export or unobserved feature is not automatically dead.
export default {
    entry: [...manifest.profiles.desktop.entries, 'electron/preload.cjs', 'electron/ailis-code-mode-worker.cjs',
        'scripts/mcp-ailis-research-server.cjs', 'src/agent-lab-app.js', 'src/chat-panel-app.js',
        'src/control-panel-app.js', 'src/pet-app.js', 'src/vision-region-selector.js'].map(file => file + '!'),
    project: ['electron/**/*.cjs!', 'src/**/*.js!', 'scripts/mcp-ailis-research-server.cjs!', 'scripts/ailis-stockfish-engine.cjs!'],
    vite: false
};
