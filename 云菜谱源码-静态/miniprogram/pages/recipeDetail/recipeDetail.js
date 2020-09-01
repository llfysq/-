import { getById, add, get } from "../../utils/calculate"
const db=wx.cloud.database()
const _ = db.command
Page({
  data: {
    follows:"",//关注
    menuDetail: [],//详情
    isAttention: false,//是否关注

  },
  async onLoad(e) {
    // 调用getList渲染页面
    this.getList(e.id)
    
    // 判断是否关注了，如果关注了就显示红心
    var openid=wx.getStorageSync('openid')
    var rr = await get("follow", { menuId: e.id,_openid:openid })
    if (rr.data.length > 0) {
      this.setData({
        isAttention: true
      })
    }

    // 浏览量
    var datas= {
      views: _.inc(1)
    }
    this.addMun("menu",this.data.menuDetail._id,datas)
    this.data.menuDetail.views+=1
    this.setData({
      menuDetail:this.data.menuDetail
    })
  },
  // 封装详情渲染到页面
 async getList(id){
// 获取详情数据
var resuil = await getById("menu", id)
this.setData({
  menuDetail: resuil.data,
  follows:resuil.data.follows
})
  },

  // 封装自加自减
  addMun(database,id,data){
    db.collection(database).doc(id).update({data})
  },

  //已关注
  async noAttention() {
    this.setData({
      isAttention: true
    })
    // 将关注信息存入数据库中
    var menuId = this.data.menuDetail._id
    var addtime = new Date().getTime()

    var data = {
      menuId,
      addtime
    }
    var resuil = await add("follow", { data })
    if(resuil){
      // db.collection('menu').doc(menuId).update({
      //   data: {
      //     follows: _.inc(1)
      //   }
      // })
      // 自加
     var dataree= {
        follows: _.inc(1)
      }
      // 调用自加
      this.addMun('menu',menuId,dataree)
      // 渲染follows到页面
      this.setData({
        follows:this.data.follows+1
      })
    
    }
  },

  // 未关注
  async attention() {
    this.setData({
      isAttention: false
    })
    // 将关注信息从数据库中删除
    var menuId= this.data.menuDetail._id
    var data = {
      _openid: this.data.menuDetail._openid,
      menuId: this.data.menuDetail._id
    }
    //批量删除
    wx.cloud.callFunction({
      name: "batchDel",
      data,
      success: res => {
        // console.log(res)
        // db.collection('menu').doc(menuId).update({
        //   data: {
        //     follows: _.inc(-1)
        //   }
        // })
        // 自减
        var dataree= {
          follows: _.inc(-1)
        }
        this.addMun('menu',menuId,dataree)
        this.setData({
          follows:this.data.follows-1
        })
        
          // this.getList(menuId)
      },
      fail: err => {
        console.log(err)
      }
    })

  }
})