import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import productVariantModule from '../electron/ailis-product-variant.cjs';
import rendererRuntimeModule from '../electron/ailis-character-renderer-runtime.cjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const {
    normalizeProductCharacterRendererBackend,
    resolveProductVariant
} = productVariantModule;
const { AILISCharacterRendererRuntime } = rendererRuntimeModule;

test('AILIS and AIGAME expose separate renderer capabilities', () => {
    const ailis = resolveProductVariant({ variantId: 'ailis', packageMetadata: {} });
    const aigame = resolveProductVariant({ variantId: 'aigame', packageMetadata: {} });

    assert.deepEqual(ailis.characterRendererBackends, ['electron']);
    assert.equal(ailis.features.unityCharacterRenderer, false);
    assert.equal(normalizeProductCharacterRendererBackend('unity', ailis), 'electron');

    assert.deepEqual(aigame.characterRendererBackends, ['unity', 'electron']);
    assert.equal(aigame.features.unityCharacterRenderer, true);
    assert.equal(normalizeProductCharacterRendererBackend('unity', aigame), 'unity');
});

test('disabled Unity runtime cannot discover or launch a local Unity build', async () => {
    const runtime = new AILISCharacterRendererRuntime({
        enabled: false,
        projectRoot,
        resourcesPath: path.join(projectRoot, 'unity-character-demo', 'Build', 'Windows'),
        platform: 'win32'
    });

    assert.equal(runtime.resolveUnityExecutable(), '');
    const status = await runtime.activate('unity');
    assert.equal(status.featureEnabled, false);
    assert.equal(status.effectiveBackend, 'electron');
    assert.equal(status.status, 'fallback');
});

test('release manifests keep Unity out of AILIS and bundle it only in AIGAME', () => {
    const runtimeManifest = JSON.parse(fs.readFileSync(
        path.join(projectRoot, 'installer', 'ailis-runtime-components.json'),
        'utf8'
    ));
    const mainBuilder = fs.readFileSync(path.join(projectRoot, 'electron-builder.yml'), 'utf8');
    const aigameBuilder = fs.readFileSync(path.join(projectRoot, 'electron-builder.aigame.yml'), 'utf8');

    assert.equal(runtimeManifest.components.some((item) => item.id === 'unity-character-renderer'), false);
    assert.match(mainBuilder, /ailisProductVariant:\s*ailis/);
    assert.doesNotMatch(mainBuilder, /character-renderers\/unity/);
    assert.match(aigameBuilder, /ailisProductVariant:\s*aigame/);
    assert.match(aigameBuilder, /from:\s*unity-character-demo\/Build\/Windows/);
    assert.match(aigameBuilder, /to:\s*character-renderers\/unity/);
});
