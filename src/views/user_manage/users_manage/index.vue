<template>
    <bread_crumb ref="breadcrumb" :item="item"></bread_crumb>
    <div class="table-wrapped">
        <!-- 顶部 -->
        <div class="table-top">
            <!-- 表格顶部 -->
            <div class="table-header">
                <!-- 搜索框 -->
                <div class="search-wrapped">
                    <el-input v-model="adminAccount" style="width: 240px" placeholder="输入账号进行搜索..."
                        :prefix-icon="Search" @input="searchAdmin" />
                </div>
                <div class="button-wrapped">
                    <el-button type="primary" @click="openCreate(2)">添加用户管理员</el-button>
                </div>
            </div>
            <!-- 表格内容 -->
            <div class="table-content">
                <el-table :data="tableData" style="width: 100%;padding: 0 40px;">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="account" label="账号" />
                    <el-table-column prop="name" label="姓名" />
                    <el-table-column prop="department" label="部门" />
                    <el-table-column prop="email" label="邮箱" />
                    <el-table-column prop="name" label="操作">
                        <template #default="{ row }">
                            <el-button type="success" @click="openEditAdmin(row.id)">编辑</el-button>
                            <el-button type="danger" @click="openDelete(row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 底部 -->
        <div class="table-fotter">
            <el-pagination :page-size="10" v-model:current-page="pageinationData.currentpage" layout="prev, pager, next"
                :page-count="pageinationData.pageCont" @current-change="currentChange" />
        </div>
    </div>
    <!-- 组件传递 getAdminlist 获取管理员列表方法 刷新页面 -->
    <create_admin ref="Create"></create_admin>
    <edit_admin ref="Edit"></edit_admin>
    <delete_admin ref="Del"></delete_admin>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue'
import bread_crumb from '@/components/bread_crumb.vue';
import { Search } from '@element-plus/icons-vue'
import create_admin from '../components/create_admin.vue';
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import edit_admin from '../components/edit_admin.vue';
import delete_admin from '../components/delete_admin.vue';
import { getAdminList, searchUser, getAdminListLength, getAdminListData } from '@/api/userInfo';

// 面包屑
const breadcrumb = ref()
// 将面包屑值传递给 bread_crumb 组件
const item = ref({
    first: '用户管理',
    second: '用户管理员'
})


// 表格数据
const tableData = ref([])

// 绑定搜索框
const adminAccount = ref<string>()

// 搜索用户
let timer = null; // 使用 let 而不是 var，以便在函数内部正确更新变量 
const searchAdmin = async () => {
    // 清除之前的定时器（如果存在）  
    if (timer !== null) {
        clearTimeout(timer);
    }
    if (adminAccount.value == null || adminAccount.value.trim() === '') {
        // 如果 adminAccount 为空或 null，则直接调用 getFirstPageList 获取第一页的数据
        getFirstPageList()
        getAdminListlength()
    } else {
        // 否则，设置一个新的定时器 
        timer = setTimeout(async () => {
            const res = await searchUser(adminAccount.value, item.value.second)
            tableData.value = res.data
            pageinationData.pageCont = Math.ceil(res.data.length / 10)
        }, 400); // 500 毫秒后执行
    }

}

// 分页数据
const pageinationData = reactive({
    // 总页数
    pageCont: 0,
    // 当前所处页数
    currentpage: 1
})

// 存储管理员数量
const adminTotal = ref<number>(0)
// 获取对应身份的总人数 identity
const getAdminListlength = async () => {
    const res = await getAdminListLength('用户管理员')
    adminTotal.value = res.data.length
    // Math.ceil “向上取整”， 即小数部分直接舍去，并向正数部分进1
    pageinationData.pageCont = Math.ceil(res.data.length / 10)
}
getAdminListlength()

// 默认获取第一页的数据
const getFirstPageList = async () => {
    const res = await getAdminListData(1, '用户管理员')
    tableData.value = res.data
}
getFirstPageList()

// 监听换页
const currentChange = async (value: number) => {
    pageinationData.currentpage = value
    const res = await getAdminListData(value, '用户管理员')
    tableData.value = res.data
}


// 接收create_admin的 值, 刷新页面
bus.on('adminDialogOff', async (id: number) => {
    // 当前页数
    const current = pageinationData.currentpage
    // 创建管理员
    if (id == 1) {
        const res = await getAdminListData(pageinationData.currentpage, '用户管理员')
        tableData.value = res.data
    }
    // 编辑管理员
    else if (id == 2) {
        const res = await getAdminListData(pageinationData.currentpage, '用户管理员')
        tableData.value = res.data
    }
    // 对管理员降职
    else if (id == 3) {
        const res = await getAdminListData(pageinationData.currentpage, '用户管理员')
        tableData.value = res.data
        getAdminListlength()
    }
})


// 绑定创建用户框
const Create = ref()
// 打开子组件用户框
const openCreate = (id: number) => {
    bus.emit('createId', id)
    Create.value.open()
}

// 绑定编辑用户弹窗
const Edit = ref()
const openEditAdmin = (id: number) => {
    bus.emit('editId', id)
    Edit.value.open()
}

// 绑定降低用户权限
const Del = ref()
// 降级管理员权限
const openDelete = (id: number) => {
    bus.emit('deleteId', id)
    Del.value.open()
}
</script>

<style scoped lang="scss"></style>