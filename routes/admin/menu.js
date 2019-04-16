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


router.get('/menu/list', controllers.menu.menuList)
router.get('/menu/topmenu', controllers.menu.topmenu)
router.get('/menu/permission', controllers.menu.selectBtn)
router.post('/menu/add', controllers.menu.menuAdd)
router.post('/menu/edit', controllers.menu.menuEdit)
router.post('/menu/remove', controllers.menu.menuRemove)
router.post('/menu/batchremove', controllers.menu.menuBatchremove)


module.exports = router
