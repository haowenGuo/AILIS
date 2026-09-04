'use strict';

// These producers do not guarantee a bounded aggregate response. This is an
// explicit owner-level inline limit, not a per-field summary of every tool.
// Commands, file/output readers, web viewports and media keep their own limits.
const TOOL_INLINE_BYTES = Object.freeze({
    mcp_bridge: 256 * 1024,
    external_adapter: 256 * 1024,
    // Match count is bounded, but a matched log line can be arbitrarily long.
    output_search: 256 * 1024,
    // A compact text view does not bound full structured inspection payloads.
    artifact_tools: 512 * 1024,
    // Retrieval limits record count, not the size of a persisted result body.
    task_results: 256 * 1024,
    // Local config previews limit lines, not the size of an individual line.
    github_pages: 256 * 1024,
    tool_search: 512 * 1024,
    tool_doctor: 128 * 1024,
    capability_manager: 128 * 1024,
    self_debugger: 128 * 1024,
    self_evolution: 128 * 1024,
    list_agents: 128 * 1024,
    wait_agent: 128 * 1024
});

// Preserve whole media/resource blocks; oversized blocks are archived, never
// sliced into invalid base64. Applies only to the explicitly bounded producers.
const TOOL_INLINE_MEDIA_BYTES = 8 * 1024 * 1024;

function toolInlineByteLimit(toolId = '') {
    // Dynamically supplied MCP tools cannot be assumed to implement pagination.
    if (/^(?:mcp__|mcp:|mcp\.)/.test(toolId)) return TOOL_INLINE_BYTES.mcp_bridge;
    if (toolId.startsWith('external__')) return TOOL_INLINE_BYTES.external_adapter;
    return TOOL_INLINE_BYTES[toolId] ?? null;
}

module.exports = { TOOL_INLINE_BYTES, TOOL_INLINE_MEDIA_BYTES, toolInlineByteLimit };
