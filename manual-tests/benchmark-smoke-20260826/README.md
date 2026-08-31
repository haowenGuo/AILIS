# AILIS 手动任务测试（2026-08-26）

使用当前已经启动的 AILIS 桌面版。GAIA 与 Terminal-Bench 每题建议新建独立会话；LoCoMo 三题必须使用同一个会话。

## GAIA（3 题）

### GAIA-1：联网检索

```text
How many studio albums were published by Mercedes Sosa between 2000 and 2009 (included)? You can use the latest 2022 version of English Wikipedia.
```

### GAIA-2：运算表推理

```text
Given this table defining * on the set S = {a, b, c, d, e}

|*|a|b|c|d|e|
|---|---|---|---|---|---|
|a|a|b|c|b|d|
|b|b|c|a|e|c|
|c|c|a|b|b|a|
|d|b|e|b|e|d|
|e|d|b|a|d|c|

provide the subset of S involved in any possible counter-examples that prove * is not commutative. Provide your answer as a comma separated list of the elements in the set in alphabetical order.
```

### GAIA-3：植物学分类

```text
I'm making a grocery list for my mom, but she's a professor of botany and she's a real stickler when it comes to categorizing things. I need to add different foods to different categories on the grocery list, but if I make a mistake, she won't buy anything inserted in the wrong category. Here's the list I have so far:

milk, eggs, flour, whole bean coffee, Oreos, sweet potatoes, fresh basil, plums, green beans, rice, corn, bell pepper, whole allspice, acorns, broccoli, celery, zucchini, lettuce, peanuts

I need to make headings for the fruits and vegetables. Could you please create a list of just the vegetables from my list? If you could do that, then I can figure out how to categorize the rest of the list into the appropriate categories. But remember that my mom is a real stickler, so make sure that no botanical fruits end up on the vegetable list, or she won't get them when she's at the store. Please alphabetize the list of vegetables, and place each item in a comma separated list.
```

## Terminal-Bench（3 题，Windows 等价手测版）

### Terminal-1：创建文件

```text
在 F:\AILIS\main\manual-tests\benchmark-smoke-20260826\terminal-01-hello 中创建 hello.txt，并写入 Hello, world!。请实际操作文件，不要只告诉我命令或内容。
```

### Terminal-2：异构日期 CSV

```text
我要去旧金山，需要知道每天的温差。读取：
F:\AILIS\main\manual-tests\benchmark-smoke-20260826\terminal-02-temperatures\daily_temp_sf_high.csv
F:\AILIS\main\manual-tests\benchmark-smoke-20260826\terminal-02-temperatures\daily_temp_sf_low.csv

计算逐日最高温与最低温之差的平均值，把结果写入同一目录下的 avg_temp.txt。文件只能包含计算出的数字。请实际读取和写入文件，不要只描述步骤。
```

### Terminal-3：访问日志分析

```text
分析文件：
F:\AILIS\main\manual-tests\benchmark-smoke-20260826\terminal-03-access-log\access_log

在同一目录创建 report.txt，内容必须包括：
1. Total requests: <number>
2. Unique IP addresses: <number>
3. 一行严格为 Top 3 URLs:，随后三行严格使用两个前导空格和格式“  <url>: <count>”
4. 404 errors: <number>

请实际处理日志并写入文件，不要只描述步骤。
```

## LoCoMo（同一会话连续测试）

先把下面这段“历史对话”作为第一条消息发送。AILIS 只需确认已经记住：

```text
请记住下面这段 Jon 与 Gina 的历史对话，后面我会连续提问。现在不要总结，只回复“已记住”。

[2023-01-20 16:04]
Jon：我昨天失去了银行职员的工作，所以打算尝试自己创业。
Gina：我这个月也失去了 DoorDash 的工作。你打算做什么生意？
Jon：我要开一家舞蹈工作室，因为我热爱舞蹈，也想和别人分享。
Jon：我理想中的舞蹈工作室在水边。

[2023-01-29 14:32]
Gina：我刚给自己的服装店发起广告活动。开自己的店、承担风险既可怕又值得。
Jon：我正在寻找舞蹈工作室的理想地点，发现了一处自然采光很好的地方。
Jon：我想使用 Marley 地板；它抓地、便于移动、耐用且容易清洁。

[2023-03-16 14:35]
Gina：我一直热爱时尚潮流和寻找独特单品，也想把自己对舞蹈和时尚的热爱结合起来。
```

然后在同一个会话中依次发送：

### LoCoMo-1

```text
Jon 和 Gina 有什么共同点？
```

### LoCoMo-2

```text
Jon 认为理想的舞蹈工作室应该是什么样子？
```

### LoCoMo-3

```text
Gina 为什么决定开自己的服装店？
```

## 标准答案（完成后再看）

1. GAIA-1：`3`
2. GAIA-2：`b, e`
3. GAIA-3：`broccoli, celery, fresh basil, lettuce, sweet potatoes`
4. Terminal-1：`hello.txt` 存在，去除末尾换行后内容严格为 `Hello, world!`
5. Terminal-2：`avg_temp.txt` 存在且只含数字；标准值 `11.428571428571429`（按三位小数验收为 `11.429`）
6. Terminal-3：标准内容如下：

```text
Total requests: 2000
Unique IP addresses: 273
Top 3 URLs:
  /order-confirmation: 54
  /product/456: 53
  /about.html: 52
404 errors: 83
```

7. LoCoMo-1：两人都失去了工作，并决定自己创业。
8. LoCoMo-2：在水边、有自然采光，并铺设 Marley 地板。
9. LoCoMo-3：她一直热爱时尚潮流和寻找独特单品；失业后决定自己创业开店，并希望结合对舞蹈和时尚的热爱。

注意：这里的 LoCoMo 是同会话协议手测子集。官方 LoCoMo 需要先加载完整长对话样本，不能用这 8 条证据上下文替代正式分数。
