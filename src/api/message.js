import instance from '@/http/index'

// 发布消息
export const publishMessage = data => {
    const { message_title, ...message_Level } = data
    return instance({
        url: '/msg/publishMessage',
        method: 'POST',
        data: {
            message_title, ...message_Level
        }
    })
}

// 获取公司公告列表
export const companyMessageList = () => {
    return instance({
        url: '/msg/companyMessageList',
        method: 'POST'
    })
}

// 获取系统消息列表
export const systemMessageList = () => {
    return instance({
        url: '/msg/systemMessageList',
        method: 'POST'
    })
}

// 编辑公告
export const editMessage = data => {
    const { message_title, ...id } = data
    return instance({
        url: '/msg/editMessage',
        method: 'POST',
        data: {
            message_title, ...id
        }
    })
}

// 根据发布部门获取消息
export const searchMessageByDepartment = message_publish_department => {
    return instance({
        url: '/msg/searchMessageByDepartment',
        method: 'POST',
        data: {
            message_publish_department
        }
    })
}

// 根据发布等级获取消息
export const searchMessageByLevel = message_Level => {
    return instance({
        url: '/msg/searchMessageByLevel',
        method: 'POST',
        data: {
            message_Level
        }
    })
}

// 获取公告/系统消息
export const getMessage = id => {
    return instance({
        url: '/msg/getMessage',
        method: 'POST',
        data: {
            id
        }
    })
}

// 更新点击率
export const updateclick = (message_click_number, id) => {
    return instance({
        url: '/msg/updateclick',
        method: 'POST',
        data: {
            message_click_number, id
        }
    })
}

// 初次删除
export const fisrtDelete = (id) => {
    return instance({
        url: '/msg/fisrtDelete',
        method: 'POST',
        data: {
            id
        }
    })
}

// 获取回收站的列表
export const recycleList = () => {
    return instance({
        url: '/msg/recycleList',
        method: 'POST',
    })
}
// 获取回收站的列表
export const getRecycleMessageLength = () => {
    return instance({
        url: '/msg/getRecycleMessageLength',
        method: 'POST',
    })
}
// 获取回收站的列表
export const returnRecycleListData = (page) => {
    return instance({
        url: '/msg/returnRecycleListData',
        method: 'POST',
        data: {
            page
        }
    })
}

// 还原初次删除操作
export const recover = (id) => {
    return instance({
        url: '/msg/recover',
        method: 'POST',
        data: {
            id
        }
    })
}

// 删除操作
export const deleteMessage = (id) => {
    return instance({
        url: '/msg/deleteMessage',
        method: 'POST',
        data: {
            id
        }
    })
}

// 获取公司公告总数
export const getCompanyMessageLength = () => {
    return instance({
        url: '/msg/getCompanyMessageLength',
        method: 'POST',
    })
}

// // 获取系统消息总数
export const getSystemMessageLength = () => {
    return instance({
        url: '/msg/getSystemMessageLength',
        method: 'POST',
    })
}

// 监听换页返回数据  公司公告
export const returnCompanyListData = (page) => {
    return instance({
        url: '/msg/returnCompanyListData',
        method: 'POST',
        data: {
            page
        }
    })
}

// 监听换页返回数据  系统消息
export const returnSystemListData = (page) => {
    return instance({
        url: '/msg/returnSystemListData',
        method: 'POST',
        data: {
            page
        }
    })
}