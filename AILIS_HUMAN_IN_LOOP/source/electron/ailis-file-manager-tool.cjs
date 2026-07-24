const fs = require('fs');
const fsp = require('fs/promises');
const os = require('os');
const path = require('path');

const FILE_MANAGER_TOOL_ID = 'file_manager';
const DEFAULT_SCAN_LIMIT = 2000;
const DEFAULT_CANDIDATE_LIMIT = 200;
const DEFAULT_MAX_DEPTH = 4;
const DEFAULT_MIN_AGE_DAYS = 7;

const TEMP_EXTENSIONS = new Set([
    '.tmp',
    '.temp',
    '.bak',
    '.old',
    '.log',
    '.dmp',
    '.dump',
    '.crdownload',
    '.part',
    '.download',
    '.cache'
]);

const ORGANIZE_BUCKETS = Object.freeze({
    Images: Object.freeze(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg', '.heic']),
    Documents: Object.freeze(['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf', '.ppt', '.pptx', '.xls', '.xlsx']),
    Archives: Object.freeze(['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz']),
    Videos: Object.freeze(['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv']),
    Audio: Object.freeze(['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a']),
    Code: Object.freeze(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.java', '.go', '.rs', '.cpp', '.c', '.h', '.cs']),
    Data: Object.freeze(['.json', '.csv', '.tsv', '.xml', '.yaml', '.yml', '.sqlite', '.db'])
});

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
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

function normalizeNumber(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.min(Math.max(parsed, min), max);
}

function isPathInside(rootPath, targetPath) {
    const root = path.resolve(rootPath);
    const target = path.resolve(targetPath);
    const rootComparable = process.platform === 'win32' ? root.toLowerCase() : root;
    const targetComparable = process.platform === 'win32' ? target.toLowerCase() : target;
    return targetComparable === rootComparable || targetComparable.startsWith(`${rootComparable}${path.sep}`);
}

function uniquePaths(paths) {
    const seen = new Set();
    const result = [];
    for (const entry of paths) {
        const normalized = normalizeString(entry);
        if (!normalized) {
            continue;
        }
        const resolved = path.resolve(normalized);
        const key = process.platform === 'win32' ? resolved.toLowerCase() : resolved;
        if (!seen.has(key)) {
            seen.add(key);
            result.push(resolved);
        }
    }
    return result;
}

function maybePath(...parts) {
    if (parts.some((part) => !normalizeString(part))) {
        return '';
    }
    return path.join(...parts);
}

function userDir(name) {
    return maybePath(os.homedir(), name);
}

function windowsTempDir() {
    if (process.platform !== 'win32') {
        return '';
    }
    const windir = process.env.WINDIR || 'C:\\Windows';
    return path.join(windir, 'Temp');
}

function getAllowedRoots(runtime = {}) {
    return uniquePaths([
        runtime.workspaceRoot,
        runtime.workspaceDir,
        runtime.projectRoot,
        os.tmpdir(),
        process.env.TEMP,
        process.env.TMP,
        maybePath(process.env.LOCALAPPDATA, 'Temp'),
        windowsTempDir(),
        userDir('Downloads'),
        userDir('Desktop'),
        userDir('Documents'),
        userDir('Pictures'),
        userDir('Videos'),
        userDir('Music')
    ]);
}

function getProfileTargets(profile, runtime = {}) {
    const normalized = normalizeString(profile, 'workspace').toLowerCase();
    const localTemp = maybePath(process.env.LOCALAPPDATA, 'Temp');
    const targetsByProfile = {
        workspace: [runtime.workspaceDir || runtime.workspaceRoot],
        downloads: [userDir('Downloads')],
        desktop: [userDir('Desktop')],
        documents: [userDir('Documents')],
        temp: [os.tmpdir(), process.env.TEMP, process.env.TMP, localTemp],
        c_drive_safe: [
            os.tmpdir(),
            process.env.TEMP,
            process.env.TMP,
            localTemp,
            windowsTempDir(),
            userDir('Downloads')
        ],
        windows_safe_cleanup: [
            os.tmpdir(),
            process.env.TEMP,
            process.env.TMP,
            localTemp,
            windowsTempDir(),
            userDir('Downloads')
        ]
    };
    return uniquePaths(targetsByProfile[normalized] || targetsByProfile.workspace);
}

async function pathExists(targetPath) {
    try {
        await fsp.access(targetPath);
        return true;
    } catch {
        return false;
    }
}

async function safeStat(targetPath) {
    try {
        return await fsp.lstat(targetPath);
    } catch {
        return null;
    }
}

function createTextResult(text, details = {}) {
    return {
        content: text ? [{ type: 'text', text }] : [],
        details
    };
}

function createErrorResult(status, message, details = {}) {
    return {
        content: [{ type: 'text', text: message }],
        isError: true,
        details: {
            status,
            error: message,
            ...details
        }
    };
}

function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) {
        return 'unknown';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }
    return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function resolveUserTarget(rawTarget, runtime = {}) {
    const target = normalizeString(rawTarget);
    if (!target) {
        return '';
    }
    return path.isAbsolute(target)
        ? path.resolve(target)
        : path.resolve(runtime.workspaceDir || runtime.workspaceRoot || process.cwd(), target);
}

function assertTargetAllowed(targetPath, runtime = {}) {
    const allowedRoots = getAllowedRoots(runtime);
    if (!allowedRoots.some((root) => isPathInside(root, targetPath))) {
        return {
            ok: false,
            result: createErrorResult(
                'blocked',
                'file_manager 只允许访问工作区、用户常用目录和安全临时目录。要做 C 盘清理请使用 profile="c_drive_safe"，不会直接扫描整个 C:\\。',
                {
                    target: targetPath,
                    allowedRoots
                }
            )
        };
    }
    return { ok: true, allowedRoots };
}

function classifyEntry(filePath, stat, rootPath, args = {}) {
    const basename = path.basename(filePath);
    const lowerName = basename.toLowerCase();
    const ext = path.extname(lowerName);
    const now = Date.now();
    const minAgeDays = normalizeNumber(args.minAgeDays, DEFAULT_MIN_AGE_DAYS, 0, 3650);
    const ageDays = Math.floor((now - stat.mtimeMs) / 86400000);
    const relativePath = path.relative(rootPath, filePath);

    if (stat.isDirectory()) {
        if (normalizeBoolean(args.includeDependencyDirs, false) && ['node_modules', '.next', 'dist', 'build', 'out'].includes(lowerName)) {
            return {
                path: filePath,
                relativePath,
                type: 'directory',
                size: null,
                sizeText: 'unknown',
                ageDays,
                reason: 'large_generated_directory',
                risk: 'medium',
                recommendedAction: 'review'
            };
        }
        return null;
    }

    if (!stat.isFile()) {
        return null;
    }

    const isTempExtension = TEMP_EXTENSIONS.has(ext);
    const isEditorBackup = /(~|\.swp|\.swo|\.tmp)$/i.test(lowerName);
    const isCrashDump = /\.(dmp|dump|mdmp)$/i.test(lowerName);
    const isPartialDownload = /\.(crdownload|part|download)$/i.test(lowerName);
    const isOldLog = ext === '.log' && ageDays >= minAgeDays;
    const isZeroByte = stat.size === 0 && normalizeBoolean(args.includeEmptyFiles, false);

    let reason = '';
    let risk = 'low';
    if (isCrashDump) {
        reason = 'crash_dump';
        risk = 'low';
    } else if (isPartialDownload) {
        reason = 'partial_download';
        risk = 'medium';
    } else if (isOldLog) {
        reason = 'old_log';
        risk = 'low';
    } else if (isTempExtension || isEditorBackup) {
        reason = 'temporary_or_backup_file';
        risk = ext === '.bak' || ext === '.old' ? 'medium' : 'low';
    } else if (isZeroByte) {
        reason = 'empty_file';
        risk = 'medium';
    }

    if (!reason) {
        return null;
    }

    return {
        path: filePath,
        relativePath,
        type: 'file',
        size: stat.size,
        sizeText: formatBytes(stat.size),
        ageDays,
        mtime: new Date(stat.mtimeMs).toISOString(),
        reason,
        risk,
        recommendedAction: 'quarantine'
    };
}

async function walkForCandidates(rootPath, args = {}) {
    const maxDepth = normalizeNumber(args.maxDepth, DEFAULT_MAX_DEPTH, 0, 12);
    const maxEntries = normalizeNumber(args.maxEntries, DEFAULT_SCAN_LIMIT, 1, 20000);
    const maxCandidates = normalizeNumber(args.maxCandidates, DEFAULT_CANDIDATE_LIMIT, 1, 5000);
    const candidates = [];
    const errors = [];
    let visited = 0;

    async function visit(currentPath, depth) {
        if (visited >= maxEntries || candidates.length >= maxCandidates) {
            return;
        }
        const stat = await safeStat(currentPath);
        if (!stat) {
            errors.push({ path: currentPath, error: 'stat_failed' });
            return;
        }
        if (stat.isSymbolicLink()) {
            return;
        }
        visited += 1;
        const candidate = classifyEntry(currentPath, stat, rootPath, args);
        if (candidate) {
            candidates.push(candidate);
        }
        if (!stat.isDirectory() || depth >= maxDepth) {
            return;
        }
        let entries = [];
        try {
            entries = await fsp.readdir(currentPath);
        } catch (error) {
            errors.push({ path: currentPath, error: error.message || String(error) });
            return;
        }
        for (const entry of entries) {
            if (visited >= maxEntries || candidates.length >= maxCandidates) {
                break;
            }
            await visit(path.join(currentPath, entry), depth + 1);
        }
    }

    await visit(rootPath, 0);
    return { candidates, errors, visited };
}

function summarizeCandidates(targets, scans) {
    const candidates = scans.flatMap((scan) => scan.candidates);
    const totalBytes = candidates.reduce((sum, item) => sum + (Number(item.size) || 0), 0);
    const byReason = {};
    for (const candidate of candidates) {
        byReason[candidate.reason] = (byReason[candidate.reason] || 0) + 1;
    }
    return {
        targets,
        candidateCount: candidates.length,
        totalBytes,
        totalSizeText: formatBytes(totalBytes),
        byReason,
        visited: scans.reduce((sum, scan) => sum + scan.visited, 0),
        errorCount: scans.reduce((sum, scan) => sum + scan.errors.length, 0)
    };
}

async function resolveScanTargets(args = {}, runtime = {}) {
    const explicitTargets = Array.isArray(args.targets)
        ? args.targets
        : normalizeString(args.target || args.path || args.dir || args.directory)
            ? [args.target || args.path || args.dir || args.directory]
            : [];

    const targets = explicitTargets.length
        ? uniquePaths(explicitTargets.map((target) => resolveUserTarget(target, runtime)))
        : getProfileTargets(args.profile || args.preset || 'workspace', runtime);

    const allowed = [];
    const blocked = [];
    for (const target of targets) {
        const guard = assertTargetAllowed(target, runtime);
        if (!guard.ok) {
            blocked.push({ target, details: guard.result.details });
            continue;
        }
        if (await pathExists(target)) {
            allowed.push(target);
        }
    }
    return { allowed, blocked };
}

async function scanFiles(args = {}, context = {}, runtime = {}) {
    const { allowed, blocked } = await resolveScanTargets(args, runtime);
    if (!allowed.length) {
        return createErrorResult('blocked', '没有可扫描的安全目标。', {
            blocked,
            profile: args.profile || args.preset || 'workspace'
        });
    }

    const scans = [];
    for (const target of allowed) {
        const scan = await walkForCandidates(target, args);
        scans.push({ target, ...scan });
    }
    const summary = summarizeCandidates(allowed, scans);
    return createTextResult(
        JSON.stringify(
            {
                action: 'scan',
                status: 'completed',
                summary,
                candidates: scans.flatMap((scan) => scan.candidates),
                blocked
            },
            null,
            2
        ),
        {
            status: 'completed',
            action: 'scan',
            profile: args.profile || args.preset || 'workspace',
            summary,
            candidates: scans.flatMap((scan) => scan.candidates),
            blocked
        }
    );
}

function getBucketForFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    for (const [bucket, extensions] of Object.entries(ORGANIZE_BUCKETS)) {
        if (extensions.includes(ext)) {
            return bucket;
        }
    }
    return 'Other';
}

async function uniqueDestinationPath(targetPath) {
    if (!(await pathExists(targetPath))) {
        return targetPath;
    }
    const dir = path.dirname(targetPath);
    const ext = path.extname(targetPath);
    const base = path.basename(targetPath, ext);
    for (let index = 1; index <= 9999; index += 1) {
        const candidate = path.join(dir, `${base} (${index})${ext}`);
        if (!(await pathExists(candidate))) {
            return candidate;
        }
    }
    throw new Error(`无法为 ${targetPath} 生成不冲突的目标路径。`);
}

async function buildOrganizePlan(args = {}, runtime = {}) {
    const sourceInput = normalizeString(args.source || args.target || args.path || args.dir || args.directory);
    const source = sourceInput
        ? resolveUserTarget(sourceInput, runtime)
        : getProfileTargets(args.profile || args.preset || 'workspace', runtime)[0];
    if (!source) {
        return { error: createErrorResult('needs_config', 'organize 需要 source/target/path 参数，或可解析的 profile。') };
    }
    const sourceGuard = assertTargetAllowed(source, runtime);
    if (!sourceGuard.ok) {
        return { error: sourceGuard.result };
    }
    const destination = resolveUserTarget(args.destination || args.dest || path.join(source, 'Organized'), runtime);
    const destGuard = assertTargetAllowed(destination, runtime);
    if (!destGuard.ok) {
        return { error: destGuard.result };
    }
    if (!(await pathExists(source))) {
        return { error: createErrorResult('not_found', `整理源目录不存在：${source}`, { source }) };
    }

    const entries = await fsp.readdir(source, { withFileTypes: true });
    const plan = [];
    const maxFiles = normalizeNumber(args.maxFiles, 500, 1, 5000);
    for (const entry of entries) {
        if (plan.length >= maxFiles || !entry.isFile()) {
            continue;
        }
        const from = path.join(source, entry.name);
        const bucket = getBucketForFile(entry.name);
        const to = await uniqueDestinationPath(path.join(destination, bucket, entry.name));
        if (path.resolve(from) !== path.resolve(to)) {
            plan.push({ from, to, bucket });
        }
    }
    return { source, destination, plan };
}

async function organizeFiles(args = {}, context = {}, runtime = {}) {
    const dryRun = args.dryRun !== false;
    const planResult = await buildOrganizePlan(args, runtime);
    if (planResult.error) {
        return planResult.error;
    }
    const { source, destination, plan } = planResult;
    if (dryRun) {
        return createTextResult(
            JSON.stringify({ action: 'organize', status: 'planned', dryRun: true, source, destination, moveCount: plan.length, plan }, null, 2),
            {
                status: 'completed',
                action: 'organize',
                dryRun: true,
                source,
                destination,
                moveCount: plan.length,
                plan
            }
        );
    }
    if (context.approved !== true && args.approved !== true) {
        return createErrorResult('needs_approval', '整理文件会移动文件，需要用户确认：context.approved=true。', {
            action: 'organize',
            source,
            destination,
            moveCount: plan.length,
            plan
        });
    }
    const moved = [];
    for (const item of plan) {
        await fsp.mkdir(path.dirname(item.to), { recursive: true });
        await fsp.rename(item.from, item.to);
        moved.push(item);
    }
    return createTextResult(
        JSON.stringify({ action: 'organize', status: 'completed', source, destination, moved }, null, 2),
        {
            status: 'completed',
            action: 'organize',
            source,
            destination,
            moved
        }
    );
}

function buildQuarantinePath(candidate, quarantineRoot, targetRoots) {
    const root = targetRoots.find((target) => isPathInside(target, candidate.path)) || path.parse(candidate.path).root;
    const rootLabel = root.replace(/[:\\/]+/g, '_').replace(/^_+|_+$/g, '') || 'root';
    const relative = path.relative(root, candidate.path);
    return path.join(quarantineRoot, rootLabel, relative);
}

async function quarantineCandidates(candidates, quarantineRoot, targetRoots) {
    const moved = [];
    for (const candidate of candidates) {
        const stat = await safeStat(candidate.path);
        if (!stat || !stat.isFile()) {
            continue;
        }
        const destination = await uniqueDestinationPath(buildQuarantinePath(candidate, quarantineRoot, targetRoots));
        await fsp.mkdir(path.dirname(destination), { recursive: true });
        await fsp.rename(candidate.path, destination);
        moved.push({ from: candidate.path, to: destination, reason: candidate.reason, size: candidate.size });
    }
    return moved;
}

async function permanentlyDeleteCandidates(candidates) {
    const deleted = [];
    for (const candidate of candidates) {
        const stat = await safeStat(candidate.path);
        if (!stat || !stat.isFile()) {
            continue;
        }
        await fsp.rm(candidate.path, { force: false, recursive: false });
        deleted.push({ path: candidate.path, reason: candidate.reason, size: candidate.size });
    }
    return deleted;
}

async function cleanFiles(args = {}, context = {}, runtime = {}) {
    const dryRun = args.dryRun !== false;
    const scanResult = await scanFiles(args, context, runtime);
    if (scanResult.isError) {
        return scanResult;
    }
    const candidates = scanResult.details.candidates || [];
    const targets = scanResult.details.summary?.targets || [];
    const mode = normalizeString(args.mode || args.strategy, 'quarantine').toLowerCase();
    const summary = scanResult.details.summary;

    if (dryRun) {
        return createTextResult(
            JSON.stringify(
                {
                    action: 'clean',
                    status: 'planned',
                    dryRun: true,
                    mode,
                    summary,
                    candidates
                },
                null,
                2
            ),
            {
                status: 'completed',
                action: 'clean',
                dryRun: true,
                mode,
                summary,
                candidates
            }
        );
    }
    if (context.approved !== true && args.approved !== true) {
        return createErrorResult('needs_approval', '清理文件会移动或删除文件，需要用户确认：context.approved=true。默认建议使用 quarantine 隔离模式。', {
            action: 'clean',
            mode,
            summary,
            candidates
        });
    }
    if (mode === 'delete' && !(args.allowPermanentDelete === true && args.dangerous === true)) {
        return createErrorResult('blocked', '永久删除需要同时设置 allowPermanentDelete=true 和 dangerous=true。建议使用默认 quarantine。', {
            action: 'clean',
            mode
        });
    }

    if (mode === 'delete') {
        const deleted = await permanentlyDeleteCandidates(candidates);
        return createTextResult(
            JSON.stringify({ action: 'clean', status: 'completed', mode, deleted }, null, 2),
            {
                status: 'completed',
                action: 'clean',
                mode,
                deleted
            }
        );
    }

    const quarantineRoot = resolveUserTarget(
        args.quarantineDir || path.join(runtime.workspaceRoot || runtime.workspaceDir || process.cwd(), 'tmp', 'ailis-quarantine', new Date().toISOString().replace(/[:.]/g, '-')),
        runtime
    );
    const guard = assertTargetAllowed(quarantineRoot, runtime);
    if (!guard.ok) {
        return guard.result;
    }
    const moved = await quarantineCandidates(candidates, quarantineRoot, targets);
    return createTextResult(
        JSON.stringify({ action: 'clean', status: 'completed', mode: 'quarantine', quarantineRoot, moved }, null, 2),
        {
            status: 'completed',
            action: 'clean',
            mode: 'quarantine',
            quarantineRoot,
            moved
        }
    );
}

function schemaResult() {
    return createTextResult(
        JSON.stringify(
            {
                tool: FILE_MANAGER_TOOL_ID,
                actions: ['schema', 'scan', 'clean', 'organize'],
                profiles: ['workspace', 'downloads', 'desktop', 'documents', 'temp', 'c_drive_safe', 'windows_safe_cleanup'],
                safety: {
                    dryRunDefault: true,
                    destructiveActionsRequireApproval: ['clean', 'organize'],
                    defaultCleanMode: 'quarantine',
                    permanentDeleteRequires: ['context.approved=true', 'allowPermanentDelete=true', 'dangerous=true']
                },
                organizeBuckets: ORGANIZE_BUCKETS
            },
            null,
            2
        ),
        {
            status: 'completed',
            action: 'schema'
        }
    );
}

async function executeFileManagerTool(args = {}, context = {}, runtime = {}) {
    const action = normalizeString(args.action || args.intent || args.operation, 'scan').toLowerCase();
    if (action === 'schema' || action === 'help') {
        return schemaResult();
    }
    if (action === 'scan' || action === 'analyze' || action === 'plan') {
        return await scanFiles(args, context, runtime);
    }
    if (action === 'clean' || action === 'cleanup' || action === 'clear_junk') {
        return await cleanFiles(args, context, runtime);
    }
    if (action === 'organize' || action === 'sort') {
        return await organizeFiles(args, context, runtime);
    }
    return createErrorResult('needs_config', `不支持的 file_manager action：${action}`, {
        supportedActions: ['schema', 'scan', 'clean', 'organize']
    });
}

module.exports = {
    FILE_MANAGER_TOOL_ID,
    executeFileManagerTool,
    getAllowedRoots,
    getProfileTargets,
    ORGANIZE_BUCKETS
};
