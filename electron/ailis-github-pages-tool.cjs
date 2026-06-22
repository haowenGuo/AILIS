const fs = require('fs/promises');
const path = require('path');
const http = require('http');
const https = require('https');
const { execFile } = require('child_process');

const GITHUB_PAGES_TOOL_ID = 'github_pages';
const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_MAX_BYTES = 256 * 1024;
const DEFAULT_PUBLISH_BRANCH = 'gh-pages';

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeNumber(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.min(Math.max(parsed, min), max);
}

function normalizeBoolean(value, fallback = false) {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        if (/^(true|1|yes|on)$/i.test(value.trim())) {
            return true;
        }
        if (/^(false|0|no|off)$/i.test(value.trim())) {
            return false;
        }
    }
    return fallback;
}

function normalizeTargetPath(value = 'index.html') {
    const raw = normalizeString(value, 'index.html')
        .replace(/\\/g, '/')
        .replace(/^\/+/, '')
        .replace(/^\.\//, '');
    if (!raw || raw.endsWith('/')) {
        return `${raw || ''}index.html`;
    }
    return raw;
}

function resultText(value) {
    return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

function createTextResult(body, details = {}, { isError = false } = {}) {
    const status = normalizeString(details.status, isError ? 'error' : 'completed');
    return {
        content: [{ type: 'text', text: resultText(body) }],
        isError,
        details: {
            ...details,
            status
        }
    };
}

function createErrorResult(status, message, details = {}) {
    return createTextResult(message, {
        ...details,
        status,
        error: message
    }, { isError: true });
}

function resolveWorkspace(args = {}, context = {}, runtime = {}) {
    const candidate = normalizeString(
        args.workdir || args.cwd || context.workspaceDir || context.workspace || runtime.workspaceDir || runtime.workspaceRoot || runtime.projectRoot,
        process.cwd()
    );
    return path.resolve(candidate);
}

function isInside(parent, child) {
    const relative = path.relative(parent, child);
    return !relative || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function resolveInside(workspaceDir, relativePath) {
    const target = path.resolve(workspaceDir, relativePath || '.');
    return isInside(workspaceDir, target) ? target : null;
}

async function fileExists(filePath) {
    if (!filePath) {
        return false;
    }
    try {
        const stat = await fs.stat(filePath);
        return stat.isFile();
    } catch {
        return false;
    }
}

function runGit(workspaceDir, args = [], { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    return new Promise((resolve) => {
        execFile('git', args.map((entry) => String(entry)), {
            cwd: workspaceDir,
            timeout: timeoutMs,
            windowsHide: true,
            maxBuffer: 2 * 1024 * 1024
        }, (error, stdout = '', stderr = '') => {
            resolve({
                ok: !error,
                exitCode: Number.isFinite(Number(error?.code)) ? Number(error.code) : 0,
                signal: error?.signal || '',
                stdout: String(stdout || ''),
                stderr: String(stderr || ''),
                error: error?.message || ''
            });
        });
    });
}

function parseRemoteList(stdout = '', preferredRemote = 'origin') {
    const remotes = [];
    for (const line of String(stdout || '').split(/\r?\n/)) {
        const match = line.match(/^(\S+)\s+(\S+)\s+\((fetch|push)\)$/);
        if (!match) {
            continue;
        }
        remotes.push({
            name: match[1],
            url: match[2],
            kind: match[3]
        });
    }
    const preferred = remotes.find((entry) => entry.name === preferredRemote && entry.kind === 'push') ||
        remotes.find((entry) => entry.name === preferredRemote) ||
        remotes.find((entry) => entry.kind === 'push') ||
        remotes[0];
    return {
        remotes,
        preferred
    };
}

function parseGitHubRemote(remoteUrl = '') {
    const text = normalizeString(remoteUrl);
    if (!text) {
        return null;
    }
    const cleaned = text.replace(/\.git$/i, '');
    const patterns = [
        /github\.com[:/]([^/\s:]+)\/([^/\s#?]+)$/i,
        /^https?:\/\/github\.com\/([^/\s]+)\/([^/\s#?]+)$/i,
        /^ssh:\/\/git@github\.com\/([^/\s]+)\/([^/\s#?]+)$/i,
        /^git@github\.com:([^/\s]+)\/([^/\s#?]+)$/i
    ];
    for (const pattern of patterns) {
        const match = cleaned.match(pattern);
        if (match) {
            return {
                owner: match[1],
                repo: match[2],
                remoteUrl: text
            };
        }
    }
    return null;
}

function pagesBaseUrl(owner = '', repo = '') {
    if (!owner || !repo) {
        return '';
    }
    const ownerLower = owner.toLowerCase();
    const repoLower = repo.toLowerCase();
    if (repoLower === `${ownerLower}.github.io`) {
        return `https://${owner}.github.io/`;
    }
    return `https://${owner}.github.io/${repo}/`;
}

function pagesTargetUrl(owner = '', repo = '', targetPath = 'index.html') {
    const base = pagesBaseUrl(owner, repo);
    if (!base) {
        return '';
    }
    const normalized = normalizeTargetPath(targetPath);
    if (normalized === 'index.html') {
        return base;
    }
    return new URL(normalized, base).toString();
}

function fetchUrl(targetUrl, {
    method = 'GET',
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxBytes = DEFAULT_MAX_BYTES,
    redirects = 3
} = {}) {
    return new Promise((resolve) => {
        let parsed;
        try {
            parsed = new URL(targetUrl);
        } catch (error) {
            resolve({
                ok: false,
                statusCode: 0,
                finalUrl: targetUrl,
                body: '',
                error: error.message || String(error)
            });
            return;
        }
        const client = parsed.protocol === 'http:' ? http : https;
        const request = client.request(parsed, {
            method,
            timeout: timeoutMs,
            headers: {
                'user-agent': 'AILIS-GitHubPagesTool/1.0',
                accept: 'text/html,application/json,text/plain,*/*'
            }
        }, (response) => {
            const statusCode = Number(response.statusCode) || 0;
            const location = response.headers.location;
            if (location && [301, 302, 303, 307, 308].includes(statusCode) && redirects > 0) {
                response.resume();
                const nextUrl = new URL(location, parsed).toString();
                fetchUrl(nextUrl, { method, timeoutMs, maxBytes, redirects: redirects - 1 }).then(resolve);
                return;
            }
            const chunks = [];
            let totalBytes = 0;
            response.on('data', (chunk) => {
                if (method === 'HEAD') {
                    return;
                }
                totalBytes += chunk.length;
                if (totalBytes <= maxBytes) {
                    chunks.push(chunk);
                }
            });
            response.on('end', () => {
                const body = Buffer.concat(chunks).toString('utf8');
                resolve({
                    ok: statusCode >= 200 && statusCode < 400,
                    statusCode,
                    headers: response.headers,
                    finalUrl: parsed.toString(),
                    body,
                    truncated: totalBytes > maxBytes
                });
            });
        });
        request.on('timeout', () => {
            request.destroy(new Error(`request timeout after ${timeoutMs}ms`));
        });
        request.on('error', (error) => {
            resolve({
                ok: false,
                statusCode: 0,
                finalUrl: parsed.toString(),
                body: '',
                error: error.message || String(error)
            });
        });
        request.end();
    });
}

async function findPagesWorkflows(workspaceDir) {
    const workflowDir = path.join(workspaceDir, '.github', 'workflows');
    let entries = [];
    try {
        entries = await fs.readdir(workflowDir, { withFileTypes: true });
    } catch {
        return [];
    }
    const workflows = [];
    for (const entry of entries) {
        if (!entry.isFile() || !/\.(ya?ml)$/i.test(entry.name)) {
            continue;
        }
        const filePath = path.join(workflowDir, entry.name);
        let content = '';
        try {
            content = await fs.readFile(filePath, 'utf8');
        } catch {
            continue;
        }
        const lower = content.toLowerCase();
        if (!/pages|gh-pages|deploy-pages|upload-pages-artifact|actions-gh-pages/.test(lower)) {
            continue;
        }
        workflows.push({
            path: path.relative(workspaceDir, filePath).replace(/\\/g, '/'),
            usesDeployPages: /actions\/deploy-pages/i.test(content),
            usesUploadPagesArtifact: /upload-pages-artifact/i.test(content),
            uploadsDist: /(?:path|publish_dir)\s*:\s*['"]?\.?\/?dist(?:\/|['"\s#]|$)/i.test(content),
            mentionsGhPagesBranch: /gh-pages|actions-gh-pages/i.test(content),
            preview: content.split(/\r?\n/).slice(0, 40).join('\n')
        });
    }
    return workflows;
}

function pushEvidence(evidence, label, detail, extra = {}) {
    evidence.push({
        label,
        detail,
        ok: extra.ok !== false,
        ...extra
    });
}

function pushBlocker(blockers, code, title, detail, suggestedFix = '') {
    blockers.push({
        code,
        title,
        detail,
        severity: 'critical',
        suggestedFix
    });
}

function buildNextActions({ blockers = [], targetPath = 'index.html', workflowUploadsDist = false } = {}) {
    if (!blockers.length) {
        return ['保留当前发布链路，并用 github_pages.verify_url 做最终验收。'];
    }
    return blockers.map((blocker) => {
        if (blocker.code === 'dist_target_missing' && workflowUploadsDist) {
            return `把 ${targetPath} 复制/构建进 dist/${targetPath}，或把 Pages workflow 的 artifact path 从 dist 改成实际发布目录。`;
        }
        if (blocker.code === 'pages_url_not_ok') {
            return '等待 GitHub Pages workflow 完成后重试 verify_url；如果仍失败，检查 Pages source、workflow artifact 和仓库权限。';
        }
        if (blocker.code === 'github_remote_missing') {
            return '配置 GitHub origin remote，或在 github_pages 参数里显式传 owner/repo。';
        }
        return blocker.suggestedFix || `处理阻塞：${blocker.title || blocker.code}`;
    });
}

function buildHumanSummary(details = {}) {
    const lines = [
        `GitHub Pages 诊断：${details.repository?.owner && details.repository?.repo ? `${details.repository.owner}/${details.repository.repo}` : '仓库未知'}`,
        `目标文件：${details.targetPath || '-'}`,
        `发布 URL：${details.pages?.targetUrl || details.url || '-'}`,
        `关键阻塞：${(details.criticalBlockers || []).length}`,
        `验收证据：${(details.verificationEvidence || []).length}`
    ];
    if (details.criticalBlockers?.length) {
        lines.push('未解决关键阻塞：');
        details.criticalBlockers.forEach((blocker, index) => {
            lines.push(`${index + 1}. ${blocker.title || blocker.code}：${blocker.detail || ''}`);
        });
    }
    if (details.nextActions?.length) {
        lines.push('建议下一步：');
        details.nextActions.forEach((action, index) => {
            lines.push(`${index + 1}. ${action}`);
        });
    }
    return lines.join('\n');
}

async function inspectGitHubPages(args = {}, context = {}, runtime = {}) {
    const workspaceDir = resolveWorkspace(args, context, runtime);
    const targetPath = normalizeTargetPath(args.targetPath || args.path || 'index.html');
    const publishBranch = normalizeString(args.branch || args.publishBranch, DEFAULT_PUBLISH_BRANCH);
    const remoteName = normalizeString(args.remote, 'origin');
    const timeoutMs = normalizeNumber(args.timeoutMs || args.timeout, DEFAULT_TIMEOUT_MS, 1000, 120000);
    const skipNetwork = normalizeBoolean(args.skipNetwork, false);
    const maxBytes = normalizeNumber(args.maxBytes, DEFAULT_MAX_BYTES, 1024, 5 * 1024 * 1024);
    const evidence = [];
    const blockers = [];
    const gaps = [];

    const gitRoot = await runGit(workspaceDir, ['rev-parse', '--show-toplevel'], { timeoutMs });
    if (!gitRoot.ok) {
        return createErrorResult('not_git_repo', '当前工作目录不是可诊断的 Git 仓库。', {
            action: 'inspect',
            workspaceDir,
            stderr: gitRoot.stderr || gitRoot.error
        });
    }
    const repoRoot = path.resolve(gitRoot.stdout.trim() || workspaceDir);
    if (!isInside(repoRoot, workspaceDir) && !isInside(workspaceDir, repoRoot)) {
        gaps.push({
            code: 'workspace_repo_mismatch',
            title: '工作目录和 Git 根目录不一致',
            detail: `workspace=${workspaceDir}, gitRoot=${repoRoot}`
        });
    }
    pushEvidence(evidence, 'Git 仓库已识别', repoRoot, { source: 'git rev-parse' });

    const remoteResult = await runGit(repoRoot, ['remote', '-v'], { timeoutMs });
    const remoteList = parseRemoteList(remoteResult.stdout, remoteName);
    const explicitRepo = normalizeString(args.owner) && normalizeString(args.repo)
        ? { owner: normalizeString(args.owner), repo: normalizeString(args.repo), remoteUrl: '' }
        : null;
    const remoteRepo = explicitRepo || parseGitHubRemote(remoteList.preferred?.url || '');
    if (remoteRepo) {
        pushEvidence(evidence, 'GitHub remote 已识别', `${remoteRepo.owner}/${remoteRepo.repo}`, {
            source: explicitRepo ? 'args' : remoteList.preferred?.url || 'git remote'
        });
    } else {
        pushBlocker(
            blockers,
            'github_remote_missing',
            '缺少可识别的 GitHub remote',
            `没有从 ${remoteName} remote 或 owner/repo 参数识别出 github.com 仓库。`,
            '添加 GitHub origin remote，或在工具参数里传 owner/repo。'
        );
    }

    const branch = await runGit(repoRoot, ['branch', '--show-current'], { timeoutMs });
    const localTarget = resolveInside(repoRoot, targetPath);
    const distTarget = resolveInside(repoRoot, path.join('dist', targetPath));
    const localTargetExists = await fileExists(localTarget);
    const distTargetExists = await fileExists(distTarget);
    if (localTargetExists) {
        pushEvidence(evidence, '仓库根目录存在目标文件', targetPath, { source: 'filesystem' });
    }
    if (distTargetExists) {
        pushEvidence(evidence, 'dist 发布目录存在目标文件', `dist/${targetPath}`, { source: 'filesystem' });
    }

    const workflows = await findPagesWorkflows(repoRoot);
    const workflowUploadsDist = workflows.some((workflow) => workflow.uploadsDist);
    const workflowUsesActionsPages = workflows.some((workflow) => workflow.usesDeployPages || workflow.usesUploadPagesArtifact);
    if (workflows.length) {
        pushEvidence(evidence, 'Pages workflow 已发现', workflows.map((workflow) => workflow.path).join(', '), {
            source: '.github/workflows'
        });
    } else {
        gaps.push({
            code: 'pages_workflow_missing',
            title: '未发现 Pages workflow',
            detail: '未在 .github/workflows 中找到明显的 GitHub Pages 发布工作流。'
        });
    }
    if (workflowUploadsDist && !distTargetExists) {
        pushBlocker(
            blockers,
            'dist_target_missing',
            'workflow 发布 dist，但 dist 缺少目标文件',
            `Pages workflow 上传 ./dist，但 dist/${targetPath} 不存在。根目录文件不会自动出现在 Pages。`,
            `构建或复制 ${targetPath} 到 dist/${targetPath}，或调整 workflow artifact path。`
        );
    }

    let remoteBranch = null;
    let pagesApi = null;
    let publicCheck = null;
    const owner = remoteRepo?.owner || normalizeString(args.owner);
    const repo = remoteRepo?.repo || normalizeString(args.repo);
    const targetUrl = normalizeString(args.url || args.baseUrl)
        ? new URL(targetPath === 'index.html' ? '' : targetPath, normalizeString(args.url || args.baseUrl)).toString()
        : pagesTargetUrl(owner, repo, targetPath);
    if (!skipNetwork && remoteRepo && remoteName) {
        remoteBranch = await runGit(repoRoot, ['ls-remote', '--heads', remoteName, publishBranch], { timeoutMs });
        if (remoteBranch.ok && remoteBranch.stdout.trim()) {
            pushEvidence(evidence, `远端 ${publishBranch} 分支存在`, remoteBranch.stdout.trim().split(/\s+/)[0] || publishBranch, {
                source: 'git ls-remote'
            });
        } else if (!workflowUsesActionsPages) {
            gaps.push({
                code: 'publish_branch_missing',
                title: `远端 ${publishBranch} 分支不可确认`,
                detail: remoteBranch.stderr || remoteBranch.error || `git ls-remote 没有返回 ${publishBranch}`
            });
        }
    }
    if (!skipNetwork && owner && repo) {
        pagesApi = await fetchUrl(`https://api.github.com/repos/${owner}/${repo}/pages`, {
            timeoutMs,
            maxBytes,
            method: 'GET'
        });
        if (pagesApi.statusCode === 200) {
            pushEvidence(evidence, 'GitHub Pages API 可访问', `HTTP ${pagesApi.statusCode}`, {
                source: 'GitHub Pages API',
                url: `https://api.github.com/repos/${owner}/${repo}/pages`
            });
        } else if (pagesApi.statusCode === 404) {
            gaps.push({
                code: 'pages_api_not_found',
                title: 'Pages API 返回 404',
                detail: '仓库可能未开启 Pages、是私有仓库未授权访问，或当前网络/API 权限不足。'
            });
        } else if (!pagesApi.ok) {
            gaps.push({
                code: 'pages_api_unreachable',
                title: 'Pages API 不可访问',
                detail: pagesApi.error || `HTTP ${pagesApi.statusCode}`
            });
        }
    }
    if (!skipNetwork && targetUrl) {
        publicCheck = await fetchUrl(targetUrl, { timeoutMs, maxBytes, method: 'GET' });
        if (publicCheck.ok) {
            pushEvidence(evidence, '公开 Pages URL 可访问', `HTTP ${publicCheck.statusCode} ${targetUrl}`, {
                source: 'public_url',
                url: targetUrl,
                statusCode: publicCheck.statusCode
            });
        } else {
            pushBlocker(
                blockers,
                'pages_url_not_ok',
                '公开 Pages URL 未通过验收',
                publicCheck.error || `访问 ${targetUrl} 返回 HTTP ${publicCheck.statusCode}`,
                '确认 workflow 已成功部署，并检查 Pages source、artifact path 和目标路径。'
            );
        }
    }

    const details = {
        status: 'completed',
        action: normalizeString(args.action, 'inspect'),
        workspaceDir,
        repoRoot,
        repository: {
            owner: owner || '',
            repo: repo || '',
            remote: remoteName,
            remoteUrl: remoteList.preferred?.url || remoteRepo?.remoteUrl || ''
        },
        branch: normalizeString(branch.stdout),
        targetPath,
        publishBranch,
        localFiles: {
            rootTarget: targetPath,
            rootTargetExists: localTargetExists,
            distTarget: `dist/${targetPath}`,
            distTargetExists
        },
        workflow: {
            count: workflows.length,
            files: workflows,
            uploadsDist: workflowUploadsDist,
            usesActionsPages: workflowUsesActionsPages
        },
        pages: {
            baseUrl: pagesBaseUrl(owner, repo),
            targetUrl,
            apiStatusCode: pagesApi?.statusCode ?? null,
            publicStatusCode: publicCheck?.statusCode ?? null,
            publicOk: publicCheck?.ok === true
        },
        gaps,
        criticalBlockers: blockers,
        verificationEvidence: evidence,
        nextActions: buildNextActions({ blockers, targetPath, workflowUploadsDist }),
        publishReady: blockers.length === 0
    };
    return createTextResult(buildHumanSummary(details), details);
}

async function verifyUrl(args = {}, context = {}, runtime = {}) {
    const workspaceDir = resolveWorkspace(args, context, runtime);
    const targetPath = normalizeTargetPath(args.targetPath || args.path || 'index.html');
    const owner = normalizeString(args.owner);
    const repo = normalizeString(args.repo);
    const url = normalizeString(args.url) || pagesTargetUrl(owner, repo, targetPath);
    if (!url) {
        return createErrorResult('needs_config', 'verify_url 需要 url，或 owner/repo/targetPath。', {
            action: 'verify_url',
            workspaceDir
        });
    }
    const timeoutMs = normalizeNumber(args.timeoutMs || args.timeout, DEFAULT_TIMEOUT_MS, 1000, 120000);
    const maxBytes = normalizeNumber(args.maxBytes, DEFAULT_MAX_BYTES, 1024, 5 * 1024 * 1024);
    const expectedStatus = normalizeNumber(args.expectedStatus, 200, 100, 599);
    const expectedText = normalizeString(args.expectedText);
    const response = await fetchUrl(url, { timeoutMs, maxBytes, method: 'GET' });
    const statusMatches = response.statusCode === expectedStatus;
    const textMatches = expectedText ? response.body.includes(expectedText) : true;
    const passed = response.ok && statusMatches && textMatches;
    const blockers = [];
    if (!passed) {
        pushBlocker(
            blockers,
            'url_verification_failed',
            '公开 URL 验收失败',
            [
                `期望 HTTP ${expectedStatus}，实际 HTTP ${response.statusCode || 0}`,
                expectedText && !textMatches ? `页面未包含期望文本：${expectedText}` : '',
                response.error || ''
            ].filter(Boolean).join('；'),
            '等待部署完成或检查 Pages workflow、发布目录和目标路径。'
        );
    }
    const details = {
        status: 'completed',
        action: 'verify_url',
        workspaceDir,
        url,
        targetPath,
        expectedStatus,
        expectedText,
        verification: {
            passed,
            statusCode: response.statusCode,
            finalUrl: response.finalUrl,
            textMatched: textMatches,
            error: response.error || '',
            truncated: response.truncated === true
        },
        criticalBlockers: blockers,
        verificationEvidence: passed
            ? [{
                  label: '公开 URL 验收通过',
                  detail: `HTTP ${response.statusCode} ${url}${expectedText ? `，包含文本“${expectedText}”` : ''}`,
                  ok: true,
                  source: 'public_url',
                  url,
                  statusCode: response.statusCode
              }]
            : [],
        nextActions: buildNextActions({ blockers, targetPath }),
        publishReady: passed
    };
    return createTextResult(buildHumanSummary({
        ...details,
        repository: { owner, repo },
        pages: { targetUrl: url }
    }), details);
}

function schemaResult() {
    return createTextResult({
        tool: GITHUB_PAGES_TOOL_ID,
        description: 'Read-only GitHub Pages and gh-pages deployment diagnostic tool.',
        actions: ['schema', 'inspect', 'diagnose_publish', 'verify_url'],
        examples: [
            {
                action: 'diagnose_publish',
                targetPath: 'about-ailis.html',
                skipNetwork: true
            },
            {
                action: 'verify_url',
                url: 'https://owner.github.io/repo/about-ailis.html',
                expectedStatus: 200
            }
        ]
    }, {
        status: 'completed',
        action: 'schema',
        schema: {
            actions: ['schema', 'inspect', 'diagnose_publish', 'verify_url'],
            readOnly: true
        }
    });
}

async function executeGitHubPagesTool(args = {}, context = {}, runtime = {}) {
    const action = normalizeString(args.action || args.operation || args.intent, 'schema')
        .toLowerCase()
        .replace(/[-\s]+/g, '_');
    if (action === 'schema') {
        return schemaResult();
    }
    if (action === 'inspect' || action === 'diagnose_publish' || action === 'diagnose') {
        return await inspectGitHubPages({ ...args, action }, context, runtime);
    }
    if (action === 'verify_url' || action === 'verify' || action === 'check_url') {
        return await verifyUrl({ ...args, action }, context, runtime);
    }
    return createErrorResult('needs_config', `不支持的 github_pages action：${action}`, {
        action,
        supportedActions: ['schema', 'inspect', 'diagnose_publish', 'verify_url']
    });
}

module.exports = {
    GITHUB_PAGES_TOOL_ID,
    executeGitHubPagesTool,
    parseGitHubRemote,
    normalizeTargetPath
};
