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

test('artifact_query explains evidence-ref misuse instead of generic artifact_not_found', async () => {
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
        assert.equal(result.details.evidenceRefMisuse, true);
        assert.match(result.content[0].text, /evidence_ref/);
        assert.match(result.details.recoveryHint, /final_answer\.evidence_refs/);
    } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }
});
