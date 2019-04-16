const role = require('../../module/index.js').Role
const menu = require('../../module/index.js').Menu
const permission = require('../../module/index.js').Permission
const user = require('../../module/index.js').User
const sd = require('silly-datetime')
const uuid = require('node-uuid');
const _ = require('lodash');
const Menust = require('../../until/menu.js')
// const permission = require('../../module/index.js').Permission
// 获取角色列表

const roleList = async (ctx,next) => {
    let roleName = ctx.request.query.roleName
    // console.log(ctx.request.query)

    let roleList = await roles(ctx.request.query.roleId,ctx.request.query.menuId);
    let pattern = new RegExp("^.*"+roleName+".*$")
    let page = ctx.request.query.page
    let query = () =>{
        return new Promise((resolve, reject) => {
            role.find((err,data) => {
                // console.log(data)
                role.count({},(err,count)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        success: true,
                        total:count,
                        dataRole:data,
                        code:200,
                        role:roleList
                    })
                }
              }).where('role_name',pattern)
            }).limit(10).skip((page-1)*10).where('role_name',pattern)
        })
    }
    let resullt =  await query();
    // console.log(resullt)
    ctx.body = resullt
}


const roles = (role_id,menuId) =>{

  return new Promise((resolve, reject) => {
    let roleArray = []
    permission.find((err,data) => {
      // console.log(menuId)

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



// 增加角色
const roleAdd = async (ctx,next) => {
    // console.log(ctx.request.body)
    let uid = uuid.v1();
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    ctx.request.body.id = uid;
    ctx.request.body.createTime = time;
    // console.log('role',ctx.request.body)
    let role1 = new role(ctx.request.body);
    // console.log('role1',role1)
    let query = () =>{
        return new Promise((resolve, reject) => {
            role1.save((err,data) => {
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

// 编辑角色数据
const roleEdit = async (ctx,next) => {
  // console.log(ctx.request.body)
  let id = ctx.request.body.id
  let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
  ctx.request.body.createTime = time;

  let query = () =>{
      return new Promise((resolve, reject) => {
          role.update({id:id},ctx.request.body,(err,data) => {
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
// 删除角色数据
const roleRemove =  async (ctx,next) => {
  // console.log(ctx.request.body)
  let id = ctx.request.body.id
  let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
  ctx.request.body.createTime = time;

  let query = () =>{
      return new Promise((resolve, reject) => {
        role.remove({id:id},(err,data) => {
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
// 批量删除角色
const roleBatchremove =  async (ctx,next) => {
  // console.log(ctx.request.body)
  let ids = ctx.request.body.ids.split(',')
  let query = () =>{
      return new Promise((resolve, reject) => {
        role.remove({id:ids},(err,data) => {
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
// 获取菜单列表
const rolePermission =  async (ctx,next) => {
  let query = () =>{
    return new Promise((resolve, reject) => {
      menu.find((err,data) => {
        if(err){
          reject(err)
        }
        data.forEach(element => {
          let son = []
          let sonData = element.sonData

          if(sonData.length>0){
            sonData.forEach(ele => {
              let obj ={}
              obj.label =  _.split(ele, '_', 2)[1]?_.split(ele, '_', 2)[1]:ele
              obj.value =  _.split(ele, '_', 2)[1]?element.id+'_'+ _.split(ele, '_', 2)[1]:element.id+'_'+ele
              son.push(obj)
            });
          }
          // console.log(son)
          element.sonData = son
        });

        let menuarray = new Array;
        let menucom = new Array;
        let menusts = new Menust (menucom,menuarray,data);
            menusts =  menusts.toArray()
        let jsonArray={
          code:200,
          role_permission:menusts
        };
        resolve(jsonArray);
      })
    })
  }
  let resullt =  await query();
  ctx.body = resullt
}

// 获取 角色所属权限
const roleGet = async (ctx,next) =>{
  let role_id =  ctx.request.body.row_id;
  let query = () =>{
    return new Promise((resolve, reject) => {
      permission.find((err,data) => {
        if (err) {
          reject(err)
        } else {
          // console.log(data)
          if(data.length>0){
            let data_permission = data[0].checked
            resolve({
              dataPermission:data_permission,
              code:200
            })
          }else{
            resolve({
              dataPermission:data,
              code:200
            })
          }
        }
      }).where('role_id',role_id)
    })
  }
  let resullt =  await query();
  ctx.body = resullt
}

// 编辑菜单hidden属性
const editmenu = (role_id,Permission,admin_id) =>{
    let menuid = [];

    let allMenu = []
    return new Promise((resolve, reject) => {
      menu.find((err,data) => {
        if (err) {
          reject(err)
        } else {
        data.forEach(element => {
          
          allMenu.push(element.id)
          // updatamenu(data,element,element.id,true,role_id,admin_id)
          Permission.forEach(ele => {
            if(element.id === _.split(ele, '_', 2)[0]){

              if(_.split(ele, '_', 2)[1] === '浏览' ){
                menuid.push(_.split(ele, '_', 2)[0])
              }

            }
          })
        })
        menuid = Array.from(new Set(menuid))
       
        data.forEach(element => {
          if(menuid.length>0){
            menuid.forEach(eles => {
              if(element.id ===eles){
               
                if(element.pid){
                  updatamenu(data,'pid',element.pid,false,role_id,admin_id)
                 }
                updatamenu(data,element,element.id,false,role_id,admin_id)
               
              }
            })
          }else{
            menuid.forEach(elem => {
              if(element.id ===elem){
                updatamenu(data,element,elem,true,role_id,admin_id)

              }

            });
          }
        })



        let menuarray = new Array;
        let menucom = new Array;
        let menusts = new Menust (menucom,menuarray,data);
            menusts =  menusts.toArray()
        resolve(menusts)
        }
      })
    })


}

const updatamenu = (data,element,id,status,role_id,admin_id)=>{
  console.log(element,role_id,admin_id)
  if(role_id === admin_id){
  
    if(element == 'pid'){
      data.forEach(element => {
        if(element.id === id){

          element.hidden = status
        }
      })
    }
    element.hidden = status
    
    menu.update({ id: id }, {$set:{hidden:status}}, (err, data) => {
      return true
    })
  }else{
    return true
  }

}



// 提交角色权限数据
const rolesubmit = async (ctx,next) =>{
  let uid = uuid.v1();
  ctx.request.body.id = uid
  let newPermission = new permission(ctx.request.body);
  // console.log(ctx.request.body)
  let editMenu = await editmenu(newPermission.role_id,newPermission.checked,newPermission.admin_id);

  let query = () =>{
    return new Promise((resolve, reject) => {
      permission.find({role_id:ctx.request.body.role_id},(err,data)=>{
        if (err) {
          reject(err)
        }else if(data.length>0){
          permission.update({role_id:ctx.request.body.role_id},ctx.request.body,(err,data) => {
            if (err) {
              reject({
                code:400,
                message:'更新失败'
              });
            } else {
              resolve({
                code:200,
                data:editMenu,
                message:'更新成功'
              });
            }
          })
        }else{
          newPermission.save((err,data) => {
            if (err) {
              reject({
                code:400,
                message:'提交失败'
              });
            } else {
              resolve({
                code:200,
                data:editMenu,
                message:'保存成功'
              });
            }
          })
        }
      })


    })
  }
  let resullt =  await query();
  ctx.body = resullt
}


// 提交角色用户数据
const roleUsersubmit = async (ctx,next) =>{
  let newUser = new user(ctx.request.body);
  let user_ids = ctx.request.body.user_id;
  let query = () =>{
    return new Promise((resolve, reject) => {
      user.find((err,data) => {
        if (err) {
            res.send(err)
        } else if(data.length>0){
          user.update({user_id: ctx.request.body.user_id}, ctx.request.body,(err,data) => {
              if(err) {
                reject({
                    code:400,
                    messager:'提交失败'
                  });
              } else {
                resolve({
                    code:200,
                    messager:'更新成功'
                  });
              }
          });
        } else {
            newUser.save((err,data) => {
              if (err) {
                reject({
                    code:400,
                    message:'提交失败'
                  });
              } else {
                resolve({
                    code:20000,
                    message:'保存成功'
                  });
              }

          });
        }
      }).where('user_id',user_ids)
    })
  }
  let resullt =  await query();
  ctx.body = resullt
}


// 获取角色用户数据
 const roleUserget = async (ctx,next) =>{
   console.log( ctx.request.body)
  let user_id =  ctx.request.body.user_id;
  let query = () =>{
    return new Promise((resolve, reject) => {
      user.find((err,data) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            dataUser:data,
            code:200
          })
        }
      }).where('user_id',user_id)
    })
  }
  let resullt =  await query();
  ctx.body = resullt
 }






module.exports = {
    roleList,
    roleAdd,
    roleEdit,
    roleGet,
    rolesubmit,
    roleRemove,
    roleUsersubmit,
    roleBatchremove,
    rolePermission,
    roleUserget
}
