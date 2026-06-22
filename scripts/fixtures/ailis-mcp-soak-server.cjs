const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin });

function send(id, payload) {
    process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id, ...payload })}\n`);
}

function ok(id, result) {
    send(id, { result });
}

function error(id, code, message) {
    send(id, { error: { code, message } });
}

function tools() {
    return [
        {
            name: 'echo',
            description: 'Echo input text for MCP soak tests',
            inputSchema: {
                type: 'object',
                required: ['text'],
                properties: {
                    text: { type: 'string', minLength: 1 }
                },
                additionalProperties: false
            }
        },
        {
            name: 'slow_wait',
            description: 'Wait before returning, used to verify timeout handling',
            inputSchema: {
                type: 'object',
                required: ['delayMs'],
                properties: {
                    delayMs: { type: 'number', minimum: 1, maximum: 10000 }
                },
                additionalProperties: false
            }
        },
        {
            name: 'fail_tool',
            description: 'Return an MCP tool-level failure result',
            inputSchema: {
                type: 'object',
                properties: {
                    reason: { type: 'string' }
                },
                additionalProperties: true
            }
        }
    ];
}

rl.on('line', (line) => {
    let request = null;
    try {
        request = JSON.parse(line);
    } catch {
        return;
    }
    if (!request.id) {
        return;
    }

    if (request.method === 'initialize') {
        ok(request.id, {
            protocolVersion: '2025-06-18',
            capabilities: { tools: {}, resources: {}, prompts: {} },
            serverInfo: { name: 'ailis-mcp-soak-stdio', version: '1.0.0' }
        });
        return;
    }
    if (request.method === 'tools/list') {
        ok(request.id, { tools: tools() });
        return;
    }
    if (request.method === 'tools/call') {
        const name = request.params?.name;
        const args = request.params?.arguments || {};
        if (name === 'echo') {
            ok(request.id, {
                content: [{ type: 'text', text: `stdio:${args.text}` }],
                details: { echoed: args.text }
            });
            return;
        }
        if (name === 'slow_wait') {
            setTimeout(() => {
                ok(request.id, {
                    content: [{ type: 'text', text: `waited:${args.delayMs}` }]
                });
            }, Number(args.delayMs || 1));
            return;
        }
        if (name === 'fail_tool') {
            ok(request.id, {
                isError: true,
                content: [{ type: 'text', text: `failed:${args.reason || 'fixture'}` }]
            });
            return;
        }
        error(request.id, -32602, `unknown tool: ${name}`);
        return;
    }
    if (request.method === 'resources/list') {
        ok(request.id, {
            resources: [
                {
                    uri: 'soak://stdio-note',
                    name: 'stdio note',
                    mimeType: 'text/plain'
                }
            ]
        });
        return;
    }
    if (request.method === 'resources/templates/list') {
        ok(request.id, {
            resourceTemplates: [
                {
                    uriTemplate: 'soak://stdio/{name}',
                    name: 'stdio template',
                    mimeType: 'text/plain'
                }
            ]
        });
        return;
    }
    if (request.method === 'resources/read') {
        ok(request.id, {
            contents: [
                {
                    uri: request.params?.uri || 'soak://stdio-note',
                    mimeType: 'text/plain',
                    text: 'stdio resource body for AILIS MCP soak'
                }
            ]
        });
        return;
    }
    if (request.method === 'prompts/list') {
        ok(request.id, {
            prompts: [
                {
                    name: 'diagnose',
                    description: 'Diagnose MCP soak state'
                }
            ]
        });
        return;
    }
    if (request.method === 'prompts/get') {
        ok(request.id, {
            messages: [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `stdio prompt:${request.params?.name || ''}`
                    }
                }
            ]
        });
        return;
    }
    error(request.id, -32601, `unknown method: ${request.method}`);
});
