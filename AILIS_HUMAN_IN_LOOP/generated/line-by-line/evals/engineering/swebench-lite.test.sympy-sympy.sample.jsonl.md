# evals/engineering/swebench-lite.test.sympy-sympy.sample.jsonl 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：评测资产：定义场景、数据集、评分输入或评测结果结构。
- 文件类型：`structured-data`
- 原始行数：1
- SHA-256：`22c6912c65f811e12b31a3930ae09f805845b416e286597d6d9d94f1b11ff8c2`
- 可运行副本：[打开源文件](../../../../source/evals/engineering/swebench-lite.test.sympy-sympy.sample.jsonl)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：未从静态文本识别到命名符号

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{"row_idx":223,"dataset":"princeton-nlp/SWE-bench_Lite","config":"default","split":"test","repo":"sympy/sympy","instance_id":"sympy__sympy-11400","base_commit":"8dcb12a6cf500e8738d6729ab954a261758f49ca","problem_statement":"ccode(sinc(x)) doesn't work\n```\nIn [30]: ccode(sinc(x))\nOut[30]: '// Not supported in C:\\n// sinc\\nsinc(x)'\n```\n\nI don't think `math.h` has `sinc`, but it could print\n\n```\nIn [38]: ccode(Piecewise((sin(theta)/theta, Ne(theta, 0)), (1, True)))\nOut[38]: '((Ne(theta, 0)) ? (\\n   sin(theta)/theta\\n)\\n: (\\n   1\\n))'\n```\n\n","hints_text":"@asmeurer I would like to fix this issue. Should I work upon   … [本行共 4089 字符，完整内容见 source 副本]</code> | 结构化数据字段 `row_idx`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
