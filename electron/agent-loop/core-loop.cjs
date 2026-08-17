'use strict';

/**
 * AILIS 最小 Agent Loop（生产代码，不是教学副本）
 * =================================================
 *
 * 如果你是第一次阅读 Node.js，可以先只看这个文件。
 * 完整 AILIS 的 Persona Agent 和 TaskAgent 最终都会经过这里。
 *
 * Agent Loop 最核心的思想只有一句话：
 *
 *   执行一轮 Agent → 如果还要继续就进入下一轮 → 否则返回最终结果。
 *
 * “一轮 Agent”里面通常包含下面几个阶段：
 *
 *   1. Context：整理用户消息、历史记录、工具结果和可用工具。
 *   2. Decision：调用大模型，让模型决定下一步做什么。
 *   3. Action：如果模型决定调用工具，就执行工具。
 *   4. Observation：把工具结果放回上下文，让模型在下一轮看到。
 *   5. Terminal：模型给出 final/blocked，或者运行被暂停、取消、等待审批。
 *
 * 这些阶段的具体业务代码非常多，所以仍然放在 runner.cjs 的
 * runLlmAgentLoop() 里；这个文件只管理最核心的“轮次控制”。
 *
 * 为什么要这样拆？
 *
 * - core-loop.cjs 只负责机制（什么时候继续、什么时候结束）。
 * - runner.cjs 负责策略和业务（Prompt、工具、审批、日志、Persona）。
 * - 核心循环因此不会依赖某个具体模型、工具或 UI。
 * - 完整 AILIS 真实调用本文件，不存在“示例和产品代码不一致”的问题。
 */

/**
 * 这是“继续下一轮”的专用信号。
 *
 * Symbol 是 JavaScript 中一种保证唯一的值。即使业务结果中出现相同文字，
 * 也不可能意外等于这个 Symbol，因此它比字符串 'continue' 更安全。
 *
 * Runner 完成一次工具调用并写入 Observation 后，会返回这个值：
 *
 *   return CONTINUE_AGENT_LOOP;
 *
 * core loop 收到它以后，就把 iteration 加 1，然后重新执行下一轮。
 */
const CONTINUE_AGENT_LOOP = Symbol('AILIS_CONTINUE_AGENT_LOOP');

/**
 * 运行 AILIS 最核心的轮次循环。
 *
 * @param {object} options 配置对象。使用对象参数可以让调用处更容易阅读。
 * @param {number} [options.startIteration=0]
 *   从第几轮开始。普通新任务从 0 开始；从审批或调试断点恢复时，
 *   可以从保存的轮次继续，而不必假装重新开始。
 * @param {(iteration: number) => Promise<unknown>} options.runIteration
 *   “执行一整轮 Agent”的异步函数。它由 runner.cjs 提供。
 *   参数 iteration 是当前轮次编号。
 *
 * runIteration 只有两类合法返回：
 *
 *   A. CONTINUE_AGENT_LOOP
 *      当前轮已经产生新的 Observation，需要让模型再思考一轮。
 *
 *   B. 其他任意值
 *      当前运行已经结束。这个值通常是 final、blocked、interrupted、
 *      needs_approval 或 debug_paused 等完整结果对象。
 *
 * @returns {Promise<unknown>}
 *   最终运行结果。因为函数使用 async，所以调用方要使用 await。
 */
async function runCoreAgentLoop({
    startIteration = 0,
    runIteration
} = {}) {
    // 尽早检查调用契约。否则少传 runIteration 时，错误会在循环深处才出现，
    // 对初学者和日志排查都很不友好。
    if (typeof runIteration !== 'function') {
        throw new TypeError('runCoreAgentLoop requires a runIteration(iteration) function');
    }

    // Number(...) 把可能来自 JSON/持久化状态的 "3" 转成数字 3。
    // Number.isInteger(...) 确保它是整数；Math.max(...) 防止出现负轮次。
    const parsedStartIteration = Number(startIteration);
    let iteration = Number.isInteger(parsedStartIteration)
        ? Math.max(0, parsedStartIteration)
        : 0;

    // 这里故意使用无限循环。Agent 需要多少轮不是确定的：
    // 简单聊天可能第一轮直接 final；复杂任务可能多次调用工具。
    // 真正的步数/成本/超时限制仍由 Runner 和 Runtime 负责。
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // await 的含义是：等待这一轮异步工作完成。
        // 这一轮可能等待 LLM、文件系统、MCP、浏览器或其他外部工具。
        // 等待期间 Node.js 仍然可以处理其他事件，并不是卡死整个程序。
        const outcome = await runIteration(iteration);

        // 只有明确返回专用 Symbol 才继续。
        // 采用“默认结束”的设计，可以避免某个异常分支返回 undefined 后
        // Agent 仍然静默空转。
        if (outcome === CONTINUE_AGENT_LOOP) {
            iteration += 1;
            continue;
        }

        // final、blocked、审批暂停、用户中断等结果都从这里原样返回。
        // Core Loop 不修改结果，也不替模型决定结果含义。
        return outcome;
    }
}

/**
 * CommonJS 导出。
 *
 * AILIS 的 Electron 主进程使用 require(...) 加载 .cjs 文件，
 * 所以这里使用 module.exports，而不是浏览器侧的 export 语法。
 */
module.exports = {
    CONTINUE_AGENT_LOOP,
    runCoreAgentLoop
};
