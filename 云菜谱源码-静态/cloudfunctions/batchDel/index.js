// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env: 'release-e0thh',
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();   //拿到数据库引用

// 云函数入口函数
exports.main = async (event, context) => {
  let { openid, menuId } = event
  return await db.collection("follow").where({ openid, menuId }).remove()
}