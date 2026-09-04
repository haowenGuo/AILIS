# 统一 Agent 运行时

[文档中心](README.zh-CN.md) · [English](taskagent.md) · [架构](architecture.zh-CN.md)

文件名沿用旧链接。主对话不再走 Persona → TaskAgent → Persona。

## 生命周期

1. 确定 Session，取得独占写锁。
2. 恢复规范检查点；不存在时才迁移一份旧历史。
3. 经 [AgentRunner](../electron/agent-loop/runner.cjs)执行模型和工具循环。
4. 调用与结果成对写入同一历史，在模型决策前和最终结束时保存检查点。
5. 通过最终输出校验，返回主模型答案，不再由第二个角色重写。
6. 释放 Session 所有权。

运行中到达的文本可以进入输入队列；附件、审批信息和无法安全入队的请求等待当前写者。被接受的 steering 可以返回 `deferAssistantCommit`，但这不等于旧人物后台答复链。

## 工具

普通顶层工具是 `exec` / `exec_wait`，嵌套工具定义放在 code-mode profile 中。启用的 `task_verify` 等协议工具仍可直接暴露。因此，顶层看不到 `read` 不代表文件读取被删除。

权限、参数验证、输出引用和调用配对仍保留。工具报错、证据缺失或未完成的在途调用都不能当作任务成功。

## 检查点与兼容

[SessionContextStore](../electron/ailis-session-context-store.cjs)使用原子替换和独占锁。首次迁移优先采用旧执行检查点，其次才是 Persona 历史，不把两份历史拼起来。主链不会再把新轮次同时写回两个旧存储。

显式 TaskAgent API 仍有 Thread/Turn/Goal 语义；它们是兼容或显式作业接口，不是每次聊天自动启动的第二个角色。

## 验证边界

[统一 Agent 测试](../tests/ailis-unified-agent.test.mjs)验证恢复、steering、校验、迁移与工具执行；[托管测试](../tests/ailis-hosted-runtime.test.mjs)验证直接答复、重启记忆和连续 Session；[精简测试](../tests/ailis-code-consolidation.test.mjs)防止旧调度复活或称呼方向规则丢失。

预算与压缩组件虽已存在，统一模式的语义压缩触发仍待核验。缓存率和端到端时延必须在明确部署后用真实 trace 测量，不能由删代码行数推算。
