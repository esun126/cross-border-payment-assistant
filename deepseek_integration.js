import dotenv from 'dotenv';
dotenv.config();

// 模拟版本的DeepSeek API调用
export async function queryDeepSeek({ systemPrompt, userPrompt, temperature = 0.2 }) {
  console.log('模拟DeepSeek API调用');
  console.log(`系统提示词: ${systemPrompt}`);
  console.log(`用户提示词长度: ${userPrompt.length} 字符`);
  
  // 返回模拟回答
  return generateMockResponse(userPrompt);
}

// 生成模拟回答
function generateMockResponse(userPrompt) {
  // 简单的模拟回答
  return `
1. 核心内容：

   a. 引用具体法规条款：
   [确认法规] 根据《支付机构跨境外汇支付业务试点指导意见》第9条规定："支付机构应当按照展业原则和'了解你的客户'要求，对客户身份进行识别、核实和登记，不得为身份不明的客户提供跨境外汇支付服务。"
   
   b. 实际操作指导：
   1. 支付机构需建立客户身份识别机制
   2. 对交易进行真实性、合规性审核
   3. 采集并保存交易信息不少于5年
   4. 建立跨境外汇支付业务风险管理制度
   5. 按要求向外汇管理机关报送业务数据
   
   c. 信息可信度：
   [确认法规] 客户身份识别和交易信息保存要求是明确规定的
   [行业实践] 不同支付机构的风险管理措施可能有所差异
   [需确认] 试点资格申请的具体要求需与当地外汇局确认
   
   d. 潜在合规风险点：
   - 风险等级：很高
   - 未充分验证客户身份可能导致违规
   - 交易监控不到位可能面临洗钱风险
   - 数据报送不及时或不准确可能受到处罚

2. 补充内容：

   a. 相关法规链接：
   国家外汇管理局官网：https://www.safe.gov.cn/safe/
   
   b. 不同支付机构实践对比：
   - 大型支付机构通常有更完善的风险管理系统
   - 中小支付机构可能需要更多依赖银行的合规支持
   
   c. 合规风险解决方案：
   - 投资先进的交易监控系统
   - 定期培训合规人员
   - 建立与监管机构的沟通渠道
   - 定期评估和更新风险管理措施
  `;
}