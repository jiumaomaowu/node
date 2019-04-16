// const login = require('../../module/index.js').Login
// const menu = require('../../module/index.js').Menu
// const mongoose = require('mongoose')
const request = require('request');
const sha1 = require('sha1');


const Login = async (ctx) => {

  // console.log(ctx.request.body)
  let rawData = ctx.request.body.rawData
  let signature = ctx.request.body.signature
  let jscode = ctx.request.body.code
  let data = {appid:"wxd45a2bdf2e7000b4",secret:"b602e4c3465da14cb876752900dab7ad","grant_type":"authorization_code",js_code:jscode}

  request('https://api.weixin.qq.com/sns/jscode2session?appid='+data.appid+'&secret='+data.secret+'&js_code='+jscode+'&grant_type=authorization_code', function (error, res, body) {
    if (!error && res.statusCode == 200) {


      body = JSON.parse(body)
      let signature2 = sha1(rawData+body.session_key)
      if(signature == signature2)[
       console.log('合法 ')
      ]
    }
  })



  let query = () =>{
     return new Promise((resolve, reject) => {
      resolve({
        success:true,
        message:'成功啊啊111',
        code:200
      })
    })
  }
  let resullt =  await query();
  ctx.body = resullt
}


module.exports = {
  Login
}
