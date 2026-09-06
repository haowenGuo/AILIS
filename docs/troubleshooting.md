# 排错：先确定实际运行对象

[手册索引与源码基线](README.md)

记录实际 exe 或源码路径、commit、dirty 状态、状态目录、Session／run ID、provider／model、错误码和时间。只看到窗口标题“1.4.1”不够。排错日志先脱敏，不粘贴整份 desktop-state、环境变量或用户历史。

| 症状 | 优先检查 | 不要这样处理 |
| --- | --- | --- |
| 启动后仍像旧版本 | 实际启动的是安装包还是工作树；构建 revision；是否重启了对应进程 | 仅凭 package.json 版本相同就认定代码相同 |
| 两个工作树互相影响 | userData、ailisResolvedStateDir、端口、Session、共享发布目录和外部服务 | 删除另一任务的状态或终止所有 Node／Docker |
| `AILIS_SESSION_BUSY` | 同 Session 活跃写者、lock owner 与 PID | 无论进程是否存活都删 lock 强抢 |
| `write EPIPE`／工具空转 | Code mode worker 启动路径、stderr、IPC、权限与退出；包内 unpacked 文件 | 把管道异常归因于模型不会操作，或盲目重复副作用命令 |
| 源码能执行，包内不能 | worker／Python／Stockfish 是否打包，OS cwd 是否误用虚拟 ASAR 路径 | 靠源仓 node_modules 回退掩盖漏包 |
| 工具搜不到 | 注册、direct/deferred/hidden 状态、tool_search、实际 provider schema | 只改 prompt 宣称工具已存在 |
| 工具显示摘要，缺细节 | outputId／artifactHandle 所属 store、文件存在性和可回读范围 | 将摘要字节数当全程 token，或重复跑原命令 |
| 附件查询失败 | `art_*` 与 `ctx-*` owner 是否串用、adapter 和 Python 依赖 | 把 artifact_tools 的 ID 传给 artifact_query |
| 称呼错误或用了旧架构 | 生效 Session／画像／用户偏好、读到的文件路径与 commit、角色呈现是否改正文 | 只调温度，或以旧 docs 当最新代码证据 |
| 上下文越来越大／缓存低 | 输入前缀哈希、tools hash、原始 usage、压缩模式与触发范围 | 声称有稳定 cache key 就保证命中 |
| 文本正常但没有声音 | speechMode、音频设备、TTS provider、模型资源、播放队列 | 把 TTS 失败等同于 Agent 无响应 |
| Web 构建后无法旧式部署 | 当前 build 不带 Test；部署脚本和 Nginx 仍引用 Test | 默认 build 后直接发布或跳过产物检查 |

## 最小复现

1. 在隔离状态与 scratch 目录使用短文本重现，不先复制完整私人历史。
2. 确认请求到达的入口：桌面 Gateway、Hosted Node，还是 Python 旧聊天 API。
3. 找到最早失败阶段，而不是只看最终 UI 提示。区分启动、请求传输、模型协议、schema、权限、工具、输出门控与 checkpoint。
4. 仅运行受影响模块的受控测试。需要真实模型或系统操作时，明确范围和可能副作用。
5. 修复后比较同一输入、同一配置和同一验收条件，保留失败和成功证据。

## 当前已知限制，不作为“已修好”宣传

- 统一模式未被 Runner 的 provider 压缩触发条件列入；见 [记忆](memory.md)。
- usage 汇总可能对缺字段补 0；必须回看原始 provider 数据，见 [评估](evaluation.md)。
- secret Base64 不是加密；清空长期记忆不等于清空所有对话、工件和备份。
- 默认空 token 的 Hosted Node 不适合直接暴露公网。
- 动作 approved 不代表素材许可已完成核验。
- 包内受控探针通过不代表全部 UI／语音／外部工具端到端通过。

这些说明源自当前代码审查；本次文档修改没有顺便改变上述行为。历史测试失败应在代码修复任务中单独复现，不通过文档措辞或删除测试隐藏。

## 需要提供的诊断包

最小输入、预期／实际结果、代码身份、失败阶段、脱敏异常、相关日志时间范围、工具结果与产物引用、原始 usage 字段是否存在。不要自动附带凭据、全屏敏感截图、完整邮箱、个人记忆库或官方评测答案。

参考：[配置与隔离](configuration.md)、[Session](agent-session.md)、[包内验证](production-runtime.md)。
