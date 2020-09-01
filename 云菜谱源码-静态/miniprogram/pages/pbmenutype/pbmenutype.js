// pages/pbmenutype/pbmenutype.js
import { get, update, add, remove } from "../../utils/calculate"
Page({
  data: {
    show: false,//点击添加，添加框出来
    isShow: false,//点击修改，修改框出来
    typeName: "",//分类名称
    typeList: [],//菜单分类数组
    id: ""
  },
  // 渲染数据到页面
  onLoad() {
    // 将数据渲染到页面
    this.getMuneType()
  },
  async getMuneType() {
    //从云数据库中拿到所有数据
    var result = await get("menuType", {})
    // 将数据渲染到页面
    this.setData({
      typeList: result.data,
    })
  },
  // 点击+号框，显示添加输入框
  addShow() {
    this.setData({
      show: true
    })
  },
  // 点击添加将数据添加到数据库
  formName(e) {
    this.setData({
      // 获取输入框中输入的信息
      typeName: e.detail.value,
      
    })
  },
  async addClassify() {
    var data = {
      typeName: this.data.typeName
    }
    var retuil = await add("menuType", { data })
    // 将数据渲染到页面
    this.getMuneType()
    this.setData({
      show: false
    })
    wx.showToast({
      title: '添加成功',
    })
  },

  //点击删除按钮
  async remove(e) {
    wx.showModal({
      title: "确定要删除吗？",
      success: res => {
        if (res.confirm) {
          var id = e.currentTarget.id
          var retuil =  remove("menuType", id)
          console.log(retuil,"uiuii")
          // 将数据渲染到页面
          this.getMuneType()
          wx.showToast({
            title: '删除成功',
          })
        }
      }
    })
  },
  // 点击修改按钮
  // 点击修改，显示修改输入框
  updateShow(e) {
    console.log(e)
    var id = e.currentTarget.id
    this.setData({
      isShow: true,
      id: id
    })
  },
  formTypeName(e) {
    this.setData({
      // 获取输入框中输入的信息
      typeName: e.detail.value
    })
  },
  async update() {
    var data = {
      typeName: this.data.typeName
    }
    var retuil = await update("menuType", this.data.id, data)

    // 将数据渲染到页面
    this.getMuneType()
    wx.showToast({
      title: '修改成功',
    })
  }
})