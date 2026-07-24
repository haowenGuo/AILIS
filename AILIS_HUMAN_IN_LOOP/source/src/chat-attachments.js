const MAX_VISION_ATTACHMENTS = 3;
const MAX_FILE_ATTACHMENTS = 12;

function normalizeString(value, fallbackValue = '') {
    if (typeof value !== 'string') {
        return fallbackValue;
    }
    const trimmedValue = value.trim();
    return trimmedValue || fallbackValue;
}

function basenameFromPath(filePath = '') {
    const normalizedPath = String(filePath || '').replace(/\\/g, '/');
    return normalizedPath.split('/').filter(Boolean).pop() || '';
}

export function formatAttachmentBytes(bytes) {
    const numericValue = Number(bytes);
    if (!Number.isFinite(numericValue) || numericValue < 0) {
        return '';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = numericValue;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }
    return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function normalizeVisionAttachment(attachment) {
    if (!attachment?.dataUrl) {
        return null;
    }
    const mimeType = normalizeString(attachment.mimeType, 'image/png');
    if (!mimeType.startsWith('image/')) {
        return null;
    }
    return {
        type: 'vision',
        id: normalizeString(attachment.id),
        source: normalizeString(attachment.source),
        label: normalizeString(attachment.label, '截图'),
        dataUrl: String(attachment.dataUrl || ''),
        thumbnailDataUrl: String(attachment.thumbnailDataUrl || attachment.dataUrl || ''),
        mimeType,
        width: Number(attachment.width) || 0,
        height: Number(attachment.height) || 0,
        createdAt: normalizeString(attachment.createdAt)
    };
}

export function normalizeFileAttachment(attachment) {
    const filePath = normalizeString(
        attachment?.path ||
            attachment?.filePath ||
            attachment?.absolutePath ||
            attachment?.localPath
    );
    if (!filePath) {
        return null;
    }

    const name = normalizeString(
        attachment.name ||
            attachment.filename ||
            attachment.fileName ||
            attachment.label,
        basenameFromPath(filePath) || '文件'
    );
    const rawSize = Number(attachment.size ?? attachment.bytes);
    const size = Number.isFinite(rawSize) && rawSize >= 0 ? rawSize : 0;
    const extension = normalizeString(
        attachment.extension,
        name.includes('.') ? name.slice(name.lastIndexOf('.')).toLowerCase() : ''
    );
    const kind = normalizeString(attachment.kind || attachment.entryType || attachment.typeHint, 'file');

    return {
        type: 'file',
        id: normalizeString(attachment.id, `file-${filePath}`),
        source: normalizeString(attachment.source, 'local-file'),
        label: normalizeString(attachment.label, name),
        name,
        path: filePath,
        mimeType: normalizeString(
            attachment.mimeType ||
                attachment.mediaType ||
                (attachment.type && attachment.type !== 'file' ? attachment.type : '')
        ),
        extension,
        kind,
        size,
        sizeText: normalizeString(attachment.sizeText, formatAttachmentBytes(size)),
        createdAt: normalizeString(attachment.createdAt),
        modifiedAt: normalizeString(attachment.modifiedAt || attachment.mtime || attachment.lastModified)
    };
}

export function splitChatAttachments(attachments = []) {
    const result = {
        vision: [],
        files: []
    };
    if (!Array.isArray(attachments)) {
        return result;
    }

    for (const attachment of attachments) {
        const explicitType = normalizeString(attachment?.type).toLowerCase();
        if (explicitType === 'vision' || attachment?.dataUrl) {
            const visionAttachment = normalizeVisionAttachment(attachment);
            if (visionAttachment && result.vision.length < MAX_VISION_ATTACHMENTS) {
                result.vision.push(visionAttachment);
            }
            continue;
        }

        const fileAttachment = normalizeFileAttachment(attachment);
        if (fileAttachment && result.files.length < MAX_FILE_ATTACHMENTS) {
            result.files.push(fileAttachment);
        }
    }

    return result;
}

export function normalizeChatAttachments(attachments = []) {
    const split = splitChatAttachments(attachments);
    return [...split.vision, ...split.files];
}

export function summarizeChatAttachmentsForGateway(attachments = []) {
    const split = splitChatAttachments(attachments);
    return [
        ...split.vision.map((attachment) => ({
            type: 'vision',
            id: attachment.id,
            source: attachment.source,
            label: attachment.label,
            mimeType: attachment.mimeType,
            width: attachment.width,
            height: attachment.height,
            createdAt: attachment.createdAt
        })),
        ...split.files.map((attachment) => ({
            type: 'file',
            id: attachment.id,
            source: attachment.source,
            label: attachment.label,
            name: attachment.name,
            path: attachment.path,
            mimeType: attachment.mimeType,
            extension: attachment.extension,
            kind: attachment.kind,
            size: attachment.size,
            sizeText: attachment.sizeText,
            createdAt: attachment.createdAt,
            modifiedAt: attachment.modifiedAt
        }))
    ];
}

export function buildAttachmentHint(content, attachments = []) {
    const split = splitChatAttachments(attachments);
    const hints = [];
    if (split.vision.length) {
        hints.push(`附带视觉上下文：${split.vision.map((attachment) => attachment.label || '截图').join('、')}`);
    }
    if (split.files.length) {
        hints.push(`附带本地文件：${split.files.map((attachment) => attachment.name || attachment.label || '文件').join('、')}`);
    }
    if (!hints.length) {
        return content;
    }
    return `${content}\n\n[${hints.join('；')}]`;
}

export function getDefaultMessageForAttachments(attachments = []) {
    const split = splitChatAttachments(attachments);
    if (split.files.length && split.vision.length) {
        return '请结合我附带的截图和文件帮我分析。';
    }
    if (split.files.length) {
        return '请读取并分析我附带的文件。';
    }
    if (split.vision.length) {
        return '帮我看一下这张截图。';
    }
    return '';
}
