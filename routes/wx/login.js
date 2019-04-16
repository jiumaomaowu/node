/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
  prefix: '/wx'
})

// xxx.com/weapp/demosss
const controllers = require('../../controllers/wx')
// console.log(controllers)
// console.log(controllers)
// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/login', controllers.login.Login)
router.get('/login', controllers.login.Login)
module.exports = router
