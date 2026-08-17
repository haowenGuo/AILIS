'use strict';

const { createHash } = require('crypto');

function normalizeText(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function stableValue(value, key = '') {
    if (/token|password|secret|api[_-]?key|authorization|credential/i.test(key)) {
        return '[redacted]';
    }
    if (Array.isArray(value)) {
        return value.map((entry) => stableValue(entry));
    }
    if (!value || typeof value !== 'object') {
        return value;
    }
    return Object.fromEntries(
        Object.keys(value)
            .sort()
            .map((entryKey) => [entryKey, stableValue(value[entryKey], entryKey)])
    );
}

function hashValue(value) {
    return createHash('sha256')
        .update(JSON.stringify(stableValue(value)))
        .digest('hex');
}

function canonicalToolName(value = '') {
    const tool = normalizeText(value).toLowerCase();
    const parts = tool.split('__').filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : tool;
}

function isDesktopComputerStep(step = {}) {
    return canonicalToolName(step.tool) === 'computer';
}

function mechanicalComputerArgs(args = {}) {
    if (!args || typeof args !== 'object' || Array.isArray(args)) {
        return {};
    }
    const descriptiveFields = new Set([
        'description',
        'intent',
        'operation',
        'progress_note',
        'progressnote',
        'rationale',
        'reason',
        'summary',
        'timeout_ms',
        'timeoutms',
        'title'
    ]);
    return Object.fromEntries(
        Object.entries(args).filter(([key]) => !descriptiveFields.has(String(key).toLowerCase()))
    );
}

function actionFingerprint(step = {}) {
    const tool = canonicalToolName(step.tool);
    const args = step.args && typeof step.args === 'object' ? step.args : {};
    return hashValue({
        tool,
        args: tool === 'computer' ? mechanicalComputerArgs(args) : args
    });
}

function firstObject(candidates = []) {
    return candidates.find((value) => value && typeof value === 'object' && !Array.isArray(value)) || null;
}

function readExecutionState(stepResult = {}) {
    const response = stepResult.response || {};
    const result = response.result || {};
    const containers = [
        result.details,
        result.structuredContent,
        response.details,
        stepResult.details,
        stepResult.structuredContent
    ];
    for (const container of containers) {
        if (!container || typeof container !== 'object' || Array.isArray(container)) {
            continue;
        }
        const state = firstObject([
            container.executionState,
            container.execution_state,
            container.desktopExecutionState,
            container.desktop_execution_state,
            container.observationState,
            container.observation_state
        ]);
        if (state) {
            return state;
        }
    }
    return null;
}

function observationFingerprint(stepResult = {}) {
    const state = readExecutionState(stepResult);
    if (!state) {
        return '';
    }
    return normalizeText(
        state.observationHash ||
        state.observation_hash ||
        state.accessibilityHash ||
        state.accessibility_hash ||
        state.screenHash ||
        state.screen_hash
    );
}

function repeatedTail(values = [], period = 1, repetitions = 2) {
    const required = period * repetitions;
    if (period < 1 || values.length < required) {
        return false;
    }
    const tail = values.slice(-required);
    for (let index = period; index < tail.length; index += 1) {
        if (tail[index] !== tail[index % period]) {
            return false;
        }
    }
    return true;
}

function detectDesktopActionCycle(candidateStep = {}, stepResults = [], options = {}) {
    if (!isDesktopComputerStep(candidateStep)) {
        return null;
    }
    const maxCycleLength = Math.max(1, Math.min(4, Number(options.maxCycleLength) || 3));
    const repetitions = Math.max(2, Math.min(4, Number(options.repetitions) || 3));
    const history = (Array.isArray(stepResults) ? stepResults : [])
        .filter(isDesktopComputerStep)
        .slice(-(maxCycleLength * repetitions + 2));
    const actionSequence = [...history.map(actionFingerprint), actionFingerprint(candidateStep)];
    for (let period = 1; period <= maxCycleLength; period += 1) {
        if (!repeatedTail(actionSequence, period, repetitions)) {
            continue;
        }
        const requiredPreviousResults = period * repetitions - 1;
        const relevantResults = history.slice(-requiredPreviousResults);
        const observationSequence = relevantResults.map(observationFingerprint);
        if (observationSequence.some((value) => !value)) {
            continue;
        }
        const latestState = readExecutionState(relevantResults[relevantResults.length - 1]) || {};
        const noProgressStreak = Number(
            latestState.noProgressStreak ?? latestState.no_progress_streak ?? 0
        );
        const observationCycle = repeatedTail(
            observationSequence,
            period,
            Math.max(2, repetitions - 1)
        );
        if (!observationCycle && noProgressStreak < Math.max(2, period)) {
            continue;
        }
        return {
            period,
            repetitions,
            noProgressStreak,
            actionFingerprint: actionFingerprint(candidateStep),
            observationFingerprint: observationSequence[observationSequence.length - 1]
        };
    }
    return null;
}

function validateDesktopExecutionLoop(candidateStep = {}, stepResults = [], requestContext = {}) {
    if (requestContext.disableDesktopLoopFuse === true) {
        return { ok: true };
    }
    const cycle = detectDesktopActionCycle(candidateStep, stepResults, {
        maxCycleLength: requestContext.desktopLoopMaxCycleLength,
        repetitions: requestContext.desktopLoopRepetitions
    });
    if (!cycle) {
        return { ok: true };
    }
    return {
        ok: false,
        status: 'tool_loop_guard',
        error: 'The recent desktop action cycle produced no new observable state. Choose a materially different action, inspect another application or region, or verify an intermediate result before continuing.',
        details: {
            reason: 'repeated_desktop_action_cycle_without_observation_progress',
            cycleLength: cycle.period,
            repeatCount: cycle.repetitions,
            noProgressStreak: cycle.noProgressStreak,
            actionFingerprint: cycle.actionFingerprint,
            observationFingerprint: cycle.observationFingerprint
        }
    };
}

function normalizeApplications(value = []) {
    return [...new Set((Array.isArray(value) ? value : [])
        .map((entry) => normalizeText(entry))
        .filter(Boolean))];
}

function buildExecutionStateLane(stepResults = []) {
    const desktopResults = (Array.isArray(stepResults) ? stepResults : [])
        .filter(isDesktopComputerStep)
        .map((stepResult) => ({ stepResult, state: readExecutionState(stepResult) }))
        .filter((entry) => entry.state)
        .slice(-12);
    if (!desktopResults.length) {
        return null;
    }
    const latest = desktopResults[desktopResults.length - 1];
    const state = latest.state;
    const activeApplications = normalizeApplications(
        state.activeApplications || state.active_applications
    );
    const visitedApplications = normalizeApplications(
        state.visitedApplications || state.visited_applications || activeApplications
    );
    const recentTransitions = Array.isArray(state.recentTransitions || state.recent_transitions)
        ? (state.recentTransitions || state.recent_transitions).slice(-8)
        : [];
    return {
        schema: 'ailis.desktop_execution_lane.v1',
        phase: normalizeText(state.phase, 'desktop_observed'),
        activeApplications,
        visitedApplications,
        transitionCount: Number(state.transitionCount ?? state.transition_count ?? recentTransitions.length),
        recentTransitions,
        accessibilityChanged: state.accessibilityChanged ?? state.accessibility_changed ?? null,
        screenChanged: state.screenChanged ?? state.screen_changed ?? null,
        noProgressStreak: Number(state.noProgressStreak ?? state.no_progress_streak ?? 0),
        observationHash: normalizeText(state.observationHash || state.observation_hash),
        recentObservationHashes: desktopResults
            .map(({ stepResult }) => observationFingerprint(stepResult))
            .filter(Boolean),
        instruction: 'This lane records mechanical desktop state only. Treat application transitions and observation hashes as evidence; the model remains responsible for task meaning and the next strategy.'
    };
}

module.exports = {
    actionFingerprint,
    buildExecutionStateLane,
    detectDesktopActionCycle,
    mechanicalComputerArgs,
    observationFingerprint,
    readExecutionState,
    validateDesktopExecutionLoop
};
