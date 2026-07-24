import { execFileSync } from 'node:child_process';
import {
    copyFile,
    mkdir,
    readFile,
    rm,
    stat,
    writeFile
} from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)), '..');
const learningRoot = resolve(repositoryRoot, 'AILIS_HUMAN_IN_LOOP');
const snapshotRoot = resolve(learningRoot, 'source');
const generatedRoot = resolve(learningRoot, 'generated');
const lineGuideRoot = resolve(generatedRoot, 'line-by-line');
const learningPrefix = 'AILIS_HUMAN_IN_LOOP/';

const textExtensions = new Set([
    '.cjs',
    '.css',
    '.csv',
    '.example',
    '.gitattributes',
    '.gitignore',
    '.html',
    '.js',
    '.json',
    '.jsonl',
    '.md',
    '.mjs',
    '.nsh',
    '.ps1',
    '.py',
    '.python-version',
    '.ragflow',
    '.service',
    '.sh',
    '.toml',
    '.txt',
    '.yaml',
    '.yml'
]);
const textFileNames = new Set([
    '.gitattributes',
    '.gitignore',
    '.python-version',
    'Dockerfile',
    'LICENSE'
]);
const codeExtensions = new Set([
    '.cjs',
    '.css',
    '.html',
    '.js',
    '.mjs',
    '.nsh',
    '.ps1',
    '.py',
    '.service',
    '.sh'
]);

function assertSafeOutputPath(targetPath) {
    const normalizedRoot = `${learningRoot}${sep}`;
    if (targetPath !== learningRoot && !targetPath.startsWith(normalizedRoot)) {
        throw new Error(`Refusing to mutate outside ${learningRoot}: ${targetPath}`);
    }
}

function runGit(args, options = {}) {
    return execFileSync('git', args, {
        cwd: repositoryRoot,
        encoding: options.encoding ?? 'utf8',
        maxBuffer: 128 * 1024 * 1024,
        stdio: options.stdio ?? ['ignore', 'pipe', 'pipe']
    });
}

function listTrackedFiles() {
    return runGit(['ls-files', '-z'])
        .split('\0')
        .filter(Boolean)
        .map((path) => path.replaceAll('\\', '/'))
        .filter((path) => !path.startsWith(learningPrefix))
        .sort((left, right) => left.localeCompare(right));
}

function sha256(buffer) {
    return createHash('sha256').update(buffer).digest('hex');
}

function isTextFile(filePath) {
    const fileName = filePath.split('/').at(-1) || '';
    return textFileNames.has(fileName) || textExtensions.has(extname(fileName).toLowerCase());
}

function normalizeText(buffer) {
    return buffer.toString('utf8').replace(/\r\n?/g, '\n');
}

function splitSourceLines(text) {
    if (!text) {
        return [];
    }
    const lines = text.split('\n');
    if (lines.at(-1) === '') {
        lines.pop();
    }
    return lines;
}

function classifyFile(filePath, text) {
    const extension = extname(filePath).toLowerCase();
    if (!text) {
        return 'binary-asset';
    }
    if (codeExtensions.has(extension)) {
        return 'source-code';
    }
    if (extension === '.md' || filePath.startsWith('docs/') || filePath.startsWith('gaia-practice-tasks/')) {
        return 'documentation';
    }
    if (['.json', '.jsonl', '.csv', '.yaml', '.yml', '.toml'].includes(extension)) {
        return 'structured-data';
    }
    return 'configuration-or-text';
}

function inferPurpose(filePath) {
    const lower = filePath.toLowerCase();
    const baseName = lower.split('/').at(-1) || lower;

    if (lower === 'electron/main.cjs') {
        return 'Electron 主进程总入口：创建窗口、注册 IPC、装配本地服务并管理应用生命周期。';
    }
    if (lower === 'electron/preload.cjs') {
        return 'Electron 安全桥：把受控 IPC 能力暴露给渲染进程，隔离 Node 与页面。';
    }
    if (lower.includes('agent-runner')) {
        return 'TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。';
    }
    if (lower.includes('task-agent-harness')) {
        return 'System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。';
    }
    if (lower.includes('gateway')) {
        return 'Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。';
    }
    if (lower.includes('memory-store')) {
        return 'Persona Memory 存储核心：长期记忆块、检索、更新、隔离策略与持久化。';
    }
    if (lower.includes('raw-memory-ledger')) {
        return '原始记忆账本：以追加式记录保留可审计的记忆来源和处理状态。';
    }
    if (lower.includes('context-manager')) {
        return '上下文管理器：控制任务工作上下文、预算、压缩、检查点与恢复。';
    }
    if (lower.includes('context-compiler')) {
        return '上下文编译器：把分离的数据通道编译为模型可消费的受预算上下文。';
    }
    if (lower.includes('persona-renderer')) {
        return 'Persona Renderer：把模型语义输出转换为 AILIS 对用户可见的自然表达。';
    }
    if (lower.includes('prompt-model')) {
        return '提示词数据模型：定义 Persona/TaskAgent 等提示词片段的结构和组合边界。';
    }
    if (lower.includes('model-input-builder')) {
        return '模型输入构建器：组合系统、开发者、记忆、历史、任务与工具上下文。';
    }
    if (lower.includes('tool-contract')) {
        return '工具契约层：定义 schema、风险、审批、错误与执行约束。';
    }
    if (lower.includes('tool-router') || lower.includes('tool-routing')) {
        return '工具路由层：按能力、策略和运行时状态选择可执行工具通道。';
    }
    if (lower.includes('tool-runtime') || lower.includes('tool-executor')) {
        return '工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。';
    }
    if (lower.includes('artifact')) {
        return 'Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。';
    }
    if (lower.includes('computer-tool')) {
        return '电脑操作工具：在审批和安全边界内执行桌面观察与交互。';
    }
    if (lower.includes('file-manager')) {
        return '文件管理工具：受路径保护地读取、写入、移动或检查本地文件。';
    }
    if (lower.includes('email-tool')) {
        return '邮件工具：在账户与审批边界内读取或发送邮件。';
    }
    if (lower.includes('mcp')) {
        return 'MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。';
    }
    if (lower.includes('platform-adapter')) {
        return '平台适配层：把文件、进程、桌面或云端差异收敛为统一接口。';
    }
    if (lower.includes('self-debug')) {
        return '自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。';
    }
    if (lower.includes('capability-manager') || lower.includes('tool-acquisition')) {
        return '能力管理/工具获取：识别缺口、安装或启用能力，并执行信任与验证门禁。';
    }
    if (lower.includes('chat-tts-system')) {
        return '聊天与语音编排：管理流式文本、TTS、口型、角色事件、历史和中断。';
    }
    if (lower.includes('speech-provider') || lower.includes('tts')) {
        return '语音提供与播放：选择 TTS 候选器、合成音频、浏览器原生语音或口型时序。';
    }
    if (lower.includes('vrm-model-system')) {
        return 'VRM 角色系统：加载模型、动作、表情、渲染、相机、阴影和口型。';
    }
    if (lower.includes('pet-app')) {
        return '桌宠/网页角色入口：装配 VRM、聊天、语音、偏好与页面桥接。';
    }
    if (lower.includes('control-panel')) {
        return '控制面板：呈现并修改模型、语音、角色、工具、运行时和诊断设置。';
    }
    if (lower.includes('chat-service')) {
        return '聊天服务适配：在桌面、Hosted Runtime 或降级服务间路由对话请求。';
    }
    if (lower.includes('hosted-runtime')) {
        return 'Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。';
    }
    if (lower.startsWith('backend/api/')) {
        return 'FastAPI 接口层：定义 HTTP/SSE 端点、请求模型与响应边界。';
    }
    if (lower.startsWith('backend/services/')) {
        return '后端服务层：实现模型、记忆、聊天或业务服务逻辑。';
    }
    if (lower.startsWith('backend/models/')) {
        return '后端数据模型：定义 API 和持久化使用的结构化对象。';
    }
    if (lower.startsWith('backend/')) {
        return '可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。';
    }
    if (lower.startsWith('tests/')) {
        return `自动化测试：验证 ${baseName.replace(/\.(test\.)?(mjs|cjs|js|py)$/i, '')} 的契约与回归行为。`;
    }
    if (lower.startsWith('scripts/')) {
        return '工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。';
    }
    if (lower.startsWith('docs/')) {
        return '设计与运维文档：记录该主题的架构、决策、验证证据和使用方法。';
    }
    if (lower.startsWith('evals/')) {
        return '评测资产：定义场景、数据集、评分输入或评测结果结构。';
    }
    if (lower.startsWith('resources/')) {
        return '角色资源：VRM、VRMA、表情贴图、参考音频或资源说明。';
    }
    if (lower.startsWith('vendor/')) {
        return '仓库内第三方/参考实现：用于兼容或研究，不应与 AILIS 自有业务逻辑混淆。';
    }
    if (lower.endsWith('.html')) {
        return '页面入口：定义界面结构并加载对应的前端模块和样式。';
    }
    if (lower.endsWith('package.json')) {
        return 'Node 项目清单：声明脚本、依赖、版本和构建入口。';
    }
    if (lower.includes('lock')) {
        return '依赖锁定文件：固定可复现安装所需的精确版本与完整性信息。';
    }
    return 'AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。';
}

function extractDependencies(filePath, lines) {
    const dependencies = new Set();
    for (const line of lines) {
        const jsImport = line.match(/\bfrom\s+['"]([^'"]+)['"]/);
        const bareImport = line.match(/^\s*import\s+['"]([^'"]+)['"]/);
        const requireCall = line.match(/\brequire\(\s*['"]([^'"]+)['"]\s*\)/);
        const pythonImport = line.match(/^\s*(?:from\s+([\w.]+)\s+import|import\s+([\w.]+))/);
        const htmlAsset = line.match(/<(?:script|link)[^>]+(?:src|href)=["']([^"']+)["']/i);
        const match = jsImport || bareImport || requireCall || pythonImport || htmlAsset;
        const value = match?.slice(1).find(Boolean);
        if (value) {
            dependencies.add(value);
        }
    }
    return [...dependencies].slice(0, 80);
}

function extractSymbols(filePath, lines) {
    const symbols = new Set();
    for (const line of lines) {
        const matches = [
            line.match(/\bclass\s+([A-Za-z_$][\w$]*)/),
            line.match(/\b(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/),
            line.match(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/),
            line.match(/^\s*(?:async\s+)?def\s+([A-Za-z_][\w]*)/),
            line.match(/^\s*class\s+([A-Za-z_][\w]*)/),
            line.match(/\bid=["']([^"']+)["']/)
        ];
        for (const match of matches) {
            if (match?.[1]) {
                symbols.add(match[1]);
                break;
            }
        }
        if (symbols.size >= 160) {
            break;
        }
    }
    return [...symbols];
}

function describeIdentifierList(line) {
    const declaration = line.match(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)/);
    if (declaration) {
        return `声明局部标识符 \`${declaration[1]}\`，后续逻辑通过它保存配置、状态、依赖或中间结果。`;
    }
    const functionDeclaration = line.match(/\b(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/);
    if (functionDeclaration) {
        return `定义函数 \`${functionDeclaration[1]}\`；应继续阅读其参数、返回值、异常和所有调用方。`;
    }
    const classDeclaration = line.match(/\bclass\s+([A-Za-z_$][\w$]*)/);
    if (classDeclaration) {
        return `定义类 \`${classDeclaration[1]}\`，把相关状态与行为收拢为一个运行时对象。`;
    }
    return '';
}

function explainLine(line, context) {
    const trimmed = line.trim();
    const extension = context.extension;
    const purposeSuffix = ` 本行属于“${context.purpose}”这一文件职责。`;

    if (!trimmed) {
        return '空行：分隔相邻语义块，提高可读性；不产生运行时行为。';
    }
    if (/^#!\//.test(trimmed)) {
        return 'Shebang：指定直接执行该脚本时使用的解释器。';
    }
    if (/^(\/\/|\/\*|\*|#(?!\!))/.test(trimmed)) {
        return `注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。${purposeSuffix}`;
    }
    if (/^<!--/.test(trimmed)) {
        return `HTML 注释：给维护者提供页面结构说明，不会渲染为可见内容。${purposeSuffix}`;
    }
    if (extension === '.md') {
        if (/^#{1,6}\s/.test(trimmed)) {
            return 'Markdown 标题：建立文档层级，并作为目录与阅读导航锚点。';
        }
        if (/^```/.test(trimmed)) {
            return 'Markdown 代码围栏：开始或结束一段保持原格式的代码/命令示例。';
        }
        if (/^[-*+]\s/.test(trimmed)) {
            return 'Markdown 列表项：列出该主题下的一个事实、步骤、约束或结论。';
        }
        if (/^\|/.test(trimmed)) {
            return 'Markdown 表格行：以列结构表达对照关系、字段定义或证据。';
        }
        return '文档正文：解释设计意图、操作方法、证据边界或维护约定。';
    }
    if (['.json', '.jsonl'].includes(extension)) {
        const keyMatch = trimmed.match(/^["{,]*\s*"([^"]+)"\s*:/);
        return keyMatch
            ? `结构化数据字段 \`${keyMatch[1]}\`：为配置、协议、测试或数据集提供一个可机器读取的值。`
            : '结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。';
    }
    if (['.yaml', '.yml', '.toml'].includes(extension)) {
        const keyMatch = trimmed.match(/^([A-Za-z0-9_.-]+)\s*[:=]/);
        return keyMatch
            ? `配置键 \`${keyMatch[1]}\`：为构建、部署、依赖或运行时声明参数。`
            : '配置结构行：建立层级、列表或复合配置值。';
    }
    if (extension === '.css') {
        if (trimmed.endsWith('{')) {
            return `CSS 规则开始：选择目标元素/状态，后续声明控制其视觉与布局。${purposeSuffix}`;
        }
        const propertyMatch = trimmed.match(/^([-\w]+)\s*:/);
        if (propertyMatch) {
            return `设置 CSS 属性 \`${propertyMatch[1]}\`，影响匹配元素的布局、颜色、尺寸、动画或交互表现。`;
        }
        if (trimmed === '}') {
            return '结束当前 CSS 规则块。';
        }
    }
    if (extension === '.html') {
        const openTag = trimmed.match(/^<([A-Za-z][\w-]*)\b/);
        const closeTag = trimmed.match(/^<\/([A-Za-z][\w-]*)>/);
        if (openTag) {
            return `创建/配置 HTML \`<${openTag[1]}>\` 元素，参与页面语义、布局、资源加载或用户交互。`;
        }
        if (closeTag) {
            return `关闭 HTML \`<${closeTag[1]}>\` 元素，结束相应的 DOM 层级。`;
        }
    }
    if (extension === '.py') {
        const pythonImport = trimmed.match(/^(?:from\s+([\w.]+)\s+import|import\s+([\w.]+))/);
        if (pythonImport) {
            return `导入 Python 依赖 \`${pythonImport[1] || pythonImport[2]}\`，供本模块调用其类型、函数或常量。`;
        }
        const pythonDef = trimmed.match(/^(?:async\s+)?def\s+([A-Za-z_][\w]*)/);
        if (pythonDef) {
            return `定义 Python 函数 \`${pythonDef[1]}\`；其缩进块实现具体业务或工具行为。${purposeSuffix}`;
        }
        const pythonClass = trimmed.match(/^class\s+([A-Za-z_][\w]*)/);
        if (pythonClass) {
            return `定义 Python 类 \`${pythonClass[1]}\`，封装相关状态、协议和方法。${purposeSuffix}`;
        }
        if (/^if\b/.test(trimmed)) {
            return 'Python 条件分支：只有条件成立时才执行后续缩进块。';
        }
        if (/^(for|while)\b/.test(trimmed)) {
            return 'Python 循环：按集合元素或条件重复执行后续缩进块。';
        }
        if (/^(try|except|finally)\b/.test(trimmed)) {
            return 'Python 异常控制：界定可能失败的操作、错误处理或必做清理。';
        }
        if (/^return\b/.test(trimmed)) {
            return 'Python 返回语句：结束当前函数并把结果交还调用方。';
        }
        if (/^raise\b/.test(trimmed)) {
            return 'Python 抛错语句：终止当前正常路径并向上层报告失败原因。';
        }
    }
    const importMatch = trimmed.match(/^(?:import\b.*?\bfrom\s+|import\s+|.*?require\()\s*['"]?([^'")\s]+)/);
    if (importMatch) {
        return `导入依赖 \`${importMatch[1]}\`，使本文件可以复用外部模块能力。${purposeSuffix}`;
    }
    const identifierExplanation = describeIdentifierList(trimmed);
    if (identifierExplanation) {
        return `${identifierExplanation}${purposeSuffix}`;
    }
    if (/\bawait\b/.test(trimmed)) {
        return `等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。${purposeSuffix}`;
    }
    if (/^if\s*\(|^if\b/.test(trimmed)) {
        return '条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。';
    }
    if (/^else\b/.test(trimmed)) {
        return '条件分支的替代路径：前一条件不成立时执行这里的逻辑。';
    }
    if (/^(for|while)\b/.test(trimmed)) {
        return '循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。';
    }
    if (/^switch\b/.test(trimmed)) {
        return '多分支选择：根据一个离散值进入对应处理路径。';
    }
    if (/^(case\b|default:)/.test(trimmed)) {
        return '多分支标签：定义 switch 结构中的一个具体处理入口。';
    }
    if (/^try\b/.test(trimmed)) {
        return '异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。';
    }
    if (/^(catch|except)\b/.test(trimmed)) {
        return '错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。';
    }
    if (/^finally\b/.test(trimmed)) {
        return '最终清理路径：无论成功还是失败都执行资源释放或状态复位。';
    }
    if (/^return\b/.test(trimmed)) {
        return '返回语句：结束当前函数，并把值或状态交给调用方。';
    }
    if (/^throw\b/.test(trimmed)) {
        return '抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。';
    }
    if (/=>\s*\{?\s*$/.test(trimmed)) {
        return `定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。${purposeSuffix}`;
    }
    if (/addEventListener|\.on\(|on[A-Z]\w*\s*=/.test(trimmed)) {
        return '注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。';
    }
    if (/fetch\(|axios|http|https/.test(trimmed)) {
        return '发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。';
    }
    if (/approval|permission|allowlist|denylist|risk/i.test(trimmed)) {
        return '安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。';
    }
    if (/secret|token|password|api[_-]?key/i.test(trimmed)) {
        return '敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。';
    }
    if (/memory|checkpoint|context/i.test(trimmed)) {
        return `记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。${purposeSuffix}`;
    }
    if (/tool|mcp|artifact|evidence/i.test(trimmed)) {
        return `工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。${purposeSuffix}`;
    }
    if (/^\}?[),;\]]*$/.test(trimmed)) {
        return '结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。';
    }
    if (/[=:]\s*[\[{]?$/.test(trimmed)) {
        return `开始赋值或复合结构，后续行将补充其字段、元素或实现。${purposeSuffix}`;
    }
    return `执行该文件中的一项具体声明、参数设置、表达式或调用。${purposeSuffix}`;
}

function escapeTableCell(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('|', '&#124;')
        .replaceAll('\t', '⇥');
}

function displayCodeLine(line) {
    const limit = 640;
    if (line.length <= limit) {
        return line || '␠';
    }
    return `${line.slice(0, limit)} … [本行共 ${line.length} 字符，完整内容见 source 副本]`;
}

function toLineGuidePath(filePath) {
    return resolve(lineGuideRoot, `${filePath}.md`);
}

function toMarkdownLink(fromFile, toFile) {
    return relative(dirname(fromFile), toFile).replaceAll('\\', '/');
}

async function writeLineGuide(entry, lines) {
    const guidePath = toLineGuidePath(entry.path);
    const snapshotPath = resolve(snapshotRoot, entry.path);
    const dependencies = extractDependencies(entry.path, lines);
    const symbols = extractSymbols(entry.path, lines);
    const extension = extname(entry.path).toLowerCase();
    const rows = lines.map((line, index) => {
        const explanation = explainLine(line, {
            extension,
            filePath: entry.path,
            purpose: entry.purpose
        });
        return `| ${index + 1} | <code>${escapeTableCell(displayCodeLine(line))}</code> | ${escapeTableCell(explanation)} |`;
    });
    const content = [
        `# ${entry.path} 逐行讲解`,
        '',
        `- 快照提交：\`${entry.snapshotCommit}\``,
        `- 文件职责：${entry.purpose}`,
        `- 文件类型：\`${entry.kind}\``,
        `- 原始行数：${entry.lines}`,
        `- SHA-256：\`${entry.sha256}\``,
        `- 可运行副本：[打开源文件](${toMarkdownLink(guidePath, snapshotPath)})`,
        `- 依赖：${dependencies.length ? dependencies.map((value) => `\`${value}\``).join('、') : '未从静态文本识别到显式依赖'}`,
        `- 主要符号：${symbols.length ? symbols.map((value) => `\`${value}\``).join('、') : '未从静态文本识别到命名符号'}`,
        '',
        '> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。',
        '',
        '| 行号 | 原代码 | 逐行说明 |',
        '| ---: | --- | --- |',
        ...(rows.length ? rows : ['| 0 | <code>空文件</code> | 文件当前没有文本行。 |']),
        ''
    ].join('\n');
    await mkdir(dirname(guidePath), { recursive: true });
    await writeFile(guidePath, content, 'utf8');
    return relative(learningRoot, guidePath).replaceAll('\\', '/');
}

function groupCounts(entries, selector) {
    const counts = new Map();
    for (const entry of entries) {
        const key = selector(entry);
        const current = counts.get(key) || { files: 0, bytes: 0, lines: 0 };
        current.files += 1;
        current.bytes += entry.bytes;
        current.lines += entry.lines || 0;
        counts.set(key, current);
    }
    return [...counts.entries()].sort((left, right) => right[1].files - left[1].files);
}

async function buildInventoryDocuments(entries, snapshotCommit) {
    const byTopDirectory = groupCounts(entries, (entry) => entry.path.split('/')[0]);
    const byKind = groupCounts(entries, (entry) => entry.kind);
    const binaryEntries = entries.filter((entry) => entry.kind === 'binary-asset');
    const textEntries = entries.filter((entry) => entry.text);
    const codeEntries = entries.filter((entry) => entry.kind === 'source-code');

    const inventory = [
        '# AILIS HUMAN IN LOOP 自动盘点',
        '',
        `- 快照提交：\`${snapshotCommit}\``,
        `- 总文件数：${entries.length}`,
        `- 文本文件：${textEntries.length}`,
        `- 源代码文件：${codeEntries.length}`,
        `- 二进制资产：${binaryEntries.length}`,
        `- 文本总行数：${textEntries.reduce((sum, entry) => sum + entry.lines, 0)}`,
        `- 总字节数：${entries.reduce((sum, entry) => sum + entry.bytes, 0)}`,
        '',
        '## 按顶层目录',
        '',
        '| 目录 | 文件数 | 文本行 | 字节 |',
        '| --- | ---: | ---: | ---: |',
        ...byTopDirectory.map(([name, value]) => `| \`${name}\` | ${value.files} | ${value.lines} | ${value.bytes} |`),
        '',
        '## 按文件类型',
        '',
        '| 类型 | 文件数 | 文本行 | 字节 |',
        '| --- | ---: | ---: | ---: |',
        ...byKind.map(([name, value]) => `| \`${name}\` | ${value.files} | ${value.lines} | ${value.bytes} |`),
        ''
    ].join('\n');
    await writeFile(resolve(generatedRoot, 'INVENTORY.md'), inventory, 'utf8');

    const moduleCatalog = [
        '# AILIS 全文件模块目录',
        '',
        '该目录由快照生成器创建。每个文本文件都有逐行讲解链接；二进制文件在资产目录中记录。',
        '',
        '| 路径 | 类型 | 行数 | 字节 | 职责 | 逐行讲解 |',
        '| --- | --- | ---: | ---: | --- | --- |',
        ...entries.map((entry) => {
            const guide = entry.lineGuide
                ? `[打开](./${entry.lineGuide.replace(/^generated\//, '')})`
                : '见二进制资产目录';
            return `| \`${entry.path}\` | ${entry.kind} | ${entry.lines || 0} | ${entry.bytes} | ${entry.purpose} | ${guide} |`;
        }),
        ''
    ].join('\n');
    await writeFile(resolve(generatedRoot, 'MODULE_CATALOG.md'), moduleCatalog, 'utf8');

    const binaryCatalog = [
        '# 二进制资产目录',
        '',
        '二进制文件无法做“逐行代码注释”。这里保留用途、大小和 SHA-256，确保副本可核对且加载关系可追踪。',
        '',
        '| 路径 | 字节 | SHA-256 | 用途 |',
        '| --- | ---: | --- | --- |',
        ...binaryEntries.map((entry) => `| \`${entry.path}\` | ${entry.bytes} | \`${entry.sha256}\` | ${entry.purpose} |`),
        ''
    ].join('\n');
    await writeFile(resolve(generatedRoot, 'BINARY_ASSETS.md'), binaryCatalog, 'utf8');

    const lineIndex = [
        '# 逐行讲解总索引',
        '',
        `覆盖 ${textEntries.length} 个文本文件，共 ${textEntries.reduce((sum, entry) => sum + entry.lines, 0)} 行。`,
        '',
        '| 源文件 | 行数 | 职责 | 讲解 |',
        '| --- | ---: | --- | --- |',
        ...textEntries.map((entry) => `| \`${entry.path}\` | ${entry.lines} | ${entry.purpose} | [逐行阅读](./${entry.path}.md) |`),
        ''
    ].join('\n');
    await writeFile(resolve(lineGuideRoot, 'INDEX.md'), lineIndex, 'utf8');
}

async function buildReadingOrder(entries) {
    const recommendedPaths = [
        'README.zh-CN.md',
        'package.json',
        'electron/main.cjs',
        'electron/preload.cjs',
        'src/pet-app.js',
        'src/vrm-model-system.js',
        'src/chat-tts-system.js',
        'src/ailis-chat-service.js',
        'electron/ailis-runtime.cjs',
        'electron/ailis-gateway.cjs',
        'electron/ailis-agent-runner.cjs',
        'electron/ailis-task-agent-harness.cjs',
        'electron/ailis-model-input-builder.cjs',
        'electron/ailis-persona-renderer.cjs',
        'electron/ailis-context-manager.cjs',
        'electron/ailis-memory-store.cjs',
        'electron/ailis-raw-memory-ledger.cjs',
        'electron/ailis-tool-contracts.cjs',
        'electron/ailis-tool-runtime.cjs',
        'electron/ailis-platform-adapter.cjs',
        'scripts/start-ailis-hosted-runtime.cjs',
        'tests/ailis-agent-runner.test.mjs',
        'tests/ailis-memory-store.test.mjs',
        'tests/ailis-gateway.test.mjs'
    ];
    const byPath = new Map(entries.map((entry) => [entry.path, entry]));
    const available = recommendedPaths.map((path) => byPath.get(path)).filter(Boolean);
    const content = [
        '# 建议阅读顺序',
        '',
        '顺序从“产品入口”逐步下钻到“Agent、Memory、Tool、Hosted Runtime 和测试”。每完成一个文件，沿讲解中的依赖与符号继续追踪。',
        '',
        ...available.map((entry, index) => [
            `## ${index + 1}. \`${entry.path}\``,
            '',
            entry.purpose,
            '',
            `- [源文件](../source/${entry.path})`,
            `- [逐行讲解](./line-by-line/${entry.path}.md)`,
            `- 行数：${entry.lines}`,
            ''
        ].join('\n'))
    ].join('\n');
    await writeFile(resolve(generatedRoot, 'READING_ORDER.md'), content, 'utf8');
}

async function main() {
    assertSafeOutputPath(snapshotRoot);
    assertSafeOutputPath(generatedRoot);
    await mkdir(learningRoot, { recursive: true });
    await rm(snapshotRoot, { recursive: true, force: true });
    await rm(generatedRoot, { recursive: true, force: true });
    await mkdir(snapshotRoot, { recursive: true });
    await mkdir(lineGuideRoot, { recursive: true });

    const snapshotCommit = runGit(['rev-parse', 'HEAD']).trim();
    const trackedFiles = listTrackedFiles();
    const entries = [];

    for (const [index, filePath] of trackedFiles.entries()) {
        const sourcePath = resolve(repositoryRoot, filePath);
        const destinationPath = resolve(snapshotRoot, filePath);
        const sourceStats = await stat(sourcePath);
        if (!sourceStats.isFile()) {
            throw new Error(`Tracked path is not a regular file: ${filePath}`);
        }

        await mkdir(dirname(destinationPath), { recursive: true });
        await copyFile(sourcePath, destinationPath);
        const buffer = await readFile(sourcePath);
        const text = isTextFile(filePath);
        const normalizedText = text ? normalizeText(buffer) : '';
        const lines = text ? splitSourceLines(normalizedText) : [];
        const entry = {
            path: filePath,
            snapshotCommit,
            bytes: buffer.byteLength,
            sha256: sha256(buffer),
            text,
            lines: lines.length,
            kind: classifyFile(filePath, text),
            purpose: inferPurpose(filePath),
            lineGuide: null
        };
        if (text) {
            entry.lineGuide = await writeLineGuide(entry, lines);
        }
        entries.push(entry);
        if ((index + 1) % 100 === 0 || index + 1 === trackedFiles.length) {
            console.log(`[human-in-loop] processed ${index + 1}/${trackedFiles.length}`);
        }
    }

    await buildInventoryDocuments(entries, snapshotCommit);
    await buildReadingOrder(entries);
    await writeFile(
        resolve(generatedRoot, 'manifest.json'),
        `${JSON.stringify({
            schema: 'ailis.human_in_loop.manifest.v1',
            generatedAt: new Date().toISOString(),
            snapshotCommit,
            repositoryRoot,
            fileCount: entries.length,
            textFileCount: entries.filter((entry) => entry.text).length,
            binaryFileCount: entries.filter((entry) => !entry.text).length,
            textLineCount: entries.reduce((sum, entry) => sum + (entry.lines || 0), 0),
            totalBytes: entries.reduce((sum, entry) => sum + entry.bytes, 0),
            files: entries
        }, null, 2)}\n`,
        'utf8'
    );
    await writeFile(resolve(learningRoot, 'SNAPSHOT_COMMIT'), `${snapshotCommit}\n`, 'utf8');
    console.log(`[human-in-loop] complete: ${entries.length} files at ${snapshotCommit}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
