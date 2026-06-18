const zlib = require('zlib');

let pdfjsPromise = null;

function normalizeExtractedDocumentText(value = '') {
    return String(value || '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/[\t\f\v]+/g, ' ')
        .replace(/[ \u00a0]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function normalizePdfItemText(value = '') {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .trim();
}

function decodePdfLiteralString(value = '') {
    return String(value || '')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\b/g, '\b')
        .replace(/\\f/g, '\f')
        .replace(/\\([()\\])/g, '$1');
}

function extractPdfTextFromStream(streamText = '') {
    const pieces = [];
    for (const match of String(streamText || '').matchAll(/\((?:\\.|[^\\)])*\)\s*Tj/g)) {
        pieces.push(decodePdfLiteralString(match[0].replace(/\s*Tj$/, '').slice(1, -1)));
    }
    for (const match of String(streamText || '').matchAll(/\[(.*?)\]\s*TJ/gs)) {
        const joined = [...match[1].matchAll(/\((?:\\.|[^\\)])*\)/g)]
            .map((part) => decodePdfLiteralString(part[0].slice(1, -1)))
            .join('');
        if (joined) {
            pieces.push(joined);
        }
    }
    return pieces.join('\n');
}

function extractBasicPdfDocument(buffer) {
    const source = buffer.toString('latin1');
    const texts = [];
    for (const match of source.matchAll(/<<(.*?)>>\s*stream\r?\n?([\s\S]*?)\r?\n?endstream/gi)) {
        const dictionary = match[1] || '';
        let streamBuffer = Buffer.from(match[2] || '', 'latin1');
        if (/\/FlateDecode/i.test(dictionary)) {
            try {
                streamBuffer = zlib.inflateSync(streamBuffer);
            } catch {
                continue;
            }
        }
        const streamText = streamBuffer.toString('latin1');
        const extracted = extractPdfTextFromStream(streamText);
        if (extracted) {
            texts.push(extracted);
        }
    }
    if (!texts.length) {
        for (const match of source.matchAll(/\(([^()]{3,500})\)/g)) {
            const text = decodePdfLiteralString(match[1]);
            if (/[A-Za-z0-9\u4e00-\u9fff]/.test(text)) {
                texts.push(text);
            }
            if (texts.length >= 2000) {
                break;
            }
        }
    }
    const text = normalizeExtractedDocumentText(texts.join('\n'));
    if (!text) {
        throw new Error('pdf_no_text_extracted');
    }
    return {
        format: 'pdf',
        parser: 'basic_pdf_stream_text',
        text,
        pages: [{ pageNumber: 1, text }],
        sections: [{ index: 0, title: 'PDF extracted text', text }],
        metadata: {
            engine: 'basic_pdf_stream_text',
            fallback: true
        }
    };
}

function createScannedPdfNeedsOcrError(cause) {
    const details = cause?.details && typeof cause.details === 'object' ? cause.details : {};
    const error = new Error('scanned_pdf_needs_ocr');
    error.code = 'scanned_pdf_needs_ocr';
    error.details = {
        ...details,
        reason: details.reason || 'PDF.js parsed the file, but no selectable text was extracted. This appears to be a scanned/image-only PDF and needs OCR.',
        primaryParser: 'pdfjs-dist',
        needsOcr: true
    };
    if (cause?.message) {
        error.causeMessage = cause.message;
    }
    return error;
}

function isNoSelectablePdfTextError(error) {
    return error?.code === 'pdf_no_text_extracted' ||
        error?.code === 'scanned_pdf_needs_ocr' ||
        /pdf_no_text_extracted|no selectable text|scanned\/image-only/i.test(error?.message || '');
}

function getPdfItemPosition(item = {}) {
    const transform = Array.isArray(item.transform) ? item.transform : [];
    return {
        x: Number.isFinite(transform[4]) ? transform[4] : 0,
        y: Number.isFinite(transform[5]) ? transform[5] : 0
    };
}

function textContentToLines(textContent = {}) {
    const rawItems = Array.isArray(textContent.items) ? textContent.items : [];
    const items = rawItems
        .filter((item) => typeof item?.str === 'string')
        .map((item, index) => ({
            index,
            text: normalizePdfItemText(item.str),
            hasEOL: item.hasEOL === true,
            ...getPdfItemPosition(item)
        }))
        .filter((item) => item.text || item.hasEOL);

    if (!items.length) {
        return [];
    }

    const lines = [];
    let current = [];
    let currentY = items[0].y;
    const yTolerance = 2.5;
    for (const item of items) {
        const startsNewLine = current.length > 0 && (
            item.hasEOL ||
            Math.abs(item.y - currentY) > yTolerance
        );
        if (startsNewLine) {
            lines.push(current);
            current = [];
            currentY = item.y;
        }
        if (item.text) {
            current.push(item);
        }
        if (item.hasEOL && current.length) {
            lines.push(current);
            current = [];
        }
    }
    if (current.length) {
        lines.push(current);
    }

    return lines
        .map((line) => line
            .slice()
            .sort((a, b) => a.x - b.x || a.index - b.index)
            .map((item) => item.text)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim())
        .filter(Boolean);
}

function buildPdfjsSection(page) {
    return {
        index: page.pageNumber - 1,
        title: `Page ${page.pageNumber}`,
        text: page.text || '',
        pageNumber: page.pageNumber
    };
}

async function loadPdfjs() {
    if (!pdfjsPromise) {
        pdfjsPromise = import('pdfjs-dist/legacy/build/pdf.mjs');
    }
    return await pdfjsPromise;
}

async function extractPdfWithPdfjs(buffer, options = {}) {
    const pdfjs = await loadPdfjs();
    const warnings = [];
    const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(buffer),
        disableFontFace: true,
        isEvalSupported: false,
        useSystemFonts: true,
        stopAtErrors: false,
        verbosity: Number.isFinite(options.verbosity) ? options.verbosity : 0
    });
    let document;
    try {
        document = await loadingTask.promise;
        const metadata = await document.getMetadata().catch((error) => {
            warnings.push(`metadata:${error?.message || String(error)}`);
            return {};
        });
        const outline = await document.getOutline().catch((error) => {
            warnings.push(`outline:${error?.message || String(error)}`);
            return null;
        });
        const pages = [];
        const maxPages = Number.isFinite(options.maxPages)
            ? Math.max(1, Math.min(document.numPages, Math.floor(options.maxPages)))
            : document.numPages;
        for (let pageNumber = 1; pageNumber <= maxPages; pageNumber += 1) {
            const page = await document.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 1 });
            const content = await page.getTextContent({
                includeMarkedContent: true,
                disableNormalization: false
            });
            const lines = textContentToLines(content);
            const pageText = normalizeExtractedDocumentText(lines.join('\n'));
            pages.push({
                pageNumber,
                text: pageText,
                width: viewport.width,
                height: viewport.height,
                rotation: page.rotate || 0,
                itemCount: Array.isArray(content.items) ? content.items.length : 0
            });
        }
        const text = normalizeExtractedDocumentText(pages.map((page) => page.text).filter(Boolean).join('\n\n'));
        if (!text) {
            const error = new Error('pdf_no_text_extracted');
            error.code = 'pdf_no_text_extracted';
            error.details = {
                reason: 'PDF.js parsed the file, but no selectable text was extracted. This may be a scanned/image-only PDF and needs OCR.',
                pages: document.numPages
            };
            throw error;
        }
        return {
            format: 'pdf',
            parser: 'pdfjs-dist',
            text,
            pages,
            sections: pages.map(buildPdfjsSection),
            metadata: {
                engine: 'pdfjs-dist',
                pdfjsVersion: pdfjs.version || null,
                pages: document.numPages,
                parsedPages: pages.length,
                fingerprints: Array.isArray(document.fingerprints) ? document.fingerprints : [],
                info: metadata?.info || {},
                metadata: metadata?.metadata?.getAll?.() || {},
                outline: Array.isArray(outline)
                    ? outline.map((item) => ({
                        title: item?.title || '',
                        bold: item?.bold === true,
                        italic: item?.italic === true
                    })).filter((item) => item.title)
                    : [],
                warnings
            }
        };
    } finally {
        if (document?.destroy) {
            await document.destroy().catch(() => {});
        } else if (loadingTask?.destroy) {
            await loadingTask.destroy().catch(() => {});
        }
    }
}

async function extractPdfDocument(buffer, options = {}) {
    const errors = [];
    try {
        return await extractPdfWithPdfjs(buffer, options);
    } catch (error) {
        errors.push(error?.message || String(error));
        if (isNoSelectablePdfTextError(error)) {
            throw createScannedPdfNeedsOcrError(error);
        }
        if (options.disableFallback === true) {
            throw error;
        }
    }
    try {
        const fallback = extractBasicPdfDocument(buffer);
        return {
            ...fallback,
            parser: 'basic_pdf_stream_text_fallback',
            metadata: {
                ...(fallback.metadata || {}),
                engine: 'basic_pdf_stream_text',
                fallback: true,
                primaryParser: 'pdfjs-dist',
                primaryErrors: errors
            }
        };
    } catch (fallbackError) {
        const error = new Error(errors.concat(fallbackError?.message || String(fallbackError)).join('; ') || 'pdf_parse_failed');
        error.code = 'pdf_parse_failed';
        error.primaryErrors = errors;
        error.fallbackError = fallbackError?.message || String(fallbackError);
        throw error;
    }
}

module.exports = {
    extractPdfDocument,
    extractPdfWithPdfjs,
    extractBasicPdfDocument,
    textContentToLines
};
