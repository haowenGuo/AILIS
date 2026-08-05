const fsp = require('fs/promises');
const path = require('path');
const { createHash, randomUUID } = require('crypto');

const USER_PROFILE_CURATOR_VERSION = 1;
const DEFAULT_EVIDENCE_LIMIT = 120;
const DEFAULT_EVIDENCE_MAX_CHARS = 42000;
const DEFAULT_ENTRY_MAX_CHARS = 2200;
const DEFAULT_MIN_CONFIDENCE = 0.62;
const DEFAULT_MAX_BATCHES_PER_RUN = 4;
const MAX_BATCHES_PER_RUN = 50;
const OPERATION_LOCK_STALE_MS = 10 * 60 * 1000;
const OPERATION_LOCK_HEARTBEAT_MS = 30 * 1000;
const PROFILE_CATEGORIES = new Set([
    'communication_style',
    'work_style',
    'aesthetic_style',
    'engineering_principles',
    'negative_preferences',
    'decision_preferences',
    'project_memory',
    'relationship_tone'
]);
const AFFINITY_DIMENSIONS = ['trust', 'familiarity', 'warmth', 'friction'];
const PREFERENCE_OPERATIONS = new Set(['set', 'avoid', 'clear', 'observe']);
const PREFERENCE_SCOPES = new Set(['turn', 'session', 'day', 'until_changed', 'persistent']);

function nowIso() {
    return new Date().toISOString();
}

function isProcessAlive(pid) {
    const numericPid = Number(pid);
    if (!Number.isInteger(numericPid) || numericPid <= 0) {
        return false;
    }
    try {
        process.kill(numericPid, 0);
        return true;
    } catch (error) {
        return error?.code === 'EPERM';
    }
}

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

function isPlainObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function clampNumber(value, min, max, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.min(max, Math.max(min, numeric));
}

function stableId(prefix, ...parts) {
    const hash = createHash('sha1')
        .update(parts.map((part) => String(part || '')).join('\n'))
        .digest('hex')
        .slice(0, 14);
    return `${prefix}-${hash}`;
}

function todayKey(iso = nowIso()) {
    return normalizeString(iso, nowIso()).slice(0, 10);
}

function truncateText(value, maxChars = DEFAULT_ENTRY_MAX_CHARS) {
    const text = typeof value === 'string' ? value : JSON.stringify(value || '', null, 2);
    const normalized = normalizeString(text.replace(/\s+/g, ' '));
    if (normalized.length <= maxChars) {
        return normalized;
    }
    return `${normalized.slice(0, Math.max(0, maxChars - 1))}…`;
}

function parseJsonFromText(text = '') {
    if (isPlainObject(text)) {
        return text;
    }
    if (Array.isArray(text)) {
        return text.find(isPlainObject) || null;
    }
    const raw = normalizeString(text);
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    } catch {}
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
        try {
            return JSON.parse(fenced[1].trim());
        } catch {}
    }
    const first = raw.indexOf('{');
    const last = raw.lastIndexOf('}');
    if (first >= 0 && last > first) {
        try {
            return JSON.parse(raw.slice(first, last + 1));
        } catch {}
    }
    const candidates = [];
    let start = -1;
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = 0; index < raw.length; index += 1) {
        const char = raw[index];
        if (inString) {
            if (escaped) {
                escaped = false;
            } else if (char === '\\') {
                escaped = true;
            } else if (char === '"') {
                inString = false;
            }
            continue;
        }
        if (char === '"') {
            inString = true;
            continue;
        }
        if (char === '{') {
            if (depth === 0) {
                start = index;
            }
            depth += 1;
            continue;
        }
        if (char === '}' && depth > 0) {
            depth -= 1;
            if (depth === 0 && start >= 0) {
                candidates.push(raw.slice(start, index + 1));
                start = -1;
            }
        }
    }
    for (let index = candidates.length - 1; index >= 0; index -= 1) {
        try {
            const parsed = JSON.parse(candidates[index]);
            if (isPlainObject(parsed)) {
                return parsed;
            }
        } catch {}
    }
    return null;
}

function collectLlmJsonCandidates(result = {}) {
    const candidates = [];
    const visit = (value) => {
        if (value === null || value === undefined) {
            return;
        }
        if (typeof value === 'string' || isPlainObject(value)) {
            candidates.push(value);
            return;
        }
        if (Array.isArray(value)) {
            for (const item of value) {
                if (typeof item === 'string') {
                    candidates.push(item);
                } else if (item && typeof item === 'object') {
                    visit(item.text);
                    visit(item.content);
                    visit(item.output_text);
                }
            }
        }
    };
    visit(result?.content);
    visit(result?.text);
    visit(result?.output);
    visit(result?.output_text);
    visit(result?.structuredContent);
    visit(result?.message?.content);
    visit(result?.choices?.[0]?.message?.content);
    return candidates;
}

async function readJsonFile(filePath, fallback) {
    try {
        const raw = (await fsp.readFile(filePath, 'utf8')).replace(/^\uFEFF/, '');
        return JSON.parse(raw) ?? fallback;
    } catch {
        return fallback;
    }
}

async function writeJsonFileAtomic(filePath, value) {
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fsp.writeFile(tmpPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await fsp.rename(tmpPath, filePath);
}

async function appendJsonl(filePath, value) {
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    await fsp.appendFile(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

async function readJsonl(filePath) {
    try {
        const text = await fsp.readFile(filePath, 'utf8');
        return text.split(/\r?\n/)
            .filter(Boolean)
            .map((line) => {
                try {
                    return JSON.parse(line);
                } catch {
                    return null;
                }
            })
            .filter(Boolean);
    } catch {
        return [];
    }
}

async function summarizeStagedCurationRuns(filePath) {
    const runs = await readJsonl(filePath);
    const uniqueRuns = Array.from(new Map(
        runs
            .filter((run) => run && run.status !== 'rebuild_completed')
            .map((run, index) => [normalizeString(run.id, `run-${index}`), run])
    ).values());
    return {
        passCount: uniqueRuns.length,
        processedEntryCount: uniqueRuns.reduce((sum, run) => sum + (Number(run.processedEntryCount) || 0), 0),
        evidenceCount: uniqueRuns.reduce((sum, run) => sum + (Number(run.evidenceCount) || 0), 0),
        profileUpdateCount: uniqueRuns.reduce((sum, run) => sum + (Number(run.profileUpdateCount) || 0), 0),
        relationshipUpdateCount: uniqueRuns.reduce((sum, run) => sum + (Number(run.relationshipUpdateCount) || 0), 0)
    };
}

function createDefaultUserProfile() {
    const createdAt = nowIso();
    return {
        version: USER_PROFILE_CURATOR_VERSION,
        createdAt,
        updatedAt: createdAt,
        items: []
    };
}

function createDefaultRelationshipProfile() {
    const createdAt = nowIso();
    return {
        version: USER_PROFILE_CURATOR_VERSION,
        createdAt,
        updatedAt: createdAt,
        items: []
    };
}

function createDefaultAffinityState() {
    const createdAt = nowIso();
    return {
        version: USER_PROFILE_CURATOR_VERSION,
        createdAt,
        updatedAt: createdAt,
        trust: 0.5,
        familiarity: 0.5,
        warmth: 0.5,
        friction: 0.2,
        score: 50,
        repairState: 'stable',
        relationshipStage: 'familiarizing',
        evidenceIds: [],
        history: []
    };
}

function createDefaultCuratorState() {
    const createdAt = nowIso();
    return {
        version: USER_PROFILE_CURATOR_VERSION,
        createdAt,
        updatedAt: createdAt,
        lastRunDate: '',
        cursor: {
            lastProcessedIso: '',
            lastProcessedEntryId: ''
        },
        runCount: 0,
        lastRun: null
    };
}

function normalizeProfile(raw, createDefault) {
    const fallback = createDefault();
    if (!raw || typeof raw !== 'object') {
        return fallback;
    }
    return {
        ...fallback,
        ...raw,
        version: USER_PROFILE_CURATOR_VERSION,
        items: normalizeArray(raw.items).filter(isPlainObject)
    };
}

function normalizeAffinity(raw) {
    const fallback = createDefaultAffinityState();
    if (!raw || typeof raw !== 'object') {
        return fallback;
    }
    const normalized = {
        ...fallback,
        ...raw,
        version: USER_PROFILE_CURATOR_VERSION,
        trust: clampNumber(raw.trust, 0, 1, fallback.trust),
        familiarity: clampNumber(raw.familiarity, 0, 1, fallback.familiarity),
        warmth: clampNumber(raw.warmth, 0, 1, fallback.warmth),
        friction: clampNumber(raw.friction, 0, 1, fallback.friction),
        evidenceIds: normalizeArray(raw.evidenceIds).map(String).filter(Boolean).slice(-200),
        history: normalizeArray(raw.history).filter(isPlainObject).slice(-200)
    };
    normalized.score = Number.isFinite(Number(raw.score))
        ? Math.round(clampNumber(raw.score, 0, 100, fallback.score))
        : deriveAffinityScore(normalized);
    return normalized;
}

function deriveAffinityScore(affinity = {}) {
    const trust = clampNumber(affinity.trust, 0, 1, 0.5);
    const familiarity = clampNumber(affinity.familiarity, 0, 1, 0.5);
    const warmth = clampNumber(affinity.warmth, 0, 1, 0.5);
    const friction = clampNumber(affinity.friction, 0, 1, 0.2);
    const weighted = trust * 0.36 + familiarity * 0.3 + warmth * 0.24 - friction * 0.18;
    return Math.round(clampNumber((weighted / 0.9) * 100, 0, 100, 50));
}

function deriveRelationshipStage(affinity = {}) {
    const trust = clampNumber(affinity.trust, 0, 1, 0.5);
    const familiarity = clampNumber(affinity.familiarity, 0, 1, 0.5);
    const warmth = clampNumber(affinity.warmth, 0, 1, 0.5);
    const friction = clampNumber(affinity.friction, 0, 1, 0.2);
    const score = trust * 0.36 + familiarity * 0.3 + warmth * 0.24 - friction * 0.18;
    if (score < 0.25) {
        return 'strained';
    }
    if (score < 0.42) {
        return 'cautious';
    }
    if (score < 0.62) {
        return 'familiarizing';
    }
    if (score < 0.78) {
        return 'trusted';
    }
    return 'close';
}

function normalizeRepairState(value = '') {
    const normalized = normalizeString(value, 'stable').toLowerCase();
    if (['stable', 'recovering', 'strained', 'warm', 'cautious'].includes(normalized)) {
        return normalized;
    }
    return 'stable';
}

function extractUserEntryText(entry = {}) {
    const payload = entry.payload || {};
    const sessionId = normalizeString(entry.sessionId);
    const source = normalizeString(entry.source).toLowerCase();
    const isTaskAgentEntry = /(^|:)(task-agent|agent|subagent)(:|$)/i.test(sessionId) ||
        source.includes('task-agent') ||
        source.includes('task_agent') ||
        ['task_agent', 'taskagent', 'subagent'].includes(normalizeString(
            entry.meta?.agentRole ||
            payload.agentRole ||
            payload.context?.agentRole ||
            payload.requestPayload?.context?.agentRole
        ).toLowerCase());
    if (entry.type === 'chat.llm_turn' && !isTaskAgentEntry) {
        const userMessage = payload.requestPayload?.memoryUserMessage;
        return typeof userMessage === 'string' ? userMessage : '';
    }
    return '';
}

function renderEvidenceEntry(entry = {}, maxChars = DEFAULT_ENTRY_MAX_CHARS) {
    const userText = truncateText(extractUserEntryText(entry), maxChars);
    return {
        id: entry.id,
        iso: entry.iso,
        type: entry.type,
        source: entry.source,
        sessionId: entry.sessionId,
        runId: entry.runId,
        category: entry.category,
        userText,
        text: userText
    };
}

function buildPromptPayload({
    evidence = [],
    userProfile = createDefaultUserProfile(),
    relationshipProfile = createDefaultRelationshipProfile(),
    affinityState = createDefaultAffinityState(),
    runDate = todayKey(),
    batch = null,
    currentInteractionPreferences = null
} = {}) {
    return {
        runDate,
        batch,
        instruction: 'Extract only evidence-grounded user profile, relationship profile, interaction-preference events, and affinity updates from this Raw Memory Ledger evidence batch.',
        rules: [
            'Return valid JSON only.',
            'sessionId values identify local conversations or client sessions, not different people. Treat the evidence as belonging to the same local user unless the user text explicitly establishes otherwise.',
            'Every profile or relationship update must include evidenceIds from evidence[].id.',
            'Reject one-off emotions, temporary task details, secrets, API keys, and unsupported guesses.',
            'Do not infer private demographics or sensitive attributes.',
            'A single explicit durable instruction, preference, working principle, relationship boundary, or project direction is sufficient for a candidate profile update; do not reject it only because it appears once.',
            'A preference expressed during a task is not automatically temporary: repeated instructions about autonomy, answer style, verification, initiative, or avoiding repeated work may be stable work or communication preferences when supported by multiple evidence items.',
            'Repeated forms of address or recurring relationship framing across several evidence items may support a privacy-preserving relationship pattern. Summarize the pattern without retaining sexual details.',
            'Relationship claims must stay at the level of relationship framing, forms of address, trust, boundaries, and collaboration style. Never retain sexual acts, anatomy, explicit duties, or scene details in a profile claim.',
            'If private or explicit evidence repeatedly contains the same forms of address or relationship framing, ignore the scene content but still preserve the supported high-level pattern. Privacy filtering removes details, not the relationship signal itself.',
            'Do not mention a durable pattern only in daySummary. If the evidence supports a reusable preference or principle, emit a profileUpdates or relationshipUpdates item; otherwise list the relevant evidence in rejectedSignals with a concrete reason.',
            'Repeated corrections about how AILIS should inspect evidence, explain decisions, plan work, modify code, verify results, use tools, or report progress are candidates for work_style, engineering_principles, decision_preferences, communication_style, or negative_preferences.',
            'Use project_memory only for durable facts, decisions, constraints, or state of a named ongoing project. Repeated requests about a topic or content format belong in work_style or decision_preferences, not project_memory.',
            'Use stability=candidate for a first explicit durable signal. Use stability=stable when the user explicitly frames it as an ongoing rule or when multiple evidence items support the same pattern.',
            'Use temporary_task only for details that are specific to the current task and have no likely value in future conversations.',
            'Affinity deltas must be small and justified by evidence.',
            'This input is a batch, not the whole ledger. Do not make global absence claims from one batch.',
            'Internal tool traces are weak evidence unless they quote an explicit user-facing preference or relationship signal.',
            'A preference event must quote an exact substring from evidence[].userText. Never use assistant text as preference evidence.',
            'Do not infer a reciprocal address form from a name the user used for AILIS. A bare nickname is observe, not set.',
            'Use an existing semantic slot when it has the same meaning. Slots are extensible; values are never limited to predefined nicknames or styles.'
        ],
        allowedProfileCategories: Array.from(PROFILE_CATEGORIES),
        currentUserProfile: userProfile.items.slice(-120),
        currentRelationshipProfile: relationshipProfile.items.slice(-80),
        currentInteractionPreferences,
        currentAffinityState: {
            trust: affinityState.trust,
            familiarity: affinityState.familiarity,
            warmth: affinityState.warmth,
            friction: affinityState.friction,
            repairState: affinityState.repairState,
            relationshipStage: affinityState.relationshipStage
        },
        evidence
    };
}

function buildSystemPrompt() {
    return [
        'You are AILIS Memory Curator.',
        'Your job is to learn from Raw Memory Ledger evidence batches and propose structured, auditable memory patches.',
        'The ledger can span many local session IDs for one person and can include noisy task requests. Session IDs are not user identities.',
        'You must be evidence-bound and JSON-only. Preserve explicit durable user intent as candidate memory while rejecting unsupported inference.',
        'Do not write a general summary. Output only the requested JSON object.'
    ].join('\n');
}

function buildUserPrompt(payload) {
    return [
        'Analyze the following AILIS Raw Memory Ledger evidence.',
        'Return JSON with this schema:',
        JSON.stringify({
            daySummary: 'brief evidence-grounded summary',
            profileUpdates: [
                {
                    category: 'communication_style|work_style|aesthetic_style|engineering_principles|negative_preferences|decision_preferences|project_memory|relationship_tone',
                    claim: 'specific stable user preference or principle',
                    operation: 'add_or_merge|deactivate',
                    confidence: 0.0,
                    stability: 'candidate|stable',
                    evidenceIds: ['raw-entry-id'],
                    reason: 'why this should be remembered'
                }
            ],
            relationshipUpdates: [
                {
                    claim: 'relationship pattern or collaboration signal',
                    operation: 'add_or_merge|deactivate',
                    confidence: 0.0,
                    stability: 'candidate|stable',
                    evidenceIds: ['raw-entry-id'],
                    reason: 'why this matters'
                }
            ],
            preferenceEvents: [
                {
                    slot: 'extensible semantic slot, e.g. address.user_to_ailis, address.ailis_to_user, tone.response, style.length',
                    operation: 'set|avoid|clear|observe',
                    value: 'preference value; may be empty only for clear',
                    scope: 'turn|session|day|until_changed|persistent',
                    explicitness: 'explicit|implicit',
                    confidence: 0.0,
                    evidenceId: 'raw-entry-id',
                    evidenceQuote: 'exact substring copied from evidence[].userText',
                    reason: 'brief explanation of scope and operation'
                }
            ],
            affinityUpdate: {
                trustDelta: 0.0,
                familiarityDelta: 0.0,
                warmthDelta: 0.0,
                frictionDelta: 0.0,
                repairState: 'stable|recovering|strained|warm|cautious',
                reason: 'brief evidence-grounded reason',
                evidenceIds: ['raw-entry-id']
            },
            rejectedSignals: [
                {
                    evidenceId: 'raw-entry-id',
                    reason: 'one_off_emotion|temporary_task|insufficient_evidence|secret_or_private|unsupported_guess'
                }
            ]
        }, null, 2),
        '',
        'Input:',
        JSON.stringify(payload, null, 2)
    ].join('\n');
}

function evidenceIdSet(evidence = []) {
    return new Set(evidence.map((entry) => entry.id).filter(Boolean));
}

function filterEvidenceIds(ids = [], allowed = new Set()) {
    return normalizeArray(ids).map(String).filter((id) => allowed.has(id));
}

function normalizeOperation(value = '') {
    const normalized = normalizeString(value, 'add_or_merge').toLowerCase();
    if (['deactivate', 'delete', 'remove', 'disable'].includes(normalized)) {
        return 'deactivate';
    }
    return 'add_or_merge';
}

function normalizeStability(value = '') {
    const normalized = normalizeString(value, 'candidate').toLowerCase();
    return normalized === 'stable' ? 'stable' : 'candidate';
}

function normalizeProfileUpdate(update = {}, allowedEvidence = new Set(), minConfidence = DEFAULT_MIN_CONFIDENCE) {
    if (!isPlainObject(update)) {
        return null;
    }
    const category = normalizeString(update.category, 'communication_style');
    const claim = normalizeString(update.claim);
    const confidence = clampNumber(update.confidence, 0, 1, 0);
    const evidenceIds = filterEvidenceIds(update.evidenceIds, allowedEvidence);
    if (!PROFILE_CATEGORIES.has(category) || !claim || confidence < minConfidence || !evidenceIds.length) {
        return null;
    }
    return {
        category,
        claim,
        operation: normalizeOperation(update.operation),
        confidence,
        stability: normalizeStability(update.stability),
        evidenceIds,
        reason: normalizeString(update.reason)
    };
}

function normalizeRelationshipUpdate(update = {}, allowedEvidence = new Set(), minConfidence = DEFAULT_MIN_CONFIDENCE) {
    if (!isPlainObject(update)) {
        return null;
    }
    const claim = normalizeString(update.claim);
    const confidence = clampNumber(update.confidence, 0, 1, 0);
    const evidenceIds = filterEvidenceIds(update.evidenceIds, allowedEvidence);
    if (!claim || confidence < minConfidence || !evidenceIds.length) {
        return null;
    }
    return {
        claim,
        operation: normalizeOperation(update.operation),
        confidence,
        stability: normalizeStability(update.stability),
        evidenceIds,
        reason: normalizeString(update.reason)
    };
}

function normalizePreferenceEvent(update = {}, evidenceById = new Map(), minConfidence = DEFAULT_MIN_CONFIDENCE) {
    if (!isPlainObject(update)) {
        return null;
    }
    const slot = normalizeString(update.slot).toLowerCase();
    const operation = normalizeString(update.operation, 'observe').toLowerCase();
    const scope = normalizeString(update.scope, 'session').toLowerCase();
    const value = normalizeString(update.value);
    const confidence = clampNumber(update.confidence, 0, 1, 0);
    const evidenceId = normalizeString(update.evidenceId || normalizeArray(update.evidenceIds)[0]);
    const evidenceQuote = normalizeString(update.evidenceQuote || update.quote);
    const evidence = evidenceById.get(evidenceId);
    const userText = normalizeString(evidence?.userText);
    if (
        !/^[a-z][a-z0-9_.-]{2,79}$/.test(slot) ||
        !PREFERENCE_OPERATIONS.has(operation) ||
        !PREFERENCE_SCOPES.has(scope) ||
        (!value && operation !== 'clear') ||
        confidence < minConfidence ||
        !evidence ||
        !evidenceQuote ||
        !userText.includes(evidenceQuote)
    ) {
        return null;
    }
    return {
        id: stableId('preference-event', evidenceId, slot, operation, value, scope, evidenceQuote),
        slot,
        operation,
        value,
        scope,
        explicitness: normalizeString(update.explicitness, operation === 'observe' ? 'implicit' : 'explicit').toLowerCase() === 'explicit'
            ? 'explicit'
            : 'implicit',
        confidence,
        observedAt: normalizeString(evidence.iso, nowIso()),
        turnId: normalizeString(evidence.runId, evidenceId),
        sessionId: normalizeString(evidence.sessionId),
        evidence: {
            messageId: evidenceId,
            quote: evidenceQuote
        },
        reason: normalizeString(update.reason)
    };
}

function mergeEvidenceIds(current = [], next = []) {
    return Array.from(new Set([...normalizeArray(current), ...normalizeArray(next)].map(String).filter(Boolean))).slice(-40);
}

function upsertProfileItem(profile, update, runIso) {
    const id = stableId('profile', update.category, update.claim.toLowerCase());
    const existing = profile.items.find((item) => item.id === id);
    if (update.operation === 'deactivate') {
        if (existing) {
            existing.status = 'inactive';
            existing.updatedAt = runIso;
            existing.lastSeen = runIso;
            existing.evidenceIds = mergeEvidenceIds(existing.evidenceIds, update.evidenceIds);
            existing.reason = update.reason || existing.reason || '';
        }
        return existing || null;
    }
    if (existing) {
        existing.status = 'active';
        existing.updatedAt = runIso;
        existing.lastSeen = runIso;
        existing.confidence = Math.max(Number(existing.confidence) || 0, update.confidence);
        existing.stability = existing.stability === 'stable' || update.stability === 'stable' ? 'stable' : 'candidate';
        existing.evidenceIds = mergeEvidenceIds(existing.evidenceIds, update.evidenceIds);
        existing.reason = update.reason || existing.reason || '';
        existing.observationCount = Number(existing.observationCount || 1) + 1;
        return existing;
    }
    const item = {
        id,
        category: update.category,
        claim: update.claim,
        confidence: update.confidence,
        stability: update.stability,
        status: 'active',
        evidenceIds: update.evidenceIds,
        reason: update.reason,
        firstSeen: runIso,
        lastSeen: runIso,
        createdAt: runIso,
        updatedAt: runIso,
        observationCount: 1
    };
    profile.items.push(item);
    return item;
}

function upsertRelationshipItem(profile, update, runIso) {
    const id = stableId('relationship', update.claim.toLowerCase());
    const existing = profile.items.find((item) => item.id === id);
    if (update.operation === 'deactivate') {
        if (existing) {
            existing.status = 'inactive';
            existing.updatedAt = runIso;
            existing.lastSeen = runIso;
            existing.evidenceIds = mergeEvidenceIds(existing.evidenceIds, update.evidenceIds);
            existing.reason = update.reason || existing.reason || '';
        }
        return existing || null;
    }
    if (existing) {
        existing.status = 'active';
        existing.updatedAt = runIso;
        existing.lastSeen = runIso;
        existing.confidence = Math.max(Number(existing.confidence) || 0, update.confidence);
        existing.stability = existing.stability === 'stable' || update.stability === 'stable' ? 'stable' : 'candidate';
        existing.evidenceIds = mergeEvidenceIds(existing.evidenceIds, update.evidenceIds);
        existing.reason = update.reason || existing.reason || '';
        existing.observationCount = Number(existing.observationCount || 1) + 1;
        return existing;
    }
    const item = {
        id,
        claim: update.claim,
        confidence: update.confidence,
        stability: update.stability,
        status: 'active',
        evidenceIds: update.evidenceIds,
        reason: update.reason,
        firstSeen: runIso,
        lastSeen: runIso,
        createdAt: runIso,
        updatedAt: runIso,
        observationCount: 1
    };
    profile.items.push(item);
    return item;
}

function normalizeAffinityUpdate(raw = {}, allowedEvidence = new Set()) {
    if (!isPlainObject(raw)) {
        return null;
    }
    const evidenceIds = filterEvidenceIds(raw.evidenceIds, allowedEvidence);
    if (!evidenceIds.length) {
        return null;
    }
    return {
        trustDelta: clampNumber(raw.trustDelta, -0.05, 0.05, 0),
        familiarityDelta: clampNumber(raw.familiarityDelta, -0.05, 0.05, 0),
        warmthDelta: clampNumber(raw.warmthDelta, -0.05, 0.05, 0),
        frictionDelta: clampNumber(raw.frictionDelta, -0.05, 0.05, 0),
        repairState: normalizeRepairState(raw.repairState),
        reason: normalizeString(raw.reason),
        evidenceIds
    };
}

function applyAffinityUpdate(affinity, update, runIso) {
    if (!update) {
        return false;
    }
    affinity.trust = clampNumber(affinity.trust + update.trustDelta, 0, 1, 0.5);
    affinity.familiarity = clampNumber(affinity.familiarity + update.familiarityDelta, 0, 1, 0.5);
    affinity.warmth = clampNumber(affinity.warmth + update.warmthDelta, 0, 1, 0.5);
    affinity.friction = clampNumber(affinity.friction + update.frictionDelta, 0, 1, 0.2);
    affinity.score = deriveAffinityScore(affinity);
    affinity.repairState = update.repairState;
    affinity.relationshipStage = deriveRelationshipStage(affinity);
    affinity.updatedAt = runIso;
    affinity.evidenceIds = mergeEvidenceIds(affinity.evidenceIds, update.evidenceIds).slice(-200);
    affinity.history = normalizeArray(affinity.history).concat({
        id: randomUUID(),
        iso: runIso,
        ...update,
        state: {
            trust: affinity.trust,
            familiarity: affinity.familiarity,
            warmth: affinity.warmth,
            friction: affinity.friction,
            repairState: affinity.repairState,
            relationshipStage: affinity.relationshipStage
        }
    }).slice(-200);
    return true;
}

function normalizeBatchLimit(value, fallback = DEFAULT_MAX_BATCHES_PER_RUN) {
    return Math.max(1, Math.min(Number(value) || fallback, MAX_BATCHES_PER_RUN));
}

function cursorForEntry(entry = {}, fallbackIso = nowIso()) {
    return {
        lastProcessedIso: normalizeString(entry.iso, fallbackIso),
        lastProcessedEntryId: normalizeString(entry.id)
    };
}

class AILISUserProfileCurator {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.rootDir = path.resolve(options.rootDir || path.join(this.workspaceRoot, '.ailis-state', 'memory'));
        this.rawMemoryLedger = options.rawMemoryLedger || null;
        this.preferenceState = options.preferenceState || null;
        this.llmClient = typeof options.llmClient === 'function' ? options.llmClient : null;
        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () => {};
        this.profilePath = path.join(this.rootDir, 'user-profile.json');
        this.relationshipPath = path.join(this.rootDir, 'relationship-profile.json');
        this.affinityPath = path.join(this.rootDir, 'affinity-state.json');
        this.statePath = path.join(this.rootDir, 'profile-curation-state.json');
        this.runsPath = path.join(this.rootDir, 'profile-curation-runs.jsonl');
        this.rebuildManifestPath = path.join(this.rootDir, 'profile-rebuild-state.json');
        this.operationLockPath = path.join(this.rootDir, 'profile-curation.lock.json');
        this.activeOperation = null;
        this.lastError = '';
    }

    async acquireOperationLock(operation) {
        await fsp.mkdir(this.rootDir, { recursive: true });
        const token = randomUUID();
        const writeLock = async () => {
            const handle = await fsp.open(this.operationLockPath, 'wx');
            try {
                await handle.writeFile(`${JSON.stringify({
                    version: USER_PROFILE_CURATOR_VERSION,
                    token,
                    operation,
                    pid: process.pid,
                    startedAt: nowIso(),
                    updatedAt: nowIso()
                }, null, 2)}\n`, 'utf8');
            } finally {
                await handle.close();
            }
        };
        try {
            await writeLock();
        } catch (error) {
            if (error?.code !== 'EEXIST') {
                throw error;
            }
            const existing = await readJsonFile(this.operationLockPath, null);
            const updatedAtMs = Date.parse(existing?.updatedAt || existing?.startedAt || '');
            const staleByTime = !Number.isFinite(updatedAtMs) || Date.now() - updatedAtMs > OPERATION_LOCK_STALE_MS;
            const stale = staleByTime || !isProcessAlive(existing?.pid);
            if (!stale) {
                return {
                    ok: false,
                    status: 'profile_curation_already_running',
                    activeOperation: existing || null
                };
            }
            await fsp.rm(this.operationLockPath, { force: true });
            try {
                await writeLock();
            } catch (retryError) {
                if (retryError?.code !== 'EEXIST') {
                    throw retryError;
                }
                return {
                    ok: false,
                    status: 'profile_curation_already_running',
                    activeOperation: await readJsonFile(this.operationLockPath, null)
                };
            }
        }
        const heartbeat = setInterval(async () => {
            try {
                const current = await readJsonFile(this.operationLockPath, null);
                if (current?.token !== token) {
                    return;
                }
                await writeJsonFileAtomic(this.operationLockPath, {
                    ...current,
                    updatedAt: nowIso()
                });
            } catch (error) {
                this.lastError = normalizeString(error?.message, String(error));
            }
        }, OPERATION_LOCK_HEARTBEAT_MS);
        heartbeat.unref?.();
        return { ok: true, token, operation, heartbeat };
    }

    async releaseOperationLock(lock) {
        if (!lock?.ok) {
            return;
        }
        clearInterval(lock.heartbeat);
        const current = await readJsonFile(this.operationLockPath, null);
        if (current?.token === lock.token) {
            await fsp.rm(this.operationLockPath, { force: true });
        }
    }

    async runExclusiveOperation(operation, callback) {
        if (this.activeOperation) {
            return {
                ok: false,
                status: 'profile_curation_already_running',
                activeOperation: { ...this.activeOperation }
            };
        }
        const lock = await this.acquireOperationLock(operation);
        if (!lock.ok) {
            return lock;
        }
        this.activeOperation = {
            operation,
            token: lock.token,
            startedAt: nowIso()
        };
        try {
            return await callback();
        } finally {
            this.activeOperation = null;
            await this.releaseOperationLock(lock);
        }
    }

    async loadState() {
        const [state, userProfile, relationshipProfile, affinityState] = await Promise.all([
            readJsonFile(this.statePath, createDefaultCuratorState()),
            readJsonFile(this.profilePath, createDefaultUserProfile()),
            readJsonFile(this.relationshipPath, createDefaultRelationshipProfile()),
            readJsonFile(this.affinityPath, createDefaultAffinityState())
        ]);
        return {
            state: {
                ...createDefaultCuratorState(),
                ...state,
                cursor: {
                    ...createDefaultCuratorState().cursor,
                    ...(state?.cursor || {})
                }
            },
            userProfile: normalizeProfile(userProfile, createDefaultUserProfile),
            relationshipProfile: normalizeProfile(relationshipProfile, createDefaultRelationshipProfile),
            affinityState: normalizeAffinity(affinityState)
        };
    }

    async getState() {
        const [loaded, rebuild] = await Promise.all([
            this.loadState(),
            readJsonFile(this.rebuildManifestPath, null)
        ]);
        return {
            ok: true,
            status: 'ok',
            rootDir: this.rootDir,
            state: loaded.state,
            userProfile: loaded.userProfile,
            relationshipProfile: loaded.relationshipProfile,
            affinityState: loaded.affinityState,
            rebuild
        };
    }

    getStatus() {
        return {
            ok: true,
            version: USER_PROFILE_CURATOR_VERSION,
            rootDir: this.rootDir,
            profilePath: this.profilePath,
            relationshipPath: this.relationshipPath,
            affinityPath: this.affinityPath,
            statePath: this.statePath,
            rebuildManifestPath: this.rebuildManifestPath,
            operationLockPath: this.operationLockPath,
            activeOperation: this.activeOperation ? { ...this.activeOperation } : null,
            hasRawMemoryLedger: Boolean(this.rawMemoryLedger),
            hasPreferenceState: Boolean(this.preferenceState),
            hasLlmClient: Boolean(this.llmClient),
            lastError: this.lastError
        };
    }

    buildEvidenceBatch(entries = [], options = {}) {
        const evidenceLimit = Math.max(1, Math.min(Number(options.evidenceLimit) || DEFAULT_EVIDENCE_LIMIT, 500));
        const maxChars = Math.max(4000, Math.min(Number(options.maxEvidenceChars) || DEFAULT_EVIDENCE_MAX_CHARS, 120000));
        const entryMaxChars = Math.max(400, Math.min(Number(options.entryMaxChars) || DEFAULT_ENTRY_MAX_CHARS, 8000));
        const candidates = normalizeArray(entries);
        const output = [];
        let usedChars = 0;
        let consumedCount = 0;
        for (const rawEntry of candidates) {
            if (output.length >= evidenceLimit) {
                break;
            }
            const entry = renderEvidenceEntry(rawEntry, entryMaxChars);
            consumedCount += 1;
            if (!entry.userText) {
                continue;
            }
            const size = JSON.stringify(entry).length;
            if (output.length && usedChars + size > maxChars) {
                consumedCount -= 1;
                break;
            }
            output.push(entry);
            usedChars += size;
        }
        return {
            evidence: output,
            consumedCount,
            usedChars,
            evidenceLimit,
            maxChars,
            entryMaxChars
        };
    }

    buildEvidencePack(entries = [], options = {}) {
        return this.buildEvidenceBatch(entries, options).evidence;
    }

    async callExtractor(promptPayload, options = {}) {
        if (!this.llmClient) {
            return {
                ok: false,
                status: 'llm_client_not_configured',
                error: 'profile curator needs an LLM client'
            };
        }
        const maxAttempts = Math.max(1, Math.min(Number(options.maxLlmAttempts) || 2, 3));
        let lastFailure = null;
        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
            const result = await this.llmClient({
                messages: [
                    { role: 'system', content: buildSystemPrompt() },
                    { role: 'user', content: buildUserPrompt(promptPayload) }
                ],
                jsonMode: true,
                expectJson: true,
                outputFormat: 'json',
                temperature: 0.1,
                max_tokens: Number(options.maxTokens) || 8000,
                timeoutMs: Number(options.timeoutMs) || 120000
            });
            if (result?.ok === false) {
                lastFailure = {
                    ok: false,
                    status: 'llm_failed',
                    error: result.error || result.message || 'profile curator LLM call failed',
                    attempt,
                    result
                };
                if (attempt < maxAttempts && result.code === 'empty_response') {
                    continue;
                }
                return lastFailure;
            }
            const jsonCandidates = collectLlmJsonCandidates(result);
            const parsed = jsonCandidates.map(parseJsonFromText).find(isPlainObject) || null;
            if (parsed) {
                return { ok: true, parsed, result, attempt };
            }
            const previewSource = jsonCandidates.find((candidate) => typeof candidate === 'string') || '';
            lastFailure = {
                ok: false,
                status: 'invalid_llm_json',
                error: 'profile curator expected JSON output',
                contentPreview: truncateText(previewSource, 1000),
                resultKeys: Object.keys(result || {}).sort(),
                attempt,
                result
            };
            if (attempt >= maxAttempts) {
                return lastFailure;
            }
        }
        return lastFailure;
    }

    normalizeExtraction(parsed, evidence, options = {}) {
        const allowed = evidenceIdSet(evidence);
        const minConfidence = clampNumber(options.minConfidence, 0, 1, DEFAULT_MIN_CONFIDENCE);
        const profileUpdates = normalizeArray(parsed.profileUpdates)
            .map((update) => normalizeProfileUpdate(update, allowed, minConfidence))
            .filter(Boolean);
        const relationshipUpdates = normalizeArray(parsed.relationshipUpdates)
            .map((update) => normalizeRelationshipUpdate(update, allowed, minConfidence))
            .filter(Boolean);
        const evidenceById = new Map(evidence.map((entry) => [entry.id, entry]));
        const preferenceEvents = normalizeArray(parsed.preferenceEvents)
            .map((update) => normalizePreferenceEvent(update, evidenceById, minConfidence))
            .filter(Boolean);
        const affinityUpdate = normalizeAffinityUpdate(parsed.affinityUpdate, allowed);
        const rejectedSignals = normalizeArray(parsed.rejectedSignals)
            .filter(isPlainObject)
            .map((signal) => ({
                evidenceId: normalizeString(signal.evidenceId),
                reason: normalizeString(signal.reason, 'unspecified')
            }))
            .filter((signal) => !signal.evidenceId || allowed.has(signal.evidenceId))
            .slice(0, 80);
        return {
            daySummary: normalizeString(parsed.daySummary),
            profileUpdates,
            relationshipUpdates,
            preferenceEvents,
            affinityUpdate,
            rejectedSignals
        };
    }

    async runDailyCuration(options = {}) {
        return this.runExclusiveOperation('daily_curation', () => this.runDailyCurationUnlocked(options));
    }

    async runDailyCurationUnlocked(options = {}) {
        const runIso = normalizeString(options.nowIso, nowIso());
        const runDate = todayKey(runIso);
        const force = options.force === true;
        const loaded = await this.loadState();
        const { state, userProfile, relationshipProfile, affinityState } = loaded;
        if (!force && state.lastRunDate === runDate) {
            return {
                ok: true,
                status: 'already_curated_today',
                runDate,
                state,
                userProfile,
                relationshipProfile,
                affinityState
            };
        }
        if (!this.rawMemoryLedger?.replay) {
            return { ok: false, status: 'raw_memory_ledger_not_configured' };
        }
        const replay = this.rawMemoryLedger.replay({
            since: state.cursor.lastProcessedIso || '',
            sinceExclusive: true,
            afterId: state.cursor.lastProcessedEntryId || '',
            includePayload: true,
            limit: Number(options.rawLimit) || 5000,
            tail: false
        });
        const replayEntryCount = Math.max(Number(replay.count) || 0, 0);
        const entries = normalizeArray(replay.entries)
            .sort((left, right) => String(left.iso || '').localeCompare(String(right.iso || '')));
        const totalSourceEntryCount = Math.max(replayEntryCount, entries.length);
        if (!entries.length) {
            const run = {
                id: randomUUID(),
                iso: runIso,
                runDate,
                status: 'no_new_raw_memory',
                processedEntryCount: 0,
                lastProcessedIso: state.cursor.lastProcessedIso || ''
            };
            state.lastRunDate = runDate;
            state.updatedAt = runIso;
            state.runCount = Number(state.runCount || 0) + 1;
            state.lastRun = run;
            await writeJsonFileAtomic(this.statePath, state);
            await appendJsonl(this.runsPath, run);
            return {
                ok: true,
                status: 'no_new_raw_memory',
                runDate,
                run
            };
        }
        const maxBatches = normalizeBatchLimit(options.maxBatches ?? options.maxBatchesPerRun);
        let offset = 0;
        let batchCount = 0;
        let processedEntryCount = 0;
        let evidenceCount = 0;
        let profileUpdateCount = 0;
        let relationshipUpdateCount = 0;
        let preferenceEventCount = 0;
        let rejectedSignalCount = 0;
        let affinityChanged = false;
        const daySummaries = [];
        const appliedProfileItems = new Set();
        const appliedRelationshipItems = new Set();
        const normalizedBatches = [];

        const persistRun = async (run, extra = {}) => {
            userProfile.updatedAt = runIso;
            relationshipProfile.updatedAt = runIso;
            affinityState.updatedAt = runIso;
            if (run.status === 'completed') {
                state.lastRunDate = runDate;
            }
            state.updatedAt = runIso;
            state.runCount = Number(state.runCount || 0) + 1;
            state.lastRun = run;
            await Promise.all([
                writeJsonFileAtomic(this.profilePath, userProfile),
                writeJsonFileAtomic(this.relationshipPath, relationshipProfile),
                writeJsonFileAtomic(this.affinityPath, affinityState),
                writeJsonFileAtomic(this.statePath, state),
                appendJsonl(this.runsPath, {
                    ...run,
                    ...extra
                })
            ]);
        };

        while (offset < entries.length && batchCount < maxBatches) {
            const remainingEntries = entries.slice(offset);
            const batch = this.buildEvidenceBatch(remainingEntries, options);
            if (!batch.consumedCount) {
                break;
            }
            const batchEntries = remainingEntries.slice(0, batch.consumedCount);
            const batchLastEntry = batchEntries[batchEntries.length - 1];
            if (!batch.evidence.length) {
                state.cursor = cursorForEntry(batchLastEntry, runIso);
                processedEntryCount += batchEntries.length;
                normalizedBatches.push({
                    batchIndex: batchCount + 1,
                    sourceEntryCount: batchEntries.length,
                    evidenceIds: [],
                    status: 'skipped_no_user_evidence'
                });
                offset += batchEntries.length;
                batchCount += 1;
                continue;
            }
            const promptPayload = buildPromptPayload({
                evidence: batch.evidence,
                userProfile,
                relationshipProfile,
                affinityState,
                runDate,
                currentInteractionPreferences: this.preferenceState?.resolve?.({ now: runIso }) || null,
                batch: {
                    index: batchCount + 1,
                    maxBatches,
                    sourceEntryCount: batchEntries.length,
                    evidenceCount: batch.evidence.length,
                    firstEntryIso: batchEntries[0]?.iso || '',
                    lastEntryIso: batchLastEntry?.iso || '',
                    remainingSourceEntryCount: Math.max(0, totalSourceEntryCount - offset - batchEntries.length),
                    cursorBefore: { ...(state.cursor || {}) }
                }
            });
            const extraction = await this.callExtractor(promptPayload, options);
            if (!extraction.ok) {
                this.lastError = extraction.error || extraction.status;
                if (!processedEntryCount) {
                    return extraction;
                }
                const run = {
                    id: randomUUID(),
                    iso: runIso,
                    runDate,
                    status: 'partial_failed',
                    ok: false,
                    error: extraction.error || extraction.status || 'profile curator batch failed',
                    processedEntryCount,
                    remainingEntryCount: Math.max(0, totalSourceEntryCount - processedEntryCount),
                    batchCount,
                    evidenceCount,
                    profileUpdateCount,
                    relationshipUpdateCount,
                    preferenceEventCount,
                    affinityChanged,
                    rejectedSignalCount,
                    daySummary: daySummaries.filter(Boolean).join('\n'),
                    cursor: state.cursor,
                    appliedProfileItems: Array.from(appliedProfileItems),
                    appliedRelationshipItems: Array.from(appliedRelationshipItems)
                };
                await persistRun(run, { normalizedBatches });
                this.emitGatewayEvent('memory.profile_curated', {
                    runId: run.id,
                    runDate,
                    status: run.status,
                    processedEntryCount: run.processedEntryCount,
                    profileUpdateCount: run.profileUpdateCount,
                    relationshipUpdateCount: run.relationshipUpdateCount,
                    preferenceEventCount: run.preferenceEventCount,
                    affinityChanged: run.affinityChanged
                });
                return {
                    ok: false,
                    status: 'partial_failed',
                    error: run.error,
                    run,
                    userProfile,
                    relationshipProfile,
                    affinityState
                };
            }

            const normalized = this.normalizeExtraction(extraction.parsed, batch.evidence, options);
            for (const update of normalized.profileUpdates) {
                const item = upsertProfileItem(userProfile, update, runIso);
                if (item) {
                    appliedProfileItems.add(item.id);
                }
            }
            for (const update of normalized.relationshipUpdates) {
                const item = upsertRelationshipItem(relationshipProfile, update, runIso);
                if (item) {
                    appliedRelationshipItems.add(item.id);
                }
            }
            if (normalized.preferenceEvents.length && this.preferenceState?.appendMany) {
                const preferenceResult = this.preferenceState.appendMany(normalized.preferenceEvents);
                preferenceEventCount += preferenceResult.recorded || 0;
            }
            affinityChanged = applyAffinityUpdate(affinityState, normalized.affinityUpdate, runIso) || affinityChanged;
            state.cursor = cursorForEntry(batchLastEntry, runIso);
            processedEntryCount += batchEntries.length;
            evidenceCount += batch.evidence.length;
            profileUpdateCount += normalized.profileUpdates.length;
            relationshipUpdateCount += normalized.relationshipUpdates.length;
            rejectedSignalCount += normalized.rejectedSignals.length;
            if (normalized.daySummary) {
                daySummaries.push(normalized.daySummary);
            }
            normalizedBatches.push({
                batchIndex: batchCount + 1,
                sourceEntryCount: batchEntries.length,
                evidenceIds: batch.evidence.map((entry) => entry.id).filter(Boolean),
                normalized
            });
            offset += batchEntries.length;
            batchCount += 1;
        }

        if (!processedEntryCount) {
            const run = {
                id: randomUUID(),
                iso: runIso,
                runDate,
                status: 'no_processable_raw_memory',
                processedEntryCount: 0,
                remainingEntryCount: totalSourceEntryCount,
                batchCount: 0,
                cursor: state.cursor
            };
            state.updatedAt = runIso;
            state.runCount = Number(state.runCount || 0) + 1;
            state.lastRun = run;
            await writeJsonFileAtomic(this.statePath, state);
            await appendJsonl(this.runsPath, run);
            return {
                ok: true,
                status: run.status,
                run,
                userProfile,
                relationshipProfile,
                affinityState
            };
        }

        const remainingEntryCount = Math.max(0, totalSourceEntryCount - processedEntryCount);
        const runStatus = remainingEntryCount > 0 ? 'partial_completed' : 'completed';
        const run = {
            id: randomUUID(),
            iso: runIso,
            runDate,
            status: runStatus,
            processedEntryCount,
            remainingEntryCount,
            batchCount,
            evidenceCount,
            profileUpdateCount,
            relationshipUpdateCount,
            preferenceEventCount,
            affinityChanged,
            rejectedSignalCount,
            daySummary: daySummaries.filter(Boolean).join('\n'),
            cursor: state.cursor,
            appliedProfileItems: Array.from(appliedProfileItems),
            appliedRelationshipItems: Array.from(appliedRelationshipItems)
        };
        await persistRun(run, { normalizedBatches });
        this.emitGatewayEvent('memory.profile_curated', {
            runId: run.id,
            runDate,
            status: run.status,
            processedEntryCount: run.processedEntryCount,
            profileUpdateCount: run.profileUpdateCount,
            relationshipUpdateCount: run.relationshipUpdateCount,
            preferenceEventCount: run.preferenceEventCount,
            affinityChanged
        });
        return {
            ok: true,
            status: run.status,
            run,
            userProfile,
            relationshipProfile,
            affinityState
        };
    }

    async promoteStagedRebuild(manifest, stagingCurator) {
        const staged = await stagingCurator.loadState();
        const stagedStats = await summarizeStagedCurationRuns(stagingCurator.runsPath);
        manifest.passCount = stagedStats.passCount;
        manifest.processedEntryCount = stagedStats.processedEntryCount;
        manifest.evidenceCount = stagedStats.evidenceCount;
        manifest.profileUpdateCount = stagedStats.profileUpdateCount;
        manifest.relationshipUpdateCount = stagedStats.relationshipUpdateCount;
        const profileItemCount = staged.userProfile.items.length;
        const relationshipItemCount = staged.relationshipProfile.items.length;
        const rawEntryCount = Number(this.rawMemoryLedger?.getStatus?.().entryCount) || 0;
        if (rawEntryCount > 0 && profileItemCount + relationshipItemCount === 0) {
            manifest.status = 'blocked_empty_output';
            manifest.lastError = 'Rebuild scanned Raw Memory Ledger but produced no user or relationship capsules.';
            manifest.updatedAt = nowIso();
            await writeJsonFileAtomic(this.rebuildManifestPath, manifest);
            return {
                ok: false,
                status: manifest.status,
                error: manifest.lastError,
                rebuild: manifest
            };
        }

        const backupRoot = manifest.backupRoot || path.join(this.rootDir, 'profile-rebuild-backups', manifest.id);
        await fsp.mkdir(backupRoot, { recursive: true });
        if (manifest.status !== 'promoting') {
            for (const sourcePath of [this.profilePath, this.relationshipPath, this.affinityPath, this.statePath]) {
                try {
                    await fsp.copyFile(sourcePath, path.join(backupRoot, path.basename(sourcePath)));
                } catch (error) {
                    if (error?.code !== 'ENOENT') {
                        throw error;
                    }
                }
            }
        }
        manifest.status = 'promoting';
        manifest.backupRoot = backupRoot;
        manifest.updatedAt = nowIso();
        await writeJsonFileAtomic(this.rebuildManifestPath, manifest);

        await writeJsonFileAtomic(this.profilePath, staged.userProfile);
        await writeJsonFileAtomic(this.relationshipPath, staged.relationshipProfile);
        await writeJsonFileAtomic(this.affinityPath, staged.affinityState);
        await writeJsonFileAtomic(this.statePath, staged.state);

        manifest.status = 'completed';
        manifest.completedAt = nowIso();
        manifest.updatedAt = manifest.completedAt;
        manifest.profileItemCount = profileItemCount;
        manifest.relationshipItemCount = relationshipItemCount;
        manifest.lastError = '';
        await writeJsonFileAtomic(this.rebuildManifestPath, manifest);
        await appendJsonl(this.runsPath, {
            id: randomUUID(),
            iso: manifest.completedAt,
            runDate: todayKey(manifest.completedAt),
            status: 'rebuild_completed',
            rebuildId: manifest.id,
            processedEntryCount: manifest.processedEntryCount,
            evidenceCount: manifest.evidenceCount,
            profileUpdateCount: manifest.profileUpdateCount,
            relationshipUpdateCount: manifest.relationshipUpdateCount,
            profileItemCount,
            relationshipItemCount
        });
        this.emitGatewayEvent('memory.profile_rebuild.completed', {
            rebuildId: manifest.id,
            profileItemCount,
            relationshipItemCount,
            processedEntryCount: manifest.processedEntryCount
        });
        return {
            ok: true,
            status: 'rebuild_completed',
            rebuild: manifest,
            userProfile: staged.userProfile,
            relationshipProfile: staged.relationshipProfile,
            affinityState: staged.affinityState
        };
    }

    async rebuildFromRawMemory(options = {}) {
        return this.runExclusiveOperation('profile_rebuild', () => this.rebuildFromRawMemoryUnlocked(options));
    }

    async rebuildFromRawMemoryUnlocked(options = {}) {
        if (!this.rawMemoryLedger?.replay) {
            return { ok: false, status: 'raw_memory_ledger_not_configured' };
        }
        if (!this.llmClient) {
            return { ok: false, status: 'llm_client_not_configured' };
        }
        const existingManifest = await readJsonFile(this.rebuildManifestPath, null);
        if (options.restart !== true && existingManifest?.status === 'promoting' && existingManifest.stagingRoot) {
            const interruptedStagingCurator = new AILISUserProfileCurator({
                workspaceRoot: this.workspaceRoot,
                rootDir: path.resolve(existingManifest.stagingRoot),
                rawMemoryLedger: this.rawMemoryLedger,
                preferenceState: null,
                llmClient: this.llmClient,
                emitGatewayEvent: (type, payload) => this.emitGatewayEvent(type, {
                    ...payload,
                    rebuildId: existingManifest.id
                })
            });
            return this.promoteStagedRebuild(existingManifest, interruptedStagingCurator);
        }
        const canResume = options.restart !== true &&
            existingManifest?.stagingRoot &&
            ['running', 'paused', 'partial_completed', 'failed'].includes(existingManifest.status);
        const rebuildId = canResume ? existingManifest.id : `profile-rebuild-${randomUUID()}`;
        const stagingRoot = canResume
            ? path.resolve(existingManifest.stagingRoot)
            : path.join(this.rootDir, 'profile-rebuilds', rebuildId);
        const startedAt = canResume ? existingManifest.startedAt : nowIso();
        const manifest = {
            version: USER_PROFILE_CURATOR_VERSION,
            id: rebuildId,
            status: 'running',
            stagingRoot,
            startedAt,
            updatedAt: nowIso(),
            passCount: canResume ? Number(existingManifest?.passCount) || 0 : 0,
            processedEntryCount: canResume ? Number(existingManifest?.processedEntryCount) || 0 : 0,
            evidenceCount: canResume ? Number(existingManifest?.evidenceCount) || 0 : 0,
            profileUpdateCount: canResume ? Number(existingManifest?.profileUpdateCount) || 0 : 0,
            relationshipUpdateCount: canResume ? Number(existingManifest?.relationshipUpdateCount) || 0 : 0,
            lastError: ''
        };
        await writeJsonFileAtomic(this.rebuildManifestPath, manifest);

        const stagingCurator = new AILISUserProfileCurator({
            workspaceRoot: this.workspaceRoot,
            rootDir: stagingRoot,
            rawMemoryLedger: this.rawMemoryLedger,
            preferenceState: null,
            llmClient: this.llmClient,
            emitGatewayEvent: (type, payload) => this.emitGatewayEvent(type, {
                ...payload,
                rebuildId
            })
        });
        const maxPasses = Math.max(1, Math.min(Number(options.maxPasses) || 1, 20));
        let latestResult = null;
        for (let pass = 0; pass < maxPasses; pass += 1) {
            try {
                latestResult = await stagingCurator.runDailyCuration({
                    ...options,
                    force: true,
                    nowIso: nowIso()
                });
            } catch (error) {
                latestResult = {
                    ok: false,
                    status: 'rebuild_pass_failed',
                    error: error?.message || String(error)
                };
            }
            manifest.passCount += 1;
            manifest.processedEntryCount += Number(latestResult?.run?.processedEntryCount) || 0;
            manifest.evidenceCount += Number(latestResult?.run?.evidenceCount) || 0;
            manifest.profileUpdateCount += Number(latestResult?.run?.profileUpdateCount) || 0;
            manifest.relationshipUpdateCount += Number(latestResult?.run?.relationshipUpdateCount) || 0;
            manifest.updatedAt = nowIso();
            manifest.status = latestResult?.ok === false
                ? 'paused'
                : normalizeString(latestResult?.status, 'partial_completed');
            manifest.lastError = latestResult?.ok === false
                ? normalizeString(latestResult?.error || latestResult?.status)
                : '';
            await writeJsonFileAtomic(this.rebuildManifestPath, manifest);
            if (latestResult?.ok === false || ['completed', 'no_new_raw_memory'].includes(latestResult?.status)) {
                break;
            }
        }

        if (!latestResult || latestResult.ok === false) {
            return {
                ok: false,
                status: 'rebuild_paused',
                error: manifest.lastError,
                rebuild: manifest
            };
        }
        if (!['completed', 'no_new_raw_memory'].includes(latestResult.status)) {
            manifest.status = 'partial_completed';
            await writeJsonFileAtomic(this.rebuildManifestPath, manifest);
            return { ok: true, status: 'rebuild_partial', rebuild: manifest };
        }

        return this.promoteStagedRebuild(manifest, stagingCurator);
    }
}

module.exports = {
    AILISUserProfileCurator,
    USER_PROFILE_CURATOR_VERSION
};
