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

function writeFile(filePath, content = '') {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
}

function createCosyVoiceSource(paths) {
    writeFile(path.join(paths.cosyVoiceRoot, 'cosyvoice', 'cli', 'cosyvoice.py'));
    writeFile(path.join(paths.cosyVoiceRoot, 'third_party', 'Matcha-TTS', 'matcha', '__init__.py'));
    writeFile(path.join(paths.cosyVoiceRoot, 'asset', 'zero_shot_prompt.wav'));
}

function createCosyVoice3Model(paths) {
    const files = [
        'cosyvoice3.yaml',
        'llm.pt',
        'flow.pt',
        'hift.pt',
        'campplus.onnx',
        'speech_tokenizer_v3.batch.onnx',
        'CosyVoice-BlankEN/model.safetensors',
        'CosyVoice-BlankEN/tokenizer_config.json'
    ];
    for (const file of files) {
        writeFile(path.join(paths.cosyVoice3ModelDir, ...file.split('/')), 'ok');
    }
}

function createAsrSnapshot(paths, modelId = 'openai/whisper-small') {
    const repoDir = `models--${modelId.replace(/[\\/]/g, '--')}`;
    const snapshotDir = path.join(paths.asrCacheDir, repoDir, 'snapshots', 'test-snapshot');
    const files = [
        'config.json',
        'preprocessor_config.json',
        'tokenizer.json',
        'model.safetensors'
    ];
    for (const file of files) {
        writeFile(path.join(snapshotDir, file), 'ok');
    }
    return snapshotDir;
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

test('voice runtime creates private venv from selected system Python without Python download', () => {
    const bootstrap = createBootstrap();
    const snapshot = createSnapshot(bootstrap, {
        selectedPython: {
            source: 'python',
            command: 'python',
            args: [],
            details: {
                has_pip: true,
                has_venv: true,
                has_torch: true,
                has_torchaudio: true,
                has_transformers: true,
                has_huggingface_hub: true,
                version_info: [3, 12, 7],
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
    const plan = bootstrap.buildInstallPlan(snapshot);
    const ids = plan.steps.map((step) => step.id);
    const pythonStep = plan.steps.find((step) => step.id === 'install_portable_python');

    assert.deepEqual(ids, ['install_portable_python', 'install_voice_python_packages']);
    assert.equal(pythonStep.title, '创建 AILIS 私有 Python venv');
    assert.equal(pythonStep.requiresNetwork, false);
    assert.equal(pythonStep.command.tool, 'python');
    assert.deepEqual(pythonStep.command.args.slice(-4), ['-m', 'venv', '--clear', snapshot.paths.voiceVenv]);
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
                has_huggingface_hub: true,
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

    assert.deepEqual(ids, ['verify_cosyvoice3_runtime', 'install_onnxruntime_gpu', 'verify_asr_runtime']);
    assert.equal(bootstrap.buildInstallPlan(snapshot).steps.find((step) => step.id === 'verify_asr_runtime').optional, true);
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

test('voice runtime fast summary detects packaged ASR runtime independently from TTS runtime', () => {
    const bootstrap = createBootstrap();
    const runtimeRoot = path.join(tempRoot, 'project', 'build-cache', 'ailis-asr-runtime');
    fs.mkdirSync(runtimeRoot, { recursive: true });
    const paths = bootstrap.getPaths();
    fs.mkdirSync(path.dirname(paths.packagedAsrVenvPython), { recursive: true });
    fs.writeFileSync(paths.packagedAsrVenvPython, '');
    createAsrSnapshot({
        ...paths,
        asrCacheDir: path.join(paths.packagedAsrCacheDir, 'hub')
    });
    fs.writeFileSync(path.join(paths.packagedAsrRuntimeRoot, 'manifest.json'), JSON.stringify({
        asrVenv: 'asr-venv',
        asrPython: path.relative(paths.packagedAsrRuntimeRoot, paths.packagedAsrVenvPython).replace(/\\/g, '/'),
        asrCache: 'asr-cache',
        asrDependenciesReady: true,
        dependencies: {
            numpy: true,
            torch: true,
            transformers: true
        }
    }), 'utf8');

    const summary = bootstrap.getFastSummary();

    assert.equal(summary.asr.ok, false);
    assert.equal(summary.asr.modelCached, true);
    assert.equal(summary.preferredAsrPython, paths.packagedAsrVenvPython);
    assert.equal(summary.preferredPython, '');
    assert.equal(summary.cosyVoice3.ok, false);
});

test('voice runtime v2 does not treat partial CosyVoice3 model directory as installed', () => {
    const bootstrap = createBootstrap();
    const paths = bootstrap.getPaths();
    createCosyVoiceSource(paths);
    writeFile(path.join(paths.cosyVoice3ModelDir, 'cosyvoice3.yaml'), 'ok');
    writeFile(path.join(paths.cosyVoice3ModelDir, '.cache', 'huggingface', 'download', 'llm.pt.incomplete'), 'partial');
    writeFile(paths.voiceVenvPython, '');

    const summary = bootstrap.getFastSummary();
    const ids = summary.installPlan.steps.map((step) => step.id);

    assert.equal(summary.cosyVoice3.modelDirExists, true);
    assert.equal(summary.cosyVoice3.modelExists, false);
    assert.ok(ids.includes('install_cosyvoice3_model'));
    assert.ok(!ids.includes('verify_cosyvoice3_runtime'));
});

test('voice runtime v2 treats ASR as optional when TTS is verified', () => {
    const bootstrap = createBootstrap();
    const paths = bootstrap.getPaths();
    createCosyVoiceSource(paths);
    createCosyVoice3Model(paths);
    writeFile(paths.voiceVenvPython, '');
    fs.mkdirSync(path.dirname(paths.manifestPath), { recursive: true });
    fs.writeFileSync(paths.manifestPath, JSON.stringify({
        schema: 'ailis.voiceRuntimeManifest',
        installerVersion: 2,
        runtimeRoot: paths.localRuntimeRoot,
        components: {
            cosyvoice3_smoke: {
                status: 'verified',
                modelDir: paths.cosyVoice3ModelDir,
                sourceDir: paths.cosyVoiceRoot
            }
        }
    }), 'utf8');

    const summary = bootstrap.getFastSummary();
    const requiredSteps = summary.installPlan.steps.filter((step) => !step.optional);
    const optionalSteps = summary.installPlan.steps.filter((step) => step.optional);

    assert.equal(summary.ok, true);
    assert.equal(summary.capabilities.tts.ok, true);
    assert.equal(summary.capabilities.asr.ok, false);
    assert.deepEqual(requiredSteps.map((step) => step.id), []);
    assert.ok(optionalSteps.some((step) => step.id === 'install_asr_model'));
});

test('voice runtime tries Python standalone mirrors before uv default GitHub source', () => {
    const bootstrap = createBootstrap();
    const mirrors = bootstrap.getUvPythonInstallMirrorCandidates();

    assert.match(mirrors[0], /python-standalone\.org/);
    assert.equal(mirrors.at(-1), '');
});

test('voice runtime installs pip packages through mirrors with cache and retries', () => {
    const savedEnv = {
        AILIS_PIP_INDEX_URLS: process.env.AILIS_PIP_INDEX_URLS,
        AILIS_PIP_INDEX_URL: process.env.AILIS_PIP_INDEX_URL,
        PIP_INDEX_URL: process.env.PIP_INDEX_URL
    };
    try {
        delete process.env.AILIS_PIP_INDEX_URLS;
        delete process.env.AILIS_PIP_INDEX_URL;
        delete process.env.PIP_INDEX_URL;

        const bootstrap = createBootstrap();
        const paths = bootstrap.getPaths();
        const indexes = bootstrap.getPipIndexUrlCandidates();
        const args = bootstrap.buildPipInstallArgs({
            paths,
            indexUrl: indexes[0],
            packages: ['torch>=2.6,<3.0'],
            resumeRetries: true
        });

        assert.match(indexes[0], /pypi\.tuna\.tsinghua\.edu\.cn/);
        assert.equal(indexes.at(-1), '');
        assert.ok(args.includes('--prefer-binary'));
        assert.ok(args.includes('--disable-pip-version-check'));
        assert.ok(args.includes('--timeout'));
        assert.ok(args.includes('120'));
        assert.ok(args.includes('--retries'));
        assert.ok(args.includes('10'));
        assert.ok(args.includes('--resume-retries'));
        assert.equal(args[args.indexOf('--cache-dir') + 1], paths.pipCacheDir);
        assert.equal(args[args.indexOf('--index-url') + 1], indexes[0]);

        const voiceArgs = bootstrap.buildPipInstallArgs({
            paths,
            indexUrl: indexes[0],
            extraIndexUrls: ['https://download.pytorch.org/whl/cu121'],
            packages: ['torch==2.3.1']
        });

        assert.equal(voiceArgs[voiceArgs.indexOf('--extra-index-url') + 1], 'https://download.pytorch.org/whl/cu121');
    } finally {
        for (const [key, value] of Object.entries(savedEnv)) {
            if (value === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = value;
            }
        }
    }
});
