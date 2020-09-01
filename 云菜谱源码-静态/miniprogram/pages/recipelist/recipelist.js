// pages/recipelist/recipelist.js
import { get } from "../../utils/calculate"
const db=wx.cloud.database()
Page({
data:{
  lookList:[],
  searchList: []
},
 async onLoad(e){
   if(e.id){
      //  我的 菜谱 跳转过来的
      var result = await get("menu", {})
      var lookList = this.data.lookList
      result.data.map(res => {
        if (e.id == res.typeId) {
          lookList.push(res)
        }
        return lookList
      })
       this.setData({
        lookList
      })
   }else if(e.keyword){
    // 搜索页面 关键字搜索
      let keyword = e.keyword
        var where = {
          menuName: db.RegExp({
            regexp: keyword,
            options: 'i',
          })
        }
        var result = await get("menu", where)
        console.log(result,"11")

        this.setData({
          searchList:result.data
        })
   }
   


 },
  // 点击每一个菜单跳转到自己对应的详情
  toDetail(e) {
    // console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../recipeDetail/recipeDetail?id=${id}`,
    })
  },
})

