// newsLoader.js - 用于加载最新动态的JavaScript文件

/**
 * 直接返回硬编码的新闻内容
 * @returns {Promise<Array>} 返回新闻条目数组
 */
async function loadNewsFromHtml() {
    try {
        console.log('使用硬编码的新闻数据');
        
        // 直接硬编码新闻数据
        const newsData = [
            {
                date: "2025-07-06",
                title: "One paper was accepted by ACM MM 2025",
                content: "My research paper on dense multi-label temporal action detection has been accepted by ACM MM 2025 (CCF A)."
            },
            {
                date: "2025-06-26",
                title: "One paper was accepted by ICCV 2025",
                content: "My research paper on data-free knowledge distillation has been accepted by ICCV 2025 (CCF A)."
            },
            {
                date: "2024-07-21",
                title: "One paper was accepted by TNNLS",
                content: "My research paper on efficient action recognition has been accepted by TNNLS (CCF B)."
            },
            {
                date: "2022-12-30",
                title: "One paper was accepted by TIP",
                content: "My research paper on efficient action recognition has been accepted by TIP (CCF A)."
            }
        ];
        
        console.log(`成功返回${newsData.length}条硬编码新闻数据`);
        
        // 返回新闻数据（完整列表）
        return newsData;
    } catch (error) {
        console.error('获取新闻数据时出错:', error);
        
        // 出错时返回空数组
        return [];
    }
}

/**
 * 将新闻内容渲染到index.html中的最新动态部分
 */
async function renderLatestNews() {
    console.log('开始渲染最新动态');
    
    // 获取index.html中的新闻容器
    const newsListContainer = document.getElementById('news-list');
    if (!newsListContainer) {
        console.error('无法找到index.html中的新闻列表容器 #news-list');
        return;
    }
    
    try {
        // 加载新闻内容
        const allNewsItems = await loadNewsFromHtml();
        
        // 在首页只显示前5条新闻
        const newsItems = allNewsItems.slice(0, 5);
        
        // 清空容器
        newsListContainer.innerHTML = '';
        
        if (newsItems.length === 0) {
            console.log('没有找到可渲染的新闻');
            newsListContainer.innerHTML = '<p class="text-gray-500">暂无最新动态</p>';
            return;
        }
        
        // 渲染每个新闻条目
        newsItems.forEach((item, index) => {
            const newsItem = document.createElement('div');
            newsItem.className = 'mb-6 last:mb-0';
            newsItem.innerHTML = `
                <div class="flex items-start">
                    <div class="flex-shrink-0 bg-primary/10 text-primary rounded-md px-3 py-1 text-sm font-medium">${item.date}</div>
                    <div class="ml-4">
                        <h3 class="text-lg font-medium text-gray-900">${item.title}</h3>
                        <p class="mt-1 text-gray-600">${item.content}</p>
                    </div>
                </div>
            `;
            newsListContainer.appendChild(newsItem);
        });
        
        console.log(`成功渲染了${newsItems.length}条新闻（首页限制为前5条）`);
    } catch (error) {
        console.error('渲染新闻内容时出错:', error);
        
        // 出错时显示默认消息
        newsListContainer.innerHTML = '<p class="text-gray-500">暂时无法加载最新动态</p>';
    }
}

// 当页面加载完成时自动执行
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    console.log('newsLoader.js 已加载，准备监听DOMContentLoaded事件');
    
    // 检查DOM是否已经加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded事件触发，开始执行渲染');
            // 根据当前页面URL决定执行哪个函数
            const currentPath = window.location.pathname;
            if (currentPath.includes('news.html')) {
                generateNewsPage();
            } else {
                renderLatestNews();
            }
        });
    } else {
        // 如果DOM已经加载完成，直接执行
        console.log('DOM已经加载完成，直接执行渲染');
        // 根据当前页面URL决定执行哪个函数
        const currentPath = window.location.pathname;
        if (currentPath.includes('news.html')) {
            generateNewsPage();
        } else {
            renderLatestNews();
        }
    }
}
