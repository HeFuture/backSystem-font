
import instance from '@/http/index'

// 获得用户信息
export const getUserInfor = id => {
    return instance({
        url: '/user/getUserInfo',
        method: 'POST',
        data: {
            id
        }
    })
}

// 用onlyId绑定账号和头像
export const bingAccound = (account, onlyId, url) => {
    return instance({
        url: '/user/bingAccound',
        method: 'POST',
        data: {
            account, onlyId, url
        }
    })
}

// 修改密码 changePassword
export const changePassword = (id, oldPassword, newPassword) => {
    return instance({
        url: '/user/changePassword',
        method: 'POST',
        data: {
            id,
            oldPassword,
            newPassword
        }
    })
}

// 修改姓名 changeName
export const changeName = (id, name) => {
    return instance({
        url: '/user/changeName',
        method: 'POST',
        data: {
            id, name
        }
    })
}

// 修改邮箱 changeEmail
export const changeEmail = (id, email) => {
    return instance({
        url: '/user/changeEmail',
        method: 'POST',
        data: {
            email,
            id
        }
    })
}

// 修改性别 changeSex
export const changeSex = (id, sex) => {
    return instance({
        url: '/user/changeSex',
        method: 'POST',
        data: {
            id,
            sex
        }
    })
}


// --------------用户管理
// 添加管理员 createAdmin
export const createAdmin = data => {
    const { account, ...identity } = data
    return instance({
        url: '/user/createAdmin',
        method: 'POST',
        data: {
            account,
            ...identity
        }
    })
}

// 获取管理员列表 identity
export const getAdminList = identity => {
    return instance({
        url: '/user/getAdminList',
        method: 'POST',
        data: {
            identity
        }
    })
}

// 编辑管理员信息账号 id, name, sex, email, department  
export const editAdmin = data => {
    const { id, ...department } = data
    return instance({
        url: '/user/editAdmin',
        method: 'POST',
        data: {
            id, ...department
        }
    })
}

// 对管理员取消赋权  id
export const changeIdentitytoUser = id => {
    return instance({
        url: '/user/changeIdentitytoUser',
        method: 'POST',
        data: {
            id
        }
    })
}

// 对用户进行赋权 id  identity
export const changeIdentityToAdmin = (id, identity) => {
    return instance({
        url: '/user/changeIdentityToAdmin',
        method: 'POST',
        data: {
            identity,
            id
        }
    })
}

// 通过账号对用户进行搜索 account identity
export const searchUser = (account,identity) => {
    return instance({
        url: '/user/searchUser',
        method: 'POST',
        data: {
            account,
            identity
        }
    })
}

// 通过部门对用户进行搜索 department
export const searchDepartment = department => {
    return instance({
        url: '/user/searchUserbyDepartment',
        method: 'POST',
        data: {
            department
        }
    })
}

// 冻结用户 把 status 变成 1  id
export const banUser = id => {
    return instance({
        url: '/user/banUser',
        method: 'POST',
        data: {
            id
        }
    })
}

// 解冻用户 id
export const hotUser = id => {
    return instance({
        url: '/user/hotUser',
        method: 'POST',
        data: {
            id
        }
    })
}

// 获取冻结用户列表
export const getBanList = () => {
    return instance({
        url: '/user/getBanList',
        method: 'POST'
    })
}

// 删除用户 id account
export const delUser = (id, account) => {
    return instance({
        url: '/user/delUser',
        method: 'POST',
        data: {
            id, account
        }
    })
}

// 获取对应身份的总人数 identity
export const getAdminListLength = identity => {
    return instance({
        url: '/user/getAdminListLength',
        method: 'POST',
        data: {
            identity
        }
    })
}

// 监听换页返回数组 页码 page  identity
export const getAdminListData = (page, identity) => {
    return instance({
        url: '/user/getAdminListData',
        method: 'POST',
        data: {
            page, identity
        }
    })
}