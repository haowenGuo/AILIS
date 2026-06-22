const { EventEmitter } = require('events');
const { spawn } = require('child_process');
const path = require('path');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 8000;
const DEFAULT_READY_TIMEOUT_SEC = 900;
const MAX_LOG_LINES = 160;
const MAX_LINE_LENGTH = 4000;

function normalizeModelId(value = '') {
    return String(value || '').trim().slice(0, 240);
}

function normalizeSource(value = 'modelscope') {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'hf' || normalized === 'huggingface' || normalized === 'hugging-face') {
        return 'hf';
    }
    if (normalized === 'ms' || normalized === 'modelscope' || normalized === 'model-scope') {
        return 'modelscope';
    }
    return 'modelscope';
}

function normalizePort(value = DEFAULT_PORT) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return DEFAULT_PORT;
    }
    return Math.max(1, Math.min(65535, Math.floor(numeric)));
}

function normalizeReadyTimeoutSec(value = DEFAULT_READY_TIMEOUT_SEC) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return DEFAULT_READY_TIMEOUT_SEC;
    }
    return Math.max(60, Math.min(7200, Math.floor(numeric)));
}

function getBaseUrl({ host = DEFAULT_HOST, port = DEFAULT_PORT } = {}) {
    const clientHost = host === '0.0.0.0' || host === '::' ? DEFAULT_HOST : host;
    return `http://${clientHost}:${normalizePort(port)}/v1`;
}

function stripAnsi(value = '') {
    return String(value || '').replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
}

function splitOutputLines(chunk = '') {
    return stripAnsi(chunk)
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map((line) => line.trimEnd())
        .filter(Boolean);
}

function clipLine(line = '') {
    const text = String(line || '');
    return text.length > MAX_LINE_LENGTH ? `${text.slice(0, MAX_LINE_LENGTH)}...` : text;
}

function execFileText(command, args = [], { timeoutMs = 12000 } = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            windowsHide: true,
            shell: false
        });
        let stdout = '';
        let stderr = '';
        const timer = setTimeout(() => {
            try {
                child.kill();
            } catch {
                // Ignore kill races.
            }
            reject(new Error(`Command timed out after ${timeoutMs}ms: ${command}`));
        }, timeoutMs);
        child.stdout?.on?.('data', (chunk) => {
            stdout += String(chunk || '');
        });
        child.stderr?.on?.('data', (chunk) => {
            stderr += String(chunk || '');
        });
        child.on('error', (error) => {
            clearTimeout(timer);
            reject(error);
        });
        child.on('exit', (code) => {
            clearTimeout(timer);
            if (Number(code) === 0) {
                resolve(stdout);
                return;
            }
            reject(new Error(stderr || stdout || `${command} exited with code ${code}`));
        });
    });
}

function execFileSafe(command, args = [], options = {}) {
    return execFileText(command, args, options)
        .then((stdout) => ({ ok: true, stdout, error: '' }))
        .catch((error) => ({ ok: false, stdout: '', error: error.message || String(error) }));
}

function parseJsonSafe(value, fallback = null) {
    try {
        return JSON.parse(String(value || ''));
    } catch {
        return fallback;
    }
}

async function isVllmServiceReady({ host = DEFAULT_HOST, port = DEFAULT_PORT, timeoutMs = 3500 } = {}) {
    const baseUrl = getBaseUrl({ host, port });
    if (typeof globalThis.fetch !== 'function') {
        return { ok: false, baseUrl, modelIds: [], error: 'fetch_unavailable' };
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await globalThis.fetch(`${baseUrl}/models`, {
            signal: controller.signal,
            headers: { accept: 'application/json' }
        });
        if (!response.ok) {
            return { ok: false, baseUrl, modelIds: [], error: `${response.status} ${response.statusText}` };
        }
        const payload = await response.json();
        return {
            ok: true,
            baseUrl,
            modelIds: Array.isArray(payload?.data)
                ? payload.data.map((item) => item?.id).filter(Boolean)
                : []
        };
    } catch (error) {
        return { ok: false, baseUrl, modelIds: [], error: error.message || String(error) };
    } finally {
        clearTimeout(timer);
    }
}

function buildRuntimeProbeScript(projectRoot = '.') {
    const root = String(projectRoot || '.').replace(/\\/g, '/').replace(/"/g, '\\"');
    return `
set +e
cd "${root}" 2>/dev/null || true
python_path="$(command -v python3 || true)"
python_version=""
python_ok=false
if [ -n "$python_path" ]; then
  python_version="$(python3 - <<'PY' 2>/dev/null
import sys
print(f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
PY
)"
  python3 - <<'PY' >/dev/null 2>&1
import sys
raise SystemExit(0 if sys.version_info >= (3, 10) else 1)
PY
  if [ "$?" = "0" ]; then python_ok=true; fi
fi
gpu_info=""
if command -v nvidia-smi >/dev/null 2>&1; then
  gpu_info="$(nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader 2>/dev/null | head -n 3 | tr '\\n' '; ')"
fi
venv_python=".ailis-runtime/vllm-venv/bin/python"
venv_exists=false
vllm_installed=false
if [ -x "$venv_python" ]; then
  venv_exists=true
  "$venv_python" - <<'PY' >/dev/null 2>&1
import vllm
PY
  if [ "$?" = "0" ]; then vllm_installed=true; fi
fi
disk_available_kb="$(df -Pk . 2>/dev/null | awk 'NR==2 {print $4}')"
cat <<JSON
{"pythonPath":"$python_path","pythonVersion":"$python_version","pythonOk":$python_ok,"gpuInfo":"$gpu_info","venvPython":"$venv_python","venvExists":$venv_exists,"vllmInstalled":$vllm_installed,"diskAvailableKb":\${disk_available_kb:-0}}
JSON
`.trim();
}

function buildInstallPlan(diagnosis = {}) {
    const steps = [];
    if (diagnosis.platform === 'win32' && !diagnosis.wsl?.available) {
        steps.push({
            id: 'install_wsl',
            title: '安装 WSL2 / Ubuntu',
            severity: 'blocking',
            requiresSystemChange: true,
            requiresUserAction: true,
            description: 'Windows 本地部署 vLLM 需要 WSL2。AILIS 可以发起安装，但系统可能要求管理员权限或重启。'
        });
    } else if (diagnosis.platform === 'win32' && !diagnosis.wsl?.distros?.length) {
        steps.push({
            id: 'install_wsl_distro',
            title: '安装 Ubuntu WSL 发行版',
            severity: 'blocking',
            requiresSystemChange: true,
            requiresUserAction: true,
            description: '检测到 wsl.exe，但没有可用 Linux 发行版。首次安装可能需要完成 Ubuntu 初始化。'
        });
    }
    if (diagnosis.runtime?.available && !diagnosis.runtime?.pythonOk) {
        steps.push({
            id: 'install_python',
            title: '安装 Python 3.10+ / venv / pip',
            severity: 'required',
            requiresNetwork: true,
            description: '部署时会尝试在 Linux/WSL 中自动安装 python3、python3-venv、python3-pip。'
        });
    }
    if (diagnosis.runtime?.available && !diagnosis.runtime?.vllmInstalled) {
        steps.push({
            id: 'install_vllm',
            title: '创建 vLLM 私有运行时并安装依赖',
            severity: 'required',
            requiresNetwork: true,
            description: '将在项目目录 .ailis-runtime/vllm-venv 中创建私有 venv，并安装 vLLM 与模型下载依赖。'
        });
    }
    if (diagnosis.runtime?.available && !diagnosis.runtime?.gpuInfo) {
        steps.push({
            id: 'gpu_check',
            title: '未检测到 NVIDIA GPU / CUDA',
            severity: 'warning',
            description: 'vLLM 通常需要 CUDA GPU。AILIS 仍可尝试部署，但模型加载可能失败或非常慢。'
        });
    }
    if (!diagnosis.service?.ok) {
        steps.push({
            id: 'start_vllm',
            title: '启动 vLLM OpenAI-compatible 服务',
            severity: 'required',
            description: '部署完成后会在 http://127.0.0.1:8000/v1 启动服务，并等待 /v1/models 就绪。'
        });
    }
    return {
        ok: !steps.some((step) => step.severity === 'blocking'),
        steps,
        requiresNetwork: steps.some((step) => step.requiresNetwork),
        requiresSystemChange: steps.some((step) => step.requiresSystemChange),
        blockingSteps: steps.filter((step) => step.severity === 'blocking')
    };
}

function summarizeFailure(lines = [], exitCode = null) {
    const text = lines.join('\n').toLowerCase();
    if (/no wsl distro found|wsl was not found|wsl --install/.test(text)) {
        return {
            code: 'wsl_missing',
            message: 'Windows 上自动部署 vLLM 需要 WSL2/Ubuntu。当前没有可用 WSL 发行版，控制面板无法继续安装。'
        };
    }
    if (/python3 was not found|python .*too old|python 3\.10/.test(text)) {
        return {
            code: 'python_missing',
            message: 'vLLM 运行环境缺少 Python 3.10+。需要先让本地/WSL 具备可用 Python。'
        };
    }
    if (/nvidia-smi was not found|cuda|no cuda|gpu|out of memory|oom/.test(text)) {
        return {
            code: 'gpu_or_cuda',
            message: 'vLLM 启动失败可能与 CUDA/GPU/显存有关。请查看日志中的 CUDA、GPU 或 OOM 信息。'
        };
    }
    if (/trust_remote_code|trust-remote-code|remote code/.test(text)) {
        return {
            code: 'trust_remote_code',
            message: '该模型可能需要启用 Trust Remote Code。只在信任模型仓库时勾选后重试。'
        };
    }
    if (/did not become ready|wait.*ready|ready timeout|timed out|timeout/.test(text)) {
        return {
            code: 'ready_timeout',
            message: 'vLLM 进程没有在限定时间内完成加载。常见原因是模型太大、下载慢、显存不足或首次编译耗时。'
        };
    }
    if (/pip install|failed building wheel|could not find a version|network|connection|ssl|proxy/.test(text)) {
        return {
            code: 'install_or_network',
            message: 'vLLM 环境安装或模型下载失败，可能是网络、pip 源、代理或依赖编译问题。'
        };
    }
    return {
        code: 'process_failed',
        message: `vLLM 自动部署进程退出失败${exitCode === null ? '' : `（exitCode=${exitCode}）`}。请查看下方日志摘要。`
    };
}

function buildDeployCommand({
    projectRoot,
    platform = process.platform,
    source = 'modelscope',
    model,
    host = DEFAULT_HOST,
    port = DEFAULT_PORT,
    readyTimeoutSec = DEFAULT_READY_TIMEOUT_SEC,
    trustRemoteCode = false,
    installWsl = true
} = {}) {
    const modelId = normalizeModelId(model);
    if (!modelId) {
        throw new Error('模型 ID 不能为空。');
    }
    const normalizedSource = normalizeSource(source);
    const normalizedPort = normalizePort(port);
    const normalizedTimeout = normalizeReadyTimeoutSec(readyTimeoutSec);

    if (platform === 'win32') {
        const scriptPath = path.join(projectRoot, 'scripts', 'bootstrap-vllm-local.ps1');
        const args = [
            '-NoProfile',
            '-ExecutionPolicy',
            'Bypass',
            '-File',
            scriptPath,
            '-Source',
            normalizedSource,
            '-Model',
            modelId,
            '-HostName',
            host,
            '-Port',
            String(normalizedPort),
            '-Start',
            '-Detached',
            '-WaitReady',
            '-ReadyTimeoutSec',
            String(normalizedTimeout)
        ];
        if (trustRemoteCode) {
            args.push('-TrustRemoteCode');
        }
        if (installWsl) {
            args.push('-InstallWsl');
        }
        return {
            command: 'powershell.exe',
            args,
            cwd: projectRoot,
            source: normalizedSource,
            modelId,
            servedModelId: modelId,
            baseUrl: getBaseUrl({ host, port: normalizedPort })
        };
    }

    const scriptPath = path.join(projectRoot, 'scripts', 'bootstrap-vllm-local.sh');
    const args = [
        scriptPath,
        '--source',
        normalizedSource,
        '--model',
        modelId,
        '--host',
        host,
        '--port',
        String(normalizedPort),
        '--start',
        '--detached',
        '--wait-ready',
        '--ready-timeout-sec',
        String(normalizedTimeout)
    ];
    if (trustRemoteCode) {
        args.push('--trust-remote-code');
    }
    return {
        command: 'bash',
        args,
        cwd: projectRoot,
        source: normalizedSource,
        modelId,
        servedModelId: modelId,
        baseUrl: getBaseUrl({ host, port: normalizedPort })
    };
}

class VllmLocalDeployer extends EventEmitter {
    constructor({
        projectRoot,
        platform = process.platform,
        processFactory = spawn
    } = {}) {
        super();
        this.projectRoot = projectRoot || path.resolve(__dirname, '..');
        this.platform = platform;
        this.processFactory = processFactory;
        this.child = null;
        this.status = this.createIdleStatus();
    }

    createIdleStatus() {
        return {
            ok: true,
            status: 'idle',
            running: false,
            modelId: '',
            source: '',
            servedModelId: '',
            baseUrl: getBaseUrl(),
            startedAt: '',
            endedAt: '',
            exitCode: null,
            failure: null,
            diagnosis: null,
            installPlan: null,
            logLines: []
        };
    }

    async diagnose(payload = {}) {
        const host = payload.host || DEFAULT_HOST;
        const port = normalizePort(payload.port || DEFAULT_PORT);
        const diagnosis = {
            ok: false,
            platform: this.platform,
            projectRoot: this.projectRoot,
            checkedAt: new Date().toISOString(),
            wsl: {
                required: this.platform === 'win32',
                available: false,
                distros: [],
                error: ''
            },
            runtime: {
                available: false,
                pythonOk: false,
                pythonPath: '',
                pythonVersion: '',
                gpuInfo: '',
                venvExists: false,
                vllmInstalled: false,
                error: ''
            },
            service: await isVllmServiceReady({ host, port })
        };

        if (this.platform === 'win32') {
            const wslStatus = await execFileSafe('wsl.exe', ['--status'], { timeoutMs: 8000 });
            diagnosis.wsl.available = wslStatus.ok;
            diagnosis.wsl.error = wslStatus.ok ? '' : wslStatus.error;
            if (wslStatus.ok) {
                const distroResult = await execFileSafe('wsl.exe', ['-l', '-q'], { timeoutMs: 8000 });
                diagnosis.wsl.distros = splitOutputLines(distroResult.stdout)
                    .map((line) => line.replace(/\0/g, '').trim())
                    .filter(Boolean);
            }
            if (diagnosis.wsl.distros.length) {
                const pathResult = await execFileSafe('wsl.exe', ['--', 'wslpath', '-a', this.projectRoot], { timeoutMs: 8000 });
                const wslProjectRoot = pathResult.ok
                    ? splitOutputLines(pathResult.stdout)[0] || '/mnt/f/AILIS_self_evolution_runtime'
                    : '/mnt/f/AILIS_self_evolution_runtime';
                const runtimeResult = await execFileSafe(
                    'wsl.exe',
                    ['--', 'bash', '-lc', buildRuntimeProbeScript(wslProjectRoot)],
                    { timeoutMs: 12000 }
                );
                diagnosis.runtime = {
                    ...diagnosis.runtime,
                    available: runtimeResult.ok,
                    ...(parseJsonSafe(runtimeResult.stdout, {}) || {}),
                    error: runtimeResult.ok ? '' : runtimeResult.error
                };
            }
        } else {
            const runtimeResult = await execFileSafe(
                'bash',
                ['-lc', buildRuntimeProbeScript(this.projectRoot)],
                { timeoutMs: 12000 }
            );
            diagnosis.runtime = {
                ...diagnosis.runtime,
                available: runtimeResult.ok,
                ...(parseJsonSafe(runtimeResult.stdout, {}) || {}),
                error: runtimeResult.ok ? '' : runtimeResult.error
            };
        }

        diagnosis.installPlan = buildInstallPlan(diagnosis);
        diagnosis.ok = diagnosis.service?.ok || (
            diagnosis.installPlan.ok &&
            diagnosis.runtime?.available &&
            diagnosis.runtime?.pythonOk &&
            diagnosis.runtime?.vllmInstalled
        );
        this.status = {
            ...this.status,
            diagnosis,
            installPlan: diagnosis.installPlan,
            baseUrl: diagnosis.service?.baseUrl || getBaseUrl({ host, port })
        };
        return diagnosis;
    }

    appendLog(chunk) {
        const nextLines = splitOutputLines(chunk).map(clipLine);
        if (!nextLines.length) {
            return;
        }
        this.status.logLines.push(...nextLines);
        if (this.status.logLines.length > MAX_LOG_LINES) {
            this.status.logLines = this.status.logLines.slice(-MAX_LOG_LINES);
        }
        this.emit('status', this.getStatus());
    }

    async start(payload = {}) {
        if (this.child && this.status.status === 'running') {
            return {
                ...this.getStatus(),
                ok: false,
                error: '已有 vLLM 部署任务正在运行。'
            };
        }

        const diagnosis = await this.diagnose(payload);
        const command = buildDeployCommand({
            projectRoot: this.projectRoot,
            platform: this.platform,
            source: payload.source,
            model: payload.modelId || payload.model,
            host: payload.host || DEFAULT_HOST,
            port: payload.port || DEFAULT_PORT,
            readyTimeoutSec: payload.readyTimeoutSec || DEFAULT_READY_TIMEOUT_SEC,
            trustRemoteCode: payload.trustRemoteCode === true,
            installWsl: payload.installWsl !== false
        });

        this.status = {
            ok: true,
            status: 'running',
            running: true,
            source: command.source,
            modelId: command.modelId,
            servedModelId: command.servedModelId,
            baseUrl: command.baseUrl,
            startedAt: new Date().toISOString(),
            endedAt: '',
            exitCode: null,
            failure: null,
            diagnosis,
            installPlan: diagnosis.installPlan,
            logLines: [
                `[AILIS vLLM] 自动部署已启动：${command.modelId}`,
                `[AILIS vLLM] 来源：${command.source}，API Base：${command.baseUrl}`
            ]
        };

        const child = this.processFactory(command.command, command.args, {
            cwd: command.cwd,
            windowsHide: true,
            env: {
                ...process.env,
                AILIS_VLLM_UI_DEPLOY: '1'
            }
        });
        this.child = child;

        child.stdout?.on?.('data', (chunk) => this.appendLog(chunk));
        child.stderr?.on?.('data', (chunk) => this.appendLog(chunk));
        child.on?.('error', (error) => {
            this.status = {
                ...this.status,
                ok: false,
                status: 'failed',
                running: false,
                endedAt: new Date().toISOString(),
                failure: {
                    code: 'spawn_failed',
                    message: error.message || String(error)
                }
            };
            this.child = null;
            this.emit('status', this.getStatus());
        });
        child.on?.('exit', (code) => {
            const success = Number(code) === 0;
            this.status = {
                ...this.status,
                ok: success,
                status: success ? 'ready' : 'failed',
                running: false,
                endedAt: new Date().toISOString(),
                exitCode: Number.isFinite(Number(code)) ? Number(code) : null,
                failure: success ? null : summarizeFailure(this.status.logLines, code)
            };
            if (success) {
                this.status.logLines.push(`[AILIS vLLM] 部署完成：${this.status.baseUrl}`);
            }
            this.child = null;
            this.emit('status', this.getStatus());
        });

        this.emit('status', this.getStatus());
        return this.getStatus();
    }

    cancel() {
        if (!this.child || this.status.status !== 'running') {
            return this.getStatus();
        }
        try {
            this.child.kill();
        } catch {
            // The child may have already exited.
        }
        this.status = {
            ...this.status,
            ok: false,
            status: 'cancelled',
            running: false,
            endedAt: new Date().toISOString(),
            failure: {
                code: 'cancelled',
                message: '用户已取消 vLLM 自动部署任务。'
            }
        };
        this.child = null;
        this.emit('status', this.getStatus());
        return this.getStatus();
    }

    getStatus() {
        return {
            ...this.status,
            logLines: [...(this.status.logLines || [])]
        };
    }
}

module.exports = {
    VllmLocalDeployer,
    buildInstallPlan,
    buildDeployCommand,
    getBaseUrl,
    summarizeFailure
};
