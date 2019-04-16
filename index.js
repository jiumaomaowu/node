const Koa=require('koa'),
    // router = require('koa-router')(),
    render = require('koa-art-template'),
    path=require('path'),
    bodyParser=require('koa-bodyparser'),
    DB=require('./module/db.js'),
    static = require('koa-static'),
    response = require('./middlewares/response')
    //  router = require('./routes')

var app=new Koa();
// 使用响应处理中间件
app.use(response)
// 静态文件目录
app.use(static(path.resolve(__dirname, './')));

//配置post提交数据的中间件
app.use(bodyParser());

// app.use(require('koa-static')(__dirname));

// //配置 koa-art-template模板引擎
// render(app, {
//     root: path.join(__dirname, '../dist'),   // 视图的位置
//     extname: '.html',  // 后缀名
//     debug: process.env.NODE_ENV !== 'production'  //是否开启调试模式
// });

const router = require('./routes/index')
// 引入路由分发
// dd
app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());
app.listen(8888);


