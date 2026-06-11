const EXPRESSION_MIXES = Object.freeze({
    neutral: { relaxed: 0.18 },
    relaxed: { relaxed: 0.42 },
    happy: { happy: 0.34, relaxed: 0.24 },
    shy: { happy: 0.16, relaxed: 0.32, blinkRight: 0.26 },
    sad: { sad: 0.48, relaxed: 0.16 },
    angry: { angry: 0.46 },
    surprised: { surprised: 0.48, relaxed: 0.1 },
    jealous: { angry: 0.2, sad: 0.12, relaxed: 0.12 },
    bored: { relaxed: 0.24, sad: 0.1 },
    serious: { relaxed: 0.34, surprised: 0.06 },
    suspicious: { surprised: 0.16, angry: 0.12, relaxed: 0.16 },
    victory: { happy: 0.5, relaxed: 0.18 },
    sleep: { relaxed: 0.28, sad: 0.12, blink: 0.22 },
    love: { love: 0.44, happy: 0.18, relaxed: 0.26, blinkRight: 0.14 },
    anxious: { surprised: 0.18, sad: 0.2, relaxed: 0.18 },
    tired: { sad: 0.28, relaxed: 0.24 },
    thinking: { relaxed: 0.32, surprised: 0.09 },
    focused: { relaxed: 0.4 },
    comforting: { relaxed: 0.44, sad: 0.12 }
});

const TASK_STATE_EXPRESSION_MIXES = Object.freeze({
    idle: { relaxed: 0.3 },
    listening: { relaxed: 0.36 },
    thinking: { relaxed: 0.34, surprised: 0.1 },
    speaking: null,
    working: { relaxed: 0.36 },
    waiting_approval: { relaxed: 0.36, surprised: 0.12 },
    happy_success: { happy: 0.36, relaxed: 0.22 },
    apologizing: { sad: 0.24, relaxed: 0.3 },
    comforting: { relaxed: 0.44, sad: 0.1 },
    blocked: { sad: 0.2, relaxed: 0.24 },
    failed: { sad: 0.28, relaxed: 0.2 }
});

const LEGACY_EXPRESSION_MIXES = Object.freeze({
    happy: { happy: 0.42, relaxed: 0.18 },
    angry: { angry: 0.55 },
    sad: { sad: 0.58 },
    surprised: { surprised: 0.58 },
    relaxed: { relaxed: 0.48 },
    blinkRight: { blinkRight: 0.55, happy: 0.12 },
    shy: { happy: 0.16, relaxed: 0.28, blinkRight: 0.22 },
    love: { love: 0.45, happy: 0.2, relaxed: 0.24 },
    victory: { happy: 0.52, relaxed: 0.18 },
    sleep: { relaxed: 0.25, sad: 0.12, blink: 0.28 },
    serious: { relaxed: 0.4, surprised: 0.06 },
    suspicious: { surprised: 0.18, angry: 0.12 },
    jealous: { angry: 0.2, sad: 0.12 }
});

function clamp(value, minimum = 0, maximum = 1) {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) {
        return minimum;
    }
    return Math.min(Math.max(numberValue, minimum), maximum);
}

function addWeightedMix(target, source, weight = 1) {
    if (!source) {
        return target;
    }
    for (const [expressionName, value] of Object.entries(source)) {
        target[expressionName] = clamp((target[expressionName] || 0) + value * weight);
    }
    return target;
}

function normalizeMix(mix) {
    const normalized = {};
    for (const [expressionName, value] of Object.entries(mix || {})) {
        const safeValue = clamp(value);
        if (safeValue > 0.01) {
            normalized[expressionName] = Number(safeValue.toFixed(3));
        }
    }
    return normalized;
}

export function mixExpressionsForSurface(surface = {}) {
    const intensity = clamp(surface.intensity, 0.25, 0.9);
    const toneWeight = surface.socialTone === 'soft' || surface.socialTone === 'quiet' ? 0.85 : 1;
    const emotionMix = EXPRESSION_MIXES[surface.emotion] || EXPRESSION_MIXES.relaxed;
    const taskMix = TASK_STATE_EXPRESSION_MIXES[surface.taskState];
    const legacyMix = LEGACY_EXPRESSION_MIXES[surface.legacyExpression] || null;
    const expressionMix = {};

    addWeightedMix(expressionMix, emotionMix, 0.72 + intensity * 0.45);
    addWeightedMix(expressionMix, taskMix, 0.45);
    addWeightedMix(expressionMix, legacyMix, legacyMix ? 0.85 : 0);

    for (const expressionName of Object.keys(expressionMix)) {
        expressionMix[expressionName] *= toneWeight;
    }

    return normalizeMix(expressionMix);
}

export function mixExpressionsForAmicaEmotion(emotionName = 'relaxed', options = {}) {
    return normalizeMix({
        ...(EXPRESSION_MIXES[emotionName] || EXPRESSION_MIXES.relaxed),
        ...(options.extraMix || {})
    });
}

export function getPrimaryExpressionForSurface(surface = {}) {
    const mix = mixExpressionsForSurface(surface);
    const entries = Object.entries(mix).sort((a, b) => b[1] - a[1]);
    return entries[0]?.[0] || 'relaxed';
}
