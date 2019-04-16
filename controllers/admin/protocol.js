const protocol = require('../../module/index.js').Protocol
const hospital = require('../../module/index.js').Hospital
const applicant = require('../../module/index.js').Applicant
const sd = require('silly-datetime')
const uuid = require('node-uuid')
const _ = require('lodash')
const permission = require('../../module/index.js').Permission
// 获取医院列表
const protocolList = async (ctx,next) => {
    let protocolName = ctx.request.query.protocolName
    // console.log(ctx.request.query)
    let roleList = await role(ctx.request.query.roleId,ctx.request.query.menuId);
    let pattern = new RegExp("^.*"+protocolName+".*$")
    let page = ctx.request.query.page
    let query = () =>{
        return new Promise((resolve, reject) => {
            protocol.find((err,data) => {
                // console.log(data)
                protocol.count({},(err,count)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        success: true,
                        total:count,
                        dataProtocol:data,
                        code:200,
                        role:roleList
                    })
                }
              }).where('protocol_name',pattern)
            }).limit(10).skip((page-1)*10).where('protocol_name',pattern)
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

// //获取医院协议模板提供方接口
const getHospital = async (ctx,next) => {
  let province = ctx.request.body.province;
  let city = ctx.request.body.city;
  let hospitalArray =[];
  console.log(ctx.request.body)
  let query = () =>{
    return new Promise((resolve, reject) => {
      hospital.find({"province":province,"city":city},(err,data) => {
        if(err){
          reject(err)
        }
        _.forEach(data, function(name, index){
          let dat = {
            value:name.hospital_name,
            label:name.hospital_name
          }
          hospitalArray.push(dat)
        })
        resolve(hospitalArray)
      })
    })
  }
  let resullt =  await query();
  ctx.body = resullt
}




// 增加医院
const protocolAdd = async (ctx,next) => {
    // console.log(ctx.request.body)
    let uid = uuid.v1();
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    ctx.request.body.id = uid;
    ctx.request.body.createTime = time;
    // console.log('protocol',ctx.request.body)
    let protocol1 = new protocol(ctx.request.body);
    // console.log('protocol1',protocol1)
    let query = () =>{
        return new Promise((resolve, reject) => {
            protocol1.save((err,data) => {
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

//获取指定申办方接口
const getApplicant = async (ctx,next) => {
  let applicantArray =[];
  let query = () =>{
    return new Promise((resolve, reject) => {
      applicant.find((err,data) => {
        if(err){
          reject(err)
        }
        _.forEach(data, function(name, index){
          let dat = {
            value:name.applicant_name,
            label:name.applicant_name
          }
          applicantArray.push(dat)
        })
        resolve(applicantArray)
      })
    })
  }
  let resullt =  await query();
  ctx.body = resullt

}


// 编辑医院数据
const protocolEdit = async (ctx,next) => {
  // console.log(ctx.request.body)
  let id = ctx.request.body.id
  let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
  ctx.request.body.createTime = time;

  let query = () =>{
      return new Promise((resolve, reject) => {
          protocol.update({id:id},ctx.request.body,(err,data) => {
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
const protocolRemove =  async (ctx,next) => {
  // console.log(ctx.request.body)
  let id = ctx.request.body.id
  let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
  ctx.request.body.createTime = time;

  let query = () =>{
      return new Promise((resolve, reject) => {
        protocol.remove({id:id},(err,data) => {
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

const protocolBatchremove =  async (ctx,next) => {
  // console.log(ctx.request.body)
  let ids = ctx.request.body.ids.split(',')
  let query = () =>{
      return new Promise((resolve, reject) => {
        protocol.remove({id:ids},(err,data) => {
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
    protocolList,
    getHospital,
    getApplicant,
    protocolAdd,
    protocolEdit,
    protocolRemove,
    protocolBatchremove
}
