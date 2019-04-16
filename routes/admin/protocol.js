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

router.get('/protocol/list', controllers.protocol.protocolList)
router.post('/protocol/getHospital', controllers.protocol.getHospital)
router.get('/protocol/applicant', controllers.protocol.getApplicant)
router.post('/protocol/add', controllers.protocol.protocolAdd)
router.post('/protocol/edit', controllers.protocol.protocolEdit)
router.post('/protocol/remove', controllers.protocol.protocolRemove)
router.post('/protocol/batchremove', controllers.protocol.protocolBatchremove)


module.exports = router
