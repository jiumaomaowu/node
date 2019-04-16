const menu = require('../module/index.js').Menu
// const permission = require('../module/index.js').Permission
const Menust = require('./menu.js')
const _ = require('lodash');




class Status {
  constructor(Permission) {
    // console.log(1)
    this.Permission = Permission;

  }
 // 编辑菜单hidden属性
 editmenu (){
  let menuid = [];

  return new Promise((resolve, reject) => {
    menu.find((err,data) => {
      if (err) {
        reject(err)
      } else {
      data.forEach(element => {

        this.updatamenu(data,element,element.id,true)
        element.hidden = true
        this.Permission.forEach(ele => {
          // console.log("选中的 id",_.split(ele, '_', 2)[0])
          // console.log("初始的 id",element.id)
          if(element.id === _.split(ele, '_', 2)[0]){
            // console.log("element",element)
            // permissionid.push(element.id)
            
            if(_.split(ele, '_', 2)[1] === '浏览' ){
              menuid.push(_.split(ele, '_', 2)[0])
            }

          }
        })
      })
      
      menuid = Array.from(new Set(menuid))
      // let menuids = Array.from(new Set(_.pullAll(allMenu, menuid)))

      data.forEach(element => {

        if(menuid.length>0){
          // console.log("menuid",menuid)
          menuid.forEach(eles => {
            if(element.id ===eles){

              if(element.pid){
                this.updatamenu(data,'pid',element.pid,false)
              }
              this.updatamenu(data,element,element.id,false)
              element.hidden = false

            }
          })
        }else{
          console.log("menuid为空：",menuid)
          menuid.forEach(elem => {
            if(element.id ===elem){
              this.updatamenu(data,element,elem,true)
              element.hidden =  true
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

  updatamenu (data,element,id,status){

    if(element === 'pid'){
      data.forEach(element => {
        if(element.id === id){

          element.hidden = status
        }
      })
    }
      // console.log(id)
    menu.update({ id: id }, {$set:{hidden:status}}, (err, data) => {
        return true
    })
    


   
  }
}




module.exports = Status
