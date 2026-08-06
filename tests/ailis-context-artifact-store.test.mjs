import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const {
    AILISContextArtifactStore
} = require('../electron/ailis-context-artifact-store.cjs');

test('artifact_query accepts context-owned handles and rejects artifact_tools handles', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-context-artifact-handle-'));
    try {
        const store = new AILISContextArtifactStore({ rootDir: tmpDir });
        const record = await store.createArtifact({
            kind: 'plain_text',
            type: 'plain_text',
            summary: 'handle fixture',
            payload: {
                textArtifact: {
                    text: 'owner-qualified context artifact'
                }
            }
        });

        assert.equal(record.handle.schema, 'ailis.artifact_handle.v1');
        assert.equal(record.handle.owner, 'context_artifact_store');
        assert.equal(record.handle.tool, 'artifact_query');
        assert.equal(record.handle.artifactId, record.id);

        const queried = await store.execute({
            action: 'summary',
            artifactHandle: record.handle
        });
        assert.equal(queried.isError, false);
        assert.match(queried.content[0].text, /owner-qualified context artifact/);

        const wrongOwner = await store.execute({
            action: 'summary',
            artifactHandle: {
                schema: 'ailis.artifact_handle.v1',
                owner: 'artifact_tools',
                tool: 'artifact_tools',
                sessionId: 'arts-demo',
                artifactId: 'art_demo'
            }
        });
        assert.equal(wrongOwner.isError, true);
        assert.equal(wrongOwner.details.code, 'artifact_owner_mismatch');
        assert.equal(wrongOwner.details.requiredTool, 'artifact_tools');
    } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }
});

test('artifact_query reports an unknown context artifact id generically', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-context-artifact-misuse-'));
    try {
        const store = new AILISContextArtifactStore({ rootDir: tmpDir });
        const result = await store.execute({
            action: 'document_search',
            artifactId: 'artifact-f42db6feb5fc',
            query: 'Giftee Recipient'
        });

        assert.equal(result.isError, true);
        assert.equal(result.details.code, 'artifact_not_found');
        assert.equal(Object.hasOwn(result.details, 'evidenceRefMisuse'), false);
        assert.match(result.content[0].text, /No managed context artifact found/);
    } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }
});
