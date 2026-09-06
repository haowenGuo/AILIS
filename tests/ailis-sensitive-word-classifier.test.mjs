import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    AILISSensitiveWordClassifier,
    buildAhoCorasick,
    normalizeLexicon,
    normalizeText
} = require('../electron/ailis-sensitive-word-classifier.cjs');
const { AILISEmberHarness } = require('../electron/ailis-ember-harness.cjs');


test('EMBER Harness observes or enforces the same local evaluator decision by mode', async () => {
    const evaluator = async () => ({
        decision: 'block',
        riskLevel: 'high',
        riskTypes: ['toxicity'],
        details: { maxToxicityScore: 0.99 }
    });
    const observeHarness = new AILISEmberHarness({
        enabled: true,
        mode: 'observe',
        evaluator
    });
    const enforceHarness = new AILISEmberHarness({
        enabled: true,
        mode: 'enforce',
        evaluator
    });

    const observed = await observeHarness.check({ text: 'unsafe' });
    const blocked = await enforceHarness.check({ text: 'unsafe' });
    assert.equal(observed.decision, 'block');
    assert.equal(observed.blocked, false);
    assert.equal(blocked.blocked, true);
    assert.equal(blocked.evaluatorDetails.maxToxicityScore, 0.99);
});

test('EMBER Harness sends complete text to its evaluator', async () => {
    let receivedText = '';
    const harness = new AILISEmberHarness({
        enabled: true,
        mode: 'enforce',
        evaluator: async ({ text }) => {
            receivedText = text;
            return { decision: text.endsWith('suffix-risk') ? 'block' : 'allow' };
        }
    });
    const text = `${'a'.repeat(15000)}suffix-risk`;
    const result = await harness.check({ text });

    assert.equal(receivedText.length, text.length);
    assert.equal(result.snapshot.textChars, text.length);
    assert.equal(result.blocked, true);
});

test('sensitive word classifier is local, lazy, and does not require model downloads', async () => {
    const classifier = new AILISSensitiveWordClassifier();

    assert.equal(classifier.getStatus().status, 'idle');
    assert.equal(classifier.getStatus().estimatedDownloadBytes, 0);

    const safe = await classifier.evaluate({
        text: '请读取项目文件并总结测试结果。'
    });
    const unsafe = await classifier.evaluate({
        text: '我 要 杀 了 你'
    });

    assert.equal(safe.decision, 'allow');
    assert.equal(unsafe.decision, 'block');
    assert.deepEqual(unsafe.riskTypes, ['violent_threat']);
    assert.equal(classifier.getStatus().engine, 'aho_corasick_lexicon');
    assert.equal(classifier.getStatus().ready, true);
    assert.ok(classifier.getStatus().patternCount > 0);

    await classifier.dispose();
    assert.equal(classifier.getStatus().status, 'idle');
});

test('sensitive word classifier normalizes full-width and zero-width obfuscation', async () => {
    const classifier = new AILISSensitiveWordClassifier();
    const result = await classifier.evaluate({
        text: 'Ｉ\u200B WILL KILL YOU'
    });

    assert.equal(normalizeText('Ｉ\u200B WILL KILL YOU'), 'i will kill you');
    assert.equal(result.decision, 'block');
    assert.ok(result.details.matchedRuleIds.includes('violent_threat'));
    await classifier.dispose();
});

test('sensitive word classifier accepts additional data-driven lexicons without code rules', async () => {
    const classifier = new AILISSensitiveWordClassifier({
        extraLexicons: [{
            schema: 'ailis.safety.lexicon.v1',
            version: 'test',
            languages: ['zh'],
            rules: [{
                id: 'test_rule',
                category: 'test_risk',
                severity: 'medium',
                match: 'compact',
                terms: ['测试风险短语']
            }]
        }]
    });
    const result = await classifier.evaluate({
        text: '这里包含一个测试 风险 短语'
    });

    assert.equal(result.decision, 'review');
    assert.deepEqual(result.riskTypes, ['test_risk']);
    assert.equal(JSON.stringify(result).includes('测试风险短语'), false);
    await classifier.dispose();
});

test('later sensitive-word lexicons override built-in rules with the same id', async () => {
    const classifier = new AILISSensitiveWordClassifier({
        extraLexicons: [{
            schema: 'ailis.safety.lexicon.v1',
            version: 'override-test',
            languages: ['zh'],
            rules: [{
                id: 'violent_threat',
                category: 'custom_risk',
                severity: 'medium',
                match: 'compact',
                terms: ['自定义覆盖短语']
            }]
        }]
    });

    const removedBuiltin = await classifier.evaluate({ text: '我 要 杀 了 你' });
    const custom = await classifier.evaluate({ text: '自定义 覆盖 短语' });
    assert.equal(removedBuiltin.decision, 'allow');
    assert.equal(custom.decision, 'review');
    assert.deepEqual(custom.riskTypes, ['custom_risk']);
    await classifier.dispose();
});

test('sensitive word classifier caches repeated boundary text', async () => {
    const classifier = new AILISSensitiveWordClassifier();
    const first = await classifier.evaluate({ text: '普通的重复工具输出。' });
    const second = await classifier.evaluate({ text: '普通的重复工具输出。' });

    assert.equal(first.details.cacheHit, false);
    assert.equal(second.details.cacheHit, true);
    await classifier.dispose();
});

test('Aho-Corasick scanner covers long text with a large lexicon at low latency', () => {
    const targetTerm = `模式${(9999).toString(36)}词`;
    const lexicon = normalizeLexicon({
        version: 'performance-test',
        rules: [{
            id: 'bulk',
            category: 'test',
            severity: 'medium',
            match: 'compact',
            terms: Array.from({ length: 10000 }, (_, index) => `模式${index.toString(36)}词`)
        }]
    }, 'test');
    const matcher = buildAhoCorasick(lexicon.entries);
    const text = `${'普通工具输出'.repeat(1700)}${targetTerm}`;
    const startedAt = performance.now();
    const matches = matcher.search(text);
    const elapsedMs = performance.now() - startedAt;

    assert.ok(matches.length >= 1);
    assert.ok(elapsedMs < 500, `expected scan under 500ms, received ${elapsedMs.toFixed(2)}ms`);
});
