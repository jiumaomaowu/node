
const sd = require('silly-datetime')
const uuid = require('node-uuid');
const blog = require('../../module/index.js').Blog
const permission = require('../../module/index.js').Permission
const _ = require('lodash');
const time = require('../../until/time')

const blogList = async (ctx,next) => {
    let blogName = ctx.request.query.blogName
    // console.log(ctx.request.query)
    let pattern = new RegExp("^.*"+blogName+".*$")
    let roleList;
    console.log(ctx.request.query)
    if(ctx.request.query.roleId){roleList = await role(ctx.request.query.roleId,ctx.request.query.menuId);}
    
    
    let page = ctx.request.query.page
    let query = () =>{
        return new Promise((resolve, reject) => {
            blog.find((err,data) => {
                blog.count({},(err,count)=>{
                if (err) {
                    reject(err);
                } else {


                // let _data = timetrans(data)
                //     console.log(_data[0])
                    resolve({
                        success: true,
                        total:count,
                        blog:data,
                        code:200,
                        role:roleList?roleList:''
                    })
                }
              }).where('title',pattern)
            }).sort({"pub_time":-1}).limit(5).skip((page-1)*5).where('title',pattern)
        })
    }
    let resullt =  await query();
    // console.log(resullt)
    ctx.body = resullt
}
  
const timetrans = (data) =>{
    return new Promise((resolve, reject) => {
       data.forEach(element => {
           
        element['pub_time'] = new time(element.pub_time).toTime()
            
        })   
        console.log("arr2---:",data[0])
        resolve(data)
    });
}


const role = (role_id,menuId) =>{

    return new Promise((resolve, reject) => {
      let roleArray = []
      permission.find((err,data) => {
        data.forEach(element => {
          element.checked.forEach(ele => {
           if( _.split(ele, '_', 2)[0] === menuId){
            roleArray.push(_.split(ele, '_', 2)[1])
            }
  
          });
          resolve(roleArray)
        });
      }).where("role_id",role_id)
    })
  
  
  }

// 返回
const blogMark = async (ctx,next) =>{
    let id = ctx.request.body.id

    let query = () =>{
        return new Promise((resolve, reject) => {
            blog.find({id:id},(err,data) => {
                // console.log(data)
                if(err){
                  reject({
                    success: false,
                    code:400
                    
                })
                }else{
                  resolve({
                    success: true,
                    code:200,
                    content:data[0].content,
                 
                  })
                }
    
            })
        })
   
    }
    let resullt =  await query()
    ctx.body = resullt

}
const blogAdd =  async (ctx,next) => {
    let uid = uuid.v1();
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    ctx.request.body.id = uid;
    ctx.request.body.pub_time = time;
    let blogs = new blog(ctx.request.body);

    let query = () =>{
        return new Promise((resolve, reject) => {
            blogs.save((err,data) => {
                resolve({
                    success: true,
                    code:200,
                    message:'提交成功'
                })
            })
        })
   
    }
    let resullt =  await query()
    ctx.body = resullt
}


//获取 文章 详情
const blogDesc = async (ctx,next) =>{
    let id = ctx.request.body.id
    let query = () =>{
        return new Promise((resolve, reject) => {
            blog.find({id:id},(err,data) => {
                // console.log(data)
                if(err){
                  reject({
                    success: false,
                    code:400,
                    

                })
                }else{
                  resolve({
                    success: true,
                    code:200,
                    data:data[0]
                   
                  })
                }
    
            })
        })
   
    }
    let resullt =  await query()
    ctx.body = resullt
}




//编辑博客
const blogEdit = async (ctx,next) =>{
    let id = ctx.request.body.id
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    ctx.request.body.pub_time = time;

    let query = () =>{
        return new Promise((resolve, reject) => {
            blog.update({id:id},ctx.request.body,(err,data) => {
                // console.log(data)
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
    let resullt =  await query()
    ctx.body = resullt
}

// 删除blog数据
const blogRemove =  async (ctx,next) => {
    // console.log(ctx.request.body)
    let id = ctx.request.body.id
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    ctx.request.body.pub_time = time;
  
    let query = () =>{
        return new Promise((resolve, reject) => {
          blog.remove({id:id},(err,data) => {
            if (err) {
              reject({
                code:400,
                message:'删除失败'
              });
            } else {
              resolve({
                code:200,
                message:'删除成功'
              })
              }
          })
        })
    }
    let resullt =  await query();
    ctx.body = resullt
  }
  
  // 批量删除
  
  const blogBatchremove =  async (ctx,next) => {
    // console.log(ctx.request.body)
    let ids = ctx.request.body.ids.split(',')
    let query = () =>{
        return new Promise((resolve, reject) => {
          blog.remove({id:ids},(err,data) => {
            if (err) {
              reject({
                code:400,
                message:'删除失败'
              });
            } else {
              resolve({
                code:200,
                message:'删除成功'
              })
              }
          })
        })
    }
    let resullt =  await query();
    ctx.body = resullt
  }

module.exports = {
    blogList,
    blogAdd,
    blogDesc,
    blogEdit,
    blogMark,
    blogRemove,
    blogBatchremove
}
