import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const { getToolContract } = require('../electron/humanclaw-tool-contracts.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const defaultOsworldRoot = path.join(projectRoot, 'build-cache', 'OSWorld');
const osworldRoot = path.resolve(process.env.OSWORLD_REPO || defaultOsworldRoot);
const wslPython = process.env.OSWORLD_WSL_PYTHON || '/root/aigl-osworld-venv/bin/python';
const reportDir = path.join(projectRoot, 'eval-results', 'engineering', 'osworld-pc-readiness');

function run(command, args = [], options = {}) {
    const result = spawnSync(command, args, {
        cwd: options.cwd || projectRoot,
        encoding: 'utf8',
        shell: false,
        timeout: options.timeoutMs || 30000
    });
    return {
        ok: result.status === 0,
        status: result.status,
        signal: result.signal,
        stdout: (result.stdout || '').trim(),
        stderr: (result.stderr || '').trim(),
        error: result.error?.message || ''
    };
}

async function exists(targetPath) {
    try {
        await fs.access(targetPath);
        return true;
    } catch {
        return false;
    }
}

async function readJson(filePath, fallback = null) {
    try {
        return JSON.parse(await fs.readFile(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

function summarizeDomains(meta = {}) {
    const domains = {};
    let total = 0;
    for (const [domain, examples] of Object.entries(meta || {})) {
        const count = Array.isArray(examples) ? examples.length : 0;
        domains[domain] = count;
        total += count;
    }
    return { total, domains };
}

function buildCapabilityGap() {
    const contract = getToolContract('computer');
    const actions = new Set(contract?.schema?.properties?.action?.enum || []);
    const required = [
        'screen_screenshot',
        'mouse_move',
        'mouse_click',
        'mouse_double_click',
        'mouse_right_click',
        'mouse_drag',
        'scroll',
        'keyboard_type',
        'keyboard_press',
        'keyboard_hotkey',
        'clipboard_read',
        'clipboard_write',
        'exec',
        'process_read',
        'process_kill'
    ];
    return {
        required,
        present: required.filter((action) => actions.has(action)),
        missing: required.filter((action) => !actions.has(action)),
        actionCount: actions.size
    };
}

function wslPath(windowsPath) {
    const resolved = path.resolve(windowsPath);
    const match = /^([A-Za-z]):\\(.*)$/.exec(resolved);
    if (!match) {
        return resolved.replace(/\\/g, '/');
    }
    return `/mnt/${match[1].toLowerCase()}/${match[2].replace(/\\/g, '/')}`;
}

async function main() {
    await fs.mkdir(reportDir, { recursive: true });

    const osworldExists = await exists(path.join(osworldRoot, 'README.md'));
    const smallMeta = osworldExists
        ? await readJson(path.join(osworldRoot, 'evaluation_examples', 'test_small.json'), {})
        : {};
    const allMeta = osworldExists
        ? await readJson(path.join(osworldRoot, 'evaluation_examples', 'test_all.json'), {})
        : {};

    const osworldWslRoot = wslPath(osworldRoot);
    const checks = {
        osworldRepo: {
            ok: osworldExists,
            path: osworldRoot,
            commit: osworldExists ? run('git', ['-C', osworldRoot, 'log', '-1', '--oneline']).stdout : ''
        },
        python: run('python', ['--version']),
        vmware: run('where.exe', ['vmrun']),
        virtualbox: run('where.exe', ['VBoxManage']),
        docker: run('docker', ['--version']),
        wsl: run('wsl', ['--status']),
        wslDocker: run('wsl', ['-d', 'Ubuntu-22.04', '--', 'bash', '-lc', 'docker info >/tmp/aigl-osworld-docker-info.txt 2>/tmp/aigl-osworld-docker-info.err; code=$?; echo status:$code; head -30 /tmp/aigl-osworld-docker-info.txt; head -30 /tmp/aigl-osworld-docker-info.err']),
        wslKvm: run('wsl', ['-d', 'Ubuntu-22.04', '--', 'bash', '-lc', 'if [ -e /dev/kvm ]; then echo KVM_PRESENT; else echo KVM_MISSING; fi; egrep -c "(vmx|svm)" /proc/cpuinfo || true']),
        wslPython: run('wsl', ['-d', 'Ubuntu-22.04', '--', 'bash', '-lc', `test -x ${JSON.stringify(wslPython)} && ${JSON.stringify(wslPython)} --version`]),
        wslOsworldImport: osworldExists
            ? run('wsl', ['-d', 'Ubuntu-22.04', '--', 'bash', '-lc', `cd ${JSON.stringify(osworldWslRoot)} && ${JSON.stringify(wslPython)} -c "from desktop_env.desktop_env import DesktopEnv; print('ok')"`], {
                  timeoutMs: 60000
              })
            : { ok: false, error: 'OSWorld repo not found.' },
        osworldImport: osworldExists
            ? run('python', ['-c', 'from desktop_env.desktop_env import DesktopEnv; print("ok")'], {
                  cwd: osworldRoot,
                  timeoutMs: 60000
              })
            : { ok: false, error: 'OSWorld repo not found.' }
    };

    const blockers = [];
    const warnings = [];
    if (!checks.osworldRepo.ok) {
        blockers.push('OSWorld repo is missing. Clone https://github.com/xlang-ai/OSWorld into build-cache/OSWorld.');
    }
    const wslDockerReady = checks.wslDocker.ok && /Server Version:/i.test(checks.wslDocker.stdout);
    const wslKvmReady = checks.wslKvm.ok && /KVM_PRESENT/i.test(checks.wslKvm.stdout);
    if (!checks.osworldImport.ok && !checks.wslOsworldImport.ok) {
        blockers.push('OSWorld Python dependencies are not installed in either the active Windows Python or WSL Python environment.');
    }
    const windowsProviderReady = checks.vmware.ok || checks.virtualbox.ok || checks.docker.ok;
    const wslProviderReady = wslDockerReady && wslKvmReady;
    const windowsRunReady = checks.osworldImport.ok && windowsProviderReady;
    const wslRunReady = checks.wslOsworldImport.ok && wslProviderReady;
    if (!windowsProviderReady && !wslProviderReady) {
        blockers.push('No local OSWorld VM provider is available: vmrun, VBoxManage, Docker, and WSL Docker/KVM are all unavailable.');
    }
    if (!checks.docker.ok && wslRunReady) {
        warnings.push('Windows native Docker is missing, but WSL Docker/KVM is ready. Official OSWorld should be run through WSL.');
    }

    const report = {
        generatedAt: new Date().toISOString(),
        osworldRoot,
        checks,
        wslRoute: {
            osworldRoot: osworldWslRoot,
            python: wslPython,
            dockerReady: wslDockerReady,
            kvmReady: wslKvmReady,
            pythonImportReady: checks.wslOsworldImport.ok
        },
        datasets: {
            testSmall: summarizeDomains(smallMeta),
            testAll: summarizeDomains(allMeta)
        },
        aiglComputerCapability: buildCapabilityGap(),
        officialRunReady: windowsRunReady || wslRunReady,
        runRoute: wslRunReady ? 'wsl-docker-kvm' : windowsRunReady ? 'windows-native-provider' : 'not-ready',
        blockers,
        warnings,
        recommendedNextSteps: blockers.length
            ? [
                  'Install one provider: VMware Workstation Pro with vmrun, VirtualBox with VBoxManage, or Docker Desktop with KVM-capable Linux/WSL backend.',
                  'Create an isolated OSWorld Python environment and install its requirements.',
                  'Run OSWorld quickstart.py before running benchmark tasks.',
                  'Use test_small.json first, then expand to OSWorld-Verified/test_all.'
              ]
            : [
                  'Run quickstart.py with the available provider.',
                  'Add an AIGL OSWorld agent wrapper and run test_small.json.',
                  'Use trajectory logs to tune screenshot, GUI input, recovery, and evidence collection.'
              ]
    };

    const jsonPath = path.join(reportDir, 'osworld-pc-readiness.report.json');
    const mdPath = path.join(reportDir, 'osworld-pc-readiness.report.md');
    await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
    await fs.writeFile(
        mdPath,
        [
            '# OSWorld PC Readiness Report',
            '',
            `Generated: ${report.generatedAt}`,
            `OSWorld root: ${report.osworldRoot}`,
            '',
            `Official run ready: ${report.officialRunReady ? 'yes' : 'no'}`,
            '',
            '## Provider Checks',
            '',
            `- Python: ${checks.python.ok ? 'ok' : 'failed'} ${checks.python.stdout || checks.python.stderr || checks.python.error}`,
            `- OSWorld import: ${checks.osworldImport.ok ? 'ok' : 'failed'} ${checks.osworldImport.stdout || checks.osworldImport.stderr || checks.osworldImport.error}`,
            `- VMware vmrun: ${checks.vmware.ok ? 'ok' : 'missing'}`,
            `- VirtualBox VBoxManage: ${checks.virtualbox.ok ? 'ok' : 'missing'}`,
            `- Docker: ${checks.docker.ok ? 'ok' : 'missing'}`,
            `- WSL: ${checks.wsl.ok ? 'ok' : 'missing'}`,
            `- WSL Docker: ${wslDockerReady ? 'ok' : 'missing'}`,
            `- WSL KVM: ${wslKvmReady ? 'ok' : 'missing'}`,
            `- WSL Python: ${checks.wslPython.ok ? 'ok' : 'missing'} ${checks.wslPython.stdout || checks.wslPython.stderr || checks.wslPython.error}`,
            `- WSL OSWorld import: ${checks.wslOsworldImport.ok ? 'ok' : 'failed'} ${checks.wslOsworldImport.stdout || checks.wslOsworldImport.stderr || checks.wslOsworldImport.error}`,
            '',
            '## Dataset',
            '',
            `- test_small: ${report.datasets.testSmall.total} tasks`,
            `- test_all: ${report.datasets.testAll.total} tasks`,
            '',
            '## AIGL Computer Capability',
            '',
            `- required OSWorld-style actions: ${report.aiglComputerCapability.required.length}`,
            `- present: ${report.aiglComputerCapability.present.length}`,
            `- missing: ${report.aiglComputerCapability.missing.length ? report.aiglComputerCapability.missing.join(', ') : 'none'}`,
            '',
            '## Blockers',
            '',
            ...(blockers.length ? blockers.map((entry) => `- ${entry}`) : ['- none']),
            '',
            '## Warnings',
            '',
            ...(warnings.length ? warnings.map((entry) => `- ${entry}`) : ['- none']),
            '',
            '## Next Steps',
            '',
            ...report.recommendedNextSteps.map((entry) => `- ${entry}`),
            ''
        ].join('\n')
    );

    console.log(JSON.stringify({ ok: true, reportPath: jsonPath, markdownPath: mdPath, officialRunReady: report.officialRunReady, blockers }, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
