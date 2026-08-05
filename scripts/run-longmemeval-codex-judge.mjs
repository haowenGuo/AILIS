import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { callCodexModelBridge } = require('../electron/codex-model-bridge.cjs');

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_SOURCE_RUN_ID =
    'self-runtime-full500-parallel10-codex-gpt55-20260729-v1';
const DEFAULT_JUDGE_RUN_ID =
    'codex-judge-gpt55-medium-20260730-v1';
const DEFAULT_DATASET_PATH = path.join(
    REPO_ROOT,
    '.local',
    'benchmarks',
    'LongMemEval',
    'data',
    'longmemeval_s_cleaned.json'
);
const OFFICIAL_EVALUATOR_PATH = path.join(
    REPO_ROOT,
    '.local',
    'benchmarks',
    'LongMemEval',
    'official_source',
    'LongMemEval',
    'src',
    'evaluation',
    'evaluate_qa.py'
);

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const normalized = value.trim();
    return normalized || fallback;
}

function parseArgs(argv) {
    const args = {
        sourceRunId: DEFAULT_SOURCE_RUN_ID,
        judgeRunId: DEFAULT_JUDGE_RUN_ID,
        datasetPath: DEFAULT_DATASET_PATH,
        model: 'gpt-5.5',
        reasoningEffort: 'medium',
        workers: 10,
        timeoutMs: 180000,
        maxAttempts: 3,
        limit: null,
        questionIds: [],
        force: false
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = argv[index + 1];
        if (token === '--source-run-id' && next) {
            args.sourceRunId = next;
            index += 1;
        } else if (token === '--judge-run-id' && next) {
            args.judgeRunId = next;
            index += 1;
        } else if (token === '--dataset-path' && next) {
            args.datasetPath = path.resolve(next);
            index += 1;
        } else if (token === '--model' && next) {
            args.model = next;
            index += 1;
        } else if (token === '--reasoning-effort' && next) {
            args.reasoningEffort = next;
            index += 1;
        } else if (token === '--workers' && next) {
            args.workers = Math.max(1, Math.trunc(Number(next) || 1));
            index += 1;
        } else if (token === '--timeout-ms' && next) {
            args.timeoutMs = Math.max(5000, Math.trunc(Number(next) || 180000));
            index += 1;
        } else if (token === '--max-attempts' && next) {
            args.maxAttempts = Math.max(1, Math.trunc(Number(next) || 3));
            index += 1;
        } else if (token === '--limit' && next) {
            args.limit = Math.max(1, Math.trunc(Number(next) || 1));
            index += 1;
        } else if (token === '--question-ids' && next) {
            args.questionIds = next
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean);
            index += 1;
        } else if (token === '--force') {
            args.force = true;
        } else if (token === '--help' || token === '-h') {
            args.help = true;
        } else {
            throw new Error(`Unknown argument: ${token}`);
        }
    }
    return args;
}

function printHelp() {
    console.log(`Usage:
  node scripts/run-longmemeval-codex-judge.mjs [options]

Options:
  --source-run-id <id>       Existing AILIS LongMemEval generation run
  --judge-run-id <id>        Output directory name for this judge run
  --dataset-path <path>      LongMemEval reference dataset
  --model <model>            Codex judge model (default: gpt-5.5)
  --reasoning-effort <level> Codex reasoning effort (default: medium)
  --workers <n>              Concurrent isolated judge processes (default: 10)
  --timeout-ms <n>           Per-attempt timeout (default: 180000)
  --max-attempts <n>         Per-item attempts for invalid/failed output (default: 3)
  --limit <n>                Judge only the first n selected items
  --question-ids <csv>       Judge only the listed question IDs
  --force                    Replace an existing judge output directory
`);
}

function sha256(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

async function readJsonOrJsonl(filePath) {
    const raw = await fsPromises.readFile(filePath, 'utf8');
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
        return raw
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => JSON.parse(line));
    }
}

function buildOfficialAnscheckPrompt(task, question, answer, response, abstention = false) {
    // These strings are copied verbatim from LongMemEval's official
    // src/evaluation/evaluate_qa.py. Do not paraphrase them.
    if (abstention) {
        return `I will give you an unanswerable question, an explanation, and a response from a model. Please answer yes if the model correctly identifies the question as unanswerable. The model could say that the information is incomplete, or some other information is given but the asked information is not.\n\nQuestion: ${question}\n\nExplanation: ${answer}\n\nModel Response: ${response}\n\nDoes the model correctly identify the question as unanswerable? Answer yes or no only.`;
    }
    if (['single-session-user', 'single-session-assistant', 'multi-session'].includes(task)) {
        return `I will give you a question, a correct answer, and a response from a model. Please answer yes if the response contains the correct answer. Otherwise, answer no. If the response is equivalent to the correct answer or contains all the intermediate steps to get the correct answer, you should also answer yes. If the response only contains a subset of the information required by the answer, answer no. \n\nQuestion: ${question}\n\nCorrect Answer: ${answer}\n\nModel Response: ${response}\n\nIs the model response correct? Answer yes or no only.`;
    }
    if (task === 'temporal-reasoning') {
        return `I will give you a question, a correct answer, and a response from a model. Please answer yes if the response contains the correct answer. Otherwise, answer no. If the response is equivalent to the correct answer or contains all the intermediate steps to get the correct answer, you should also answer yes. If the response only contains a subset of the information required by the answer, answer no. In addition, do not penalize off-by-one errors for the number of days. If the question asks for the number of days/weeks/months, etc., and the model makes off-by-one errors (e.g., predicting 19 days when the answer is 18), the model's response is still correct. \n\nQuestion: ${question}\n\nCorrect Answer: ${answer}\n\nModel Response: ${response}\n\nIs the model response correct? Answer yes or no only.`;
    }
    if (task === 'knowledge-update') {
        return `I will give you a question, a correct answer, and a response from a model. Please answer yes if the response contains the correct answer. Otherwise, answer no. If the response contains some previous information along with an updated answer, the response should be considered as correct as long as the updated answer is the required answer.\n\nQuestion: ${question}\n\nCorrect Answer: ${answer}\n\nModel Response: ${response}\n\nIs the model response correct? Answer yes or no only.`;
    }
    if (task === 'single-session-preference') {
        return `I will give you a question, a rubric for desired personalized response, and a response from a model. Please answer yes if the response satisfies the desired response. Otherwise, answer no. The model does not need to reflect all the points in the rubric. The response is correct as long as it recalls and utilizes the user's personal information correctly.\n\nQuestion: ${question}\n\nRubric: ${answer}\n\nModel Response: ${response}\n\nIs the model response correct? Answer yes or no only.`;
    }
    throw new Error(`Unsupported LongMemEval question type: ${task}`);
}

function parseYesNo(content) {
    const normalized = normalizeText(content).toLowerCase().replace(/[.!]/g, '');
    if (normalized === 'yes') {
        return true;
    }
    if (normalized === 'no') {
        return false;
    }
    return null;
}

function summarize(judgments, expected, metadata) {
    const completed = judgments.filter((entry) => entry.status === 'completed');
    const failed = judgments.filter((entry) => entry.status === 'failed');
    const byQuestionType = {};
    let correct = 0;
    let inputTokens = 0;
    let outputTokens = 0;
    let reasoningTokens = 0;
    for (const entry of completed) {
        const type = entry.question_type;
        if (!byQuestionType[type]) {
            byQuestionType[type] = { total: 0, correct: 0, accuracy: null };
        }
        byQuestionType[type].total += 1;
        byQuestionType[type].correct += entry.autoeval_label.label ? 1 : 0;
        correct += entry.autoeval_label.label ? 1 : 0;
        inputTokens += Number(entry.usage?.prompt_tokens) || 0;
        outputTokens += Number(entry.usage?.completion_tokens) || 0;
        reasoningTokens +=
            Number(entry.usage?.completion_tokens_details?.reasoning_tokens) || 0;
    }
    for (const stats of Object.values(byQuestionType)) {
        stats.accuracy = stats.total ? stats.correct / stats.total : null;
    }
    return {
        benchmark: 'LongMemEval',
        evaluator: 'Codex Judge using verbatim official LongMemEval QA prompts',
        leaderboardComparable: false,
        leaderboardComparableReason:
            'The official prompt and binary aggregation are preserved, but the judge model is Codex rather than gpt-4o-2024-08-06.',
        ...metadata,
        expected,
        completed: completed.length,
        failed: failed.length,
        correct,
        accuracy: completed.length ? correct / completed.length : null,
        completionRate: expected ? completed.length / expected : null,
        byQuestionType,
        usage: {
            inputTokens,
            outputTokens,
            reasoningTokens,
            totalTokens: inputTokens + outputTokens
        },
        failedQuestionIds: failed.map((entry) => entry.question_id),
        updatedAt: new Date().toISOString()
    };
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
        printHelp();
        return;
    }
    const sourceRunDir = path.join(
        REPO_ROOT,
        'eval-results',
        'longmemeval-ailis',
        args.sourceRunId
    );
    const hypothesisPath = path.join(sourceRunDir, 'hypotheses.jsonl');
    const outputDir = path.join(sourceRunDir, args.judgeRunId);
    const resultPath = path.join(outputDir, 'judgments.jsonl');
    const statusPath = path.join(outputDir, 'status.json');
    const summaryPath = path.join(outputDir, 'summary.json');
    const manifestPath = path.join(outputDir, 'manifest.json');

    for (const requiredPath of [
        hypothesisPath,
        args.datasetPath,
        OFFICIAL_EVALUATOR_PATH
    ]) {
        if (!fs.existsSync(requiredPath)) {
            throw new Error(`Required input does not exist: ${requiredPath}`);
        }
    }
    if (args.force && fs.existsSync(outputDir)) {
        await fsPromises.rm(outputDir, { recursive: true, force: true });
    }
    await fsPromises.mkdir(outputDir, { recursive: true });

    const [hypotheses, references, officialEvaluatorSource] = await Promise.all([
        readJsonOrJsonl(hypothesisPath),
        readJsonOrJsonl(args.datasetPath),
        fsPromises.readFile(OFFICIAL_EVALUATOR_PATH, 'utf8')
    ]);
    const referenceById = new Map(
        references.map((entry) => [entry.question_id, entry])
    );
    const selectedIds = new Set(args.questionIds);
    let selected = hypotheses.filter(
        (entry) => !selectedIds.size || selectedIds.has(entry.question_id)
    );
    if (args.limit !== null) {
        selected = selected.slice(0, args.limit);
    }
    for (const entry of selected) {
        if (!referenceById.has(entry.question_id)) {
            throw new Error(`Missing reference for ${entry.question_id}`);
        }
    }

    const existing = fs.existsSync(resultPath)
        ? await readJsonOrJsonl(resultPath)
        : [];
    const completedById = new Map(
        existing
            .filter((entry) => entry.status === 'completed')
            .map((entry) => [entry.question_id, entry])
    );
    const pending = selected.filter((entry) => !completedById.has(entry.question_id));
    const metadata = {
        sourceRunId: args.sourceRunId,
        judgeRunId: args.judgeRunId,
        model: args.model,
        reasoningEffort: args.reasoningEffort,
        workers: args.workers,
        timeoutMs: args.timeoutMs,
        maxAttempts: args.maxAttempts,
        hypothesisPath,
        datasetPath: args.datasetPath,
        officialEvaluatorPath: OFFICIAL_EVALUATOR_PATH,
        officialEvaluatorSha256: sha256(officialEvaluatorSource),
        abstentionRule: "question_id contains '_abs'",
        labelRule:
            'Strictly parse an exact yes/no Codex response; yes=true and no=false.',
        startedAt: new Date().toISOString()
    };
    await fsPromises.writeFile(
        manifestPath,
        `${JSON.stringify(metadata, null, 2)}\n`,
        'utf8'
    );

    let nextIndex = 0;
    let finishedThisRun = 0;
    let appendQueue = Promise.resolve();
    const currentById = new Map(completedById);
    const persist = (record) => {
        appendQueue = appendQueue.then(async () => {
            await fsPromises.appendFile(resultPath, `${JSON.stringify(record)}\n`, 'utf8');
            currentById.set(record.question_id, record);
            finishedThisRun += 1;
            const allCurrent = selected
                .map((entry) => currentById.get(entry.question_id))
                .filter(Boolean);
            const status = summarize(allCurrent, selected.length, metadata);
            await Promise.all([
                fsPromises.writeFile(
                    statusPath,
                    `${JSON.stringify(status, null, 2)}\n`,
                    'utf8'
                ),
                finishedThisRun % 10 === 0 || allCurrent.length === selected.length
                    ? fsPromises.writeFile(
                          summaryPath,
                          `${JSON.stringify(status, null, 2)}\n`,
                          'utf8'
                      )
                    : Promise.resolve()
            ]);
            console.log(
                `[${allCurrent.length}/${selected.length}] ` +
                    `${record.question_id} ${record.status}` +
                    (record.status === 'completed'
                        ? ` label=${record.autoeval_label.label ? 'yes' : 'no'}`
                        : ` error=${record.error}`)
            );
        });
        return appendQueue;
    };

    async function judgeOne(hypothesisEntry) {
        const reference = referenceById.get(hypothesisEntry.question_id);
        const prompt = buildOfficialAnscheckPrompt(
            reference.question_type,
            reference.question,
            reference.answer,
            hypothesisEntry.hypothesis,
            hypothesisEntry.question_id.includes('_abs')
        );
        let finalFailure = null;
        for (let attempt = 1; attempt <= args.maxAttempts; attempt += 1) {
            const result = await callCodexModelBridge(
                {
                    model: args.model,
                    reasoningEffort: args.reasoningEffort,
                    timeoutMs: args.timeoutMs
                },
                { tools: [], toolChoice: 'none' },
                [{ role: 'user', content: prompt }]
            );
            if (!result?.ok) {
                finalFailure = {
                    code: result?.code || 'judge_failed',
                    error: result?.error || 'Codex judge failed without an error message.'
                };
                continue;
            }
            const label = parseYesNo(result.content);
            if (label === null) {
                finalFailure = {
                    code: 'invalid_yes_no',
                    error: `Expected exact yes/no, received: ${normalizeText(result.content).slice(0, 200)}`
                };
                continue;
            }
            return {
                question_id: hypothesisEntry.question_id,
                question_type: reference.question_type,
                hypothesis: hypothesisEntry.hypothesis,
                status: 'completed',
                autoeval_label: {
                    model: args.model,
                    label
                },
                judge_response: normalizeText(result.content),
                judge_prompt_sha256: sha256(prompt),
                attempt,
                usage: result.usage || null,
                provider_message: result.providerMessage || null,
                judgedAt: new Date().toISOString()
            };
        }
        return {
            question_id: hypothesisEntry.question_id,
            question_type: reference.question_type,
            hypothesis: hypothesisEntry.hypothesis,
            status: 'failed',
            error_code: finalFailure?.code || 'judge_failed',
            error: finalFailure?.error || 'Codex judge failed.',
            judgedAt: new Date().toISOString()
        };
    }

    async function worker(workerIndex) {
        while (true) {
            const itemIndex = nextIndex;
            nextIndex += 1;
            if (itemIndex >= pending.length) {
                return;
            }
            const item = pending[itemIndex];
            const record = await judgeOne(item);
            record.worker = workerIndex + 1;
            await persist(record);
        }
    }

    console.log(
        `Judging ${pending.length} pending of ${selected.length} selected questions ` +
            `with ${args.workers} workers, model=${args.model}, effort=${args.reasoningEffort}.`
    );
    await Promise.all(
        Array.from(
            { length: Math.min(args.workers, Math.max(1, pending.length)) },
            (_, index) => worker(index)
        )
    );
    await appendQueue;

    const allCurrent = selected
        .map((entry) => currentById.get(entry.question_id))
        .filter(Boolean);
    const finalSummary = summarize(allCurrent, selected.length, metadata);
    await Promise.all([
        fsPromises.writeFile(
            statusPath,
            `${JSON.stringify(finalSummary, null, 2)}\n`,
            'utf8'
        ),
        fsPromises.writeFile(
            summaryPath,
            `${JSON.stringify(finalSummary, null, 2)}\n`,
            'utf8'
        )
    ]);
    console.log(JSON.stringify(finalSummary, null, 2));
    if (finalSummary.failed > 0 || finalSummary.completed !== selected.length) {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
