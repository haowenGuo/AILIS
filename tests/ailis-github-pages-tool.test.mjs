import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { executeGitHubPagesTool, parseGitHubRemote } = require('../electron/ailis-github-pages-tool.cjs');
const execFileAsync = promisify(execFile);

async function gitAvailable() {
    try {
        await execFileAsync('git', ['--version']);
        return true;
    } catch {
        return false;
    }
}

async function runGit(cwd, args) {
    await execFileAsync('git', args, { cwd, windowsHide: true });
}

test('GitHub Pages tool parses common GitHub remotes', () => {
    assert.deepEqual(parseGitHubRemote('git@github.com:haowenGuo/AILIS-Assistant.git'), {
        owner: 'haowenGuo',
        repo: 'AILIS-Assistant',
        remoteUrl: 'git@github.com:haowenGuo/AILIS-Assistant.git'
    });
    assert.deepEqual(parseGitHubRemote('https://github.com/haowenGuo/AILIS-Assistant.git'), {
        owner: 'haowenGuo',
        repo: 'AILIS-Assistant',
        remoteUrl: 'https://github.com/haowenGuo/AILIS-Assistant.git'
    });
});

test('GitHub Pages tool reports dist publish blockers without treating diagnostics as a tool crash', async (t) => {
    if (!(await gitAvailable())) {
        t.skip('git is not available in this test environment');
        return;
    }
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-github-pages-'));
    await runGit(workspaceRoot, ['init']);
    await runGit(workspaceRoot, ['remote', 'add', 'origin', 'https://github.com/example/demo.git']);
    await fs.mkdir(path.join(workspaceRoot, '.github', 'workflows'), { recursive: true });
    await fs.writeFile(path.join(workspaceRoot, 'about-ailis.html'), '<h1>AILIS</h1>\n');
    await fs.writeFile(path.join(workspaceRoot, '.github', 'workflows', 'deploy-pages.yml'), [
        'name: Deploy Pages',
        'on: push',
        'jobs:',
        '  deploy:',
        '    runs-on: ubuntu-latest',
        '    steps:',
        '      - uses: actions/upload-pages-artifact@v3',
        '        with:',
        '          path: ./dist',
        '      - uses: actions/deploy-pages@v4'
    ].join('\n'));

    const result = await executeGitHubPagesTool(
        { action: 'diagnose_publish', targetPath: 'about-ailis.html', skipNetwork: true },
        {},
        { workspaceDir: workspaceRoot, workspaceRoot }
    );

    assert.equal(result.isError, false);
    assert.equal(result.details.status, 'completed');
    assert.equal(result.details.publishReady, false);
    assert.ok(result.details.criticalBlockers.some((entry) => entry.code === 'dist_target_missing'));
    assert.ok(result.details.verificationEvidence.some((entry) => /根目录存在目标文件/.test(entry.label)));
    assert.ok(result.content[0].text.includes('关键阻塞'));
});
