# package.json 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Node 项目清单：声明脚本、依赖、版本和构建入口。
- 文件类型：`structured-data`
- 原始行数：216
- SHA-256：`b57cc0ffc375ba3b8c0ce3201fb945020302624a566d777076ccef309edf2299`
- 可运行副本：[打开源文件](../../source/package.json)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 2 | <code>  "name": "ailis",</code> | 结构化数据字段 `name`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 3 | <code>  "version": "1.2.0",</code> | 结构化数据字段 `version`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 4 | <code>  "description": "AILIS desktop embodied-agent companion with VRM avatar, realtime voice, memory, and native AILIS agent runtime.",</code> | 结构化数据字段 `description`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 5 | <code>  "type": "module",</code> | 结构化数据字段 `type`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 6 | <code>  "main": "electron/main.cjs",</code> | 结构化数据字段 `main`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 7 | <code>  "scripts": {</code> | 结构化数据字段 `scripts`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 8 | <code>    "dev": "vite --configLoader native --host 0.0.0.0 --port 5173",</code> | 结构化数据字段 `dev`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 9 | <code>    "build": "vite build --configLoader native --base ./ &amp;&amp; node scripts/copy-static-assets.mjs",</code> | 结构化数据字段 `build`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 10 | <code>    "llm:vllm:serve": "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-vllm-local.ps1",</code> | 结构化数据字段 `llm:vllm:serve`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 11 | <code>    "llm:vllm:serve:hf": "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-vllm-local.ps1 -Source hf -Model Qwen/Qwen2.5-7B-Instruct",</code> | 结构化数据字段 `llm:vllm:serve:hf`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 12 | <code>    "llm:vllm:serve:modelscope": "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-vllm-local.ps1 -Source modelscope -Model Qwen/Qwen2.5-7B-Instruct",</code> | 结构化数据字段 `llm:vllm:serve:modelscope`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 13 | <code>    "llm:vllm:oneclick": "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/bootstrap-vllm-local.ps1 -Source hf -Model Qwen/Qwen2.5-7B-Instruct -Start -Detached -WaitReady",</code> | 结构化数据字段 `llm:vllm:oneclick`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 14 | <code>    "llm:vllm:oneclick:hf": "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/bootstrap-vllm-local.ps1 -Source hf -Model Qwen/Qwen2.5-7B-Instruct -Start -Detached -WaitReady",</code> | 结构化数据字段 `llm:vllm:oneclick:hf`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 15 | <code>    "llm:vllm:oneclick:modelscope": "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/bootstrap-vllm-local.ps1 -Source modelscope -Model Qwen/Qwen2.5-7B-Instruct -Start -Detached -WaitReady",</code> | 结构化数据字段 `llm:vllm:oneclick:modelscope`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 16 | <code>    "llm:vllm:doctor": "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/bootstrap-vllm-local.ps1 -DryRun",</code> | 结构化数据字段 `llm:vllm:doctor`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 17 | <code>    "ailis:web-runtime:prepare": "node scripts/prepare-ailis-web-runtime.mjs",</code> | 结构化数据字段 `ailis:web-runtime:prepare`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 18 | <code>    "ailis:asr-runtime:prepare": "node scripts/prepare-ailis-asr-runtime.mjs",</code> | 结构化数据字段 `ailis:asr-runtime:prepare`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 19 | <code>    "ailis:voice-runtime:prepare": "node scripts/prepare-ailis-voice-runtime.mjs",</code> | 结构化数据字段 `ailis:voice-runtime:prepare`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 20 | <code>    "ailis:runtime-packs:manifest": "node scripts/build-ailis-runtime-packs.mjs --manifest-only",</code> | 结构化数据字段 `ailis:runtime-packs:manifest`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 21 | <code>    "ailis:runtime-packs:build": "node scripts/build-ailis-runtime-packs.mjs",</code> | 结构化数据字段 `ailis:runtime-packs:build`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 22 | <code>    "ailis:runtime-packs:build:python": "node scripts/build-ailis-runtime-packs.mjs --components python-runtime",</code> | 结构化数据字段 `ailis:runtime-packs:build:python`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 23 | <code>    "ailis:runtime-packs:build:voice": "node scripts/build-ailis-runtime-packs.mjs --components python-runtime,cosyvoice3-runtime",</code> | 结构化数据字段 `ailis:runtime-packs:build:voice`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 24 | <code>    "ailis:runtime-packs:build:asr": "node scripts/build-ailis-runtime-packs.mjs --components python-runtime,asr-runtime",</code> | 结构化数据字段 `ailis:runtime-packs:build:asr`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 25 | <code>    "ailis:runtime-packs:build:web": "node scripts/build-ailis-runtime-packs.mjs --components web-runtime",</code> | 结构化数据字段 `ailis:runtime-packs:build:web`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 26 | <code>    "release:plan": "node scripts/build-ailis-release.mjs --profile core --dry-run",</code> | 结构化数据字段 `release:plan`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 27 | <code>    "release:core": "node scripts/build-ailis-release.mjs --profile core",</code> | 结构化数据字段 `release:core`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 28 | <code>    "release:runtime-packs": "node scripts/build-ailis-release.mjs --profile runtime-packs",</code> | 结构化数据字段 `release:runtime-packs`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 29 | <code>    "release:with-packs": "node scripts/build-ailis-release.mjs --profile with-packs",</code> | 结构化数据字段 `release:with-packs`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 30 | <code>    "release:voice-debug": "node scripts/build-ailis-release.mjs --profile voice-debug",</code> | 结构化数据字段 `release:voice-debug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 31 | <code>    "release:all": "node scripts/build-ailis-release.mjs --profile all",</code> | 结构化数据字段 `release:all`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 32 | <code>    "openclaw:prepare-runtime": "node scripts/prepare-openclaw-runtime.mjs",</code> | 结构化数据字段 `openclaw:prepare-runtime`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 33 | <code>    "openclaw:validate-tools": "node scripts/validate-openclaw-tool-surface.mjs",</code> | 结构化数据字段 `openclaw:validate-tools`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 34 | <code>    "openclaw:smoke-tools": "node scripts/smoke-openclaw-tools.mjs",</code> | 结构化数据字段 `openclaw:smoke-tools`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 35 | <code>    "openclaw:validate": "pnpm openclaw:validate-tools &amp;&amp; pnpm test:openclaw-tools &amp;&amp; pnpm openclaw:smoke-tools",</code> | 结构化数据字段 `openclaw:validate`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 36 | <code>    "ailis:smoke-gateway": "node scripts/smoke-ailis-gateway.mjs",</code> | 结构化数据字段 `ailis:smoke-gateway`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 37 | <code>    "ailis:smoke-agent": "node scripts/smoke-ailis-agent.mjs",</code> | 结构化数据字段 `ailis:smoke-agent`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 38 | <code>    "ailis:hosted-runtime": "node scripts/start-ailis-hosted-runtime.cjs",</code> | 结构化数据字段 `ailis:hosted-runtime`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 39 | <code>    "ailis:smoke-email": "node scripts/smoke-ailis-email.mjs",</code> | 结构化数据字段 `ailis:smoke-email`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 40 | <code>    "ailis:smoke-file-manager": "node scripts/smoke-ailis-file-manager.mjs",</code> | 结构化数据字段 `ailis:smoke-file-manager`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 41 | <code>    "ailis:smoke-computer": "node scripts/smoke-ailis-computer.mjs",</code> | 结构化数据字段 `ailis:smoke-computer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 42 | <code>    "ailis:smoke-code": "node scripts/smoke-ailis-code.mjs",</code> | 结构化数据字段 `ailis:smoke-code`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 43 | <code>    "ailis:benchmark-execution": "node scripts/benchmark-ailis-execution.mjs",</code> | 结构化数据字段 `ailis:benchmark-execution`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 44 | <code>    "ailis:validate-harness": "node scripts/validate-ailis-harness.mjs",</code> | 结构化数据字段 `ailis:validate-harness`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 45 | <code>    "ailis:tool-doctor": "node scripts/run-ailis-tool-doctor.mjs --mode smoke --run-eval",</code> | 结构化数据字段 `ailis:tool-doctor`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 46 | <code>    "ailis:tool-doctor:plan": "node scripts/run-ailis-tool-doctor.mjs --mode smoke",</code> | 结构化数据字段 `ailis:tool-doctor:plan`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 47 | <code>    "ailis:setup-standard-tool-packs": "node scripts/setup-ailis-standard-tool-packs.mjs --write",</code> | 结构化数据字段 `ailis:setup-standard-tool-packs`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 48 | <code>    "ailis:setup-standard-tool-packs:verify": "node scripts/setup-ailis-standard-tool-packs.mjs --write --enable-auth-adapters --enable-local-adapters --verify-adapters",</code> | 结构化数据字段 `ailis:setup-standard-tool-packs:verify`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 49 | <code>    "ailis:self-debug-eval": "node scripts/run-ailis-self-debug-eval.mjs",</code> | 结构化数据字段 `ailis:self-debug-eval`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 50 | <code>    "ailis:validate-tools-deep": "node scripts/validate-ailis-tool-layer.mjs",</code> | 结构化数据字段 `ailis:validate-tools-deep`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 51 | <code>    "ailis:verify-runtime-alignment": "node scripts/verify-ailis-runtime-alignment.mjs",</code> | 结构化数据字段 `ailis:verify-runtime-alignment`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 52 | <code>    "ailis:mcp-soak": "node scripts/soak-ailis-mcp.mjs",</code> | 结构化数据字段 `ailis:mcp-soak`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 53 | <code>    "bench:swebench-lite:prepare": "node scripts/prepare-swebench-lite-sample.mjs",</code> | 结构化数据字段 `bench:swebench-lite:prepare`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 54 | <code>    "bench:swebench-lite:prepare-wheelhouse": "node scripts/prepare-swebench-wheelhouse.mjs",</code> | 结构化数据字段 `bench:swebench-lite:prepare-wheelhouse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 55 | <code>    "bench:swebench-lite:smoke": "node scripts/run-swebench-lite-harness-smoke.mjs",</code> | 结构化数据字段 `bench:swebench-lite:smoke`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 56 | <code>    "bench:swebench-lite:execute": "node scripts/run-swebench-lite-execution.mjs",</code> | 结构化数据字段 `bench:swebench-lite:execute`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 57 | <code>    "bench:swebench-lite:selftest": "node scripts/run-swebench-execution-selftest.mjs",</code> | 结构化数据字段 `bench:swebench-lite:selftest`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 58 | <code>    "bench:swebench:prepare": "node scripts/prepare-swebench-lite-sample.mjs --dataset-name princeton-nlp/SWE-bench",</code> | 结构化数据字段 `bench:swebench:prepare`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 59 | <code>    "bench:swebench:execute": "node scripts/run-swebench-lite-execution.mjs --dataset-name princeton-nlp/SWE-bench",</code> | 结构化数据字段 `bench:swebench:execute`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 60 | <code>    "bench:osworld:readiness": "node scripts/run-osworld-pc-readiness.mjs",</code> | 结构化数据字段 `bench:osworld:readiness`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 61 | <code>    "bench:core:prepare": "node scripts/prepare-core-benchmarks.mjs",</code> | 结构化数据字段 `bench:core:prepare`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 62 | <code>    "bench:core:inventory": "node scripts/prepare-core-benchmarks.mjs --inventory-only --skip-gaia-download",</code> | 结构化数据字段 `bench:core:inventory`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 63 | <code>    "bench:core:smoke:prepare": "node scripts/prepare-low-cost-benchmark-subset.mjs",</code> | 结构化数据字段 `bench:core:smoke:prepare`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 64 | <code>    "bench:gaia:official:l1": "node scripts/run-gaia-official.mjs --split validation --levels 1 --max-agent-steps 20 --request-timeout-ms 300000 --llm-timeout-ms 120000 --task-retries 1",</code> | 结构化数据字段 `bench:gaia:official:l1`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 65 | <code>    "bench:gaia:official:l2": "node scripts/run-gaia-official.mjs --split validation --levels 2 --max-agent-steps 25 --request-timeout-ms 360000 --llm-timeout-ms 120000 --task-retries 1",</code> | 结构化数据字段 `bench:gaia:official:l2`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 66 | <code>    "bench:gaia:official:l1-l2": "node scripts/run-gaia-official.mjs --split validation --levels 1,2 --max-agent-steps 25 --request-timeout-ms 360000 --llm-timeout-ms 120000 --task-retries 1",</code> | 结构化数据字段 `bench:gaia:official:l1-l2`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 67 | <code>    "bench:gaia:official:download:l1": "node scripts/run-gaia-official.mjs --split validation --levels 1 --download-only",</code> | 结构化数据字段 `bench:gaia:official:download:l1`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 68 | <code>    "bench:gaia:official:download:l2": "node scripts/run-gaia-official.mjs --split validation --levels 2 --download-only",</code> | 结构化数据字段 `bench:gaia:official:download:l2`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 69 | <code>    "bench:gaia:desktop-real:l1": "node scripts/run-ailis-desktop-real-gaia-eval.mjs",</code> | 结构化数据字段 `bench:gaia:desktop-real:l1`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 70 | <code>    "bench:gaia:desktop-real:smoke": "node scripts/run-ailis-desktop-real-gaia-eval.mjs --limit 3",</code> | 结构化数据字段 `bench:gaia:desktop-real:smoke`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 71 | <code>    "bench:gaia:compare": "node scripts/compare-ailis-gaia-runs.mjs",</code> | 结构化数据字段 `bench:gaia:compare`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 72 | <code>    "bench:osworld:quickstart:wsl": "node scripts/run-wsl-repo-script.mjs scripts/run-osworld-wsl-quickstart.sh",</code> | 结构化数据字段 `bench:osworld:quickstart:wsl`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 73 | <code>    "bench:osworld:ailis:test-small:wsl": "node scripts/run-wsl-repo-script.mjs scripts/run-osworld-ailis-test-small-wsl.sh",</code> | 结构化数据字段 `bench:osworld:ailis:test-small:wsl`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 74 | <code>    "eval:ailis-humanlike": "node scripts/run-ailis-humanlike-eval.mjs",</code> | 结构化数据字段 `eval:ailis-humanlike`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 75 | <code>    "eval:ailis-humanlike:validate": "node scripts/run-ailis-humanlike-eval.mjs --validate-only",</code> | 结构化数据字段 `eval:ailis-humanlike:validate`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 76 | <code>    "eval:ailis-humanlike:generate": "node scripts/generate-ailis-humanlike-scenarios.mjs",</code> | 结构化数据字段 `eval:ailis-humanlike:generate`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 77 | <code>    "eval:ailis-humanlike:report": "node scripts/analyze-ailis-humanlike-scenarios.mjs",</code> | 结构化数据字段 `eval:ailis-humanlike:report`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 78 | <code>    "eval:ailis-humanlike:real": "node scripts/run-ailis-humanlike-real-eval.mjs",</code> | 结构化数据字段 `eval:ailis-humanlike:real`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 79 | <code>    "eval:ailis-humanlike:long-term:validate": "node scripts/run-ailis-humanlike-eval.mjs --scenarios evals/ailis-humanlike/long-term-companionship.scenarios.jsonl --validate-only",</code> | 结构化数据字段 `eval:ailis-humanlike:long-term:validate`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 80 | <code>    "eval:ailis-humanlike:long-term:real": "node scripts/run-ailis-humanlike-real-eval.mjs --scenarios evals/ailis-humanlike/long-term-companionship.scenarios.jsonl --output-dir eval-results/ailis-humanlike-long-term-real",</code> | 结构化数据字段 `eval:ailis-humanlike:long-term:real`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 81 | <code>    "eval:ailis-humanlike:longitudinal:generate": "node scripts/generate-ailis-longitudinal-companionship-scenarios.mjs",</code> | 结构化数据字段 `eval:ailis-humanlike:longitudinal:generate`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 82 | <code>    "eval:ailis-humanlike:longitudinal:validate": "node scripts/run-ailis-humanlike-eval.mjs --scenarios evals/ailis-humanlike/longitudinal-companionship-30d.scenarios.jsonl --validate-only",</code> | 结构化数据字段 `eval:ailis-humanlike:longitudinal:validate`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 83 | <code>    "eval:ailis-humanlike:longitudinal:real": "node scripts/run-ailis-humanlike-real-eval.mjs --scenarios evals/ailis-humanlike/longitudinal-companionship-30d.scenarios.jsonl --output-dir eval-results/ailis-humanlike-longitudinal-30d-real --concurrency 1 --progress-every 1",</code> | 结构化数据字段 `eval:ailis-humanlike:longitudinal:real`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 84 | <code>    "eval:ailis-humanlike:longitudinal-agent": "node scripts/run-ailis-longitudinal-agent-eval.mjs",</code> | 结构化数据字段 `eval:ailis-humanlike:longitudinal-agent`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 85 | <code>    "eval:ailis-humanlike:longitudinal-agent:validate": "node scripts/run-ailis-longitudinal-agent-eval.mjs --validate-only",</code> | 结构化数据字段 `eval:ailis-humanlike:longitudinal-agent:validate`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 86 | <code>    "eval:ailis-humanlike:longitudinal-agent:smoke": "node scripts/run-ailis-longitudinal-agent-eval.mjs --limit 12 --progress-every 1",</code> | 结构化数据字段 `eval:ailis-humanlike:longitudinal-agent:smoke`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 87 | <code>    "eval:artifact-tools:prepare": "node scripts/prepare-artifact-tools-fixtures.mjs",</code> | 结构化数据字段 `eval:artifact-tools:prepare`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 88 | <code>    "eval:artifact-tools:plan": "node scripts/run-artifact-tools-eval.mjs --plan-only",</code> | 结构化数据字段 `eval:artifact-tools:plan`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 89 | <code>    "eval:artifact-tools:run": "node scripts/run-artifact-tools-eval.mjs",</code> | 结构化数据字段 `eval:artifact-tools:run`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 90 | <code>    "ailis:validate-gateway": "pnpm ailis:verify-runtime-alignment &amp;&amp; pnpm ailis:validate-harness &amp;&amp; pnpm test:ailis-runtime &amp;&amp; pnpm test:ailis-tool-contracts &amp;&amp; pnpm test:ailis-contract-compiler &amp;&amp; pnpm test:ailis-tool-doctor &amp;&amp; pnpm test:ailis-capability-manager &amp;&amp; pnpm test:ailis-tool-acquisition &amp;&amp; pnpm test:ailis-self-debugger &amp;&amp; pnpm test:ailis-platform-adapter &amp;&amp; pnpm test:ailis-desktop-platform-adapter &amp;&amp; pnpm test:ailis-skills &amp;&amp; pnpm test:ailis-memory &amp;&amp; pnpm test:ailis-gateway &amp;&amp; pnpm test:ailis-agent &amp;&amp; pnpm test:ailis-agent-execution-flow &amp;&amp; pnpm test:ailis-llm-planner &amp;&amp; pnpm test:ailis-email &amp;&amp; pnpm test:ailis-file-ma … [本行共 935 字符，完整内容见 source 副本]</code> | 结构化数据字段 `ailis:validate-gateway`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 91 | <code>    "preview": "vite preview --configLoader native --host 0.0.0.0 --port 4173",</code> | 结构化数据字段 `preview`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 92 | <code>    "desktop:dev": "concurrently -k -s first -n vite,electron -c cyan,magenta \"pnpm dev\" \"wait-on http://127.0.0.1:5173 &amp;&amp; cross-env AILIS_DESKTOP_DEV_URL=http://127.0.0.1:5173 electron .\"",</code> | 结构化数据字段 `desktop:dev`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 93 | <code>    "desktop:start": "pnpm build &amp;&amp; electron .",</code> | 结构化数据字段 `desktop:start`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 94 | <code>    "desktop:package": "pnpm desktop:package:win",</code> | 结构化数据字段 `desktop:package`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 95 | <code>    "desktop:package:win": "pnpm desktop:package:win:lite",</code> | 结构化数据字段 `desktop:package:win`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 96 | <code>    "desktop:package:win:lite": "pnpm build &amp;&amp; pnpm exec electron-builder --config electron-builder.yml --win nsis portable",</code> | 结构化数据字段 `desktop:package:win:lite`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 97 | <code>    "desktop:package:win:voice": "pnpm desktop:package:win:offline-voice",</code> | 结构化数据字段 `desktop:package:win:voice`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 98 | <code>    "desktop:package:win:offline-voice": "pnpm ailis:voice-runtime:prepare &amp;&amp; pnpm build &amp;&amp; pnpm exec electron-builder --config electron-builder.voice.yml --win --dir",</code> | 结构化数据字段 `desktop:package:win:offline-voice`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 99 | <code>    "desktop:package:linux": "pnpm build &amp;&amp; pnpm exec electron-builder --config electron-builder.yml --linux AppImage deb tar.gz",</code> | 结构化数据字段 `desktop:package:linux`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 100 | <code>    "desktop:package:all": "pnpm build &amp;&amp; pnpm exec electron-builder --config electron-builder.yml --win nsis portable --linux AppImage deb tar.gz",</code> | 结构化数据字段 `desktop:package:all`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 101 | <code>    "android:doctor": "node scripts/check-android-readiness.mjs",</code> | 结构化数据字段 `android:doctor`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 102 | <code>    "test:openclaw-tools": "node --test tests/openclaw-tool-surface.test.mjs",</code> | 结构化数据字段 `test:openclaw-tools`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 103 | <code>    "test:desktop-llm": "node --test tests/desktop-llm-provider.test.mjs",</code> | 结构化数据字段 `test:desktop-llm`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 104 | <code>    "test:ailis-persona-renderer": "node --test tests/ailis-persona-renderer.test.mjs",</code> | 结构化数据字段 `test:ailis-persona-renderer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 105 | <code>    "test:ailis-character-runtime": "node --test tests/ailis-character-runtime.test.mjs",</code> | 结构化数据字段 `test:ailis-character-runtime`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 106 | <code>    "motion:intake:scan": "node scripts/scan-motion-intake.mjs",</code> | 结构化数据字段 `motion:intake:scan`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 107 | <code>    "motion:intake:verify": "node scripts/scan-motion-intake.mjs --verify",</code> | 结构化数据字段 `motion:intake:verify`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 108 | <code>    "test:ailis-humanlike-eval": "node --test tests/ailis-humanlike-eval.test.mjs",</code> | 结构化数据字段 `test:ailis-humanlike-eval`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 109 | <code>    "test:ailis-gateway": "node --test tests/ailis-gateway.test.mjs",</code> | 结构化数据字段 `test:ailis-gateway`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 110 | <code>    "test:ailis-hosted-runtime": "node --test tests/ailis-hosted-runtime.test.mjs",</code> | 结构化数据字段 `test:ailis-hosted-runtime`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 111 | <code>    "test:ailis-runtime": "node --test tests/ailis-runtime.test.mjs",</code> | 结构化数据字段 `test:ailis-runtime`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 112 | <code>    "test:ailis-agent-execution-flow": "node --test tests/ailis-agent-execution-flow.test.mjs",</code> | 结构化数据字段 `test:ailis-agent-execution-flow`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 113 | <code>    "test:ailis-tool-contracts": "node --test tests/ailis-tool-contracts.test.mjs",</code> | 结构化数据字段 `test:ailis-tool-contracts`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 114 | <code>    "test:ailis-artifact-tools": "node --test tests/ailis-artifact-tools-runtime.test.mjs tests/ailis-artifact-tools-eval.test.mjs",</code> | 结构化数据字段 `test:ailis-artifact-tools`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 115 | <code>    "test:ailis-contract-compiler": "node --test tests/ailis-contract-compiler.test.mjs",</code> | 结构化数据字段 `test:ailis-contract-compiler`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 116 | <code>    "test:ailis-tool-doctor": "node --test tests/ailis-tool-doctor.test.mjs",</code> | 结构化数据字段 `test:ailis-tool-doctor`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 117 | <code>    "test:ailis-capability-manager": "node --test tests/ailis-capability-manager.test.mjs",</code> | 结构化数据字段 `test:ailis-capability-manager`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 118 | <code>    "test:ailis-tool-acquisition": "node --test tests/ailis-tool-acquisition-gateway.test.mjs",</code> | 结构化数据字段 `test:ailis-tool-acquisition`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 119 | <code>    "test:ailis-standard-tool-packs": "node --test tests/ailis-standard-tool-packs.test.mjs",</code> | 结构化数据字段 `test:ailis-standard-tool-packs`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 120 | <code>    "test:ailis-self-debugger": "node --test tests/ailis-self-debugger.test.mjs",</code> | 结构化数据字段 `test:ailis-self-debugger`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 121 | <code>    "test:ailis-platform-adapter": "node --test tests/ailis-platform-adapter.test.mjs",</code> | 结构化数据字段 `test:ailis-platform-adapter`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 122 | <code>    "test:ailis-desktop-platform-adapter": "node --test tests/ailis-desktop-platform-adapter.test.mjs",</code> | 结构化数据字段 `test:ailis-desktop-platform-adapter`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 123 | <code>    "test:swebench-setup-recipes": "node --test tests/swebench-setup-recipes.test.mjs",</code> | 结构化数据字段 `test:swebench-setup-recipes`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 124 | <code>    "test:ailis-skills": "node --test tests/ailis-skills.test.mjs",</code> | 结构化数据字段 `test:ailis-skills`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 125 | <code>    "test:ailis-memory": "node --test tests/ailis-memory-store.test.mjs",</code> | 结构化数据字段 `test:ailis-memory`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 126 | <code>    "test:ailis-agent": "node --test tests/ailis-agent-runner.test.mjs",</code> | 结构化数据字段 `test:ailis-agent`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 127 | <code>    "test:ailis-llm-planner": "node --test tests/ailis-llm-planner.test.mjs",</code> | 结构化数据字段 `test:ailis-llm-planner`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 128 | <code>    "test:ailis-email": "node --test tests/ailis-email-tool.test.mjs",</code> | 结构化数据字段 `test:ailis-email`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 129 | <code>    "test:ailis-file-manager": "node --test tests/ailis-file-manager-tool.test.mjs",</code> | 结构化数据字段 `test:ailis-file-manager`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 130 | <code>    "test:ailis-computer": "node --test tests/ailis-computer-tool.test.mjs",</code> | 结构化数据字段 `test:ailis-computer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 131 | <code>    "test:ailis-computer-advanced": "node --test tests/ailis-computer-advanced-tool.test.mjs",</code> | 结构化数据字段 `test:ailis-computer-advanced`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 132 | <code>    "test:ailis-code": "node --test tests/ailis-code-tool.test.mjs",</code> | 结构化数据字段 `test:ailis-code`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 133 | <code>    "ailis:human-loop:build": "node scripts/build-ailis-human-in-loop.mjs",</code> | 结构化数据字段 `ailis:human-loop:build`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 134 | <code>    "ailis:human-loop:verify": "node scripts/verify-ailis-human-in-loop.mjs"</code> | 结构化数据字段 `ailis:human-loop:verify`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 135 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 136 | <code>  "keywords": [],</code> | 结构化数据字段 `keywords`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 137 | <code>  "author": "",</code> | 结构化数据字段 `author`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 138 | <code>  "license": "MIT",</code> | 结构化数据字段 `license`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 139 | <code>  "packageManager": "pnpm@10.33.0",</code> | 结构化数据字段 `packageManager`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 140 | <code>  "dependencies": {</code> | 结构化数据字段 `dependencies`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 141 | <code>    "@babel/code-frame": "7.29.0",</code> | 结构化数据字段 `@babel/code-frame`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 142 | <code>    "@babel/generator": "^7.29.1",</code> | 结构化数据字段 `@babel/generator`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 143 | <code>    "@babel/helper-globals": "7.28.0",</code> | 结构化数据字段 `@babel/helper-globals`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 144 | <code>    "@babel/helper-string-parser": "7.27.1",</code> | 结构化数据字段 `@babel/helper-string-parser`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 145 | <code>    "@babel/helper-validator-identifier": "7.28.5",</code> | 结构化数据字段 `@babel/helper-validator-identifier`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 146 | <code>    "@babel/parser": "^7.29.3",</code> | 结构化数据字段 `@babel/parser`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 147 | <code>    "@babel/template": "7.28.6",</code> | 结构化数据字段 `@babel/template`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 148 | <code>    "@babel/traverse": "^7.29.0",</code> | 结构化数据字段 `@babel/traverse`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 149 | <code>    "@babel/types": "^7.29.0",</code> | 结构化数据字段 `@babel/types`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 150 | <code>    "@jridgewell/gen-mapping": "0.3.13",</code> | 结构化数据字段 `@jridgewell/gen-mapping`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 151 | <code>    "@jridgewell/resolve-uri": "3.1.2",</code> | 结构化数据字段 `@jridgewell/resolve-uri`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 152 | <code>    "@jridgewell/sourcemap-codec": "1.5.5",</code> | 结构化数据字段 `@jridgewell/sourcemap-codec`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 153 | <code>    "@jridgewell/trace-mapping": "0.3.31",</code> | 结构化数据字段 `@jridgewell/trace-mapping`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 154 | <code>    "@pixiv/three-vrm": "^3.5.1",</code> | 结构化数据字段 `@pixiv/three-vrm`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 155 | <code>    "@pixiv/three-vrm-animation": "^3.5.1",</code> | 结构化数据字段 `@pixiv/three-vrm-animation`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 156 | <code>    "@selderee/plugin-htmlparser2": "0.11.0",</code> | 结构化数据字段 `@selderee/plugin-htmlparser2`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 157 | <code>    "@xenova/transformers": "^2.17.2",</code> | 结构化数据字段 `@xenova/transformers`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 158 | <code>    "bl": "4.1.0",</code> | 结构化数据字段 `bl`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 159 | <code>    "buffer": "5.7.1",</code> | 结构化数据字段 `buffer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 160 | <code>    "chess.js": "1.4.0",</code> | 结构化数据字段 `chess.js`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 161 | <code>    "chownr": "1.1.4",</code> | 结构化数据字段 `chownr`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 162 | <code>    "core-util-is": "1.0.3",</code> | 结构化数据字段 `core-util-is`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 163 | <code>    "debug": "4.4.3",</code> | 结构化数据字段 `debug`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 164 | <code>    "detect-libc": "2.1.2",</code> | 结构化数据字段 `detect-libc`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 165 | <code>    "end-of-stream": "1.4.5",</code> | 结构化数据字段 `end-of-stream`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 166 | <code>    "exceljs": "^4.4.0",</code> | 结构化数据字段 `exceljs`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 167 | <code>    "expand-template": "2.0.3",</code> | 结构化数据字段 `expand-template`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 168 | <code>    "fs-constants": "1.0.0",</code> | 结构化数据字段 `fs-constants`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 169 | <code>    "github-from-package": "0.0.0",</code> | 结构化数据字段 `github-from-package`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 170 | <code>    "html-to-text": "9.0.5",</code> | 结构化数据字段 `html-to-text`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 171 | <code>    "imapflow": "^1.3.3",</code> | 结构化数据字段 `imapflow`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 172 | <code>    "inherits": "2.0.4",</code> | 结构化数据字段 `inherits`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 173 | <code>    "isarray": "1.0.0",</code> | 结构化数据字段 `isarray`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 174 | <code>    "js-tokens": "4.0.0",</code> | 结构化数据字段 `js-tokens`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 175 | <code>    "jsesc": "3.1.0",</code> | 结构化数据字段 `jsesc`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 176 | <code>    "leac": "0.6.0",</code> | 结构化数据字段 `leac`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 177 | <code>    "mailparser": "^3.9.8",</code> | 结构化数据字段 `mailparser`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 178 | <code>    "minimist": "1.2.8",</code> | 结构化数据字段 `minimist`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 179 | <code>    "mkdirp-classic": "0.5.3",</code> | 结构化数据字段 `mkdirp-classic`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 180 | <code>    "ms": "2.1.3",</code> | 结构化数据字段 `ms`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 181 | <code>    "napi-build-utils": "2.0.0",</code> | 结构化数据字段 `napi-build-utils`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 182 | <code>    "node-abi": "3.92.0",</code> | 结构化数据字段 `node-abi`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 183 | <code>    "node-pty": "^1.1.0",</code> | 结构化数据字段 `node-pty`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 184 | <code>    "nodemailer": "^8.0.7",</code> | 结构化数据字段 `nodemailer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 185 | <code>    "parseley": "0.12.1",</code> | 结构化数据字段 `parseley`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 186 | <code>    "pdfjs-dist": "6.0.227",</code> | 结构化数据字段 `pdfjs-dist`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 187 | <code>    "peberminta": "0.9.0",</code> | 结构化数据字段 `peberminta`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 188 | <code>    "picocolors": "1.1.1",</code> | 结构化数据字段 `picocolors`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 189 | <code>    "pinyin-pro": "^3.28.1",</code> | 结构化数据字段 `pinyin-pro`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 190 | <code>    "process-nextick-args": "2.0.1",</code> | 结构化数据字段 `process-nextick-args`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 191 | <code>    "pump": "3.0.4",</code> | 结构化数据字段 `pump`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 192 | <code>    "rc": "1.2.8",</code> | 结构化数据字段 `rc`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 193 | <code>    "safe-buffer": "5.2.1",</code> | 结构化数据字段 `safe-buffer`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 194 | <code>    "selderee": "0.11.0",</code> | 结构化数据字段 `selderee`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 195 | <code>    "simple-concat": "1.0.1",</code> | 结构化数据字段 `simple-concat`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 196 | <code>    "simple-get": "4.0.1",</code> | 结构化数据字段 `simple-get`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 197 | <code>    "stockfish": "18.0.8",</code> | 结构化数据字段 `stockfish`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 198 | <code>    "string_decoder": "1.3.0",</code> | 结构化数据字段 `string_decoder`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 199 | <code>    "tar-fs": "2.1.4",</code> | 结构化数据字段 `tar-fs`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 200 | <code>    "tar-stream": "2.2.0",</code> | 结构化数据字段 `tar-stream`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 201 | <code>    "three": "^0.183.2",</code> | 结构化数据字段 `three`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 202 | <code>    "tunnel-agent": "0.6.0",</code> | 结构化数据字段 `tunnel-agent`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 203 | <code>    "typescript": "^6.0.3",</code> | 结构化数据字段 `typescript`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 204 | <code>    "typescript-language-server": "^5.3.0",</code> | 结构化数据字段 `typescript-language-server`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 205 | <code>    "util-deprecate": "1.0.2",</code> | 结构化数据字段 `util-deprecate`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 206 | <code>    "vite": "^8.0.3"</code> | 结构化数据字段 `vite`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 207 | <code>  },</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 208 | <code>  "devDependencies": {</code> | 结构化数据字段 `devDependencies`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 209 | <code>    "@modelcontextprotocol/server-filesystem": "2026.1.14",</code> | 结构化数据字段 `@modelcontextprotocol/server-filesystem`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 210 | <code>    "concurrently": "^9.2.1",</code> | 结构化数据字段 `concurrently`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 211 | <code>    "cross-env": "^10.1.0",</code> | 结构化数据字段 `cross-env`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 212 | <code>    "electron": "^41.2.0",</code> | 结构化数据字段 `electron`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 213 | <code>    "electron-builder": "^26.8.1",</code> | 结构化数据字段 `electron-builder`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 214 | <code>    "wait-on": "^9.0.5"</code> | 结构化数据字段 `wait-on`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 215 | <code>  }</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
| 216 | <code>}</code> | 结构化 JSON 内容：参与配置、协议、测试夹具、清单或评测数据表达。 |
