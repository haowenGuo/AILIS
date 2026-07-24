import test from 'node:test';
import assert from 'node:assert/strict';
import pdfEngine from '../electron/ailis-pdf-document-engine.cjs';

const { extractPdfDocument } = pdfEngine;

function escapePdfText(text) {
    return String(text).replace(/[()\\]/g, '\\$&');
}

function buildValidPdf(pages) {
    const objectMap = new Map();
    const pageIds = [];
    objectMap.set(1, '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    objectMap.set(3, '3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

    pages.forEach((pageText, index) => {
        const pageId = 4 + (index * 2);
        const contentId = pageId + 1;
        pageIds.push(pageId);
        const stream = `BT /F1 12 Tf 72 720 Td (${escapePdfText(pageText)}) Tj ET`;
        objectMap.set(
            pageId,
            `${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`
        );
        objectMap.set(
            contentId,
            `${contentId} 0 obj\n<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}\nendstream\nendobj\n`
        );
    });

    const objectCount = 3 + (pages.length * 2);
    objectMap.set(
        2,
        `2 0 obj\n<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>\nendobj\n`
    );

    let body = '%PDF-1.4\n';
    const offsets = Array(objectCount + 1).fill(0);
    for (let objectId = 1; objectId <= objectCount; objectId += 1) {
        const object = objectMap.get(objectId);
        if (!object) {
            continue;
        }
        offsets[objectId] = Buffer.byteLength(body, 'latin1');
        body += object;
    }
    const xrefOffset = Buffer.byteLength(body, 'latin1');
    body += `xref\n0 ${objectCount + 1}\n`;
    body += '0000000000 65535 f \n';
    for (let objectId = 1; objectId <= objectCount; objectId += 1) {
        body += `${String(offsets[objectId]).padStart(10, '0')} 00000 n \n`;
    }
    body += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    return Buffer.from(body, 'latin1');
}

function buildInvalidMinimalPdf(text) {
    const stream = `BT /F1 12 Tf 72 720 Td (${escapePdfText(text)}) Tj ET`;
    return Buffer.from([
        '%PDF-1.4',
        '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
        '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
        '3 0 obj << /Type /Page /Parent 2 0 R /Contents 4 0 R >> endobj',
        `4 0 obj << /Length ${Buffer.byteLength(stream, 'latin1')} >> stream`,
        stream,
        'endstream endobj',
        '%%EOF'
    ].join('\n'), 'latin1');
}

function buildBlankPdfWithoutSelectableText() {
    const objects = [
        '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
        '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
        '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\n'
    ];
    let body = '%PDF-1.4\n';
    const offsets = [0];
    for (const object of objects) {
        offsets.push(Buffer.byteLength(body, 'latin1'));
        body += object;
    }
    const xrefOffset = Buffer.byteLength(body, 'latin1');
    body += `xref\n0 ${objects.length + 1}\n`;
    body += '0000000000 65535 f \n';
    for (let index = 1; index < offsets.length; index += 1) {
        body += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
    }
    body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    return Buffer.from(body, 'latin1');
}

test('PDF document engine extracts multi-page text with PDF.js', async () => {
    const document = await extractPdfDocument(buildValidPdf([
        'FIRST_PAGE_PDFJS_ENGINE_TOKEN',
        'SECOND_PAGE_PDFJS_ENGINE_TOKEN'
    ]));

    assert.equal(document.format, 'pdf');
    assert.equal(document.parser, 'pdfjs-dist');
    assert.equal(document.metadata.engine, 'pdfjs-dist');
    assert.equal(document.pages.length, 2);
    assert.match(document.pages[0].text, /FIRST_PAGE_PDFJS_ENGINE_TOKEN/);
    assert.match(document.pages[1].text, /SECOND_PAGE_PDFJS_ENGINE_TOKEN/);
    assert.match(document.text, /FIRST_PAGE_PDFJS_ENGINE_TOKEN/);
    assert.match(document.text, /SECOND_PAGE_PDFJS_ENGINE_TOKEN/);
    assert.deepEqual(document.sections.map((section) => section.title), ['Page 1', 'Page 2']);
});

test('PDF document engine falls back for legacy minimal PDFs without xref', async () => {
    const document = await extractPdfDocument(buildInvalidMinimalPdf('FALLBACK_PDF_TOKEN'));

    assert.equal(document.parser, 'basic_pdf_stream_text_fallback');
    assert.equal(document.metadata.primaryParser, 'pdfjs-dist');
    assert.equal(document.metadata.fallback, true);
    assert.match(document.text, /FALLBACK_PDF_TOKEN/);
});

test('PDF document engine routes PDFs without selectable text to OCR instead of fallback text', async () => {
    await assert.rejects(
        () => extractPdfDocument(buildBlankPdfWithoutSelectableText()),
        (error) => {
            assert.equal(error.code, 'scanned_pdf_needs_ocr');
            assert.equal(error.details.needsOcr, true);
            assert.equal(error.details.primaryParser, 'pdfjs-dist');
            return true;
        }
    );
});
