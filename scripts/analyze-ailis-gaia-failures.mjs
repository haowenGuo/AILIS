import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_JOB_DIR = path.join(PROJECT_ROOT, 'longrun', 'jobs', 'ailis-gaia-auto-optimizer');

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function clipText(value = '', max = 500) {
    const text = normalizeText(value).replace(/\s+/g, ' ');
    return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        jobDir: DEFAULT_JOB_DIR,
        outputJson: '',
        outputMarkdown: ''
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--job-dir') args.jobDir = path.resolve(next());
        else if (token === '--output-json') args.outputJson = path.resolve(next());
        else if (token === '--output-md' || token === '--output-markdown') args.outputMarkdown = path.resolve(next());
    }
    args.outputJson ||= path.join(args.jobDir, 'failure-analysis.json');
    args.outputMarkdown ||= path.join(args.jobDir, 'failure-analysis.md');
    return args;
}

async function readJson(filePath, fallback = null) {
    try {
        const text = await fs.readFile(filePath, 'utf8');
        return JSON.parse(text.replace(/^\uFEFF/, ''));
    } catch {
        return fallback;
    }
}

async function readJsonl(filePath) {
    const text = (await fs.readFile(filePath, 'utf8').catch(() => '')).replace(/^\uFEFF/, '');
    return text.split(/\r?\n/).filter(Boolean).map((line) => {
        try {
            return JSON.parse(line);
        } catch {
            return null;
        }
    }).filter(Boolean);
}

async function walkFiles(rootDir, predicate = () => true) {
    const found = [];
    async function walk(current) {
        const entries = await fs.readdir(current, { withFileTypes: true }).catch(() => []);
        for (const entry of entries) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                await walk(fullPath);
            } else if (predicate(fullPath, entry)) {
                found.push(fullPath);
            }
        }
    }
    await walk(rootDir);
    return found;
}

function safeCountBy(items, keyFn) {
    const counts = {};
    for (const item of items) {
        const key = normalizeText(keyFn(item), '(none)');
        counts[key] = (counts[key] || 0) + 1;
    }
    return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

function normalizeAnswer(value = '') {
    return normalizeText(value)
        .replace(/^final\s*answer\s*[:：]\s*/i, '')
        .replace(/^answer\s*[:：]\s*/i, '')
        .replace(/^答案\s*(?:是|为)?\s*[:：]?\s*/i, '')
        .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function isPassedVerdict(verdict = {}) {
    return verdict.ok === true || (!normalizeText(verdict.failureCategory) && /^Task passed/i.test(normalizeText(verdict.summary)));
}

function isOfficialTaskId(taskId = '') {
    return /^official-validation-l1-offset-\d+$/.test(normalizeText(taskId));
}

function parseOffset(value = '') {
    const match = normalizeText(value).match(/offset-(\d+)/);
    return match ? Number(match[1]) : null;
}

function selectFinalRow(rows = []) {
    return [...rows].reverse().find((row) => row.record_type === 'final') || rows[rows.length - 1] || null;
}

function scorePerTask({ task = {}, result = {}, summary = null } = {}) {
    const perTaskItems = Array.isArray(summary?.score?.per_task) ? summary.score.per_task : [];
    if (!perTaskItems.length) {
        return null;
    }
    const ids = [
        task.taskId,
        task.gaiaTaskId,
        result.task_id,
        result.taskId
    ].map((item) => normalizeText(item)).filter(Boolean);
    return perTaskItems.find((item) => ids.includes(normalizeText(item.task_id))) ||
        (perTaskItems.length === 1 ? perTaskItems[0] : null);
}

function collectToolCounts(chain = {}, result = {}) {
    const counts = { ...(chain.toolCounts || {}) };
    for (const step of Array.isArray(result.steps) ? result.steps : []) {
        const tool = normalizeText(step.tool || step.args?.tool || step.args?.tool_name || '(unknown)');
        counts[tool] = (counts[tool] || 0) + 1;
    }
    return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

function collectFailedStepSignals(chain = {}, result = {}) {
    const signals = [];
    const steps = Array.isArray(chain.steps) && chain.steps.length
        ? chain.steps
        : (Array.isArray(result.steps) ? result.steps : []);
    for (const step of steps) {
        const response = step.response || {};
        const resultValue = response.result || {};
        const status = normalizeText(step.status || response.status || resultValue.structuredContent?.status || resultValue.details?.status);
        const error = normalizeText(step.error || response.error || resultValue.structuredContent?.error || resultValue.details?.error);
        const ok = step.ok ?? response.ok;
        if (ok === false || /error|failed|invalid|blocked|missing|loop_guard|js_shell|thin_content/i.test(`${status} ${error}`)) {
            signals.push({
                tool: normalizeText(step.tool || step.args?.tool || step.args?.tool_name || '(unknown)'),
                title: normalizeText(step.title),
                status,
                error: clipText(error, 300),
                preview: clipText(step.preview || resultValue.content?.[0]?.text || resultValue.details?.stdout || resultValue.details?.stderr, 300)
            });
        }
    }
    return signals.slice(0, 8);
}

async function analyzeTranscriptFiles(iterationDir) {
    const transcriptFiles = await walkFiles(iterationDir, (filePath) => /gateway-audit[\\/].+[\\/]transcripts[\\/].+\.jsonl$/i.test(filePath));
    const aggregate = {
        files: transcriptFiles.length,
        bytes: 0,
        eventCounts: {},
        errorSamples: [],
        finalSamples: [],
        modelDecisions: 0,
        toolCalls: 0,
        toolErrors: 0,
        promptTokensApprox: 0,
        completionTokensApprox: 0
    };
    for (const filePath of transcriptFiles) {
        aggregate.bytes += fsSync.statSync(filePath).size;
        const rows = await readJsonl(filePath);
        for (const row of rows) {
            const type = normalizeText(row.type, '(none)');
            aggregate.eventCounts[type] = (aggregate.eventCounts[type] || 0) + 1;
            if (/agent\.decision/.test(type)) {
                aggregate.modelDecisions += 1;
                aggregate.promptTokensApprox += Number(row.payload?.usage?.prompt_tokens) || 0;
                aggregate.completionTokensApprox += Number(row.payload?.usage?.completion_tokens) || 0;
                if (row.payload?.exactAnswerSubmission?.answer && aggregate.finalSamples.length < 3) {
                    aggregate.finalSamples.push({
                        answer: clipText(row.payload.exactAnswerSubmission.answer, 240),
                        confidence: normalizeText(row.payload.exactAnswerSubmission.confidence),
                        reason: clipText(row.payload.exactAnswerSubmission.reason, 300)
                    });
                }
            }
            if (/tool\.call|mcp\.tool\.call\.begin/.test(type)) {
                aggregate.toolCalls += 1;
            }
            const blob = JSON.stringify(row);
            if (row.status === 'error' || /invalid_mcp_tool_args|provider_error|fetch failed|max_steps_reached|tool_loop_guard|MCP tool arguments failed|overdue balance/i.test(blob)) {
                aggregate.toolErrors += /tool|mcp/i.test(type) ? 1 : 0;
                if (aggregate.errorSamples.length < 8) {
                    aggregate.errorSamples.push({
                        type,
                        status: normalizeText(row.status),
                        text: clipText(blob, 500)
                    });
                }
            }
        }
    }
    aggregate.eventCounts = Object.fromEntries(Object.entries(aggregate.eventCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
    return aggregate;
}

function inferRootCause({ verdict = {}, chain = {}, result = {}, transcript = {} } = {}) {
    const toolCounts = collectToolCounts(chain, result);
    const toolsText = Object.keys(toolCounts).join(' ').toLowerCase();
    const statusText = [
        verdict.failureCategory,
        verdict.optimizationFocus,
        verdict.summary,
        result.status,
        result.raw_status?.status,
        result.raw_status?.error,
        result.answer_gate?.status,
        result.answer_gate?.reason,
        result.finalizer?.status,
        result.finalizer?.reason,
        JSON.stringify(transcript.errorSamples || [])
    ].map((value) => normalizeText(value)).join(' ').toLowerCase();
    const stepCount = Number(chain.stepCount || result.step_count) || 0;
    const submitted = normalizeText(result.submitted_answer || chain.submittedAnswer);
    const expected = normalizeText(scorePerTask({ task: {}, result, summary: { score: { per_task: result.score?.per_task || [] } } })?.final_answer || chain.expectedAnswer);

    if (/overdue|balance|quota|billing|api.?key|desktop-state|llm settings incomplete/.test(statusText)) {
        return {
            cluster: 'ENV_PROVIDER_BLOCKED',
            layer: 'ENV',
            rootCause: '模型提供商/计费/鉴权环境阻塞，继续执行只会产生空答案或 runner_error。',
            optimization: 'Provider readiness gate 必须在任务前检查余额、key、模型视觉/文本能力和健康探针；失败时禁止提交空答案。'
        };
    }
    if (/runner_error/.test(statusText) && /fetch failed/.test(statusText) && stepCount === 0) {
        return {
            cluster: 'RUNNER_PROVIDER_TRANSPORT_ZERO_STEP',
            layer: 'HARNESS/ENV',
            rootCause: '任务尚未形成任何工具链路就出现 runner_error/fetch failed，属于运行器或 LLM provider 传输层失败。',
            optimization: '把 runner_error 与 scorer 空答案分离；失败不进入 GAIA 提交，写 provider/transport ticket，并做小健康检查后再 canary。'
        };
    }
    if (/max_steps_reached/.test(statusText) && stepCount === 0) {
        return {
            cluster: 'AGENT_NO_ACTION_MAX_STEPS',
            layer: 'AGENT/HARNESS',
            rootCause: 'Agent 在 max_steps 内没有形成可归档工具链/最终答案，说明决策协议、direct tool 暴露或进度归档存在断层。',
            optimization: '为零工具链 max_steps 增加早停诊断：记录每轮 agent decision、未调用工具原因、是否 schema/工具面不可见；必要时回退 deterministic finalizer。'
        };
    }
    if (/tool_loop_guard/.test(statusText) && /web_search|web_fetch|pdf_find|paper_metadata/.test(toolsText)) {
        return {
            cluster: 'WEB_RETRIEVAL_LOOP_MISSING_EVIDENCE',
            layer: 'TOOLS/MCP',
            rootCause: 'Web 搜索/抓取多轮后仍缺关键证据，且触发 loop guard 或 missing_evidence。',
            optimization: '升级 web_search/web_fetch 为证据链工具：查询重写、候选排序、页面日期/实体校验、follow-up links、低置信度停止并输出 evidence_gap。'
        };
    }
    if (/describe_image/.test(toolsText)) {
        return {
            cluster: 'VISION_EXTRACTION_AND_REASONING',
            layer: 'TOOLS/MCP',
            rootCause: '图像工具把视觉描述/OCR/推理答案混成裸文本，缺少结构化候选、校验和二次推理。',
            optimization: '把 describe_image 拆成结构化视觉观察：raw_text、objects/board/table、answerCandidates、confidence、needsVerification；棋局/表单/长列表走专门 verifier。'
        };
    }
    if (/read_spreadsheet|read_xlsx|xlsx_workbook/.test(toolsText)) {
        return {
            cluster: 'SPREADSHEET_STRUCTURED_REASONING',
            layer: 'TOOLS/MCP',
            rootCause: '表格读取和路径/颜色推理之间缺少确定性求解器，模型最终答案直接被接受。',
            optimization: '构建 spreadsheet map solver：解析合并单元格、颜色、坐标、障碍和移动规则，用图搜索输出可审计路径与最终单元格。'
        };
    }
    if (/youtube|transcribe_audio|audio|video/.test(`${toolsText} ${statusText}`)) {
        return {
            cluster: 'MEDIA_VIDEO_AUDIO_EVIDENCE',
            layer: 'TOOLS/MCP',
            rootCause: '视频/音频任务没有稳定从 transcript/ASR/片段定位得到可验证回答，后续退化成宽泛 web 搜索。',
            optimization: '媒体工具链需要 yt-dlp 元数据、字幕、ASR fallback、时间片段证据和 quote exact-answer finalizer。'
        };
    }
    if (/web_search|web_fetch|pdf_find|pdf_extract|paper_metadata/.test(toolsText)) {
        return {
            cluster: 'WEB_OR_PDF_SOURCE_DISAMBIGUATION',
            layer: 'TOOLS/MCP',
            rootCause: 'Web/PDF 工具拿到的来源或证据片段不足以唯一支持最终答案，或 finalizer 对负条件/日期/实体约束处理失败。',
            optimization: '增加 source disambiguation：必须保留目标约束、排除项、发布日期、页面标题和命中证据；finalizer 不得仅凭标题或单页片段高置信回答。'
        };
    }
    if (/run_python_file|artifact_compute/.test(toolsText)) {
        return {
            cluster: 'CODE_EXECUTION_FINALIZATION',
            layer: 'TOOLS/MCP',
            rootCause: '代码/计算工具执行结果没有形成可提交 exact answer，或执行异常被 scorer 视作空答案。',
            optimization: 'run_python_file/artifact_compute 输出必须包含 stdout 摘要、answerCandidates、exit diagnostics；失败时禁止提交空答案。'
        };
    }
    if (/exact_answer_gate_rejected|incomplete_agent_run|missing_exact_answer/.test(statusText) && !submitted) {
        return {
            cluster: 'FINAL_ANSWER_GATE_OR_DIRECT_REASONING',
            layer: 'HARNESS/AGENT',
            rootCause: '无工具或低复杂度任务没有直接生成可提交 exact answer，answer gate 只拒绝但没有 deterministic fallback。',
            optimization: '为纯文本/逻辑/指令遵循题增加 deterministic short-answer resolver；gate 拒绝时返回可修复原因，而不是直接空提交。'
        };
    }
    if (submitted && expected && normalizeAnswer(submitted) !== normalizeAnswer(expected)) {
        return {
            cluster: 'MODEL_REASONING_WRONG_FINAL',
            layer: 'AGENT/HARNESS',
            rootCause: '证据链未显式失败，但最终答案与 scorer 不一致，说明 evidence-to-answer 校验不足。',
            optimization: '高风险题型的 direct final_answer 需经过 finalizer/verifier 二次确认，尤其是列表、日期、名称、棋步和单位格式。'
        };
    }
    return {
        cluster: 'UNCLASSIFIED_NEEDS_TRACE_REPLAY',
        layer: 'UNKNOWN',
        rootCause: '现有 artifact 不足以唯一定位失败层。',
        optimization: '增强每轮 transcript 摘要和 task/result 回填，保留 agent decision、tool args/result、answerGate/finalizer。'
    };
}

function recommendationForCluster(cluster) {
    const recommendations = {
        ENV_PROVIDER_BLOCKED: '先修 provider readiness gate：余额/key/模型能力/健康探针不过，不允许进入 GAIA scorer。',
        RUNNER_PROVIDER_TRANSPORT_ZERO_STEP: '修 runner 与 provider 传输错误分类：0-step runner_error 直接 repair_required，不提交空答案。',
        AGENT_NO_ACTION_MAX_STEPS: '修 agent loop 可观测性和早停：记录每轮决策，并在无工具链 max_steps 时走 deterministic fallback 或明确 blocked。',
        WEB_RETRIEVAL_LOOP_MISSING_EVIDENCE: '优先升级 web_search/web_fetch：证据评分、来源约束、页面 follow-up、低置信度停止。',
        WEB_OR_PDF_SOURCE_DISAMBIGUATION: '升级 scholarly/web evidence disambiguation：负条件、日期、实体、标题/正文证据分离。',
        VISION_EXTRACTION_AND_REASONING: '建设 vision artifact pipeline：OCR/视觉模型双路、结构化候选、棋局/表单/长列表 verifier。',
        SPREADSHEET_STRUCTURED_REASONING: '建设 spreadsheet solver：完整 workbook 样式读取 + 规则图搜索 + 可审计路径。',
        MEDIA_VIDEO_AUDIO_EVIDENCE: '建设 media evidence pipeline：字幕/ASR/yt-dlp/oEmbed fallback + 时间片段证据。',
        CODE_EXECUTION_FINALIZATION: '让执行工具返回 answerCandidates 和失败诊断；计算题不允许从 stderr/空 stdout 进入提交。',
        FINAL_ANSWER_GATE_OR_DIRECT_REASONING: '给低工具需求文本题加 deterministic resolver；answer gate 拒绝时不提交空答案。',
        MODEL_REASONING_WRONG_FINAL: '高风险 direct answer 加 verifier：列表长度、格式、证据引用、反例检查。',
        UNCLASSIFIED_NEEDS_TRACE_REPLAY: '先修 artifact 归档，再复盘该类任务。'
    };
    return recommendations[cluster] || recommendations.UNCLASSIFIED_NEEDS_TRACE_REPLAY;
}

function summarizeTask(item) {
    const toolCounts = collectToolCounts(item.chain, item.result);
    const topTools = Object.entries(toolCounts).slice(0, 5).map(([tool, count]) => `${tool}x${count}`).join(', ');
    return {
        taskId: item.taskId,
        gaiaTaskId: item.gaiaTaskId,
        offset: item.offset,
        iteration: item.iterationName,
        source: item.source,
        question: clipText(item.question, 360),
        fileName: item.fileName,
        submitted: clipText(item.submitted || '(empty)', 180),
        expected: clipText(item.expected || '(unknown)', 180),
        status: item.status,
        rawStatus: item.rawStatus,
        stepCount: item.stepCount,
        toolCounts,
        topTools,
        answerGate: item.answerGate,
        finalizer: item.finalizer,
        root: item.root,
        failedStepSignals: item.failedStepSignals,
        artifacts: item.artifacts
    };
}

function markdownTable(rows, columns) {
    if (!rows.length) {
        return '_None._';
    }
    const header = `| ${columns.map((column) => column.label).join(' |')} |`;
    const sep = `| ${columns.map(() => '---').join(' |')} |`;
    const body = rows.map((row) => `| ${columns.map((column) => {
        const raw = typeof column.value === 'function' ? column.value(row) : row[column.value];
        return normalizeText(String(raw ?? '')).replace(/\|/g, '\\|');
    }).join(' |')} |`);
    return [header, sep, ...body].join('\n');
}

function markdownStatusReason(label, status, reason) {
    const clippedReason = clipText(reason || '', 240);
    return clippedReason
        ? `- ${label}: ${status || '(none)'} / ${clippedReason}`
        : `- ${label}: ${status || '(none)'}`;
}

function buildMarkdown(analysis) {
    const clusterRows = Object.entries(analysis.clusters).map(([cluster, value]) => ({
        cluster,
        layer: value.layer,
        backlog: value.backlogCount,
        failedIterations: value.failedIterationCount,
        recommendation: recommendationForCluster(cluster)
    })).sort((a, b) => b.backlog - a.backlog || b.failedIterations - a.failedIterations || a.cluster.localeCompare(b.cluster));

    const backlogRows = analysis.backlogTasks.map((task) => ({
        offset: task.offset ?? '',
        cluster: task.root.cluster,
        layer: task.root.layer,
        status: task.status || task.rawStatus || '',
        steps: task.stepCount,
        tools: task.topTools || '(none)',
        submitted: task.submitted,
        expected: task.expected
    }));

    const sections = [
        '# AILIS GAIA Failure Analysis',
        '',
        `Generated: ${analysis.generatedAt}`,
        '',
        '## Scope',
        '',
        `- Job dir: \`${analysis.jobDir}\``,
        `- Current state: ${analysis.state.status}, repairRequired=${analysis.state.repairRequired}, stopFlag=${analysis.state.stopFlag}`,
        `- Official Level 1 known score: ${analysis.score.passedOfficial}/${analysis.score.totalOfficial} (${(analysis.score.passRateAllKnown * 100).toFixed(1)}%)`,
        `- Attempted official tasks: ${analysis.score.attemptedOfficial}; backlog: ${analysis.score.backlogOfficial}; unattempted: ${analysis.score.unattemptedOfficial}`,
        `- Failed iterations analyzed: ${analysis.failedIterations.length}; backlog tasks analyzed: ${analysis.backlogTasks.length}`,
        '',
        '## Failure Clusters',
        '',
        markdownTable(clusterRows, [
            { label: 'Cluster', value: 'cluster' },
            { label: 'Layer', value: 'layer' },
            { label: 'Backlog', value: 'backlog' },
            { label: 'Failed Iterations', value: 'failedIterations' },
            { label: 'Generic Optimization', value: 'recommendation' }
        ]),
        '',
        '## Backlog Task Matrix',
        '',
        markdownTable(backlogRows, [
            { label: 'Offset', value: 'offset' },
            { label: 'Cluster', value: 'cluster' },
            { label: 'Layer', value: 'layer' },
            { label: 'Status', value: 'status' },
            { label: 'Steps', value: 'steps' },
            { label: 'Top Tools', value: 'tools' },
            { label: 'Submitted', value: 'submitted' },
            { label: 'Expected', value: 'expected' }
        ]),
        '',
        '## Systemic Diagnosis',
        '',
        '1. The historical `harness_finalization` label was too coarse. Many scorer rejections are actually first caused by TOOLS/MCP retrieval or extraction quality, especially web, vision, spreadsheet, media, and code execution.',
        '2. Zero-step failures are not reasoning failures. They indicate provider transport, runner orchestration, or agent loop visibility problems and should be blocked before scorer submission.',
        '3. Web failures are evidence-chain failures, not just search keyword failures. The common pattern is broad search -> partial fetch -> missing or wrong disambiguation -> direct/empty answer.',
        '4. Artifact failures need deterministic tool postprocessors. Image OCR/list/chess, spreadsheet path/color, audio/video transcript, and code-computation tasks should produce structured `answerCandidates` plus verifier evidence.',
        '5. The final-answer gate trusts direct agent answers too early for high-risk tasks. Lists, dates, names, chess moves, screenshots, media quotes, and spreadsheet paths need evidence-aware verification before submit.',
        '6. Artifact observability was incomplete in older iterations. Some `task.json` files were only offset shells, so future runs must always persist question, file, answerGate, finalizer, score, and compact transcript signals.',
        '',
        '## Recommended Repair Order',
        '',
        '1. Runner/provider zero-step guard: classify `runner_error fetch failed`, `max_steps_reached` with no chain, and provider billing errors before any scorer submission.',
        '2. Web/PDF evidence chain: upgrade search/fetch/extract into a source-disambiguating evidence tool with date/entity/negative-condition checks and low-confidence stop.',
        '3. Vision artifact pipeline: normalize image args, return structured OCR/visual candidates, and add verifiers for chess boards, long ordered lists, and form/table screenshots.',
        '4. Spreadsheet/map solver: parse full workbook geometry/styles and run deterministic path search instead of accepting direct agent guesses.',
        '5. Media pipeline: use YouTube metadata/transcript/ASR fallback with timestamped evidence and quote-focused finalizer.',
        '6. Direct reasoning fallback: for pure text/logic/instruction tasks, add deterministic short-answer resolver when no tools are needed, while still logging evidence.',
        '7. Final answer verifier: require evidence refs, candidate shape checks, list-length/order checks, and source consistency for high-risk answer classes.',
        '',
        '## Backlog Details'
    ];

    for (const task of analysis.backlogTasks) {
        sections.push(
            '',
            `### ${task.taskId}${task.gaiaTaskId ? ` (${task.gaiaTaskId})` : ''}`,
            '',
            `- Cluster: ${task.root.cluster}`,
            `- Layer: ${task.root.layer}`,
            `- Root cause: ${task.root.rootCause}`,
            `- Generic optimization: ${task.root.optimization}`,
            `- Question: ${task.question}`,
            `- File: ${task.fileName || '(none)'}`,
            `- Submitted: ${task.submitted}`,
            `- Expected: ${task.expected}`,
            `- Status: ${task.status || '(none)'}; rawStatus: ${task.rawStatus || '(none)'}; steps: ${task.stepCount}`,
            `- Tools: ${task.topTools || '(none)'}`,
            markdownStatusReason(
                'Answer gate',
                `${task.answerGate?.source || '(none)'} / ${task.answerGate?.status || '(none)'}`,
                task.answerGate?.reason
            ),
            markdownStatusReason(
                'Finalizer',
                task.finalizer?.status,
                task.finalizer?.reason || task.finalizer?.error
            ),
            `- Artifacts: verdict=\`${task.artifacts.verdictPath}\`; chain=\`${task.artifacts.chainPath || ''}\`; result=\`${task.artifacts.resultPath || ''}\``
        );
        if (task.failedStepSignals.length) {
            sections.push(
                '',
                'Failed/weak step signals:',
                '',
                markdownTable(task.failedStepSignals, [
                    { label: 'Tool', value: 'tool' },
                    { label: 'Status', value: 'status' },
                    { label: 'Error', value: 'error' },
                    { label: 'Preview', value: 'preview' }
                ])
            );
        }
    }

    return `${sections.join('\n')}\n`;
}

async function buildFailureItem({ jobDir, verdictPath, stateBacklogSet }) {
    const iterationDir = path.dirname(verdictPath);
    const verdict = await readJson(verdictPath, {});
    const chainPath = path.join(iterationDir, 'chain.json');
    const taskPath = path.join(iterationDir, 'task.json');
    const chain = await readJson(chainPath, {});
    const task = await readJson(taskPath, {});
    const resultPath = normalizeText(verdict.resultPath) ||
        (await walkFiles(path.join(iterationDir, 'eval-results'), (filePath) => /eval-results[\\/][^\\/]+\.jsonl$/i.test(filePath)))[0] ||
        '';
    const summaryPath = normalizeText(verdict.summaryPath) || '';
    const rows = resultPath ? await readJsonl(resultPath) : [];
    const result = selectFinalRow(rows) || {};
    const summary = summaryPath ? await readJson(summaryPath, null) : null;
    const perTask = scorePerTask({ task, result, summary });
    const transcript = await analyzeTranscriptFiles(iterationDir);
    const gaiaTaskId = normalizeText(verdict.gaiaTaskId || task.gaiaTaskId || chain.resultTaskId || result.task_id);
    const taskId = normalizeText(verdict.taskId || task.taskId || chain.taskId || gaiaTaskId || path.basename(iterationDir));
    const expected = normalizeText(task.expectedAnswer || chain.expectedAnswer || perTask?.final_answer);
    const submitted = normalizeText(result.submitted_answer || chain.submittedAnswer || perTask?.submitted_answer);
    const status = normalizeText(result.status || verdict.status || chain.status);
    const rawStatus = normalizeText(result.raw_status?.status || chain.rawStatus?.status);
    const item = {
        taskId,
        gaiaTaskId,
        offset: task.offset ?? parseOffset(taskId),
        source: normalizeText(task.source || verdict.source || chain.source),
        iterationName: path.basename(iterationDir),
        question: normalizeText(task.question || verdict.question || chain.question || result.question),
        fileName: normalizeText(task.fileName || task.file_name || verdict.fileName || chain.fileName || result.file_name),
        filePath: normalizeText(task.filePath || task.file_path || verdict.filePath || chain.filePath || result.file_path),
        expected,
        submitted,
        status,
        rawStatus,
        stepCount: Number(chain.stepCount || result.step_count) || 0,
        answerGate: result.answer_gate || chain.answerGate || verdict.answerGate || null,
        finalizer: result.finalizer || chain.finalizer || verdict.finalizer || null,
        verdict,
        chain,
        result,
        summary,
        transcript,
        failedStepSignals: collectFailedStepSignals(chain, result),
        artifacts: {
            iterationDir,
            taskPath: fsSync.existsSync(taskPath) ? taskPath : '',
            verdictPath,
            chainPath: fsSync.existsSync(chainPath) ? chainPath : '',
            resultPath,
            summaryPath
        }
    };
    item.root = inferRootCause({ verdict, chain, result, transcript });
    item.backlog = stateBacklogSet.has(taskId);
    return item;
}

async function analyzeAilisGaiaFailures(args = parseArgs()) {
    const state = await readJson(path.join(args.jobDir, 'state.json'), {});
    const progress = await readJson(path.join(args.jobDir, 'progress.json'), {});
    const verdictFiles = await walkFiles(path.join(args.jobDir, 'iterations'), (filePath) => path.basename(filePath) === 'verdict.json');
    const failedVerdictFiles = [];
    for (const verdictPath of verdictFiles) {
        const verdict = await readJson(verdictPath, null);
        if (verdict && !isPassedVerdict(verdict)) {
            failedVerdictFiles.push(verdictPath);
        }
    }
    failedVerdictFiles.sort();

    const backlogIds = new Set((Array.isArray(state.repairBacklog) ? state.repairBacklog : []).map((item) => normalizeText(item.taskId)).filter(Boolean));
    const failedItems = [];
    for (const verdictPath of failedVerdictFiles) {
        failedItems.push(await buildFailureItem({ jobDir: args.jobDir, verdictPath, stateBacklogSet: backlogIds }));
    }

    const latestByTask = new Map();
    for (const item of failedItems) {
        latestByTask.set(item.taskId, item);
    }
    const backlogTasks = [...latestByTask.values()]
        .filter((item) => backlogIds.has(item.taskId))
        .sort((a, b) => (a.offset ?? 9999) - (b.offset ?? 9999) || a.taskId.localeCompare(b.taskId))
        .map(summarizeTask);

    const failedIterations = failedItems.map(summarizeTask);
    const clusters = {};
    for (const item of failedItems) {
        const cluster = item.root.cluster;
        clusters[cluster] ||= {
            layer: item.root.layer,
            failedIterationCount: 0,
            backlogCount: 0,
            taskIds: []
        };
        clusters[cluster].failedIterationCount += 1;
        if (backlogIds.has(item.taskId)) {
            clusters[cluster].backlogCount += 1;
        }
        if (!clusters[cluster].taskIds.includes(item.taskId)) {
            clusters[cluster].taskIds.push(item.taskId);
        }
    }

    const completedOfficial = (Array.isArray(state.completedTaskIds) ? state.completedTaskIds : []).filter(isOfficialTaskId);
    const failedOfficial = (Array.isArray(state.failedTaskIds) ? state.failedTaskIds : []).filter(isOfficialTaskId);
    const analysis = {
        generatedAt: new Date().toISOString(),
        jobDir: args.jobDir,
        state: {
            status: normalizeText(state.status),
            repairRequired: state.repairRequired === true,
            iteration: Number(state.iteration) || 0,
            officialCursor: Number(state.officialCursor) || 0,
            stopFlag: fsSync.existsSync(path.join(args.jobDir, 'stop.flag'))
        },
        progress: {
            status: normalizeText(progress.status),
            latestEvidence: normalizeText(progress.latestEvidence),
            nextAction: normalizeText(progress.nextAction)
        },
        score: {
            totalOfficial: 53,
            passedOfficial: completedOfficial.length,
            backlogOfficial: failedOfficial.length,
            attemptedOfficial: completedOfficial.length + failedOfficial.length,
            unattemptedOfficial: Math.max(0, 53 - completedOfficial.length - failedOfficial.length),
            passRateAllKnown: Number((completedOfficial.length / 53).toFixed(4)),
            passRateAttempted: completedOfficial.length + failedOfficial.length
                ? Number((completedOfficial.length / (completedOfficial.length + failedOfficial.length)).toFixed(4))
                : 0
        },
        totals: {
            verdictFiles: verdictFiles.length,
            failedIterations: failedIterations.length,
            uniqueFailedTasks: latestByTask.size,
            backlogTasks: backlogTasks.length,
            transcriptBytes: failedItems.reduce((sum, item) => sum + (Number(item.transcript?.bytes) || 0), 0)
        },
        historicalFailureCategories: safeCountBy(failedItems, (item) => item.verdict.failureCategory),
        inferredRootClusters: safeCountBy(failedItems, (item) => item.root.cluster),
        inferredLayers: safeCountBy(failedItems, (item) => item.root.layer),
        rawStatuses: safeCountBy(failedItems, (item) => item.status || item.rawStatus || item.result.raw_status?.status),
        clusters,
        backlogTasks,
        failedIterations,
        optimizationRoadmap: [
            'Fix zero-step provider/runner guards before any paid rerun.',
            'Upgrade web/PDF retrieval into an evidence-chain system with disambiguation and low-confidence stop.',
            'Add structured artifact pipelines for vision, spreadsheet, media, and code execution.',
            'Make final-answer submission evidence-aware for high-risk answer classes.',
            'Resume only with one canary task per repaired cluster under the existing spend-safety policy.'
        ]
    };

    await fs.mkdir(path.dirname(args.outputJson), { recursive: true });
    await fs.writeFile(args.outputJson, `${JSON.stringify(analysis, null, 2)}\n`, 'utf8');
    await fs.writeFile(args.outputMarkdown, buildMarkdown(analysis), 'utf8');
    return analysis;
}

const isDirectRun = (() => {
    const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
    return Boolean(entryPath && path.resolve(fileURLToPath(import.meta.url)) === entryPath);
})();

if (isDirectRun) {
    analyzeAilisGaiaFailures(parseArgs()).then((analysis) => {
        console.log(JSON.stringify({
            status: 'ok',
            outputJson: path.join(analysis.jobDir, 'failure-analysis.json'),
            outputMarkdown: path.join(analysis.jobDir, 'failure-analysis.md'),
            score: analysis.score,
            totals: analysis.totals,
            inferredRootClusters: analysis.inferredRootClusters
        }, null, 2));
    }).catch((error) => {
        console.error(error?.stack || error?.message || String(error));
        process.exitCode = 1;
    });
}

export {
    analyzeAilisGaiaFailures,
    inferRootCause,
    parseArgs
};
