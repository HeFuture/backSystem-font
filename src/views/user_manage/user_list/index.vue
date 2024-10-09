<template>
    <bread_crumb ref="breadcrumb" :item="item"></bread_crumb>
    <div class="table-wrapped">
        <!-- 顶部 -->
        <div class="table-top">
            <!-- 表格顶部 -->
            <div class="table-header">
                <!-- 搜索框 -->
                <div class="left-wrapped">
                    <div class="search-wrapped">
                        <el-input v-model="adminAccount" style="width: 240px" placeholder="输入账号进行搜索..."
                            :prefix-icon="Search" @input="searchuser" />
                    </div>
                    <div class="select-wrapped">
                        <el-select v-model="department" placeholder="请选择部门" clearable @change="serachFormDepartment"
                            @clear="clearOperation">
                            <el-option :label="item" :value="item" v-for="item in departmentData" :key="item" />
                        </el-select>
                    </div>
                </div>

                <div class="button-wrapped">
                    <el-button type="primary" plain @click="banUserList">筛选冻结用户</el-button>
                    <el-button type="primary" plain @click="getFirstPageList">显示全部</el-button>
                </div>
            </div>
            <!-- 表格内容 -->
            <div class="table-content">
                <el-table :data="tableData" style="width: 100%;padding: 0 40px;" @cell-dblclick="openUseri">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="account" label="账号" />
                    <el-table-column prop="name" label="姓名" />
                    <el-table-column prop="sex" label="性别" />
                    <el-table-column prop="department" label="部门" />
                    <el-table-column prop="email" label="邮箱" />
                    <el-table-column prop="status" label="状态">
                        <template #default="{ row }">
                            <el-tag v-if="row.status == '1'" class="ml-2" type="danger">冻结</el-tag>
                            <el-tag v-else class="ml-2" type="success">正常</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间">
                        <template #default="{ row }">
                            <div>{{ row.create_time?.slice(0, 10) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="update_time" label="更新时间">
                        <template #default="{ row }">
                            <div>{{ row.update_time?.slice(0, 10) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="操作" width="270">
                        <template #default="{ row }">
                            <el-button type="primary" @click="banuser(row.id)"
                                :disabled="row.status == 1">冻结</el-button>
                            <el-button type="success" @click="hotuser(row.id)"
                                :disabled="row.status == 0">解冻</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </div>
        <!-- 底部 -->
        <div class=" table-fotter">
            <el-pagination :page-size="2" v-model:current-page="pageinationData.currentpage" layout="prev, pager, next"
                :page-count="pageinationData.pageCont" @current-change="currentChange" />
        </div>
    </div>
    <!-- 组件传递 getAdminlist 获取管理员列表方法 刷新页面 -->
    <!-- <create_admin ref="Create" @success="getFirstPageList"></create_admin>
    <edit_admin ref="Edit" @success="getFirstPageList"></edit_admin>
    <delete_admin @success="getFirstPageList"></delete_admin> -->
    <user_info ref="useri"></user_info>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue'
import bread_crumb from '@/components/bread_crumb.vue';
import { Search } from '@element-plus/icons-vue';
// import create_admin from '../components/create_admin.vue';
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt";
// import edit_admin from '../components/edit_admin.vue';
import { searchUser, searchDepartment, getAdminListLength, getAdminListData, getBanList, banUser, hotUser, getAdminList } from '@/api/userInfo';
// import delete_admin from '../components/delete_admin.vue';
import { getDepartment } from '@/api/setting';
import { ElMessage } from 'element-plus';
import user_info from '@/views/user_manage/components/user_info.vue'

// 面包屑
const breadcrumb = ref()
// 将面包屑值传递给 bread_crumb 组件
const item = ref({
    first: '用户管理',
    second: '用户列表'
})

// 绑定搜索框
const adminAccount = ref<string>()
// 表格数据
const tableData = ref([
    {
        id: 1,
        status: 0
    }
])

// 绑定部门选择框数据
const departmentData = ref([])
// 获取部门数据
const getdepartment = async () => {
    const res = await getDepartment()
    // JSON.parse 反序列化数据 
    departmentData.value = JSON.parse(res.data[0].set_value)
}
getdepartment()

// 清空选择框后获取所有用户
const clearOperation = async () => {
    getFirstPageList()
}

// 搜索用户
let timer = null; // 使用 let 而不是 var，以便在函数内部正确更新变量 
const searchuser = async () => {
    // 清除之前的定时器（如果存在）  
    if (timer !== null) {
        clearTimeout(timer);
    }
    if (adminAccount.value == null || adminAccount.value.trim() === '') {
        // 如果 adminAccount 为空或 null，则直接调用 getFirstPageList 获取第一页的数据
        // getFirstPageList()
        changeList()
        getAdminListlength()
    } else {
        // 否则，设置一个新的定时器 
        timer = setTimeout(async () => {
            const res = await searchUser(adminAccount.value, '用户')
            tableData.value = res.data
            pageinationData.pageCont = Math.ceil(res.data.length / 10)
        }, 400); // 500 毫秒后执行
    }
}

// 绑定选择框
const department = ref()
// 通过部门对用户进行搜索 department
const serachFormDepartment = async () => {
    if (department.value) {
        const res = await searchDepartment(department.value)
        tableData.value = res.data
    }

}

// 分页数据
const pageinationData = reactive({
    // 总页数
    pageCont: 0,
    // 当前所处页数
    currentpage: 1
})

// 存储用户数量
const adminTotal = ref<number>(0)
// 获取对应身份的总人数 identity
const getAdminListlength = async () => {
    const res = await getAdminListLength('用户')
    adminTotal.value = res.data.length
    // Math.ceil “向上取整”， 即小数部分直接舍去，并向正数部分进1
    pageinationData.pageCont = Math.ceil(res.data.length / 10)
}
getAdminListlength()

// 默认获取第一页的数据
const getFirstPageList = async () => {
    try {
        const res = await getAdminListData(1, '用户')
        tableData.value = res.data
    } catch (error) {
        console.error('getAdminListData接口错误:', error);
        // 可以设置一些错误处理逻辑，如显示错误消息 
    }

}
getFirstPageList()

// 监听换页
const currentChange = async (value: number) => {
    pageinationData.currentpage = value
    const res = await getAdminListData(value, '用户')
    tableData.value = res.data
}

// 封装一个根据当前页面获取数据的方法
const changeList = async () => {
    const res = await getAdminListData(pageinationData.currentpage, '用户')
    tableData.value = res.data
}

// 限制请求次数，防止过多请求
let requestCount = 0;
const maxRequestsPerMinute = 10;
// 筛选冻结用户
const banUserList = async () => {
    if (requestCount >= maxRequestsPerMinute) {
        ElMessage.error('请求过于频繁，请稍后再试。')
        return;
    }
    try {
        const res = await getBanList()
        tableData.value = res.data
    } catch (error) {
        console.error('getBanList接口错误:', error);
        // 可以设置一些错误处理逻辑，如显示错误消息 
    }
    requestCount++;
    setTimeout(() => {
        requestCount--;
    }, 6000); // 重置请求计数器的时间间隔
}

// 冻结用户 把 status 变成 1  id
const banuser = async (id: number) => {
    const res = await banUser(id)
    if (res.data.status == 0) {
        changeList()
        ElMessage({
            message: '用户已冻结',
            type: 'success'
        })
    }
}
// 解冻用户
const hotuser = async (id: number) => {
    const res = await hotUser(id)
    if (res.data.status == 0) {
        changeList()
        ElMessage({
            message: '用户已解冻',
            type: 'success'
        })
    }
}

// user_info 弹窗
const useri = ref()
const openUseri = (row: any) => {
    bus.emit('userId', row)
    useri.value.open()
}

// 接收promote的 值, 刷新页面
bus.on('offDialog', async (id: number) => {
    // 当前页数
    const current = pageinationData.currentpage
    if (id) {
        changeList()
        getAdminListlength()
    }
})
</script>

<style scoped lang="scss"></style>