'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_CODEX_MODEL = 'gpt-5.6-luna';
const BUNDLED_GPT_5_6_INSTRUCTIONS_PATH = path.join(
    __dirname,
    'prompts',
    'codex-gpt-5.6.instructions.md'
);
const resolvedInstructions = new Map();

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const normalized = value.trim();
    return normalized || fallback;
}

function codexHomeCandidates() {
    return [...new Set([
        normalizeText(process.env.CODEX_HOME),
        process.env.USERPROFILE ? path.join(process.env.USERPROFILE, '.codex') : ''
    ].filter(Boolean))];
}

function readCachedModelInstructions(model = DEFAULT_CODEX_MODEL) {
    for (const codexHome of codexHomeCandidates()) {
        const cachePath = path.join(codexHome, 'models_cache.json');
        try {
            const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
            const modelEntry = (Array.isArray(cache?.models) ? cache.models : [])
                .find((entry) => normalizeText(entry?.slug) === model);
            const instructions = normalizeText(modelEntry?.model_messages?.instructions_template);
            if (instructions) {
                return instructions;
            }
        } catch {
            // The bundled snapshot below keeps AILIS deterministic without a local Codex cache.
        }
    }
    return '';
}

function readBundledInstructions() {
    return normalizeText(fs.readFileSync(BUNDLED_GPT_5_6_INSTRUCTIONS_PATH, 'utf8'));
}

function resolveCodexNativeInstructions(model = DEFAULT_CODEX_MODEL) {
    const normalizedModel = normalizeText(model, DEFAULT_CODEX_MODEL);
    if (resolvedInstructions.has(normalizedModel)) {
        return resolvedInstructions.get(normalizedModel);
    }
    const instructions = readCachedModelInstructions(normalizedModel) || readBundledInstructions();
    resolvedInstructions.set(normalizedModel, instructions);
    return instructions;
}

module.exports = {
    BUNDLED_GPT_5_6_INSTRUCTIONS_PATH,
    DEFAULT_CODEX_MODEL,
    resolveCodexNativeInstructions
};
