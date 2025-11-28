// visitor-counter.js - 访客统计功能模块 (支持服务端数据汇总)

class VisitorCounter {
  constructor() {
    this.today = new Date().toISOString().split('T')[0];
    this.visitorData = JSON.parse(localStorage.getItem('visitorData')) || [];
    this.markers = {};
    this.map = null;
    // Hit Counter相关配置
    this.counterId = 'lanncx-website-visitors'; // 自定义计数器ID
    this.serverCounter = 0; // 服务器统计的总访问量
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

  // 从服务器获取汇总的访问量
  fetchServerCounter() {
    return new Promise((resolve, reject) => {
      // 使用GitHub访问计数器API (简单易用的静态网站计数器)
      const counterUrl = `https://count.cabron.dev/counter/${this.counterId}`;
      
      fetch(counterUrl)
        .then(response => {
          if (!response.ok) throw new Error('服务器响应错误');
          return response.text();
        })
        .then(count => {
          this.serverCounter = parseInt(count) || 0;
          resolve(this.serverCounter);
        })
        .catch(error => {
          console.warn('获取服务器统计失败，使用本地数据:', error);
          // 失败时使用本地数据作为备份
          resolve(this.visitorData.length);
        });
    });
  }
  
  // 更新显示的访客统计
  async updateVisitorStats() {
    try {
      const todayVisitors = this.visitorData.filter(v => v.date === this.today).length;
      
      const todayEl = document.getElementById('today-visitors');
      const totalEl = document.getElementById('total-visitors');
      
      if (todayEl) {
        todayEl.textContent = todayVisitors;
      }
      
      // 先显示本地数据，然后更新为服务器数据
      if (totalEl) {
        totalEl.textContent = this.visitorData.length;
        
        // 异步获取服务器统计数据并更新
        const serverCount = await this.fetchServerCounter();
        totalEl.textContent = serverCount;
      }
    } catch (error) {
      console.error('更新访客统计失败:', error);
    }
  }

  // 渲染访客地图标记
  renderVisitorMarkers() {
    if (!this.map) return;
    
    // 按地区分组统计访客数量
    const regionStats = {};
    this.visitorData.forEach(visitor => {
      const key = `${visitor.lat},${visitor.lng}`;
      if (!regionStats[key]) {
        regionStats[key] = {
          lat: visitor.lat,
          lng: visitor.lng,
          region: visitor.region,
          count: 0
        };
      }
      regionStats[key].count++;
    });
    
    // 添加标记到地图
    Object.values(regionStats).forEach(stat => {
      const key = `${stat.lat},${stat.lng}`;
      this.markers[key] = L.marker([stat.lat, stat.lng]).addTo(this.map);
      this.markers[key].bindPopup(`<b>${stat.region}</b><br>${stat.count} 位访客`);
    });
  }

  // 向服务器发送访问记录
  sendVisitToServer() {
    // 使用GitHub访问计数器API增加计数
    const counterUrl = `https://count.cabron.dev/counter/${this.counterId}/increment`;
    
    fetch(counterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('服务器响应错误');
      console.log('访问记录已发送到服务器');
    })
    .catch(error => {
      console.warn('发送访问记录到服务器失败:', error);
    });
  }
  
  // 记录新访客
  recordNewVisitor() {
    // 向服务器发送访问记录（用于汇总统计）
    this.sendVisitToServer();
    
    // 同时继续使用本地存储记录详细信息（位置、日期等）
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        const newVisitor = {
          lat: data.latitude || 0,
          lng: data.longitude || 0,
          region: `${data.city || 'Unknown'}, ${data.region || ''}, ${data.country_name || ''}`.replace(/, $/g, ''),
          date: this.today,
          timestamp: new Date().toISOString()
        };
        
        // 检查是否是新访客（简单判断：今天同一地区的访问不重复计数）
        const isNewVisitor = !this.visitorData.some(v =>
          v.date === newVisitor.date &&
          v.lat === newVisitor.lat &&
          v.lng === newVisitor.lng
        );
        
        if (isNewVisitor) {
          this.visitorData.push(newVisitor);
          localStorage.setItem('visitorData', JSON.stringify(this.visitorData));
          
          // 更新统计数字
          this.updateVisitorStats();
          
          // 添加新标记到地图
          if (this.map) {
            const key = `${newVisitor.lat},${newVisitor.lng}`;
            
            // 检查是否已存在该位置的标记
            if (this.markers[key]) {
              // 增加计数
              const marker = this.markers[key];
              const currentText = marker.getPopup().getContent();
              const countMatch = currentText.match(/(\d+) 位访客/);
              if (countMatch) {
                const newCount = parseInt(countMatch[1]) + 1;
                marker.bindPopup(`<b>${newVisitor.region}</b><br>${newCount} 位访客`);
              }
            } else {
              // 创建新标记
              this.markers[key] = L.marker([newVisitor.lat, newVisitor.lng]).addTo(this.map);
              this.markers[key].bindPopup(`<b>${newVisitor.region}</b><br>1 位访客`);
            }
          }
        }
      })
      .catch(error => {
        console.error('获取地理位置信息失败:', error);
      });
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