// miniprogram/pages/mine/mine.js
import { get, remove } from "../../utils/calculate"
const app = getApp();
Page({
  data: {
    userInfo: {}, //用户信息
    isLogin: false, //是否登录
    id: 1,//判断是选择菜谱、菜单、还是关注
    typeList: [],//菜单分类数组
    menuList: [],//菜单列表
    attentionList: []//关注列表
  },
  // 实现用户登录后，刷新用户还是登录着的
  async onLoad() {
    // 一进页面就判断app中是否有用户信息，如果有用户信息就将用户信息渲染到页面上
    if (app.globalData.userInfo) {
      var userInfo = app.globalData.userInfo
      this.setData({
        userInfo,
        isLogin: true
      })
      // 如果app没有用户信息，就用userInforeadyCallback函数从app.js拿用户的信息，再将用户信息渲染到页面上
    } else {
      app.userInfoReadyCallback = res => {
        // console.log(res,"11")
        this.setData({
          userInfo: res.userInfo,
          isLogin: true
        })
      }
    }
    //从云数据库中拿到所有菜单数据
    var result = await get("menu", {})
    // 将数据渲染到页面
    this.setData({
      menuList: result.data,
    })
  },
  // 点击登录按钮的用户登录，并将用户信息渲染到页面上
  getUserInfo(e) {
    // console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      isLogin: true
    })
  },
  // 点击添加信息按钮
  addInfo(e) {
    var avatarUrl = e.currentTarget.dataset.userInfo.avatarUrl
    var nickName = e.currentTarget.dataset.userInfo.nickName
    wx.navigateTo({
      url: '../info/info?nickName=' + nickName + '&avatarUrl=' + avatarUrl,
    })
  },

  // 点击菜单
  async getMenus(e) {
    //从云数据库中拿到所有数据
    var result = await get("menu", {})
    // 将数据渲染到页面
    this.setData({
      id: e.currentTarget.id,
      menuList: result.data,
    })
  },
  // 点击添加菜单
  pbmenu() {
    // 跳转到菜单添加页面
    wx.navigateTo({
      url: '../pbmenu/pbmenu',
    })
  },
  // 右滑动点击删除菜单
  async delCdlb(e) {
    console.log(e.currentTarget.dataset)
    var { id, index, file} = e.currentTarget.dataset
    wx.showModal({
      title: "确定要删除吗？",
      success: res => {
        // console.log(res)
        if (res.confirm) {
           // 先删除存储中的图片
          //  var file=this.data.menuList
           console.log(file,"22")
        
          var fileList= file.map(item=>{
             return item.fileID
           })
          //  console.log(fileList,"333")
           wx.cloud.deleteFile({
             fileList: fileList
           }).then(res => {
             // handle success
             console.log(res)
           }).catch(error => {
             // handle error
           })

          //删除数据库中数据
          remove("menu", id)
          //删除页面中的数据
          this.data.menuList.splice(index, 1)
          this.setData({
            menuList: this.data.menuList
          })
          //批量删除   删除对应关注列表中的数据
          var data = {
            _openid: this.data.menuList._openid,
            menuId: id
          }
          wx.cloud.callFunction({
            name: "batchDel",
            data,
            success: res => {
              console.log(res)
            },
            fail: err => {
              console.log(err)
            }
          })  
        }
      }
    })
  },
  // 点击每一个菜单跳转到自己对应的详情
  toDetail(e) {
    // console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../recipeDetail/recipeDetail?id=${id}`,
    })
  },


  // 点击菜谱
  async getCookbook(e) {
    //从云数据库中拿到所有数据
    var result = await get("menuType", {})
    // console.log(result)
    // 将数据渲染到页面
    this.setData({
      id: e.currentTarget.id,
      typeList: result.data,
    })
  },
  // 点击查看
  look(e) {
    var typeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../recipelist/recipelist?id='+typeId,
    })
  },


  //点击关注
  async attention(e) {
    //从云数据库中拿到所有数据
    var result = await get("follow", {})
    // 将数据渲染到页面
    var list = []
    result.data.forEach(item => {
      var menulist = get("menu", { _id: item.menuId })
      list.push(menulist)
    })
    var result = await Promise.all(list)
    var attentionList = result.map(res => {
      return res.data[0]
    })
    console.log(attentionList, "22")
    // 将数据渲染到页面
    this.setData({
      id: e.currentTarget.id,
      attentionList
    })
  },
  // 点击头像跳转到菜单分类页面
  fbcpfl() {
    wx.navigateTo({
      url: '../pbmenutype/pbmenutype',
    })
  }


})