const fsp = require('fs/promises');
const path = require('path');
const { createHash, randomUUID } = require('crypto');

const DEFAULT_MAX_TEXT_CHARS = 8000;
const DEFAULT_GRID_ROWS = 80;
const DEFAULT_GRID_COLS = 40;
const CONTEXT_ARTIFACT_TOOL_ID = 'artifact_query';
const CONTEXT_ARTIFACT_COMPUTE_TOOL_ID = 'artifact_compute';

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeNumber(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.min(Math.max(Math.round(parsed), min), max);
}

function normalizeList(value) {
    if (Array.isArray(value)) {
        return value.map((entry) => normalizeString(entry)).filter(Boolean);
    }
    if (typeof value === 'string') {
        return value.split(/[,;\n]+/).map((entry) => normalizeString(entry)).filter(Boolean);
    }
    return [];
}

function safeSegment(value = '', fallback = 'artifact') {
    const normalized = normalizeString(value, fallback)
        .replace(/[^A-Za-z0-9_.-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 90);
    return normalized || fallback;
}

function stableHash(value = '') {
    return createHash('sha1').update(String(value || '')).digest('hex').slice(0, 16);
}

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function truncateText(text = '', maxChars = DEFAULT_MAX_TEXT_CHARS) {
    const source = String(text || '');
    const budget = Math.max(1000, Number(maxChars) || DEFAULT_MAX_TEXT_CHARS);
    if (source.length <= budget) {
        return { text: source, truncated: false, originalChars: source.length };
    }
    const marker = '\n... [artifact query preview truncated; ask a narrower query] ...\n';
    const remaining = Math.max(0, budget - marker.length);
    const head = Math.ceil(remaining * 0.7);
    const tail = remaining - head;
    return {
        text: `${source.slice(0, head)}${marker}${tail > 0 ? source.slice(-tail) : ''}`,
        truncated: true,
        originalChars: source.length
    };
}

function createTextResult(text, details = {}, structuredContent = undefined) {
    return {
        content: [{ type: 'text', text }],
        isError: details.ok === false || details.status === 'failed' || details.status === 'error',
        details,
        ...(structuredContent ? { structuredContent } : {})
    };
}

function createErrorResult(code, message, details = {}) {
    return createTextResult(message, {
        status: 'failed',
        ok: false,
        code,
        message,
        ...details
    });
}

function columnName(columnNumber) {
    let value = Number(columnNumber);
    let name = '';
    while (value > 0) {
        const remainder = (value - 1) % 26;
        name = String.fromCharCode(65 + remainder) + name;
        value = Math.floor((value - 1) / 26);
    }
    return name || 'A';
}

function columnNumber(letters = '') {
    return normalizeString(letters)
        .toUpperCase()
        .split('')
        .reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0);
}

function cellAddress(row, column) {
    return `${columnName(column)}${row}`;
}

function rangeAddress(bounds = {}) {
    return `${cellAddress(bounds.startRow, bounds.startCol)}:${cellAddress(bounds.endRow, bounds.endCol)}`;
}

function parseRange(value = '') {
    const raw = normalizeString(value).toUpperCase();
    if (!raw) {
        return null;
    }
    const single = raw.match(/^([A-Z]+)(\d+)$/);
    if (single) {
        const col = columnNumber(single[1]);
        const row = Number(single[2]);
        return { startRow: row, endRow: row, startCol: col, endCol: col };
    }
    const match = raw.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
    if (!match) {
        return null;
    }
    const startCol = columnNumber(match[1]);
    const startRow = Number(match[2]);
    const endCol = columnNumber(match[3]);
    const endRow = Number(match[4]);
    return {
        startRow: Math.min(startRow, endRow),
        endRow: Math.max(startRow, endRow),
        startCol: Math.min(startCol, endCol),
        endCol: Math.max(startCol, endCol)
    };
}

function parseCell(value = '') {
    const parsed = parseRange(value);
    if (!parsed || parsed.startRow !== parsed.endRow || parsed.startCol !== parsed.endCol) {
        return null;
    }
    return {
        row: parsed.startRow,
        col: parsed.startCol,
        address: cellAddress(parsed.startRow, parsed.startCol)
    };
}

function normalizeColor(value = '') {
    const raw = normalizeString(value).replace(/[^A-Fa-f0-9]/g, '').toUpperCase();
    if (raw.length === 8 && raw.startsWith('FF')) {
        return raw.slice(2);
    }
    return raw;
}

function mergeNestedArgs(args = {}) {
    const nested = [args.params, args.config, args.options]
        .find((entry) => entry && typeof entry === 'object' && !Array.isArray(entry)) || {};
    return { ...nested, ...args };
}

function rgbFromHex(value = '') {
    const color = normalizeColor(value);
    if (!/^[A-F0-9]{6}$/i.test(color)) {
        return null;
    }
    return {
        r: parseInt(color.slice(0, 2), 16),
        g: parseInt(color.slice(2, 4), 16),
        b: parseInt(color.slice(4, 6), 16)
    };
}

function colorLooksLikeName(hex = '', name = '') {
    const rgb = rgbFromHex(hex);
    const label = normalizeString(name).toLowerCase();
    if (!rgb || !label) {
        return false;
    }
    if (label === 'blue') return rgb.b >= 120 && rgb.b >= rgb.r + 40 && rgb.b >= rgb.g + 40;
    if (label === 'green') return rgb.g >= 120 && rgb.g >= rgb.r + 40 && rgb.g >= rgb.b - 20;
    if (label === 'yellow') return rgb.r >= 150 && rgb.g >= 150 && rgb.b <= 120;
    if (label === 'red') return rgb.r >= 140 && rgb.r >= rgb.g + 40 && rgb.r >= rgb.b + 40;
    if (label === 'black') return rgb.r <= 60 && rgb.g <= 60 && rgb.b <= 60;
    if (label === 'white') return rgb.r >= 220 && rgb.g >= 220 && rgb.b >= 220;
    return false;
}

function expandColorNameList(values = [], cells = []) {
    const fills = [...new Set(cells.map((cell) => normalizeColor(cell.fill)).filter(Boolean))];
    const expanded = [];
    for (const value of values) {
        const direct = normalizeColor(value);
        if (/^[A-F0-9]{6}$/i.test(direct)) {
            expanded.push(direct);
            continue;
        }
        const label = normalizeString(value).toLowerCase();
        const matches = fills.filter((fill) => colorLooksLikeName(fill, label));
        expanded.push(...matches);
    }
    return [...new Set(expanded.filter(Boolean))];
}

function extractColorHintsFromRuleText(text = '') {
    const raw = normalizeString(text);
    if (!raw) {
        return [];
    }
    const hints = [];
    for (const match of raw.matchAll(/\b(?:[A-Fa-f0-9]{6}|FF[A-Fa-f0-9]{6})\b/g)) {
        hints.push(match[0]);
    }
    for (const name of ['blue', 'green', 'yellow', 'red', 'black', 'white']) {
        if (new RegExp(`\\b${name}\\b`, 'i').test(raw)) {
            hints.push(name);
        }
    }
    return [...new Set(hints)];
}

function extractStepSizeFromRuleText(text = '') {
    const raw = normalizeString(text);
    const match = raw.match(/\b(\d+)\s*(?:cells?|steps?|moves?|squares?)\s*(?:per|\/)\s*turn\b/i);
    if (match) {
        return Number(match[1]);
    }
    return 0;
}

function sheetBySelection(payload = {}, args = {}) {
    const sheets = payload.workbook?.sheets || [];
    const explicitName = normalizeString(args.sheet || args.sheetName || args.sheet_name || args.worksheet);
    if (explicitName) {
        return sheets.find((sheet) => normalizeString(sheet.name).toLowerCase() === explicitName.toLowerCase()) || null;
    }
    const sheetIndex = Number(args.sheetIndex || args.sheet_index || 1);
    if (Number.isFinite(sheetIndex) && sheetIndex > 0) {
        return sheets[sheetIndex - 1] || null;
    }
    return sheets[0] || null;
}

function getSpreadsheetStoredBounds(sheet = {}) {
    const rows = sheet.grids?.display || [];
    const rowNumbers = sheet.grids?.rowNumbers || [];
    const columns = sheet.grids?.columns || [];
    const firstRow = rowNumbers[0] || 1;
    const firstCol = columns[0] ? columnNumber(columns[0]) : 1;
    const lastRow = rowNumbers.length ? rowNumbers[rowNumbers.length - 1] : firstRow + Math.max(0, rows.length - 1);
    const lastCol = columns.length ? firstCol + columns.length - 1 : firstCol;
    return {
        firstRow,
        firstCol,
        lastRow,
        lastCol,
        rowCount: rows.length,
        columnCount: columns.length
    };
}

function buildSpreadsheetGridCoverage(sheet = {}, args = {}) {
    const rows = sheet.grids?.display || [];
    const rowNumbers = sheet.grids?.rowNumbers || [];
    const columns = sheet.grids?.columns || [];
    const stored = getSpreadsheetStoredBounds(sheet);
    const maxRows = normalizeNumber(args.maxRows || args.max_rows || args.limitRows, DEFAULT_GRID_ROWS, 1, 500);
    const maxCols = normalizeNumber(args.maxCols || args.max_cols || args.limitCols, DEFAULT_GRID_COLS, 1, 200);
    const rowCount = Math.min(rows.length, maxRows);
    const columnCount = Math.min(columns.length, maxCols);
    const startRow = rowNumbers[0] || stored.firstRow;
    const startCol = columns[0] ? columnNumber(columns[0]) : stored.firstCol;
    const endRow = rowCount > 0 ? (rowNumbers[rowCount - 1] || startRow + rowCount - 1) : startRow;
    const endCol = columnCount > 0 ? startCol + columnCount - 1 : startCol;
    const complete = rowCount === rows.length && columnCount === columns.length;
    return {
        kind: 'spreadsheet_range_coverage',
        queryAction: 'grid',
        sheet: sheet.name || '',
        range: rangeAddress({ startRow, startCol, endRow, endCol }),
        startRow,
        endRow,
        startCol,
        endCol,
        rowCount,
        columnCount,
        storedRange: rangeAddress({
            startRow: stored.firstRow,
            startCol: stored.firstCol,
            endRow: stored.lastRow,
            endCol: stored.lastCol
        }),
        storedRows: rows.length,
        storedColumns: columns.length,
        complete,
        truncated: !complete
    };
}

function buildSpreadsheetRangeCoverage(sheet = {}, parsedRange = {}, outsideStoredRange = false, returnedCells = 0) {
    const stored = getSpreadsheetStoredBounds(sheet);
    const coverage = {
        kind: 'spreadsheet_range_coverage',
        queryAction: 'range',
        sheet: sheet.name || '',
        range: rangeAddress(parsedRange),
        startRow: parsedRange.startRow,
        endRow: parsedRange.endRow,
        startCol: parsedRange.startCol,
        endCol: parsedRange.endCol,
        rowCount: Math.max(0, parsedRange.endRow - parsedRange.startRow + 1),
        columnCount: Math.max(0, parsedRange.endCol - parsedRange.startCol + 1),
        returnedCells,
        storedRange: rangeAddress({
            startRow: stored.firstRow,
            startCol: stored.firstCol,
            endRow: stored.lastRow,
            endCol: stored.lastCol
        }),
        complete: !outsideStoredRange,
        truncated: false,
        outsideStoredRange
    };
    return coverage;
}

function createPinnedEvidence(record = {}, details = {}) {
    const coverage = details.coverage && typeof details.coverage === 'object' ? details.coverage : null;
    if (!coverage || details.complete !== true || details.truncated === true || details.reasoningReady !== true) {
        return null;
    }
    const basis = [
        record.id,
        details.action,
        coverage.sheet || details.sheet,
        coverage.range || details.range,
        coverage.queryAction
    ].filter(Boolean).join(':');
    const evidenceId = `ev-${stableHash(basis)}`;
    return {
        evidenceId,
        artifactId: record.id,
        artifactKind: record.kind,
        artifactType: record.type,
        sourceTool: CONTEXT_ARTIFACT_TOOL_ID,
        action: details.action,
        sheet: coverage.sheet || details.sheet || '',
        range: coverage.range || details.range || '',
        coverage,
        complete: true,
        truncated: false,
        reasoningReady: true,
        claim: [
            'Complete artifact evidence is already available',
            coverage.sheet ? `sheet=${coverage.sheet}` : '',
            coverage.range ? `range=${coverage.range}` : ''
        ].filter(Boolean).join('; '),
        createdAt: new Date().toISOString()
    };
}

function sameSheetName(left = '', right = '') {
    return normalizeString(left).toLowerCase() === normalizeString(right).toLowerCase();
}

function coverageContains(outer = {}, inner = {}) {
    if (!outer || !inner || outer.kind !== inner.kind) {
        return false;
    }
    if (!sameSheetName(outer.sheet, inner.sheet)) {
        return false;
    }
    for (const field of ['startRow', 'endRow', 'startCol', 'endCol']) {
        if (!Number.isFinite(Number(outer[field])) || !Number.isFinite(Number(inner[field]))) {
            return false;
        }
    }
    return Number(outer.startRow) <= Number(inner.startRow) &&
        Number(outer.endRow) >= Number(inner.endRow) &&
        Number(outer.startCol) <= Number(inner.startCol) &&
        Number(outer.endCol) >= Number(inner.endCol);
}

function findCoveringEvidence(record = {}, coverage = null, skipEvidenceId = '') {
    if (!coverage || !record?.metadata || typeof record.metadata !== 'object') {
        return null;
    }
    const pinned = Array.isArray(record.metadata.pinnedEvidence) ? record.metadata.pinnedEvidence : [];
    const match = pinned.find((entry) =>
        entry?.evidenceId &&
        entry.evidenceId !== skipEvidenceId &&
        entry.complete === true &&
        entry.truncated !== true &&
        entry.reasoningReady === true &&
        coverageContains(entry.coverage, coverage)
    );
    if (!match) {
        return null;
    }
    return {
        evidenceId: match.evidenceId,
        artifactId: match.artifactId,
        action: match.action,
        sheet: match.sheet,
        range: match.range,
        claim: match.claim,
        complete: true,
        truncated: false,
        reasoningReady: true
    };
}

function formatSpreadsheetSummary(record = {}, payload = {}) {
    const sheets = payload.workbook?.sheets || [];
    const lines = [
        'ARTIFACT_SUMMARY',
        `artifactId=${record.id}`,
        `kind=${record.kind || 'unknown'}`,
        record.sourcePath ? `source=${record.sourcePath}` : '',
        record.summary ? `summary=${record.summary}` : '',
        `sheets=${sheets.map((sheet) => sheet.name).join(', ') || '(none)'}`,
        'observation_contract=complete:true truncated:false reasoning_ready:true',
        'query_tools=artifact_query actions: summary, grid, range, search, schema'
    ].filter(Boolean);
    for (const sheet of sheets.slice(0, 12)) {
        lines.push(
            `Sheet "${sheet.name}": range=${sheet.dimensions?.inspectedRange || ''} rows=${sheet.dimensions?.rowCount || 0} cols=${sheet.dimensions?.columnCount || 0} complete=${sheet.completeness?.allRequestedCellsIncluded !== false}`
        );
        if (sheet.colorLegend?.length) {
            lines.push(`  fillColors=${sheet.colorLegend.map((entry) => `${entry.rgb}:${entry.count}`).join(', ')}`);
        }
        if (sheet.nonEmptyCells?.length) {
            lines.push(`  nonEmpty=${sheet.nonEmptyCells.slice(0, 24).map((cell) => `${cell.address}=${JSON.stringify(cell.value)}${cell.fill ? `#${cell.fill}` : ''}`).join('; ')}`);
        }
    }
    if (sheets.length > 12) {
        lines.push(`... ${sheets.length - 12} more sheets omitted; query a specific sheet.`);
    }
    return lines.join('\n');
}

function formatSpreadsheetGrid(sheet = {}, args = {}) {
    const rows = sheet.grids?.display || [];
    const fills = sheet.grids?.fills || [];
    const rowNumbers = sheet.grids?.rowNumbers || [];
    const columns = sheet.grids?.columns || [];
    const maxRows = normalizeNumber(args.maxRows || args.max_rows || args.limitRows, DEFAULT_GRID_ROWS, 1, 500);
    const maxCols = normalizeNumber(args.maxCols || args.max_cols || args.limitCols, DEFAULT_GRID_COLS, 1, 200);
    const visibleRows = rows.slice(0, maxRows);
    const visibleColumns = columns.slice(0, maxCols);
    const lines = [
        `SPREADSHEET_GRID sheet=${JSON.stringify(sheet.name || '')}`,
        `range=${sheet.dimensions?.inspectedRange || ''} returnedRows=${visibleRows.length}/${rows.length} returnedCols=${visibleColumns.length}/${columns.length}`,
        `complete=${visibleRows.length === rows.length && visibleColumns.length === columns.length}`
    ];
    for (let index = 0; index < visibleRows.length; index += 1) {
        const rowNo = rowNumbers[index] || index + 1;
        const row = visibleRows[index].slice(0, maxCols).map((value, colIndex) => {
            const text = normalizeString(value);
            const fill = fills[index]?.[colIndex] || '';
            return text || fill || '.';
        });
        lines.push(`Row ${String(rowNo).padStart(3, ' ')}: ${row.join(' | ')}`);
    }
    if (rows.length > visibleRows.length || columns.length > visibleColumns.length) {
        lines.push('truncated=true; ask artifact_query range/search for a narrower slice.');
    } else {
        lines.push('truncated=false; reasoning_ready=true');
    }
    return lines.join('\n');
}

function formatSpreadsheetRange(sheet = {}, args = {}) {
    const parsedRange = parseRange(args.range || args.addressRange || args.address_range || '');
    if (!parsedRange) {
        return createErrorResult('invalid_range', 'artifact_query range requires an A1 range such as A1:D20.', {
            action: 'range',
            artifactId: args.artifactId || args.id
        });
    }
    const rows = sheet.grids?.display || [];
    const fills = sheet.grids?.fills || [];
    const rowNumbers = sheet.grids?.rowNumbers || [];
    const columns = sheet.grids?.columns || [];
    const firstRow = rowNumbers[0] || 1;
    const firstCol = columns[0] ? columnNumber(columns[0]) : 1;
    const lastRow = rowNumbers.length ? rowNumbers[rowNumbers.length - 1] : firstRow - 1;
    const lastCol = columns.length ? firstCol + columns.length - 1 : firstCol - 1;
    const lines = [
        `SPREADSHEET_RANGE sheet=${JSON.stringify(sheet.name || '')} range=${args.range || args.addressRange || args.address_range}`,
        'display=value if present, otherwise fill RGB, "." for empty/no fill'
    ];
    let returnedCells = 0;
    let outsideStoredRange = false;
    for (let row = parsedRange.startRow; row <= parsedRange.endRow; row += 1) {
        const rowIndex = row - firstRow;
        const values = [];
        for (let col = parsedRange.startCol; col <= parsedRange.endCol; col += 1) {
            const colIndex = col - firstCol;
            if (row < firstRow || row > lastRow || col < firstCol || col > lastCol) {
                outsideStoredRange = true;
                values.push('[outside-artifact]');
                returnedCells += 1;
                continue;
            }
            const text = normalizeString(rows[rowIndex]?.[colIndex]);
            const fill = fills[rowIndex]?.[colIndex] || '';
            values.push(text || fill || '.');
            returnedCells += 1;
        }
        lines.push(`Row ${String(row).padStart(3, ' ')}: ${values.join(' | ')}`);
    }
    lines.push(`returnedCells=${returnedCells}`);
    const coverage = buildSpreadsheetRangeCoverage(sheet, parsedRange, outsideStoredRange, returnedCells);
    if (outsideStoredRange) {
        lines.push(`storedRange=${cellAddress(firstRow, firstCol)}:${cellAddress(lastRow, lastCol)}`);
        lines.push('outsideStoredRange=true; complete=false; reasoning_ready=false; rerun read_xlsx_workbook with a wider range/maxRows/maxCols.');
    } else {
        lines.push('truncated=false; complete=true; reasoning_ready=true');
    }
    return createTextResult(lines.join('\n'), {
        status: 'completed',
        ok: !outsideStoredRange,
        action: 'range',
        artifactId: args.artifactId || args.id,
        sheet: sheet.name || '',
        range: args.range || args.addressRange || args.address_range,
        returnedCells,
        outsideStoredRange,
        coverage,
        complete: !outsideStoredRange,
        truncated: false,
        reasoningReady: !outsideStoredRange,
        observationContract: {
            complete: !outsideStoredRange,
            truncated: false,
            reasoning_ready: !outsideStoredRange
        }
    });
}

function searchSpreadsheet(payload = {}, args = {}) {
    const query = normalizeString(args.query || args.q || args.text).toLowerCase();
    if (!query) {
        return createErrorResult('missing_query', 'artifact_query search requires query/q/text.', {
            action: 'search',
            artifactId: args.artifactId || args.id
        });
    }
    const limit = normalizeNumber(args.limit, 50, 1, 500);
    const matches = [];
    for (const sheet of payload.workbook?.sheets || []) {
        for (const cell of sheet.cells || []) {
            const haystack = [
                cell.address,
                cell.value,
                cell.text,
                cell.formula?.formula,
                cell.formula?.result,
                cell.fill?.fgRgb,
                cell.fill?.bgRgb
            ].filter((entry) => entry !== null && entry !== undefined).join(' ').toLowerCase();
            if (haystack.includes(query)) {
                matches.push({
                    sheet: sheet.name,
                    address: cell.address,
                    value: cell.value,
                    text: cell.text,
                    fill: cell.fill?.fgRgb || '',
                    formula: cell.formula?.formula || ''
                });
                if (matches.length >= limit) {
                    break;
                }
            }
        }
        if (matches.length >= limit) {
            break;
        }
    }
    const lines = [
        `ARTIFACT_SEARCH artifactId=${args.artifactId || args.id} query=${JSON.stringify(query)}`,
        `matches=${matches.length} limit=${limit}`,
        ...matches.map((match) =>
            `${match.sheet}!${match.address}: value=${JSON.stringify(match.value)} text=${JSON.stringify(match.text)} fill=${match.fill || '-'} formula=${match.formula || '-'}`
        ),
        `truncated=${matches.length >= limit}; reasoning_ready=true`
    ];
    return createTextResult(lines.join('\n'), {
        status: 'completed',
        ok: true,
        action: 'search',
        artifactId: args.artifactId || args.id,
        query,
        matchCount: matches.length,
        matches,
        truncated: matches.length >= limit,
        reasoningReady: true
    }, {
        matches,
        truncated: matches.length >= limit
    });
}

function getTextArtifactPayload(payload = {}) {
    const artifact = payload.textArtifact || payload.text_artifact || null;
    if (artifact && typeof artifact === 'object') {
        return {
            ...artifact,
            text: String(artifact.text || '')
        };
    }
    if (typeof payload.text === 'string') {
        return {
            text: payload.text,
            path: payload.path || payload.sourcePath || '',
            encoding: payload.encoding || 'utf8'
        };
    }
    return null;
}

function getDocumentArtifactPayload(payload = {}) {
    const artifact = payload.documentArtifact || payload.document_artifact || null;
    if (artifact && typeof artifact === 'object') {
        return {
            ...artifact,
            text: String(artifact.text || '')
        };
    }
    return null;
}

function splitLines(text = '') {
    return String(text || '').split(/\r?\n/);
}

function numberedLines(lines = [], startLine = 1) {
    return lines.map((line, index) => `${String(startLine + index).padStart(5, ' ')}: ${line}`).join('\n');
}

function formatTextArtifactSummary(record = {}, textArtifact = {}) {
    const text = String(textArtifact.text || '');
    const lines = splitLines(text);
    const previewLines = lines.slice(0, 24);
    return [
        'TEXT_ARTIFACT_SUMMARY',
        `artifactId=${record.id}`,
        `source=${record.sourcePath || textArtifact.path || ''}`,
        `bytes=${record.payloadBytes || textArtifact.bytes || 0} chars=${text.length} lines=${lines.length}`,
        `encoding=${textArtifact.encoding || 'utf8'} type=${textArtifact.type || record.type || 'text'}`,
        'query_tools=artifact_query actions: text_schema, text_range, text_search, text_tail',
        'observation_contract=complete:true truncated:false reasoning_ready:true',
        '--- first lines ---',
        numberedLines(previewLines, 1),
        lines.length > previewLines.length ? `... ${lines.length - previewLines.length} more lines; use text_range/text_search/text_tail.` : ''
    ].filter(Boolean).join('\n');
}

function textSchemaResult(record = {}, textArtifact = {}) {
    return createTextResult(JSON.stringify({
        artifactId: record.id,
        kind: record.kind,
        type: record.type,
        sourcePath: record.sourcePath || textArtifact.path || '',
        actions: ['summary', 'text_schema', 'text_range', 'text_search', 'text_tail'],
        args: {
            text_range: {
                startLine: '1-based line start',
                endLine: '1-based line end',
                offset: 'optional character offset',
                limit: 'optional character count'
            },
            text_search: {
                query: 'literal text or regex pattern',
                regex: false,
                caseSensitive: false,
                maxResults: 50,
                contextLines: 1
            },
            text_tail: {
                lines: 80,
                chars: 'optional character tail limit'
            }
        },
        metrics: {
            chars: String(textArtifact.text || '').length,
            lines: splitLines(textArtifact.text || '').length,
            payloadBytes: record.payloadBytes
        }
    }, null, 2), {
        status: 'completed',
        ok: true,
        action: 'text_schema',
        artifactId: record.id,
        complete: true,
        truncated: false,
        reasoningReady: true
    });
}

function textRangeResult(record = {}, textArtifact = {}, args = {}) {
    const text = String(textArtifact.text || '');
    const hasOffset = args.offset !== undefined || args.start !== undefined;
    if (hasOffset) {
        const offset = normalizeNumber(args.offset ?? args.start, 0, 0, Math.max(0, text.length));
        const limit = normalizeNumber(args.limit || args.maxChars || args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1, 200000);
        const slice = text.slice(offset, offset + limit);
        const nextOffset = offset + slice.length;
        return createTextResult([
            `TEXT_ARTIFACT_RANGE artifactId=${record.id} offset=${offset} limit=${limit}`,
            `charsReturned=${slice.length} nextOffset=${nextOffset} hasMore=${nextOffset < text.length}`,
            'observation_contract=complete:true truncated:false reasoning_ready:true',
            '--- text ---',
            slice
        ].join('\n'), {
            status: 'completed',
            ok: true,
            action: 'text_range',
            artifactId: record.id,
            offset,
            limit,
            charsReturned: slice.length,
            nextOffset,
            hasMore: nextOffset < text.length,
            complete: true,
            truncated: false,
            reasoningReady: true
        }, { text: slice, offset, nextOffset, hasMore: nextOffset < text.length });
    }
    const lines = splitLines(text);
    const startLine = normalizeNumber(args.startLine || args.start_line || args.lineStart || args.line_start, 1, 1, Math.max(1, lines.length));
    const defaultEnd = Math.min(lines.length, startLine + 119);
    const endLine = normalizeNumber(args.endLine || args.end_line || args.lineEnd || args.line_end, defaultEnd, startLine, Math.max(startLine, lines.length));
    const selected = lines.slice(startLine - 1, endLine);
    return createTextResult([
        `TEXT_ARTIFACT_RANGE artifactId=${record.id} lines=${startLine}-${endLine}/${lines.length}`,
        `hasMore=${endLine < lines.length}`,
        'observation_contract=complete:true truncated:false reasoning_ready:true',
        '--- lines ---',
        numberedLines(selected, startLine)
    ].join('\n'), {
        status: 'completed',
        ok: true,
        action: 'text_range',
        artifactId: record.id,
        startLine,
        endLine,
        lineCount: lines.length,
        hasMore: endLine < lines.length,
        complete: true,
        truncated: false,
        reasoningReady: true
    }, { lines: selected, startLine, endLine, hasMore: endLine < lines.length });
}

function compileSearchMatcher(args = {}) {
    const query = normalizeString(args.query || args.q || args.text || args.pattern);
    if (!query) {
        return { error: 'missing_query' };
    }
    if (args.regex === true) {
        try {
            const flags = args.caseSensitive === true ? 'g' : 'gi';
            const regex = new RegExp(query, flags);
            return { query, test: (line) => regex.test(line) };
        } catch (error) {
            return { error: 'invalid_regex', message: error?.message || String(error), query };
        }
    }
    const needle = args.caseSensitive === true ? query : query.toLowerCase();
    return {
        query,
        test: (line) => {
            const haystack = args.caseSensitive === true ? String(line || '') : String(line || '').toLowerCase();
            return haystack.includes(needle);
        }
    };
}

function searchTextLines({ record = {}, text = '', args = {}, action = 'text_search', pageNumber = null } = {}) {
    const matcher = compileSearchMatcher(args);
    if (matcher.error) {
        return createErrorResult(matcher.error, matcher.message || `${action} requires query/q/text.`, {
            action,
            artifactId: record.id,
            query: matcher.query
        });
    }
    const lines = splitLines(text);
    const limit = normalizeNumber(args.maxResults || args.max_results || args.limit, 50, 1, 500);
    const contextLines = normalizeNumber(args.contextLines || args.context_lines, 1, 0, 10);
    const matches = [];
    for (let index = 0; index < lines.length; index += 1) {
        if (!matcher.test(lines[index])) {
            continue;
        }
        const start = Math.max(0, index - contextLines);
        const end = Math.min(lines.length, index + contextLines + 1);
        matches.push({
            line: index + 1,
            ...(pageNumber ? { page: pageNumber } : {}),
            text: lines[index],
            context: lines.slice(start, end).map((line, offset) => ({
                line: start + offset + 1,
                text: line
            }))
        });
        if (matches.length >= limit) {
            break;
        }
    }
    return createTextResult(JSON.stringify({
        status: 'completed',
        action,
        artifactId: record.id,
        query: matcher.query,
        matchCount: matches.length,
        truncated: matches.length >= limit,
        matches
    }, null, 2), {
        status: 'completed',
        ok: true,
        action,
        artifactId: record.id,
        query: matcher.query,
        matchCount: matches.length,
        matches,
        truncated: matches.length >= limit,
        complete: true,
        reasoningReady: true
    }, { matches });
}

function textTailResult(record = {}, textArtifact = {}, args = {}) {
    const text = String(textArtifact.text || '');
    if (args.chars || args.maxChars || args.max_chars) {
        const chars = normalizeNumber(args.chars || args.maxChars || args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1, 200000);
        const slice = text.slice(-chars);
        return createTextResult([
            `TEXT_ARTIFACT_TAIL artifactId=${record.id} chars=${slice.length}/${text.length}`,
            'observation_contract=complete:true truncated:false reasoning_ready:true',
            '--- tail ---',
            slice
        ].join('\n'), {
            status: 'completed',
            ok: true,
            action: 'text_tail',
            artifactId: record.id,
            charsReturned: slice.length,
            complete: true,
            truncated: false,
            reasoningReady: true
        }, { text: slice });
    }
    const allLines = splitLines(text);
    const lineCount = normalizeNumber(args.lines || args.limit, 80, 1, 5000);
    const startLine = Math.max(1, allLines.length - lineCount + 1);
    const selected = allLines.slice(startLine - 1);
    return createTextResult([
        `TEXT_ARTIFACT_TAIL artifactId=${record.id} lines=${startLine}-${allLines.length}/${allLines.length}`,
        'observation_contract=complete:true truncated:false reasoning_ready:true',
        '--- tail lines ---',
        numberedLines(selected, startLine)
    ].join('\n'), {
        status: 'completed',
        ok: true,
        action: 'text_tail',
        artifactId: record.id,
        startLine,
        endLine: allLines.length,
        complete: true,
        truncated: false,
        reasoningReady: true
    }, { lines: selected, startLine, endLine: allLines.length });
}

function formatDocumentArtifactSummary(record = {}, documentArtifact = {}) {
    const pages = Array.isArray(documentArtifact.pages) ? documentArtifact.pages : [];
    const sections = Array.isArray(documentArtifact.sections) ? documentArtifact.sections : [];
    const text = String(documentArtifact.text || '');
    const preview = truncateText(text, 4000);
    return [
        'DOCUMENT_ARTIFACT_SUMMARY',
        `artifactId=${record.id}`,
        `source=${record.sourcePath || documentArtifact.path || ''}`,
        `format=${documentArtifact.format || record.type || 'document'} parser=${documentArtifact.parser || 'unknown'}`,
        `pages=${pages.length} sections=${sections.length} chars=${text.length} lines=${splitLines(text).length}`,
        'query_tools=artifact_query actions: document_schema, document_search, document_page, document_section',
        'observation_contract=complete:true truncated:false reasoning_ready:true',
        '--- preview ---',
        preview.text
    ].filter(Boolean).join('\n');
}

function documentSchemaResult(record = {}, documentArtifact = {}) {
    return createTextResult(JSON.stringify({
        artifactId: record.id,
        kind: record.kind,
        type: record.type,
        sourcePath: record.sourcePath || documentArtifact.path || '',
        actions: ['summary', 'document_schema', 'document_search', 'document_page', 'document_section'],
        args: {
            document_search: {
                query: 'literal text or regex pattern',
                regex: false,
                caseSensitive: false,
                maxResults: 50,
                contextLines: 1
            },
            document_page: {
                page: '1-based page number'
            },
            document_section: {
                index: '0-based section index',
                title: 'optional title contains match',
                query: 'optional section text/title contains match'
            }
        },
        metrics: {
            chars: String(documentArtifact.text || '').length,
            lines: splitLines(documentArtifact.text || '').length,
            pages: Array.isArray(documentArtifact.pages) ? documentArtifact.pages.length : 0,
            sections: Array.isArray(documentArtifact.sections) ? documentArtifact.sections.length : 0,
            payloadBytes: record.payloadBytes
        }
    }, null, 2), {
        status: 'completed',
        ok: true,
        action: 'document_schema',
        artifactId: record.id,
        complete: true,
        truncated: false,
        reasoningReady: true
    });
}

function documentSearchResult(record = {}, documentArtifact = {}, args = {}) {
    const pages = Array.isArray(documentArtifact.pages) ? documentArtifact.pages : [];
    if (!pages.length) {
        return searchTextLines({ record, text: documentArtifact.text || '', args, action: 'document_search' });
    }
    const matcher = compileSearchMatcher(args);
    if (matcher.error) {
        return createErrorResult(matcher.error, matcher.message || 'document_search requires query/q/text.', {
            action: 'document_search',
            artifactId: record.id,
            query: matcher.query
        });
    }
    const limit = normalizeNumber(args.maxResults || args.max_results || args.limit, 50, 1, 500);
    const contextLines = normalizeNumber(args.contextLines || args.context_lines, 1, 0, 10);
    const matches = [];
    for (const page of pages) {
        const pageNo = Number(page.pageNumber || page.page || 1);
        const lines = splitLines(page.text || '');
        for (let index = 0; index < lines.length; index += 1) {
            if (!matcher.test(lines[index])) {
                continue;
            }
            const start = Math.max(0, index - contextLines);
            const end = Math.min(lines.length, index + contextLines + 1);
            matches.push({
                page: pageNo,
                line: index + 1,
                text: lines[index],
                context: lines.slice(start, end).map((line, offset) => ({
                    page: pageNo,
                    line: start + offset + 1,
                    text: line
                }))
            });
            if (matches.length >= limit) {
                break;
            }
        }
        if (matches.length >= limit) {
            break;
        }
    }
    return createTextResult(JSON.stringify({
        status: 'completed',
        action: 'document_search',
        artifactId: record.id,
        query: matcher.query,
        matchCount: matches.length,
        truncated: matches.length >= limit,
        matches
    }, null, 2), {
        status: 'completed',
        ok: true,
        action: 'document_search',
        artifactId: record.id,
        query: matcher.query,
        matchCount: matches.length,
        matches,
        truncated: matches.length >= limit,
        complete: true,
        reasoningReady: true
    }, { matches });
}

function documentPageResult(record = {}, documentArtifact = {}, args = {}) {
    const pages = Array.isArray(documentArtifact.pages) ? documentArtifact.pages : [];
    const pageNumber = normalizeNumber(args.page || args.pageNumber || args.page_number, 1, 1, Math.max(1, pages.length || 1));
    const page = pages.find((entry) => Number(entry.pageNumber || entry.page) === pageNumber) ||
        (pageNumber === 1 ? { pageNumber: 1, text: documentArtifact.text || '' } : null);
    if (!page) {
        return createErrorResult('page_not_found', `No page ${pageNumber} in document artifact.`, {
            action: 'document_page',
            artifactId: record.id,
            availablePages: pages.map((entry) => entry.pageNumber || entry.page)
        });
    }
    return createTextResult([
        `DOCUMENT_ARTIFACT_PAGE artifactId=${record.id} page=${pageNumber}`,
        'observation_contract=complete:true truncated:false reasoning_ready:true',
        '--- page text ---',
        page.text || ''
    ].join('\n'), {
        status: 'completed',
        ok: true,
        action: 'document_page',
        artifactId: record.id,
        page: pageNumber,
        chars: String(page.text || '').length,
        complete: true,
        truncated: false,
        reasoningReady: true
    }, { page });
}

function documentSectionResult(record = {}, documentArtifact = {}, args = {}) {
    const sections = Array.isArray(documentArtifact.sections) ? documentArtifact.sections : [];
    const explicitIndex = args.index ?? args.sectionIndex ?? args.section_index;
    const title = normalizeString(args.title);
    const query = normalizeString(args.query || args.q || args.text);
    let section = null;
    if (explicitIndex !== undefined) {
        const index = normalizeNumber(explicitIndex, 0, 0, Math.max(0, sections.length - 1));
        section = sections[index] || null;
    } else if (title || query) {
        const needle = (title || query).toLowerCase();
        section = sections.find((entry) =>
            `${entry.title || ''}\n${entry.text || ''}`.toLowerCase().includes(needle)
        ) || null;
    } else {
        section = sections[0] || null;
    }
    if (!section) {
        return createErrorResult('section_not_found', 'No matching section in document artifact.', {
            action: 'document_section',
            artifactId: record.id,
            availableSections: sections.slice(0, 40).map((entry, index) => ({
                index,
                title: entry.title || ''
            }))
        });
    }
    return createTextResult([
        `DOCUMENT_ARTIFACT_SECTION artifactId=${record.id} index=${section.index ?? sections.indexOf(section)} title=${JSON.stringify(section.title || '')}`,
        'observation_contract=complete:true truncated:false reasoning_ready:true',
        '--- section text ---',
        section.text || ''
    ].join('\n'), {
        status: 'completed',
        ok: true,
        action: 'document_section',
        artifactId: record.id,
        sectionIndex: section.index ?? sections.indexOf(section),
        title: section.title || '',
        chars: String(section.text || '').length,
        complete: true,
        truncated: false,
        reasoningReady: true
    }, { section });
}

function spreadsheetSheetsForCompute(payload = {}, args = {}) {
    const sheet = sheetBySelection(payload, args);
    if (normalizeString(args.sheet || args.sheetName || args.sheet_name || args.worksheet) || args.sheetIndex || args.sheet_index) {
        return sheet ? [sheet] : [];
    }
    return payload.workbook?.sheets || [];
}

function profileSpreadsheetArtifact(record = {}, payload = {}, args = {}) {
    const sheets = spreadsheetSheetsForCompute(payload, args);
    if (!sheets.length) {
        return createErrorResult('sheet_not_found', 'artifact_compute profile could not find the requested worksheet.', {
            action: 'profile',
            artifactId: record.id,
            availableSheets: (payload.workbook?.sheets || []).map((entry) => entry.name)
        });
    }
    const profiles = sheets.slice(0, normalizeNumber(args.limit, 12, 1, 100)).map((sheet) => {
        const rows = sheet.grids?.display || [];
        const fills = sheet.grids?.fills || [];
        const fillCounts = new Map();
        for (const row of fills) {
            for (const fill of row || []) {
                const normalized = normalizeColor(fill);
                if (normalized) {
                    fillCounts.set(normalized, (fillCounts.get(normalized) || 0) + 1);
                }
            }
        }
        return {
            sheet: sheet.name || '',
            inspectedRange: sheet.dimensions?.inspectedRange || '',
            rows: rows.length,
            columns: sheet.grids?.columns?.length || 0,
            nonEmptyCells: sheet.nonEmptyCells?.length || 0,
            formulas: sheet.formulas?.length || 0,
            mergedRanges: sheet.mergedRanges?.length || 0,
            fillColors: [...fillCounts.entries()]
                .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
                .slice(0, 16)
                .map(([rgb, count]) => ({ rgb, count })),
            complete: sheet.completeness?.allRequestedCellsIncluded !== false
        };
    });
    const lines = [
        `ARTIFACT_COMPUTE_PROFILE artifactId=${record.id}`,
        `kind=${record.kind} sheetsProfiled=${profiles.length}/${payload.workbook?.sheets?.length || profiles.length}`,
        ...profiles.map((profile) =>
            `Sheet "${profile.sheet}": range=${profile.inspectedRange} rows=${profile.rows} cols=${profile.columns} nonEmpty=${profile.nonEmptyCells} formulas=${profile.formulas} merged=${profile.mergedRanges} fills=${profile.fillColors.map((fill) => `${fill.rgb}:${fill.count}`).join(', ') || '-'} complete=${profile.complete}`
        ),
        'observation_contract=complete:true truncated:false reasoning_ready:true'
    ];
    return createTextResult(lines.join('\n'), {
        status: 'completed',
        ok: true,
        action: 'profile',
        artifactId: record.id,
        complete: true,
        truncated: false,
        reasoningReady: true,
        observationContract: {
            complete: true,
            truncated: false,
            reasoning_ready: true
        }
    }, {
        profiles
    });
}

function buildSpreadsheetCellMatrix(sheet = {}, args = {}) {
    const rows = sheet.grids?.display || [];
    const fills = sheet.grids?.fills || [];
    const rowNumbers = sheet.grids?.rowNumbers || [];
    const columns = sheet.grids?.columns || [];
    const stored = getSpreadsheetStoredBounds(sheet);
    const parsedRange = parseRange(args.range || args.addressRange || args.address_range || '');
    const startRow = parsedRange ? Math.max(parsedRange.startRow, stored.firstRow) : stored.firstRow;
    const endRow = parsedRange ? Math.min(parsedRange.endRow, stored.lastRow) : stored.lastRow;
    const startCol = parsedRange ? Math.max(parsedRange.startCol, stored.firstCol) : stored.firstCol;
    const endCol = parsedRange ? Math.min(parsedRange.endCol, stored.lastCol) : stored.lastCol;
    const matrix = [];
    const cells = [];
    for (let row = startRow; row <= endRow; row += 1) {
        const rowIndex = row - stored.firstRow;
        const matrixRow = [];
        for (let col = startCol; col <= endCol; col += 1) {
            const colIndex = col - stored.firstCol;
            const fill = normalizeColor(fills[rowIndex]?.[colIndex] || '');
            const display = normalizeString(rows[rowIndex]?.[colIndex]);
            const cell = {
                row,
                col,
                address: cellAddress(row, col),
                display,
                fill
            };
            matrixRow.push(cell);
            cells.push(cell);
        }
        matrix.push(matrixRow);
    }
    return {
        matrix,
        cells,
        bounds: {
            startRow,
            endRow,
            startCol,
            endCol,
            range: rangeAddress({ startRow, endRow, startCol, endCol })
        },
        storedRange: rangeAddress({
            startRow: stored.firstRow,
            endRow: stored.lastRow,
            startCol: stored.firstCol,
            endCol: stored.lastCol
        })
    };
}

function buildEndpointCriteria(args = {}, prefix = 'start', defaults = []) {
    const direct = normalizeString(args[prefix]);
    const address = normalizeString(args[`${prefix}Address`] || args[`${prefix}_address`] || args[`${prefix}CellAddress`] || args[`${prefix}_cell_address`] || (parseCell(direct) ? direct : ''));
    const query = normalizeString(
        args[`${prefix}Query`] ||
        args[`${prefix}_query`] ||
        args[`${prefix}Value`] ||
        args[`${prefix}_value`] ||
        args[`${prefix}Label`] ||
        args[`${prefix}_label`] ||
        args[`${prefix}Cell`] ||
        args[`${prefix}_cell`] ||
        (!parseCell(direct) ? direct : '')
    );
    const fill = normalizeColor(args[`${prefix}Fill`] || args[`${prefix}_fill`] || args[`${prefix}Color`] || args[`${prefix}_color`]);
    return {
        address: parseCell(address)?.address || '',
        queries: query ? [query] : defaults,
        fill
    };
}

function cellMatchesQuery(cell = {}, query = '') {
    const needle = normalizeString(query).toLowerCase();
    if (!needle) {
        return false;
    }
    const haystack = [
        cell.address,
        cell.display,
        cell.fill
    ].join(' ').toLowerCase();
    return haystack.includes(needle);
}

function cellMatchesCriteria(cell = {}, criteria = {}) {
    if (criteria.address && normalizeString(cell.address).toUpperCase() === criteria.address.toUpperCase()) {
        return true;
    }
    if (criteria.fill && normalizeColor(cell.fill) === normalizeColor(criteria.fill)) {
        return true;
    }
    return (criteria.queries || []).some((query) => cellMatchesQuery(cell, query));
}

function firstMatchingCell(cells = [], criteria = {}) {
    return cells.find((cell) => cellMatchesCriteria(cell, criteria)) || null;
}

function listMatchesCell(cell = {}, values = [], fills = [], addresses = []) {
    const display = normalizeString(cell.display).toLowerCase();
    const address = normalizeString(cell.address).toUpperCase();
    const fill = normalizeColor(cell.fill);
    if (addresses.some((entry) => normalizeString(entry).toUpperCase() === address)) {
        return true;
    }
    if (fills.some((entry) => normalizeColor(entry) && normalizeColor(entry) === fill)) {
        return true;
    }
    return values.some((entry) => {
        const value = normalizeString(entry).toLowerCase();
        return value && (display === value || display.includes(value));
    });
}

function computeSpreadsheetPath(record = {}, payload = {}, args = {}) {
    args = mergeNestedArgs(args);
    const movementRuleText = normalizeString(args.movementRule || args.movement_rule || args.moveRules || args.move_rules || args.rule || args.rules);
    const sheet = sheetBySelection(payload, args);
    if (!sheet) {
        return createErrorResult('sheet_not_found', 'artifact_compute find_path could not find the requested worksheet.', {
            action: 'find_path',
            artifactId: record.id,
            availableSheets: (payload.workbook?.sheets || []).map((entry) => entry.name)
        });
    }
    const { matrix, cells, bounds, storedRange } = buildSpreadsheetCellMatrix(sheet, args);
    if (!cells.length) {
        return createErrorResult('empty_grid', 'artifact_compute find_path has no cells in the requested range.', {
            action: 'find_path',
            artifactId: record.id,
            sheet: sheet.name || '',
            range: args.range || '',
            storedRange
        });
    }
    const startCriteria = buildEndpointCriteria(args, 'start', ['start']);
    const endCriteria = buildEndpointCriteria(args, 'end', ['end', 'goal', 'finish', 'target']);
    const startCell = firstMatchingCell(cells, startCriteria);
    const endCell = firstMatchingCell(cells, endCriteria);
    if (!startCell || !endCell) {
        return createErrorResult(!startCell ? 'start_not_found' : 'end_not_found', 'artifact_compute find_path could not identify both endpoints. Pass startAddress/endAddress or startValue/endValue.', {
            action: 'find_path',
            artifactId: record.id,
            sheet: sheet.name || '',
            range: bounds.range,
            startFound: Boolean(startCell),
            endFound: Boolean(endCell),
            endpointHints: {
                start: 'startAddress/startValue/startQuery/startFill',
                end: 'endAddress/endValue/endQuery/endFill'
            }
        });
    }

    const blockedValues = normalizeList(args.blockedValues || args.blocked_values || args.blocked || args.walls);
    const rawBlockedFills = [
        ...normalizeList(args.blockedFills || args.blocked_fills || args.blockedColors || args.blocked_colors || args.avoidColor || args.avoid_color || args.forbiddenColor || args.forbidden_color),
        ...extractColorHintsFromRuleText(movementRuleText)
    ];
    const blockedFills = expandColorNameList(rawBlockedFills, cells);
    const blockedCells = normalizeList(args.blockedCells || args.blocked_cells);
    const passableValues = normalizeList(args.passableValues || args.passable_values || args.passable);
    const passableFills = expandColorNameList(normalizeList(args.passableFills || args.passable_fills || args.passableColors || args.passable_colors), cells);
    const passableCells = normalizeList(args.passableCells || args.passable_cells);
    const hasPassableFilter = Boolean(passableValues.length || passableFills.length || passableCells.length);
    const endpointAddresses = new Set([startCell.address, endCell.address]);
    const cellByAddress = new Map(cells.map((cell) => [cell.address, cell]));
    const isPassable = (cell) => {
        if (!cell) {
            return false;
        }
        if (endpointAddresses.has(cell.address)) {
            return true;
        }
        if (listMatchesCell(cell, blockedValues, blockedFills, blockedCells)) {
            return false;
        }
        if (!hasPassableFilter) {
            return true;
        }
        return listMatchesCell(cell, passableValues, passableFills, passableCells);
    };

    const diagonal = args.diagonal === true || args.allowDiagonal === true || args.allow_diagonal === true;
    const directions = diagonal
        ? [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
        : [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const queue = [startCell.address];
    const previous = new Map([[startCell.address, null]]);
    let visited = 0;
    while (queue.length) {
        const currentAddress = queue.shift();
        const current = cellByAddress.get(currentAddress);
        visited += 1;
        if (currentAddress === endCell.address) {
            break;
        }
        for (const [rowDelta, colDelta] of directions) {
            const nextAddress = cellAddress(current.row + rowDelta, current.col + colDelta);
            if (previous.has(nextAddress)) {
                continue;
            }
            const next = cellByAddress.get(nextAddress);
            if (!isPassable(next)) {
                continue;
            }
            previous.set(nextAddress, currentAddress);
            queue.push(nextAddress);
        }
    }

    const pathFound = previous.has(endCell.address);
    const pathCells = [];
    if (pathFound) {
        let cursor = endCell.address;
        while (cursor) {
            const cell = cellByAddress.get(cursor);
            if (cell) {
                pathCells.push({
                    address: cell.address,
                    row: cell.row,
                    col: cell.col,
                    display: cell.display,
                    fill: cell.fill
                });
            }
            cursor = previous.get(cursor);
        }
        pathCells.reverse();
    }
    const maxPathCells = normalizeNumber(args.maxPathCells || args.max_path_cells, 160, 1, 1000);
    const visiblePath = pathCells.slice(0, maxPathCells);
    let stepSize = normalizeNumber(
        args.stepSize || args.step_size || args.stepsPerTurn || args.steps_per_turn || args.moveStep || args.move_step || args.moveDistancePerTurn || args.move_distance_per_turn || args.cellsPerTurn || args.cells_per_turn,
        0,
        0,
        1000
    );
    if (!stepSize && movementRuleText) {
        stepSize = normalizeNumber(extractStepSizeFromRuleText(movementRuleText), 0, 0, 1000);
    }
    const stepToExtract = normalizeNumber(
        args.stepToExtract || args.step_to_extract || args.targetTurn || args.target_turn || args.targetTurnNumber || args.target_turn_number || args.turnNumber || args.turn_number || args.turn,
        0,
        0,
        100000
    );
    const explicitPathIndex = normalizeNumber(
        args.pathIndex || args.path_index || args.stepIndex || args.step_index || args.moveIndex || args.move_index,
        -1,
        -1,
        1000000
    );
    const extractionIndex = stepSize > 0 && stepToExtract > 0
        ? stepSize * stepToExtract
        : explicitPathIndex;
    const extractedCell = pathFound && extractionIndex >= 0 && extractionIndex < pathCells.length
        ? pathCells[extractionIndex]
        : null;
    const extractField = normalizeString(args.extractField || args.extract_field || args.returnField || args.return_field).toLowerCase();
    const answerCandidate = extractedCell
        ? (/address/.test(extractField)
            ? extractedCell.address
            : /value|display/.test(extractField)
                ? normalizeString(extractedCell.display)
                : normalizeColor(extractedCell.fill))
        : '';
    const extraction = extractionIndex >= 0 ? {
        requested: true,
        stepSize,
        stepToExtract,
        pathIndex: extractionIndex,
        zeroBasedPathIndex: extractionIndex,
        oneBasedPathIndex: extractionIndex + 1,
        extractField: extractField || 'cell_color_hex',
        answerCandidate,
        cell: extractedCell ? {
            address: extractedCell.address,
            row: extractedCell.row,
            col: extractedCell.col,
            display: extractedCell.display,
            fill: extractedCell.fill
        } : null,
        inRange: Boolean(extractedCell)
    } : null;
    const lines = [
        `ARTIFACT_COMPUTE_FIND_PATH artifactId=${record.id} sheet=${JSON.stringify(sheet.name || '')}`,
        `range=${bounds.range} storedRange=${storedRange}`,
        `start=${startCell.address} end=${endCell.address} diagonal=${diagonal}`,
        `pathFound=${pathFound} steps=${pathFound ? Math.max(0, pathCells.length - 1) : 0} visited=${visited}`,
        pathFound
            ? `path=${visiblePath.map((cell) => cell.address).join(' -> ')}${pathCells.length > visiblePath.length ? ` -> ... (${pathCells.length - visiblePath.length} more)` : ''}`
            : 'path=(none)',
        extraction ? `turn_extraction=turn:${stepToExtract || ''} stepSize:${stepSize || ''} pathIndex:${extractionIndex} cell:${extractedCell?.address || '(out_of_range)'} fill:${extractedCell?.fill || ''} value:${extractedCell?.display || ''}` : '',
        extraction?.answerCandidate ? `answer_candidate=${extraction.answerCandidate}` : '',
        pathCells.length > visiblePath.length ? 'path_truncated=true; call artifact_compute with a larger maxPathCells or narrower range if the full path is needed.' : 'path_truncated=false',
        'observation_contract=complete:true truncated:false reasoning_ready:true'
    ].filter(Boolean);
    const result = {
        pathFound,
        steps: pathFound ? Math.max(0, pathCells.length - 1) : 0,
        visited,
        start: startCell,
        end: endCell,
        range: bounds.range,
        storedRange,
        diagonal,
        path: visiblePath,
        pathTruncated: pathCells.length > visiblePath.length,
        extraction
    };
    return createTextResult(lines.join('\n'), {
        status: 'completed',
        ok: true,
        action: 'find_path',
        artifactId: record.id,
        sheet: sheet.name || '',
        range: bounds.range,
        complete: true,
        truncated: false,
        reasoningReady: true,
        result
    }, result);
}

class AILISContextArtifactStore {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || path.join(process.cwd(), 'tmp', 'context-artifacts'));
        this.payloadDir = path.join(this.rootDir, 'payloads');
        this.indexPath = path.join(this.rootDir, 'index.json');
        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () => {};
    }

    async readIndex() {
        try {
            const parsed = JSON.parse(await fsp.readFile(this.indexPath, 'utf8'));
            return Array.isArray(parsed.artifacts) ? parsed.artifacts : [];
        } catch {
            return [];
        }
    }

    async writeIndex(artifacts = []) {
        await fsp.mkdir(this.rootDir, { recursive: true });
        const sorted = artifacts
            .filter(Boolean)
            .sort((left, right) => Number(right.createdAt || 0) - Number(left.createdAt || 0))
            .slice(0, 2000);
        await fsp.writeFile(this.indexPath, `${JSON.stringify({ version: 1, artifacts: sorted }, null, 2)}\n`, 'utf8');
        return sorted;
    }

    async pinEvidence(record = {}, evidence = null) {
        if (!record?.id || !evidence?.evidenceId) {
            return null;
        }
        const artifacts = await this.readIndex();
        let pinned = null;
        const next = artifacts.map((entry) => {
            if (entry.id !== record.id) {
                return entry;
            }
            const metadata = entry.metadata && typeof entry.metadata === 'object' ? entry.metadata : {};
            const existing = Array.isArray(metadata.pinnedEvidence) ? metadata.pinnedEvidence : [];
            const merged = [
                evidence,
                ...existing.filter((item) => item?.evidenceId !== evidence.evidenceId)
            ].slice(0, 120);
            pinned = evidence;
            return {
                ...entry,
                metadata: {
                    ...metadata,
                    pinnedEvidence: merged
                }
            };
        });
        if (!pinned) {
            return null;
        }
        await this.writeIndex(next);
        this.emitGatewayEvent('context_artifact.evidence_pinned', {
            artifactId: evidence.artifactId,
            evidenceId: evidence.evidenceId,
            runId: record.runId,
            sessionId: record.sessionId,
            action: evidence.action,
            sheet: evidence.sheet,
            range: evidence.range,
            complete: evidence.complete,
            truncated: evidence.truncated,
            reasoningReady: evidence.reasoningReady
        });
        return pinned;
    }

    async attachPinnedEvidence(record = {}, result = {}) {
        const details = result?.details && typeof result.details === 'object' ? result.details : {};
        const evidence = createPinnedEvidence(record, details);
        const coveredByEvidence = findCoveringEvidence(record, details.coverage, evidence?.evidenceId || '');
        if (coveredByEvidence) {
            result.details = {
                ...details,
                coveredByEvidence
            };
            if (Array.isArray(result.content) && result.content[0]?.type === 'text') {
                result.content[0].text = [
                    result.content[0].text,
                    `covered_by_pinned_evidence=${coveredByEvidence.evidenceId}; coveredRange=${coveredByEvidence.range}; complete=true; truncated=false; reasoning_ready=true`
                ].filter(Boolean).join('\n');
            }
        }
        if (!evidence) {
            return result;
        }
        try {
            const pinned = await this.pinEvidence(record, evidence);
            if (pinned) {
                result.details = {
                    ...(result.details || details),
                    evidence: pinned,
                    pinnedEvidenceId: pinned.evidenceId
                };
                if (result.structuredContent && typeof result.structuredContent === 'object') {
                    result.structuredContent = {
                        ...result.structuredContent,
                        evidence: pinned
                    };
                }
            }
        } catch (error) {
            result.details = {
                ...details,
                evidencePinError: error?.message || String(error)
            };
        }
        return result;
    }

    async createArtifact(input = {}) {
        const kind = normalizeString(input.kind || input.type, 'generic');
        const sourceName = safeSegment(path.basename(normalizeString(input.sourcePath || input.name, kind)), kind);
        const id = `ctx-${safeSegment(kind)}-${Date.now()}-${randomUUID().slice(0, 8)}`;
        const payloadPath = path.join(this.payloadDir, `${id}-${sourceName}.json`);
        const payload = cloneJson(input.payload || {});
        await fsp.mkdir(this.payloadDir, { recursive: true });
        await fsp.writeFile(payloadPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
        const stat = await fsp.stat(payloadPath).catch(() => ({ size: 0 }));
        const record = {
            id,
            kind,
            type: normalizeString(input.type || kind),
            status: 'available',
            createdAt: Date.now(),
            iso: new Date().toISOString(),
            tool: normalizeString(input.tool),
            runId: normalizeString(input.runId),
            sessionId: normalizeString(input.sessionId),
            sourcePath: normalizeString(input.sourcePath) ? path.resolve(input.sourcePath) : '',
            payloadPath,
            payloadBytes: stat.size || 0,
            summary: normalizeString(input.summary),
            metadata: cloneJson(input.metadata || {}),
            modelView: cloneJson(input.modelView || {}),
            queryHints: Array.isArray(input.queryHints) ? input.queryHints.map(String) : []
        };
        const prior = await this.readIndex();
        const next = [record, ...prior.filter((entry) => entry.id !== record.id && path.resolve(entry.payloadPath || '') !== path.resolve(payloadPath))];
        await this.writeIndex(next);
        this.emitGatewayEvent('context_artifact.created', {
            artifactId: record.id,
            runId: record.runId,
            sessionId: record.sessionId,
            kind: record.kind,
            type: record.type,
            sourcePath: record.sourcePath,
            payloadBytes: record.payloadBytes,
            summary: record.summary
        });
        return { ...record };
    }

    async getRecord(artifactId = '') {
        const id = normalizeString(artifactId);
        if (!id) {
            return null;
        }
        const artifacts = await this.readIndex();
        return artifacts.find((entry) => entry.id === id) || null;
    }

    async getPayload(record = {}) {
        if (!record?.payloadPath) {
            return null;
        }
        return JSON.parse(await fsp.readFile(record.payloadPath, 'utf8'));
    }

    async findByPath(targetPath = '') {
        const resolved = path.resolve(targetPath || '');
        const comparable = process.platform === 'win32' ? resolved.toLowerCase() : resolved;
        const artifacts = await this.readIndex();
        return artifacts.find((entry) => {
            const payloadPath = path.resolve(entry.payloadPath || '');
            const sourcePath = entry.sourcePath ? path.resolve(entry.sourcePath) : '';
            const payloadComparable = process.platform === 'win32' ? payloadPath.toLowerCase() : payloadPath;
            const sourceComparable = process.platform === 'win32' ? sourcePath.toLowerCase() : sourcePath;
            return comparable === payloadComparable || (sourceComparable && comparable === sourceComparable && entry.kind !== 'plain_text');
        }) || null;
    }

    guardReadResult(record = {}, targetPath = '') {
        return createErrorResult(
            'context_artifact_raw_read_blocked',
            [
                'This file is a managed AILIS context artifact payload.',
                `artifactId=${record.id}`,
                'Do not raw-read the payload into the model context.',
                'Use artifact_query with summary/search/range actions for the artifact kind: spreadsheet grid/range/search, text_range/text_search/text_tail, or document_search/document_page/document_section.'
            ].join('\n'),
            {
                status: 'blocked',
                ok: false,
                action: 'read',
                path: targetPath,
                artifactId: record.id,
                artifactKind: record.kind,
                artifactType: record.type,
                payloadBytes: record.payloadBytes,
                suggestedNext: {
                    tool: CONTEXT_ARTIFACT_TOOL_ID,
                    args: {
                        artifactId: record.id,
                        action: 'summary'
                    }
                }
            }
        );
    }

    schemaResult() {
        return createTextResult(JSON.stringify({
            tool: CONTEXT_ARTIFACT_TOOL_ID,
            purpose: 'Query managed AILIS context artifacts without dumping large payloads into the model context.',
            actions: [
                'schema',
                'list',
                'summary',
                'grid',
                'range',
                'search',
                'text_schema',
                'text_range',
                'text_search',
                'text_tail',
                'document_schema',
                'document_search',
                'document_page',
                'document_section'
            ],
            args: {
                artifactId: 'required for summary/grid/range/search',
                action: 'schema|list|summary|grid|range|search',
                sheet: 'optional sheet name for spreadsheet artifacts',
                range: 'A1:D20 style range for spreadsheet range queries',
                query: 'text/color/address query for search',
                startLine: '1-based line start for text_range',
                endLine: '1-based line end for text_range',
                page: '1-based page for document_page'
            },
            observation_contract: {
                complete: 'query-scoped completeness',
                truncated: 'true only when this query preview was bounded',
                reasoning_ready: 'true when returned evidence is ready for final reasoning'
            }
        }, null, 2), {
            status: 'completed',
            ok: true,
            action: 'schema'
        });
    }

    computeSchemaResult() {
        return createTextResult(JSON.stringify({
            tool: CONTEXT_ARTIFACT_COMPUTE_TOOL_ID,
            purpose: 'Run deterministic data-worker computations on managed artifacts and return compact evidence instead of raw payloads.',
            actions: ['schema', 'profile', 'spreadsheet_profile', 'find_path', 'spreadsheet_find_path'],
            args: {
                artifactId: 'required for profile/find_path',
                action: 'schema|profile|find_path',
                sheet: 'optional worksheet name for spreadsheet artifacts',
                range: 'optional A1:D20 range limiting spreadsheet compute',
                startAddress: 'optional path start cell, e.g. A1',
                endAddress: 'optional path end cell, e.g. I20',
                startValue: 'optional start marker text; default searches for START',
                endValue: 'optional end marker text; default searches for END/GOAL/FINISH/TARGET',
                blockedValues: 'optional array/string of blocked display values',
                blockedFills: 'optional array/string of blocked fill colors',
                passableValues: 'optional array/string; when set, only matching cells plus endpoints are passable',
                passableFills: 'optional array/string; when set, only matching cells plus endpoints are passable',
                diagonal: 'true to allow diagonal movement'
            },
            observation_contract: {
                complete: 'true when the requested compute was fully evaluated',
                truncated: 'false for compute evidence; long paths may have pathTruncated while compute remains complete',
                reasoning_ready: 'true when the compact compute result can be used for answer reasoning'
            }
        }, null, 2), {
            status: 'completed',
            ok: true,
            action: 'schema'
        });
    }

    async execute(args = {}) {
        const action = normalizeString(args.action || args.operation || args.intent, 'summary').toLowerCase().replace(/[-\s]+/g, '_');
        if (action === 'schema' || action === 'help') {
            return this.schemaResult();
        }
        if (action === 'list') {
            const limit = normalizeNumber(args.limit, 20, 1, 200);
            const artifacts = (await this.readIndex()).slice(0, limit).map((entry) => ({
                id: entry.id,
                kind: entry.kind,
                type: entry.type,
                sourcePath: entry.sourcePath,
                createdAt: entry.createdAt,
                summary: entry.summary,
                payloadBytes: entry.payloadBytes,
                queryHints: entry.queryHints
            }));
            return createTextResult(JSON.stringify({
                status: 'completed',
                artifacts,
                note: 'Use artifact_query with artifactId for summary/grid/range/search.'
            }, null, 2), {
                status: 'completed',
                ok: true,
                action,
                artifacts
            }, { artifacts });
        }

        const artifactId = normalizeString(args.artifactId || args.artifact_id || args.id);
        if (!artifactId) {
            return createErrorResult('missing_artifact_id', 'artifact_query requires artifactId/id for this action.', { action });
        }
        const record = await this.getRecord(artifactId);
        if (!record) {
            if (/^artifact-[a-f0-9]{8,}$/i.test(artifactId)) {
                return createErrorResult(
                    'artifact_not_found',
                    `No managed context artifact found for ${artifactId}. This looks like an evidence_ref from evidence_artifacts, not a queryable context artifactId.`,
                    {
                        action,
                        artifactId,
                        evidenceRefMisuse: true,
                        recoveryHint: 'Use evidence_ref ids only in final_answer.evidence_refs. For more document/table content, use the prior tool observation text, rerun the parser, or call artifact_query only with a context artifact id returned as details.artifactId/contextArtifact.id.'
                    }
                );
            }
            return createErrorResult('artifact_not_found', `No managed context artifact found for ${artifactId}.`, {
                action,
                artifactId
            });
        }
        const payload = await this.getPayload(record).catch((error) => ({ __payloadReadError: error?.message || String(error) }));
        if (payload?.__payloadReadError) {
            return createErrorResult('artifact_payload_read_failed', payload.__payloadReadError, {
                action,
                artifactId,
                payloadPath: record.payloadPath
            });
        }

        if (record.kind === 'spreadsheet' || payload?.workbook?.sheets) {
            return this.executeSpreadsheetQuery(record, payload, { ...args, action, artifactId });
        }
        if (record.kind === 'text' || payload?.textArtifact || payload?.text_artifact) {
            return this.executeTextQuery(record, payload, { ...args, action, artifactId });
        }
        if (record.kind === 'document' || payload?.documentArtifact || payload?.document_artifact) {
            return this.executeDocumentQuery(record, payload, { ...args, action, artifactId });
        }
        return this.executeGenericQuery(record, payload, { ...args, action, artifactId });
    }

    async compute(args = {}) {
        const action = normalizeString(args.action || args.operation || args.intent, 'profile').toLowerCase().replace(/[-\s]+/g, '_');
        if (action === 'schema' || action === 'help') {
            return this.computeSchemaResult();
        }
        const artifactId = normalizeString(args.artifactId || args.artifact_id || args.id);
        if (!artifactId) {
            return createErrorResult('missing_artifact_id', 'artifact_compute requires artifactId/id for this action.', { action });
        }
        const record = await this.getRecord(artifactId);
        if (!record) {
            return createErrorResult('artifact_not_found', `No managed context artifact found for ${artifactId}.`, {
                action,
                artifactId
            });
        }
        const payload = await this.getPayload(record).catch((error) => ({ __payloadReadError: error?.message || String(error) }));
        if (payload?.__payloadReadError) {
            return createErrorResult('artifact_payload_read_failed', payload.__payloadReadError, {
                action,
                artifactId,
                payloadPath: record.payloadPath
            });
        }
        if (record.kind === 'spreadsheet' || payload?.workbook?.sheets) {
            return this.computeSpreadsheet(record, payload, { ...args, action, artifactId });
        }
        return createErrorResult('unsupported_artifact_kind', `artifact_compute does not support ${record.kind || 'this artifact kind'} yet.`, {
            action,
            artifactId,
            artifactKind: record.kind,
            supportedKinds: ['spreadsheet']
        });
    }

    computeSpreadsheet(record = {}, payload = {}, args = {}) {
        const action = args.action;
        if (action === 'profile' || action === 'spreadsheet_profile' || action === 'describe') {
            return profileSpreadsheetArtifact(record, payload, args);
        }
        if (action === 'find_path' || action === 'spreadsheet_find_path' || action === 'path') {
            return computeSpreadsheetPath(record, payload, args);
        }
        return createErrorResult('unsupported_action', `Unsupported artifact_compute action for spreadsheet: ${action}.`, {
            action,
            supportedActions: ['schema', 'profile', 'find_path']
        });
    }

    executeTextQuery(record = {}, payload = {}, args = {}) {
        const action = args.action;
        const textArtifact = getTextArtifactPayload(payload);
        if (!textArtifact) {
            return createErrorResult('invalid_text_artifact', 'Managed text artifact payload is missing textArtifact.text.', {
                action,
                artifactId: record.id
            });
        }
        if (action === 'summary' || action === 'get') {
            const raw = formatTextArtifactSummary(record, textArtifact);
            const preview = truncateText(raw, normalizeNumber(args.maxChars || args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1000, 30000));
            return createTextResult(preview.text, {
                status: 'completed',
                ok: true,
                action: 'summary',
                artifactId: record.id,
                truncated: preview.truncated,
                complete: true,
                reasoningReady: true
            });
        }
        if (action === 'text_schema') {
            return textSchemaResult(record, textArtifact);
        }
        if (action === 'text_range' || action === 'range') {
            return textRangeResult(record, textArtifact, args);
        }
        if (action === 'text_search' || action === 'search') {
            return searchTextLines({ record, text: textArtifact.text || '', args, action: 'text_search' });
        }
        if (action === 'text_tail' || action === 'tail') {
            return textTailResult(record, textArtifact, args);
        }
        return createErrorResult('unsupported_action', `Unsupported text artifact_query action: ${action}.`, {
            action,
            supportedActions: ['schema', 'list', 'summary', 'text_schema', 'text_range', 'text_search', 'text_tail']
        });
    }

    executeDocumentQuery(record = {}, payload = {}, args = {}) {
        const action = args.action;
        const documentArtifact = getDocumentArtifactPayload(payload);
        if (!documentArtifact) {
            return createErrorResult('invalid_document_artifact', 'Managed document artifact payload is missing documentArtifact.text.', {
                action,
                artifactId: record.id
            });
        }
        if (action === 'summary' || action === 'get') {
            const raw = formatDocumentArtifactSummary(record, documentArtifact);
            const preview = truncateText(raw, normalizeNumber(args.maxChars || args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1000, 30000));
            return createTextResult(preview.text, {
                status: 'completed',
                ok: true,
                action: 'summary',
                artifactId: record.id,
                truncated: preview.truncated,
                complete: true,
                reasoningReady: true
            });
        }
        if (action === 'document_schema') {
            return documentSchemaResult(record, documentArtifact);
        }
        if (action === 'document_search' || action === 'search') {
            return documentSearchResult(record, documentArtifact, args);
        }
        if (action === 'document_page' || action === 'page') {
            return documentPageResult(record, documentArtifact, args);
        }
        if (action === 'document_section' || action === 'section') {
            return documentSectionResult(record, documentArtifact, args);
        }
        return createErrorResult('unsupported_action', `Unsupported document artifact_query action: ${action}.`, {
            action,
            supportedActions: ['schema', 'list', 'summary', 'document_schema', 'document_search', 'document_page', 'document_section']
        });
    }

    async executeSpreadsheetQuery(record = {}, payload = {}, args = {}) {
        const action = args.action;
        if (action === 'summary' || action === 'get') {
            const raw = formatSpreadsheetSummary(record, payload);
            const preview = truncateText(raw, normalizeNumber(args.maxChars || args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1000, 30000));
            return createTextResult(preview.text, {
                status: 'completed',
                ok: true,
                action: 'summary',
                artifactId: record.id,
                artifactKind: record.kind,
                truncated: preview.truncated,
                originalTextChars: preview.originalChars,
                complete: true,
                reasoningReady: true
            }, {
                artifact: record,
                workbook: payload.workbook,
                truncated: preview.truncated
            });
        }
        const sheet = sheetBySelection(payload, args);
        if (!sheet) {
            return createErrorResult('sheet_not_found', 'No matching worksheet found in artifact.', {
                action,
                artifactId: record.id,
                availableSheets: (payload.workbook?.sheets || []).map((entry) => entry.name)
            });
        }
        if (action === 'grid') {
            const raw = formatSpreadsheetGrid(sheet, args);
            const preview = truncateText(raw, normalizeNumber(args.maxChars || args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1000, 30000));
            const coverage = buildSpreadsheetGridCoverage(sheet, args);
            const truncated = preview.truncated || coverage.truncated || /truncated=true/.test(raw);
            return this.attachPinnedEvidence(record, createTextResult(preview.text, {
                status: 'completed',
                ok: true,
                action,
                artifactId: record.id,
                sheet: sheet.name,
                coverage,
                truncated,
                complete: !truncated,
                reasoningReady: !truncated,
                observationContract: {
                    complete: !truncated,
                    truncated,
                    reasoning_ready: !truncated
                }
            }));
        }
        if (action === 'range') {
            return this.attachPinnedEvidence(record, formatSpreadsheetRange(sheet, args));
        }
        if (action === 'search') {
            return searchSpreadsheet(payload, args);
        }
        return createErrorResult('unsupported_action', `Unsupported spreadsheet artifact_query action: ${action}.`, {
            action,
            supportedActions: ['schema', 'list', 'summary', 'grid', 'range', 'search']
        });
    }

    executeGenericQuery(record = {}, payload = {}, args = {}) {
        const action = args.action;
        if (action === 'summary' || action === 'get') {
            const raw = JSON.stringify({
                artifactId: record.id,
                kind: record.kind,
                type: record.type,
                sourcePath: record.sourcePath,
                summary: record.summary,
                metadata: record.metadata,
                modelView: record.modelView,
                queryHints: record.queryHints,
                observation_contract: {
                    complete: true,
                    truncated: false,
                    reasoning_ready: true
                }
            }, null, 2);
            const preview = truncateText(raw, normalizeNumber(args.maxChars || args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1000, 30000));
            return createTextResult(preview.text, {
                status: 'completed',
                ok: true,
                action: 'summary',
                artifactId: record.id,
                truncated: preview.truncated,
                complete: true,
                reasoningReady: true
            });
        }
        if (action === 'search') {
            const query = normalizeString(args.query || args.q || args.text).toLowerCase();
            if (!query) {
                return createErrorResult('missing_query', 'artifact_query search requires query/q/text.', { action, artifactId: record.id });
            }
            const text = JSON.stringify(payload, null, 2);
            const lines = text.split(/\r?\n/);
            const limit = normalizeNumber(args.limit, 40, 1, 500);
            const matches = [];
            for (let index = 0; index < lines.length; index += 1) {
                if (lines[index].toLowerCase().includes(query)) {
                    matches.push({ line: index + 1, text: lines[index].slice(0, 1000) });
                    if (matches.length >= limit) {
                        break;
                    }
                }
            }
            return createTextResult(JSON.stringify({
                status: 'completed',
                artifactId: record.id,
                query,
                matchCount: matches.length,
                matches,
                truncated: matches.length >= limit,
                reasoning_ready: true
            }, null, 2), {
                status: 'completed',
                ok: true,
                action,
                artifactId: record.id,
                matchCount: matches.length,
                matches,
                truncated: matches.length >= limit,
                reasoningReady: true
            }, { matches });
        }
        return createErrorResult('unsupported_action', `Unsupported artifact_query action for ${record.kind}: ${action}.`, {
            action,
            supportedActions: ['schema', 'list', 'summary', 'search']
        });
    }
}

module.exports = {
    CONTEXT_ARTIFACT_COMPUTE_TOOL_ID,
    CONTEXT_ARTIFACT_TOOL_ID,
    AILISContextArtifactStore
};
