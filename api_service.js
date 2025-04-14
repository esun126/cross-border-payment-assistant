import express from 'express';
import cors from 'cors';
import { RegulationService } from './regulation_service.js';
import { queryDeepSeek } from './deepseek_integration.js';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 提供静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 初始化法规服务
await RegulationService.initialize();

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
  
  // 添加回答格式指导
  context += "\n\n请根据以上法规回答用户问题，并遵循以下格式：";
  context += "\n\n1. 核心内容：";
  context += "\n   a. 引用具体法规条款（包括条款号和原文）";
  context += "\n   b. 提供实际操作指导（按时间顺序的步骤）";
  context += "\n   c. 标注信息可信度";
  context += "\n   d. 说明潜在合规风险点";
  
  context += "\n\n2. 可信度标签：";
  context += "\n   [确认法规] - 来自官方发布文件的确定信息";
  context += "\n   [行业实践] - 基于市场实际操作但非明确规定的普遍做法";
  context += "\n   [需确认] - 可能随银行、地区或业务类型有差异的信息";
  
  context += "\n\n3. 补充内容（相关时提供）：";
  context += "\n   a. 相关法规条款的官方链接";
  context += "\n   b. 不同银行实践对比";
  context += "\n   c. 合规风险解决方案建议";
  
  return context;
}

// 响应格式化
function formatResponse(llmResponse, regulations) {
  return {
    answer: llmResponse,
    references: regulations.map(reg => {
      const regulationDetail = RegulationService.getRegulationDetail(reg.metadata.regulationId);
      
      return {
        id: reg.metadata.regulationId,
        title: regulationDetail ? regulationDetail.title : '未知法规',
        issuingBody: regulationDetail ? regulationDetail.issuingBody : '未知机构',
        issueDate: regulationDetail ? regulationDetail.issueDate : '未知日期',
        chapter: {
          number: reg.metadata.chapterNumber,
          title: reg.metadata.chapterTitle
        },
        article: {
          number: reg.metadata.articleNumber,
          content: reg.metadata.content
        },
        keywords: reg.metadata.keywords || [],
        businessScenarios: reg.metadata.businessScenarios || [],
        riskLevel: reg.metadata.riskLevel || 'medium',
        similarity: reg.similarity.toFixed(2)
      };
    }),
    timestamp: new Date().toISOString()
  };
}

// 错误处理
function handleError(res, error) {
  console.error('API Error:', error);
  res.status(500).json({
    error: '处理请求时发生错误',
    details: error.message
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API服务运行在端口 ${PORT}`);
});