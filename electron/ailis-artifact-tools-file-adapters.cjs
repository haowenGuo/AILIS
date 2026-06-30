const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');
const { promisify } = require('util');

const {
    createArtifactDiagnostic,
    normalizeFormat
} = require('./ailis-artifact-tools-model.cjs');

const execFileAsync = promisify(execFile);

const IMAGE_FORMATS = new Set(['png', 'jpg', 'jpeg', 'webp', 'tif', 'tiff', 'bmp', 'gif']);
const FILE_ADAPTER_FORMATS = new Set(['pdf', 'docx', 'pptx', ...IMAGE_FORMATS]);

function createDiagnostic(code, severity, message, details = {}) {
    return createArtifactDiagnostic({ code, severity, message, details });
}

function toAbsolutePath(sourcePath = '', repoRoot = process.cwd()) {
    if (!sourcePath) {
        return '';
    }
    return path.isAbsolute(sourcePath) ? sourcePath : path.resolve(repoRoot, sourcePath);
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

function clampNumber(value, fallback, min, max) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.max(min, Math.min(max, numeric));
}

function getBundledRuntimeRoot() {
    return path.join(os.homedir(), '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies');
}

function getArtifactPython() {
    const candidates = [
        process.env.AILIS_ARTIFACT_PYTHON,
        path.join(getBundledRuntimeRoot(), 'python', process.platform === 'win32' ? 'python.exe' : 'bin/python'),
        process.env.PYTHON,
        process.platform === 'win32' ? 'python.exe' : 'python3',
        'python'
    ].filter(Boolean);
    return candidates.find((candidate) => {
        if (candidate.includes(path.sep) || candidate.includes('/')) {
            return fs.existsSync(candidate);
        }
        return true;
    }) || 'python';
}

function buildWorkerEnv() {
    const nativeBin = path.join(getBundledRuntimeRoot(), 'bin');
    const env = { ...process.env };
    if (fs.existsSync(nativeBin)) {
        env.PATH = `${nativeBin}${path.delimiter}${env.PATH || ''}`;
    }
    return env;
}

function getPdftoppmCommand() {
    const root = getBundledRuntimeRoot();
    const candidates = [
        process.env.AILIS_ARTIFACT_PDFTOPPM,
        path.join(root, 'native', 'poppler', 'Library', 'bin', process.platform === 'win32' ? 'pdftoppm.exe' : 'pdftoppm'),
        'pdftoppm'
    ].filter(Boolean);
    return candidates.find((candidate) => {
        if (candidate.includes(path.sep) || candidate.includes('/')) {
            return fs.existsSync(candidate);
        }
        return true;
    }) || 'pdftoppm';
}

async function runPythonJson(script, args = [], options = {}) {
    const python = options.python || getArtifactPython();
    const { stdout } = await execFileAsync(python, ['-c', script, ...args.map((arg) => String(arg ?? ''))], {
        cwd: options.cwd || process.cwd(),
        env: buildWorkerEnv(),
        maxBuffer: options.maxBuffer || 16 * 1024 * 1024,
        timeout: clampNumber(options.timeoutMs || options.timeout_ms, 60000, 5000, 180000)
    });
    return JSON.parse(stdout);
}

function compactText(value = '', limit = 240) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (text.length <= limit) {
        return text;
    }
    return `${text.slice(0, limit - 3)}...`;
}

function normalizeDiagnostics(diagnostics = []) {
    return diagnostics.map((diagnostic) => createDiagnostic(
        diagnostic.code || 'artifact_file_diagnostic',
        diagnostic.severity || 'info',
        diagnostic.message || 'Artifact file diagnostic.',
        diagnostic.details || {}
    ));
}

function normalizeInspection(raw = {}, format = '', sourcePath = '') {
    return {
        format: raw.format || format,
        adapterId: raw.adapterId || format,
        sourcePath: raw.sourcePath || sourcePath,
        structure: raw.structure || {},
        view: raw.view || null,
        text: String(raw.text || ''),
        diagnostics: normalizeDiagnostics(raw.diagnostics || []),
        observation: raw.observation || null
    };
}

const PDF_INSPECT_SCRIPT = String.raw`
import importlib.util
import json
import sys
from pathlib import Path

source_path = Path(sys.argv[1])
max_text_chars = int(float(sys.argv[2] or "24000"))
diagnostics = []
pages = []
text_parts = []
metadata = {}
has_pdfplumber = importlib.util.find_spec("pdfplumber") is not None
has_pypdf = importlib.util.find_spec("pypdf") is not None

def diag(code, severity, message, details=None):
    diagnostics.append({"code": code, "severity": severity, "message": message, "details": details or {}})

if has_pypdf:
    try:
        from pypdf import PdfReader
        reader = PdfReader(str(source_path))
        metadata = {str(k).lstrip("/"): str(v) for k, v in (reader.metadata or {}).items()}
        for index, page in enumerate(reader.pages, start=1):
            media = page.mediabox
            text = page.extract_text() or ""
            annots = page.get("/Annots") or []
            image_count = 0
            try:
                resources = page.get("/Resources") or {}
                xobjects = resources.get("/XObject") or {}
                for obj in xobjects.values():
                    resolved = obj.get_object()
                    if resolved.get("/Subtype") == "/Image":
                        image_count += 1
            except Exception:
                pass
            text_parts.append(text)
            pages.append({
                "index": index,
                "width": float(media.width),
                "height": float(media.height),
                "rotation": int(page.get("/Rotate") or 0),
                "textLength": len(text),
                "wordCount": len(text.split()),
                "imageCount": image_count,
                "annotationCount": len(annots),
                "sampleText": text[:700],
                "spans": []
            })
    except Exception as exc:
        diag("pdf_pypdf_extract_failed", "warning", f"pypdf extraction failed: {exc}")
else:
    diag("pdf_pypdf_missing", "warning", "pypdf is not available; PDF structure extraction is limited.")

if has_pdfplumber:
    try:
        import pdfplumber
        with pdfplumber.open(str(source_path)) as pdf:
            if not pages:
                pages = []
            for index, page in enumerate(pdf.pages, start=1):
                words = page.extract_words()[:220]
                text = page.extract_text() or ""
                while len(pages) < index:
                    pages.append({"index": len(pages) + 1, "width": page.width, "height": page.height, "rotation": 0, "textLength": 0, "wordCount": 0, "imageCount": 0, "annotationCount": 0, "sampleText": "", "spans": []})
                pages[index - 1].update({
                    "width": float(page.width),
                    "height": float(page.height),
                    "textLength": len(text) or pages[index - 1].get("textLength", 0),
                    "wordCount": len(words) or pages[index - 1].get("wordCount", 0),
                    "imageCount": len(page.images),
                    "charCount": len(page.chars),
                    "spans": [{
                        "text": word.get("text", ""),
                        "x0": round(float(word.get("x0", 0)), 2),
                        "top": round(float(word.get("top", 0)), 2),
                        "x1": round(float(word.get("x1", 0)), 2),
                        "bottom": round(float(word.get("bottom", 0)), 2)
                    } for word in words[:80]]
                })
                if not text_parts:
                    text_parts.append(text)
    except Exception as exc:
        diag("pdf_pdfplumber_extract_failed", "warning", f"pdfplumber extraction failed: {exc}")

text = "\n".join(part for part in text_parts if part)
if not text.strip():
    diag("pdf_text_layer_missing", "warning", "PDF text-layer extraction returned no text; OCR/render fallback may be needed.")

print(json.dumps({
    "format": "pdf",
    "adapterId": "pdf",
    "sourcePath": str(source_path),
    "structure": {
        "pageCount": len(pages),
        "pages": pages,
        "metadata": metadata,
        "textSpanCount": sum(len(page.get("spans", [])) for page in pages),
        "hasTextLayer": bool(text.strip())
    },
    "view": {
        "pages": [{
            "index": page["index"],
            "size": [page.get("width", 0), page.get("height", 0)],
            "wordCount": page.get("wordCount", 0),
            "sampleText": page.get("sampleText", "")[:240]
        } for page in pages[:20]]
    },
    "text": text[:max_text_chars],
    "diagnostics": diagnostics
}, ensure_ascii=False))
`;

const OOXML_INSPECT_SCRIPT = String.raw`
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

source_path = Path(sys.argv[1])
format_name = sys.argv[2]
max_text_chars = int(float(sys.argv[3] or "24000"))
diagnostics = []
NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships"
}

def diag(code, severity, message, details=None):
    diagnostics.append({"code": code, "severity": severity, "message": message, "details": details or {}})

def local(tag):
    return tag.rsplit("}", 1)[-1] if "}" in tag else tag

def parse_xml(data):
    try:
        return ET.fromstring(data)
    except Exception:
        return None

def elem_text(elem):
    if elem is None:
        return ""
    values = []
    for child in elem.iter():
        if local(child.tag) == "t" and child.text:
            values.append(child.text)
    return "".join(values)

def read_entry(z, name):
    try:
        return z.read(name).decode("utf-8", "replace")
    except KeyError:
        return ""

def read_rels(z, names):
    rows = []
    for name in names:
        if not name.endswith(".rels"):
            continue
        root = parse_xml(read_entry(z, name))
        if root is None:
            continue
        for rel in root:
            rows.append({
                "source": name,
                "id": rel.attrib.get("Id", ""),
                "type": rel.attrib.get("Type", "").split("/")[-1],
                "target": rel.attrib.get("Target", ""),
                "targetMode": rel.attrib.get("TargetMode", "")
            })
    return rows

with zipfile.ZipFile(source_path) as z:
    names = z.namelist()
    rels = read_rels(z, names)
    media = [{
        "part": name,
        "extension": Path(name).suffix.lower().lstrip("."),
        "bytes": z.getinfo(name).file_size
    } for name in names if re.search(r"/media/", name)]
    content_types = read_entry(z, "[Content_Types].xml")

    if format_name == "docx":
        document_xml = read_entry(z, "word/document.xml")
        root = parse_xml(document_xml)
        if root is None:
            diag("docx_document_part_missing", "error", "DOCX archive does not contain a readable word/document.xml.")
            paragraphs = []
            tables = []
            doc_text = ""
        else:
            paragraphs = []
            for idx, para in enumerate(root.findall(".//w:p", NS), start=1):
                text = elem_text(para)
                if not text and len(paragraphs) >= 100:
                    continue
                style = ""
                style_el = para.find("./w:pPr/w:pStyle", NS)
                if style_el is not None:
                    style = style_el.attrib.get("{%s}val" % NS["w"], "")
                paragraphs.append({"index": idx, "style": style, "text": text[:900], "runCount": len(para.findall(".//w:r", NS))})
            tables = []
            for tidx, tbl in enumerate(root.findall(".//w:tbl", NS), start=1):
                rows = []
                for tr in tbl.findall("./w:tr", NS):
                    rows.append([elem_text(tc) for tc in tr.findall("./w:tc", NS)])
                width = max([len(row) for row in rows] or [0])
                tables.append({"index": tidx, "rowCount": len(rows), "columnCount": width, "rows": rows[:10]})
            doc_text = "\n".join(p["text"] for p in paragraphs if p["text"])

        comments = []
        comments_root = parse_xml(read_entry(z, "word/comments.xml"))
        if comments_root is not None:
            for comment in comments_root.findall(".//w:comment", NS):
                comments.append({
                    "id": comment.attrib.get("{%s}id" % NS["w"], ""),
                    "author": comment.attrib.get("{%s}author" % NS["w"], ""),
                    "date": comment.attrib.get("{%s}date" % NS["w"], ""),
                    "text": elem_text(comment)
                })

        header_footer_parts = [name for name in names if re.match(r"word/(header|footer)\d+\.xml$", name)]
        header_footer_text = []
        for name in header_footer_parts:
            xml = read_entry(z, name)
            header_footer_text.append({"part": name, "text": elem_text(parse_xml(xml))})

        text = "\n".join([doc_text, *[c["text"] for c in comments], *[p["text"] for p in header_footer_text]]).strip()
        print(json.dumps({
            "format": "docx",
            "adapterId": "docx",
            "sourcePath": str(source_path),
            "structure": {
                "partCount": len(names),
                "paragraphCount": len(paragraphs),
                "tableCount": len(tables),
                "textRunCount": len(re.findall(r"<w:t\b", document_xml)),
                "commentCount": len(comments),
                "imageCount": len(media),
                "relationshipCount": len(rels),
                "headerFooterCount": len(header_footer_parts),
                "paragraphs": paragraphs[:120],
                "tables": tables,
                "comments": comments,
                "images": media,
                "relationships": rels[:240],
                "headersFooters": header_footer_text
            },
            "view": {
                "paragraphs": paragraphs[:20],
                "tables": tables[:8],
                "comments": comments[:20],
                "images": media[:20]
            },
            "text": text[:max_text_chars],
            "diagnostics": diagnostics
        }, ensure_ascii=False))
    else:
        presentation_xml = read_entry(z, "ppt/presentation.xml")
        presentation_root = parse_xml(presentation_xml)
        slide_size = {"width": 0, "height": 0}
        if presentation_root is not None:
            size_el = presentation_root.find(".//p:sldSz", NS)
            if size_el is not None:
                slide_size = {"width": int(size_el.attrib.get("cx", "0") or 0), "height": int(size_el.attrib.get("cy", "0") or 0)}
        slide_names = sorted([name for name in names if re.match(r"ppt/slides/slide\d+\.xml$", name)], key=lambda n: int(re.search(r"slide(\d+)\.xml$", n).group(1)))
        slides = []
        text_parts = []
        image_total = 0
        table_total = 0
        for idx, name in enumerate(slide_names, start=1):
            xml = read_entry(z, name)
            root = parse_xml(xml)
            texts = []
            if root is not None:
                texts = [el.text or "" for el in root.findall(".//a:t", NS)]
                shape_count = len(root.findall(".//p:sp", NS))
                picture_count = len(root.findall(".//p:pic", NS))
                table_count = len(root.findall(".//a:tbl", NS))
            else:
                shape_count = 0
                picture_count = 0
                table_count = 0
            slide_rels_name = name.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels"
            slide_rels = [rel for rel in rels if rel["source"] == slide_rels_name]
            slide_images = [rel for rel in slide_rels if rel["type"] == "image"]
            image_total += max(picture_count, len(slide_images))
            table_total += table_count
            text = "\n".join(texts)
            text_parts.append(text)
            slides.append({
                "index": idx,
                "part": name,
                "text": text[:1200],
                "texts": texts,
                "shapeCount": shape_count,
                "pictureCount": picture_count,
                "tableCount": table_count,
                "relationshipCount": len(slide_rels),
                "imageRelationships": slide_images
            })
        if not slides:
            diag("pptx_slides_missing", "error", "PPTX archive does not contain ppt/slides/slide*.xml parts.")
        text = "\n".join(part for part in text_parts if part)
        print(json.dumps({
            "format": "pptx",
            "adapterId": "pptx",
            "sourcePath": str(source_path),
            "structure": {
                "partCount": len(names),
                "slideCount": len(slides),
                "slideSize": slide_size,
                "slides": slides,
                "imageCount": image_total,
                "mediaCount": len(media),
                "tableCount": table_total,
                "relationshipCount": len(rels),
                "media": media,
                "relationships": rels[:260]
            },
            "view": {
                "slides": [{
                    "index": slide["index"],
                    "texts": slide["texts"][:12],
                    "shapeCount": slide["shapeCount"],
                    "pictureCount": slide["pictureCount"],
                    "tableCount": slide["tableCount"]
                } for slide in slides[:60]],
                "media": media[:30]
            },
            "text": text[:max_text_chars],
            "diagnostics": diagnostics
        }, ensure_ascii=False))
`;

const IMAGE_INSPECT_SCRIPT = String.raw`
import json
import sys
from pathlib import Path
from PIL import Image, ImageStat

source_path = Path(sys.argv[1])
diagnostics = []

def diag(code, severity, message, details=None):
    diagnostics.append({"code": code, "severity": severity, "message": message, "details": details or {}})

with Image.open(source_path) as image:
    image.load()
    width, height = image.size
    mode = image.mode
    fmt = (image.format or source_path.suffix.lstrip(".")).lower()
    exif_count = 0
    try:
        exif_count = len(image.getexif() or {})
    except Exception:
        exif_count = 0
    sample = image.convert("RGBA")
    sample.thumbnail((160, 160))
    pixels = list(sample.getdata())
    first = pixels[0] if pixels else (0, 0, 0, 0)
    changed = sum(1 for px in pixels if px != first)
    non_blank_ratio = changed / max(1, len(pixels))
    colors = sample.getcolors(maxcolors=160 * 160) or []
    colors = sorted(colors, reverse=True)[:10]
    dominant = [{
        "count": count,
        "rgb": "%02X%02X%02X" % color[:3],
        "alpha": color[3]
    } for count, color in colors]
    stat = ImageStat.Stat(sample.convert("RGB"))
    blank = len(colors) <= 1 or non_blank_ratio < 0.001
    if blank:
        diag("image_appears_blank", "warning", "Image sampled pixels appear blank or nearly uniform.")
    print(json.dumps({
        "format": fmt,
        "adapterId": "image",
        "sourcePath": str(source_path),
        "structure": {
            "width": width,
            "height": height,
            "mode": mode,
            "imageFormat": fmt,
            "bytes": source_path.stat().st_size,
            "hasAlpha": "A" in mode,
            "exifCount": exif_count,
            "dominantColors": dominant,
            "visualCheck": {
                "blank": blank,
                "uniqueSampledColors": len(colors),
                "nonBlankRatio": non_blank_ratio,
                "meanRgb": [round(v, 2) for v in stat.mean]
            }
        },
        "view": {
            "size": [width, height],
            "mode": mode,
            "dominantColors": dominant[:6],
            "visualCheck": {
                "blank": blank,
                "uniqueSampledColors": len(colors),
                "nonBlankRatio": non_blank_ratio
            }
        },
        "text": "",
        "diagnostics": diagnostics
    }, ensure_ascii=False))
`;

async function inspectPdfArtifact(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const raw = await runPythonJson(PDF_INSPECT_SCRIPT, [
        sourcePath,
        String(input.maxTextChars || input.max_text_chars || 24000)
    ], { cwd: input.repoRoot || process.cwd(), timeoutMs: input.timeoutMs || input.timeout_ms });
    return normalizeInspection(raw, 'pdf', sourcePath);
}

async function inspectOoxmlArtifact(input = {}, format) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const raw = await runPythonJson(OOXML_INSPECT_SCRIPT, [
        sourcePath,
        format,
        String(input.maxTextChars || input.max_text_chars || 24000)
    ], { cwd: input.repoRoot || process.cwd(), timeoutMs: input.timeoutMs || input.timeout_ms });
    return normalizeInspection(raw, format, sourcePath);
}

async function inspectImageArtifact(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const raw = await runPythonJson(IMAGE_INSPECT_SCRIPT, [sourcePath], {
        cwd: input.repoRoot || process.cwd(),
        timeoutMs: input.timeoutMs || input.timeout_ms
    });
    return normalizeInspection(raw, 'image', sourcePath);
}

async function inspectFileArtifact(input = {}) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const format = normalizeFormat(input.format, sourcePath);
    if (format === 'pdf') {
        return inspectPdfArtifact({ ...input, sourcePath });
    }
    if (format === 'docx') {
        return inspectOoxmlArtifact({ ...input, sourcePath }, 'docx');
    }
    if (format === 'pptx') {
        return inspectOoxmlArtifact({ ...input, sourcePath }, 'pptx');
    }
    if (IMAGE_FORMATS.has(format)) {
        const inspection = await inspectImageArtifact({ ...input, sourcePath });
        return { ...inspection, format, adapterId: 'image' };
    }
    throw new Error(`No file artifact adapter for format: ${format}`);
}

function pushCandidate(candidates, candidate) {
    candidates.push({
        ref: candidate.ref || candidate.fullRef || candidate.name || candidate.part || `${candidate.kind}:${candidates.length + 1}`,
        kind: candidate.kind || 'text',
        text: compactText(candidate.text || candidate.comment || candidate.sampleText || candidate.name || candidate.part || ''),
        ...candidate
    });
}

function buildSearchCandidates(inspection = {}) {
    const structure = inspection.structure || {};
    const candidates = [];
    if (inspection.format === 'pdf') {
        for (const page of structure.pages || []) {
            pushCandidate(candidates, {
                kind: 'text',
                ref: `page:${page.index}`,
                page: page.index,
                text: page.sampleText || '',
                wordCount: page.wordCount,
                coordinates: (page.spans || []).slice(0, 12)
            });
            for (const span of page.spans || []) {
                pushCandidate(candidates, {
                    kind: 'span',
                    ref: `page:${page.index}@${span.x0},${span.top}`,
                    page: page.index,
                    text: span.text,
                    coordinates: span
                });
            }
            if (page.imageCount) {
                pushCandidate(candidates, { kind: 'image', ref: `page:${page.index}:images`, page: page.index, text: `${page.imageCount} image(s)` });
            }
        }
    } else if (inspection.format === 'docx') {
        for (const para of structure.paragraphs || []) {
            pushCandidate(candidates, { kind: 'paragraph', ref: `paragraph:${para.index}`, text: para.text, style: para.style, runCount: para.runCount });
        }
        for (const table of structure.tables || []) {
            pushCandidate(candidates, { kind: 'table', ref: `table:${table.index}`, text: (table.rows || []).flat().join(' | '), rowCount: table.rowCount, columnCount: table.columnCount, rows: table.rows });
        }
        for (const comment of structure.comments || []) {
            pushCandidate(candidates, { kind: 'comment', ref: `comment:${comment.id}`, text: comment.text, author: comment.author, date: comment.date });
        }
        for (const image of structure.images || []) {
            pushCandidate(candidates, { kind: 'image', ref: image.part, part: image.part, text: image.part, bytes: image.bytes, extension: image.extension });
        }
        for (const rel of structure.relationships || []) {
            pushCandidate(candidates, { kind: 'relationship', ref: `${rel.source}#${rel.id}`, text: `${rel.type} ${rel.target}`, ...rel });
        }
    } else if (inspection.format === 'pptx') {
        for (const slide of structure.slides || []) {
            pushCandidate(candidates, { kind: 'slide', ref: `slide:${slide.index}`, slide: slide.index, text: slide.text || (slide.texts || []).join('\n'), shapeCount: slide.shapeCount, pictureCount: slide.pictureCount, tableCount: slide.tableCount });
            for (const [index, text] of (slide.texts || []).entries()) {
                pushCandidate(candidates, { kind: 'text', ref: `slide:${slide.index}:text:${index + 1}`, slide: slide.index, text });
            }
            for (const rel of slide.imageRelationships || []) {
                pushCandidate(candidates, { kind: 'image', ref: `slide:${slide.index}:${rel.id}`, slide: slide.index, text: rel.target, ...rel });
            }
            if (slide.tableCount) {
                pushCandidate(candidates, { kind: 'table', ref: `slide:${slide.index}:tables`, slide: slide.index, text: `${slide.tableCount} table(s)` });
            }
        }
        for (const media of structure.media || []) {
            pushCandidate(candidates, { kind: 'media', ref: media.part, text: media.part, ...media });
        }
    } else if (inspection.adapterId === 'image' || IMAGE_FORMATS.has(inspection.format)) {
        pushCandidate(candidates, {
            kind: 'metadata',
            ref: 'image:metadata',
            text: `${structure.imageFormat || inspection.format} ${structure.width}x${structure.height} ${structure.mode}`,
            width: structure.width,
            height: structure.height,
            mode: structure.mode,
            imageFormat: structure.imageFormat
        });
        for (const color of structure.dominantColors || []) {
            pushCandidate(candidates, {
                kind: 'color',
                ref: `image:color:${color.rgb}`,
                text: color.rgb,
                rgb: color.rgb,
                count: color.count,
                alpha: color.alpha
            });
        }
        pushCandidate(candidates, {
            kind: 'visual',
            ref: 'image:visualCheck',
            text: JSON.stringify(structure.visualCheck || {}),
            ...(structure.visualCheck || {})
        });
    }
    return candidates;
}

function candidateMatches(candidate, kind, query, fillRgb) {
    const normalizedKind = String(kind || 'all').toLowerCase();
    const candidateKind = String(candidate.kind || '').toLowerCase();
    const kindOk = normalizedKind === 'all'
        || normalizedKind === candidateKind
        || (normalizedKind === 'text' && ['paragraph', 'slide', 'span'].includes(candidateKind))
        || (normalizedKind === 'inventory' && ['image', 'media', 'relationship', 'metadata', 'visual'].includes(candidateKind));
    if (!kindOk) {
        return false;
    }
    if (fillRgb) {
        const expected = normalizeHex(fillRgb);
        const actual = normalizeHex(candidate.rgb || candidate.text || '');
        return actual === expected;
    }
    const normalizedQuery = String(query || '').trim().toLowerCase();
    if (!normalizedQuery) {
        return true;
    }
    const haystack = [
        candidate.ref,
        candidate.kind,
        candidate.text,
        candidate.name,
        candidate.part,
        candidate.target,
        candidate.imageFormat,
        JSON.stringify(candidate.coordinates || '')
    ].filter(Boolean).join('\n').toLowerCase();
    return haystack.includes(normalizedQuery);
}

async function indexFileArtifact(input = {}) {
    const inspection = input.inspection || await inspectFileArtifact(input);
    const candidates = buildSearchCandidates(inspection);
    return {
        schema: 'ailis.file_artifact.index.v1',
        adapterId: inspection.adapterId,
        format: inspection.format,
        sourcePath: inspection.sourcePath,
        summary: {
            candidateCount: candidates.length,
            textLength: inspection.text.length,
            pageCount: inspection.structure.pageCount || 0,
            paragraphCount: inspection.structure.paragraphCount || 0,
            slideCount: inspection.structure.slideCount || 0,
            imageCount: inspection.structure.imageCount || inspection.structure.mediaCount || 0,
            tableCount: inspection.structure.tableCount || 0,
            commentCount: inspection.structure.commentCount || 0
        },
        candidates,
        observation: {
            schema: 'ailis.artifact_tools.compact_observation.v1',
            action: 'index',
            format: inspection.format,
            sourcePath: inspection.sourcePath,
            summary: {
                candidateCount: candidates.length,
                textLength: inspection.text.length
            },
            candidates: candidates.slice(0, clampNumber(input.limit, 20, 1, 80)).map((candidate) => ({
                ref: candidate.ref,
                kind: candidate.kind,
                text: compactText(candidate.text, 180)
            }))
        },
        diagnostics: inspection.diagnostics || []
    };
}

async function searchFileArtifact(input = {}) {
    const inspection = input.inspection || await inspectFileArtifact(input);
    const kind = String(input.searchKind || input.search_kind || input.kind || 'all').toLowerCase();
    const query = String(input.query || input.text || input.term || '').trim();
    const fillRgb = input.fillRgb || input.fill_rgb || input.rgb || '';
    const limit = clampNumber(input.limit, 20, 1, 100);
    const candidates = buildSearchCandidates(inspection);
    const matches = candidates
        .filter((candidate) => candidateMatches(candidate, kind, query, fillRgb))
        .slice(0, limit);
    return {
        schema: 'ailis.file_artifact.search.v1',
        adapterId: inspection.adapterId,
        format: inspection.format,
        sourcePath: inspection.sourcePath,
        kind,
        query,
        fillRgb: fillRgb ? normalizeHex(fillRgb) : '',
        returned: matches.length,
        totalCandidates: candidates.length,
        matches,
        observation: {
            schema: 'ailis.artifact_tools.compact_observation.v1',
            action: 'search',
            format: inspection.format,
            sourcePath: inspection.sourcePath,
            query,
            candidates: matches.map((candidate) => ({
                ref: candidate.ref,
                kind: candidate.kind,
                text: compactText(candidate.text, 220),
                page: candidate.page,
                slide: candidate.slide,
                coordinates: candidate.coordinates
            }))
        }
    };
}

const STRUCTURE_RENDER_SCRIPT = String.raw`
import json
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

input_path = Path(sys.argv[1])
output_path = Path(sys.argv[2])
payload = json.loads(input_path.read_text(encoding="utf-8"))
mode = payload.get("mode", "artifact")
inspection = payload.get("inspection", {})
structure = inspection.get("structure", {})

width = int(payload.get("width") or 1100)
height = int(payload.get("height") or 760)
image = Image.new("RGB", (width, height), (248, 250, 252))
draw = ImageDraw.Draw(image)
try:
    font = ImageFont.truetype("arial.ttf", 20)
    small = ImageFont.truetype("arial.ttf", 15)
    bold = ImageFont.truetype("arialbd.ttf", 24)
    tiny = ImageFont.truetype("arial.ttf", 12)
except Exception:
    font = ImageFont.load_default()
    small = font
    bold = font
    tiny = font

def text(x, y, value, fnt=small, fill=(15, 23, 42)):
    draw.text((x, y), str(value)[:140], fill=fill, font=fnt)

draw.rectangle([0, 0, width, 58], fill=(15, 23, 42))
text(24, 17, payload.get("title", "Artifact Preview"), bold, (255, 255, 255))

if mode == "pptx":
    slides = structure.get("slides", [])[:12]
    box_w, box_h = 330, 185
    gap = 24
    x0, y0 = 24, 84
    for i, slide in enumerate(slides):
        col = i % 3
        row = i // 3
        x = x0 + col * (box_w + gap)
        y = y0 + row * (box_h + gap)
        draw.rectangle([x, y, x + box_w, y + box_h], fill=(255, 255, 255), outline=(148, 163, 184), width=2)
        text(x + 14, y + 12, f"Slide {slide.get('index')}", font)
        for j, line in enumerate((slide.get("texts") or [])[:5]):
            text(x + 14, y + 48 + j * 24, line, small)
        footer = f"shapes={slide.get('shapeCount', 0)} images={slide.get('pictureCount', 0)} tables={slide.get('tableCount', 0)}"
        text(x + 14, y + box_h - 26, footer, tiny, (71, 85, 105))
else:
    y = 86
    metrics = []
    for key in ["pageCount", "paragraphCount", "tableCount", "commentCount", "imageCount", "relationshipCount", "width", "height"]:
        if key in structure:
            metrics.append(f"{key}: {structure.get(key)}")
    text(24, y, " | ".join(metrics), font)
    y += 46
    if mode == "docx":
        text(24, y, "Paragraphs", font)
        y += 28
        for para in structure.get("paragraphs", [])[:14]:
            text(44, y, f"{para.get('index')}. {para.get('text', '')}", small)
            y += 24
        if structure.get("tables"):
            y += 12
            text(24, y, "Tables", font)
            y += 28
            for table in structure.get("tables", [])[:4]:
                text(44, y, f"table {table.get('index')}: {table.get('rowCount')}x{table.get('columnCount')} " + " | ".join(sum(table.get("rows", [])[:2], [])), small)
                y += 24
        if structure.get("comments"):
            y += 12
            text(24, y, "Comments", font)
            y += 28
            for comment in structure.get("comments", [])[:5]:
                text(44, y, f"comment {comment.get('id')}: {comment.get('text', '')}", small)
                y += 24
    elif mode == "pdf":
        for page in structure.get("pages", [])[:10]:
            draw.rectangle([24, y, width - 24, y + 88], fill=(255, 255, 255), outline=(203, 213, 225))
            text(42, y + 14, f"Page {page.get('index')} {int(page.get('width', 0))}x{int(page.get('height', 0))}", font)
            text(42, y + 48, page.get("sampleText", ""), small)
            y += 108
    else:
        text(24, y, json.dumps(structure, ensure_ascii=False)[:900], small)

output_path.parent.mkdir(parents=True, exist_ok=True)
image.save(output_path, "PNG")
pixels = list(image.getdata())
step = max(1, len(pixels) // 20000)
sample = pixels[::step]
background = (248, 250, 252)
non_blank = sum(1 for pixel in sample if pixel != background)
unique = len(set(sample))
print(json.dumps({
    "outputPath": str(output_path),
    "width": width,
    "height": height,
    "uniqueSampledColors": unique,
    "nonBlankRatio": non_blank / max(1, len(sample)),
    "blank": unique <= 1
}, ensure_ascii=False))
`;

const IMAGE_RENDER_SCRIPT = String.raw`
import json
import sys
from pathlib import Path
from PIL import Image

source_path = Path(sys.argv[1])
output_path = Path(sys.argv[2])
max_size = int(float(sys.argv[3] or "900"))
with Image.open(source_path) as image:
    image = image.convert("RGBA")
    image.thumbnail((max_size, max_size))
    background = Image.new("RGBA", image.size, (248, 250, 252, 255))
    background.alpha_composite(image)
    rgb = background.convert("RGB")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    rgb.save(output_path, "PNG")
    pixels = list(rgb.getdata())
    step = max(1, len(pixels) // 20000)
    sample = pixels[::step]
    first = sample[0] if sample else (248, 250, 252)
    changed = sum(1 for pixel in sample if pixel != first)
    print(json.dumps({
        "outputPath": str(output_path),
        "width": rgb.width,
        "height": rgb.height,
        "uniqueSampledColors": len(set(sample)),
        "nonBlankRatio": changed / max(1, len(sample)),
        "blank": len(set(sample)) <= 1
    }, ensure_ascii=False))
`;

async function renderPdfToPng(input = {}, inspection = null) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const caseId = input.caseId || path.basename(sourcePath, path.extname(sourcePath));
    const outputDir = toAbsolutePath(input.outputDir || path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot);
    const renderDir = path.join(outputDir, 'renders');
    await fsp.mkdir(renderDir, { recursive: true });
    const page = clampNumber(input.page || input.pageNumber || input.page_number, 1, 1, 10000);
    const prefix = path.join(renderDir, `${caseId}-page-${page}`);
    const outputPath = `${prefix}.png`;
    const args = ['-png', '-singlefile', '-f', String(page), '-l', String(page), sourcePath, prefix];
    try {
        await execFileAsync(getPdftoppmCommand(), args, {
            cwd: input.repoRoot || process.cwd(),
            env: buildWorkerEnv(),
            maxBuffer: 4 * 1024 * 1024,
            timeout: clampNumber(input.timeoutMs || input.timeout_ms, 60000, 5000, 180000)
        });
        const visual = await inspectImageArtifact({ sourcePath: outputPath, repoRoot: input.repoRoot });
        const stat = await fsp.stat(outputPath);
        return {
            passed: stat.size > 128 && visual.structure.visualCheck?.blank !== true,
            outputPath,
            renderKind: 'pdf_page_png_poppler',
            bytes: stat.size,
            width: visual.structure.width,
            height: visual.structure.height,
            page,
            visualCheck: visual.structure.visualCheck,
            diagnostics: visual.structure.visualCheck?.blank
                ? [createDiagnostic('pdf_page_render_blank', 'error', 'Rendered PDF page appears blank.', { outputPath, page })]
                : []
        };
    } catch (error) {
        const fallbackInspection = inspection || await inspectPdfArtifact({ ...input, sourcePath });
        return renderStructurePng({ ...input, inspection: fallbackInspection, mode: 'pdf', renderKind: 'pdf_structure_png_pillow', title: 'PDF Structural Preview' });
    }
}

async function renderStructurePng(input = {}) {
    const inspection = input.inspection;
    const caseId = input.caseId || path.basename(inspection.sourcePath, path.extname(inspection.sourcePath));
    const outputDir = toAbsolutePath(input.outputDir || path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot);
    const renderDir = path.join(outputDir, 'renders');
    await fsp.mkdir(renderDir, { recursive: true });
    const mode = input.mode || inspection.format;
    const outputPath = input.outputPath
        ? toAbsolutePath(input.outputPath, input.repoRoot)
        : path.join(renderDir, `${caseId}-${mode}-preview.png`);
    const payloadPath = `${outputPath}.input.json`;
    const payload = {
        mode,
        title: input.title || `${String(inspection.format || mode).toUpperCase()} Structural Preview`,
        inspection: {
            format: inspection.format,
            structure: inspection.structure,
            text: inspection.text
        },
        width: input.width || 1100,
        height: input.height || (mode === 'pptx' ? 760 : 900)
    };
    await fsp.writeFile(payloadPath, JSON.stringify(payload), 'utf8');
    const metadata = await runPythonJson(STRUCTURE_RENDER_SCRIPT, [payloadPath, outputPath], {
        cwd: input.repoRoot || process.cwd(),
        timeoutMs: input.timeoutMs || input.timeout_ms
    });
    const stat = await fsp.stat(outputPath);
    return {
        passed: stat.size > 128 && metadata.blank !== true,
        outputPath,
        renderKind: input.renderKind || `${mode}_structure_png_pillow`,
        bytes: stat.size,
        width: metadata.width,
        height: metadata.height,
        visualCheck: {
            blank: metadata.blank === true,
            uniqueSampledColors: metadata.uniqueSampledColors,
            nonBlankRatio: metadata.nonBlankRatio
        },
        diagnostics: [
            ...(metadata.blank ? [createDiagnostic(`${mode}_png_render_blank`, 'error', `${mode.toUpperCase()} PNG render appears blank.`, { outputPath })] : []),
            ...(['docx', 'pptx'].includes(mode) ? [createDiagnostic(
                `${mode}_office_renderer_unavailable`,
                'warning',
                `LibreOffice/soffice is not available in this environment; produced deterministic structural PNG preview instead of native Office layout render.`
            )] : [])
        ]
    };
}

async function renderImageToPng(input = {}, inspection = null) {
    const sourcePath = toAbsolutePath(input.sourcePath || input.path, input.repoRoot);
    const caseId = input.caseId || path.basename(sourcePath, path.extname(sourcePath));
    const outputDir = toAbsolutePath(input.outputDir || path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot);
    const renderDir = path.join(outputDir, 'renders');
    await fsp.mkdir(renderDir, { recursive: true });
    const outputPath = input.outputPath
        ? toAbsolutePath(input.outputPath, input.repoRoot)
        : path.join(renderDir, `${caseId}-image-preview.png`);
    const metadata = await runPythonJson(IMAGE_RENDER_SCRIPT, [
        sourcePath,
        outputPath,
        String(input.maxSize || input.max_size || 900)
    ], { cwd: input.repoRoot || process.cwd(), timeoutMs: input.timeoutMs || input.timeout_ms });
    const stat = await fsp.stat(outputPath);
    return {
        passed: stat.size > 128 && metadata.blank !== true,
        outputPath,
        renderKind: 'image_png_pillow',
        bytes: stat.size,
        width: metadata.width,
        height: metadata.height,
        visualCheck: {
            blank: metadata.blank === true,
            uniqueSampledColors: metadata.uniqueSampledColors,
            nonBlankRatio: metadata.nonBlankRatio
        },
        diagnostics: metadata.blank
            ? [createDiagnostic('image_png_render_blank', 'error', 'Rendered image preview appears blank.', { outputPath })]
            : []
    };
}

async function renderFileArtifactPreview(input = {}) {
    const inspection = input.inspection || await inspectFileArtifact(input);
    if (inspection.format === 'pdf') {
        return renderPdfToPng({ ...input, sourcePath: inspection.sourcePath }, inspection);
    }
    if (inspection.format === 'docx') {
        return renderStructurePng({ ...input, inspection, mode: 'docx', title: 'DOCX Structural Preview' });
    }
    if (inspection.format === 'pptx') {
        return renderStructurePng({ ...input, inspection, mode: 'pptx', renderKind: 'pptx_contact_sheet_png_pillow', title: 'PPTX Contact Sheet Preview' });
    }
    if (inspection.adapterId === 'image' || IMAGE_FORMATS.has(inspection.format)) {
        return renderImageToPng({ ...input, sourcePath: inspection.sourcePath }, inspection);
    }
    throw new Error(`No render handler for file artifact format: ${inspection.format}`);
}

module.exports = {
    FILE_ADAPTER_FORMATS,
    IMAGE_FORMATS,
    buildSearchCandidates,
    indexFileArtifact,
    inspectFileArtifact,
    renderFileArtifactPreview,
    searchFileArtifact
};
