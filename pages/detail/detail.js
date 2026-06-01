const recipes = require('../../data/recipes.js')
const app = getApp()

Page({
  data: {
    recipe: null,
    isFavorite: false,
    currentStep: 0,
    showAllIngredients: false
  },

  onLoad(options) {
    const id = parseInt(options.id)
    this.loadRecipeDetail(id)
    this.checkFavoriteStatus(id)
  },

  loadRecipeDetail(id) {
    const recipe = recipes.find(r => r.id === id)
    if (recipe) {
      wx.setNavigationBarTitle({
        title: recipe.title
      })
      this.setData({ recipe })
    } else {
      wx.showToast({
        title: '菜谱不存在',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  checkFavoriteStatus(id) {
    const isFavorite = app.isFavorite(id)
    this.setData({ isFavorite })
  },

  toggleFavorite() {
    const { recipe, isFavorite } = this.data
    
    if (isFavorite) {
      app.removeFromFavorites(recipe.id)
      this.setData({ isFavorite: false })
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      })
    } else {
      app.addToFavorites(recipe)
      this.setData({ isFavorite: true })
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      })
    }
  },

  toggleIngredients() {
    this.setData({ showAllIngredients: !this.data.showAllIngredients })
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url],
      current: url
    })
  },

  copyIngredients() {
    const { recipe } = this.data
    const ingredientsText = recipe.ingredients.join('\n')
    wx.setClipboardData({
      data: ingredientsText,
      success: () => {
        wx.showToast({
          title: '食材清单已复制',
          icon: 'success'
        })
      }
    })
  },

  onShareAppMessage() {
    const { recipe } = this.data
    return {
      title: `${recipe.title} - 智能菜谱助手`,
      path: `/pages/detail/detail?id=${recipe.id}`,
      imageUrl: recipe.image
    }
  },

  onShareTimeline() {
    const { recipe } = this.data
    return {
      title: `${recipe.title} - 快来学习这道美味佳肴！`,
      query: `id=${recipe.id}`
    }
  },

  goBack() {
    wx.navigateBack()
  },

  goToDiscover() {
    wx.switchTab({
      url: '/pages/discover/discover'
    })
  }
})