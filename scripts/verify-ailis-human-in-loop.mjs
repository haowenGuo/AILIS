import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const learningRoot = resolve(repositoryRoot, 'AILIS_HUMAN_IN_LOOP');
const snapshotRoot = resolve(learningRoot, 'source');
const manifestPath = resolve(learningRoot, 'generated', 'manifest.json');
const learningPrefix = 'AILIS_HUMAN_IN_LOOP/';

function runGit(args) {
    return execFileSync('git', args, {
        cwd: repositoryRoot,
        encoding: 'utf8',
        maxBuffer: 128 * 1024 * 1024
    });
}

function isAncestorCommit(ancestor, descendant) {
    try {
        execFileSync('git', ['merge-base', '--is-ancestor', ancestor, descendant], {
            cwd: repositoryRoot,
            stdio: 'ignore'
        });
        return true;
    } catch {
        return false;
    }
}

function listTrackedSourceFiles() {
    return runGit(['ls-files', '-z'])
        .split('\0')
        .filter(Boolean)
        .map((path) => path.replaceAll('\\', '/'))
        .filter((path) => !path.startsWith(learningPrefix))
        .sort((left, right) => left.localeCompare(right));
}

function sha256(buffer) {
    return createHash('sha256').update(buffer).digest('hex');
}

async function main() {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const trackedFiles = listTrackedSourceFiles();
    const manifestPaths = manifest.files.map((entry) => entry.path).sort((left, right) => left.localeCompare(right));

    if (JSON.stringify(trackedFiles) !== JSON.stringify(manifestPaths)) {
        throw new Error('Manifest paths do not exactly match the current tracked source file list.');
    }
    const recordedSnapshotCommit = (await readFile(resolve(learningRoot, 'SNAPSHOT_COMMIT'), 'utf8')).trim();
    if (manifest.snapshotCommit !== recordedSnapshotCommit) {
        throw new Error('SNAPSHOT_COMMIT and generated/manifest.json disagree.');
    }
    const currentHead = runGit(['rev-parse', 'HEAD']).trim();
    if (!isAncestorCommit(manifest.snapshotCommit, currentHead)) {
        throw new Error(`Snapshot commit ${manifest.snapshotCommit} is not an ancestor of HEAD ${currentHead}.`);
    }

    let verifiedTextFiles = 0;
    let verifiedBinaryFiles = 0;
    let verifiedLines = 0;
    for (const entry of manifest.files) {
        const originalPath = resolve(repositoryRoot, entry.path);
        const snapshotPath = resolve(snapshotRoot, entry.path);
        const [original, snapshot] = await Promise.all([
            readFile(originalPath),
            readFile(snapshotPath)
        ]);
        if (sha256(original) !== entry.sha256 || sha256(snapshot) !== entry.sha256) {
            throw new Error(`Hash mismatch: ${entry.path}`);
        }
        if (entry.text) {
            const guidePath = resolve(learningRoot, entry.lineGuide);
            await access(guidePath);
            const guideStats = await stat(guidePath);
            if (!guideStats.isFile() || guideStats.size === 0) {
                throw new Error(`Missing line guide: ${entry.path}`);
            }
            verifiedTextFiles += 1;
            verifiedLines += entry.lines;
        } else {
            verifiedBinaryFiles += 1;
        }
    }

    const requiredManualDocuments = [
        'README.md',
        'docs/00-总览与阅读地图.md',
        'docs/01-代码架构书.md',
        'docs/02-运行链路与生命周期.md',
        'docs/03-Memory-Prompt-TaskAgent专册.md',
        'docs/04-工具权限证据与Human-in-the-Loop.md',
        'docs/05-网页桌面Hosted部署手册.md',
        'docs/06-测试调试与修改方法.md',
        'docs/07-术语表与索引.md'
    ];
    for (const documentPath of requiredManualDocuments) {
        await access(resolve(learningRoot, documentPath));
    }

    console.log(JSON.stringify({
        ok: true,
        snapshotCommit: manifest.snapshotCommit,
        files: manifest.fileCount,
        textFiles: verifiedTextFiles,
        binaryFiles: verifiedBinaryFiles,
        textLines: verifiedLines
    }, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
