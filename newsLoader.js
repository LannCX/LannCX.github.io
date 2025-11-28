// newsLoader.js - 用于从news.html读取并加载最新动态的JavaScript文件

/**
 * 从news.html读取新闻内容并提取前5条
 * @returns {Promise<Array>} 返回新闻条目数组
 */
async function loadNewsFromHtml() {
    try {
        // 获取news.html的内容
        const response = await fetch('news.html');
        const html = await response.text();
        
        // 创建一个临时DOM解析器
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 获取所有新闻条目
        const newsContainer = doc.getElementById('all-news-list');
        if (!newsContainer) {
            console.error('无法找到新闻容器元素');
            return [];
        }
        
        // 获取所有新闻条目元素
        const newsItems = newsContainer.querySelectorAll('.p-6');
        const newsArray = [];
        
        // 提取每个新闻条目的信息
        newsItems.forEach(item => {
            const dateElement = item.querySelector('.bg-primary\/10');
            const titleElement = item.querySelector('h3');
            const contentElement = item.querySelector('p');
            
            if (dateElement && titleElement && contentElement) {
                newsArray.push({
                    date: dateElement.textContent.trim(),
                    title: titleElement.textContent.trim(),
                    content: contentElement.textContent.trim()
                });
            }
        });
        
        // 返回前5条新闻，如果总数不足5条则返回全部
        return newsArray.slice(0, 5);
    } catch (error) {
        console.error('加载新闻内容时出错:', error);
        return [];
    }
}

/**
 * 将新闻内容渲染到index.html中的最新动态部分
 */
async function renderLatestNews() {
    try {
        // 加载新闻内容
        const newsItems = await loadNewsFromHtml();
        
        // 获取index.html中的新闻容器
        const newsListContainer = document.getElementById('news-list');
        if (!newsListContainer) {
            console.error('无法找到index.html中的新闻列表容器');
            return;
        }
        
        // 清空容器
        newsListContainer.innerHTML = '';
        
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
        
        console.log(`成功渲染了${newsItems.length}条新闻`);
    } catch (error) {
        console.error('渲染新闻内容时出错:', error);
        
        // 出错时显示默认消息
        const newsListContainer = document.getElementById('news-list');
        if (newsListContainer) {
            newsListContainer.innerHTML = '<p class="text-gray-500">暂时无法加载最新动态</p>';
        }
    }
}

// 当页面加载完成时自动执行
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', renderLatestNews);
}