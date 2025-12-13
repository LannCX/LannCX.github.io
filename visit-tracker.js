// visit-tracker.js - 模拟Visit Tracker功能

class VisitTracker {
  constructor(config) {
    this.config = config;
    this.storageKey = 'visitTrackerStats';
    this.today = new Date().toISOString().split('T')[0];
  }

  // 获取或初始化统计数据
  getStats() {
    const storedStats = localStorage.getItem(this.storageKey);
    let stats;

    if (storedStats) {
      stats = JSON.parse(storedStats);
      // 检查是否是新的一天
      if (stats.today !== this.today) {
        stats.today = this.today;
        stats.todayCount = 0;
      }
    } else {
      stats = {
        totalCount: 0,
        today: this.today,
        todayCount: 0
      };
    }

    return stats;
  }

  // 更新统计数据
  updateStats() {
    const stats = this.getStats();
    stats.totalCount++;
    stats.todayCount++;
    localStorage.setItem(this.storageKey, JSON.stringify(stats));
    return stats;
  }

  // 获取当前统计数据
  getCurrentStats() {
    return this.getStats();
  }

  // 记录访问
  trackVisit() {
    // 模拟发送数据到服务器
    console.log('VisitTracker: 记录访问', this.config.siteId);
    return this.updateStats();
  }
}

// 全局初始化
if (typeof window !== 'undefined') {
  window.VisitTracker = VisitTracker;
}

// 导出模块
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = VisitTracker;
}