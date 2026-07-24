import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

import {
    getLoadableMotionFiles,
    listMotionIntakeEntries,
    listMotionIntakeSources,
    validateMotionIntakeEntry
} from '../src/character/motion-intake-catalog.js';
import { listMotionLibrary } from '../src/character/motion-library.js';

const workspaceRoot = resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const args = new Set(process.argv.slice(2));
const jsonMode = args.has('--json');
const verifyMode = args.has('--verify');

function toLocalPath(relativePath) {
    return resolve(workspaceRoot, relativePath);
}

function inspectLocalFile(relativePath) {
    if (!relativePath) {
        return {
            exists: false,
            size: 0
        };
    }
    const localPath = toLocalPath(relativePath);
    if (!existsSync(localPath)) {
        return {
            exists: false,
            size: 0,
            localPath
        };
    }
    const stat = statSync(localPath);
    return {
        exists: true,
        size: stat.size,
        localPath
    };
}

const entries = listMotionIntakeEntries();
const sources = listMotionIntakeSources();
const runtimeMotionIds = new Set(listMotionLibrary().map((motion) => motion.id));
const loadableMotionIds = new Set(getLoadableMotionFiles().map((motion) => motion.name));

const motions = entries.map((entry) => {
    const validation = validateMotionIntakeEntry(entry);
    const file = inspectLocalFile(entry.localPath);
    const runtimeRegistered = runtimeMotionIds.has(entry.id);
    const loadable = loadableMotionIds.has(entry.id);
    return {
        id: entry.id,
        source: entry.source,
        license: entry.license,
        style: entry.style,
        feminineScore: entry.feminineScore,
        clippingRisk: entry.clippingRisk,
        approved: entry.approved,
        reviewStatus: entry.reviewStatus,
        localPath: entry.localPath || '',
        fileExists: file.exists,
        fileSize: file.size,
        loadable,
        runtimeRegistered,
        validation
    };
});

const failures = motions.flatMap((motion) => {
    const issues = [];
    if (!motion.validation.ok) {
        issues.push(`${motion.id}: invalid metadata (${motion.validation.missing.join(', ')})`);
    }
    if (motion.localPath && !motion.fileExists) {
        issues.push(`${motion.id}: missing local file ${motion.localPath}`);
    }
    if (motion.loadable && !motion.runtimeRegistered) {
        issues.push(`${motion.id}: loadable but not registered in motion-library`);
    }
    if (motion.approved && !motion.fileExists) {
        issues.push(`${motion.id}: approved without a local file`);
    }
    if (motion.approved && motion.clippingRisk !== 'low') {
        issues.push(`${motion.id}: approved while clippingRisk=${motion.clippingRisk}`);
    }
    return issues;
});

const report = {
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    sourceCount: sources.length,
    motionCount: motions.length,
    approvedCount: motions.filter((motion) => motion.approved).length,
    candidateCount: motions.filter((motion) => !motion.approved).length,
    failures,
    sources,
    motions
};

if (jsonMode) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
    console.log(`Motion intake sources: ${report.sourceCount}`);
    console.log(`Motion intake motions: ${report.motionCount}`);
    console.log(`Approved stable motions: ${report.approvedCount}`);
    console.log(`Candidate/blocked motions: ${report.candidateCount}`);
    for (const source of sources) {
        console.log(`- source ${source.id}: ${source.downloadStatus} | ${source.license}`);
    }
    for (const motion of motions) {
        const local = motion.localPath ? `${motion.fileExists ? 'ok' : 'missing'} ${motion.localPath}` : 'no local file';
        console.log(`- ${motion.id}: ${motion.approved ? 'approved' : motion.reviewStatus || 'candidate'} | feminine=${motion.feminineScore} | clipping=${motion.clippingRisk} | ${local}`);
    }
    if (failures.length) {
        console.error('\nFailures:');
        for (const failure of failures) {
            console.error(`- ${failure}`);
        }
    }
}

if (verifyMode && failures.length) {
    process.exitCode = 1;
}
