const app = getApp()

Page({
  data: {
    userInfo: null,
    stats: {
      favorites: 0,
      viewed: 0
    },
    menuList: [
      {
        icon: '⭐',
        title: '我的收藏',
        desc: '查看已收藏的菜谱',
        url: '/pages/favorite/favorite',
        isTab: true
      },
      {
        icon: '🔍',
        title: '浏览历史',
        desc: '查看最近浏览的菜谱',
        url: '',
        isTab: false
      },
      {
        icon: '⚙️',
        title: '设置',
        desc: '应用设置与偏好',
        url: '',
        isTab: false
      }
    ],
    aboutList: [
      {
        icon: '📱',
        title: '关于我们',
        desc: '版本信息与团队介绍'
      },
      {
        icon: '💡',
        title: '使用帮助',
        desc: '常见问题与使用指南'
      },
      {
        icon: '⭐',
        title: '给我们评分',
        desc: '您的支持是我们前进的动力'
      },
      {
        icon: '📧',
        title: '意见反馈',
        desc: '帮助我们改进产品体验'
      }
    ]
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
    
    this.updateStats()
  },

  updateStats() {
    const favorites = app.globalData.favorites || []
    this.setData({
      'stats.favorites': favorites.length
    })
  },

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        })
        app.globalData.userInfo = res.userInfo
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
      },
      fail: () => {
        wx.showToast({
          title: '授权失败',
          icon: 'none'
        })
      }
    })
  },

  onMenuTap(e) {
    const item = e.currentTarget.dataset.item
    
    if (item.isTab) {
      wx.switchTab({
        url: item.url
      })
    } else if (item.url) {
      wx.navigateTo({
        url: item.url
      })
    } else {
      wx.showToast({
        title: '功能开发中...',
        icon: 'none'
      })
    }
  },

  onAboutTap(e) {
    const index = e.currentTarget.dataset.index
    const titles = ['关于我们', '使用帮助', '评分', '意见反馈']
    
    wx.showModal({
      title: titles[index],
      content: `这是${titles[index]}功能，更多精彩内容敬请期待！`,
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  shareToFriend() {
    wx.showModal({
      title: '分享给好友',
      content: '点击右上角菜单即可分享给微信好友或朋友圈~',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有本地缓存数据吗？',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          app.globalData.favorites = []
          this.updateStats()
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          })
        }
      }
    })
  }
})