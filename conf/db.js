// 获取环境变量
// process是nodejs提供的全局变量
const env = process.env.NODE_ENV 

// 配置,无需给MYSQL_CONF赋空值
let MYSQL_CONF
let REDIS_CONF


// 系统会根据你的部署自动计算是生产环境还是开发环境
if (env === 'dev') {
    // mysql
    MYSQL_CONF = {
    // 如果是线上用，就要写线上的地址
    host: 'localhost',
    user: 'root',
    // 密码要和workbench设置的一致
    // password: '123',
    password: '`1q`1q`1q',
    port: '3306',
    // 需要在workbench中执行use myblog
    // database: 'myblog_win'    
    database: 'myblog'    
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }

}

if (env === 'production') {
    // mysql
    MYSQL_CONF = {
        // 如果是线上用，就要写线上的地址
        host: 'localhost',
        user: 'root',
        // 密码要和workbench设置的一致
        password: '`1q`1q`1q',
        port: '3306',
        // 需要在workbench中执行use myblog
        database: 'myblog'    
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}