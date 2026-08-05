import catalogData from '../../electron/ailis-character-action-catalog.json' with { type: 'json' };

const normalizeId = (value) => String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '_');

const categories = Object.freeze(
    catalogData.categories.map((category) => Object.freeze({
        ...category,
        defaultSurface: Object.freeze({ ...(category.defaultSurface || {}) })
    }))
);
const categoryById = new Map(categories.map((category) => [category.id, category]));
const aliases = Object.freeze({ ...(catalogData.aliases || {}) });
const intents = Object.freeze(
    catalogData.intents.map((intent) => {
        const category = categoryById.get(intent.category);
        if (!category) {
            throw new Error(`Unknown character action category: ${intent.category}`);
        }
        return Object.freeze({
            ...intent,
            fallbackIntent: normalizeId(intent.fallbackIntent),
            surface: Object.freeze({
                ...category.defaultSurface,
                ...(intent.surface || {}),
                gestureIntent: intent.id
            })
        });
    })
);
const intentById = new Map(intents.map((intent) => [intent.id, intent]));

if (intentById.size !== intents.length) {
    throw new Error('Character action catalog contains duplicate intent ids.');
}
for (const intent of intents) {
    if (intent.fallbackIntent && !intentById.has(intent.fallbackIntent)) {
        throw new Error(
            `Character action ${intent.id} references unknown fallback ${intent.fallbackIntent}.`
        );
    }
}

export const CHARACTER_ACTION_CATALOG_SCHEMA = catalogData.schema;
export const CHARACTER_ACTION_CATALOG_VERSION = catalogData.version;
export const CHARACTER_ACTION_CATEGORIES = categories;
export const CHARACTER_ACTION_INTENTS = intents;
export const CHARACTER_ACTION_INTENT_IDS = Object.freeze(intents.map((intent) => intent.id));
export const CHARACTER_ACTION_ALIASES = aliases;

export function normalizeCharacterActionIntent(value, fallback = 'none') {
    const normalized = normalizeId(value);
    const resolved = aliases[normalized] || normalized;
    return intentById.has(resolved) ? resolved : fallback;
}

export function getCharacterActionIntent(value) {
    return intentById.get(normalizeCharacterActionIntent(value, '')) || null;
}

export function getCharacterActionFallbackChain(value, { includeSelf = true } = {}) {
    const startId = normalizeCharacterActionIntent(value);
    const chain = [];
    const visited = new Set();
    let currentId = startId;
    while (currentId && !visited.has(currentId)) {
        visited.add(currentId);
        if (includeSelf || currentId !== startId) {
            chain.push(currentId);
        }
        currentId = intentById.get(currentId)?.fallbackIntent || '';
    }
    return chain;
}

export function createCharacterActionSurface(value, overrides = {}) {
    const intent = getCharacterActionIntent(value) || getCharacterActionIntent('none');
    return {
        ...intent.surface,
        ...overrides,
        gestureIntent: intent.id,
        gestureFallbacks: getCharacterActionFallbackChain(intent.id, { includeSelf: false })
    };
}

export function listCharacterActionIntents(category = '') {
    const normalizedCategory = normalizeId(category);
    return intents
        .filter((intent) => !normalizedCategory || intent.category === normalizedCategory)
        .map((intent) => ({
            ...intent,
            surface: { ...intent.surface }
        }));
}

export function formatCharacterActionCatalogForPrompt() {
    return categories.map((category) => {
        const categoryIntents = intents
            .filter((intent) => intent.category === category.id)
            .map((intent) => intent.id)
            .join('|');
        return `${category.label}: ${categoryIntents}`;
    }).join('\n');
}

export function getCharacterActionSupport(value, motions = []) {
    const chain = getCharacterActionFallbackChain(value);
    for (let rank = 0; rank < chain.length; rank += 1) {
        const intentId = chain[rank];
        const matches = motions
            .filter((motion) => motion?.gestureIntents?.some(
                (candidate) => normalizeCharacterActionIntent(candidate, '') === intentId
            ))
            .sort((left, right) => Number(right.priority || 0) - Number(left.priority || 0));
        const approved = matches.find((motion) =>
            normalizeId(motion.compatibility || 'approved') === 'approved'
        );
        if (approved) {
            return {
                status: rank === 0 ? 'exact' : 'fallback',
                requestedIntent: chain[0],
                resolvedIntent: intentId,
                motion: approved
            };
        }
        const reviewed = matches[0];
        const fallbackMotion = motions.find((motion) =>
            reviewed?.fallbackMotionId &&
            normalizeId(motion.id) === normalizeId(reviewed.fallbackMotionId) &&
            normalizeId(motion.compatibility || 'approved') === 'approved'
        );
        if (fallbackMotion) {
            return {
                status: 'motion_fallback',
                requestedIntent: chain[0],
                resolvedIntent: intentId,
                reviewedMotion: reviewed,
                motion: fallbackMotion
            };
        }
    }
    return {
        status: 'unmapped',
        requestedIntent: chain[0] || 'none',
        resolvedIntent: 'none',
        motion: null
    };
}
