const { ErrorModel } = require('../model/resModel')

// module.exports = (req, res, next) => {
module.exports = async (ctx, next) => {
    // 如果session里有username，认为是登录了
    // if (req.session.username) {
    if (ctx.session.username) {
            // next会执行下一个中间件,比如router.post('/new', ...}里的(req, res, next) => {...}
        await next()
        return
    }
    // 否则显示未登录
    ctx.body = new ErrorModel('未登录，不能进行下一步操作')
}