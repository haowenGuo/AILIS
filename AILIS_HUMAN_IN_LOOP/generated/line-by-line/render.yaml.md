# render.yaml 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`structured-data`
- 原始行数：77
- SHA-256：`e5e5c5bb140f245229793cfa248d2f0135e4a90f3dd5127f123a9f8bca11eb58`
- 可运行副本：[打开源文件](../../source/render.yaml)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>services:</code> | 配置键 `services`：为构建、部署、依赖或运行时声明参数。 |
| 2 | <code>  - type: web</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 3 | <code>    name: airi-backend</code> | 配置键 `name`：为构建、部署、依赖或运行时声明参数。 |
| 4 | <code>    runtime: python</code> | 配置键 `runtime`：为构建、部署、依赖或运行时声明参数。 |
| 5 | <code>    plan: starter</code> | 配置键 `plan`：为构建、部署、依赖或运行时声明参数。 |
| 6 | <code>    region: singapore</code> | 配置键 `region`：为构建、部署、依赖或运行时声明参数。 |
| 7 | <code>    numInstances: 1</code> | 配置键 `numInstances`：为构建、部署、依赖或运行时声明参数。 |
| 8 | <code>    autoDeployTrigger: commit</code> | 配置键 `autoDeployTrigger`：为构建、部署、依赖或运行时声明参数。 |
| 9 | <code>    buildCommand: pip install -r requirements.txt</code> | 配置键 `buildCommand`：为构建、部署、依赖或运行时声明参数。 |
| 10 | <code>    startCommand: uvicorn backend.main:app --host 0.0.0.0 --port $PORT</code> | 配置键 `startCommand`：为构建、部署、依赖或运行时声明参数。 |
| 11 | <code>    healthCheckPath: /healthz</code> | 配置键 `healthCheckPath`：为构建、部署、依赖或运行时声明参数。 |
| 12 | <code>    buildFilter:</code> | 配置键 `buildFilter`：为构建、部署、依赖或运行时声明参数。 |
| 13 | <code>      paths:</code> | 配置键 `paths`：为构建、部署、依赖或运行时声明参数。 |
| 14 | <code>        - backend/**</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 15 | <code>        - requirements.txt</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 16 | <code>        - render.yaml</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 17 | <code>    envVars:</code> | 配置键 `envVars`：为构建、部署、依赖或运行时声明参数。 |
| 18 | <code>      - key: PYTHON_VERSION</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 19 | <code>        value: 3.11.11</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 20 | <code>      - key: DEBUG</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 21 | <code>        value: "False"</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 22 | <code>      - key: CORS_ALLOW_ORIGINS</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 23 | <code>        value: http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173,https://haowenguo.github.io</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 24 | <code>      - key: DATA_DIR</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 25 | <code>        value: /opt/render/project/src/backend/data</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 26 | <code>      - key: DATABASE_URL</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 27 | <code>        value: sqlite+aiosqlite:////opt/render/project/src/backend/data/app.db</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 28 | <code>      - key: CHROMA_PERSIST_DIR</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 29 | <code>        value: /opt/render/project/src/backend/data/chroma</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 30 | <code>      - key: EDU_SESSION_COOKIE_NAME</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 31 | <code>        value: simteach_session</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 32 | <code>      - key: EDU_SESSION_TTL_DAYS</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 33 | <code>        value: "14"</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 34 | <code>      - key: EDU_TEACHER_INVITE_CODE</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 35 | <code>        generateValue: true</code> | 配置键 `generateValue`：为构建、部署、依赖或运行时声明参数。 |
| 36 | <code>      - key: EDU_SEED_ADMIN</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 37 | <code>        value: "true"</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 38 | <code>      - key: EDU_ADMIN_EMAIL</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 39 | <code>        value: admin@simclass.local</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 40 | <code>      - key: EDU_ADMIN_PASSWORD</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 41 | <code>        sync: false</code> | 配置键 `sync`：为构建、部署、依赖或运行时声明参数。 |
| 42 | <code>      - key: EDU_ADMIN_PHONE</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 43 | <code>        value: "13800000000"</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 44 | <code>      - key: EDU_ADMIN_SCHOOL_NAME</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 45 | <code>        value: 仿真人教学教室</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 46 | <code>      - key: EDU_HF_DATASET_VIEWER_URL</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 47 | <code>        value: https://datasets-server.huggingface.co</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 48 | <code>      - key: EDU_HF_QUESTION_DATASET</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 49 | <code>        value: SeaLLMs/SeaExam</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 50 | <code>      - key: EDU_HF_QUESTION_CONFIG</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 51 | <code>        value: m3exam-chinese</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 52 | <code>      - key: EDU_HF_QUESTION_SPLIT</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 53 | <code>        value: test</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 54 | <code>      - key: EDU_QUESTION_BANK_CACHE_TTL_SECONDS</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 55 | <code>        value: "900"</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 56 | <code>      - key: LLM_API_BASE</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 57 | <code>        value: https://api.deepseek.com</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 58 | <code>      - key: LLM_API_KEY</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 59 | <code>        sync: false</code> | 配置键 `sync`：为构建、部署、依赖或运行时声明参数。 |
| 60 | <code>      - key: LLM_MODEL_NAME</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 61 | <code>        value: deepseek-chat</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 62 | <code>      - key: ELEVENLABS_API_BASE</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 63 | <code>        value: https://api.elevenlabs.io</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 64 | <code>      - key: ELEVENLABS_API_KEY</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 65 | <code>        sync: false</code> | 配置键 `sync`：为构建、部署、依赖或运行时声明参数。 |
| 66 | <code>      - key: ELEVENLABS_VOICE_ID</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 67 | <code>        sync: false</code> | 配置键 `sync`：为构建、部署、依赖或运行时声明参数。 |
| 68 | <code>      - key: ELEVENLABS_MODEL_ID</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 69 | <code>        value: eleven_multilingual_v2</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 70 | <code>      - key: ELEVENLABS_OUTPUT_FORMAT</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 71 | <code>        value: mp3_44100_128</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 72 | <code>      - key: ELEVENLABS_TIMEOUT_SECONDS</code> | 配置结构行：建立层级、列表或复合配置值。 |
| 73 | <code>        value: "60"</code> | 配置键 `value`：为构建、部署、依赖或运行时声明参数。 |
| 74 | <code>    disk:</code> | 配置键 `disk`：为构建、部署、依赖或运行时声明参数。 |
| 75 | <code>      name: backend-data</code> | 配置键 `name`：为构建、部署、依赖或运行时声明参数。 |
| 76 | <code>      mountPath: /opt/render/project/src/backend/data</code> | 配置键 `mountPath`：为构建、部署、依赖或运行时声明参数。 |
| 77 | <code>      sizeGB: 5</code> | 配置键 `sizeGB`：为构建、部署、依赖或运行时声明参数。 |
