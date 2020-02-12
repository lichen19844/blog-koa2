// 有些require是引用的node_modules文件夹

const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// session和redisStore
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
// morgan是基于stream流的方式
const morgan = require('koa-morgan')

const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')

const { REDIS_CONF } = require('./conf/db')

// error handler 错误监测
onerror(app)

// middlewares
// 可以接收很多格式，处理post data
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
// 和日志有关
app.use(logger())
// 前端
app.use(require('koa-static')(__dirname + '/public'))
// 前端
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// session 配置 类似express中的app.use(session
app.keys = ['1qa@WS3ed$RF']
// 使用app.use注册过后，session()执行完会返回符合koa2中间件的函数，会被ctx接收，变成ctx.session
app.use(session({
  // 配置 cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 *1000
    },
  // 配置 redis
  store: redisStore({
    // all: '127.0.0.1:6379' // 先写死本地的 redis
    // 从配置中获取redis的连接地址
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

// logger 记录当前请求耗时
app.use(async (ctx, next) => {
  const start = new Date()
  // 上面获取完当前时间后，然后先去执行next函数
  await next()
  // 执行完计算时间
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 获取环境变量
// process是nodejs提供的全局变量
const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
  // 开发环境 / 测试环境
  app.use(morgan('dev', {
    // 默认参数，加不加一样, 会在控制台上输出日志
    stream: process.stdout
  }));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    // 将写入流写入目标文件内，不在控制台上输出
    stream: writeStream
  }));
}

// routes
// allowedMethods()在返回空或404或缺东西时，会做一个后补
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling 错误处理
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
