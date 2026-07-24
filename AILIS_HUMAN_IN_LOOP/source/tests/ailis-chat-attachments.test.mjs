import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildAttachmentHint,
    getDefaultMessageForAttachments,
    normalizeChatAttachments,
    splitChatAttachments,
    summarizeChatAttachmentsForGateway
} from '../src/chat-attachments.js';

test('chat attachments normalize local files and vision snapshots together', () => {
    const attachments = normalizeChatAttachments([
        {
            type: 'vision',
            id: 'screen-1',
            label: '屏幕截图',
            dataUrl: 'data:image/png;base64,abc',
            mimeType: 'image/png',
            width: 120,
            height: 90
        },
        {
            type: 'file',
            name: 'report.pdf',
            path: 'F:\\docs\\report.pdf',
            size: 2048,
            mimeType: 'application/pdf',
            modifiedAt: '2026-06-05T00:00:00.000Z'
        }
    ]);

    const split = splitChatAttachments(attachments);
    assert.equal(split.vision.length, 1);
    assert.equal(split.files.length, 1);
    assert.equal(split.files[0].name, 'report.pdf');
    assert.equal(split.files[0].sizeText, '2.0 KB');
    assert.equal(split.files[0].mimeType, 'application/pdf');
});

test('chat attachment gateway summaries keep file paths but strip image data URLs', () => {
    const summary = summarizeChatAttachmentsForGateway([
        {
            type: 'vision',
            label: '截图',
            dataUrl: 'data:image/png;base64,abc',
            mimeType: 'image/png'
        },
        {
            type: 'file',
            name: 'notes.md',
            path: 'F:\\notes\\notes.md',
            size: 128
        }
    ]);

    assert.equal(summary.length, 2);
    assert.equal(summary[0].type, 'vision');
    assert.equal('dataUrl' in summary[0], false);
    assert.equal(summary[1].type, 'file');
    assert.equal(summary[1].path, 'F:\\notes\\notes.md');
});

test('chat attachment hints and default messages mention local files', () => {
    const attachments = [
        {
            type: 'file',
            name: 'task.csv',
            path: 'F:\\data\\task.csv',
            size: 10
        }
    ];

    assert.equal(getDefaultMessageForAttachments(attachments), '请读取并分析我附带的文件。');
    assert.match(buildAttachmentHint('帮我看看', attachments), /附带本地文件：task\.csv/);
});

