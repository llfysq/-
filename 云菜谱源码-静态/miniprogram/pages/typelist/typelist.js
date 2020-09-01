import { get } from "../../utils/calculate"
Page({
  data: {
    keyword: '',//关键字
    iup: "",//用于清空搜索框中的内容
    typeList: [],//菜谱分类列表

  },

  async onLoad() {
    //从云数据库中拿到所有数据
    var result = await get("menuType", {})
    // console.log(result)
    // 将数据渲染到页面
    this.setData({
      typeList: result.data,
    })
  },
  // 点击相应的菜谱分类
  look(e) {
    var typeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../recipelist/recipelist?id=' + typeId,
    })
  },

  // 获取input框里输入的内容
  myInput(e) {
    this.data.keyword = e.detail.value
  },
  // 点击搜索
  doSearch() {
    wx.navigateTo({
      url: '../recipelist/recipelist?keyword=' + this.data.keyword,
    })
    this.setData({
      iup: ""
    })
  },

})