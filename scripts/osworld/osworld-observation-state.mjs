import { createHash } from 'node:crypto';

function normalizeText(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function sha256(value) {
    return createHash('sha256').update(value || '').digest('hex');
}

function tokenizeAccessibilityTree(value = '') {
    return (String(value).match(/<[^>]+>|[^<]+/g) || [])
        .map((token) => token.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
}

function applicationName(token = '') {
    const match = token.match(/^<application\b[^>]*\bname="([^"]*)"/i);
    return match ? match[1] : '';
}

function extractVisibleApplications(tokens = []) {
    const visible = [];
    let activeApplication = '';
    let depth = 0;
    for (const token of tokens) {
        if (/^<application\b/i.test(token)) {
            const name = applicationName(token);
            if (/\/>$/.test(token)) {
                continue;
            }
            activeApplication = name;
            depth = 1;
            continue;
        }
        if (!activeApplication) {
            continue;
        }
        if (/^<application\b/i.test(token) && !/\/>$/.test(token)) {
            depth += 1;
        }
        if (/^<\/application>/i.test(token)) {
            depth -= 1;
            if (depth <= 0) {
                activeApplication = '';
                depth = 0;
            }
            continue;
        }
        if (/\bst:(?:showing|visible)="true"/i.test(token) && !visible.includes(activeApplication)) {
            visible.push(activeApplication);
        }
    }
    return visible;
}

function boundedTokenText(tokens = [], maxChars = 9000) {
    const joined = tokens.join('\n');
    if (joined.length <= maxChars) {
        return { text: joined, omittedTokens: 0 };
    }
    const headBudget = Math.floor(maxChars * 0.62);
    const tailBudget = Math.floor(maxChars * 0.28);
    const head = [];
    const tail = [];
    let headChars = 0;
    let tailChars = 0;
    for (const token of tokens) {
        if (headChars + token.length + 1 > headBudget) break;
        head.push(token);
        headChars += token.length + 1;
    }
    for (let index = tokens.length - 1; index >= head.length; index -= 1) {
        const token = tokens[index];
        if (tailChars + token.length + 1 > tailBudget) break;
        tail.unshift(token);
        tailChars += token.length + 1;
    }
    const omittedTokens = Math.max(0, tokens.length - head.length - tail.length);
    return {
        text: [
            ...head,
            `<ailis_a11y_omission omitted_tokens="${omittedTokens}" />`,
            ...tail
        ].join('\n'),
        omittedTokens
    };
}

function boundedTreeText(tree = '', tokens = [], maxChars = 9000) {
    const bounded = boundedTokenText(tokens, maxChars);
    if (tree.length <= maxChars && tree.length <= bounded.text.length) {
        return { text: tree, omittedTokens: 0 };
    }
    return bounded;
}

function tokenCounts(tokens = []) {
    const counts = new Map();
    for (const token of tokens) {
        counts.set(token, (counts.get(token) || 0) + 1);
    }
    return counts;
}

function multisetDifference(currentTokens = [], previousTokens = []) {
    const currentCounts = tokenCounts(currentTokens);
    const previousCounts = tokenCounts(previousTokens);
    const added = [];
    const removed = [];
    for (const [token, count] of currentCounts.entries()) {
        const delta = count - (previousCounts.get(token) || 0);
        for (let index = 0; index < delta; index += 1) {
            added.push(token);
        }
    }
    for (const [token, count] of previousCounts.entries()) {
        const delta = count - (currentCounts.get(token) || 0);
        for (let index = 0; index < delta; index += 1) {
            removed.push(token);
        }
    }
    const firstOrderMismatch = currentTokens.findIndex(
        (token, index) => token !== previousTokens[index]
    );
    const orderChanged = added.length === 0 &&
        removed.length === 0 &&
        currentTokens.length === previousTokens.length &&
        firstOrderMismatch >= 0;
    return {
        added,
        removed,
        orderChanged,
        firstOrderMismatch
    };
}

function compactAccessibilityTree(currentTree = '', previousTree = '', options = {}) {
    const maxChars = Math.max(2000, Number(options.maxChars) || 9000);
    const currentTokens = tokenizeAccessibilityTree(currentTree);
    const previousTokens = tokenizeAccessibilityTree(previousTree);
    const { added, removed, orderChanged, firstOrderMismatch } = multisetDifference(
        currentTokens,
        previousTokens
    );
    const changedTokenCount = added.length + removed.length + (orderChanged ? 1 : 0);
    const comparisonTokenCount = Math.max(1, currentTokens.length + previousTokens.length);
    const changedRatio = previousTokens.length ? changedTokenCount / comparisonTokenCount : 1;
    const activeApplications = extractVisibleApplications(currentTokens);
    const currentHash = sha256(currentTokens.join('\n'));
    if (!previousTokens.length || changedRatio > 0.55) {
        const bounded = boundedTreeText(currentTree, currentTokens, maxChars);
        return {
            mode: previousTokens.length ? 'full_structural_refresh' : 'full_structural_initial',
            promptText: bounded.text,
            currentHash,
            changedRatio,
            activeApplications,
            originalChars: currentTree.length,
            promptChars: bounded.text.length,
            originalTokens: currentTokens.length,
            visibleTokens: currentTokens.length - bounded.omittedTokens,
            omittedTokens: bounded.omittedTokens,
            orderChanged
        };
    }
    if (changedTokenCount === 0) {
        const promptText = `<ailis_a11y_unchanged hash="${currentHash.slice(0, 16)}" />`;
        return {
            mode: 'unchanged',
            promptText,
            currentHash,
            changedRatio,
            activeApplications,
            originalChars: currentTree.length,
            promptChars: promptText.length,
            originalTokens: currentTokens.length,
            visibleTokens: 1,
            omittedTokens: currentTokens.length,
            addedTokens: 0,
            removedTokens: 0
        };
    }
    const deltaTokens = [
        `<ailis_a11y_delta current_hash="${currentHash}" changed_ratio="${changedRatio.toFixed(4)}">`,
        `<active_applications>${activeApplications.join(', ')}</active_applications>`,
        ...(orderChanged ? [
            `<order_changed first_mismatch_index="${firstOrderMismatch}" previous_hash="${sha256(previousTokens.join('\n')).slice(0, 16)}" current_hash="${currentHash.slice(0, 16)}" />`
        ] : []),
        ...added.map((token) => `<added>${token}</added>`),
        ...removed.map((token) => `<removed>${token}</removed>`),
        '</ailis_a11y_delta>'
    ];
    const bounded = boundedTokenText(deltaTokens, maxChars);
    const boundedFullTree = boundedTreeText(currentTree, currentTokens, maxChars);
    if (bounded.text.length >= boundedFullTree.text.length) {
        return {
            mode: 'full_structural_refresh',
            promptText: boundedFullTree.text,
            currentHash,
            changedRatio,
            activeApplications,
            originalChars: currentTree.length,
            promptChars: boundedFullTree.text.length,
            originalTokens: currentTokens.length,
            visibleTokens: currentTokens.length - boundedFullTree.omittedTokens,
            omittedTokens: boundedFullTree.omittedTokens,
            addedTokens: added.length,
            removedTokens: removed.length,
            orderChanged
        };
    }
    return {
        mode: 'structural_delta',
        promptText: bounded.text,
        currentHash,
        changedRatio,
        activeApplications,
        originalChars: currentTree.length,
        promptChars: bounded.text.length,
        originalTokens: currentTokens.length,
        visibleTokens: deltaTokens.length - bounded.omittedTokens,
        omittedTokens: bounded.omittedTokens,
        addedTokens: added.length,
        removedTokens: removed.length,
        orderChanged
    };
}

function sameStringSet(left = [], right = []) {
    if (left.length !== right.length) return false;
    const rightSet = new Set(right);
    return left.every((value) => rightSet.has(value));
}

class ObservationStateTracker {
    constructor(options = {}) {
        this.maxPromptChars = Math.max(2000, Number(options.maxPromptChars) || 9000);
        this.previousTree = '';
        this.previousScreenHash = '';
        this.previousApplications = [];
        this.visitedApplications = new Set();
        this.recentTransitions = [];
        this.noProgressStreak = 0;
    }

    observe({ accessibilityTree = '', screenshotBuffer = null, action = '', step = 0 } = {}) {
        const tree = String(accessibilityTree || '');
        const screenHash = screenshotBuffer ? sha256(screenshotBuffer) : '';
        const accessibility = compactAccessibilityTree(tree, this.previousTree, {
            maxChars: this.maxPromptChars
        });
        const previousAccessibilityHash = sha256(tokenizeAccessibilityTree(this.previousTree).join('\n'));
        const accessibilityChanged = Boolean(this.previousTree) &&
            accessibility.currentHash !== previousAccessibilityHash;
        const screenChanged = Boolean(this.previousScreenHash && screenHash) && screenHash !== this.previousScreenHash;
        const observationUnchanged = Boolean(this.previousTree) &&
            !accessibilityChanged &&
            (!(this.previousScreenHash && screenHash) || !screenChanged);
        this.noProgressStreak = observationUnchanged
            ? this.noProgressStreak + 1
            : 0;
        for (const application of accessibility.activeApplications) {
            this.visitedApplications.add(application);
        }
        const applicationChanged = Boolean(this.previousTree) && !sameStringSet(
            accessibility.activeApplications,
            this.previousApplications
        );
        if (applicationChanged) {
            this.recentTransitions.push({
                step: Number(step) || 0,
                from: [...this.previousApplications],
                to: [...accessibility.activeApplications]
            });
            this.recentTransitions = this.recentTransitions.slice(-12);
        }
        const phase = applicationChanged
            ? 'application_transition'
            : accessibility.activeApplications.length > 1
              ? 'multi_app_active'
              : accessibility.activeApplications.length === 1
                ? 'single_app_active'
                : 'desktop_unknown';
        const executionState = {
            schema: 'ailis.desktop_execution_state.v1',
            phase,
            step: Number(step) || 0,
            action: normalizeText(action, 'screen_screenshot'),
            activeApplications: accessibility.activeApplications,
            visitedApplications: [...this.visitedApplications],
            transitionCount: this.recentTransitions.length,
            recentTransitions: [...this.recentTransitions],
            accessibilityChanged,
            screenChanged,
            noProgressStreak: this.noProgressStreak,
            accessibilityHash: accessibility.currentHash,
            screenHash,
            observationHash: sha256(`${accessibility.currentHash}:${screenHash}`)
        };
        this.previousTree = tree;
        this.previousScreenHash = screenHash;
        this.previousApplications = [...accessibility.activeApplications];
        return { accessibility, executionState };
    }
}

function createObservationStateTracker(options = {}) {
    return new ObservationStateTracker(options);
}

export {
    ObservationStateTracker,
    compactAccessibilityTree,
    createObservationStateTracker,
    extractVisibleApplications,
    tokenizeAccessibilityTree
};
