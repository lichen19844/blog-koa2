const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

// const MYSQL_CONF = {
//     // 如果是线上用，就要写线上的地址
//     host: 'localhost',
//     user: 'root',
//     // 密码要和workbench设置的一致
//     password: '123',
//     port: '3306',
//     // 需要在workbench中执行use myblog
//     database: 'myblog_win'    
// }

// 创建连接对象
// con是单例模式，可以不用关闭mysql连接
const con = mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect()

// 统一执行 sql 语句，其中使用promise
function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if(err) {
                // console.log(err)
                reject(err)
                return
            }
            // console.log(result)
            resolve(result)
        })
    })
    return promise
}

// escape是npm包mysql里自带的方法，用于防止sql注入攻击
module.exports = {
    exec,
    escape: mysql.escape
}