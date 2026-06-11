import fs from 'node:fs/promises';
import path from 'node:path';

function parseArgs(argv) {
    const args = {
        resultDir: 'eval-results/engineering/osworld-aigl-test-small-r4',
        outputDir: ''
    };
    for (let index = 2; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--result-dir') args.resultDir = next();
        else if (token === '--output-dir') args.outputDir = next();
    }
    return args;
}

async function exists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function walk(dir, out = []) {
    if (!await exists(dir)) return out;
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const filePath = path.join(dir, entry.name);
        if (entry.isDirectory()) await walk(filePath, out);
        else out.push(filePath);
    }
    return out;
}

function parseJsonLine(line) {
    try {
        return JSON.parse(line);
    } catch {
        return { parse_error: line };
    }
}

function classify({ score, traj }) {
    const errors = traj.map((item) => String(item.Error || '')).filter(Boolean);
    const actions = traj.map((item) => String(item.action || '')).filter(Boolean);
    if (Number(score) > 0) return 'success';
    if (errors.some((error) => /Setup step .*download|Failed to download/i.test(error))) return 'setup_asset_failed';
    if (errors.some((error) => /outer_task_timeout|exceeded wall-clock timeout/i.test(error))) return 'task_timeout';
    if (actions.length >= 6) {
        const normalized = actions
            .filter((action) => !/^import time; time\.sleep/i.test(action))
            .map((action) => action.replace(/\s+/g, ' ').trim());
        for (let index = 0; index + 3 < normalized.length; index += 1) {
            const window = normalized.slice(index, index + 4);
            if (window.length === 4 && new Set(window).size === 1) {
                return 'repeated_action_loop';
            }
        }
    }
    if (traj.length === 0) return 'no_trajectory';
    return 'wrong_or_incomplete_action';
}

function markdownTable(headers, rows) {
    return [
        `| ${headers.join(' | ')} |`,
        `| ${headers.map(() => '---').join(' | ')} |`,
        ...rows.map((row) => `| ${row.map((cell) => String(cell).replace(/\|/g, '\\|')).join(' | ')} |`)
    ].join('\n');
}

async function main() {
    const args = parseArgs(process.argv);
    const root = path.resolve(args.resultDir);
    const files = (await walk(root)).filter((file) => file.endsWith('result.txt'));
    const rows = [];
    for (const resultPath of files) {
        const scoreText = (await fs.readFile(resultPath, 'utf8')).trim();
        const score = Number(scoreText || 0);
        const exampleDir = path.dirname(resultPath);
        const example = path.basename(exampleDir);
        const domain = path.basename(path.dirname(exampleDir));
        const trajPath = path.join(exampleDir, 'traj.jsonl');
        const traj = await exists(trajPath)
            ? (await fs.readFile(trajPath, 'utf8')).split(/\r?\n/).filter(Boolean).map(parseJsonLine)
            : [];
        rows.push({
            domain,
            example,
            score,
            steps: traj.length,
            class: classify({ score, traj })
        });
    }
    rows.sort((a, b) => a.domain.localeCompare(b.domain) || a.example.localeCompare(b.example));
    const byClass = new Map();
    const byDomain = new Map();
    for (const row of rows) {
        byClass.set(row.class, (byClass.get(row.class) || 0) + 1);
        const current = byDomain.get(row.domain) || { count: 0, score: 0 };
        current.count += 1;
        current.score += row.score;
        byDomain.set(row.domain, current);
    }
    const summary = {
        resultDir: root,
        completed: rows.length,
        averageScore: rows.length ? rows.reduce((sum, row) => sum + row.score, 0) / rows.length : 0,
        byClass: Object.fromEntries([...byClass.entries()].sort()),
        byDomain: Object.fromEntries([...byDomain.entries()].sort().map(([domain, value]) => [
            domain,
            { count: value.count, averageScore: value.count ? value.score / value.count : 0 }
        ])),
        rows
    };
    const outputDir = path.resolve(args.outputDir || root);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, 'aigl-osworld-analysis.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    const md = [
        '# AIGL OSWorld Analysis',
        '',
        `Completed: ${summary.completed}`,
        `Average score: ${summary.averageScore.toFixed(4)}`,
        '',
        '## Failure Classes',
        '',
        markdownTable(['Class', 'Count'], Object.entries(summary.byClass)),
        '',
        '## Domains',
        '',
        markdownTable(['Domain', 'Count', 'Average'], Object.entries(summary.byDomain).map(([domain, value]) => [
            domain,
            value.count,
            value.averageScore.toFixed(4)
        ])),
        '',
        '## Tasks',
        '',
        markdownTable(['Domain', 'Example', 'Score', 'Steps', 'Class'], rows.map((row) => [
            row.domain,
            row.example,
            row.score,
            row.steps,
            row.class
        ])),
        ''
    ].join('\n');
    await fs.writeFile(path.join(outputDir, 'aigl-osworld-analysis.md'), md, 'utf8');
    console.log(JSON.stringify({
        ok: true,
        completed: summary.completed,
        averageScore: summary.averageScore,
        outputDir
    }, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
