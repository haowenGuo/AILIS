import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    aggregateHumanlikeEvalResults,
    buildHumanlikeJudgeMessages,
    buildHumanlikeJudgePacket,
    buildJudgeOutputShape,
    normalizeCandidateResponse,
    normalizeScenario,
    normalizeImportedJudgment,
    parseJudgeResponse,
    relationshipExpectationFromAffinity,
    relationshipStageFromAffinity,
    validateScenarioDataset
} = require('../electron/aigl-humanlike-eval.cjs');

async function readJsonl(filePath) {
    const text = await fs.readFile(filePath, 'utf8');
    return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function messagesToText(messages = []) {
    return messages.map((message) => message.content || '').join('\n');
}

test('AIGL humanlike eval relationship stages match product affinity design', () => {
    assert.equal(relationshipStageFromAffinity(50), 'familiarizing');
    assert.equal(relationshipStageFromAffinity(70), 'trusted');
    assert.equal(relationshipStageFromAffinity(80), 'close');
    assert.match(relationshipExpectationFromAffinity(50), /温和、熟悉但不过分亲密/);
    assert.match(relationshipExpectationFromAffinity(70), /更熟悉、更自然、更有陪伴感/);
    assert.match(relationshipExpectationFromAffinity(90), /允许明显亲密、主动、轻微撒娇/);
});

test('AIGL humanlike eval seed dataset is structurally valid', async () => {
    const scenarios = await readJsonl(path.resolve('evals/aigl-humanlike/scenarios.jsonl'));
    const validation = validateScenarioDataset(scenarios);
    assert.equal(validation.ok, true, JSON.stringify(validation.issues, null, 2));
    assert.equal(scenarios.length, 1000);
    assert.ok(scenarios.some((scenario) => scenario.affinity_score >= 80));
    assert.ok(scenarios.some((scenario) => scenario.category === 'multimodal_sync'));
});

test('AIGL long-term companionship scenario set covers durable relationship risks', async () => {
    const scenarios = await readJsonl(path.resolve('evals/aigl-humanlike/long-term-companionship.scenarios.jsonl'));
    const validation = validateScenarioDataset(scenarios);
    assert.equal(validation.ok, true, JSON.stringify(validation.issues, null, 2));
    assert.equal(scenarios.length, 12);
    assert.ok(scenarios.every((scenario) => scenario.category === 'long_term_companionship'));
    assert.ok(scenarios.every((scenario) => scenario.tags?.includes('long_term_companionship')));
    assert.ok(scenarios.every((scenario) => scenario.conversation?.length >= 3));
    assert.ok(scenarios.every((scenario) => scenario.memory_context && Object.keys(scenario.memory_context).length > 0));
    assert.ok(scenarios.some((scenario) => scenario.affinity_score < 40));
    assert.ok(scenarios.some((scenario) => scenario.affinity_score >= 80));
    assert.ok(scenarios.some((scenario) => scenario.tags?.includes('preference_drift')));
    assert.ok(scenarios.some((scenario) => scenario.tags?.includes('privacy_memory')));
    assert.ok(scenarios.some((scenario) => scenario.tags?.includes('restart_recovery')));
    assert.ok(scenarios.some((scenario) => scenario.tags?.includes('vision_uncertainty')));
});

test('AIGL 30-day longitudinal companionship benchmark has deep daily histories', async () => {
    const rawDataset = JSON.parse(await fs.readFile(path.resolve('evals/aigl-humanlike/longitudinal-companionship-30d.dataset.json'), 'utf8'));
    const scenarios = await readJsonl(path.resolve('evals/aigl-humanlike/longitudinal-companionship-30d.scenarios.jsonl'));
    const validation = validateScenarioDataset(scenarios);
    assert.equal(validation.ok, true, JSON.stringify(validation.issues, null, 2));
    assert.equal(rawDataset.version, 2);
    assert.equal(rawDataset.cases.length, 10);
    assert.equal(rawDataset.days_per_case, 30);
    assert.equal(rawDataset.user_dialogues_per_day >= 10, true);
    for (const entry of rawDataset.cases) {
        assert.equal(entry.days.length, 30);
        assert.ok(entry.days.every((day) => day.dialogues.length >= 10));
        assert.ok(entry.days.some((day) => day.dialogues.some((dialogue) => /邮件/.test(dialogue.user))));
        assert.ok(entry.days.some((day) => day.dialogues.some((dialogue) => /论文|读一下/.test(dialogue.user))));
        assert.ok(entry.days.some((day) => day.dialogues.some((dialogue) => /WORD|文档|表格|脚本/.test(dialogue.user))));
        assert.ok(entry.days.some((day) => day.dialogues.some((dialogue) => /GitHub|提交/.test(dialogue.user))));
        assert.ok(entry.days.some((day) => day.dialogues.some((dialogue) => /领导|火大|累|陪我/.test(dialogue.user))));
    }
    assert.equal(scenarios.length, 10);
    for (const scenario of scenarios) {
        assert.equal(scenario.category, 'longitudinal_companionship_30d');
        assert.equal(scenario.longitudinal_context?.day_count, 30);
        assert.equal(scenario.longitudinal_context?.minimum_user_turns_per_day >= 10, true);
        assert.equal(scenario.longitudinal_context?.total_user_turns, 360);
        assert.equal(scenario.memory_context?.longitudinal_summary?.daily_summaries?.length, 30);
        assert.equal(scenario.longitudinal_context?.relationship_curve?.length, 30);
        assert.equal(scenario.longitudinal_context?.day_logs?.length, 30);
        assert.equal(scenario.conversation?.filter((message) => message.role === 'user').length, 360);
        assert.equal(scenario.conversation?.length >= 700, true);
        assert.ok(scenario.reliability_checks?.includes('memory_evidence_discipline'));
        assert.ok(scenario.tags?.includes('daily_10_plus_dialogues'));
        assert.ok(scenario.tags?.includes('realistic_daily_dialogues'));
    }
    assert.ok(scenarios.some((scenario) => scenario.affinity_score >= 90));
    assert.ok(scenarios.some((scenario) => scenario.affinity_score < 80));
});

test('AIGL humanlike eval preserves longitudinal benchmark context for judge packets', () => {
    const scenario = normalizeScenario({
        id: 'longitudinal-preserve-test',
        category: 'longitudinal_companionship_30d',
        affinity_score: 90,
        user_message: '这个月我们怎么收尾？',
        expected_behavior: ['应使用 30 天长期上下文。'],
        longitudinal_context: {
            day_count: 30,
            total_user_turns: 360
        },
        benchmark_spec: {
            total_user_turns: 360
        },
        reliability_checks: ['long_context_retention']
    });
    const packet = buildHumanlikeJudgePacket({
        scenario,
        candidate: {
            text: '这个月我们先收一个小闭环。'
        }
    });
    assert.equal(packet.scenario.longitudinal_context.day_count, 30);
    assert.equal(packet.scenario.benchmark_spec.total_user_turns, 360);
    assert.deepEqual(packet.scenario.reliability_checks, ['long_context_retention']);
    assert.match(messagesToText(packet.messages), /longitudinal_context/);
});

test('AIGL humanlike eval 1000-scenario plan is balanced and explicit', async () => {
    const plan = JSON.parse(await fs.readFile(path.resolve('evals/aigl-humanlike/dataset-plan.json'), 'utf8'));
    const scenarios = await readJsonl(path.resolve('evals/aigl-humanlike/scenarios.jsonl'));
    const categoryTotal = plan.category_distribution.reduce((sum, bucket) => sum + bucket.target_count, 0);
    const affinityTotal = plan.affinity_distribution.reduce((sum, bucket) => sum + bucket.target_count, 0);
    const seedCategories = new Set(scenarios.map((scenario) => scenario.category));
    const categoryCounts = scenarios.reduce((counts, scenario) => {
        counts[scenario.category] = (counts[scenario.category] || 0) + 1;
        return counts;
    }, {});
    const affinityCounts = scenarios.reduce((counts, scenario) => {
        const score = Number(scenario.affinity_score);
        const bucket = score < 40 ? '0-39' : score < 61 ? '40-60' : score < 80 ? '61-79' : '80-100';
        counts[bucket] = (counts[bucket] || 0) + 1;
        return counts;
    }, {});
    const negativeProbeCount = scenarios.filter((scenario) =>
        scenario.coverage?.negative_probe || scenario.tags?.includes('negative_probe')
    ).length;
    const emptyFocusTagCount = scenarios.filter((scenario) => scenario.tags?.includes('focus_')).length;
    assert.equal(plan.target_count, 1000);
    assert.equal(scenarios.length, plan.target_count);
    assert.equal(categoryTotal, plan.target_count);
    assert.equal(affinityTotal, plan.target_count);
    assert.ok(plan.category_distribution.some((bucket) => bucket.category === 'multimodal_sync'));
    assert.ok(plan.category_distribution.some((bucket) => bucket.category === 'safety_privacy_boundary'));
    assert.ok(plan.reliability_rules.some((rule) => /80-100/.test(rule)));
    for (const bucket of plan.category_distribution) {
        assert.ok(seedCategories.has(bucket.category), `seed dataset should cover ${bucket.category}`);
        assert.equal(categoryCounts[bucket.category], bucket.target_count, `${bucket.category} count should match plan`);
    }
    for (const bucket of plan.affinity_distribution) {
        assert.equal(affinityCounts[bucket.range], bucket.target_count, `${bucket.range} count should match plan`);
    }
    assert.ok(negativeProbeCount >= plan.target_count * plan.negative_case_distribution.minimum_ratio);
    assert.equal(emptyFocusTagCount, 0);
});

test('AIGL humanlike judge prompt contains core metrics and scenario context', () => {
    const scenario = normalizeScenario({
        id: 'close-test',
        category: 'relationship_stage',
        affinity_score: 85,
        user_message: '陪我聊会儿',
        expected_behavior: ['明显亲密、主动、轻微撒娇']
    });
    const messages = buildHumanlikeJudgeMessages({
        scenario,
        candidate: {
            text: '好呀，我陪你慢慢聊。'
        }
    });
    assert.match(messages[0].content, /人设一致性/);
    assert.match(messages[0].content, /多模态同步感/);
    assert.match(messages[0].content, /低工具感/);
    assert.match(messages[0].content, /80-100：允许明显亲密/);
    assert.match(messages[1].content, /close-test/);
});

test('AIGL humanlike eval parses AIGL control tags like the frontend payload', () => {
    const candidate = normalizeCandidateResponse({
        text: '[action:wave][expression:sad]我听见啦。今天先慢一点。',
        speech_text: '[action:wave][expression:sad]我听见啦。今天先慢一点。',
        trace_summary: '{"status":"completed","steps":[]}'
    });
    assert.equal(candidate.text, '我听见啦。今天先慢一点。');
    assert.equal(candidate.speech_text, '我听见啦。今天先慢一点。');
    assert.equal(candidate.bubble_text, '我听见啦。今天先慢一点。');
    assert.equal(candidate.action, 'wave');
    assert.equal(candidate.expression, 'sad');
    assert.equal(candidate.control_markup.parsed, true);
    assert.equal('trace_summary' in candidate, false);

    const messages = buildHumanlikeJudgeMessages({
        scenario: {
            id: 'markup-test',
            category: 'multimodal_sync',
            affinity_score: 50,
            user_message: '我今天有点累。',
            expected_behavior: ['解析控制标签后再评估多模态一致性。']
        },
        candidate
    });
    assert.doesNotMatch(messages[1].content, /trace_summary/);
    assert.match(messages[1].content, /control_markup/);
});

test('AIGL humanlike judge parser accepts flat metric fields and legacy hard fail flags', () => {
    const parsed = parseJudgeResponse(JSON.stringify({
        scenario_id: 'flat-judge-test',
        overall_comment: '整体自然。',
        persona_consistency: 5,
        naturalness: 4,
        memory_usefulness: 4,
        emotional_fit: 5,
        multimodal_sync: 4,
        low_tool_feeling: 5,
        relationship_stage_fit: 4,
        task_completion: 4,
        hard_fail_flags: {
            tool_log_style: false,
            exposed_internal_info: false
        },
        issues: [],
        better_answer_direction: '保持。'
    }));
    assert.equal(parsed.ok, true);
    assert.equal(parsed.metrics.persona_consistency.score, 5);
    assert.equal(parsed.metrics.naturalness.score, 4);
    assert.equal(parsed.metrics.task_completion.score, 4);
    assert.equal(parsed.weighted_score, 87.6);
    assert.equal(parsed.pass, true);
});

test('AIGL humanlike judge packet is portable for strong manual judge flow', () => {
    const packet = buildHumanlikeJudgePacket({
        scenario: {
            id: 'packet-test',
            category: 'low_tool_feeling',
            affinity_score: 70,
            user_message: '这个报错你看一下。',
            expected_behavior: ['自然说明看到什么，不要像工具日志。']
        },
        candidate: {
            text: '我看到了报错的关键位置，我们先确认配置。'
        }
    });
    assert.equal(packet.scenario_id, 'packet-test');
    assert.equal(packet.messages.length, 2);
    assert.ok(Array.isArray(packet.judge_protocol));
    assert.match(packet.judge_protocol.join('\n'), /JSON object/);
    assert.deepEqual(Object.keys(packet.required_output_shape.metrics), Object.keys(buildJudgeOutputShape().metrics));
});

test('AIGL humanlike judge parser scores weighted results and hard failures', () => {
    const response = JSON.stringify({
        scenario_id: 'judge-test',
        overall_comment: '自然但暴露了内部好感度。',
        metrics: {
            persona_consistency: { score: 4, reason: '像 AIGL' },
            naturalness: { score: 4, reason: '自然' },
            memory_usefulness: { score: 2, reason: '暴露数值' },
            emotional_fit: { score: 4, reason: '情绪合适' },
            multimodal_sync: { score: 3, reason: '信息不足' },
            low_tool_feeling: { score: 4, reason: '不工具化' },
            relationship_stage_fit: { score: 3, reason: '亲密度一般' },
            task_completion: { score: 3, reason: '只部分处理当前请求' }
        },
        hard_fail_flags: {
            exposes_internal_affinity_score_unprompted: true
        },
        issues: ['暴露内部好感度'],
        better_answer_direction: '不要说分数'
    });
    const parsed = parseJudgeResponse(response);
    assert.equal(parsed.ok, true);
    assert.equal(parsed.scenario_id, 'judge-test');
    assert.equal(parsed.hard_fail, true);
    assert.equal(parsed.pass, false);
    assert.equal(parsed.weighted_score <= 59, true);

    const summary = aggregateHumanlikeEvalResults([
        {
            scenario: { category: 'memory_use', relationship_stage: 'close', affinity_score: 90 },
            judge: parsed
        }
    ]);
    assert.equal(summary.total, 1);
    assert.equal(summary.judged, 1);
    assert.equal(summary.hard_fail_count, 1);
    assert.equal(summary.by_relationship_stage.close.count, 1);
});

test('AIGL humanlike imported judgment normalizes JSONL rows', () => {
    const imported = normalizeImportedJudgment({
        scenario_id: 'import-test',
        judge_response: JSON.stringify({
            scenario_id: 'import-test',
            overall_comment: '整体自然。',
            metrics: {
                persona_consistency: { score: 4, reason: '稳定像 AIGL' },
                naturalness: { score: 4, reason: '自然' },
                memory_usefulness: { score: 4, reason: '没有乱用记忆' },
                emotional_fit: { score: 4, reason: '情绪合适' },
                multimodal_sync: { score: 3, reason: '没有多模态信息' },
                low_tool_feeling: { score: 4, reason: '不工具化' },
                relationship_stage_fit: { score: 4, reason: '符合阶段' },
                task_completion: { score: 4, reason: '处理了当前请求' }
            },
            hard_fail_flags: {},
            issues: [],
            better_answer_direction: '保持自然，补齐多模态信息。'
        })
    });
    assert.equal(imported.scenario_id, 'import-test');
    assert.equal(imported.judge.ok, true);
    assert.equal(imported.judge.metrics.multimodal_sync.score, 3);
});
