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
  
  router.get('/blog/list', controllers.blog.blogList)
  router.post('/blog/add', controllers.blog.blogAdd)
  router.post('/blog/desc', controllers.blog.blogDesc)
  router.post('/blog/edit', controllers.blog.blogEdit)
  router.post('/mark/down', controllers.blog.blogMark)
  router.post('/blog/remove', controllers.blog.blogRemove)
  router.post('/blog/batchremove', controllers.blog.blogBatchremove)
  
  
  module.exports = router
  