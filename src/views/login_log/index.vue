<template>
    <bread_crumb ref="breadcrumb" :item="item"></bread_crumb>
    <div class="table-wrapped">
        <div class="table-contents">
            <div class="table-top">
                <div class="table-header">
                    <div>
                        <el-input v-model="account" style="width: 240px" placeholder="输入账号搜索..." :prefix-icon="Search"
                            @input="searchloginLog" />
                    </div>
                    <div class="upload-wrapped">
                        <el-button type="danger" @click="clearList">清空登录日志</el-button>
                    </div>
                </div>
                <div class="table-content">
                    <el-table :data="tableData" style="width: 100%" stripe>
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column prop="account" label="账号" />
                        <el-table-column prop="name" label="名称" />
                        <el-table-column prop="email" label="邮箱/联系方式"></el-table-column>
                        <el-table-column prop="login_time" label="登录时间" width="180">
                            <template #default="{ row }">
                                <div>{{ row.login_time?.slice(0, 16) }}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="table-footer">
                <el-pagination :page-size="1" v-model:current-page="pageinationData.loginLogCurrentpage"
                    :total="pageinationData.loginLogTotal" layout="prev, pager, next"
                    :page-count="pageinationData.loginLogCount" @current-change="loginLogCurrentChange" />
            </div>
        </div>
    </div>
    <tips ref="tip" @success="getloginLogFirstPageList"></tips>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue';
import bread_crumb from '@/components/bread_crumb.vue';
// import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue';
// import { bus } from '@/utils/mitt';
import tips from '../login_log/components/tips.vue';
import { loginLoglength, returnLoginListData, searchloginLogList } from '@/api/loginLog'

// 面包屑
const breadcrumb = ref()
// 将面包屑值传递给 bread_crumb 组件
const item = ref({
    first: '登录日志'
})

// 绑定表格数据
const tableData = ref()

// 分页数据
const pageinationData = reactive({
    // 登录日志的总数
    loginLogTotal: 1,
    // 登录日志列表总页数
    loginLogCount: 1,
    // 登录日志列表当前所处页数
    loginLogCurrentpage: 1,
})

// 获取登录日志的页数
const getloginLogListlength = async () => {
    const res = await loginLoglength()
    pageinationData.loginLogTotal = res.data.length
    // Math.ceil “向上取整”， 即小数部分直接舍去，并向正数部分进1
    pageinationData.loginLogCount = Math.ceil(res.data.length / 10)
}
getloginLogListlength()

// 默认获取登录日志第一页的数据
const getloginLogFirstPageList = async () => {
    const res = await returnLoginListData(1)
    tableData.value = res.data
}
getloginLogFirstPageList()

// 系统登录日志监听换页
const loginLogCurrentChange = async (value: number) => {
    // pageinationData.currentpage = value
    const res = await returnLoginListData(value)
    tableData.value = res.data
}

const account = ref()
// 搜索最近十条登录日志记录  防抖处理
let timer = null; // 使用 let 而不是 var，以便在函数内部正确更新变量 
const searchloginLog = async () => {
    // 清除之前的定时器（如果存在）  
    if (timer !== null) {
        clearTimeout(timer);
    }
    // 检查 productId 的值 看用户是否输入入库编号
    if (account.value == null || account.value.trim() == '') {
        // 默认获取登录日志第一页的数据
        getloginLogFirstPageList()
    }
    else {
        // 否则，设置一个新的定时器 
        timer = setTimeout(async () => {
            const res = await searchloginLogList(account.value)
            tableData.value = res.data
        }, 300);  // 300 毫秒后执行
    }
}

// 调用files 的 tips组件
const tip = ref()
// 清空登录日志列表
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



:deep(.el-table .cell) {
    font-weight: 400;
}
</style>