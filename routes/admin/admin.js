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

router.get('/admin/list', controllers.admin.adminList)
router.post('/admin/add', controllers.admin.adminAdd)
router.post('/admin/changestatus', controllers.admin.adminChangestatus)
router.post('/admin/edit', controllers.admin.adminEdit)
router.post('/admin/remove', controllers.admin.adminRemove)
router.post('/admin/batchremove', controllers.admin.adminBatchremove)


module.exports = router
