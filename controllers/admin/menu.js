const menu = require('../../module/index.js').Menu
const sd = require('silly-datetime')
const uuid = require('node-uuid');
const role = require('../../module/index.js').Role
const _ = require('lodash');
const Menust = require('../../until/menu.js')
const SonData = require('../../until/sonData.js')
const permission = require('../../module/index.js').Permission


// 获取菜单列表
const menuList = async (ctx,next) => {
    let menuName = ctx.request.query.menuName
    // console.log(ctx.request.query)

    let roleList = await roles(ctx.request.query.roleId,ctx.request.query.menuId);
    let pattern = new RegExp("^.*"+menuName+".*$")
    let page = ctx.request.query.page
    let query = () =>{
        return new Promise((resolve, reject) => {
            menu.find((err,data) => {
                // console.log(data)
                menu.count({},(err,count)=>{
                if (err) {
                    reject(err);
                } else {
                  let menuarray = new Array;
                  let menucom = new Array;
                  let menusts = new Menust (menucom,menuarray,data);
                  menusts =  menusts.toArray()
             
                  resolve({
                      success: true,
                      total:menusts.length,
                      dataMenu:menusts,
                      code:200,
                      role:roleList
                  })
                }
              })

            })
        })
    }
    let resullt =  await query();
    // console.log(resullt)
    ctx.body = resullt
}

//获取所有权限按钮 （下拉菜单）

const selectBtn =  async (ctx,next) => {
  let query = () =>{
    return new Promise((resolve, reject) => {
      menu.find((err,data) => {

        let array = []
        data.forEach(element => {
          if(element.sonData.length>0){
            element.sonData.forEach(ele => {
              let obj = {}
              obj.label =  _.split(ele, '_', 2)[1]?_.split(ele, '_', 2)[1]:ele
              obj.value =  _.split(ele, '_', 2)[1]?_.split(ele, '_', 2)[1]:_.split(ele, '_', 2)[0]

              if(obj.label != null){
                array.push(obj)
              }


          });
          }

        });

        let objs = {};
        array = array.reduce((cur,next) => {
            objs[next.label] ? "" : objs[next.label] = true && cur.push(next);
            return cur;
        },[])
        resolve(array)
      })

    })

  }
  let resullt =  await query();
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

//顶级菜单
const topmenu = async (ctx,next) => {
  let query = () =>{
    return new Promise((resolve, reject) => {
        menu.find((err,data) => {
          if (err) {
            reject(err)
          }
          let topmenu = [{
            value:'顶级菜单',
            label:'顶级菜单'

          }]
          data.forEach(v =>{
            let mennuobj = {
              value:v.meta.title,
              label:v.meta.title,
              id:v.id
            }
            topmenu.push(mennuobj)
          })
          resolve({
            code:200,
            topmenu:topmenu
           })
        }).where('redirect')
    })
  }
  let resullt =  await query();
  ctx.body = resullt
}
// 更新菜单数据
const update = (item,newMenu)=>{
  let menuArray = item.children;
      menuArray.push(newMenu)
  return new Promise((resolve, reject) => {
    menu.update({ id: item.id }, {$set:{children:menuArray}}, (err, data) => {
        if(err){
          reject(reject)
        }
        resolve(true)
    })
  })

}

const Pid  = (body) =>{
  return new Promise((resolve, reject) =>{
    // console.log()
    menu.find((err,data)=>{
      if (err) {
        reject(err);
      }
      if(data.length>0){
        body.pid =data[0].id;
        
        menu.update({ id: data[0].id }, {$set:{sonData:[]}}, (err, data) => {
          
          return true
        })

      }
     
      
      resolve(body)
    }).where('redirect',body.top_menu)  
  })
}

// 增加菜单
const menuAdd = async (ctx,next) => {
  let uid = uuid.v1();
  ctx.request.body.id = uid;
  ctx.request.body.meta = {
      title:ctx.request.body.redirect?ctx.request.body.redirect:ctx.request.body.childname
  }
  let sonDatas = await editSon(ctx.request.body.sonData,ctx.request.body.id)
  ctx.request.body.sonData = sonDatas
  ctx.request.body.hidden = true
  let pid = await Pid(ctx.request.body)
  let newMenu = new menu(pid);
  let query = () => {
    return new Promise((resolve, reject) => {

      newMenu.save((err, data) => {
        if (err) {
          reject({
            code: 400,
            message: '提交失败'
          });
        } else {
          menu.find((err, data) => {
            if (err) {
              res.send(err)
            } else {
              let menuarray = new Array;
              let menucom = new Array;
              let menusts = new Menust (menucom,menuarray,data);
              menusts =  menusts.toArray()
              resolve({
                code: 200,
                user: menusts,
                message: "提交成功"
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

// 编辑菜单数据
const menuEdit = async (ctx,next) => {
  console.log(ctx.request.body)
  let id = ctx.request.body.id
  let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
  ctx.request.body.createTime = time;
  let sonDatas = await editSon(ctx.request.body.sonData,id)
  ctx.request.body.sonData = sonDatas
  let query = () => {
    return new Promise((resolve, reject) => {
      menu.update({ id: id }, ctx.request.body, (err, data) => {
        // console.log(data)
        if (err) {
          reject({
            success: false,
            code: 400,
            message: '编辑失败'
          })
        } else {
          menu.find((err, data) => {

              let menuarray = new Array;
              let menucom = new Array;
              let menusts = new Menust (menucom,menuarray,data);
              menusts =  menusts.toArray()
              resolve({
                code: 200,
                user: menusts,
                message: "编辑成功"
              });
          })

        }

      })
    })
  }
  let resullt =  await query();
  ctx.body = resullt
}

// 编辑sonData
const editSon = (sonData,id)=>{
  return new Promise((resolve, reject) => {
    let data = []
    sonData.forEach(element => {
      data.push(id+'_'+element)
    });
    console.log(data)
    
    resolve(data)
  })
}



// 删除菜单数据
const menuRemove =  async (ctx,next) => {

  let id = ctx.request.body.id
  let query = () =>{
      return new Promise((resolve, reject) => {
        menu.remove({id:id},(err,data) => {
          if (err) {
            reject({
              code:400,
              message:'删除失败'
            });
          } else {
            menu.find((err, data) => {

              let menuarray = new Array;
              let menucom = new Array;
              let menusts = new Menust (menucom,menuarray,data);
              menusts =  menusts.toArray()
              resolve({
                code: 200,
                user: menusts,
                message: "删除成功"
              });
          })

          }
        })
      })
  }
  let resullt =  await query();
  ctx.body = resullt
}




// 批量删除
const menuBatchremove =  async (ctx,next) => {
  // console.log(ctx.request.body)
  let ids = ctx.request.body.ids.split(',')
  let query = () =>{
      return new Promise((resolve, reject) => {
        menu.remove({id:ids},(err,data) => {

          if (err) {
            reject({
                code:400,
                message:'删除失败'
              });
          } else {
            menu.find((err,data) => {
              if (err) {
                  res.send(err)
              } else {
                let menuarray = [];
                let menucom = [];
                foreach(menuarray,data)
                function foreach(menuarray,data){
                    data.forEach(item =>{
                      if(item.top_menu=="顶级菜单"){
                        menuarray.push(item)
                      }else{
                        menucom.push(item)
                      }

                    })
                }
                format(menuarray,menucom)
                function format(menuarray,menucom) {
                  menuarray.forEach(element => {
                    menucom.forEach(v => {
                      if(element.name == v.top_menu ){
                        element.children.push(v)
                        element.children = Array.from(new Set(element.children))
                      }
                      if(element.children){
                        format(element.children,menucom)
                      }
                    });
                  });
                }
                resolve({
                  code:200,
                  user:menuarray,
                  message:"批量删除成功"

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



module.exports = {
    menuList,
    topmenu,
    menuAdd,
    menuEdit,
    menuRemove,
    menuBatchremove,
    selectBtn
}
