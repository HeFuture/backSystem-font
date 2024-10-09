
import instance from '@/http/index'

// 获取所有轮播图 
export const getSwiper = () => {
    return instance({
        url: '/set/getSwiper',
        method: 'POST'
    })
}

// 获取公司名称 
export const getCompanyName = () => {
    return instance({
        url: '/set/getCompanyName',
        method: 'POST'
    })
}

// 修改公司名称  set_value
export const changeCompanyName = (set_value) => {
    return instance({
        url: '/set/changeCompanyName',
        method: 'POST',
        data: { set_value }
    })
}

// 编辑公司介绍  set_text   set_name
export const changeCompanyIntroduce = (set_text, set_name) => {
    return instance({
        url: '/set/changeCompanyIntroduce',
        method: 'POST',
        data: { set_text, set_name }
    })
}

// 获取公司介绍  set_name 
export const getCompanyIntroduce = (set_name) => {
    return instance({
        url: '/set/getCompanyIntroduce',
        method: 'POST',
        data: { set_name }
    })
}

// 获取所有公司信息
export const getAllCompanyIntroduce = () => {
    return instance({
        url: '/set/getAllCompanyIntroduce',
        method: 'POST'
    })
}

// 部门设置  set_value
export const setDepartment = (set_value) => {
    return instance({
        url: '/set/setDepartment',
        method: 'POST',
        data: { set_value }
    })
}

// 获取部门 
export const getDepartment = () => {
    return instance({
        url: '/set/getDepartment',
        method: 'POST'
    })
}

// 产品设置  set_value
export const setProduct = (set_value) => {
    return instance({
        url: '/set/setProduct',
        method: 'POST',
        data: { set_value }
    })
}

// 获取产品
export const getProduct = () => {
    return instance({
        url: '/set/getProduct',
        method: 'POST'
    })
}