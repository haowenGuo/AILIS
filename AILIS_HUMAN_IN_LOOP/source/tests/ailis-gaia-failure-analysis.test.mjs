import assert from 'node:assert/strict';
import test from 'node:test';

import { inferRootCause } from '../scripts/analyze-ailis-gaia-failures.mjs';

test('GAIA failure analysis classifies zero-step provider transport failures', () => {
    const root = inferRootCause({
        chain: { stepCount: 0 },
        result: {
            status: 'runner_error',
            raw_status: { status: 'runner_error', error: 'fetch failed' }
        }
    });

    assert.equal(root.cluster, 'RUNNER_PROVIDER_TRANSPORT_ZERO_STEP');
    assert.equal(root.layer, 'HARNESS/ENV');
});

test('GAIA failure analysis classifies web loop missing evidence failures', () => {
    const root = inferRootCause({
        verdict: { summary: 'tool_loop_guard stopped repeated web fetches' },
        chain: { toolCounts: { mcp__ailis_research__web_search: 2, mcp__ailis_research__web_fetch: 3 } },
        result: { status: 'missing_evidence' }
    });

    assert.equal(root.cluster, 'WEB_RETRIEVAL_LOOP_MISSING_EVIDENCE');
    assert.equal(root.layer, 'TOOLS/MCP');
});

test('GAIA failure analysis keeps media failures from being hidden by web fallback', () => {
    const root = inferRootCause({
        chain: {
            toolCounts: {
                mcp__ailis_research__web_search: 4,
                mcp__ailis_research__youtube_transcript: 1
            }
        },
        result: {
            submitted_answer: 'wrong quote',
            score: { per_task: [{ final_answer: 'right quote' }] }
        }
    });

    assert.equal(root.cluster, 'MEDIA_VIDEO_AUDIO_EVIDENCE');
    assert.equal(root.layer, 'TOOLS/MCP');
});

test('GAIA failure analysis does not let generic artifact compute hide web evidence failures', () => {
    const root = inferRootCause({
        chain: {
            toolCounts: {
                artifact_compute: 1,
                mcp__ailis_research__paper_metadata_lookup: 1,
                mcp__ailis_research__web_fetch: 1
            }
        },
        result: {
            submitted_answer: 'wrong compound',
            score: { per_task: [{ final_answer: 'right compound' }] }
        }
    });

    assert.equal(root.cluster, 'WEB_OR_PDF_SOURCE_DISAMBIGUATION');
    assert.equal(root.layer, 'TOOLS/MCP');
});

test('GAIA failure analysis classifies vision and spreadsheet tool failures', () => {
    const vision = inferRootCause({
        chain: { toolCounts: { mcp__ailis_research__describe_image: 1 } }
    });
    const spreadsheet = inferRootCause({
        chain: { toolCounts: { mcp__ailis_research__read_spreadsheet: 1, artifact_compute: 1 } }
    });

    assert.equal(vision.cluster, 'VISION_EXTRACTION_AND_REASONING');
    assert.equal(spreadsheet.cluster, 'SPREADSHEET_STRUCTURED_REASONING');
});
