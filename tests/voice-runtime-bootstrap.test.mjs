import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { VoiceRuntimeBootstrap, getVenvPythonPath } = require('../electron/voice-runtime-bootstrap.cjs');

let tempRoot;

beforeEach(() => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-voice-runtime-'));
});

afterEach(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
});

function createBootstrap(platform = 'win32') {
    return new VoiceRuntimeBootstrap({
        projectRoot: path.join(tempRoot, 'project'),
        userDataPath: path.join(tempRoot, 'user-data'),
        appDataPath: path.join(tempRoot, 'app-data'),
        platform
    });
}

function createSnapshot(bootstrap, overrides = {}) {
    const paths = bootstrap.getPaths();
    return {
        paths,
        selectedPython: null,
        cosyVoice3: {
            sourceExists: false,
            modelExists: false,
            acceleration: {
                cudaAvailable: false,
                onnxRuntimeProviders: []
            }
        },
        asr: {
            modelCached: false,
            modelId: 'openai/whisper-small'
        },
        ...overrides
    };
}

test('voice runtime plan installs private Python when no Python is available', () => {
    const bootstrap = createBootstrap();
    const plan = bootstrap.buildInstallPlan(createSnapshot(bootstrap));
    const ids = plan.steps.map((step) => step.id);

    assert.ok(ids.includes('install_portable_python'));
    assert.ok(ids.includes('install_voice_python_packages'));
    assert.ok(ids.includes('install_cosyvoice_source'));
    assert.ok(ids.includes('install_cosyvoice3_model'));
    assert.ok(ids.includes('install_asr_model'));
    assert.equal(plan.requiresNetwork, true);
    assert.equal(plan.steps.every((step) => step.mutatesSystem === false), true);
});

test('voice runtime still plans private venv when only system Python is selected', () => {
    const bootstrap = createBootstrap();
    const snapshot = createSnapshot(bootstrap, {
        selectedPython: {
            source: 'python',
            command: 'python',
            args: [],
            details: {
                has_pip: true,
                has_torch: true,
                has_torchaudio: true,
                has_transformers: true,
                onnxruntime_providers: []
            }
        },
        cosyVoice3: {
            sourceExists: true,
            modelExists: true,
            acceleration: {
                cudaAvailable: false,
                onnxRuntimeProviders: []
            }
        },
        asr: {
            modelCached: true,
            modelId: 'openai/whisper-small'
        }
    });
    const ids = bootstrap.buildInstallPlan(snapshot).steps.map((step) => step.id);

    assert.deepEqual(ids, ['install_portable_python']);
});

test('voice runtime plans ONNX GPU optimization when CUDA exists without CUDAExecutionProvider', () => {
    const bootstrap = createBootstrap();
    const snapshot = createSnapshot(bootstrap, {
        selectedPython: {
            source: 'voice-venv',
            command: getVenvPythonPath(bootstrap.getPaths().voiceVenv, 'win32'),
            args: [],
            details: {
                has_pip: true,
                has_torch: true,
                has_torchaudio: true,
                has_transformers: true,
                torch_cuda_available: true,
                onnxruntime_providers: ['CPUExecutionProvider']
            }
        },
        cosyVoice3: {
            sourceExists: true,
            modelExists: true,
            acceleration: {
                cudaAvailable: true,
                onnxRuntimeProviders: ['CPUExecutionProvider']
            }
        },
        asr: {
            modelCached: true,
            modelId: 'openai/whisper-small'
        }
    });
    fs.mkdirSync(path.dirname(snapshot.paths.voiceVenvPython), { recursive: true });
    fs.writeFileSync(snapshot.paths.voiceVenvPython, '');

    const ids = bootstrap.buildInstallPlan(snapshot).steps.map((step) => step.id);

    assert.deepEqual(ids, ['install_onnxruntime_gpu']);
});

test('voice runtime paths prefer project cache when present and local runtime otherwise', () => {
    const bootstrap = createBootstrap();
    const localPaths = bootstrap.getPaths();
    assert.equal(localPaths.cosyVoiceRoot, localPaths.localCosyVoiceRoot);

    fs.mkdirSync(localPaths.projectCosyVoiceRoot, { recursive: true });
    const projectPaths = bootstrap.getPaths();

    assert.equal(projectPaths.cosyVoiceRoot, projectPaths.projectCosyVoiceRoot);
    assert.match(projectPaths.voiceVenvPython, /local-runtimes/);
});

test('voice runtime cached summary is explicit before diagnosis', () => {
    const bootstrap = createBootstrap();

    assert.deepEqual(bootstrap.getCachedSummary(), {
        ok: false,
        status: 'not_diagnosed',
        message: '本地语音运行时尚未诊断。'
    });
});

test('voice runtime fast summary avoids full Python probing before diagnosis', () => {
    const bootstrap = createBootstrap();
    const summary = bootstrap.getFastSummary();

    assert.equal(summary.fast, true);
    assert.equal(summary.status, 'needs_setup');
    assert.ok(summary.installPlan.steps.some((step) => step.id === 'install_portable_python'));
});
