
import instance from '@/http/index'

// 绑定上传者
export const bindFileAndUser = (name, url) => {
    return instance({
        url: '/file/bindFileAndUser',
        method: 'POST',
        data: {
            name, url
        }
    })
}

// 更新下载量
export const updateDownLoad = (downLoad_number, id) => {
    return instance({
        url: '/file/updateDownLoad',
        method: 'POST',
        data: {
            downLoad_number, id
        }
    })
}

// 下载文件
export const downLoadFile = (id) => {
    return instance({
        url: '/file/downLoadFile',
        method: 'POST',
        data: {
            id
        },
        responseType:'blob' // 重要：告诉axios我们期望一个blob响应 
    })
}

// 获取文件列表
export const fileList = () => {
    return instance({
        url: '/file/fileList',
        method: 'POST',

    })
}

// 获取文件列表总数
export const fileListLength = (id) => {
    return instance({
        url: '/file/fileListLength',
        method: 'POST',
        data: {
            id
        }
    })
}

// 监听换页返回数据  文件列表
export const returnFilesListData = (page) => {
    return instance({
        url: '/file/returnFilesListData',
        method: 'POST',
        data: {
            page
        }
    })
}

// 搜索文件
export const searchFile = (file_name) => {
    return instance({
        url: '/file/searchFile',
        method: 'POST',
        data: {
            file_name
        }
    })
}

// 删除文件
export const deleteFile = (id,file_name) => {
    return instance({
        url: '/file/deleteFile',
        method: 'POST',
        data: {
            id,file_name
        }
    })
}

