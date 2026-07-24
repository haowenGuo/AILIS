import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { executeArtifactVerifierTool } = require('../electron/ailis-artifact-verifier-tool.cjs');

async function verifyMarkdownFile(filePath, extraArgs = {}) {
    const result = await executeArtifactVerifierTool(
        {
            action: 'verify',
            path: filePath,
            format: 'markdown',
            ...extraArgs
        },
        {},
        { workspaceDir: path.dirname(filePath) }
    );
    return JSON.parse(result.content[0].text);
}

test('artifact_verifier paper_card.v1 rejects incomplete paper cards', async () => {
    const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'ailis-paper-card-'));
    const filePath = path.join(dir, 'paper-card.md');
    await fsp.writeFile(filePath, [
        '# Attention Is All You Need',
        '',
        '## 基本信息',
        '来自 arXiv 页面。',
        '',
        '## 核心摘要',
        '这篇论文提出了 Transformer。'
    ].join('\n'), 'utf8');

    const details = await verifyMarkdownFile(filePath, { contract: 'paper_card.v1' });

    assert.equal(details.ok, false);
    assert.equal(details.status, 'failed');
    assert.equal(details.checks.find((check) => check.id === 'paper_card:limitations')?.ok, false);
    assert.equal(details.checks.find((check) => check.id === 'paper_card:reading_recommendation')?.ok, false);
});

test('artifact_verifier paper_card.v1 accepts complete paper cards with provenance', async () => {
    const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'ailis-paper-card-'));
    const filePath = path.join(dir, 'paper-card.md');
    await fsp.writeFile(filePath, [
        '# Attention Is All You Need',
        '',
        '## 研究问题',
        '来源：arXiv 论文页面和 PDF。论文讨论序列建模中的长距离依赖和并行化问题。',
        '',
        '## 核心方法',
        '来自 PDF 正文：使用自注意力和前馈网络构成 Transformer。',
        '',
        '## 关键贡献',
        '来自论文页面摘要和 PDF：移除循环结构，提升并行训练效率。',
        '',
        '## 局限性',
        '来自 PDF 讨论：需要结合原文实验范围理解，不直接外推到所有任务。',
        '',
        '## 是否值得深入读',
        '值得。来源说明：上述判断分别来自 arXiv 页面、论文页面摘要和 PDF 正文。'
    ].join('\n'), 'utf8');

    const details = await verifyMarkdownFile(filePath, { contract: 'paper_card.v1' });

    assert.equal(details.ok, true);
    assert.equal(details.status, 'completed');
    assert.ok(details.checks.some((check) => check.id === 'paper_card:provenance' && check.ok));
});
