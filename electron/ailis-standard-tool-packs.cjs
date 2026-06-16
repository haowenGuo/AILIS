const STANDARD_TOOL_PACK_VERSION = 1;

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeArray(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function tokenize(text = '') {
    return String(text || '')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}_@./:-]+/gu, ' ')
        .split(/\s+/)
        .map((term) => term.trim())
        .filter((term) => term.length >= 2);
}

function scoreText(query = '', text = '') {
    const terms = tokenize(query);
    if (!terms.length) {
        return 1;
    }
    const haystack = String(text || '').toLowerCase();
    return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}

function objectSchema({ required = [], properties = {} } = {}) {
    return {
        type: 'object',
        required,
        additionalProperties: false,
        properties
    };
}

function stringProp(description, extra = {}) {
    return {
        type: 'string',
        description,
        ...extra
    };
}

function numberProp(description, extra = {}) {
    return {
        type: 'number',
        description,
        ...extra
    };
}

function arrayProp(description, items = { type: 'string' }, extra = {}) {
    return {
        type: 'array',
        description,
        items,
        ...extra
    };
}

const STANDARD_TOOL_PACKS = Object.freeze([
    Object.freeze({
        id: 'email_productivity_pack',
        version: STANDARD_TOOL_PACK_VERSION,
        category: 'email',
        label: 'Email Productivity Pack',
        summary: 'Use official Gmail and Microsoft Graph APIs for mailbox listing, message reads, search, and draft/send workflows instead of long IMAP-only agent loops.',
        keywords: Object.freeze(['email', 'mail', 'gmail', 'outlook', 'graph', 'inbox', 'message', '邮件', '邮箱', '收件箱']),
        authProfiles: Object.freeze([
            Object.freeze({
                id: 'gmail-oauth',
                provider: 'openapi',
                authType: 'bearer_env',
                envVar: 'GMAIL_ACCESS_TOKEN',
                scopes: Object.freeze(['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'])
            }),
            Object.freeze({
                id: 'msgraph-mail-oauth',
                provider: 'openapi',
                authType: 'bearer_env',
                envVar: 'MSGRAPH_ACCESS_TOKEN',
                scopes: Object.freeze(['Mail.Read', 'Mail.ReadWrite', 'Mail.Send'])
            }),
            Object.freeze({
                id: 'composio-main',
                provider: 'composio',
                authType: 'composio_api_key_env',
                envVar: 'COMPOSIO_API_KEY',
                baseUrl: 'https://backend.composio.dev/api/v3'
            })
        ]),
        tools: Object.freeze([
            Object.freeze({
                sourceType: 'openapi_operation',
                exposure: 'auth_required',
                authProfileId: 'gmail-oauth',
                operationId: 'gmailListMessages',
                toolId: 'gmail_list_messages',
                method: 'get',
                baseUrl: 'https://gmail.googleapis.com',
                path: '/gmail/v1/users/{userId}/messages',
                sourceName: 'gmail',
                summary: 'List Gmail message ids with Gmail query syntax and maxResults before optionally fetching selected messages.',
                parameters: Object.freeze([
                    Object.freeze({ name: 'userId', in: 'path', required: true, schema: Object.freeze({ type: 'string' }), description: 'Mailbox user id, usually me.' }),
                    Object.freeze({ name: 'q', in: 'query', required: false, schema: Object.freeze({ type: 'string' }), description: 'Gmail search query such as newer_than:7d, is:unread, from:example.com.' }),
                    Object.freeze({ name: 'labelIds', in: 'query', required: false, schema: Object.freeze({ type: 'string' }), description: 'Comma-separated Gmail label ids such as INBOX or UNREAD.' }),
                    Object.freeze({ name: 'maxResults', in: 'query', required: false, schema: Object.freeze({ type: 'number', minimum: 1, maximum: 100 }), description: 'Maximum messages to list; use 10 for latest-ten requests.' })
                ]),
                whenToUse: Object.freeze(['Use for Gmail latest/unread/search list requests when OAuth is configured.']),
                whenNotToUse: Object.freeze(['Do not use to read full body; call gmailGetMessage only for selected ids.', 'Do not use before OAuth is configured.']),
                preconditions: Object.freeze(['Gmail OAuth token is available through auth profile gmail-oauth.']),
                examples: Object.freeze([Object.freeze({ userId: 'me', maxResults: 10, q: 'newer_than:7d' })]),
                badExamples: Object.freeze([Object.freeze({ maxResults: 10 })]),
                alternatives: Object.freeze(['Use local email.list for IMAP fallback.', 'Use Composio Gmail tools if OAuth is managed there.']),
                errors: Object.freeze({
                    auth_required: Object.freeze({ recoverable: true, nextActions: Object.freeze(['configure gmail-oauth auth profile']) }),
                    rate_limited: Object.freeze({ recoverable: true, nextActions: Object.freeze(['retry with smaller maxResults or narrower q']) })
                }),
                permissions: Object.freeze(['gmail.readonly'])
            }),
            Object.freeze({
                sourceType: 'openapi_operation',
                exposure: 'auth_required',
                authProfileId: 'gmail-oauth',
                operationId: 'gmailGetMessage',
                toolId: 'gmail_get_message',
                method: 'get',
                baseUrl: 'https://gmail.googleapis.com',
                path: '/gmail/v1/users/{userId}/messages/{id}',
                sourceName: 'gmail',
                summary: 'Get one Gmail message by id after a list/search result identifies it.',
                parameters: Object.freeze([
                    Object.freeze({ name: 'userId', in: 'path', required: true, schema: Object.freeze({ type: 'string' }), description: 'Mailbox user id, usually me.' }),
                    Object.freeze({ name: 'id', in: 'path', required: true, schema: Object.freeze({ type: 'string' }), description: 'Gmail message id returned by gmailListMessages.' }),
                    Object.freeze({ name: 'format', in: 'query', required: false, schema: Object.freeze({ type: 'string', enum: Object.freeze(['minimal', 'metadata', 'full', 'raw']) }), description: 'Use metadata unless the user asks for body details.' })
                ]),
                whenToUse: Object.freeze(['Use only after a Gmail list/search has identified a specific message id.']),
                whenNotToUse: Object.freeze(['Do not read every message body when the user only asked for a latest list.']),
                preconditions: Object.freeze(['Gmail OAuth token is configured.', 'A Gmail message id is known.']),
                examples: Object.freeze([Object.freeze({ userId: 'me', id: '18f...', format: 'metadata' })]),
                badExamples: Object.freeze([Object.freeze({ userId: 'me', format: 'full' })]),
                alternatives: Object.freeze(['Use gmailListMessages first.', 'Use local email.read with IMAP uid when using the local email tool.']),
                errors: Object.freeze({
                    not_found: Object.freeze({ recoverable: false }),
                    auth_required: Object.freeze({ recoverable: true, nextActions: Object.freeze(['configure gmail-oauth auth profile']) })
                }),
                permissions: Object.freeze(['gmail.readonly'])
            }),
            Object.freeze({
                sourceType: 'openapi_operation',
                exposure: 'auth_required',
                authProfileId: 'msgraph-mail-oauth',
                operationId: 'microsoftGraphListMessages',
                toolId: 'msgraph_list_messages',
                method: 'get',
                baseUrl: 'https://graph.microsoft.com',
                path: '/v1.0/me/messages',
                sourceName: 'microsoft_graph',
                summary: 'List Outlook/Microsoft 365 messages with top/select/filter/orderby to keep mailbox requests small and structured.',
                parameters: Object.freeze([
                    Object.freeze({ name: '$top', in: 'query', required: false, schema: Object.freeze({ type: 'number', minimum: 1, maximum: 50 }), description: 'Maximum messages to return; use 10 for latest-ten requests.' }),
                    Object.freeze({ name: '$select', in: 'query', required: false, schema: Object.freeze({ type: 'string' }), description: 'Comma-separated fields such as subject,from,receivedDateTime,isRead.' }),
                    Object.freeze({ name: '$filter', in: 'query', required: false, schema: Object.freeze({ type: 'string' }), description: 'OData filter such as isRead eq false.' }),
                    Object.freeze({ name: '$orderby', in: 'query', required: false, schema: Object.freeze({ type: 'string' }), description: 'Ordering such as receivedDateTime desc.' })
                ]),
                whenToUse: Object.freeze(['Use for Outlook/Microsoft latest mail list and unread triage when Graph OAuth is configured.']),
                whenNotToUse: Object.freeze(['Do not fetch bodies when subject/from/date are sufficient.', 'Do not use for Gmail accounts.']),
                preconditions: Object.freeze(['Microsoft Graph OAuth token is available through auth profile msgraph-mail-oauth.']),
                examples: Object.freeze([Object.freeze({ '$top': 10, '$select': 'subject,from,receivedDateTime,isRead', '$orderby': 'receivedDateTime desc' })]),
                badExamples: Object.freeze([Object.freeze({ '$top': 1000 })]),
                alternatives: Object.freeze(['Use local email.list for IMAP fallback.', 'Use Gmail API for Gmail accounts.']),
                errors: Object.freeze({
                    auth_required: Object.freeze({ recoverable: true, nextActions: Object.freeze(['configure msgraph-mail-oauth auth profile']) }),
                    throttled: Object.freeze({ recoverable: true, nextActions: Object.freeze(['reduce $top and use $select']) })
                }),
                permissions: Object.freeze(['Mail.Read'])
            }),
            Object.freeze({
                sourceType: 'composio_tool',
                exposure: 'auth_required',
                authProfileId: 'composio-main',
                name: 'gmail_search_emails',
                toolId: 'composio_gmail_search_emails',
                app: 'gmail',
                readOnlyHint: true,
                description: 'Search Gmail through Composio when OAuth and connected account state are managed by Composio.',
                inputSchema: objectSchema({
                    required: ['query'],
                    properties: {
                        query: stringProp('Gmail search query, for example newer_than:7d or is:unread.'),
                        max_results: numberProp('Maximum email results to return; use 10 for latest-ten requests.', { minimum: 1, maximum: 50 })
                    }
                }),
                whenToUse: Object.freeze(['Use when Composio already owns Gmail OAuth and local Gmail auth is not configured.']),
                whenNotToUse: Object.freeze(['Do not send or modify emails with this read-only search contract.']),
                preconditions: Object.freeze(['COMPOSIO_API_KEY is configured and Gmail account is connected.']),
                examples: Object.freeze([Object.freeze({ query: 'newer_than:7d', max_results: 10 })]),
                badExamples: Object.freeze([Object.freeze({ max_results: 10 })]),
                alternatives: Object.freeze(['Use Gmail OpenAPI tools when direct OAuth is configured.', 'Use local email.list as IMAP fallback.']),
                errors: Object.freeze({
                    auth_required: Object.freeze({ recoverable: true, nextActions: Object.freeze(['configure composio-main auth profile']) })
                }),
                permissions: Object.freeze(['gmail.readonly'])
            })
        ]),
        regressionQueries: Object.freeze(['latest 10 emails', 'unread Gmail messages', 'Outlook inbox list'])
    }),
    Object.freeze({
        id: 'document_reader_pack',
        version: STANDARD_TOOL_PACK_VERSION,
        category: 'document',
        label: 'Document Reader Pack',
        summary: 'Use Docling, MarkItDown, and typed local converters for PDF/DOCX/PPTX/XLSX/table extraction with lossless structured output.',
        keywords: Object.freeze(['document', 'pdf', 'docx', 'pptx', 'xlsx', 'table', 'ocr', 'docling', 'markitdown', '文档', '表格']),
        authProfiles: Object.freeze([]),
        tools: Object.freeze([
            Object.freeze({
                sourceType: 'pydantic_tool',
                exposure: 'local_contract',
                name: 'docling_convert_document',
                toolId: 'docling_convert_document',
                description: 'Convert a local PDF/DOCX/PPTX/XLSX/HTML/image document into Markdown, JSON, and extracted table structures using Docling.',
                inputSchema: objectSchema({
                    required: ['path'],
                    properties: {
                        path: stringProp('Existing local document path.'),
                        output_format: stringProp('Preferred output: markdown, json, text, or tables.', { enum: Object.freeze(['markdown', 'json', 'text', 'tables']) }),
                        ocr: stringProp('OCR mode: auto, always, or never.', { enum: Object.freeze(['auto', 'always', 'never']) }),
                        page_range: stringProp('Optional page range such as 1-3.')
                    }
                }),
                outputSchema: objectSchema({
                    properties: {
                        text: stringProp('Extracted text or Markdown.'),
                        tables: arrayProp('Extracted tables with row/column structure.', { type: 'object' }),
                        pages: arrayProp('Per-page extraction metadata.', { type: 'object' })
                    }
                }),
                whenToUse: Object.freeze(['Use for local PDF/DOCX/PPTX/XLSX documents where layout, tables, OCR, or page-level evidence matter.']),
                whenNotToUse: Object.freeze(['Do not use for plain text/Markdown files that the read tool can read directly.']),
                preconditions: Object.freeze(['The local file exists.', 'Docling runtime is installed or this contract is backed by an installed tool.']),
                examples: Object.freeze([Object.freeze({ path: 'F:/AILIS/input/report.pdf', output_format: 'json', ocr: 'auto' })]),
                badExamples: Object.freeze([Object.freeze({ url: 'https://example.com/report.pdf' })]),
                alternatives: Object.freeze(['Use markitdown_convert_document for fast Markdown-only extraction.', 'Use existing read_document MCP if already installed.']),
                errors: Object.freeze({
                    missing_dependency: Object.freeze({ recoverable: true, nextActions: Object.freeze(['install docling or use MarkItDown fallback']) }),
                    truncated_output: Object.freeze({ recoverable: true, nextActions: Object.freeze(['request tables or page_range instead of raw full text']) })
                }),
                permissions: Object.freeze(['local_file_read'])
            }),
            Object.freeze({
                sourceType: 'pydantic_tool',
                exposure: 'local_contract',
                name: 'markitdown_convert_document',
                toolId: 'markitdown_convert_document',
                description: 'Convert common local files such as PDF, DOCX, PPTX, XLSX, HTML, CSV, and images into LLM-friendly Markdown using MarkItDown.',
                inputSchema: objectSchema({
                    required: ['path'],
                    properties: {
                        path: stringProp('Existing local file path.'),
                        max_chars: numberProp('Maximum characters to return before creating an artifact.', { minimum: 1000, maximum: 200000 }),
                        include_metadata: stringProp('Whether to include file metadata.', { enum: Object.freeze(['true', 'false']) })
                    }
                }),
                whenToUse: Object.freeze(['Use as a fast fallback for common document-to-Markdown conversion.']),
                whenNotToUse: Object.freeze(['Do not rely on it alone when exact table structure or visual layout is required.']),
                preconditions: Object.freeze(['The local file exists.', 'MarkItDown runtime is installed or this contract is backed by an installed tool.']),
                examples: Object.freeze([Object.freeze({ path: 'F:/AILIS/input/brief.docx', max_chars: 30000, include_metadata: 'true' })]),
                badExamples: Object.freeze([Object.freeze({ path: 'missing.docx' })]),
                alternatives: Object.freeze(['Use Docling for tables/OCR/layout.', 'Use read_document MCP if available.']),
                errors: Object.freeze({
                    missing_dependency: Object.freeze({ recoverable: true, nextActions: Object.freeze(['install markitdown or use python document parser fallback']) }),
                    unsupported_format: Object.freeze({ recoverable: true, nextActions: Object.freeze(['try Docling or file-specific parser']) })
                }),
                permissions: Object.freeze(['local_file_read'])
            }),
            Object.freeze({
                sourceType: 'pydantic_tool',
                exposure: 'local_contract',
                name: 'python_document_extract',
                toolId: 'python_document_extract',
                description: 'Extract local DOCX/PDF/text/CSV content with lightweight Python dependencies such as python-docx and pypdf, writing full output to an artifact to avoid truncation.',
                inputSchema: objectSchema({
                    required: ['path'],
                    properties: {
                        path: stringProp('Existing local DOCX, PDF, text, Markdown, CSV, TSV, HTML, or JSON file path.'),
                        max_chars: numberProp('Maximum preview characters to return; full extraction is written to fullTextPath.', { minimum: 1000, maximum: 500000 }),
                        output_format: stringProp('Preferred output: markdown or text.', { enum: Object.freeze(['markdown', 'text']) })
                    }
                }),
                outputSchema: objectSchema({
                    properties: {
                        text: stringProp('Preview text extracted from the document.'),
                        fullTextPath: stringProp('Local artifact path containing the full extracted text.'),
                        tables: arrayProp('Extracted tables for formats such as DOCX or CSV.', { type: 'object' }),
                        truncated: { type: 'boolean', description: 'Whether the preview text was truncated.' }
                    }
                }),
                whenToUse: Object.freeze(['Use as a local fallback when Docling/MarkItDown are missing, especially for DOCX tables and simple PDFs.']),
                whenNotToUse: Object.freeze(['Do not use when exact layout/OCR is required and Docling is available.', 'Do not use for unsupported binary formats.']),
                preconditions: Object.freeze(['The local file exists.', 'python-docx and pypdf are importable in the configured Python runtime.']),
                examples: Object.freeze([Object.freeze({ path: 'F:/AILIS/input/secret-santa.docx', max_chars: 50000, output_format: 'markdown' })]),
                badExamples: Object.freeze([Object.freeze({ url: 'https://example.com/file.docx' })]),
                alternatives: Object.freeze(['Use Docling for richer layout/table/OCR extraction.', 'Use MarkItDown for broad format Markdown conversion.']),
                errors: Object.freeze({
                    missing_dependency: Object.freeze({ recoverable: true, nextActions: Object.freeze(['install python-docx and pypdf or use another local document converter']) }),
                    unsupported_format: Object.freeze({ recoverable: true, nextActions: Object.freeze(['try Docling, MarkItDown, or a format-specific parser']) })
                }),
                permissions: Object.freeze(['local_file_read'])
            })
        ]),
        regressionQueries: Object.freeze(['read a DOCX table', 'extract PDF tables', 'PPTX slide text'])
    }),
    Object.freeze({
        id: 'web_retrieval_pack',
        version: STANDARD_TOOL_PACK_VERSION,
        category: 'web',
        label: 'Web Retrieval Pack',
        summary: 'Use search/extract/scrape backends such as Jina Reader, Tavily, and Firecrawl before broad fragile web_search loops.',
        keywords: Object.freeze(['web', 'search', 'scrape', 'crawl', 'extract', 'reader', 'firecrawl', 'tavily', 'jina', '网页', '搜索']),
        authProfiles: Object.freeze([
            Object.freeze({ id: 'firecrawl-api', provider: 'openapi', authType: 'bearer_env', envVar: 'FIRECRAWL_API_KEY' }),
            Object.freeze({ id: 'tavily-api', provider: 'openapi', authType: 'api_key_env', envVar: 'TAVILY_API_KEY' })
        ]),
        tools: Object.freeze([
            Object.freeze({
                sourceType: 'openapi_operation',
                exposure: 'auth_required',
                authProfileId: 'firecrawl-api',
                operationId: 'firecrawlScrape',
                toolId: 'firecrawl_scrape',
                method: 'post',
                baseUrl: 'https://api.firecrawl.dev',
                path: '/v1/scrape',
                sourceName: 'firecrawl',
                readOnlyHint: true,
                summary: 'Scrape one URL and return Markdown, HTML, links, screenshot, or structured extraction through Firecrawl.',
                requestBody: Object.freeze({
                    required: true,
                    content: Object.freeze({
                        'application/json': Object.freeze({
                            schema: objectSchema({
                                required: ['url'],
                                properties: {
                                    url: stringProp('URL to scrape.'),
                                    formats: arrayProp('Output formats such as markdown, html, links, screenshot, or json.'),
                                    onlyMainContent: { type: 'boolean', description: 'Whether to keep only main page content.' }
                                }
                            })
                        })
                    })
                }),
                whenToUse: Object.freeze(['Use for known URLs, dynamic pages, pages needing screenshot/markdown extraction, or brittle HTML.']),
                whenNotToUse: Object.freeze(['Do not use for broad discovery when no URL is known; search first.']),
                preconditions: Object.freeze(['FIRECRAWL_API_KEY is configured.']),
                examples: Object.freeze([Object.freeze({ url: 'https://example.com/page', formats: ['markdown'], onlyMainContent: true })]),
                badExamples: Object.freeze([Object.freeze({ query: 'latest news' })]),
                alternatives: Object.freeze(['Use web_fetch for simple HTML.', 'Use Jina Reader for no-auth URL-to-text fallback.']),
                errors: Object.freeze({
                    auth_required: Object.freeze({ recoverable: true, nextActions: Object.freeze(['configure firecrawl-api auth profile']) }),
                    blocked_page: Object.freeze({ recoverable: true, nextActions: Object.freeze(['try browser screenshot or another source']) })
                }),
                permissions: Object.freeze(['web.read'])
            }),
            Object.freeze({
                sourceType: 'openapi_operation',
                exposure: 'auth_required',
                authProfileId: 'tavily-api',
                operationId: 'tavilySearch',
                toolId: 'tavily_search',
                method: 'post',
                baseUrl: 'https://api.tavily.com',
                path: '/search',
                sourceName: 'tavily',
                readOnlyHint: true,
                summary: 'Search the web with optional answer, raw content, and depth controls through Tavily.',
                requestBody: Object.freeze({
                    required: true,
                    content: Object.freeze({
                        'application/json': Object.freeze({
                            schema: objectSchema({
                                required: ['query'],
                                properties: {
                                    query: stringProp('Specific web search query.'),
                                    search_depth: stringProp('Search depth: basic or advanced.', { enum: Object.freeze(['basic', 'advanced']) }),
                                    include_answer: { type: 'boolean', description: 'Whether to include Tavily answer synthesis.' },
                                    include_raw_content: { type: 'boolean', description: 'Whether to include raw page content.' },
                                    max_results: numberProp('Maximum results to return.', { minimum: 1, maximum: 20 })
                                }
                            })
                        })
                    })
                }),
                whenToUse: Object.freeze(['Use for broad web discovery when a structured search API is better than raw web_search.']),
                whenNotToUse: Object.freeze(['Do not use when an official domain/API is known and should be queried directly.']),
                preconditions: Object.freeze(['TAVILY_API_KEY is configured.']),
                examples: Object.freeze([Object.freeze({ query: 'OpenAI Apps SDK structuredContent outputSchema', search_depth: 'basic', include_answer: true, max_results: 5 })]),
                badExamples: Object.freeze([Object.freeze({ query: '' })]),
                alternatives: Object.freeze(['Use official API tools for known structured sources.', 'Use Firecrawl/Jina Reader for known URL extraction.']),
                errors: Object.freeze({
                    auth_required: Object.freeze({ recoverable: true, nextActions: Object.freeze(['configure tavily-api auth profile']) }),
                    low_recall: Object.freeze({ recoverable: true, nextActions: Object.freeze(['try official API or exact-domain query']) })
                }),
                permissions: Object.freeze(['web.search'])
            }),
            Object.freeze({
                sourceType: 'pydantic_tool',
                exposure: 'local_contract',
                name: 'jina_reader_fetch',
                toolId: 'jina_reader_fetch_contract',
                description: 'Document the Jina Reader URL-to-text backend; install a dedicated adapter before using arbitrary URLs because URL path rewriting is non-standard.',
                inputSchema: objectSchema({
                    required: ['target_url'],
                    properties: {
                        target_url: stringProp('Original URL to convert through Jina Reader adapter.'),
                        output_format: stringProp('Preferred output format such as markdown or text.', { enum: Object.freeze(['markdown', 'text']) })
                    }
                }),
                whenToUse: Object.freeze(['Use through a dedicated Jina adapter for URL-to-Markdown fallback when the page is public.']),
                whenNotToUse: Object.freeze(['Do not call this raw OpenAPI shape directly; Jina Reader rewrites URLs in the path.']),
                preconditions: Object.freeze(['A Jina Reader adapter must map target_url into the r.jina.ai URL shape.']),
                examples: Object.freeze([Object.freeze({ target_url: 'https://example.com/article', output_format: 'markdown' })]),
                badExamples: Object.freeze([Object.freeze({ url: 'example.com' })]),
                alternatives: Object.freeze(['Use Firecrawl scrape when API key is available.', 'Use web_fetch for simple HTML.']),
                errors: Object.freeze({
                    adapter_required: Object.freeze({ recoverable: true, nextActions: Object.freeze(['install/configure a Jina Reader adapter']) })
                }),
                permissions: Object.freeze(['web.read'])
            })
        ]),
        regressionQueries: Object.freeze(['known URL extraction', 'web page structured extraction', 'search with raw content'])
    }),
    Object.freeze({
        id: 'academic_metadata_pack',
        version: STANDARD_TOOL_PACK_VERSION,
        category: 'academic',
        label: 'Academic Metadata Pack',
        summary: 'Use OpenAlex, Crossref, and Semantic Scholar-style structured metadata before broad web or scholar scraping.',
        keywords: Object.freeze(['paper', 'doi', 'author', 'venue', 'citation', 'openalex', 'crossref', 'semantic scholar', '论文', '作者']),
        authProfiles: Object.freeze([]),
        tools: Object.freeze([
            Object.freeze({
                sourceType: 'openapi_operation',
                exposure: 'public_readonly',
                operationId: 'openalexSearchWorks',
                toolId: 'openalex_search_works',
                method: 'get',
                baseUrl: 'https://api.openalex.org',
                path: '/works',
                sourceName: 'openalex',
                summary: 'Search OpenAlex works by title/topic/author terms and return structured paper metadata.',
                parameters: Object.freeze([
                    Object.freeze({ name: 'search', in: 'query', required: true, schema: Object.freeze({ type: 'string' }), description: 'Paper title, DOI, author, or topic search query.' }),
                    Object.freeze({ name: 'filter', in: 'query', required: false, schema: Object.freeze({ type: 'string' }), description: 'OpenAlex filter expression, for example from_publication_date:2001-01-01.' }),
                    Object.freeze({ name: 'per-page', in: 'query', required: false, schema: Object.freeze({ type: 'number', minimum: 1, maximum: 50 }), description: 'Number of works to return.' })
                ]),
                whenToUse: Object.freeze(['Use for scholarly paper metadata, authors, years, venues, DOI, and title disambiguation.']),
                whenNotToUse: Object.freeze(['Do not use for full PDF text extraction.', 'Do not scrape Google Scholar when this structured metadata can answer the question.']),
                preconditions: Object.freeze(['A title, DOI, author name, or topic query is known.']),
                examples: Object.freeze([Object.freeze({ search: 'Pie Menus or Linear Menus Which Is Better', 'per-page': 5 })]),
                badExamples: Object.freeze([Object.freeze({ q: 'paper' })]),
                alternatives: Object.freeze(['Use Crossref for DOI-first lookups.', 'Use pdf_find_and_extract for full text evidence.']),
                errors: Object.freeze({
                    low_confidence_match: Object.freeze({ recoverable: true, nextActions: Object.freeze(['add author/year/venue terms or use exact title']) }),
                    rate_limited: Object.freeze({ recoverable: true, nextActions: Object.freeze(['retry later or query Crossref']) })
                }),
                permissions: Object.freeze(['openalex.read'])
            }),
            Object.freeze({
                sourceType: 'openapi_operation',
                exposure: 'public_readonly',
                operationId: 'crossrefSearchWorks',
                toolId: 'crossref_search_works',
                method: 'get',
                baseUrl: 'https://api.crossref.org',
                path: '/works',
                sourceName: 'crossref',
                summary: 'Search Crossref works by bibliographic query, title, author, DOI, and publication year.',
                parameters: Object.freeze([
                    Object.freeze({ name: 'query.bibliographic', in: 'query', required: true, schema: Object.freeze({ type: 'string' }), description: 'Bibliographic search string containing title, author, DOI, or venue.' }),
                    Object.freeze({ name: 'rows', in: 'query', required: false, schema: Object.freeze({ type: 'number', minimum: 1, maximum: 20 }), description: 'Number of records to return.' })
                ]),
                whenToUse: Object.freeze(['Use for DOI, Crossref title, author, year, and publication metadata.']),
                whenNotToUse: Object.freeze(['Do not use for author history questions that need all prior works; OpenAlex is usually better.']),
                preconditions: Object.freeze(['A bibliographic query is known.']),
                examples: Object.freeze([Object.freeze({ 'query.bibliographic': 'Pie Menus or Linear Menus Which Is Better', rows: 5 })]),
                badExamples: Object.freeze([Object.freeze({ rows: 5 })]),
                alternatives: Object.freeze(['Use OpenAlex for author/work graph traversal.', 'Use Semantic Scholar if citation graph details are needed and rate limits allow.']),
                errors: Object.freeze({
                    noisy_results: Object.freeze({ recoverable: true, nextActions: Object.freeze(['add exact title or author/year terms']) })
                }),
                permissions: Object.freeze(['crossref.read'])
            }),
            Object.freeze({
                sourceType: 'openapi_operation',
                exposure: 'public_readonly',
                operationId: 'semanticScholarPaperSearchContract',
                toolId: 'semantic_scholar_search_contract',
                method: 'get',
                baseUrl: 'https://api.semanticscholar.org',
                path: '/graph/v1/paper/search',
                sourceName: 'semantic_scholar',
                summary: 'Search Semantic Scholar Graph paper metadata when rate limits allow; use as structured fallback, not as the only source.',
                parameters: Object.freeze([
                    Object.freeze({ name: 'query', in: 'query', required: true, schema: Object.freeze({ type: 'string' }), description: 'Paper title/topic/author search query.' }),
                    Object.freeze({ name: 'fields', in: 'query', required: false, schema: Object.freeze({ type: 'string' }), description: 'Comma-separated fields such as title,authors,year,venue,externalIds.' }),
                    Object.freeze({ name: 'limit', in: 'query', required: false, schema: Object.freeze({ type: 'number', minimum: 1, maximum: 20 }), description: 'Maximum records to return.' })
                ]),
                whenToUse: Object.freeze(['Use after OpenAlex/Crossref when Semantic Scholar-specific fields or citation graph hints are needed.']),
                whenNotToUse: Object.freeze(['Do not loop on Semantic Scholar after HTTP 429; switch source or wait.']),
                preconditions: Object.freeze(['A precise paper or topic query is known.']),
                examples: Object.freeze([Object.freeze({ query: 'software agents online systems usage', fields: 'title,authors,year,venue,externalIds', limit: 5 })]),
                badExamples: Object.freeze([Object.freeze({ query: 'AI' })]),
                alternatives: Object.freeze(['Use OpenAlex for public structured metadata.', 'Use Crossref for DOI metadata.']),
                errors: Object.freeze({
                    rate_limited: Object.freeze({ recoverable: true, nextActions: Object.freeze(['switch to OpenAlex or Crossref; do not retry in a loop']) })
                }),
                permissions: Object.freeze(['semanticscholar.read'])
            })
        ]),
        regressionQueries: Object.freeze(['first paper by author', 'paper DOI metadata', 'venue and year lookup'])
    }),
    Object.freeze({
        id: 'media_transcription_pack',
        version: STANDARD_TOOL_PACK_VERSION,
        category: 'media',
        label: 'Media Transcription Pack',
        summary: 'Use transcript, downloader, ASR, and frame-sampling tools with explicit anti-bot/cookie and fallback semantics.',
        keywords: Object.freeze(['youtube', 'video', 'audio', 'transcript', 'asr', 'yt-dlp', 'frame', 'media', '视频', '音频']),
        authProfiles: Object.freeze([]),
        tools: Object.freeze([
            Object.freeze({
                sourceType: 'pydantic_tool',
                exposure: 'local_contract',
                name: 'youtube_transcript_or_asr',
                toolId: 'youtube_transcript_or_asr',
                description: 'Get YouTube transcript when available, then fallback to browser cookies, audio download, ASR, and frame sampling with explicit failure classification.',
                inputSchema: objectSchema({
                    required: ['url'],
                    properties: {
                        url: stringProp('YouTube video URL.'),
                        language: stringProp('Preferred transcript/ASR language such as en or zh.', { default: 'auto' }),
                        allow_cookies: { type: 'boolean', description: 'Whether browser cookies may be used for anti-bot protected videos.' },
                        sample_frames: { type: 'boolean', description: 'Whether to sample frames when transcript/audio evidence is insufficient.' }
                    }
                }),
                whenToUse: Object.freeze(['Use for YouTube/video questions that need transcript, speech, visible text, or frame evidence.']),
                whenNotToUse: Object.freeze(['Do not keep retrying youtube_transcript after anti-bot/captcha; switch to cookies, ASR, or report blocked.']),
                preconditions: Object.freeze(['A video URL is known.', 'ASR/download dependencies are installed for fallback paths.']),
                examples: Object.freeze([Object.freeze({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', language: 'en', allow_cookies: false, sample_frames: true })]),
                badExamples: Object.freeze([Object.freeze({ query: 'funny video' })]),
                alternatives: Object.freeze(['Use web_search to find the video URL first.', 'Use browser/vision tools for visible on-page evidence.']),
                errors: Object.freeze({
                    anti_bot_blocked: Object.freeze({ recoverable: true, nextActions: Object.freeze(['use cookies if approved', 'fallback to ASR/frame sampling', 'stop looping transcript requests']) }),
                    transcript_unavailable: Object.freeze({ recoverable: true, nextActions: Object.freeze(['download audio and run ASR']) })
                }),
                permissions: Object.freeze(['web.read', 'local_compute'])
            })
        ]),
        regressionQueries: Object.freeze(['YouTube transcript unavailable', 'video frame text', 'audio transcription'])
    })
]);

function packSearchText(pack = {}) {
    return JSON.stringify({
        id: pack.id,
        label: pack.label,
        category: pack.category,
        summary: pack.summary,
        keywords: pack.keywords,
        tools: normalizeArray(pack.tools).map((tool) => ({
            id: tool.toolId || tool.name || tool.operationId,
            summary: tool.summary || tool.description,
            sourceType: tool.sourceType,
            sourceName: tool.sourceName
        })),
        regressionQueries: pack.regressionQueries
    });
}

function listStandardToolPacks({ includeTools = true } = {}) {
    return STANDARD_TOOL_PACKS.map((pack) => {
        const clone = cloneJson(pack);
        if (!includeTools) {
            clone.toolCount = normalizeArray(pack.tools).length;
            delete clone.tools;
        }
        clone.searchText = packSearchText(pack);
        return clone;
    });
}

function searchStandardToolPacks(query = '', { limit = 12, includeTools = true } = {}) {
    const normalizedQuery = normalizeString(query).toLowerCase();
    return listStandardToolPacks({ includeTools })
        .map((pack) => ({
            ...pack,
            type: 'standard_tool_pack',
            source: 'ailis_standard_tool_pack_catalog',
            matchScore: normalizedQuery ? scoreText(normalizedQuery, pack.searchText) : 1
        }))
        .filter((pack) => !normalizedQuery || pack.matchScore > 0)
        .sort((left, right) => right.matchScore - left.matchScore || left.id.localeCompare(right.id))
        .slice(0, Math.max(1, Math.min(Number(limit) || 12, 50)));
}

function selectStandardToolPacks({ packIds = [], query = '', limit = 50 } = {}) {
    const ids = new Set(normalizeArray(packIds).map((id) => normalizeString(id).toLowerCase()).filter(Boolean));
    if (ids.size) {
        return listStandardToolPacks().filter((pack) => ids.has(pack.id.toLowerCase()));
    }
    if (query) {
        return searchStandardToolPacks(query, { limit, includeTools: true });
    }
    return listStandardToolPacks();
}

function shouldIncludeTool(tool = {}, options = {}) {
    const exposure = normalizeString(tool.exposure, 'auth_required');
    if (exposure === 'public_readonly') {
        return options.includePublicReadonly !== false;
    }
    if (exposure === 'auth_required') {
        return options.includeAuthRequired !== false;
    }
    if (exposure === 'local_contract') {
        return options.includeLocalContracts !== false;
    }
    return true;
}

function collectStandardToolPackContracts(options = {}) {
    const selectedPacks = selectStandardToolPacks({
        packIds: options.packIds || options.standardToolPacks || options.packs,
        query: options.query,
        limit: options.limit
    });
    const groups = {
        openapiOperations: [],
        composioTools: [],
        mcpTools: [],
        contracts: []
    };
    for (const pack of selectedPacks) {
        for (const tool of normalizeArray(pack.tools)) {
            if (!shouldIncludeTool(tool, options)) {
                continue;
            }
            const withPack = {
                ...cloneJson(tool),
                standardPackId: pack.id,
                standardPackLabel: pack.label,
                sourceName: tool.sourceName || pack.id
            };
            if (tool.sourceType === 'openapi_operation') {
                groups.openapiOperations.push(withPack);
            } else if (tool.sourceType === 'composio_tool') {
                groups.composioTools.push(withPack);
            } else if (tool.sourceType === 'mcp_tool') {
                groups.mcpTools.push(withPack);
            } else {
                groups.contracts.push(withPack);
            }
        }
    }
    return {
        status: 'completed',
        selectedPacks: selectedPacks.map((pack) => ({
            id: pack.id,
            label: pack.label,
            category: pack.category,
            toolCount: normalizeArray(pack.tools).length
        })),
        groups,
        counts: {
            packs: selectedPacks.length,
            openapiOperations: groups.openapiOperations.length,
            composioTools: groups.composioTools.length,
            mcpTools: groups.mcpTools.length,
            contracts: groups.contracts.length,
            totalTools: groups.openapiOperations.length + groups.composioTools.length + groups.mcpTools.length + groups.contracts.length
        }
    };
}

function collectStandardToolPackAuthProfiles(options = {}) {
    const selectedPacks = selectStandardToolPacks({
        packIds: options.packIds || options.standardToolPacks || options.packs,
        query: options.query,
        limit: options.limit
    });
    const byId = new Map();
    for (const pack of selectedPacks) {
        for (const profile of normalizeArray(pack.authProfiles)) {
            const cloned = {
                ...cloneJson(profile),
                standardPackId: pack.id,
                standardPackLabel: pack.label
            };
            byId.set(normalizeString(cloned.id).toLowerCase(), cloned);
        }
    }
    return [...byId.values()];
}

function publicReadonlyOpenApiOperationsFromStandardPacks(options = {}) {
    const collected = collectStandardToolPackContracts({
        ...options,
        includePublicReadonly: true,
        includeAuthRequired: false,
        includeLocalContracts: false
    });
    return collected.groups.openapiOperations.filter((tool) => normalizeString(tool.exposure) === 'public_readonly');
}

module.exports = {
    STANDARD_TOOL_PACK_VERSION,
    STANDARD_TOOL_PACKS,
    listStandardToolPacks,
    searchStandardToolPacks,
    selectStandardToolPacks,
    collectStandardToolPackContracts,
    collectStandardToolPackAuthProfiles,
    publicReadonlyOpenApiOperationsFromStandardPacks
};
