// xss是npm包工具用于防止xss攻击
const xss = require('xss')
const {exec} = require('../db/mysql')
// xxx.html?a=1&k1=v1&k2=v2&k3=v3

const getList = async (author, keyword) => {
    //先返回假数据（格式是正确的）
    // return [
    //     {
    //         id: 1,
    //         title: '标题A',
    //         content: '内容A',
    //         createTime: '1555463056124',
    //         author: 'zhangsan'   
    //     },
    //     {
    //         id: 2,
    //         title: '标题B',
    //         content: '内容B',
    //         createTime: '1555463141822',
    //         author: 'lisi'   
    //     }
    // ]

    // 1=1是一个技巧 它的作用是占位，防止author\keyword等万一没有值，会导致where后面为空，语句报错，不写where也会报错
    // let sql = 'select id, title, content, author, createtime from blogs where 1=1 '
    // 注意最后的空格
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }

    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }

    sql += `order by createtime desc;`

    // // 返回 promise
    // return exec(sql)
    // 返回一个await
    return await exec(sql)
}

// blog详情和id有关
const getDetail = async (id) => {
    let sql = `select * from blogs where id ='${id}'`;
    // // exec函数是个promise
    // return exec(sql).then(rows => {
    //     console.log('rows is a array?', rows)
    //     console.log('rows[0] is a object? ', rows[0])
    //     // rows[0]会将所需数据处理成对象格式
    //     return rows[0]
    // })
    const rows = await exec(sql)
    return rows[0]
    
    // 先返回假数据
    // return {
    //     id: 1,
    //     title: '标题A',
    //     content: '内容A',
    //     createTime: '1555463056124',
    //     author: 'zhangsan'   
    // }
}

// blogData = {} 表示如果没有blogData，就赋给它一个空对象，实际会用postman来添加blogData数据
const newBlog = async (blogData = {}) => {
    // blogData实际代表了req.body
    // blogData 是由路由收集到的博客对象，包含 title content author属性
    console.log('newBlog blogData...', blogData)
    const title = xss(blogData.title);
    console.log('title is ', title)
    const content = xss(blogData.content);
    const author = blogData.author;
    const createtime = Date.now();

    const sql = `
        insert into blogs (title, content, author, createtime) 
        values ('${title}', '${content}', '${author}', ${createtime});
    `
    // return exec(sql).then(insertData => {
    //     // inserData中的affectedRows是指影响行数，是重要的参考参数
    //     console.log('insertData is ', insertData)
    //     return {
    //         // insertId是由exec的con.query所生成
    //         id: insertData.insertId
    //     }
    // })
    // // return {
    // //     id: 3 // 表示新建博客，插入到数据表里面的 id
    // // }
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

const updateBlog = async (id, blogData = {}) => {
    // blogData 是由路由收集到的博客对象，包含 title content 属性
    // id 就是要更新博客的 id
    console.log('update blog', id, blogData)
    const title = xss(blogData.title);
    const content = xss(blogData.content);
    const sql = `
        update blogs set title='${title}',  content='${content}' where id=${id};
    `
    // return exec(sql).then(updateData => {
    //     console.log('updateData is ', updateData)
    //     if(updateData.affectedRows > 0) {
    //         return true
    //     }
    //     return false
    // })
    // // return true
    // // return false
    const updateData = await exec(sql)
        if(updateData.affectedRows > 0) {
            return true
        }
        return false
}

const delBlog = async (id, author) => {
    // id 就是要删除博客的 id
    console.log('delete blog', id)
    const sql = `delete from blogs where id=${id} and author='${author}';`
    // return exec(sql).then(delData => {
    //     console.log('delData is ', delData)
    //     if(delData.affectedRows > 0) {
    //         return true
    //     }
    //     return false
    // })
    // // return true
    const delData = await exec(sql)
    if(delData.affectedRows > 0) {
        return true
    }
    return false
}

// 返回对象的原因是还会有不同作用的数据要返回
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
