// 法规知识库核心服务 - 简化版
import fs from 'fs';
import path from 'path';

// 初始化结构化法规数据库
const regulationsDB = {
  regulations: [],
  async init() {
    // 加载法规数据
    this.regulations = await loadRegulations();
    console.log(`成功加载 ${this.regulations.length} 个法规文件`);
  }
};

// 从文件系统加载法规数据
async function loadRegulations() {
  const regulationsDir = path.join(process.cwd(), 'data/regulations');
  
  try {
    // 检查目录是否存在
    if (!fs.existsSync(regulationsDir)) {
      console.warn(`法规目录不存在: ${regulationsDir}`);
      return [];
    }
    
    // 读取目录中的所有JSON文件
    const files = fs.readdirSync(regulationsDir)
      .filter(file => file.endsWith('.json'));
    
    if (files.length === 0) {
      console.warn('未找到法规JSON文件');
      return [];
    }
    
    // 加载每个JSON文件
    const regulations = [];
    for (const file of files) {
      try {
        const filePath = path.join(regulationsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const regulation = JSON.parse(content);
        regulations.push(regulation);
      } catch (err) {
        console.error(`加载法规文件失败: ${file}`, err);
      }
    }
    
    return regulations;
  } catch (err) {
    console.error('加载法规数据失败:', err);
    return [];
  }
}

// 生成模拟的搜索结果
function generateMockSearchResults(query, regulations) {
  const results = [];
  
  // 简单的关键词匹配
  for (const reg of regulations) {
    if (reg.content && reg.content.chapters) {
      for (const chapter of reg.content.chapters) {
        for (const article of chapter.articles) {
          // 检查查询词是否出现在文本中
          const text = `${article.content}`;
          if (text.includes(query)) {
            results.push({
              similarity: 0.85, // 模拟相似度分数
              metadata: {
                regulationId: reg.metadata.regulationId,
                chapterNumber: chapter.chapterNumber,
                articleNumber: article.articleNumber,
                content: article.content,
                title: reg.metadata.title,
                chapterTitle: chapter.title,
                keywords: article.keywords || [],
                businessScenarios: article.businessScenarios || [],
                riskLevel: article.riskLevel || "medium"
              }
            });
          }
        }
      }
    }
  }
  
  // 如果没有找到匹配项，返回一些默认结果
  if (results.length === 0) {
    // 获取第一个法规的第一个章节的第一个条款
    if (regulations.length > 0) {
      const reg = regulations[0];
      if (reg.content && reg.content.chapters && reg.content.chapters.length > 0) {
        const chapter = reg.content.chapters[0];
        if (chapter.articles && chapter.articles.length > 0) {
          const article = chapter.articles[0];
          results.push({
            similarity: 0.6, // 较低的相似度分数
            metadata: {
              regulationId: reg.metadata.regulationId,
              chapterNumber: chapter.chapterNumber,
              articleNumber: article.articleNumber,
              content: article.content,
              title: reg.metadata.title,
              chapterTitle: chapter.title,
              keywords: article.keywords || [],
              businessScenarios: article.businessScenarios || [],
              riskLevel: article.riskLevel || "medium"
            }
          });
        }
      }
    }
  }
  
  // 返回前5个结果
  return results.slice(0, 5);
}

// 导出核心服务接口
export const RegulationService = {
  async initialize() {
    await regulationsDB.init();
  },
  
  async searchRegulations(query) {
    // 使用模拟的搜索结果
    return generateMockSearchResults(query, regulationsDB.regulations);
  },

  getRegulationDetail(id) {
    // 查找匹配的法规
    const regulation = regulationsDB.regulations.find(r => 
      (r.metadata && r.metadata.regulationId === id) || (r.id === id)
    );
    
    // 如果找到法规，返回格式化的详情
    if (regulation) {
      if (regulation.metadata) {
        // 新的JSON结构
        return {
          id: regulation.metadata.regulationId,
          title: regulation.metadata.title,
          issuingBody: regulation.metadata.issuingBody,
          issueDate: regulation.metadata.issueDate,
          effectiveDate: regulation.metadata.effectiveDate,
          status: regulation.metadata.status,
          content: regulation.content
        };
      } else {
        // 旧的JSON结构
        return regulation;
      }
    }
    
    return null;
  }
};