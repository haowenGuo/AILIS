# evals/engineering/swebench-lite.test.sample.jsonl 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：评测资产：定义场景、数据集、评分输入或评测结果结构。
- 文件类型：`structured-data`
- 原始行数：3
- SHA-256：`ce2f40b18b3eb7b006daa2765d69e6df884085997d8d0e43a34606f7d34bf922`
- 可运行副本：[打开源文件](../../../../source/evals/engineering/swebench-lite.test.sample.jsonl)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`SimpleRSTData`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>{"row_idx":0,"dataset":"princeton-nlp/SWE-bench_Lite","config":"default","split":"test","repo":"astropy/astropy","instance_id":"astropy__astropy-12907","base_commit":"d16bfe05a744909de4b27f5875fe0d4ed41ce607","problem_statement":"Modeling's `separability_matrix` does not compute separability correctly for nested CompoundModels\nConsider the following model:\r\n\r\n```python\r\nfrom astropy.modeling import models as m\r\nfrom astropy.modeling.separable import separability_matrix\r\n\r\ncm = m.Linear1D(10) &amp; m.Linear1D(5)\r\n```\r\n\r\nIt's separability matrix as you might expect is a diagonal:\r\n\r\n```python\r\n&gt;&gt;&gt; separability_mat … [本行共 4832 字符，完整内容见 source 副本]</code> | 结构化数据字段 `row_idx`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 2 | <code>{"row_idx":1,"dataset":"princeton-nlp/SWE-bench_Lite","config":"default","split":"test","repo":"astropy/astropy","instance_id":"astropy__astropy-14182","base_commit":"a5917978be39d13cd90b517e1de4e7a539ffaa48","problem_statement":"Please support header rows in RestructuredText output\n### Description\r\n\r\nIt would be great if the following would work:\r\n\r\n```Python\r\n&gt;&gt;&gt; from astropy.table import QTable\r\n&gt;&gt;&gt; import astropy.units as u\r\n&gt;&gt;&gt; import sys\r\n&gt;&gt;&gt; tbl = QTable({'wave': [350,950]*u.nm, 'response': [0.7, 1.2]*u.count})\r\n&gt;&gt;&gt; tbl.write(sys.stdout,  format=\"ascii.rst\")\r\n===== ========\r\n wave response\r\n===== == … [本行共 6748 字符，完整内容见 source 副本]</code> | 结构化数据字段 `row_idx`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
| 3 | <code>{"row_idx":2,"dataset":"princeton-nlp/SWE-bench_Lite","config":"default","split":"test","repo":"astropy/astropy","instance_id":"astropy__astropy-14365","base_commit":"7269fa3e33e8d02485a647da91a5a2a60a06af61","problem_statement":"ascii.qdp Table format assumes QDP commands are upper case\n### Description\n\nascii.qdp assumes that commands in a QDP file are upper case, for example, for errors they must be \"READ SERR 1 2\" whereas QDP itself is not case sensitive and case use \"read serr 1 2\". \r\n\r\nAs many QDP files are created by hand, the expectation that all commands be all-caps should be removed.\n\n### Expected behavior\n\nT … [本行共 6251 字符，完整内容见 source 副本]</code> | 结构化数据字段 `row_idx`：为配置、协议、测试或数据集提供一个可机器读取的值。 |
