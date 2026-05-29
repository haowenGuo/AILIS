import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const workspaceRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    base: './',
    server: {
        host: '0.0.0.0',
        port: 5173
    },
    build: {
        rollupOptions: {
            input: {
                control: resolve(workspaceRoot, 'control.html'),
                index: resolve(workspaceRoot, 'index.html'),
                pet: resolve(workspaceRoot, 'pet.html'),
                chat: resolve(workspaceRoot, 'chat.html'),
                visionRegion: resolve(workspaceRoot, 'vision-region.html')
            }
        }
    }
});
