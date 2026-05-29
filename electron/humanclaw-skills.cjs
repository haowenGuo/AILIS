const fs = require('fs');
const path = require('path');
const { buildToolContractsPrompt } = require('./humanclaw-tool-contracts.cjs');

const SKILL_ROOT = path.join(__dirname, 'skills');

const DEFAULT_SKILLS = Object.freeze({
    vision: Object.freeze({
        id: 'vision',
        label: '视觉感知 Skill',
        description: 'Read-only screen, chat-window, active-window, or region visual understanding.',
        when: '用户在问屏幕、当前窗口、截图、报错、页面状态，或仅靠文本不足以判断时。',
        tools: Object.freeze(['vision.capture_context'])
    }),
    computer: Object.freeze({
        id: 'computer',
        label: '电脑操作 Skill',
        description: 'Local filesystem, process, shell, PTY, watcher, rollback, binary, and ACL operations.',
        when: '文件系统、命令行、进程、PTY、二进制、ACL、回滚、系统状态检查。',
        tools: Object.freeze(['computer'])
    }),
    email: Object.freeze({
        id: 'email',
        label: '邮箱 Skill',
        description: 'QQ/Gmail/Outlook mailbox reading, searching, drafting, and sending.',
        when: '检查、读取、搜索、整理、草拟、发送 QQ/Gmail/Outlook 邮件。',
        tools: Object.freeze(['email'])
    }),
    file_manager: Object.freeze({
        id: 'file_manager',
        label: '文件整理 Skill',
        description: 'Safe file cleanup and organization with dry-run and quarantine-first execution.',
        when: '文件整理、垃圾清理、下载/桌面/文档归档、C 盘安全清理。',
        tools: Object.freeze(['file_manager'])
    }),
    code: Object.freeze({
        id: 'code',
        label: '代码 Skill',
        description: 'Code search, diagnostics, AST refactor, tests, Git, PR, and CI workflows.',
        when: '代码搜索、符号、诊断、AST 重构、测试、Git、PR/CI 工作流。',
        tools: Object.freeze(['code', 'read', 'write', 'edit', 'apply_patch', 'exec'])
    }),
    mcp_bridge: Object.freeze({
        id: 'mcp_bridge',
        label: 'MCP Skill',
        description: 'Discover and call configured MCP servers, tools, resources, and prompts.',
        when: '需要接入外部 MCP Server、发现外部工具、读取 MCP resources/prompts 时。',
        tools: Object.freeze(['mcp_bridge'])
    })
});

const LEGACY_SKILL_MARKERS = Object.freeze({
    vision: 'VISION SKILL',
    email: '邮箱 SKILL',
    computer: '电脑操作 SKILL',
    file_manager: '文件整理 SKILL',
    code: '代码 SKILL',
    mcp_bridge: 'MCP SKILL'
});

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function parseListValue(value = '') {
    return String(value)
        .split(',')
        .map((entry) => normalizeString(entry))
        .filter(Boolean);
}

function parseSkillMarkdown(markdown = '', fallback = {}) {
    const text = String(markdown || '');
    const result = { ...fallback };
    let body = text.trim();
    if (text.startsWith('---')) {
        const end = text.indexOf('\n---', 3);
        if (end >= 0) {
            const frontMatter = text.slice(3, end).trim().split(/\r?\n/);
            body = text.slice(end + 4).trim();
            let currentArrayKey = '';
            for (const rawLine of frontMatter) {
                const line = rawLine.trimEnd();
                const arrayItem = line.match(/^\s*-\s+(.+)$/);
                if (arrayItem && currentArrayKey) {
                    result[currentArrayKey] = [...(result[currentArrayKey] || []), normalizeString(arrayItem[1])].filter(Boolean);
                    continue;
                }
                const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
                if (!match) {
                    continue;
                }
                const key = match[1];
                const value = normalizeString(match[2]);
                currentArrayKey = '';
                if (!value) {
                    result[key] = [];
                    currentArrayKey = key;
                } else if (['tools', 'triggers'].includes(key)) {
                    result[key] = parseListValue(value);
                } else {
                    result[key] = value;
                }
            }
        }
    }
    return {
        ...result,
        body
    };
}

function readSkillFromDisk(skillId) {
    const fallback = DEFAULT_SKILLS[skillId];
    if (!fallback) {
        return null;
    }
    const filePath = path.join(SKILL_ROOT, skillId, 'SKILL.md');
    try {
        const markdown = fs.readFileSync(filePath, 'utf8');
        return {
            ...parseSkillMarkdown(markdown, fallback),
            sourcePath: filePath,
            source: 'skill_file'
        };
    } catch {
        return {
            ...fallback,
            body: '',
            sourcePath: filePath,
            source: 'fallback'
        };
    }
}

function getHumanClawSkill(skillId) {
    const id = normalizeString(skillId);
    return readSkillFromDisk(id);
}

function listHumanClawSkills() {
    return Object.keys(DEFAULT_SKILLS)
        .map((id) => getHumanClawSkill(id))
        .filter(Boolean);
}

function listHumanClawSkillSummaries() {
    return listHumanClawSkills().map((skill) => ({
        id: skill.id,
        label: skill.label,
        when: skill.when || skill.description,
        tools: skill.tools || [],
        source: skill.source
    }));
}

function buildDynamicSkillAppendix(skill, options = {}) {
    const sections = [];
    const tools = Array.isArray(skill.tools) ? skill.tools : [];
    if (skill.id === 'email') {
        const profiles = options.emailProfiles || {};
        const profileSummaries = Object.entries(profiles)
            .map(([provider, profile]) => {
                const account = profile?.account ? ` account=${profile.account}` : '';
                return `${provider}:${profile?.status || 'unknown'}${account} auth=${profile?.authType || 'unknown'}`;
            })
            .join('; ');
        sections.push(`已配置邮箱状态（不含密钥）：${profileSummaries || 'unknown'}`);
    }
    if (tools.length) {
        sections.push(buildToolContractsPrompt(tools));
    }
    return sections.filter(Boolean).join('\n\n');
}

function buildHumanClawSkillContextText(skillId, options = {}) {
    const skill = getHumanClawSkill(skillId);
    if (!skill) {
        return '';
    }
    const heading = [
        `SKILL PACKAGE ${skill.id}`,
        LEGACY_SKILL_MARKERS[skill.id] || '',
        `label=${skill.label || skill.id}`,
        `when=${skill.when || skill.description || ''}`,
        `tools=${(skill.tools || []).join(', ')}`
    ].filter(Boolean).join('\n');
    const body = skill.body || skill.description || '';
    const appendix = buildDynamicSkillAppendix(skill, options);
    return [heading, body, appendix].filter(Boolean).join('\n\n');
}

module.exports = {
    SKILL_ROOT,
    getHumanClawSkill,
    listHumanClawSkills,
    listHumanClawSkillSummaries,
    buildHumanClawSkillContextText
};
