# backend/static/edu/app.js 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。
- 文件类型：`source-code`
- 原始行数：1594
- SHA-256：`60fec0556841ce3fb55a38af29c3f35ab85f0725babc36ae0965ba27a9c442ce`
- 可运行副本：[打开源文件](../../../../../source/backend/static/edu/app.js)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`state`、`app`、`toast`、`heroImages`、`subjectOptions`、`gradeOptions`、`learningPreferences`、`modules`、`vipTiers`、`courseTracks`、`ecosystemPanels`、`authPages`、`studentNav`、`teacherNav`、`adminNav`、`isTeacherLike`、`isAdmin`、`getNavigationForUser`、`isTeacherPage`、`escapeHtml`、`formatDateTime`、`buildPersonalPlan`、`weakestProfile`、`anchorSubject`、`buildDiagnosticsSnapshot`、`getTierByName`、`getModuleGroups`、`key`、`showToast`、`api`、`config`、`response`、`contentType`、`payload`、`message`、`getHashPage`、`setPage`、`resolvePageForState`、`currentUser`、`updateBodyClass`、`buildFormPayload`、`checkboxMap`、`tagName`、`type`、`loadStatus`、`loadMe`、`loadStudentData`、`loadTeacherData`、`teacher`、`presetSubject`、`refreshSessionData`、`renderAuthLogin`、`renderAuthRegister`、`renderTeacherRegister`、`renderHeroPage`、`renderSidebar`、`roleLabel`、`renderStudentDashboard`、`overview`、`diagnostics`、`assignments`、`classroomSessions`、`diagnosticCards`、`tier`、`planItems`、`renderStudentClassroom`、`activeSession`、`activeQuestion`、`blackboard`、`${escapeHtml(activeSession.id)}`、`renderDiagnostics`、`renderPractice`、`source`、`renderModules`、`groups`、`renderCourses`、`renderVip`、`renderEcosystem`、`renderTeacherDashboard`、`studentCards`、`teacherAssignments`、`questionBank`、`questionBankStats`、`renderTeacherClassroom`、`sessions`、`activeCount`、`completedCount`、`renderTeacherQuestionBank`、`search`、`students`、`renderAppView`、`navigation`、`pageContent`、`renderAuthView`、`render`、`submitAuthForm`、`handleSubmit`、`form`、`formName`、`handleClick`、`target`、`page`、`action`、`sidebar`、`subject`、`baselineScore`、`confidenceLevel`、`homeworkCompletion`、`mistakeRecovery`、`weakPoints`、`init`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const state = {</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 2 | <code>    status: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 3 | <code>    me: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 4 | <code>    student: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 5 | <code>    teacher: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 6 | <code>    teacherStudents: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 7 | <code>    teacherClassrooms: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 8 | <code>    questionBank: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 9 | <code>    currentPage: 'login',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 10 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>const app = document.querySelector('#app');</code> | 声明局部标识符 `app`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 13 | <code>const toast = document.querySelector('#toast');</code> | 声明局部标识符 `toast`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>const heroImages = {</code> | 声明局部标识符 `heroImages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 16 | <code>    auth: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&amp;fit=crop&amp;w=1400&amp;q=80',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 17 | <code>    dashboard: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&amp;fit=crop&amp;w=1400&amp;q=80',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 18 | <code>    courses: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&amp;fit=crop&amp;w=1400&amp;q=80',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 19 | <code>    ecosystem: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&amp;fit=crop&amp;w=1400&amp;q=80',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 20 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>const subjectOptions = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];</code> | 声明局部标识符 `subjectOptions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 23 | <code>const gradeOptions = ['初一', '初二', '初三', '高一', '高二', '高三'];</code> | 声明局部标识符 `gradeOptions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 24 | <code>const learningPreferences = ['刷题 + 答疑', '听课 + 练习', '课堂互动 + 复盘', '专项冲刺 + 押题'];</code> | 声明局部标识符 `learningPreferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 25 | <code>const modules = [</code> | 声明局部标识符 `modules`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 26 | <code>    { slug: 'access-control', title: '准入与权限管理', stage: '课前建档', description: '实名注册、家长授权、电子协议与基础会员开通形成统一准入门槛。', outputs: ['学生档案 ID', '家长通知权限', '协议留痕', '账号风控'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 27 | <code>    { slug: 'classroom-ai', title: '教室场景 AI 仿真人互动', stage: '课中互动', description: '人脸签到、姓名播报、多轮语音问答与课堂随机提问沉浸联动。', outputs: ['签到记录', '语音互动记录', '课堂参与度', '出勤台账'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 28 | <code>    { slug: 'learning-profile', title: '学前学情智能画像', stage: '课前诊断', description: '基于分层测试与自评数据，生成知识点掌握图谱与能力层级。', outputs: ['学前分层', '薄弱点清单', '知识图谱', '推荐难度'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 29 | <code>    { slug: 'homepage-adaptation', title: '首页个性化学习适配', stage: '学习路径', description: '首页按意向科目、难度偏好和会员等级重排学习内容。', outputs: ['首页排序', '科目优先级', '学习模式', '推荐清单'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 30 | <code>    { slug: 'exam-courses', title: '专项课程教学', stage: '课程体系', description: '中考技巧提分与高考技巧提分双主线，覆盖考点、技巧与分层课程。', outputs: ['技巧课程', '学科专题', '分层课包', '应试模板'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 31 | <code>    { slug: 'vip-system', title: '八级 VIP 会员体系', stage: '商业化', description: '八档会员权益对应课程深度、资源权限与服务颗粒度。', outputs: ['会员分层', '权益包', '教材版本库', '大模型能力授权'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 32 | <code>    { slug: 'hardware-grading', title: '智能硬件对接批改', stage: '教学执行', description: '对接阅卷机、作业批改机、课堂大屏与答题器，自动回流数据。', outputs: ['自动阅卷', '主观题复核', '错题标注', '成绩同步'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 33 | <code>    { slug: 'volunteer-planner', title: '中高考志愿填报辅助', stage: '升学规划', description: '结合分布式与互域式双模式，做志愿筛选、对比与风险评估。', outputs: ['志愿方案', '院校库', '风险评估', '政策更新'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 34 | <code>    { slug: 'score-boost', title: '进阶拔高提分', stage: '高分冲刺', description: '压轴题、高阶题型、刷题技战术和名校笔记统一沉淀。', outputs: ['拔高题单', '冲刺训练', '名校笔记', '提分方法论'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 35 | <code>    { slug: 'mock-papers', title: '中高考押题卷实战', stage: '考前冲刺', description: '以高仿真押题卷进行全真模拟，配套考后精准解析。', outputs: ['押题卷', '限时模拟', '考后解析', '同类题拓展'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 36 | <code>    { slug: 'teacher-research', title: '教研团队专属管理', stage: '教研中台', description: '沉淀课件、教案、班级学情与教学复盘数据，支持内容审核。', outputs: ['教研资源库', '班级分层计划', '教学复盘', '内容审核流'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 37 | <code>    { slug: 'family-collab', title: '家校协同教学', stage: '家校闭环', description: '让家长实时查看学习进度、课堂表现、作业提醒与升学通知。', outputs: ['家长端动态', '通知推送', '双向答疑', '学习时长记录'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 38 | <code>    { slug: 'mistake-loop', title: '错题闭环复盘', stage: '课后巩固', description: '自动归集错题、推送同类题、做二次检测并完成掌握移除。', outputs: ['错题本', '同类题训练', '二次检测', '闭环掌握率'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 39 | <code>];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>const vipTiers = [</code> | 声明局部标识符 `vipTiers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 41 | <code>    { name: '基础会员', price: '0', audience: '首次进班学生', rights: ['单科基础学习', '基础学情测试', '基础课堂互动'], resources: ['公开课程', '基础练习题', '基础学情报告'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 42 | <code>    { name: '初级会员', price: '366', audience: '双科补弱', rights: ['双科自选', '基础作业批改', '低难度课程'], resources: ['基础课件', '简单刷题卷', '常规课堂互动'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 43 | <code>    { name: '高级会员', price: '899', audience: '三科稳步提升', rights: ['三科自选', '全难度基础课程', '自动阅卷'], resources: ['技巧基础课', '单元测试卷', '简易学情图谱'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 44 | <code>    { name: '黄金会员', price: '2899', audience: '全科系统进阶', rights: ['全科基础权限', '中级课程', '动态学情报告'], resources: ['中等难度刷题卷', '名师基础笔记', '志愿填报基础服务'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 45 | <code>    { name: '铂金会员', price: '6899', audience: '进阶突破', rights: ['全科进阶课程', '一对一仿真答疑', '拔高训练'], resources: ['名校中等笔记', '押题基础卷', '分布式志愿填报'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 46 | <code>    { name: '钻石会员', price: '12899', audience: '高分冲刺', rights: ['高难度课程', '专属学习路径', '精细学情报告'], resources: ['名师名校原版笔记', '押题进阶卷', '硬件全对接'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 47 | <code>    { name: '皇冠会员', price: '27999', audience: '定制化提升', rights: ['定制教学', '直播答疑', '专属拔高训练'], resources: ['内部押题卷', '独家刷题法', '一对一志愿规划'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 48 | <code>    { name: '至尊会员', price: '38999', audience: '全流程升学陪跑', rights: ['终身全模块权限', '私人定制教学', '全程学情跟踪'], resources: ['绝密押题卷', '名师一对一复刻授课', '升学全流程服务'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 49 | <code>];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>const courseTracks = [</code> | 声明局部标识符 `courseTracks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 51 | <code>    { title: '中考技巧提分', description: '围绕中考核心考点做题型突破、时间分配和答题模板训练。', bullets: ['考点精讲', '技巧训练', '分层授课', '押题卷联动'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 52 | <code>    { title: '高考技巧提分', description: '按高考真题命题规律组织课程，兼顾基础巩固与高分冲刺。', bullets: ['高频题型', '压轴题拆解', '应试节奏', '错题闭环'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 53 | <code>    { title: '进阶拔高训练', description: '针对目标名校与高分突破学生，做高难度专项与思维迁移训练。', bullets: ['压轴题专训', '名校笔记', '刷题技战术', '一对一答疑'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 54 | <code>    { title: '志愿规划与升学服务', description: '结合分数、位次、职业偏好与政策信息，输出可执行志愿方案。', bullets: ['稳冲保组合', '跨区域筛选', '风险评估', '政策提醒'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 55 | <code>];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>const ecosystemPanels = [</code> | 声明局部标识符 `ecosystemPanels`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 57 | <code>    { title: '智能硬件联动', description: '阅卷机、作业批改机、大屏、答题器与软件同步互联。', bullets: ['设备接入状态看板', '客观题秒批', '主观题 AI 预批', '班级批改报告'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 58 | <code>    { title: '教研团队管理', description: '教学资源库、班级分层计划、教学复盘和内容审核都在一个中台完成。', bullets: ['资源共享', '教学复盘', '分层教学计划', '审核流程'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 59 | <code>    { title: '家校协同', description: '家长端同步课堂表现、作业完成率、阶段测试与升学通知。', bullets: ['学习进度', '课堂提醒', '考试安排', '家长咨询'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 60 | <code>    { title: '错题闭环', description: '自动归档错题，追踪二刷、三刷结果，确保知识点真正掌握。', bullets: ['错题本', '同类题练习', '掌握度复测', '移出清单'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 61 | <code>];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>const authPages = ['login', 'register', 'teacher-register'];</code> | 声明局部标识符 `authPages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 64 | <code>const studentNav = [</code> | 声明局部标识符 `studentNav`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 65 | <code>    { key: 'dashboard', label: '首页总览' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 66 | <code>    { key: 'classroom', label: '仿真课堂' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 67 | <code>    { key: 'diagnostics', label: '学情画像' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 68 | <code>    { key: 'practice', label: '我的练习' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 69 | <code>    { key: 'modules', label: '平台模块' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 70 | <code>    { key: 'courses', label: '课程与冲刺' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 71 | <code>    { key: 'vip', label: '会员体系' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 72 | <code>    { key: 'ecosystem', label: '教研与家校' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 73 | <code>];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>const teacherNav = [</code> | 声明局部标识符 `teacherNav`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 75 | <code>    { key: 'teacher-dashboard', label: '教师总控台' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 76 | <code>    { key: 'teacher-classroom', label: '课堂看板' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 77 | <code>    { key: 'teacher-question-bank', label: '真实题库派题' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 78 | <code>];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>const adminNav = [</code> | 声明局部标识符 `adminNav`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 80 | <code>    ...studentNav,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 81 | <code>    { key: 'teacher-dashboard', label: '教师总控台' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 82 | <code>    { key: 'teacher-classroom', label: '课堂看板' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 83 | <code>    { key: 'teacher-question-bank', label: '真实题库派题' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 84 | <code>];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>function isTeacherLike(user) {</code> | 定义函数 `isTeacherLike`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 87 | <code>    return ['teacher', 'admin'].includes(user?.role);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 88 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>function isAdmin(user) {</code> | 定义函数 `isAdmin`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 91 | <code>    return user?.role === 'admin';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 92 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>function getNavigationForUser(user) {</code> | 定义函数 `getNavigationForUser`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 95 | <code>    if (isAdmin(user)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 96 | <code>        return adminNav;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 97 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>    return isTeacherLike(user) ? teacherNav : studentNav;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 99 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>function isTeacherPage(page) {</code> | 定义函数 `isTeacherPage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 102 | <code>    return teacherNav.some((item) =&gt; item.key === page);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 103 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>function escapeHtml(value) {</code> | 定义函数 `escapeHtml`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 106 | <code>    return String(value ?? '')</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 107 | <code>        .replaceAll('&amp;', '&amp;amp;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 108 | <code>        .replaceAll('&lt;', '&amp;lt;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 109 | <code>        .replaceAll('&gt;', '&amp;gt;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 110 | <code>        .replaceAll('"', '&amp;quot;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 111 | <code>        .replaceAll("'", '&amp;#39;');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 112 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 114 | <code>function formatDateTime(value) {</code> | 定义函数 `formatDateTime`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 115 | <code>    if (!value) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 116 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 117 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 118 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 119 | <code>        return new Date(value).toLocaleString('zh-CN');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 120 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 121 | <code>        return String(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 122 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>function buildPersonalPlan(user, diagnostics) {</code> | 定义函数 `buildPersonalPlan`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 126 | <code>    const weakestProfile = diagnostics.length</code> | 声明局部标识符 `weakestProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 127 | <code>        ? [...diagnostics].sort((left, right) =&gt; Number(left.confidenceScore) - Number(right.confidenceScore))[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 128 | <code>        : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 129 | <code>    const anchorSubject = weakestProfile?.subject &#124;&#124; user?.weakSubjects?.[0] &#124;&#124; user?.favoriteSubjects?.[0] &#124;&#124; '数学';</code> | 声明局部标识符 `anchorSubject`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 132 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 133 | <code>            title: '准入建档完成度',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 134 | <code>            detail: `当前账号已绑定家长 ${user?.parentName &#124;&#124; '未填写'}，会员等级为 ${user?.vipLevel &#124;&#124; '基础会员'}。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 135 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 136 | <code>        weakestProfile</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 137 | <code>            ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 138 | <code>                title: `${weakestProfile.subject} 优先补弱`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 139 | <code>                detail: `${weakestProfile.masterySummary}，建议先完成 ${(weakestProfile.recommendedPath &#124;&#124; [])[0] &#124;&#124; '专项补弱' }。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 140 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>            : {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 142 | <code>                title: '完成首轮学情画像',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 143 | <code>                detail: `先用 ${anchorSubject} 做一轮自适应测试，系统会自动生成分层路径。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 144 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 146 | <code>            title: `${user?.targetExam &#124;&#124; '中高考'} 专项路径`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 147 | <code>            detail: `优先进入${user?.targetExam &#124;&#124; '中高考'}技巧提分模块，并把 ${anchorSubject} 设为首页主科。`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 148 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 150 | <code>            title: '错题与家校闭环',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 151 | <code>            detail: user?.parentNoticeOptIn</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 152 | <code>                ? '课堂、作业、测试数据会同步到家长端与教研台账。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 153 | <code>                : '建议开启家长通知，形成课后复盘与提醒闭环。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 154 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 155 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>function buildDiagnosticsSnapshot(diagnostics) {</code> | 定义函数 `buildDiagnosticsSnapshot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 159 | <code>    return diagnostics.map((item) =&gt; ({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 160 | <code>        subject: item.subject,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 161 | <code>        level: item.currentLevel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 162 | <code>        score: item.confidenceScore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 163 | <code>        summary: item.masterySummary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 164 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>function getTierByName(name) {</code> | 定义函数 `getTierByName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 168 | <code>    return vipTiers.find((tier) =&gt; tier.name === name) &#124;&#124; vipTiers[0];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 169 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>function getModuleGroups() {</code> | 定义函数 `getModuleGroups`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 172 | <code>    return modules.reduce((groups, item) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 173 | <code>        const key = item.stage;</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 174 | <code>        if (!groups[key]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 175 | <code>            groups[key] = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 176 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>        groups[key].push(item);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 178 | <code>        return groups;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 179 | <code>    }, {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 180 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 182 | <code>function showToast(message, isError = false) {</code> | 定义函数 `showToast`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 183 | <code>    toast.textContent = message;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 184 | <code>    toast.classList.remove('hidden');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 185 | <code>    toast.style.background = isError ? '#8c3420' : '#10251a';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 186 | <code>    window.clearTimeout(showToast.timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 187 | <code>    showToast.timer = window.setTimeout(() =&gt; toast.classList.add('hidden'), 2800);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 188 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>async function api(path, options = {}) {</code> | 定义函数 `api`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 191 | <code>    const config = {</code> | 声明局部标识符 `config`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 192 | <code>        method: options.method &#124;&#124; 'GET',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 193 | <code>        credentials: 'include',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 194 | <code>        headers: { Accept: 'application/json' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 195 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 196 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 197 | <code>    if (options.body !== undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 198 | <code>        config.headers['Content-Type'] = 'application/json';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 199 | <code>        config.body = JSON.stringify(options.body);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 200 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>    const response = await fetch(path, config);</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 203 | <code>    const contentType = response.headers.get('content-type') &#124;&#124; '';</code> | 声明局部标识符 `contentType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 204 | <code>    const payload = contentType.includes('application/json') ? await response.json() : await response.text();</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 205 | <code>    if (!response.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 206 | <code>        const message = typeof payload === 'string'</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 207 | <code>            ? payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 208 | <code>            : payload.detail &#124;&#124; payload.error?.message &#124;&#124; '请求失败';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 209 | <code>        throw new Error(message);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 210 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 211 | <code>    return payload.data ?? payload;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 212 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 214 | <code>function getHashPage() {</code> | 定义函数 `getHashPage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 215 | <code>    return window.location.hash.replace(/^#/, '').trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 216 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>function setPage(page, rerender = true) {</code> | 定义函数 `setPage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 219 | <code>    state.currentPage = page;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 220 | <code>    history.replaceState(null, '', `/edu#${page}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 221 | <code>    if (rerender) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 222 | <code>        render();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 223 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 226 | <code>function resolvePageForState(candidate) {</code> | 定义函数 `resolvePageForState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 227 | <code>    const currentUser = state.me?.user;</code> | 声明局部标识符 `currentUser`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 228 | <code>    if (!currentUser) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 229 | <code>        return authPages.includes(candidate) ? candidate : 'login';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 230 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>    if (isAdmin(currentUser)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 232 | <code>        return adminNav.some((item) =&gt; item.key === candidate) ? candidate : 'dashboard';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 233 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>    if (isTeacherLike(currentUser)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 235 | <code>        return teacherNav.some((item) =&gt; item.key === candidate) ? candidate : 'teacher-dashboard';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 236 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>    return studentNav.some((item) =&gt; item.key === candidate) ? candidate : 'dashboard';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 238 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 240 | <code>function updateBodyClass() {</code> | 定义函数 `updateBodyClass`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 241 | <code>    document.body.className = state.me?.user ? 'app-page' : 'auth-page';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 242 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>function buildFormPayload(form) {</code> | 定义函数 `buildFormPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 245 | <code>    const payload = {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 246 | <code>    const checkboxMap = new Map();</code> | 声明局部标识符 `checkboxMap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 247 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 248 | <code>    for (const element of Array.from(form.elements)) {</code> | 声明局部标识符 `element`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 249 | <code>        if (!element.name &#124;&#124; element.disabled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 250 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 251 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>        const tagName = element.tagName.toLowerCase();</code> | 声明局部标识符 `tagName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 253 | <code>        const type = (element.type &#124;&#124; '').toLowerCase();</code> | 声明局部标识符 `type`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>        if (type === 'checkbox') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 256 | <code>            if (!checkboxMap.has(element.name)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 257 | <code>                checkboxMap.set(element.name, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 258 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>            checkboxMap.get(element.name).push(element);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 260 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 261 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>        if (type === 'radio') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 264 | <code>            if (element.checked) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 265 | <code>                payload[element.name] = element.value;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 266 | <code>            } else if (!(element.name in payload)) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 267 | <code>                payload[element.name] = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 268 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 270 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 272 | <code>        if (tagName === 'select' &amp;&amp; element.multiple) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 273 | <code>            payload[element.name] = Array.from(element.options).filter((item) =&gt; item.selected).map((item) =&gt; item.value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 274 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 275 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>        payload[element.name] = element.value;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 278 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>    checkboxMap.forEach((elements, name) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 281 | <code>        if (elements.length === 1 &amp;&amp; elements[0].value === 'on') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 282 | <code>            payload[name] = elements[0].checked;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 283 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 284 | <code>            payload[name] = elements.filter((item) =&gt; item.checked).map((item) =&gt; item.value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 285 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 286 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 287 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 288 | <code>    return payload;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 289 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 291 | <code>async function loadStatus() {</code> | 定义函数 `loadStatus`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 292 | <code>    state.status = await api('/api/edu/system/status');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 293 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>async function loadMe() {</code> | 定义函数 `loadMe`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 296 | <code>    state.me = await api('/api/edu/me');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 297 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>async function loadStudentData() {</code> | 定义函数 `loadStudentData`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 300 | <code>    state.student = await api('/api/edu/student/overview');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 301 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>async function loadTeacherData() {</code> | 定义函数 `loadTeacherData`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 304 | <code>    const teacher = state.me?.user &#124;&#124; {};</code> | 声明局部标识符 `teacher`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 305 | <code>    const presetSubject = state.questionBank?.filters?.subject &#124;&#124; teacher.managedSubjects?.[0] &#124;&#124; '数学';</code> | 声明局部标识符 `presetSubject`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 306 | <code>    const [overview, students, classrooms, questionBank] = await Promise.all([</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 307 | <code>        api('/api/edu/teacher/overview'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 308 | <code>        api('/api/edu/teacher/students'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 309 | <code>        api('/api/edu/teacher/classroom-sessions'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 310 | <code>        api(`/api/edu/teacher/question-bank?subject=${encodeURIComponent(presetSubject)}&amp;limit=12`),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 311 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 312 | <code>    state.teacher = overview;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 313 | <code>    state.teacherStudents = students;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 314 | <code>    state.teacherClassrooms = classrooms;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 315 | <code>    state.questionBank = questionBank;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 316 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>async function refreshSessionData() {</code> | 定义函数 `refreshSessionData`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 319 | <code>    await loadMe();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 320 | <code>    const currentUser = state.me?.user;</code> | 声明局部标识符 `currentUser`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 321 | <code>    if (!currentUser) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 322 | <code>        state.student = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 323 | <code>        state.teacher = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 324 | <code>        state.teacherStudents = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 325 | <code>        state.teacherClassrooms = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 326 | <code>        state.questionBank = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 327 | <code>    } else if (isAdmin(currentUser)) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 328 | <code>        await Promise.all([loadStudentData(), loadTeacherData()]);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 329 | <code>    } else if (isTeacherLike(currentUser)) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 330 | <code>        await loadTeacherData();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 331 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 332 | <code>        await loadStudentData();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 333 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>    state.currentPage = resolvePageForState(getHashPage() &#124;&#124; state.currentPage);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 335 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>function renderAuthLogin() {</code> | 定义函数 `renderAuthLogin`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 338 | <code>    return `</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 339 | <code>        &lt;main class="auth-layout" style="--hero-image: url('${heroImages.auth}');"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 340 | <code>            &lt;section class="auth-hero"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 341 | <code>                &lt;div class="auth-copy"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 342 | <code>                    &lt;span class="eyebrow"&gt;教室专用软件入口&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 343 | <code>                    &lt;h1&gt;把课堂互动、学情诊断和提分路径放进一个系统。&lt;/h1&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 344 | <code>                    &lt;p&gt;先完成学生建档和家长授权，再进入仿真人互动课堂、学情画像、专项课程和教研闭环。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 345 | <code>                    &lt;ul class="auth-points"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 346 | <code>                        &lt;li&gt;注册即开通基础会员&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 347 | <code>                        &lt;li&gt;支持中考 / 高考双升学主线&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 348 | <code>                        &lt;li&gt;已接入教师端与真实题库派题链路&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 349 | <code>                    &lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 350 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 351 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 352 | <code>            &lt;section class="auth-panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 353 | <code>                &lt;div class="form-intro"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 354 | <code>                    &lt;span class="eyebrow"&gt;账号登录&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 355 | <code>                    &lt;h2&gt;进入课堂总控台&lt;/h2&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 356 | <code>                    &lt;p&gt;未注册的新学员先完成学生与家长档案建档。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 357 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 358 | <code>                &lt;form class="stack-form" data-form="login"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 359 | <code>                    &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 360 | <code>                        &lt;span&gt;邮箱&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 361 | <code>                        &lt;input type="email" name="email" placeholder="student@example.com" required /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 362 | <code>                    &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 363 | <code>                    &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 364 | <code>                        &lt;span&gt;密码&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 365 | <code>                        &lt;input type="password" name="password" placeholder="至少 6 位" required /&gt;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 366 | <code>                    &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 367 | <code>                    &lt;div class="admin-login-hint"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 368 | <code>                        &lt;strong&gt;管理员入口&lt;/strong&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 369 | <code>                        &lt;span&gt;邮箱：admin@simclass.local&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 370 | <code>                        &lt;span&gt;默认密码：Admin@123456，可用 Render 环境变量 EDU_ADMIN_PASSWORD 覆盖&lt;/span&gt;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 371 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 372 | <code>                    &lt;button type="submit" class="primary-button"&gt;登录进入系统&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 373 | <code>                &lt;/form&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 374 | <code>                &lt;div class="auth-footer"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 375 | <code>                    &lt;span&gt;还没有账号？&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 376 | <code>                    &lt;a href="#register" data-page="register"&gt;立即注册建档&lt;/a&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 377 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 378 | <code>                &lt;div class="auth-footer"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 379 | <code>                    &lt;span&gt;教师开通后台？&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 380 | <code>                    &lt;a href="#teacher-register" data-page="teacher-register"&gt;进入教师注册&lt;/a&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 381 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 382 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 383 | <code>        &lt;/main&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 384 | <code>    `;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 385 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 387 | <code>function renderAuthRegister() {</code> | 定义函数 `renderAuthRegister`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 388 | <code>    return `</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 389 | <code>        &lt;main class="auth-layout register-layout" style="--hero-image: url('${heroImages.auth}');"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 390 | <code>            &lt;section class="auth-hero"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 391 | <code>                &lt;div class="auth-copy"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 392 | <code>                    &lt;span class="eyebrow"&gt;学生准入建档&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 393 | <code>                    &lt;h1&gt;先把学生、家长、学习目标和协议一次建好。&lt;/h1&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 394 | <code>                    &lt;p&gt;注册完成后默认加入基础会员，系统会根据年级、薄弱学科和目标考试自动生成首页推荐。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 395 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 396 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 397 | <code>            &lt;section class="auth-panel wide-panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 398 | <code>                &lt;div class="form-intro"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 399 | <code>                    &lt;span class="eyebrow"&gt;注册建档&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 400 | <code>                    &lt;h2&gt;学生与家长信息&lt;/h2&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 401 | <code>                    &lt;p&gt;这部分信息会同步到学情、课堂、批改与家校协同模块。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 402 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 403 | <code>                &lt;form class="stack-form" data-form="student-register"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 404 | <code>                    &lt;div class="two-column"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 405 | <code>                        &lt;label&gt;&lt;span&gt;学生姓名&lt;/span&gt;&lt;input type="text" name="fullName" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 406 | <code>                        &lt;label&gt;&lt;span&gt;邮箱&lt;/span&gt;&lt;input type="email" name="email" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 407 | <code>                        &lt;label&gt;&lt;span&gt;联系电话&lt;/span&gt;&lt;input type="text" name="phone" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 408 | <code>                        &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 409 | <code>                            &lt;span&gt;年级&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 410 | <code>                            &lt;select name="grade" required&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 411 | <code>                                &lt;option value=""&gt;请选择&lt;/option&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 412 | <code>                                ${gradeOptions.map((item) =&gt; `&lt;option value="${item}"&gt;${item}&lt;/option&gt;`).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 413 | <code>                            &lt;/select&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 414 | <code>                        &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 415 | <code>                        &lt;label&gt;&lt;span&gt;学校&lt;/span&gt;&lt;input type="text" name="schoolName" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 416 | <code>                        &lt;label&gt;&lt;span&gt;班级&lt;/span&gt;&lt;input type="text" name="className" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 417 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 418 | <code>                    &lt;div class="two-column"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 419 | <code>                        &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 420 | <code>                            &lt;span&gt;目标考试&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 421 | <code>                            &lt;select name="targetExam"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 422 | <code>                                &lt;option value="中考"&gt;中考&lt;/option&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 423 | <code>                                &lt;option value="高考"&gt;高考&lt;/option&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 424 | <code>                            &lt;/select&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 425 | <code>                        &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 426 | <code>                        &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 427 | <code>                            &lt;span&gt;偏好学习方式&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 428 | <code>                            &lt;select name="learningPreference"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 429 | <code>                                ${learningPreferences.map((item) =&gt; `&lt;option value="${item}"&gt;${item}&lt;/option&gt;`).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 430 | <code>                            &lt;/select&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 431 | <code>                        &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 432 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 433 | <code>                    &lt;div class="form-block"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 434 | <code>                        &lt;span&gt;意向学习科目&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 435 | <code>                        &lt;div class="chip-row"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 436 | <code>                            ${subjectOptions.map((subject) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 437 | <code>                                &lt;label class="chip-option"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 438 | <code>                                    &lt;input type="checkbox" name="favoriteSubjects" value="${subject}" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 439 | <code>                                    &lt;span&gt;${subject}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 440 | <code>                                &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 441 | <code>                            `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 442 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 443 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 444 | <code>                    &lt;div class="form-block"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 445 | <code>                        &lt;span&gt;当前薄弱科目&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 446 | <code>                        &lt;div class="chip-row"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 447 | <code>                            ${subjectOptions.map((subject) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 448 | <code>                                &lt;label class="chip-option"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 449 | <code>                                    &lt;input type="checkbox" name="weakSubjects" value="${subject}" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 450 | <code>                                    &lt;span&gt;${subject}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 451 | <code>                                &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 452 | <code>                            `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 453 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 454 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 455 | <code>                    &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 456 | <code>                        &lt;span&gt;目标学习内容&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 457 | <code>                        &lt;textarea name="goalSummary" rows="3" placeholder="例如：希望 3 个月内把数学和英语从薄弱变成班级中上水平。"&gt;&lt;/textarea&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 458 | <code>                    &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 459 | <code>                    &lt;div class="two-column"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 460 | <code>                        &lt;label&gt;&lt;span&gt;家长姓名&lt;/span&gt;&lt;input type="text" name="parentName" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 461 | <code>                        &lt;label&gt;&lt;span&gt;家长联系电话&lt;/span&gt;&lt;input type="text" name="parentPhone" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 462 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 463 | <code>                    &lt;div class="check-stack"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 464 | <code>                        &lt;label class="check-line"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 465 | <code>                            &lt;input type="checkbox" name="parentNoticeOptIn" checked /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 466 | <code>                            &lt;span&gt;开启家长通知权限&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 467 | <code>                        &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 468 | <code>                        &lt;label class="check-line"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 469 | <code>                            &lt;input type="checkbox" name="agreementAccepted" required /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 470 | <code>                            &lt;span&gt;我已阅读并确认学习服务自愿协议书&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 471 | <code>                        &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 472 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 473 | <code>                    &lt;div class="two-column"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 474 | <code>                        &lt;label&gt;&lt;span&gt;登录密码&lt;/span&gt;&lt;input type="password" name="password" required /&gt;&lt;/label&gt;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 475 | <code>                        &lt;label&gt;&lt;span&gt;确认密码&lt;/span&gt;&lt;input type="password" name="confirmPassword" required /&gt;&lt;/label&gt;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 476 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 477 | <code>                    &lt;button type="submit" class="primary-button"&gt;完成注册并进入系统&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 478 | <code>                &lt;/form&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 479 | <code>                &lt;div class="auth-footer"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 480 | <code>                    &lt;span&gt;已经注册过？&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 481 | <code>                    &lt;a href="#login" data-page="login"&gt;返回登录&lt;/a&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 482 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 483 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 484 | <code>        &lt;/main&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 485 | <code>    `;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 486 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 488 | <code>function renderTeacherRegister() {</code> | 定义函数 `renderTeacherRegister`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 489 | <code>    return `</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 490 | <code>        &lt;main class="auth-layout register-layout" style="--hero-image: url('${heroImages.ecosystem}');"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 491 | <code>            &lt;section class="auth-hero"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 492 | <code>                &lt;div class="auth-copy"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 493 | <code>                    &lt;span class="eyebrow"&gt;教师端开通&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 494 | <code>                    &lt;h1&gt;给教师一个能看学生、搜真题、直接派题的总控入口。&lt;/h1&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 495 | <code>                    &lt;p&gt;注册成功后将进入教师总控台，可查看学生名单、学习画像和真实题库结果，并把题目派发到学生端。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 496 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 497 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 498 | <code>            &lt;section class="auth-panel wide-panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 499 | <code>                &lt;div class="form-intro"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 500 | <code>                    &lt;span class="eyebrow"&gt;教师注册&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 501 | <code>                    &lt;h2&gt;校区与任教学科信息&lt;/h2&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 502 | <code>                    &lt;p&gt;这里通过教师邀请码控制后台开通，不影响学生注册入口。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 503 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 504 | <code>                &lt;form class="stack-form" data-form="teacher-register"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 505 | <code>                    &lt;div class="two-column"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 506 | <code>                        &lt;label&gt;&lt;span&gt;教师姓名&lt;/span&gt;&lt;input type="text" name="fullName" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 507 | <code>                        &lt;label&gt;&lt;span&gt;邮箱&lt;/span&gt;&lt;input type="email" name="email" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 508 | <code>                        &lt;label&gt;&lt;span&gt;联系电话&lt;/span&gt;&lt;input type="text" name="phone" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 509 | <code>                        &lt;label&gt;&lt;span&gt;教师头衔&lt;/span&gt;&lt;input type="text" name="teacherTitle" placeholder="例如：数学主讲教师" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 510 | <code>                        &lt;label&gt;&lt;span&gt;校区 / 学校&lt;/span&gt;&lt;input type="text" name="schoolName" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 511 | <code>                        &lt;label&gt;&lt;span&gt;任教班级&lt;/span&gt;&lt;input type="text" name="className" placeholder="例如：初三 1-4 班" /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 512 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 513 | <code>                    &lt;div class="form-block"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 514 | <code>                        &lt;span&gt;负责学科&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 515 | <code>                        &lt;div class="chip-row"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 516 | <code>                            ${subjectOptions.map((subject) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 517 | <code>                                &lt;label class="chip-option"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 518 | <code>                                    &lt;input type="checkbox" name="managedSubjects" value="${subject}" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 519 | <code>                                    &lt;span&gt;${subject}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 520 | <code>                                &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 521 | <code>                            `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 522 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 523 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 524 | <code>                    &lt;div class="form-block"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 525 | <code>                        &lt;span&gt;负责年级&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 526 | <code>                        &lt;div class="chip-row"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 527 | <code>                            ${gradeOptions.map((grade) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 528 | <code>                                &lt;label class="chip-option"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 529 | <code>                                    &lt;input type="checkbox" name="managedGrades" value="${grade}" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 530 | <code>                                    &lt;span&gt;${grade}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 531 | <code>                                &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 532 | <code>                            `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 533 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 534 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 535 | <code>                    &lt;div class="two-column"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 536 | <code>                        &lt;label&gt;&lt;span&gt;教师邀请码&lt;/span&gt;&lt;input type="password" name="inviteCode" required /&gt;&lt;/label&gt;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 537 | <code>                        &lt;label&gt;&lt;span&gt;登录密码&lt;/span&gt;&lt;input type="password" name="password" required /&gt;&lt;/label&gt;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 538 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 539 | <code>                    &lt;label&gt;&lt;span&gt;确认密码&lt;/span&gt;&lt;input type="password" name="confirmPassword" required /&gt;&lt;/label&gt;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 540 | <code>                    &lt;button type="submit" class="primary-button"&gt;开通教师总控台&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 541 | <code>                &lt;/form&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 542 | <code>                &lt;div class="auth-footer"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 543 | <code>                    &lt;span&gt;已有账号？&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 544 | <code>                    &lt;a href="#login" data-page="login"&gt;返回登录&lt;/a&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 545 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 546 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 547 | <code>        &lt;/main&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 548 | <code>    `;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 549 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 550 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 551 | <code>function renderHeroPage({ heroImage, eyebrow, heading, subheading, content }) {</code> | 定义函数 `renderHeroPage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 552 | <code>    return `</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 553 | <code>        &lt;div class="page-shell"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 554 | <code>            &lt;header class="page-top has-image" style="--hero-image: url('${heroImage}');"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 555 | <code>                &lt;button type="button" class="nav-toggle" data-action="toggle-nav"&gt;菜单&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 556 | <code>                &lt;div class="page-top-copy"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 557 | <code>                    &lt;span class="eyebrow"&gt;${escapeHtml(eyebrow)}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 558 | <code>                    &lt;h1&gt;${escapeHtml(heading)}&lt;/h1&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 559 | <code>                    &lt;p&gt;${escapeHtml(subheading)}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 560 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 561 | <code>            &lt;/header&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 562 | <code>            &lt;main class="page-content"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 563 | <code>                ${content}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 564 | <code>            &lt;/main&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 565 | <code>        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 566 | <code>    `;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 567 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 568 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 569 | <code>function renderSidebar(user, navigation) {</code> | 定义函数 `renderSidebar`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 570 | <code>    const roleLabel = isAdmin(user)</code> | 声明局部标识符 `roleLabel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 571 | <code>        ? '平台管理员 · 全权限'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 572 | <code>        : user.role === 'teacher'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 573 | <code>            ? `${user.teacherTitle &#124;&#124; '教师'} · 教师端`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 574 | <code>            : `${user.grade} · ${user.vipLevel}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>    return `</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 577 | <code>        &lt;aside class="sidebar" data-sidebar&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 578 | <code>            &lt;div class="sidebar-top"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 579 | <code>                &lt;a class="brand" href="#${navigation[0]?.key &#124;&#124; 'dashboard'}" data-page="${navigation[0]?.key &#124;&#124; 'dashboard'}"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 580 | <code>                    &lt;span class="brand-kicker"&gt;教室专用软件&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 581 | <code>                    &lt;strong&gt;${escapeHtml(state.status?.appName &#124;&#124; '仿真教学平台')}&lt;/strong&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 582 | <code>                &lt;/a&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 583 | <code>                &lt;div class="sidebar-user"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 584 | <code>                    &lt;p&gt;${escapeHtml(user.fullName)}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 585 | <code>                    &lt;span&gt;${escapeHtml(roleLabel)}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 586 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 587 | <code>            &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 588 | <code>            &lt;nav class="sidebar-nav"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 589 | <code>                ${navigation.map((item) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 590 | <code>                    &lt;a href="#${item.key}" data-page="${item.key}" class="${state.currentPage === item.key ? 'active' : ''}"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 591 | <code>                        ${escapeHtml(item.label)}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 592 | <code>                    &lt;/a&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 593 | <code>                `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 594 | <code>            &lt;/nav&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 595 | <code>            &lt;div class="sidebar-logout"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 596 | <code>                &lt;button type="button" class="ghost-button" data-action="logout"&gt;退出登录&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 597 | <code>            &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 598 | <code>        &lt;/aside&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 599 | <code>    `;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 600 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 601 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 602 | <code>function renderStudentDashboard() {</code> | 定义函数 `renderStudentDashboard`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 603 | <code>    const overview = state.student &#124;&#124; {};</code> | 声明局部标识符 `overview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 604 | <code>    const currentUser = overview.student &#124;&#124; state.me?.user &#124;&#124; {};</code> | 声明局部标识符 `currentUser`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 605 | <code>    const diagnostics = overview.learning?.diagnostics &#124;&#124; [];</code> | 声明局部标识符 `diagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 606 | <code>    const assignments = overview.assignments?.recent &#124;&#124; [];</code> | 声明局部标识符 `assignments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 607 | <code>    const classroomSessions = overview.classrooms?.recent &#124;&#124; [];</code> | 声明局部标识符 `classroomSessions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 608 | <code>    const diagnosticCards = buildDiagnosticsSnapshot(diagnostics);</code> | 声明局部标识符 `diagnosticCards`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 609 | <code>    const tier = getTierByName(currentUser.vipLevel);</code> | 声明局部标识符 `tier`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 610 | <code>    const planItems = buildPersonalPlan(currentUser, diagnostics);</code> | 声明局部标识符 `planItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 611 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 612 | <code>    return renderHeroPage({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 613 | <code>        heroImage: heroImages.dashboard,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 614 | <code>        eyebrow: '首页总览',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 615 | <code>        heading: '围绕课堂、学情、提分和升学的一体化工作台',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 616 | <code>        subheading: '系统会根据学生档案、学情结果和目标考试动态调整首页内容。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 617 | <code>        content: `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 618 | <code>            &lt;section class="hero-band"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 619 | <code>                &lt;div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 620 | <code>                    &lt;span class="eyebrow"&gt;当前学习角色&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 621 | <code>                    &lt;h2&gt;${escapeHtml(currentUser.fullName &#124;&#124; '')} · ${escapeHtml(currentUser.grade &#124;&#124; '')} · ${escapeHtml(currentUser.targetExam &#124;&#124; '')}&lt;/h2&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 622 | <code>                    &lt;p&gt;当前偏好：${escapeHtml(currentUser.learningPreference &#124;&#124; '')}。系统已按照 ${escapeHtml(currentUser.vipLevel &#124;&#124; '基础会员')} 权限开放首页模块。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 623 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 624 | <code>                &lt;div class="metric-strip"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 625 | <code>                    &lt;article&gt;&lt;strong&gt;${escapeHtml(tier.name)}&lt;/strong&gt;&lt;span&gt;会员等级&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 626 | <code>                    &lt;article&gt;&lt;strong&gt;${diagnosticCards.length}&lt;/strong&gt;&lt;span&gt;已建学科画像&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 627 | <code>                    &lt;article&gt;&lt;strong&gt;${assignments.length}&lt;/strong&gt;&lt;span&gt;教师已派练习&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 628 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 629 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 630 | <code>            &lt;section class="content-grid two-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 631 | <code>                &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 632 | <code>                    &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;今日优先事项&lt;/span&gt;&lt;h3&gt;系统推荐学习路径&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 633 | <code>                    &lt;div class="step-list"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 634 | <code>                        ${planItems.map((item, index) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 635 | <code>                            &lt;article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 636 | <code>                                &lt;strong&gt;0${index + 1}&lt;/strong&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 637 | <code>                                &lt;div&gt;&lt;h4&gt;${escapeHtml(item.title)}&lt;/h4&gt;&lt;p&gt;${escapeHtml(item.detail)}&lt;/p&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 638 | <code>                            &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 639 | <code>                        `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 640 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 641 | <code>                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 642 | <code>                &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 643 | <code>                    &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;仿真课堂&lt;/span&gt;&lt;h3&gt;课堂状态&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 644 | <code>                    ${classroomSessions.length ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 645 | <code>                        &lt;div class="timeline"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 646 | <code>                            ${classroomSessions.slice(0, 3).map((session, index) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 647 | <code>                                &lt;article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 648 | <code>                                    &lt;strong&gt;0${index + 1}&lt;/strong&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 649 | <code>                                    &lt;p&gt;${escapeHtml(session.subject)} · ${escapeHtml(session.status === 'active' ? '进行中' : '已结束')} · 已答 ${escapeHtml(session.attemptedCount)} 次，答对 ${escapeHtml(session.correctCount)} 题。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 650 | <code>                                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 651 | <code>                            `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 652 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 653 | <code>                    ` : `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 654 | <code>                        &lt;div class="empty-state"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 655 | <code>                            &lt;p&gt;还没有开启过仿真课堂，系统会按你的学情和真题自动组织一节互动课。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 656 | <code>                            &lt;a class="primary-button inline-button" href="#classroom" data-page="classroom"&gt;进入课堂&lt;/a&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 657 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 658 | <code>                    `}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 659 | <code>                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 660 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 661 | <code>            &lt;section class="content-grid two-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 662 | <code>                &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 663 | <code>                    &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;课堂快照&lt;/span&gt;&lt;h3&gt;仿真人互动流程&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 664 | <code>                    &lt;div class="timeline"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 665 | <code>                        &lt;article&gt;&lt;strong&gt;01&lt;/strong&gt;&lt;p&gt;进教室即刷脸签到，语音播报姓名并打上当前学情标签。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 666 | <code>                        &lt;article&gt;&lt;strong&gt;02&lt;/strong&gt;&lt;p&gt;课堂中 AI 主动追问、随机点名、即时答疑，模拟真人授课节奏。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 667 | <code>                        &lt;article&gt;&lt;strong&gt;03&lt;/strong&gt;&lt;p&gt;作业与测验自动回流到学情模块，错题直接进入闭环复盘。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 668 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 669 | <code>                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 670 | <code>                &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 671 | <code>                    &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;课堂动作&lt;/span&gt;&lt;h3&gt;这一节课会发生什么&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 672 | <code>                    &lt;div class="timeline"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 673 | <code>                        &lt;article&gt;&lt;strong&gt;01&lt;/strong&gt;&lt;p&gt;系统先按姓名完成仿真点名，再根据薄弱学科选出本节主题。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 674 | <code>                        &lt;article&gt;&lt;strong&gt;02&lt;/strong&gt;&lt;p&gt;仿真教师直接调用真题发问，你作答后会即时得到讲评与追问。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 675 | <code>                        &lt;article&gt;&lt;strong&gt;03&lt;/strong&gt;&lt;p&gt;课堂结束后保留全过程记录，方便后续复盘与教师查看。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 676 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 677 | <code>                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 678 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 679 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 680 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;学情摘要&lt;/span&gt;&lt;h3&gt;当前学科分层状态&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 681 | <code>                ${diagnosticCards.length ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 682 | <code>                    &lt;div class="card-grid three-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 683 | <code>                        ${diagnosticCards.map((item) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 684 | <code>                            &lt;article class="metric-card"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 685 | <code>                                &lt;div class="metric-head"&gt;&lt;h4&gt;${escapeHtml(item.subject)}&lt;/h4&gt;&lt;span&gt;${escapeHtml(item.level)}&lt;/span&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 686 | <code>                                &lt;div class="score-bar"&gt;&lt;span style="width: ${escapeHtml(item.score)}%"&gt;&lt;/span&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 687 | <code>                                &lt;strong&gt;${escapeHtml(item.score)} 分&lt;/strong&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 688 | <code>                                &lt;p&gt;${escapeHtml(item.summary)}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 689 | <code>                            &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 690 | <code>                        `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 691 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 692 | <code>                ` : `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 693 | <code>                    &lt;div class="empty-state"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 694 | <code>                        &lt;p&gt;你还没有完成任何学科画像，先去“学情画像”页做第一轮自适应诊断。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 695 | <code>                        &lt;a class="primary-button inline-button" href="#diagnostics" data-page="diagnostics"&gt;开始诊断&lt;/a&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 696 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 697 | <code>                `}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 698 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 699 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 700 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;教师派题&lt;/span&gt;&lt;h3&gt;最新练习包&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 701 | <code>                ${assignments.length ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 702 | <code>                    &lt;div class="card-grid three-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 703 | <code>                        ${assignments.slice(0, 3).map((assignment) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 704 | <code>                            &lt;article class="feature-card"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 705 | <code>                                &lt;span class="pill"&gt;${escapeHtml(assignment.subject)}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 706 | <code>                                &lt;h4&gt;${escapeHtml(assignment.title)}&lt;/h4&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 707 | <code>                                &lt;p&gt;${escapeHtml(assignment.notes &#124;&#124; '已从真实题库生成，进入练习页即可查看全部题目。')}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 708 | <code>                                &lt;ul class="tiny-list"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 709 | <code>                                    &lt;li&gt;${escapeHtml(assignment.questionCount)} 道题&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 710 | <code>                                    &lt;li&gt;${escapeHtml(formatDateTime(assignment.createdAt))} 派发&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 711 | <code>                                    &lt;li&gt;来源：${escapeHtml(assignment.source?.dataset &#124;&#124; '')}&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 712 | <code>                                &lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 713 | <code>                            &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 714 | <code>                        `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 715 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 716 | <code>                ` : `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 717 | <code>                    &lt;div class="empty-state"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 718 | <code>                        &lt;p&gt;教师端还没有给你派发真题练习，完成学情画像后，教师可以按学科直接派题。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 719 | <code>                        &lt;a class="primary-button inline-button" href="#practice" data-page="practice"&gt;打开练习页&lt;/a&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 720 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 721 | <code>                `}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 722 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 723 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 724 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;模块联动&lt;/span&gt;&lt;h3&gt;平台核心模块预览&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 725 | <code>                &lt;div class="card-grid four-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 726 | <code>                    ${modules.slice(0, 8).map((item) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 727 | <code>                        &lt;article class="feature-card"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 728 | <code>                            &lt;span class="pill"&gt;${escapeHtml(item.stage)}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 729 | <code>                            &lt;h4&gt;${escapeHtml(item.title)}&lt;/h4&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 730 | <code>                            &lt;p&gt;${escapeHtml(item.description)}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 731 | <code>                            &lt;ul class="tiny-list"&gt;${item.outputs.slice(0, 3).map((output) =&gt; `&lt;li&gt;${escapeHtml(output)}&lt;/li&gt;`).join('')}&lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 732 | <code>                        &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 733 | <code>                    `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 734 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 735 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 736 | <code>        `,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 737 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 738 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 739 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 740 | <code>function renderStudentClassroom() {</code> | 定义函数 `renderStudentClassroom`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 741 | <code>    const overview = state.student &#124;&#124; {};</code> | 声明局部标识符 `overview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 742 | <code>    const diagnostics = overview.learning?.diagnostics &#124;&#124; [];</code> | 声明局部标识符 `diagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 743 | <code>    const classroomSessions = overview.classrooms?.recent &#124;&#124; [];</code> | 声明局部标识符 `classroomSessions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 744 | <code>    const activeSession = overview.classrooms?.activeSession &#124;&#124; classroomSessions[0] &#124;&#124; null;</code> | 声明局部标识符 `activeSession`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 745 | <code>    const activeQuestion = activeSession?.status === 'active' ? activeSession.currentQuestion : null;</code> | 声明局部标识符 `activeQuestion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 746 | <code>    const blackboard = `</code> | 声明局部标识符 `blackboard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 747 | <code>        &lt;section class="simulation-classroom"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 748 | <code>            &lt;div class="classroom-ambient" aria-hidden="true"&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 749 | <code>            &lt;article class="knowledge-blackboard classroom-board-only"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 750 | <code>                &lt;span class="chalk-mark"&gt;&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 751 | <code>                &lt;h2&gt;基于EMBER-Agent安全增强的仿真课堂&lt;/h2&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 752 | <code>                ${activeQuestion ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 753 | <code>                    &lt;form class="blackboard-question-form" data-form="classroom-respond"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 754 | <code>                        &lt;input type="hidden" name="sessionId" value="${escapeHtml(activeSession.id)}" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 755 | <code>                        &lt;input type="hidden" name="freeText" value="" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 756 | <code>                        &lt;h3&gt;课堂问题&lt;/h3&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 757 | <code>                        &lt;p class="blackboard-question"&gt;${escapeHtml(activeQuestion.stem &#124;&#124; '')}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 758 | <code>                        &lt;div class="blackboard-choice-list"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 759 | <code>                            ${(activeQuestion.choices &#124;&#124; []).map((choice, index) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 760 | <code>                                &lt;label class="blackboard-choice"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 761 | <code>                                    &lt;input type="radio" name="selectedChoiceIndex" value="${index}" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 762 | <code>                                    &lt;span&gt;&lt;strong&gt;${String.fromCharCode(65 + index)}.&lt;/strong&gt; ${escapeHtml(choice)}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 763 | <code>                                &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 764 | <code>                            `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 765 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 766 | <code>                        &lt;button type="submit" class="blackboard-submit"&gt;提交答案&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 767 | <code>                    &lt;/form&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 768 | <code>                ` : `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 769 | <code>                    &lt;div class="blackboard-empty"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 770 | <code>                        &lt;h3&gt;尚未生成课堂问题&lt;/h3&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 771 | <code>                        &lt;p&gt;请先点击下方“开始仿真课堂”，题目和答案选项会显示在这块木框黑板上。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 772 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 773 | <code>                `}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 774 | <code>            &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 775 | <code>        &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 776 | <code>    `;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 777 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 778 | <code>    return renderHeroPage({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 779 | <code>        heroImage: heroImages.dashboard,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 780 | <code>        eyebrow: '仿真课堂',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 781 | <code>        heading: '按学情、真题和课堂追问组织一节可连续互动的仿真课',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 782 | <code>        subheading: '系统会先做点名，再用真实题目讲解、追问、判答和留存课堂记录。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 783 | <code>        content: `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 784 | <code>            ${blackboard}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 785 | <code>            &lt;section class="hero-band"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 786 | <code>                &lt;div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 787 | <code>                    &lt;span class="eyebrow"&gt;当前课堂状态&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 788 | <code>                    &lt;h2&gt;${activeSession ? `${escapeHtml(activeSession.subject)} · ${escapeHtml(activeSession.status === 'active' ? '进行中' : '已结束')}` : '尚未开启课堂'}&lt;/h2&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 789 | <code>                    &lt;p&gt;${activeSession ? escapeHtml(activeSession.focusSummary &#124;&#124; '') : '先选择学科并开启课堂，系统会结合你的学情画像和真题自动生成一节仿真互动课。'}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 790 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 791 | <code>                &lt;div class="metric-strip"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 792 | <code>                    &lt;article&gt;&lt;strong&gt;${classroomSessions.length}&lt;/strong&gt;&lt;span&gt;课堂总数&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 793 | <code>                    &lt;article&gt;&lt;strong&gt;${classroomSessions.filter((item) =&gt; item.status === 'active').length}&lt;/strong&gt;&lt;span&gt;进行中&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 794 | <code>                    &lt;article&gt;&lt;strong&gt;${classroomSessions.filter((item) =&gt; item.status === 'completed').length}&lt;/strong&gt;&lt;span&gt;已结束&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 795 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 796 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 797 | <code>            &lt;section class="content-grid two-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 798 | <code>                &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 799 | <code>                    &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;开启新课&lt;/span&gt;&lt;h3&gt;创建一节新的仿真课堂&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 800 | <code>                    &lt;form class="stack-form" data-form="classroom-start"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 801 | <code>                        &lt;div class="two-column"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 802 | <code>                            &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 803 | <code>                                &lt;span&gt;学科&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 804 | <code>                                &lt;select name="subject"&gt;${subjectOptions.map((subject) =&gt; `&lt;option value="${subject}"&gt;${subject}&lt;/option&gt;`).join('')}&lt;/select&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 805 | <code>                            &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 806 | <code>                            &lt;label&gt;&lt;span&gt;课堂主题&lt;/span&gt;&lt;input type="text" name="topic" placeholder="例如：函数图像基础判断" /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 807 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 808 | <code>                        &lt;button type="submit" class="primary-button"&gt;开始仿真课堂&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 809 | <code>                    &lt;/form&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 810 | <code>                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 811 | <code>                &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 812 | <code>                    &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;学情锚点&lt;/span&gt;&lt;h3&gt;当前可用于课堂调节的诊断信息&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 813 | <code>                    ${diagnostics.length ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 814 | <code>                        &lt;div class="card-grid two-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 815 | <code>                            ${diagnostics.slice(0, 4).map((item) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 816 | <code>                                &lt;article class="feature-card"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 817 | <code>                                    &lt;span class="pill"&gt;${escapeHtml(item.currentLevel)}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 818 | <code>                                    &lt;h4&gt;${escapeHtml(item.subject)}&lt;/h4&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 819 | <code>                                    &lt;p&gt;${escapeHtml(item.masterySummary)}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 820 | <code>                                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 821 | <code>                            `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 822 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 823 | <code>                    ` : '&lt;p class="muted-text"&gt;还没有学情画像，仿真课堂会先按注册偏好和弱科信息进行保守引导。&lt;/p&gt;'}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 824 | <code>                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 825 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 826 | <code>            ${activeSession ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 827 | <code>                &lt;section class="content-grid two-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 828 | <code>                    &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 829 | <code>                        &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;课堂实录&lt;/span&gt;&lt;h3&gt;仿真教师与学生对话&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 830 | <code>                        &lt;div class="transcript-stream"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 831 | <code>                            ${(activeSession.transcript &#124;&#124; []).map((entry) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 832 | <code>                                &lt;article class="transcript-bubble ${escapeHtml(entry.role)}"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 833 | <code>                                    &lt;span&gt;${escapeHtml(entry.role === 'teacher' ? '仿真教师' : entry.role === 'student' ? '学生' : '系统')}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 834 | <code>                                    &lt;p&gt;${escapeHtml(entry.text)}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 835 | <code>                                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 836 | <code>                            `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 837 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 838 | <code>                    &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 839 | <code>                    &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 840 | <code>                        &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;课堂互动&lt;/span&gt;&lt;h3&gt;当前作答区&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 841 | <code>                        ${activeSession.status === 'active' &amp;&amp; activeSession.currentQuestion ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 842 | <code>                            &lt;div class="question-stage"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 843 | <code>                                &lt;span class="pill"&gt;${escapeHtml(activeSession.subject)}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 844 | <code>                                &lt;h4&gt;${escapeHtml(activeSession.currentQuestion.stem &#124;&#124; '')}&lt;/h4&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 845 | <code>                                &lt;form class="stack-form" data-form="classroom-respond"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 846 | <code>                                    &lt;div class="choice-picks"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 847 | <code>                                        ${(activeSession.currentQuestion.choices &#124;&#124; []).map((choice, index) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 848 | <code>                                            &lt;label class="choice-pick"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 849 | <code>                                                &lt;input type="radio" name="selectedChoiceIndex" value="${index}" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 850 | <code>                                                &lt;span&gt;&lt;strong&gt;${String.fromCharCode(65 + index)}.&lt;/strong&gt; ${escapeHtml(choice)}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 851 | <code>                                            &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 852 | <code>                                        `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 853 | <code>                                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 854 | <code>                                    &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 855 | <code>                                        &lt;span&gt;课堂追问 / 理解困难&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 856 | <code>                                        &lt;textarea name="freeText" rows="4" placeholder="例如：我不太明白为什么不能选 B。"&gt;&lt;/textarea&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 857 | <code>                                    &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 858 | <code>                                    &lt;input type="hidden" name="sessionId" value="${escapeHtml(activeSession.id)}" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 859 | <code>                                    &lt;div class="button-row"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 860 | <code>                                        &lt;button type="submit" class="primary-button"&gt;提交课堂作答&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 861 | <code>                                        &lt;button type="button" class="ghost-button" data-action="complete-classroom" data-session-id="${escapeHtml(activeSession.id)}"&gt;结束本节课堂&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 862 | <code>                                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 863 | <code>                                &lt;/form&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 864 | <code>                            &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 865 | <code>                        ` : `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 866 | <code>                            &lt;div class="empty-state"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 867 | <code>                                &lt;p&gt;这节课堂已经结束，可以回看记录或重新开启下一节课。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 868 | <code>                                &lt;a class="primary-button inline-button" href="#classroom" data-page="classroom"&gt;再开一节&lt;/a&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 869 | <code>                            &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 870 | <code>                        `}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 871 | <code>                    &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 872 | <code>                &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 873 | <code>            ` : ''}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 874 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 875 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;课堂历史&lt;/span&gt;&lt;h3&gt;最近课堂记录&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 876 | <code>                ${classroomSessions.length ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 877 | <code>                    &lt;div class="card-grid three-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 878 | <code>                        ${classroomSessions.map((session) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 879 | <code>                            &lt;article class="feature-card"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 880 | <code>                                &lt;span class="pill"&gt;${escapeHtml(session.status === 'active' ? '进行中' : '已结束')}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 881 | <code>                                &lt;h4&gt;${escapeHtml(session.subject)}&lt;/h4&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 882 | <code>                                &lt;p&gt;${escapeHtml(session.topic &#124;&#124; '默认仿真带练')}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 883 | <code>                                &lt;ul class="tiny-list"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 884 | <code>                                    &lt;li&gt;作答次数：${escapeHtml(session.attemptedCount)}&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 885 | <code>                                    &lt;li&gt;答对题数：${escapeHtml(session.correctCount)}&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 886 | <code>                                    &lt;li&gt;&lt;a href="#classroom" data-page="classroom"&gt;打开课堂记录&lt;/a&gt;&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 887 | <code>                                &lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 888 | <code>                            &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 889 | <code>                        `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 890 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 891 | <code>                ` : '&lt;p class="muted-text"&gt;还没有课堂历史，开始第一节课后这里会保留每次课堂的过程与结果。&lt;/p&gt;'}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 892 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 893 | <code>        `,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 894 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 895 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 896 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 897 | <code>function renderDiagnostics() {</code> | 定义函数 `renderDiagnostics`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 898 | <code>    const overview = state.student &#124;&#124; {};</code> | 声明局部标识符 `overview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 899 | <code>    const currentUser = overview.student &#124;&#124; state.me?.user &#124;&#124; {};</code> | 声明局部标识符 `currentUser`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 900 | <code>    const diagnostics = overview.learning?.diagnostics &#124;&#124; [];</code> | 声明局部标识符 `diagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 901 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 902 | <code>    return renderHeroPage({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 903 | <code>        heroImage: heroImages.dashboard,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 904 | <code>        eyebrow: '学情画像',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 905 | <code>        heading: '把学前测试、课后数据和错题闭环收束成同一张图',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 906 | <code>        subheading: '这个模版先做了可运行的自适应诊断骨架，后续可以接入真实题库和动态出题引擎。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 907 | <code>        content: `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 908 | <code>            &lt;section class="content-grid two-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 909 | <code>                &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 910 | <code>                    &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;诊断录入&lt;/span&gt;&lt;h3&gt;生成或更新单学科学情画像&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 911 | <code>                    &lt;form class="stack-form" data-form="diagnostic"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 912 | <code>                        &lt;input type="hidden" name="gradeBand" value="${escapeHtml(currentUser.grade &#124;&#124; '')}" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 913 | <code>                        &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 914 | <code>                            &lt;span&gt;学科&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 915 | <code>                            &lt;select name="subject" required&gt;${subjectOptions.map((subject) =&gt; `&lt;option value="${subject}"&gt;${subject}&lt;/option&gt;`).join('')}&lt;/select&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 916 | <code>                        &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 917 | <code>                        &lt;div class="two-column"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 918 | <code>                            &lt;label&gt;&lt;span&gt;近期基线分数（满分 150）&lt;/span&gt;&lt;input type="number" min="0" max="150" name="baselineScore" value="96" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 919 | <code>                            &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 920 | <code>                                &lt;span&gt;课堂自信度（1-10）&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 921 | <code>                                &lt;input type="number" min="1" max="10" name="confidenceLevel" value="6" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 922 | <code>                            &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 923 | <code>                            &lt;label&gt;&lt;span&gt;作业完成率&lt;/span&gt;&lt;input type="number" min="0" max="100" name="homeworkCompletion" value="78" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 924 | <code>                            &lt;label&gt;&lt;span&gt;错题复盘完成率&lt;/span&gt;&lt;input type="number" min="0" max="100" name="mistakeRecovery" value="66" required /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 925 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 926 | <code>                        &lt;label&gt;&lt;span&gt;薄弱知识点（逗号分隔）&lt;/span&gt;&lt;textarea name="weakPoints" rows="3" placeholder="例如：函数图像，阅读理解，电学实验"&gt;函数图像，审题速度&lt;/textarea&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 927 | <code>                        &lt;div class="button-row"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 928 | <code>                            &lt;button type="submit" class="primary-button"&gt;生成学情画像&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 929 | <code>                            &lt;button type="button" class="ghost-button" data-action="demo-fill"&gt;填充演示数据&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 930 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 931 | <code>                    &lt;/form&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 932 | <code>                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 933 | <code>                &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 934 | <code>                    &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;自适应逻辑&lt;/span&gt;&lt;h3&gt;预留的教学闭环&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 935 | <code>                    &lt;div class="timeline"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 936 | <code>                        &lt;article&gt;&lt;strong&gt;01&lt;/strong&gt;&lt;p&gt;先采集基础分、课堂反馈、作业和错题复盘情况，形成初始分层。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 937 | <code>                        &lt;article&gt;&lt;strong&gt;02&lt;/strong&gt;&lt;p&gt;根据结果升降难度，后续可以直接接入真正的测试卷生成与判分引擎。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 938 | <code>                        &lt;article&gt;&lt;strong&gt;03&lt;/strong&gt;&lt;p&gt;画像结果会影响首页推荐、专项课程入口、错题推送和家长端提醒。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 939 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 940 | <code>                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 941 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 942 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 943 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;当前画像&lt;/span&gt;&lt;h3&gt;已保存的学科结果&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 944 | <code>                ${diagnostics.length ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 945 | <code>                    &lt;div class="card-grid three-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 946 | <code>                        ${diagnostics.map((item) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 947 | <code>                            &lt;article class="feature-card"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 948 | <code>                                &lt;span class="pill"&gt;${escapeHtml(item.currentLevel)}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 949 | <code>                                &lt;h4&gt;${escapeHtml(item.subject)}&lt;/h4&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 950 | <code>                                &lt;p&gt;${escapeHtml(item.masterySummary)}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 951 | <code>                                &lt;ul class="tiny-list"&gt;${(item.recommendedPath &#124;&#124; []).map((step) =&gt; `&lt;li&gt;${escapeHtml(step)}&lt;/li&gt;`).join('')}&lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 952 | <code>                            &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 953 | <code>                        `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 954 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 955 | <code>                ` : '&lt;p class="muted-text"&gt;还没有保存记录，先提交一轮诊断。&lt;/p&gt;'}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 956 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 957 | <code>        `,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 958 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 959 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 960 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 961 | <code>function renderPractice() {</code> | 定义函数 `renderPractice`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 962 | <code>    const overview = state.student &#124;&#124; {};</code> | 声明局部标识符 `overview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 963 | <code>    const assignments = overview.assignments?.recent &#124;&#124; [];</code> | 声明局部标识符 `assignments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 964 | <code>    const source = state.status?.questionBankSource &#124;&#124; {};</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 965 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 966 | <code>    return renderHeroPage({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 967 | <code>        heroImage: heroImages.courses,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 968 | <code>        eyebrow: '我的练习',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 969 | <code>        heading: '教师派发的真题练习都在这里统一查看',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 970 | <code>        subheading: '当前练习包来自公开真实题库，可继续接入自动判分、提交记录和错题回流。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 971 | <code>        content: `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 972 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 973 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;练习总览&lt;/span&gt;&lt;h3&gt;当前题源&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 974 | <code>                &lt;div class="metric-strip"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 975 | <code>                    &lt;article&gt;&lt;strong&gt;${assignments.length}&lt;/strong&gt;&lt;span&gt;练习包数量&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 976 | <code>                    &lt;article&gt;&lt;strong&gt;${escapeHtml(source.dataset &#124;&#124; '-')}&lt;/strong&gt;&lt;span&gt;题库数据集&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 977 | <code>                    &lt;article&gt;&lt;strong&gt;${escapeHtml(source.config &#124;&#124; '-')} / ${escapeHtml(source.split &#124;&#124; '-')}&lt;/strong&gt;&lt;span&gt;当前题源配置&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 978 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 979 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 980 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 981 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;练习包&lt;/span&gt;&lt;h3&gt;教师最近派发&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 982 | <code>                ${assignments.length ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 983 | <code>                    &lt;div class="assignment-stack"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 984 | <code>                        ${assignments.map((assignment) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 985 | <code>                            &lt;article class="assignment-card"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 986 | <code>                                &lt;div class="assignment-head"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 987 | <code>                                    &lt;div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 988 | <code>                                        &lt;span class="pill"&gt;${escapeHtml(assignment.subject)}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 989 | <code>                                        &lt;h4&gt;${escapeHtml(assignment.title)}&lt;/h4&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 990 | <code>                                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 991 | <code>                                    &lt;strong&gt;${escapeHtml(assignment.questionCount)} 题&lt;/strong&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 992 | <code>                                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 993 | <code>                                &lt;p&gt;${escapeHtml(assignment.notes &#124;&#124; '已生成练习包，可逐题查看。')}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 994 | <code>                                &lt;div class="tiny-meta"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 995 | <code>                                    &lt;span&gt;${escapeHtml(formatDateTime(assignment.createdAt))}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 996 | <code>                                    &lt;span&gt;${escapeHtml(assignment.source?.dataset &#124;&#124; '')}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 997 | <code>                                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 998 | <code>                                &lt;div class="question-list"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 999 | <code>                                    ${(assignment.questions &#124;&#124; []).map((question, index) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1000 | <code>                                        &lt;details class="question-detail"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1001 | <code>                                            &lt;summary&gt;&lt;span&gt;第 ${index + 1} 题&lt;/span&gt;&lt;span&gt;${escapeHtml(question.subject &#124;&#124; '')}&lt;/span&gt;&lt;/summary&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1002 | <code>                                            &lt;div class="question-body"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1003 | <code>                                                &lt;p&gt;${escapeHtml(question.stem &#124;&#124; '')}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1004 | <code>                                                &lt;ol class="choice-list"&gt;${(question.choices &#124;&#124; []).map((choice) =&gt; `&lt;li&gt;${escapeHtml(choice)}&lt;/li&gt;`).join('')}&lt;/ol&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1005 | <code>                                                &lt;div class="answer-box"&gt;&lt;strong&gt;参考答案：&lt;/strong&gt;&lt;span&gt;${escapeHtml(question.answerText &#124;&#124; `第 ${Number(question.answerIndex) + 1} 项`)}&lt;/span&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1006 | <code>                                            &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1007 | <code>                                        &lt;/details&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1008 | <code>                                    `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1009 | <code>                                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1010 | <code>                            &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1011 | <code>                        `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1012 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1013 | <code>                ` : '&lt;p class="muted-text"&gt;教师端暂时还没有派发练习，完成学情画像后会更容易按学科精准派题。&lt;/p&gt;'}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1014 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1015 | <code>        `,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1016 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1017 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1018 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1019 | <code>function renderModules() {</code> | 定义函数 `renderModules`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1020 | <code>    const groups = getModuleGroups();</code> | 声明局部标识符 `groups`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1021 | <code>    return renderHeroPage({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1022 | <code>        heroImage: heroImages.dashboard,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1023 | <code>        eyebrow: '平台模块',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1024 | <code>        heading: '把课前、课中、课后、教研和升学串成完整体系',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1025 | <code>        subheading: '这里按教学链路把 13 个模块拆开，方便你继续细化角色权限、接口和页面。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1026 | <code>        content: `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1027 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1028 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;全局框架&lt;/span&gt;&lt;h3&gt;九大主链路 + 新增三大闭环&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1029 | <code>                &lt;div class="stage-grid"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1030 | <code>                    ${Object.entries(groups).map(([stage, items]) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1031 | <code>                        &lt;section class="stage-column"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1032 | <code>                            &lt;div class="stage-head"&gt;&lt;span class="pill"&gt;${escapeHtml(stage)}&lt;/span&gt;&lt;h4&gt;${items.length} 个模块&lt;/h4&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1033 | <code>                            ${items.map((item) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1034 | <code>                                &lt;article class="stage-card"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1035 | <code>                                    &lt;h5&gt;${escapeHtml(item.title)}&lt;/h5&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1036 | <code>                                    &lt;p&gt;${escapeHtml(item.description)}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1037 | <code>                                    &lt;ul class="tiny-list"&gt;${item.outputs.map((output) =&gt; `&lt;li&gt;${escapeHtml(output)}&lt;/li&gt;`).join('')}&lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1038 | <code>                                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1039 | <code>                            `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1040 | <code>                        &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1041 | <code>                    `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1042 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1043 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1044 | <code>        `,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1045 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1046 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1047 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1048 | <code>function renderCourses() {</code> | 定义函数 `renderCourses`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1049 | <code>    return renderHeroPage({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1050 | <code>        heroImage: heroImages.courses,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1051 | <code>        eyebrow: '课程与冲刺',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1052 | <code>        heading: '课程体系从技巧提分延展到志愿与押题卷',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1053 | <code>        subheading: '当前模版已经把中考、高考、拔高和升学服务四条路径拆开，方便后续接课程库与题库。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1054 | <code>        content: `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1055 | <code>            &lt;section class="card-grid two-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1056 | <code>                ${courseTracks.map((track) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1057 | <code>                    &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1058 | <code>                        &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;专项路径&lt;/span&gt;&lt;h3&gt;${escapeHtml(track.title)}&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1059 | <code>                        &lt;p&gt;${escapeHtml(track.description)}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1060 | <code>                        &lt;ul class="tiny-list"&gt;${track.bullets.map((item) =&gt; `&lt;li&gt;${escapeHtml(item)}&lt;/li&gt;`).join('')}&lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1061 | <code>                    &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1062 | <code>                `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1063 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1064 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1065 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;课程序列&lt;/span&gt;&lt;h3&gt;建议的用户进阶节奏&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1066 | <code>                &lt;div class="timeline"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1067 | <code>                    &lt;article&gt;&lt;strong&gt;01&lt;/strong&gt;&lt;p&gt;基础会员完成准入建档与首轮学情测试，首页自动排出主攻科目。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1068 | <code>                    &lt;article&gt;&lt;strong&gt;02&lt;/strong&gt;&lt;p&gt;进入中考 / 高考技巧课和专项题型包，按基础、进阶、拔高三层推进。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1069 | <code>                    &lt;article&gt;&lt;strong&gt;03&lt;/strong&gt;&lt;p&gt;用押题卷、错题复盘、名校笔记和志愿规划收束到考前冲刺阶段。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1070 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1071 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1072 | <code>        `,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1073 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1074 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1075 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1076 | <code>function renderVip() {</code> | 定义函数 `renderVip`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1077 | <code>    const currentUser = state.student?.student &#124;&#124; state.me?.user &#124;&#124; {};</code> | 声明局部标识符 `currentUser`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1078 | <code>    return renderHeroPage({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1079 | <code>        heroImage: heroImages.courses,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1080 | <code>        eyebrow: '会员体系',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1081 | <code>        heading: '八级 VIP 权益覆盖课程深度、资源权限和升学服务颗粒度',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1082 | <code>        subheading: '这里先把你的会员分层方案转成了可展示的权益矩阵，后续可继续接入支付和订单。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1083 | <code>        content: `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1084 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1085 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;当前会员&lt;/span&gt;&lt;h3&gt;${escapeHtml(currentUser.vipLevel &#124;&#124; '基础会员')}&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1086 | <code>                &lt;div class="card-grid four-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1087 | <code>                    ${vipTiers.map((tier) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1088 | <code>                        &lt;article class="feature-card ${currentUser.vipLevel === tier.name ? 'featured' : ''}"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1089 | <code>                            &lt;span class="pill"&gt;¥ ${escapeHtml(tier.price)}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1090 | <code>                            &lt;h4&gt;${escapeHtml(tier.name)}&lt;/h4&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1091 | <code>                            &lt;p&gt;${escapeHtml(tier.audience)}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1092 | <code>                            &lt;ul class="tiny-list"&gt;${tier.rights.map((item) =&gt; `&lt;li&gt;${escapeHtml(item)}&lt;/li&gt;`).join('')}&lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1093 | <code>                        &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1094 | <code>                    `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1095 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1096 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1097 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1098 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;资源映射&lt;/span&gt;&lt;h3&gt;专属资源权限&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1099 | <code>                &lt;div class="card-grid two-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1100 | <code>                    ${vipTiers.map((tier) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1101 | <code>                        &lt;article class="feature-card"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1102 | <code>                            &lt;h4&gt;${escapeHtml(tier.name)}&lt;/h4&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1103 | <code>                            &lt;ul class="tiny-list"&gt;${tier.resources.map((item) =&gt; `&lt;li&gt;${escapeHtml(item)}&lt;/li&gt;`).join('')}&lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1104 | <code>                        &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1105 | <code>                    `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1106 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1107 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1108 | <code>        `,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1109 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1110 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1112 | <code>function renderEcosystem() {</code> | 定义函数 `renderEcosystem`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1113 | <code>    return renderHeroPage({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1114 | <code>        heroImage: heroImages.ecosystem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1115 | <code>        eyebrow: '教研与家校',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1116 | <code>        heading: '把硬件、教研、家校和错题闭环接成一个教学生态',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1117 | <code>        subheading: '这部分是后续做机构版本和校区版本最重要的中台骨架。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1118 | <code>        content: `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1119 | <code>            &lt;section class="card-grid two-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1120 | <code>                ${ecosystemPanels.map((panel) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1121 | <code>                    &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1122 | <code>                        &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;生态模块&lt;/span&gt;&lt;h3&gt;${escapeHtml(panel.title)}&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1123 | <code>                        &lt;p&gt;${escapeHtml(panel.description)}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1124 | <code>                        &lt;ul class="tiny-list"&gt;${panel.bullets.map((item) =&gt; `&lt;li&gt;${escapeHtml(item)}&lt;/li&gt;`).join('')}&lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1125 | <code>                    &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1126 | <code>                `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1127 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1128 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1129 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;落地建议&lt;/span&gt;&lt;h3&gt;推荐优先对接的外部能力&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1130 | <code>                &lt;div class="timeline"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1131 | <code>                    &lt;article&gt;&lt;strong&gt;01&lt;/strong&gt;&lt;p&gt;先接真实题库、试卷和批改数据，再让学情、错题、教研中台自动联动。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1132 | <code>                    &lt;article&gt;&lt;strong&gt;02&lt;/strong&gt;&lt;p&gt;把人脸识别、语音播报与课堂大屏接进课堂流程，形成签到到互动的完整链路。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1133 | <code>                    &lt;article&gt;&lt;strong&gt;03&lt;/strong&gt;&lt;p&gt;最后补教师端、家长端、志愿填报数据源和支付体系，形成商业化闭环。&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1134 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1135 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1136 | <code>        `,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1137 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1138 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1140 | <code>function renderTeacherDashboard() {</code> | 定义函数 `renderTeacherDashboard`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1141 | <code>    const overview = state.teacher &#124;&#124; {};</code> | 声明局部标识符 `overview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1142 | <code>    const currentUser = overview.teacher &#124;&#124; state.me?.user &#124;&#124; {};</code> | 声明局部标识符 `currentUser`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1143 | <code>    const studentCards = state.teacherStudents &#124;&#124; [];</code> | 声明局部标识符 `studentCards`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1144 | <code>    const teacherAssignments = overview.recentAssignments &#124;&#124; [];</code> | 声明局部标识符 `teacherAssignments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1145 | <code>    const questionBank = overview.questionBank &#124;&#124; {};</code> | 声明局部标识符 `questionBank`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1146 | <code>    const questionBankStats = questionBank.stats &#124;&#124; { total: 0, subjectBreakdown: {} };</code> | 声明局部标识符 `questionBankStats`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1148 | <code>    return renderHeroPage({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1149 | <code>        heroImage: heroImages.ecosystem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1150 | <code>        eyebrow: '教师总控台',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1151 | <code>        heading: '在一个后台里看学生、看画像、看派题结果',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1152 | <code>        subheading: '这版先把教师端最需要的三件事串起来：学生名单、真实题库、派题记录。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1153 | <code>        content: `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1154 | <code>            &lt;section class="hero-band"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1155 | <code>                &lt;div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1156 | <code>                    &lt;span class="eyebrow"&gt;当前教师身份&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1157 | <code>                    &lt;h2&gt;${escapeHtml(currentUser.fullName &#124;&#124; '')} · ${escapeHtml(currentUser.teacherTitle &#124;&#124; '教师')}&lt;/h2&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1158 | <code>                    &lt;p&gt;校区：${escapeHtml(currentUser.schoolName &#124;&#124; '')}。负责学科：${escapeHtml((currentUser.managedSubjects &#124;&#124; []).join('、') &#124;&#124; '待配置')}。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1159 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1160 | <code>                &lt;div class="metric-strip"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1161 | <code>                    &lt;article&gt;&lt;strong&gt;${studentCards.length}&lt;/strong&gt;&lt;span&gt;学生人数&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1162 | <code>                    &lt;article&gt;&lt;strong&gt;${teacherAssignments.length}&lt;/strong&gt;&lt;span&gt;已派练习包&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1163 | <code>                    &lt;article&gt;&lt;strong&gt;${escapeHtml(questionBankStats.total &#124;&#124; 0)}&lt;/strong&gt;&lt;span&gt;题库可用题量&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1164 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1165 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1166 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1167 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;学生名单&lt;/span&gt;&lt;h3&gt;当前学生画像概览&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1168 | <code>                ${studentCards.length ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1169 | <code>                    &lt;div class="card-grid three-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1170 | <code>                        ${studentCards.map((student) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1171 | <code>                            &lt;article class="feature-card"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1172 | <code>                                &lt;span class="pill"&gt;${escapeHtml(student.grade &#124;&#124; '')}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1173 | <code>                                &lt;h4&gt;${escapeHtml(student.fullName)}&lt;/h4&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1174 | <code>                                &lt;p&gt;${escapeHtml(student.schoolName &#124;&#124; '')} · ${escapeHtml(student.className &#124;&#124; '')}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1175 | <code>                                &lt;ul class="tiny-list"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1176 | <code>                                    &lt;li&gt;主弱项：${escapeHtml(student.topWeakness &#124;&#124; '待诊断')}&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1177 | <code>                                    &lt;li&gt;学情画像：${escapeHtml(student.diagnosticCount &#124;&#124; 0)} 科&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1178 | <code>                                    &lt;li&gt;已派练习：${escapeHtml(student.assignmentsCount &#124;&#124; 0)} 份&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1179 | <code>                                &lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1180 | <code>                            &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1181 | <code>                        `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1182 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1183 | <code>                ` : '&lt;p class="muted-text"&gt;当前还没有学生注册，等学生入班后这里会自动出现名单与画像摘要。&lt;/p&gt;'}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1184 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1185 | <code>            &lt;section class="content-grid two-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1186 | <code>                &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1187 | <code>                    &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;真实题库&lt;/span&gt;&lt;h3&gt;当前题库覆盖&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1188 | <code>                    ${questionBank.warning ? `&lt;div class="notice warning"&gt;${escapeHtml(questionBank.warning)}&lt;/div&gt;` : ''}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1189 | <code>                    &lt;div class="tiny-meta block-meta"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1190 | <code>                        &lt;span&gt;当前来源：${escapeHtml(questionBank.source?.label &#124;&#124; '')}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1191 | <code>                        &lt;span&gt;总题量：${escapeHtml(questionBankStats.total &#124;&#124; 0)}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1192 | <code>                        &lt;span&gt;按学科分布如下&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1193 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1194 | <code>                    &lt;div class="subject-breakdown"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1195 | <code>                        ${Object.entries(questionBankStats.subjectBreakdown &#124;&#124; {}).map(([subject, count]) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1196 | <code>                            &lt;article&gt;&lt;strong&gt;${escapeHtml(subject)}&lt;/strong&gt;&lt;span&gt;${escapeHtml(count)} 题&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1197 | <code>                        `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1198 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1199 | <code>                    &lt;a class="primary-button inline-button" href="#teacher-question-bank" data-page="teacher-question-bank"&gt;进入题库派题&lt;/a&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1200 | <code>                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1201 | <code>                &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1202 | <code>                    &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;最近派题&lt;/span&gt;&lt;h3&gt;教师操作记录&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1203 | <code>                    ${teacherAssignments.length ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1204 | <code>                        &lt;div class="timeline compact-timeline"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1205 | <code>                            ${teacherAssignments.slice(0, 4).map((assignment, index) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1206 | <code>                                &lt;article&gt;&lt;strong&gt;0${index + 1}&lt;/strong&gt;&lt;p&gt;${escapeHtml(assignment.title)} · ${escapeHtml(assignment.questionCount)} 题&lt;/p&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1207 | <code>                            `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1208 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1209 | <code>                    ` : '&lt;p class="muted-text"&gt;还没有派题记录，先从真实题库里选题发给学生。&lt;/p&gt;'}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1210 | <code>                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1211 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1212 | <code>        `,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1213 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1214 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1216 | <code>function renderTeacherClassroom() {</code> | 定义函数 `renderTeacherClassroom`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1217 | <code>    const sessions = state.teacherClassrooms?.sessions &#124;&#124; [];</code> | 声明局部标识符 `sessions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1218 | <code>    const activeCount = state.teacherClassrooms?.activeCount &#124;&#124; 0;</code> | 声明局部标识符 `activeCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1219 | <code>    const completedCount = state.teacherClassrooms?.completedCount &#124;&#124; 0;</code> | 声明局部标识符 `completedCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1221 | <code>    return renderHeroPage({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1222 | <code>        heroImage: heroImages.ecosystem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1223 | <code>        eyebrow: '课堂看板',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1224 | <code>        heading: '把学生仿真课堂的开启、进行和完成情况放到一个看板里',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1225 | <code>        subheading: '教师可以先从这里判断课堂使用频率和进度，再回到题库与学情模块继续干预。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1226 | <code>        content: `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1227 | <code>            &lt;section class="hero-band"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1228 | <code>                &lt;div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1229 | <code>                    &lt;span class="eyebrow"&gt;课堂总览&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1230 | <code>                    &lt;h2&gt;最近仿真课堂动态&lt;/h2&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1231 | <code>                    &lt;p&gt;这里汇总学生最近进入的仿真课堂，包括学科、状态、作答次数和答对题数。&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1232 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1233 | <code>                &lt;div class="metric-strip"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1234 | <code>                    &lt;article&gt;&lt;strong&gt;${sessions.length}&lt;/strong&gt;&lt;span&gt;最近课堂&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1235 | <code>                    &lt;article&gt;&lt;strong&gt;${activeCount}&lt;/strong&gt;&lt;span&gt;进行中&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1236 | <code>                    &lt;article&gt;&lt;strong&gt;${completedCount}&lt;/strong&gt;&lt;span&gt;已结束&lt;/span&gt;&lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1237 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1238 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1239 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1240 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;看板列表&lt;/span&gt;&lt;h3&gt;课堂记录&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1241 | <code>                ${sessions.length ? `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1242 | <code>                    &lt;div class="card-grid three-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1243 | <code>                        ${sessions.map((session) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1244 | <code>                            &lt;article class="feature-card"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1245 | <code>                                &lt;span class="pill"&gt;${escapeHtml(session.status === 'active' ? '进行中' : '已结束')}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1246 | <code>                                &lt;h4&gt;${escapeHtml(session.studentName &#124;&#124; '')} · ${escapeHtml(session.subject)}&lt;/h4&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1247 | <code>                                &lt;p&gt;${escapeHtml(session.topic &#124;&#124; '默认仿真带练')}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1248 | <code>                                &lt;ul class="tiny-list"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1249 | <code>                                    &lt;li&gt;作答次数：${escapeHtml(session.attemptedCount)}&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1250 | <code>                                    &lt;li&gt;答对题数：${escapeHtml(session.correctCount)}&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1251 | <code>                                    &lt;li&gt;课堂焦点：${escapeHtml(session.focusSummary &#124;&#124; '')}&lt;/li&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1252 | <code>                                &lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1253 | <code>                            &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1254 | <code>                        `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1255 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1256 | <code>                ` : '&lt;p class="muted-text"&gt;还没有学生进入仿真课堂。学生开始上课后，这里会自动出现课堂动态。&lt;/p&gt;'}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1257 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1258 | <code>        `,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1259 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1260 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1262 | <code>function renderTeacherQuestionBank() {</code> | 定义函数 `renderTeacherQuestionBank`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1263 | <code>    const search = state.questionBank &#124;&#124; { source: {}, filters: {}, results: [], warning: '', stats: { subjectBreakdown: {} } };</code> | 声明局部标识符 `search`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1264 | <code>    const students = state.teacherStudents &#124;&#124; [];</code> | 声明局部标识符 `students`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1266 | <code>    return renderHeroPage({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1267 | <code>        heroImage: heroImages.courses,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1268 | <code>        eyebrow: '真实题库派题',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1269 | <code>        heading: '教师检索真题后，可以直接派发到学生端',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1270 | <code>        subheading: '当前接入的是公开真实题库数据集，已经按题干、选项、答案和学科做了统一格式化。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1271 | <code>        content: `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1272 | <code>            &lt;section class="content-grid two-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1273 | <code>                &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1274 | <code>                    &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;检索条件&lt;/span&gt;&lt;h3&gt;筛选真题&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1275 | <code>                    ${search.warning ? `&lt;div class="notice warning"&gt;${escapeHtml(search.warning)}&lt;/div&gt;` : ''}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1276 | <code>                    &lt;p class="muted-text"&gt;当前来源：${escapeHtml(search.source?.label &#124;&#124; '')}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1277 | <code>                    &lt;form class="stack-form" data-form="question-search"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1278 | <code>                        &lt;div class="two-column"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1279 | <code>                            &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1280 | <code>                                &lt;span&gt;学科&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1281 | <code>                                &lt;select name="subject"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1282 | <code>                                    &lt;option value="全部" ${search.filters?.subject === '全部' ? 'selected' : ''}&gt;全部&lt;/option&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1283 | <code>                                    ${subjectOptions.map((subject) =&gt; `&lt;option value="${subject}" ${search.filters?.subject === subject ? 'selected' : ''}&gt;${subject}&lt;/option&gt;`).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1284 | <code>                                &lt;/select&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1285 | <code>                            &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1286 | <code>                            &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1287 | <code>                                &lt;span&gt;返回数量&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1288 | <code>                                &lt;select name="limit"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1289 | <code>                                    ${[6, 12, 18].map((limit) =&gt; `&lt;option value="${limit}" ${Number(search.filters?.limit &#124;&#124; 12) === limit ? 'selected' : ''}&gt;${limit}&lt;/option&gt;`).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1290 | <code>                                &lt;/select&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1291 | <code>                            &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1292 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1293 | <code>                        &lt;label&gt;&lt;span&gt;关键词&lt;/span&gt;&lt;input type="text" name="query" value="${escapeHtml(search.filters?.query &#124;&#124; '')}" placeholder="例如：函数、阅读理解、实验" /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1294 | <code>                        &lt;button type="submit" class="primary-button"&gt;搜索题库&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1295 | <code>                    &lt;/form&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1296 | <code>                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1297 | <code>                &lt;article class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1298 | <code>                    &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;派题设置&lt;/span&gt;&lt;h3&gt;把所选题目发给学生&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1299 | <code>                    &lt;form class="stack-form" data-form="assignment-create"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1300 | <code>                        &lt;input type="hidden" name="subject" value="${escapeHtml(search.filters?.subject &#124;&#124; '')}" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1301 | <code>                        &lt;input type="hidden" name="query" value="${escapeHtml(search.filters?.query &#124;&#124; '')}" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1302 | <code>                        &lt;label&gt;&lt;span&gt;练习包标题&lt;/span&gt;&lt;input type="text" name="title" placeholder="例如：初三数学函数基础真题包" /&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1303 | <code>                        &lt;label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1304 | <code>                            &lt;span&gt;目标学生&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1305 | <code>                            &lt;select name="studentId" required&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1306 | <code>                                &lt;option value=""&gt;请选择学生&lt;/option&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1307 | <code>                                ${students.map((student) =&gt; `&lt;option value="${student.id}"&gt;${escapeHtml(student.fullName)} · ${escapeHtml(student.grade &#124;&#124; '')} · ${escapeHtml(student.className &#124;&#124; '')}&lt;/option&gt;`).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1308 | <code>                            &lt;/select&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1309 | <code>                        &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1310 | <code>                        &lt;label&gt;&lt;span&gt;派题说明&lt;/span&gt;&lt;textarea name="notes" rows="3" placeholder="例如：先做基础题，周三前完成。"&gt;&lt;/textarea&gt;&lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1311 | <code>                        &lt;div class="question-pick-list"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1312 | <code>                            ${search.results.map((question, index) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1313 | <code>                                &lt;label class="question-pick"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1314 | <code>                                    &lt;div class="question-pick-top"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1315 | <code>                                        &lt;input type="checkbox" name="questionIds" value="${escapeHtml(question.sourceId)}" /&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1316 | <code>                                        &lt;span&gt;第 ${index + 1} 题&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1317 | <code>                                        &lt;span&gt;${escapeHtml(question.subject &#124;&#124; '')}&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1318 | <code>                                        ${question.level ? `&lt;span&gt;${escapeHtml(question.level)}&lt;/span&gt;` : ''}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1319 | <code>                                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1320 | <code>                                    &lt;strong&gt;${escapeHtml(question.stem &#124;&#124; '')}&lt;/strong&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1321 | <code>                                    &lt;ol class="choice-list compact-choice-list"&gt;${(question.choices &#124;&#124; []).map((choice) =&gt; `&lt;li&gt;${escapeHtml(choice)}&lt;/li&gt;`).join('')}&lt;/ol&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1322 | <code>                                &lt;/label&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1323 | <code>                            `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1324 | <code>                        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1325 | <code>                        &lt;button type="submit" class="primary-button"&gt;生成练习包并派发&lt;/button&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1326 | <code>                    &lt;/form&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1327 | <code>                &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1328 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1329 | <code>            &lt;section class="panel"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1330 | <code>                &lt;div class="section-heading"&gt;&lt;span class="eyebrow"&gt;检索结果&lt;/span&gt;&lt;h3&gt;当前共命中 ${search.results.length} 道题&lt;/h3&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1331 | <code>                &lt;div class="card-grid two-up"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1332 | <code>                    ${search.results.map((question) =&gt; `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1333 | <code>                        &lt;article class="feature-card"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1334 | <code>                            &lt;div class="metric-head"&gt;&lt;h4&gt;${escapeHtml(question.subject &#124;&#124; '')}&lt;/h4&gt;&lt;span&gt;${escapeHtml(question.level &#124;&#124; '常规')}&lt;/span&gt;&lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1335 | <code>                            &lt;p&gt;${escapeHtml(question.stem &#124;&#124; '')}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1336 | <code>                            &lt;ul class="tiny-list"&gt;${(question.choices &#124;&#124; []).slice(0, 4).map((choice) =&gt; `&lt;li&gt;${escapeHtml(choice)}&lt;/li&gt;`).join('')}&lt;/ul&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1337 | <code>                        &lt;/article&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1338 | <code>                    `).join('')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1339 | <code>                &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1340 | <code>            &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1341 | <code>        `,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1342 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1343 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1345 | <code>function renderAppView() {</code> | 定义函数 `renderAppView`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1346 | <code>    const currentUser = state.me?.user;</code> | 声明局部标识符 `currentUser`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1347 | <code>    const navigation = getNavigationForUser(currentUser);</code> | 声明局部标识符 `navigation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1348 | <code>    let pageContent = '';</code> | 声明局部标识符 `pageContent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1349 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1350 | <code>    if (isTeacherLike(currentUser) &amp;&amp; isTeacherPage(state.currentPage)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1351 | <code>        if (state.currentPage === 'teacher-classroom') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1352 | <code>            pageContent = renderTeacherClassroom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1353 | <code>        } else if (state.currentPage === 'teacher-question-bank') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1354 | <code>            pageContent = renderTeacherQuestionBank();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1355 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1356 | <code>            pageContent = renderTeacherDashboard();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1357 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1358 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1359 | <code>        if (state.currentPage === 'classroom') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1360 | <code>            pageContent = renderStudentClassroom();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1361 | <code>        } else if (state.currentPage === 'diagnostics') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1362 | <code>            pageContent = renderDiagnostics();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1363 | <code>        } else if (state.currentPage === 'practice') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1364 | <code>            pageContent = renderPractice();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1365 | <code>        } else if (state.currentPage === 'modules') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1366 | <code>            pageContent = renderModules();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1367 | <code>        } else if (state.currentPage === 'courses') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1368 | <code>            pageContent = renderCourses();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1369 | <code>        } else if (state.currentPage === 'vip') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1370 | <code>            pageContent = renderVip();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1371 | <code>        } else if (state.currentPage === 'ecosystem') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1372 | <code>            pageContent = renderEcosystem();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1373 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1374 | <code>            pageContent = renderStudentDashboard();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1375 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1376 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1378 | <code>    return `</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1379 | <code>        &lt;div class="app-shell"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1380 | <code>            ${renderSidebar(currentUser, navigation)}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1381 | <code>            ${pageContent}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1382 | <code>        &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1383 | <code>    `;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1384 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1385 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1386 | <code>function renderAuthView() {</code> | 定义函数 `renderAuthView`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1387 | <code>    if (state.currentPage === 'register') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1388 | <code>        return renderAuthRegister();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1389 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1390 | <code>    if (state.currentPage === 'teacher-register') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1391 | <code>        return renderTeacherRegister();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1392 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1393 | <code>    return renderAuthLogin();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1394 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1396 | <code>function render() {</code> | 定义函数 `render`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1397 | <code>    updateBodyClass();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1398 | <code>    app.innerHTML = state.me?.user ? renderAppView() : renderAuthView();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1399 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1400 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1401 | <code>async function submitAuthForm(formName, payload) {</code> | 定义函数 `submitAuthForm`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1402 | <code>    if (formName === 'login') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1403 | <code>        await api('/api/edu/auth/login', { method: 'POST', body: payload });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1404 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1405 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1406 | <code>    if (formName === 'student-register') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1407 | <code>        await api('/api/edu/auth/register/student', {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1408 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1409 | <code>            body: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1410 | <code>                ...payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1411 | <code>                favoriteSubjects: payload.favoriteSubjects &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1412 | <code>                weakSubjects: payload.weakSubjects &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1413 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1414 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1415 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1416 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1417 | <code>    await api('/api/edu/auth/register/teacher', {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1418 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1419 | <code>        body: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1420 | <code>            ...payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1421 | <code>            managedSubjects: payload.managedSubjects &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1422 | <code>            managedGrades: payload.managedGrades &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1423 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1424 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1425 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1426 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1427 | <code>async function handleSubmit(event) {</code> | 定义函数 `handleSubmit`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1428 | <code>    const form = event.target;</code> | 声明局部标识符 `form`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1429 | <code>    if (!(form instanceof HTMLFormElement)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1430 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1431 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1432 | <code>    const formName = form.dataset.form;</code> | 声明局部标识符 `formName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1433 | <code>    if (!formName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1434 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1435 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1436 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1437 | <code>    event.preventDefault();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1438 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1439 | <code>        const payload = buildFormPayload(form);</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1440 | <code>        if (['login', 'student-register', 'teacher-register'].includes(formName)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1441 | <code>            await submitAuthForm(formName, payload);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1442 | <code>            await refreshSessionData();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1443 | <code>            setPage(resolvePageForState(getHashPage() &#124;&#124; state.currentPage), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1444 | <code>        } else if (formName === 'diagnostic') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1445 | <code>            await api('/api/edu/student/diagnostics', {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1446 | <code>                method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1447 | <code>                body: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1448 | <code>                    ...payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1449 | <code>                    baselineScore: Number(payload.baselineScore &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1450 | <code>                    confidenceLevel: Number(payload.confidenceLevel &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1451 | <code>                    homeworkCompletion: Number(payload.homeworkCompletion &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1452 | <code>                    mistakeRecovery: Number(payload.mistakeRecovery &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1453 | <code>                    weakPoints: String(payload.weakPoints &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1454 | <code>                        .replaceAll('，', ',')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1455 | <code>                        .replaceAll('、', ',')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1456 | <code>                        .split(',')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1457 | <code>                        .map((item) =&gt; item.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1458 | <code>                        .filter(Boolean),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1459 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1460 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1461 | <code>            await loadStudentData();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1462 | <code>        } else if (formName === 'classroom-start') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1463 | <code>            await api('/api/edu/student/classroom-sessions', { method: 'POST', body: payload });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1464 | <code>            await loadStudentData();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1465 | <code>            setPage('classroom', false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1466 | <code>        } else if (formName === 'classroom-respond') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1467 | <code>            await api(`/api/edu/student/classroom-sessions/${payload.sessionId}/respond`, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1468 | <code>                method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1469 | <code>                body: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1470 | <code>                    selectedChoiceIndex: payload.selectedChoiceIndex === '' ? null : Number(payload.selectedChoiceIndex),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1471 | <code>                    freeText: payload.freeText &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1472 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1473 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1474 | <code>            await loadStudentData();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1475 | <code>        } else if (formName === 'question-search') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1476 | <code>            state.questionBank = await api(`/api/edu/teacher/question-bank?subject=${encodeURIComponent(payload.subject &#124;&#124; '')}&amp;query=${encodeURIComponent(payload.query &#124;&#124; '')}&amp;limit=${encodeURIComponent(payload.limit &#124;&#124; 12)}`);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1477 | <code>        } else if (formName === 'assignment-create') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1478 | <code>            if (!(payload.questionIds &#124;&#124; []).length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1479 | <code>                throw new Error('请至少勾选 1 道真题。');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1480 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1481 | <code>            await api('/api/edu/teacher/assignments', {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1482 | <code>                method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1483 | <code>                body: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1484 | <code>                    studentId: Number(payload.studentId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1485 | <code>                    questionIds: payload.questionIds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1486 | <code>                    subject: payload.subject &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1487 | <code>                    query: payload.query &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1488 | <code>                    title: payload.title &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1489 | <code>                    notes: payload.notes &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1490 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1491 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1492 | <code>            await loadTeacherData();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1493 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1494 | <code>        render();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1495 | <code>        showToast('操作已完成。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1496 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1497 | <code>        showToast(error.message &#124;&#124; '操作失败', true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1498 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1499 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1500 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1501 | <code>async function handleClick(event) {</code> | 定义函数 `handleClick`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1502 | <code>    const target = event.target.closest('[data-action], [data-page]');</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1503 | <code>    if (!target) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1504 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1505 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1506 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1507 | <code>    const page = target.dataset.page;</code> | 声明局部标识符 `page`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1508 | <code>    if (page) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1509 | <code>        event.preventDefault();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1510 | <code>        setPage(resolvePageForState(page));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1511 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1512 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1513 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1514 | <code>    const action = target.dataset.action;</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1515 | <code>    if (!action) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1516 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1517 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1518 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1519 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1520 | <code>        if (action === 'logout') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1521 | <code>            await api('/api/edu/auth/logout', { method: 'POST' });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1522 | <code>            await refreshSessionData();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1523 | <code>            setPage('login', false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1524 | <code>            render();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1525 | <code>            showToast('已退出登录。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1526 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1527 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1528 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1529 | <code>        if (action === 'toggle-nav') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1530 | <code>            const sidebar = document.querySelector('[data-sidebar]');</code> | 声明局部标识符 `sidebar`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1531 | <code>            if (sidebar) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1532 | <code>                sidebar.classList.toggle('open');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1533 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1534 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1535 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1536 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1537 | <code>        if (action === 'complete-classroom') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1538 | <code>            await api(`/api/edu/student/classroom-sessions/${target.dataset.sessionId}/complete`, { method: 'POST' });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1539 | <code>            await loadStudentData();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1540 | <code>            render();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1541 | <code>            showToast('课堂已结束。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1542 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1543 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1544 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1545 | <code>        if (action === 'demo-fill') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1546 | <code>            const subject = document.querySelector('[name="subject"]');</code> | 声明局部标识符 `subject`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1547 | <code>            const baselineScore = document.querySelector('[name="baselineScore"]');</code> | 声明局部标识符 `baselineScore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1548 | <code>            const confidenceLevel = document.querySelector('[name="confidenceLevel"]');</code> | 声明局部标识符 `confidenceLevel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1549 | <code>            const homeworkCompletion = document.querySelector('[name="homeworkCompletion"]');</code> | 声明局部标识符 `homeworkCompletion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1550 | <code>            const mistakeRecovery = document.querySelector('[name="mistakeRecovery"]');</code> | 声明局部标识符 `mistakeRecovery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1551 | <code>            const weakPoints = document.querySelector('[name="weakPoints"]');</code> | 声明局部标识符 `weakPoints`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1552 | <code>            if (subject) subject.value = '英语';</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1553 | <code>            if (baselineScore) baselineScore.value = '108';</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1554 | <code>            if (confidenceLevel) confidenceLevel.value = '4';</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1555 | <code>            if (homeworkCompletion) homeworkCompletion.value = '84';</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1556 | <code>            if (mistakeRecovery) mistakeRecovery.value = '72';</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1557 | <code>            if (weakPoints) weakPoints.value = '完形填空，阅读定位，长难句拆解';</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1558 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1559 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1560 | <code>        showToast(error.message &#124;&#124; '操作失败', true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1561 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1562 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1563 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1564 | <code>async function init() {</code> | 定义函数 `init`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1565 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1566 | <code>        await loadStatus();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1567 | <code>        await refreshSessionData();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1568 | <code>        state.currentPage = resolvePageForState(getHashPage() &#124;&#124; state.currentPage);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1569 | <code>        render();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1570 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1571 | <code>        app.innerHTML = `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1572 | <code>            &lt;main class="auth-layout" style="--hero-image: url('${heroImages.auth}');"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1573 | <code>                &lt;section class="auth-hero"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1574 | <code>                    &lt;div class="auth-copy"&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1575 | <code>                        &lt;span class="eyebrow"&gt;系统暂时不可用&lt;/span&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1576 | <code>                        &lt;h1&gt;加载失败，请稍后重试。&lt;/h1&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1577 | <code>                        &lt;p&gt;${escapeHtml(error.message &#124;&#124; '接口暂时不可用')}&lt;/p&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1578 | <code>                    &lt;/div&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1579 | <code>                &lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1580 | <code>                &lt;section class="auth-panel"&gt;&lt;/section&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1581 | <code>            &lt;/main&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1582 | <code>        `;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1583 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1584 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1585 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1586 | <code>window.addEventListener('hashchange', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1587 | <code>    state.currentPage = resolvePageForState(getHashPage());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1588 | <code>    render();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
| 1589 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1591 | <code>app.addEventListener('submit', handleSubmit);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1592 | <code>app.addEventListener('click', handleClick);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1593 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1594 | <code>init();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“可选 Python/FastAPI 后端的配置、核心逻辑或静态资源。”这一文件职责。 |
