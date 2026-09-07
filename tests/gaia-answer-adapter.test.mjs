import test from 'node:test';
import assert from 'node:assert/strict';
import { compareGaiaAnswer, extractGaiaAnswer, scoreVisibleAnswer } from '../scripts/gaia-answer-adapter.mjs';
import { buildTaskResult, aggregateSummary } from '../scripts/run-ailis-desktop-real-gaia-eval.mjs';

test('public GAIA comparison: exact numbers, ordered lists, no fuzzy rounding', () => {
    for (const [answer, gold, ok] of [
        ['$89,706.00', '89706', true], ['86%', '86', true], ['1.46', '1.456', false],
        ['0.03', '0.01', false], ['1.7e4', '17000', true], ['', '0', false],
        ['blue, red', 'red, blue', false], ['red, blue, green', 'red, blue', false],
        ['3/4,30/5,30/5', '3/4,30/5', false], ['a-b', 'ab', true],
        ['a-b,c', 'ab,c', false], ['sea gull', 'Seagull.', true]
    ]) assert.equal(compareGaiaAnswer(answer, gold), ok, `${answer} / ${gold}`);
});

test('extraction and submitted answer are independent of reference changes', () => {
    const response = { displayText: 'Answer: 7\n\nThe example in 2022 mentions 42.' };
    const scores = ['7', '42', '2022', 'unknown'].map(gold => scoreVisibleAnswer({ response, gold, question: 'How many?' }));
    for (const score of scores) {
        assert.equal(score.answer, '7');
        assert.equal(score.submittedAnswer, '7');
        assert.deepEqual(score.candidates, scores[0].candidates);
    }
    assert.deepEqual(scores.map(s => s.ok), [true, false, false, false]);
});

test('negative guards: alternatives, extra list items, reference in explanation', () => {
    for (const response of [
        'Answer: 7 or 9', 'Answer: not 9', 'Answer: 7\nAnswer: 9',
        'Answer: 7\n\\boxed{9}', 'The result is **7**.\nThe reference example is 9.'
    ]) assert.equal(scoreVisibleAnswer({ response: { displayText: response }, gold: '9', question: 'How many?' }).ok, false, response);
});

test('explicit zero and long structured answer are not discarded or truncated', () => {
    assert.equal(scoreVisibleAnswer({ response: { exactAnswer: 0 }, gold: '0' }).ok, true);
    const answer = Array.from({ length: 150 }, (_, i) => `item-${i}`).join(', ');
    const extraction = extractGaiaAnswer({ response: { exactAnswer: answer } });
    assert.equal(extraction.answer, answer);
    assert.equal(scoreVisibleAnswer({ response: { exactAnswer: answer }, gold: answer }).ok, true);
});

test('same boxed quantity repeats are allowed, unequal boxes are review-only', () => {
    assert.equal(scoreVisibleAnswer({ response: { displayText: '\\boxed{39\\text{ square units}} and \\boxed{39}' }, gold: '39', question: 'What is the area?' }).ok, true);
    assert.equal(scoreVisibleAnswer({ response: { displayText: '\\boxed{38} and \\boxed{39}' }, gold: '39' }).needsManualReview, true);
});

test('do not mis-scale a unitless answer already expressed in requested thousands', () => {
    const response = { displayText: 'Answer: 17' };
    const question = 'How many thousand hours would it take?';
    assert.equal(scoreVisibleAnswer({ response, question, gold: '17' }).ok, true);
    assert.equal(scoreVisibleAnswer({ response, question, gold: '0.017' }).ok, false);
});

test('an interrupted response is not a scored success even if it mentions gold', () => {
    for (const response of [{ ok: false, displayText: 'Answer: 9' }, { status: 'running', displayText: 'Answer: 9' }]) {
        const s = scoreVisibleAnswer({ response, gold: '9' });
        assert.equal(s.ok, false);
        assert.equal(s.needsManualReview, true);
    }
});

test('old runner stores full final response, adapter version and review state', () => {
    const text = 'The result is **0.1777 m³**.\n\n' + 'Additional evidence. '.repeat(200);
    const result = buildTaskResult({ args: {}, task: { question: 'What is the volume?', final_answer: '0.1777' }, response: { ok: true, status: 'completed', displayText: text }, durationMs: 5, eventSummary: { usage: {} }, payloadPreview: {} });
    assert.equal(result.final_response, text);
    assert.equal(result.submitted_answer, '0.1777');
    assert.equal(result.score_valid, true);
    assert.match(result.score_contract, /v2$/);
    const review = buildTaskResult({ args: {}, task: { final_answer: '9' }, response: { ok: true, status: 'completed', displayText: 'Answer: 7\nAnswer: 9' }, durationMs: 5, eventSummary: { usage: {} }, payloadPreview: {} });
    assert.equal(review.score_valid, false);
    const summary = aggregateSummary({ args: {}, results: [result, review], startedAt: '2026-01-01T00:00:00Z', finishedAt: '2026-01-01T00:01:00Z', runtimeSettings: {} });
    assert.equal(summary.totals.manualReview, 1);
    assert.equal(summary.totals.failed, 0);
});
