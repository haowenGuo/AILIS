import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootReadmes = ['README.md', 'README.zh-CN.md', 'README.ja.md', 'README.ko.md', 'README.fr.md', 'README.de.md'];
const moduleDocs = ['CONTRIBUTING.md', 'CODEX_MEMORY.md', '.github/pull_request_template.md',
    'deploy/README.md', 'electron/agent-loop/README.md', 'src/rendering/README.md',
    'Resources/Emotes/ailis/README.md', 'Resources/MotionIntake/README.md',
    'sample-asset-packs/ailis-cinematic-skin/README.md', 'evals/screen-understanding/README.md',
    'examples/python_safety_client/README.md', 'manual-tests/benchmark-smoke-20260826/README.md'];

// Validate the maintained manual, not model prompts, Skills, licenses or historical content.
export function verifyDocumentation(root) {
    const errors = [], sources = new Set();
    const files = [];
    function walk(dir) {
        if (!fs.existsSync(path.join(root, dir))) return;
        for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
            const file = `${dir}/${entry.name}`;
            if (entry.isDirectory()) walk(file);
            else if (entry.isFile() && file.endsWith('.md')) files.push(file);
        }
    }
    walk('docs');
    for (const file of [...rootReadmes, ...moduleDocs]) {
        if (fs.existsSync(path.join(root, file))) files.push(file);
        else errors.push(`Missing maintained document: ${file}`);
    }
    if (!files.includes('docs/README.md')) errors.push('Missing manual index: docs/README.md');
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    let links = 0;
    function checkLink(file, target, website = false) {
        let link = target.replace(/^<|>$/g, '').split('#')[0].split('?')[0];
        const githubMain = 'https://github.com/haowenGuo/AILIS/blob/main/';
        let resolved;
        if (link.startsWith(githubMain)) resolved = path.resolve(root, decodeURIComponent(link.slice(githubMain.length)));
        else {
            if (!link || /^[a-z][a-z\d+.-]*:/i.test(link) || link.startsWith('//')) return;
            if (website && !link.replace(/^\.\//, '').startsWith('docs/')) return;
            resolved = path.resolve(root, path.dirname(file), decodeURIComponent(link));
        }
        links++;
        const rel = path.relative(root, resolved);
        if (rel.startsWith('..') || path.isAbsolute(rel)) errors.push(`Outside repository: ${file} -> ${target}`);
        else if (!fs.existsSync(resolved)) errors.push(`Missing link: ${file} -> ${target}`);
        else if (!rel.endsWith('.md')) sources.add(rel.replaceAll('\\', '/'));
    }
    for (const file of files) {
        const raw = fs.readFileSync(path.join(root, file), 'utf8');
        for (const match of raw.matchAll(/\]\(([^)\n]+)\)/g)) checkLink(file, match[1]);
        for (const match of raw.matchAll(/\bpnpm\s+([a-z][a-z\d:_-]+)/g)) {
            if (!['install', 'exec'].includes(match[1]) && !pkg.scripts?.[match[1]])
                errors.push(`Unknown pnpm command: ${file} -> ${match[1]}`);
        }
    }
    for (const file of ['index.html', 'about-ailis.html']) {
        if (!fs.existsSync(path.join(root, file))) continue;
        const raw = fs.readFileSync(path.join(root, file), 'utf8');
        for (const match of raw.matchAll(/(?:href|src)=["']([^"']+)["']/g)) checkLink(file, match[1], true);
    }
    return { documents: files.length, links, sourceFiles: sources.size, errors };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const result = verifyDocumentation(path.resolve(process.argv[2] || fileURLToPath(new URL('..', import.meta.url))));
    console.log(JSON.stringify(result, null, 2));
    if (result.errors.length) process.exitCode = 1;
}
