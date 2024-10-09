

import instance from '@/http/index'

// 登录记录
export const loginLog = (data) => {
    const { account, name, email } = data
    return instance({
        url: '/llog/loginLog',
        method: 'POST',
        data: {
            account, name, email
        }
    })
}

// 操作日志记录
export const operation = (operation_person, operation_content, operation_level) => {
    return instance({
        url: '/olog/operation',
        method: 'POST',
        data: {
            operation_person, operation_content, operation_level
        }
    })
}


// 返回登录日志列表
export const loginLogList = () => {
    return instance({
        url: '/llog/loginLogList',
        method: 'POST'
    })
}

// 搜索最近十条登录记录
export const searchloginLogList = (account) => {
    return instance({
        url: '/llog/searchloginLogList',
        method: 'POST',
        data: {
            account
        }
    })
}

// 返回操作日志列表
export const operationList = () => {
    return instance({
        url: '/olog/operationList',
        method: 'POST'
    })
}

// 搜索最近十条操作记录
export const searchoperationList = (operation_person) => {
    return instance({
        url: '/olog/searchoperationList',
        method: 'POST',
        data: {
            operation_person
        }
    })
}

// 返回登录日志列表长度
export const loginLoglength = () => {
    return instance({
        url: '/llog/loginLoglength',
        method: 'POST'
    })
}

// 返回操作日志列表长度
export const operationLength = () => {
    return instance({
        url: '/olog/operationLength',
        method: 'POST'
    })
}

// 监听换页返回数据  登录日志列表
export const returnLoginListData = (page) => {
    return instance({
        url: '/llog/returnLoginListData',
        method: 'POST',
        data: {
            page
        }
    })
}

// 监听换页返回数据  操作日志列表
export const returnOperationListData = (page) => {
    return instance({
        url: '/olog/returnOperationListData',
        method: 'POST',
        data: {
            page
        }
    })
}

// 清空登录日志列表 truncate
export const truncateLoginLogList = () => {
    return instance({
        url: '/llog/truncateLoginLogList',
        method: 'POST'
    })
}

// 清空操作日志列表 truncate
export const truncateOperationList = () => {
    return instance({
        url: '/olog/truncateOperationList',
        method: 'POST'
    })
}