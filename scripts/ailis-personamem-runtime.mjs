import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const PERSONAMEM_ANSWER_INSTRUCTION =
    'Find the most appropriate model response and give your final answer (a), (b), (c), or (d) after the special token <final_answer>.';

export const PERSONAMEM_128K_TYPES = Object.freeze([
    'acknowledge_latest_user_preferences',
    'generalize_to_new_scenarios',
    'provide_preference_aligned_recommendations',
    'recall_user_shared_facts',
    'revisit_reasons_behind_preference_updates',
    'suggest_new_ideas',
    'track_full_preference_evolution'
]);

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') return fallback;
    const text = value.trim();
    return text || fallback;
}

export function stableHash(...parts) {
    return createHash('sha256')
        .update(parts.map((part) => String(part ?? '')).join('\n'))
        .digest('hex');
}

export function safeSegment(value, fallback = 'item') {
    return normalizeText(value, fallback)
        .replace(/[^a-zA-Z0-9._-]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 120) || fallback;
}

// RFC 4180 parser kept local so the benchmark adapter does not add a runtime dependency.
export function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let quoted = false;
    const source = String(text || '').replace(/^\uFEFF/, '');
    for (let index = 0; index < source.length; index += 1) {
        const character = source[index];
        if (quoted) {
            if (character === '"' && source[index + 1] === '"') {
                field += '"';
                index += 1;
            } else if (character === '"') {
                quoted = false;
            } else {
                field += character;
            }
            continue;
        }
        if (character === '"' && field.length === 0) {
            quoted = true;
        } else if (character === ',') {
            row.push(field);
            field = '';
        } else if (character === '\n') {
            row.push(field.replace(/\r$/, ''));
            rows.push(row);
            row = [];
            field = '';
        } else {
            field += character;
        }
    }
    if (quoted) throw new Error('PersonaMem CSV ended inside a quoted field');
    if (field.length || row.length) {
        row.push(field.replace(/\r$/, ''));
        rows.push(row);
    }
    const nonEmptyRows = rows.filter((entry) => entry.some((value) => value !== ''));
    const header = nonEmptyRows.shift() || [];
    return nonEmptyRows.map((values, rowIndex) => {
        if (values.length !== header.length) {
            throw new Error(
                `PersonaMem CSV row ${rowIndex + 2} has ${values.length} fields; expected ${header.length}`
            );
        }
        return Object.fromEntries(header.map((key, columnIndex) => [key, values[columnIndex]]));
    });
}

export async function loadPersonaMemTier(dataRoot, tier) {
    const normalizedTier = normalizeText(tier).toLowerCase();
    if (!['32k', '128k'].includes(normalizedTier)) {
        throw new Error(`Unsupported PersonaMem tier: ${tier}`);
    }
    const root = path.resolve(dataRoot);
    const questionsPath = path.join(root, `questions_${normalizedTier}.csv`);
    const contextsPath = path.join(root, `shared_contexts_${normalizedTier}.jsonl`);
    const rows = parseCsv(await fs.readFile(questionsPath, 'utf8'));
    const contexts = new Map();
    const contextText = await fs.readFile(contextsPath, 'utf8');
    for (const [lineIndex, line] of contextText.split(/\r?\n/).entries()) {
        if (!line.trim()) continue;
        let parsed;
        try {
            parsed = JSON.parse(line);
        } catch (error) {
            throw new Error(`PersonaMem context line ${lineIndex + 1}: ${error.message}`);
        }
        for (const [id, messages] of Object.entries(parsed || {})) {
            if (!Array.isArray(messages)) {
                throw new Error(`PersonaMem context ${id} is not an array`);
            }
            contexts.set(id, messages);
        }
    }
    validatePersonaMemRows(rows, contexts, { tier: normalizedTier });
    return {
        tier: normalizedTier,
        dataRoot: root,
        questionsPath,
        contextsPath,
        rows,
        contexts
    };
}

export function validatePersonaMemRows(rows, contexts, { tier = '' } = {}) {
    const errors = [];
    const seenIds = new Set();
    for (const [index, row] of rows.entries()) {
        const prefix = normalizeText(row.question_id, `row[${index}]`);
        for (const key of [
            'persona_id',
            'question_id',
            'question_type',
            'user_question_or_message',
            'correct_answer',
            'all_options',
            'shared_context_id',
            'end_index_in_shared_context'
        ]) {
            if (!normalizeText(row[key])) errors.push(`${prefix}: missing ${key}`);
        }
        if (seenIds.has(row.question_id)) errors.push(`${prefix}: duplicate question_id`);
        seenIds.add(row.question_id);
        if (!/^\(?[a-d]\)?$/i.test(normalizeText(row.correct_answer))) {
            errors.push(`${prefix}: invalid correct_answer ${row.correct_answer}`);
        }
        const messages = contexts.get(row.shared_context_id);
        const endIndex = Number(row.end_index_in_shared_context);
        if (!messages) {
            errors.push(`${prefix}: missing shared context ${row.shared_context_id}`);
        } else if (
            !Number.isInteger(endIndex) ||
            endIndex === 0 ||
            endIndex < -messages.length ||
            endIndex > messages.length
        ) {
            errors.push(`${prefix}: invalid end_index ${row.end_index_in_shared_context}/${messages.length}`);
        }
    }
    if (tier === '128k') {
        const observed = [...new Set(rows.map((row) => row.question_type))].sort();
        const expected = [...PERSONAMEM_128K_TYPES].sort();
        if (JSON.stringify(observed) !== JSON.stringify(expected)) {
            errors.push(`128K taxonomy mismatch: ${observed.join(', ')}`);
        }
    }
    if (errors.length) {
        throw new Error(errors.slice(0, 20).join('; '));
    }
    return { ok: true, questionCount: rows.length, contextCount: contexts.size };
}

export function slicePersonaMemContext(row, contexts) {
    const full = contexts.get(row.shared_context_id);
    if (!Array.isArray(full)) {
        throw new Error(`Missing PersonaMem context ${row.shared_context_id}`);
    }
    const endIndex = Number(row.end_index_in_shared_context);
    if (
        !Number.isInteger(endIndex) ||
        endIndex === 0 ||
        endIndex < -full.length ||
        endIndex > full.length
    ) {
        throw new Error(`Invalid PersonaMem end index ${row.end_index_in_shared_context}`);
    }
    const resolvedEndIndex = endIndex < 0 ? Math.max(0, full.length + endIndex) : endIndex;
    // PersonaMem's official evaluator uses Python context[:end_index]. Array#slice has
    // the same exclusive-end semantics, so message[end_index] must never be ingested.
    const messages = full.slice(0, endIndex);
    return {
        messages,
        fullMessageCount: full.length,
        includedMessageCount: messages.length,
        excludedMessageCount: full.length - messages.length,
        endIndex,
        resolvedEndIndex,
        includedLastMessage: messages.at(-1) || null,
        excludedFirstMessage: full[resolvedEndIndex] || null,
        digest: stableHash(JSON.stringify(messages))
    };
}

function stripRolePrefix(content, role) {
    const label = role === 'assistant' ? 'Assistant' : 'User';
    return normalizeText(content).replace(new RegExp(`^${label}:\\s*`, 'i'), '').trim();
}

export function pairPersonaMemMessages(messages = []) {
    const systemMessages = [];
    let sourceSystemMessageCount = 0;
    const seenSystemContent = new Set();
    const turns = [];
    let pending = null;
    const flush = () => {
        if (pending && (pending.userMessage || pending.assistantMessage)) turns.push(pending);
        pending = null;
    };
    for (const [messageIndex, message] of messages.entries()) {
        const role = normalizeText(message?.role).toLowerCase();
        const content = normalizeText(message?.content);
        if (!content) continue;
        if (role === 'system') {
            flush();
            sourceSystemMessageCount += 1;
            if (!seenSystemContent.has(content)) {
                seenSystemContent.add(content);
                systemMessages.push({ content, messageIndex });
            }
            continue;
        }
        if (!['user', 'assistant'].includes(role)) continue;
        const clean = stripRolePrefix(content, role);
        if (role === 'user') {
            flush();
            pending = { userMessage: clean, assistantMessage: '', messageIndexes: [messageIndex] };
        } else if (!pending) {
            pending = { userMessage: '', assistantMessage: clean, messageIndexes: [messageIndex] };
        } else {
            pending.assistantMessage = [pending.assistantMessage, clean].filter(Boolean).join('\n\n');
            pending.messageIndexes.push(messageIndex);
        }
    }
    flush();
    return { systemMessages, sourceSystemMessageCount, turns };
}

export function buildExactSliceGroups(rows, contexts) {
    const byKey = new Map();
    for (const row of rows) {
        const slice = slicePersonaMemContext(row, contexts);
        const key = `${row.shared_context_id}:${slice.endIndex}:${slice.resolvedEndIndex}:${slice.digest}`;
        if (!byKey.has(key)) {
            byKey.set(key, {
                key,
                sliceId: stableHash(key).slice(0, 20),
                personaId: row.persona_id,
                sharedContextId: row.shared_context_id,
                endIndex: slice.endIndex,
                resolvedEndIndex: slice.resolvedEndIndex,
                slice,
                rows: []
            });
        }
        byKey.get(key).rows.push(row);
    }
    return [...byKey.values()];
}

export function selectStratifiedPersonaMemSample(
    rows,
    contexts,
    { perType = 1, seed = 'ailis-personamem-v1', preferPersonaDiversity = true } = {}
) {
    const targetTypes = [...new Set(rows.map((row) => row.question_type))].sort();
    const remaining = Object.fromEntries(targetTypes.map((type) => [type, perType]));
    const groups = buildExactSliceGroups(rows, contexts);
    const available = new Map(groups.map((group) => [group.key, group]));
    const selectedGroups = [];
    const usedPersonas = new Set();
    while (Object.values(remaining).some((count) => count > 0)) {
        const candidates = [...available.values()].map((group) => {
            const coveredTypes = targetTypes.filter(
                (type) => remaining[type] > 0 && group.rows.some((row) => row.question_type === type)
            );
            return {
                group,
                coveredTypes,
                newPersona: !usedPersonas.has(group.personaId),
                tieBreak: stableHash(seed, group.key)
            };
        }).filter((entry) => entry.coveredTypes.length);
        if (!candidates.length) {
            throw new Error(`Unable to complete PersonaMem stratification: ${JSON.stringify(remaining)}`);
        }
        candidates.sort((left, right) => {
            if (preferPersonaDiversity && left.newPersona !== right.newPersona) {
                return left.newPersona ? -1 : 1;
            }
            return right.coveredTypes.length - left.coveredTypes.length ||
                right.group.rows.length - left.group.rows.length ||
                left.tieBreak.localeCompare(right.tieBreak);
        });
        const chosen = candidates[0];
        const selectedRows = [];
        for (const type of chosen.coveredTypes.sort()) {
            const matching = chosen.group.rows
                .filter((row) => row.question_type === type)
                .sort((left, right) =>
                    stableHash(seed, left.question_id).localeCompare(stableHash(seed, right.question_id))
                );
            if (matching[0]) {
                selectedRows.push(matching[0]);
                remaining[type] -= 1;
            }
        }
        selectedGroups.push({ ...chosen.group, selectedRows });
        usedPersonas.add(chosen.group.personaId);
        available.delete(chosen.group.key);
    }
    return {
        seed,
        perType,
        targetTypes,
        selectedGroups,
        selectedRows: selectedGroups.flatMap((group) => group.selectedRows),
        personaCount: usedPersonas.size
    };
}

function compareBalancedCover(left, right, seed) {
    if (!right) return -1;
    return left.groups.length - right.groups.length ||
        left.includedMessageCount - right.includedMessageCount ||
        stableHash(seed, ...left.groups.map((group) => group.key)).localeCompare(
            stableHash(seed, ...right.groups.map((group) => group.key))
        );
}

export function selectBalancedPersonaMemSample(
    rows,
    contexts,
    { seed = 'ailis-personamem-balanced140-v1' } = {}
) {
    const targetTypes = [...new Set(rows.map((row) => row.question_type))].sort();
    const personas = [...new Set(rows.map((row) => row.persona_id))]
        .sort((left, right) => Number(left) - Number(right) || left.localeCompare(right));
    const allGroups = buildExactSliceGroups(rows, contexts);
    const selectedGroups = [];
    const fullMask = (1 << targetTypes.length) - 1;

    for (const personaId of personas) {
        const personaGroups = allGroups
            .filter((group) => group.personaId === personaId)
            .sort((left, right) => stableHash(seed, left.key).localeCompare(stableHash(seed, right.key)));
        let covers = new Map([[0, { groups: [], includedMessageCount: 0 }]]);
        for (const group of personaGroups) {
            const groupMask = targetTypes.reduce((mask, type, index) =>
                group.rows.some((row) => row.question_type === type) ? mask | (1 << index) : mask, 0);
            if (!groupMask) continue;
            const next = new Map(covers);
            for (const [mask, candidate] of covers.entries()) {
                const nextMask = mask | groupMask;
                if (nextMask === mask) continue;
                const proposal = {
                    groups: [...candidate.groups, group],
                    includedMessageCount:
                        candidate.includedMessageCount + group.slice.includedMessageCount
                };
                if (compareBalancedCover(proposal, next.get(nextMask), seed) < 0) {
                    next.set(nextMask, proposal);
                }
            }
            covers = next;
        }
        const cover = covers.get(fullMask);
        if (!cover) {
            throw new Error(`PersonaMem persona ${personaId} does not cover all query types`);
        }
        const rowsByGroup = new Map(cover.groups.map((group) => [group.key, []]));
        for (const type of targetTypes) {
            const candidates = cover.groups.flatMap((group) => group.rows
                .filter((row) => row.question_type === type)
                .map((row) => ({ group, row })));
            candidates.sort((left, right) =>
                stableHash(seed, personaId, type, left.row.question_id).localeCompare(
                    stableHash(seed, personaId, type, right.row.question_id)
                ));
            const chosen = candidates[0];
            if (!chosen) throw new Error(`PersonaMem persona ${personaId} is missing ${type}`);
            rowsByGroup.get(chosen.group.key).push(chosen.row);
        }
        for (const group of cover.groups) {
            const selectedRows = rowsByGroup.get(group.key);
            if (selectedRows.length) selectedGroups.push({ ...group, selectedRows });
        }
    }
    const selectedRows = selectedGroups.flatMap((group) => group.selectedRows);
    for (const personaId of personas) {
        for (const type of targetTypes) {
            const count = selectedRows.filter((row) =>
                row.persona_id === personaId && row.question_type === type).length;
            if (count !== 1) {
                throw new Error(`PersonaMem balanced sample mismatch ${personaId}/${type}: ${count}`);
            }
        }
    }
    return {
        design: 'balanced_one_per_persona_type',
        seed,
        perType: personas.length,
        targetTypes,
        selectedGroups,
        selectedRows,
        personaCount: personas.length,
        personas
    };
}

export function shardPersonaMemSample(sample, { shardIndex = 0, shardCount = 1 } = {}) {
    if (!Number.isInteger(shardCount) || shardCount < 1) throw new Error('Invalid shard count');
    if (!Number.isInteger(shardIndex) || shardIndex < 0 || shardIndex >= shardCount) {
        throw new Error('Invalid shard index');
    }
    if (shardCount === 1) {
        return {
            ...sample,
            shard: { index: 0, count: 1, estimatedLoad: 0 },
            parentSelectedQuestionCount: sample.selectedRows.length,
            parentSelectedSliceCount: sample.selectedGroups.length
        };
    }
    const order = new Map(sample.selectedGroups.map((group, index) => [group.key, index]));
    const bins = Array.from({ length: shardCount }, (_, index) => ({ index, load: 0, groups: [] }));
    const weighted = sample.selectedGroups.map((group) => {
        const paired = pairPersonaMemMessages(group.slice.messages);
        const memoryEvents = paired.systemMessages.length + paired.turns.length;
        return {
            group,
            weight: memoryEvents + group.selectedRows.length * 12,
            tieBreak: stableHash(sample.seed, group.key)
        };
    }).sort((left, right) => right.weight - left.weight || left.tieBreak.localeCompare(right.tieBreak));
    for (const entry of weighted) {
        bins.sort((left, right) => left.load - right.load || left.index - right.index);
        bins[0].groups.push(entry.group);
        bins[0].load += entry.weight;
    }
    const chosen = bins.find((bin) => bin.index === shardIndex);
    chosen.groups.sort((left, right) => order.get(left.key) - order.get(right.key));
    const selectedRows = chosen.groups.flatMap((group) => group.selectedRows);
    return {
        ...sample,
        selectedGroups: chosen.groups,
        selectedRows,
        personaCount: new Set(selectedRows.map((row) => row.persona_id)).size,
        shard: { index: shardIndex, count: shardCount, estimatedLoad: chosen.load },
        parentSelectedQuestionCount: sample.selectedRows.length,
        parentSelectedSliceCount: sample.selectedGroups.length
    };
}

export function buildPersonaMemQuestionPrompt(row) {
    return [
        normalizeText(row.user_question_or_message),
        '',
        PERSONAMEM_ANSWER_INSTRUCTION,
        '',
        normalizeText(row.all_options)
    ].join('\n');
}

function optionSet(text) {
    const normalized = String(text || '').toLowerCase();
    const parenthesized = [...normalized.matchAll(/\(([a-d])\)/g)].map((match) => match[1]);
    return new Set(parenthesized.length ? parenthesized : [...normalized.matchAll(/\b([a-d])\b/g)].map((match) => match[1]));
}

export function scorePersonaMemAnswer(modelResponse, correctAnswer) {
    const full = String(modelResponse || '');
    let predicted = full.trim();
    if (predicted.includes('<final_answer>')) predicted = predicted.split('<final_answer>').at(-1).trim();
    if (predicted.endsWith('</final_answer>')) {
        predicted = predicted.slice(0, -'</final_answer>'.length).trim();
    }
    const correct = normalizeText(correctAnswer).toLowerCase().replace(/[()\s]/g, '');
    const predictedOptions = optionSet(predicted);
    const fullOptions = optionSet(full);
    const parsedOption = predictedOptions.size === 1 ? [...predictedOptions][0]
        : fullOptions.size === 1 ? [...fullOptions][0]
            : '';
    return {
        correct: predictedOptions.size === 1 && predictedOptions.has(correct) ||
            fullOptions.size === 1 && fullOptions.has(correct),
        correctOption: correct,
        predictedOption: parsedOption,
        extractedAnswer: predicted
    };
}

export function aggregatePersonaMemResults(results = []) {
    const completed = results.filter((entry) => entry.status === 'completed');
    const correct = completed.filter((entry) => entry.score?.correct === true).length;
    const byQuestionType = {};
    for (const result of results) {
        const type = result.question_type || 'unknown';
        byQuestionType[type] ||= { total: 0, completed: 0, correct: 0, accuracy: null };
        const bucket = byQuestionType[type];
        bucket.total += 1;
        if (result.status === 'completed') bucket.completed += 1;
        if (result.score?.correct === true) bucket.correct += 1;
    }
    for (const bucket of Object.values(byQuestionType)) {
        bucket.accuracy = bucket.completed ? bucket.correct / bucket.completed : null;
    }
    return {
        total: results.length,
        completed: completed.length,
        failed: results.length - completed.length,
        correct,
        accuracy: completed.length ? correct / completed.length : null,
        byQuestionType
    };
}

export async function curatePersonaMemLedger(memory, options = {}) {
    if (!memory || typeof memory.curateMemoryLedger !== 'function') {
        throw new TypeError('PersonaMem Ledger curation requires a memory runtime');
    }
    const maxBatchesPerPass = Math.max(
        1,
        Math.min(Number(options.maxBatchesPerPass) || 100, 100)
    );
    const eventCount = Math.max(0, Number(memory.getStatus?.()?.eventCount || 0));
    const maxPasses = Math.max(
        1,
        Number(options.maxPasses) || eventCount + 1
    );
    const maxNoProgressRetries = Math.max(
        0,
        Number(options.noProgressRetries ?? Math.max(0, Number(options.modelAttempts || 1) - 1))
    );
    const configuredRetryDelay = Number(options.noProgressRetryDelayMs);
    const noProgressRetryDelayMs = Number.isFinite(configuredRetryDelay)
        ? Math.max(0, configuredRetryDelay)
        : 5_000;
    const totals = {
        processedEventCount: 0,
        evidenceCount: 0,
        batchCount: 0,
        supersededCount: 0
    };
    let remainingEntryCount = eventCount;
    let recordCount = 0;
    let lastStatus = 'not_started';
    let lastError = '';
    let consecutiveNoProgressFailures = 0;

    for (let pass = 1; pass <= maxPasses; pass += 1) {
        const result = await memory.curateMemoryLedger({
            maxBatches: maxBatchesPerPass,
            eventLimit: options.eventLimit,
            maxChars: options.maxChars,
            maxTokens: options.maxTokens,
            timeoutMs: options.timeoutMs,
            modelAttempts: options.modelAttempts
        });
        const run = result?.run || {};
        const processedThisPass = Math.max(0, Number(run.processedEventCount || 0));
        totals.processedEventCount += processedThisPass;
        totals.evidenceCount += Math.max(0, Number(run.evidenceCount || 0));
        totals.batchCount += Math.max(0, Number(run.batchCount || 0));
        totals.supersededCount += Math.max(0, Number(run.supersededCount || 0));
        remainingEntryCount = Math.max(0, Number(run.remainingEntryCount || 0));
        recordCount = Math.max(0, Number(result?.stateSummary?.recordCount || recordCount));
        lastStatus = result?.status || run.status || 'unknown';
        lastError = normalizeText(result?.error);

        if (result?.ok !== true) {
            const retryableFailure = /llm|timeout|network|fetch|rate|429/i.test(
                `${lastStatus} ${lastError}`
            );
            if (retryableFailure && consecutiveNoProgressFailures < maxNoProgressRetries) {
                consecutiveNoProgressFailures += 1;
                if (noProgressRetryDelayMs > 0) {
                    await new Promise((resolve) => setTimeout(
                        resolve,
                        noProgressRetryDelayMs * consecutiveNoProgressFailures
                    ));
                }
                continue;
            }
            return {
                ok: false,
                status: lastStatus,
                passCount: pass,
                ...totals,
                recordCount,
                remainingEntryCount,
                error: lastError
            };
        }
        consecutiveNoProgressFailures = 0;
        if (remainingEntryCount === 0) {
            return {
                ok: true,
                status: lastStatus,
                passCount: pass,
                ...totals,
                recordCount,
                remainingEntryCount: 0,
                error: ''
            };
        }
        if (processedThisPass === 0) {
            return {
                ok: false,
                status: 'stalled_partial_completed',
                passCount: pass,
                ...totals,
                recordCount,
                remainingEntryCount,
                error: `Ledger curation made no progress with ${remainingEntryCount} entries remaining`
            };
        }
    }

    return {
        ok: false,
        status: 'pass_limit_exhausted',
        passCount: maxPasses,
        ...totals,
        recordCount,
        remainingEntryCount,
        error: `Ledger curation exceeded ${maxPasses} passes with ${remainingEntryCount} entries remaining`
    };
}
