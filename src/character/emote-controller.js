const BLINK_CLOSE_SECONDS = 0.12;
const BLINK_OPEN_SECONDS = 5;
const EXPRESSION_SMOOTHING = 14;
const LIP_SYNC_SMOOTHING = 20;

const DEFAULT_HOLD_SECONDS = Object.freeze({
    short: 2.4,
    medium: 3.6,
    long: 5.2,
    hold: Infinity
});

const EMOTION_FALLBACK_MIXES = Object.freeze({
    neutral: { relaxed: 0.16 },
    relaxed: { relaxed: 0.42 },
    happy: { happy: 0.42, relaxed: 0.18 },
    angry: { angry: 0.5 },
    sad: { sad: 0.48, relaxed: 0.16 },
    surprised: { surprised: 0.46, relaxed: 0.1 },
    shy: { happy: 0.16, relaxed: 0.28, blinkRight: 0.2 },
    jealous: { angry: 0.22, sad: 0.12, relaxed: 0.12 },
    bored: { relaxed: 0.24, sad: 0.12 },
    serious: { relaxed: 0.34, surprised: 0.06 },
    suspicious: { surprised: 0.16, angry: 0.12, relaxed: 0.16 },
    victory: { happy: 0.5, relaxed: 0.18 },
    sleep: { relaxed: 0.28, sad: 0.12, blink: 0.24 },
    love: { happy: 0.22, relaxed: 0.34, blinkRight: 0.18 }
});

function clamp(value, minimum = 0, maximum = 1) {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) {
        return minimum;
    }
    return Math.min(Math.max(numberValue, minimum), maximum);
}

function getLerpAlpha(deltaTime, smoothing) {
    return 1 - Math.exp(-Math.max(0, deltaTime) * smoothing);
}

function normalizeDurationHint(value) {
    const normalized = String(value || '').trim().toLowerCase();
    return normalized in DEFAULT_HOLD_SECONDS ? normalized : 'short';
}

export class CharacterEmoteController {
    constructor({
        getExpressionPresets = () => ({}),
        defaultMix = { relaxed: 0.18 }
    } = {}) {
        this.vrm = null;
        this.expressionManager = null;
        this.getExpressionPresets = getExpressionPresets;
        this.defaultMix = { ...defaultMix };
        this.expressionNames = new Set(Object.keys(this.getExpressionPresets() || {}));
        this.emotionTarget = { ...this.defaultMix };
        this.expressionValues = {};
        this.holdRemainingSeconds = Infinity;
        this.lipSyncTarget = 0;
        this.lipSyncValue = 0;
        this.autoBlinkEnabled = true;
        this.blinkRemainingSeconds = BLINK_OPEN_SECONDS;
        this.isBlinkClosed = false;
        this.cachedKnownExpressionNames = [];
    }

    bindVrm(vrm) {
        this.vrm = vrm || null;
        this.expressionManager = vrm?.expressionManager || null;
        this.registerCustomExpressions(vrm);
        this.expressionNames = new Set([
            ...Object.keys(this.getExpressionPresets() || {}),
            ...this.discoverExpressionNames(vrm)
        ]);
        this.expressionValues = {};
        this.emotionTarget = { ...this.defaultMix };
        this.holdRemainingSeconds = Infinity;
        this.lipSyncTarget = 0;
        this.lipSyncValue = 0;
        this.blinkRemainingSeconds = BLINK_OPEN_SECONDS;
        this.isBlinkClosed = false;
        this.refreshKnownExpressionNames(['aa', 'blink']);
        this.applyAllExpressionsImmediately(0);
    }

    discoverExpressionNames(vrm = this.vrm) {
        const manager = vrm?.expressionManager;
        const names = new Set();
        for (const name of Object.keys(this.getExpressionPresets() || {})) {
            names.add(name);
        }
        for (const expression of manager?.expressions || []) {
            if (expression?.expressionName) {
                names.add(expression.expressionName);
            }
        }
        for (const name of Object.keys(manager?.expressionMap || {})) {
            names.add(name);
        }
        for (const name of Object.keys(manager?.presetExpressionMap || {})) {
            names.add(name);
        }
        return [...names];
    }

    registerCustomExpressions(vrm = this.vrm) {
        const manager = vrm?.expressionManager;
        if (!manager?.expressionMap || typeof manager.registerExpression !== 'function') {
            return [];
        }

        const allExpressions = manager.expressionMap || {};
        const presetExpressions = manager.presetExpressionMap || {};
        const customNames = Object.keys(allExpressions).filter((name) => !(name in presetExpressions));
        for (const expressionName of customNames) {
            const expression = allExpressions[expressionName];
            if (!expression) {
                continue;
            }
            try {
                manager.registerExpression(expression);
            } catch {
                // Some three-vrm versions already register these expressions.
            }
        }
        return customNames;
    }

    getKnownExpressionNames(extraNames = []) {
        return new Set([
            ...Object.keys(this.getExpressionPresets() || {}),
            ...this.expressionNames,
            ...Object.keys(this.expressionValues || {}),
            ...Object.keys(this.emotionTarget || {}),
            ...extraNames
        ]);
    }

    refreshKnownExpressionNames(extraNames = []) {
        this.cachedKnownExpressionNames = [...this.getKnownExpressionNames(extraNames)];
        return this.cachedKnownExpressionNames;
    }

    resolveExpressionName(expressionName) {
        if (!expressionName) {
            return '';
        }
        const normalized = String(expressionName).trim();
        if (this.expressionNames.has(normalized)) {
            return normalized;
        }
        const lower = normalized.toLowerCase();
        for (const name of this.expressionNames) {
            if (String(name).toLowerCase() === lower) {
                return name;
            }
        }
        return '';
    }

    sanitizeMix(mix = {}) {
        const sanitized = {};
        for (const [name, value] of Object.entries(mix || {})) {
            const resolvedName = this.resolveExpressionName(name);
            if (!resolvedName) {
                continue;
            }
            const safeValue = clamp(value);
            if (safeValue > 0.01) {
                sanitized[resolvedName] = Number(safeValue.toFixed(3));
            }
        }
        return sanitized;
    }

    setEmotionMix(mix = {}, { durationHint = 'short' } = {}) {
        const sanitized = this.sanitizeMix(mix);
        this.emotionTarget = Object.keys(sanitized).length ? sanitized : { ...this.defaultMix };
        this.holdRemainingSeconds = DEFAULT_HOLD_SECONDS[normalizeDurationHint(durationHint)];
        return true;
    }

    playEmotion(emotionName, options = {}) {
        const normalized = String(emotionName || 'relaxed').trim().toLowerCase();
        const directExpressionName = this.resolveExpressionName(normalized);
        const fallbackMix = EMOTION_FALLBACK_MIXES[normalized] || EMOTION_FALLBACK_MIXES.relaxed;
        const mix = directExpressionName
            ? { [directExpressionName]: normalized === 'surprised' ? 0.5 : 1 }
            : fallbackMix;
        return this.setEmotionMix(mix, {
            durationHint: options.durationHint || 'medium'
        });
    }

    lipSync(expressionName = 'aa', value = 0) {
        if (this.resolveExpressionName(expressionName || 'aa') !== 'aa') {
            return this.setLipSyncValue(value);
        }
        return this.setLipSyncValue(value);
    }

    clearEmotionMix() {
        this.emotionTarget = { ...this.defaultMix };
        this.holdRemainingSeconds = Infinity;
        return true;
    }

    setLipSyncValue(value) {
        this.lipSyncTarget = clamp(value);
    }

    setAutoBlinkEnabled(enabled) {
        this.autoBlinkEnabled = Boolean(enabled);
        if (!this.autoBlinkEnabled && this.isBlinkClosed) {
            this.openBlink();
        }
    }

    forceBlink() {
        if (!this.expressionManager) {
            return false;
        }
        this.closeBlink();
        return true;
    }

    closeBlink() {
        this.isBlinkClosed = true;
        this.blinkRemainingSeconds = BLINK_CLOSE_SECONDS;
    }

    openBlink() {
        this.isBlinkClosed = false;
        this.blinkRemainingSeconds = BLINK_OPEN_SECONDS;
    }

    shouldAutoBlink() {
        if (!this.autoBlinkEnabled) {
            return false;
        }
        return !(
            this.emotionTarget.blink ||
            this.emotionTarget.blinkLeft ||
            this.emotionTarget.blinkRight
        );
    }

    updateBlink(deltaTime) {
        if (!this.shouldAutoBlink()) {
            if (this.isBlinkClosed) {
                this.openBlink();
            }
            return;
        }

        this.blinkRemainingSeconds -= Math.max(0, deltaTime);
        if (this.blinkRemainingSeconds > 0) {
            return;
        }

        if (this.isBlinkClosed) {
            this.openBlink();
            return;
        }
        this.closeBlink();
    }

    updateHold(deltaTime) {
        if (!Number.isFinite(this.holdRemainingSeconds)) {
            return;
        }
        this.holdRemainingSeconds -= Math.max(0, deltaTime);
        if (this.holdRemainingSeconds <= 0) {
            this.clearEmotionMix();
        }
    }

    getTargetValue(expressionName) {
        if (expressionName === 'aa') {
            return this.lipSyncValue;
        }
        if (expressionName === 'blink') {
            return Math.max(this.emotionTarget.blink || 0, this.isBlinkClosed ? 1 : 0);
        }
        return this.emotionTarget[expressionName] || 0;
    }

    setManagerValue(expressionName, value) {
        if (!this.expressionManager || expressionName === 'neutral') {
            return;
        }
        try {
            this.expressionManager.setValue(expressionName, clamp(value));
        } catch {
            // Some VRM files expose fewer expression presets than the config.
        }
    }

    applyAllExpressionsImmediately(value = 0) {
        for (const name of this.getKnownExpressionNames(['aa', 'blink'])) {
            this.expressionValues[name] = value;
            this.setManagerValue(name, value);
        }
        this.refreshKnownExpressionNames(['aa', 'blink']);
    }

    update(deltaTime) {
        if (!this.expressionManager) {
            return;
        }

        this.updateHold(deltaTime);
        this.updateBlink(deltaTime);

        const expressionAlpha = getLerpAlpha(deltaTime, EXPRESSION_SMOOTHING);
        const lipAlpha = getLerpAlpha(deltaTime, LIP_SYNC_SMOOTHING);
        this.lipSyncValue += (this.lipSyncTarget - this.lipSyncValue) * lipAlpha;

        const knownNames = this.cachedKnownExpressionNames.length
            ? this.cachedKnownExpressionNames
            : this.refreshKnownExpressionNames(['aa', 'blink']);
        for (const name of knownNames) {
            const current = this.expressionValues[name] || 0;
            const target = this.getTargetValue(name);
            const next = current + (target - current) * expressionAlpha;
            this.expressionValues[name] = next;
            this.setManagerValue(name, next);
        }
    }
}
