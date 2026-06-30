const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { execFile } = require('child_process');
const { promisify } = require('util');
const ExcelJS = require('exceljs');

const {
    createArtifactDiagnostic,
    normalizeFormat
} = require('./ailis-artifact-tools-model.cjs');
const {
    FILE_ADAPTER_FORMATS,
    indexFileArtifact,
    inspectFileArtifact,
    renderFileArtifactPreview,
    searchFileArtifact
} = require('./ailis-artifact-tools-file-adapters.cjs');

const execFileAsync = promisify(execFile);

const IMPLEMENTED_ADAPTER_IDS = Object.freeze(['xlsx', 'pdf', 'docx', 'pptx', 'csv', 'image']);
const XLSX_INDEX_CACHE = new Map();
const XLSX_RENDER_CACHE_VERSION = 'xlsx-render-cache-v1';

async function getFileSignature(sourcePath) {
    const stat = await fsp.stat(sourcePath);
    return {
        size: stat.size,
        mtimeMs: Math.round(stat.mtimeMs),
        ctimeMs: Math.round(stat.ctimeMs)
    };
}

function buildCacheKey(parts = []) {
    return crypto
        .createHash('sha256')
        .update(parts.map((entry) => String(entry ?? '')).join('\n'))
        .digest('hex');
}

function toAbsolutePath(sourcePath = '', repoRoot = process.cwd()) {
    if (!sourcePath) {
        return '';
    }
    return path.isAbsolute(sourcePath) ? sourcePath : path.resolve(repoRoot, sourcePath);
}

function toPortablePath(sourcePath = '', repoRoot = process.cwd()) {
    const absolute = toAbsolutePath(sourcePath, repoRoot);
    return path.relative(repoRoot, absolute).replace(/\\/g, '/');
}

function normalizeHex(value = '') {
    const raw = String(value || '').replace(/^#/, '').trim().toUpperCase();
    if (!raw) {
        return '';
    }
    if (raw.length === 8 && raw.startsWith('FF')) {
        return raw.slice(2);
    }
    if (raw.length === 6) {
        return raw;
    }
    return raw.slice(-6);
}

function colName(col) {
    let current = Number(col);
    let name = '';
    while (current > 0) {
        const mod = (current - 1) % 26;
        name = String.fromCharCode(65 + mod) + name;
        current = Math.floor((current - mod) / 26);
    }
    return name;
}

function cellRef(row, col) {
    return `${colName(col)}${row}`;
}

function parseCellRef(ref = '') {
    const match = /^([A-Z]+)(\d+)$/i.exec(ref);
    if (!match) {
        return null;
    }
    let col = 0;
    for (const char of match[1].toUpperCase()) {
        col = col * 26 + (char.charCodeAt(0) - 64);
    }
    return { row: Number(match[2]), col };
}

function parseRangeRef(ref = '') {
    const raw = String(ref || '').replace(/\$/g, '').trim();
    if (!raw) {
        return null;
    }
    const [startRaw, endRaw = startRaw] = raw.split(':');
    const start = parseCellRef(startRaw);
    const end = parseCellRef(endRaw);
    if (!start || !end) {
        return null;
    }
    return {
        startRow: Math.min(start.row, end.row),
        startCol: Math.min(start.col, end.col),
        endRow: Math.max(start.row, end.row),
        endCol: Math.max(start.col, end.col)
    };
}

function boundsToRangeRef(bounds = {}) {
    if (!bounds || !bounds.startRow || !bounds.startCol || !bounds.endRow || !bounds.endCol) {
        return '';
    }
    return `${cellRef(bounds.startRow, bounds.startCol)}:${cellRef(bounds.endRow, bounds.endCol)}`;
}

function boundsEqual(left = {}, right = {}) {
    return Boolean(left && right
        && left.startRow === right.startRow
        && left.startCol === right.startCol
        && left.endRow === right.endRow
        && left.endCol === right.endCol);
}

function boundsContain(outer = {}, inner = {}) {
    return Boolean(outer && inner
        && outer.startRow <= inner.startRow
        && outer.startCol <= inner.startCol
        && outer.endRow >= inner.endRow
        && outer.endCol >= inner.endCol);
}

function parseWorkbookTarget(target = '', fallbackSheetName = '') {
    const raw = String(target || '').trim();
    if (!raw) {
        return {
            sheetName: fallbackSheetName,
            rangeRef: ''
        };
    }
    let sheetName = fallbackSheetName;
    let rangeRef = raw;
    let quote = false;
    for (let index = 0; index < raw.length; index += 1) {
        const char = raw[index];
        if (char === "'") {
            quote = !quote;
        }
        if (char === '!' && !quote) {
            sheetName = raw.slice(0, index).replace(/^'|'$/g, '').replace(/''/g, "'");
            rangeRef = raw.slice(index + 1);
            break;
        }
    }
    return { sheetName, rangeRef };
}

function normalizeSheetName(value = '') {
    return String(value || '').replace(/^'|'$/g, '').replace(/''/g, "'");
}

function quoteSheetName(sheetName = '') {
    const raw = String(sheetName || '');
    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(raw) ? raw : `'${raw.replace(/'/g, "''")}'`;
}

function normalizeZipPath(value = '') {
    const parts = [];
    for (const part of String(value || '').replace(/\\/g, '/').split('/')) {
        if (!part || part === '.') {
            continue;
        }
        if (part === '..') {
            parts.pop();
        } else {
            parts.push(part);
        }
    }
    return parts.join('/');
}

function resolveZipTarget(basePart = '', target = '') {
    if (!target) {
        return '';
    }
    if (/^[a-z]+:/i.test(target) || target.startsWith('/')) {
        return target.replace(/^\//, '');
    }
    const baseDir = path.posix.dirname(String(basePart || '').replace(/\\/g, '/'));
    return normalizeZipPath(path.posix.join(baseDir, target));
}

function normalizeInclude(value = [], fallback = ['values', 'formulas', 'styles']) {
    if (Array.isArray(value)) {
        return new Set(value.map((entry) => String(entry).trim().toLowerCase()).filter(Boolean));
    }
    if (typeof value === 'string' && value.trim()) {
        return new Set(value.split(/[,|;\s]+/).map((entry) => entry.trim().toLowerCase()).filter(Boolean));
    }
    return new Set(fallback);
}

function clampNumber(value, fallback, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return fallback;
    }
    return Math.max(min, Math.min(max, number));
}

function clonePlain(value) {
    if (typeof value === 'undefined') {
        return undefined;
    }
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function sha256File(filePath) {
    const hash = crypto.createHash('sha256');
    hash.update(fs.readFileSync(filePath));
    return hash.digest('hex');
}

function escapeXml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function decodeXmlText(value = '') {
    return String(value)
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&');
}

function createDiagnostic(code, severity, message, details = {}) {
    return createArtifactDiagnostic({ code, severity, message, details });
}

function getCellFillRgb(cell) {
    const fill = cell?.fill || {};
    const color = fill.fgColor || fill.bgColor || {};
    return normalizeHex(color.argb || color.rgb || color.indexed || '');
}

function getCellValue(cell) {
    if (!cell || cell.value === null || typeof cell.value === 'undefined') {
        return '';
    }
    if (typeof cell.value === 'object') {
        if (cell.value.text) {
            return cell.value.text;
        }
        if (Array.isArray(cell.value.richText)) {
            return cell.value.richText.map((part) => part.text || '').join('');
        }
        if (cell.value.formula) {
            return cell.value.result ?? '';
        }
    }
    return cell.value;
}

function getFormulaResult(cell) {
    if (!cell || !cell.value || typeof cell.value !== 'object') {
        return undefined;
    }
    if (Object.prototype.hasOwnProperty.call(cell.value, 'result')) {
        return clonePlain(cell.value.result);
    }
    if (Object.prototype.hasOwnProperty.call(cell.value, 'error')) {
        return clonePlain(cell.value);
    }
    return undefined;
}

function getPrimitiveText(value) {
    if (value === null || typeof value === 'undefined') {
        return '';
    }
    if (typeof value === 'string') {
        return value;
    }
    return String(value);
}

function noteToText(note) {
    if (!note) {
        return '';
    }
    if (typeof note === 'string') {
        return note;
    }
    if (typeof note.text === 'string') {
        return note.text;
    }
    if (Array.isArray(note.texts)) {
        return note.texts.map((entry) => entry.text || entry).join('');
    }
    try {
        return JSON.stringify(note);
    } catch {
        return String(note);
    }
}

function normalizeColor(color = {}) {
    if (!color || typeof color !== 'object') {
        return '';
    }
    return normalizeHex(color.argb || color.rgb || color.indexed || '');
}

function summarizeBorder(border = {}) {
    const result = {};
    for (const edge of ['top', 'right', 'bottom', 'left']) {
        if (border[edge]) {
            result[edge] = {
                style: border[edge].style || '',
                color: normalizeColor(border[edge].color)
            };
        }
    }
    return result;
}

function summarizeStyle(cell) {
    const style = cell?.style || {};
    return {
        fillRgb: getCellFillRgb(cell),
        font: style.font ? {
            name: style.font.name || '',
            size: style.font.size || null,
            bold: style.font.bold === true,
            italic: style.font.italic === true,
            color: normalizeColor(style.font.color)
        } : {},
        alignment: style.alignment ? clonePlain(style.alignment) : {},
        numFmt: style.numFmt || '',
        border: style.border ? summarizeBorder(style.border) : {}
    };
}

function getCellErrorCode(cell) {
    const value = cell?.value;
    if (value && typeof value === 'object') {
        if (value.error) {
            return value.error;
        }
        if (value.result && typeof value.result === 'object' && value.result.error) {
            return value.result.error;
        }
    }
    const text = String(cell?.text || '');
    const match = text.match(/#(?:REF|DIV\/0|VALUE|NAME\?|N\/A|NUM|NULL)!?/i);
    return match ? match[0].toUpperCase() : '';
}

function inspectCell(cell, options = {}) {
    const include = options.include || normalizeInclude();
    const value = getCellValue(cell);
    const result = {
        ref: cell.address,
        row: cell.row,
        col: cell.col,
        text: getPrimitiveText(value)
    };
    if (include.has('values') || include.has('value')) {
        result.value = clonePlain(value);
    }
    if (include.has('formulas') || include.has('formula')) {
        result.formula = cell.formula || '';
        result.formulaType = cell.formulaType || 0;
        const formulaResult = getFormulaResult(cell);
        if (typeof formulaResult !== 'undefined') {
            result.result = formulaResult;
        }
        const errorCode = getCellErrorCode(cell);
        if (errorCode) {
            result.error = errorCode;
        }
    } else if (cell.formula) {
        result.formula = cell.formula;
    }
    if (include.has('styles') || include.has('style') || include.has('computedstyle')) {
        result.style = summarizeStyle(cell);
        result.fillRgb = result.style.fillRgb;
    } else {
        const fillRgb = getCellFillRgb(cell);
        if (fillRgb) {
            result.fillRgb = fillRgb;
        }
    }
    if ((include.has('comments') || include.has('comment')) && cell.note) {
        result.comment = noteToText(cell.note);
        result.note = clonePlain(cell.note);
    }
    if ((include.has('validation') || include.has('datavalidation')) && cell.dataValidation) {
        result.dataValidation = clonePlain(cell.dataValidation);
    }
    return result;
}

function buildFillHistogram(cells) {
    const histogram = {};
    for (const cell of cells) {
        if (!cell.fillRgb) {
            continue;
        }
        histogram[cell.fillRgb] = (histogram[cell.fillRgb] || 0) + 1;
    }
    return histogram;
}

function getWorksheetUsedBounds(sheet) {
    let maxRow = 0;
    let maxCol = 0;
    sheet.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell({ includeEmpty: false }, (cell) => {
            const value = getCellValue(cell);
            const fillRgb = getCellFillRgb(cell);
            if (value !== '' || fillRgb || cell.formula || cell.note) {
                maxRow = Math.max(maxRow, cell.row || row.number);
                maxCol = Math.max(maxCol, cell.col || cell._column?._number || 0);
            }
        });
    });
    for (const merge of sheet.model?.merges || []) {
        const bounds = parseRangeRef(merge);
        if (bounds) {
            maxRow = Math.max(maxRow, bounds.endRow);
            maxCol = Math.max(maxCol, bounds.endCol);
        }
    }
    return {
        startRow: maxRow ? 1 : 0,
        startCol: maxCol ? 1 : 0,
        endRow: maxRow,
        endCol: maxCol,
        range: maxRow && maxCol ? `A1:${cellRef(maxRow, maxCol)}` : ''
    };
}

function summarizeTables(sheet, tableInventory = []) {
    const tables = sheet.model?.tables || [];
    return tables.map((table) => ({
        name: table.name || table.displayName || '',
        ref: table.ref || tableInventory.find((entry) =>
            entry.name === (table.name || table.displayName)
            || entry.displayName === (table.name || table.displayName)
        )?.ref || '',
        headerRow: table.headerRow !== false,
        totalsRow: table.totalsRow === true,
        columns: (table.tableRef?.table?.columns || table.columns || []).map((column) => ({
            name: column.name || '',
            filterButton: column.filterButton !== false,
            totalsRowFunction: column.totalsRowFunction || '',
            totalsRowFormula: column.totalsRowFormula || ''
        })),
        style: table.style ? clonePlain(table.style) : {}
    }));
}

function collectHiddenRows(sheet) {
    const hidden = [];
    const maxRow = Math.max(sheet.rowCount || 0, sheet.actualRowCount || 0);
    for (let rowNumber = 1; rowNumber <= maxRow; rowNumber += 1) {
        const row = sheet.getRow(rowNumber);
        if (row.hidden) {
            hidden.push({
                row: rowNumber,
                range: `${rowNumber}:${rowNumber}`
            });
        }
    }
    return hidden;
}

function collectHiddenColumns(sheet) {
    const hidden = [];
    const maxCol = Math.max(sheet.columnCount || 0, sheet.actualColumnCount || 0);
    for (let colNumber = 1; colNumber <= maxCol; colNumber += 1) {
        const col = sheet.getColumn(colNumber);
        if (col.hidden) {
            hidden.push({
                col: colNumber,
                name: colName(colNumber),
                range: `${colName(colNumber)}:${colName(colNumber)}`
            });
        }
    }
    return hidden;
}

function summarizeDataValidations(sheet) {
    const model = sheet.model?.dataValidations?.model || sheet.dataValidations?.model || {};
    return Object.entries(model).map(([ref, validation]) => ({
        ref,
        type: validation.type || '',
        operator: validation.operator || '',
        formulae: clonePlain(validation.formulae || []),
        allowBlank: validation.allowBlank === true
    }));
}

function summarizeConditionalFormattings(sheet) {
    return (sheet.model?.conditionalFormattings || []).map((entry) => ({
        ref: entry.ref || '',
        rules: (entry.rules || []).map((rule) => ({
            type: rule.type || '',
            operator: rule.operator || '',
            formulae: clonePlain(rule.formulae || []),
            priority: rule.priority || null
        }))
    }));
}

function summarizeDefinedNames(workbook) {
    const model = workbook.definedNames?.model || workbook.model?.definedNames || [];
    return model.map((entry) => ({
        name: entry.name || '',
        ranges: clonePlain(entry.ranges || [])
    })).filter((entry) => entry.name || entry.ranges.length);
}

function normalizeDefinedNameKey(name = '') {
    return String(name || '').trim().toLowerCase();
}

function buildDefinedNameMap(workbook) {
    const map = new Map();
    for (const entry of summarizeDefinedNames(workbook)) {
        const key = normalizeDefinedNameKey(entry.name);
        if (!key) {
            continue;
        }
        map.set(key, {
            name: entry.name,
            ranges: (entry.ranges || []).map((range) => String(range || '')).filter(Boolean)
        });
    }
    return map;
}

function parseXmlAttributes(raw = '') {
    const attrs = {};
    const regex = /([\w:.-]+)="([^"]*)"/g;
    let match = regex.exec(raw);
    while (match) {
        attrs[match[1]] = decodeXmlText(match[2]);
        match = regex.exec(raw);
    }
    return attrs;
}

function parseRelationshipEntries(entries = {}) {
    const relationships = [];
    for (const [part, xml] of Object.entries(entries)) {
        if (!part.endsWith('.rels')) {
            continue;
        }
        const regex = /<Relationship\b([^>]*)\/?>/g;
        let match = regex.exec(xml);
        while (match) {
            const attrs = parseXmlAttributes(match[1]);
            relationships.push({
                part,
                id: attrs.Id || attrs.id || '',
                type: attrs.Type || attrs.type || '',
                target: attrs.Target || attrs.target || '',
                targetMode: attrs.TargetMode || attrs.targetMode || ''
            });
            match = regex.exec(xml);
        }
    }
    return relationships;
}

function countXmlTags(xml = '', tag = '') {
    if (!tag) {
        return 0;
    }
    const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`<(?:\\w+:)?${escaped}\\b`, 'g');
    return (xml.match(regex) || []).length;
}

function parseFirstXmlElementAttrs(xml = '', tagName = '') {
    const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`<(?:\\w+:)?${escaped}\\b([^>]*)>`, 'i');
    const match = regex.exec(xml);
    return match ? parseXmlAttributes(match[1]) : {};
}

function parseDrawingAnchors(xml = '', relsById = {}) {
    const anchors = [];
    const anchorRegex = /<(?:\w+:)?(twoCellAnchor|oneCellAnchor)\b[^>]*>([\s\S]*?)<\/(?:\w+:)?\1>/g;
    let anchorMatch = anchorRegex.exec(xml);
    while (anchorMatch) {
        const body = anchorMatch[2];
        const from = /<(?:\w+:)?from\b[^>]*>([\s\S]*?)<\/(?:\w+:)?from>/i.exec(body)?.[1] || '';
        const to = /<(?:\w+:)?to\b[^>]*>([\s\S]*?)<\/(?:\w+:)?to>/i.exec(body)?.[1] || '';
        const getNumber = (block, tag, fallback = 0) => {
            const match = new RegExp(`<(?:\\w+:)?${tag}\\b[^>]*>(\\d+)<\\/(?:\\w+:)?${tag}>`, 'i').exec(block);
            return match ? Number(match[1]) : fallback;
        };
        const fromCol = getNumber(from, 'col', 0);
        const fromRow = getNumber(from, 'row', 0);
        const toCol = getNumber(to, 'col', fromCol + 1);
        const toRow = getNumber(to, 'row', fromRow + 1);
        const embedId = /<(?:\w+:)?blip\b[^>]*(?:r:embed|embed)="([^"]+)"/i.exec(body)?.[1] || '';
        const chartId = /<(?:\w+:)?chart\b[^>]*(?:r:id|id)="([^"]+)"/i.exec(body)?.[1] || '';
        const relId = embedId || chartId;
        const relationship = relId ? relsById[relId] : null;
        const anchor = {
            kind: embedId ? 'image' : (chartId ? 'chart' : 'shape'),
            relId,
            target: relationship?.target || '',
            type: relationship?.type || '',
            from: {
                row: fromRow + 1,
                col: fromCol + 1,
                ref: cellRef(fromRow + 1, fromCol + 1)
            },
            to: {
                row: toRow + 1,
                col: toCol + 1,
                ref: cellRef(toRow + 1, toCol + 1)
            },
            range: `${cellRef(fromRow + 1, fromCol + 1)}:${cellRef(toRow + 1, toCol + 1)}`
        };
        anchors.push(anchor);
        anchorMatch = anchorRegex.exec(xml);
    }
    return anchors;
}

function groupRelationshipsByPart(relationships = []) {
    const grouped = new Map();
    for (const rel of relationships) {
        if (!grouped.has(rel.part)) {
            grouped.set(rel.part, []);
        }
        grouped.get(rel.part).push(rel);
    }
    return grouped;
}

function buildXlsxPackageInventory(archive = {}, workbook = null) {
    const names = archive.names || [];
    const entries = archive.entries || {};
    const drawings = names.filter((name) => /^xl\/drawings\/drawing\d+\.xml$/i.test(name));
    const charts = names.filter((name) => /^xl\/charts\/chart\d+\.xml$/i.test(name));
    const images = names.filter((name) => /^xl\/media\/[^/]+$/i.test(name));
    const tableParts = names.filter((name) => /^xl\/tables\/table\d+\.xml$/i.test(name));
    const comments = names.filter((name) => /^xl\/comments\d+\.xml$/i.test(name) || /^xl\/threadedComments\//i.test(name));
    const externalLinks = names.filter((name) => /^xl\/externalLinks\//i.test(name));
    const macros = names.filter((name) => /(^|\/)vbaProject\.bin$/i.test(name));
    const relationships = parseRelationshipEntries(entries);
    const relsByPart = groupRelationshipsByPart(relationships);
    const tableByPart = new Map(tableParts.map((part) => {
        const attrs = parseFirstXmlElementAttrs(entries[part] || '', 'table');
        return [part, {
            part,
            id: attrs.id || '',
            name: attrs.name || attrs.displayName || '',
            displayName: attrs.displayName || attrs.name || '',
            ref: attrs.ref || '',
            totalsRowCount: attrs.totalsRowCount || '',
            headerRowCount: attrs.headerRowCount || ''
        }];
    }));
    const tableAssignments = new Map();
    const drawingAssignments = new Map();
    for (const rel of relationships) {
        const sheetRelMatch = /^xl\/worksheets\/_rels\/sheet(\d+)\.xml\.rels$/i.exec(rel.part);
        if (!sheetRelMatch) {
            continue;
        }
        const sheetIndex = Number(sheetRelMatch[1]) - 1;
        const sheetName = workbook?.worksheets?.[sheetIndex]?.name || `sheet${sheetIndex + 1}`;
        const resolvedTarget = resolveZipTarget(`xl/worksheets/sheet${sheetIndex + 1}.xml`, rel.target);
        if (/^xl\/tables\/table\d+\.xml$/i.test(resolvedTarget)) {
            tableAssignments.set(resolvedTarget, sheetName);
        }
        if (/^xl\/drawings\/drawing\d+\.xml$/i.test(resolvedTarget)) {
            drawingAssignments.set(resolvedTarget, sheetName);
        }
    }
    const tables = [...tableByPart.values()].map((table) => ({
        ...table,
        sheetName: tableAssignments.get(table.part) || ''
    }));
    const drawingDetails = drawings.map((name) => {
        const xml = entries[name] || '';
        const relPart = `xl/drawings/_rels/${path.posix.basename(name)}.rels`;
        const relsById = Object.fromEntries((relsByPart.get(relPart) || []).map((rel) => [
            rel.id,
            {
                ...rel,
                target: resolveZipTarget(name, rel.target)
            }
        ]));
        const anchors = parseDrawingAnchors(xml, relsById).map((anchor) => ({
            ...anchor,
            sheetName: drawingAssignments.get(name) || '',
            drawingPart: name,
            fullRange: drawingAssignments.get(name) ? `${drawingAssignments.get(name)}!${anchor.range}` : anchor.range
        }));
        return {
            part: name,
            sheetName: drawingAssignments.get(name) || '',
            shapeCount: countXmlTags(xml, 'sp'),
            imageCount: countXmlTags(xml, 'pic'),
            graphicFrameCount: countXmlTags(xml, 'graphicFrame'),
            chartReferenceCount: (xml.match(/chart\.xml|\/charts\/chart\d+\.xml/gi) || []).length,
            anchors
        };
    });
    const imageAnchors = drawingDetails
        .flatMap((drawing) => (drawing.anchors || [])
            .filter((anchor) => anchor.kind === 'image')
            .map((anchor) => ({
                sheetName: anchor.sheetName,
                drawingPart: drawing.part,
                mediaPart: anchor.target,
                relId: anchor.relId,
                range: anchor.range,
                fullRange: anchor.fullRange,
                from: anchor.from,
                to: anchor.to
            })));
    return {
        partCount: names.length,
        relationships,
        drawings: drawingDetails,
        charts: charts.map((part) => ({ part })),
        images: images.map((part) => ({
            part,
            anchors: imageAnchors.filter((anchor) => anchor.mediaPart === part)
        })),
        imageAnchors,
        tables,
        comments: comments.map((part) => ({ part })),
        externalLinks: externalLinks.map((part) => ({ part })),
        macros: macros.map((part) => ({ part }))
    };
}

function collectSheetCells(sheet, options = {}) {
    const include = normalizeInclude(options.include);
    const used = getWorksheetUsedBounds(sheet);
    const targetBounds = options.bounds || used;
    const maxRows = clampNumber(options.maxRows, 60, 1, 1000);
    const maxCols = clampNumber(options.maxCols, 30, 1, 200);
    const startRow = targetBounds.startRow || 1;
    const startCol = targetBounds.startCol || 1;
    const endRow = Math.min(targetBounds.endRow || used.endRow || sheet.rowCount || 1, startRow + maxRows - 1);
    const endCol = Math.min(targetBounds.endCol || used.endCol || sheet.columnCount || 1, startCol + maxCols - 1);
    const cells = [];
    let originalRows = Math.max(0, (targetBounds.endRow || 0) - startRow + 1);
    let originalCols = Math.max(0, (targetBounds.endCol || 0) - startCol + 1);
    if (!originalRows && used.endRow) {
        originalRows = used.endRow;
    }
    if (!originalCols && used.endCol) {
        originalCols = used.endCol;
    }
    for (let row = startRow; row <= endRow; row += 1) {
        for (let col = startCol; col <= endCol; col += 1) {
            const cell = sheet.getCell(row, col);
            const value = getCellValue(cell);
            const fillRgb = getCellFillRgb(cell);
            if (
                options.includeEmpty
                || value !== ''
                || fillRgb
                || cell.formula
                || cell.note
                || cell.dataValidation
                || sheet.getRow(row).hidden
                || sheet.getColumn(col).hidden
            ) {
                cells.push(inspectCell(cell, { include }));
            }
        }
    }
    return {
        targetRange: targetBounds.startRow ? `${cellRef(startRow, startCol)}:${cellRef(targetBounds.endRow, targetBounds.endCol)}` : '',
        returnedRange: startRow <= endRow && startCol <= endCol ? `${cellRef(startRow, startCol)}:${cellRef(endRow, endCol)}` : '',
        rows: Math.max(0, endRow - startRow + 1),
        cols: Math.max(0, endCol - startCol + 1),
        originalRows,
        originalCols,
        truncated: endRow < (targetBounds.endRow || 0) || endCol < (targetBounds.endCol || 0),
        cells
    };
}

function collectFormulas(sheet) {
    const formulas = [];
    sheet.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell({ includeEmpty: false }, (cell) => {
            if (cell.formula || cell.value?.sharedFormula) {
                formulas.push({
                    ref: cell.address,
                    formula: cell.formula || '',
                    sharedFormula: cell.value?.sharedFormula || '',
                    result: getFormulaResult(cell),
                    error: getCellErrorCode(cell)
                });
            }
        });
    });
    return formulas;
}

function collectFormulaErrors(sheet) {
    const errors = [];
    sheet.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell({ includeEmpty: false }, (cell) => {
            const error = getCellErrorCode(cell);
            if (error) {
                errors.push({
                    ref: cell.address,
                    formula: cell.formula || '',
                    error
                });
            }
        });
    });
    return errors;
}

function collectComments(sheet) {
    const comments = [];
    sheet.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell({ includeEmpty: false }, (cell) => {
            if (cell.note) {
                comments.push({
                    ref: cell.address,
                    text: noteToText(cell.note),
                    note: clonePlain(cell.note)
                });
            }
        });
    });
    return comments;
}

function summarizeWorksheet(sheet, options = {}) {
    const used = getWorksheetUsedBounds(sheet);
    const range = collectSheetCells(sheet, {
        ...options,
        bounds: options.bounds || used
    });
    const formulas = collectFormulas(sheet);
    const formulaErrors = collectFormulaErrors(sheet);
    const hiddenRows = collectHiddenRows(sheet);
    const hiddenColumns = collectHiddenColumns(sheet);
    const sheetTables = (options.tableInventory || []).filter((entry) => entry.sheetName === sheet.name);
    return {
        name: sheet.name,
        id: sheet.id,
        state: sheet.state || 'visible',
        hidden: sheet.state && sheet.state !== 'visible',
        rowCount: sheet.rowCount,
        columnCount: sheet.columnCount,
        actualRowCount: sheet.actualRowCount,
        actualColumnCount: sheet.actualColumnCount,
        usedRange: used.range,
        dimensions: {
            startRow: used.startRow,
            startCol: used.startCol,
            endRow: used.endRow,
            endCol: used.endCol
        },
        cells: range.cells,
        range,
        fillHistogram: buildFillHistogram(range.cells),
        hiddenRows,
        hiddenColumns,
        merges: sheet.model?.merges || [],
        tables: summarizeTables(sheet, sheetTables),
        formulas,
        formulaErrors,
        comments: collectComments(sheet),
        dataValidations: summarizeDataValidations(sheet),
        conditionalFormattings: summarizeConditionalFormattings(sheet),
        views: clonePlain(sheet.views || [])
    };
}

function buildXlsxInspectView(workbookSummary, input = {}) {
    const kind = String(input.kind || input.inspectKind || input.inspect_kind || 'workbook').toLowerCase();
    const target = input.target || input.range || '';
    const defaultSheetName = input.sheetName || input.sheet || workbookSummary.workbook.sheetNames[0] || '';
    const parsedTarget = parseWorkbookTarget(target, defaultSheetName);
    const sheet = workbookSummary.sheets.find((entry) => entry.name === parsedTarget.sheetName) || workbookSummary.sheets[0];
    if (kind === 'workbook' || kind === 'summary') {
        return {
            kind: 'workbook',
            workbook: workbookSummary.workbook,
            sheets: workbookSummary.sheets.map((entry) => ({
                name: entry.name,
                state: entry.state || 'visible',
                hidden: entry.hidden === true,
                usedRange: entry.usedRange,
                rowCount: entry.rowCount,
                columnCount: entry.columnCount,
                hiddenRowCount: entry.hiddenRows?.length || 0,
                hiddenColumnCount: entry.hiddenColumns?.length || 0,
                tableCount: entry.tables.length,
                mergeCount: entry.merges.length,
                formulaCount: entry.formulas.length,
                formulaErrorCount: entry.formulaErrors.length
            }))
        };
    }
    if (!sheet) {
        return { kind, diagnostics: [createDiagnostic('sheet_not_found', 'error', `No worksheet matched target: ${target}`)] };
    }
    if (kind === 'sheet') {
        return {
            kind: 'sheet',
            sheet
        };
    }
    if (kind === 'range' || kind === 'table' || kind === 'style' || kind === 'computedstyle') {
        const bounds = parseRangeRef(parsedTarget.rangeRef) || sheet.dimensions;
        const rangeCells = sheet.cells.filter((cell) => {
            const parsed = parseCellRef(cell.ref);
            return parsed
                && parsed.row >= bounds.startRow
                && parsed.row <= bounds.endRow
                && parsed.col >= bounds.startCol
                && parsed.col <= bounds.endCol;
        });
        return {
            kind,
            sheetName: sheet.name,
            target: `${sheet.name}!${cellRef(bounds.startRow, bounds.startCol)}:${cellRef(bounds.endRow, bounds.endCol)}`,
            rows: bounds.endRow - bounds.startRow + 1,
            cols: bounds.endCol - bounds.startCol + 1,
            cells: rangeCells,
            tables: sheet.tables.filter((table) => !table.ref || table.ref === parsedTarget.rangeRef),
            merges: sheet.merges.filter((merge) => {
                const mergeBounds = parseRangeRef(merge);
                return mergeBounds
                    && mergeBounds.endRow >= bounds.startRow
                    && mergeBounds.startRow <= bounds.endRow
                    && mergeBounds.endCol >= bounds.startCol
                    && mergeBounds.startCol <= bounds.endCol;
            })
        };
    }
    if (kind === 'formula' || kind === 'formulas') {
        return {
            kind: 'formula',
            sheetName: sheet.name,
            formulas: sheet.formulas,
            formulaErrors: sheet.formulaErrors
        };
    }
    if (kind === 'comment' || kind === 'comments') {
        return {
            kind: 'comment',
            comments: workbookSummary.sheets.flatMap((entry) =>
                (entry.comments || []).map((comment) => ({
                    sheetName: entry.name,
                    ref: `${entry.name}!${comment.ref}`,
                    text: comment.text,
                    note: comment.note
                }))
            )
        };
    }
    if (kind === 'visibility' || kind === 'hidden' || kind === 'hiddenrows' || kind === 'hiddencolumns') {
        return {
            kind: 'visibility',
            sheets: workbookSummary.sheets.map((entry) => ({
                name: entry.name,
                state: entry.state || 'visible',
                hidden: entry.hidden === true,
                hiddenRows: entry.hiddenRows || [],
                hiddenColumns: entry.hiddenColumns || []
            }))
        };
    }
    if (kind === 'definedname' || kind === 'definednames' || kind === 'defined_name' || kind === 'defined_names') {
        return {
            kind: 'definedName',
            definedNames: workbookSummary.workbook.definedNames || []
        };
    }
    if (kind === 'relationship' || kind === 'relationships') {
        return {
            kind: 'relationship',
            relationships: workbookSummary.workbook.inventory?.relationships || []
        };
    }
    if (kind === 'chart' || kind === 'charts') {
        return {
            kind: 'chart',
            charts: workbookSummary.workbook.inventory?.charts || []
        };
    }
    if (kind === 'image' || kind === 'images') {
        return {
            kind: 'image',
            images: workbookSummary.workbook.inventory?.images || [],
            imageAnchors: workbookSummary.workbook.inventory?.imageAnchors || []
        };
    }
    if (kind === 'shape' || kind === 'shapes' || kind === 'drawing' || kind === 'drawings') {
        return {
            kind: 'shape',
            drawings: workbookSummary.workbook.inventory?.drawings || []
        };
    }
    return {
        kind,
        sheetName: sheet.name,
        diagnostics: [createDiagnostic('unsupported_xlsx_inspect_kind', 'warning', `Unsupported XLSX inspect kind: ${kind}`)]
    };
}

function validateXlsxInspection(workbookSummary = {}) {
    const diagnostics = [];
    const sheets = workbookSummary.sheets || [];
    if (!sheets.length) {
        diagnostics.push(createDiagnostic(
            'xlsx_no_worksheets',
            'error',
            'Workbook contains no worksheets.'
        ));
    }
    for (const sheet of sheets) {
        if (!sheet.usedRange) {
            diagnostics.push(createDiagnostic(
                'xlsx_blank_sheet',
                'warning',
                `Worksheet ${sheet.name} has no used range.`,
                { sheetName: sheet.name }
            ));
        }
        for (const error of sheet.formulaErrors || []) {
            diagnostics.push(createDiagnostic(
                'xlsx_formula_error',
                'error',
                `Formula or cell at ${sheet.name}!${error.ref} contains ${error.error}.`,
                { sheetName: sheet.name, ref: error.ref, formula: error.formula, error: error.error }
            ));
        }
    }
    return {
        status: diagnostics.some((entry) => entry.severity === 'error' || entry.severity === 'fatal') ? 'failed' : 'passed',
        checks: {
            sheetCount: sheets.length,
            formulaErrorCount: sheets.reduce((sum, sheet) => sum + (sheet.formulaErrors?.length || 0), 0),
            blankSheetCount: sheets.filter((sheet) => !sheet.usedRange).length
        },
        diagnostics
    };
}

function getNeighborRefs(ref) {
    const parsed = parseCellRef(ref);
    if (!parsed) {
        return [];
    }
    return [
        cellRef(parsed.row - 1, parsed.col),
        cellRef(parsed.row + 1, parsed.col),
        cellRef(parsed.row, parsed.col - 1),
        cellRef(parsed.row, parsed.col + 1)
    ];
}

function solveWorkbookMapPath(sheetSummary, expected = {}) {
    const config = expected.mapPath;
    if (!config) {
        return null;
    }
    const obstacleColor = normalizeHex(config.obstacleColor || '0099FF');
    const startText = String(config.startText || 'START').toUpperCase();
    const endText = String(config.endText || 'END').toUpperCase();
    const diagnostics = [];
    const cellsByRef = new Map(sheetSummary.cells.map((entry) => [entry.ref, entry]));
    const walkable = new Map(sheetSummary.cells
        .filter((entry) => entry.fillRgb && normalizeHex(entry.fillRgb) !== obstacleColor)
        .map((entry) => [entry.ref, entry]));
    const start = [...walkable.values()].find((entry) => getPrimitiveText(entry.value ?? entry.text).toUpperCase() === startText);
    const end = [...walkable.values()].find((entry) => getPrimitiveText(entry.value ?? entry.text).toUpperCase() === endText);
    if (!start || !end) {
        diagnostics.push(createDiagnostic(
            'map_start_or_end_missing',
            'error',
            'Map path inspection could not find the configured START or END cell.'
        ));
        return { diagnostics, path: [], landed: null };
    }

    const pathRefs = [];
    const visited = new Set();
    let previous = '';
    let current = start.ref;
    for (let guard = 0; guard < walkable.size + 5; guard += 1) {
        pathRefs.push(current);
        visited.add(current);
        if (current === end.ref) {
            break;
        }
        const candidates = getNeighborRefs(current)
            .filter((ref) => walkable.has(ref))
            .filter((ref) => ref !== previous);
        const unvisitedCandidates = candidates.filter((ref) => !visited.has(ref));
        if (unvisitedCandidates.length !== 1) {
            diagnostics.push(createDiagnostic(
                unvisitedCandidates.length === 0 ? 'map_path_dead_end' : 'map_path_branch',
                'warning',
                `Map path walk found ${unvisitedCandidates.length} forward candidates at ${current}.`,
                { current, candidates: unvisitedCandidates }
            ));
            if (!unvisitedCandidates.length) {
                break;
            }
        }
        previous = current;
        current = unvisitedCandidates[0];
    }

    const targetIndex = Number(config.turns || 0) * Number(config.cellsPerTurn || 1);
    const landedRef = pathRefs[targetIndex] || '';
    const landed = landedRef ? cellsByRef.get(landedRef) : null;
    return {
        diagnostics,
        startCell: start.ref,
        endCell: end.ref,
        path: pathRefs,
        targetIndex,
        landed: landed ? {
            ref: landed.ref,
            row: landed.row,
            col: landed.col,
            value: landed.value,
            fillRgb: landed.fillRgb
        } : null
    };
}

function buildXlsxCellIndex(workbookSummary = {}) {
    const cells = [];
    for (const sheet of workbookSummary.sheets || []) {
        const errorsByRef = new Map((sheet.formulaErrors || []).map((entry) => [entry.ref, entry]));
        const commentsByRef = new Map((sheet.comments || []).map((entry) => [entry.ref, entry]));
        const formulasByRef = new Map((sheet.formulas || []).map((entry) => [entry.ref, entry]));
        const hiddenRows = new Set((sheet.hiddenRows || []).map((entry) => Number(entry.row)));
        const hiddenColumns = new Set((sheet.hiddenColumns || []).map((entry) => Number(entry.col)));
        const tableRefs = (sheet.tables || []).map((table) => ({
            name: table.name,
            ref: table.ref,
            bounds: parseRangeRef(table.ref)
        }));
        const mergeRefs = (sheet.merges || []).map((merge) => ({
            ref: merge,
            bounds: parseRangeRef(merge)
        }));
        for (const cell of sheet.cells || []) {
            const parsed = parseCellRef(cell.ref);
            const tableNames = tableRefs
                .filter((table) => table.bounds && parsed
                    && parsed.row >= table.bounds.startRow
                    && parsed.row <= table.bounds.endRow
                    && parsed.col >= table.bounds.startCol
                    && parsed.col <= table.bounds.endCol)
                .map((table) => table.name)
                .filter(Boolean);
            const mergeMatches = mergeRefs
                .filter((merge) => merge.bounds && parsed
                    && parsed.row >= merge.bounds.startRow
                    && parsed.row <= merge.bounds.endRow
                    && parsed.col >= merge.bounds.startCol
                    && parsed.col <= merge.bounds.endCol)
                .map((merge) => merge.ref);
            cells.push({
                kind: 'cell',
                sheetName: sheet.name,
                sheetState: sheet.state || 'visible',
                hiddenSheet: sheet.hidden === true || Boolean(sheet.state && sheet.state !== 'visible'),
                ref: cell.ref,
                fullRef: `${sheet.name}!${cell.ref}`,
                row: cell.row,
                col: cell.col,
                hiddenRow: hiddenRows.has(Number(cell.row)),
                hiddenColumn: hiddenColumns.has(Number(cell.col)),
                hidden: sheet.hidden === true
                    || Boolean(sheet.state && sheet.state !== 'visible')
                    || hiddenRows.has(Number(cell.row))
                    || hiddenColumns.has(Number(cell.col)),
                text: cell.text || getPrimitiveText(cell.value),
                value: clonePlain(cell.value),
                formula: cell.formula || formulasByRef.get(cell.ref)?.formula || '',
                result: clonePlain(cell.result ?? formulasByRef.get(cell.ref)?.result),
                error: cell.error || errorsByRef.get(cell.ref)?.error || '',
                fillRgb: normalizeHex(cell.fillRgb || cell.style?.fillRgb || ''),
                style: cell.style || {},
                comment: cell.comment || commentsByRef.get(cell.ref)?.text || '',
                note: cell.note || commentsByRef.get(cell.ref)?.note || null,
                dataValidation: cell.dataValidation || null,
                tableNames,
                mergeRefs: mergeMatches
            });
        }
    }
    return cells;
}

function buildXlsxIndexSummary(workbookSummary = {}, cellIndex = []) {
    const formulaCount = cellIndex.filter((cell) => cell.formula).length;
    const errorCount = cellIndex.filter((cell) => cell.error).length;
    const styledCellCount = cellIndex.filter((cell) => cell.fillRgb || Object.keys(cell.style || {}).length).length;
    const textCellCount = cellIndex.filter((cell) => cell.text).length;
    const tableCount = (workbookSummary.sheets || []).reduce((sum, sheet) => sum + (sheet.tables?.length || 0), 0);
    const mergeCount = (workbookSummary.sheets || []).reduce((sum, sheet) => sum + (sheet.merges?.length || 0), 0);
    const commentCount = (workbookSummary.sheets || []).reduce((sum, sheet) => sum + (sheet.comments?.length || 0), 0);
    const hiddenSheetCount = (workbookSummary.sheets || []).filter((sheet) => sheet.hidden === true || (sheet.state && sheet.state !== 'visible')).length;
    const hiddenRowCount = (workbookSummary.sheets || []).reduce((sum, sheet) => sum + (sheet.hiddenRows?.length || 0), 0);
    const hiddenColumnCount = (workbookSummary.sheets || []).reduce((sum, sheet) => sum + (sheet.hiddenColumns?.length || 0), 0);
    const tableRangeCount = (workbookSummary.sheets || []).reduce((sum, sheet) => sum + (sheet.tables || []).filter((table) => table.ref).length, 0);
    return {
        sheetCount: workbookSummary.workbook?.sheetCount || 0,
        indexedCellCount: cellIndex.length,
        textCellCount,
        styledCellCount,
        formulaCount,
        formulaErrorCount: errorCount,
        tableCount,
        tableRangeCount,
        mergeCount,
        commentCount,
        hiddenSheetCount,
        hiddenRowCount,
        hiddenColumnCount,
        definedNameCount: workbookSummary.workbook?.definedNames?.length || 0,
        relationshipCount: workbookSummary.workbook?.inventory?.relationships?.length || 0,
        chartCount: workbookSummary.workbook?.inventory?.charts?.length || 0,
        imageCount: workbookSummary.workbook?.inventory?.images?.length || 0,
        imageAnchorCount: workbookSummary.workbook?.inventory?.imageAnchors?.length || 0,
        drawingCount: workbookSummary.workbook?.inventory?.drawings?.length || 0
    };
}

function createWorkbookSummaryFromIndex(index = {}, expected = {}) {
    const summary = clonePlain(index.structure || { workbook: {}, sheets: [] });
    summary.sheets = (summary.sheets || []).map((sheet) => ({
        ...sheet,
        mapPath: solveWorkbookMapPath(sheet, expected || {})
    }));
    return summary;
}

function compactCandidate(match = {}) {
    const base = {
        kind: match.kind || match.type || 'match',
        ref: match.fullRef || match.ref || match.name || match.part || '',
        sheetName: match.sheetName || ''
    };
    for (const key of [
        'text',
        'cellText',
        'value',
        'formula',
        'error',
        'fillRgb',
        'name',
        'range',
        'fullRange',
        'target',
        'part',
        'mediaPart',
        'drawingPart',
        'reason',
        'row',
        'col',
        'sheetState',
        'hidden',
        'hiddenRow',
        'hiddenColumn',
        'comment'
    ]) {
        if (typeof match[key] !== 'undefined' && match[key] !== '') {
            base[key] = match[key];
        }
    }
    if (match.tableNames?.length) {
        base.tableNames = match.tableNames;
    }
    if (match.mergeRefs?.length) {
        base.mergeRefs = match.mergeRefs;
    }
    return base;
}

function buildCompactXlsxObservation(input = {}) {
    const index = input.index || {};
    const matches = input.matches || [];
    const workbook = index.structure?.workbook || {};
    const sheets = (index.structure?.sheets || []).map((sheet) => ({
        name: sheet.name,
        state: sheet.state || 'visible',
        hidden: sheet.hidden === true,
        usedRange: sheet.usedRange,
        formulaCount: sheet.formulas?.length || 0,
        formulaErrorCount: sheet.formulaErrors?.length || 0,
        tableCount: sheet.tables?.length || 0,
        mergeCount: sheet.merges?.length || 0,
        commentCount: sheet.comments?.length || 0,
        hiddenRowCount: sheet.hiddenRows?.length || 0,
        hiddenColumnCount: sheet.hiddenColumns?.length || 0,
        fillHistogram: sheet.fillHistogram || {}
    }));
    return {
        schema: 'ailis.artifact_tools.compact_observation.v1',
        format: 'xlsx',
        action: input.action || 'inspect',
        sourcePath: index.sourcePath || '',
        cache: {
            indexHit: index.cacheHit === true,
            signature: index.signature || {}
        },
        workbook: {
            sheetCount: workbook.sheetCount || 0,
            sheetNames: workbook.sheetNames || [],
            definedNameCount: workbook.definedNames?.length || 0,
            relationshipCount: workbook.inventory?.relationships?.length || 0,
            imageAnchorCount: workbook.inventory?.imageAnchors?.length || 0
        },
        indexSummary: index.summary || {},
        sheets,
        query: input.query || '',
        candidateCount: matches.length,
        candidates: matches.slice(0, clampNumber(input.maxCandidates, 20, 1, 100)).map(compactCandidate),
        diagnostics: (input.diagnostics || []).slice(0, 20).map((diagnostic) => ({
            code: diagnostic.code,
            severity: diagnostic.severity,
            message: diagnostic.message,
            target: diagnostic.target || diagnostic.details?.target || ''
        })),
        nextSearchKinds: ['text', 'style', 'formula', 'error', 'table', 'merge', 'comment', 'definedName', 'relationship', 'hidden', 'image']
    };
}

async function indexXlsxArtifact(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const signature = await getFileSignature(sourcePath);
    const cacheKey = buildCacheKey(['xlsx-index', sourcePath, signature.size, signature.mtimeMs]);
    const cached = XLSX_INDEX_CACHE.get(cacheKey);
    if (cached && input.refreshIndex !== true && input.refresh_index !== true) {
        return {
            ...cached,
            cacheHit: true
        };
    }
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(sourcePath);
    const include = normalizeInclude(input.include, ['values', 'formulas', 'styles', 'comments', 'validation']);
    const archive = await readZipEntries(sourcePath, [
        '\\.rels$',
        '^xl/drawings/.*\\.xml$',
        '^xl/charts/.*\\.xml$',
        '^xl/tables/table\\d+\\.xml$',
        '^xl/comments\\d+\\.xml$',
        '^xl/threadedComments/.*\\.xml$',
        '^xl/workbook\\.xml$'
    ]).catch((error) => ({
        names: [],
        entries: {},
        diagnostics: [createDiagnostic('xlsx_package_inventory_failed', 'warning', `XLSX package inventory failed: ${error.message || String(error)}`)]
    }));
    const packageInventory = buildXlsxPackageInventory(archive, workbook);
    const parsedTarget = parseWorkbookTarget(input.target || input.range || '', input.sheetName || input.sheet || workbook.worksheets[0]?.name || '');
    const targetBounds = parseRangeRef(parsedTarget.rangeRef);
    const maxRows = input.indexMaxRows || input.index_max_rows || input.maxRows || 1000;
    const maxCols = input.indexMaxCols || input.index_max_cols || input.maxCols || 200;
    const sheets = workbook.worksheets.map((sheet) => {
        const shouldUseTargetBounds = parsedTarget.sheetName && parsedTarget.sheetName === sheet.name && targetBounds && input.indexTargetOnly === true;
        return summarizeWorksheet(sheet, {
            include: [...include],
            bounds: shouldUseTargetBounds ? targetBounds : null,
            maxRows,
            maxCols,
            includeEmpty: input.includeEmpty === true || input.include_empty === true,
            tableInventory: packageInventory.tables || []
        });
    });
    const workbookSummary = {
        workbook: {
            sheetCount: sheets.length,
            sheetNames: sheets.map((sheet) => sheet.name),
            creator: workbook.creator || '',
            lastModifiedBy: workbook.lastModifiedBy || '',
            created: workbook.created ? workbook.created.toISOString?.() || String(workbook.created) : '',
            modified: workbook.modified ? workbook.modified.toISOString?.() || String(workbook.modified) : '',
            definedNames: summarizeDefinedNames(workbook),
            inventory: packageInventory
        },
        sheets
    };
    const validation = validateXlsxInspection(workbookSummary);
    const cellIndex = buildXlsxCellIndex(workbookSummary);
    const index = {
        schema: 'ailis.xlsx.index.v1',
        adapterId: 'xlsx',
        format: 'xlsx',
        sourcePath,
        signature,
        cacheKey,
        cacheHit: false,
        structure: workbookSummary,
        cellIndex,
        summary: buildXlsxIndexSummary(workbookSummary, cellIndex),
        validation,
        diagnostics: [...(archive.diagnostics || []), ...validation.diagnostics]
    };
    XLSX_INDEX_CACHE.set(cacheKey, index);
    return index;
}

function matchText(haystack = '', needle = '', exact = false) {
    const left = String(haystack ?? '');
    const right = String(needle ?? '');
    if (!right) {
        return Boolean(left);
    }
    return exact ? left === right : left.toLowerCase().includes(right.toLowerCase());
}

function inTarget(cell = {}, targetBounds = null, targetSheetName = '') {
    if (!targetBounds) {
        return true;
    }
    if (targetSheetName && cell.sheetName !== targetSheetName) {
        return false;
    }
    return cell.row >= targetBounds.startRow
        && cell.row <= targetBounds.endRow
        && cell.col >= targetBounds.startCol
        && cell.col <= targetBounds.endCol;
}

function rankXlsxMatch(match = {}, query = '') {
    const queryText = String(query || '').toLowerCase();
    let score = 0;
    if (match.kind === 'error') score += 80;
    if (match.kind === 'formula') score += 60;
    if (match.kind === 'style') score += 50;
    if (match.kind === 'text') score += 40;
    const text = [
        match.fullRef,
        match.ref,
        match.text,
        match.cellText,
        match.value,
        match.formula,
        match.comment,
        match.name,
        match.range,
        match.fullRange,
        match.target,
        match.part,
        match.mediaPart,
        match.drawingPart
    ]
        .map((entry) => String(entry ?? '').toLowerCase());
    if (queryText && text.some((entry) => entry === queryText)) {
        score += 100;
    } else if (queryText && text.some((entry) => entry.includes(queryText))) {
        score += 30;
    }
    return score;
}

async function searchXlsxArtifact(input = {}) {
    const index = await indexXlsxArtifact(input);
    const kind = String(input.searchKind || input.search_kind || input.kind || input.type || 'all').toLowerCase();
    const query = String(input.query ?? input.text ?? input.term ?? '').trim();
    const fillRgb = normalizeHex(input.fillRgb || input.fill || input.color || '');
    const errorQuery = String(input.error || input.errorCode || input.error_code || '').toUpperCase();
    const exact = input.exact === true;
    const parsedTarget = parseWorkbookTarget(input.target || input.range || '', input.sheetName || input.sheet || '');
    const targetBounds = parseRangeRef(parsedTarget.rangeRef);
    const maxResults = clampNumber(input.maxResults || input.max_results || input.limit, 50, 1, 500);
    const matches = [];
    const add = (match) => {
        matches.push({
            ...match,
            score: rankXlsxMatch(match, query || fillRgb || errorQuery)
        });
    };
    const cellKinds = new Set(['all', 'cell', 'cells', 'text', 'value', 'values']);
    const styleKinds = new Set(['all', 'style', 'styles', 'fill', 'color', 'computedstyle']);
    const formulaKinds = new Set(['all', 'formula', 'formulas']);
    const errorKinds = new Set(['all', 'error', 'errors', 'formula_error', 'formulaerrors']);
    const commentKinds = new Set(['all', 'comment', 'comments']);
    const hiddenKinds = new Set(['all', 'hidden', 'visibility', 'hiddenrow', 'hiddenrows', 'hiddencolumn', 'hiddencolumns', 'sheetstate']);
    for (const cell of index.cellIndex || []) {
        if (!inTarget(cell, targetBounds, parsedTarget.sheetName)) {
            continue;
        }
        if (cellKinds.has(kind) && (matchText(cell.text, query, exact) || matchText(cell.value, query, exact))) {
            add({ ...cell, kind: 'text', reason: query ? 'text_match' : 'non_empty_text' });
        }
        if (styleKinds.has(kind) && cell.fillRgb && (!fillRgb || normalizeHex(cell.fillRgb) === fillRgb)) {
            add({ ...cell, kind: 'style', reason: fillRgb ? 'fill_match' : 'styled_cell' });
        }
        if (formulaKinds.has(kind) && cell.formula && matchText(cell.formula, query, exact)) {
            add({ ...cell, kind: 'formula', reason: query ? 'formula_match' : 'formula_cell' });
        }
        if (errorKinds.has(kind) && cell.error && (!errorQuery || cell.error.toUpperCase().includes(errorQuery))) {
            add({ ...cell, kind: 'error', reason: errorQuery ? 'error_match' : 'formula_error' });
        }
        if (commentKinds.has(kind) && cell.comment && matchText(cell.comment, query, exact)) {
            add({
                ...cell,
                kind: 'comment',
                cellText: cell.text,
                text: cell.comment,
                reason: query ? 'comment_match' : 'comment_cell'
            });
        }
        if (hiddenKinds.has(kind) && cell.hidden) {
            const haystack = [
                cell.fullRef,
                cell.text,
                cell.value,
                cell.formula,
                cell.comment,
                cell.sheetState,
                cell.hiddenSheet ? 'hidden_sheet' : '',
                cell.hiddenRow ? 'hidden_row' : '',
                cell.hiddenColumn ? 'hidden_column' : ''
            ].join('\n');
            if (matchText(haystack, query, exact) || !query) {
                add({
                    ...cell,
                    kind: 'hidden',
                    reason: cell.hiddenSheet
                        ? 'hidden_sheet_cell'
                        : (cell.hiddenRow ? 'hidden_row_cell' : 'hidden_column_cell')
                });
            }
        }
    }
    if (hiddenKinds.has(kind)) {
        for (const sheet of index.structure.sheets || []) {
            if (sheet.hidden === true || (sheet.state && sheet.state !== 'visible')) {
                const haystack = [sheet.name, sheet.state, 'hidden sheet'].join('\n');
                if (matchText(haystack, query, exact) || !query) {
                    add({
                        kind: 'hiddenSheet',
                        sheetName: sheet.name,
                        ref: sheet.name,
                        sheetState: sheet.state || 'visible',
                        hidden: true,
                        reason: 'hidden_sheet'
                    });
                }
            }
            for (const row of sheet.hiddenRows || []) {
                const ref = `${sheet.name}!${row.range}`;
                if (matchText(ref, query, exact) || !query) {
                    add({
                        kind: 'hiddenRow',
                        sheetName: sheet.name,
                        ref,
                        row: row.row,
                        hidden: true,
                        reason: 'hidden_row'
                    });
                }
            }
            for (const column of sheet.hiddenColumns || []) {
                const ref = `${sheet.name}!${column.range}`;
                if (matchText(ref, query, exact) || !query) {
                    add({
                        kind: 'hiddenColumn',
                        sheetName: sheet.name,
                        ref,
                        col: column.col,
                        hidden: true,
                        reason: 'hidden_column'
                    });
                }
            }
        }
    }
    if (['all', 'table', 'tables'].includes(kind)) {
        for (const sheet of index.structure.sheets || []) {
            for (const table of sheet.tables || []) {
                const haystack = [table.name, table.ref, ...(table.columns || []).map((column) => column.name)].join('\n');
                if (matchText(haystack, query, exact)) {
                    add({
                        kind: 'table',
                        sheetName: sheet.name,
                        name: table.name,
                        ref: table.ref ? `${sheet.name}!${table.ref}` : sheet.name,
                        range: table.ref,
                        columns: table.columns || [],
                        reason: query ? 'table_match' : 'table_inventory'
                    });
                }
            }
        }
    }
    if (['all', 'merge', 'merges', 'merged'].includes(kind)) {
        for (const sheet of index.structure.sheets || []) {
            for (const merge of sheet.merges || []) {
                const fullRef = `${sheet.name}!${merge}`;
                if (matchText(fullRef, query, exact)) {
                    add({
                        kind: 'merge',
                        sheetName: sheet.name,
                        ref: fullRef,
                        range: merge,
                        reason: query ? 'merge_match' : 'merge_inventory'
                    });
                }
            }
        }
    }
    if (['all', 'definedname', 'definednames', 'defined_name', 'defined_names'].includes(kind)) {
        for (const definedName of index.structure.workbook.definedNames || []) {
            const haystack = [definedName.name, ...(definedName.ranges || [])].join('\n');
            if (matchText(haystack, query, exact)) {
                add({
                    kind: 'definedName',
                    name: definedName.name,
                    ranges: definedName.ranges,
                    ref: definedName.ranges?.[0] || definedName.name,
                    reason: query ? 'defined_name_match' : 'defined_name_inventory'
                });
            }
        }
    }
    const inventory = index.structure.workbook.inventory || {};
    const inventorySearch = [
        ['relationship', ['relationship', 'relationships'], inventory.relationships || []],
        ['chart', ['chart', 'charts'], inventory.charts || []],
        ['image', ['image', 'images'], inventory.images || []],
        ['imageAnchor', ['imageanchor', 'imageanchors', 'anchor', 'anchors'], inventory.imageAnchors || []],
        ['shape', ['shape', 'shapes', 'drawing', 'drawings'], inventory.drawings || []]
    ];
    for (const [inventoryKind, aliases, items] of inventorySearch) {
        if (!aliases.includes(kind) && kind !== 'all') {
            continue;
        }
        for (const item of items) {
            const haystack = JSON.stringify(item);
            if (matchText(haystack, query, exact)) {
                add({
                    ...item,
                    kind: inventoryKind,
                    ref: item.fullRange || item.range || item.part || item.target || item.id || inventoryKind,
                    reason: query ? `${inventoryKind}_match` : `${inventoryKind}_inventory`
                });
            }
        }
    }
    const ranked = matches
        .sort((left, right) => right.score - left.score || String(left.ref || left.fullRef).localeCompare(String(right.ref || right.fullRef)))
        .slice(0, maxResults);
    const observation = buildCompactXlsxObservation({
        index,
        matches: ranked,
        action: 'search',
        query: query || fillRgb || errorQuery || kind,
        diagnostics: index.diagnostics,
        maxCandidates: input.maxCandidates || input.max_candidates || 20
    });
    return {
        schema: 'ailis.xlsx.search.v1',
        adapterId: 'xlsx',
        format: 'xlsx',
        sourcePath: index.sourcePath,
        index: {
            cacheHit: index.cacheHit,
            summary: index.summary,
            signature: index.signature
        },
        search: {
            kind,
            query,
            fillRgb,
            error: errorQuery,
            target: input.target || input.range || '',
            returned: ranked.length,
            totalCandidates: matches.length,
            maxResults
        },
        matches: ranked.map(compactCandidate),
        observation,
        diagnostics: index.diagnostics
    };
}

async function searchArtifact(input = {}) {
    const format = normalizeFormat(input.format, input.sourcePath || input.path);
    if (format === 'xlsx' || format === 'xlsm') {
        return searchXlsxArtifact(input);
    }
    if (FILE_ADAPTER_FORMATS.has(format)) {
        return searchFileArtifact({ ...input, format });
    }
    if (format === 'csv' || format === 'tsv') {
        const inspection = await inspectCsvArtifact({ ...input, format });
        const query = String(input.query || input.text || input.term || '').trim().toLowerCase();
        const rows = inspection.structure.rows || [];
        const matches = [];
        rows.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                const text = String(value ?? '');
                if (!query || text.toLowerCase().includes(query)) {
                    matches.push({
                        kind: 'cell',
                        ref: `R${rowIndex + 1}C${colIndex + 1}`,
                        row: rowIndex + 1,
                        column: colIndex + 1,
                        text
                    });
                }
            });
        });
        const limit = clampNumber(input.limit, 20, 1, 100);
        const returned = matches.slice(0, limit);
        return {
            schema: 'ailis.csv.search.v1',
            adapterId: 'csv',
            format,
            sourcePath: inspection.sourcePath,
            kind: String(input.searchKind || input.kind || 'all'),
            query,
            returned: returned.length,
            totalCandidates: matches.length,
            matches: returned,
            observation: {
                schema: 'ailis.artifact_tools.compact_observation.v1',
                action: 'search',
                format,
                sourcePath: inspection.sourcePath,
                query,
                candidates: returned.map((match) => ({ ref: match.ref, kind: match.kind, text: match.text }))
            }
        };
    }
    throw new Error(`Search is not implemented for artifact format: ${format}`);
}

function normalizeQueryKey(value = '') {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '');
}

function getQueryCellValue(cell = {}) {
    if (typeof cell.result !== 'undefined' && cell.result !== null && cell.result !== '') {
        return clonePlain(cell.result);
    }
    if (typeof cell.value !== 'undefined') {
        if (cell.value && typeof cell.value === 'object') {
            if (Object.prototype.hasOwnProperty.call(cell.value, 'result')) {
                return clonePlain(cell.value.result);
            }
            if (Object.prototype.hasOwnProperty.call(cell.value, 'text')) {
                return cell.value.text;
            }
            if (Object.prototype.hasOwnProperty.call(cell.value, 'hyperlink')) {
                return cell.value.text || cell.value.hyperlink;
            }
        }
        return clonePlain(cell.value);
    }
    return cell.text || '';
}

function valuesMatchForQuery(actual, expected) {
    if (Array.isArray(expected)) {
        return expected.some((entry) => valuesMatchForQuery(actual, entry));
    }
    if (typeof expected === 'boolean') {
        return Boolean(actual) === expected;
    }
    if (typeof expected === 'number') {
        return Number(actual) === expected;
    }
    const expectedText = String(expected ?? '').trim().toLowerCase();
    const actualText = String(actual ?? '').trim().toLowerCase();
    if (!expectedText) {
        return Boolean(actualText);
    }
    return actualText === expectedText;
}

function coerceQueryNumber(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    const text = String(value ?? '').replace(/[$,%\s,]/g, '');
    const number = Number(text);
    return Number.isFinite(number) ? number : null;
}

function resolveXlsxQueryTable(index = {}, input = {}) {
    const requestedName = normalizeQueryKey(input.table || input.tableName || input.table_name || '');
    const requestedSheet = String(input.sheetName || input.sheet || '').trim();
    const requestedRange = String(input.target || input.range || '').trim();
    const parsedTarget = parseWorkbookTarget(requestedRange, requestedSheet);
    const tables = [];
    for (const sheet of index.structure?.sheets || []) {
        for (const table of sheet.tables || []) {
            tables.push({ sheet, table });
        }
    }
    if (requestedName) {
        const named = tables.find(({ table }) =>
            normalizeQueryKey(table.name) === requestedName
            || normalizeQueryKey(table.displayName) === requestedName
        );
        if (named) {
            return named;
        }
    }
    if (parsedTarget.rangeRef || parsedTarget.sheetName) {
        const targetBounds = parseRangeRef(parsedTarget.rangeRef);
        const matched = tables.find(({ sheet, table }) => {
            if (parsedTarget.sheetName && parsedTarget.sheetName !== sheet.name) {
                return false;
            }
            if (!targetBounds) {
                return true;
            }
            const tableBounds = parseRangeRef(table.ref);
            return tableBounds
                && tableBounds.startRow <= targetBounds.startRow
                && tableBounds.endRow >= targetBounds.endRow
                && tableBounds.startCol <= targetBounds.startCol
                && tableBounds.endCol >= targetBounds.endCol;
        });
        if (matched) {
            return matched;
        }
        return null;
    }
    return tables[0] || null;
}

function buildXlsxTableRows(index = {}, sheet = {}, table = {}) {
    const bounds = parseRangeRef(table.ref || '');
    if (!bounds) {
        return {
            columns: table.columns || [],
            rows: [],
            diagnostics: [createDiagnostic(
                'xlsx_query_table_range_missing',
                'warning',
                `Table ${table.name || '(unnamed)'} does not expose a usable range.`
            )]
        };
    }
    const cellsByRef = new Map((index.cellIndex || [])
        .filter((cell) => cell.sheetName === sheet.name)
        .map((cell) => [cell.ref, cell]));
    const headerCells = [];
    const columns = [];
    for (let col = bounds.startCol; col <= bounds.endCol; col += 1) {
        const ref = cellRef(bounds.startRow, col);
        const cell = cellsByRef.get(ref) || {};
        const fallbackColumn = (table.columns || [])[col - bounds.startCol] || {};
        const name = String(getQueryCellValue(cell) || fallbackColumn.name || `Column${col - bounds.startCol + 1}`);
        headerCells.push({
            name,
            ref: `${sheet.name}!${ref}`
        });
        columns.push({
            name,
            key: normalizeQueryKey(name) || `column${col - bounds.startCol + 1}`,
            ref: `${sheet.name}!${ref}`,
            index: col - bounds.startCol
        });
    }
    const rows = [];
    for (let row = bounds.startRow + 1; row <= bounds.endRow; row += 1) {
        const values = {};
        const cells = {};
        let nonEmpty = false;
        let hiddenRow = false;
        let hiddenColumn = false;
        let hiddenSheet = sheet.hidden === true || Boolean(sheet.state && sheet.state !== 'visible');
        for (let col = bounds.startCol; col <= bounds.endCol; col += 1) {
            const column = columns[col - bounds.startCol];
            const ref = cellRef(row, col);
            const cell = cellsByRef.get(ref) || {
                sheetName: sheet.name,
                ref,
                fullRef: `${sheet.name}!${ref}`,
                row,
                col
            };
            const value = getQueryCellValue(cell);
            values[column.name] = value;
            values[column.key] = value;
            cells[column.name] = compactCandidate({ ...cell, kind: 'cell' });
            hiddenRow = hiddenRow || cell.hiddenRow === true;
            hiddenColumn = hiddenColumn || cell.hiddenColumn === true;
            hiddenSheet = hiddenSheet || cell.hiddenSheet === true;
            if (String(value ?? '').trim()) {
                nonEmpty = true;
            }
        }
        if (nonEmpty) {
            rows.push({
                rowNumber: row,
                ref: `${sheet.name}!${cellRef(row, bounds.startCol)}:${cellRef(row, bounds.endCol)}`,
                hidden: hiddenSheet || hiddenRow || hiddenColumn,
                hiddenSheet,
                hiddenRow,
                hiddenColumn,
                values,
                cells
            });
        }
    }
    return {
        range: `${sheet.name}!${table.ref}`,
        columns,
        headerCells,
        rows,
        diagnostics: []
    };
}

function resolveXlsxQueryRange(index = {}, input = {}) {
    const requestedSheet = String(input.sheetName || input.sheet || '').trim();
    const requestedRange = String(input.target || input.range || input.addressRange || input.address_range || '').trim();
    const parsedTarget = parseWorkbookTarget(requestedRange, requestedSheet);
    const sheets = index.structure?.sheets || [];
    const sheet = parsedTarget.sheetName
        ? sheets.find((entry) => String(entry.name || '').toLowerCase() === parsedTarget.sheetName.toLowerCase())
        : sheets[0];
    if (!sheet) {
        return {
            sheet: null,
            bounds: null,
            diagnostics: [createDiagnostic(
                'xlsx_query_sheet_not_found',
                'error',
                `No worksheet matched ${parsedTarget.sheetName || requestedSheet || '(first sheet)'}.`,
                { availableSheets: sheets.map((entry) => entry.name) }
            )]
        };
    }
    const fallbackRange = sheet.usedRange || (
        sheet.dimensions
            ? `${cellRef(sheet.dimensions.startRow || 1, sheet.dimensions.startCol || 1)}:${cellRef(sheet.dimensions.endRow || 1, sheet.dimensions.endCol || 1)}`
            : 'A1:A1'
    );
    const rangeRef = parsedTarget.rangeRef || fallbackRange;
    const requestedBounds = parseRangeRef(rangeRef);
    if (!requestedBounds) {
        return {
            sheet,
            bounds: null,
            diagnostics: [createDiagnostic(
                'xlsx_query_invalid_range',
                'error',
                `Invalid XLSX range query target: ${requestedRange || rangeRef}.`,
                { target: requestedRange || rangeRef }
            )]
        };
    }
    const diagnostics = [];
    const usedBounds = parseRangeRef(sheet.usedRange || '');
    const preserveRequestedRange = input.preserveRequestedRange === true
        || input.preserve_requested_range === true
        || input.includeEmptyMargin === true
        || input.include_empty_margin === true;
    let bounds = requestedBounds;
    if (
        usedBounds
        && parsedTarget.rangeRef
        && !preserveRequestedRange
        && boundsContain(requestedBounds, usedBounds)
        && !boundsEqual(requestedBounds, usedBounds)
    ) {
        bounds = usedBounds;
        diagnostics.push(createDiagnostic(
            'xlsx_query_trimmed_to_used_range',
            'info',
            `Requested range ${rangeRef} fully contains used range ${sheet.usedRange}; returning the used range to avoid model-visible empty margins.`,
            {
                requestedRange: `${sheet.name}!${boundsToRangeRef(requestedBounds)}`,
                usedRange: `${sheet.name}!${boundsToRangeRef(usedBounds)}`,
                preserveWith: 'preserveRequestedRange=true'
            }
        ));
    }
    return {
        sheet,
        bounds,
        requestedRange: `${sheet.name}!${boundsToRangeRef(requestedBounds)}`,
        usedRange: usedBounds ? `${sheet.name}!${boundsToRangeRef(usedBounds)}` : '',
        range: `${sheet.name}!${cellRef(bounds.startRow, bounds.startCol)}:${cellRef(bounds.endRow, bounds.endCol)}`,
        diagnostics
    };
}

function compactRangeCell(cell = {}, ref = '', row = 1, col = 1, sheetName = '') {
    const fillRgb = normalizeHex(cell.fillRgb || cell.style?.fillRgb || '');
    const value = getQueryCellValue(cell);
    const text = String(cell.text ?? value ?? '').trim();
    return {
        ref: `${sheetName}!${ref}`,
        address: ref,
        row,
        col,
        value,
        text,
        fillRgb,
        formula: cell.formula || '',
        error: cell.error || '',
        hidden: cell.hidden === true || cell.hiddenRow === true || cell.hiddenColumn === true || cell.hiddenSheet === true,
        hiddenRow: cell.hiddenRow === true,
        hiddenColumn: cell.hiddenColumn === true,
        hiddenSheet: cell.hiddenSheet === true
    };
}

function displayRangeCell(cell = {}) {
    const valueText = String(cell.text ?? cell.value ?? '').trim();
    if (valueText) {
        return valueText;
    }
    if (cell.fillRgb) {
        return `#${cell.fillRgb}`;
    }
    if (cell.formula) {
        return `=${cell.formula}`;
    }
    if (cell.error) {
        return cell.error;
    }
    return '.';
}

function buildXlsxRangeRows(index = {}, input = {}) {
    const resolved = resolveXlsxQueryRange(index, input);
    if (!resolved.sheet || !resolved.bounds) {
        return {
            kind: 'range',
            passed: false,
            diagnostics: resolved.diagnostics || [],
            rows: [],
            compactGrid: []
        };
    }
    const { sheet, bounds } = resolved;
    const maxRows = clampNumber(input.maxRows || input.max_rows || input.limitRows || input.limit_rows, 80, 1, 500);
    const maxCols = clampNumber(input.maxCols || input.max_cols || input.limitCols || input.limit_cols, 40, 1, 200);
    const returnedEndRow = Math.min(bounds.endRow, bounds.startRow + maxRows - 1);
    const returnedEndCol = Math.min(bounds.endCol, bounds.startCol + maxCols - 1);
    const cellsByRef = new Map((index.cellIndex || [])
        .filter((cell) => cell.sheetName === sheet.name)
        .map((cell) => [cell.ref, cell]));
    const columns = [];
    for (let col = bounds.startCol; col <= returnedEndCol; col += 1) {
        columns.push(colName(col));
    }
    const rows = [];
    const compactGrid = [];
    const fillHistogram = {};
    for (let row = bounds.startRow; row <= returnedEndRow; row += 1) {
        const cells = [];
        const values = [];
        const fills = [];
        const display = [];
        for (let col = bounds.startCol; col <= returnedEndCol; col += 1) {
            const ref = cellRef(row, col);
            const cell = compactRangeCell(cellsByRef.get(ref) || {}, ref, row, col, sheet.name);
            cells.push(cell);
            values.push(cell.value ?? '');
            fills.push(cell.fillRgb || '');
            display.push(displayRangeCell(cell));
            if (cell.fillRgb) {
                fillHistogram[cell.fillRgb] = (fillHistogram[cell.fillRgb] || 0) + 1;
            }
        }
        rows.push({
            rowNumber: row,
            ref: `${sheet.name}!${cellRef(row, bounds.startCol)}:${cellRef(row, returnedEndCol)}`,
            cells,
            values,
            fills,
            display
        });
        compactGrid.push({
            rowNumber: row,
            cells: display
        });
    }
    const truncated = returnedEndRow < bounds.endRow || returnedEndCol < bounds.endCol;
    return {
        kind: 'range',
        passed: true,
        sheetName: sheet.name,
        range: resolved.range,
        requestedRange: resolved.requestedRange || resolved.range,
        usedRange: resolved.usedRange || '',
        returnedRange: `${sheet.name}!${cellRef(bounds.startRow, bounds.startCol)}:${cellRef(returnedEndRow, returnedEndCol)}`,
        rowCount: rows.length,
        columnCount: columns.length,
        requestedRows: Math.max(0, bounds.endRow - bounds.startRow + 1),
        requestedColumns: Math.max(0, bounds.endCol - bounds.startCol + 1),
        truncated,
        columns,
        rows,
        compactGrid,
        fillHistogram,
        diagnostics: resolved.diagnostics || []
    };
}

function normalizeQueryFilter(input = {}) {
    const filter = input.filter || input.where || {};
    if (!filter || typeof filter !== 'object' || Array.isArray(filter)) {
        return {};
    }
    return filter;
}

function rowMatchesQueryFilter(row = {}, filter = {}) {
    for (const [rawKey, expected] of Object.entries(filter)) {
        const normalizedKey = normalizeQueryKey(rawKey);
        let actual;
        if (normalizedKey === 'hidden' || normalizedKey === 'ishidden') {
            actual = row.hidden;
        } else if (normalizedKey === 'hiddenrow') {
            actual = row.hiddenRow;
        } else if (normalizedKey === 'hiddencolumn') {
            actual = row.hiddenColumn;
        } else if (normalizedKey === 'hiddensheet') {
            actual = row.hiddenSheet;
        } else if (normalizedKey === 'rownumber' || normalizedKey === 'row') {
            actual = row.rowNumber;
        } else {
            actual = row.values[rawKey];
            if (typeof actual === 'undefined') {
                actual = row.values[normalizedKey];
            }
        }
        if (!valuesMatchForQuery(actual, expected)) {
            return false;
        }
    }
    return true;
}

function resolveQueryAggregate(input = {}) {
    const aggregate = input.aggregate || input.aggregation || {};
    if (typeof aggregate === 'string') {
        return {
            op: aggregate,
            column: input.column || input.valueColumn || input.value_column || ''
        };
    }
    if (aggregate && typeof aggregate === 'object') {
        return {
            op: aggregate.op || aggregate.operation || aggregate.function || input.op || 'count',
            column: aggregate.column || aggregate.field || aggregate.valueColumn || input.column || input.valueColumn || input.value_column || ''
        };
    }
    return {
        op: input.op || 'count',
        column: input.column || input.valueColumn || input.value_column || ''
    };
}

function computeAggregate(rows = [], aggregate = {}) {
    const op = String(aggregate.op || 'count').toLowerCase();
    const column = aggregate.column || '';
    const key = normalizeQueryKey(column);
    const values = rows.map((row) => row.values[column] ?? row.values[key]);
    if (op === 'count') {
        return {
            op,
            column,
            value: rows.length,
            rowCount: rows.length
        };
    }
    const numericValues = values
        .map((value, index) => ({ value: coerceQueryNumber(value), row: rows[index] }))
        .filter((entry) => entry.value !== null);
    if (!numericValues.length) {
        return {
            op,
            column,
            value: null,
            rowCount: rows.length,
            numericCount: 0
        };
    }
    if (op === 'sum') {
        return {
            op,
            column,
            value: numericValues.reduce((sum, entry) => sum + entry.value, 0),
            rowCount: rows.length,
            numericCount: numericValues.length
        };
    }
    if (op === 'avg' || op === 'average' || op === 'mean') {
        const sum = numericValues.reduce((total, entry) => total + entry.value, 0);
        return {
            op: 'avg',
            column,
            value: sum / numericValues.length,
            rowCount: rows.length,
            numericCount: numericValues.length
        };
    }
    const comparator = op === 'min'
        ? (left, right) => left.value - right.value
        : (left, right) => right.value - left.value;
    const [best] = numericValues.sort(comparator);
    return {
        op: op === 'min' ? 'min' : 'max',
        column,
        value: best.value,
        rowCount: rows.length,
        numericCount: numericValues.length,
        row: best.row ? {
            rowNumber: best.row.rowNumber,
            ref: best.row.ref,
            hidden: best.row.hidden,
            values: best.row.values
        } : null
    };
}

function buildQueryObservation(query = {}) {
    if (query.kind === 'range') {
        const compactRows = (query.compactGrid || []).slice(0, 80).map((row) => ({
            rowNumber: row.rowNumber,
            cells: row.cells
        }));
        return {
            schema: 'ailis.artifact_tools.compact_observation.v1',
            format: 'xlsx',
            action: 'query',
            sourcePath: query.sourcePath || '',
            kind: 'range',
            sheetName: query.sheetName || '',
            range: query.range || '',
            requestedRange: query.requestedRange || query.range || '',
            usedRange: query.usedRange || '',
            returnedRange: query.returnedRange || query.range || '',
            rowCount: query.rowCount || 0,
            columnCount: query.columnCount || 0,
            requestedRows: query.requestedRows || query.rowCount || 0,
            requestedColumns: query.requestedColumns || query.columnCount || 0,
            truncated: query.truncated === true,
            columns: query.columns || [],
            fillHistogram: query.fillHistogram || {},
            compactRows,
            candidateCount: compactRows.length,
            nextActions: query.truncated === true ? [{
                action: 'query',
                reason: 'range_result_truncated_by_maxRows_or_maxCols',
                args: {
                    action: 'query',
                    sessionId: query.sessionId || '',
                    sheet: query.sheetName || '',
                    range: query.range || '',
                    include: ['values', 'styles', 'formulas', 'comments'],
                    maxRows: query.requestedRows || query.rowCount || 80,
                    maxCols: query.requestedColumns || query.columnCount || 40
                }
            }] : [],
            diagnostics: (query.diagnostics || []).slice(0, 20).map((diagnostic) => ({
                code: diagnostic.code,
                severity: diagnostic.severity,
                message: diagnostic.message,
                target: diagnostic.target || diagnostic.details?.target || ''
            }))
        };
    }
    const candidates = [];
    for (const row of query.rows || []) {
        candidates.push({
            kind: 'row',
            ref: row.ref,
            row: row.rowNumber,
            hidden: row.hidden,
            text: Object.entries(row.values)
                .filter(([key]) => key && key === normalizeQueryKey(key) ? false : true)
                .map(([key, value]) => `${key}=${value}`)
                .slice(0, 12)
                .join('; ')
        });
    }
    return {
        schema: 'ailis.artifact_tools.compact_observation.v1',
        format: 'xlsx',
        action: 'query',
        sourcePath: query.sourcePath || '',
        table: query.table,
        tableRange: query.range,
        rowCount: query.rows?.length || 0,
        columns: query.columns?.map((column) => column.name) || [],
        aggregate: query.aggregateResult || null,
        groups: query.groups?.slice(0, 20) || [],
        candidateCount: candidates.length,
        candidates: candidates.slice(0, 20)
    };
}

async function queryXlsxArtifact(input = {}) {
    const index = await indexXlsxArtifact(input);
    const selected = resolveXlsxQueryTable(index, input);
    if (!selected) {
        const rangeData = buildXlsxRangeRows(index, input);
        const rangeQuery = rangeData.passed === true ? {
            schema: 'ailis.xlsx.query.v1',
            adapterId: 'xlsx',
            format: 'xlsx',
            sourcePath: index.sourcePath,
            sessionId: input.sessionId || input.session_id || '',
            kind: 'range',
            passed: true,
            sheetName: rangeData.sheetName || '',
            range: rangeData.range || '',
            requestedRange: rangeData.requestedRange || rangeData.range || '',
            usedRange: rangeData.usedRange || '',
            returnedRange: rangeData.returnedRange || '',
            rowCount: rangeData.rowCount || 0,
            columnCount: rangeData.columnCount || 0,
            requestedRows: rangeData.requestedRows || 0,
            requestedColumns: rangeData.requestedColumns || 0,
            truncated: rangeData.truncated === true,
            columns: rangeData.columns || [],
            rows: rangeData.rows || [],
            compactGrid: rangeData.compactGrid || [],
            fillHistogram: rangeData.fillHistogram || {},
            diagnostics: rangeData.diagnostics || [],
            groups: []
        } : {
            schema: 'ailis.xlsx.query.v1',
            adapterId: 'xlsx',
            format: 'xlsx',
            sourcePath: index.sourcePath,
            sessionId: input.sessionId || input.session_id || '',
            kind: 'range',
            passed: false,
            diagnostics: rangeData.diagnostics?.length
                ? rangeData.diagnostics
                : [createDiagnostic('xlsx_query_no_table_or_range', 'error', 'No table was found and the used range could not be resolved for XLSX query.')],
            rows: [],
            compactGrid: [],
            groups: []
        };
        rangeQuery.observation = buildQueryObservation(rangeQuery);
        return rangeQuery;
    }
    const tableData = buildXlsxTableRows(index, selected.sheet, selected.table);
    const filter = normalizeQueryFilter(input);
    const filteredRows = tableData.rows.filter((row) => rowMatchesQueryFilter(row, filter));
    const groupBy = input.groupBy || input.group_by || input.groupby || '';
    const groupKey = normalizeQueryKey(groupBy);
    const aggregate = resolveQueryAggregate(input);
    const aggregateResult = computeAggregate(filteredRows, aggregate);
    let groups = [];
    if (groupBy) {
        const groupMap = new Map();
        for (const row of filteredRows) {
            const key = String(row.values[groupBy] ?? row.values[groupKey] ?? '');
            if (!groupMap.has(key)) {
                groupMap.set(key, []);
            }
            groupMap.get(key).push(row);
        }
        groups = [...groupMap.entries()].map(([key, rows]) => ({
            key,
            rowCount: rows.length,
            aggregate: computeAggregate(rows, aggregate),
            rows: rows.slice(0, clampNumber(input.groupSampleRows || input.group_sample_rows, 3, 0, 20)).map((row) => ({
                rowNumber: row.rowNumber,
                ref: row.ref,
                hidden: row.hidden,
                values: row.values
            }))
        }));
    }
    const sortBy = input.sortBy || input.sort_by || '';
    const sortKey = normalizeQueryKey(sortBy);
    if (sortBy) {
        filteredRows.sort((left, right) => {
            const leftValue = left.values[sortBy] ?? left.values[sortKey];
            const rightValue = right.values[sortBy] ?? right.values[sortKey];
            const leftNumber = coerceQueryNumber(leftValue);
            const rightNumber = coerceQueryNumber(rightValue);
            const direction = input.descending === false || input.order === 'asc' ? 1 : -1;
            if (leftNumber !== null && rightNumber !== null) {
                return direction * (leftNumber - rightNumber);
            }
            return direction * String(leftValue ?? '').localeCompare(String(rightValue ?? ''), undefined, { numeric: true });
        });
    }
    if (groups.length) {
        groups.sort((left, right) => {
            const leftValue = coerceQueryNumber(left.aggregate?.value);
            const rightValue = coerceQueryNumber(right.aggregate?.value);
            if (leftValue !== null && rightValue !== null) {
                return (input.descending === false || input.order === 'asc' ? 1 : -1) * (leftValue - rightValue);
            }
            return String(left.key).localeCompare(String(right.key), undefined, { numeric: true });
        });
    }
    const top = clampNumber(input.top || input.limit, filteredRows.length || 50, 1, 500);
    const resultRows = filteredRows.slice(0, top);
    const resultGroups = groups.slice(0, clampNumber(input.topGroups || input.top_groups || input.top || input.limit, groups.length || 50, 1, 500));
    const query = {
        schema: 'ailis.xlsx.query.v1',
        adapterId: 'xlsx',
        format: 'xlsx',
        sourcePath: index.sourcePath,
        passed: tableData.diagnostics.every((diagnostic) => diagnostic.severity !== 'error' && diagnostic.severity !== 'fatal'),
        table: selected.table.name || '',
        sheetName: selected.sheet.name,
        range: tableData.range,
        columns: tableData.columns,
        filter,
        groupBy: groupBy || '',
        aggregate,
        aggregateResult,
        rows: resultRows.map((row) => ({
            rowNumber: row.rowNumber,
            ref: row.ref,
            hidden: row.hidden,
            hiddenSheet: row.hiddenSheet,
            hiddenRow: row.hiddenRow,
            hiddenColumn: row.hiddenColumn,
            values: row.values,
            cells: row.cells
        })),
        rowCount: resultRows.length,
        totalMatchedRows: filteredRows.length,
        groups: resultGroups,
        diagnostics: tableData.diagnostics
    };
    query.observation = buildQueryObservation(query);
    return query;
}

async function inspectXlsxArtifact(input = {}) {
    const index = await indexXlsxArtifact(input);
    const sourcePath = index.sourcePath;
    const workbookSummary = createWorkbookSummaryFromIndex(index, input.expected || {});
    const validation = validateXlsxInspection(workbookSummary);
    const view = buildXlsxInspectView(workbookSummary, input);
    const viewMatches = Array.isArray(view.cells)
        ? view.cells.map((cell) => ({ ...cell, kind: 'cell', fullRef: `${view.sheetName}!${cell.ref}`, sheetName: view.sheetName }))
        : [];
    return {
        format: 'xlsx',
        adapterId: 'xlsx',
        sourcePath,
        structure: workbookSummary,
        view,
        index: {
            cacheHit: index.cacheHit,
            summary: index.summary,
            signature: index.signature
        },
        observation: buildCompactXlsxObservation({
            index: { ...index, structure: workbookSummary },
            matches: viewMatches,
            action: 'inspect',
            query: input.target || input.kind || '',
            diagnostics: validation.diagnostics
        }),
        validation,
        text: workbookSummary.sheets.flatMap((sheet) => sheet.cells.map((cell) => cell.text).filter(Boolean)).join('\n'),
        diagnostics: validation.diagnostics
    };
}

function parseDelimitedLine(line, delimiter = ',') {
    const cells = [];
    let current = '';
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        if (char === '"') {
            if (quoted && line[index + 1] === '"') {
                current += '"';
                index += 1;
            } else {
                quoted = !quoted;
            }
        } else if (char === delimiter && !quoted) {
            cells.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    cells.push(current);
    return cells;
}

function parseCsvText(text, delimiter = ',') {
    return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
        .split('\n')
        .filter((line, index, lines) => line.length || index < lines.length - 1)
        .map((line) => parseDelimitedLine(line, delimiter));
}

function inferPrimitiveType(values) {
    const present = values.map((value) => String(value ?? '').trim()).filter(Boolean);
    if (!present.length) {
        return 'empty';
    }
    const tests = {
        boolean: (value) => /^(true|false)$/i.test(value),
        number: (value) => Number.isFinite(Number(value)),
        date: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))
    };
    for (const [type, test] of Object.entries(tests)) {
        if (present.every(test)) {
            return type;
        }
    }
    return 'string';
}

async function inspectCsvArtifact(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const text = await fsp.readFile(sourcePath, 'utf8');
    const delimiter = input.format === 'tsv' ? '\t' : ',';
    const rows = parseCsvText(text, delimiter);
    const headers = rows[0] || [];
    const dataRows = rows.slice(1);
    const malformedRows = dataRows
        .map((row, index) => ({ lineNumber: index + 2, cellCount: row.length }))
        .filter((row) => row.cellCount !== headers.length);
    const columns = headers.map((header, colIndex) => ({
        name: header,
        type: inferPrimitiveType(dataRows.map((row) => row[colIndex])),
        missing: dataRows.filter((row) => !String(row[colIndex] ?? '').trim()).length
    }));
    return {
        format: input.format === 'tsv' ? 'tsv' : 'csv',
        adapterId: 'csv',
        sourcePath,
        structure: {
            delimiter,
            headers,
            rowCount: rows.length,
            dataRowCount: dataRows.length,
            rows,
            columns,
            malformedRows
        },
        text,
        diagnostics: malformedRows.map((row) => createDiagnostic(
            'csv_malformed_row',
            'warning',
            `CSV row ${row.lineNumber} has ${row.cellCount} cells; expected ${headers.length}.`,
            row
        ))
    };
}

function decodePdfString(value = '') {
    return String(value)
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\');
}

function extractPdfText(raw) {
    const spans = [];
    const regex = /\(((?:\\.|[^\\()])*)\)\s*Tj/g;
    let match = regex.exec(raw);
    while (match) {
        spans.push(decodePdfString(match[1]));
        match = regex.exec(raw);
    }
    return spans.join('\n');
}

async function inspectPdfArtifact(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const raw = await fsp.readFile(sourcePath, 'latin1');
    const text = extractPdfText(raw);
    const pageCount = (raw.match(/\/Type\s*\/Page\b/g) || []).length;
    return {
        format: 'pdf',
        adapterId: 'pdf',
        sourcePath,
        structure: {
            pageCount,
            textSpanCount: text ? text.split('\n').filter(Boolean).length : 0,
            hasTextLayer: Boolean(text.trim())
        },
        text,
        diagnostics: text.trim() ? [] : [createDiagnostic(
            'pdf_text_layer_missing',
            'warning',
            'PDF text-layer extraction returned no text; OCR/render fallback may be needed.'
        )]
    };
}

async function readZipEntries(sourcePath, patterns) {
    const python = process.env.AILIS_ARTIFACT_PYTHON || process.env.PYTHON || 'python';
    const script = [
        'import json, re, sys, zipfile',
        'path = sys.argv[1]',
        'patterns = [re.compile(p) for p in json.loads(sys.argv[2])]',
        'with zipfile.ZipFile(path) as z:',
        '    names = z.namelist()',
        '    entries = {}',
        '    for name in names:',
        '        if any(pattern.search(name) for pattern in patterns):',
        '            entries[name] = z.read(name).decode("utf-8", "replace")',
        'print(json.dumps({"names": names, "entries": entries}, ensure_ascii=False))'
    ].join('\n');
    const { stdout } = await execFileAsync(python, ['-c', script, sourcePath, JSON.stringify(patterns)], {
        maxBuffer: 8 * 1024 * 1024
    });
    return JSON.parse(stdout);
}

function extractXmlText(xml = '') {
    const texts = [];
    const regex = /<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g;
    let match = regex.exec(xml);
    while (match) {
        texts.push(decodeXmlText(match[1]));
        match = regex.exec(xml);
    }
    return texts;
}

async function inspectDocxArtifact(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const archive = await readZipEntries(sourcePath, ['^word/document\\.xml$']);
    const documentXml = archive.entries['word/document.xml'] || '';
    const textRuns = extractXmlText(documentXml);
    const tableCount = (documentXml.match(/<w:tbl\b/g) || []).length;
    const paragraphCount = (documentXml.match(/<w:p\b/g) || []).length;
    return {
        format: 'docx',
        adapterId: 'docx',
        sourcePath,
        structure: {
            partCount: archive.names.length,
            paragraphCount,
            tableCount,
            textRunCount: textRuns.length
        },
        text: textRuns.join('\n'),
        diagnostics: documentXml ? [] : [createDiagnostic(
            'docx_document_part_missing',
            'error',
            'DOCX archive does not contain word/document.xml.'
        )]
    };
}

async function inspectPptxArtifact(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const archive = await readZipEntries(sourcePath, ['^ppt/slides/slide\\d+\\.xml$']);
    const slides = Object.entries(archive.entries)
        .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
        .map(([name, xml], index) => ({
            index: index + 1,
            name,
            texts: extractXmlText(xml)
        }));
    return {
        format: 'pptx',
        adapterId: 'pptx',
        sourcePath,
        structure: {
            partCount: archive.names.length,
            slideCount: slides.length,
            slides
        },
        text: slides.flatMap((slide) => slide.texts).join('\n'),
        diagnostics: slides.length ? [] : [createDiagnostic(
            'pptx_slides_missing',
            'error',
            'PPTX archive does not contain ppt/slides/slide*.xml parts.'
        )]
    };
}

async function inspectArtifact(input = {}) {
    const format = normalizeFormat(input.format, input.sourcePath || input.path);
    if (format === 'xlsx' || format === 'xlsm') {
        return inspectXlsxArtifact(input);
    }
    if (format === 'csv' || format === 'tsv') {
        return inspectCsvArtifact({ ...input, format });
    }
    if (FILE_ADAPTER_FORMATS.has(format)) {
        return inspectFileArtifact({ ...input, format });
    }
    throw new Error(`No implemented artifact adapter for format: ${format}`);
}

function compareStringArrays(actual = [], expected = []) {
    return actual.length === expected.length && actual.every((entry, index) => entry === expected[index]);
}

function findXlsxSheet(structure = {}, sheetName = '') {
    return (structure.sheets || []).find((sheet) => sheet.name === sheetName)
        || (structure.sheets || [])[0]
        || null;
}

function findXlsxCell(structure = {}, locator = '') {
    const parsed = parseWorkbookTarget(locator, '');
    const sheet = findXlsxSheet(structure, parsed.sheetName);
    if (!sheet || !parsed.rangeRef) {
        return null;
    }
    const ref = parsed.rangeRef.split(':')[0].replace(/\$/g, '').toUpperCase();
    return (sheet.cells || []).find((cell) => cell.ref.toUpperCase() === ref) || null;
}

function validateAgainstExpected(inspection, expected = {}) {
    const checks = [];
    const diagnostics = [];
    const format = inspection.format;

    if (format === 'xlsx' && expected.mapPath) {
        const sheet = inspection.structure.sheets[0] || {};
        const mapPath = sheet.mapPath || {};
        const landedColor = normalizeHex(mapPath.landed?.fillRgb || '');
        const expectedColor = normalizeHex(expected.mapPath.landedColor);
        const landedCellOk = mapPath.landed?.ref === expected.mapPath.landedCell;
        const landedColorOk = landedColor === expectedColor;
        const minLengthOk = (mapPath.path?.length || 0) >= Number(expected.mapPath.minimumPathLength || 0);
        checks.push({ name: 'map_path_landed_cell', passed: landedCellOk, actual: mapPath.landed?.ref || '', expected: expected.mapPath.landedCell });
        checks.push({ name: 'map_path_landed_color', passed: landedColorOk, actual: landedColor, expected: expectedColor });
        checks.push({ name: 'map_path_minimum_length', passed: minLengthOk, actual: mapPath.path?.length || 0, expected: expected.mapPath.minimumPathLength });
        diagnostics.push(...(mapPath.diagnostics || []));
    }

    if (format === 'xlsx' && expected.xlsx) {
        const xlsx = expected.xlsx;
        const structure = inspection.structure || {};
        if (xlsx.sheetNames) {
            checks.push({
                name: 'xlsx_sheet_names',
                passed: compareStringArrays(structure.workbook?.sheetNames || [], xlsx.sheetNames),
                actual: structure.workbook?.sheetNames || [],
                expected: xlsx.sheetNames
            });
        }
        if (Number.isFinite(Number(xlsx.minimumFormulaCount))) {
            const formulaCount = (structure.sheets || []).reduce((sum, sheet) => sum + (sheet.formulas?.length || 0), 0);
            checks.push({
                name: 'xlsx_minimum_formula_count',
                passed: formulaCount >= Number(xlsx.minimumFormulaCount),
                actual: formulaCount,
                expected: Number(xlsx.minimumFormulaCount)
            });
        }
        if (Number.isFinite(Number(xlsx.formulaErrorCount))) {
            const formulaErrorCount = (structure.sheets || []).reduce((sum, sheet) => sum + (sheet.formulaErrors?.length || 0), 0);
            checks.push({
                name: 'xlsx_formula_error_count',
                passed: formulaErrorCount === Number(xlsx.formulaErrorCount),
                actual: formulaErrorCount,
                expected: Number(xlsx.formulaErrorCount)
            });
        }
        for (const tableName of xlsx.requiredTables || []) {
            const hasTable = (structure.sheets || []).some((sheet) => (sheet.tables || []).some((table) => table.name === tableName));
            checks.push({
                name: `xlsx_table_${tableName}`,
                passed: hasTable,
                actual: hasTable,
                expected: true
            });
        }
        for (const mergeRef of xlsx.requiredMerges || []) {
            const parsed = parseWorkbookTarget(mergeRef, '');
            const sheet = findXlsxSheet(structure, parsed.sheetName);
            const hasMerge = Boolean(sheet && (sheet.merges || []).includes(parsed.rangeRef));
            checks.push({
                name: `xlsx_merge_${mergeRef}`,
                passed: hasMerge,
                actual: hasMerge,
                expected: true
            });
        }
        for (const expectedCell of xlsx.cells || []) {
            const cell = findXlsxCell(structure, expectedCell.ref || expectedCell.locator);
            checks.push({
                name: `xlsx_cell_exists_${expectedCell.ref || expectedCell.locator}`,
                passed: Boolean(cell),
                actual: Boolean(cell),
                expected: true
            });
            if (!cell) {
                continue;
            }
            if (Object.prototype.hasOwnProperty.call(expectedCell, 'value')) {
                checks.push({
                    name: `xlsx_cell_value_${expectedCell.ref}`,
                    passed: cell.value === expectedCell.value || cell.text === String(expectedCell.value),
                    actual: cell.value ?? cell.text,
                    expected: expectedCell.value
                });
            }
            if (expectedCell.formula) {
                checks.push({
                    name: `xlsx_cell_formula_${expectedCell.ref}`,
                    passed: String(cell.formula || '').replace(/^=/, '') === String(expectedCell.formula).replace(/^=/, ''),
                    actual: cell.formula || '',
                    expected: expectedCell.formula
                });
            }
            if (expectedCell.fillRgb) {
                const actualFill = normalizeHex(cell.fillRgb || cell.style?.fillRgb || '');
                checks.push({
                    name: `xlsx_cell_fill_${expectedCell.ref}`,
                    passed: actualFill === normalizeHex(expectedCell.fillRgb),
                    actual: actualFill,
                    expected: normalizeHex(expectedCell.fillRgb)
                });
            }
        }
    }

    if (format === 'csv' && expected.headers) {
        const headers = inspection.structure.headers || [];
        const malformed = (inspection.structure.malformedRows || []).map((row) => row.lineNumber);
        checks.push({ name: 'csv_headers', passed: compareStringArrays(headers, expected.headers), actual: headers, expected: expected.headers });
        checks.push({
            name: 'csv_malformed_rows',
            passed: compareStringArrays(malformed, expected.malformedRowNumbers || []),
            actual: malformed,
            expected: expected.malformedRowNumbers || []
        });
    }

    if (format === 'pdf') {
        if (expected.pageCount) {
            checks.push({
                name: 'pdf_page_count',
                passed: inspection.structure.pageCount === expected.pageCount,
                actual: inspection.structure.pageCount,
                expected: expected.pageCount
            });
        }
        if (expected.mustContainText) {
            checks.push({
                name: 'pdf_text_contains',
                passed: inspection.text.includes(expected.mustContainText),
                actual: inspection.text,
                expected: expected.mustContainText
            });
        }
        if (expected.mustHaveTextLayer === true) {
            checks.push({
                name: 'pdf_has_text_layer',
                passed: inspection.structure.hasTextLayer === true,
                actual: inspection.structure.hasTextLayer,
                expected: true
            });
        }
        if (Number.isFinite(Number(expected.minimumTextSpanCount))) {
            checks.push({
                name: 'pdf_minimum_text_span_count',
                passed: Number(inspection.structure.textSpanCount || 0) >= Number(expected.minimumTextSpanCount),
                actual: inspection.structure.textSpanCount || 0,
                expected: Number(expected.minimumTextSpanCount)
            });
        }
    }

    if (format === 'docx') {
        if (expected.minimumTableCount) {
            checks.push({
                name: 'docx_table_count',
                passed: inspection.structure.tableCount >= expected.minimumTableCount,
                actual: inspection.structure.tableCount,
                expected: expected.minimumTableCount
            });
        }
        if (expected.mustContainText) {
            checks.push({
                name: 'docx_text_contains',
                passed: inspection.text.includes(expected.mustContainText),
                actual: inspection.text,
                expected: expected.mustContainText
            });
        }
        if (Number.isFinite(Number(expected.minimumParagraphCount))) {
            checks.push({
                name: 'docx_minimum_paragraph_count',
                passed: Number(inspection.structure.paragraphCount || 0) >= Number(expected.minimumParagraphCount),
                actual: inspection.structure.paragraphCount || 0,
                expected: Number(expected.minimumParagraphCount)
            });
        }
        if (Number.isFinite(Number(expected.minimumCommentCount))) {
            checks.push({
                name: 'docx_minimum_comment_count',
                passed: Number(inspection.structure.commentCount || 0) >= Number(expected.minimumCommentCount),
                actual: inspection.structure.commentCount || 0,
                expected: Number(expected.minimumCommentCount)
            });
        }
        if (Number.isFinite(Number(expected.minimumImageCount))) {
            checks.push({
                name: 'docx_minimum_image_count',
                passed: Number(inspection.structure.imageCount || 0) >= Number(expected.minimumImageCount),
                actual: inspection.structure.imageCount || 0,
                expected: Number(expected.minimumImageCount)
            });
        }
    }

    if (format === 'pptx') {
        if (expected.slideCount) {
            checks.push({
                name: 'pptx_slide_count',
                passed: inspection.structure.slideCount === expected.slideCount,
                actual: inspection.structure.slideCount,
                expected: expected.slideCount
            });
        }
        if (expected.mustContainText) {
            checks.push({
                name: 'pptx_text_contains',
                passed: inspection.text.includes(expected.mustContainText),
                actual: inspection.text,
                expected: expected.mustContainText
            });
        }
        if (Number.isFinite(Number(expected.minimumImageCount))) {
            checks.push({
                name: 'pptx_minimum_image_count',
                passed: Number(inspection.structure.imageCount || inspection.structure.mediaCount || 0) >= Number(expected.minimumImageCount),
                actual: inspection.structure.imageCount || inspection.structure.mediaCount || 0,
                expected: Number(expected.minimumImageCount)
            });
        }
        if (Number.isFinite(Number(expected.minimumTableCount))) {
            checks.push({
                name: 'pptx_minimum_table_count',
                passed: Number(inspection.structure.tableCount || 0) >= Number(expected.minimumTableCount),
                actual: inspection.structure.tableCount || 0,
                expected: Number(expected.minimumTableCount)
            });
        }
    }

    if (inspection.adapterId === 'image' || ['png', 'jpg', 'jpeg', 'webp', 'tif', 'tiff', 'bmp', 'gif'].includes(format)) {
        if (expected.width) {
            checks.push({
                name: 'image_width',
                passed: inspection.structure.width === expected.width,
                actual: inspection.structure.width,
                expected: expected.width
            });
        }
        if (expected.height) {
            checks.push({
                name: 'image_height',
                passed: inspection.structure.height === expected.height,
                actual: inspection.structure.height,
                expected: expected.height
            });
        }
        if (expected.nonblank === true) {
            checks.push({
                name: 'image_nonblank',
                passed: inspection.structure.visualCheck?.blank === false,
                actual: inspection.structure.visualCheck,
                expected: { blank: false }
            });
        }
        if (expected.mustContainColor) {
            const expectedColor = normalizeHex(expected.mustContainColor);
            const hasColor = (inspection.structure.dominantColors || []).some((color) => normalizeHex(color.rgb) === expectedColor);
            checks.push({
                name: `image_contains_color_${expectedColor}`,
                passed: hasColor,
                actual: (inspection.structure.dominantColors || []).map((color) => normalizeHex(color.rgb)),
                expected: expectedColor
            });
        }
    }

    const allowedDiagnosticCodes = new Set(expected.allowedDiagnosticCodes || expected.allowed_diagnostic_codes || []);
    const fatalDiagnostics = [...(inspection.diagnostics || []), ...diagnostics]
        .filter((diagnostic) => !allowedDiagnosticCodes.has(diagnostic.code))
        .filter((diagnostic) => diagnostic.severity === 'fatal' || diagnostic.severity === 'error');
    checks.push({
        name: 'no_fatal_diagnostics',
        passed: fatalDiagnostics.length === 0,
        actual: fatalDiagnostics.map((diagnostic) => diagnostic.code),
        expected: []
    });

    return {
        passed: checks.every((check) => check.passed),
        checks,
        diagnostics: [...(inspection.diagnostics || []), ...diagnostics]
    };
}

function workbookToSvg(inspection) {
    const sheet = inspection.structure.sheets[0] || { cells: [] };
    const filledCells = sheet.cells.filter((cell) => cell.fillRgb);
    const maxRow = Math.max(1, ...filledCells.map((cell) => cell.row));
    const maxCol = Math.max(1, ...filledCells.map((cell) => cell.col));
    const cellWidth = 54;
    const cellHeight = 30;
    const width = maxCol * cellWidth + 24;
    const height = maxRow * cellHeight + 48;
    const byRef = new Map(sheet.cells.map((cell) => [cell.ref, cell]));
    const rects = [];
    for (let row = 1; row <= maxRow; row += 1) {
        for (let col = 1; col <= maxCol; col += 1) {
            const cell = byRef.get(cellRef(row, col)) || {};
            const x = 12 + (col - 1) * cellWidth;
            const y = 36 + (row - 1) * cellHeight;
            const fill = cell.fillRgb ? `#${cell.fillRgb}` : '#FFFFFF';
            rects.push(`<rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" fill="${fill}" stroke="#475569" stroke-width="1"/>`);
            if (cell.text) {
                rects.push(`<text x="${x + cellWidth / 2}" y="${y + 19}" text-anchor="middle" font-family="Arial" font-size="10" fill="#111827">${escapeXml(cell.text)}</text>`);
            }
        }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="100%" height="100%" fill="#F8FAFC"/>
<text x="12" y="22" font-family="Arial" font-size="13" font-weight="700" fill="#0F172A">${escapeXml(sheet.name || 'Workbook')}</text>
${rects.join('\n')}
</svg>`;
}

function tableToSvg(title, rows) {
    const maxCols = Math.max(1, ...rows.map((row) => row.length));
    const shownRows = rows.slice(0, 10);
    const cellWidth = 118;
    const cellHeight = 28;
    const width = Math.max(360, maxCols * cellWidth + 24);
    const height = shownRows.length * cellHeight + 52;
    const parts = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
        '<rect width="100%" height="100%" fill="#F8FAFC"/>',
        `<text x="12" y="22" font-family="Arial" font-size="13" font-weight="700" fill="#0F172A">${escapeXml(title)}</text>`
    ];
    shownRows.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            const x = 12 + colIndex * cellWidth;
            const y = 36 + rowIndex * cellHeight;
            parts.push(`<rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" fill="${rowIndex === 0 ? '#E2E8F0' : '#FFFFFF'}" stroke="#CBD5E1"/>`);
            parts.push(`<text x="${x + 6}" y="${y + 18}" font-family="Arial" font-size="10" fill="#111827">${escapeXml(String(value).slice(0, 22))}</text>`);
        });
    });
    parts.push('</svg>');
    return parts.join('\n');
}

function textToSvg(title, lines) {
    const shownLines = lines.filter(Boolean).slice(0, 14);
    const width = 760;
    const height = Math.max(120, shownLines.length * 24 + 56);
    const parts = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
        '<rect width="100%" height="100%" fill="#F8FAFC"/>',
        `<text x="18" y="26" font-family="Arial" font-size="14" font-weight="700" fill="#0F172A">${escapeXml(title)}</text>`
    ];
    shownLines.forEach((line, index) => {
        parts.push(`<text x="18" y="${58 + index * 24}" font-family="Arial" font-size="12" fill="#111827">${escapeXml(line).slice(0, 140)}</text>`);
    });
    parts.push('</svg>');
    return parts.join('\n');
}

function presentationToSvg(inspection) {
    const slides = inspection.structure.slides || [];
    const width = 760;
    const slideWidth = 330;
    const slideHeight = 185;
    const gap = 24;
    const height = Math.max(260, Math.ceil(slides.length / 2) * (slideHeight + gap) + 56);
    const parts = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
        '<rect width="100%" height="100%" fill="#F8FAFC"/>',
        '<text x="18" y="26" font-family="Arial" font-size="14" font-weight="700" fill="#0F172A">PPTX Contact Sheet</text>'
    ];
    slides.forEach((slide, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = 18 + col * (slideWidth + gap);
        const y = 48 + row * (slideHeight + gap);
        parts.push(`<rect x="${x}" y="${y}" width="${slideWidth}" height="${slideHeight}" rx="6" fill="#FFFFFF" stroke="#CBD5E1"/>`);
        parts.push(`<text x="${x + 12}" y="${y + 24}" font-family="Arial" font-size="12" font-weight="700" fill="#0F172A">Slide ${slide.index}</text>`);
        slide.texts.slice(0, 5).forEach((text, textIndex) => {
            parts.push(`<text x="${x + 12}" y="${y + 54 + textIndex * 22}" font-family="Arial" font-size="12" fill="#111827">${escapeXml(text).slice(0, 42)}</text>`);
        });
    });
    parts.push('</svg>');
    return parts.join('\n');
}

async function renderXlsxRangeToPng(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const caseId = input.caseId || path.basename(sourcePath, path.extname(sourcePath));
    const outputDir = toAbsolutePath(input.outputDir || path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot);
    const renderDir = path.join(outputDir, 'renders');
    await fsp.mkdir(renderDir, { recursive: true });
    const parsedTarget = parseWorkbookTarget(input.target || input.range || '', input.sheetName || input.sheet || '');
    const signature = await getFileSignature(sourcePath);
    const scale = clampNumber(input.scale || 2, 2, 1, 4);
    const cacheKey = buildCacheKey([
        XLSX_RENDER_CACHE_VERSION,
        sourcePath,
        signature.size,
        signature.mtimeMs,
        parsedTarget.sheetName || '',
        parsedTarget.rangeRef || '',
        scale
    ]);
    const outputPath = input.outputPath
        ? toAbsolutePath(input.outputPath, input.repoRoot)
        : path.join(renderDir, `${caseId}-${cacheKey.slice(0, 12)}.png`);
    const metadataPath = `${outputPath}.json`;
    if (input.refreshRender !== true && input.refresh_render !== true && fs.existsSync(outputPath) && fs.existsSync(metadataPath)) {
        try {
            const [stat, metadataRaw] = await Promise.all([
                fsp.stat(outputPath),
                fsp.readFile(metadataPath, 'utf8')
            ]);
            const metadata = JSON.parse(metadataRaw);
            return {
                passed: stat.size > 128 && metadata.blank !== true,
                outputPath,
                renderKind: 'xlsx_range_png_pillow',
                cacheHit: true,
                cacheKey,
                bytes: stat.size,
                width: metadata.width,
                height: metadata.height,
                target: `${metadata.sheetName}!${metadata.range}`,
                visualCheck: {
                    blank: metadata.blank === true,
                    uniqueSampledColors: metadata.uniqueSampledColors,
                    nonBlankRatio: metadata.nonBlankRatio
                },
                diagnostics: metadata.blank === true
                    ? [createDiagnostic('xlsx_png_render_blank', 'error', 'Cached XLSX PNG render appears blank.', { outputPath })]
                    : []
            };
        } catch {
            // Stale or corrupt metadata falls through to a fresh render.
        }
    }
    const python = process.env.AILIS_ARTIFACT_PYTHON || process.env.PYTHON || 'python';
    const script = String.raw`
import json
import math
import sys
from pathlib import Path

from openpyxl import load_workbook
from openpyxl.utils import get_column_letter, column_index_from_string
from openpyxl.utils.cell import range_boundaries
from PIL import Image, ImageDraw, ImageFont

source_path, output_path, sheet_name, range_ref, scale_text = sys.argv[1:6]
scale = max(1, min(4, int(float(scale_text or "2"))))

def norm_hex(value, fallback="FFFFFF"):
    if value is None:
        return fallback
    raw = str(value).strip().replace("#", "").upper()
    if not raw or raw in {"00000000", "000000"}:
        return fallback
    if len(raw) == 8:
        raw = raw[-6:]
    if len(raw) != 6:
        return fallback
    return raw

def rgb(value, fallback="FFFFFF"):
    raw = norm_hex(value, fallback)
    return tuple(int(raw[i:i+2], 16) for i in (0, 2, 4))

def col_px(width):
    if width is None:
        width = 8.43
    return max(34, int(float(width) * 7 + 8))

def row_px(height):
    if height is None:
        height = 15
    return max(22, int(float(height) * 1.35 + 8))

def display_value(cell, data_cell):
    value = data_cell.value
    if value is None:
        value = cell.value
    if value is None:
        return ""
    if isinstance(value, float):
        if value.is_integer():
            return str(int(value))
        return f"{value:.4g}"
    return str(value)

wb = load_workbook(source_path, data_only=False)
wb_data = load_workbook(source_path, data_only=True)
if not sheet_name:
    sheet_name = wb.sheetnames[0]
if sheet_name not in wb.sheetnames:
    raise ValueError(f"worksheet not found: {sheet_name}")
ws = wb[sheet_name]
ws_data = wb_data[sheet_name]

if not range_ref:
    if ws.max_row and ws.max_column:
        range_ref = f"A1:{get_column_letter(ws.max_column)}{ws.max_row}"
    else:
        range_ref = "A1:A1"

min_col, min_row, max_col, max_row = range_boundaries(range_ref.replace("$", ""))
min_col = max(1, min_col)
min_row = max(1, min_row)
max_col = max(min_col, max_col)
max_row = max(min_row, max_row)

col_widths = []
for col in range(min_col, max_col + 1):
    letter = get_column_letter(col)
    col_widths.append(col_px(ws.column_dimensions[letter].width))
row_heights = []
for row in range(min_row, max_row + 1):
    row_heights.append(row_px(ws.row_dimensions[row].height))

left_pad = 48
top_pad = 28
width = (left_pad + sum(col_widths) + 8) * scale
height = (top_pad + sum(row_heights) + 8) * scale
image = Image.new("RGB", (width, height), (248, 250, 252))
draw = ImageDraw.Draw(image)
try:
    font = ImageFont.truetype("arial.ttf", 11 * scale)
    bold_font = ImageFont.truetype("arialbd.ttf", 11 * scale)
    header_font = ImageFont.truetype("arialbd.ttf", 10 * scale)
except Exception:
    font = ImageFont.load_default()
    bold_font = font
    header_font = font

draw.rectangle([0, 0, width - 1, height - 1], fill=(248, 250, 252))
draw.text((8 * scale, 7 * scale), f"{sheet_name}!{range_ref}", fill=(15, 23, 42), font=header_font)

x_positions = []
x = left_pad
for w in col_widths:
    x_positions.append(x)
    x += w
y_positions = []
y = top_pad
for h in row_heights:
    y_positions.append(y)
    y += h

for index, col in enumerate(range(min_col, max_col + 1)):
    x0 = x_positions[index] * scale
    x1 = (x_positions[index] + col_widths[index]) * scale
    draw.rectangle([x0, top_pad * scale - 20 * scale, x1, top_pad * scale], fill=(226, 232, 240), outline=(148, 163, 184))
    draw.text((x0 + 5 * scale, top_pad * scale - 16 * scale), get_column_letter(col), fill=(51, 65, 85), font=header_font)

for index, row in enumerate(range(min_row, max_row + 1)):
    y0 = y_positions[index] * scale
    y1 = (y_positions[index] + row_heights[index]) * scale
    draw.rectangle([0, y0, left_pad * scale, y1], fill=(226, 232, 240), outline=(148, 163, 184))
    draw.text((8 * scale, y0 + 6 * scale), str(row), fill=(51, 65, 85), font=header_font)

merged_slave_cells = set()
merged_masters = {}
for merged in ws.merged_cells.ranges:
    if merged.max_col < min_col or merged.min_col > max_col or merged.max_row < min_row or merged.min_row > max_row:
        continue
    master = (merged.min_row, merged.min_col)
    merged_masters[master] = merged
    for row in range(merged.min_row, merged.max_row + 1):
        for col in range(merged.min_col, merged.max_col + 1):
            if (row, col) != master:
                merged_slave_cells.add((row, col))

for row in range(min_row, max_row + 1):
    for col in range(min_col, max_col + 1):
        if (row, col) in merged_slave_cells:
            continue
        col_idx = col - min_col
        row_idx = row - min_row
        x0 = x_positions[col_idx]
        y0 = y_positions[row_idx]
        cell_width = col_widths[col_idx]
        cell_height = row_heights[row_idx]
        if (row, col) in merged_masters:
            merged = merged_masters[(row, col)]
            cell_width = sum(col_widths[max(merged.min_col, min_col) - min_col: min(merged.max_col, max_col) - min_col + 1])
            cell_height = sum(row_heights[max(merged.min_row, min_row) - min_row: min(merged.max_row, max_row) - min_row + 1])
        cell = ws.cell(row=row, column=col)
        data_cell = ws_data.cell(row=row, column=col)
        fill = cell.fill
        fill_color = "FFFFFF"
        if fill and fill.fill_type == "solid":
            fill_color = norm_hex(fill.fgColor.rgb or fill.fgColor.indexed)
        rect = [x0 * scale, y0 * scale, (x0 + cell_width) * scale, (y0 + cell_height) * scale]
        draw.rectangle(rect, fill=rgb(fill_color), outline=(203, 213, 225))
        value = display_value(cell, data_cell)
        if value:
            text_color = rgb(getattr(cell.font.color, "rgb", None), "111827") if cell.font and cell.font.color else (17, 24, 39)
            use_font = bold_font if cell.font and cell.font.bold else font
            max_chars = max(4, int(cell_width / 7))
            if len(value) > max_chars:
                value = value[:max_chars - 1] + "…"
            draw.text((x0 * scale + 5 * scale, y0 * scale + 7 * scale), value, fill=text_color, font=use_font)

Path(output_path).parent.mkdir(parents=True, exist_ok=True)
image.save(output_path, "PNG")
pixels = list(image.getdata())
step = max(1, len(pixels) // 20000)
sample = pixels[::step]
background = (248, 250, 252)
non_blank = sum(1 for pixel in sample if pixel != background)
unique_colors = len(set(sample))
non_blank_ratio = non_blank / max(1, len(sample))
print(json.dumps({
    "outputPath": output_path,
    "width": width,
    "height": height,
    "sheetName": sheet_name,
    "range": range_ref,
    "scale": scale,
    "uniqueSampledColors": unique_colors,
    "nonBlankRatio": non_blank_ratio,
    "blank": unique_colors <= 1 or non_blank_ratio < 0.001
}, ensure_ascii=False))
`;
    try {
        const { stdout } = await execFileAsync(python, [
            '-c',
            script,
            sourcePath,
            outputPath,
            parsedTarget.sheetName || '',
            parsedTarget.rangeRef || '',
            String(scale)
        ], {
            cwd: input.repoRoot || process.cwd(),
            maxBuffer: 4 * 1024 * 1024,
            timeout: clampNumber(input.timeoutMs || input.timeout_ms, 60000, 5000, 180000)
        });
        const metadata = JSON.parse(stdout);
        const stat = await fsp.stat(outputPath);
        await fsp.writeFile(metadataPath, JSON.stringify({ ...metadata, cacheKey, signature }, null, 2), 'utf8');
        return {
            passed: stat.size > 128 && metadata.blank !== true,
            outputPath,
            renderKind: 'xlsx_range_png_pillow',
            cacheHit: false,
            cacheKey,
            bytes: stat.size,
            width: metadata.width,
            height: metadata.height,
            target: `${metadata.sheetName}!${metadata.range}`,
            visualCheck: {
                blank: metadata.blank === true,
                uniqueSampledColors: metadata.uniqueSampledColors,
                nonBlankRatio: metadata.nonBlankRatio
            },
            diagnostics: metadata.blank === true
                ? [createDiagnostic('xlsx_png_render_blank', 'error', 'XLSX PNG render appears blank.', { outputPath })]
                : []
        };
    } catch (error) {
        return {
            passed: false,
            outputPath,
            renderKind: 'xlsx_range_png_pillow',
            bytes: 0,
            diagnostics: [createDiagnostic(
                'xlsx_png_render_failed',
                'error',
                `XLSX PNG render failed: ${error.message || String(error)}`,
                { sourcePath, target: input.target || input.range || '' }
            )]
        };
    }
}

async function renderArtifactPreview(input = {}) {
    const inspection = input.inspection || await inspectArtifact(input);
    const caseId = input.caseId || path.basename(inspection.sourcePath, path.extname(inspection.sourcePath));
    const outputDir = toAbsolutePath(input.outputDir || path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot);
    const renderDir = path.join(outputDir, 'renders');
    await fsp.mkdir(renderDir, { recursive: true });
    let svg = '';
    if (inspection.format === 'xlsx') {
        return renderXlsxRangeToPng({
            ...input,
            sourcePath: inspection.sourcePath,
            caseId,
            outputDir
        });
    } else if (inspection.format === 'csv' || inspection.format === 'tsv') {
        svg = tableToSvg('CSV Structure Preview', inspection.structure.rows || []);
    } else if (FILE_ADAPTER_FORMATS.has(inspection.format) || inspection.adapterId === 'image') {
        return renderFileArtifactPreview({
            ...input,
            sourcePath: inspection.sourcePath,
            caseId,
            outputDir,
            inspection
        });
    } else {
        svg = textToSvg(`${inspection.format.toUpperCase()} Text Preview`, inspection.text.split(/\r?\n/));
    }
    const outputPath = path.join(renderDir, `${caseId}.svg`);
    await fsp.writeFile(outputPath, svg, 'utf8');
    const stat = await fsp.stat(outputPath);
    return {
        passed: stat.size > 128 && svg.includes('<svg') && (svg.includes('<text') || svg.includes('<rect')),
        outputPath,
        renderKind: 'svg_structural_preview',
        bytes: stat.size
    };
}

function extractFormulaReferences(formula = '', defaultSheetName = '', definedNameMap = new Map()) {
    const refs = [];
    const seen = new Set();
    const normalized = String(formula || '').replace(/^=/, '');
    const refRegex = /(?:(?:'((?:[^']|'')+)'|([A-Za-z_][A-Za-z0-9_ .]*))!)?(\$?[A-Z]{1,3}\$?\d+)(?:\s*:\s*(\$?[A-Z]{1,3}\$?\d+))?/g;
    let match = refRegex.exec(normalized);
    while (match) {
        const sheetName = (match[1] || match[2] || defaultSheetName || '').replace(/''/g, "'");
        const startRef = match[3].replace(/\$/g, '').toUpperCase();
        const endRef = match[4] ? match[4].replace(/\$/g, '').toUpperCase() : '';
        const rangeRef = endRef ? `${startRef}:${endRef}` : startRef;
        const key = `${sheetName}!${rangeRef}`;
        if (!seen.has(key)) {
            seen.add(key);
            refs.push({
                sheetName,
                ref: startRef,
                endRef,
                rangeRef,
                kind: endRef ? 'range' : 'cell',
                fullRef: key
            });
        }
        match = refRegex.exec(normalized);
    }
    const tokenRegex = /\b[A-Za-z_][A-Za-z0-9_.]*\b/g;
    let tokenMatch = tokenRegex.exec(normalized);
    const ignoredTokens = new Set(['TRUE', 'FALSE']);
    while (tokenMatch) {
        const token = tokenMatch[0];
        const tokenEnd = tokenMatch.index + token.length;
        const previous = normalized[tokenMatch.index - 1] || '';
        const next = normalized[tokenEnd] || '';
        const key = normalizeDefinedNameKey(token);
        const definedName = definedNameMap.get(key);
        if (
            definedName
            && next !== '('
            && next !== '!'
            && previous !== '!'
            && !ignoredTokens.has(token.toUpperCase())
            && !seen.has(`definedName:${definedName.name}`)
        ) {
            seen.add(`definedName:${definedName.name}`);
            refs.push({
                kind: 'defined_name',
                name: definedName.name,
                ranges: definedName.ranges,
                fullRef: `definedName:${definedName.name}`
            });
        }
        tokenMatch = tokenRegex.exec(normalized);
    }
    return refs;
}

function getWorkbookSheet(workbook, sheetName = '') {
    const sheet = sheetName ? workbook.getWorksheet(sheetName) : workbook.worksheets[0];
    if (!sheet) {
        throw new Error(`Worksheet not found: ${sheetName}`);
    }
    return sheet;
}

function getCellNumericValue(cell) {
    const value = getCellValue(cell);
    if (typeof value === 'number') {
        return value;
    }
    if (value && typeof value === 'object' && typeof value.result === 'number') {
        return value.result;
    }
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
}

function expandFormulaReference(ref = {}, maxExpandedCells = 80) {
    const bounds = parseRangeRef(ref.rangeRef || ref.ref);
    if (!bounds) {
        return [];
    }
    const cells = [];
    for (let row = bounds.startRow; row <= bounds.endRow; row += 1) {
        for (let col = bounds.startCol; col <= bounds.endCol; col += 1) {
            cells.push({
                sheetName: ref.sheetName,
                ref: cellRef(row, col),
                fullRef: `${ref.sheetName}!${cellRef(row, col)}`
            });
            if (cells.length >= maxExpandedCells) {
                return cells;
            }
        }
    }
    return cells;
}

async function traceXlsxFormula(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(sourcePath);
    const parsedTarget = parseWorkbookTarget(input.target || input.range || '', input.sheetName || input.sheet || workbook.worksheets[0]?.name || '');
    const sheet = getWorkbookSheet(workbook, parsedTarget.sheetName);
    const targetRef = parsedTarget.rangeRef || 'A1';
    const targetCellRef = targetRef.split(':')[0].replace(/\$/g, '').toUpperCase();
    const maxDepth = clampNumber(input.maxDepth || input.max_depth, 4, 1, 12);
    const maxExpandedCells = clampNumber(input.maxExpandedCells || input.max_expanded_cells, 80, 1, 500);
    const definedNameMap = buildDefinedNameMap(workbook);
    const nodes = new Map();
    const edges = [];
    const diagnostics = [];

    function addNode(node) {
        const existing = nodes.get(node.id);
        nodes.set(node.id, { ...(existing || {}), ...node });
    }

    function visitCell(sheetName, ref, depth, stack = []) {
        const id = `${sheetName}!${ref}`;
        if (stack.includes(id)) {
            diagnostics.push(createDiagnostic(
                'xlsx_formula_trace_cycle',
                'warning',
                `Formula trace encountered a cycle at ${id}.`,
                { ref: id, stack }
            ));
            return;
        }
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            diagnostics.push(createDiagnostic(
                'xlsx_formula_trace_missing_sheet',
                'error',
                `Formula reference points to a missing worksheet: ${sheetName}.`,
                { sheetName, ref }
            ));
            addNode({ id, kind: 'missing_sheet', sheetName, ref });
            return;
        }
        const cell = worksheet.getCell(ref);
        const formula = cell.formula || '';
        const error = getCellErrorCode(cell);
        addNode({
            id,
            kind: formula ? 'formula_cell' : 'cell',
            sheetName,
            ref,
            value: clonePlain(getCellValue(cell)),
            text: getPrimitiveText(getCellValue(cell)),
            formula,
            result: getFormulaResult(cell),
            error,
            depth
        });
        if (!formula || depth >= maxDepth) {
            return;
        }
        const refs = extractFormulaReferences(formula, sheetName, definedNameMap);
        for (const dependency of refs) {
            if (dependency.kind === 'range') {
                addNode({
                    id: dependency.fullRef,
                    kind: 'range',
                    sheetName: dependency.sheetName,
                    ref: dependency.rangeRef,
                    depth: depth + 1
                });
                edges.push({ from: id, to: dependency.fullRef, kind: 'references_range' });
                const expanded = expandFormulaReference(dependency, maxExpandedCells);
                for (const cellDependency of expanded) {
                    edges.push({ from: dependency.fullRef, to: cellDependency.fullRef, kind: 'contains' });
                    visitCell(cellDependency.sheetName, cellDependency.ref, depth + 2, [...stack, id, dependency.fullRef]);
                }
                if (expanded.length >= maxExpandedCells) {
                    diagnostics.push(createDiagnostic(
                        'xlsx_formula_trace_truncated',
                        'warning',
                        `Formula range ${dependency.fullRef} was truncated during trace expansion.`,
                        { maxExpandedCells }
                    ));
                }
            } else if (dependency.kind === 'defined_name') {
                addNode({
                    id: dependency.fullRef,
                    kind: 'defined_name',
                    name: dependency.name,
                    ranges: dependency.ranges,
                    depth: depth + 1
                });
                edges.push({ from: id, to: dependency.fullRef, kind: 'references_defined_name' });
                for (const range of dependency.ranges || []) {
                    const parsedRange = parseWorkbookTarget(range, sheetName);
                    const normalizedRange = String(parsedRange.rangeRef || '').replace(/\$/g, '').toUpperCase();
                    const rangeId = `${parsedRange.sheetName}!${normalizedRange}`;
                    if (!normalizedRange || !parsedRange.sheetName) {
                        diagnostics.push(createDiagnostic(
                            'xlsx_formula_trace_unresolved_defined_name',
                            'warning',
                            `Defined name ${dependency.name} has an unsupported target: ${range}.`,
                            { name: dependency.name, range }
                        ));
                        continue;
                    }
                    const rangeKind = normalizedRange.includes(':') ? 'range' : 'cell';
                    if (rangeKind === 'range') {
                        addNode({
                            id: rangeId,
                            kind: 'range',
                            sheetName: parsedRange.sheetName,
                            ref: normalizedRange,
                            depth: depth + 2
                        });
                        edges.push({ from: dependency.fullRef, to: rangeId, kind: 'defined_name_points_to_range' });
                        const expanded = expandFormulaReference({
                            sheetName: parsedRange.sheetName,
                            rangeRef: normalizedRange
                        }, maxExpandedCells);
                        for (const cellDependency of expanded) {
                            edges.push({ from: rangeId, to: cellDependency.fullRef, kind: 'contains' });
                            visitCell(cellDependency.sheetName, cellDependency.ref, depth + 3, [...stack, id, dependency.fullRef, rangeId]);
                        }
                    } else {
                        edges.push({ from: dependency.fullRef, to: rangeId, kind: 'defined_name_points_to_cell' });
                        visitCell(parsedRange.sheetName, normalizedRange, depth + 2, [...stack, id, dependency.fullRef]);
                    }
                }
            } else {
                edges.push({ from: id, to: dependency.fullRef, kind: 'references_cell' });
                visitCell(dependency.sheetName, dependency.ref, depth + 1, [...stack, id]);
            }
        }
    }

    visitCell(sheet.name, targetCellRef, 0, []);
    return {
        passed: !diagnostics.some((diagnostic) => diagnostic.severity === 'fatal' || diagnostic.severity === 'error'),
        target: `${sheet.name}!${targetCellRef}`,
        nodes: [...nodes.values()].sort((left, right) => String(left.id).localeCompare(String(right.id), undefined, { numeric: true })),
        edges,
        diagnostics
    };
}

function resolveWorksheet(workbook, input = {}) {
    const parsed = parseWorkbookTarget(input.target || input.range || '', input.sheetName || input.sheet || '');
    const sheetName = input.sheetName || input.sheet || parsed.sheetName || workbook.worksheets[0]?.name || '';
    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) {
        throw new Error(`Worksheet not found: ${sheetName}`);
    }
    return {
        sheet,
        sheetName,
        rangeRef: parsed.rangeRef || input.range || ''
    };
}

function splitFormulaArgs(argsText = '') {
    const args = [];
    let depth = 0;
    let current = '';
    for (const char of String(argsText)) {
        if (char === '(') {
            depth += 1;
            current += char;
        } else if (char === ')') {
            depth -= 1;
            current += char;
        } else if (char === ',' && depth === 0) {
            args.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    if (current.trim()) {
        args.push(current.trim());
    }
    return args;
}

function discoverRecalculationEngines() {
    const engines = [];
    const candidates = [
        'soffice',
        'libreoffice',
        'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
        'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe'
    ];
    for (const candidate of candidates) {
        try {
            if (candidate.includes('\\') && fs.existsSync(candidate)) {
                engines.push({ id: 'libreoffice', path: candidate });
            }
        } catch {
            // ignore probe failures
        }
    }
    engines.push({
        id: 'ailis_local_formula_engine',
        path: 'built-in',
        supported: ['SUM', 'cell references', 'range references', 'basic arithmetic']
    });
    if (process.platform === 'win32') {
        engines.push({
            id: 'excel_com_optional',
            path: 'win32com.client',
            note: 'Available only when Microsoft Excel is installed and explicit engine=excel_com is requested.'
        });
    }
    return engines;
}

function createFormulaEvaluator(workbook, diagnostics = []) {
    const cache = new Map();

    function getReferenceValue(sheetName, ref, stack = []) {
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            diagnostics.push(createDiagnostic(
                'xlsx_recalculate_missing_reference',
                'error',
                `Cannot recalculate reference on missing worksheet: ${sheetName}.`,
                { sheetName, ref }
            ));
            return 0;
        }
        const bounds = parseRangeRef(ref);
        if (bounds && (bounds.startRow !== bounds.endRow || bounds.startCol !== bounds.endCol)) {
            let sum = 0;
            for (let row = bounds.startRow; row <= bounds.endRow; row += 1) {
                for (let col = bounds.startCol; col <= bounds.endCol; col += 1) {
                    sum += getReferenceValue(sheetName, cellRef(row, col), stack);
                }
            }
            return sum;
        }
        const cell = worksheet.getCell(ref.split(':')[0]);
        if (cell.formula) {
            return evaluateCell(sheetName, cell.address, stack);
        }
        return getCellNumericValue(cell);
    }

    function evaluateExpression(expression, sheetName, stack = []) {
        let formula = String(expression || '').replace(/^=/, '').trim();
        let guard = 0;
        while (/SUM\s*\(/i.test(formula) && guard < 50) {
            guard += 1;
            formula = formula.replace(/SUM\s*\(([^()]*)\)/gi, (_match, argsText) => {
                const total = splitFormulaArgs(argsText)
                    .reduce((sum, arg) => {
                        const evaluatedArg = evaluateExpression(arg, sheetName, stack);
                        return sum + (evaluatedArg.supported ? evaluatedArg.value : 0);
                    }, 0);
                return String(total);
            });
        }
        const refs = extractFormulaReferences(formula, sheetName).sort((left, right) => right.fullRef.length - left.fullRef.length);
        for (const ref of refs) {
            const value = getReferenceValue(ref.sheetName, ref.rangeRef, stack);
            const escaped = ref.fullRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const withoutDefaultSheet = ref.sheetName === sheetName
                ? ref.rangeRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                : null;
            formula = formula.replace(new RegExp(escaped, 'g'), String(value));
            if (withoutDefaultSheet) {
                formula = formula.replace(new RegExp(withoutDefaultSheet, 'g'), String(value));
            }
        }
        if (!/^[0-9+\-*/().\s]+$/.test(formula)) {
            diagnostics.push(createDiagnostic(
                'xlsx_recalculate_unsupported_formula',
                'warning',
                `Local formula engine does not support expression: ${expression}.`,
                { expression, normalized: formula }
            ));
            return { supported: false, value: null };
        }
        try {
            // Formula has been reduced to numbers and arithmetic operators only.
            const value = Function(`"use strict"; return (${formula});`)();
            if (!Number.isFinite(Number(value))) {
                return { supported: false, value: null };
            }
            return { supported: true, value: Number(value) };
        } catch (error) {
            diagnostics.push(createDiagnostic(
                'xlsx_recalculate_eval_failed',
                'warning',
                `Local formula expression evaluation failed: ${expression}.`,
                { expression, normalized: formula, error: error.message || String(error) }
            ));
            return { supported: false, value: null };
        }
    }

    function evaluateCell(sheetName, ref, stack = []) {
        const id = `${sheetName}!${ref}`;
        if (cache.has(id)) {
            return cache.get(id);
        }
        if (stack.includes(id)) {
            diagnostics.push(createDiagnostic(
                'xlsx_recalculate_cycle',
                'error',
                `Cannot recalculate cyclic formula reference at ${id}.`,
                { stack, ref: id }
            ));
            return 0;
        }
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            diagnostics.push(createDiagnostic(
                'xlsx_recalculate_missing_reference',
                'error',
                `Cannot recalculate missing worksheet: ${sheetName}.`,
                { sheetName, ref }
            ));
            return 0;
        }
        const cell = worksheet.getCell(ref);
        if (!cell.formula) {
            const value = getCellNumericValue(cell);
            cache.set(id, value);
            return value;
        }
        const evaluated = evaluateExpression(cell.formula, sheetName, [...stack, id]);
        const value = evaluated.supported ? evaluated.value : getCellNumericValue(cell);
        cache.set(id, value);
        return value;
    }

    return {
        evaluateCell,
        evaluateExpression,
        diagnostics
    };
}

function collectFormulaTargetCells(workbook, input = {}) {
    const parsedTarget = parseWorkbookTarget(input.target || input.range || '', input.sheetName || input.sheet || workbook.worksheets[0]?.name || '');
    if (parsedTarget.rangeRef) {
        const sheet = getWorkbookSheet(workbook, parsedTarget.sheetName);
        const bounds = parseRangeRef(parsedTarget.rangeRef);
        if (!bounds) {
            throw new Error(`Invalid recalculate target: ${input.target || input.range}`);
        }
        const cells = [];
        for (let row = bounds.startRow; row <= bounds.endRow; row += 1) {
            for (let col = bounds.startCol; col <= bounds.endCol; col += 1) {
                const cell = sheet.getCell(row, col);
                if (cell.formula) {
                    cells.push({ sheetName: sheet.name, ref: cell.address, cell });
                }
            }
        }
        return cells;
    }
    const cells = [];
    for (const sheet of workbook.worksheets) {
        sheet.eachRow({ includeEmpty: false }, (row) => {
            row.eachCell({ includeEmpty: false }, (cell) => {
                if (cell.formula) {
                    cells.push({ sheetName: sheet.name, ref: cell.address, cell });
                }
            });
        });
    }
    return cells;
}

async function recalculateXlsxArtifact(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const outputDir = toAbsolutePath(input.outputDir || path.join(process.cwd(), 'eval-results', 'artifact-tools', 'exports'), input.repoRoot);
    await fsp.mkdir(outputDir, { recursive: true });
    const outputPath = toAbsolutePath(input.outputPath || input.output_path || defaultExportPath(sourcePath, outputDir, 'recalculated'), input.repoRoot);
    await fsp.mkdir(path.dirname(outputPath), { recursive: true });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(sourcePath);
    const diagnostics = [];
    const engine = String(input.engine || input.recalculateEngine || input.recalculate_engine || 'ailis_local_formula_engine').toLowerCase();
    const engines = discoverRecalculationEngines();
    if (!['ailis_local_formula_engine', 'local'].includes(engine)) {
        diagnostics.push(createDiagnostic(
            'xlsx_recalculate_external_engine_unavailable',
            'warning',
            `Requested recalculation engine ${engine} is not wired in this runtime; using AILIS local formula engine.`,
            { requestedEngine: engine, availableEngines: engines }
        ));
    }
    const evaluator = createFormulaEvaluator(workbook, diagnostics);
    const targets = collectFormulaTargetCells(workbook, input);
    const updated = [];
    for (const target of targets) {
        const value = evaluator.evaluateCell(target.sheetName, target.ref, []);
        if (Number.isFinite(Number(value))) {
            const formula = target.cell.formula;
            target.cell.value = { formula, result: Number(value) };
            updated.push({
                ref: `${target.sheetName}!${target.ref}`,
                formula,
                result: Number(value)
            });
        }
    }
    await workbook.xlsx.writeFile(outputPath);
    const reopened = await inspectXlsxArtifact({
        ...input,
        sourcePath: outputPath,
        path: outputPath,
        target: input.target || input.range,
        include: ['values', 'formulas', 'styles']
    });
    const blockingDiagnostics = diagnostics.filter((diagnostic) => diagnostic.severity === 'error' || diagnostic.severity === 'fatal');
    return {
        passed: blockingDiagnostics.length === 0 && updated.length > 0,
        outputPath,
        engine: 'ailis_local_formula_engine',
        availableEngines: engines,
        updatedCount: updated.length,
        updated,
        reopened: {
            workbook: reopened.structure.workbook,
            view: reopened.view,
            validation: reopened.validation
        },
        diagnostics
    };
}

function forEachRangeCell(sheet, rangeRef, callback) {
    const bounds = parseRangeRef(rangeRef);
    if (!bounds) {
        throw new Error(`Invalid XLSX range: ${rangeRef}`);
    }
    for (let row = bounds.startRow; row <= bounds.endRow; row += 1) {
        for (let col = bounds.startCol; col <= bounds.endCol; col += 1) {
            callback(sheet.getCell(row, col), row - bounds.startRow, col - bounds.startCol, bounds);
        }
    }
    return bounds;
}

function matrixEntry(matrix, rowIndex, colIndex) {
    if (Array.isArray(matrix) && Array.isArray(matrix[rowIndex])) {
        return matrix[rowIndex][colIndex];
    }
    if (Array.isArray(matrix) && rowIndex === 0) {
        return matrix[colIndex];
    }
    return matrix;
}

function normalizeFormulaValue(value) {
    if (value && typeof value === 'object' && value.formula) {
        return {
            formula: String(value.formula).replace(/^=/, ''),
            result: clonePlain(value.result)
        };
    }
    if (typeof value === 'string') {
        return { formula: value.replace(/^=/, '') };
    }
    return value;
}

function applyStyleToCell(cell, style = {}) {
    const normalized = clonePlain(style) || {};
    if (typeof normalized.fill === 'string') {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: `FF${normalizeHex(normalized.fill)}` }
        };
    } else if (normalized.fill && typeof normalized.fill === 'object') {
        if (normalized.fill.color || normalized.fill.fgColor || normalized.fill.rgb) {
            const color = normalized.fill.color || normalized.fill.fgColor || normalized.fill.rgb;
            cell.fill = {
                type: 'pattern',
                pattern: normalized.fill.pattern || 'solid',
                fgColor: { argb: `FF${normalizeHex(color)}` }
            };
        } else {
            cell.fill = normalized.fill;
        }
    }
    if (normalized.font) {
        const font = { ...normalized.font };
        if (font.color && typeof font.color === 'string') {
            font.color = { argb: `FF${normalizeHex(font.color)}` };
        }
        cell.font = {
            ...(cell.font || {}),
            ...font
        };
    }
    if (normalized.alignment) {
        cell.alignment = {
            ...(cell.alignment || {}),
            ...normalized.alignment
        };
    }
    if (normalized.numFmt || normalized.numberFormat) {
        cell.numFmt = normalized.numFmt || normalized.numberFormat;
    }
    if (normalized.border) {
        cell.border = normalized.border;
    }
}

function defaultExportPath(sourcePath, outputDir, suffix = 'edited') {
    const base = path.basename(sourcePath, path.extname(sourcePath));
    return path.join(outputDir, `${base}-${suffix}.xlsx`);
}

function createOperationId(prefix = 'xlsx_edit') {
    return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;
}

async function editXlsxArtifact(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const outputDir = toAbsolutePath(input.outputDir || path.join(process.cwd(), 'eval-results', 'artifact-tools', 'exports'), input.repoRoot);
    await fsp.mkdir(outputDir, { recursive: true });
    const outputPath = toAbsolutePath(input.outputPath || input.output_path || defaultExportPath(sourcePath, outputDir), input.repoRoot);
    await fsp.mkdir(path.dirname(outputPath), { recursive: true });
    const operationId = input.operationId || input.operation_id || createOperationId();
    const logDir = toAbsolutePath(input.operationLogDir || input.operation_log_dir || path.join(outputDir, 'operation-logs'), input.repoRoot);
    await fsp.mkdir(logDir, { recursive: true });
    const backupPath = path.join(logDir, `${operationId}-before.xlsx`);
    const operationLogPath = path.join(logDir, `${operationId}.json`);
    const beforeHash = sha256File(sourcePath);
    await fsp.copyFile(sourcePath, backupPath);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(sourcePath);
    const operations = Array.isArray(input.operations) ? input.operations : [input.operation || input].filter(Boolean);
    const applied = [];
    const dirtyRanges = [];
    const affectedObjects = [];
    for (const operation of operations) {
        const op = String(operation.op || operation.action || '').toLowerCase();
        if (!op) {
            continue;
        }
        if (op === 'sheet.add') {
            const name = operation.name || operation.sheetName || operation.sheet;
            if (!name) {
                throw new Error('sheet.add requires a sheet name.');
            }
            const sheet = workbook.getWorksheet(name) || workbook.addWorksheet(name);
            applied.push({ op, target: name, sheetId: sheet.id });
            affectedObjects.push({ kind: 'sheet', ref: name, action: op });
            continue;
        }
        const target = operation.target || operation.range || input.target || input.range;
        const { sheet, rangeRef } = resolveWorksheet(workbook, {
            target,
            sheetName: operation.sheetName || operation.sheet || input.sheetName || input.sheet
        });
        if (!rangeRef) {
            throw new Error(`${op} requires a target range.`);
        }
        if (op === 'range.setvalues' || op === 'range.set_values') {
            const values = operation.values ?? operation.value;
            const bounds = forEachRangeCell(sheet, rangeRef, (cell, rowIndex, colIndex) => {
                cell.value = clonePlain(matrixEntry(values, rowIndex, colIndex));
            });
            applied.push({ op: 'range.setValues', target: `${sheet.name}!${rangeRef}`, bounds });
            dirtyRanges.push(`${sheet.name}!${rangeRef}`);
            affectedObjects.push({ kind: 'range', ref: `${sheet.name}!${rangeRef}`, action: 'range.setValues' });
        } else if (op === 'range.setformulas' || op === 'range.set_formulas') {
            const formulas = operation.formulas ?? operation.formula;
            const results = operation.results ?? operation.result;
            const bounds = forEachRangeCell(sheet, rangeRef, (cell, rowIndex, colIndex) => {
                const formulaInput = matrixEntry(formulas, rowIndex, colIndex);
                const formulaValue = normalizeFormulaValue(formulaInput);
                if (formulaValue && typeof formulaValue === 'object' && formulaValue.formula) {
                    cell.value = formulaValue;
                } else {
                    cell.value = {
                        formula: String(formulaValue || '').replace(/^=/, ''),
                        result: clonePlain(matrixEntry(results, rowIndex, colIndex))
                    };
                }
            });
            applied.push({ op: 'range.setFormulas', target: `${sheet.name}!${rangeRef}`, bounds });
            dirtyRanges.push(`${sheet.name}!${rangeRef}`);
            affectedObjects.push({ kind: 'range', ref: `${sheet.name}!${rangeRef}`, action: 'range.setFormulas' });
        } else if (op === 'range.setstyles' || op === 'range.set_styles') {
            const style = operation.style || operation.styles || {};
            const bounds = forEachRangeCell(sheet, rangeRef, (cell) => applyStyleToCell(cell, style));
            applied.push({ op: 'range.setStyles', target: `${sheet.name}!${rangeRef}`, bounds });
            dirtyRanges.push(`${sheet.name}!${rangeRef}`);
            affectedObjects.push({ kind: 'range', ref: `${sheet.name}!${rangeRef}`, action: 'range.setStyles' });
        } else if (op === 'range.clear') {
            const applyTo = String(operation.applyTo || operation.apply_to || 'contents').toLowerCase();
            const bounds = forEachRangeCell(sheet, rangeRef, (cell) => {
                if (applyTo === 'all' || applyTo === 'contents') {
                    cell.value = null;
                }
                if (applyTo === 'all' || applyTo === 'formats') {
                    cell.style = {};
                }
            });
            applied.push({ op: 'range.clear', target: `${sheet.name}!${rangeRef}`, applyTo, bounds });
            dirtyRanges.push(`${sheet.name}!${rangeRef}`);
            affectedObjects.push({ kind: 'range', ref: `${sheet.name}!${rangeRef}`, action: 'range.clear' });
        } else if (op === 'range.merge') {
            sheet.mergeCells(rangeRef);
            applied.push({ op: 'range.merge', target: `${sheet.name}!${rangeRef}` });
            dirtyRanges.push(`${sheet.name}!${rangeRef}`);
            affectedObjects.push({ kind: 'merge', ref: `${sheet.name}!${rangeRef}`, action: 'range.merge' });
        } else if (op === 'range.unmerge' || op === 'range.un_merge') {
            sheet.unMergeCells(rangeRef);
            applied.push({ op: 'range.unmerge', target: `${sheet.name}!${rangeRef}` });
            dirtyRanges.push(`${sheet.name}!${rangeRef}`);
            affectedObjects.push({ kind: 'merge', ref: `${sheet.name}!${rangeRef}`, action: 'range.unmerge' });
        } else {
            throw new Error(`Unsupported XLSX edit op: ${op}`);
        }
    }
    await workbook.xlsx.writeFile(outputPath);
    const afterHash = sha256File(outputPath);
    const reopened = await inspectXlsxArtifact({
        ...input,
        sourcePath: outputPath,
        path: outputPath,
        target: input.verifyTarget || input.verify_target || input.target,
        include: input.include || ['values', 'formulas', 'styles']
    });
    const uniqueDirtyRanges = [...new Set(dirtyRanges)];
    const operationLog = {
        id: operationId,
        path: operationLogPath,
        sourcePath,
        outputPath,
        beforeHash,
        afterHash,
        dirtyRanges: uniqueDirtyRanges,
        affectedObjects,
        rollback: {
            strategy: 'restore_backup',
            backupPath
        }
    };
    await fsp.writeFile(operationLogPath, JSON.stringify({
        schema: 'ailis.xlsx.operation_log.v1',
        operationId,
        sourcePath,
        outputPath,
        beforeHash,
        afterHash,
        backupPath,
        dirtyRanges: uniqueDirtyRanges,
        affectedObjects,
        operations: applied,
        createdAt: new Date().toISOString()
    }, null, 2), 'utf8');
    return {
        passed: fs.existsSync(outputPath) && afterHash !== beforeHash,
        outputPath,
        beforeHash,
        afterHash,
        operations: applied,
        dirtyRanges: uniqueDirtyRanges,
        affectedObjects,
        operationLog,
        rollback: {
            strategy: 'restore_backup',
            backupPath,
            outputPath: sourcePath
        },
        reopened: {
            workbook: reopened.structure.workbook,
            view: reopened.view,
            validation: reopened.validation
        },
        diagnostics: reopened.diagnostics
    };
}

async function rollbackXlsxArtifact(input = {}) {
    const backupPath = toAbsolutePath(input.backupPath || input.backup_path || input.rollback?.backupPath || input.rollback?.backup_path, input.repoRoot);
    if (!backupPath || !fs.existsSync(backupPath)) {
        return {
            passed: false,
            diagnostics: [createDiagnostic('xlsx_rollback_backup_missing', 'error', `Rollback backup does not exist: ${backupPath || '(missing)'}`)]
        };
    }
    const outputPath = toAbsolutePath(input.outputPath || input.output_path || input.restorePath || input.restore_path || defaultExportPath(backupPath, path.dirname(backupPath), 'rollback'), input.repoRoot);
    await fsp.mkdir(path.dirname(outputPath), { recursive: true });
    await fsp.copyFile(backupPath, outputPath);
    const reopened = await inspectXlsxArtifact({ ...input, sourcePath: outputPath, path: outputPath });
    return {
        passed: fs.existsSync(outputPath) && reopened.structure.workbook.sheetCount > 0,
        outputPath,
        backupPath,
        mode: 'restore_backup',
        reopened: {
            workbook: reopened.structure.workbook,
            validation: reopened.validation
        },
        diagnostics: reopened.diagnostics
    };
}

async function exportXlsxArtifact(input = {}) {
    if (input.operations || input.operation || input.op) {
        return editXlsxArtifact(input);
    }
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const outputDir = toAbsolutePath(input.outputDir || path.join(process.cwd(), 'eval-results', 'artifact-tools', 'exports'), input.repoRoot);
    await fsp.mkdir(outputDir, { recursive: true });
    const outputPath = toAbsolutePath(input.outputPath || input.output_path || defaultExportPath(sourcePath, outputDir, 'exported'), input.repoRoot);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(sourcePath);
    await workbook.xlsx.writeFile(outputPath);
    const reopened = await inspectXlsxArtifact({ ...input, sourcePath: outputPath, path: outputPath });
    return {
        passed: fs.existsSync(outputPath) && reopened.structure.workbook.sheetCount > 0,
        outputPath,
        mode: 'native_export_reopen',
        reopened: {
            workbook: reopened.structure.workbook,
            validation: reopened.validation
        },
        diagnostics: reopened.diagnostics
    };
}

function csvEscape(value = '') {
    const text = String(value ?? '');
    if (/[",\n\r]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

async function roundtripArtifact(input = {}) {
    const inspection = input.inspection || await inspectArtifact(input);
    const caseId = input.caseId || path.basename(inspection.sourcePath, path.extname(inspection.sourcePath));
    const outputDir = toAbsolutePath(input.outputDir || path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot);
    const roundtripDir = path.join(outputDir, 'roundtrip');
    await fsp.mkdir(roundtripDir, { recursive: true });
    const ext = path.extname(inspection.sourcePath) || `.${inspection.format}`;
    const outputPath = path.join(roundtripDir, `${caseId}${ext}`);

    if (inspection.format === 'xlsx') {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inspection.sourcePath);
        await workbook.xlsx.writeFile(outputPath);
        const reopened = await inspectXlsxArtifact({ sourcePath: outputPath, expected: input.expected, repoRoot: input.repoRoot });
        return {
            passed: reopened.structure.workbook.sheetCount === inspection.structure.workbook.sheetCount,
            mode: 'native_export_reopen',
            outputPath,
            reopened: {
                sheetCount: reopened.structure.workbook.sheetCount,
                sheetNames: reopened.structure.workbook.sheetNames
            }
        };
    }

    if (inspection.format === 'csv' || inspection.format === 'tsv') {
        const delimiter = inspection.format === 'tsv' ? '\t' : ',';
        const text = (inspection.structure.rows || [])
            .map((row) => row.map(csvEscape).join(delimiter))
            .join('\n');
        await fsp.writeFile(outputPath, `${text}\n`, 'utf8');
        const reopened = await inspectCsvArtifact({ sourcePath: outputPath, format: inspection.format, repoRoot: input.repoRoot });
        return {
            passed: compareStringArrays(reopened.structure.headers, inspection.structure.headers),
            mode: 'normalized_export_reopen',
            outputPath,
            reopened: {
                headers: reopened.structure.headers,
                rowCount: reopened.structure.rowCount
            }
        };
    }

    await fsp.copyFile(inspection.sourcePath, outputPath);
    const reopened = await inspectArtifact({ sourcePath: outputPath, format: inspection.format, expected: input.expected, repoRoot: input.repoRoot });
    let passed = reopened.text.length === inspection.text.length;
    if (inspection.format === 'pptx') {
        passed = reopened.structure.slideCount === inspection.structure.slideCount
            && reopened.structure.imageCount === inspection.structure.imageCount
            && reopened.structure.tableCount === inspection.structure.tableCount;
    } else if (inspection.format === 'docx') {
        passed = reopened.structure.paragraphCount === inspection.structure.paragraphCount
            && reopened.structure.tableCount === inspection.structure.tableCount
            && reopened.structure.imageCount === inspection.structure.imageCount
            && reopened.structure.commentCount === inspection.structure.commentCount;
    } else if (inspection.format === 'pdf') {
        passed = reopened.structure.pageCount === inspection.structure.pageCount
            && reopened.structure.hasTextLayer === inspection.structure.hasTextLayer;
    } else if (inspection.adapterId === 'image' || FILE_ADAPTER_FORMATS.has(inspection.format)) {
        if (reopened.adapterId === 'image') {
            passed = reopened.structure.width === inspection.structure.width
                && reopened.structure.height === inspection.structure.height
                && reopened.structure.visualCheck?.blank === inspection.structure.visualCheck?.blank;
        }
    }
    return {
        passed,
        mode: 'copy_reopen',
        outputPath,
        reopened: {
            textLength: reopened.text.length,
            slideCount: reopened.structure.slideCount,
            pageCount: reopened.structure.pageCount,
            paragraphCount: reopened.structure.paragraphCount,
            tableCount: reopened.structure.tableCount,
            imageCount: reopened.structure.imageCount,
            width: reopened.structure.width,
            height: reopened.structure.height
        }
    };
}

async function runArtifactAdapterChecks(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    if (!fs.existsSync(sourcePath)) {
        return {
            passed: false,
            status: 'failed',
            diagnostics: [createDiagnostic('fixture_missing', 'error', `Artifact input does not exist: ${sourcePath}`)]
        };
    }
    const inspection = await inspectArtifact({ ...input, sourcePath });
    const structure = validateAgainstExpected(inspection, input.expected || {});
    const render = await renderArtifactPreview({
        ...input,
        target: input.expected?.render?.target || input.target,
        range: input.expected?.render?.target || input.range,
        scale: input.expected?.render?.scale || input.scale,
        inspection
    });
    const roundtrip = await roundtripArtifact({ ...input, inspection });
    let trace = null;
    if (inspection.format === 'xlsx' && input.expected?.formulaTrace?.target) {
        trace = await traceXlsxFormula({
            ...input,
            target: input.expected.formulaTrace.target,
            maxDepth: input.expected.formulaTrace.maxDepth || 4,
            maxExpandedCells: input.expected.formulaTrace.maxExpandedCells || 80
        });
        const nodeIds = new Set((trace.nodes || []).map((node) => node.id));
        const requiredRefs = input.expected.formulaTrace.mustReference || [];
        const checks = requiredRefs.map((ref) => ({
            name: `formula_trace_reference_${ref}`,
            passed: nodeIds.has(ref),
            actual: nodeIds.has(ref),
            expected: true
        }));
        trace.checks = checks;
        trace.passed = trace.passed && checks.every((check) => check.passed);
    }
    let searches = null;
    if (Array.isArray(input.expected?.searches)) {
        searches = [];
        for (const searchSpec of input.expected.searches) {
            const search = await searchArtifact({
                ...input,
                sourcePath,
                ...searchSpec
            });
            const refs = new Set((search.matches || []).map((match) => match.ref || match.fullRef || match.name || match.part || match.target));
            const requiredRefs = searchSpec.mustReference || searchSpec.mustRefs || [];
            const minimumMatches = Number(searchSpec.minimumMatches || searchSpec.minMatches || 1);
            const searchSummary = search.search || {
                kind: search.kind || searchSpec.searchKind || searchSpec.kind || 'all',
                query: search.query || searchSpec.query || '',
                fillRgb: search.fillRgb || searchSpec.fillRgb || '',
                returned: search.returned || (search.matches || []).length,
                totalCandidates: search.totalCandidates || 0
            };
            const checks = [
                {
                    name: `artifact_search_${searchSpec.searchKind || searchSpec.kind || 'all'}_min_matches`,
                    passed: (search.matches || []).length >= minimumMatches,
                    actual: (search.matches || []).length,
                    expected: minimumMatches
                },
                ...requiredRefs.map((ref) => ({
                    name: `artifact_search_reference_${ref}`,
                    passed: refs.has(ref),
                    actual: [...refs].slice(0, 20),
                    expected: ref
                }))
            ];
            searches.push({
                ...search,
                search: searchSummary,
                checks,
                passed: checks.every((check) => check.passed)
            });
        }
    }
    let queries = null;
    if (inspection.format === 'xlsx' && Array.isArray(input.expected?.queries)) {
        queries = [];
        for (const querySpec of input.expected.queries) {
            const query = await queryXlsxArtifact({
                ...input,
                sourcePath,
                ...querySpec
            });
            const refs = new Set([
                ...(query.rows || []).map((row) => row.ref),
                query.aggregateResult?.row?.ref || '',
                ...(query.groups || []).flatMap((group) => (group.rows || []).map((row) => row.ref))
            ].filter(Boolean));
            const minimumRows = Number(querySpec.minimumRows || querySpec.minRows || 0);
            const aggregateValue = typeof querySpec.aggregateValue !== 'undefined'
                ? querySpec.aggregateValue
                : querySpec.expectedValue;
            const aggregateTolerance = Number(querySpec.tolerance || 0);
            const checks = [];
            if (minimumRows > 0) {
                checks.push({
                    name: `artifact_query_min_rows_${querySpec.table || querySpec.tableName || 'table'}`,
                    passed: (query.totalMatchedRows || query.rowCount || 0) >= minimumRows,
                    actual: query.totalMatchedRows || query.rowCount || 0,
                    expected: minimumRows
                });
            }
            if (typeof aggregateValue !== 'undefined') {
                const actual = Number(query.aggregateResult?.value);
                const expected = Number(aggregateValue);
                checks.push({
                    name: `artifact_query_aggregate_${query.aggregateResult?.op || querySpec.op || 'value'}`,
                    passed: Number.isFinite(actual) && Number.isFinite(expected)
                        ? Math.abs(actual - expected) <= aggregateTolerance
                        : String(query.aggregateResult?.value) === String(aggregateValue),
                    actual: query.aggregateResult?.value,
                    expected: aggregateValue
                });
            }
            for (const ref of querySpec.mustReference || querySpec.mustRefs || []) {
                checks.push({
                    name: `artifact_query_reference_${ref}`,
                    passed: refs.has(ref),
                    actual: [...refs].slice(0, 20),
                    expected: ref
                });
            }
            for (const groupSpec of querySpec.mustGroups || querySpec.must_groups || []) {
                const group = (query.groups || []).find((entry) => String(entry.key) === String(groupSpec.key));
                const expectedValue = groupSpec.aggregateValue ?? groupSpec.value;
                const actualValue = group?.aggregate?.value;
                checks.push({
                    name: `artifact_query_group_${groupSpec.key}`,
                    passed: Boolean(group) && (
                        typeof expectedValue === 'undefined'
                        || Math.abs(Number(actualValue) - Number(expectedValue)) <= aggregateTolerance
                    ),
                    actual: group ? { key: group.key, value: actualValue } : null,
                    expected: groupSpec
                });
            }
            queries.push({
                ...query,
                checks,
                passed: query.passed !== false && checks.every((check) => check.passed)
            });
        }
    }
    let edit = null;
    if (inspection.format === 'xlsx' && input.expected?.editRoundtrip?.operations) {
        const editOutputDir = path.join(
            toAbsolutePath(input.outputDir || path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot),
            'exports'
        );
        edit = await editXlsxArtifact({
            ...input,
            operations: input.expected.editRoundtrip.operations,
            outputDir: editOutputDir,
            outputPath: input.expected.editRoundtrip.outputPath,
            verifyTarget: input.expected.editRoundtrip.verifyTarget || input.expected.editRoundtrip.after?.target,
            include: ['values', 'formulas', 'styles']
        });
        if (input.expected.editRoundtrip.after) {
            const editedInspection = await inspectXlsxArtifact({
                ...input,
                sourcePath: edit.outputPath,
                path: edit.outputPath,
                target: input.expected.editRoundtrip.after.target,
                include: ['values', 'formulas', 'styles']
            });
            const editedStructure = validateAgainstExpected(editedInspection, input.expected.editRoundtrip.after);
            edit.after = {
                passed: editedStructure.passed,
                checks: editedStructure.checks,
                diagnostics: editedStructure.diagnostics,
                inspection: {
                    structure: editedInspection.structure,
                    view: editedInspection.view
                }
            };
            edit.passed = edit.passed && editedStructure.passed;
        }
    }
    let recalculation = null;
    if (inspection.format === 'xlsx' && input.expected?.recalculate) {
        const recalcOutputDir = path.join(
            toAbsolutePath(input.outputDir || path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot),
            'exports'
        );
        let recalcSourcePath = sourcePath;
        if (input.expected.recalculate.beforeOperations) {
            const prepared = await editXlsxArtifact({
                ...input,
                operations: input.expected.recalculate.beforeOperations,
                outputDir: recalcOutputDir,
                outputPath: input.expected.recalculate.preparedPath
            });
            recalcSourcePath = prepared.outputPath;
        }
        recalculation = await recalculateXlsxArtifact({
            ...input,
            sourcePath: recalcSourcePath,
            path: recalcSourcePath,
            target: input.expected.recalculate.target,
            outputDir: recalcOutputDir,
            outputPath: input.expected.recalculate.outputPath,
            engine: input.expected.recalculate.engine
        });
        if (input.expected.recalculate.after) {
            const recalculatedInspection = await inspectXlsxArtifact({
                ...input,
                sourcePath: recalculation.outputPath,
                path: recalculation.outputPath,
                target: input.expected.recalculate.after.target,
                include: ['values', 'formulas', 'styles']
            });
            const recalculatedStructure = validateAgainstExpected(recalculatedInspection, input.expected.recalculate.after);
            recalculation.after = {
                passed: recalculatedStructure.passed,
                checks: recalculatedStructure.checks,
                diagnostics: recalculatedStructure.diagnostics,
                inspection: {
                    structure: recalculatedInspection.structure,
                    view: recalculatedInspection.view
                }
            };
            recalculation.passed = recalculation.passed && recalculatedStructure.passed;
        }
    }
    const passed = structure.passed
        && render.passed
        && roundtrip.passed
        && (!trace || trace.passed)
        && (!searches || searches.every((search) => search.passed))
        && (!queries || queries.every((query) => query.passed))
        && (!edit || edit.passed)
        && (!recalculation || recalculation.passed);
    return {
        passed,
        status: passed ? 'passed' : 'failed',
        adapterId: inspection.adapterId,
        format: inspection.format,
        sourcePath,
        structure,
        render,
        roundtrip,
        trace,
        searches,
        queries,
        edit,
        recalculation,
        inspection: {
            structure: inspection.structure,
            textPreview: inspection.text.slice(0, 500),
            diagnostics: inspection.diagnostics
        },
        diagnostics: structure.diagnostics
    };
}

module.exports = {
    IMPLEMENTED_ADAPTER_IDS,
    editXlsxArtifact,
    exportXlsxArtifact,
    indexFileArtifact,
    indexXlsxArtifact,
    inspectArtifact,
    queryXlsxArtifact,
    recalculateXlsxArtifact,
    renderArtifactPreview,
    rollbackXlsxArtifact,
    roundtripArtifact,
    runArtifactAdapterChecks,
    searchArtifact,
    searchXlsxArtifact,
    traceXlsxFormula,
    validateAgainstExpected
};
