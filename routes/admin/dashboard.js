/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/admin'
  })
  
  // xxx.com/weapp/demo
  const controllers = require('../../controllers/admin')
  
  // console.log(controllers)
  // --- 图片上传 Demo --- //
  // 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
  
  
  router.get('/dashboard/chart', controllers.dashboard.chart)
  router.get('/dashboard/lastLogin', controllers.dashboard.lastLogin)

  module.exports = router
  