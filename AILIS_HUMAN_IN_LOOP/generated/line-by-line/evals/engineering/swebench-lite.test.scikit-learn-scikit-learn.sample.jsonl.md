# evals/engineering/swebench-lite.test.scikit-learn-scikit-learn.sample.jsonl 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：评测资产：定义场景、数据集、评分输入或评测结果结构。
- 文件类型：`structured-data`
- 原始行数：1
- SHA-256：`337b91108ba5abc2ae53fe5bb18166ee283e2fd5c2aefb1492b7417dd503b808`
- 可运行副本：[打开源文件](../../../../source/evals/engineering/swebench-lite.test.scikit-learn-scikit-learn.sample.jsonl)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`RidgeCV`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{"row_idx":184,"dataset":"princeton-nlp/SWE-bench_Lite","config":"default","split":"test","repo":"scikit-learn/scikit-learn","instance_id":"scikit-learn__scikit-learn-10297","base_commit":"b90661d6a46aa3619d3eec94d5281f5888add501","problem_statement":"linear_model.RidgeClassifierCV's Parameter store_cv_values issue\n#### Description\r\nParameter store_cv_values error on sklearn.linear_model.RidgeClassifierCV\r\n\r\n#### Steps/Code to Reproduce\r\nimport numpy as np\r\nfrom sklearn import linear_model as lm\r\n\r\n#test database\r\nn = 100\r\nx = np.random.randn(n, 30)\r\ny = np.random.normal(size = n)\r\n\r\nrr = lm.RidgeClassifierC … [本行共 10707 字符，完整内容见 source 副本]</code> | 结构化数据字段 `row_idx`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
