App({
  globalData: {
    userInfo: null,
    recipes: [],
    favorites: []
  },

  onLaunch() {
    const favorites = wx.getStorageSync('favorites') || []
    this.globalData.favorites = favorites
  },

  addToFavorites(recipe) {
    const exists = this.globalData.favorites.find(item => item.id === recipe.id)
    if (!exists) {
      this.globalData.favorites.push(recipe)
      wx.setStorageSync('favorites', this.globalData.favorites)
      return true
    }
    return false
  },

  removeFromFavorites(recipeId) {
    this.globalData.favorites = this.globalData.favorites.filter(item => item.id !== recipeId)
    wx.setStorageSync('favorites', this.globalData.favorites)
  },

  isFavorite(recipeId) {
    return this.globalData.favorites.some(item => item.id === recipeId)
  }
})