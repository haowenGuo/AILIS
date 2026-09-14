// One-shot v1.4.6 publication staging. Never overwrites an old tag or asset.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const repo = 'haowenGuo/AILIS', version = '1.4.6', tag = `v${version}`;
const runId = '34826229829', commit = '8eb3711ae563b7dcd3a7480c65ea5028d7cb96f1';
const targets = ['win32-x64', 'linux-x64', 'darwin-x64', 'darwin-arm64'];
const root = path.resolve('publication-v146'), stage = path.join(root, 'stage');
fs.mkdirSync(root, { recursive: true });
const gh = (...args) => cp.execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 16*1024*1024, windowsHide: true });
const api = endpoint => JSON.parse(gh('api', `repos/${repo}/${endpoint}`));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const save = (name, data) => fs.writeFileSync(path.join(root, name), JSON.stringify(data, null, 2));
async function digest(file, algo = 'sha256', encoding = 'hex') {
    const hash = crypto.createHash(algo);
    for await (const chunk of fs.createReadStream(file)) hash.update(chunk);
    return hash.digest(encoding);
}
function run(command, args) {
    return new Promise((resolve, reject) => {
        const child = cp.spawn(command, args, { stdio: 'inherit', windowsHide: true });
        child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(Error(`${command} exited ${code}`)));
    });
}
async function main() {
    const runInfo = api(`actions/runs/${runId}`);
    assert.equal(runInfo.conclusion, 'success'); assert.equal(runInfo.head_sha, commit);
    const jobs = api(`actions/runs/${runId}/jobs?per_page=100`).jobs;
    for (const target of targets) {
        const found = jobs.filter(j => j.name === `Native package and offline acceptance - ${target}`);
        assert.equal(found.length, 1); assert.equal(found[0].conclusion, 'success');
    }
    const artifacts = api(`actions/runs/${runId}/artifacts?per_page=100`).artifacts;
    const oldState = { main: api('git/ref/heads/main').object.sha,
        v144: api('git/ref/tags/v1.4.4').object.sha, v145: api('git/ref/tags/v1.4.5').object.sha };
    save('remote-before.json', oldState);
    fs.mkdirSync(stage, { recursive: true });
    const summaries = [];
    for (const target of targets) {
        const name = `ailis-v${version}-${target}-${commit}`;
        const found = artifacts.filter(a => a.name === name && !a.expired);
        assert.equal(found.length, 1);
        const dir = path.join(root, 'downloads', target);
        if (!fs.existsSync(path.join(dir, '.download-complete'))) {
            assert.ok(!fs.existsSync(dir), `Partial download exists: ${dir}; inspect before retrying`);
            console.log(`Downloading ${target} (${found[0].size_in_bytes} bytes)`);
            await run('gh', ['run', 'download', runId, '--repo', repo, '--name', name, '--dir', dir]);
            fs.writeFileSync(path.join(dir, '.download-complete'), 'complete');
        }
        const manifestName = `AILIS-Release-${version}-${target}.json`;
        const manifest = read(path.join(dir, manifestName));
        assert.equal(manifest.commit, commit); assert.equal(manifest.version, version);
        assert.equal(`${manifest.platform}-${manifest.arch}`, target);
        assert.ok(manifest.files.some(f => f.file === 'electron/ailis-task-interaction.cjs'));
        assert.ok(manifest.files.some(f => f.file === 'dist/chat.html'));
        const evidence = path.join(dir, 'evidence', target);
        const identity = read(path.join(evidence, 'package-identity.json'));
        assert.equal(identity.success, true); assert.equal(identity.sourceCommit, commit);
        assert.equal(identity.verifiedSourceFiles, manifest.files.length);
        const cold = read(path.join(evidence, 'packaged-cold-runtime.json'));
        assert.equal(cold.code, 0); assert.equal(cold.fail, 0); assert.equal(cold.cancelled, 0); assert.ok(cold.pass >= 22);
        const asr = read(path.join(evidence, 'offline-asr.json'));
        assert.equal(asr.success, true); assert.equal(asr.networkAttempts, 0); assert.equal(asr.fixtures.length, 2);
        if (target === 'win32-x64') {
            const installed = read(path.join(evidence, 'nsis/clean-install-report.json'));
            assert.equal(installed.success, true); assert.ok(installed.checks.every(c => c.ok));
            assert.equal(read(path.join(evidence, 'nsis/installed-source-identity.json')).sourceCommit, commit);
        }
        for (const item of manifest.artifacts) {
            assert.equal(path.basename(item.file), item.file);
            const file = path.join(dir, item.file);
            assert.equal(fs.statSync(file).size, item.bytes); assert.equal(await digest(file), item.sha256, item.file);
            const publishedName = item.file === 'latest-mac.yml' ? `latest-mac-${manifest.arch}.yml` : item.file;
            const dest = path.join(stage, publishedName);
            if (!fs.existsSync(dest)) fs.linkSync(file, dest);
            assert.equal(await digest(dest), item.sha256);
        }
        fs.copyFileSync(path.join(dir, manifestName), path.join(stage, manifestName));
        fs.copyFileSync(path.join(dir, `SHA256SUMS-${target}.txt`), path.join(stage, `SHA256SUMS-${target}.txt`));
        await run('tar', ['-czf', path.join(stage, `AILIS-${version}-acceptance-${target}.tar.gz`), '-C', path.dirname(evidence), target]);
        summaries.push({ target, sourceCommit: commit, coldTests: cold.pass,
            runtimeFiles: identity.verifiedRuntimeFiles, sourceFiles: identity.verifiedSourceFiles,
            warmupMs: asr.warmupMs, fixtures: asr.fixtures.map(f => ({ file: f.file, quality: f.quality })) });
        console.log(`Verified ${target}: all asset hashes, packaged code, cold execution and offline ASR`);
    }
    const x64 = fs.readFileSync(path.join(stage, 'latest-mac-x64.yml'), 'utf8');
    const arm = fs.readFileSync(path.join(stage, 'latest-mac-arm64.yml'), 'utf8');
    const entries = text => text.split('files:\n')[1].split('\npath:')[0];
    fs.writeFileSync(path.join(stage, 'latest-mac.yml'), x64.replace(entries(x64), `${entries(x64)}\n${entries(arm)}`));
    for (const name of ['latest.yml','latest-linux.yml','latest-mac.yml']) {
        for (const block of fs.readFileSync(path.join(stage, name), 'utf8').split('  - url: ').slice(1)) {
            const lines = block.split(/\r?\n/), file = lines[0].trim();
            assert.equal(path.basename(file), file);
            const expected = lines.find(l => l.trim().startsWith('sha512:')).split(': ')[1].trim();
            assert.equal(await digest(path.join(stage, file), 'sha512', 'base64'), expected);
        }
    }
    fs.writeFileSync(path.join(stage, `AILIS-${version}-acceptance-summary.json`), JSON.stringify({ run: runId, commit, platforms: summaries }, null, 2));
    const checksums = [];
    for (const name of fs.readdirSync(stage).filter(n => n !== 'SHA256SUMS.txt').sort()) checksums.push(`${await digest(path.join(stage, name))}  ${name}\n`);
    fs.writeFileSync(path.join(stage, 'SHA256SUMS.txt'), checksums.join(''));
    const expected = {};
    for (const name of fs.readdirSync(stage)) expected[name] = { size: fs.statSync(path.join(stage,name)).size, digest: `sha256:${await digest(path.join(stage,name))}` };
    assert.equal(Object.keys(expected).filter(n => /\.(exe|dmg|zip|deb|tar\.gz|AppImage)$/.test(n) && !n.includes('acceptance')).length, 9);
    save('expected-assets.json', expected);
    save('verified-run.json', { run: runId, commit, jobs, summaries });
    console.log('All four platforms verified. Creating or resuming only the exact v1.4.6 draft.');
    const releases = api('releases?per_page=100');
    let release = releases.find(r => r.tag_name === tag);
    if (!release) {
        await run('gh', ['release','create',tag,'--repo',repo,'--target',commit,'--draft','--title','AILIS v1.4.6 — Task Feedback & Human Correction',
            '--notes-file',path.resolve(__dirname,'../docs/releases/v1.4.6.md')]);
        release = api('releases?per_page=100').find(r => r.tag_name === tag);
    }
    assert.ok(release.draft); assert.equal(release.target_commitish, commit);
    for (const asset of release.assets) assert.deepEqual({ size: asset.size, digest: asset.digest }, expected[asset.name], `Existing asset ${asset.name} differs`);
    for (const name of Object.keys(expected)) {
        if (release.assets.some(a => a.name === name)) continue;
        console.log(`Uploading ${name}`);
        await run('gh', ['release','upload',tag,path.join(stage,name),'--repo',repo]);
    }
    const remote = api(`releases/${release.id}`);
    const actual = Object.fromEntries(remote.assets.map(a => [a.name, { size: a.size, digest: a.digest }]));
    assert.deepEqual(actual, expected); assert.equal(remote.draft, true);
    for (const [key, ref] of [['main','heads/main'],['v144','tags/v1.4.4'],['v145','tags/v1.4.5']]) assert.equal(api(`git/ref/${ref}`).object.sha, oldState[key]);
    save('verified-draft.json', { releaseId: release.id, commit, assets: actual, readyToPublish: true });
    console.log(JSON.stringify({ readyToPublish: true, releaseId: release.id, assets: remote.assets.length }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
