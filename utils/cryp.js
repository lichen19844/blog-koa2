// 是nodejs自带的加密库
const crypto = require('crypto')

// 密匙
// const SECRET_KEY = '!QA2ws#ED4rf'
const SECRET_KEY = '!QA2ws#ED4rf'

// md5 加密
function md5(content) {
    // createHash方法，使用md5加密模式
    let md5 = crypto.createHash('md5')
    // digest是把输出变成16进制的方式
    return md5.update(content).digest('hex')
}

// 加密函数
function genPassword(password) {
    // 拼接字符串，拼接方式可以任意
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

// 测试一下
// const result = genPassword('123')
// console.log(result)

module.exports = {
    genPassword
}