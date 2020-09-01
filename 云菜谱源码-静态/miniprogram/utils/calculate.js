// 拿到数据库的引用
const db = wx.cloud.database()
/* 从数据库根据条件获取数据
@params  
_collection=""  数据库的集合名
_where={}  条件
*/
async function get(_collection = "", _where = {}) {
  var result = await db.collection(_collection).where(_where).get()
  return result;
}
/* 从数据库获取一条数据
@params  
_collection=""  数据库的集合名
id 获取那条数据的id
*/
async function getById(_collection = "", id) {
  var result = await db.collection(_collection).doc(id).get()
  return result;
}
/* 添加数据到数据库
@params  
_collection=""  数据库的集合名
_data={}  要添加的数据
*/
async function add(_collection = "", _data = {}) {
  var result = await db.collection(_collection).add(_data)
  return result;
}
/* 从数据库删除数据 
@params  
_collection=""  数据库的集合名
id 删除那条数据的id
*/
async function remove(_collection = "", id) {
  var result = await db.collection(_collection).doc(id).remove()
  return result;
}
/* 修改数据 
@params  
_collection=""  数据库的集合名
id 修改那条数据的id
_data修改的数据
*/
async function update(_collection = "", id,_data) {
  var result = await db.collection(_collection).doc(id).update({
    data:_data
  })
  return result;
}
export { get, getById, add, remove,update }