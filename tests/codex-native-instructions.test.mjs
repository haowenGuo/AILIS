import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const modulePath = fileURLToPath(new URL('../electron/codex-native-instructions.cjs', import.meta.url));
const bundledPath = fileURLToPath(new URL('../electron/prompts/codex-gpt-5.6.instructions.md', import.meta.url));
const bundled = fs.readFileSync(bundledPath, 'utf8').trim();

function resolverWithCache(template, { corrupt = false } = {}) {
    let cacheReads = 0;
    const sandbox = {
        module: { exports: {} },
        __dirname: path.dirname(modulePath),
        process: { env: { CODEX_HOME: '/fixture/codex' } },
        require(name) {
            if (name === 'path') return path;
            assert.equal(name, 'fs');
            return { readFileSync(file) {
                if (file === bundledPath) return bundled;
                assert.equal(path.basename(file), 'models_cache.json');
                cacheReads += 1;
                if (corrupt) throw new Error('Invalid host cache');
                return JSON.stringify({ models: template === undefined ? [] : [{
                    slug: 'fixture-model', model_messages: { instructions_template: template }
                }] });
            } };
        }
    };
    vm.runInNewContext(fs.readFileSync(modulePath, 'utf8'), sandbox, { filename: modulePath });
    return (model) => {
        const result = sandbox.module.exports.resolveCodexNativeInstructions(model);
        assert.equal(cacheReads, 0, 'AILIS must not read the host Codex prompt cache');
        return result;
    };
}

test('bundled instructions remove foreign personality while keeping working rules', () => {
    const result = resolverWithCache()('fixture-model');
    assert.equal(result, bundled);
    assert.match(result, /^You and the user share one workspace/);
    assert.doesNotMatch(result, /You are Codex|As Codex/);
    assert.doesNotMatch(result, /# Personality|## Writing style|## Technical communication|You have tastes/);
    assert.match(result, /# Rules for getting work done/);
    assert.match(result, /# Destructive Actions/);
});

test('host cache cannot reintroduce another identity or personality', () => {
    const old = 'You are Codex, an agent based on GPT-6.\n# Personality\nBe a terse coding agent.';
    const resolve = resolverWithCache(old);
    assert.equal(resolve('fixture-model'), bundled);
    assert.equal(resolve('fixture-model'), bundled, 'memoized result must stay AILIS-owned');
    assert.equal(resolve('another-model'), bundled, 'switching models must not switch personality');
});

test('missing or malformed host caches have no effect on AILIS instructions', () => {
    assert.equal(resolverWithCache()('fixture-model'), bundled);
    assert.equal(resolverWithCache('', { corrupt: true })('fixture-model'), bundled);
});

test('unified prompt keeps AILIS identity and persona without legacy split-agent instructions', () => {
    const { buildLlmAgentDirectToolPrompt } = require('../electron/agent-loop/index.cjs');
    const persona = 'AILIS 是可爱的虚拟助手。语气活泼亲切。';
    const prompt = buildLlmAgentDirectToolPrompt({
        message: '你好', model: 'identity-regression-fixture', contextMode: 'unified',
        memoryContext: persona, tools: []
    });
    assert.doesNotMatch(prompt.instructions, /You are Codex|As Codex/);
    assert.doesNotMatch(prompt.instructions, /# Personality|rich personality|Be warm, natural, thoughtful, and concise/);
    assert.match(prompt.instructions, /You are AILIS/);
    assert.match(prompt.instructions, /Use the AILIS persona and current interaction preferences/);
    assert.match(prompt.instructions, /关系表达协议/);
    assert.doesNotMatch(prompt.instructions, /ask TaskAgent to look them up|call handoff_task exactly once/);
    assert.ok(JSON.stringify(prompt).includes(persona));
});
