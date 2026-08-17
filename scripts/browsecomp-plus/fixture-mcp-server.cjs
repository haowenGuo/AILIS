#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const PROTOCOL_VERSION = '2025-06-18';
const docsPath = path.resolve(
    process.env.BROWSECOMP_PLUS_FIXTURE_DOCS ||
        path.join(__dirname, '..', '..', 'evals', 'browsecomp-plus', 'fixtures', 'documents.jsonl')
);

function loadDocuments(filePath) {
    return fs.readFileSync(filePath, 'utf8')
        .split(/\r?\n/)
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));
}

const documents = loadDocuments(docsPath);
const byId = new Map(documents.map((document) => [String(document.docid), document]));

function tokens(text) {
    return String(text || '').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
}

function search(query, limit = 5) {
    const queryTerms = new Set(tokens(query));
    return documents
        .map((document) => {
            const documentTerms = tokens(`${document.title || ''} ${document.text || ''}`);
            const score = documentTerms.reduce((sum, term) => sum + (queryTerms.has(term) ? 1 : 0), 0);
            return {
                docid: String(document.docid),
                score,
                snippet: String(document.text || '').slice(0, 900)
            };
        })
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score || left.docid.localeCompare(right.docid, 'en', { numeric: true }))
        .slice(0, Math.max(1, Math.min(Number(limit) || 5, 20)));
}

const tools = [
    {
        name: 'search',
        description: 'Searches the fixed BrowseComp-Plus fixture corpus and returns docid, score, and snippet.',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Search query.' },
                k: { type: 'integer', minimum: 1, maximum: 20, default: 5 }
            },
            required: ['query'],
            additionalProperties: false
        }
    },
    {
        name: 'get_document',
        description: 'Returns one full document from the fixed BrowseComp-Plus fixture corpus by docid.',
        inputSchema: {
            type: 'object',
            properties: { docid: { type: 'string' } },
            required: ['docid'],
            additionalProperties: false
        }
    }
];

function toolResult(value, isError = false) {
    return {
        content: [{ type: 'text', text: JSON.stringify(value) }],
        structuredContent: value,
        isError
    };
}

async function handle(request) {
    if (request.method === 'initialize') {
        return {
            id: request.id,
            result: {
                protocolVersion: PROTOCOL_VERSION,
                capabilities: { tools: {} },
                serverInfo: { name: 'browsecomp_plus_fixture', version: '1.0.0' }
            }
        };
    }
    if (request.method === 'tools/list') return { id: request.id, result: { tools } };
    if (request.method === 'tools/call') {
        const name = request.params?.name;
        const args = request.params?.arguments || {};
        if (name === 'search') return { id: request.id, result: toolResult(search(args.query, args.k)) };
        if (name === 'get_document') {
            const document = byId.get(String(args.docid));
            return {
                id: request.id,
                result: document
                    ? toolResult({ docid: String(document.docid), text: document.text })
                    : toolResult({ error: 'document_not_found', docid: String(args.docid) }, true)
            };
        }
        return { id: request.id, error: { code: -32602, message: `Unknown tool: ${name}` } };
    }
    return request.id === undefined
        ? null
        : { id: request.id, error: { code: -32601, message: `Unknown method: ${request.method}` } };
}

const input = readline.createInterface({ input: process.stdin });
input.on('line', async (line) => {
    let request;
    try {
        request = JSON.parse(line);
    } catch {
        return;
    }
    try {
        const response = await handle(request);
        if (response) process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', ...response })}\n`);
    } catch (error) {
        if (request.id !== undefined) {
            process.stdout.write(`${JSON.stringify({
                jsonrpc: '2.0',
                id: request.id,
                error: { code: -32603, message: error?.message || String(error) }
            })}\n`);
        }
    }
});
