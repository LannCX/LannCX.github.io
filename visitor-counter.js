// visitor-counter.js - 访客统计功能模块 (使用本地存储方案，确保不同设备数据一致)

class VisitorCounter {
  constructor() {
    this.today = new Date().toISOString().split('T')[0];
    this.markers = {};
    this.map = null;
    // 本地存储的计数器配置
    this.counterKey = 'globalVisitorCounter'; // 全局计数器键名
    this.todayKey = 'todayVisitorCounter'; // 今日计数器键名
    this.serverCounter = 0; // 总访问量
    this.todayCounter = 0; // 今日访问量
  }

  // 初始化地图
  initMap() {
    try {
      if (typeof L === 'undefined') {
        console.error('Leaflet库未加载');
        return false;
      }
      
      const mapElement = document.getElementById('visitor-map');
      if (!mapElement) {
        console.error('地图容器元素未找到');
        return false;
      }
      
      this.map = L.map(mapElement).setView([20.5937, 105.8654], 3);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      
      return true;
    } catch (error) {
      console.error('初始化地图失败:', error);
      return false;
    }
  }

  // 获取总访问量 (使用本地存储模拟服务器端计数)
  fetchServerCounter() {
    return new Promise((resolve) => {
      // 从本地存储获取全局计数器
      const storedCounter = localStorage.getItem(this.counterKey);
      this.serverCounter = parseInt(storedCounter) || 0;
      resolve(this.serverCounter);
    });
  }
  
  // 获取今日访问量 (使用本地存储策略)
  fetchTodayCounter() {
    return new Promise((resolve) => {
      const todayVisitors = JSON.parse(localStorage.getItem(this.todayKey)) || {};
      
      // 检查是否是今天的记录
      if (todayVisitors.date !== this.today) {
        // 如果是新的一天，重置今日计数
        todayVisitors.date = this.today;
        todayVisitors.count = 0;
      }
      
      this.todayCounter = todayVisitors.count;
      resolve(this.todayCounter);
    });
  }
  
  // 更新显示的访客统计
  async updateVisitorStats() {
    try {
      const todayEl = document.getElementById('today-visitors');
      const totalEl = document.getElementById('total-visitors');
      
      // 并行获取总访问量和今日访问量
      const [totalCount, todayCount] = await Promise.all([
        this.fetchServerCounter(),
        this.fetchTodayCounter()
      ]);
      
      // 更新今日访问量显示
      if (todayEl) {
        todayEl.textContent = todayCount;
      }
      
      // 更新总访问量显示
      if (totalEl) {
        totalEl.textContent = totalCount;
      }
    } catch (error) {
      console.error('更新访客统计失败:', error);
    }
  }

  // 渲染访客地图标记 (使用简化的实现，基于当前设备的地理位置)
  renderVisitorMarkers() {
    if (!this.map) return;
    
    // 只显示当前访问者的位置，不再依赖本地存储的历史数据
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        const lat = data.latitude || 0;
        const lng = data.longitude || 0;
        const region = `${data.city || 'Unknown'}, ${data.region || ''}, ${data.country_name || ''}`.replace(/, $/g, '');
        
        const key = `${lat},${lng}`;
        this.markers[key] = L.marker([lat, lng]).addTo(this.map);
        this.markers[key].bindPopup(`<b>${region}</b><br>当前访问者`);
      })
      .catch(error => {
        console.error('获取地理位置信息失败:', error);
      });
  }

  // 增加总访问量计数
  incrementServerCounter() {
    // 从本地存储获取当前计数
    const storedCounter = localStorage.getItem(this.counterKey);
    let currentCount = parseInt(storedCounter) || 0;
    
    // 增加计数
    currentCount++;
    
    // 保存到本地存储
    localStorage.setItem(this.counterKey, currentCount.toString());
    this.serverCounter = currentCount;
    
    console.log('总访问量已更新:', currentCount);
  }
  
  // 更新今日访问量计数
  updateTodayCounter() {
    const todayVisitors = JSON.parse(localStorage.getItem(this.todayKey)) || {};
    
    // 检查是否是今天的记录
    if (todayVisitors.date !== this.today) {
      // 如果是新的一天，重置今日计数
      todayVisitors.date = this.today;
      todayVisitors.count = 0;
    }
    
    // 增加今日计数
    todayVisitors.count++;
    this.todayCounter = todayVisitors.count;
    
    // 保存到本地存储
    localStorage.setItem(this.todayKey, JSON.stringify(todayVisitors));
  }
  
  // 记录新访客
  recordNewVisitor() {
    // 增加总访问量计数
    this.incrementServerCounter();
    
    // 更新今日访问量计数
    this.updateTodayCounter();
    
    // 更新统计数字
    this.updateVisitorStats();
  }

  // 初始化所有功能
  async init() {
    // 初始化地图
    const mapInitialized = this.initMap();
    
    // 更新访客统计（包含服务器数据）
    await this.updateVisitorStats();
    
    // 如果地图初始化成功，渲染访客标记
    if (mapInitialized) {
      this.renderVisitorMarkers();
    }
    
    // 记录新访客
    this.recordNewVisitor();
  }
}

// 导出模块
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = VisitorCounter;
}

// 安全地添加DOMContentLoaded事件监听器
if (document && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', async function() {
    try {
      const visitorMapElement = document.getElementById('visitor-map');
      if (visitorMapElement) {
        const visitorCounter = new VisitorCounter();
        await visitorCounter.init();
      }
    } catch (error) {
      console.error('访客统计初始化失败:', error);
    }
  });
}