

import instance from '@/http/index'

// 获取部门消息id列表 id, department
export const getDepartmentMsg = (id, department) => {
    return instance({
        url: '/dm/getDepartmentMsg',
        method: 'POST',
        data: {
            id, department
        }
    })
}

// 获取部门消息
export const getDepartmentMsgList = (department) => {
    return instance({
        url: '/dm/getDepartmentMsgList',
        method: 'POST',
        data: {
            department
        }
    })
}

// 返回用户的阅读列表
export const getReadListAndStatus = (id) => {
    return instance({
        url: '/dm/getReadListAndStatus',
        method: 'POST',
        data: {
            id
        }
    })
}

// 用户点击消息后对 read_list 内的数据进行删减  参数：消息id、用户id
export const clickDelete = (id, readid) => {
    return instance({
        url: '/dm/clickDelete',
        method: 'POST',
        data: {
            id, readid
        }
    })
}

// 把新发布文章的 id 插入到当前所属部门的用户的 read_list 中 
export const changeUserReadList = (department, newId) => {
    return instance({
        url: '/dm/changeUserReadList',
        method: 'POST',
        data: {
            department, newId
        }
    })
}

// 把删除文章的 id 从当前所属部门的用户的 read_list 中删除
export const changeUserReadListButDelete = (department, deleteId) => {
    return instance({
        url: '/dm/changeUserReadListButDelete',
        method: 'POST',
        data: {
            department, deleteId
        }
    })
}