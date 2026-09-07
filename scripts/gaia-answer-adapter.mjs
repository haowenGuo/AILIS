// Evaluation only: never rewrites a live agent response or receives a reference
// during extraction. Keep this contract versioned separately from runtime code.
export const SCORE_CONTRACT = 'ailis.gaia.gold-blind-answer-adapter.v2';
export const GAIA_SCORER_SOURCE = 'https://huggingface.co/spaces/gaia-benchmark/leaderboard/blob/main/scorer.py';

const NUMBER = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
const ORDINALS = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
const value = (x) => typeof x === 'string' || typeof x === 'number' ? String(x) : '';

export function cleanAnswerPresentation(input) {
    let s = value(input).trim()
        .replace(/\[([^\]\n]+)\]\(https?:\/\/[^\s]+\)/g, '$1')
        .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
        .replace(/\\(?:text|mathrm|mathbf)\{([^{}]*)\}/g, ' $1 ')
        .replace(/\\(?:neg|lnot)\b/g, '¬').replace(/\\(?:to|rightarrow)\b/g, '→')
        .replace(/\\(?:leftrightarrow|iff)\b/g, '↔').replace(/\\(?:lor|vee)\b/g, '∨')
        .replace(/\\(?:land|wedge)\b/g, '∧').replace(/\\(?:left|right)\b/g, '')
        .replace(/\\([%$])/g, '$1').replace(/\\[()[\]]/g, '')
        .replace(/\*\*|__/g, '').replace(/^#+\s*/, '').replace(/\s+/g, ' ').trim();
    // Only strip boundary markup; punctuation inside lists/formulas is data.
    s = s.replace(/^[`"*]+|[`"*.。!]+$/g, '').trim();
    return s;
}

function numberValue(s, formatted = false) {
    const text = (formatted ? value(s).replace(/[$%,]/g, '') : value(s)).trim();
    return NUMBER.test(text) && Number.isFinite(Number(text)) ? Number(text) : null;
}

function gaiaString(s, punctuation = true) {
    const text = value(s).replace(/\s/g, '').toLowerCase();
    // GAIA uses Python string.punctuation (ASCII), not all Unicode symbols.
    return punctuation ? text.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, '') : text;
}

// Independent JS implementation of the public scorer's comparison rules:
// exact numbers, same-length ordered lists, whitespace/case/ASCII punctuation.
// This is local replay, not a leaderboard submission or semantic judge.
export function compareGaiaAnswer(answer, gold) {
    if (!value(answer).trim() || !value(gold).trim()) return false;
    const numericGold = numberValue(gold);
    if (numericGold !== null) return numberValue(answer, true) === numericGold;
    if (/[,;]/.test(gold)) {
        const expected = value(gold).split(/[,;]/);
        const actual = value(answer).split(/[,;]/);
        return expected.length === actual.length && expected.every((g, i) => {
            const n = numberValue(g);
            return n !== null ? numberValue(actual[i], true) === n : gaiaString(actual[i], false) === gaiaString(g, false);
        });
    }
    return gaiaString(answer) === gaiaString(gold);
}

function numericQuestion(question) {
    return /\b(?:how many|how long|number|count|volume|area|distance|percentage|percent|total sales|cost|numeric)\b|多少|数量|面积|体积/i.test(question);
}

function numericSpan(answer, question) {
    let text = cleanAnswerPresentation(answer);
    if (/\b(?:not|maybe|or|between|at least|at most|approximately)\b|[<>≤≥]/i.test(text)) return null;
    text = text.replace(/^[A-Za-z]\s*=\s*(?=[+-]?\d)/, '');
    const exact = numberValue(text, true);
    if (exact !== null) return String(exact);
    if (!numericQuestion(question)) return null;
    const ordinal = text.match(/^(zeroth|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)(?:\s+\D+)?$/i);
    if (ordinal) return String(ORDINALS.indexOf(ordinal[1].toLowerCase()));
    // A concise quantity span, not the first number anywhere in a paragraph.
    const quantity = text.match(/^[$]?([+-]?(?:\d[\d,]*(?:\.\d+)?|\.\d+))(?:%|\s+[A-Za-zÅ\u4e00-\u9fff][A-Za-zÅ\u4e00-\u9fff³²^\s-]*)$/);
    if (quantity) return String(numberValue(quantity[1], true));
    return null;
}

function canonical(answer, question) {
    return numericSpan(answer, question) ?? cleanAnswerPresentation(answer);
}

function answerClause(raw) {
    const bold = value(raw).match(/^\s*\*\*([^\n]+?)\*\*/);
    if (bold) return bold[1];
    const quote = value(raw).match(/^\s*[“"]([^”"\n]+)[”"]/);
    if (quote) return quote[1];
    return value(raw).split(/\s+[—–]\s+|[。!]|\.(?=\s|$)/)[0].trim();
}

function balancedBoxes(text) {
    const found = [];
    const re = /\\boxed\{/g;
    for (const m of text.matchAll(re)) {
        let depth = 1, end = m.index + m[0].length;
        const start = end;
        for (; end < text.length && depth; end++) {
            if (text[end] === '{') depth++;
            if (text[end] === '}') depth--;
        }
        if (depth === 0) found.push(text.slice(start, end - 1));
    }
    return found;
}

export function extractGaiaAnswer({ response = {}, question = '' } = {}) {
    const candidates = [];
    const add = (source, raw, priority) => {
        const answer = cleanAnswerPresentation(raw);
        if (!answer || !/[\p{L}\p{N}]/u.test(answer) || /^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(answer)) return;
        candidates.push({ source, answer, evidence: value(raw), priority });
    };
    const explicitFields = [
        ['exact_answer_submission', response.exactAnswerSubmission?.answer ?? response.exact_answer_submission?.answer],
        ['exact_answer', response.exactAnswer ?? response.exact_answer],
        ['task_result_exact_answer', response.taskResult?.exact_answer ?? response.task_result?.exact_answer],
        ['handoff_exact_answer', response.taskRunHandoff?.exactAnswer ?? response.task_run_handoff?.exact_answer]
    ];
    for (const [source, raw] of explicitFields) {
        if (value(raw).trim()) { add(source, raw, 100); break; }
    }
    const text = value(response.displayText || response.display_text || response.message || response.speechText || response.finalAnswer || response.final_answer || response.answer)
        .replace(/\[(?:expression|action|tts|bubble|style|emotion|gesture)[^\]\n]*\]/gi, '');
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    for (const line of lines) {
        const label = line.match(/(?:\b(?:final\s+(?:answer|result)|(?:the\s+)?(?:requested\s+)?answer|conclusion)\b|最终(?:答案|结果|结论)|答案|结论)\s*(?:\*\*)?\s*(?:is\b|[:：=]|为|是)\s*(.+)/i);
        if (label) add('visible_answer_line', answerClause(label[1]), 90);
        const total = line.replace(/\*\*/g, '').match(/^\s*(?:total(?:\s+count)?|总数|总计|合计)\s*[:：=]\s*(.+)/i);
        if (total && numericQuestion(question)) add('visible_count_total', answerClause(total[1]), 80);
        const rounded = line.match(/(?:rounded|rounding|四舍五入|取整)[^:\n：]{0,120}[:：]\s*(.+)/i);
        if (rounded) add('visible_scaled_result', answerClause(rounded[1]), 80);
    }
    for (const box of balancedBoxes(text)) add('visible_boxed_answer', box, 85);
    const blocks = [...text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)];
    for (const block of blocks) {
        if (!/[\n\r]/.test(block[1].trim()) && /(?:output|answer|result|输出|答案)[^.!。]*[:：]\s*$/i.test(text.slice(0, block.index))) {
            add('visible_output_block', block[1], 85);
        }
    }
    const startMath = text.trim().match(/^\\\[([\s\S]*?)\\\]/);
    if (startMath) add('visible_leading_math', startMath[1], 70);
    const firstLine = lines[0] || '';
    const yesNo = firstLine.match(/^\s*(?:\*\*)?(yes|no)\b/i);
    if (yesNo) add('visible_leading_boolean', yesNo[1], 70);
    const firstClause = firstLine.split(/—|\.(?=\s|$)/)[0];
    const highlights = [...firstClause.matchAll(/\*\*([^\n]+?)\*\*/g)];
    if (highlights.length === 1 && !/\b(?:not|rather than)\b/i.test(firstClause.slice(0, highlights[0].index))) {
        add('visible_leading_highlight', highlights[0][1], 60);
    }
    // One emphasized span anywhere is unambiguous only for a short response;
    // code/quoted examples and multiple highlights do not become alternatives.
    const allHighlights = [...text.matchAll(/\*\*([^\n]+?)\*\*/g)];
    if (allHighlights.length === 1 && lines.length <= 8 && !blocks.length && !/\b(?:not|maybe|perhaps|for example)\b/i.test(text)) {
        add('visible_single_highlight', allHighlights[0][1], 50);
    }
    const simple = (s) => s && s.length <= 2048 && s.trim().split(/\s+/).length <= 24 && !/^\s*(?:[-*]\s|\d+[.)]\s)|[:：]\s*$/.test(s) && !/^(?:source|explanation|reasoning|note|according to|by the end)\b/i.test(s) && !/[\n\r|{}=]|https?:|\\|```/.test(s) && !/\b(?:is|are|was|were|has|have|had|did|does|says|replies|appears|reported|uses|face|would|could|should|because)\b/i.test(s);
    const last = lines.at(-1) || '';
    if (simple(last) && last.trim() !== firstLine.trim()) add('visible_final_standalone', last, 65);
    if (simple(firstLine)) add('visible_leading_standalone', firstLine, 55);
    // A tight declarative form, unlike the old arbitrary "best" substring regex.
    for (const line of [firstLine, last]) {
        const clean = cleanAnswerPresentation(answerClause(line));
        const declaration = clean.match(/^(?:the\s+(?:\w+\s+){0,4}(?:word|name|surname|sentence|phrase|location|bird|writer|answer)|it)\s+(?:is|was|says|featured is)\s*:?\s*(.+)$/i);
        if (declaration) add('visible_declaration', answerClause(declaration[1]).replace(/^a\s+/i, ''), 55);
        const contextual = clean.match(/(?:ball|球)\s*#\s*([A-Za-z0-9]+)\s*(?:的弹出概率最高|has the highest probability)/i);
        if (contextual) add('visible_contextual_answer', contextual[1], 70);
    }
    for (const line of lines) {
        if (/^\s*(?:therefore|thus|so)\b/i.test(line)) {
            const spans = [...line.matchAll(/\*\*([^\n]+?)\*\*/g)];
            if (spans.length === 1) add('visible_conclusion_highlight', spans[0][1], 75);
        }
    }
    if (numericQuestion(question)) {
        const countStart = firstLine.match(/^\s*(\d+)\s+[A-Za-z]/);
        if (countStart) add('visible_leading_count', countStart[1], 60);
    }
    candidates.sort((a, b) => b.priority - a.priority);
    const best = candidates[0];
    const chosen = best ? candidates.filter(c => best.priority === 100 ? c.priority === 100 : best.priority >= 80 ? c.priority >= 80 : c.priority === best.priority) : [];
    const keys = new Set(chosen.map(c => canonical(c.answer, question).toLowerCase()));
    const ambiguous = keys.size > 1 || (best?.answer.length > 2048);
    return {
        answer: best?.answer || '', source: best?.source || '', evidence: best?.evidence || '', candidates,
        needsManualReview: !best || ambiguous,
        reason: !best ? 'no_unambiguous_answer_span' : ambiguous ? 'conflicting_or_oversized_answer_spans' : 'selected_without_reference'
    };
}

export function scoreVisibleAnswer({ response = {}, gold = '', question = '' } = {}) {
    const extraction = extractGaiaAnswer({ response, question });
    let submittedAnswer = canonical(extraction.answer, question);
    const transformations = [];
    if (submittedAnswer !== extraction.answer) transformations.push('presentation_or_explicit_quantity');
    // Legacy question-unit adaptation is explicit and applied before seeing gold.
    const scale = question.match(/\bhow many\s+(thousand|million|billion)\s+(hours?|days?|people|residents|dollars?|euros?)\b/i);
    if (scale && (extraction.source === 'visible_scaled_result' || new RegExp(`\\b${scale[2]}\\b`, 'i').test(extraction.answer))) {
        const n = numberValue(submittedAnswer, true);
        if (n !== null && !new RegExp(`\\b${scale[1]}\\b`, 'i').test(extraction.answer)) {
            submittedAnswer = String(n / ({ thousand: 1e3, million: 1e6, billion: 1e9 }[scale[1].toLowerCase()]));
            transformations.push('question_requested_scale');
        }
    }
    const incomplete = response.ok === false || /^(?:running|pending|queued|blocked|in_progress|failed|error|timeout)$/i.test(response.status || '');
    let ok = !incomplete && !extraction.needsManualReview && compareGaiaAnswer(submittedAnswer, cleanAnswerPresentation(gold));
    // Named-place abbreviation is a documented local adapter, not GAIA exact.
    const officialStyleMatch = ok;
    if (!ok && !incomplete && !extraction.needsManualReview && /\bcity\b/i.test(question)) {
        const saint = s => s.replace(/\bst\.?\s/gi, 'Saint ');
        ok = compareGaiaAnswer(saint(submittedAnswer), saint(cleanAnswerPresentation(gold)));
        if (ok) transformations.push('city_saint_abbreviation');
    }
    // A mismatch from a prose heuristic is not proof of an incorrect answer.
    const needsManualReview = incomplete || extraction.needsManualReview || (!ok && !['exact_answer_submission', 'exact_answer', 'task_result_exact_answer', 'handoff_exact_answer'].includes(extraction.source));
    return {
        ...extraction, ok, contract: SCORE_CONTRACT, submittedAnswer, transformations, officialStyleMatch,
        needsManualReview,
        status: ok ? 'visible_answer_match' : needsManualReview ? 'answer_extraction_review' : 'answer_candidate_mismatch'
    };
}
