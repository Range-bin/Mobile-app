const app = getApp()

Page({
  data: {
    favorites: [],
    isEmpty: false
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    
    this.loadFavorites()
  },

  loadFavorites() {
    const favorites = app.globalData.favorites || []
    this.setData({
      favorites,
      isEmpty: favorites.length === 0
    })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  removeFavorite(e) {
    const id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '提示',
      content: '确定要取消收藏这道菜谱吗？',
      success: (res) => {
        if (res.confirm) {
          app.removeFromFavorites(id)
          this.loadFavorites()
          wx.showToast({
            title: '已取消收藏',
            icon: 'success'
          })
        }
      }
    })
  },

  clearAllFavorites() {
    if (this.data.favorites.length === 0) return
    
    wx.showModal({
      title: '提示',
      content: '确定要清空所有收藏吗？此操作不可恢复！',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          app.globalData.favorites = []
          wx.setStorageSync('favorites', [])
          this.loadFavorites()
          wx.showToast({
            title: '已清空收藏',
            icon: 'success'
          })
        }
      }
    })
  },

  goToAdd() {
    wx.switchTab({
      url: '/pages/discover/discover'
    })
  }
})