class BaseModel {
    constructor(data, message) {
        if (typeof data === 'string') {
            this.message = data
            // 重新初始化
            data = null
            message = null
        }
        // data不是string，直接输出data
        if (data) {
            this.data = data
        }
        // 有message时输出到network中的response里
        if (message) {
            this.message = message
        }
    }
}

// 继承BaseModel
class SuccessModel extends BaseModel {
    constructor(data, message) {
        // super的作用是调用基类构造函数，并将data和message统一放到父类BaseModel中处理
        super(data, message)
        this.errno = 0
        console.log('resModel this is 整个SuccessModel对象', this)
    }   
}

class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = -1
        console.log('resModel this is 整个ErrorModel对象', this)
    }   
}

// 父类BaseModel不用输出
module.exports = {
    SuccessModel,
    ErrorModel
}