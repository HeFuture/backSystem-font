<template>
    <div>
        <el-dialog v-model="dialogFormVisible" :title="title" width="600" center :draggable="true">
            <span v-if="title == '下载文件'">您确定要下载这个文件吗？</span>
            <span v-else>请慎重操作，是否从列表删除该文件？该操作无法撤回</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button v-if="title == '下载文件'" type="success"
                        @click="changeClick(number, fileId);">下载文件</el-button>
                    <el-button v-else type="primary" @click="operationFiles">删除文件</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, onBeforeUnmount } from 'vue'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import { deleteFile, updateDownLoad, downLoadFile } from '@/api/files'
import { ElMessage } from 'element-plus';

// 控制弹窗开关
const dialogFormVisible = ref(false)
// 打开修改密码弹窗
const open = () => {
    dialogFormVisible.value = true
}

// 将方法传递给父组件
defineExpose({
    open
})
// 点击量
const number = ref()
// 标题
const title = ref()
// 获得父组件的 row 用户信息
const fileId = ref()
// 文件地址
const url = ref()
// 文件名
const name = ref()
bus.on('download', (row: any) => {
    console.log(row);
    title.value = '下载文件'
    fileId.value = row.id
    url.value = row.file_url
    number.value = row.downLoad_number
    name.value = row.file_name
})
bus.on('deletefile', (row: any) => {
    title.value = '删除文件'
    fileId.value = row.id
    name.value = row.file_name
})


// 接收父组件传递的方法
const emit = defineEmits(['success'])

// 删除产品信息
const operationFiles = async () => {
    if (title.value == '删除文件') {
        const res = await deleteFile(fileId.value, name.value)
        if (res.data.status == 0) {
            dialogFormVisible.value = false
            emit('success')
            ElMessage({
                message: '删除文件成功',
                type: 'success'
            })
        } else {
            ElMessage.error('删除文件失败')
            dialogFormVisible.value = false
        }
    }
}
// 下载文件
const changeClick = async (downLoad_number: number, id) => {
    await updateDownLoad(downLoad_number, id)
    const res = await downLoadFile(id) // 重要：告诉axios我们期望一个blob响应 
    console.log(res.data);
    dialogFormVisible.value = false

    // 创建一个blob URL
    const url = URL.createObjectURL(new Blob([res.data]));

    // 创建一个临时的a标签来触发下载  
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name.value); // 你可以设置你喜欢的文件名  

    // 触发下载  
    document.body.appendChild(link);
    link.click();

    // 清理  
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    emit('success')
}

// 假设这些是从props或data中获取的  
// const fileId = ref('some-file-id');
// const fileUrl = ref('https://example.com/path/to/your/file.pdf'); // 文件的URL  

// const downloadFile = async () => {
//     try {
//         const response = await axios({
//             method: 'get',
//             url: fileUrl.value,
//             responseType: 'blob', // 重要：告诉axios我们期望一个blob响应  
//         });

//         // 创建一个blob URL  
//         const url = URL.createObjectURL(new Blob([response.data]));

//         // 创建一个临时的a标签来触发下载  
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'downloaded_file.pdf'); // 你可以设置你喜欢的文件名  

//         // 触发下载  
//         document.body.appendChild(link);
//         link.click();

//         // 清理  
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     } catch (error) {
//         console.error('下载文件时发生错误:', error);
//         // 在这里添加错误处理逻辑  
//     }
// };

// 取消监听
onBeforeUnmount(() => {
    bus.all.clear()
})

</script>

<style scoped lang="scss">
.el-dialog {
    span {
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 600;
    }


}
</style>