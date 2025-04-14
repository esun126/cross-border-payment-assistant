# 跨境支付监管助手 - API文档

## API概述

跨境支付监管助手提供了一个简单的RESTful API，用于查询跨境支付相关的监管信息。API服务基于Express框架实现，提供以下功能：

- 查询跨境支付监管信息
- 获取相关法规条款
- 提供静态文件服务

## API端点

### 1. 查询监管信息

**端点**：`/api/query`

**方法**：POST

**描述**：根据用户查询，返回相关的监管信息和法规条款。

**请求参数**：

```json
{
  "query": "用户查询内容"
}
```

**响应**：

```json
{
  "answer": "监管解答内容",
  "references": [
    {
      "id": "法规ID",
      "title": "法规标题",
      "issuingBody": "发布机构",
      "issueDate": "发布日期",
      "chapter": {
        "number": "章节编号",
        "title": "章节标题"
      },
      "article": {
        "number": "条款编号",
        "content": "条款内容"
      },
      "keywords": ["关键词1", "关键词2"],
      "businessScenarios": ["业务场景1", "业务场景2"],
      "riskLevel": "风险等级",
      "similarity": "相似度"
    }
  ],
  "timestamp": "响应时间戳"
}
```

**示例请求**：

```bash
curl -X POST http://localhost:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{"query":"个人年度购汇额度是多少？"}'
```

**示例响应**：

```json
{
  "answer": "\n1. 核心内容：\n\n   a. 引用具体法规条款：\n   [确认法规] 根据《个人外汇管理办法》第5条规定：\"境内个人年度经常项目外汇购汇额度为等值5万美元。超过年度额度的，凭有交易额的真实性证明材料办理。\"\n   \n   b. 实际操作指导：\n   1. 在银行或支付机构开立个人外汇账户\n   2. 提供有效身份证件申请购汇\n   3. 5万美元以内无需提供交易证明\n   4. 超过5万美元需提供真实性证明材料（如留学录取通知书、学费单等）\n   5. 银行审核材料后办理购汇手续\n   \n   c. 信息可信度：\n   [确认法规] 5万美元的年度购汇额度是明确规定的\n   [行业实践] 不同银行对超额购汇的证明材料要求可能略有不同\n   [需确认] 特殊情况下的购汇流程可能因地区而异\n   \n   d. 潜在合规风险点：\n   - 风险等级：高\n   - 虚构交易背景进行购汇可能构成外汇违规\n   - 拆分交易规避额度限制属于违规行为\n   - 超额购汇未提供真实性证明可能被拒绝办理\n\n2. 补充内容：\n\n   a. 相关法规链接：\n   国家外汇管理局官网：https://www.safe.gov.cn/safe/\n   \n   b. 不同银行实践对比：\n   - 中国工商银行：要求提供护照、签证、录取通知书等证明材料\n   - 中国银行：通过手机银行可直接办理5万美元以内购汇\n   - 招商银行：留学生家庭可申请专属外汇服务，简化材料要求\n   \n   c. 合规风险解决方案：\n   - 提前准备完整的交易证明材料\n   - 保留交易相关的原始凭证\n   - 遵循银行要求的购汇流程\n   - 避免频繁、大额的可疑交易",
  "references": [
    {
      "id": "SAFE-2023-15",
      "title": "个人外汇管理办法",
      "issuingBody": "国家外汇管理局",
      "issueDate": "2023-05-10",
      "chapter": {
        "number": 2,
        "title": "经常项目外汇管理"
      },
      "article": {
        "number": 5,
        "content": "境内个人年度经常项目外汇购汇额度为等值5万美元。超过年度额度的，凭有交易额的真实性证明材料办理。"
      },
      "keywords": ["年度购汇额度", "5万美元", "真实性证明"],
      "businessScenarios": ["personal_forex_purchase"],
      "riskLevel": "high",
      "similarity": "0.85"
    }
  ],
  "timestamp": "2025-04-14T16:15:00.000Z"
}
```

## 错误处理

### 错误响应格式

```json
{
  "error": "错误描述",
  "details": "错误详情"
}
```

### 常见错误代码

- 400 Bad Request：请求参数错误
- 404 Not Found：请求的资源不存在
- 500 Internal Server Error：服务器内部错误

## 静态文件服务

API服务还提供静态文件服务，用于提供前端页面和相关资源。

**基础URL**：`http://localhost:3001`

**静态文件目录**：`public`

**主页**：`http://localhost:3001/index.html`

## API实现

API服务的核心实现在 `api_service.js` 文件中：

```javascript
// 查询处理端点
app.post('/api/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    // 步骤1：法规检索
    const relevantRegulations = await RegulationService.searchRegulations(query);
    
    // 步骤2：构建上下文
    const context = buildLLMContext(relevantRegulations, query);
    
    // 步骤3：调用DeepSeek模型
    const response = await queryDeepSeek({
      systemPrompt: "跨境支付监管专家",
      userPrompt: context
    });
    
    // 步骤4：格式化响应
    const formattedResponse = formatResponse(response, relevantRegulations);
    
    res.json(formattedResponse);
    
  } catch (error) {
    handleError(res, error);
  }
});
```

## 使用建议

1. **使用明确的查询**：提供明确、具体的查询内容，以获取更准确的结果。

2. **处理错误**：在集成API时，确保适当处理错误响应。

3. **缓存结果**：对于频繁查询的内容，考虑在客户端缓存结果，以减少API调用。

4. **限制请求频率**：避免短时间内发送大量请求，以防止服务器过载。

## API扩展计划

未来计划添加以下API功能：

1. **法规列表API**：获取所有可用法规的列表
2. **法规详情API**：获取特定法规的详细信息
3. **关键词搜索API**：根据关键词搜索法规
4. **业务场景API**：根据业务场景获取相关法规
5. **用户反馈API**：收集用户对回答的反馈
