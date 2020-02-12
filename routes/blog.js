const router = require('koa-router')()

const { getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog } = require('../controller/blog.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
  // const query = ctx.query
  // ctx.body = {
  //     errno : 0,
  //     query,
  //     data: ['获取博客列表']
  // }

  // req.query在express中已经处理好了
  let author = ctx.query.author || ''
  // 键入关键字
  const keyword = ctx.query.keyword || ''

  if (ctx.query.isadmin) {
    console.log('ctx.query.isadmin is ', ctx.query.isadmin)
    console.log('is admin')
    // 管理员界面
      if (ctx.session.username == null) {
          console.error('is admin, but no login')
          // 未登录
          // res.json(
          //     new ErrorModel('未登录')
          // )
          ctx.body = new ErrorModel('admin未登录')
          return
      }
      // 强制查询自己的博客，因为author会变化，所以必须用let而不是const
      author = ctx.session.username
  }

  const listData = await getList(author, keyword)
  ctx.body = new SuccessModel(listData)
  return
  // // result是一个promise，带回的结果被塞入listData函数，去给SuccessModel执行
  // const result = getList(author, keyword)
  // // SuccessModel执行结果返回给handleBlogRouter
  // return result.then( listData => {
  //     // return new SuccessModel(listData)
  //     res.json(
  //         new SuccessModel(listData)
  //     )
  // })
})

router.get('/detail', async (ctx, next) => {
  // req.query.id是从浏览器url中获得的
  const data = await getDetail(ctx.query.id);
  ctx.body = new SuccessModel(data, 'hahaha')
  return 

  // // result是个promise，因为controller中引用的exec是个promise
  // return result.then( data => {
  //     console.log('data is a object? ', data)
  //     res.json(
  //         new SuccessModel(data, 'hahaha')
  //     )
  // } )
});

router.post('/new', loginCheck, async (ctx, next) => {
  // 不需要写loginCheck(req)，中间件里自己检验了req，如果检验成功，会执行next，即这里的(req, res, next) => {...}
  const author = ctx.session.username
  const body = ctx.request.body
  body.author = author
  const data = await newBlog(body)
  ctx.body = new SuccessModel(data)
  return
  // ctx.body = new SuccessModel(data)
  // return result.then( data => {
  //     res.json(
  //         new SuccessModel(data)
  //     )
  // })
})

router.post('/update', loginCheck, async (ctx, next) => {
  const val = await updateBlog(ctx.query.id, ctx.request.body)
      if(val) {
        ctx.body = new SuccessModel('更新博客成功')
      } else {
        ctx.body = new ErrorModel('更新博客失败')
      }
})

router.post('/del', loginCheck, async (ctx, next) => {
  const author = ctx.session.username
  const val  = await delBlog(ctx.query.id, author)
  if(val) {
    ctx.body = new SuccessModel('更新博客成功')
  } else {
    ctx.body = new ErrorModel('更新博客失败')
  }
})

module.exports = router
