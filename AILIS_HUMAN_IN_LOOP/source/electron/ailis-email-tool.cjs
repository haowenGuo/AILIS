const { ImapFlow } = require('imapflow');
const nodemailer = require('nodemailer');
const { simpleParser } = require('mailparser');

const DEFAULT_LIST_LIMIT = 10;
const DEFAULT_BODY_CHARS = 4000;
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';
const MICROSOFT_GRAPH_BASE = 'https://graph.microsoft.com/v1.0';

const PROVIDERS = Object.freeze({
    qq: Object.freeze({
        id: 'qq',
        label: 'QQ Mail',
        domains: Object.freeze(['qq.com', 'vip.qq.com', 'foxmail.com']),
        imap: Object.freeze({ host: 'imap.qq.com', port: 993, secure: true }),
        smtp: Object.freeze({ host: 'smtp.qq.com', port: 465, secure: true }),
        secretLabel: 'QQ 邮箱授权码',
        notes: Object.freeze([
            'QQ 邮箱第三方客户端通常使用 IMAP/SMTP 授权码，不是网页登录密码。'
        ])
    }),
    gmail: Object.freeze({
        id: 'gmail',
        label: 'Gmail',
        domains: Object.freeze(['gmail.com', 'googlemail.com']),
        imap: Object.freeze({ host: 'imap.gmail.com', port: 993, secure: true }),
        smtp: Object.freeze({ host: 'smtp.gmail.com', port: 465, secure: true }),
        secretLabel: 'Google App Password 或 OAuth2 access token',
        notes: Object.freeze([
            'Gmail 推荐 OAuth2；启用两步验证的个人账号也可用 App Password 走 IMAP/SMTP。'
        ])
    }),
    outlook: Object.freeze({
        id: 'outlook',
        label: 'Outlook / Microsoft 365',
        domains: Object.freeze(['outlook.com', 'hotmail.com', 'live.com', 'msn.com']),
        imap: Object.freeze({ host: 'outlook.office365.com', port: 993, secure: true }),
        smtp: Object.freeze({ host: 'smtp.office365.com', port: 587, secure: false, requireTLS: true }),
        secretLabel: 'OAuth2 access token，或账号允许时的应用专用密码',
        notes: Object.freeze([
            'Microsoft 365/Exchange Online 现代推荐 OAuth2；很多组织账号已经禁用 Basic Auth。'
        ])
    })
});

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeBoolean(value, fallback = false) {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        if (/^(true|1|yes|on)$/i.test(value.trim())) {
            return true;
        }
        if (/^(false|0|no|off)$/i.test(value.trim())) {
            return false;
        }
    }
    return fallback;
}

function compactText(value, maxChars = DEFAULT_BODY_CHARS) {
    const text = normalizeString(value);
    if (!text) {
        return '';
    }
    const normalized = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    return normalized.length > maxChars ? `${normalized.slice(0, maxChars - 3)}...` : normalized;
}

function toArray(value) {
    if (Array.isArray(value)) {
        return value.map((entry) => normalizeString(entry)).filter(Boolean);
    }
    const normalized = normalizeString(value);
    if (!normalized) {
        return [];
    }
    return normalized
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
}

function redactSecret(value) {
    const normalized = normalizeString(value);
    if (!normalized) {
        return '';
    }
    if (normalized.length <= 8) {
        return '***';
    }
    return `${normalized.slice(0, 4)}...${normalized.slice(-4)}`;
}

function extractEmailAddress(value) {
    const normalized = normalizeString(value).toLowerCase();
    const match = normalized.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    return match ? match[0] : normalized;
}

function inferProviderFromAccount(account) {
    const email = extractEmailAddress(account);
    const domain = email.split('@')[1] || '';
    for (const provider of Object.values(PROVIDERS)) {
        if (provider.domains.includes(domain)) {
            return provider.id;
        }
    }
    return '';
}

function cloneProvider(provider) {
    return {
        id: provider.id,
        label: provider.label,
        domains: [...provider.domains],
        imap: { ...provider.imap },
        smtp: { ...provider.smtp },
        secretLabel: provider.secretLabel,
        notes: [...provider.notes]
    };
}

function listProviderDetails() {
    return Object.values(PROVIDERS).map((provider) => cloneProvider(provider));
}

function createTextResult(text, details = {}) {
    return {
        content: text ? [{ type: 'text', text }] : [],
        details
    };
}

function createErrorResult(status, message, details = {}) {
    return {
        content: [
            {
                type: 'text',
                text: message
            }
        ],
        isError: true,
        details: {
            status,
            error: message,
            ...details
        }
    };
}

function resolveEnvSecret(providerId, account) {
    const upperProvider = providerId.toUpperCase();
    const env = process.env;
    const emailEnv = env[`AILIS_EMAIL_${upperProvider}_ACCOUNT`];
    const secretEnv =
        env[`AILIS_EMAIL_${upperProvider}_SECRET`] ||
        env[`AILIS_EMAIL_${upperProvider}_PASSWORD`] ||
        env[`AILIS_EMAIL_${upperProvider}_APP_PASSWORD`] ||
        env[`AILIS_EMAIL_${upperProvider}_AUTH_CODE`] ||
        '';

    const matchedAccount = normalizeString(account || emailEnv);
    return {
        account: matchedAccount,
        secret: normalizeString(secretEnv)
    };
}

function resolveContextEmailProfile(providerId, requestedAccount = '', context = {}) {
    const profiles = context.emailProfiles || context.emailAccounts || context.emailCredentials || {};
    if (!profiles || typeof profiles !== 'object') {
        return {};
    }
    const direct = profiles[providerId] || profiles[String(providerId || '').toLowerCase()];
    const requested = extractEmailAddress(requestedAccount);
    if (direct && typeof direct === 'object') {
        const account = extractEmailAddress(direct.account || direct.email || direct.username || direct.user);
        if (!requested || !account || requested === account) {
            return direct;
        }
    }
    for (const profile of Object.values(profiles)) {
        if (!profile || typeof profile !== 'object') {
            continue;
        }
        const account = extractEmailAddress(profile.account || profile.email || profile.username || profile.user);
        if (requested && account === requested) {
            return profile;
        }
    }
    return {};
}

function resolveDefaultProviderFromContext(context = {}) {
    const explicit = normalizeString(context.emailProvider || context.defaultEmailProvider).toLowerCase();
    if (explicit && PROVIDERS[explicit]) {
        return explicit;
    }
    const profiles = context.emailProfiles || context.emailAccounts || context.emailCredentials || {};
    if (!profiles || typeof profiles !== 'object') {
        return '';
    }
    for (const providerId of Object.keys(PROVIDERS)) {
        const profile = profiles[providerId];
        if (profile && typeof profile === 'object' && normalizeString(profile.account || profile.email)) {
            return providerId;
        }
    }
    return '';
}

function resolveAccessToken(providerId, args = {}, context = {}) {
    const upperProvider = providerId.toUpperCase();
    const profile = resolveContextEmailProfile(providerId, args.account || args.email || args.userId, context);
    return normalizeString(
        args.accessToken ||
            args.token ||
            args.auth?.accessToken ||
            profile.accessToken ||
            profile.token ||
            profile.secret ||
            process.env[`AILIS_EMAIL_${upperProvider}_ACCESS_TOKEN`] ||
            process.env[`AILIS_EMAIL_${upperProvider}_SECRET`] ||
            ''
    );
}

function resolveProviderConfig(args = {}, context = {}) {
    const explicitProvider = normalizeString(args.provider || args.service || args.kind).toLowerCase();
    const requestedAccount = normalizeString(args.account || args.email || args.username || args.user);
    const inferredProvider =
        explicitProvider ||
        inferProviderFromAccount(requestedAccount) ||
        resolveDefaultProviderFromContext(context) ||
        'qq';
    const provider = PROVIDERS[inferredProvider];
    if (!provider) {
        return {
            error: createErrorResult('needs_config', `不支持的邮箱 provider：${inferredProvider}`, {
                supportedProviders: Object.keys(PROVIDERS)
            })
        };
    }

    const envProfile = resolveEnvSecret(provider.id, requestedAccount);
    const storedProfile = resolveContextEmailProfile(provider.id, requestedAccount || envProfile.account, context);
    const account = normalizeString(
        requestedAccount ||
            storedProfile.account ||
            storedProfile.email ||
            storedProfile.username ||
            storedProfile.user ||
            envProfile.account
    );
    const secret = normalizeString(
        args.secret ||
            args.password ||
            args.pass ||
            args.appPassword ||
            args.authCode ||
            args.authorizationCode ||
            args.accessToken ||
            storedProfile.secret ||
            storedProfile.password ||
            storedProfile.pass ||
            storedProfile.appPassword ||
            storedProfile.authCode ||
            storedProfile.authorizationCode ||
            storedProfile.accessToken ||
            envProfile.secret
    );
    const authType = normalizeString(
        args.authType ||
            args.auth?.type ||
            storedProfile.authType ||
            storedProfile.auth?.type ||
            (args.accessToken || storedProfile.accessToken ? 'oauth2' : 'password'),
        'password'
    ).toLowerCase();

    if (!account) {
        return {
            error: createErrorResult('needs_config', 'email 工具需要 account/email 参数，或在控制面板配置邮箱账号，或设置 AILIS_EMAIL_<PROVIDER>_ACCOUNT。', {
                provider: provider.id,
                envAccount: `AILIS_EMAIL_${provider.id.toUpperCase()}_ACCOUNT`,
                desktopConfig: '控制面板 -> 邮箱账号'
            })
        };
    }
    if (!secret) {
        return {
            error: createErrorResult(
                'needs_config',
                `email 工具需要 ${provider.secretLabel}。可以在控制面板保存，或在参数 secret/password/appPassword/authCode/accessToken 中传入，或设置 AILIS_EMAIL_${provider.id.toUpperCase()}_SECRET。`,
                {
                    provider: provider.id,
                    account,
                    secretLabel: provider.secretLabel,
                    envSecret: `AILIS_EMAIL_${provider.id.toUpperCase()}_SECRET`,
                    desktopConfig: '控制面板 -> 邮箱账号'
                }
            )
        };
    }

    return {
        provider,
        account,
        secret,
        authType,
        mailbox: normalizeString(args.mailbox, 'INBOX')
    };
}

function buildImapClient({ provider, account, secret, authType, args }) {
    const imap = {
        ...provider.imap,
        ...(args.imap && typeof args.imap === 'object' ? args.imap : {})
    };
    const auth =
        authType === 'oauth2'
            ? {
                  user: account,
                  accessToken: secret
              }
            : {
                  user: account,
                  pass: secret
              };
    return new ImapFlow({
        host: imap.host,
        port: Number(imap.port || 993),
        secure: imap.secure !== false,
        auth,
        logger: false,
        tls: imap.rejectUnauthorized === false ? { rejectUnauthorized: false } : undefined
    });
}

function buildSmtpTransport({ provider, account, secret, authType, args }) {
    const smtp = {
        ...provider.smtp,
        ...(args.smtp && typeof args.smtp === 'object' ? args.smtp : {})
    };
    const auth =
        authType === 'oauth2'
            ? {
                  type: 'OAuth2',
                  user: account,
                  accessToken: secret
              }
            : {
                  user: account,
                  pass: secret
              };
    return nodemailer.createTransport({
        host: smtp.host,
        port: Number(smtp.port || 465),
        secure: smtp.secure !== false,
        requireTLS: Boolean(smtp.requireTLS),
        auth,
        tls: smtp.rejectUnauthorized === false ? { rejectUnauthorized: false } : undefined
    });
}

function buildSearchQuery(args = {}) {
    const query = {};
    const filter = normalizeString(args.filter || args.query || args.search).toLowerCase();
    if (filter === 'unread' || filter === 'unseen' || args.unreadOnly === true || args.unseenOnly === true || args.onlyUnread === true) {
        query.seen = false;
    } else if (filter === 'seen' || filter === 'read' || args.seenOnly === true || args.onlyRead === true) {
        query.seen = true;
    }
    const since = normalizeString(args.since || args.after);
    if (since) {
        query.since = new Date(since);
    }
    const before = normalizeString(args.before);
    if (before) {
        query.before = new Date(before);
    }
    const from = normalizeString(args.from);
    if (from) {
        query.from = from;
    }
    const to = normalizeString(args.to);
    if (to) {
        query.to = to;
    }
    const subject = normalizeString(args.subject);
    if (subject) {
        query.subject = subject;
    }
    const text = normalizeString(args.text || args.body);
    if (text) {
        query.body = text;
    }
    return Object.keys(query).length ? query : { all: true };
}

function formatAddressList(addresses) {
    if (!Array.isArray(addresses)) {
        return '';
    }
    return addresses
        .map((entry) => entry?.name ? `${entry.name} <${entry.address}>` : entry?.address)
        .filter(Boolean)
        .join(', ');
}

function normalizeEnvelope(message) {
    const envelope = message.envelope || {};
    return {
        uid: message.uid,
        seq: message.seq,
        flags: Array.isArray(message.flags) ? message.flags : [...(message.flags || [])],
        subject: normalizeString(envelope.subject, '(无主题)'),
        from: formatAddressList(envelope.from),
        to: formatAddressList(envelope.to),
        date: envelope.date ? new Date(envelope.date).toISOString() : '',
        messageId: normalizeString(envelope.messageId)
    };
}

async function withImapMailbox(config, args, action) {
    const client = buildImapClient({ ...config, args });
    await client.connect();
    let lock = null;
    try {
        lock = await client.getMailboxLock(config.mailbox);
        return await action(client);
    } finally {
        if (lock) {
            lock.release();
        }
        await client.logout().catch(() => {});
    }
}

function oauthConfig(providerId, args = {}) {
    const provider = normalizeString(providerId || args.provider || args.service, 'gmail').toLowerCase();
    if (provider === 'gmail' || provider === 'google') {
        return {
            provider: 'gmail',
            authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            defaultScopes: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.send']
        };
    }
    if (provider === 'outlook' || provider === 'microsoft' || provider === 'office365') {
        const tenant = normalizeString(args.tenant || args.tenantId, 'common');
        return {
            provider: 'outlook',
            authorizeUrl: `https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/authorize`,
            tokenUrl: `https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`,
            defaultScopes: ['offline_access', 'User.Read', 'Mail.ReadWrite', 'Mail.Send']
        };
    }
    return null;
}

function actionOauthAuthorizeUrl(args = {}) {
    const config = oauthConfig(args.provider, args);
    if (!config) {
        return createErrorResult('needs_config', 'oauth_authorize_url 只支持 gmail/outlook。', {
            supportedProviders: ['gmail', 'outlook']
        });
    }
    const clientId = normalizeString(args.clientId || args.client_id);
    const redirectUri = normalizeString(args.redirectUri || args.redirect_uri);
    if (!clientId || !redirectUri) {
        return createErrorResult('needs_config', 'oauth_authorize_url 需要 clientId 和 redirectUri。', {
            provider: config.provider
        });
    }
    const scopes = toArray(args.scopes || args.scope);
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: (scopes.length ? scopes : config.defaultScopes).join(' ')
    });
    if (config.provider === 'gmail') {
        params.set('access_type', 'offline');
        params.set('prompt', 'consent');
    }
    if (args.state) {
        params.set('state', normalizeString(args.state));
    }
    const url = `${config.authorizeUrl}?${params.toString()}`;
    return createTextResult(url, {
        status: 'completed',
        action: 'oauth_authorize_url',
        provider: config.provider,
        url,
        scopes: scopes.length ? scopes : config.defaultScopes
    });
}

async function actionOauthToken(args = {}, grantType = 'authorization_code') {
    const config = oauthConfig(args.provider, args);
    if (!config) {
        return createErrorResult('needs_config', `${grantType} 只支持 gmail/outlook。`, {
            supportedProviders: ['gmail', 'outlook']
        });
    }
    const clientId = normalizeString(args.clientId || args.client_id);
    const clientSecret = normalizeString(args.clientSecret || args.client_secret);
    const redirectUri = normalizeString(args.redirectUri || args.redirect_uri);
    const code = normalizeString(args.code || args.authorizationCode);
    const refreshToken = normalizeString(args.refreshToken || args.refresh_token);
    if (!clientId) {
        return createErrorResult('needs_config', `${grantType} 需要 clientId。`, { provider: config.provider });
    }
    if (grantType === 'authorization_code' && (!code || !redirectUri)) {
        return createErrorResult('needs_config', 'oauth_exchange_code 需要 code 和 redirectUri。', { provider: config.provider });
    }
    if (grantType === 'refresh_token' && !refreshToken) {
        return createErrorResult('needs_config', 'oauth_refresh 需要 refreshToken。', { provider: config.provider });
    }
    const scopes = toArray(args.scopes || args.scope);
    const body = new URLSearchParams({
        client_id: clientId,
        grant_type: grantType
    });
    if (clientSecret) {
        body.set('client_secret', clientSecret);
    }
    if (grantType === 'authorization_code') {
        body.set('code', code);
        body.set('redirect_uri', redirectUri);
        if (args.codeVerifier || args.code_verifier) {
            body.set('code_verifier', normalizeString(args.codeVerifier || args.code_verifier));
        }
    } else {
        body.set('refresh_token', refreshToken);
        if (scopes.length) {
            body.set('scope', scopes.join(' '));
        }
    }
    if (args.dryRun === true) {
        return createTextResult(JSON.stringify({
            action: grantType === 'authorization_code' ? 'oauth_exchange_code' : 'oauth_refresh',
            provider: config.provider,
            tokenUrl: config.tokenUrl,
            body: {
                ...Object.fromEntries(body.entries()),
                client_secret: clientSecret ? redactSecret(clientSecret) : undefined,
                refresh_token: refreshToken ? redactSecret(refreshToken) : undefined,
                code: code ? redactSecret(code) : undefined
            }
        }, null, 2), {
            status: 'completed',
            action: grantType === 'authorization_code' ? 'oauth_exchange_code' : 'oauth_refresh',
            provider: config.provider,
            dryRun: true
        });
    }
    const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body
    });
    const payload = await response.json().catch(async () => ({ raw: await response.text().catch(() => '') }));
    if (!response.ok) {
        return createErrorResult('provider_error', payload?.error_description || payload?.error || `OAuth token 请求失败：${response.status}`, {
            provider: config.provider,
            statusCode: response.status,
            payload
        });
    }
    return createTextResult(JSON.stringify(payload, null, 2), {
        status: 'completed',
        action: grantType === 'authorization_code' ? 'oauth_exchange_code' : 'oauth_refresh',
        provider: config.provider,
        tokenType: payload.token_type || '',
        expiresIn: payload.expires_in || null,
        scope: payload.scope || ''
    });
}

async function fetchJsonWithBearer(url, accessToken, init = {}) {
    const response = await fetch(url, {
        ...init,
        headers: {
            authorization: `Bearer ${accessToken}`,
            accept: 'application/json',
            ...(init.headers || {})
        }
    });
    const payload = await response.json().catch(async () => ({ raw: await response.text().catch(() => '') }));
    if (!response.ok) {
        return {
            ok: false,
            status: response.status,
            payload
        };
    }
    return {
        ok: true,
        status: response.status,
        payload
    };
}

async function actionGmailApi(args = {}, action = 'gmail_list_labels', context = {}) {
    const accessToken = resolveAccessToken('gmail', args, context);
    if (!accessToken) {
        return createErrorResult('needs_config', `${action} 需要 Gmail OAuth accessToken，或 AILIS_EMAIL_GMAIL_ACCESS_TOKEN。`, {
            action,
            provider: 'gmail'
        });
    }
    const userId = encodeURIComponent(normalizeString(args.userId || args.account || args.email, 'me'));
    let url = '';
    if (action === 'gmail_list_labels') {
        url = `${GMAIL_API_BASE}/users/${userId}/labels`;
    } else if (action === 'gmail_list_threads') {
        const params = new URLSearchParams();
        if (args.q || args.query) {
            params.set('q', normalizeString(args.q || args.query));
        }
        for (const label of toArray(args.labelIds || args.labels)) {
            params.append('labelIds', label);
        }
        params.set('maxResults', String(Math.min(Math.max(Number(args.limit || args.maxResults || 10), 1), 100)));
        url = `${GMAIL_API_BASE}/users/${userId}/threads?${params.toString()}`;
    } else if (action === 'gmail_get_thread') {
        const threadId = normalizeString(args.threadId || args.id);
        if (!threadId) {
            return createErrorResult('needs_config', 'gmail_get_thread 需要 threadId/id。', { action });
        }
        const params = new URLSearchParams({
            format: normalizeString(args.format, 'metadata')
        });
        url = `${GMAIL_API_BASE}/users/${userId}/threads/${encodeURIComponent(threadId)}?${params.toString()}`;
    }
    const result = await fetchJsonWithBearer(url, accessToken);
    if (!result.ok) {
        return createErrorResult('provider_error', result.payload?.error?.message || `Gmail API 请求失败：${result.status}`, {
            action,
            provider: 'gmail',
            statusCode: result.status,
            payload: result.payload
        });
    }
    return createTextResult(JSON.stringify(result.payload, null, 2), {
        status: 'completed',
        action,
        provider: 'gmail',
        payload: result.payload
    });
}

async function actionOutlookGraph(args = {}, action = 'outlook_graph_messages', context = {}) {
    const accessToken = resolveAccessToken('outlook', args, context);
    if (!accessToken) {
        return createErrorResult('needs_config', `${action} 需要 Outlook/Microsoft Graph accessToken，或 AILIS_EMAIL_OUTLOOK_ACCESS_TOKEN。`, {
            action,
            provider: 'outlook'
        });
    }
    const mailbox = normalizeString(args.mailbox || args.userId || args.account);
    const root = mailbox ? `${MICROSOFT_GRAPH_BASE}/users/${encodeURIComponent(mailbox)}` : `${MICROSOFT_GRAPH_BASE}/me`;
    let url = '';
    if (action === 'outlook_graph_messages') {
        const params = new URLSearchParams({
            '$top': String(Math.min(Math.max(Number(args.limit || args.top || 10), 1), 100)),
            '$select': normalizeString(args.select, 'id,subject,from,toRecipients,receivedDateTime,isRead,conversationId')
        });
        if (args.filter) {
            params.set('$filter', normalizeString(args.filter));
        }
        if (args.search) {
            params.set('$search', normalizeString(args.search));
        }
        url = `${root}/messages?${params.toString()}`;
    } else if (action === 'outlook_graph_folders') {
        url = `${root}/mailFolders`;
    } else if (action === 'outlook_graph_message') {
        const messageId = normalizeString(args.messageId || args.id);
        if (!messageId) {
            return createErrorResult('needs_config', 'outlook_graph_message 需要 messageId/id。', { action });
        }
        url = `${root}/messages/${encodeURIComponent(messageId)}`;
    }
    const result = await fetchJsonWithBearer(url, accessToken, args.search ? { headers: { ConsistencyLevel: 'eventual' } } : {});
    if (!result.ok) {
        return createErrorResult('provider_error', result.payload?.error?.message || `Microsoft Graph 请求失败：${result.status}`, {
            action,
            provider: 'outlook',
            statusCode: result.status,
            payload: result.payload
        });
    }
    return createTextResult(JSON.stringify(result.payload, null, 2), {
        status: 'completed',
        action,
        provider: 'outlook',
        payload: result.payload
    });
}

async function listMessages(config, args) {
    const limit = Math.min(Math.max(Number(args.limit || DEFAULT_LIST_LIMIT), 1), 50);
    const searchQuery = buildSearchQuery(args);
    return await withImapMailbox(config, args, async (client) => {
        const uids = await client.search(searchQuery, { uid: true });
        const selected = uids.slice(-limit).reverse();
        const messages = [];
        if (!selected.length) {
            return createTextResult(
                JSON.stringify(
                    {
                        provider: config.provider.id,
                        account: config.account,
                        mailbox: config.mailbox,
                        count: 0,
                        messages
                    },
                    null,
                    2
                ),
                {
                    status: 'completed',
                    action: 'list',
                    provider: config.provider.id,
                    account: config.account,
                    mailbox: config.mailbox,
                    count: 0,
                    messages
                }
            );
        }
        for await (const message of client.fetch(selected, {
            uid: true,
            flags: true,
            envelope: true
        }, { uid: true })) {
            messages.push(normalizeEnvelope(message));
        }
        messages.sort((a, b) => Number(b.uid || 0) - Number(a.uid || 0));
        return createTextResult(
            JSON.stringify(
                {
                    provider: config.provider.id,
                    account: config.account,
                    mailbox: config.mailbox,
                    count: messages.length,
                    messages
                },
                null,
                2
            ),
            {
                status: 'completed',
                action: 'list',
                provider: config.provider.id,
                account: config.account,
                mailbox: config.mailbox,
                count: messages.length,
                messages
            }
        );
    });
}

async function readMessage(config, args) {
    const uid = Number(args.uid || args.messageId || args.id);
    if (!Number.isFinite(uid) || uid <= 0) {
        return createErrorResult('needs_config', '读取邮件需要 uid/messageId 参数。', {
            action: 'read'
        });
    }
    return await withImapMailbox(config, args, async (client) => {
        let found = null;
        for await (const message of client.fetch(`${uid}`, {
            uid: true,
            flags: true,
            envelope: true,
            source: true
        }, { uid: true })) {
            found = message;
            break;
        }
        if (!found) {
            return createErrorResult('not_found', `没有找到 uid=${uid} 的邮件。`, {
                action: 'read',
                uid
            });
        }
        const parsed = found.source ? await simpleParser(found.source) : null;
        const details = {
            status: 'completed',
            action: 'read',
            provider: config.provider.id,
            account: config.account,
            mailbox: config.mailbox,
            message: {
                ...normalizeEnvelope(found),
                text: compactText(parsed?.text || ''),
                html: compactText(parsed?.html || '', Number(args.maxHtmlChars || 1000)),
                attachments: Array.isArray(parsed?.attachments)
                    ? parsed.attachments.map((attachment) => ({
                          filename: attachment.filename || '',
                          contentType: attachment.contentType || '',
                          size: attachment.size || 0
                      }))
                    : []
            }
        };
        return createTextResult(JSON.stringify(details.message, null, 2), details);
    });
}

function buildMailOptions(config, args) {
    const to = toArray(args.to || args.target || args.recipients);
    const cc = toArray(args.cc);
    const bcc = toArray(args.bcc);
    const subject = normalizeString(args.subject, '(无主题)');
    const text = normalizeString(args.text || args.body || args.message || args.content);
    const html = normalizeString(args.html);
    if (!to.length) {
        return {
            error: createErrorResult('needs_config', '发送/草拟邮件需要 to/target/recipients。', {
                action: normalizeString(args.action, 'send')
            })
        };
    }
    if (!text && !html) {
        return {
            error: createErrorResult('needs_config', '发送/草拟邮件需要 text/body/message/content 或 html。', {
                action: normalizeString(args.action, 'send')
            })
        };
    }
    return {
        mail: {
            from: normalizeString(args.from, config.account),
            to,
            cc,
            bcc,
            subject,
            text,
            html
        }
    };
}

async function draftMessage(config, args) {
    const { mail, error } = buildMailOptions(config, args);
    if (error) {
        return error;
    }
    return createTextResult(
        JSON.stringify(
            {
                provider: config.provider.id,
                account: config.account,
                draft: mail
            },
            null,
            2
        ),
        {
            status: 'completed',
            action: 'draft',
            provider: config.provider.id,
            account: config.account,
            draft: mail
        }
    );
}

async function sendMessage(config, args, context) {
    const { mail, error } = buildMailOptions(config, args);
    if (error) {
        return error;
    }
    if (normalizeBoolean(args.dryRun, false)) {
        return createTextResult(
            JSON.stringify(
                {
                    provider: config.provider.id,
                    account: config.account,
                    dryRun: true,
                    draft: mail
                },
                null,
                2
            ),
            {
                status: 'completed',
                action: 'send',
                dryRun: true,
                provider: config.provider.id,
                account: config.account,
                draft: mail
            }
        );
    }
    if (context.approved !== true && args.approved !== true) {
        return createErrorResult('needs_approval', '发送邮件需要用户确认：context.approved=true。', {
            action: 'send',
            provider: config.provider.id,
            account: config.account,
            draft: mail
        });
    }
    const transport = buildSmtpTransport({ ...config, args });
    const info = await transport.sendMail(mail);
    return createTextResult(
        JSON.stringify(
            {
                provider: config.provider.id,
                account: config.account,
                accepted: info.accepted || [],
                rejected: info.rejected || [],
                messageId: info.messageId || ''
            },
            null,
            2
        ),
        {
            status: 'completed',
            action: 'send',
            provider: config.provider.id,
            account: config.account,
            accepted: info.accepted || [],
            rejected: info.rejected || [],
            messageId: info.messageId || ''
        }
    );
}

async function mutateMessage(config, args, context) {
    const action = normalizeString(args.action).toLowerCase();
    const uid = Number(args.uid || args.messageId || args.id);
    if (!Number.isFinite(uid) || uid <= 0) {
        return createErrorResult('needs_config', `${action} 需要 uid/messageId 参数。`, {
            action
        });
    }
    if (context.approved !== true && args.approved !== true) {
        return createErrorResult('needs_approval', `${action} 是会修改邮箱状态的操作，需要用户确认：context.approved=true。`, {
            action,
            uid
        });
    }
    return await withImapMailbox(config, args, async (client) => {
        if (action === 'mark_read') {
            await client.messageFlagsAdd(`${uid}`, ['\\Seen'], { uid: true });
        } else if (action === 'mark_unread') {
            await client.messageFlagsRemove(`${uid}`, ['\\Seen'], { uid: true });
        } else if (action === 'delete') {
            await client.messageDelete(`${uid}`, { uid: true });
        } else if (action === 'move') {
            const targetMailbox = normalizeString(args.targetMailbox || args.toMailbox || args.target);
            if (!targetMailbox) {
                return createErrorResult('needs_config', 'move 需要 targetMailbox/toMailbox 参数。', {
                    action,
                    uid
                });
            }
            await client.messageMove(`${uid}`, targetMailbox, { uid: true });
        }
        return createTextResult(
            JSON.stringify(
                {
                    provider: config.provider.id,
                    account: config.account,
                    action,
                    uid,
                    status: 'completed'
                },
                null,
                2
            ),
            {
                status: 'completed',
                action,
                provider: config.provider.id,
                account: config.account,
                uid
            }
        );
    });
}

async function executeEmailTool(args = {}, context = {}) {
    const action = normalizeString(args.action || args.intent || args.operation, 'list').toLowerCase();
    if (action === 'providers' || action === 'provider_list' || action === 'schema') {
        return createTextResult(
            JSON.stringify(
                {
                    providers: listProviderDetails(),
                    actions: [
                        'providers',
                        'list',
                        'read',
                        'draft',
                        'send',
                        'mark_read',
                        'mark_unread',
                        'move',
                        'delete',
                        'oauth_authorize_url',
                        'oauth_exchange_code',
                        'oauth_refresh',
                        'gmail_list_labels',
                        'gmail_list_threads',
                        'gmail_get_thread',
                        'outlook_graph_messages',
                        'outlook_graph_message',
                        'outlook_graph_folders'
                    ]
                },
                null,
                2
            ),
            {
                status: 'completed',
                action: 'providers',
                providers: listProviderDetails()
            }
        );
    }

    if (action === 'oauth_authorize_url' || action === 'oauth_url') {
        return actionOauthAuthorizeUrl(args);
    }
    if (action === 'oauth_exchange_code' || action === 'oauth_token') {
        return await actionOauthToken(args, 'authorization_code');
    }
    if (action === 'oauth_refresh' || action === 'refresh_token') {
        return await actionOauthToken(args, 'refresh_token');
    }
    if (['gmail_list_labels', 'gmail_list_threads', 'gmail_get_thread'].includes(action)) {
        return await actionGmailApi(args, action, context);
    }
    if (['outlook_graph_messages', 'outlook_graph_message', 'outlook_graph_folders'].includes(action)) {
        return await actionOutlookGraph(args, action, context);
    }

    if (action === 'draft' || action === 'compose') {
        const requestedAccount = normalizeString(args.account || args.email || args.username || args.user);
        const providerId = normalizeString(
            args.provider || inferProviderFromAccount(requestedAccount) || resolveDefaultProviderFromContext(context),
            'qq'
        ).toLowerCase();
        const provider = PROVIDERS[providerId] || PROVIDERS.qq;
        const envProfile = resolveEnvSecret(provider.id, requestedAccount);
        const storedProfile = resolveContextEmailProfile(provider.id, requestedAccount || envProfile.account, context);
        return await draftMessage(
            {
                provider,
                account: normalizeString(
                    requestedAccount ||
                        storedProfile.account ||
                        storedProfile.email ||
                        envProfile.account ||
                        args.from ||
                        '未配置发件账号'
                ),
                secret: '',
                authType: 'none',
                mailbox: normalizeString(args.mailbox, 'INBOX')
            },
            args
        );
    }

    const config = resolveProviderConfig(args, context);
    if (config.error) {
        return config.error;
    }

    if (action === 'list' || action === 'search' || action === 'inbox') {
        return await listMessages(config, args);
    }
    if (action === 'read' || action === 'get') {
        return await readMessage(config, args);
    }
    if (action === 'send') {
        return await sendMessage(config, args, context);
    }
    if (['mark_read', 'mark_unread', 'move', 'delete'].includes(action)) {
        return await mutateMessage(config, args, context);
    }

    return createErrorResult('needs_config', `不支持的 email action：${action}`, {
        supportedActions: [
            'providers',
            'list',
            'read',
            'draft',
            'send',
            'mark_read',
            'mark_unread',
            'move',
            'delete',
            'oauth_authorize_url',
            'oauth_exchange_code',
            'oauth_refresh',
            'gmail_list_labels',
            'gmail_list_threads',
            'gmail_get_thread',
            'outlook_graph_messages',
            'outlook_graph_message',
            'outlook_graph_folders'
        ]
    });
}

module.exports = {
    EMAIL_TOOL_ID: 'email',
    PROVIDERS,
    executeEmailTool,
    inferProviderFromAccount,
    listProviderDetails,
    resolveProviderConfig
};
