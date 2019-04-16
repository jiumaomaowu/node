const admin = require('../../module/index.js').Admin
const sd = require('silly-datetime')
const uuid = require('node-uuid');
const permission = require('../../module/index.js').Permission

const _ = require('lodash');
// 获取管理员列表
const adminList = async (ctx,next) => {
    let adminName = ctx.request.query.adminName
    // console.log(ctx.request.query)

    let roleList = await role(ctx.request.query.roleId,ctx.request.query.menuId);
    // console.log(roleList)
    let pattern = new RegExp("^.*"+adminName+".*$")
    let page = ctx.request.query.page
    let query = () =>{
        return new Promise((resolve, reject) => {
            admin.find((err,data) => {
                // console.log(data)
                admin.count({},(err,count)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        success: true,
                        total:count,
                        dataAdmin:data,
                        code:200,
                        role:roleList
                    })
                }
              }).where('name',pattern)
            }).limit(10).skip((page-1)*10).where('name',pattern)
        })
    }
    let resullt =  await query();
    ctx.body = resullt
}

const role = (role_id,menuId) =>{

  return new Promise((resolve, reject) => {
    let roleArray = []
    permission.find((err,data) => {
      console.log(menuId)

      data.forEach(element => {
        element.checked.forEach(ele => {
         if( _.split(ele, '_', 2)[0] === menuId){
          roleArray.push(_.split(ele, '_', 2)[1])
          }

        });
        // console.log(roleArray)
        resolve(roleArray)
      });
    }).where("role_id",role_id)
  })
}


// 增加管理员
const adminAdd = async (ctx,next) => {
    // console.log(ctx.request.body)
    let uid = uuid.v1();
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    ctx.request.body.id = uid;
    ctx.request.body.createTime = time;
    ctx.request.body.avatar = 'static/images/sw.gif'
    let admin1 = new admin(ctx.request.body);
    let query = () =>{
        return new Promise((resolve, reject) => {
            admin1.save((err,data) => {
                resolve({
                    success: true,
                    code:200,
                    message:'提交成功'
                })
            })
        })
    }
    let resullt =  await query();
    // console.log(resullt)
    ctx.body = resullt
}

const adminChangestatus = async (ctx,next) =>{
  let id = ctx.request.body.id
  let query = () =>{
      return new Promise((resolve, reject) => {
          admin.update({id:id},ctx.request.body,(err,data) => {
            // console.log(data)
            if(err){
              reject({
                success: false,
                code:400,
                message:'修改失败'
            })
            }else{
              resolve({
                success: true,
                code:200,
                message:'修改成功'
              })
            }

          })
      })
  }
  let resullt =  await query();
  ctx.body = resullt
}


// 编辑医院数据
const adminEdit = async (ctx,next) => {
  // console.log(ctx.request.body)
  let id = ctx.request.body.id
  let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
  ctx.request.body.createTime = time;

  let query = () =>{
      return new Promise((resolve, reject) => {
          admin.update({id:id},ctx.request.body,(err,data) => {
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
  let resullt =  await query();
  // console.log(resullt)
  ctx.body = resullt
}
// 删除医院数据
const adminRemove =  async (ctx,next) => {
  // console.log(ctx.request.body)
  let id = ctx.request.body.id
  let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
  ctx.request.body.createTime = time;

  let query = () =>{
      return new Promise((resolve, reject) => {
        admin.remove({id:id},(err,data) => {
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

const adminBatchremove =  async (ctx,next) => {
  // console.log(ctx.request.body)
  let ids = ctx.request.body.ids.split(',')
  let query = () =>{
      return new Promise((resolve, reject) => {
        admin.remove({id:ids},(err,data) => {
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
    adminList,
    adminAdd,
    adminChangestatus,
    adminEdit,
    adminRemove,
    adminBatchremove
}
