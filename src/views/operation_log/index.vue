<template>
    <bread_crumb ref="breadcrumb" :item="item"></bread_crumb>
    <div class="table-wrapped">
        <div class="table-contents">
            <div class="table-top">
                <div class="table-header">
                    <div>
                        <el-input v-model="operation_person" style="width: 240px" placeholder="输入操作者进行搜索..."
                            :prefix-icon="Search" @input="searchOperation" />
                    </div>
                    <div class="upload-wrapped">
                        <el-button type="danger" @click="clearList">清空操作日志</el-button>
                    </div>
                </div>
                <div class="table-content">
                    <el-table :data="tableData" style="width: 100%" stripe>
                        <el-table-column prop="operation_person" label="操作者">
                            <template #default="{ row }">
                                <div :class="level(row.operation_level)">
                                    <span class="person">{{ row.operation_person }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operation_content" label="操作内容" />
                        <el-table-column prop="operation_level" label="操作等级">
                            <template #default="{ row }">
                                <el-tag class="ml-2" :type="level(row.operation_level)">
                                    {{ row.operation_level }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operation_time" label="操作时间" width="180">
                            <template #default="{ row }">
                                <div>{{ row.operation_time?.slice(0, 16) }}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="table-footer">
                <el-pagination :page-size="1" v-model:current-page="pageinationData.operationCurrentpage"
                    :total="pageinationData.operationTotal" layout="prev, pager, next"
                    :page-count="pageinationData.operationCount" @current-change="operationCurrentChange" />
            </div>
        </div>
    </div>
    <tips ref="tip" @success="getoperationFirstPageList"></tips>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue';
import bread_crumb from '@/components/bread_crumb.vue';
// import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue';
// import { bus } from '@/utils/mitt';
import tips from '../operation_log/components/tips.vue';
import { operationLength, returnOperationListData, searchoperationList } from '@/api/loginLog'

// 面包屑
const breadcrumb = ref()
// 将面包屑值传递给 bread_crumb 组件
const item = ref({
    first: '操作日志'
})

// 绑定表格数据
const tableData = ref()

// 分页数据
const pageinationData = reactive({
    // 操作日志的总数
    operationTotal: 1,
    // 操作日志列表总页数
    operationCount: 1,
    // 操作日志列表当前所处页数
    operationCurrentpage: 1,
})

// 获取操作日志的页数
const getoperationListlength = async () => {
    const res = await operationLength()
    pageinationData.operationTotal = res.data.length
    // Math.ceil “向上取整”， 即小数部分直接舍去，并向正数部分进1
    pageinationData.operationCount = Math.ceil(res.data.length / 10)
}
getoperationListlength()

// 默认获取操作日志第一页的数据
const getoperationFirstPageList = async () => {
    const res = await returnOperationListData(1)
    tableData.value = res.data
}
getoperationFirstPageList()

// 系统操作日志监听换页
const operationCurrentChange = async (value: number) => {
    // pageinationData.currentpage = value
    const res = await returnOperationListData(value)
    tableData.value = res.data
}

const operation_person = ref()
// 搜索最近十条操作记录  防抖处理
let timer = null; // 使用 let 而不是 var，以便在函数内部正确更新变量 
const searchOperation = async () => {
    // 清除之前的定时器（如果存在）  
    if (timer !== null) {
        clearTimeout(timer);
    }
    // 检查 productId 的值 看用户是否输入入库编号
    if (operation_person.value == null || operation_person.value.trim() == '') {
        // 默认获取操作日志第一页的数据
        getoperationFirstPageList()
    }
    else {
        // 否则，设置一个新的定时器 
        timer = setTimeout(async () => {
            const res = await searchoperationList(operation_person.value)
            tableData.value = res.data
        }, 300);  // 300 毫秒后执行
    }
}

// 操作等级
const level = (level: string) => {
    if (level == '高级') {
        return 'danger'
    }
    if (level == '中级') {
        return 'warning'
    }
    if (level == '低级') {
        return 'normal'
    }
}

// 调用files 的 tips组件
const tip = ref()
// 清空操作日志列表
const clearList = () => {
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

.person{
    margin-left: 8px;
}
.danger{
    border-left: 2px solid red;
}
.warning{
    border-left: 2px solid lightpink;
}
.normal{
    border-left: 2px solid lightblue;
}

:deep(.el-table .cell) {
    font-weight: 400;
}
</style>