import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { callDesktopLlmProvider } = require('../electron/desktop-llm-provider.cjs');
const {
    aggregateHumanlikeEvalResults,
    buildHumanlikeJudgeMessages,
    buildHumanlikeJudgePacket,
    normalizeCandidateResponse,
    normalizeImportedJudgment,
    normalizeScenario,
    parseJudgeResponse,
    validateScenarioDataset
} = require('../electron/ailis-humanlike-eval.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_SCENARIOS_PATH = path.join(PROJECT_ROOT, 'evals', 'ailis-humanlike', 'scenarios.jsonl');
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'eval-results', 'ailis-humanlike');

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        scenarios: DEFAULT_SCENARIOS_PATH,
        responses: '',
        outputDir: DEFAULT_OUTPUT_DIR,
        validateOnly: false,
        exportJudgePackets: false,
        judgments: '',
        limit: 0,
        gatewayUrl: '',
        generateWithAgent: false,
        judgeBaseUrl: process.env.AILIS_EVAL_LLM_BASE_URL || process.env.OPENAI_BASE_URL || process.env.LLM_BASE_URL || '',
        judgeModel: process.env.AILIS_EVAL_LLM_MODEL || process.env.OPENAI_MODEL || process.env.LLM_MODEL || '',
        judgeApiKey: process.env.AILIS_EVAL_LLM_API_KEY || process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || '',
        judgeTimeoutMs: Number(process.env.AILIS_EVAL_LLM_TIMEOUT_MS || 90000),
        candidateBaseUrl: process.env.AILIS_CANDIDATE_LLM_BASE_URL || '',
        candidateModel: process.env.AILIS_CANDIDATE_LLM_MODEL || '',
        candidateApiKey: process.env.AILIS_CANDIDATE_LLM_API_KEY || '',
        candidateTimeoutMs: Number(process.env.AILIS_CANDIDATE_LLM_TIMEOUT_MS || 90000)
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--scenarios') args.scenarios = path.resolve(next());
        else if (token === '--responses') args.responses = path.resolve(next());
        else if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--validate-only') args.validateOnly = true;
        else if (token === '--export-judge-packets') args.exportJudgePackets = true;
        else if (token === '--judgments') args.judgments = path.resolve(next());
        else if (token === '--limit') args.limit = Number(next()) || 0;
        else if (token === '--gateway-url') args.gatewayUrl = normalizeText(next()).replace(/\/+$/, '');
        else if (token === '--generate-with-agent') args.generateWithAgent = true;
        else if (token === '--judge-base-url') args.judgeBaseUrl = next();
        else if (token === '--judge-model') args.judgeModel = next();
        else if (token === '--judge-api-key') args.judgeApiKey = next();
        else if (token === '--judge-timeout-ms') args.judgeTimeoutMs = Number(next()) || args.judgeTimeoutMs;
        else if (token === '--candidate-base-url') args.candidateBaseUrl = next();
        else if (token === '--candidate-model') args.candidateModel = next();
        else if (token === '--candidate-api-key') args.candidateApiKey = next();
        else if (token === '--candidate-timeout-ms') args.candidateTimeoutMs = Number(next()) || args.candidateTimeoutMs;
    }
    return args;
}

async function readJsonl(filePath) {
    const text = await fs.readFile(filePath, 'utf8');
    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
        .map((line, index) => {
            try {
                return JSON.parse(line);
            } catch (error) {
                error.message = `${filePath}:${index + 1} ${error.message}`;
                throw error;
            }
        });
}

async function writeJsonl(filePath, rows = []) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
}

function indexResponses(responses = []) {
    const map = new Map();
    for (const row of responses) {
        const id = normalizeText(row.scenario_id || row.scenarioId || row.id);
        if (!id) {
            continue;
        }
        map.set(id, row.assistant_response || row.assistantResponse || row.response || row);
    }
    return map;
}

function resolveCandidateSettings(args) {
    return {
        provider: 'openai-compatible',
        baseUrl: args.candidateBaseUrl || args.judgeBaseUrl,
        model: args.candidateModel || args.judgeModel,
        apiKey: args.candidateApiKey || args.judgeApiKey,
        timeoutMs: args.candidateTimeoutMs,
        temperature: 0.8
    };
}

function resolveJudgeSettings(args) {
    return {
        provider: 'openai-compatible',
        baseUrl: args.judgeBaseUrl,
        model: args.judgeModel,
        apiKey: args.judgeApiKey,
        timeoutMs: args.judgeTimeoutMs,
        temperature: 0.1
    };
}

function buildEvalMemoryContext(scenario) {
    return {
        eval_relationship: {
            affinity_score: scenario.affinity_score,
            relationship_stage: scenario.relationship_stage,
            relationship_expectation: scenario.relationship_expectation
        },
        memory_context: scenario.memory_context || null,
        modalities: scenario.modalities || null,
        instruction: '这些是 AILIS 在真实产品中应拥有的本地记忆、关系状态和多模态偏好。可以用来调整语气和行为，但不要主动向用户暴露内部好感度数值、memory_context 字段名或评估信息。'
    };
}

async function generateWithGatewayAgent(args, scenario) {
    if (!args.gatewayUrl) {
        throw new Error('--generate-with-agent requires --gateway-url');
    }
    const body = {
        sessionId: `humanlike-eval-${scenario.id}`,
        message: scenario.user_message,
        messageHistory: scenario.conversation,
        memoryContext: buildEvalMemoryContext(scenario),
        agentLoop: 'llm',
        llmSettings: resolveCandidateSettings(args),
        context: {
            agentLoop: 'llm',
            llmSettings: resolveCandidateSettings(args),
            evalScenarioId: scenario.id,
            evalMemoryContext: buildEvalMemoryContext(scenario)
        }
    };
    const response = await fetch(`${args.gatewayUrl}/agent/run`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok === false) {
        return {
            text: result.displayText || result.error || `agent failed with status ${response.status}`,
            trace_summary: JSON.stringify({
                status: result.status || response.status,
                error: result.error || '',
                steps: result.steps || []
            })
        };
    }
    return {
        text: result.displayText || result.finalAnswer || '',
        speech_text: result.speechText || result.speech_text || '',
        expression: result.expression || '',
        action: result.action || '',
        trace_summary: JSON.stringify({
            status: result.status,
            intent: result.intent,
            steps: result.steps || []
        })
    };
}

async function judgeScenario(args, scenario, candidate) {
    const messages = buildHumanlikeJudgeMessages({ scenario, candidate });
    const response = await callDesktopLlmProvider(resolveJudgeSettings(args), {
        messages,
        temperature: 0.1,
        timeoutMs: args.judgeTimeoutMs
    });
    if (!response.ok) {
        return {
            ok: false,
            status: response.code || 'judge_error',
            error: response.error || 'judge failed'
        };
    }
    return {
        ...parseJudgeResponse(response.content),
        model: response.model,
        usage: response.usage || null
    };
}

async function aggregateImportedJudgments(args, scenarios, responseMap) {
    const importedRows = await readJsonl(args.judgments);
    const scenarioMap = new Map(scenarios.map((scenario) => [scenario.id, scenario]));
    const results = [];
    for (const row of importedRows) {
        const imported = normalizeImportedJudgment(row);
        const scenario = scenarioMap.get(imported.scenario_id);
        if (!scenario) {
            results.push({
                scenario: { id: imported.scenario_id || 'unknown', category: 'unknown' },
                candidate: null,
                judge: {
                    ok: false,
                    status: 'unknown_scenario_id',
                    error: `No scenario found for imported judgment: ${imported.scenario_id || 'unknown'}`
                }
            });
            continue;
        }
        results.push({
            scenario,
            candidate: normalizeCandidateResponse(responseMap.get(scenario.id) || scenario.candidate_response || {}),
            judge: imported.judge
        });
    }
    return results;
}

async function main() {
    const args = parseArgs();
    const scenarios = (await readJsonl(args.scenarios)).map(normalizeScenario);
    const limitedScenarios = args.limit > 0 ? scenarios.slice(0, args.limit) : scenarios;
    const validation = validateScenarioDataset(limitedScenarios);
    if (!validation.ok) {
        console.error(JSON.stringify(validation, null, 2));
        process.exitCode = 1;
        return;
    }
    if (args.validateOnly) {
        console.log(JSON.stringify({
            ok: true,
            status: 'validated',
            scenarios: limitedScenarios.length,
            path: args.scenarios
        }, null, 2));
        return;
    }

    const responseMap = args.responses ? indexResponses(await readJsonl(args.responses)) : new Map();
    const runId = new Date().toISOString().replace(/[:.]/g, '-');

    if (args.judgments) {
        const results = await aggregateImportedJudgments(args, limitedScenarios, responseMap);
        const summary = aggregateHumanlikeEvalResults(results);
        const resultPath = path.join(args.outputDir, `${runId}.imported-results.jsonl`);
        const summaryPath = path.join(args.outputDir, `${runId}.summary.json`);
        await writeJsonl(resultPath, results);
        await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
        console.log(JSON.stringify({
            ok: true,
            mode: 'imported_judgments',
            resultPath,
            summaryPath,
            summary
        }, null, 2));
        return;
    }

    if (args.exportJudgePackets) {
        const packets = [];
        for (const scenario of limitedScenarios) {
            let candidate = responseMap.get(scenario.id) || scenario.candidate_response || null;
            if (!candidate && args.generateWithAgent) {
                candidate = await generateWithGatewayAgent(args, scenario);
            }
            if (!candidate) {
                packets.push({
                    scenario_id: scenario.id,
                    status: 'missing_candidate_response',
                    error: 'provide --responses or --generate-with-agent'
                });
                continue;
            }
            packets.push(buildHumanlikeJudgePacket({
                scenario,
                candidate: normalizeCandidateResponse(candidate)
            }));
        }
        const packetPath = path.join(args.outputDir, `${runId}.judge-packets.jsonl`);
        await writeJsonl(packetPath, packets);
        console.log(JSON.stringify({
            ok: true,
            mode: 'judge_packets',
            packetPath,
            packets: packets.length,
            instruction: 'Send this JSONL to the strongest judge model. Save one JSON judgment per line with scenario_id, metrics, hard_fail_flags, issues, and better_answer_direction, then rerun with --judgments <file>.'
        }, null, 2));
        return;
    }

    if (!args.judgeBaseUrl || !args.judgeModel || !args.judgeApiKey) {
        console.error('Missing judge LLM settings. Provide --judge-base-url, --judge-model, --judge-api-key or AILIS_EVAL_LLM_* env vars.');
        process.exitCode = 1;
        return;
    }

    const results = [];
    for (const scenario of limitedScenarios) {
        let candidate = responseMap.get(scenario.id) || scenario.candidate_response || null;
        if (!candidate && args.generateWithAgent) {
            candidate = await generateWithGatewayAgent(args, scenario);
        }
        if (!candidate) {
            results.push({
                scenario,
                candidate: null,
                judge: {
                    ok: false,
                    status: 'missing_candidate_response',
                    error: 'provide --responses or --generate-with-agent'
                }
            });
            continue;
        }
        const normalizedCandidate = normalizeCandidateResponse(candidate);
        const judge = await judgeScenario(args, scenario, normalizedCandidate);
        results.push({
            scenario,
            candidate: normalizedCandidate,
            judge
        });
        console.log(`${scenario.id}: ${judge.ok ? judge.weighted_score : judge.status}`);
    }

    const summary = aggregateHumanlikeEvalResults(results);
    const resultPath = path.join(args.outputDir, `${runId}.jsonl`);
    const summaryPath = path.join(args.outputDir, `${runId}.summary.json`);
    await writeJsonl(resultPath, results);
    await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({
        ok: true,
        resultPath,
        summaryPath,
        summary
    }, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
