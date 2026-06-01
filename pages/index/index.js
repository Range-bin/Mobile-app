const recipes = require('../../data/recipes.js')

Page({
  data: {
    recommendRecipe: null,
    hotRecipes: [],
    categories: [
      { name: '🍖 荤菜', icon: 'meat', count: 0 },
      { name: '🥬 素菜', icon: 'vegetable', count: 0 },
      { name: '🍚 主食', icon: 'rice', count: 0 },
      { name: '🍲 汤类', icon: 'soup', count: 0 }
    ],
    searchKeyword: ''
  },

  onLoad() {
    this.loadRecommendRecipe()
    this.loadHotRecipes()
    this.countCategories()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },

  loadRecommendRecipe() {
    const hotRecipes = recipes.filter(r => r.isHot)
    const randomIndex = Math.floor(Math.random() * hotRecipes.length)
    this.setData({
      recommendRecipe: hotRecipes[randomIndex]
    })
  },

  loadHotRecipes() {
    const hotRecipes = recipes.filter(r => r.isHot).slice(0, 6)
    this.setData({ hotRecipes })
  },

  countCategories() {
    const categories = this.data.categories.map(cat => {
      const categoryName = cat.name.split(' ')[1]
      const count = recipes.filter(r => r.category === categoryName).length
      return { ...cat, count }
    })
    this.setData({ categories })
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
  },

  onSearch() {
    if (this.data.searchKeyword.trim()) {
      wx.navigateTo({
        url: `/pages/discover/discover?keyword=${this.data.searchKeyword}`
      })
    }
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  goToCategory(e) {
    const category = e.currentTarget.dataset.category
    wx.navigateTo({
      url: `/pages/discover/discover?category=${category}`
    })
  },

  onShareAppMessage() {
    return {
      title: '智能菜谱助手 - 发现美食的乐趣',
      path: '/pages/index/index'
    }
  }
})