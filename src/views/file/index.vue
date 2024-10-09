<template>
    <bread_crumb ref="breadcrumb" :item="item"></bread_crumb>
    <div class="table-wrapped">
        <div class="table-contents">
            <div class="table-top">
                <div class="table-header">
                    <div></div>
                    <div class="upload-wrapped">
                        <el-upload v-model:file-list="fileList" class="upload-demo"
                            action="http://localhost:3000/file/uploadFile" multiple :on-success="handleSuccess"
                            :limit="3" :on-exceed="handleExceed" :show-file-list="false" ref="uploadrefss">
                            <el-button type="primary">上传文件</el-button>
                        </el-upload>
                    </div>
                </div>
                <div class="table-content">
                    <el-table :data="tableData" style="width: 100%" stripe>
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column prop="file_name" label="文件名" />
                        <el-table-column prop="file_size" label="文件大小">
                            <template #default="{ row }">
                                <div>{{ row.file_size?.slice(0, 2) }}KB</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="upload_person" label="上传者" />
                        <el-table-column prop="downLoad_number" label="下载次数" />
                        <el-table-column prop="upload_time" label="上传时间" width="180">
                            <template #default="{ row }">
                                <div>{{ row.upload_time?.slice(0, 10) }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="260">
                            <template #default="{ row }">
                                <el-button type="success" @click="download(row)">下载</el-button>
                                <el-button type="danger" @click="deletefile(row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="table-footer">
                <el-pagination :page-size="1" v-model:current-page="pageinationData.fileleCurrentpage"
                    :total="pageinationData.fileleTotal" layout="prev, pager, next"
                    :page-count="pageinationData.fileleCount" @current-change="fileleCurrentChange" />
            </div>
        </div>
    </div>
    <tips ref="tip" @success="changePageList"></tips>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue';
import bread_crumb from '@/components/bread_crumb.vue';
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { fileListLength, returnFilesListData, bindFileAndUser } from '@/api/files'
import { bus } from '@/utils/mitt';
import tips from './components/tips.vue';

// 面包屑
const breadcrumb = ref()
// 将面包屑值传递给 bread_crumb 组件
const item = ref({
    first: '文件管理'
})

// 绑定表格数据
const tableData = ref()
// 默认上传文件
const fileList = ref<UploadUserFile[]>([

])
// 当超出限制时，执行的钩子函数
const handleExceed: UploadProps['onExceed'] = () => {
    ElMessage.error('最多上传三个文件')
}
const uploadrefss = ref()
// 文件上传成功时的钩子  response:回应（里面是后端返回的数据）
const handleSuccess = (response: any) => {
    // 上传成功时，绑定上传者
    if (response.status == 0) {
        (async () => {
            await bindFileAndUser(localStorage.getItem('name'), response.url)
            // 函数自调用
        })()
        // 文件上传成功后 清空上传文件（由于设置了上传列表限制3个）
        uploadrefss.value.clearFiles()
        ElMessage({
            message: '上传文件成功',
            type: 'success'
        })
        getfileleFirstPageList()
    } else {
        ElMessage.error('文件上传失败，请检查网络')
    }
}


// 分页数据
const pageinationData = reactive({
    // 系统消息的总数
    fileleTotal: 1,
    // 系统消息列表总页数
    fileleCount: 1,
    // 系统消息列表当前所处页数
    fileleCurrentpage: 1,
})

// 获取文件的页数
const getfileleListlength = async () => {
    const res = await fileListLength()
    pageinationData.fileleTotal = res.data.length
    // Math.ceil “向上取整”， 即小数部分直接舍去，并向正数部分进1
    pageinationData.fileleCount = Math.ceil(res.data.length / 10)
}
getfileleListlength()

// 默认获取文件列表第一页的数据
const getfileleFirstPageList = async () => {
    const res = await returnFilesListData(1)
    tableData.value = res.data
}
getfileleFirstPageList()

// 系统文件列表监听换页
const fileleCurrentChange = async (value: number) => {
    pageinationData.fileleCurrentpage = value
    const res = await returnFilesListData(value)
    tableData.value = res.data
}

const changePageList = async () => {
    const res = await returnFilesListData(pageinationData.fileleCurrentpage)
    tableData.value = res.data
    getfileleListlength()
}

// 下载和删除函数
const tip = ref()
const download = (row: any) => {
    bus.emit('download', row)
    tip.value.open()
}
const deletefile = (row: any) => {
    bus.emit('deletefile', row)
    tip.value.open()
}
</script>

<style scoped lang="scss">
.table-wrapped {
    padding: 8px;
    height: calc(100vh - 85px);
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .table-contents {
        // padding: 0 40px;
        // height: 100%;
        background-color: #fff;

        .table-top {
            padding: 0 40px;
            display: flex;
            flex-direction: column;
            height: calc(100vh - 166px);
            background: #fff;

            .table-header {
                padding: 12px 20px 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 54px;
                background-color: #fff;
            }

            .table-content {
                min-height: 10px;
                padding: 10px 20px 20px;
                margin-bottom: 8px;
                background: #fff;
            }
        }

        .table-footer {
            padding: 26px 40px 8px;
            min-height: 10px;
            display: flex;
            justify-content: right;
            background: #fff;
        }
    }
}



:deep(.el-table .cell) {
    font-weight: 400;
}
</style>