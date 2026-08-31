import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { callDesktopLlmProvider } = require('../electron/desktop-llm-provider.cjs');
const { callVisionModel } = require('../electron/ailis-vision-model-router.cjs');

const DEFAULT_SOURCE_RUN = path.join(
    'eval-results',
    'engineering',
    'osworld-full-verified-a7-luna-medium-20260813',
    'verified'
);

const DOMAIN_APPLICATIONS = Object.freeze({
    chrome: 'Google Chrome',
    gimp: 'GIMP image editor',
    libreoffice_calc: 'LibreOffice Calc spreadsheet',
    libreoffice_impress: 'LibreOffice Impress presentation editor',
    libreoffice_writer: 'LibreOffice Writer document editor',
    multi_apps: 'Multiple desktop applications',
    os: 'Desktop or file manager',
    thunderbird: 'Mozilla Thunderbird email client',
    vlc: 'VLC media player',
    vs_code: 'Visual Studio Code'
});

function parseArgs(argv) {
    const options = {
        sourceRun: DEFAULT_SOURCE_RUN,
        outputDir: '',
        statePath: path.join(process.env.APPDATA || '', 'AILIS', 'desktop-state.json'),
        limit: 20,
        samplesPerDomain: 2,
        concurrency: 2,
        onlyId: '',
        maxAttempts: 2,
        visionModel: process.env.AILIS_CODEX_MODEL || 'gpt-5.6-luna',
        visionReasoningEffort: process.env.AILIS_CODEX_REASONING_EFFORT || 'low',
        useConfiguredVision: false,
        judge: true
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        const next = () => argv[++index];
        if (arg === '--source-run') options.sourceRun = next();
        else if (arg === '--output-dir') options.outputDir = next();
        else if (arg === '--state-path') options.statePath = next();
        else if (arg === '--limit') options.limit = Number(next());
        else if (arg === '--samples-per-domain') options.samplesPerDomain = Number(next());
        else if (arg === '--concurrency') options.concurrency = Number(next());
        else if (arg === '--only-id') options.onlyId = next();
        else if (arg === '--max-attempts') options.maxAttempts = Number(next());
        else if (arg === '--vision-model') options.visionModel = next();
        else if (arg === '--vision-reasoning-effort') options.visionReasoningEffort = next();
        else if (arg === '--use-configured-vision') options.useConfiguredVision = true;
        else if (arg === '--no-judge') options.judge = false;
        else if (arg === '--help') options.help = true;
        else throw new Error(`Unknown argument: ${arg}`);
    }
    options.limit = Math.max(1, Math.round(options.limit || 20));
    options.samplesPerDomain = Math.max(1, Math.round(options.samplesPerDomain || 2));
    options.concurrency = Math.max(1, Math.min(4, Math.round(options.concurrency || 2)));
    options.maxAttempts = Math.max(1, Math.min(2, Math.round(options.maxAttempts || 2)));
    return options;
}

function printHelp() {
    console.log(`AILIS simple screen-understanding evaluation

Usage:
  node scripts/run-ailis-screen-understanding-eval.mjs [options]

Options:
  --limit N                    Number of screenshots (default: 20)
  --samples-per-domain N       Maximum samples from each desktop application
  --concurrency N              Concurrent visual requests, 1-4 (default: 2)
  --only-id ID                 Run one sample from the generated manifest
  --max-attempts N             Infrastructure attempts, 1-2 (default: 2)
  --source-run PATH            Existing OSWorld result's verified directory
  --output-dir PATH            Result directory
  --use-configured-vision      Use AILIS desktop's saved visual model
  --vision-model MODEL         Codex bridge visual model for evaluation
  --no-judge                   Skip DeepSeek semantic judging
`);
}

function safeJsonParse(text) {
    const raw = String(text || '').trim();
    const unfenced = raw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
    try {
        return JSON.parse(unfenced);
    } catch {
        const start = unfenced.indexOf('{');
        const end = unfenced.lastIndexOf('}');
        if (start >= 0 && end > start) {
            try {
                return JSON.parse(unfenced.slice(start, end + 1));
            } catch {
                return null;
            }
        }
        return null;
    }
}

function relativeToCwd(filePath) {
    return path.relative(process.cwd(), filePath).replaceAll('\\', '/');
}

async function readJson(filePath) {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function readJsonLines(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    return content
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}

async function exists(filePath) {
    return fs.access(filePath).then(() => true, () => false);
}

async function collectSamples(sourceRoot, samplesPerDomain, limit) {
    const samples = [];
    for (const [domain, expectedApplication] of Object.entries(DOMAIN_APPLICATIONS)) {
        const domainDir = path.join(sourceRoot, domain);
        if (!await exists(domainDir)) continue;
        const entries = (await fs.readdir(domainDir, { withFileTypes: true }))
            .filter((entry) => entry.isDirectory())
            .sort((a, b) => a.name.localeCompare(b.name));
        let accepted = 0;
        for (const entry of entries) {
            if (accepted >= samplesPerDomain) break;
            const taskDir = path.join(domainDir, entry.name);
            const summaryPath = path.join(taskDir, 'summary.json');
            const trajectoryPath = path.join(taskDir, 'traj.jsonl');
            if (!await exists(summaryPath) || !await exists(trajectoryPath)) continue;
            const summary = await readJson(summaryPath).catch(() => null);
            const trajectory = await readJsonLines(trajectoryPath).catch(() => []);
            if (!summary || summary.runner_error || summary.status !== 'completed') continue;
            const observations = trajectory.filter((record) =>
                record.record_type === 'computer_action' &&
                record.screenshot_file &&
                record.requested_args?.intent
            );
            if (observations.length < 2) continue;
            const fraction = accepted % 2 === 0 ? 0.4 : 0.75;
            const observation = observations[Math.min(
                observations.length - 1,
                Math.max(0, Math.floor((observations.length - 1) * fraction))
            )];
            const imagePath = path.join(taskDir, observation.screenshot_file);
            if (!await exists(imagePath)) continue;
            samples.push({
                id: `${domain}-${entry.name}-${observation.step_num}`,
                domain,
                expectedApplication,
                expectedActivity: summary.instruction,
                visibleStepContext: observation.requested_args.intent,
                imagePath,
                sourceTaskId: entry.name,
                sourceStep: observation.step_num
            });
            accepted += 1;
        }
    }
    return samples.slice(0, limit);
}

function buildVisionSettings(preferences, options) {
    if (options.useConfiguredVision) {
        if (!preferences.visionLlmEnabled || !preferences.visionLlmModel) {
            throw new Error('The saved independent visual model is not enabled or has no model ID.');
        }
        return {
            enabled: true,
            provider: preferences.visionLlmProvider,
            baseUrl: preferences.visionLlmBaseUrl,
            apiKey: preferences.visionLlmApiKey,
            model: preferences.visionLlmModel,
            timeoutMs: preferences.visionLlmRequestTimeoutMs
        };
    }
    return {
        enabled: true,
        provider: 'codex-model-bridge',
        baseUrl: 'codex://chatgpt-oauth',
        model: options.visionModel,
        reasoningEffort: options.visionReasoningEffort,
        timeoutMs: 180000
    };
}

function buildMainSettings(preferences) {
    return {
        provider: preferences.llmProvider,
        baseUrl: preferences.llmBaseUrl,
        apiKey: preferences.llmApiKey,
        model: preferences.llmModel,
        timeoutMs: preferences.llmRequestTimeoutMs || 120000
    };
}

function buildVisionMessages(imageDataUrl) {
    return [{
        role: 'system',
        content: [
            '你是 AILIS 的只读屏幕理解模块。你的任务只是判断用户当前可能在做什么。',
            '不要给点击坐标，不要规划操作，不要声称执行了任何动作。',
            '只依据截图中明确可见的信息；不知道具体任务时应给出保守的上层活动描述。',
            '只返回一个 JSON 对象，不要 Markdown。',
            'JSON 字段：application（当前主要软件或界面）、activity（用户可能正在做的事情，一句话）、state（working|exploring|waiting|reviewing|stuck|idle|uncertain）、visible_issue（明确可见的问题，没有则为空字符串）、confidence（0到1）。'
        ].join('\n')
    }, {
        role: 'user',
        content: [{
            type: 'text',
            text: '请看当前桌面截图，用简洁中文说明用户可能正在做什么。'
        }, {
            type: 'image_url',
            image_url: { url: imageDataUrl },
            detail: 'high'
        }]
    }];
}

function buildJudgeMessages(sample, prediction) {
    return [{
        role: 'system',
        content: [
            '你是桌面截图语义理解评测器。只评价视觉模块的文字输出是否足以让对话助手大致知道用户在做什么。',
            '不要求输出精确复述隐藏任务；软件类别正确、活动方向一致即可。',
            '只有出现与参考明显冲突或无依据的具体事实，才标记 hallucination=true。',
            '只返回 JSON，不要 Markdown。字段：application_score（0或1）、activity_score（0、1或2）、state_score（0或1）、hallucination（true或false）、usable（true或false）、reason（简短中文）。'
        ].join('\n')
    }, {
        role: 'user',
        content: [
            `参考软件：${sample.expectedApplication}`,
            `整体任务：${sample.expectedActivity}`,
            `截图产生前后的可见步骤语义：${sample.visibleStepContext}`,
            `视觉模块输出：${JSON.stringify(prediction)}`,
            '评分标准：activity_score=2 表示活动判断清晰一致；1 表示只判断到较宽泛但仍有帮助；0 表示错误、无关或无法使用。'
        ].join('\n')
    }];
}

function isTransientVisionFailure(result = {}) {
    const message = String(result.error || result.message || '');
    return /network|socket|tls|timeout|timed out|connection|econn|429|502|503|504/i.test(message);
}

async function evaluateSample(sample, settings, options) {
    const startedAt = Date.now();
    const image = await fs.readFile(sample.imagePath);
    const imageDataUrl = `data:image/png;base64,${image.toString('base64')}`;
    let visionResult = null;
    let visionAttempts = 0;
    for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
        visionAttempts = attempt;
        visionResult = await callVisionModel({
            mainSettings: settings.main,
            auxiliarySettings: settings.vision,
            request: {
                messages: buildVisionMessages(imageDataUrl),
                tools: [],
                toolChoice: 'none'
            }
        });
        if (visionResult.ok || !isTransientVisionFailure(visionResult)) break;
    }
    const visionLatencyMs = Date.now() - startedAt;
    const prediction = safeJsonParse(visionResult.content);
    let judgeResult = null;
    let judgeRaw = '';
    let judgeLatencyMs = 0;
    if (options.judge && visionResult.ok && prediction) {
        const judgeStartedAt = Date.now();
        const response = await callDesktopLlmProvider(settings.main, {
            messages: buildJudgeMessages(sample, prediction),
            tools: [],
            toolChoice: 'none',
            responseFormat: { type: 'json_object' }
        });
        judgeLatencyMs = Date.now() - judgeStartedAt;
        judgeRaw = response.content || '';
        judgeResult = response.ok ? safeJsonParse(response.content) : null;
    }
    return {
        id: sample.id,
        domain: sample.domain,
        source_image: relativeToCwd(sample.imagePath),
        expected_application: sample.expectedApplication,
        expected_activity: sample.expectedActivity,
        visible_step_context: sample.visibleStepContext,
        prediction,
        raw_prediction: visionResult.content || '',
        vision_ok: Boolean(visionResult.ok && prediction),
        vision_error: visionResult.error || '',
        vision_route: visionResult.route || null,
        vision_usage: visionResult.usage || null,
        vision_attempts: visionAttempts,
        vision_latency_ms: visionLatencyMs,
        judge: judgeResult,
        raw_judge: judgeRaw,
        judge_latency_ms: judgeLatencyMs
    };
}

function summarize(results) {
    const judged = results.filter((result) => result.judge);
    const sum = (selector) => judged.reduce((total, result) => total + Number(selector(result) || 0), 0);
    const average = (values) => values.length
        ? values.reduce((total, value) => total + value, 0) / values.length
        : 0;
    return {
        samples: results.length,
        vision_success: results.filter((result) => result.vision_ok).length,
        judged_samples: judged.length,
        application_accuracy: judged.length ? sum((result) => result.judge.application_score) / judged.length : null,
        activity_score: judged.length ? sum((result) => result.judge.activity_score) / (judged.length * 2) : null,
        state_accuracy: judged.length ? sum((result) => result.judge.state_score) / judged.length : null,
        usable_rate: judged.length ? sum((result) => result.judge.usable ? 1 : 0) / judged.length : null,
        hallucination_rate: judged.length ? sum((result) => result.judge.hallucination ? 1 : 0) / judged.length : null,
        average_vision_latency_ms: Math.round(average(results.map((result) => result.vision_latency_ms))),
        average_judge_latency_ms: Math.round(average(results.map((result) => result.judge_latency_ms).filter(Boolean)))
    };
}

async function runPool(items, concurrency, worker) {
    const results = new Array(items.length);
    let cursor = 0;
    async function runWorker() {
        while (true) {
            const index = cursor;
            cursor += 1;
            if (index >= items.length) return;
            try {
                results[index] = await worker(items[index], index);
            } catch (error) {
                results[index] = {
                    id: items[index].id,
                    domain: items[index].domain,
                    source_image: relativeToCwd(items[index].imagePath),
                    vision_ok: false,
                    vision_error: error?.stack || error?.message || String(error),
                    vision_latency_ms: 0,
                    judge: null,
                    judge_latency_ms: 0
                };
            }
        }
    }
    await Promise.all(Array.from({ length: concurrency }, runWorker));
    return results;
}

const options = parseArgs(process.argv.slice(2));
if (options.help) {
    printHelp();
    process.exit(0);
}

const sourceRoot = path.resolve(options.sourceRun);
const statePath = path.resolve(options.statePath);
const desktopState = await readJson(statePath);
const preferences = desktopState.preferences || {};
const settings = {
    main: buildMainSettings(preferences),
    vision: buildVisionSettings(preferences, options)
};
if (options.judge && (!settings.main.provider || !settings.main.model || !settings.main.apiKey)) {
    throw new Error('The saved main model is incomplete, so semantic judging cannot run. Use --no-judge to skip it.');
}

let samples = await collectSamples(
    sourceRoot,
    options.samplesPerDomain,
    options.onlyId ? Number.MAX_SAFE_INTEGER : options.limit
);
if (options.onlyId) {
    samples = samples.filter((sample) => sample.id === options.onlyId);
}
if (!samples.length) {
    throw new Error(`No usable screenshot samples found under ${sourceRoot}`);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputDir = path.resolve(options.outputDir || path.join('eval-results', 'screen-understanding', stamp));
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, 'manifest.json'), JSON.stringify({
    schema: 'ailis.screen_understanding.manifest.v1',
    created_at: new Date().toISOString(),
    source_run: relativeToCwd(sourceRoot),
    samples: samples.map((sample) => ({
        ...sample,
        imagePath: relativeToCwd(sample.imagePath)
    }))
}, null, 2));

console.log(JSON.stringify({
    event: 'start',
    samples: samples.length,
    concurrency: options.concurrency,
    vision_provider: settings.vision.provider,
    vision_model: settings.vision.model,
    judge_provider: options.judge ? settings.main.provider : 'disabled',
    judge_model: options.judge ? settings.main.model : 'disabled',
    output_dir: relativeToCwd(outputDir),
    host: os.hostname()
}));

let completed = 0;
const results = await runPool(samples, options.concurrency, async (sample) => {
    const result = await evaluateSample(sample, settings, options);
    completed += 1;
    console.log(JSON.stringify({
        event: 'progress',
        completed,
        total: samples.length,
        id: result.id,
        vision_ok: result.vision_ok,
        usable: result.judge?.usable ?? null,
        vision_latency_ms: result.vision_latency_ms
    }));
    return result;
});

const summary = summarize(results);
const report = {
    schema: 'ailis.screen_understanding.report.v1',
    created_at: new Date().toISOString(),
    configuration: {
        source_run: relativeToCwd(sourceRoot),
        vision_provider: settings.vision.provider,
        vision_model: settings.vision.model,
        vision_reasoning_effort: settings.vision.reasoningEffort || '',
        judge_provider: options.judge ? settings.main.provider : 'disabled',
        judge_model: options.judge ? settings.main.model : 'disabled',
        concurrency: options.concurrency
    },
    summary,
    results
};
await fs.writeFile(path.join(outputDir, 'report.json'), JSON.stringify(report, null, 2));
await fs.writeFile(path.join(outputDir, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ event: 'complete', output_dir: relativeToCwd(outputDir), summary }));
