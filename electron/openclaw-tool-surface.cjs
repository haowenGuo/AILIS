const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_OPENCLAW_UPSTREAM_ROOT = path.join(
    PROJECT_ROOT,
    'AILISClaw',
    '.refs',
    'openclaw-main'
);

const TOOL_PROFILE_IDS = ['minimal', 'coding', 'messaging', 'full'];

const EXEC_TOOL_DISPLAY_SUMMARY = 'Run one command in the current runtime_environment shell and return stdout, stderr, exitCode, durationMs, and workdir.';
const PROCESS_TOOL_DISPLAY_SUMMARY = 'Inspect/control exec sessions.';
const CRON_TOOL_DISPLAY_SUMMARY = 'Schedule reminders, cron, wake events.';
const SESSIONS_LIST_TOOL_DISPLAY_SUMMARY = 'List visible sessions; filters/previews.';
const SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY = 'Read sanitized session history.';
const SESSIONS_SEND_TOOL_DISPLAY_SUMMARY = 'Message session or configured agent.';
const SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY = 'Spawn subagent or ACP session.';
const SESSION_STATUS_TOOL_DISPLAY_SUMMARY = 'Show session status/model/usage.';
const UPDATE_PLAN_TOOL_DISPLAY_SUMMARY = 'Track short work plan.';

const OPENCLAW_CORE_TOOL_SECTION_ORDER = Object.freeze([
    Object.freeze({ id: 'fs', label: 'Files' }),
    Object.freeze({ id: 'runtime', label: 'Runtime' }),
    Object.freeze({ id: 'web', label: 'Web' }),
    Object.freeze({ id: 'memory', label: 'Memory' }),
    Object.freeze({ id: 'sessions', label: 'Sessions' }),
    Object.freeze({ id: 'ui', label: 'UI' }),
    Object.freeze({ id: 'messaging', label: 'Messaging' }),
    Object.freeze({ id: 'automation', label: 'Automation' }),
    Object.freeze({ id: 'nodes', label: 'Nodes' }),
    Object.freeze({ id: 'agents', label: 'Agents' }),
    Object.freeze({ id: 'media', label: 'Media' })
]);

const OPENCLAW_CORE_TOOL_DEFINITIONS = Object.freeze([
    Object.freeze({
        id: 'read',
        label: 'read',
        description: 'Read file contents',
        sectionId: 'fs',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: false
    }),
    Object.freeze({
        id: 'write',
        label: 'write',
        description: 'Create or overwrite files',
        sectionId: 'fs',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: false
    }),
    Object.freeze({
        id: 'edit',
        label: 'edit',
        description: 'Make precise edits',
        sectionId: 'fs',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: false
    }),
    Object.freeze({
        id: 'apply_patch',
        label: 'apply_patch',
        description: 'Patch files',
        sectionId: 'fs',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: false
    }),
    Object.freeze({
        id: 'exec',
        label: 'exec',
        description: EXEC_TOOL_DISPLAY_SUMMARY,
        sectionId: 'runtime',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: false
    }),
    Object.freeze({
        id: 'process',
        label: 'process',
        description: PROCESS_TOOL_DISPLAY_SUMMARY,
        sectionId: 'runtime',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: false
    }),
    Object.freeze({
        id: 'code_execution',
        label: 'code_execution',
        description: 'Run sandboxed remote analysis',
        sectionId: 'runtime',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'web_search',
        label: 'web_search',
        description: 'Search the web',
        sectionId: 'web',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'web_fetch',
        label: 'web_fetch',
        description: 'Fetch web content',
        sectionId: 'web',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'x_search',
        label: 'x_search',
        description: 'Search X posts',
        sectionId: 'web',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'memory_search',
        label: 'memory_search',
        description: 'Semantic search',
        sectionId: 'memory',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'memory_get',
        label: 'memory_get',
        description: 'Read memory files',
        sectionId: 'memory',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'sessions_list',
        label: 'sessions_list',
        description: SESSIONS_LIST_TOOL_DISPLAY_SUMMARY,
        sectionId: 'sessions',
        profiles: Object.freeze(['coding', 'messaging']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'sessions_history',
        label: 'sessions_history',
        description: SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY,
        sectionId: 'sessions',
        profiles: Object.freeze(['coding', 'messaging']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'sessions_send',
        label: 'sessions_send',
        description: SESSIONS_SEND_TOOL_DISPLAY_SUMMARY,
        sectionId: 'sessions',
        profiles: Object.freeze(['coding', 'messaging']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'sessions_spawn',
        label: 'sessions_spawn',
        description: SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY,
        sectionId: 'sessions',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'sessions_yield',
        label: 'sessions_yield',
        description: 'End turn to receive sub-agent results',
        sectionId: 'sessions',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'subagents',
        label: 'subagents',
        description: 'Manage sub-agents',
        sectionId: 'sessions',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'session_status',
        label: 'session_status',
        description: SESSION_STATUS_TOOL_DISPLAY_SUMMARY,
        sectionId: 'sessions',
        profiles: Object.freeze(['minimal', 'coding', 'messaging']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'browser',
        label: 'browser',
        description: 'Control web browser',
        sectionId: 'ui',
        profiles: Object.freeze([]),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'canvas',
        label: 'canvas',
        description: 'Control node Canvas surfaces when the Canvas plugin is enabled',
        sectionId: 'ui',
        profiles: Object.freeze([]),
        includeInOpenClawGroup: false
    }),
    Object.freeze({
        id: 'message',
        label: 'message',
        description: 'Send messages',
        sectionId: 'messaging',
        profiles: Object.freeze(['messaging']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'heartbeat_respond',
        label: 'heartbeat_respond',
        description: 'Record heartbeat outcomes',
        sectionId: 'automation',
        profiles: Object.freeze([]),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'cron',
        label: 'cron',
        description: CRON_TOOL_DISPLAY_SUMMARY,
        sectionId: 'automation',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'gateway',
        label: 'gateway',
        description: 'Gateway control',
        sectionId: 'automation',
        profiles: Object.freeze([]),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'nodes',
        label: 'nodes',
        description: 'Nodes + devices',
        sectionId: 'nodes',
        profiles: Object.freeze([]),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'agents_list',
        label: 'agents_list',
        description: 'List agents',
        sectionId: 'agents',
        profiles: Object.freeze([]),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'update_plan',
        label: 'update_plan',
        description: UPDATE_PLAN_TOOL_DISPLAY_SUMMARY,
        sectionId: 'agents',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'image',
        label: 'image',
        description: 'Image understanding',
        sectionId: 'media',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'image_generate',
        label: 'image_generate',
        description: 'Image generation',
        sectionId: 'media',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'music_generate',
        label: 'music_generate',
        description: 'Music generation',
        sectionId: 'media',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'video_generate',
        label: 'video_generate',
        description: 'Video generation',
        sectionId: 'media',
        profiles: Object.freeze(['coding']),
        includeInOpenClawGroup: true
    }),
    Object.freeze({
        id: 'tts',
        label: 'tts',
        description: 'Text-to-speech conversion',
        sectionId: 'media',
        profiles: Object.freeze([]),
        includeInOpenClawGroup: true
    })
]);

const OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS = Object.freeze([
    Object.freeze({
        id: 'pdf',
        label: 'pdf',
        description: 'PDF understanding',
        source: 'runtime-optional'
    })
]);

const OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS = Object.freeze([
    Object.freeze({ id: 'conversations_list', label: 'conversations_list' }),
    Object.freeze({ id: 'conversation_get', label: 'conversation_get' }),
    Object.freeze({ id: 'messages_read', label: 'messages_read' }),
    Object.freeze({ id: 'attachments_fetch', label: 'attachments_fetch' }),
    Object.freeze({ id: 'events_poll', label: 'events_poll' }),
    Object.freeze({ id: 'events_wait', label: 'events_wait' }),
    Object.freeze({ id: 'messages_send', label: 'messages_send' }),
    Object.freeze({ id: 'permissions_list_open', label: 'permissions_list_open' }),
    Object.freeze({ id: 'permissions_respond', label: 'permissions_respond' })
]);

function cloneArray(values) {
    return values.map((value) => {
        if (Array.isArray(value)) {
            return cloneArray(value);
        }
        if (value && typeof value === 'object') {
            return { ...value };
        }
        return value;
    });
}

function cloneRecord(record) {
    return Object.fromEntries(
        Object.entries(record).map(([key, value]) => {
            if (Array.isArray(value)) {
                return [key, cloneArray(value)];
            }
            if (value && typeof value === 'object') {
                return [key, { ...value }];
            }
            return [key, value];
        })
    );
}

function listCoreToolIdsForProfile(profileId) {
    return OPENCLAW_CORE_TOOL_DEFINITIONS.filter((tool) => tool.profiles.includes(profileId)).map(
        (tool) => tool.id
    );
}

const OPENCLAW_CORE_TOOL_PROFILES = Object.freeze({
    minimal: Object.freeze({
        allow: Object.freeze(listCoreToolIdsForProfile('minimal'))
    }),
    coding: Object.freeze({
        allow: Object.freeze([...listCoreToolIdsForProfile('coding'), 'bundle-mcp'])
    }),
    messaging: Object.freeze({
        allow: Object.freeze([...listCoreToolIdsForProfile('messaging'), 'bundle-mcp'])
    }),
    full: Object.freeze({
        allow: Object.freeze(['*'])
    })
});

function buildCoreToolGroups() {
    const sectionToolMap = new Map();

    for (const section of OPENCLAW_CORE_TOOL_SECTION_ORDER) {
        sectionToolMap.set(`group:${section.id}`, []);
    }

    const openclawTools = [];
    for (const tool of OPENCLAW_CORE_TOOL_DEFINITIONS) {
        const sectionGroupId = `group:${tool.sectionId}`;
        const sectionTools = sectionToolMap.get(sectionGroupId);
        if (sectionTools) {
            sectionTools.push(tool.id);
        }
        if (tool.includeInOpenClawGroup) {
            openclawTools.push(tool.id);
        }
    }

    return Object.freeze({
        'group:openclaw': Object.freeze(openclawTools),
        ...Object.fromEntries(
            Array.from(sectionToolMap.entries()).map(([groupId, toolIds]) => [
                groupId,
                Object.freeze([...toolIds])
            ])
        )
    });
}

const OPENCLAW_CORE_TOOL_GROUPS = buildCoreToolGroups();

function listCoreToolSections() {
    return OPENCLAW_CORE_TOOL_SECTION_ORDER.map((section) => ({
        id: section.id,
        label: section.label,
        tools: OPENCLAW_CORE_TOOL_DEFINITIONS.filter((tool) => tool.sectionId === section.id).map(
            (tool) => ({
                id: tool.id,
                label: tool.label,
                description: tool.description
            })
        )
    })).filter((section) => section.tools.length > 0);
}

function getOpenClawToolSurface() {
    return {
        source: 'openclaw-mirrored',
        upstreamRoot: DEFAULT_OPENCLAW_UPSTREAM_ROOT,
        sections: listCoreToolSections(),
        coreTools: cloneArray(OPENCLAW_CORE_TOOL_DEFINITIONS),
        optionalRuntimeTools: cloneArray(OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS),
        channelMcpTools: cloneArray(OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS),
        profiles: cloneRecord(OPENCLAW_CORE_TOOL_PROFILES),
        groups: cloneRecord(OPENCLAW_CORE_TOOL_GROUPS)
    };
}

function getOpenClawToolSurfaceSummary() {
    return {
        source: 'openclaw-mirrored',
        coreToolCount: OPENCLAW_CORE_TOOL_DEFINITIONS.length,
        optionalRuntimeToolCount: OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS.length,
        channelMcpToolCount: OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS.length,
        groupIds: Object.keys(OPENCLAW_CORE_TOOL_GROUPS),
        profileIds: [...TOOL_PROFILE_IDS],
        coreToolIds: OPENCLAW_CORE_TOOL_DEFINITIONS.map((tool) => tool.id),
        optionalRuntimeToolIds: OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS.map((tool) => tool.id),
        channelMcpToolIds: OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS.map((tool) => tool.id)
    };
}

function fileExists(targetPath) {
    try {
        return fs.existsSync(targetPath);
    } catch {
        return false;
    }
}

function readTextFile(targetPath) {
    return fs.readFileSync(targetPath, 'utf8');
}

function extractBlock(source, startNeedle, endNeedle) {
    const startIndex = source.indexOf(startNeedle);
    if (startIndex < 0) {
        return '';
    }
    const endIndex = source.indexOf(endNeedle, startIndex);
    if (endIndex < 0) {
        return source.slice(startIndex);
    }
    return source.slice(startIndex, endIndex);
}

function parseQuotedStringArray(rawValue) {
    const values = [];
    const pattern = /"([^"]+)"/g;
    let match = pattern.exec(rawValue);
    while (match) {
        values.push(match[1]);
        match = pattern.exec(rawValue);
    }
    return values;
}

function parseUpstreamSectionOrder(source) {
    const block = extractBlock(
        source,
        'const CORE_TOOL_SECTION_ORDER',
        'const CORE_TOOL_DEFINITIONS'
    );
    const sections = [];
    const pattern = /\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)"\s*\}/g;
    let match = pattern.exec(block);
    while (match) {
        sections.push({ id: match[1], label: match[2] });
        match = pattern.exec(block);
    }
    return sections;
}

function parseUpstreamCoreToolDefinitions(source) {
    const block = extractBlock(source, 'const CORE_TOOL_DEFINITIONS', 'const CORE_TOOL_BY_ID');
    const tools = [];
    const pattern =
        /\{\s*id:\s*"([^"]+)"[\s\S]*?label:\s*"([^"]+)"[\s\S]*?sectionId:\s*"([^"]+)"[\s\S]*?profiles:\s*\[([^\]]*)\][\s\S]*?(includeInOpenClawGroup:\s*true)?[\s\S]*?\}/g;
    let match = pattern.exec(block);
    while (match) {
        tools.push({
            id: match[1],
            label: match[2],
            sectionId: match[3],
            profiles: parseQuotedStringArray(match[4]),
            includeInOpenClawGroup: match[0].includes('includeInOpenClawGroup: true')
        });
        match = pattern.exec(block);
    }
    return tools;
}

function parseUpstreamServerToolNames(source) {
    const toolNames = [];
    const pattern = /server\.tool\(\s*"([^"]+)"/g;
    let match = pattern.exec(source);
    while (match) {
        toolNames.push(match[1]);
        match = pattern.exec(source);
    }
    return toolNames;
}

function parseUpstreamToolNameLiteral(source) {
    const match = source.match(/name:\s*"([^"]+)"/);
    return match ? match[1] : '';
}

function loadUpstreamOpenClawSurface(options = {}) {
    const upstreamRoot =
        typeof options.upstreamRoot === 'string' && options.upstreamRoot.trim()
            ? path.resolve(options.upstreamRoot)
            : DEFAULT_OPENCLAW_UPSTREAM_ROOT;

    const toolCatalogPath = path.join(upstreamRoot, 'src', 'agents', 'tool-catalog.ts');
    const channelToolsPath = path.join(upstreamRoot, 'src', 'mcp', 'channel-tools.ts');
    const pdfToolPath = path.join(upstreamRoot, 'src', 'agents', 'tools', 'pdf-tool.ts');

    if (!fileExists(toolCatalogPath)) {
        return {
            ok: false,
            reason: `missing upstream tool catalog: ${toolCatalogPath}`
        };
    }

    if (!fileExists(channelToolsPath)) {
        return {
            ok: false,
            reason: `missing upstream channel MCP tools: ${channelToolsPath}`
        };
    }

    const toolCatalogSource = readTextFile(toolCatalogPath);
    const channelToolsSource = readTextFile(channelToolsPath);
    const pdfToolSource = fileExists(pdfToolPath) ? readTextFile(pdfToolPath) : '';

    return {
        ok: true,
        upstreamRoot,
        sectionOrder: parseUpstreamSectionOrder(toolCatalogSource),
        coreTools: parseUpstreamCoreToolDefinitions(toolCatalogSource),
        channelMcpToolIds: parseUpstreamServerToolNames(channelToolsSource),
        optionalRuntimeToolIds: pdfToolSource ? [parseUpstreamToolNameLiteral(pdfToolSource)].filter(Boolean) : []
    };
}

function arraysEqual(left, right) {
    if (left.length !== right.length) {
        return false;
    }
    for (let index = 0; index < left.length; index += 1) {
        if (left[index] !== right[index]) {
            return false;
        }
    }
    return true;
}

function createCheck(name, ok, details = undefined) {
    return {
        name,
        ok: Boolean(ok),
        ...(details ? { details } : {})
    };
}

function buildValidationSummary(result) {
    return {
        ok: result.ok,
        issueCount: result.issues.length,
        checkCount: result.checks.length,
        passedChecks: result.checks.filter((check) => check.ok).length,
        coreToolCount: OPENCLAW_CORE_TOOL_DEFINITIONS.length,
        optionalRuntimeToolCount: OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS.length,
        channelMcpToolCount: OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS.length,
        comparedWithUpstream: Boolean(result.upstream && result.upstream.ok)
    };
}

function validateOpenClawToolSurface(options = {}) {
    const issues = [];
    const checks = [];

    const coreToolIds = OPENCLAW_CORE_TOOL_DEFINITIONS.map((tool) => tool.id);
    const uniqueCoreToolIds = new Set(coreToolIds);
    const sectionIds = OPENCLAW_CORE_TOOL_SECTION_ORDER.map((section) => section.id);
    const sectionIdSet = new Set(sectionIds);
    const groupEntries = Object.entries(OPENCLAW_CORE_TOOL_GROUPS);

    if (uniqueCoreToolIds.size !== coreToolIds.length) {
        issues.push('duplicate core tool ids detected');
    }
    checks.push(
        createCheck('core-tools.unique-ids', uniqueCoreToolIds.size === coreToolIds.length, {
            count: coreToolIds.length
        })
    );

    const unknownSectionToolIds = OPENCLAW_CORE_TOOL_DEFINITIONS.filter(
        (tool) => !sectionIdSet.has(tool.sectionId)
    ).map((tool) => tool.id);
    if (unknownSectionToolIds.length > 0) {
        issues.push(`unknown section ids for tools: ${unknownSectionToolIds.join(', ')}`);
    }
    checks.push(
        createCheck('core-tools.known-sections', unknownSectionToolIds.length === 0, {
            unknownSectionToolIds
        })
    );

    const invalidProfileAssignments = OPENCLAW_CORE_TOOL_DEFINITIONS.filter((tool) =>
        tool.profiles.some((profileId) => !TOOL_PROFILE_IDS.includes(profileId))
    ).map((tool) => tool.id);
    if (invalidProfileAssignments.length > 0) {
        issues.push(`invalid profile assignments: ${invalidProfileAssignments.join(', ')}`);
    }
    checks.push(
        createCheck('core-tools.known-profiles', invalidProfileAssignments.length === 0, {
            invalidProfileAssignments
        })
    );

    for (const [profileId, profilePolicy] of Object.entries(OPENCLAW_CORE_TOOL_PROFILES)) {
        if (profileId === 'full') {
            const ok = arraysEqual(profilePolicy.allow || [], ['*']);
            if (!ok) {
                issues.push('profile "full" must allow "*"');
            }
            checks.push(createCheck('profiles.full-allow-all', ok));
            continue;
        }

        const expectedAllow = listCoreToolIdsForProfile(profileId);
        const actualAllow = (profilePolicy.allow || []).filter((toolId) => toolId !== 'bundle-mcp');
        const bundleMcpPresent = (profilePolicy.allow || []).includes('bundle-mcp');
        const ok = arraysEqual(actualAllow, expectedAllow) && bundleMcpPresent === (profileId !== 'minimal');
        if (!ok) {
            issues.push(`profile mismatch for ${profileId}`);
        }
        checks.push(
            createCheck(`profiles.${profileId}`, ok, {
                expectedAllow,
                actualAllow,
                bundleMcpPresent
            })
        );
    }

    const expectedOpenClawGroup = OPENCLAW_CORE_TOOL_DEFINITIONS.filter(
        (tool) => tool.includeInOpenClawGroup
    ).map((tool) => tool.id);
    const actualOpenClawGroup = OPENCLAW_CORE_TOOL_GROUPS['group:openclaw'] || [];
    const openClawGroupOk = arraysEqual(actualOpenClawGroup, expectedOpenClawGroup);
    if (!openClawGroupOk) {
        issues.push('group:openclaw does not match includeInOpenClawGroup tools');
    }
    checks.push(
        createCheck('groups.openclaw', openClawGroupOk, {
            expectedOpenClawGroup,
            actualOpenClawGroup
        })
    );

    const invalidGroupIds = groupEntries
        .filter(([groupId]) => groupId !== 'group:openclaw' && !groupId.startsWith('group:'))
        .map(([groupId]) => groupId);
    if (invalidGroupIds.length > 0) {
        issues.push(`invalid group ids: ${invalidGroupIds.join(', ')}`);
    }
    checks.push(
        createCheck('groups.naming', invalidGroupIds.length === 0, {
            invalidGroupIds
        })
    );

    const optionalRuntimeIds = OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS.map((tool) => tool.id);
    const uniqueOptionalRuntimeIds = new Set(optionalRuntimeIds);
    const optionalOverlap = optionalRuntimeIds.filter((toolId) => uniqueCoreToolIds.has(toolId));
    const optionalRuntimeOk =
        uniqueOptionalRuntimeIds.size === optionalRuntimeIds.length && optionalOverlap.length === 0;
    if (!optionalRuntimeOk) {
        issues.push('optional runtime tool ids overlap with core tools or contain duplicates');
    }
    checks.push(
        createCheck('runtime-optional.unique', optionalRuntimeOk, {
            optionalRuntimeIds,
            optionalOverlap
        })
    );

    const channelMcpToolIds = OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS.map((tool) => tool.id);
    const uniqueChannelMcpToolIds = new Set(channelMcpToolIds);
    const channelMcpOk = uniqueChannelMcpToolIds.size === channelMcpToolIds.length;
    if (!channelMcpOk) {
        issues.push('duplicate channel MCP tool ids detected');
    }
    checks.push(
        createCheck('channel-mcp.unique-ids', channelMcpOk, {
            channelMcpToolIds
        })
    );

    const compareToUpstream = options.compareToUpstream !== false;
    let upstream = null;
    if (compareToUpstream) {
        upstream = loadUpstreamOpenClawSurface(options);
        if (!upstream.ok) {
            checks.push(
                createCheck('upstream.available', false, {
                    reason: upstream.reason
                })
            );
            issues.push(upstream.reason);
        } else {
            checks.push(
                createCheck('upstream.available', true, {
                    upstreamRoot: upstream.upstreamRoot
                })
            );

            const upstreamSectionIds = upstream.sectionOrder.map((section) => section.id);
            const sectionOrderOk = arraysEqual(sectionIds, upstreamSectionIds);
            if (!sectionOrderOk) {
                issues.push('section order differs from upstream OpenClaw');
            }
            checks.push(
                createCheck('upstream.section-order', sectionOrderOk, {
                    local: sectionIds,
                    upstream: upstreamSectionIds
                })
            );

            const upstreamCoreIds = upstream.coreTools.map((tool) => tool.id);
            const coreIdsOk = arraysEqual(coreToolIds, upstreamCoreIds);
            if (!coreIdsOk) {
                issues.push('core tool ids differ from upstream OpenClaw');
            }
            checks.push(
                createCheck('upstream.core-tool-ids', coreIdsOk, {
                    local: coreToolIds,
                    upstream: upstreamCoreIds
                })
            );

            const upstreamById = new Map(upstream.coreTools.map((tool) => [tool.id, tool]));
            const fieldMismatches = [];
            for (const tool of OPENCLAW_CORE_TOOL_DEFINITIONS) {
                const upstreamTool = upstreamById.get(tool.id);
                if (!upstreamTool) {
                    fieldMismatches.push({ toolId: tool.id, reason: 'missing-upstream-tool' });
                    continue;
                }
                if (tool.sectionId !== upstreamTool.sectionId) {
                    fieldMismatches.push({
                        toolId: tool.id,
                        field: 'sectionId',
                        local: tool.sectionId,
                        upstream: upstreamTool.sectionId
                    });
                }
                if (!arraysEqual(tool.profiles, upstreamTool.profiles)) {
                    fieldMismatches.push({
                        toolId: tool.id,
                        field: 'profiles',
                        local: tool.profiles,
                        upstream: upstreamTool.profiles
                    });
                }
                if (Boolean(tool.includeInOpenClawGroup) !== Boolean(upstreamTool.includeInOpenClawGroup)) {
                    fieldMismatches.push({
                        toolId: tool.id,
                        field: 'includeInOpenClawGroup',
                        local: Boolean(tool.includeInOpenClawGroup),
                        upstream: Boolean(upstreamTool.includeInOpenClawGroup)
                    });
                }
            }
            if (fieldMismatches.length > 0) {
                issues.push('core tool metadata differs from upstream OpenClaw');
            }
            checks.push(
                createCheck('upstream.core-tool-metadata', fieldMismatches.length === 0, {
                    fieldMismatches
                })
            );

            const upstreamChannelIds = upstream.channelMcpToolIds;
            const channelIdsOk = arraysEqual(channelMcpToolIds, upstreamChannelIds);
            if (!channelIdsOk) {
                issues.push('channel MCP tool ids differ from upstream OpenClaw');
            }
            checks.push(
                createCheck('upstream.channel-mcp-tool-ids', channelIdsOk, {
                    local: channelMcpToolIds,
                    upstream: upstreamChannelIds
                })
            );

            const upstreamOptionalRuntimeIds = upstream.optionalRuntimeToolIds;
            const optionalIdsOk =
                upstreamOptionalRuntimeIds.length === 0 ||
                arraysEqual(optionalRuntimeIds, upstreamOptionalRuntimeIds);
            if (!optionalIdsOk) {
                issues.push('optional runtime tool ids differ from upstream OpenClaw');
            }
            checks.push(
                createCheck('upstream.optional-runtime-tool-ids', optionalIdsOk, {
                    local: optionalRuntimeIds,
                    upstream: upstreamOptionalRuntimeIds
                })
            );
        }
    }

    const result = {
        ok: issues.length === 0,
        issues,
        checks,
        ...(upstream ? { upstream } : {})
    };

    result.summary = buildValidationSummary(result);
    return result;
}

module.exports = {
    DEFAULT_OPENCLAW_UPSTREAM_ROOT,
    OPENCLAW_CORE_TOOL_SECTION_ORDER,
    OPENCLAW_CORE_TOOL_DEFINITIONS,
    OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS,
    OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS,
    OPENCLAW_CORE_TOOL_GROUPS,
    OPENCLAW_CORE_TOOL_PROFILES,
    TOOL_PROFILE_IDS,
    getOpenClawToolSurface,
    getOpenClawToolSurfaceSummary,
    validateOpenClawToolSurface
};
