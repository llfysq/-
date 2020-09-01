/*
上传一个文件到云存储
@params  
_filePath  一个文件临时路径
*/
async function upload(_filePath){
  // 获取文件后缀名
  var ext=_filePath.split(".").pop();
  // 获取时间戳
  var nowtime=new Data().getTime();
  // nowtime+"."+ext拼接成一个新的文件路径
  return await wx.cloud.uploadFile({
    cloudPath:nowtime+"."+ext,
    filePath:_filePath
  })
}
/*
批量上传文件
@params tempFilePath 文件临时路径的数组
*/
async function multiUpload(tempFilePath){
  // 定义一个数组用来存放新的图片路径
  var arr=[]
  tempFilePath.forEach(item=>{
     // 获取文件后缀名
  var ext=item.url.split(".").pop();
  // 获取时间戳
  var nowtime=new Date().getTime();

var newArr=wx.cloud.uploadFile({
    // nowtime+"."+ext拼接成一个新的文件路径
  cloudPath:nowtime+"."+ext,
  filePath:item.url
})
// 把promise对象push到数组里
arr.push(newArr)
  })
//  所有都上传完成，返回一个结果
var result=await Promise.all(arr);
return result;
}
export {upload,multiUpload}