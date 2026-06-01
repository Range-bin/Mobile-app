const recipes = require('../../data/recipes.js')

Page({
  data: {
    recipes: [],
    filteredRecipes: [],
    categories: ['全部', '荤菜', '素菜', '主食', '汤类'],
    currentCategory: '全部',
    searchKeyword: '',
    sortBy: 'default',
    showFilter: false
  },

  onLoad(options) {
    if (options.keyword) {
      this.setData({ searchKeyword: options.keyword })
      this.searchRecipes(options.keyword)
    } else if (options.category) {
      this.setData({ currentCategory: options.category })
      this.filterByCategory(options.category)
    } else {
      this.loadAllRecipes()
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  loadAllRecipes() {
    this.setData({
      recipes,
      filteredRecipes: recipes
    })
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
  },

  onSearch() {
    const keyword = this.data.searchKeyword.trim()
    if (keyword) {
      this.searchRecipes(keyword)
    } else {
      this.loadAllRecipes()
    }
  },

  searchRecipes(keyword) {
    const results = recipes.filter(recipe => 
      recipe.title.includes(keyword) || 
      recipe.description.includes(keyword) ||
      recipe.ingredients.some(ing => ing.includes(keyword))
    )
    this.setData({
      filteredRecipes: results,
      currentCategory: '全部'
    })
  },

  selectCategory(e) {
    const category = e.currentTarget.dataset.category
    this.filterByCategory(category)
  },

  filterByCategory(category) {
    this.setData({ currentCategory: category })
    
    let filtered = []
    if (category === '全部') {
      filtered = recipes
    } else {
      filtered = recipes.filter(r => r.category === category)
    }

    if (this.data.searchKeyword) {
      filtered = filtered.filter(r => 
        r.title.includes(this.data.searchKeyword) ||
        r.description.includes(this.data.searchKeyword)
      )
    }

    this.setData({ filteredRecipes: filtered })
  },

  toggleFilter() {
    this.setData({ showFilter: !this.data.showFilter })
  },

  sortRecipes(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ sortBy: type, showFilter: false })

    let sorted = [...this.data.filteredRecipes]
    
    switch(type) {
      case 'likes':
        sorted.sort((a, b) => b.likes - a.likes)
        break
      case 'time':
        sorted.sort((a, b) => {
          const timeA = parseInt(a.time)
          const timeB = parseInt(b.time)
          return timeA - timeB
        })
        break
      case 'difficulty':
        const difficultyOrder = { '简单': 1, '中等': 2, '困难': 3 }
        sorted.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
        break
      default:
        sorted = [...this.data.filteredRecipes]
    }

    this.setData({ filteredRecipes: sorted })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  clearSearch() {
    this.setData({ searchKeyword: '' })
    this.loadAllRecipes()
  }
})