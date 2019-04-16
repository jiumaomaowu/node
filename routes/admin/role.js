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

router.get('/role/list', controllers.role.roleList)
router.post('/role/add', controllers.role.roleAdd)
router.post('/role/permission/submit', controllers.role.rolesubmit)
router.post('/role/edit', controllers.role.roleEdit)
router.post('/role/permission', controllers.role.rolePermission)
router.post('/role/permission/get', controllers.role.roleGet)
router.post('/role/remove', controllers.role.roleRemove)
router.post('/role/batchremove', controllers.role.roleBatchremove)
router.post('/role/user/submit', controllers.role.roleUsersubmit)
router.post('/role/user/get', controllers.role.roleUserget)

module.exports = router
