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

function readBundledInstructions() {
    return normalizeText(fs.readFileSync(BUNDLED_GPT_5_6_INSTRUCTIONS_PATH, 'utf8'));
}

function resolveCodexNativeInstructions(model = DEFAULT_CODEX_MODEL) {
    const normalizedModel = normalizeText(model, DEFAULT_CODEX_MODEL);
    if (resolvedInstructions.has(normalizedModel)) {
        return resolvedInstructions.get(normalizedModel);
    }
    // Keep the exported name for callers, but AILIS owns this bundled contract.
    // Never import another application's identity/style from models_cache.json.
    // AILIS personality and user preferences are supplied by Session memory.
    const instructions = readBundledInstructions();
    resolvedInstructions.set(normalizedModel, instructions);
    return instructions;
}

module.exports = {
    BUNDLED_GPT_5_6_INSTRUCTIONS_PATH,
    DEFAULT_CODEX_MODEL,
    resolveCodexNativeInstructions
};
