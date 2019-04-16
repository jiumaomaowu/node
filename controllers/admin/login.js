const login = require('../../module/index.js').Login
const menu = require('../../module/index.js').Menu
const admin = require('../../module/index.js').Admin
const user = require('../../module/index.js').User
const permission = require('../../module/index.js').Permission
const Menust = require('../../until/menu.js')
const cont = require('../../module/index.js').Cont
const ip = require('../../module/index.js').Ip
const Status = require('../../until/status.js')
const _ = require('lodash');
const sd = require('silly-datetime')
const request = require('request');

const uuid = require('node-uuid');
// 查找是否存在用户
const findUser = (username) => {
  return new Promise((resolve, reject) => {
    admin.findOne({ "job_number":username }, (err, doc) => {
      if(err){
        reject(err);
      }
      resolve(doc);
    });

  });
}
// console.log(sd.format(new Date(), 'YYYY-MM-DD HH:mm'))
// 查找用户最后一次登陆时间
const findTime = (username) => {
  return new Promise((resolve, reject) => {
    admin.find({ "job_number":username }, (err, doc) => {
      if(err){
        reject(err);
      }
      // console.log("查找用户：",doc)
      resolve(doc[0]);
    });
  });
}

const isTime = (userinfo) =>{
  return new Promise((resolve, reject) => {
    
      let lastTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm')
      if(!userinfo.loginTime){
          // console.log("不存在最后登陆时间，所以用现在的时间：------",lastTime)
          admin.update({ job_number: userinfo.job_number }, {$set:{loginTime:lastTime}}, (err, data) => {
            if(err){
              reject(err);
            }
            return true
          })
          resolve(lastTime);
      }else{
        admin.update({ job_number: userinfo.job_number }, {$set:{loginTime:lastTime}}, (err, data) => {
          if(err){
            reject(err);
          }
          return true
        })
        resolve(userinfo.loginTime)
      }
      
      
    
  });
}

const Ipconfig = (userinfo) =>{
  
  let usid = uuid.v1();
 
  return new Promise((resolve, reject) => {
    request('https://ifconfig.me/ip',function (error, res, body){
      if(error){
        reject(error);
      }
      let json={
        ipTime:sd.format(new Date(), 'YYYY-MM-DD HH:mm'),
        ip:body,
        username:userinfo.job_number,
        id:usid
      }
      let ipsave = new ip(json)
      // console.log(body,"bodyyyyy")
      ip.findOne({"ip":body},(err,data)=>{
        console.log(data,"dataaaaaaaaaaa")
        if(data){
          ip.update({"ip":body},{$set:{"ipTime":ipsave.ipTime}},(err,data)=>{
              return true
          })
        }else{
          ipsave.save((err,data)=>{
            // console.log("收集ip：---",data)
            return true
          })
        }

      })


      
      if(!userinfo.ip){
        admin.update({ job_number: userinfo.job_number }, {$set:{ip:body}}, (err, data) => {
          if(err){
            reject(err);
          }
          return true
        })
        resolve(body);
      }else{
        admin.update({ job_number: userinfo.job_number }, {$set:{ip:body}}, (err, data) => {
          if(err){
            reject(err);
          }
          return true
        })
        resolve(userinfo.ip)
      }
    })
  })
}
const saveCont = (doc)=>{
  return new Promise((resolve, reject) => {
  let counts = 0;
  let newTime = sd.format(new Date(), 'YYYY-MM-DD');
  counts ++;
  let uid = uuid.v1();
  let jsonArray = {
    date:newTime,
    nums:counts,
    id:uid
  }
  // 记录访问登陆接口次数
  if(!doc){
    let cont1 = new cont(jsonArray);
    cont1.save((err,data) => {
      return true
     
    })
  }else{
    cont.find((err,data) => {
      
     let contmums =  Number(data[0].nums) + Number(counts)
    //  console.log("存在相同日期：---",data[0],"记录总访问次数：---",contmums)
     cont.update({date:newTime},{$set:{nums:contmums}},(err, data)=>{
      resolve(contmums)

     })
    }).where('date',newTime)
    }   
  })

}
// 查找是否存在用户
const findDate = () => {
  let newTime = sd.format(new Date(), 'YYYY-MM-DD');
  return new Promise((resolve, reject) => {
    cont.findOne({ "date":newTime }, (err, doc) => {
      if(err){
        reject(err);
      }
      // console.log("查找是否存在相同的日期:---",doc)
      resolve(doc);
    });

  });
}


//登录
const Login = async (ctx) => {
  const { username,  password } = ctx.request.body;
  // console.log(ctx.request)
  let doc = await findUser(username);
  
   if(!doc){
    ctx.body = {
      success: false,
      code: 400,
      message:'账号不存在',
      data: {
        token: username
      }
    }

  }else if(!doc.status){
    ctx.body = {
      success: false,
      code: 400,
      message:'账号被禁用',
      data: {
        token: username
      }
    }
  }else if(password == doc.password){
    let userlist = await userlists(username).then((obj)=>{

      return userInfo(obj)
    })

    let menusts = new Status (userlist.checked)
    let menusts1 = await menusts.editmenu()   
    ctx.body = {
      success: true,
      code: 200,
      user: menusts1,
      data: {
        token: username
      },
      userInfo:userlist
    }
    let lastTimelogin =  findTime(username).then((userinfo)=>{
      return isTime(userinfo)
    })
    let lastIplogin =  findTime(username).then((userinfo)=>{
      return Ipconfig(userinfo)
    })
    let logincounts =  findDate().then((doc)=>{
      return saveCont(doc)
    })
  }else{
    ctx.body = {
      success: false,
      code: 401,
      message:'密码错误',
      data: {
        token: username
      }
    }
  }
}

//根据工号查找用户所属角色组
const userlists = (username) => {
  
  return new Promise((resolve, reject) =>{
    
    user.find((err,data) =>{ 

      data.forEach(element => {
        element.multipleSelection.forEach(v => {
          if(v.job_number == username){
           
            let obj = {}
            obj.user_id = element.user_id
            obj.avatar = v.avatar
           
            resolve(obj)
          }
        });
      })
    })
  })
}

//根据id查找用户数据
const adminlists = (user_id,id) => {
  return new Promise((resolve, reject) =>{
    admin.find((err,data) =>{
     
      data.forEach(element => {
        let obj = {}
            obj.user_id = user_id
            obj.avatar = element.avatar
          resolve(obj) 
      })
    }).where('id',id)
  })
}

//查找用户所属 角色id
const userInfo = (obj) => {
// console.log("obj:",obj)
  return new Promise((resolve, reject) =>{
    permission.find((err,data)=>{
      if(err){
        reject(err);
      }

      
      let newObj ={
        role_id:data[0].role_id,
        checked:data[0].checked,
        role_name:data[0].role_name,
        id:data[0].id,
        admin_id:data[0].admin_id,
        avatar:obj.avatar
       
       
        
      }
 
      resolve(newObj)
    }).where('role_id',obj.user_id)
  })
}
module.exports = {
  Login
}
