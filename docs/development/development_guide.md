# 跨境支付监管助手 - 开发指南

## 1. 开发环境设置

### 1.1 前提条件

- Node.js 18.0.0 或更高版本
- npm 8.0.0 或更高版本
- Git

### 1.2 克隆仓库

```bash
git clone https://github.com/YOUR_USERNAME/cross-border-payment-assistant.git
cd cross-border-payment-assistant
```

### 1.3 安装依赖

```bash
npm install
```

### 1.4 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，根据需要设置环境变量。

### 1.5 启动开发服务器

```bash
npm run dev
```

## 2. 项目结构

```
├── api_service.js          # API服务主入口
├── regulation_service.js   # 法规服务模块
├── deepseek_integration.js # LLM集成模块
├── data/                   # 数据目录
│   └── regulations/        # 法规JSON文件
├── public/                 # 前端文件
│   ├── index.html          # 主页面
│   ├── styles.css          # 样式文件
│   └── script.js           # 前端脚本
├── docs/                   # 文档
│   ├── architecture.md     # 架构文档
│   ├── prompts/            # 提示词文档
│   └── development/        # 开发指南
└── development-context.json # 开发上下文
```

## 3. 核心模块开发指南

### 3.1 法规知识库

法规知识库是系统的基础，包含结构化的法规JSON文件。每个法规文件应遵循以下结构：

```json
{
  "metadata": {
    "regulationId": "SAFE-YYYY-XX",
    "title": "法规标题",
    "issuingBody": "发布机构",
    "issueDate": "YYYY-MM-DD",
    "effectiveDate": "YYYY-MM-DD",
    "status": "effective"
  },
  "classification": {
    "businessTypes": ["业务类型1", "业务类型2"],
    "applicableEntities": ["适用主体1", "适用主体2"],
    "regulatoryFocus": ["监管重点1", "监管重点2"]
  },
  "content": {
    "summary": "法规摘要",
    "chapters": [
      {
        "chapterNumber": 1,
        "title": "章节标题",
        "articles": [
          {
            "articleNumber": 1,
            "content": "条款内容",
            "keywords": ["关键词1", "关键词2"],
            "businessScenarios": ["业务场景1", "业务场景2"],
            "riskLevel": "风险等级"
          }
        ]
      }
    ]
  }
}
```

添加新法规的步骤：

1. 在 `data/regulations/` 目录下创建新的JSON文件
2. 按照上述结构填写法规内容
3. 重启服务以加载新法规

### 3.2 法规检索服务

法规检索服务负责根据用户查询，从法规知识库中检索相关法规条款。

当前实现使用关键词匹配，未来计划实现基于向量的语义搜索。

改进法规检索的步骤：

1. 修改 `regulation_service.js` 文件
2. 实现新的检索算法
3. 确保返回的结果格式与现有格式兼容

### 3.3 LLM集成模块

LLM集成模块负责调用大型语言模型，根据检索到的法规内容生成专业的监管解答。

当前实现使用模拟版DeepSeek API，未来计划集成Claude 3.7 Sonnet模型。

集成新的LLM的步骤：

1. 修改 `deepseek_integration.js` 文件
2. 实现新的LLM API调用
3. 确保返回的结果格式与现有格式兼容

## 4. 前端开发指南

前端使用原生HTML/CSS/JavaScript实现，没有使用框架。

改进前端的步骤：

1. 修改 `public/index.html` 文件
2. 修改 `public/styles.css` 文件
3. 修改 `public/script.js` 文件

## 5. 开发最佳实践

### 5.1 代码风格

- 使用ES6+语法
- 使用async/await处理异步操作
- 使用模块化设计
- 添加适当的注释

### 5.2 错误处理

- 使用try/catch捕获异常
- 记录错误日志
- 返回友好的错误信息

### 5.3 测试

- 编写单元测试
- 编写集成测试
- 进行手动测试

### 5.4 文档

- 更新README.md
- 更新架构文档
- 更新API文档
- 更新开发指南

## 6. 持续集成/持续部署

未来计划添加GitHub Actions工作流，实现：

- 自动测试
- 自动构建
- 自动部署

## 7. 开发路线图

1. **向量搜索实现**：实现基于向量的语义搜索，替代当前的关键词匹配
2. **Claude 3.7 Sonnet集成**：集成Claude 3.7 Sonnet模型，替代模拟版DeepSeek API
3. **法规库扩充**：扩充法规库，添加更多跨境支付相关法规
4. **前端优化**：优化前端界面，提供更友好的用户体验
5. **自动化测试**：添加自动化测试，确保系统稳定性

## 8. 贡献指南

1. Fork仓库
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 9. 问题反馈

如果您在开发过程中遇到任何问题，请在GitHub仓库中创建Issue。
