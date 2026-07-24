const fsp = require('fs/promises');
const os = require('os');
const path = require('path');

const ARTIFACT_VERIFIER_TOOL_ID = 'artifact_verifier';
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
const SUPPORTED_FORMATS = new Set(['auto', 'json', 'jsonl', 'csv', 'tsv', 'yaml', 'yml', 'toml', 'markdown', 'md', 'log', 'text']);

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeArray(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function normalizeNumber(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.min(Math.max(parsed, min), max);
}

function maybePath(...parts) {
    if (parts.some((part) => !normalizeString(part))) {
        return '';
    }
    return path.join(...parts);
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

function isPathInside(rootPath, targetPath) {
    const root = path.resolve(rootPath);
    const target = path.resolve(targetPath);
    const rootComparable = process.platform === 'win32' ? root.toLowerCase() : root;
    const targetComparable = process.platform === 'win32' ? target.toLowerCase() : target;
    return targetComparable === rootComparable || targetComparable.startsWith(`${rootComparable}${path.sep}`);
}

function getAllowedRoots(runtime = {}) {
    return uniquePaths([
        runtime.workspaceDir,
        runtime.workspaceRoot,
        runtime.projectRoot,
        os.tmpdir(),
        process.env.TEMP,
        process.env.TMP,
        maybePath(os.homedir(), 'Desktop'),
        maybePath(os.homedir(), 'Documents'),
        maybePath(os.homedir(), 'Downloads')
    ]);
}

function resolveUserPath(inputPath, runtime = {}) {
    const raw = normalizeString(inputPath);
    if (!raw) {
        return '';
    }
    if (path.isAbsolute(raw)) {
        return path.resolve(raw);
    }
    const base = runtime.workspaceDir || runtime.workspaceRoot || runtime.projectRoot || process.cwd();
    return path.resolve(base, raw);
}

function createTextResult(text, details = {}) {
    return {
        content: [{ type: 'text', text }],
        isError: details.ok === false || details.status === 'failed',
        details
    };
}

function createJsonResult(payload, details = {}) {
    return createTextResult(JSON.stringify(payload, null, 2), details);
}

function jsonPreview(value, maxChars = 1200) {
    try {
        const text = JSON.stringify(value);
        return text.length > maxChars ? `${text.slice(0, maxChars - 3)}...` : text;
    } catch {
        return '';
    }
}

function createErrorResult(code, message, details = {}) {
    return createTextResult(message, {
        status: 'failed',
        ok: false,
        code,
        message,
        ...details
    });
}

function normalizeFormat(value, filePath = '', content = '') {
    const explicit = normalizeString(value, 'auto').toLowerCase();
    if (SUPPORTED_FORMATS.has(explicit) && explicit !== 'auto') {
        return explicit === 'yml' ? 'yaml' : explicit === 'md' ? 'markdown' : explicit;
    }
    const ext = path.extname(filePath || '').toLowerCase();
    const byExt = {
        '.json': 'json',
        '.jsonl': 'jsonl',
        '.ndjson': 'jsonl',
        '.csv': 'csv',
        '.tsv': 'tsv',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.toml': 'toml',
        '.md': 'markdown',
        '.markdown': 'markdown',
        '.log': 'log',
        '.txt': 'text'
    };
    if (byExt[ext]) {
        return byExt[ext];
    }
    const trimmed = normalizeString(content);
    if (/^[\[{]/.test(trimmed)) {
        return 'json';
    }
    if (/^\s*#\s+/m.test(content)) {
        return 'markdown';
    }
    if (/^\s*\[[^\]]+\]\s*$/m.test(content) && /^\s*[A-Za-z0-9_.-]+\s*=/m.test(content)) {
        return 'toml';
    }
    if (/^\s*[A-Za-z0-9_.-]+\s*:/m.test(content)) {
        return 'yaml';
    }
    return 'text';
}

function hasPath(value, dottedPath) {
    const parts = normalizeString(dottedPath).split('.').filter(Boolean);
    if (!parts.length) {
        return false;
    }
    let current = value;
    for (const part of parts) {
        if (Array.isArray(current) && /^\d+$/.test(part)) {
            current = current[Number(part)];
        } else if (current && typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, part)) {
            current = current[part];
        } else {
            return false;
        }
    }
    return true;
}

function hasRequiredJsonPath(value, dottedPath) {
    if (hasPath(value, dottedPath)) {
        return true;
    }
    if (Array.isArray(value) && value.length > 0) {
        return value.every((entry) => hasPath(entry, dottedPath));
    }
    return false;
}

function parseDelimited(content, delimiter) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;
    for (let index = 0; index < content.length; index += 1) {
        const char = content[index];
        const next = content[index + 1];
        if (char === '"' && inQuotes && next === '"') {
            cell += '"';
            index += 1;
            continue;
        }
        if (char === '"') {
            inQuotes = !inQuotes;
            continue;
        }
        if (char === delimiter && !inQuotes) {
            row.push(cell);
            cell = '';
            continue;
        }
        if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && next === '\n') {
                index += 1;
            }
            row.push(cell);
            rows.push(row);
            row = [];
            cell = '';
            continue;
        }
        cell += char;
    }
    if (cell.length || row.length) {
        row.push(cell);
        rows.push(row);
    }
    return rows.filter((entry) => entry.some((cellValue) => normalizeString(cellValue)));
}

function collectLineKeys(content, mode) {
    const keys = new Set();
    let section = '';
    for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#') || line.startsWith(';')) {
            continue;
        }
        if (mode === 'toml') {
            const sectionMatch = line.match(/^\[([^\]]+)\]$/);
            if (sectionMatch) {
                section = sectionMatch[1].trim();
                keys.add(section);
                continue;
            }
            const keyMatch = line.match(/^([A-Za-z0-9_.-]+)\s*=/);
            if (keyMatch) {
                const key = keyMatch[1].trim();
                keys.add(key);
                if (section) {
                    keys.add(`${section}.${key}`);
                }
            }
        } else {
            const keyMatch = line.match(/^([A-Za-z0-9_.-]+)\s*:/);
            if (keyMatch) {
                keys.add(keyMatch[1].trim());
            }
        }
    }
    return keys;
}

function addCheck(checks, id, ok, message, details = {}) {
    checks.push({ id, ok: Boolean(ok), message, ...details });
}

function normalizeContract(value) {
    return normalizeString(value).toLowerCase().replace(/[_\s-]+/g, '.');
}

function hasPaperCardContract(args = {}) {
    const contract = normalizeContract(args.contract || args.profile || args.verificationContract || args.verification_contract);
    return ['paper.card', 'paper.card.v1'].includes(contract);
}

function headingMatchesAny(headings, aliases) {
    const lowerHeadings = headings.map((heading) => normalizeString(heading.text).toLowerCase());
    return aliases.some((alias) => {
        const needle = normalizeString(alias).toLowerCase();
        return needle && lowerHeadings.some((heading) => heading.includes(needle));
    });
}

function verifyPaperCardContract(content, headings, checks) {
    const sections = [
        { id: 'research_problem', aliases: ['研究问题', 'research problem', 'research question'] },
        { id: 'core_method', aliases: ['核心方法', '方法', 'core method', 'method'] },
        { id: 'key_contribution', aliases: ['关键贡献', '贡献', 'contribution'] },
        { id: 'limitations', aliases: ['局限性', '局限', 'limitations', 'limitation'] },
        { id: 'reading_recommendation', aliases: ['是否值得深入读', '值得深入读', 'recommendation', 'worth reading'] }
    ];
    for (const section of sections) {
        addCheck(
            checks,
            `paper_card:${section.id}`,
            headingMatchesAny(headings, section.aliases),
            `paper card includes ${section.id} section`
        );
    }
    addCheck(
        checks,
        'paper_card:provenance',
        /(来源|来自|source|provenance)/i.test(content) && /(pdf|arxiv|论文页面|网页|page)/i.test(content),
        'paper card explains whether claims come from the paper page, PDF, or another source'
    );
}

function verifyJson(content, args, checks) {
    const parsed = JSON.parse(content);
    const topLevelType = Array.isArray(parsed) ? 'array' : typeof parsed;
    const metrics = {
        topLevelType,
        itemCount: Array.isArray(parsed) ? parsed.length : undefined,
        keys: parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? Object.keys(parsed).sort() : []
    };
    const requiredKeys = normalizeArray(args.requiredKeys || args.required_fields || args.requiredFields);
    for (const key of requiredKeys) {
        addCheck(checks, `required_key:${key}`, hasRequiredJsonPath(parsed, key), `required key ${key}`);
    }
    const minItems = normalizeNumber(args.minItems ?? args.minRows, 0, 0, 1000000);
    if (minItems > 0) {
        addCheck(checks, 'min_items', Array.isArray(parsed) && parsed.length >= minItems, `array has at least ${minItems} items`, { actual: Array.isArray(parsed) ? parsed.length : 0 });
    }
    return { parsed, metrics };
}

function verifyJsonl(content, args, checks) {
    const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const parsedRows = [];
    lines.forEach((line, index) => {
        try {
            parsedRows.push(JSON.parse(line));
            addCheck(checks, `jsonl_line:${index + 1}`, true, `line ${index + 1} parses as JSON`);
        } catch (error) {
            addCheck(checks, `jsonl_line:${index + 1}`, false, `line ${index + 1} is invalid JSON`, { error: error.message });
        }
    });
    const minRows = normalizeNumber(args.minRows ?? args.minItems, 0, 0, 1000000);
    if (minRows > 0) {
        addCheck(checks, 'min_rows', parsedRows.length >= minRows, `jsonl has at least ${minRows} rows`, { actual: parsedRows.length });
    }
    return {
        parsed: parsedRows,
        metrics: {
            rows: parsedRows.length,
            invalidRows: checks.filter((check) => check.id.startsWith('jsonl_line:') && !check.ok).length
        }
    };
}

function verifyDelimited(content, args, checks, delimiter) {
    const rows = parseDelimited(content, delimiter);
    const headers = rows[0] || [];
    const dataRows = rows.slice(1);
    const requiredColumns = normalizeArray(args.requiredColumns || args.requiredFields || args.required_fields);
    const headerSet = new Set(headers.map((header) => normalizeString(header).toLowerCase()));
    for (const column of requiredColumns) {
        const key = normalizeString(column).toLowerCase();
        addCheck(checks, `required_column:${column}`, headerSet.has(key), `required column ${column}`);
    }
    const minRows = normalizeNumber(args.minRows, 0, 0, 1000000);
    if (minRows > 0) {
        addCheck(checks, 'min_rows', dataRows.length >= minRows, `csv has at least ${minRows} data rows`, { actual: dataRows.length });
    }
    return {
        parsed: rows,
        metrics: {
            rows: dataRows.length,
            totalRows: rows.length,
            columns: headers.length,
            headers
        }
    };
}

function verifyLineConfig(content, args, checks, mode) {
    const keys = collectLineKeys(content, mode);
    const requiredKeys = normalizeArray(args.requiredKeys || args.requiredFields || args.required_fields);
    for (const key of requiredKeys) {
        addCheck(checks, `required_key:${key}`, keys.has(normalizeString(key)), `required key ${key}`);
    }
    const nonCommentLines = content.split(/\r?\n/).filter((line) => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith(';');
    });
    addCheck(checks, `${mode}_non_empty`, nonCommentLines.length > 0, `${mode} has non-comment content`, { actual: nonCommentLines.length });
    return {
        parsed: { keys: Array.from(keys).sort() },
        metrics: {
            keys: Array.from(keys).sort(),
            nonCommentLines: nonCommentLines.length
        }
    };
}

function verifyMarkdown(content, args, checks) {
    const headings = Array.from(content.matchAll(/^(#{1,6})\s+(.+)$/gm)).map((match) => ({
        level: match[1].length,
        text: match[2].trim()
    }));
    const links = Array.from(content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)).map((match) => match[1]);
    const fences = (content.match(/```/g) || []).length;
    const requiredHeadings = normalizeArray(args.requiredHeadings || args.requiredSections || args.requiredFields);
    const headingText = headings.map((heading) => heading.text.toLowerCase());
    for (const heading of requiredHeadings) {
        const needle = normalizeString(heading).toLowerCase();
        addCheck(checks, `required_heading:${heading}`, headingText.some((text) => text.includes(needle)), `required heading ${heading}`);
    }
    const minHeadings = normalizeNumber(args.minHeadings, 0, 0, 100000);
    if (minHeadings > 0) {
        addCheck(checks, 'min_headings', headings.length >= minHeadings, `markdown has at least ${minHeadings} headings`, { actual: headings.length });
    }
    const minLinks = normalizeNumber(args.minLinks, 0, 0, 100000);
    if (minLinks > 0) {
        addCheck(checks, 'min_links', links.length >= minLinks, `markdown has at least ${minLinks} links`, { actual: links.length });
    }
    addCheck(checks, 'balanced_code_fences', fences % 2 === 0, 'markdown code fences are balanced', { fences });
    if (hasPaperCardContract(args)) {
        verifyPaperCardContract(content, headings, checks);
    }
    return {
        parsed: { headings, links },
        metrics: {
            headings: headings.length,
            links: links.length,
            codeFences: fences,
            words: normalizeString(content).split(/\s+/).filter(Boolean).length
        }
    };
}

function verifyLog(content, args, checks) {
    const lines = content.split(/\r?\n/).filter(Boolean);
    const counts = { error: 0, warn: 0, info: 0, debug: 0 };
    for (const line of lines) {
        if (/\b(error|fatal|exception|traceback)\b/i.test(line)) {
            counts.error += 1;
        } else if (/\b(warn|warning)\b/i.test(line)) {
            counts.warn += 1;
        } else if (/\binfo\b/i.test(line)) {
            counts.info += 1;
        } else if (/\bdebug\b/i.test(line)) {
            counts.debug += 1;
        }
    }
    const maxErrors = args.maxErrors === undefined ? null : normalizeNumber(args.maxErrors, 0, 0, 1000000);
    if (maxErrors !== null) {
        addCheck(checks, 'max_errors', counts.error <= maxErrors, `log has at most ${maxErrors} errors`, { actual: counts.error });
    }
    const minLines = normalizeNumber(args.minLines ?? args.minRows, 0, 0, 1000000);
    if (minLines > 0) {
        addCheck(checks, 'min_lines', lines.length >= minLines, `log has at least ${minLines} lines`, { actual: lines.length });
    }
    return {
        parsed: { counts },
        metrics: {
            lines: lines.length,
            ...counts
        }
    };
}

function verifyContains(content, args, checks) {
    const text = content.toLowerCase();
    for (const needle of normalizeArray(args.contains || args.mustContain || args.requiredText)) {
        const normalized = normalizeString(needle);
        if (!normalized) {
            continue;
        }
        addCheck(checks, `contains:${normalized.slice(0, 48)}`, text.includes(normalized.toLowerCase()), `contains ${normalized}`);
    }
}

async function inspectFile(args = {}, runtime = {}, verify = false) {
    const targetPath = resolveUserPath(args.path || args.target || args.file || args.filename, runtime);
    if (!targetPath) {
        return createErrorResult('missing_path', 'artifact_verifier requires path/target/file.', { action: verify ? 'verify' : 'detect' });
    }
    const allowedRoots = getAllowedRoots(runtime);
    if (!allowedRoots.some((root) => isPathInside(root, targetPath))) {
        return createErrorResult('path_outside_workspace', 'artifact_verifier can only read files in workspace/project/temp/user document roots.', {
            action: verify ? 'verify' : 'detect',
            path: targetPath,
            allowedRoots
        });
    }
    let stat;
    try {
        stat = await fsp.stat(targetPath);
    } catch (error) {
        return createErrorResult('file_not_found', `File not found: ${targetPath}`, {
            action: verify ? 'verify' : 'detect',
            path: targetPath,
            error: error.message
        });
    }
    if (!stat.isFile()) {
        return createErrorResult('not_a_file', `Target is not a file: ${targetPath}`, {
            action: verify ? 'verify' : 'detect',
            path: targetPath
        });
    }
    const maxBytes = normalizeNumber(args.maxBytes, DEFAULT_MAX_BYTES, 1, 50 * 1024 * 1024);
    if (stat.size > maxBytes) {
        return createErrorResult('file_too_large', `File is too large for artifact_verifier: ${stat.size} bytes > ${maxBytes}.`, {
            action: verify ? 'verify' : 'detect',
            path: targetPath,
            size: stat.size,
            maxBytes
        });
    }
    const content = await fsp.readFile(targetPath, normalizeString(args.encoding, 'utf8'));
    const text = Buffer.isBuffer(content) ? content.toString(normalizeString(args.encoding, 'utf8')) : String(content);
    const format = normalizeFormat(args.format || args.kind, targetPath, text);
    const baseDetails = {
        status: 'completed',
        ok: true,
        action: verify ? 'verify' : 'detect',
        path: targetPath,
        format,
        size: stat.size,
        mtimeMs: stat.mtimeMs
    };
    if (!verify) {
        return createJsonResult(baseDetails, baseDetails);
    }

    const checks = [];
    addCheck(checks, 'exists', true, 'file exists', { path: targetPath });
    addCheck(checks, 'non_empty', stat.size > 0, 'file is non-empty', { size: stat.size });
    verifyContains(text, args, checks);
    let parsed = null;
    let metrics = {};
    try {
        if (format === 'json') {
            ({ parsed, metrics } = verifyJson(text, args, checks));
        } else if (format === 'jsonl') {
            ({ parsed, metrics } = verifyJsonl(text, args, checks));
        } else if (format === 'csv') {
            ({ parsed, metrics } = verifyDelimited(text, args, checks, ','));
        } else if (format === 'tsv') {
            ({ parsed, metrics } = verifyDelimited(text, args, checks, '\t'));
        } else if (format === 'yaml') {
            ({ parsed, metrics } = verifyLineConfig(text, args, checks, 'yaml'));
        } else if (format === 'toml') {
            ({ parsed, metrics } = verifyLineConfig(text, args, checks, 'toml'));
        } else if (format === 'markdown') {
            ({ parsed, metrics } = verifyMarkdown(text, args, checks));
        } else if (format === 'log') {
            ({ parsed, metrics } = verifyLog(text, args, checks));
        } else {
            metrics = {
                lines: text.split(/\r?\n/).length,
                characters: text.length
            };
        }
    } catch (error) {
        addCheck(checks, 'parse', false, `${format} parse failed`, { error: error.message });
    }
    const ok = checks.every((check) => check.ok);
    const details = {
        ...baseDetails,
        ok,
        status: ok ? 'completed' : 'failed',
        checks,
        metrics,
        parsedPreview: parsed && typeof parsed === 'object' ? jsonPreview(parsed) : undefined
    };
    return createJsonResult(details, details);
}

function schemaResult() {
    return createJsonResult(
        {
            tool: ARTIFACT_VERIFIER_TOOL_ID,
            purpose: 'Read-only verification for structured task artifacts.',
            actions: ['schema', 'detect', 'verify'],
            formats: ['auto', 'json', 'jsonl', 'csv', 'tsv', 'yaml', 'toml', 'markdown', 'log', 'text'],
            contracts: ['paper_card.v1'],
            verifyArgs: {
                path: 'required file path',
                format: 'optional explicit format',
                contract: 'optional named verification contract, e.g. paper_card.v1',
                requiredKeys: 'json/yaml/toml key paths',
                requiredColumns: 'csv/tsv columns',
                requiredHeadings: 'markdown headings',
                contains: 'required text fragments',
                minRows: 'csv/jsonl/log row minimum',
                minItems: 'json array item minimum',
                minHeadings: 'markdown heading minimum',
                minLinks: 'markdown link minimum',
                maxErrors: 'log error maximum'
            }
        },
        {
            status: 'completed',
            ok: true,
            action: 'schema'
        }
    );
}

async function executeArtifactVerifierTool(args = {}, context = {}, runtime = {}) {
    const action = normalizeString(args.action || args.operation || args.intent, 'verify').toLowerCase();
    const effectiveRuntime = {
        workspaceDir: runtime.workspaceDir || context.workspace || context.workspaceDir,
        workspaceRoot: runtime.workspaceRoot || context.workspaceRoot,
        projectRoot: runtime.projectRoot || context.projectRoot
    };
    if (action === 'schema' || action === 'help') {
        return schemaResult();
    }
    if (action === 'detect' || action === 'inspect') {
        return await inspectFile(args, effectiveRuntime, false);
    }
    if (action === 'verify' || action === 'validate' || action === 'check') {
        return await inspectFile(args, effectiveRuntime, true);
    }
    return createErrorResult('unsupported_action', `Unsupported artifact_verifier action: ${action}`, {
        supportedActions: ['schema', 'detect', 'verify']
    });
}

module.exports = {
    ARTIFACT_VERIFIER_TOOL_ID,
    executeArtifactVerifierTool,
    normalizeFormat
};
