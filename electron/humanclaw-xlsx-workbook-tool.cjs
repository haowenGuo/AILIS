const fsp = require('fs/promises');
const os = require('os');
const path = require('path');
const ExcelJS = require('exceljs');

const READ_XLSX_WORKBOOK_TOOL_ID = 'read_xlsx_workbook';
const DEFAULT_MAX_ROWS = 200;
const DEFAULT_MAX_COLS = 80;
const DEFAULT_MAX_CELLS = 8000;
const DEFAULT_PREVIEW_CHARS = 5600;

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

function normalizeBoolean(value, fallback = false) {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        if (/^(true|1|yes|y)$/i.test(value.trim())) return true;
        if (/^(false|0|no|n)$/i.test(value.trim())) return false;
    }
    return fallback;
}

function maybePath(...parts) {
    if (parts.some((part) => !normalizeString(part))) {
        return '';
    }
    return path.join(...parts);
}

function uniquePaths(paths) {
    const seen = new Set();
    const result = [];
    for (const entry of paths) {
        const normalized = normalizeString(entry);
        if (!normalized) {
            continue;
        }
        const resolved = path.resolve(normalized);
        const key = process.platform === 'win32' ? resolved.toLowerCase() : resolved;
        if (!seen.has(key)) {
            seen.add(key);
            result.push(resolved);
        }
    }
    return result;
}

function isPathInside(rootPath, targetPath) {
    const root = path.resolve(rootPath);
    const target = path.resolve(targetPath);
    const rootComparable = process.platform === 'win32' ? root.toLowerCase() : root;
    const targetComparable = process.platform === 'win32' ? target.toLowerCase() : target;
    return targetComparable === rootComparable || targetComparable.startsWith(`${rootComparable}${path.sep}`);
}

function getAllowedRoots(runtime = {}) {
    return uniquePaths([
        runtime.workspaceDir,
        runtime.workspaceRoot,
        runtime.projectRoot,
        os.tmpdir(),
        process.env.TEMP,
        process.env.TMP,
        maybePath(os.homedir(), 'Desktop'),
        maybePath(os.homedir(), 'Documents'),
        maybePath(os.homedir(), 'Downloads')
    ]);
}

function resolveUserPath(inputPath, runtime = {}) {
    const raw = normalizeString(inputPath);
    if (!raw) {
        return '';
    }
    if (path.isAbsolute(raw)) {
        return path.resolve(raw);
    }
    const base = runtime.workspaceDir || runtime.workspaceRoot || runtime.projectRoot || process.cwd();
    return path.resolve(base, raw);
}

function safeSegment(value = '', fallback = 'xlsx-workbook') {
    const normalized = normalizeString(value, fallback)
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 120);
    return normalized || fallback;
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

function cellAddress(row, column) {
    return `${columnName(column)}${row}`;
}

function normalizeArgb(value = '') {
    const raw = normalizeString(value).replace(/^#/, '').toUpperCase();
    if (/^[0-9A-F]{8}$/.test(raw)) {
        return raw;
    }
    if (/^[0-9A-F]{6}$/.test(raw)) {
        return `FF${raw}`;
    }
    return '';
}

function rgbFromArgb(argb = '') {
    const normalized = normalizeArgb(argb);
    return normalized ? normalized.slice(-6) : '';
}

function extractFill(cell) {
    const fill = cell?.fill;
    if (!fill || typeof fill !== 'object') {
        return null;
    }
    const fgArgb = normalizeArgb(fill.fgColor?.argb || fill.fgColor?.rgb || '');
    const bgArgb = normalizeArgb(fill.bgColor?.argb || fill.bgColor?.rgb || '');
    const fgRgb = rgbFromArgb(fgArgb);
    const bgRgb = rgbFromArgb(bgArgb);
    if (!fill.type && !fill.pattern && !fgRgb && !bgRgb) {
        return null;
    }
    return {
        type: fill.type || '',
        pattern: fill.pattern || '',
        fgArgb,
        fgRgb,
        bgArgb,
        bgRgb
    };
}

function normalizeCellValue(value) {
    if (value == null) {
        return null;
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (Buffer.isBuffer(value)) {
        return `[buffer:${value.length}]`;
    }
    if (typeof value !== 'object') {
        return value;
    }
    if (Array.isArray(value.richText)) {
        return value.richText.map((part) => part?.text || '').join('');
    }
    if (value.text !== undefined) {
        return value.text;
    }
    if (value.result !== undefined) {
        return value.result;
    }
    if (value.formula !== undefined) {
        return `=${value.formula}`;
    }
    if (value.hyperlink !== undefined && value.text !== undefined) {
        return value.text;
    }
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return String(value);
    }
}

function extractFormula(value) {
    if (value && typeof value === 'object' && value.formula !== undefined) {
        return {
            formula: String(value.formula),
            result: normalizeCellValue(value.result)
        };
    }
    return null;
}

function shouldIncludeCell(record, includeEmpty) {
    if (includeEmpty) {
        return true;
    }
    return record.value !== null || record.formula || record.fill?.fgRgb || record.fill?.bgRgb;
}

function displayCell(record) {
    if (record.value !== null && record.value !== undefined && String(record.value).trim() !== '') {
        return String(record.value);
    }
    if (record.formula?.formula) {
        return `=${record.formula.formula}`;
    }
    if (record.fill?.fgRgb) {
        return record.fill.fgRgb;
    }
    return '';
}

function parseRange(value = '') {
    const raw = normalizeString(value).toUpperCase();
    if (!raw) {
        return null;
    }
    const match = raw.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
    if (!match) {
        return null;
    }
    const colToNumber = (letters) => letters.split('').reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0);
    const startCol = colToNumber(match[1]);
    const startRow = Number(match[2]);
    const endCol = colToNumber(match[3]);
    const endRow = Number(match[4]);
    return {
        startRow: Math.min(startRow, endRow),
        endRow: Math.max(startRow, endRow),
        startCol: Math.min(startCol, endCol),
        endCol: Math.max(startCol, endCol)
    };
}

function truncateMiddle(text = '', maxChars = DEFAULT_PREVIEW_CHARS) {
    const source = String(text || '');
    const budget = Math.max(400, Number(maxChars) || DEFAULT_PREVIEW_CHARS);
    if (source.length <= budget) {
        return source;
    }
    const marker = '\n... [preview truncated; use artifact_query with artifactId for narrower evidence] ...\n';
    const remaining = Math.max(0, budget - marker.length);
    const head = Math.ceil(remaining * 0.65);
    const tail = remaining - head;
    return `${source.slice(0, head)}${marker}${tail > 0 ? source.slice(-tail) : ''}`;
}

function normalizeSheetSelection(workbook, args = {}) {
    const explicitSheet = normalizeString(args.sheet || args.sheetName || args.sheet_name || args.worksheet);
    if (explicitSheet) {
        const sheet = workbook.getWorksheet(explicitSheet);
        return sheet ? [sheet] : [];
    }
    const sheetIndex = Number(args.sheetIndex || args.sheet_index || 0);
    if (Number.isFinite(sheetIndex) && sheetIndex > 0) {
        const sheet = workbook.getWorksheet(sheetIndex);
        return sheet ? [sheet] : [];
    }
    const maxSheets = normalizeNumber(args.maxSheets || args.max_sheets, 8, 1, 100);
    return workbook.worksheets.slice(0, maxSheets);
}

function sheetMerges(worksheet) {
    const merges = worksheet?.model?.merges;
    if (Array.isArray(merges)) {
        return merges.map(String);
    }
    if (merges && typeof merges === 'object') {
        return Object.keys(merges);
    }
    return [];
}

function inspectWorksheet(worksheet, args = {}) {
    const maxRows = normalizeNumber(args.maxRows || args.max_rows, DEFAULT_MAX_ROWS, 1, 10000);
    const maxCols = normalizeNumber(args.maxCols || args.max_cols || args.maxColumns || args.max_columns, DEFAULT_MAX_COLS, 1, 1000);
    const maxCells = normalizeNumber(args.maxCells || args.max_cells, DEFAULT_MAX_CELLS, 1, 1000000);
    const includeEmpty = normalizeBoolean(args.includeEmpty ?? args.include_empty, true);
    const includeStyles = normalizeBoolean(args.includeStyles ?? args.include_styles, true);
    const includeFormulas = normalizeBoolean(args.includeFormulas ?? args.include_formulas, true);
    const range = parseRange(args.range || args.addressRange || args.address_range);

    const sourceStartRow = range?.startRow || 1;
    const sourceEndRow = range?.endRow || worksheet.rowCount || 1;
    const sourceStartCol = range?.startCol || 1;
    const sourceEndCol = range?.endCol || worksheet.columnCount || 1;
    const endRow = Math.min(sourceEndRow, sourceStartRow + maxRows - 1);
    const endCol = Math.min(sourceEndCol, sourceStartCol + maxCols - 1);

    const cells = [];
    const valueGrid = [];
    const fillGrid = [];
    const displayGrid = [];
    const colorCounts = new Map();
    const nonEmptyCells = [];
    const styledCells = [];
    let visitedCells = 0;
    let includedCells = 0;
    let truncated = false;

    for (let row = sourceStartRow; row <= endRow; row += 1) {
        const valueRow = [];
        const fillRow = [];
        const displayRow = [];
        for (let col = sourceStartCol; col <= endCol; col += 1) {
            visitedCells += 1;
            const cell = worksheet.getCell(row, col);
            const fill = includeStyles ? extractFill(cell) : null;
            const formula = includeFormulas ? extractFormula(cell.value) : null;
            const value = normalizeCellValue(cell.value);
            const address = cellAddress(row, col);
            const record = {
                address,
                row,
                column: col,
                value,
                text: normalizeString(cell.text),
                formula,
                fill
            };
            if (fill?.fgRgb) {
                colorCounts.set(fill.fgRgb, (colorCounts.get(fill.fgRgb) || 0) + 1);
                styledCells.push({ address, fill: fill.fgRgb, value });
            }
            if (value !== null && value !== undefined && String(value).trim() !== '') {
                nonEmptyCells.push({ address, value, fill: fill?.fgRgb || '' });
            }
            valueRow.push(value);
            fillRow.push(fill?.fgRgb || '');
            displayRow.push(displayCell(record));
            if (shouldIncludeCell(record, includeEmpty)) {
                if (includedCells < maxCells) {
                    cells.push(record);
                    includedCells += 1;
                } else {
                    truncated = true;
                }
            }
        }
        valueGrid.push(valueRow);
        fillGrid.push(fillRow);
        displayGrid.push(displayRow);
    }

    const requestedRows = Math.max(0, sourceEndRow - sourceStartRow + 1);
    const requestedCols = Math.max(0, sourceEndCol - sourceStartCol + 1);
    if (endRow < sourceEndRow || endCol < sourceEndCol) {
        truncated = true;
    }

    return {
        name: worksheet.name,
        id: worksheet.id,
        dimensions: {
            rowCount: worksheet.rowCount,
            columnCount: worksheet.columnCount,
            actualRowCount: worksheet.actualRowCount,
            actualColumnCount: worksheet.actualColumnCount,
            inspectedRange: `${cellAddress(sourceStartRow, sourceStartCol)}:${cellAddress(endRow, endCol)}`,
            requestedRows,
            requestedCols,
            inspectedRows: Math.max(0, endRow - sourceStartRow + 1),
            inspectedCols: Math.max(0, endCol - sourceStartCol + 1)
        },
        mergedRanges: sheetMerges(worksheet),
        cells,
        grids: {
            columns: Array.from({ length: Math.max(0, endCol - sourceStartCol + 1) }, (_, index) => columnName(sourceStartCol + index)),
            rowNumbers: Array.from({ length: Math.max(0, endRow - sourceStartRow + 1) }, (_, index) => sourceStartRow + index),
            values: valueGrid,
            fills: fillGrid,
            display: displayGrid
        },
        colorLegend: [...colorCounts.entries()]
            .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
            .map(([rgb, count]) => ({ rgb, count })),
        nonEmptyCells,
        styledCells,
        completeness: {
            includeEmpty,
            includeStyles,
            includeFormulas,
            visitedCells,
            includedCells,
            truncated,
            allRequestedCellsIncluded: !truncated
        }
    };
}

function formatGridPreview(sheet, maxRows = 40) {
    const rows = sheet.grids?.display || [];
    const rowNumbers = sheet.grids?.rowNumbers || [];
    const lines = [];
    const visibleRows = rows.slice(0, maxRows);
    for (let index = 0; index < visibleRows.length; index += 1) {
        const rowNo = rowNumbers[index] || index + 1;
        const values = visibleRows[index].map((value) => {
            const text = String(value || '').trim();
            return text || '.';
        });
        lines.push(`Row ${String(rowNo).padStart(3, ' ')}: ${values.join(' | ')}`);
    }
    if (rows.length > visibleRows.length) {
        lines.push(`... ${rows.length - visibleRows.length} more inspected rows omitted from preview`);
    }
    return lines.join('\n');
}

function buildPreview(payload, maxChars = DEFAULT_PREVIEW_CHARS) {
    const lines = [
        'XLSX_WORKBOOK_READ_COMPLETE',
        `path=${payload.path}`,
        `sheets=${payload.workbook.sheetCount}`,
        `selectedSheets=${payload.workbook.sheets.map((sheet) => sheet.name).join(', ')}`,
        payload.contextArtifact?.id ? `artifactId=${payload.contextArtifact.id}` : '',
        payload.contextArtifact?.id ? 'queryWith=artifact_query actions summary/grid/range/search' : '',
        'observation_contract=complete:true reasoning_ready:true'
    ].filter(Boolean);
    for (const sheet of payload.workbook.sheets) {
        lines.push('');
        lines.push(`Sheet "${sheet.name}"`);
        lines.push(`dimensions=${sheet.dimensions.inspectedRange} rowCount=${sheet.dimensions.rowCount} columnCount=${sheet.dimensions.columnCount}`);
        lines.push(`cellsIncluded=${sheet.completeness.includedCells}/${sheet.completeness.visitedCells} allRequestedCellsIncluded=${sheet.completeness.allRequestedCellsIncluded}`);
        if (sheet.mergedRanges.length) {
            lines.push(`mergedRanges=${sheet.mergedRanges.join(', ')}`);
        }
        if (sheet.colorLegend.length) {
            lines.push(`fillColors=${sheet.colorLegend.map((entry) => `${entry.rgb}:${entry.count}`).join(', ')}`);
        }
        if (sheet.nonEmptyCells.length) {
            lines.push(`nonEmpty=${sheet.nonEmptyCells.slice(0, 40).map((cell) => `${cell.address}=${JSON.stringify(cell.value)}${cell.fill ? `#${cell.fill}` : ''}`).join('; ')}`);
        }
        lines.push('grid(display: value if present, otherwise fill RGB, "." for empty/no fill)');
        lines.push(formatGridPreview(sheet));
    }
    if (payload.contextArtifact?.id) {
        lines.push('');
        lines.push(`To inspect more: artifact_query {"artifactId":"${payload.contextArtifact.id}","action":"range","sheet":"${payload.workbook.sheets[0]?.name || ''}","range":"A1:D20"}`);
    }
    return truncateMiddle(lines.join('\n'), maxChars);
}

function buildSchemaResult() {
    return createTextResult(JSON.stringify({
        tool: READ_XLSX_WORKBOOK_TOOL_ID,
        actions: ['schema', 'inspect', 'read', 'read_workbook'],
        description: 'Read a local XLSX/XLSM workbook as structured workbook data including sheet dimensions, cell values, formulas, fills/colors, merged ranges, and compact grids.',
        args: {
            path: 'required local .xlsx/.xlsm path',
            sheet: 'optional sheet name',
            sheetIndex: 'optional 1-based sheet index',
            range: 'optional A1:D20 style range',
            maxRows: `default ${DEFAULT_MAX_ROWS}`,
            maxCols: `default ${DEFAULT_MAX_COLS}`,
            maxCells: `default ${DEFAULT_MAX_CELLS}`,
            includeEmpty: 'default true so styled empty cells are visible',
            includeStyles: 'default true',
            includeFormulas: 'default true'
        }
    }, null, 2), {
        status: 'completed',
        action: 'schema',
        ok: true
    });
}

async function persistFullPayload(payload, runtime = {}) {
    const rootDir = runtime.auditDir
        ? path.join(runtime.auditDir, 'mcp-artifacts', 'spreadsheets')
        : path.join(os.tmpdir(), 'ailis-spreadsheets');
    await fsp.mkdir(rootDir, { recursive: true });
    const baseName = safeSegment(path.basename(payload.path, path.extname(payload.path)));
    const filePath = path.join(rootDir, `${baseName}-${Date.now()}.json`);
    await fsp.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    return filePath;
}

function buildArtifactSummary(payload = {}) {
    const sheetBits = (payload.workbook?.sheets || []).slice(0, 8).map((sheet) => {
        const colors = sheet.colorLegend?.length
            ? ` colors=${sheet.colorLegend.map((entry) => `${entry.rgb}:${entry.count}`).join(',')}`
            : '';
        return `${sheet.name} ${sheet.dimensions?.inspectedRange || ''}${colors}`.trim();
    });
    return `XLSX workbook ${path.basename(payload.path || '')}: ${sheetBits.join(' | ')}`;
}

function publicStructuredContent(payload = {}) {
    return {
        ok: true,
        status: 'completed',
        action: payload.action,
        path: payload.path,
        size: payload.size,
        artifact: payload.contextArtifact
            ? {
                  artifactId: payload.contextArtifact.id,
                  kind: payload.contextArtifact.kind,
                  type: payload.contextArtifact.type,
                  summary: payload.contextArtifact.summary,
                  queryHints: payload.contextArtifact.queryHints
              }
            : null,
        workbook: {
            sheetCount: payload.workbook?.sheetCount || 0,
            sheets: (payload.workbook?.sheets || []).map((sheet) => ({
                name: sheet.name,
                id: sheet.id,
                dimensions: sheet.dimensions,
                mergedRanges: sheet.mergedRanges,
                colorLegend: sheet.colorLegend,
                nonEmptyCells: (sheet.nonEmptyCells || []).slice(0, 60),
                completeness: sheet.completeness
            }))
        },
        completeness: payload.completeness,
        observationContract: {
            complete: payload.completeness?.allSelectedSheetsComplete !== false,
            truncated: payload.completeness?.allSelectedSheetsComplete === false,
            reasoning_ready: true,
            next: payload.contextArtifact?.id
                ? 'Use artifact_query summary/grid/range/search by artifactId for more evidence; do not raw-read artifact payload files.'
                : 'Use narrower read_xlsx_workbook range if more evidence is needed.'
        }
    };
}

async function registerContextArtifact(payload, runtime = {}, context = {}) {
    if (runtime.contextArtifactStore?.createArtifact) {
        const record = await runtime.contextArtifactStore.createArtifact({
            kind: 'spreadsheet',
            type: 'xlsx_workbook',
            tool: READ_XLSX_WORKBOOK_TOOL_ID,
            runId: context.runId || payload.runId,
            sessionId: context.sessionId || context.sessionKey || payload.sessionId,
            sourcePath: payload.path,
            payload,
            summary: buildArtifactSummary(payload),
            metadata: {
                sheetCount: payload.workbook?.sheetCount || 0,
                selectedSheets: (payload.workbook?.sheets || []).map((sheet) => sheet.name),
                fullWorkbookRead: payload.completeness?.fullWorkbookRead === true,
                allSelectedSheetsComplete: payload.completeness?.allSelectedSheetsComplete !== false
            },
            modelView: publicStructuredContent(payload),
            queryHints: ['summary', 'grid', 'range', 'search']
        });
        return {
            id: record.id,
            kind: record.kind,
            type: record.type,
            summary: record.summary,
            payloadBytes: record.payloadBytes,
            queryHints: record.queryHints
        };
    }
    const fullJsonPath = await persistFullPayload(payload, runtime).catch(() => '');
    return fullJsonPath
        ? {
              id: '',
              kind: 'spreadsheet',
              type: 'xlsx_workbook',
              summary: buildArtifactSummary(payload),
              payloadBytes: 0,
              queryHints: [],
              legacyFullJsonPath: fullJsonPath
          }
        : null;
}

async function executeReadXlsxWorkbookTool(args = {}, context = {}, runtime = {}) {
    const action = normalizeString(args.action || args.operation || args.intent, 'inspect').toLowerCase().replace(/[-\s]+/g, '_');
    if (action === 'schema') {
        return buildSchemaResult();
    }
    if (!['inspect', 'read', 'read_workbook'].includes(action)) {
        return createErrorResult('unsupported_action', `Unsupported ${READ_XLSX_WORKBOOK_TOOL_ID} action: ${action}`, {
            action,
            supportedActions: ['schema', 'inspect', 'read', 'read_workbook']
        });
    }

    const target = resolveUserPath(args.path || args.file || args.filePath || args.file_path, runtime);
    if (!target) {
        return createErrorResult('missing_path', `${READ_XLSX_WORKBOOK_TOOL_ID} requires path/file/filePath.`, {
            action
        });
    }
    const allowedRoots = getAllowedRoots(runtime);
    if (!allowedRoots.some((root) => isPathInside(root, target))) {
        return createErrorResult('path_outside_workspace', `${READ_XLSX_WORKBOOK_TOOL_ID} can only read files in workspace/project/temp/user document roots.`, {
            action,
            path: target,
            allowedRoots
        });
    }
    const stat = await fsp.stat(target).catch(() => null);
    if (!stat || !stat.isFile()) {
        return createErrorResult('file_not_found', `文件不存在：${target}`, {
            action,
            path: target
        });
    }
    const ext = path.extname(target).toLowerCase();
    if (!['.xlsx', '.xlsm'].includes(ext)) {
        return createErrorResult('unsupported_format', `${READ_XLSX_WORKBOOK_TOOL_ID} currently supports .xlsx/.xlsm.`, {
            action,
            path: target,
            extension: ext,
            nextActions: ['For CSV/TSV use artifact_verifier/read text tools.', 'For legacy .xls convert to .xlsx first or add an .xls backend.']
        });
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'AILIS';
    try {
        await workbook.xlsx.readFile(target);
    } catch (error) {
        return createErrorResult('parse_failed', `XLSX parse failed: ${error.message}`, {
            action,
            path: target,
            error: error.message
        });
    }

    const selectedSheets = normalizeSheetSelection(workbook, args);
    if (!selectedSheets.length) {
        return createErrorResult('sheet_not_found', 'No matching worksheet found.', {
            action,
            path: target,
            requestedSheet: args.sheet || args.sheetName || args.sheetIndex || '',
            availableSheets: workbook.worksheets.map((sheet) => sheet.name)
        });
    }

    const payload = {
        ok: true,
        status: 'completed',
        action,
        path: target,
        size: stat.size,
        workbook: {
            sheetCount: workbook.worksheets.length,
            sheets: selectedSheets.map((sheet) => inspectWorksheet(sheet, args))
        },
        completeness: {
            workbookParsed: true,
            fullWorkbookRead: false,
            selectedSheetCount: selectedSheets.length,
            totalSheetCount: workbook.worksheets.length,
            allSelectedSheetsComplete: true
        }
    };
    payload.completeness.allSelectedSheetsComplete = payload.workbook.sheets.every((sheet) => sheet.completeness.allRequestedCellsIncluded);
    payload.completeness.fullWorkbookRead = payload.completeness.allSelectedSheetsComplete && selectedSheets.length === workbook.worksheets.length;
    payload.contextArtifact = await registerContextArtifact(payload, runtime, context).catch(() => null);
    const preview = buildPreview(payload, normalizeNumber(args.previewChars || args.preview_chars, DEFAULT_PREVIEW_CHARS, 1000, 20000));
    return createTextResult(preview, {
        status: 'completed',
        ok: true,
        action,
        path: target,
        sheetCount: payload.workbook.sheetCount,
        selectedSheets: payload.workbook.sheets.map((sheet) => sheet.name),
        artifactId: payload.contextArtifact?.id || '',
        contextArtifact: payload.contextArtifact
            ? {
                  id: payload.contextArtifact.id,
                  kind: payload.contextArtifact.kind,
                  type: payload.contextArtifact.type,
                  summary: payload.contextArtifact.summary,
                  payloadBytes: payload.contextArtifact.payloadBytes,
                  queryHints: payload.contextArtifact.queryHints
              }
            : null,
        allSelectedSheetsComplete: payload.completeness.allSelectedSheetsComplete
    }, publicStructuredContent(payload));
}

module.exports = {
    READ_XLSX_WORKBOOK_TOOL_ID,
    executeReadXlsxWorkbookTool
};
