function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeForSearch(value) {
    return normalizeString(value).toLowerCase();
}

function schemaPropertyNames(schema = {}) {
    const properties = schema && typeof schema === 'object' ? schema.properties || {} : {};
    return Object.keys(properties).filter(Boolean);
}

function collectToolSearchText(entry = {}) {
    const spec = entry.spec || {};
    const fn = spec.function || {};
    const inputSchema = entry.input_schema || entry.inputSchema || spec.input_schema || spec.inputSchema || fn.parameters || spec.parameters || {};
    const schemaProperties = [
        ...(Array.isArray(entry.schema_properties) ? entry.schema_properties : []),
        ...(Array.isArray(entry.schemaProperties) ? entry.schemaProperties : []),
        ...schemaPropertyNames(inputSchema)
    ];
    return [
        entry.id,
        entry.type,
        entry.exposure,
        entry.server,
        entry.tool,
        entry.name,
        entry.display_name,
        entry.callable_name,
        entry.title,
        entry.description,
        entry.label,
        spec.id,
        spec.name,
        spec.description,
        fn.name,
        fn.description,
        entry.call_pattern?.tool,
        entry.callPattern?.tool,
        ...schemaProperties
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
}

function canonicalToolName(entry = {}) {
    const candidates = [
        entry.tool,
        entry.callable_name,
        entry.callableName,
        entry.spec?.function?.name,
        entry.spec?.name,
        entry.name,
        entry.id,
        entry.call_pattern?.tool,
        entry.callPattern?.tool
    ];
    for (const candidate of candidates) {
        const value = normalizeForSearch(candidate);
        if (!value) {
            continue;
        }
        const mcpMatch = value.match(/^mcp__.+?__(.+)$/);
        if (mcpMatch) {
            return mcpMatch[1];
        }
        const legacyMcpMatch = value.match(/^mcp:[^:]+:(.+)$/);
        if (legacyMcpMatch) {
            return legacyMcpMatch[1];
        }
        return value;
    }
    return '';
}

const ROUTING_PROFILES = Object.freeze([
    Object.freeze({
        id: 'word_document',
        patterns: [
            /\b(docx|docm)\b/i,
            /\bword\b.*\b(document|file|attachment)\b/i,
            /\b(document|attachment|attached file)\b.*\b(paragraph|table|row|docx|docm)\b/i,
            /附件.*(word|docx|docm|文档|表格)/i,
            /(word|docx|docm|文档).*附件/i
        ],
        tools: ['read_document'],
        bonus: 90,
        webPenalty: 80,
        advice: 'Use read_document for local Word/DOCX content before web_search.'
    }),
    Object.freeze({
        id: 'presentation',
        patterns: [
            /\b(ppt|pptx|powerpoint|presentation|slide deck|slides?)\b/i,
            /(幻灯片|演示文稿|pptx|ppt|powerpoint)/i
        ],
        tools: ['read_presentation'],
        bonus: 90,
        webPenalty: 80,
        advice: 'Use read_presentation for local PowerPoint/PPTX content before web_search.'
    }),
    Object.freeze({
        id: 'spreadsheet',
        patterns: [
            /\b(xlsx|xlsm|xls|csv|tsv|spreadsheet|workbook|worksheet|sheet|columns?|rows?|numeric sum|total)\b/i,
            /\b(cell colors?|fill colors?|merged cells?|formula cells?|grid map|spreadsheet map)\b/i,
            /(电子表格|工作簿|表格|列|行|求和|总和|单元格|填充色|颜色|公式|合并单元格)/i
        ],
        tools: ['read_xlsx_workbook', 'read_spreadsheet'],
        primaryTools: ['read_xlsx_workbook'],
        bonus: 90,
        primaryBonus: 30,
        webPenalty: 80,
        advice: 'Use read_xlsx_workbook for Excel/XLSX/XLSM attachments, especially when cell colors, formulas, merged cells, or grid layout matter; use read_spreadsheet only for plain table summaries.'
    }),
    Object.freeze({
        id: 'context_artifact',
        patterns: [
            /\b(artifactid|artifact_id|artifact_query|artifact_compute|context artifact|artifact payload|payload file|fulljsonpath|managed artifact|query artifact)\b/i,
            /\b(read artifact|artifact range|artifact grid|artifact search|spreadsheet range|grid query|artifact compute|data worker|find path|path search)\b/i,
            /(上下文产物|产物查询|证据产物|大文件载荷|查询证据|产物计算|路径搜索|数据工人)/i
        ],
        tools: ['artifact_query', 'artifact_compute'],
        primaryTools: ['artifact_query', 'artifact_compute'],
        bonus: 95,
        primaryBonus: 40,
        webPenalty: 90,
        advice: 'Use artifact_query for managed AILIS context artifacts by artifactId; use artifact_compute for deterministic data-worker analysis such as spreadsheet profiling or grid path search. Do not raw-read artifact payload files into the model context.'
    }),
    Object.freeze({
        id: 'paper_report_pdf_discovery',
        patterns: [
            /\b(paper|report|article|journal|doi|arxiv|publication|pdf|exact title|document title)\b/i,
            /(论文|报告|期刊|标题|出版|pdf)/i
        ],
        tools: ['paper_metadata_lookup', 'pdf_find_and_extract', 'pdf_extract_text'],
        primaryTools: ['paper_metadata_lookup', 'pdf_find_and_extract'],
        bonus: 82,
        primaryBonus: 24,
        webPenalty: 65,
        advice: 'Use paper_metadata_lookup for paper/DOI metadata and fuzzy bibliographic clues such as author, year, topic, or journal/source. It can accept either structured fields or a raw scholarly query, then use pdf_find_and_extract or pdf_extract_text when you need the paper body.'
    }),
    Object.freeze({
        id: 'known_url_fetch',
        patterns: [
            /\bhttps?:\/\/(?!\S+\.pdf\b)\S+/i,
            /\b(known url|known html|article page|web page|fetch page|extract links?)\b/i
        ],
        tools: ['web_fetch', 'web_extract_links'],
        primaryTools: ['web_fetch'],
        bonus: 62,
        primaryBonus: 12,
        webPenalty: 35,
        advice: 'Use web_fetch or web_extract_links for a known page URL before broad web_search. For archive/listing/search/table-of-contents pages, pass query or contains with the task clues so links are ranked by relevance instead of page order.'
    }),
    Object.freeze({
        id: 'youtube_video',
        patterns: [
            /\b(youtube|youtu\.be|video|transcript|caption|subtitle)\b/i,
            /(视频|字幕|转录|youtube)/i
        ],
        tools: ['youtube_video_search', 'youtube_transcript'],
        primaryTools: ['youtube_video_search', 'youtube_transcript'],
        bonus: 88,
        primaryBonus: 10,
        webPenalty: 80,
        advice: 'Use youtube_video_search when the video URL is unknown; use youtube_transcript for a known YouTube URL before web_search.'
    }),
    Object.freeze({
        id: 'audio',
        patterns: [
            /\b(mp3|wav|m4a|flac|audio|recording|transcribe|speech)\b/i,
            /(音频|录音|转写|语音)/i
        ],
        tools: ['transcribe_audio'],
        bonus: 88,
        webPenalty: 80,
        advice: 'Use transcribe_audio for local audio evidence before web_search.'
    }),
    Object.freeze({
        id: 'image',
        patterns: [
            /\b(png|jpg|jpeg|webp|image|photo|picture|screenshot|vision|visual)\b/i,
            /(图片|图像|截图|照片|视觉)/i
        ],
        tools: ['describe_image'],
        bonus: 86,
        webPenalty: 75,
        advice: 'Use describe_image for local image evidence before web_search.'
    }),
    Object.freeze({
        id: 'python_code',
        patterns: [
            /\b(py|python|script|code output|run file|execute file)\b/i,
            /(代码|脚本|运行.*文件|python)/i
        ],
        tools: ['run_python_file'],
        bonus: 78,
        webPenalty: 55,
        advice: 'Use run_python_file for local Python/code-output questions before web_search.'
    }),
    Object.freeze({
        id: 'github_repo',
        patterns: [
            /\b(github|repository|repo|readme|source tree|blob)\b/i,
            /(代码仓库|仓库|github)/i
        ],
        tools: ['github_repo_read'],
        bonus: 72,
        webPenalty: 38,
        advice: 'Use github_repo_read for known GitHub repositories after repository discovery.'
    }),
    Object.freeze({
        id: 'public_web_discovery',
        patterns: [
            /\b(kaggle|competition|contest|leaderboard|benchmark|challenge|latest|current|recent|today|news|strategy|guide|walkthrough|attack|defense|adversarial)\b/i,
            /(最新|当前|今天|最近|新闻|攻略|比赛|竞赛|挑战|排行榜|攻防|对抗|安全|检索|搜索|查找)/i
        ],
        tools: ['web_research', 'web_search', 'web_fetch'],
        primaryTools: ['web_research', 'web_search'],
        bonus: 86,
        primaryBonus: 28,
        webPenalty: 0,
        advice: 'Use web_research for public/current web evidence tasks such as latest competitions, leaderboards, news, strategy, and guide requests because it plans queries, searches, fetches, ranks evidence pages, and stops for clarification when ambiguous. Use bare web_search only for discovery-only result lists.'
    })
]);

function queryExplicitlyRequestsWebSearch(query = '') {
    return /\b(web_search|web search|search the web|internet search|public web|bing|google|duckduckgo)\b/i.test(query) ||
        /(联网搜索|网页搜索|网络搜索|公开网页|搜索一下|检索一下|查一下)/i.test(query);
}

function matchingRoutingProfiles(query = '') {
    const normalized = normalizeString(query);
    if (!normalized) {
        return [];
    }
    return ROUTING_PROFILES.filter((profile) => profile.patterns.some((pattern) => pattern.test(normalized)));
}

function toolMatchesRoutingProfile(entry = {}, query = '') {
    const toolName = canonicalToolName(entry);
    if (!toolName) {
        return false;
    }
    return matchingRoutingProfiles(query).some((profile) => (
        (profile.tools || []).includes(toolName) ||
        (profile.primaryTools || []).includes(toolName)
    ));
}

function tokenizeSearchQuery(query = '') {
    return normalizeForSearch(query)
        .split(/[^a-z0-9_./:-]+/i)
        .map((term) => term.trim())
        .filter((term) => term.length >= 2);
}

function baseTextScore(query = '', text = '') {
    const terms = tokenizeSearchQuery(query);
    if (!terms.length) {
        return 1;
    }
    return terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0);
}

function toolSpecificityScore(toolName = '') {
    if (!toolName) {
        return 0;
    }
    if (toolName === 'web_search') {
        return -20;
    }
    if (toolName === 'web_research') {
        return 10;
    }
    if (toolName === 'web_fetch' || toolName === 'web_extract_links') {
        return 4;
    }
    if (/^output_(read|tail|search)$/.test(toolName)) {
        return 14;
    }
    if (/^artifact_(query|compute)$/.test(toolName)) {
        return 14;
    }
    if (/^(read_|pdf_|youtube_|transcribe_|describe_|github_|run_python)/.test(toolName)) {
        return 12;
    }
    return 1;
}

function scoreToolForQuery(entry = {}, query = '') {
    const text = collectToolSearchText(entry);
    const toolName = canonicalToolName(entry);
    const needle = normalizeForSearch(query);
    const explicitWebSearch = queryExplicitlyRequestsWebSearch(query);
    const profiles = matchingRoutingProfiles(query);
    let score = baseTextScore(query, text);

    if (needle && toolName && (needle === toolName || needle.includes(toolName) || text.includes(needle))) {
        score += 18;
    }
    if (
        /^output_(read|tail|search)$/.test(toolName) &&
        /\b(outputid|output_id|previewtruncated|exec output|stdout|stderr|full output|stored output|output store|tail output|search output)\b/i.test(query)
    ) {
        score += 36;
    }
    if (
        toolName === 'artifact_query' &&
        /\b(artifactid|artifact_id|artifact_query|context artifact|artifact payload|payload file|fulljsonpath|managed artifact|query artifact|artifact range|artifact grid|artifact search)\b/i.test(query)
    ) {
        score += 44;
    }
    if (
        toolName === 'artifact_compute' &&
        /\b(artifactid|artifact_id|artifact_compute|context artifact|managed artifact|artifact compute|data worker|spreadsheet profile|find path|path search|grid path|maze)\b/i.test(query)
    ) {
        score += 44;
    }
    if (toolName === 'output_read' && /\b(full output|read output|stdout|stderr|byte range|complete output|stored output)\b/i.test(query)) {
        score += 16;
    }
    if (toolName === 'output_tail' && /\b(tail|last|ending|recent|final lines|bottom)\b/i.test(query)) {
        score += 16;
    }
    if (toolName === 'output_search' && /\b(search|find|needle|query|match|grep)\b/i.test(query)) {
        score += 16;
    }
    if (entry.type === 'mcp_tool' || /^mcp__/.test(normalizeForSearch(entry.id))) {
        score += 3;
    } else if (/^external__/.test(normalizeForSearch(entry.id))) {
        score += 4;
    }

    for (const profile of profiles) {
        if (profile.tools.includes(toolName)) {
            score += profile.bonus;
        }
        if ((profile.primaryTools || []).includes(toolName)) {
            score += profile.primaryBonus || 0;
        }
        if (toolName === 'web_search' && !explicitWebSearch) {
            score -= profile.webPenalty ?? 50;
        }
    }

    if (toolName === 'youtube_transcript' && /\bhttps?:\/\/\S*(youtube\.com|youtu\.be)\S*/i.test(query)) {
        score += 30;
    }
    if (toolName === 'youtube_video_search' && !/\bhttps?:\/\/\S*(youtube\.com|youtu\.be)\S*/i.test(query) && /\b(youtube|video|bbc earth|channel|title)\b/i.test(query)) {
        score += 32;
    }

    if (
        toolName === 'web_search' &&
        !explicitWebSearch &&
        /\b(attached|attachment|file|local|pdf|document|video|audio|image|spreadsheet|presentation|schema|api)\b/i.test(query) &&
        !profiles.some((profile) => profile.id === 'public_web_discovery')
    ) {
        score -= 25;
    }

    return score;
}

function rankToolSearchResults(entries = [], query = '', limit = 8) {
    const boundedLimit = Math.max(1, Math.min(Number(limit) || 8, 50));
    return (Array.isArray(entries) ? entries : [])
        .map((entry, index) => {
            const score = scoreToolForQuery(entry, query);
            const toolName = canonicalToolName(entry);
            return {
                entry,
                score,
                specificity: toolSpecificityScore(toolName),
                index,
                id: normalizeForSearch(entry?.id || entry?.name || toolName)
            };
        })
        .filter(({ score }) => score > 0)
        .sort((left, right) =>
            right.score - left.score ||
            right.specificity - left.specificity ||
            left.id.localeCompare(right.id) ||
            left.index - right.index
        )
        .slice(0, boundedLimit)
        .map(({ entry }) => entry);
}

function buildToolRoutingAdvice(query = '', rankedTools = []) {
    const profiles = matchingRoutingProfiles(query);
    if (!profiles.length) {
        return '';
    }
    const firstTool = canonicalToolName(rankedTools[0] || {});
    const profile = profiles.find((candidate) => (
        (candidate.tools || []).includes(firstTool) ||
        (candidate.primaryTools || []).includes(firstTool)
    )) || profiles[0];
    return profile.advice || '';
}

module.exports = {
    buildToolRoutingAdvice,
    canonicalToolName,
    collectToolSearchText,
    matchingRoutingProfiles,
    rankToolSearchResults,
    scoreToolForQuery,
    toolMatchesRoutingProfile
};
