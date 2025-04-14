# 跨境支付监管助手 - 用户提示词

## 用户提示词结构

用户提示词是用户向系统提出的查询，通常包含以下内容：

1. **查询问题**：用户想要了解的跨境支付监管问题
2. **上下文信息**：相关的业务场景、交易类型、涉及主体等
3. **检索到的法规**：系统从法规知识库中检索到的相关法规条款

## 用户提示词示例

### 示例1：个人购汇额度查询

```
用户查询：个人年度购汇额度是多少？超过额度后如何办理？

相关法规：

法规名称：个人外汇管理办法
发布机构：国家外汇管理局
发布日期：2023-05-10
生效日期：2023-06-01

第2章 经常项目外汇管理
第5条：境内个人年度经常项目外汇购汇额度为等值5万美元。超过年度额度的，凭有交易额的真实性证明材料办理。
关键词：年度购汇额度、5万美元、真实性证明
适用场景：personal_forex_purchase
风险等级：high
```

### 示例2：支付机构跨境支付业务要求

```
用户查询：支付机构办理跨境支付业务需要满足什么条件？有哪些合规要求？

相关法规：

法规名称：支付机构跨境外汇支付业务试点指导意见
发布机构：国家外汇管理局
发布日期：2022-07-20
生效日期：2022-08-01

第2章 业务资质与范围
第5条：支付机构申请跨境外汇支付业务试点资格，应当具备以下条件：
(一)取得中国人民银行颁发的《支付业务许可证》，获准办理互联网支付业务；
(二)具有稳健的公司治理结构和完善的内控制度；
(三)具备开展跨境外汇支付业务的技术条件和风险管理能力；
(四)近两年无重大违法违规行为。
关键词：试点资格、申请条件、支付业务许可证、内控制度、技术条件、风险管理能力
适用场景：qualification_application
风险等级：high

第3章 业务管理与风险控制
第9条：支付机构应当按照展业原则和'了解你的客户'要求，对客户身份进行识别、核实和登记，不得为身份不明的客户提供跨境外汇支付服务。
关键词：了解你的客户、KYC、客户身份识别、身份核实
适用场景：customer_verification
风险等级：very_high
```

## 用户提示词构建流程

1. **用户输入查询**：用户在前端界面输入自然语言查询

2. **法规检索**：系统根据用户查询，从法规知识库中检索相关法规条款

3. **构建用户提示词**：系统将用户查询和检索到的法规条款组合成用户提示词

4. **发送给LLM**：系统将用户提示词和系统提示词一起发送给LLM

5. **生成回答**：LLM根据提示词生成专业的监管解答

## 最佳实践

1. **明确具体**：提出明确、具体的问题，避免过于宽泛的查询

2. **提供上下文**：说明相关的业务场景、交易类型、涉及主体等

3. **指定关注点**：明确你最关心的方面，如合规要求、风险点、操作流程等

4. **参考示例问题**：可以参考系统提供的示例问题，了解如何提问

## 技术实现

在代码实现中，用户提示词的构建过程如下：

```javascript
// 构建LLM提示上下文
function buildLLMContext(regulations, query) {
  let context = `用户查询：${query}\n\n相关法规：`;
  
  regulations.forEach(reg => {
    const regulationDetail = RegulationService.getRegulationDetail(reg.metadata.regulationId);
    
    if (!regulationDetail) {
      console.warn(`未找到法规详情: ${reg.metadata.regulationId}`);
      return;
    }
    
    // 添加法规基本信息
    context += `\n\n法规名称：${regulationDetail.title}`;
    context += `\n发布机构：${regulationDetail.issuingBody}`;
    context += `\n发布日期：${regulationDetail.issueDate}`;
    context += `\n生效日期：${regulationDetail.effectiveDate || '未指定'}`;
    
    // 添加条款信息
    context += `\n\n第${reg.metadata.chapterNumber}章 ${reg.metadata.chapterTitle}`;
    context += `\n第${reg.metadata.articleNumber}条：${reg.metadata.content}`;
    
    // 添加关键词和业务场景
    if (reg.metadata.keywords && reg.metadata.keywords.length > 0) {
      context += `\n关键词：${reg.metadata.keywords.join('、')}`;
    }
    
    if (reg.metadata.businessScenarios && reg.metadata.businessScenarios.length > 0) {
      context += `\n适用场景：${reg.metadata.businessScenarios.join('、')}`;
    }
    
    // 添加风险等级
    if (reg.metadata.riskLevel) {
      context += `\n风险等级：${reg.metadata.riskLevel}`;
    }
  });
  
  return context;
}
```
