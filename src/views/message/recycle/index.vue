<template>
    <bread_crumb ref="breadcrumb" :item="item"></bread_crumb>
    <div class="table-wrapped">
        <div class="table-common">
            <div class="table-top">
                <div class="table-content">
                    <el-table :data="tableData" style="width: 100%;" stripe>
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column label="信息主题" prop="message_title" />
                        <el-table-column label="所属类别" prop="message_category" />
                        <el-table-column label="发布部门" prop="message_publish_department" />
                        <el-table-column label="接收对象" prop="message_receipt_object" />
                        <el-table-column label="删除日期" prop="message_delete_time">
                            <template #default="{ row }">
                                <div>{{ row.message_delete_time?.slice(0, 10) }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="260" fixed="right">
                            <template #default="{ row }">
                                <el-button type="primary" @click="reNew(row)">恢复公告</el-button>
                                <el-button type="danger" @click="realDelete(row.id)">删除公告</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="table-fotter">
                <el-pagination :page-size="1" v-model:current-page="pageinationData.recycleCurrentpage"
                    :total="pageinationData.recycleTotal" layout="prev, pager, next"
                    :page-count="pageinationData.recycleCount" @current-change="recycleCurrentChange" />
            </div>
        </div>
    </div>
    <deleteP ref="deleteR" @success="changePageList"></deleteP>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue';
import bread_crumb from '@/components/bread_crumb.vue';
import { getRecycleMessageLength, returnRecycleListData } from '@/api/message'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import deleteP from '../components/delete.vue';

// 面包屑
const breadcrumb = ref()
// 将面包屑值传递给 bread_crumb 组件
const item = ref({
    first: '消息管理',
    second: '回收站'
})

// 绑定表格数据
const tableData = ref()
// 获取回收站列表
// const getrecycleList = async () => {
//     const res = await recycleList()
//     tableData.value = res.data
// }
// getrecycleList()

// 恢复和删除组件
const deleteR = ref()
// 点击恢复
const reNew = (row: any) => {
    bus.emit('renewID', row)
    deleteR.value.open()
}
// 点击删除
const realDelete = (id: number) => {
    bus.emit('realDelete', id)
    deleteR.value.open()
}


// 分页数据
const pageinationData = reactive({
    // 系统消息的总数
    recycleTotal: 1,
    // 系统消息列表总页数
    recycleCount: 1,
    // 系统消息列表当前所处页数
    recycleCurrentpage: 1,
})

// 获取回收站的页数
const getRecycleListlength = async () => {
    const res = await getRecycleMessageLength()
    pageinationData.recycleTotal = res.data.length
    // Math.ceil “向上取整”， 即小数部分直接舍去，并向正数部分进1
    pageinationData.recycleCount = Math.ceil(res.data.length / 10)
}
getRecycleListlength()

// 默认获取回收站第一页的数据
const getRecycleFirstPageList = async () => {
    const res = await returnRecycleListData(1)
    tableData.value = res.data
}
getRecycleFirstPageList()

// 系统回收站列表监听换页
const recycleCurrentChange = async (value: number) => {
    pageinationData.recycleCurrentpage = value
    const res = await returnRecycleListData(value)
    tableData.value = res.data
}

const changePageList = async () => {
    const res = await returnRecycleListData(pageinationData.recycleCurrentpage)
    tableData.value = res.data
    getRecycleListlength()
}

</script>

<style scoped lang="scss">
.table-wrapped {
    padding: 8px;
    height: calc(100vh - 101px);
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .table-common {
        padding: 0 40px;
        background: #fff;
    }

    .table-top {
        padding-top: 10px;
        display: flex;
        flex-direction: column;
    }

    .table-fotter {
        display: flex;
        justify-content: flex-end;
        background: #fff;
    }
}

:deep(.el-table .cell) {
    font-weight: 400;
}
</style>