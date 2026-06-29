import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    buildModelfileContent,
    buildInstallCommand,
    buildInstallPlan,
    buildOllamaRuntimeEnv,
    buildUpgradeCommand,
    compareNumericVersions,
    compareVersions,
    describeOllamaLocalModelPath,
    extractOllamaVersionText,
    getBaseUrl,
    getOllamaServiceState,
    inferLocalModelName,
    isOllamaCudaFailureOutput,
    isOllamaUpgradeRequiredOutput,
    normalizeModelId,
    normalizeOllamaTarget,
    parseOllamaPsOutput,
    parseOllamaVersion,
    summarizeFailure
} = require('../electron/ollama-local-runtime.cjs');

test('builds Windows Ollama installer command through winget', () => {
    const command = buildInstallCommand({ platform: 'win32' });
    assert.equal(command.command, 'winget');
    assert.deepEqual(command.args.slice(0, 3), ['install', '--id', 'Ollama.Ollama']);
    assert.ok(command.args.includes('-e'));
    assert.ok(command.args.includes('--accept-source-agreements'));
    assert.ok(command.args.includes('--accept-package-agreements'));
    assert.ok(command.args.includes('--force'));
});

test('builds Windows Ollama upgrade command through winget', () => {
    const command = buildUpgradeCommand({ platform: 'win32' });
    assert.equal(command.command, 'winget');
    assert.deepEqual(command.args.slice(0, 3), ['upgrade', '--id', 'Ollama.Ollama']);
    assert.ok(command.args.includes('--accept-source-agreements'));
});

test('builds Ollama install plan for missing runtime and model', () => {
    const plan = buildInstallPlan({
        target: { source: 'online_pull', modelId: 'qwen2.5:7b' },
        platform: 'win32',
        model: 'qwen2.5:7b',
        cli: { ok: false },
        service: { ok: false, modelPresent: false }
    });
    assert.equal(plan.ok, true);
    assert.ok(plan.steps.some((step) => step.id === 'install_ollama'));
    assert.ok(plan.steps.some((step) => step.id === 'start_service'));
    assert.ok(plan.steps.some((step) => step.id === 'pull_model'));
    assert.equal(plan.requiresNetwork, true);
});

test('builds Ollama plan for running service missing selected model', () => {
    const plan = buildInstallPlan({
        target: { source: 'online_pull', modelId: 'llama3.2' },
        platform: 'win32',
        model: 'llama3.2',
        cli: { ok: true },
        service: { ok: true, modelPresent: false }
    });
    assert.equal(plan.steps.length, 1);
    assert.equal(plan.steps[0].id, 'pull_model');
});

test('blocks invalid local model requests instead of falling back to pull', () => {
    const plan = buildInstallPlan({
        platform: 'win32',
        model: 'local-broken-model',
        cli: { ok: true, version: '0.30.9' },
        service: { ok: true, modelPresent: false },
        localModel: {
            ok: false,
            path: 'F:\\models\\broken',
            canImportOllama: false,
            blockers: ['没有检测到 .gguf 或 .safetensors 权重文件。']
        }
    });

    assert.equal(plan.ok, false);
    assert.deepEqual(plan.steps.map((step) => step.id), ['local_model_not_importable']);
    assert.equal(plan.requiresNetwork, false);
    assert.equal(plan.blockingSteps.length, 1);
});

test('does not pull when installed-model target is missing', () => {
    const plan = buildInstallPlan({
        target: { source: 'installed', modelId: 'local-qwen3-4b' },
        platform: 'win32',
        model: 'local-qwen3-4b',
        cli: { ok: true, version: '0.30.9' },
        service: { ok: true, modelPresent: false }
    });

    assert.equal(plan.ok, false);
    assert.deepEqual(plan.steps.map((step) => step.id), ['installed_model_missing']);
    assert.equal(plan.requiresNetwork, false);
});

test('builds Ollama plan with remote model store warning', () => {
    const plan = buildInstallPlan({
        target: { source: 'online_pull', modelId: 'qwen3.5:4b' },
        platform: 'win32',
        model: 'qwen3.5:4b',
        cli: { ok: true, version: '0.30.9' },
        service: { ok: true, modelPresent: false },
        remoteModelSizeBytes: 3 * 1024 ** 3,
        remoteModelStore: {
            path: 'F:\\AILIS\\Ollama\\models',
            source: 'auto_large_disk',
            autoSelected: true,
            freeBytes: 60 * 1024 ** 3
        }
    });
    assert.deepEqual(
        plan.steps.map((step) => step.id),
        ['restart_ollama_service', 'pull_model', 'ollama_model_store_auto_select']
    );
    assert.equal(plan.requiresSystemChange, true);
});

test('builds Ollama plan with GPU driver warning without blocking deployment', () => {
    const plan = buildInstallPlan({
        target: { source: 'online_pull', modelId: 'qwen3.5:4b' },
        platform: 'win32',
        model: 'qwen3.5:4b',
        cli: { ok: true, version: '0.30.9' },
        service: { ok: true, modelPresent: true },
        acceleration: {
            gpu: {
                available: true,
                driverVersion: '546.92',
                minimumDriverVersion: '550.0',
                driverTooOld: true
            }
        }
    });

    assert.ok(plan.steps.some((step) => step.id === 'ollama_gpu_driver_warning'));
    assert.equal(plan.requiresNetwork, false);
    assert.equal(plan.blockingSteps.length, 0);
});

test('does not warn about remote model store after model is already present', () => {
    const plan = buildInstallPlan({
        target: { source: 'online_pull', modelId: 'qwen3.5:4b' },
        platform: 'win32',
        model: 'qwen3.5:4b',
        cli: { ok: true, version: '0.30.9' },
        service: { ok: true, modelPresent: true },
        remoteModelSizeBytes: 3 * 1024 ** 3,
        remoteModelStore: {
            path: 'F:\\AILIS\\Ollama\\models',
            source: 'auto_large_disk',
            autoSelected: true,
            freeBytes: 60 * 1024 ** 3
        }
    });
    assert.deepEqual(plan.steps.map((step) => step.id), []);
});

test('reads installed model names from Ollama tags response variants', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
            models: [
                { model: 'qwen3.5:4b' },
                { name: 'llama3.2:1b' }
            ]
        })
    });
    try {
        const service = await getOllamaServiceState({
            baseUrl: 'http://127.0.0.1:11434',
            model: 'qwen3.5:4b'
        });
        assert.equal(service.ok, true);
        assert.equal(service.modelPresent, true);
        assert.deepEqual(service.models, ['qwen3.5:4b', 'llama3.2:1b']);
    } finally {
        globalThis.fetch = originalFetch;
    }
});


test('injects auto-selected Ollama model store into runtime env', () => {
    const env = buildOllamaRuntimeEnv({ PATH: 'test-path' }, null, {
        modelStore: {
            path: 'F:\\AILIS\\Ollama\\models',
            source: 'auto_large_disk',
            autoSelected: true
        }
    });
    assert.equal(env.PATH, 'test-path');
    assert.equal(env.OLLAMA_MODELS, 'F:\\AILIS\\Ollama\\models');
});

test('injects CPU fallback flags into Ollama runtime env', () => {
    const env = buildOllamaRuntimeEnv({ PATH: 'test-path' }, null, {
        forceCpu: true
    });
    assert.equal(env.PATH, 'test-path');
    assert.equal(env.OLLAMA_LLM_LIBRARY, 'cpu_avx2');
    assert.equal(env.CUDA_VISIBLE_DEVICES, '-1');
});

test('injects Vulkan GPU fallback without inheriting CPU CUDA visibility flags', () => {
    const env = buildOllamaRuntimeEnv({
        PATH: 'test-path',
        CUDA_VISIBLE_DEVICES: '-1',
        OLLAMA_LLM_LIBRARY: 'cpu_avx2'
    }, null, {
        forceVulkan: true
    });
    assert.equal(env.PATH, 'test-path');
    assert.equal(env.OLLAMA_LLM_LIBRARY, 'vulkan');
    assert.equal('CUDA_VISIBLE_DEVICES' in env, false);
});

test('builds Ollama plan to upgrade very old runtime before pulling remote models', () => {
    const plan = buildInstallPlan({
        target: { source: 'online_pull', modelId: 'qwen3.5:4b' },
        platform: 'win32',
        model: 'qwen3.5:4b',
        cli: { ok: true, version: '0.3.6' },
        service: { ok: true, modelPresent: false }
    });

    assert.deepEqual(plan.steps.map((step) => step.id), ['upgrade_ollama', 'restart_ollama_service', 'pull_model']);
});

test('normalizes legacy Ollama deployment modes into explicit target sources', () => {
    assert.deepEqual(
        normalizeOllamaTarget({
            ollamaDeploymentMode: 'local',
            modelId: 'local-qwen3-4b',
            localModelPath: 'F:\\models\\Qwen3-4B'
        }),
        {
            source: 'local_import',
            modelId: 'local-qwen3-4b',
            localPath: 'F:\\models\\Qwen3-4B',
            remoteModelId: ''
        }
    );
    assert.deepEqual(
        normalizeOllamaTarget({
            ollamaDeploymentMode: 'online',
            modelId: 'qwen3.5:4b'
        }),
        {
            source: 'online_pull',
            modelId: 'qwen3.5:4b',
            localPath: '',
            remoteModelId: 'qwen3.5:4b'
        }
    );
});

test('builds Ollama plan to recover CLI when service is running but model is missing', () => {
    const plan = buildInstallPlan({
        target: { source: 'online_pull', modelId: 'qwen2.5:1.5b' },
        platform: 'win32',
        model: 'qwen2.5:1.5b',
        cli: { ok: false },
        service: { ok: true, modelPresent: false }
    });

    assert.deepEqual(plan.steps.map((step) => step.id), ['install_ollama', 'pull_model']);
});

test('builds Ollama plan for local safetensors import with runtime upgrade', () => {
    const plan = buildInstallPlan({
        target: { source: 'local_import', modelId: 'local-qwen3-4b', localPath: 'F:\\models\\Qwen3-4B' },
        platform: 'win32',
        model: 'local-qwen3-4b',
        cli: { ok: true, version: 'ollama version is 0.3.6' },
        service: { ok: true, modelPresent: false },
        localModel: {
            ok: true,
            canImportOllama: true,
            sourceType: 'safetensors_dir',
            minimumOllamaVersion: '0.6.0',
            warnings: ['qwen3 may need GGUF']
        }
    });

    assert.deepEqual(
        plan.steps.map((step) => step.id),
        ['upgrade_ollama', 'restart_ollama_service', 'import_local_model', 'local_model_warning']
    );
    assert.equal(plan.requiresNetwork, true);
});

test('summarizes common Ollama failures with actionable causes', () => {
    assert.equal(
        summarizeFailure(['winget is not recognized'], 1).code,
        'installer_missing'
    );
    assert.equal(
        summarizeFailure(['pull model manifest: not found'], 1).code,
        'model_not_found'
    );
    assert.equal(
        summarizeFailure(['pulling manifest', 'pulling abc123: 15%'], 1).code,
        'process_failed'
    );
    assert.equal(
        summarizeFailure(['pulling manifest', 'llama-server process has terminated: exit status 0xc0000409: CUDA error: device kernel image is invalid'], 1).code,
        'ollama_gpu_backend_failed'
    );
    assert.equal(
        summarizeFailure(['pull model manifest: 412: The model you are attempting to pull requires a newer version of Ollama.'], 1).code,
        'ollama_upgrade_required'
    );
    assert.equal(
        summarizeFailure(['connection timed out'], 1).code,
        'network_or_download'
    );
    assert.equal(
        summarizeFailure(['unknown architecture qwen3 safetensors'], 1).code,
        'local_model_unsupported'
    );
    assert.notEqual(
        summarizeFailure(['下载 Ollama 模型：qwen3.5:4b', 'Ollama upgrade/install exited with code 2316632107'], 1).code,
        'local_model_unsupported'
    );
});

test('normalizes Ollama defaults', () => {
    assert.equal(getBaseUrl({ host: '0.0.0.0', port: 11435 }), 'http://127.0.0.1:11435');
    assert.equal(normalizeModelId(''), 'qwen2.5:1.5b');
    assert.equal(inferLocalModelName('F:/lab/LLM project/Qwen3-4B'), 'local-qwen3-4b');
    assert.deepEqual(parseOllamaVersion('ollama version is 0.3.6'), {
        major: 0,
        minor: 3,
        patch: 6,
        raw: '0.3.6'
    });
    assert.equal(compareVersions('0.6.1', '0.6.0'), 1);
});

test('extracts Ollama client version from mixed server warning output', () => {
    assert.equal(
        extractOllamaVersionText('ollama version is 0.30.9\nWarning: client version is 0.3.6'),
        '0.3.6'
    );
    assert.equal(
        extractOllamaVersionText('Warning: could not connect to a running Ollama instance'),
        ''
    );
});

test('detects Ollama upgrade-required pull failures', () => {
    assert.equal(
        isOllamaUpgradeRequiredOutput('Error: pull model manifest: 412:\\nThe model you are attempting to pull requires a newer version of Ollama.'),
        true
    );
    assert.equal(isOllamaUpgradeRequiredOutput('Error: pull model manifest: not found'), false);
});

test('parses Ollama ps processor and compares NVIDIA driver versions', () => {
    const parsed = parseOllamaPsOutput([
        'NAME          ID              SIZE      PROCESSOR    CONTEXT    UNTIL',
        'qwen3.5:4b    2a654d98e6fb    3.2 GB    100% CPU     4096       4 minutes from now'
    ].join('\n'));

    assert.equal(parsed.length, 1);
    assert.equal(parsed[0].name, 'qwen3.5:4b');
    assert.equal(parsed[0].processor, '100% CPU');
    assert.equal(parsed[0].context, '4096');
    assert.equal(compareNumericVersions('546.92', '550.0') < 0, true);
    assert.equal(compareNumericVersions('551.61', '550.0') > 0, true);
});

test('detects Ollama CUDA inference failures', () => {
    assert.equal(
        isOllamaCudaFailureOutput('llama-server process has terminated: exit status 0xc0000409: CUDA error: device kernel image is invalid'),
        true
    );
    assert.equal(isOllamaCudaFailureOutput('pull model manifest: not found'), false);
});

test('builds Modelfile content for local paths with spaces', () => {
    const content = buildModelfileContent({
        localModel: { importPath: 'F:\\lab\\LLM project\\Qwen3-4B' },
        temperature: 0.6,
        topP: 0.95
    });
    assert.match(content, /^FROM "F:\\\\lab\\\\LLM project\\\\Qwen3-4B"/);
    assert.match(content, /PARAMETER temperature 0.6/);
    assert.match(content, /PARAMETER top_p 0.95/);
});

test('describes synthetic local safetensors model directory', async (t) => {
    const { mkdtemp, writeFile } = await import('node:fs/promises');
    const { tmpdir } = await import('node:os');
    const { join } = await import('node:path');
    const dir = await mkdtemp(join(tmpdir(), 'ailis-ollama-test-'));
    await writeFile(join(dir, 'config.json'), JSON.stringify({
        model_type: 'qwen3',
        architectures: ['Qwen3ForCausalLM']
    }));
    await writeFile(join(dir, 'tokenizer.json'), '{}');
    await writeFile(join(dir, 'model-00001-of-00001.safetensors'), 'weights');
    const descriptor = await describeOllamaLocalModelPath(dir, {
        env: { OLLAMA_MODELS: dir }
    });
    assert.equal(descriptor.ok, true);
    assert.equal(descriptor.sourceType, 'safetensors_dir');
    assert.equal(descriptor.modelType, 'qwen3');
    assert.equal(descriptor.suggestedModelName.startsWith('local-'), true);
    assert.equal(descriptor.warnings.some((warning) => warning.includes('qwen3')), true);
    assert.equal(descriptor.ollamaModelsDir, dir);
    assert.equal(descriptor.ollamaModelsDirSource, 'env_OLLAMA_MODELS');
});
