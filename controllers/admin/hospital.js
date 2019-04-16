const hospital = require('../../module/index.js').Hospital
const sd = require('silly-datetime')
const uuid = require('node-uuid');
const permission = require('../../module/index.js').Permission
const menu = require('../../module/index.js').Menu
const _ = require('lodash');

// 获取医院列表
const hospitalList = async (ctx,next) => {
    let hospitalName = ctx.request.query.hospitalName
    // console.log(ctx.request.query)
    let roleList = await role(ctx.request.query.roleId,ctx.request.query.menuId);
    let pattern = new RegExp("^.*"+hospitalName+".*$")
    let page = ctx.request.query.page
    let query = () =>{
        return new Promise((resolve, reject) => {
            hospital.find((err,data) => {
              
                hospital.count({},(err,count)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        success: true,
                        total:count,
                        datahospital:data,
                        code:200,
                        role:roleList
                    })
                }
              }).where('hospital_name',pattern)
            }).limit(10).skip((page-1)*10).where('hospital_name',pattern)
        })
    }
    let resullt =  await query();
    // console.log(resullt)
    ctx.body = resullt
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
        // console.log(roleArray)
        resolve(roleArray)
      });
    }).where("role_id",role_id)
  })


}
// 增加医院
const hospitalAdd = async (ctx,next) => {
    // console.log(ctx.request.body)
    let uid = uuid.v1();
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    ctx.request.body.id = uid;
    ctx.request.body.createTime = time;
    // console.log('hospital',ctx.request.body)
    let hospital1 = new hospital(ctx.request.body);
    // console.log('hospital1',hospital1)
    let query = () =>{
        return new Promise((resolve, reject) => {
            hospital1.save((err,data) => {
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

// 编辑医院数据
const hospitalEdit = async (ctx,next) => {
  // console.log(ctx.request.body)
  let id = ctx.request.body.id
  let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
  ctx.request.body.createTime = time;

  let query = () =>{
      return new Promise((resolve, reject) => {
          hospital.update({id:id},ctx.request.body,(err,data) => {
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
const hospitalRemove =  async (ctx,next) => {
  // console.log(ctx.request.body)
  let id = ctx.request.body.id
  let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
  ctx.request.body.createTime = time;

  let query = () =>{
      return new Promise((resolve, reject) => {
        hospital.remove({id:id},(err,data) => {
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

const hospitalBatchremove =  async (ctx,next) => {
  // console.log(ctx.request.body)
  let ids = ctx.request.body.ids.split(',')
  let query = () =>{
      return new Promise((resolve, reject) => {
        hospital.remove({id:ids},(err,data) => {
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
    hospitalList,
    hospitalAdd,
    hospitalEdit,
    hospitalRemove,
    hospitalBatchremove
}
