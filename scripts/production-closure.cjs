'use strict';

// Build-time only. No application modules are executed while collecting evidence.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const parser = require('@babel/parser');
const ROOT = path.resolve(__dirname, '..');
const JS = /\.(?:cjs|mjs|js|jsx)$/;
const SOURCE = /\.(?:cjs|mjs|js|jsx|py|html|css|sh|ps1|nsh)$/;

function readManifest(root = ROOT) {
    return JSON.parse(fs.readFileSync(path.join(root, 'runtime/production-entrypoints.json'), 'utf8'));
}

function trackedFiles(root) {
    return [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
        { cwd: root, encoding: 'utf8', windowsHide: true }).split('\0').filter(Boolean))]
        .filter(file => fs.existsSync(path.join(root, file)) && fs.statSync(path.join(root, file)).isFile()).sort();
}

function walk(node, visit) {
    if (!node || typeof node !== 'object') return;
    if (node.type) visit(node);
    for (const [key, value] of Object.entries(node)) {
        if (['loc', 'start', 'end', 'extra', 'comments', 'tokens', 'errors'].includes(key)) continue;
        if (Array.isArray(value)) value.forEach(child => walk(child, visit));
        else if (value && typeof value === 'object') walk(value, visit);
    }
}

function audit({ root = ROOT, profile = 'desktop', manifest = readManifest(root), files = trackedFiles(root) } = {}) {
    const product = manifest.profiles[profile];
    if (!product) throw new Error(`Unknown product profile: ${profile}`);
    const known = new Set(files), edges = new Map(), dynamicLoads = [], errors = [], packages = new Set();
    const roots = [...product.entries, ...Object.values(product.pages)];
    const add = (from, to, reason) => {
        if (!known.has(to)) { errors.push({ from, to, reason: `missing declared/local file: ${reason}` }); return; }
        const rows = edges.get(from) || [];
        if (!rows.some(edge => edge.to === to)) rows.push({ to, reason });
        edges.set(from, rows);
    };
    const resolve = (from, spec) => {
        const base = spec.startsWith('/') ? spec.slice(1) : path.posix.join(path.posix.dirname(from), spec);
        const name = path.posix.normalize(base.split(/[?#]/)[0]);
        return [name, ...['.js', '.cjs', '.mjs', '.json', '/index.js', '/index.cjs', '/index.mjs'].map(ext => name + ext)]
            .find(file => known.has(file));
    };
    const local = (from, spec, reason) => {
        if (/^(?:https?:|data:|node:)/.test(spec)) return;
        if (!spec.startsWith('.') && !spec.startsWith('/')) { packages.add(spec.split('/').slice(0, spec.startsWith('@') ? 2 : 1).join('/')); return; }
        const to = resolve(from, spec);
        if (to) add(from, to, reason);
        else errors.push({ from, to: spec, reason: `unresolved ${reason}` });
    };
    // Explicit process, Python importlib, config and filesystem-resource boundaries.
    for (const edge of manifest.edges) {
        for (const to of edge.to || []) add(edge.from, to, edge.reason);
        for (const directory of edge.directories || []) {
            const members = files.filter(file => file.startsWith(directory + '/'));
            if (!members.length) errors.push({ from: edge.from, to: directory, reason: 'empty resource directory' });
            for (const to of members) add(edge.from, to, edge.reason);
        }
    }
    // Traverse only the product, never make every developer script a production root.
    const reached = new Map(), queue = roots.map(file => ({ file, via: null, reason: `${profile} entry` }));
    while (queue.length) {
        const entry = queue.shift(), file = entry.file;
        if (reached.has(file)) continue;
        if (!known.has(file)) { errors.push({ from: null, to: file, reason: 'missing product entry' }); continue; }
        reached.set(file, entry);
        const text = fs.readFileSync(path.join(root, file), 'utf8');
        if (JS.test(file)) {
            try {
                const ast = parser.parse(text, { sourceType: 'unambiguous', plugins: ['jsx'] });
                walk(ast, node => {
                    if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) && node.source)
                        local(file, node.source.value, `${node.type}:${node.loc.start.line}`);
                    const isLoad = node.type === 'CallExpression' && (node.callee?.name === 'require' || node.callee?.type === 'Import' ||
                        (node.callee?.object?.name === 'require' && node.callee?.property?.name === 'resolve'));
                    if (isLoad) {
                        const arg = node.arguments[0];
                        if (arg?.type === 'StringLiteral') local(file, arg.value, `module load:${node.loc.start.line}`);
                        else {
                            const expression = text.slice(node.start, node.end);
                            const reviewed = manifest.externalLoads.find(row => row.from === file && row.expression === expression);
                            dynamicLoads.push({ file, line: node.loc.start.line, expression, reviewed: Boolean(reviewed), reason: reviewed?.reason });
                            if (!reviewed) errors.push({ from: file, reason: `unreviewed dynamic module load:${node.loc.start.line}` });
                        }
                    }
                    // Conservative literal edge: preload/path.join/new URL and CSS imports.
                    // These edges retain potential runtime code; they never prove execution.
                    if (node.type === 'StringLiteral' && /\.(?:cjs|mjs|js|py|css)$/.test(node.value)) {
                        const to = resolve(file, node.value) || (known.has(node.value) ? node.value : null);
                        if (to) add(file, to, `file literal:${node.loc.start.line}`);
                    }
                });
            } catch (error) { errors.push({ from: file, reason: `parse error: ${error.message}` }); }
        } else if (file.endsWith('.html')) {
            for (const match of text.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)=["']([^"']+)["']/g)) {
                if (/\.(?:js|mjs|css)(?:[?#]|$)/.test(match[1]) && !/^https?:/.test(match[1]))
                    local(file, match[1].startsWith('/') ? match[1] : './' + match[1], 'HTML script/style');
            }
        }
        for (const edge of edges.get(file) || []) queue.push({ file: edge.to, via: file, reason: edge.reason });
    }
    const relevantErrors = errors.filter(row => row.from === null || reached.has(row.from));
    const inventory = files.map(file => {
        const evidence = reached.get(file);
        const source = SOURCE.test(file);
        const text = source ? fs.readFileSync(path.join(root, file), 'utf8') : '';
        const lines = text ? text.split('\n').length - (text.endsWith('\n') ? 1 : 0) : 0;
        const category = evidence ? 'product-closure' : /^(tests|Test|scripts|evals|manual-tests|examples)\//.test(file) ? 'development-or-other-profile' :
            /^(docs|\.github)\/|\.(md|txt)$/.test(file) ? 'documentation-or-metadata' : 'outside-profile-review-required';
        return { file, category, source, lines, ...(evidence ? { via: evidence.via, reason: evidence.reason,
            sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex') } : {}) };
    });
    const retained = inventory.filter(row => row.category === 'product-closure');
    return { schemaVersion: 1, profile, roots, errors: relevantErrors, dynamicLoads, packages: [...packages].sort(),
        runtimeRequirements: manifest.runtimeRequirements, files: [...reached.keys()].sort(), inventory,
        summary: { retainedFiles: retained.length, retainedSourceFiles: retained.filter(row => row.source).length,
            retainedSourceLines: retained.reduce((sum, row) => sum + row.lines, 0),
            outsideProfileFiles: inventory.length - retained.length, errors: relevantErrors.length } };
}

function assertValid(report) {
    if (report.errors.length) throw new Error(`Production closure failed:\n${JSON.stringify(report.errors, null, 2)}`);
    return report;
}

function desktopFiles(root = ROOT) {
    const report = assertValid(audit({ root }));
    // Renderers are bundled by Vite. Raw src/HTML are evidence, not duplicate shipping files.
    return report.files.filter(file => !file.startsWith('src/') && !file.endsWith('.html'));
}

function assertDesktopBuild(root = ROOT) {
    for (const page of Object.values(readManifest(root).profiles.desktop.pages)) {
        if (!fs.existsSync(path.join(root, 'dist', page))) throw new Error(`Build desktop first; missing dist/${page}`);
    }
    for (const page of ['Test', 'index.html']) {
        if (fs.existsSync(path.join(root, 'dist', page))) throw new Error(`Non-desktop output dist/${page}; build:desktop is required`);
    }
}

function renderSummary(report) {
    const groups = new Map();
    for (const row of report.inventory.filter(row => row.category === 'product-closure')) {
        const name = row.file.includes('/') ? row.file.split('/')[0] : 'HTML entries';
        const group = groups.get(name) || { files: 0, sourceLines: 0 };
        group.files++; group.sourceLines += row.lines; groups.set(name, group);
    }
    return [`# ${report.profile} 运行依赖清单（自动生成）`, '',
        '由 `pnpm audit:production` 从入口清单、当前代码和显式动态依赖生成。这里只证明潜在依赖，不证明每一行都会执行。不要手工修改本文件。', '',
        '| 范围 | 文件数 | 源码物理行数（含空行/注释） |', '| --- | ---: | ---: |',
        ...[...groups].map(([name, group]) => `| ${name} | ${group.files} | ${group.sourceLines} |`), '',
        `依赖闭包共 ${report.summary.retainedFiles} 个文件，源码 ${report.summary.retainedSourceLines} 行；其中 vendor 为第三方，不能混入第一方代码数。Markdown/JSON 资源计文件、不计源码行。`, '',
        '## 正式入口', '', ...report.roots.map(file => `- \`${file}\``), '',
        '## 外部运行条件与未消除的动态边界', '', ...report.runtimeRequirements.map(value => `- ${value}`), '',
        ...report.dynamicLoads.map(row => `- \`${row.file}:${row.line}\`：${row.reason || '待审核'}`), '',
        '逐文件保留原因、上游引用和 SHA-256 见 `tmp/production-audit/desktop.json`；验证范围与命令见 `docs/production-runtime.md`。', ''].join('\n');
}

function extract(destination, { root = ROOT, report = assertValid(audit({ root })), includeDist = true } = {}) {
    const target = path.resolve(destination);
    // Extraction is always create-new, with no overwrite or cleanup of existing trees.
    if (fs.existsSync(target)) throw new Error(`Refusing to overwrite extraction target: ${target}`);
    assertValid(report);
    if (report.profile !== 'desktop') throw new Error('Extraction currently supports desktop only; other profiles are audit-only');
    if (includeDist) assertDesktopBuild(root);
    fs.mkdirSync(target, { recursive: true });
    const ship = report.files.filter(file => !includeDist || (!file.startsWith('src/') && !file.endsWith('.html')));
    for (const file of ship) {
        const output = path.join(target, file);
        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.copyFileSync(path.join(root, file), output);
    }
    if (includeDist) fs.cpSync(path.join(root, 'dist'), path.join(target, 'dist'), { recursive: true });
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    fs.writeFileSync(path.join(target, 'package.json'), JSON.stringify({ name: pkg.name, version: pkg.version,
        type: pkg.type, main: pkg.main, license: pkg.license, dependencies: pkg.dependencies }, null, 2) + '\n');
    fs.writeFileSync(path.join(target, 'production-evidence.json'), JSON.stringify(report, null, 2) + '\n');
    return { target, copiedFiles: ship.length, includesDist: includeDist, dependenciesInstalled: false };
}

module.exports = { ROOT, readManifest, audit, assertValid, desktopFiles, assertDesktopBuild, renderSummary, extract };
if (require.main === module) {
    const args = process.argv.slice(2);
    const value = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
    const report = assertValid(audit({ profile: value('--profile') || 'desktop' }));
    if (value('--output')) {
        const output = path.resolve(value('--output'));
        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
    }
    if (value('--markdown')) {
        const output = path.resolve(value('--markdown'));
        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.writeFileSync(output, renderSummary(report));
    }
    console.log(JSON.stringify(value('--extract') ? extract(value('--extract'), { report }) : report.summary, null, 2));
}
