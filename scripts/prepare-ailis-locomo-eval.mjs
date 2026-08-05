import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DEFAULT_SOURCE = path.join(
    ROOT,
    'build-cache',
    'benchmarks',
    'locomo',
    'data',
    'locomo10.json'
);
const DEFAULT_SELECTION = path.join(ROOT, 'evals', 'core-smoke', 'locomo-2x20qa.json');
const DEFAULT_OUTPUT = path.join(ROOT, 'evals', 'locomo', 'locomo-2x20qa.longmemeval.json');
const DEFAULT_GOLD = path.join(ROOT, 'evals', 'locomo', 'locomo-2x20qa.gold.json');
const FULL_OUTPUT = path.join(ROOT, 'evals', 'locomo', 'locomo-full.longmemeval.json');
const FULL_GOLD = path.join(ROOT, 'evals', 'locomo', 'locomo-full.gold.json');

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        source: DEFAULT_SOURCE,
        selection: DEFAULT_SELECTION,
        output: DEFAULT_OUTPUT,
        gold: DEFAULT_GOLD,
        full: false,
        outputExplicit: false,
        goldExplicit: false
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => path.resolve(argv[++index] || '');
        if (token === '--source') args.source = next();
        else if (token === '--selection') args.selection = next();
        else if (token === '--output') {
            args.output = next();
            args.outputExplicit = true;
        }
        else if (token === '--gold') {
            args.gold = next();
            args.goldExplicit = true;
        }
        else if (token === '--full') args.full = true;
        else throw new Error(`Unknown argument: ${token}`);
    }
    if (args.full) {
        if (!args.outputExplicit) args.output = FULL_OUTPUT;
        if (!args.goldExplicit) args.gold = FULL_GOLD;
    }
    return args;
}

function toLongMemDate(value) {
    const parsed = parseLocomoDate(value).getTime();
    if (!Number.isFinite(parsed)) {
        throw new Error(`Unsupported LoCoMo date: ${value}`);
    }
    const date = new Date(parsed);
    return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()} ` +
        `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
}

function parseLocomoDate(value) {
    const text = String(value || '').trim();
    const match = text.match(
        /^(\d{1,2}):(\d{2})\s*(am|pm)\s+on\s+(\d{1,2})\s+([A-Za-z]+),\s*(\d{4})$/i
    );
    if (!match) throw new Error(`Unsupported LoCoMo date: ${value}`);
    const [, rawHour, minute, meridiem, day, monthName, year] = match;
    const month = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ].indexOf(monthName.toLowerCase());
    if (month < 0) throw new Error(`Unsupported LoCoMo month: ${monthName}`);
    let hour = Number(rawHour) % 12;
    if (meridiem.toLowerCase() === 'pm') hour += 12;
    return new Date(Date.UTC(Number(year), month, Number(day), hour, Number(minute)));
}

function sessionNumberFromEvidence(value) {
    const match = String(value || '').match(/^D(\d+):\d+$/i);
    return match ? Number(match[1]) : null;
}

function latestSessionDate(conversation) {
    const dates = Object.entries(conversation)
        .filter(([key]) => /^session_\d+_date_time$/.test(key))
        .map(([, value]) => parseLocomoDate(value).getTime())
        .filter(Number.isFinite);
    return new Date(Math.max(...dates) + 24 * 60 * 60 * 1000);
}

function categoryName(category) {
    return ({
        1: 'multi_hop',
        2: 'temporal',
        3: 'open_domain',
        4: 'single_hop',
        5: 'adversarial'
    })[Number(category)] || `category_${category}`;
}

function buildOfficialQa(sample, qa, index) {
    const category = Number(qa.category);
    const originalQuestion = String(qa.question || '');
    const selectedQa = {
        smokeId: `locomo-${sample.sample_id}-qa-${String(index + 1).padStart(4, '0')}`,
        category,
        question: originalQuestion,
        answer: qa.answer,
        evidence: Array.isArray(qa.evidence) ? qa.evidence : [],
        originalQuestion
    };
    if (category === 2) {
        selectedQa.question = `${originalQuestion} Use DATE of CONVERSATION to answer with an approximate date.`;
    }
    if (category === 5) {
        const adversarialAnswer = String(qa.adversarial_answer || qa.answer || '').trim();
        const notMentioned = 'Not mentioned in the conversation';
        const notMentionedFirst = index % 2 === 0;
        const options = notMentionedFirst
            ? [notMentioned, adversarialAnswer]
            : [adversarialAnswer, notMentioned];
        selectedQa.question = `${originalQuestion} Select the correct answer: ` +
            `(a) ${options[0]} (b) ${options[1]}.`;
        selectedQa.answer = notMentioned;
        selectedQa.adversarialAnswer = adversarialAnswer;
        selectedQa.correctOption = notMentionedFirst ? 'a' : 'b';
    }
    return selectedQa;
}

function buildEntry(sample, selectedQa) {
    const conversation = sample.conversation || {};
    const speakerA = String(conversation.speaker_a || 'speaker_a');
    const evidenceIds = new Set((selectedQa.evidence || []).map(String));
    const evidenceSessions = new Set(
        [...evidenceIds].map(sessionNumberFromEvidence).filter(Number.isFinite)
    );
    const sessionNumbers = Object.keys(conversation)
        .map((key) => key.match(/^session_(\d+)$/))
        .filter(Boolean)
        .map((match) => Number(match[1]))
        .sort((left, right) => left - right);
    const haystackSessions = [];
    const haystackDates = [];
    const haystackSessionIds = [];
    for (const sessionNumber of sessionNumbers) {
        const turns = conversation[`session_${sessionNumber}`];
        const date = conversation[`session_${sessionNumber}_date_time`];
        if (!Array.isArray(turns) || !turns.length || !date) continue;
        haystackSessions.push(turns.map((turn) => ({
            role: String(turn.speaker || '') === speakerA ? 'user' : 'assistant',
            content: String(turn.text || ''),
            has_answer: evidenceIds.has(String(turn.dia_id || '')),
            locomo_dia_id: String(turn.dia_id || '')
        })));
        haystackDates.push(toLongMemDate(date));
        haystackSessionIds.push(`D${sessionNumber}`);
    }
    const questionDate = latestSessionDate(conversation);
    const evidenceSessionIds = [...evidenceSessions].map((number) => `D${number}`);
    return {
        question_id: selectedQa.smokeId,
        question_type: categoryName(selectedQa.category),
        question: selectedQa.question,
        question_date: `${questionDate.getUTCFullYear()}/${questionDate.getUTCMonth() + 1}/${questionDate.getUTCDate()} 12:00`,
        haystack_sessions: haystackSessions,
        haystack_dates: haystackDates,
        haystack_session_ids: haystackSessionIds,
        answer_session_ids: evidenceSessionIds,
        answer: selectedQa.answer,
        locomo: {
            sample_id: sample.sample_id,
            category: selectedQa.category,
            evidence: [...evidenceIds],
            original_question: selectedQa.originalQuestion || selectedQa.question,
            adversarial_answer: selectedQa.adversarialAnswer || '',
            correct_option: selectedQa.correctOption || ''
        }
    };
}

async function main() {
    const args = parseArgs();
    const source = JSON.parse(await fs.readFile(args.source, 'utf8'));
    const selection = args.full
        ? {
            samples: source.map((sample) => ({
                sampleId: sample.sample_id,
                selectedQa: (sample.qa || []).map((qa, index) =>
                    buildOfficialQa(sample, qa, index))
            }))
        }
        : JSON.parse(await fs.readFile(args.selection, 'utf8'));
    const byId = new Map(source.map((sample) => [String(sample.sample_id), sample]));
    const entries = [];
    const gold = {};
    for (const selectedSample of selection.samples || []) {
        const sample = byId.get(String(selectedSample.sampleId));
        if (!sample) throw new Error(`LoCoMo sample not found: ${selectedSample.sampleId}`);
        for (const selectedQa of selectedSample.selectedQa || []) {
            const entry = buildEntry(sample, selectedQa);
            entries.push(entry);
            gold[entry.question_id] = {
                answer: selectedQa.answer,
                question: selectedQa.question,
                question_type: entry.question_type,
                sample_id: sample.sample_id,
                evidence: selectedQa.evidence || [],
                category: selectedQa.category,
                original_question: selectedQa.originalQuestion || selectedQa.question,
                adversarial_answer: selectedQa.adversarialAnswer || '',
                correct_option: selectedQa.correctOption || ''
            };
        }
    }
    await fs.mkdir(path.dirname(args.output), { recursive: true });
    await fs.mkdir(path.dirname(args.gold), { recursive: true });
    await fs.writeFile(args.output, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
    await fs.writeFile(args.gold, `${JSON.stringify(gold, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({
        ok: true,
        source: args.source,
        output: args.output,
        gold: args.gold,
        mode: args.full ? 'full' : 'selection',
        samples: new Set(entries.map((entry) => entry.locomo.sample_id)).size,
        questions: entries.length,
        sessions: entries.reduce((sum, entry) => sum + entry.haystack_sessions.length, 0)
    }, null, 2));
}

await main();
