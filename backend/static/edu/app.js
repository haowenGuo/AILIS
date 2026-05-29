const state = {
    status: null,
    me: null,
    student: null,
    teacher: null,
    teacherStudents: [],
    teacherClassrooms: null,
    questionBank: null,
    currentPage: 'login',
};

const app = document.querySelector('#app');
const toast = document.querySelector('#toast');

const heroImages = {
    auth: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80',
    dashboard: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80',
    courses: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1400&q=80',
    ecosystem: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
};

const subjectOptions = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];
const gradeOptions = ['初一', '初二', '初三', '高一', '高二', '高三'];
const learningPreferences = ['刷题 + 答疑', '听课 + 练习', '课堂互动 + 复盘', '专项冲刺 + 押题'];
const modules = [
    { slug: 'access-control', title: '准入与权限管理', stage: '课前建档', description: '实名注册、家长授权、电子协议与基础会员开通形成统一准入门槛。', outputs: ['学生档案 ID', '家长通知权限', '协议留痕', '账号风控'] },
    { slug: 'classroom-ai', title: '教室场景 AI 仿真人互动', stage: '课中互动', description: '人脸签到、姓名播报、多轮语音问答与课堂随机提问沉浸联动。', outputs: ['签到记录', '语音互动记录', '课堂参与度', '出勤台账'] },
    { slug: 'learning-profile', title: '学前学情智能画像', stage: '课前诊断', description: '基于分层测试与自评数据，生成知识点掌握图谱与能力层级。', outputs: ['学前分层', '薄弱点清单', '知识图谱', '推荐难度'] },
    { slug: 'homepage-adaptation', title: '首页个性化学习适配', stage: '学习路径', description: '首页按意向科目、难度偏好和会员等级重排学习内容。', outputs: ['首页排序', '科目优先级', '学习模式', '推荐清单'] },
    { slug: 'exam-courses', title: '专项课程教学', stage: '课程体系', description: '中考技巧提分与高考技巧提分双主线，覆盖考点、技巧与分层课程。', outputs: ['技巧课程', '学科专题', '分层课包', '应试模板'] },
    { slug: 'vip-system', title: '八级 VIP 会员体系', stage: '商业化', description: '八档会员权益对应课程深度、资源权限与服务颗粒度。', outputs: ['会员分层', '权益包', '教材版本库', '大模型能力授权'] },
    { slug: 'hardware-grading', title: '智能硬件对接批改', stage: '教学执行', description: '对接阅卷机、作业批改机、课堂大屏与答题器，自动回流数据。', outputs: ['自动阅卷', '主观题复核', '错题标注', '成绩同步'] },
    { slug: 'volunteer-planner', title: '中高考志愿填报辅助', stage: '升学规划', description: '结合分布式与互域式双模式，做志愿筛选、对比与风险评估。', outputs: ['志愿方案', '院校库', '风险评估', '政策更新'] },
    { slug: 'score-boost', title: '进阶拔高提分', stage: '高分冲刺', description: '压轴题、高阶题型、刷题技战术和名校笔记统一沉淀。', outputs: ['拔高题单', '冲刺训练', '名校笔记', '提分方法论'] },
    { slug: 'mock-papers', title: '中高考押题卷实战', stage: '考前冲刺', description: '以高仿真押题卷进行全真模拟，配套考后精准解析。', outputs: ['押题卷', '限时模拟', '考后解析', '同类题拓展'] },
    { slug: 'teacher-research', title: '教研团队专属管理', stage: '教研中台', description: '沉淀课件、教案、班级学情与教学复盘数据，支持内容审核。', outputs: ['教研资源库', '班级分层计划', '教学复盘', '内容审核流'] },
    { slug: 'family-collab', title: '家校协同教学', stage: '家校闭环', description: '让家长实时查看学习进度、课堂表现、作业提醒与升学通知。', outputs: ['家长端动态', '通知推送', '双向答疑', '学习时长记录'] },
    { slug: 'mistake-loop', title: '错题闭环复盘', stage: '课后巩固', description: '自动归集错题、推送同类题、做二次检测并完成掌握移除。', outputs: ['错题本', '同类题训练', '二次检测', '闭环掌握率'] },
];
const vipTiers = [
    { name: '基础会员', price: '0', audience: '首次进班学生', rights: ['单科基础学习', '基础学情测试', '基础课堂互动'], resources: ['公开课程', '基础练习题', '基础学情报告'] },
    { name: '初级会员', price: '366', audience: '双科补弱', rights: ['双科自选', '基础作业批改', '低难度课程'], resources: ['基础课件', '简单刷题卷', '常规课堂互动'] },
    { name: '高级会员', price: '899', audience: '三科稳步提升', rights: ['三科自选', '全难度基础课程', '自动阅卷'], resources: ['技巧基础课', '单元测试卷', '简易学情图谱'] },
    { name: '黄金会员', price: '2899', audience: '全科系统进阶', rights: ['全科基础权限', '中级课程', '动态学情报告'], resources: ['中等难度刷题卷', '名师基础笔记', '志愿填报基础服务'] },
    { name: '铂金会员', price: '6899', audience: '进阶突破', rights: ['全科进阶课程', '一对一仿真答疑', '拔高训练'], resources: ['名校中等笔记', '押题基础卷', '分布式志愿填报'] },
    { name: '钻石会员', price: '12899', audience: '高分冲刺', rights: ['高难度课程', '专属学习路径', '精细学情报告'], resources: ['名师名校原版笔记', '押题进阶卷', '硬件全对接'] },
    { name: '皇冠会员', price: '27999', audience: '定制化提升', rights: ['定制教学', '直播答疑', '专属拔高训练'], resources: ['内部押题卷', '独家刷题法', '一对一志愿规划'] },
    { name: '至尊会员', price: '38999', audience: '全流程升学陪跑', rights: ['终身全模块权限', '私人定制教学', '全程学情跟踪'], resources: ['绝密押题卷', '名师一对一复刻授课', '升学全流程服务'] },
];
const courseTracks = [
    { title: '中考技巧提分', description: '围绕中考核心考点做题型突破、时间分配和答题模板训练。', bullets: ['考点精讲', '技巧训练', '分层授课', '押题卷联动'] },
    { title: '高考技巧提分', description: '按高考真题命题规律组织课程，兼顾基础巩固与高分冲刺。', bullets: ['高频题型', '压轴题拆解', '应试节奏', '错题闭环'] },
    { title: '进阶拔高训练', description: '针对目标名校与高分突破学生，做高难度专项与思维迁移训练。', bullets: ['压轴题专训', '名校笔记', '刷题技战术', '一对一答疑'] },
    { title: '志愿规划与升学服务', description: '结合分数、位次、职业偏好与政策信息，输出可执行志愿方案。', bullets: ['稳冲保组合', '跨区域筛选', '风险评估', '政策提醒'] },
];
const ecosystemPanels = [
    { title: '智能硬件联动', description: '阅卷机、作业批改机、大屏、答题器与软件同步互联。', bullets: ['设备接入状态看板', '客观题秒批', '主观题 AI 预批', '班级批改报告'] },
    { title: '教研团队管理', description: '教学资源库、班级分层计划、教学复盘和内容审核都在一个中台完成。', bullets: ['资源共享', '教学复盘', '分层教学计划', '审核流程'] },
    { title: '家校协同', description: '家长端同步课堂表现、作业完成率、阶段测试与升学通知。', bullets: ['学习进度', '课堂提醒', '考试安排', '家长咨询'] },
    { title: '错题闭环', description: '自动归档错题，追踪二刷、三刷结果，确保知识点真正掌握。', bullets: ['错题本', '同类题练习', '掌握度复测', '移出清单'] },
];

const authPages = ['login', 'register', 'teacher-register'];
const studentNav = [
    { key: 'dashboard', label: '首页总览' },
    { key: 'classroom', label: '仿真课堂' },
    { key: 'diagnostics', label: '学情画像' },
    { key: 'practice', label: '我的练习' },
    { key: 'modules', label: '平台模块' },
    { key: 'courses', label: '课程与冲刺' },
    { key: 'vip', label: '会员体系' },
    { key: 'ecosystem', label: '教研与家校' },
];
const teacherNav = [
    { key: 'teacher-dashboard', label: '教师总控台' },
    { key: 'teacher-classroom', label: '课堂看板' },
    { key: 'teacher-question-bank', label: '真实题库派题' },
];
const adminNav = [
    ...studentNav,
    { key: 'teacher-dashboard', label: '教师总控台' },
    { key: 'teacher-classroom', label: '课堂看板' },
    { key: 'teacher-question-bank', label: '真实题库派题' },
];

function isTeacherLike(user) {
    return ['teacher', 'admin'].includes(user?.role);
}

function isAdmin(user) {
    return user?.role === 'admin';
}

function getNavigationForUser(user) {
    if (isAdmin(user)) {
        return adminNav;
    }
    return isTeacherLike(user) ? teacherNav : studentNav;
}

function isTeacherPage(page) {
    return teacherNav.some((item) => item.key === page);
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function formatDateTime(value) {
    if (!value) {
        return '';
    }
    try {
        return new Date(value).toLocaleString('zh-CN');
    } catch {
        return String(value);
    }
}

function buildPersonalPlan(user, diagnostics) {
    const weakestProfile = diagnostics.length
        ? [...diagnostics].sort((left, right) => Number(left.confidenceScore) - Number(right.confidenceScore))[0]
        : null;
    const anchorSubject = weakestProfile?.subject || user?.weakSubjects?.[0] || user?.favoriteSubjects?.[0] || '数学';

    return [
        {
            title: '准入建档完成度',
            detail: `当前账号已绑定家长 ${user?.parentName || '未填写'}，会员等级为 ${user?.vipLevel || '基础会员'}。`,
        },
        weakestProfile
            ? {
                title: `${weakestProfile.subject} 优先补弱`,
                detail: `${weakestProfile.masterySummary}，建议先完成 ${(weakestProfile.recommendedPath || [])[0] || '专项补弱' }。`,
            }
            : {
                title: '完成首轮学情画像',
                detail: `先用 ${anchorSubject} 做一轮自适应测试，系统会自动生成分层路径。`,
            },
        {
            title: `${user?.targetExam || '中高考'} 专项路径`,
            detail: `优先进入${user?.targetExam || '中高考'}技巧提分模块，并把 ${anchorSubject} 设为首页主科。`,
        },
        {
            title: '错题与家校闭环',
            detail: user?.parentNoticeOptIn
                ? '课堂、作业、测试数据会同步到家长端与教研台账。'
                : '建议开启家长通知，形成课后复盘与提醒闭环。',
        },
    ];
}

function buildDiagnosticsSnapshot(diagnostics) {
    return diagnostics.map((item) => ({
        subject: item.subject,
        level: item.currentLevel,
        score: item.confidenceScore,
        summary: item.masterySummary,
    }));
}

function getTierByName(name) {
    return vipTiers.find((tier) => tier.name === name) || vipTiers[0];
}

function getModuleGroups() {
    return modules.reduce((groups, item) => {
        const key = item.stage;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});
}

function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.style.background = isError ? '#8c3420' : '#10251a';
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.add('hidden'), 2800);
}

async function api(path, options = {}) {
    const config = {
        method: options.method || 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
    };

    if (options.body !== undefined) {
        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(path, config);
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
        const message = typeof payload === 'string'
            ? payload
            : payload.detail || payload.error?.message || '请求失败';
        throw new Error(message);
    }
    return payload.data ?? payload;
}

function getHashPage() {
    return window.location.hash.replace(/^#/, '').trim();
}

function setPage(page, rerender = true) {
    state.currentPage = page;
    history.replaceState(null, '', `/edu#${page}`);
    if (rerender) {
        render();
    }
}

function resolvePageForState(candidate) {
    const currentUser = state.me?.user;
    if (!currentUser) {
        return authPages.includes(candidate) ? candidate : 'login';
    }
    if (isAdmin(currentUser)) {
        return adminNav.some((item) => item.key === candidate) ? candidate : 'dashboard';
    }
    if (isTeacherLike(currentUser)) {
        return teacherNav.some((item) => item.key === candidate) ? candidate : 'teacher-dashboard';
    }
    return studentNav.some((item) => item.key === candidate) ? candidate : 'dashboard';
}

function updateBodyClass() {
    document.body.className = state.me?.user ? 'app-page' : 'auth-page';
}

function buildFormPayload(form) {
    const payload = {};
    const checkboxMap = new Map();

    for (const element of Array.from(form.elements)) {
        if (!element.name || element.disabled) {
            continue;
        }
        const tagName = element.tagName.toLowerCase();
        const type = (element.type || '').toLowerCase();

        if (type === 'checkbox') {
            if (!checkboxMap.has(element.name)) {
                checkboxMap.set(element.name, []);
            }
            checkboxMap.get(element.name).push(element);
            continue;
        }

        if (type === 'radio') {
            if (element.checked) {
                payload[element.name] = element.value;
            } else if (!(element.name in payload)) {
                payload[element.name] = '';
            }
            continue;
        }

        if (tagName === 'select' && element.multiple) {
            payload[element.name] = Array.from(element.options).filter((item) => item.selected).map((item) => item.value);
            continue;
        }

        payload[element.name] = element.value;
    }

    checkboxMap.forEach((elements, name) => {
        if (elements.length === 1 && elements[0].value === 'on') {
            payload[name] = elements[0].checked;
        } else {
            payload[name] = elements.filter((item) => item.checked).map((item) => item.value);
        }
    });

    return payload;
}

async function loadStatus() {
    state.status = await api('/api/edu/system/status');
}

async function loadMe() {
    state.me = await api('/api/edu/me');
}

async function loadStudentData() {
    state.student = await api('/api/edu/student/overview');
}

async function loadTeacherData() {
    const teacher = state.me?.user || {};
    const presetSubject = state.questionBank?.filters?.subject || teacher.managedSubjects?.[0] || '数学';
    const [overview, students, classrooms, questionBank] = await Promise.all([
        api('/api/edu/teacher/overview'),
        api('/api/edu/teacher/students'),
        api('/api/edu/teacher/classroom-sessions'),
        api(`/api/edu/teacher/question-bank?subject=${encodeURIComponent(presetSubject)}&limit=12`),
    ]);
    state.teacher = overview;
    state.teacherStudents = students;
    state.teacherClassrooms = classrooms;
    state.questionBank = questionBank;
}

async function refreshSessionData() {
    await loadMe();
    const currentUser = state.me?.user;
    if (!currentUser) {
        state.student = null;
        state.teacher = null;
        state.teacherStudents = [];
        state.teacherClassrooms = null;
        state.questionBank = null;
    } else if (isAdmin(currentUser)) {
        await Promise.all([loadStudentData(), loadTeacherData()]);
    } else if (isTeacherLike(currentUser)) {
        await loadTeacherData();
    } else {
        await loadStudentData();
    }
    state.currentPage = resolvePageForState(getHashPage() || state.currentPage);
}

function renderAuthLogin() {
    return `
        <main class="auth-layout" style="--hero-image: url('${heroImages.auth}');">
            <section class="auth-hero">
                <div class="auth-copy">
                    <span class="eyebrow">教室专用软件入口</span>
                    <h1>把课堂互动、学情诊断和提分路径放进一个系统。</h1>
                    <p>先完成学生建档和家长授权，再进入仿真人互动课堂、学情画像、专项课程和教研闭环。</p>
                    <ul class="auth-points">
                        <li>注册即开通基础会员</li>
                        <li>支持中考 / 高考双升学主线</li>
                        <li>已接入教师端与真实题库派题链路</li>
                    </ul>
                </div>
            </section>
            <section class="auth-panel">
                <div class="form-intro">
                    <span class="eyebrow">账号登录</span>
                    <h2>进入课堂总控台</h2>
                    <p>未注册的新学员先完成学生与家长档案建档。</p>
                </div>
                <form class="stack-form" data-form="login">
                    <label>
                        <span>邮箱</span>
                        <input type="email" name="email" placeholder="student@example.com" required />
                    </label>
                    <label>
                        <span>密码</span>
                        <input type="password" name="password" placeholder="至少 6 位" required />
                    </label>
                    <div class="admin-login-hint">
                        <strong>管理员入口</strong>
                        <span>邮箱：admin@simclass.local</span>
                        <span>默认密码：Admin@123456，可用 Render 环境变量 EDU_ADMIN_PASSWORD 覆盖</span>
                    </div>
                    <button type="submit" class="primary-button">登录进入系统</button>
                </form>
                <div class="auth-footer">
                    <span>还没有账号？</span>
                    <a href="#register" data-page="register">立即注册建档</a>
                </div>
                <div class="auth-footer">
                    <span>教师开通后台？</span>
                    <a href="#teacher-register" data-page="teacher-register">进入教师注册</a>
                </div>
            </section>
        </main>
    `;
}

function renderAuthRegister() {
    return `
        <main class="auth-layout register-layout" style="--hero-image: url('${heroImages.auth}');">
            <section class="auth-hero">
                <div class="auth-copy">
                    <span class="eyebrow">学生准入建档</span>
                    <h1>先把学生、家长、学习目标和协议一次建好。</h1>
                    <p>注册完成后默认加入基础会员，系统会根据年级、薄弱学科和目标考试自动生成首页推荐。</p>
                </div>
            </section>
            <section class="auth-panel wide-panel">
                <div class="form-intro">
                    <span class="eyebrow">注册建档</span>
                    <h2>学生与家长信息</h2>
                    <p>这部分信息会同步到学情、课堂、批改与家校协同模块。</p>
                </div>
                <form class="stack-form" data-form="student-register">
                    <div class="two-column">
                        <label><span>学生姓名</span><input type="text" name="fullName" required /></label>
                        <label><span>邮箱</span><input type="email" name="email" required /></label>
                        <label><span>联系电话</span><input type="text" name="phone" required /></label>
                        <label>
                            <span>年级</span>
                            <select name="grade" required>
                                <option value="">请选择</option>
                                ${gradeOptions.map((item) => `<option value="${item}">${item}</option>`).join('')}
                            </select>
                        </label>
                        <label><span>学校</span><input type="text" name="schoolName" required /></label>
                        <label><span>班级</span><input type="text" name="className" required /></label>
                    </div>
                    <div class="two-column">
                        <label>
                            <span>目标考试</span>
                            <select name="targetExam">
                                <option value="中考">中考</option>
                                <option value="高考">高考</option>
                            </select>
                        </label>
                        <label>
                            <span>偏好学习方式</span>
                            <select name="learningPreference">
                                ${learningPreferences.map((item) => `<option value="${item}">${item}</option>`).join('')}
                            </select>
                        </label>
                    </div>
                    <div class="form-block">
                        <span>意向学习科目</span>
                        <div class="chip-row">
                            ${subjectOptions.map((subject) => `
                                <label class="chip-option">
                                    <input type="checkbox" name="favoriteSubjects" value="${subject}" />
                                    <span>${subject}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="form-block">
                        <span>当前薄弱科目</span>
                        <div class="chip-row">
                            ${subjectOptions.map((subject) => `
                                <label class="chip-option">
                                    <input type="checkbox" name="weakSubjects" value="${subject}" />
                                    <span>${subject}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <label>
                        <span>目标学习内容</span>
                        <textarea name="goalSummary" rows="3" placeholder="例如：希望 3 个月内把数学和英语从薄弱变成班级中上水平。"></textarea>
                    </label>
                    <div class="two-column">
                        <label><span>家长姓名</span><input type="text" name="parentName" required /></label>
                        <label><span>家长联系电话</span><input type="text" name="parentPhone" required /></label>
                    </div>
                    <div class="check-stack">
                        <label class="check-line">
                            <input type="checkbox" name="parentNoticeOptIn" checked />
                            <span>开启家长通知权限</span>
                        </label>
                        <label class="check-line">
                            <input type="checkbox" name="agreementAccepted" required />
                            <span>我已阅读并确认学习服务自愿协议书</span>
                        </label>
                    </div>
                    <div class="two-column">
                        <label><span>登录密码</span><input type="password" name="password" required /></label>
                        <label><span>确认密码</span><input type="password" name="confirmPassword" required /></label>
                    </div>
                    <button type="submit" class="primary-button">完成注册并进入系统</button>
                </form>
                <div class="auth-footer">
                    <span>已经注册过？</span>
                    <a href="#login" data-page="login">返回登录</a>
                </div>
            </section>
        </main>
    `;
}

function renderTeacherRegister() {
    return `
        <main class="auth-layout register-layout" style="--hero-image: url('${heroImages.ecosystem}');">
            <section class="auth-hero">
                <div class="auth-copy">
                    <span class="eyebrow">教师端开通</span>
                    <h1>给教师一个能看学生、搜真题、直接派题的总控入口。</h1>
                    <p>注册成功后将进入教师总控台，可查看学生名单、学习画像和真实题库结果，并把题目派发到学生端。</p>
                </div>
            </section>
            <section class="auth-panel wide-panel">
                <div class="form-intro">
                    <span class="eyebrow">教师注册</span>
                    <h2>校区与任教学科信息</h2>
                    <p>这里通过教师邀请码控制后台开通，不影响学生注册入口。</p>
                </div>
                <form class="stack-form" data-form="teacher-register">
                    <div class="two-column">
                        <label><span>教师姓名</span><input type="text" name="fullName" required /></label>
                        <label><span>邮箱</span><input type="email" name="email" required /></label>
                        <label><span>联系电话</span><input type="text" name="phone" required /></label>
                        <label><span>教师头衔</span><input type="text" name="teacherTitle" placeholder="例如：数学主讲教师" required /></label>
                        <label><span>校区 / 学校</span><input type="text" name="schoolName" required /></label>
                        <label><span>任教班级</span><input type="text" name="className" placeholder="例如：初三 1-4 班" /></label>
                    </div>
                    <div class="form-block">
                        <span>负责学科</span>
                        <div class="chip-row">
                            ${subjectOptions.map((subject) => `
                                <label class="chip-option">
                                    <input type="checkbox" name="managedSubjects" value="${subject}" />
                                    <span>${subject}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="form-block">
                        <span>负责年级</span>
                        <div class="chip-row">
                            ${gradeOptions.map((grade) => `
                                <label class="chip-option">
                                    <input type="checkbox" name="managedGrades" value="${grade}" />
                                    <span>${grade}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="two-column">
                        <label><span>教师邀请码</span><input type="password" name="inviteCode" required /></label>
                        <label><span>登录密码</span><input type="password" name="password" required /></label>
                    </div>
                    <label><span>确认密码</span><input type="password" name="confirmPassword" required /></label>
                    <button type="submit" class="primary-button">开通教师总控台</button>
                </form>
                <div class="auth-footer">
                    <span>已有账号？</span>
                    <a href="#login" data-page="login">返回登录</a>
                </div>
            </section>
        </main>
    `;
}

function renderHeroPage({ heroImage, eyebrow, heading, subheading, content }) {
    return `
        <div class="page-shell">
            <header class="page-top has-image" style="--hero-image: url('${heroImage}');">
                <button type="button" class="nav-toggle" data-action="toggle-nav">菜单</button>
                <div class="page-top-copy">
                    <span class="eyebrow">${escapeHtml(eyebrow)}</span>
                    <h1>${escapeHtml(heading)}</h1>
                    <p>${escapeHtml(subheading)}</p>
                </div>
            </header>
            <main class="page-content">
                ${content}
            </main>
        </div>
    `;
}

function renderSidebar(user, navigation) {
    const roleLabel = isAdmin(user)
        ? '平台管理员 · 全权限'
        : user.role === 'teacher'
            ? `${user.teacherTitle || '教师'} · 教师端`
            : `${user.grade} · ${user.vipLevel}`;

    return `
        <aside class="sidebar" data-sidebar>
            <div class="sidebar-top">
                <a class="brand" href="#${navigation[0]?.key || 'dashboard'}" data-page="${navigation[0]?.key || 'dashboard'}">
                    <span class="brand-kicker">教室专用软件</span>
                    <strong>${escapeHtml(state.status?.appName || '仿真教学平台')}</strong>
                </a>
                <div class="sidebar-user">
                    <p>${escapeHtml(user.fullName)}</p>
                    <span>${escapeHtml(roleLabel)}</span>
                </div>
            </div>
            <nav class="sidebar-nav">
                ${navigation.map((item) => `
                    <a href="#${item.key}" data-page="${item.key}" class="${state.currentPage === item.key ? 'active' : ''}">
                        ${escapeHtml(item.label)}
                    </a>
                `).join('')}
            </nav>
            <div class="sidebar-logout">
                <button type="button" class="ghost-button" data-action="logout">退出登录</button>
            </div>
        </aside>
    `;
}

function renderStudentDashboard() {
    const overview = state.student || {};
    const currentUser = overview.student || state.me?.user || {};
    const diagnostics = overview.learning?.diagnostics || [];
    const assignments = overview.assignments?.recent || [];
    const classroomSessions = overview.classrooms?.recent || [];
    const diagnosticCards = buildDiagnosticsSnapshot(diagnostics);
    const tier = getTierByName(currentUser.vipLevel);
    const planItems = buildPersonalPlan(currentUser, diagnostics);

    return renderHeroPage({
        heroImage: heroImages.dashboard,
        eyebrow: '首页总览',
        heading: '围绕课堂、学情、提分和升学的一体化工作台',
        subheading: '系统会根据学生档案、学情结果和目标考试动态调整首页内容。',
        content: `
            <section class="hero-band">
                <div>
                    <span class="eyebrow">当前学习角色</span>
                    <h2>${escapeHtml(currentUser.fullName || '')} · ${escapeHtml(currentUser.grade || '')} · ${escapeHtml(currentUser.targetExam || '')}</h2>
                    <p>当前偏好：${escapeHtml(currentUser.learningPreference || '')}。系统已按照 ${escapeHtml(currentUser.vipLevel || '基础会员')} 权限开放首页模块。</p>
                </div>
                <div class="metric-strip">
                    <article><strong>${escapeHtml(tier.name)}</strong><span>会员等级</span></article>
                    <article><strong>${diagnosticCards.length}</strong><span>已建学科画像</span></article>
                    <article><strong>${assignments.length}</strong><span>教师已派练习</span></article>
                </div>
            </section>
            <section class="content-grid two-up">
                <article class="panel">
                    <div class="section-heading"><span class="eyebrow">今日优先事项</span><h3>系统推荐学习路径</h3></div>
                    <div class="step-list">
                        ${planItems.map((item, index) => `
                            <article>
                                <strong>0${index + 1}</strong>
                                <div><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.detail)}</p></div>
                            </article>
                        `).join('')}
                    </div>
                </article>
                <article class="panel">
                    <div class="section-heading"><span class="eyebrow">仿真课堂</span><h3>课堂状态</h3></div>
                    ${classroomSessions.length ? `
                        <div class="timeline">
                            ${classroomSessions.slice(0, 3).map((session, index) => `
                                <article>
                                    <strong>0${index + 1}</strong>
                                    <p>${escapeHtml(session.subject)} · ${escapeHtml(session.status === 'active' ? '进行中' : '已结束')} · 已答 ${escapeHtml(session.attemptedCount)} 次，答对 ${escapeHtml(session.correctCount)} 题。</p>
                                </article>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="empty-state">
                            <p>还没有开启过仿真课堂，系统会按你的学情和真题自动组织一节互动课。</p>
                            <a class="primary-button inline-button" href="#classroom" data-page="classroom">进入课堂</a>
                        </div>
                    `}
                </article>
            </section>
            <section class="content-grid two-up">
                <article class="panel">
                    <div class="section-heading"><span class="eyebrow">课堂快照</span><h3>仿真人互动流程</h3></div>
                    <div class="timeline">
                        <article><strong>01</strong><p>进教室即刷脸签到，语音播报姓名并打上当前学情标签。</p></article>
                        <article><strong>02</strong><p>课堂中 AI 主动追问、随机点名、即时答疑，模拟真人授课节奏。</p></article>
                        <article><strong>03</strong><p>作业与测验自动回流到学情模块，错题直接进入闭环复盘。</p></article>
                    </div>
                </article>
                <article class="panel">
                    <div class="section-heading"><span class="eyebrow">课堂动作</span><h3>这一节课会发生什么</h3></div>
                    <div class="timeline">
                        <article><strong>01</strong><p>系统先按姓名完成仿真点名，再根据薄弱学科选出本节主题。</p></article>
                        <article><strong>02</strong><p>仿真教师直接调用真题发问，你作答后会即时得到讲评与追问。</p></article>
                        <article><strong>03</strong><p>课堂结束后保留全过程记录，方便后续复盘与教师查看。</p></article>
                    </div>
                </article>
            </section>
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">学情摘要</span><h3>当前学科分层状态</h3></div>
                ${diagnosticCards.length ? `
                    <div class="card-grid three-up">
                        ${diagnosticCards.map((item) => `
                            <article class="metric-card">
                                <div class="metric-head"><h4>${escapeHtml(item.subject)}</h4><span>${escapeHtml(item.level)}</span></div>
                                <div class="score-bar"><span style="width: ${escapeHtml(item.score)}%"></span></div>
                                <strong>${escapeHtml(item.score)} 分</strong>
                                <p>${escapeHtml(item.summary)}</p>
                            </article>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <p>你还没有完成任何学科画像，先去“学情画像”页做第一轮自适应诊断。</p>
                        <a class="primary-button inline-button" href="#diagnostics" data-page="diagnostics">开始诊断</a>
                    </div>
                `}
            </section>
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">教师派题</span><h3>最新练习包</h3></div>
                ${assignments.length ? `
                    <div class="card-grid three-up">
                        ${assignments.slice(0, 3).map((assignment) => `
                            <article class="feature-card">
                                <span class="pill">${escapeHtml(assignment.subject)}</span>
                                <h4>${escapeHtml(assignment.title)}</h4>
                                <p>${escapeHtml(assignment.notes || '已从真实题库生成，进入练习页即可查看全部题目。')}</p>
                                <ul class="tiny-list">
                                    <li>${escapeHtml(assignment.questionCount)} 道题</li>
                                    <li>${escapeHtml(formatDateTime(assignment.createdAt))} 派发</li>
                                    <li>来源：${escapeHtml(assignment.source?.dataset || '')}</li>
                                </ul>
                            </article>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <p>教师端还没有给你派发真题练习，完成学情画像后，教师可以按学科直接派题。</p>
                        <a class="primary-button inline-button" href="#practice" data-page="practice">打开练习页</a>
                    </div>
                `}
            </section>
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">模块联动</span><h3>平台核心模块预览</h3></div>
                <div class="card-grid four-up">
                    ${modules.slice(0, 8).map((item) => `
                        <article class="feature-card">
                            <span class="pill">${escapeHtml(item.stage)}</span>
                            <h4>${escapeHtml(item.title)}</h4>
                            <p>${escapeHtml(item.description)}</p>
                            <ul class="tiny-list">${item.outputs.slice(0, 3).map((output) => `<li>${escapeHtml(output)}</li>`).join('')}</ul>
                        </article>
                    `).join('')}
                </div>
            </section>
        `,
    });
}

function renderStudentClassroom() {
    const overview = state.student || {};
    const diagnostics = overview.learning?.diagnostics || [];
    const classroomSessions = overview.classrooms?.recent || [];
    const activeSession = overview.classrooms?.activeSession || classroomSessions[0] || null;
    const activeQuestion = activeSession?.status === 'active' ? activeSession.currentQuestion : null;
    const blackboard = `
        <section class="simulation-classroom">
            <div class="classroom-ambient" aria-hidden="true"></div>
            <article class="knowledge-blackboard classroom-board-only">
                <span class="chalk-mark"></span>
                <h2>基于EMBER-Agent安全增强的仿真课堂</h2>
                ${activeQuestion ? `
                    <form class="blackboard-question-form" data-form="classroom-respond">
                        <input type="hidden" name="sessionId" value="${escapeHtml(activeSession.id)}" />
                        <input type="hidden" name="freeText" value="" />
                        <h3>课堂问题</h3>
                        <p class="blackboard-question">${escapeHtml(activeQuestion.stem || '')}</p>
                        <div class="blackboard-choice-list">
                            ${(activeQuestion.choices || []).map((choice, index) => `
                                <label class="blackboard-choice">
                                    <input type="radio" name="selectedChoiceIndex" value="${index}" />
                                    <span><strong>${String.fromCharCode(65 + index)}.</strong> ${escapeHtml(choice)}</span>
                                </label>
                            `).join('')}
                        </div>
                        <button type="submit" class="blackboard-submit">提交答案</button>
                    </form>
                ` : `
                    <div class="blackboard-empty">
                        <h3>尚未生成课堂问题</h3>
                        <p>请先点击下方“开始仿真课堂”，题目和答案选项会显示在这块木框黑板上。</p>
                    </div>
                `}
            </article>
        </section>
    `;

    return renderHeroPage({
        heroImage: heroImages.dashboard,
        eyebrow: '仿真课堂',
        heading: '按学情、真题和课堂追问组织一节可连续互动的仿真课',
        subheading: '系统会先做点名，再用真实题目讲解、追问、判答和留存课堂记录。',
        content: `
            ${blackboard}
            <section class="hero-band">
                <div>
                    <span class="eyebrow">当前课堂状态</span>
                    <h2>${activeSession ? `${escapeHtml(activeSession.subject)} · ${escapeHtml(activeSession.status === 'active' ? '进行中' : '已结束')}` : '尚未开启课堂'}</h2>
                    <p>${activeSession ? escapeHtml(activeSession.focusSummary || '') : '先选择学科并开启课堂，系统会结合你的学情画像和真题自动生成一节仿真互动课。'}</p>
                </div>
                <div class="metric-strip">
                    <article><strong>${classroomSessions.length}</strong><span>课堂总数</span></article>
                    <article><strong>${classroomSessions.filter((item) => item.status === 'active').length}</strong><span>进行中</span></article>
                    <article><strong>${classroomSessions.filter((item) => item.status === 'completed').length}</strong><span>已结束</span></article>
                </div>
            </section>
            <section class="content-grid two-up">
                <article class="panel">
                    <div class="section-heading"><span class="eyebrow">开启新课</span><h3>创建一节新的仿真课堂</h3></div>
                    <form class="stack-form" data-form="classroom-start">
                        <div class="two-column">
                            <label>
                                <span>学科</span>
                                <select name="subject">${subjectOptions.map((subject) => `<option value="${subject}">${subject}</option>`).join('')}</select>
                            </label>
                            <label><span>课堂主题</span><input type="text" name="topic" placeholder="例如：函数图像基础判断" /></label>
                        </div>
                        <button type="submit" class="primary-button">开始仿真课堂</button>
                    </form>
                </article>
                <article class="panel">
                    <div class="section-heading"><span class="eyebrow">学情锚点</span><h3>当前可用于课堂调节的诊断信息</h3></div>
                    ${diagnostics.length ? `
                        <div class="card-grid two-up">
                            ${diagnostics.slice(0, 4).map((item) => `
                                <article class="feature-card">
                                    <span class="pill">${escapeHtml(item.currentLevel)}</span>
                                    <h4>${escapeHtml(item.subject)}</h4>
                                    <p>${escapeHtml(item.masterySummary)}</p>
                                </article>
                            `).join('')}
                        </div>
                    ` : '<p class="muted-text">还没有学情画像，仿真课堂会先按注册偏好和弱科信息进行保守引导。</p>'}
                </article>
            </section>
            ${activeSession ? `
                <section class="content-grid two-up">
                    <article class="panel">
                        <div class="section-heading"><span class="eyebrow">课堂实录</span><h3>仿真教师与学生对话</h3></div>
                        <div class="transcript-stream">
                            ${(activeSession.transcript || []).map((entry) => `
                                <article class="transcript-bubble ${escapeHtml(entry.role)}">
                                    <span>${escapeHtml(entry.role === 'teacher' ? '仿真教师' : entry.role === 'student' ? '学生' : '系统')}</span>
                                    <p>${escapeHtml(entry.text)}</p>
                                </article>
                            `).join('')}
                        </div>
                    </article>
                    <article class="panel">
                        <div class="section-heading"><span class="eyebrow">课堂互动</span><h3>当前作答区</h3></div>
                        ${activeSession.status === 'active' && activeSession.currentQuestion ? `
                            <div class="question-stage">
                                <span class="pill">${escapeHtml(activeSession.subject)}</span>
                                <h4>${escapeHtml(activeSession.currentQuestion.stem || '')}</h4>
                                <form class="stack-form" data-form="classroom-respond">
                                    <div class="choice-picks">
                                        ${(activeSession.currentQuestion.choices || []).map((choice, index) => `
                                            <label class="choice-pick">
                                                <input type="radio" name="selectedChoiceIndex" value="${index}" />
                                                <span><strong>${String.fromCharCode(65 + index)}.</strong> ${escapeHtml(choice)}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                    <label>
                                        <span>课堂追问 / 理解困难</span>
                                        <textarea name="freeText" rows="4" placeholder="例如：我不太明白为什么不能选 B。"></textarea>
                                    </label>
                                    <input type="hidden" name="sessionId" value="${escapeHtml(activeSession.id)}" />
                                    <div class="button-row">
                                        <button type="submit" class="primary-button">提交课堂作答</button>
                                        <button type="button" class="ghost-button" data-action="complete-classroom" data-session-id="${escapeHtml(activeSession.id)}">结束本节课堂</button>
                                    </div>
                                </form>
                            </div>
                        ` : `
                            <div class="empty-state">
                                <p>这节课堂已经结束，可以回看记录或重新开启下一节课。</p>
                                <a class="primary-button inline-button" href="#classroom" data-page="classroom">再开一节</a>
                            </div>
                        `}
                    </article>
                </section>
            ` : ''}
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">课堂历史</span><h3>最近课堂记录</h3></div>
                ${classroomSessions.length ? `
                    <div class="card-grid three-up">
                        ${classroomSessions.map((session) => `
                            <article class="feature-card">
                                <span class="pill">${escapeHtml(session.status === 'active' ? '进行中' : '已结束')}</span>
                                <h4>${escapeHtml(session.subject)}</h4>
                                <p>${escapeHtml(session.topic || '默认仿真带练')}</p>
                                <ul class="tiny-list">
                                    <li>作答次数：${escapeHtml(session.attemptedCount)}</li>
                                    <li>答对题数：${escapeHtml(session.correctCount)}</li>
                                    <li><a href="#classroom" data-page="classroom">打开课堂记录</a></li>
                                </ul>
                            </article>
                        `).join('')}
                    </div>
                ` : '<p class="muted-text">还没有课堂历史，开始第一节课后这里会保留每次课堂的过程与结果。</p>'}
            </section>
        `,
    });
}

function renderDiagnostics() {
    const overview = state.student || {};
    const currentUser = overview.student || state.me?.user || {};
    const diagnostics = overview.learning?.diagnostics || [];

    return renderHeroPage({
        heroImage: heroImages.dashboard,
        eyebrow: '学情画像',
        heading: '把学前测试、课后数据和错题闭环收束成同一张图',
        subheading: '这个模版先做了可运行的自适应诊断骨架，后续可以接入真实题库和动态出题引擎。',
        content: `
            <section class="content-grid two-up">
                <article class="panel">
                    <div class="section-heading"><span class="eyebrow">诊断录入</span><h3>生成或更新单学科学情画像</h3></div>
                    <form class="stack-form" data-form="diagnostic">
                        <input type="hidden" name="gradeBand" value="${escapeHtml(currentUser.grade || '')}" />
                        <label>
                            <span>学科</span>
                            <select name="subject" required>${subjectOptions.map((subject) => `<option value="${subject}">${subject}</option>`).join('')}</select>
                        </label>
                        <div class="two-column">
                            <label><span>近期基线分数（满分 150）</span><input type="number" min="0" max="150" name="baselineScore" value="96" required /></label>
                            <label>
                                <span>课堂自信度（1-10）</span>
                                <input type="number" min="1" max="10" name="confidenceLevel" value="6" />
                            </label>
                            <label><span>作业完成率</span><input type="number" min="0" max="100" name="homeworkCompletion" value="78" required /></label>
                            <label><span>错题复盘完成率</span><input type="number" min="0" max="100" name="mistakeRecovery" value="66" required /></label>
                        </div>
                        <label><span>薄弱知识点（逗号分隔）</span><textarea name="weakPoints" rows="3" placeholder="例如：函数图像，阅读理解，电学实验">函数图像，审题速度</textarea></label>
                        <div class="button-row">
                            <button type="submit" class="primary-button">生成学情画像</button>
                            <button type="button" class="ghost-button" data-action="demo-fill">填充演示数据</button>
                        </div>
                    </form>
                </article>
                <article class="panel">
                    <div class="section-heading"><span class="eyebrow">自适应逻辑</span><h3>预留的教学闭环</h3></div>
                    <div class="timeline">
                        <article><strong>01</strong><p>先采集基础分、课堂反馈、作业和错题复盘情况，形成初始分层。</p></article>
                        <article><strong>02</strong><p>根据结果升降难度，后续可以直接接入真正的测试卷生成与判分引擎。</p></article>
                        <article><strong>03</strong><p>画像结果会影响首页推荐、专项课程入口、错题推送和家长端提醒。</p></article>
                    </div>
                </article>
            </section>
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">当前画像</span><h3>已保存的学科结果</h3></div>
                ${diagnostics.length ? `
                    <div class="card-grid three-up">
                        ${diagnostics.map((item) => `
                            <article class="feature-card">
                                <span class="pill">${escapeHtml(item.currentLevel)}</span>
                                <h4>${escapeHtml(item.subject)}</h4>
                                <p>${escapeHtml(item.masterySummary)}</p>
                                <ul class="tiny-list">${(item.recommendedPath || []).map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ul>
                            </article>
                        `).join('')}
                    </div>
                ` : '<p class="muted-text">还没有保存记录，先提交一轮诊断。</p>'}
            </section>
        `,
    });
}

function renderPractice() {
    const overview = state.student || {};
    const assignments = overview.assignments?.recent || [];
    const source = state.status?.questionBankSource || {};

    return renderHeroPage({
        heroImage: heroImages.courses,
        eyebrow: '我的练习',
        heading: '教师派发的真题练习都在这里统一查看',
        subheading: '当前练习包来自公开真实题库，可继续接入自动判分、提交记录和错题回流。',
        content: `
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">练习总览</span><h3>当前题源</h3></div>
                <div class="metric-strip">
                    <article><strong>${assignments.length}</strong><span>练习包数量</span></article>
                    <article><strong>${escapeHtml(source.dataset || '-')}</strong><span>题库数据集</span></article>
                    <article><strong>${escapeHtml(source.config || '-')} / ${escapeHtml(source.split || '-')}</strong><span>当前题源配置</span></article>
                </div>
            </section>
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">练习包</span><h3>教师最近派发</h3></div>
                ${assignments.length ? `
                    <div class="assignment-stack">
                        ${assignments.map((assignment) => `
                            <article class="assignment-card">
                                <div class="assignment-head">
                                    <div>
                                        <span class="pill">${escapeHtml(assignment.subject)}</span>
                                        <h4>${escapeHtml(assignment.title)}</h4>
                                    </div>
                                    <strong>${escapeHtml(assignment.questionCount)} 题</strong>
                                </div>
                                <p>${escapeHtml(assignment.notes || '已生成练习包，可逐题查看。')}</p>
                                <div class="tiny-meta">
                                    <span>${escapeHtml(formatDateTime(assignment.createdAt))}</span>
                                    <span>${escapeHtml(assignment.source?.dataset || '')}</span>
                                </div>
                                <div class="question-list">
                                    ${(assignment.questions || []).map((question, index) => `
                                        <details class="question-detail">
                                            <summary><span>第 ${index + 1} 题</span><span>${escapeHtml(question.subject || '')}</span></summary>
                                            <div class="question-body">
                                                <p>${escapeHtml(question.stem || '')}</p>
                                                <ol class="choice-list">${(question.choices || []).map((choice) => `<li>${escapeHtml(choice)}</li>`).join('')}</ol>
                                                <div class="answer-box"><strong>参考答案：</strong><span>${escapeHtml(question.answerText || `第 ${Number(question.answerIndex) + 1} 项`)}</span></div>
                                            </div>
                                        </details>
                                    `).join('')}
                                </div>
                            </article>
                        `).join('')}
                    </div>
                ` : '<p class="muted-text">教师端暂时还没有派发练习，完成学情画像后会更容易按学科精准派题。</p>'}
            </section>
        `,
    });
}

function renderModules() {
    const groups = getModuleGroups();
    return renderHeroPage({
        heroImage: heroImages.dashboard,
        eyebrow: '平台模块',
        heading: '把课前、课中、课后、教研和升学串成完整体系',
        subheading: '这里按教学链路把 13 个模块拆开，方便你继续细化角色权限、接口和页面。',
        content: `
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">全局框架</span><h3>九大主链路 + 新增三大闭环</h3></div>
                <div class="stage-grid">
                    ${Object.entries(groups).map(([stage, items]) => `
                        <section class="stage-column">
                            <div class="stage-head"><span class="pill">${escapeHtml(stage)}</span><h4>${items.length} 个模块</h4></div>
                            ${items.map((item) => `
                                <article class="stage-card">
                                    <h5>${escapeHtml(item.title)}</h5>
                                    <p>${escapeHtml(item.description)}</p>
                                    <ul class="tiny-list">${item.outputs.map((output) => `<li>${escapeHtml(output)}</li>`).join('')}</ul>
                                </article>
                            `).join('')}
                        </section>
                    `).join('')}
                </div>
            </section>
        `,
    });
}

function renderCourses() {
    return renderHeroPage({
        heroImage: heroImages.courses,
        eyebrow: '课程与冲刺',
        heading: '课程体系从技巧提分延展到志愿与押题卷',
        subheading: '当前模版已经把中考、高考、拔高和升学服务四条路径拆开，方便后续接课程库与题库。',
        content: `
            <section class="card-grid two-up">
                ${courseTracks.map((track) => `
                    <article class="panel">
                        <div class="section-heading"><span class="eyebrow">专项路径</span><h3>${escapeHtml(track.title)}</h3></div>
                        <p>${escapeHtml(track.description)}</p>
                        <ul class="tiny-list">${track.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
                    </article>
                `).join('')}
            </section>
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">课程序列</span><h3>建议的用户进阶节奏</h3></div>
                <div class="timeline">
                    <article><strong>01</strong><p>基础会员完成准入建档与首轮学情测试，首页自动排出主攻科目。</p></article>
                    <article><strong>02</strong><p>进入中考 / 高考技巧课和专项题型包，按基础、进阶、拔高三层推进。</p></article>
                    <article><strong>03</strong><p>用押题卷、错题复盘、名校笔记和志愿规划收束到考前冲刺阶段。</p></article>
                </div>
            </section>
        `,
    });
}

function renderVip() {
    const currentUser = state.student?.student || state.me?.user || {};
    return renderHeroPage({
        heroImage: heroImages.courses,
        eyebrow: '会员体系',
        heading: '八级 VIP 权益覆盖课程深度、资源权限和升学服务颗粒度',
        subheading: '这里先把你的会员分层方案转成了可展示的权益矩阵，后续可继续接入支付和订单。',
        content: `
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">当前会员</span><h3>${escapeHtml(currentUser.vipLevel || '基础会员')}</h3></div>
                <div class="card-grid four-up">
                    ${vipTiers.map((tier) => `
                        <article class="feature-card ${currentUser.vipLevel === tier.name ? 'featured' : ''}">
                            <span class="pill">¥ ${escapeHtml(tier.price)}</span>
                            <h4>${escapeHtml(tier.name)}</h4>
                            <p>${escapeHtml(tier.audience)}</p>
                            <ul class="tiny-list">${tier.rights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
                        </article>
                    `).join('')}
                </div>
            </section>
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">资源映射</span><h3>专属资源权限</h3></div>
                <div class="card-grid two-up">
                    ${vipTiers.map((tier) => `
                        <article class="feature-card">
                            <h4>${escapeHtml(tier.name)}</h4>
                            <ul class="tiny-list">${tier.resources.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
                        </article>
                    `).join('')}
                </div>
            </section>
        `,
    });
}

function renderEcosystem() {
    return renderHeroPage({
        heroImage: heroImages.ecosystem,
        eyebrow: '教研与家校',
        heading: '把硬件、教研、家校和错题闭环接成一个教学生态',
        subheading: '这部分是后续做机构版本和校区版本最重要的中台骨架。',
        content: `
            <section class="card-grid two-up">
                ${ecosystemPanels.map((panel) => `
                    <article class="panel">
                        <div class="section-heading"><span class="eyebrow">生态模块</span><h3>${escapeHtml(panel.title)}</h3></div>
                        <p>${escapeHtml(panel.description)}</p>
                        <ul class="tiny-list">${panel.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
                    </article>
                `).join('')}
            </section>
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">落地建议</span><h3>推荐优先对接的外部能力</h3></div>
                <div class="timeline">
                    <article><strong>01</strong><p>先接真实题库、试卷和批改数据，再让学情、错题、教研中台自动联动。</p></article>
                    <article><strong>02</strong><p>把人脸识别、语音播报与课堂大屏接进课堂流程，形成签到到互动的完整链路。</p></article>
                    <article><strong>03</strong><p>最后补教师端、家长端、志愿填报数据源和支付体系，形成商业化闭环。</p></article>
                </div>
            </section>
        `,
    });
}

function renderTeacherDashboard() {
    const overview = state.teacher || {};
    const currentUser = overview.teacher || state.me?.user || {};
    const studentCards = state.teacherStudents || [];
    const teacherAssignments = overview.recentAssignments || [];
    const questionBank = overview.questionBank || {};
    const questionBankStats = questionBank.stats || { total: 0, subjectBreakdown: {} };

    return renderHeroPage({
        heroImage: heroImages.ecosystem,
        eyebrow: '教师总控台',
        heading: '在一个后台里看学生、看画像、看派题结果',
        subheading: '这版先把教师端最需要的三件事串起来：学生名单、真实题库、派题记录。',
        content: `
            <section class="hero-band">
                <div>
                    <span class="eyebrow">当前教师身份</span>
                    <h2>${escapeHtml(currentUser.fullName || '')} · ${escapeHtml(currentUser.teacherTitle || '教师')}</h2>
                    <p>校区：${escapeHtml(currentUser.schoolName || '')}。负责学科：${escapeHtml((currentUser.managedSubjects || []).join('、') || '待配置')}。</p>
                </div>
                <div class="metric-strip">
                    <article><strong>${studentCards.length}</strong><span>学生人数</span></article>
                    <article><strong>${teacherAssignments.length}</strong><span>已派练习包</span></article>
                    <article><strong>${escapeHtml(questionBankStats.total || 0)}</strong><span>题库可用题量</span></article>
                </div>
            </section>
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">学生名单</span><h3>当前学生画像概览</h3></div>
                ${studentCards.length ? `
                    <div class="card-grid three-up">
                        ${studentCards.map((student) => `
                            <article class="feature-card">
                                <span class="pill">${escapeHtml(student.grade || '')}</span>
                                <h4>${escapeHtml(student.fullName)}</h4>
                                <p>${escapeHtml(student.schoolName || '')} · ${escapeHtml(student.className || '')}</p>
                                <ul class="tiny-list">
                                    <li>主弱项：${escapeHtml(student.topWeakness || '待诊断')}</li>
                                    <li>学情画像：${escapeHtml(student.diagnosticCount || 0)} 科</li>
                                    <li>已派练习：${escapeHtml(student.assignmentsCount || 0)} 份</li>
                                </ul>
                            </article>
                        `).join('')}
                    </div>
                ` : '<p class="muted-text">当前还没有学生注册，等学生入班后这里会自动出现名单与画像摘要。</p>'}
            </section>
            <section class="content-grid two-up">
                <article class="panel">
                    <div class="section-heading"><span class="eyebrow">真实题库</span><h3>当前题库覆盖</h3></div>
                    ${questionBank.warning ? `<div class="notice warning">${escapeHtml(questionBank.warning)}</div>` : ''}
                    <div class="tiny-meta block-meta">
                        <span>当前来源：${escapeHtml(questionBank.source?.label || '')}</span>
                        <span>总题量：${escapeHtml(questionBankStats.total || 0)}</span>
                        <span>按学科分布如下</span>
                    </div>
                    <div class="subject-breakdown">
                        ${Object.entries(questionBankStats.subjectBreakdown || {}).map(([subject, count]) => `
                            <article><strong>${escapeHtml(subject)}</strong><span>${escapeHtml(count)} 题</span></article>
                        `).join('')}
                    </div>
                    <a class="primary-button inline-button" href="#teacher-question-bank" data-page="teacher-question-bank">进入题库派题</a>
                </article>
                <article class="panel">
                    <div class="section-heading"><span class="eyebrow">最近派题</span><h3>教师操作记录</h3></div>
                    ${teacherAssignments.length ? `
                        <div class="timeline compact-timeline">
                            ${teacherAssignments.slice(0, 4).map((assignment, index) => `
                                <article><strong>0${index + 1}</strong><p>${escapeHtml(assignment.title)} · ${escapeHtml(assignment.questionCount)} 题</p></article>
                            `).join('')}
                        </div>
                    ` : '<p class="muted-text">还没有派题记录，先从真实题库里选题发给学生。</p>'}
                </article>
            </section>
        `,
    });
}

function renderTeacherClassroom() {
    const sessions = state.teacherClassrooms?.sessions || [];
    const activeCount = state.teacherClassrooms?.activeCount || 0;
    const completedCount = state.teacherClassrooms?.completedCount || 0;

    return renderHeroPage({
        heroImage: heroImages.ecosystem,
        eyebrow: '课堂看板',
        heading: '把学生仿真课堂的开启、进行和完成情况放到一个看板里',
        subheading: '教师可以先从这里判断课堂使用频率和进度，再回到题库与学情模块继续干预。',
        content: `
            <section class="hero-band">
                <div>
                    <span class="eyebrow">课堂总览</span>
                    <h2>最近仿真课堂动态</h2>
                    <p>这里汇总学生最近进入的仿真课堂，包括学科、状态、作答次数和答对题数。</p>
                </div>
                <div class="metric-strip">
                    <article><strong>${sessions.length}</strong><span>最近课堂</span></article>
                    <article><strong>${activeCount}</strong><span>进行中</span></article>
                    <article><strong>${completedCount}</strong><span>已结束</span></article>
                </div>
            </section>
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">看板列表</span><h3>课堂记录</h3></div>
                ${sessions.length ? `
                    <div class="card-grid three-up">
                        ${sessions.map((session) => `
                            <article class="feature-card">
                                <span class="pill">${escapeHtml(session.status === 'active' ? '进行中' : '已结束')}</span>
                                <h4>${escapeHtml(session.studentName || '')} · ${escapeHtml(session.subject)}</h4>
                                <p>${escapeHtml(session.topic || '默认仿真带练')}</p>
                                <ul class="tiny-list">
                                    <li>作答次数：${escapeHtml(session.attemptedCount)}</li>
                                    <li>答对题数：${escapeHtml(session.correctCount)}</li>
                                    <li>课堂焦点：${escapeHtml(session.focusSummary || '')}</li>
                                </ul>
                            </article>
                        `).join('')}
                    </div>
                ` : '<p class="muted-text">还没有学生进入仿真课堂。学生开始上课后，这里会自动出现课堂动态。</p>'}
            </section>
        `,
    });
}

function renderTeacherQuestionBank() {
    const search = state.questionBank || { source: {}, filters: {}, results: [], warning: '', stats: { subjectBreakdown: {} } };
    const students = state.teacherStudents || [];

    return renderHeroPage({
        heroImage: heroImages.courses,
        eyebrow: '真实题库派题',
        heading: '教师检索真题后，可以直接派发到学生端',
        subheading: '当前接入的是公开真实题库数据集，已经按题干、选项、答案和学科做了统一格式化。',
        content: `
            <section class="content-grid two-up">
                <article class="panel">
                    <div class="section-heading"><span class="eyebrow">检索条件</span><h3>筛选真题</h3></div>
                    ${search.warning ? `<div class="notice warning">${escapeHtml(search.warning)}</div>` : ''}
                    <p class="muted-text">当前来源：${escapeHtml(search.source?.label || '')}</p>
                    <form class="stack-form" data-form="question-search">
                        <div class="two-column">
                            <label>
                                <span>学科</span>
                                <select name="subject">
                                    <option value="全部" ${search.filters?.subject === '全部' ? 'selected' : ''}>全部</option>
                                    ${subjectOptions.map((subject) => `<option value="${subject}" ${search.filters?.subject === subject ? 'selected' : ''}>${subject}</option>`).join('')}
                                </select>
                            </label>
                            <label>
                                <span>返回数量</span>
                                <select name="limit">
                                    ${[6, 12, 18].map((limit) => `<option value="${limit}" ${Number(search.filters?.limit || 12) === limit ? 'selected' : ''}>${limit}</option>`).join('')}
                                </select>
                            </label>
                        </div>
                        <label><span>关键词</span><input type="text" name="query" value="${escapeHtml(search.filters?.query || '')}" placeholder="例如：函数、阅读理解、实验" /></label>
                        <button type="submit" class="primary-button">搜索题库</button>
                    </form>
                </article>
                <article class="panel">
                    <div class="section-heading"><span class="eyebrow">派题设置</span><h3>把所选题目发给学生</h3></div>
                    <form class="stack-form" data-form="assignment-create">
                        <input type="hidden" name="subject" value="${escapeHtml(search.filters?.subject || '')}" />
                        <input type="hidden" name="query" value="${escapeHtml(search.filters?.query || '')}" />
                        <label><span>练习包标题</span><input type="text" name="title" placeholder="例如：初三数学函数基础真题包" /></label>
                        <label>
                            <span>目标学生</span>
                            <select name="studentId" required>
                                <option value="">请选择学生</option>
                                ${students.map((student) => `<option value="${student.id}">${escapeHtml(student.fullName)} · ${escapeHtml(student.grade || '')} · ${escapeHtml(student.className || '')}</option>`).join('')}
                            </select>
                        </label>
                        <label><span>派题说明</span><textarea name="notes" rows="3" placeholder="例如：先做基础题，周三前完成。"></textarea></label>
                        <div class="question-pick-list">
                            ${search.results.map((question, index) => `
                                <label class="question-pick">
                                    <div class="question-pick-top">
                                        <input type="checkbox" name="questionIds" value="${escapeHtml(question.sourceId)}" />
                                        <span>第 ${index + 1} 题</span>
                                        <span>${escapeHtml(question.subject || '')}</span>
                                        ${question.level ? `<span>${escapeHtml(question.level)}</span>` : ''}
                                    </div>
                                    <strong>${escapeHtml(question.stem || '')}</strong>
                                    <ol class="choice-list compact-choice-list">${(question.choices || []).map((choice) => `<li>${escapeHtml(choice)}</li>`).join('')}</ol>
                                </label>
                            `).join('')}
                        </div>
                        <button type="submit" class="primary-button">生成练习包并派发</button>
                    </form>
                </article>
            </section>
            <section class="panel">
                <div class="section-heading"><span class="eyebrow">检索结果</span><h3>当前共命中 ${search.results.length} 道题</h3></div>
                <div class="card-grid two-up">
                    ${search.results.map((question) => `
                        <article class="feature-card">
                            <div class="metric-head"><h4>${escapeHtml(question.subject || '')}</h4><span>${escapeHtml(question.level || '常规')}</span></div>
                            <p>${escapeHtml(question.stem || '')}</p>
                            <ul class="tiny-list">${(question.choices || []).slice(0, 4).map((choice) => `<li>${escapeHtml(choice)}</li>`).join('')}</ul>
                        </article>
                    `).join('')}
                </div>
            </section>
        `,
    });
}

function renderAppView() {
    const currentUser = state.me?.user;
    const navigation = getNavigationForUser(currentUser);
    let pageContent = '';

    if (isTeacherLike(currentUser) && isTeacherPage(state.currentPage)) {
        if (state.currentPage === 'teacher-classroom') {
            pageContent = renderTeacherClassroom();
        } else if (state.currentPage === 'teacher-question-bank') {
            pageContent = renderTeacherQuestionBank();
        } else {
            pageContent = renderTeacherDashboard();
        }
    } else {
        if (state.currentPage === 'classroom') {
            pageContent = renderStudentClassroom();
        } else if (state.currentPage === 'diagnostics') {
            pageContent = renderDiagnostics();
        } else if (state.currentPage === 'practice') {
            pageContent = renderPractice();
        } else if (state.currentPage === 'modules') {
            pageContent = renderModules();
        } else if (state.currentPage === 'courses') {
            pageContent = renderCourses();
        } else if (state.currentPage === 'vip') {
            pageContent = renderVip();
        } else if (state.currentPage === 'ecosystem') {
            pageContent = renderEcosystem();
        } else {
            pageContent = renderStudentDashboard();
        }
    }

    return `
        <div class="app-shell">
            ${renderSidebar(currentUser, navigation)}
            ${pageContent}
        </div>
    `;
}

function renderAuthView() {
    if (state.currentPage === 'register') {
        return renderAuthRegister();
    }
    if (state.currentPage === 'teacher-register') {
        return renderTeacherRegister();
    }
    return renderAuthLogin();
}

function render() {
    updateBodyClass();
    app.innerHTML = state.me?.user ? renderAppView() : renderAuthView();
}

async function submitAuthForm(formName, payload) {
    if (formName === 'login') {
        await api('/api/edu/auth/login', { method: 'POST', body: payload });
        return;
    }
    if (formName === 'student-register') {
        await api('/api/edu/auth/register/student', {
            method: 'POST',
            body: {
                ...payload,
                favoriteSubjects: payload.favoriteSubjects || [],
                weakSubjects: payload.weakSubjects || [],
            },
        });
        return;
    }
    await api('/api/edu/auth/register/teacher', {
        method: 'POST',
        body: {
            ...payload,
            managedSubjects: payload.managedSubjects || [],
            managedGrades: payload.managedGrades || [],
        },
    });
}

async function handleSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
        return;
    }
    const formName = form.dataset.form;
    if (!formName) {
        return;
    }

    event.preventDefault();
    try {
        const payload = buildFormPayload(form);
        if (['login', 'student-register', 'teacher-register'].includes(formName)) {
            await submitAuthForm(formName, payload);
            await refreshSessionData();
            setPage(resolvePageForState(getHashPage() || state.currentPage), false);
        } else if (formName === 'diagnostic') {
            await api('/api/edu/student/diagnostics', {
                method: 'POST',
                body: {
                    ...payload,
                    baselineScore: Number(payload.baselineScore || 0),
                    confidenceLevel: Number(payload.confidenceLevel || 0),
                    homeworkCompletion: Number(payload.homeworkCompletion || 0),
                    mistakeRecovery: Number(payload.mistakeRecovery || 0),
                    weakPoints: String(payload.weakPoints || '')
                        .replaceAll('，', ',')
                        .replaceAll('、', ',')
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean),
                },
            });
            await loadStudentData();
        } else if (formName === 'classroom-start') {
            await api('/api/edu/student/classroom-sessions', { method: 'POST', body: payload });
            await loadStudentData();
            setPage('classroom', false);
        } else if (formName === 'classroom-respond') {
            await api(`/api/edu/student/classroom-sessions/${payload.sessionId}/respond`, {
                method: 'POST',
                body: {
                    selectedChoiceIndex: payload.selectedChoiceIndex === '' ? null : Number(payload.selectedChoiceIndex),
                    freeText: payload.freeText || '',
                },
            });
            await loadStudentData();
        } else if (formName === 'question-search') {
            state.questionBank = await api(`/api/edu/teacher/question-bank?subject=${encodeURIComponent(payload.subject || '')}&query=${encodeURIComponent(payload.query || '')}&limit=${encodeURIComponent(payload.limit || 12)}`);
        } else if (formName === 'assignment-create') {
            if (!(payload.questionIds || []).length) {
                throw new Error('请至少勾选 1 道真题。');
            }
            await api('/api/edu/teacher/assignments', {
                method: 'POST',
                body: {
                    studentId: Number(payload.studentId),
                    questionIds: payload.questionIds,
                    subject: payload.subject || '',
                    query: payload.query || '',
                    title: payload.title || '',
                    notes: payload.notes || '',
                },
            });
            await loadTeacherData();
        }
        render();
        showToast('操作已完成。');
    } catch (error) {
        showToast(error.message || '操作失败', true);
    }
}

async function handleClick(event) {
    const target = event.target.closest('[data-action], [data-page]');
    if (!target) {
        return;
    }

    const page = target.dataset.page;
    if (page) {
        event.preventDefault();
        setPage(resolvePageForState(page));
        return;
    }

    const action = target.dataset.action;
    if (!action) {
        return;
    }

    try {
        if (action === 'logout') {
            await api('/api/edu/auth/logout', { method: 'POST' });
            await refreshSessionData();
            setPage('login', false);
            render();
            showToast('已退出登录。');
            return;
        }

        if (action === 'toggle-nav') {
            const sidebar = document.querySelector('[data-sidebar]');
            if (sidebar) {
                sidebar.classList.toggle('open');
            }
            return;
        }

        if (action === 'complete-classroom') {
            await api(`/api/edu/student/classroom-sessions/${target.dataset.sessionId}/complete`, { method: 'POST' });
            await loadStudentData();
            render();
            showToast('课堂已结束。');
            return;
        }

        if (action === 'demo-fill') {
            const subject = document.querySelector('[name="subject"]');
            const baselineScore = document.querySelector('[name="baselineScore"]');
            const confidenceLevel = document.querySelector('[name="confidenceLevel"]');
            const homeworkCompletion = document.querySelector('[name="homeworkCompletion"]');
            const mistakeRecovery = document.querySelector('[name="mistakeRecovery"]');
            const weakPoints = document.querySelector('[name="weakPoints"]');
            if (subject) subject.value = '英语';
            if (baselineScore) baselineScore.value = '108';
            if (confidenceLevel) confidenceLevel.value = '4';
            if (homeworkCompletion) homeworkCompletion.value = '84';
            if (mistakeRecovery) mistakeRecovery.value = '72';
            if (weakPoints) weakPoints.value = '完形填空，阅读定位，长难句拆解';
        }
    } catch (error) {
        showToast(error.message || '操作失败', true);
    }
}

async function init() {
    try {
        await loadStatus();
        await refreshSessionData();
        state.currentPage = resolvePageForState(getHashPage() || state.currentPage);
        render();
    } catch (error) {
        app.innerHTML = `
            <main class="auth-layout" style="--hero-image: url('${heroImages.auth}');">
                <section class="auth-hero">
                    <div class="auth-copy">
                        <span class="eyebrow">系统暂时不可用</span>
                        <h1>加载失败，请稍后重试。</h1>
                        <p>${escapeHtml(error.message || '接口暂时不可用')}</p>
                    </div>
                </section>
                <section class="auth-panel"></section>
            </main>
        `;
    }
}

window.addEventListener('hashchange', () => {
    state.currentPage = resolvePageForState(getHashPage());
    render();
});

app.addEventListener('submit', handleSubmit);
app.addEventListener('click', handleClick);

init();
