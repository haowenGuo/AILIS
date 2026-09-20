// Shared by Markdown code blocks and registered HTML artifacts.
const rasterData = value => /^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value || '');
const node = (tag, className) => { const el = document.createElement(tag); el.className = className; return el; };
// Inert template parsing + tag/attribute allowlists + opaque sandbox + CSP.
// Preview is not an app webview: no scripts, forms, navigation, local bridge, or network.
export function createStaticHtmlPreview(source) {
    if (typeof source !== 'string' || source.length > 1024 * 1024) throw new Error('HTML 预览上限为 1 MiB 字符');
    const template = document.createElement('template'); template.innerHTML = source;
    const allowed = new Set('html head body title style main article section header footer nav aside div span p h1 h2 h3 h4 h5 h6 ul ol li dl dt dd table thead tbody tfoot tr th td caption colgroup col pre code blockquote strong em b i u s small sub sup br hr a img figure figcaption details summary button'.split(' '));
    for (const element of template.content.querySelectorAll('*')) {
        if (!allowed.has(element.localName) || element.namespaceURI !== 'http://www.w3.org/1999/xhtml') { element.remove(); continue; }
        for (const attribute of [...element.attributes]) {
            const name = attribute.name;
            const safe = ['class', 'style', 'title', 'lang', 'dir', 'colspan', 'rowspan', 'width', 'height', 'alt', 'open'].includes(name)
                || (name === 'src' && element.localName === 'img' && rasterData(attribute.value));
            if (!safe) element.removeAttribute(name);
        }
        if (element.localName === 'button') element.disabled = true;
    }
    const iframe = node('iframe', 'task-html-preview'); iframe.title = 'HTML 静态预览';
    iframe.setAttribute('sandbox', ''); iframe.referrerPolicy = 'no-referrer';
    const policy = "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
    iframe.srcdoc = `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><style>body{margin:20px;overflow-wrap:anywhere;font:16px/1.6 system-ui,sans-serif}img{max-width:100%}pre{overflow:auto}</style>${template.innerHTML}`;
    return iframe;
}
