import { get } from "../../utils/calculate"
const db=wx.cloud.database()
Page({
  data:{
    menuList:[],//菜单列表
    keyword: '',//关键字
    iup:"",//用于清空搜索框
    pageSize:4,//每页加载的条数
    page:0,//页数
  },
  // 加载菜单列表渲染页面
async onLoad(){
  wx.showLoading({
    title: '正在加载',
  })
 // 页面加载，获取第一页的内容
 let {page,pageSize}=this.data
 this.getList(page,pageSize)
 wx.hideLoading()
},
// 触底加载更多
onReachBottom(){
  wx.showLoading({
    title: '正在加载',
  })
  this.data.page+=1
  var pageSize=this.data.pageSize
  this.getList(this.data.page,pageSize)
  wx.hideLoading()
  },
// 获取菜单列表数据
async getList(page,pageSize){
var result=await db.collection("menu").skip(page*pageSize).limit(pageSize).get()
this.setData({
  menuList:this.data.menuList.concat(result.data)
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
  // 获取input框里输入的内容
  myInput(e) {
    this.data.keyword = e.detail.value
  },
  doSearch(){
    wx.navigateTo({
      url: '../recipelist/recipelist?keyword=' + this.data.keyword,
    })
    this.setData({
      iup:""
    })
  },
  // 点击菜谱分类跳转到typelist页面
  toTypeList(){
    wx.navigateTo({
      url: '../typelist/typelist',
    })
  }

})