const admin = require('../../module/index.js').Admin
const serve = require("koa-static");
const formidable = require('koa2-formidable'); // 图片处理
const fs = require('fs'); // 图片路径
const path = require('path'); // 图片路径
// app.use(serve(__dirname))

// 新建文件，可以去百度fs模块
let mkdirs = (dirname, callback)=> {
    fs.exists(dirname, function(exists) {
        if (exists) {
            callback();
        } else {
            mkdirs(path.dirname(dirname), function() {
                fs.mkdir(dirname, callback);
            });
        }
    });
};

// 获取管理员列表
const personals = async (ctx,next) => {
    let job_number = ctx.request.body.job_number
    
    let query = () =>{
        return new Promise((resolve, reject) => {
            admin.find((err,data) => {              
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        success: true,
                        dataPersonal:data[0],
                        code:200
                    })
                }             
            }).where('job_number',job_number)
        })
    }
    let resullt =  await query();
    ctx.body = resullt
}







// 编辑个人信息
const editPersonal = async (ctx,next) => {
    
  console.log(ctx.request.body.id)
  let id = ctx.request.body.id
  let query = () =>{
      return new Promise((resolve, reject) => {
          admin.update({id:id},ctx.request.body,(err,data) => {
            if(err){
              reject({
                success: false,
                code:400,
                message:'编辑失败'
            })
            }else{
              resolve({
                success: true,
                code:200,
                message:'编辑成功'
              })
            }

          })
      })
  }
  let resullt =  await query();
  ctx.body = resullt
}


const postImg =async (ctx,next) =>{
    let form = formidable.parse(ctx.request);
    let query = () =>{
        return new Promise((resolve, reject) => {          
            form((opt, {fields, files})=> {              
                // let url = fields.url;
                let articleId = fields.id;
                let filename = files.file.name;             
                let uploadDir = 'static/images/';
                let avatarName = Date.now() + '_' + filename;
                mkdirs('static/images/', function() {
                    fs.renameSync(files.file.path, uploadDir + avatarName); //重命名
                    
                })
                admin.update({id:articleId},{$set:{avatar:uploadDir + avatarName}},(err,data) => {   
                    if(err){
                        reject(err)
                    }
                    resolve( '/' + uploadDir + avatarName)
                })  
            })
             
        })
    }
    let resullt =  await query()
    ctx.body = resullt 
}

module.exports = {
   personals,
   editPersonal,
   postImg
}
