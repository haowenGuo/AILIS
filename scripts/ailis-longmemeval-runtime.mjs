import { createReadStream } from 'node:fs';
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

export const LONGMEMEVAL_SOURCE = 'longmemeval_history';
export const NATIVE_RETRIEVAL_LIMIT = 8;
export const LONGMEMEVAL_INGESTION_CHECKPOINT_FILE =
    '.longmemeval-ingestion-checkpoint.json';

function normalizeCheckpointIdentity(identity = {}) {
    return {
        questionId: String(identity.questionId || ''),
        datasetPath: identity.datasetPath
            ? path.resolve(String(identity.datasetPath))
            : '',
        sessionIds: Array.isArray(identity.sessionIds)
            ? identity.sessionIds.map((entry) => String(entry || ''))
            : []
    };
}

export function longMemEvalIngestionCheckpointMatches(checkpoint, identity) {
    if (!checkpoint || checkpoint.version !== 2) {
        return false;
    }
    const expected = normalizeCheckpointIdentity(identity);
    const actual = normalizeCheckpointIdentity(checkpoint.identity);
    return actual.questionId === expected.questionId &&
        actual.datasetPath === expected.datasetPath &&
        JSON.stringify(actual.sessionIds) === JSON.stringify(expected.sessionIds) &&
        checkpoint.syntheticUserIsolation?.ok === true &&
        checkpoint.ingestion &&
        typeof checkpoint.ingestion === 'object';
}

export async function writeLongMemEvalIngestionCheckpoint({
    stateDir,
    identity,
    syntheticUserIsolation,
    ingestion
} = {}) {
    const checkpointPath = path.join(
        path.resolve(stateDir),
        LONGMEMEVAL_INGESTION_CHECKPOINT_FILE
    );
    const checkpoint = {
        version: 2,
        identity: normalizeCheckpointIdentity(identity),
        syntheticUserIsolation,
        ingestion,
        completedAt: new Date().toISOString()
    };
    const tempPath = `${checkpointPath}.tmp-${process.pid}-${Date.now()}`;
    await fs.writeFile(tempPath, `${JSON.stringify(checkpoint, null, 2)}\n`, 'utf8');
    await fs.rename(tempPath, checkpointPath);
    return checkpoint;
}

export async function prepareLongMemEvalQuestionState({
    stateDir,
    resume = true,
    checkpointIdentity = null,
    beforeReset = null
} = {}) {
    const resolvedStateDir = path.resolve(stateDir);
    let resumed = resume === true && fsSync.existsSync(resolvedStateDir);
    let ingestionCheckpoint = null;
    if (resumed && checkpointIdentity) {
        const checkpointPath = path.join(
            resolvedStateDir,
            LONGMEMEVAL_INGESTION_CHECKPOINT_FILE
        );
        try {
            const checkpoint = JSON.parse(await fs.readFile(checkpointPath, 'utf8'));
            if (longMemEvalIngestionCheckpointMatches(checkpoint, checkpointIdentity)) {
                ingestionCheckpoint = checkpoint;
            } else {
                resumed = false;
            }
        } catch {
            resumed = false;
        }
    }
    if (!resumed) {
        if (
            fsSync.existsSync(resolvedStateDir) &&
            typeof beforeReset === 'function'
        ) {
            await beforeReset({ stateDir: resolvedStateDir });
        }
        await fs.rm(resolvedStateDir, { recursive: true, force: true });
    }
    await fs.mkdir(resolvedStateDir, { recursive: true });
    return {
        stateDir: resolvedStateDir,
        resumed,
        ingestionCheckpoint
    };
}

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const text = value.trim();
    return text || fallback;
}

function contentText(message = {}) {
    const content = message?.content;
    if (typeof content === 'string') {
        return content.trim();
    }
    if (Array.isArray(content)) {
        return content
            .map((part) => typeof part === 'string' ? part : normalizeText(part?.text))
            .filter(Boolean)
            .join('\n')
            .trim();
    }
    return '';
}

export function parseLongMemEvalTimestamp(value, offsetMs = 0) {
    const text = normalizeText(value);
    const match = text.match(
        /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+\([^)]+\))?(?:\s+(\d{1,2}):(\d{2}))?$/
    );
    if (!match) {
        throw new Error(`Unsupported LongMemEval timestamp: ${text || '<empty>'}`);
    }
    const [, year, month, day, hour = '0', minute = '0'] = match;
    const timestamp = Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute)
    ) + Number(offsetMs || 0);
    const date = new Date(timestamp);
    if (!Number.isFinite(date.getTime())) {
        throw new Error(`Invalid LongMemEval timestamp: ${text}`);
    }
    return date.toISOString();
}

export async function* readJsonArrayEntries(filePath) {
    const stream = createReadStream(filePath, { encoding: 'utf8' });
    let sawArrayStart = false;
    let sawArrayEnd = false;
    let depth = 0;
    let inString = false;
    let escaped = false;
    let objectBuffer = '';
    let entryIndex = 0;

    for await (const chunk of stream) {
        for (const character of chunk) {
            if (!sawArrayStart) {
                if (character === '\uFEFF' || /\s/.test(character)) {
                    continue;
                }
                if (character !== '[') {
                    throw new Error(`LongMemEval dataset must be a top-level JSON array: ${filePath}`);
                }
                sawArrayStart = true;
                continue;
            }
            if (sawArrayEnd) {
                if (!/\s/.test(character)) {
                    throw new Error(`Unexpected content after LongMemEval JSON array: ${filePath}`);
                }
                continue;
            }
            if (depth === 0) {
                if (character === ']') {
                    sawArrayEnd = true;
                    continue;
                }
                if (character === ',' || /\s/.test(character)) {
                    continue;
                }
                if (character !== '{') {
                    throw new Error(`Expected LongMemEval object at index ${entryIndex}: ${filePath}`);
                }
                depth = 1;
                inString = false;
                escaped = false;
                objectBuffer = '{';
                continue;
            }

            objectBuffer += character;
            if (inString) {
                if (escaped) {
                    escaped = false;
                } else if (character === '\\') {
                    escaped = true;
                } else if (character === '"') {
                    inString = false;
                }
                continue;
            }
            if (character === '"') {
                inString = true;
            } else if (character === '{') {
                depth += 1;
            } else if (character === '}') {
                depth -= 1;
                if (depth === 0) {
                    try {
                        yield JSON.parse(objectBuffer);
                    } catch (error) {
                        error.message = `${filePath} entry ${entryIndex}: ${error.message}`;
                        throw error;
                    }
                    entryIndex += 1;
                    objectBuffer = '';
                }
            }
        }
    }

    if (!sawArrayStart || !sawArrayEnd || depth !== 0 || inString) {
        throw new Error(`Incomplete LongMemEval JSON array: ${filePath}`);
    }
}

export function validateLongMemEvalEntry(entry, index = 0) {
    const errors = [];
    const prefix = normalizeText(entry?.question_id, `entry[${index}]`);
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        return [`${prefix}: entry must be an object`];
    }
    for (const key of ['question_id', 'question_type', 'question', 'question_date']) {
        if (!normalizeText(entry[key])) {
            errors.push(`${prefix}: ${key} is required`);
        }
    }
    const sessions = Array.isArray(entry.haystack_sessions) ? entry.haystack_sessions : [];
    const dates = Array.isArray(entry.haystack_dates) ? entry.haystack_dates : [];
    const sessionIds = Array.isArray(entry.haystack_session_ids) ? entry.haystack_session_ids : [];
    if (!sessions.length) {
        errors.push(`${prefix}: haystack_sessions must not be empty`);
    }
    if (sessions.length !== dates.length || sessions.length !== sessionIds.length) {
        errors.push(
            `${prefix}: haystack_sessions, haystack_dates, and haystack_session_ids must have equal lengths`
        );
    }
    dates.forEach((date, dateIndex) => {
        try {
            parseLongMemEvalTimestamp(date);
        } catch (error) {
            errors.push(`${prefix}: haystack_dates[${dateIndex}] ${error.message}`);
        }
    });
    try {
        parseLongMemEvalTimestamp(entry.question_date);
    } catch (error) {
        errors.push(`${prefix}: question_date ${error.message}`);
    }
    sessions.forEach((session, sessionIndex) => {
        if (!Array.isArray(session) || !session.length) {
            errors.push(`${prefix}: haystack_sessions[${sessionIndex}] must be a non-empty array`);
            return;
        }
        session.forEach((message, messageIndex) => {
            const role = normalizeText(message?.role).toLowerCase();
            if (!['user', 'assistant'].includes(role)) {
                errors.push(
                    `${prefix}: haystack_sessions[${sessionIndex}][${messageIndex}] has unsupported role ${role || '<empty>'}`
                );
            }
        });
    });
    return errors;
}

export function pairLongMemEvalSession(messages = []) {
    const pairs = [];
    let pending = null;
    const flush = () => {
        if (!pending || (!pending.userMessage && !pending.assistantMessage)) {
            pending = null;
            return;
        }
        pairs.push(pending);
        pending = null;
    };

    messages.forEach((message, messageIndex) => {
        const role = normalizeText(message?.role).toLowerCase();
        const content = contentText(message);
        if (!content || !['user', 'assistant'].includes(role)) {
            return;
        }
        if (role === 'user') {
            flush();
            pending = {
                userMessage: content,
                assistantMessage: '',
                messageIndexes: [messageIndex]
            };
            return;
        }
        if (!pending) {
            pending = {
                userMessage: '',
                assistantMessage: content,
                messageIndexes: [messageIndex]
            };
        } else {
            pending.assistantMessage = [pending.assistantMessage, content].filter(Boolean).join('\n\n');
            pending.messageIndexes.push(messageIndex);
        }
    });
    flush();
    return pairs;
}

export function buildChronologicalSessions(entry = {}) {
    const sessions = Array.isArray(entry.haystack_sessions) ? entry.haystack_sessions : [];
    const dates = Array.isArray(entry.haystack_dates) ? entry.haystack_dates : [];
    const sessionIds = Array.isArray(entry.haystack_session_ids) ? entry.haystack_session_ids : [];
    return sessions
        .map((messages, index) => ({
            messages,
            date: dates[index],
            sessionId: normalizeText(sessionIds[index], `longmemeval-session-${index}`),
            originalIndex: index,
            timestamp: Date.parse(parseLongMemEvalTimestamp(dates[index]))
        }))
        .sort((left, right) => left.timestamp - right.timestamp || left.originalIndex - right.originalIndex);
}

export function buildLongMemEvalQuestionPrompt(entry = {}) {
    return [
        'Please answer the question based on what you remember from our past conversations.',
        '',
        `Current Date: ${normalizeText(entry.question_date)}`,
        `Question: ${normalizeText(entry.question)}`
    ].join('\n');
}

export function buildLongMemEvalClockOverride(entry = {}) {
    const iso = parseLongMemEvalTimestamp(entry.question_date);
    return {
        source: 'longmemeval_benchmark_clock',
        current_date: iso.slice(0, 10),
        current_time: iso.slice(11, 19),
        current_datetime: iso.replace(/Z$/, '+00:00'),
        timezone: 'UTC',
        utc_offset: '+00:00'
    };
}

export async function ingestLongMemEvalHistory({ gateway, entry }) {
    if (!gateway?.memoryRuntime?.recordTurn || !gateway?.rawMemoryLedger?.recordChatTurn) {
        throw new Error('AILIS gateway memory runtime and raw memory ledger are required');
    }
    const validationErrors = validateLongMemEvalEntry(entry);
    if (validationErrors.length) {
        throw new Error(validationErrors.slice(0, 5).join('; '));
    }

    let recordedTurns = 0;
    let recordedRawEntries = 0;
    let messageCount = 0;
    const questionId = normalizeText(entry.question_id);
    const sessions = buildChronologicalSessions(entry);
    for (const session of sessions) {
        const pairs = pairLongMemEvalSession(session.messages);
        messageCount += session.messages.length;
        for (let pairIndex = 0; pairIndex < pairs.length; pairIndex += 1) {
            const pair = pairs[pairIndex];
            const occurredAt = new Date(session.timestamp + pairIndex * 1000).toISOString();
            const memoryResult = gateway.memoryRuntime.recordTurn({
                sessionId: session.sessionId,
                userMessage: pair.userMessage,
                assistantMessage: pair.assistantMessage,
                source: LONGMEMEVAL_SOURCE,
                occurredAt,
                messageHistory: []
            });
            if (!memoryResult?.ok) {
                throw new Error(
                    `AILIS MemoryRuntime rejected ${questionId}/${session.sessionId}/${pairIndex}: ` +
                    `${memoryResult?.status || 'unknown'}`
                );
            }
            recordedTurns += 1;

            const rawResult = gateway.rawMemoryLedger.recordChatTurn({
                sessionId: session.sessionId,
                source: LONGMEMEVAL_SOURCE,
                iso: occurredAt,
                runId: `longmemeval:${questionId}`,
                requestPayload: {
                    memoryUserMessage: pair.userMessage
                },
                enrichedPayload: {},
                result: {
                    ok: true,
                    status: 'historical_replay',
                    intent: 'conversation_history',
                    content: pair.assistantMessage
                },
                meta: {
                    benchmark: 'LongMemEval',
                    messageIndexes: pair.messageIndexes
                }
            });
            if (!rawResult?.ok) {
                throw new Error(
                    `AILIS RawMemoryLedger rejected ${questionId}/${session.sessionId}/${pairIndex}: ` +
                    `${rawResult?.status || 'unknown'}`
                );
            }
            recordedRawEntries += 1;
        }
    }
    return {
        sessionCount: sessions.length,
        messageCount,
        recordedTurns,
        recordedRawEntries,
        retainedEventCount: gateway.memoryRuntime.getStatus?.().eventCount ?? null,
        nativeEventLimitReached: recordedTurns > (gateway.memoryRuntime.getStatus?.().eventCount ?? recordedTurns)
    };
}

export function isolateLongMemEvalSyntheticUser(gateway) {
    const clearedKeys = ['user', 'relationship', 'project'];
    const updateBlock = typeof gateway?.updateMemoryBlock === 'function'
        ? (key, value) => gateway.updateMemoryBlock(key, value)
        : typeof gateway?.memoryRuntime?.updateBlock === 'function'
            ? (key, value) => gateway.memoryRuntime.updateBlock(key, value)
            : null;
    if (!updateBlock) {
        throw new Error('AILIS memory block update API is required for synthetic-user isolation');
    }
    const updates = clearedKeys.map((key) => ({
        key,
        result: updateBlock(key, '')
    }));
    const failedKeys = updates
        .filter(({ result }) => result?.ok !== true)
        .map(({ key }) => key);
    const snapshot = gateway?.getMemorySnapshot?.({ includeEvents: false }) ||
        gateway?.memoryRuntime?.getSnapshot?.({ includeEvents: false }) ||
        null;
    const blockByKey = Object.fromEntries(
        (Array.isArray(snapshot?.blocks) ? snapshot.blocks : [])
            .map((block) => [normalizeText(block?.key), block])
            .filter(([key]) => Boolean(key))
    );
    const nonEmptyKeys = clearedKeys.filter(
        (key) => normalizeText(blockByKey[key]?.value)
    );
    return {
        ok: failedKeys.length === 0 && nonEmptyKeys.length === 0,
        status: failedKeys.length
            ? 'update_failed'
            : nonEmptyKeys.length
                ? 'verification_failed'
                : 'isolated',
        clearedKeys,
        failedKeys,
        nonEmptyKeys,
        personaPreserved: Boolean(normalizeText(blockByKey.persona?.value))
    };
}

export async function runLongMemEvalProfileCuration({
    gateway,
    mode = 'drain',
    nowIso,
    maxPasses = 128
} = {}) {
    const normalizedMode = normalizeText(mode, 'drain').toLowerCase();
    if (!['off', 'end', 'drain'].includes(normalizedMode)) {
        throw new Error(`Unsupported LongMemEval profile curation mode: ${normalizedMode}`);
    }
    if (normalizedMode === 'off') {
        return summarizeProfileCuration(null);
    }
    if (typeof gateway?.curateUserProfile !== 'function') {
        throw new Error('AILIS native user-profile curator is required');
    }

    const passLimit = normalizedMode === 'end'
        ? 1
        : Math.max(1, Math.min(Number(maxPasses) || 128, 256));
    const passes = [];
    let stalled = false;
    for (let passIndex = 0; passIndex < passLimit; passIndex += 1) {
        const result = await gateway.curateUserProfile({
            force: true,
            nowIso
        });
        const summary = summarizeProfileCuration(result);
        passes.push(summary);
        if (normalizedMode === 'end' || result?.ok !== true) {
            break;
        }
        if (summary.status !== 'partial_completed') {
            break;
        }
        if (summary.processedEntryCount <= 0) {
            stalled = true;
            break;
        }
    }

    const finalPass = passes[passes.length - 1] || summarizeProfileCuration(null);
    const sum = (key) => passes.reduce(
        (total, pass) => total + (Number(pass?.[key]) || 0),
        0
    );
    const drained = [
        'completed',
        'no_new_raw_memory',
        'no_processable_raw_memory'
    ].includes(finalPass.status);
    return {
        attempted: true,
        ok: passes.every((pass) => pass.ok === true) && !stalled,
        status: finalPass.status,
        mode: normalizedMode,
        passCount: passes.length,
        maxPasses: passLimit,
        drained,
        stalled,
        processedEntryCount: sum('processedEntryCount'),
        batchCount: sum('batchCount'),
        evidenceCount: sum('evidenceCount'),
        profileUpdateCount: sum('profileUpdateCount'),
        relationshipUpdateCount: sum('relationshipUpdateCount'),
        preferenceEventCount: sum('preferenceEventCount'),
        remainingEntryCount: Number(finalPass.remainingEntryCount || 0),
        error: normalizeText(finalPass.error),
        passes
    };
}

export function summarizeCognitionCuration(result = null) {
    const run = result?.run || {};
    return {
        attempted: Boolean(result),
        ok: result?.ok === true,
        status: normalizeText(result?.status, result ? 'unknown' : 'not_attempted'),
        processedEntryCount: Number(run.processedEntryCount || 0),
        evidenceCount: Number(run.evidenceCount || 0),
        batchCount: Number(run.batchCount || 0),
        unitCount: Number(run.unitCount || 0),
        observationCount: Number(run.observationCount || 0),
        mentalModelCount: Number(run.mentalModelCount || 0),
        supersededCount: Number(run.supersededCount || 0),
        remainingEntryCount: Number(run.remainingEntryCount || 0),
        error: normalizeText(result?.error)
    };
}

export async function runLongMemEvalCognitionCuration({
    gateway,
    mode = 'drain',
    nowIso,
    timeoutMs,
    maxPasses = 128
} = {}) {
    const normalizedMode = normalizeText(mode, 'drain').toLowerCase();
    if (!['off', 'end', 'drain'].includes(normalizedMode)) {
        throw new Error(`Unsupported LongMemEval cognition curation mode: ${normalizedMode}`);
    }
    if (normalizedMode === 'off') {
        return {
            ...summarizeCognitionCuration(null),
            mode: normalizedMode,
            passCount: 0,
            drained: true,
            stalled: false,
            passes: []
        };
    }
    if (typeof gateway?.curateMemoryCognition !== 'function') {
        throw new Error('AILIS memory cognition curator is required');
    }
    const passLimit = normalizedMode === 'end'
        ? 1
        : Math.max(1, Math.min(Number(maxPasses) || 128, 256));
    const passes = [];
    let stalled = false;
    for (let passIndex = 0; passIndex < passLimit; passIndex += 1) {
        const result = await gateway.curateMemoryCognition({
            nowIso,
            ...(Number.isFinite(Number(timeoutMs)) && Number(timeoutMs) > 0
                ? { timeoutMs: Number(timeoutMs) }
                : {}),
            maxBatches: normalizedMode === 'end' ? 1 : 12
        });
        const summary = summarizeCognitionCuration(result);
        passes.push(summary);
        if (normalizedMode === 'end' || result?.ok !== true) {
            break;
        }
        if (summary.status !== 'partial_completed') {
            break;
        }
        if (summary.processedEntryCount <= 0) {
            stalled = true;
            break;
        }
    }
    const finalPass = passes.at(-1) || summarizeCognitionCuration(null);
    const sum = (key) => passes.reduce(
        (total, pass) => total + (Number(pass?.[key]) || 0),
        0
    );
    const drained = ['completed', 'no_new_raw_memory'].includes(finalPass.status);
    return {
        attempted: true,
        ok: passes.every((pass) => pass.ok === true) && !stalled,
        status: finalPass.status,
        mode: normalizedMode,
        passCount: passes.length,
        maxPasses: passLimit,
        drained,
        stalled,
        processedEntryCount: sum('processedEntryCount'),
        evidenceCount: sum('evidenceCount'),
        batchCount: sum('batchCount'),
        unitCount: sum('unitCount'),
        observationCount: sum('observationCount'),
        mentalModelCount: sum('mentalModelCount'),
        supersededCount: sum('supersededCount'),
        remainingEntryCount: Number(finalPass.remainingEntryCount || 0),
        error: normalizeText(finalPass.error),
        passes
    };
}

function buildRetrievalDiagnosticsFromResult(searchResult, entry, query) {
    const events = searchResult?.events || [];
    const retrievedSessionIds = events.map((event) => normalizeText(event?.sessionId)).filter(Boolean);
    const answerSessionIds = new Set(
        Array.isArray(entry?.answer_session_ids)
            ? entry.answer_session_ids.map((id) => normalizeText(id)).filter(Boolean)
            : []
    );
    const evidenceRanks = retrievedSessionIds
        .map((sessionId, index) => answerSessionIds.has(sessionId) ? index + 1 : null)
        .filter(Number.isFinite);
    const evidenceTurnKeys = new Set();
    for (const session of buildChronologicalSessions(entry)) {
        const pairs = pairLongMemEvalSession(session.messages);
        pairs.forEach((pair, pairIndex) => {
            const hasAnswer = pair.messageIndexes.some(
                (messageIndex) => session.messages[messageIndex]?.has_answer === true
            );
            if (hasAnswer) {
                const occurredAt = new Date(session.timestamp + pairIndex * 1000).toISOString();
                evidenceTurnKeys.add(`${session.sessionId}\u0000${occurredAt}`);
            }
        });
    }
    const retrievedTurnKeys = events.map(
        (event) => `${normalizeText(event?.sessionId)}\u0000${normalizeText(event?.ts)}`
    );
    const evidenceTurnRanks = retrievedTurnKeys
        .map((turnKey, index) => evidenceTurnKeys.has(turnKey) ? index + 1 : null)
        .filter(Number.isFinite);
    const answerable = answerSessionIds.size > 0;
    const sessionRecallAt = (k) => answerable
        ? [...answerSessionIds].filter((id) => retrievedSessionIds.slice(0, k).includes(id)).length /
            answerSessionIds.size
        : null;
    const turnRecallAt = (k) => evidenceTurnKeys.size
        ? [...evidenceTurnKeys].filter((key) => retrievedTurnKeys.slice(0, k).includes(key)).length /
            evidenceTurnKeys.size
        : null;
    return {
        memoryStrategy: normalizeText(searchResult?.strategy),
        memoryStrategyDiagnostics: searchResult?.diagnostics || null,
        queryChars: query.length,
        retrievedEventCount: events.length,
        retrievedSessionIds,
        answerable,
        evidenceSessionCount: answerSessionIds.size,
        firstEvidenceRank: evidenceRanks.length ? Math.min(...evidenceRanks) : null,
        evidenceSessionRecallAt1: sessionRecallAt(1),
        evidenceSessionRecallAt5: sessionRecallAt(5),
        evidenceSessionRecallAt8: sessionRecallAt(NATIVE_RETRIEVAL_LIMIT),
        evidenceSessionRecallAt10: sessionRecallAt(10),
        evidenceSessionRecallAt20: sessionRecallAt(20),
        evidenceTurnCount: evidenceTurnKeys.size,
        firstEvidenceTurnRank: evidenceTurnRanks.length ? Math.min(...evidenceTurnRanks) : null,
        evidenceTurnRecallAt1: turnRecallAt(1),
        evidenceTurnRecallAt5: turnRecallAt(5),
        evidenceTurnRecallAt8: turnRecallAt(NATIVE_RETRIEVAL_LIMIT),
        evidenceTurnRecallAt10: turnRecallAt(10),
        evidenceTurnRecallAt20: turnRecallAt(20)
    };
}

export function buildRetrievalDiagnostics(gateway, entry, { limit = 20 } = {}) {
    const query = normalizeText(entry?.question);
    const searchResult = gateway?.searchMemory?.(query, {
        limit,
        questionTime: parseLongMemEvalTimestamp(entry.question_date)
    }) || {};
    return buildRetrievalDiagnosticsFromResult(searchResult, entry, query);
}

export async function buildRetrievalDiagnosticsAsync(gateway, entry, { limit = 20 } = {}) {
    const query = normalizeText(entry?.question);
    const searchResult = typeof gateway?.searchMemoryAsync === 'function'
        ? await gateway.searchMemoryAsync(query, {
            limit,
            questionTime: parseLongMemEvalTimestamp(entry.question_date)
        })
        : gateway?.searchMemory?.(query, {
            limit,
            questionTime: parseLongMemEvalTimestamp(entry.question_date)
        }) || {};
    return buildRetrievalDiagnosticsFromResult(searchResult, entry, query);
}

export async function answerLongMemEvalQuestion({
    gateway,
    entry,
    llmSettings,
    timeoutMs = 120000
}) {
    const message = buildLongMemEvalQuestionPrompt(entry);
    const runtimeEnvironmentOverride = buildLongMemEvalClockOverride(entry);
    const retrievalRequest = {
        query: normalizeText(entry?.question),
        referenceTime: parseLongMemEvalTimestamp(entry.question_date),
        source: 'longmemeval_public_question'
    };
    const startedAt = Date.now();
    const response = await gateway.runAgent({
        sessionId: `longmemeval-question-${normalizeText(entry.question_id)}`,
        message,
        messageHistory: [],
        agentRole: 'persona_orchestrator',
        agentLoop: 'llm',
        planner: 'llm',
        memoryPolicy: 'read_only',
        retrievalRequest,
        timeoutMs,
        llmSettings,
        context: {
            agentRole: 'persona_orchestrator',
            personaOrchestrator: true,
            agentLoop: 'llm',
            planner: 'llm',
            memoryPolicy: 'read_only',
            retrievalRequest,
            directToolExecutor: false,
            nativeDirectTools: false,
            requireTaskExecution: false,
            desktopRealEval: true,
            runtimeEnvironmentOverride,
            llmSettings
        }
    });
    const hypothesis = normalizeText(
        response?.displayText ||
        response?.finalAnswer ||
        response?.speechText ||
        response?.error
    );
    return {
        ok: response?.ok === true && Boolean(hypothesis),
        status: normalizeText(response?.status, response?.ok === true ? 'completed' : 'failed'),
        hypothesis,
        durationMs: Date.now() - startedAt,
        model: normalizeText(response?.model || llmSettings?.model),
        provider: normalizeText(response?.provider || llmSettings?.provider),
        taskAgentStepCount: Array.isArray(response?.steps) ? response.steps.length : 0,
        rawResponse: response
    };
}

export function summarizeProfileCuration(result = null) {
    if (!result) {
        return {
            attempted: false,
            ok: null,
            status: 'disabled'
        };
    }
    const run = result.run || {};
    return {
        attempted: true,
        ok: result.ok === true,
        status: normalizeText(result.status || run.status, result.ok === true ? 'completed' : 'failed'),
        processedEntryCount: Number(run.processedEntryCount || 0),
        batchCount: Number(run.batchCount || 0),
        evidenceCount: Number(run.evidenceCount || 0),
        profileUpdateCount: Number(run.profileUpdateCount || 0),
        relationshipUpdateCount: Number(run.relationshipUpdateCount || 0),
        preferenceEventCount: Number(run.preferenceEventCount || 0),
        remainingEntryCount: Number(run.remainingEntryCount || 0),
        error: normalizeText(result.error)
    };
}
