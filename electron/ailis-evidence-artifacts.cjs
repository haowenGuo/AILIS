const crypto = require('crypto');

const EVIDENCE_ARTIFACT_VERSION = 1;

const EVIDENCE_ARTIFACT_TYPES = Object.freeze({
    research_source: 'ResearchSourceEvidence',
    research_read_result: 'ResearchReadEvidence',
    grounded_summary: 'GroundedSummaryEvidence',
    issue_context: 'IssueContextEvidence',
    repo_state: 'RepoStateEvidence',
    change_set: 'DiffEvidence',
    safety_check: 'SecretScanEvidence',
    operation_result: 'OperationResultEvidence',
    target_file: 'DocumentTargetEvidence',
    test_failure: 'TestFailureEvidence',
    parsed_content: 'DocumentParseEvidence',
    backup_or_dry_run: 'DocumentProtectionEvidence',
    verification_result: 'VerificationEvidence',
    mailbox_query: 'MailboxQueryEvidence',
    mail_summary: 'MailSummaryEvidence',
    snapshot: 'VisionSnapshotEvidence',
    vision_observation: 'VisionObservationEvidence',
    source_question: 'QuestionEvidence'
});

function normalizeText(value, fallback = '') {
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

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function summarize(value, maxChars = 420) {
    let text = '';
    try {
        text = typeof value === 'string' ? value : JSON.stringify(value);
    } catch {
        text = String(value);
    }
    text = normalizeText(text.replace(/\r\n/g, '\n'));
    return text.length > maxChars ? `${text.slice(0, maxChars - 3)}...` : text;
}

function stableHash(value) {
    return crypto.createHash('sha1').update(String(value || '')).digest('hex').slice(0, 12);
}

function getObservationText(observation = {}) {
    return normalizeText([
        observation.resultText,
        observation.preview,
        summarize(observation.response?.result || observation.response?.details || '', 1200)
    ].filter(Boolean).join('\n'));
}

function getObservationDetails(observation = {}) {
    const result = observation.response?.result || {};
    const structured = result?.structuredContent || result?.structured_content;
    const candidates = [
        structured && typeof structured === 'object' ? structured : null,
        result?.details && typeof result.details === 'object' ? result.details : null,
        observation.response?.details && typeof observation.response.details === 'object' ? observation.response.details : null
    ].filter(Boolean);
    return candidates.reduce((merged, entry) => ({ ...merged, ...entry }), {});
}

function artifactEvidencePayload(details = {}) {
    const artifactId = normalizeText(
        details.artifactId ||
        details.artifact_id ||
        details.contextArtifact?.id ||
        details.artifact?.artifactId ||
        details.artifact?.id
    );
    if (!artifactId && !details.coverage && !details.evidence) {
        return {};
    }
    const evidence = details.evidence && typeof details.evidence === 'object' ? details.evidence : {};
    const coverage = details.coverage && typeof details.coverage === 'object'
        ? details.coverage
        : (evidence.coverage && typeof evidence.coverage === 'object' ? evidence.coverage : null);
    return {
        artifactId: artifactId || normalizeText(evidence.artifactId),
        artifactKind: normalizeText(details.artifactKind || evidence.artifactKind),
        artifactType: normalizeText(details.artifactType || evidence.artifactType),
        artifactAction: normalizeText(details.action || evidence.action),
        sheet: normalizeText(details.sheet || evidence.sheet || coverage?.sheet),
        range: normalizeText(details.range || evidence.range || coverage?.range),
        coverage: coverage ? cloneJson(coverage) : null,
        complete: details.complete === true || evidence.complete === true,
        truncated: details.truncated === true || evidence.truncated === true,
        reasoningReady: details.reasoningReady === true || details.reasoning_ready === true || evidence.reasoningReady === true,
        pinnedEvidenceId: normalizeText(details.pinnedEvidenceId || details.pinned_evidence_id || evidence.evidenceId),
        coveredByEvidence: details.coveredByEvidence && typeof details.coveredByEvidence === 'object'
            ? cloneJson(details.coveredByEvidence)
            : null,
        observationContract: cloneJson(details.observationContract || details.observation_contract || null)
    };
}

function looksLikePdfOrBinaryText(text = '') {
    const normalized = normalizeText(text);
    if (!normalized) {
        return false;
    }
    return /^%PDF-\d\.\d/.test(normalized) ||
        /\bobj\s*<<[\s\S]{0,240}\bstream\b/i.test(normalized) ||
        /\/Filter\s*\/(?:FlateDecode|DCTDecode|LZWDecode|ASCII85Decode)/i.test(normalized) ||
        /\\x00|\u0000/.test(normalized);
}

function extractUrls(text = '') {
    return [...String(text || '').matchAll(/https?:\/\/[^\s"')\]]+/gi)]
        .map((match) => match[0])
        .filter(Boolean)
        .slice(0, 8);
}

function inferPath(args = {}, text = '') {
    const candidates = [
        args.path,
        args.file,
        args.filePath,
        args.cwd,
        args.uri,
        args.resource,
        args.resourceUri
    ];
    const direct = candidates.map((entry) => normalizeText(entry)).find(Boolean);
    if (direct) {
        return direct;
    }
    const match = String(text || '').match(/(?:[A-Za-z]:\\|\.{0,2}\/|[\w.-]+\/)[^\s"']+/);
    return normalizeText(match?.[0] || '');
}

function inferSourceKind(args = {}, text = '') {
    const url = extractUrls(text)[0] || normalizeText(args.url || args.href);
    if (url) {
        if (/arxiv\.org/i.test(url)) {
            return 'arxiv';
        }
        if (/\.pdf(?:$|[?#])/i.test(url)) {
            return 'pdf_url';
        }
        return 'url';
    }
    const uri = normalizeText(args.uri || args.resource || args.resourceUri);
    if (uri) {
        return uri.includes('://') ? 'mcp_resource' : 'resource';
    }
    const path = inferPath(args, text);
    if (path) {
        return /\.pdf$/i.test(path) ? 'pdf_file' : 'file';
    }
    return 'observation';
}

function parseGitBranch(text = '') {
    const normalized = String(text || '');
    const porcelain = normalized.match(/^##\s+([^\s.]+)(?:\.\.\.)?/m);
    if (porcelain) {
        return porcelain[1];
    }
    const branch = normalized.match(/On branch\s+([^\s]+)/i);
    return normalizeText(branch?.[1] || '');
}

function parseChangedFiles(text = '') {
    const files = new Set();
    for (const match of String(text || '').matchAll(/^diff --git a\/(.+?) b\/(.+)$/gm)) {
        files.add(match[2] || match[1]);
    }
    for (const match of String(text || '').matchAll(/^\s*[ MADRCU?!]{1,2}\s+(.+)$/gm)) {
        files.add(match[1].trim());
    }
    return [...files].filter(Boolean).slice(0, 80);
}

function parseCommitHash(text = '') {
    const bracket = String(text || '').match(/\[[^\s\]]+\s+([0-9a-f]{7,40})\]/i);
    if (bracket) {
        return bracket[1];
    }
    const hash = String(text || '').match(/\b[0-9a-f]{7,40}\b/i);
    return normalizeText(hash?.[0] || '');
}

function parseOperation(action = '', text = '') {
    const haystack = `${action}\n${text}`.toLowerCase();
    if (/pull request|\bpr\b/.test(haystack)) {
        return 'pull_request';
    }
    if (/push/.test(haystack)) {
        return 'push';
    }
    if (/commit/.test(haystack)) {
        return 'commit';
    }
    if (/ci|check/.test(haystack)) {
        return 'ci_status';
    }
    return normalizeText(action, 'operation');
}

function confidenceFromText(text = '', base = 0.68) {
    const length = normalizeText(text).length;
    if (length >= 800) {
        return Math.min(0.98, base + 0.2);
    }
    if (length >= 160) {
        return Math.min(0.94, base + 0.14);
    }
    if (length >= 32) {
        return Math.min(0.88, base + 0.08);
    }
    return base;
}

function payloadForArtifact(type, observation = {}) {
    const args = observation.args || {};
    const text = getObservationText(observation);
    const details = getObservationDetails(observation);
    const urls = extractUrls(text);
    const path = inferPath(args, text);
    const artifactPayload = artifactEvidencePayload(details);
    const base = {
        contentChars: text.length,
        textHash: stableHash(text),
        preview: summarize(text, 260),
        ...artifactPayload
    };

    if (type === 'IssueContextEvidence') {
        return {
            ...base,
            issueId: normalizeText(args.instance_id || args.instanceId || args.issueId),
            repo: normalizeText(args.repo || args.repository),
            hasTraceback: /traceback|exception|error|assert/i.test(text),
            hasReproduction: /reproduce|复现|steps|example|```/i.test(text)
        };
    }
    if (type === 'ResearchSourceEvidence') {
        return {
            ...base,
            sourceKind: inferSourceKind(args, text),
            url: urls[0] || normalizeText(args.url || args.href),
            path,
            uri: normalizeText(args.uri || args.resource || args.resourceUri),
            title: normalizeText(observation.title)
        };
    }
    if (type === 'ResearchReadEvidence' || type === 'GroundedSummaryEvidence') {
        const details = getObservationDetails(observation);
        const status = normalizeText(details.status || details.errorCode || details.error_code).toLowerCase();
        const contentType = normalizeText(details.contentType || details.content_type).toLowerCase();
        return {
            ...base,
            sourceKind: inferSourceKind(args, text),
            path,
            url: urls[0] || normalizeText(args.url || args.href),
            excerptCount: text ? Math.max(1, Math.min(12, Math.ceil(text.length / 700))) : 0,
            contentType,
            unsupportedContentType: status === 'unsupported_content_type',
            binaryLike: looksLikePdfOrBinaryText(text) ||
                details.isBinary === true ||
                details.is_binary === true ||
                contentType.includes('application/pdf')
        };
    }
    if (type === 'RepoStateEvidence') {
        return {
            ...base,
            branch: parseGitBranch(text),
            remoteMentioned: /\borigin\/|remote|github\.com/i.test(text),
            changedFiles: parseChangedFiles(text)
        };
    }
    if (type === 'DiffEvidence') {
        const changedFiles = parseChangedFiles(text);
        return {
            ...base,
            changedFiles,
            hasDiff: /diff --git|^\+{3}\s|^-{3}\s|changed files/i.test(text)
        };
    }
    if (type === 'SecretScanEvidence') {
        const query = summarize(args.query || args.pattern || args.search || text, 180);
        const matchCount = Number(args.matchCount ?? args.matches?.length ?? observation.response?.details?.matches?.length ?? 0);
        return {
            ...base,
            scannedPatterns: ['secret', 'token', 'api_key', 'password', 'credential'].filter((word) =>
                `${query}\n${text}`.toLowerCase().includes(word)
            ),
            matchCount: Number.isFinite(matchCount) ? matchCount : 0,
            safe: !/private key|api[_-]?key\s*[:=]\s*['"]?[A-Za-z0-9_-]{12,}|token\s*[:=]\s*['"]?[A-Za-z0-9_-]{12,}/i.test(text)
        };
    }
    if (type === 'OperationResultEvidence') {
        return {
            ...base,
            operation: parseOperation(observation.action, text),
            commitHash: parseCommitHash(text),
            prUrl: urls.find((url) => /pull|\/pr\/|\/pull\//i.test(url)) || '',
            status: normalizeText(observation.status)
        };
    }
    if (type === 'DocumentTargetEvidence') {
        return {
            ...base,
            path,
            size: Number(args.size || observation.response?.details?.size || observation.response?.result?.details?.size || 0),
            fileType: normalizeText(path.split('.').pop())
        };
    }
    if (type === 'TestFailureEvidence') {
        return {
            ...base,
            tests: normalizeArray(args.tests || args.failToPass || args.FAIL_TO_PASS)
                .map((entry) => String(entry))
                .slice(0, 80),
            hasTraceback: /traceback|assert|failed|failure|error|FAIL_TO_PASS/i.test(text),
            command: normalizeText(args.command || args.cmd),
            expectedToFail: true
        };
    }
    if (type === 'DocumentParseEvidence') {
        return {
            ...base,
            path,
            sectionCount: Math.max(0, (text.match(/^#{1,6}\s|\n\s*\d+[.)]\s/gm) || []).length),
            tableLike: /\|.+\||\t/.test(text)
        };
    }
    if (type === 'DocumentProtectionEvidence') {
        return {
            ...base,
            path,
            dryRun: args.dryRun === true || args.dry_run === true || /dry[- ]?run|预演/i.test(text),
            backupMentioned: /backup|备份|copy|hash/i.test(`${observation.action}\n${text}`)
        };
    }
    if (type === 'VerificationEvidence') {
        return {
            ...base,
            path,
            verificationKind: normalizeText(observation.action, 'check'),
            passed: observation.ok === true && !/failed|error|失败|报错/i.test(text)
        };
    }
    if (type === 'MailboxQueryEvidence' || type === 'MailSummaryEvidence') {
        return {
            ...base,
            account: normalizeText(args.account || args.provider),
            query: normalizeText(args.query || args.filter),
            messageCount: Number(args.limit || observation.response?.details?.messages?.length || 0)
        };
    }
    if (type === 'VisionSnapshotEvidence' || type === 'VisionObservationEvidence') {
        return {
            ...base,
            snapshotId: normalizeText(args.snapshotId || observation.response?.details?.snapshotId),
            target: normalizeText(args.target || args.source),
            imagePath: normalizeText(args.imagePath || observation.response?.details?.imagePath),
            bounds: cloneJson(args.bounds || observation.response?.details?.bounds || null)
        };
    }
    if (type === 'QuestionEvidence') {
        return {
            ...base,
            sourceKind: 'user_question',
            complete: true,
            truncated: false,
            reasoningReady: true
        };
    }
    return {
        ...base,
        path,
        urls
    };
}

function validateEvidenceArtifact(artifact = {}) {
    const errors = [];
    if (!artifact || typeof artifact !== 'object' || Array.isArray(artifact)) {
        return { ok: false, errors: ['artifact must be object'] };
    }
    for (const field of ['id', 'type', 'evidenceId', 'taskType', 'observationId']) {
        if (!normalizeText(artifact[field])) {
            errors.push(`${field} is required`);
        }
    }
    if (!artifact.source || typeof artifact.source !== 'object') {
        errors.push('source is required');
    }
    const payload = artifact.payload || {};
    const contentChars = Number(payload.contentChars || 0);

    if (['ResearchReadEvidence', 'GroundedSummaryEvidence', 'IssueContextEvidence', 'DocumentParseEvidence', 'TestFailureEvidence', 'MailSummaryEvidence', 'VisionObservationEvidence', 'QuestionEvidence'].includes(artifact.type) && contentChars < 12) {
        errors.push(`${artifact.type} requires readable content`);
    }
    if (['ResearchReadEvidence', 'GroundedSummaryEvidence'].includes(artifact.type)) {
        if (payload.unsupportedContentType) {
            errors.push(`${artifact.type} cannot be built from unsupported content type`);
        }
        if (payload.binaryLike) {
            errors.push(`${artifact.type} cannot be built from PDF/binary bytes`);
        }
    }
    if (artifact.type === 'ResearchSourceEvidence' && !payload.url && !payload.path && !payload.uri && contentChars < 12) {
        errors.push('ResearchSourceEvidence requires url, path, uri, or readable source text');
    }
    if (artifact.type === 'RepoStateEvidence' && !payload.branch && contentChars < 8) {
        errors.push('RepoStateEvidence requires branch/status text');
    }
    if (artifact.type === 'DiffEvidence' && !payload.hasDiff && !payload.changedFiles?.length && contentChars < 8) {
        errors.push('DiffEvidence requires diff or changed file text');
    }
    if (artifact.type === 'SecretScanEvidence' && !payload.scannedPatterns?.length && contentChars < 8) {
        errors.push('SecretScanEvidence requires scanned pattern context');
    }
    if (artifact.type === 'OperationResultEvidence' && !payload.operation && !payload.commitHash && !payload.prUrl) {
        errors.push('OperationResultEvidence requires operation result');
    }
    if (artifact.type === 'DocumentTargetEvidence' && !payload.path && contentChars < 8) {
        errors.push('DocumentTargetEvidence requires path or file status text');
    }
    if (artifact.type === 'TestFailureEvidence' && !payload.tests?.length && !payload.hasTraceback && contentChars < 8) {
        errors.push('TestFailureEvidence requires failing test or traceback context');
    }
    if (artifact.type === 'DocumentProtectionEvidence' && !payload.dryRun && !payload.backupMentioned && contentChars < 8) {
        errors.push('DocumentProtectionEvidence requires dry-run or backup context');
    }
    if (artifact.type === 'VerificationEvidence' && contentChars < 8 && !payload.verificationKind) {
        errors.push('VerificationEvidence requires check result');
    }
    if (artifact.type === 'VisionSnapshotEvidence' && !payload.snapshotId && !payload.imagePath && !payload.target) {
        errors.push('VisionSnapshotEvidence requires snapshot id, image path, or target');
    }
    return {
        ok: errors.length === 0,
        errors
    };
}

function createEvidenceArtifact({ taskType = 'generic_task', evidenceId = '', observation = {} } = {}) {
    const normalizedEvidenceId = normalizeText(evidenceId);
    const type = EVIDENCE_ARTIFACT_TYPES[normalizedEvidenceId] || 'GenericObservationEvidence';
    const text = getObservationText(observation);
    const id = `artifact-${stableHash(`${taskType}:${normalizedEvidenceId}:${observation.id}:${observation.tool}:${observation.action}:${text}`)}`;
    const artifact = {
        version: EVIDENCE_ARTIFACT_VERSION,
        id,
        type,
        evidenceId: normalizedEvidenceId,
        taskType: normalizeText(taskType, 'generic_task'),
        observationId: normalizeText(observation.id, `observation-${stableHash(text)}`),
        source: {
            tool: normalizeText(observation.tool),
            action: normalizeText(observation.action),
            title: normalizeText(observation.title),
            status: normalizeText(observation.status),
            iteration: Number.isFinite(Number(observation.iteration)) ? Number(observation.iteration) : null
        },
        confidence: confidenceFromText(text),
        summary: summarize(text || observation.title || type, 320),
        payload: payloadForArtifact(type, observation),
        createdAt: new Date().toISOString()
    };
    const validation = validateEvidenceArtifact(artifact);
    return {
        ...artifact,
        validation
    };
}

function getEvidenceArtifactPromptObject(artifact = {}) {
    return {
        id: artifact.id,
        type: artifact.type,
        evidenceId: artifact.evidenceId,
        observationId: artifact.observationId,
        source: artifact.source,
        confidence: artifact.confidence,
        summary: artifact.summary,
        validation: artifact.validation,
        payload: {
            sourceKind: artifact.payload?.sourceKind,
            path: artifact.payload?.path,
            url: artifact.payload?.url,
            uri: artifact.payload?.uri,
            branch: artifact.payload?.branch,
            changedFiles: artifact.payload?.changedFiles?.slice?.(0, 12),
            operation: artifact.payload?.operation,
            commitHash: artifact.payload?.commitHash,
            prUrl: artifact.payload?.prUrl,
            dryRun: artifact.payload?.dryRun,
            backupMentioned: artifact.payload?.backupMentioned,
            passed: artifact.payload?.passed,
            artifactId: artifact.payload?.artifactId,
            artifactKind: artifact.payload?.artifactKind,
            artifactType: artifact.payload?.artifactType,
            artifactAction: artifact.payload?.artifactAction,
            sheet: artifact.payload?.sheet,
            range: artifact.payload?.range,
            coverage: artifact.payload?.coverage,
            complete: artifact.payload?.complete,
            truncated: artifact.payload?.truncated,
            reasoningReady: artifact.payload?.reasoningReady,
            pinnedEvidenceId: artifact.payload?.pinnedEvidenceId,
            coveredByEvidence: artifact.payload?.coveredByEvidence,
            contentChars: artifact.payload?.contentChars
        }
    };
}

function getEvidenceArtifactsPromptObject(artifacts = []) {
    return normalizeArray(artifacts).map(getEvidenceArtifactPromptObject);
}

module.exports = {
    EVIDENCE_ARTIFACT_VERSION,
    EVIDENCE_ARTIFACT_TYPES,
    createEvidenceArtifact,
    getEvidenceArtifactPromptObject,
    getEvidenceArtifactsPromptObject,
    validateEvidenceArtifact
};
