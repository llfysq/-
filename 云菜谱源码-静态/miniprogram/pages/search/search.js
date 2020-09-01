// pages/search/search.js
const db = wx.cloud.database()
Page({
  data: {
    keyword: '',//关键字
    hostSearch: "",//热门搜索
    inp: "",//搜索框的内容
  },
  // 获取input框里输入的内容
  myInput(e) {
    this.data.keyword = e.detail.value
  },
  // 热门搜索，根据浏览量来判断
  async onLoad() {
    // 按照views倒序，选出最大的10个
    var result = await db.collection("menu").orderBy("views", "desc").limit(10).get()
    this.setData({
      hostSearch: result.data
    })
  },
  // 近期搜索渲染页面
  onShow() {
    var arr = wx.getStorageSync('keyword') || [];
    this.setData({
      arr
    })
  },

  // 点击搜索
  doSearch() {
    // 存储缓存 获取近期搜索
    var keyword = this.data.keyword
    var arr = wx.getStorageSync('keyword') || []
    var index = arr.findIndex(res => {
      return res == keyword
    })
    if (index != -1) {
      arr.splice(index, 1)
    }
    arr.unshift(keyword)
    wx.setStorageSync('keyword', arr)
    //页面跳转
    wx.navigateTo({
      url: '../recipelist/recipelist?keyword=' + keyword,
    })
    // 清空搜索框的内容
    this.setData({
      inp: ""
    })
  },
  // 点击了热门搜索或者近期搜索的每一个，跳转到搜索结果页
  doSearch(e) {
    // console.log(e.currentTarget.dataset.keyword,"00")
    //页面跳转
    wx.navigateTo({
      url: '../recipelist/recipelist?keyword=' + e.currentTarget.dataset.keyword,
    })
  }

})