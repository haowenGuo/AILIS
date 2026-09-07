// Offline replay of the existing GAIA runner artifacts. No gateway/model import,
// no dispatch, no edits to answers, gold, accepted state, or frozen snapshots.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { scoreVisibleAnswer, compareGaiaAnswer, cleanAnswerPresentation, SCORE_CONTRACT, GAIA_SCORER_SOURCE } from './gaia-answer-adapter.mjs';

const digest = b => createHash('sha256').update(b).digest('hex');
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const pct = (n, d) => d ? `${(100 * n / d).toFixed(2)}%` : 'N/A';
const cell = s => String(s ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const link = (label, p) => `[${label}](<${p.replace(/\\/g, '/') }>)`;
const q = (xs, f) => xs.length ? [...xs].sort((a, b) => a - b)[Math.max(0, Math.ceil(xs.length * f) - 1)] : null;

function metrics(rows) {
    const durations = rows.map(r => r.durationMs).filter(Number.isFinite);
    const calls = rows.map(r => r.modelCalls).filter(Number.isFinite);
    const known = rows.filter(r => Number.isFinite(r.usage?.promptTokens) && r.usage.promptTokens > 0);
    const cachedKnown = known.filter(r => Number.isFinite(r.usage.cachedTokens));
    const sum = key => known.reduce((s, r) => s + (r.usage[key] ?? 0), 0);
    const input = sum('promptTokens'), cached = cachedKnown.reduce((s, r) => s + r.usage.cachedTokens, 0);
    return { tasks: rows.length, durationSumSeconds: durations.reduce((a, b) => a + b, 0) / 1000,
        meanSeconds: durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length / 1000 : null,
        medianSeconds: q(durations, .5) / 1000, p90Seconds: q(durations, .9) / 1000,
        modelCalls: calls.reduce((a, b) => a + b, 0), medianModelCalls: q(calls, .5), p90ModelCalls: q(calls, .9),
        toolStartedEvents: rows.reduce((s, r) => s + (r.toolStartedEvents ?? 0), 0),
        tokenCoverage: known.length, cacheCoverage: cachedKnown.length, inputTokens: input,
        outputTokens: sum('completionTokens'), reasoningTokens: sum('reasoningTokens'), cachedTokens: cached,
        weightedCacheRate: input && cachedKnown.length === known.length ? cached / input : null,
        estimatedCostUsd: null, costNote: 'No verified billing tariff; historical zero cost fields are not proof of free calls.' };
}

async function finalRecord(p) {
    const bytes = await fs.readFile(p);
    const rows = bytes.toString('utf8').trim().split(/\r?\n/).filter(Boolean).map(s => JSON.parse(s));
    const finals = rows.filter(r => r.record_type === 'final');
    if (finals.length !== 1) throw Error(`Expected exactly one final record: ${p}`);
    return { bytes, row: finals[0], sha256: digest(bytes) };
}

export async function reviewSavedAnswers({ job, reviewFile, spansFile, output, dryRun = false }) {
    job = path.resolve(job);
    const statePath = path.join(job, 'resilient-controller/controller.state.json');
    const stateBytes = await fs.readFile(statePath), state = JSON.parse(stateBytes);
    const reviewBytes = await fs.readFile(reviewFile), review = JSON.parse(reviewBytes);
    const spansBytes = await fs.readFile(spansFile), spans = JSON.parse(spansBytes);
    const originals = new Map(), accepted = state.tasks.filter(t => t.status === 'accepted');
    if (accepted.length !== review.tasks.length) throw Error('Review cohort no longer equals accepted cohort');
    const manual = new Map(spans.entries.map(t => [t.index, t]));
    if (manual.size !== spans.entries.length) throw Error('Duplicate manual indices');
    const tasks = [];
    for (const t of review.tasks) {
        const controllerTask = accepted.find(a => a.taskId === t.taskId && a.index === t.index);
        if (!controllerTask) throw Error(`Not accepted: ${t.taskId}`);
        const acceptanceBytes = await fs.readFile(controllerTask.acceptedPath);
        originals.set(controllerTask.acceptedPath, digest(acceptanceBytes));
        const acceptance = JSON.parse(acceptanceBytes);
        if (path.resolve(acceptance.resultPath) !== path.resolve(t.resultPath)) throw Error('Result path changed');
        const { row: raw, sha256 } = await finalRecord(t.resultPath);
        if (sha256 !== t.resultSha256 || raw.task_id !== t.taskId || raw.final_response !== t.recordedFinalResponse || raw.final_answer !== t.referenceAnswer || raw.question !== t.question) throw Error(`Original evidence drift: ${t.index}`);
        originals.set(t.resultPath, sha256);
        const response = { displayText: raw.final_response, ok: raw.response_ok, status: raw.raw_status };
        const automatic = scoreVisibleAnswer({ response, question: raw.question, gold: raw.final_answer });
        const other = scoreVisibleAnswer({ response, question: raw.question, gold: '__reference_independence_probe__' });
        if (automatic.answer !== other.answer || automatic.submittedAnswer !== other.submittedAnswer || JSON.stringify(automatic.candidates) !== JSON.stringify(other.candidates)) throw Error('Gold influenced extraction');
        let manualSpan = null;
        if (manual.has(t.index)) {
            const m = manual.get(t.index), offset = raw.final_response.indexOf(m.span);
            if (offset < 0 || !cleanAnswerPresentation(m.span).includes(cleanAnswerPresentation(m.answer))) throw Error(`Unverifiable manual span: ${t.index}`);
            manualSpan = { ...m, start: offset, end: offset + m.span.length, resultSha256: sha256 };
            manual.delete(t.index);
        }
        const reviewedAnswer = manualSpan?.answer ?? automatic.submittedAnswer;
        const reviewedMatch = compareGaiaAnswer(cleanAnswerPresentation(reviewedAnswer), cleanAnswerPresentation(raw.final_answer));
        if (t.classification === 'clear_match' && !reviewedMatch) throw Error(`Clear-match review lacks matching evidence: ${t.index}`);
        if (t.classification !== 'clear_match' && automatic.ok) throw Error(`Unexpected automatic positive: ${t.index}`);
        if (t.classification === 'answer_mismatch' && reviewedMatch) throw Error(`Mismatched review unexpectedly passes: ${t.index}`);
        const usage = raw.event_summary?.usage ?? raw.usage;
        const tc = raw.event_summary?.typeCounts || {};
        tasks.push({ index: t.index, taskId: t.taskId, level: t.level, question: raw.question,
            referenceAnswer: raw.final_answer, rawFinalResponse: raw.final_response,
            originalMachinePass: t.originalMachinePass, originalVisibleScore: raw.visible_score,
            automatic, manualSpan, reviewedAnswer, reviewedMatch, adjudication: t.classification, reason: t.reason,
            resultPath: t.resultPath, resultSha256: sha256, durationMs: raw.durationMs,
            modelCalls: raw.event_summary?.llmCallCount ?? null, toolStartedEvents: tc['tool.call.started'] ?? tc['tool.call.begin'] ?? (raw.event_summary?.typeCounts ? 0 : null),
            llmDurationMs: raw.event_summary?.llmDurationMs ?? null, usage,
            recordedUsageAgrees: JSON.stringify(raw.usage) === JSON.stringify(raw.event_summary?.usage),
            reportedToolCallCount: raw.event_summary?.toolCallCount ?? null,
            runtimeOk: raw.response_ok, budgetExceeded: Boolean(raw.evaluation_budget_exceeded) });
    }
    if (manual.size) throw Error('Unused manual spans');
    const count = xs => ({ completed: xs.length, originalMachinePass: xs.filter(t => t.originalMachinePass).length,
        automaticPass: xs.filter(t => t.automatic.ok).length, automaticReview: xs.filter(t => t.automatic.needsManualReview).length,
        clearMatches: xs.filter(t => t.adjudication === 'clear_match').length,
        mismatches: xs.filter(t => t.adjudication === 'answer_mismatch').length,
        ambiguous: xs.filter(t => t.adjudication === 'ambiguous').length,
        recoveredFalseNegatives: xs.filter(t => !t.originalMachinePass && t.adjudication === 'clear_match').length,
        manualExtraMatches: xs.filter(t => !t.automatic.ok && t.adjudication === 'clear_match').length });
    const byLevel = ['L1', 'L2', 'L3'].map(level => ({ level,
        fullCohort: state.tasks.filter(t => t.level === level).length,
        ...count(tasks.filter(t => t.level === level)), metrics: metrics(tasks.filter(t => t.level === level)) }));
    // Count each saved final file once, never add its mirrored summary JSON.
    const attempts = [], attemptsRoot = path.join(job, 'resilient-controller/attempts');
    for (const taskDir of await fs.readdir(attemptsRoot, { withFileTypes: true })) {
        if (!taskDir.isDirectory()) continue;
        for (const attemptDir of await fs.readdir(path.join(attemptsRoot, taskDir.name), { withFileTypes: true })) {
            if (!attemptDir.isDirectory() || !/^attempt-\d+$/.test(attemptDir.name)) continue;
            const dir = path.join(attemptsRoot, taskDir.name, attemptDir.name);
            for (const name of await fs.readdir(dir)) {
                if (!/^gaia-unified165-\d+-a\d+-[a-f\d]+\.jsonl$/i.test(name)) continue;
                const p = path.join(dir, name), { row, sha256 } = await finalRecord(p);
                originals.set(p, sha256);
                attempts.push({ resultPath: p, taskId: row.task_id, rawStatus: row.raw_status, durationMs: row.durationMs,
                    toolStartedEvents: row.event_summary?.typeCounts?.['tool.call.started'] ?? row.event_summary?.typeCounts?.['tool.call.begin'] ?? (row.event_summary?.typeCounts ? 0 : null),
                    modelCalls: row.event_summary?.llmCallCount, usage: row.event_summary?.usage ?? row.usage });
            }
        }
    }
    let historical = null;
    const oldAuditPath = path.join(job, 'score-contract-audit-72-20260906.json');
    try {
        const old = await read(oldAuditPath);
        const overlap = old.tasks.map(t => ({ previous: t, current: tasks.find(x => x.taskId === t.id) })).filter(t => t.current);
        historical = { scope: '72 matched IDs from existing audit; old machine labels not re-adjudicated',
            source: old.oldSource, currentSource: old.newSource, sameTasks: overlap.length,
            oldMachinePass: overlap.filter(t => t.previous.old).length,
            currentOriginalMachinePass: overlap.filter(t => t.current.originalMachinePass).length,
            currentAutomaticPass: overlap.filter(t => t.current.automatic.ok).length,
            currentClearMatches: overlap.filter(t => t.current.adjudication === 'clear_match').length,
            sourcePath: oldAuditPath };
    } catch (e) { if (e.code !== 'ENOENT') throw e; }
    const report = { schema: 'ailis.gaia.saved_answer_replay.v2', createdAt: new Date().toISOString(), contract: SCORE_CONTRACT,
        comparatorSource: GAIA_SCORER_SOURCE, job, protocol: state.protocol, controllerProgress: state.progress,
        method: 'Frozen final responses only. Gold-blind deterministic extraction followed by local public-style comparison. Independent manual spans adjudicate prose. No model calls, no source verification, no official submission.',
        reviewInput: { path: reviewFile, sha256: digest(reviewBytes) }, manualSpansInput: { path: spansFile, sha256: digest(spansBytes) },
        scorerSha256: digest(await fs.readFile(new URL('./gaia-answer-adapter.mjs', import.meta.url))),
        counts: count(tasks), byLevel, metrics: metrics(tasks), allSavedFinalAttempts: metrics(attempts),
        allSavedFinalAttemptCount: attempts.length, historical, tasks, attempts,
        limitations: [
            '79 completed tasks are a non-random subset of 165; 86 interrupted tasks are not scored as capability failures.',
            'Automatic and manually adjudicated results must not be merged and called an automatic score.',
            'Replay uses saved full final_response; structured exact-answer fields absent from historical files cannot be reconstructed.',
            'Manual review checks answer against reference, not correctness of every cited source.',
            'All-attempt usage covers saved final records only; calls lacking a final record or server usage may add unmeasured cost.',
            'toolCallCount counts multiple lifecycle event names; this report uses one started event family, including outer exec and nested tools.',
            'Runtime, instructions, questions, gold, official source snapshots and original score records remain unchanged.'
        ] };
    for (const [p, before] of originals) if (digest(await fs.readFile(p)) !== before) throw Error(`Evidence changed during replay: ${p}`);
    if (digest(await fs.readFile(statePath)) !== digest(stateBytes)) throw Error('Controller changed during replay');
    const lock = await read(path.join(job, 'source-lock.json'));
    for (const f of lock.runtimeFiles) {
        if (digest(await fs.readFile(path.join(job, 'source-snapshot', f.path))) !== f.sha256) throw Error(`Frozen source changed: ${f.path}`);
    }
    report.integrity = { originalFilesChecked: originals.size, allUnchanged: true, originalReviewHashesMatched: tasks.length, goldIndependentReplays: tasks.length, frozenRuntimeFilesVerified: lock.runtimeFiles.length };
    if (!dryRun) {
        await fs.mkdir(output, { recursive: true });
        await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
        await fs.writeFile(path.join(output, 'report.md'), renderReport(report), { flag: 'wx' });
    }
    return report;
}

function renderReport(r) {
    const c = r.counts, m = r.metrics;
    const lines = ['# GAIA 已完成79题：评分修复与离线复核', '', `生成时间：${r.createdAt}`, '',
        '## 结论与口径', '',
        `- 原机器兼容判分：${c.originalMachinePass}/${c.completed}（${pct(c.originalMachinePass,c.completed)}）。`,
        `- 修后纯自动匹配：${c.automaticPass}/${c.completed}（${pct(c.automaticPass,c.completed)}）；其余${c.automaticReview}题送复核，不因提取不确定直接判能力失败。`,
        `- 完整答案逐题复核：${c.clearMatches}明确匹配、${c.mismatches}不符、${c.ambiguous}歧义。按全部79题作保守分母为${pct(c.clearMatches,c.completed)}；另${c.manualExtraMatches}个匹配需要人工选取原文答案片段。`,
        `- 旧评分有${c.recoveredFalseNegatives}个漏判，另#53原通过改为歧义。不是本轮模型能力提升：本轮模型调用为0。`,
        '- 79/165已完成（47.88%），86题中断未决，不计能力0。完成集不是随机抽样，不能把81.01%外推为全量165题成绩，也不是官方榜单成绩。',
        '- 原始结果、原评分、controller和冻结运行代码未改；新评分单独存档。既有评测脚本的评分入口已接新适配器，但未重新派发评测。', '',
        '## 分层', '', '|层级|完成/全量|原机器|修后自动|完整答案明确匹配|不符|歧义|平均秒|中位秒|加权缓存率|', '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|'];
    for (const x of r.byLevel) lines.push(`|${x.level}|${x.completed}/${x.fullCohort}|${x.originalMachinePass}/${x.completed}|${x.automaticPass}/${x.completed}|${x.clearMatches}/${x.completed} (${pct(x.clearMatches,x.completed)})|${x.mismatches}|${x.ambiguous}|${x.metrics.meanSeconds.toFixed(1)}|${x.metrics.medianSeconds.toFixed(1)}|${pct(x.metrics.cachedTokens,x.metrics.inputTokens)}|`);
    lines.push('', '## 运行量（这79题的已接受尝试）', '',
        `- 单题耗时：均值${m.meanSeconds.toFixed(1)}秒，中位${m.medianSeconds.toFixed(1)}秒，P90 ${m.p90Seconds.toFixed(1)}秒。总任务耗时${(m.durationSumSeconds/3600).toFixed(2)}小时是逐题累加，非10并发的墙钟时间。`,
        `- 模型调用${m.modelCalls}次；单题中位${m.medianModelCalls}，P90 ${m.p90ModelCalls}。工具started事件${m.toolStartedEvents}次（包括exec外层和嵌套工具），不使用旧toolCallCount的生命周期重复计数。`,
        `- 输入${m.inputTokens.toLocaleString('en-US')}，输出${m.outputTokens.toLocaleString('en-US')}，缓存输入${m.cachedTokens.toLocaleString('en-US')} Token；cached/input加权缓存率${pct(m.cachedTokens,m.inputTokens)}。usage覆盖${m.tokenCoverage}/${m.tasks}。`,
        `- 所有已保存最终记录共${r.allSavedFinalAttemptCount}个（包含失败尝试）：输入${r.allSavedFinalAttempts.inputTokens.toLocaleString('en-US')}，输出${r.allSavedFinalAttempts.outputTokens.toLocaleString('en-US')}，缓存率${pct(r.allSavedFinalAttempts.cachedTokens,r.allSavedFinalAttempts.inputTokens)}，usage覆盖${r.allSavedFinalAttempts.tokenCoverage}/${r.allSavedFinalAttemptCount}。不保证覆盖没有最终文件或未返回usage的请求。`,
        '- 金额未知：历史estimatedCostUsd=0来自未配置费率，不能当作实际免费。', '',
        '## 修复内容', '',
        '1. 从既有runner接入独立评分适配器：提取阶段只接收完整答复与题目，不接收gold；返回带证据的单一选择或复核状态。',
        '2. 去掉240字符候选截断、320字符整段门槛、从长文取第一个数字、contains-gold和列表子集兜底。',
        '3. 支持明确Answer/结论、完整代码输出块、平衡括号boxed公式、短答案段、明确数量、排版符号。列表保留顺序/重复/长度，数值不新增容差。',
        '4. 保存完整final_response、实际submitted_answer、score_contract和score_valid；不确定提取从自动失败中分开。',
        `5. 比较逻辑参照${link('GAIA公开评分器', r.comparatorSource)}；LaTeX/引号/数量片段/题面单位适配额外记录，不能宣称与未经适配的官方提交完全相同。`, '',
        '## 具体漏判与仍需人工的情况', '',
        '|编号|参考答案|模型实际表达|原来问题|修后处理|', '|---|---|---|---|---|',
        '|#3|0.1777|0.1777 m³|后文半径、高度、网址数字干扰|提取首句明确量值|',
        '|#42|519|519 at-bats|旧逻辑拿到前面的1977|提取唯一明确答案高亮|',
        '|#77|3|Answer: 3|把ISBN-10和完整ISBN一起混入|只取明确答案字段|',
        '|#34/#99/#102|0/2/39|代码块/boxed公式|候选未识别或只取到公式起始符|结构化提取并验证|',
        '|#53|egalitarian|Egalitarianism，后文提egalitarian|全文包含gold便通过|不再自动通过；人工歧义|',
        '|#60|1.456|最终1.46 Å，中间1.456423|题面舍入与gold精度冲突|不放宽容差、不取中间量；人工歧义|',
        '|#83|Finance|店铺名+“type is Finance”|纯排版提取可能抓错实体|人工选择type列原文，非自动通过|',
        '|#155|3|主口径3，另一个条件口径2|存在两种口径，规则不猜|人工确认主口径，非自动通过|', '',
        '## 13题实际不符', '', '|编号|层级|实际答案|参考答案|观察到的差异（不等于已证明根因）|', '|---|---|---|---|---|');
    for (const t of r.tasks.filter(t => t.adjudication === 'answer_mismatch')) lines.push(`|#${t.index}|${t.level}|${cell(t.reviewedAnswer)}|${cell(t.referenceAnswer)}|${cell(t.reason)}|`);
    lines.push('', '仅从最终答案可确定：#21输出列表不完整，#92漏把9个decades换为90岁，#101未逐字保留密文解码结果，#116回答按正面朝向而未处理后院遮阳方向。其他检索、计数和金额错误仍需执行轨迹才能定位到工具或模型步骤，不能统称网络问题。', '',
        'L1明确匹配34/37；L2为25/35且含2题歧义；L3为5/7但仅覆盖26道L3中的7道。当前主要剩余问题是题意约束、计数/单位转换、原文忠实性和资料口径，不是所有失败都能靠评分器修成正确。', '',
        '## 历史同题参照', '');
    if (r.historical) lines.push(`既有可核验${r.historical.sameTasks}个相同ID：旧A6机器${r.historical.oldMachinePass}/72，当前原机器${r.historical.currentOriginalMachinePass}/72，当前修后自动${r.historical.currentAutomaticPass}/72，当前完整答案复核${r.historical.currentClearMatches}/72。旧侧没有按本次流程完整重判，因此不能以59对53直接宣称能力提升。旧medium/600s/4并发与当前max/3000s/10并发也不同。见${link('旧72题审计', r.historical.sourcePath)}。`);
    lines.push('', '## 79题逐题表', '', '编号沿用原始0起始index，故不连续。自动未匹配均显示待复核；“复核通过”不冒充自动通过。', '',
        '|编号|层级|旧机器|修后自动|逐题复核|实际答案|参考答案|耗时秒|模型轮次|工具started|缓存率|', '|---|---|---|---|---|---|---|---:|---:|---:|---:|');
    for (const t of r.tasks) lines.push(`|#${t.index}|${t.level}|${t.originalMachinePass?'通过':'未通过'}|${t.automatic.ok?'通过':'待复核'}|${t.adjudication==='clear_match'?'通过':t.adjudication==='ambiguous'?'歧义':'不符'}|${cell(t.reviewedAnswer)}|${cell(t.referenceAnswer)}|${(t.durationMs/1000).toFixed(1)}|${t.modelCalls}|${t.toolStartedEvents}|${pct(t.usage?.cachedTokens,t.usage?.promptTokens)}|`);
    lines.push('', '## 完整题目、原始答案与提取证据', '');
    for (const t of r.tasks) lines.push(`### #${t.index} · ${t.level} · ${t.taskId}`, '', '**题目**', '', t.question, '', '**原始最终答复（逐字保留）**', '', ...t.rawFinalResponse.split(/\r?\n/).map(l=>`> ${l}`), '', `参考答案：${cell(t.referenceAnswer)}`, '', `自动提取：${cell(t.automatic.answer) || '无确定片段'}；比较值：${cell(t.automatic.submittedAnswer)}；来源：${t.automatic.source || '待人工提取'}。`, '', t.manualSpan ? `人工片段：[${t.manualSpan.start}, ${t.manualSpan.end})，${cell(t.manualSpan.span)}。说明：${t.manualSpan.reason}` : '无人工替换自动提取片段。', '', `复核：${t.adjudication}。${t.reason}`, '', `${link('原始结果',t.resultPath)}；SHA256：${t.resultSha256}`, '');
    lines.push('## 完整性与边界', '', `校验${r.integrity.originalFilesChecked}个原文件未变，${r.integrity.frozenRuntimeFilesVerified}个冻结运行文件与source-lock完全一致；79个旧复核哈希全部一致；79次更换gold重放均不影响提取或submitted_answer。`, '', ...r.limitations.map(s=>`- ${s}`), '');
    return lines.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
    const args = process.argv.slice(2), option = name => args[args.indexOf(name) + 1];
    for (const flag of ['--job', '--review', '--spans', '--output']) if (!args.includes(flag) || option(flag).startsWith('--')) throw Error(`Required ${flag}`);
    const report = await reviewSavedAnswers({ job: option('--job'), reviewFile: option('--review'), spansFile: option('--spans'), output: option('--output'), dryRun: args.includes('--dry-run') });
    console.log(JSON.stringify({ counts: report.counts, byLevel: report.byLevel, metrics: report.metrics, allSavedFinalAttempts: report.allSavedFinalAttempts, integrity: report.integrity }, null, 2));
}
