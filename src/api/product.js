import instance from '@/http/index'

// 创建产品
export const createProduct = data => {
    const { product_id, ...in_memo } = data
    return instance({
        url: '/pro/createProduct',
        method: 'POST',
        data: {
            product_id, ...in_memo
        }
    })
}

// 删除产品 product_id
export const deleteProduct = id => {
    return instance({
        url: '/pro/deleteProduct',
        method: 'POST',
        data: {
            id
        }
    })
}

// 编辑产品信息
export const editProduct = data => {
    const { product_name, ...id } = data
    return instance({
        url: '/pro/editProduct',
        method: 'POST',
        data: {
            product_name, ...id
        }
    })
}

// 获取产品列表
export const getProductList = () => {
    return instance({
        url: '/pro/getProductList',
        method: 'POST',
    })
}

// 产品申请出库
export const applyOutProduct = data => {
    const { id, ...apply_memo } = data
    return instance({
        url: '/pro/applyOutProduct',
        method: 'POST',
        data: {
            id, ...apply_memo
        }
    })
}

// 产品审核列表
export const applyProductList = () => {
    return instance({
        url: '/pro/applyProductList',
        method: 'POST',
    })
}

// 产品出库列表
export const auditProductList = () => {
    return instance({
        url: '/pro/auditProductList',
        method: 'POST',
    })
}

// 对产品撤回申请 id
export const withDrawApplyProduct = id => {
    return instance({
        url: '/pro/withDrawApplyProduct',
        method: 'POST',
        data: {
            id
        }
    })
}

// 产品审核
export const auditProduct = data => {
    const { id, ...product_out_number } = data
    return instance({
        url: '/pro/auditProduct',
        method: 'POST',
        data: {
            id, ...product_out_number
        }
    })
}

// 通过用户编号对产品进行搜索 product_id
export const searchProductForId = (product_id, page) => {
    return instance({
        url: '/pro/searchProductForId',
        method: 'POST',
        data: {
            product_id, page
        }
    })
}

// 通过出库申请编号 对产品进行搜索 product_out_id
export const searchProductForApplyId = (product_out_id, page) => {
    return instance({
        url: '/pro/searchProductForApplyId',
        method: 'POST',
        data: {
            product_out_id, page
        }
    })
}

// 通过出库编号对产品进行搜索 product_out_id
export const searchProductForOutId = (product_out_id, page) => {
    return instance({
        url: '/pro/searchProductForOutId',
        method: 'POST',
        data: {
            product_out_id, page
        }
    })
}

// 获取产品的总数 
export const getProductLength = () => {
    return instance({
        url: '/pro/getProductLength',
        method: 'POST',
    })
}

// 获取申请出库产品总数
export const getApplyProductLength = () => {
    return instance({
        url: '/pro/getApplyProductLength',
        method: 'POST',
    })
}

// 获取出库产品总数
export const getOutProductLength = () => {
    return instance({
        url: '/pro/getOutProductLength',
        method: 'POST',
    })
}

// 监听换页返回数据  产品页面
export const returnProductListData = page => {
    return instance({
        url: '/pro/returnProductListData',
        method: 'POST',
        data: {
            page
        }
    })
}

// 监听换页返回数据  申请出库页面
export const returnApplyProductListData = page => {
    return instance({
        url: '/pro/returnApplyProductListData',
        method: 'POST',
        data: {
            page
        }
    })
}

// 监听换页返回数据  出库页面
export const returnoutProductListData = page => {
    return instance({
        url: '/pro/returnoutProductListData',
        method: 'POST',
        data: {
            page
        }
    })
}