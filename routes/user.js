const router = require('koa-router')()
const { login } = require('../controller/user.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {

  // 因为app.js 中app.use(bodyparser 和  app.use(json())，可以不用手动解析post data
  // const {username, password} = ctx.request.body
  // ctx.body = {
  //     errno : 0,
  //     username,
  //     password
  // }

  const {username, password} = ctx.request.body
  console.log('req.query的username是 ',username)
  // 拿到对象里数据做单独的参数放入login函数
  const data = await login(username, password)
  if (data.username) {
      ctx.session.username = data.username
      ctx.session.realname = data.realname
      console.log('ctx.session is ', ctx.session)
      ctx.body = new SuccessModel('登录成功')
      return
  }
  ctx.body = new ErrorModel('登录失败')
})

// // 测试session是否针对不同用户（用不同浏览器模拟）生效
// router.get('/session-test', async function (ctx, next) {
//   if (ctx.session.viewCount == null) {
//     ctx.session.viewCount = 0
//   }
//   ctx.session.viewCount++

//   // ctx.body相当于express中的res.json
//   ctx.body = {
//     errno: 0,
//     viewCount: ctx.session.viewCount
//   }
// })

module.exports = router
