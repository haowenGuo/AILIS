const { app, BrowserWindow } = require('electron');

async function main() {
    await app.whenReady();

    const win = new BrowserWindow({
        show: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });

    try {
        await win.loadURL('http://127.0.0.1:5173/chat.html');
        const result = await win.webContents.executeJavaScript(`
            (async () => {
                const { setMarkdownContent } = await import('/src/markdown-renderer.js');
                const target = document.createElement('div');
                target.className = 'message-item message-ai';
                setMarkdownContent(target, [
                    '**完成了**',
                    '',
                    '- 第一项',
                    '- 第二项',
                    '',
                    '<script>window.__markdown_xss = true</script>',
                    '',
                    '链接：[OpenAI](https://openai.com)'
                ].join('\\n'));
                document.getElementById('message-list').appendChild(target);
                return {
                    hasStrong: Boolean(target.querySelector('strong')),
                    listItems: target.querySelectorAll('li').length,
                    scriptTags: target.querySelectorAll('script').length,
                    xssFlag: Boolean(window.__markdown_xss),
                    html: target.innerHTML,
                    text: target.textContent
                };
            })();
        `);

        if (!result.hasStrong || result.listItems !== 2 || result.scriptTags !== 0 || result.xssFlag) {
            throw new Error(`Markdown render verification failed: ${JSON.stringify(result)}`);
        }

        console.log(JSON.stringify(result, null, 2));
    } finally {
        win.destroy();
        app.quit();
    }
}

main().catch((error) => {
    console.error(error);
    app.quit();
    process.exitCode = 1;
});
