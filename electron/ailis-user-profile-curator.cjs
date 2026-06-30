const fsp = require('fs/promises');
const path = require('path');
const { createHash, randomUUID } = require('crypto');

const USER_PROFILE_CURATOR_VERSION = 1;
const DEFAULT_EVIDENCE_LIMIT = 120;
const DEFAULT_EVIDENCE_MAX_CHARS = 42000;
const DEFAULT_ENTRY_MAX_CHARS = 2200;
const DEFAULT_MIN_CONFIDENCE = 0.62;
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

function nowIso() {
    return new Date().toISOString();
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
    return null;
}

async function readJsonFile(filePath, fallback) {
    try {
        return JSON.parse(await fsp.readFile(filePath, 'utf8')) ?? fallback;
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
    return {
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

function extractEntryText(entry = {}) {
    const payload = entry.payload || {};
    if (entry.type === 'chat.llm_turn') {
        return [
            payload.requestPayload?.memoryUserMessage,
            payload.requestPayload?.messages,
            payload.result?.content,
            payload.result?.error
        ].filter(Boolean).map((part) => typeof part === 'string' ? part : JSON.stringify(part)).join('\n');
    }
    if (entry.type === 'agent.transcript.item') {
        return JSON.stringify(payload.payload || payload, null, 2);
    }
    return JSON.stringify(payload, null, 2);
}

function renderEvidenceEntry(entry = {}, maxChars = DEFAULT_ENTRY_MAX_CHARS) {
    return {
        id: entry.id,
        iso: entry.iso,
        type: entry.type,
        source: entry.source,
        sessionId: entry.sessionId,
        runId: entry.runId,
        category: entry.category,
        text: truncateText(extractEntryText(entry), maxChars)
    };
}

function buildPromptPayload({
    evidence = [],
    userProfile = createDefaultUserProfile(),
    relationshipProfile = createDefaultRelationshipProfile(),
    affinityState = createDefaultAffinityState(),
    runDate = todayKey()
} = {}) {
    return {
        runDate,
        instruction: 'Extract only evidence-grounded user profile, relationship profile, and affinity updates from new Raw Memory Ledger entries.',
        rules: [
            'Return valid JSON only.',
            'Every profile or relationship update must include evidenceIds from evidence[].id.',
            'Reject one-off emotions, temporary task details, secrets, API keys, and unsupported guesses.',
            'Do not infer private demographics or sensitive attributes.',
            'Prefer stable preferences and repeated patterns; mark weak signals as candidate.',
            'Affinity deltas must be small and justified by evidence.'
        ],
        allowedProfileCategories: Array.from(PROFILE_CATEGORIES),
        currentUserProfile: userProfile.items.slice(-120),
        currentRelationshipProfile: relationshipProfile.items.slice(-80),
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
        'Your job is to learn from Raw Memory Ledger evidence and propose structured, auditable memory patches.',
        'You must be conservative, evidence-bound, and JSON-only.',
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

class AILISUserProfileCurator {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.rootDir = path.resolve(options.rootDir || path.join(this.workspaceRoot, '.ailis-state', 'memory'));
        this.rawMemoryLedger = options.rawMemoryLedger || null;
        this.llmClient = typeof options.llmClient === 'function' ? options.llmClient : null;
        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () => {};
        this.profilePath = path.join(this.rootDir, 'user-profile.json');
        this.relationshipPath = path.join(this.rootDir, 'relationship-profile.json');
        this.affinityPath = path.join(this.rootDir, 'affinity-state.json');
        this.statePath = path.join(this.rootDir, 'profile-curation-state.json');
        this.runsPath = path.join(this.rootDir, 'profile-curation-runs.jsonl');
        this.lastError = '';
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
        const loaded = await this.loadState();
        return {
            ok: true,
            status: 'ok',
            rootDir: this.rootDir,
            state: loaded.state,
            userProfile: loaded.userProfile,
            relationshipProfile: loaded.relationshipProfile,
            affinityState: loaded.affinityState
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
            hasRawMemoryLedger: Boolean(this.rawMemoryLedger),
            hasLlmClient: Boolean(this.llmClient),
            lastError: this.lastError
        };
    }

    buildEvidencePack(entries = [], options = {}) {
        const evidenceLimit = Math.max(1, Math.min(Number(options.evidenceLimit) || DEFAULT_EVIDENCE_LIMIT, 500));
        const maxChars = Math.max(4000, Math.min(Number(options.maxEvidenceChars) || DEFAULT_EVIDENCE_MAX_CHARS, 120000));
        const entryMaxChars = Math.max(400, Math.min(Number(options.entryMaxChars) || DEFAULT_ENTRY_MAX_CHARS, 8000));
        const candidates = entries
            .slice(-evidenceLimit)
            .map((entry) => renderEvidenceEntry(entry, entryMaxChars));
        const output = [];
        let usedChars = 0;
        for (const entry of candidates) {
            const size = JSON.stringify(entry).length;
            if (output.length && usedChars + size > maxChars) {
                break;
            }
            output.push(entry);
            usedChars += size;
        }
        return output;
    }

    async callExtractor(promptPayload, options = {}) {
        if (!this.llmClient) {
            return {
                ok: false,
                status: 'llm_client_not_configured',
                error: 'profile curator needs an LLM client'
            };
        }
        const result = await this.llmClient({
            messages: [
                { role: 'system', content: buildSystemPrompt() },
                { role: 'user', content: buildUserPrompt(promptPayload) }
            ],
            jsonMode: true,
            expectJson: true,
            outputFormat: 'json',
            temperature: 0.1,
            max_tokens: Number(options.maxTokens) || 3000,
            timeoutMs: Number(options.timeoutMs) || 120000
        });
        if (result?.ok === false) {
            return {
                ok: false,
                status: 'llm_failed',
                error: result.error || result.message || 'profile curator LLM call failed',
                result
            };
        }
        const parsed = parseJsonFromText(result?.content || result?.text || result?.output || '');
        if (!parsed) {
            return {
                ok: false,
                status: 'invalid_llm_json',
                error: 'profile curator expected JSON output',
                contentPreview: truncateText(result?.content || '', 1000),
                result
            };
        }
        return { ok: true, parsed, result };
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
            affinityUpdate,
            rejectedSignals
        };
    }

    async runDailyCuration(options = {}) {
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
            includePayload: true,
            limit: Number(options.rawLimit) || 5000
        });
        const entries = normalizeArray(replay.entries)
            .filter((entry) => !state.cursor.lastProcessedIso || String(entry.iso || '') > state.cursor.lastProcessedIso)
            .sort((left, right) => String(left.iso || '').localeCompare(String(right.iso || '')));
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
        const evidence = this.buildEvidencePack(entries, options);
        const promptPayload = buildPromptPayload({
            evidence,
            userProfile,
            relationshipProfile,
            affinityState,
            runDate
        });
        const extraction = await this.callExtractor(promptPayload, options);
        if (!extraction.ok) {
            this.lastError = extraction.error || extraction.status;
            return extraction;
        }
        const normalized = this.normalizeExtraction(extraction.parsed, evidence, options);
        const appliedProfileItems = [];
        const appliedRelationshipItems = [];
        for (const update of normalized.profileUpdates) {
            const item = upsertProfileItem(userProfile, update, runIso);
            if (item) {
                appliedProfileItems.push(item.id);
            }
        }
        for (const update of normalized.relationshipUpdates) {
            const item = upsertRelationshipItem(relationshipProfile, update, runIso);
            if (item) {
                appliedRelationshipItems.push(item.id);
            }
        }
        const affinityChanged = applyAffinityUpdate(affinityState, normalized.affinityUpdate, runIso);
        const lastEntry = entries[entries.length - 1];
        userProfile.updatedAt = runIso;
        relationshipProfile.updatedAt = runIso;
        affinityState.updatedAt = runIso;
        state.cursor = {
            lastProcessedIso: lastEntry.iso || runIso,
            lastProcessedEntryId: lastEntry.id || ''
        };
        state.lastRunDate = runDate;
        state.updatedAt = runIso;
        state.runCount = Number(state.runCount || 0) + 1;
        const run = {
            id: randomUUID(),
            iso: runIso,
            runDate,
            status: 'completed',
            processedEntryCount: entries.length,
            evidenceCount: evidence.length,
            profileUpdateCount: normalized.profileUpdates.length,
            relationshipUpdateCount: normalized.relationshipUpdates.length,
            affinityChanged,
            rejectedSignalCount: normalized.rejectedSignals.length,
            daySummary: normalized.daySummary,
            cursor: state.cursor,
            appliedProfileItems,
            appliedRelationshipItems
        };
        state.lastRun = run;
        await Promise.all([
            writeJsonFileAtomic(this.profilePath, userProfile),
            writeJsonFileAtomic(this.relationshipPath, relationshipProfile),
            writeJsonFileAtomic(this.affinityPath, affinityState),
            writeJsonFileAtomic(this.statePath, state),
            appendJsonl(this.runsPath, {
                ...run,
                normalized
            })
        ]);
        this.emitGatewayEvent('memory.profile_curated', {
            runId: run.id,
            runDate,
            processedEntryCount: run.processedEntryCount,
            profileUpdateCount: run.profileUpdateCount,
            relationshipUpdateCount: run.relationshipUpdateCount,
            affinityChanged
        });
        return {
            ok: true,
            status: 'completed',
            run,
            userProfile,
            relationshipProfile,
            affinityState
        };
    }
}

module.exports = {
    AILISUserProfileCurator,
    USER_PROFILE_CURATOR_VERSION
};
