/**
 * 整合所有子路由
 */

const router = require('koa-router')()

const login = require('../admin/login')
const hospital = require('../admin/hospital')
const applicant = require('../admin/applicant')
const protocol = require('../admin/protocol')
const meeting = require('../admin/meeting')
const admin = require('../admin/admin')
const menu = require('../admin/menu')
const role = require('../admin/role')
const personal = require('../admin/personal')
const blog = require('../admin/blog')
const dashboard = require('../admin/dashboard')

const wxlogin = require('../wx/login')

router.use(login.routes(), login.allowedMethods())
router.use( hospital.routes(), hospital.allowedMethods())
router.use( applicant.routes(), applicant.allowedMethods())
router.use( meeting.routes(), meeting.allowedMethods())
router.use( protocol.routes(), protocol.allowedMethods())
router.use( admin.routes(), admin.allowedMethods())
router.use( menu.routes(), menu.allowedMethods())
router.use( role.routes(), role.allowedMethods())
router.use( personal.routes(), personal.allowedMethods())
router.use( wxlogin.routes(), wxlogin.allowedMethods())
router.use(dashboard.routes(), dashboard.allowedMethods())
router.use( blog.routes(), blog.allowedMethods())
module.exports = router
