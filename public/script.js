document.addEventListener('DOMContentLoaded', function() {
    const queryInput = document.getElementById('query-input');
    const submitBtn = document.getElementById('submit-btn');
    const loading = document.getElementById('loading');
    const resultContainer = document.getElementById('result-container');
    const answerContent = document.getElementById('answer-content');
    const referencesList = document.getElementById('references-list');

    // API端点
    const API_URL = 'http://localhost:3001/api/query';

    // 提交按钮点击事件
    submitBtn.addEventListener('click', function() {
        const query = queryInput.value.trim();
        
        if (!query) {
            alert('请输入您的问题');
            return;
        }
        
        // 显示加载状态
        loading.style.display = 'block';
        resultContainer.style.display = 'none';
        
        // 发送API请求
        fetchAnswer(query);
    });

    // 回车键提交
    queryInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitBtn.click();
        }
    });

    // 获取回答
    async function fetchAnswer(query) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                throw new Error('网络请求失败');
            }

            const data = await response.json();
            displayResult(data);
        } catch (error) {
            console.error('Error:', error);
            loading.style.display = 'none';
            alert('查询失败，请稍后再试: ' + error.message);
        }
    }

    // 显示结果
    function displayResult(data) {
        // 隐藏加载状态
        loading.style.display = 'none';
        
        // 显示回答内容
        answerContent.innerHTML = formatAnswer(data.answer);
        
        // 显示参考法规
        displayReferences(data.references);
        
        // 显示结果容器
        resultContainer.style.display = 'grid';
    }

    // 格式化回答，处理可信度标签和换行
    function formatAnswer(answer) {
        // 替换可信度标签
        let formattedAnswer = answer
            .replace(/\[确认法规\]/g, '<span class="confidence-tag confirmed">[确认法规]</span>')
            .replace(/\[行业实践\]/g, '<span class="confidence-tag practice">[行业实践]</span>')
            .replace(/\[需确认\]/g, '<span class="confidence-tag uncertain">[需确认]</span>');
        
        // 保留换行
        formattedAnswer = formattedAnswer.replace(/\n/g, '<br>');
        
        return formattedAnswer;
    }

    // 显示参考法规
    function displayReferences(references) {
        referencesList.innerHTML = '';
        
        if (!references || references.length === 0) {
            referencesList.innerHTML = '<p>未找到相关法规</p>';
            return;
        }
        
        references.forEach(ref => {
            const refItem = document.createElement('div');
            refItem.className = 'reference-item';
            
            // 构建参考法规HTML
            let refHTML = `
                <div class="reference-title">${ref.title || '未知法规'}</div>
                <div class="reference-meta">
                    发布机构: ${ref.issuingBody || '未知'} | 
                    发布日期: ${ref.issueDate || '未知'} | 
                    相关度: ${ref.similarity || '0.00'}
                </div>
                <div class="reference-content">
                    <strong>第${ref.chapter?.number || ''}章 ${ref.chapter?.title || ''}</strong><br>
                    第${ref.article?.number || ''}条: ${ref.article?.content || ''}
                </div>
            `;
            
            // 添加关键词标签
            if (ref.keywords && ref.keywords.length > 0) {
                refHTML += '<div class="tags-container" style="margin-top: 10px;">';
                ref.keywords.forEach(keyword => {
                    refHTML += `<span class="tag tag-keyword">${keyword}</span>`;
                });
                refHTML += '</div>';
            }
            
            // 添加业务场景标签
            if (ref.businessScenarios && ref.businessScenarios.length > 0) {
                refHTML += '<div class="tags-container" style="margin-top: 5px;">';
                ref.businessScenarios.forEach(scenario => {
                    refHTML += `<span class="tag tag-scenario">${scenario}</span>`;
                });
                refHTML += '</div>';
            }
            
            // 添加风险等级标签
            if (ref.riskLevel) {
                let riskClass = 'tag-risk-medium';
                if (ref.riskLevel === 'high' || ref.riskLevel === 'very_high') {
                    riskClass = 'tag-risk-high';
                } else if (ref.riskLevel === 'low') {
                    riskClass = 'tag-risk-low';
                }
                
                refHTML += `<div class="tags-container" style="margin-top: 5px;">
                    <span class="tag ${riskClass}">风险等级: ${ref.riskLevel}</span>
                </div>`;
            }
            
            refItem.innerHTML = refHTML;
            referencesList.appendChild(refItem);
        });
    }

    // 添加示例问题点击功能
    const exampleQuestions = [
        '个人年度购汇额度是多少？',
        '跨境电商平台需要遵守哪些外汇规定？',
        '支付机构办理跨境支付业务需要满足什么条件？'
    ];

    // 可以在页面中添加示例问题按钮
    function addExampleQuestions() {
        const examplesContainer = document.createElement('div');
        examplesContainer.className = 'examples-container';
        examplesContainer.innerHTML = '<p>示例问题：</p>';
        
        exampleQuestions.forEach(question => {
            const btn = document.createElement('button');
            btn.className = 'example-btn';
            btn.textContent = question;
            btn.addEventListener('click', () => {
                queryInput.value = question;
                submitBtn.click();
            });
            examplesContainer.appendChild(btn);
        });
        
        // 将示例问题添加到查询容器之后
        document.querySelector('.query-container').appendChild(examplesContainer);
    }
    
    // 添加示例问题
    addExampleQuestions();
});