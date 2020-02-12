const {exec, escape} = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = async (username, password) => {
    // controller的blog.js也要这么处理
    username = escape(username)
    // password = escape(password)
    // 生成加密密码
    password = genPassword(password)
    password = escape(password)

    //先使用假数据
    // if (username === 'zhangsan' && password === '123') {
    //     return true
    // }
    // return false
    // 有了 mysql 自带的 escape 会让参数自带单引号，可以直接用在sql语句中，其它函数加工后还需要sql语句给参数加上单引号
    // const sql = `select username, realname from users where username='${username}' and password='${password}';`
    const sql = `
        select username, realname from users where username=${username} and password=${password};
        `
    console.log('sql is ', sql)
    // return exec(sql).then(rows => {
    //     console.log('row[0] is ', rows[0])
    //     // 返回必须有值或空对象，不能为空否则为undefined
    //     return rows[0] || {}
    // })
    const row = await exec(sql)
    return row[0] || {}
}

module.exports = {
    login
}