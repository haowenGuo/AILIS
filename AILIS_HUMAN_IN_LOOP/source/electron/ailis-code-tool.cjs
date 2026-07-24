const fs = require('fs');
const fsp = require('fs/promises');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');

const parser = require('@babel/parser');
const traverseModule = require('@babel/traverse');
const generateModule = require('@babel/generator');
const ts = require('typescript');

const CODE_TOOL_ID = 'code';
const DEFAULT_LIMIT = 200;
const DEFAULT_MAX_FILE_BYTES = 512 * 1024;
const DEFAULT_INDEX_FILE_LIMIT = 2000;
const traverse = traverseModule.default || traverseModule;
const generate = generateModule.default || generateModule;

const TEXT_EXTENSIONS = new Set([
    '.cjs',
    '.css',
    '.html',
    '.js',
    '.json',
    '.jsx',
    '.md',
    '.mjs',
    '.ts',
    '.tsx',
    '.txt',
    '.vue',
    '.yaml',
    '.yml'
]);

const DEFAULT_EXCLUDES = new Set([
    '.git',
    '.ailis-code-index',
    '.ailis-rollback',
    'build-cache',
    'dist',
    'node_modules',
    'out',
    'release'
]);

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

function isPathInside(rootPath, targetPath) {
    const root = path.resolve(rootPath);
    const target = path.resolve(targetPath);
    const rootComparable = process.platform === 'win32' ? root.toLowerCase() : root;
    const targetComparable = process.platform === 'win32' ? target.toLowerCase() : target;
    return targetComparable === rootComparable || targetComparable.startsWith(`${rootComparable}${path.sep}`);
}

function resolveTargetPath(rawPath, runtime = {}) {
    const value = normalizeString(rawPath, '.');
    if (value === '~') {
        return os.homedir();
    }
    if (value.startsWith('~/') || value.startsWith(`~${path.sep}`)) {
        return path.resolve(os.homedir(), value.slice(2));
    }
    if (path.isAbsolute(value)) {
        return path.resolve(value);
    }
    return path.resolve(runtime.workspaceDir || runtime.workspaceRoot || process.cwd(), value);
}

function guardPath(targetPath, context = {}, runtime = {}) {
    const workspace = path.resolve(runtime.workspaceDir || runtime.workspaceRoot || process.cwd());
    if (isPathInside(workspace, targetPath)) {
        return null;
    }
    if (context.allowOutsideWorkspace === true || context.allowComputerWideAccess === true) {
        return null;
    }
    return createErrorResult('blocked', 'code 工具默认只访问当前工作区。访问外部路径需要 context.allowOutsideWorkspace=true。', {
        path: targetPath,
        workspace
    });
}

function approvalRequired(action, args, context) {
    if (args.dryRun === true || context.approved === true || args.approved === true) {
        return null;
    }
    return createErrorResult('needs_approval', `${action} 会修改代码或远程状态，需要用户确认：context.approved=true。`, {
        action,
        approval: 'required'
    });
}

async function runExecFile(command, args = [], options = {}) {
    return await new Promise((resolve) => {
        const useShell = process.platform === 'win32' && /^(npm|npx|pnpm|yarn)$/i.test(command);
        execFile(command, args, { windowsHide: true, timeout: 30000, shell: useShell, ...options }, (error, stdout, stderr) => {
            resolve({
                ok: !error,
                exitCode: error?.code ?? 0,
                stdout: String(stdout || ''),
                stderr: String(stderr || ''),
                error: error ? error.message || String(error) : ''
            });
        });
    });
}

async function safeStat(targetPath) {
    try {
        return await fsp.lstat(targetPath);
    } catch {
        return null;
    }
}

function isTextFile(filePath, stat, args = {}) {
    if (!stat?.isFile()) {
        return false;
    }
    const maxBytes = normalizeNumber(args.maxFileBytes, DEFAULT_MAX_FILE_BYTES, 1024, 16 * 1024 * 1024);
    if (stat.size > maxBytes) {
        return false;
    }
    if (TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
        return true;
    }
    return normalizeBoolean(args.includeUnknownText, false);
}

async function walkCodeFiles(root, args = {}) {
    const limit = normalizeNumber(args.limit, DEFAULT_INDEX_FILE_LIMIT, 1, 50000);
    const maxDepth = normalizeNumber(args.maxDepth, 12, 0, 50);
    const excludes = new Set([
        ...DEFAULT_EXCLUDES,
        ...(Array.isArray(args.exclude) ? args.exclude.map((entry) => normalizeString(entry)).filter(Boolean) : [])
    ]);
    const files = [];
    const errors = [];

    async function visit(current, depth) {
        if (files.length >= limit) {
            return;
        }
        const stat = await safeStat(current);
        if (!stat || stat.isSymbolicLink()) {
            return;
        }
        const base = path.basename(current);
        if (excludes.has(base)) {
            return;
        }
        if (stat.isFile()) {
            if (isTextFile(current, stat, args)) {
                files.push({
                    path: current,
                    relativePath: path.relative(root, current) || path.basename(current),
                    size: stat.size,
                    modifiedAt: stat.mtime.toISOString(),
                    ext: path.extname(current).toLowerCase()
                });
            }
            return;
        }
        if (!stat.isDirectory() || depth >= maxDepth) {
            return;
        }
        let entries = [];
        try {
            entries = await fsp.readdir(current);
        } catch (error) {
            errors.push({ path: current, error: error?.message || String(error) });
            return;
        }
        for (const entry of entries) {
            await visit(path.join(current, entry), depth + 1);
            if (files.length >= limit) {
                break;
            }
        }
    }

    await visit(root, 0);
    return { files, errors };
}

function parseSource(source, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const isTypeScript = ext === '.ts' || ext === '.tsx';
    return parser.parse(source, {
        sourceType: 'unambiguous',
        errorRecovery: true,
        plugins: [
            'jsx',
            'classProperties',
            'classPrivateProperties',
            'classPrivateMethods',
            'decorators-legacy',
            'dynamicImport',
            'importMeta',
            ...(isTypeScript ? ['typescript'] : [])
        ]
    });
}

function locOf(node) {
    return node?.loc
        ? {
              line: node.loc.start.line,
              column: node.loc.start.column
          }
        : null;
}

function extractSymbolsFromAst(ast, filePath) {
    const symbols = [];
    traverse(ast, {
        ImportDeclaration(nodePath) {
            symbols.push({
                kind: 'import',
                name: nodePath.node.source?.value || '',
                filePath,
                loc: locOf(nodePath.node)
            });
        },
        ExportNamedDeclaration(nodePath) {
            symbols.push({
                kind: 'export',
                name: nodePath.node.declaration?.id?.name || nodePath.node.source?.value || 'named',
                filePath,
                loc: locOf(nodePath.node)
            });
        },
        ExportDefaultDeclaration(nodePath) {
            symbols.push({
                kind: 'export_default',
                name: nodePath.node.declaration?.id?.name || 'default',
                filePath,
                loc: locOf(nodePath.node)
            });
        },
        FunctionDeclaration(nodePath) {
            if (nodePath.node.id?.name) {
                symbols.push({
                    kind: 'function',
                    name: nodePath.node.id.name,
                    filePath,
                    loc: locOf(nodePath.node)
                });
            }
        },
        ClassDeclaration(nodePath) {
            if (nodePath.node.id?.name) {
                symbols.push({
                    kind: 'class',
                    name: nodePath.node.id.name,
                    filePath,
                    loc: locOf(nodePath.node)
                });
            }
        },
        VariableDeclarator(nodePath) {
            if (nodePath.node.id?.type === 'Identifier') {
                symbols.push({
                    kind: 'variable',
                    name: nodePath.node.id.name,
                    filePath,
                    loc: locOf(nodePath.node)
                });
            }
        }
    });
    return symbols;
}

async function actionSchema(runtime) {
    const schema = {
        tool: CODE_TOOL_ID,
        actions: [
            'schema',
            'git_status',
            'git_diff',
            'git_log',
            'git_branch',
            'git_commit',
            'search',
            'index',
            'semantic_index',
            'symbols',
            'rename_symbol',
            'lsp_status',
            'lsp_diagnostics',
            'test',
            'ci_status',
            'pr_create'
        ],
        workspace: runtime.workspaceDir || runtime.workspaceRoot || process.cwd(),
        mutatingActions: ['git_commit', 'rename_symbol', 'test', 'pr_create']
    };
    return createTextResult(JSON.stringify(schema, null, 2), {
        status: 'completed',
        action: 'schema',
        schema
    });
}

async function actionGit(args, context, runtime, gitArgs, action) {
    const cwd = resolveTargetPath(args.cwd || args.workdir || '.', runtime);
    const guard = guardPath(cwd, context, runtime);
    if (guard) {
        return guard;
    }
    const result = await runExecFile('git', gitArgs, { cwd, timeout: normalizeNumber(args.timeoutMs, 30000, 1000, 300000) });
    if (!result.ok && ![0, 1].includes(result.exitCode)) {
        return createErrorResult('error', result.stderr || result.error || 'git 执行失败。', {
            action,
            cwd,
            exitCode: result.exitCode
        });
    }
    const text = result.stdout || result.stderr;
    return createTextResult(text, {
        status: result.ok || result.exitCode === 1 ? 'completed' : 'error',
        action,
        cwd,
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr
    });
}

async function actionGitCommit(args, context, runtime) {
    const approval = approvalRequired('git_commit', args, context);
    if (approval) {
        return approval;
    }
    const message = normalizeString(args.message || args.m);
    if (!message) {
        return createErrorResult('needs_config', 'git_commit 需要 message 参数。');
    }
    const cwd = resolveTargetPath(args.cwd || args.workdir || '.', runtime);
    const guard = guardPath(cwd, context, runtime);
    if (guard) {
        return guard;
    }
    if (args.dryRun === true) {
        return createTextResult(JSON.stringify({ action: 'git_commit', dryRun: true, cwd, message }, null, 2), {
            status: 'completed',
            action: 'git_commit',
            dryRun: true,
            cwd,
            message
        });
    }
    const result = await runExecFile('git', ['commit', '-m', message], { cwd, timeout: normalizeNumber(args.timeoutMs, 30000, 1000, 300000) });
    if (!result.ok) {
        return createErrorResult('error', result.stderr || result.error || 'git commit 失败。', {
            action: 'git_commit',
            cwd,
            exitCode: result.exitCode,
            stdout: result.stdout,
            stderr: result.stderr
        });
    }
    return createTextResult(result.stdout || result.stderr, {
        status: 'completed',
        action: 'git_commit',
        cwd,
        stdout: result.stdout,
        stderr: result.stderr
    });
}

async function actionSearch(args, context, runtime) {
    const root = resolveTargetPath(args.path || args.dir || '.', runtime);
    const guard = guardPath(root, context, runtime);
    if (guard) {
        return guard;
    }
    const query = normalizeString(args.query || args.text || args.contains || args.name);
    if (!query) {
        return createErrorResult('needs_config', 'code.search 需要 query/text/name 参数。');
    }
    const limit = normalizeNumber(args.limit, DEFAULT_LIMIT, 1, 2000);
    const byName = normalizeBoolean(args.byName, Boolean(args.name));
    if (!byName) {
        const rg = await runExecFile('rg', ['--json', '--max-count', String(limit), query, root], { cwd: root, timeout: 30000 });
        if (rg.ok || rg.exitCode === 1) {
            const matches = [];
            for (const line of rg.stdout.split(/\r?\n/)) {
                if (!line.trim()) {
                    continue;
                }
                try {
                    const event = JSON.parse(line);
                    if (event.type === 'match') {
                        matches.push({
                            path: event.data?.path?.text || '',
                            line: event.data?.line_number || 0,
                            text: event.data?.lines?.text || ''
                        });
                    }
                } catch {}
                if (matches.length >= limit) {
                    break;
                }
            }
            return createTextResult(JSON.stringify({ action: 'search', root, query, matches }, null, 2), {
                status: 'completed',
                action: 'search',
                root,
                query,
                matches
            });
        }
    }

    const { files, errors } = await walkCodeFiles(root, args);
    const matches = [];
    const regex = new RegExp(query.replace(/[.+^${}()|[\]\\]/g, '\\$&'), 'i');
    for (const file of files) {
        if (byName) {
            if (regex.test(path.basename(file.path)) || regex.test(file.relativePath)) {
                matches.push(file);
            }
        } else {
            const text = await fsp.readFile(file.path, 'utf8').catch(() => '');
            const lines = text.split(/\r?\n/);
            for (let index = 0; index < lines.length; index += 1) {
                if (regex.test(lines[index])) {
                    matches.push({ path: file.path, line: index + 1, text: lines[index] });
                    break;
                }
            }
        }
        if (matches.length >= limit) {
            break;
        }
    }
    return createTextResult(JSON.stringify({ action: 'search', root, query, matches, errors }, null, 2), {
        status: 'completed',
        action: 'search',
        root,
        query,
        matches,
        errors
    });
}

async function actionIndex(args, context, runtime) {
    const root = resolveTargetPath(args.path || args.dir || '.', runtime);
    const guard = guardPath(root, context, runtime);
    if (guard) {
        return guard;
    }
    const { files, errors } = await walkCodeFiles(root, args);
    const includeSymbols = normalizeBoolean(args.includeSymbols, args.action === 'semantic_index');
    const symbols = [];
    if (includeSymbols) {
        for (const file of files) {
            if (!/\.[cm]?[jt]sx?$/i.test(file.path)) {
                continue;
            }
            const text = await fsp.readFile(file.path, 'utf8').catch(() => '');
            if (!text) {
                continue;
            }
            try {
                symbols.push(...extractSymbolsFromAst(parseSource(text, file.path), file.path));
            } catch (error) {
                errors.push({ path: file.path, error: error?.message || String(error) });
            }
        }
    }
    const index = {
        action: includeSymbols ? 'semantic_index' : 'index',
        root,
        generatedAt: new Date().toISOString(),
        count: files.length,
        files,
        symbols,
        errors
    };
    return createTextResult(JSON.stringify(index, null, 2), {
        status: 'completed',
        ...index
    });
}

async function actionSymbols(args, context, runtime) {
    const target = resolveTargetPath(args.path || args.file, runtime);
    const guard = guardPath(target, context, runtime);
    if (guard) {
        return guard;
    }
    const text = await fsp.readFile(target, 'utf8').catch(() => null);
    if (text === null) {
        return createErrorResult('not_found', `代码文件不存在：${target}`, { path: target });
    }
    try {
        const symbols = extractSymbolsFromAst(parseSource(text, target), target);
        return createTextResult(JSON.stringify({ action: 'symbols', path: target, symbols }, null, 2), {
            status: 'completed',
            action: 'symbols',
            path: target,
            symbols
        });
    } catch (error) {
        return createErrorResult('parse_error', error?.message || String(error), {
            action: 'symbols',
            path: target
        });
    }
}

async function actionRenameSymbol(args, context, runtime) {
    const approval = approvalRequired('rename_symbol', args, context);
    if (approval) {
        return approval;
    }
    const target = resolveTargetPath(args.path || args.file, runtime);
    const guard = guardPath(target, context, runtime);
    if (guard) {
        return guard;
    }
    const from = normalizeString(args.from || args.oldName || args.symbol);
    const to = normalizeString(args.to || args.newName);
    if (!from || !to || !/^[$A-Z_a-z][$\w]*$/.test(from) || !/^[$A-Z_a-z][$\w]*$/.test(to)) {
        return createErrorResult('needs_config', 'rename_symbol 需要合法的 from/to 标识符。', { from, to });
    }
    const source = await fsp.readFile(target, 'utf8').catch(() => null);
    if (source === null) {
        return createErrorResult('not_found', `代码文件不存在：${target}`, { path: target });
    }
    const ast = parseSource(source, target);
    let replacements = 0;
    traverse(ast, {
        Identifier(nodePath) {
            if (nodePath.node.name === from) {
                nodePath.node.name = to;
                replacements += 1;
            }
        }
    });
    const output = generate(ast, { retainLines: true, comments: true }, source).code;
    const details = {
        status: 'completed',
        action: 'rename_symbol',
        path: target,
        from,
        to,
        replacements,
        dryRun: args.dryRun === true,
        output: args.dryRun === true ? output : undefined
    };
    if (args.dryRun !== true) {
        await fsp.writeFile(target, output, 'utf8');
    }
    return createTextResult(JSON.stringify(details, null, 2), details);
}

async function actionLspStatus(args, context, runtime) {
    const cwd = resolveTargetPath(args.cwd || '.', runtime);
    const guard = guardPath(cwd, context, runtime);
    if (guard) {
        return guard;
    }
    const version = ts.version;
    const tls = await runExecFile(process.platform === 'win32' ? 'where.exe' : 'which', ['typescript-language-server'], { timeout: 5000 });
    return createTextResult(JSON.stringify({
        action: 'lsp_status',
        typescriptVersion: version,
        typescriptLanguageServerAvailable: tls.ok,
        binaryLookup: tls.stdout || tls.stderr || tls.error
    }, null, 2), {
        status: 'completed',
        action: 'lsp_status',
        typescriptVersion: version,
        typescriptLanguageServerAvailable: tls.ok,
        binaryLookup: tls.stdout || tls.stderr || tls.error
    });
}

async function actionLspDiagnostics(args, context, runtime) {
    const target = resolveTargetPath(args.path || args.file || '.', runtime);
    const guard = guardPath(target, context, runtime);
    if (guard) {
        return guard;
    }
    const stat = await safeStat(target);
    if (!stat) {
        return createErrorResult('not_found', `路径不存在：${target}`, { path: target });
    }
    if (stat.isDirectory()) {
        const result = await runExecFile('npx', ['tsc', '--noEmit', '--pretty', 'false'], {
            cwd: target,
            timeout: normalizeNumber(args.timeoutMs, 60000, 1000, 300000)
        });
        return createTextResult(result.stdout || result.stderr || 'tsc completed', {
            status: result.ok ? 'completed' : 'error',
            action: 'lsp_diagnostics',
            path: target,
            exitCode: result.exitCode,
            stdout: result.stdout,
            stderr: result.stderr
        });
    }
    const source = await fsp.readFile(target, 'utf8');
    const output = ts.transpileModule(source, {
        compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022
        },
        fileName: target,
        reportDiagnostics: true
    });
    const diagnostics = (output.diagnostics || []).map((diagnostic) => {
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        const loc = diagnostic.file && typeof diagnostic.start === 'number'
            ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
            : null;
        return {
            code: diagnostic.code,
            category: ts.DiagnosticCategory[diagnostic.category],
            message,
            line: loc ? loc.line + 1 : null,
            column: loc ? loc.character + 1 : null
        };
    });
    return createTextResult(JSON.stringify({ action: 'lsp_diagnostics', path: target, diagnostics }, null, 2), {
        status: diagnostics.length ? 'error' : 'completed',
        action: 'lsp_diagnostics',
        path: target,
        diagnostics
    });
}

async function actionTest(args, context, runtime) {
    const approval = approvalRequired('test', args, context);
    if (approval) {
        return approval;
    }
    const cwd = resolveTargetPath(args.cwd || args.workdir || '.', runtime);
    const guard = guardPath(cwd, context, runtime);
    if (guard) {
        return guard;
    }
    const script = normalizeString(args.script || args.command, 'test');
    const runner = normalizeString(args.runner, 'pnpm');
    const commandArgs = runner === 'npm' ? ['run', script] : ['run', script];
    if (args.dryRun === true) {
        return createTextResult(JSON.stringify({ action: 'test', dryRun: true, cwd, runner, script }, null, 2), {
            status: 'completed',
            action: 'test',
            dryRun: true,
            cwd,
            runner,
            script
        });
    }
    const result = await runExecFile(runner, commandArgs, { cwd, timeout: normalizeNumber(args.timeoutMs, 120000, 1000, 30 * 60 * 1000) });
    return createTextResult(result.stdout || result.stderr, {
        status: result.ok ? 'completed' : 'error',
        action: 'test',
        cwd,
        runner,
        script,
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr
    });
}

async function actionCiStatus(args, context, runtime) {
    const cwd = resolveTargetPath(args.cwd || args.workdir || '.', runtime);
    const guard = guardPath(cwd, context, runtime);
    if (guard) {
        return guard;
    }
    const ghCheck = await runExecFile(process.platform === 'win32' ? 'where.exe' : 'which', ['gh'], { timeout: 5000 });
    if (!ghCheck.ok) {
        return createErrorResult('needs_config', 'ci_status 需要安装并登录 GitHub CLI：gh。', {
            action: 'ci_status',
            lookup: ghCheck.stderr || ghCheck.error
        });
    }
    const limit = String(normalizeNumber(args.limit, 10, 1, 100));
    const result = await runExecFile('gh', ['run', 'list', '--limit', limit], { cwd, timeout: 30000 });
    return createTextResult(result.stdout || result.stderr, {
        status: result.ok ? 'completed' : 'error',
        action: 'ci_status',
        cwd,
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr
    });
}

async function actionPrCreate(args, context, runtime) {
    const approval = approvalRequired('pr_create', args, context);
    if (approval) {
        return approval;
    }
    const cwd = resolveTargetPath(args.cwd || args.workdir || '.', runtime);
    const guard = guardPath(cwd, context, runtime);
    if (guard) {
        return guard;
    }
    const title = normalizeString(args.title);
    const body = normalizeString(args.body);
    if (!title) {
        return createErrorResult('needs_config', 'pr_create 需要 title 参数。', { action: 'pr_create' });
    }
    const ghCheck = await runExecFile(process.platform === 'win32' ? 'where.exe' : 'which', ['gh'], { timeout: 5000 });
    if (!ghCheck.ok) {
        return createErrorResult('needs_config', 'pr_create 需要安装并登录 GitHub CLI：gh。', {
            action: 'pr_create',
            lookup: ghCheck.stderr || ghCheck.error
        });
    }
    if (args.dryRun === true) {
        return createTextResult(JSON.stringify({ action: 'pr_create', dryRun: true, cwd, title, body }, null, 2), {
            status: 'completed',
            action: 'pr_create',
            dryRun: true,
            cwd,
            title,
            body
        });
    }
    const prArgs = ['pr', 'create', '--title', title, '--body', body || ''];
    if (args.draft !== false) {
        prArgs.push('--draft');
    }
    const result = await runExecFile('gh', prArgs, { cwd, timeout: 60000 });
    return createTextResult(result.stdout || result.stderr, {
        status: result.ok ? 'completed' : 'error',
        action: 'pr_create',
        cwd,
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr
    });
}

async function executeCodeTool(args = {}, context = {}, runtime = {}) {
    const action = normalizeString(args.action || args.operation || args.intent, 'schema').toLowerCase();
    if (action === 'schema' || action === 'help') {
        return await actionSchema(runtime);
    }
    if (action === 'git_status' || action === 'status') {
        return await actionGit(args, context, runtime, ['status', '--short', '--branch'], 'git_status');
    }
    if (action === 'git_diff' || action === 'diff') {
        const diffArgs = ['diff'];
        if (args.staged === true) {
            diffArgs.push('--staged');
        }
        if (args.path) {
            diffArgs.push('--', args.path);
        }
        return await actionGit(args, context, runtime, diffArgs, 'git_diff');
    }
    if (action === 'git_log' || action === 'log') {
        return await actionGit(args, context, runtime, ['log', '--oneline', '-n', String(normalizeNumber(args.limit, 10, 1, 200))], 'git_log');
    }
    if (action === 'git_branch' || action === 'branch') {
        return await actionGit(args, context, runtime, ['branch', '--show-current'], 'git_branch');
    }
    if (action === 'git_commit' || action === 'commit') {
        return await actionGitCommit(args, context, runtime);
    }
    if (action === 'search') {
        return await actionSearch(args, context, runtime);
    }
    if (action === 'index' || action === 'semantic_index') {
        return await actionIndex({ ...args, action }, context, runtime);
    }
    if (action === 'symbols' || action === 'outline') {
        return await actionSymbols(args, context, runtime);
    }
    if (action === 'rename_symbol' || action === 'ast_rename') {
        return await actionRenameSymbol(args, context, runtime);
    }
    if (action === 'lsp_status') {
        return await actionLspStatus(args, context, runtime);
    }
    if (action === 'lsp_diagnostics' || action === 'diagnostics') {
        return await actionLspDiagnostics(args, context, runtime);
    }
    if (action === 'test' || action === 'run_tests') {
        return await actionTest(args, context, runtime);
    }
    if (action === 'ci_status') {
        return await actionCiStatus(args, context, runtime);
    }
    if (action === 'pr_create' || action === 'pull_request') {
        return await actionPrCreate(args, context, runtime);
    }
    return createErrorResult('needs_config', `不支持的 code action：${action}`, {
        supportedActions: (await actionSchema(runtime)).details.schema.actions
    });
}

module.exports = {
    CODE_TOOL_ID,
    executeCodeTool,
    parseSource,
    extractSymbolsFromAst
};
