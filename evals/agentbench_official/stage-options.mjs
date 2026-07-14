const STAGE_LIMITS = Object.freeze({ smoke: 3, pilot: 10, dev: 0, test: 0 });

export function parseAgentBenchStageArgs(argv, availableTasks) {
    const options = { stage: 'smoke', task: '', approved: false };
    let taskCount = 0;
    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (argument === '--stage') {
            options.stage = argv[++index] || '';
        } else if (argument === '--task') {
            options.task = argv[++index] || '';
            taskCount += 1;
        } else if (argument === '--approve-large-stage') {
            options.approved = true;
        } else {
            throw new Error(`Unknown AgentBench option: ${argument}`);
        }
    }
    if (taskCount !== 1 || !options.task) {
        throw new Error('A staged AgentBench run requires exactly one --task');
    }
    if (!Object.hasOwn(STAGE_LIMITS, options.stage)) {
        throw new Error(`Unknown AgentBench stage: ${options.stage}`);
    }
    if (!availableTasks.includes(options.task)) {
        throw new Error(`Unknown AgentBench task: ${options.task}`);
    }
    if ((options.stage === 'dev' || options.stage === 'test') && !options.approved) {
        throw new Error(`${options.stage} requires --approve-large-stage`);
    }
    if (options.stage === 'dev' && !options.task.endsWith('-dev')) {
        throw new Error('The dev stage requires a -dev task');
    }
    if (options.stage === 'test' && !options.task.endsWith('-std')) {
        throw new Error('The test stage requires a -std task');
    }
    return { ...options, limit: STAGE_LIMITS[options.stage] };
}
