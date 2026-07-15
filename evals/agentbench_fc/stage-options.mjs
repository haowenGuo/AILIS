export const AGENTBENCH_FC_STAGE_LIMITS = Object.freeze({ smoke: 3, pilot: 10, full: 0 });

export function parseAgentBenchFcStageArgs(argv, availableTasks) {
    const options = { stage: 'smoke', task: '', approved: false, offset: 0, runId: '' };
    let taskCount = 0;
    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (argument === '--stage') options.stage = argv[++index] || '';
        else if (argument === '--task') {
            options.task = argv[++index] || '';
            taskCount += 1;
        } else if (argument === '--offset') options.offset = Math.max(0, Number(argv[++index]) || 0);
        else if (argument === '--run-id') options.runId = argv[++index] || '';
        else if (argument === '--approve-large-stage') options.approved = true;
        else throw new Error(`Unknown AgentBench FC option: ${argument}`);
    }
    if (taskCount !== 1 || !options.task) {
        throw new Error('A staged AgentBench FC run requires exactly one --task');
    }
    if (!Object.hasOwn(AGENTBENCH_FC_STAGE_LIMITS, options.stage)) {
        throw new Error(`Unknown AgentBench FC stage: ${options.stage}`);
    }
    if (!availableTasks.includes(options.task)) {
        throw new Error(`Unknown AgentBench FC task: ${options.task}`);
    }
    if (options.stage === 'full' && !options.approved) {
        throw new Error('full requires --approve-large-stage');
    }
    return { ...options, limit: AGENTBENCH_FC_STAGE_LIMITS[options.stage] };
}
