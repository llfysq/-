import { get,add } from "../../utils/calculate"
import { multiUpload } from "../../utils/file"
const app=getApp()
Page({
  data: {
    typeList: [],//分类名称
    files: [],//图片路径
    menu:{
      openid:"",//添加人的openID
      menuName:"",//菜谱名称
      fileIds:[],//菜谱图片
      desc:"",//菜谱做法
      addtime:"",//时间戳
      nickName:"",//添加人的昵称
      avatarUrl:"",//添加人的头像
      follows:1,//关注数
      views:1,//访问数
      typeId:"",//菜谱分类id
    }
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

  // 添加图片
  bindselect(e) {
    //选择多张图片，获取临时路径
    // console.log(e)
    var tempFilePaths=e.detail.tempFilePaths;
    var files=tempFilePaths.map(item=>{
      return {url:item}
    })
    this.setData({
      files
    })
  },

  // 点击发布按钮
 async addMenuList(e) {
var menuName=e.detail.value.menuName//菜谱名称
var desc=e.detail.value.desc//菜谱做法
//菜谱分类id
var recipeTypeid=e.detail.value.recipeTypeid
var result = await get("menuType", {typeName:recipeTypeid})
var typeId=result.data[0]._id
var openid=app.globalData.openid// 添加人的openid
var nickName=app.globalData.userInfo.nickName//添加人的昵称
var avatarUrl=app.globalData.userInfo.avatarUrl//添加人的头像
var addtime=new Date().getTime()//添加的时间
var follows=2    //关注数
var views=1// 访问数
// 菜谱图片
var fileIds=await multiUpload(this.data.files)

var data = {
  openid,//添加人的openID
  menuName,//菜谱名称
  fileIds,//菜谱图片
  desc,//菜谱做法
  addtime,//时间戳
  nickName,//添加人的昵称
  avatarUrl,//添加人的头像
  follows,//关注数
  views,//访问数
  typeId,//菜谱分类id
}
var result = await add("menu", { data })
console.log(result,"0000")
wx.showToast({
  title: '发布成功',
})
this.setData({
  menu:{
    menuName:"",//菜谱名称
    fileIds:[],//菜谱图片
    desc:"",//菜谱做法
    typeId:"",//菜谱分类id
  }
})
  }
})