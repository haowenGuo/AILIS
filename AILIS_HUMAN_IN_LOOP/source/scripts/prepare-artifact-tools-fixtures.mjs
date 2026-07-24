import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ExcelJS = require('exceljs');
const execFileAsync = promisify(execFile);

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const fixturesRoot = path.join(repoRoot, 'evals', 'artifact-tools', 'fixtures');

function getArtifactPython() {
    const home = process.env.USERPROFILE || process.env.HOME || '';
    const bundled = home
        ? path.join(home, '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'python', process.platform === 'win32' ? 'python.exe' : 'bin/python')
        : '';
    const candidates = [
        process.env.AILIS_ARTIFACT_PYTHON,
        bundled,
        process.env.PYTHON,
        process.platform === 'win32' ? 'python.exe' : 'python3',
        'python'
    ].filter(Boolean);
    return candidates.find((candidate) => {
        if (candidate.includes(path.sep) || candidate.includes('/')) {
            return candidate && require('node:fs').existsSync(candidate);
        }
        return true;
    }) || 'python';
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function acquireFixtureLock() {
    await fs.mkdir(fixturesRoot, { recursive: true });
    const lockPath = path.join(fixturesRoot, '.prepare.lock');
    for (let attempt = 0; attempt < 120; attempt += 1) {
        try {
            const handle = await fs.open(lockPath, 'wx');
            await handle.writeFile(String(process.pid), 'utf8');
            return async () => {
                await handle.close().catch(() => {});
                await fs.unlink(lockPath).catch(() => {});
            };
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
            await sleep(250);
        }
    }
    throw new Error(`Timed out waiting for fixture preparation lock: ${lockPath}`);
}

const mapPath = [
    'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7',
    'B7', 'C7', 'D7', 'E7', 'F7', 'G7',
    'G6', 'G5', 'F5', 'E5', 'D5', 'C5',
    'C4', 'C3', 'D3', 'E3', 'F3', 'G3',
    'G2', 'G1'
];

function cellRefToRowCol(ref) {
    const match = /^([A-Z]+)(\d+)$/i.exec(ref);
    if (!match) {
        throw new Error(`Invalid cell reference: ${ref}`);
    }
    let col = 0;
    for (const char of match[1].toUpperCase()) {
        col = col * 26 + (char.charCodeAt(0) - 64);
    }
    return { row: Number(match[2]), col };
}

function escapePdfText(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function createMinimalTextPdf(lines) {
    const textOps = lines
        .map((line, index) => {
            const prefix = index === 0 ? '72 740 Td' : '0 -18 Td';
            return `${prefix} (${escapePdfText(line)}) Tj`;
        })
        .join('\n');
    const stream = `BT\n/F1 12 Tf\n${textOps}\nET`;
    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        `<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream`
    ];
    let body = '%PDF-1.4\n';
    const offsets = [0];
    for (let index = 0; index < objects.length; index += 1) {
        offsets.push(Buffer.byteLength(body, 'utf8'));
        body += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
    }
    const xrefOffset = Buffer.byteLength(body, 'utf8');
    body += `xref\n0 ${objects.length + 1}\n`;
    body += '0000000000 65535 f \n';
    for (const offset of offsets.slice(1)) {
        body += `${String(offset).padStart(10, '0')} 00000 n \n`;
    }
    body += `trailer\n<< /Root 1 0 R /Size ${objects.length + 1} >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    return Buffer.from(body, 'utf8');
}

async function writeWorkbookFixture(targetPath) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'AILIS Artifact Tools';
    workbook.created = new Date('2026-01-01T00:00:00Z');
    const sheet = workbook.addWorksheet('Map', {
        properties: { defaultRowHeight: 24 },
        views: [{ showGridLines: false }]
    });
    sheet.columns = Array.from({ length: 7 }, () => ({ width: 10 }));

    const pathSet = new Set(mapPath);
    const pathPalette = ['FDE68A', 'BBF7D0', 'BAE6FD', 'DDD6FE', 'FBCFE8', 'FED7AA'];
    for (let row = 1; row <= 7; row += 1) {
        for (let col = 1; col <= 7; col += 1) {
            const cell = sheet.getCell(row, col);
            const address = cell.address;
            const isPath = pathSet.has(address);
            const pathIndex = mapPath.indexOf(address);
            const fill = isPath ? pathPalette[Math.max(pathIndex, 0) % pathPalette.length] : '0099FF';
            cell.value = '';
            if (address === 'A1') {
                cell.value = 'START';
            } else if (address === 'G1') {
                cell.value = 'END';
            } else if (address === 'E3') {
                cell.value = 'TURN_11';
            }
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: `FF${address === 'E3' ? 'F478A7' : fill}` }
            };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FF475569' } },
                left: { style: 'thin', color: { argb: 'FF475569' } },
                bottom: { style: 'thin', color: { argb: 'FF475569' } },
                right: { style: 'thin', color: { argb: 'FF475569' } }
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = {
                name: 'Calibri',
                size: 11,
                bold: ['A1', 'G1', 'E3'].includes(address),
                color: { argb: isPath ? 'FF111827' : 'FFFFFFFF' }
            };
        }
    }

    sheet.getCell('I1').value = 'Fixture note';
    sheet.getCell('I2').value = 'Move two cells per turn; avoid blue cells.';
    sheet.getCell('I3').value = 'Turn 11 lands on E3.';
    sheet.getCell('I4').value = 'Expected hex: F478A7';

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await workbook.xlsx.writeFile(targetPath);
}

async function writeXlsxModelFixture(targetPath) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'AILIS Artifact Tools';
    workbook.created = new Date('2026-01-01T00:00:00Z');

    const data = workbook.addWorksheet('Data', {
        views: [{ state: 'frozen', ySplit: 1 }]
    });
    data.columns = [
        { header: 'Item', key: 'item', width: 16 },
        { header: 'Qty', key: 'qty', width: 10 },
        { header: 'Price', key: 'price', width: 10 },
        { header: 'Revenue', key: 'revenue', width: 14 }
    ];
    data.getRow(1).values = ['Item', 'Qty', 'Price', 'Revenue'];
    const rows = [
        ['Alpha', 2, 12, { formula: 'B2*C2', result: 24 }],
        ['Beta', 3, 15, { formula: 'B3*C3', result: 45 }],
        ['Gamma', 1, 22, { formula: 'B4*C4', result: 22 }]
    ];
    for (let index = 0; index < rows.length; index += 1) {
        data.getRow(index + 2).values = rows[index];
    }
    data.getRow(3).hidden = true;
    data.getColumn(3).hidden = true;
    data.getCell('A2').note = 'Primary product row used by artifact_search comment inventory.';
    data.getRange?.('A1:D1');
    for (const cell of ['A1', 'B1', 'C1', 'D1']) {
        data.getCell(cell).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
        data.getCell(cell).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    }
    data.getCell('B2').dataValidation = {
        type: 'whole',
        operator: 'greaterThan',
        formulae: [0],
        showErrorMessage: true,
        errorTitle: 'Invalid quantity',
        error: 'Quantity must be positive'
    };
    data.addTable({
        name: 'SalesTable',
        ref: 'A1',
        headerRow: true,
        totalsRow: false,
        style: {
            theme: 'TableStyleMedium2',
            showRowStripes: true
        },
        columns: [
            { name: 'Item', filterButton: true },
            { name: 'Qty', filterButton: true },
            { name: 'Price', filterButton: true },
            { name: 'Revenue', filterButton: true }
        ],
        rows
    });

    const summary = workbook.addWorksheet('Summary');
    summary.columns = Array.from({ length: 5 }, () => ({ width: 16 }));
    summary.mergeCells('A1:D1');
    summary.getCell('A1').value = 'Quarter Summary';
    summary.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
    summary.getCell('A1').font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
    summary.getCell('A1').alignment = { horizontal: 'center' };
    summary.getCell('A3').value = 'Total revenue';
    summary.getCell('B3').value = { formula: 'SUM(Data!D2:D4)', result: 91 };
    summary.getCell('A4').value = 'Broken reference';
    summary.getCell('B4').value = { formula: 'Missing!A1', result: { error: '#REF!' } };
    summary.getCell('A8').value = 'Named total echo';
    summary.getCell('B8').value = { formula: 'TotalRevenue+1', result: 92 };
    summary.getCell('B3').numFmt = '$#,##0';
    summary.getCell('B3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
    summary.getCell('B4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
    workbook.definedNames.add('Summary!$B$3', 'TotalRevenue');
    const imageId = workbook.addImage({
        base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
        extension: 'png'
    });
    summary.addImage(imageId, 'D3:D4');

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await workbook.xlsx.writeFile(targetPath);
}

async function writeCsvFixture(targetPath) {
    const csv = [
        'id,name,score,joined,active',
        '1,Ada,98,2026-01-03,true',
        '2,Bo,,2026-01-04,false',
        '3,Cy,not-a-number,2026-13-01,true',
        '4,Dee,87,2026-02-10,true,extra-field',
        '5,Eli,91,2026-02-11'
    ].join('\n');
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, `${csv}\n`, 'utf8');
}

async function writePdfFixture(targetPath) {
    const pdf = createMinimalTextPdf([
        'AILIS Artifact Tools PDF text-layer fixture',
        'The target phrase is: deterministic text evidence.',
        'Use page 1 text spans before considering OCR.'
    ]);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, pdf);
}

async function writeOfficeFixtures(docxPath, pptxPath) {
    const python = getArtifactPython();
    const script = String.raw`
import sys
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

docx_path = Path(sys.argv[1])
pptx_path = Path(sys.argv[2])
docx_path.parent.mkdir(parents=True, exist_ok=True)
pptx_path.parent.mkdir(parents=True, exist_ok=True)
asset_png = docx_path.parent / "fixture-asset.png"
try:
    from PIL import Image, ImageDraw
    image = Image.new("RGB", (96, 64), (16, 185, 129))
    draw = ImageDraw.Draw(image)
    draw.rectangle([48, 0, 95, 63], fill=(244, 120, 167))
    draw.line([0, 60, 95, 60], fill=(15, 23, 42), width=4)
    image.save(asset_png, "PNG")
except Exception:
    import base64
    asset_png.write_bytes(base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAD0lEQVR42mP8z8BQDwAFgwJ/l0A0kAAAAABJRU5ErkJggg=="))

def write_zip_docx(path):
    document = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>AILIS Artifact Tools DOCX fixture</w:t></w:r></w:p>
    <w:p><w:r><w:t>Layout gate should find this paragraph and the table below.</w:t></w:r></w:p>
    <w:tbl>
      <w:tr><w:tc><w:p><w:r><w:t>Metric</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>Value</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:p><w:r><w:t>Rows</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>2</w:t></w:r></w:p></w:tc></w:tr>
    </w:tbl>
    <w:p><w:r><w:t>END-DOCX-FIXTURE</w:t></w:r></w:p>
  </w:body>
</w:document>"""
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", """<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>""")
        z.writestr("_rels/.rels", """<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>""")
        z.writestr("word/document.xml", document)

def write_zip_pptx(path):
    slides = [
        ["AILIS Artifact Tools", "Slide inventory fixture"],
        ["Adapter Roundtrip", "Render contact sheet should see slide 2"]
    ]
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", """<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
</Types>""")
        z.writestr("_rels/.rels", """<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>""")
        z.writestr("ppt/presentation.xml", """<?xml version="1.0" encoding="UTF-8"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:sldIdLst><p:sldId id="256" r:id="rId1"/><p:sldId id="257" r:id="rId2"/></p:sldIdLst>
</p:presentation>""")
        z.writestr("ppt/_rels/presentation.xml.rels", """<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide2.xml"/>
</Relationships>""")
        for idx, texts in enumerate(slides, start=1):
            body = "".join(f"<a:p><a:r><a:t>{escape(text)}</a:t></a:r></a:p>" for text in texts)
            z.writestr(f"ppt/slides/slide{idx}.xml", f"""<?xml version="1.0" encoding="UTF-8"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <p:cSld><p:spTree><p:sp><p:txBody>{body}</p:txBody></p:sp></p:spTree></p:cSld>
</p:sld>""")

try:
    from docx import Document
    from docx.shared import Inches
    doc = Document()
    doc.add_heading("AILIS Artifact Tools DOCX fixture", level=1)
    doc.add_paragraph("Layout gate should find this paragraph and the table below.")
    table = doc.add_table(rows=2, cols=2)
    table.cell(0, 0).text = "Metric"
    table.cell(0, 1).text = "Value"
    table.cell(1, 0).text = "Rows"
    table.cell(1, 1).text = "2"
    doc.add_paragraph("Image inventory marker: DOCX-IMAGE-ASSET")
    doc.add_picture(str(asset_png), width=Inches(1.0))
    doc.add_paragraph("END-DOCX-FIXTURE")
    doc.save(docx_path)
    with zipfile.ZipFile(docx_path, "a", zipfile.ZIP_DEFLATED) as z:
        z.writestr("word/comments.xml", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:comments xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:comment w:id="0" w:author="AILIS Fixture" w:date="2026-01-01T00:00:00Z">
    <w:p><w:r><w:t>DOCX-COMMENT-ASSET artifact_search comment fixture.</w:t></w:r></w:p>
  </w:comment>
</w:comments>""")
except Exception:
    write_zip_docx(docx_path)

try:
    from pptx import Presentation
    from pptx.util import Inches
    prs = Presentation()
    for title, subtitle in [
        ("AILIS Artifact Tools", "Slide inventory fixture"),
        ("Adapter Roundtrip", "Render contact sheet should see slide 2"),
    ]:
        slide = prs.slides.add_slide(prs.slide_layouts[5])
        slide.shapes.title.text = title
        box = slide.shapes.add_textbox(914400, 1828800, 7315200, 914400)
        box.text_frame.text = subtitle
        if title == "AILIS Artifact Tools":
            table = slide.shapes.add_table(2, 2, Inches(0.7), Inches(4.2), Inches(4.2), Inches(1.0)).table
            table.cell(0, 0).text = "Metric"
            table.cell(0, 1).text = "Value"
            table.cell(1, 0).text = "Slides"
            table.cell(1, 1).text = "2"
            slide.shapes.add_picture(str(asset_png), Inches(6.2), Inches(4.2), width=Inches(0.8))
    prs.save(pptx_path)
except Exception:
    write_zip_pptx(pptx_path)
`;
    await execFileAsync(python, ['-c', script, docxPath, pptxPath], {
        cwd: repoRoot,
        maxBuffer: 1024 * 1024
    });
}

async function writeImageFixture(targetPath) {
    const python = getArtifactPython();
    const script = String.raw`
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

target = Path(sys.argv[1])
target.parent.mkdir(parents=True, exist_ok=True)
image = Image.new("RGB", (320, 180), (248, 250, 252))
draw = ImageDraw.Draw(image)
draw.rectangle([0, 0, 319, 179], fill=(248, 250, 252))
draw.rectangle([24, 28, 150, 150], fill=(16, 185, 129))
draw.rectangle([170, 28, 296, 150], fill=(244, 120, 167))
draw.line([24, 160, 296, 160], fill=(15, 23, 42), width=4)
try:
    font = ImageFont.truetype("arialbd.ttf", 22)
except Exception:
    font = ImageFont.load_default()
draw.text((34, 70), "AILIS", fill=(255, 255, 255), font=font)
draw.text((184, 70), "IMG", fill=(255, 255, 255), font=font)
image.save(target, "PNG")
`;
    await execFileAsync(python, ['-c', script, targetPath], {
        cwd: repoRoot,
        maxBuffer: 1024 * 1024
    });
}

async function main() {
    const releaseLock = await acquireFixtureLock();
    try {
        const xlsxPath = path.join(fixturesRoot, 'xlsx', 'map-path-color.xlsx');
        const xlsxModelPath = path.join(fixturesRoot, 'xlsx', 'formula-style-model.xlsx');
        const csvPath = path.join(fixturesRoot, 'csv', 'dirty-data.csv');
        const pdfPath = path.join(fixturesRoot, 'pdf', 'text-layer-report.pdf');
        const docxPath = path.join(fixturesRoot, 'docx', 'report-with-tables.docx');
        const pptxPath = path.join(fixturesRoot, 'pptx', 'template-edit.pptx');
        const imagePath = path.join(fixturesRoot, 'image', 'nonblank-swatch.png');

        await writeWorkbookFixture(xlsxPath);
        await writeXlsxModelFixture(xlsxModelPath);
        await writeCsvFixture(csvPath);
        await writePdfFixture(pdfPath);
        await writeOfficeFixtures(docxPath, pptxPath);
        await writeImageFixture(imagePath);

        const outputs = [xlsxPath, xlsxModelPath, csvPath, pdfPath, docxPath, pptxPath, imagePath].map((entry) =>
            path.relative(repoRoot, entry).replace(/\\/g, '/')
        );
        process.stdout.write(`${JSON.stringify({
            schema: 'ailis.artifact_tools.fixtures.v1',
            fixturesRoot: path.relative(repoRoot, fixturesRoot).replace(/\\/g, '/'),
            outputs
        }, null, 2)}\n`);
    } finally {
        await releaseLock();
    }
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
