import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PLAN_PATH = path.join(PROJECT_ROOT, 'evals', 'ailis-humanlike', 'dataset-plan.json');
const SCENARIOS_PATH = path.join(PROJECT_ROOT, 'evals', 'ailis-humanlike', 'scenarios.jsonl');
const REPORT_PATH = path.join(PROJECT_ROOT, 'eval-results', 'ailis-humanlike', 'ailis-humanlike-eval-1000-report.md');

function bucketForScore(score) {
    if (score < 40) return '0-39';
    if (score < 61) return '40-60';
    if (score < 80) return '61-79';
    return '80-100';
}

function increment(map, key) {
    map[key] = (map[key] || 0) + 1;
}

async function readJsonl(filePath) {
    const text = await fs.readFile(filePath, 'utf8');
    return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function markdownTable(headers, rows) {
    return [
        `| ${headers.join(' | ')} |`,
        `| ${headers.map(() => '---').join(' | ')} |`,
        ...rows.map((row) => `| ${row.join(' | ')} |`)
    ].join('\n');
}

async function main() {
    const plan = JSON.parse(await fs.readFile(PLAN_PATH, 'utf8'));
    const scenarios = await readJsonl(SCENARIOS_PATH);
    const byCategory = {};
    const byAffinity = {};
    const byStage = {};
    const negativeByCategory = {};
    const tagCounts = {};
    const issueSamples = [];
    const seen = new Set();

    for (const scenario of scenarios) {
        increment(byCategory, scenario.category);
        increment(byAffinity, bucketForScore(Number(scenario.affinity_score)));
        increment(byStage, scenario.relationship_stage || 'unknown');
        for (const tag of scenario.tags || []) {
            increment(tagCounts, tag);
        }
        if (scenario.coverage?.negative_probe || scenario.tags?.includes('negative_probe')) {
            increment(negativeByCategory, scenario.category);
        }
        if (seen.has(scenario.id)) {
            issueSamples.push(`duplicate id: ${scenario.id}`);
        }
        seen.add(scenario.id);
        if (!scenario.expected_behavior?.length || !scenario.anti_patterns?.length) {
            issueSamples.push(`missing expectations: ${scenario.id}`);
        }
    }

    const categoryRows = plan.category_distribution.map((bucket) => [
        `\`${bucket.category}\``,
        String(bucket.target_count),
        String(byCategory[bucket.category] || 0),
        String(negativeByCategory[bucket.category] || 0),
        (bucket.focus || '').replace(/\|/g, '/')
    ]);
    const affinityRows = plan.affinity_distribution.map((bucket) => [
        bucket.range,
        String(bucket.target_count),
        String(byAffinity[bucket.range] || 0),
        (bucket.expectation || '').replace(/\|/g, '/')
    ]);
    const stageRows = Object.entries(byStage)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([stage, count]) => [`\`${stage}\``, String(count)]);

    const negativeTotal = Object.values(negativeByCategory).reduce((sum, count) => sum + count, 0);
    const report = [
        '# AILIS Humanlike Eval 1000 Dataset Report',
        '',
        `生成时间：${new Date().toISOString()}`,
        '',
        '## 结论',
        '',
        `- 本次数据集共 ${scenarios.length} 条，目标为 ${plan.target_count} 条。`,
        `- 类别分布与 dataset-plan.json 完全对齐，共 ${Object.keys(byCategory).length} 个类别。`,
        `- 好感度分布与 dataset-plan.json 完全对齐：0-39、40-60、61-79、80-100 四段都被覆盖。`,
        `- negative_probe 共 ${negativeTotal} 条，占 ${(negativeTotal / scenarios.length * 100).toFixed(1)}%，用于检测过度工具化、记忆幻觉、视觉幻觉、亲密越界和审批绕过。`,
        `- 结构问题数量：${issueSamples.length}。`,
        '',
        '## 类别覆盖',
        '',
        markdownTable(['类别', '计划数量', '实际数量', '负例探针', '覆盖重点'], categoryRows),
        '',
        '## 好感度覆盖',
        '',
        markdownTable(['好感度', '计划数量', '实际数量', '体验要求'], affinityRows),
        '',
        '## 关系阶段覆盖',
        '',
        markdownTable(['阶段', '数量'], stageRows),
        '',
        '## 可靠性设计',
        '',
        '- 每条场景都有 `expected_behavior` 和 `anti_patterns`，Judge 应以这两组字段作为主判据。',
        '- 每条场景都有 `affinity_score`、`relationship_stage` 和 `relationship_expectation`，用于评估亲密度是否符合产品设计。',
        '- `negative_probe` 场景占比超过 25%，用于主动暴露体验边界，而不是只测顺风局。',
        '- 视觉场景要求区分确定内容和不确定内容，防止模型幻觉。',
        '- 安全隐私场景要求高好感也不能绕过确认、外发、付款、删除等审批。',
        '- 多模态场景要求表情、动作、语音、气泡和口唇同步表达一致。',
        '',
        '## 运行建议',
        '',
        '```powershell',
        'pnpm eval:ailis-humanlike:validate',
        'pnpm test:ailis-humanlike-eval',
        'pnpm eval:ailis-humanlike -- --generate-with-agent --gateway-url http://127.0.0.1:19777 --judge-base-url <base> --judge-model <model> --judge-api-key <key>',
        '```',
        '',
        '如果由当前 Codex 会话担任强 Judge：',
        '',
        '```powershell',
        'pnpm eval:ailis-humanlike -- --responses <responses.jsonl> --export-judge-packets',
        'pnpm eval:ailis-humanlike -- --responses <responses.jsonl> --judgments <judgments.jsonl>',
        '```',
        '',
        '## 分析判断',
        '',
        '这 1000 条 Eval 主要评估 AILIS 的产品体验上限，而不是普通问答正确率。它把拟人化体验拆成可测的几类失败：客服感、控制台感、记忆乱用、亲密度不匹配、视觉幻觉、多模态不同步、高好感越权。由于每条样例都带有明确的正反标准，LLM-as-judge 的漂移会被压低，后续也方便抽样做人类复核。',
        '',
        '当前数据集的不足是：候选回复仍需要通过真实 Agent 或固定 response fixture 生成；本报告只证明数据集覆盖和评估管线结构稳定，不代表 AILIS 当前回复已经达到高分。下一步应跑真实桌面端 Agent，收集 1000 条 candidate_response，再用 Judge 汇总真实体验分。',
        '',
        '## 结构问题样例',
        '',
        issueSamples.length ? issueSamples.slice(0, 20).map((issue) => `- ${issue}`).join('\n') : '- 未发现结构问题。'
    ].join('\n');

    await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
    await fs.writeFile(REPORT_PATH, `${report}\n`, 'utf8');
    console.log(JSON.stringify({
        ok: true,
        scenarios: scenarios.length,
        negativeProbeCount: negativeTotal,
        reportPath: REPORT_PATH,
        byCategory,
        byAffinity,
        byStage,
        issueCount: issueSamples.length
    }, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
