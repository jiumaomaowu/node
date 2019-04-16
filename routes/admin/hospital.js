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
router.post('/login', controllers.login.Login)

router.get('/hospital/list', controllers.hospital.hospitalList)
router.post('/hospital/add', controllers.hospital.hospitalAdd)
router.post('/hospital/edit', controllers.hospital.hospitalEdit)
router.post('/hospital/remove', controllers.hospital.hospitalRemove)
router.post('/hospital/batchremove', controllers.hospital.hospitalBatchremove)

module.exports = router
