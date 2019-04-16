const applicant = require('../../module/index.js').Applicant
const sd = require('silly-datetime')
const uuid = require('node-uuid');
const permission = require('../../module/index.js').Permission
const _ = require('lodash');
// 获取列表
const applicantList = async (ctx,next) => {
    let applicantName = ctx.request.query.applicantName
    // console.log(ctx.request.query)
    let roleList = await role(ctx.request.query.roleId,ctx.request.query.menuId);
    let pattern = new RegExp("^.*"+applicantName+".*$")
    let page = ctx.request.query.page
    let query = () =>{
        return new Promise((resolve, reject) => {
            applicant.find((err,data) => {
                // console.log(data)
                applicant.count({},(err,count)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        success: true,
                        total:count,
                        dataApplicant:data,
                        code:200,
                        role:roleList
                    })
                }
              }).where('applicant_name',pattern)
            }).limit(10).skip((page-1)*10).where('applicant_name',pattern)
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


// 增加申办方
const applicantAdd = async (ctx,next) => {
    // console.log(ctx.request.body)
    let uid = uuid.v1();
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    ctx.request.body.id = uid;
    ctx.request.body.createTime = time;
    // console.log('applicant',ctx.request.body)
    let applicant1 = new applicant(ctx.request.body);
    // console.log('applicant1',applicant1)
    let query = () =>{
        return new Promise((resolve, reject) => {
            applicant1.save((err,data) => {
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
const applicantEdit = async (ctx,next) => {
  // console.log(ctx.request.body)
  let id = ctx.request.body.id
  let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
  ctx.request.body.createTime = time;

  let query = () =>{
      return new Promise((resolve, reject) => {
          applicant.update({id:id},ctx.request.body,(err,data) => {
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
const applicantRemove =  async (ctx,next) => {
  // console.log(ctx.request.body)
  let id = ctx.request.body.id
  let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
  ctx.request.body.createTime = time;

  let query = () =>{
      return new Promise((resolve, reject) => {
        applicant.remove({id:id},(err,data) => {
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

const applicantBatchremove =  async (ctx,next) => {
  // console.log(ctx.request.body)
  let ids = ctx.request.body.ids.split(',')
  let query = () =>{
      return new Promise((resolve, reject) => {
        applicant.remove({id:ids},(err,data) => {
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
    applicantList,
    applicantAdd,
    applicantEdit,
    applicantRemove,
    applicantBatchremove
}
