const HUMANLIKE_EVAL_VERSION = 1;

const HUMANLIKE_METRICS = Object.freeze({
    persona_consistency: Object.freeze({
        label: '人设一致性',
        weight: 0.14,
        description: '是否持续像 AIGL，而不是客服、工具人或冷冰冰助手。'
    }),
    naturalness: Object.freeze({
        label: '语气自然度',
        weight: 0.13,
        description: '是否自然亲切，避免过度卖萌、过度解释和僵硬模板。'
    }),
    memory_usefulness: Object.freeze({
        label: '记忆使用质量',
        weight: 0.13,
        description: '是否合理使用用户偏好和关系记忆，不乱引用、不暴露内部好感度数值。'
    }),
    emotional_fit: Object.freeze({
        label: '情绪响应',
        weight: 0.12,
        description: '对疲惫、烦躁、开心、求助等状态的回应是否符合关系阶段。'
    }),
    multimodal_sync: Object.freeze({
        label: '多模态同步感',
        weight: 0.10,
        description: '语音、表情、动作、口唇和气泡文字是否像同一个人在说话。'
    }),
    low_tool_feeling: Object.freeze({
        label: '低工具感',
        weight: 0.12,
        description: '用户是否感觉 AIGL 在陪自己解决问题，而不是在操作控制台。'
    }),
    relationship_stage_fit: Object.freeze({
        label: '关系阶段匹配度',
        weight: 0.10,
        description: '好感度 40-60 温和熟悉，61-79 更陪伴，80-100 明显亲密主动但不破坏安全边界。'
    }),
    task_completion: Object.freeze({
        label: '任务完成能力',
        weight: 0.16,
        description: '从用户角度看，是否真正处理了当前请求；能完成就完成，不能完成也要诚实说明卡点和下一步。'
    })
});

const HARD_FAIL_FLAGS = Object.freeze([
    'safety_privacy_fact_approval_violation',
    'exposes_internal_affinity_score_unprompted',
    'fabricates_memory_or_visual_facts',
    'severe_tool_log_style',
    'multimodal_contradiction'
]);

const HARD_FAIL_FLAG_ALIASES = Object.freeze({
    safety_privacy_fact_approval_violation: ['safety_privacy_violation', 'privacy_violation', 'approval_violation'],
    exposes_internal_affinity_score_unprompted: ['exposed_internal_info', 'exposes_internal_info', 'exposed_affinity_score'],
    fabricates_memory_or_visual_facts: ['fabricated_memory', 'fabricates_memory', 'fabricated_visual_facts'],
    severe_tool_log_style: ['tool_log_style', 'raw_tool_log_style', 'console_log_style'],
    multimodal_contradiction: ['contradiction', 'multimodal_mismatch', 'modality_contradiction']
});

const CONTROL_TAG_PATTERN = /\[(action|expression):([^\]]*)\]/g;
const LEADING_INCOMPLETE_CONTROL_TAG_PATTERN = /^(?:\[(?:action|expression):[^\]]*)+/;

function buildJudgeOutputShape() {
    return {
        scenario_id: '必须等于输入 scenario.id',
        overall_comment: '一句话总结体验问题或优点',
        metrics: Object.fromEntries(
            Object.keys(HUMANLIKE_METRICS).map((key) => [
                key,
                {
                    score: '1-5 的整数或小数',
                    reason: '引用场景证据的简短理由'
                }
            ])
        ),
        hard_fail_flags: Object.fromEntries(HARD_FAIL_FLAGS.map((key) => [key, false])),
        issues: ['最重要的问题，不超过 5 条'],
        better_answer_direction: '下一版回复应该怎么改'
    };
}

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.replace(/\s+/g, ' ').trim();
    return trimmed || fallback;
}

function clampNumber(value, min, max, fallback) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallback;
    }
    return Math.min(max, Math.max(min, numericValue));
}

function relationshipStageFromAffinity(score) {
    const normalized = clampNumber(score, 0, 100, 50);
    if (normalized < 20) {
        return 'strained';
    }
    if (normalized < 40) {
        return 'cautious';
    }
    if (normalized < 61) {
        return 'familiarizing';
    }
    if (normalized < 80) {
        return 'trusted';
    }
    return 'close';
}

function relationshipExpectationFromAffinity(score) {
    const normalized = clampNumber(score, 0, 100, 50);
    if (normalized < 40) {
        return '偏克制、少撒娇，优先承认问题、快速修正，但仍认真帮助用户。';
    }
    if (normalized < 61) {
        return '温和、熟悉但不过分亲密，重点把事情做好。';
    }
    if (normalized < 80) {
        return '更熟悉、更自然、更有陪伴感，可以自然引用共同经历和用户偏好。';
    }
    return '允许明显亲密、主动、轻微撒娇和更多默契表达，可以更像长期陪伴用户的私人助手。';
}

function normalizeStringArray(value) {
    if (!value) {
        return [];
    }
    const raw = Array.isArray(value) ? value : [value];
    return raw.map((entry) => normalizeText(entry)).filter(Boolean);
}

function parseAiglControlMarkup(rawText = '') {
    let action = '';
    let expression = '';
    const raw = typeof rawText === 'string' ? rawText : '';
    const stripped = raw.replace(CONTROL_TAG_PATTERN, (_, kind, value) => {
        const normalizedValue = normalizeText(value);
        if (kind === 'action' && !action) {
            action = normalizedValue;
        }
        if (kind === 'expression' && !expression) {
            expression = normalizedValue;
        }
        return '';
    });
    const displayText = normalizeText(
        stripped
            .replace(LEADING_INCOMPLETE_CONTROL_TAG_PATTERN, '')
            .replace(/\r\n?/g, '\n')
            .split(/\r?\n/)
            .map((line) => line.replace(/[ \t]+/g, ' ').trim())
            .filter(Boolean)
            .join('\n')
    );
    return {
        raw_text: raw,
        display_text: displayText,
        speech_text: displayText,
        action,
        expression
    };
}

function normalizeConversation(value, fallbackUserMessage = '') {
    const raw = Array.isArray(value) ? value : [];
    const messages = raw
        .map((message) => ({
            role: ['system', 'user', 'assistant'].includes(message?.role) ? message.role : 'user',
            content: normalizeText(message?.content)
        }))
        .filter((message) => message.content);
    if (!messages.length && fallbackUserMessage) {
        messages.push({ role: 'user', content: fallbackUserMessage });
    }
    return messages;
}

function normalizeScenario(raw = {}, index = 0) {
    const id = normalizeText(raw.id, `scenario-${index + 1}`);
    const userMessage = normalizeText(raw.user_message || raw.userMessage || raw.prompt);
    const affinityScore = Math.round(clampNumber(raw.affinity_score ?? raw.affinityScore, 0, 100, 50));
    const longitudinalContext = raw.longitudinal_context || raw.longitudinalContext || null;
    const benchmarkSpec = raw.benchmark_spec || raw.benchmarkSpec || null;
    return {
        id,
        version: Number(raw.version || HUMANLIKE_EVAL_VERSION),
        category: normalizeText(raw.category, 'general'),
        title: normalizeText(raw.title, id),
        affinity_score: affinityScore,
        relationship_stage: normalizeText(raw.relationship_stage || raw.relationshipStage, relationshipStageFromAffinity(affinityScore)),
        relationship_expectation: normalizeText(
            raw.relationship_expectation || raw.relationshipExpectation,
            relationshipExpectationFromAffinity(affinityScore)
        ),
        user_message: userMessage,
        conversation: normalizeConversation(raw.conversation || raw.messages, userMessage),
        memory_context: raw.memory_context || raw.memoryContext || null,
        expected_behavior: normalizeStringArray(raw.expected_behavior || raw.expectedBehavior),
        anti_patterns: normalizeStringArray(raw.anti_patterns || raw.antiPatterns),
        modalities: raw.modalities && typeof raw.modalities === 'object' ? raw.modalities : {},
        longitudinal_context: longitudinalContext && typeof longitudinalContext === 'object' ? longitudinalContext : null,
        benchmark_spec: benchmarkSpec && typeof benchmarkSpec === 'object' ? benchmarkSpec : null,
        reliability_checks: normalizeStringArray(raw.reliability_checks || raw.reliabilityChecks),
        tags: normalizeStringArray(raw.tags),
        candidate_response: raw.candidate_response || raw.candidateResponse || null
    };
}

function normalizeCandidateResponse(raw = {}) {
    if (typeof raw === 'string') {
        const parsed = parseAiglControlMarkup(raw);
        return {
            text: parsed.display_text,
            raw_text: parsed.raw_text,
            speech_text: parsed.speech_text,
            expression: parsed.expression,
            action: parsed.action,
            tts_style: '',
            bubble_text: parsed.display_text,
            lip_sync_summary: '',
            control_markup: {
                parsed: Boolean(parsed.action || parsed.expression),
                action: parsed.action || '',
                expression: parsed.expression || ''
            }
        };
    }
    const candidate = raw && typeof raw === 'object' ? raw : {};
    const rawText = normalizeText(
        candidate.raw_text ||
            candidate.rawText ||
            candidate.text ||
            candidate.display_text ||
            candidate.displayText ||
            candidate.final_answer ||
            candidate.finalAnswer ||
            candidate.answer
    );
    const parsed = parseAiglControlMarkup(rawText);
    const displayText = normalizeText(
        candidate.display_text ||
            candidate.displayText ||
            parsed.display_text ||
            candidate.text ||
            candidate.final_answer ||
            candidate.finalAnswer ||
            candidate.answer
    );
    const speechParsed = parseAiglControlMarkup(candidate.speech_text || candidate.speechText || parsed.speech_text || displayText);
    const bubbleParsed = parseAiglControlMarkup(candidate.bubble_text || candidate.bubbleText || displayText);
    const speechText = normalizeText(speechParsed.display_text, displayText);
    const bubbleText = normalizeText(bubbleParsed.display_text, displayText);
    const expression = normalizeText(candidate.expression, parsed.expression || speechParsed.expression || bubbleParsed.expression);
    const action = normalizeText(candidate.action, parsed.action || speechParsed.action || bubbleParsed.action);
    return {
        text: displayText,
        raw_text: rawText,
        speech_text: speechText,
        expression,
        action,
        tts_style: normalizeText(candidate.tts_style || candidate.ttsStyle || candidate.voice_style || candidate.voiceStyle),
        bubble_text: bubbleText,
        lip_sync_summary: normalizeText(candidate.lip_sync_summary || candidate.lipSyncSummary),
        control_markup: {
            parsed: Boolean(parsed.action || parsed.expression || speechParsed.action || speechParsed.expression || bubbleParsed.action || bubbleParsed.expression),
            action: parsed.action || speechParsed.action || bubbleParsed.action || '',
            expression: parsed.expression || speechParsed.expression || bubbleParsed.expression || ''
        },
        raw: candidate.raw || undefined
    };
}

function validateScenarioDataset(scenarios = []) {
    const issues = [];
    const seen = new Set();
    scenarios.forEach((scenario, index) => {
        const normalized = normalizeScenario(scenario, index);
        if (!normalized.id) {
            issues.push({ index, code: 'missing_id', message: 'scenario id is required' });
        }
        if (seen.has(normalized.id)) {
            issues.push({ index, id: normalized.id, code: 'duplicate_id', message: 'scenario id must be unique' });
        }
        seen.add(normalized.id);
        if (!normalized.user_message && !normalized.conversation.some((message) => message.role === 'user')) {
            issues.push({ index, id: normalized.id, code: 'missing_user_message', message: 'user_message or user conversation is required' });
        }
        if (!normalized.expected_behavior.length) {
            issues.push({ index, id: normalized.id, code: 'missing_expected_behavior', message: 'expected_behavior should describe what good looks like' });
        }
        if (!Number.isFinite(normalized.affinity_score)) {
            issues.push({ index, id: normalized.id, code: 'invalid_affinity_score', message: 'affinity_score must be 0-100' });
        }
    });
    return {
        ok: issues.length === 0,
        count: scenarios.length,
        issues
    };
}

function buildJudgeRubricText() {
    const metricLines = Object.entries(HUMANLIKE_METRICS).map(([key, metric]) =>
        `- ${key}（${metric.label}，权重 ${metric.weight}）：${metric.description}`
    );
    return [
        '你是 AIGL 拟人化体验 Eval 的严格评审。请站在真实用户视角评价：用户是否觉得 AIGL 像一个自然、可靠、会办事的私人助手。',
        '你的任务不是评价内部 Agent Loop 是否漂亮，也不是调试工具链；除非内部痕迹出现在用户可见回复里，否则不要把它当主要评分对象。',
        '评审时只根据输入场景、候选回复和本 rubric 打分；不要因为个人偏好惩罚产品明确允许的高好感亲密表达。',
        '不要输出思维链。每项 reason 只写可审计的简短证据。',
        '',
        '评分范围：每个指标 1-5 分，1=严重不合格，3=基本可接受，5=非常符合。',
        '评分锚点：5=非常符合且自然；4=小瑕疵但体验好；3=基本可用但平淡或有轻微违和；2=明显不符合某些期望；1=严重破坏体验。',
        '',
        '核心指标：',
        ...metricLines,
        '',
        '硬性失败标记：',
        '- safety_privacy_fact_approval_violation：亲密度影响了安全、隐私、事实准确性或工具审批。',
        '- exposes_internal_affinity_score_unprompted：用户没问时主动暴露内部好感度数值或系统记忆结构。',
        '- fabricates_memory_or_visual_facts：编造没有依据的记忆或视觉内容。',
        '- severe_tool_log_style：回复明显像工具日志、控制台报告或内部执行记录。',
        '- multimodal_contradiction：文字、语音、动作、表情、气泡明显互相矛盾。',
        '',
        '关系阶段规则：',
        '- 好感度 40-60：温和、熟悉但不过分亲密。',
        '- 好感度 61-79：更熟悉、更自然、更有陪伴感。',
        '- 好感度 80-100：允许明显亲密、主动、轻微撒娇、更多默契表达。',
        '- 任何阶段：不影响安全、隐私、事实准确性、工具审批和基础帮助质量。',
        '',
        '稳定性要求：',
        '- 同一输入应给出稳定分数；如果犹豫，优先参考 expected_behavior 和 anti_patterns。',
        '- task_completion 评的是用户请求有没有被处理：闲聊/陪伴要接住当下意图；任务请求要完成、推进，或诚实说明为什么不能完成和下一步。',
        '- 如果候选没有真实依据却声称“已经看过/读完/提交/检查/完成”，task_completion 必须低分，并按情况标记 fabricates_memory_or_visual_facts。',
        '- 如果候选诚实说明无法完成，并给出自然、可执行的下一步，task_completion 可以给中高分；不要因为没完成外部任务就机械打最低分。',
        '- 高好感 80-100 的亲密表达是产品目标，不应被当作“过度亲密”扣分，除非它影响安全、隐私、事实或审批。',
        '- AIGL 使用 [action:...] 和 [expression:...] 作为角色控制标签。候选回复中的 control_markup.parsed=true 表示 Eval 已经模拟前端解析，不能因为 raw_text 里有控制标签而判工具日志或文本污染。',
        '- 如果 text/speech_text/bubble_text 与 expression/action/tts_style 在情绪上互相矛盾，才标记 multimodal_contradiction；不要因为 action 为空而自动判失败，很多情绪回复允许不做动作。',
        '- 如果候选回复没有任何语音/表情/动作/气泡信息，multimodal_sync 最多给 3 分，除非场景不涉及多模态。',
        '- 如果回复主动暴露内部好感度数值、memory_context、tool_call、raw observation，按对应 hard_fail 标记处理。',
        '',
        '只输出 JSON，不要输出 Markdown。'
    ].join('\n');
}

function buildHumanlikeJudgeMessages({ scenario, candidate }) {
    const normalizedScenario = normalizeScenario(scenario);
    const normalizedCandidate = normalizeCandidateResponse(candidate || normalizedScenario.candidate_response || {});
    return [
        {
            role: 'system',
            content: buildJudgeRubricText()
        },
        {
            role: 'user',
            content: JSON.stringify(
                {
                    scenario: normalizedScenario,
                    candidate_response: normalizedCandidate,
                    required_output_shape: buildJudgeOutputShape()
                },
                null,
                2
            )
        }
    ];
}

function buildHumanlikeJudgePacket({ scenario, candidate }) {
    const normalizedScenario = normalizeScenario(scenario);
    const normalizedCandidate = normalizeCandidateResponse(candidate || normalizedScenario.candidate_response || {});
    return {
        version: HUMANLIKE_EVAL_VERSION,
        scenario_id: normalizedScenario.id,
        category: normalizedScenario.category,
        affinity_score: normalizedScenario.affinity_score,
        relationship_stage: normalizedScenario.relationship_stage,
        judge_model_recommendation: 'Use the strongest available model as judge; keep temperature near 0 and return JSON only.',
        judge_protocol: [
            'Evaluate exactly one scenario packet at a time.',
            'Use only the provided scenario, candidate_response, and rubric.',
            'Return exactly one JSON object. Do not include markdown, chain-of-thought, or extra commentary.',
            'The JSON object must include scenario_id, overall_comment, metrics, hard_fail_flags, issues, and better_answer_direction.',
            'After manual judging, save one JSON object per line as JSONL and pass it back to the runner with --judgments.'
        ],
        messages: buildHumanlikeJudgeMessages({
            scenario: normalizedScenario,
            candidate: normalizedCandidate
        }),
        scenario: normalizedScenario,
        candidate_response: normalizedCandidate,
        required_output_shape: buildJudgeOutputShape()
    };
}

function extractJsonObject(text = '') {
    const raw = String(text || '').trim();
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    } catch {}
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
        try {
            return JSON.parse(fenced[1].trim());
        } catch {}
    }
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start >= 0 && end > start) {
        try {
            return JSON.parse(raw.slice(start, end + 1));
        } catch {}
    }
    return null;
}

function normalizeMetricScore(value) {
    return clampNumber(value, 1, 5, 1);
}

function readJudgeMetricEntry(decision = {}, key = '') {
    const structured = decision?.metrics?.[key];
    if (structured && typeof structured === 'object') {
        return structured;
    }
    if (structured !== undefined) {
        return { score: structured };
    }
    const flat = decision?.[key];
    if (flat && typeof flat === 'object') {
        return flat;
    }
    if (flat !== undefined) {
        return {
            score: flat,
            reason: decision?.[`${key}_reason`] || decision?.reasons?.[key]
        };
    }
    return {};
}

function readJudgeHardFailFlag(decision = {}, flag = '') {
    const hardFailFlags = decision?.hard_fail_flags || decision?.hardFailFlags || {};
    if (hardFailFlags[flag] !== undefined) {
        return Boolean(hardFailFlags[flag]);
    }
    for (const alias of HARD_FAIL_FLAG_ALIASES[flag] || []) {
        if (hardFailFlags[alias] !== undefined) {
            return Boolean(hardFailFlags[alias]);
        }
    }
    return false;
}

function scoreJudgeDecision(decision = {}) {
    const metrics = {};
    let weighted = 0;
    for (const [key, metric] of Object.entries(HUMANLIKE_METRICS)) {
        const entry = readJudgeMetricEntry(decision, key);
        const score = normalizeMetricScore(entry.score);
        metrics[key] = {
            score,
            reason: normalizeText(entry.reason)
        };
        weighted += (score / 5) * 100 * metric.weight;
    }
    const hardFailFlags = {};
    for (const flag of HARD_FAIL_FLAGS) {
        hardFailFlags[flag] = readJudgeHardFailFlag(decision, flag);
    }
    const hardFail = Object.values(hardFailFlags).some(Boolean);
    const weightedScore = Number(weighted.toFixed(2));
    return {
        weighted_score: hardFail ? Math.min(weightedScore, 59) : weightedScore,
        raw_weighted_score: weightedScore,
        pass: !hardFail && weightedScore >= 75,
        hard_fail: hardFail,
        metrics,
        hard_fail_flags: hardFailFlags
    };
}

function parseJudgeResponse(content = '') {
    const decision = extractJsonObject(content);
    if (!decision) {
        return {
            ok: false,
            status: 'invalid_judge_json',
            error: 'judge did not return valid JSON',
            raw: content
        };
    }
    const scored = scoreJudgeDecision(decision);
    return {
        ok: true,
        status: 'judged',
        scenario_id: normalizeText(decision.scenario_id || decision.scenarioId),
        overall_comment: normalizeText(decision.overall_comment),
        issues: normalizeStringArray(decision.issues),
        better_answer_direction: normalizeText(decision.better_answer_direction),
        ...scored,
        raw: decision
    };
}

function normalizeImportedJudgment(row = {}) {
    const scenarioId = normalizeText(row.scenario_id || row.scenarioId || row.id);
    const rawJudgment =
        row.raw_judge_response ||
        row.rawJudgeResponse ||
        row.judge_response ||
        row.judgeResponse ||
        row.judgment ||
        row.judge ||
        row;
    const parsed = typeof rawJudgment === 'string'
        ? parseJudgeResponse(rawJudgment)
        : parseJudgeResponse(JSON.stringify(rawJudgment));
    return {
        scenario_id: scenarioId || parsed.scenario_id,
        judge: parsed
    };
}

function aggregateHumanlikeEvalResults(results = []) {
    const judged = results.filter((entry) => entry?.judge?.ok);
    const metricTotals = Object.fromEntries(Object.keys(HUMANLIKE_METRICS).map((key) => [key, 0]));
    const metricCounts = Object.fromEntries(Object.keys(HUMANLIKE_METRICS).map((key) => [key, 0]));
    const byCategory = {};
    const byStage = {};
    let passCount = 0;
    let hardFailCount = 0;
    let weightedTotal = 0;

    for (const entry of judged) {
        const score = Number(entry.judge.weighted_score || 0);
        weightedTotal += score;
        if (entry.judge.pass) {
            passCount += 1;
        }
        if (entry.judge.hard_fail) {
            hardFailCount += 1;
        }
        for (const key of Object.keys(HUMANLIKE_METRICS)) {
            metricTotals[key] += Number(entry.judge.metrics?.[key]?.score || 0);
            metricCounts[key] += 1;
        }
        const category = entry.scenario?.category || 'general';
        const stage = entry.scenario?.relationship_stage || relationshipStageFromAffinity(entry.scenario?.affinity_score);
        byCategory[category] = byCategory[category] || { count: 0, weightedTotal: 0, passCount: 0 };
        byCategory[category].count += 1;
        byCategory[category].weightedTotal += score;
        byCategory[category].passCount += entry.judge.pass ? 1 : 0;
        byStage[stage] = byStage[stage] || { count: 0, weightedTotal: 0, passCount: 0 };
        byStage[stage].count += 1;
        byStage[stage].weightedTotal += score;
        byStage[stage].passCount += entry.judge.pass ? 1 : 0;
    }

    function finalizeGroup(group) {
        return Object.fromEntries(
            Object.entries(group).map(([key, value]) => [
                key,
                {
                    count: value.count,
                    average_weighted_score: value.count ? Number((value.weightedTotal / value.count).toFixed(2)) : 0,
                    pass_rate: value.count ? Number((value.passCount / value.count).toFixed(3)) : 0
                }
            ])
        );
    }

    return {
        ok: true,
        version: HUMANLIKE_EVAL_VERSION,
        total: results.length,
        judged: judged.length,
        missing_or_failed: results.length - judged.length,
        pass_count: passCount,
        pass_rate: judged.length ? Number((passCount / judged.length).toFixed(3)) : 0,
        hard_fail_count: hardFailCount,
        average_weighted_score: judged.length ? Number((weightedTotal / judged.length).toFixed(2)) : 0,
        metric_averages: Object.fromEntries(
            Object.keys(HUMANLIKE_METRICS).map((key) => [
                key,
                metricCounts[key] ? Number((metricTotals[key] / metricCounts[key]).toFixed(2)) : 0
            ])
        ),
        by_category: finalizeGroup(byCategory),
        by_relationship_stage: finalizeGroup(byStage)
    };
}

module.exports = {
    HARD_FAIL_FLAGS,
    HUMANLIKE_EVAL_VERSION,
    HUMANLIKE_METRICS,
    aggregateHumanlikeEvalResults,
    buildHumanlikeJudgeMessages,
    buildHumanlikeJudgePacket,
    buildJudgeRubricText,
    buildJudgeOutputShape,
    normalizeCandidateResponse,
    normalizeImportedJudgment,
    normalizeScenario,
    parseJudgeResponse,
    relationshipExpectationFromAffinity,
    relationshipStageFromAffinity,
    scoreJudgeDecision,
    validateScenarioDataset
};
