import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const workspaceRoot = fileURLToPath(new URL('.', import.meta.url));
const buildRevision = (() => {
    const explicitRevision = String(process.env.AILIS_BUILD_REVISION || '').trim();
    if (explicitRevision) {
        return explicitRevision;
    }

    try {
        return execFileSync('git', ['rev-parse', '--short=12', 'HEAD'], {
            cwd: workspaceRoot,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore']
        }).trim();
    } catch {
        return `build-${Date.now().toString(36)}`;
    }
})();

export default defineConfig({
    base: './',
    define: {
        __AILIS_BUILD_REVISION__: JSON.stringify(buildRevision)
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        watch: {
            ignored: [
                '**/.ailis-runtime/**',
                '**/.ailis-state/**',
                '**/.humanclaw-state/**',
                '**/.local/**',
                '**/build-cache/**',
                '**/models/**',
                '**/node_modules/**',
                '**/release/**',
                '**/logs/**',
                '**/eval-results/**',
                '**/references/**',
                '**/vendor/**',
                '**/android/**'
            ]
        }
    },
    build: {
        rollupOptions: {
            input: {
                agentLab: resolve(workspaceRoot, 'agent-lab.html'),
                control: resolve(workspaceRoot, 'control.html'),
                index: resolve(workspaceRoot, 'index.html'),
                pet: resolve(workspaceRoot, 'pet.html'),
                chat: resolve(workspaceRoot, 'chat.html'),
                test: resolve(workspaceRoot, 'Test/index.html'),
                visionRegion: resolve(workspaceRoot, 'vision-region.html')
            }
        }
    }
});
