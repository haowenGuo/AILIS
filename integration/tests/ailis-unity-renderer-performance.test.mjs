import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import runtimeModule from '../electron/ailis-character-renderer-runtime.cjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readSource = (...segments) => fs.readFileSync(path.join(projectRoot, ...segments), 'utf8');

test('Unity hit-test mask uses asynchronous GPU readback with a compatibility fallback', () => {
    const source = readSource(
        'unity-character-demo',
        'Assets',
        'AILIS',
        'Runtime',
        'AilisAvatarHitTestMask.cs'
    );

    assert.match(source, /SystemInfo\.supportsAsyncGPUReadback/);
    assert.match(source, /AsyncGPUReadback\.Request\(/);
    assert.match(source, /HandleAsyncReadback/);
    assert.match(source, /RenderAndRequestAsyncReadback/);
    assert.match(source, /_captureCamera\.enabled = !SystemInfo\.supportsAsyncGPUReadback/);
    assert.match(source, /yield return new WaitForEndOfFrame\(\)/);
    assert.match(source, /TryCaptureSynchronously/);
});

test('Unity supersampling does not stack redundant multisample antialiasing', () => {
    const source = readSource(
        'unity-character-demo',
        'Assets',
        'AILIS',
        'Runtime',
        'AilisRenderDirector.cs'
    );

    assert.match(source, /effectiveRenderScale >= 1\.5f/);
    assert.doesNotMatch(source, /Mathf\.Max\(4, settings\.msaaSampleCount\)/);
});

test('legacy 30 FPS Unity performance profile migrates once to smooth 60 FPS', () => {
    const runtime = new runtimeModule.AILISCharacterRendererRuntime({ projectRoot });
    const configuration = runtime.createConfiguration({
        preferences: {
            unityRenderer: {
                pipelineAsset: 'performance',
                targetFrameRate: 30,
                renderScale: 0.85,
                msaaSampleCount: 2
            }
        }
    });

    assert.equal(configuration.schema, 'ailis.character-renderer-settings.v4');
    assert.equal(configuration.performanceTuningVersion, 2);
    assert.equal(configuration.targetFrameRate, 60);
});

test('explicit current-version frame-rate choices remain user controlled', () => {
    const runtime = new runtimeModule.AILISCharacterRendererRuntime({ projectRoot });
    const configuration = runtime.createConfiguration({
        preferences: {
            unityRenderer: {
                performanceTuningVersion: 2,
                pipelineAsset: 'performance',
                targetFrameRate: 30,
                renderScale: 0.85,
                msaaSampleCount: 2
            }
        }
    });

    assert.equal(configuration.targetFrameRate, 30);
});
